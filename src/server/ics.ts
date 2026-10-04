// Calendriers à suivre (format iCalendar) : Google Agenda, Apple Calendrier et Outlook les relisent tout seuls.
// GET /agenda.ics : rendez-vous publics du club (tournois, ligues, showmatchs ; jamais les scrims).
import type { APIRoute } from 'astro';
import { rows } from './db';

export const JEUX: Record<string, string> = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' };
const KIND: Record<string, string> = { tournoi: 'Tournoi', ligue: 'Ligue', showmatch: 'Showmatch', officiel: 'Match officiel', scrim: 'Scrim' };
export const kindLabel = (k: string | null) => KIND[k ?? 'officiel'] ?? 'Match';

export interface IcsEvent { uid: string; start: number; minutes: number; title: string; description?: string; url?: string | null; cancelled?: boolean }

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => `\\${c}`);
// Lignes de 75 octets maximum (norme iCalendar)
const fold = (line: string) => {
  const out: string[] = []; let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > (out.length ? 74 : 75)) { out.push(cur); cur = ''; }
    cur += ch;
  }
  return [...out, cur].join('\r\n ');
};

export function calendar(name: string, events: IcsEvent[]): Response {
  const now = stamp(Date.now());
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Oni Korp//Agenda//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`, 'X-WR-TIMEZONE:Europe/Paris', 'REFRESH-INTERVAL;VALUE=DURATION:PT1H', 'X-PUBLISHED-TTL:PT1H',
    ...events.flatMap((e) => [
      'BEGIN:VEVENT', `UID:${e.uid}@oni-korp`, `DTSTAMP:${now}`, `DTSTART:${stamp(e.start)}`, `DTEND:${stamp(e.start + e.minutes * 60_000)}`,
      `SUMMARY:${esc(e.title)}`,
      ...(e.description ? [`DESCRIPTION:${esc(e.description)}`] : []),
      ...(e.url ? [`URL:${e.url}`, `LOCATION:${esc(e.url)}`] : []),
      ...(e.cancelled ? ['STATUS:CANCELLED'] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="oni-korp.ics"', 'Cache-Control': 'public, s-maxage=600' },
  });
}

type M = { id: number; game: string; opponent: string; format: string; at: number; link: string | null; kind: string | null; score_us: number | null; score_them: number | null; cancelled: number; roster: string | null };
export const MATCH_SQL = `SELECT m.id, m.game, m.opponent, m.format, m.at, m.link, m.kind, m.score_us, m.score_them, m.cancelled, r.name AS roster
  FROM matches m LEFT JOIN rosters r ON r.id = m.roster_id`;

export const matchEvent = (m: M): IcsEvent => {
  const score = m.score_us === null ? '' : ` (${m.score_us} – ${m.score_them})`;
  return {
    uid: `match-${m.id}`, start: Number(m.at), minutes: 120, cancelled: !!m.cancelled, url: m.link && /^https?:\/\//.test(m.link) ? m.link : null,
    title: `${kindLabel(m.kind)} · Oni Korp vs ${m.opponent}${score}`,
    description: [JEUX[m.game] ?? m.game, m.format, m.roster ? `Roster ${m.roster}` : ''].filter(Boolean).join(' · ') + '\nhttps://oni-korp.vercel.app/agenda/',
  };
};

export const GET: APIRoute = async () => {
  const list = await rows<M>(`${MATCH_SQL} WHERE COALESCE(m.kind, 'officiel') != 'scrim' AND m.at > ? ORDER BY m.at`, Date.now() - 90 * 86400_000);
  return calendar('Oni Korp', list.map(matchEvent));
};
