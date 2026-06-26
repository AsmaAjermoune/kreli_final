"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLocation, type Location } from "@/lib/api";

export default function ReservationConfirmationPage() {
  const [locationId, setLocationId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("locationId");
    setLocationId(id);
    if (!id) return;
    getLocation(id).then(setLocation).catch(() => setLocation(null));
  }, []);

  const reference = locationId ? `LOC-${locationId.slice(-6).toUpperCase()}` : "—";

  return (
    <div className="min-h-screen bg-[#f5f5f4]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Demande envoyée</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Réservation confirmée</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">
            Votre demande de réservation a été créée. Le propriétaire doit maintenant l’accepter.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">Référence</span>
              <span className="font-black text-slate-950">{reference}</span>
            </div>
            {location && (
              <>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Matériel</span>
                  <span className="text-right font-semibold text-slate-800">{location.materielId?.nom}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Statut</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    <Clock3 className="h-3.5 w-3.5" />
                    En attente
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/locataire/locations"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#ff6700] px-4 text-sm font-bold text-white hover:bg-[#e85d00]"
            >
              Voir mes réservations
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
