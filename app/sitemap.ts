import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/seo";
import { circuitPages } from "./circuits/circuit-data";
import { teamPages } from "./ecuries/team-data";
import { driverPages } from "./pilotes/driver-data";
import { articles, articlesAbout } from "./articles/article-data";

/**
 * Date de dernière modification réelle des fiches pilotes, écuries et circuits.
 * À mettre à jour quand on modifie leur contenu : Google se fie à cette date
 * pour décider de revenir lire une page.
 */
const PROFILES_UPDATED = new Date("2026-10-29");

/**
 * Une fiche change aussi quand un nouvel article la mentionne (encadré
 * « Articles sur… ») : on retient la date la plus récente des deux.
 */
function profileUpdated(kind: "drivers" | "teams" | "circuits", slug: string) {
  const latest = articlesAbout(kind, slug)
    .map((a) => new Date(a.updatedAt ?? a.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  return latest && latest > PROFILES_UPDATED ? latest : PROFILES_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages dont les données changent en continu (actus, classements, horaires).
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "hourly" },
    { url: `${SITE_URL}/classement`, lastModified: now, priority: 0.9, changeFrequency: "hourly" },
    { url: `${SITE_URL}/calendrier`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${SITE_URL}/articles`, lastModified: articles[0] ? new Date(articles[0].publishedAt) : now, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/programme-tv`, lastModified: now, priority: 0.7, changeFrequency: "daily" },
    { url: `${SITE_URL}/pilotes`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/ecuries`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/circuits`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/a-propos`, lastModified: PROFILES_UPDATED, priority: 0.4, changeFrequency: "monthly" },
    { url: `${SITE_URL}/contact`, lastModified: PROFILES_UPDATED, priority: 0.3, changeFrequency: "yearly" },
  ];

  const circuitUrls: MetadataRoute.Sitemap = Object.keys(circuitPages).map((slug) => ({
    url: `${SITE_URL}/circuits/${slug}`,
    lastModified: profileUpdated("circuits", slug),
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const teamUrls: MetadataRoute.Sitemap = Object.keys(teamPages).map((slug) => ({
    url: `${SITE_URL}/ecuries/${slug}`,
    lastModified: profileUpdated("teams", slug),
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const driverUrls: MetadataRoute.Sitemap = Object.keys(driverPages).map((slug) => ({
    url: `${SITE_URL}/pilotes/${slug}`,
    lastModified: profileUpdated("drivers", slug),
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  // Articles de la rédaction : date réelle de publication / mise à jour et
  // image de couverture (aide Google Images et Discover).
  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    priority: 0.8,
    changeFrequency: "weekly",
    images: [a.cover.src.startsWith("http") ? a.cover.src : `${SITE_URL}${a.cover.src}`],
  }));

  return [...staticPages, ...articleUrls, ...circuitUrls, ...teamUrls, ...driverUrls];
}
