# Vignettes « portrait » — on reconnaît la personne

Objectif : sur sa vignette, chacun se reconnaît **à son physique**, et ses proches captent **le clin d'œil** caché dans le décor. Pas de texte, tout passe par l'image.

## La méthode (importante)

**Joins la photo de la personne dans ChatGPT** avec le prompt. 4o s'en sert comme référence de ressemblance et la stylise dans le style de l'album. C'est beaucoup plus fidèle qu'une description.

- Pour AlphA, Yasunaii, Jakpot et Daynalox : joins leur photo.
- Pour Sheep, Slazen et Sebla : pas de photo, la description suffit (envoie-moi une photo si tu en as, j'ajuste).
- **Les visages sont désormais visibles** (stylisés anime). C'est ce qui fait une vraie vignette Panini.
- **Demande-leur leur accord** avant que je mette en ligne : un visage reconnaissable sur un site public, c'est leur choix.

## Mode d'emploi

1. Nouvelle conversation ChatGPT. Colle le bloc « Style commun » de `PROMPTS.md`, puis le bloc « Portraits » ci-dessous.
2. Pour chaque carte : **joins la photo** (si dispo) + colle le prompt. Format portrait (1024 × 1536).
3. Range dans `site/visuels/a-integrer/` avec **exactement** le nom indiqué : ça remplace l'ancienne carte.

---

## Bloc « Portraits » (à coller une fois)

```
PORTRAIT EDITION. For the next images, create illustrations for collectible esports stickers of REAL club members. When I attach a photo, use it as the likeness reference: same hair (color, length, style), face shape, facial hair, build. Stylize into the art style below, do not copy the photo's background or clothes unless I say so.
- Portrait 2:3, one character in action, following the framing given in each prompt.
- Style: bold graphic illustration, thick black ink outlines, cel shading, halftone texture, energetic brush splashes, glowing effects. Modern anime trading card, flattering and cool, not a photo.
- The FACE IS VISIBLE and recognizable (stylized anime), at least three-quarter view. No masks.
- The game's colors dominate, its universe in the background, a few lacquer-red Oni accents.
- Keep the head and main action in the upper two thirds; the bottom third and the two top corners stay simple (a name banner, a crest and a number go on top).
- Each prompt contains one hidden personal detail: include it clearly but naturally in the scene.
- No readable text, no numbers, no logos, no real game characters.
Reply "OK".
```

---

## AlphA (Lye) — 3 cartes · *joins sa photo*
Physique : cheveux blonds mi-longs coiffés sur le côté, fine moustache, mince, chaîne fine au cou, casque gaming noir et rouge à micro.
Clin d'œil : **études de cinéma** → un clap de cinéma, une pellicule.

| Fichier | Prompt |
|---|---|
| `rl-gamma-1.png` | `PORTRAIT EDITION. Use the attached photo for likeness: swept blond hair, thin mustache, slim, black and red gaming headset with boom mic. Rocket League, electric blue #1450D6 dominant. Framing: dynamic three-quarter view in mid-air, steering an aerial, a small car flying past with a crackling blue lightning boost trail. Hidden detail: the lightning trail forms the shape of a film strip with frames.` |
| `valo-duelliste.png` | `PORTRAIT EDITION. Use the attached photo for likeness: swept blond hair, thin mustache, slim, black and red gaming headset. Valorant duelist, red #FF4655 and navy. Framing: dashing toward the viewer on a sunlit tactical map, a blade of red light in one hand, motion streaks. Hidden detail: a film clapperboard strapped to the thigh like a holster.` |
| `staff-fondateur-2.png` | `PORTRAIT EDITION. Use the attached photo for likeness: swept blond hair, thin mustache, slim, thin chain necklace. Club founder and Valorant manager, red #FF4655 and black with one gold line. Framing: low angle, standing like a film director next to a cinema camera on a tripod, one hand raised giving the "action" signal, a tactical map hologram behind.` |

## Yasunaii (Yuzuctus) — 2 cartes · *joins sa photo*
Physique : **homme**, cheveux bruns épais et ébouriffés relevés sur le dessus, yeux clairs, légère barbe de quelques jours, carrure solide, t-shirt bleu.
Clin d'œil : son pseudo **Yuzuctus = yuzu + cactus**, et il **code** ses propres outils autour d'osu!.

| Fichier | Prompt |
|---|---|
| `osu-1.png` | `PORTRAIT EDITION. Use the attached photo for likeness: a young man with thick messy dark brown hair swept up, light eyes, light stubble, solid build, blue t-shirt. osu! rhythm game, pink #FF66AA and plum. Framing: three-quarter view from the side at his desk, pen tablet in hand, focused, pink hit circles and sliders exploding out of the screen. Hidden details: a small potted cactus and a yellow yuzu citrus on the desk; a second monitor showing lines of code.` |
| `staff-fondateur-3.png` | `PORTRAIT EDITION. Use the attached photo for likeness: a young man with thick messy dark brown hair swept up, light eyes, light stubble, solid build. Founder, caster and community manager, pink #FF66AA and black with one gold line. Framing: close three-quarter profile leaning into a studio microphone, mouth open mid-cast, closed-back headphones. Hidden detail: the microphone's pop filter has a tiny cactus sticker, and yuzu slices float among the sound waves.` |

## Jakpot — 2 cartes · *joins sa photo*
Physique : cheveux blonds longs attachés en chignon, barbe courte, carrure athlétique, surchemise beige crème sur t-shirt blanc, jean clair.
Clin d'œil : **le métronome de l'équipe** (régulier, il donne le rythme).

| Fichier | Prompt |
|---|---|
| `rl-gamma-2.png` | `PORTRAIT EDITION. Use the attached photo for likeness: blond hair tied in a man bun, short beard, athletic build, cream overshirt over a white t-shirt. Rocket League goalkeeper, electric blue #1450D6 dominant. Framing: low angle, arms spread wide, a hexagonal electric force field crackling in front of him as the giant ball slams into it. Hidden detail: the force field's impact ripples are drawn like the swinging arm of a metronome.` |
| `staff-fondateur-1.png` | `PORTRAIT EDITION. Use the attached photo for likeness: blond hair in a man bun, short beard, cream overshirt with rolled sleeves over a white t-shirt. Club founder, graphic designer and Rocket League manager, blue #1450D6 and black with one gold line. Framing: three-quarter view, calmly rolling up his sleeve, a graphic tablet under the other arm. Hidden detail: a classic wooden metronome ticking on the desk beside him, its pendulum glowing red.` |

## Pablito — 1 carte · *photo si tu en as*
Clin d'œil : **sa photo de profil Patrick (Bob l'éponge)**. On ne dessine pas le personnage (droits d'auteur, et 4o le refuse souvent) : on garde l'évocation, une **étoile de mer rose** et un short vert à fleurs.

| Fichier | Prompt |
|---|---|
| `rl-gamma-3.png` | `PORTRAIT EDITION. A young man (likeness from the attached photo if provided). Rocket League, electric blue #1450D6 dominant. Framing: crouched low like at kickoff, one fist on the ground, blue lightning bursting from the impact, a small car charging behind. Hidden details: a chubby pink starfish plush (generic, not a cartoon character) clipped to his belt, and green shorts with a light flower pattern under his hoodie.` |

## Sheep — 3 cartes · *photo si tu en as*
Physique (à confirmer) : cheveux bouclés, baskets rouges.
Clin d'œil : **adore les moutons**.

| Fichier | Prompt |
|---|---|
| `rl-epsilon-1.png` | `PORTRAIT EDITION. A young man with fluffy curly hair (sheep-like), red sneakers. Rocket League, blazing orange #FF7A18 dominant. Framing: low angle, sitting on the arena wall, balancing the ball on one finger, fire trails orbiting it. Hidden detail: a small sheep plush hanging from his backpack strap.` |
| `osu-2.png` | `PORTRAIT EDITION. A young man with fluffy curly hair, headphones, red sneakers. osu! rhythm game, pink #FF66AA and plum. Framing: side view jumping in sync with the beat, giant pink hit circles bursting around. Hidden detail: one of the hit circles is a fluffy round sheep.` |
| `staff-fondateur-4.png` | `PORTRAIT EDITION. A young man with fluffy curly hair, oversized hoodie with the hood down, red sneakers. Club founder, orange #FF7A18 and black with one gold line. Framing: full body sitting relaxed on top of a giant match ball, controller in hand. Hidden detail: his hoodie has small sheep ears on the hood, and a little sheep sits next to him on the ball.` |

## Daynalox — 2 cartes · *joins sa photo*
Physique : longs cheveux ondulés blond vénitien / roux, détachés, visage fin, mince.
Clin d'œil : **fan de Pokémon et de Yasuo** → le vent, la lame, une capsule-ball.

| Fichier | Prompt |
|---|---|
| `lol-mid.png` | `PORTRAIT EDITION. Use the attached photo for likeness: long wavy strawberry-blond hair worn loose, slim face, slim build. League of Legends mid lane, teal #0F5F6B and gold. Framing: three-quarter view, a single-edged sword in one hand, the other casting a swirling TORNADO of wind and teal energy forward, hair whipped by the wind. Background: ruined stone lane. Hidden detail: a red and white capsule ball charm hanging from his belt.` |
| `staff-moderateur-1.png` | `PORTRAIT EDITION. Use the attached photo for likeness: long wavy strawberry-blond hair loose, slim. Moderator and League of Legends manager, teal #0A2B36 and gold with one gold line. Framing: dynamic step forward, raising a round wall of swirling WIND (not light) that blocks incoming empty chat bubbles, hair flowing. Hidden detail: a red and white capsule ball spinning in his other hand.` |

## Slazen — 1 carte
Clin d'œil : **vit en Martinique**, **fan de Karmine Corp**.

| Fichier | Prompt |
|---|---|
| `staff-coach-2.png` | `PORTRAIT EDITION. Rocket League coach, orange #FF7A18 and black with one gold line. Framing: seen from behind, three-quarter, sitting in a gaming chair facing two screens showing a replay with a dotted car trajectory, turning his head toward the viewer, pointing at a screen. Hidden details: through the window behind the screens, tropical palm trees and a Caribbean sunset sea; a plain navy blue supporter scarf (no logo) draped over the chair.` |

## Sebla — 1 carte
Physique : **chemise blanche, bras croisés**, très professionnel.

| Fichier | Prompt |
|---|---|
| `staff-coach-1.png` | `PORTRAIT EDITION. Rocket League coach, blue #1450D6 and black with one gold line. Framing: three-quarter view, standing very straight in front of a whiteboard showing a pitch with circles and arrows, ARMS CROSSED, calm and serious. Clothing: a crisp white button-up shirt (not a hoodie), neat hair, a whistle on a cord. Hidden detail: a perfectly organized row of markers on the board's ledge, aligned by color.` |

---

## Bannières des jeux (page Effectif, à droite des titres)

Pas de photo. Format **paysage (1536 × 1024)**, conversation « Style commun » de `PROMPTS.md`.

| Fichier | Prompt |
|---|---|
| `pole-rocket-league.png` | `GAME BANNER. Rocket League: a stadium at night seen from above the goal line, two cars clashing mid-air around the ball, one blue with electric lightning boost, one orange with fire boost. Red brush accents in the corners. No text, no logos, no UI.` |
| `pole-lol.png` | `GAME BANNER. League of Legends: the river crossing of a fantasy arena at dusk, teal water and gold magic light, ancient ruins, a turret glowing in the distance, clear and readable composition, no champions. A few red brush strokes. No text, no logos, no UI.` |
| `pole-valorant.png` | `GAME BANNER. Valorant: a clean sunlit tactical map site, geometric architecture, boxes and long shadows, a spike-like device glowing red on the ground, no agents. Thin red neon accents. No text, no logos, no UI.` |
| `pole-osu.png` | `GAME BANNER. osu!: an abstract dark stage of glowing pink hit circles, sliders and approach rings flowing in rhythm, with soft cherry blossom petals. Red brush accents. No text, no logos, no UI.` |
