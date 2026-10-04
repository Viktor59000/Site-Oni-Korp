# Album Oni Korp — les 27 vignettes + 4 bannières, de zéro

**C'est le seul fichier à utiliser.** Il remplace les anciens prompts de vignettes (RL, staff, joueurs v2, portraits).

## Les règles de l'album (pour que tout soit cohérent)

- **Un seul style** pour les 27 cartes : bloc « Style album » collé une fois en début de conversation.
- **Une action par carte**, avec un cadrage différent à chaque fois.
- **Couleurs :** chaque joueur a la couleur de son jeu, et chaque membre du staff la couleur de son pôle, avec un liseré or en plus.
- **Ressemblance :**
  - 🟢 **Photo dispo** (AlphA, Yasunaii, Jakpot, Daynalox) : joins la photo, le visage est visible et ressemblant.
  - ⚪ **Pas de photo** : le visage reste dans l'ombre, et on reconnaît la personne à sa silhouette et à son clin d'œil. On n'invente pas le visage d'une vraie personne.
- **La même personne a la même description sur toutes ses cartes** : AlphA ×3, Sheep ×3, Jakpot ×2, Yasunaii ×2, Daynalox ×2.
- **Accord** : demande aux personnes avec photo si elles sont d'accord avant la mise en ligne.

## Mode d'emploi

1. **Une seule conversation ChatGPT** pour les 27 cartes, pour garder le style constant. Si elle devient trop longue, ouvre-en une nouvelle et recolle le bloc.
2. Colle le bloc « Style album », attends « OK ».
3. Pour chaque carte : 🟢 joins la photo, puis colle le prompt. Format **portrait 1024 × 1536**.
4. Range dans `site/visuels/a-integrer/` avec **exactement** le nom de fichier indiqué.
5. Les bannières (fin du fichier) : format **paysage 1536 × 1024**, même conversation.

---

## Bloc « Style album » (à coller une fois)

```
ONI KORP ALBUM. For every image in this conversation, create the illustration of a collectible esports sticker (like a Panini album), all in ONE consistent style:
- Portrait 2:3, one character in action. Follow the camera framing of each prompt exactly; never default to a static centered front view.
- Style: bold graphic anime trading-card illustration, thick black ink outlines, cel shading, halftone dot texture, energetic Japanese ink brush splashes, glowing effects. Flattering and cool. Not a photo.
- Colors: the palette given in each prompt dominates; the background shows the game's universe, simplified and readable; always a few lacquer-red (#C22E28) brush accents.
- Clothing: black club hoodie or jacket with red details, unless the prompt says otherwise.
- Layout: head and main action in the upper two thirds. The bottom third and the two top corners stay simple, because a name banner, a crest and a number are added on top later.
- Likeness: when I attach a photo, use it as the likeness reference (hair color, length and style, face shape, facial hair, build), face visible in a stylized anime way, at least three-quarter view. When there is NO photo, keep the face hidden by shadow, hair, the angle or the pose, never invent a detailed face.
- Each prompt includes one hidden personal detail: show it clearly but naturally.
- Never: text, letters, numbers, logos, masks, real game characters (champions, agents, cartoon characters).
Reply "OK" and wait.
```

---

## Fiches personnes (pour info, déjà intégrées aux prompts)

| Personne | Physique | Clin d'œil |
|---|---|---|
| AlphA (Lye) 🟢 | cheveux blonds mi-longs coiffés sur le côté, fine moustache et barbe légère, mince, chaîne fine, casque noir et rouge à micro, mitaines | études de cinéma : pellicule, clap, caméra |
| Jakpot 🟢 | blond, chignon, barbe courte, athlétique, surchemise crème manches retroussées sur t-shirt blanc | « le métronome de l'équipe » |
| Pablito ⚪ | — | sa photo de profil Patrick : étoile de mer rose, short vert à fleurs |
| Sheep ⚪ | cheveux bouclés « laine », baskets montantes rouges | adore les moutons |
| Daynalox 🟢 | longs cheveux ondulés blond vénitien détachés, mince | Pokémon (capsule rouge et blanche) et Yasuo (vent, épée à un tranchant) |
| Yasunaii (Yuzuctus) 🟢 | **homme**, cheveux bruns épais ébouriffés relevés, yeux clairs, barbe de quelques jours, carrure solide, t-shirt bleu | Yuzuctus = yuzu + cactus, code ses outils osu! |
| Slazen ⚪ | cheveux très courts, casque | vit en Martinique, fan de Karmine Corp |
| Sebla ⚪ | chemise blanche, toujours bras croisés | très professionnel |
| Les autres ⚪ | silhouette inventée | aucun (dis-moi si tu en trouves) |

