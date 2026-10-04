// Génère les tailles réduites des visuels listés dans src/lib/img.js (nom-<largeur>.webp), seulement si elles manquent.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { variants, folders } from '../src/lib/img.js';

for (const [name, widths] of Object.entries(variants)) {
  const dir = folders[name] ?? 'public/img';
  const src = `${dir}/${name}.webp`;
  if (!existsSync(src)) { console.log(`absent : ${src}`); continue; }
  for (const w of widths.slice(0, -1)) {
    const out = `${dir}/${name}-${w}.webp`;
    if (existsSync(out)) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 78 }).toFile(out);
    console.log(`créé : ${out}`);
  }
}
