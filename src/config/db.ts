import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("⚠️ MONGODB_URI is not defined in the environment variables. The server will fall back to in-memory caching via node-cache.");
    return false;
  }

  try {
    // Set a 5-second timeout for rapid feedback
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");
    return true;
  } catch (error: any) {
    console.error("❌ MongoDB Atlas connection failed:", error.message);
    console.warn("⚠️ The server will fall back to in-memory caching via node-cache.");
    return false;
  }
}
