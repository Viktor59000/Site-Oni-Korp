// GET /api/auth/login → page de connexion Discord
import type { APIRoute } from 'astro';
import { randomBytes } from 'node:crypto';

export const GET: APIRoute = ({ cookies, url, redirect }) => {
  const state = randomBytes(16).toString('hex');
  cookies.set('oni_oauth_state', state, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600 });
  // Page où revenir après la connexion (chemin interne uniquement)
  const next = url.searchParams.get('next') ?? '';
  if (/^\/[a-z]/.test(next)) cookies.set('oni_next', next, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600 });
  const q = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID ?? '', response_type: 'code', scope: 'identify guilds.members.read',
    redirect_uri: `${url.origin}/api/auth/callback`, state,
  });
  return redirect(`https://discord.com/oauth2/authorize?${q}`);
};
