const express = require("express");
const router = express.Router();
const litigesController = require("../controllers/litiges.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const adminOnly = [verifyToken, requireRole("admin")];


router.get("/stats", ...adminOnly, litigesController.getLitigesStats);
router.get("/my", verifyToken, litigesController.getMyLitiges);
router.post("/", verifyToken, ...litigesController.createLitige);


router.get("/", ...adminOnly, litigesController.getAllLitiges);
router.get("/:id", ...adminOnly, litigesController.getLitige);
router.patch("/:id/status", ...adminOnly, litigesController.updateLitigeStatus);

module.exports = router;
