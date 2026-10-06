# 09 · Feuille de route

État au **6 octobre 2026**. Règle de priorité du club : **rien ne passe avant le recrutement** (le manque de bénévoles et de joueurs est le vrai frein). À mettre à jour quand un chantier avance.

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
- Bilan mensuel du staff (le 1er du mois dans #🔒・staff, `/bilan periode:`).
- Page de confidentialité complétée (comptes de jeu, Oni Sync, inhouses, sondage, avis, page Staff, modération, sauvegardes) et purges alignées sur ses promesses.
- Refactorisation sans changement de résultat (bot et site, dont les actions d'Inside rangées par domaine), tests de non-régression, vérification des types (`npm run check`, qui a trouvé deux actions cassées), base de démonstration, cette documentation.

## À vérifier dès que possible

- **Oni Sync en vrai** : la v1 réécrivait la config du jeu avec un BOM, ce qui laissait l'API Stats coupée (corrigé en v2). Les noms des champs envoyés par le jeu restent à vérifier sur une partie réelle ; l'état d'Oni Sync (lancé, connecté au jeu) s'affiche dans le tracker. Les 3 premiers envois sont gardés bruts (`stats_cache`, clé `rl-sync-raw`) : les relire et ajuster le décodage dans `src/server/equipe/rl-sync.ts` si un chiffre manque.
- **Groupes d'inhouse et détection des parties osu!** : à tester sur un vrai inhouse (partie nommée « Oni inhouse #N »).

## Décisions en attente (Viktor)

Aucune pour l'instant (les dernières sont dans [07 · Décisions](07-decisions.md)).


## Prochains chantiers possibles

| Chantier | Où | Note |
|---|---|---|
| Docs à trois niveaux : roster, jeu (responsable de jeu), club (fiches de poste, règlement) | Inside | P2 de `ANALYSE-CLUB.md` |
| Espace jeu pour le responsable de jeu (rosters, candidatures, essais, tournois, talents des inhouses) | Inside | P2 |
| Espace Communauté (arrivées, événements, modération) pour l'accueil, l'organisateur, les modérateurs | Inside | P2, remplacerait la vue d'ensemble du modérateur |
| Objectifs individuels privés (le joueur et son encadrement) | Inside | P2 |
| Mon espace ouvert aux membres sans roster (inhouses, osu!, candidature) | Inside | révision proposée par l'analyse, à valider |
| Parrain pour chaque nouveau joueur de roster | Bot + Inside | quand un roster aura 3 joueurs ou plus |
| Avis publiés « Vous avez demandé, on a fait » | Site | au premier avis traité |
| Objectif d'activité suivi dans les indicateurs | Inside > Contenu | quand le chiffre est fixé |
| Collection de boosters liée au compte Discord | Site + base | |
| Histoire de 4C Korp dans la frise du club | Site | récit à fournir |
| Nouveaux visuels du vestiaire, dans le style final | Site | visuels à générer |
| Panneaux Twitch dans la DA | Réseaux | |
| Kit presse (présentation, chiffres réels, logos, contacts) | Kit de marque | |
| Pistes de DA « négatif » (diagonale, couleurs inversées) et « bande dessinée » | Visuels | idées gardées |
| Guide osu! de Yasunaii dans l'outil osu! | Inside | avec son accord |

## Dette technique connue

- Les noms de rôles, les postes de candidature et les couleurs des jeux sont écrits à la fois dans le site (`access.ts`, `postuler.ts`, `Qg.astro`) et dans le bot (`config.ts`, `util.ts`, `recrutement.ts`, `cards.ts`). Deux dépôts séparés, donc pas de code partagé : **si tu changes l'un, change l'autre**, puis `npm run coherence` (dans le site, avec le bot cloné à côté) vérifie que les deux listes concordent.
- La table `availability` (ancien format des disponibilités) n'est plus utilisée ; gardée tant que l'historique peut servir.
