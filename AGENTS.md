# Consignes pour les agents (Codex, Claude Code…) et les nouveaux venus

Lis d'abord [`docs/README.md`](docs/README.md) : toute la documentation du projet (site, Inside, Oni Bot, base, décisions) y est, en français. Ce fichier ne fait que rappeler les règles qu'on ne doit jamais casser.

## Avant de pousser
- `VERCEL=1 npm run build` doit finir par « Complete! » (sans `VERCEL=1`, les pages serveur ne sont pas compilées), puis `npm test`.
- Un changement d'Inside qui touche les actions : non-régression avant et après (`docs/02-travailler.md`).
- On pousse **uniquement sur `main`** (chaque push republie le site sur Vercel ; pas d'autres branches qui consomment les déploiements).

## Ne jamais
- Mettre une clé, un jeton, un mot de passe ou un `.env` dans le dépôt : **il est public**.
- Réutiliser un visuel existant dans une nouvelle situation (à part le logo) : on note le besoin d'un visuel dédié (`docs/06-design-et-ton.md`).
- Écrire dans le kit **Agrume Design** de Yuzu : lecture seule, il sert de référence au style d'Inside.
- Toucher une table de la base sans lire `docs/05-donnees.md` : le site et Oni Bot partagent la même base.
- Refaire un outil communautaire qui existe déjà (osu!track, Bathbot…) : on ne construit que ce qui est propre au club (`docs/07-decisions.md`).

## Écrire
- Interface, documentation et textes en **français**. Les textes publics suivent la charte : ton direct, 0 à 2 emojis utiles, pas de formules creuses (`docs/06-design-et-ton.md`).
- La doc vit avec le code : un changement important met à jour la page de `docs/` concernée.
- Mouvement : jetons `--ease`, `--t-fast`, `--t-move` de `src/styles/base.css`, et respect de `prefers-reduced-motion`.
