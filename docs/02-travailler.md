# 02 · Travailler sur le projet

## Installer

Prérequis : Node 22 ou plus, Git.

```bash
git clone https://github.com/onikorp/Site-Oni-Korp.git
cd Site-Oni-Korp
npm install
```

Le bot (dépôt privé `onikorp/oni-bot`) s'installe pareil ; il a besoin d'un `.env` (modèle : `.env.example`). Le `.env` réel n'existe que chez Viktor et sur Echo-Host : on ne le copie jamais, on ne le colle jamais dans une discussion.

## Lancer

| Commande (dans le site) | Pour | Base utilisée |
|---|---|---|
| `npm run dev` | la vitrine seule (pages statiques), http://localhost:4321 | aucune |
| `npm run dev:demo` | **Inside complet**, connecté en tant que « Démo » (coach), http://localhost:4330/equipe/ | `.demo/oni.db`, base de démonstration fabriquée par `npm run demo` |
| `node scripts/dev-prod.mjs 4340` | Inside sur la **vraie** base (lit `../oni-bot/.env`) | Turso de production : **tout ce qu'on enregistre y va vraiment** |

La base de démonstration (`scripts/base-demo.sql`) contient 4 rosters fictifs (Academy LoL, osu! Squad, Gamma RL, Valo Main), 3 membres, des matchs, séances, stats, tableaux blancs et tâches de contenu. Pour repartir de zéro : `npm run demo`.

Comment ça marche : en développement, `ONI_DEV_USER=<id Discord>` simule la connexion (voir `src/server/session.ts`), `ONI_API=1` active les routes serveur, `TURSO_DATABASE_URL=file:…` pointe sur un fichier SQLite local.

Pour voir ce que voit quelqu'un **sans accès** (la page de présentation d'Inside) : ajoute `?intro` à l'adresse de Planning (`/equipe/planning/?intro`, en local seulement).

## Modifier le contenu de la vitrine (sans toucher au code)

| Fichier | Contenu |
|---|---|
| `src/data/rosters.json` | Jeux, rosters, joueurs et staff de l'album (page Légendes). Un roster sans joueurs affiche « Line-up à annoncer », un poste staff sans nom « Poste ouvert ». |
| `src/data/matches.json` | Showmatchs et tournois de la section « Sur le terrain ». |
| `src/data/site.json` | Lien Discord, réseaux sociaux, liens de recrutement. |
| `public/img/cartes/` | Vignettes de l'album, intégrées depuis les sources par `npm run cartes` (WebP + AVIF). |
| `public/marque/`, `marque/` | Kit du logo et sa charte (aussi présentés sur `/marque/`). |

