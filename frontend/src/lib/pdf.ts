

import type { Location } from "@/lib/api";

export type PayRow = {
  id: string;
  date: string;
  materielNom: string;
  materielRef: string;
  montant: number;
  caution: number;
  statut: string;
  type: "location" | "caution";
};

export const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  en_cours: "En cours",
  terminee: "Terminée",
  en_retard: "En retard",
  en_litige: "En litige",
  refusee: "Refusée",
  annulee: "Annulée",
};

const fmtMAD = (n: number) => n.toLocaleString("fr-MA", { minimumFractionDigits: 2 }) + " MAD";

function openPrintWindow(html: string, width: number, height: number) {
  const win = window.open("", "_blank", `width=${width},height=${height}`);
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export function exportReceiptPdf(row: PayRow) {
  const date = row.date
    ? new Date(row.date).toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" })
    : "—";
  const statut = STATUT_LABELS[row.statut] ?? row.statut;
  const total = fmtMAD(row.montant + row.caution);
  const montant = fmtMAD(row.montant);
  const caution = fmtMAD(row.caution);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Reçu ${row.materielRef}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #0F172A; }
    .page { max-width: 600px; margin: 40px auto; padding: 0 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 24px; border-bottom: 2px solid #F1F5F9; }
    .brand { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
    .brand span { color: #F97316; }
    .badge { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #64748B; }
    .title { margin-top: 32px; }
    .title h1 { font-size: 20px; font-weight: 900; }
    .title p { margin-top: 4px; font-size: 13px; color: #94A3B8; }
    .card { margin-top: 24px; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; }
    .card-header { background: #F8FAFC; padding: 14px 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #F1F5F9; }
    .row:first-of-type { border-top: none; }
    .label { font-size: 13px; color: #64748B; }
    .value { font-size: 13px; font-weight: 700; color: #0F172A; }
    .value.orange { color: #F97316; }
    .total-row { background: #0F172A; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
    .total-label { color: #94A3B8; font-size: 13px; font-weight: 700; }
    .total-value { color: #fff; font-size: 18px; font-weight: 900; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #CBD5E1; padding-bottom: 40px; }
    .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #F0FDF4; color: #16A34A; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">Kreli<span>.</span></div>
      <div class="badge">Reçu de location</div>
    </div>
    <div class="title">
      <h1>${row.materielNom}</h1>
      <p>Référence : ${row.materielRef} &nbsp;·&nbsp; Émis le ${date}</p>
    </div>
    <div class="card">
      <div class="card-header">Détail de la transaction</div>
      <div class="row"><span class="label">Matériel</span><span class="value">${row.materielNom}</span></div>
      <div class="row"><span class="label">Référence</span><span class="value">${row.materielRef}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
      <div class="row"><span class="label">Statut</span><span class="value"><span class="pill">${statut}</span></span></div>
      <div class="row"><span class="label">Montant location</span><span class="value orange">${montant}</span></div>
      <div class="row"><span class="label">Caution</span><span class="value">${caution}</span></div>
      <div class="total-row"><span class="total-label">TOTAL</span><span class="total-value">${total}</span></div>
    </div>
    <div class="footer">Kreli — Marketplace de location d'équipements au Maroc<br/>Ce document est généré automatiquement et fait foi de reçu.</div>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  openPrintWindow(html, 700, 900);
}

export function exportStatementPdf({
  rows,
  totalPaye,
  cautionsBloquees,
}: {
  rows: PayRow[];
  totalPaye: number;
  cautionsBloquees: number;
}) {
  const today = new Date().toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" });

  const tableRows = rows.map((r) => {
    const date = r.date
      ? new Date(r.date).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" })
      : "—";
    const statut = STATUT_LABELS[r.statut] ?? r.statut;
    return `<tr>
        <td>${date}</td>
        <td>${r.materielNom}</td>
        <td style="color:#94A3B8;font-size:11px">${r.materielRef}</td>
        <td><span class="pill pill-${r.statut}">${statut}</span></td>
        <td style="text-align:right;font-weight:700;color:#F97316">${fmtMAD(r.montant)}</td>
        <td style="text-align:right;color:#64748B">${fmtMAD(r.caution)}</td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Paiements — Kreli</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#0F172A;font-size:13px}
    .page{max-width:820px;margin:40px auto;padding:0 32px}
    .header{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #F1F5F9}
    .brand{font-size:24px;font-weight:900;letter-spacing:-0.5px}
    .brand span{color:#F97316}
    .meta{text-align:right;font-size:12px;color:#94A3B8;line-height:1.6}
    .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:28px 0}
    .kpi{border:1px solid #E2E8F0;border-radius:12px;padding:14px 16px}
    .kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94A3B8}
    .kpi-value{font-size:18px;font-weight:900;color:#0F172A;margin-top:4px}
    .kpi-value.orange{color:#F97316}
    h2{font-size:14px;font-weight:800;color:#0F172A;margin-bottom:12px}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#F8FAFC}
    th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94A3B8;padding:10px 12px;border-bottom:1px solid #E2E8F0}
    td{padding:11px 12px;border-bottom:1px solid #F8FAFC;font-size:12px;color:#0F172A;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    .pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
    .pill-terminee{background:#F0FDF4;color:#16A34A}
    .pill-en_cours{background:#EFF6FF;color:#2563EB}
    .pill-en_attente{background:#FFF7ED;color:#EA580C}
    .pill-acceptee{background:#F0FDF4;color:#16A34A}
    .pill-en_retard{background:#FEF2F2;color:#DC2626}
    .pill-en_litige{background:#FEFCE8;color:#D97706}
    .total-bar{background:#0F172A;border-radius:12px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;margin-top:16px}
    .total-label{color:#94A3B8;font-size:12px;font-weight:700}
    .total-value{color:#fff;font-size:20px;font-weight:900}
    .footer{margin-top:36px;text-align:center;font-size:10px;color:#CBD5E1;padding-bottom:40px}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">Kreli<span>.</span></div>
    <div class="meta">Relevé de paiements<br/>Généré le ${today}</div>
  </div>
  <div class="summary">
    <div class="kpi"><div class="kpi-label">Total payé</div><div class="kpi-value orange">${fmtMAD(totalPaye)}</div></div>
    <div class="kpi"><div class="kpi-label">Cautions bloquées</div><div class="kpi-value">${fmtMAD(cautionsBloquees)}</div></div>
    <div class="kpi"><div class="kpi-label">Transactions</div><div class="kpi-value">${rows.length}</div></div>
  </div>
  <h2>Historique des transactions (${rows.length})</h2>
  <table>
    <thead><tr>
      <th>Date</th><th>Matériel</th><th>Référence</th><th>Statut</th>
      <th style="text-align:right">Montant</th><th style="text-align:right">Caution</th>
    </tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  <div class="total-bar">
    <span class="total-label">TOTAL PAYÉ</span>
    <span class="total-value">${fmtMAD(totalPaye)}</span>
  </div>
  <div class="footer">Kreli — Marketplace de location d'équipements au Maroc<br/>Document généré automatiquement.</div>
</div>
<script>window.onload=()=>{window.print();}<\/script>
</body>
</html>`;

  openPrintWindow(html, 900, 1000);
}

export function exportLocationsReportPdf(
  locs: Location[],
  summary: { totalDepenses: number; enAttente: number; enCours: number; terminees: number }
) {
  const today = new Date().toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" });
  const totalDepenses = summary.totalDepenses.toLocaleString("fr-MA", { minimumFractionDigits: 2 });

  const rows = locs
    .filter((l) => l.statut !== "annulee" && l.statut !== "refusee")
    .map((l) => {
      const nom = (l.materielId as unknown as { nom?: string })?.nom ?? "—";
      const ref = `LOC-${l._id.slice(-5).toUpperCase()}`;
      const start = new Date(l.dateDebut).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
      const end = new Date(l.dateFinPrevue).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
      const statut = STATUT_LABELS[l.statut] ?? l.statut;
      const montant = l.montantLocation.toLocaleString("fr-MA", { minimumFractionDigits: 2 }) + " MAD";
      const caution = l.cautionMontant.toLocaleString("fr-MA", { minimumFractionDigits: 2 }) + " MAD";
      return `<tr>
            <td>${nom}</td>
            <td style="color:#94A3B8">${ref}</td>
            <td>${start} → ${end}</td>
            <td><span class="pill pill-${l.statut}">${statut}</span></td>
            <td style="text-align:right;font-weight:700;color:#F97316">${montant}</td>
            <td style="text-align:right;color:#64748B">${caution}</td>
          </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Rapport locations — Kreli</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#0F172A;font-size:13px}
    .page{max-width:820px;margin:40px auto;padding:0 32px}
    .header{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:2px solid #F1F5F9}
    .brand{font-size:24px;font-weight:900;letter-spacing:-0.5px}
    .brand span{color:#F97316}
    .meta{text-align:right;font-size:12px;color:#94A3B8;line-height:1.6}
    .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:28px 0}
    .kpi{border:1px solid #E2E8F0;border-radius:12px;padding:14px 16px}
    .kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94A3B8}
    .kpi-value{font-size:20px;font-weight:900;color:#0F172A;margin-top:4px}
    .kpi-value.orange{color:#F97316}
    h2{font-size:14px;font-weight:800;color:#0F172A;margin-bottom:12px}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#F8FAFC}
    th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94A3B8;padding:10px 12px;border-bottom:1px solid #E2E8F0}
    td{padding:11px 12px;border-bottom:1px solid #F8FAFC;font-size:12px;color:#0F172A;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    .pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
    .pill-terminee{background:#F0FDF4;color:#16A34A}
    .pill-en_cours{background:#EFF6FF;color:#2563EB}
    .pill-en_attente{background:#FFF7ED;color:#EA580C}
    .pill-acceptee{background:#F0FDF4;color:#16A34A}
    .pill-en_retard{background:#FEF2F2;color:#DC2626}
    .pill-en_litige{background:#FEFCE8;color:#D97706}
    .total-bar{background:#0F172A;border-radius:12px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;margin-top:16px}
    .total-label{color:#94A3B8;font-size:12px;font-weight:700}
    .total-value{color:#fff;font-size:20px;font-weight:900}
    .footer{margin-top:36px;text-align:center;font-size:10px;color:#CBD5E1;padding-bottom:40px}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">Kreli<span>.</span></div>
    <div class="meta">Rapport de locations<br/>Généré le ${today}</div>
  </div>

  <div class="summary">
    <div class="kpi"><div class="kpi-label">Total dépensé</div><div class="kpi-value orange">${totalDepenses} MAD</div></div>
    <div class="kpi"><div class="kpi-label">En attente</div><div class="kpi-value">${summary.enAttente}</div></div>
    <div class="kpi"><div class="kpi-label">En cours</div><div class="kpi-value">${summary.enCours}</div></div>
    <div class="kpi"><div class="kpi-label">Terminées</div><div class="kpi-value">${summary.terminees}</div></div>
  </div>

  <h2>Détail des locations (${locs.length})</h2>
  <table>
    <thead><tr>
      <th>Matériel</th><th>Référence</th><th>Période</th><th>Statut</th>
      <th style="text-align:right">Montant</th><th style="text-align:right">Caution</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="total-bar">
    <span class="total-label">TOTAL DÉPENSÉ</span>
    <span class="total-value">${totalDepenses} MAD</span>
  </div>

  <div class="footer">Kreli — Marketplace de location d'équipements au Maroc<br/>Document généré automatiquement.</div>
</div>
<script>window.onload=()=>{window.print()}<\/script>
</body>
</html>`;

  openPrintWindow(html, 900, 1000);
}
