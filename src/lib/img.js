// srcset pour les visuels de public/img qui existent en deux tailles :
// la version réduite « nom-<petite>.webp » et l'original « nom.webp ».
const variants = {
  'hero-fond': [800, 1983],
  'kanji-oni-neon': [800, 1100],
  'decal-octane-domicile': [800, 1600],
  'decal-octane-visiteur': [800, 1600],
  'decal-fennec-domicile': [800, 1600],
  'decal-fennec-visiteur': [800, 1600],
  'entete-club': [800, 1983],
  'entete-effectif': [800, 1983],
  'entete-recrutement': [800, 1983],
  'entete-vestiaire': [800, 1983],
  'pole-rocket-league': [600, 1200],
  'pole-lol': [600, 1200],
  'pole-valorant': [600, 1200],
  'pole-osu': [600, 1200],
};

const nameOf = (src) => src.replace(/^.*\//, '').replace(/\.webp$/, '');

export function srcset(src) {
  const v = variants[nameOf(src)];
  if (!v) return undefined;
  return `${src.replace(/\.webp$/, `-${v[0]}.webp`)} ${v[0]}w, ${src} ${v[1]}w`;
}

// Version réduite seule (petits affichages comme les cartes joueurs)
export function small(src) {
  const v = variants[nameOf(src)];
  return v ? src.replace(/\.webp$/, `-${v[0]}.webp`) : src;
}
