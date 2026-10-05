// GET /api/createurs : les créateurs de contenu du club (suivis par Oni Bot) : chaînes, live en cours, activité du mois.
import type { APIRoute } from 'astro';
import { rows } from './db';

export const GET: APIRoute = async () => {
  const list = await rows<any>(`SELECT c.user_id, c.twitch, c.youtube, g.name, g.avatar FROM creators c LEFT JOIN guild_members g ON g.id = c.user_id`).catch(() => []);
  const d = new Date(), month = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const out = await Promise.all(list.map(async (c) => {
    const [live] = await rows<any>(`SELECT title, url, thumb, game FROM feed WHERE kind = 'live' AND ended_at IS NULL AND (user_id = ? OR author = ?) ORDER BY at DESC LIMIT 1`, c.user_id, c.twitch ?? '-');
    const [m] = await rows<any>(`SELECT COUNT(*) AS n, SUM(COALESCE(ended_at, ?) - at) AS ms FROM feed WHERE kind = 'live' AND at >= ? AND (user_id = ? OR author = ?)`, Date.now(), month, c.user_id, c.twitch ?? '-');
    const [video] = await rows<any>(`SELECT title, url, thumb FROM feed WHERE kind = 'video' AND user_id = ? ORDER BY at DESC LIMIT 1`, c.user_id);
    return {
      nom: c.name ?? c.twitch ?? 'Créateur', avatar: c.avatar ?? null,
      twitch: c.twitch ? `https://www.twitch.tv/${c.twitch}` : null,
      youtube: c.youtube ? `https://www.youtube.com/channel/${c.youtube}` : null,
      live: live ? { titre: live.title, lien: live.url, image: live.thumb, jeu: live.game ?? null } : null,
      mois: { lives: Number(m?.n ?? 0), heures: Math.round(Number(m?.ms ?? 0) / 360_000) / 10 },
      video: video ? { titre: video.title, lien: video.url, image: video.thumb } : null,
    };
  }));
  // En live d'abord, puis les plus actifs du mois
  out.sort((a, b) => Number(!!b.live) - Number(!!a.live) || b.mois.heures - a.mois.heures);
  return new Response(JSON.stringify({ createurs: out }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
};