---

## Rocket League · Γ Gamma — bleu électrique

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 01 | `rl-gamma-1.png` | AlphA 🟢 | `Use the attached photo for likeness: young man, medium swept blond hair, thin mustache and light beard, slim, black and red gaming headset with boom mic, fingerless gloves. Rocket League, palette electric blue #1450D6 with white and cyan, red accents. Framing: dynamic three-quarter view in mid-air, steering an aerial, a car flying past with a crackling blue lightning boost trail. Hidden detail: the lightning trail turns into a glowing film strip with frames.` |
| 02 | `rl-gamma-2.png` | Jakpot 🟢 | `Use the attached photo for likeness: young man, blond hair tied in a man bun, short beard, athletic, cream overshirt with rolled sleeves over a white t-shirt. Rocket League goalkeeper, palette electric blue #1450D6 with white and cyan, red accents. Framing: low angle, arms spread wide in front of the goal, a hexagonal electric force field crackling as the giant ball slams into it. Hidden detail: a wooden metronome is embedded in the goal post, its glowing pendulum swinging.` |
| 03 | `rl-gamma-3.png` | Pablito ⚪ | `No photo, face hidden by the angle and shadow. Young man, short dark hair, sporty build. Rocket League kickoff, palette electric blue #1450D6 with white and cyan, red accents. Framing: crouched low, one fist on the ground, blue lightning bursting from the impact, a car charging behind. Hidden details: a chubby pink starfish plush (generic, not a cartoon character) clipped to his belt, and green shorts with a light flower pattern.` |

## Rocket League · Ε Epsilon — orange feu

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 04 | `rl-epsilon-1.png` | Sheep ⚪ | `No photo, face hidden by his curly hair and the angle. Young man with very fluffy curly hair like wool, red high-top sneakers. Rocket League, palette blazing orange #FF7A18 with black and hot yellow, red accents. Framing: low angle, sitting on the arena wall, balancing the ball on one finger, fire trails orbiting it. Hidden detail: a small sheep plush hanging from his hoodie zipper.` |
| 05 | `rl-epsilon-2.png` | kagaho42 ⚪ | `No photo, face hidden in shadow. Young man, short wavy hair, cargo pants, wristband. Rocket League, palette blazing orange #FF7A18 with black and hot yellow, red accents. Framing: low angle, walking calmly toward the viewer out of a fiery car demolition explosion, debris and sparks flying.` |
| 06 | `rl-epsilon-3.png` | Godlezz ⚪ | `No photo, face hidden by the angle. Young man, spiky short hair, sleeveless hoodie, taped fingers. Rocket League, palette blazing orange #FF7A18 with black and hot yellow, red accents. Framing: dramatic side view in a powerful kicking-through pose, the ball blasting away like a flaming comet with long speed lines.` |

## League of Legends — teal et or

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 07 | `lol-top.png` | SaulPleureur ⚪ | `No photo, face hidden in shadow. Broad-shouldered young man, short undercut, torn red cape. League of Legends top lane, palette dark teal #0A2B36 and #0F5F6B with gold, red accents. Framing: extreme low angle from the ground, planting a huge fantasy greatsword into cracked stone, teal and gold shockwave. Background: river and jungle walls of a fantasy arena at dusk.` |
| 08 | `lol-jungle.png` | Nephione ⚪ | `No photo, face hidden. Young person with a long braid and a fur-trimmed collar. League of Legends jungle, palette dark teal and gold, red accents. Framing: seen from above and behind, leaping between dark trees toward a glowing monster camp, curved claw blades in both hands. Background: misty magical jungle with gold fireflies.` |
| 09 | `lol-mid.png` | Daynalox 🟢 | `Use the attached photo for likeness: young man, long wavy strawberry-blond hair worn loose, slim face and build. League of Legends mid lane, palette dark teal and gold, red accents. Framing: three-quarter view, a single-edged sword in one hand, the other unleashing a swirling TORNADO of wind and teal energy forward, hair whipped by the wind. Background: ruined stone lane. Hidden detail: a red and white capsule ball charm hanging from his belt.` |
| 10 | `lol-adc.png` | Lokleyy ⚪ | `No photo, face hidden by the angle. Young person with a high ponytail and an asymmetric jacket. League of Legends marksman, palette dark teal and gold, red accents. Framing: over-the-shoulder from behind, aiming an ornate hextech rifle down a long lane, bright gold muzzle flash. Background: an enemy turret glowing in the distance.` |
| 11 | `lol-support.png` | KON aurel1003 ⚪ | `No photo, face hidden by glinting round glasses and shadow. Young person with a hair bun and round glasses, a lantern on the belt. League of Legends support, palette dark teal and gold, red accents. Framing: kneeling in front of two small silhouetted allies, raising a large golden dome shield that blocks incoming magic bolts. Background: night battlefield.` |

