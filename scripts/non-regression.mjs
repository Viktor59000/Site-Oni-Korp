// Non-régression du site : avant un refactoring on enregistre le HTML de chaque page, après on compare.
// - pages statiques : sortie du build Vercel (VERCEL=1 npm run build → .vercel/output/static)
// - Inside : pages servies par le serveur de dev local (oni-korp-equipe, port 4330, base de test locale)
//   node scripts/non-regression.mjs --save   → référence (dossier temporaire oni-nr, hors dépôt)
//   node scripts/non-regression.mjs          → compare, affiche les pages qui changent et la première ligne différente
// Les noms de fichiers à empreinte (/_astro/x.AbC123.css) et les heures relatives sont neutralisés.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.join(os.tmpdir(), 'oni-nr');
const STATIC = new URL('../.vercel/output/static/', import.meta.url);
const INSIDE = ['/equipe/planning/', '/equipe/?r=lol-academy', '/equipe/?r=gamma', '/equipe/vue/', '/equipe/calendrier/', '/equipe/match/', '/equipe/stats/', '/equipe/objectifs/',
  '/equipe/notes/', '/equipe/vod/', '/equipe/tactique/', '/equipe/tactique/?b=1', '/equipe/scouting/', '/equipe/lol/', '/equipe/valo/', '/equipe/osu/', '/equipe/rl/', '/equipe/joueurs/',
  '/equipe/setup/', '/equipe/docs/', '/equipe/contenu/', '/equipe/tournois/', '/equipe/profil/', '/equipe/guide/', '/equipe/planning/?intro', '/sondage/', '/postuler/'];

const norm = (html) => html
  .replace(/\/_astro\/([\w.-]+?)\.[\w-]{8}\.(css|js|webp|png|jpg|svg|woff2?)/g, '/_astro/$1.$2')
  .replace(/il y a \d+ (min|h|jours?)/g, 'il y a N')
  .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, 'HH:MM')
  .replace(/>\s+</g, '><');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pages = {};
const root = fileURLToPath(STATIC);
if (fs.existsSync(root)) for (const f of walk(root)) pages[`static:${path.relative(root, f).replace(/\\/g, '/')}`] = norm(fs.readFileSync(f, 'utf8'));
for (const u of INSIDE) {
  const r = await fetch(`http://localhost:4330${u}`, { redirect: 'manual' }).catch(() => null);
  pages[`inside:${u}`] = r ? `${r.status} ${r.headers.get('location') ?? ''}\n${norm(await r.text())}` : 'injoignable';
}

if (process.argv.includes('--save')) {
  fs.rmSync(DIR, { recursive: true, force: true }); fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(path.join(DIR, 'ref.json'), JSON.stringify(pages));
  console.log(`Référence : ${Object.keys(pages).length} pages (${DIR}).`);
  process.exit(0);
}
const ref = JSON.parse(fs.readFileSync(path.join(DIR, 'ref.json'), 'utf8'));
let n = 0;
for (const k of Object.keys({ ...ref, ...pages })) {
  if (ref[k] === pages[k]) continue;
  n++;
  const a = ref[k] ?? '', b = pages[k] ?? '';
  let i = 0; while (i < a.length && a[i] === b[i]) i++;
  console.log(`✗ ${k}\n   avant : …${a.slice(Math.max(0, i - 80), i + 120)}\n   après : …${b.slice(Math.max(0, i - 80), i + 120)}`);
}
console.log(n ? `${n} page(s) différente(s).` : `✓ ${Object.keys(pages).length} pages identiques à la référence.`);
process.exit(n ? 1 : 0);
