import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import ManageCookiesButton from "../components/ManageCookiesButton";
import { SITE_NAME, SITE_URL } from "../lib/legal";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: `Quels cookies utilise ${SITE_NAME} et comment gérer vos préférences.`,
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Politique de cookies" updated="23 septembre 2026">
      <section>
        <h2>Qu’est-ce qu’un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre appareil lors
          de la visite d’un site, permettant de le reconnaître lors de vos
          visites suivantes ou de collecter des informations sur votre
          navigation.
        </p>
      </section>

      <section>
        <h2>Les cookies utilisés sur {SITE_NAME}</h2>
        <ul>
          <li>
            <strong>Cookies essentiels</strong> — nécessaires au
            fonctionnement du site (mémorisation de vos préférences de
            consentement). Ils ne peuvent pas être désactivés et ne
            nécessitent pas votre consentement.
          </li>
          <li>
            <strong>Cookies de mesure d’audience</strong> — déposés
            uniquement si vous les acceptez, ils nous aident à comprendre la
            fréquentation du site de manière statistique.
          </li>
          <li>
            <strong>Cookies publicitaires / partenaires</strong> — déposés
            uniquement si vous les acceptez, notamment lors du clic sur des
            bannières ou liens partenaires affichés sur le site.
          </li>
        </ul>
      </section>

      <section>
        <h2>Gérer vos préférences</h2>
        <p>
          Vous pouvez à tout moment modifier votre choix concernant les
          cookies non essentiels via le bouton ci-dessous.
        </p>
        <div className="mt-4">
          <ManageCookiesButton />
        </div>
        <p className="mt-4">
          Vous pouvez également configurer votre navigateur pour refuser
          l’ensemble des cookies, mais certaines fonctionnalités du site
          pourraient alors ne plus fonctionner correctement.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Votre choix de préférences est conservé localement dans votre
          navigateur pendant 6 mois maximum, après quoi il vous sera
          à nouveau demandé.
        </p>
      </section>
    </LegalPageShell>
  );
}
