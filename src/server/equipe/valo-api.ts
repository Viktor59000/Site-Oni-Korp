// Cartes Valorant (valorant-api.com, données officielles) lues côté serveur : l'image de la carte part avec le HTML
// au lieu d'attendre deux appels du navigateur. Liste gardée 6 h en mémoire ; délai court, la page s'en passe si l'API traîne.
export type ValoMap = { name: string; icon: string; competitive: boolean };
const g = globalThis as { __valoMaps?: { at: number; maps: ValoMap[] } };

export async function valoMaps(): Promise<ValoMap[]> {
  if (g.__valoMaps && Date.now() - g.__valoMaps.at < 6 * 3600_000) return g.__valoMaps.maps;
  const d = await fetch('https://valorant-api.com/v1/maps?language=fr-FR', { signal: AbortSignal.timeout(800) }).then((r) => r.json()).catch(() => null);
  if (!d?.data) return g.__valoMaps?.maps ?? [];
  const maps = d.data.filter((m: any) => m.displayIcon).map((m: any) => ({ name: m.displayName, icon: m.displayIcon, competitive: !!m.tacticalDescription }))
    .sort((a: ValoMap, b: ValoMap) => a.name.localeCompare(b.name, 'fr'));
  g.__valoMaps = { at: Date.now(), maps };
  return maps;
}
