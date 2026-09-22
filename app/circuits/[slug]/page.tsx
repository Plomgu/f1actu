import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_NAME, SITE_URL } from "../../lib/seo";
import CircuitPageClient from "./CircuitPageClient";
import { circuitPages } from "../circuit-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(circuitPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const circuit = circuitPages[slug];
  if (!circuit) return {};

  const title = `${circuit.grandPrix} — ${circuit.circuitName}`;
  const description = circuit.summary[0];

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

  return <CircuitPageClient circuit={circuit} />;
}
