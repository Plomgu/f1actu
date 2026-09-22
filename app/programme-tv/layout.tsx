import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Programme TV F1 2026 — Horaires Canal+ et F1 TV",
  description:
    "Tous les horaires de diffusion de la Formule 1 en France : Canal+, F1 TV Pro. Essais libres, qualifications, sprint et courses en direct.",
  alternates: { canonical: `${SITE_URL}/programme-tv` },
  openGraph: {
    title: `Programme TV F1 2026 | ${SITE_NAME}`,
    description: "Horaires des sessions F1 sur Canal+ et F1 TV Pro pour toute la saison 2026.",
    url: `${SITE_URL}/programme-tv`,
  },
};

export default function ProgrammeTVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
