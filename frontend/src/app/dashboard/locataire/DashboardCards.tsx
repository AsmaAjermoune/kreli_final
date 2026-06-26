"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, getMaterielImage, type Location, type Materiel } from "@/lib/api";
import { Package } from "lucide-react";
import { StatusPill } from "@/components/dashboard/DashboardUI";

export function LocationRow({ loc, index }: { loc: Location; index: number }) {
  const img = getMaterielImage(loc.materielId as unknown as Materiel);
  const start = new Date(loc.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const end = new Date(loc.dateFinPrevue).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const ref = `LOC-${loc._id.slice(-5).toUpperCase()}`;

  return (
    <div
      className="flex items-center gap-4 px-6 py-4"
      style={{ borderTop: index === 0 ? "none" : "1px solid #F1F5F9" }}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {img ? (
          <Image src={img} alt={loc.materielId.nom} fill className="object-cover" sizes="48px" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-5 w-5 text-slate-300" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0F172A]">{loc.materielId.nom}</p>
        <p className="mt-0.5 text-xs text-slate-400">
          {ref} · {start} → {end} · {loc.nbJours}j
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <StatusPill statut={loc.statut} />
        <p className="text-sm font-bold text-[#0F172A]">{formatPrice(loc.montantLocation)}</p>
      </div>
    </div>
  );
}

export function RecoTile({ item }: { item: Materiel }) {
  const img = getMaterielImage(item);
  const city = item.localisation ? item.localisation.split(",")[0] : "Maroc";
  return (
    <Link
      href={`/materiel/${item._id}`}
      className="group overflow-hidden rounded-[20px] bg-white transition-shadow hover:shadow-md"
      style={{ border: "1px solid #E2E8F0" }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {img ? (
          <Image
            src={img}
            alt={item.nom}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="300px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
        )}
        <span
          className="absolute right-2.5 top-2.5 rounded-lg px-2 py-0.5 text-[10px] font-bold"
          style={
            item.disponible === false
              ? { background: "#FEF2F2", color: "#DC2626" }
              : { background: "#F0FDF4", color: "#16A34A" }
          }
        >
          {item.disponible === false ? "Réservé" : "Disponible"}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold text-[#0F172A]">{item.nom}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">{city}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[18px] font-black text-[#F97316]">
            {item.prixParJour}
            <span className="ml-0.5 text-[11px] font-medium text-slate-400"> DH/j</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
