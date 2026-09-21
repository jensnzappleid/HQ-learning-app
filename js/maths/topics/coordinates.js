/* Topic: Coordinates & graphs (reading points on a 4-quadrant grid, quadrants, tables of values, points on lines, midpoints, distances) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = N.fmt;

  /* ---------- SVG grid: -6..6 on both axes, viewBox 320×220 ---------- */
  const CELL = 15, OX = 160, OY = 105;
  const px = (x) => OX + x * CELL, py = (y) => OY - y * CELL;
  const COLOURS = ['#E0568C', '#4A3B48', '#7C5CBF', '#D98A3A'];
  /**
   * points: [{x, y, label, colour?}]; opts.segment: [p1, p2] draws a dashed line between two points;
   * opts.line: {m, c} draws y = mx + c (clipped to the grid)
   */
  function grid(points, opts = {}) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="coordinate grid" style="max-width:100%;height:auto">`;
    s += `<rect x="0" y="0" width="320" height="220" fill="#FFFDF8" rx="8"/>`;
    for (let i = -6; i <= 6; i++) {
      s += `<line x1="${px(i)}" y1="${py(-6)}" x2="${px(i)}" y2="${py(6)}" stroke="#C9B8F2" stroke-width="${i === 0 ? 0 : 1}" opacity="0.7"/>`;
      s += `<line x1="${px(-6)}" y1="${py(i)}" x2="${px(6)}" y2="${py(i)}" stroke="#C9B8F2" stroke-width="${i === 0 ? 0 : 1}" opacity="0.7"/>`;
    }
    // axes
    s += `<line x1="${px(-6) - 6}" y1="${OY}" x2="${px(6) + 10}" y2="${OY}" stroke="#4A3B48" stroke-width="1.5"/>`;
    s += `<line x1="${OX}" y1="${py(6) - 8}" x2="${OX}" y2="${py(-6) + 6}" stroke="#4A3B48" stroke-width="1.5"/>`;
    s += `<text x="${px(6) + 14}" y="${OY + 5}" font-size="14" fill="#4A3B48" font-family="sans-serif">x</text>`;
    s += `<text x="${OX + 6}" y="${py(6) - 8}" font-size="14" fill="#4A3B48" font-family="sans-serif">y</text>`;
    // axis numbers (even ones, so the labels stay ≥ 14px and do not overlap)
    for (const i of [-6, -4, -2, 2, 4, 6]) {
      s += `<text x="${px(i)}" y="${OY + 16}" font-size="14" text-anchor="middle" fill="#4A3B48" font-family="sans-serif">${f(i)}</text>`;
      s += `<text x="${OX - 6}" y="${py(i) + 5}" font-size="14" text-anchor="end" fill="#4A3B48" font-family="sans-serif">${f(i)}</text>`;
    }
    s += `<text x="${OX - 6}" y="${OY + 16}" font-size="14" text-anchor="end" fill="#4A3B48" font-family="sans-serif">0</text>`;
    if (opts.line) {
      const { m, c } = opts.line;
      // clip to x in [-6,6] and y in [-6,6]
      const pts = [];
      for (const x of [-6, 6]) { const y = m * x + c; if (y >= -6 && y <= 6) pts.push([x, y]); }
      if (m !== 0) for (const y of [-6, 6]) { const x = (y - c) / m; if (x > -6 && x < 6) pts.push([x, y]); }
      if (pts.length >= 2) s += `<line x1="${px(pts[0][0])}" y1="${py(pts[0][1])}" x2="${px(pts[1][0])}" y2="${py(pts[1][1])}" stroke="#A9D8F5" stroke-width="3" stroke-linecap="round"/>`;
    }
    if (opts.hline != null) s += `<line x1="${px(-6)}" y1="${py(opts.hline)}" x2="${px(6)}" y2="${py(opts.hline)}" stroke="#A9D8F5" stroke-width="3" stroke-linecap="round"/>`;
    if (opts.vline != null) s += `<line x1="${px(opts.vline)}" y1="${py(6)}" x2="${px(opts.vline)}" y2="${py(-6)}" stroke="#A9D8F5" stroke-width="3" stroke-linecap="round"/>`;
    if (opts.steps) {
      // "1 across, then m up" drawn on the line, so the steepness can be counted
      const { m, c, x0 } = opts.steps, ya = m * x0 + c;
      s += `<line x1="${px(x0)}" y1="${py(ya)}" x2="${px(x0 + 1)}" y2="${py(ya)}" stroke="#E0568C" stroke-width="3" stroke-linecap="round"/>`;
      s += `<line x1="${px(x0 + 1)}" y1="${py(ya)}" x2="${px(x0 + 1)}" y2="${py(ya + m)}" stroke="#2FA97A" stroke-width="3" stroke-linecap="round"/>`;
      s += `<circle cx="${px(x0)}" cy="${py(ya)}" r="4" fill="#E0568C"/><circle cx="${px(x0 + 1)}" cy="${py(ya + m)}" r="4" fill="#2FA97A"/>`;
      const lx = px(x0 + 1) + 6 > 250 ? px(x0 + 1) - 6 : px(x0 + 1) + 6;
      const anchor = px(x0 + 1) + 6 > 250 ? 'end' : 'start';
      s += `<text x="${px(x0 + 0.5)}" y="${py(ya) + (m > 0 ? 16 : -8)}" font-size="13" font-weight="bold" text-anchor="middle" fill="#E0568C" font-family="sans-serif" paint-order="stroke" stroke="#FFFDF8" stroke-width="3.5">1 across</text>`;
      s += `<text x="${lx}" y="${py(ya + m / 2) + 4}" font-size="13" font-weight="bold" text-anchor="${anchor}" fill="#2FA97A" font-family="sans-serif" paint-order="stroke" stroke="#FFFDF8" stroke-width="3.5">? ${m > 0 ? 'up' : 'down'}</text>`;
    }
    if (opts.segment) {
      const [p, q] = opts.segment;
      s += `<line x1="${px(p.x)}" y1="${py(p.y)}" x2="${px(q.x)}" y2="${py(q.y)}" stroke="#FFC79A" stroke-width="3" stroke-dasharray="5 4" stroke-linecap="round"/>`;
    }
    points.forEach((p, i) => {
      const col = p.colour || COLOURS[i % COLOURS.length];
      s += `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="5" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
      const lx = px(p.x) + (p.dx != null ? p.dx : (p.x >= 5 ? -16 : 7)), ly = py(p.y) + (p.dy != null ? p.dy : (p.y >= 5 ? 16 : -7));
      s += `<text x="${lx}" y="${ly}" font-size="15" font-weight="bold" fill="${col}" font-family="sans-serif">${p.label}</text>`;
    });
    return s + '</svg>';
  }

  const coordText = (x, y) => `(${x}, ${y})`;   // typed form uses plain '-'
  const coordAnswer = (x, y, extra = {}) => Object.assign({
    type: 'text', value: coordText(x, y),
    accept: [`(${x},${y})`, `${x},${y}`, `${x}, ${y}`],
    placeholder: 'e.g. (2, -3)',
  }, extra);
  const pretty = (x, y) => `(${f(x)}, ${f(y)})`;
  const quadrantOf = (x, y) => (x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : 4);
  const QUAD_NAMES = ['1st quadrant (top right)', '2nd quadrant (top left)', '3rd quadrant (bottom left)', '4th quadrant (bottom right)'];
  const LETTERS = ['A', 'B', 'C', 'D', 'P', 'Q', 'M', 'T'];

  function randPoint(level, opts = {}) {
    if (level === 1 && !opts.anyQuad) {
      const axis = R.chance(0.2);
      if (axis) return R.chance(0.5) ? { x: R.nz(6), y: 0 } : { x: 0, y: R.nz(6) };
      return { x: R.int(1, 6), y: R.int(1, 6) };
    }
    return { x: R.nz(6), y: R.nz(6) };
  }
  const distinct = (pts, p) => !pts.some((q) => q.x === p.x && q.y === p.y);

  /* ---------- read a point ---------- */
  function readPoint(level) {
    const p = randPoint(level);
    const label = R.pick(LETTERS);
    const others = [];
    if (level >= 2) while (others.length < R.int(1, 2)) { const q = randPoint(2); if (distinct([p, ...others], q)) others.push(q); }
    const labels = R.sample(LETTERS.filter((l) => l !== label), others.length);
    const pts = [{ x: p.x, y: p.y, label }, ...others.map((q, i) => ({ x: q.x, y: q.y, label: labels[i] }))];
    const dirX = p.x === 0 ? 'stay at 0' : `${Math.abs(p.x)} ${p.x > 0 ? 'right' : 'left'}`;
    const dirY = p.y === 0 ? 'stay at 0' : `${Math.abs(p.y)} ${p.y > 0 ? 'up' : 'down'}`;
    return {
      visual: grid(R.shuffle(pts)),
      prompt: `What are the coordinates of point <b>${label}</b>? Write them as (x, y).`,
      answer: coordAnswer(p.x, p.y),
      hint: 'Start at the origin (0, 0). Go along the x-axis first (left or right), then up or down. Write (x, y).',
      working: [
        `From (0, 0), along: ${dirX} → x = ${f(p.x)}.`,
        `Then up/down: ${dirY} → y = ${f(p.y)}.`,
        `${label} is at <b>${pretty(p.x, p.y)}</b>.`,
      ],
      finalAnswer: pretty(p.x, p.y),
      skill: 'read-point',
    };
  }

  /* ---------- which letter is at (x, y)? ---------- */
  function whichLetter(level) {
    const pts = [];
    while (pts.length < 4) { const q = randPoint(level, { anyQuad: level > 1 }); if (distinct(pts, q)) pts.push(q); }
    const labels = R.sample(['A', 'B', 'C', 'D'], 4);
    pts.forEach((p, i) => { p.label = labels[i]; });
    const target = R.pick(pts);
    const choices = ['A', 'B', 'C', 'D'];
    return {
      visual: grid(pts),
      prompt: `Which point is at <b>${pretty(target.x, target.y)}</b>?`,
      answer: { type: 'choice', value: choices.indexOf(target.label), choices },
      hint: `The first number is x (along), the second is y (up or down). Go ${Math.abs(target.x)} ${target.x >= 0 ? 'right' : 'left'} then ${Math.abs(target.y)} ${target.y >= 0 ? 'up' : 'down'}.`,
      working: [
        `x = ${f(target.x)}: go ${Math.abs(target.x)} ${target.x >= 0 ? 'right' : 'left'} from the origin.`,
        `y = ${f(target.y)}: go ${Math.abs(target.y)} ${target.y >= 0 ? 'up' : 'down'}.`,
        `That is point <b>${target.label}</b>.`,
      ],
      finalAnswer: target.label,
      skill: 'read-point',
    };
  }

  /* ---------- quadrant (choice) ---------- */
  function quadrant(level) {
    const p = { x: R.nz(level === 1 ? 5 : 9), y: R.nz(level === 1 ? 5 : 9) };
    const q = quadrantOf(p.x, p.y);
    const showGrid = level === 1 || R.chance(0.4);
    return {
      visual: showGrid && Math.abs(p.x) <= 6 && Math.abs(p.y) <= 6 ? grid([{ x: p.x, y: p.y, label: 'P' }]) : undefined,
      prompt: `Which quadrant is the point <b>${pretty(p.x, p.y)}</b> in?`,
      answer: { type: 'choice', value: q - 1, choices: QUAD_NAMES },
      hint: 'Quadrants go anticlockwise from the top right: 1st (+, +), 2nd (−, +), 3rd (−, −), 4th (+, −).',
      working: [
        `x = ${f(p.x)} is ${p.x > 0 ? 'positive → right half' : 'negative → left half'}.`,
        `y = ${f(p.y)} is ${p.y > 0 ? 'positive → top half' : 'negative → bottom half'}.`,
        `${p.x > 0 ? 'Right' : 'Left'} and ${p.y > 0 ? 'top' : 'bottom'} is the <b>${QUAD_NAMES[q - 1]}</b>.`,
      ],
      finalAnswer: QUAD_NAMES[q - 1],
      skill: 'quadrant',
    };
  }

  /* ---------- table of values for y = mx + c ---------- */
  const lineText = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : f(m)}x${c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}`}`;
  function tableOfValues(level) {
    const m = level === 1 ? 1 : level === 2 ? R.pick([2, 3, 4, 5]) : R.pick([2, 3, 4, -1, -2, -3]);
    const c = level === 1 ? R.int(1, 9) : R.chance(0.5) ? R.int(1, 9) : -R.int(1, 9);
    const xs = [0, 1, 2, 3];
    const askX = level === 3 ? R.pick([4, 5, 6, -1, -2, -3, 10]) : R.pick([4, 5, 6, 10]);
    const ans = m * askX + c;
    const cell = (v, head) => `<${head ? 'th' : 'td'} style="padding:4px 12px;border:1px solid #A9D8F5;text-align:center;${head ? 'background:#EAF5FD' : ''}">${v}</${head ? 'th' : 'td'}>`;
    const visual = `<table style="border-collapse:collapse;margin:6px auto;font-size:16px"><tr>${cell('x', true)}${xs.map((x) => cell(x)).join('')}${cell(askX)}</tr><tr>${cell('y', true)}${xs.map((x) => cell(f(m * x + c))).join('')}${cell('?')}</tr></table>`;
    return {
      visual,
      prompt: `The table shows values for the line <b>${lineText(m, c)}</b>. What is y when x = ${f(askX)}?`,
      answer: { type: 'number', value: ans, placeholder: 'y = ?' },
      hint: `Put x = ${f(askX)} into the rule: multiply by ${f(m)}, then ${c < 0 ? 'subtract ' + Math.abs(c) : 'add ' + c}.`,
      working: [
        `y = ${f(m)} × ${askX < 0 ? '(' + f(askX) + ')' : askX} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`,
        `= ${f(m * askX)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = <b>${f(ans)}</b>`,
      ],
      finalAnswer: `y = ${f(ans)}`,
      skill: 'table-values',
    };
  }

  /* ---------- which point lies on the line? (choice) ---------- */
  function onLine(level) {
    const m = level <= 2 ? R.pick([1, 1, 2, 3]) : R.pick([2, 3, -1, -2]);
    const c = level === 1 ? R.int(1, 5) : R.chance(0.6) ? R.int(1, 6) : -R.int(1, 6);
    let x = level === 1 ? R.int(0, 4) : R.int(-4, 4);
    let y = m * x + c;
    let tries = 0;
    while (Math.abs(y) > 6 && tries++ < 20) { x = R.int(-4, 4); y = m * x + c; }
    if (Math.abs(y) > 6) return onLine(level);
    const right = { x, y };
    const wrongs = [];
    const cands = [{ x, y: y + R.pick([1, 2, -1, -2]) }, { x: y, y: x }, { x: x + R.pick([1, -1, 2]), y }, { x: -x, y }, { x, y: -y }, { x: x + 1, y: y + 1 }];
    for (const w of cands) {
      if (w.y === m * w.x + c) continue;
      if (!distinct([right, ...wrongs], w)) continue;
      if (Math.abs(w.x) > 6 || Math.abs(w.y) > 6) continue;
      wrongs.push(w);
      if (wrongs.length === 3) break;
    }
    if (wrongs.length < 3) return onLine(level);
    const opts = R.shuffle([right, ...wrongs]);
    const choices = opts.map((p) => pretty(p.x, p.y));
    return {
      visual: R.chance(0.5) ? grid([], { line: { m, c } }) : undefined,
      prompt: `Which of these points lies on the line <b>${lineText(m, c)}</b>?`,
      answer: { type: 'choice', value: opts.indexOf(right), choices },
      hint: `Try each point: put its x into the rule and see if you get its y.`,
      working: [
        `Check ${pretty(x, y)}: x = ${f(x)} gives y = ${f(m)} × ${x < 0 ? '(' + f(x) + ')' : x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${f(y)}. ✓`,
        `The other points do not fit the rule.`,
        `Answer: <b>${pretty(x, y)}</b>`,
      ],
      finalAnswer: pretty(x, y),
      skill: 'on-line',
    };
  }

  /* ---------- distance between two points on the same horizontal / vertical line ---------- */
  function distance(level, ctx) {
    const horizontal = R.chance(0.5);
    let a, b;
    if (level === 1) {
      const fixed = R.int(1, 6), lo = R.int(0, 3), hi = R.int(lo + 1, 6);
      a = horizontal ? { x: lo, y: fixed } : { x: fixed, y: lo };
      b = horizontal ? { x: hi, y: fixed } : { x: fixed, y: hi };
    } else {
      const fixed = R.nz(6);
      const [p, q] = R.pair(-6, 6);
      a = horizontal ? { x: p, y: fixed } : { x: fixed, y: p };
      b = horizontal ? { x: q, y: fixed } : { x: fixed, y: q };
    }
    const d = horizontal ? Math.abs(a.x - b.x) : Math.abs(a.y - b.y);
    const la = ctx ? ctx.labels[0] : 'A', lb = ctx ? ctx.labels[1] : 'B';
    const pts = [{ x: a.x, y: a.y, label: la }, { x: b.x, y: b.y, label: lb }];
    const big = horizontal ? Math.max(a.x, b.x) : Math.max(a.y, b.y), small = horizontal ? Math.min(a.x, b.x) : Math.min(a.y, b.y);
    return {
      visual: grid(pts, { segment: pts }),
      prompt: ctx ? ctx.prompt(a, b) : `${la} is at ${pretty(a.x, a.y)} and ${lb} is at ${pretty(b.x, b.y)}. How many units apart are they?`,
      answer: { type: 'number', value: d, unit: ctx ? ctx.unit : 'units' },
      hint: `The points are on the same ${horizontal ? 'horizontal' : 'vertical'} line, so only the ${horizontal ? 'x' : 'y'} values change. Count the squares, or subtract: bigger − smaller.`,
      working: [
        `Same ${horizontal ? 'y' : 'x'} value, so the distance is the gap between the ${horizontal ? 'x' : 'y'} values.`,
        `${f(big)} − (${f(small)}) = <b>${d}</b>`,
      ],
      finalAnswer: `${d} ${ctx ? ctx.unit : 'units'}`,
      skill: 'distance',
    };
  }

  /* ---------- midpoint (level 3) ---------- */
  function midpoint() {
    let a, b;
    do {
      a = { x: R.int(-6, 6), y: R.int(-6, 6) };
      b = { x: R.int(-6, 6), y: R.int(-6, 6) };
    } while ((a.x + b.x) % 2 !== 0 || (a.y + b.y) % 2 !== 0 || (a.x === b.x && a.y === b.y) || (Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const pts = [{ x: a.x, y: a.y, label: 'A' }, { x: b.x, y: b.y, label: 'B' }];
    return {
      visual: grid(pts, { segment: pts }),
      prompt: `A is at ${pretty(a.x, a.y)} and B is at ${pretty(b.x, b.y)}. What are the coordinates of the <b>midpoint</b> of AB?`,
      answer: coordAnswer(mx, my),
      hint: 'The midpoint is halfway between. Average the x values, and average the y values: add them and divide by 2.',
      working: [
        `x: (${f(a.x)} + ${f(b.x)}) ÷ 2 = ${f(a.x + b.x)} ÷ 2 = ${f(mx)}.`,
        `y: (${f(a.y)} + ${f(b.y)}) ÷ 2 = ${f(a.y + b.y)} ÷ 2 = ${f(my)}.`,
        `Midpoint: <b>${pretty(mx, my)}</b>`,
      ],
      finalAnswer: pretty(mx, my),
      skill: 'midpoint',
    };
  }

  /* ---------- plot a point from the rule of a line ---------- */
  function plotFromRule(level) {
    const m = level === 1 ? R.pick([1, 2]) : level === 2 ? R.pick([2, 3, 1]) : R.pick([2, 3, -1, -2]);
    const c = level === 1 ? R.int(0, 3) : R.chance(0.6) ? R.int(1, 4) : -R.int(1, 4);
    let x = level === 1 ? R.int(1, 4) : R.int(-3, 4);
    let y = m * x + c;
    let tries = 0;
    while ((Math.abs(y) > 6 || x === 0) && tries++ < 25) { x = R.int(-3, 4); y = m * x + c; }
    if (Math.abs(y) > 6 || x === 0) return plotFromRule(1);
    return {
      visual: grid([], { line: { m, c } }),
      prompt: `The line <b>${lineText(m, c)}</b> is drawn. Which point on it has <b>x = ${f(x)}</b>? Write it as (x, y).`,
      answer: coordAnswer(x, y),
      hint: `Put x = ${f(x)} into the rule to find y, then write the pair with x first.`,
      working: [
        `Put x = ${f(x)} into ${lineText(m, c)}: y = ${f(m)} × ${x < 0 ? '(' + f(x) + ')' : x} ${c < 0 ? '−' : '+'} ${Math.abs(c)}.`,
        `y = ${f(m * x)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${f(y)}.`,
        `Write x first: <b>${pretty(x, y)}</b>.`,
      ],
      finalAnswer: pretty(x, y),
      skill: 'plot-from-rule',
    };
  }

  /* ---------- steepness, said the Year 8 way: 1 across, how many up? ---------- */
  function gradientQ(level) {
    const m = level === 3 ? R.pick([2, 3, 3, -1, -2, -3]) : R.pick([1, 2, 2, 3]);
    const c = R.chance(0.5) ? R.int(0, 3) : -R.int(1, 3);
    // start the steps somewhere the whole step fits on the grid
    const xs = [];
    for (let x = -5; x <= 5; x++) { const y = m * x + c; if (Math.abs(y) <= 5 && Math.abs(m * (x + 1) + c) <= 6 && Math.abs(x + 1) <= 6) xs.push(x); }
    // keep the "1 across" arrow clear of the y-axis labels and the x-axis numbers
    const clear = xs.filter((x) => x !== 0 && x !== -1 && Math.abs(m * x + c) > 1 && Math.abs(m * x + c) <= 4 && Math.abs(m * (x + 1) + c) <= 5);
    if (!xs.length) return gradientQ(1);
    const x0 = R.pick(clear.length ? clear : xs);
    const visual = grid([], { line: { m, c }, steps: { m, c, x0 } });
    if (m > 0) {
      return {
        visual,
        prompt: `The line <b>${lineText(m, c)}</b> is drawn. For every <b>1</b> square you go across, how many squares do you go <b>up</b>?`,
        answer: { type: 'number', value: m, unit: 'squares' },
        hint: 'Follow the pink arrow 1 square across, then count the green arrow going up until you are back on the line.',
        working: [
          `Start on the line and go <b>1 square across</b> (the pink arrow).`,
          `Now count <b>up</b> until you touch the line again (the green arrow): <b>${m}</b>.`,
          `That matches the number in front of x in ${lineText(m, c)}: <b>${f(m)}</b>.`,
        ],
        finalAnswer: `${m} up`,
        skill: 'gradient',
      };
    }
    const down = Math.abs(m);
    const choices = R.shuffle([`${down} down`, `${down} up`, `${down + 1} down`, '1 down']);
    const right = `${down} down`;
    return {
      visual,
      prompt: `The line <b>${lineText(m, c)}</b> is drawn. When you go <b>1</b> square across, what does the line do?`,
      answer: { type: 'choice', value: choices.indexOf(right), choices },
      hint: 'The number in front of x is negative, so the line slopes <b>downhill</b> as you go right. Count how far down.',
      working: [
        `Start on the line and go <b>1 square across</b>.`,
        `The line is going <b>downhill</b>, so you must go <b>down</b> to meet it again: ${down}.`,
        `That matches the ${f(m)} in front of x: <b>${right}</b>.`,
      ],
      finalAnswer: right,
      skill: 'gradient',
    };
  }

  /* ---------- horizontal and vertical lines: y = 3 and x = −2 ---------- */
  function hvLine(level) {
    const horiz = R.chance(0.5);
    const k = level === 1 ? R.int(1, 5) : R.nz(5);
    const t = R.pick(level === 1 ? ['name', 'name', 'common'] : ['name', 'name', 'common', 'through', 'through']);
    const name = horiz ? `y = ${f(k)}` : `x = ${f(k)}`;
    const other = horiz ? `x = ${f(k)}` : `y = ${f(k)}`;
    const opts = { [horiz ? 'hline' : 'vline']: k };
    if (t === 'name') {
      const choices = R.shuffle([name, other, horiz ? `y = ${f(-k)}` : `x = ${f(-k)}`, horiz ? `x = ${f(-k)}` : `y = ${f(-k)}`]);
      return {
        visual: grid([], opts),
        prompt: `What is the equation of this line?`,
        answer: { type: 'choice', value: choices.indexOf(name), choices },
        hint: `A <b>flat</b> (horizontal) line is <b>y = a number</b>. An <b>upright</b> (vertical) line is <b>x = a number</b>. Read where it crosses the axis.`,
        working: [
          horiz ? `The line is <b>flat</b> (horizontal), so it is a <b>y =</b> line.` : `The line is <b>upright</b> (vertical), so it is an <b>x =</b> line.`,
          horiz ? `Every point on it has y = ${f(k)}, whatever x is.` : `Every point on it has x = ${f(k)}, whatever y is.`,
          `The line is <b>${name}</b>.`,
        ],
        finalAnswer: name,
        skill: 'hv-line',
      };
    }
    if (t === 'common') {
      const right = horiz ? `The y value is always ${f(k)}` : `The x value is always ${f(k)}`;
      const choices = R.shuffle([right, horiz ? `The x value is always ${f(k)}` : `The y value is always ${f(k)}`, `x and y add up to ${f(k)}`, horiz ? `The y value is always 0` : `The x value is always 0`]);
      return {
        visual: grid([], opts),
        prompt: `What do <b>all</b> the points on the line <b>${name}</b> have in common?`,
        answer: { type: 'choice', value: choices.indexOf(right), choices },
        hint: `Pick two points on the line and write their coordinates. Which number is the same in both?`,
        working: [
          horiz ? `Two points on it: ${pretty(-3, k)} and ${pretty(4, k)}.` : `Two points on it: ${pretty(k, -3)} and ${pretty(k, 4)}.`,
          horiz ? `The x values are different but the <b>y value is always ${f(k)}</b>.` : `The y values are different but the <b>x value is always ${f(k)}</b>.`,
          `That is why the line is called ${name}.`,
        ],
        finalAnswer: right,
        skill: 'hv-line',
      };
    }
    // name the line through three given points
    const vals = R.sample([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], 3);
    const pts = vals.map((v, i) => (horiz ? { x: v, y: k, label: 'ABC'[i], dx: -4, dy: 18 } : { x: k, y: v, label: 'ABC'[i], dx: 10, dy: 5 }));
    const choices = R.shuffle([name, other, horiz ? `y = ${f(vals[0])}` : `x = ${f(vals[0])}`, horiz ? `x = ${f(vals[0])}` : `y = ${f(vals[0])}`]);
    return {
      visual: grid(pts, opts),
      prompt: `A line goes through ${pts.map((p) => pretty(p.x, p.y)).join(', ')}. What is its equation?`,
      answer: { type: 'choice', value: choices.indexOf(name), choices },
      hint: `Look at the three pairs. Which number is the <b>same</b> in all of them: the x or the y?`,
      working: [
        horiz ? `The x values are all different: ${vals.map((v) => f(v)).join(', ')}.` : `The y values are all different: ${vals.map((v) => f(v)).join(', ')}.`,
        horiz ? `But every y value is ${f(k)} — the points are in a <b>flat row</b>.` : `But every x value is ${f(k)} — the points are in an <b>upright column</b>.`,
        `So the line is <b>${name}</b>.`,
      ],
      finalAnswer: name,
      skill: 'hv-line',
    };
  }

  /* ---------- do three points lie on the same straight line? (level 3) ---------- */
  function collinear() {
    const m = R.pick([1, 2, 3, -1, -2]);
    const c = R.chance(0.5) ? R.int(-2, 3) : -R.int(1, 3);
    const gap = R.int(1, 3);
    const cands = [];
    for (let x = -6; x <= 6 - gap - 1; x++) {
      const ys = [m * x + c, m * (x + gap) + c, m * (x + gap + 1) + c];
      if (ys.every((y) => Math.abs(y) <= 5)) cands.push(x);
    }
    if (!cands.length) return collinear();
    const x1 = R.pick(cands), x2 = x1 + gap, x3 = x2 + 1;
    const yes = R.chance(0.5);
    const shift = yes ? 0 : R.pick([1, -1, 2, -2]);
    const y1 = m * x1 + c, y2 = m * x2 + c, y3 = m * x3 + c + shift;
    if (Math.abs(y3) > 6) return collinear();
    const off = m > 0 ? { dx: -17, dy: 5 } : { dx: 9, dy: 16 };
    const A = Object.assign({ x: x1, y: y1, label: 'A' }, off), B = Object.assign({ x: x2, y: y2, label: 'B' }, off), C = Object.assign({ x: x3, y: y3, label: 'C' }, off);
    const step2 = y3 - y2;
    const per = (dy, dx) => (dy % dx === 0 ? `${f(dy / dx)}` : f(N.round(dy / dx, 2)));
    return {
      visual: grid([A, B, C], { segment: [A, C] }),
      prompt: `A is ${pretty(x1, y1)}, B is ${pretty(x2, y2)} and C is ${pretty(x3, y3)}. Do all three points lie on the <b>same straight line</b>?`,
      answer: { type: 'choice', value: yes ? 0 : 1, choices: ['Yes', 'No'] },
      hint: 'Work out the steps from A to B, then from B to C. If the line is straight, "1 across" must give the <b>same</b> number of ups both times.',
      working: [
        `A to B: ${gap} across and ${f(m * gap)} ${m > 0 ? 'up' : 'down'} → that is ${per(Math.abs(m * gap), gap)} ${m > 0 ? 'up' : 'down'} for every 1 across.`,
        `B to C: 1 across and ${f(Math.abs(step2))} ${step2 >= 0 ? 'up' : 'down'} → that is ${f(Math.abs(step2))} ${step2 >= 0 ? 'up' : 'down'} for every 1 across.`,
        yes ? `The steps match, so the three points <b>are</b> on the same straight line.` : `The steps do <b>not</b> match, so C is off the line. The three points are <b>not</b> on the same straight line.`,
      ],
      finalAnswer: yes ? 'Yes' : 'No',
      skill: 'collinear',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['read', 'read', 'read', 'letter', 'letter', 'quadrant', 'table', 'distance', 'hv', 'hv', 'plot']
      : level === 2 ? ['read', 'read', 'letter', 'quadrant', 'table', 'table', 'online', 'distance', 'hv', 'hv', 'grad', 'grad', 'plot']
      : ['read', 'midpoint', 'midpoint', 'table', 'online', 'distance', 'quadrant', 'hv', 'grad', 'grad', 'plot', 'collinear', 'collinear'];
    const t = R.pick(pool);
    if (t === 'hv') return hvLine(level);
    if (t === 'grad') return gradientQ(level);
    if (t === 'plot') return plotFromRule(level);
    if (t === 'collinear') return collinear();
    if (t === 'read') return readPoint(level);
    if (t === 'letter') return whichLetter(level);
    if (t === 'quadrant') return quadrant(level);
    if (t === 'table') return tableOfValues(level);
    if (t === 'online') return onLine(level);
    if (t === 'midpoint') return midpoint();
    return distance(level);
  }

  /* ---------- word problems ---------- */
  function word(level) {
    const t = R.pick(['treasure', 'treasureMove', 'seating', 'netball', 'drone', 'map']);
    if (t === 'treasure') {
      const p = randPoint(level, { anyQuad: level > 1 });
      const decoys = [];
      while (decoys.length < 2) { const q = randPoint(level, { anyQuad: level > 1 }); if (distinct([p, ...decoys], q)) decoys.push(q); }
      const pts = R.shuffle([{ x: p.x, y: p.y, label: 'T', colour: '#E0568C' }, { x: decoys[0].x, y: decoys[0].y, label: 'R', colour: '#7C5CBF' }, { x: decoys[1].x, y: decoys[1].y, label: 'S', colour: '#D98A3A' }]);
      return {
        visual: grid(pts),
        prompt: `On a treasure map the treasure is marked <b>T</b> (R is a rock and S is a shipwreck). What are the coordinates of the treasure?`,
        answer: coordAnswer(p.x, p.y),
        hint: 'Across first, then up or down. Write (x, y).',
        working: [`Across: x = ${f(p.x)}.`, `Up/down: y = ${f(p.y)}.`, `Treasure at <b>${pretty(p.x, p.y)}</b>.`],
        finalAnswer: pretty(p.x, p.y),
      };
    }
    if (t === 'treasureMove') {
      const start = level === 1 ? { x: 0, y: 0 } : { x: R.int(-3, 3), y: R.int(-3, 3) };
      const dx = R.nz(level === 1 ? 5 : 6), dy = R.nz(level === 1 ? 5 : 6);
      const end = { x: start.x + dx, y: start.y + dy };
      if (Math.abs(end.x) > 6 || Math.abs(end.y) > 6) return word(level);
      return {
        visual: grid([{ x: start.x, y: start.y, label: 'Start', colour: '#4A3B48' }]),
        prompt: `A pirate starts at ${pretty(start.x, start.y)}. The map says: go ${Math.abs(dx)} squares ${dx > 0 ? 'east' : 'west'}, then ${Math.abs(dy)} squares ${dy > 0 ? 'north' : 'south'}. What are the coordinates of the treasure?`,
        answer: coordAnswer(end.x, end.y),
        hint: 'East adds to x, west subtracts. North adds to y, south subtracts.',
        working: [
          `x: ${f(start.x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${f(end.x)}.`,
          `y: ${f(start.y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${f(end.y)}.`,
          `Treasure at <b>${pretty(end.x, end.y)}</b>.`,
        ],
        finalAnswer: pretty(end.x, end.y),
      };
    }
    if (t === 'seating') {
      const who = R.pick(['Harper', 'Mia', 'Aroha', 'Tane']), friend = R.pick(['Liam', 'Ella', 'Kahu', 'Sophie']);
      const s = { x: R.int(1, 4), y: R.int(1, 4) };
      const dx = R.nz(level === 1 ? 2 : 4), dy = level === 1 ? R.int(1, 2) : R.nz(3);
      const e = { x: s.x + dx, y: s.y + dy };
      if (e.x < 0 || e.x > 8 || e.y < 0 || e.y > 8) return word(level);
      return {
        prompt: `In the school hall seating plan, seats are numbered (column, row). ${who} sits at ${pretty(s.x, s.y)}. ${friend} sits ${Math.abs(dx)} seat${Math.abs(dx) === 1 ? '' : 's'} to the ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} row${Math.abs(dy) === 1 ? '' : 's'} ${dy > 0 ? 'further back' : 'closer to the front'} (${dy > 0 ? 'higher' : 'lower'} row number). What are ${friend}'s seat coordinates?`,
        answer: coordAnswer(e.x, e.y),
        hint: 'Right adds to the first number (column). Higher row number adds to the second number (row).',
        working: [
          `Column: ${s.x} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${e.x}.`,
          `Row: ${s.y} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${e.y}.`,
          `${friend} is at <b>${pretty(e.x, e.y)}</b>.`,
        ],
        finalAnswer: pretty(e.x, e.y),
      };
    }
    if (t === 'netball') {
      const labels = R.pick([['GS', 'GK'], ['C', 'WA'], ['GA', 'GD']]);
      return distance(level, {
        labels,
        unit: 'm',
        prompt: (a, b) => `On a netball court diagram (1 unit = 1 m), ${labels[0]} stands at ${pretty(a.x, a.y)} and ${labels[1]} stands at ${pretty(b.x, b.y)}. How far apart are they?`,
      });
    }
    if (t === 'drone') {
      const p = { x: R.nz(level === 1 ? 5 : 9), y: R.nz(level === 1 ? 5 : 9) };
      const dirs = ['north-east', 'north-west', 'south-west', 'south-east'];
      const q = quadrantOf(p.x, p.y);
      return {
        prompt: `A drone takes off from (0, 0). East is the positive x direction and north is the positive y direction. It is now at ${pretty(p.x, p.y)}. In which direction from the start is it?`,
        answer: { type: 'choice', value: q - 1, choices: dirs },
        hint: 'Positive x = east, negative x = west. Positive y = north, negative y = south.',
        working: [
          `x = ${f(p.x)} → ${p.x > 0 ? 'east' : 'west'}.`,
          `y = ${f(p.y)} → ${p.y > 0 ? 'north' : 'south'}.`,
          `Direction: <b>${dirs[q - 1]}</b>.`,
        ],
        finalAnswer: dirs[q - 1],
      };
    }
    // map: which place is at the given coordinates (choice)
    const places = R.sample(['the dairy', 'the school', 'the skate park', 'the beach', 'the library', 'the marae', 'the pool'], 4);
    const pts = [];
    while (pts.length < 4) { const q = randPoint(level, { anyQuad: level > 1 }); if (distinct(pts, q)) pts.push(q); }
    const labels = ['A', 'B', 'C', 'D'];
    pts.forEach((p, i) => { p.label = labels[i]; });
    const idx = R.int(0, 3);
    const target = pts[idx];
    const legend = pts.map((p, i) => `${labels[i]} = ${places[i]}`).join(', ');
    return {
      visual: grid(pts),
      prompt: `On this town map, ${legend}. Which place is at ${pretty(target.x, target.y)}?`,
      answer: { type: 'choice', value: idx, choices: places },
      hint: `Go ${Math.abs(target.x)} ${target.x >= 0 ? 'right' : 'left'}, then ${Math.abs(target.y)} ${target.y >= 0 ? 'up' : 'down'}. Which letter is there?`,
      working: [`${pretty(target.x, target.y)} is where point ${target.label} is.`, `${target.label} = <b>${places[idx]}</b>.`],
      finalAnswer: places[idx],
    };
  }

  HL.registerTopic({
    id: 'coordinates', subject: 'maths', strand: 'algebra', order: 6,
    name: 'Coordinates & graphs', short: 'Coordinates',
    blurb: 'Along the corridor, then up the stairs: reading and plotting points on a grid.',
    example: 'A = (3, −2) &nbsp;·&nbsp; y = 2x + 1 when x = 4 → y = 9',
    animal: 'chick',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', PINK = '#F9A8C9', SKY = '#A9D8F5', MINT = '#A6E3B8', BUTTER = '#FFE98A', LAV = '#C9B8F2';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // a grid from −n..n with origin at (ox, oy) and cell size c. xl / yl = extra tick labels [value, colour].
      const grid = (ox, oy, c, n, xl = [], yl = []) => { const L = n * c; let o = ''; for (let i = -n; i <= n; i++) o += `<line x1="${ox + i * c}" y1="${oy - L}" x2="${ox + i * c}" y2="${oy + L}" stroke="${LAV}" stroke-width="1"/><line x1="${ox - L}" y1="${oy + i * c}" x2="${ox + L}" y2="${oy + i * c}" stroke="${LAV}" stroke-width="1"/>`; o += `<line x1="${ox - L - 6}" y1="${oy}" x2="${ox + L + 6}" y2="${oy}" stroke="${INK}" stroke-width="2"/><line x1="${ox}" y1="${oy - L - 6}" x2="${ox}" y2="${oy + L + 6}" stroke="${INK}" stroke-width="2"/><text x="${ox + L + 12}" y="${oy + 5}" fill="${INK}">x</text><text x="${ox}" y="${oy - L - 10}" text-anchor="middle" fill="${INK}">y</text><text x="${ox - 6}" y="${oy + 15}" text-anchor="end" fill="${INK}">0</text>`; [[-n, INK], [n, INK]].filter(([v]) => !xl.some(([u]) => Math.abs(u - v) <= 1)).concat(xl).forEach(([v, col]) => { o += `<text x="${ox + v * c}" y="${oy + 15}" text-anchor="middle" fill="${col}" paint-order="stroke" stroke="#fff" stroke-width="3">${v < 0 ? '−' + -v : v}</text>`; }); [[-n, INK], [n, INK]].filter(([v]) => !yl.some(([u]) => Math.abs(u - v) <= 1)).concat(yl).forEach(([v, col]) => { o += `<text x="${ox - 6}" y="${oy - v * c + 5}" text-anchor="end" fill="${col}" paint-order="stroke" stroke="#fff" stroke-width="3">${v < 0 ? '−' + -v : v}</text>`; }); return o; };
      const quadrants = (ox, oy, L) => `<rect x="${ox}" y="${oy - L}" width="${L}" height="${L}" fill="${MINT}" opacity="0.35"/><rect x="${ox - L}" y="${oy - L}" width="${L}" height="${L}" fill="${SKY}" opacity="0.4"/><rect x="${ox - L}" y="${oy}" width="${L}" height="${L}" fill="${BUTTER}" opacity="0.5"/><rect x="${ox}" y="${oy}" width="${L}" height="${L}" fill="${PINK}" opacity="0.4"/>`;
      const arrow = (x1, y1, x2, y2, col) => { const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1); const hx = x2 - dx * 9, hy = y2 - dy * 9; return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="4" stroke-linecap="round"/><polygon points="${x2},${y2} ${hx - dy * 6},${hy - dx * 6} ${hx + dy * 6},${hy + dx * 6}" fill="${col}"/>`; };
      const dot = (x, y, col, label, dx = 10, dy = -8) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${col}" stroke="#fff" stroke-width="1.5"/>${label ? `<text x="${x + dx}" y="${y + dy}" fill="${col}">${label}</text>` : ''}`;
      // walk from the origin: along the corridor (x, rose) then up the stairs (y, blue)
      const walk = (ox, oy, c, x, y) => arrow(ox, oy, ox + x * c, oy, ROSE) + (y ? arrow(ox + x * c, oy, ox + x * c, oy - y * c, BLUE) : '');
      const P = (x, y) => `(${x < 0 ? '−' + -x : x}, ${y < 0 ? '−' + -y : y})`;
      return {
      what: '<p>A <b>coordinate</b> like <b>(3, −2)</b> tells you where a point is on a grid. The first number is <b>x</b> (how far <b>across</b>), the second is <b>y</b> (how far <b>up or down</b>). Remember: <b>along the corridor, then up the stairs</b>. The grid is split into four <b>quadrants</b> by the x-axis and y-axis, which cross at the <b>origin</b> (0, 0).</p>',
      visual: SVG(360, 220, `
        ${quadrants(110, 110, 85)}${grid(110, 110, 17, 5, [[3, ROSE]], [[2, BLUE]])}
        <text x="68" y="42" text-anchor="middle" fill="${INK}">2nd (−, +)</text><text x="152" y="42" text-anchor="middle" fill="${INK}">1st (+, +)</text>
        <text x="68" y="190" text-anchor="middle" fill="${INK}">3rd (−, −)</text><text x="152" y="190" text-anchor="middle" fill="${INK}">4th (+, −)</text>
        ${walk(110, 110, 17, 3, 2)}${dot(161, 76, GREEN, '(3, 2)', 8, -6)}
        <text x="216" y="74" fill="${ROSE}">x = 3: along</text><text x="216" y="92" fill="${ROSE}">the corridor →</text>
        <text x="224" y="134" fill="${BLUE}">y = 2: then up</text><text x="224" y="152" fill="${BLUE}">the stairs ↑</text>
        <text x="224" y="184" fill="${GREEN}">point (3, 2)</text>`),
      facts: [
        '<b>(x, y)</b>: x <b>first</b> (across), y <b>second</b> (up or down)',
        '"<b>Along the corridor, then up the stairs</b>"',
        'Right / up = <b>positive</b>. Left / down = <b>negative</b>',
        'Quadrants go <b>anticlockwise</b> from top right: 1st (+,+), 2nd (−,+), 3rd (−,−), 4th (+,−)',
        'The <b>origin</b> is (0, 0). A point on an axis has a <b>0</b> in it',
        '<b>Midpoint</b>: average the x’s, average the y’s',
        '<b>Flat</b> line = <b>y = a number</b> (y = 3). <b>Upright</b> line = <b>x = a number</b> (x = −2)',
        '<b>Steepness</b>: for every <b>1 across</b>, how many <b>up</b>? In y = 2x + 1 the answer is <b>2</b> — the number in front of x',
      ],
      steps: [
        'Start at the <b>origin</b> (0, 0). "x first, because x comes before y in the alphabet."',
        'Read the <b>x</b> number: "Along the corridor" — <b>right</b> if positive, <b>left</b> if negative.',
        'Read the <b>y</b> number: "Then up the stairs" — <b>up</b> if positive, <b>down</b> if negative.',
        'For a line like <b>y = 2x + 1</b>: "Pick an x, put it in, work out y." Each pair (x, y) is a point on the line.',
        '<b>Midpoint</b>: "Halfway across, halfway up" — average the x values, average the y values.',
        '<b>Distance</b> along a flat or straight-up line: "Which number changes? Subtract the smaller from the bigger."',
      ],
      examples: [
        { q: 'Plot the point (3, −2)',
          working: ['<b>Picture:</b> a school building — walk along the corridor first, then take the stairs.', '1. Which number is x? The first one, 3. Positive, so walk 3 to the <b>right</b>.', '2. Which number is y? The second, −2. Negative, so go 2 <b>down</b> the stairs.', '3. Which quadrant? x positive, y negative → bottom right (4th).'],
          a: '3 right, 2 down — in the 4th quadrant',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[3, ROSE]], [[-2, BLUE]]) + walk(100, 100, 16, 3, -2) + dot(148, 132, GREEN, '(3, −2)', 8, 16) + `<text x="200" y="70" fill="${ROSE}">along 3 →</text><text x="200" y="100" fill="${BLUE}">down 2 ↓</text><text x="200" y="130" fill="${INK}">4th quadrant (+, −)</text>`) },
        { q: 'What are the coordinates of point P?',
          working: ['<b>Picture:</b> the corridor and stairs again, but this time I read the walk off the grid.', '1. How far along the corridor? P is 4 to the <b>left</b> of the y-axis → x = −4.', '2. How far up the stairs? P is 1 <b>up</b> from the x-axis → y = 1.', '3. Write x first, then y: (−4, 1).'],
          a: 'P = (−4, 1)',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[-4, ROSE]], [[1, BLUE]]) + `<line x1="36" y1="84" x2="36" y2="100" stroke="${ROSE}" stroke-width="2" stroke-dasharray="3 3"/><line x1="36" y1="84" x2="100" y2="84" stroke="${BLUE}" stroke-width="2" stroke-dasharray="3 3"/>` + dot(36, 84, GREEN, 'P', 8, -8) + `<text x="200" y="70" fill="${ROSE}">← 4 left: x = −4</text><text x="200" y="100" fill="${BLUE}">↑ 1 up: y = 1</text><text x="200" y="130" fill="${GREEN}">P = (−4, 1)</text>`) },
        { q: 'Which quadrant is (−2, −5) in?',
          working: ['<b>Picture:</b> the four rooms of the grid, numbered anticlockwise from the top right.', '1. Is x positive or negative? −2 → negative → left side.', '2. Is y positive or negative? −5 → negative → bottom.', '3. Left and bottom → the (−, −) room → 3rd quadrant.'],
          a: '3rd quadrant' },
        { q: 'Complete the table for the line y = 2x + 1 (x = 0, 1, 2, 3)',
          working: ['<b>Picture:</b> a machine — put x in, double it, add 1, and y comes out.', '1. Which x goes in first? x = 0: 2 × 0 + 1 = 1.', '2. x = 1: 2 × 1 + 1 = 3. &nbsp; x = 2: 2 × 2 + 1 = 5. &nbsp; x = 3: 2 × 3 + 1 = 7.', '3. Each pair is a point: (0, 1), (1, 3), (2, 5), (3, 7). Do they go up by the same amount? +2 every time — a straight line!'],
          a: 'y = 1, 3, 5, 7',
          visual: (() => { const c = (t, col) => `<td style="padding:4px 8px${col ? ';color:' + col : ''}">${t}</td>`; return `<table class="data" style="font-weight:700;font-size:.95rem"><tr>${c('x', ROSE)}${[0, 1, 2, 3].map((x) => c(x)).join('')}</tr><tr>${c('2x + 1')}${[0, 1, 2, 3].map((x) => c(`2×${x}+1`)).join('')}</tr><tr>${c('y', BLUE)}${[1, 3, 5, 7].map((y) => c(y, GREEN)).join('')}</tr></table>`; })() },
        { q: 'Find the midpoint of A(−2, 5) and B(4, 1)',
          working: ['<b>Picture:</b> the midpoint is the spot exactly halfway along the corridor AND halfway up the stairs.', '1. Halfway across: average the x’s → (−2 + 4) ÷ 2 = 2 ÷ 2 = 1.', '2. Halfway up: average the y’s → (5 + 1) ÷ 2 = 6 ÷ 2 = 3.', '3. Write x first: (1, 3).'],
          a: 'M = (1, 3)',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[-2, ROSE], [4, ROSE]], [[5, BLUE], [1, BLUE]]) + `<line x1="68" y1="20" x2="164" y2="84" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3"/>` + dot(68, 20, ROSE, 'A', -16, 6) + dot(164, 84, ROSE, 'B', 10, 6) + dot(116, 52, GREEN, 'M (1, 3)', 10, -6) + `<text x="200" y="120" fill="${ROSE}">x: (−2 + 4) ÷ 2 = 1</text><text x="200" y="146" fill="${BLUE}">y: (5 + 1) ÷ 2 = 3</text><text x="200" y="172" fill="${GREEN}">M = (1, 3)</text>`) },
        { q: 'On a netball court diagram (1 unit = 1 m), Aroha stands at (−3, 2) and Mia stands at (4, 2). How far apart are they?',
          working: ['<b>Picture:</b> both girls are on the same row of the corridor (same y), so I only count steps along.', '1. Which number is the same? y = 2 for both, so the distance is along the corridor.', '2. Which number changes? x, from −3 to 4. Bigger − smaller: 4 − (−3).', '4 − (−3) = 4 + 3 = 7'],
          a: '7 m apart',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[-3, ROSE], [4, ROSE]], [[2, BLUE]]) + `<line x1="52" y1="68" x2="164" y2="68" stroke="${GREEN}" stroke-width="4" stroke-linecap="round"/>` + dot(52, 68, ROSE, 'A', -16, 6) + dot(164, 68, ROSE, 'M', 10, 6) + `<text x="140" y="58" text-anchor="middle" fill="${GREEN}">7 units</text><text x="200" y="120" fill="${BLUE}">same y = 2</text><text x="200" y="146" fill="${ROSE}">x: 4 − (−3) = 7</text>`) },
        { q: 'The line y = 2x + 1 is drawn. For every 1 square across, how many squares up?',
          working: ['<b>Picture:</b> the corridor and the stairs again — go <b>1 step along</b> the corridor, then count the <b>stairs</b> up to get back on the line.', '1. Start on the line at (0, 1).', '2. Go <b>1 across</b> (the pink arrow) to x = 1.', '3. Count <b>up</b> until you touch the line again (the green arrow): <b>2</b>.', '4. Check the rule: y = <b>2</b>x + 1 — the number in front of x is the steepness.'],
          a: '2 up for every 1 across',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[1, ROSE]], [[1, BLUE], [3, GREEN]])
            + `<line x1="52" y1="180" x2="132" y2="20" stroke="${SKY}" stroke-width="4" stroke-linecap="round"/>`
            + `<line x1="100" y1="84" x2="116" y2="84" stroke="${ROSE}" stroke-width="4" stroke-linecap="round"/>`
            + `<line x1="116" y1="84" x2="116" y2="52" stroke="${GREEN}" stroke-width="4" stroke-linecap="round"/>`
            + dot(100, 84, ROSE, '', 0, 0) + dot(116, 52, GREEN, '', 0, 0)
            + `<text x="200" y="60" fill="${INK}">y = 2x + 1</text><text x="200" y="90" fill="${ROSE}">1 across →</text><text x="200" y="118" fill="${GREEN}">2 up ↑</text><text x="200" y="150" fill="${INK}">the 2 in 2x is</text><text x="200" y="168" fill="${INK}">the steepness</text>`) },
        { q: 'Which line is y = 3 and which is x = −2?',
          working: ['<b>Picture:</b> y = 3 is a <b>flat shelf</b> at height 3. x = −2 is an <b>upright post</b> standing at −2.', '1. y = 3: every point on it has y = 3 — (−4, 3), (0, 3), (5, 3). Only y is fixed, so the line is <b>flat</b> (horizontal).', '2. x = −2: every point has x = −2 — (−2, 5), (−2, 0), (−2, −4). Only x is fixed, so the line is <b>upright</b> (vertical).', '3. Memory hook: <b>y = a number goes across; x = a number goes up and down.</b>'],
          a: 'y = 3 is the flat one, x = −2 is the upright one',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[-2, BLUE]], [[3, ROSE]])
            + `<line x1="20" y1="52" x2="180" y2="52" stroke="${ROSE}" stroke-width="4" stroke-linecap="round"/>`
            + `<line x1="68" y1="20" x2="68" y2="180" stroke="${BLUE}" stroke-width="4" stroke-linecap="round"/>`
            + `<text x="94" y="57" text-anchor="end" fill="${ROSE}" paint-order="stroke" stroke="#fff" stroke-width="3.5">3</text>`
            + `<text x="68" y="115" text-anchor="middle" fill="${BLUE}" paint-order="stroke" stroke="#fff" stroke-width="3.5">−2</text>`
            + `<text x="200" y="60" fill="${ROSE}">y = 3 (flat)</text><text x="200" y="82" fill="${ROSE}">every y is 3</text>`
            + `<text x="200" y="122" fill="${BLUE}">x = −2 (upright)</text><text x="200" y="144" fill="${BLUE}">every x is −2</text>`) },
        { q: 'Do A(−3, −5), B(0, 1) and C(2, 5) lie on the same straight line?',
          working: ['<b>Picture:</b> walk from one point to the next. If it is one straight line, every walk must have the <b>same steepness</b>.', '1. A to B: <b>3 across</b> and <b>6 up</b> → 6 ÷ 3 = <b>2 up</b> for every 1 across.', '2. B to C: <b>2 across</b> and <b>4 up</b> → 4 ÷ 2 = <b>2 up</b> for every 1 across.', '3. Same steepness both times → <b>yes</b>, they are on one straight line.'],
          a: 'Yes — 2 up for every 1 across, both times',
          visual: SVG(360, 200, grid(100, 100, 16, 5, [[-3, ROSE], [2, ROSE]], [[-5, BLUE], [5, BLUE]])
            + `<line x1="52" y1="180" x2="132" y2="20" stroke="${SKY}" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 4"/>`
            + dot(52, 180, ROSE, 'A', -18, 4) + dot(100, 84, GREEN, 'B', -18, 4) + dot(132, 20, ROSE, 'C', -18, 4)
            + `<text x="200" y="70" fill="${ROSE}">A→B: 3 across, 6 up</text><text x="200" y="98" fill="${GREEN}">B→C: 2 across, 4 up</text><text x="200" y="132" fill="${INK}">both = 2 up for</text><text x="200" y="150" fill="${INK}">every 1 across</text><text x="200" y="176" fill="${GREEN}">so YES</text>`) },
      ],
      tips: [
        '<b>x comes first</b> because x is before y in the alphabet. Along first, then up.',
        'Quadrants are numbered <b>anticlockwise</b> starting top right: 1st (+,+), 2nd (−,+), 3rd (−,−), 4th (+,−).',
        'A point on an axis has a <b>0</b> in it: (0, 4) is on the y-axis, (−3, 0) is on the x-axis.',
        'Negative coordinates just mean walk the <b>other way</b>: left instead of right, down instead of up.',
        '<b>y = 3 is flat, x = −2 is upright.</b> Whichever letter is named, that value never changes anywhere on the line.',
        'To see how steep a line is, always go <b>1 across first</b>, then count up (or down). That number is the one in front of x.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
