// Collection de vignettes du visiteur, gardée dans son navigateur (pas de compte).
// - un booster offert chaque jour ;
// - un booster bonus à la première visite de certaines pages ;
// - 5 vignettes par booster, au moins une nouvelle tant que l'album n'est pas complet.

export type Owned = { n: number; holo?: boolean };
export type Collection = {
  v: 2;
  owned: Record<string, Owned>;
  credits: number;
  daily: string;      // dernier jour où le booster quotidien a été donné (AAAA-MM-JJ)
  pages: string[];    // pages déjà récompensées
  opened: number;
};
export type Pull = { num: number; holo: boolean; isNew: boolean };

// v2 (album de 60 vignettes, numéros revus) : tout le monde repart d'un album vide
const KEY = 'oni-korp-album-v2';
export const PACK_SIZE = 5;
export const HOLO_RATE = 1 / 6;
// Pages qui rapportent un booster à la première visite
export const BONUS_PAGES: Record<string, string> = {
  club: 'Le club', agenda: 'Agenda', recrutement: 'Recrutement', partenaires: 'Partenaires', vestiaire: 'Vestiaire',
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function load(): Collection {
  const empty: Collection = { v: 2, owned: {}, credits: 0, daily: '', pages: [], opened: 0 };
  try {
    localStorage.removeItem('oni-korp-album'); // ancien album (v1), abandonné
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function save(c: Collection) {
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* stockage indisponible : la session continue sans mémoire */ }
}

// Récompenses à l'arrivée sur une page. Renvoie les raisons des boosters gagnés.
export function reward(page: string | null): string[] {
  const c = load();
  const gained: string[] = [];
  if (c.daily !== today()) {
    c.daily = today();
    c.credits += 1;
    gained.push('Booster du jour');
  }
  if (page && BONUS_PAGES[page] && !c.pages.includes(page)) {
    c.pages.push(page);
    c.credits += 1;
    gained.push(`Première visite : ${BONUS_PAGES[page]}`);
  }
  if (gained.length) save(c);
  return gained;
}

// Ouvre un booster parmi les vignettes `pool` (numéros) ; `weight` donne la rareté.
export function openPack(pool: number[], weight: (num: number) => number): Pull[] | null {
  const c = load();
  if (c.credits < 1) return null;
  const picked: number[] = [];
  const candidates = [...pool];
  while (picked.length < Math.min(PACK_SIZE, pool.length)) {
    const total = candidates.reduce((t, n) => t + weight(n), 0);
    let r = Math.random() * total;
    const i = candidates.findIndex((n) => (r -= weight(n)) < 0);
    picked.push(candidates.splice(i < 0 ? 0 : i, 1)[0]);
  }
  // Au moins une nouvelle vignette tant que l'album n'est pas complet
  const missing = pool.filter((n) => !c.owned[n] && !picked.includes(n));
  if (missing.length && picked.every((n) => c.owned[n])) {
    picked[Math.floor(Math.random() * picked.length)] = missing[Math.floor(Math.random() * missing.length)];
  }
  const pulls = picked.map((num) => {
    const holo = Math.random() < HOLO_RATE;
    const isNew = !c.owned[num];
    const o = c.owned[num] ?? { n: 0 };
    c.owned[num] = { n: o.n + 1, holo: o.holo || holo };
    return { num, holo, isNew };
  });
  c.credits -= 1;
  c.opened += 1;
  save(c);
  return pulls;
}

export const ownedCount = (c: Collection) => Object.keys(c.owned).length;
