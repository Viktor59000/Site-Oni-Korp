// Actions d'Inside · Vie du roster : statut des joueurs, objectifs, docs, maps osu!, tableaux blancs, suppressions.
// Appelées par POST /api/equipe/outils (outils.ts) selon le champ « action ». Chaque action vérifie elle-même les droits.
import { exec, rows } from '../../db';
import { canLead, canSee, canWriteDoc } from '../access';
import { clip, type Action } from './base';
import { parseMetric } from '../mesure-objectif';

export const actions: Record<string, Action> = {
  // Statut d'un joueur dans un roster : seulement l'encadrement, le responsable du jeu ou le capitaine
  'statut': async ({ f, user, me, back, redirect }) => {
    const roster = Number(f.get('roster')), target = clip(f.get('user'), 25);
    if (!target || !canLead(me, roster)) return redirect(back);
    const statut = ['titulaire', 'remplacant', 'essai'].includes(clip(f.get('statut'), 12)) ? clip(f.get('statut'), 12) : 'titulaire';
    const d = clip(f.get('fin'), 10);
    const fin = statut === 'essai' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T23:59:00+02:00`).getTime() : null;
    await exec(`INSERT INTO roster_status (roster_id, user_id, statut, essai_fin, retour, by, at) VALUES (?,?,?,?,?,?,?)
      ON CONFLICT(roster_id, user_id) DO UPDATE SET statut = excluded.statut, essai_fin = excluded.essai_fin, retour = excluded.retour, by = excluded.by, at = excluded.at`,
      roster, target, statut, fin, clip(f.get('retour'), 1000) || null, user.id, Date.now());
    return redirect(back);
  },
  // Pool d'un joueur (07/10) : champions LoL ou agents Valorant, par niveau. Le joueur pour lui-même, ou l'encadrement du roster
  'pool': async ({ f, user, me, back, redirect, canRoster }) => {
    const roster = Number(f.get('roster')), who = clip(f.get('user'), 25) || user.id, game = clip(f.get('game'), 5), item = clip(f.get('item'), 40);
    const tier = ['main', 'jouable', 'apprentissage'].includes(clip(f.get('tier'), 15)) ? clip(f.get('tier'), 15) : '';
    if (!canRoster(roster) || !['lol', 'valo'].includes(game) || !item || (who !== user.id && !canLead(me, roster))) return redirect(back);
    if (!tier) await exec('DELETE FROM pools WHERE roster_id = ? AND user_id = ? AND game = ? AND item = ?', roster, who, game, item);
    else await exec('INSERT INTO pools (roster_id, user_id, game, item, tier, note, at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(roster_id, user_id, game, item) DO UPDATE SET tier = excluded.tier, at = excluded.at', roster, who, game, item, tier, null, Date.now());
    return redirect(back);
  },
  // Compo Valorant pour une carte (07/10)
  'compo-carte': async ({ f, user, back, redirect, canRoster }) => {
    const roster = Number(f.get('roster')), id = Number(f.get('id')) || 0, map = clip(f.get('map'), 40);
    const agents = f.getAll('agents').map((x) => clip(x, 30)).filter(Boolean).slice(0, 5);
    if (!canRoster(roster) || !map) return redirect(back);
    if (id) { const [c] = await rows<{ roster_id: number }>('SELECT roster_id FROM comps WHERE id = ?', id); if (!c || !canRoster(Number(c.roster_id))) return redirect(back);
      await exec('UPDATE comps SET map = ?, agents = ?, note = ?, author = ?, at = ? WHERE id = ?', map, JSON.stringify(agents), clip(f.get('note'), 600) || null, user.id, Date.now(), id); }
    else await exec('INSERT INTO comps (roster_id, map, agents, note, author, at) VALUES (?,?,?,?,?,?)', roster, map, JSON.stringify(agents), clip(f.get('note'), 600) || null, user.id, Date.now());
    return redirect(back);
  },
  // Pack d'entraînement Rocket League (07/10) : code à coller dans le jeu
  'pack': async ({ f, user, back, redirect, canRoster }) => {
    const roster = Number(f.get('roster')), code = clip(f.get('code'), 25).toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (!canRoster(roster) || !/^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/.test(code)) return redirect(`${back}${back.includes('?') ? '&' : '?'}erreur=code`);
    await exec('INSERT INTO rl_packs (roster_id, code, title, kind, note, author, at) VALUES (?,?,?,?,?,?,?)', roster, code, clip(f.get('title'), 80) || code, clip(f.get('kind'), 20) || 'autre', clip(f.get('note'), 400) || null, user.id, Date.now());
    return redirect(back);
  },
  // Carnet perso (07/10) : visible de la personne seule
  'carnet': async ({ f, user, back, redirect }) => {
    await exec('INSERT INTO carnet (user_id, body, at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET body = excluded.body, at = excluded.at', user.id, String(f.get('body') ?? '').slice(0, 20000), Date.now());
    return redirect(back);
  },
  // Partager un brouillon de tableau avec le roster (07/10) : il devient un tableau d'équipe
  'tableau-partager': async ({ f, user, back, redirect }) => {
    await exec('UPDATE boards SET owner = NULL, updated_at = ? WHERE id = ? AND owner = ?', Date.now(), Number(f.get('id')), user.id);
    return redirect(back);
  },
  // Accord d'image (07/10) : chacun pour soi, depuis Mon espace
  'accord-image': async ({ f, user, back, redirect }) => {
    await exec('INSERT INTO consents (user_id, image, at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET image = excluded.image, at = excluded.at', user.id, f.get('image') === '1' ? 1 : 0, Date.now());
    return redirect(back);
  },
  // Plan d'une séance (07/10) : capitaine, coach ou responsable ; Oni Bot le reprend sur la carte Discord de la séance
  'plan-seance': async ({ f, me, back, redirect }) => {
    const id = Number(f.get('training'));
    const [t] = await rows<{ roster_id: number }>('SELECT roster_id FROM trainings WHERE id = ?', id);
    if (t && canLead(me, t.roster_id)) await exec('UPDATE trainings SET plan = ?, plan_at = ? WHERE id = ?', String(f.get('plan') ?? '').trim().slice(0, 1000) || null, Date.now(), id);
    return redirect(back);
  },
  // Relance groupée (bloc « À gérer ») : Oni Bot mentionne, dans le salon planning, ceux qui n'ont pas répondu
  'relance': async ({ f, me, back, redirect }) => {
    const id = Number(f.get('training'));
    const [t] = await rows<{ roster_id: number; relance_at: number | null }>('SELECT roster_id, relance_at FROM trainings WHERE id = ?', id);
    if (t && canLead(me, t.roster_id) && Date.now() - Number(t.relance_at ?? 0) > 3 * 3600_000) await exec('UPDATE trainings SET relance_at = ? WHERE id = ?', Date.now(), id);
    return redirect(`${back}${back.includes('?') ? '&' : '?'}relance=1`);
  },
  'objectif': async ({ f, user, me, back, redirect }) => {
    const roster = Number(f.get('roster'));
    // L'encadrement fixe les objectifs de chacun ; un joueur peut s'en fixer un pour lui-même (depuis les Trackers)
    const self = clip(f.get('user'), 25) === user.id && canSee(me, roster);
    if (!canLead(me, roster) && !self) return redirect(back);
    const due = clip(f.get('due'), 10);
    await exec(`CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY, roster_id INTEGER, user_id TEXT, title TEXT, detail TEXT, due INTEGER, status TEXT DEFAULT 'en-cours', progress INTEGER DEFAULT 0, created_by TEXT, at INTEGER, updated_at INTEGER)`).catch(() => {});
    // Objectif d'un joueur : privé par défaut (le joueur et l'encadrement), sauf « visible par tout le roster » coché
    const who = clip(f.get('user'), 25) || null;
    const priv = who && f.get('public') !== '1' ? 1 : 0;
    // Objectif mesuré automatiquement (depuis un Tracker) : la mesure, son départ et sa cible
    await exec('ALTER TABLE goals ADD COLUMN metric TEXT').catch(() => {});
    const metric = who ? parseMetric(f.get('metric')) : null;
    if (clip(f.get('title'), 120)) await exec('INSERT INTO goals (roster_id, user_id, title, detail, due, created_by, at, updated_at, private, metric) VALUES (?,?,?,?,?,?,?,?,?,?)',
      roster, who, clip(f.get('title'), 120), clip(f.get('detail'), 500) || null,
      /^\d{4}-\d{2}-\d{2}$/.test(due) ? Date.parse(`${due}T23:59:00+01:00`) : null, user.id, Date.now(), Date.now(), priv, metric ? JSON.stringify(metric) : null);
    return redirect(back);
  },
  'objectif-maj': async ({ f, user, me, back, redirect }) => {
    const id = Number(f.get('id'));
    const [g] = await rows<{ roster_id: number; user_id: string | null }>('SELECT roster_id, user_id FROM goals WHERE id = ?', id);
    const may = g && (canLead(me, g.roster_id) || g.user_id === user.id || (!g.user_id && me.rosterIds.includes(Number(g.roster_id))));
    let status = clip(f.get('status'), 12);
    if (!['en-cours', 'atteint', 'abandonne'].includes(status) || (status === 'abandonne' && !canLead(me, g?.roster_id))) status = 'en-cours';
    const progress = status === 'atteint' ? 100 : Math.min(100, Math.max(0, Number(f.get('progress')) || 0));
    if (may) await exec('UPDATE goals SET progress = ?, status = ?, updated_at = ? WHERE id = ?', progress, status, Date.now(), id);
    return redirect(back);
  },
  'doc': async ({ f, user, me, back, redirect, canRoster }) => {
    const id = Number(f.get('id'));
    const title = clip(f.get('title'), 100), body = String(f.get('body') ?? '').slice(0, 20000);
    const wantPin = f.get('pinned') === '1' ? 1 : 0;
    const qs = back.includes('?') ? `&${back.split('?')[1]}` : '';
    if (!title) return redirect(back);
    if (id) {
      const [d] = await rows<{ roster_id: number | null; pinned: number; level: string | null; game: string | null }>('SELECT roster_id, pinned, level, game FROM docs WHERE id = ?', id);
      const lvl = d?.level ?? 'roster';
      if (!d || !canWriteDoc(me, lvl, d.roster_id, d.game)) return redirect(back);
      const pinOk = lvl === 'roster' ? canLead(me, d.roster_id) : true;
      await exec('UPDATE docs SET title = ?, body = ?, pinned = ?, author = ?, updated_at = ? WHERE id = ?', title, body, pinOk ? wantPin : Number(d.pinned), user.id, Date.now(), id);
      return redirect(`/equipe/docs/?d=${id}${qs}`);
    }
    // Niveau : ce roster, tous les rosters du jeu (responsable du jeu), ou tout le club (encadrement)
    const roster = Number(f.get('roster'));
    const level = ['jeu', 'club'].includes(clip(f.get('level'), 6)) ? clip(f.get('level'), 6) : 'roster';
    const [rr] = await rows<{ game: string }>('SELECT game FROM rosters WHERE id = ?', roster);
    const game = level === 'jeu' ? rr?.game ?? null : null;
    if (!canRoster(roster) || !canWriteDoc(me, level, roster, game)) return redirect(back);
    const pinned = level !== 'roster' || canLead(me, roster) ? wantPin : 0;
    const [n] = await rows<{ id: number }>('INSERT INTO docs (roster_id, title, body, pinned, author, updated_at, level, game) VALUES (?,?,?,?,?,?,?,?) RETURNING id',
      level === 'roster' ? roster : null, title, body, pinned, user.id, Date.now(), level, game);
    return redirect(n ? `/equipe/docs/?d=${n.id}${qs}` : back);
  },
  'osu-map': async ({ f, user, me, back, redirect, canRoster }) => {
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    // Accepte un lien de map (…/beatmapsets/123#osu/456 ou …/b/456) ou l'identifiant seul
    const raw = clip(f.get('map'), 200);
    const bid = Number(raw.match(/#osu\/(\d+)/)?.[1] ?? raw.match(/\/b(?:eatmaps)?\/(\d+)/)?.[1] ?? raw.match(/^(\d+)$/)?.[1]);
    if (!bid) return redirect(`${back}${back.includes('?') ? '&' : '?'}erreur=map`);
    const challenge = f.get('challenge') === '1' && canLead(me, roster) ? 1 : 0;
    const days = Math.min(30, Math.max(1, Number(f.get('days')) || 7));
    // Place dans le mappool de tournoi (07/10) : NM1…NM6, HD1…, HR1…, DT1…, FM1…, TB
    const slot = /^(NM[1-6]|HD[1-3]|HR[1-3]|DT[1-3]|FM[1-3]|TB)$/.test(clip(f.get('slot'), 4)) ? clip(f.get('slot'), 4) : null;
    await exec('INSERT INTO osu_maps (roster_id, beatmap_id, note, challenge, ends, added_by, at, slot) VALUES (?,?,?,?,?,?,?,?)',
      roster, bid, clip(f.get('note'), 300) || null, challenge, challenge ? Date.now() + days * 86400_000 : null, user.id, Date.now(), slot);
    return redirect(back);
  },
  'tableau': async ({ f, user, back, redirect, canRoster }) => {
    const roster = Number(f.get('roster'));
    const game = ['lol', 'rl', 'valo', 'osu'].includes(clip(f.get('game'), 5)) ? clip(f.get('game'), 5) : '';
    const url = clip(f.get('url'), 400);
    const bgRaw = clip(f.get('map'), 40);
    const bg = bgRaw === 'url' ? (/^https?:\/\//.test(url) ? url : 'blanc') : bgRaw || 'blanc';
    if (!canRoster(roster)) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS boards (id INTEGER PRIMARY KEY, roster_id INTEGER, game TEXT, map TEXT, title TEXT, state TEXT, updated_at INTEGER, updated_by TEXT)`).catch(() => {});
    const [b] = await rows<{ id: number }>('INSERT INTO boards (roster_id, game, map, title, state, updated_at, updated_by, owner) VALUES (?,?,?,?,?,?,?,?) RETURNING id',
      roster, game, bg, clip(f.get('title'), 60) || 'Tableau', JSON.stringify({ bg, notes: '', frames: [{ name: 'Étape 1', items: [], strokes: [] }] }), Date.now(), user.id, f.get('brouillon') === '1' ? user.id : null);
    const r = new URL(back, 'http://x').searchParams.get('r');
    return redirect(b ? `/equipe/tactique/?b=${b.id}${r ? `&r=${r}` : ''}` : back);
  },
  'suppr': async ({ f, user, me, back, redirect, canRoster }) => {
    // Supprimer un draft ou une lineup : l'auteur ou l'encadrement
    const id = Number(f.get('id'));
    if (clip(f.get('table'), 10) === 'boards') {
      // Un tableau appartient au roster : n'importe quel membre du roster (ou l'encadrement) peut le supprimer
      const [b] = await rows<{ roster_id: number }>('SELECT roster_id FROM boards WHERE id = ?', id);
      if (b && canRoster(Number(b.roster_id))) await exec('DELETE FROM boards WHERE id = ?', id);
      return redirect(back);
    }
    const tname = clip(f.get('table'), 10);
    if (['osu_maps', 'vods', 'docs', 'comps', 'rl_packs'].includes(tname)) {
      // Contenus du roster : l'auteur ou l'encadrement
      const col = ['docs', 'comps', 'rl_packs'].includes(tname) ? 'author' : 'added_by';
      const [row] = await rows<{ who: string; roster_id: number; level?: string | null; game?: string | null }>(`SELECT ${col} AS who, roster_id${tname === 'docs' ? ', level, game' : ''} FROM ${tname} WHERE id = ?`, id);
      const lvl = row?.level ?? 'roster';
      if (row && (row.who === user.id || (lvl === 'roster' ? canLead(me, row.roster_id) : canWriteDoc(me, lvl, row.roster_id, row.game ?? null)))) { await exec(`DELETE FROM ${tname} WHERE id = ?`, id); if (tname === 'vods') await exec('DELETE FROM vod_marks WHERE vod_id = ?', id); }
      return redirect(back);
    }
    const table = tname === 'lineups' ? 'lineups' : 'drafts';
    const [row] = await rows<{ author: string; roster_id: number }>(`SELECT author, roster_id FROM ${table} WHERE id = ?`, id);
    if (row && (row.author === user.id || canLead(me, row.roster_id))) await exec(`DELETE FROM ${table} WHERE id = ?`, id);
    return redirect(back);
  },
};
