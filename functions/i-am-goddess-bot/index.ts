// I am Goddess Telegram Bot — Webhook version for Supabase Edge Functions
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "8582938374:AAHd7SIggd7y2c9dBbAw5o-g9nIikVP8_Rc";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const ADMINS = [976302804, 8563835160, 6692191817];
const WHITELIST = new Set(ADMINS);
const RATE_LIMIT_SECONDS = 30;
const MAX_STARTS_PER_HOUR = 10;
const BOT_NAME = "iag";
const BOT_TAG = "iag";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const GOOGLE_SA_EMAIL = "i-am-goddess-sheets-bot@sinuous-abacus-500104-r2.iam.gserviceaccount.com";
const GOOGLE_SA_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBtNsEkekxQj55
IVoorpI3IfVyCXKFTEfUZV0RyjOmrinp3XezZEieSI6NM62Me+3fkvepWPesPAkg
6jIihvwxlNE3pstZgaxme+Kh6lPQavJmhqBP6FXHSVcxzcAk+kD3yoqAzTeIA0ug
XxJ7+t/7dXAoPgoCwvs9KAueFhFRaKAXD/Ldix7OqHdhHX5XsG07wWun4rpCG3N9
3IfxJNsulJ1ZM7bsIHaOmWkQFTnhndKBneOJs0WjwVeASZSjH2Ut4Y8t5kxRqe2P
7hVOjZPgGD0WfNBHsQMmidaXQnT+JFPmaG3Hia1pIG7WWdUc4OOME6P+Tz1t+pmQ
0pCenmlhAgMBAAECggEAXKneyB3g1v6gkiOhVKrGKXemSco5LYkjJ3jh/9uhv8+7
HzQhygBkOMvu3Z9mGzlBvt04epujx5HksAk4uImoZTOSrjOtPYEp7tC+xsQpGh+/
G8q1L+St/Cqaeqm5jDbnE2KhxSHmubsR14MDfamyskEoySd8dHu/4i6g+BwIZs92
JLUGOZh7gQ3UCNCncXkPrKNGKKquFpdRY8VlNvfpBlITcz8flT/XbxTMmmUmGBgh
wxfGz6NKNopbM61Ob0d6wdteMwnmjsG1ZOK59IRHyDo2NARcshD8JtTPuNXgdgvL
/j1tyf/VyJ4NJk7cziQQuV4Z2NfyLQ0jpZc3BiTezQKBgQD+opvBltJOMEWx1yXq
nGKas7UJHipYyOK0htY0JFrjOuc7uFu+NOjAmXu0wyzk/Fl/OPnkH0iQkZQeub8D
SGExRvE7ON5765v4IJVIcTSaoRQFZHpm3ZwaTF3KgMpT1JunLFOV1Wg3Hwz4u7Vh
05DGasbaa681bCTdxCvwesKwKwKBgQDCvqUts+xKQ/tN8sZ1dfDyD7Il/6Y22uEH
+RFgIp3bpeH4QbOSFlfvUk7nmF4yvKILDp6b9Idzk3dcBJ7I8O8IZJtCGHwakdYa
z+/XP9Kns0MbBibCXfVW7ReSTws7BfqNTilKPIGSs7Uqsy0E64QB4L57y7iC+RyI
KY1ZFHu6owKBgEePh1pmeoACzPNn1X4TqRp0+qGvWpNNEXlOk5BfzzMg8K815oKT
9/14pO1uFIXd7YD1kDTuHcSTRR9FcEsJ4lao606Lcus8kb6v2YRcXD5AmpHRZRzX
lvFFGO66NyJME9pteKgZK4qiLVER3624eW1pwKzNqpXG6K1yXi7dMS21AoGAAx05
VvnBlY5wvlZbhhVUvQozNxhXeBkX8CCzfm4PSCvm6Sljzbo9vb37NQjiuLz7emHJ
d4T5hYeeKQKJ53yy1deGBBCQK3yZh+Q7WZ3TqIrdT9lRVVpbSgCQl+5bp53427mc
P2uoRshI5V3oImQBwGXvpdskIDQLmMHRWNNTBzECgYEA9+GVH7nK3SiAyLs3xOQP
hLqXAL/NOEgHU8vJAaV2E3Q70XM/b17YIMqUK3EsKpqSky6z7s6bJJLTez6ZrUaK
YKfpQomRWsa6GPjOSRsmJJXRKrsumvio7lbtPee0RqRmuHHjQNigCsIGWBJL/54s
r3iwpsBU2Gc/0DmL47VwYRw=
-----END PRIVATE KEY-----
`;
const SPREADSHEET_ID = "1Ycqe3deRlF2BqiVKmOIv0UjxClYHwnqBriG2wpBcHRs";

let cachedToken: { token: string; exp: number } | null = null;

function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function b64url(bytes: Uint8Array | string): string {
  const s = typeof bytes === "string" ? bytes : String.fromCharCode(...bytes);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp > now + 60) return cachedToken.token;
  const header = { alg: "RS256", typ: "JWT" };
  const claim = { iss: GOOGLE_SA_EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey("pkcs8", pemToBinary(GOOGLE_SA_KEY), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(new Uint8Array(sigBuf))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` });
  const json = await res.json();
  if (!json.access_token) { console.error("Google token error:", JSON.stringify(json)); throw new Error("Failed to get Google access token"); }
  cachedToken = { token: json.access_token, exp: now + (json.expires_in || 3600) };
  return json.access_token;
}

async function appendRow(sheetName: string, row: (string | number)[]): Promise<number | null> {
  try {
    const token = await getAccessToken();
    const range = encodeURIComponent(`${sheetName}!A:Z`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ values: [row] }) });
    const json = await res.json();
    if (!res.ok) { console.error("Sheets append error:", JSON.stringify(json)); return null; }
    const updatedRange: string | undefined = json?.updates?.updatedRange;
    if (updatedRange) { const m = updatedRange.match(/![A-Z]+(\d+):/); if (m) return parseInt(m[1], 10); }
    return null;
  } catch (e) { console.error("appendRow failed:", e); return null; }
}

function nowStr() { return new Date().toISOString().slice(0, 16).replace("T", " "); }

