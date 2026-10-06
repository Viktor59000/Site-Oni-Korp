# 09 · Feuille de route

État au **6 octobre 2026**. Règle de priorité du club : **rien ne passe avant le recrutement** (le manque de bénévoles et de joueurs est le vrai frein). À mettre à jour quand un chantier avance.

## Fait récemment

- Rôles par fonction et accès Inside adaptés (capitaine, analyste, responsable de jeu, pôle contenu).
- Statuts titulaire / remplaçant / essai, brief automatique des matchs, espace Contenu, suivi des tournois, indicateurs de communication, page Staff, sondage des membres, escalade.
- Inhouses : groupes « Jouer ensemble », places au classement sur les cartes, salles osu! lues automatiquement.
- Tracker Rocket League + Oni Sync.
- Page de présentation d'Inside pour les non-membres.
- Audit de performance (6 oct.) : pages publiques 97 à 100 en performance et 100 en accessibilité, bonnes pratiques et référencement ; Inside 90 à 99. Corrigés : contrastes (Staff, accueil d'Inside), images Twitch réduites (Créateurs), décalages au chargement du drafter LoL. Reste possible : affichage de la carte du tableau blanc et des lineups (3,2 s sur mobile simulé).
- Bilan mensuel du staff (le 1er du mois dans #🔒・staff, `/bilan periode:`).
- Page de confidentialité complétée (comptes de jeu, Oni Sync, inhouses, sondage, avis, page Staff, modération, sauvegardes) et purges alignées sur ses promesses.
- Refactorisation sans changement de résultat (bot et site, dont les actions d'Inside rangées par domaine), tests de non-régression, vérification des types (`npm run check`, qui a trouvé deux actions cassées), base de démonstration, cette documentation.

## À vérifier dès que possible

- **Oni Sync en vrai** : les noms des champs envoyés par le jeu n'ont pas pu être vérifiés sans partie réelle. Les 3 premiers envois sont gardés bruts (`stats_cache`, clé `rl-sync-raw`) : les relire et ajuster le décodage dans `src/server/equipe/rl-sync.ts` si un chiffre manque.
- **Groupes d'inhouse et détection des parties osu!** : à tester sur un vrai inhouse (partie nommée « Oni inhouse #N »).

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
| Kit presse (présentation, chiffres réels, logos, contacts) | Kit de marque | |
| Pistes de DA « négatif » (diagonale, couleurs inversées) et « bande dessinée » | Visuels | idées gardées |
| Guide osu! de Yasunaii dans l'outil osu! | Inside | avec son accord |

## Dette technique connue

- Les noms de rôles, les postes de candidature et les couleurs des jeux sont écrits à la fois dans le site (`access.ts`, `postuler.ts`, `Qg.astro`) et dans le bot (`config.ts`, `util.ts`, `recrutement.ts`, `cards.ts`). Deux dépôts séparés, donc pas de code partagé : **si tu changes l'un, change l'autre**, puis `npm run coherence` (dans le site, avec le bot cloné à côté) vérifie que les deux listes concordent.
- La table `availability` (ancien format des disponibilités) n'est plus utilisée ; gardée tant que l'historique peut servir.
