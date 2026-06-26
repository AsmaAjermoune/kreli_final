"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#ebebeb" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6700" }}>
        Erreur
      </p>
      <h1 className="mt-3 text-3xl font-black text-ink">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir à
        l&apos;accueil.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg px-5 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: "#ff6700" }}
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-[#004e98] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
