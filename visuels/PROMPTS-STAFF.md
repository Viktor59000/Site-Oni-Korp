# Vignettes staff v2 — 9 portraits qui ne se ressemblent plus

## Pourquoi elles se ressemblent aujourd'hui

Les 9 vignettes staff cumulent tout ce qui est commun et rien de ce qui distingue :
- **même palette** pour tous (noir, rouge, or), alors que les joueurs ont la couleur de leur jeu ;
- **même cadrage** (personnage à mi-corps, de face, centré) ;
- **même silhouette** (capuche, visage dans l'ombre, même maillot) ;
- **même fond** chargé d'ornements dorés.

## La solution : trois leviers, une seule règle commune

1. **La couleur du pôle de la personne**, en accent par-dessus la base noir et rouge : bleu et orange pour les gens de Rocket League, teal pour LoL, rouge Valorant, rose osu!. On voit d'un coup d'œil à quel jeu chacun est rattaché.
2. **Un cadrage différent par carte** : de dos, de profil, en contre-plongée, assis, en gros plan…
3. **Une silhouette reconnaissable** : casque, casquette, lunettes, coiffure, accessoire. Les visages restent anonymes, donc c'est la silhouette qui fait la personne.

Ce qui reste commun, et suffit à faire une série : le trait encré, la trame, le fond en deux couleurs coupé en diagonale, et un **liseré or** (je l'ajoute aussi en code : c'est la marque « édition staff »).

> **Bonus si tu veux :** donne-moi **un vrai détail par personne** (lunettes, cheveux longs, casquette, toujours un casque sur la tête, sa couleur préférée…). Je l'intègre aux prompts et chacun se reconnaîtra dans sa vignette. Sans ça, j'ai inventé des détails neutres ci-dessous.

## Mode d'emploi

1. Nouvelle conversation ChatGPT. Colle le bloc « Style commun » de `PROMPTS.md`, puis **le bloc « Édition staff » ci-dessous** (et pas le bloc « album Panini »).
2. Colle les 9 prompts un par un, format **portrait (1024 × 1536)**.
3. Range les images dans `site/visuels/a-integrer/` avec **exactement** les noms indiqués : elles remplacent les anciennes sans rien changer d'autre.

---

## Bloc « Édition staff » (à coller une fois)

```
STAFF EDITION. For the next images, create illustrations for collectible esports stickers of a club's STAFF. Same art style for all, but every card must look clearly different from the others:
- Portrait 2:3, one character. Each prompt gives a DIFFERENT camera framing and pose: follow it exactly. Do not default to a centered waist-up front view.
- Style: bold graphic illustration, thick black ink outlines, flat cel shading, halftone dot texture, a few red Japanese ink brush splashes. Like a modern anime trading card, not a photo.
- Background: a flat two-color diagonal split, base black #141414 with the ACCENT COLOR given in each prompt, plus one thin gold line. No ornaments, no crowns, no patterns, no scenery unless the prompt asks for one simple object.
- The bottom third and the two top corners stay simple (only background): a name banner, a crest and a number will be added on top. Keep the head in the upper half.
- Each character has a DISTINCT SILHOUETTE given in the prompt (headwear, hair, glasses, accessory). Clothing: black club hoodie or jacket with red details, varied cuts.
- Face anonymous: hidden by shadow, the pose, the framing, a cap or headphones. No masks, no hoods on everyone (only when the prompt says hood).
- No readable text, no numbers, no logos anywhere.
Reply "OK".
```

---

## Les 9 prompts

| Fichier | Qui | Prompt |
|---|---|---|
| `staff-fondateur-1.png` | Jakpot (fondateur, graphiste, manager RL) | `STAFF EDITION. Accent color: Rocket League blue #1450D6 with a touch of orange #FF7A18. Framing: over-the-shoulder view from behind and slightly above, the character drawing on a large graphic tablet resting on their knees. Silhouette: short messy hair, big over-ear headphones around the neck, stylus in hand. On the tablet screen, a rough sketch of a sticker card (no text).` |
| `staff-fondateur-2.png` | AlphA (fondateur, manager Valorant) | `STAFF EDITION. Accent color: Valorant red #FF4655 with navy #0F1923. Framing: strong low-angle shot from below, character standing tall, looking down toward the viewer, one hand raised giving a tactical signal. Silhouette: backwards cap, fingerless gloves, a short tactical jacket. A minimalist holographic map with three arrows floats behind (no text).` |
| `staff-fondateur-3.png` | Yasunaii (fondateur, casteur, community manager, manager osu!) | `STAFF EDITION. Accent color: osu! pink #FF66AA with plum #5B1A4A. Framing: close-up bust in three-quarter profile, leaning into a studio microphone on a boom arm, mouth open mid-sentence. Silhouette: long hair tied in a high ponytail, closed-back studio headphones, small round earrings. Pink hit circles and sound waves burst from the microphone.` |
| `staff-fondateur-4.png` | Sheep (fondateur, joueur RL et osu!) | `STAFF EDITION. Accent color: Rocket League orange #FF7A18 with a touch of blue #1450D6. Framing: full body, sitting relaxed on top of a big floating match ball, one leg hanging, controller in hand. Silhouette: fluffy curly hair, oversized hoodie with the hood DOWN, sneakers. A thin red boost trail curves around the ball.` |
| `staff-coach-1.png` | Sebla (coach RL) | `STAFF EDITION. Accent color: Rocket League blue #1450D6. Framing: side profile, character standing at a whiteboard, drawing a play with a marker, the other hand in the pocket. Silhouette: beanie hat, glasses, a whistle on a cord. The whiteboard shows a simple top-down pitch with three circles and arrows (no text).` |
| `staff-coach-2.png` | Slazen (coach RL) | `STAFF EDITION. Accent color: Rocket League orange #FF7A18. Framing: seen from behind, sitting in a gaming chair facing two screens, turning the head slightly to the side, one arm pointing at a screen. Silhouette: short buzz cut, thin over-ear headset. The screens show a replay with a dotted car trajectory (no text).` |
| `staff-coach-3.png` | kraskas (coach LoL) | `STAFF EDITION. Accent color: League of Legends teal #0F5F6B with gold. Framing: top-down view looking at the character leaning over a glowing tabletop map with three lanes, both hands on the table, placing a small chess-like piece. Silhouette: hair in a short bun, rolled-up sleeves, a wristwatch.` |
| `staff-moderateur-1.png` | Daynalox (modérateur, manager LoL, joueur mid) | `STAFF EDITION. Accent color: League of Legends teal #0A2B36 and #0F5F6B with gold. Framing: dynamic action pose, three-quarter view, character stepping forward and raising a round glowing shield of light in front of the body. Silhouette: hooded cloak (hood UP), a long scarf flowing behind. Small empty chat bubbles bounce off the shield (no text).` |
| `staff-moderateur-2.png` | Neyzo (modérateur) | `STAFF EDITION. Accent color: deep Oni red #C22E28 with gold. Framing: calm close-up, character seen from the chest up with arms crossed, head slightly tilted, eyes hidden by tinted glasses. Silhouette: slicked-back hair, round tinted glasses, a simple chain necklace. Behind, a column of small empty chat bubbles, a few of them stamped with a red check mark.` |

---

## Côté site (je m'en occupe à l'arrivée des images)

- Le cadre des vignettes staff prend un **liseré or** et le fond de bandeau reprend la **couleur du pôle** de la personne, comme les joueurs.
- Je vérifie que rien d'important ne tombe sous le bandeau du pseudo ou sous l'écusson.
