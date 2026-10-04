# Prompts visuels — DA « album » (octobre 2026)

Deux faces pour une même marque :
- **Sombre = la nuit, le match** : néon, kanji, HUD (déjà en place).
- **Clair = l'album** : papier japonais, encre sumi, tampons rouges, vignettes à collectionner.

## Mode d'emploi

1. **Nouvelle conversation ChatGPT** pour la partie A (style différent du néon). Colle d'abord le bloc « Style album », puis les prompts un par un.
2. Pour les parties B et C (sombres), reprends la conversation du `PROMPTS.md` d'origine (bloc « Style commun » néon) ou recolle-le dans une nouvelle conversation.
3. Quand un prompt dit **fond transparent**, vérifie que le PNG téléchargé n'a pas de damier blanc/gris « dessiné » (si c'est le cas, demande : « same image, real transparent background, PNG »).
4. Range chaque image dans `site/visuels/a-integrer/` avec **le nom de fichier indiqué**, puis dis-moi quand c'est fait.

Règle d'or inchangée : aucun texte ni logo, **sauf le kanji 鬼 du tampon** (prompt A1), que je vérifie avant intégration.

Priorité : ★★★ = ça change vraiment le site · ★★ = bonus visible · ★ = si tu as le temps.

---

## Style album (à coller en premier, partie A)

```
For every image in this conversation, follow this art direction:
- Brand: "Oni Korp", a French esports club. Theme: a Japanese collector's sticker album (like a Panini album) made with traditional materials.
- Materials: off-white washi paper (#F3F1EC) with visible fibers, black sumi ink, red cinnabar seal ink (#E5251F), a touch of gold foil only when asked.
- Look: printed matter, tactile and real, photographed or scanned flat with soft even light. Minimal, lots of empty paper.
- NEVER draw masks, demon faces, creatures, skulls or characters.
- Never include text, letters, numbers, logos or watermarks unless the prompt explicitly asks for one specific character.
Reply "OK" and wait for my prompts.
```

---

## A. Identité « album » (thème clair)

### A1. Tampon hanko 鬼 ★★★
- **Fichier :** `hanko-oni.png` · **Format :** carré (1024 × 1024) · **fond transparent**
- **Utilisation :** sceau rouge posé sur les pages en clair (coin des sections, vignettes « validées », pied de page).

```
A single traditional Japanese hanko seal stamp impression in red cinnabar ink, square seal with a thin square border and slightly rounded corners, containing only the single kanji 鬼 in bold seal-script style, carved look (red background with the character left as negative space). Real stamped texture: uneven ink density, tiny gaps and specks where the paper did not take the ink, slightly imperfect edges. Isolated on a fully transparent background, centered, flat, no shadow, no paper visible.
```

> Si le kanji n'est pas exactement 鬼 (ChatGPT le déforme parfois), demande une variante. Je le vérifie de toute façon avant de l'utiliser.

### A2. Traits d'encre (soulignés de titres) ★★★
- **Fichiers :** `encre-trait-1.png`, `encre-trait-2.png`, `encre-trait-3.png` · **Format :** paysage (1536 × 1024) · **fond transparent**
- **Utilisation :** sous les grands titres en thème clair, à la place du trait fin actuel. Lance le prompt 3 fois.

```
One single horizontal sumi ink brush stroke, black ink, painted in one fast confident motion from left to right with a large calligraphy brush: thick and wet at the start, dry-brush streaks and broken bristle texture toward the end, slight upward lift. Long and thin overall (about 8 times wider than tall). Isolated on a fully transparent background, flat scan, no shadow, no paper.
```

### A3. Éclaboussures d'encre ★★
- **Fichier :** `encre-eclats.png` · **Format :** carré · **fond transparent**
- **Utilisation :** accents discrets dans les coins (vignettes, sections).

```
A set of 6 separate sumi ink splatters and drips in black ink, different sizes, from a single big splash to tiny specks, spread out on a grid with lots of space between them so each can be cut out. Isolated on a fully transparent background, flat scan, no shadow.
```

### A4. Couverture de l'album ★★★
- **Fichier :** `album-couverture.png` · **Format :** paysage (1536 × 1024)
- **Utilisation :** section « Quatre jeux, un seul album » de l'accueil. **Je pose le vrai logo dans l'emplacement vide.**

```
Top-down photograph of a closed hardcover collector's sticker album lying slightly rotated on a sheet of off-white washi paper. The cover is matte black with a deep lacquer-red diagonal band crossing it and a thin gold foil border. In the center of the cover: a large EMPTY square area, plain matte black, intentionally left blank (a logo will be added later). A few loose collectible stickers with red and black artwork lie around the album, one half tucked under it, artwork abstract (brush strokes, no characters, no text). Soft natural daylight from the top left, gentle realistic shadows, lots of empty paper around. No text, no logo.
```

