import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/seo";
import { circuitPages } from "./circuits/circuit-data";
import { teamPages } from "./ecuries/team-data";
import { driverPages } from "./pilotes/driver-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "hourly" },
    { url: `${SITE_URL}/classement`, priority: 0.9, changeFrequency: "hourly" },
    { url: `${SITE_URL}/calendrier`, priority: 0.8, changeFrequency: "daily" },
    { url: `${SITE_URL}/programme-tv`, priority: 0.7, changeFrequency: "daily" },
  ];

  const circuitUrls: MetadataRoute.Sitemap = Object.keys(circuitPages).map((slug) => ({
    url: `${SITE_URL}/circuits/${slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const teamUrls: MetadataRoute.Sitemap = Object.keys(teamPages).map((slug) => ({
    url: `${SITE_URL}/ecuries/${slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  const driverUrls: MetadataRoute.Sitemap = Object.keys(driverPages).map((slug) => ({
    url: `${SITE_URL}/pilotes/${slug}`,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  return [...staticPages, ...circuitUrls, ...teamUrls, ...driverUrls];
}
