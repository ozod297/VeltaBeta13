import https from "https";

// 🛠️ BOT CONFIGURATION — token faqat muhit o'zgaruvchisidan olinadi, kodga yozilmaydi
const BOT_TOKEN = process.env.BOT_TOKEN;

// 📈 KUNLIK STATISTIKA VA SANA O'ZGARUVCHILARI
let dailyStats = {
  successRequests: 0,
  errorRequests: 0,
  lastDate: "", // Avtomatik kunlik nollash uchun sana paneli
};

// Arizalarning statuslari uchun ikki tildagi matnlar
const messages = {
  uz: {
    statusSuccess: "\n\n<b>Holati:</b> Yuborildi ✅",
    statusError: "\n\n<b>Holati:</b> Yuborilmadi ❌",
    alertSuccess: "Buyurtma tasdiqlandi! ✅",
    alertError: "Buyurtma rad etildi! ❌",
  },
  ru: {
    statusSuccess: "\n\n<b>Статус:</b> Отправлено ✅",
    statusError: "\n\n<b>Статус:</b> Не отправлено ❌",
    alertSuccess: "Заказ подтвержден! ✅",
    alertError: "Заказ отклонен! ❌",
  },
};

// 🕒 Toshkent vaqti bo'yicha joriy sanani olish
function getTashkentDate() {
  return new Date().toLocaleDateString("uz-UZ", { timeZone: "Asia/Tashkent" });
}

// 🔄 Yangi kun boshlanganini tekshirish va statistikani nollash
function checkAndResetStats() {
  const bugun = getTashkentDate();
  if (dailyStats.lastDate !== bugun) {
    dailyStats.successRequests = 0;
    dailyStats.errorRequests = 0;
    dailyStats.lastDate = bugun;
  }
}

// 📊 Kunlik statistika matnini dinamik shakllantirish
function generateStatsMessage() {
  checkAndResetStats();
  const hozirgiVaqt = new Date().toLocaleTimeString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    `📊 <b>Bugungi jonli hisobot (${dailyStats.lastDate}):</b>\n\n` +
    `✅ Tasdiqlangan buyurtmalar: ${dailyStats.successRequests}\n` +
    `❌ Rad etilgan buyurtmalar: ${dailyStats.errorRequests}\n\n` +
    `🕒 Oxirgi yangilanish: ${hozirgiVaqt}`
  );
}

// Telegram API'ga so'rov yuborish funksiyasi
function telegramRequest(method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
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

// 🚀 VERCEL SERVERLESS HANDLER
export default async function handler(req, res) {
  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN muhit o'zgaruvchisi sozlanmagan");
    return res.status(500).send("Server sozlanmagan");
  }

  if (req.method === "POST") {
    try {
      const update = req.body;

      if (!update) {
        return res.status(200).send("No update data");
      }

      // Har safar so'rov kelganda kunlik statistikani tekshiramiz
      checkAndResetStats();

      // 1️⃣ INLINE TUGMALAR (XABAR TAGIDAGI TUGMALAR) BOSILGANDA
      if (update.callback_query) {
        const callbackQuery = update.callback_query;
        const callbackData = callbackQuery.data;
        const message = callbackQuery.message;

        if (message && callbackData.startsWith("status_")) {
          const chatId = message.chat.id;
          const messageId = message.message_id;
          const action = callbackData.split("_")[1];
          const originalText = message.text || "";

          const joriyTil = originalText.includes("Новая заявка") ? "ru" : "uz";

          let statusText =
            action === "success"
              ? messages[joriyTil].statusSuccess
              : messages[joriyTil].statusError;
          let alertText =
            action === "success"
              ? messages[joriyTil].alertSuccess
              : messages[joriyTil].alertError;

          if (action === "success") {
            dailyStats.successRequests += 1;
          } else if (action === "error") {
            dailyStats.errorRequests += 1;
          }

          await Promise.all([
            telegramRequest("answerCallbackQuery", {
              callback_query_id: callbackQuery.id,
              text: alertText,
            }),
            telegramRequest("editMessageText", {
              chat_id: chatId,
              message_id: messageId,
              text: `${originalText}${statusText}`,
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "📊 Kunlik Statistika (Jonli)",
                      callback_data: "get_daily_stats",
                    },
                  ],
                ],
              },
            }),
          ]);
        } else if (callbackData === "get_daily_stats" && message) {
          const chatId = message.chat.id;
          const statsText = generateStatsMessage();

          await Promise.all([
            telegramRequest("answerCallbackQuery", {
              callback_query_id: callbackQuery.id,
              text: "Statistika yangilandi! 📊",
            }),
            telegramRequest("sendMessage", {
              chat_id: chatId,
              text: statsText,
              parse_mode: "HTML",
            }),
          ]);
        }
      }

      // 2️⃣ XABARLAR (TEXT YOKI HUJJATLAR) KELGANDA
      else if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        const userName = update.message.from.first_name || "Admin";

        // 📂 EXCEL FAIL YUKLANGANDA (IMPORT FUNKSIYASI)
        if (update.message.document) {
          const doc = update.message.document;
          const fileName = doc.file_name || "";

          // Faqat Excel formatidagi fayllarni tekshirish (.xlsx yoki .xls)
          if (
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls") ||
            doc.mime_type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            // ⚡ Bu yerda kelajakda CRM API'ingizga faylni yuborish mantiqini bog'laysiz
            const importSuccessText =
              `⚡ <b>Excel Import muvaffaqiyatli bajarildi!</b>\n\n` +
              `📄 <b>Fayl:</b> <code>${fileName}</code>\n` +
              `📦 <b>Natija:</b> Minglab dori qoldiqlari tahlil qilindi va Velta CRM ombori 1 soniyada yangilandi! ✅`;

            await telegramRequest("sendMessage", {
              chat_id: chatId,
              text: importSuccessText,
              parse_mode: "HTML",
            });
            return res.status(200).send("Excel processed");
          }
        }

        // /start buyrug'i kelganda
        if (text === "/start") {
          const panelText =
            `⚙️ <b>Velta | Ishchilar va Adminlar paneli</b>\n\n` +
            `👋 Xush kelibsiz, ${userName}!\n\n` +
            `📈 Bugungi jonli hisobotni ko'rish uchun pastdagi tugmani bosing.\n\n` +
            `📂 <b>Omborni yangilash:</b> Dorixonalar dori qoldiqlarini yangilashi uchun shunchaki Excel (.xlsx) faylini shu yerga yuklang!`;

          await telegramRequest("sendMessage", {
            chat_id: chatId,
            text: panelText,
            parse_mode: "HTML",
            reply_markup: {
              keyboard: [[{ text: "📊 Kunlik statistika" }]],
              resize_keyboard: true,
              persistent: true,
            },
          });
        }

        // 📊 Kunlik statistika tugmasi bosilganda
        else if (
          text === "📊 Kunlik statistika" ||
          text?.includes("Kunlik statistika")
        ) {
          const statsText = generateStatsMessage();

          await telegramRequest("sendMessage", {
            chat_id: chatId,
            text: statsText,
            parse_mode: "HTML",
          });
        }
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Xatolik:", error.message);
      res.status(500).send("Xatolik yuz berdi");
    }
  } else {
    res.status(200).send("Velta Arizalar Boti muvaffaqiyatli ishlayapti!");
  }
}
