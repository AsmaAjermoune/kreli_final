const cron = require("node-cron");
const Location = require("../models/Location");
const User = require("../models/User");
const { sendEmail, locationEndingSoonHtml, pendingLocationHtml } = require("./email.service");


function startReminderCron() {
  cron.schedule("0 8 * * *", async () => {
    console.log("[Cron] Running daily reminders…");
    await Promise.all([remindEndingSoon(), remindPendingLocations()]);
    console.log("[Cron] Daily reminders done.");
  });
}

async function remindEndingSoon() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(0, 0, 0, 0));
    const end = new Date(tomorrow.setHours(23, 59, 59, 999));

    const locations = await Location.find({
      statut: { $in: ["acceptee", "en_cours"] },
      dateFinPrevue: { $gte: start, $lte: end },
    })
      .populate("locataireId", "nom email")
      .populate("materielId", "nom");

    for (const loc of locations) {
      const locataire = loc.locataireId;
      if (!locataire?.email) continue;
      await sendEmail({
        to: locataire.email,
        subject: `Rappel : votre location de ${loc.materielId?.nom} se termine demain`,
        html: locationEndingSoonHtml({
          userName: locataire.nom,
          materielNom: loc.materielId?.nom,
          dateFinPrevue: loc.dateFinPrevue,
        }),
      });
    }
  } catch (err) {
    console.error("[Cron] remindEndingSoon error:", err.message);
  }
}

async function remindPendingLocations() {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const locations = await Location.find({
      statut: "en_attente",
      createdAt: { $lte: cutoff },
    })
      .populate("locataireId", "nom")
      .populate({
        path: "materielId",
        select: "nom proprietaireId",
        populate: { path: "proprietaireId", select: "nom email" },
      });

    for (const loc of locations) {
      const owner = loc.materielId?.proprietaireId;
      if (!owner?.email) continue;
      await sendEmail({
        to: owner.email,
        subject: `Demande en attente : ${loc.materielId?.nom}`,
        html: pendingLocationHtml({
          ownerName: owner.nom,
          materielNom: loc.materielId?.nom,
          locataireName: loc.locataireId?.nom,
          createdAt: loc.createdAt,
        }),
      });
    }
  } catch (err) {
    console.error("[Cron] remindPendingLocations error:", err.message);
  }
}

module.exports = { startReminderCron };