## Valorant — rouge et marine

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 12 | `valo-duelliste.png` | AlphA 🟢 | `Use the attached photo for likeness: young man, medium swept blond hair, thin mustache and light beard, slim, black and red gaming headset, fingerless gloves. Valorant duelist, palette red #FF4655 and navy #0F1923, red accents. Framing: dashing toward the viewer on a sunlit tactical map, a blade of red light in one hand, motion streaks. Hidden detail: a film clapperboard strapped to his thigh like a holster.` |
| 13 | `valo-initiateur.png` | Aze ⚪ | `No photo, face hidden by the angle. Young person with big over-ear headphones and a cropped bomber jacket. Valorant initiator, palette red #FF4655 and navy, red accents. Framing: crouched behind a crate seen from the side, launching a small recon drone, radar rings pulsing across the wall. Background: sunlit geometric site.` |
| 14 | `valo-controleur.png` | Any ⚪ | `No photo, face hidden by long straight hair. Young person in a long coat. Valorant controller, palette red #FF4655 and navy, red accents. Framing: high angle from above, standing calm in the middle of a map, hands open, three huge red smoke spheres rising around.` |
| 15 | `valo-sentinelle.png` | Wazeerx7 ⚪ | `No photo, seen from behind. Young person in a beanie and a tactical vest over the hoodie. Valorant sentinel, palette red #FF4655 and navy, red accents. Framing: from behind, holding an angle at a doorway with a rifle, a deployable turret on the ground and a glowing tripwire across the passage.` |
| 16 | `valo-flex.png` | Weyz ⚪ | `No photo, face hidden in shadow. Young man with short twists, sleeveless jacket over a long-sleeve shirt. Valorant flex, palette red #FF4655 and navy, red accents. Framing: low angle, mid-jump over a wall, rifle in one hand, the other trailing three different glowing abilities (smoke, flash, dash streak). Background: open sky and a site below.` |

## osu! — rose et prune

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 17 | `osu-1.png` | Yasunaii 🟢 | `Use the attached photo for likeness: a young MAN, thick messy dark brown hair swept up, light eyes, light stubble, solid build, blue t-shirt. osu! rhythm game, palette pink #FF66AA and plum #5B1A4A, red accents. Framing: three-quarter side view at his desk, pen tablet in hand, focused, pink hit circles and sliders exploding out of the screen. Hidden details: a small potted cactus and a yellow yuzu citrus on the desk, a second monitor showing lines of code.` |
| 18 | `osu-2.png` | Sheep ⚪ | `No photo, face hidden by his curly hair. Young man with very fluffy curly hair like wool, headphones, red high-top sneakers. osu! rhythm game, palette pink #FF66AA and plum, red accents. Framing: side view, jumping in sync with the beat, giant pink hit circles bursting around. Hidden detail: one of the hit circles is a fluffy round sheep.` |

## Staff — couleur du pôle + liseré or

