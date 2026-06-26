const multer = require("multer");
const path = require("path");
const fs = require("fs");

const DIR = "uploads/materiels";
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté. Utilisez JPG, PNG ou WebP."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
