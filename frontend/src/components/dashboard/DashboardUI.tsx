"use client";

import React from "react";
import Link from "next/link";
import { type LucideIcon, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD_STYLE: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
};

export const FIELD_CLASS =
  "w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] transition focus:border-[#F97316] focus:bg-white focus:ring-2 focus:ring-[#F97316]/10";

export function DashCard({
  children,
  className,
  noPad = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("bg-white rounded-[20px]", !noPad && "p-6", className)}
      style={{ ...CARD_STYLE, ...style }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-black tracking-tight text-[#0F172A] lg:text-[26px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  trend?: string;
}) {
  return (
    <DashCard className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: accent ? "#FFF7ED" : "#F8FAFC" }}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.75}
            style={{ color: accent ? "#F97316" : "#64748B" }}
          />
        </div>
        {trend && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          {label}
        </p>
        <p
          className="mt-1 text-[22px] font-black leading-none"
          style={{ color: accent ? "#F97316" : "#0F172A" }}
        >
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-[#94A3B8]">{sub}</p>}
      </div>
    </DashCard>
  );
}

export function StatChip({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[20px] bg-white p-4"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-base font-black text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  en_attente:              { label: "En attente",   bg: "#FFF7ED", color: "#EA580C" },
  acceptee:                { label: "Acceptée",     bg: "#F0FDF4", color: "#16A34A" },
  en_cours:                { label: "En cours",     bg: "#EFF6FF", color: "#2563EB" },
  terminee:                { label: "Terminée",     bg: "#F8FAFC", color: "#475569" },
  en_retard:               { label: "En retard",    bg: "#FEF2F2", color: "#DC2626" },
  en_litige:               { label: "En litige",    bg: "#FEF3C7", color: "#B45309" },
  refusee:                 { label: "Refusée",      bg: "#FEF2F2", color: "#DC2626" },
  annulee:                 { label: "Annulée",      bg: "#F8FAFC", color: "#94A3B8" },
  paye:                    { label: "Payé",         bg: "#F0FDF4", color: "#16A34A" },
  rembourse:               { label: "Remboursé",   bg: "#EEF2FF", color: "#4338CA" },
  partiellement_rembourse: { label: "Part. remb.", bg: "#EEF2FF", color: "#4338CA" },
  retenu:                  { label: "Retenu",       bg: "#FFF7ED", color: "#EA580C" },
  annule:                  { label: "Annulé",       bg: "#F8FAFC", color: "#94A3B8" },
};

export function StatusPill({ statut }: { statut: string }) {
  const cfg = STATUS_MAP[statut] ?? { label: statut, bg: "#F8FAFC", color: "#64748B" };
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize    = "sm" | "md" | "lg";

const BTN_STYLES: Record<BtnVariant, React.CSSProperties> = {
  primary:   { background: "#F97316", color: "#fff" },
  secondary: { background: "#fff", color: "#0F172A", border: "1px solid #E2E8F0" },
  ghost:     { background: "transparent", color: "#64748B" },
  danger:    { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" },
};

const BTN_SIZE: Record<BtnSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-[13px] gap-2",
  lg: "h-11 px-5 text-[13px] gap-2",
};

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: BtnVariant;
  size?: BtnSize;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
}

export function Btn({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  type = "button",
  className,
  title,
}: BtnProps) {
  const base = cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed",
    BTN_SIZE[size],
    className
  );
  const content = loading ? (
    <>
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {children}
    </>
  ) : children;

  if (href && !disabled) {
    return (
      <Link href={href} className={base} style={BTN_STYLES[variant]} title={title}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={base}
      style={BTN_STYLES[variant]}
      title={title}
    >
      {content}
    </button>
  );
}

export function IconBtn({
  children,
  onClick,
  href,
  variant = "secondary",
  title,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: BtnVariant;
  title?: string;
  disabled?: boolean;
  className?: string;
}) {
  const base = cn(
    "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50",
    className
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={base} style={BTN_STYLES[variant]} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={base}
      style={BTN_STYLES[variant]}
      title={title}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
        <Icon className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-[#64748B]">{title}</p>
      {subtitle && (
        <p className="mt-1 max-w-xs text-xs text-[#94A3B8]">{subtitle}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-[20px] bg-slate-100", className)} />
  );
}

export function Alert({
  type,
  children,
}: {
  type: "success" | "error";
  children: React.ReactNode;
}) {
  const isSuccess = type === "success";
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
      style={
        isSuccess
          ? { background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }
          : { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }
      }
    >
      {isSuccess ? (
        <CheckCircle className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      {children}
    </div>
  );
}

export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-[13px] font-semibold text-[#0F172A]">{label}</label>
        {hint && <span className="text-xs text-[#94A3B8]">({hint})</span>}
      </div>
      {children}
    </div>
  );
}

export function DashInput({
  icon: Icon,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  suffix?: React.ReactNode;
}) {
  const baseClass = cn(
    "w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] transition",
    "focus:border-[#F97316] focus:bg-white focus:ring-2 focus:ring-[#F97316]/10",
    "disabled:cursor-not-allowed disabled:opacity-60",
    Icon ? "pl-10 pr-4" : suffix ? "pl-4 pr-10" : "px-4",
    props.className
  );

  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
          strokeWidth={1.75}
        />
      )}
      <input {...props} className={baseClass} />
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

export function CardHeader({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid #F1F5F9" }}
    >
      <div>
        <p className="text-[15px] font-bold text-[#0F172A]">{title}</p>
        {sub && <p className="mt-0.5 text-xs text-[#94A3B8]">{sub}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function ColHeader({
  cols,
  gridCols,
}: {
  cols: string[];
  gridCols: string;
}) {
  return (
    <div
      className="grid items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]"
      style={{
        gridTemplateColumns: gridCols,
        borderBottom: "1px solid #F1F5F9",
        background: "#FAFAFA",
      }}
    >
      {cols.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
}) {
  if (pages <= 1) return null;
  const btn =
    "rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] transition-all hover:border-slate-300 disabled:opacity-40";
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={btn}
        style={{ borderColor: "#E2E8F0" }}
      >
        Précédent
      </button>
      <span className="text-xs text-slate-400">{page} / {pages}</span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className={btn}
        style={{ borderColor: "#E2E8F0" }}
      >
        Suivant
      </button>
    </div>
  );
}
