import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./lib/seo";
import SiteFooter from "./components/SiteFooter";
import CookieConsentBanner from "./components/CookieConsentBanner";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "F1 Actu — Actualités Formule 1",
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logos/f1actu.png`,
    email: "contact@f1actu.fr",
  },
];

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Actualités et résultats Formule 1 en direct`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: [
    "Formule 1", "F1 2026", "Grand Prix", "résultats F1",
    "classement F1", "calendrier F1", "programme TV F1",
    "actualités F1", "pilotes F1", "écuries F1",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Formule 1 en direct`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logos/f1actu.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Formule 1 en direct`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Formule 1 en direct`,
    description: "Actualités, résultats et classements F1 2026 en temps réel.",
    images: ["/logos/f1actu.png"],
  },

  manifest: "/manifest.json",

  alternates: {
    canonical: SITE_URL,
  },

  verification: {
    google: "CPhnZDAOxSJRt0MThSCDn_mdC3J6PetNAwFgITY7xjk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={siteJsonLd} />
        {children}
        <SiteFooter />
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
