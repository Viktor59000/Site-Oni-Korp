# Album Oni Korp · style 1 (Persona masqué) · les 27 vignettes · v2 simplifiée

**Style validé : l'essai 1** (`a-integrer/test/combo-1.webp`). Les noms de fichiers ne changent pas.

## Pourquoi la première carte est partie en vrille

L'essai 1 marchait parce qu'il était **simple** : un personnage en demi-buste qui prend la moitié de l'image, une seule pose calme, un seul symbole, et de grands aplats (tout le bas est rouge uni).

La v1 de ce fichier faisait l'inverse :
- **Trop d'éléments par carte.** La carte 01 en avait huit : capuche à oreilles, pinces, casque, mitaines, graffiti, cristal, voiture, éclairs. 4o veut tous les caser, et ça donne du bruit.
- **« Le symbole forme les éclats »** et **« jamais de pose statique ».** Résultat : tout le décor explose, le personnage est tordu dans un coin et il n'y a plus de point focal.
- **Le rouge du décor écrase l'accent.** Sur la carte 01, on ne sent plus le bleu de Gamma.

## Ce que les essais nous ont appris (Jakpot v1, v2, v3)

Les deux préférées (`combo-1` et `v2-jakpot-02`) ont la même chose en plus que la v3 :
- **La texture :** ombres en trame de points, grain, éclaboussures, traits d'encre irréguliers. La v3 est du vectoriel lisse, la veste n'est plus qu'une tache noire.
- **L'attitude :** tête baissée ou regard de côté, pose décentrée. La v3 est figée, symétrique, bras écartés face caméra.
- **Le symbole intégré :** il est coupé par le cadre et passe derrière le personnage. Dans la v3, le métronome fait icône collée au centre.

J'avais interdit la trame de points dans la v2 du bloc Style : c'était une erreur, elle est maintenant demandée.

## Avancement

- **Reprise de zéro le 05/10/2026** avec les règles finales : 4 encres, fond abstrait, pas de bande en bas, masques uniques, Valorant avec le rouge rare.
- Les essais précédents restent dans `a-integrer/` et `a-integrer/test/` pour comparer ; les nouvelles images les remplaceront.
- **Epsilon (04-06) : fait** avec la nouvelle méthode (projet, une conversation par carte). Godlezz : retoucher le logo sur la basket.
- **Valorant (12-16) et osu! (17-18) : faits.** Yuzu : deux versions de la 17 (personnage `osu-1.webp`, objet `osu-1-variante-objet.webp`), à faire choisir par Yuzu.
- **Jakpot (02 et 19) :** le métronome est remplacé par le metal (02) et une aura façon Dragon Ball (19).
- **LoL (07-11) : fait** avec la nouvelle méthode.
- Rôles LoL : aurel est ADC, Lokleyy support.
- **Champions et agents :** on reprend leurs motifs, jamais le personnage ; les prompts ne citent aucun nom.

## Plus de bande rouge en bas (après Valorant v1)

Toutes les cartes Valorant avaient le même grand bloc rouge en bas, et comme leur couleur de pôle est aussi rouge, tout se confondait. Or le site pose déjà **son propre bandeau noir** avec le pseudo sur le bas de la vignette : la bande rouge de l'image ne sert à rien. Le bloc Style ne la demande plus. L'illustration descend jusqu'en bas. **On refait tout l'album de zéro avec ces règles.**

Pour Valorant, le rouge devient **rare** : il est réservé au symbole géant et à quelques détails, et le reste joue sur le crème et le noir.

## La règle des 3 couleurs (pourquoi les LoL v2 ont « changé de style »)

Les cartes RL tiennent sur **4 encres seulement** : papier crème, noir, la couleur du pôle, et le rouge (détails). Le décor est **abstrait** : éclats noirs sur papier et symbole géant. Les LoL v2 avaient dérivé parce que mes prompts ajoutaient des **décors** (forêt de nuit, rideau de théâtre, ciel) et des **couleurs en plus** (violet, vert citron, jade, or), et la bande du bas était passée en turquoise.

Le bloc Style impose maintenant les 4 encres, et un fond toujours abstrait. Les masques se distinguent par leur **forme** et par la façon de répartir les 4 encres : crème (Saul), noir à cornes crème (Nephione), hannya crème et rouge (Daynalox), turquoise uni (Lokleyy), laque rouge (KON). **Exception voulue :** la carte staff de Yuzu (21) remplace le rouge par ses couleurs, vert et jaune.

## Masques : chacun le sien

Les essais LoL avaient tous le même masque (noir, cornes, crocs, yeux turquoise lumineux), parce que 4o retombe sur son masque oni par défaut. Chaque masque a maintenant **sa forme, son expression et sa répartition des 4 encres** imposées (voir le tableau des fiches).

