// Non-régression des actions d'Inside (POST /api/equipe/outils) : rejoue un geste de chaque type sur la base de démo
// et note la redirection obtenue et ce qui a été écrit. À lancer avant et après un changement, puis comparer.
//   npm run dev:demo (autre terminal), puis : node scripts/non-regression-actions.mjs [--save]
// Écrit dans .demo/oni.db (base de démonstration) : relancer « npm run demo » ensuite pour repartir propre.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@libsql/client';

const BASE = 'http://localhost:4330';
const db = createClient({ url: 'file:.demo/oni.db' });
const T = 'NR'; // marqueur des données de test
const steps = [
  ['comptes', { riot: 'NR#EUW', region: 'euw', rl: 'NRrl', osu: '' }],
  ['setup', { game: 'valo', sens: '0.4', dpi: '800' }],
  ['staff-public', { visible: '1', bio: `${T} bio` }],
  ['metric', { key: 'discord_membres', day: '2026-10-01', value: '42' }],
  ['competition', { roster: '2', name: `${T} cup`, organizer: 'Org', url: 'https://ex.org', level: 'Or', signup_by: '2026-11-01', starts: '2026-11-10' }],
  ['tache', { kind: 'visuel', title: `${T} tâche`, jour: '2026-10-20', heure: '19:00', brief: 'b', networks: 'x' }],
  ['tache-maj', { id: '1', op: 'prendre' }],
  ['statut', { roster: '2', user: '2', statut: 'essai', fin: '2026-11-01', retour: `${T} retour` }],
  ['objectif', { roster: '2', title: `${T} objectif`, detail: 'd', due: '2026-12-01' }],
  ['objectif-maj', { id: '1', status: 'en-cours', progress: '40' }],
  ['doc', { roster: '2', title: `${T} doc`, body: 'texte', pinned: '1' }],
  ['osu-map', { roster: '4', map: 'https://osu.ppy.sh/beatmapsets/1#osu/123456', note: `${T} map`, challenge: '1', days: '7' }],
  ['tableau', { roster: '2', game: 'lol', map: 'Faille', title: `${T} tableau` }],
  ['note', { match: '1', good: `${T} bien`, work: 'à revoir', rating: '7' }],
  ['draft', { roster: '2', data: '{"blue":["Ahri"]}', title: `${T} draft` }],
  ['lineup', { roster: '3', map: 'Ascent', agent: 'Sova', side: 'atk', title: `${T} lineup`, x: '0.4', y: '0.5', tx: '0.6', ty: '0.4', url: 'https://ex.org/v', note: 'n', kind: 'lineup' }],
  ['stats', { match: '1', score: '500', buts: '2', arrets: '3' }],
  ['vod', { roster: '1', url: 'https://youtu.be/xyz', title: `${T} vod`, match: '1' }],
  ['vod-mark', { vod: '1', t: '1:23', kind: 'bien', text: `${T} repère` }],
  ['replay', { match: '1', replays: 'https://ballchasing.com/replay/12345678-1234-1234-1234-123456789abc' }],
  ['adversaire', { roster: '2', name: `${T} adversaire`, style: 's', forces: 'f', faiblesses: 'w', plan: 'p' }],
  ['compo', { match: '1', titulaires: '2', remplacant: '3' }],
  // Outils ajoutés le 07/10
  ['pool', { roster: '2', game: 'lol', item: 'Ahri', tier: 'main' }],
  ['compo-carte', { roster: '3', map: 'Ascent', agents: 'Sova', note: `${T} compo` }],
  ['pack', { roster: '1', code: 'A1B2-C3D4-E5F6-G7H8', title: `${T} pack`, kind: 'aerien' }],
  ['carnet', { body: `${T} carnet` }],
  ['accord-image', { image: '1' }],
  ['plan-seance', { training: '1', plan: `${T} plan` }],
  ['relance', { training: '1' }],
  ['tableau', { roster: '2', game: 'lol', map: 'Faille', title: `${T} brouillon`, brouillon: '1' }],
  ['suppr', { table: 'drafts', id: '1' }],
  ['inconnue', {}],
];
const out = {};
for (const [action, fields] of steps) {
  const body = new URLSearchParams({ action, back: '/equipe/?r=lol-academy', ...fields });
  const r = await fetch(`${BASE}/api/equipe/outils`, { method: 'POST', body, redirect: 'manual', headers: { Origin: BASE } });
  out[`POST ${action}`] = `${r.status} ${(r.headers.get('location') ?? '').replace(/([?&](d|o|b)=)\d+/g, '$1N')}`;
}
// Ce qui a été écrit (identifiants et dates neutralisés)
const mask = (rows) => JSON.stringify(rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => isNaN(Number(k))).map(([k, v]) => [k, /(^id$|_at$|^at$|^due$|^ends$|^updated_at$)/.test(k) ? 'X' : v]))));
for (const [t, where] of [['accounts', "user_id = '100000000000000001'"], ['setups', "user_id = '100000000000000001'"], ['staff_public', '1'], ['metrics', "day = '2026-10-01'"],
  ['competitions', "name LIKE 'NR%'"], ['content_tasks', "title LIKE 'NR%' OR id = 1"], ['roster_status', "retour LIKE 'NR%'"], ['goals', "title LIKE 'NR%' OR id = 1"], ['docs', "title LIKE 'NR%'"],
  ['osu_maps', "note LIKE 'NR%'"], ['boards', "title LIKE 'NR%'"], ['match_notes', "good LIKE 'NR%'"], ['drafts', '1'], ['lineups', "title LIKE 'NR%'"], ['match_stats', 'match_id = 1'],
  ['vods', "title LIKE 'NR%'"], ['vod_marks', "text LIKE 'NR%'"], ['match_replays', 'match_id = 1'], ['opponents', "name LIKE 'NR%'"],
  ['pools', "item = 'Ahri'"], ['comps', "note LIKE 'NR%'"], ['rl_packs', "title LIKE 'NR%'"], ['carnet', "body LIKE 'NR%'"], ['consents', '1'], ['trainings', "plan LIKE 'NR%'"]]) {
  out[`table ${t}`] = mask((await db.execute(`SELECT * FROM ${t} WHERE ${where} ORDER BY 1`).catch((e) => ({ rows: [{ erreur: e.message }] }))).rows);
}
out['matches.lineup'] = mask((await db.execute('SELECT lineup FROM matches WHERE id = 1')).rows);

const file = path.join(os.tmpdir(), 'oni-nr', 'actions.json');
if (process.argv.includes('--save')) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(out, null, 1)); console.log(`Référence : ${Object.keys(out).length} éléments.`); process.exit(0); }
const ref = JSON.parse(fs.readFileSync(file, 'utf8'));
const diff = Object.keys({ ...ref, ...out }).filter((k) => ref[k] !== out[k]);
for (const k of diff) console.log(`✗ ${k}\n   avant : ${String(ref[k]).slice(0, 300)}\n   après : ${String(out[k]).slice(0, 300)}`);
console.log(diff.length ? `${diff.length} différence(s).` : `✓ ${Object.keys(out).length} éléments identiques.`);
process.exit(diff.length ? 1 : 0);
