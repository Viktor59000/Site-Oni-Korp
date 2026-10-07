// Tracker Rocket League : « Oni Sync », petit programme Windows que le joueur lance à côté du jeu.
// Il lit l'API Stats locale de Rocket League (port 49123, activée par PacketSendRate dans DefaultStatsAPI.ini)
// et envoie chaque partie terminée ici. Le script envoie les messages BRUTS du jeu (dernier « UpdateState » + « MatchEnded ») :
// tout le décodage se fait côté site, on peut donc le corriger sans redistribuer le script.
//   GET  /api/rl/oni-sync  → télécharge Oni-Sync.cmd avec la clé personnelle (session Inside)
//   POST /api/rl/oni-sync  → nouvelle clé (l'ancienne cesse de marcher)
//   POST /api/rl/sync      → réception d'une partie (Authorization: Bearer <clé>)
import type { APIRoute } from 'astro';
import { sameOrigin } from '../session';
import { exec, rows } from '../db';
import { teamUser } from './outils';
import { ONI_ICON, ONI_SYNC_PS, ONI_SYNC_VERSION } from './oni-sync-script';

const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const norm = (s: string) => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '');

let ready = false;
export async function ensureSync() {
  if (ready) return;
  await exec(`CREATE TABLE IF NOT EXISTS rl_sync (user_id TEXT PRIMARY KEY, token TEXT UNIQUE, created_at INTEGER, last_at INTEGER, last_error TEXT)`);
  // Dernier signal d'Oni Sync (lancé, connecté au jeu, partie quittée) : pour aider un joueur à distance
  for (const c of ['seen_at INTEGER', 'seen_state TEXT', 'seen_note TEXT', 'version TEXT']) await exec(`ALTER TABLE rl_sync ADD COLUMN ${c}`).catch(() => {});
  ready = true;
}

const newToken = () => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function syncStatus(userId: string) {
  await ensureSync();
  const [s] = await rows<{ token: string; created_at: number; last_at: number | null; last_error: string | null; seen_at: number | null; seen_state: string | null; seen_note: string | null; version: string | null }>(
    'SELECT token, created_at, last_at, last_error, seen_at, seen_state, seen_note, version FROM rl_sync WHERE user_id = ?', userId);
  return s ?? null;
}

async function tokenFor(userId: string, fresh = false) {
  await ensureSync();
  const cur = await syncStatus(userId);
  if (cur && !fresh) return cur.token;
  const token = newToken();
  await exec(`INSERT INTO rl_sync (user_id, token, created_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET token = excluded.token, created_at = excluded.created_at`, userId, token, Date.now());
  return token;
}

