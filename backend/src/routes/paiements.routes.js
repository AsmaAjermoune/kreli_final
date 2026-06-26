const express = require("express");
const router = express.Router();
const paiementsController = require("../controllers/paiements.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const adminOnly = [verifyToken, requireRole("admin")];

router.get("/stats", ...adminOnly, paiementsController.getPaiementsStats);
router.get("/", ...adminOnly, paiementsController.getAllPaiements);
router.get("/:id", ...adminOnly, paiementsController.getPaiement);
router.patch("/:id", ...adminOnly, paiementsController.updatePaiement);

module.exports = router;
