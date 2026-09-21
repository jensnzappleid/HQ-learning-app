/* Topic: Angle rules — straight line, around a point, vertically opposite, triangles, quadrilaterals, parallel lines. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
  const D = Math.PI / 180;
  const r1 = (v) => Math.round(v * 10) / 10;
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-size="15" fill="${C.ink}">${body}</svg>`;
  const line = (x1, y1, x2, y2, extra = '', w = 2.5) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${C.ink}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
  const text = (x, y, s, extra = '') => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="middle" ${extra}>${s}</text>`;
  const note = (w, h) => text(w / 2, h - 8, 'not drawn to scale', `font-size="14" fill="${C.rose}"`);
  /** point at angle a° (anticlockwise from +x, screen coords) distance d from (cx, cy) */
  const pt = (cx, cy, a, d) => [cx + d * Math.cos(a * D), cy - d * Math.sin(a * D)];
  /** arc from a1° anticlockwise to a2° */
  const arc = (cx, cy, a1, a2, r, col) => {
    const [x1, y1] = pt(cx, cy, a1, r), [x2, y2] = pt(cx, cy, a2, r);
    const big = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
    return `<path d="M${r1(x1)} ${r1(y1)} A${r} ${r} 0 ${big} 0 ${r1(x2)} ${r1(y2)}" fill="none" stroke="${col}" stroke-width="3"/>`;
  };
  /** label an angle between a1 and a2 (deg) with string s */
  const angLabel = (cx, cy, a1, a2, s, col, arcR = 22) => {
    const span = ((a2 - a1) % 360 + 360) % 360;
    const mid = a1 + span / 2;
    const rad = span < 30 ? 66 : span < 60 ? 50 : 44;
    const [x, y] = pt(cx, cy, mid, rad);
    return arc(cx, cy, a1, a2, arcR, col) + text(x, y, s, s === 'x' ? `font-weight="bold" fill="${C.rose}" font-size="17"` : '');
  };
  const rightMark = (cx, cy, a) => { // small square at vertex, between direction a and a+90
    const s = 14, [x1, y1] = pt(cx, cy, a, s), [x2, y2] = pt(cx, cy, a + 45, s * Math.SQRT2), [x3, y3] = pt(cx, cy, a + 90, s);
    return `<path d="M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y2)} L${r1(x3)} ${r1(y3)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
  };
  const tick = (x1, y1, x2, y2) => { // small tick across midpoint of a side (equal sides)
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * 7, ny = dx / L * 7;
    return line(mx - nx, my - ny, mx + nx, my + ny);
  };
  /** distort angles so the drawing is plausible but NOT to scale */
  const distort = (angs, total) => {
    let d = angs.map((a) => Math.max(18, a + R.int(-9, 9)));
    const s = d.reduce((p, q) => p + q, 0);
    return d.map((a) => a * total / s);
  };
  const deg = (v) => `${v}°`;
  const cols = [C.sky, C.pink, C.mint, C.peach, C.lav, C.butter];

  // ---------- diagrams ----------
  function straightSvg(angs, labels) {
    const cx = 160, cy = 160, d = distort(angs, 180);
    let b = line(20, cy, 300, cy), a = 0;
    d.forEach((v, i) => { b += angLabel(cx, cy, a, a + v, labels[i], cols[i], 18 + 5 * i); a += v; if (i < d.length - 1) { const [x, y] = pt(cx, cy, a, 115); b += line(cx, cy, x, y); } });
    return svg(320, 200, b + note(320, 200));
  }
  function pointSvg(angs, labels) {
    const cx = 160, cy = 105, d = distort(angs, 360);
    let b = '', a = R.int(0, 60);
    d.forEach((v, i) => { const [x, y] = pt(cx, cy, a, 85); b += line(cx, cy, x, y) + angLabel(cx, cy, a, a + v, labels[i], cols[i], 18 + 5 * i); a += v; });
    return svg(320, 220, b + note(320, 220));
  }
  function vertOppSvg(a, labels) { // labels: [region0 (between line1 and line2), region1, region2, region3]
    const cx = 160, cy = 105, phi = R.int(-15, 15), ad = Math.max(25, Math.min(155, a + R.int(-9, 9)));
    const dirs = [phi, phi + ad, phi + 180, phi + 180 + ad];
    let b = '';
    [0, 1].forEach((i) => { const [x1, y1] = pt(cx, cy, dirs[i], 120), [x2, y2] = pt(cx, cy, dirs[i] + 180, 120); b += line(x1, y1, x2, y2); });
    for (let i = 0; i < 4; i++) if (labels[i]) b += angLabel(cx, cy, dirs[i], dirs[(i + 1) % 4] + (i === 3 ? 360 : 0), labels[i], cols[i]);
    return svg(320, 220, b + note(320, 220));
  }
  /** angs = [apex, left, right] (apex may be obtuse; base angles must be acute). opts: {ticks:[sideIdx], ext:'label', right:bool} */
  function triangleSvg(angs, labels, opts = {}) {
    const d = distort(angs, 180);
    const bb = Math.min(80, Math.max(20, d[1])), cc = Math.min(80, Math.max(20, d[2]));
    const cotb = 1 / Math.tan(bb * D), cotc = 1 / Math.tan(cc * D);
    let base = opts.ext ? 200 : 240, h = base / (cotb + cotc);
    if (h > 145) { h = 145; base = h * (cotb + cotc); }
    if (h < 50) { h = 50; base = Math.min(240, h * (cotb + cotc)); }
    const x0 = (opts.ext ? 130 : 160) - base / 2, y0 = 185;
    const B = [x0, y0], Cc = [x0 + base, y0], A = [x0 + h * cotb, y0 - h];
    const P = [A, B, Cc];
    let b = `<polygon points="${P.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${C.sky}" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    // labels at vertices along bisector
    P.forEach((V, i) => {
      const Q1 = P[(i + 1) % 3], Q2 = P[(i + 2) % 3];
      const u1 = [Q1[0] - V[0], Q1[1] - V[1]], u2 = [Q2[0] - V[0], Q2[1] - V[1]];
      const l1 = Math.hypot(...u1), l2 = Math.hypot(...u2);
      const dx = u1[0] / l1 + u2[0] / l2, dy = u1[1] / l1 + u2[1] / l2, L = Math.hypot(dx, dy);
      if (opts.right === i) { const a0 = Math.atan2(-(u1[1]), u1[0]) / D; const a1 = Math.atan2(-(u2[1]), u2[0]) / D; b += rightMark(V[0], V[1], ((a1 - a0) % 360 + 360) % 360 < 180 ? a0 : a1); }
      if (!labels[i]) return;
      const ang = i === 0 ? d[0] : i === 1 ? bb : cc, rad = ang < 35 ? 52 : 34;
      const lx = V[0] + dx / L * rad, ly = V[1] + dy / L * rad;
      b += text(lx, ly, labels[i], labels[i] === 'x' ? `font-weight="bold" fill="${C.rose}" font-size="17"` : '');
    });
    (opts.ticks || []).forEach((s) => { const p = P[s], q = P[(s + 1) % 3]; b += tick(p[0], p[1], q[0], q[1]); }); // side s = P[s]→P[s+1]: 0 = A-B, 1 = B-C, 2 = C-A
    if (opts.ext) { // extend base past C, exterior angle label at C
      b += line(Cc[0], Cc[1], Cc[0] + 80, Cc[1], 'stroke-dasharray="6 5"');
      const aA = Math.atan2(-(A[1] - Cc[1]), A[0] - Cc[0]) / D; // direction C→A
      b += angLabel(Cc[0], Cc[1], 0, aA, opts.ext, C.peach);
    }
    return svg(320, 210, b + note(320, 210));
  }
  function quadSvg(labels) {
    const j = () => R.int(-12, 12);
    const P = [[45 + j(), 180 + j()], [280 + j(), 172 + j()], [245 + j(), 45 + j()], [70 + j(), 55 + j()]];
    let b = `<polygon points="${P.map((p) => p.join(',')).join(' ')}" fill="${C.mint}" fill-opacity=".4" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    P.forEach((V, i) => {
      const Q1 = P[(i + 1) % 4], Q2 = P[(i + 3) % 4];
      const u1 = [Q1[0] - V[0], Q1[1] - V[1]], u2 = [Q2[0] - V[0], Q2[1] - V[1]];
      const l1 = Math.hypot(...u1), l2 = Math.hypot(...u2);
      const dx = u1[0] / l1 + u2[0] / l2, dy = u1[1] / l1 + u2[1] / l2, L = Math.hypot(dx, dy);
      b += text(V[0] + dx / L * 34, V[1] + dy / L * 34, labels[i], labels[i] === 'x' ? `font-weight="bold" fill="${C.rose}" font-size="17"` : '');
    });
    return svg(320, 215, b + note(320, 215));
  }
  /** parallel lines + transversal. labels keyed by 'T-UR','T-UL','T-LL','T-LR','B-UR',... */
  function parallelSvg(labels) {
    const y1 = 60, y2 = 150, phi = R.int(50, 68), cot = 1 / Math.tan(phi * D);
    const xT = 175, xB = xT - (y2 - y1) * cot;
    let b = line(15, y1, 305, y1) + line(15, y2, 305, y2);
    // arrows on parallel lines
    [y1, y2].forEach((y) => { b += `<path d="M262 ${y - 6} L272 ${y} L262 ${y + 6}" fill="none" stroke="${C.ink}" stroke-width="2"/>`; });
    const dx = 40 * cot, dy = 40;
    b += line(xB - dx * 1.6, y2 + dy * 1.6, xT + dx * 1.3, y1 - dy * 1.3);
    const spans = { UR: [0, phi], UL: [phi, 180], LL: [180, 180 + phi], LR: [180 + phi, 360] };
    Object.keys(labels).forEach((k) => {
      const [which, reg] = k.split('-'); const cx = which === 'T' ? xT : xB, cy = which === 'T' ? y1 : y2;
      const [a1, a2] = spans[reg];
      b += angLabel(cx, cy, a1, a2, labels[k], which === 'T' ? C.pink : C.sky);
    });
    return svg(320, 215, b + note(320, 215));
  }
  function singleAngleSvg(a) {
    const cx = a > 180 ? 150 : a === 180 ? 135 : 120, cy = a > 180 ? 110 : 150, phi = R.int(0, 20);
    const len = a === 180 ? 105 : 120;
    const [x1, y1] = pt(cx, cy, phi, len), [x2, y2] = pt(cx, cy, phi + a, a > 180 ? 90 : len);
    let b = line(cx, cy, x1, y1) + line(cx, cy, x2, y2) + arc(cx, cy, phi, phi + a, 30, C.rose);
    if (a === 90) b += rightMark(cx, cy, phi);
    if (a === 180) b += `<circle cx="${cx}" cy="${cy}" r="5" fill="${C.ink}"/>`;
    return svg(320, 210, b);
  }
  function clockSvg(h, half) {
    const cx = 160, cy = 105, r = 90;
    let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.butter}" fill-opacity=".5" stroke="${C.ink}" stroke-width="2.5"/>`;
    for (let i = 1; i <= 12; i++) { const [x, y] = pt(cx, cy, 90 - i * 30, r - 14); b += text(x, y, i, 'font-size="14"'); }
    const hd = 90 - (h * 30 + (half ? 15 : 0)), md = half ? -90 : 90;
    const [hx, hy] = pt(cx, cy, hd, 50), [mx, my] = pt(cx, cy, md, 70);
    b += line(cx, cy, hx, hy, '', 5) + line(cx, cy, mx, my, '', 3) + `<circle cx="${cx}" cy="${cy}" r="4"/>`;
    return svg(320, 210, b);
  }
  function rampSvg(a, labelGround, labelWall) {
    const d = Math.max(20, Math.min(60, a + R.int(-8, 8)));
    const w = Math.min(230, Math.round(140 / Math.tan(d * D))), h = w * Math.tan(d * D);
    const x0 = 160 - w / 2, y0 = 168;
    let b = `<polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w},${r1(y0 - h)}" fill="${C.peach}" fill-opacity=".5" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    b += rightMark(x0 + w, y0, 90);
    b += angLabel(x0, y0, 0, d, labelGround, C.rose);
    b += angLabel(x0 + w, y0 - h, 180 + d, 270, labelWall, C.sky);
    b += text(x0 + w / 2, y0 + 16, 'ground', 'font-size="14"');
    return svg(320, 210, b + note(320, 210));
  }
  function pizzaSvg(n, labelIdx) {
    const cx = 160, cy = 105, r = 88; let b = '';
    for (let i = 0; i < n; i++) {
      const a1 = 360 / n * i, a2 = a1 + 360 / n, [x1, y1] = pt(cx, cy, a1, r), [x2, y2] = pt(cx, cy, a2, r);
      b += `<path d="M${cx} ${cy} L${r1(x1)} ${r1(y1)} A${r} ${r} 0 0 0 ${r1(x2)} ${r1(y2)} Z" fill="${cols[i % cols.length]}" stroke="${C.ink}" stroke-width="2"/>`;
    }
    const [lx, ly] = pt(cx, cy, 360 / n * labelIdx + 180 / n, 55);
    b += text(lx, ly, 'x', `font-weight="bold" fill="${C.rose}" font-size="17"`);
    return svg(320, 210, b);
  }

  const numAns = (v) => ({ type: 'number', value: v, unit: '°' });
  const choiceQ = (prompt, visual, options, correct, hint, working, extra = {}) => {
    const order = R.shuffle(options.map((_, i) => i));
    return Object.assign({ prompt, visual, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct] }, extra);
  };
  const rules = ['Angles on a straight line add to 180°', 'Angles around a point add to 360°', 'Vertically opposite angles are equal', 'Angles in a triangle add to 180°'];

  // ---------- question makers ----------
  function straight(n) { // n known angles + x
    const parts = []; let left = 180;
    for (let i = 0; i < n; i++) { const v = R.step(20, left - 20 * (n - i) - 5, 5); parts.push(v); left -= v; }
    const x = left; if (x < 15) return straight(n);
    const all = R.shuffle(parts.concat([x])), xi = all.indexOf(x);
    return {
      prompt: 'Find the angle marked <b>x</b>.',
      visual: straightSvg(all, all.map((v, i) => (i === xi ? 'x' : deg(v)))),
      answer: numAns(x),
      hint: 'Angles on a straight line add up to 180°.',
      working: [`Angles on a straight line add to 180°.`, `x = 180 − ${parts.length > 1 ? '(' + parts.join(' + ') + ')' : parts[0]}${parts.length > 1 ? ' = 180 − ' + (180 - x) : ''}.`, `x = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'straight-line',
    };
  }
  function point(n) {
    const parts = []; let left = 360;
    for (let i = 0; i < n; i++) { const v = R.step(40, Math.min(170, left - 40 * (n - i) - 5), 5); parts.push(v); left -= v; }
    const x = left; if (x < 30 || x > 200) return point(n);
    const all = R.shuffle(parts.concat([x])), xi = all.indexOf(x);
    return {
      prompt: 'Find the angle marked <b>x</b>.',
      visual: pointSvg(all, all.map((v, i) => (i === xi ? 'x' : deg(v)))),
      answer: numAns(x),
      hint: 'Angles around a point add up to 360°.',
      working: ['Angles around a point add to 360°.', `Known angles: ${parts.join(' + ')} = ${360 - x}.`, `x = 360 − ${360 - x} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'around-point',
    };
  }
  function vertOpp(level) {
    const a = R.step(25, 155, 5);
    const labels = ['', '', '', '']; const k = R.int(0, 3); labels[k] = deg(a);
    if (level >= 2 && R.chance(0.4)) { // find the adjacent angle instead
      labels[(k + 1) % 4] = 'x';
      return {
        prompt: 'Two straight lines cross. Find the angle marked <b>x</b>.',
        visual: vertOppSvg(a, labels), answer: numAns(180 - a),
        hint: 'The two angles sit next to each other on a straight line.',
        working: ['x and the ' + deg(a) + ' angle are on a straight line, so they add to 180°.', `x = 180 − ${a} = <b>${180 - a}°</b>.`],
        finalAnswer: deg(180 - a), skill: 'vert-opp',
      };
    }
    labels[(k + 2) % 4] = 'x';
    return {
      prompt: 'Two straight lines cross. Find the angle marked <b>x</b>.',
      visual: vertOppSvg(a, labels), answer: numAns(a),
      hint: 'x is opposite the known angle, across the crossing point.',
      working: ['x and the ' + deg(a) + ' angle are vertically opposite (they are across from each other at the crossing).', 'Vertically opposite angles are equal.', `x = <b>${a}°</b>.`],
      finalAnswer: deg(a), skill: 'vert-opp',
    };
  }
  function triangle(level) {
    let a, b;
    do { a = R.step(20, 120, 5); b = R.step(20, 120, 5); } while (a + b >= 165);
    const x = 180 - a - b;
    const angs = [a, b, x]; // choose apex = largest so base angles are acute
    const order = [0, 1, 2].sort((i, j) => angs[j] - angs[i]); // order[0] = apex
    const arr = order.map((i) => angs[i]), labels = order.map((i) => (i === 2 ? 'x' : deg(angs[i])));
    return {
      prompt: 'Find the angle marked <b>x</b> in the triangle.',
      visual: triangleSvg(arr, labels), answer: numAns(x),
      hint: 'The three angles in any triangle add up to 180°.',
      working: ['Angles in a triangle add to 180°.', `${a} + ${b} = ${a + b}.`, `x = 180 − ${a + b} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'triangle',
    };
  }
  function rightTriangle() {
    const a = R.step(20, 70, 5), x = 90 - a;
    const arr = [90, a, x], labels = ['', deg(a), 'x'];
    return {
      prompt: 'This is a right-angled triangle. Find the angle marked <b>x</b>.',
      visual: triangleSvg(arr, labels, { right: 0 }), answer: numAns(x),
      hint: 'The square corner is 90°. All three angles add to 180°.',
      working: ['Angles in a triangle add to 180°. The right angle is 90°.', `90 + ${a} = ${90 + a}.`, `x = 180 − ${90 + a} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'triangle',
    };
  }
  function isosceles() {
    if (R.chance(0.5)) { // apex given, find base angle
      const apex = R.step(20, 120, 10), x = (180 - apex) / 2;
      return {
        prompt: 'The triangle is isosceles (the marked sides are equal). Find the angle marked <b>x</b>.',
        visual: triangleSvg([apex, x, x], [deg(apex), 'x', ''], { ticks: [0, 2] }), answer: numAns(x),
        hint: 'In an isosceles triangle the two base angles (at the ends of the equal sides) are equal.',
        working: ['The two base angles are equal, so both are x.', `x + x + ${apex} = 180, so 2x = ${180 - apex}.`, `x = ${180 - apex} ÷ 2 = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'isosceles',
      };
    }
    const base = R.step(25, 80, 5), x = 180 - 2 * base;
    return {
      prompt: 'The triangle is isosceles (the marked sides are equal). Find the angle marked <b>x</b>.',
      visual: triangleSvg([x, base, base], ['x', deg(base), ''], { ticks: [0, 2] }), answer: numAns(x),
      hint: 'The other base angle is also ' + base + '°. Then use 180°.',
      working: [`The two base angles are equal, so the other one is also ${base}°.`, `${base} + ${base} = ${2 * base}.`, `x = 180 − ${2 * base} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'isosceles',
    };
  }
  function quad() {
    let a, b, c;
    do { a = R.step(50, 130, 5); b = R.step(50, 130, 5); c = R.step(50, 130, 5); } while (a + b + c < 200 || a + b + c > 320);
    const x = 360 - a - b - c;
    const vals = R.shuffle([a, b, c, x]), xi = vals.indexOf(x);
    return {
      prompt: 'Find the angle marked <b>x</b> in the quadrilateral.',
      visual: quadSvg(vals.map((v, i) => (i === xi ? 'x' : deg(v)))), answer: numAns(x),
      hint: 'The four angles in any quadrilateral add up to 360°.',
      working: ['Angles in a quadrilateral add to 360°.', `${a} + ${b} + ${c} = ${a + b + c}.`, `x = 360 − ${a + b + c} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'quadrilateral',
    };
  }
  function nameType(level) {
    const kind = R.pick(level === 1 ? ['acute', 'right angle', 'obtuse'] : ['acute', 'right angle', 'obtuse', 'reflex', 'straight angle']);
    const a = kind === 'acute' ? R.step(20, 80, 5) : kind === 'right angle' ? 90 : kind === 'obtuse' ? R.step(100, 170, 5) : kind === 'straight angle' ? 180 : R.step(200, 330, 10);
    const all = ['acute', 'right angle', 'obtuse', 'reflex', 'straight angle'];
    const opts = R.sample(all.filter((o) => o !== kind), 3).concat([kind]);
    const showVal = R.chance(0.5);
    const why = { acute: 'Less than 90° → acute.', 'right angle': 'Exactly 90° → right angle.', obtuse: 'Between 90° and 180° → obtuse.', 'straight angle': 'Exactly 180°, a straight line → straight angle.', reflex: 'More than 180° → reflex.' }[kind];
    return choiceQ(
      showVal ? `An angle measures ${a}°. What type of angle is it?` : 'What type of angle is shown?',
      singleAngleSvg(a), opts, opts.indexOf(kind),
      'Acute is less than 90°, a right angle is exactly 90°, obtuse is between 90° and 180°, a straight angle is exactly 180°, reflex is more than 180°.',
      [`The angle is ${a}°.`, why, `Answer: <b>${kind}</b>.`], { skill: 'angle-type' });
  }
  function whichRule() {
    const k = R.int(0, 3);
    let visual;
    if (k === 0) { const a = R.step(40, 140, 10); visual = straightSvg([a, 180 - a], [deg(a), 'x']); }
    else if (k === 1) { const a = R.step(100, 160, 10), b = R.step(90, 150, 10); visual = pointSvg([a, b, 360 - a - b], [deg(a), deg(b), 'x']); }
    else if (k === 2) { const a = R.step(30, 150, 10); const l = ['', '', '', '']; l[0] = deg(a); l[2] = 'x'; visual = vertOppSvg(a, l); }
    else { const a = R.step(40, 90, 5), b = R.step(30, 70, 5); visual = triangleSvg([180 - a - b, a, b], ['x', deg(a), deg(b)]); }
    return choiceQ('Which rule would you use to find <b>x</b>?', visual, rules, k,
      'Look at the picture: is x on a straight line, around a point, across a crossing, or inside a triangle?',
      [['x sits on a straight line with the other angle.', 'x is one of the angles meeting at a point (a full turn).', 'x is across the crossing from the known angle.', 'x is inside a triangle.'][k], `Rule: <b>${rules[k]}</b>.`]);
  }
  function parallel() {
    const type = R.pick(['corresponding', 'alternate', 'co-interior']);
    const a = R.step(40, 140, 5);
    const regs = ['UR', 'UL', 'LL', 'LR'];
    const angleAt = { UR: a, UL: 180 - a, LL: a, LR: 180 - a }; // if UR = a
    // pick known position at T
    const kReg = R.pick(regs); const known = angleAt[kReg];
    let xReg, x, why;
    if (type === 'corresponding') { xReg = kReg; x = known; why = 'Corresponding angles (the F shape) are equal.'; }
    else if (type === 'alternate') { xReg = { UR: 'LL', LL: 'UR', UL: 'LR', LR: 'UL' }[kReg]; x = known; why = 'Alternate angles (the Z shape) are equal.'; }
    else { xReg = { UR: 'LR', LR: 'UR', UL: 'LL', LL: 'UL' }[kReg]; x = 180 - known; why = 'Co-interior angles (the C shape, between the parallel lines on the same side) add to 180°.'; }
    const labels = {}; labels['T-' + kReg] = deg(known); labels['B-' + xReg] = 'x';
    if (R.chance(0.5)) { // swap which line has the known angle
      for (const k in labels) delete labels[k];
      labels['B-' + kReg] = deg(known); labels['T-' + xReg] = 'x';
    }
    return {
      prompt: 'The two lines with arrows are parallel. Find the angle marked <b>x</b>.',
      visual: parallelSvg(labels), answer: numAns(x),
      hint: type === 'co-interior' ? 'The two angles are between the parallel lines on the same side (a C shape). They add to 180°.' : type === 'alternate' ? 'Look for a Z shape. Alternate angles are equal.' : 'Look for an F shape. Corresponding angles are equal.',
      working: [`x and ${known}° are ${type} angles.`, why, type === 'co-interior' ? `x = 180 − ${known} = <b>${x}°</b>.` : `x = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'parallel',
    };
  }
  function parallelTwoStep() { // known angle is vertically opposite / on a straight line with the alternate of x
    let a = 90; while (a === 90) a = R.step(40, 140, 5);
    const angleAt = { UR: a, UL: 180 - a, LL: a, LR: 180 - a };
    const kReg = R.pick(['UR', 'UL', 'LL', 'LR']); const known = angleAt[kReg];
    const xReg = R.pick(['UR', 'UL', 'LL', 'LR'].filter((r) => r !== kReg && angleAt[r] !== known)); // different value, other line
    const x = 180 - known;
    const labels = {}; labels['T-' + kReg] = deg(known); labels['B-' + xReg] = 'x';
    return {
      prompt: 'The two lines with arrows are parallel. Find the angle marked <b>x</b>. (Two steps.)',
      visual: parallelSvg(labels), answer: numAns(x),
      hint: 'First find the angle next to ' + known + '° on the straight line. Then use corresponding or alternate angles.',
      working: [`The angle next to ${known}° on the straight line is 180 − ${known} = ${x}°.`, 'That angle and x are corresponding (or alternate) angles, so they are equal.', `x = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'parallel',
    };
  }
  function exterior() {
    const a = R.step(30, 80, 5), ext = R.step(a + 25, 150, 5); // exterior at C = a + x
    const x = ext - a; if (x < 20) return exterior();
    const angs = [x, a, 180 - ext]; // apex = x? need apex largest... just use the interior angles: apex value x at A, left a at B, right (180 − ext) at C
    const order = [0, 1, 2].sort((i, j) => angs[j] - angs[i]);
    // keep C as the right base vertex (index 2) for the extension: apex must be A or B; ensure C's angle is acute (it is, 180 − ext < 90 when ext > 90) — if ext ≤ 90 swap roles
    if (180 - ext >= 90) return exterior();
    const apexIsA = angs[0] >= angs[1];
    const arr = apexIsA ? [x, a, 180 - ext] : [a, x, 180 - ext];
    const labels = apexIsA ? ['x', deg(a), ''] : [deg(a), 'x', ''];
    return {
      prompt: 'The base of the triangle is extended. Find the angle marked <b>x</b>.',
      visual: triangleSvg(arr, labels, { ext: deg(ext) }), answer: numAns(x),
      hint: 'First find the inside angle next to ' + ext + '° (straight line). Then use the triangle rule.',
      working: [`The inside angle at that corner is 180 − ${ext} = ${180 - ext}° (straight line).`, `Angles in a triangle add to 180°: ${a} + ${180 - ext} = ${a + 180 - ext}.`, `x = 180 − ${a + 180 - ext} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'multi-step',
    };
  }
  function isoStraight() { // isosceles with exterior angle at base given, find apex
    const base = R.step(30, 75, 5), ext = 180 - base, x = 180 - 2 * base;
    return {
      prompt: 'The triangle is isosceles (marked sides equal) and its base is extended. Find the angle marked <b>x</b>.',
      visual: triangleSvg([x, base, base], ['x', '', ''], { ticks: [0, 2], ext: deg(ext) }), answer: numAns(x),
      hint: 'Straight line first (find the base angle), then the two base angles are equal, then 180° in the triangle.',
      working: [`Base angle next to ${ext}°: 180 − ${ext} = ${base}° (straight line).`, `Isosceles, so the other base angle is also ${base}°.`, `x = 180 − ${base} − ${base} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'multi-step',
    };
  }
  function pointWithRight() { // around a point with a right angle marker
    const a = R.step(60, 150, 5), b = R.step(60, 150, 5), x = 360 - 90 - a - b;
    if (x < 30 || x > 150) return pointWithRight();
    const all = [90, a, b, x];
    const labels = ['90°', deg(a), deg(b), 'x'];
    return {
      prompt: 'Find the angle marked <b>x</b>. One of the angles is a right angle.',
      visual: pointSvg(all, labels), answer: numAns(x),
      hint: 'Angles around a point add to 360°. The right angle is 90°.',
      working: ['Angles around a point add to 360°.', `90 + ${a} + ${b} = ${90 + a + b}.`, `x = 360 − ${90 + a + b} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'around-point',
    };
  }

  // ---------- complementary / supplementary, protractor, polygons, compass ----------
  /** a right angle at one vertex split into parts (they add to 90) */
  function rightSplitSvg(parts, labels) {
    const cx = 62, cy = 178, d = distort(parts, 90);
    let b = line(cx, cy, cx + 224, cy) + line(cx, cy, cx, cy - 158);
    let a = 0;
    d.forEach((v, i) => {
      b += arc(cx, cy, a, a + v, 34 + 9 * i, cols[i]);
      const rad = v < 25 ? 98 : v < 45 ? 80 : 64;
      const [lx, ly] = pt(cx, cy, a + v / 2, rad);
      b += text(lx, ly, labels[i], labels[i] === 'x' ? `font-weight="bold" fill="${C.rose}" font-size="17"` : '');
      a += v;
      if (i < d.length - 1) { const [x, y] = pt(cx, cy, a, 150); b += line(cx, cy, x, y); }
    });
    b += rightMark(cx, cy, 0);
    return svg(320, 210, b + note(320, 210));
  }
  function protractorSvg(a) {
    const cx = 160, cy = 176, r = 100;
    let b = `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z" fill="${C.butter}" fill-opacity=".45" stroke="${C.ink}" stroke-width="2"/>`;
    for (let t = 0; t <= 180; t += 5) {
      const [x1, y1] = pt(cx, cy, t, r), [x2, y2] = pt(cx, cy, t, t % 10 === 0 ? r - 13 : r - 7);
      b += line(x1, y1, x2, y2, '', t % 30 === 0 ? 2 : 1);
    }
    for (let t = 0; t <= 180; t += 30) { const [tx, ty] = pt(cx, cy, t, r - 30); b += text(tx, ty + (t === 0 || t === 180 ? -13 : 0), t, 'font-size="13"'); }
    const [ex, ey] = pt(cx, cy, 0, r + 16), [ax, ay] = pt(cx, cy, a, r + 16);
    const arm = (x2, y2) => `<line x1="${cx}" y1="${cy}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${C.rose}" stroke-width="3.5" stroke-linecap="round"/>`;
    b += arm(ex, ey) + arm(ax, ay);
    b += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.ink}"/>`;
    return svg(320, 200, b);
  }
  const compassDirs = [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]];
  const dirName = { N: 'N (north)', NE: 'NE (north-east)', E: 'E (east)', SE: 'SE (south-east)', S: 'S (south)', SW: 'SW (south-west)', W: 'W (west)', NW: 'NW (north-west)' };
  function compassSvg(bearing) {
    const cx = 160, cy = 104, r = 70;
    let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" fill-opacity=".25" stroke="${C.ink}" stroke-width="2"/>`;
    compassDirs.forEach(([nm, br]) => {
      const ang = 90 - br, main = br % 90 === 0;
      const [x1, y1] = pt(cx, cy, ang, r - (main ? 14 : 9)), [x2, y2] = pt(cx, cy, ang, r);
      b += line(x1, y1, x2, y2, '', main ? 2.5 : 1.5);
      const [tx, ty] = pt(cx, cy, ang, r + 18);
      b += text(tx, ty, nm, `font-size="${main ? 15 : 13}" font-weight="700"`);
    });
    if (bearing != null) {
      const ang = 90 - bearing;
      const [tipx, tipy] = pt(cx, cy, ang, r - 6), [bx, by] = pt(cx, cy, ang, r - 22);
      const [p1x, p1y] = pt(cx, cy, ang + 9, r - 24), [p2x, p2y] = pt(cx, cy, ang - 9, r - 24);
      b += `<line x1="${cx}" y1="${cy}" x2="${r1(bx)}" y2="${r1(by)}" stroke="${C.rose}" stroke-width="4" stroke-linecap="round"/>`;
      b += `<polygon points="${r1(tipx)},${r1(tipy)} ${r1(p1x)},${r1(p1y)} ${r1(p2x)},${r1(p2y)}" fill="${C.rose}"/>`;
      if (bearing > 0) b += arc(cx, cy, 90 - bearing, 90, r - 34, C.rose).replace('stroke-width="3"', 'stroke-width="2" stroke-dasharray="4 3"');
    }
    b += `<circle cx="${cx}" cy="${cy}" r="4" fill="${C.ink}"/>`;
    return svg(320, 200, b);
  }
  /** polygon with an angle label inside each corner */
  function polyAngSvg(n, labels) {
    const P = [];
    for (let i = 0; i < n; i++) {
      const a = 90 + 360 / n * i + R.int(-6, 6), rr = 76 + R.int(-7, 7);
      P.push([160 + rr * Math.cos(a * D), 100 - rr * Math.sin(a * D)]);
    }
    let b = `<polygon points="${P.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${C.lav}" fill-opacity=".4" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    P.forEach((V, i) => {
      const Q1 = P[(i + 1) % n], Q2 = P[(i + n - 1) % n];
      const u1 = [Q1[0] - V[0], Q1[1] - V[1]], u2 = [Q2[0] - V[0], Q2[1] - V[1]];
      const l1 = Math.hypot(...u1), l2 = Math.hypot(...u2);
      const dx = u1[0] / l1 + u2[0] / l2, dy = u1[1] / l1 + u2[1] / l2, L = Math.hypot(dx, dy) || 1;
      b += text(V[0] + dx / L * 33, V[1] + dy / L * 33, labels[i], labels[i] === 'x' ? `font-weight="bold" fill="${C.rose}" font-size="17"` : '');
    });
    return svg(320, 205, b + note(320, 205));
  }

  function complement(level) {
    const a = level === 1 ? R.step(10, 80, 10) : R.step(10, 80, 5);
    const x = 90 - a, first = R.chance(0.5);
    const parts = first ? [a, x] : [x, a], labs = first ? [deg(a), 'x'] : ['x', deg(a)];
    if (R.chance(0.45)) {
      return {
        prompt: `Find the <b>complement</b> of ${a}°.`,
        visual: rightSplitSvg(parts, labs), answer: numAns(x),
        hint: 'Complementary angles add to 90°. Take the angle away from 90.',
        working: ['<b>Complementary</b> angles add to <b>90°</b> (together they make a right angle).', `x = 90 − ${a} = ${x}.`, `The complement of ${a}° is <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'complementary',
      };
    }
    return {
      prompt: 'These two angles are <b>complementary</b> (together they make a right angle). Find the angle marked <b>x</b>.',
      visual: rightSplitSvg(parts, labs), answer: numAns(x),
      hint: 'Complementary angles add to 90°.',
      working: ['The two angles make a <b>right angle</b>, so they add to <b>90°</b>.', `x = 90 − ${a} = ${x}.`, `x = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'complementary',
    };
  }
  function supplement(level) {
    const a = level === 1 ? R.step(20, 160, 10) : R.step(15, 165, 5);
    const x = 180 - a, first = R.chance(0.5);
    const parts = first ? [a, x] : [x, a], labs = first ? [deg(a), 'x'] : ['x', deg(a)];
    if (R.chance(0.45)) {
      return {
        prompt: `Find the <b>supplement</b> of ${a}°.`,
        visual: straightSvg(parts, labs), answer: numAns(x),
        hint: 'Supplementary angles add to 180°. Take the angle away from 180.',
        working: ['<b>Supplementary</b> angles add to <b>180°</b> (together they make a straight line).', `x = 180 − ${a} = ${x}.`, `The supplement of ${a}° is <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'supplementary',
      };
    }
    return {
      prompt: 'These two angles are <b>supplementary</b> (together they make a straight line). Find the angle marked <b>x</b>.',
      visual: straightSvg(parts, labs), answer: numAns(x),
      hint: 'Supplementary angles add to 180°.',
      working: ['The two angles make a <b>straight line</b>, so they add to <b>180°</b>.', `x = 180 − ${a} = ${x}.`, `x = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'supplementary',
    };
  }
  function compSupName() {
    const opts = ['complementary (they add to 90°)', 'supplementary (they add to 180°)', 'vertically opposite (they are equal)'];
    const comp = R.chance(0.5), total = comp ? 90 : 180, correct = comp ? 0 : 1;
    const form = R.int(0, 2);
    if (form === 0) {
      const a = comp ? R.step(15, 75, 5) : R.step(25, 155, 5), b = total - a;
      return choiceQ(`${a}° and ${b}° are …?`, null, opts, correct,
        `Add them up: ${a} + ${b} = ${total}. Which word means "adds to ${total}°"?`,
        [`${a} + ${b} = ${total}.`, comp ? 'Two angles that add to <b>90°</b> are <b>complementary</b> (they make a right angle corner).' : 'Two angles that add to <b>180°</b> are <b>supplementary</b> (they make a straight line).', `Answer: <b>${opts[correct]}</b>.`], { skill: 'vocab' });
    }
    if (form === 1) {
      return choiceQ(`Two angles add up to ${total}°. What are they called?`, null, opts, correct,
        comp ? '90° is a right angle corner. C for corner, C for complementary.' : '180° is a straight line. S for straight, S for supplementary.',
        [comp ? 'Angles that add to <b>90°</b> make a right angle.' : 'Angles that add to <b>180°</b> make a straight line.', `They are <b>${opts[correct]}</b>.`], { skill: 'vocab' });
    }
    const a = comp ? R.step(20, 70, 5) : R.step(30, 150, 5);
    return choiceQ('What are the two marked angles called?',
      comp ? rightSplitSvg([a, 90 - a], ['a', 'b']) : straightSvg([a, 180 - a], ['a', 'b']), opts, correct,
      comp ? 'The two angles sit inside a right angle (the little square).' : 'The two angles sit on a straight line.',
      [comp ? 'The little square shows a <b>right angle</b>, so a + b = 90°.' : 'The two angles are on a <b>straight line</b>, so a + b = 180°.', `They are <b>${opts[correct]}</b>.`], { skill: 'vocab' });
  }
  function protractor(level) {
    const a = level === 1 ? R.step(20, 160, 10) : R.step(15, 165, 5);
    return {
      prompt: 'Read the protractor. What is the size of this angle?',
      visual: protractorSvg(a), answer: numAns(a),
      hint: 'Start at 0 on the right and count round the scale to the second arm.',
      working: ['One arm sits on <b>0</b>, so I can read the other arm straight off.', 'Follow the numbers round the scale: 30, 60, 90, 120, 150 …',
        `Estimate first: the angle is <b>${a === 90 ? 'exactly a right angle' : a < 90 ? 'narrower than a right angle, so it must be less than 90°' : 'wider than a right angle, so it must be more than 90°'}</b>.`,
        `The angle is <b>${a}°</b>.`],
      finalAnswer: deg(a), skill: 'protractor',
    };
  }
  function estimate() {
    const pool = [20, 45, 70, 95, 120, 145, 170];
    const a = R.pick(pool);
    const opts = R.shuffle(R.sample(pool.filter((v) => Math.abs(v - a) >= 45), 3).concat([a])).map(deg);
    return choiceQ('Estimate the size of this angle.', singleAngleSvg(a), opts, opts.indexOf(deg(a)),
      'Compare it with a right angle (90°). Is it smaller, about the same, or bigger?',
      [a < 90 ? 'The angle is <b>smaller</b> than a right angle, so it is less than 90°.' : a === 90 ? 'The angle is exactly a right angle.' : 'The angle is <b>bigger</b> than a right angle, so it is more than 90°.', `The best estimate is <b>${deg(a)}</b>.`], { skill: 'estimate' });
  }
  function polygonAngles(level) {
    const n = level === 3 ? R.pick([5, 6, 6]) : 5;
    const sum = (n - 2) * 180;
    if (R.chance(0.35)) {
      const m = R.pick([5, 6, 7, 8]);
      const nm = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' }[m];
      return {
        prompt: `What do the inside angles of ${/^[aeiou]/.test(nm) ? 'an' : 'a'} ${nm} (${m} sides) add up to?`,
        visual: polyAngSvg(m, new Array(m).fill('')), answer: numAns((m - 2) * 180),
        hint: 'Split the shape into triangles from one corner: (number of sides − 2) triangles, each 180°.',
        working: [`A ${nm} splits into ${m} − 2 = ${m - 2} triangles.`, `${m - 2} × 180 = ${(m - 2) * 180}.`, `The angles add to <b>${(m - 2) * 180}°</b>.`],
        finalAnswer: deg((m - 2) * 180), skill: 'polygon-sum',
      };
    }
    let angs, x, guard = 0;
    do { angs = []; for (let i = 0; i < n - 1; i++) angs.push(R.step(85, 150, 5)); x = sum - angs.reduce((p, q) => p + q, 0); guard++; } while ((x < 60 || x > 175) && guard < 200);
    if (x < 60 || x > 175) return polygonAngles(level);
    const all = R.shuffle(angs.concat([x])), xi = all.indexOf(x);
    const nm = n === 5 ? 'pentagon' : 'hexagon';
    return {
      prompt: `Find the angle marked <b>x</b> in this ${nm}.`,
      visual: polyAngSvg(n, all.map((v, i) => (i === xi ? 'x' : deg(v)))), answer: numAns(x),
      hint: `First find the angle sum: (${n} − 2) × 180. Then take away the angles you know.`,
      working: [`Angle sum of a ${nm} = (${n} − 2) × 180 = ${sum}°.`, `Known angles: ${angs.join(' + ')} = ${sum - x}.`, `x = ${sum} − ${sum - x} = <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'polygon-sum',
    };
  }
  const turnTo = (from, t, cw) => (((from + (cw ? t : -t)) % 360) + 360) % 360;
  function compassQ(level) {
    const four = compassDirs.filter(([, b]) => b % 90 === 0);
    const form = level === 1 ? R.pick(['turn', 'turn', 'bearingName']) : R.pick(['turn', 'bearing', 'bearingName', 'turnAmount']);
    if (form === 'turn') {
      const pool = level === 1 ? four : compassDirs;
      const [nm, from] = R.pick(pool);
      const t = level === 1 ? R.pick([90, 90, 180]) : R.pick([45, 90, 90, 135, 180, 270]);
      const cw = R.chance(0.6);
      const to = turnTo(from, t, cw);
      const toName = compassDirs.find(([, b]) => b === to)[0];
      const wrong = R.sample(compassDirs.filter(([n2]) => n2 !== toName), 3).map(([n2]) => dirName[n2]);
      const opts = R.shuffle(wrong.concat([dirName[toName]]));
      return choiceQ(`Harper is facing <b>${nm}</b>. She turns <b>${t}° ${cw ? 'clockwise' : 'anticlockwise'}</b>. Which direction is she facing now?`,
        compassSvg(from), opts, opts.indexOf(dirName[toName]),
        'A quarter turn is 90°, a half turn is 180°, and one step round the 8-point compass (N to NE) is 45°.',
        [`Start at ${nm} (${from}° round from north).`, `${cw ? 'Clockwise' : 'Anticlockwise'} ${t}°: ${from} ${cw ? '+' : '−'} ${t} = ${cw ? from + t : from - t}${to !== (cw ? from + t : from - t) ? ', which is ' + to + '° round from north' : ''}.`, `She is facing <b>${dirName[toName]}</b>.`], { skill: 'compass' });
    }
    if (form === 'bearing') {
      const [nm, br] = R.pick(level === 3 ? compassDirs.slice(1) : four.slice(1));
      return {
        prompt: `Bearings are measured <b>clockwise from north</b>. What is the bearing of <b>${nm}</b>?`,
        visual: compassSvg(br), answer: numAns(br),
        hint: 'Start facing north (000°) and count clockwise. Each quarter turn is 90°, each small step is 45°.',
        working: ['Bearings start at north and go <b>clockwise</b>.', `From N to ${nm} is ${br / 45} step${br / 45 === 1 ? '' : 's'} of 45°: ${br / 45} × 45 = ${br}.`, `The bearing of ${nm} is <b>${br}°</b> (written ${br < 100 ? '0' + br : br}°).`],
        finalAnswer: `${br < 100 ? '0' + br : br}°`, skill: 'compass',
      };
    }
    if (form === 'turnAmount') {
      const [n1, b1] = R.pick(compassDirs);
      const [n2, b2] = R.pick(compassDirs.filter(([, b]) => b !== b1));
      const cw = R.chance(0.5);
      const t = cw ? (((b2 - b1) % 360) + 360) % 360 : (((b1 - b2) % 360) + 360) % 360;
      return {
        prompt: `Harper is facing <b>${n1}</b>. She turns <b>${cw ? 'clockwise' : 'anticlockwise'}</b> until she faces <b>${n2}</b>. How many degrees does she turn?`,
        visual: compassSvg(b1), answer: numAns(t),
        hint: 'Count the steps round the compass: each step (N to NE) is 45°, each quarter turn is 90°.',
        working: [`${n1} is ${b1}° round from north, ${n2} is ${b2}° round from north.`, `Turning ${cw ? 'clockwise' : 'anticlockwise'}: ${t / 45} step${t / 45 === 1 ? '' : 's'} of 45° = ${t}.`, `She turns <b>${t}°</b>.`],
        finalAnswer: deg(t), skill: 'compass',
      };
    }
    const [nm, br] = R.pick(level === 1 ? four : compassDirs);
    const wrong = R.sample(compassDirs.filter(([n2]) => n2 !== nm), 3).map(([n2]) => dirName[n2]);
    const opts = R.shuffle(wrong.concat([dirName[nm]]));
    return choiceQ(`A tramper walks on a bearing of <b>${br < 100 ? '0' + br : br}°</b>. Which compass direction is that?`,
      compassSvg(br), opts, opts.indexOf(dirName[nm]),
      'Bearings are measured clockwise from north: 000° = N, 090° = E, 180° = S, 270° = W.',
      [`${br}° means ${br === 0 ? 'no turn' : br + '° clockwise'} from north.`, `That points <b>${dirName[nm]}</b>.`], { skill: 'compass' });
  }

  function calc(level) {
    if (level === 1) return R.pick([() => straight(1), () => point(1), () => point(2), () => vertOpp(1), () => nameType(1), () => rightTriangle(),
      () => complement(1), () => supplement(1), () => protractor(1), estimate, compSupName, () => compassQ(1)])();
    if (level === 2) return R.pick([() => straight(2), () => point(2), () => point(3), () => triangle(2), () => quad(), () => isosceles(), () => whichRule(), () => nameType(2), () => vertOpp(2),
      () => complement(2), () => supplement(2), compSupName, () => protractor(2), estimate, () => polygonAngles(2), () => compassQ(2)])();
    return R.pick([parallel, parallel, parallelTwoStep, exterior, isoStraight, pointWithRight, () => straight(3), quad, isosceles, () => point(3),
      () => polygonAngles(3), () => polygonAngles(3), () => compassQ(3), () => supplement(3), () => complement(3)])();
  }

  // ---------- word problems ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['ramp', 'clock', 'pizza', 'seesaw', 'spokes', 'gate', 'laptop', 'tramper'] : level === 2 ? ['ramp', 'clock', 'roof', 'pizza', 'seesaw', 'spokes', 'ladder', 'gate', 'laptop', 'tramper', 'gardenPoly'] : ['clockHalf', 'roof', 'ladder', 'clockReflex', 'tent', 'pie', 'gardenPoly', 'tramper', 'gate']);
    if (t === 'gate') { // complementary angles in real life
      const a = R.step(15, 75, 5), x = 90 - a;
      const [thing, story] = R.pick([
        ['gate', `A farm gate has swung open ${a}° from the fence.`],
        ['phone stand', `The lid of a phone stand is tilted ${a}° up from the table.`],
        ['deck chair', `The back of a deck chair leans ${a}° from the seat.`],
      ]);
      return {
        prompt: `${story} How many more degrees must it turn to be at a <b>right angle</b> (90°)?`,
        visual: rightSplitSvg([a, x], [deg(a), 'x']), answer: numAns(x),
        hint: 'The two angles together make a right angle, so they are complementary: they add to 90°.',
        working: ['A right angle is <b>90°</b>, so the two angles are <b>complementary</b>.', `x = 90 − ${a} = ${x}.`, `The ${thing} must turn <b>${x}°</b> more.`],
        finalAnswer: deg(x), skill: 'complementary',
      };
    }
    if (t === 'laptop') { // supplementary angles in real life
      const a = R.step(100, 165, 5), x = 180 - a;
      const [thing, story] = R.pick([
        ['laptop lid', `Harper's laptop lid is open at ${a}° to the base.`],
        ['ironing board', `An ironing board leg makes an angle of ${a}° with the flat top.`],
        ['skateboard ramp', `A skateboard ramp meets the flat ground at ${a}° on one side.`],
      ]);
      return {
        prompt: `${story} What is the <b>supplementary</b> angle on the other side of the straight line?`,
        visual: straightSvg([a, x], [deg(a), 'x']), answer: numAns(x),
        hint: 'Supplementary angles sit on a straight line, so they add to 180°.',
        working: ['The two angles are on a <b>straight line</b>, so they are <b>supplementary</b>: they add to <b>180°</b>.', `x = 180 − ${a} = ${x}.`, `The other angle at the ${thing} is <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'supplementary',
      };
    }
    if (t === 'tramper') { // compass directions and bearings
      const [nm, from] = R.pick(compassDirs);
      const t2 = R.pick(level === 1 ? [90, 180] : [45, 90, 135, 180]);
      const cw = R.chance(0.6), to = turnTo(from, t2, cw);
      const toName = compassDirs.find(([, b]) => b === to)[0];
      const opts = R.shuffle(R.sample(compassDirs.filter(([n2]) => n2 !== toName), 3).map(([n2]) => dirName[n2]).concat([dirName[toName]]));
      const story = R.pick([
        `A tramper on the Tongariro track is walking <b>${nm}</b>.`,
        `A kayak on Lake Taupō is heading <b>${nm}</b>.`,
        `Harper is riding her bike <b>${nm}</b> along the beach path.`,
      ]);
      return choiceQ(`${story} At the next corner she turns <b>${t2}° ${cw ? 'clockwise' : 'anticlockwise'}</b>. Which direction is she going now?`,
        compassSvg(from), opts, opts.indexOf(dirName[toName]),
        'Draw the compass. One step (N to NE) is 45°, a quarter turn is 90°, a half turn is 180°.',
        [`${nm} is ${from}° round from north (bearings go clockwise from N).`, `Turn ${cw ? 'clockwise' : 'anticlockwise'} ${t2}°: that is ${t2 / 45} step${t2 / 45 === 1 ? '' : 's'} of 45° round the compass.`, `She is now going <b>${dirName[toName]}</b>.`], { skill: 'compass' });
    }
    if (t === 'gardenPoly') { // polygon angle sum in a real setting
      const n = R.pick(level === 3 ? [5, 6, 8] : [5, 6]);
      const nm = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }[n], sum = (n - 2) * 180;
      const story = R.pick([
        [`A garden bed at school is a regular ${nm} (${n} equal sides).`, 'garden bed'],
        [`A paving stone on the deck is a regular ${nm} (${n} equal sides).`, 'paving stone'],
        [`A trampoline mat is a regular ${nm} (${n} equal sides).`, 'trampoline'],
      ]);
      return {
        prompt: `${story[0]} What is the size of <b>each</b> of its corner angles?`,
        visual: polyAngSvg(n, new Array(n).fill('')), answer: numAns(sum / n),
        hint: `First the angle sum: (${n} − 2) × 180. Then share it between the ${n} equal corners.`,
        working: [`Angle sum = (${n} − 2) × 180 = ${n - 2} × 180 = ${sum}°.`, `Regular, so all ${n} corners are equal: ${sum} ÷ ${n} = ${sum / n}.`, `Each corner is <b>${sum / n}°</b>.`],
        finalAnswer: deg(sum / n), skill: 'polygon-sum',
      };
    }
    if (t === 'ramp' || t === 'ladder') {
      const a = R.step(15, 65, 5), x = 90 - a;
      const thing = t === 'ramp' ? 'A wheelchair ramp' : 'A ladder';
      return {
        prompt: `${thing} leans against a vertical wall and makes an angle of ${a}° with the ground. What angle does it make with the wall?`,
        visual: rampSvg(a, deg(a), 'x'), answer: numAns(x),
        hint: 'The wall meets the ground at a right angle (90°). The three angles make a triangle.',
        working: ['The wall and the ground meet at 90°, so the shape is a right-angled triangle.', `90 + ${a} = ${90 + a}.`, `Angle with the wall = 180 − ${90 + a} = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'clock') {
      const h = R.int(1, 5); const x = h * 30;
      return {
        prompt: `A clock shows ${h} o'clock. What is the (smaller) angle between the hour hand and the minute hand?`,
        visual: clockSvg(h, false), answer: numAns(x),
        hint: 'A full turn is 360°, and there are 12 hours, so each hour mark is 360 ÷ 12 = 30°.',
        working: ['Each hour on the clock is 360 ÷ 12 = 30°.', `The hands are ${h} hours apart: ${h} × 30 = ${x}.`, `Angle = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'clockReflex') {
      const h = R.int(1, 5); const x = 360 - h * 30;
      return {
        prompt: `A clock shows ${h} o'clock. What is the <b>reflex</b> angle (the larger one) between the hour hand and the minute hand?`,
        visual: clockSvg(h, false), answer: numAns(x),
        hint: 'Find the smaller angle first (30° per hour), then subtract from 360°.',
        working: [`Smaller angle: ${h} × 30 = ${h * 30}°.`, `Reflex angle = 360 − ${h * 30} = ${x}.`, `Answer: <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'clockHalf') {
      const h = R.int(1, 5); const x = 180 - (h * 30 + 15);
      return {
        prompt: `A clock shows half past ${h}. The hour hand is halfway between ${h} and ${h + 1}. What is the angle between the two hands?`,
        visual: clockSvg(h, true), answer: numAns(x),
        hint: 'The minute hand is at 6 (180° from 12). The hour hand is at ' + h + ' × 30 + 15 degrees from 12.',
        working: ['Minute hand points at 6: that is 180° from 12.', `Hour hand: ${h} × 30 + 15 = ${h * 30 + 15}° from 12.`, `Angle between = 180 − ${h * 30 + 15} = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'roof') {
      const apex = R.step(90, 140, 10), x = (180 - apex) / 2;
      return {
        prompt: `The front of a roof is an isosceles triangle. The angle at the top (the apex) is ${apex}°. What angle does each sloping side make with the horizontal ceiling?`,
        visual: triangleSvg([apex, x, x], [deg(apex), 'x', 'x'], { ticks: [0, 2] }), answer: numAns(x),
        hint: 'Isosceles: the two bottom angles are equal. All three add to 180°.',
        working: [`The two bottom angles are equal: x + x + ${apex} = 180.`, `2x = 180 − ${apex} = ${180 - apex}.`, `x = ${180 - apex} ÷ 2 = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'tent') {
      const base = R.step(50, 75, 5), x = 180 - 2 * base;
      return {
        prompt: `The end of a tent is an isosceles triangle. Each sloping side makes an angle of ${base}° with the ground. What is the angle at the top of the tent?`,
        visual: triangleSvg([x, base, base], ['x', deg(base), deg(base)], { ticks: [0, 2] }), answer: numAns(x),
        hint: 'Add the two equal base angles, then subtract from 180°.',
        working: [`${base} + ${base} = ${2 * base}.`, `Top angle = 180 − ${2 * base} = ${x}.`, `Answer: <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'pizza' || t === 'spokes') {
      const n = R.pick(t === 'pizza' ? [4, 5, 6, 8, 9, 10, 12] : [6, 8, 9, 10, 12, 15, 18, 20]), x = 360 / n;
      const prompt = t === 'pizza' ? `A pizza is cut into ${n} equal slices. What is the angle at the point of each slice?` : `A bike wheel has ${n} equally spaced spokes. What is the angle between two spokes that are next to each other?`;
      return {
        prompt, visual: t === 'pizza' ? pizzaSvg(n, R.int(0, n - 1)) : pizzaSvg(n, R.int(0, n - 1)), answer: numAns(x),
        hint: 'A full turn around the centre is 360°. Share it equally.',
        working: ['Angles around a point add to 360°.', `360 ÷ ${n} = ${x}.`, `Each angle is <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    if (t === 'pie') {
      const a = R.step(60, 150, 10), b = R.step(50, 120, 10), x = 360 - a - b; if (x < 40 || x > 180) return word(level);
      return {
        prompt: `A pie chart shows how a class travels to school. The "walk" sector is ${a}° and the "bus" sector is ${b}°. The only other sector is "car". What angle is the car sector?`,
        visual: pointSvg([a, b, x], [deg(a), deg(b), 'x']), answer: numAns(x),
        hint: 'All the sectors of a pie chart add up to 360°.',
        working: ['The sectors of a pie chart add to 360°.', `${a} + ${b} = ${a + b}.`, `Car sector = 360 − ${a + b} = <b>${x}°</b>.`],
        finalAnswer: deg(x), skill: 'word',
      };
    }
    // seesaw
    const a = R.step(10, 40, 5), x = 180 - a;
    return {
      prompt: `A see-saw is a straight plank. One end makes an angle of ${a}° with the ground. What angle does the other side of the plank make with the ground on the same side of the pivot?`,
      visual: straightSvg([a, x], [deg(a), 'x']), answer: numAns(x),
      hint: 'The plank is straight, so the two angles on the ground line add to 180°.',
      working: ['The plank is a straight line: the two angles add to 180°.', `x = 180 − ${a} = ${x}.`, `Answer: <b>${x}°</b>.`],
      finalAnswer: deg(x), skill: 'word',
    };
  }

  HL.registerTopic({
    id: 'angles', subject: 'maths', strand: 'geometry', order: 1,
    name: 'Angle rules', short: 'Angles',
    blurb: 'Find missing angles using the rules for lines, points, triangles and parallel lines.',
    example: 'Straight line: x = 180° − 65° = 115°',
    animal: 'penguin',
    learn: {
      what: '<p>An <b>angle</b> measures a turn, in degrees (°). A whole pizza is a full turn: <b>360°</b>. Half a pizza (a straight cut) is <b>180°</b>. A few <b>angle rules</b> let you work out a missing angle without measuring. Almost every angle question is "<b>which rule fits this picture?</b>" and then a subtraction.</p>',
      visual: (() => {
        const B = '#2A6FA5', G = '#2FA97A';
        const dir = (P, Q) => Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) / D;
        const corner = (P, i, col, r = 12) => { // arc inside the corner i of polygon P
          const V = P[i], Q1 = P[(i + 1) % P.length], Q2 = P[(i + P.length - 1) % P.length];
          let a1 = dir(V, Q1), a2 = dir(V, Q2); if (((a2 - a1) % 360 + 360) % 360 > 180) [a1, a2] = [a2, a1];
          return arc(V[0], V[1], a1, a2, r, col);
        };
        const polyOut = (P, fill) => `<polygon points="${P.map((p) => p.join(',')).join(' ')}" fill="${fill}" fill-opacity=".45" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
        const cap = (cx, y, name, rule) => text(cx, y, name, 'font-size="13"') + text(cx, y + 16, rule, `font-size="13" fill="${C.rose}"`);
        const ray = (cx, cy, a, len) => { const [x, y] = pt(cx, cy, a, len); return line(cx, cy, x, y, '', 2); };
        let b = '';
        // 1 straight line
        b += line(8, 56, 112, 56, '', 2) + ray(60, 56, 115, 44) + arc(60, 56, 0, 115, 14, B) + arc(60, 56, 115, 180, 14, C.rose) + cap(60, 82, 'Straight line', 'add to 180°');
        // 2 around a point
        b += ray(180, 42, 0, 42) + ray(180, 42, 120, 42) + ray(180, 42, 230, 42) + arc(180, 42, 0, 120, 14, B) + arc(180, 42, 120, 230, 14, C.rose) + arc(180, 42, 230, 360, 14, G) + cap(180, 82, 'Around a point', 'add to 360°');
        // 3 vertically opposite
        [25, 155].forEach((a) => { const [x1, y1] = pt(300, 40, a, 48), [x2, y2] = pt(300, 40, a + 180, 48); b += line(x1, y1, x2, y2, '', 2); });
        b += arc(300, 40, 25, 155, 12, C.rose) + arc(300, 40, 205, 335, 12, C.rose) + arc(300, 40, 155, 205, 12, B) + arc(300, 40, 335, 385, 12, B) + cap(300, 82, 'Opposite angles', 'are equal');
        // 4 triangle
        const T = [[10, 172], [102, 172], [40, 120]];
        b += polyOut(T, C.sky) + corner(T, 0, B) + corner(T, 1, C.rose) + corner(T, 2, G) + cap(56, 192, 'Triangle', 'add to 180°');
        // 5 quadrilateral
        const Q = [[124, 172], [224, 172], [212, 122], [140, 118]];
        b += polyOut(Q, C.mint) + corner(Q, 0, B) + corner(Q, 1, C.rose) + corner(Q, 2, G) + corner(Q, 3, C.ink) + cap(172, 192, 'Quadrilateral', 'add to 360°');
        // 6 parallel lines
        [128, 160].forEach((y) => { b += line(240, y, 344, y, '', 2) + `<path d="M322 ${y - 5} L330 ${y} L322 ${y + 5}" fill="none" stroke="${C.ink}" stroke-width="2"/>`; });
        b += line(254, 176, 310, 112, '', 2);
        const ph = Math.atan2(32, 28) / D;
        b += arc(296, 128, 0, ph, 11, C.rose) + arc(296, 128, 180, 180 + ph, 11, C.rose) + arc(268, 160, 0, ph, 11, C.rose) + arc(268, 160, ph, 180, 11, B) + cap(292, 192, 'Parallel lines', 'F, Z equal · C 180°');
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        'Angles on a <b>straight line</b> add to <b>180°</b> (half a pizza)',
        'Angles <b>around a point</b> add to <b>360°</b> (a whole pizza)',
        '<b>Vertically opposite</b> angles (where two lines cross) are <b>equal</b>',
        'Angles in a <b>triangle</b> add to <b>180°</b>; in a <b>quadrilateral</b> add to <b>360°</b>',
        '<b>Isosceles</b> triangle: the two <b>base angles are equal</b>. Equilateral: all <b>60°</b>',
        '<b>Parallel lines</b>: <b>F</b> (corresponding) and <b>Z</b> (alternate) angles are <b>equal</b>; <b>C</b> (co-interior) angles add to <b>180°</b>',
        '<b>Complementary</b> angles add to <b>90°</b> (a right-angle corner). <b>Supplementary</b> angles add to <b>180°</b> (a straight line). Hook: <b>C</b> before <b>S</b> in the alphabet, <b>90</b> before <b>180</b>',
        'Angle names by size: <b>acute</b> under 90°, <b>right</b> = 90°, <b>obtuse</b> between 90° and 180°, <b>straight</b> = 180°, <b>reflex</b> over 180°',
        'Angle sum of <b>any polygon</b> = <b>(n − 2) × 180°</b> (n = number of sides). Regular polygon: each angle = sum ÷ n',
        '<b>Exterior angle</b> of a triangle = the <b>two opposite inside angles added</b>',
        '<b>Bearings</b> are measured <b>clockwise from north</b> and always written with <b>3 figures</b>: N 000°, NE 045°, E 090°, SE 135°, S 180°, W 270°',
      ],
      steps: [
        '<b>Ask: which rule fits this picture?</b> Straight line? Around a point? Crossing lines? Triangle? Quadrilateral? Parallel lines?',
        'Say the rule out loud with its number: "straight line, so <b>180°</b>".',
        '<b>Add up</b> the angles you already know.',
        '<b>Subtract</b> from the rule number. That is x.',
        'If two angles are <b>equal</b> (isosceles, vertically opposite, F or Z), just <b>copy</b> the angle or <b>halve</b> what is left.',
      ],
      examples: [
        (() => {
          const B = '#2A6FA5';
          let b = line(20, 92, 220, 92, '', 2.5);
          const [x, y] = pt(120, 92, 70, 72); b += line(120, 92, x, y, '', 2.5);
          b += arc(120, 92, 0, 70, 18, C.rose) + arc(120, 92, 70, 180, 18, B);
          const [kx, ky] = pt(120, 92, 125, 44), [xx, xy] = pt(120, 92, 35, 42);
          b += text(kx, ky, '110°', `fill="${B}"`) + text(xx, xy, 'x', `fill="${C.rose}" font-size="18"`);
          return { q: 'Find x: angles of <b>110°</b> and <b>x</b> on a straight line.',
            visual: `<svg viewBox="0 0 240 110" width="240" height="110" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>half a pizza</b>: the straight line is the cut, so the two slices make 180°.', '1. Which rule? A <b>straight line</b> → add to <b>180°</b>.', '2. What do I know? One slice is 110°.', '3. Take it away: 180 − 110 = <b>70</b>.'], a: 'x = 70°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const cx = 40, cy = 112;
          let b = line(cx, cy, cx + 190, cy, '', 2.5) + line(cx, cy, cx, cy - 96, '', 2.5);
          const [rx, ry] = pt(cx, cy, 37, 150); b += line(cx, cy, rx, ry, '', 2.5);
          b += arc(cx, cy, 0, 37, 40, B) + arc(cx, cy, 37, 90, 62, C.rose) + rightMark(cx, cy, 0);
          const [lx, ly] = pt(cx, cy, 18, 62), [xx, xy] = pt(cx, cy, 64, 88);
          b += text(lx, ly, '37°', `fill="${B}"`) + text(xx, xy, 'x', `fill="${C.rose}" font-size="18"`);
          b += text(168, 128, '37° + x = 90°', `font-size="13" fill="${C.rose}"`);
          return { q: 'Find the <b>complement</b> of <b>37°</b>.',
            visual: `<svg viewBox="0 0 250 140" width="250" height="140" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture a <b>quarter of a pizza</b> (a square corner) cut into two slices.', '1. What does <b>complementary</b> mean? The two angles add to <b>90°</b>.', '2. What do I know? One slice is 37°.', '3. Take it away: 90 − 37 = <b>53</b>.'], a: 'x = 53°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const cx = 128, cy = 100;
          let b = line(20, cy, 236, cy, '', 2.5);
          const [rx, ry] = pt(cx, cy, 62, 92); b += line(cx, cy, rx, ry, '', 2.5);
          b += arc(cx, cy, 62, 180, 26, B) + arc(cx, cy, 0, 62, 34, C.rose);
          const [lx, ly] = pt(cx, cy, 121, 60), [xx, xy] = pt(cx, cy, 31, 62);
          b += text(lx, ly, '118°', `fill="${B}"`) + text(xx, xy, 'x', `fill="${C.rose}" font-size="18"`);
          b += text(128, 128, '118° + x = 180°', `font-size="13" fill="${C.rose}"`);
          return { q: 'These two angles are <b>supplementary</b>. One of them is <b>118°</b>. Find <b>x</b>.',
            visual: `<svg viewBox="0 0 250 140" width="250" height="140" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>half a pizza</b>: the straight cut is the line, so the two slices make 180°.', '1. What does <b>supplementary</b> mean? The two angles add to <b>180°</b>.', '2. Which one is bigger, 90 or 180? <b>S</b> comes after <b>C</b> in the alphabet, and <b>180</b> comes after <b>90</b>.', '3. Take it away: 180 − 118 = <b>62</b>.'], a: 'x = 62°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const cx = 120, cy = 78; let b = '';
          [0, 150, 280].forEach((a) => { const [x, y] = pt(cx, cy, a, 62); b += line(cx, cy, x, y, '', 2.5); });
          b += arc(cx, cy, 0, 150, 16, B) + arc(cx, cy, 150, 280, 22, B) + arc(cx, cy, 280, 360, 16, C.rose);
          const [ax, ay] = pt(cx, cy, 75, 40), [bx, by] = pt(cx, cy, 215, 46), [xx, xy] = pt(cx, cy, 320, 38);
          b += text(ax, ay, '150°', `fill="${B}"`) + text(bx, by, '130°', `fill="${B}"`) + text(xx, xy, 'x', `fill="${C.rose}" font-size="18"`);
          return { q: 'Find x: angles of <b>150°</b>, <b>130°</b> and <b>x</b> meet at a point.',
            visual: `<svg viewBox="0 0 240 150" width="240" height="150" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture a <b>whole pizza</b> cut into 3 slices from the middle: all the way round is 360°.', '1. Which rule? <b>Around a point</b> → add to <b>360°</b>.', '2. What do I know? 150 + 130 = 280.', '3. Take it away: 360 − 280 = <b>80</b>.'], a: 'x = 80°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const P = [[30, 118], [210, 118], [100, 30]];
          const dir = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / D;
          let b = `<polygon points="${P.map((p) => p.join(',')).join(' ')}" fill="${C.sky}" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
          const lab = (i, s, col) => { const V = P[i], a1 = dir(V, P[(i + 1) % 3]), a2 = dir(V, P[(i + 2) % 3]); let s1 = a1, s2 = a2; if (((s2 - s1) % 360 + 360) % 360 > 180) [s1, s2] = [s2, s1]; const span = ((s2 - s1) % 360 + 360) % 360; const [x, y] = pt(V[0], V[1], s1 + span / 2, 38); return arc(V[0], V[1], s1, s2, 16, col) + text(x, y, s, `fill="${col}"${s === 'x' ? ' font-size="18"' : ''}`); };
          b += lab(0, '50°', B) + lab(1, '65°', B) + lab(2, 'x', C.rose);
          return { q: 'Find x: a triangle has angles <b>50°</b>, <b>65°</b> and <b>x</b>.',
            visual: `<svg viewBox="0 0 240 135" width="240" height="135" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture tearing the 3 corners off a paper triangle: they fit together to make <b>half a pizza</b>, 180°.', '1. Which rule? <b>Triangle</b> → add to <b>180°</b>.', '2. What do I know? 50 + 65 = 115.', '3. Take it away: 180 − 115 = <b>65</b>.'], a: 'x = 65°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const A = [120, 22], Bp = [40, 125], Cc = [200, 125];
          let b = `<polygon points="${[A, Bp, Cc].map((p) => p.join(',')).join(' ')}" fill="${C.pink}" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
          b += tick(A[0], A[1], Bp[0], Bp[1]) + tick(A[0], A[1], Cc[0], Cc[1]);
          const dir = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / D;
          const aB = dir(Bp, A), aC = dir(Cc, A);
          b += arc(A[0], A[1], dir(A, Bp), dir(A, Cc), 16, B) + text(120, 60, '40°', `fill="${B}"`);
          b += arc(Bp[0], Bp[1], 0, aB, 16, C.rose) + arc(Cc[0], Cc[1], aC, 180, 16, C.rose);
          b += text(78, 112, 'x', `fill="${C.rose}" font-size="18"`) + text(162, 112, 'x', `fill="${C.rose}" font-size="18"`);
          return { q: 'Find x: an <b>isosceles</b> triangle has a top angle of <b>40°</b>. The two base angles are both <b>x</b>.',
            visual: `<svg viewBox="0 0 240 140" width="240" height="140" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture a <b>pizza slice</b>: the two long sides match (tick marks), so the two bottom corners match too.', '1. Which rule? <b>Triangle</b> → 180°, and <b>isosceles</b> → the two base angles are <b>equal</b>.', '2. What is left for the two x angles? 180 − 40 = 140.', '3. Share it between the two equal angles: 140 ÷ 2 = <b>70</b>.'], a: 'x = 70°' };
        })(),
        (() => {
          const items = [[45, 'acute', '&lt; 90°'], [90, 'right', '= 90°'], [135, 'obtuse', '90–180°'], [180, 'straight', '= 180°'], [250, 'reflex', '&gt; 180°']];
          let b = '';
          items.forEach(([a, nm, rng], i) => {
            const cx = 36 + i * 72, cy = 60;
            const [x1, y1] = pt(cx, cy, 0, 28), [x2, y2] = pt(cx, cy, a, 28);
            b += line(cx, cy, x1, y1, '', 2.5) + line(cx, cy, x2, y2, '', 2.5);
            b += a === 90 ? rightMark(cx, cy, 0) : arc(cx, cy, 0, a, 12, C.rose);
            b += text(cx, 104, nm, 'font-size="13"') + text(cx, 122, rng, `font-size="13" fill="${C.rose}"`);
          });
          return { q: 'What is each of these angles <b>called</b>?',
            visual: `<svg viewBox="0 0 360 134" width="360" height="134" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>one pizza slice opening wider and wider</b>. The wider it opens, the further down the list of names it goes.', '1. Is it <b>smaller</b> than a square corner (90°)? Then it is <b>acute</b>.', '2. Exactly a square corner? <b>right angle</b>. Wider than 90° but not yet flat? <b>obtuse</b>.', '3. Exactly flat, a straight line? <b>straight angle</b> (180°). More than flat? <b>reflex</b>.'], a: 'acute · right · obtuse · straight · reflex' };
        })(),
        (() => {
          return { q: '<b>Read the protractor.</b> How big is this angle?', visual: protractorSvg(130),
            working: ['Picture the protractor as <b>half a pizza</b> with the sizes printed round the crust.', '1. Is one arm sitting on <b>0</b>? Yes, so I can just read the other arm.', '2. Follow the numbers round from 0: 30, 60, 90, 120, and one more mark.', '3. Sensible-check by <b>estimating</b> first: the angle is <b>wider</b> than a square corner, so the answer must be more than 90°, not less.'], a: '130°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const cx = 105, cy = 80, P = [];
          for (let i = 0; i < 5; i++) P.push(pt(cx, cy, 90 + 72 * i, 68));
          let b = `<polygon points="${P.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${C.lav}" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
          const diag = (Q) => `<line x1="${r1(P[0][0])}" y1="${r1(P[0][1])}" x2="${r1(Q[0])}" y2="${r1(Q[1])}" stroke="${C.lav}" stroke-width="2" stroke-dasharray="5 4"/>`;
          b += diag(P[2]) + diag(P[3]);
          const halo = `paint-order="stroke" stroke="#fff" stroke-width="3.5"`;
          const labs = ['100°', '115°', '90°', '130°', 'x'];
          P.forEach((V, i) => {
            const dx = cx - V[0], dy = cy - V[1], L = Math.hypot(dx, dy);
            b += text(V[0] + dx / L * 32, V[1] + dy / L * 32, labs[i], labs[i] === 'x' ? `fill="${C.rose}" font-size="18" ${halo}` : `font-size="13" fill="${B}" ${halo}`);
          });
          b += text(252, 46, '5 sides → 3 triangles', 'font-size="13"') + text(252, 70, '(5 − 2) × 180 = 540°', `font-size="13" fill="${C.rose}"`) + text(252, 98, 'not drawn to scale', `font-size="13" fill="${C.rose}"`);
          return { q: 'Find the angle <b>x</b> in this <b>pentagon</b>.',
            visual: `<svg viewBox="0 0 340 162" width="340" height="162" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture cutting the <b>paper pentagon</b> into triangles from one corner (the dotted lines).', '1. How many sides? <b>n = 5</b>.', '2. How many triangles? n − 2 = <b>3</b>, so the angle sum is 3 × 180 = <b>540°</b>.', '3. Add the angles I know: 100 + 115 + 90 + 130 = 435.', '4. Take it away: 540 − 435 = <b>105</b>.'], a: 'x = 105°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          const Bp = [40, 122], Cc = [170, 122], A = [95, 42];
          const dir = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) / D;
          let b = `<polygon points="${[A, Bp, Cc].map((p) => p.join(',')).join(' ')}" fill="${C.sky}" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
          b += line(Cc[0], Cc[1], 252, 122, 'stroke-dasharray="6 5"', 2.5);
          const aB = dir(Bp, A);
          b += arc(Bp[0], Bp[1], 0, aB, 22, B); const [b1x, b1y] = pt(Bp[0], Bp[1], aB / 2, 44); b += text(b1x, b1y, '55°', `fill="${B}"`);
          let a1 = dir(A, Cc), a2 = dir(A, Bp); if (((a2 - a1) % 360 + 360) % 360 > 180) { const t2 = a1; a1 = a2; a2 = t2; }
          const span = ((a2 - a1) % 360 + 360) % 360;
          b += arc(A[0], A[1], a1, a2, 22, B); const [a1x, a1y] = pt(A[0], A[1], a1 + span / 2, 34); b += text(a1x, a1y, '60°', `fill="${B}"`);
          const aC = dir(Cc, A);
          b += arc(Cc[0], Cc[1], 0, aC, 24, C.rose); const [xx, xy] = pt(Cc[0], Cc[1], aC / 2, 46); b += text(xx, xy, 'x', `fill="${C.rose}" font-size="18"`);
          b += text(140, 146, 'not drawn to scale', `font-size="13" fill="${C.rose}"`);
          return { q: 'The base of the triangle carries on past the corner. Find the <b>exterior angle x</b>.',
            visual: `<svg viewBox="0 0 270 158" width="270" height="158" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the base as a <b>footpath carrying straight on</b> past the corner. x is the angle <b>outside</b> the triangle.', '1. Which two inside angles are <b>opposite</b> x (the two it does not touch)? The <b>55°</b> and the <b>60°</b>.', '2. Rule: an <b>exterior angle</b> of a triangle = <b>the two opposite inside angles added</b>.', '3. 55 + 60 = <b>115</b>.', 'Check: the inside angle there is 180 − 115 = 65, and 55 + 60 + 65 = 180 ✓'], a: 'x = 115°' };
        })(),
        (() => {
          const B = '#2A6FA5';
          let b = '';
          [40, 110].forEach((y) => { b += line(20, y, 240, y, '', 2.5) + `<path d="M208 ${y - 6} L218 ${y} L208 ${y + 6}" fill="none" stroke="${C.ink}" stroke-width="2"/>`; });
          const ph = Math.atan2(70, 50) / D;
          b += line(80, 138, 170, 12, '', 2.5);
          b += arc(150, 40, 180, 180 + ph, 18, B) + arc(100, 110, ph, 180, 18, C.rose);
          b += text(106, 58, '120°', `fill="${B}"`) + text(76, 92, 'x', `fill="${C.rose}" font-size="18"`);
          b += `<text x="244" y="136" font-size="13" text-anchor="end" fill="${C.rose}">C shape</text>`;
          return { q: 'Find x: two parallel lines, with <b>120°</b> and <b>x</b> inside the lines on the same side (a <b>C</b> shape).',
            visual: `<svg viewBox="0 0 260 150" width="260" height="150" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>two pizza cuts</b> that never meet, with one long cut across them.', '1. Which rule? Parallel lines. Is it an F, a Z or a C? Both angles are inside, on the same side → a <b>C</b>.', '2. C angles <b>add to 180°</b> (F and Z would be equal).', '3. Take it away: 180 − 120 = <b>60</b>.'], a: 'x = 60°' };
        })(),
        (() => {
          return { q: 'A tramper leaves the hut on a <b>bearing of 135°</b>. Which compass direction is she walking?', visual: compassSvg(135),
            working: ['Picture standing on a <b>compass rose</b> painted on the ground. Every bearing starts by facing <b>north</b> and turning <b>clockwise</b>.', '1. Where does a bearing start? At <b>north</b> = 000°.', '2. How far round is 135°? 090° takes me to east, and 45° more is one step further round.', '3. One step past east is <b>south-east</b>.'], a: 'SE (south-east)' };
        })(),
        (() => {
          const B = '#2A6FA5';
          let b = line(20, 130, 230, 130, '', 2.5) + line(200, 130, 200, 18, '', 2.5) + line(60, 130, 200, 42, `stroke="${C.peach}"`, 5);
          b += rightMark(200, 130, 90);
          const aG = Math.atan2(88, 140) / D;
          b += arc(60, 130, 0, aG, 20, B) + text(112, 118, '65°', `fill="${B}"`);
          const aL = 180 + Math.atan2(88, 140) / D; // direction top → foot of ladder
          b += arc(200, 42, aL, 270, 18, C.rose) + text(184, 84, 'x', `fill="${C.rose}" font-size="18"`);
          b += text(226, 100, 'wall', 'font-size="13"') + text(120, 144, 'ground', 'font-size="13"');
          return { q: 'A ladder leans against the garage wall. It makes <b>65°</b> with the ground. What angle <b>x</b> does it make with the wall?',
            visual: `<svg viewBox="0 0 250 155" width="250" height="155" xmlns="http://www.w3.org/2000/svg" font-size="15" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the ladder, the wall and the ground making a <b>triangle</b>, like a big pizza slice.', '1. Which rule? <b>Triangle</b> → add to <b>180°</b>.', '2. What do I know? The wall stands straight up, so that corner is <b>90°</b>. And 65° at the ground.', '3. Add the known ones: 90 + 65 = 155.', '4. Take it away: 180 − 155 = <b>25</b>.'], a: 'x = 25°' };
        })(),
      ],
      tips: [
        'Say the rule <b>first</b> ("triangle, so 180°"), then subtract. It stops silly slips.',
        'Diagrams are <b>not to scale</b>: never measure with a ruler or protractor, always calculate.',
        'Acute &lt; 90°, right = 90°, obtuse between 90° and 180°, straight = 180°, reflex &gt; 180°. Check your answer looks like the right type.',
        '<b>C</b>omplementary = <b>90°</b>, <b>S</b>upplementary = <b>180°</b>. C comes before S, and 90 comes before 180 — that is the whole trick.',
        'A <b>bearing</b> always has three figures and always starts from north: 45° is written <b>045°</b>.',
        'Parallel lines: <b>F</b> and <b>Z</b> mean <b>equal</b>; only the <b>C</b> shape adds to 180°.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