const DRIVE_FOLDERS: Record<string, string> = {
  "Постоянные члены": "1BshDs2KLUd9D9ccXT6PAH7Ay3scSMQit",
  "Кандидатки (конкурс)": "1CaO1boHXAeGz8jOMpas_4q5lQvbpahKU",
  "Партнёры": "1lIKlxa6fQkIDo1Ugo85O4IpRyICbqDaW",
  "Инвесторы": "1LsUFCvv1LNwWf4ycIMQI1XRXd4ItU9LT",
  "Амбассадоры": "1G2gtCt8HwO6wt_3_JzFJYs7fPezsdicj",
};

const SHEET_CONFIG: Record<string, { rem1Col: string; botCol: string; statusCol: string; timeCol: string; discussCol: string; impressionCol: string; wishesCol: string; fileCol: string }> = {
  "Постоянные члены": { rem1Col: "K", botCol: "S", statusCol: "T", timeCol: "U", discussCol: "V", impressionCol: "W", wishesCol: "X", fileCol: "Y" },
  "Амбассадоры": { rem1Col: "K", botCol: "S", statusCol: "T", timeCol: "U", discussCol: "V", impressionCol: "W", wishesCol: "X", fileCol: "Y" },
  "Кандидатки (конкурс)": { rem1Col: "L", botCol: "T", statusCol: "U", timeCol: "V", discussCol: "W", impressionCol: "X", wishesCol: "Y", fileCol: "Z" },
  "Партнёры": { rem1Col: "L", botCol: "T", statusCol: "U", timeCol: "V", discussCol: "W", impressionCol: "X", wishesCol: "Y", fileCol: "Z" },
  "Инвесторы": { rem1Col: "L", botCol: "T", statusCol: "U", timeCol: "V", discussCol: "W", impressionCol: "X", wishesCol: "Y", fileCol: "Z" },
};

async function updateSheetCell(sheetName: string, col: string, row: number, value: string) {
  try {
    const token = await getAccessToken();
    const range = encodeURIComponent(`${sheetName}!${col}${row}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;
    await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ values: [[value]] }) });
  } catch (e) { console.error("updateSheetCell failed:", e); }
}

async function getDriveToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = { iss: GOOGLE_SA_EMAIL, scope: "https://www.googleapis.com/auth/drive", aud: "https://oauth2.googleapis.com/token", exp: now + 3600, iat: now };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey("pkcs8", pemToBinary(GOOGLE_SA_KEY), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(new Uint8Array(sigBuf))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}` });
  const json = await res.json();
  return json.access_token;
}

async function uploadFileToDrive(fileBytes: Uint8Array, filename: string, mimeType: string, folderId: string): Promise<string> {
  try {
    const token = await getDriveToken();
    const boundary = "iagboundary" + Date.now();
    const metadata = JSON.stringify({ name: filename, parents: [folderId] });
    const encoder = new TextEncoder();
    const pre = encoder.encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`);
    const post = encoder.encode(`\r\n--${boundary}--`);
    const body = new Uint8Array(pre.length + fileBytes.length + post.length);
    body.set(pre, 0); body.set(fileBytes, pre.length); body.set(post, pre.length + fileBytes.length);
    const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` }, body });
    const json = await res.json();
    if (!json.id) { console.error("Drive upload error:", JSON.stringify(json)); return ""; }
    await fetch(`https://www.googleapis.com/drive/v3/files/${json.id}/permissions`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ role: "reader", type: "anyone" }) });
    return `https://drive.google.com/file/d/${json.id}/view`;
  } catch (e) { console.error("uploadFileToDrive failed:", e); return ""; }
}

function buildContractHtml(d: any): string {
  const today = new Date().toLocaleDateString("ru-RU");
  const isLegal = d.contract_kind === "legal";
  const partyBlock = isLegal
    ? `<p><b>Сведения об организации:</b></p><p>Полное наименование: ${d.cm_name || ""}</p><p>ОГРН: ${d.cm_ogrn || ""}</p><p>ИНН/КПП: ${d.cm_inn_kpp || ""}</p><p>Банковские реквизиты: ${d.cm_bank || ""}</p><p>Должность и фио уполномоченного лица: ${d.cn_position_fio || ""}</p><p>Юридический адрес: ${d.cm_address || ""}</p><p>фактический адрес: ${d.cm_fact_address || ""}</p>`
    : `<p><b>Сведения о пайщике:</b></p><p>фио: ${d.p_fio || ""}</p><p>Паспорт: ${d.p_passport || ""}</p><p>Адрес и телефон: ${d.p_address || ""}</p>`;
  const partyName = isLegal ? (d.cm_name || "") : (d.p_fio || "");
  return `<html><body><h2>заявление о вступлении в пайщики</h2><p>в совет потребительского кооператива «rpk»</p><p>от ${partyName}</p><p><b>заявление</b></p><p>прошу принять ${partyName} в пайщики кооператива в участок «богиня».</p>${partyBlock}<p>вносит взнос: ${d.contract_amount || ""}.</p><p>дата: ${today}</p><p>подпись: ________________</p><hr><h2>согласие на обработку персональных данных</h2><p>${partyName} даёт согласие на обработку персональных данных рпк «богиня».</p><p>дата: ${today}</p><hr><h2>договор об участии в целевых программах</h2><p>«рпк» и ${partyName} заключили договор по условиям программы «богиня», сумма участия: ${d.contract_amount || ""}.</p><p>дата: ${today}</p></body></html>`;
}

async function sendDocumentBytes(chatId: number, bytes: Uint8Array, filename: string, mimeType: string, caption?: string): Promise<boolean> {
  try {
    const boundary = "tgdocboundary" + Date.now();
    const encoder = new TextEncoder();
    const parts: Uint8Array[] = [];
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`));
    if (caption) parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    parts.push(encoder.encode(`--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`));
    const tail = encoder.encode(`\r\n--${boundary}--`);
    let total = 0; for (const p of parts) total += p.length; total += bytes.length + tail.length;
    const body = new Uint8Array(total);
    let off = 0; for (const p of parts) { body.set(p, off); off += p.length; }
    body.set(bytes, off); off += bytes.length;
    body.set(tail, off);
    const res = await fetch(`${TG_API}/sendDocument`, { method: "POST", headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` }, body });
    const json = await res.json();
    if (!json.ok) { console.error("sendDocument error:", JSON.stringify(json)); return false; }
    return true;
  } catch (e) { console.error("sendDocumentBytes failed:", e); return false; }
}

