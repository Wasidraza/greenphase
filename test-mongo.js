import mongoose from "mongoose";

const uri = "mongodb+srv://wasidraza:wasidraza%40123@cluster0.7gcplpf.mongodb.net/greenphase?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    console.log("⏳ Trying to connect...");
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  }
}

testConnection();
