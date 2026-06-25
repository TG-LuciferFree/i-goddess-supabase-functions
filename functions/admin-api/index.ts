// Supabase Edge Function: admin-api
// Handles admin panel requests: approval, rejection, QR display, invoice display
// Updates Google Sheets with approval status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const ADMIN_TOKEN = Deno.env.get("ADMIN_TOKEN") || "iag_admin_2026_change_me";
const SHEETS_API_KEY = Deno.env.get("SHEETS_API_KEY") || "";
const SHEETS_ID = "1Ycqe3deRlF2BqiVKmOIv0UjxClYHwnqBriG2wpBcHRs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AdminRequest {
  type: "summary" | "leads" | "errors" | "approve" | "reject" | "show_qr" | "show_invoice";
  token: string;
  sheet?: string;
  row?: number;
  contractType?: "physical" | "legal";
}

// Verify admin token
function verifyToken(token: string): boolean {
  return token === ADMIN_TOKEN;
}

// Get summary of all applications
async function getSummary() {
  try {
    // Query Supabase for counts
    const { data: sessions, error: sessionsError } = await supabase
      .from("bot_sessions")
      .select("*", { count: "exact", head: true });

    const { data: errors, error: errorsError } = await supabase
      .from("bot_errors")
      .select("*")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const counts = {
      "Постоянные члены": 0,
      "Кандидатки (конкурс)": 0,
      "Партнёры": 0,
      "Инвесторы": 0,
      "Амбассадоры": 0,
    };

    return {
      counts,
      activeSessions: sessions?.length || 0,
      errors24h: errors?.length || 0,
    };
  } catch (error) {
    console.error("Error getting summary:", error);
    return {
      counts: {},
      activeSessions: 0,
      errors24h: 0,
    };
  }
}

// Get leads from Google Sheets
async function getLeads(sheet: string) {
  try {
    // Fetch from Google Sheets API
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(sheet)}?key=${SHEETS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    return { rows };
  } catch (error) {
    console.error("Error getting leads:", error);
    return { rows: [] };
  }
}

// Get bot errors
async function getErrors() {
  try {
    const { data: errors, error } = await supabase
      .from("bot_errors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return { errors: errors || [] };
  } catch (error) {
    console.error("Error getting errors:", error);
    return { errors: [] };
  }
}

// Approve application and update Google Sheets
async function approveApplication(sheet: string, row: number, contractType: string) {
  try {
    // Update Google Sheets with approval status
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(sheet)}!A${row + 1}:Z${row + 1}?valueInputOption=RAW&key=${SHEETS_API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              // Update status column (assuming it's column 7)
              "Одобрено",
              new Date().toISOString(),
              contractType === "physical" ? "Договор отправлен" : "Счёт отправлен",
            ],
          ],
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Google Sheets update error: ${updateResponse.status}`);
    }

    return { success: true, message: "Application approved and updated in Google Sheets" };
  } catch (error) {
    console.error("Error approving application:", error);
    return { success: false, error: error.message };
  }
}

// Reject application and update Google Sheets
async function rejectApplication(sheet: string, row: number) {
  try {
    // Update Google Sheets with rejection status
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(sheet)}!A${row + 1}:Z${row + 1}?valueInputOption=RAW&key=${SHEETS_API_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              // Update status column
              "Отклонено",
              new Date().toISOString(),
              "Заявка отклонена",
            ],
          ],
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Google Sheets update error: ${updateResponse.status}`);
    }

    return { success: true, message: "Application rejected and updated in Google Sheets" };
  } catch (error) {
    console.error("Error rejecting application:", error);
    return { success: false, error: error.message };
  }
}

// Show QR code (placeholder)
async function showQR(telegramId: string) {
  return {
    success: true,
    message: "QR code sent to user",
    qrUrl: "https://i-goddess.com/qr-payment.png", // Placeholder
  };
}

// Show invoice (placeholder)
async function showInvoice(telegramId: string) {
  return {
    success: true,
    message: "Invoice sent to user",
    invoiceUrl: "https://i-goddess.com/invoice.pdf", // Placeholder
  };
}

serve(async (req: Request) => {
  // Enable CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const type = params.get("type") as AdminRequest["type"];
    const token = params.get("token") || "";

    // Verify token for all requests except summary
    if (type !== "summary" && !verifyToken(token)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let response;

    switch (type) {
      case "summary":
        response = await getSummary();
        break;

      case "leads": {
        const sheet = params.get("sheet") || "Постоянные члены";
        response = await getLeads(sheet);
        break;
      }

      case "errors":
        response = await getErrors();
        break;

      case "approve": {
        const sheet = params.get("sheet") || "";
        const row = parseInt(params.get("row") || "0");
        const contractType = params.get("contractType") || "physical";
        response = await approveApplication(sheet, row, contractType);
        break;
      }

      case "reject": {
        const sheet = params.get("sheet") || "";
        const row = parseInt(params.get("row") || "0");
        response = await rejectApplication(sheet, row);
        break;
      }

      case "show_qr": {
        const telegramId = params.get("telegram_id") || "";
        response = await showQR(telegramId);
        break;
      }

      case "show_invoice": {
        const telegramId = params.get("telegram_id") || "";
        response = await showInvoice(telegramId);
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(response), {
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
