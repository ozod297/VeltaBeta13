import https from "https";

function telegramRequest(token, method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${token}/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    console.error("Telegram muhit o'zgaruvchilari sozlanmagan (BOT_TOKEN/TELEGRAM_CHAT_IDS)");
    return res.status(500).json({ ok: false, error: "Server sozlanmagan" });
  }

  const { name, phone, org, message, lang, location } = req.body || {};

  if (!name || !phone || !message) {
    return res.status(400).json({ ok: false, error: "Majburiy maydonlar to'ldirilmagan" });
  }

  const isUz = lang !== "ru";
  const titleText = isUz
    ? "<b>🔔 Yangi murojaat (Yetkazib berish bilan)!</b>"
    : "<b>🔔 Новая заявка (С доставкой)!</b>";
  const nameLabel = isUz ? "Ism" : "Имя";
  const phoneLabel = isUz ? "Telefon" : "Телефон";
  const orgLabel = isUz ? "Tashkilot" : "Организация";
  const msgLabel = isUz ? "Xabar" : "Сообщение";
  const locLabel = isUz
    ? "📍 Tanlangan yetkazib berish manzili"
    : "📍 Выбранный адрес доставки";
  const noOrg = isUz ? "Ko'rsatilmagan" : "Не указано";
  const noLoc = isUz
    ? "Xaritadan manzil tanlanmadi ❌"
    : "Адрес на карте не выбран ❌";

  let locationText = noLoc;
  if (
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
  ) {
    locationText = `<a href="https://maps.google.com/?q=${location.lat},${location.lng}">📍 Google Maps orqali xaritada ochish</a>`;
  }

  const text =
    `${titleText}\n\n` +
    `<b>👤 ${nameLabel}:</b> ${escapeHtml(name)}\n` +
    `<b>📞 ${phoneLabel}:</b> ${escapeHtml(phone)}\n` +
    `<b>🏢 ${orgLabel}:</b> ${escapeHtml(org) || noOrg}\n` +
    `<b>📝 ${msgLabel}:</b> ${escapeHtml(message)}\n\n` +
    `<b>${locLabel}:</b>\n${locationText}`;

  try {
    const requests = CHAT_IDS.map((chatId) =>
      telegramRequest(BOT_TOKEN, "sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Yuborildi ✅", callback_data: `status_success_${lang || "uz"}` },
              { text: "Yuborilmadi ❌", callback_data: `status_error_${lang || "uz"}` },
            ],
          ],
        },
      }),
    );

    const results = await Promise.all(requests);
    const allOk = results.every((r) => r.ok);

    if (!allOk) {
      console.error("Telegramga yuborishda xatolik:", results);
      return res.status(502).json({ ok: false, error: "Telegramga yuborilmadi" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form xatoligi:", error.message);
    return res.status(500).json({ ok: false, error: "Server xatoligi" });
  }
}
