// Disponibilités des rosters (v2) : par jour, un état (dispo, pas sûr, pas dispo) et une heure de début facultative,
// comme dans les Google Sheets d'équipe, mais calculées : la grille d'équipe par poste dit seule quels soirs sont jouables.
// - POST /api/equipe/dispos : enregistrer ma semaine, l'enregistrer comme semaine type, ou appliquer ma semaine type
// - loadDispos() : la grille d'un roster pour une semaine, et le verdict « jouable » de chaque jour
import type { APIRoute } from 'astro';
import { currentSession, sameOrigin } from '../session';
import { exec, rows } from '../db';
import { access, canLead, canSee } from './access';

export const HOURS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
/** Choix d'un jour, dans l'ordre du menu : vide, dispo (toute la soirée), dispo dès telle heure, pas sûr, pas dispo. */
export const CHOICES: [string, string][] = [
  ['', '·'], ['oui', 'Dispo'], ...HOURS.map((h) => [`oui@${h}`, `Dès ${h.replace(':', 'h')}`] as [string, string]), ['peut', 'Pas sûr'], ['non', 'Pas dispo'],
];
/** Postes par jeu : les postes « titulaires » d'abord (ceux qu'il faut couvrir), puis remplaçant et coach. */
export const POSTES: Record<string, string[]> = {
  lol: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
  valo: ['Duelliste', 'Initiateur', 'Contrôleur', 'Sentinelle', 'Flex'],
  rl: ['Joueur'], osu: ['Joueur'],
};
export const EXTRA_POSTES = ['Remplaçant', 'Coach'];
/** Programme du jour (07/10, comme le menu des Sheets d'équipe) : ce que le roster fait ce soir-là, choisi par le capitaine,
 *  le coach ou le staff, avec une heure facultative. « À voir » = jour à décider, « OFF » = repos. */
export const PROGRAMMES: Record<string, string[]> = {
  lol: ['Scrim', 'Scrim + débrief', 'Clash', 'Entraînement', 'Review + Flex', 'Réunion + Flex', 'Flex', 'Match', 'OFF', 'À voir'],
  valo: ['Scrim', 'Scrim + débrief', 'Premier', 'Entraînement', 'Review', 'Réunion', 'Ranked ensemble', 'Match', 'OFF', 'À voir'],
  rl: ['Scrim', 'Scrim + débrief', 'Entraînement', 'Review', 'Ranked 3v3 ensemble', 'Tournoi', 'Match', 'OFF', 'À voir'],
  osu: ['Entraînement', 'Mappool', 'Review', 'Tournoi', 'Match', 'OFF', 'À voir'],
};
export type Plan = { kind: string; start: string | null } | null;
/** Joueurs nécessaires pour jouer (match ou scrim). */
export const NEEDED: Record<string, number> = { lol: 5, valo: 5, rl: 3, osu: 1 };

let ready = false;
async function tables() {
  if (ready) return;
  await exec('CREATE TABLE IF NOT EXISTS dispo_days (roster_id INTEGER, week TEXT, user_id TEXT, day INTEGER, state TEXT, start TEXT, PRIMARY KEY (roster_id, week, user_id, day))');
  await exec('CREATE TABLE IF NOT EXISTS dispo_type (roster_id INTEGER, user_id TEXT, data TEXT, PRIMARY KEY (roster_id, user_id))');
  await exec('CREATE TABLE IF NOT EXISTS roster_postes (roster_id INTEGER, user_id TEXT, poste TEXT, PRIMARY KEY (roster_id, user_id))');
  await exec('CREATE TABLE IF NOT EXISTS day_plan (roster_id INTEGER, week TEXT, day INTEGER, kind TEXT, start TEXT, by TEXT, at INTEGER, PRIMARY KEY (roster_id, week, day))');
  ready = true;
}

