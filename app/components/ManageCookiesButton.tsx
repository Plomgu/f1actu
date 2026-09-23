"use client";

import { openCookiePreferences } from "../lib/cookieConsent";

export default function ManageCookiesButton() {
  return (
    <button
      onClick={openCookiePreferences}
      className="inline-flex items-center rounded-full bg-[#0F172A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#C41230]"
    >
      Gérer mes préférences cookies
    </button>
  );
}
