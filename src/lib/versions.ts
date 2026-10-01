export type Version = {
  slug: string;
  n: number;
  name: string;
  angle: string;
  pitch: string;
  lever: string;
  style: string;
  motion: string;
  audience: string;
};

export const versions: Version[] = [
  {
    slug: "vitrine",
    n: 6,
    name: "La synthèse",
    angle:
      "La structure complète de « La plateforme », portée par l'argument de « La facture invisible », avec une touche du « Grand rangement ». L'appel à l'action devient un diagnostic 2027 offert.",
    pitch: "La taxe de séjour vous coûte plus cher que la taxe.",
    lever: "Le coût caché chiffré, prouvé par les vraies données, puis une offre concrète et sans risque à saisir avant le 1er janvier.",
    style: "Premium lumineux aux couleurs de la marque, marine et corail, quelques notes manuscrites.",
    motion: "Ticket qui s'imprime, calculateur, avant/après à glisser, tableau de bord vivant, recherche d'une commune réelle.",
    audience: "DAF, comptabilité et direction des opérations des groupes d'hébergement",
  },
  {
    slug: "demo",
    n: 1,
    name: "Le parc en direct",
    angle: "Le produit se vend tout seul : le visiteur tape ses communes et voit sa taxe de séjour se calculer.",
    pitch: "Tapez vos communes. Parnuit fait le reste.",
    lever: "Preuve immédiate, sur ses propres établissements, avec les vraies données.",
    style: "Interface produit claire et nette, marine et corail de la marque.",
    motion: "Démonstration qui se remplit seule, puis reste manipulable ; calendrier qui se construit.",
    audience: "Responsable taxe de séjour, comptable multi-sites",
  },
  {
    slug: "nuit",
    n: 2,
    name: "Par nuit.",
    angle: "Une histoire de marque au défilement : 34 969 communes s'allument et forment la France de la taxe de séjour.",
    pitch: "Chaque nuit a son tarif.",
    lever: "Émotion et mémorisation : la complexité devient visible, Parnuit la range.",
    style: "Ciel de nuit, or lunaire, grande typographie à empattements.",
    motion: "Carte WebGL de chaque commune, scènes épinglées au défilement, constellation d'un parc.",
    audience: "Direction générale, direction de réseau",
  },
  {
    slug: "calcul",
    n: 3,
    name: "La facture invisible",
    angle: "Chiffrer ce que coûte la gestion à la main : temps, échéances, écarts de tarif payés de sa poche.",
    pitch: "Combien vous coûte vraiment la taxe de séjour ?",
    lever: "Argument financier : un calcul personnalisé, puis un prix face au coût.",
    style: "Suisse brutaliste, noir, blanc et jaune signal, chiffres géants.",
    motion: "Calculateur à curseurs, compteurs animés, ticket qui s'imprime.",
    audience: "DAF, contrôle de gestion",
  },
  {
    slug: "plateforme",
    n: 4,
    name: "La plateforme",
    angle: "La page produit SaaS complète : fonctions, intégrations, comparatif, sécurité, tarifs, questions.",
    pitch: "Le poste de pilotage de la taxe de séjour multi-sites.",
    lever: "Réassurance et exhaustivité : tout ce qu'un acheteur vérifie avant de signer.",
    style: "Premium lumineux, dégradés doux, grille modulaire.",
    motion: "Tableau de bord animé, cartes vivantes, prix qui se recalcule.",
    audience: "Comité d'achat : DAF, exploitation, informatique",
  },
  {
    slug: "rangement",
    n: 5,
    name: "Le grand rangement",
    angle: "Le soulagement : le fouillis de PDF, mails et tableurs tombe, puis se range en un clic.",
    pitch: "Votre taxe de séjour, enfin rangée.",
    lever: "Soulagement et complicité : on rit de la galère, on veut la solution.",
    style: "Ludique, contours épais, post-it et annotations manuscrites.",
    motion: "Physique des papiers, comparateur avant/après à glisser, quiz sur de vraies communes.",
    audience: "Équipes d'exploitation et de comptabilité",
  },
];

export const versionBySlug = (slug: string) => versions.find((v) => v.slug === slug);
