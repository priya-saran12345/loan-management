// backend/configs/db.js
import mongoose from "mongoose";

let cached = global.__mongo;
if (!cached) cached = (global.__mongo = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");

    cached.promise = mongoose
      .connect(uri, { dbName: process.env.MONGODB_DB || undefined })
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