**LoL : on régénère les 5 cartes** avec la règle des 4 encres. Chaque carte garde un cadrage différent : Saul de face, Nephione en plongée, Daynalox de profil en pirouette, Lokleyy en gros plan, KON assis de face.

Pour une carte réussie sauf le masque (autres pôles), retouche seulement le masque, comme pour Sheep :

```
Edit this image: keep EVERYTHING identical (pose, colors, background, texture, clothes) and change ONLY the mask: [colle ici la ligne « Mask: » de la carte]
```

## La recette validée (carte 02, Jakpot)

Le personnage en demi-buste devant, et **son symbole en géant derrière lui**, en aplat de la couleur du pôle, comme un monument. Toutes les cartes suivent maintenant ce modèle, avec un objet emblématique par personne (métronome, cristal, étoile de mer, tête de bélier, caméra…). Un objet se reconnaît mieux qu'une forme abstraite : c'est pour ça que la tache de peinture d'AlphA marchait moins bien.

## Les nouvelles règles

- **Une carte = un personnage + une pose + un symbole.** Trois ou quatre détails physiques au maximum.
- **Cadrage différent à chaque carte** (voir le tableau des poses) : gros plan, demi-buste, en pied, plongée, contre-plongée, profil, de dos. Le personnage peut aussi **se servir du symbole géant** : monter dessus, s'y adosser, s'y allonger. Le mouvement passe par la pose, pas par un décor qui explose.
- **Décor en grands aplats :** quelques éclats nets, avec l'accent du pôle bien visible. Pas de bande unie en bas : le site pose son bandeau noir avec le pseudo.
- **Texture d'affiche imprimée :** ombres en trame de points (halftone), grain du papier, petites éclaboussures d'encre, bords d'éclats déchirés, traits d'encre d'épaisseur variable, vrais plis et ombres sur les vêtements. Sans ça, 4o fait du vectoriel trop propre (voir la v3 de Jakpot).
- **De l'attitude plutôt que de la pose :** tête inclinée, regard de côté ou vers le bas, une épaule en avant, éclairage latéral. Jamais de pose figée symétrique « ta-da ».
- **Le symbole est un objet géant derrière le personnage**, jamais un objet perdu dans un coin.
- **Pas de main géante tendue vers l'objectif** : les deux premiers essais l'avaient, et ça se répète vite.

## Mode d'emploi

> **Chaque prompt de carte commence maintenant par un rappel du style** (« SAME ART STYLE AS THE 2 ATTACHED IMAGES… NOT realistic »). Dans un projet, ChatGPT reformule ta demande avant de l'envoyer au générateur d'images et peut perdre le style des instructions du projet : le premier essai de Jakpot est sorti en photo réaliste. Le rappel dans le message lui-même évite ça.

1. Mets en place le **projet ChatGPT** (section « Organisation dans ChatGPT » plus bas).
2. **Une conversation par carte**, avec les 2 références jointes et le prompt de la carte, rien d'autre.
3. Commence par la **carte 02 (Jakpot)** : elle sert d'étalon. Si elle est bonne, enchaîne.
4. Range les fichiers dans `site/visuels/cartes/` avec le nom exact indiqué.
5. **N'envoie aucune autre image**, et surtout pas les photos des joueurs.

## Les poses (aucune ne se répète)

| Carte | Cadrage et pose |
|---|---|
| `rl-gamma-2.png` | contre-plongée, headbang, main en cornes du metal |
| `rl-gamma-1.png` | en pied, accroupi au sommet du cristal, vu d'en bas |
| `rl-gamma-3.png` | en pied, de profil, départ de sprinteur |
| `rl-epsilon-1.png` | vu d'en haut, allongé dans la courbe de la corne |
| `rl-epsilon-2.png` | en pied, marche vers nous, très contre-plongée |
| `rl-epsilon-3.png` | en pied, trois quarts, pied posé sur le ballon, accoudé au genou |
| `lol-top.png` | eye level, de face, en pied, sort d'un nuage de poussière  |
| `lol-jungle.png` | plongée, accroupi sur une branche |
| `lol-mid.png` | profil, en pleine pirouette |
| `lol-adc.png` | gros plan poitrine, tête penchée |
| `lol-support.png` | plan moyen, assis en tailleur, symétrique |
| `valo-duelliste.png` | de dos, regard par-dessus l'épaule, grenade de peinture en main |
| `valo-initiateur.png` | de côté, accroupi, arc bandé vers le ciel |
| `valo-controleur.png` | vue zénithale, seul au centre |
| `valo-sentinelle.png` | adossé à la caméra géante, bras croisés sous le chapeau |
| `valo-flex.png` | en plein saut, contre-plongée |
| `osu-1.png` | trois quarts, assis à califourchon sur sa chaise |
| `osu-2.png` | en pied, de profil, saut dans le rythme |
| `staff-fondateur-1.png` | trois quarts, mains en coupe qui chargent une boule d'énergie |
| `staff-fondateur-2.png` | contre-plongée, la main donne le « action » |
| `staff-fondateur-3.png` | gros plan de profil au micro |
| `staff-fondateur-4.png` | assis sur un ballon, menton sur le poing |
| `staff-coach-1.png` | de face, symétrique, bras croisés |
| `staff-coach-2.png` | gros plan, mains jointes devant le masque |
| `staff-coach-3.png` | trois quarts, pièce entre deux doigts |
| `staff-moderateur-1.png` | révérence théâtrale |
| `staff-moderateur-2.png` | accoudé à la bulle géante, ajuste ses lunettes |

