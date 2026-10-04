import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Hébergement : Vercel (VERCEL=1 fourni par la plateforme). Les pages restent statiques ;
// seules les routes /api/* tournent à la demande (lecture de la base Turso partagée avec Oni Bot).
// Sans Vercel (local, ancien déploiement GitHub Pages), le site est 100 % statique et l'API est absente.
const onVercel = !!process.env.VERCEL;
const api = {
  name: 'oni-api',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (onVercel) injectRoute({ pattern: '/api/agenda', entrypoint: './src/server/agenda.ts', prerender: false });
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
