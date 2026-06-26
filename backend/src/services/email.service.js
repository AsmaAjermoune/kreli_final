const nodemailer = require("nodemailer");

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  _transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return _transporter;
}

async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] Skipped â€” EMAIL_USER/EMAIL_PASS not configured");
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Kreli <noreply@Kreli.ma>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[Email] Failed to send:", err.message);
  }
}

function locationEndingSoonHtml({ userName, materielNom, dateFinPrevue }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#004e98">Rappel de fin de location â€” Kreli</h2>
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Votre location de <strong>${materielNom}</strong> se termine demain
         (<strong>${new Date(dateFinPrevue).toLocaleDateString("fr-MA")}</strong>).</p>
      <p>Pensez أ  retourner le matأ©riel أ  temps pour أ©viter des frais supplأ©mentaires.</p>
      <p style="margin-top:32px;color:#64748b;font-size:12px">L&apos;أ©quipe Kreli</p>
    </div>`;
}

function pendingLocationHtml({ ownerName, materielNom, locataireName, createdAt }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#004e98">Demande de location en attente â€” Kreli</h2>
      <p>Bonjour <strong>${ownerName}</strong>,</p>
      <p><strong>${locataireName}</strong> attend votre rأ©ponse pour la location de
         <strong>${materielNom}</strong> depuis plus de 24h
         (demande du ${new Date(createdAt).toLocaleDateString("fr-MA")}).</p>
      <p>Connectez-vous أ  votre espace propriأ©taire pour accepter ou refuser la demande.</p>
      <p style="margin-top:32px;color:#64748b;font-size:12px">L&apos;أ©quipe Kreli</p>
    </div>`;
}

module.exports = { sendEmail, locationEndingSoonHtml, pendingLocationHtml };
