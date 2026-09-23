import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import { SITE_NAME, SITE_URL, EDITOR_NAME, CONTACT_EMAIL, HOSTING_NAME } from "../lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment ${SITE_NAME} collecte, utilise et protège vos données personnelles.`,
  alternates: { canonical: `${SITE_URL}/confidentialite` },
};

export default function ConfidentialitePage() {
  return (
    <LegalPageShell title="Politique de confidentialité" updated="23 septembre 2026">
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données personnelles collectées
          sur {SITE_NAME} ({SITE_URL}) est <strong>{EDITOR_NAME}</strong>,
          joignable à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <p>{SITE_NAME} ne propose pas de création de compte. Les seules données susceptibles d’être traitées sont :</p>
        <ul>
          <li>
            les informations que vous transmettez volontairement via la{" "}
            <a href="/contact">page Contact</a> (nom, adresse email, message) —
            transmises directement par email et non stockées sur un serveur ;
          </li>
          <li>
            des données techniques de navigation (adresse IP, type de
            navigateur, pages visitées) collectées uniquement si vous
            acceptez les cookies de mesure d’audience, voir notre{" "}
            <a href="/cookies">politique de cookies</a> ;
          </li>
          <li>
            votre choix de préférences cookies, stocké localement dans votre
            navigateur (localStorage), non transmis à un serveur.
          </li>
        </ul>
      </section>

      <section>
        <h2>Finalités et base légale</h2>
        <ul>
          <li>Répondre à vos demandes de contact — intérêt légitime.</li>
          <li>Mesurer l’audience du site, si vous y consentez — consentement (art. 6.1.a RGPD).</li>
          <li>Assurer le fonctionnement technique du site — intérêt légitime.</li>
        </ul>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les emails envoyés via la page Contact sont conservés le temps
          nécessaire pour traiter votre demande, puis supprimés. Les
          préférences de cookies sont conservées jusqu’à 6 mois ou jusqu’à
          modification de votre part.
        </p>
      </section>

      <section>
        <h2>Hébergement et transferts de données</h2>
        <p>
          Le site est hébergé par {HOSTING_NAME}, société américaine. Les
          données techniques de navigation peuvent donc transiter par des
          serveurs situés aux États-Unis. {HOSTING_NAME} adhère au cadre de
          protection des données UE-États-Unis (Data Privacy Framework)
          garantissant un niveau de protection adéquat.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données
          (RGPD), vous disposez d’un droit d’accès, de rectification,
          d’effacement, de limitation, d’opposition et de portabilité de vos
          données. Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            CNIL
          </a>{" "}
          si vous estimez que vos droits ne sont pas respectés.
        </p>
      </section>

      <section>
        <h2>Absence de revente de données</h2>
        <p>
          {SITE_NAME} ne vend ni ne loue vos données personnelles à des
          tiers.
        </p>
      </section>
    </LegalPageShell>
  );
}
