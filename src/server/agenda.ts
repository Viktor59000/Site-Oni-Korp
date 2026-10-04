// GET /api/agenda : prochains matchs et derniers résultats, lus dans la base partagée avec Oni Bot.
import type { APIRoute } from 'astro';
import { rows } from './db';
import { kindLabel } from './ics';

const JEUX: Record<string, string> = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' };

export const GET: APIRoute = async () => {
  // Variables posées par l'intégration Turso de Vercel (préfixe ONI_DB), sinon noms standards
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };
  const q = `SELECT m.id, m.game, m.opponent, m.format, m.at, m.link, m.kind, m.score_us, m.score_them, r.name AS roster, c.name AS caster, m.lineup
             FROM matches m LEFT JOIN rosters r ON r.id = m.roster_id LEFT JOIN guild_members c ON c.id = m.caster WHERE m.cancelled = 0 AND COALESCE(m.kind, 'officiel') != 'scrim'`;
  // Agenda public : tournois, ligues et showmatchs uniquement (les scrims restent dans l'espace équipe)
  const up = await rows(`${q} AND m.score_us IS NULL AND m.at > ? ORDER BY m.at LIMIT 20`, Date.now() - 3 * 3600_000);
  const done = await rows(`${q} AND m.score_us IS NOT NULL ORDER BY m.at DESC LIMIT 20`);
  const fmt = (r: any) => ({
    id: Number(r.id), type: kindLabel(r.kind), jeu: JEUX[r.game] ?? r.game, roster: r.roster ?? null, adversaire: r.opponent, format: r.format,
    date: new Date(Number(r.at)).toISOString(), lien: r.link ?? null,
    cast: r.caster ?? null,
    compo: (() => { try { const l = JSON.parse(r.lineup ?? 'null'); return l ? l.titulaires.map((t: { nom: string }) => t.nom) : null; } catch { return null; } })(),
    score: r.score_us === null ? null : [Number(r.score_us), Number(r.score_them)],
  });
  return new Response(JSON.stringify({ aVenir: up.map(fmt), resultats: done.map(fmt) }), { headers });
};
