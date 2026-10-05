// GET /api/avatar?id=<membre> : avatar Discord servi par le site. Charger cdn.discordapp.com directement dépose un cookie
// tiers (Cloudflare) chez le visiteur. Pas de proxy ouvert : seul l'avatar enregistré du membre (relevé par Oni Bot) est servi.
import type { APIRoute } from 'astro';
import { rows } from './db';

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id') ?? '';
  if (!/^\d{17,20}$/.test(id)) return new Response(null, { status: 400 });
  const [m] = await rows<{ avatar: string | null }>('SELECT avatar FROM guild_members WHERE id = ?', id).catch(() => []);
  if (!m?.avatar || !/^https:\/\/cdn\.discordapp\.com\//.test(m.avatar)) return new Response(null, { status: 404 });
  const r = await fetch(m.avatar).catch(() => null);
  if (!r?.ok) return new Response(null, { status: 404 });
  return new Response(await r.arrayBuffer(), {
    headers: { 'Content-Type': r.headers.get('content-type') ?? 'image/webp', 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
  });
};
