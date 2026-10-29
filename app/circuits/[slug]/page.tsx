import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_NAME, SITE_URL } from "../../lib/seo";
import CircuitPageClient from "./CircuitPageClient";
import JsonLd, { absoluteUrl, breadcrumb } from "../../components/JsonLd";
import { calendar2026 } from "../../calendrier/calendar-data";
import { circuitPages } from "../circuit-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(circuitPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const circuit = circuitPages[slug];
  if (!circuit) return {};

  const title = `${circuit.grandPrix} 2026 — ${circuit.circuitName}`;
  const description = circuit.metaDescription;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/circuits/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/circuits/${slug}`,
      images: [{ url: circuit.image, alt: circuit.circuitName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [circuit.image],
    },
  };
}

export default async function CircuitPage({ params }: Props) {
  const { slug } = await params;
  const circuit = circuitPages[slug];

  if (!circuit) notFound();

  const url = `${SITE_URL}/circuits/${slug}`;
  const race = calendar2026.find((r) => r.circuitSlug === slug);
  const place = {
    "@type": "Place",
    name: circuit.circuitName,
    address: {
      "@type": "PostalAddress",
      addressLocality: circuit.location,
      addressCountry: circuit.country,
    },
  };

  // Un Grand Prix au calendrier = un événement sportif daté ; sinon on décrit le circuit.
  const mainJsonLd = race
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `${race.grandPrix} 2026`,
        sport: "Formule 1",
        url,
        image: absoluteUrl(circuit.image),
        description: circuit.metaDescription,
        startDate: race.raceDateIso,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: place,
        organizer: { "@type": "Organization", name: "Formula 1", url: "https://www.formula1.com" },
      }
    : {
        "@context": "https://schema.org",
        ...place,
        url,
        image: absoluteUrl(circuit.image),
        description: circuit.metaDescription,
      };

  return (
    <>
      <JsonLd data={[mainJsonLd, breadcrumb([{ name: "Circuits F1 2026", path: "/circuits" }, { name: circuit.grandPrix, path: `/circuits/${slug}` }])]} />
      <CircuitPageClient circuit={circuit} />
    </>
  );
}
