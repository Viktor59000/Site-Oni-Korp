// Qui a accès à quoi : rosters du membre (d'après ses rôles Discord) et appartenance à l'encadrement.
import { rows } from '../db';

export const STAFF_ROLES = ['Admin', 'Fondateur', 'Manager', 'Coach', 'Modérateur'];
export interface RosterRow { id: number; slug: string; name: string; game: string; role_id: string; voice_id: string }

export async function access(userId: string) {
  const [m] = await rows<{ roles: string; name: string; avatar: string }>('SELECT roles, name, avatar FROM guild_members WHERE id = ?', userId);
  const roleIds: string[] = m ? JSON.parse(m.roles) : [];
  // Encadrement : rôles du staff par leur nom, et tout rôle qui a la permission Administrateur sur Discord
  const staffIds = (await rows<{ id: string }>(`SELECT id FROM guild_roles WHERE name IN (${STAFF_ROLES.map(() => '?').join(',')})`, ...STAFF_ROLES)).map((r) => r.id);
  staffIds.push(...(await rows<{ id: string }>('SELECT id FROM guild_roles WHERE admin = 1')).map((r) => r.id));
  const all = await rows<RosterRow>('SELECT id, slug, name, game, role_id, voice_id FROM rosters WHERE archived = 0 ORDER BY game, id');
  const staff = roleIds.some((r) => staffIds.includes(r));
  const mine = all.filter((r) => roleIds.includes(r.role_id));
  return { member: m ?? null, staff, rosters: staff ? all : mine, rosterIds: mine.map((r) => Number(r.id)) };
}
