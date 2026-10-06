// Petits utilitaires d'affichage de l'espace équipe : courbes, moyennes, formats.

/** Courbe (SVG) d'une série de valeurs. `invert` : plus petit = mieux (rang mondial osu!). */
export function spark(values: number[], { w = 120, h = 32, invert = false } = {}) {
  const v = values.filter((x) => Number.isFinite(x));
  if (v.length < 2) return '';
  const min = Math.min(...v), max = Math.max(...v), span = max - min || 1;
  const pts = v.map((x, i) => {
    const y = invert ? ((x - min) / span) * (h - 4) + 2 : h - 2 - ((x - min) / span) * (h - 4);
    return `${Math.round((i / (v.length - 1)) * w)},${Math.round(y * 10) / 10}`;
  });
  const up = invert ? v[v.length - 1] <= v[0] : v[v.length - 1] >= v[0];
  return `<svg class="spark ${up ? 'is-up' : 'is-down'}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts.join(' ')}" /></svg>`;
}

/** Moyenne des valeurs numériques (les cases vides ou absentes sont ignorées : une partie Oni Sync n'a pas toutes les mesures de ballchasing). */
export const avg = (xs: unknown[]) => {
  const ok = xs.filter((x) => x !== null && x !== undefined && x !== '' && Number.isFinite(Number(x))).map(Number);
  return ok.length ? ok.reduce((s, x) => s + x, 0) / ok.length : null;
};
export const r1 = (x: number | null, d = 1) => (x === null ? '—' : String(Math.round(x * 10 ** d) / 10 ** d).replace('.', ','));
export const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x)} %`);

let ddv: { v: string; at: number } | null = null;
/** Dernière version de Data Dragon (icônes des champions), gardée 6 h. */
export async function ddragon() {
  if (ddv && Date.now() - ddv.at < 6 * 3600_000) return ddv.v;
  const v = await fetch('https://ddragon.leagueoflegends.com/api/versions.json').then((r) => r.json()).then((x) => x[0]).catch(() => '16.19.1');
  ddv = { v, at: Date.now() }; return v;
}

/** Mini rendu Markdown sûr (titres, gras, italique, listes, liens) pour les docs du roster. */
export function md(src: string) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const inline = (s: string) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>')
    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" rel="noopener" target="_blank">$2</a>');
  const out: string[] = []; let list = false;
  for (const line of src.split(/\r?\n/)) {
    const li = line.match(/^\s*[-*]\s+(.*)/);
    if (li) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    if (list) { out.push('</ul>'); list = false; }
    const h = line.match(/^(#{1,3})\s+(.*)/);
    if (h) out.push(`<h${h[1].length + 2}>${inline(h[2])}</h${h[1].length + 2}>`);
    else if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('');
}

export const SHARED_CSS = `
  .spark { overflow: visible; vertical-align: middle; }
  .spark polyline { fill: none; stroke-width: 2.2; stroke-linejoin: round; stroke-linecap: round; }
  .spark.is-up polyline { stroke: #1f8f55; } .spark.is-down polyline { stroke: var(--lacquer); }
`;
