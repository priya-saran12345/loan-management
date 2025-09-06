import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));
  try {
    // If your MONGODB_URI already contains a db name, DON'T append "/loan"
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri.includes("/") ? uri : `${uri}/loan`, {
      // optional: recommended in serverless
      // bufferCommands: false,
      // maxPoolSize: 5,
    });
    return mongoose;
  } catch (error) {
    console.error("Mongo connect error:", error);
    throw error; // <-- important in serverless
  }
};

export default connectDB;
