// api/index.js
import app, { ensureDB } from "../backend/app.js";

// ❗ Serverless में हैंडलर लोड होते ही DB connect
await ensureDB();

export default app;
