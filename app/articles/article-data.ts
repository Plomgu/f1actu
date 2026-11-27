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
  {
    slug: "kimi-antonelli-anatomie-titre-2026",
    category: "Portrait",
    title: "Kimi Antonelli, anatomie d'un titre : comment l'Italien a dominé la saison 2026",
    lead:
      "Sacré à Mexico à seulement 20 ans, Kimi Antonelli est devenu le plus jeune champion du monde de l'histoire et le premier Italien titré depuis Alberto Ascari en 1953. Victoires, poles, coups durs et moments clés : retour sur une saison hors norme.",
    cover: {
      src: "/articles/kimi-antonelli-anatomie-titre-2026.jpg",
      alt: "Kimi Antonelli au volant de sa Mercedes",
      credit: "Visuel F1 Actu",
    },
    author: "La rédaction F1 Actu",
    publishedAt: "2026-11-27",
    tags: ["Kimi Antonelli", "Mercedes", "Champion du monde", "Saison 2026"],
    related: {
      drivers: ["kimi-antonelli", "george-russell", "max-verstappen", "lewis-hamilton"],
      teams: ["mercedes"],
      circuits: ["shanghai", "monaco", "monza", "mexico"],
    },
    body: [
      {
        type: "p",
        text:
          "Le 1er novembre, en franchissant la ligne d'arrivée à la 3e place du Grand Prix de Mexico, Kimi Antonelli a fait basculer l'histoire. Avec 119 points d'avance sur Max Verstappen alors qu'il n'en restait plus que 100 à distribuer, le pilote Mercedes ne pouvait plus être rejoint. À 20 ans et 68 jours, il devient le plus jeune champion du monde de Formule 1, pulvérisant le record de Sebastian Vettel (23 ans et 134 jours en 2010) de plus de trois ans.",
      },
      {
        type: "keyFigures",
        title: "Sa saison en chiffres (après 21 Grands Prix)",
        items: [
          { value: "9", label: "victoires en Grand Prix" },
          { value: "16", label: "podiums en 21 courses" },
          { value: "8", label: "pole positions" },
          { value: "402", label: "points au championnat" },
        ],
      },
      { type: "h2", text: "Un départ en trombe : cinq victoires d'affilée" },
      {
        type: "p",
        text:
          "Deuxième en Australie pour l'ouverture de la saison, Antonelli a ensuite enchaîné une série impressionnante : victoires en Chine, au Japon, à Miami, au Canada puis à Monaco. Cinq succès consécutifs, dont quatre depuis la pole position, et le plus souvent avec le meilleur tour en course en prime. Au soir de Monaco, il comptait déjà 156 points, soit 66 de plus que Lewis Hamilton, son premier poursuivant.",
      },
      {
        type: "p",
        text:
          "Dans une saison qui inaugurait une toute nouvelle réglementation technique, Mercedes a visé juste d'entrée. Mais avoir la meilleure voiture ne suffit pas : George Russell, son équipier, disposait du même matériel et ne compte que trois victoires. La différence s'est faite sur la régularité et la capacité d'Antonelli à transformer ses poles en victoires.",
      },
      { type: "h2", text: "Le début d'été, seul vrai passage à vide" },
      {
        type: "p",
        text:
          "Le jeune Italien a pourtant connu un trou d'air. À Barcelone, parti 3e, il abandonne à quelques tours de l'arrivée. Trois semaines plus tard à Silverstone, il signe la pole, remporte le sprint du samedi… puis termine 15e le dimanche, loin des points. Deux zéros en trois courses, de quoi relancer ses adversaires.",
      },
      {
        type: "p",
        text:
          "La réponse est venue à Spa-Francorchamps : pole position et victoire, comme pour refermer la parenthèse. Ce sont d'ailleurs ses deux seules courses hors des points de toute la saison, un chiffre qui dit tout de sa constance.",
      },
      { type: "h2", text: "Monza, le moment de grâce" },
      {
        type: "p",
        text:
          "S'il ne fallait retenir qu'une course, ce serait celle-ci. Qualifié 7e de son Grand Prix national, Antonelli s'élance finalement de la 19e place sur la grille. Une situation qui semblait compromettre ses chances devant les tifosi. Il remonte pourtant tout le peloton et s'impose, avec le meilleur tour en course en bonus.",
      },
      {
        type: "image",
        src: "/circuits/Italie.webp",
        alt: "Tracé de l'Autodromo Nazionale di Monza",
        caption: "Monza : parti 19e, Antonelli y a signé la victoire la plus marquante de sa saison.",
      },
      {
        type: "quote",
        text:
          "Un Italien qui gagne à Monza depuis le fond de grille, avec une Mercedes : il y a des victoires qui valent plus que 25 points.",
      },
      {
        type: "p",
        text:
          "Au soir de Monza, son avance sur Russell est de 66 points. Une semaine plus tard, il gagne encore à Madrid, et la question n'est plus de savoir s'il sera champion, mais quand.",
      },
      { type: "h2", text: "Une fin de saison en gestion" },
      {
        type: "p",
        text:
          "Avec un tel matelas, Antonelli a pu gérer l'automne sans prendre de risques inutiles. Une 5e place à Bakou malgré une qualification ratée (16e), des podiums en Malaisie et à Singapour, puis une neuvième victoire à Austin, depuis la pole. Il ne lui restait plus qu'à conclure, ce qu'il a fait au Mexique avec une 3e place suffisante.",
      },
      {
        type: "standings",
        title: "Championnat pilotes — après le GP de Las Vegas",
        rows: [
          { position: 1, name: "Kimi Antonelli", team: "Mercedes", points: 402, color: "#27F4D2", highlight: true },
          { position: 2, name: "Max Verstappen", team: "Red Bull", points: 304, color: "#3671C6" },
          { position: 3, name: "Lewis Hamilton", team: "Ferrari", points: 267, color: "#E8002D" },
          { position: 4, name: "George Russell", team: "Mercedes", points: 264, color: "#27F4D2" },
          { position: 5, name: "Lando Norris", team: "McLaren", points: 264, color: "#FF8000" },
        ],
        note: "Classement après 21 des 23 manches. Écarts calculés par rapport à Kimi Antonelli.",
      },
      { type: "h2", text: "Les clés d'un sacre" },
      {
        type: "list",
        items: [
          "La vitesse pure : 8 pole positions et 8 meilleurs tours en course, de la Chine au Brésil.",
          "L'efficacité : 9 victoires en 21 courses, soit près d'une sur deux. Sur ses 8 poles, il en a converti 6 en victoire.",
          "La constance : 19 arrivées dans les points sur 21, et 16 podiums. Ses adversaires n'ont jamais pu profiter de ses rares faux pas.",
          "Le mental : après le double zéro de Barcelone et Silverstone, il a répondu par une victoire immédiate à Spa.",
        ],
      },
      { type: "h2", text: "Un titre qui entre dans l'histoire" },
      {
        type: "p",
        text:
          "Né à Bologne le 25 août 2006, Antonelli n'en est qu'à sa deuxième saison en Formule 1. Recruté par Mercedes en 2025 pour remplacer Lewis Hamilton, il a été jugé très tôt, et parfois sévèrement. Deux ans plus tard, il offre à l'Italie son premier titre pilote depuis Alberto Ascari, sacré en 1952 et 1953. Soixante-treize ans d'attente.",
      },
      {
        type: "p",
        text:
          "Il reste deux Grands Prix, au Qatar et à Abou Dhabi, pour enrichir encore ce bilan. Mais l'essentiel est ailleurs : à 20 ans, Kimi Antonelli a déjà tout d'un leader, et la Formule 1 tient peut-être le visage de sa prochaine décennie. Toutes ses statistiques sont à retrouver sur sa fiche pilote, sur F1 Actu.",
      },
    ],
  },
  {
    slug: "calendrier-f1-2027",
    category: "Saison 2027",
    title: "Calendrier F1 2027 : 24 Grands Prix, 10 sprints et le retour du Portugal et de la Turquie",
    lead:
      "La Formule 1 a dévoilé le calendrier de sa saison 2027. Au programme : 24 Grands Prix dans 22 pays, un nombre de sprints qui passe de 6 à 10, une première course sprint à Monaco et deux circuits qui font leur retour. Dates, nouveautés et changements : voici tout ce qu'il faut savoir.",
    cover: {
      src: "/articles/calendrier-f1-2027.jpg",
      alt: "Départ d'un Grand Prix de Formule 1",
      credit: "Visuel F1 Actu",
    },
    author: "La rédaction F1 Actu",
    publishedAt: "2026-11-27",
    tags: ["Calendrier", "Saison 2027", "Sprint", "Monaco", "Portugal", "Turquie"],
    related: {
      circuits: ["sakhir", "djeddah", "monaco", "monza", "madrid", "barcelone", "zandvoort", "doha", "yas-marina"],
    },
    body: [
      {
        type: "p",
        text:
          "À peine la saison 2026 terminée, il faudra déjà penser à la suivante. Le calendrier 2027, validé par le Conseil mondial du sport automobile de la FIA, compte 24 Grands Prix. Il s'ouvrira le 14 mars à Bahreïn et se refermera le 12 décembre à Abou Dhabi. Entre les deux : 22 pays, cinq continents et plusieurs nouveautés de taille.",
      },
      {
        type: "keyFigures",
        title: "La saison 2027 en chiffres",
        items: [
          { value: "24", label: "Grands Prix au programme" },
          { value: "10", label: "week-ends sprint (contre 6 en 2026)" },
          { value: "22", label: "pays visités" },
          { value: "2", label: "retours : Portugal et Turquie" },
        ],
      },
      { type: "h2", text: "Le calendrier complet" },
      {
        type: "list",
        items: [
          "14 mars : Bahreïn (Sakhir), sprint",
          "21 mars : Arabie saoudite (Djeddah)",
          "4 avril : Australie (Melbourne), sprint",
          "11 avril : Japon (Suzuka), sprint",
          "18 avril : Chine (Shanghai)",
          "2 mai : Miami (États-Unis)",
          "23 mai : Canada (Montréal), sprint",
          "6 juin : Monaco, sprint",
          "20 juin : Portugal (Portimão)",
          "4 juillet : Grande-Bretagne (Silverstone), sprint",
          "11 juillet : Autriche (Spielberg)",
          "25 juillet : Belgique (Spa-Francorchamps)",
          "1er août : Hongrie (Budapest)",
          "5 septembre : Italie (Monza), sprint",
          "12 septembre : Espagne (Madrid)",
          "26 septembre : Azerbaïdjan (Bakou)",
          "3 octobre : Turquie (Istanbul), sous réserve d'homologation du circuit",
          "10 octobre : Singapour (Marina Bay)",
          "24 octobre : États-Unis (Austin)",
          "31 octobre : Mexique (Mexico)",
          "7 novembre : Brésil (São Paulo), sprint",
          "20 novembre : Las Vegas (États-Unis), course le samedi",
          "5 décembre : Qatar (Losail), sprint",
          "12 décembre : Abou Dhabi (Yas Marina), sprint",
        ],
      },
      {
        type: "p",
        text:
          "Les dates indiquées sont celles des courses. Les essais hivernaux auront lieu à Bahreïn, du 24 au 27 février, sur une seule session de quatre jours.",
      },
      { type: "h2", text: "Dix sprints, et une première à Monaco" },
      {
        type: "p",
        text:
          "C'est le grand changement de 2027 : le nombre de week-ends sprint passe de six à dix. Cinq circuits accueilleront ce format pour la première fois : Bahreïn, l'Australie, le Japon, Abou Dhabi et, surtout, Monaco. Le Canada, la Grande-Bretagne, l'Italie, le Brésil et le Qatar complètent la liste.",
      },
      {
        type: "p",
        text:
          "Une course sprint dans les rues de la Principauté, où les dépassements sont quasi impossibles, a de quoi surprendre. Elle pourrait au moins donner plus d'importance aux qualifications, déjà décisives à Monaco. Autre conséquence : avec dix sprints, plus de points seront en jeu sur la saison, et la lutte pour le titre pourrait durer plus longtemps.",
      },
      {
        type: "quote",
        text:
          "Nous sommes ravis d'accueillir le Portugal et la Türkiye au championnat et d'étendre les courses sprint à dix épreuves.",
        author: "Stefano Domenicali, PDG de la Formule 1",
      },
      { type: "h2", text: "Ce qui change par rapport à 2026" },
      {
        type: "list",
        items: [
          "Retour du Portugal : le circuit de Portimão retrouve la F1, qu'il n'avait plus accueillie depuis 2021.",
          "Retour de la Turquie : Istanbul Park revient lui aussi pour la première fois depuis 2021, sous réserve de l'homologation du circuit par la FIA.",
          "Départs : Barcelone et Zandvoort ne figurent pas au calendrier 2027. L'Espagne reste représentée par Madrid.",
          "Le Moyen-Orient en ouverture : Bahreïn retrouve sa place traditionnelle de première manche, suivi de Djeddah. En 2026, le Grand Prix de Bahreïn s'était disputé en Malaisie, à Sepang, et l'Arabie saoudite n'avait pas eu lieu.",
          "L'Australie recule à la 3e place du calendrier, après avoir ouvert la saison 2026.",
        ],
      },
      { type: "h2", text: "Les temps forts à cocher" },
      {
        type: "list",
        items: [
          "Le doublé d'ouverture Bahreïn – Arabie saoudite, les 14 et 21 mars.",
          "Le Grand Prix de Monaco et sa toute première course sprint, le week-end du 4 au 6 juin.",
          "La trêve estivale : après la Hongrie le 1er août, cinq semaines de pause avant Monza.",
          "Deux enchaînements de trois courses : Bakou – Istanbul – Singapour fin septembre et début octobre, puis Austin – Mexico – São Paulo fin octobre et début novembre.",
          "Un final au Moyen-Orient : Qatar puis Abou Dhabi, deux week-ends sprint pour décider du titre.",
        ],
      },
      {
        type: "p",
        text:
          "Pour les fans français, la saison européenne se concentrera entre juin et septembre, avec huit Grands Prix entre Monaco et Madrid. Les horaires en heure française et le programme TV de chaque week-end seront à retrouver sur F1 Actu.",
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