const parse = (v: string): { state: string; start: string | null } | null => {
  if (v === 'oui' || v === 'peut' || v === 'non') return { state: v, start: null };
  const m = v.match(/^oui@(\d{2}:\d{2})$/);
  return m && HOURS.includes(m[1]) ? { state: 'oui', start: m[1] } : null;
};
export const encode = (d: { state: string; start: string | null } | undefined) => (d ? (d.state === 'oui' && d.start ? `oui@${d.start}` : d.state) : '');

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await currentSession(cookies);
  if (!user || !sameOrigin(request)) return redirect('/equipe/');
  const f = await request.formData();
  const roster = Number(f.get('roster'));
  const week = String(f.get('week'));
  const me = await access(user.id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || !canSee(me, roster)) return redirect('/equipe/');
  await tables();
  const action = String(f.get('action') ?? 'save');
  const back = `/equipe/planning/?r=${encodeURIComponent(String(f.get('slug') ?? ''))}&sem=${encodeURIComponent(String(f.get('sem') ?? ''))}#dispos-${roster}`;

  // Programme de la semaine (capitaine, coach, staff)
  if (action === 'programme') {
    if (!canLead(me, roster)) return redirect(back);
    for (let d = 0; d < 7; d++) {
      const kind = String(f.get(`p${d}`) ?? '').slice(0, 40);
      const start = String(f.get(`h${d}`) ?? '');
      if (kind) await exec('INSERT INTO day_plan VALUES (?,?,?,?,?,?,?) ON CONFLICT(roster_id, week, day) DO UPDATE SET kind = excluded.kind, start = excluded.start, by = excluded.by, at = excluded.at', roster, week, d, kind, HOURS.includes(start) ? start : null, user.id, Date.now());
      else await exec('DELETE FROM day_plan WHERE roster_id = ? AND week = ? AND day = ?', roster, week, d);
    }
    return redirect(back);
  }

  // Mon poste dans ce roster
  const poste = String(f.get('poste') ?? '');
  if (poste) await exec('INSERT INTO roster_postes VALUES (?,?,?) ON CONFLICT(roster_id, user_id) DO UPDATE SET poste = excluded.poste', roster, user.id, poste.slice(0, 30));

  let days: (string)[] = Array.from({ length: 7 }, (_, d) => String(f.get(`d${d}`) ?? ''));
  if (action === 'apply-type') {
    const [t] = await rows<{ data: string }>('SELECT data FROM dispo_type WHERE roster_id = ? AND user_id = ?', roster, user.id);
    if (!t) return redirect(back);
    days = JSON.parse(t.data);
  }
  for (let d = 0; d < 7; d++) {
    const v = parse(days[d] ?? '');
    if (v) await exec('INSERT INTO dispo_days VALUES (?,?,?,?,?,?) ON CONFLICT(roster_id, week, user_id, day) DO UPDATE SET state = excluded.state, start = excluded.start', roster, week, user.id, d, v.state, v.start);
    else await exec('DELETE FROM dispo_days WHERE roster_id = ? AND week = ? AND user_id = ? AND day = ?', roster, week, user.id, d);
  }
  if (action === 'save-type') await exec('INSERT INTO dispo_type VALUES (?,?,?) ON CONFLICT(roster_id, user_id) DO UPDATE SET data = excluded.data', roster, user.id, JSON.stringify(days.map((v) => (parse(v) ? v : ''))));
  return redirect(back);
};

export type Day = { state: string; start: string | null };
export type Verdict = { ok: boolean; label: string; detail: string };

/** Grille d'un roster pour une semaine : jours de chacun, postes, semaine type, et verdict par jour. */
export async function loadDispos(rosterId: number, game: string, week: string, members: { id: string; name: string; avatar: string }[], meId: string) {
  await tables();
  const days = await rows<{ user_id: string; day: number; state: string; start: string | null }>('SELECT user_id, day, state, start FROM dispo_days WHERE roster_id = ? AND week = ?', rosterId, week);
  const postes = new Map((await rows<{ user_id: string; poste: string }>('SELECT user_id, poste FROM roster_postes WHERE roster_id = ?', rosterId)).map((p) => [p.user_id, p.poste]));
  const [type] = await rows<{ data: string }>('SELECT data FROM dispo_type WHERE roster_id = ? AND user_id = ?', rosterId, meId);
  const grid = new Map<string, Day[]>(members.map((m) => [m.id, Array.from({ length: 7 }, () => ({ state: '', start: null }))]));
  for (const d of days) { const g = grid.get(d.user_id); if (g) g[d.day] = { state: d.state, start: d.start }; }

  const order = [...(POSTES[game] ?? []), ...EXTRA_POSTES];
  const people = members.map((m) => ({ ...m, poste: postes.get(m.id) ?? null, days: grid.get(m.id)! }))
    .sort((a, b) => (a.poste ? order.indexOf(a.poste) : 99) - (b.poste ? order.indexOf(b.poste) : 99) || a.name.localeCompare(b.name));
  const players = people.filter((p) => p.poste !== 'Coach');
  const needed = Math.min(NEEDED[game] ?? 5, Math.max(1, players.length));
  const main = (POSTES[game] ?? []).length > 1 ? POSTES[game] : [];

  // Jouable ? Assez de joueurs dispo ; l'heure est celle où le dernier nécessaire arrive ; les postes titulaires couverts si renseignés
  const verdicts: Verdict[] = Array.from({ length: 7 }, (_, d) => {
    const yes = players.filter((p) => p.days[d].state === 'oui');
    const maybe = players.filter((p) => p.days[d].state === 'peut').length;
    const missing = main.filter((po) => po !== 'Flex' && players.some((p) => p.poste === po) && !yes.some((p) => p.poste === po));
    if (yes.length >= needed && !missing.length) {
      const starts = yes.map((p) => p.days[d].start ?? '00:00').sort();
      const at = starts[needed - 1];
      return { ok: true, label: at === '00:00' ? 'Jouable' : `Dès ${at.replace(':', 'h')}`, detail: `${yes.length}/${players.length} dispo` };
    }
    const label = `${yes.length}/${needed}`;
    return { ok: false, label, detail: [maybe ? `+ ${maybe} pas sûr${maybe > 1 ? 's' : ''}` : '', missing.length ? `manque ${missing.join(', ')}` : ''].filter(Boolean).join(' · ') };
  });
  const plans: Plan[] = Array.from({ length: 7 }, () => null);
  for (const pl of await rows<{ day: number; kind: string; start: string | null }>('SELECT day, kind, start FROM day_plan WHERE roster_id = ? AND week = ?', rosterId, week)) plans[pl.day] = { kind: pl.kind, start: pl.start };
  return { people, mine: grid.get(meId) ?? null, myPoste: postes.get(meId) ?? null, hasType: !!type, verdicts, plans, programmes: PROGRAMMES[game] ?? PROGRAMMES.lol, postes: order };
}
