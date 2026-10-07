# Documentation d'Oni Korp

Tout ce qu'il faut pour reprendre le projet sans avoir suivi son histoire : comment il est construit, pourquoi il est construit comme ça, comment travailler dessus sans rien casser, et où il va.

Écrite pour une personne qui arrive (Yuzu en premier), tenue à jour à chaque changement important. Si quelque chose ici ne correspond plus au code, c'est la doc qu'il faut corriger.

## Par où commencer

| Tu veux… | Lis |
|---|---|
| Comprendre le projet en 10 minutes | [01 · Vue d'ensemble](01-vue-ensemble.md) |
| Installer, lancer, tester, mettre en ligne | [02 · Travailler sur le projet](02-travailler.md) |
| Comprendre Inside (l'espace équipe) | [03 · Inside](03-inside.md) |
| Comprendre Oni Bot | [04 · Oni Bot](04-oni-bot.md) |
| Savoir où sont les données | [05 · Données](05-donnees.md) |
| Respecter la DA et le ton du club | [06 · Design et ton](06-design-et-ton.md) |
| Savoir pourquoi les choses sont ainsi | [07 · Décisions](07-decisions.md) |
| Un mot que tu ne connais pas | [08 · Glossaire](08-glossaire.md) |
| Ce qui reste à faire | [09 · Feuille de route](09-feuille-de-route.md) |
| Quand un service tombe | [10 · Secours](10-secours.md) |

## Les trois règles qui évitent 90 % des problèmes

1. **Avant de pousser le site : `VERCEL=1 npm run build`.** Sans `VERCEL=1`, les pages serveur (Inside, API) ne sont pas compilées et une erreur passe inaperçue jusqu'au déploiement raté.
2. **Avant de pousser le bot : `npm test`.** Il compile et vérifie que les cartes image et l'équilibrage des équipes n'ont pas bougé.
3. **Le site et le bot partagent la même base.** Un changement de table dans l'un se voit dans l'autre : regarde [05 · Données](05-donnees.md) avant de toucher une table.

## Les dépôts

| Dépôt | Contenu | Visibilité |
|---|---|---|
| [onikorp/Site-Oni-Korp](https://github.com/onikorp/Site-Oni-Korp) | Site public, Inside, API, **cette documentation** | Public (obligatoire pour l'hébergement gratuit Vercel) |
| onikorp/oni-bot | Oni Bot (Discord) | Privé |

Les scripts qui modifient le serveur Discord (`discord/*.mjs`) et les documents de stratégie (SWOT, plan, charte éditoriale) vivent dans le dossier de travail de Viktor, hors dépôt. Ce qui compte dans ces documents est résumé ici, surtout dans [07 · Décisions](07-decisions.md) et [06 · Design et ton](06-design-et-ton.md).

> Ce dépôt est public : aucune clé, aucun jeton, aucun identifiant de connexion n'y entre jamais, ni dans le code, ni dans cette doc.
