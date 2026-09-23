import { SITE_NAME, SITE_URL } from "./seo";

export const EDITOR_NAME = "Guillaume Plomion";
export const CONTACT_EMAIL = "contact@f1actu.fr";

export const HOSTING_NAME = "Vercel Inc.";
export const HOSTING_ADDRESS = "340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis";
export const HOSTING_WEBSITE = "https://vercel.com";

export const LEGAL_LINKS = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Politique de cookies" },
  { href: "/cgu", label: "CGU" },
] as const;

export { SITE_NAME, SITE_URL };
