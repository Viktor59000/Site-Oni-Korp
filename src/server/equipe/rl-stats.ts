// Stats Rocket League communes à Stats, au Tracker RL et au profil.
// Une partie (table perf, game = 'rl') vient soit d'Oni Sync (src: 'sync', avec `feed` = événements du jeu et `moy` = relevés
// chaque seconde), soit d'un replay ballchasing (bpm, boostMoy, supersonique… déjà calculés par ballchasing).

/** Noms français des événements du jeu (StatfeedEvent), comme dans le tableau des scores de Rocket League. */
export const RL_FEED_FR: Record<string, string> = {
  Goal: 'Buts', Assist: 'Passes décisives', Save: 'Arrêts', EpicSave: 'Sauvetages miraculeux', Shot: 'Tirs',
  Demolish: 'Démolitions', Demolition: 'Démolitions', AerialGoal: 'Buts aériens', AerialHit: 'Frappes aériennes',
  BicycleGoal: 'Retournés acrobatiques', BicycleHit: 'Retournés acrobatiques', BackwardsGoal: 'Buts en marche arrière', LongGoal: 'Buts de loin',
  TurtleGoal: 'Buts sur le toit', PoolShot: 'Coups du billard', Center: 'Centres', CenterBall: 'Centres', Clear: 'Dégagements', ClearBall: 'Dégagements',
  FirstTouch: 'Engagements', Juggle: 'Jongleries', FlipReset: 'Flip resets', CrossbarHit: 'Touches de la barre', Crossbar: 'Touches de la barre',
  HighFive: 'Tope là !', LowFive: 'Pote là !', BoostPickups: 'Ramassages de turbo', CarTouches: 'Impacts de voitures',
  HatTrick: 'Coups du chapeau', Playmaker: 'Meneur de jeu', Savior: 'Sauveur', MVP: 'Meilleur joueur', OwnGoal: 'Contre son camp', Win: 'Victoires',
};
// Événements déjà comptés ailleurs (buts, arrêts…) ou sans intérêt pour progresser
const SKIP = new Set(['Goal', 'Assist', 'Save', 'Shot', 'Win', 'MVP']);

export type RlGame = Record<string, any> & { win: boolean; at: number };

/** Une partie ramenée aux mêmes champs, quelle que soit sa source. */
export function rlNorm(x: RlGame): RlGame {
  const f = (x.feed ?? {}) as Record<string, number>;
  const ev = (...k: string[]) => (x.feed ? k.reduce((s, key) => s + (Number(f[key]) || 0), 0) : null);
  return {
    ...x,
    boostMoy: x.boostMoy ?? x.moy?.boost ?? null,
    supersonique: x.supersonique ?? x.moy?.supersonique ?? null,
    air: x.moy && x.moy.sol != null ? Math.max(0, Math.round((100 - x.moy.sol - (x.moy.mur ?? 0)) * 10) / 10) : null,
    miraculeux: ev('EpicSave'), aeriennes: ev('AerialHit', 'AerialGoal'), degagements: ev('Clear', 'ClearBall'), centres: ev('Center', 'CenterBall'),
  };
}

/** Les événements notables d'une série de parties, en français, triés (hors buts/arrêts/tirs déjà affichés). */
export function rlFeedTotals(games: RlGame[]) {
  const t: Record<string, number> = {};
  for (const g of games) for (const [k, v] of Object.entries(g.feed ?? {})) if (!SKIP.has(k)) { const l = RL_FEED_FR[k] ?? k; t[l] = (t[l] ?? 0) + (Number(v) || 0); }
  return Object.entries(t).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
}
