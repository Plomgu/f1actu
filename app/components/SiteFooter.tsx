"use client";

import Link from "next/link";

import { SITE_NAME } from "../lib/seo";
import { CONTACT_EMAIL } from "../lib/legal";
import { openCookiePreferences } from "../lib/cookieConsent";

export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#0A0F1E] border-t border-white/10 text-white/70">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-white">{SITE_NAME}</div>
          <p className="mt-3 text-sm leading-relaxed">
            Actualités, résultats et classements de Formule 1, Formule 2,
            Formule 3 et F1 Academy, en français.
          </p>
        </div>

        <div>
          <div className="text-sm font-bold text-white uppercase tracking-wide">Navigation</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Actu</Link></li>
            <li><Link href="/classement" className="hover:text-white transition">Classement</Link></li>
            <li><Link href="/calendrier" className="hover:text-white transition">Calendrier</Link></li>
            <li><Link href="/programme-tv" className="hover:text-white transition">Programme TV</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold text-white uppercase tracking-wide">Informations</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/a-propos" className="hover:text-white transition">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
            <li><Link href="/cgu" className="hover:text-white transition">CGU</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold text-white uppercase tracking-wide">Confidentialité</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/confidentialite" className="hover:text-white transition">Politique de confidentialité</Link></li>
            <li><Link href="/cookies" className="hover:text-white transition">Politique de cookies</Link></li>
            <li>
              <button onClick={openCookiePreferences} className="text-left hover:text-white transition underline">
                Gérer mes cookies
              </button>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés. Site non affilié à la
        Formula One Group.
      </div>
    </footer>
  );
}
