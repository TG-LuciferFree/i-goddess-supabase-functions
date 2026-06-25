import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN_BOGINIA") || "";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number; username?: string };
    from: { id: number; first_name: string; username?: string };
    text?: string;
    photo?: Array<{ file_id: string }>;
  };
  callback_query?: {
    id: string;
    from: { id: number; first_name: string };
    chat_instance: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
}

interface UserState {
  chat_id: number;
  user_id: number;
  username: string;
  lang: string;
  step: string;
  data: Record<string, any>;
}

// In-memory user states (replace with Supabase in production)
const userStates = new Map<number, UserState>();

// Translations
const translations: Record<string, Record<string, string>> = {
  ru: {
    welcome: "Добро пожаловать в I am Goddess!\n\nВыбери язык / Choose your language:",
    choose_lang_ru: "🇷🇺 Русский",
    choose_lang_en: "🇬🇧 English",
    choose_type: "*I am Goddess — Клуб избранных*\n\nЧто тебя интересует?",
    btn_member: "👑 Стать членом клуба",
    btn_contestant: "🌹 Подать заявку на конкурс",
    btn_partner: "🤝 Партнёрство",
    btn_investor: "💼 Инвестор",
    ask_name: "Как тебя зовут?",
    ask_city: "Из какого ты города?",
    ask_phone: "Оставь свой номер телефона 📱",
    thanks: "✨ Спасибо! Твоя заявка принята.\n\nНаш куратор свяжется с тобой в течение 24 часов.",
    payment_qr: "🎯 Спасибо за заявку!\n\nДля завершения вступления, пожалуйста, произведите оплату по QR коду ниже:",
    payment_invoice: "🏢 Спасибо за заявку!\n\nСчёт на оплату отправлен на вашу почту.",
    payment_confirm: "✅ Оплачено",
  },
  en: {
    welcome: "Welcome to I am Goddess!\n\nChoose your language / Выбери язык:",
    choose_lang_ru: "🇷🇺 Русский",
    choose_lang_en: "🇬🇧 English",
    choose_type: "*I am Goddess — Club of the Chosen*\n\nWhat interests you?",
    btn_member: "👑 Become a Club Member",
    btn_contestant: "🌹 Apply for the Contest",
    btn_partner: "🤝 Partnership",
    btn_investor: "💼 Investor",
    ask_name: "What is your name?",
    ask_city: "What city are you from?",
    ask_phone: "Leave your phone number 📱",
    thanks: "✨ Thank you! Your application has been received.\n\nOur curator will contact you within 24 hours.",
    payment_qr: "🎯 Thank you for your application!\n\nPlease scan the QR code below to complete payment:",
    payment_invoice: "🏢 Thank you for your application!\n\nAn invoice has been sent to your email.",
    payment_confirm: "✅ Paid",
  },
};

async function sendMessage(
  chatId: number,
  text: string,
  options?: Record<string, any>
) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...options,
  };

  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response.json();
}

async function sendPhoto(
  chatId: number,
  photo: string,
  caption?: string
) {
  const payload = {
    chat_id: chatId,
    photo,
    caption,
    parse_mode: "Markdown",
  };

  const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response.json();
}

