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
  // Tournois communautaires (Oni Bot) : même forme que les matchs, avec le lien d'inscription sur Discord
  const guild = process.env.DISCORD_GUILD_ID ?? '';
  const tq = `SELECT t.id, t.name, t.game, t.size, t.max, t.bo, t.starts_at, t.status, t.channel_id, t.message_id, w.name AS winner,
      (SELECT COUNT(*) FROM tourn_teams x WHERE x.tournament_id = t.id) AS teams
    FROM tournaments t LEFT JOIN tourn_teams w ON w.id = t.winner WHERE t.status IN ('inscriptions', 'en_cours', 'termine')`;
  const tfmt = (t: any) => ({
    id: 100000 + Number(t.id), type: 'Tournoi du club', code: t.game, jeu: JEUX[t.game] ?? t.game, roster: null, adversaire: t.name, titre: t.name, tournoi: true,
    format: `${t.size}v${t.size} · BO${t.bo} · ${t.teams}/${t.max} ${Number(t.size) === 1 ? 'joueurs' : 'équipes'}`,
    date: new Date(Number(t.starts_at)).toISOString(), statut: t.status, vainqueur: t.winner ?? null,
    lien: guild && t.message_id ? `https://discord.com/channels/${guild}/${t.channel_id}/${t.message_id}` : null,
    cast: null, compo: null, score: null,
  });
  const jeu = url.searchParams.get('jeu');
  const tj = jeu && jeu in JEUX ? `${tq} AND t.game = '${jeu}'` : tq;
  const qj = jeu && jeu in JEUX ? `${q} AND m.game = '${jeu}'` : q;
  const mois = url.searchParams.get('mois');
  if (mois && /^\d{4}-\d{2}$/.test(mois)) {
    const [y, mo] = mois.split('-').map(Number);
    // Marge d'un jour de chaque côté : le découpage par jour (heure de Paris) se fait dans la page
    const [a, b] = [Date.UTC(y, mo - 1, 1) - 86400_000, Date.UTC(y, mo, 1) + 86400_000];
    const list = await rows(`${qj} AND m.at BETWEEN ? AND ? ORDER BY m.at`, a, b);
    const tours = await rows(`${tj} AND t.starts_at BETWEEN ? AND ?`, a, b).catch(() => []);
    const all = [...list.map(fmt), ...tours.map(tfmt)].sort((x, y2) => x.date.localeCompare(y2.date));
    return new Response(JSON.stringify({ mois, matchs: all }), { headers });
  }
  const up = await rows(`${q} AND m.score_us IS NULL AND m.at > ? ORDER BY m.at LIMIT 20`, Date.now() - 3 * 3600_000);
  const done = await rows(`${q} AND m.score_us IS NOT NULL ORDER BY m.at DESC LIMIT 20`);
  const tUp = await rows(`${tq} AND t.status IN ('inscriptions', 'en_cours') ORDER BY t.starts_at LIMIT 10`).catch(() => []);
  const tDone = await rows(`${tq} AND t.status = 'termine' AND t.starts_at > ? ORDER BY t.starts_at DESC LIMIT 5`, Date.now() - 60 * 86400_000).catch(() => []);
  const aVenir = [...up.map(fmt), ...tUp.map(tfmt)].sort((x, y2) => x.date.localeCompare(y2.date));
  const resultats = [...done.map(fmt), ...tDone.map(tfmt)].sort((x, y2) => y2.date.localeCompare(x.date));
  return new Response(JSON.stringify({ aVenir, resultats }), { headers });
};
