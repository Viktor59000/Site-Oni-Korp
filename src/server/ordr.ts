// Replays o!rdr lisibles dans Discord : le robot de Discord ne peut pas joindre issou.best (aperçus vides).
// Oni Bot répond donc à un lien o!rdr par https://<site>/replay/<code> : cette page donne à Discord le titre, la miniature
// et la vidéo, servies par le site qui relaie les fichiers d'issou.best (requêtes partielles « Range » transmises telles quelles).
//   GET /replay/<code>             → page d'aperçu (redirige les humains vers o!rdr)
//   GET /api/ordr/video/<code>     → vidéo mp4 relayée
//   GET /api/ordr/thumb/<code>     → miniature relayée
import type { APIRoute } from 'astro';

const CODE = /^[A-Za-z0-9]{4,12}$/;
const cache = new Map<string, { at: number; r: any; video: string | null }>();
const esc = (s: string) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

async function render(code: string) {
  const hit = cache.get(code);
  if (hit && Date.now() - hit.at < 3600_000) return hit;
  const r = (await fetch(`https://apis.issou.best/ordr/renders?link=${code}`).then((x) => x.json()).catch(() => null) as any)?.renders?.[0] ?? null;
  const html = r ? await fetch(`https://link.issou.best/${code}`).then((x) => x.text()).catch(() => '') : '';
  const video = html.match(/og:video" content="(https:\/\/[a-z0-9.-]*issou\.best\/[^"]+\.mp4)"/)?.[1] ?? null;
  const out = { at: Date.now(), r, video };
  if (r) cache.set(code, out);
  return out;
}

export const GET: APIRoute = async ({ params, request, url }) => {
  const code = String(params.code ?? '');
  if (!CODE.test(code)) return new Response('Lien invalide.', { status: 400 });
  const got = await render(code);
  const r = got.r;
  // Adresse du mp4 donnée par Oni Bot (?v=cdn-video-1/Fichier) : la page link.issou.best ne répond pas toujours au site
  const v = url.searchParams.get('v') ?? '';
  const m = v.match(/^(cdn-video-\d{1,2})\/([A-Za-z0-9_-]{8,64})$/);
  const video = got.video ?? (m ? `https://${m[1]}.issou.best/ordr/${m[2]}.mp4` : null);
  const qv = m ? `?v=${encodeURIComponent(v)}` : '';
  if (!r || r.removed) return new Response('Replay introuvable.', { status: 404 });

  if (params.kind === 'video' || params.kind === 'thumb') {
    const src = params.kind === 'video' ? video : `https://dl.issou.best/ordr/thumbnails/render${Number(r.renderID)}.webp`;
    if (!src) return new Response('Vidéo introuvable.', { status: 404 });
    const range = request.headers.get('range');
    const up = await fetch(src, { headers: range ? { Range: range } : {} });
    const h = new Headers({ 'Cache-Control': 'public, max-age=86400', 'Accept-Ranges': 'bytes' });
    for (const k of ['content-type', 'content-length', 'content-range']) { const v = up.headers.get(k); if (v) h.set(k, v); }
    return new Response(up.body, { status: up.status, headers: h });
  }

  // Page d'aperçu : balises lues par Discord, redirection pour les humains
  const base = url.origin;
  const stars = String(r.title ?? '').match(/\[([\d.]+)/)?.[1];
  const acc = String(r.description ?? '').match(/Accuracy:\s*([\d.]+)%/)?.[1];
  const title = `${r.mapTitle ?? 'Replay'} [${r.replayDifficulty ?? '?'}]`;
  const desc = [`Joueur : ${r.replayUsername}`, stars && `${stars} ★`, acc && `${acc} %`, r.replayMods && r.replayMods !== 'None' ? `Mods : ${r.replayMods}` : null].filter(Boolean).join(' · ');
  const [w, hgt] = String(r.resolution ?? '1920x1080').split('x').map(Number);
  const page = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta property="og:site_name" content="Oni Korp · replay o!rdr">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="video.other">
<meta property="og:url" content="${base}/replay/${code}${qv}">
<meta property="og:image" content="${base}/api/ordr/thumb/${code}">
<meta property="og:image:width" content="1280"><meta property="og:image:height" content="720">
${video ? `<meta property="og:video" content="${base}/api/ordr/video/${code}${qv}">
<meta property="og:video:secure_url" content="${base}/api/ordr/video/${code}${qv}">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="${w || 1920}"><meta property="og:video:height" content="${hgt || 1080}">` : ''}
<meta name="twitter:card" content="player">
<meta name="theme-color" content="#ff66aa">
<meta http-equiv="refresh" content="0; url=https://ordr.issou.best/watch/${code}">
</head><body><a href="https://ordr.issou.best/watch/${code}">Voir le replay sur o!rdr</a></body></html>`;
  return new Response(page, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
