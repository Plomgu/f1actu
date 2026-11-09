import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Calendrier F1 2026 — Dates et horaires des Grands Prix",
  description:
    "Calendrier F1 2026 complet : dates et horaires en heure française des essais, qualifications, sprints et courses de chaque Grand Prix de la saison.",
  alternates: { canonical: `${SITE_URL}/calendrier` },
  openGraph: {
    title: `Calendrier F1 2026 | ${SITE_NAME}`,
    description: "Toutes les dates et horaires des Grands Prix de la saison 2026.",
    url: `${SITE_URL}/calendrier`,
  },
};

export default function CalendrierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
