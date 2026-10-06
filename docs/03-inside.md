# 03 · Inside (l'espace équipe)

Inside est l'outil de travail des rosters, de l'encadrement et du pôle contenu. Adresse : `/equipe/`. Connexion par Discord, sans mot de passe : le site lit seulement le pseudo, l'avatar et les rôles sur le serveur Oni Korp.

Pourquoi ce nom : l'ancien « QG » était jugé froid et confus. Le nom devait rester sobre, sans jeu de rôle. Chaque roster ne voit que ce qui sert à **son** jeu (un roster osu! ne voit pas le drafter LoL).

## Qui voit quoi

Tout est calculé dans `src/server/equipe/access.ts` à partir des rôles Discord, recopiés dans la base par le bot (`guild_members`, `guild_roles`).

| Profil | Rôle Discord | Voit | Peut gérer |
|---|---|---|---|
| Encadrement | Admin, Fondateur, Manager, Coach, Modérateur, ou tout rôle avec la permission Administrateur | tous les rosters, la vue d'ensemble | tous les rosters |
| Responsable d'un jeu | « Responsable Rocket League », « … League of Legends », « … Valorant », « … osu! » | tous les rosters de ce jeu | ces rosters |
| Capitaine | Capitaine + rôle du roster | ses rosters | ses rosters (planning, compo, objectifs) |
| Joueur | rôle du roster | ses rosters | ses propres données (réponses, comptes, setups, notes) |
| Analyste | Analyste + rôle du roster | les rosters dont il a le rôle | rien de plus, et il ne compte pas comme joueur |
| Pôle contenu | Casteur, Graphiste, Monteur vidéo, Community manager, Créateur de contenu, Responsable marketing | l'espace Contenu | ses tâches |
| Membre sans rien de tout ça, ou visiteur | — | la **page de présentation** d'Inside (`InsideIntro.astro`) | — |

Dans le code : `teamUser(cookies)` (dans `outils.ts`) renvoie `null` si la personne n'a aucun accès (la page redirige alors vers la présentation). `canSee(me, rosterId)` et `canLead(me, rosterId)` décident pour chaque roster. **Toute page et toute action doivent passer par ces deux fonctions** : ne jamais se fier à ce que le navigateur envoie.

Les rôles ne sont lus qu'une fois toutes les 5 minutes (cache) : un rôle donné sur Discord peut mettre 5 min à ouvrir Inside.

## Les pages

Le menu a six rubriques. Les pages d'une rubrique deviennent des onglets en haut de l'écran (`Qg.astro`, constante `SECTIONS`).

