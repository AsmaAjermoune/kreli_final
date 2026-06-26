"use client";

import { MapPin, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import LocationFilter from "@/components/catalogue/LocationFilter";
import { useI18n } from "@/context/I18nContext";
import type { Category } from "@/lib/api";

export function CatalogueFilters({
  q,
  categories,
  selectedCategories,
  priceRange,
  priceMax,
  ville,
  rayon,
  lat,
  lng,
  disponibilite,
  hasFilters,
  onPushFilter,
  onToggleCategory,
  onPriceChange,
  onApplyPriceRange,
  onApplyLocation,
  onReset,
}: {
  q: string;
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  priceMax: number;
  ville: string;
  rayon: number;
  lat?: number;
  lng?: number;
  disponibilite: string;
  hasFilters: boolean;
  onPushFilter: (updates: Record<string, string | null>) => void;
  onToggleCategory: (id: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onApplyPriceRange: (min: number, max: number) => void;
  onApplyLocation: (ville: string | null, rayon: number | null, lat?: number | null, lng?: number | null) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-6 text-sm">

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.search_label")}
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#ff6700" }} />
          <Input
            placeholder={t("catalogue.search_placeholder")}
            value={q}
            onChange={(e) => onPushFilter({ q: e.target.value || null })}
            className="rounded-xl border-0 pl-9 text-sm text-[#0f172a] placeholder:text-[#94a3b8] placeholder:opacity-100"
            style={{ backgroundColor: "#f5f5f4" }}
          />
        </div>
      </div>

      <div className="h-px" style={{ background: "linear-gradient(90deg, #ff6700 0%, transparent 100%)", opacity: 0.2 }} />

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.filters_title")}
        </p>
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(255,103,0,0.1)", color: "#ff6700" }}
          >
            <X className="h-3 w-3" />
            {t("catalogue.reset_filters")}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.category")}
        </p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat._id);
            return (
              <button
                key={cat._id}
                onClick={() => onToggleCategory(cat._id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={{
                  backgroundColor: checked ? "rgba(255,103,0,0.08)" : "transparent",
                  border: checked ? "1px solid rgba(255,103,0,0.2)" : "1px solid transparent",
                }}
              >
                <div
                  className="w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 transition-all"
                  style={{
                    backgroundColor: checked ? "#ff6700" : "transparent",
                    border: checked ? "2px solid #ff6700" : "2px solid #cbd5e1",
                  }}
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm font-medium "
                  style={{ color: checked ? "#ff6700" : "#475569" }}
                >
                  {cat.nom}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, var(--lm-line) 50%, transparent 100%)" }} />

      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.price_range")} (DH)
        </p>
        <Slider
          value={priceRange}
          onValueChange={(val) => onPriceChange(val as [number, number])}
          onValueCommitted={(val) => {
            const arr = val as readonly number[];
            onApplyPriceRange(arr[0], arr[1]);
          }}
          max={priceMax}
          step={100}
          className="py-2"
        />
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex-1 text-center rounded-xl px-3 py-2 text-xs font-bold"
            style={{ backgroundColor: "rgba(255,103,0,0.08)", color: "#ff6700" }}
          >
            {priceRange[0].toLocaleString()} DH
          </div>
          <div className="text-xs font-medium" style={{ color: "#cbd5e1" }}>—</div>
          <div
            className="flex-1 text-center rounded-xl px-3 py-2 text-xs font-bold"
            style={{ backgroundColor: "rgba(255,103,0,0.08)", color: "#ff6700" }}
          >
            {priceRange[1] >= priceMax ? `${priceMax.toLocaleString()}+ DH` : `${priceRange[1].toLocaleString()} DH`}
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, var(--lm-line) 50%, transparent 100%)" }} />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.city")}
        </p>
        <LocationFilter ville={ville} rayon={rayon} lat={lat} lng={lng} onApply={onApplyLocation} />

        {ville && (
          <div
            className="flex items-center gap-3 rounded-xl px-3 py-3"
            style={{
              background: "linear-gradient(135deg, rgba(255,103,0,0.06) 0%, rgba(255,103,0,0.02) 100%)",
              border: "1px solid rgba(255,103,0,0.18)",
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,103,0,0.12)" }}
            >
              <MapPin className="h-4 w-4" style={{ color: "#ff6700" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold" style={{ color: "#0f172a" }}>{ville}</p>
              <p className="text-[11px] font-medium" style={{ color: "#ff6700" }}>
                Rayon : {rayon || 50} km
              </p>
            </div>
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,103,0,0.1)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ff6700" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        )}
        {!ville && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: "var(--lm-bone)", border: "1px dashed var(--lm-line)" }}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#cbd5e1" }} />
            <p className="text-[11px]" style={{ color: "#94a3b8" }}>
              Cliquez ci-dessus pour filtrer par zone géographique
            </p>
          </div>
        )}
      </div>

      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent 0%, var(--lm-line) 50%, transparent 100%)" }} />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] ">
          {t("catalogue.availability")}
        </p>
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 "
          style={{ backgroundColor: disponibilite === "disponible" ? "rgba(255,103,0,0.06)" : "var(--lm-bone)" }}
        >
          <div>
            <p className="text-sm font-semibold text-[#0f172a] ">{t("catalogue.available_now")}</p>
            <p className="text-xs mt-0.5 text-[#94a3b8] ">{t("catalogue.available_now_hint")}</p>
          </div>
          <Switch
            checked={disponibilite === "disponible"}
            onCheckedChange={(checked) => onPushFilter({ disponibilite: checked ? "disponible" : null })}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
