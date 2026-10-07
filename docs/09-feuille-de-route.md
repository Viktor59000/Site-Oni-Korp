# 09 · Feuille de route

État au **7 octobre 2026** (soir). Règle de priorité du club : **rien ne passe avant le recrutement** (le manque de bénévoles et de joueurs est le vrai frein). À mettre à jour quand un chantier avance.

## Fait récemment

- Rôles par fonction et accès Inside adaptés (capitaine, analyste, responsable de jeu, pôle contenu).
- Statuts titulaire / remplaçant / essai, brief automatique des matchs, espace Contenu, suivi des tournois, indicateurs de communication, page Staff, sondage des membres, escalade.
- Inhouses : groupes « Jouer ensemble », places au classement sur les cartes, salles osu! lues automatiquement.
- Tracker Rocket League + Oni Sync.
- Page de présentation d'Inside pour les non-membres.
- Audit de performance (6 oct.) : pages publiques 97 à 100 en performance et 100 en accessibilité, bonnes pratiques et référencement. Inside ensuite optimisé (branche `inside-rendu-v2`, ancien design gardé sous l'étiquette `inside-design-v1`) : 100 en accessibilité et bonnes pratiques sur toutes les pages, 96 à 100 en performance (tableau blanc 90 → 96-99, Lineups Valorant 94 → 100, drafter LoL 94 → 97-99). Détail des règles dans [06 · Design et ton](06-design-et-ton.md).
- Pas de tableau blanc pour osu! ; glisser-déposer des éléments au doigt sur le tableau blanc (appui long).
- Inside v3 (7 oct.) : Mon espace, un roster à la fois, rubrique Préparer avec les Docs, tableaux avec aperçus et modèles, terrain RL réaliste, zoom des captures de lineups, Oni Sync v2 (icône près de l'horloge, correction de la config du jeu).
- Analyse du club (PESTEL, SWOT, 20 profils, architecture d'Inside, plan d'action) : `notes/strategie/ANALYSE-CLUB.md`.
- Plan d'action de l'analyse, partie code (7 oct.) : docs à trois niveaux, objectifs privés, Espace jeu, Espace Communauté, bloc « À gérer » et relance groupée, plan de séance, fiche de cast, accord d'image, rappel des jeux.
- Outils par jeu (7 oct.) : packs RL, pools LoL, compos Valorant, mappool osu!, carnet perso, brouillons de tableau, Mes contributions ; tableau blanc animé avec export vidéo ; soirée inhouse en événement Discord, rôle « MVP du jeudi » remis par le bot (2.49.0) ; replays RL via Oni Sync v6 et ballchasing (analyse des replays dans le Tracker) ; tops plays osu! annoncés, chronologie LoL (CS à 10, or à 15), KAST Valorant (2.51.0) ; Oni Sync v4 sans aucune fenêtre, puis v5 (réactive l’API Stats après une mise à jour du jeu).
- Bilan mensuel du staff (le 1er du mois dans #🔒・staff, `/bilan periode:`).
- Page de confidentialité complétée (comptes de jeu, Oni Sync, inhouses, sondage, avis, page Staff, modération, sauvegardes) et purges alignées sur ses promesses.
- Refactorisation sans changement de résultat (bot et site, dont les actions d'Inside rangées par domaine), tests de non-régression, vérification des types (`npm run check`, qui a trouvé deux actions cassées), base de démonstration, cette documentation.
- Trackers RL, LoL et Valorant avec « Ce qui ressort » et objectifs mesurés automatiquement (7 oct.) ; Tracker osu! retiré le jour même (doublon d'osu!track). Oni Sync v6 (replays et ballchasing), récap du lundi par roster, programme du jour dans le Planning, écoute des scrims (`/ecoute`, Parakeet), annuaire des scrims dans le Scouting, messages programmés du bot, fiche « Quand un service tombe » (10). Factorisation des Trackers (rendu identique vérifié).

## À vérifier dès que possible

- **Écoute des scrims** : premier essai en vrai vocal (`/ecoute demarrer`, puis le rapport dans Docs). Testée hors Discord seulement.
- **Groupes d'inhouse et détection des parties osu!** : à tester sur un vrai inhouse (partie nommée « Oni inhouse #N »).
- Oni Sync : vérifié en vrai le 7 octobre (v5, partie reçue) ; les replays (v6) restent à voir sur une partie classée sauvegardée.

## Décisions en attente (Viktor)

Aucune pour l'instant (les dernières sont dans [07 · Décisions](07-decisions.md)).


## Prochains chantiers possibles

| Chantier | Où | Note |
|---|---|---|
| Parrain pour chaque nouveau joueur de roster | Bot + Inside | quand un roster aura 3 joueurs ou plus |
| Avis publiés « Vous avez demandé, on a fait » | Site | au premier avis traité |
| Objectif d'activité suivi dans les indicateurs | Inside > Contenu | quand le chiffre est fixé |
| Collection de boosters liée au compte Discord | Site + base | |
| Histoire de 4C Korp dans la frise du club | Site | récit à fournir |
| Nouveaux visuels du vestiaire, dans le style final | Site | visuels à générer |
| Panneaux Twitch dans la DA | Réseaux | |
| Kit presse (présentation, chiffres réels, logos, contacts) | Kit de marque | à J+60 ; chiffres : `discord/bilan-partenaires.mjs` |
| Rôle « Ancien » pour les anciens joueurs | Discord, bot | P3 du plan d'action |
| Pistes de DA « négatif » (diagonale, couleurs inversées) et « bande dessinée » | Visuels | idées gardées |
| Guide osu! de Yasunaii dans l'outil osu! | Inside | avec son accord |

## Restes de l'audit de lancement (6 oct.)

Repris de `notes/archives/audits/AUDIT-LANCEMENT.md` :
- À faire par Viktor : remplir la règle AutoMod « pseudos » (vide), fermer les anciens Google Forms, renommer l'application « ASYLUM-BOT » dans le Discord Developer Portal.
- `discord/lancement.mjs --apply` : rien n'indique qu'il ait été lancé ; vérifier avant de le relancer.
- Améliorations : style des catégories Discord, le Discord du club dans les données structurées du site, code mort de l'album, image `match-cup`, images en AVIF.

## Dette technique connue

- Les noms de rôles, les postes de candidature et les couleurs des jeux sont écrits à la fois dans le site (`access.ts`, `postuler.ts`, `Qg.astro`) et dans le bot (`config.ts`, `util.ts`, `recrutement.ts`, `cards.ts`). Deux dépôts séparés, donc pas de code partagé : **si tu changes l'un, change l'autre**, puis `npm run coherence` (dans le site, avec le bot cloné à côté) vérifie que les deux listes concordent.
- La table `availability` (ancien format des disponibilités) n'est plus utilisée ; gardée tant que l'historique peut servir.
