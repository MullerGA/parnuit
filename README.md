# Parnuit

Site public de présentation du pilote Parnuit 2027 pour les exploitants d'hébergements multi-sites.

## Développement

```bash
pnpm install
pnpm dev
pnpm build
```

Site statique construit avec Vite, sans compte, cookie analytique ni formulaire hébergé. Les boutons de contact ouvrent le client de messagerie du visiteur. La page ne repose sur aucune photographie : la preuve visible est un cas tarifaire réel et sourcé. La carte de partage est générée localement par `python scripts/make-og.py` (Pillow requis pour la régénérer).

## Positionnement

Parnuit prépare un suivi documenté des tarifs et modalités de taxe de séjour par établissement. Le site propose un pilote accompagné et ne présente pas l'application comme disponible. Aucun chiffre de couverture ou fonctionnalité non livrée n'est annoncé.

La page s'adresse d'abord aux responsables financiers et d'exploitation de groupes hôteliers et de résidences de tourisme. L'hypothèse commerciale est qu'un contrôle concret, avec la décision à prendre et sa source, suscitera davantage de demandes qu'une présentation générale d'un outil de veille. Le premier engagement demandé est limité à trois établissements. Cette hypothèse reste à vérifier avec des acheteurs.

Le cas présenté compare les délibérations municipales de Carcassonne pour les tarifs [2026](https://www.carcassonne.org/sites/default/files/actes-administratifs-2025-07/D%C3%A9lib%2023.pdf) et [2027](https://www.carcassonne.org/sites/default/files/actes-administratifs-2026-06/D%C3%A9lib%2018.pdf). Il ne représente pas une couverture nationale.
