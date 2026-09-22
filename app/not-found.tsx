import Link from "next/link";
import type { Metadata } from "next";

import SiteHeader from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <SiteHeader />

        <div
          className="relative flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28"
          style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#3a0a14 55%,#C41230 100%)" }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
            Erreur 404
          </span>

          <h1 className="mt-3 text-7xl sm:text-8xl font-extrabold text-white leading-none">
            404
          </h1>

          <p className="mt-4 max-w-md text-sm sm:text-base text-white/80">
            Cette page a quitté la piste. Le contenu que tu cherches n&rsquo;existe pas ou plus.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[#C41230] px-6 py-3 text-sm font-bold text-white hover:bg-[#9B0E22] transition-colors"
            >
              Retour à l&rsquo;accueil
            </Link>
            <Link
              href="/classement"
              className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Classement
            </Link>
            <Link
              href="/calendrier"
              className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              Calendrier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
