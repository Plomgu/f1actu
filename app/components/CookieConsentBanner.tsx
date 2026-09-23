"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  getStoredConsent,
  saveConsent,
  OPEN_COOKIE_PREFERENCES_EVENT,
} from "../lib/cookieConsent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Le consentement vit dans localStorage (indisponible côté serveur) : on ne peut
    // déterminer la visibilité du bandeau qu'après le montage, côté client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!getStoredConsent()) setVisible(true);

    function handleOpen() {
      const stored = getStoredConsent();
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    }

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
    setCustomizing(false);
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
    setCustomizing(false);
  }

  function saveChoices() {
    saveConsent({ analytics, marketing });
    setVisible(false);
    setCustomizing(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0A0F1E] text-white shadow-2xl">
        <div className="p-5 sm:p-6">
          <p className="text-sm text-white/80">
            Nous utilisons des cookies essentiels au fonctionnement du site, et,
            si vous l’acceptez, des cookies de mesure d’audience et
            publicitaires. Vous pouvez faire votre choix ci-dessous ou
            consulter notre{" "}
            <Link href="/cookies" className="underline hover:text-white">
              politique de cookies
            </Link>
            .
          </p>

          {customizing && (
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input type="checkbox" checked disabled className="mt-1 accent-[#C41230]" />
                <span>
                  <span className="font-semibold text-white">Essentiels</span> — nécessaires
                  au fonctionnement du site (toujours actifs).
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 accent-[#C41230]"
                />
                <span>
                  <span className="font-semibold text-white">Mesure d’audience</span> — nous
                  aide à comprendre l’usage du site (statistiques anonymisées).
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 accent-[#C41230]"
                />
                <span>
                  <span className="font-semibold text-white">Publicité</span> — personnalisation
                  des contenus et partenaires publicitaires.
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {customizing ? (
              <button
                onClick={saveChoices}
                className="rounded-full bg-[#C41230] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#a30f28]"
              >
                Enregistrer mes choix
              </button>
            ) : (
              <>
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-[#C41230] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#a30f28]"
                >
                  Tout accepter
                </button>
                <button
                  onClick={rejectAll}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Tout refuser
                </button>
                <button
                  onClick={() => setCustomizing(true)}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Personnaliser
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
