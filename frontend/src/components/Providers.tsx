"use client";

import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/context/I18nContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode, useEffect } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  return (
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
