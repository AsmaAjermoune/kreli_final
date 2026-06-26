const { Schema, model } = require("mongoose");

const materielSchema = new Schema(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    photos: [
      {
        url: { type: String, required: true },
        ordre: { type: Number, default: 0 },
      },
    ],
    prixParJour: { type: Number, required: true, min: 0 },
    caution: { type: Number, required: true, default: 0, min: 0 },
    localisation: { type: String, default: "" },
    etat: {
      type: String,
      enum: ["neuf", "bon_etat", "usage"],
      required: true,
    },
    disponible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    proprietaireId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categorieId: { type: Schema.Types.ObjectId, ref: "Categorie", required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], 
      },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "materiels" }
);

materielSchema.index({ proprietaireId: 1 });
materielSchema.index({ categorieId: 1 });
materielSchema.index({ disponible: 1 });
materielSchema.index({ localisation: 1 });
materielSchema.index({ prixParJour: 1 });
materielSchema.index({ nom: "text", description: "text" });
materielSchema.index({ location: "2dsphere" }, { sparse: true });
materielSchema.index({ categorieId: 1, disponible: 1 });
materielSchema.index({ categorieId: 1, prixParJour: 1 });

module.exports = model("Materiel", materielSchema);
