// Les propriétés de chaque jeu, au même endroit (architecture d'Inside, 07/10/2026) :
// - le ROSTER porte son écosystème (planning, matchs, adversaires, docs, objectifs, tableaux) ;
// - le JEU porte ses propriétés et ses outils (couleur, compte à relier, outil dédié, terrain du tableau blanc,
//   repères du scouting, liens vers les profils). Ajouter un jeu = ajouter une entrée ici, puis son outil.
import { links } from './stats';

export type GameKey = 'rl' | 'lol' | 'valo' | 'osu';
export interface Jeu {
  label: string; code: string; color: string;
  /** compte de jeu à relier (type dans la table accounts, libellé « Relie … ») */
  account: [string, string];
  /** outil propre au jeu : clé de page, nom dans le menu, adresse */
  tool: [string, string, string];
  /** tableau blanc : null = pas de tableau pour ce jeu ; sinon le fond par défaut */
  board: { map: string } | null;
  /** fiche de scouting : aides à la saisie et lien vers le profil d'un joueur adverse */
  scouting: { players: string; style: string; plan: string; links: string; profile?: (pseudo: string) => string | null };
}

export const JEUX: Record<GameKey, Jeu> = {
  rl: {
    label: 'Rocket League', code: 'RL', color: '#2f6bff', account: ['rl', 'ton pseudo Rocket League'], tool: ['rl', 'Tracker', '/equipe/rl/'], board: { map: 'Terrain' },
    scouting: {
      players: '- Pseudo (Epic) · place dans la rotation · ce qu’il fait bien', style: 'Rotation rapide ou posée ? Kickoff habituel, jeu aérien, démos, pression…',
      plan: 'Notre kickoff, qui presse, comment on défend leurs aériens, où on les attend', links: 'Profils RL Tracker, replays ballchasing, chaîne Twitch… un par ligne',
      profile: (p) => links.rl(p),
    },
  },
  lol: {
    label: 'League of Legends', code: 'LoL', color: '#0f8a9b', account: ['riot', 'ton Riot ID'], tool: ['lol', 'Drafter', '/equipe/lol/'], board: { map: 'Faille' },
    scouting: {
      players: '- Pseudo#TAG · poste · champions favoris', style: 'Early agressif ? Jungler qui envahit ? Priorité aux objectifs…',
      plan: 'Picks, bans, côté de la carte, objectifs à prendre ou à refuser', links: 'op.gg multi, Leaguepedia, chaîne Twitch… un par ligne',
      profile: (p) => links.opgg(p),
    },
  },
  valo: {
    label: 'Valorant', code: 'VAL', color: '#ff4655', account: ['riot', 'ton Riot ID'], tool: ['valo', 'Lineups', '/equipe/valo/'], board: { map: '' },
    scouting: {
      players: '- Pseudo#TAG · rôle (duelliste, contrôleur…) · agents', style: 'Exécutions rapides ? Défense passive ? Cartes favorites, éco…',
      plan: 'Choix et bans de cartes, setups, anti-stratégies', links: 'tracker.gg, VLR.gg, chaîne Twitch… un par ligne',
      profile: (p) => links.valo(p),
    },
  },
  osu: {
    label: 'osu!', code: 'osu!', color: '#ff66aa', account: ['osu', 'ton pseudo osu!'], tool: ['osu', 'Défis et maps', '/equipe/osu/'], board: null,
    scouting: {
      players: '- Pseudo · rang · mods favoris', style: 'Aim, stream, précision, lecture… sur quels types de maps ?',
      plan: 'Picks et bans du mappool, ordre des maps', links: 'Profils osu!, matchs (osu.ppy.sh/community/matches)… un par ligne',
      profile: (p) => links.osu(p),
    },
  },
};
export const jeu = (g: string | null | undefined): Jeu | null => (g && g in JEUX ? JEUX[g as GameKey] : null);