## Organisation dans ChatGPT : un projet, une conversation par carte

D'après la page d'aide OpenAI sur les projets :
- **Les instructions du projet** s'appliquent à toutes ses conversations et remplacent tes instructions personnalisées globales.
- **Mémoire limitée au projet :** tes souvenirs enregistrés ne sont pas utilisés et rien ne fuit hors du projet, mais **les conversations du projet peuvent encore se référer les unes aux autres**.
- Pour qu'une conversation ne serve plus de contexte, il faut **la supprimer** (ou la sortir du projet).

Ce qui faisait se ressembler les cartes, c'est surtout d'en générer **plusieurs dans la même conversation** : chaque image copie la précédente. D'où la méthode :

### Mise en place (une fois)
1. **Nouveau projet** « Album Oni Korp ». À la création, choisis **Mémoire limitée au projet** (modifiable plus tard dans ••• > Paramètres du projet > Mémoire ; le changement peut prendre quelques heures).
2. **••• > Paramètres du projet > Instructions** : colle le bloc « Instructions du projet » ci-dessous (c'est le bloc Style adapté : pas de « OK », il génère directement).
3. **Fichiers du projet** : ajoute `reference-style-1.webp` et `reference-style-2.webp` (dossier `a-integrer/`).
4. Optionnel, pour une isolation maximale pendant la séance : Paramètres > Personnalisation > désactive « Se référer à l'historique des chats ». Je ne peux pas vérifier si ce réglage coupe aussi les références entre conversations d'un même projet ; c'est juste une précaution, réactive-le après.

### Pour chaque carte
1. **Nouvelle conversation dans le projet.** Une conversation = **une carte**.
2. Joins les **2 références** au message (les fichiers du projet ne servent pas forcément de modèle visuel à l'image) et colle **seulement le prompt de la carte**.
3. Carte réussie : enregistre-la sous son nom exact. Les retouches (« change ONLY the mask ») se font dans la même conversation.
4. **Essai raté : supprime la conversation**, sinon le projet peut s'en inspirer pour les suivantes.

### Instructions du projet (à coller dans les paramètres)
```
ONI KORP ALBUM · STYLE 1. The two reference images (attached to the first message, also in the project files) are the STYLE REFERENCES: copy their art style, texture, colors, simplicity and composition logic (not the character). For every card prompt I send, create a collectible esports card exactly like them:
- Persona 5 menu art printed like a screen-print poster: bold black silhouette, big sharp jagged black shards radiating behind the character, high contrast, no smooth gradients, no glossy 3D, not a photo.
- STRICT FOUR-INK PALETTE, like a screen print: off-white paper, black, vermilion red (#E5251F) and the ONE accent color of the prompt. NO other color anywhere (no purple, green, gold, brown, grey tints except black halftone). Only skin and hair keep their natural tones.
- BACKGROUND ALWAYS ABSTRACT like the references: off-white paper, a FEW big black jagged shards, and the giant symbol in the accent color. Leave at least a third of the background as EMPTY off-white paper (breathing space). Vermilion red is ONLY for small details on the clothes and the mask, NEVER in the background shards, so the accent color dominates the background. NO scenery: no landscape, forest, sky, clouds, moon light, room, stage, curtains or buildings.
- NO flat color band at the bottom: the illustration continues to the bottom edge (shards, smoke, clothes, ground), the character can overlap it.
- Vary the composition from card to card: the big shapes, the diagonal and the color masses must not sit at the same place every time.
- Rich print texture, NOT clean vector art (keep the heavy paper grain, halftone dots and ink splatters of the references): HALFTONE DOT shading in the shadows (on clothes, mask and skin), visible paper grain, small ink splatter specks, rough torn edges on the shards, confident brush-ink lines with varied thickness. The clothes have layered angular shadows and folds, never a single flat black blob.
- Attitude over showing off: a natural, slightly off-center pose with character, strong graphic black shadows on one side; never a stiff symmetrical "ta-da" pose unless the prompt asks for symmetry.
- ONE character, ONE clear pose, with the framing given in the prompt; the character stays big and readable. ONE GIANT personal symbol drawn as a monumental flat silhouette in the accent color, partly overlapped and cropped by the character and the shards so it never looks like a pasted clip-art icon.
- Natural hands and feet; never an oversized foreshortened hand or a leg/foot pointing at the camera.
- The face is ALWAYS completely hidden by the character's personal mask, painted only with the four inks. EVERY MASK IS UNIQUE: follow exactly its color, shape and expression; never default to a black horned mask with a fanged grimace and glowing eyes.
- Black club jacket with red details, no logo, unless the prompt says otherwise.
- Portrait 2:3, full bleed, no border.
- Never: text, letters, numbers, logos (including brand logos on sneakers), real game or series characters (no existing champion or agent: only their motifs).
Each message I send is ONE card prompt: generate ONE image directly, portrait 1024x1536, without asking questions. Never reuse the composition of another card.
```

## Couleurs (celles du site)

| Pôle | Accent |
|---|---|
| Rocket League Gamma | bleu électrique `#1450D6` |
| Rocket League Epsilon | orange `#FF7A18` |
| League of Legends | turquoise `#0F8A9B` |
| Valorant | rouge Valorant `#FF4655` |
| osu! | rose osu! `#FF66AA` |
| Staff | la couleur de son pôle (le liseré or est ajouté par le site) ; Yuzuctus (21) : **ses couleurs** de yuzuctus.fr, vert sapin `#0E6B4C` et jaune yuzu `#F2E285` |

## Fiches (même masque sur toutes les cartes d'une personne)

| Personne | Silhouette | Masque | Clin d'œil |
|---|---|---|---|
| Jakpot | carrure solide, cheveux châtain clair mi-longs en rideau, un peu de barbe rousse sous le masque, anneau noir à l'oreille gauche, **yeux bleus** | noir et rouge, éclairs bleus | rock/metal (guitare, cornes du metal), Dragon Ball (aura, boule d'énergie, sans personnage) |
| AlphA | mince, cheveux blonds, capuche sombre à oreilles de chat, casque noir et rouge | noir, éclaboussures de peinture néon, petit cristal bleu au front | Arcane (néons et graffitis), cinéma |
| Sheep | cheveux noirs lisses aux épaules, petites lunettes rondes, polaire blanche « laine », casque noir et rouge | blanc cassé, laineux, traits doux, yeux fermés souriants, cornes de bélier : **mignon, pas effrayant** (la v1 ressemblait à un crâne) | les moutons |
| Daynalox | mince, longs cheveux ondulés blond vénitien | hannya du théâtre nô crème, lèvres et yeux rouges, rire ouvert, spirales de vent turquoise, une corne cassée | théâtre, vent, capsule rouge et blanche |
| Pablito | cheveux courts foncés, short crème à fleurs noires | rouge, petite étoile de mer crème sur la joue, sourire malicieux | étoile de mer (sa PP Patrick) |
| Yasunaii (Yuzuctus) | cheveux bruns épais relevés, carrure solide, t-shirt bleu | rose et noir sur la carte osu!, vert et noir sur sa carte staff, motif d'épines de cactus | yuzu, cactus, il code ses outils |
| Sebla | mince, chemise blanche, lunettes, casque noir à motifs gris | blanc, lignes sobres et symétriques | bras croisés, très pro |
| Slazen | cheveux bruns foncés mi-longs ondulés plaqués en arrière | rayures de pinceau bleues et noires, accents orange (son décal) | Martinique → Montréal → Séoul |
| SaulPleureur (top) | carrure lourde, undercut | masque carré en pierre crème, sans cornes ni crocs | jouait Malphite : la force inarrêtable, le rocher |
| Nephione (jungle) | longue tresse, cape qui se dissout en ombre | masque noir uni sans bouche, cornes en lames crème | jouait Nocturne : l'ombre, la lame, la nuit |
| KON aurel1003 (ADC) | queue de cheval haute | masque turquoise uni, grand sourire joyeux et gros yeux ronds (version « mignonne » : la gueule qui bave d'acide a été refusée par ChatGPT) | jouait Kog'Maw : l'artillerie, les orbes vert acide |
| Lokleyy (support) | chignon, lunettes rondes, chaîne et crochet | masque en laque rouge, sourire fermé | jouait Thresh : la lanterne, la chaîne |
| AlphA (Valorant) | voir plus haut | voir plus haut | jouait Raze : grenade de peinture, explosions colorées (et Jinx, d'Arcane) |
| Aze (initiateur) | casque audio, col de chasseur | masque de chouette crème | jouait Sova : l'arc, la flèche radar |
| Any (contrôleur) | long manteau à capuche en lambeaux | pas de masque : capuche vide, trois fentes rouges | jouait Omen : l'ombre, la fumée |
| Wazeerx7 (sentinelle) | chapeau à large bord, col montant | masque blanc sans bouche, un œil-objectif rouge | jouait Cypher : la caméra espion, le fil piège |
| Weyz (flex) | twists courts, lianes au bras | masque de loup noir, petits bois crème, feuilles rouges | jouait Skye : la nature, le rapace |
| kagaho42, Godlezz, kraskas, Neyzo | silhouette du prompt | masque oni classique | aucun connu |

> **Yuzuctus :** si la version masquée ne lui plaît pas, ses cartes 17 et 21 ont chacune une variante « objet », sans personne.

---

## Bloc Style (à coller avec `reference-style-1.webp` (Jakpot) et `reference-style-2.webp` (Saul) joints)

```
ONI KORP ALBUM · STYLE 1. The two attached images are the STYLE REFERENCES: copy their art style, texture, colors, simplicity and composition logic (not the character). For every image in this conversation, create a collectible esports card exactly like them:
- Persona 5 menu art printed like a screen-print poster: bold black silhouette, big sharp jagged black shards radiating behind the character, high contrast, no smooth gradients, no glossy 3D, not a photo.
- STRICT FOUR-INK PALETTE, like a screen print: off-white paper, black, vermilion red (#E5251F) and the ONE accent color of the prompt. NO other color anywhere (no purple, green, gold, brown, grey tints except black halftone). Only skin and hair keep their natural tones.
- BACKGROUND ALWAYS ABSTRACT like the references: off-white paper, a FEW big black jagged shards, and the giant symbol in the accent color. Leave at least a third of the background as EMPTY off-white paper (breathing space). Vermilion red is ONLY for small details on the clothes and the mask, NEVER in the background shards, so the accent color dominates the background. NO scenery: no landscape, forest, sky, clouds, moon light, room, stage, curtains or buildings.
- NO flat color band at the bottom: the illustration continues to the bottom edge (shards, smoke, clothes, ground), the character can overlap it.
- Vary the composition from card to card: the big shapes, the diagonal and the color masses must not sit at the same place every time.
- Rich print texture, NOT clean vector art (keep the heavy paper grain, halftone dots and ink splatters of the references): HALFTONE DOT shading in the shadows (on clothes, mask and skin), visible paper grain, small ink splatter specks, rough torn edges on the shards, confident brush-ink lines with varied thickness. The clothes have layered angular shadows and folds, never a single flat black blob.
- Attitude over showing off: a natural, slightly off-center pose with character, strong graphic black shadows on one side; never a stiff symmetrical "ta-da" pose unless the prompt asks for symmetry.
- ONE character, ONE clear pose, with the framing given in the prompt; the character stays big and readable. ONE GIANT personal symbol drawn as a monumental flat silhouette in the accent color, partly overlapped and cropped by the character and the shards so it never looks like a pasted clip-art icon.
- Natural hands and feet; never an oversized foreshortened hand or a leg/foot pointing at the camera.
- The face is ALWAYS completely hidden by the character's personal mask, painted only with the four inks. EVERY MASK IS UNIQUE: follow exactly its color, shape and expression; never default to a black horned mask with a fanged grimace and glowing eyes.
- Black club jacket with red details, no logo, unless the prompt says otherwise.
- Portrait 2:3, full bleed, no border.
- Never: text, letters, numbers, logos (including brand logos on sneakers), real game or series characters (no existing champion or agent: only their motifs).
Reply "OK" and wait.
```

---

## Rocket League · Γ Gamma (bleu `#1450D6`)

**02 · `rl-gamma-2.png` · Jakpot**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: electric blue (#1450D6). Solidly built young man, medium-length light chestnut hair with curtain bangs, a bit of short reddish beard under the mask, small black ring earring on his left ear, blue eyes visible through the mask's eye holes. Mask: black and red oni mask with blue lightning-bolt stripes. Pose: low angle, half-body, head-banging like at a metal concert, hair flying, one hand raised high making the metal horns sign, the other fist clenched, strong graphic black shadows on one side. Symbol: behind him, a GIANT angular electric guitar (flying-V shape, no brand), cropped by the frame and partly hidden by the character, as one monumental flat silhouette in the accent color.
```

**01 · `rl-gamma-1.png` · AlphA**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: electric blue (#1450D6). Slim young man, blond hair escaping from a dark hood with two small cat-ear shapes, black and red gaming headset. Mask: black oni mask with a few neon paint splatters and a small blue crystal on the forehead. Pose: full body, low angle, crouched on top of the giant crystal, elbows on his knees, looking down at the viewer, cold attitude. Symbol: under him, a GIANT faceted hexagonal crystal glowing like magic tech as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character, filling the background.
```

**03 · `rl-gamma-3.png` · Pablito**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: electric blue (#1450D6). Young man, short dark hair, sporty build, off-white shorts with a black flower pattern. Mask: red mask with a small off-white starfish painted on the cheek, a cheeky grin. Pose: full body, side view, crouched like a sprinter at kickoff, one fist on the ground, about to explode forward. Symbol: behind him, a GIANT five-pointed starfish as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character, filling the upper background.
```

## Rocket League · Ε Epsilon (orange `#FF7A18`)

**04 · `rl-epsilon-1.png` · Sheep**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: blazing orange (#FF7A18). Young man with shoulder-length straight black hair, small round glasses worn over the mask, black and red gaming headset, a fluffy white fleece jacket like sheep's wool. Mask: a FRIENDLY sheep-like oni mask, off-white with a soft wool texture, rounded gentle features, calm closed smiling eyes, small red swirl marks on the forehead and cheeks, a small peaceful smile with only two tiny fangs, curled ram horns; cute and cool, NOT a skull, NOT scary, no teeth row. Pose: seen from above, lying back relaxed in the curve of the giant horn, a ball resting on his chest, one knee up. Symbol: a GIANT curled ram's horn as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character, filling the background, its curve cradling him.
```

**05 · `rl-epsilon-2.png` · kagaho42**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: blazing orange (#FF7A18). Young man, short wavy hair, wristband. Mask: a GLOSSY ORANGE mask with black flame patterns, a wide confident grin, two short horns. Pose: full body, extreme low angle, walking calmly toward the viewer, hands in pockets. Symbol: behind him, a GIANT Rocket League ball as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character, filling the upper background.
```

**06 · `rl-epsilon-3.png` · Godlezz**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: blazing orange (#FF7A18). Young man, spiky short hair, sleeveless hoodie, taped fingers. Mask: red oni mask with a single long horn. Pose: full body, three-quarter view, one foot resting on top of a ball, leaning forward with his forearm on his raised knee, looking at the viewer, confident; clear, natural anatomy (no twisted limbs). Symbol: behind him, a GIANT rocket car seen from the front as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character, filling the upper background.
```

## League of Legends (turquoise `#0F8A9B`)

**07 · `lol-top.png` · SaulPleureur**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: teal (#0F8A9B). Broad-shouldered heavy young man, short undercut, torn red cape. Mask: a blocky square OFF-WHITE stone mask with black halftone texture and cracks, NO horns, NO fangs, heavy brow, flat stern closed mouth. Pose: EYE-LEVEL FRONT VIEW, full body, walking straight toward the viewer, heavy fists hanging, rock debris flying around, unstoppable. Symbol: behind him, a GIANT round boulder with cracks, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**08 · `lol-jungle.png` · Nephione**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: teal (#0F8A9B). Young person with a long braid and a black cloak whose edges dissolve into black ink smoke. Mask: a smooth SOLID BLACK mask with NO mouth, two long thin OFF-WHITE blade-shaped horns sweeping backward, two thin teal slit eyes. Pose: HIGH ANGLE from above, crouched low like a predator, one curved blade held low. Symbol: behind, a GIANT crescent blade shaped like a crescent moon, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**09 · `lol-mid.png` · Daynalox**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: teal (#0F8A9B). Slim young man, long wavy strawberry-blond hair flying, black jacket thrown over his shoulders like a cape. Mask: a Japanese Noh theatre hannya mask, OFF-WHITE with red lips and red eyes, a wide theatrical open-mouth laugh, teal wind swirls painted on the cheeks, one broken horn. Pose: SIDE PROFILE, three-quarter body, caught mid-spin like a dancer, one arm sweeping, hair and cape whirling; a small red and white capsule ball charm swinging from his belt. Symbol: behind him, a GIANT wind spiral, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**10 · `lol-adc.png` · KON aurel1003**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: teal (#0F8A9B). Young person with a high ponytail and an asymmetric jacket. Mask: a SOLID TEAL mask with a huge cheerful wide-open grin and big round curious eyes, playful, cartoonish, NOT scary. Pose: CLOSE-UP from the chest up, head tilted with curiosity toward the viewer, a long ornate black cannon resting on the shoulder, its barrel pointing up out of the frame. No legs visible. Symbol: behind, GIANT round energy orbs arcing like artillery shots, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**11 · `lol-support.png` · Lokleyy**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: teal (#0F8A9B). Young person with a hair bun and round glasses worn over the mask, a long black chain coiled around them, ending in a small hook. Mask: a glossy VERMILION RED lacquer mask, round hollow eyes, a thin calm closed smile, NO fangs, small curled horns. Pose: MEDIUM SHOT, FRONT VIEW, sitting cross-legged, perfectly calm and symmetrical, holding a small lantern in the lap with both hands. Symbol: behind, a GIANT lantern hanging from a chain, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

## Valorant (rouge `#FF4655`)

**12 · `valo-duelliste.png` · AlphA**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Slim young man, blond hair escaping from a dark hood with two small cat-ear shapes, black and red gaming headset. Mask: black mask with a few red and white paint splatters and a small red crystal on the forehead. Pose: seen from behind, half-body, turning his head over his shoulder toward the viewer, a round paint grenade tossed up and down in one hand. Symbol: behind him, a GIANT round paint grenade covered in graffiti, bursting into paint splashes, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**13 · `valo-initiateur.png` · Aze**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Young person with big over-ear headphones, a cropped bomber jacket and a fur-trimmed hunter collar. Mask: an OFF-WHITE owl-like mask, big round black-ringed eyes, a small beak instead of fangs, feather-shaped horns. Pose: side view, crouched on one knee, drawing a recurve bow aimed high. Symbol: behind, a GIANT arrow emitting concentric radar rings, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**14 · `valo-controleur.png` · Any**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Tall young person in a long tattered black hooded coat whose edges dissolve into black ink smoke. Mask: NO mask shape: inside the hood only pure black and three small red slits for eyes. Pose: seen from high above, standing alone, hands open, black ink wisps rising from the palms. Symbol: two GIANT round smoke spheres around him, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**15 · `valo-sentinelle.png` · Wazeerx7**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Young person in a wide-brimmed black hat and a long coat with a high collar. Mask: a smooth OFF-WHITE mask with no mouth and a single round red camera-lens eye, half hidden by the hat brim and the collar. Pose: half-body, back leaning against the giant camera, arms crossed, head tilted under the hat brim. Symbol: behind him, a GIANT spy camera with one lens, a thin red tripwire crossing the image, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**16 · `valo-flex.png` · Weyz**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Young man with short twists, sleeveless jacket over a long-sleeve shirt, a vine wrapped around one forearm. Mask: a BLACK wolf mask with small off-white antlers and a few red leaves painted on it. Pose: full body, low angle, mid-jump over a wall, one arm thrown forward. Symbol: behind him, a GIANT bird of prey with wings spread wide, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

## osu! (rose `#FF66AA`)

**17 · `osu-1.png` · Yasunaii**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: osu! pink (#FF66AA). Young man, thick messy straight dark brown hair swept up, solid build, t-shirt under the club jacket. Mask: a PINK mask with black cactus-spine patterns. Pose: three-quarter view, sitting backwards on a chair, arms on the backrest, a pen tablet stylus between his fingers. Symbol: behind him, a GIANT rhythm game hit circle with its approach ring, one smaller circle drawn as a yuzu slice, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```
Variante objet :
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: osu! pink (#FF66AA). No character. A pink mask with black cactus-spine patterns resting on a pen tablet; behind, a GIANT hit circle with its approach ring, one smaller circle drawn as a yuzu slice, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**18 · `osu-2.png` · Sheep**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. Accent: osu! pink (#FF66AA). Young man with shoulder-length straight black hair, small round glasses worn over the mask, black and red gaming headset, a fluffy white fleece jacket like sheep's wool. Mask: a FRIENDLY sheep-like mask, off-white with a soft wool texture, rounded gentle features, calm closed smiling eyes, small red swirl marks on the forehead and cheeks, a small peaceful smile with two tiny fangs, curled ram horns; cute, NOT a skull, NOT scary. Pose: full body, side view, jumping to the beat, knees up. Symbol: behind him, a GIANT hit circle shaped like a fluffy round sheep, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

## Staff (couleur du pôle)

**19 · `staff-fondateur-1.png` · Jakpot**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: electric blue (#1450D6). Solidly built young man, medium-length light chestnut hair with curtain bangs, a bit of short reddish beard under the mask, small black ring earring on his left ear, blue eyes visible through the mask's eye holes. Mask: black and red oni mask with blue lightning-bolt stripes. Founder and graphic designer. Pose: three-quarter view, half-body, feet planted, both hands cupped at his hip charging a ball of energy drawn as flat blue shapes, hair and jacket lifted upward by the power. Symbol: behind him, a GIANT spiky flame-like energy aura bursting upward (generic anime power-up aura, no existing character), cropped by the frame, as one monumental flat silhouette in the accent color.
```

**20 · `staff-fondateur-2.png` · AlphA**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: Valorant red (#FF4655). Here the accent and the red are the same ink, so use it SPARINGLY: only on the giant symbol and a few details; the rest of the image is mostly off-white paper and black. Slim young man, blond hair escaping from a dark hood with two small cat-ear shapes, thin chain necklace. Mask: black mask with a few red and white paint splatters and a small red crystal on the forehead. Pose: low angle, half-body, one hand raised giving the "action" signal like a film director. Symbol: behind him, a GIANT vintage cinema camera on a tripod, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**21 · `staff-fondateur-3.png` · Yasunaii**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: his own colors, fir green (#0E6B4C) and yuzu yellow (#F2E285), replacing the red of the shards (keep black and off-white). Young man, thick messy straight dark brown hair swept up, solid build, closed-back headphones. Mask: green and black oni mask with small cactus-spine patterns. Pose: close three-quarter profile, leaning into a studio microphone. Symbol: behind him, a GIANT studio microphone with two yuzu slices floating in its sound waves, as one monumental silhouette in the accent color, cropped by the frame and partly hidden by the character.
```
Variante objet :
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: fir green (#0E6B4C) and yuzu yellow (#F2E285), replacing the red of the shards. No character. A studio microphone with a green and black oni mask with cactus-spine patterns hanging from it by a cord; behind, GIANT sound waves with two yuzu slices.
```

**22 · `staff-fondateur-4.png` · Sheep**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: blazing orange (#FF7A18). Young man with shoulder-length straight black hair, small round glasses worn over the mask, black and red gaming headset, an oversized fluffy white fleece jacket with small sheep ears on the hood. Mask: a FRIENDLY sheep-like mask, off-white with a soft wool texture, calm closed smiling eyes, small red swirl marks on the forehead and cheeks, a small peaceful smile, curled ram horns; cute, NOT a skull. Pose: sitting on a big ball, leaning forward, chin resting on his fist. Symbol: behind him, a GIANT fluffy sheep sitting calmly, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**23 · `staff-coach-1.png` · Sebla**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: electric blue (#1450D6). Slim young man in a crisp white button-up shirt (no jacket), short dark hair, thin glasses worn over the mask, black gaming headset. Mask: an OFF-WHITE mask with clean thin black symmetrical lines. Pose: front view, perfectly symmetrical composition, standing very straight, ARMS CROSSED, calm. Symbol: behind him, a GIANT tactical board with circles and arrows, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**24 · `staff-coach-2.png` · Slazen**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: blazing orange (#FF7A18). Young man with medium-length wavy dark brown hair pushed back, a headset, black club jacket. Mask: a black mask with rough orange brush stripes like his car decal. Pose: half-body, leaning forward, hands clasped with fingers interlaced in front of the mask, thinking. Symbol: behind him, a GIANT rocket car painted with the same rough brush stripes (no logo, no number, no name), as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**25 · `staff-coach-3.png` · kraskas**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: teal (#0F8A9B). Young man with short dark hair in a small bun, black hoodie with rolled-up sleeves, a wristwatch. Mask: a BLACK AND OFF-WHITE CHECKERBOARD mask like a chessboard, calm neutral expression, no fangs. Pose: half-body, three-quarter view, holding a small chess piece between two fingers, studying it. Symbol: behind him, a GIANT chess knight piece, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**26 · `staff-moderateur-1.png` · Daynalox**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: teal (#0F8A9B). Slim young man, long wavy strawberry-blond hair, black hooded jacket. Mask: a Japanese Noh theatre hannya mask, OFF-WHITE with red lips and red eyes, a wide theatrical open-mouth laugh, teal wind swirls on the cheeks, one broken horn. Pose: half-body, taking a theatrical bow, one arm sweeping wide, a red and white capsule ball in the other hand. Symbol: behind him, a GIANT spotlight cone, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

**27 · `staff-moderateur-2.png` · Neyzo**
```
SAME ART STYLE AS THE 2 ATTACHED IMAGES: flat 2D screen-printed poster illustration, Persona 5 style, bold black ink lines, halftone dots, paper grain, only 4 inks (off-white paper, black, vermilion red, and the accent below), background = off-white paper with a FEW big black shards and the giant symbol in the accent color, at least a third of the background left as EMPTY off-white paper; vermilion red ONLY as small details on the clothes and mask, NEVER in the background shards. NOT realistic, NOT a photo, NOT 3D, no cinematic lighting, no glow, no brand logos on shoes or clothes. STAFF CARD. Accent: vermilion red only (#E5251F). Young man with slicked-back hair, thin chain, black high-collar jacket, round tinted glasses worn over the mask. Mask: a glossy SOLID RED lacquer mask with thin black lines, stern and elegant, no fangs. Pose: half-body, leaning with one elbow on the giant chat bubble, adjusting his glasses with one finger. Symbol: behind him, a GIANT chat bubble stamped with a check mark, as one monumental flat silhouette in the accent color, cropped by the frame and partly hidden by the character.
```

---

## Ensuite

1. Dépose les images dans `a-integrer/`. Je les intègre et je signale celles à relancer.
2. Je les passe en **AVIF** pour le score Lighthouse.
