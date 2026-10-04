# Test de style — 3 vignettes « sérigraphie »

But : sortir du rendu « anime IA » avec un style **pauvre et contraint**, qui ressemble à une vraie vignette imprimée.

On teste sur 3 cartes : **Yuzuctus** (osu!), **Jakpot** (RL Gamma) et **Sheep** (RL Epsilon). Vous comparez à trois avec les cartes actuelles, puis on décide pour le reste de l'album.

## Mode d'emploi

1. **Nouvelle conversation ChatGPT** (surtout pas celle de l'album).
2. Colle le bloc « Style sérigraphie » et attends « OK ».
3. Colle chaque prompt. Format **portrait 1024 × 1536**.
4. Pour **Yuzuctus**, joins **une** de ses images de personnage, de préférence le portrait le plus net, comme référence de design.
5. Range les images dans `site/visuels/a-integrer/test/` avec les noms indiqués. Je les monte en vignettes à côté des actuelles pour comparer, sans rien mettre en ligne.

Si une image part en rendu « anime brillant », réponds : « Flatter. Fewer details. Only the 4 allowed colors. No glow, no gradients. »

---

## Bloc « Style sérigraphie » (à coller une fois)

```
SCREEN PRINT CARDS. For every image in this conversation, create the illustration of a collectible sticker in ONE strict, minimal style:
- Look: a 3-color screen print / risograph poster. Thick confident black brush-ink outlines, FLAT color areas only, no gradients, no glow, no lens flares, no 3D lighting, no glossy rendering.
- Palette: STRICTLY 4 inks: black, off-white paper (#EDEBE7), lacquer red (#C22E28), plus ONE accent color given in each prompt. Nothing else.
- Texture: visible paper grain, slightly misregistered color layers (the red is offset by a few pixels), halftone dots in the shadows only.
- Composition: one character, simple readable pose, big shapes, lots of flat background. Maximum 2 props. The idea must read in one second, like a sticker seen from 2 meters away.
- Face: simple stylized face (a few lines), generic, never a realistic portrait.
- Layout: portrait 2:3, full bleed, head and main idea in the upper two thirds; the bottom third is flat background (a name banner is added later).
- No text, no letters, no numbers, no logos.
Reply "OK".
```

---

## Les 3 cartes

### Yuzuctus — osu! · *joins une image de son personnage*
Fichier : `test-yuzuctus.png`

```
Use the attached character ONLY as a design reference (hair, accessories, colors, companion) and redraw it entirely in the screen print style, do not copy the drawing. Accent color: mint green (#7ED9B0) for the hair, everything else in the 4 inks. The character: short messy mint-green hair with two small buns, round yellow yuzu-slice hair clips, small cactus earrings, a blue-striped shirt rendered in black and paper stripes. Pose: sitting cross-legged, holding a drawing-tablet pen up like a wand, three flat red hit circles (simple concentric rings) floating around. A small round white blob cat sits on their knee. Flat paper background with one big red circle behind the head.
```

### Jakpot — Rocket League, Gamma · *rien à joindre*
Fichier : `test-jakpot.png`

```
Accent color: electric blue (#1450D6). A young man with blond hair tied in a small bun and a short beard, cream overshirt with rolled sleeves (paper color), standing calm and confident, one hand raised keeping the beat, a big wooden metronome next to him with its pendulum swinging (motion shown by 3 black lines). Behind him, a flat blue diagonal band and the simple round silhouette of a Rocket League ball. Big flat shapes, very few details.
```

### Sheep — Rocket League, Epsilon · *rien à joindre*
Fichier : `test-sheep.png`

```
Accent color: orange (#FF7A18). A young man with a huge cloud of curly hair like wool, black hoodie, plain red high-top sneakers, jumping with arms wide open, a small smiling sheep jumping with him in the same pose (mirror). Behind them, a flat orange half circle like a rising sun and the simple round silhouette of a Rocket League ball. Big flat shapes, very few details, playful.
```
