// Session de l'espace équipe : cookie signé (HMAC-SHA256) qui ne contient que l'identité Discord.
// Les rôles sont relus à chaque page dans la base (miroir tenu à jour par Oni Bot).
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { exec, rows } from './db';

export interface SessionUser { id: string; name: string; avatar: string | null; exp: number; v?: number }
const COOKIE = 'oni_session';
const secret = () => process.env.SESSION_SECRET ?? '';
const sign = (data: string) => createHmac('sha256', secret()).update(data).digest('base64url');

// Clés par membre : version de session (« me déconnecter partout » l'incrémente) et sel du lien d'agenda perso
const KEYS_SQL = `CREATE TABLE IF NOT EXISTS user_keys (user_id TEXT PRIMARY KEY, ics_salt TEXT DEFAULT '', session_v INTEGER DEFAULT 0)`;
export async function userKeys(userId: string) {
  const [k] = await rows<{ ics_salt: string; session_v: number }>('SELECT ics_salt, session_v FROM user_keys WHERE user_id = ?', userId);
  return { salt: String(k?.ics_salt ?? ''), v: Number(k?.session_v ?? 0) };
}
export async function bumpKey(userId: string, what: 'session' | 'ics') {
  await exec(KEYS_SQL);
  await exec(`INSERT INTO user_keys (user_id, ics_salt, session_v) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET ${what === 'session' ? 'session_v = session_v + 1' : 'ics_salt = excluded.ics_salt'}`,
    userId, what === 'ics' ? createHmac('sha256', String(Math.random())).update(String(Date.now())).digest('hex').slice(0, 16) : '', what === 'session' ? 1 : 0);
}

/** Session valide ET pas révoquée (« me déconnecter partout »). À utiliser partout côté serveur. */
export async function currentSession(cookies: AstroCookies): Promise<SessionUser | null> {
  const u = getSession(cookies); if (!u) return null;
  if (import.meta.env.DEV && process.env.ONI_DEV_USER) return u;
  return (await userKeys(u.id)).v === Number(u.v ?? 0) ? u : null;
}

export function setSession(cookies: AstroCookies, user: Omit<SessionUser, 'exp'>) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 14 * 86400_000 })).toString('base64url');
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 14 * 86400 });
}

export function getSession(cookies: AstroCookies): SessionUser | null {
  // Développement local uniquement : ONI_DEV_USER=<id Discord> simule une connexion
  if (import.meta.env.DEV && process.env.ONI_DEV_USER) return { id: process.env.ONI_DEV_USER, name: 'Test', avatar: null, exp: Date.now() + 1e9 };
  const raw = cookies.get(COOKIE)?.value; if (!raw || !secret()) return null;
  const [payload, mac] = raw.split('.');
  if (!payload || !mac) return null;
  const expected = sign(payload);
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  try { const u = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionUser; return u.exp > Date.now() ? u : null; } catch { return null; }
}

export const clearSession = (cookies: AstroCookies) => cookies.delete(COOKIE, { path: '/' });

/** Refuse les envois de formulaire venant d'un autre site. */
export const sameOrigin = (request: Request) => {
  const o = request.headers.get('origin'); if (!o) return true;
  return o === new URL(request.url).origin;
};

/** Clé du calendrier perso d'un membre (lien secret à coller dans son agenda, sans connexion). */
export const icsKey = (userId: string, salt = '') => sign(`ics:${userId}${salt ? `:${salt}` : ''}`).slice(0, 32);
