// POST /api/avis : bouton « Un avis ? » (site public et Inside). Idée, bug ou remarque, anonyme si on veut.
// Même circuit que le contact : rangé dans la table contacts, relayé par Oni Bot dans #🔒・staff avec un bouton « Traité ».
// Anti-spam : champ piège + 5 avis par heure et par connexion (adresse IP hachée).
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { exec, rows } from './db';
import { currentSession } from './session';

const KINDS = ['idee', 'bug', 'remarque'];
const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const f = await request.formData();
  const s = (k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
  if (s('site', 10)) return json({ ok: true }); // champ piège rempli : robot
  const kind = KINDS.includes(s('kind', 10)) ? s('kind', 10) : 'remarque';
  const message = s('message', 1500);
  if (message.length < 5) return json({ ok: false, error: 'Écris quelques mots.' }, 400);
  const page = s('page', 200).replace(/^https?:\/\/[^/]+/, '') || '/';
  // Connecté avec Discord : on signe avec le pseudo, sauf si la personne coche « anonyme »
  const user = await currentSession(cookies).catch(() => null);
  const name = s('anonyme', 2) === '1' || !user ? 'Anonyme' : user.name;
  const ip = createHash('sha256').update(`${clientAddress ?? ''}${process.env.SESSION_SECRET ?? ''}`).digest('hex').slice(0, 24);
  await exec(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, type TEXT, name TEXT, reply TEXT, message TEXT, at INTEGER, ip TEXT, message_id TEXT, status TEXT DEFAULT 'nouveau')`);
  const [mine] = await rows<{ n: number }>("SELECT COUNT(*) AS n FROM contacts WHERE ip = ? AND at > ? AND type LIKE 'avis-%'", ip, Date.now() - 3600_000);
  if (Number(mine?.n ?? 0) >= 5) return json({ ok: false, error: 'Merci ! Tu as déjà envoyé plusieurs avis cette heure-ci, réessaie plus tard.' }, 429);
  await exec('INSERT INTO contacts (type, name, reply, message, at, ip) VALUES (?,?,?,?,?,?)',
    `avis-${kind}`, name, `Page : ${page}${user && name !== 'Anonyme' ? ` · Discord <@${user.id}>` : ''}`, message, Date.now(), ip);
  return json({ ok: true });
};
