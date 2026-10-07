// Cohérence site ↔ Oni Bot : les deux dépôts écrivent chacun leurs listes de rôles, de postes et de couleurs.
// Ce script les relit dans les deux codes et signale tout écart. Il faut le dépôt du bot à côté de celui du site
// (../oni-bot), sinon il ne fait rien.  node scripts/coherence.mjs
import fs from 'node:fs';

const BOT = new URL('../../oni-bot/src/', import.meta.url);
const SITE = new URL('../src/', import.meta.url);
if (!fs.existsSync(BOT)) { console.log('Dépôt oni-bot absent à côté du site : vérification sautée.'); process.exit(0); }
const read = (base, p) => fs.readFileSync(new URL(p, base), 'utf8');
const strings = (src) => [...src.matchAll(/'([^']+)'/g)].map((m) => m[1]);
const between = (src, start, end = '\n') => { const i = src.indexOf(start); if (i < 0) throw new Error(`introuvable : ${start}`); return src.slice(i + start.length, src.indexOf(end, i + start.length)); };

const access = read(SITE, 'server/equipe/access.ts');
const postuler = read(SITE, 'server/recrutement/postuler.ts');
const jeux = read(SITE, 'server/equipe/jeux.ts');
const config = read(BOT, 'config.ts');
const util = read(BOT, 'util.ts');
const recrutement = read(BOT, 'modules/recrutement.ts');
const cards = read(BOT, 'cards.ts');

const checks = [];
const same = (label, a, b) => {
  const A = [...new Set(a)].sort(), B = [...new Set(b)].sort();
  if (!A.length || !B.length) return checks.push({ label, ok: false, detail: 'liste illisible (le code a changé de forme ?)' });
  const onlyA = A.filter((x) => !B.includes(x)), onlyB = B.filter((x) => !A.includes(x));
  checks.push({ label, ok: !onlyA.length && !onlyB.length, detail: [onlyA.length ? `seulement site : ${onlyA.join(', ')}` : '', onlyB.length ? `seulement bot : ${onlyB.join(', ')}` : ''].filter(Boolean).join(' · ') });
};
const included = (label, a, b) => {
  if (!a.length || !b.length) return checks.push({ label, ok: false, detail: 'liste illisible (le code a changé de forme ?)' });
  const missing = a.filter((x) => !b.includes(x));
  checks.push({ label, ok: !missing.length, detail: missing.length ? `absents côté bot : ${missing.join(', ')}` : '' });
};

// Rôles d'encadrement
const botRoles = Object.fromEntries([...between(config, 'export const ROLES', '};').matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]));
const botStaff = [...between(config, 'export const STAFF_ROLES = [', ']').matchAll(/ROLES\.(\w+)/g)].map((m) => botRoles[m[1]]);
// Côté site, le Modérateur est à part (vue d'ensemble seulement) ; côté bot, il fait partie de l'encadrement (modération)
same('Rôles d’encadrement (access.ts + Modérateur ↔ config.ts)', [...strings(between(access, 'export const STAFF_ROLES = [', ']')), between(access, "MOD_ROLE = '", "'")], botStaff);
// Responsables de jeu
same('Rôles « Responsable » de jeu (access.ts ↔ util.ts)', [...between(access, 'export const GAME_LEAD_ROLES', '};').matchAll(/'(Responsable [^']+)'/g)].map((m) => m[1]),
  [...between(util, 'const GAME_LEAD', '};').matchAll(/'(Responsable [^']+)'/g)].map((m) => m[1]));
// Capitaine et analyste protégés côté bot
included('Capitaine et Analyste (access.ts → LEAD_ROLES du bot)', [between(access, "CAPTAIN_ROLE = '", "'"), between(access, "ANALYST_ROLE = '", "'")], strings(between(util, 'const LEAD_ROLES = [', ']')));
// Postes de candidature : le formulaire du site et le bot doivent proposer exactement les mêmes
same('Postes de candidature (postuler.ts ↔ recrutement.ts)', strings(between(postuler, 'export const POSTES = [', ']')), strings(between(recrutement, 'const POSTES = [', ']')));
// Rôles du pôle contenu : chacun doit être un poste de candidature côté bot
included('Rôles du pôle contenu (access.ts → postes du bot)', strings(between(access, 'export const CONTENT_ROLES = [', ']')), strings(between(recrutement, 'const POSTES = [', ']')));
// Couleurs des jeux (RL : bleu plus clair sur le site, plus profond sur les cartes du bot, voulu)
const siteColors = Object.fromEntries([...jeux.matchAll(/^ {2}(\w+): \{\s*label: '[^']*', code: '[^']*', color: '(#[0-9a-f]{6})'/gim)].map((m) => [m[1], m[2].toLowerCase()]));
const botColors = Object.fromEntries([...between(cards, 'export const POLE', '};').matchAll(/(\w+):\s*'(#[0-9A-F]{6})'/gi)].map((m) => [m[1], m[2].toLowerCase()]));
for (const g of ['lol', 'valo', 'osu']) checks.push({ label: `Couleur ${g} (jeux.ts ↔ cards.ts)`, ok: siteColors[g] === botColors[g], detail: `${siteColors[g]} / ${botColors[g]}` });

for (const c of checks) console.log(`${c.ok ? '✓' : '✗'} ${c.label}${c.ok ? '' : ` : ${c.detail}`}`);
const bad = checks.filter((c) => !c.ok).length;
console.log(bad ? `${bad} écart(s) entre le site et le bot.` : 'Site et bot cohérents.');
process.exit(bad ? 1 : 0);
