import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/seo";
import { circuitPages } from "./circuits/circuit-data";
import { teamPages } from "./ecuries/team-data";
import { driverPages } from "./pilotes/driver-data";

/**
 * Date de dernière modification réelle des fiches pilotes, écuries et circuits.
 * À mettre à jour quand on modifie leur contenu : Google se fie à cette date
 * pour décider de revenir lire une page.
 */
const PROFILES_UPDATED = new Date("2026-10-29");

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages dont les données changent en continu (actus, classements, horaires).
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "hourly" },
    { url: `${SITE_URL}/classement`, lastModified: now, priority: 0.9, changeFrequency: "hourly" },
    { url: `${SITE_URL}/calendrier`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${SITE_URL}/programme-tv`, lastModified: now, priority: 0.7, changeFrequency: "daily" },
    { url: `${SITE_URL}/pilotes`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/ecuries`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/circuits`, lastModified: PROFILES_UPDATED, priority: 0.8, changeFrequency: "weekly" },
  ];

  const circuitUrls: MetadataRoute.Sitemap = Object.keys(circuitPages).map((slug) => ({
    url: `${SITE_URL}/circuits/${slug}`,
    lastModified: PROFILES_UPDATED,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const teamUrls: MetadataRoute.Sitemap = Object.keys(teamPages).map((slug) => ({
    url: `${SITE_URL}/ecuries/${slug}`,
    lastModified: PROFILES_UPDATED,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const driverUrls: MetadataRoute.Sitemap = Object.keys(driverPages).map((slug) => ({
    url: `${SITE_URL}/pilotes/${slug}`,
    lastModified: PROFILES_UPDATED,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...circuitUrls, ...teamUrls, ...driverUrls];
}
