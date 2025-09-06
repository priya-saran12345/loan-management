import app, { ensureDB } from "../backend/app.js";
import serverless from "serverless-http";

let ready;
const handler = serverless(app); // express → (req,res) handler

export default async function vercelHandler(req, res) {
  try {
    if (!ready) ready = ensureDB(); // single lazy init
    await ready;
    return handler(req, res);
  } catch (err) {
    console.error("🔥 Startup/req error:", err);
    const isPreview = process.env.VERCEL_ENV !== "production";
    res.status(500).json({
      error: { code: 500, message: "Startup failed", ...(isPreview ? { detail: String(err?.stack || err) } : {}) },
    });
  }
}
