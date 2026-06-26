"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, RefreshCw, Download, TrendingUp } from "lucide-react";
import { getMyLocations, formatPrice, type Location } from "@/lib/api";
import { exportReceiptPdf, exportStatementPdf, STATUT_LABELS, type PayRow } from "@/lib/pdf";
import { TransactionsTable } from "./TransactionsTable";

function toRows(locs: Location[]): PayRow[] {
  return locs
    .filter((l) => l.statut !== "annulee" && l.statut !== "refusee")
    .map((l) => ({
      id: l._id,
      date: l.createdAt ?? "",
      materielNom: (l.materielId as unknown as { nom?: string })?.nom ?? "Matériel",
      materielRef: `LOC-${l._id.slice(-5).toUpperCase()}`,
      montant: l.montantLocation,
      caution: l.cautionMontant,
      statut: l.statut,
      type: "location" as const,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const ITEM = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

const PAGE_SIZE = 8;

function StatCard({
  icon: Icon,
  label,
  sub,
  value,
  iconBg,
  iconColor,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  sub?: string;
  value: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
}) {
  return (
    <motion.div
      variants={ITEM}
      className="relative overflow-hidden rounded-[20px] bg-white p-6"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">{label}</p>
        <p className="mt-1 text-2xl font-black text-[#0F172A]">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>
    </motion.div>
  );
}

export default function PaiementsPage() {
  const [locs, setLocs] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [filterStatut, setFilterStatut] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    getMyLocations({ limit: 200 })
      .then((d) => setLocs(d.data ?? []))
      .catch(() => setLocs([]))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => toRows(locs), [locs]);

  const totalPaye = useMemo(
    () => rows.filter((r) => ["terminee", "en_cours", "acceptee"].includes(r.statut)).reduce((s, r) => s + r.montant, 0),
    [rows]
  );
  const cautionsBloquees = useMemo(
    () => rows.filter((r) => ["en_cours", "en_retard"].includes(r.statut)).reduce((s, r) => s + r.caution, 0),
    [rows]
  );
  const remboursements = 0;

  function exportAllPdf() {
    setExporting(true);
    exportStatementPdf({ rows, totalPaye, cautionsBloquees });
    setExporting(false);
  }

  const filteredRows = useMemo(
    () => (filterStatut ? rows.filter((r) => r.statut === filterStatut) : rows),
    [rows, filterStatut]
  );

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const paginated = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-5 p-6 lg:p-8">
        <div className="h-8 w-52 animate-pulse rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[20px] bg-white" style={{ border: "1px solid #E2E8F0" }} />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-[20px] bg-white" style={{ border: "1px solid #E2E8F0" }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6 lg:p-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] lg:text-3xl">Mes Paiements</h1>
        </div>
        <button
          onClick={exportAllPdf}
          disabled={exporting}
          className="hidden items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition-all hover:shadow-md disabled:opacity-60 sm:flex"
          style={{ borderColor: "#E2E8F0" }}
        >
          {exporting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0F172A]" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {exporting ? "Génération…" : "Télécharger"}
        </button>
      </div>

      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          icon={CreditCard}
          label="Total payé"
          value={formatPrice(totalPaye)}
          iconBg="#FFF7ED"
          iconColor="#F97316"
        />
        <StatCard
          icon={Lock}
          label="Cautions bloquées"
          value={formatPrice(cautionsBloquees)}
          iconBg="#FEFCE8"
          iconColor="#CA8A04"
        />
        <StatCard
          icon={RefreshCw}
          label="Remboursements"
          value={formatPrice(remboursements)}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="overflow-hidden rounded-[20px] bg-white"
        style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
      >

        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #F1F5F9" }}
        >
          <div className="flex items-center gap-3">

            <div>
              <h2 className="font-bold text-[#0F172A]">Historique des transactions</h2>

            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-50"
              style={{
                borderColor: filterStatut ? "#F97316" : "#E2E8F0",
                color: filterStatut ? "#F97316" : "#64748B",
                background: filterStatut ? "#FFF7ED" : undefined,
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {filterStatut ? STATUT_LABELS[filterStatut] : "Filtrer"}
            </button>

            {showFilter && (
              <div
                className="absolute right-0 top-full z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl bg-white p-1.5 shadow-lg"
                style={{ border: "1px solid #E2E8F0" }}
              >
                {[
                  { key: "", label: "Toutes" },
                  { key: "en_attente", label: "En attente" },
                  { key: "acceptee", label: "Acceptée" },
                  { key: "en_cours", label: "En cours" },
                  { key: "terminee", label: "Terminée" },
                  { key: "en_retard", label: "En retard" },
                  { key: "en_litige", label: "En litige" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setFilterStatut(key);
                      setPage(1);
                      setShowFilter(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-slate-50"
                    style={{ color: filterStatut === key ? "#F97316" : "#0F172A" }}
                  >
                    {filterStatut === key && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <TransactionsTable
          rows={paginated}
          totalCount={filteredRows.length}
          page={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onExportRow={exportReceiptPdf}
        />
      </motion.div>
    </div>
  );
}
