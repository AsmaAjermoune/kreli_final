const { Categorie } = require("../models");

async function listCategories(req, res) {
  try {
    const categories = await Categorie.find({}).sort({ nom: 1 }).lean();
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des catégories.", error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    const { nom, description, image } = req.body;
    if (!nom || !nom.trim()) return res.status(400).json({ message: "Le nom est requis" });

    const existing = await Categorie.findOne({ nom: nom.trim() });
    if (existing) return res.status(409).json({ message: "Une catégorie avec ce nom existe déjà" });

    const cat = await Categorie.create({ nom: nom.trim(), description: description?.trim() || "", image: image || "" });
    res.status(201).json({ data: cat });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const { nom, description, image } = req.body;
    const updates = {};
    if (nom !== undefined) updates.nom = nom.trim();
    if (description !== undefined) updates.description = description.trim();
    if (image !== undefined) updates.image = image;

    const cat = await Categorie.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!cat) return res.status(404).json({ message: "Catégorie non trouvée" });
    res.json({ data: cat });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const cat = await Categorie.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: "Catégorie non trouvée" });
    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
