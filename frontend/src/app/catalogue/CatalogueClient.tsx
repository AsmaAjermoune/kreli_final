"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  X,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getMateriels,
  getCategories,
  type Materiel,
  type Category,
} from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { CataloguePagination } from "./CataloguePagination";
import { CatalogueFilters } from "./CatalogueFilters";
import { DEFAULT_RADIUS_KM } from "@/lib/cities";
import { getUserLocation } from "@/lib/userLocation";
import { useI18n } from "@/context/I18nContext";

type SortOption = "pertinence" | "prix_asc" | "prix_desc" | "recent";
type DisponibiliteOption = "tous" | "disponible" | "reservation";
type ViewMode = "grid" | "list";

interface FilterPill {
  key: string;
  label: string;
  removeKey: string;
  removeValue: string | null;
}

const PAGE_SIZE = 12;
const PRICE_MAX = 10000;
const DEBOUNCE_DELAY = 300;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CatalogueClient() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const q = searchParams.get("q") ?? "";
  const categorieParam = searchParams.get("categorie") ?? "";
  const selectedCategories = useMemo(
    () => (categorieParam ? categorieParam.split(",").filter(Boolean) : []),
    [categorieParam]
  );
  const prixMinParam = Number(searchParams.get("prix_min") ?? "0") || 0;
  const prixMaxParam = Number(searchParams.get("prix_max") ?? "0") || 0;
  const ville = searchParams.get("ville") ?? "";
  const rayon = Number(searchParams.get("rayon") ?? "") || DEFAULT_RADIUS_KM;
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
  const disponibilite = (searchParams.get("disponibilite") ?? "tous") as DisponibiliteOption;
  const sort = (searchParams.get("sort") ?? "pertinence") as SortOption;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [view, setView] = useState<ViewMode>("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    prixMinParam > 0 ? prixMinParam : 0,
    prixMaxParam > 0 ? prixMaxParam : PRICE_MAX,
  ]);

  useEffect(() => {
    setPriceRange([
      prixMinParam > 0 ? prixMinParam : 0,
      prixMaxParam > 0 ? prixMaxParam : PRICE_MAX,
    ]);
  }, [prixMinParam, prixMaxParam]);

  
  useEffect(() => {
    if (ville) return;
    const saved = getUserLocation();
    if (!saved) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("ville", saved.city || "Ma position");
    params.set("rayon", String(DEFAULT_RADIUS_KM));
    params.set("lat", String(saved.lat));
    params.set("lng", String(saved.lng));
    router.replace(`/catalogue?${params.toString()}`);
  }, []);

  function pushFilter(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") params.delete(key);
      else params.set(key, val);
    }
    if (!("page" in updates)) params.delete("page");
    const qs = params.toString();
    router.push(`/catalogue${qs ? `?${qs}` : ""}`);
  }

  function applyLocation(
    nextVille: string | null,
    nextRayon: number | null,
    nextLat: number | null = null,
    nextLng: number | null = null
  ) {
    pushFilter({
      ville: nextVille,
      rayon: nextVille && nextRayon ? String(nextRayon) : null,
      lat: nextLat !== null ? String(nextLat) : null,
      lng: nextLng !== null ? String(nextLng) : null,
    });
  }

  function toggleCategory(slug: string) {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug];
    pushFilter({ categorie: next.length ? next.join(",") : null });
  }

  function applyPriceRange(min: number, max: number) {
    pushFilter({
      prix_min: min > 0 ? String(min) : null,
      prix_max: max < PRICE_MAX ? String(max) : null,
    });
  }

  function resetFilters() {
    setPriceRange([0, PRICE_MAX]);
    router.push("/catalogue");
  }

  function setPageFilter(p: number) {
    pushFilter({ page: String(p) });
  }

  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setApiError(null);
      try {
        const result = await getMateriels({
          q: debouncedQ || undefined,
          categorie: selectedCategories.length ? selectedCategories.join(",") : undefined,
          ville: ville || undefined,
          rayon: ville ? rayon : undefined,
          lat: lat && ville ? lat : undefined,
          lng: lng && ville ? lng : undefined,
          prixMin: prixMinParam > 0 ? prixMinParam : undefined,
          prixMax: prixMaxParam > 0 ? prixMaxParam : undefined,
          disponibilite: disponibilite !== "tous" ? disponibilite : undefined,
          page,
          limit: PAGE_SIZE,
          sort:
            sort === "prix_asc"
              ? "price_asc"
              : sort === "prix_desc"
              ? "price_desc"
              : sort === "recent"
              ? "recent"
              : undefined,
        });
        setMateriels(result.data);
        setTotal(result.total);
        setPages(result.pages);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Erreur de connexion au serveur");
        setMateriels([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategories, prixMinParam, prixMaxParam, ville, rayon, lat, lng, page, sort, debouncedQ, disponibilite]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
    loadCategories();
  }, []);

  const activePills = useMemo<FilterPill[]>(() => {
    const pills: FilterPill[] = [];
    if (q) pills.push({ key: "q", label: `"${q}"`, removeKey: "q", removeValue: null });
    selectedCategories.forEach((slug) => {
      const cat = categories.find((c) => c._id === slug);
      if (cat) {
        const rest = selectedCategories.filter((s) => s !== slug);
        pills.push({
          key: `cat-${slug}`,
          label: cat.nom,
          removeKey: "categorie",
          removeValue: rest.length ? rest.join(",") : null,
        });
      }
    });
    if (prixMinParam > 0) pills.push({ key: "prix_min", label: `≥ ${prixMinParam} DH/j`, removeKey: "prix_min", removeValue: null });
    if (prixMaxParam > 0) pills.push({ key: "prix_max", label: `≤ ${prixMaxParam} DH/j`, removeKey: "prix_max", removeValue: null });
    if (ville) {
      pills.push({
        key: "ville",
        label: `${ville} · ${rayon} km`,
        removeKey: "ville",
        removeValue: null,
      });
    }
    if (disponibilite !== "tous")
      pills.push({
        key: "disponibilite",
        label: disponibilite === "disponible" ? t("catalogue.available_now") : t("catalogue.available"),
        removeKey: "disponibilite",
        removeValue: null,
      });
    return pills;
  }, [q, selectedCategories, prixMinParam, prixMaxParam, ville, rayon, disponibilite, categories]);

  const hasFilters = activePills.length > 0;

  const sidebarContent = (
    <CatalogueFilters
      q={q}
      categories={categories}
      selectedCategories={selectedCategories}
      priceRange={priceRange}
      priceMax={PRICE_MAX}
      ville={ville}
      rayon={rayon}
      lat={lat}
      lng={lng}
      disponibilite={disponibilite}
      hasFilters={hasFilters}
      onPushFilter={pushFilter}
      onToggleCategory={toggleCategory}
      onPriceChange={setPriceRange}
      onApplyPriceRange={applyPriceRange}
      onApplyLocation={applyLocation}
      onReset={resetFilters}
    />
  );

  return (
    <div className="min-h-screen bg-[#f5f5f4]">
      <Navbar />

      
      <div style={{ background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)" }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 sm:py-14">
          <p
            className="mb-3 text-[11px] font-black uppercase tracking-[2px]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {t("hero.label")}
          </p>
          <h1
            className="font-display font-black leading-none text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {t("catalogue.title")}
          </h1>
          <p
            className="mt-4 max-w-xl text-[15px] font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            {t("catalogue.subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="flex items-start gap-6">
          
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div
              className="sticky top-24 rounded-2xl bg-white p-6"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {sidebarContent}
            </div>
          </aside>

          
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[300px] overflow-y-auto bg-white p-6 shadow-2xl">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="mb-5 ml-auto flex h-8 w-8 items-center justify-center rounded-full "
                  style={{ backgroundColor: "var(--lm-bone)" }}
                >
                  <X className="h-4 w-4" style={{ color: "var(--lm-mid)" }} />
                </button>
                {sidebarContent}
              </div>
            </div>
          )}

          
          <main className="min-w-0 flex-1">
            
            <div
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3.5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all hover:opacity-80 lg:hidden"
                  style={{
                    background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                    color: "#ffffff",
                  }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("catalogue.filters_title")}
                  {hasFilters && (
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
                      style={{ backgroundColor: "#ffffff", color: "#ff6700" }}
                    >
                      {activePills.length}
                    </span>
                  )}
                </button>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black" style={{ color: "#ff6700" }}>
                    {loading ? "–" : total}
                  </span>
                  <span className="text-sm font-medium text-[#64748b] ">
                    {total === 1 ? t("catalogue.result") : t("catalogue.results")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) =>
                      pushFilter({ sort: e.target.value === "pertinence" ? null : e.target.value })
                    }
                    className="appearance-none rounded-xl border px-4 py-2 pr-8 text-sm font-semibold outline-none transition-colors text-[#0f172a] "
                    style={{
                      borderColor: "var(--lm-line)",
                      backgroundColor: "var(--lm-bone)",
                    }}
                  >
                    <option value="pertinence">{t("catalogue.sort_relevance")}</option>
                    <option value="prix_asc">{t("catalogue.sort_price_asc")}</option>
                    <option value="prix_desc">{t("catalogue.sort_price_desc")}</option>
                    <option value="recent">{t("catalogue.sort_recent")}</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                    style={{ color: "#94a3b8" }}
                  />
                </div>

                
                <div
                  className="flex items-center gap-0.5 rounded-xl p-1 "
                  style={{ backgroundColor: "var(--lm-bone)" }}
                >
                  <button
                    onClick={() => setView("grid")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                    style={
                      view === "grid"
                        ? {
                            background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                            color: "#ffffff",
                            boxShadow: "0 2px 6px rgba(255,103,0,0.3)",
                          }
                        : { color: "#94a3b8" }
                    }
                    aria-label={t("catalogue.view_grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                    style={
                      view === "list"
                        ? {
                            background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                            color: "#ffffff",
                            boxShadow: "0 2px 6px rgba(255,103,0,0.3)",
                          }
                        : { color: "#94a3b8" }
                    }
                    aria-label={t("catalogue.view_list")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            
            {apiError && (
              <div
                className="mb-5 flex items-center gap-3 rounded-2xl px-5 py-4"
                style={{ background: "rgba(255,77,0,0.07)", border: "1px solid rgba(255,77,0,0.18)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13.5, color: "#FF4D00", fontWeight: 500 }}>{apiError}</span>
              </div>
            )}

            
            {activePills.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {activePills.map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => {
                      const updates: Record<string, string | null> = {
                        [pill.removeKey]: pill.removeValue,
                      };
                      if (pill.removeKey === "ville") {
                        updates.rayon = null;
                        updates.lat = null;
                        updates.lng = null;
                      }
                      pushFilter(updates);
                    }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                      color: "#ffffff",
                      boxShadow: "0 1px 4px rgba(255,103,0,0.3)",
                    }}
                  >
                    <Tag className="h-3 w-3" />
                    {pill.label}
                    <X className="h-3 w-3 opacity-75" />
                  </button>
                ))}
                {activePills.length > 1 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-70 "
                    style={{ borderColor: "var(--lm-line)", color: "var(--lm-mid)", backgroundColor: "var(--lm-surface-card)" }}
                  >
                    {t("catalogue.clear_all")}
                  </button>
                )}
              </div>
            )}

            
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white overflow-hidden animate-pulse" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div className="h-48" style={{ backgroundColor: "var(--lm-bone)" }} />
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-3 w-24 rounded-full" style={{ backgroundColor: "var(--lm-line)" }} />
                      <div className="h-5 w-3/4 rounded-full" style={{ backgroundColor: "var(--lm-line)" }} />
                      <div className="h-px" style={{ backgroundColor: "var(--lm-bone)" }} />
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-20 rounded-full" style={{ backgroundColor: "var(--lm-line)" }} />
                        <div className="h-8 w-24 rounded-xl" style={{ backgroundColor: "var(--lm-line)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            
            {materiels.length === 0 && !loading && (
              <div
                className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
              >
                <div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,103,0,0.1) 0%, rgba(255,103,0,0.05) 100%)",
                    border: "2px dashed rgba(255,103,0,0.25)",
                  }}
                >
                  <Search className="h-9 w-9" style={{ color: "#ff6700", opacity: 0.6 }} />
                </div>
                <p className="text-xl font-black text-[#0f172a] ">
                  {t("catalogue.no_results")}
                </p>
                <p className="mt-2 text-sm max-w-xs text-[#64748b] ">
                  {t("catalogue.no_results_subtitle")}
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-7 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                    boxShadow: "0 4px 14px rgba(255,103,0,0.35)",
                  }}
                >
                  {t("catalogue.reset_filters")}
                </button>
              </div>
            )}

            
            {!loading && materiels.length > 0 && (
              <>
                {view === "grid" ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {materiels.map((p) => (
                      <ProductCard key={p._id} product={p} view="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {materiels.map((p) => (
                      <ProductCard key={p._id} product={p} view="list" />
                    ))}
                  </div>
                )}

                {pages > 1 && (
                  <CataloguePagination current={page} total={pages} onChange={setPageFilter} />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
