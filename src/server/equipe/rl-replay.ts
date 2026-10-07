// Replays Rocket League envoyés par Oni Sync (v6) : le joueur clique « Sauvegarder le replay » en fin de partie,
// Oni Sync repère le fichier .replay dans Documents\My Games\Rocket League\TAGame\Demos et l'envoie ici.
// Le site le met en file (table rl_replays) ; Oni Bot l'envoie à ballchasing avec la clé du club (jamais distribuée),
// attend l'analyse (pending → ok), puis fusionne les stats avancées et le rang dans la partie d'Oni Sync (même match_guid).
//   POST /api/rl/replay  (Authorization: Bearer <clé Oni Sync>, corps = fichier brut, en-tête X-Replay-Name)
import type { APIRoute } from 'astro';
import { exec, rows } from '../db';
import { ensureSync } from './rl-sync';

const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
// Vercel refuse les corps de plus de 4,5 Mo ; un replay de 5 à 10 minutes pèse 1 à 3 Mo
const MAX = 4_300_000;

let ready = false;
export async function ensureReplays() {
  if (ready) return;
  await exec(`CREATE TABLE IF NOT EXISTS rl_replays (id INTEGER PRIMARY KEY, user_id TEXT, name TEXT, data BLOB, size INTEGER, at INTEGER,
    status TEXT DEFAULT 'attente', bc_id TEXT, error TEXT, done_at INTEGER, UNIQUE (user_id, name))`);
  ready = true;
}

export const POST: APIRoute = async ({ request }) => {
  await ensureSync();
  await ensureReplays();
  const token = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  const [s] = token ? await rows<{ user_id: string }>('SELECT user_id FROM rl_sync WHERE token = ?', token) : [];
  if (!s) return json({ ok: false, error: 'Clé inconnue : retélécharge Oni Sync depuis Inside.' }, 401);
  const uid = String(s.user_id);
  const name = String(request.headers.get('x-replay-name') ?? '').replace(/[^\w.\-]/g, '').slice(0, 120);
  if (!/\.replay$/i.test(name)) return json({ ok: false, error: 'Nom de replay manquant.' }, 400);
  const [n] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM rl_replays WHERE user_id = ? AND at > ?', uid, Date.now() - 3600_000);
  if (Number(n?.n) >= 30) return json({ ok: false, error: 'Trop de replays envoyés en une heure.' }, 429);
  const buf = new Uint8Array(await request.arrayBuffer());
  if (buf.length > MAX) return json({ ok: false, error: 'Replay trop gros (plus de 4 Mo).' }, 413);
  if (buf.length < 10_000) return json({ ok: false, error: 'Fichier trop petit pour être un replay.' }, 400);
  // Déjà reçu (Oni Sync relancé, même fichier) : on ne le remet pas en file
  const [dup] = await rows('SELECT id FROM rl_replays WHERE user_id = ? AND name = ?', uid, name);
  if (dup) return json({ ok: true, message: 'Replay déjà reçu.' });
  await exec('INSERT INTO rl_replays (user_id, name, data, size, at) VALUES (?,?,?,?,?)', uid, name, buf, buf.length, Date.now());
  return json({ ok: true, message: 'Replay reçu : stats avancées et rang dans quelques minutes.' });
};