Les matchs, l'agenda, les inhouses, les créateurs et les chiffres du serveur ne se modifient pas ici : ils viennent de la base, alimentée par le bot. Après un changement de titre ou de visuel d'une page, relancer `npm run og` (images d'aperçu).

## Vérifier avant de pousser

### Le site

```bash
VERCEL=1 npm run build     # compile AUSSI les pages serveur ; doit finir par « Complete! »
npm run check              # astro check (toutes les pages) + TypeScript strict des fichiers serveur : 0 erreur attendue
npm test                   # non-régression : compare le HTML de 43 pages à la référence
npm run coherence          # si tu as touché aux rôles, postes ou couleurs : compare avec le bot (cloné dans ../oni-bot)
node scripts/parcours-inside.mjs   # serveur de démo lancé : ouvre ~140 pages d'Inside et signale erreurs et « NaN % »
```

`npm test` compare à une référence prise avant ton changement :

1. avant de modifier : `VERCEL=1 npm run build`, serveur de démo lancé (`npm run dev:demo`), puis `node scripts/non-regression.mjs --save` ;
2. tu modifies ;
3. tu rebuildes et tu relances `npm test` : chaque page qui change est listée avec l'endroit exact du changement.

Un changement voulu (nouveau texte, nouveau bloc) apparaît forcément : vérifie juste que ce sont les seuls. Pour un **refactoring**, il ne doit y avoir **aucune** différence.

Pour les **formulaires d'Inside** (les actions), `node scripts/non-regression-actions.mjs` rejoue un geste de chaque type sur la base de démo et compare redirections et données écrites (`--save` avant, sans option après ; `npm run demo` entre les deux pour repartir de la même base).

### Le bot

```bash
npm run check   # TypeScript + variables inutilisées
npm test        # compile puis vérifie cartes image, équilibrage et postes (scripts/non-regression.json)
```

Si une carte change exprès (nouveau design), regarde-la (`node scripts/preview-cartes.mjs <dossier>`), puis enregistre la nouvelle référence : `node scripts/non-regression.mjs --save`.

## Mettre en ligne

### Le site

`git push` sur `main` : Vercel republie tout seul en 1 à 2 minutes. Pour vérifier :

- le statut du commit sur GitHub (pastille Vercel verte), ou `https://api.github.com/repos/onikorp/Site-Oni-Korp/commits/<sha>/status` ;
- https://oni-korp.vercel.app/api/sante : `base: ok` et la version déployée.

Une variable ajoutée sur Vercel n'est prise qu'au déploiement suivant.

### Le bot

1. `npm test` doit passer.
2. Ajoute une entrée en tête de `src/changelog.ts` (version, date, ce que les membres voient, notes staff) : le bot la publie au démarrage.
3. `git push`, puis redémarrer le bot : bouton **Restart** du panneau Echo-Host (il refait `git pull` + `npm install`, qui compile). Viktor a aussi `node scripts/echo.mjs redemarrer` (clé du panneau dans un fichier hors dépôt).
4. La console doit afficher `Oni Bot en ligne : … · N commandes · N modules`.

Regrouper les changements du bot : chaque redémarrage coupe la radio et les appels « Prêt ? » en cours.

### Le serveur Discord

Les salons, rôles et permissions se changent avec les scripts `discord/*.mjs` du dossier de Viktor : mode **simulation** par défaut, `--apply` pour appliquer. **C'est toujours Viktor qui lance `--apply`.** On ne supprime jamais un salon qui contient des messages, et on ne retire jamais l'accès de quelqu'un sans avoir vérifié que son nouvel accès marche.

## Conventions

- **Tout en français** : interface, messages du bot, commentaires du code, noms des commits. Les noms de variables restent courts, en anglais ou en français selon le fichier (suivre le voisinage).
- **Un commentaire en tête de chaque fichier** : à quoi il sert, qui l'appelle, ce qui est particulier. C'est ce qui permet de retrouver où est quoi : garde-le à jour.
- **Typographie** : apostrophe typographique ’ dans les textes, guillemets « », espaces insécables. Le build du site corrige le HTML compilé (`scripts/typo.mjs`), mais pas les messages du bot.
- **Ton** : voir [06 · Design et ton](06-design-et-ton.md). Pas d'emoji décoratif, pas de formules toutes faites.
- **Pas de nouvelle dépendance** sans raison forte : tout tient avec Astro, discord.js, libSQL et resvg.
- **Sources tierces** : seulement avec l'accord de leur auteur, et créditées dans l'interface ([07 · Décisions](07-decisions.md)).

## Pièges connus (tous déjà rencontrés)

| Symptôme | Cause | Parade |
|---|---|---|
| Une variable utilisée mais jamais définie (le site plante sur une action précise) | Ligne déplacée au mauvais endroit : le build ne vérifie pas les types | `npm run check` (deux bugs de ce genre trouvés le 06/10 : enregistrer un draft LoL, créer un doc) |
| Le déploiement Vercel échoue alors que `npm run build` passait | Build sans `VERCEL=1` : les pages serveur n'étaient pas compilées | Toujours `VERCEL=1 npm run build` |
| Une apostrophe casse une page serveur | `'` non échappée dans une chaîne JS en apostrophes | Écrire ’ dans les textes, ou des gabarits `` ` `` |
| Une page déborde sur téléphone (on glisse sur les côtés) | Grille CSS dont la colonne s'élargit sur un contenu long (tableau, lien) | `grid-template-columns: minmax(0, 1fr)` sur la grille ; les tableaux larges dans un cadre `overflow-x: auto` |
| Un style ne s'applique pas au HTML injecté (`set:html`, `innerHTML`) | Styles scopés d'Astro | `:global(.classe)` |
| Le serveur de dev garde un vieux CSS | Cache de Vite | Redémarrer le serveur de dev |
| Une nouvelle route serveur renvoie 404 | Pas déclarée | L'ajouter avec `route()` dans `astro.config.mjs`, puis redémarrer |
| Deux bots répondent en double | Le bot tourne à deux endroits | Il refuse de démarrer s'il tourne déjà ailleurs ; ne jamais le lancer sur un PC en même temps qu'Echo-Host |
| Discord n'affiche pas l'aperçu d'un lien | Le robot de Discord ne joint pas certains sites | Ne pas compter sur les aperçus de sites tiers |
| Quota Vercel ou Turso qui grimpe | Un écran qui interroge le serveur en boucle | Espacer quand rien ne bouge (exemple : `tactique.client.ts`, suivi en direct adaptatif) |
