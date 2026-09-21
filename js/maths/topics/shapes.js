/* Topic: 2D & 3D shapes — naming triangles/quadrilaterals/polygons, angle sums, faces/edges/vertices, nets, symmetry. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
  const D = Math.PI / 180;
  const r1 = (v) => Math.round(v * 10) / 10;
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-size="15" fill="${C.ink}">${body}</svg>`;
  const poly = (pts, fill, extra = '') => `<polygon points="${pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${fill}" fill-opacity=".55" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" ${extra}/>`;
  const line = (x1, y1, x2, y2, extra = '') => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" ${extra}/>`;
  const text = (x, y, s, extra = '') => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="middle" ${extra}>${s}</text>`;
  const tick = (p, q, n = 1) => { // n small ticks across the midpoint of side p-q
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
    const nx = -dy / L * 7, ny = dx / L * 7, tx = dx / L * 5, ty = dy / L * 5;
    let b = '';
    for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 2; b += line(mx - nx + tx * o, my - ny + ty * o, mx + nx + tx * o, my + ny + ty * o); }
    return b;
  };
  const regular = (n, cx = 160, cy = 105, r = 80, rot = -90) => { const pts = []; for (let i = 0; i < n; i++) { const a = (rot + 360 / n * i) * D; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return pts; };
  const sideLabel = (p, q, s, out = 16) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return text(mx + dy / L * out, my - dx / L * out, s); };

  // ----- 2D shape pictures -----
  const quads = {
    square: () => [[100, 45], [220, 45], [220, 165], [100, 165]],
    rectangle: () => [[55, 65], [265, 65], [265, 150], [55, 150]],
    rhombus: () => [[160, 40], [250, 105], [160, 170], [70, 105]],
    parallelogram: () => [[55, 160], [215, 160], [265, 55], [105, 55]],
    trapezium: () => [[45, 160], [275, 160], [220, 55], [100, 55]],
    kite: () => [[160, 25], [230, 95], [160, 190], [90, 95]],
  };
  function quadSvg(name) {
    const P = quads[name]();
    let b = poly(P, { square: C.pink, rectangle: C.sky, rhombus: C.lav, parallelogram: C.mint, trapezium: C.peach, kite: C.butter }[name]);
    if (name === 'square' || name === 'rhombus') for (let i = 0; i < 4; i++) b += tick(P[i], P[(i + 1) % 4]);
    if (name === 'rectangle' || name === 'parallelogram') { b += tick(P[0], P[1]) + tick(P[2], P[3]) + tick(P[1], P[2], 2) + tick(P[3], P[0], 2); }
    if (name === 'kite') { b += tick(P[0], P[1]) + tick(P[3], P[0]) + tick(P[1], P[2], 2) + tick(P[2], P[3], 2); }
    if (name === 'trapezium') { b += `<path d="M150 55 l-8 -6 M150 55 l-8 6" fill="none" stroke="${C.ink}" stroke-width="2"/><path d="M165 160 l-8 -6 M165 160 l-8 6" fill="none" stroke="${C.ink}" stroke-width="2"/>`; }
    return svg(320, 210, b);
  }
  function triSvg(kind, labels) { // kind: 'equilateral' | 'isosceles' | 'scalene' | 'right' ; labels optional side labels
    let P, ticks = [];
    if (kind === 'equilateral') { P = regular(3, 160, 112, 78); ticks = [[0, 1, 1], [1, 2, 1], [2, 0, 1]]; }
    else if (kind === 'isosceles') { P = [[160, 32], [250, 172], [70, 172]]; ticks = [[0, 1, 1], [2, 0, 1]]; }
    else if (kind === 'right') { P = [[70, 40], [70, 180], [260, 180]]; }
    else P = [[140, 45], [275, 160], [60, 175]];
    let b = poly(P, C.sky);
    ticks.forEach(([i, j, n]) => { b += tick(P[i], P[j], n); });
    if (kind === 'right') b += `<path d="M70 164 h16 v16" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
    if (labels) P.forEach((p, i) => { b += sideLabel(p, P[(i + 1) % 3], labels[i], 20); });
    return svg(320, 210, b);
  }
  function polySvg(n, fill = C.mint) { return svg(320, 210, poly(regular(n), fill)); }

  // ----- 3D solids -----
  const solids = {
    cube: { F: 6, E: 12, V: 8, name: 'cube', faces: '6 square faces' },
    cuboid: { F: 6, E: 12, V: 8, name: 'cuboid', faces: '6 rectangular faces' },
    'triangular prism': { F: 5, E: 9, V: 6, name: 'triangular prism', faces: '2 triangles + 3 rectangles' },
    'square pyramid': { F: 5, E: 8, V: 5, name: 'square-based pyramid', faces: '1 square + 4 triangles' },
    tetrahedron: { F: 4, E: 6, V: 4, name: 'tetrahedron (triangular pyramid)', faces: '4 triangles' },
    'pentagonal prism': { F: 7, E: 15, V: 10, name: 'pentagonal prism', faces: '2 pentagons + 5 rectangles' },
    'hexagonal prism': { F: 8, E: 18, V: 12, name: 'hexagonal prism', faces: '2 hexagons + 6 rectangles' },
  };
  function prismSvg(front, off, fill) { // front polygon + offset copy at back; visible side faces filled, hidden edges dashed
    const back = front.map((p) => [p[0] + off[0], p[1] + off[1]]);
    const cx = front.reduce((a, p) => a + p[0], 0) / front.length, cy = front.reduce((a, p) => a + p[1], 0) / front.length;
    const dash = 'stroke-dasharray="5 4" stroke-opacity=".6"';
    let b = '';
    // hidden edges first (back polygon + joining edges), dashed
    back.forEach((p, i) => { const q = back[(i + 1) % back.length]; b += line(p[0], p[1], q[0], q[1], dash); });
    front.forEach((p, i) => { b += line(p[0], p[1], back[i][0], back[i][1], dash); });
    // visible side faces: outward direction of the edge midpoint agrees with the offset
    front.forEach((p, i) => {
      const q = front[(i + 1) % front.length], mx = (p[0] + q[0]) / 2 - cx, my = (p[1] + q[1]) / 2 - cy;
      if (mx * off[0] + my * off[1] > 0) b += poly([p, q, back[(i + 1) % front.length], back[i]], fill);
    });
    b += poly(front, fill);
    return svg(320, 210, b);
  }
  function solidSvg(key) {
    if (key === 'cube') return prismSvg([[85, 70], [195, 70], [195, 180], [85, 180]], [45, -40], C.sky);
    if (key === 'cuboid') return prismSvg([[50, 90], [215, 90], [215, 180], [50, 180]], [55, -45], C.peach);
    if (key === 'triangular prism') return prismSvg([[60, 180], [170, 180], [115, 90]], [80, -40], C.mint);
    if (key === 'pentagonal prism') return prismSvg(regular(5, 120, 120, 65), [80, -40], C.lav);
    if (key === 'hexagonal prism') return prismSvg(regular(6, 130, 120, 62, 0), [75, -40], C.butter);
    const dash = 'stroke-dasharray="5 4" stroke-opacity=".6"';
    if (key === 'square pyramid') {
      const base = [[70, 165], [200, 175], [250, 135], [130, 128]], apex = [160, 35];
      let b = line(base[2][0], base[2][1], base[3][0], base[3][1], dash) + line(base[3][0], base[3][1], base[0][0], base[0][1], dash) + line(apex[0], apex[1], base[3][0], base[3][1], dash);
      b += poly([apex, base[0], base[1]], C.pink) + poly([apex, base[1], base[2]], C.pink);
      return svg(320, 210, b);
    }
    // tetrahedron
    const base = [[60, 165], [230, 180], [255, 120]], apex = [150, 40];
    let b = line(base[2][0], base[2][1], base[0][0], base[0][1], dash) + poly([apex, base[0], base[1]], C.lav) + poly([apex, base[1], base[2]], C.lav);
    return svg(320, 210, b);
  }
  function netSvg(key) {
    const sq = (x, y, s, f) => poly([[x, y], [x + s, y], [x + s, y + s], [x, y + s]], f);
    if (key === 'cube') return svg(320, 210, sq(100, 5, 48, C.sky) + sq(100, 53, 48, C.sky) + sq(100, 101, 48, C.sky) + sq(100, 149, 48, C.sky) + sq(52, 53, 48, C.sky) + sq(148, 53, 48, C.sky));
    if (key === 'cuboid') { const rc = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], C.peach); return svg(320, 210, rc(110, 5, 70, 40) + rc(110, 45, 70, 55) + rc(110, 100, 70, 40) + rc(110, 140, 70, 55) + rc(55, 45, 55, 55) + rc(180, 45, 55, 55)); }
    if (key === 'square pyramid') { const s = 60, x = 130, y = 75; return svg(320, 210, sq(x, y, s, C.pink) + poly([[x, y], [x + s, y], [x + s / 2, y - 55]], C.pink) + poly([[x, y + s], [x + s, y + s], [x + s / 2, y + s + 55]], C.pink) + poly([[x, y], [x, y + s], [x - 55, y + s / 2]], C.pink) + poly([[x + s, y], [x + s, y + s], [x + s + 55, y + s / 2]], C.pink)); }
    if (key === 'triangular prism') { const rc = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], C.mint); return svg(320, 210, rc(110, 20, 100, 50) + rc(110, 70, 100, 50) + rc(110, 120, 100, 50) + poly([[110, 70], [110, 120], [67, 95]], C.mint) + poly([[210, 70], [210, 120], [253, 95]], C.mint)); }
    // cylinder
    return svg(320, 210, poly([[90, 60], [230, 60], [230, 150], [90, 150]], C.lav) + `<circle cx="160" cy="34" r="24" fill="${C.lav}" fill-opacity=".55" stroke="${C.ink}" stroke-width="2.5"/><circle cx="160" cy="176" r="24" fill="${C.lav}" fill-opacity=".55" stroke="${C.ink}" stroke-width="2.5"/>`);
  }
  const symShapes = [
    ['square', 4, () => quadSvg('square')], ['rectangle', 2, () => quadSvg('rectangle')], ['equilateral triangle', 3, () => triSvg('equilateral')],
    ['isosceles triangle', 1, () => triSvg('isosceles')], ['regular pentagon', 5, () => polySvg(5)], ['regular hexagon', 6, () => polySvg(6, C.butter)],
    ['parallelogram', 0, () => quadSvg('parallelogram')], ['rhombus', 2, () => quadSvg('rhombus')], ['kite', 1, () => quadSvg('kite')],
    ['isosceles trapezium', 1, () => quadSvg('trapezium')], ['regular octagon', 8, () => polySvg(8, C.pink)], ['scalene triangle', 0, () => triSvg('scalene')],
  ];
  const polyNames = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };

  const choiceQ = (prompt, visual, options, correct, hint, working, extra = {}) => {
    const order = R.shuffle(options.map((_, i) => i));
    return Object.assign({ prompt, visual, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct] }, extra);
  };
  const numQ = (prompt, visual, value, hint, working, unit) => ({ prompt, visual, answer: Object.assign({ type: 'number', value }, unit ? { unit } : {}), hint, working, finalAnswer: unit ? `${value}${unit === '°' ? '°' : ' ' + unit}` : String(value) });

  // ----- question makers -----
  function triBySides() {
    const kind = R.pick(['equilateral', 'isosceles', 'scalene']);
    let sides;
    if (kind === 'equilateral') { const s = R.int(3, 12); sides = [s, s, s]; }
    else if (kind === 'isosceles') { const s = R.int(4, 12); let t = R.int(3, 12); while (t === s || t >= 2 * s) t = R.int(3, 12); sides = [s, t, s]; }
    else { let a, b, c; do { a = R.int(3, 12); b = R.int(3, 12); c = R.int(3, 12); } while (a === b || b === c || a === c || a + b <= c || a + c <= b || b + c <= a); sides = [a, b, c]; }
    const opts = ['equilateral', 'isosceles', 'scalene'];
    return choiceQ(`A triangle has sides ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. What type of triangle is it?`,
      triSvg(kind, sides.map((s) => s + ' cm')), opts, opts.indexOf(kind),
      'Count how many sides are equal: all three, two, or none.',
      [kind === 'equilateral' ? 'All three sides are equal.' : kind === 'isosceles' ? 'Exactly two sides are equal.' : 'No sides are equal.', `Type: <b>${kind}</b>.`], { skill: 'triangles' });
  }
  function triByAngles(level) {
    const kind = R.pick(level === 1 ? ['right-angled', 'acute'] : ['right-angled', 'acute', 'obtuse', 'equilateral']);
    let angs;
    if (kind === 'right-angled') { const a = R.step(20, 70, 5); angs = R.shuffle([90, a, 90 - a]); }
    else if (kind === 'equilateral') angs = [60, 60, 60];
    else if (kind === 'obtuse') { const o = R.step(100, 140, 5), a = R.step(15, 180 - o - 15, 5); angs = R.shuffle([o, a, 180 - o - a]); }
    else { let a, b; do { a = R.step(30, 85, 5); b = R.step(30, 85, 5); } while (180 - a - b >= 90 || 180 - a - b < 30 || (a === 60 && b === 60)); angs = R.shuffle([a, b, 180 - a - b]); }
    const opts = ['right-angled', 'acute', 'obtuse', 'equilateral'];
    return choiceQ(`A triangle has angles ${angs[0]}°, ${angs[1]}° and ${angs[2]}°. What type of triangle is it?`, null, opts, opts.indexOf(kind),
      'Look at the biggest angle: is it exactly 90°, more than 90°, or less than 90°?',
      [kind === 'right-angled' ? 'One angle is exactly 90°.' : kind === 'obtuse' ? `The biggest angle (${Math.max(...angs)}°) is more than 90°.` : kind === 'equilateral' ? 'All three angles are 60°, so all sides are equal too.' : 'All three angles are less than 90°.', `Type: <b>${kind}</b>.`], { skill: 'triangles' });
  }
  const quadFacts = [
    ['exactly one pair of parallel sides', 'trapezium'],
    ['four equal sides, but its angles are not all right angles', 'rhombus'],
    ['four right angles and four equal sides', 'square'],
    ['four right angles, with opposite sides equal but not all four sides equal', 'rectangle'],
    ['two pairs of equal sides that are next to each other (adjacent), and one line of symmetry', 'kite'],
    ['two pairs of parallel sides, with no right angles', 'parallelogram'],
    ['two pairs of parallel sides and all sides equal', 'rhombus'],
    ['diagonals that are equal and cross at right angles', 'square'],
  ];
  function quadProperty() {
    const [fact, name] = R.pick(quadFacts);
    const opts = R.sample(Object.keys(quads).filter((q) => q !== name), 3).concat([name]);
    return choiceQ(`Which quadrilateral has ${fact}?`, null, opts, 3,
      'Picture each shape. Check its sides, angles and parallel lines.',
      [`A ${name} has ${fact}.`, `Answer: <b>${name}</b>.`], { skill: 'quadrilaterals' });
  }
  function nameQuad() {
    const name = R.pick(Object.keys(quads));
    const opts = R.sample(Object.keys(quads).filter((q) => q !== name), 3).concat([name]);
    const why = { square: '4 equal sides and 4 right angles', rectangle: '4 right angles, opposite sides equal', rhombus: '4 equal sides (marked with ticks), no right angles', parallelogram: 'two pairs of parallel, equal sides, no right angles', trapezium: 'exactly one pair of parallel sides (the arrows)', kite: 'two pairs of equal adjacent sides (the ticks)' }[name];
    return choiceQ('What is the name of this quadrilateral?', quadSvg(name), opts, 3,
      'Look for tick marks (equal sides), arrows (parallel sides) and square corners.',
      [`This shape has ${why}.`, `It is a <b>${name}</b>.`], { skill: 'quadrilaterals' });
  }
  function polygonName(level) {
    const ns = level === 1 ? [3, 4, 5, 6, 8] : [5, 6, 7, 8, 9, 10, 12];
    const n = R.pick(ns);
    if (R.chance(0.5)) {
      const others = R.sample(Object.keys(polyNames).map(Number).filter((k) => k !== n), 3);
      const opts = others.map((k) => polyNames[k]).concat([polyNames[n]]);
      return choiceQ(`A polygon has ${n} sides. What is it called?`, polySvg(n), opts, 3,
        'tri = 3, quad = 4, pent = 5, hex = 6, hept = 7, oct = 8, non = 9, dec = 10, dodec = 12.',
        [`${n} sides → <b>${polyNames[n]}</b>.`], { skill: 'polygons' });
    }
    return numQ(`How many sides does a ${polyNames[n]} have?`, null, n,
      'Think of the prefix: pent (5), hex (6), hept (7), oct (8), non (9), dec (10), dodec (12).',
      [`A ${polyNames[n]} has <b>${n}</b> sides.`]);
  }
  function interiorSum(level) {
    const n = R.pick(level === 2 ? [5, 6, 7, 8] : [8, 9, 10, 12]);
    const sum = (n - 2) * 180;
    return numQ(`What is the sum of the interior angles of a ${polyNames[n]} (${n} sides)?`, polySvg(n, C.sky), sum,
      'Split the polygon into triangles from one corner: there are (n − 2) triangles, each 180°.',
      [`A ${polyNames[n]} splits into ${n} − 2 = ${n - 2} triangles.`, `${n - 2} × 180 = ${sum}.`, `Sum of interior angles = <b>${sum}°</b>.`], '°');
  }
  function regularEach() {
    const n = R.pick([5, 6, 8, 9, 10, 12]);
    if (R.chance(0.5)) {
      const sum = (n - 2) * 180, each = sum / n;
      return numQ(`What is the size of each interior angle of a regular ${polyNames[n]}?`, polySvg(n, C.lav), each,
        `First find the angle sum: (${n} − 2) × 180. Then share it equally between the ${n} angles.`,
        [`Angle sum = (${n} − 2) × 180 = ${sum}°.`, `Regular means all angles are equal: ${sum} ÷ ${n} = ${each}.`, `Each interior angle = <b>${each}°</b>.`], '°');
    }
    return numQ(`What is the size of each exterior angle of a regular ${polyNames[n]}?`, polySvg(n, C.peach), 360 / n,
      'The exterior angles of any polygon add to 360°. Share equally.',
      ['Exterior angles add to 360°.', `360 ÷ ${n} = ${360 / n}.`, `Each exterior angle = <b>${360 / n}°</b>.`], '°');
  }
  function solidFEV(level) {
    const keys = level === 1 ? ['cube', 'cuboid', 'square pyramid'] : level === 2 ? ['cube', 'cuboid', 'triangular prism', 'square pyramid', 'tetrahedron'] : ['triangular prism', 'square pyramid', 'tetrahedron', 'pentagonal prism', 'hexagonal prism'];
    const key = R.pick(keys), s = solids[key];
    const what = R.pick(['faces', 'edges', 'vertices']);
    const v = { faces: s.F, edges: s.E, vertices: s.V }[what];
    const expl = { faces: `Faces are the flat surfaces: ${s.faces}.`, edges: 'Edges are the straight lines where two faces meet. Count front, back and the ones joining them.', vertices: 'Vertices are the corners (points).' }[what];
    return numQ(`How many ${what} does a ${s.name} have?`, solidSvg(key), v,
      what === 'faces' ? 'Faces are the flat sides. Remember the ones you cannot see at the back and bottom.' : what === 'edges' ? 'Edges are the straight lines. Count the front shape, the back shape, then the joining edges.' : 'Vertices are the corners.',
      [expl, `A ${s.name} has <b>${v}</b> ${what}.`], '');
  }
  function euler() {
    const key = R.pick(Object.keys(solids)), s = solids[key];
    const ask = R.pick(['F', 'E', 'V']);
    const names = { F: 'faces', E: 'edges', V: 'vertices' };
    const given = ['F', 'E', 'V'].filter((k) => k !== ask);
    const val = s[ask];
    const w = ask === 'E' ? [`Euler's rule: F + V − E = 2.`, `${s.F} + ${s.V} − E = 2, so E = ${s.F + s.V} − 2 = ${val}.`] : ask === 'F' ? [`Euler's rule: F + V − E = 2.`, `F + ${s.V} − ${s.E} = 2, so F = 2 + ${s.E} − ${s.V} = ${val}.`] : [`Euler's rule: F + V − E = 2.`, `${s.F} + V − ${s.E} = 2, so V = 2 + ${s.E} − ${s.F} = ${val}.`];
    return numQ(`A solid has ${s[given[0]]} ${names[given[0]]} and ${s[given[1]]} ${names[given[1]]}. Use Euler's rule (F + V − E = 2) to find how many ${names[ask]} it has.`, null, val,
      'Put the two numbers you know into F + V − E = 2 and solve for the missing one.',
      w.concat([`It has <b>${val}</b> ${names[ask]} (it is a ${s.name}).`]), '');
  }
  function net() {
    const keys = ['cube', 'cuboid', 'square pyramid', 'triangular prism', 'cylinder'];
    const key = R.pick(keys);
    if (R.chance(0.35) && key !== 'cylinder') {
      const f = key === 'cylinder' ? 3 : key === 'cuboid' ? 6 : solids[key].F;
      return numQ('How many faces does the solid made from this net have?', netSvg(key), f, 'Each shape in the net becomes one face.', [`Count the shapes in the net: ${f}.`, `The solid has <b>${f}</b> faces.`], '');
    }
    const opts = R.sample(keys.filter((k) => k !== key), 3).concat([key]);
    const why = { cube: '6 squares', cuboid: '6 rectangles', 'square pyramid': 'a square with 4 triangles', 'triangular prism': '3 rectangles and 2 triangles', cylinder: 'a rectangle with 2 circles' }[key];
    return choiceQ('Which solid does this net fold up to make?', netSvg(key), opts, 3,
      'Count the shapes in the net. Squares, rectangles, triangles or circles?',
      [`The net is made of ${why}.`, `It folds into a <b>${key}</b>.`], { skill: 'nets' });
  }
  function symmetry(level) {
    const pool = level === 1 ? symShapes.slice(0, 6) : symShapes;
    const [name, n, draw] = R.pick(pool);
    return numQ(`How many lines of symmetry does ${/^[aeiou]/.test(name) ? 'an' : 'a'} ${name} have?`, draw(), n,
      'A line of symmetry folds the shape exactly onto itself. Try folds through corners and through the middles of sides.',
      [n === 0 ? 'No fold line makes the two halves match exactly.' : `There ${n === 1 ? 'is' : 'are'} ${n} fold line${n === 1 ? '' : 's'} where both halves match.`, `${/^[aeiou]/.test(name) ? 'An' : 'A'} ${name} has <b>${n}</b> line${n === 1 ? '' : 's'} of symmetry.`], '');
  }

  // ----- rotational symmetry, congruent / similar, plan-front-side views, circle parts -----
  const rotShapes = [
    ['square', 4, () => quadSvg('square')], ['rectangle', 2, () => quadSvg('rectangle')], ['equilateral triangle', 3, () => triSvg('equilateral')],
    ['isosceles triangle', 1, () => triSvg('isosceles')], ['regular pentagon', 5, () => polySvg(5)], ['regular hexagon', 6, () => polySvg(6, C.butter)],
    ['parallelogram', 2, () => quadSvg('parallelogram')], ['rhombus', 2, () => quadSvg('rhombus')], ['kite', 1, () => quadSvg('kite')],
    ['regular octagon', 8, () => polySvg(8, C.pink)], ['scalene triangle', 1, () => triSvg('scalene')],
  ];
  function rotSymmetry(level) {
    const pool = level === 1 ? rotShapes.filter(([, n]) => n <= 4) : rotShapes;
    const [name, n, draw] = R.pick(pool);
    const an = /^[aeiou]/.test(name) ? 'an' : 'a';
    if (level === 3 && R.chance(0.4)) {
      return Object.assign(numQ(`${an[0].toUpperCase() + an.slice(1)} ${name} has rotational symmetry of order ${n}. Through how many degrees must you turn it before it first looks the same again?`, draw(), 360 / n,
        `One full turn is 360°. Share it into ${n} equal turns.`,
        [`Order ${n} means it looks the same ${n} times in a full turn.`, `360 ÷ ${n} = ${360 / n}.`, `You turn it <b>${360 / n}°</b>.`], '°'), { skill: 'rot-symmetry' });
    }
    return Object.assign(numQ(`What is the <b>order of rotational symmetry</b> of ${an} ${name}?`, draw(), n,
      'Turn the shape all the way round (360°) and count how many times it looks exactly the same, including when it gets back to the start.',
      [n === 1 ? 'It only looks the same when it is back at the start, so the order is 1 (no rotational symmetry).' : `Turning it ${N.fmt(360 / n)}° at a time, it looks the same ${n} times in one full turn.`, `Order of rotational symmetry = <b>${n}</b>.`], ''), { skill: 'rot-symmetry' });
  }

  const csOpts = ['congruent (same shape and same size)', 'similar (same shape, different size)', 'neither'];
  function twoRectSvg(w1, h1, w2, h2) {
    const sc = Math.min(9, 118 / Math.max(w1, w2), 126 / Math.max(h1, h2)), base = 168;
    const draw = (x0, w, h, fill, lab) => poly([[x0, base], [x0 + w * sc, base], [x0 + w * sc, base - h * sc], [x0, base - h * sc]], fill)
      + text(x0 + w * sc / 2, base + 16, `${w} cm`, 'font-size="14"')
      + text(x0 - 11, base - h * sc / 2, `${h}`, 'font-size="14"')
      + text(x0 + w * sc / 2, 18, lab, 'font-size="15"');
    return svg(320, 192, draw(46, w1, h1, C.sky, 'A') + draw(190, w2, h2, C.pink, 'B'));
  }
  function congSim(level) {
    const form = level === 1 ? R.pick(['define', 'define', 'rect']) : level === 2 ? R.pick(['define', 'rect', 'tri', 'tri']) : R.pick(['rect', 'tri', 'missing', 'missing']);
    if (form === 'define') {
      const q = R.pick([
        ['Two shapes are exactly the <b>same shape and the same size</b>. What are they called?', 0, 'Same shape AND same size = one is a perfect copy of the other.'],
        ['Two shapes are the <b>same shape</b> but one is <b>bigger</b> than the other. What are they called?', 1, 'Same shape, zoomed bigger or smaller = one is an enlargement of the other.'],
        ['A photo is enlarged to make a poster. The poster and the photo are …?', 1, 'Enlarging keeps the shape but changes the size.'],
        ['Harper cuts out two identical paper stars with the same template. The two stars are …?', 0, 'Same template = same shape and same size.'],
      ]);
      return choiceQ(q[0], null, csOpts, q[1], 'Congruent = a copy (same size). Similar = the same shape zoomed bigger or smaller.',
        [q[2], `They are <b>${csOpts[q[1]]}</b>.`], { skill: 'congruent-similar' });
    }
    if (form === 'rect') {
      const w = R.int(2, 6), h = R.int(7, 12), kind = R.pick(['congruent', 'similar', 'neither']);
      const k = R.pick([2, 3]);
      const [w2, h2] = kind === 'congruent' ? [w, h] : kind === 'similar' ? [w * k, h * k] : [w + R.pick([1, 2]), h];
      const correct = kind === 'congruent' ? 0 : kind === 'similar' ? 1 : 2;
      return choiceQ('Look at rectangles <b>A</b> and <b>B</b>. Are they congruent, similar, or neither?', twoRectSvg(w, h, w2, h2), csOpts, correct,
        'Divide each pair of matching sides. If both answers are 1 they are congruent. If both answers are the same number they are similar.',
        [`Long sides: ${h2} ÷ ${h} = ${N.fmt(h2 / h)}. Short sides: ${w2} ÷ ${w} = ${N.fmt(w2 / w)}.`,
          correct === 0 ? 'Both are 1, so the rectangles are exactly the same size.' : correct === 1 ? `Both are ${k}, so B is A zoomed by ${k}.` : 'The two numbers are different, so B is not a zoom of A.',
          `They are <b>${csOpts[correct]}</b>.`], { skill: 'congruent-similar' });
    }
    if (form === 'tri') {
      const base = R.pick([[3, 4, 5], [5, 12, 13], [4, 5, 6], [5, 5, 8], [2, 3, 4], [6, 6, 6]]);
      const kind = R.pick(['congruent', 'similar', 'neither']);
      const k = R.pick([2, 3]);
      let d = R.pick([1, 2]);                                   // 'neither': change one side, keeping a real triangle
      while (d > 0 && base[0] + base[1] <= base[2] + d) d--;
      if (d === 0) d = -1;
      const other = kind === 'congruent' ? base.slice() : kind === 'similar' ? base.map((s2) => s2 * k) : [base[0], base[1], base[2] + d];
      const correct = kind === 'congruent' ? 0 : kind === 'similar' ? 1 : 2;
      return choiceQ(`Triangle A has sides ${base.join(' cm, ')} cm. Triangle B has sides ${other.join(' cm, ')} cm. Are they congruent, similar, or neither?`, null, csOpts, correct,
        'Divide each side of B by the matching side of A. All the same number → similar. All 1 → congruent.',
        [`${other[0]} ÷ ${base[0]} = ${N.fmt(other[0] / base[0])}, ${other[1]} ÷ ${base[1]} = ${N.fmt(other[1] / base[1])}, ${other[2]} ÷ ${base[2]} = ${N.fmt(other[2] / base[2])}.`,
          correct === 0 ? 'Every side matches exactly, so B is a copy of A.' : correct === 1 ? `Every side is ${k} times bigger, so B is A zoomed by ${k}.` : 'The numbers are not all the same, so B is not a zoom of A.',
          `They are <b>${csOpts[correct]}</b>.`], { skill: 'congruent-similar' });
    }
    const w = R.int(2, 5), h = R.int(6, 10), k = R.pick([2, 3]);
    return Object.assign(numQ(`Rectangle A is ${w} cm by ${h} cm. Rectangle B is <b>similar</b> to A, and its short side is ${w * k} cm. How long is the long side of B?`, twoRectSvg(w, h, w * k, h * k), h * k,
      `First find the scale factor: ${w * k} ÷ ${w}. Then multiply the other side by it.`,
      [`Scale factor = ${w * k} ÷ ${w} = ${k}.`, `Similar shapes: <b>every</b> length is multiplied by ${k}.`, `Long side = ${h} × ${k} = <b>${h * k} cm</b>.`], 'cm'), { skill: 'congruent-similar' });
  }

  const cubeModels = [
    [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1]],
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 0, 1]],
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1]],
    [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 0, 1]],
    [[0, 0, 0], [0, 1, 0], [0, 0, 1], [0, 1, 1]],
  ];
  /* cubes are [x across, y depth (0 = front row), z up]. Isometric: +x right-down, +y right-up (away), +z up. */
  function isoCubesSvg(cubes) {
    const hw = 26, hh = 15, ch = 30;
    const mX = Math.max(...cubes.map((c) => c[0])) + 1, mY = Math.max(...cubes.map((c) => c[1])) + 1, mZ = Math.max(...cubes.map((c) => c[2])) + 1;
    const ox = 160 - (mX + mY) * hw / 2, oy = 26 + mY * hh + mZ * ch;
    const P = (a, b2, c) => [ox + (a + b2) * hw, oy + (a - b2) * hh - c * ch];
    const face = (pts, fill) => `<polygon points="${pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${fill}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
    let b = '';
    cubes.slice().sort((p, q) => (p[0] - p[1]) - (q[0] - q[1]) || p[2] - q[2]).forEach(([x, y, z]) => {
      b += face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], '#DCEEFB');
      b += face([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)], C.sky);
      b += face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], '#7EBEE4');
    });
    b += text(160, 196, 'the front faces you at the bottom left', `font-size="13" fill="${C.rose}"`);
    return svg(320, 210, b);
  }
  /** the squares you see from above (plan), from the front, or from the right side */
  const viewCells = (cubes, which) => {
    const mY = Math.max(...cubes.map((c) => c[1])), mZ = Math.max(...cubes.map((c) => c[2]));
    const set = new Set();
    cubes.forEach(([x, y, z]) => set.add(which === 'plan' ? `${x},${mY - y}` : which === 'front' ? `${x},${mZ - z}` : `${y},${mZ - z}`));
    return [...set];
  };
  function viewSvg(cells) {
    const cols = Math.max(...cells.map((c) => +c.split(',')[0])) + 1, rows = Math.max(...cells.map((c) => +c.split(',')[1])) + 1;
    const s = 24, w = cols * s + 10, h = rows * s + 10;
    let b = '';
    cells.forEach((c) => { const [x, y] = c.split(',').map(Number); b += poly([[5 + x * s, 5 + y * s], [5 + x * s + s, 5 + y * s], [5 + x * s + s, 5 + y * s + s], [5 + x * s, 5 + y * s + s]], C.mint); });
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
  }
  const cellKey = (cells) => cells.slice().sort().join(' ');
  function viewsQ(level) {
    const cubes = R.pick(cubeModels);
    const which = level === 1 ? 'plan' : R.pick(['plan', 'front', 'side']);
    const right = viewCells(cubes, which);
    const key = cellKey(right);
    const pool = [];
    cubeModels.forEach((m) => ['plan', 'front', 'side'].forEach((v) => { const c = viewCells(m, v); if (cellKey(c) !== key && !pool.some((p) => cellKey(p) === cellKey(c))) pool.push(c); }));
    const opts = R.sample(pool, 3).concat([right]).map(viewSvg);
    const from = which === 'plan' ? 'from <b>above</b> (the plan view)' : which === 'front' ? 'from the <b>front</b>' : 'from the <b>right-hand side</b> (the front of the model ends up on the left)';
    const nCubes = cubes.length;
    const cols = Math.max(...right.map((c) => +c.split(',')[0])) + 1, rows = Math.max(...right.map((c) => +c.split(',')[1])) + 1;
    return choiceQ(`${nCubes} cubes are stacked like this. What do you see when you look at them ${from}?`, isoCubesSvg(cubes), opts, 3,
      which === 'plan' ? 'Looking down from above you only see how far the cubes spread out. Height does not show.' : 'You are looking straight at the model, so you only see a flat outline of squares.',
      [which === 'plan' ? 'From above you see the "footprint" of the model: every cube that touches the ground, and any cube stacked on top hides behind it.' : which === 'front' ? 'From the front you see how <b>wide</b> and how <b>tall</b> the model is. Cubes behind other cubes are hidden.' : 'From the side you see how <b>deep</b> and how <b>tall</b> the model is.',
        `The view is <b>${cols}</b> square${cols === 1 ? '' : 's'} across and <b>${rows}</b> square${rows === 1 ? '' : 's'} up, using <b>${right.length}</b> squares.`,
        'That is the picture shown.'], { skill: 'views' });
  }

  const circleParts = {
    centre: 'the middle point of the circle',
    radius: 'a line from the centre to the edge',
    diameter: 'a line right across the circle through the centre',
    chord: 'a line joining two points on the edge, not through the centre',
    arc: 'a piece of the edge of the circle',
    sector: 'a pizza-slice piece between two radii',
    circumference: 'the whole distance round the edge',
  };
  function circlePartSvg(part) {
    const cx = 120, cy = 100, r = 72;
    const P = (a) => [cx + r * Math.cos(a * D), cy - r * Math.sin(a * D)];
    const hi = (d) => `<path d="${d}" fill="none" stroke="${C.rose}" stroke-width="5" stroke-linecap="round"/>`;
    const seg = (a1, a2) => { const [x1, y1] = P(a1), [x2, y2] = P(a2); return hi(`M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y2)}`); };
    let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" fill-opacity=".3" stroke="${C.ink}" stroke-width="2.5"/>`;
    const dot = `<circle cx="${cx}" cy="${cy}" r="4" fill="${C.ink}"/>`;
    if (part === 'centre') b += `<circle cx="${cx}" cy="${cy}" r="7" fill="${C.rose}"/>`;
    else if (part === 'radius') b += hi(`M${cx} ${cy} L${r1(P(35)[0])} ${r1(P(35)[1])}`) + dot;
    else if (part === 'diameter') b += seg(20, 200) + dot;
    else if (part === 'chord') b += seg(-45, 65);
    else if (part === 'arc') { const [x1, y1] = P(75), [x2, y2] = P(-15); b += hi(`M${r1(x1)} ${r1(y1)} A${r} ${r} 0 0 1 ${r1(x2)} ${r1(y2)}`); }
    else if (part === 'sector') { const [x1, y1] = P(85), [x2, y2] = P(10); b += `<path d="M${cx} ${cy} L${r1(x1)} ${r1(y1)} A${r} ${r} 0 0 1 ${r1(x2)} ${r1(y2)} Z" fill="${C.rose}" fill-opacity=".5" stroke="${C.rose}" stroke-width="3" stroke-linejoin="round"/>` + dot; }
    else b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.rose}" stroke-width="5"/>`;
    return svg(250, 200, b);
  }
  function circleVocab(level) {
    const pool = level === 1 ? ['centre', 'radius', 'diameter'] : level === 2 ? ['centre', 'radius', 'diameter', 'chord', 'circumference'] : Object.keys(circleParts);
    const part = R.pick(pool);
    const opts = R.sample(Object.keys(circleParts).filter((p) => p !== part), 3).concat([part]);
    if (R.chance(0.45)) {
      return choiceQ(`Which word means <b>${circleParts[part]}</b>?`, null, opts, 3,
        'Picture a pizza: the centre is the middle, a radius is one straight cut from the middle, the crust is the circumference.',
        [`${part[0].toUpperCase() + part.slice(1)} = ${circleParts[part]}.`, `Answer: <b>${part}</b>.`], { skill: 'circle-parts' });
    }
    return choiceQ('What is the part marked in pink called?', circlePartSvg(part), opts, 3,
      'Is it a point, a straight line, a curved piece of the edge, or a slice of the inside?',
      [`The pink part is ${circleParts[part]}.`, `It is the <b>${part}</b>.`], { skill: 'circle-parts' });
  }

  function calc(level) {
    if (level === 1) return R.pick([triBySides, () => triByAngles(1), nameQuad, () => polygonName(1), () => solidFEV(1), net, () => symmetry(1),
      () => rotSymmetry(1), () => congSim(1), () => circleVocab(1), () => viewsQ(1)])();
    if (level === 2) return R.pick([triBySides, () => triByAngles(2), quadProperty, nameQuad, () => polygonName(2), () => interiorSum(2), () => solidFEV(2), net, () => symmetry(2),
      () => rotSymmetry(2), () => congSim(2), () => circleVocab(2), () => viewsQ(2)])();
    return R.pick([() => interiorSum(3), regularEach, regularEach, () => solidFEV(3), euler, euler, quadProperty, () => symmetry(3), () => triByAngles(3),
      () => rotSymmetry(3), () => congSim(3), () => circleVocab(3), () => viewsQ(3)])();
  }

  function word(level) {
    const t = R.pick(level === 1 ? ['box', 'dice', 'toblerone', 'tent', 'signs', 'wheelRot', 'pizzaCircle'] : level === 2 ? ['box', 'toblerone', 'tent', 'pyramid', 'signs', 'kite', 'court', 'wheelRot', 'pizzaCircle', 'photoSim'] : ['stopSign', 'honeycomb', 'toblerone3', 'eulerWord', 'pyramid', 'tiles', 'wheelRot', 'photoSim', 'pizzaCircle']);
    if (t === 'wheelRot') {
      const n = R.pick([3, 4, 5, 6, 8]);
      const [thing, part] = R.pick([['a car wheel trim', 'spokes'], ['a bike sprocket', 'teeth'], ['a fan', 'blades'], ['a snowflake decoration', 'points'], ['a windmill', 'sails']]);
      if (level === 3 && R.chance(0.4)) {
        return Object.assign(numQ(`Looking at ${thing} with ${n} equally spaced ${part}, it looks the same ${n} times in a full turn. Through how many degrees must you turn it before it first looks the same?`, polySvg(n, C.sky), 360 / n,
          `A full turn is 360°. Share it between the ${n} equal positions.`,
          [`Order of rotational symmetry = ${n}.`, `360 ÷ ${n} = ${360 / n}.`, `Turn it <b>${360 / n}°</b>.`], '°'), { skill: 'rot-symmetry' });
      }
      return Object.assign(numQ(`${thing[0].toUpperCase() + thing.slice(1)} has ${n} equally spaced ${part}. What is its <b>order of rotational symmetry</b>?`, polySvg(n, C.sky), n,
        'Turn it all the way round once and count how many times it looks exactly the same.',
        [`The ${part} are equally spaced, so turning by 360 ÷ ${n} = ${N.fmt(360 / n)}° makes it look the same.`, `That happens ${n} times in one full turn.`, `Order of rotational symmetry = <b>${n}</b>.`], ''), { skill: 'rot-symmetry' });
    }
    if (t === 'photoSim') {
      const q = R.pick([
        ['Harper prints the same beach photo as a small 10 cm by 15 cm print and as a big 20 cm by 30 cm poster. The two pictures are …?', 1, 'Every length is doubled, so the shape is the same but the size is different.'],
        ['Two rugby fields are marked out to exactly the same measurements. The two fields are …?', 0, 'Same shape and same size = one is a copy of the other.'],
        ['A model kiwi is built to 1/4 of the size of the real statue. The model and the statue are …?', 1, 'The model is the statue zoomed smaller, so the shape stays the same.'],
        ['Harper cuts two triangles from card using the same template. They are …?', 0, 'The same template gives the same shape and the same size.'],
      ]);
      return choiceQ(q[0], null, csOpts, q[1], 'Same size as well as same shape → congruent. Same shape, zoomed → similar.',
        [q[2], `They are <b>${csOpts[q[1]]}</b>.`], { skill: 'congruent-similar' });
    }
    if (t === 'pizzaCircle') {
      const part = R.pick(level === 1 ? ['centre', 'radius', 'diameter'] : ['radius', 'diameter', 'chord', 'sector', 'circumference', 'arc']);
      const story = { centre: 'the exact middle of a pizza, where all the cuts meet', radius: 'one straight cut from the middle of a pizza out to the crust', diameter: 'a straight cut right across a pizza, passing through the middle', chord: 'a straight cut across a pizza that does <b>not</b> go through the middle', sector: 'one slice of a pizza, between two cuts from the middle', circumference: 'the whole way round the crust of a pizza', arc: 'the piece of crust along the edge of one slice' }[part];
      const opts = R.sample(Object.keys(circleParts).filter((p) => p !== part), 3).concat([part]);
      return choiceQ(`In maths, what do we call ${story}?`, circlePartSvg(part), opts, 3,
        'Match the pizza picture to the circle word: middle, cut from the middle, cut across, slice, crust.',
        [`${part[0].toUpperCase() + part.slice(1)} = ${circleParts[part]}.`, `Answer: <b>${part}</b>.`], { skill: 'circle-parts' });
    }
    if (t === 'box' || t === 'dice') {
      const thing = t === 'dice' ? 'A dice is a cube' : R.pick(['A shoebox is a cuboid', 'A cereal box is a cuboid', 'A moving box is a cuboid']);
      const what = R.pick(['faces', 'edges', 'vertices']), v = { faces: 6, edges: 12, vertices: 8 }[what];
      return numQ(`${thing}. How many ${what} does it have?`, solidSvg(t === 'dice' ? 'cube' : 'cuboid'), v,
        'Faces = flat sides, edges = straight lines, vertices = corners.',
        [`${what === 'faces' ? 'Top, bottom, front, back, left, right' : what === 'edges' ? '4 on top, 4 on the bottom, 4 going up' : '4 corners on top, 4 on the bottom'}: ${v}.`, `It has <b>${v}</b> ${what}.`], '');
    }
    if (t === 'toblerone' || t === 'tent') {
      const thing = t === 'tent' ? 'A tent' : 'A Toblerone packet';
      const what = R.pick(['faces', 'edges', 'vertices']), v = { faces: 5, edges: 9, vertices: 6 }[what];
      return numQ(`${thing} is shaped like a triangular prism. How many ${what} does it have?`, solidSvg('triangular prism'), v,
        'A triangular prism has a triangle at each end joined by rectangles.',
        [`${what === 'faces' ? '2 triangle ends + 3 rectangles' : what === 'edges' ? '3 on each triangle end (6) + 3 joining edges' : '3 corners on each triangle end'} = ${v}.`, `It has <b>${v}</b> ${what}.`], '');
    }
    if (t === 'toblerone3') {
      const n = R.pick([5, 6, 8]), name = { 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' }[n];
      const what = R.pick(['faces', 'edges', 'vertices']), v = { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what];
      return numQ(`A gift box is a ${name} prism (its ends are ${polyNames[n]}s). How many ${what} does it have?`, n === 8 ? null : solidSvg(n === 5 ? 'pentagonal prism' : 'hexagonal prism'), v,
        `A prism has two matching ends. Each end has ${n} sides and ${n} corners.`,
        [what === 'faces' ? `2 ends + ${n} rectangles = ${v}.` : what === 'edges' ? `${n} on each end (${2 * n}) + ${n} joining edges = ${v}.` : `${n} corners on each end: 2 × ${n} = ${v}.`, `It has <b>${v}</b> ${what}.`], '');
    }
    if (t === 'pyramid') {
      const what = R.pick(['faces', 'edges', 'vertices']), v = { faces: 5, edges: 8, vertices: 5 }[what];
      return numQ(`The Great Pyramid in Egypt is a square-based pyramid. How many ${what} does it have?`, solidSvg('square pyramid'), v,
        'A square base plus one triangle on each side of the square, all meeting at the top.',
        [`${what === 'faces' ? '1 square base + 4 triangles' : what === 'edges' ? '4 around the base + 4 going up to the top' : '4 corners on the base + 1 at the top'} = ${v}.`, `It has <b>${v}</b> ${what}.`], '');
    }
    if (t === 'signs') {
      const [n, thing] = R.pick([[8, 'A STOP sign'], [3, 'A "give way" sign'], [6, 'A snowflake outline'], [5, 'The Pentagon building in the USA'], [4, 'A road sign that is a diamond']]);
      const others = R.sample(Object.keys(polyNames).map(Number).filter((k) => k !== n), 3);
      const opts = others.map((k) => polyNames[k]).concat([polyNames[n]]);
      return choiceQ(`${thing} has ${n} sides. What is the name of a ${n}-sided polygon?`, polySvg(n, C.rose), opts, 3,
        'tri = 3, quad = 4, pent = 5, hex = 6, oct = 8.', [`${n} sides → <b>${polyNames[n]}</b>.`], { skill: 'polygons' });
    }
    if (t === 'stopSign') {
      return numQ('A STOP sign is a regular octagon. What is the size of each of its interior angles?', polySvg(8, C.rose), 135,
        'Angle sum of an octagon = (8 − 2) × 180. Then divide by 8.',
        ['(8 − 2) × 180 = 6 × 180 = 1080°.', '1080 ÷ 8 = 135.', 'Each interior angle is <b>135°</b>.'], '°');
    }
    if (t === 'honeycomb') {
      return numQ('Each cell of a honeycomb is a regular hexagon. What is the size of each interior angle of a cell?', polySvg(6, C.butter), 120,
        'Angle sum of a hexagon = (6 − 2) × 180. Then divide by 6.',
        ['(6 − 2) × 180 = 4 × 180 = 720°.', '720 ÷ 6 = 120.', 'Each interior angle is <b>120°</b>.'], '°');
    }
    if (t === 'tiles') {
      const n = R.pick([5, 10, 12, 9]), sum = (n - 2) * 180;
      return numQ(`A decorative floor tile is a ${polyNames[n]} (${n} sides). What is the sum of its interior angles?`, polySvg(n, C.lav), sum,
        'Use (n − 2) × 180.',
        [`(${n} − 2) × 180 = ${n - 2} × 180.`, `= ${sum}.`, `Angle sum = <b>${sum}°</b>.`], '°');
    }
    if (t === 'eulerWord') {
      const [F, V, E, name] = R.pick([[6, 8, 12, 'a cuboid box'], [5, 6, 9, 'a Toblerone packet'], [7, 10, 15, 'a pentagonal-prism gift box'], [8, 6, 12, 'an octahedron crystal'], [5, 5, 8, 'a square pyramid'], [8, 12, 18, 'a hexagonal-prism pencil']]);
      return numQ(`Harper counts ${F} faces and ${V} vertices on ${name}. Use Euler's rule (F + V − E = 2) to work out how many edges it has.`, null, E,
        'F + V − E = 2. Put in F and V, then find E.',
        [`${F} + ${V} − E = 2.`, `E = ${F + V} − 2 = ${E}.`, `It has <b>${E}</b> edges.`], '');
    }
    if (t === 'kite') {
      return numQ('Harper makes a kite shape from two sticks. A kite has how many lines of symmetry?', quadSvg('kite'), 1,
        'Try folding the kite along each stick. Which fold matches the halves exactly?',
        ['Folding along the long stick matches both halves. Folding along the short stick does not.', 'A kite has <b>1</b> line of symmetry.'], '');
    }
    // court
    const [thing, shape, n] = R.pick([['A netball court', 'rectangle', 2], ['A rugby field', 'rectangle', 2], ['A square pizza box lid', 'square', 4], ['A hexagonal nut', 'regular hexagon', 6]]);
    return numQ(`${thing} is a ${shape}. How many lines of symmetry does it have?`, shape === 'regular hexagon' ? polySvg(6) : quadSvg(shape), n,
      'Try folds through the middle of opposite sides and through opposite corners.',
      [shape === 'rectangle' ? 'Folds through the middles of the sides work (2). Folds corner to corner do not.' : shape === 'square' ? '2 folds through the middles of the sides + 2 corner-to-corner folds.' : '3 folds through opposite corners + 3 through the middles of opposite sides.', `<b>${n}</b> lines of symmetry.`], '');
  }

  HL.registerTopic({
    id: 'shapes', subject: 'maths', strand: 'geometry', order: 2,
    name: '2D & 3D shapes', short: 'Shapes',
    blurb: 'Name shapes and solids, count faces, edges and vertices, and find angle sums.',
    example: 'Hexagon angle sum = (6 − 2) × 180° = 720°',
    animal: 'koala',
    learn: {
      what: '<p>Picture every shape as a <b>paper cut-out</b> you can fold, and every solid as a <b>cardboard box</b> you can turn over in your hands. <b>2D shapes</b> are flat: triangles, quadrilaterals (4 sides) and other polygons. <b>3D solids</b> have <b>faces</b> (flat surfaces), <b>edges</b> (where two faces meet) and <b>vertices</b> (corners). Tick marks mean <b>equal sides</b>; arrows mean <b>parallel sides</b>.</p>',
      visual: (() => {
        const arrow = (p, q, n = 1) => { // n chevrons at the midpoint of side p→q, pointing along it
          const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
          let s = ''; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 7, mx = (p[0] + q[0]) / 2 + ux * o, my = (p[1] + q[1]) / 2 + uy * o; s += `<path d="M${r1(mx - ux * 6 + nx * 5)} ${r1(my - uy * 6 + ny * 5)} L${r1(mx)} ${r1(my)} L${r1(mx - ux * 6 - nx * 5)} ${r1(my - uy * 6 - ny * 5)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`; }
          return s;
        };
        const cap = (x, y, s) => text(x, y, s, 'font-size="13"');
        let b = '';
        // row 1: triangles
        const eq = regular(3, 45, 32, 28); b += poly(eq, C.sky) + tick(eq[0], eq[1]) + tick(eq[1], eq[2]) + tick(eq[2], eq[0]) + cap(45, 68, 'equilateral');
        const is = [[135, 6], [160, 52], [110, 52]]; b += poly(is, C.pink) + tick(is[0], is[1]) + tick(is[2], is[0]) + cap(135, 68, 'isosceles');
        b += poly([[196, 52], [254, 50], [214, 8]], C.mint) + cap(225, 68, 'scalene');
        b += poly([[292, 8], [292, 52], [340, 52]], C.peach) + `<path d="M292 40 h12 v12" fill="none" stroke="${C.ink}" stroke-width="2"/>` + cap(315, 68, 'right-angled');
        // row 2: quadrilaterals
        const sq = [[38, 80], [82, 80], [82, 124], [38, 124]]; b += poly(sq, C.pink); for (let i = 0; i < 4; i++) b += tick(sq[i], sq[(i + 1) % 4]); b += `<path d="M38 92 h12 v-12" fill="none" stroke="${C.ink}" stroke-width="2"/>` + cap(60, 140, 'square');
        const re = [[145, 84], [215, 84], [215, 122], [145, 122]]; b += poly(re, C.sky) + tick(re[0], re[1]) + tick(re[2], re[3]) + tick(re[1], re[2], 2) + tick(re[3], re[0], 2) + cap(180, 140, 'rectangle');
        const pa = [[250, 122], [320, 122], [350, 84], [280, 84]]; b += poly(pa, C.mint) + arrow(pa[0], pa[1]) + arrow(pa[3], pa[2]) + arrow(pa[1], pa[2], 2) + arrow(pa[0], pa[3], 2) + cap(300, 140, 'parallelogram');
        // row 3
        const rh = [[60, 150], [92, 174], [60, 198], [28, 174]]; b += poly(rh, C.lav); for (let i = 0; i < 4; i++) b += tick(rh[i], rh[(i + 1) % 4]); b += cap(60, 212, 'rhombus');
        const tr = [[140, 198], [220, 198], [200, 152], [160, 152]]; b += poly(tr, C.peach) + arrow(tr[0], tr[1]) + arrow(tr[3], tr[2]) + cap(180, 212, 'trapezium');
        const ki = [[300, 150], [326, 172], [300, 198], [274, 172]]; b += poly(ki, C.butter) + tick(ki[0], ki[1]) + tick(ki[3], ki[0]) + tick(ki[1], ki[2], 2) + tick(ki[2], ki[3], 2) + cap(300, 212, 'kite');
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        '<b>Triangles by sides</b>: equilateral = 3 equal, isosceles = 2 equal, scalene = none equal',
        '<b>Triangles by angles</b>: right-angled (one 90°), obtuse (one over 90°), acute (all under 90°)',
        '<b>Quadrilaterals</b>: square, rectangle, rhombus (4 equal sides), parallelogram (2 pairs parallel), trapezium (1 pair parallel), kite (2 pairs of equal neighbouring sides)',
        '<b>Angle sum</b> of a polygon = <b>(n − 2) × 180°</b>. Regular polygon: each angle = sum ÷ n',
        '<b>Euler</b>: Faces + Vertices − Edges = <b>2</b> (a check for solids)',
        '<b>Lines of symmetry</b> = fold lines where both halves match: square 4, rectangle 2, equilateral triangle 3',
        '<b>Order of rotational symmetry</b> = how many times a shape looks the same in <b>one full turn</b>: square 4, rectangle 2, equilateral triangle 3, kite 1',
        '<b>Congruent</b> = same shape <b>and</b> same size (a perfect copy). <b>Similar</b> = same shape, <b>zoomed</b> bigger or smaller',
        '<b>Plan</b> view = looking down from <b>above</b>. <b>Front</b> view = straight at the front. <b>Side</b> view = from the side. Each view is flat squares only',
        'Circle words: <b>centre</b>, <b>radius</b> (centre to edge), <b>diameter</b> (right across the middle = 2 × radius), <b>chord</b> (edge to edge, missing the middle), <b>arc</b> (part of the edge), <b>sector</b> (a slice)',
      ],
      steps: [
        '<b>Naming</b>: ask "how many sides?" then "any tick marks (equal sides)?" then "any arrows (parallel sides)?" then "any right angles?"',
        '<b>Angle sum</b>: cut the shape into triangles from one corner: n sides → n − 2 triangles → (n − 2) × 180°.',
        '<b>Regular</b> shape (all sides and angles equal): each angle = angle sum ÷ number of sides.',
        '<b>Solids</b>: hold the box in your head. Count faces, then edges, then vertices — including the hidden ones at the back. Check with F + V − E = 2.',
        '<b>Symmetry</b>: fold the paper. If the halves match exactly, that fold is a line of symmetry.',
      ],
      examples: [
        (() => {
          const P = [[110, 12], [190, 108], [30, 108]];
          let b = poly(P, C.pink) + tick(P[0], P[1]) + tick(P[2], P[0]);
          b += text(60, 40, 'equal', `font-size="13" fill="${C.rose}"`) + text(160, 40, 'equal', `font-size="13" fill="${C.rose}"`);
          return { q: 'Name this triangle.', visual: svg(220, 120, b),
            working: ['Picture the <b>paper cut-out</b>: fold it down the middle and the two tick-marked sides land on top of each other.', '1. How many sides? 3 → a triangle.', '2. Any tick marks? Yes, on <b>2 sides</b> → 2 equal sides.', '3. 2 equal sides = <b>isosceles</b>. (3 would be equilateral, 0 would be scalene.)'], a: 'isosceles triangle' };
        })(),
        (() => {
          const P = [[30, 108], [200, 108], [160, 22], [70, 22]];
          const chev = (x, y) => `<path d="M${x - 8} ${y - 6} L${x} ${y} L${x - 8} ${y + 6}" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
          let b = poly(P, C.peach) + chev(120, 22) + chev(120, 108);
          b += `<text x="212" y="66" font-size="13" dominant-baseline="middle" fill="${C.rose}">parallel</text><text x="212" y="82" font-size="13" dominant-baseline="middle" fill="${C.rose}">pair</text>`;
          return { q: 'Name this quadrilateral.', visual: svg(280, 120, b),
            working: ['Picture the <b>paper cut-out</b>: the top and bottom edges run like train tracks and never meet.', '1. How many sides? 4 → a quadrilateral.', '2. Any arrows? Yes, one pair → <b>1 pair of parallel sides</b>.', '3. Any tick marks? No. So it is not a rhombus or a kite.', '4. Exactly 1 pair of parallel sides = <b>trapezium</b>.'], a: 'trapezium' };
        })(),
        (() => {
          const P = regular(5, 110, 72, 66);
          const tri = (a, b2, c, fill) => poly([P[a], P[b2], P[c]], fill);
          const mid = (a, b2, c) => [(P[a][0] + P[b2][0] + P[c][0]) / 3, (P[a][1] + P[b2][1] + P[c][1]) / 3];
          let b = tri(0, 1, 2, C.pink) + tri(0, 2, 3, C.sky) + tri(0, 3, 4, C.mint);
          [[0, 1, 2], [0, 2, 3], [0, 3, 4]].forEach((t) => { const m = mid(...t); b += text(m[0], m[1] + 4, '180°', 'font-size="13"'); });
          b += `<text x="222" y="40" font-size="13" dominant-baseline="middle">5 sides</text><text x="222" y="60" font-size="13" dominant-baseline="middle" fill="${C.rose}">→ 3 triangles</text><text x="222" y="80" font-size="13" dominant-baseline="middle">3 × 180°</text><text x="222" y="100" font-size="13" dominant-baseline="middle">= 540°</text>`;
          return { q: 'Find the angle sum of a <b>pentagon</b>.', visual: svg(320, 140, b),
            working: ['Picture the <b>paper pentagon</b>: draw lines from one corner and it splits into triangles.', '1. How many sides? n = 5.', '2. How many triangles? n − 2 = 5 − 2 = <b>3</b>.', '3. Each triangle is 180°: 3 × 180 = <b>540</b>.'], a: '540°' };
        })(),
        (() => {
          const B = '#2A6FA5', G = '#2FA97A';
          const F = [[60, 68], [190, 68], [190, 148], [60, 148]], K = [[110, 28], [240, 28], [240, 108], [110, 108]];
          const dash = 'stroke-dasharray="5 4"';
          const seg = (p, q, col, extra = '') => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${col}" stroke-width="3" stroke-linecap="round" ${extra}/>`;
          let b = '';
          b += `<polygon points="${[F[0], F[1], K[1], K[0]].map((p) => p.join(',')).join(' ')}" fill="${C.peach}" fill-opacity=".35"/>`;
          b += `<polygon points="${[F[1], K[1], K[2], F[2]].map((p) => p.join(',')).join(' ')}" fill="${C.peach}" fill-opacity=".55"/>`;
          b += `<polygon points="${F.map((p) => p.join(',')).join(' ')}" fill="${C.peach}" fill-opacity=".75"/>`;
          // back edges (green), hidden ones dashed
          b += seg(K[0], K[1], G) + seg(K[1], K[2], G) + seg(K[2], K[3], G, dash) + seg(K[3], K[0], G, dash);
          // joining edges (rose)
          b += seg(F[0], K[0], C.rose) + seg(F[1], K[1], C.rose) + seg(F[2], K[2], C.rose) + seg(F[3], K[3], C.rose, dash);
          // front edges (blue)
          for (let i = 0; i < 4; i++) b += seg(F[i], F[(i + 1) % 4], B);
          const V = F.concat(K), off = [[-12, -6], [-12, 16], [12, 12], [-12, 12], [-12, -8], [12, -8], [12, 10], [12, 10]];
          V.forEach((p, i) => { b += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${C.ink}"/>` + text(p[0] + off[i][0], p[1] + off[i][1], i + 1, 'font-size="13"'); });
          b += text(140, 134, 'front', 'font-size="13"') + text(150, 48, 'top', 'font-size="13"') + text(215, 90, 'side', 'font-size="13"');
          b += text(160, 172, 'Faces: 3 you can see + 3 hidden = 6', 'font-size="13"');
          b += `<text x="160" y="190" text-anchor="middle" font-size="13" dominant-baseline="middle">Edges: <tspan fill="${B}">4 front</tspan> + <tspan fill="${G}">4 back</tspan> + <tspan fill="${C.rose}">4 joining</tspan> = 12</text>`;
          b += text(160, 208, 'Vertices: the 8 numbered corners', 'font-size="13"');
          return { q: 'How many <b>faces</b>, <b>edges</b> and <b>vertices</b> does a cuboid have?', visual: svg(320, 218, b),
            working: ['Picture a <b>cardboard box</b> (a cereal box) and turn it over in your hands.', '1. Faces (flat sides)? Front, back, top, bottom, left, right = <b>6</b>.', '2. Edges (where two faces meet)? 4 around the front + 4 around the back + 4 joining them = <b>12</b>.', '3. Vertices (corners)? 4 at the front + 4 at the back = <b>8</b>.', '4. Check: F + V − E = 6 + 8 − 12 = 2 ✓'], a: 'F = 6, E = 12, V = 8' };
        })(),
        (() => {
          const P = regular(6, 100, 66, 54);
          let b = poly(P, C.butter);
          const V = P[2]; let a1 = Math.atan2(-(P[1][1] - V[1]), P[1][0] - V[0]) / D, a2 = Math.atan2(-(P[3][1] - V[1]), P[3][0] - V[0]) / D;
          if (((a2 - a1) % 360 + 360) % 360 > 180) [a1, a2] = [a2, a1];
          const [x1, y1] = [V[0] + 16 * Math.cos(a1 * D), V[1] - 16 * Math.sin(a1 * D)], [x2, y2] = [V[0] + 16 * Math.cos(a2 * D), V[1] - 16 * Math.sin(a2 * D)];
          b += `<path d="M${r1(x1)} ${r1(y1)} A16 16 0 0 0 ${r1(x2)} ${r1(y2)}" fill="none" stroke="${C.rose}" stroke-width="3"/>`;
          b += text(V[0] - 34, V[1] - 16, 'x', `fill="${C.rose}" font-size="18"`);
          b += `<text x="176" y="40" font-size="13" dominant-baseline="middle">6 sides</text><text x="176" y="58" font-size="13" dominant-baseline="middle" fill="${C.rose}">sum = 4 × 180°</text><text x="176" y="76" font-size="13" dominant-baseline="middle" fill="${C.rose}">= 720°</text><text x="176" y="96" font-size="13" dominant-baseline="middle">x = 720° ÷ 6</text>`;
          return { q: 'Find each interior angle of a <b>regular hexagon</b>.', visual: svg(300, 130, b),
            working: ['Picture a <b>paper hexagon</b>: cut from one corner it makes 4 triangles, and "regular" means all 6 corners are the same.', '1. How many sides? n = 6.', '2. Angle sum? (6 − 2) × 180 = 4 × 180 = 720.', '3. Are all the angles equal? Yes (regular) → share it out: 720 ÷ 6 = <b>120</b>.'], a: '120°' };
        })(),
        (() => {
          const P = regular(8, 60, 60, 50, -112.5);
          let b = `<polygon points="${P.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${C.rose}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>` + text(60, 62, 'STOP', 'font-size="18" fill="#fff"');
          b += text(180, 40, '8 sides', 'font-size="13"') + text(180, 58, 'sum = 6 × 180°', `font-size="13" fill="${C.rose}"`) + text(180, 76, '= 1080°', `font-size="13" fill="${C.rose}"`);
          return { q: 'The STOP sign outside Harper\'s school is a <b>regular octagon</b>. What is each of its interior angles?', visual: svg(250, 120, b),
            working: ['Picture the red <b>stop sign</b>: 8 sides, all the same, every corner the same.', '1. How many sides? n = 8.', '2. Angle sum? (8 − 2) × 180 = 6 × 180 = 1080.', '3. Regular, so all 8 angles equal: 1080 ÷ 8 = <b>135</b>.'], a: '135°' };
        })(),
        (() => {
          const mark = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="${C.rose}"/>`;
          const panel = (cx, portrait, dotx, doty, turn, ok) => {
            const w = portrait ? 36 : 60, h = portrait ? 60 : 36;
            let s = poly([[cx - w / 2, 58 - h / 2], [cx + w / 2, 58 - h / 2], [cx + w / 2, 58 + h / 2], [cx - w / 2, 58 + h / 2]], C.sky) + mark(cx + dotx, 58 + doty);
            s += text(cx, 110, turn, 'font-size="13"') + text(cx, 132, ok ? '✓ same' : '✗ different', `font-size="13" fill="${ok ? '#2FA97A' : C.rose}"`);
            return s;
          };
          let b = panel(48, false, -30, -18, 'start', true) + panel(138, true, 18, -30, 'turn 90°', false)
            + panel(228, false, 30, 18, 'turn 180°', true) + panel(318, true, -18, 30, 'turn 270°', false);
          b += text(180, 156, 'same picture 2 times in one full turn → order 2', `font-size="13" fill="${C.rose}"`);
          return { q: 'What is the <b>order of rotational symmetry</b> of a rectangle?', visual: svg(360, 166, b),
            working: ['Picture <b>spinning the paper rectangle</b> on a pin through its middle, with a pink dot on one corner so you can see it turn.', '1. Turn it 90°: does it look the same as the start? <b>No</b> (it is standing up now).', '2. Turn it 180°: does it look the same? <b>Yes</b>.', '3. Turn it 270°? No. Turn it 360°? Yes, it is back at the start.', '4. Count the <b>yes</b> answers in one full turn: 180° and 360° = <b>2</b>.'], a: 'order 2' };
        })(),
        (() => {
          const A = [[34, 120], [34 + 27, 120], [34, 120 - 36]], Bg = [[128, 120], [128 + 54, 120], [128, 120 - 72]];
          let b = poly(A, C.sky) + poly(Bg, C.pink);
          b += sideLabel(A[0], A[2], '3', 14) + sideLabel(A[1], A[0], '4', 14) + sideLabel(A[2], A[1], '5', 14);
          b += sideLabel(Bg[0], Bg[2], '6', 16) + sideLabel(Bg[1], Bg[0], '8', 16) + sideLabel(Bg[2], Bg[1], '10', 16);
          b += text(47, 20, 'A', 'font-size="15"') + text(155, 20, 'B', 'font-size="15"');
          b += text(266, 44, '6 ÷ 3 = 2', `font-size="13" fill="${C.rose}"`) + text(266, 66, '8 ÷ 4 = 2', `font-size="13" fill="${C.rose}"`) + text(266, 88, '10 ÷ 5 = 2', `font-size="13" fill="${C.rose}"`);
          b += text(266, 114, '×2 all round', 'font-size="13"') + text(266, 136, '→ similar', `font-size="13" fill="${C.rose}"`);
          return { q: 'Triangle A has sides 3, 4, 5 cm. Triangle B has sides 6, 8, 10 cm. Are they <b>congruent</b>, <b>similar</b>, or neither?', visual: svg(340, 150, b),
            working: ['Picture <b>photocopying</b> triangle A at 200%: same shape, twice as big.', '1. Divide each side of B by the matching side of A: 6 ÷ 3 = 2, 8 ÷ 4 = 2, 10 ÷ 5 = 2.', '2. Are all the answers the <b>same number</b>? Yes, all 2 → B is A zoomed by 2.', '3. Same shape but a different size = <b>similar</b>. (If every answer had been 1, they would be <b>congruent</b> — a perfect copy.)'], a: 'similar (scale factor 2)' };
        })(),
        (() => {
          const cubes = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1]];
          const hw = 18, hh = 10, ch = 21, ox = 24, oy = 68;
          const P = (a, b2, c) => [ox + (a + b2) * hw, oy + (a - b2) * hh - c * ch];
          const face = (pts, fill) => `<polygon points="${pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}" fill="${fill}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
          let b = '';
          cubes.slice().sort((p, q) => (p[0] - p[1]) - (q[0] - q[1]) || p[2] - q[2]).forEach(([x, y, z]) => {
            b += face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], '#DCEEFB');
            b += face([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)], C.sky);
            b += face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], '#7EBEE4');
          });
          b += text(62, 120, 'the model', 'font-size="13"');
          const gridAt = (x0, y0, cells) => cells.map(([cx, cy]) => poly([[x0 + cx * 18, y0 + cy * 18], [x0 + cx * 18 + 18, y0 + cy * 18], [x0 + cx * 18 + 18, y0 + cy * 18 + 18], [x0 + cx * 18, y0 + cy * 18 + 18]], C.mint)).join('');
          const lab = (y, s) => `<text x="122" y="${y}" font-size="13" font-weight="700" fill="${C.ink}">${s}</text>`;
          b += lab(38, 'plan (from above)') + gridAt(282, 25, [[0, 0], [1, 0], [2, 0]]);
          b += lab(82, 'front view') + gridAt(282, 60, [[0, 0], [0, 1], [1, 1], [2, 1]]);
          b += lab(126, 'side view') + gridAt(282, 104, [[0, 0], [0, 1]]);
          return { q: 'Four cubes are stacked like this. Draw the <b>plan</b>, <b>front</b> and <b>side</b> views.', visual: svg(340, 152, b),
            working: ['Picture <b>walking round the model</b> and squashing what you see onto flat paper. You only ever see squares.', '1. From <b>above</b>: how far do the cubes spread out? A row of 3. The cube on top hides behind the one under it, so the plan is <b>3 squares in a row</b>.', '2. From the <b>front</b>: how wide and how tall? 3 wide, and the left column is 2 high.', '3. From the <b>side</b>: how deep and how tall? Only 1 deep, and 2 high.'], a: 'plan 3 × 1, front 3 wide with a 2-high left column, side 1 × 2' };
        })(),
        (() => {
          const cx = 110, cy = 106, r = 76, B = '#2A6FA5', G = '#2FA97A';
          const P = (a) => [cx + r * Math.cos(a * D), cy - r * Math.sin(a * D)];
          const seg = (a1, a2, col) => { const [x1, y1] = P(a1), [x2, y2] = P(a2); return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/>`; };
          let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" fill-opacity=".28" stroke="${C.ink}" stroke-width="2.5"/>`;
          const [s1x, s1y] = P(120), [s2x, s2y] = P(172);
          b += `<path d="M${cx} ${cy} L${r1(s1x)} ${r1(s1y)} A${r} ${r} 0 0 0 ${r1(s2x)} ${r1(s2y)} Z" fill="${C.lav}" stroke="${C.lav}" stroke-width="2"/>`;
          const [a1x, a1y] = P(255), [a2x, a2y] = P(310);
          b += `<path d="M${r1(a1x)} ${r1(a1y)} A${r} ${r} 0 0 0 ${r1(a2x)} ${r1(a2y)}" fill="none" stroke="${C.peach}" stroke-width="5"/>`;
          b += seg(0, 180, B);
          b += `<line x1="${cx}" y1="${cy}" x2="${r1(P(52)[0])}" y2="${r1(P(52)[1])}" stroke="${C.rose}" stroke-width="4.5" stroke-linecap="round"/>`;
          b += seg(215, 325, G);
          b += `<circle cx="${cx}" cy="${cy}" r="5" fill="${C.ink}"/>`;
          const key = [[C.rose, 'radius', 'centre → edge'], [B, 'diameter', '= 2 × radius'], [G, 'chord', 'edge to edge'], [C.peach, 'arc', 'part of the edge'], [C.lav, 'sector', 'a pizza slice'], [C.ink, 'centre', 'the middle dot']];
          key.forEach(([col, nm, why], i) => {
            const y = 24 + i * 31;
            b += `<rect x="196" y="${y - 8}" width="26" height="8" rx="4" fill="${col}"/><text x="230" y="${y}" font-size="14" font-weight="700" fill="${C.ink}">${nm}</text><text x="230" y="${y + 16}" font-size="12" fill="${C.rose}">${why}</text>`;
          });
          return { q: 'Name the <b>parts of a circle</b>.', visual: svg(360, 210, b),
            working: ['Picture a <b>pizza</b> on the bench.', '1. One straight cut from the middle out to the crust = <b>radius</b>.', '2. A cut right across through the middle = <b>diameter</b> (that is 2 radii).', '3. A cut across that <b>misses</b> the middle = <b>chord</b>.', '4. One slice = <b>sector</b>. The curved crust on that slice = <b>arc</b>.', '5. All the way round the crust = <b>circumference</b>.'], a: 'centre, radius, diameter, chord, arc, sector' };
        })(),
      ],
      tips: [
        'Prefixes tell you the sides: <b>pent</b> 5, <b>hex</b> 6, <b>hept</b> 7, <b>oct</b> 8, <b>non</b> 9, <b>dec</b> 10.',
        'A <b>prism</b> has the same shape at both ends (like a Toblerone box); a <b>pyramid</b> comes to a point.',
        'When counting edges, count the front shape, the back shape, then the edges that join them.',
        'A square is also a rectangle, a rhombus and a parallelogram — it just has extra rules.',
        'Every shape has rotational symmetry of <b>at least order 1</b> (a full turn always brings it back). Order 1 really means <b>no</b> rotational symmetry.',
        '<b>Congruent</b> shapes are the same size; <b>similar</b> shapes are the same shape. All squares are similar to each other, but only equal squares are congruent.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
