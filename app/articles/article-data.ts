/**
 * Articles publiés sur le site.
 *
 * Pour publier un article : ajouter une entrée dans `articles` (le plus récent
 * en premier). La photo de couverture se place dans /public/articles/ et
 * doit idéalement faire au moins 1600 × 900 px (format 16:9).
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "keyFigures"; title: string; items: { value: string; label: string }[] }
  | {
      type: "standings";
      title: string;
      note?: string;
      /** Écart affiché par rapport au premier de la liste (défaut) ou au précédent. */
      gapFrom?: "first" | "previous";
      rows: { position: number; name: string; team: string; points: number; color: string; highlight?: boolean }[];
    };

export type Article = {
  slug: string;
  category: string;
  title: string;
  /** Chapô : 1 à 3 phrases qui résument l'article, affichées sous le titre. */
  lead: string;
  /**
   * Photo de couverture, sans texte incrusté (elle est recadrée dans le
   * carrousel et les cartes). `social` : variante facultative avec titre
   * incrusté, utilisée uniquement pour les partages (Facebook, X, WhatsApp…).
   */
  cover: { src: string; alt: string; credit?: string; social?: string };
  author: string;
  /** Date ISO (AAAA-MM-JJ). */
  publishedAt: string;
  /** Date de dernière mise à jour (ISO), si l'article a été modifié. */
  updatedAt?: string;
  tags: string[];
  /**
   * Fiches du site liées à l'article (slugs des URL /pilotes/…, /ecuries/…,
   * /circuits/…). L'article y est alors proposé automatiquement.
   */
  related?: { drivers?: string[]; teams?: string[]; circuits?: string[] };
  body: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "gp-qatar-2026-enjeux",
    category: "Avant-course",
    title: "GP du Qatar : Verstappen vise la 2e place, Red Bull et McLaren au coude-à-coude",
    lead:
      "Le titre est joué, mais l'avant-dernière manche de la saison est loin d'être une formalité. À Losail, Max Verstappen peut verrouiller la place de dauphin, Red Bull et McLaren se battent à 9 points pour le podium des constructeurs, et Ferrari doit répondre après un week-end difficile à Las Vegas.",
    cover: {
      src: "/articles/gp-qatar-2026-enjeux.jpg",
      alt: "Max Verstappen entouré de Lewis Hamilton et Charles Leclerc, sur fond de circuit de Losail de nuit",
      credit: "Visuel F1 Actu",
      social: "/articles/gp-qatar-2026-enjeux-social.jpg",
    },
    author: "La rédaction F1 Actu",
    publishedAt: "2026-11-27",
    tags: ["GP du Qatar", "Max Verstappen", "Red Bull", "McLaren", "Ferrari", "Saison 2026"],
    related: {
      drivers: ["max-verstappen", "lewis-hamilton", "charles-leclerc", "lando-norris", "george-russell", "kimi-antonelli", "oscar-piastri"],
      teams: ["redbull", "mclaren", "ferrari", "mercedes"],
      circuits: ["doha"],
    },
    body: [
      {
        type: "p",
        text:
          "Avec 402 points et 98 longueurs d'avance alors qu'il n'en reste que 50 à distribuer, Kimi Antonelli est hors d'atteinte : la couronne 2026 lui appartient. Mais derrière le champion, la hiérarchie finale est encore à écrire. Sous les projecteurs de Losail, ce dimanche à 17h00 (heure française), plusieurs batailles peuvent se décider d'un coup, ou repartir de plus belle avant le final d'Abou Dhabi.",
      },
      {
        type: "keyFigures",
        title: "Avant le Grand Prix",
        items: [
          { value: "50", label: "points encore en jeu par pilote" },
          { value: "+37", label: "d'avance pour Verstappen au 2e rang" },
          { value: "9", label: "points entre Red Bull et McLaren" },
          { value: "3", label: "victoires d'affilée de Verstappen au Qatar" },
        ],
      },
      { type: "h2", text: "Verstappen à un pas de la place de dauphin" },
      {
        type: "p",
        text:
          "Vainqueur à Las Vegas dimanche dernier, Max Verstappen arrive au Qatar en confiance. Le Néerlandais compte 304 points, soit 37 de plus que Lewis Hamilton et 40 de plus que le duo George Russell – Lando Norris, à égalité avec 264 unités. Charles Leclerc, à 54 points, ne peut déjà plus le rejoindre.",
      },
      {
        type: "standings",
        title: "Championnat pilotes — la course au 2e rang",
        rows: [
          { position: 2, name: "Max Verstappen", team: "Red Bull", points: 304, color: "#3671C6", highlight: true },
          { position: 3, name: "Lewis Hamilton", team: "Ferrari", points: 267, color: "#E8002D" },
          { position: 4, name: "George Russell", team: "Mercedes", points: 264, color: "#27F4D2" },
          { position: 5, name: "Lando Norris", team: "McLaren", points: 264, color: "#FF8000" },
          { position: 6, name: "Charles Leclerc", team: "Ferrari", points: 250, color: "#E8002D" },
        ],
        note: "Écarts calculés par rapport à Max Verstappen. Kimi Antonelli (402 pts), déjà assuré du titre, n'est pas représenté.",
      },
      {
        type: "p",
        text:
          "Le calcul est simple : s'il quitte Losail avec plus de 25 points d'avance sur chacun de ses poursuivants, la deuxième place sera mathématiquement acquise. Pour garder l'espoir, Hamilton doit marquer au moins 12 points de plus que lui dimanche ; Russell et Norris, au moins 15. Autrement dit, si Verstappen termine juste derrière l'un d'eux, l'affaire est pliée.",
      },
      {
        type: "p",
        text:
          "Et le terrain lui sourit : Verstappen s'est imposé à Losail en 2023, 2024 et 2025. Un tracé rapide et fluide, aux enchaînements de courbes moyennes et rapides, qui a toujours mis en valeur sa capacité à garder un rythme élevé sur la durée.",
      },
      {
        type: "image",
        src: "/circuits/qatar.webp",
        alt: "Tracé du circuit international de Losail",
        caption: "Le circuit international de Losail : 5,419 km, 16 virages et 57 tours au programme dimanche.",
      },
      { type: "h2", text: "Red Bull – McLaren : 9 points pour le podium" },
      {
        type: "p",
        text:
          "Chez les constructeurs, le duel est encore plus serré. Red Bull occupe la troisième place avec 440 points, mais McLaren n'est plus qu'à 9 longueurs (431). À Las Vegas, l'écurie de Woking a réduit l'écart en plaçant Norris et Oscar Piastri sur le podium (33 points), quand Red Bull s'est contentée des 25 points de la victoire.",
      },
      {
        type: "standings",
        title: "Championnat constructeurs",
        gapFrom: "previous",
        rows: [
          { position: 1, name: "Mercedes", team: "Titre assuré", points: 666, color: "#27F4D2" },
          { position: 2, name: "Ferrari", team: "", points: 517, color: "#E8002D" },
          { position: 3, name: "Red Bull Racing", team: "", points: 440, color: "#3671C6", highlight: true },
          { position: 4, name: "McLaren", team: "", points: 431, color: "#FF8000", highlight: true },
        ],
      },
      {
        type: "p",
        text:
          "Tout le problème de Red Bull tient en un chiffre : Verstappen a inscrit 304 des 440 points de l'équipe, près de 70 %. McLaren, à l'inverse, s'appuie sur deux voitures capables de marquer gros chaque dimanche. Sur un week-end où chaque position compte, la performance du second pilote Red Bull pourrait bien faire la différence.",
      },
      {
        type: "quote",
        text:
          "Avec 43 points maximum à prendre par écurie et par course, 9 points d'écart, ce n'est rien : une simple inversion sur la grille suffit à faire basculer le classement.",
      },
      { type: "h2", text: "Leclerc et Hamilton sous surveillance" },
      {
        type: "p",
        text:
          "Côté Ferrari, Las Vegas a laissé un goût amer : Hamilton 7e, Leclerc 10e, seulement 7 points pour la Scuderia. Un faux pas qui oblige les deux hommes à rebondir immédiatement, pour plusieurs raisons.",
      },
      {
        type: "list",
        items: [
          "Hamilton est le mieux placé pour contester la 2e place de Verstappen, mais il doit d'abord défendre son 3e rang : Russell et Norris ne sont qu'à 3 points.",
          "Leclerc, 6e avec 250 points, reste à 17 longueurs du podium du championnat. Une grosse performance à Losail peut le relancer avant Abou Dhabi.",
          "Au classement des constructeurs, Ferrari (517 points) compte 77 points d'avance sur Red Bull. Il en reste 86 à distribuer : la Scuderia sécurise la 2e place si elle ne concède pas 34 points ou plus dimanche.",
          "Enfin, Ferrari n'a encore jamais gagné à Losail. Hamilton, lui, connaît le chemin : il avait remporté la toute première édition du Grand Prix du Qatar, en 2021.",
        ],
      },
      {
        type: "p",
        text:
          "Avec une seule victoire chacun cette saison, les deux pilotes de la Scuderia ont aussi une question d'image à régler. Terminer l'année sur une dynamique positive enverrait un signal fort avant l'intersaison.",
      },
      { type: "h2", text: "Le programme du week-end" },
      {
        type: "list",
        items: [
          "Vendredi 27 novembre : essais libres 1 à 14h30, essais libres 2 à 18h30.",
          "Samedi 28 novembre : essais libres 3 à 15h30, qualifications à 19h00.",
          "Dimanche 29 novembre : départ de la course à 17h00.",
        ],
      },
      {
        type: "p",
        text:
          "Tous les horaires sont donnés en heure française. Résultats, classements mis à jour et programme TV sont à retrouver en direct sur F1 Actu tout au long du week-end.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** Articles liés à une fiche pilote, écurie ou circuit (les plus récents d'abord). */
export function articlesAbout(kind: "drivers" | "teams" | "circuits", slug: string) {
  return articles.filter((a) => a.related?.[kind]?.includes(slug));
}

/** Article d'avant-course (ou autre) rattaché à un circuit : le plus récent. */
export function latestArticleForCircuit(circuitSlug: string) {
  return articlesAbout("circuits", circuitSlug)[0];
}

export function formatArticleDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Temps de lecture estimé (≈ 220 mots/minute). */
export function readingTime(article: Article) {
  const text = article.body
    .map((b) => {
      if (b.type === "list") return b.items.join(" ");
      if (b.type === "keyFigures" || b.type === "standings") return "";
      if (b.type === "image") return b.caption ?? "";
      return b.text;
    })
    .join(" ");
  const words = `${article.lead} ${text}`.split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
