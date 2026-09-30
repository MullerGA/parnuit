# Parnuit — studio de pages produit

Cinq versions de la page produit de Parnuit, chacune avec son angle de vente, son style et ses animations, et une page de récapitulatif pour les comparer. Application Next.js 16 (App Router, Tailwind CSS 4), sans base de données.

| Route | Version | Angle |
| --- | --- | --- |
| `/` | Récapitulatif | Les cinq versions, les chiffres utilisés et leurs sources, les points à trancher |
| `/demo` | 1 · Le parc en direct | Démo interactive : le visiteur tape ses communes, les vraies données s'affichent |
| `/nuit` | 2 · Par nuit. | Récit au défilement, carte WebGL des 34 969 communes |
| `/calcul` | 3 · La facture invisible | Calculateur du coût caché de la gestion à la main |
| `/plateforme` | 4 · La plateforme | Page produit SaaS complète : fonctions, comparatif, tarifs, sécurité |
| `/rangement` | 5 · Le grand rangement | Physique des papiers, avant/après, quiz sur de vraies communes |

## Développement

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Données

`public/data/` est produit par `scripts/build_data.py` à partir de la base de travail du dépôt [personnal-01](../personnal-01) (catalogue DGFiP converti, base des 500 communes, priorisation Atout France) et des centres des communes de geo.api.gouv.fr :

```bash
curl -sS 'https://geo.api.gouv.fr/communes?fields=code,nom,centre,population,codeDepartement&format=json&geometry=centre' -o scripts/.cache/geo-centres.json
uv run scripts/build_data.py            # PARNUIT_DATA=/chemin/vers/personnal-01/data si besoin
node scripts/cal-check.mts              # contrôle du calcul des échéances
```

- `france.json` : toutes les communes, leur délibération au catalogue DGFiP d'octobre 2025 et ses tarifs 2026 ;
- `base500.json` : les 500 communes documentées (collecteur, portail, échéances, tarifs, sources) ;
- `sky.json` : coordonnées projetées pour la carte animée ;
- `stats.json` : chiffres cités, recalculés à chaque exécution.

Le total d'un tarif applique les taxes additionnelles du catalogue (département 10 %, Société des grands projets 15 %, lignes à grande vitesse 34 %, Île-de-France Mobilités 200 %). La formule est contrôlée contre les 3 225 totaux officiels de l'Open Data DELTA 2026 (`controle_formule_total` dans `stats.json`). Les chiffres cités et leur calcul sont listés dans `src/lib/facts.ts` et sur la page de récapitulatif.

## Formulaire bêta

Le formulaire poste vers `/api/beta` (validation Zod, champ piège anti-robots). Si `RESEND_API_KEY` et `BETA_NOTIFY_EMAIL` sont définies, la demande est envoyée par email ; sinon la route répond `fallback` et le navigateur ouvre la messagerie du visiteur avec la demande préremplie. Chaque demande est aussi écrite dans les journaux du serveur (`parnuit_beta_lead`). Variables dans `.env.example`.

## Déploiement

Le récapitulatif est publié sur le projet Vercel `parnuit-studio` (`vercel deploy --prod`). La vitrine publique `parnuit.vercel.app` (branche `main`) n'est pas modifiée par cette branche.
