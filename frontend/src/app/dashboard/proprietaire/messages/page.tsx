"use client";

import { Suspense } from "react";
import MessagesView from "@/components/dashboard/MessagesView";

export default function ProprietaireMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#F97316] border-t-transparent" />
        </div>
      }
    >
      <MessagesView />
    </Suspense>
  );
}
