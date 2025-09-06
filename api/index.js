// api/index.js
import app, { ensureDB } from "../backend/app.js";

// Serverless env में हैंडलर लोड होने पर DB तैयार कर लें
await ensureDB();

// Express app खुद request handler है
export default app;