async function downloadTelegramFile(fileId: string): Promise<{ bytes: Uint8Array; mimeType: string; ext: string } | null> {
  try {
    const info = await tgCall("getFile", { file_id: fileId });
    const filePath = info?.result?.file_path;
    if (!filePath) return null;
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const res = await fetch(url);
    const buf = new Uint8Array(await res.arrayBuffer());
    const ext = filePath.split(".").pop() || "bin";
    const mimeType = res.headers.get("content-type") || "application/octet-stream";
    return { bytes: buf, mimeType, ext };
  } catch (e) { console.error("downloadTelegramFile failed:", e); return null; }
}

const NOT_CONTACTED_MSG: Record<string, string> = {
  "Постоянные члены": "Прости, что с тобой ещё не связались 🙏",
  "Кандидатки (конкурс)": "Прости, что с тобой ещё не связались 🙏",
  "Партнёры": "Простите за задержку 🙏",
  "Инвесторы": "Простите, что с вами ещё не связались 🙏",
  "Амбассадоры": "Похоже, менеджеру нужно информации 🙏",
};

const T: Record<string, Record<string, any>> = {
  ru: {
    welcome: "Добро пожаловать в I am Goddess!\n\nВыбери язык / Choose your language:",
    choose_type: "*I am Goddess — Клуб избранных*\n\nЧто тебя интересует?",
    btn_member: "👑 Стать членом клуба", btn_contestant: "🌹 Подать заявку на конкурс (Претендентка)", btn_partner: "🤝 Партнёрство", btn_investor: "💼 Инвестор / участие в проекте", btn_ambassador: "🌟 Амбассадор (привлекаю партнёров/участниц)",
    choose_inv: "*Выбери формат участия:*", btn_inv_project: "💼 Инвестор в проект", btn_inv_jury: "⚖️ Войти в жюри конкурса", btn_inv_council: "👑 Управляющий совет клуба",
    ask_name: "Как тебя зовут?", ask_city: "Из какого ты города?", ask_goal: "Что тебя привело в клуб?",
    goal_opts: [["Саморазвитие", "Нетворкинг"], ["Конкурс красоты", "Всё вместе"]],
    ask_budget: "Готова ли ты инвестировать в своё развитие?", budget_opts: [["Да, готова инвестировать", "Пока изучаю"]],
    ask_phone: "Оставь свой номер телефона 📱", ask_soc1: "Ссылка на первую соцсеть:", ask_soc2: "Ссылка на вторую соцсеть (или '-'):",
    ask_offer: "Какое у тебя предложение к нам? (если нет — '-'):",
    btn_exit: "🚪 Выйти из клуба", ask_exit_reason: "Жаль, что ты уходишь 💔 По какой причине? (или '-'):", ask_exit_card: "Укажи номер карты для возврата паевого взноса:",
    exit_received: "Заявка на выход принята. Менеджер свяжется с тобой для подтверждения и возврата взноса.\n\nСпасибо, что был(а) с нами 🙏",
    btn_contract: "📄 Оформить документы", ask_contract_kind: "Оформляешь как физическое лицо или от юридического лица?", btn_physical: "Физлицо", btn_legal: "Юрлицо",
    ask_p_fio: "Укажи своё фио полностью:", ask_p_passport: "Пасспортные данные (серия, номер, кем и когда выдан одним сообщением):", ask_p_address: "Адрес регистрации и телефон:",
    ask_contract_amount: "Сумма паевого взноса:", ask_cm_name: "Полное наименование компании:", ask_cm_ogrn: "ОГРН компании:", ask_cm_inn_kpp: "ИНН и КПП:", ask_cm_bank: "Банковские реквизиты:",
    ask_cn_position_fio: "Должность и фио уполномоченного лица:", ask_cm_address: "Юридический адрес:", ask_cm_fact_address: "Дактический адрес (или 'тот же'):",
    contract_ready: "Готово! 📄 Документы сформированы и отправлены менеджеру.",
    thanks_member: "Твоя заявка принята!\n\nНаш куратор свяжется с тобой в течение 24 часов.\n\n_Клуб избранных — Богиня_ 👑",
    contestant_intro: "🌹 *Заявка на конкурс Мисс I am Goddess*\n\nКак тебя зовут?", ask_c_city: "Из какого ты города?", ask_c_age: "Сколько тебе лет?",
    ask_c_about: "Расскажи о себе в 2-3 предложениях:", ask_c_photo: "Пришли своё лучшее фото 📸", ask_c_phone: "твой номер телефона 📱", thanks_contestant: "✨ заявка получена!\n\nНаш менеджер свяжется с тобой в течение 24 часов.\n\n_Клуб избранных — Богиня_ 👑",
    partner_intro: "*Партнёрство*\n\nКак тебя зовут?", ask_company: "Название компании:", ask_ptype: "тип партнёрства?",
    ptype_opts: [["Салон красоты", "Школа"], ["Бренд", "Другое"]], ask_pphone: "твой номер телефона 📱", thanks_partner: "спасибо!", pdf_caption: "Презентация",
    contact_msg: "связаться:\n\n[Telegram](https://t.me/I_am_consultant)\n[WhatsApp +62 813 5927 552](https://wa.me/628135927552)\ni-goddess.com",
    investor_intro: "*инвестор*\n\nкак тебя зовут?", ask_ibudget: "какой бюджет?", ibudget_opts: [["До 500К", "500К-2М"], ["2М+", "обсудим"]], thanks_investor: "отлично!",
    jury_intro: "жюри\n\nкак тебя зовут?", ask_j_expertise: "твоя экспертиза?", thanks_jury: "спасибо!",
    council_intro: "совет\n\nкак вас зовут?", ask_s_background: "ваш опыт?", thanks_council: "спасибо!",
    ambassador_intro: "амбассадор\n\nкак тебя зовут?", thanks_ambassador: "спасибо!", cancel: "до встречи! 👑", wonderful: "прекрасно",
  },
  en: {
    welcome: "Welcome!", choose_type: "What interests you?", btn_member: "👑 Member", btn_contestant: "🌹 Contestant", btn_partner: "🤝 Partner", btn_investor: "💼 Investor", btn_ambassador: "🌟 Ambassador",
    choose_inv: "Choose format:", btn_inv_project: "Investor", btn_inv_jury: "Jury", btn_inv_council: "Council", ask_name: "Your name?", ask_city: "Your city?", ask_goal: "What brought you?",
    goal_opts: [["Self-development", "Networking"], ["Contest", "Everything"]], ask_budget: "Ready to invest?", budget_opts: [["Yes", "Just exploring"]], ask_phone: "Phone:", ask_soc1: "Social link:", ask_soc2: "Second link (or '-'):",
    ask_offer: "Your proposal? (or '-'):", btn_exit: "🚪 Leave", ask_exit_reason: "Reason (or '-'):", ask_exit_card: "Card for refund:", exit_received: "Exit request received.",
    btn_contract: "📄 Get documents", ask_contract_kind: "Individual or legal entity?", btn_physical: "Individual", btn_legal: "Legal entity", ask_p_fio: "Full name:", ask_p_passport: "Passport details:", ask_p_address: "Address and phone:",
    ask_contract_amount: "Amount:", ask_cm_name: "Company name:", ask_cm_ogrn: "Reg number:", ask_cm_inn_kpp: "Tax ID:", ask_cm_bank: "Bank details:", ask_cn_position_fio: "Signatory position+name:", ask_cm_address: "Legal address:", ask_cm_fact_address: "Actual address:",
    contract_ready: "Done! Documents generated and sent for review.",
    thanks_member: "Application received!", contestant_intro: "Contest application\n\nYour name?", ask_c_city: "City?", ask_c_age: "Age?", ask_c_about: "About you:", ask_c_photo: "Best photo:", ask_c_phone: "Phone:", thanks_contestant: "Application received!",
    partner_intro: "Partnership\n\nName?", ask_company: "Company:", ask_ptype: "Type?", ptype_opts: [["Salon", "School"], ["Brand", "Other"]], ask_pphone: "Phone:", thanks_partner: "Thanks!", pdf_caption: "Presentation",
    contact_msg: "Contact:\n\n[Telegram](https://t.me/I_am_consultant)\n[WhatsApp](https://wa.me/628135927552)\ni-goddess.com", investor_intro: "Investor\n\nName?", ask_ibudget: "Budget?", ibudget_opts: [["Up to $5K", "$5K-20K"], ["$20K+", "Discuss"]], thanks_investor: "Great!",
    jury_intro: "Jury\n\nName?", ask_j_expertise: "Expertise?", thanks_jury: "Thanks!", council_intro: "Council\n\nName?", ask_s_background: "Background?", thanks_council: "Thanks!", ambassador_intro: "Ambassador\n\nName?", thanks_ambassador: "Thanks!", cancel: "Bye!", wonderful: "Wonderful",
  },
};
for (const lang of ["es", "ar", "zh", "id"]) { if (!T[lang]) T[lang] = T.en; }
function t(key: string, lang: string): any { return T[lang]?.[key] ?? T.en[key] ?? ""; }

