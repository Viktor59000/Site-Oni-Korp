// Image du post X « recrutement staff » (reseaux/POSTS-STAFF.md § 1) : 1600 × 900, même campagne que le carrousel Instagram.
// Fond : la couverture du carrousel, recadrée sur le torii ; titre à gauche dans la DA. Usage : node scripts/x-staff.mjs
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const DIR = '../reseaux/instagram/staff';
const W = 1600, H = 900;
const fontFiles = ['DelaGothicOne.ttf', 'ZenKaku-700.ttf'].map((f) => `../oni-bot/assets/fonts/${f}`);
const logo = fs.readFileSync('public/marque/oni-symbole-rouge.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace('<svg', '<svg x="80" y="80" width="72" height="72"');

// Le fond portrait (1080 × 1350) : on garde la partie basse (le torii), agrandie, collée à droite
const art = await sharp(`${DIR}/fond-1-couverture.png`).extract({ left: 0, top: 420, width: 1080, height: 930 }).resize({ height: H }).toBuffer();
const artW = (await sharp(art).metadata()).width;
const base = await sharp({ create: { width: W, height: H, channels: 3, background: '#0b0a09' } })
  .composite([{ input: art, left: W - artW, top: 0 }]).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0a0a0a" stop-opacity="1"/><stop offset=".45" stop-color="#0a0a0a" stop-opacity=".9"/><stop offset=".7" stop-color="#0a0a0a" stop-opacity="0"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${logo}
  <text x="172" y="130" font-family="Zen Kaku Gothic New" font-weight="700" font-size="30" letter-spacing="5" fill="#E5251F">ONI KORP · STAFF</text>
  <text x="76" y="390" font-family="Dela Gothic One" font-size="132" fill="#F3F1EC">On recrute</text>
  <text x="76" y="530" font-family="Dela Gothic One" font-size="132" fill="#F3F1EC">le staff</text>
  <text x="80" y="620" font-family="Zen Kaku Gothic New" font-weight="700" font-size="38" fill="#E8E2D6">Responsables de jeu · Community manager · Modération</text>
  <text x="80" y="672" font-family="Zen Kaku Gothic New" font-weight="700" font-size="38" fill="#E8E2D6">Bénévole, à distance, 18 ans et plus</text>
  <text x="80" y="${H - 70}" font-family="Zen Kaku Gothic New" font-weight="700" font-size="30" fill="#8A847C">oni-korp.vercel.app/recrutement</text>
  <rect x="0" y="${H - 16}" width="${W}" height="16" fill="#E5251F"/>
</svg>`;
const layer = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false } }).render().asPng();
await sharp(base).composite([{ input: layer }]).jpeg({ quality: 90, mozjpeg: true }).toFile(`${DIR}/x-recrutement-staff.jpg`);
console.log('ok');
