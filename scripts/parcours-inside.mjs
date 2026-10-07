// Parcours d'Inside : ouvre chaque page pour chaque roster de la base de démo, plus les vues de détail et les API,
// et signale les erreurs serveur et les affichages cassés (NaN %, undefined, [object Object]). npm run dev:demo d'abord.
//   node scripts/parcours-inside.mjs
const B = 'http://localhost:4330';
const pages = ['', 'planning/', 'calendrier/', 'match/', 'tournois/', 'notes/', 'vod/', 'scouting/', 'stats/', 'objectifs/', 'tactique/', 'lol/', 'tracker-lol/', 'tracker-valo/', 'tracker-osu/', 'valo/', 'osu/', 'rl/', 'joueurs/', 'setup/', 'docs/', 'profil/', 'guide/', 'vue/', 'contenu/', 'communaute/', 'packs/', 'pools/', 'compos/'];
const rosters = ['', 'gamma', 'lol-academy', 'valo-main', 'osu-squad'];
const extra = ['profil/?u=2', 'profil/?u=3', 'profil/?u=999', 'docs/?d=1', 'docs/?d=999', 'scouting/?o=1', 'scouting/?o=999', 'vod/?v=1', 'vod/?v=999', 'tactique/?b=1', 'tactique/?b=2', 'tactique/?b=3', 'tactique/?b=999', 'match/?m=1', 'match/?m=3', 'match/?m=999',
  'planning/?sem=cur', 'calendrier/?mois=2026-11', 'calendrier/?mois=xx', 'rl/?j=2', 'rl/?j=999', 'osu/?niveau=tout', 'lol/?d=1', 'valo/?map=Ascent', 'contenu/?erreur=tache', 'planning/?intro', 'stats/?j=2'];
const urls = [...pages.flatMap((p) => rosters.map((r) => `/equipe/${p}${r ? `${p.includes('?') ? '&' : '?'}r=${r}` : ''}`)), ...extra.map((e) => `/equipe/${e}`), '/sondage/', '/api/rl/oni-sync', '/postuler/', '/postuler/?type=staff', '/api/rl/oni-sync', '/api/equipe/outils?type=drafts&roster=2', '/api/equipe/outils?type=lineups&roster=3', '/api/equipe/tableau?id=1&depuis=0'];
let bad = 0;
for (const u of urls) {
  const r = await fetch(B + u, { redirect: 'manual' }).catch((e) => ({ status: 0, text: async () => e.message, headers: new Map() }));
  const t = r.status === 200 ? await r.text() : '';
  const err = r.status >= 500 || r.status === 0 || /An error occurred|Internal Server Error|TypeError|ReferenceError|is not defined|undefined<\/|NaN %|\[object Object\]/.test(t);
  if (err) { bad++; console.log(r.status, u, (t.match(/(TypeError|ReferenceError)[^<]{0,160}|undefined<\/[^>]*>|NaN %|\[object Object\]/) ?? [''])[0]); }
}
console.log(`${urls.length} adresses, ${bad} problème(s).`);
