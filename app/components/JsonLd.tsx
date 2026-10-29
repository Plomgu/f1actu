import { SITE_NAME, SITE_URL } from "../lib/seo";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * Données structurées schema.org (JSON-LD), lues par Google pour comprendre
 * le contenu des pages. Le « < » est échappé pour éviter toute injection HTML.
 */
export default function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${encodeURI(path)}`;
}

/** Fil d'Ariane : Accueil > … > page courante. */
export function breadcrumb(items: { name: string; path: string }[]) {
  const all = [{ name: SITE_NAME, path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
