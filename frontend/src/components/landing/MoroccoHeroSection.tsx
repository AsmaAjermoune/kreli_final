"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/context/I18nContext";

const CITIES = [
  {
    name: "Casablanca",
    count: 1248,
    x: 581.3,
    y: 228.6,
    showLabel: true,
    labelRight: false,
  },
  {
    name: "Agadir",
    count: 894,
    x: 444,
    y: 405,
    showLabel: true,
    labelRight: true,
  },
  {
    name: "Marrakech",
    count: 612,
    x: 531.2,
    y: 318.7,
    showLabel: false,
    labelRight: true,
  },
  {
    name: "Rabat",
    count: 487,
    x: 644.7,
    y: 171.3,
    showLabel: false,
    labelRight: false,
  },
  {
    name: "Fès",
    count: 312,
    x: 725.4,
    y: 173,
    showLabel: false,
    labelRight: false,
  },
  {
    name: "Tanger",
    count: 142,
    x: 692.1,
    y: 98.1,
    showLabel: true,
    labelRight: false,
  },
];

const CONNECTIONS: [string, string][] = [
  ["Casablanca", "Rabat"],
  ["Casablanca", "Marrakech"],
  ["Marrakech", "Agadir"],
  ["Rabat", "Fès"],
  ["Fès", "Tanger"],
];

function createArc(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const midX = (from.x + to.x) / 2;
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = Math.max(70, dist * 0.4);
  const midY = Math.min(from.y, to.y) - lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

const MAP_VIEWBOX = "100 30 860 970";

export default function MoroccoHeroSection() {
  const [activeCity, setActiveCity] = useState("Casablanca");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim())
      router.push(`/catalogue?q=${encodeURIComponent(query.trim())}`);
    else router.push("/catalogue");
  }

  return (
    <section
      className="relative min-h-[640px] overflow-hidden bg-white lg:h-[720px]">
      <div
        className="absolute hidden lg:block"
        style={{
          bottom: "-12%",
          left: "20%",
          right: "40px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          zIndex: 1,
        }}>
        <div>
          <svg
            viewBox={MAP_VIEWBOX}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              height: "750px",
              width: "auto",
              display: "block",
              filter: "drop-shadow(0 16px 36px rgba(255,103,0,0.14))",
            }}>
            <image
              href="/ma-orange.svg"
              x="0"
              y="0"
              width="1000"
              height="1000"
            />

            
            {CONNECTIONS.map(([fromName, toName]) => {
              const from = CITIES.find((c) => c.name === fromName)!;
              const to = CITIES.find((c) => c.name === toName)!;
              const d = createArc(from, to);
              return (
                <path
                  key={`arc-${fromName}-${toName}`}
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="6 7"
                />
              );
            })}

            {CITIES.map((city) => {
              const isActive = activeCity === city.name;
              return (
                <g
                  key={city.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveCity(city.name)}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isActive ? 30 : 17}
                    fill={
                      isActive
                        ? "rgba(255,255,255,0.32)"
                        : "rgba(255,255,255,0.13)"
                    }
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isActive ? 14 : 8}
                    fill={
                      isActive
                        ? "rgba(255,255,255,0.72)"
                        : "rgba(255,255,255,0.42)"
                    }
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isActive ? 6 : 3.5}
                    fill="white"
                  />
                </g>
              );
            })}

            {CITIES.map((city) => {
              const isActive = activeCity === city.name;
              if (!isActive && !city.showLabel) return null;
              const lw = 200,
                lh = 58;
              const lx = city.labelRight ? city.x + 24 : city.x - lw - 24;
              const ly = city.y - lh / 2;
              return (
                <g key={`lbl-${city.name}`}>
                  <rect
                    x={lx}
                    y={ly}
                    width={lw}
                    height={lh}
                    rx={10}
                    fill="white"
                    style={{
                      filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.18))",
                    }}
                  />
                  <text
                    x={lx + 14}
                    y={ly + 23}
                    fontSize={15}
                    fontWeight="700"
                    fill="#111"
                    fontFamily="system-ui, sans-serif">
                    {city.name}
                  </text>
                  <text
                    x={lx + 14}
                    y={ly + 41}
                    fontSize={12}
                    fill="#888"
                    fontFamily="system-ui, sans-serif">
                    {city.count.toLocaleString("fr-FR")}{" "}
                    {t("morocco_hero.city_available")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      
      <div
        className="relative flex min-h-[640px] max-w-[760px] flex-col justify-center px-6 py-16 sm:px-10 lg:h-[820px] lg:min-h-0 lg:px-16"
        style={{ zIndex: 10 }}>
        
        <h1
          className="mb-6 max-w-[700px] font-display font-black"
          style={{
            color: "#111",
            fontSize: "clamp(3rem, 4.6vw, 4.75rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
          }}>
          <span className="block">
            {t("morocco_hero.title_line1")} {t("morocco_hero.title_line2")}
          </span>
          <span className="mt-1 block">
            <em
              className="mr-[0.18em] font-normal"
              style={{
                fontStyle: "italic",
                fontFamily: 'Georgia, "Palatino Linotype", serif',
                letterSpacing: "-0.02em",
              }}>
              {t("morocco_hero.title_line3")}
            </em>
            <span
              dir="ltr"
              className="inline-block rounded-xl bg-[#ff6700] px-[0.22em] pb-[0.08em] pt-[0.02em] font-black leading-none text-white">
              {t("morocco_hero.rotate_1")}
            </span>
          </span>
        </h1>

        
        <p
          className="mb-8 max-w-[540px] text-[16px] leading-7 sm:text-[17px]"
          style={{ color: "#5f6368" }}>
          {t("morocco_hero.subtitle")}
        </p>

        
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-[560px] items-center gap-2 rounded-2xl border p-2"
          style={{
            background: "#fff",
            borderColor: "#e5e7eb",
            boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
          }}>
          <div
            className="flex min-w-0 flex-1 items-center gap-3 px-3"
            onClick={() => inputRef.current?.focus()}>
            <svg
              className="h-5 w-5 shrink-0 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("morocco_hero.search_placeholder")}
              className="h-12 w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="flex h-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#ff6700] px-5 text-[14px] font-bold text-white hover:bg-[#e85d00]">
            {t("morocco_hero.search_button")}
          </button>
        </form>

      </div>
    </section>
  );
}
