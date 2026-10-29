import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_NAME, SITE_URL } from "../../lib/seo";
import EcuriePageClient from "./EcuriePageClient";
import JsonLd, { absoluteUrl, breadcrumb } from "../../components/JsonLd";
import { teamPages } from "../team-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(teamPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = teamPages[slug];
  if (!team) return {};

  const title = `${team.navName} — Écurie F1 2026`;
  const description = team.metaDescription;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ecuries/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/ecuries/${slug}`,
      images: [{ url: team.logo, alt: team.navName }],
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

  const url = `${SITE_URL}/ecuries/${slug}`;
  const teamJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.navName,
    alternateName: team.subtitle ? `${team.navName} ${team.subtitle}` : undefined,
    sport: "Formule 1",
    url,
    logo: absoluteUrl(team.logo),
    description: team.metaDescription,
    location: team.base,
    coach: team.teamPrincipal ? { "@type": "Person", name: team.teamPrincipal } : undefined,
    athlete: team.drivers.map((name) => ({ "@type": "Person", name })),
  };

  return (
    <>
      <JsonLd data={[teamJsonLd, breadcrumb([{ name: team.navName, path: `/ecuries/${slug}` }])]} />
      <EcuriePageClient team={team} />
    </>
  );
}
