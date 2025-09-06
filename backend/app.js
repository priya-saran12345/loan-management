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

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS (Vercel पर same-domain होगा; origin:true safe)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// API routes (prefix /api)
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

// API 404
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// --- Ensure single DB connection for serverless ---
let dbReady;
export async function ensureDB() {
  if (!dbReady) dbReady = connectDB();
  return dbReady;
}

export default app;