// ---------- Téléchargement du script ----------
async function scriptFor(userId: string, token: string, origin: string) {
  const [acc] = await rows<{ ident: string }>(`SELECT ident FROM accounts WHERE user_id = ? AND game = 'rl'`, userId);
  const api = `${origin}/api/rl/sync`;
  return ONI_SYNC_PS.replace('__TOKEN__', token).replace('__API__', api).replace('__SITE__', url.origin).replace('__VERSION__', ONI_SYNC_VERSION).replaceAll('__ICON__', ONI_ICON)
    .replace('__PSEUDO__', (acc?.ident ?? '').replace(/'/g, "''"));
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const t = await teamUser(cookies);
  if (!t) return new Response('Connecte-toi à Inside.', { status: 401 });
  const token = await tokenFor(t.user.id);
  const ps = await scriptFor(t.user.id, token, url.origin);
  // La fenêtre de commande se ferme aussitôt : Oni Sync tourne caché, avec son icône près de l'horloge
  const cmd = [
    '@echo off',
    `start "" powershell -NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -Command "$env:ONI_SYNC_FILE='%~f0'; $s=[IO.File]::ReadAllText($env:ONI_SYNC_FILE,[Text.Encoding]::UTF8); iex $s.Substring($s.IndexOf('#ONI'+'PS')+6)"`,
    'exit /b',
    '#ONIPS',
    ps,
  ].join('\r\n');
  return new Response(cmd.replace(/\r?\n/g, '\r\n'), { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename="Oni-Sync.cmd"', 'Cache-Control': 'no-store' } });
};

// ---------- Réception d'une partie ----------
const data = (msg: any) => { const d = msg?.Data ?? msg?.data ?? msg; if (typeof d === 'string') { try { return JSON.parse(d); } catch { return {}; } } return d ?? {}; };
const pick = (o: any, ...keys: string[]) => { for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k]; return undefined; };
const num = (x: unknown) => (Number.isFinite(Number(x)) ? Number(x) : null);

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Nouvelle clé depuis Inside (formulaire)
  if (sameOrigin(request) && (request.headers.get('content-type') ?? '').includes('form')) {
    const t = await teamUser(cookies);
    if (!t) return redirect('/equipe/');
    await tokenFor(t.user.id, true);
    const back = String((await request.formData()).get('back') ?? '/equipe/rl/');
    return redirect(back.startsWith('/equipe/') ? `${back}${back.includes('?') ? '&' : '?'}cle=nouvelle` : '/equipe/rl/');
  }
  await ensureSync();
  const token = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  const [s] = token ? await rows<{ user_id: string }>('SELECT user_id FROM rl_sync WHERE token = ?', token) : [];
  if (!s) return json({ ok: false, error: 'Clé inconnue : retélécharge Oni Sync depuis Inside.' }, 401);
  const uid = String(s.user_id);
  const recent = await rows<{ n: number }>(`SELECT COUNT(*) AS n FROM perf WHERE user_id = ? AND game = 'rl' AND at > ?`, uid, Date.now() - 10 * 60_000);
  if (Number(recent[0]?.n) > 20) return json({ ok: false, error: 'Trop de parties envoyées d’un coup.' }, 429);
  const raw = await request.text();
  if (raw.length > 400_000) return json({ ok: false, error: 'Message trop gros.' }, 413);
  let body: any; try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'Message illisible.' }, 400); }

  // Signal d'état (pas une partie)
  if (body?.hello) {
    const h = body.hello;
    await exec('UPDATE rl_sync SET seen_at = ?, seen_state = ?, seen_note = ?, version = ? WHERE user_id = ?', Date.now(), String(h.state ?? '').slice(0, 20), String(h.note ?? '').slice(0, 200), String(h.version ?? '').slice(0, 10), uid);
    return json({ ok: true, latest: ONI_SYNC_VERSION });
  }

  // Les premiers messages reçus sont gardés tels quels (débogage du format de l'API Stats)
  const [dbg] = await rows<{ value: string }>(`SELECT value FROM stats_cache WHERE key = 'rl-sync-raw'`);
  const kept = JSON.parse(dbg?.value ?? '[]') as unknown[];
  if (kept.length < 3) await exec(`INSERT INTO stats_cache (key, value, at) VALUES ('rl-sync-raw', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, at = excluded.at`, JSON.stringify([...kept, { uid, at: Date.now(), body: raw.slice(0, 60_000) }]), Date.now()).catch(() => {});

  const st = data(body.last), en = data(body.end);
  const game = pick(st, 'Game', 'game') ?? {};
  const players: any[] = pick(st, 'Players', 'players') ?? [];
  const [acc] = await rows<{ ident: string }>(`SELECT ident FROM accounts WHERE user_id = ? AND game = 'rl'`, uid);
  const me = players.find((p) => acc && norm(pick(p, 'Name', 'name')) === norm(acc.ident));
  const fail = async (error: string) => { await exec('UPDATE rl_sync SET last_error = ? WHERE user_id = ?', error, uid); return json({ ok: false, error }, 422); };
  if (!players.length) return fail('Partie reçue sans joueurs : l’API Stats du jeu n’est peut-être pas activée.');
  if (!acc) return fail('Relie d’abord ton pseudo Rocket League dans Inside > Joueurs.');
  if (!me) return fail(`Pseudo « ${acc.ident} » introuvable dans la partie (joueurs : ${players.map((p) => pick(p, 'Name', 'name')).join(', ')}). Corrige ton pseudo dans Inside > Joueurs.`);

  const team = num(pick(me, 'TeamNum', 'Team', 'team'));
  const teams: any[] = pick(game, 'Teams', 'teams') ?? [];
  const teamScore = (n: number | null) => {
    const t = teams.find((x) => num(pick(x, 'TeamNum', 'Team', 'Num')) === n);
    const v = num(pick(t, 'Score', 'Goals', 'score'));
    return v ?? players.filter((p) => num(pick(p, 'TeamNum', 'Team', 'team')) === n).reduce((a, p) => a + (num(pick(p, 'Goals', 'goals')) ?? 0), 0);
  };
  const other = team === 0 ? 1 : 0;
  const us = teamScore(team), them = teamScore(other);
  const winner = num(pick(en, 'WinnerTeamNum', 'Winner', 'winner'));
  const goals = num(pick(me, 'Goals', 'goals')) ?? 0, shots = num(pick(me, 'Shots', 'shots')) ?? 0;
  const nameOf = (p: any) => String(pick(p, 'Name', 'name') ?? '');
  // Stats en plus (Oni Sync v3) : événements du jeu comptés pour moi, et moyennes relevées chaque seconde
  const ext = body.extra ?? {};
  const feedKey = Object.keys(ext.feed ?? {}).find((k) => norm(k) === norm(acc.ident));
  const feed: Record<string, number> = feedKey ? Object.fromEntries(Object.entries(ext.feed[feedKey]).map(([k, v]) => [String(k).slice(0, 40), Number(v) || 0]).slice(0, 60)) : {};
  const sn = Number(ext.samples?.n) || 0;
  const avg = (k: string) => (sn && Number.isFinite(Number(ext.samples?.sum?.[k])) ? Math.round((Number(ext.samples.sum[k]) / sn) * 10) / 10 : null);
  const share = (k: string) => (sn ? Math.round(((Number(ext.samples?.yes?.[k]) || 0) / sn) * 1000) / 10 : null);
  const moy = sn >= 30 ? { secondes: sn, boost: avg('Boost'), vitesse: avg('Speed'), supersonique: share('bSupersonic'), sol: share('bOnGround'), mur: share('bOnWall'), boostUtilise: share('bBoosting') } : null;
  const row = {
    src: 'sync', win: winner !== null && team !== null ? winner === team : us > them, us, them,
    playlist: pick(game, 'Playlist', 'PlaylistName', 'Mode') ?? null, map: pick(game, 'Arena', 'ArenaName', 'Map') ?? null,
    duration: num(pick(game, 'TimeSeconds', 'ElapsedSeconds', 'Duration')), overtime: !!pick(game, 'bOvertime', 'Overtime'),
    score: num(pick(me, 'Score', 'score')), buts: goals, passes: num(pick(me, 'Assists', 'assists')), arrets: num(pick(me, 'Saves', 'saves')),
    tirs: shots, precision: shots ? Math.round((goals / shots) * 1000) / 10 : null, touches: num(pick(me, 'Touches', 'touches')), demos: num(pick(me, 'Demos', 'demos')),
    mates: players.filter((p) => p !== me && num(pick(p, 'TeamNum', 'Team', 'team')) === team).map(nameOf),
    rivals: players.filter((p) => num(pick(p, 'TeamNum', 'Team', 'team')) === other).map(nameOf),
    ...(Object.keys(feed).length ? { feed } : {}), ...(moy ? { moy } : {}),
  };
  const guid = String(pick(en, 'MatchGuid', 'MatchGUID', 'Guid') ?? pick(st, 'MatchGuid', 'MatchGUID') ?? `${players.map(nameOf).sort().join('|')}:${us}-${them}:${Math.floor(Date.now() / 600_000)}`);
  await exec('INSERT OR IGNORE INTO perf (id, user_id, game, at, data) VALUES (?,?,?,?,?)', `rl:sync:${guid.slice(0, 80)}:${uid}`, uid, 'rl', Date.now(), JSON.stringify(row));
  await exec('UPDATE rl_sync SET last_at = ?, last_error = NULL WHERE user_id = ?', Date.now(), uid);
  return json({ ok: true, message: `${row.win ? 'Victoire' : 'Défaite'} ${us}-${them} · ${goals} but(s), ${row.passes ?? 0} passe(s), ${row.arrets ?? 0} arrêt(s)` });
};
