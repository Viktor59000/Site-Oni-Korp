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
- **Docs à trois niveaux, objectifs individuels privés, Espace jeu, Espace Communauté** (7 oct. 2026), d'après `notes/strategie/ANALYSE-CLUB.md` (section 5). Le modérateur garde l'accès à la Vue d'ensemble (décision du 6 oct.) et gagne l'espace Communauté.
- **Accord d'image explicite** (7 oct. 2026) : sans accord coché dans Mon espace, pas de visuel ni de clip centré sur la personne. **Rappel des jeux** : un seul message privé 24 h après l'arrivée, jamais deux (pas de spam).
- **Répartition du travail** (7 oct. 2026) : Viktor poste sur les réseaux et fait les visuels demandés ; le reste (Discord via les scripts et le bot, site, Inside, textes, organisation) est géré par Claude. Ce qu'il faut poster est préparé dans `reseaux/A-POSTER.md`, les visuels demandés dans `notes/visuels/A-GENERER.md`.
- **Pas de déclaration d'association pour l'instant** (7 oct. 2026) : le club ne cherche pas de profit, Viktor n'en voit pas l'intérêt aujourd'hui. À reconsidérer seulement si un besoin apparaît (subvention, compte bancaire, sponsor qui l'exige, ligue réservée aux associations comme la Springs League).
- **Les administrateurs Discord restent tels quels** : ce sont des personnes de confiance totale pour Viktor. Le script `discord/admins.mjs` reste disponible si un jour il faut réduire.
- **Tableau blanc inspiré de tactical-board.com** (l'outil d'un ami de Viktor, reprise autorisée) : animation entre étapes, export vidéo, pointillés. Éléments propres à chaque jeu (« chacun son écosystème »).
- **Stockage Vercel** (7 oct.) : plan gratuit plein (10 Go). Archives de decals servies par jsDelivr depuis le dépôt, plus de déploiement pour les branches de travail ; ménage des anciens déploiements avec `scripts/vercel-menage.mjs` (jeton de Viktor).
- **Rubrique « Préparer »** (ex-« Outils ») : tableau blanc, outil du jeu et Docs du roster côte à côte.
- **Terrain Rocket League réaliste** sur le tableau blanc : vraie forme, buts, 34 boosts aux positions du jeu, coups d'envoi (`scripts/terrain-rl.mjs`).
- **Oni Sync dans la zone de notification** (7 oct. 2026), sans fenêtre ; notifications Windows seulement quand il faut agir (jamais à chaque partie). **Pas de mod type BakkesMod qui contourne l'anti-triche** (Easy Anti-Cheat) : risque de bannissement des comptes et contraire aux conditions d'Epic et Psyonix.
- **Oni Sync v5 : pas de mise à jour automatique** (7 oct. 2026). Un script PowerShell qui se télécharge et se relance seul est classé « Trojan PShellDlr » par Windows Defender (vérifié ce jour-là). Oni Sync signale seulement une nouvelle version (une notification), le joueur retélécharge. La v5 revérifie aussi la config du jeu toutes les 30 s : une mise à jour de Rocket League remet `PacketSendRate=0` et coupait le suivi.

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

## Quand il manque quelque chose : outil ou personne ?

