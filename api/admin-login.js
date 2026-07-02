import crypto from "crypto";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 soat

function sign(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !SESSION_SECRET) {
    console.error("Admin auth muhit o'zgaruvchilari sozlanmagan (ADMIN_USERNAME/ADMIN_PASSWORD/ADMIN_SESSION_SECRET)");
    return res.status(500).json({ ok: false, error: "Server sozlanmagan" });
  }

  const { username, password } = req.body || {};

  const validUser = typeof username === "string" && safeEqual(username, ADMIN_USERNAME);
  const validPass = typeof password === "string" && safeEqual(password, ADMIN_PASSWORD);

  if (!validUser || !validPass) {
    return res.status(401).json({ ok: false, error: "Login yoki parol noto'g'ri" });
  }

  const exp = Date.now() + SESSION_TTL_MS;
  const token = sign({ u: username, exp }, SESSION_SECRET);

  return res.status(200).json({ ok: true, token, exp });
}
