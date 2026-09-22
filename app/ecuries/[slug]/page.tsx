import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_NAME, SITE_URL } from "../../lib/seo";
import EcuriePageClient from "./EcuriePageClient";
import { teamPages } from "../team-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(teamPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = teamPages[slug];
  if (!team) return {};

  const title = `${team.displayName} — Écurie F1 2026`;
  const description = team.history[0];

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ecuries/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/ecuries/${slug}`,
      images: [{ url: team.logo, alt: team.displayName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [team.logo],
    },
  };
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const team = teamPages[slug];

  if (!team) notFound();

  return <EcuriePageClient team={team} />;
}
