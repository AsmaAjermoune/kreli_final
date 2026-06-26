import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f0ebe3] dark:bg-[#0f172a] px-4 font-sans">
      <div className="w-full max-w-2xl text-center">

        
        <div
          className="h-[260px] sm:h-[340px] bg-center bg-no-repeat bg-contain relative"
          style={{
            backgroundImage:
              "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
          }}
          aria-hidden="true"
        >
          <h1
            className="absolute inset-x-0 top-4 text-center font-black"
            style={{
              fontSize: "clamp(4rem, 12vw, 7rem)",
              lineHeight: 1,
              color: "#0f172a",
            }}
          >
            404
          </h1>
        </div>

        
        <div className="-mt-6">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] mb-4"
            style={{ backgroundColor: "rgba(255,103,0,0.1)", color: "#ff6700" }}
          >
            Erreur 404
          </span>

          <h2
            className="font-display font-black mb-3 dark:text-white"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Page introuvable
          </h2>

          <p className="text-[15px] leading-relaxed mb-8 text-[#64748b] dark:text-slate-400 max-w-sm mx-auto">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-black text-white transition-all hover:brightness-110 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#ff6700" }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
