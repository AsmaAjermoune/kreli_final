const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Materiel = require("../models/Materiel");
const { validationResult } = require("express-validator");


async function getOrCreateConversation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { materielId } = req.body;
    const locataireId = req.user.id;

    const materiel = await Materiel.findById(materielId).select("proprietaireId nom");
    if (!materiel) {
      return res.status(404).json({ success: false, message: "Matériel introuvable" });
    }

    const proprietaireId = materiel.proprietaireId.toString();

    if (proprietaireId === locataireId) {
      return res.status(400).json({ success: false, message: "Vous ne pouvez pas vous envoyer un message" });
    }

    let conversation = await Conversation.findOne({ materielId, locataireId, proprietaireId });

    if (!conversation) {
      conversation = await Conversation.create({ materielId, locataireId, proprietaireId });
    }

    await conversation.populate([
      { path: "materielId", select: "nom photos" },
      { path: "locataireId", select: "nom photo" },
      { path: "proprietaireId", select: "nom photo" },
    ]);

    return res.json({ success: true, data: conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


async function getMyConversations(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [{ locataireId: userId }, { proprietaireId: userId }],
    })
      .populate("materielId", "nom photos")
      .populate("locataireId", "nom photo")
      .populate("proprietaireId", "nom photo")
      .sort({ dernierMsgAt: -1 });

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const [unreadCount, lastMessage] = await Promise.all([
          Message.countDocuments({
            conversationId: conv._id,
            expediteurId: { $ne: userId },
            lu: false,
          }),
          Message.findOne({ conversationId: conv._id })
            .sort({ createdAt: -1 })
            .select("contenu createdAt expediteurId"),
        ]);
        return { ...conv.toObject(), unreadCount, lastMessage };
      })
    );

    return res.json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


async function getMessages(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation introuvable" });
    }

    const isParticipant =
      conversation.locataireId.toString() === userId ||
      conversation.proprietaireId.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const messages = await Message.find({ conversationId: id })
      .populate("expediteurId", "nom photo")
      .sort({ createdAt: 1 });

    const updated = await Message.updateMany(
      { conversationId: id, expediteurId: { $ne: userId }, lu: false },
      { $set: { lu: true } }
    );

    
    if (updated.modifiedCount > 0) {
      const senderId =
        conversation.locataireId.toString() === userId
          ? conversation.proprietaireId.toString()
          : conversation.locataireId.toString();

      const io = req.app.get("io");
      if (io) io.to(senderId).emit("messages_read", { conversationId: id });
    }

    return res.json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getOrCreateConversation, getMyConversations, getMessages };
