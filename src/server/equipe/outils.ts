// Outils de l'espace équipe : comptes de jeu, notes de match, drafts LoL, lineups Valorant.
// POST /api/equipe/outils (formulaire, champ « action ») · GET /api/equipe/outils?type=drafts|lineups&roster=ID (JSON)
import type { APIRoute, AstroCookies } from 'astro';
import { getSession, sameOrigin } from '../session';
import { exec, rows } from '../db';
import { access } from './access';

let ready = false;
/** Tables des outils (créées au premier usage ; Oni Bot les crée aussi). */
export async function ensureTables() {
  if (ready) return;
  for (const sql of [
    `CREATE TABLE IF NOT EXISTS accounts (user_id TEXT, game TEXT, ident TEXT, region TEXT, updated_at INTEGER, PRIMARY KEY (user_id, game))`,
    `CREATE TABLE IF NOT EXISTS match_notes (match_id INTEGER, user_id TEXT, good TEXT, work TEXT, rating INTEGER, at INTEGER, PRIMARY KEY (match_id, user_id))`,
    `CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY, roster_id INTEGER, title TEXT, data TEXT, author TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS lineups (id INTEGER PRIMARY KEY, roster_id INTEGER, map TEXT, agent TEXT, side TEXT, title TEXT, x REAL, y REAL, tx REAL, ty REAL, url TEXT, note TEXT, author TEXT, at INTEGER)`,
    `CREATE TABLE IF NOT EXISTS stats_cache (key TEXT PRIMARY KEY, value TEXT, at INTEGER)`,
  ]) await exec(sql).catch(() => {});
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
    try { JSON.parse(data); } catch { return redirect(back); }
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
    const game = clip(f.get('game'), 5) === 'lol' ? 'lol' : 'valo';
    if (!canRoster(roster)) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, roster_id INTEGER, game TEXT, map TEXT, title TEXT, state TEXT, updated_at INTEGER, updated_by TEXT)`).catch(() => {});
    const [b] = await rows<{ id: number }>('INSERT INTO boards (roster_id, game, map, title, state, updated_at, updated_by) VALUES (?,?,?,?,?,?,?) RETURNING id',
      roster, game, game === 'lol' ? 'Faille' : clip(f.get('map'), 40) || 'Ascent', clip(f.get('title'), 60) || 'Tableau', '{}', Date.now(), user.id);
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
    const table = clip(f.get('table'), 10) === 'lineups' ? 'lineups' : 'drafts';
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
