import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Remplacer par le domaine final avant la mise en ligne
export default defineConfig({
  site: 'https://onikorp.fr',
  integrations: [sitemap()],
});
