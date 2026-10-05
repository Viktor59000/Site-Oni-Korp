// Images d'aperçu (Discord, X, WhatsApp, Google) : une par page publique, aux couleurs du club.
// Fond = visuel de la page, bandeau noir avec le logo et le titre. Sortie : public/og/<page>.jpg (1200 × 630).
// Usage : node scripts/og.mjs (à relancer si un titre ou un visuel change)
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const PAGES = [
  ['club', 'Le club', 'Né sur Rocket League en 2021, quatre jeux aujourd’hui', 'public/img/entete-club.webp'],
  ['effectif', 'Légendes du club', 'L’album des joueurs et du staff', 'public/img/album-couverture.webp'],
  ['agenda', 'Agenda', 'Matchs, tournois et lives du club', 'public/img/match-showmatch.webp'],
  ['recrutement', 'Recrutement', 'Joueurs et staff : rejoins la Oni', 'public/img/entete-recrutement.webp'],
  ['boosters', 'Boosters', 'Un booster par jour, 60 vignettes à collectionner', 'public/img/cartes/sp-moments-1.webp'],
  ['inhouses', 'Inhouses', 'Parties entre membres et classement Elo', 'public/img/inhouses.webp'],
  ['vestiaire', 'Vestiaire', 'Sweat du club et decals Rocket League', 'public/img/entete-vestiaire.webp'],
  ['partenaires', 'Partenaires', 'Avance avec un club qui joue, caste et grandit', 'public/img/cartes/sp-partenaires-1.webp'],
  ['marque', 'Kit de marque', 'Logo, couleurs et règles d’utilisation', 'public/img/cartes/sp-legendaires-1.webp'],
  ['contact', 'Contact', 'Une question, un partenariat ? Écris-nous', 'public/img/hero-fond.webp'],
];
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
// Polices du club en TTF (les mêmes que les cartes d'Oni Bot)
const fontFiles = ['DelaGothicOne.ttf', 'ZenKaku-700.ttf'].map((f) => `../oni-bot/assets/fonts/${f}`);
const logo = fs.readFileSync('public/marque/oni-symbole-rouge.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace('<svg', '<svg x="64" y="60" width="86" height="86"');

fs.mkdirSync('public/og', { recursive: true });
for (const [slug, title, sub, bg] of PAGES) {
  const W = 1200, H = 630;
  const back = await sharp(bg).resize(W, H, { fit: 'cover', position: 'attention' }).modulate({ brightness: .75 }).toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0a0a0a" stop-opacity=".96"/><stop offset=".55" stop-color="#0a0a0a" stop-opacity=".82"/><stop offset="1" stop-color="#0a0a0a" stop-opacity=".1"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="0" y="${H - 14}" width="${W}" height="14" fill="#E5251F"/>
    ${logo}
    <text x="168" y="118" font-family="Zen Kaku Gothic New" font-weight="700" font-size="28" letter-spacing="4" fill="#E5251F">ONI KORP</text>
    <text x="64" y="${title.length > 12 ? 330 : 340}" font-family="Dela Gothic One" font-size="${title.length > 14 ? 84 : 104}" fill="#F3F1EC">${esc(title)}</text>
    <text x="66" y="410" font-family="Zen Kaku Gothic New" font-weight="700" font-size="34" fill="#C9C3BA">${esc(sub)}</text>
    <text x="66" y="${H - 50}" font-family="Zen Kaku Gothic New" font-weight="700" font-size="24" fill="#8A847C">oni-korp.vercel.app/${slug}</text>
  </svg>`;
  const layer = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false } }).render().asPng();
  await sharp(back).composite([{ input: layer }]).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/og/${slug}.jpg`);
  console.log('ok', slug);
}
