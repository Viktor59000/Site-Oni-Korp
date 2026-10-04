// GET /api/auth/callback : Discord renvoie ici après connexion. On vérifie que la personne est membre du serveur.
import type { APIRoute } from 'astro';
import { setSession } from '../session';

export const GET: APIRoute = async ({ cookies, url, redirect }) => {
  const code = url.searchParams.get('code'); const state = url.searchParams.get('state');
  const expected = cookies.get('oni_oauth_state')?.value;
  cookies.delete('oni_oauth_state', { path: '/' });
  const next = cookies.get('oni_next')?.value;
  cookies.delete('oni_next', { path: '/' });
  const back = next && /^\/[a-z]/.test(next) ? next : '/equipe/';
  const fail = (e: string) => redirect(`${back.split('?')[0]}?erreur=${e}`);
  if (!code || !state || state !== expected) return fail('connexion');

  const token = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID ?? '', client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
      grant_type: 'authorization_code', code, redirect_uri: `${url.origin}/api/auth/callback`,
    }),
  }).then((r) => (r.ok ? r.json() : null)) as { access_token?: string } | null;
  if (!token?.access_token) return fail('connexion');

  const guild = process.env.DISCORD_GUILD_ID;
  const member = await fetch(`https://discord.com/api/users/@me/guilds/${guild}/member`, { headers: { Authorization: `Bearer ${token.access_token}` } })
    .then((r) => (r.ok ? r.json() : null)) as { nick?: string; avatar?: string; user: { id: string; username: string; global_name?: string; avatar?: string } } | null;
  if (!member) return fail('membre');

  const u = member.user;
  const avatar = member.avatar ? `https://cdn.discordapp.com/guilds/${guild}/users/${u.id}/avatars/${member.avatar}.webp?size=128`
    : u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.webp?size=128` : null;
  setSession(cookies, { id: u.id, name: member.nick ?? u.global_name ?? u.username, avatar });
  return redirect(back);
};
