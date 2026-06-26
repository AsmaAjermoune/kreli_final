const Notification = require("../models/Notification");

async function getMyNotifications(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ destinataireId: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Notification.countDocuments({ destinataireId: req.user._id, lu: false }),
    ]);

    res.json({ data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function markOneRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, destinataireId: req.user._id },
      { lu: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification introuvable" });
    res.json({ data: notification });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { destinataireId: req.user._id, lu: false },
      { lu: true }
    );
    res.json({ message: "Toutes les notifications marquées comme lues" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { getMyNotifications, markOneRead, markAllRead };
