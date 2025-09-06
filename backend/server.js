// backend/server.js
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app, { ensureDB } from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 4000;

(async () => {
  await ensureDB();

  // लोकल पर React build सर्व करना चाहें तो:
  // Vite build path:
  const FRONTEND_DIR = path.join(__dirname, "../frontend/dist");
  // (अगर CRA है तो ../frontend/build)

  app.use(express.static(FRONTEND_DIR));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(FRONTEND_DIR, "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})();
