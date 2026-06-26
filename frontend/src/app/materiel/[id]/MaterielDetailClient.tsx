"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Share2, Heart, CheckCircle, Lock, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, toggleFavori, getMyFavoris, getApiBaseUrl, type Materiel } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SimilarMateriels } from "./SimilarMateriels";
import { ContactModal } from "./ContactModal";

interface MaterielDetailProps {
  materiel: Materiel;
  similar: Materiel[];
}

function buildImgUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${getApiBaseUrl().replace("/api/v1", "")}/${url}`;
}

function getEtatLabel(etat?: string) {
  const labels: Record<string, string> = { neuf: "Neuf", bon_etat: "Bon état", usage: "Occasion" };
  return etat ? labels[etat] : null;
}

export default function MaterielDetailClient({ materiel, similar }: MaterielDetailProps) {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getMyFavoris()
      .then((list) => setIsFavorite(list.some((m) => m._id === materiel._id)))
      .catch(() => {});
  }, [user, materiel._id]);

  async function handleToggleFavorite() {
    if (!user) {
      router.push(`/auth/login?redirect=/materiel/${materiel._id}`);
      return;
    }
    setFavoriteLoading(true);
    try {
      const result = await toggleFavori(materiel._id);
      setIsFavorite(result.added);
    } catch {
    } finally {
      setFavoriteLoading(false);
    }
  }

  const photos = materiel.photos || [];
  const mainPhoto = photos.length > 0 ? buildImgUrl(photos[selectedPhotoIndex]?.url) : null;
  const categorieNom = typeof materiel.categorieId === "object" ? materiel.categorieId?.nom : "";
  const proprietaire = typeof materiel.proprietaireId === "object" ? materiel.proprietaireId : null;
  const etatLabel = getEtatLabel(materiel.etat);

  const days = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const rentalCost = days > 0 ? days * materiel.prixParJour : 0;
  const serviceFee = 25;
  const total = rentalCost + serviceFee;

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleReserve = () => {
    if (authLoading) return;
    if (!token) {
      router.push(`/auth/login?redirect=/materiel/${materiel._id}`);
      return;
    }
    if (!startDate || !endDate) {
      setReservationError("Veuillez sélectionner les dates de début et de fin.");
      return;
    }
    if (days <= 0) {
      setReservationError("La date de fin doit être après la date de début.");
      return;
    }

    setReservationError(null);
    sessionStorage.setItem(
      "kreli_pending_booking",
      JSON.stringify({
        materielId: materiel._id,
        materielNom: materiel.nom,
        startDate,
        endDate,
        days,
        prixParJour: materiel.prixParJour,
        rentalCost,
        serviceFee,
        total,
        caution: materiel.caution ?? 0,
      })
    );
    router.push("/paiement");
  };

  const handleContact = () => {
    setIsContactOpen(true);
  };

  const handleSendMessage = () => {
    alert("Message envoyé au propriétaire!");
    setIsContactOpen(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted hover:text-slate-950">Accueil</Link>
          <span className="text-muted">/</span>
          <Link href="/catalogue" className="text-muted hover:text-slate-950">Catalogue</Link>
          <span className="text-muted">/</span>
          <span className="font-medium text-ink">{materiel.nom}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          <div>
            
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white">
              {mainPhoto ? (
                <Image src={mainPhoto} alt={materiel.nom} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 60vw" priority />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <span className="text-muted">Pas d'image</span>
                </div>
              )}
              <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50 disabled:opacity-50"
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {favoriteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                ) : (
                  <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-[#ff6700] text-[#ff6700]" : "text-slate-500 hover:text-slate-900"}`} />
                )}
              </button>
              <button className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50">
                <Share2 className="h-5 w-5 text-muted" />
              </button>
            </div>

            
            {photos.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition-all ${selectedPhotoIndex === i ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={buildImgUrl(p.url)} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="112px" />
                  </button>
                ))}
              </div>
            )}

            
            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-ink leading-tight">{materiel.nom}</h1>
                  {categorieNom && <Badge variant="outline" className="mt-2 border-slate-200 bg-white text-slate-600">{categorieNom}</Badge>}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {materiel.localisation || "Maroc"}
                </span>
                {etatLabel && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {etatLabel}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Vérifié
                </span>
              </div>
            </div>

            
            {materiel.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-ink mb-4">Description</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">{materiel.description}</p>
              </div>
            )}

            
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink mb-4">Caractéristiques</h2>
              <Card>
                <CardContent className="p-0">
                  {[
                    { label: "Catégorie", value: categorieNom },
                    { label: "État", value: etatLabel },
                    { label: "Localisation", value: materiel.localisation },
                    { label: "Disponibilité", value: materiel.disponible ? "Disponible" : "Indisponible" },
                  ].filter((r) => r.value).map((row, i) => (
                    <div key={row.label} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <span className="text-muted">{row.label}</span>
                      <span className="font-semibold text-ink">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink mb-4">Localisation</h2>
               <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-muted">
                 <MapPin className="mb-2 h-8 w-8 text-slate-500" />
                <p className="text-sm font-medium">{materiel.localisation || "Maroc"}</p>
                <p className="text-xs mt-1">Voir sur la carte</p>
              </div>
            </div>
          </div>

          
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                
                <div className="mb-6">
                  <div>
                    <span className="text-3xl font-black text-slate-950">{formatPrice(materiel.prixParJour)}</span>
                    <span className="text-sm text-muted ml-1">/jour</span>
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs font-bold text-muted uppercase tracking-wide mb-2 block">Début</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={getMinDate()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-muted uppercase tracking-wide mb-2 block">Fin</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || getMinDate()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                
                {days > 0 && (
                  <div className="space-y-2 border-t pt-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">{formatPrice(materiel.prixParJour)} x {days} jour{days > 1 ? "s" : ""}</span>
                      <span className="font-medium text-ink">{formatPrice(rentalCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Frais de service</span>
                      <span className="font-medium text-ink">{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span className="text-ink">Total</span>
                      <span className="text-lg text-slate-950">{formatPrice(total)}</span>
                    </div>
                  </div>
                )}

                
                {materiel.caution && materiel.caution > 0 && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                    <Lock className="h-4 w-4 shrink-0" />
                    Caution : {formatPrice(materiel.caution)} (non débité)
                  </div>
                )}

                {reservationError && (
                  <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {reservationError}
                  </p>
                )}


                <Button
                  onClick={handleReserve}
                   className="h-12 w-full bg-[#ff6700] text-base font-bold transition-colors hover:bg-[#e85d00]"
                >
                  Réserver maintenant
                </Button>

                
                <Button
                  variant="outline"
                  onClick={handleContact}
                   className="mt-3 w-full border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contacter le propriétaire
                </Button>

                
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs font-bold text-muted uppercase tracking-wide mb-4">Propriétaire</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {proprietaire?.photo ? (
                        <Image src={proprietaire.photo} alt={proprietaire.nom} width={48} height={48} className="rounded-full object-cover" />
                      ) : (
                        proprietaire?.nom?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-ink">{proprietaire?.nom || "Propriétaire"}</p>
                      <p className="text-sm text-muted">Propriétaire vérifié</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
        <SimilarMateriels similar={similar} />
      </div>

      <ContactModal
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        proprietaireNom={proprietaire?.nom || ""}
        materielNom={materiel.nom}
        message={message}
        onMessageChange={setMessage}
        onCancel={() => setIsContactOpen(false)}
        onSend={handleSendMessage}
      />

      <Footer />
    </div>
  );
}
