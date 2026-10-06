// Sources tierces d'Inside, lues côté serveur et mises en cache (accords obtenus, sources créditées dans l'interface) :
// LineupsValorant (bibliothèque de lineups), lolalytics (analyse de draft LoL), VCRDB (viseurs Valorant).
// Servies au navigateur par GET /api/equipe/outils?type=lv|ll|vc (outils.ts).

// Bibliothèque communautaire LineupsValorant (lineupsvalorant.com, réutilisation autorisée par leur équipe) : liste et fiches, en cache 1 h
const lvCache = new Map<string, { at: number; v: unknown }>();
const lvBase = 'https://lineupsvalorant.com';
const decode = (x: string) => x.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
export async function lv(key: string, load: () => Promise<unknown>) {
  const c = lvCache.get(key); if (c && Date.now() - c.at < 3600_000) return c.v;
  const v = await load(); lvCache.set(key, { at: Date.now(), v }); return v;
}
export async function lvList(map: string, agent: string) {
  const q = new URLSearchParams(); if (map) q.set('map', map); if (agent) q.set('agent', agent);
  const html = await fetch(`${lvBase}/?${q}`).then((r) => (r.ok ? r.text() : ''));
  return html.split('<div class="lineup-box"').slice(1).map((b) => ({
    id: Number(b.match(/data-id="(\d+)"/)?.[1]),
    title: decode(b.match(/lineup-box-title">([^<]*)</)?.[1] ?? ''),
    agent: b.match(/class="lineup-box-agent" alt="([^"]*)"/)?.[1] ?? '',
    abilities: [...b.matchAll(/<img alt="([^"]+)" src="\/static\/abilities\//g)].map((m) => m[1]),
    thumb: b.match(/class="lineup-box-image" src="([^"]+)"/)?.[1] ?? null,
    from: decode(b.match(/start=[^"]*"[^>]*>([^<]*)</)?.[1] ?? ''), to: decode(b.match(/end=[^"]*"[^>]*>([^<]*)</)?.[1] ?? ''),
  })).filter((x) => x.id);
}
export async function lvOne(id: number) {
  const d = await fetch(`${lvBase}/get_lineup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, user_token: null }) }).then((r) => (r.ok ? r.json() : null)) as any;
  if (!d || d.error !== 'none') return null;
  return {
    id, map: d.map, title: d.title, from: d.start, to: d.end, abilities: String(d.abilities ?? '').split(',').map((x: string) => x.trim()).filter(Boolean),
    steps: String(d.description ?? '').split(/<br\s*\/?>/i).map((x: string) => decode(x.replace(/<[^>]+>/g, '')).replace(/^\d+[.)]\s*/, '')).filter(Boolean),
    images: Array.from({ length: Number(d.num_images) || 0 }, (_, k) => `https://lineupsvalorant.b-cdn.net/static/lineup_images/${id}/${k + 1}.webp`),
    author: d.username, likes: d.like_count, views: d.views, url: `${lvBase}/?id=${id}`,
  };
}

// Données lolalytics (Émeraude+, patch en cours, Ranked Solo/Duo ; réutilisation autorisée) via leur API JSON, en cache 12 h.
// - meta : pour chaque poste, tier / victoire / pick / ban / PBI / part de ses parties dans ce poste, par champion (clé Riot)
// - champ : pour un champion dans un poste, son taux contre chaque champion de chaque poste adverse, et avec chaque coéquipier
const LL_API = 'https://a1.lolalytics.com/mega/?v=1&tier=emerald_plus&queue=ranked&region=all';
export const LL_LANES = ['top', 'jungle', 'middle', 'bottom', 'support'] as const;
const llCache = new Map<string, { at: number; v: Promise<any> }>();
const llMemo = <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
  const c = llCache.get(key); if (c && Date.now() - c.at < 12 * 3600_000) return c.v;
  const v = fn(); llCache.set(key, { at: Date.now(), v }); v.catch(() => llCache.delete(key));
  return v;
};
// Quelques requêtes à la fois, pour rester léger chez eux
let llBusy = 0; const llQueue: (() => void)[] = [];
async function llFetch(q: string) {
  if (llBusy >= 4) await new Promise<void>((r) => llQueue.push(r));
  llBusy++;
  try {
    const patch = await llMemo('patch', async () => ((await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then((r) => r.json())) as string[])[0].split('.').slice(0, 2).join('.'));
    const r = await fetch(`${LL_API}&patch=${patch}&${q}`, { headers: { 'User-Agent': 'Mozilla/5.0 (OniKorp Inside)', Referer: 'https://lolalytics.com/' } });
    if (!r.ok) throw new Error(String(r.status));
    return { patch, d: await r.json() as any };
  } finally { llBusy--; llQueue.shift()?.(); }
}
export const llMeta = () => llMemo('meta', async () => {
  const lanes: Record<string, Record<string, number[]>> = {}; let patch = '', avgWr = 50;
  await Promise.all(LL_LANES.map(async (lane) => {
    const { patch: p, d } = await llFetch(`ep=list&lane=${lane}`); patch = p; avgWr = d.avgWr ?? avgWr;
    // [tier (1 = S+ … 15 = D-, 0 = pas classé), victoire, pick, ban, PBI, parties, % de ses parties dans ce poste]
    lanes[lane] = Object.fromEntries(Object.entries<any>(d.cid ?? {}).map(([cid, c]) => [cid, [c.tier, c.wr, c.pr, c.br, c.pbi, c.games, c.pctLane]]));
  }));
  return { patch, avgWr, lanes };
});
export const llChamp = (slug: string, lane: string) => llMemo(`c2:${slug}:${lane}`, async () => {
  const vs: Record<string, Record<string, number[]>> = {}; let wr = 0;
  await Promise.all(LL_LANES.map(async (vl) => {
    const { d } = await llFetch(`ep=counter&c=${slug}&lane=${lane}&vslane=${vl}`);
    wr = Number(d.stats?.wr ?? 0);
    // [notre victoire contre lui, parties, delta 2 : écart au taux attendu d'après les deux champions, centré sur 0]
    vs[vl] = Object.fromEntries((d.counters ?? []).map((c: any) => [c.cid, [c.vsWr, c.n, c.d2]]));
  }));
  const { d } = await llFetch(`ep=build-team&c=${slug}&lane=${lane}`);
  // [victoire ensemble, parties, delta 2 normalisé]
  const team = Object.fromEntries(Object.entries<any[]>(d.team ?? {}).map(([l, rows]) => [l, Object.fromEntries(rows.map((r) => [r[0], [r[1], r[5], r[3]]]))]));
  return { wr, vs, team };
});

// Viseurs VCRDB (vcrdb.net, réutilisation autorisée, source créditée) : la base complète est dans la page d'accueil
// (id, nom, code, tags « team » ou « fun », copies au total et sur la semaine). Relue au plus une fois par jour.
export type VC = { id: number; name: string; code: string; tags: string; copied: number; weeklyCopies: number };
let vcCache: { at: number; v: Promise<VC[]> } | null = null;
export function vcList() {
  if (vcCache && Date.now() - vcCache.at < 24 * 3600_000) return vcCache.v;
  const v = fetch('https://www.vcrdb.net/', { headers: { 'User-Agent': 'Mozilla/5.0 (OniKorp Inside)' } }).then((r) => r.text()).then((html) => {
    const s = html.replace(/\\"/g, '"');
    const k = s.indexOf('"json":[{"id":');
    if (k < 0) return [];
    const start = s.indexOf('[', k);
    let depth = 0, end = start;
    for (let n = start; n < s.length; n++) { const ch = s[n]; if (ch === '[') depth++; else if (ch === ']' && --depth === 0) { end = n + 1; break; } }
    return (JSON.parse(s.slice(start, end)) as VC[]).filter((x) => x && x.code);
  });
  vcCache = { at: Date.now(), v }; v.catch(() => { vcCache = null; });
  return v;
}
