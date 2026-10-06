// Base de démonstration pour travailler sur Inside sans accès à la vraie base : 4 rosters fictifs (LoL, osu!, RL, Valorant),
// 3 membres dont « Démo » (coach, donc encadrement), matchs, séances, stats, tableaux blancs, tâches de contenu…
//   node scripts/base-demo.mjs        → (re)crée .demo/oni.db à partir de scripts/base-demo.sql
//   npm run dev:demo                  → Inside sur http://localhost:4330, connecté en tant que « Démo »
// Rien ici ne touche la vraie base. Les modifications faites dans l'aperçu restent dans .demo/oni.db.
import fs from 'node:fs';
import { createClient } from '@libsql/client';

fs.mkdirSync('.demo', { recursive: true });
fs.rmSync('.demo/oni.db', { force: true });
const db = createClient({ url: 'file:.demo/oni.db' });
const sql = fs.readFileSync(new URL('./base-demo.sql', import.meta.url), 'utf8');
await db.executeMultiple(sql);
const n = (await db.execute("SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'table'")).rows[0].n;
console.log(`Base de démo prête : .demo/oni.db (${n} tables). Lance « npm run dev:demo ».`);
