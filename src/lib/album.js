// Album Panini de l'Effectif : ordre des vignettes, numéros, illustrations.
// Partagé entre la page Effectif et l'extrait de l'accueil pour garder les mêmes numéros.
import { existsSync } from 'node:fs';
import data from '../data/rosters.json';

// Préfixe des illustrations (public/img/cartes/<préfixe>-<…>.webp) et couleurs de vignette
export const prefix = { 'league-of-legends': 'lol', valorant: 'valo', 'rocket-league': 'rl', osu: 'osu' };
const shortName = { 'rocket-league': 'Rocket League', 'league-of-legends': 'LoL', valorant: 'Valorant', osu: 'osu!' };

// Retire les accents : « Contrôleur » → « controleur »
const slug = (t) => t.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').split('/')[0].trim();
// Un joueur peut être un simple pseudo ou un objet { name, role, photo }
const norm = (p) => (typeof p === 'string' ? { name: p } : p);
const hasRole = (p) => p.role && !p.role.includes('confirmer');

// Variantes disponibles pour les pôles sans rôle (rl-1…rl-3, osu-1…osu-2).
// Le roster suivant décale l'ordre et passe l'image en miroir pour ne pas répéter le précédent.
// Un roster peut aussi avoir ses propres illustrations : rl-gamma-1…3, rl-epsilon-1…3.
const variants = { rl: 3, osu: 2 };
const ownArt = (g, r, i) => {
  const key = `${prefix[g.id]}-${slug(r.name)}-${i + 1}`;
  return existsSync(`public/img/cartes/${key}.webp`) ? key : null;
};
const artKey = (g, p, i, ri, r) => {
  if (hasRole(p)) return `${prefix[g.id]}-${slug(p.role)}`;
  const own = ownArt(g, r, i);
  if (own) return own;
  const n = variants[prefix[g.id]] ?? 3;
  return `${prefix[g.id]}-${((i + ri) % n) + 1}`;
};

