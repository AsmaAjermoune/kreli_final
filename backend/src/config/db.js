const mongoose = require("mongoose");
const dns = require("dns");




try {
  dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
} catch {}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("\u2705 MongoDB Atlas \u2014 Kreli DB connect\u00e9");
  } catch (error) {
    console.error("Erreur de connexion MongoDB Atlas:", error.message);
  }
};

module.exports = connectDB;
