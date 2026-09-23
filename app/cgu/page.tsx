import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from "../lib/legal";

export const metadata: Metadata = {
  title: "Conditions Générales d’Utilisation",
  description: `Conditions générales d’utilisation du site ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/cgu` },
};

export default function CguPage() {
  return (
    <LegalPageShell title="Conditions Générales d’Utilisation" updated="23 septembre 2026">
      <section>
        <h2>Objet</h2>
        <p>
          Les présentes conditions générales d’utilisation (CGU) régissent
          l’accès et l’utilisation du site {SITE_NAME} ({SITE_URL}), site
          d’actualités consacré à la Formule 1, la Formule 2, la Formule 3 et
          la F1 Academy. L’utilisation du site implique l’acceptation pleine
          et entière des présentes CGU.
        </p>
      </section>

      <section>
        <h2>Accès au service</h2>
        <p>
          Le site est accessible gratuitement à tout utilisateur disposant
          d’un accès à internet. Tous les frais afférents à l’accès au
          service (matériel, connexion, etc.) sont à la charge de
          l’utilisateur. L’éditeur met tout en œuvre pour assurer un accès
          au site 24h/24, sans garantie d’absence d’interruption, notamment
          pour maintenance.
        </p>
      </section>

      <section>
        <h2>Contenus du site</h2>
        <p>
          {SITE_NAME} agrège et republie des extraits d’articles
          d’actualité (titre, extrait, image, lien) provenant de médias
          tiers, avec attribution systématique de la source et lien vers
          l’article original. L’éditeur ne garantit pas l’exactitude,
          l’exhaustivité ni l’actualité de ces contenus, dont la
          responsabilité incombe à leurs éditeurs d’origine.
        </p>
        <p>
          Les données de classements, calendriers et résultats sportifs sont
          fournies à titre informatif et peuvent contenir des erreurs ou des
          délais de mise à jour.
        </p>
      </section>

      <section>
        <h2>Comportement de l’utilisateur</h2>
        <p>
          L’utilisateur s’engage à utiliser le site conformément à sa
          destination et à ne pas porter atteinte à son bon fonctionnement
          (tentative d’intrusion, extraction massive de données, etc.).
        </p>
      </section>

      <section>
        <h2>Liens externes</h2>
        <p>
          Le site contient des liens vers des sites tiers (sources
          d’actualité, partenaires). L’éditeur n’exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu.
        </p>
      </section>

      <section>
        <h2>Limitation de responsabilité</h2>
        <p>
          L’éditeur ne pourra être tenu responsable des dommages directs ou
          indirects résultant de l’utilisation du site, d’une indisponibilité
          temporaire, ou d’une inexactitude dans les contenus agrégés.
        </p>
      </section>

      <section>
        <h2>Modification des CGU</h2>
        <p>
          L’éditeur se réserve le droit de modifier les présentes CGU à tout
          moment. Les utilisateurs sont invités à les consulter
          régulièrement.
        </p>
      </section>

      <section>
        <h2>Droit applicable</h2>
        <p>
          Les présentes CGU sont soumises au droit français. Pour toute
          question, contactez{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
