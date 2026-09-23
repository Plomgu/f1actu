import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import { SITE_NAME, SITE_URL, EDITOR_NAME } from "../lib/legal";

export const metadata: Metadata = {
  title: "À propos",
  description: `Qui est derrière ${SITE_NAME}, un site d’actualités indépendant dédié à la Formule 1, la Formule 2, la Formule 3 et la F1 Academy.`,
  alternates: { canonical: `${SITE_URL}/a-propos` },
};

export default function AProposPage() {
  return (
    <LegalPageShell title={`À propos de ${SITE_NAME}`}>
      <section>
        <h2>Notre mission</h2>
        <p>
          {SITE_NAME} rassemble en un seul endroit l’actualité des
          championnats de Formule 1, Formule 2, Formule 3 et F1 Academy :
          dernières news, résultats, classements, calendrier de la saison et
          programme TV, le tout en français.
        </p>
      </section>

      <section>
        <h2>Comment ça marche</h2>
        <p>
          Le fil d’actualité est constitué automatiquement à partir des flux
          RSS publics de plusieurs médias spécialisés (L’Équipe,
          Motorsport.com, Auto Moto, Paddock GP, F1i, France Info). Chaque
          article renvoie vers sa source originale : {SITE_NAME} ne fait que
          les référencer et n’en revendique pas la paternité.
        </p>
      </section>

      <section>
        <h2>Un projet indépendant</h2>
        <p>
          {SITE_NAME} est un site édité de façon indépendante par{" "}
          {EDITOR_NAME}, sans lien avec la Formula One Group, la FIA, ou
          l’un des médias dont les flux sont agrégés. Voir nos{" "}
          <a href="/mentions-legales">mentions légales</a> pour plus de
          détails.
        </p>
      </section>

      <section>
        <h2>Une question, une remarque ?</h2>
        <p>
          N’hésitez pas à nous écrire via la <a href="/contact">page Contact</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
