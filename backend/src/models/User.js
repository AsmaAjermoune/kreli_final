const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    telephone: { type: String, default: "" },
    photo: { type: String, default: "" },
    adresse: { type: String, default: "" },
    role: {
      type: String,
      enum: ["locataire", "proprietaire", "admin", "both"],
      default: "locataire",
    },
    statut: {
      type: String,
      enum: ["actif", "suspendu", "bloque"],
      default: "actif",
    },
    favoris: [{ type: Schema.Types.ObjectId, ref: "Materiel" }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ statut: 1 });

module.exports = model("User", userSchema);
