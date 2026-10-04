// GET /api/agenda : prochains matchs et derniers résultats, lus dans la base partagée avec Oni Bot.
import type { APIRoute } from 'astro';
import { createClient } from '@libsql/client';

const JEUX: Record<string, string> = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' };

export const GET: APIRoute = async () => {
  const url = process.env.TURSO_DATABASE_URL;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
  if (!url) return new Response(JSON.stringify({ aVenir: [], resultats: [] }), { headers });
  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const q = `SELECT m.id, m.game, m.opponent, m.format, m.at, m.link, m.score_us, m.score_them, r.name AS roster
             FROM matches m LEFT JOIN rosters r ON r.id = m.roster_id WHERE m.cancelled = 0`;
  const now = Date.now();
  const [up, done] = await Promise.all([
    db.execute({ sql: `${q} AND m.score_us IS NULL AND m.at > ? ORDER BY m.at LIMIT 10`, args: [now - 3 * 3600_000] }),
    db.execute({ sql: `${q} AND m.score_us IS NOT NULL ORDER BY m.at DESC LIMIT 10`, args: [] }),
  ]);
  const fmt = (r: any) => ({
    id: Number(r.id), jeu: JEUX[r.game] ?? r.game, roster: r.roster ?? null, adversaire: r.opponent, format: r.format,
    date: new Date(Number(r.at)).toISOString(), lien: r.link ?? null,
    score: r.score_us === null ? null : [Number(r.score_us), Number(r.score_them)],
  });
  return new Response(JSON.stringify({ aVenir: up.rows.map(fmt), resultats: done.rows.map(fmt) }), { headers });
};
