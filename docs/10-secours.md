# 10 · Quand un service tombe

Le club tient sur des services gratuits ou presque. Cette fiche dit, pour chacun, comment voir qu'il est tombé, ce que ça casse et quoi faire. Premier réflexe dans tous les cas : **https://oni-korp.vercel.app/api/sante** (version du site, base « ok », dernier signal du bot) et `node oni-bot/scripts/echo.mjs etat` (bot).

| Service | Ça sert à | Signe qu'il est tombé | Ce qui casse | Quoi faire |
|---|---|---|---|---|
| **Vercel** (site) | site public et Inside | le site ne répond plus ; `api/sante` muet | tout le site | Vérifier vercel-status.com. Si c'est le quota (stockage, déploiements) : supprimer les vieux déploiements (`site/scripts/vercel-menage.mjs`). Ne pousser que `main` (chaque branche crée un déploiement). En dernier recours, le site se construit aussi pour Node (`ONI_NODE=1 npm run build`) et peut tourner ailleurs. |
| **Turso** (base) | toutes les données du site et du bot | `api/sante` répond « base » en erreur ; le bot logue des erreurs SQL | Inside, inhouses, stats | Vérifier status.turso.tech. Le bot sauvegarde la base chaque jour sur le serveur de coulisses (30 jours) : `node oni-bot/scripts/restaurer.mjs` (simulation, puis `--apply`) vers une nouvelle base, puis changer `TURSO_*` dans le `.env` du bot (`echo.mjs env`) et dans Vercel. |
| **Echo-Host** (bot) | Oni Bot | « dernier signal du bot » de plus de 15 min dans `api/sante` | annonces, inhouses, rappels, relevés de stats | `echo.mjs etat`, puis `echo.mjs redemarrer`. Si la mise à jour bloque (`git pull` refusé) : regarder `echo.mjs console` ; ne jamais modifier `package-lock.json` dans le dépôt (le serveur le garde tel quel, `.npmrc`). Node du serveur : v21 au plus. Le bot tourne aussi sur un PC : `npm start` avec le même `.env` (un seul à la fois). |
| **GitHub** | code, déploiements | push refusé (« Internal Server Error ») | mises à jour | Réessayer quelques minutes plus tard (vu le 07/10 : passé au 4e essai). Si Vercel n'a pas déployé ensuite : pousser un commit vide. |
| **Discord** | serveur, bot | discordstatus.com | tout ce qui passe par Discord | Attendre ; le site et Inside continuent de marcher. |
| **Clé Riot** (LoL) | stats LoL, débrief | plus aucune partie LoL nouvelle ; erreurs 401/403 dans la console | Tracker LoL, Stats | Régénérer la clé sur developer.riotgames.com, la mettre dans le `.env` du bot (`RIOT_API_KEY`), `echo.mjs env`. Les PUUID se recalculent seuls (cache lié à la clé). |
| **HenrikDev** (Valorant) | stats Valorant | erreurs 401/429 | Tracker Valorant | Nouvelle clé gratuite sur le Discord HenrikDev, `HENRIK_API_KEY`. En attendant : tracker.gg. |
| **osu! API** | rang, tops plays, défis | jeton refusé | annonces osu!, défis | Nouvelle application OAuth sur osu.ppy.sh (compte du club), `OSU_CLIENT_ID` / `OSU_CLIENT_SECRET`. |
| **ballchasing** | replays RL | replays « refusé » dans le Tracker RL | stats avancées RL, rangs | Nouvelle clé sur ballchasing.com/upload, `BALLCHASING_TOKEN`. Oni Sync continue d'envoyer les parties sans replay. |
| **Hugging Face** | télécharger le modèle de l'écoute (une fois) | rapport d'écoute en erreur « téléchargement » | `/ecoute` | Le modèle est gardé dans `oni-bot/data/modeles` après le premier téléchargement. Whisper (`STT_ENGINE=whisper`) vient aussi de Hugging Face : attendre la fin de la panne. |
| **jsDelivr** | archives de decals RL | téléchargement des decals en erreur | vestiaire RL | jsDelivr ne fait que servir les fichiers du dépôt GitHub : le temps de la panne, pointer les liens vers GitHub (raw.githubusercontent.com). |

## Qui peut faire quoi

- **Viktor** : clés Riot, osu!, ballchasing, Vercel, panneau Echo-Host.
- **Yuzu** : a la clé Echo-Host ; peut redémarrer, lire la console, restaurer une sauvegarde.
- Les clés ne s'écrivent jamais dans un message ni dans le dépôt : uniquement dans les `.env` (bot) et les variables Vercel (site).

## Réinstaller de zéro

Repris de l'ancienne fiche de mise en ligne (`notes/archives/technique/DEPLOIEMENT.md`, 5 octobre 2026). Comptes créés par Viktor ; les jetons ne se collent jamais dans un message, seulement dans les cases indiquées.

1. **Turso** (base) : turso.tech, formule Free, base `oni-korp` en Europe. Créer deux jetons sans expiration : **Read & Write** pour le bot, **Read only** pour le site.
2. **Vercel** (site) : importer le dépôt `onikorp/Site-Oni-Korp`, projet `oni-korp` (adresse oni-korp.vercel.app), framework Astro. Variables : `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (le jeton **Read only**), `SITE_URL=https://oni-korp.vercel.app`, plus les secrets de session et de connexion Discord du site. Chaque push sur `main` republie.
3. **GitHub** : dépôt `onikorp/oni-bot` privé ; le `.env` n'est jamais envoyé.
4. **Echo-Host** (bot, offre Nitro) : œuf « node.js generic ». Onglet **Startup** :
   - image Docker : la plus récente proposée (Node **21** au plus chez Echo-Host ; le bot demande Node 20 ou plus) ;
   - dépôt `https://github.com/onikorp/oni-bot.git`, branche `main`, utilisateur GitHub de Viktor, **jeton GitHub en lecture seule** (Fine-grained token, *Resource owner* : onikorp, dépôt oni-bot, *Contents* : Read-only) ;
   - **Auto Update** activé (chaque redémarrage fait `git pull`) ; fichier principal `dist/index.js` ; arguments Node `--no-warnings` si la case existe ;
   - si le serveur a été installé avant que le dépôt soit rempli : **Settings → Reinstall Server** (ou `node scripts/echo.mjs reinstaller`).
   Puis créer `.env` à la racine (onglet Fichiers, ou `node scripts/echo.mjs env` depuis le PC de Viktor) et démarrer : la console doit afficher « Oni Bot en ligne ».
   **Ne jamais copier le dossier `node_modules` du PC** : les modules natifs (base libsql, rendu des cartes, transcription) s'installent pour Linux sur le serveur.
5. **Nom de domaine** (plus tard) : `oni-korp.fr` (~7 €/an chez OVH ou Cloudflare), puis Vercel → Settings → Domains et les 2 lignes DNS indiquées. Rien d'autre à changer.
