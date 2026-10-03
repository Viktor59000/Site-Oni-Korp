# Prompts visuels — site Oni Korp

## Mode d'emploi

1. Ouvre ChatGPT (4o / génération d'images) et colle **d'abord le bloc « Style commun »** dans la conversation, une seule fois.
2. Colle ensuite chaque prompt un par un. Choisis le format indiqué (paysage, carré ou portrait).
3. Si une image ne te plaît pas, demande une variante (« même chose, plus sombre », « moins d'éléments »…) plutôt que de tout relancer.
4. Télécharge l'image retenue en PNG et range-la dans `site/visuels/a-integrer/` **avec le nom de fichier indiqué**.
5. Dis-moi quand c'est fait : je recadre, j'optimise et j'intègre au site.

Règle d'or : **aucun texte, aucun logo dans les images.** ChatGPT déforme les logos et les lettres. Je pose le vrai logo et les textes par-dessus en code.

---

## Style commun (à coller en premier)

```
For every image in this conversation, follow this art direction:
- Brand: "Oni Korp", a French esports club. Theme: Japanese calligraphy, sumi ink and red lacquer.
- The identity is carried by bold ink brush strokes, angular slanted shapes (parallelograms, sharp diagonal cuts) and red smoke. NEVER draw masks, demon faces, creatures or skulls.
- Palette: pure black backgrounds, deep lacquer red (#C22E28), dark blood red (#4A1210), touches of bone white (#EDEBE7). No other saturated colors (no blue, no purple, no neon cyan).
- Lighting: dramatic, low-key, a single red rim light, lots of negative space in deep black.
- Texture: subtle sumi ink brush strokes and fine film grain, cinematic, high detail.
- Never include any text, letters, numbers, logos, watermarks or UI elements.
- Never copy existing video game characters or official game art. Original designs only.
Reply "OK" and wait for my prompts.
```

---

## 1. Fond de l'accueil

- **Fichier :** `hero-fond.png`
- **Format :** paysage (1536 × 1024)
- **Utilisation :** derrière le grand kanji 鬼 et l'Octane, qui restent posés en code par-dessus. L'image ne sert qu'à donner de la matière : elle doit rester sombre et sans sujet.

```
A wide, very dark abstract background for an esports website hero. On the right two thirds: huge diagonal sumi ink brush strokes in deep lacquer red, dry-brush texture with splatters, slashing from top-right to bottom-left, mixed with slow red smoke. The left third fades to pure black, completely empty. No figure, no object, no mask, no face. Subtle film grain. No text.
```

## 1 bis. Le kanji 鬼 au pinceau (optionnel, mais c'est le cœur de la DA)

- **Fichier :** `kanji-oni.png`
- **Format :** carré (1024 × 1024)
- **Utilisation :** remplace le kanji typographique de l'accueil par une vraie calligraphie. Si le caractère n'est pas exactement 鬼, relance : il doit être correct.

```
Traditional Japanese shodo calligraphy of the single kanji character 鬼 (oni), written with one energetic brush in glossy red lacquer ink (#C22E28) on a pure black background. Dry-brush edges, small ink splatters, strong dynamic strokes. The character must be the correct kanji 鬼, centered, filling about 80% of the frame. Nothing else in the image.
```

Même principe pour les en-têtes des pages, si le premier rendu te plaît (fichiers `kanji-club.png` pour 志, `kanji-effectif.png` pour 隊, `kanji-recrutement.png` pour 挑, `kanji-vestiaire.png` pour 装) : reprends le prompt en changeant seulement le caractère.

---

## 2. Bannières des 4 jeux

- **Format :** paysage (1536 × 1024)
- **Important :** le sujet doit tenir dans **la bande horizontale centrale** (le site recadre en bandeau très large, 4:1). Haut et bas de l'image seront coupés.

### Rocket League — `pole-rocket-league.png`

```
Ultra-wide cinematic shot inside a futuristic stadium at night: a sleek rocket-powered car with black and red livery flies through the air with boosters glowing red, about to hit a giant glowing ball. Motion blur, sparks, red light trails. Red sumi ink brush strokes frame the scene. All the action is concentrated in a horizontal band across the middle of the frame; top and bottom are dark empty stadium. Original car design, not a real brand. No text, no logos.
```

### League of Legends — `pole-lol.png`

```
Ultra-wide fantasy battle scene: an armored warrior with a glowing red blade stands on the edge of a mystical river at dusk, ancient stone towers and magical crystals in the background, red embers in the air. Original character design inspired by fantasy MOBA art, not a copy of any existing champion. Red sumi ink brush strokes frame the scene. Action concentrated in the horizontal middle band of the frame. No text.
```

### Valorant — `pole-valorant.png`

```
Ultra-wide tactical shooter scene: a masked agent in a sleek black tactical outfit with red accents crouches on a rooftop in a futuristic Japanese city at night, holding a stylized rifle, red neon reflections on wet concrete, a faint holographic red barrier in the distance. Original character, not a copy of any existing game agent. Red sumi ink brush strokes frame the scene. Action concentrated in the horizontal middle band. No text.
```

### osu! — `pole-osu.png`

```
Ultra-wide abstract rhythm-game artwork: concentric glowing circles and rings pulsing in sync like music beats, a stylized drawing tablet pen leaving red light trails across a black void, sound waves and particle bursts, Japanese ink splashes. Abstract and graphic, no characters. Composition concentrated in the horizontal middle band. No text.
```

---

## 3. Image de partage réseaux (Open Graph)

- **Fichier :** `og-partage.png`
- **Format :** paysage (1536 × 1024)
- **Utilisation :** l'aperçu qui s'affiche quand on poste le lien du site sur Discord, X, WhatsApp… Je pose le logo et le nom par-dessus.

```
Minimal key visual: one single large diagonal brush stroke of red lacquer ink with dry-brush texture, slashing across the right half of a pure black background, a few ink splatters and a faint red glow. Very clean, the left half stays empty for a logo. Premium esports branding mood. No figure, no mask, no text.
```

---

## 4. Le sweat du club (mise en scène)

- **Joindre l'image de référence :** `site/public/img/sweat-front.webp` (glisse-la dans ChatGPT avec le prompt)
- **Format :** portrait (1024 × 1536)

### Face — `sweat-porte-face.png`

```
Using the attached hoodie as the exact product reference (keep its design, colors and placement of elements as faithful as possible), create a studio product photo: a young gamer wearing this hoodie, hood down, standing in a dark studio with a single red rim light, face partially in shadow, gaming headset around the neck. Black background. Fashion lookbook style. No added text or logos beyond what is on the reference.
```

### À plat — `sweat-a-plat.png`

```
Using the attached hoodie as the exact product reference, create a flat-lay photo of the hoodie neatly folded on black slate, with a gaming controller and a pair of over-ear headphones next to it, soft red light from the side. Top-down view, premium streetwear mood. No added text.
```

---

## 5. En-têtes des pages internes (optionnel)

- **Format :** paysage (1536 × 1024)
- **Utilisation :** fond très discret derrière les titres « Le club », « Effectif », « Recrutement », « Vestiaire ». Ils doivent rester très sombres.

### `entete-club.png`
```
Very dark atmospheric image: a traditional Japanese dojo interior at night, empty, one red paper lantern glowing, mist on the floor. 90% of the image in deep shadow. No text.
```

### `entete-effectif.png`
```
Very dark atmospheric image: a row of gaming chairs and monitors in a dark esports bootcamp room, screens glowing faint red, seen from behind, nobody in the seats. 90% of the image in deep shadow. No text.
```

### `entete-recrutement.png`
```
Very dark atmospheric image: close-up of hands gripping a game controller, red rim light outlining the knuckles, ink brush smoke around. 90% of the image in deep shadow. No text.
```

### `entete-vestiaire.png`
```
Very dark atmospheric image: an esports team locker room, black jerseys with red details hanging in open lockers, one spotlight from above. No readable text on the jerseys. 90% of the image in deep shadow. No text.
```

---

## Récap des fichiers attendus dans `site/visuels/a-integrer/`

| Fichier | Priorité |
|---|---|
| `kanji-oni.png` | ★★★ |
| `hero-fond.png` | ★★ |
| `pole-rocket-league.png` | ★★★ |
| `pole-lol.png` | ★★★ |
| `pole-valorant.png` | ★★★ |
| `pole-osu.png` | ★★★ |
| `og-partage.png` | ★★ |
| `sweat-porte-face.png` | ★★ |
| `sweat-a-plat.png` | ★ |
| `kanji-club.png`, `kanji-effectif.png`, `kanji-recrutement.png`, `kanji-vestiaire.png` | ★★ |
| `entete-club.png`, `entete-effectif.png`, `entete-recrutement.png`, `entete-vestiaire.png` | ★ (optionnel) |
