// Lighthouse de l'espace équipe sur un build de PRODUCTION servi en local (l'espace équipe exige une session).
// Construit avec l'adaptateur Node, lance le serveur sur la vraie base Turso (lecture seule ici),
// signe une session de test avec un secret local, puis mesure chaque page.
// Usage : node scripts/lighthouse-equipe.mjs [pages séparées par des virgules]
import { readFileSync } from 'node:fs';
import { spawn, execSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const env = Object.fromEntries(readFileSync(new URL('../../oni-bot/.env', import.meta.url), 'utf8').split(/\r?\n/)
  .map((l) => l.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean).reverse().map((m) => [m[1], m[2].trim()]));
const SECRET = 'mesure-locale';
const base = { ...process.env, ONI_API: '1', ONI_NODE: '1', TURSO_DATABASE_URL: env.TURSO_DATABASE_URL, TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN, SESSION_SECRET: SECRET };
if (!process.env.SANS_BUILD) execSync('npx astro build', { stdio: 'inherit', env: base });
const server = spawn('node', ['dist/server/entry.mjs'], { env: { ...base, PORT: '4350', HOST: '127.0.0.1' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));

const payload = Buffer.from(JSON.stringify({ id: process.env.ONI_DEV_USER ?? '664164860539699200', name: 'Mesure', avatar: null, exp: Date.now() + 3600_000 })).toString('base64url');
const cookie = `oni_session=${payload}.${createHmac('sha256', SECRET).update(payload).digest('base64url')}`;
const pages = (process.argv[2] ?? '/equipe/,/equipe/vue/,/equipe/joueurs/,/equipe/calendrier/,/equipe/tactique/,/equipe/stats/,/equipe/lol/,/equipe/valo/,/equipe/osu/,/equipe/profil/,/equipe/guide/,/equipe/match/').split(',');
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
try {
  for (const p of pages) {
    const r = await lighthouse(`http://127.0.0.1:4350${p}`, { port: chrome.port, extraHeaders: { Cookie: cookie }, onlyCategories: ['performance', 'accessibility', 'best-practices'] });
    const c = r.lhr.categories, a = r.lhr.audits;
    const bad = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable').map((x) => x.id + (x.displayValue ? ` (${x.displayValue})` : ''));
    if (process.env.DETAILS) for (const id of process.env.DETAILS.split(',')) {
      const items = a[id]?.details?.items ?? [];
      console.log(`  [${id}]`, JSON.stringify(items.slice(0, 6).map((i) => i.node?.snippet ?? i.node?.selector ?? i.url ?? i.issueType ?? i.subItems?.items?.map((x) => x.node?.snippet ?? x.url ?? x.issueType) ?? i)).slice(0, 1500));
    }
    console.log(`${p.padEnd(20)} perf ${Math.round(c.performance.score * 100)} | acce ${Math.round(c.accessibility.score * 100)} | best ${Math.round(c['best-practices'].score * 100)}\n   ${bad.join(', ') || 'rien à corriger'}`);
  }
} finally { await chrome.kill(); server.kill(); }
