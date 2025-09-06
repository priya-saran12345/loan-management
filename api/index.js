// api/index.js
import app, { ensureDB } from "../backend/app.js";

/** Minimal fallback handler in case init fails */
function fallback(err) {
  return (req, res) => {
    console.error("🔥 Startup error:", err);
    const isPreview = process.env.VERCEL_ENV !== "production";
    res.status(500).json({
      error: {
        code: 500,
        message: "Startup failed",
        ...(isPreview ? { detail: String(err?.stack || err) } : {}),
      },
    });
  };
}

let handler = null;

try {
  console.time("ensureDB");
  await ensureDB();               // ⬅️ यहीं اکثر क्रैश होता है (env/atlas)
  console.timeEnd("ensureDB");

  // app खुद request handler है
  handler = app;
} catch (err) {
  handler = fallback(err);
}

export default (req, res) => handler(req, res);
