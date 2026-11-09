import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  title: "Classement F1 2026 — Pilotes et Constructeurs",
  description:
    "Classement F1 2026 en direct : points des pilotes et des constructeurs, écarts au leader et évolution du championnat du monde de Formule 1, course après course.",
  alternates: { canonical: `${SITE_URL}/classement` },
  openGraph: {
    title: `Classement F1 2026 | ${SITE_NAME}`,
    description: "Classement pilotes et constructeurs du championnat F1 2026 en temps réel.",
    url: `${SITE_URL}/classement`,
  },
};

export default function ClassementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