// Lettre grecque de chaque roster, et couleur d'équipe Rocket League (bleue / orange, en alternance)
const GREC = { Alpha: 'Α', 'Bêta': 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε', 'Oméga': 'Ω' };
const EQUIPES = ['bleue', 'orange'];

let num = 0;

// Joueurs, pôle par pôle
const games = data.games.map((g) => {
  const filled = g.rosters.filter((r) => r.players.length);
  return {
    game: g,
    rosters: filled.map((r, ri) => ({
      title: g.rosters.length > 1 ? `Roster ${r.name}` : r.name,
      name: r.name,
      // Page dédiée : /effectif/rocket-league/gamma/
      slug: slug(r.name).replace(/\s+/g, '-'),
      href: `/effectif/${g.id}/${slug(r.name).replace(/\s+/g, '-')}/`,
      lettre: g.rosters.length > 1 ? GREC[r.name] : null,
      equipe: g.id === 'rocket-league' ? EQUIPES[ri % 2] : null,
      cards: r.players.map(norm).map((p, i) => ({
        name: p.name,
        photo: p.photo,
        role: p.role,
        label: g.rosters.length > 1 ? `Roster ${r.name}` : g.name,
        art: artKey(g, p, i, ri, r),
        flip: ri % 2 === 1 && !ownArt(g, r, i),
        pole: prefix[g.id],
        lettre: g.rosters.length > 1 ? GREC[r.name] : null,
        equipe: g.id === 'rocket-league' ? EQUIPES[ri % 2] : null,
        num: ++num,
      })),
    })),
    tba: g.rosters.filter((r) => !r.players.length).map((r) => (g.rosters.length > 1 ? `Roster ${r.name}` : 'Line-up')),
  };
});

// Staff : une vignette par personne avec tous ses rôles (club + managers et coachs des pôles)
const singular = { Fondateurs: 'Fondateur', Casteurs: 'Casteur', 'Modérateurs': 'Modérateur' };
const priority = ['Fondateur', 'Coach', 'Modérateur', 'Casteur', 'Graphiste', 'Community manager', 'Manager'];
const people = new Map();
const addRole = (name, role, kind) => {
  if (!people.has(name)) people.set(name, { name, roles: [], kinds: [] });
  people.get(name).roles.push(role);
  people.get(name).kinds.push(kind);
};
for (const s of data.staff) for (const n of s.names) addRole(n, singular[s.role] ?? s.role, singular[s.role] ?? s.role);
for (const g of data.games) for (const st of g.staff ?? []) {
  const kind = st.role.startsWith('Coach') ? 'Coach' : st.role;
  for (const n of st.name.split(/,\s*/)) addRole(n, `${kind} ${shortName[g.id]}`, kind);
}
// Illustration : staff-<rôle principal>-<n> (ex. staff-fondateur-2, staff-coach-1)
const staffArtCount = {};
const staff = [...people.values()]
  .map((p) => ({ ...p, primary: priority.find((k) => p.kinds.includes(k)) ?? p.kinds[0] }))
  .sort((a, b) => priority.indexOf(a.primary) - priority.indexOf(b.primary))
  .map((p) => {
    const k = slug(p.primary);
    staffArtCount[k] = (staffArtCount[k] ?? 0) + 1;
    return { name: p.name, role: p.roles.join(', '), icon: p.primary, art: `staff-${k}-${staffArtCount[k]}`, pole: 'staff', num: ++num };
  });

// Postes ouverts : emplacements vides en fin d'album
const open = data.staff.filter((s) => !s.names.length).map((s) => ({ role: s.role, num: ++num }));

// Séries spéciales : uniquement dans les boosters et la collection (pas sur l'Effectif).
// rarete : commune, argent, holo, legendaire (plus c'est rare, moins on la tire).
const SERIES = [
  { id: 'moments', titre: 'Moments', rarete: 'holo', cartes: [
    { title: 'Fondation', sub: '12 juillet 2021', img: '/img/entete-club.webp', pos: '78% 50%', overlay: '12.07.21' },
    { title: 'Showmatch', sub: 'Contre Dream Team, BO7', img: '/img/match-showmatch.webp', pos: '55% 50%' },
    { title: 'IMPC Cup', sub: 'Gamma et Epsilon engagés', img: '/img/match-cup.webp' },
    { title: 'Ouverture LoL', sub: 'Janvier 2024', img: '/img/match-lol.webp', pos: '35% 50%' },
    { title: 'Ouverture Valorant', sub: 'Janvier 2024', img: '/img/match-valo.webp', pos: '60% 50%' },
  ] },
  { id: 'garage', titre: 'Garage', rarete: 'argent', cartes: [
    { title: 'Octane', sub: 'Decal domicile', img: '/img/decal-octane-domicile.webp' },
    { title: 'Octane', sub: 'Decal visiteur', img: '/img/decal-octane-visiteur.webp' },
    { title: 'Fennec', sub: 'Decal domicile', img: '/img/decal-fennec-domicile.webp' },
    { title: 'Fennec', sub: 'Decal visiteur', img: '/img/decal-fennec-visiteur.webp' },
  ] },
  { id: 'partenaires', titre: 'Partenaires', rarete: 'argent', cartes: [
    { title: 'Carl & Barl', sub: 'by LNDR · Rocket League', logo: '/img/partenaires/carl-barl.webp', bg: '#1d1d1d' },
    { title: 'LoLineup.gg', sub: 'League of Legends', logo: '/img/partenaires/lolineup.webp', bg: '#0a2b36', wide: true },
  ] },
  { id: 'terrains', titre: 'Terrains', rarete: 'commune', cartes: [
    { title: 'Rocket League', sub: 'Terrain', img: '/img/pole-rocket-league.webp' },
    { title: 'League of Legends', sub: 'Terrain', img: '/img/pole-lol.webp' },
    { title: 'Valorant', sub: 'Terrain', img: '/img/pole-valorant.webp' },
    { title: 'osu!', sub: 'Terrain', img: '/img/pole-osu.webp' },
  ] },
  { id: 'vestiaire', titre: 'Vestiaire', rarete: 'commune', cartes: [
    { title: 'Le sweat', sub: 'Au casier', img: '/img/sweat-porte-face.webp', chest: true },
    { title: 'Le sweat', sub: 'Dos personnalisé', img: '/img/sweat-dos.webp' },
  ] },
  { id: 'legendaires', titre: 'Légendaires', rarete: 'legendaire', cartes: [
    { title: 'Le blason', sub: 'Oni Korp', kind: 'blason' },
    { title: 'Jamais à genoux', sub: "Oni's never on knees", kind: 'devise', img: '/img/kanji-oni-neon.webp' },
  ] },
  { id: 'recrue', titre: 'Recrue', rarete: 'commune', cartes: [
    { title: 'Ta place ici', sub: 'Postule au club', kind: 'recrue' },
  ] },
];
const players = num;
// Une vignette spéciale n'entre dans les boosters qu'une fois son illustration livrée
const specials = SERIES
  .map((s) => ({ ...s, cartes: s.cartes.map((c, i) => ({ ...c, art: `sp-${s.id}-${i + 1}` })).filter((c) => existsSync(`public/img/cartes/${c.art}.webp`)) }))
  .filter((s) => s.cartes.length)
  .map((s) => ({ ...s, cartes: s.cartes.map((c) => ({ ...c, serie: s.id, serieTitre: s.titre, rarete: s.rarete, num: ++num })) }));

export const album = { games, staff, open, total: players, specials, totalAll: num };
