import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
  title: "Catalogue de location de matériels professionnels au Maroc",
  description:
    "Parcourez des milliers d'équipements professionnels disponibles à la location partout au Maroc. Engins BTP, outils, matériel événementiel.",
  alternates: { canonical: "/catalogue" },
  openGraph: {
    title: "Catalogue | Kreli",
    description: "Parcourez des milliers d'équipements professionnels disponibles à la location partout au Maroc.",
  },
};

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f4]">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4"
            style={{ borderColor: "#004e98", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <CatalogueClient />
    </Suspense>
  );
}
