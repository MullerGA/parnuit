# Parnuit

Site public de préinscription à la bêta Parnuit pour les exploitants d'hébergements multi-sites.

## Développement

```bash
pnpm install
pnpm dev
pnpm build
```

Site statique construit avec Vite, sans compte, cookie analytique ni formulaire hébergé. Les boutons de demande d'accès ouvrent le client de messagerie du visiteur. Le parcours interactif est explicitement présenté comme une projection de la bêta et fonctionne sans données personnelles ni suivi. La carte de partage est générée localement par `python3 scripts/make-og.py` (Pillow requis pour la régénérer).

## Positionnement

Parnuit prépare une vue consolidée des tarifs, démarches et échéances de taxe de séjour par établissement. Le site annonce une bêta privée prochaine, sans date ferme, et ne présente pas l'application comme déjà accessible. Les fonctions décrites sont prévues pour cette bêta.

La page s'adresse aux responsables financiers et d'exploitation de groupes hôteliers, résidences de tourisme, campings et villages de vacances. L'hypothèse commerciale est que la valeur récurrente vient du calendrier et des démarches du parc, avec un tarif sourcé comme preuve concrète. Cette hypothèse reste à vérifier avec des acheteurs.

Les chiffres de constitution du référentiel proviennent de la base de travail du 30 septembre 2026 : 500 communes prioritaires, 488 sites de référence repérés et 376 collecteurs probables. Les fiches sont en revue ; ces chiffres ne constituent ni un taux de couverture nationale ni un taux de publication vérifiée. En particulier, aucune source ne permet de revendiquer « plus de 95 % des communes couvertes » par Parnuit.

Le cas présenté compare les délibérations municipales de Carcassonne pour les tarifs [2026](https://www.carcassonne.org/sites/default/files/actes-administratifs-2025-07/D%C3%A9lib%2023.pdf) et [2027](https://www.carcassonne.org/sites/default/files/actes-administratifs-2026-06/D%C3%A9lib%2018.pdf). Il ne représente pas une couverture nationale.
