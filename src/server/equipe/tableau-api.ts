// Tableau tactique partagé : GET /api/equipe/tableau?id=…&depuis=… (état si modifié depuis) · POST JSON { id, state } (enregistre)
// Synchronisation simple et robuste : chaque navigateur interroge toutes les 1,5 s tant que l'onglet est visible ;
// le dernier enregistrement gagne. Largement suffisant pour un roster de 5 à 10 personnes.
import type { APIRoute } from 'astro';
import { sameOrigin } from '../session';
import { exec, rows } from '../db';
import { canSee, teamUser } from './outils';

const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function ensureBoards() {
  await exec(`CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, roster_id INTEGER, game TEXT, map TEXT, title TEXT, state TEXT, updated_at INTEGER, updated_by TEXT)`).catch(() => {});
}

async function board(id: number, cookies: Parameters<APIRoute>[0]['cookies']) {
  const t = await teamUser(cookies);
  if (!t) return null;
  await ensureBoards();
  const [b] = await rows<{ id: number; roster_id: number; state: string; updated_at: number; updated_by: string; name: string | null }>(
    `SELECT b.id, b.roster_id, b.state, b.updated_at, b.updated_by, g.name FROM boards b LEFT JOIN guild_members g ON g.id = b.updated_by WHERE b.id = ?`, id);
  if (!b || !canSee(t.me, b.roster_id)) return null;
  return { t, b };
}

export const GET: APIRoute = async ({ url, cookies }) => {
  const r = await board(Number(url.searchParams.get('id')), cookies);
  if (!r) return json({ error: 'acces' }, 403);
  const since = Number(url.searchParams.get('depuis') ?? 0);
  if (Number(r.b.updated_at) <= since) return json({ changed: false, at: Number(r.b.updated_at) });
  return json({ changed: true, at: Number(r.b.updated_at), by: r.b.updated_by, byName: r.b.name, state: JSON.parse(r.b.state || '{}') });
};

/** État du tableau : identifiants courts, nombres finis, couleurs hexadécimales (rien qui puisse finir en HTML). */
function safe(v: unknown, key = '', depth = 0): boolean {
  if (depth > 8) return false;
  if (Array.isArray(v)) return v.every((x) => safe(x, key, depth + 1));
  if (v && typeof v === 'object') return Object.entries(v).every(([k, x]) => safe(x, k, depth + 1));
  if (key === 'id') return (typeof v === 'string' && /^[\w-]{1,64}$/.test(v)) || Number.isFinite(v);
  if (key === 'color') return typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v);
  if (['x', 'y', 'x2', 'y2', 'w'].includes(key)) return v == null || Number.isFinite(v);
  return v == null || ['string', 'number', 'boolean'].includes(typeof v);
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!sameOrigin(request)) return json({ error: 'origine' }, 403);
  const body = await request.json().catch(() => null) as { id: number; state: unknown } | null;
  if (!body) return json({ error: 'format' }, 400);
  const r = await board(Number(body.id), cookies);
  if (!r) return json({ error: 'acces' }, 403);
  if (!safe(body.state ?? {})) return json({ error: 'format' }, 400);
  const state = JSON.stringify(body.state ?? {});
  if (state.length > 200_000) return json({ error: 'trop gros' }, 413);
  const at = Date.now();
  await exec('UPDATE boards SET state = ?, updated_at = ?, updated_by = ? WHERE id = ?', state, at, r.t.user.id, r.b.id);
  return json({ ok: true, at });
};
