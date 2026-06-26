const express = require("express");
const {
  listFeaturedMateriels,
  listMateriels,
  getMateriel,
  getSimilarMateriels,
  createMateriel,
  updateMateriel,
  deleteMateriel,
  getMyMateriels,
} = require("../controllers/materiels.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();




router.get("/featured", listFeaturedMateriels);


router.get("/", listMateriels);


router.get("/mine", verifyToken, getMyMateriels);


router.get("/:id/similar", getSimilarMateriels);


router.get("/:id", getMateriel);
router.put("/:id", verifyToken, updateMateriel);
router.delete("/:id", verifyToken, deleteMateriel);


router.post("/", verifyToken, createMateriel);

module.exports = router;
