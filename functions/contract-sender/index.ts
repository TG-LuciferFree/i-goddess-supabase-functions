// Supabase Edge Function: contract-sender
// Automatically sends signed contracts to users after admin approval
// Handles both physical persons and legal entities

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const TELEGRAM_BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
const TELEGRAM_BOT_TOKEN_BOGINIA = Deno.env.get("BOT_TOKEN_BOGINIA") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ContractSendRequest {
  telegramId: string;
  userName: string;
  entityType: "physical" | "legal";
  contractPath: string;
  botType: "iag" | "boginia";
}

// Send contract via Telegram
async function sendContractViaTelegram(
  telegramId: string,
  contractPath: string,
  userName: string,
  entityType: string,
  botToken: string
): Promise<boolean> {
  try {
    // Download contract from storage
    const { data, error } = await supabase.storage
      .from("contracts")
      .download(contractPath);

    if (error || !data) {
      throw new Error(`Failed to download contract: ${error?.message}`);
    }

    // Convert to base64
    const arrayBuffer = await data.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Send via Telegram Bot API
    const formData = new FormData();
    formData.append("chat_id", telegramId);
    formData.append("document", new Blob([arrayBuffer], { type: "application/pdf" }), "contract.pdf");
    formData.append("caption", `📄 Ваш подписанный договор\n\nИмя: ${userName}\nТип: ${entityType === "physical" ? "Физическое лицо" : "Юридическое лицо"}`);

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending contract via Telegram:", error);
    return false;
  }
}

// Send notification message before contract
async function sendNotificationMessage(
  telegramId: string,
  userName: string,
  entityType: string,
  botToken: string
): Promise<boolean> {
  try {
    const message = entityType === "physical"
      ? `✅ Ваша заявка одобрена!\n\n${userName}, ваш договор готов и отправлен ниже.\n\nСпасибо за вступление в клуб "I am Goddess"!`
      : `✅ Ваша заявка одобрена!\n\n${userName}, ваш договор готов и отправлен ниже.\n\nСпасибо за партнёрское сотрудничество с клубом "I am Goddess"!`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

// Update Google Sheets with contract sent status
async function updateSheetStatus(
  sheet: string,
  row: number,
  status: string
): Promise<boolean> {
  try {
    const SHEETS_API_KEY = Deno.env.get("SHEETS_API_KEY") || "";
    const SHEETS_ID = "1Ycqe3deRlF2BqiVKmOIv0UjxClYHwnqBriG2wpBcHRs";

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(sheet)}!A${row + 1}:Z${row + 1}?valueInputOption=RAW&key=${SHEETS_API_KEY}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: [[status, new Date().toISOString(), "Договор отправлен"]],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error updating sheet:", error);
    return false;
  }
}

serve(async (req: Request) => {
  // Enable CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ContractSendRequest;

    const {
      telegramId,
      userName,
      entityType,
      contractPath,
      botType,
    } = body;

    if (!telegramId || !contractPath) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Select correct bot token
    const botToken = botType === "boginia" ? TELEGRAM_BOT_TOKEN_BOGINIA : TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return new Response(JSON.stringify({ error: "Bot token not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send notification first
    await sendNotificationMessage(telegramId, userName, entityType, botToken);

    // Send contract
    const contractSent = await sendContractViaTelegram(
      telegramId,
      contractPath,
      userName,
      entityType,
      botToken
    );

    if (!contractSent) {
      return new Response(JSON.stringify({ error: "Failed to send contract" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update Google Sheets
    await updateSheetStatus("", 0, "Договор отправлен");

    return new Response(JSON.stringify({
      success: true,
      message: "Contract sent successfully",
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
