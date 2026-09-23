import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import {
  SITE_NAME,
  SITE_URL,
  EDITOR_NAME,
  CONTACT_EMAIL,
  HOSTING_NAME,
  HOSTING_ADDRESS,
  HOSTING_WEBSITE,
} from "../lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${SITE_NAME} : éditeur, hébergeur et informations légales.`,
  alternates: { canonical: `${SITE_URL}/mentions-legales` },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell title="Mentions légales" updated="23 septembre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site {SITE_NAME}, accessible à l’adresse {SITE_URL}, est édité à
          titre non professionnel par <strong>{EDITOR_NAME}</strong>, personne
          physique.
        </p>
        <p>
          Contact :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>Directeur de la publication : {EDITOR_NAME}.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par <strong>{HOSTING_NAME}</strong>, {HOSTING_ADDRESS}.
        </p>
        <p>
          Site web de l’hébergeur :{" "}
          <a href={HOSTING_WEBSITE} target="_blank" rel="noopener noreferrer">
            {HOSTING_WEBSITE}
          </a>
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          La mise en page, l’identité visuelle et les contenus rédigés
          spécifiquement pour {SITE_NAME} (hors articles tiers, voir
          ci-dessous) sont la propriété de l’éditeur du site. Toute
          reproduction non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2>Contenus et sources tierces</h2>
        <p>
          {SITE_NAME} agrège des articles d’actualité provenant de sources
          tierces (L’Équipe, Motorsport.com, Auto Moto, Paddock GP, F1i,
          France Info, entre autres) via leurs flux RSS publics. Chaque
          article reste la propriété de son éditeur d’origine ; seuls un
          titre, un extrait et un lien vers l’article original sont repris,
          avec attribution de la source. {SITE_NAME} ne revendique aucun
          droit sur ces contenus tiers.
        </p>
      </section>

      <section>
        <h2>Marques et non-affiliation</h2>
        <p>
          « F1 », « Formula 1 », « FIA Formula 2 », « FIA Formula 3 » et
          « F1 Academy » sont des marques déposées appartenant à leurs
          propriétaires respectifs (notamment Formula One Licensing B.V. et
          la Fédération Internationale de l’Automobile). {SITE_NAME} est un
          site d’actualités indépendant, non affilié, non officiel et non
          approuvé par ces organisations.
        </p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          L’éditeur s’efforce d’assurer l’exactitude des informations
          diffusées mais ne peut garantir l’absence totale d’erreurs,
          notamment sur les contenus provenant de sources tierces. L’éditeur
          ne pourra être tenu responsable des dommages directs ou indirects
          résultant de l’utilisation du site ou de l’indisponibilité du
          service.
        </p>
      </section>
    </LegalPageShell>
  );
}
