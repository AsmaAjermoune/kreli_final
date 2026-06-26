"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function CataloguePagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pageList: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pageList.push(i);
  } else {
    pageList.push(1);
    if (current > 3) pageList.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pageList.push(i);
    if (current < total - 2) pageList.push("...");
    pageList.push(total);
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:shadow-md disabled:opacity-30"
        style={{ backgroundColor: "var(--lm-surface-card)", color: "var(--lm-mid)", border: "1px solid var(--lm-line)" }}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageList.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-sm"
            style={{ color: "#94a3b8" }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all"
            style={
              current === p
                ? {
                    background: "linear-gradient(135deg, #ff6700 0%, #ff8c38 100%)",
                    color: "#ffffff",
                    boxShadow: "0 3px 10px rgba(255,103,0,0.4)",
                  }
                : {
                    backgroundColor: "var(--lm-surface-card)",
                    color: "var(--lm-ink)",
                    border: "1px solid var(--lm-line)",
                  }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:shadow-md disabled:opacity-30"
        style={{ backgroundColor: "var(--lm-surface-card)", color: "var(--lm-mid)", border: "1px solid var(--lm-line)" }}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
