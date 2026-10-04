// Aperçu local de l'espace équipe sur les VRAIES données (base Turso de production), sans rien copier :
// lit l'accès à la base dans oni-bot/.env et lance le serveur de dev en se faisant passer pour ONI_DEV_USER.
// Attention : ce qu'on enregistre dans cet aperçu va dans la vraie base.
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const env = Object.fromEntries(readFileSync(new URL('../../oni-bot/.env', import.meta.url), 'utf8').split(/\r?\n/)
  .map((l) => l.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean).reverse().map((m) => [m[1], m[2].trim()])); // reverse : la 1re occurrence gagne, comme dotenv
const port = process.argv[2] ?? '4340';
spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'dev', '--port', port], {
  cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: 'inherit', shell: process.platform === 'win32',
  env: { ...process.env, ONI_API: '1', TURSO_DATABASE_URL: env.TURSO_DATABASE_URL, TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN, ONI_DEV_USER: process.env.ONI_DEV_USER ?? '664164860539699200', SESSION_SECRET: 'apercu-local' },
});
