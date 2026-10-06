// Actions d'Inside · Vie du roster : statut des joueurs, objectifs, docs, maps osu!, tableaux blancs, suppressions.
// Appelées par POST /api/equipe/outils (outils.ts) selon le champ « action ». Chaque action vérifie elle-même les droits.
import { exec, rows } from '../../db';
import { canLead } from '../access';
import { clip, type Action } from './base';

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
  'objectif': async ({ f, user, me, back, redirect }) => {
    if (!(canLead(me, Number(f.get('roster'))))) return redirect(back);
    const roster = Number(f.get('roster'));
    const due = clip(f.get('due'), 10);
    await exec(`CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY, roster_id INTEGER, user_id TEXT, title TEXT, detail TEXT, due INTEGER, status TEXT DEFAULT 'en-cours', progress INTEGER DEFAULT 0, created_by TEXT, at INTEGER, updated_at INTEGER)`).catch(() => {});
    if (clip(f.get('title'), 120)) await exec('INSERT INTO goals (roster_id, user_id, title, detail, due, created_by, at, updated_at) VALUES (?,?,?,?,?,?,?,?)',
      roster, clip(f.get('user'), 25) || null, clip(f.get('title'), 120), clip(f.get('detail'), 500) || null,
      /^\d{4}-\d{2}-\d{2}$/.test(due) ? Date.parse(`${due}T23:59:00+01:00`) : null, user.id, Date.now(), Date.now());
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
      const [d] = await rows<{ roster_id: number; pinned: number }>('SELECT roster_id, pinned FROM docs WHERE id = ?', id);
      if (!d || !canRoster(Number(d.roster_id))) return redirect(back);
      await exec('UPDATE docs SET title = ?, body = ?, pinned = ?, author = ?, updated_at = ? WHERE id = ?', title, body, canLead(me, d.roster_id) ? wantPin : Number(d.pinned), user.id, Date.now(), id);
      return redirect(`/equipe/docs/?d=${id}${qs}`);
    }
    const roster = Number(f.get('roster'));
    if (!canRoster(roster)) return redirect(back);
    const pinned = canLead(me, roster) ? wantPin : 0;
    const [n] = await rows<{ id: number }>('INSERT INTO docs (roster_id, title, body, pinned, author, updated_at) VALUES (?,?,?,?,?,?) RETURNING id', roster, title, body, pinned, user.id, Date.now());
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
    await exec('INSERT INTO osu_maps (roster_id, beatmap_id, note, challenge, ends, added_by, at) VALUES (?,?,?,?,?,?,?)',
      roster, bid, clip(f.get('note'), 300) || null, challenge, challenge ? Date.now() + days * 86400_000 : null, user.id, Date.now());
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
    const [b] = await rows<{ id: number }>('INSERT INTO boards (roster_id, game, map, title, state, updated_at, updated_by) VALUES (?,?,?,?,?,?,?) RETURNING id',
      roster, game, bg, clip(f.get('title'), 60) || 'Tableau', JSON.stringify({ bg, notes: '', frames: [{ name: 'Étape 1', items: [], strokes: [] }] }), Date.now(), user.id);
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
    if (['osu_maps', 'vods', 'docs'].includes(tname)) {
      // Contenus du roster : l'auteur ou l'encadrement
      const col = tname === 'docs' ? 'author' : 'added_by';
      const [row] = await rows<{ who: string; roster_id: number }>(`SELECT ${col} AS who, roster_id FROM ${tname} WHERE id = ?`, id);
      if (row && (row.who === user.id || canLead(me, row.roster_id))) { await exec(`DELETE FROM ${tname} WHERE id = ?`, id); if (tname === 'vods') await exec('DELETE FROM vod_marks WHERE vod_id = ?', id); }
      return redirect(back);
    }
    const table = tname === 'lineups' ? 'lineups' : 'drafts';
    const [row] = await rows<{ author: string; roster_id: number }>(`SELECT author, roster_id FROM ${table} WHERE id = ?`, id);
    if (row && (row.author === user.id || canLead(me, row.roster_id))) await exec(`DELETE FROM ${table} WHERE id = ?`, id);
    return redirect(back);
  },
};
