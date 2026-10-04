// Mesure Lighthouse (mobile) des pages publiques : node scripts/lighthouse.mjs [url de base]
// Affiche les 4 scores par page et les audits en échec, pour corriger jusqu'à 100.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'https://oni-korp.vercel.app';
const pages = (process.argv[3] ?? '/,/club/,/effectif/,/agenda/,/recrutement/,/postuler/,/vestiaire/,/boosters/,/partenaires/,/contact/,/mentions-legales/,/404').split(',');
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = join(tmpdir(), 'oni-lighthouse'); mkdirSync(dir, { recursive: true });
const bin = join(process.cwd(), 'node_modules', 'lighthouse', 'cli', 'index.js');

for (const p of pages) {
  const out = join(dir, `${p.replace(/\W+/g, '_') || 'home'}.json`);
  spawnSync(process.execPath, [bin, base + p, '--quiet', '--output=json', `--output-path=${out}`, `--chrome-path=${chrome}`,
    '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo'], { stdio: 'ignore' });
  try {
    const r = JSON.parse(readFileSync(out, 'utf8'));
    const s = Object.values(r.categories).map((c) => `${c.id.slice(0, 4)} ${Math.round(c.score * 100)}`).join(' | ');
    const fails = Object.values(r.audits).filter((a) => a.score !== null && a.score < 0.9 && !['manual', 'notApplicable', 'informative'].includes(a.scoreDisplayMode))
      .map((a) => `${a.id}${a.displayValue ? ` (${a.displayValue})` : ''}`);
    console.log(`${p.padEnd(18)} ${s}\n   ${fails.join(', ') || 'rien à corriger'}`);
  } catch { console.log(`${p} : échec de la mesure`); }
}
