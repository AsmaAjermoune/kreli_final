const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { verifyToken } = require("../middleware/auth.middleware");


router.post("/materiel", verifyToken, upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucun fichier reçu" });
  }
  const url = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/materiels/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router;
