// GET /api/sante : la base partagée avec Oni Bot est-elle configurée et joignable ? (aucun secret dans la réponse)
import type { APIRoute } from 'astro';
import { db } from './db';

export const GET: APIRoute = async () => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  // Quelle base est utilisée (nom d'hôte seulement) et quelles variables existent
  const host = (u?: string) => { try { return u ? new URL(u.replace(/^libsql:/, 'https:')).host.split('.')[0] : null; } catch { return '?'; } };
  const vars = { ONI_DB: host(process.env.ONI_DB_TURSO_DATABASE_URL), TURSO: host(process.env.TURSO_DATABASE_URL) };
  const c = db();
  if (!c) return new Response(JSON.stringify({ base: 'non configurée', variables: vars }), { headers });
  try {
    const t0 = Date.now();
    const r = await c.execute(`SELECT value FROM meta WHERE key = 'club:stats'`);
    const stats = r.rows[0] ? JSON.parse(String(r.rows[0].value)) : null;
    return new Response(JSON.stringify({ base: 'ok', ms: Date.now() - t0, variables: vars, botVuIlYA: stats ? `${Math.round((Date.now() - stats.at) / 60000)} min` : null }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ base: 'erreur', variables: vars, message: String((e as Error).message ?? e).replace(/eyJ[\w.-]+/g, '…').slice(0, 200) }), { headers });
  }
};
