// Statistiques des joueurs. Normalement relevées par Oni Bot (clés dans son .env) et lues ici ;
// à défaut, le site peut les demander lui-même si les clés sont aussi posées sur Vercel :
// - League of Legends : RIOT_API_KEY (developer.riotgames.com) → rang classé solo/duo
// - osu! : OSU_CLIENT_ID + OSU_CLIENT_SECRET (osu.ppy.sh/home/account/edit → OAuth) → rang mondial et pp
// Résultats mis en cache 30 minutes dans la base. Sans clé : liens vers op.gg, tracker.gg, osu!.
import { exec, rows } from '../db';

const TTL = 30 * 60_000;
/** Lecture du cache rempli par Oni Bot (module trackers) : valable 2 h. */
async function fromBot<T>(key: string): Promise<T | null> {
  const [c] = await rows<{ value: string; at: number }>('SELECT value, at FROM stats_cache WHERE key = ?', key);
  return c && Date.now() - Number(c.at) < 4 * TTL ? JSON.parse(c.value) : null;
}
async function cached<T>(key: string, fn: () => Promise<T | null>): Promise<T | null> {
  const [c] = await rows<{ value: string; at: number }>('SELECT value, at FROM stats_cache WHERE key = ?', key);
  if (c && Date.now() - Number(c.at) < TTL) return JSON.parse(c.value);
  const v = await fn().catch(() => null);
  await exec('INSERT INTO stats_cache VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, at = excluded.at', key, JSON.stringify(v), Date.now()).catch(() => {});
  return v;
}

export const REGIONS: Record<string, { label: string; platform: string; route: string; opgg: string }> = {
  euw: { label: 'EUW', platform: 'euw1', route: 'europe', opgg: 'euw' },
  eune: { label: 'EUNE', platform: 'eun1', route: 'europe', opgg: 'eune' },
  na: { label: 'NA', platform: 'na1', route: 'americas', opgg: 'na' },
  kr: { label: 'KR', platform: 'kr', route: 'asia', opgg: 'kr' },
};

const riotId = (s: string) => { const [name, tag] = s.split('#'); return name && tag ? { name: name.trim(), tag: tag.trim() } : null; };

export const links = {
  opgg: (id: string, region = 'euw') => { const r = riotId(id); return r ? `https://www.op.gg/summoners/${REGIONS[region]?.opgg ?? 'euw'}/${encodeURIComponent(`${r.name}-${r.tag}`)}` : null; },
  opggMulti: (ids: string[], region = 'euw') => `https://www.op.gg/multisearch/${REGIONS[region]?.opgg ?? 'euw'}?summoners=${encodeURIComponent(ids.join(','))}`,
  valo: (id: string) => (riotId(id) ? `https://tracker.gg/valorant/profile/riot/${encodeURIComponent(id)}/overview` : null),
  rl: (id: string) => `https://rocketleague.tracker.network/rocket-league/profile/epic/${encodeURIComponent(id)}/overview`,
  osu: (id: string) => `https://osu.ppy.sh/users/${encodeURIComponent(id)}`,
  osutrack: (id: string) => `https://ameobea.me/osutrack/user/${encodeURIComponent(id)}/`,
};

export async function lolRank(id: string, region = 'euw') {
  const key = process.env.RIOT_API_KEY; const r = riotId(id); const reg = REGIONS[region] ?? REGIONS.euw;
  if (!r) return null;
  if (!key) return fromBot(`lol:${region}:${id.toLowerCase()}`);
  return cached(`lol:${region}:${id.toLowerCase()}`, async () => {
    const h = { headers: { 'X-Riot-Token': key } };
    const acc = await fetch(`https://${reg.route}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(r.name)}/${encodeURIComponent(r.tag)}`, h).then((x) => (x.ok ? x.json() : null));
    if (!acc?.puuid) return null;
    const entries = await fetch(`https://${reg.platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${acc.puuid}`, h).then((x) => (x.ok ? x.json() : null)) as any[] | null;
    const solo = entries?.find((e) => e.queueType === 'RANKED_SOLO_5x5');
    return solo ? { tier: solo.tier, rank: solo.rank, lp: solo.leaguePoints, wins: solo.wins, losses: solo.losses } : { tier: 'UNRANKED' };
  });
}

let osuToken: { v: string; until: number } | null = null;
export async function osuStats(username: string) {
  const id = process.env.OSU_CLIENT_ID, secret = process.env.OSU_CLIENT_SECRET;
  if (!id || !secret) return fromBot(`osu:${username.toLowerCase()}`);
  return cached(`osu:${username.toLowerCase()}`, async () => {
    if (!osuToken || osuToken.until < Date.now()) {
      const t = await fetch('https://osu.ppy.sh/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: Number(id), client_secret: secret, grant_type: 'client_credentials', scope: 'public' }) }).then((x) => (x.ok ? x.json() : null));
      if (!t?.access_token) return null;
      osuToken = { v: t.access_token, until: Date.now() + (t.expires_in - 300) * 1000 };
    }
    const u = await fetch(`https://osu.ppy.sh/api/v2/users/${encodeURIComponent('@' + username)}/osu`, { headers: { Authorization: `Bearer ${osuToken.v}` } }).then((x) => (x.ok ? x.json() : null));
    return u?.statistics ? { rank: u.statistics.global_rank, pp: Math.round(u.statistics.pp), acc: Math.round(u.statistics.hit_accuracy * 100) / 100 } : null;
  });
}

/** Rang Valorant en français : « Iron 3 » → « Fer 3 » (le reste du nom est identique). */
const VALO_FR: Record<string, string> = { Iron: 'Fer', Silver: 'Argent', Gold: 'Or', Platinum: 'Platine', Diamond: 'Diamant', Immortal: 'Immortel', Unrated: 'Non classé' };
export const valoTierFr = (t: string) => t.replace(/^\w+/, (w) => VALO_FR[w] ?? w);
export const TIERS_FR: Record<string, string> = {
  IRON: 'Fer', BRONZE: 'Bronze', SILVER: 'Argent', GOLD: 'Or', PLATINUM: 'Platine', EMERALD: 'Émeraude', DIAMOND: 'Diamant',
  MASTER: 'Maître', GRANDMASTER: 'Grand maître', CHALLENGER: 'Challenger', UNRANKED: 'Non classé',
};
