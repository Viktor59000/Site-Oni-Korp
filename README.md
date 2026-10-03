# Oni Korp — site v2

Site vitrine du club esport Oni Korp. Statique, construit avec [Astro](https://astro.build).

## Lancer en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/ à déployer
```

## Modifier le contenu (sans toucher au code)

| Fichier | Contenu |
|---|---|
| `src/data/rosters.json` | Jeux, rosters, joueurs, staff. Un roster sans joueurs affiche « Line-up à annoncer », un poste staff sans nom affiche « Poste ouvert ». |
| `src/data/matches.json` | Showmatchs et tournois de la section « Sur le terrain ». |
| `src/data/site.json` | Lien Discord, formulaires de recrutement, réseaux sociaux. |

## Structure

- `src/pages/` : accueil, club, effectif, recrutement, vestiaire, mentions légales, 404
- `src/styles/global.css` : tout le design (couleurs et typo en variables en haut du fichier)
- `public/img/` : visuels optimisés en WebP
- `public/downloads/` : packs de decals Rocket League Oni Korp × Carl

## Identité

- Rouge laque `#c22e28` (bas du dégradé du logo), noir pur, os `#edebe7`
- Titres : Dela Gothic One, texte : Zen Kaku Gothic New (Google Fonts)
- Kanji en filigrane : 鬼 (oni) sur l'accueil, un kanji par page

## Mise en ligne (GitHub Pages)

Le site est publié sur https://viktor59000.github.io/Site-Oni-Korp/

```bash
npm run deploy
```

Cette commande construit le site pour le sous-dossier `/Site-Oni-Korp/` et pousse le résultat
sur la branche `gh-pages`. Le code source vit sur la branche `v2`.

Pour passer sur un vrai nom de domaine plus tard : modifier `SITE_URL` et retirer `BASE_PATH`
dans `scripts/deploy.sh`, puis configurer le domaine dans Settings → Pages.
