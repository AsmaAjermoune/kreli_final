const express = require("express");
const { listCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categories.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", listCategories);
router.post("/", verifyToken, requireRole("admin"), createCategory);
router.put("/:id", verifyToken, requireRole("admin"), updateCategory);
router.delete("/:id", verifyToken, requireRole("admin"), deleteCategory);

module.exports = router;
