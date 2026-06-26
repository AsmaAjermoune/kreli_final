"use client";

import Image from "next/image";
import { useI18n } from "@/context/I18nContext";

const TEAM = [
  {
    name: "Asma Ajermoune",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=AsmaAjermoune&backgroundColor=ff6700&backgroundType=solid",
  },
  {
    name: "Meriem Abbou",
    avatar: "https://api.dicebear.com/9.x/lorelei/svg?seed=MeriemAbbou&backgroundColor=ff6700",
  },
  {
    name: "Youssef Sina",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=YoussefSina&backgroundColor=0A0A09&backgroundType=solid",
  },
  {
    name: "Sara El Orf",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=SaraElOrf&backgroundColor=ff6700&backgroundType=solid",
  },
  {
    name: "Ahmed Amine Nammat",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=AhmedAmineNammat&backgroundColor=1a1a2e&backgroundType=solid",
  },
];

export function AboutTeam() {
  const { t } = useI18n();

  return (
    <section className="bg-[#f5f5f4] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="mb-14">
          <p className="ab-heading mb-3 text-[11px] font-black uppercase tracking-[2px]" style={{ color: "#ff6700" }}>
            {t("about.team_label")}
          </p>
          <h2
            className="ab-heading font-display font-black leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-ink)" }}
          >
            {t("about.team_title")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="ab-team-card rounded-2xl p-6 transition-shadow hover:shadow-lg"
              style={{ background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)" }}
            >
              <div className="mb-5 h-20 w-20 overflow-hidden rounded-2xl" style={{ border: "2px solid var(--lm-line)" }}>
                <Image src={member.avatar} alt={member.name} width={80} height={80} className="h-full w-full object-cover" unoptimized />
              </div>
              <p className="text-[17px] font-black" style={{ color: "var(--lm-ink)" }}>
                {member.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
