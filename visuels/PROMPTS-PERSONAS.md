# Personas v2 — sans aucune image jointe

**Règle d'or : ne joins AUCUNE photo ni PP à ChatGPT.** Avec une photo, 4o la décalque (c'est ce qui s'est passé avec Jakpot). Ici, les éléments distinctifs ont été relevés à la main et sont écrits dans chaque prompt : 4o doit inventer un personnage à partir de mots.

## Fiches (ce qui a été relevé)

| Membre | Physique (photo) | Univers (PP) | Détail |
|---|---|---|---|
| Jakpot | cheveux châtain clair mi-longs, raie au milieu, mèches en rideau jusqu'aux pommettes ; barbe courte roussâtre + moustache ; visage large, carrure solide | sa PP est sa photo : ambiance voiture, parking, surchemise | petit anneau noir au lobe gauche ; « le métronome de l'équipe » |
| Daynalox | longs cheveux ondulés blond vénitien, détachés ; mince | manga encré noir et blanc ; grand rire avec un croc ; petite créole ; veste noire jetée sur les épaules | fan de Yasuo (vent, lame) et de Pokémon |
| AlphA | cheveux blonds mi-longs coiffés sur le côté ; fine moustache ; mince ; casque noir et rouge à micro | capuche sombre à petites oreilles de chat, deux pinces jaunes ; regard rouge, froid, blasé | études de cinéma |

## Mode d'emploi

1. **Nouvelle conversation ChatGPT.** Colle le bloc « Style » et attends « OK ».
2. Colle chaque prompt **sans rien joindre**. Format portrait 1024 × 1536.
3. Range dans `site/visuels/a-integrer/test/` : `persona-jakpot.png`, `persona-daynalox.png`, `persona-alpha.png`.

---

## Bloc « Style » (à coller une fois)

```
ONI KORP PERSONAS. For every image in this conversation, invent ONE original character for a collectible esports card, from the written description only. Strict style:
- Manga illustration, clean confident ink linework, flat cel colors (2 tones per color max), solid black shadows. No gradients, no glow, no lens flare, no glossy 3D rendering, no photo-realism, no halftone dots, no busy cross-hatching.
- Palette: black, off-white, lacquer red (#C22E28) and ONE accent color given in the prompt. Nothing else.
- Every character wears a piece of the club outfit: a black jacket or hoodie with lacquer-red details (no logo, no text).
- The character is an invented manga person: the face is stylized and expressive, NOT a realistic portrait. Respect exactly the hair, facial hair, build and accessories described.
- Portrait 2:3, full bleed (no white margin, no frame), character in the upper two thirds; the bottom third is simple background, still painted.
- No text, no letters, no numbers, no logos.
Reply "OK".
```

---

## Jakpot · Rocket League, roster Gamma

Fichier : `persona-jakpot.png`

```
Accent color: electric blue (#1450D6).
A young man with medium-length light chestnut hair parted in the middle, curtain bangs falling to his cheekbones, a short reddish-brown beard and mustache, a broad face, a solid build. A small black ring earring on his LEFT earlobe. He wears the black club jacket open over a black t-shirt.
Pose: three-quarter view, calm and in control, one hand raised at shoulder height snapping his fingers to set the tempo, the other hand in his pocket. Behind him, a big flat blue diagonal shape and a small inked Rocket League car drifting, with three curved motion lines echoing a metronome swing. Half-smile, eyes focused.
```

## Daynalox · League of Legends, mid

Fichier : `persona-daynalox.png`

```
Accent color: teal (#0F8A9B).
A slim young man with long wavy strawberry-blond hair worn loose past the shoulders, laughing with eyes closed and a big grin showing one small fang, a small silver hoop earring. An oversized black club jacket with red details thrown over his shoulders like a cape.
Pose: sitting backwards on a chair, one arm draped lazily over the backrest, a long thin single-edged sword resting on his shoulder, a teal swirl of wind lifting his hair and the jacket. Background: flat off-white with one big teal wind spiral.
```

## AlphA · Rocket League & Valorant

Fichier : `persona-alpha.png`

```
Accent color: Valorant red (#FF4655).
A slim young MAN with medium-length blond hair swept to one side, a thin mustache, wearing a black and red gaming headset with a boom microphone. Over the headset, a dark hooded club cloak whose hood has two small cat-ear shapes and two small yellow clips; blond strands escape the hood. Piercing red eyes, a cold, unimpressed look.
Pose: low-angle shot, standing still, holding a short blade of red light low at his side; behind him, a film-strip shaped band crossing the background diagonally (nod to film school), drawn in black and red.
```
