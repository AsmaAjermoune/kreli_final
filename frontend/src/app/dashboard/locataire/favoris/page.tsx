"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, MapPin, ArrowRight, Loader2, Package, Plus } from "lucide-react";
import { getMyFavoris, toggleFavori, formatPrice, getMaterielImage, type Materiel } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FavorisPage() {
  const { user } = useAuth();
  const [favoris, setFavoris] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyFavoris()
      .then(setFavoris)
      .catch(() => setError("Impossible de charger vos favoris"))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleRemove(materielId: string) {
    setRemoving(materielId);
    try {
      await toggleFavori(materielId);
      setFavoris((prev) => prev.filter((m) => m._id !== materielId));
    } catch {

    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-5 p-6 lg:p-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] lg:text-3xl">Mes Favoris</h1>
        </div>
        {!loading && favoris.length > 0 && (
          <Link
            href="/catalogue"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ background: "#F8812B" }}
          >
            Catalogue
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-[20px] bg-white"
              style={{ border: "1px solid #E2E8F0" }}
            >
              <div className="h-32 bg-slate-100" />
              <div className="px-3.5 py-3 space-y-2">
                <div className="h-3.5 w-3/4 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-4 w-1/3 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="rounded-[20px] px-5 py-4 text-sm font-medium"
          style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
        >
          {error}
        </div>
      ) : favoris.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center rounded-[20px] bg-white py-24 text-center px-6"
          style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
        >
          <div
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "#FFF7ED" }}
          >
            <Heart className="h-8 w-8 text-[#F97316] opacity-50" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-black text-[#0F172A]">
            Aucun favori pour l&apos;instant
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Parcourez le catalogue et cliquez sur le cœur pour sauvegarder un matériel.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#F8812B" }}
            >
              <Search className="h-4 w-4" />
              Parcourir le catalogue
            </Link>
            <Link
              href="/dashboard/locataire"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-bold text-[#0F172A] transition-all hover:bg-slate-50"
            >
              Retour
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {favoris.map((materiel, i) => {
              const img = getMaterielImage(materiel);
              const categorieNom =
                typeof materiel.categorieId === "object"
                  ? (materiel.categorieId as { nom: string })?.nom
                  : "Équipement";
              return (
                <motion.div
                  key={materiel._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative overflow-hidden rounded-[20px] bg-white"
                  style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
                >

                  <button
                    onClick={() => handleRemove(materiel._id)}
                    disabled={removing === materiel._id}
                    className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all hover:scale-110 disabled:opacity-50"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                    title="Retirer des favoris"
                  >
                    {removing === materiel._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />
                    )}
                  </button>

                  <Link href={`/materiel/${materiel._id}`}>

                    <div className="relative h-32 overflow-hidden bg-slate-100">
                      {img ? (
                        <Image
                          src={img}
                          alt={materiel.nom}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-8 w-8 text-slate-300" />
                        </div>
                      )}
                      <span
                        className="absolute left-2.5 bottom-2 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white"
                        style={{ background: "#F97316" }}
                      >
                        {categorieNom}
                      </span>
                      {!materiel.disponible && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-gray-800">
                            Indisponible
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-3.5 py-3">
                      <p className="truncate text-[13px] font-bold text-[#0F172A]">{materiel.nom}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{materiel.localisation || "Non spécifiée"}</span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[15px] font-black text-[#F97316]">
                            {formatPrice(materiel.prixParJour)}
                          </span>
                          <span className="text-[10px] text-slate-400">/j</span>
                        </div>
                        <span
                          className="rounded-lg px-2 py-1 text-[10px] font-bold text-white"
                          style={{ background: "#0F172A" }}
                        >
                          Voir →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
