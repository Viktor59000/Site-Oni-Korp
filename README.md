# Oni Korp · site et Inside

Le site du club esport Oni Korp : la vitrine publique et **Inside**, l'espace de travail des rosters et du staff. En ligne sur https://oni-korp.vercel.app (Vercel, republié à chaque push sur `main`).

**Toute la documentation du projet (site, Oni Bot, base, décisions) est dans [`docs/`](docs/README.md).** Commence par là.

## En bref

```bash
npm install
npm run dev          # vitrine seule : http://localhost:4321
npm run dev:demo     # Inside complet sur une base de démonstration : http://localhost:4330/equipe/
VERCEL=1 npm run build && npm test   # à faire avant chaque push
```

| Dossier | Contenu |
|---|---|
| `src/pages/` | vitrine publique (statique) |
| `src/server/` | pages et API rendues côté serveur (Inside, connexion Discord, API) ; routes déclarées dans `astro.config.mjs` |
| `src/data/` | contenu éditorial en JSON (album, partenaires, vestiaire…) |
| `src/styles/` | `base.css` + `global.css` (vitrine), `qg.css` (Inside) |
| `scripts/` | images d'aperçu, typographie, base de démo, non-régression… |
| `docs/` | la documentation |

Ce dépôt est public : aucune clé ni aucun jeton n'y entre jamais.