### A5. Pochette de vignettes ★★
- **Fichier :** `pochette.png` · **Format :** portrait (1024 × 1536) · **fond transparent**
- **Utilisation :** blocs « Postuler » / emplacements libres du staff (« ta vignette t'attend »).

```
A sealed collectible sticker pack (foil wrapper, like a Panini packet) standing upright, slightly tilted, with crimped serrated top and bottom edges. Wrapper: glossy black foil with a bold lacquer-red diagonal brush stroke and fine gold foil details, the center of the front left as an EMPTY plain black area (a logo will be added later). The top is torn open and two stickers peek out, showing only red and black abstract brush artwork. Studio product shot, soft reflections on the foil. Isolated on a fully transparent background, no text, no logo.
```

### A6. Papier washi (texture) ★
- **Fichier :** `papier-washi.png` · **Format :** carré (1024 × 1024)
- **Utilisation :** grain du fond en thème clair (je l'éclaircis beaucoup ; en attendant j'utilise un grain généré en code).

```
Seamless tileable texture of off-white Japanese washi paper (#F3F1EC), flat scan with perfectly even lighting, subtle long fibers and tiny inclusions, very low contrast, no folds, no shadows, no vignetting, no text. The left edge must match the right edge and the top must match the bottom.
```

---

## B. Matchs (style néon d'origine, conversation `PROMPTS.md`)

Remplace les miniatures de 2022 dans « Sur le terrain » de l'accueil.

### B1. Showmatch Rocket League ★★★
- **Fichier :** `match-showmatch.png` · **Format :** paysage (1536 × 1024)

```
Two Rocket League style cars facing each other at kickoff in the center of a dark futuristic stadium, low camera angle, the ball floating between them. Left car: black with lacquer-red neon underglow. Right car: bone-white with cold white lights. The arena is almost black, crowd invisible in darkness, thin red neon lines on the field drawn like brush calligraphy, red smoke at ground level. Cinematic, high contrast, film grain. No text, no logos, no UI, no team names.
```

### B2. Coupe ★★
- **Fichier :** `match-cup.png` · **Format :** paysage (1536 × 1024)

```
A tournament trophy cup standing on a black stone pedestal in a dark space, the trophy made of black lacquer with red lacquer details and thin gold edges, lit by a single red neon rim light from behind; around it, glowing red neon brush strokes like calligraphy swirl in the air, light red smoke on the floor. Cinematic, centered, lots of black negative space on both sides. No text, no logos, no engraving.
```

### B3. Match League of Legends ★ (pour les prochains matchs LoL)
- **Fichier :** `match-lol.png` · **Format :** paysage (1536 × 1024)

```
GAME BANNER. League of Legends mood: a stone river crossing in a mystical jungle at dusk, teal water, ancient ruins and blue-gold magic light, viewed from a high cinematic angle, no champions, no characters. Oni Korp accents: a few red neon brush strokes slashing across the top right, light red smoke near the river. No text, no logos, no UI.
```

### B4. Match Valorant ★ (pour les prochains matchs Valo)
- **Fichier :** `match-valo.png` · **Format :** paysage (1536 × 1024)

```
GAME BANNER. Valorant mood: an empty tactical map site with clean geometric architecture, sharp shadows, coral red (#FF4655) and dark navy palette, a spike-like device glowing on the ground, no agents, no characters. Oni Korp accents: thin red neon brush calligraphy lines on the walls, light red smoke. No text, no logos, no UI.
```

---

## C. En-têtes de pages (style néon, série « encre de nuit ») ★★

Remplacent les photos d'ambiance génériques actuelles (salle gaming, lanterne…). Les quatre doivent former **une série** : mêmes couleurs, même grain, même composition (sujet à droite, gauche noire et vide pour le titre). Le kanji de la page reste posé en code.

Préambule à coller avant les 4 prompts :

```
The next 4 images are a SERIES of website page headers. Same palette, same grain, same composition for all four: ultra-wide, the subject on the right third, the left two thirds fading to pure black and completely empty (the page title goes there). Style: sumi ink wash painting at night, mostly black, with lacquer-red ink and a few thin glowing red neon lines drawn like calligraphy. No characters, no faces, no masks, no text.
```

### C1. Le club
- **Fichier :** `entete-club.png` · **Format :** paysage (1536 × 1024)

```
Header 1/4 — "origins": a lone torii gate on a hill above a sea of fog at night, painted in black sumi ink wash, a huge lacquer-red moon behind it, one thin red neon line tracing the outline of the torii.
```

### C2. Effectif
- **Fichier :** `entete-effectif.png` · **Format :** paysage (1536 × 1024)

```
Header 2/4 — "the squad": a row of five tall black lacquered banners (nobori flags) standing side by side in the wind, painted in sumi ink wash, each banner with a thin red neon edge, red embers floating, blank banners without any symbol.
```

### C3. Recrutement
- **Fichier :** `entete-recrutement.png` · **Format :** paysage (1536 × 1024)

```
Header 3/4 — "the entrance": a sliding shoji door slightly open in a dark room, warm red light spilling through the gap onto a wooden floor, sumi ink wash style, a thin red neon line along the edge of the opening.
```

### C4. Vestiaire
- **Fichier :** `entete-vestiaire.png` · **Format :** paysage (1536 × 1024)

```
Header 4/4 — "the locker room": a single black hoodie hanging on a wooden peg against a dark wall, painted in sumi ink wash, lacquer-red details on the hoodie with no logo and no text, a thin red neon line drawing the hanger, faint red smoke.
```
