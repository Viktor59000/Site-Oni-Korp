import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH sont fournis par le script de déploiement GitHub Pages.
// En local (npm run dev), le site tourne à la racine.
export default defineConfig({
  site: process.env.SITE_URL || 'https://viktor59000.github.io',
  base: process.env.BASE_PATH ? `/${process.env.BASE_PATH}/` : '/',
  integrations: [sitemap()],
  // CSS du site (~15 Ko) intégré dans chaque page : supprime la requête bloquante
  build: { inlineStylesheets: 'always' },
});
