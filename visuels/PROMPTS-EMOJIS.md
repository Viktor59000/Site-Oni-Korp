# Émojis du serveur · 12 icônes dans la DA Oni Korp

**But :** un jeu d'émojis cohérent, lisible à 22 px, aux couleurs du club. Ils remplacent les émojis dessinés à la main (trophée, booster, hanko) et en ajoutent d'utiles au bot et au serveur.

## Méthode (différente de l'album)

- **Une seule conversation pour les 12**, pour garder exactement le même style. Pas besoin de références jointes.
- Colle d'abord le **bloc Style**, attends « OK », puis les prompts un par un.
- Format **carré 1024 × 1024, fond transparent** (si l'arrière-plan sort en blanc, demande « make the background transparent »).
- Range les images dans `site/visuels/emojis/` sous le nom indiqué (`trophee.png`, etc.). Je les recadre et les prépare pour Discord (128 px), puis je mets à jour le script.

## Bloc Style (à coller en premier)

```
ONI KORP EMOJI SET. For every image in this conversation, create ONE emoji icon in exactly the same style:
- A single bold object, centered, filling about 85% of the square, readable at 22 pixels.
- Flat sticker style: thick confident black outline, large flat color shapes, at most 2 small highlight shapes, NO gradients, NO texture, NO halftone, NO tiny details, NO text, NO letters, NO numbers.
- Palette ONLY: vermilion red #E5251F, black #0A0A0A, off-white #F3F1EC, gold #E2BD62 (and the extra accent color only if the prompt gives one).
- Slightly angular, sharp Japanese-inspired shapes (oni club identity), no cute kawaii faces.
- Square 1:1, TRANSPARENT background, no shadow, no frame, no border around the icon.
Reply "OK".
```

## Les 12 icônes

| Fichier | Prompt | Sert à |
|---|---|---|
| `trophee.png` | `A trophy cup in gold with black outline, two small vermilion oni horns rising from its rim, black base.` | inhouses, classements, victoires |
| `booster.png` | `A sealed trading card booster pack, black foil with a jagged torn top edge, one vermilion diagonal band, a small off-white shield emblem in the center (plain shape, no letters).` | album et boosters |
| `hanko.png` | `A Japanese hanko seal stamp print: a vermilion rounded square with a bold off-white abstract brush mark inside (no readable character), slightly rough edges like real ink.` | officiel, validé |
| `masque.png` | `A front-facing black oni mask with two vermilion horns, off-white fangs and eye slits, simple and bold.` | rôles, accueil, réactions |
| `victoire.png` | `A bold upward vermilion arrow breaking through a black jagged shard, a small gold spark at its tip.` | victoire |
| `defaite.png` | `A cracked black shield split in two by a jagged off-white crack, a small vermilion drop.` | défaite |
| `versus.png` | `Two crossed katana blades, black blades with off-white edges and vermilion handles, forming an X.` | matchs, inhouses |
| `live.png` | `A vermilion circular broadcast signal: a solid dot with two curved waves on each side, black outline.` | lives, Twitch |
| `present.png` | `A bold check mark drawn as a single thick brush stroke in vermilion with black outline.` | « présent » aux séances |
| `absent.png` | `A bold X drawn as two thick brush strokes in black with off-white highlight.` | « absent » |
| `peut_etre.png` | `A bold question mark drawn as a thick brush stroke in gold with black outline.` | « peut-être » |
| `recrutement.png` | `A black oni mask with vermilion horns and a small off-white plus sign badge at its bottom right corner.` | recrutement, nouveaux membres |

Une fois les 12 déposés : le serveur aura 39 émojis (sur 50), tous dans le même style que le logo.
