import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_NAME, SITE_URL } from "../../lib/seo";
import PilotePageClient from "./PilotePageClient";
import JsonLd, { absoluteUrl, breadcrumb } from "../../components/JsonLd";
import { driverPages } from "../driver-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(driverPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const driver = driverPages[slug];
  if (!driver) return {};

  const title = `${driver.name} — ${driver.subtitle}`;
  const description = driver.metaDescription;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/pilotes/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/pilotes/${slug}`,
      images: [{ url: driver.image, alt: driver.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [driver.image],
    },
  };
}

export default async function DriverPage({ params }: Props) {
  const { slug } = await params;
  const driver = driverPages[slug];

  if (!driver) notFound();

  const url = `${SITE_URL}/pilotes/${slug}`;
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: driver.name,
    url,
    image: absoluteUrl(driver.profileImage ?? driver.image),
    description: driver.metaDescription,
    jobTitle: "Pilote de Formule 1",
    nationality: driver.nationality,
    birthPlace: driver.birthPlace,
    memberOf: {
      "@type": "SportsTeam",
      name: driver.teamName,
      sport: "Formule 1",
      url: `${SITE_URL}/ecuries/${driver.teamSlug}`,
    },
  };

  return (
    <>
      <JsonLd data={[personJsonLd, breadcrumb([{ name: driver.name, path: `/pilotes/${slug}` }])]} />
      <PilotePageClient driver={driver} />
    </>
  );
}
