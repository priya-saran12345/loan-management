import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./configs/db.js";

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

/* ---- Env sanity ---- */
function assertEnv(name) {
  if (!process.env[name] || String(process.env[name]).trim() === "") {
    throw new Error(`Missing required env: ${name}`);
  }
}
assertEnv("MONGODB_URI");

/* ---- Core middleware ---- */
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ---- Routes (NO '/api' prefix here) ---- */
app.get("/", (_req, res) => res.send("Loan Management System API"));
app.get("/health", (_req, res) => {
  const need = ["MONGODB_URI"];
  res.json({ ok: true, env: Object.fromEntries(need.map(k => [k, !!process.env[k]])), node: process.version });
});

app.use("/user", userRouter);
app.use("/employees", employeeRoutes);
app.use("/income", incomeRoutes);
app.use("/expense", expenseRoutes);
app.use("/customers-stl", customerRoutes);
app.use("/payments", paymentRoutes);
app.use("/wallet", walletRoutes);
app.use("/extra-income", extraIncomeRoutes);
app.use("/customers-lra", customerRoutesLra);

/* ---- 404 (API only) ---- */
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

/* ---- Global Error ---- */
app.use((err, _req, res, _next) => {
  console.error("API Error:", err);
  const isPreview = process.env.VERCEL_ENV !== "production";
  res.status(500).json({ error: { code: 500, message: "Internal Server Error", ...(isPreview ? { stack: String(err.stack || err) } : {}) } });
});

/* ---- DB ensure ---- */
let dbReady;
export async function ensureDB() {
  if (!dbReady) dbReady = connectDB();
  return dbReady;
}

export default app;
