# Séries spéciales de l'album — 20 vignettes

Même style que les 27 vignettes joueurs et staff : une illustration en action, trait encré, trame, éclaboussures, univers du jeu, accents rouge laque. Elles ne sortent que dans les **boosters** (pas sur l'Effectif).

Le cadre, la rareté (argent, holo, or, ultra-rare), le numéro, le titre et **les vrais logos** sont posés en code. 4o ne fournit que l'illustration.

## Mode d'emploi

1. Nouvelle conversation ChatGPT. Colle le bloc « Style album » de `PROMPTS-ALBUM-COMPLET.md`, attends « OK ».
2. Colle ensuite le bloc « Séries spéciales » ci-dessous, puis les prompts un par un. Format **portrait 1024 × 1536**.
3. Range dans `site/visuels/a-integrer/` avec **exactement** les noms indiqués. Chaque image remplace automatiquement le visuel provisoire.

## Bloc « Séries spéciales » (à coller une fois, après le style album)

```
SPECIAL SERIES. The next images are special cards of the same album (same style, same energy, full-bleed, head and main subject in the upper two thirds, the bottom third still painted but not crucial). Some cards have no character: then the subject (a car, a place, an object, a moment) is the hero of the card, shot with the same dynamic framing and ink-splash energy. Where I say EMPTY AREA, keep that zone clean and readable (a real logo will be placed there later): never draw any logo, letter or text yourself.
Reply "OK".
```

---

## Moments — holo (5)

| Fichier | Prompt |
|---|---|
| `sp-moments-1.png` | `MOMENT "Foundation, July 12 2021". A small group of four young friends seen from behind on a rooftop at night, gaming headsets around their necks, looking at a huge red full moon over a city, a torn black banner flapping in the wind beside them, red ink splashes and confetti of red paper. Feeling: the beginning of something.` |
| `sp-moments-2.png` | `MOMENT "Showmatch live on Twitch". Inside a Rocket League arena: a black and red car scoring with a huge blue-orange explosion in the goal, a giant stream chat of empty hearts and empty bubbles flying from the side, stage lights, crowd silhouettes cheering. Dynamic low angle.` |
| `sp-moments-3.png` | `MOMENT "Tournament cup". Two teams of three silhouettes, one with blue lightning, one with orange fire, standing back to back on a stage under spotlights, a black and red trophy cup glowing between them, red ink brush splashes. Epic poster framing.` |
| `sp-moments-4.png` | `MOMENT "Opening of the League of Legends division, 2024". A heavy ancient stone gate in a fantasy jungle being pushed open, teal and gold magic light bursting through, five small silhouettes stepping in, red ink splashes. League of Legends mood, no champions.` |
| `sp-moments-5.png` | `MOMENT "Opening of the Valorant division, 2024". Five silhouettes walking in a line out of a sunlit tactical map corridor, long shadows, coral red #FF4655 accents, a spike-like device glowing in the foreground, red ink splashes. No agents.` |

## Garage — argent (4) · *joins l'image de référence*

Pour chaque carte, **joins le rendu du decal** (dossier `site/visuels/references/`) avec le prompt : la voiture de la carte doit porter **exactement ce decal**, bien visible, comme une vraie carte de collection de la voiture.

| Fichier | Joindre | Prompt |
|---|---|---|
| `sp-garage-1.png` | `decal-octane-domicile.png` | `GARAGE CARD. Use the attached image as the exact reference for the car and its decal: same Octane car, same black and red livery, same pattern and placement. Redraw it in the album style (ink outlines, cel shading, halftone, red ink splashes). The car is the hero: three-quarter front view, jumping toward the viewer out of a garage door, red boost flames, sparks. The decal must be clearly readable.` |
| `sp-garage-2.png` | `decal-octane-visiteur.png` | `GARAGE CARD. Use the attached image as the exact reference for the car and its decal: same Octane car, same white and red away livery, same pattern and placement. Redraw it in the album style. Side three-quarter view, drifting on a wet arena floor at night, spray of water and red light trails. The decal must be clearly readable.` |
| `sp-garage-3.png` | `decal-fennec-domicile.png` | `GARAGE CARD. Use the attached image as the exact reference for the car and its decal: same Fennec car, same black and red livery, same pattern and placement. Redraw it in the album style. Low angle, the car flipping in the air above the ball, red boost flames. The decal must be clearly readable.` |
| `sp-garage-4.png` | `decal-fennec-visiteur.png` | `GARAGE CARD. Use the attached image as the exact reference for the car and its decal: same Fennec car, same white and red away livery, same pattern and placement. Redraw it in the album style. The car parked under a single spotlight in a dark garage like a showroom poster, three-quarter front view, wrenches and tires around, red ink splashes. The decal must be clearly readable.` |

## Partenaires — argent (2) · *joins le logo*

Joins le logo du partenaire (`site/visuels/references/`) : il doit apparaître **en grand et sans être redessiné**, intégré dans la scène. Si 4o le déforme, dis-le-moi : je repose le vrai logo par-dessus.

| Fichier | Joindre | Prompt |
|---|---|---|
| `sp-partenaires-1.png` | `logo-carl-barl.png` | `PARTNER CARD for "Carl & Barl by LNDR", the club's Rocket League decal partner. Reproduce the attached logo EXACTLY (same shape, white, not redrawn, not stylized) as a huge glowing emblem painted on the garage wall in the upper half of the card. Below it, an Octane car in a black and red Oni Korp decal being finished by a spray-paint gun, flying paint drops, garage lights, red ink splashes. Album style.` |
| `sp-partenaires-2.png` | `logo-lolineup.png` | `PARTNER CARD for "LoLineup.gg", the club's League of Legends partner (a team line-up website). Reproduce the attached wordmark EXACTLY (same letters, white, not redrawn) as a big glowing holographic sign in the upper half of the card. Below it, a holographic board with five round slots filling up with glowing teal tokens, a hand placing the last one, teal and gold magic light, red ink splashes. Album style.` |

## Terrains — commune (4)

| Fichier | Prompt |
|---|---|
| `sp-terrains-1.png` | `ARENA. A Rocket League stadium seen in a dramatic vertical view from the goal line, the ball floating above center field, blue lightning on one side, orange fire on the other, stadium lights, red brush accents. No players.` |
| `sp-terrains-2.png` | `ARENA. The river of a League of Legends map seen from above in a vertical composition, teal water winding between ruins and jungle, a turret glowing far away, gold fireflies, red brush accents. No champions.` |
| `sp-terrains-3.png` | `ARENA. A Valorant map site in vertical framing, sunlit stone walls, crates, a plant site marked by glowing coral red lines on the ground, long shadows, red brush accents. No agents, no letters.` |
| `sp-terrains-4.png` | `ARENA. An abstract osu! stage in vertical framing, a path of glowing pink hit circles and sliders rising toward the sky like stepping stones, cherry blossom petals, a torii gate far away, red brush accents. No numbers.` |

## Vestiaire — commune (2)

| Fichier | Prompt |
|---|---|
| `sp-vestiaire-1.png` | `LOCKER ROOM. A black and white club hoodie with lacquer red details hanging alone in an open locker, a gaming headset hanging next to it, a single spotlight, red ink splashes. EMPTY AREA: the chest of the hoodie stays a clean plain black zone (the logo is added later).` |
| `sp-vestiaire-2.png` | `LOCKER ROOM. A young player seen from behind pulling on the black club hoodie, arms raised, the back of the hoodie plain black with red details (no text, no number), locker room lights, red ink splashes.` |

## Légendaires — ultra-rare (2)

| Fichier | Prompt |
|---|---|
| `sp-legendaires-1.png` | `LEGENDARY CARD. A massive ancient shield-shaped stone monument in a dark temple, cracked open by light: golden light and red ink energy bursting from inside, floating golden particles, two curved horn shapes rising from its top corners. EMPTY AREA: the face of the shield stays a clean dark flat surface (the real crest is added later). Majestic, gold and black, very rare feeling.` |
| `sp-legendaires-2.png` | `LEGENDARY CARD. A lone fighter seen from behind, kneeling on one knee in a storm, slowly standing up, one hand pushing on the ground, a huge glowing red neon kanji-like brush stroke energy behind them in the sky (abstract, no readable character), rain and red sparks. Meaning: never on your knees. Gold and red accents.` |

## Recrue — commune (1)

| Fichier | Prompt |
|---|---|
| `sp-recrue-1.png` | `RECRUIT CARD. An empty gaming chair in the middle of the club's dark training room, the screen in front of it glowing, a club hoodie folded on the seat waiting for someone, a single red spotlight on the chair, other players' silhouettes in the background turned toward it. Feeling: this seat is waiting for you.` |
