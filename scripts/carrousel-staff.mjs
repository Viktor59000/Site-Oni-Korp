// Carrousel Instagram « On recrute le staff » (reseaux/POSTS-STAFF.md § 3) : 5 diapositives 1080 × 1350.
// Fonds : reseaux/instagram/staff/fond-*.png (zone haute vide). Les titres sont posés ici, dans la DA (Dela Gothic One, Zen Kaku Gothic New).
// Sortie : reseaux/instagram/staff/diapo-*.jpg. Usage : node scripts/carrousel-staff.mjs
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const DIR = '../reseaux/instagram/staff';
const W = 1080, H = 1350;
const fontFiles = ['DelaGothicOne.ttf', 'ZenKaku-700.ttf'].map((f) => `../oni-bot/assets/fonts/${f}`);
const logo = fs.readFileSync('public/marque/oni-symbole-rouge.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace('<svg', '<svg x="72" y="72" width="64" height="64"');
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

// [fichier, titre (lignes), texte (lignes)]
const SLIDES = [
  ['1-couverture', ['On recrute', 'le staff'], ['Oni Korp · saison 2026-2027', 'Bénévole, à distance, 18 ans et plus']],
  ['2-responsable', ['Responsable', 'de jeu'], ['Rocket League, LoL ou Valorant.', 'Tu fais vivre un jeu : candidatures,', 'rosters, tournois.']],
  ['3-cm', ['Community', 'manager'], ['La voix du club sur les réseaux.', 'Les tâches arrivent toutes seules', 'à chaque match.']],
  ['4-moderation', ['Modération', 'et accueil'], ['Un serveur sain, et personne', 'qui arrive sans qu’on lui parle.']],
  ['5-postuler', ['Comment', 'postuler'], ['Une fiche par poste, une période d’essai,', 'un retour écrit. Lien en bio.']],
];

for (const [i, [file, title, text]] of SLIDES.entries()) {
  const size = Math.max(...title.map((t) => t.length)) > 11 ? 104 : 124;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a0a" stop-opacity=".9"/><stop offset=".4" stop-color="#0a0a0a" stop-opacity=".8"/><stop offset=".56" stop-color="#0a0a0a" stop-opacity="0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${logo}
    <text x="152" y="116" font-family="Zen Kaku Gothic New" font-weight="700" font-size="26" letter-spacing="5" fill="#E5251F">ONI KORP · STAFF</text>
    <text x="${W - 72}" y="116" text-anchor="end" font-family="Zen Kaku Gothic New" font-weight="700" font-size="26" fill="#8A847C">${i + 1}/${SLIDES.length}</text>
    ${title.map((t, k) => `<text x="68" y="${250 + k * (size + 6)}" font-family="Dela Gothic One" font-size="${size}" fill="#F3F1EC">${esc(t)}</text>`).join('')}
    ${text.map((t, k) => `<text x="72" y="${250 + title.length * (size + 6) + 30 + k * 42}" font-family="Zen Kaku Gothic New" font-weight="700" font-size="33" fill="#E8E2D6">${esc(t)}</text>`).join('')}
    <rect x="0" y="${H - 16}" width="${W}" height="16" fill="#E5251F"/>
  </svg>`;
  const layer = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false } }).render().asPng();
  await sharp(`${DIR}/fond-${file}.png`).composite([{ input: layer }]).jpeg({ quality: 90, mozjpeg: true }).toFile(`${DIR}/diapo-${file}.jpg`);
  console.log('ok', file);
}
