const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
  {
    materielId: { type: Schema.Types.ObjectId, ref: "Materiel", required: true },
    locataireId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dateDebut: { type: Date, required: true },
    dateFinPrevue: { type: Date, required: true },
    dateRetourReelle: { type: Date, default: null },
    statut: {
      type: String,
      enum: [
        "en_attente",
        "acceptee",
        "en_cours",
        "terminee",
        "en_retard",
        "en_litige",
        "refusee",
        "annulee",
      ],
      default: "en_attente",
    },
    nbJours: { type: Number, required: true },
    prixParJour: { type: Number, required: true },
    montantLocation: { type: Number, required: true },
    cautionMontant: { type: Number, required: true },
    commissionTaux: { type: Number, required: true },
    commissionMontant: { type: Number, required: true },
    montantNetProprio: { type: Number, required: true },
    joursRetard: { type: Number, default: 0 },
    penaliteMontant: { type: Number, default: 0 },
    statutCaution: {
      type: String,
      enum: ["bloquee", "restituee", "partiellement_retenue", "retenue"],
      default: "bloquee",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "locations" }
);

locationSchema.index({ materielId: 1 });
locationSchema.index({ locataireId: 1 });
locationSchema.index({ statut: 1 });
locationSchema.index({ dateFinPrevue: 1 });

module.exports = model("Location", locationSchema);
