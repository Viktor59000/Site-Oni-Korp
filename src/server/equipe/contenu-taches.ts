// Tâches de contenu (SWOT-ROLES.md, chantiers 3 et 4) : un seul modèle pour le brief des matchs, le calendrier éditorial
// et les demandes de visuels. Chaque match public reçoit automatiquement ses tâches ; le reste s'ajoute à la main.
import { exec, rows } from '../db';

export const TASK_KINDS: Record<string, { label: string; role: string }> = {
  'visuel-annonce': { label: "Visuel d'annonce", role: 'Graphiste' },
  'post-annonce': { label: "Post d'annonce", role: 'Community manager' },
  rappel: { label: 'Rappel le jour J', role: 'Community manager' },
  'visuel-resultat': { label: 'Visuel de résultat', role: 'Graphiste' },
  'post-resultat': { label: 'Post de résultat', role: 'Community manager' },
  clip: { label: 'Clip des temps forts', role: 'Monteur vidéo' },
  visuel: { label: 'Visuel', role: 'Graphiste' },
  post: { label: 'Post', role: 'Community manager' },
  video: { label: 'Vidéo', role: 'Monteur vidéo' },
};
export const NETWORKS = ['Discord', 'X', 'Instagram', 'TikTok', 'YouTube', 'Twitch'];
export const STATUS: Record<string, string> = { 'a-faire': 'À faire', 'en-cours': 'En cours', 'a-valider': 'À valider', fait: 'Fait' };

export type Task = {
  id: number; match_id: number | null; kind: string; title: string | null; brief: string | null; networks: string | null;
  due: number; assignee: string | null; assignee_name?: string | null; status: string; url: string | null; created_by: string | null; at: number;
};

let ready = false;
export async function ensureTasks() {
  if (ready) return;
  await exec(`CREATE TABLE IF NOT EXISTS content_tasks (id INTEGER PRIMARY KEY, match_id INTEGER, kind TEXT, title TEXT, brief TEXT, networks TEXT,
    due INTEGER, assignee TEXT, status TEXT DEFAULT 'a-faire', url TEXT, created_by TEXT, at INTEGER)`);
  ready = true;
}

const H = 3600_000, D = 24 * H;
/** Tâches par défaut d'un match public, avec leur échéance par rapport à l'heure du match. */
const MATCH_PLAN: [string, number, string][] = [
  ['visuel-annonce', -3 * D, 'Format 16:9 (X, Discord) et 4:5 (Instagram). Équipes, date, heure, jeu, lien du live.'],
  ['post-annonce', -2 * D, 'Annonce sur X et Instagram, avec le visuel. Mentionne l\'adversaire s\'il a un compte.'],
  ['rappel', -4 * H, 'Rappel « ce soir » avec le lien du live (story Instagram, X).'],
  ['visuel-resultat', 3 * H, 'Score, MVP si le coach en désigne un. Version victoire ou défaite (voir le kit de marque).'],
  ['post-resultat', 4 * H, 'Résultat avec le visuel. Remercie l\'adversaire et le casteur.'],
  ['clip', 3 * D, 'Temps forts du match (30 à 60 s, vertical pour TikTok et Shorts) à partir de la VOD du cast.'],
];

/** Crée les tâches manquantes des matchs publics à venir (et de ceux joués ces 3 derniers jours). */
export async function ensureMatchTasks() {
  await ensureTasks();
  const now = Date.now();
  const list = await rows<{ id: number; at: number; opponent: string }>(
    `SELECT m.id, m.at, m.opponent FROM matches m WHERE m.cancelled = 0 AND COALESCE(m.kind, 'officiel') != 'scrim' AND m.at > ? AND m.at < ?
     AND NOT EXISTS (SELECT 1 FROM content_tasks t WHERE t.match_id = m.id)`, now - 3 * D, now + 30 * D).catch(() => []);
  for (const m of list) {
    for (const [kind, offset, brief] of MATCH_PLAN) {
      // Échéance jamais dans le passé pour un match annoncé tard : au plus tôt dans 2 heures
      const due = Math.max(Number(m.at) + offset, offset < 0 ? now + 2 * H : Number(m.at) + offset);
      await exec('INSERT INTO content_tasks (match_id, kind, brief, due, status, created_by, at) VALUES (?,?,?,?,?,?,?)', m.id, kind, brief, due, 'a-faire', 'oni-bot', now);
    }
  }
}

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const short = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

/** Une tâche en HTML : quoi, pour quand, qui, et les actions permises à la personne connectée. */
export function renderTask(x: Task, c: { user: string; staff: boolean; roles: Set<string>; back: string; now: number }, opponent?: string) {
  const k = TASK_KINDS[x.kind];
  const d = Number(x.due) - c.now, h = Math.round(Math.abs(d) / H);
  const rel = Math.abs(d) < D ? `${h} h` : `${Math.round(Math.abs(d) / D)} j`;
  const when = `${short.format(new Date(Number(x.due)))} · ${d < 0 ? `il y a ${rel}` : `dans ${rel}`}`;
  const late = !['fait', 'a-valider'].includes(x.status) && d < 0;
  const form = (op: string, text: string, extra = '', attr = '') => `<form method="post" action="/api/equipe/outils"><input type="hidden" name="action" value="tache-maj" /><input type="hidden" name="id" value="${x.id}" /><input type="hidden" name="op" value="${op}" /><input type="hidden" name="back" value="${esc(c.back)}" />${extra}<button${attr}>${text}</button></form>`;
  const acts: string[] = [];
  if (!x.assignee && x.status !== 'fait') acts.push(form('prendre', 'Je prends'));
  if (x.assignee === c.user && ['en-cours', 'a-faire'].includes(x.status)) acts.push(form('livrer', 'Livrer', '<input type="url" name="url" placeholder="Lien du livrable (Drive, Canva…)" hidden />', ' data-livrer'), form('lacher', 'Lâcher'));
  if (c.staff && x.status === 'a-valider') acts.push(form('valider', 'Valider'), form('refaire', 'À reprendre'));
  if (!x.match_id && (x.created_by === c.user || c.staff)) acts.push(form('suppr', 'Supprimer'));
  const who = x.assignee ? (x.assignee === c.user ? 'toi' : esc(x.assignee_name ?? "quelqu'un")) : `pour ${esc(k?.role ?? 'le pôle contenu')}`;
  const nets = x.networks ? ` · ${esc(x.networks.split(',').join(', '))}` : '';
  const mine = x.assignee === c.user || (!x.assignee && !!k && c.roles.has(k.role));
  return `<li class="ct-task${mine ? ' is-mine' : ''}${x.status === 'fait' ? ' is-fait' : ''}">`
    + `<div><b>${esc(x.title || k?.label || x.kind)}</b>${opponent ? ` <span class="ct-st">vs ${esc(opponent)}</span>` : ''} <span class="ct-st st-${esc(x.status)}">${esc(STATUS[x.status] ?? x.status)}</span>`
    + `<small class="${late ? 'is-late' : ''}">${late ? 'En retard · ' : ''}${when} · ${who}${nets}</small>${x.brief ? `<p>${esc(x.brief)}</p>` : ''}</div>`
    + `<div class="ct-act">${x.url ? `<a href="${esc(x.url)}" rel="noopener" target="_blank">Livrable</a>` : ''}${acts.join('')}</div></li>`;
}
