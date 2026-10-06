// Inside en local sur la base de démonstration (voir base-demo.mjs) : connecté en tant que « Démo » (coach).
//   npm run dev:demo [port]   → http://localhost:4330/equipe/
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
if (!existsSync(new URL('../.demo/oni.db', import.meta.url))) await import('./base-demo.mjs');
const port = process.argv[2] ?? '4330';
spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['astro', 'dev', '--port', port], {
  cwd: root, stdio: 'inherit', shell: process.platform === 'win32',
  env: { ...process.env, ONI_API: '1', TURSO_DATABASE_URL: 'file:.demo/oni.db', TURSO_AUTH_TOKEN: '', ONI_DEV_USER: '100000000000000001', SESSION_SECRET: 'demo-local-seulement' },
});
