// Captures d'Inside pour la page de présentation (InsideIntro.astro), prises sur la base de démonstration.
//   npm run dev:demo (autre terminal), puis : node scripts/captures-inside.mjs
// Écrit public/img/inside/<nom>.webp en 1200 × 750. Les captures ne montrent que des rosters de démonstration.
import { createHmac } from 'node:crypto';
import puppeteer from 'puppeteer-core';

const B = 'http://localhost:4330';
const SHOTS = [
  ['mon-espace', '/equipe/'],
  ['accueil-roster', '/equipe/?r=gamma'],
  ['tableau-rl', '/equipe/tactique/?b=2'],
  ['tableau-lol', '/equipe/tactique/?b=3'],
  ['drafter-lol', '/equipe/lol/?r=lol-academy'],
  ['stats', '/equipe/stats/?r=lol-academy'],
  ['avant-match', '/equipe/match/?m=1&r=gamma'],
  ['contenu', '/equipe/contenu/'],
  ['communaute', '/equipe/communaute/'],
];
const payload = Buffer.from(JSON.stringify({ id: '100000000000000001', name: 'Démo', avatar: null, exp: Date.now() + 3600_000 })).toString('base64url');
const b = await puppeteer.launch({ executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const p = await b.newPage();
await p.setCookie({ name: 'oni_session', value: `${payload}.${createHmac('sha256', 'demo-local-seulement').update(payload).digest('base64url')}`, domain: 'localhost' });
await p.setViewport({ width: 1200, height: 750 });
for (const [name, url] of SHOTS) {
  await p.goto(B + url, { waitUntil: 'networkidle0' });
  // Menu de gauche replié : plus de place pour l'outil ; bouton « Avis » masqué
  await p.evaluate(() => { document.body.classList.add('qg-folded'); document.querySelectorAll('astro-dev-toolbar, [data-avis], .avis-btn, .feedback').forEach((e) => e.remove()); });
  await new Promise((r) => setTimeout(r, 600));
  await p.screenshot({ path: `public/img/inside/${name}.webp`, type: 'webp', quality: 82 });
  console.log('✓', name);
}
await b.close();
