// backend/configs/db.js
import mongoose from "mongoose";

let cached = global.__mongoose;
if (!cached) cached = (global.__mongoose = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");

    // Debug logs (Vercel logs में दिखेंगे)
    mongoose.set("debug", process.env.MONGOOSE_DEBUG === "true");
    mongoose.set("strictQuery", true);

    console.log("⏳ Connecting to Mongo…");
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || undefined,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,   // 10s hard fail (hang नहीं)
        socketTimeoutMS: 45000,
      })
      .then((m) => {
        console.log("✅ Mongo connected");
        return m.connection;
      })
      .catch((e) => {
        console.error("❌ Mongo connect error:", e);
        throw e;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
