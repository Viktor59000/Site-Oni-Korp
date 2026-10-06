# 09 · Feuille de route

État au **6 octobre 2026**. Règle de priorité du club : **rien ne passe avant le recrutement** (le manque de bénévoles et de joueurs est le vrai frein). À mettre à jour quand un chantier avance.

## Fait récemment

- Rôles par fonction et accès Inside adaptés (capitaine, analyste, responsable de jeu, pôle contenu).
- Statuts titulaire / remplaçant / essai, brief automatique des matchs, espace Contenu, suivi des tournois, indicateurs de communication, page Staff, sondage des membres, escalade.
- Inhouses : groupes « Jouer ensemble », places au classement sur les cartes, salles osu! lues automatiquement.
- Tracker Rocket League + Oni Sync.
- Page de présentation d'Inside pour les non-membres.
- Refactorisation sans changement de résultat (bot et site), tests de non-régression, base de démonstration, cette documentation.

## À vérifier dès que possible

- **Oni Sync en vrai** : les noms des champs envoyés par le jeu n'ont pas pu être vérifiés sans partie réelle. Les 3 premiers envois sont gardés bruts (`stats_cache`, clé `rl-sync-raw`) : les relire et ajuster le décodage dans `src/server/equipe/rl-sync.ts` si un chiffre manque.
- **Groupes d'inhouse et détection des parties osu!** : à tester sur un vrai inhouse (partie nommée « Oni inhouse #N »).

## Décisions en attente (Viktor)

1. Accès du rôle Modérateur dans Inside.
2. Le retour écrit de fin d'essai est-il visible par la recrue ?
3. Soirée inhouse fixe : jour et heure (le bot l'annoncera).
4. Page « Données personnelles » (RGPD), avec nettoyage automatique des vieilles candidatures et réponses au sondage.

## Prochains chantiers possibles

| Chantier | Où | Note |
|---|---|---|
| Parrain pour chaque nouveau joueur de roster | Bot + Inside | quand un roster aura 3 joueurs ou plus |
| Bilan mensuel automatique pour la direction | Bot | message privé le 1er du mois |
| Avis publiés « Vous avez demandé, on a fait » | Site | au premier avis traité |
| Objectif d'activité suivi dans les indicateurs | Inside > Contenu | quand le chiffre est fixé |
| Collection de boosters liée au compte Discord | Site + base | |
| Histoire de 4C Korp dans la frise du club | Site | récit à fournir |
| Nouveaux visuels du vestiaire, dans le style final | Site | visuels à générer |
| Panneaux Twitch dans la DA | Réseaux | |
| Kit presse (présentation, chiffres réels, logos, contacts) | Kit de marque | |
| Audit de performance complet (public + Inside) | Site | après les retouches de design |
| Pistes de DA « négatif » (diagonale, couleurs inversées) et « bande dessinée » | Visuels | idées gardées |
| Guide osu! de Yasunaii dans l'outil osu! | Inside | avec son accord |

## Dette technique connue

- `src/server/equipe/outils.ts` reste une longue suite d'actions dans une seule fonction : lisible, mais à découper par domaine si elle grossit encore.
- Les noms de rôles, les jeux et leurs couleurs sont écrits à la fois dans le site (`access.ts`, `Qg.astro`) et dans le bot (`config.ts`, `util.ts`). Ce sont deux dépôts séparés : **si tu changes l'un, change l'autre**, en attendant une source commune.
- La table `availability` (ancien format des disponibilités) n'est plus utilisée ; gardée tant que l'historique peut servir.
