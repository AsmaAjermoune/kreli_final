const { Schema, model } = require("mongoose");

const categorieSchema = new Schema(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "categories" }
);

categorieSchema.index({ nom: 1 });

module.exports = model("Categorie", categorieSchema);
