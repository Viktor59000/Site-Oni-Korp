// POST /api/postuler : candidature envoyée depuis le site. Enregistrée dans la base ;
// Oni Bot ouvre le fil privé sur Discord dans les 30 secondes (même circuit que le bouton du salon #postuler).
import type { APIRoute } from 'astro';
import { currentSession, sameOrigin } from '../session';
import { exec, rows } from '../db';

export const JEUX = { rl: 'Rocket League', lol: 'League of Legends', valo: 'Valorant', osu: 'osu!' } as const;
export const POSTES = ['Coach', 'Manager', 'Casteur', 'Graphiste', 'Monteur vidéo', 'Community manager', 'Responsable marketing', 'Modérateur', 'Créateur de contenu'];

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await currentSession(cookies);
  if (!user || !sameOrigin(request)) return redirect('/postuler/');
  const f = await request.formData();
  const s = (k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);
  const kind = s('kind', 10) === 'staff' ? 'staff' : 'joueur';
  const value = kind === 'joueur' ? s('jeu', 10) : s('poste', 40);
  const answers = { pseudo: s('pseudo', 60), niveau: s('niveau', 200), age: s('age', 3), dispo: s('dispo', 300), presentation: s('presentation', 1000), liens: s('liens', 300) };
  const valid = (kind === 'joueur' ? value in JEUX : POSTES.includes(value)) && answers.pseudo && answers.niveau
    && /^\d{1,2}$/.test(answers.age) && answers.dispo && answers.presentation.length >= 20;
  if (!valid) return redirect(`/postuler/?type=${kind}&erreur=champs`);
  if (Number(answers.age) < 18) return redirect(`/postuler/?type=${kind}&erreur=age`);

  await exec(`CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY, user_id TEXT, kind TEXT, value TEXT, answers TEXT, created_at INTEGER, thread_id TEXT, status TEXT DEFAULT 'attente')`);
  const open = await rows(`SELECT 1 FROM applications WHERE user_id = ? AND status IN ('attente', 'ouverte')`, user.id);
  const ticket = await rows(`SELECT 1 FROM tickets WHERE user_id = ? AND closed_at IS NULL AND kind IN ('joueur', 'staff')`, user.id);
  if (open.length || ticket.length) return redirect('/postuler/');
  await exec('INSERT INTO applications (user_id, kind, value, answers, created_at) VALUES (?,?,?,?,?)', user.id, kind, value, JSON.stringify(answers), Date.now());
  return redirect('/postuler/?envoye=1');
};
