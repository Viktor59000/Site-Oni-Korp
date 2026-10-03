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
- Brand: "Oni Korp", a French esports club. Theme: Japanese oni demon, ink and lacquer.
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
- **Utilisation :** derrière le titre « Jamais à genoux. » (à gauche) et l'Octane (à droite)

```
A wide cinematic background for an esports website hero section. On the right half: a huge traditional Japanese oni demon mask, carved lacquer, half emerging from total darkness, lit only by a red rim light from below, horns sharp, expression fierce but calm. Thin wisps of red smoke and ink brush strokes drift around it. The entire left half of the image must be almost pure black, empty negative space for a headline. Subtle film grain. No text.
```

---

## 2. Bannières des 4 jeux

- **Format :** paysage (1536 × 1024)
- **Important :** le sujet doit tenir dans **la bande horizontale centrale** (le site recadre en bandeau très large, 4:1). Haut et bas de l'image seront coupés.

### Rocket League — `pole-rocket-league.png`

```
Ultra-wide cinematic shot inside a futuristic stadium at night: a sleek rocket-powered car with black and red livery flies through the air with boosters glowing red, about to hit a giant glowing ball. Motion blur, sparks, red light trails. All the action is concentrated in a horizontal band across the middle of the frame; top and bottom are dark empty stadium. Original car design, not a real brand. No text, no logos.
```

### League of Legends — `pole-lol.png`

```
Ultra-wide fantasy battle scene: an armored warrior with a glowing red blade stands on the edge of a mystical river at dusk, ancient stone towers and magical crystals in the background, red embers in the air. Original character design inspired by fantasy MOBA art, not a copy of any existing champion. Action concentrated in the horizontal middle band of the frame. No text.
```

### Valorant — `pole-valorant.png`

```
Ultra-wide tactical shooter scene: a masked agent in a sleek black tactical outfit with red accents crouches on a rooftop in a futuristic Japanese city at night, holding a stylized rifle, red neon reflections on wet concrete, a faint holographic red barrier in the distance. Original character, not a copy of any existing game agent. Action concentrated in the horizontal middle band. No text.
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
Minimal key visual: a single oni demon horn shape made of red lacquer and black ink, slightly off-center to the right, on a pure black background with a subtle red glow and ink brush texture. Very clean, lots of empty space on the left for a logo. Premium esports branding mood. No text.
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
| `hero-fond.png` | ★★★ |
| `pole-rocket-league.png` | ★★★ |
| `pole-lol.png` | ★★★ |
| `pole-valorant.png` | ★★★ |
| `pole-osu.png` | ★★★ |
| `og-partage.png` | ★★ |
| `sweat-porte-face.png` | ★★ |
| `sweat-a-plat.png` | ★ |
| `entete-club.png`, `entete-effectif.png`, `entete-recrutement.png`, `entete-vestiaire.png` | ★ (optionnel) |
