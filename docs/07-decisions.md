# 07 · Décisions (et pourquoi)

Le journal des choix qui structurent le projet. Avant de défaire l'un d'eux, lire la raison. Pour en ajouter un : date, décision, raison, en trois lignes.

## Organisation et outils

- **Un seul bot maison, une seule base partagée** (oct. 2026). Le serveur empilait une dizaine de bots en doublon, dont certains morts. Oni Bot les remplace, et le site lit la même base : pas d'API à maintenir entre les deux.
- **Hébergement gratuit ou presque** : Vercel Hobby, Turso Free, Echo-Host à 0,49 €/mois. Le club est bénévole, sans budget. Conséquences : dépôt du site public (Vercel Hobby ne déploie pas un dépôt privé d'organisation), quotas à ménager.
- **Le bot est privé, le site public.** Aucune clé dans le dépôt du site ni dans sa doc.
- **Les clés des API de jeux restent sur le bot**, jamais sur Vercel : le bot relève, le site lit. Une seule fuite possible au lieu de deux.
- **Les changements du serveur Discord passent par des scripts lancés par Viktor** (simulation, puis `--apply`). Raison : on a perdu une fois des accès en « rangeant » (un rôle pas donné, une erreur avalée). Règle depuis : ne jamais retirer un accès avant d'avoir vérifié le nouveau, et donner l'accès aux bureaux privés personne par personne sur le salon.
- **« L'outil repère, une personne décide »** (grille de l'audit, partie 8). Le bot signale (candidature sans réponse, tâche orpheline, roster sans remplaçant), il ne sanctionne ni ne tranche seul.

## Le club

- **Jeux prioritaires : RL, LoL, Valorant** ; osu! reste communautaire (6 oct. 2026).
- **Bureau restreint de la future association : Viktor et Yuzu** ; bureau large inchangé.
- **Agenda public = les grands rendez-vous seulement** (tournois, ligues, showmatchs). Les scrims restent internes : planning du roster, Inside, agenda perso, jamais sur `/agenda` ni dans #annonces.
- **Recrutement joueurs à partir de 18 ans.**
- **Inhouses classés ouverts à tous les membres**, avec garde-fous : compte Discord de plus de 30 jours, présent sur le serveur depuis 3 jours, Elo bloqué au-delà de 3 parties 1v1 en 24 h contre la même personne (anti-farm).
- **Programme créateurs** : on dit « Créateur de contenu », pas « ambassadeur ». Le contrat : 4 lives par mois tagués Oni Korp + le club dans la bio, contre de la visibilité (alertes, page Créateurs, récap, priorité de cast).

## Inside

- **Modérateur hors de l'encadrement d'Inside** (6 oct. 2026) : il garde la modération Discord, les tickets et la vue d'ensemble, sans voir les stratégies, notes et objectifs des rosters. Un modérateur veille à un serveur sain, pas au jeu des rosters.
- **Retour de fin d'essai visible par la recrue** (6 oct. 2026) : sur son profil Inside, et en message privé d'Oni Bot dès qu'il est écrit. C'est la transparence promise dans la fiche de poste.
- **Soirée inhouse fixe : le jeudi à 21 h** (6 oct. 2026) : un soir de semaine, loin des matchs et tournois du week-end, assez tard pour qui travaille ou étudie. Annonce à 17 h (rôle « Notif inhouses »), ouverture des files à 20 h 55.
- **Pas de tableau blanc pour osu!** (6 oct. 2026) : les joueurs osu! n'en ont pas l'usage ; leur outil reste « Défis et maps ».

