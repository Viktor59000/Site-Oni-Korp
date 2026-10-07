// Ménage des anciens déploiements Vercel (mail du 07/10/2026 : « Deployment Storage » du plan gratuit à 100 % de 10 Go).
// Chaque envoi sur GitHub crée un déploiement d'environ 70 Mo que Vercel garde ; on en garde seulement les plus récents.
//   1. Crée un jeton : vercel.com > Account Settings > Tokens > Create (portée : l'équipe viktor59000s-projects, expiration 1 jour).
//   2. Simulation (rien n'est supprimé) :    VERCEL_TOKEN=xxx node scripts/vercel-menage.mjs
//   3. Suppression :                         VERCEL_TOKEN=xxx node scripts/vercel-menage.mjs --apply
// Gardés toujours : le déploiement de production en cours et les GARDE plus récents (10 par défaut, GARDE=20 pour en garder plus).
// Un déploiement supprimé ne peut pas être restauré, mais le code reste sur GitHub : on peut toujours redéployer un commit.
import fs from 'node:fs';
const token = process.env.VERCEL_TOKEN;
if (!token) { console.log('Il faut VERCEL_TOKEN (voir l’en-tête du script).'); process.exit(1); }
const { projectId, orgId } = JSON.parse(fs.readFileSync(new URL('../.vercel/project.json', import.meta.url), 'utf8'));
const KEEP = Number(process.env.GARDE ?? 10), APPLY = process.argv.includes('--apply');
const api = async (path, init = {}) => {
  const r = await fetch(`https://api.vercel.com${path}${path.includes('?') ? '&' : '?'}teamId=${orgId}`, { ...init, headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};
const all = [];
for (let until = ''; ;) {
  const j = await api(`/v6/deployments?projectId=${projectId}&limit=100${until ? `&until=${until}` : ''}`);
  all.push(...j.deployments);
  if (!j.pagination?.next) break;
  until = j.pagination.next;
}
all.sort((a, b) => b.created - a.created);
const prod = (await api(`/v9/projects/${projectId}`)).targets?.production?.id;
const keep = new Set([prod, ...all.slice(0, KEEP).map((d) => d.uid)]);
const drop = all.filter((d) => !keep.has(d.uid));
console.log(`${all.length} déploiements, ${keep.size} gardés (production en cours + ${KEEP} plus récents), ${drop.length} à supprimer.`);
const day = (t) => new Date(t).toISOString().slice(0, 10);
if (drop.length) console.log(`Du ${day(drop.at(-1).created)} au ${day(drop[0].created)}.`);
if (!APPLY) { console.log('Simulation : rien n’est supprimé. Relance avec --apply.'); process.exit(0); }
let n = 0;
for (const d of drop) { await api(`/v13/deployments/${d.uid}`, { method: 'DELETE' }).then(() => n++).catch((e) => console.log('échec', d.uid, e.message.slice(0, 80))); }
console.log(`${n} déploiements supprimés. Le stockage se met à jour dans l'heure sur vercel.com > Usage.`);
