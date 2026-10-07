// Objectifs mesurés automatiquement (07/10) : un objectif créé depuis un Tracker (LoL, Valorant) garde sa mesure
// (« metric » : jeu, clé, départ, cible, sens, unité). osu! : mesuré sur les parties récentes (précision, étoiles, ratés, FC, pp). La page Objectifs recalcule la valeur sur les parties jouées
// depuis la création de l'objectif, et l'avancement suit tout seul. Mêmes calculs que les Trackers.
import { rows } from '../db';
import { avg } from './ui';

export type Metric = { g: 'lol' | 'valo' | 'osu'; k: string; s: number; t: number; d: 1 | -1; u: string };

export function parseMetric(raw: unknown): Metric | null {
  try {
    const m = JSON.parse(String(raw ?? ''));
    if (!['lol', 'valo', 'osu'].includes(m?.g) || !/^[a-zA-Z0-9]{1,20}$/.test(m?.k) || !Number.isFinite(m?.s) || !Number.isFinite(m?.t) || ![1, -1].includes(m?.d)) return null;
    return { g: m.g, k: m.k, s: Number(m.s), t: Number(m.t), d: m.d, u: ['%', 'or', 'xp', ''].includes(m.u) ? m.u : '' };
  } catch { return null; }
}

type G = Record<string, any>;
const sum = (l: G[], k: string) => l.reduce((s, x) => s + (Number(x[k]) || 0), 0);
const has = (l: G[], k: string) => l.filter((x) => x[k] !== undefined && x[k] !== null);
const ratio = (a: number, b: number) => (b ? (a / b) * 100 : null);
/** Valeur d'une mesure sur une liste de parties (même définition que dans les Trackers). */
export function metricValue(k: string, l: G[]): number | null {
  if (!l.length) return null;
  if (k === 'fc') return ratio(l.filter((x) => Number(x.miss) === 0).length, l.length);
  if (k === 'win') return ratio(l.filter((x) => x.win).length, l.length);
  if (k === 'kda') return sum(l, 'k') + sum(l, 'a') ? (sum(l, 'k') + sum(l, 'a')) / Math.max(1, sum(l, 'd')) : 0;
  if (k === 'kd') return sum(l, 'k') / Math.max(1, sum(l, 'd'));
  if (k === 'fb' && l.some((x) => x.rounds === undefined)) return avg(has(l, 'fb').map((x) => x.fb * 100));
  if (k === 'clutch') { const h = has(l, 'clutchN'); return ratio(sum(h, 'clutchW'), sum(h, 'clutchN')); }
  if (k === 'entryWin') { const h = has(l, 'entries'); return ratio(sum(h, 'entriesWon'), sum(h, 'entries')); }
  if (k === 'pistol') { const h = has(l, 'pistolN'); return ratio(sum(h, 'pistolW'), sum(h, 'pistolN')); }
  if (k === 'atkWin' || k === 'defWin') { const n = k === 'atkWin' ? 'atkN' : 'defN'; const h = has(l, k); return ratio(h.reduce((s, x) => s + (x[k] * x[n]) / 100, 0), sum(h, n)); }
  if (k === 'fbr' || k === 'fdr') { const h = has(l, 'rounds'); return sum(h, 'rounds') ? (sum(h, k === 'fbr' ? 'fb' : 'fd') / sum(h, 'rounds')) * 100 : null; }
  return avg(l.map((x) => x[k]));
}

export const fmtMetric = (m: Metric, x: number | null) => {
  if (x === null) return '—';
  // Écarts face à l'adversaire : valeurs signées
  const sign = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '');
  if (m.u === 'or' || m.u === 'xp') return `${sign(x)}${Math.abs(Math.round(x)).toLocaleString('fr-FR')}`;
  if (m.k === 'visionAdv') return `${sign(x)}${Math.abs(Math.round(x))} %`;
  if (m.k.startsWith('csd')) return `${sign(x)}${Math.abs(Math.round(x))}`;
  if (m.u === '%') return `${Math.round(x)} %`;
  return Math.abs(x) >= 100 ? Math.round(x).toLocaleString('fr-FR') : String(Math.round(x * 100) / 100).replace('.', ',');
};

/** Où en est l'objectif : valeur sur les 20 dernières parties depuis sa création, avancement de départ → cible. */
export async function measure(userId: string, since: number, m: Metric) {
  const list = (await rows<{ data: string }>(`SELECT data FROM perf WHERE user_id = ? AND game = ? AND at >= ? ORDER BY at DESC LIMIT 20`, userId, m.g, since))
    .map((r) => { try { return JSON.parse(r.data); } catch { return null; } }).filter(Boolean) as G[];
  const cur = metricValue(m.k, list);
  const span = m.t - m.s;
  const progress = cur === null || !span ? 0 : Math.max(0, Math.min(100, Math.round(((cur - m.s) / span) * 100)));
  const reached = cur !== null && list.length >= 5 && (m.d === 1 ? cur >= m.t : cur <= m.t);
  return { cur, n: list.length, progress, reached };
}