Repris de `notes/archives/strategie/SWOT-ROLES.md` § 8 (6 octobre 2026). Le code cite cette grille (escalade, alertes de la vue d'ensemble, accueil).

**La règle à notre échelle** (une centaine de membres, peu de bénévoles) :
- **l'outil détecte, rappelle et fait remonter** ;
- **une personne décide, parle aux gens et tranche.**

Un bot ne règle pas un conflit et ne remplace pas un joueur. En revanche, il peut faire en sorte que personne ne découvre le problème trop tard.

Chaque situation a **un responsable désigné et un suppléant**. Si le responsable ne réagit pas, ça remonte au niveau au-dessus : capitaine → responsable du jeu → direction (Viktor, Yuzu).

| Situation | Ce que l'outil fait (site, bot, Discord) | Qui s'en occupe | Suppléant |
|---|---|---|---|
| Un joueur manque pour un match | ✅ Dispos, présences, statut remplaçant, compo, rappel 30 min avant | Capitaine (trouve le remplaçant) | Responsable du jeu |
| Pas de remplaçant du tout | ✅ Statut remplaçant visible dans Joueurs ; 🛠 alerte « roster sans remplaçant » dans la vue d'ensemble | Responsable du jeu (recrute) | Direction |
| Candidature sans réponse | ✅ Alerte #staff, rappel à 48 h, vue d'ensemble filtrée par jeu | Responsable du jeu | Accueil, puis direction |
| Nouveau membre perdu sur le serveur | ✅ Carte de bienvenue, parcours d'arrivée, relances à 3 et 7 jours | Accueil | Modérateur |
| Match public sans casteur | ✅ Appel aux casteurs, alerte dans la vue | Casteurs | Direction (décide de jouer sans cast) |
| Visuel ou post pas prêt | ✅ Tâches en retard en rouge dans Contenu ; 🛠 rappel du bot la veille de l'échéance | Community manager / graphiste | Direction |
| Rien à publier cette semaine | ✅ Calendrier éditorial vide visible, skills Instagram et TikTok | Community manager | Direction |
| Inscription à un tournoi qui ferme | ✅ Rappels J-2 et J-1 ; 🛠 suivi des tournois (chantier 5) | Manager / responsable du jeu | Direction |
| Fin d'une période d'essai | ✅ Alerte 3 jours avant, puis alerte « retour à écrire » | Capitaine + coach | Responsable du jeu |
| Joueur qui décroche (absences répétées) | ✅ Taux de présence ; 🛠 alerte « présence < 50 % sur 30 jours » | Capitaine (en parle d'abord) | Coach, puis responsable du jeu |
| Désaccord sur la compo ou le temps de jeu | ✅ Stats, notes de match, objectifs pour objectiver ; 🛠 règle écrite épinglée dans Docs | Coach (ou capitaine sans coach) | Responsable du jeu |
| Conflit entre joueurs, tension en vocal | ✅ Ticket privé « problème avec un membre » | Capitaine (désamorce), puis coach | Direction (médiation) |
| Comportement toxique, règle enfreinte | ✅ Modération automatique par paliers, journal | Modérateur | Direction |
| Sanction grave (exclusion, bannissement) | ❌ Jamais automatique | Direction : deux personnes, avec possibilité de recours | — |
| Plainte contre un membre du staff | ✅ Ticket privé | Direction (Viktor, Yuzu), sans la personne visée | — |
| Bénévole débordé ou qui disparaît | ✅ Tâches non prises ou en retard visibles ; 🛠 alerte « personne n'a pris ces tâches » | Direction (redistribue, en parle) | — |
| Bot en panne, clé Riot expirée | ✅ Santé du bot, alertes, contrôles quotidiens | Binôme technique | Direction |
| Raid ou spam | ✅ Anti-raid, AutoMod | Automatique, puis modérateur | Direction |
| Partenaire sans nouvelles | 🛠 Indicateurs et bilan de saison (chantier 6) | Responsable marketing | Direction |

✅ = existe déjà · 🛠 = à construire · ❌ = ne doit pas être automatisé

**Le noyau humain minimum** pour que tout ce tableau tienne (6 à 8 personnes, certaines peuvent cumuler) :
- 1 responsable par jeu actif (RL, LoL, Valorant) ;
- 1 capitaine par roster ;
- 1 community manager ;
- 1 modérateur actif ;
- 1 personne à l'accueil (peut être le modérateur) ;
- un binôme technique ;
- la direction (Viktor, Yuzu).

**Ce que ça ajoute aux chantiers** (petits, à faire au fil de l'eau) :
- **Escalade automatique** : une alerte qui n'est pas traitée remonte au niveau suivant (capitaine, puis responsable du jeu, puis direction) après un délai.
- **Rappel du bot pour les tâches de contenu** : la veille de l'échéance, puis le jour même si elle est en retard.
- **Nouvelles alertes dans la vue d'ensemble** : roster sans remplaçant, présence faible, tâches de contenu que personne n'a prises.
- **Procédure de médiation et de sanction écrite**, épinglée dans Docs et dans le règlement.
