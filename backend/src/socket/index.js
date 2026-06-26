const jwt = require("jsonwebtoken");

const PHONE_RE = /(\+?[\d][\s\-\.]{0,2}){7,}\d/;
const URL_RE = /\b(https?:\/\/|www\.)\S|\b\S+\.(com|net|org|io|ma|fr|info|co)\b/i;

function initSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const uid = socket.userId;

    socket.join(uid);

    const prevCount = onlineUsers.get(uid) ?? 0;
    onlineUsers.set(uid, prevCount + 1);

    if (prevCount === 0) {
      socket.broadcast.emit("user_online", { userId: uid });
    }

    socket.emit("online_users", { userIds: [...onlineUsers.keys()] });

    socket.on("send_message", async ({ conversationId, contenu, imageUrl }) => {
      if (!conversationId || (!contenu?.trim() && !imageUrl)) return;

      if (contenu?.trim() && (PHONE_RE.test(contenu) || URL_RE.test(contenu))) {
        socket.emit("message_error", {
          message: "Les numأ©ros de tأ©lأ©phone et les liens ne sont pas autorisأ©s dans le chat.",
        });
        return;
      }

      try {
        const Conversation = require("../models/Conversation");
        const Message = require("../models/Message");
        const Notification = require("../models/Notification");

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant =
          conversation.locataireId.toString() === uid ||
          conversation.proprietaireId.toString() === uid;
        if (!isParticipant) return;

        const message = await Message.create({
          conversationId,
          expediteurId: uid,
          contenu: contenu?.trim() ?? "",
          ...(imageUrl && { imageUrl }),
        });

        await Conversation.findByIdAndUpdate(conversationId, { dernierMsgAt: new Date() });

        const populated = await message.populate("expediteurId", "nom photo");

        const recipientIsLocataire = conversation.locataireId.toString() !== uid;
        const recipientId = recipientIsLocataire
          ? conversation.locataireId.toString()
          : conversation.proprietaireId.toString();

        io.to(recipientId).emit("receive_message", { conversationId, message: populated });
        socket.emit("receive_message", { conversationId, message: populated });

        const messagesBase = recipientIsLocataire
          ? "/dashboard/locataire/messages"
          : "/dashboard/proprietaire/messages";

        const notification = await Notification.create({
          destinataireId: recipientId,
          type: "message",
          titre: `Nouveau message de ${populated.expediteurId.nom}`,
          contenu: contenu?.trim() ? contenu.trim().slice(0, 100) : "ًں“· Photo",
          lienRedirection: `${messagesBase}?conv=${conversationId}`,
        });

        io.to(recipientId).emit("new_notification", { notification });
      } catch (err) {
        socket.emit("message_error", { message: err.message });
      }
    });

    socket.on("mark_read", async ({ conversationId }) => {
      if (!conversationId) return;

      try {
        const Conversation = require("../models/Conversation");
        const Message = require("../models/Message");

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant =
          conversation.locataireId.toString() === uid ||
          conversation.proprietaireId.toString() === uid;
        if (!isParticipant) return;

        const result = await Message.updateMany(
          { conversationId, expediteurId: { $ne: uid }, lu: false },
          { lu: true }
        );

        if (result.modifiedCount > 0) {
          const senderId =
            conversation.locataireId.toString() === uid
              ? conversation.proprietaireId.toString()
              : conversation.locataireId.toString();

          io.to(senderId).emit("messages_read", { conversationId });
        }
      } catch (err) {
        console.error("[Socket] mark_read error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      const count = (onlineUsers.get(uid) ?? 1) - 1;
      if (count <= 0) {
        onlineUsers.delete(uid);
        socket.broadcast.emit("user_offline", { userId: uid });
      } else {
        onlineUsers.set(uid, count);
      }
    });
  });

  return onlineUsers;
}

module.exports = { initSocket };
