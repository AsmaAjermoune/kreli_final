const nodemailer = require("nodemailer");

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  return cachedTransporter;
}

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || `Kreli <no-reply@Kreli.ma>`;

  if (!transporter) {
    console.warn(`[Mailer] SMTP not configured â€” would have sent to ${to}: ${subject}`);
    return { skipped: true };
  }

  return transporter.sendMail({ from, to, subject, html, text });
}

function buildResetPasswordEmail({ name, resetUrl }) {
  const safeName = (name || "").trim() || "Utilisateur";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f1f5f9;">
      <div style="background: #ffffff; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #004e98; font-size: 28px; font-weight: 900; margin: 0;">Kreli</h1>
        </div>
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 12px;">Rأ©initialisation de mot de passe</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Bonjour ${safeName},
        </p>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Vous avez demandأ© la rأ©initialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien expire dans <strong>1 heure</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #ff6700; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: 800; font-size: 15px;">
            Rأ©initialiser mon mot de passe
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 24px 0 0;">
          Si vous n'avez pas demandأ© cette rأ©initialisation, ignorez cet email â€” votre mot de passe restera inchangأ©.
        </p>
        <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 16px 0 0; word-break: break-all;">
          Lien direct : <a href="${resetUrl}" style="color: #004e98;">${resetUrl}</a>
        </p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        آ© ${new Date().getFullYear()} Kreli â€” La location professionnelle, rأ©inventأ©e.
      </p>
    </div>
  `;
  const text = `Bonjour ${safeName},\n\nPour rأ©initialiser votre mot de passe Kreli, ouvrez ce lien (valable 1h) :\n${resetUrl}\n\nSi vous n'avez pas fait cette demande, ignorez cet email.`;
  return { html, text };
}

module.exports = { sendMail, buildResetPasswordEmail };
