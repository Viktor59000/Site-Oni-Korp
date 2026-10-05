// GET /api/sante : la base partagée avec Oni Bot est-elle configurée et joignable ? (aucun secret dans la réponse)
// Public : état, version déployée, dernier signal du bot. Détails (noms de base, clés présentes) : membres connectés à Inside seulement.
import type { APIRoute } from 'astro';
import { db } from './db';
import { currentSession } from './session';

export const GET: APIRoute = async ({ cookies }) => {
  const inside = !!(await currentSession(cookies).catch(() => null));
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  // Quelle base est utilisée (nom d'hôte seulement) et quelles variables existent
  const host = (u?: string) => { try { return u ? new URL(u.replace(/^libsql:/, 'https:')).host.split('.')[0] : null; } catch { return '?'; } };
  const vars = { ONI_DB: host(process.env.ONI_DB_TURSO_DATABASE_URL), TURSO: host(process.env.TURSO_DATABASE_URL),
    // Clés présentes ou non (jamais leur valeur) : sans clé, le site lit les stats relevées par Oni Bot
    cles: Object.fromEntries(['RIOT_API_KEY', 'OSU_CLIENT_ID', 'HENRIK_API_KEY', 'SESSION_SECRET', 'DISCORD_CLIENT_SECRET'].map((k) => [k, !!process.env[k]])) };
  const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null; // commit déployé (vérifier qu'un envoi est bien en ligne)
  const c = db();
  if (!c) return new Response(JSON.stringify({ base: 'non configurée', ...(inside ? { variables: vars } : {}) }), { headers });
  try {
    const t0 = Date.now();
    const r = await c.execute(`SELECT value FROM meta WHERE key = 'club:stats'`);
    const stats = r.rows[0] ? JSON.parse(String(r.rows[0].value)) : null;
    return new Response(JSON.stringify({ version, base: 'ok', ...(inside ? { depot: process.env.VERCEL_GIT_REPO_OWNER ?? null, ms: Date.now() - t0, variables: vars } : {}), botVuIlYA: stats ? `${Math.round((Date.now() - stats.at) / 60000)} min` : null }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ base: 'erreur', ...(inside ? { variables: vars } : {}), message: inside ? String((e as Error).message ?? e).replace(/eyJ[\w.-]+/g, '…').slice(0, 200) : undefined }), { headers });
  }
};
