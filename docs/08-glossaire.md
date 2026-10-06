# 08 · Glossaire

| Mot | Sens dans le projet |
|---|---|
| **Inside** | L'espace équipe du site (`/equipe/`), réservé aux rosters, à l'encadrement et au pôle contenu. Ancien nom : QG. |
| **Vitrine** | Les pages publiques du site. |
| **Roster** | Une équipe du club sur un jeu (ex. « Academy », LoL). Un rôle Discord + un espace de salons, créés par `/roster creer`. Repéré dans les adresses par son *slug* (`?r=academy`). |
| **Encadrement / staff** | Admin, Fondateur, Manager, Coach, Modérateur : voient et gèrent tout. |
| **Responsable de jeu** | Gère tous les rosters d'un jeu (rôle « Responsable League of Legends »…). |
| **Capitaine** | Joueur qui gère son propre roster. |
| **Analyste** | Suit un roster sans compter comme joueur. |
| **Pôle contenu** | Casteurs, graphistes, monteurs, community managers, créateurs, marketing. |
| **Titulaire / remplaçant / essai** | Statut d'un joueur dans un roster (Inside > Joueurs). Un essai a une date de fin et un retour écrit. |
| **Séance** | Un entraînement planifié (`/entrainement`), avec réponses Présent / Peut-être / Absent. |
| **Scrim** | Match d'entraînement contre une autre équipe : interne, jamais dans l'agenda public. |
| **Inhouse** | Partie entre membres du club, équilibrée par Elo, avec classement par mode et par saison. |
| **Elo** | Score de niveau des inhouses (départ 1000 ; K = 40 les 10 premières parties, puis 32). |
| **Groupe « Jouer ensemble »** | Joueurs (ou roster entier) qui rejoignent les files d'inhouse ensemble et finissent dans la même équipe. |
| **Miroir** | Copie des membres et rôles Discord dans la base, faite par le bot, qui permet au site de savoir qui est qui. |
| **Coulisses** | Second serveur Discord, terrain d'essai d'Oni Bot : état, erreurs, sauvegardes, vitrine des cartes. |
| **Vitrine (des cartes)** | Salon des coulisses où le bot redessine toutes ses cartes image à chaque version. |
| **Labo** | Module du bot qui gère les coulisses. |
| **Carte** | Image générée par le bot (fin d'inhouse, `/stats`, affiche de tournoi, bienvenue, niveau). |
| **Vignette** | Illustration d'un joueur ou d'un moment dans l'album du site (page Légendes, boosters). |
| **Booster** | Paquet de vignettes à ouvrir sur le site (un par jour). |
| **Oni Sync** | Petit programme Windows qui envoie les parties Rocket League d'un joueur au tracker d'Inside. |
| **API Stats (RL)** | Flux de données que Rocket League publie lui-même sur le PC du joueur (port 49123), activé par `PacketSendRate` dans `DefaultStatsAPI.ini`. |
| **Drafter** | Outil de préparation des drafts LoL (ordre de tournoi, fearless, analyse). |
| **Fearless** | Format LoL où un champion joué ne peut plus être repris dans la série. |
| **Lineup (Valorant)** | Position et visée pour lancer une utilitaire au bon endroit. Pour les cartes d'inhouse, « lineup » désigne aussi la carte 5v5 en colonnes. |
| **Débrief** | Analyse automatique d'un match LoL par le bot (notes, repères), lue dans Inside > Notes. |
| **Escalade** | Le bot fait remonter ce qui traîne (candidature sans réponse, tâche orpheline) vers la bonne personne. |
| **Brief de match** | Tâches de contenu créées automatiquement autour d'un match (visuel d'annonce, résultat, clip…). |
| **Charte éditoriale** | Les règles d'écriture du club (voir [06 · Design et ton](06-design-et-ton.md)). |
| **Agrume Design** | Kit de design de Yuzu, base du style d'Inside. |
| **Echo-Host** | Hébergeur du bot (panneau Pterodactyl). |
| **Turso** | Hébergeur de la base (libSQL, compatible SQLite). |
| **Non-régression** | Vérification qu'un changement de code ne modifie pas le résultat (`npm test`, des deux côtés). |
