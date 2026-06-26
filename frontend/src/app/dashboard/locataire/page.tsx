"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLocataireStats,
  getMyLocations,
  getFeaturedMateriels,
  formatPrice,
  type Location,
  type Materiel,
} from "@/lib/api";
import {
  Plus,
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { exportLocationsReportPdf } from "@/lib/pdf";
import { LocationRow, RecoTile } from "./DashboardCards";

interface Stats {
  locations: { enAttente: number; enCours: number; terminees: number; total: number };
  totalDepenses: number;
}

export default function LocataireDashboardPage() {

  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Location[]>([]);
  const [recommended, setRecommended] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  async function exportDashboardPdf() {
    setExporting(true);
    try {
      const allLocs = await getMyLocations({ limit: 200 });
      exportLocationsReportPdf(allLocs.data ?? [], {
        totalDepenses: stats?.totalDepenses ?? 0,
        enAttente: stats?.locations.enAttente ?? 0,
        enCours: stats?.locations.enCours ?? 0,
        terminees: stats?.locations.terminees ?? 0,
      });
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const [statsData, locsData, recsData] = await Promise.all([
          getLocataireStats(),
          getMyLocations({ limit: 4 }),
          getFeaturedMateriels(3),
        ]);
        setStats(statsData);
        setRecent(locsData.data);
        setRecommended(recsData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingCount = stats?.locations.enAttente ?? 0;

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-6 h-8 w-56 animate-pulse rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[20px] bg-white" style={{ border: "1px solid #E2E8F0" }} />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: "En attente",
      value: stats?.locations.enAttente ?? 0,
      icon: Clock,
      iconBg: "#FFF7ED",
      iconColor: "#EA580C",
      accent: pendingCount > 0,
    },
    {
      label: "En cours",
      value: stats?.locations.enCours ?? 0,
      icon: CheckCircle2,
      iconBg: "#F0FDF4",
      iconColor: "#16A34A",
      accent: false,
    },
    {
      label: "Terminées",
      value: stats?.locations.terminees ?? 0,
      icon: Package,
      iconBg: "#F1F5F9",
      iconColor: "#64748B",
      accent: false,
    },
    {
      label: "Total dépensé",
      value: formatPrice(stats?.totalDepenses ?? 0),
      icon: Wallet,
      iconBg: "#FFF7ED",
      iconColor: "#F97316",
      accent: false,
      trend: true,
    },
  ];

  return (
    <div className="p-6 lg:p-8">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] lg:text-3xl">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">

          <Link
            href="/catalogue"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ background: "#F8812B" }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Nouvelle location
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-[20px] bg-white p-5"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: k.iconBg }}
              >
                <k.icon className="h-5 w-5" style={{ color: k.iconColor }} />
              </div>

            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">{k.label}</p>
            <p
              className="mt-1 text-2xl font-black"
              style={{ color: k.accent ? "#F97316" : "#0F172A" }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div
          className="overflow-hidden rounded-[20px] bg-white"
          style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F1F5F9" }}
          >
            <div>
              <h2 className="font-bold text-[#0F172A]">Mes dernières locations</h2>

            </div>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                <Package className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">Aucune location pour le moment.</p>
              <Link
                href="/catalogue"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                style={{ background: "#F97316" }}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <>
              {recent.map((loc, i) => (
                <LocationRow key={loc._id} loc={loc} index={i} />
              ))}
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{ background: "#FAFAFA", borderTop: "1px solid #F1F5F9" }}
              >
                <p className="text-xs text-slate-400">
                  {recent.length} affichée{recent.length > 1 ? "s" : ""} sur {stats?.locations.total ?? 0}
                </p>
                <Link
                  href="/dashboard/locataire/locations"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:underline"
                >
                  Historique complet <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </>
          )}
        </div>

      </div>

      {recommended.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Pour votre prochain chantier</h2>
            </div>

          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommended.map((item) => (
              <RecoTile key={item._id} item={item} />
            ))}
            <Link
              href="/catalogue"
              className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-white p-6 text-center transition-shadow hover:shadow-md"
              style={{ border: "1px dashed #CBD5E1", minHeight: 180 }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "#0F172A" }}
              >
                <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-[#0F172A]">Explorer le catalogue</p>
              <p className="text-[11px] text-slate-400">5 247 références disponibles</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
