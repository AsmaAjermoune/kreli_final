const { Schema, model } = require("mongoose");

const paiementSchema = new Schema(
  {
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    type: {
      type: String,
      enum: [
        "location",
        "caution",
        "remboursement",
        "remboursement_partiel",
        "penalite",
        "annulation",
      ],
      required: true,
    },
    montant: { type: Number, required: true },
    statut: {
      type: String,
      enum: ["en_attente", "paye", "rembourse", "partiellement_rembourse", "retenu", "annule"],
      default: "en_attente",
    },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "paiements" }
);

paiementSchema.index({ locationId: 1 });
paiementSchema.index({ statut: 1 });
paiementSchema.index({ type: 1 });

module.exports = model("Paiement", paiementSchema);
