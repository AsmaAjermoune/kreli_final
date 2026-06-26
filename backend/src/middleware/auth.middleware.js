const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.id,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      statut: decoded.statut,
    };

    if (req.user.statut === "suspendu" || req.user.statut === "bloque") {
      return res.status(403).json({ message: "Compte non autorise" });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const isAuthorized =
      roles.includes(req.user.role) ||
      (req.user.role === "both" &&
        (roles.includes("locataire") || roles.includes("proprietaire")));

    if (!isAuthorized) {
      return res.status(403).json({ message: "Acces refuse" });
    }

    return next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
};
