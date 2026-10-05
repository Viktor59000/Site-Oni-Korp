// Intègre les vignettes de visuels/cartes dans public/img/cartes :
// <nom>.webp/.avif en 560 px de large et <nom>-sm.webp/.avif en 300 px.
// Usage : node scripts/cartes.mjs
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
const SRC = 'visuels/cartes', OUT = 'public/img/cartes';
mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter((f) => /\.(webp|png|jpg)$/.test(f) && !/^reference-|variante/.test(f));
for (const f of files) {
  const name = f.replace(/\.\w+$/, '');
  for (const [w, suffix] of [[560, ''], [300, '-sm']]) {
    const img = sharp(`${SRC}/${f}`).resize({ width: w, height: Math.round(w * 1.5), fit: 'cover' });
    await img.clone().webp({ quality: 80 }).toFile(`${OUT}/${name}${suffix}.webp`);
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${name}${suffix}.avif`);
  }
  console.log('ok', name);
}
