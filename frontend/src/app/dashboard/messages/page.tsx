"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function MessagesRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    const conv = searchParams.get("conv");
    const suffix = conv ? `?conv=${conv}` : "";

    if (!user) {
      const target = `/dashboard/messages${suffix}`;
      router.replace(`/auth/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const base =
      user.role === "proprietaire"
        ? "/dashboard/proprietaire/messages"
        : "/dashboard/locataire/messages";

    router.replace(`${base}${suffix}`);
  }, [user, isLoading, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#F97316] border-t-transparent" />
    </div>
  );
}

export default function MessagesRedirectPage() {
  return (
    <Suspense fallback={null}>
      <MessagesRedirect />
    </Suspense>
  );
}
