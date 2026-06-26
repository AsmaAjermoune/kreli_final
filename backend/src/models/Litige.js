const { Schema, model } = require("mongoose");

const preuveSchema = new Schema(
  {
    soumisParId: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["photo", "texte"] },
    contenu: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const litigeSchema = new Schema(
  {
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    ouvertPar: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "" },
    statut: {
      type: String,
      enum: ["ouvert", "en_cours", "cloture"],
      default: "ouvert",
    },
    preuves: [preuveSchema],
    decisionAdmin: { type: String, default: "" },
    adminId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
  },
  { collection: "litiges" }
);

litigeSchema.index({ locationId: 1 });
litigeSchema.index({ statut: 1 });
litigeSchema.index({ ouvertPar: 1 });

module.exports = model("Litige", litigeSchema);
