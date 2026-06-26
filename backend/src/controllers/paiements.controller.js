const Paiement = require("../models/Paiement");
const Location = require("../models/Location");


exports.getAllPaiements = async (req, res) => {
  try {
    const { statut, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (statut) filter.statut = statut;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Paiement.find(filter)
        .populate({
          path: "locationId",
          select: "materielId locataireId montantLocation statut dateDebut dateFinPrevue",
          populate: [
            { path: "materielId", select: "nom" },
            { path: "locataireId", select: "nom email" },
          ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Paiement.countDocuments(filter),
    ]);

    res.json({
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.getPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id).populate({
      path: "locationId",
      select: "materielId locataireId montantLocation statut dateDebut dateFinPrevue",
      populate: [
        { path: "materielId", select: "nom photos" },
        { path: "locataireId", select: "nom email telephone" },
      ],
    });
    if (!paiement) return res.status(404).json({ message: "Paiement non trouvé" });
    res.json({ data: paiement });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.updatePaiement = async (req, res) => {
  try {
    const { statut, note } = req.body;
    const validStatuts = ["en_attente", "paye", "rembourse", "partiellement_rembourse", "retenu", "annule"];
    if (statut && !validStatuts.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const update = {};
    if (statut) update.statut = statut;
    if (note !== undefined) update.note = note;

    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    if (!paiement) return res.status(404).json({ message: "Paiement non trouvé" });
    res.json({ message: "Paiement mis à jour", data: paiement });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.getPaiementsStats = async (req, res) => {
  try {
    const [total, enAttente, payes, rembourses] = await Promise.all([
      Paiement.countDocuments(),
      Paiement.countDocuments({ statut: "en_attente" }),
      Paiement.countDocuments({ statut: "paye" }),
      Paiement.countDocuments({ statut: "rembourse" }),
    ]);

    const revenus = await Paiement.aggregate([
      { $match: { statut: "paye", type: "location" } },
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]);

    res.json({
      data: {
        total,
        enAttente,
        payes,
        rembourses,
        totalRevenus: revenus[0]?.total ?? 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
