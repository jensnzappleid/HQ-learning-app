/* Harper Learning — the candy jar. HL.candyJar(count, goal, {size, label}) and HL.candy(i, size).
 * The jar itself is the picture pack Harper's parent chose: one drawing per fill level, 0 to 9.
 * HL.jarImages/HL.candyImages are embedded as data URIs by scripts/embed-jar.js
 * (js/art/jar-images.js), so they survive the single-file build and work offline. Both fall back
 * to a drawn SVG when the pictures are not there, the same pattern as HL.animal and HL.piggyBank. */
window.HL = window.HL || {};
(function (HL) {
  const WRAPS = [
    { body: '#F9A8C9', dark: '#E0568C' },   // strawberry
    { body: '#A9D8F5', dark: '#5FA8D8' },   // blueberry
    { body: '#FFE98A', dark: '#E8C64A' },   // lemon
    { body: '#A6E3B8', dark: '#6FC48D' },   // apple
    { body: '#C9B8F2', dark: '#9B85E0' },   // grape
    { body: '#FFC79A', dark: '#F0A268' },   // orange
  ];
  /** one wrapped candy, drawn around (0,0) in a 26 x 16 box */
  const candySvg = (i, r = 7) => {
    const c = WRAPS[i % WRAPS.length];
    return `<g><path d="M${-r - 7} ${-r + 2} L${-r - 1} 0 L${-r - 7} ${r - 2} Z" fill="${c.dark}"/><path d="M${r + 7} ${-r + 2} L${r + 1} 0 L${r + 7} ${r - 2} Z" fill="${c.dark}"/><circle cx="0" cy="0" r="${r}" fill="${c.body}"/><circle cx="${-r * 0.3}" cy="${-r * 0.35}" r="${r * 0.26}" fill="#fff" opacity=".75"/></g>`;
  };
  /** a picture candy, or the drawn one when there is no picture for that index */
  HL.candy = function (i = 0, size = 22) {
    const pics = HL.candyImages;
    if (pics && pics.length) {
      const src = pics[i % pics.length];
      return `<img class="candy" src="${src}" width="${size}" height="${size}" alt="" draggable="false" style="object-fit:contain">`;
    }
    return `<svg class="candy" width="${size}" height="${size * 0.62}" viewBox="-16 -10 32 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${candySvg(i, 7)}</svg>`;
  };

  /** a glass jar holding `count` candies; empty places are faint outlines up to `goal` */
  function drawnJar(count, goal, opts) {
    const size = opts.size || 150;
    const w = 150, h = 170;
    // shelf rows from the bottom up: 3 per row
    const perRow = 3, rows = Math.ceil(goal / perRow);
    const slots = [];
    for (let i = 0; i < goal; i++) {
      const row = Math.floor(i / perRow), col = i % perRow;
      const inRow = Math.min(perRow, goal - row * perRow);
      const spread = 34;
      const x = 75 + (col - (inRow - 1) / 2) * spread + (row % 2 ? 4 : -4);
      const y = 142 - row * 26 - (rows > 3 ? 0 : 4);
      slots.push({ x, y, tilt: ((i * 37) % 40) - 20 });
    }
    const filled = slots.slice(0, Math.min(count, goal)).map((s, i) => `<g transform="translate(${s.x} ${s.y}) rotate(${s.tilt})">${candySvg(i, 7.5)}</g>`).join('');
    const empty = slots.slice(Math.min(count, goal)).map((s) => `<ellipse cx="${s.x}" cy="${s.y}" rx="8" ry="7.5" fill="none" stroke="#E7C9D6" stroke-width="1.6" stroke-dasharray="3 3"/>`).join('');
    return `<svg class="candy-jar" width="${size}" height="${size * h / w}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${count} of ${goal} candies collected">
      <defs><clipPath id="jar-clip"><path d="M28 46 h94 a10 10 0 0 1 10 10 v88 a14 14 0 0 1 -14 14 h-86 a14 14 0 0 1 -14 -14 v-88 a10 10 0 0 1 10 -10 z"/></clipPath>
        <linearGradient id="jar-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".45" stop-color="#F3FAFF" stop-opacity=".5"/><stop offset="1" stop-color="#DCEEF9" stop-opacity=".75"/></linearGradient></defs>
      <rect x="34" y="18" width="82" height="16" rx="7" fill="#F9A8C9"/>
      <rect x="30" y="30" width="90" height="14" rx="6" fill="#E0568C"/>
      <path d="M28 46 h94 a10 10 0 0 1 10 10 v88 a14 14 0 0 1 -14 14 h-86 a14 14 0 0 1 -14 -14 v-88 a10 10 0 0 1 10 -10 z" fill="url(#jar-glass)" stroke="#BFD9E8" stroke-width="2.5"/>
      <g clip-path="url(#jar-clip)">${empty}${filled}</g>
      <path d="M36 60 q6 -4 6 12 v56 q0 10 -6 12" stroke="#ffffff" stroke-width="5" fill="none" opacity=".65" stroke-linecap="round"/>
      ${opts.label === false ? '' : `<text x="75" y="${164}" text-anchor="middle" font-family="inherit" font-weight="800" font-size="13" fill="#4A3B48">${count} / ${goal}</text>`}
    </svg>`;
  }

  /**
   * The jar picture, one drawing per fill level. The pack has 10 states (0 to 9); a `goal` other
   * than 9 (the candy goal can be set to 6, 12 or 15) is scaled onto that same 0-9 range so the
   * jar still looks proportionally as full, rather than needing a picture per possible goal.
   */
  HL.candyJar = function (count, goal = 9, opts = {}) {
    const pics = HL.jarImages;
    if (!pics || pics.length < 10) return drawnJar(count, goal, opts);
    const size = opts.size || 150;
    const w = 340, h = 419;                                   // the picture's own proportions
    const frac = goal > 0 ? Math.max(0, Math.min(1, count / goal)) : 0;
    const idx = Math.max(0, Math.min(9, Math.round(frac * 9)));
    const src = pics[idx];
    const height = Math.round(size * h / w);
    const label = opts.label === false ? '' : `<span style="position:absolute;left:0;right:0;bottom:${height * 0.09}px;text-align:center;font-weight:800;font-size:${Math.max(11, Math.round(size * 0.09))}px;color:#4A3B48">${count} / ${goal}</span>`;
    return `<span class="candy-jar" style="position:relative;display:inline-block;width:${Math.round(size)}px;flex:none" role="img" aria-label="${count} of ${goal} candies collected">
      <img src="${src}" width="${Math.round(size)}" height="${height}" alt="" draggable="false" style="display:block;width:100%;height:auto">${label}</span>`;
  };
})(window.HL);
