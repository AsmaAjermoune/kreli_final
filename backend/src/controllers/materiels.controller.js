const { Materiel, Categorie } = require("../models");
const { citiesWithinRadius, haversineKm, MOROCCAN_CITIES } = require("../utils/cities");

async function listFeaturedMateriels(req, res) {
  try {
    const parsedLimit = parseInt(req.query.limit || "4", 10);
    const limit = Number.isNaN(parsedLimit) ? 4 : Math.max(parsedLimit, 1);
    const materiels = await Materiel.find({ disponible: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categorieId", "nom")
      .lean();

    res.json({ data: materiels });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des matériels en vedette.",
      error: error.message,
    });
  }
}

async function listMateriels(req, res) {
  try {
    const {
      q,
      categorie,
      ville,
      rayon,
      lat,
      lng,
      prixMin,
      prixMax,
      disponibilite,
      page = 1,
      limit: rawLimit = 12,
      sort = "recent",
    } = req.query;

    const parsedLimit = Math.min(parseInt(rawLimit, 10) || 12, 48);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};

    if (q) {
      query.$text = { $search: q };
    }

    if (categorie) {
      const categories = categorie.split(",").filter(Boolean);
      if (categories.length > 0) {
        query.categorieId = { $in: categories };
      }
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRayon = parseInt(rayon, 10);

    if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng) && Number.isFinite(parsedRayon) && parsedRayon > 0) {
      
      
      const nearbyNames = MOROCCAN_CITIES.filter((c) =>
        haversineKm({ lat: parsedLat, lng: parsedLng }, c) <= parsedRayon
      ).map((c) => c.name);

      const geoClause = {
        location: {
          $geoWithin: {
            $centerSphere: [[parsedLng, parsedLat], parsedRayon / 6371],
          },
        },
      };

      if (nearbyNames.length > 0) {
        const nameRegex = nearbyNames
          .map((n) => n.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
          .join("|");
        query.$or = [geoClause, { localisation: { $regex: nameRegex, $options: "i" } }];
      } else {
        query.$or = [geoClause];
      }
    } else if (ville) {
      if (Number.isFinite(parsedRayon) && parsedRayon > 0) {
        const nearby = citiesWithinRadius(ville, parsedRayon);
        if (nearby.length > 0) {
          query.localisation = {
            $regex: nearby
              .map((c) => c.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
              .join("|"),
            $options: "i",
          };
        } else {
          query.localisation = { $regex: ville, $options: "i" };
        }
      } else {
        query.localisation = { $regex: ville, $options: "i" };
      }
    }

    if (prixMin || prixMax) {
      query.prixParJour = {};
      if (prixMin) query.prixParJour.$gte = parseInt(prixMin, 10);
      if (prixMax) query.prixParJour.$lte = parseInt(prixMax, 10);
    }

    if (disponibilite === "disponible") {
      query.disponible = true;
    } else if (disponibilite === "reservation") {
      query.disponible = false;
    } else {
      query.disponible = true;
    }

    const sortObj =
      sort === "price_asc"
        ? { prixParJour: 1 }
        : sort === "price_desc"
        ? { prixParJour: -1 }
        : { createdAt: -1 };

    const [materiels, total] = await Promise.all([
      Materiel.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parsedLimit)
        .populate("categorieId", "nom")
        .lean(),
      Materiel.countDocuments(query),
    ]);

    res.json({
      data: materiels,
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des matériels.",
      error: error.message,
    });
  }
}

async function getMateriel(req, res) {
  try {
    const materiel = await Materiel.findById(req.params.id)
      .populate("categorieId", "nom")
      .populate("proprietaireId", "nom photo telephone")
      .lean();

    if (!materiel) {
      return res.status(404).json({ message: "Matériel introuvable" });
    }

    res.json({ data: materiel });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du matériel.",
      error: error.message,
    });
  }
}

async function getSimilarMateriels(req, res) {
  try {
    const materiel = await Materiel.findById(req.params.id).lean();
    if (!materiel) return res.status(404).json({ message: "Introuvable" });

    const similar = await Materiel.find({
      _id: { $ne: materiel._id },
      categorieId: materiel.categorieId,
      disponible: true,
    })
      .limit(4)
      .populate("categorieId", "nom")
      .lean();

    res.json({ data: similar });
  } catch (error) {
    res.status(500).json({ message: "Erreur", error: error.message });
  }
}

async function createMateriel(req, res) {
  try {
    const { nom, description, photos, prixParJour, caution, localisation, etat, categorieId, lat: bodyLat, lng: bodyLng } = req.body;

    if (!nom || !prixParJour || !categorieId) {
      return res.status(400).json({ message: "Nom, prix et catégorie requis" });
    }

    const categorie = await Categorie.findById(categorieId);
    if (!categorie) return res.status(400).json({ message: "Catégorie invalide" });

    const parsedBodyLat = parseFloat(bodyLat);
    const parsedBodyLng = parseFloat(bodyLng);
    const locationField =
      Number.isFinite(parsedBodyLat) && Number.isFinite(parsedBodyLng)
        ? { type: "Point", coordinates: [parsedBodyLng, parsedBodyLat] }
        : undefined;

    const materiel = new Materiel({
      nom,
      description,
      photos: photos || [],
      prixParJour,
      caution: caution || 0,
      localisation: localisation || "",
      etat: etat || "bon_etat",
      disponible: true,
      featured: false,
      proprietaireId: req.user._id,
      categorieId,
      ...(locationField && { location: locationField }),
    });

    await materiel.save();
    await materiel.populate("categorieId", "nom");

    res.status(201).json({ data: materiel });
  } catch (err) {
    console.error("createMateriel error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function loadOwnedMateriel(req, res) {
  const materiel = await Materiel.findById(req.params.id);
  if (!materiel) {
    res.status(404).json({ message: "Matériel non trouvé" });
    return null;
  }

  const isOwner = materiel.proprietaireId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403).json({ message: "Accès refusé" });
    return null;
  }

  return { materiel, isAdmin };
}

async function updateMateriel(req, res) {
  try {
    const owned = await loadOwnedMateriel(req, res);
    if (!owned) return;
    const { materiel, isAdmin } = owned;

    const allowed = ["nom", "description", "photos", "prixParJour", "caution", "localisation", "etat", "disponible", "categorieId", "location"];
    if (isAdmin) allowed.push("featured");

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        materiel[key] = req.body[key];
      }
    }

    await materiel.save();
    await materiel.populate("categorieId", "nom");

    res.json({ message: "Matériel mis à jour", data: materiel });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteMateriel(req, res) {
  try {
    const owned = await loadOwnedMateriel(req, res);
    if (!owned) return;

    await Materiel.findByIdAndDelete(req.params.id);
    res.json({ message: "Matériel supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getMyMateriels(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const materiels = await Materiel.find({ proprietaireId: req.user._id })
      .populate("categorieId", "nom")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Materiel.countDocuments({ proprietaireId: req.user._id });

    res.json({
      data: materiels,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  listFeaturedMateriels,
  listMateriels,
  getMateriel,
  getSimilarMateriels,
  createMateriel,
  updateMateriel,
  deleteMateriel,
  getMyMateriels,
};
