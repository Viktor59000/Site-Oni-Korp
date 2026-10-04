// POST /api/contact : formulaire public (partenaires, équipes, presse). Le message est relayé par Oni Bot dans #🔒・staff.
// Anti-spam : champ piège invisible + 3 messages par heure et par connexion (adresse IP hachée, effacée sous 48 h).
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { exec, rows } from './db';

const TYPES = ['partenariat', 'scrim', 'presse', 'autre'];

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const f = await request.formData();
  const s = (k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
  if (s('site', 10)) return redirect('/contact/?envoye=1'); // champ piège rempli : robot, on ne dit rien
  const type = TYPES.includes(s('type', 20)) ? s('type', 20) : 'autre';
  const name = s('nom', 120), reply = s('reponse', 200), message = s('message', 2000);
  if (!name || reply.length < 3 || message.length < 10) return redirect(`/contact/?erreur=champs&type=${type}`);

  const ip = createHash('sha256').update(`${clientAddress ?? ''}${process.env.SESSION_SECRET ?? ''}`).digest('hex').slice(0, 24);
  await exec(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, type TEXT, name TEXT, reply TEXT, message TEXT, at INTEGER, ip TEXT, message_id TEXT, status TEXT DEFAULT 'nouveau')`);
  const hour = Date.now() - 3600_000;
  const [mine] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM contacts WHERE ip = ? AND at > ?', ip, hour);
  const [all] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM contacts WHERE at > ?', hour);
  if (Number(mine?.n ?? 0) >= 3 || Number(all?.n ?? 0) >= 30) return redirect('/contact/?erreur=limite');
  await exec('INSERT INTO contacts (type, name, reply, message, at, ip) VALUES (?,?,?,?,?,?)', type, name, reply, message, Date.now(), ip);
  return redirect('/contact/?envoye=1');
};
