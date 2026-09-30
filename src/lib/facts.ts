/**
 * Chiffres cités dans les pages. Calculés par scripts/build_data.py (public/data/stats.json)
 * ou relevés dans la documentation de personnal-01 (docs/qualite-donnees-dgfip.md,
 * docs/suivi-deliberations.md). Tous sont vérifiables ; aucun ne mesure une couverture
 * de fiches validées.
 */
export const FACTS = {
  communesFrance: 34969,
  communesCatalogue: 32310,
  deliberations: 2051,
  /** 20 350 hébergements classés sur 20 557 sont dans une commune au catalogue DGFiP. */
  partEtabCatalogue: "99 %",
  etabClasses: 20557,
  /** Base de travail des 500 communes prioritaires. */
  base500: 500,
  base500SiteRef: 488,
  base500SiteRefPct: "97,6 %",
  base500Portails: 455,
  /** Part de la capacité d'accueil classée (hôtels, résidences, campings, villages) dans ces 500 communes. */
  partCapacite500: "55 %",
  /** Communes des 500 dont le collecteur est une intercommunalité. */
  intercommunal: 324,
  intercommunalPct: "65 %",
  /** Communes dont la délibération change entre les catalogues d'octobre 2024 et d'octobre 2025. */
  changementPct: "30 %",
  changement: 9688,
  mensuelle: 273,
  editeurs: 5,
  /** Délai de saisie des délibérations au catalogue national : 21 % au-delà de 90 jours. */
  saisieTardivePct: "21 %",
} as const;

export const CARCASSONNE = {
  vote: "28 mai 2026",
  publication: "8 juin 2026",
  absent: "29 septembre 2026",
  r4_2026: 3.08,
  r4_2027: 3.26,
  palace2026: 4.81,
  palace2027: 5.07,
  url2026: "https://www.carcassonne.org/sites/default/files/actes-administratifs-2025-07/D%C3%A9lib%2023.pdf",
  url2027: "https://www.carcassonne.org/sites/default/files/actes-administratifs-2026-06/D%C3%A9lib%2018.pdf",
};

export const PARIS = { base4: 2.6, total4: 8.45 };
