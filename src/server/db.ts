// Accès à la base partagée avec Oni Bot (Turso). Variables posées par l'intégration Vercel (ONI_DB_…) ou à la main.
import { createClient, type Client, type InValue } from '@libsql/client';

let client: Client | null = null;
export function db(): Client | null {
  const url = process.env.ONI_DB_TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
  if (!url) return null;
  return (client ??= createClient({ url, authToken: process.env.ONI_DB_TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN }));
}

/** Lecture tolérante : liste vide si la base ou la table n'existe pas encore. */
export async function rows<T = Record<string, any>>(sql: string, ...args: InValue[]): Promise<T[]> {
  const c = db(); if (!c) return [];
  try { return (await c.execute({ sql, args })).rows.map((r) => ({ ...r }) as T); } catch { return []; }
}

export async function exec(sql: string, ...args: InValue[]): Promise<void> {
  const c = db(); if (!c) throw new Error('Base indisponible');
  await c.execute({ sql, args });
}

/** Lundi de la semaine en cours ou suivante, heure de Paris (AAAA-MM-JJ) : même calcul que le bot. */
export function weekKey(next: boolean): string {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t: string) => p.find((x) => x.type === t)!.value;
  const d = new Date(Date.UTC(+get('year'), +get('month') - 1, +get('day')));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + (next ? 7 : 0));
  return d.toISOString().slice(0, 10);
}
