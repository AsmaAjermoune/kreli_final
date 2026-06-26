const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    destinataireId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["reservation", "paiement", "message", "litige", "retard", "compte", "materiel"],
      required: true,
    },
    titre: { type: String, required: true },
    contenu: { type: String, required: true },
    lu: { type: Boolean, default: false },
    lienRedirection: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "notifications" }
);

notificationSchema.index({ destinataireId: 1, lu: 1 });
notificationSchema.index({ destinataireId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = model("Notification", notificationSchema);