Ajoute à chaque prompt staff : le fond a **un fin liseré or** en diagonale (c'est la marque « édition staff »).

| # | Fichier | Qui | Prompt |
|---|---|---|---|
| 19 | `staff-fondateur-1.png` | Jakpot 🟢 | `STAFF CARD with one thin gold diagonal line. Use the attached photo for likeness: young man, blond hair in a man bun, short beard, cream overshirt with rolled sleeves over a white t-shirt. Founder, graphic designer, Rocket League manager, palette blue #1450D6 and black. Framing: over-the-shoulder three-quarter view, drawing a sticker card on a graphic tablet. Hidden detail: a wooden metronome ticking on the desk, pendulum glowing red.` |
| 20 | `staff-fondateur-2.png` | AlphA 🟢 | `STAFF CARD with one thin gold diagonal line. Use the attached photo for likeness: young man, medium swept blond hair, thin mustache and light beard, slim, thin chain necklace. Founder and Valorant manager, palette red #FF4655 and black. Framing: low angle, standing like a film director next to a cinema camera on a tripod, one hand raised giving the "action" signal, a tactical map hologram behind.` |
| 21 | `staff-fondateur-3.png` | Yasunaii 🟢 | `STAFF CARD with one thin gold diagonal line. Use the attached photo for likeness: a young MAN, thick messy dark brown hair swept up, light eyes, light stubble, solid build. Founder, caster, community manager, osu! manager, palette pink #FF66AA and black. Framing: close three-quarter profile, leaning into a studio microphone on a boom arm, mouth open mid-cast, closed-back headphones. Hidden detail: a tiny cactus sticker on the pop filter and yuzu slices floating in the sound waves.` |
| 22 | `staff-fondateur-4.png` | Sheep ⚪ | `STAFF CARD with one thin gold diagonal line. No photo, face hidden by his curly hair. Young man with very fluffy curly hair like wool, oversized hoodie, red high-top sneakers. Founder, palette orange #FF7A18 and black. Framing: full body, sitting relaxed on top of a giant Rocket League ball, controller in hand. Hidden detail: small sheep ears on his hood and a little sheep sitting next to him.` |
| 23 | `staff-coach-1.png` | Sebla ⚪ | `STAFF CARD with one thin gold diagonal line. No photo, face partly in shadow. Rocket League coach, palette blue #1450D6 and black. Clothing: a crisp white button-up shirt, NOT a hoodie, neat short hair. Framing: three-quarter view, standing very straight in front of a whiteboard showing a pitch with circles and arrows, ARMS CROSSED, calm and serious. Hidden detail: markers perfectly aligned by color on the board ledge.` |
| 24 | `staff-coach-2.png` | Slazen ⚪ | `STAFF CARD with one thin gold diagonal line. No photo, seen from behind. Young man with a buzz cut and a headset. Rocket League coach, palette orange #FF7A18 and black. Framing: from behind in a gaming chair, facing two screens showing a replay with a dotted car trajectory, pointing at a screen. Hidden details: through the window behind the screens, palm trees and a Caribbean sunset sea; a plain navy blue supporter scarf (no logo) over the chair.` |
| 25 | `staff-coach-3.png` | kraskas ⚪ | `STAFF CARD with one thin gold diagonal line. No photo, face hidden by hair. Young man with a short bun, rolled-up sleeves, a wristwatch. League of Legends coach, palette teal #0F5F6B and black. Framing: top-down view, leaning over a glowing tabletop map with three lanes, placing a small chess-like piece.` |
| 26 | `staff-moderateur-1.png` | Daynalox 🟢 | `STAFF CARD with one thin gold diagonal line. Use the attached photo for likeness: young man, long wavy strawberry-blond hair loose, slim. Moderator and League of Legends manager, palette teal #0A2B36 and black. Framing: dynamic step forward, raising a swirling wall of WIND that blocks incoming empty chat bubbles, hair flowing. Hidden detail: a red and white capsule ball spinning in his other hand.` |
| 27 | `staff-moderateur-2.png` | Neyzo ⚪ | `STAFF CARD with one thin gold diagonal line. No photo, eyes hidden by round tinted glasses. Young man with slicked-back hair and a thin chain. Moderator, palette lacquer red #C22E28 and black. Framing: close-up from the chest up, arms crossed, head slightly tilted, a column of small empty chat bubbles behind, some stamped with a red check mark.` |

---

## Bannières des jeux (page Effectif) — paysage 1536 × 1024

| Fichier | Prompt |
|---|---|
| `pole-rocket-league.png` | `GAME BANNER, landscape, no character card layout. Rocket League stadium at night seen from above the goal line, two cars clashing mid-air around the ball, one with blue lightning boost, one with orange fire boost. Lacquer-red brush accents in the corners. No text, logos or UI.` |
| `pole-lol.png` | `GAME BANNER, landscape. League of Legends: the river crossing of a fantasy arena at dusk, teal water, gold magic light, ancient ruins, a turret glowing in the distance, clear and readable, no champions. A few red brush strokes. No text, logos or UI.` |
| `pole-valorant.png` | `GAME BANNER, landscape. Valorant: a clean sunlit tactical map site, geometric architecture, boxes and long shadows, a spike-like device glowing red on the ground, no agents. Thin red neon accents. No text, logos or UI.` |
| `pole-osu.png` | `GAME BANNER, landscape. osu!: an abstract dark stage of glowing pink hit circles, sliders and approach rings flowing in rhythm, soft cherry blossom petals. Red brush accents. No text, logos or UI.` |
