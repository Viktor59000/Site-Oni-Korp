// GET /api/inhouse[?saison=N] : classements des inhouses (Oni Bot) par mode, et dernières parties.
import type { APIRoute } from 'astro';
import { rows } from './db';

const MODES = ['rl-3v3', 'rl-2v2', 'rl-1v1', 'lol-5v5', 'valo-5v5'];

export const GET: APIRoute = async ({ url }) => {
  const [meta] = await rows<{ value: string }>(`SELECT value FROM meta WHERE key = 'inhouse_season'`).catch(() => []);
  const current = Number(meta?.value) || 1;
  const asked = Number(url.searchParams.get('saison'));
  const season = asked >= 1 && asked <= current ? asked : current;
  type E = { user_id: string; mode: string; rating: number; wins: number; losses: number; streak: number; best: number; name: string | null; avatar: string | null };
  const elo = await rows<E>(`SELECT e.user_id, e.mode, e.rating, e.wins, e.losses, e.streak, e.best, g.name, g.avatar FROM inhouse_elo e
    LEFT JOIN guild_members g ON g.id = e.user_id WHERE e.season = ? AND e.wins + e.losses > 0 ORDER BY e.rating DESC`, season).catch(() => []);
  const recent = await rows<{ id: number; mode: string; winner: number; delta: number; ended_at: number; team1: string; team2: string }>(
    `SELECT id, mode, winner, delta, ended_at, team1, team2 FROM inhouse_matches WHERE season = ? AND status = 'done' ORDER BY ended_at DESC LIMIT 8`, season).catch(() => []);
  const names = new Map(elo.map((e) => [e.user_id, e.name ?? 'Membre']));
  const body = {
    season, current,
    modes: Object.fromEntries(MODES.map((m) => [m, elo.filter((e) => e.mode === m).slice(0, 50).map((e) => ({
      name: e.name ?? 'Membre', avatar: e.avatar, rating: Number(e.rating), wins: Number(e.wins), losses: Number(e.losses), streak: Number(e.streak), best: Number(e.best),
    }))])),
    recent: recent.map((r) => ({
      id: Number(r.id), mode: r.mode, at: Number(r.ended_at), delta: Number(r.delta),
      winners: (JSON.parse(Number(r.winner) === 1 ? r.team1 : r.team2) as string[]).map((id) => names.get(id) ?? 'Membre'),
      losers: (JSON.parse(Number(r.winner) === 1 ? r.team2 : r.team1) as string[]).map((id) => names.get(id) ?? 'Membre'),
    })),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
};
