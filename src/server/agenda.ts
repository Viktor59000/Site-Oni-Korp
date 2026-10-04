// GET /api/agenda : prochains matchs et derniers résultats, lus dans la base partagée avec Oni Bot.
import type { APIRoute } from 'astro';
import { rows } from './db';

const JEUX: Record<string, string> = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' };

export const GET: APIRoute = async () => {
  // Variables posées par l'intégration Turso de Vercel (préfixe ONI_DB), sinon noms standards
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
  const q = `SELECT m.id, m.game, m.opponent, m.format, m.at, m.link, m.score_us, m.score_them, r.name AS roster
             FROM matches m LEFT JOIN rosters r ON r.id = m.roster_id WHERE m.cancelled = 0`;
  const up = await rows(`${q} AND m.score_us IS NULL AND m.at > ? ORDER BY m.at LIMIT 10`, Date.now() - 3 * 3600_000);
  const done = await rows(`${q} AND m.score_us IS NOT NULL ORDER BY m.at DESC LIMIT 10`);
  const fmt = (r: any) => ({
    id: Number(r.id), jeu: JEUX[r.game] ?? r.game, roster: r.roster ?? null, adversaire: r.opponent, format: r.format,
    date: new Date(Number(r.at)).toISOString(), lien: r.link ?? null,
    score: r.score_us === null ? null : [Number(r.score_us), Number(r.score_them)],
  });
  return new Response(JSON.stringify({ aVenir: up.map(fmt), resultats: done.map(fmt) }), { headers });
};
