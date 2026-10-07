# 03 · Inside (l'espace équipe)

Inside est l'outil de travail des rosters, de l'encadrement et du pôle contenu. Adresse : `/equipe/`. Connexion par Discord, sans mot de passe : le site lit seulement le pseudo, l'avatar et les rôles sur le serveur Oni Korp.

Pourquoi ce nom : l'ancien « QG » était jugé froid et confus. Le nom devait rester sobre, sans jeu de rôle. Chaque roster ne voit que ce qui sert à **son** jeu (un roster osu! ne voit pas le drafter LoL).

## Qui voit quoi

Tout est calculé dans `src/server/equipe/access.ts` à partir des rôles Discord, recopiés dans la base par le bot (`guild_members`, `guild_roles`).

| Profil | Rôle Discord | Voit | Peut gérer |
|---|---|---|---|
| Encadrement | Admin, Fondateur, Manager, Coach, ou tout rôle avec la permission Administrateur | tous les rosters, la vue d'ensemble | tous les rosters |
| Modérateur | Modérateur (sans autre rôle d'encadrement) | la vue d'ensemble seulement : pas les stratégies, notes ni objectifs des rosters | rien dans Inside (il modère sur Discord) |
| Responsable d'un jeu | « Responsable Rocket League », « … League of Legends », « … Valorant », « … osu! » | tous les rosters de ce jeu | ces rosters |
| Capitaine | Capitaine + rôle du roster | ses rosters | ses rosters (planning, compo, objectifs) |
| Joueur | rôle du roster | ses rosters | ses propres données (réponses, comptes, setups, notes) |
| Analyste | Analyste + rôle du roster | les rosters dont il a le rôle | rien de plus, et il ne compte pas comme joueur |
| Pôle contenu | Casteur, Graphiste, Monteur vidéo, Community manager, Créateur de contenu, Responsable marketing | l'espace Contenu | ses tâches |
| Membre sans rien de tout ça, ou visiteur | — | la **page de présentation** d'Inside (`InsideIntro.astro`) | — |

Dans le code : `teamUser(cookies)` (dans `outils.ts`) renvoie `null` si la personne n'a aucun accès (la page redirige alors vers la présentation). `canSee(me, rosterId)` et `canLead(me, rosterId)` décident pour chaque roster. **Toute page et toute action doivent passer par ces deux fonctions** : ne jamais se fier à ce que le navigateur envoie.

Les rôles ne sont lus qu'une fois toutes les 5 minutes (cache) : un rôle donné sur Discord peut mettre 5 min à ouvrir Inside.

## Les pages

Inside a deux étages (décision du 7 oct. 2026) :

1. **Mon espace** (`/equipe/`, sans `?r=`) : la page perso de chacun. Prochaine échéance tous rosters confondus (avec réponse en un clic), « À faire » (réponses, dispos, comptes à relier, setup, guide), objectifs perso rangés par roster et à sa couleur, ses rosters pour y entrer, l'essai en cours, et pour l'encadrement la Vue d'ensemble. C'est la page d'arrivée de tout le monde, même avec un seul roster.
2. **L'espace d'un roster** : six rubriques, toujours pour **un seul roster** à la fois. Les pages d'une rubrique deviennent des onglets en haut de l'écran (`Qg.astro`, constante `SECTIONS`).

| Rubrique | Page | Adresse | Fichier |
|---|---|---|---|
| Mon espace | Page perso (voir plus haut) | `/equipe/` | `accueil.astro` |
| Accueil | Accueil du roster (prochaine échéance, ta semaine, forme, objectifs, ce qui a bougé) | `/equipe/?r=<slug>` | `accueil.astro` |
| Semaine | Planning (séances, réponses, disponibilités, présence) | `/equipe/planning/` | `../equipe.astro` |
| | Calendrier du mois | `/equipe/calendrier/` | `calendrier.astro` |
| Match | Avant-match (compo, adversaire, checklist) | `/equipe/match/` | `match.astro` |
| | Tournois visés (inscription, statut) | `/equipe/tournois/` | `tournois.astro` |
| | Notes de match (+ débrief LoL automatique) | `/equipe/notes/` | `notes.astro` |
| | VOD commentées | `/equipe/vod/` | `vod.astro` |
| | Scouting (une fiche par adversaire) | `/equipe/scouting/` | `scouting.astro` |
| Progrès | Stats (mesures en jeu, tendances) | `/equipe/stats/` | `mesures.astro` |
| | Objectifs | `/equipe/objectifs/` | `objectifs.astro` |
| Préparer | Tableau blanc (tous les jeux sauf osu!) : modèles pour démarrer en un clic, aperçu de chaque tableau | `/equipe/tactique/` | `tactique.astro` + `tactique.client.ts` |
| | Drafter LoL | `/equipe/lol/` | `lol.astro` + `lol.client.ts` |
| | Lineups Valorant | `/equipe/valo/` | `valo.astro` |
| | osu! (défi de la semaine, maps) | `/equipe/osu/` | `osu.astro` |
| | Tracker Rocket League (Oni Sync) | `/equipe/rl/` | `rl.astro` + `rl-sync.ts` |
| | Packs d'entraînement RL (codes à copier) | `/equipe/packs/` | `packs.astro` |
| | Pools de champions LoL (main, jouable, en apprentissage) | `/equipe/pools/` | `pools.astro` + `PoolBoard.astro` |
| | Compos Valorant par carte et agents de chaque joueur | `/equipe/compos/` | `compos.astro` + `PoolBoard.astro` |
| | Docs du roster (routines, règles, appels) | `/equipe/docs/` | `docs.astro` |
| Équipe | Joueurs (comptes de jeu, statut titulaire/remplaçant/essai) | `/equipe/joueurs/` | `joueurs.astro` |
| | Setups | `/equipe/setup/` | `setup.astro` |
| Menu du compte | Profil d'un joueur | `/equipe/profil/` | `profil.astro` |
| | Guide (rôles, fiches de poste, mode d'emploi) | `/equipe/guide/` | `guide.astro` |
| Sélecteur de roster | Vue d'ensemble (encadrement) : santé des rosters, alertes | `/equipe/vue/` | `vue.astro` |
| Pôle contenu | Contenu (tâches autour des matchs, calendrier éditorial, indicateurs) | `/equipe/contenu/` | `contenu.astro` + `contenu-taches.ts` |

**Roster ou jeu ?** Le roster porte son écosystème : planning, matchs, adversaires (scouting), docs, objectifs, tableaux. Le jeu porte ses propriétés et ses outils, décrits une seule fois dans `jeux.ts` : couleur et sigle, compte à relier, outil dédié (Drafter, Lineups, Tracker, Défis), fond du tableau blanc (aucun pour osu!), repères et liens de profil du scouting. Ajouter un jeu = une entrée dans `jeux.ts`, puis son outil.

**Docs à trois niveaux** (onglet Docs de Préparer) : du roster (le roster écrit et lit), du jeu (le responsable du jeu écrit, tous les rosters du jeu lisent ; `docs.level = 'jeu'`, `docs.game`), du club (l'encadrement écrit, tout Inside lit ; `level = 'club'`). Règle d'écriture : `canWriteDoc()` dans `access.ts`.

**Objectifs individuels privés** : un objectif fixé à un joueur n'est visible que par lui et l'encadrement du roster (`goals.private`), sauf si « Visible par tout le roster » est coché.

**Espace jeu** : la Vue d'ensemble filtrée sur un jeu (`/equipe/vue/?jeu=rl`), avec un onglet par jeu. Un responsable d'un seul jeu y arrive directement.

**Espace Communauté** (`/equipe/communaute/`, `communaute.astro`) : Accueil, Organisateur, Modérateur et encadrement (`me.community`). Arrivées des 14 derniers jours (date d'arrivée relevée par le miroir d'Oni Bot, `guild_members.joined_at`), soirée inhouse du jeudi, parties et tournois communautaires ; la modération (tickets, avertissements, sanctions) pour les modérateurs et l'encadrement seulement. Aucune donnée de roster.

**À gérer** (accueil du roster, pour capitaine, responsable du jeu et encadrement) : essais qui finissent sous 7 jours sans retour écrit, absence de remplaçant, semaine sans séance, joueurs sans réponse à la prochaine séance.

**Plan de séance et relance** : sur Planning, le capitaine ou le coach écrit le plan de chaque séance (`trainings.plan`), repris par Oni Bot sur la carte Discord de la séance. Dans « À gérer », « Relancer sur Discord » pose `trainings.relance_at` : Oni Bot mentionne ceux qui n'ont pas répondu (au plus toutes les 3 h).

**Fiche de cast** (`/equipe/contenu/?cast=<match>`) : pour chaque match public, ce que le casteur doit savoir, uniquement des infos publiques (compo annoncée, postes, rangs, accord d'image, historique contre l'adversaire, derniers résultats). Imprimable.

**Accord d'image** : case dans Mon espace (table `consents`), affichée sur la fiche de cast ; effacé au départ du serveur.

**Tableau blanc** : éléments propres au jeu (`jeux.ts`, `board.kit` : pions, couleurs des deux équipes, repères ; RL ballon, grosse pastille, démolition, rotation ; LoL balises, dragon, Nashor ; Valorant spike, info, entrée), **animation** entre les étapes (les éléments de même identifiant glissent, vitesse 0,5 à 2×, répétition), **export vidéo** (MP4 ou WebM, `MediaRecorder`), traits en pointillés, **brouillons** privés (`boards.owner`, partagés au roster d'un clic). Idées reprises de tactical-board.com (l'outil d'un ami de Viktor).

**Mappool osu!** : une place facultative (NM1 à TB) sur chaque map (`osu_maps.slot`), section « Mappool de tournoi ». **Carnet perso** dans Mon espace (table `carnet`, privé). **Mes contributions** dans Contenu (tâches livrées, copiables en portfolio).

**Mes rosters et rosters suivis.** `access()` marque chaque roster `mine` (la personne a son rôle). L'encadrement voit aussi les autres rosters, mais ils sont rangés à part (« Suivis en encadrement ») et n'ajoutent ni échéances ni tâches dans Mon espace. L'en-tête d'un roster suivi le rappelle.

Le roster affiché vient de `scope()` dans `outils.ts` : celui de `?r=<slug>`, sinon le dernier ouvert (cookie `oni_r`), sinon le premier. **Jamais plusieurs rosters mélangés** : les tableaux, objectifs, docs, notes d'un roster ne s'affichent que dans ce roster. Un outil de jeu ne propose que les rosters de son jeu (4e argument de `scope`). Un lien direct vers un élément (`?b=`, `?d=`, `?v=`, `?o=`, `?m=`) ouvre le roster auquel il appartient (`ownerOf()`). Ce qui traverse les rosters vit dans Mon espace (perso) ou la Vue d'ensemble (encadrement).

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
| `/api/rl/replay` | réception des replays sauvegardés (Oni Sync v6), mis en file pour le bot (`rl-replay.ts`) |

Les tables propres au site sont créées par `ensureTables()` (`outils.ts`) au premier appel : pas de migration à lancer.

## Ajouter un outil (la marche à suivre)

1. **Le placer** : à quelle rubrique il appartient (Semaine, Match, Progrès, Préparer, Équipe) ? S'il ne sert qu'à un jeu, c'est un outil de jeu (`GAME_TOOL` dans `Qg.astro`).
2. **Créer la page** `src/server/equipe/<nom>.astro` en copiant la structure d'une page voisine : `teamUser` → `scope` → données filtrées par `canSee` → `<Qg current="<nom>" …>`.
3. **Déclarer la route** dans `astro.config.mjs` (`route('/equipe/<nom>', …)`) et l'ajouter à `PATH` et `SECTIONS` dans `Qg.astro`.
4. **Les écritures** : une nouvelle entrée dans le bon fichier `actions/*.ts` (avec `canLead` si c'est un geste d'encadrement), et un geste de test dans `scripts/non-regression-actions.mjs`. Une nouvelle table : dans `ensureTables()`, et documentée dans [05 · Données](05-donnees.md).
5. **Si Discord doit réagir** (message, rappel) : le site écrit en base, le bot lit et agit (voir le module `suivi.ts` du bot).
6. **Le style** : tokens d'Inside (`qg.css`), sans illustration ([06 · Design et ton](06-design-et-ton.md)). Vérifier sur téléphone (pas de débordement horizontal).
7. **Le guide** : ajouter une ligne dans `guide.astro` et dans la page de présentation `InsideIntro.astro` si c'est un outil majeur.
8. `VERCEL=1 npm run build`, `npm test`, push.

## Les données des joueurs

Les rangs et parties viennent du bot, qui interroge les API des jeux (Riot pour LoL, HenrikDev pour Valorant, osu! API, ballchasing pour RL) avec **ses** clés, et range tout dans `perf` (une ligne par partie), `stats_cache` (rang actuel, profil) et `rank_history` (un point par jour). Inside lit seulement.

Rocket League est à part : aucune API publique ne donne les parties. Les joueurs lancent **Oni Sync** (un `.cmd` personnel téléchargé dans Tracker), qui lit l'API Stats locale du jeu et envoie chaque partie terminée au site. Le script envoie les messages bruts du jeu et tout le décodage est dans `rl-sync.ts` : on corrige là sans redistribuer le script. Depuis la v6, Oni Sync envoie aussi les replays que le joueur sauvegarde (dossier `Demos`/`DemosEpic`, jamais pendant une partie) : le site les met dans `rl_replays`, Oni Bot les passe à ballchasing avec la clé du club (lien non listé, un groupe « Oni Korp · pseudo » par joueur), puis fusionne positionnement, boost, lien et rang dans la partie d'Oni Sync du même `match_guid`. Le Tracker affiche ces mesures dans « Analyse des replays ».

## Écoute des scrims (Oni Bot 2.52.0)

`/ecoute demarrer` dans le vocal d'un roster : le bot rejoint le salon (micro coupé) et transcrit chaque phrase des joueurs qui ont accepté (`voice_consent`), avec l'heure. L'audio est décodé (Opus → 16 kHz mono) et transcrit hors ligne par Whisper (`oni-bot/scripts/whisper-worker.mjs`, modèle `onnx-community/whisper-small`, téléchargé dans `oni-bot/data/modeles`), puis jeté ; seul le texte va dans `voice_lines`. À l'arrêt (`/ecoute arreter`, salon vide depuis 3 min ou 4 h d'écoute), le bot écrit un doc dans les Docs du roster : à travailler, ce qui va bien, temps de parole, interventions qui se chevauchent, calls longs, blancs de plus de 30 s, mots qui reviennent, transcription horodatée. Le bot ne peut pas faire radio et écoute en même temps. Moteur interchangeable : NVIDIA Parakeet (plus rapide sur processeur) est une piste si Whisper déçoit.

## Tracker LoL

`/equipe/tracker-lol/` (`lol-tracker.astro`) : par joueur, ce qui ressort (forces et points à travailler comparés au roster, sinon à ses 10 parties précédentes), phase de lane (CS à 10, écarts d'or à 10 et 15, XP, plaques, morts avant 15), combat, vision, objectifs, jungle, pool de champions, matchups, dernières parties, puis le roster. Données : `trackers.ts` (bot) garde ~30 mesures du bloc `challenges` de Riot et la chronologie minute par minute (`v: 2` dans la partie). Le PUUID est mis en cache par clé Riot (`puuid:<empreinte>:<riot id>`) : un PUUID dépend de la clé, un changement de clé sans ça coupe le relevé.
