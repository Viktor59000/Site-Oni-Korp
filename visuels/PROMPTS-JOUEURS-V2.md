# Vignettes joueurs v2 — LoL, Valorant, osu!

## Pourquoi les refaire

Avec le staff et les rosters RL, l'album a maintenant **deux générations** côte à côte :
- **v2 (RL, staff)** : une action par carte, cadrages variés (contre-plongée, de dos, vue du dessus…), l'univers du jeu en fond, une silhouette propre à chacun.
- **v1 (LoL, Valorant, osu!)** : le même personnage encapuchonné, à mi-corps, de face, au centre, sur 12 cartes. Seuls l'arme et la couleur changent.

Sur la page, ça se voit : RL et staff vivent, LoL, Valo et osu! paraissent figés. Ces 12 prompts alignent tout l'album sur la v2.

## Ce qui rend la v2 cohérente

- **Le jeu d'abord** : sa palette domine et son univers est en fond (Faille de l'invocateur, sites Valorant, cercles osu!), avec des touches de rouge Oni.
- **Une action par rôle**, avec un cadrage différent pour chaque carte d'un même jeu.
- **Les joueurs qui ont plusieurs cartes gardent leur silhouette** : AlphA (casquette à l'envers, gants mitaines), Daynalox (capuche et écharpe teal), Yasunaii (queue de cheval, casque de studio), Sheep (cheveux bouclés, baskets rouges). On les reconnaît d'une page à l'autre.
- **Les autres ont une silhouette inventée et neutre.** Comme pour le staff, donne-moi un vrai détail par joueur et je l'ajoute.

## Mode d'emploi

1. Nouvelle conversation ChatGPT. Colle le bloc « Style commun » de `PROMPTS.md`, puis le bloc « Album v2 » ci-dessous.
2. Colle les 12 prompts, format **portrait (1024 × 1536)**.
3. Range-les dans `site/visuels/a-integrer/` avec **exactement** ces noms : ils remplacent les anciens.

---

## Bloc « Album v2 » (à coller une fois)

```
ALBUM V2. For the next images, create illustrations for collectible esports stickers, in the same style as a series:
- Portrait 2:3, one character IN ACTION. Each prompt gives a specific camera framing and pose: follow it exactly. Never default to a centered, static, waist-up front view.
- Style: bold graphic illustration, thick black ink outlines, cel shading, halftone texture, energetic brush splashes, glowing effects. Like a modern anime trading card, not a photo.
- The game's own colors dominate and its universe appears in the background (simplified, readable), with a few lacquer-red Oni accents.
- The bottom third and the two top corners must stay readable but not crucial: a name banner, a crest and a number will be added on top. Keep the head and the main action in the upper two thirds.
- Each character has the DISTINCT SILHOUETTE given in the prompt. Clothing: black club hoodie or jacket with red details, varied cuts. Hood only when the prompt says hood.
- Face anonymous: hidden by shadow, the angle, hair, a cap or the pose. No masks.
- No readable text, no numbers, no logos, no real game characters (no champions, no agents).
Reply "OK".
```

---

## League of Legends — teal `#0A2B36` / `#0F5F6B`, or et magie hextech

| Fichier | Joueur | Prompt |
|---|---|---|
| `lol-top.png` | SaulPleureur | `ALBUM V2. League of Legends top lane. Framing: low angle from the ground, the character planting a huge fantasy greatsword into cracked stone, shockwave of teal and gold light rising. Silhouette: broad shoulders, short undercut hair, a torn red cape. Background: the river and jungle walls of a fantasy arena at dusk.` |
| `lol-jungle.png` | Nephione | `ALBUM V2. League of Legends jungle. Framing: seen from above and behind, the character leaping between dark trees toward a glowing monster camp below, curved claw blades in both hands. Silhouette: long braid, fur-trimmed collar. Background: dense magical jungle with teal mist and gold fireflies.` |
| `lol-mid.png` | Daynalox | `ALBUM V2. League of Legends mid lane. Framing: three-quarter view, the character casting, one arm extended, a swirling orb of arcane teal and gold energy exploding forward. Silhouette: hood UP with a long teal scarf flowing (same person as the staff card). Background: a stone lane with crumbling turret ruins.` |
| `lol-adc.png` | Lokleyy | `ALBUM V2. League of Legends marksman. Framing: over-the-shoulder view from behind, aiming an ornate hextech rifle down a long lane, a bright gold muzzle flash and bullet trail. Silhouette: high ponytail, asymmetric jacket with one long sleeve. Background: distant enemy turret glowing.` |
| `lol-support.png` | KON aurel1003 | `ALBUM V2. League of Legends support. Framing: wide shot, the character kneeling in front of two small silhouetted allies, raising a large dome shield of golden light that blocks incoming magic bolts. Silhouette: round glasses glinting, a lantern on the belt. Background: night battlefield with teal sparks.` |

## Valorant — rouge `#FF4655` / marine `#0F1923`, géométrie nette

| Fichier | Joueur | Prompt |
|---|---|---|
| `valo-duelliste.png` | AlphA | `ALBUM V2. Valorant duelist. Framing: dynamic diagonal, the character dashing toward the viewer through a burst of shattered red energy, a blade of light in one hand, motion streaks. Silhouette: backwards cap, fingerless gloves, short tactical jacket (same person as the staff card). Background: a sunlit tactical map corridor with sharp shadows.` |
| `valo-initiateur.png` | Aze | `ALBUM V2. Valorant initiator. Framing: crouched behind a crate, seen from the side, launching a small recon drone that flies up out of frame, radar rings pulsing across the wall. Silhouette: big over-ear headset, a cropped bomber jacket. Background: a clean geometric site with boxes.` |
| `valo-controleur.png` | Any | `ALBUM V2. Valorant controller. Framing: high angle looking down, the character standing calm in the middle of a map, hands open, three huge red smoke spheres rising around them and blocking the view. Silhouette: long straight hair over the face, a long coat. Background: rooftops seen from above.` |
| `valo-sentinelle.png` | Wazeerx7 | `ALBUM V2. Valorant sentinel. Framing: seen from behind, holding an angle at a doorway with a rifle, a deployable turret on the ground and a glowing tripwire across the passage. Silhouette: beanie, tactical vest over the hoodie. Background: a narrow corridor with red emergency lights.` |
| `valo-flex.png` | Weyz | `ALBUM V2. Valorant flex player. Framing: low angle, mid-jump over a wall, rifle in one hand, the other hand trailing three different glowing abilities (smoke, flash, dash streak). Silhouette: short twists hairstyle, sleeveless jacket over a long-sleeve shirt. Background: open sky and a spike site below.` |

## osu! — rose `#FF66AA` / prune `#5B1A4A`, cercles et rythme

| Fichier | Joueur | Prompt |
|---|---|---|
| `osu-1.png` | Yasunaii | `ALBUM V2. osu! rhythm player. Framing: top-down view of the character's desk, both hands on a pen tablet and a two-key keypad, a storm of pink hit circles, sliders and approach rings exploding out of the screen. Silhouette: high ponytail, closed-back studio headphones (same person as the staff card). Background: dark room lit pink by the monitor.` |
| `osu-2.png` | Sheep | `ALBUM V2. osu! rhythm player. Framing: side view, the character jumping in sync with the beat, headphones on, giant pink hit circles bursting around like fireworks, one circle cut by the motion. Silhouette: fluffy curly hair, red sneakers (same person as the staff card). Background: abstract stage of glowing pink rings.` |
