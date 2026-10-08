# 06 · Design et ton

Deux univers visuels, volontairement différents, et une seule voix.

## La marque

- **Nom** : Oni Korp (ancien nom : 4C Korp, ne plus l'utiliser sauf pour raconter l'histoire). Devise : *Oni's never on knees* (« Jamais à genoux »).
- **Logo** : le blason ONI d'origine, redessiné en 2026 (pas un nouveau logo). Kit et règles d'usage sur la page publique `/marque/` (fichiers dans `public/marque/`).
- **Signature** : le kanji 鬼 (oni), en néon ou au pinceau. Pas de masque de démon comme logo (c'était l'identité d'avant).
- **Couleur de marque** : vermillon `#E5251F` (`--lacquer`), avec l'encre `#0A0A0A` et le papier washi `#F3F1EC`.
- **Couleur de chaque jeu** (une couleur = un sens, partout) :

| Jeu | Couleur | Sigle |
|---|---|---|
| Rocket League | `#2F6BFF` (cartes du bot : `#1450D6`) | RL |
| League of Legends | `#0F8A9B` | LoL |
| Valorant | `#FF4655` | VAL |
| osu! | `#FF66AA` (exception : les vignettes osu! de l'album sont en vert `#2FA877`) | osu! |

## La vitrine publique (site)

Fichiers : `src/styles/base.css` (jetons), `global.css` (composants), polices Dela Gothic One (titres) et Zen Kaku Gothic New (texte).

- Esprit **affiche sérigraphiée** : papier washi, encre noire, vermillon, trame de points, éclats, coupes en biais. Hero, en-têtes et pied de page restent sombres ; thème clair et sombre au choix (bouton dans la navigation).
- **Album de vignettes** façon Panini (page Légendes, boosters) : illustrations « style 1 » (inspiration Persona 5, chaque personne porte un masque oni personnel qui cache le visage), règle des 4 encres (papier crème, noir, couleur du pôle, rouge). Pas de mélange de styles.
- Objectif de performance tenu : 100/100 Lighthouse sur les pages publiques. Images en WebP/AVIF avec tailles réduites (`scripts/cartes.mjs`, `scripts/variantes.mjs`), une image d'aperçu par page (`scripts/og.mjs`).

## Inside (l'outil)

Fichier : `src/styles/qg.css` (classe `qg` sur le `body`), polices IBM Plex Sans, Sans Condensed (titres) et Mono (étiquettes). Inspiré du kit **Agrume Design** de Yuzu : encre et papier, **filets plutôt que cartes**, rayon 0, pas d'ombre (sauf panneaux flottants), étiquettes en mono capitales, grain papier, une couleur = un sens.

- **Performance (objectif 100/100, tenu : toutes les pages d'Inside à 100 en performance, accessibilité et bonnes pratiques au 7 oct., osu! à 99)**. Règles qui l'ont permis, à garder :
  - Inside ne charge que ses polices Plex (pas celles de la vitrine) ; les deux principales sont préchargées dans `Head.astro`.
  - Couleurs de texte via les jetons (`--ok`, `--warn`, `--danger`, `--qg-accent-text`) : les verts et rouges « à la main » ratent le contraste.
  - Beaucoup d'icônes de champions = **planches d'icônes Data Dragon** (`img/sprite/championN.png`, 6 fichiers pour 170 champions) au lieu d'une image chacune (drafter, palette du tableau blanc).
  - Longues listes : `content-visibility: auto` sur les éléments (grille du drafter) et `contain: strict` sur un conteneur à hauteur fixe.
  - Pas d'animation en boucle qui repeint (couleur, bordure) : seulement `opacity` ou `transform`, et un nombre de répétitions limité.
  - Image principale connue dès le HTML : la carte Valorant est lue côté serveur (`valo-api.ts`, gardée 6 h) pour la page Lineups et le tableau blanc.
  - Mesure : `METHOD=devtools DEMO=1 node scripts/lighthouse-equipe.mjs "/equipe/…"` (Git Bash : préfixer `MSYS_NO_PATHCONV=1`). La simulation par défaut de Lighthouse donne 99 au lieu de 100 sur les pages simples à cause d'un artefact de capture en local. Le script lance un Chrome neuf par page et pose la session dans le stockage du navigateur (sinon le cookie « dernier roster » masquait la session et faussait les mesures). Captures de la page de présentation : `node scripts/captures-inside.mjs` (avec `npm run dev:demo`).
  - Le design d'avant ce chantier est gardé sous l'étiquette git `inside-design-v1`.
- Jetons : `--qg-paper` (fond), `--qg-raised` (panneau), `--qg-ink` (texte, filets majeurs), `--qg-muted`, `--qg-rule` / `--qg-rule-strong` (filets), `--qg-accent` (vermillon : action), `--qg-focus` (bleu, focus clavier), `--ok`, `--warn`, `--danger`. Clair et sombre.
- **Pas d'illustration dans Inside**, ni générée, ni décorative. L'identité d'un jeu = un filet de sa couleur + son sigle en mono.
- Sobre et dense : c'est un outil de travail. Les noms restent simples (« Tableau blanc », pas « Salle de guerre »).
- Tout doit marcher **sur téléphone** sans glisser sur les côtés, et au clavier (focus visible, `aria-*`).

La vitrine et Inside ne partagent pas leurs composants visuels : un bouton de la vitrine (vermillon en biais, Dela Gothic) n'a pas la même forme qu'un bouton d'Inside (filet, Plex). Exemple : `components/Avis.astro` a deux variantes, `site` et `inside`.

## Mouvement (vitrine et Inside)
Règles tirées de l'audit « apple-design » du 8 octobre (`notes/rapports/AUDIT-APPLE-DESIGN.md`) :
- **Réponse à l'appui, pas au relâcher** : tout bouton s'enfonce légèrement (`scale: .97`) dès qu'on appuie (`base.css`). Le survol n'existe pas au doigt, il ne doit jamais être le seul retour.
- **Même chemin à l'aller et au retour** : ce qui entre par la droite repart par la droite (tiroirs d'Inside), le menu mobile se replie dans la barre, une carte de l'album y retourne.
- **Rien ne bloque la main** : une animation en cours peut être rattrapée ou remplacée (carte qu'on fait tourner, appuis rapides sur « suivante »).
- **Élan mesuré dans le temps** : la vitesse au lâcher vient des 80 dernières ms, et le freinage dépend du temps écoulé, pas du nombre d'images (même rendu en 60 et 120 Hz).
- **Jetons** : `--ease`, `--t-fast` (150 ms), `--t-move` (320 ms) dans `base.css`, à réutiliser pour toute nouvelle animation.
- **Préférences du système** : `prefers-reduced-motion` (fondus courts ou rien) et `prefers-reduced-transparency` (barre et voile sans flou).

## Cartes image du bot

Même famille que la vitrine (washi, encre, vermillon, couleur du pôle, Dela Gothic One + Zen Kaku). Retours qui ont fixé les règles actuelles : pas de kanji ni de trame de points sur les cartes d'inhouse, pas de pastilles arrondies pour les chiffres, photo de profil en grand, un seul bord en biais net entre bandeau et illustration.

## Règle des visuels

**À part le logo, un même visuel ne sert jamais dans deux situations** (site, Discord, réseaux, cartes du bot, affiches…). Une nouvelle situation demande un visuel dédié, généré au moment voulu (Viktor les fait avec ChatGPT). On note le besoin plutôt que de recycler une image existante.

## Le ton (textes publics, messages du bot, interface)

Résumé de la charte éditoriale du club :

- **Tutoiement** avec les joueurs et la communauté ; vouvoiement avec les partenaires et organisateurs au premier contact.
- **Phrases courtes, des faits** : le jeu, le niveau, le jour, le format, le lien. Un vrai chiffre vaut mieux qu'un adjectif. Jamais de chiffre inventé.
- **L'essentiel d'abord** (pyramide inversée), une idée par message, un seul appel à l'action.
- **0 à 2 emojis**, seulement s'ils servent (👉 lien, 🔴 direct, 🏆). Jamais en décoration, jamais un par ligne.
- **Bannis** : « Rejoignez l'aventure », « N'hésitez pas », les trois adjectifs à la suite, les points d'exclamation partout, les tics d'écriture d'IA.
- **Typographie française** : ’ « » et espaces insécables avant ; : ! ?
- Côté interface : des verbes clairs (« Planifier », « Relier mes comptes »), des états honnêtes (« Aucune partie pour l'instant. Lance Oni Sync et joue : … ») qui disent quoi faire ensuite.
