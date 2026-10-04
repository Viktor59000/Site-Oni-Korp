// GET /api/agenda : prochains matchs et derniers résultats, lus dans la base partagée avec Oni Bot.
import type { APIRoute } from 'astro';
import { rows } from './db';
import { kindLabel } from './ics';

const JEUX: Record<string, string> = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' };

// ?mois=AAAA-MM : tous les rendez-vous publics du mois (calendrier) ; ?jeu=rl|lol|valo|osu pour filtrer.
export const GET: APIRoute = async ({ url }) => {
  // Variables posées par l'intégration Turso de Vercel (préfixe ONI_DB), sinon noms standards
  // Navigateur : toujours à jour ; CDN Vercel : 60 s (+ 5 min en arrière-plan)
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=0, must-revalidate', 'Vercel-CDN-Cache-Control': 'max-age=60, stale-while-revalidate=300' };
  const q = `SELECT m.id, m.game, m.opponent, m.format, m.at, m.link, m.kind, m.score_us, m.score_them, r.name AS roster, c.name AS caster, m.lineup
             FROM matches m LEFT JOIN rosters r ON r.id = m.roster_id LEFT JOIN guild_members c ON c.id = m.caster WHERE m.cancelled = 0 AND COALESCE(m.kind, 'officiel') != 'scrim'`;
  // Agenda public : tournois, ligues et showmatchs uniquement (les scrims restent dans l'espace équipe)
  const fmt = (r: any) => ({
    id: Number(r.id), type: kindLabel(r.kind), code: r.game, jeu: JEUX[r.game] ?? r.game, roster: r.roster ?? null, adversaire: r.opponent, format: r.format,
    date: new Date(Number(r.at)).toISOString(), lien: r.link ?? null,
    cast: r.caster ?? null,
    compo: (() => { try { const l = JSON.parse(r.lineup ?? 'null'); return l ? l.titulaires.map((t: { nom: string }) => t.nom) : null; } catch { return null; } })(),
    score: r.score_us === null ? null : [Number(r.score_us), Number(r.score_them)],
  });
  const jeu = url.searchParams.get('jeu');
  const qj = jeu && jeu in JEUX ? `${q} AND m.game = '${jeu}'` : q;
  const mois = url.searchParams.get('mois');
  if (mois && /^\d{4}-\d{2}$/.test(mois)) {
    const [y, mo] = mois.split('-').map(Number);
    // Marge d'un jour de chaque côté : le découpage par jour (heure de Paris) se fait dans la page
    const list = await rows(`${qj} AND m.at BETWEEN ? AND ? ORDER BY m.at`, Date.UTC(y, mo - 1, 1) - 86400_000, Date.UTC(y, mo, 1) + 86400_000);
    return new Response(JSON.stringify({ mois, matchs: list.map(fmt) }), { headers });
  }
  const up = await rows(`${q} AND m.score_us IS NULL AND m.at > ? ORDER BY m.at LIMIT 20`, Date.now() - 3 * 3600_000);
  const done = await rows(`${q} AND m.score_us IS NOT NULL ORDER BY m.at DESC LIMIT 20`);
  return new Response(JSON.stringify({ aVenir: up.map(fmt), resultats: done.map(fmt) }), { headers });
};
