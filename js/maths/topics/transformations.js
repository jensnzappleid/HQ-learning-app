/* Topic: Transformations — translation, reflection, rotation, enlargement of points on a grid. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
  const cell = 14, OX = 122, OY = 100; // grid origin in svg coords
  const gx = (x) => OX + x * cell, gy = (y) => OY - y * cell;
  /** 4-quadrant grid −6..6 with points [{x,y,label,col}] and optional mirror line ('x'|'y'|'y=x') */
  function grid(points, mirror) {
    let b = '';
    for (let i = -6; i <= 6; i++) {
      b += `<line x1="${gx(i)}" y1="${gy(6)}" x2="${gx(i)}" y2="${gy(-6)}" stroke="${C.lav}" stroke-width="${i === 0 ? 0 : 1}"/>`;
      b += `<line x1="${gx(-6)}" y1="${gy(i)}" x2="${gx(6)}" y2="${gy(i)}" stroke="${C.lav}" stroke-width="${i === 0 ? 0 : 1}"/>`;
    }
    b += `<line x1="${gx(-6.4)}" y1="${OY}" x2="${gx(6.6)}" y2="${OY}" stroke="${C.ink}" stroke-width="2"/><line x1="${OX}" y1="${gy(6.6)}" x2="${OX}" y2="${gy(-6.4)}" stroke="${C.ink}" stroke-width="2"/>`;
    b += `<text x="${gx(6.6) + 10}" y="${OY + 5}" font-size="14" font-style="italic">x</text><text x="${OX + 6}" y="${gy(6.6) + 2}" font-size="14" font-style="italic">y</text>`;
    [-6, -4, -2, 2, 4, 6].forEach((i) => {
      b += `<text x="${gx(i)}" y="${OY + 16}" font-size="14" text-anchor="middle">${N.fmt(i)}</text>`;
      b += `<text x="${OX - 6}" y="${gy(i) + 5}" font-size="14" text-anchor="end">${N.fmt(i)}</text>`;
    });
    if (mirror === 'y=x') b += `<line x1="${gx(-6)}" y1="${gy(-6)}" x2="${gx(6)}" y2="${gy(6)}" stroke="${C.rose}" stroke-width="2" stroke-dasharray="6 4"/><text x="${gx(2.3)}" y="${gy(5.4) + 5}" font-size="14" fill="${C.rose}">y = x</text>`;
    if (mirror === 'x') b += `<line x1="${gx(-6)}" y1="${OY}" x2="${gx(6)}" y2="${OY}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="6 4"/>`;
    if (mirror === 'y') b += `<line x1="${OX}" y1="${gy(6)}" x2="${OX}" y2="${gy(-6)}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="6 4"/>`;
    points.forEach((p) => {
      const col = p.col || C.rose;
      b += `<circle cx="${gx(p.x)}" cy="${gy(p.y)}" r="5" fill="${col}" stroke="${C.ink}" stroke-width="1.5"/>`;
      const lx = gx(p.x) + (p.x >= 0 ? 8 : -8), ly = gy(p.y) + (p.y >= 0 ? -7 : 14);
      b += `<text x="${lx}" y="${ly}" font-size="15" font-weight="bold" fill="${col}" text-anchor="${p.x >= 0 ? 'start' : 'end'}">${p.label}</text>`;
    });
    return `<svg viewBox="0 0 250 220" width="250" height="220" xmlns="http://www.w3.org/2000/svg" fill="${C.ink}">${b}</svg>`;
  }
  const coord = (x, y) => `(${N.fmt(x)}, ${N.fmt(y)})`;
  const plain = (x, y) => `(${x}, ${y})`;
  const coordAns = (x, y) => ({ type: 'text', value: plain(x, y), accept: [`(${x},${y})`, `${x},${y}`, `${x}, ${y}`], placeholder: 'e.g. (2, -3)' });
  const vec = (a, b) => `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;border:2px solid currentColor;border-top:none;border-bottom:none;border-radius:10px;padding:0 7px;line-height:1.15;margin:0 3px"><span>${N.fmt(a)}</span><span>${N.fmt(b)}</span></span>`;
  const rnd = (lim = 5) => R.nz(lim);
  const dirWords = (a, b) => `${Math.abs(a)} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`;

  // ---------- calc ----------
  function translate(level) {
    let x, y, a, b;
    do { x = R.int(-4, 4); y = R.int(-4, 4); a = rnd(level === 1 ? 3 : 5); b = rnd(level === 1 ? 3 : 5); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
    const nx = x + a, ny = y + b;
    const useVec = level >= 2 && R.chance(0.6);
    return {
      prompt: useVec ? `Point A is at ${coord(x, y)}. Translate it by the vector ${vec(a, b)}. Where is the image A′?` : `Point A is at ${coord(x, y)}. Move it ${dirWords(a, b)}. Where is the new point A′?`,
      visual: grid([{ x, y, label: 'A' }]),
      answer: coordAns(nx, ny),
      hint: useVec ? 'The top number moves x (right if positive, left if negative). The bottom number moves y (up if positive, down if negative).' : 'Right/left changes the x-coordinate. Up/down changes the y-coordinate.',
      working: [`x: ${N.fmt(x)} ${a > 0 ? '+' : '−'} ${Math.abs(a)} = ${N.fmt(nx)}.`, `y: ${N.fmt(y)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${N.fmt(ny)}.`, `A′ = <b>${coord(nx, ny)}</b>.`],
      finalAnswer: coord(nx, ny), skill: 'translate',
    };
  }
  function reflect(level) {
    const axis = level === 3 ? R.pick(['x', 'y', 'y=x', 'y=x']) : R.pick(['x', 'y']);
    let x, y; do { x = R.int(-5, 5); y = R.int(-5, 5); } while (x === 0 || y === 0 || (axis === 'y=x' && x === y));
    const nx = axis === 'x' ? x : axis === 'y' ? -x : y, ny = axis === 'x' ? -y : axis === 'y' ? y : x;
    const name = axis === 'y=x' ? 'the line y = x' : `the ${axis}-axis`;
    return {
      prompt: `Point A is at ${coord(x, y)}. Reflect it in ${name}. Where is the image A′?`,
      visual: grid([{ x, y, label: 'A' }], axis),
      answer: coordAns(nx, ny),
      hint: axis === 'x' ? 'Reflecting in the x-axis flips the point up/down: x stays, y changes sign.' : axis === 'y' ? 'Reflecting in the y-axis flips left/right: y stays, x changes sign.' : 'Reflecting in y = x swaps the coordinates: (x, y) → (y, x).',
      working: [axis === 'x' ? 'Mirror line is the x-axis, so the x-coordinate stays the same and the y-coordinate changes sign.' : axis === 'y' ? 'Mirror line is the y-axis, so the y-coordinate stays the same and the x-coordinate changes sign.' : 'Mirror line y = x: swap the x and y coordinates.', `${coord(x, y)} → <b>${coord(nx, ny)}</b>.`],
      finalAnswer: coord(nx, ny), skill: 'reflect',
    };
  }
  function rotate(level) {
    const kind = level === 2 ? R.pick(['180', '180', '90cw', '90acw']) : R.pick(['90cw', '90acw', '180']);
    let x, y; do { x = R.int(-5, 5); y = R.int(-5, 5); } while (x === 0 || y === 0);
    const [nx, ny] = kind === '180' ? [-x, -y] : kind === '90cw' ? [y, -x] : [-y, x];
    const desc = kind === '180' ? '180°' : kind === '90cw' ? '90° clockwise' : '90° anticlockwise';
    return {
      prompt: `Point A is at ${coord(x, y)}. Rotate it ${desc} about the origin. Where is the image A′?`,
      visual: grid([{ x, y, label: 'A' }]),
      answer: coordAns(nx, ny),
      hint: kind === '180' ? 'A half turn sends (x, y) to (−x, −y): both signs change.' : kind === '90cw' ? '90° clockwise: (x, y) → (y, −x). Swap them, then make the new y negative.' : '90° anticlockwise: (x, y) → (−y, x). Swap them, then make the new x negative.',
      working: [kind === '180' ? 'Rotation of 180° about the origin: (x, y) → (−x, −y).' : kind === '90cw' ? 'Rotation of 90° clockwise about the origin: (x, y) → (y, −x).' : 'Rotation of 90° anticlockwise about the origin: (x, y) → (−y, x).', `${coord(x, y)} → <b>${coord(nx, ny)}</b>.`, 'Check on the grid: the image is the same distance from the origin as A.'],
      finalAnswer: coord(nx, ny), skill: 'rotate',
    };
  }
  function enlargePoint(level) {
    const k = level === 3 ? R.pick([2, 3, 0.5, 0.5, 1.5]) : R.pick([2, 3]);
    let x, y; do { x = k === 0.5 ? R.step(-6, 6, 2) : k === 1.5 ? R.step(-4, 4, 2) : R.int(-2, 2); y = k === 0.5 ? R.step(-6, 6, 2) : k === 1.5 ? R.step(-4, 4, 2) : R.int(-2, 2); } while (x === 0 && y === 0);
    const nx = x * k, ny = y * k;
    return {
      prompt: `Point A is at ${coord(x, y)}. Enlarge it by scale factor ${N.fmt(k)}, centre the origin. Where is the image A′?`,
      visual: grid([{ x, y, label: 'A' }]),
      answer: coordAns(nx, ny),
      hint: 'With the centre at the origin, multiply both coordinates by the scale factor.',
      working: [`x: ${N.fmt(x)} × ${N.fmt(k)} = ${N.fmt(nx)}.`, `y: ${N.fmt(y)} × ${N.fmt(k)} = ${N.fmt(ny)}.`, `A′ = <b>${coord(nx, ny)}</b>.`],
      finalAnswer: coord(nx, ny), skill: 'enlarge',
    };
  }
  function enlargeLength(level) {
    if (R.chance(0.5)) {
      const k = level === 1 ? R.pick([2, 3]) : R.pick([2, 3, 4, 5, 0.5, 1.5, 2.5]), s = k === 0.5 ? R.step(4, 20, 2) : k === 1.5 || k === 2.5 ? R.step(2, 12, 2) : R.int(2, 12);
      const ans = s * k;
      return {
        prompt: `A shape is enlarged by scale factor ${N.fmt(k)}. One side of the original is ${s} cm long. How long is that side on the enlarged shape?`,
        answer: { type: 'number', value: ans, unit: 'cm' },
        hint: 'Every length is multiplied by the scale factor.',
        working: [`${s} × ${N.fmt(k)} = ${N.fmt(ans)}.`, `New length = <b>${N.fmt(ans)} cm</b>.`],
        finalAnswer: `${N.fmt(ans)} cm`, skill: 'enlarge',
      };
    }
    const k = level === 1 ? R.pick([2, 3]) : R.pick([2, 3, 4, 5, 0.5, 1.5]), s = k === 0.5 ? R.step(4, 20, 2) : k === 1.5 ? R.step(2, 12, 2) : R.int(2, 10);
    const big = s * k;
    return {
      prompt: `A side of ${s} cm on the original shape becomes ${N.fmt(big)} cm on the enlarged shape. What is the scale factor?`,
      answer: { type: 'number', value: k },
      hint: 'Scale factor = new length ÷ original length.',
      working: [`Scale factor = ${N.fmt(big)} ÷ ${s}.`, `= <b>${N.fmt(k)}</b>.`],
      finalAnswer: N.fmt(k), skill: 'enlarge',
    };
  }
  function describe(level) {
    const easy = ['reflection in the x-axis', 'reflection in the y-axis', 'rotation of 180° about the origin', 'translation'];
    const hard = easy.concat(['reflection in the line y = x', 'rotation of 90° clockwise about the origin', 'rotation of 90° anticlockwise about the origin']);
    const pool = level === 3 ? hard : easy;
    let x, y; do { x = R.int(-4, 4); y = R.int(-4, 4); } while (x === 0 || y === 0 || Math.abs(x) === Math.abs(y));
    const apply = (t) => t === 'reflection in the x-axis' ? [x, -y] : t === 'reflection in the y-axis' ? [-x, y] : t === 'rotation of 180° about the origin' ? [-x, -y] : t === 'reflection in the line y = x' ? [y, x] : t === 'rotation of 90° clockwise about the origin' ? [y, -x] : t === 'rotation of 90° anticlockwise about the origin' ? [-y, x] : null;
    const correct = R.pick(pool);
    let img;
    if (correct === 'translation') { let a, b; do { a = rnd(4); b = rnd(4); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6 || pool.some((t) => { const r = apply(t); return r && r[0] === x + a && r[1] === y + b; })); img = [x + a, y + b]; }
    else img = apply(correct);
    const opts = R.shuffle(R.sample(pool.filter((t) => t !== correct), 3).concat([correct]));
    const why = { 'reflection in the x-axis': 'x stayed the same and y changed sign', 'reflection in the y-axis': 'y stayed the same and x changed sign', 'rotation of 180° about the origin': 'both x and y changed sign', translation: 'the point just slid: no swapping or sign flip, it moved ' + dirWords(img[0] - x, img[1] - y), 'reflection in the line y = x': 'the coordinates swapped places', 'rotation of 90° clockwise about the origin': 'the coordinates swapped and the new y changed sign', 'rotation of 90° anticlockwise about the origin': 'the coordinates swapped and the new x changed sign' }[correct];
    return {
      prompt: `A is at ${coord(x, y)} and its image A′ is at ${coord(img[0], img[1])}. Which single transformation maps A to A′?`,
      visual: grid([{ x, y, label: 'A' }, { x: img[0], y: img[1], label: 'A′', col: '#3B82C4' }]),
      answer: { type: 'choice', value: opts.indexOf(correct), choices: opts },
      hint: 'Compare the coordinates: did a sign change? Did x and y swap? Or did the point just slide?',
      working: [`A ${coord(x, y)} → A′ ${coord(img[0], img[1])}: ${why}.`, `That is a <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'describe',
    };
  }
  function inverse() { // L3: image known, find original
    const kind = R.pick(['reflect-x', 'reflect-y', 'rot180', 'translate']);
    let x, y; do { x = R.int(-4, 4); y = R.int(-4, 4); } while (x === 0 || y === 0);
    if (kind === 'translate') {
      let a, b; do { a = rnd(4); b = rnd(4); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
      const ix = x + a, iy = y + b;
      return {
        prompt: `After a translation by the vector ${vec(a, b)}, the image of point A is A′ ${coord(ix, iy)}. Where was A?`,
        visual: grid([{ x: ix, y: iy, label: 'A′', col: '#3B82C4' }]),
        answer: coordAns(x, y),
        hint: 'Go backwards: undo the vector by subtracting it.',
        working: [`x: ${N.fmt(ix)} − (${N.fmt(a)}) = ${N.fmt(x)}.`, `y: ${N.fmt(iy)} − (${N.fmt(b)}) = ${N.fmt(y)}.`, `A = <b>${coord(x, y)}</b>.`],
        finalAnswer: coord(x, y), skill: 'inverse',
      };
    }
    const [ix, iy] = kind === 'reflect-x' ? [x, -y] : kind === 'reflect-y' ? [-x, y] : [-x, -y];
    const name = kind === 'reflect-x' ? 'a reflection in the x-axis' : kind === 'reflect-y' ? 'a reflection in the y-axis' : 'a rotation of 180° about the origin';
    return {
      prompt: `After ${name}, the image of point A is A′ ${coord(ix, iy)}. Where was A?`,
      visual: grid([{ x: ix, y: iy, label: 'A′', col: '#3B82C4' }], kind === 'reflect-x' ? 'x' : kind === 'reflect-y' ? 'y' : undefined),
      answer: coordAns(x, y),
      hint: 'Reflections and 180° rotations undo themselves: apply the same transformation to A′.',
      working: [`Doing ${name} again takes A′ back to A.`, `${coord(ix, iy)} → <b>${coord(x, y)}</b>.`],
      finalAnswer: coord(x, y), skill: 'inverse',
    };
  }
  function twoStep() {
    let x, y; do { x = R.int(-3, 3); y = R.int(-3, 3); } while (x === 0 || y === 0);
    const a = rnd(3), b = rnd(3);
    const first = R.pick(['x', 'y']);
    const mx = first === 'x' ? x : -x, my = first === 'x' ? -y : y;
    const nx = mx + a, ny = my + b;
    return {
      prompt: `Point A ${coord(x, y)} is reflected in the ${first}-axis, then the image is translated by ${vec(a, b)}. Where does A end up?`,
      visual: grid([{ x, y, label: 'A' }], first),
      answer: coordAns(nx, ny),
      hint: 'Do one step at a time. Write down the point after the reflection first.',
      working: [`Reflect in the ${first}-axis: ${coord(x, y)} → ${coord(mx, my)}.`, `Translate: x: ${N.fmt(mx)} ${a > 0 ? '+' : '−'} ${Math.abs(a)} = ${N.fmt(nx)}, y: ${N.fmt(my)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${N.fmt(ny)}.`, `Final point: <b>${coord(nx, ny)}</b>.`],
      finalAnswer: coord(nx, ny), skill: 'multi-step',
    };
  }

  // ---------- tessellation ----------
  const choiceQ = (prompt, visual, options, correct, hint, working) => {
    const order = R.shuffle(options.map((_, i) => i));
    return { prompt, visual, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct] };
  };
  const D = Math.PI / 180;
  const rr = (v) => Math.round(v * 10) / 10;
  const regNames = { 3: 'equilateral triangle', 4: 'square', 5: 'regular pentagon', 6: 'regular hexagon', 8: 'regular octagon', 10: 'regular decagon', 12: 'regular dodecagon' };
  const interiorAngle = (n) => 180 - 360 / n;
  const tessCols = [C.sky, C.pink, C.mint, C.peach, C.lav, C.butter];
  /** regular n-gon with one vertex at (cx, cy), the corner pointing along theta° (anticlockwise from east) */
  const ngonAtVertex = (n, s, cx, cy, theta) => {
    const inter = interiorAngle(n);
    let a = theta - inter / 2, x = cx, y = cy;
    const pts = [[x, y]];
    for (let k = 0; k < n - 1; k++) { x += s * Math.cos(a * D); y -= s * Math.sin(a * D); pts.push([x, y]); a += 360 / n; }
    return pts;
  };
  /** `count` regular n-gons packed round one point, so any gap shows at the bottom */
  function aroundPointSvg(n, count, note) {
    const w = 260, h = 210, cx = w / 2, cy = 118;
    const inter = interiorAngle(n), covered = inter * count;
    const start = 270 + (360 - covered) / 2 + inter / 2;
    const s = { 3: 66, 4: 56, 5: 50, 6: 46, 8: 40, 10: 34, 12: 28 }[n] || 40;
    let b = '';
    for (let i = 0; i < count; i++) {
      const pts = ngonAtVertex(n, s, cx, cy, start + inter * i);
      b += `<polygon points="${pts.map((p) => rr(p[0]) + ',' + rr(p[1])).join(' ')}" fill="${tessCols[i % 6]}" fill-opacity=".65" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
    }
    b += `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.rose}"/>`;
    if (note) b += `<text x="${cx}" y="${h - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.rose}">${note}</text>`;
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" fill="${C.ink}" font-weight="700">${b}</svg>`;
  }
  function tessellate(level) {
    const good = [3, 4, 6], bad = [5, 8, 10, 12];
    const form = level === 1 ? R.pick(['count', 'which']) : R.pick(['count', 'which', 'does', 'sum']);
    if (form === 'count') {
      const n = R.pick(good), ang = interiorAngle(n), k = 360 / ang;
      return {
        prompt: `Each angle of ${/^[aeiou]/.test(regNames[n]) ? 'an' : 'a'} <b>${regNames[n]}</b> is ${ang}°. How many of them fit round one point with no gaps?`,
        visual: aroundPointSvg(n, k, 'no gaps'),
        answer: { type: 'number', value: k },
        hint: 'A full turn around a point is 360°. Divide 360 by the size of one angle.',
        working: ['Angles round a point must add to <b>360°</b>.', `360 ÷ ${ang} = ${k}.`, `<b>${k}</b> of them fit round the point, so the shape <b>tessellates</b>.`],
        finalAnswer: String(k), skill: 'tessellate',
      };
    }
    if (form === 'sum') {
      const n = R.pick(good), k = 360 / interiorAngle(n);
      return {
        prompt: `${k} ${regNames[n]}s meet at a point in a tiling pattern. What do their angles add up to?`,
        visual: aroundPointSvg(n, k, 'no gaps'),
        answer: { type: 'number', value: 360, unit: '°' },
        hint: 'If there are no gaps and no overlaps, the angles go all the way round the point.',
        working: [`Each angle is ${interiorAngle(n)}°, and there are ${k} of them.`, `${k} × ${interiorAngle(n)} = 360.`, 'They add to <b>360°</b> — a full turn, so there is no gap.'],
        finalAnswer: '360°', skill: 'tessellate',
      };
    }
    if (form === 'which') {
      const n = R.pick(good);
      const opts = R.sample(bad, 3).map((m) => regNames[m]).concat([regNames[n]]);
      return Object.assign(choiceQ(`Which of these shapes <b>tessellates</b> on its own (tiles a floor with no gaps)?`,
        aroundPointSvg(n, 360 / interiorAngle(n), 'no gaps'), opts, 3,
        'The angle at each corner must divide exactly into 360°.',
        [`${regNames[n]}: each angle is ${interiorAngle(n)}°, and 360 ÷ ${interiorAngle(n)} = ${360 / interiorAngle(n)} — a whole number.`,
          'The others leave a gap, because their angle does not divide exactly into 360°.',
          `Answer: <b>${regNames[n]}</b>.`]), { skill: 'tessellate' });
    }
    const n = R.pick(R.chance(0.5) ? good : bad), ang = interiorAngle(n), fits = 360 % ang === 0;
    const opts = ['Yes — the angles fit exactly round a point', 'No — the angles leave a gap at each point', 'Yes — but only if you make some of them bigger'];
    const k = Math.floor(360 / ang);
    return Object.assign(choiceQ(`Each angle of ${/^[aeiou]/.test(regNames[n]) ? 'an' : 'a'} <b>${regNames[n]}</b> is ${ang}°. Does it tessellate on its own?`,
      aroundPointSvg(n, k, fits ? 'no gaps' : 'gap left over'), opts, fits ? 0 : 1,
      'Work out 360 ÷ (the angle). If it is a whole number the shapes fit; if not, there is a gap.',
      [`360 ÷ ${ang} = ${N.fmt(N.round(360 / ang, 2))}.`,
        fits ? `That is a whole number, so exactly ${k} of them fit round every point.` : `That is <b>not</b> a whole number: ${k} of them make ${k * ang}°, leaving a gap of ${360 - k * ang}°.`,
        `Answer: <b>${opts[fits ? 0 : 1]}</b>.`]), { skill: 'tessellate' });
  }

  // ---------- describing a transformation fully ----------
  function describeFull(level) {
    const kinds = level === 3 ? ['rot90cw', 'rot90acw', 'rot180', 'reflectX', 'reflectY', 'reflectYX', 'translate'] : ['rot180', 'reflectX', 'reflectY', 'translate'];
    const kind = R.pick(kinds);
    let x, y; do { x = R.int(-4, 4); y = R.int(-4, 4); } while (x === 0 || y === 0 || Math.abs(x) === Math.abs(y));
    let img, full, partials;
    if (kind === 'translate') {
      let a, b; do { a = rnd(4); b = rnd(4); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
      img = [x + a, y + b];
      full = `a translation of ${Math.abs(a)} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`;
      partials = ['a translation', `a translation of ${Math.abs(a)} ${a > 0 ? 'right' : 'left'}`, 'a slide across the grid'];
    } else if (kind.startsWith('reflect')) {
      const axis = kind === 'reflectX' ? 'x' : kind === 'reflectY' ? 'y' : 'y=x';
      img = axis === 'x' ? [x, -y] : axis === 'y' ? [-x, y] : [y, x];
      const nm = axis === 'y=x' ? 'the line y = x' : `the ${axis}-axis`;
      full = `a reflection in ${nm}`;
      partials = ['a reflection', 'a reflection in a mirror line', 'a flip'];
    } else {
      const t = kind === 'rot180' ? '180°' : kind === 'rot90cw' ? '90° clockwise' : '90° anticlockwise';
      img = kind === 'rot180' ? [-x, -y] : kind === 'rot90cw' ? [y, -x] : [-y, x];
      full = `a rotation of ${t} about the origin`;
      partials = ['a rotation', `a rotation of ${t}`, 'a rotation about the origin'];
    }
    const opts = R.shuffle(partials.concat([full]));
    return {
      prompt: `A is at ${coord(x, y)} and its image A′ is at ${coord(img[0], img[1])}. Which answer <b>describes the transformation fully</b>?`,
      visual: grid([{ x, y, label: 'A' }, { x: img[0], y: img[1], label: 'A′', col: '#3B82C4' }]),
      answer: { type: 'choice', value: opts.indexOf(full), choices: opts },
      hint: 'A full description needs the <b>name</b> of the move plus <b>all</b> the details: a rotation needs the angle, the direction and the centre; a reflection needs the mirror line; a translation needs both numbers.',
      working: [kind === 'translate' ? 'It is a <b>translation</b>, so I must say <b>how far across and how far up or down</b>.' : kind.startsWith('reflect') ? 'It is a <b>reflection</b>, so I must say <b>which mirror line</b>.' : 'It is a <b>rotation</b>, so I must say the <b>angle</b>, the <b>direction</b> and the <b>centre</b>.',
        'The other answers are true but they miss something out.',
        `Full description: <b>${full}</b>.`],
      finalAnswer: full, skill: 'describe',
    };
  }

  // ---------- two transformations, one after the other ----------
  function twoStepB() {
    const form = R.pick(['transReflect', 'transReflect', 'reflectTwice']);
    let x, y; do { x = R.int(-3, 3); y = R.int(-3, 3); } while (x === 0 || y === 0);
    if (form === 'reflectTwice') {
      const mx = -x, my = y;            // reflect in the y-axis first
      const nx = mx, ny = -my;          // then the x-axis
      return {
        prompt: `Point A ${coord(x, y)} is reflected in the <b>y-axis</b>, and that image is then reflected in the <b>x-axis</b>. Where does A end up?`,
        visual: grid([{ x, y, label: 'A' }], 'y'),
        answer: coordAns(nx, ny),
        hint: 'Do one flip at a time. Write down the point after the first flip before you start the second.',
        working: [`Flip 1 (y-axis): x changes sign. ${coord(x, y)} → ${coord(mx, my)}.`, `Flip 2 (x-axis): y changes sign. ${coord(mx, my)} → ${coord(nx, ny)}.`, `Final point: <b>${coord(nx, ny)}</b>.`, 'Notice: both signs changed, so the two flips together did the same job as a <b>rotation of 180° about the origin</b>.'],
        finalAnswer: coord(nx, ny), skill: 'multi-step',
      };
    }
    let a, b; do { a = rnd(3); b = rnd(3); } while (Math.abs(x + a) > 5 || Math.abs(y + b) > 5 || x + a === 0 || y + b === 0);
    const axis = R.pick(['x', 'y']);
    const mx = x + a, my = y + b;
    const nx = axis === 'x' ? mx : -mx, ny = axis === 'x' ? -my : my;
    return {
      prompt: `Point A ${coord(x, y)} is translated by ${vec(a, b)}, and the image is then reflected in the <b>${axis}-axis</b>. Where does A end up?`,
      visual: grid([{ x, y, label: 'A' }], axis),
      answer: coordAns(nx, ny),
      hint: 'Two steps: slide first, write down where you land, then flip that point.',
      working: [`Step 1, slide: x: ${N.fmt(x)} ${a > 0 ? '+' : '−'} ${Math.abs(a)} = ${N.fmt(mx)}, y: ${N.fmt(y)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${N.fmt(my)}. So A goes to ${coord(mx, my)}.`,
        `Step 2, flip in the ${axis}-axis: ${axis === 'x' ? 'x stays and y changes sign' : 'y stays and x changes sign'}.`,
        `${coord(mx, my)} → <b>${coord(nx, ny)}</b>.`],
      finalAnswer: coord(nx, ny), skill: 'multi-step',
    };
  }

  function calc(level) {
    if (level === 1) return R.pick([() => translate(1), () => translate(1), () => reflect(1), () => reflect(1), () => enlargeLength(1), () => tessellate(1)])();
    if (level === 2) return R.pick([() => translate(2), () => reflect(2), () => rotate(2), () => enlargePoint(2), () => enlargeLength(2), () => describe(2), () => tessellate(2), () => describeFull(2)])();
    return R.pick([() => reflect(3), () => rotate(3), () => enlargePoint(3), () => describe(3), inverse, twoStep, twoStepB, twoStepB, () => enlargeLength(3), () => tessellate(3), () => describeFull(3)])();
  }

  // ---------- word ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['token', 'chess', 'photocopy', 'drone', 'tiles'] : level === 2 ? ['token', 'chess', 'photocopy', 'drone', 'mirror', 'map', 'model', 'tiles'] : ['photocopy3', 'drone3', 'mirror3', 'map', 'model', 'tokenTwice', 'tiles']);
    if (t === 'tiles') {
      const [n, story] = R.pick([
        [6, 'Bees build a honeycomb out of regular hexagons'],
        [6, 'A bathroom floor is tiled with regular hexagons'],
        [4, 'A patio is paved with square pavers'],
        [3, 'A mosaic is made from equilateral triangles'],
      ]);
      const ang = interiorAngle(n), k = 360 / ang;
      if (level === 3 && R.chance(0.5)) {
        return {
          prompt: `${story}. The tiles fit together with no gaps. Each angle of the tile is ${ang}°. What do the angles that meet at one corner point add up to?`,
          visual: aroundPointSvg(n, k, 'no gaps'),
          answer: { type: 'number', value: 360, unit: '°' },
          hint: 'No gaps and no overlaps means the angles go the whole way round the point.',
          working: [`${k} tiles meet at each point.`, `${k} × ${ang} = 360.`, 'The angles add to <b>360°</b>, a full turn — that is why they tessellate.'],
          finalAnswer: '360°', skill: 'tessellate',
        };
      }
      return {
        prompt: `${story}. Each angle of the tile is ${ang}°. How many tiles meet at each corner point?`,
        visual: aroundPointSvg(n, k, 'no gaps'),
        answer: { type: 'number', value: k },
        hint: 'Round a point there is 360°. Divide 360 by one angle of the tile.',
        working: ['Angles round a point add to <b>360°</b>.', `360 ÷ ${ang} = ${k}.`, `<b>${k}</b> tiles meet at each point.`],
        finalAnswer: String(k), skill: 'tessellate',
      };
    }
    if (t === 'token' || t === 'chess' || t === 'drone' || t === 'tokenTwice') {
      let x, y, a, b; do { x = R.int(-4, 4); y = R.int(-4, 4); a = rnd(level === 1 ? 3 : 5); b = rnd(level === 1 ? 3 : 5); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
      let prompt, extra = '';
      if (t === 'token') prompt = `In a board game, Harper's token is on square ${coord(x, y)}. She rolls and moves it ${dirWords(a, b)}. Which square is it on now?`;
      else if (t === 'chess') prompt = `A chess knight is on square ${coord(x, y)}. It moves ${dirWords(a, b)}. Which square does it land on?`;
      else if (t === 'drone') prompt = `A drone hovers over the point ${coord(x, y)} on a grid map. It flies ${N.plural(Math.abs(a), 'unit')} ${a > 0 ? 'east' : 'west'} and ${N.plural(Math.abs(b), 'unit')} ${b > 0 ? 'north' : 'south'}. What point is it over now?`;
      else {
        let c, d; do { c = rnd(3); d = rnd(3); } while (Math.abs(x + a + c) > 6 || Math.abs(y + b + d) > 6);
        prompt = `A game token starts at S ${coord(x, y)}. It moves ${dirWords(a, b)}, then ${dirWords(c, d)}. Where does it finish?`;
        const fx = x + a + c, fy = y + b + d;
        return {
          prompt, visual: grid([{ x, y, label: 'S' }]), answer: coordAns(fx, fy),
          hint: 'Add up all the right/left moves, then all the up/down moves.',
          working: [`Right/left total: ${N.fmt(a)} + (${N.fmt(c)}) = ${N.fmt(a + c)}; up/down total: ${N.fmt(b)} + (${N.fmt(d)}) = ${N.fmt(b + d)}.`, `x: ${N.fmt(x)} + ${N.fmt(a + c)} = ${N.fmt(fx)}; y: ${N.fmt(y)} + ${N.fmt(b + d)} = ${N.fmt(fy)}.`, `Finish at <b>${coord(fx, fy)}</b>.`],
          finalAnswer: coord(fx, fy), skill: 'word',
        };
      }
      const nx = x + a, ny = y + b;
      return {
        prompt, visual: grid([{ x, y, label: t === 'drone' ? 'D' : 'T' }]), answer: coordAns(nx, ny),
        hint: (t === 'drone' ? 'East/west changes x, north/south changes y.' : 'Right/left changes x, up/down changes y.') + extra,
        working: [`x: ${N.fmt(x)} ${a > 0 ? '+' : '−'} ${Math.abs(a)} = ${N.fmt(nx)}.`, `y: ${N.fmt(y)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${N.fmt(ny)}.`, `New position: <b>${coord(nx, ny)}</b>.`],
        finalAnswer: coord(nx, ny), skill: 'word',
      };
    }
    if (t === 'drone3') {
      let x, y; do { x = R.int(-5, 5); y = R.int(-5, 5); } while (x === 0 || y === 0);
      const kind = R.pick(['90cw', '90acw', '180']);
      const [nx, ny] = kind === '180' ? [-x, -y] : kind === '90cw' ? [y, -x] : [-y, x];
      const desc = kind === '180' ? '180°' : kind === '90cw' ? '90° clockwise' : '90° anticlockwise';
      return {
        prompt: `A robot arm is fixed at the origin. Its hand (H) is at ${coord(x, y)}. The arm rotates ${desc}. Where is the hand now?`,
        visual: grid([{ x, y, label: 'H' }]), answer: coordAns(nx, ny),
        hint: kind === '180' ? '180°: (x, y) → (−x, −y).' : kind === '90cw' ? '90° clockwise: (x, y) → (y, −x).' : '90° anticlockwise: (x, y) → (−y, x).',
        working: [kind === '180' ? 'Rotation of 180° about the origin: (x, y) → (−x, −y).' : kind === '90cw' ? 'Rotation of 90° clockwise about the origin: (x, y) → (y, −x).' : 'Rotation of 90° anticlockwise about the origin: (x, y) → (−y, x).', `${coord(x, y)} → <b>${coord(nx, ny)}</b>.`],
        finalAnswer: coord(nx, ny), skill: 'word',
      };
    }
    if (t === 'mirror' || t === 'mirror3') {
      let x, y; do { x = R.int(-5, 5); y = R.int(-5, 5); } while (x === 0 || y === 0 || x === y);
      const axis = t === 'mirror3' ? R.pick(['y=x', 'y', 'x']) : R.pick(['x', 'y']);
      const nx = axis === 'x' ? x : axis === 'y' ? -x : y, ny = axis === 'x' ? -y : axis === 'y' ? y : x;
      const name = axis === 'y=x' ? 'the line y = x' : `the ${axis}-axis`;
      return {
        prompt: `A mirror is placed along ${name}. A sticker is at ${coord(x, y)}. Where does its reflection appear?`,
        visual: grid([{ x, y, label: 'S' }], axis), answer: coordAns(nx, ny),
        hint: axis === 'x' ? 'Mirror on the x-axis: x stays, y changes sign.' : axis === 'y' ? 'Mirror on the y-axis: y stays, x changes sign.' : 'Mirror on y = x: swap the two coordinates.',
        working: [axis === 'y=x' ? 'Reflecting in y = x swaps the coordinates.' : `Reflecting in the ${axis}-axis changes the sign of ${axis === 'x' ? 'y' : 'x'} only.`, `${coord(x, y)} → <b>${coord(nx, ny)}</b>.`],
        finalAnswer: coord(nx, ny), skill: 'word',
      };
    }
    if (t === 'photocopy' || t === 'photocopy3') {
      const pct = t === 'photocopy' ? R.pick([200, 300, 50]) : R.pick([150, 50, 25, 250, 125]);
      const k = pct / 100;
      const w = pct === 25 ? R.step(8, 40, 4) : pct === 125 ? R.step(4, 20, 4) : pct === 50 ? R.step(4, 30, 2) : pct === 150 || pct === 250 ? R.step(2, 16, 2) : R.int(3, 15);
      const ans = w * k;
      return {
        prompt: `A photo is ${w} cm wide. It is put through a photocopier set to ${pct}%. How wide is the copy?`,
        answer: { type: 'number', value: ans, unit: 'cm' },
        hint: `${pct}% means a scale factor of ${N.fmt(k)}. Multiply the width by it.`,
        working: [`${pct}% = ${pct} ÷ 100 = scale factor ${N.fmt(k)}.`, `${w} × ${N.fmt(k)} = ${N.fmt(ans)}.`, `The copy is <b>${N.fmt(ans)} cm</b> wide.`],
        finalAnswer: `${N.fmt(ans)} cm`, skill: 'word',
      };
    }
    if (t === 'map') {
      const k = R.pick([2, 4, 5, 10]), s = R.int(2, 9), big = s * k;
      return {
        prompt: `A map of a school is enlarged so that the hall, which was ${s} cm long on the map, is now ${big} cm long. What scale factor was used?`,
        answer: { type: 'number', value: k },
        hint: 'Scale factor = new length ÷ old length.',
        working: [`${big} ÷ ${s} = ${k}.`, `Scale factor <b>${k}</b>.`],
        finalAnswer: String(k), skill: 'word',
      };
    }
    // model
    const k = R.pick([2, 3, 4, 5, 0.5]), s = k === 0.5 ? R.step(6, 40, 2) : R.int(3, 12), ans = s * k;
    return {
      prompt: `Harper builds a model of a kiwi statue using scale factor ${N.fmt(k)}. The statue's beak is ${s} cm long. How long is the beak on the model?`,
      answer: { type: 'number', value: ans, unit: 'cm' },
      hint: 'Multiply the real length by the scale factor.',
      working: [`${s} × ${N.fmt(k)} = ${N.fmt(ans)}.`, `Model beak = <b>${N.fmt(ans)} cm</b>.`],
      finalAnswer: `${N.fmt(ans)} cm`, skill: 'word',
    };
  }

  HL.registerTopic({
    id: 'transformations', subject: 'maths', strand: 'geometry', order: 3,
    name: 'Transformations', short: 'Transformations',
    blurb: 'Slide, flip, turn and enlarge points on a grid.',
    example: 'Reflect (3, 2) in the x-axis → (3, −2)',
    animal: 'cat',
    learn: {
      what: '<p>Picture a <b>sticker</b> on a grid. A <b>transformation</b> moves it to a new place. <b>Translation</b> = slide the sticker. <b>Reflection</b> = flip it over a mirror line. <b>Rotation</b> = pin it at the centre and turn it. <b>Enlargement</b> = zoom it bigger (or smaller) by a scale factor. The new sticker is called the <b>image</b> and is written A′ ("A dash").</p>',
      visual: (() => {
        const B = '#2A6FA5', G = '#2FA97A', s = 15, ox = 110, oy = 110;
        const X = (x) => ox + x * s, Y = (y) => oy - y * s;
        let b = '';
        for (let i = -6; i <= 6; i++) b += `<line x1="${X(i)}" y1="${Y(6)}" x2="${X(i)}" y2="${Y(-6)}" stroke="${C.lav}" stroke-width="1"/><line x1="${X(-6)}" y1="${Y(i)}" x2="${X(6)}" y2="${Y(i)}" stroke="${C.lav}" stroke-width="1"/>`;
        b += `<line x1="${X(-6.4)}" y1="${oy}" x2="${X(6.6)}" y2="${oy}" stroke="${C.ink}" stroke-width="2"/><line x1="${ox}" y1="${Y(6.6)}" x2="${ox}" y2="${Y(-6.4)}" stroke="${C.ink}" stroke-width="2"/>`;
        b += `<line x1="${ox}" y1="${Y(6)}" x2="${ox}" y2="${Y(-6)}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="6 4"/>`;
        [-6, -4, -2, 2, 4, 6].forEach((i) => { b += `<text x="${X(i)}" y="${oy + 15}" font-size="13" text-anchor="middle">${N.fmt(i)}</text><text x="${ox - 5}" y="${Y(i) + 5}" font-size="13" text-anchor="end">${N.fmt(i)}</text>`; });
        const tri = (pts, fill, stroke, label) => { const cx = pts.reduce((a, p) => a + p[0], 0) / 3, cy = pts.reduce((a, p) => a + p[1], 0) / 3; return `<polygon points="${pts.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="${fill}" fill-opacity=".8" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/><text x="${X(cx)}" y="${Y(cy) + 5}" font-size="13" text-anchor="middle" fill="${stroke}">${label}</text>`; };
        b += `<path d="M${X(1)} ${Y(1)} L${X(4)} ${Y(-4)}" stroke="${B}" stroke-width="2" stroke-dasharray="4 3" fill="none"/><polygon points="${X(4)},${Y(-4)} ${X(3.4)},${Y(-3.1)} ${X(3.8)},${Y(-3)}" fill="${B}"/>`;
        b += tri([[1, 1], [3, 1], [1, 4]], C.lav, C.ink, 'A') + tri([[4, -4], [6, -4], [4, -1]], C.sky, B, 'T') + tri([[-1, 1], [-3, 1], [-1, 4]], C.pink, C.rose, 'R') + tri([[-1, -1], [-3, -1], [-1, -4]], C.mint, G, 'S');
        const leg = [['A', C.lav, C.ink, 'object A', ''], ['T', C.sky, B, 'translation', 'slide by (3, −5)'], ['R', C.pink, C.rose, 'reflection', 'flip in the y-axis'], ['S', C.mint, G, 'rotation 180°', 'turn about (0,0)']];
        leg.forEach((l, i) => { const y = 26 + i * 46; b += `<rect x="216" y="${y}" width="18" height="18" rx="4" fill="${l[1]}" stroke="${l[2]}" stroke-width="2"/><text x="242" y="${y + 14}" font-size="13" fill="${l[2]}">${l[3]}</text>` + (l[4] ? `<text x="242" y="${y + 32}" font-size="13">${l[4]}</text>` : ''); });
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        '<b>Translation</b> (slide): add the vector. Top number → x (right +, left −). Bottom number → y (up +, down −)',
        '<b>Reflection</b> (flip) in the <b>x-axis</b>: (x, y) → (x, −y). In the <b>y-axis</b>: (x, y) → (−x, y). In <b>y = x</b>: swap → (y, x)',
        '<b>Rotation</b> (turn) about (0, 0): 180° → (−x, −y). 90° clockwise → (y, −x). 90° anticlockwise → (−y, x)',
        '<b>Enlargement</b> (zoom) centre (0, 0), scale factor k: (x, y) → (kx, ky). Every length × k',
        'The image of A is written <b>A′</b>. Sliding, flipping and turning keep the sticker the <b>same size</b>',
        '<b>Tessellation</b> = tiles that fit with <b>no gaps and no overlaps</b>. The angles meeting at a point must add to exactly <b>360°</b>',
        'Regular shapes that tessellate alone: <b>triangle</b> (6 × 60°), <b>square</b> (4 × 90°), <b>hexagon</b> (3 × 120°). A regular <b>pentagon</b> does not (108° will not divide into 360°)',
        '<b>Describe it fully</b>: rotation → <b>angle + direction + centre</b>; reflection → <b>the mirror line</b>; translation → <b>both numbers</b> of the vector; enlargement → <b>scale factor + centre</b>',
      ],
      steps: [
        '<b>Ask: which move is it?</b> Slide (translation), flip (reflection), turn (rotation) or zoom (enlargement)?',
        'Say the <b>rule</b> for that move: "flip in the y-axis, so x changes sign and y stays".',
        'Do the rule to the <b>x number</b>, then to the <b>y number</b>. Write the new point as (x, y).',
        'Always <b>plot</b> the original and the image on the grid and check it looks right.',
      ],
      examples: [
        (() => {
          const B = '#2A6FA5';
          let v = grid([{ x: 2, y: -1, label: 'A' }, { x: 5, y: 3, label: 'A′', col: B }]);
          const extra = `<line x1="${gx(2)}" y1="${gy(-1)}" x2="${gx(5)}" y2="${gy(-1)}" stroke="${B}" stroke-width="2" stroke-dasharray="4 3"/><line x1="${gx(5)}" y1="${gy(-1)}" x2="${gx(5)}" y2="${gy(3)}" stroke="${B}" stroke-width="2" stroke-dasharray="4 3"/><text x="${gx(3.6)}" y="${gy(-1) + 30}" font-size="13" fill="${B}" text-anchor="middle">+3 →</text><text x="${gx(5) + 8}" y="${gy(1) + 5}" font-size="13" fill="${B}">+4 ↑</text>`;
          v = v.replace('</svg>', extra + '</svg>');
          return { q: 'Translate A(2, −1) by the vector ' + vec(3, 4) + '.', visual: v,
            working: ['Picture <b>sliding the sticker</b>: 3 squares right, then 4 squares up.', '1. Which move? A vector → a <b>slide</b> (translation).', '2. Top number 3 → add to x: 2 + 3 = 5.', '3. Bottom number 4 → add to y: −1 + 4 = 3.', '4. New point: <b>(5, 3)</b>.'], a: 'A′ = (5, 3)' };
        })(),
        (() => {
          const B = '#2A6FA5';
          let v = grid([{ x: -4, y: 3, label: 'A' }, { x: 4, y: 3, label: 'A′', col: B }], 'y');
          v = v.replace('</svg>', `<line x1="${gx(-4)}" y1="${gy(3)}" x2="${gx(4)}" y2="${gy(3)}" stroke="${B}" stroke-width="2" stroke-dasharray="4 3"/><text x="${gx(-2)}" y="${gy(3) - 8}" font-size="13" fill="${B}" text-anchor="middle">4</text><text x="${gx(2)}" y="${gy(3) - 8}" font-size="13" fill="${B}" text-anchor="middle">4</text></svg>`);
          return { q: 'Reflect A(−4, 3) in the <b>y-axis</b>.', visual: v,
            working: ['Picture <b>flipping the sticker</b> over the mirror line (the y-axis). It lands the same distance away on the other side.', '1. Which move? A mirror line → a <b>flip</b> (reflection).', '2. Which axis is the mirror? The y-axis, so <b>y stays</b> and <b>x changes sign</b>.', '3. x: −4 → 4. y: 3 stays 3.', '4. New point: <b>(4, 3)</b>. Check: 4 squares from the mirror on each side ✓'], a: 'A′ = (4, 3)' };
        })(),
        (() => {
          const G = '#2FA97A';
          let v = grid([{ x: 2, y: 5, label: 'A' }, { x: 5, y: -2, label: 'A′', col: G }]);
          const r = Math.hypot(2, 5) * cell;
          v = v.replace('</svg>', `<path d="M${gx(2)} ${gy(5)} A${r} ${r} 0 0 1 ${gx(5)} ${gy(-2)}" fill="none" stroke="${G}" stroke-width="2" stroke-dasharray="4 3"/><text x="${gx(5.6)}" y="${gy(3.6)}" font-size="13" fill="${G}">90° ↻</text></svg>`);
          return { q: 'Rotate A(2, 5) <b>90° clockwise</b> about the origin.', visual: v,
            working: ['Picture the sticker <b>pinned at (0, 0)</b> and turned a quarter turn to the right, like a clock hand.', '1. Which move? "Rotate about the origin" → a <b>turn</b>.', '2. Which rule? 90° clockwise: (x, y) → <b>(y, −x)</b>.', '3. Swap: (5, 2). Then make the second one negative: (5, −2).', '4. New point: <b>(5, −2)</b>. Check: it moved from top-right to bottom-right ✓'], a: 'A′ = (5, −2)' };
        })(),
        { q: 'Rotate A(−3, 2) <b>180°</b> about the origin.', working: ['Picture the sticker pinned at (0, 0) and turned <b>half a turn</b>: it ends up on the exact opposite side.', '1. Which move? A <b>turn</b> of 180°.', '2. Which rule? 180°: (x, y) → <b>(−x, −y)</b>: change both signs.', '3. −3 → 3, and 2 → −2.', '4. New point: <b>(3, −2)</b>.'], a: 'A′ = (3, −2)' },
        { q: 'Enlarge A(−1, 3) by scale factor 2, centre the origin.', working: ['Picture <b>zooming</b> the sticker to twice the size, with the corner at (0, 0) staying put. Every point ends up twice as far from (0, 0).', '1. Which move? Scale factor → a <b>zoom</b> (enlargement).', '2. Which rule? Multiply both numbers by 2.', '3. x: −1 × 2 = −2. y: 3 × 2 = 6.', '4. New point: <b>(−2, 6)</b>.'], a: 'A′ = (−2, 6)' },
        { q: 'A photo of Harper\'s dog is enlarged by scale factor 3 to make a poster. In the photo the dog\'s ear is 4 cm long. How long is the ear on the poster?', working: ['Picture <b>zooming</b> the photo: every length gets 3 times bigger.', '1. Which move? Scale factor → a <b>zoom</b> (enlargement).', '2. What happens to lengths? Multiply by the scale factor.', '3. 4 × 3 = <b>12</b>.'], a: '12 cm' },
        (() => {
          const fan = (n, s, cx, cy, count) => {
            const inter = interiorAngle(n), start = 270 + (360 - inter * count) / 2 + inter / 2;
            let out = '';
            for (let i = 0; i < count; i++) {
              const pts = ngonAtVertex(n, s, cx, cy, start + inter * i);
              out += `<polygon points="${pts.map((p) => rr(p[0]) + ',' + rr(p[1])).join(' ')}" fill="${tessCols[i % 6]}" fill-opacity=".65" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
            }
            return out + `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${C.rose}"/>`;
          };
          const cap = (x, y, t, col) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" font-weight="700" fill="${col}">${t}</text>`;
          const b = fan(6, 34, 88, 92, 3) + fan(5, 36, 268, 92, 3)
            + cap(88, 182, '3 × 120° = 360°', C.ink) + cap(88, 198, 'fits — it tessellates', '#2FA97A')
            + cap(268, 182, '3 × 108° = 324°', C.ink) + cap(268, 198, '36° gap — it does not', C.rose);
          return { q: 'Why does a regular <b>hexagon</b> tessellate but a regular <b>pentagon</b> does not?',
            visual: `<svg viewBox="0 0 360 206" width="360" height="206" xmlns="http://www.w3.org/2000/svg" fill="${C.ink}" font-weight="700">${b}</svg>`,
            working: ['Picture <b>tiles on a bathroom floor</b>: they must fit round every corner point with <b>no gaps and no overlaps</b>.', '1. How much room is there round a point? A full turn = <b>360°</b>.', '2. Hexagon: each angle is 120°. Does 120 divide into 360? Yes: 360 ÷ 120 = <b>3</b>, so 3 hexagons fit exactly.', '3. Pentagon: each angle is 108°. 360 ÷ 108 = 3.33…, not a whole number. 3 pentagons make 324°, leaving a <b>36° gap</b>.'], a: 'the angles at a point must add to exactly 360°' };
        })(),
        (() => {
          const G = '#2FA97A';
          let v = grid([{ x: 2, y: 5, label: 'A' }, { x: 5, y: -2, label: 'A′', col: G }]);
          const r = Math.hypot(2, 5) * cell;
          v = v.replace('</svg>', `<path d="M${gx(2)} ${gy(5)} A${r} ${r} 0 0 1 ${gx(5)} ${gy(-2)}" fill="none" stroke="${G}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${gx(0)}" cy="${gy(0)}" r="4" fill="${C.ink}"/><text x="${gx(-0.4)}" y="${gy(0.6)}" font-size="12" text-anchor="end" fill="${C.ink}">centre (0, 0)</text></svg>`);
          return { q: 'A is at (2, 5) and A′ is at (5, −2). <b>Describe the transformation fully.</b>', visual: v,
            working: ['Picture the sticker <b>pinned at (0, 0)</b> and turned like a clock hand.', '1. Did it slide, flip, turn or zoom? The two numbers <b>swapped</b> and one sign changed → a <b>turn</b>.', '2. Which turn? (x, y) → (y, −x) is <b>90° clockwise</b>.', '3. A rotation needs <b>three</b> things: the angle, the direction, and the centre.', '4. So write all three: a rotation of <b>90°</b>, <b>clockwise</b>, about the <b>origin</b>. Just "a rotation" would not score the marks.'], a: 'a rotation of 90° clockwise about the origin' };
        })(),
        (() => {
          const B = '#2A6FA5', G = '#2FA97A';
          let v = grid([{ x: -3, y: 2, label: 'A' }, { x: 1, y: 3, label: 'M', col: B }, { x: 1, y: -3, label: 'A″', col: G }], 'x');
          v = v.replace('</svg>', `<path d="M${gx(-3)} ${gy(2)} L${gx(1)} ${gy(3)}" stroke="${B}" stroke-width="2" stroke-dasharray="4 3"/><path d="M${gx(1)} ${gy(3)} L${gx(1)} ${gy(-3)}" stroke="${G}" stroke-width="2" stroke-dasharray="4 3"/><text x="125" y="212" text-anchor="middle" font-size="12" fill="${C.ink}"><tspan fill="${B}">1. slide</tspan> to M, then <tspan fill="${G}">2. flip</tspan> to A″</text></svg>`);
          return { q: 'Point A (−3, 2) is translated by ' + vec(4, 1) + ', then the image is reflected in the <b>x-axis</b>. Where does it end up?', visual: v,
            working: ['Picture <b>two instructions in a game</b>: do the first one, put the counter down, then do the second one.', '1. Step 1, slide: x: −3 + 4 = 1, y: 2 + 1 = 3. The counter lands on <b>M (1, 3)</b>. Write it down!', '2. Step 2, flip in the x-axis: x stays the same, y changes sign.', '3. (1, 3) → <b>(1, −3)</b>.', 'Check on the grid: M is 3 above the mirror line, and the answer is 3 below it ✓'], a: 'A″ = (1, −3)' };
        })(),
      ],
      tips: [
        'Reflection in the <b>x</b>-axis changes <b>y</b> (and the other way round). The axis you reflect in is the one that <b>stays</b>.',
        'Rotation 180° = change <b>both</b> signs. Rotation 90° = <b>swap</b> then fix one sign.',
        'Scale factor less than 1 (like 0.5) makes the shape <b>smaller</b>. It is still called an enlargement.',
        'A′ is read "A dash" — it always means the <b>new</b> point.',
        'Two transformations in a row: do <b>one at a time</b> and write down the middle point before you start the second one.',
        'Saying "a rotation" is <b>not enough</b>. Say the angle, the direction and the centre every time.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
