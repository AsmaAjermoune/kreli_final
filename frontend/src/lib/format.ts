

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "2-digit" });
}

export function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-MA", { day: "numeric", month: "short" });
}

export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-MA", { month: "long", year: "numeric" });
}
