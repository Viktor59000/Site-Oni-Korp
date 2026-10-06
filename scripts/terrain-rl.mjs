// Terrain Rocket League vu de dessus pour le tableau blanc (public/img/rl/terrain.svg).
// Dimensions et positions officielles du jeu (unités Unreal, terrain standard type DFH Stadium) :
// murs à x = ±4096 et y = ±5120, coins coupés, buts de 1 786 de large et 880 de profondeur,
// 34 pastilles de boost (6 grosses à 100, 28 petites à 12), positions de coup d'envoi.
// Bleu défend en bas (y négatif dans le jeu), orange en haut. Relancer : node scripts/terrain-rl.mjs
import fs from 'node:fs';
const W = 8800, H = 12400, X0 = -4400, Y0 = -6200;
const P = (x, y) => `${x},${-y}`; // y du jeu vers le haut, y du SVG vers le bas
const field = [[-2944, -5120], [2944, -5120], [4096, -3968], [4096, 3968], [2944, 5120], [-2944, 5120], [-4096, 3968], [-4096, -3968]];
const big = [[-3072, -4096], [3072, -4096], [-3584, 0], [3584, 0], [-3072, 4096], [3072, 4096]];
const small = [[0, -4240], [-1792, -4184], [1792, -4184], [-940, -3308], [940, -3308], [0, -2816], [-3584, -2484], [3584, -2484], [-1788, -2300], [1788, -2300],
  [-2048, -1036], [0, -1024], [2048, -1036], [-1024, 0], [1024, 0], [-2048, 1036], [0, 1024], [2048, 1036], [-1788, 2300], [1788, 2300], [-3584, 2484], [3584, 2484],
  [0, 2816], [-940, 3308], [940, 3308], [-1792, 4184], [1792, 4184], [0, 4240]];
const kick = [[-2048, -2560], [2048, -2560], [-256, -3840], [256, -3840], [0, -4608]];
const stripes = Array.from({ length: 16 }, (_, i) => i).filter((i) => i % 2).map((i) => `<rect x="-4096" y="${-5120 + i * 640}" width="8192" height="640" fill="#fff" opacity=".035"/>`).join('');
const goal = (s) => `<rect x="-893" y="${s > 0 ? -6000 : 5120}" width="1786" height="880" fill="${s > 0 ? '#ff8a1f' : '#2f6bff'}" opacity=".9"/>` +
  `<rect x="-893" y="${s > 0 ? -6000 : 5120}" width="1786" height="880" fill="url(#net)"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${W} ${H}">
<defs>
  <linearGradient id="tint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".22"/><stop offset=".45" stop-color="#ff8a1f" stop-opacity="0"/><stop offset=".55" stop-color="#2f6bff" stop-opacity="0"/><stop offset="1" stop-color="#2f6bff" stop-opacity=".24"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#fff3b0"/><stop offset=".45" stop-color="#ffb21a"/><stop offset="1" stop-color="#ff7a00" stop-opacity="0"/></radialGradient>
  <pattern id="net" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M0 0L120 120M120 0L0 120" stroke="#fff" stroke-width="10" opacity=".35"/></pattern>
  <clipPath id="f"><polygon points="${field.map(([x, y]) => P(x, y)).join(' ')}"/></clipPath>
</defs>
<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="#101614"/>
${goal(1)}${goal(-1)}
<g clip-path="url(#f)">
  <rect x="-4096" y="-5120" width="8192" height="10240" fill="#2c7a3d"/>
  ${stripes}
  <rect x="-4096" y="-5120" width="8192" height="10240" fill="url(#tint)"/>
  <rect x="-1450" y="-5120" width="2900" height="1100" fill="none" stroke="#fff" stroke-width="28" opacity=".45"/>
  <rect x="-1450" y="4020" width="2900" height="1100" fill="none" stroke="#fff" stroke-width="28" opacity=".45"/>
</g>
<polygon points="${field.map(([x, y]) => P(x, y)).join(' ')}" fill="none" stroke="#f4f4f4" stroke-width="70" stroke-linejoin="round"/>
<line x1="-4096" y1="0" x2="4096" y2="0" stroke="#fff" stroke-width="40" opacity=".85"/>
<circle cx="0" cy="0" r="1000" fill="none" stroke="#fff" stroke-width="40" opacity=".85"/>
<circle cx="0" cy="0" r="70" fill="#fff"/>
<line x1="-893" y1="-5120" x2="893" y2="-5120" stroke="#ff8a1f" stroke-width="70"/>
<line x1="-893" y1="5120" x2="893" y2="5120" stroke="#2f6bff" stroke-width="70"/>
${kick.flatMap(([x, y]) => [[x, y], [x, -y]]).map(([x, y]) => `<path d="M${x - 90} ${-y}h180M${x} ${-y - 90}v180" stroke="#fff" stroke-width="26" opacity=".6"/>`).join('')}
${small.map(([x, y]) => `<circle cx="${x}" cy="${-y}" r="150" fill="#ffd23f" fill-opacity=".25" stroke="#ffd23f" stroke-width="24"/><circle cx="${x}" cy="${-y}" r="62" fill="#ffd23f"/>`).join('')}
${big.map(([x, y]) => `<circle cx="${x}" cy="${-y}" r="420" fill="url(#glow)" opacity=".55"/><circle cx="${x}" cy="${-y}" r="210" fill="#ff9f1a" stroke="#fff3b0" stroke-width="34"/><circle cx="${x}" cy="${-y}" r="90" fill="#fff3b0"/>`).join('')}
</svg>`;
fs.writeFileSync(new URL('../public/img/rl/terrain.svg', import.meta.url), svg.replace(/\n\s*/g, ''));
console.log(`terrain.svg : ${svg.length} octets, ${small.length + big.length} boosts`);
