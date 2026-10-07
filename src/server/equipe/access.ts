// Qui a accès à quoi, d'après les rôles Discord du membre.
// - Encadrement (Admin, Fondateur, Manager, Coach, ou tout rôle Administrateur) : tous les rosters, tout gérer.
// - Modérateur (décision du 06/10) : la vue d'ensemble seulement ; il ne voit ni stratégies, ni notes, ni objectifs des rosters
//   (il garde la modération Discord et les tickets, côté bot).
// - Responsable d'un jeu (« Responsable League of Legends »…) : tous les rosters de ce jeu, les gérer, et la vue d'ensemble de ce jeu.
// - Capitaine : gère ses propres rosters (planning, compo, objectifs, épingles), sans être encadrement.
// - Analyste : suit les rosters dont il a le rôle, sans compter comme joueur.
// - Pôle contenu (casteur, graphiste, monteur, CM, créateur, marketing) : l'espace Contenu, sans les rosters.
import { rows } from '../db';

export const STAFF_ROLES = ['Admin', 'Fondateur', 'Manager', 'Coach'];
export const MOD_ROLE = 'Modérateur';
export const GAME_LEAD_ROLES: Record<string, string> = {
  'Responsable Rocket League': 'rl', 'Responsable League of Legends': 'lol', 'Responsable Valorant': 'valo', 'Responsable osu!': 'osu',
};
export const CAPTAIN_ROLE = 'Capitaine';
export const ANALYST_ROLE = 'Analyste';
export const CONTENT_ROLES = ['Casteur', 'Graphiste', 'Monteur vidéo', 'Community manager', 'Créateur de contenu', 'Responsable marketing'];
export interface RosterRow { id: number; slug: string; name: string; game: string; role_id: string; voice_id: string; /** la personne a le rôle du roster (sinon elle le voit comme encadrement) */ mine?: boolean }

// Rôles du serveur (id → nom, administrateur), relus au plus toutes les 5 minutes
let rolesCache: { at: number; v: Promise<{ id: string; name: string; admin: number }[]> } | null = null;
const guildRoles = () => {
  if (!rolesCache || Date.now() - rolesCache.at > 5 * 60_000) rolesCache = { at: Date.now(), v: rows<{ id: string; name: string; admin: number }>('SELECT id, name, admin FROM guild_roles') };
  return rolesCache.v;
};

export async function access(userId: string) {
  // Trois lectures en parallèle (une seule attente réseau)
  const [[m], roles, all] = await Promise.all([
    rows<{ roles: string; name: string; avatar: string }>('SELECT roles, name, avatar FROM guild_members WHERE id = ?', userId),
    guildRoles(),
    rows<RosterRow>('SELECT id, slug, name, game, role_id, voice_id FROM rosters WHERE archived = 0 ORDER BY game, id'),
  ]);
  const roleIds: string[] = m ? JSON.parse(m.roles) : [];
  const names = roles.filter((r) => roleIds.includes(r.id));
  const has = (n: string) => names.some((r) => r.name === n);
  const staff = names.some((r) => Number(r.admin) === 1 || STAFF_ROLES.includes(r.name));
  const games = [...new Set(names.map((r) => GAME_LEAD_ROLES[r.name]).filter(Boolean))];
  const captain = has(CAPTAIN_ROLE), analyst = has(ANALYST_ROLE);
  const content = names.filter((r) => CONTENT_ROLES.includes(r.name)).map((r) => r.name);
  const mine = all.filter((r) => roleIds.includes(r.role_id));
  const ofGames = all.filter((r) => games.includes(r.game));
  const visible = staff ? all : all.filter((r) => mine.includes(r) || ofGames.includes(r));
  const lead = staff ? all.map((r) => Number(r.id)) : [...new Set([...ofGames, ...(captain ? mine : [])].map((r) => Number(r.id)))];
  return {
    member: m ?? null, staff, rosters: visible.map((r) => ({ ...r, mine: mine.includes(r) })),
    rosterIds: mine.map((r) => Number(r.id)), // rosters dont il a le rôle (joueur, analyste)
    lead, games, captain, analyst, content,
    mod: !staff && has(MOD_ROLE), // Modérateur sans autre rôle d'encadrement
  };
}
export type Access = Awaited<ReturnType<typeof access>>;

/** Peut voir et utiliser ce roster : encadrement, membre du roster, responsable du jeu ou capitaine. */
export const canSee = (me: Access, rosterId: number | string | null | undefined) => me.staff || (rosterId != null && (me.rosterIds.includes(Number(rosterId)) || me.lead.includes(Number(rosterId))));

/** Peut gérer ce roster : encadrement, responsable du jeu, ou capitaine du roster. */
export const canLead = (me: Access, rosterId: number | string | null | undefined) => me.staff || (rosterId != null && me.lead.includes(Number(rosterId)));

/** Les joueurs d'un roster : membres qui ont son rôle, sauf les analystes (ils suivent le roster sans y jouer). */
export async function rosterMembers(roleId: string) {
  const [members, roles] = await Promise.all([
    rows<{ id: string; name: string; avatar: string; roles: string }>('SELECT id, name, avatar, roles FROM guild_members WHERE roles LIKE ? ORDER BY name', `%"${roleId}"%`),
    guildRoles(),
  ]);
  const analyst = roles.find((r) => r.name === ANALYST_ROLE)?.id;
  return members.filter((x) => !analyst || !(JSON.parse(x.roles) as string[]).includes(analyst)).map(({ id, name, avatar }) => ({ id, name, avatar }));
}
