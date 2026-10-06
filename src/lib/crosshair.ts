// Viseur Valorant : lecture du code de profil (« 0;P;c;1;h;0;0l;4;… ») et dessin sur un canvas, comme en jeu.
// Seul le viseur principal (P) est dessiné : couleur, contour, point central, lignes intérieures et extérieures.

const COLORS = ['#ffffff', '#00ff00', '#7fff00', '#dfff00', '#ffff00', '#00ffff', '#ff00ff', '#ff0000'];

export type Crosshair = {
  color: string; outline: boolean; outlineW: number; outlineA: number;
  dot: boolean; dotW: number; dotA: number;
  lines: { show: boolean; w: number; l: number; v: number; sep: boolean; o: number; a: number }[];
};

export function parseCrosshair(code: string): Crosshair | null {
  const parts = code.trim().split(';');
  if (parts[0] !== '0' || !parts.includes('P')) return null;
  // Paires clé/valeur de la section P (jusqu'à la section suivante : A, S…)
  const kv = new Map<string, string>();
  let i = parts.indexOf('P') + 1;
  while (i < parts.length - 1 && !['A', 'S', 'M'].includes(parts[i])) { kv.set(parts[i], parts[i + 1]); i += 2; }
  const n = (k: string, d: number) => (kv.has(k) && Number.isFinite(Number(kv.get(k))) ? Number(kv.get(k)) : d);
  const c = n('c', 0);
  const custom = kv.get('u');
  const color = c === 8 && custom && /^[0-9a-f]{6,8}$/i.test(custom) ? `#${custom.slice(0, 6)}` : COLORS[c] ?? COLORS[0];
  const line = (p: string, d: { show: number; w: number; l: number; o: number; a: number }) => ({
    show: n(`${p}b`, d.show) === 1, w: n(`${p}t`, d.w), l: n(`${p}l`, d.l), v: n(`${p}v`, n(`${p}l`, d.l)), sep: n(`${p}g`, 0) === 1, o: n(`${p}o`, d.o), a: n(`${p}a`, d.a),
  });
  return {
    color, outline: n('h', 1) === 1, outlineW: n('t', 1), outlineA: n('o', .5),
    dot: n('d', 0) === 1, dotW: n('z', 2), dotA: n('a', 1),
    lines: [line('0', { show: 1, w: 2, l: 6, o: 3, a: .8 }), line('1', { show: 1, w: 2, l: 2, o: 10, a: .35 })],
  };
}

/** Dessine le viseur au centre du canvas, à l'échelle `scale` (1 = pixels d'un écran 1080p). */
export function drawCrosshair(cv: HTMLCanvasElement, x: Crosshair, scale = 3) {
  const c = cv.getContext('2d')!; const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2;
  c.clearRect(0, 0, W, H);
  const rect = (rx: number, ry: number, rw: number, rh: number, a: number) => {
    if (x.outline) { c.globalAlpha = a * x.outlineA; c.fillStyle = '#000'; const t = x.outlineW * scale; c.fillRect(rx - t, ry - t, rw + 2 * t, rh + 2 * t); }
    c.globalAlpha = a; c.fillStyle = x.color; c.fillRect(rx, ry, rw, rh);
  };
  for (const l of x.lines) {
    if (!l.show || !l.w || (!l.l && !l.v)) continue;
    const t = l.w * scale, o = l.o * scale, lh = l.l * scale, lv = (l.sep ? l.v : l.l) * scale;
    rect(cx + o, cy - t / 2, lh, t, l.a); rect(cx - o - lh, cy - t / 2, lh, t, l.a);
    rect(cx - t / 2, cy + o, t, lv, l.a); rect(cx - t / 2, cy - o - lv, t, lv, l.a);
  }
  if (x.dot) { const d = x.dotW * scale; rect(cx - d / 2, cy - d / 2, d, d, x.dotA); }
  c.globalAlpha = 1;
}