async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string
) {
  const payload = {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  };

  return fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function getKeyboard(buttons: string[][], oneTime = true) {
  return {
    keyboard: buttons,
    one_time_keyboard: oneTime,
    resize_keyboard: true,
  };
}

function getInlineKeyboard(buttons: Array<Array<{ text: string; callback_data: string }>>) {
  return {
    inline_keyboard: buttons,
  };
}

async function handleStart(update: TelegramUpdate) {
  const message = update.message!;
  const chatId = message.chat.id;
  const userId = message.from.id;
  const username = message.from.username || `user_${userId}`;

  // Initialize user state
  userStates.set(chatId, {
    chat_id: chatId,
    user_id: userId,
    username,
    lang: "ru",
    step: "lang_select",
    data: {},
  });

  // Send welcome message with language selection
  const buttons = [
    [
      { text: "🇷🇺 Русский", callback_data: "lang_ru" },
      { text: "🇬🇧 English", callback_data: "lang_en" },
    ],
  ];

  await sendMessage(
    chatId,
    translations.ru.welcome,
    { reply_markup: getInlineKeyboard(buttons) }
  );
}

async function handleCallbackQuery(update: TelegramUpdate) {
  const query = update.callback_query!;
  const chatId = query.message!.chat.id;
  const data = query.data || "";

  const state = userStates.get(chatId) || {
    chat_id: chatId,
    user_id: query.from.id,
    username: query.from.username || `user_${query.from.id}`,
    lang: "ru",
    step: "lang_select",
    data: {},
  };

  // Handle language selection
  if (data.startsWith("lang_")) {
    state.lang = data.split("_")[1];
    state.step = "type_select";
    userStates.set(chatId, state);

    const t = translations[state.lang];
    const buttons = [
      [{ text: t.btn_member, callback_data: "type_member" }],
      [{ text: t.btn_contestant, callback_data: "type_contestant" }],
      [{ text: t.btn_partner, callback_data: "type_partner" }],
      [{ text: t.btn_investor, callback_data: "type_investor" }],
    ];

    await sendMessage(
      chatId,
      t.choose_type,
      { reply_markup: getInlineKeyboard(buttons) }
    );
  }

  // Handle type selection
  if (data.startsWith("type_")) {
    const type = data.split("_")[1];
    state.data.type = type;
    state.step = "get_name";
    userStates.set(chatId, state);

    const t = translations[state.lang];
    await sendMessage(chatId, t.ask_name, {
      reply_markup: { remove_keyboard: true },
    });
  }

  await answerCallbackQuery(query.id);
}

async function handleMessage(update: TelegramUpdate) {
  const message = update.message!;
  const chatId = message.chat.id;
  const text = message.text || "";

  let state = userStates.get(chatId);
  if (!state) {
    await handleStart(update);
    return;
  }

  const t = translations[state.lang];

  // Handle name input
  if (state.step === "get_name") {
    state.data.name = text;
    state.step = "get_city";
    await sendMessage(chatId, t.ask_city);
  }
  // Handle city input
  else if (state.step === "get_city") {
    state.data.city = text;
    state.step = "get_phone";
    await sendMessage(chatId, t.ask_phone);
  }
  // Handle phone input
  else if (state.step === "get_phone") {
    state.data.phone = text;
    state.step = "completed";

    // Send thank you message
    await sendMessage(chatId, t.thanks);

    // Determine if physical or legal entity
    const isPhysical = ["member", "contestant"].includes(state.data.type);

    if (isPhysical) {
      // Send QR code for payment
      await sendMessage(chatId, t.payment_qr);
      // In production, send actual QR code image
      await sendPhoto(
        chatId,
        "https://i-goddess.com/qr-payment.png",
        "📱 Отсканируйте QR код для оплаты"
      );
    } else {
      // Send invoice message for legal entities
      await sendMessage(chatId, t.payment_invoice);
      const buttons = [[{ text: t.payment_confirm, callback_data: "payment_done" }]];
      await sendMessage(chatId, "Нажмите кнопку после оплаты:", {
        reply_markup: getInlineKeyboard(buttons),
      });
    }

    // Log to admins (in production, send to admin chat)
    console.log(`New lead: ${state.data.type} - ${state.data.name} (${state.data.phone})`);
  }

  userStates.set(chatId, state);
}

// Main handler
serve(async (req: Request) => {
  if (req.method === "POST") {
    try {
      const update: TelegramUpdate = await req.json();

      if (update.message?.text === "/start") {
        await handleStart(update);
      } else if (update.callback_query) {
        await handleCallbackQuery(update);
      } else if (update.message?.text) {
        await handleMessage(update);
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  }

  return new Response(JSON.stringify({ status: "Bot is running" }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
