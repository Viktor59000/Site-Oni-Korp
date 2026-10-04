// GET /api/feed : live en cours et dernières vidéos (fil tenu par Oni Bot).
import type { APIRoute } from 'astro';
import { rows } from './db';

export const GET: APIRoute = async () => {
  const live = await rows<any>(`SELECT author, title, url, thumb, game, at FROM feed WHERE kind = 'live' AND ended_at IS NULL ORDER BY at DESC LIMIT 3`);
  const videos = await rows<any>(`SELECT author, title, url, thumb, at FROM feed WHERE kind = 'video' ORDER BY at DESC LIMIT 6`);
  const fmt = (r: any) => ({ auteur: r.author, titre: r.title, lien: r.url, image: r.thumb, jeu: r.game ?? null, date: new Date(Number(r.at)).toISOString() });
  return new Response(JSON.stringify({ live: live.map(fmt), videos: videos.map(fmt) }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
};
