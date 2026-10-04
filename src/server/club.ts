// GET /api/club : chiffres du serveur Discord (relevés par Oni Bot) et bilan des matchs publics de la saison.
import type { APIRoute } from 'astro';
import { rows } from './db';

/** Saison esport : de septembre à août. */
const seasonStart = () => { const d = new Date(); const y = d.getUTCMonth() >= 8 ? d.getUTCFullYear() : d.getUTCFullYear() - 1; return Date.UTC(y, 8, 1); };

export const GET: APIRoute = async () => {
  const [st] = await rows<{ value: string }>(`SELECT value FROM meta WHERE key = 'club:stats'`);
  const stats = st ? JSON.parse(st.value) : null;
  const res = await rows<{ us: number; them: number }>(`SELECT score_us AS us, score_them AS them FROM matches
    WHERE cancelled = 0 AND score_us IS NOT NULL AND COALESCE(kind, 'officiel') != 'scrim' AND at >= ?`, seasonStart());
  const saison = {
    debut: new Date(seasonStart()).toISOString().slice(0, 10),
    victoires: res.filter((r) => Number(r.us) > Number(r.them)).length,
    defaites: res.filter((r) => Number(r.us) < Number(r.them)).length,
    nuls: res.filter((r) => Number(r.us) === Number(r.them)).length,
  };
  // Chiffres trop vieux (bot arrêté depuis plus d'un jour) : on ne les affiche pas
  const fresh = stats && Date.now() - stats.at < 86400_000;
  return new Response(JSON.stringify({ discord: fresh ? { membres: stats.membres, enLigne: stats.enLigne } : null, saison }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
};