| Rubrique | Page | Adresse | Fichier |
|---|---|---|---|
| Accueil | Accueil du roster (prochaine échéance, ta semaine, forme, objectifs) ; sans roster choisi : choix du roster | `/equipe/` | `accueil.astro` |
| Semaine | Planning (séances, réponses, disponibilités, présence) | `/equipe/planning/` | `../equipe.astro` |
| | Calendrier du mois | `/equipe/calendrier/` | `calendrier.astro` |
| Match | Avant-match (compo, adversaire, checklist) | `/equipe/match/` | `match.astro` |
| | Tournois visés (inscription, statut) | `/equipe/tournois/` | `tournois.astro` |
| | Notes de match (+ débrief LoL automatique) | `/equipe/notes/` | `notes.astro` |
| | VOD commentées | `/equipe/vod/` | `vod.astro` |
| | Scouting (une fiche par adversaire) | `/equipe/scouting/` | `scouting.astro` |
| Progrès | Stats (mesures en jeu, tendances) | `/equipe/stats/` | `mesures.astro` |
| | Objectifs | `/equipe/objectifs/` | `objectifs.astro` |
| Outils | Tableau blanc (tous les jeux) | `/equipe/tactique/` | `tactique.astro` + `tactique.client.ts` |
| | Drafter LoL | `/equipe/lol/` | `lol.astro` + `lol.client.ts` |
| | Lineups Valorant | `/equipe/valo/` | `valo.astro` |
| | osu! (défi de la semaine, maps) | `/equipe/osu/` | `osu.astro` |
| | Tracker Rocket League (Oni Sync) | `/equipe/rl/` | `rl.astro` + `rl-sync.ts` |
| Équipe | Joueurs (comptes de jeu, statut titulaire/remplaçant/essai) | `/equipe/joueurs/` | `joueurs.astro` |
| | Setups | `/equipe/setup/` | `setup.astro` |
| | Docs du roster | `/equipe/docs/` | `docs.astro` |
| Menu du compte | Profil d'un joueur | `/equipe/profil/` | `profil.astro` |
| | Guide (rôles, fiches de poste, mode d'emploi) | `/equipe/guide/` | `guide.astro` |
| Sélecteur de roster | Vue d'ensemble (encadrement) : santé des rosters, alertes | `/equipe/vue/` | `vue.astro` |
| Pôle contenu | Contenu (tâches autour des matchs, calendrier éditorial, indicateurs) | `/equipe/contenu/` | `contenu.astro` + `contenu-taches.ts` |

Le roster affiché se choisit avec `?r=<slug>` (`scope()` dans `outils.ts`). Sans `?r`, une page montre tous les rosters de la personne.

## Comment une page écrit

Presque toutes les modifications passent par **un seul point d'entrée** : `POST /api/equipe/outils` (`outils.ts`), avec un champ `action` (`note`, `draft`, `setup`, `objectif`, `statut`, `tache`, `competition`…) et un champ `back` (où revenir). `outils.ts` vérifie la personne, puis passe la main à l'action, rangée par domaine :

| Fichier | Actions |
|---|---|
| `actions/compte.ts` | `ics-regen`, `deconnexion-partout`, `staff-public`, `comptes`, `setup` |
| `actions/contenu.ts` | `metric`, `competition`, `tache` et `tache-*` |
| `actions/roster.ts` | `statut`, `objectif`, `objectif-maj`, `doc`, `osu-map`, `tableau`, `suppr` |
| `actions/match.ts` | `note`, `draft`, `lineup`, `stats`, `vod`, `vod-mark`, `replay`, `adversaire`, `compo` |
| `actions/base.ts` | ce que reçoit chaque action (`Ctx`) et les petits outils (`clip`, `num`) |

Les sources tierces (lolalytics, LineupsValorant, VCRDB) sont lues et mises en cache dans `sources.ts`, servies par `GET /api/equipe/outils?type=ll|lv|vc`.

Chaque action :

1. vérifie l'origine de la requête (`sameOrigin`) et l'utilisateur (`teamUser`) ;
2. vérifie le droit sur le roster (`canSee` / `canLead`) ;
3. écrit en base, puis redirige vers `back`.

Les formulaires fonctionnent donc sans JavaScript. Exceptions, qui ont leur propre API parce qu'elles sont « en direct » :

| API | Pour |
|---|---|
| `/api/equipe/presence` | répondre à une séance (le bot met à jour le message Discord) |
| `/api/equipe/dispos` | disponibilités de la semaine |
| `/api/equipe/tableau` | tableau blanc partagé (lecture « depuis », écriture de l'état complet) |
| `/api/equipe/agenda.ics` | agenda perso (lien secret, sans connexion) |
| `/api/rl/oni-sync`, `/api/rl/sync` | téléchargement d'Oni Sync, réception des parties RL |

Les tables propres au site sont créées par `ensureTables()` (`outils.ts`) au premier appel : pas de migration à lancer.

## Ajouter un outil (la marche à suivre)

1. **Le placer** : à quelle rubrique il appartient (Semaine, Match, Progrès, Outils, Équipe) ? S'il ne sert qu'à un jeu, c'est un outil de jeu (`GAME_TOOL` dans `Qg.astro`).
2. **Créer la page** `src/server/equipe/<nom>.astro` en copiant la structure d'une page voisine : `teamUser` → `scope` → données filtrées par `canSee` → `<Qg current="<nom>" …>`.
3. **Déclarer la route** dans `astro.config.mjs` (`route('/equipe/<nom>', …)`) et l'ajouter à `PATH` et `SECTIONS` dans `Qg.astro`.
4. **Les écritures** : une nouvelle entrée dans le bon fichier `actions/*.ts` (avec `canLead` si c'est un geste d'encadrement), et un geste de test dans `scripts/non-regression-actions.mjs`. Une nouvelle table : dans `ensureTables()`, et documentée dans [05 · Données](05-donnees.md).
5. **Si Discord doit réagir** (message, rappel) : le site écrit en base, le bot lit et agit (voir le module `suivi.ts` du bot).
6. **Le style** : tokens d'Inside (`qg.css`), sans illustration ([06 · Design et ton](06-design-et-ton.md)). Vérifier sur téléphone (pas de débordement horizontal).
7. **Le guide** : ajouter une ligne dans `guide.astro` et dans la page de présentation `InsideIntro.astro` si c'est un outil majeur.
8. `VERCEL=1 npm run build`, `npm test`, push.

## Les données des joueurs

Les rangs et parties viennent du bot, qui interroge les API des jeux (Riot pour LoL, HenrikDev pour Valorant, osu! API, ballchasing pour RL) avec **ses** clés, et range tout dans `perf` (une ligne par partie), `stats_cache` (rang actuel, profil) et `rank_history` (un point par jour). Inside lit seulement.

Rocket League est à part : aucune API publique ne donne les parties. Les joueurs lancent **Oni Sync** (un `.cmd` personnel téléchargé dans Tracker), qui lit l'API Stats locale du jeu et envoie chaque partie terminée au site. Le script envoie les messages bruts du jeu et tout le décodage est dans `rl-sync.ts` : on corrige là sans redistribuer le script.
