// Images d'aperçu (Discord, X, WhatsApp, Google) : une par page publique, aux couleurs du club.
// Fond = visuel de la page, bandeau noir avec le logo et le titre. Sortie : public/og/<page>.jpg (1200 × 630).
// Usage : node scripts/og.mjs (à relancer si un titre ou un visuel change)
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

// Chaque page prend SON visuel actuel (l'en-tête de la page). Sans visuel dédié : fond d'encre et kanji.
// 'accueil' produit public/og.jpg (aperçu par défaut du site, et de l'accueil).
const PAGES = [
  ['accueil', 'Oni Korp', 'Club esport français depuis 2021 · Jamais à genoux', 'public/img/hero-v2.webp'],
  ['club', 'Le club', 'Né sur Rocket League en 2021, quatre jeux aujourd’hui', 'public/img/entete-club.webp'],
  ['effectif', 'Légendes du club', 'L’album des joueurs et du staff', 'public/img/entete-effectif.webp'],
  ['agenda', 'Agenda', 'Matchs, tournois et lives du club', 'public/img/entete-agenda.webp'],
  ['recrutement', 'Recrutement', 'Joueurs et staff : rejoins la Oni', 'public/img/entete-recrutement.webp'],
  ['boosters', 'Boosters', 'Un booster par jour, 60 vignettes à collectionner', 'public/img/entete-boosters.webp'],
  ['inhouses', 'Inhouses', 'Parties entre membres et classement Elo', 'public/img/entete-inhouses.webp'],
  ['vestiaire', 'Vestiaire', 'Sweat du club et decals Rocket League', 'public/img/entete-vestiaire.webp'],
  ['partenaires', 'Partenaires', 'Avance avec un club qui joue, caste et grandit', 'public/img/entete-partenaires.webp'],
  ['marque', 'Kit de marque', 'Logo, couleurs et règles d’utilisation', 'public/img/cartes/sp-legendaires-1.webp'],
  ['contact', 'Contact', 'Une question, un partenariat ? Écris-nous', 'public/img/entete-contact.webp'],
  ['createurs', 'Créateurs', 'Les streamers et vidéastes du club', 'public/img/entete-createurs.webp'],
  ['postuler', 'Postuler', 'Joueurs et staff : candidature en deux minutes', 'public/img/entete-postuler.webp'],
  ['staff', 'Le staff', 'Les bénévoles qui font tourner le club', 'public/img/entete-staff.webp'],
  ['sondage', 'Ton avis', 'Deux minutes pour dire ce qui manque au club', null],
  ['mentions-legales', 'Mentions légales', 'Oni Korp, club esport français', null],
];
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
// Polices du club en TTF (les mêmes que les cartes d'Oni Bot)
const kanji = `data:image/png;base64,${fs.readFileSync('../oni-bot/assets/img/kanji.png').toString('base64')}`;
const fontFiles = ['DelaGothicOne.ttf', 'ZenKaku-700.ttf'].map((f) => `../oni-bot/assets/fonts/${f}`);
const logo = fs.readFileSync('public/marque/oni-symbole-rouge.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace('<svg', '<svg x="64" y="60" width="86" height="86"');

fs.mkdirSync('public/og', { recursive: true });
for (const [slug, title, sub, bg] of PAGES) {
  const W = 1200, H = 630;
  // Sans visuel : encre du club avec le kanji en grand à droite (élément de marque, pas un visuel réutilisé)
  const back = bg
    ? await sharp(bg).resize(W, H, { fit: 'cover', position: 'attention' }).modulate({ brightness: .75 }).toBuffer()
    : await sharp({ create: { width: W, height: H, channels: 3, background: '#141210' } }).png().toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0a0a0a" stop-opacity=".96"/><stop offset=".55" stop-color="#0a0a0a" stop-opacity=".82"/><stop offset="1" stop-color="#0a0a0a" stop-opacity=".1"/></linearGradient></defs>
    ${bg ? '' : `<image href="${kanji}" x="${W - 560}" y="10" width="560" height="600" opacity=".2"/>`}
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="0" y="${H - 14}" width="${W}" height="14" fill="#E5251F"/>
    ${logo}
    <text x="168" y="118" font-family="Zen Kaku Gothic New" font-weight="700" font-size="28" letter-spacing="4" fill="#E5251F">ONI KORP</text>
    <text x="64" y="${title.length > 12 ? 330 : 340}" font-family="Dela Gothic One" font-size="${title.length > 14 ? 84 : 104}" fill="#F3F1EC">${esc(title)}</text>
    <text x="66" y="410" font-family="Zen Kaku Gothic New" font-weight="700" font-size="34" fill="#C9C3BA">${esc(sub)}</text>
    <text x="66" y="${H - 50}" font-family="Zen Kaku Gothic New" font-weight="700" font-size="24" fill="#8A847C">oni-korp.vercel.app${slug === 'accueil' ? '' : `/${slug}`}</text>
  </svg>`;
  const layer = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false } }).render().asPng();
  await sharp(back).composite([{ input: layer }]).jpeg({ quality: 82, mozjpeg: true }).toFile(slug === 'accueil' ? 'public/og.jpg' : `public/og/${slug}.jpg`);
  console.log('ok', slug);
}
// Version des aperçus : l'adresse change, les réseaux rechargent l'image au lieu de garder l'ancienne
fs.writeFileSync('src/data/og-version.json', JSON.stringify({ v: Date.now().toString(36) }) + String.fromCharCode(10));
