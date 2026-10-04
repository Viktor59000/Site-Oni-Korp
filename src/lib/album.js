// Album Panini de l'Effectif : ordre des vignettes, numéros, illustrations.
// Partagé entre la page Effectif et l'extrait de l'accueil pour garder les mêmes numéros.
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
const variants = { rl: 3, osu: 2 };
const artKey = (g, p, i, ri) => {
  if (hasRole(p)) return `${prefix[g.id]}-${slug(p.role)}`;
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
      lettre: g.rosters.length > 1 ? GREC[r.name] : null,
      equipe: g.id === 'rocket-league' ? EQUIPES[ri % 2] : null,
      cards: r.players.map(norm).map((p, i) => ({
        name: p.name,
        photo: p.photo,
        role: p.role,
        label: g.rosters.length > 1 ? `Roster ${r.name}` : g.name,
        art: artKey(g, p, i, ri),
        flip: ri % 2 === 1,
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

export const album = { games, staff, open, total: num };
