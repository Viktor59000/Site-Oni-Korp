// Outils de l'espace équipe : comptes de jeu, notes de match, drafts LoL, lineups Valorant.
// POST /api/equipe/outils (formulaire, champ « action ») · GET /api/equipe/outils?type=drafts|lineups&roster=ID (JSON)
import type { APIRoute, AstroCookies } from 'astro';
import { getSession, sameOrigin } from '../session';
import { db, exec, rows } from '../db';
import { access } from './access';

let ready = false;
/** Tables des outils (créées au premier usage ; Oni Bot les crée aussi). */
export async function ensureTables() {
  if (ready) return;
  const statements = [
    `CREATE TABLE IF NOT EXISTS accounts (user_id TEXT, game TEXT, ident TEXT, region TEXT, updated_at INTEGER, PRIMARY KEY (user_id, game))`,
    `CREATE TABLE IF NOT EXISTS match_notes (match_id INTEGER, user_id TEXT, good TEXT, work TEXT, rating INTEGER, at INTEGER, PRIMARY KEY (match_id, user_id))`,
    `CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY, roster_id INTEGER, title TEXT, data TEXT, author TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS lineups (id INTEGER PRIMARY KEY, roster_id INTEGER, map TEXT, agent TEXT, side TEXT, title TEXT, x REAL, y REAL, tx REAL, ty REAL, url TEXT, note TEXT, author TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS stats_cache (key TEXT PRIMARY KEY, value TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS perf (id TEXT PRIMARY KEY, user_id TEXT, game TEXT, at INTEGER, data TEXT)`,
    `CREATE TABLE IF NOT EXISTS rank_history (user_id TEXT, game TEXT, day TEXT, value TEXT, PRIMARY KEY (user_id, game, day))`,
    `CREATE TABLE IF NOT EXISTS match_stats (match_id INTEGER, user_id TEXT, data TEXT, at INTEGER, PRIMARY KEY (match_id, user_id))`,
    `CREATE TABLE IF NOT EXISTS osu_maps (id INTEGER PRIMARY KEY, roster_id INTEGER, beatmap_id INTEGER, note TEXT, challenge INTEGER DEFAULT 0, ends INTEGER, meta TEXT, added_by TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS setups (user_id TEXT, game TEXT, data TEXT, updated_at INTEGER, PRIMARY KEY (user_id, game))`,
    `CREATE TABLE IF NOT EXISTS vods (id INTEGER PRIMARY KEY, roster_id INTEGER, title TEXT, url TEXT, match_id INTEGER, added_by TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS vod_marks (id INTEGER PRIMARY KEY, vod_id INTEGER, t INTEGER, text TEXT, kind TEXT, author TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS docs (id INTEGER PRIMARY KEY, roster_id INTEGER, title TEXT, body TEXT, pinned INTEGER DEFAULT 0, author TEXT, updated_at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, roster_id INTEGER, game TEXT, map TEXT, title TEXT, state TEXT, updated_at INTEGER, updated_by TEXT)`,
    `CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY, roster_id INTEGER, user_id TEXT, title TEXT, detail TEXT, due INTEGER, status TEXT DEFAULT 'en-cours', progress INTEGER DEFAULT 0, created_by TEXT, at INTEGER, updated_at INTEGER)`,
  ];
  // Un seul aller-retour vers la base pour toutes les tables
  const c = db(); if (c) await c.batch(statements, 'write').catch(async () => { for (const sql of statements) await exec(sql).catch(() => {}); });
  ready = true;
}

/** Membre connecté avec accès à l'espace équipe, sinon null. */
export async function teamUser(cookies: AstroCookies) {
  const user = getSession(cookies);
  if (!user) return null;
  const me = await access(user.id);
  if (!me.member || !(me.staff || me.rosters.length)) return null;
  await ensureTables();
  return { user, me };
}

/** Roster choisi dans la navigation (?r=slug) : on filtre dessus, sinon tous ceux de la personne. */
export function scope<T extends { slug: string }>(rosters: T[], url: URL) {
  const one = rosters.find((x) => x.slug === url.searchParams.get('r'));
  return { active: one?.slug ?? null, list: one ? [one] : rosters };
}

