// GET /api/createurs : les créateurs de contenu du club (suivis par Oni Bot) : profil Twitch, live en cours,
// dernier live, activité du mois, et quelques chiffres d'ensemble pour l'en-tête de la page.
import type { APIRoute } from 'astro';
import { rows } from './db';

const twitchImg = (u: unknown) => (typeof u === 'string' && /^https:\/\/static-cdn\.jtvnw\.net\//.test(u) ? u : null);
// Twitch sert ses images en plusieurs tailles : avatar affiché en 72 px, bannière en carte (≈ 400 px) → versions réduites
const smaller = (u: string | null) => u?.replace(/profile_image-\d+x\d+\./, 'profile_image-150x150.').replace(/channel_offline_image-\d+x\d+\./, 'channel_offline_image-640x360.') ?? null;

export const GET: APIRoute = async () => {
  const list = await rows<any>(`SELECT c.user_id, c.twitch, c.youtube, c.twitch_profile, g.name, g.avatar FROM creators c LEFT JOIN guild_members g ON g.id = c.user_id`).catch(() => []);
  const d = new Date(), month = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const out = await Promise.all(list.map(async (c) => {
    const who = [c.user_id, c.twitch ?? '-'];
    const [live] = await rows<any>(`SELECT title, url, thumb, game FROM feed WHERE kind = 'live' AND ended_at IS NULL AND (user_id = ? OR author = ?) ORDER BY at DESC LIMIT 1`, ...who);
    const [last] = await rows<any>(`SELECT game, ended_at FROM feed WHERE kind = 'live' AND ended_at IS NOT NULL AND (user_id = ? OR author = ?) ORDER BY at DESC LIMIT 1`, ...who);
    const [m] = await rows<any>(`SELECT COUNT(*) AS n, SUM(COALESCE(ended_at, ?) - at) AS ms FROM feed WHERE kind = 'live' AND at >= ? AND (user_id = ? OR author = ?)`, Date.now(), month, ...who);
    const [video] = await rows<any>(`SELECT title, url FROM feed WHERE kind = 'video' AND user_id = ? ORDER BY at DESC LIMIT 1`, c.user_id);
    let p: any = {}; try { p = JSON.parse(c.twitch_profile ?? '{}') ?? {}; } catch {}
    return {
      nom: p.nom ?? c.name ?? c.twitch ?? 'Créateur',
      avatar: smaller(twitchImg(p.avatar)) ?? (c.avatar ? `/api/avatar?id=${c.user_id}` : null),
      banniere: smaller(twitchImg(p.banniere)),
      bio: typeof p.bio === 'string' ? p.bio.slice(0, 200) : null,
      twitch: c.twitch ? `https://www.twitch.tv/${c.twitch}` : null,
      youtube: c.youtube ? `https://www.youtube.com/channel/${c.youtube}` : null,
      live: live ? { titre: live.title, lien: live.url, image: live.thumb, jeu: live.game ?? null } : null,
      dernier: last ? { date: new Date(Number(last.ended_at)).toISOString(), jeu: last.game ?? null } : null,
      mois: { lives: Number(m?.n ?? 0), heures: Math.round(Number(m?.ms ?? 0) / 360_000) / 10 },
      video: video ? { titre: video.title, lien: video.url } : null,
    };
  }));
  // En live d'abord, puis les plus actifs du mois
  out.sort((a, b) => Number(!!b.live) - Number(!!a.live) || b.mois.heures - a.mois.heures);
  const total = { createurs: out.length, enLive: out.filter((c) => c.live).length, heures: Math.round(out.reduce((s, c) => s + c.mois.heures, 0) * 10) / 10 };
  return new Response(JSON.stringify({ createurs: out, total }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
};
