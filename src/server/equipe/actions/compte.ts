// Actions d'Inside · Compte et profil : sécurité (agenda, déconnexion partout), page Staff, comptes de jeu, setups.
// Appelées par POST /api/equipe/outils (outils.ts) selon le champ « action ». Chaque action vérifie elle-même les droits.
import { bumpKey, clearSession } from '../../session';
import { exec } from '../../db';
import { GAMES_ACCOUNTS, clip, type Action } from './base';

export const actions: Record<string, Action> = {
  'ics-regen': async ({ user, back, redirect }) => {
    await bumpKey(user.id, 'ics'); return redirect(back);
  },
  'deconnexion-partout': async ({ user, back, cookies, redirect }) => {
    await bumpKey(user.id, 'session'); clearSession(cookies); return redirect('/');
  },
  // Apparaître sur la page Staff du site (chantier 7) : seulement pour soi
  'staff-public': async ({ f, user, back, redirect }) => {
    await exec('INSERT INTO staff_public (user_id, visible, bio, at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET visible = excluded.visible, bio = excluded.bio, at = excluded.at',
      user.id, f.get('visible') === '1' ? 1 : 0, clip(f.get('bio'), 140) || null, Date.now());
    return redirect(back);
  },
  'comptes': async ({ f, user, back, redirect }) => {
    for (const g of GAMES_ACCOUNTS) {
      const ident = clip(f.get(g), 60);
      if (ident) await exec(`INSERT INTO accounts VALUES (?,?,?,?,?) ON CONFLICT(user_id, game) DO UPDATE SET ident = excluded.ident, region = excluded.region, updated_at = excluded.updated_at`,
        user.id, g, ident, g === 'riot' ? clip(f.get('region'), 6) || 'euw' : null, Date.now());
      else await exec('DELETE FROM accounts WHERE user_id = ? AND game = ?', user.id, g);
    }
    return redirect(back);
  },
  'setup': async ({ f, action, user, back, redirect }) => {
    const game = clip(f.get('game'), 5);
    if (!['valo', 'lol', 'rl', 'osu'].includes(game)) return redirect(back);
    const data: Record<string, string> = {};
    for (const [k, v] of f.entries()) if (/^[a-z]{2,12}$/.test(k) && !['action', 'back', 'game'].includes(k) && String(v).trim()) data[k] = String(v).trim().slice(0, 200);
    await exec('INSERT INTO setups VALUES (?,?,?,?) ON CONFLICT(user_id, game) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at', user.id, game, JSON.stringify(data), Date.now());
    return redirect(back);
  },
};