const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? '').trim().slice(0, n);
const num = (v: FormDataEntryValue | null) => { const x = Number(v); return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : null; };
export const GAMES_ACCOUNTS = ['riot', 'rl', 'osu'] as const;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return redirect('/equipe/');
  const t = await teamUser(cookies);
  if (!t) return redirect('/equipe/');
  const { user, me } = t;
  const f = await request.formData();
  const action = clip(f.get('action'), 30);
  const back = clip(f.get('back'), 100).startsWith('/equipe') ? clip(f.get('back'), 100) : '/equipe/';
  const canRoster = (id: number) => me.staff || me.rosterIds.includes(id);

  if (action === 'comptes') {
    for (const g of GAMES_ACCOUNTS) {
      const ident = clip(f.get(g), 60);
      if (ident) await exec(`INSERT INTO accounts VALUES (?,?,?,?,?) ON CONFLICT(user_id, game) DO UPDATE SET ident = excluded.ident, region = excluded.region, updated_at = excluded.updated_at`,
        user.id, g, ident, g === 'riot' ? clip(f.get('region'), 6) || 'euw' : null, Date.now());
      else await exec('DELETE FROM accounts WHERE user_id = ? AND game = ?', user.id, g);
    }
    return redirect(back);
  }

  if (action === 'note') {
    const id = Number(f.get('match'));
    const [m] = await rows<{ roster_id: number }>('SELECT roster_id FROM matches WHERE id = ?', id);
    if (!m || !canRoster(Number(m.roster_id))) return redirect(back);
    const rating = Math.min(10, Math.max(1, Number(f.get('rating')) || 5));
    await exec(`INSERT INTO match_notes VALUES (?,?,?,?,?,?) ON CONFLICT(match_id, user_id) DO UPDATE SET good = excluded.good, work = excluded.work, rating = excluded.rating, at = excluded.at`,
      id, user.id, clip(f.get('good'), 1000), clip(f.get('work'), 1000), rating, Date.now());
    return redirect(`${back}#match-${id}`);
  }

  if (action === 'draft') {
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    const data = clip(f.get('data'), 4000);
    try { const d = JSON.parse(data); if (!d || typeof d !== 'object' || Array.isArray(d)) return redirect(back); } catch { return redirect(back); }
    await exec('INSERT INTO drafts (roster_id, title, data, author, at) VALUES (?,?,?,?,?)', roster, clip(f.get('title'), 80) || 'Draft', data, user.id, Date.now());
    return redirect(back);
  }

  if (action === 'lineup') {
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    const [x, y, tx, ty] = ['x', 'y', 'tx', 'ty'].map((k) => num(f.get(k)));
    const url = clip(f.get('url'), 300);
    if (x === null || y === null || !clip(f.get('title'), 80)) return redirect(back);
    await exec('INSERT INTO lineups (roster_id, map, agent, side, title, x, y, tx, ty, url, note, author, at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      roster, clip(f.get('map'), 40), clip(f.get('agent'), 40), clip(f.get('side'), 10), clip(f.get('title'), 80), x, y, tx, ty,
      /^https?:\/\//.test(url) ? url : null, clip(f.get('note'), 500), user.id, Date.now());
    return redirect(back);
  }

  if (action === 'stats') {
    const id = Number(f.get('match'));
    const [m] = await rows<{ roster_id: number }>('SELECT roster_id FROM matches WHERE id = ?', id);
    if (!m || !canRoster(Number(m.roster_id))) return redirect(back);
    const target = me.staff && clip(f.get('user'), 25) ? clip(f.get('user'), 25) : user.id;
    const data: Record<string, number | string> = {};
    for (const k of ['acs', 'k', 'd', 'a', 'adr', 'hs', 'fb', 'kast', 'score', 'buts', 'passes', 'arrets', 'tirs', 'demos']) {
      const v = Number(String(f.get(k) ?? '').replace(',', '.'));
      if (String(f.get(k) ?? '').trim() !== '' && Number.isFinite(v) && v >= 0 && v < 100000) data[k] = v;
    }
    if (clip(f.get('agent'), 20)) data.agent = clip(f.get('agent'), 20);
    if (Object.keys(data).length) await exec(`INSERT INTO match_stats VALUES (?,?,?,?) ON CONFLICT(match_id, user_id) DO UPDATE SET data = excluded.data, at = excluded.at`, id, target, JSON.stringify(data), Date.now());
    return redirect(back);
  }

  if (action === 'setup') {
    const game = clip(f.get('game'), 5);
    if (!['valo', 'lol', 'rl', 'osu'].includes(game)) return redirect(back);
    const data: Record<string, string> = {};
    for (const [k, v] of f.entries()) if (/^[a-z]{2,12}$/.test(k) && !['action', 'back', 'game'].includes(k) && String(v).trim()) data[k] = String(v).trim().slice(0, 200);
    await exec('INSERT INTO setups VALUES (?,?,?,?) ON CONFLICT(user_id, game) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at', user.id, game, JSON.stringify(data), Date.now());
    return redirect(back);
  }

  if (action === 'vod') {
    const roster = Number(f.get('roster'));
    const url = clip(f.get('url'), 300);
    if (!canRoster(roster) || !/^https?:\/\//.test(url)) return redirect(back);
    // Le match doit appartenir au même roster
    const [m] = Number(f.get('match')) ? await rows<{ id: number }>('SELECT id FROM matches WHERE id = ? AND roster_id = ?', Number(f.get('match')), roster) : [];
    await exec('INSERT INTO vods (roster_id, title, url, match_id, added_by, at) VALUES (?,?,?,?,?,?)', roster, clip(f.get('title'), 100) || 'VOD', url, m ? Number(m.id) : null, user.id, Date.now());
    return redirect(back);
  }

  if (action === 'vod-mark') {
    const vod = Number(f.get('vod'));
    const [v] = await rows<{ roster_id: number }>('SELECT roster_id FROM vods WHERE id = ?', vod);
    if (!v || !canRoster(Number(v.roster_id))) return redirect(back);
    // « 1:23 », « 12:05 » ou « 1:02:03 » → secondes
    const t = clip(f.get('t'), 10).split(':').map(Number).reduce((s, x) => s * 60 + (Number.isFinite(x) ? x : 0), 0);
    const kind = ['bien', 'erreur', 'revoir', 'info'].includes(clip(f.get('kind'), 8)) ? clip(f.get('kind'), 8) : 'info';
    if (clip(f.get('text'), 400)) await exec('INSERT INTO vod_marks (vod_id, t, text, kind, author, at) VALUES (?,?,?,?,?,?)', vod, t, clip(f.get('text'), 400), kind, user.id, Date.now());
    return redirect(back);
  }

  if (action === 'doc') {
    const id = Number(f.get('id'));
    const title = clip(f.get('title'), 100), body = String(f.get('body') ?? '').slice(0, 20000);
    const pinned = me.staff && f.get('pinned') === '1' ? 1 : 0;
    const qs = back.includes('?') ? `&${back.split('?')[1]}` : '';
    if (!title) return redirect(back);
    if (id) {
      const [d] = await rows<{ roster_id: number; pinned: number }>('SELECT roster_id, pinned FROM docs WHERE id = ?', id);
      if (!d || !canRoster(Number(d.roster_id))) return redirect(back);
      await exec('UPDATE docs SET title = ?, body = ?, pinned = ?, author = ?, updated_at = ? WHERE id = ?', title, body, me.staff ? pinned : Number(d.pinned), user.id, Date.now(), id);
      return redirect(`/equipe/docs/?d=${id}${qs}`);
    }
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    const [n] = await rows<{ id: number }>('INSERT INTO docs (roster_id, title, body, pinned, author, updated_at) VALUES (?,?,?,?,?,?) RETURNING id', roster, title, body, pinned, user.id, Date.now());
    return redirect(n ? `/equipe/docs/?d=${n.id}${qs}` : back);
  }

  if (action === 'replay') {
    const id = Number(f.get('match'));
    const [m] = await rows<{ roster_id: number }>('SELECT roster_id FROM matches WHERE id = ?', id);
    if (!m || !canRoster(Number(m.roster_id))) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS match_replays (match_id INTEGER, replay TEXT, status TEXT DEFAULT 'attente', at INTEGER, PRIMARY KEY (match_id, replay))`).catch(() => {});
    // Liens ballchasing.com/replay/<uuid> : Oni Bot importe les stats dans la minute
    const ids = [...String(f.get('replays') ?? '').matchAll(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi)].map((x) => x[1].toLowerCase()).slice(0, 7);
    for (const r of ids) await exec(`INSERT OR IGNORE INTO match_replays (match_id, replay, status, at) VALUES (?,?, 'attente', ?)`, id, r, Date.now());
    return redirect(back);
  }

  if (action === 'adversaire') {
    const id = Number(f.get('id'));
    const fields = ['players', 'style', 'forces', 'faiblesses', 'plan', 'links'].map((k) => String(f.get(k) ?? '').slice(0, 4000));
    const name = clip(f.get('name'), 80);
    if (!name) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS opponents (id INTEGER PRIMARY KEY, roster_id INTEGER, name TEXT, players TEXT, style TEXT, forces TEXT, faiblesses TEXT, plan TEXT, links TEXT, author TEXT, updated_at INTEGER)`).catch(() => {});
    const qs = back.includes('?') ? `&${back.split('?')[1]}` : '';
    if (id) {
      const [o] = await rows<{ roster_id: number }>('SELECT roster_id FROM opponents WHERE id = ?', id);
      if (!o || !canRoster(Number(o.roster_id))) return redirect(back);
      await exec('UPDATE opponents SET name = ?, players = ?, style = ?, forces = ?, faiblesses = ?, plan = ?, links = ?, author = ?, updated_at = ? WHERE id = ?', name, ...fields, user.id, Date.now(), id);
      return redirect(`/equipe/scouting/?o=${id}${qs}`);
    }
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    const [n] = await rows<{ id: number }>('INSERT INTO opponents (roster_id, name, players, style, forces, faiblesses, plan, links, author, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING id', roster, name, ...fields, user.id, Date.now());
    return redirect(n ? `/equipe/scouting/?o=${n.id}${qs}` : back);
  }

  if (action === 'compo' && me.staff) {
    const id = Number(f.get('match'));
    const [m] = await rows<{ roster_id: number }>('SELECT roster_id FROM matches WHERE id = ?', id);
    if (!m) return redirect(back);
    const name = async (uid: string) => (await rows<{ name: string }>('SELECT name FROM guild_members WHERE id = ?', uid))[0]?.name ?? 'Joueur';
    const tit = f.getAll('titulaires').map(String).slice(0, 7);
    const sub = clip(f.get('remplacant'), 25);
    const lineup = { titulaires: await Promise.all(tit.map(async (u) => ({ id: u, nom: await name(u) }))), remplacant: sub ? { id: sub, nom: await name(sub) } : null, coach: null };
    await exec('UPDATE matches SET lineup = ? WHERE id = ?', tit.length ? JSON.stringify(lineup) : null, id);
    return redirect(back);
  }

  if (action === 'osu-map') {
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    // Accepte un lien de map (…/beatmapsets/123#osu/456 ou …/b/456) ou l'identifiant seul
    const raw = clip(f.get('map'), 200);
    const bid = Number(raw.match(/#osu\/(\d+)/)?.[1] ?? raw.match(/\/b(?:eatmaps)?\/(\d+)/)?.[1] ?? raw.match(/^(\d+)$/)?.[1]);
    if (!bid) return redirect(`${back}${back.includes('?') ? '&' : '?'}erreur=map`);
    const challenge = f.get('challenge') === '1' && me.staff ? 1 : 0;
    const days = Math.min(30, Math.max(1, Number(f.get('days')) || 7));
    await exec('INSERT INTO osu_maps (roster_id, beatmap_id, note, challenge, ends, added_by, at) VALUES (?,?,?,?,?,?,?)',
      roster, bid, clip(f.get('note'), 300) || null, challenge, challenge ? Date.now() + days * 86400_000 : null, user.id, Date.now());
    return redirect(back);
  }

  if (action === 'objectif' && me.staff) {
    const roster = Number(f.get('roster'));
    const due = clip(f.get('due'), 10);
    await exec(`CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY, roster_id INTEGER, user_id TEXT, title TEXT, detail TEXT, due INTEGER, status TEXT DEFAULT 'en-cours', progress INTEGER DEFAULT 0, created_by TEXT, at INTEGER, updated_at INTEGER)`).catch(() => {});
    if (clip(f.get('title'), 120)) await exec('INSERT INTO goals (roster_id, user_id, title, detail, due, created_by, at, updated_at) VALUES (?,?,?,?,?,?,?,?)',
      roster, clip(f.get('user'), 25) || null, clip(f.get('title'), 120), clip(f.get('detail'), 500) || null,
      /^\d{4}-\d{2}-\d{2}$/.test(due) ? Date.parse(`${due}T23:59:00+01:00`) : null, user.id, Date.now(), Date.now());
    return redirect(back);
  }

  if (action === 'objectif-maj') {
    const id = Number(f.get('id'));
    const [g] = await rows<{ roster_id: number; user_id: string | null }>('SELECT roster_id, user_id FROM goals WHERE id = ?', id);
    const may = g && (me.staff || g.user_id === user.id || (!g.user_id && me.rosterIds.includes(Number(g.roster_id))));
    let status = clip(f.get('status'), 12);
    if (!['en-cours', 'atteint', 'abandonne'].includes(status) || (status === 'abandonne' && !me.staff)) status = 'en-cours';
    const progress = status === 'atteint' ? 100 : Math.min(100, Math.max(0, Number(f.get('progress')) || 0));
    if (may) await exec('UPDATE goals SET progress = ?, status = ?, updated_at = ? WHERE id = ?', progress, status, Date.now(), id);
    return redirect(back);
  }

  if (action === 'tableau') {
    const roster = Number(f.get('roster'));
    const game = ['lol', 'rl', 'valo', 'osu'].includes(clip(f.get('game'), 5)) ? clip(f.get('game'), 5) : '';
    const url = clip(f.get('url'), 400);
    const bgRaw = clip(f.get('map'), 40);
    const bg = bgRaw === 'url' ? (/^https?:\/\//.test(url) ? url : 'blanc') : bgRaw || 'blanc';
    if (!canRoster(roster)) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, roster_id INTEGER, game TEXT, map TEXT, title TEXT, state TEXT, updated_at INTEGER, updated_by TEXT)`).catch(() => {});
    const [b] = await rows<{ id: number }>('INSERT INTO boards (roster_id, game, map, title, state, updated_at, updated_by) VALUES (?,?,?,?,?,?,?) RETURNING id',
      roster, game, bg, clip(f.get('title'), 60) || 'Tableau', JSON.stringify({ bg, notes: '', frames: [{ name: 'Étape 1', items: [], strokes: [] }] }), Date.now(), user.id);
    const r = new URL(back, 'http://x').searchParams.get('r');
    return redirect(b ? `/equipe/tactique/?b=${b.id}${r ? `&r=${r}` : ''}` : back);
  }

  if (action === 'suppr') {
    // Supprimer un draft ou une lineup : l'auteur ou l'encadrement
    const id = Number(f.get('id'));
    if (clip(f.get('table'), 10) === 'boards') {
      // Un tableau appartient au roster : n'importe quel membre du roster (ou l'encadrement) peut le supprimer
      const [b] = await rows<{ roster_id: number }>('SELECT roster_id FROM boards WHERE id = ?', id);
      if (b && canRoster(Number(b.roster_id))) await exec('DELETE FROM boards WHERE id = ?', id);
      return redirect(back);
    }
    const tname = clip(f.get('table'), 10);
    if (['osu_maps', 'vods', 'docs'].includes(tname)) {
      // Contenus du roster : l'auteur ou l'encadrement
      const col = tname === 'docs' ? 'author' : 'added_by';
      const [row] = await rows<{ who: string; roster_id: number }>(`SELECT ${col} AS who, roster_id FROM ${tname} WHERE id = ?`, id);
      if (row && (row.who === user.id || me.staff)) { await exec(`DELETE FROM ${tname} WHERE id = ?`, id); if (tname === 'vods') await exec('DELETE FROM vod_marks WHERE vod_id = ?', id); }
      return redirect(back);
    }
    const table = tname === 'lineups' ? 'lineups' : 'drafts';
    const [row] = await rows<{ author: string }>(`SELECT author FROM ${table} WHERE id = ?`, id);
    if (row && (row.author === user.id || me.staff)) await exec(`DELETE FROM ${table} WHERE id = ?`, id);
    return redirect(back);
  }
  return redirect(back);
};

export const GET: APIRoute = async ({ cookies, url }) => {
  const t = await teamUser(cookies);
  if (!t) return new Response('[]', { status: 401 });
  const roster = Number(url.searchParams.get('roster'));
  if (!(t.me.staff || t.me.rosterIds.includes(roster))) return new Response('[]', { status: 403 });
  const type = url.searchParams.get('type');
  const names = `LEFT JOIN guild_members g ON g.id = x.author`;
  const data = type === 'lineups'
    ? await rows(`SELECT x.*, g.name AS author_name FROM lineups x ${names} WHERE x.roster_id = ? ORDER BY x.at DESC`, roster)
    : await rows(`SELECT x.id, x.title, x.data, x.at, x.author, g.name AS author_name FROM drafts x ${names} WHERE x.roster_id = ? ORDER BY x.at DESC LIMIT 50`, roster);
  return new Response(JSON.stringify({ me: t.user.id, staff: t.me.staff, items: data }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });
};
