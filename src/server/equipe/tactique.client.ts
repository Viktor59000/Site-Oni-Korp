// Tableau blanc : carte, éléments, crayon, étapes, présentation, suivi en direct (côté navigateur).
// Sorti de tactique.astro (refacto du 06/10/2026) : chargé par <script src="./tactique.client.ts">.
// Minicartes officielles de la Faille (fichiers du jeu via CommunityDragon) : une par âme de drake, trois formes de fosse du Nashor
const LOL_TERRAINS: [string, string][] = [['base', 'classique'], ['ocean', 'âme Océan'], ['cloud', 'âme Nuage'], ['infernal', 'âme Infernale'], ['mountain', 'âme Montagne'], ['hextech', 'âme Hextech']];
const isRift = (bg: string) => bg === 'Faille' || bg.startsWith('Faille:');
const riftParts = (bg: string) => { const [, t = 'base', n = '1'] = bg.split(':'); return { t: LOL_TERRAINS.some(([k]) => k === t) ? t : 'base', n: ['1', '2', '3'].includes(n) ? n : '1' }; };
// L'âme Infernale n'existe qu'en une forme de fosse
// Carte vectorielle de RiftKit (Coach Kirei, avec son accord) : murs selon l'âme (Montagne change les murs), fosse du Nashor en 3 formes
const riftUrl = (bg: string) => { const { t, n } = riftParts(bg); return `/img/lol/vmap-${t === 'mountain' ? 'mountain' : 'normal'}-${({ 1: 'hunting', 2: 'seeing', 3: 'territorial' } as Record<string, string>)[t === 'infernal' ? '1' : n]}.svg`; };
// Rendu réaliste (vue du dessus du jeu) ; les murs pour la vision restent lus sur la minicarte vectorielle
const RIFT_IMG = '/img/lol/faille-image.webp';
// Buissons : tracés vectoriels de RiftKit (map.riftkit.net, Coach Kirei), repris avec son accord. Ils changent avec les âmes Océan et Montagne.
const bushUrl = (bg: string) => { const t = riftParts(bg).t; return `/img/lol/bush-${t === 'ocean' ? 'ocean' : t === 'mountain' ? 'mountain' : 'normal'}.svg`; };
// Tours et inhibiteurs : positions relevées dans les données de partie de Riot (unités du jeu, carte de 14 870)
const STRUCT: [string, number, number, number, 'tour' | 'inhib'][] = [
  ['b-top-1', 100, 981, 10441, 'tour'], ['b-top-2', 100, 1512, 6699, 'tour'], ['b-top-3', 100, 1169, 4287, 'tour'], ['b-top-i', 100, 1172, 3583, 'inhib'],
  ['b-mid-1', 100, 5846, 6396, 'tour'], ['b-mid-2', 100, 5048, 4812, 'tour'], ['b-mid-3', 100, 3651, 3696, 'tour'], ['b-mid-i', 100, 3210, 3217, 'inhib'],
  ['b-bot-1', 100, 10504, 1029, 'tour'], ['b-bot-2', 100, 6919, 1483, 'tour'], ['b-bot-3', 100, 4281, 1253, 'tour'], ['b-bot-i', 100, 3468, 1230, 'inhib'],
  ['b-nex-1', 100, 1748, 2270, 'tour'], ['b-nex-2', 100, 2177, 1807, 'tour'],
  ['r-top-1', 200, 4318, 13875, 'tour'], ['r-top-2', 200, 7943, 13411, 'tour'], ['r-top-3', 200, 10481, 13650, 'tour'], ['r-top-i', 200, 11261, 13676, 'inhib'],
  ['r-mid-1', 200, 8955, 8510, 'tour'], ['r-mid-2', 200, 9767, 10113, 'tour'], ['r-mid-3', 200, 11134, 11207, 'tour'], ['r-mid-i', 200, 11593, 11669, 'inhib'],
  ['r-bot-1', 200, 13866, 4505, 'tour'], ['r-bot-2', 200, 13327, 8226, 'tour'], ['r-bot-3', 200, 13624, 10572, 'tour'], ['r-bot-i', 200, 13599, 11319, 'inhib'],
  ['r-nex-1', 200, 12611, 13084, 'tour'], ['r-nex-2', 200, 13052, 12612, 'tour'],
];
const MAPW = 14870;
// Vision réelle d'une balise : 240 rayons depuis la balise, arrêtés au premier mur (pixel noir de la minicarte officielle).
// Le masque des murs est lu une fois par carte ; tant qu'il n'est pas prêt, on affiche le simple cercle de portée.
const wallMasks = new Map<string, { w: number; h: number; d: Uint8ClampedArray } | null>();
function wallMask(url: string, onReady: () => void) {
  if (wallMasks.has(url)) return wallMasks.get(url);
  wallMasks.set(url, null);
  const im = new Image();
  im.onload = () => {
    const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight;
    const cx = cv.getContext('2d', { willReadFrequently: true })!; cx.drawImage(im, 0, 0);
    wallMasks.set(url, { w: cv.width, h: cv.height, d: cx.getImageData(0, 0, cv.width, cv.height).data }); onReady();
  };
  im.src = url;
  return null;
}
const bushMasks = new Map<string, Uint8Array | null>();
function bushMask(url: string, w: number, h: number, onReady: () => void) {
  if (bushMasks.has(url)) return bushMasks.get(url);
  bushMasks.set(url, null);
  const im = new Image();
  im.onload = () => {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', { willReadFrequently: true })!; cx.drawImage(im, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data, m = new Uint8Array(w * h);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 60 ? 1 : 0;
    bushMasks.set(url, m); onReady();
  };
  im.src = url;
  return null;
}
// Une balise voit à travers le buisson où elle est posée, pas à travers les autres
function visionPoly(m: { w: number; h: number; d: Uint8ClampedArray; bush?: Uint8Array | null }, x: number, y: number, r: number): [number, number][] {
  const pts: [number, number][] = [], N = 240, step = .5 / m.w;
  const wall = (u: number, v: number) => { const i = (Math.floor(v * m.h) * m.w + Math.floor(u * m.w)) * 4; return m.d[i] + m.d[i + 1] + m.d[i + 2] < 75; };
  const bush = (u: number, v: number) => !!m.bush && m.bush[Math.floor(v * m.h) * m.w + Math.floor(u * m.w)] === 1;
  const startBush = bush(x, y);
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
    // Une balise posée contre un mur (bord de buisson, mur fin) voit d'abord à travers le mur où elle est posée
    let d = 0, started = !wall(x, y), inOwn = startBush;
    while (d < r) {
      const u = x + dx * (d + step), v = y + dy * (d + step); if (u < 0 || v < 0 || u >= 1 || v >= 1) break;
      const w = wall(u, v); if (w && started) break; if (!w) started = true;
      const b = bush(u, v); if (!b) inOwn = false; else if (!inOwn) { d += step; break; }
      d += step;
    }
    pts.push([x + dx * d, y + dy * d]);
  }
  return pts;
}
// Portée de vision des balises sur la Faille : 900 unités sur une carte de 14 870 (en fraction de la largeur, rayon)
const WARD_RANGE: Record<string, number> = { ward: 900 / 14870, controle: 900 / 14870 };
const WARD_COLOR: Record<string, string> = { ward: '#ffd23f', controle: '#ff4fa3' };
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
let valoMaps: { name: string; icon: string }[] = [];
// Garde le fond actuel dans la liste même s'il vient d'un autre jeu (ancien tableau)
const opts_keep = (bg: string): string[][] => (['blanc', 'grille', 'url'].includes(bg) || /^https?:/.test(bg) || isRift(bg) ? [] : [[bg, bg === 'Terrain' ? 'Terrain Rocket League' : bg === 'Faille' ? "Faille de l'invocateur" : `Valorant · ${bg}`]]);
const loadValo = () => fetch('https://valorant-api.com/v1/maps?language=fr-FR').then((r) => r.json()).then((d) => {
  valoMaps = d.data.filter((m: any) => m.displayIcon && m.tacticalDescription).map((m: any) => ({ name: m.displayName, icon: m.displayIcon })).sort((a: any, b: any) => a.name.localeCompare(b.name, 'fr'));
}).catch(() => {});
const RL_PITCH = (() => {
  const pads = [[.08, .5], [.92, .5], [.08, .1], [.92, .1], [.08, .9], [.92, .9]].map(([x, y]) => `<circle cx="${x * 600}" cy="${y * 1000}" r="16" fill="#ffb020" opacity=".85"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1000"><rect width="600" height="1000" fill="#1d5a2f"/><rect x="20" y="40" width="560" height="920" rx="70" fill="#247038" stroke="#fff" stroke-width="5"/><line x1="20" y1="500" x2="580" y2="500" stroke="#fff" stroke-width="4"/><circle cx="300" cy="500" r="90" fill="none" stroke="#fff" stroke-width="4"/><rect x="210" y="8" width="180" height="34" fill="#ff7a1a" stroke="#fff" stroke-width="4"/><rect x="210" y="958" width="180" height="34" fill="#2f6bff" stroke="#fff" stroke-width="4"/><rect x="150" y="40" width="300" height="140" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/><rect x="150" y="820" width="300" height="140" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>${pads}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
})();

// ---------- Création ----------
const form = document.querySelector<HTMLFormElement>('[data-new]');
if (form) {
  const bg = form.querySelector<HTMLSelectElement>('[data-bg]')!, roster = form.querySelector<HTMLSelectElement>('[data-roster]')!;
  const sync = () => { form.querySelector<HTMLElement>('[data-url]')!.hidden = bg.value !== 'url'; };
  const pick = () => {
    const g = roster.selectedOptions[0]?.dataset.g ?? '';
    bg.value = g === 'rl' ? 'Terrain' : g === 'lol' ? 'Faille' : g === 'valo' && valoMaps[0] ? valoMaps[0].name : 'blanc';
    form.querySelector<HTMLInputElement>('[data-game]')!.value = g;
    // Seuls les fonds du jeu du roster (et les fonds neutres) sont proposés
    form.querySelectorAll<HTMLOptGroupElement>('optgroup[data-for]').forEach((o) => { const off = o.dataset.for !== g; o.hidden = off; o.disabled = off; });
    sync();
  };
  bg.addEventListener('change', sync); roster.addEventListener('change', pick);
  loadValo().then(() => { form.querySelector('[data-valo]')!.innerHTML = valoMaps.map((m) => `<option>${esc(m.name)}</option>`).join(''); pick(); });
  pick();
}

// ---------- Tableau ----------
const root = document.querySelector<HTMLElement>('[data-board]');
if (root) {
  type Item = { id: string; type: 'tok' | 'ping' | 'note' | 'text' | 'arrow' | 'line' | 'rect' | 'circle' | 'zone'; x: number; y: number; x2?: number; y2?: number; color?: string; w?: number; label?: string; ref?: string; kind?: string };
  type Stroke = { id: string; color: string; w: number; pts: [number, number][] };
  type Frame = { name: string; items: Item[]; strokes: Stroke[]; down?: string[] };
  type State = { bg: string; notes: string; frames: Frame[]; towers?: boolean; look?: string; bush?: boolean };
  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const id = Number(root.dataset.board), game = root.dataset.game ?? '';
  let state: State = { bg: root.dataset.map ?? 'blanc', notes: '', frames: [{ name: 'Étape 1', items: [], strokes: [] }] };
  let fi = 0, at = 0, tool = 'select', color = '#ff4655', width = 6, dirty = false, saveTimer = 0, editingNotes = false, pollDelay = 2000, pollTimer = 0;
  let pending: Partial<Item> | null = null, sel: string | null = null;
  let drag: { id: string; dx: number; dy: number; dx2?: number; dy2?: number } | null = null;
  let drawing: Stroke | null = null, shape: Item | null = null;
  const undo: string[] = [], redo: string[] = [];
  const icons = new Map<string, string>();
  const uid = () => Math.random().toString(36).slice(2, 9);
  const frame = () => state.frames[Math.min(fi, state.frames.length - 1)];
  const stage = $('[data-stage]');

  // Ancien format (tokens / strokes) → étapes
  const upgrade = (s: any): State => s?.frames
    ? { bg: s.bg ?? state.bg, notes: s.notes ?? '', towers: s.towers !== false, look: s.look ?? 'vec', bush: s.bush !== false, frames: s.frames.length ? s.frames : [{ name: 'Étape 1', items: [], strokes: [] }] }
    : { bg: s?.bg ?? state.bg, notes: '', frames: [{ name: 'Étape 1', items: (s?.tokens ?? []).map((t: any) => ({ id: t.id, type: 'tok', kind: t.kind, ref: t.ref, label: t.label, x: t.x, y: t.y })), strokes: (s?.strokes ?? []).map((k: any) => ({ ...k, w: 6 })) }] };

  try { const s0 = JSON.parse(root.dataset.state || '{}'); if (s0 && (s0.frames || s0.tokens)) state = upgrade(s0); at = Number(root.dataset.at) || 0; } catch {}
  const snapshot = () => { undo.push(JSON.stringify(state)); if (undo.length > 50) undo.shift(); redo.length = 0; };
  function changed() { dirty = true; render(); clearTimeout(saveTimer); saveTimer = window.setTimeout(save, 700); wake(); }
  async function save() {
    const r = await fetch('/api/equipe/tableau', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, state }) }).then((x) => x.json()).catch(() => null);
    if (r?.at) { at = r.at; dirty = false; }
  }
  // Suivi en direct économe : toutes les 2 s quand ça bouge, puis de plus en plus espacé quand rien ne change
  // (jusqu'à 20 s), rien quand l'onglet est caché. Chaque appel compte dans les quotas Vercel et Turso (06/10).
  function schedule() { clearTimeout(pollTimer); pollTimer = window.setTimeout(async () => { await poll(); schedule(); }, pollDelay); }
  function wake() { pollDelay = 2000; schedule(); }
  async function poll() {
    if (document.hidden) return;
    if (drag || drawing || shape || dirty || editingNotes) { pollDelay = 2000; return; }
    const r = await fetch(`/api/equipe/tableau?id=${id}&depuis=${at}`).then((x) => x.json()).catch(() => null);
    $('[data-live]').classList.toggle('is-off', !r);
    if (!r?.changed) pollDelay = Math.min(20000, Math.round(pollDelay * 1.5));
    if (r?.changed && !drag && !drawing && !shape && !dirty) {
      state = upgrade(r.state); at = r.at; if (fi >= state.frames.length) fi = 0; render();
      pollDelay = 2000;
      if (r.by !== root!.dataset.me && r.byName) { $('[data-live] em').textContent = `${r.byName} modifie…`; setTimeout(() => ($('[data-live] em').textContent = 'En direct'), 2500); }
    }
  }

  // ---------- Fond ----------
  function background() {
    const bg = state.bg, el = $('[data-bg]');
    stage.style.aspectRatio = bg === 'Terrain' ? '3 / 5' : '1 / 1';
    stage.style.setProperty('--ratio', bg === 'Terrain' ? '.6' : '1');
    el.className = 'wb-bg'; el.style.backgroundImage = '';
    if (bg === 'blanc') el.classList.add('is-blank');
    else if (bg === 'grille') el.classList.add('is-grid');
    else if (bg === 'Terrain') el.style.backgroundImage = `url("${RL_PITCH}")`;
    else if (isRift(bg)) el.style.backgroundImage = `url("${state.look === 'img' ? RIFT_IMG : riftUrl(bg)}")`;
    else if (/^https?:\/\//.test(bg)) el.style.backgroundImage = `url("${bg.replace(/["()\\]/g, '')}")`;
    else { const m = valoMaps.find((x) => x.name === bg); if (m) el.style.backgroundImage = `url("${m.icon}")`; }
    const s = $<HTMLSelectElement>('[data-bg-select]');
    // Fonds proposés : neutres + ceux du jeu du tableau (un tableau osu! ne propose pas la Faille)
    const bg_game = stage.dataset.game ?? '';
    const opts: string[][] = [['blanc', 'Tableau blanc'], ['grille', 'Quadrillage'],
      ...(!bg_game || bg_game === 'rl' ? [['Terrain', 'Terrain Rocket League']] : []),
      ...(!bg_game || bg_game === 'lol' ? LOL_TERRAINS.map(([k, l]) => [k === 'base' ? 'Faille' : `Faille:${k}`, `Faille · ${l}`]) : []),
      ...(!bg_game || bg_game === 'valo' ? valoMaps.map((m) => [m.name, `Valorant · ${m.name}`]) : []),
      ...(opts_keep(bg)), ['url', 'Image (lien)…']];
    if (/^https?:\/\//.test(bg)) opts.unshift([bg, 'Image actuelle']);
    const baseVal = isRift(bg) ? (riftParts(bg).t === 'base' ? 'Faille' : `Faille:${riftParts(bg).t}`) : bg;
    $('[data-look-wrap]').hidden = !isRift(bg);
    $('[data-bush-wrap]').hidden = !isRift(bg); $<HTMLInputElement>('[data-bush-show]').checked = state.bush !== false;
    const bushImg = $<HTMLImageElement>('[data-bush]'); bushImg.hidden = !isRift(bg) || state.bush === false || state.look === 'img';
    if (isRift(bg) && bushImg.getAttribute('src') !== bushUrl(bg)) bushImg.src = bushUrl(bg); $<HTMLInputElement>('[data-look]').checked = state.look === 'img';
    $('[data-baron-wrap]').hidden = !isRift(bg) || riftParts(bg).t === 'infernal' || state.look === 'img';
    $<HTMLSelectElement>('[data-baron]').value = isRift(bg) ? riftParts(bg).n : '1';
    if (document.activeElement !== s) s.innerHTML = opts.filter(([v], i) => opts.findIndex(([w]) => w === v) === i).map(([v, l]) => `<option value="${esc(v)}" ${v === baseVal ? 'selected' : ''}>${esc(l)}</option>`).join('');
  }

  // ---------- Rendu ----------
  const P = (v: number) => v * 1000;
  const shapeSvg = (it: Item, extra = '') => {
    const c = esc(it.color ?? '#ff4655'), w = Number(it.w) || 6, id = esc(it.id), cls = `wb-shape${sel === it.id ? ' is-sel' : ''}`;
    if (it.type === 'arrow' || it.type === 'line') return `<line data-id="${id}" class="${cls}" x1="${P(it.x)}" y1="${P(it.y)}" x2="${P(it.x2!)}" y2="${P(it.y2!)}" stroke="${c}" stroke-width="${w}" ${it.type === 'arrow' ? `marker-end="url(#ah${c.slice(1)})"` : ''} ${extra}/>`;
    const x = Math.min(it.x, it.x2!), y = Math.min(it.y, it.y2!), wd = Math.abs(it.x2! - it.x), ht = Math.abs(it.y2! - it.y);
    if (it.type === 'rect') return `<rect data-id="${id}" class="${cls}" x="${P(x)}" y="${P(y)}" width="${P(wd)}" height="${P(ht)}" stroke="${c}" stroke-width="${w}" fill="none" ${extra}/>`;
    return `<ellipse data-id="${id}" class="${cls}" cx="${P(x + wd / 2)}" cy="${P(y + ht / 2)}" rx="${P(wd / 2)}" ry="${P(ht / 2)}" stroke="${c}" stroke-width="${it.type === 'zone' ? 2 : w}" fill="${it.type === 'zone' ? c : 'none'}" fill-opacity="${it.type === 'zone' ? .35 : 0}" ${extra}/>`;
  };
  function render() {
    background();
    const f = frame();
    $('[data-frames]').innerHTML = state.frames.map((fr, i) => `<button type="button" data-frame="${i}" aria-pressed="${i === fi}">${esc(fr.name)}</button>`).join('')
      + `<button type="button" data-frame-add title="Nouvelle étape (copie de l'étape actuelle)">+ Étape</button>`
      + `<button type="button" data-frame-rename>Renommer</button>`
      + (state.frames.length > 1 ? `<button type="button" data-frame-del>Supprimer l'étape</button>` : '');
    const wm = isRift(state.bg) ? wallMask(riftUrl(state.bg), render) : null;
    const mask = wm ? { ...wm, bush: state.bush === false ? null : bushMask(bushUrl(state.bg), wm.w, wm.h, render) } : null;
    const visionSvg = mask ? f.items.filter((it) => it.type === 'ping' && WARD_RANGE[it.ref ?? '']).map((it) =>
      `<polygon class="wb-vision is-${esc(it.ref)}" points="${visionPoly(mask, it.x, it.y, WARD_RANGE[it.ref ?? '']).map(([a, b]) => `${P(a)},${P(b)}`).join(' ')}" />`).join('') : '';
    $('[data-layer]').innerHTML = visionSvg + f.strokes.map((s) => `<polyline data-stroke="${esc(s.id)}" points="${s.pts.map(([x, y]) => `${P(x)},${P(y)}`).join(' ')}" stroke="${esc(s.color)}" stroke-width="${Number(s.w) || 6}" />`).join('')
      + f.items.filter((it) => ['arrow', 'line', 'rect', 'circle', 'zone'].includes(it.type)).map((it) => shapeSvg(it)).join('')
      + (drawing ? `<polyline points="${drawing.pts.map(([x, y]) => `${P(x)},${P(y)}`).join(' ')}" stroke="${esc(drawing.color)}" stroke-width="${Number(drawing.w) || 6}" />` : '')
      + (shape ? shapeSvg(shape, 'opacity=".7"') : '');
    const towersOn = isRift(state.bg) && state.towers !== false;
    $('[data-towers-panel]').hidden = !isRift(state.bg);
    $<HTMLInputElement>('[data-towers-show]').checked = state.towers !== false;
    const towersHtml = towersOn ? STRUCT.map(([k, team, x, y, kind]) => `<button type="button" class="wb-struct is-${kind} is-t${team}${(f.down ?? []).includes(k) ? ' is-down' : ''}" data-struct="${k}" style="left:${x / MAPW * 100}%;top:${(1 - y / MAPW) * 100}%" aria-label="${kind === 'inhib' ? 'Inhibiteur' : 'Tour'} ${team === 100 ? 'bleu' : 'rouge'}${(f.down ?? []).includes(k) ? ' (détruit)' : ''}"></button>`).join('') : '';
    $('[data-items]').innerHTML = towersHtml + f.items.filter((it) => ['tok', 'ping', 'note', 'text'].includes(it.type)).map((it) => {
      const s = `left:${it.x * 100}%;top:${it.y * 100}%`, isSel = sel === it.id ? ' is-sel' : '';
      if (it.type === 'note') return `<div class="wb-note${isSel}" data-id="${esc(it.id)}" style="${s};--c:${esc(it.color)}">${esc(it.label)}</div>`;
      if (it.type === 'text') return `<div class="wb-text${isSel}" data-id="${esc(it.id)}" style="${s};color:${esc(it.color)}">${esc(it.label)}</div>`;
      if (it.type === 'ping') return (WARD_RANGE[it.ref ?? ''] && isRift(state.bg) && !mask ? `<div class="wb-range is-${esc(it.ref)}" style="${s};width:${WARD_RANGE[it.ref ?? ''] * 200}%" aria-hidden="true"></div>` : '') + `<div class="wb-ping is-${esc(it.ref)}${isSel}" data-id="${esc(it.id)}" style="${s}">${esc(it.label)}</div>`;
      return `<div class="wb-tok is-${esc(it.kind)}${isSel}" data-id="${esc(it.id)}" style="${s}">${it.kind === 'pic' ? `<img src="${esc(icons.get(it.ref ?? '') ?? '')}" alt="${esc(it.ref)}" title="${esc(it.ref)}" draggable="false" />` : esc(it.label)}</div>`;
    }).join('');
    const n = $<HTMLTextAreaElement>('[data-notes]');
    if (document.activeElement !== n) n.value = state.notes ?? '';
  }

  const pos = (e: PointerEvent | MouseEvent): [number, number] => { const r = stage.getBoundingClientRect(); return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))]; };
  // ---------- Zoom ----------
  const viewport = $('[data-viewport]');
  let zoom = 1, baseW = 0;
  const setZoom = (z: number, cx?: number, cy?: number) => {
    const old = zoom; zoom = Math.min(4, Math.max(1, Math.round(z * 4) / 4));
    const vr = viewport.getBoundingClientRect(); const px = (cx ?? vr.left + vr.width / 2) - vr.left, py = (cy ?? vr.top + vr.height / 2) - vr.top;
    const fx = (viewport.scrollLeft + px) / old, fy = (viewport.scrollTop + py) / old;
    // Largeur de base mesurée sans zoom, puis multipliée
    if (old === 1) baseW = stage.getBoundingClientRect().width;
    stage.style.width = zoom > 1 ? `${baseW * zoom}px` : ''; viewport.classList.toggle('is-zoomed', zoom > 1);
    $('[data-zoom-level]').textContent = `${Math.round(zoom * 100)} %`;
    viewport.scrollLeft = fx * zoom - px; viewport.scrollTop = fy * zoom - py;
  };
  root.querySelectorAll<HTMLElement>('[data-zoom]').forEach((b) => b.addEventListener('click', () => setZoom(b.dataset.zoom === 'in' ? zoom + .5 : b.dataset.zoom === 'out' ? zoom - .5 : 1)));
  viewport.addEventListener('wheel', (e) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.25 : .8), e.clientX, e.clientY); }, { passive: false });
  // Clic du milieu : déplacer la vue
  let pan: { x: number; y: number; l: number; t: number } | null = null;
  viewport.addEventListener('pointerdown', (e) => { if (e.button !== 1) return; e.preventDefault(); e.stopPropagation(); pan = { x: e.clientX, y: e.clientY, l: viewport.scrollLeft, t: viewport.scrollTop }; viewport.setPointerCapture(e.pointerId); }, true);
  viewport.addEventListener('pointermove', (e) => { if (pan) { viewport.scrollLeft = pan.l - (e.clientX - pan.x); viewport.scrollTop = pan.t - (e.clientY - pan.y); } });
  viewport.addEventListener('pointerup', () => (pan = null));
  const hint = (t: string | null) => { const h = $('[data-hint]'); h.hidden = !t; h.textContent = t ?? ''; };
  const setTool = (k: string) => {
    tool = k; pending = null; hint(null); sel = null; stage.dataset.tool = k;
    root.querySelectorAll('[data-tool]').forEach((x) => x.setAttribute('aria-pressed', String((x as HTMLElement).dataset.tool === k)));
    render();
  };
  root.querySelectorAll<HTMLElement>('[data-tool]').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool!)));
  root.querySelectorAll<HTMLElement>('[data-color]').forEach((b) => b.addEventListener('click', () => {
    color = b.dataset.color!; root.querySelectorAll('[data-color]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const it = frame().items.find((x) => x.id === sel); if (it) { snapshot(); it.color = color; changed(); }
  }));
  root.querySelectorAll<HTMLElement>('[data-width]').forEach((b) => b.addEventListener('click', () => {
    width = Number(b.dataset.width); root.querySelectorAll('[data-width]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
  const doUndo = () => { const s = undo.pop(); if (s) { redo.push(JSON.stringify(state)); state = JSON.parse(s); if (fi >= state.frames.length) fi = 0; changed(); } };
  const doRedo = () => { const s = redo.pop(); if (s) { undo.push(JSON.stringify(state)); state = JSON.parse(s); if (fi >= state.frames.length) fi = 0; changed(); } };
  $('[data-undo]').addEventListener('click', doUndo); $('[data-redo]').addEventListener('click', doRedo);
  $('[data-clear-ink]').addEventListener('click', () => { snapshot(); frame().strokes = []; changed(); });
  $('[data-clear]').addEventListener('click', () => { if (confirm("Vider l'étape pour tout le roster ?")) { snapshot(); frame().items = []; frame().strokes = []; changed(); } });

  // Étapes
  $('[data-frames]').addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('button'); if (!b) return;
    if (b.dataset.frame !== undefined) { fi = Number(b.dataset.frame); sel = null; render(); return; }
    if (b.hasAttribute('data-frame-rename')) { const n = prompt("Nom de l'étape", frame().name); if (!n) return; snapshot(); frame().name = n.slice(0, 30); changed(); return; }
    snapshot();
    if (b.hasAttribute('data-frame-add')) { const copy = JSON.parse(JSON.stringify(frame())); copy.name = `Étape ${state.frames.length + 1}`; state.frames.splice(fi + 1, 0, copy); fi++; }
    else if (b.hasAttribute('data-frame-del') && confirm(`Supprimer « ${frame().name} » ?`)) { state.frames.splice(fi, 1); fi = Math.max(0, fi - 1); }
    changed();
  });

  // Palette : repères, pings, portraits du jeu. Glisser-déposer sur la carte, ou cliquer puis cliquer sur la carte.
  const itemOf = (b: HTMLElement): Partial<Item> => b.dataset.add === 'ping' ? { type: 'ping', ref: b.dataset.ref, label: b.dataset.label } : { type: 'tok', kind: b.dataset.add, ref: b.dataset.ref, label: b.dataset.label };
  let carry: { b: HTMLElement; x: number; y: number; ghost: HTMLElement | null } | null = null, justDropped = false;
  root.addEventListener('pointerdown', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-add]'); if (!b || e.button !== 0) return;
    carry = { b, x: e.clientX, y: e.clientY, ghost: null };
  });
  document.addEventListener('pointermove', (e) => {
    if (!carry) return;
    if (!carry.ghost) {
      if (Math.hypot(e.clientX - carry.x, e.clientY - carry.y) < 6) return;
      const g = carry.b.cloneNode(true) as HTMLElement;
      g.removeAttribute('data-add'); g.className = 'wb-ghost'; g.setAttribute('aria-hidden', 'true');
      document.body.append(g); carry.ghost = g; hint('Lâche sur la carte pour poser l’élément');
    }
    carry.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    const r = stage.getBoundingClientRect();
    stage.classList.toggle('is-drop', e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
  });
  const drop = (e: PointerEvent) => {
    if (!carry) return;
    const c = carry; carry = null;
    if (!c.ghost) return; // simple clic : géré plus bas
    c.ghost.remove(); stage.classList.remove('is-drop'); hint(null); justDropped = true; setTimeout(() => (justDropped = false), 0);
    const r = stage.getBoundingClientRect();
    if (e.type === 'pointercancel' || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    const [x, y] = pos(e); snapshot(); frame().items.push({ id: uid(), x, y, ...itemOf(c.b) } as Item); pending = null; changed();
  };
  document.addEventListener('pointerup', drop); document.addEventListener('pointercancel', drop);
  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-add]'); if (!b || justDropped) return;
    pending = itemOf(b);
    hint("Clique sur la carte pour poser l'élément, ou glisse-le directement");
  });

  // Carte
  stage.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e);
    const tid = (e.target as Element).closest('[data-id]')?.getAttribute('data-id') ?? null;
    const f = frame();
    if (pending) { snapshot(); f.items.push({ id: uid(), x, y, ...pending } as Item); pending = null; hint(null); changed(); return; }
    if (tool === 'erase') {
      const st = (e.target as Element).closest('[data-stroke]')?.getAttribute('data-stroke');
      if (tid) { snapshot(); f.items = f.items.filter((it) => it.id !== tid); changed(); }
      else if (st) { snapshot(); f.strokes = f.strokes.filter((s) => s.id !== st); changed(); }
      return;
    }
    const stEl = (e.target as Element).closest<HTMLElement>('[data-struct]');
    if (stEl && tool === 'select') { snapshot(); const k = stEl.dataset.struct!; f.down = (f.down ?? []).includes(k) ? f.down!.filter((x) => x !== k) : [...(f.down ?? []), k]; changed(); return; }
    if (tool === 'select') {
      sel = tid;
      const it = f.items.find((i) => i.id === tid);
      if (it) { snapshot(); drag = { id: it.id, dx: x - it.x, dy: y - it.y, dx2: it.x2 !== undefined ? x - it.x2 : undefined, dy2: it.y2 !== undefined ? y - it.y2 : undefined }; stage.setPointerCapture(e.pointerId); }
      render(); return;
    }
    if (tool === 'pen') { drawing = { id: uid(), color, w: width, pts: [[x, y]] }; stage.setPointerCapture(e.pointerId); return; }
    if (tool === 'note' || tool === 'text') {
      const txt = prompt(tool === 'note' ? 'Texte du post-it' : 'Texte'); if (!txt) return;
      snapshot(); f.items.push({ id: uid(), type: tool, x, y, color: tool === 'note' && ['#111111', '#ffffff'].includes(color) ? '#ffd23f' : color, label: txt.slice(0, 200) }); changed(); setTool('select'); return;
    }
    if (['arrow', 'line', 'rect', 'circle', 'zone'].includes(tool)) { shape = { id: uid(), type: tool as Item['type'], x, y, x2: x, y2: y, color, w: width }; stage.setPointerCapture(e.pointerId); }
  });
  stage.addEventListener('pointermove', (e) => {
    const [x, y] = pos(e);
    if (drag) {
      const it = frame().items.find((i) => i.id === drag!.id); if (!it) return;
      it.x = x - drag.dx; it.y = y - drag.dy;
      if (drag.dx2 !== undefined) { it.x2 = x - drag.dx2; it.y2 = y - drag.dy2!; }
      render();
    } else if (drawing) { const l = drawing.pts[drawing.pts.length - 1]; if (Math.hypot(x - l[0], y - l[1]) > .003) { drawing.pts.push([Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]); render(); } }
    else if (shape) { shape.x2 = x; shape.y2 = y; render(); }
  });
  const end = () => {
    if (drag) { drag = null; changed(); }
    if (drawing) { if (drawing.pts.length > 1) { snapshot(); frame().strokes.push(drawing); } drawing = null; changed(); }
    if (shape) { if (Math.hypot(shape.x2! - shape.x, shape.y2! - shape.y) > .01) { snapshot(); frame().items.push(shape); } shape = null; changed(); }
  };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  stage.addEventListener('dblclick', (e) => {
    const tid = (e.target as Element).closest('[data-id]')?.getAttribute('data-id');
    const it = frame().items.find((i) => i.id === tid && (i.type === 'note' || i.type === 'text'));
    if (!it) return;
    const txt = prompt('Modifier le texte', it.label); if (txt === null) return;
    snapshot(); it.label = txt.slice(0, 200); changed();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).matches('input, textarea, select')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); doUndo(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); doRedo(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && sel) { snapshot(); frame().items = frame().items.filter((i) => i.id !== sel); sel = null; changed(); }
  });

  // Notes et fond
  const notes = $<HTMLTextAreaElement>('[data-notes]');
  notes.addEventListener('focus', () => (editingNotes = true));
  notes.addEventListener('blur', () => { editingNotes = false; });
  notes.addEventListener('input', () => { state.notes = notes.value; dirty = true; clearTimeout(saveTimer); saveTimer = window.setTimeout(save, 600); });
  $('[data-bg-select]').addEventListener('change', (e) => {
    let v = (e.target as HTMLSelectElement).value;
    if (v === 'url') { const u = prompt("Lien de l'image (https://…)"); if (!u || !/^https?:\/\//.test(u)) { background(); return; } v = u; }
    // Une âme garde la forme de fosse choisie
    if (isRift(v)) { const n = $<HTMLSelectElement>('[data-baron]').value; const t = riftParts(v).t; v = t === 'base' && n === '1' ? 'Faille' : `Faille:${t}:${n}`; }
    snapshot(); state.bg = v; (e.target as HTMLSelectElement).blur(); changed();
  });
  $('[data-bush-show]').addEventListener('change', (e) => { snapshot(); state.bush = (e.target as HTMLInputElement).checked; changed(); });
  $('[data-look]').addEventListener('change', (e) => { snapshot(); state.look = (e.target as HTMLInputElement).checked ? 'img' : 'vec'; changed(); });
  $('[data-towers-show]').addEventListener('change', (e) => { snapshot(); state.towers = (e.target as HTMLInputElement).checked; changed(); });
  root.querySelectorAll<HTMLElement>('[data-towers]').forEach((b) => b.addEventListener('click', () => {
    snapshot(); const v = b.dataset.towers; frame().down = v === 'up' ? [] : STRUCT.filter(([, team]) => String(team) === v).map(([k]) => k); changed();
  }));
  $('[data-baron]').addEventListener('change', (e) => {
    if (!isRift(state.bg)) return;
    const n = (e.target as HTMLSelectElement).value, t = riftParts(state.bg).t;
    snapshot(); state.bg = t === 'base' && n === '1' ? 'Faille' : `Faille:${t}:${n}`; changed();
  });

  // Portraits selon le jeu du roster
  const pal = $('[data-pal]');
  const fill = (title: string, items: { name: string; icon: string }[]) => {
    items.forEach((i) => icons.set(i.name, i.icon));
    $('[data-pal-title]').textContent = title; $('[data-pal-title]').hidden = false; $('[data-pal-search]').hidden = false;
    const draw = () => {
      const q = $<HTMLInputElement>('[data-pal-search]').value.toLowerCase();
      pal.innerHTML = items.filter((i) => !q || i.name.toLowerCase().includes(q)).map((i) => `<button type="button" data-add="pic" data-ref="${esc(i.name)}" title="${esc(i.name)}"><img src="${esc(i.icon)}" alt="${esc(i.name)}" width="36" height="36" loading="lazy" /></button>`).join('');
    };
    $('[data-pal-search]').addEventListener('input', draw); draw(); render();
  };
  if (game === 'lol') fetch('https://ddragon.leagueoflegends.com/api/versions.json').then((r) => r.json()).then(async (v) => {
    const d = await fetch(`https://ddragon.leagueoflegends.com/cdn/${v[0]}/data/fr_FR/champion.json`).then((r) => r.json());
    fill('Champions', Object.values<any>(d.data).map((c) => ({ name: c.name, icon: `https://ddragon.leagueoflegends.com/cdn/${v[0]}/img/champion/${c.id}.png` })).sort((a, b) => a.name.localeCompare(b.name, 'fr')));
  }).catch(() => {});
  if (game === 'valo') fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=fr-FR').then((r) => r.json())
    .then((a) => fill('Agents', a.data.map((x: any) => ({ name: x.displayName, icon: x.displayIcon })).sort((p: any, q: any) => p.name.localeCompare(q.name, 'fr')))).catch(() => {});

  // ---------- Présentation ----------
  const bar = $('[data-present-bar]'), pnotes = $('[data-present-notes]');
  const presenting = () => root!.classList.contains('is-presenting');
  const showFrame = () => {
    $('[data-present-title]').textContent = `${frame().name} · ${fi + 1}/${state.frames.length}`;
    pnotes.textContent = state.notes || ''; pnotes.hidden = !state.notes;
  };
  const present = async (on: boolean) => {
    root!.classList.toggle('is-presenting', on); bar.hidden = !on; if (!on) pnotes.hidden = true;
    setTool('select'); render(); if (on) showFrame();
    try { if (on && !document.fullscreenElement) await root!.requestFullscreen(); else if (!on && document.fullscreenElement) await document.exitFullscreen(); } catch {}
  };
  const go = (d: number) => { fi = Math.min(state.frames.length - 1, Math.max(0, fi + d)); sel = null; render(); showFrame(); };
  $('[data-present]').addEventListener('click', () => present(true));
  $('[data-exit]').addEventListener('click', () => present(false));
  $('[data-prev]').addEventListener('click', () => go(-1));
  $('[data-next]').addEventListener('click', () => go(1));
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && presenting()) present(false); });
  document.addEventListener('keydown', (e) => {
    if (!presenting()) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'Escape') present(false);
  });

  // ---------- Export en image (PNG) ----------
  const loadImg = (src: string) => new Promise<HTMLImageElement | null>((ok) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  async function toCanvas() {
    const ratio = state.bg === 'Terrain' ? 3 / 5 : 1;
    const W = ratio < 1 ? 960 : 1600, H = Math.round(W / ratio);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H + 70;
    const c = cv.getContext('2d')!;
    c.fillStyle = '#0a0a0a'; c.fillRect(0, 0, W, H + 70);
    c.save(); c.translate(0, 70);
    // Fond
    if (state.bg === 'blanc' || state.bg === 'grille') {
      c.fillStyle = '#fbfaf7'; c.fillRect(0, 0, W, H);
      if (state.bg === 'grille') { c.strokeStyle = '#e3e0d8'; c.lineWidth = 1; for (let i = 1; i < 20; i++) { c.beginPath(); c.moveTo(i * W / 20, 0); c.lineTo(i * W / 20, H); c.moveTo(0, i * H / 20); c.lineTo(W, i * H / 20); c.stroke(); } }
    } else {
      c.fillStyle = '#0f1923'; c.fillRect(0, 0, W, H);
      const src = state.bg === 'Terrain' ? RL_PITCH : isRift(state.bg) ? (state.look === 'img' ? RIFT_IMG : riftUrl(state.bg)) : /^https?:/.test(state.bg) ? state.bg : valoMaps.find((x) => x.name === state.bg)?.icon;
      const img = src ? await loadImg(src) : null;
      if (img) { const s = Math.min(W / img.width, H / img.height); c.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s); }
    }
    const X = (v: number) => v * W, Y = (v: number) => v * H, k = W / 800;
    const f = frame();
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of f.strokes) { c.strokeStyle = s.color; c.lineWidth = s.w * k; c.beginPath(); s.pts.forEach(([x, y], i) => (i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)))); c.stroke(); }
    for (const it of f.items) {
      const col = it.color ?? '#ff4655';
      if (['arrow', 'line'].includes(it.type)) {
        c.strokeStyle = col; c.fillStyle = col; c.lineWidth = (it.w ?? 6) * k;
        c.beginPath(); c.moveTo(X(it.x), Y(it.y)); c.lineTo(X(it.x2!), Y(it.y2!)); c.stroke();
        if (it.type === 'arrow') { const a = Math.atan2(Y(it.y2!) - Y(it.y), X(it.x2!) - X(it.x)), L = 14 * k + (it.w ?? 6) * k * 1.5; c.beginPath(); c.moveTo(X(it.x2!), Y(it.y2!)); c.lineTo(X(it.x2!) - L * Math.cos(a - .45), Y(it.y2!) - L * Math.sin(a - .45)); c.lineTo(X(it.x2!) - L * Math.cos(a + .45), Y(it.y2!) - L * Math.sin(a + .45)); c.closePath(); c.fill(); }
      } else if (['rect', 'circle', 'zone'].includes(it.type)) {
        const x = Math.min(it.x, it.x2!), y = Math.min(it.y, it.y2!), w = Math.abs(it.x2! - it.x), h = Math.abs(it.y2! - it.y);
        c.strokeStyle = col; c.lineWidth = (it.type === 'zone' ? 2 : it.w ?? 6) * k; c.beginPath();
        if (it.type === 'rect') c.rect(X(x), Y(y), X(w), Y(h)); else c.ellipse(X(x + w / 2), Y(y + h / 2), X(w / 2), Y(h / 2), 0, 0, Math.PI * 2);
        if (it.type === 'zone') { c.globalAlpha = .35; c.fillStyle = col; c.fill(); c.globalAlpha = 1; }
        c.stroke();
      }
    }
    if (isRift(state.bg) && state.towers !== false) for (const [kk, team, tx, ty, kind] of STRUCT) {
      const sx = X(tx / MAPW), sy = Y(1 - ty / MAPW), r = (kind === 'inhib' ? 7 : 6) * k, down = (f.down ?? []).includes(kk);
      c.save(); c.translate(sx, sy); if (kind === 'inhib') c.rotate(Math.PI / 4);
      c.globalAlpha = down ? .35 : 1; c.fillStyle = team === 100 ? '#2f6bff' : '#e5251f'; c.fillRect(-r, -r, r * 2, r * 2);
      c.lineWidth = 1.5 * k; c.strokeStyle = '#fff'; c.strokeRect(-r, -r, r * 2, r * 2); c.restore();
      if (down) { c.strokeStyle = '#fff'; c.lineWidth = 2 * k; c.beginPath(); c.moveTo(sx - r, sy - r); c.lineTo(sx + r, sy + r); c.moveTo(sx + r, sy - r); c.lineTo(sx - r, sy + r); c.stroke(); }
    }
    if (isRift(state.bg) && state.bush !== false && state.look !== 'img') { const bi = await loadImg(bushUrl(state.bg)); if (bi) c.drawImage(bi, 0, 0, W, H); }
    const R = 17 * k;
    for (const it of f.items) {
      const x = X(it.x), y = Y(it.y);
      if (it.type === 'tok' || it.type === 'ping') {
        const r = it.type === 'ping' ? R * .82 : R;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
        const wv = it.type === 'ping' && WARD_RANGE[it.ref ?? ''] && isRift(state.bg) ? wallMasks.get(riftUrl(state.bg)) : null;
        const vm = wv ? { ...wv, bush: state.bush === false ? null : bushMasks.get(bushUrl(state.bg)) } : null;
        if (vm) { const poly = visionPoly(vm, it.x, it.y, WARD_RANGE[it.ref ?? '']); c.beginPath(); poly.forEach(([a, b], i) => (i ? c.lineTo(X(a), Y(b)) : c.moveTo(X(a), Y(b)))); c.closePath(); c.globalAlpha = .22; c.fillStyle = WARD_COLOR[it.ref ?? '']; c.fill(); c.globalAlpha = .9; c.lineWidth = 1.5 * k; c.strokeStyle = WARD_COLOR[it.ref ?? '']; c.stroke(); c.globalAlpha = 1; }
        else if (it.type === 'ping' && WARD_RANGE[it.ref ?? ''] && isRift(state.bg)) { const rr = X(WARD_RANGE[it.ref ?? '']); c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.globalAlpha = .18; c.fillStyle = WARD_COLOR[it.ref ?? '']; c.fill(); c.globalAlpha = .9; c.lineWidth = 2 * k; c.strokeStyle = WARD_COLOR[it.ref ?? '']; c.setLineDash([6 * k, 5 * k]); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; }
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = it.type === 'ping' ? ({ danger: '#ff4655', vision: '#ffffff', balle: '#eeeeee', ward: '#ffd23f', controle: '#ff4fa3' } as Record<string, string>)[it.ref ?? ''] ?? '#ffd23f' : it.kind === 'ally' ? '#2f6bff' : it.kind === 'enemy' ? '#e5251f' : '#0f1923';
        c.fill();
        if (it.kind === 'pic') { const img = await loadImg(icons.get(it.ref ?? '') ?? ''); if (img) { c.save(); c.beginPath(); c.arc(x, y, r - 1, 0, Math.PI * 2); c.clip(); c.drawImage(img, x - r, y - r, r * 2, r * 2); c.restore(); } }
        c.lineWidth = 2.5 * k; c.strokeStyle = it.type === 'ping' ? '#111' : '#fff'; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
        if (it.kind !== 'pic') { c.fillStyle = it.type === 'ping' && !['danger'].includes(it.ref ?? '') ? '#111' : '#fff'; c.font = `700 ${15 * k}px system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(it.label ?? '', x, y + 1); }
      } else if (it.type === 'note' || it.type === 'text') {
        c.font = `700 ${(it.type === 'note' ? 13 : 16) * k}px system-ui, sans-serif`; c.textBaseline = 'top'; c.textAlign = 'left';
        const words = (it.label ?? '').split(/\s+/), lines: string[] = []; let line = '';
        for (const w of words) { const t2 = line ? `${line} ${w}` : w; if (c.measureText(t2).width > 170 * k && line) { lines.push(line); line = w; } else line = t2; }
        lines.push(line);
        const lh = (it.type === 'note' ? 17 : 21) * k, bw = Math.max(...lines.map((l) => c.measureText(l).width)) + 18 * k, bh = lines.length * lh + 14 * k;
        if (it.type === 'note') { c.fillStyle = it.color ?? '#ffd23f'; c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 8; c.fillRect(x - bw / 2, y - bh / 2, bw, bh); c.shadowBlur = 0; c.fillStyle = '#111'; }
        else { c.fillStyle = it.color ?? '#fff'; c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 4; }
        lines.forEach((l, i) => c.fillText(l, x - bw / 2 + 9 * k, y - bh / 2 + 7 * k + i * lh));
        c.shadowBlur = 0;
      }
    }
    c.restore();
    // Bandeau : titre, étape, signature
    c.fillStyle = '#e5251f'; c.fillRect(0, 0, 8, 70);
    c.fillStyle = '#fff'; c.font = '700 30px system-ui, sans-serif'; c.textBaseline = 'middle'; c.textAlign = 'left';
    c.fillText(root!.querySelector('.wb-bar h2')!.textContent ?? 'Tableau', 26, 35);
    c.textAlign = 'right'; c.font = '600 22px system-ui, sans-serif'; c.fillStyle = '#bbb';
    c.fillText(`${frame().name}  ·  Oni Korp`, W - 24, 35);
    return cv;
  }
  const fileName = () => `${(root!.querySelector('.wb-bar h2')!.textContent ?? 'tableau')} - ${frame().name}`.replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-').toLowerCase();
  $('[data-download]').addEventListener('click', async () => {
    try { const cv = await toCanvas(); const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = `${fileName()}.png`; a.click(); }
    catch { alert("Impossible de générer l'image avec ce fond."); }
  });
  $('[data-copy-img]').addEventListener('click', async (e) => {
    const b = e.currentTarget as HTMLButtonElement;
    try {
      const cv = await toCanvas();
      const blob = await new Promise<Blob>((ok, ko) => cv.toBlob((x) => (x ? ok(x) : ko()), 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      b.textContent = 'Copiée ! Colle-la dans Discord'; setTimeout(() => (b.textContent = "Copier l'image"), 2500);
    } catch { b.textContent = 'Copie impossible : utilise Télécharger'; setTimeout(() => (b.textContent = "Copier l'image"), 3000); }
  });

  stage.dataset.tool = tool;
  loadValo().then(render);
  render();
  poll().then(schedule);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { pollDelay = 2000; poll().then(schedule); } });
  stage.addEventListener('pointerdown', wake);
}

export {};
