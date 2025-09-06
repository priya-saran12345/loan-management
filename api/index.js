// api/index.js
import app, { ensureDB } from "../backend/app.js";

let dbReady; // cached promise

export default async function handler(req, res) {
  try {
    if (!dbReady) dbReady = ensureDB(); // start once, reuse next calls
    await dbReady;                       // await safely inside handler
    return app(req, res);                // express-as-handler
  } catch (err) {
    console.error("🔥 Startup/req error:", err);
    const isPreview = process.env.VERCEL_ENV !== "production";
    res.status(500).json({
      error: {
        code: 500,
        message: "Startup failed",
        ...(isPreview ? { detail: String(err?.stack || err) } : {}),
      },
    });
  }
}
