// Sondage des membres (SWOT-ROLES.md, chantier 9) : l'approche quantitative de l'audit (cours de communication digitale).
// Une campagne par saison (clé ci-dessous) ; une réponse par membre et par campagne, modifiable.
// Brouillon de questions à valider par la direction avant lancement.
export const CAMPAIGN = '2026-automne';

export type Q =
  | { id: string; type: 'multi' | 'single'; label: string; options: string[]; required?: boolean }
  | { id: string; type: 'scale'; label: string; min: number; max: number; low: string; high: string; required?: boolean }
  | { id: string; type: 'text'; label: string; hint?: string };

export const QUESTIONS: Q[] = [
  { id: 'pourquoi', type: 'multi', label: 'Tu viens surtout sur le serveur pour…', options: ['Les inhouses', 'Jouer en roster, la compétition', 'Les tournois communautaires', 'Discuter, les vocaux', 'La radio, l\'ambiance', 'Les lives et les casts', 'Autre chose'], required: true },
  { id: 'jeux', type: 'multi', label: 'Tes jeux', options: ['Rocket League', 'League of Legends', 'Valorant', 'osu!', 'Un autre jeu'], required: true },
  { id: 'satisfaction', type: 'scale', label: 'Dans l\'ensemble, tu te sens bien sur le serveur ?', min: 1, max: 5, low: 'pas du tout', high: 'complètement', required: true },
  { id: 'recommande', type: 'scale', label: 'Tu recommanderais Oni Korp à un ami qui joue ?', min: 0, max: 10, low: 'jamais', high: 'sans hésiter', required: true },
  { id: 'roster', type: 'single', label: 'Rejoindre un roster, ça t\'intéresse ?', options: ['Oui, maintenant', 'Peut-être plus tard', 'Non, je viens pour la communauté'], required: true },
  { id: 'aider', type: 'multi', label: 'Tu aimerais donner un coup de main ? (aucun engagement)', options: ['Caster', 'Graphisme', 'Montage vidéo', 'Réseaux sociaux', 'Modération', 'Organiser des soirées ou tournois', 'Accueillir les nouveaux', 'Coacher', 'Non merci'] },
  { id: 'connu', type: 'single', label: 'Comment tu as connu le club ?', options: ['Un ami', 'Disboard ou un annuaire', 'Les réseaux (X, TikTok, Instagram, YouTube)', 'Twitch', 'Un match ou un tournoi', 'Un site de recrutement', 'Autre'] },
  { id: 'plus', type: 'text', label: 'Qu\'est-ce qui te ferait venir plus souvent ?', hint: 'Une activité, un horaire, un jeu…' },
  { id: 'manque', type: 'text', label: 'Ce qui manque, ou ce qui ne marche pas', hint: 'Tout est lu, rien n\'est publié avec ton nom.' },
];
