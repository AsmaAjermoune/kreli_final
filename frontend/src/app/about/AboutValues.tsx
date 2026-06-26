"use client";

import { ShieldCheck, Zap, Users, TrendingUp } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function AboutValues() {
  const { t } = useI18n();

  const VALUES = [
    { icon: ShieldCheck, title: t("about.value_trust"), body: t("about.value_trust_body") },
    { icon: Zap,         title: t("about.value_speed"), body: t("about.value_speed_body") },
    { icon: Users,       title: t("about.value_community"), body: t("about.value_community_body") },
    { icon: TrendingUp,  title: t("about.value_impact"), body: t("about.value_impact_body") },
  ];

  return (
    <section style={{ background: "var(--lm-bone)" }} className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="mb-14">
          <p className="ab-heading mb-3 text-[11px] font-black uppercase tracking-[2px]" style={{ color: "#ff6700" }}>
            {t("about.values_label")}
          </p>
          <h2
            className="ab-heading font-display font-black leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--lm-ink)" }}
          >
            {t("about.values_title")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="ab-value-card flex flex-col gap-5 rounded-2xl p-7 transition-shadow hover:shadow-lg"
              style={{ background: "var(--lm-surface-card)", border: "1px solid var(--lm-line)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "rgba(255,103,0,0.08)" }}
              >
                <Icon className="h-6 w-6" style={{ color: "#ff6700" }} />
              </div>
              <div>
                <h3 className="mb-2 text-[18px] font-black" style={{ color: "var(--lm-ink)" }}>
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--lm-mid)" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
