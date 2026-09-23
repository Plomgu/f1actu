export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: number;
};

const STORAGE_KEY = "f1actu-cookie-consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30 * 6; // 6 mois
export const OPEN_COOKIE_PREFERENCES_EVENT = "f1actu:open-cookie-preferences";

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.timestamp > CONSENT_MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(choices: { analytics: boolean; marketing: boolean }): void {
  if (typeof window === "undefined") return;
  const consent: CookieConsent = {
    essential: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on ignore silencieusement.
  }
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
