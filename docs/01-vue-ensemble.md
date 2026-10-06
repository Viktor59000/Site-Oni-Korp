# 01 · Vue d'ensemble

## Le club

Oni Korp est un club esport français associatif (depuis 2021, anciennement 4C Korp), sur quatre jeux : **Rocket League, League of Legends, Valorant, osu!**. RL, LoL et Valorant sont relancés en priorité ; osu! reste surtout communautaire. Tout se passe d'abord sur le **Discord du club** (une centaine de membres) ; le site sert de vitrine et d'outil de travail.

Le diagnostic qui guide le projet (audit d'octobre 2026) : **l'outillage existe, il manque des gens.** Les outils doivent donc faire gagner du temps aux bénévoles, faire remonter ce qui demande une décision humaine, et donner envie de rejoindre.

## Les trois pièces

```
                    ┌───────────────────────────────┐
  Membres Discord ─►│  Oni Bot (discord.js, Node)   │  hébergé chez Echo-Host, 24 h/24
                    │  35 modules, ~40 commandes    │
                    └───────────────┬───────────────┘
                                    │ lit / écrit
                                    ▼
                    ┌───────────────────────────────┐
                    │  Base Turso (libSQL/SQLite)   │  une seule base, partagée
                    └───────────────┬───────────────┘
                                    │ lit / écrit
                                    ▼
                    ┌───────────────────────────────┐
  Visiteurs ───────►│  Site Astro sur Vercel        │  oni-korp.vercel.app
  Joueurs, staff ──►│  vitrine publique + Inside    │
                    └───────────────────────────────┘
```

1. **Le site** (`Site-Oni-Korp`, Astro) a deux visages :
   - **la vitrine publique** : accueil, club, légendes (album de vignettes), boosters, agenda, recrutement, inhouses, créateurs, staff, vestiaire, partenaires, kit de marque, contact. Pages statiques, très rapides.
   - **Inside** (`/equipe/…`) : l'espace de travail des rosters et du staff, avec connexion Discord. Planning, présences, disponibilités, avant-match, scouting, stats, tableau blanc, drafter LoL, lineups Valorant, osu!, tracker RL, contenu, tournois… Rendu côté serveur (fonctions Vercel).
2. **Oni Bot** (`oni-bot`, TypeScript + discord.js) : il organise le serveur (accueil, journal, candidatures, rosters, matchs, entraînements, inhouses, tickets, niveaux, radio…) et **relève les données** que le site affiche (rangs et parties via les API des jeux, membres et rôles du serveur, lives Twitch…).
3. **La base Turso** : une seule base SQLite hébergée, que les deux lisent et écrivent. C'est le seul lien entre le bot et le site : il n'y a pas d'API entre eux.

## Comment ils se parlent (exemples concrets)

- Un coach planifie un entraînement avec `/entrainement` sur Discord → le bot l'écrit dans `trainings` → Inside l'affiche dans Planning et Calendrier. Un joueur répond « Présent » sur le site → `attendance` → dans la minute, le bot met à jour le message Discord.
- Le bot recopie les membres et leurs rôles dans `guild_members` / `guild_roles` (le « miroir ») : en entier au démarrage, puis à chaque arrivée, départ, changement de rôle ou de pseudo → Inside décide de qui voit quoi avec ces rôles ([03 · Inside](03-inside.md)).
- Le bot interroge l'API Riot, HenrikDev, osu!… avec **ses** clés → `perf`, `stats_cache`, `rank_history` → Inside affiche Stats et profils. Les clés d'API des jeux ne sont **jamais** sur Vercel.
- Une candidature envoyée sur le site → `applications` → le bot ouvre un fil privé avec le staff sur Discord dans les 30 s.
- Les actions « qui doivent se voir sur Discord » passent donc toujours par la base, et le bot les reprend à son prochain passage.

## Hébergement

| Pièce | Service | Coût | Mise à jour |
|---|---|---|---|
| Site + Inside + API | Vercel (Hobby) | gratuit | automatique à chaque push sur `main` |
| Base | Turso (Free) | gratuit | — |
| Bot | Echo-Host (offre Nitro, panneau Pterodactyl) | 0,49 €/mois | `git pull` + compilation au redémarrage |

Limites à garder en tête (offres gratuites) : quotas d'appels Vercel et de lectures Turso. Pas de facture surprise (pas de carte bancaire), mais un service coupé jusqu'au mois suivant si on dépasse. D'où, par exemple, le suivi en direct du tableau blanc qui ralentit tout seul quand personne ne dessine.

## Où est quoi

```
Site-Oni-Korp/
├─ docs/                     ← cette documentation
├─ astro.config.mjs          ← déclare TOUTES les routes serveur (Inside, API) avec route()
├─ src/pages/                ← vitrine publique (statique)
├─ src/server/               ← rendu serveur : API publiques, session, base
│  ├─ equipe/                ← Inside : une page .astro par outil + access.ts (droits) + outils.ts (actions)
│  ├─ recrutement/           ← /postuler
│  └─ auth/                  ← connexion Discord (OAuth)
├─ src/components/ layouts/  ← composants de la vitrine
├─ src/data/*.json           ← contenu éditorial (rosters de l'album, partenaires, vestiaire…)
├─ src/styles/global.css     ← DA de la vitrine ; qg.css ← DA d'Inside
├─ public/                   ← images (vignettes, terrains, logos), polices
└─ scripts/                  ← outils (images Open Graph, typographie, non-régression, aperçu sur la vraie base…)

oni-bot/
├─ src/index.ts              ← point d'entrée : charge les modules, enregistre les commandes
├─ src/modules/*.ts          ← un fichier par fonction (inhouse.ts découpé dans modules/inhouse/)
├─ src/store.ts              ← création des tables + accès aux tables principales
├─ src/config.ts             ← noms des salons, rôles, couleurs, émojis
├─ src/cards.ts lineup.ts versus.ts ← cartes image (SVG → PNG)
├─ src/changelog.ts          ← notes de version, publiées au démarrage
├─ assets/                   ← polices et images des cartes
└─ scripts/                  ← redémarrage Echo-Host, tests, non-régression, restauration
```
