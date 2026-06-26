const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    materielId: { type: Schema.Types.ObjectId, ref: "Materiel", required: true },
    locataireId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    proprietaireId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dernierMsgAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "conversations" }
);

conversationSchema.index(
  { materielId: 1, locataireId: 1, proprietaireId: 1 },
  { unique: true }
);
conversationSchema.index({ locataireId: 1 });
conversationSchema.index({ proprietaireId: 1 });
conversationSchema.index({ dernierMsgAt: -1 });

module.exports = model("Conversation", conversationSchema);
