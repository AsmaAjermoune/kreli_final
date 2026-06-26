"use strict";
// Vercel serverless entry — REST API only (Socket.io must run on Railway/Render)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const multer = require("multer");
const mongoose = require("mongoose");

require("../src/models");

const authRouter = require("../src/routes/auth.routes");
const categoriesRouter = require("../src/routes/categories.routes");
const materielsRouter = require("../src/routes/materiels.routes");
const locationsRouter = require("../src/routes/locations.routes");
const usersRouter = require("../src/routes/users.routes");
const conversationsRouter = require("../src/routes/conversations.routes");
const notificationsRouter = require("../src/routes/notifications.routes");
const paiementsRouter = require("../src/routes/paiements.routes");
const litigesRouter = require("../src/routes/litiges.routes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin)) {
    return callback(null, true);
  }
  callback(new Error(`CORS: origin ${origin} not allowed`));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: false }));
app.use(cors({ origin: corsOrigin, credentials: true }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

app.use(globalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/materiels", materielsRouter);
app.use("/api/v1/locations", locationsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/conversations", conversationsRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/paiements", paiementsRouter);
app.use("/api/v1/litiges", litigesRouter);

// On Vercel, disk is ephemeral — returns base64 data URL
// For persistent file storage, deploy backend on Railway/Render instead
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const { verifyToken } = require("../src/middleware/auth.middleware");
app.post("/api/v1/upload/materiel", verifyToken, upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Aucun fichier reçu" });
  const url = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  res.json({ success: true, url });
});

app.get("/api/v1/health", (_req, res) =>
  res.json({ status: "ok", message: "Kreli API running ✅", timestamp: new Date() })
);

// ── DB connection (cached across warm invocations) ────────────────────────────
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      dbConnected = true;
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      return res.status(503).json({ error: "Database unavailable" });
    }
  }
  return app(req, res);
};
