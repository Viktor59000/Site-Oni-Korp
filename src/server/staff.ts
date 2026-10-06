// GET /api/staff : les bénévoles qui ont choisi d'apparaître sur la page Staff (case dans Inside > Mon profil).
// Pour chacun : pseudo, fonctions (d'après ses rôles Discord), une phrase, et ce qu'il a fait pour le club
// (tâches de contenu validées, matchs castés). Personne n'apparaît sans l'avoir coché.
import type { APIRoute } from 'astro';
import { rows } from './db';

// Fonctions affichées, rangées par pôle (ordre d'affichage)
export const POLES: { key: string; label: string; roles: string[] }[] = [
  { key: 'direction', label: 'Direction', roles: ['Fondateur', 'Admin'] },
  { key: 'encadrement', label: 'Encadrement', roles: ['Responsable Rocket League', 'Responsable League of Legends', 'Responsable Valorant', 'Responsable osu!', 'Manager', 'Coach', 'Analyste', 'Capitaine'] },
  { key: 'contenu', label: 'Contenu', roles: ['Casteur', 'Graphiste', 'Monteur vidéo', 'Community manager', 'Responsable marketing', 'Créateur de contenu'] },
  { key: 'communaute', label: 'Communauté', roles: ['Modérateur', 'Organisateur', 'Accueil'] },
];
const LABEL: Record<string, string> = { Admin: 'Administration' };

export const GET: APIRoute = async () => {
  const [people, roles] = await Promise.all([
    rows<{ user_id: string; bio: string | null; name: string; roles: string }>(
      `SELECT s.user_id, s.bio, g.name, g.roles FROM staff_public s JOIN guild_members g ON g.id = s.user_id WHERE s.visible = 1 ORDER BY g.name`).catch(() => []),
    rows<{ id: string; name: string }>('SELECT id, name FROM guild_roles').catch(() => []),
  ]);
  const ids = people.map((p) => p.user_id);
  const marks = ids.map(() => '?').join(',');
  const [tasks, casts] = ids.length ? await Promise.all([
    rows<{ assignee: string; kind: string; n: number }>(`SELECT assignee, kind, COUNT(*) AS n FROM content_tasks WHERE status = 'fait' AND assignee IN (${marks}) GROUP BY assignee, kind`, ...ids).catch(() => []),
    rows<{ caster: string; n: number }>(`SELECT caster, COUNT(*) AS n FROM matches WHERE cancelled = 0 AND score_us IS NOT NULL AND caster IN (${marks}) GROUP BY caster`, ...ids).catch(() => []),
  ]) : [[], []];
  const nameOf = new Map(roles.map((r) => [r.id, r.name]));
  const list = people.map((p) => {
    const mine = (JSON.parse(p.roles) as string[]).map((id) => nameOf.get(id)).filter((n): n is string => !!n);
    const poles = POLES.map((pl) => ({ pole: pl.key, fonctions: pl.roles.filter((r) => mine.includes(r)).map((r) => LABEL[r] ?? r) })).filter((x) => x.fonctions.length);
    const t = tasks.filter((x) => x.assignee === p.user_id);
    const sum = (kinds: string[]) => t.filter((x) => kinds.some((k) => x.kind.startsWith(k))).reduce((s, x) => s + Number(x.n), 0);
    return {
      id: p.user_id, nom: p.name, bio: p.bio, poles,
      bilan: { visuels: sum(['visuel']), posts: sum(['post', 'rappel']), videos: sum(['clip', 'video']), casts: Number(casts.find((c) => c.caster === p.user_id)?.n ?? 0) },
    };
  }).filter((p) => p.poles.length);
  return new Response(JSON.stringify({ poles: POLES.map(({ key, label }) => ({ key, label })), staff: list }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
};
