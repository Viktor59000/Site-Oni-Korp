// POST /api/equipe/presence : réponse à une séance depuis le site (Oni Bot met à jour le message Discord dans la minute).
import type { APIRoute } from 'astro';
import { currentSession, sameOrigin } from '../session';
import { exec, rows } from '../db';
import { access } from './access';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await currentSession(cookies);
  if (!user || !sameOrigin(request)) return redirect('/equipe/');
  const f = await request.formData();
  const id = Number(f.get('training'));
  const status = String(f.get('status'));
  if (!['present', 'peut-etre', 'absent'].includes(status)) return redirect('/equipe/');
  const [t] = await rows<{ roster_id: number; cancelled: number }>('SELECT roster_id, cancelled FROM trainings WHERE id = ?', id);
  const me = await access(user.id);
  if (!t || Number(t.cancelled) || !(me.staff || me.rosterIds.includes(Number(t.roster_id)))) return redirect('/equipe/');
  const reason = status === 'absent' ? String(f.get('reason') ?? '').trim().slice(0, 100) || null : null;
  await exec(`INSERT INTO attendance (training_id, user_id, status, reason, at) VALUES (?,?,?,?,?)
    ON CONFLICT(training_id, user_id) DO UPDATE SET status = excluded.status, reason = excluded.reason, at = excluded.at`,
    id, user.id, status, reason, Date.now());
  return redirect(`/equipe/planning/#seance-${id}`);
};
