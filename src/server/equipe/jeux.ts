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
  /** autres outils du jeu, rangés après le premier dans Préparer */
  more?: [string, string, string][];
  /** tableau blanc : null = pas de tableau pour ce jeu ; sinon le fond par défaut et les éléments du jeu (chacun son écosystème :
   *  pas de balises de vision en Rocket League, pas de ballon en LoL) */
  board: { map: string; kit: Kit } | null;
  /** fiche de scouting : aides à la saisie et lien vers le profil d'un joueur adverse */
  scouting: { players: string; style: string; plan: string; links: string; profile?: (pseudo: string) => string | null };
}

export interface Ping { key: string; sym: string; label: string; bg: string; fg: string }
export interface Kit { players: string[]; ally: { name: string; color: string }; enemy: { name: string; color: string }; pings: Ping[] }
const DANGER: Ping = { key: 'danger', sym: '!', label: 'Danger', bg: '#ff4655', fg: '#fff' };
const CHECK: Ping = { key: 'question', sym: '?', label: 'À vérifier', bg: '#ffd23f', fg: '#111' };
const GOAL: Ping = { key: 'objectif', sym: '★', label: 'Objectif', bg: '#ffd23f', fg: '#111' };
/** Tableau sans jeu (fond neutre, image) : éléments génériques */
export const KIT_NEUTRE: Kit = { players: ['1', '2', '3', '4', '5'], ally: { name: 'Nous', color: '#2f6bff' }, enemy: { name: 'Eux', color: '#e5251f' }, pings: [DANGER, GOAL, CHECK] };

export const JEUX: Record<GameKey, Jeu> = {
  rl: {
    label: 'Rocket League', code: 'RL', color: '#2f6bff', account: ['rl', 'ton pseudo Rocket League'], tool: ['rl', 'Tracker', '/equipe/rl/'], more: [['packs', 'Packs d’entraînement', '/equipe/packs/']],
    board: { map: 'Terrain', kit: { players: ['1', '2', '3'], ally: { name: 'Bleu', color: '#2f6bff' }, enemy: { name: 'Orange', color: '#ff8a1f' }, pings: [
      { key: 'balle', sym: '●', label: 'Ballon', bg: '#eeeeee', fg: '#555' }, { key: 'boost', sym: '100', label: 'Grosse pastille (100)', bg: '#ff9f1a', fg: '#111' },
      { key: 'demo', sym: 'D', label: 'Démolition', bg: '#2a2a2a', fg: '#fff' }, { key: 'rotation', sym: '↻', label: 'Point de rotation', bg: '#2fbf71', fg: '#111' }, DANGER, CHECK] } },
    scouting: {
      players: '- Pseudo (Epic) · place dans la rotation · ce qu’il fait bien', style: 'Rotation rapide ou posée ? Kickoff habituel, jeu aérien, démos, pression…',
      plan: 'Notre kickoff, qui presse, comment on défend leurs aériens, où on les attend', links: 'Profils RL Tracker, replays ballchasing, chaîne Twitch… un par ligne',
      profile: (p) => links.rl(p),
    },
  },
  lol: {
    label: 'League of Legends', code: 'LoL', color: '#0f8a9b', account: ['riot', 'ton Riot ID'], tool: ['lol', 'Drafter', '/equipe/lol/'], more: [['lol-tracker', 'Tracker', '/equipe/tracker-lol/'], ['pools', 'Pools de champions', '/equipe/pools/']],
    board: { map: 'Faille', kit: { players: ['T', 'J', 'M', 'B', 'S'], ally: { name: 'Bleu', color: '#2f6bff' }, enemy: { name: 'Rouge', color: '#e5251f' }, pings: [
      { key: 'ward', sym: '◉', label: 'Balise (portée)', bg: '#ffd23f', fg: '#111' }, { key: 'controle', sym: '◉', label: 'Balise de contrôle (portée)', bg: '#ff4fa3', fg: '#111' },
      { key: 'dragon', sym: 'Dr', label: 'Dragon', bg: '#ff8a1f', fg: '#111' }, { key: 'nashor', sym: 'N', label: 'Nashor', bg: '#8b5cf6', fg: '#fff' }, DANGER, CHECK] } },
    scouting: {
      players: '- Pseudo#TAG · poste · champions favoris', style: 'Early agressif ? Jungler qui envahit ? Priorité aux objectifs…',
      plan: 'Picks, bans, côté de la carte, objectifs à prendre ou à refuser', links: 'op.gg multi, Leaguepedia, chaîne Twitch… un par ligne',
      profile: (p) => links.opgg(p),
    },
  },
  valo: {
    label: 'Valorant', code: 'VAL', color: '#ff4655', account: ['riot', 'ton Riot ID'], tool: ['valo', 'Lineups', '/equipe/valo/'], more: [['valo-tracker', 'Tracker', '/equipe/tracker-valo/'], ['compos', 'Compos et agents', '/equipe/compos/']],
    board: { map: '', kit: { players: ['1', '2', '3', '4', '5'], ally: { name: 'Nous', color: '#2f6bff' }, enemy: { name: 'Eux', color: '#e5251f' }, pings: [
      { key: 'spike', sym: 'S', label: 'Spike', bg: '#e8e8e8', fg: '#c81e19' }, { key: 'info', sym: 'i', label: 'Info (caméra, drone, flèche)', bg: '#22c3d6', fg: '#111' },
      { key: 'entree', sym: '➜', label: 'Point d’entrée', bg: '#2fbf71', fg: '#111' }, DANGER, CHECK] } },
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
