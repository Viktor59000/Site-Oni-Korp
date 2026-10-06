// srcset pour les visuels de public/img qui existent en plusieurs tailles :
// les versions réduites « nom-<largeur>.webp » et l'original « nom.webp » (dernière largeur de la liste).
// Les versions manquantes se génèrent avec : node scripts/variantes.mjs
export const variants = {
  'hero-fond': [800, 1983],
  'kanji-oni-neon': [800, 1100],
  'decal-octane-domicile': [800, 1600],
  'decal-octane-visiteur': [800, 1600],
  'decal-fennec-domicile': [800, 1600],
  'decal-fennec-visiteur': [800, 1600],
  'entete-club': [800, 2000],
  'entete-effectif': [800, 2000],
  'entete-recrutement': [800, 2000],
  'entete-vestiaire': [800, 2000],
  'entete-createurs': [800, 2000],
  'entete-agenda': [800, 2000],
  'entete-partenaires': [800, 2000],
  'entete-contact': [800, 2000],
  'entete-postuler': [800, 2000],
  'bandeau-pinceau': [800, 2000],
  'entete-boosters': [800, 2000],
  'album-couverture': [560, 1122],
  'accueil-album': [560, 1122],
  'accueil-inhouses': [800, 1586],
  'recrutement-staff-bloc': [530, 1060],
  'kanji-oni-pinceau': [600, 1100],
  'match-showmatch': [800, 1600],
  'match-cup': [800, 1600],
  'match-lol': [800, 1600],
  'match-valo': [800, 1600],
  'pole-rocket-league': [600, 800, 1200],
  'pole-lol': [600, 800, 1200],
  'pole-valorant': [600, 800, 1200],
  'pole-osu': [600, 800, 1200],
  'hanko-oni': [96, 160, 320],
  'pochette': [250, 500],
  'sweat-a-plat': [550, 1100],
  'sweat-porte-face': [450, 900],
  'sweat-dos': [400, 600],
  'carl-barl': [152, 304],
  'lolineup': [450, 903],
  'echo-host': [560, 1766],
  'inhouses': [800, 1536],
};
// Dossiers autres que public/img
export const folders = { 'carl-barl': 'public/img/partenaires', lolineup: 'public/img/partenaires' };

const nameOf = (src) => src.replace(/^.*\//, '').replace(/\.webp$/, '');

export function srcset(src) {
  const v = variants[nameOf(src)];
  if (!v) return undefined;
  return v.map((w, i) => (i === v.length - 1 ? `${src} ${w}w` : `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`)).join(', ');
}

// Plus petite version (petits affichages comme les cartes joueurs)
export function small(src) {
  const v = variants[nameOf(src)];
  return v ? src.replace(/\.webp$/, `-${v[0]}.webp`) : src;
}
