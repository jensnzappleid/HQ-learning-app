/* Topic: Perimeter & area — rectangles, squares, triangles, parallelograms, trapeziums,
 * composite (L / cut-corner / plus) shapes, shaded areas, rhombus & kite, and area on a grid. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const numAns = (value, unit) => Number.isInteger(value) ? { type: 'number', value, unit } : { type: 'number', value, unit, tolerance: 0.001 };
  /** one checkable checkpoint on the way to the final answer — an input box of its own, with its
   *  own hint. Only for word problems with a real intermediate stage; a one-formula problem has
   *  nothing to check before the final answer, so it gets no steps at all. */
  const stepOf = (label, value, unit, hint) => ({ label, hint, value, unit, tolerance: Number.isInteger(value) ? undefined : 0.001 });
  const PI = 3.14;
  const PI_NOTE = 'Use π = 3.14 and round to 1 decimal place.';
  /** answer worked out with 3.14 and rounded to 1 dp — same tolerance rule as circles.js */
  const piAns = (value, unit) => { const v = N.round(value, 1); return { type: 'number', value: v, unit, tolerance: Math.max(0.15, N.round(0.1 + v * 0.0006, 2)) }; };
  const fmt1 = (x) => N.fmt(N.round(x, 1));
  const fmtRaw = (x) => N.fmt(N.round(x, 4));
  const C = { fill: '#FFC79A', stroke: '#4A3B48', fill2: '#A9D8F5', fill3: '#C9B8F2', fill4: '#A6E3B8', dash: '#E0568C' };
  const SHADE = '#F9A8C9', SHADE_INK = '#B03060';
  const SVG = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48}</style>${inner}<text x="${w - 4}" y="${h - 4}" text-anchor="end" font-size="12" fill="#888">not to scale</text></svg>`;
  /** same, but without the "not to scale" note (for grid pictures, which ARE to scale) */
  const SVG0 = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48}</style>${inner}</svg>`;
  const T = (x, y, s, opt = '') => `<text x="${x}" y="${y}" ${opt}>${s}</text>`;
  const RA = (x, y, dx, dy) => `<path d="M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}" fill="none" stroke="${C.stroke}" stroke-width="1.5"/>`; // right-angle mark
  const u = (x, unit) => `${N.fmt(x)} ${unit}`;

  function rectSvg(l, w, unit, square) {
    const inner = `<rect x="50" y="30" width="200" height="120" fill="${C.fill}" stroke="${C.stroke}" stroke-width="2"/>`
      + T(150, 175, u(l, unit), 'text-anchor="middle"')
      + (square ? '' : T(258, 95, u(w, unit)));
    return SVG(320, 190, inner);
  }
  function triSvg(b, h, unit, right) {
    const pts = right ? '60,170 240,170 60,40' : '40,170 240,170 160,40';
    const hx = right ? 60 : 160;
    const inner = `<polygon points="${pts}" fill="${C.fill2}" stroke="${C.stroke}" stroke-width="2"/>`
      + (right ? RA(60, 170, 14, -14) : `<line x1="${hx}" y1="40" x2="${hx}" y2="170" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 4"/>` + RA(hx, 170, 14, -14))
      + T(140, 192, u(b, unit), 'text-anchor="middle"')
      + T(hx + 8, 110, u(h, unit));
    return SVG(320, 200, inner);
  }
  function paraSvg(b, h, unit) {
    const inner = `<polygon points="20,170 220,170 290,50 90,50" fill="${C.fill3}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<line x1="90" y1="50" x2="90" y2="170" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 4"/>` + RA(90, 170, 14, -14)
      + T(120, 192, u(b, unit), 'text-anchor="middle"')
      + T(98, 115, u(h, unit));
    return SVG(320, 200, inner);
  }
  /** trapezium: parallel sides a (top) and b (bottom), perpendicular height h.
   *  slant, if given, is drawn on the left-hand slanted side as a deliberate distractor. */
  function trapSvg(a, b, h, unit, slant) {
    const inner = `<polygon points="40,170 280,170 230,50 90,50" fill="${C.fill4}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<line x1="130" y1="50" x2="130" y2="170" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 4"/>` + RA(130, 170, 14, -14)
      + T(160, 40, u(a, unit), 'text-anchor="middle"')
      + T(160, 192, u(b, unit), 'text-anchor="middle"')
      + T(138, 115, u(h, unit))
      + (slant ? T(52, 106, u(slant, unit), 'text-anchor="end" style="font-size:14px"') : '');
    return SVG(320, 200, inner);
  }
  /** L-shape / rectangle with a corner cut out: outer W × H with a w × h notch removed.
   *  opts.corner = 'tr' (default) | 'tl' | 'br' | 'bl' — which corner the piece comes out of.
   *  opts.hide   = list of label keys to replace with a rose "?": 'W', 'H', 'top', 'right'.
   *  Label keys: W = the full long side, H = the full tall side, top = W−w, right = H−h,
   *              iv / ih = the two short inner edges of the notch (w and h). */
  function lSvg(W, H, w, h, unit, opts) {
    const o = opts || {}, corner = o.corner || 'tr', hide = o.hide || [];
    const fx = corner === 'tl' || corner === 'bl', fy = corner === 'br' || corner === 'bl';
    const s = Math.min(146 / W, 100 / H), x0 = fx ? 108 : 66, y0 = 48;
    const X = (v) => x0 + (fx ? W - v : v) * s, Y = (v) => y0 + (fy ? H - v : v) * s;
    const vSide = fy ? 1 : -1;    // away from the shape at the notch's horizontal edge
    const hSide = fx ? -1 : 1;    // away from the shape at the notch's vertical edge
    const lab = (len, key) => (hide.indexOf(key) >= 0 ? `<tspan fill="${C.dash}" font-weight="700">?</tspan>` : u(len, unit));
    const dimY = Y(0) + vSide * 24, dimX = X(W) + hSide * 22;
    // one segment of the horizontal dimension line (labelled beyond it, away from the shape)
    const segH = (a, b, txt) => `<line x1="${X(a)}" y1="${dimY}" x2="${X(b)}" y2="${dimY}" stroke="${C.dash}" stroke-width="1.5"/>`
      + [a, b].map((v) => `<line x1="${X(v)}" y1="${dimY - 5}" x2="${X(v)}" y2="${dimY + 5}" stroke="${C.dash}" stroke-width="1.5"/>`).join('')
      + T((X(a) + X(b)) / 2, dimY + (vSide < 0 ? -9 : 18), txt, 'text-anchor="middle" style="font-size:13px"');
    const segV = (a, b, txt) => `<line x1="${dimX}" y1="${Y(a)}" x2="${dimX}" y2="${Y(b)}" stroke="${C.dash}" stroke-width="1.5"/>`
      + [a, b].map((v) => `<line x1="${dimX - 5}" y1="${Y(v)}" x2="${dimX + 5}" y2="${Y(v)}" stroke="${C.dash}" stroke-width="1.5"/>`).join('')
      + T(dimX + hSide * 8, (Y(a) + Y(b)) / 2 + 5, txt, `text-anchor="${hSide < 0 ? 'end' : 'start'}" style="font-size:13px"`);
    const pts = [[0, 0], [W - w, 0], [W - w, h], [W, h], [W, H], [0, H]].map((k) => `${X(k[0])},${Y(k[1])}`).join(' ');
    const inner = `<polygon points="${pts}" fill="${C.fill}" stroke="${C.stroke}" stroke-width="2"/>`
      + [0, W - w, W].map((v) => lead(X(v), Y(0), X(v), dimY)).join('')
      + segH(0, W - w, lab(W - w, 'top')) + segH(W - w, W, lab(w, 'ih'))
      + [0, h, H].map((v) => lead(X(W), Y(v), dimX, Y(v))).join('')
      + segV(0, h, lab(h, 'iv')) + segV(h, H, lab(H - h, 'right'))
      + T(X(W / 2), Y(H) + (fy ? -11 : 22), lab(W, 'W'), 'text-anchor="middle"')
      + T(X(0) + (fx ? 9 : -9), Y(H / 2) + 5, lab(H, 'H'), `text-anchor="${fx ? 'start' : 'end'}"`);
    return SVG(320, 220, inner);
  }
  /** plus / cross shape built from three rectangles: top block a × t, middle bar W × b, bottom block a × uu */
  function plusSvg(p, a, q, t, b, uu, unit) {
    const W = p + a + q, H = t + b + uu;
    const s = Math.min(150 / W, 112 / H), y0 = 28;
    const x0 = Math.max(78, Math.min(126, Math.round((320 - W * s) / 2) + 14));
    const X = (v) => x0 + v * s, Y = (v) => y0 + v * s;
    const pts = [[p, 0], [p + a, 0], [p + a, t], [W, t], [W, t + b], [p + a, t + b], [p + a, H], [p, H], [p, t + b], [0, t + b], [0, t], [p, t]]
      .map((k) => `${X(k[0])},${Y(k[1])}`).join(' ');
    const dimY = Y(H) + 18;
    const cut = (y) => `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(W)}" y2="${Y(y)}" stroke="${C.stroke}" stroke-width="1" stroke-dasharray="4 3" opacity=".75"/>`;
    const inner = `<polygon points="${pts}" fill="${C.fill3}" stroke="${C.stroke}" stroke-width="2"/>`
      + cut(t) + cut(t + b)
      + `<line x1="${X(0)}" y1="${dimY}" x2="${X(W)}" y2="${dimY}" stroke="${C.dash}" stroke-width="1.5"/>`
      + `<line x1="${X(0)}" y1="${dimY - 5}" x2="${X(0)}" y2="${dimY + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
      + `<line x1="${X(W)}" y1="${dimY - 5}" x2="${X(W)}" y2="${dimY + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
      + T(X(W / 2), dimY + 18, u(W, unit), 'text-anchor="middle"')
      + T(X(p + a / 2), Y(0) - 8, u(a, unit), 'text-anchor="middle"')
      + T(X(p) - 7, Y(t / 2) + 5, u(t, unit), 'text-anchor="end"')
      + T(X(0) - 7, Y(t + b / 2) + 5, u(b, unit), 'text-anchor="end"')
      + T(X(p) - 7, Y(t + b + uu / 2) + 5, u(uu, unit), 'text-anchor="end"');
    return SVG(320, 220, inner);
  }
  const shadeTag = (x, y, anchor) => T(x, y, 'shaded', `${anchor ? 'text-anchor="' + anchor + '" ' : ''}style="font-size:13px;font-weight:700;fill:${SHADE_INK}"`);
  const lead = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.dash}" stroke-width="1" stroke-dasharray="3 3" opacity=".65"/>`;
  /** horizontal dimension line from x1 to x2 at height y, label centred underneath */
  const dimH = (x1, x2, y, txt) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
    + T((x1 + x2) / 2, y + 17, txt, 'text-anchor="middle" style="font-size:13px"');
  /** same, but with the label sitting ABOVE the line (for dimensions drawn over the top of a shape) */
  const dimHup = (x1, x2, y, txt) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}" stroke="${C.dash}" stroke-width="1.5"/>`
    + T((x1 + x2) / 2, y - 8, txt, 'text-anchor="middle" style="font-size:13px"');
  /** vertical dimension line from y1 to y2 at x, label to the LEFT of it */
  const dimV = (y1, y2, x, txt) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x - 5}" y1="${y1}" x2="${x + 5}" y2="${y1}" stroke="${C.dash}" stroke-width="1.5"/>`
    + `<line x1="${x - 5}" y1="${y2}" x2="${x + 5}" y2="${y2}" stroke="${C.dash}" stroke-width="1.5"/>`
    + T(x - 8, (y1 + y2) / 2 + 5, txt, 'text-anchor="end" style="font-size:13px"');
  /** big rectangle L × W shaded pink, with a smaller white rectangle l × w cut out of the middle.
   *  Outer sides are labelled on the bottom and right; the inner ones get dimension lines above and left. */
  function shadedRectSvg(L, W, l, w, unit) {
    const s = Math.min(168 / L, 100 / W), x0 = 84, y0 = 56;
    const X = (v) => x0 + v * s, Y = (v) => y0 + v * s;
    const ox = (L - l) / 2, oy = (W - w) / 2;
    const dy = Y(0) - 22, dx = X(0) - 24;
    const inner = `<rect x="${X(0)}" y="${Y(0)}" width="${L * s}" height="${W * s}" fill="${SHADE}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<rect x="${X(ox)}" y="${Y(oy)}" width="${l * s}" height="${w * s}" fill="#FFFFFF" stroke="${C.stroke}" stroke-width="2"/>`
      + lead(X(ox), Y(oy), X(ox), dy) + lead(X(ox + l), Y(oy), X(ox + l), dy)
      + dimHup(X(ox), X(ox + l), dy, u(l, unit))
      + lead(X(ox), Y(oy), dx, Y(oy)) + lead(X(ox), Y(oy + w), dx, Y(oy + w))
      + dimV(Y(oy), Y(oy + w), dx, u(w, unit))
      + T(X(L / 2), Y(W) + 22, u(L, unit), 'text-anchor="middle"')
      + T(X(L) + 8, Y(W / 2) + 5, u(W, unit))
      + shadeTag(X(0) + 6, Y(W) - 7);
    return SVG(320, 200, inner);
  }
  /** square of side s0 shaded pink, with a white circle (diameter = s0) inside it */
  function shadedCircleSvg(s0, unit) {
    const side = 128, x0 = 92, y0 = 36, cx = x0 + side / 2, cy = y0 + side / 2;
    const inner = `<rect x="${x0}" y="${y0}" width="${side}" height="${side}" fill="${SHADE}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${side / 2}" fill="#FFFFFF" stroke="${C.stroke}" stroke-width="2"/>`
      + `<line x1="${x0}" y1="${cy}" x2="${x0 + side}" y2="${cy}" stroke="${C.dash}" stroke-width="2"/>`
      + T(cx, cy - 8, `d = ${u(s0, unit)}`, 'text-anchor="middle" style="font-size:13px"')
      + T(cx, y0 + side + 20, u(s0, unit), 'text-anchor="middle"')
      + T(x0 + side + 8, cy + 5, u(s0, unit))
      + shadeTag(x0 - 6, y0 + 14, 'end');
    return SVG(320, 200, inner);
  }
  /** rectangle L × W shaded pink with a white triangle (base b, height h) sitting on the bottom edge */
  function shadedTriSvg(L, W, b, h, unit) {
    const s = Math.min(174 / L, 92 / W), x0 = 78, y0 = 28;
    const X = (v) => x0 + v * s, Y = (v) => y0 + v * s;
    const bx = (L - b) / 2, apex = bx + b / 2;
    const inner = `<rect x="${X(0)}" y="${Y(0)}" width="${L * s}" height="${W * s}" fill="${SHADE}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<polygon points="${X(bx)},${Y(W)} ${X(bx + b)},${Y(W)} ${X(apex)},${Y(W - h)}" fill="#FFFFFF" stroke="${C.stroke}" stroke-width="2"/>`
      + `<line x1="${X(apex)}" y1="${Y(W - h)}" x2="${X(apex)}" y2="${Y(W)}" stroke="${C.dash}" stroke-width="1.5" stroke-dasharray="5 4"/>`
      + RA(X(apex), Y(W), 12, -12)
      + T(X(apex) + 7, Y(W - h / 2) + 5, u(h, unit), 'style="font-size:13px"')
      + lead(X(bx), Y(W), X(bx), Y(W) + 16) + lead(X(bx + b), Y(W), X(bx + b), Y(W) + 16)
      + dimH(X(bx), X(bx + b), Y(W) + 14, `base ${u(b, unit)}`)
      + dimH(X(0), X(L), Y(W) + 48, u(L, unit))
      + T(X(L) + 8, Y(W / 2) + 5, u(W, unit))
      + shadeTag(X(0) + 6, Y(0) + 16);
    return SVG(320, 200, inner);
  }
  /** a path of width p all the way around a rectangular pool l × w — the path is the shaded part */
  function shadedPathSvg(l, w, p, unit, what) {
    const OL = l + 2 * p, OW = w + 2 * p;
    const s = Math.min(138 / OL, 90 / OW), x0 = 84, y0 = 56;
    const X = (v) => x0 + v * s, Y = (v) => y0 + v * s;
    const dy = Y(0) - 22, dx = X(0) - 24, mid = X(p + l / 2), strip = Y(p / 2);
    const inner = `<rect x="${X(0)}" y="${Y(0)}" width="${OL * s}" height="${OW * s}" fill="${SHADE}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<rect x="${X(p)}" y="${Y(p)}" width="${l * s}" height="${w * s}" fill="${C.fill2}" stroke="${C.stroke}" stroke-width="2"/>`
      + T(X(p + l / 2), Y(p + w / 2) + 5, what || 'pool', 'text-anchor="middle" style="font-size:13px"')
      + lead(X(p), Y(p), X(p), dy) + lead(X(p + l), Y(p), X(p + l), dy)
      + dimHup(X(p), X(p + l), dy, u(l, unit))
      + lead(X(p), Y(p), dx, Y(p)) + lead(X(p), Y(p + w), dx, Y(p + w))
      + dimV(Y(p), Y(p + w), dx, u(w, unit))
      + `<line x1="${mid}" y1="${Y(0)}" x2="${mid}" y2="${Y(p)}" stroke="${C.dash}" stroke-width="2"/>`
      + lead(mid, strip, X(OL) + 6, strip)
      + T(X(OL) + 9, strip + 5, `path ${u(p, unit)}`, 'style="font-size:13px"')
      + `<rect x="${X(0)}" y="${Y(OW) + 12}" width="14" height="12" fill="${SHADE}" stroke="${C.stroke}" stroke-width="1"/>`
      + T(X(0) + 20, Y(OW) + 22, '= the path', `style="font-size:12px;font-weight:700;fill:${SHADE_INK}"`);
    return SVG(320, 200, inner);
  }
  /** rhombus or kite with both diagonals drawn dashed and labelled */
  function kiteSvg(d1, d2, unit, isKite) {
    const cx = 160, halfW = 88, top = 34, bot = 170;
    const midY = isKite ? Math.round(top + (bot - top) * 0.36) : (top + bot) / 2;
    const pts = `${cx},${top} ${cx + halfW},${midY} ${cx},${bot} ${cx - halfW},${midY}`;
    const inner = `<polygon points="${pts}" fill="${C.fill3}" stroke="${C.stroke}" stroke-width="2"/>`
      + `<line x1="${cx - halfW}" y1="${midY}" x2="${cx + halfW}" y2="${midY}" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 4"/>`
      + `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${bot}" stroke="${C.dash}" stroke-width="2" stroke-dasharray="6 4"/>`
      + `<rect x="${cx}" y="${midY - 11}" width="11" height="11" fill="none" stroke="${C.stroke}" stroke-width="1.2"/>`
      + T(cx - halfW / 2, midY - 9, u(d1, unit), 'text-anchor="middle" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px"')
      + T(cx + 9, midY + (bot - midY) / 2, u(d2, unit), 'style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px"');
    return SVG(320, 200, inner);
  }
  /** a shape drawn on a 1-unit grid, for counting whole and half squares.
   *  kind 'tri' = right triangle with legs n × n; kind 'diamond' = square turned 45° with diagonals 2n */
  function gridSvg(kind, n, unit) {
    const cells = kind === 'tri' ? n : 2 * n;
    const c = Math.max(14, Math.min(26, Math.floor(126 / cells)));
    const size = cells * c, x0 = Math.round((320 - size) / 2), y0 = 22;
    const X = (v) => x0 + v * c, Y = (v) => y0 + v * c;
    const poly = kind === 'tri'
      ? `${X(0)},${Y(0)} ${X(0)},${Y(n)} ${X(n)},${Y(n)}`
      : `${X(n)},${Y(0)} ${X(2 * n)},${Y(n)} ${X(n)},${Y(2 * n)} ${X(0)},${Y(n)}`;
    let g = '';
    for (let r = 0; r <= cells; r++) g += `<line x1="${X(0)}" y1="${Y(r)}" x2="${X(cells)}" y2="${Y(r)}" stroke="#C9B8F2" stroke-width="1"/>`;
    for (let k = 0; k <= cells; k++) g += `<line x1="${X(k)}" y1="${Y(0)}" x2="${X(k)}" y2="${Y(cells)}" stroke="#C9B8F2" stroke-width="1"/>`;
    const inner = g + `<polygon points="${poly}" fill="${SHADE}" fill-opacity=".72" stroke="${C.stroke}" stroke-width="2.5"/>`
      + T(160, y0 + size + 22, `every square is 1 ${unit} × 1 ${unit}`, 'text-anchor="middle" style="font-size:13px"');
    return SVG0(320, y0 + size + 34, inner);
  }

  /** a plausible slanted side for a trapezium: longer than the height, and not equal to either parallel side */
  const slantFor = (a, b, h) => { let v = h + R.int(1, 4); for (let i = 0; i < 8 && (v === a || v === b); i++) v++; return v; };
  const dim = (level, hi) => (level === 1 ? R.int(2, hi) : level === 2 ? (R.chance(0.3) ? R.int(2, hi) + 0.5 : R.int(2, hi)) : (R.chance(0.4) ? R.int(3, hi + 6) + 0.5 : R.int(3, hi + 6)));

  function calc(level) {
    const unit = R.pick(['cm', 'm', 'cm', 'mm']);
    const types = level === 1 ? ['rectP', 'rectA', 'squareP', 'squareA', 'rectP', 'rectA', 'gridA', 'gridA']
      : level === 2 ? ['rectP', 'rectA', 'triA', 'triA', 'paraA', 'squareA', 'trapA', 'trapA', 'compA', 'compP', 'kiteA', 'shadedRect', 'gridA', 'triA']
      : ['compA', 'compP', 'compP', 'trapA', 'missing', 'triA', 'paraA', 'plusA', 'shadedCircle', 'shadedTri', 'shadedPath', 'shadedRect', 'kiteA', 'missing'];
    const t = R.pick(types);
    if (t === 'rectP' || t === 'rectA') {
      const l = dim(level, 12), w = dim(level, 9);
      const P = N.round(2 * (l + w), 2), A = N.round(l * w, 2);
      const isP = t === 'rectP';
      return {
        prompt: isP ? `Find the perimeter of this rectangle. Give your answer in ${unit}.` : `Find the area of this rectangle. Give your answer in ${unit}².`,
        visual: rectSvg(l, w, unit),
        answer: numAns(isP ? P : A, isP ? unit : unit + '²'),
        hint: isP ? 'Perimeter is the distance all the way around: add up all four sides.' : 'Area of a rectangle = length × width.',
        working: isP
          ? [`Perimeter = 2 × (length + width).`, `2 × (${N.fmt(l)} + ${N.fmt(w)}) = 2 × ${N.fmt(l + w)} = ${N.fmt(P)}.`, `Perimeter = <b>${N.fmt(P)} ${unit}</b>.`]
          : [`Area = length × width.`, `${N.fmt(l)} × ${N.fmt(w)} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} ${unit}²</b>.`],
        finalAnswer: isP ? `${N.fmt(P)} ${unit}` : `${N.fmt(A)} ${unit}²`,
        skill: isP ? 'perimeter' : 'area-rect',
      };
    }
    if (t === 'squareP' || t === 'squareA') {
      const s = dim(level, 12);
      const isP = t === 'squareP';
      const P = N.round(4 * s, 2), A = N.round(s * s, 2);
      return {
        prompt: isP ? `Find the perimeter of this square. Give your answer in ${unit}.` : `Find the area of this square. Give your answer in ${unit}².`,
        visual: rectSvg(s, s, unit, true),
        answer: numAns(isP ? P : A, isP ? unit : unit + '²'),
        hint: isP ? 'A square has 4 equal sides.' : 'Area of a square = side × side.',
        working: isP ? [`All 4 sides are ${N.fmt(s)} ${unit}.`, `4 × ${N.fmt(s)} = ${N.fmt(P)}.`, `Perimeter = <b>${N.fmt(P)} ${unit}</b>.`]
          : [`Area = side × side.`, `${N.fmt(s)} × ${N.fmt(s)} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} ${unit}²</b>.`],
        finalAnswer: isP ? `${N.fmt(P)} ${unit}` : `${N.fmt(A)} ${unit}²`,
        skill: isP ? 'perimeter' : 'area-rect',
      };
    }
    if (t === 'triA') {
      const b = level === 3 ? R.int(4, 20) : R.int(2, 12), h = level === 3 ? R.int(3, 15) : R.int(2, 10);
      const A = N.round(b * h / 2, 2);
      return {
        prompt: `Find the area of this triangle. Give your answer in ${unit}².`,
        visual: triSvg(b, h, unit, R.chance(0.3)),
        answer: numAns(A, unit + '²'),
        hint: 'Area of a triangle = ½ × base × height. The height is the dashed line at right angles to the base.',
        working: [`Area = ½ × base × height.`, `½ × ${b} × ${h} = ½ × ${b * h} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} ${unit}²</b>.`],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'area-tri',
      };
    }
    if (t === 'paraA') {
      const b = level === 3 ? R.int(5, 20) : R.int(3, 12), h = level === 3 ? R.int(3, 12) + (R.chance(0.3) ? 0.5 : 0) : R.int(2, 9);
      const A = N.round(b * h, 2);
      return {
        prompt: `Find the area of this parallelogram. Give your answer in ${unit}².`,
        visual: paraSvg(b, h, unit),
        answer: numAns(A, unit + '²'),
        hint: 'Area of a parallelogram = base × height (the dashed line, not the slanted side).',
        working: [`Area = base × height.`, `${b} × ${N.fmt(h)} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} ${unit}²</b>.`],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'area-para',
      };
    }
    if (t === 'trapA') {
      const a = level === 2 ? R.int(2, 8) : R.int(3, 12), b = a + R.int(2, level === 2 ? 6 : 9), h = level === 2 ? R.int(2, 7) : R.int(3, 10);
      const A = N.round((a + b) * h / 2, 2);
      const slant = slantFor(a, b, h);   // a slanted side, drawn but not needed
      return {
        prompt: `Find the area of this trapezium. Give your answer in ${unit}².`,
        visual: trapSvg(a, b, h, unit, slant),
        answer: numAns(A, unit + '²'),
        hint: 'Average the two parallel sides (add them and halve), then multiply by the height. The slanted side is not used.',
        working: [
          `The two <b>parallel</b> sides are ${a} and ${b}. The height is ${h} (the dashed line at right angles).`,
          `The ${slant} ${unit} slanted side is a trap — a trapezium never uses it.`,
          `Average the parallel sides: (${a} + ${b}) ÷ 2 = ${N.fmt((a + b) / 2)}.`,
          `Multiply by the height: ${N.fmt((a + b) / 2)} × ${h} = ${N.fmt(A)}.`,
          `Area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'area-trap',
      };
    }
    if (t === 'compA' || t === 'compP') {
      const W = level === 3 ? R.int(8, 16) : R.int(6, 12), H = level === 3 ? R.int(6, 12) : R.int(5, 10);
      const w = R.int(2, W - 3), h = R.int(2, H - 2);
      const corner = R.pick(['tr', 'tl', 'br', 'bl']);
      const isP = t === 'compP';
      const A = W * H - w * h, P = 2 * (W + H);
      const cutOut = R.chance(0.5);   // how the picture is described in words
      const shapeName = cutOut ? 'rectangle with a corner cut out' : 'L-shape';
      if (isP) {
        // hide the two sides she has to work out for herself — that step IS the skill
        const hideOuter = R.chance(0.5);
        const hide = hideOuter ? ['W', 'H'] : ['top', 'right'];
        const found = hideOuter
          ? [`Long side: ${W - w} + ${w} = ${W} ${unit}.`, `Tall side: ${h} + ${H - h} = ${H} ${unit}.`]
          : [`Top side: ${W} − ${w} = ${W - w} ${unit}.`, `Right side: ${H} − ${h} = ${H - h} ${unit}.`];
        return {
          prompt: `Two sides of this ${shapeName} are not labelled. Work them out, then find the perimeter. Give your answer in ${unit}.`,
          visual: lSvg(W, H, w, h, unit, { corner, hide }),
          answer: numAns(P, unit),
          hint: 'Find each missing side first: opposite sides of the whole rectangle must add up to the same total. Then walk right round the outside adding every side.',
          working: [`The two sides marked <b>?</b> are not given, so work them out first.`].concat(found).concat([
            `Now walk right round the outside: ${W - w} + ${h} + ${w} + ${H - h} + ${W} + ${H}.`,
            `= ${P}.`,
            `(Check: it is the same as the ${W} × ${H} rectangle it came from, 2 × (${W} + ${H}) = ${P}.)`,
            `Perimeter = <b>${P} ${unit}</b>.`,
          ]),
          finalAnswer: `${P} ${unit}`, skill: 'composite',
        };
      }
      const split = R.chance(0.5);
      return {
        prompt: `Find the area of this ${shapeName}. Give your answer in ${unit}².`,
        visual: lSvg(W, H, w, h, unit, { corner }),
        answer: numAns(A, unit + '²'),
        hint: split ? 'Split it into two rectangles, work out each area, then add them.' : 'Work out the whole big rectangle, then take off the piece that was cut out.',
        working: split
          ? [`Split it into two rectangles with one straight cut.`, `The wide strip (the full ${W} ${unit} side): ${W} × ${H - h} = ${N.fmt(W * (H - h))} ${unit}².`, `The narrow strip beside the notch: ${W - w} × ${h} = ${N.fmt((W - w) * h)} ${unit}².`, `Add them: ${N.fmt(W * (H - h))} + ${N.fmt((W - w) * h)} = ${A}.`, `Area = <b>${A} ${unit}²</b>.`]
          : [`Whole rectangle before the piece was cut out: ${W} × ${H} = ${W * H} ${unit}².`, `The missing piece: ${w} × ${h} = ${w * h} ${unit}².`, `Take it off: ${W * H} − ${w * h} = ${A}.`, `Area = <b>${A} ${unit}²</b>.`],
        finalAnswer: `${A} ${unit}²`, skill: 'composite',
      };
    }
    if (t === 'plusA') {
      const a = R.int(2, 5), p = R.int(2, 5), q = R.int(2, 5), W = p + a + q;
      const bT = R.int(2, 5), b = R.int(2, 5), bU = R.int(2, 5);
      const top = a * bT, bar = W * b, bottom = a * bU, A = top + bar + bottom;
      return {
        prompt: `This shape is made from three rectangles. Find its area in ${unit}².`,
        visual: plusSvg(p, a, q, bT, b, bU, unit),
        answer: numAns(A, unit + '²'),
        hint: 'The dashed lines split it into three rectangles: a top block, the wide middle bar, and a bottom block. Find each area, then add.',
        working: [
          `Top block: ${a} × ${bT} = ${N.fmt(top)} ${unit}².`,
          `Middle bar: ${W} × ${b} = ${N.fmt(bar)} ${unit}².`,
          `Bottom block: ${a} × ${bU} = ${N.fmt(bottom)} ${unit}².`,
          `Add all three: ${N.fmt(top)} + ${N.fmt(bar)} + ${N.fmt(bottom)} = ${N.fmt(A)}.`,
          `Area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'composite',
      };
    }
    if (t === 'shadedRect') {
      const L = R.int(10, 16), W = R.int(8, 12);
      const l = R.int(4, L - 4), w = R.int(4, W - 4);
      const A = L * W - l * w;
      return {
        prompt: `Find the area of the shaded (pink) part. Give your answer in ${unit}².`,
        visual: shadedRectSvg(L, W, l, w, unit),
        answer: numAns(A, unit + '²'),
        hint: 'Shaded area = big rectangle − small rectangle. Work out both areas, then subtract.',
        working: [
          `Big rectangle: ${L} × ${W} = ${N.fmt(L * W)} ${unit}².`,
          `White rectangle inside: ${l} × ${w} = ${N.fmt(l * w)} ${unit}².`,
          `Shaded = big − small = ${N.fmt(L * W)} − ${N.fmt(l * w)} = ${N.fmt(A)}.`,
          `Shaded area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'shaded',
      };
    }
    if (t === 'shadedCircle') {
      const r = R.int(2, 8), s = 2 * r;
      const circle = PI * r * r, A = s * s - circle;
      return {
        prompt: `A circle just fits inside this square. Find the area of the shaded (pink) part. ${PI_NOTE}`,
        visual: shadedCircleSvg(s, unit),
        answer: piAns(A, unit + '²'),
        hint: 'Shaded area = square − circle. The circle touches all four sides, so its diameter is the same as the side of the square.',
        working: [
          `Square: ${s} × ${s} = ${N.fmt(s * s)} ${unit}².`,
          `The circle fills the square edge to edge, so d = ${s} and r = ${s} ÷ 2 = ${r} ${unit}.`,
          `Circle: 3.14 × ${r}² = 3.14 × ${r * r} = ${fmtRaw(circle)} ${unit}².`,
          `Shaded = ${N.fmt(s * s)} − ${fmtRaw(circle)} = ${fmtRaw(A)} ≈ ${fmt1(A)}.`,
          `Shaded area ≈ <b>${fmt1(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${fmt1(A)} ${unit}²`, skill: 'shaded',
      };
    }
    if (t === 'shadedTri') {
      const L = R.int(8, 16), W = R.int(5, 10);
      const b = 2 * R.int(2, Math.floor(L / 2)), h = R.int(2, W - 1);
      const tri = b * h / 2, A = N.round(L * W - tri, 2);
      return {
        prompt: `A white triangle is cut out of this rectangle. Find the area of the shaded (pink) part. Give your answer in ${unit}².`,
        visual: shadedTriSvg(L, W, b, h, unit),
        answer: numAns(A, unit + '²'),
        hint: 'Rectangle area − triangle area. Remember the triangle needs the ½.',
        working: [
          `Rectangle: ${L} × ${W} = ${N.fmt(L * W)} ${unit}².`,
          `Triangle: ½ × ${b} × ${h} = ${N.fmt(tri)} ${unit}².`,
          `Shaded = ${N.fmt(L * W)} − ${N.fmt(tri)} = ${N.fmt(A)}.`,
          `Shaded area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'shaded',
      };
    }
    if (t === 'shadedPath') {
      const l = R.int(5, 12), w = R.int(3, 9), p = R.pick([1, 1, 2, 2, 0.5]);
      const what = R.pick(['pool', 'pond', 'lawn', 'garden']);
      const OL = N.round(l + 2 * p, 2), OW = N.round(w + 2 * p, 2);
      const A = N.round(OL * OW - l * w, 2);
      return {
        prompt: `A ${N.fmt(p)} ${unit} wide path runs all the way around this ${what}. Find the area of the path (the shaded part). Give your answer in ${unit}².`,
        visual: shadedPathSvg(l, w, p, unit, what),
        answer: numAns(A, unit + '²'),
        hint: `The path adds ${N.fmt(p)} ${unit} to <b>each</b> end, so the outside rectangle is ${N.fmt(2 * p)} ${unit} longer and ${N.fmt(2 * p)} ${unit} wider than the ${what}.`,
        working: [
          `Outside length = ${l} + ${N.fmt(p)} + ${N.fmt(p)} = ${N.fmt(OL)} ${unit}.`,
          `Outside width = ${w} + ${N.fmt(p)} + ${N.fmt(p)} = ${N.fmt(OW)} ${unit}.`,
          `Whole outside rectangle: ${N.fmt(OL)} × ${N.fmt(OW)} = ${N.fmt(OL * OW)} ${unit}².`,
          `The ${what} itself: ${l} × ${w} = ${N.fmt(l * w)} ${unit}².`,
          `Path = ${N.fmt(OL * OW)} − ${N.fmt(l * w)} = ${N.fmt(A)}.`,
          `Path area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'shaded',
      };
    }
    if (t === 'kiteA') {
      const isKite = R.chance(0.5);
      const d1 = level === 3 ? R.int(4, 16) : R.int(3, 10), d2 = level === 3 ? R.int(4, 16) : R.int(4, 12);
      const A = N.round(d1 * d2 / 2, 2);
      const nameOf = isKite ? 'kite' : 'rhombus';
      return {
        prompt: `Find the area of this ${nameOf}. The dashed lines are its diagonals. Give your answer in ${unit}².`,
        visual: kiteSvg(d1, d2, unit, isKite),
        answer: numAns(A, unit + '²'),
        hint: `Area of a ${nameOf} = ½ × (one diagonal) × (the other diagonal).`,
        working: [
          `A ${nameOf} fits inside a ${d1} by ${d2} rectangle and fills exactly half of it.`,
          `Area = ½ × d₁ × d₂ = ½ × ${d1} × ${d2}.`,
          `${d1} × ${d2} = ${N.fmt(d1 * d2)}, and half of that is ${N.fmt(A)}.`,
          `Area = <b>${N.fmt(A)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${unit}²`, skill: 'area-kite',
      };
    }
    if (t === 'gridA') {
      const gUnit = R.pick(['cm', 'cm', 'm']);
      const kind = R.chance(0.5) ? 'tri' : 'diamond';
      const n = kind === 'tri' ? R.int(3, level === 1 ? 5 : 7) : R.int(2, level === 1 ? 3 : 4);
      const whole = kind === 'tri' ? n * (n - 1) / 2 : 2 * n * n - 2 * n;
      const halves = kind === 'tri' ? n : 4 * n;
      const A = N.round(whole + halves / 2, 2);
      return {
        prompt: `This shape is drawn on a 1 ${gUnit} grid. Count the whole squares and the half squares to find its area. Give your answer in ${gUnit}².`,
        visual: gridSvg(kind, n, gUnit),
        answer: numAns(A, gUnit + '²'),
        hint: 'Count the squares that are completely inside first. Then count the half squares and remember two halves make one whole.',
        working: [
          `Whole squares completely inside: <b>${whole}</b>.`,
          `Half squares round the slanted edge${kind === 'tri' ? '' : 's'}: <b>${halves}</b>.`,
          `${halves} halves = ${halves} ÷ 2 = ${N.fmt(halves / 2)} whole squares.`,
          `Total: ${whole} + ${N.fmt(halves / 2)} = ${N.fmt(A)}.`,
          `Area = <b>${N.fmt(A)} ${gUnit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(A)} ${gUnit}²`, skill: 'grid',
      };
    }
    // missing side
    const m = R.pick(['rectA', 'rectP', 'triA', 'squareA', 'squareP']);
    if (m === 'rectA') {
      const l = R.int(4, 15), w = R.int(3, 12), A = l * w;
      return {
        prompt: `A rectangle has an area of ${A} ${unit}² and a length of ${l} ${unit}. What is its width?`,
        answer: numAns(w, unit),
        hint: 'Area = length × width, so width = area ÷ length.',
        working: [`Area = length × width.`, `${A} = ${l} × width, so width = ${A} ÷ ${l}.`, `Width = <b>${w} ${unit}</b>.`],
        finalAnswer: `${w} ${unit}`, skill: 'missing',
      };
    }
    if (m === 'rectP') {
      const l = R.int(5, 15), w = R.int(2, l - 1), P = 2 * (l + w);
      return {
        prompt: `A rectangle has a perimeter of ${P} ${unit}. Its length is ${l} ${unit}. What is its width?`,
        answer: numAns(w, unit),
        hint: 'Half the perimeter = length + width.',
        working: [`Perimeter = 2 × (length + width), so length + width = ${P} ÷ 2 = ${P / 2}.`, `Width = ${P / 2} − ${l} = ${w}.`, `Width = <b>${w} ${unit}</b>.`],
        finalAnswer: `${w} ${unit}`, skill: 'missing',
      };
    }
    if (m === 'triA') {
      const b = R.int(4, 16), h = R.int(3, 12), A = b * h / 2;
      return {
        prompt: `A triangle has an area of ${N.fmt(A)} ${unit}² and a base of ${b} ${unit}. What is its height?`,
        answer: numAns(h, unit),
        hint: 'Double the area first, then divide by the base.',
        working: [`Area = ½ × base × height, so base × height = 2 × area.`, `2 × ${N.fmt(A)} = ${b * h}.`, `Height = ${b * h} ÷ ${b} = ${h}.`, `Height = <b>${h} ${unit}</b>.`],
        finalAnswer: `${h} ${unit}`, skill: 'missing',
      };
    }
    if (m === 'squareA') {
      const s = R.int(3, 15), A = s * s;
      return {
        prompt: `A square has an area of ${A} ${unit}². How long is each side?`,
        answer: numAns(s, unit),
        hint: 'Which number times itself gives the area?',
        working: [`Area = side × side.`, `${s} × ${s} = ${A}, so the side is ${s}.`, `Side = <b>${s} ${unit}</b>.`],
        finalAnswer: `${s} ${unit}`, skill: 'missing',
      };
    }
    const s = R.int(3, 25), P = 4 * s;
    return {
      prompt: `A square has a perimeter of ${P} ${unit}. How long is each side?`,
      answer: numAns(s, unit),
      hint: 'A square has 4 equal sides: divide the perimeter by 4.',
      working: [`Perimeter = 4 × side.`, `${P} ÷ 4 = ${s}.`, `Side = <b>${s} ${unit}</b>.`],
      finalAnswer: `${s} ${unit}`, skill: 'missing',
    };
  }

  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['fence1', 'carpet1', 'wall1', 'garden1', 'vege1', 'flag1'])
      : level === 2 ? R.pick(['fence2', 'carpet2', 'wall2', 'netball', 'sail', 'rugby', 'trapSection', 'kiteWord', 'wallDoor2'])
      : R.pick(['fence3', 'carpet3', 'wall3', 'netball3', 'deck', 'sail3', 'pathPave', 'borderMat', 'lPaddock', 'trapDeck', 'turf3']);
    switch (t) {
      case 'vege1': {
        const l = R.int(3, 9), w = R.int(2, 8);
        const P = 2 * (l + w);
        return {
          prompt: `${name}'s vege garden is a rectangle ${l} m long and ${w} m wide. How many metres of fence go all the way around it?`,
          visual: rectSvg(l, w, 'm'),
          answer: numAns(P, 'm'),
          hint: 'All the way around = perimeter. Add up all four sides.',
          working: [`The four sides are ${l}, ${w}, ${l} and ${w}.`, `${l} + ${w} + ${l} + ${w} = ${P}.`, `<b>${P} m</b> of fence.`],
          finalAnswer: `${P} m`,
        };
      }
      case 'flag1': {
        const b = R.int(2, 10), h = R.pick([2, 4, 6, 8, 10]);
        const A = b * h / 2;
        return {
          prompt: `A triangular flag for the swimming sports has a base of ${b} cm and a height of ${h} cm. What is its area?`,
          visual: triSvg(b, h, 'cm', false),
          answer: numAns(A, 'cm²'),
          hint: 'Triangle area = ½ × base × height. Multiply the two numbers, then halve it.',
          working: [`${b} × ${h} = ${b * h}.`, `Half of that: ${b * h} ÷ 2 = ${N.fmt(A)}.`, `<b>${N.fmt(A)} cm²</b>.`],
          finalAnswer: `${N.fmt(A)} cm²`,
        };
      }
      case 'wallDoor2': {
        const l = R.int(4, 9), h = R.pick([2.4, 2.5, 3]), dw = R.pick([0.8, 1]), dh = R.pick([2, 2.5]);
        const A = N.round(l * h - dw * dh, 2);
        return {
          prompt: `A classroom wall is ${l} m wide and ${N.fmt(h)} m high. A door ${N.fmt(dw)} m wide and ${N.fmt(dh)} m high is not painted. What area gets painted?`,
          answer: numAns(A, 'm²'),
          hint: 'Whole wall area first, then take the door area off.',
          steps: [
            stepOf('Wall area', N.round(l * h, 2), 'm²', 'width × height'),
            stepOf('Door area', N.round(dw * dh, 2), 'm²', 'width × height'),
          ],
          working: [
            `Wall: ${l} × ${N.fmt(h)} = ${N.fmt(N.round(l * h, 2))} m².`,
            `Door: ${N.fmt(dw)} × ${N.fmt(dh)} = ${N.fmt(N.round(dw * dh, 2))} m².`,
            `${N.fmt(N.round(l * h, 2))} − ${N.fmt(N.round(dw * dh, 2))} = ${N.fmt(A)}.`,
            `<b>${N.fmt(A)} m²</b> to paint.`,
          ],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'turf3': {
        const W = R.int(6, 12), H = R.int(4, 8), w = R.int(2, W - 3), h = R.int(1, H - 2);
        const cost = R.pick([12, 15, 20, 25, 30]);
        const A = W * H - w * h, total = A * cost;
        return {
          prompt: `An L-shaped lawn is a ${W} m by ${H} m rectangle with a ${w} m by ${h} m corner taken out for a shed. Turf costs $${cost} per square metre. What does it cost to turf the lawn?`,
          visual: lSvg(W, H, w, h, 'm'),
          answer: numAns(total, '$'),
          hint: 'Big rectangle minus the corner gives the area. Then multiply the area by the price per m².',
          steps: [
            stepOf('Big rectangle area', W * H, 'm²', 'length × width'),
            stepOf('Corner cut out', w * h, 'm²', 'length × width of the missing piece'),
            stepOf('Lawn area', A, 'm²', 'big rectangle minus the corner'),
          ],
          working: [
            `Big rectangle: ${W} × ${H} = ${W * H} m².`,
            `Corner taken out: ${w} × ${h} = ${w * h} m².`,
            `Lawn area: ${W * H} − ${w * h} = ${A} m².`,
            `Cost: ${A} × $${cost} = $${N.fmt(total)}.`,
            `<b>$${N.fmt(total)}</b>.`,
          ],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'trapSection': {
        const a = R.int(4, 12), b = a + R.int(2, 10), h = R.int(4, 12);
        const A = N.round((a + b) * h / 2, 2);
        return {
          prompt: `A section of land is a trapezium. The two parallel sides are ${a} m and ${b} m, and the distance between them is ${h} m. What is the area of the section?`,
          visual: trapSvg(a, b, h, 'm', slantFor(a, b, h)),
          answer: numAns(A, 'm²'),
          hint: 'Average the two parallel sides, then multiply by the distance between them. Ignore the slanted side.',
          steps: [stepOf('Average of the parallel sides', N.round((a + b) / 2, 2), 'm', '(a + b) ÷ 2')],
          working: [`Average the parallel sides: (${a} + ${b}) ÷ 2 = ${N.fmt((a + b) / 2)} m.`, `Multiply by the height: ${N.fmt((a + b) / 2)} × ${h} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} m²</b>.`],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'trapDeck': {
        const a = R.int(3, 8), b = a + R.int(2, 8), h = R.int(3, 8), cost = R.pick([60, 80, 90, 120]);
        const A = N.round((a + b) * h / 2, 2), total = N.round(A * cost, 2);
        return {
          prompt: `${name}'s family builds a deck shaped like a trapezium. The parallel sides are ${a} m and ${b} m and the height is ${h} m. Decking costs $${cost} per square metre. What is the total cost?`,
          visual: trapSvg(a, b, h, 'm', slantFor(a, b, h)),
          answer: numAns(total, '$'),
          hint: 'Find the trapezium area first: average the parallel sides, then times the height. Then multiply by the price.',
          steps: [
            stepOf('Average of the parallel sides', N.round((a + b) / 2, 2), 'm', '(a + b) ÷ 2'),
            stepOf('Trapezium area', A, 'm²', 'average × height'),
          ],
          working: [`Average: (${a} + ${b}) ÷ 2 = ${N.fmt((a + b) / 2)} m.`, `Area = ${N.fmt((a + b) / 2)} × ${h} = ${N.fmt(A)} m².`, `${N.fmt(A)} × $${cost} = $${N.fmt(total)}.`, `<b>$${N.fmt(total)}</b>.`],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'kiteWord': {
        const d1 = R.int(4, 12) * 5, d2 = R.int(6, 16) * 5;
        const A = N.round(d1 * d2 / 2, 2);
        return {
          prompt: `${name} makes a kite for the beach. Its two diagonals are ${d1} cm and ${d2} cm. How much fabric is needed to cover the kite?`,
          visual: kiteSvg(d1, d2, 'cm', true),
          answer: numAns(A, 'cm²'),
          hint: 'Area of a kite = ½ × one diagonal × the other diagonal.',
          steps: [stepOf('Both diagonals multiplied together', d1 * d2, 'cm²', 'before halving')],
          working: [`Area = ½ × ${d1} × ${d2}.`, `${d1} × ${d2} = ${N.fmt(d1 * d2)}, and half of that is ${N.fmt(A)}.`, `<b>${N.fmt(A)} cm²</b> of fabric.`],
          finalAnswer: `${N.fmt(A)} cm²`,
        };
      }
      case 'pathPave': {
        const l = R.int(5, 12), w = R.int(3, 8), p = R.pick([1, 1, 2, 0.5]);
        const what = R.pick(['pool', 'pond', 'vege garden']);
        const OL = N.round(l + 2 * p, 2), OW = N.round(w + 2 * p, 2);
        const A = N.round(OL * OW - l * w, 2);
        return {
          prompt: `A rectangular ${what} is ${l} m by ${w} m. A concrete path ${N.fmt(p)} m wide is laid all the way around it. What area of concrete is needed?`,
          visual: shadedPathSvg(l, w, p, 'm', what),
          answer: numAns(A, 'm²'),
          hint: `The path goes on <b>both</b> sides, so the outside rectangle is ${N.fmt(2 * p)} m longer and ${N.fmt(2 * p)} m wider.`,
          steps: [
            stepOf('Outside rectangle area', N.round(OL * OW, 2), 'm²', `(${l} + ${N.fmt(2 * p)}) × (${w} + ${N.fmt(2 * p)})`),
            stepOf(`The ${what}'s own area`, N.round(l * w, 2), 'm²', 'length × width'),
          ],
          working: [
            `Outside rectangle: ${l} + ${N.fmt(2 * p)} = ${N.fmt(OL)} m by ${w} + ${N.fmt(2 * p)} = ${N.fmt(OW)} m.`,
            `Whole outside area: ${N.fmt(OL)} × ${N.fmt(OW)} = ${N.fmt(OL * OW)} m².`,
            `The ${what}: ${l} × ${w} = ${N.fmt(l * w)} m².`,
            `Path = ${N.fmt(OL * OW)} − ${N.fmt(l * w)} = ${N.fmt(A)}.`,
            `<b>${N.fmt(A)} m²</b> of concrete.`,
          ],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'borderMat': {
        const l = R.int(20, 40), w = R.int(15, 30), b = R.pick([5, 10]);
        const L = l + 2 * b, W = w + 2 * b;
        const A = L * W - l * w;
        return {
          prompt: `A photo ${l} cm by ${w} cm is put in a frame with a card border ${b} cm wide all the way around it. What is the area of the card border?`,
          visual: shadedRectSvg(L, W, l, w, 'cm'),
          answer: numAns(A, 'cm²'),
          hint: 'Work out the whole frame area, then take off the photo area. The border adds to both ends of each side.',
          steps: [
            stepOf('Whole frame area', L * W, 'cm²', 'the border adds to both ends of each side'),
            stepOf('Photo area', l * w, 'cm²', 'length × width'),
          ],
          working: [
            `Whole frame: ${l} + ${2 * b} = ${L} cm by ${w} + ${2 * b} = ${W} cm.`,
            `Frame area: ${L} × ${W} = ${N.fmt(L * W)} cm².`,
            `Photo: ${l} × ${w} = ${N.fmt(l * w)} cm².`,
            `Border = ${N.fmt(L * W)} − ${N.fmt(l * w)} = ${N.fmt(A)}.`,
            `<b>${N.fmt(A)} cm²</b> of card.`,
          ],
          finalAnswer: `${N.fmt(A)} cm²`,
        };
      }
      case 'lPaddock': {
        const W = R.int(9, 16), H = R.int(6, 12), w = R.int(2, W - 4), h = R.int(2, H - 2);
        const P = 2 * (W + H);
        return {
          prompt: `${name}'s paddock is L-shaped. Two of its sides are not marked on the plan. Work them out, then find how many metres of fence go all the way around the paddock.`,
          visual: lSvg(W, H, w, h, 'm', { corner: R.pick(['tr', 'tl', 'br', 'bl']), hide: ['top', 'right'] }),
          answer: numAns(P, 'm'),
          hint: 'A missing side is the long side minus the piece that was cut out. Find both, then add all six sides.',
          steps: [
            stepOf('Missing side 1', W - w, 'm', 'the long side minus the piece cut out'),
            stepOf('Missing side 2', H - h, 'm', 'the other long side minus the piece cut out'),
          ],
          working: [
            `Missing side 1: ${W} − ${w} = ${W - w} m.`,
            `Missing side 2: ${H} − ${h} = ${H - h} m.`,
            `Now go right round: ${W - w} + ${h} + ${w} + ${H - h} + ${W} + ${H} = ${P}.`,
            `<b>${P} m</b> of fence.`,
          ],
          finalAnswer: `${P} m`,
        };
      }
      case 'fence1': {
        const l = R.int(10, 40), w = R.int(5, 30);
        const P = 2 * (l + w);
        return {
          prompt: `A rectangular paddock is ${l} m long and ${w} m wide. How many metres of fence are needed to go all the way around it?`,
          answer: numAns(P, 'm'),
          hint: 'Fencing goes around the edge: that is the perimeter.',
          working: [`Perimeter = 2 × (${l} + ${w}).`, `= 2 × ${l + w} = ${P}.`, `<b>${P} m</b> of fence.`],
          finalAnswer: `${P} m`,
        };
      }
      case 'fence2': {
        const l = R.int(12, 60), w = R.int(8, 40), cost = R.pick([5, 8, 10, 12, 15]);
        const P = 2 * (l + w), total = P * cost;
        return {
          prompt: `${name}'s family fences a ${l} m by ${w} m rectangular paddock. Fencing costs $${cost} per metre. What is the total cost?`,
          answer: numAns(total, '$'),
          hint: 'Find the perimeter first, then multiply by the cost per metre.',
          steps: [stepOf('Perimeter', P, 'm', '2 × (length + width)')],
          working: [`Perimeter = 2 × (${l} + ${w}) = ${P} m.`, `${P} × $${cost} = $${N.fmt(total)}.`, `Total cost: <b>$${N.fmt(total)}</b>.`],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'fence3': {
        const l = R.int(15, 60), w = R.int(8, 40), gate = R.int(2, 5);
        const P = 2 * (l + w) - gate;
        return {
          prompt: `A rectangular paddock is ${l} m by ${w} m. It is fenced all the way around except for a ${gate} m gap for a gate. How many metres of fencing are needed?`,
          answer: numAns(P, 'm'),
          hint: 'Find the full perimeter, then take away the gate gap.',
          steps: [stepOf('Full perimeter (before the gate)', 2 * (l + w), 'm', '2 × (length + width)')],
          working: [`Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} m.`, `Take away the gate: ${2 * (l + w)} − ${gate} = ${P}.`, `<b>${P} m</b> of fencing.`],
          finalAnswer: `${P} m`,
        };
      }
      case 'carpet1': {
        const l = R.int(3, 8), w = R.int(2, 6);
        return {
          prompt: `${name}'s bedroom floor is ${l} m long and ${w} m wide. How many square metres of carpet are needed to cover it?`,
          answer: numAns(l * w, 'm²'),
          hint: 'Covering a floor means area: length × width.',
          working: [`Area = ${l} × ${w} = ${l * w}.`, `<b>${l * w} m²</b> of carpet.`],
          finalAnswer: `${l * w} m²`,
        };
      }
      case 'carpet2': {
        const l = R.int(3, 7) + 0.5, w = R.int(2, 5) + (R.chance(0.5) ? 0.5 : 0);
        const A = N.round(l * w, 2);
        return {
          prompt: `A lounge is ${N.fmt(l)} m by ${N.fmt(w)} m. How many square metres of carpet are needed?`,
          answer: numAns(A, 'm²'),
          hint: 'Area = length × width. Multiply carefully with the decimals.',
          working: [`Area = ${N.fmt(l)} × ${N.fmt(w)}.`, `= ${N.fmt(A)}.`, `<b>${N.fmt(A)} m²</b>.`],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'carpet3': {
        const l = R.int(4, 8), w = R.int(3, 6), cost = R.pick([30, 40, 45, 50, 60]);
        const A = l * w, total = A * cost;
        return {
          prompt: `A classroom floor is ${l} m by ${w} m. Carpet costs $${cost} per square metre. How much will it cost to carpet the whole room?`,
          answer: numAns(total, '$'),
          hint: 'Find the area first, then multiply by the price per m².',
          steps: [stepOf('Floor area', A, 'm²', 'length × width')],
          working: [`Area = ${l} × ${w} = ${A} m².`, `${A} × $${cost} = $${N.fmt(total)}.`, `<b>$${N.fmt(total)}</b>.`],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'wall1': {
        const l = R.int(3, 8), h = R.int(2, 4);
        return {
          prompt: `A wall is ${l} m long and ${h} m high. What is the area of the wall to be painted?`,
          answer: numAns(l * h, 'm²'),
          hint: 'A wall is a rectangle: length × height.',
          working: [`Area = ${l} × ${h} = ${l * h}.`, `<b>${l * h} m²</b>.`],
          finalAnswer: `${l * h} m²`,
        };
      }
      case 'wall2': {
        const l = R.int(4, 9), h = R.pick([2.4, 2.5, 3, 2.7]);
        const A = N.round(l * h, 2);
        return {
          prompt: `A bedroom wall is ${l} m wide and ${N.fmt(h)} m high. How many square metres will ${name} need to paint?`,
          answer: numAns(A, 'm²'),
          hint: 'Area = width × height.',
          working: [`Area = ${l} × ${N.fmt(h)} = ${N.fmt(A)}.`, `<b>${N.fmt(A)} m²</b>.`],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'wall3': {
        const l = R.int(4, 9), h = R.pick([2.5, 3]), wl = R.int(1, 2) + (R.chance(0.5) ? 0.5 : 0), wh = R.pick([1, 1.5, 2]);
        const A = N.round(l * h - wl * wh, 2);
        return {
          prompt: `A wall is ${l} m wide and ${N.fmt(h)} m high. It has a window ${N.fmt(wl)} m by ${N.fmt(wh)} m that will not be painted. What area needs painting?`,
          answer: numAns(A, 'm²'),
          hint: 'Find the whole wall area, then take away the window area.',
          steps: [
            stepOf('Whole wall area', N.round(l * h, 2), 'm²', 'width × height'),
            stepOf('Window area', N.round(wl * wh, 2), 'm²', 'width × height'),
          ],
          working: [`Wall: ${l} × ${N.fmt(h)} = ${N.fmt(l * h)} m².`, `Window: ${N.fmt(wl)} × ${N.fmt(wh)} = ${N.fmt(wl * wh)} m².`, `${N.fmt(l * h)} − ${N.fmt(wl * wh)} = ${N.fmt(A)}.`, `<b>${N.fmt(A)} m²</b> to paint.`],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'netball': {
        const l = R.pick([30.5, 30, 28, 32]), w = R.pick([15.25, 15, 14, 16]);
        const P = N.round(2 * (l + w), 2);
        return {
          prompt: `The netball court at ${name}'s school is a rectangle ${N.fmt(l)} m long and ${N.fmt(w)} m wide. What is the perimeter of the court?`,
          answer: numAns(P, 'm'),
          hint: 'Perimeter = 2 × (length + width).',
          working: [`${N.fmt(l)} + ${N.fmt(w)} = ${N.fmt(l + w)}.`, `2 × ${N.fmt(l + w)} = ${N.fmt(P)}.`, `Perimeter = <b>${N.fmt(P)} m</b>.`],
          finalAnswer: `${N.fmt(P)} m`,
        };
      }
      case 'netball3': {
        const laps = R.int(2, 6), l = R.pick([30.5, 30, 28, 32]), w = R.pick([15.25, 15, 14, 16]);
        const P = N.round(2 * (l + w), 2), d = N.round(P * laps, 2);
        return {
          prompt: `A netball court is ${N.fmt(l)} m by ${N.fmt(w)} m. At training ${name} jogs ${laps} laps around the outside of the court. How far is that?`,
          answer: numAns(d, 'm'),
          hint: 'One lap is the perimeter. Multiply by the number of laps.',
          steps: [stepOf('Perimeter (one lap)', P, 'm', '2 × (length + width)')],
          working: [`Perimeter = 2 × (${N.fmt(l)} + ${N.fmt(w)}) = ${N.fmt(P)} m.`, `${laps} × ${N.fmt(P)} = ${N.fmt(d)}.`, `<b>${N.fmt(d)} m</b>.`],
          finalAnswer: `${N.fmt(d)} m`,
        };
      }
      case 'rugby': {
        const l = R.pick([100, 94, 96, 90]), w = R.pick([70, 68, 65, 60]);
        const isA = R.chance(0.5);
        const A = l * w, P = 2 * (l + w);
        return {
          prompt: isA ? `A rugby field is ${l} m long and ${w} m wide. What is the area of the field?` : `A rugby field is ${l} m long and ${w} m wide. The team runs once around the edge as a warm-up. How far do they run?`,
          answer: numAns(isA ? A : P, isA ? 'm²' : 'm'),
          hint: isA ? 'Area = length × width.' : 'Around the edge = perimeter.',
          working: isA ? [`${l} × ${w} = ${N.fmt(A)}.`, `Area = <b>${N.fmt(A)} m²</b>.`] : [`2 × (${l} + ${w}) = 2 × ${l + w} = ${P}.`, `<b>${P} m</b>.`],
          finalAnswer: isA ? `${N.fmt(A)} m²` : `${P} m`,
        };
      }
      case 'sail': {
        const b = R.int(2, 6), h = R.int(3, 8);
        const A = N.round(b * h / 2, 2);
        return {
          prompt: `A triangular sail has a base of ${b} m and a height of ${h} m. What is the area of the sail?`,
          answer: numAns(A, 'm²'),
          hint: 'Triangle area = ½ × base × height.',
          working: [`½ × ${b} × ${h} = ½ × ${b * h} = ${N.fmt(A)}.`, `<b>${N.fmt(A)} m²</b>.`],
          finalAnswer: `${N.fmt(A)} m²`,
        };
      }
      case 'sail3': {
        const b = R.int(4, 10), h = R.int(3, 8), cost = R.pick([20, 25, 30, 40]);
        const A = b * h / 2, total = N.round(A * cost, 2);
        return {
          prompt: `A triangular garden bed has a base of ${b} m and a height of ${h} m. Bark costs $${cost} per square metre. How much does it cost to cover the whole bed?`,
          answer: numAns(total, '$'),
          hint: 'Find the triangle area first (½ × base × height), then multiply by the cost.',
          steps: [stepOf('Triangle area', N.round(A, 2), 'm²', '½ × base × height')],
          working: [`Area = ½ × ${b} × ${h} = ${N.fmt(A)} m².`, `${N.fmt(A)} × $${cost} = $${N.fmt(total)}.`, `<b>$${N.fmt(total)}</b>.`],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'deck': {
        const W = R.int(6, 12), H = R.int(4, 8), w = R.int(2, W - 3), h = R.int(1, H - 2);
        const A = W * H - w * h;
        return {
          prompt: `A deck is an L-shape: a ${W} m by ${H} m rectangle with a ${w} m by ${h} m corner cut out for a tree. What is the area of the deck?`,
          visual: lSvg(W, H, w, h, 'm'),
          answer: numAns(A, 'm²'),
          hint: 'Big rectangle area minus the cut-out corner.',
          steps: [
            stepOf('Big rectangle area', W * H, 'm²', 'length × width'),
            stepOf('Cut-out area', w * h, 'm²', 'length × width of the missing piece'),
          ],
          working: [`Big rectangle: ${W} × ${H} = ${W * H}.`, `Cut-out: ${w} × ${h} = ${w * h}.`, `${W * H} − ${w * h} = ${A}.`, `<b>${A} m²</b>.`],
          finalAnswer: `${A} m²`,
        };
      }
      default: { // garden1: square
        const s = R.int(2, 9);
        const isP = R.chance(0.5);
        return {
          prompt: isP ? `A square vegetable garden has sides of ${s} m. How much edging is needed to go around it?` : `A square sandpit has sides of ${s} m. What is its area?`,
          answer: numAns(isP ? 4 * s : s * s, isP ? 'm' : 'm²'),
          hint: isP ? 'Perimeter of a square = 4 × side.' : 'Area of a square = side × side.',
          working: isP ? [`4 × ${s} = ${4 * s}.`, `<b>${4 * s} m</b>.`] : [`${s} × ${s} = ${s * s}.`, `<b>${s * s} m²</b>.`],
          finalAnswer: isP ? `${4 * s} m` : `${s * s} m²`,
        };
      }
    }
  }

  HL.registerTopic({
    id: 'perimeter-area', subject: 'maths', strand: 'measurement', order: 2,
    name: 'Perimeter & area', short: 'Perimeter & area',
    blurb: 'Distance around a shape, and the space inside it.',
    example: 'Rectangle 6 × 4: P = 20, A = 24 &nbsp;·&nbsp; Triangle: ½ × b × h',
    animal: 'bunny',
    learn: (() => {
      const INK = '#4A3B48', BLUE = '#2A6FA5', ROSE = '#E0568C', GREEN = '#2FA97A';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // a grid of unit squares (cell size c); numbered = write 1, 2, 3 … in the squares
      const grid = (x0, y0, cols, rows, c, fill, numbered) => Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, k) => `<rect x="${x0 + k * c}" y="${y0 + r * c}" width="${c}" height="${c}" fill="${fill}" stroke="${INK}" stroke-width=".8" opacity=".95"/>${numbered ? `<text x="${x0 + k * c + c / 2}" y="${y0 + r * c + c / 2 + 5}" text-anchor="middle" fill="${INK}">${r * cols + k + 1}</text>` : ''}`).join('')).join('');
      return {
      what: '<p><b>Perimeter</b> is the distance all the way <b>around</b> the outside of a shape — like the skirting board around the edge of a room. It is a length (cm, m).</p><p><b>Area</b> is the amount of flat space <b>inside</b> a shape — like the tiles covering the floor. It is measured in squares (cm², m²).</p>',
      visual: SVG(360, 220, `
        ${grid(20, 44, 6, 4, 22, '#A9D8F5', true)}
        <rect x="20" y="44" width="132" height="88" fill="none" stroke="${ROSE}" stroke-width="4"/>
        <text x="86" y="34" text-anchor="middle" fill="${BLUE}">6 cm</text><text x="160" y="93" fill="${BLUE}">4 cm</text>
        <text x="20" y="158" fill="${BLUE}">Area = 6 × 4 = 24 cm²</text>
        <text x="20" y="176" fill="${BLUE}">(count the squares: 24)</text>
        <text x="20" y="204" fill="${ROSE}">Perimeter = 6+4+6+4 = 20 cm</text>
        <text x="270" y="34" text-anchor="middle" fill="${INK}">½ of a rectangle</text>
        ${grid(226, 50, 4, 3, 22, '#FFFFFF', false)}
        <polygon points="226,116 314,116 314,50" fill="#F9A8C9" stroke="none" opacity=".9"/>
        <rect x="226" y="50" width="88" height="66" fill="none" stroke="${INK}" stroke-width="1.5"/>
        <line x1="226" y1="116" x2="314" y2="50" stroke="${INK}" stroke-width="2.5"/>
        <text x="270" y="134" text-anchor="middle" fill="${BLUE}">4 cm</text><text x="320" y="88" fill="${ROSE}">3 cm</text>
        <text x="226" y="160" fill="${INK}">Area = ½ × 4 × 3</text>
        <text x="226" y="180" fill="${GREEN}">= 6 cm²</text>`),
      facts: [
        'Perimeter = <b>add all the sides</b> (the distance around)',
        'Rectangle area = <b>length × width</b>',
        'Triangle area = <b>½ × base × height</b>',
        'Parallelogram = <b>base × height</b>',
        'Trapezium = <b>average the two parallel sides, then × the height</b> &nbsp;·&nbsp; ½ × (a + b) × h',
        'Rhombus or kite = <b>½ × diagonal × diagonal</b>',
        'Shaded part = <b>big shape − small shape</b>',
        'Composite shape: <b>split into rectangles and add</b>, or take the missing piece off the whole rectangle',
        'On a grid: <b>whole squares + (half squares ÷ 2)</b>',
        'Height is always at <b>right angles</b> to the base — never the slanted side',
        'Area units are <b>squared</b> (cm², m²); perimeter units are not',
      ],
      steps: [
        '<b>Perimeter</b>: say "all the way around" and add every side. Rectangle: 2 × (length + width). Square: 4 × side.',
        '<b>Rectangle area</b>: say "rows of squares" → length × width. <b>Square</b>: side × side.',
        '<b>Triangle area</b>: say "half a rectangle" → ½ × base × height. The height is the <b>straight-up</b> dashed line, not the slanted side.',
        '<b>Parallelogram</b>: base × height (a pushed-over rectangle). <b>Trapezium</b>: say "<b>average the two parallel sides, then times the height</b>" — the slanted side is never used.',
        '<b>Rhombus and kite</b>: ½ × one diagonal × the other diagonal (it fills exactly half of the rectangle it fits inside).',
        '<b>Composite shapes</b> (L-shapes, plus shapes, a rectangle with a corner cut out): <b>split into rectangles and add</b>, or take the missing piece off the whole rectangle. For the <b>perimeter</b>, work out any unlabelled side first by subtracting, then walk right round the outside.',
        '<b>Shaded area</b>: work out the <b>big</b> shape, work out the <b>small</b> shape inside it, then <b>subtract</b>. Big − small.',
        '<b>On a grid</b>: count the whole squares inside, count the half squares, and remember two halves make one whole.',
      ],
      examples: [
        { q: 'Perimeter of a 7 cm by 4 cm rectangle', working: ['<b>Picture:</b> a tiled floor. Perimeter is the skirting board that runs all the way <b>around the edge</b>.', '1. Perimeter or area? Perimeter → I add up the sides.', '2. How many sides does a rectangle have? Four: 7, 4, 7, 4 (opposite sides match).', '7 + 4 + 7 + 4 = 22'], a: '22 cm',
          visual: SVG(360, 140, `<rect x="110" y="30" width="140" height="80" fill="#FFE98A" stroke="${ROSE}" stroke-width="4"/><text x="180" y="20" text-anchor="middle" fill="${ROSE}">7 cm</text><text x="180" y="130" text-anchor="middle" fill="${ROSE}">7 cm</text><text x="100" y="75" text-anchor="end" fill="${ROSE}">4 cm</text><text x="260" y="75" fill="${ROSE}">4 cm</text><text x="180" y="75" text-anchor="middle" fill="${INK}">around the edge</text>`) },
        { q: 'Area of a 7 cm by 4 cm rectangle', working: ['<b>Picture:</b> the same floor: area is the number of <b>tiles inside</b>.', '1. Perimeter or area? Area → I want rows of squares.', '2. How many in a row? 7. How many rows? 4.', '3. 4 rows of 7: 7 × 4.', '7 × 4 = 28'], a: '28 cm²',
          visual: SVG(360, 130, `${grid(80, 24, 7, 4, 20, '#A9D8F5', false)}<text x="150" y="16" text-anchor="middle" fill="${BLUE}">7 cm</text><text x="70" y="69" text-anchor="end" fill="${BLUE}">4 cm</text>${[7, 14, 21, 28].map((n, r) => `<text x="230" y="${39 + r * 20}" fill="${GREEN}">${r === 0 ? '7' : `+ 7 = ${n}`}</text>`).join('')}<text x="150" y="124" text-anchor="middle" fill="${GREEN}">4 rows × 7 = 28 squares</text>`) },
        { q: 'Area of a triangle: base 10 m, height 6 m', working: ['<b>Picture:</b> a triangle is <b>half a rectangle</b> — the 10 × 6 rectangle of tiles, cut along the diagonal.', '1. Which formula? Triangle → ½ × base × height.', '2. Is 6 the straight-up height (not a slanted side)? Yes!', '3. Rectangle first: 10 × 6 = 60.', '4. Then halve it: ½ of 60 = 30'], a: '30 m²',
          visual: SVG(360, 130, `<rect x="40" y="20" width="200" height="90" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4" opacity=".5"/><polygon points="40,110 240,110 150,20" fill="#F9A8C9" stroke="${INK}" stroke-width="2"/><line x1="150" y1="20" x2="150" y2="110" stroke="${ROSE}" stroke-width="3" stroke-dasharray="6 4"/><rect x="150" y="98" width="12" height="12" fill="none" stroke="${ROSE}" stroke-width="1.5"/><text x="140" y="128" text-anchor="middle" fill="${BLUE}">base 10 m</text><text x="158" y="66" fill="${ROSE}">height 6 m</text><text x="262" y="50" fill="${INK}">10 × 6 = 60</text><text x="262" y="74" fill="${GREEN}">½ of 60 = 30</text>`) },
        { q: 'Area of a parallelogram: base 8 cm, height 5 cm (slanted side 6 cm)', working: ['<b>Picture:</b> a rectangle of tiles pushed over sideways — it still covers the same tiles.', '1. Which formula? Parallelogram → base × height.', '2. Which number is the height? The <b>straight-up</b> one, 5 cm. The slanted 6 cm is a trap — I ignore it.', '8 × 5 = 40'], a: '40 cm²',
          visual: SVG(360, 130, `<polygon points="40,110 200,110 260,30 100,30" fill="#C9B8F2" stroke="${INK}" stroke-width="2"/><line x1="100" y1="30" x2="100" y2="110" stroke="${ROSE}" stroke-width="3" stroke-dasharray="6 4"/><rect x="100" y="98" width="12" height="12" fill="none" stroke="${ROSE}" stroke-width="1.5"/><text x="120" y="128" text-anchor="middle" fill="${BLUE}">base 8 cm</text><text x="106" y="74" fill="${ROSE}">height 5 cm</text><text x="232" y="78" fill="${INK}" opacity=".6">6 cm = a trap ✗</text><text x="270" y="24" fill="${GREEN}">8 × 5 = 40</text>`) },
        { q: 'A rectangle has area 45 cm² and length 9 cm. Find the width.', working: ['<b>Picture:</b> 45 tiles laid in rows of 9 — how many rows?', '1. What do I know? area = 45, length = 9. length × width = area.', '2. So 9 × ? = 45. To undo × 9, I ÷ 9.', '45 ÷ 9 = 5'], a: '5 cm' },
        { q: 'Harper\'s vege garden is L-shaped (see picture). What is its area?', working: ['<b>Picture:</b> tiles again — an L-shape is just two rectangles of tiles stuck together.', '1. Can I use one formula? No, so I <b>split</b> it into rectangle A and rectangle B.', '2. A: 4 × 3 = 12 m².', '3. B: 8 × 3 = 24 m².', '4. Add them: 12 + 24 = 36'], a: '36 m²',
          visual: SVG(360, 140, `<rect x="46" y="20" width="64" height="48" fill="#A6E3B8" stroke="${INK}" stroke-width="2"/><rect x="46" y="68" width="128" height="48" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/><polygon points="46,20 110,20 110,68 174,68 174,116 46,116" fill="none" stroke="${INK}" stroke-width="2.5"/><text x="78" y="49" text-anchor="middle" fill="${INK}">A</text><text x="110" y="97" text-anchor="middle" fill="${INK}">B</text><text x="78" y="12" text-anchor="middle" fill="${BLUE}">4 m</text><text x="40" y="49" text-anchor="end" fill="${BLUE}">3 m</text><text x="40" y="97" text-anchor="end" fill="${BLUE}">3 m</text><text x="110" y="134" text-anchor="middle" fill="${BLUE}">8 m</text><text x="200" y="44" fill="${GREEN}">A = 4 × 3 = 12 m²</text><text x="200" y="74" fill="${BLUE}">B = 8 × 3 = 24 m²</text><text x="200" y="106" fill="${INK}">12 + 24 = 36 m²</text>`) },
        { q: 'Area of a trapezium: parallel sides 6 cm and 10 cm, height 4 cm (slanted side 5 cm)', working: ['<b>Picture:</b> a trapezium is a rectangle with its top squashed in. One parallel side is too short and the other too long, so I use the one in the <b>middle</b> — the average.', '1. Which formula? Trapezium → <b>average the parallel sides, then × the height</b>.', '2. Which two sides are parallel? The 6 and the 10 (the flat top and bottom).', '3. Is 5 the height? <b>No</b> — it is the slanted side, a trap. The height is the straight-up 4.', '4. Average: (6 + 10) ÷ 2 = 8.', '5. Times the height: 8 × 4 = 32'], a: '32 cm²',
          visual: SVG(360, 156, `<polygon points="24,128 204,128 172,46 88,46" fill="#A6E3B8" stroke="${INK}" stroke-width="2"/><line x1="114" y1="46" x2="114" y2="128" stroke="${ROSE}" stroke-width="3" stroke-dasharray="6 4"/><rect x="114" y="116" width="12" height="12" fill="none" stroke="${ROSE}" stroke-width="1.5"/><text x="130" y="38" text-anchor="middle" fill="${BLUE}">6 cm</text><text x="114" y="148" text-anchor="middle" fill="${BLUE}">10 cm</text><text x="122" y="92" fill="${ROSE}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px">4 cm</text><line x1="46" y1="38" x2="58" y2="84" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/><text x="6" y="34" fill="${INK}" opacity=".6" font-size="12">5 cm not used</text><text x="214" y="58" fill="${INK}">(6 + 10) ÷ 2 = 8</text><text x="214" y="84" fill="${BLUE}">the average side</text><text x="214" y="118" fill="${GREEN}" font-size="15">8 × 4 = 32 cm²</text>`) },
        { q: 'Perimeter of this L-shape. Two sides are not labelled.', working: ['<b>Picture:</b> a fence going right round a paddock. I cannot walk along a side I do not know, so I work the missing ones out first.', '1. Which sides are missing? The <b>top</b> one and the <b>right-hand</b> one (marked ?).', '2. Top: the whole bottom is 10 and the piece cut out is 4, so top = 10 − 4 = <b>6</b>.', '3. Right: the whole left side is 7 and the notch is 3 deep, so right = 7 − 3 = <b>4</b>.', '4. Now walk right round: 6 + 3 + 4 + 4 + 10 + 7 = 34'], a: '34 cm',
          visual: SVG(360, 162, `<polygon points="40,22 136,22 136,70 200,70 200,134 40,134" fill="#FFC79A" stroke="${INK}" stroke-width="2.5"/><text x="88" y="16" text-anchor="middle" fill="${ROSE}" font-size="17">?</text><text x="212" y="108" fill="${ROSE}" font-size="17">?</text><text x="120" y="154" text-anchor="middle" fill="${BLUE}">10 cm</text><text x="32" y="82" text-anchor="end" fill="${BLUE}">7 cm</text><text x="144" y="52" fill="${BLUE}">3 cm</text><text x="168" y="90" text-anchor="middle" fill="${BLUE}">4 cm</text><text x="236" y="30" fill="${INK}">top = 10 − 4 = <tspan fill="${GREEN}">6</tspan></text><text x="236" y="56" fill="${INK}">right = 7 − 3 = <tspan fill="${GREEN}">4</tspan></text><text x="236" y="90" fill="${ROSE}">6+3+4+4</text><text x="236" y="112" fill="${ROSE}">+10+7</text><text x="236" y="142" fill="${GREEN}" font-size="16">= 34 cm</text>`) },
        { q: 'A circle just fits inside a 10 cm square. Find the shaded area. Use π = 3.14.', working: ['<b>Picture:</b> a round pizza in a square box. The shaded part is the cardboard you can still see in the <b>four corners</b>.', '1. What is shaded? The square <b>minus</b> the circle. Big − small.', '2. Square: 10 × 10 = 100 cm².', '3. The circle touches all four sides, so its diameter is 10, and r = 10 ÷ 2 = 5.', '4. Circle: 3.14 × 5² = 3.14 × 25 = 78.5 cm².', '5. Shaded: 100 − 78.5 = 21.5'], a: '21.5 cm²',
          visual: SVG(360, 162, `<rect x="40" y="20" width="110" height="110" fill="#F9A8C9" stroke="${INK}" stroke-width="2"/><circle cx="95" cy="75" r="55" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/><line x1="40" y1="75" x2="150" y2="75" stroke="${ROSE}" stroke-width="2.5"/><text x="95" y="68" text-anchor="middle" fill="${ROSE}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px">d = 10</text><text x="95" y="148" text-anchor="middle" fill="${BLUE}">10 cm</text><rect x="166" y="138" width="14" height="12" fill="#F9A8C9" stroke="${INK}" stroke-width="1"/><text x="186" y="148" fill="#B03060" font-size="12">= the shaded part</text><text x="172" y="42" fill="${INK}">square 10 × 10 = 100</text><text x="172" y="70" fill="${BLUE}">r = 5, so 3.14 × 25</text><text x="172" y="92" fill="${BLUE}">circle = 78.5</text><text x="172" y="126" fill="${GREEN}" font-size="15">100 − 78.5 = 21.5 cm²</text>`) },
        { q: 'Area of a rhombus with diagonals 8 cm and 6 cm', working: ['<b>Picture:</b> the rhombus fits exactly inside an 8 by 6 rectangle, corner to corner, and fills exactly <b>half</b> of it.', '1. Which formula? Rhombus (or kite) → ½ × diagonal × diagonal.', '2. Do the rectangle first: 8 × 6 = 48.', '3. Now halve it: 48 ÷ 2 = 24'], a: '24 cm²',
          visual: SVG(360, 150, `<rect x="50" y="30" width="160" height="90" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 4" opacity=".7"/><polygon points="130,30 210,75 130,120 50,75" fill="#C9B8F2" stroke="${INK}" stroke-width="2"/><line x1="50" y1="75" x2="210" y2="75" stroke="${ROSE}" stroke-width="2.5" stroke-dasharray="6 4"/><line x1="130" y1="30" x2="130" y2="120" stroke="${ROSE}" stroke-width="2.5" stroke-dasharray="6 4"/><text x="86" y="62" text-anchor="middle" fill="${ROSE}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px">8 cm</text><text x="140" y="108" fill="${ROSE}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:4px">6 cm</text><text x="130" y="142" text-anchor="middle" fill="${INK}" opacity=".65">the 8 by 6 rectangle</text><text x="228" y="48" fill="${INK}">8 × 6 = 48</text><text x="228" y="76" fill="${BLUE}">half of it:</text><text x="228" y="100" fill="${BLUE}">48 ÷ 2</text><text x="228" y="128" fill="${GREEN}" font-size="15">= 24 cm²</text>`) },
        { q: 'This shape is drawn on a 1 cm grid. Find its area by counting squares.', working: ['<b>Picture:</b> floor tiles again — but along the slanted edge each tile is only <b>half</b> covered.', '1. How many squares are <b>completely</b> inside? Count them: 6.', '2. How many are <b>half</b> covered? 4.', '3. Two halves make one whole, so 4 halves = 4 ÷ 2 = 2 whole squares.', '4. Add them: 6 + 2 = 8'], a: '8 cm²',
          visual: SVG(360, 160, `${Array.from({ length: 5 }, (_, i) => `<line x1="30" y1="${20 + i * 26}" x2="134" y2="${20 + i * 26}" stroke="#C9B8F2" stroke-width="1"/><line x1="${30 + i * 26}" y1="20" x2="${30 + i * 26}" y2="124" stroke="#C9B8F2" stroke-width="1"/>`).join('')}<polygon points="30,20 30,124 134,124" fill="#F9A8C9" fill-opacity=".72" stroke="${INK}" stroke-width="2.5"/>${[0, 1, 2, 3].map((k) => [0, 1, 2, 3].map((r) => (r >= k + 1 ? `<text x="${43 + k * 26}" y="${38 + r * 26}" text-anchor="middle" fill="${INK}" font-size="12">${'123456'[[0, 1, 2, 3].slice(0, k).reduce((s, j) => s + (3 - j), 0) + (r - k - 1)]}</text>` : r === k ? `<text x="${38 + k * 26}" y="${43 + r * 26}" text-anchor="middle" fill="${ROSE}" font-size="12">½</text>` : '')).join('')).join('')}<text x="30" y="148" fill="${INK}" font-size="11">each square is 1 cm × 1 cm</text><text x="152" y="46" fill="${INK}">6 whole squares</text><text x="152" y="72" fill="${ROSE}">+ 4 half squares</text><text x="152" y="98" fill="${BLUE}">4 halves = 2 wholes</text><text x="152" y="128" fill="${GREEN}" font-size="15">6 + 2 = 8 cm²</text>`) },
      ],
      tips: [
        'Perimeter = <b>fence</b> around the outside. Area = <b>carpet</b> (tiles) covering the inside.',
        'Area answers always have a <b>squared</b> unit (cm², m²). Perimeter answers do not.',
        'Triangle: do not forget the <b>½</b>! Multiply base × height, then halve it.',
        'On an L-shape, work out the missing side lengths first by subtracting.',
        'A trapezium never uses the <b>slanted</b> side. If a question gives you one, it is there to catch you out.',
        'Shaded questions are always <b>big − small</b>. Work out both areas properly, write them down, then subtract.',
        'A path or border goes round <b>both</b> sides, so it adds <b>twice</b> its width to the length and twice to the width.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
