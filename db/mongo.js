// db/mongo.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Node.js Driver 4+ doesn't need useNewUrlParser or useUnifiedTopology
    });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
}

module.exports = connectMongo;

