// Typographie française appliquée au HTML compilé (dist/) :
// apostrophe ’, points de suspension …, espace fine insécable avant ; ! ? et insécable avant :
// Ne touche qu'au texte visible et aux attributs de texte (alt, title, aria-label, content),
// jamais aux balises <script> / <style> ni aux URL.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const NNBSP = ' '; // espace fine insécable
const NBSP = ' ';  // espace insécable

function fix(t) {
  return t
    .replace(/(\p{L})'(\p{L})/gu, '$1’$2')
    .replace(/\.\.\./g, '…')
    .replace(/[  ]([;!?])/g, `${NNBSP}$1`)
    .replace(/(\S)([;!?])(?=\s|$)/gu, (m, a, p) => (/[\p{L}\d)»]/u.test(a) ? `${a}${NNBSP}${p}` : m))
    .replace(/ :(?=\s|$)/g, `${NBSP}:`);
}

function process(html) {
  // Découpe en balises / texte ; on saute le contenu des <script> et <style>
  let out = '', skip = null;
  for (const part of html.split(/(<[^>]+>)/)) {
    if (part.startsWith('<')) {
      const m = part.match(/^<\/?\s*(script|style)\b/i);
      if (m) skip = part.startsWith('</') ? null : m[1].toLowerCase();
      out += skip ? part : part.replace(/(\s(?:alt|title|aria-label|content)=")([^"]*)"/g,
        (s, a, v) => (/^https?:|^\/|^[\w.-]+\.(?:svg|png|jpg|webp)$/.test(v) ? s : `${a}${fix(v)}"`));
    } else {
      out += skip ? part : fix(part);
    }
  }
  return out;
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

let n = 0;
for await (const f of walk('dist')) {
  const src = await readFile(f, 'utf8');
  const out = process(src);
  if (out !== src) { await writeFile(f, out); n++; }
}
console.log(`Typographie française appliquée à ${n} pages`);
