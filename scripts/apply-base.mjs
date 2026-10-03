// Préfixe les chemins absolus (/img/..., /club/...) par BASE_PATH dans dist/,
// pour un hébergement dans un sous-dossier (GitHub Pages de projet).
// BASE_PATH s'écrit sans slash (ex. « Site-Oni-Korp ») : Git Bash transforme
// sinon « /Site-Oni-Korp/ » en chemin Windows.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const name = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');
if (!name) process.exit(0);
const base = `/${name}`;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(html|css)$/.test(e.name)) yield p;
  }
}

// Préfixe un chemin absolu sauf s'il est protocol-relative (//) ou déjà préfixé
const fix = (path) => (path.startsWith('//') || path.startsWith(base + '/') ? path : base + path);

for await (const file of walk('dist')) {
  const src = await readFile(file, 'utf8');
  const out = src
    .replace(/(\s(?:href|src|content)=["'])(\/[^"']*)/g, (_, a, p) => a + fix(p))
    .replace(/(\ssrcset=["'])([^"']*)/g, (_, a, list) => a + list.replace(/(^|,\s*)(\/[^\s,]+)/g, (__, sep, p) => sep + fix(p)))
    .replace(/url\((["']?)(\/[^)"']*)/g, (_, q, p) => `url(${q}${fix(p)}`);
  if (out !== src) await writeFile(file, out);
}
console.log(`Chemins préfixés par ${base}/`);