- **Mon espace, puis un roster à la fois** (7 oct. 2026) : `/equipe/` est la page perso de chacun ; chaque outil d'équipe n'affiche qu'un roster. Raison : les tableaux, objectifs et docs des autres équipes « polluaient » les pages. Analyse complète dans `notes/strategie/ANALYSE-CLUB.md` (PESTEL, SWOT, fiche par profil).
- **Le roster porte l'écosystème, le jeu porte les outils** (7 oct. 2026) : propriétés de chaque jeu dans `jeux.ts` ; un roster suivi en encadrement ne se mélange pas avec les siens (demande de Viktor).
- **Stats Rocket League par Oni Sync v3** : événements du jeu (sauvetages miraculeux, frappes aériennes, dégagements, démolitions…) et relevés chaque seconde (boost moyen, supersonique, temps en l'air). On affiche les mesures utiles pour progresser, pas toute la liste du jeu. Le jeu ne publie pas le rang.
- **Rubrique « Préparer »** (ex-« Outils ») : tableau blanc, outil du jeu et Docs du roster côte à côte.
- **Terrain Rocket League réaliste** sur le tableau blanc : vraie forme, buts, 34 boosts aux positions du jeu, coups d'envoi (`scripts/terrain-rl.mjs`).
- **Oni Sync dans la zone de notification** (7 oct. 2026), sans fenêtre ; notifications Windows seulement quand il faut agir (jamais à chaque partie). **Pas de mod type BakkesMod qui contourne l'anti-triche** (Easy Anti-Cheat) : risque de bannissement des comptes et contraire aux conditions d'Epic et Psyonix.

- **Nom « Inside »** (l'ancien « QG » était froid et confus). Noms d'outils sobres.
- **Rangement par usage** (Accueil, Semaine, Match, Progrès, Outils, Équipe) et **outils filtrés selon le jeu** du roster.
- **Accès par fonction** (6 oct. 2026) : capitaine, analyste, responsable de jeu et pôle contenu ont un accès adapté, pas seulement l'encadrement. Le diagnostic de l'audit : « l'outillage existe, il manque les gens ». Ceux qui aident devaient pouvoir utiliser les outils.
- **Les non-membres voient une présentation d'Inside**, pas une impasse ni les données.
- **Pas d'illustration dans Inside** : les en-têtes illustrés par jeu ont été jugés « horribles ». C'est un outil, pas une vitrine.
- **Le tableau blanc interroge le serveur de moins en moins souvent quand rien ne bouge** : à 1,5 s fixe, un onglet ouvert faisait 2 400 appels à l'heure, de quoi épuiser les quotas gratuits.
- **Rocket League : Oni Sync** (6 oct. 2026). Le service de rangs (RapidAPI) est hors ligne, ballchasing n'a que les replays envoyés à la main, Tracker.gg et Bakkboard n'ont pas d'API publique. Oni Sync lit l'API Stats officielle du jeu sur le PC du joueur, comme Bakkboard. Le script envoie les messages bruts pour qu'on puisse corriger le décodage côté site sans redistribuer le script.

## Sources tierces

Accord obtenu, à **toujours créditer** dans l'interface : RiftKit / Coach Kirei (cartes vectorielles de la Faille, buissons), lolalytics (analyse de draft), LineupsValorant, VCRDB (viseurs Valorant). **Pour toute nouvelle source, demander à Viktor s'il a l'accord avant de reprendre son contenu.** Les données officielles (Data Dragon, valorant-api, API osu!, ballchasing) sont utilisées selon leurs conditions.

## Design

- Marque **Oni Korp**, kanji 鬼 au cœur de la DA, logo = blason d'origine redessiné.
- **Album de vignettes « style 1 »** (masque oni personnel, 4 encres), sans mélange de styles.
- **Un visuel = une situation** (hors logo).
- Vitrine et Inside ont **deux DA distinctes** (affiche / outil).

## Ce qu'on a essayé et abandonné

- **Réponses du bot aux liens de replays o!rdr** (6 oct. 2026) : carte puis lecteur vidéo relayé par le site. Retiré à la demande de Viktor : peu utile par rapport au lien, et la vidéo (≈ 120 Mo) ne passait que par un relais coûteux en bande passante.
- **Bannières générées automatiquement pour les réseaux** : refusées, Viktor les fait avec ChatGPT.
- **Lecteur musique via convertisseur YouTube** : refusé (droits) ; la radio utilise d'autres sources.
