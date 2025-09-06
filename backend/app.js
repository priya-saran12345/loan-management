// backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./configs/db.js";

// --- Routes ---
import userRouter from "./routes/userRoute.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import extraIncomeRoutes from "./routes/extraIncomeRoutes.js";
import customerRoutesLra from "./routes/customerRoutesLra.js";

const app = express();

/* -------------------- Env sanity (fail-fast) -------------------- */
function assertEnv(name) {
  if (!process.env[name] || String(process.env[name]).trim() === "") {
    throw new Error(`Missing required env: ${name}`);
  }
}
assertEnv("MONGODB_URI");           // ज़रूरत के हिसाब से और keys जोड़ें
// assertEnv("JWT_SECRET");

/* -------------------- Core middleware -------------------- */
app.set("trust proxy", 1);          // cookies, HTTPS, rate-limiters आदि के लिए
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- CORS --------------------
   NOTE: Vercel पर frontend और API एक ही origin पर होंगे
   (frontend से relative '/api' कॉल करें) → CORS की जरूरत नहीं.
   फिर भी safety के लिए origin:true + credentials रखा है. */
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- Routes -------------------- */
app.get("/api", (_req, res) => res.send("Loan Management System API"));

app.use("/api/user", userRouter);
app.use("/api/employees", employeeRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/customers-stl", customerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/extra-income", extraIncomeRoutes);
app.use("/api/customers-lra", customerRoutesLra);

/* -------------------- Health / Diagnostics -------------------- */
app.get("/api/health", (_req, res) => {
  const need = ["MONGODB_URI" /*, "JWT_SECRET"*/];
  res.json({
    ok: true,
    env: Object.fromEntries(need.map(k => [k, !!process.env[k]])),
    node: process.version,
  });
});

/* -------------------- 404 (API only) -------------------- */
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

/* -------------------- Global Error Handler -------------------- */
app.use((err, req, res, _next) => {
  // पूरा stack Vercel Function Logs में दिखेगा
  console.error("API Error:", err);
  const isPreview = process.env.VERCEL_ENV !== "production";
  res.status(500).json({
    error: {
      code: 500,
      message: "Internal Server Error",
      ...(isPreview ? { stack: String(err.stack || err) } : {}),
    },
  });
});

/* -------------------- Single DB connection (serverless-safe) -------------------- */
let dbReady;
export async function ensureDB() {
  if (!dbReady) dbReady = connectDB();  // connectDB अंदर cached promise/conn रखे
  return dbReady;
}

export default app;