async function tgCall(method: string, payload: Record<string, any>) {
  const res = await fetch(`${TG_API}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  return res.json();
}
async function sendMessage(chatId: number, text: string, opts: Record<string, any> = {}) { return tgCall("sendMessage", { chat_id: chatId, text, parse_mode: "Markdown", ...opts }); }
function inlineKb(rows: { text: string; callback_data: string }[][]) { return { reply_markup: { inline_keyboard: rows } }; }
function replyKb(rows: string[][]) { return { reply_markup: { keyboard: rows.map(r => r.map(t => ({ text: t }))), one_time_keyboard: true, resize_keyboard: true } }; }
async function notifyAdmins(text: string) { for (const admin of ADMINS) { await sendMessage(admin, text, { parse_mode: "Markdown" }); } }

async function getSession(chatId: number) {
  const { data } = await supabase.from("bot_sessions").select("*").eq("bot_name", BOT_NAME).eq("chat_id", chatId).maybeSingle();
  return data;
}
async function setSession(chatId: number, state: string, dataPatch: Record<string, any> = {}, lang?: string, username?: string) {
  const existing = await getSession(chatId);
  const merged = { ...(existing?.data || {}), ...dataPatch };
  await supabase.from("bot_sessions").upsert({ bot_name: BOT_NAME, chat_id: chatId, state, data: merged, lang: lang ?? existing?.lang ?? "ru", username: username ?? existing?.username, updated_at: new Date().toISOString() }, { onConflict: "bot_name,chat_id" });
}
async function clearSession(chatId: number) { await supabase.from("bot_sessions").delete().eq("bot_name", BOT_NAME).eq("chat_id", chatId); }
async function isRateLimited(chatId: number): Promise<boolean> {
  if (WHITELIST.has(chatId)) return false;
  const { data } = await supabase.from("bot_rate_limit").select("*").eq("bot_name", BOT_NAME).eq("chat_id", chatId).maybeSingle();
  const now = Date.now();
  if (!data) { await supabase.from("bot_rate_limit").insert({ bot_name: BOT_NAME, chat_id: chatId, last_start: new Date().toISOString(), start_count: 1 }); return false; }
  const lastStart = new Date(data.last_start).getTime();
  const diffSec = (now - lastStart) / 1000;
  if (diffSec < RATE_LIMIT_SECONDS) return true;
  let count = data.start_count;
  if (diffSec > 3600) count = 0;
  count += 1;
  if (count > MAX_STARTS_PER_HOUR) return true;
  await supabase.from("bot_rate_limit").update({ last_start: new Date().toISOString(), start_count: count }).eq("bot_name", BOT_NAME).eq("chat_id", chatId);
  return false;
}

Deno.serve(async (req: Request) => {
  try {
    const update = await req.json();
    if (update.callback_query) {
      const cq = update.callback_query;
      const chatId = cq.message.chat.id;
      const data = cq.data;
      await tgCall("answerCallbackQuery", { callback_query_id: cq.id });
      if (data.startsWith("lang_")) {
        const lang = data.replace("lang_", "");
        await setSession(chatId, "choose_type", {}, lang, cq.from.username);
        await sendMessage(chatId, t("choose_type", lang), inlineKb([
          [{ text: t("btn_member", lang), callback_data: "type_member" }],
          [{ text: t("btn_contestant", lang), callback_data: "type_contestant" }],
          [{ text: t("btn_partner", lang), callback_data: "type_partner" }],
          [{ text: t("btn_investor", lang), callback_data: "type_investor" }],
          [{ text: t("btn_ambassador", lang), callback_data: "type_ambassador" }],
          [{ text: t("btn_exit", lang), callback_data: "type_exit" }],
          [{ text: t("btn_contract", lang), callback_data: "type_contract" }],
        ]));
        return new Response("ok");
      }
      const session = await getSession(chatId);
      const lang = session?.lang || "ru";
      if (data === "type_member") { await setSession(chatId, "m_name", {}, lang); await sendMessage(chatId, t("ask_name", lang)); }
      else if (data === "type_contestant") { await setSession(chatId, "c_name", {}, lang); await sendMessage(chatId, t("contestant_intro", lang)); }
      else if (data === "type_partner") { await setSession(chatId, "p_name", {}, lang); await sendMessage(chatId, t("partner_intro", lang)); }
      else if (data === "type_ambassador") { await setSession(chatId, "amb_name", {}, lang); await sendMessage(chatId, t("ambassador_intro", lang)); }
      else if (data === "type_exit") { await setSession(chatId, "exit_reason", {}, lang, cq.from.username); await sendMessage(chatId, t("ask_exit_reason", lang)); }
      else if (data === "type_contract") {
        await setSession(chatId, "contract_kind", {}, lang, cq.from.username);
        await sendMessage(chatId, t("ask_contract_kind", lang), inlineKb([
          [{ text: t("btn_physical", lang), callback_data: "kind_physical" }],
          [{ text: t("btn_legal", lang), callback_data: "kind_legal" }],
        ]));
      }
      else if (data === "kind_physical") { await setSession(chatId, "p_fio", { contract_kind: "physical" }, lang); await sendMessage(chatId, t("ask_p_fio", lang)); }
      else if (data === "kind_legal") { await setSession(chatId, "cm_name", { contract_kind: "legal" }, lang); await sendMessage(chatId, t("ask_cm_name", lang)); }
      else if (data === "type_investor") {
        await setSession(chatId, "choose_inv", {}, lang);
        await sendMessage(chatId, t("choose_inv", lang), inlineKb([
          [{ text: t("btn_inv_project", lang), callback_data: "inv_project" }],
          [{ text: t("btn_inv_jury", lang), callback_data: "inv_jury" }],
          [{ text: t("btn_inv_council", lang), callback_data: "inv_council" }],
        ]));
      }
      else if (data === "inv_project") { await setSession(chatId, "i_name", {}, lang); await sendMessage(chatId, t("investor_intro", lang)); }
      else if (data === "inv_jury") { await setSession(chatId, "j_name", {}, lang); await sendMessage(chatId, t("jury_intro", lang)); }
      else if (data === "inv_council") { await setSession(chatId, "s_name", {}, lang); await sendMessage(chatId, t("council_intro", lang)); }
      else if (data === "rem_yes") { if (session?.state === "rem1_wait") { await setSession(chatId, "fb_time", session.data, lang); await sendMessage(chatId, "Через сколько времени связался менеджер?"); } }
      else if (data === "rem_no") { if (session?.state === "rem1_wait") { const cat = session.data?.category || "Постоянные члены"; await setSession(chatId, "fb_addinfo", session.data, lang); await sendMessage(chatId, NOT_CONTACTED_MSG[cat] || NOT_CONTACTED_MSG["Постоянные члены"]); } }
      return new Response("ok");
    }

    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";
      const username = msg.from.username || "-";

      if (text.startsWith("/start")) {
        if (await isRateLimited(chatId)) { await sendMessage(chatId, "⏳ Please wait a moment before trying again."); return new Response("ok"); }
        const parts = text.split(" ");
        if (parts.length > 1) {
          const raw = parts[1];
          const validLangs = new Set(["ru", "en", "es", "ar", "zh", "id"]);
          let arg = raw, dlLang = "ru";
          const idx = raw.lastIndexOf("_");
          if (idx > 0 && validLangs.has(raw.slice(idx + 1))) { arg = raw.slice(0, idx); dlLang = raw.slice(idx + 1); }
          if (arg === "member") { await setSession(chatId, "m_name", {}, dlLang, username); await sendMessage(chatId, t("ask_name", dlLang)); }
          else if (arg === "contestant") { await setSession(chatId, "c_name", {}, dlLang, username); await sendMessage(chatId, t("contestant_intro", dlLang)); }
          else if (arg === "partner") { await setSession(chatId, "p_name", {}, dlLang, username); await sendMessage(chatId, t("partner_intro", dlLang)); }
          else if (arg === "investor") {
            await setSession(chatId, "choose_inv", {}, dlLang, username);
            await sendMessage(chatId, t("choose_inv", dlLang), inlineKb([
              [{ text: t("btn_inv_project", dlLang), callback_data: "inv_project" }],
              [{ text: t("btn_inv_jury", dlLang), callback_data: "inv_jury" }],
              [{ text: t("btn_inv_council", dlLang), callback_data: "inv_council" }],
            ]));
          }
          return new Response("ok");
        }
        await clearSession(chatId);
        await sendMessage(chatId, t("welcome", "ru"), inlineKb([
          [{ text: "🇷🇺 Русский", callback_data: "lang_ru" }, { text: "🇬🇧 English", callback_data: "lang_en" }],
          [{ text: "🇪🇸 Español", callback_data: "lang_es" }, { text: "🇸🇦 العربية", callback_data: "lang_ar" }],
          [{ text: "🇨🇳 中文", callback_data: "lang_zh" }, { text: "🇮🇩 Indonesia", callback_data: "lang_id" }],
        ]));
        return new Response("ok");
      }

      if (text === "/cancel") {
        const session = await getSession(chatId);
        await sendMessage(chatId, t("cancel", session?.lang || "ru"));
        await clearSession(chatId);
        return new Response("ok");
      }

      const session = await getSession(chatId);
      if (!session) return new Response("ok");
      const lang = session.lang || "ru";
      const state = session.state;
      const photoId = msg.photo ? msg.photo[msg.photo.length - 1].file_id : undefined;

      switch (state) {
        case "m_name": await setSession(chatId, "m_city", { name: text }); await sendMessage(chatId, `${t("wonderful", lang)}, *${text}*!\n\n${t("ask_city", lang)}`); break;
        case "m_city": await setSession(chatId, "m_goal", { city: text }); await sendMessage(chatId, t("ask_goal", lang), replyKb(t("goal_opts", lang))); break;
        case "m_goal": await setSession(chatId, "m_budget", { goal: text }); await sendMessage(chatId, t("ask_budget", lang), replyKb(t("budget_opts", lang))); break;
        case "m_budget": await setSession(chatId, "m_phone", { budget: text }); await sendMessage(chatId, t("ask_phone", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "m_phone": await setSession(chatId, "m_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "m_soc1": await setSession(chatId, "m_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "m_soc2": await setSession(chatId, "m_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "m_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Постоянные члены.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Постоянные члены"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Постоянные члены.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Постоянные члены"]); }
          await sendMessage(chatId, t("thanks_member", lang));
          await notifyAdmins(`NEW LEAD | 👑 ЧЛЕН КЛУБА | ${lang.toUpperCase()}\nИмя: ${d.name}\nТел: ${d.phone}\nГород: ${d.city}\nЦель: ${d.goal}\nБюджет: ${d.budget}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Постоянные члены", [nowStr(), chatId, username, d.phone, d.name, d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", "", d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Постоянные члены", SHEET_CONFIG["Постоянные члены"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "c_name": await setSession(chatId, "c_city", { name: text }); await sendMessage(chatId, t("ask_c_city", lang)); break;
        case "c_city": await setSession(chatId, "c_age", { city: text }); await sendMessage(chatId, t("ask_c_age", lang)); break;
        case "c_age": await setSession(chatId, "c_about", { age: text }); await sendMessage(chatId, t("ask_c_about", lang)); break;
        case "c_about": await setSession(chatId, "c_photo", { about: text }); await sendMessage(chatId, t("ask_c_photo", lang)); break;
        case "c_photo": {
          let photo_link = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) photo_link = await uploadFileToDrive(file.bytes, `${session.data?.name || "user"}_${nowStr()}_${chatId}_Кандидатки.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Кандидатки (конкурс)"]); }
          await setSession(chatId, "c_phone", { photo_id: photoId, photo_link }); await sendMessage(chatId, t("ask_c_phone", lang)); break;
        }
        case "c_phone": await setSession(chatId, "c_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "c_soc1": await setSession(chatId, "c_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "c_soc2": await setSession(chatId, "c_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "c_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = d.photo_link || "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) { const link = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Кандидатки.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Кандидатки (конкурс)"]); fileLink = fileLink ? `${fileLink}, ${link}` : link; } }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) { const link = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Кандидатки.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Кандидатки (конкурс)"]); fileLink = fileLink ? `${fileLink}, ${link}` : link; } }
          await sendMessage(chatId, t("thanks_contestant", lang));
          await notifyAdmins(`NEW LEAD | 🌹 ПРЕТЕНДЕНТКА | ${lang.toUpperCase()}\nИмя: ${d.name}\nВозраст: ${d.age}\nГород: ${d.city}\nТел: ${d.phone}\nО себе: ${d.about}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Кандидатки (конкурс)", [nowStr(), chatId, username, d.phone, d.name, d.age, d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", `О себе: ${d.about}`, d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Кандидатки (конкурс)", SHEET_CONFIG["Кандидатки (конкурс)"].fileCol, rowNum, fileLink);
          if (d.photo_id) { for (const admin of ADMINS) { await tgCall("sendPhoto", { chat_id: admin, photo: d.photo_id, caption: `фото претендентки: ${d.name}` }); } }
          await clearSession(chatId); break;
        }
        case "p_name": await setSession(chatId, "p_company", { name: text }); await sendMessage(chatId, t("ask_company", lang)); break;
        case "p_company": await setSession(chatId, "p_type", { company: text }); await sendMessage(chatId, t("ask_ptype", lang), replyKb(t("ptype_opts", lang))); break;
        case "p_type": await setSession(chatId, "p_city", { ptype: text }); await sendMessage(chatId, t("ask_city", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "p_city": await setSession(chatId, "p_phone", { city: text }); await sendMessage(chatId, t("ask_pphone", lang)); break;
        case "p_phone": await setSession(chatId, "p_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "p_soc1": await setSession(chatId, "p_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "p_soc2": await setSession(chatId, "p_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "p_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Партнёры.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Партнёры"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Партнёры.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Партнёры"]); }
          await sendMessage(chatId, t("thanks_partner", lang));
          await sendMessage(chatId, t("contact_msg", lang), { disable_web_page_preview: true });
          await notifyAdmins(`NEW LEAD | 🤝 ПАРТНЁР | ${lang.toUpperCase()}\nИмя: ${d.name}\nКомпания: ${d.company}\nТип: ${d.ptype}\nТел: ${d.phone}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Партнёры", [nowStr(), chatId, username, d.phone, d.name, `${d.company} (${d.ptype})`, d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", "", d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Партнёры", SHEET_CONFIG["Партнёры"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "amb_name": await setSession(chatId, "amb_company", { name: text }); await sendMessage(chatId, t("ask_company", lang)); break;
        case "amb_company": await setSession(chatId, "amb_type", { company: text }); await sendMessage(chatId, t("ask_ptype", lang), replyKb(t("ptype_opts", lang))); break;
        case "amb_type": await setSession(chatId, "amb_city", { ptype: text }); await sendMessage(chatId, t("ask_city", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "amb_city": await setSession(chatId, "amb_phone", { city: text }); await sendMessage(chatId, t("ask_pphone", lang)); break;
        case "amb_phone": await setSession(chatId, "amb_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "amb_soc1": await setSession(chatId, "amb_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "amb_soc2": await setSession(chatId, "amb_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "amb_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Амбассадоры.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Амбассадоры"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Амбассадоры.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Амбассадоры"]); }
          await sendMessage(chatId, t("thanks_ambassador", lang));
          await sendMessage(chatId, t("contact_msg", lang), { disable_web_page_preview: true });
          await notifyAdmins(`NEW LEAD | 🌟 АМБАССАДОР | ${lang.toUpperCase()}\nИмя: ${d.name}\nКомпания/О себе: ${d.company}\nТип: ${d.ptype}\nТел: ${d.phone}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Амбассадоры", [nowStr(), chatId, username, d.phone, d.name, d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", `${d.company} / ${d.ptype}`, d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Амбассадоры", SHEET_CONFIG["Амбассадоры"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "i_name": await setSession(chatId, "i_budget", { name: text }); await sendMessage(chatId, t("ask_ibudget", lang), replyKb(t("ibudget_opts", lang))); break;
        case "i_budget": await setSession(chatId, "i_city", { budget: text }); await sendMessage(chatId, t("ask_city", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "i_city": await setSession(chatId, "i_phone", { city: text }); await sendMessage(chatId, t("ask_phone", lang)); break;
        case "i_phone": await setSession(chatId, "i_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "i_soc1": await setSession(chatId, "i_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "i_soc2": await setSession(chatId, "i_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "i_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          await sendMessage(chatId, t("thanks_investor", lang));
          await notifyAdmins(`NEW LEAD | 💼 ИНВЕСТОР | ${lang.toUpperCase()}\nИмя: ${d.name}\nБюджет: ${d.budget}\nГород: ${d.city}\nТел: ${d.phone}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Инвесторы", [nowStr(), chatId, username, d.phone, d.name, "Инвестор", d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", `Бюджет: ${d.budget}`, d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Инвесторы", SHEET_CONFIG["Инвесторы"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "j_name": await setSession(chatId, "j_expertise", { name: text }); await sendMessage(chatId, t("ask_j_expertise", lang)); break;
        case "j_expertise": await setSession(chatId, "j_city", { expertise: text }); await sendMessage(chatId, t("ask_city", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "j_city": await setSession(chatId, "j_phone", { city: text }); await sendMessage(chatId, t("ask_phone", lang)); break;
        case "j_phone": await setSession(chatId, "j_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "j_soc1": await setSession(chatId, "j_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "j_soc2": await setSession(chatId, "j_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "j_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          await sendMessage(chatId, t("thanks_jury", lang));
          await notifyAdmins(`NEW LEAD | ⚖️ ЖЮРИ | ${lang.toUpperCase()}\nИмя: ${d.name}\nЭкспертиза: ${d.expertise}\nГород: ${d.city}\nТел: ${d.phone}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Инвесторы", [nowStr(), chatId, username, d.phone, d.name, "Жюри", d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", `Экспертиза: ${d.expertise}`, d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Инвесторы", SHEET_CONFIG["Инвесторы"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "s_name": await setSession(chatId, "s_background", { name: text }); await sendMessage(chatId, t("ask_s_background", lang)); break;
        case "s_background": await setSession(chatId, "s_city", { background: text }); await sendMessage(chatId, t("ask_city", lang), { reply_markup: { remove_keyboard: true } }); break;
        case "s_city": await setSession(chatId, "s_phone", { city: text }); await sendMessage(chatId, t("ask_phone", lang)); break;
        case "s_phone": await setSession(chatId, "s_soc1", { phone: text }); await sendMessage(chatId, t("ask_soc1", lang)); break;
        case "s_soc1": await setSession(chatId, "s_soc2", { soc1: text }); await sendMessage(chatId, t("ask_soc2", lang)); break;
        case "s_soc2": await setSession(chatId, "s_offer", { soc2: text }); await sendMessage(chatId, t("ask_offer", lang)); break;
        case "s_offer": {
          const d = { ...session.data, offer: text };
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_Инвесторы.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS["Инвесторы"]); }
          await sendMessage(chatId, t("thanks_council", lang));
          await notifyAdmins(`NEW LEAD | 👑 СОВЕТ | ${lang.toUpperCase()}\nИмя: ${d.name}\nОпыт: ${d.background}\nГород: ${d.city}\nТел: ${d.phone}\nСоцсети: ${d.soc1} | ${d.soc2}\nПредложение: ${d.offer}\nTG: @${username}`);
          const rowNum = await appendRow("Инвесторы", [nowStr(), chatId, username, d.phone, d.name, "Совет", d.city, lang, d.soc1, d.soc2, "Новая заявка", "", "", "", "", "", "", `Опыт: ${d.background}`, d.offer, BOT_TAG]);
          if (fileLink && rowNum) await updateSheetCell("Инвесторы", SHEET_CONFIG["Инвесторы"].fileCol, rowNum, fileLink);
          await clearSession(chatId); break;
        }
        case "p_fio": await setSession(chatId, "p_passport", { p_fio: text }); await sendMessage(chatId, t("ask_p_passport", lang)); break;
        case "p_passport": await setSession(chatId, "p_address", { p_passport: text }); await sendMessage(chatId, t("ask_p_address", lang)); break;
        case "p_address": await setSession(chatId, "contract_amount", { p_address: text }); await sendMessage(chatId, t("ask_contract_amount", lang)); break;
        case "cm_name": await setSession(chatId, "cm_ogrn", { cm_name: text }); await sendMessage(chatId, t("ask_cm_ogrn", lang)); break;
        case "cm_ogrn": await setSession(chatId, "cm_inn_kpp", { cm_ogrn: text }); await sendMessage(chatId, t("ask_cm_inn_kpp", lang)); break;
        case "cm_inn_kpp": await setSession(chatId, "cm_bank", { cm_inn_kpp: text }); await sendMessage(chatId, t("ask_cm_bank", lang)); break;
        case "cm_bank": await setSession(chatId, "cn_position_fio", { cm_bank: text }); await sendMessage(chatId, t("ask_cn_position_fio", lang)); break;
        case "cn_position_fio": await setSession(chatId, "cm_address", { cn_position_fio: text }); await sendMessage(chatId, t("ask_cm_address", lang)); break;
        case "cm_address": await setSession(chatId, "cm_fact_address", { cm_address: text }); await sendMessage(chatId, t("ask_cm_fact_address", lang)); break;
        case "cm_fact_address": await setSession(chatId, "contract_amount", { cm_fact_address: text }); await sendMessage(chatId, t("ask_contract_amount", lang)); break;
        case "contract_amount": {
          const d = { ...session.data, contract_amount: text };
          const html = buildContractHtml(d);
          const partyName = d.contract_kind === "legal" ? (d.cm_name || username) : (d.p_fio || username);
          const fname = `Dogovor_${chatId}_${Date.now()}.html`;
          const bytes = new TextEncoder().encode(html);
          const caption = `📄 НОВЫЙ ДОГОВОР | ${BOT_TAG} | ${lang.toUpperCase()}\nтип: ${d.contract_kind === "legal" ? "Юрлицо" : "физлицо"}\nимя/компания: ${partyName}\nсумма: ${d.contract_amount}\ntg: @${username}`;
          let sentOk = false;
          for (const admin of ADMINS) { const ok = await sendDocumentBytes(admin, bytes, fname, "text/html", caption); if (ok) sentOk = true; }
          await sendMessage(chatId, t("contract_ready", lang));
          if (!sentOk) { await notifyAdmins(`⚠️ Не удалось отправить файл договора (${partyName}). Текст ниже:\n\n${html.slice(0, 3500)}`); }
          await clearSession(chatId); break;
        }
        case "exit_reason": await setSession(chatId, "exit_card", { exit_reason: text }); await sendMessage(chatId, t("ask_exit_card", lang)); break;
        case "exit_card": {
          const d = { ...session.data, exit_card: text };
          await sendMessage(chatId, t("exit_received", lang));
          await notifyAdmins(`🚪 EXIT REQUEST | ${BOT_TAG} | ${lang.toUpperCase()}\nTG ID: ${chatId}\nUsername: @${username}\nпричина: ${d.exit_reason}\nкарта для возврата: ${d.exit_card}`);
          await appendRow("Заявки на выход", [nowStr(), chatId, username, username, d.exit_reason, d.exit_card, BOT_TAG, "Новая заявка"]);
          await clearSession(chatId); break;
        }
        case "fb_time": await setSession(chatId, "fb_discuss", { fb_time: text }); await sendMessage(chatId, "Что обсуждали?"); break;
        case "fb_discuss": await setSession(chatId, "fb_impression", { fb_discuss: text }); await sendMessage(chatId, "Какое твоё впечатление?"); break;
        case "fb_impression": await setSession(chatId, "fb_wishes", { fb_impression: text }); await sendMessage(chatId, "Пожелания?"); break;
        case "fb_wishes": await setSession(chatId, "fb_file", { fb_wishes: text }); await sendMessage(chatId, "Добавь файл или '-'"); break;
        case "fb_file": {
          const d = session.data;
          const cfg = SHEET_CONFIG[d.sheet];
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_${d.sheet}.${file.ext}`, file.mimeType, DRIVE_FOLDERS[d.sheet]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_${d.sheet}.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS[d.sheet]); }
          if (cfg) {
            await updateSheetCell(d.sheet, cfg.statusCol, d.row, "Связались");
            await updateSheetCell(d.sheet, cfg.timeCol, d.row, d.fb_time || "");
            await updateSheetCell(d.sheet, cfg.discussCol, d.row, d.fb_discuss || "");
            await updateSheetCell(d.sheet, cfg.impressionCol, d.row, d.fb_impression || "");
            await updateSheetCell(d.sheet, cfg.wishesCol, d.row, d.fb_wishes || "");
            if (fileLink) await updateSheetCell(d.sheet, cfg.fileCol, d.row, fileLink);
          }
          await sendMessage(chatId, "спасибо! 🙏👑");
          await notifyAdmins(`FEEDBACK | ${d.sheet} | TG:@${username}\nчерез: ${d.fb_time}\nобсуждали: ${d.fb_discuss}\nвпечатление: ${d.fb_impression}\nпожелания: ${d.fb_wishes}\nфайл: ${fileLink || "-"}`);
          await clearSession(chatId); break;
        }
        case "fb_addinfo": {
          const d = session.data;
          const cfg = SHEET_CONFIG[d.sheet];
          let fileLink = "";
          if (photoId) { const file = await downloadTelegramFile(photoId); if (file) fileLink = await uploadFileToDrive(file.bytes, `${d.name || "user"}_${nowStr()}_${chatId}_${d.sheet}.${file.ext}`, file.mimeType, DRIVE_FOLDERS[d.sheet]); }
          else if (msg.document) { const file = await downloadTelegramFile(msg.document.file_id); if (file) fileLink = await uploadFileToDrive(file.bytes, msg.document.file_name || `${d.name || "user"}_${nowStr()}_${chatId}_${d.sheet}.${file.ext}`, msg.document.mime_type || file.mimeType, DRIVE_FOLDERS[d.sheet]); }
          if (cfg) { await updateSheetCell(d.sheet, cfg.statusCol, d.row, "Не связались"); await updateSheetCell(d.sheet, cfg.wishesCol, d.row, text || ""); if (fileLink) await updateSheetCell(d.sheet, cfg.fileCol, d.row, fileLink); }
          await sendMessage(chatId, "спасибо! 🙏👑");
          await notifyAdmins(`NOT CONTACTED FOLLOWUP | ${d.sheet} | TG:@${username}\nдоп.инфо: ${text}\nфайл: ${fileLink || "-"}`);
          await clearSession(chatId); break;
        }
      }
    }
    return new Response("ok");
  } catch (err) {
    console.error("Bot error:", err);
    try {
      const errChatId = (update as any)?.message?.chat?.id || (update as any)?.callback_query?.message?.chat?.id || null;
      await supabase.from("bot_errors").insert({ bot_name: BOT_NAME, chat_id: errChatId, state: null, error_message: String((err as any)?.message || err), error_stack: String((err as any)?.stack || "") });
      await notifyAdmins(`⚠️ BOT ERROR | ${BOT_NAME}\n${String((err as any)?.message || err)}`);
    } catch (logErr) { console.error("Failed to log error:", logErr); }
    return new Response("ok");
  }
});
