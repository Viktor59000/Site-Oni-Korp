# Rosters Rocket League — Gamma et Epsilon, deux identités

## Le problème aujourd'hui

Les 6 vignettes RL réutilisent **les 3 mêmes illustrations** (`rl-1`, `rl-2`, `rl-3`) : le roster Epsilon a juste les images décalées et retournées en miroir. Le cadre bleu ou orange distingue les équipes, mais l'image, non.

## L'idée : chaque roster porte le sens de sa lettre

- **Γ Gamma — l'équipe bleue, l'énergie électrique.** Les rayons gamma sont le rayonnement le plus puissant : éclairs, arcs électriques, lumière froide. Fond **bleu dominant**.
- **Ε Epsilon — l'équipe orange, le feu et la vitesse.** En maths, epsilon c'est le « tout petit écart » qui fait la différence : flammes, traînées de vitesse, précision. Fond **orange dominant**.

Chaque joueur a **sa propre action** de jeu (et plus de miroir) : les 6 cartes ne se ressemblent plus, et on reconnaît le roster à l'ambiance avant même de lire le cadre. Les actions sont des mouvements typiques de Rocket League, pas des rôles officiels (le 3v3 n'en a pas).

## Mode d'emploi

1. Nouvelle conversation ChatGPT. Colle le bloc « Style commun » de `PROMPTS.md`, puis le bloc « album Panini » de `PROMPTS.md` (section 6), comme pour les premières vignettes joueurs.
2. Colle les 6 prompts, format **portrait (1024 × 1536)**.
3. Range les images dans `site/visuels/a-integrer/` avec **exactement** ces noms. Le site les prend automatiquement à la place des anciennes (c'est déjà codé).

L'ordre suit celui des rosters : Gamma = AlphA, Jakpot, Pablito ; Epsilon = Sheep, kagaho42, Godlezz. Si une action colle mieux à un autre joueur, échange juste les noms de fichiers.

---

## Γ Gamma — bleu, électrique

| Fichier | Joueur | Prompt |
|---|---|---|
| `rl-gamma-1.png` | AlphA | `PANINI SERIES. Colors: electric blue #1450D6 dominant with white and cold cyan highlights, a touch of red. Rocket League player in mid-air, body twisted as if steering an aerial, a small car flying past with a crackling blue lightning boost trail. Electric arcs and sparks around the hands.` |
| `rl-gamma-2.png` | Jakpot | `PANINI SERIES. Colors: electric blue #1450D6 dominant with white and cold cyan highlights, a touch of red. Rocket League goalkeeper pose, arms spread wide, a hexagonal electric force field crackling in front of them as the giant match ball slams into it.` |
| `rl-gamma-3.png` | Pablito | `PANINI SERIES. Colors: electric blue #1450D6 dominant with white and cold cyan highlights, a touch of red. Rocket League player crouched low like at kickoff, one fist on the ground, blue lightning bursting outward from the impact point, a small car charging behind with electric boost.` |

## Ε Epsilon — orange, feu et vitesse

| Fichier | Joueur | Prompt |
|---|---|---|
| `rl-epsilon-1.png` | Sheep | `PANINI SERIES. Colors: blazing orange #FF7A18 dominant with black and hot yellow highlights, a touch of red. Rocket League player balancing the match ball on one finger like a dribble, calm and precise, thin fire trails orbiting the ball.` |
| `rl-epsilon-2.png` | kagaho42 | `PANINI SERIES. Colors: blazing orange #FF7A18 dominant with black and hot yellow highlights, a touch of red. Rocket League player striding forward out of a fiery explosion behind them (a car demolition), sparks and burning debris flying, confident walk.` |
| `rl-epsilon-3.png` | Godlezz | `PANINI SERIES. Colors: blazing orange #FF7A18 dominant with black and hot yellow highlights, a touch of red. Rocket League player in a powerful kicking-through pose, the match ball blasting away like a flaming comet with long speed lines.` |
