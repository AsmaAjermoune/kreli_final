"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMateriel, getCategories, updateMateriel, type Category } from "@/lib/api";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { DashCard, Alert, FormField, DashInput, FIELD_CLASS } from "@/components/dashboard/DashboardUI";

const ETAT_OPTIONS = [
  { value: "neuf", label: "Neuf" },
  { value: "bon_etat", label: "Bon état" },
  { value: "usage", label: "Usagé" },
];

export default function EditMaterielPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    description: "",
    categorieId: "",
    prixParJour: "",
    caution: "",
    localisation: "",
    etat: "bon_etat" as "neuf" | "bon_etat" | "usage",
    disponible: true,
    photos: [] as string[],
  });
  const [photoInput, setPhotoInput] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.role !== "proprietaire" && user.role !== "both" && user.role !== "admin")) {
      router.push("/auth/login");
      return;
    }
    Promise.all([getMateriel(id), getCategories()])
      .then(([mat, cats]) => {
        setCategories(cats);
        setForm({
          nom: mat.nom ?? "",
          description: mat.description ?? "",
          categorieId: typeof mat.categorieId === "object" ? mat.categorieId._id : (mat.categorieId ?? ""),
          prixParJour: String(mat.prixParJour ?? ""),
          caution: String(mat.caution ?? ""),
          localisation: mat.localisation ?? "",
          etat: (mat.etat as "neuf" | "bon_etat" | "usage") ?? "bon_etat",
          disponible: mat.disponible ?? true,
          photos: mat.photos?.map((p) => p.url) ?? [],
        });
      })
      .catch(() => setError("Impossible de charger le matériel"))
      .finally(() => setLoading(false));
  }, [authLoading, user, id]);

  function addPhoto() {
    if (photoInput.trim()) {
      setForm({ ...form, photos: [...form.photos, photoInput.trim()] });
      setPhotoInput("");
    }
  }

  function removePhoto(i: number) {
    setForm({ ...form, photos: form.photos.filter((_, idx) => idx !== i) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateMateriel(id, {
        nom: form.nom,
        description: form.description,
        categorieId: form.categorieId as unknown as { _id: string; nom: string },
        prixParJour: Number(form.prixParJour),
        caution: Number(form.caution) || 0,
        localisation: form.localisation,
        etat: form.etat,
        disponible: form.disponible,
        photos: form.photos.map((url) => ({ url })),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/proprietaire/materiels"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#F97316] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link
          href="/dashboard/proprietaire/materiels"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0F172A]"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à mes matériels
        </Link>

        <DashCard>
          <h1 className="mb-6 text-2xl font-black text-[#0F172A]">Modifier le matériel</h1>

          {success && <div className="mb-5"><Alert type="success">Matériel mis à jour ! Redirection...</Alert></div>}
          {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Nom du matériel">
              <DashInput
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex: Perceuse à percussion"
              />
            </FormField>

            <FormField label="Catégorie">
              <select
                required
                value={form.categorieId}
                onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
                className={`${FIELD_CLASS} cursor-pointer`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.nom}</option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Prix / jour (DH)">
                <DashInput
                  type="number"
                  required
                  min="0"
                  value={form.prixParJour}
                  onChange={(e) => setForm({ ...form, prixParJour: e.target.value })}
                  placeholder="100"
                />
              </FormField>
              <FormField label="Caution (DH)">
                <DashInput
                  type="number"
                  min="0"
                  value={form.caution}
                  onChange={(e) => setForm({ ...form, caution: e.target.value })}
                  placeholder="0"
                />
              </FormField>
            </div>

            <FormField label="État">
              <div className="flex gap-6">
                {ETAT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="etat"
                      value={opt.value}
                      checked={form.etat === opt.value}
                      onChange={(e) => setForm({ ...form, etat: e.target.value as "neuf" | "bon_etat" | "usage" })}
                      className="h-4 w-4 accent-[#F97316]"
                    />
                    <span className="text-sm text-[#0F172A]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Localisation">
              <DashInput
                type="text"
                value={form.localisation}
                onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                placeholder="Ex: Casablanca, Maarif"
              />
            </FormField>

            <FormField label="Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${FIELD_CLASS} resize-y`}
                placeholder="Décrivez votre matériel..."
              />
            </FormField>

            <FormField label="Disponibilité">
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  className="relative h-6 w-11 rounded-full transition-colors"
                  style={{ background: form.disponible ? "#F97316" : "#CBD5E1" }}
                  onClick={() => setForm({ ...form, disponible: !form.disponible })}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.disponible ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-600">{form.disponible ? "Disponible à la location" : "Indisponible"}</span>
              </label>
            </FormField>

            <FormField label="Photos (URLs)">
              <div className="flex gap-2">
                <DashInput
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ background: "#0F172A" }}
                >
                  Ajouter
                </button>
              </div>
              {form.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.photos.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
                      <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                      <span className="max-w-[160px] truncate text-[#0F172A]">{url}</span>
                      <button type="button" onClick={() => removePhoto(i)} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                  ))}
                </div>
              )}
            </FormField>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#F97316", boxShadow: "0 4px 14px rgba(249,115,22,0.25)" }}
            >
              {saving ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Enregistrement...</>
              ) : (
                <><Save className="h-4 w-4" />Enregistrer les modifications</>
              )}
            </button>
          </form>
        </DashCard>
      </div>
    </div>
  );
}
