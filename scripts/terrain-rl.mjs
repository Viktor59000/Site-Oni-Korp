// Terrain Rocket League vu de dessus pour le tableau blanc (public/img/rl/terrain.svg), rendu « réaliste » :
// gazon tondu en bandes avec grain, éclairage du stade, murs et coins arrondis, filets et poteaux, marquages du DFH Stadium.
// Dimensions et positions officielles du jeu (unités Unreal) : murs à x = ±4096 et y = ±5120, coins coupés,
// buts de 1 786 de large et 880 de profondeur, 34 pastilles de boost (6 grosses, 28 petites), positions de coup d'envoi.
// Bleu défend en bas (y négatif dans le jeu), orange en haut. Relancer : node scripts/terrain-rl.mjs
// Le jeu ne fournit aucune vue de dessus officielle : ce rendu est dessiné, aux vraies cotes.
import fs from 'node:fs';
const W = 8800, H = 12400, X0 = -4400, Y0 = -6200;
const field = [[-2944, -5120], [2944, -5120], [4096, -3968], [4096, 3968], [2944, 5120], [-2944, 5120], [-4096, 3968], [-4096, -3968]];
const big = [[-3072, -4096], [3072, -4096], [-3584, 0], [3584, 0], [-3072, 4096], [3072, 4096]];
const small = [[0, -4240], [-1792, -4184], [1792, -4184], [-940, -3308], [940, -3308], [0, -2816], [-3584, -2484], [3584, -2484], [-1788, -2300], [1788, -2300],
  [-2048, -1036], [0, -1024], [2048, -1036], [-1024, 0], [1024, 0], [-2048, 1036], [0, 1024], [2048, 1036], [-1788, 2300], [1788, 2300], [-3584, 2484], [3584, 2484],
  [0, 2816], [-940, 3308], [940, 3308], [-1792, 4184], [1792, 4184], [0, 4240]];
const kick = [[-2048, -2560], [2048, -2560], [-256, -3840], [256, -3840], [0, -4608]];
const poly = (pts, d = 0) => pts.map(([x, y]) => `${x + Math.sign(x) * d},${-(y + Math.sign(y) * d)}`).join(' ');
// Bandes de tonte : 16 bandes transversales
const stripes = Array.from({ length: 16 }, (_, i) => `<rect x="-4200" y="${-5120 + i * 640}" width="8400" height="640" fill="${i % 2 ? '#3d8c3f' : '#348237'}"/>`).join('');
const goal = (top) => {
  const y = top ? -6000 : 5120, c = top ? '#ff8a1f' : '#2f6bff';
  return `<g><rect x="-1000" y="${top ? -6060 : 5120}" width="2000" height="940" rx="60" fill="#0c1117"/>
  <rect x="-893" y="${y}" width="1786" height="880" fill="${c}" opacity=".28"/>
  <rect x="-893" y="${y}" width="1786" height="880" fill="url(#net)"/>
  <rect x="-893" y="${y}" width="1786" height="880" fill="none" stroke="${c}" stroke-width="40" opacity=".9"/>
  <rect x="-960" y="${top ? -5160 : 5080}" width="1920" height="80" fill="#e9eef3"/>
  <circle cx="-920" cy="${top ? -5120 : 5120}" r="60" fill="#fff"/><circle cx="920" cy="${top ? -5120 : 5120}" r="60" fill="#fff"/></g>`;
};
const pad = ([x, y]) => `<g transform="translate(${x} ${-y})"><circle r="185" fill="#000" opacity=".25"/><circle r="160" fill="url(#padS)"/><circle r="160" fill="none" stroke="#ffe27a" stroke-width="16" opacity=".9"/><circle r="58" fill="#fff3b8"/></g>`;
const bigPad = ([x, y]) => `<g transform="translate(${x} ${-y})"><circle r="520" fill="url(#glow)" opacity=".7"/><circle r="250" fill="#2a2a2a" stroke="#555" stroke-width="20"/><circle r="215" fill="url(#padB)"/><circle r="95" fill="#fff6c9"/></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${W} ${H}">
<defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <radialGradient id="light" cx=".5" cy=".5" r=".65"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
  <linearGradient id="tint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a00" stop-opacity=".16"/><stop offset=".3" stop-color="#ff7a00" stop-opacity="0"/><stop offset=".7" stop-color="#1e5bff" stop-opacity="0"/><stop offset="1" stop-color="#1e5bff" stop-opacity=".18"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#fff3b0" stop-opacity=".9"/><stop offset=".4" stop-color="#ffb21a" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a00" stop-opacity="0"/></radialGradient>
  <radialGradient id="padS"><stop offset="0" stop-color="#ffd84a"/><stop offset="1" stop-color="#b8860b"/></radialGradient>
  <radialGradient id="padB"><stop offset="0" stop-color="#ffe066"/><stop offset=".7" stop-color="#ff9a1a"/><stop offset="1" stop-color="#d45f00"/></radialGradient>
  <pattern id="net" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M0 0L90 90M90 0L0 90" stroke="#fff" stroke-width="7" opacity=".45"/></pattern>
  <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b2633"/><stop offset="1" stop-color="#2c3d52"/></linearGradient>
  <clipPath id="f"><polygon points="${poly(field)}"/></clipPath>
</defs>
<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="#0b1016"/>
<polygon points="${poly(field, 230)}" fill="url(#wall)" stroke="#3b5068" stroke-width="30" stroke-linejoin="round"/>
${goal(true)}${goal(false)}
<g clip-path="url(#f)">
  ${stripes}
  <rect x="-4200" y="-5200" width="8400" height="10400" fill="#2a6b2e" filter="url(#grain)" opacity=".55"/>
  <rect x="-4200" y="-5200" width="8400" height="10400" fill="url(#tint)"/>
  <g fill="none" stroke="#f2f4f2" stroke-width="34" opacity=".8">
    <path d="M-1500 -5120 V-3950 Q-1500 -3600 -1150 -3600 H1150 Q1500 -3600 1500 -3950 V-5120"/>
    <path d="M-1500 5120 V3950 Q-1500 3600 -1150 3600 H1150 Q1500 3600 1500 3950 V5120"/>
    <path d="M-650 -5120 V-4500 H650 V-5120"/><path d="M-650 5120 V4500 H650 V5120"/>
    <circle r="1150"/><circle r="140" fill="#f2f4f2"/>
    <path d="M-4096 0 H-1150 M1150 0 H4096"/>
  </g>
  <rect x="-4200" y="-5200" width="8400" height="10400" fill="url(#light)"/>
</g>
<polygon points="${poly(field)}" fill="none" stroke="#f7f9fb" stroke-width="60" stroke-linejoin="round"/>
<line x1="-893" y1="-5120" x2="893" y2="-5120" stroke="#ff8a1f" stroke-width="60"/>
<line x1="-893" y1="5120" x2="893" y2="5120" stroke="#2f6bff" stroke-width="60"/>
${kick.flatMap(([x, y]) => [[x, y], [x, -y]]).map(([x, y]) => `<path d="M${x - 80} ${-y}h160M${x} ${-y - 80}v160" stroke="#fff" stroke-width="24" opacity=".55"/>`).join('')}
${small.map(pad).join('')}
${big.map(bigPad).join('')}
</svg>`;
fs.writeFileSync(new URL('../public/img/rl/terrain.svg', import.meta.url), svg.replace(/\n\s*/g, ''));
console.log(`terrain.svg : ${svg.length} octets, ${small.length + big.length} boosts`);
