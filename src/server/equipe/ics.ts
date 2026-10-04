// GET /api/equipe/agenda.ics?u=<id Discord>&k=<clé> : agenda perso d'un joueur (séances, scrims et matchs de ses rosters).
// Lien secret généré dans l'espace équipe : il se colle une fois dans Google Agenda / Apple / Outlook.
import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { rows } from '../db';
import { icsKey } from '../session';
import { calendar, matchEvent, MATCH_SQL, type IcsEvent } from '../ics';
import { access } from './access';

export const GET: APIRoute = async ({ url }) => {
  const u = url.searchParams.get('u') ?? '', k = url.searchParams.get('k') ?? '';
  const expected = process.env.SESSION_SECRET ? icsKey(u) : '';
  if (!/^\d{5,25}$/.test(u) || !expected || k.length !== expected.length || !timingSafeEqual(Buffer.from(k), Buffer.from(expected)))
    return new Response('Lien invalide', { status: 403 });
  const me = await access(u);
  // Encadrement : tous les rosters ; joueur : les siens
  const ids = me.rosters.map((r) => Number(r.id));
  const since = Date.now() - 30 * 86400_000;
  const marks = ids.map(() => '?').join(',');
  const trainings = ids.length ? await rows<{ id: number; at: number; duration: number; kind: string; note: string | null; roster_id: number }>(
    `SELECT id, at, duration, kind, note, roster_id FROM trainings WHERE cancelled = 0 AND at > ? AND roster_id IN (${marks})`, since, ...ids) : [];
  const own = ids.length ? await rows<any>(`${MATCH_SQL} WHERE m.at > ? AND m.roster_id IN (${marks})`, since, ...ids) : [];
  const club = await rows<any>(`${MATCH_SQL} WHERE m.at > ? AND COALESCE(m.kind, 'officiel') != 'scrim' ${ids.length ? `AND (m.roster_id IS NULL OR m.roster_id NOT IN (${marks}))` : ''}`, since, ...ids);
  const name = new Map(me.rosters.map((r) => [Number(r.id), r.name]));
  const events: IcsEvent[] = [
    ...trainings.map((t) => ({
      uid: `seance-${t.id}`, start: Number(t.at), minutes: Number(t.duration),
      title: `${t.kind} · ${name.get(Number(t.roster_id)) ?? 'Roster'}`,
      description: `${t.note ? t.note + '\n' : ''}Réponds Présent / Absent : https://oni-korp.vercel.app/equipe/#seance-${t.id}`,
    })),
    ...[...own, ...club].map(matchEvent),
  ];
  const res = calendar(`Oni Korp · ${me.member?.name ?? 'mon agenda'}`, events);
  res.headers.set('Cache-Control', 'private, max-age=300');
  return res;
};
