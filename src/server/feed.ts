// GET /api/feed : lives en cours et dernières vidéos (fil tenu par Oni Bot).
// Le live d'une chaîne du club passe toujours en tête (club: true) ; chaine = pseudo Twitch, pour le lecteur intégré.
import type { APIRoute } from 'astro';
import { rows } from './db';

const twitchLogin = (url: string) => url.match(/twitch\.tv\/([a-z0-9_]{3,25})/i)?.[1]?.toLowerCase() ?? null;

export const GET: APIRoute = async () => {
  const [cl] = await rows<{ value: string }>(`SELECT value FROM meta WHERE key = 'club:twitch'`).catch(() => []);
  const club: string[] = cl ? JSON.parse(cl.value) : ['onikorp', '4c_korp', 'oni_korp'];
  const live = await rows<any>(`SELECT author, title, url, thumb, game, at FROM feed WHERE kind = 'live' AND ended_at IS NULL ORDER BY at DESC LIMIT 6`);
  const videos = await rows<any>(`SELECT author, title, url, thumb, at FROM feed WHERE kind = 'video' ORDER BY at DESC LIMIT 6`);
  const fmt = (r: any) => ({ auteur: r.author, titre: r.title, lien: r.url, image: r.thumb, jeu: r.game ?? null, date: new Date(Number(r.at)).toISOString() });
  const lives = live.map((r) => ({ ...fmt(r), club: club.includes(String(r.author)), chaine: twitchLogin(String(r.url)) }))
    .sort((a, b) => Number(b.club) - Number(a.club));
  return new Response(JSON.stringify({ live: lives, videos: videos.map(fmt) }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
};
