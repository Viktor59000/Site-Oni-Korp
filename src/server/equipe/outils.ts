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

  if (action === 'suppr') {
    // Supprimer un draft ou une lineup : l'auteur ou l'encadrement
    const table = clip(f.get('table'), 10) === 'lineups' ? 'lineups' : 'drafts';
    const id = Number(f.get('id'));
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
