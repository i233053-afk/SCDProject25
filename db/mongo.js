const mongoose = require("mongoose");

async function connectMongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/nodevault");

    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
}

module.exports = connectMongo;

