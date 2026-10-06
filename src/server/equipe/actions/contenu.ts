// Actions d'Inside · Pôle contenu et direction : indicateurs saisis à la main, suivi des tournois, tâches de contenu.
// Appelées par POST /api/equipe/outils (outils.ts) selon le champ « action ». Chaque action vérifie elle-même les droits.
import { exec, rows } from '../../db';
import { canLead } from '../access';
import { METRICS, NETWORKS, ensureTasks } from '../contenu-taches';
import { clip, type Action } from './base';

export const actions: Record<string, Action> = {
  // Indicateurs saisis à la main (chantier 6) : direction et pôle contenu
  'metric': async ({ f, user, me, back, redirect }) => {
    if (!(me.staff || me.content.length)) return redirect(back);
    const key = clip(f.get('key'), 30), day = clip(f.get('day'), 10), value = Number(f.get('value'));
    if (!METRICS[key] || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(value) || value < 0) return redirect(back);
    await exec('CREATE TABLE IF NOT EXISTS metrics (day TEXT, key TEXT, value REAL, source TEXT, PRIMARY KEY (day, key))');
    await exec('INSERT INTO metrics (day, key, value, source) VALUES (?,?,?,?) ON CONFLICT(day, key) DO UPDATE SET value = excluded.value, source = excluded.source', day, key, value, user.id);
    return redirect(back);
  },
  // Suivi des tournois (chantier 5) : gérants du roster seulement
  'competition': async ({ f, user, me, back, redirect }) => {
    const roster = Number(f.get('roster')), id = Number(f.get('id'));
    if (!canLead(me, roster)) return redirect(back);
    await exec(`CREATE TABLE IF NOT EXISTS competitions (id INTEGER PRIMARY KEY, roster_id INTEGER, name TEXT, organizer TEXT, url TEXT, level TEXT,
      signup_by INTEGER, starts INTEGER, status TEXT DEFAULT 'repere', result TEXT, note TEXT, created_by TEXT, at INTEGER)`);
    if (id) {
      const [c] = await rows<{ roster_id: number }>('SELECT roster_id FROM competitions WHERE id = ?', id);
      if (!c || !canLead(me, c.roster_id)) return redirect(back);
      if (clip(f.get('op'), 6) === 'suppr') { await exec('DELETE FROM competitions WHERE id = ?', id); return redirect(back); }
    }
    const dayMs = (v: FormDataEntryValue | null) => { const d = clip(v, 10); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T23:59:00+02:00`).getTime() : null; };
    const url = clip(f.get('url'), 300);
    const vals = [clip(f.get('name'), 100), clip(f.get('organizer'), 80) || null, /^https?:\/\//.test(url) ? url : null, clip(f.get('level'), 60) || null, dayMs(f.get('signup_by')), dayMs(f.get('starts'))];
    if (!vals[0]) return redirect(back);
    const status = ['repere', 'inscrit', 'en-cours', 'termine', 'abandonne'].includes(clip(f.get('status'), 10)) ? clip(f.get('status'), 10) : 'repere';
    if (id) await exec('UPDATE competitions SET name = ?, organizer = ?, url = ?, level = ?, signup_by = ?, starts = ?, status = ?, result = ?, note = ? WHERE id = ?',
      ...vals, status, clip(f.get('result'), 200) || null, clip(f.get('note'), 800) || null, id);
    else await exec('INSERT INTO competitions (roster_id, name, organizer, url, level, signup_by, starts, status, created_by, at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      roster, ...vals, 'repere', user.id, Date.now());
    return redirect(back);
  },
  // Tâches de contenu : brief des matchs, calendrier éditorial, demandes de visuels (pôle contenu, encadrement, responsables, capitaines)
  'tache': async ({ f, action, user, me, back, redirect }) => {
    const may = me.staff || me.content.length > 0 || me.lead.length > 0;
    if (!may) return redirect(back);
    await ensureTasks();
    if (action === 'tache') {
      const kind = ['visuel', 'post', 'video'].includes(clip(f.get('kind'), 10)) ? clip(f.get('kind'), 10) : 'post';
      const d = clip(f.get('jour'), 10), h = /^\d{2}:\d{2}$/.test(clip(f.get('heure'), 5)) ? clip(f.get('heure'), 5) : '18:00';
      const due = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T${h}:00+02:00`).getTime() : NaN;
      const title = clip(f.get('title'), 120);
      if (!title || !Number.isFinite(due)) return redirect(`${back}${back.includes('?') ? '&' : '?'}erreur=tache`);
      const nets = f.getAll('networks').map(String).filter((n) => NETWORKS.includes(n)).join(',');
      await exec('INSERT INTO content_tasks (match_id, kind, title, brief, networks, due, status, created_by, at) VALUES (NULL,?,?,?,?,?,?,?,?)',
        kind, title, clip(f.get('brief'), 1500) || null, nets || null, due, 'a-faire', user.id, Date.now());
      return redirect(back);
    }
    const id = Number(f.get('id'));
    const [task] = await rows<{ assignee: string | null; created_by: string | null; match_id: number | null }>('SELECT assignee, created_by, match_id FROM content_tasks WHERE id = ?', id);
    if (!task) return redirect(back);
    const op = clip(f.get('op'), 12);
    if (op === 'prendre' && !task.assignee) await exec("UPDATE content_tasks SET assignee = ?, status = 'en-cours' WHERE id = ?", user.id, id);
    if (op === 'lacher' && (task.assignee === user.id || me.staff)) await exec("UPDATE content_tasks SET assignee = NULL, status = 'a-faire' WHERE id = ?", id);
    // Le livrable passe « à valider » ; seule la direction (encadrement) le marque fait : c'est elle qui publie
    if (op === 'livrer' && (task.assignee === user.id || me.staff)) {
      const url = clip(f.get('url'), 300);
      await exec("UPDATE content_tasks SET url = ?, status = 'a-valider' WHERE id = ?", /^https?:\/\//.test(url) ? url : null, id);
    }
    if (op === 'valider' && me.staff) await exec("UPDATE content_tasks SET status = 'fait' WHERE id = ?", id);
    if (op === 'refaire' && me.staff) await exec("UPDATE content_tasks SET status = 'en-cours' WHERE id = ?", id);
    if (op === 'suppr' && !task.match_id && (task.created_by === user.id || me.staff)) await exec('DELETE FROM content_tasks WHERE id = ?', id);
    return redirect(back);
  },
};
