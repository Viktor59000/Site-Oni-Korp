// POST /api/equipe/dispos : disponibilités de la semaine depuis le site.
import type { APIRoute } from 'astro';
import { getSession, sameOrigin } from '../session';
import { exec } from '../db';
import { access } from './access';

export const SLOTS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].flatMap((d) => [`${d}-aprem`, `${d}-soir`]);

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = getSession(cookies);
  if (!user || !sameOrigin(request)) return redirect('/equipe/');
  const f = await request.formData();
  const roster = Number(f.get('roster'));
  const week = String(f.get('week'));
  const me = await access(user.id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || !(me.staff || me.rosterIds.includes(roster))) return redirect('/equipe/');
  const slots = f.getAll('slot').map(String).filter((s) => SLOTS.includes(s));
  await exec('INSERT INTO availability VALUES (?,?,?,?) ON CONFLICT(roster_id, week, user_id) DO UPDATE SET slots = excluded.slots',
    roster, week, user.id, JSON.stringify(slots));
  return redirect(`/equipe/#dispos-${roster}`);
};
