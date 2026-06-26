"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

export function LitigeModal({
  desc,
  error,
  loading,
  onDescChange,
  onCancel,
  onSubmit,
}: {
  desc: string;
  error: string | null;
  loading: boolean;
  onDescChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <Flag className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0F172A]">Ouvrir un litige</h3>
            <p className="text-xs text-slate-400">Décrivez le problème rencontré</p>
          </div>
        </div>

        <textarea
          value={desc}
          onChange={(e) => onDescChange(e.target.value)}
          rows={4}
          placeholder="Ex : Le matériel ne correspond pas à la description, il manque des accessoires..."
          className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-sm text-[#0F172A] outline-none placeholder:text-slate-400 focus:border-[#F97316] focus:bg-white focus:ring-2 focus:ring-[#F97316]/10 transition"
        />

        {error && (
          <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
        )}

        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#64748B] transition-colors hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || desc.trim().length < 10}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#D97706" }}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
            Ouvrir le litige
          </button>
        </div>
      </motion.div>
    </div>
  );
}
