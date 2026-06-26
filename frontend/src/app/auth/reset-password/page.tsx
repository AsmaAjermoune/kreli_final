"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { useI18n } from "@/context/I18nContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tokenMissing = !token;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("auth.err_password_min"));
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError(t("auth.err_password_upper"));
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError(t("auth.err_password_digit"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.err_passwords_mismatch"));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f4]">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-[460px] rounded-2xl bg-white px-8 py-10"
          style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)" }}
        >
          {tokenMissing ? (
            
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <AlertTriangle className="h-8 w-8" style={{ color: "#ef4444" }} />
              </div>
              <div>
                <h1 className="text-[22px] font-black" style={{ color: "#0f172a" }}>
                  {t("auth.reset_invalid_title")}
                </h1>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#64748b" }}>
                  {t("auth.reset_invalid_body")}
                </p>
              </div>
              <Link
                href="/auth/forgot-password"
                className="mt-2 inline-flex rounded-full px-7 py-3 text-[14px] font-bold text-white transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#ff6700" }}
              >
                {t("auth.request_new_link")}
              </Link>
            </div>
          ) : success ? (
            
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
              >
                <CheckCircle className="h-8 w-8" style={{ color: "#22c55e" }} />
              </div>
              <div>
                <h1 className="text-[22px] font-black" style={{ color: "#0f172a" }}>
                  {t("auth.reset_done_title")}
                </h1>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "#64748b" }}>
                  {t("auth.reset_done_body")}
                </p>
              </div>
              <Link
                href="/auth/login"
                className="mt-2 inline-flex rounded-full px-7 py-3 text-[14px] font-bold text-white transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#004e98" }}
              >
                {t("auth.login_button")}
              </Link>
            </div>
          ) : (
            
            <>
              <div className="mb-8 flex flex-col items-center gap-4 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(0,78,152,0.1)" }}
                >
                  <Lock className="h-8 w-8" style={{ color: "#004e98" }} />
                </div>
                <div>
                  <h1 className="text-[24px] font-black" style={{ color: "#0f172a" }}>
                    {t("auth.reset_title")}
                  </h1>
                  <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: "#64748b" }}>
                    {t("auth.reset_subtitle")}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label
                    className="mb-1.5 block text-[11px] font-black uppercase tracking-[1.5px]"
                    style={{ color: "#94a3b8" }}
                  >
                    {t("auth.new_password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "#94a3b8" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.password_placeholder")}
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-10 text-[14px] outline-none transition focus:border-[#004e98] focus:bg-white focus:ring-2 focus:ring-[#004e98]/10"
                      style={{ color: "#0f172a" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "#94a3b8" }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[12px]" style={{ color: "#94a3b8" }}>
                    {t("auth.password_rules")}
                  </p>
                </div>

                
                <div>
                  <label
                    className="mb-1.5 block text-[11px] font-black uppercase tracking-[1.5px]"
                    style={{ color: "#94a3b8" }}
                  >
                    {t("auth.confirm_new_password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: "#94a3b8" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder={t("auth.password_placeholder")}
                      className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-3 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#004e98] focus:bg-white focus:ring-2 focus:ring-[#004e98]/10"
                      style={{ color: "#0f172a" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-3.5 text-[15px] font-black text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
                  style={{ backgroundColor: "#ff6700", boxShadow: "0 4px 14px rgba(255,103,0,0.3)" }}
                >
                  {loading ? t("auth.resetting") : t("auth.reset_button")}
                </button>
              </form>

              <p className="mt-6 text-center text-[14px]" style={{ color: "#64748b" }}>
                {t("auth.back_to_login_prefix")}{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold transition-colors hover:opacity-70"
                  style={{ color: "#ff6700" }}
                >
                  {t("auth.back_to_login_link")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f4]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
