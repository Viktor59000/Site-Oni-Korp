import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Hébergement : Vercel (VERCEL=1 fourni par la plateforme). Les pages restent statiques ;
// seules les routes /api/* tournent à la demande (lecture de la base Turso partagée avec Oni Bot).
// Sans Vercel (local, ancien déploiement GitHub Pages), le site est 100 % statique et l'API est absente.
const onVercel = !!process.env.VERCEL;
// En local, ONI_API=1 active aussi les routes serveur (test de l'espace équipe avec npm run dev)
const withApi = onVercel || !!process.env.ONI_API;
const api = {
  name: 'oni-api',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (!withApi) return;
      const route = (pattern, entrypoint) => injectRoute({ pattern, entrypoint, prerender: false });
      route('/api/agenda', './src/server/agenda.ts');
      route('/api/feed', './src/server/feed.ts');
      route('/api/club', './src/server/club.ts');
      route('/api/contact', './src/server/contact.ts');
      route('/agenda.ics', './src/server/ics.ts');
      route('/api/equipe/agenda.ics', './src/server/equipe/ics.ts');
      route('/api/auth/login', './src/server/auth/login.ts');
      route('/api/auth/callback', './src/server/auth/callback.ts');
      route('/api/auth/logout', './src/server/auth/logout.ts');
      route('/api/equipe/presence', './src/server/equipe/presence.ts');
      route('/api/equipe/dispos', './src/server/equipe/dispos.ts');
      route('/equipe', './src/server/equipe.astro');
      route('/equipe/vue', './src/server/equipe/vue.astro');
      route('/equipe/joueurs', './src/server/equipe/joueurs.astro');
      route('/equipe/notes', './src/server/equipe/notes.astro');
      route('/equipe/lol', './src/server/equipe/lol.astro');
      route('/equipe/valo', './src/server/equipe/valo.astro');
      route('/api/equipe/outils', './src/server/equipe/outils.ts');
      route('/equipe/tactique', './src/server/equipe/tactique.astro');
      route('/equipe/objectifs', './src/server/equipe/objectifs.astro');
      route('/equipe/stats', './src/server/equipe/mesures.astro');
      route('/equipe/osu', './src/server/equipe/osu.astro');
      route('/equipe/setup', './src/server/equipe/setup.astro');
      route('/equipe/vod', './src/server/equipe/vod.astro');
      route('/equipe/docs', './src/server/equipe/docs.astro');
      route('/equipe/scouting', './src/server/equipe/scouting.astro');
      route('/api/equipe/tableau', './src/server/equipe/tableau-api.ts');
      route('/postuler', './src/server/recrutement/page.astro');
      route('/api/postuler', './src/server/recrutement/postuler.ts');
    },
  },
};

export default defineConfig({
  site: process.env.SITE_URL || (onVercel ? 'https://oni-korp.vercel.app' : 'https://viktor59000.github.io'),
  base: process.env.BASE_PATH ? `/${process.env.BASE_PATH}/` : '/',
  adapter: onVercel ? vercel() : undefined,
  integrations: [sitemap(), api],
  // CSS du site (~15 Ko) intégré dans chaque page : supprime la requête bloquante
  build: { inlineStylesheets: 'always' },
});
