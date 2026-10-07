// Listes officielles des jeux, lues côté serveur et gardées 6 h en mémoire :
// champions de League of Legends (Data Dragon) et agents de Valorant (valorant-api.com). Sert aux pools et aux compos.
import { ddragon } from './ui';

type Cache<T> = { at: number; v: T } | null;
let champs: Cache<{ id: string; name: string; icon: string }[]> = null;
let agents: Cache<{ name: string; icon: string; role: string }[]> = null;
const FRESH = 6 * 3600_000;

export async function lolChampions() {
  if (champs && Date.now() - champs.at < FRESH) return champs.v;
  const v = await ddragon();
  const d = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/champion.json`, { signal: AbortSignal.timeout(3000) }).then((r) => r.json()).catch(() => null);
  if (!d?.data) return champs?.v ?? [];
  const list = Object.values<any>(d.data).map((c) => ({ id: String(c.id), name: String(c.name), icon: `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${c.id}.png` }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  champs = { at: Date.now(), v: list };
  return list;
}

export async function valoAgents() {
  if (agents && Date.now() - agents.at < FRESH) return agents.v;
  const d = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=fr-FR', { signal: AbortSignal.timeout(3000) }).then((r) => r.json()).catch(() => null);
  if (!d?.data) return agents?.v ?? [];
  const list = d.data.map((a: any) => ({ name: String(a.displayName), icon: String(a.displayIconSmall ?? a.displayIcon), role: String(a.role?.displayName ?? '') }))
    .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'fr'));
  agents = { at: Date.now(), v: list };
  return list;
}
