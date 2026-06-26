const { Schema, model } = require("mongoose");

const commissionConfigSchema = new Schema(
  {
    taux: { type: Number, required: true },
    modifiePar: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "commission_configs" }
);

commissionConfigSchema.index({ createdAt: -1 });

const CommissionConfig = model("CommissionConfig", commissionConfigSchema);

async function getCurrentCommissionTaux() {
  const config = await CommissionConfig.findOne().sort({ createdAt: -1 });
  return config ? config.taux : 10;
}

module.exports = {
  CommissionConfig,
  getCurrentCommissionTaux,
};
