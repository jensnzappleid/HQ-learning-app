/* Topic: Circles — circumference and area with π = 3.14. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const PI = 3.14;
  const PI_NOTE = 'Use π = 3.14 and round to 1 decimal place.';
  /** Answer computed with 3.14, rounded to 1 dp. Tolerance grows slightly with size so a calculator-π answer (also rounded to 1 dp) is still marked right. */
  const piAns = (value, unit) => {
    const v = N.round(value, 1);
    return { type: 'number', value: v, unit, tolerance: Math.max(0.15, N.round(0.1 + v * 0.0006, 2)) };
  };
  const fmt1 = (x) => N.fmt(N.round(x, 1));
  const fmtRaw = (x) => N.fmt(N.round(x, 4));

  const SVG = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48}</style>${inner}<text x="${w - 4}" y="${h - 4}" text-anchor="end" font-size="12" fill="#888">not to scale</text></svg>`;
  const T = (x, y, s, opt = '') => `<text x="${x}" y="${y}" ${opt}>${s}</text>`;
  const INK = '#4A3B48', ROSE = '#E0568C';

  function circleSvg(len, unit, isRadius) {
    const cx = 160, cy = 105, r = 80;
    const line = isRadius
      ? `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${ROSE}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>` + T(cx + r / 2, cy - 8, `r = ${N.fmt(len)} ${unit}`, 'text-anchor="middle"')
      : `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${ROSE}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>` + T(cx, cy - 8, `d = ${N.fmt(len)} ${unit}`, 'text-anchor="middle"');
    return SVG(320, 210, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>` + line);
  }
  function semiSvg(len, unit, isRadius) {
    const cx = 160, cy = 150, r = 100;
    const path = `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z" fill="#FFE98A" stroke="${INK}" stroke-width="2"/>`;
    const label = isRadius
      ? `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="${ROSE}" stroke-width="2.5" stroke-dasharray="6 4"/>` + T(cx + 8, cy - r / 2, `r = ${N.fmt(len)} ${unit}`)
      : T(cx, cy + 22, `d = ${N.fmt(len)} ${unit}`, 'text-anchor="middle"');
    return SVG(320, 190, path + label);
  }
  /** SVG without the "not to scale" note — for naming diagrams, which are not measured */
  const SVG0 = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48}</style>${inner}</svg>`;
  /** a quarter circle: two straight radii and one curved edge */
  function quartSvg(r, unit) {
    const x = 90, y = 168, R2 = 130;
    const shape = `<path d="M${x} ${y} L${x + R2} ${y} A${R2} ${R2} 0 0 0 ${x} ${y - R2} Z" fill="#CFF0DA" stroke="${INK}" stroke-width="2"/>`
      + `<path d="M${x + 14} ${y} L${x + 14} ${y - 14} L${x} ${y - 14}" fill="none" stroke="${INK}" stroke-width="1.5"/>`;
    return SVG(320, 200, shape
      + T(x + R2 / 2, y + 20, `r = ${N.fmt(r)} ${unit}`, 'text-anchor="middle"')
      + T(x - 8, y - R2 / 2, `r = ${N.fmt(r)} ${unit}`, 'text-anchor="end"'));
  }
  /** a circle with one named part picked out in rose */
  function partsSvg(part) {
    const cx = 168, cy = 100, r = 76, INK2 = INK;
    const P = (deg, rad) => [N.round(cx + rad * Math.cos(deg * Math.PI / 180), 2), N.round(cy + rad * Math.sin(deg * Math.PI / 180), 2)];
    const base = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EAF4FB" stroke="${INK2}" stroke-width="2"/>`;
    const dot = `<circle cx="${cx}" cy="${cy}" r="4" fill="${INK2}"/>`;
    let mark;
    if (part === 'centre') mark = `<circle cx="${cx}" cy="${cy}" r="6" fill="${ROSE}"/><circle cx="${cx}" cy="${cy}" r="15" fill="none" stroke="${ROSE}" stroke-width="2.5"/>`;
    else if (part === 'radius') { const a = P(-40, r); mark = `<line x1="${cx}" y1="${cy}" x2="${a[0]}" y2="${a[1]}" stroke="${ROSE}" stroke-width="4.5"/>` + dot; }
    else if (part === 'diameter') { const a = P(160, r), b = P(-20, r); mark = `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ROSE}" stroke-width="4.5"/>` + dot; }
    else if (part === 'chord') { const a = P(-72, r), b = P(14, r); mark = `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ROSE}" stroke-width="4.5"/>` + dot; }
    else if (part === 'arc') { const a = P(-125, r), b = P(-25, r); mark = `<path d="M${a[0]} ${a[1]} A${r} ${r} 0 0 1 ${b[0]} ${b[1]}" fill="none" stroke="${ROSE}" stroke-width="6"/>`; }
    else if (part === 'sector') { const a = P(-90, r), b = P(30, r); mark = `<path d="M${cx} ${cy} L${a[0]} ${a[1]} A${r} ${r} 0 0 1 ${b[0]} ${b[1]} Z" fill="#F9A8C9" stroke="${ROSE}" stroke-width="2.5"/>` + dot; }
    else mark = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ROSE}" stroke-width="6"/>` + dot;
    return SVG0(320, 200, base + mark);
  }
  const PART_DEF = {
    centre: 'the exact middle point of the circle',
    radius: 'the distance from the centre out to the edge',
    diameter: 'a straight line right across the circle, through the centre',
    chord: 'a straight line joining two points on the edge, but <b>not</b> through the centre',
    arc: 'a piece of the edge of the circle',
    sector: 'a slice of the circle between two radii, like a piece of pizza',
    circumference: 'the whole distance around the outside of the circle',
  };
  const PART_WHY = {
    centre: 'It is the single point in the middle that everything else is measured from.',
    radius: 'It starts at the centre and stops at the edge — one spoke of the wheel.',
    diameter: 'It goes edge to edge and passes through the centre, so it is twice the radius.',
    chord: 'It joins two points on the edge but misses the centre. (A diameter is the longest chord of all.)',
    arc: 'It is curved and it is part of the edge, not a straight line.',
    sector: 'It is a whole slice: two straight radii with a curved edge between them.',
    circumference: 'It is the complete edge, all the way round.',
  };

  /** a circular pond with a path around it: inner circle + ring */
  function ringSvg(r, w, unit) {
    const cx = 160, cy = 100, ro = 84, ri = 56;
    const shape = `<circle cx="${cx}" cy="${cy}" r="${ro}" fill="#FFC79A" stroke="${INK}" stroke-width="2"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${ri}" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>`
      + `<line x1="${cx}" y1="${cy}" x2="${cx + ri}" y2="${cy}" stroke="${ROSE}" stroke-width="2.5"/>`
      + `<line x1="${cx}" y1="${cy - ri}" x2="${cx}" y2="${cy - ro}" stroke="${ROSE}" stroke-width="2.5"/>`
      + `<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
    return SVG(320, 200, shape
      + T(cx + ri / 2, cy + 20, `r = ${N.fmt(r)} ${unit}`, 'text-anchor="middle"')
      + T(cx + 8, cy - (ro + ri) / 2 + 5, `path ${N.fmt(w)} ${unit}`));
  }

  function compositeSvg(s, unit) {
    // square with a semicircle on top (diameter = side)
    const x = 85, y = 150, w = 150, r = 75;
    const shape = `<path d="M${x} ${y} L${x} ${y - w} A${r} ${r} 0 0 1 ${x + w} ${y - w} L${x + w} ${y} Z" fill="#C9B8F2" stroke="${INK}" stroke-width="2"/>`
      + `<line x1="${x}" y1="${y - w}" x2="${x + w}" y2="${y - w}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
    return SVG(320, 180, shape + T(x + w / 2, y + 20, `${N.fmt(s)} ${unit}`, 'text-anchor="middle"') + T(x + w + 8, y - w / 2 + 5, `${N.fmt(s)} ${unit}`));
  }

  /** naming the parts of a circle: either "what is the red part called?" or "which word means …?" */
  function partsQ(level) {
    const shown = R.pick(['radius', 'diameter', 'chord', 'arc', 'sector', 'centre', 'circumference']);
    const pool = ['centre', 'radius', 'diameter', 'chord', 'arc', 'sector', 'circumference'];
    const wrong = R.sample(pool.filter((p) => p !== shown), 3);
    const choices = R.shuffle([shown].concat(wrong));
    if (R.chance(0.55)) {
      return {
        prompt: 'What is the red part of this circle called?',
        visual: partsSvg(shown),
        answer: { type: 'choice', value: choices.indexOf(shown), choices },
        hint: 'Is it straight or curved? Does it touch the centre? Is it part of the edge, or a slice?',
        working: [`Look at the red part: ${PART_DEF[shown]}.`, PART_WHY[shown], `So it is the <b>${shown}</b>.`],
        finalAnswer: shown, skill: 'parts',
      };
    }
    return {
      prompt: `Which word means <b>${PART_DEF[shown]}</b>?`,
      answer: { type: 'choice', value: choices.indexOf(shown), choices },
      hint: 'Say each word to yourself and picture it on a bike wheel.',
      working: [`${PART_DEF[shown].charAt(0).toUpperCase() + PART_DEF[shown].slice(1)}.`, PART_WHY[shown], `That is the <b>${shown}</b>.`],
      finalAnswer: shown, skill: 'parts',
    };
  }

  function calc(level) {
    const unit = R.pick(['cm', 'm', 'cm', 'mm']);
    const t = level === 1 ? R.pick(['C-d', 'C-d', 'A-r', 'C-r', 'parts', 'parts', 'rd'])
      : level === 2 ? R.pick(['C-d', 'C-r', 'A-r', 'A-d', 'A-r', 'C-r', 'parts', 'semiP', 'quartA'])
      : R.pick(['semiA', 'semiP', 'rFromC', 'compA', 'compP', 'A-d', 'dFromC', 'quartP', 'quartA', 'rFromA', 'dFromA']);
    if (t === 'parts') return partsQ(level);
    if (t === 'rd') {
      const r = R.int(2, 20), fromR = R.chance(0.5);
      return {
        prompt: fromR ? `A circle has a radius of ${r} ${unit}. What is its diameter?` : `A circle has a diameter of ${2 * r} ${unit}. What is its radius?`,
        visual: circleSvg(fromR ? r : 2 * r, unit, fromR),
        answer: { type: 'number', value: fromR ? 2 * r : r, unit },
        hint: 'The diameter is always <b>double</b> the radius. The radius is <b>half</b> the diameter.',
        working: fromR ? [`d = 2 × r.`, `2 × ${r} = ${2 * r}.`, `Diameter = <b>${2 * r} ${unit}</b>.`]
          : [`r = d ÷ 2.`, `${2 * r} ÷ 2 = ${r}.`, `Radius = <b>${r} ${unit}</b>.`],
        finalAnswer: `${fromR ? 2 * r : r} ${unit}`, skill: 'parts',
      };
    }
    if (t === 'quartA' || t === 'quartP') {
      const r = level === 2 ? R.int(2, 10) : R.int(3, 16);
      const isA = t === 'quartA';
      const A = PI * r * r / 4, arc = PI * 2 * r / 4, P = arc + 2 * r;
      return {
        prompt: isA ? `Find the area of this quarter circle. ${PI_NOTE}` : `Find the perimeter of this quarter circle. That is the curved edge <b>plus</b> the two straight edges. ${PI_NOTE}`,
        visual: quartSvg(r, unit),
        answer: piAns(isA ? A : P, isA ? unit + '²' : unit),
        hint: isA ? 'Find the area of the whole circle (π r²), then divide by 4.' : 'A quarter of the circumference, then add the two straight radii. Forgetting the straight edges is the classic mistake.',
        working: isA
          ? [`Whole circle: 3.14 × ${r}² = 3.14 × ${r * r} = ${fmtRaw(PI * r * r)}.`, `A quarter of that: ${fmtRaw(PI * r * r)} ÷ 4 = ${fmtRaw(A)} ≈ ${fmt1(A)}.`, `Area ≈ <b>${fmt1(A)} ${unit}²</b>.`]
          : [`Whole circumference: 3.14 × ${2 * r} = ${fmtRaw(PI * 2 * r)}.`, `The curved edge is a quarter of it: ${fmtRaw(PI * 2 * r)} ÷ 4 = ${fmtRaw(arc)}.`, `Now add the two straight edges (each is the radius): ${r} + ${r} = ${2 * r}.`, `${fmtRaw(arc)} + ${2 * r} = ${fmtRaw(P)} ≈ ${fmt1(P)}.`, `Perimeter ≈ <b>${fmt1(P)} ${unit}</b>.`],
        finalAnswer: isA ? `${fmt1(A)} ${unit}²` : `${fmt1(P)} ${unit}`, skill: 'quarter',
      };
    }
    if (t === 'rFromA' || t === 'dFromA') {
      const r = R.int(2, 12);
      const Ashown = N.round(PI * r * r, 2);
      const wantR = t === 'rFromA';
      const ans = wantR ? r : 2 * r;
      return {
        prompt: `A circle has an area of ${N.fmt(Ashown)} ${unit}². Find its ${wantR ? 'radius' : 'diameter'}. Use π = 3.14.`,
        answer: { type: 'number', value: ans, unit, tolerance: 0.15 },
        hint: 'A = π × r², so work backwards: divide the area by 3.14 to get r², then find the number that times itself gives r².',
        working: [
          `A = π × r², so r² = A ÷ π.`,
          `r² = ${N.fmt(Ashown)} ÷ 3.14 = ${r * r}.`,
          `Which number times itself is ${r * r}? ${r} × ${r} = ${r * r}, so r = ${r}.`,
        ].concat(wantR ? [] : [`d = 2 × ${r} = ${2 * r}.`]).concat([`${wantR ? 'Radius' : 'Diameter'} = <b>${ans} ${unit}</b>.`]),
        finalAnswer: `${ans} ${unit}`, skill: 'reverse',
      };
    }
    if (t === 'C-d' || t === 'C-r') {
      const isR = t === 'C-r';
      const len = level === 1 ? R.int(2, 12) : level === 2 ? (R.chance(0.3) ? R.int(2, 12) + 0.5 : R.int(3, 25)) : R.int(5, 30);
      const d = isR ? 2 * len : len;
      const Cval = PI * d;
      return {
        prompt: `Find the circumference of this circle. ${PI_NOTE}`,
        visual: circleSvg(len, unit, isR),
        answer: piAns(Cval, unit),
        hint: isR ? 'Circumference = 2 × π × r (or π × diameter). Double the radius first.' : 'Circumference = π × diameter.',
        working: (isR ? [`Diameter = 2 × ${N.fmt(len)} = ${N.fmt(d)} ${unit}.`] : []).concat([
          `C = π × d = 3.14 × ${N.fmt(d)}.`,
          `= ${fmtRaw(Cval)} ≈ ${fmt1(Cval)}.`,
          `Circumference ≈ <b>${fmt1(Cval)} ${unit}</b>.`,
        ]),
        finalAnswer: `${fmt1(Cval)} ${unit}`, skill: 'circumference',
      };
    }
    if (t === 'A-r' || t === 'A-d') {
      const isD = t === 'A-d';
      const r = level === 1 ? R.int(1, 6) : level === 2 ? R.int(2, 12) : R.int(3, 15);
      const len = isD ? 2 * r : r;
      const Aval = PI * r * r;
      return {
        prompt: `Find the area of this circle. ${PI_NOTE}`,
        visual: circleSvg(len, unit, !isD),
        answer: piAns(Aval, unit + '²'),
        hint: isD ? 'Area = π × r². You are given the diameter, so halve it to get the radius first.' : 'Area = π × r × r. Square the radius first, then multiply by 3.14.',
        working: (isD ? [`Radius = ${N.fmt(len)} ÷ 2 = ${r} ${unit}.`] : []).concat([
          `A = π × r² = 3.14 × ${r}² = 3.14 × ${r * r}.`,
          `= ${fmtRaw(Aval)} ≈ ${fmt1(Aval)}.`,
          `Area ≈ <b>${fmt1(Aval)} ${unit}²</b>.`,
        ]),
        finalAnswer: `${fmt1(Aval)} ${unit}²`, skill: 'area',
      };
    }
    if (t === 'semiA') {
      const r = R.int(2, 12);
      const isR = R.chance(0.5);
      const A = PI * r * r / 2;
      return {
        prompt: `Find the area of this half-circle. ${PI_NOTE}`,
        visual: semiSvg(isR ? r : 2 * r, unit, isR),
        answer: piAns(A, unit + '²'),
        hint: 'Find the area of the whole circle (π r²), then halve it.',
        working: (isR ? [] : [`Radius = ${2 * r} ÷ 2 = ${r} ${unit}.`]).concat([
          `Whole circle: 3.14 × ${r}² = 3.14 × ${r * r} = ${fmtRaw(PI * r * r)}.`,
          `Half of that: ${fmtRaw(PI * r * r)} ÷ 2 = ${fmtRaw(A)} ≈ ${fmt1(A)}.`,
          `Area ≈ <b>${fmt1(A)} ${unit}²</b>.`,
        ]),
        finalAnswer: `${fmt1(A)} ${unit}²`, skill: 'semi',
      };
    }
    if (t === 'semiP') {
      const r = R.int(2, 12), d = 2 * r;
      const isR = R.chance(0.5);
      const arc = PI * d / 2, P = arc + d;
      return {
        prompt: `Find the perimeter of this half-circle (the curved part plus the straight edge). ${PI_NOTE}`,
        visual: semiSvg(isR ? r : d, unit, isR),
        answer: piAns(P, unit),
        hint: 'Perimeter = half the circumference + the diameter (the straight edge).',
        working: (isR ? [`Diameter = 2 × ${r} = ${d} ${unit}.`] : []).concat([
          `Curved part = half of π × d = 3.14 × ${d} ÷ 2 = ${fmtRaw(arc)}.`,
          `Add the straight edge: ${fmtRaw(arc)} + ${d} = ${fmtRaw(P)} ≈ ${fmt1(P)}.`,
          `Perimeter ≈ <b>${fmt1(P)} ${unit}</b>.`,
        ]),
        finalAnswer: `${fmt1(P)} ${unit}`, skill: 'semi',
      };
    }
    if (t === 'rFromC' || t === 'dFromC') {
      const d = R.int(2, 15) * 2;
      const Cshown = N.round(PI * d, 2);
      const wantR = t === 'rFromC';
      const ans = wantR ? d / 2 : d;
      return {
        prompt: `A circle has a circumference of ${N.fmt(Cshown)} ${unit}. Find its ${wantR ? 'radius' : 'diameter'}. Use π = 3.14.`,
        answer: { type: 'number', value: ans, unit, tolerance: 0.15 },
        hint: 'C = π × d, so d = C ÷ π.' + (wantR ? ' Then halve the diameter to get the radius.' : ''),
        working: [`d = C ÷ π = ${N.fmt(Cshown)} ÷ 3.14 = ${d}.`].concat(wantR ? [`r = ${d} ÷ 2 = ${d / 2}.`] : []).concat([`${wantR ? 'Radius' : 'Diameter'} = <b>${N.fmt(ans)} ${unit}</b>.`]),
        finalAnswer: `${N.fmt(ans)} ${unit}`, skill: 'reverse',
      };
    }
    // composite: square + semicircle on top
    const s = R.int(2, 10) * 2;
    const r = s / 2;
    const isA = t === 'compA';
    const semiA = PI * r * r / 2, A = s * s + semiA;
    const arc = PI * s / 2, P = 3 * s + arc;
    return {
      prompt: isA ? `This shape is a square with a half-circle on top. Find its total area. ${PI_NOTE}` : `This shape is a square with a half-circle on top. Find its perimeter (the distance around the outside). ${PI_NOTE}`,
      visual: compositeSvg(s, unit),
      answer: piAns(isA ? A : P, isA ? unit + '²' : unit),
      hint: isA ? 'Square area + half of a circle area. The half-circle has diameter equal to the square side.' : 'Three sides of the square + half the circumference of a circle with diameter equal to the side.',
      working: isA
        ? [`Square: ${s} × ${s} = ${s * s}.`, `Half-circle radius = ${s} ÷ 2 = ${r}. Area = 3.14 × ${r}² ÷ 2 = ${fmtRaw(semiA)}.`, `Total = ${s * s} + ${fmtRaw(semiA)} = ${fmtRaw(A)} ≈ ${fmt1(A)}.`, `Area ≈ <b>${fmt1(A)} ${unit}²</b>.`]
        : [`Three straight sides: 3 × ${s} = ${3 * s}.`, `Curved part: half of 3.14 × ${s} = ${fmtRaw(arc)}.`, `Total = ${3 * s} + ${fmtRaw(arc)} = ${fmtRaw(P)} ≈ ${fmt1(P)}.`, `Perimeter ≈ <b>${fmt1(P)} ${unit}</b>.`],
      finalAnswer: isA ? `${fmt1(A)} ${unit}²` : `${fmt1(P)} ${unit}`, skill: 'composite',
    };
  }

  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['wheel1', 'table1', 'pizza1', 'clock', 'mat1', 'pool1'])
      : level === 2 ? R.pick(['wheel2', 'table2', 'pizza2', 'track2', 'pool', 'gardenQ', 'wheelTurns2'])
      : R.pick(['wheel3', 'table3', 'track3', 'pizza3', 'hoop', 'gardenQ', 'window3', 'tramp3', 'pond3']);
    switch (t) {
      case 'mat1': {
        const d = R.pick([2, 3, 4, 5, 1.5]);
        const C = PI * d;
        return {
          prompt: `A round mat on the marae floor is ${N.fmt(d)} m across (its diameter). Braid is sewn all the way around the edge. How long is the braid? ${PI_NOTE}`,
          visual: circleSvg(d, 'm', false),
          answer: piAns(C, 'm'),
          hint: 'All the way around a circle = the circumference = π × d.',
          working: [`C = π × d = 3.14 × ${N.fmt(d)} = ${fmtRaw(C)}.`, `<b>${fmt1(C)} m</b> of braid.`],
          finalAnswer: `${fmt1(C)} m`,
        };
      }
      case 'pool1': {
        const r = R.pick([1, 1.5, 2, 2.5, 3]);
        return {
          prompt: `A round paddling pool has a radius of ${N.fmt(r)} m. What is its diameter?`,
          visual: circleSvg(r, 'm', true),
          answer: { type: 'number', value: N.round(2 * r, 2), unit: 'm' },
          hint: 'The diameter goes right across, so it is <b>double</b> the radius.',
          working: [`d = 2 × r.`, `2 × ${N.fmt(r)} = ${N.fmt(2 * r)}.`, `Diameter = <b>${N.fmt(2 * r)} m</b>.`],
          finalAnswer: `${N.fmt(2 * r)} m`,
        };
      }
      case 'wheelTurns2': {
        const d = R.pick([50, 60, 70, 40, 80]), turns = R.pick([10, 20, 5]);
        const C = PI * d, total = C * turns;
        return {
          prompt: `${name}'s bike wheel has a diameter of ${d} cm. How far does the bike travel in ${turns} turns of the wheel, in centimetres? ${PI_NOTE}`,
          visual: circleSvg(d, 'cm', false),
          answer: piAns(total, 'cm'),
          hint: 'Work out one turn first (that is the circumference, π × d), then multiply by the number of turns.',
          working: [`One turn: C = 3.14 × ${d} = ${fmtRaw(C)} cm.`, `${turns} turns: ${fmtRaw(C)} × ${turns} = ${fmtRaw(total)}.`, `<b>${fmt1(total)} cm</b>.`],
          finalAnswer: `${fmt1(total)} cm`,
        };
      }
      case 'pond3': {
        const r = R.int(2, 8), w = R.pick([0.5, 1, 1.5, 2]);
        const RO = N.round(r + w, 2);
        const outer = PI * RO * RO, inner = PI * r * r, path = outer - inner;
        return {
          prompt: `A round pond has a radius of ${r} m. A gravel path ${N.fmt(w)} m wide is laid all the way around the outside of the pond. What is the area of the path? ${PI_NOTE}`,
          visual: ringSvg(r, w, 'm'),
          answer: piAns(path, 'm²'),
          hint: 'Find the area of the <b>big</b> circle (pond + path), then take away the area of the pond. The big radius is the pond radius plus the path width.',
          working: [
            `Big radius: ${r} + ${N.fmt(w)} = ${N.fmt(RO)} m.`,
            `Big circle: 3.14 × ${N.fmt(RO)}² = 3.14 × ${N.fmt(N.round(RO * RO, 4))} = ${fmtRaw(outer)} m².`,
            `Pond: 3.14 × ${r}² = 3.14 × ${r * r} = ${fmtRaw(inner)} m².`,
            `Path = ${fmtRaw(outer)} − ${fmtRaw(inner)} = ${fmtRaw(path)} ≈ ${fmt1(path)}.`,
            `<b>${fmt1(path)} m²</b> of gravel.`,
          ],
          finalAnswer: `${fmt1(path)} m²`,
        };
      }
      case 'gardenQ': {
        const r = level === 3 ? R.int(3, 12) : R.int(2, 8);
        const isA = level === 2 || R.chance(0.5);
        const A = PI * r * r / 4, arc = PI * 2 * r / 4, P = arc + 2 * r;
        return {
          prompt: isA
            ? `${name} makes a quarter-circle garden bed in the corner of the lawn, with a radius of ${r} m. What is the area of the garden bed? ${PI_NOTE}`
            : `${name} makes a quarter-circle garden bed in the corner of the lawn, with a radius of ${r} m. Edging goes all the way around it: the curved edge and both straight edges. How much edging is needed? ${PI_NOTE}`,
          visual: quartSvg(r, 'm'),
          answer: piAns(isA ? A : P, isA ? 'm²' : 'm'),
          hint: isA ? 'Whole circle area (π r²), then divide by 4.' : 'A quarter of the circumference, then add the two straight sides (each is the radius).',
          working: isA
            ? [`Whole circle: 3.14 × ${r}² = ${fmtRaw(PI * r * r)} m².`, `A quarter: ${fmtRaw(PI * r * r)} ÷ 4 = ${fmtRaw(A)} ≈ ${fmt1(A)}.`, `<b>${fmt1(A)} m²</b>.`]
            : [`Whole circumference: 3.14 × ${2 * r} = ${fmtRaw(PI * 2 * r)} m.`, `Curved edge = a quarter: ${fmtRaw(PI * 2 * r)} ÷ 4 = ${fmtRaw(arc)} m.`, `Straight edges: ${r} + ${r} = ${2 * r} m.`, `${fmtRaw(arc)} + ${2 * r} = ${fmtRaw(P)} ≈ ${fmt1(P)}.`, `<b>${fmt1(P)} m</b> of edging.`],
          finalAnswer: isA ? `${fmt1(A)} m²` : `${fmt1(P)} m`,
        };
      }
      case 'window3': {
        const d = R.pick([1.2, 1.4, 1.6, 2, 1.8]);
        const arc = PI * d / 2, P = arc + d;
        return {
          prompt: `A half-circle window is ${N.fmt(d)} m across the flat bottom. Wooden trim goes all the way around the window: the curved top and the straight bottom. How long is the trim? ${PI_NOTE}`,
          visual: semiSvg(d, 'm', false),
          answer: piAns(P, 'm'),
          hint: 'Half the circumference for the curved top, then add the straight bottom (the diameter). Do not forget the straight bit.',
          working: [`Curved top = half of π × d = 3.14 × ${N.fmt(d)} ÷ 2 = ${fmtRaw(arc)} m.`, `Straight bottom = the diameter = ${N.fmt(d)} m.`, `${fmtRaw(arc)} + ${N.fmt(d)} = ${fmtRaw(P)} ≈ ${fmt1(P)}.`, `<b>${fmt1(P)} m</b> of trim.`],
          finalAnswer: `${fmt1(P)} m`,
        };
      }
      case 'tramp3': {
        const r = R.int(2, 6);
        const Ashown = N.round(PI * r * r, 2);
        return {
          prompt: `A round trampoline covers ${N.fmt(Ashown)} m² of ${name}'s lawn. What is its radius? Use π = 3.14.`,
          answer: { type: 'number', value: r, unit: 'm', tolerance: 0.15 },
          hint: 'Area = π × r². Work backwards: divide the area by 3.14, then find the number that times itself gives that.',
          working: [`r² = area ÷ π = ${N.fmt(Ashown)} ÷ 3.14 = ${r * r}.`, `${r} × ${r} = ${r * r}, so r = ${r}.`, `Radius = <b>${r} m</b>.`],
          finalAnswer: `${r} m`,
        };
      }
      case 'wheel1': {
        const d = R.pick([50, 60, 70, 40, 65]);
        const C = PI * d;
        return {
          prompt: `A bike wheel has a diameter of ${d} cm. How far does the bike move forward in one turn of the wheel? ${PI_NOTE}`,
          answer: piAns(C, 'cm'),
          hint: 'One turn of the wheel = one circumference = π × d.',
          working: [`C = π × d = 3.14 × ${d} = ${fmtRaw(C)}.`, `One turn moves the bike <b>${fmt1(C)} cm</b>.`],
          finalAnswer: `${fmt1(C)} cm`,
        };
      }
      case 'wheel2': {
        const r = R.pick([25, 30, 35, 20, 33]);
        const C = PI * 2 * r;
        return {
          prompt: `${name}'s bike wheel has a radius of ${r} cm. How far does the bike travel in one full turn of the wheel? ${PI_NOTE}`,
          answer: piAns(C, 'cm'),
          hint: 'Distance in one turn = circumference = 2 × π × r.',
          working: [`Diameter = 2 × ${r} = ${2 * r} cm.`, `C = 3.14 × ${2 * r} = ${fmtRaw(C)}.`, `<b>${fmt1(C)} cm</b> per turn.`],
          finalAnswer: `${fmt1(C)} cm`,
        };
      }
      case 'wheel3': {
        const d = R.pick([50, 60, 70, 40]), turns = R.pick([10, 20, 50, 100]);
        const C = PI * d, total = C * turns / 100;
        return {
          prompt: `A bike wheel has a diameter of ${d} cm. The wheel turns ${turns} times. How far does the bike travel, in metres? ${PI_NOTE}`,
          answer: piAns(total, 'm'),
          hint: 'Find one circumference in cm, multiply by the turns, then divide by 100 for metres.',
          working: [`C = 3.14 × ${d} = ${fmtRaw(C)} cm.`, `${turns} turns: ${fmtRaw(C)} × ${turns} = ${fmtRaw(C * turns)} cm.`, `÷ 100 = ${fmtRaw(total)} m ≈ ${fmt1(total)}.`, `<b>${fmt1(total)} m</b>.`],
          finalAnswer: `${fmt1(total)} m`,
        };
      }
      case 'table1': {
        const d = R.pick([1, 2, 1.5, 1.2, 0.8]);
        const C = PI * d;
        return {
          prompt: `A round table has a diameter of ${N.fmt(d)} m. How long is the edge of the table (its circumference)? ${PI_NOTE}`,
          answer: piAns(C, 'm'),
          hint: 'Circumference = π × d.',
          working: [`C = 3.14 × ${N.fmt(d)} = ${fmtRaw(C)}.`, `<b>${fmt1(C)} m</b>.`],
          finalAnswer: `${fmt1(C)} m`,
        };
      }
      case 'table2': {
        const r = R.pick([0.5, 0.6, 0.8, 1, 0.7]);
        const A = PI * r * r;
        return {
          prompt: `A round table has a radius of ${N.fmt(r)} m. What is the area of the table top? ${PI_NOTE}`,
          answer: piAns(A, 'm²'),
          hint: 'Area = π × r². Square the radius first.',
          working: [`r² = ${N.fmt(r)} × ${N.fmt(r)} = ${N.fmt(N.round(r * r, 4))}.`, `A = 3.14 × ${N.fmt(N.round(r * r, 4))} = ${fmtRaw(A)}.`, `<b>${fmt1(A)} m²</b>.`],
          finalAnswer: `${fmt1(A)} m²`,
        };
      }
      case 'table3': {
        const d = R.pick([120, 140, 150, 160, 180]), cost = R.pick([2, 3, 5, 4]);
        const C = PI * d / 100, total = C * cost;
        return {
          prompt: `A round table top has a diameter of ${d} cm. Edging tape costs $${cost} per metre. What does it cost to put tape all the way around the edge? ${PI_NOTE}`,
          answer: piAns(total, '$'),
          hint: 'Find the circumference in metres first (diameter in m × 3.14), then multiply by the price.',
          working: [`${d} cm = ${N.fmt(d / 100)} m.`, `C = 3.14 × ${N.fmt(d / 100)} = ${fmtRaw(C)} m.`, `${fmtRaw(C)} × $${cost} = ${fmtRaw(total)} ≈ ${fmt1(total)}.`, `Cost ≈ <b>$${fmt1(total)}</b>.`],
          finalAnswer: `$${fmt1(total)}`,
        };
      }
      case 'pizza1': {
        const r = R.pick([10, 12, 15, 9, 11]);
        const A = PI * r * r;
        return {
          prompt: `A pizza has a radius of ${r} cm. What is the area of the pizza? ${PI_NOTE}`,
          answer: piAns(A, 'cm²'),
          hint: 'Area = π × r².',
          working: [`A = 3.14 × ${r}² = 3.14 × ${r * r}.`, `= ${fmtRaw(A)}.`, `<b>${fmt1(A)} cm²</b>.`],
          finalAnswer: `${fmt1(A)} cm²`,
        };
      }
      case 'pizza2': {
        const d = R.pick([20, 24, 30, 26, 32]);
        const r = d / 2, A = PI * r * r;
        return {
          prompt: `A pizza is ${d} cm across (its diameter). What is the area of the pizza? ${PI_NOTE}`,
          answer: piAns(A, 'cm²'),
          hint: 'Halve the diameter to get the radius, then use π × r².',
          working: [`r = ${d} ÷ 2 = ${r} cm.`, `A = 3.14 × ${r}² = 3.14 × ${r * r} = ${fmtRaw(A)}.`, `<b>${fmt1(A)} cm²</b>.`],
          finalAnswer: `${fmt1(A)} cm²`,
        };
      }
      case 'pizza3': {
        const d = R.pick([20, 24, 30, 26, 32]), slices = R.pick([4, 8, 2]);
        const r = d / 2, A = PI * r * r, slice = A / slices;
        return {
          prompt: `A pizza ${d} cm across is cut into ${slices} equal slices. What is the area of one slice? ${PI_NOTE}`,
          answer: piAns(slice, 'cm²'),
          hint: 'Find the whole pizza area (π r², radius = half the diameter), then divide by the number of slices.',
          working: [`r = ${d} ÷ 2 = ${r} cm.`, `Whole pizza: 3.14 × ${r * r} = ${fmtRaw(A)} cm².`, `One slice: ${fmtRaw(A)} ÷ ${slices} = ${fmtRaw(slice)} ≈ ${fmt1(slice)}.`, `<b>${fmt1(slice)} cm²</b>.`],
          finalAnswer: `${fmt1(slice)} cm²`,
        };
      }
      case 'clock': {
        const r = R.pick([10, 15, 12, 20]);
        const C = PI * 2 * r;
        return {
          prompt: `A clock face has a radius of ${r} cm. What is the distance around the edge of the clock? ${PI_NOTE}`,
          answer: piAns(C, 'cm'),
          hint: 'Circumference = 2 × π × r.',
          working: [`C = 2 × 3.14 × ${r} = 3.14 × ${2 * r} = ${fmtRaw(C)}.`, `<b>${fmt1(C)} cm</b>.`],
          finalAnswer: `${fmt1(C)} cm`,
        };
      }
      case 'track2': {
        const r = R.pick([20, 25, 30, 40, 50]);
        const C = PI * 2 * r;
        return {
          prompt: `A circular running track has a radius of ${r} m. How far is one lap? ${PI_NOTE}`,
          answer: piAns(C, 'm'),
          hint: 'One lap = the circumference = 2 × π × r.',
          working: [`C = 2 × 3.14 × ${r} = 3.14 × ${2 * r} = ${fmtRaw(C)}.`, `One lap = <b>${fmt1(C)} m</b>.`],
          finalAnswer: `${fmt1(C)} m`,
        };
      }
      case 'track3': {
        const r = R.pick([20, 25, 30, 40, 50]), laps = R.int(2, 8);
        const C = PI * 2 * r, total = C * laps;
        return {
          prompt: `A circular running track has a radius of ${r} m. ${name} runs ${laps} laps. How far does ${name} run? ${PI_NOTE}`,
          answer: piAns(total, 'm'),
          hint: 'Find one lap (2 × π × r), then multiply by the number of laps.',
          working: [`One lap: 3.14 × ${2 * r} = ${fmtRaw(C)} m.`, `${laps} laps: ${fmtRaw(C)} × ${laps} = ${fmtRaw(total)}.`, `<b>${fmt1(total)} m</b>.`],
          finalAnswer: `${fmt1(total)} m`,
        };
      }
      case 'pool': {
        const d = R.pick([2, 3, 4, 2.5, 3.5]);
        const r = d / 2, A = PI * r * r;
        return {
          prompt: `A round paddling pool is ${N.fmt(d)} m across. What area of the lawn does it cover? ${PI_NOTE}`,
          answer: piAns(A, 'm²'),
          hint: 'Halve the diameter to get the radius, then A = π × r².',
          working: [`r = ${N.fmt(d)} ÷ 2 = ${N.fmt(r)} m.`, `A = 3.14 × ${N.fmt(r)}² = 3.14 × ${N.fmt(N.round(r * r, 4))} = ${fmtRaw(A)}.`, `<b>${fmt1(A)} m²</b>.`],
          finalAnswer: `${fmt1(A)} m²`,
        };
      }
      default: { // hoop: reverse
        const d = R.pick([60, 70, 80, 90, 100]);
        const Cshown = N.round(PI * d, 1);
        return {
          prompt: `A hula hoop has a circumference of ${N.fmt(Cshown)} cm. What is its diameter? Use π = 3.14.`,
          answer: { type: 'number', value: d, unit: 'cm', tolerance: 0.15 },
          hint: 'C = π × d, so work backwards: d = C ÷ 3.14.',
          working: [`d = C ÷ π = ${N.fmt(Cshown)} ÷ 3.14 = ${d}.`, `Diameter = <b>${d} cm</b>.`],
          finalAnswer: `${d} cm`,
        };
      }
    }
  }

  HL.registerTopic({
    id: 'circles', subject: 'maths', strand: 'measurement', order: 3,
    name: 'Circles', short: 'Circles',
    blurb: 'Circumference (around) and area (inside) of circles using π.',
    example: 'C = π × d &nbsp;·&nbsp; A = π × r² &nbsp;·&nbsp; r = 5: A ≈ 78.5',
    animal: 'penguin',
    learn: (() => {
      const INK = '#4A3B48', BLUE = '#2A6FA5', ROSE = '#E0568C', GREEN = '#2FA97A';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // a circle at (cx, cy) radius r; opts.d = diameter label (rose), opts.r = radius label (blue), opts.C = dashed green ring for the circumference
      const circle = (cx, cy, r, opts = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFE98A" stroke="${INK}" stroke-width="2.5"/>${opts.C ? `<circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="none" stroke="${GREEN}" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="${cx},${cy - r - 18} ${cx + 10},${cy - r - 12} ${cx},${cy - r - 6}" fill="${GREEN}"/>` : ''}${opts.d ? `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${ROSE}" stroke-width="3"/><text x="${cx}" y="${cy + 20}" text-anchor="middle" fill="${ROSE}">${opts.d}</text>` : ''}${opts.r && opts.d ? `<line x1="${cx}" y1="${cy}" x2="${cx + r * 0.707}" y2="${cy - r * 0.707}" stroke="${BLUE}" stroke-width="3"/><text x="${cx + r * 0.42}" y="${cy - r * 0.22}" fill="${BLUE}">${opts.r}</text>` : opts.r ? `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${BLUE}" stroke-width="3"/><text x="${cx + r / 2}" y="${cy - 8}" text-anchor="middle" fill="${BLUE}">${opts.r}</text>` : ''}<circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`;
      return {
      what: '<p>The <b>radius</b> (r) goes from the centre to the edge, like one spoke of a bike wheel. The <b>diameter</b> (d) goes all the way across through the centre, so <b>d = 2 × r</b>. The <b>circumference</b> (C) is the distance around the edge — one full roll of the wheel.</p><p><b>π</b> (pi) is a special number, about <b>3.14</b>. Every circle\'s circumference is π times its diameter. We use π = 3.14 and round answers to 1 decimal place.</p>',
      visual: SVG(360, 220, `${circle(105, 115, 78, { d: 'd', r: 'r', C: true })}
        <text x="20" y="32" fill="${GREEN}">C</text>
        <text x="205" y="42" fill="${INK}">π ≈ 3.14</text>
        <text x="205" y="70" fill="${ROSE}">d = 2 × r</text>
        <text x="205" y="112" fill="${GREEN}" font-size="17">C = π × d</text>
        <text x="205" y="132" fill="${GREEN}">around the edge</text>
        <text x="205" y="172" fill="${ROSE}" font-size="17">A = π × r²</text>
        <text x="205" y="192" fill="${ROSE}">space inside</text>`),
      facts: [
        '<b>d = 2 × r</b> (the radius is half the diameter)',
        '<b>π ≈ 3.14</b>',
        'Circumference (around): <b>C = π × d</b>',
        'Area (inside): <b>A = π × r²</b> — square the radius <b>first</b>',
        'Half-circle perimeter = <b>½ C + d</b> (curve plus the straight edge)',
        'Quarter-circle perimeter = <b>¼ C + r + r</b> (curve plus <b>two</b> straight edges)',
        'Backwards from C: <b>d = C ÷ π</b> &nbsp;·&nbsp; Backwards from A: <b>r² = A ÷ π</b>, then find r',
        'Parts: <b>radius</b> centre → edge · <b>diameter</b> right across · <b>chord</b> edge to edge, missing the centre · <b>arc</b> a piece of the edge · <b>sector</b> a pizza slice',
      ],
      steps: [
        'Ask: "Around or inside?" <b>Around</b> → circumference, C = π × d. <b>Inside</b> → area, A = π × r².',
        'Ask: "Was I given r or d?" Circumference needs <b>d</b> (double the radius). Area needs <b>r</b> (halve the diameter).',
        'For area, say "square the radius <b>first</b>": r² = r × r. Then × 3.14.',
        '<b>Half-circle</b>: halve the area. For its perimeter, halve the circumference <b>and add the diameter</b> (the straight edge). <b>Quarter circle</b>: quarter the area; for its perimeter, quarter the circumference <b>and add two radii</b>.',
        '<b>Working backwards</b>: from the circumference, d = C ÷ π. From the area, r² = A ÷ π first, then ask "which number times itself gives that?"',
        'Round to 1 decimal place at the <b>end</b>, and write the unit: cm for around, cm² for inside.',
        '<b>Naming a part</b>: ask "is it straight or curved?" Curved → arc (a piece of the edge) or circumference (the whole edge). Straight → does it go through the centre? Yes and it stops at the centre → radius; yes and it goes right across → diameter; no → chord. A filled slice is a sector.',
      ],
      examples: [
        { q: 'Circumference of a circle with diameter 10 cm', working: ['<b>Picture:</b> a bike wheel 10 cm across. Circumference = how far it rolls in one turn — about 3 diameters (π of them).', '1. Around or inside? <b>Around</b> → C = π × d.', '2. Do I have d? Yes, d = 10.', 'C = 3.14 × 10 = 31.4'], a: '31.4 cm',
          visual: SVG(360, 112, `${circle(64, 56, 44, { d: '10 cm' })}<text x="130" y="42" fill="${INK}">C = π × d</text><text x="130" y="70" fill="${GREEN}">= 3.14 × 10 = 31.4 cm</text>`) },
        { q: 'Circumference of a circle with radius 3 cm', working: ['<b>Picture:</b> the wheel again — one spoke is 3 cm, so right across it is 6 cm.', '1. Around or inside? Around → C = π × d.', '2. Do I have d? <b>No</b>, only r. So I double it: d = 2 × 3 = 6.', '3. C = 3.14 × 6 = 18.84', '4. Round to 1 dp: 18.8'], a: '18.8 cm' },
        { q: 'Area of a circle with radius 5 m', working: ['<b>Picture:</b> painting the whole face of the wheel — every bit inside the tyre.', '1. Around or inside? <b>Inside</b> → A = π × r².', '2. Do I have r? Yes, r = 5.', '3. Square the radius first: 5² = 5 × 5 = 25.', 'A = 3.14 × 25 = 78.5'], a: '78.5 m²',
          visual: SVG(360, 112, `${circle(64, 56, 44, { r: '5 m' })}<text x="130" y="30" fill="${INK}">A = π × r²</text><text x="130" y="58" fill="${BLUE}">r² = 5 × 5 = 25</text><text x="130" y="86" fill="${GREEN}">3.14 × 25 = 78.5 m²</text>`) },
        { q: 'Area of a circle with diameter 8 cm', working: ['<b>Picture:</b> painting the face of a wheel that is 8 cm across.', '1. Around or inside? Inside → A = π × r².', '2. Do I have r? <b>No</b>, only d. So I halve it: r = 8 ÷ 2 = 4.', '3. Square it: 4² = 16.', '4. A = 3.14 × 16 = 50.24 ≈ 50.2'], a: '50.2 cm²' },
        { q: 'Perimeter of a half-circle with diameter 12 cm', working: ['<b>Picture:</b> half a wheel: a curved edge <b>plus</b> a straight edge across the middle.', '1. Around or inside? Around → I need the curved edge and the straight edge.', '2. Curved edge = half the circumference: 3.14 × 12 ÷ 2 = 18.84.', '3. Straight edge = the diameter = 12.', '4. Add: 18.84 + 12 = 30.84 ≈ 30.8'], a: '30.8 cm',
          visual: SVG(360, 116, `<path d="M30 88 A60 60 0 0 1 150 88 Z" fill="#FFE98A" stroke="${INK}" stroke-width="2.5"/><path d="M30 88 A60 60 0 0 1 150 88" fill="none" stroke="${GREEN}" stroke-width="4"/><line x1="30" y1="88" x2="150" y2="88" stroke="${ROSE}" stroke-width="4"/><text x="90" y="106" text-anchor="middle" fill="${ROSE}">12 cm</text><text x="90" y="20" text-anchor="middle" fill="${GREEN}">½ of C</text><text x="172" y="28" fill="${GREEN}">curve: 3.14 × 12 ÷ 2</text><text x="172" y="52" fill="${GREEN}">= 18.84</text><text x="172" y="78" fill="${ROSE}">+ straight edge 12</text><text x="172" y="104" fill="${INK}">= 30.84 ≈ 30.8 cm</text>`) },
        { q: 'A round trampoline in Rotorua is 4 m across. How long is the safety pad that goes right around its edge?', working: ['<b>Picture:</b> the trampoline is a giant wheel; the pad is its tyre.', '1. Around or inside? "Right around the edge" → <b>circumference</b>.', '2. Do I have d? Yes, "4 m across" is the diameter.', '3. C = 3.14 × 4 = 12.56', '4. Round: 12.6'], a: '12.6 m' },
        { q: 'What are the parts of a circle called?', working: ['<b>Picture:</b> the bike wheel again. A <b>radius</b> is one spoke. The <b>diameter</b> is two spokes in a straight line, right across.', '1. Is it <b>straight</b> or <b>curved</b>?', '2. Curved: a piece of the edge is an <b>arc</b>; the whole edge is the <b>circumference</b>.', '3. Straight and stops at the centre → <b>radius</b>. Straight, right across through the centre → <b>diameter</b>. Straight, edge to edge but <b>missing</b> the centre → <b>chord</b>.', '4. A filled slice between two spokes is a <b>sector</b>.'], a: 'radius, diameter, chord, arc, sector',
          visual: SVG(360, 162, [['radius'], ['diameter'], ['chord'], ['arc'], ['sector']].map((k, i) => {
            const cx = 40 + i * 70, cy = 58, r = 26, name = k[0];
            const P = (deg, rad) => [Math.round(cx + rad * Math.cos(deg * Math.PI / 180)), Math.round(cy + rad * Math.sin(deg * Math.PI / 180))];
            let mk = '';
            if (name === 'radius') { const a = P(-45, r); mk = `<line x1="${cx}" y1="${cy}" x2="${a[0]}" y2="${a[1]}" stroke="${ROSE}" stroke-width="3.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`; }
            if (name === 'diameter') { const a = P(180, r), b = P(0, r); mk = `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ROSE}" stroke-width="3.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`; }
            if (name === 'chord') { const a = P(-140, r), b = P(-20, r); mk = `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${ROSE}" stroke-width="3.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`; }
            if (name === 'arc') { const a = P(-150, r), b = P(-30, r); mk = `<path d="M${a[0]} ${a[1]} A${r} ${r} 0 0 1 ${b[0]} ${b[1]}" fill="none" stroke="${GREEN}" stroke-width="4.5"/>`; }
            if (name === 'sector') { const a = P(-90, r), b = P(30, r); mk = `<path d="M${cx} ${cy} L${a[0]} ${a[1]} A${r} ${r} 0 0 1 ${b[0]} ${b[1]} Z" fill="#F9A8C9" stroke="${ROSE}" stroke-width="2"/>`; }
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EAF4FB" stroke="${INK}" stroke-width="1.8"/>${mk}<text x="${cx}" y="${cy + 44}" text-anchor="middle" fill="${INK}" font-size="12">${name}</text>`;
          }).join('') + `<text x="10" y="128" fill="${BLUE}" font-size="12">The <tspan font-weight="700">centre</tspan> is the middle dot.</text><text x="10" y="146" fill="${BLUE}" font-size="12">The <tspan font-weight="700">circumference</tspan> is the whole edge, right round.</text>`) },
        { q: 'Perimeter of a quarter circle with radius 6 cm', working: ['<b>Picture:</b> a quarter of a pizza. The <b>crust</b> is the curved bit; the two straight cuts are radii.', '1. Around or inside? Around → the curved edge <b>and</b> the straight edges.', '2. Whole circumference: 3.14 × 12 = 37.68.', '3. The curve is a quarter of it: 37.68 ÷ 4 = 9.42.', '4. Two straight cuts, each 6 cm: 6 + 6 = 12.', '5. Add them: 9.42 + 12 = 21.42 ≈ 21.4'], a: '21.4 cm',
          visual: SVG(360, 152, `<path d="M62 128 L162 128 A100 100 0 0 0 62 28 Z" fill="#CFF0DA" stroke="${INK}" stroke-width="2"/><path d="M162 128 A100 100 0 0 0 62 28" fill="none" stroke="${GREEN}" stroke-width="5"/><line x1="62" y1="128" x2="162" y2="128" stroke="${ROSE}" stroke-width="4"/><line x1="62" y1="128" x2="62" y2="28" stroke="${ROSE}" stroke-width="4"/><text x="112" y="146" text-anchor="middle" fill="${ROSE}">6 cm</text><text x="54" y="82" text-anchor="end" fill="${ROSE}">6 cm</text><text x="176" y="44" fill="${GREEN}">curve: 37.68 ÷ 4 = 9.42</text><text x="176" y="72" fill="${ROSE}">+ 6 + 6 = 12</text><text x="176" y="104" fill="${INK}">9.42 + 12 = 21.42</text><text x="176" y="132" fill="${GREEN}" font-size="15">≈ 21.4 cm</text>`) },
        { q: 'A circle has an area of 78.5 cm². Find its radius. Use π = 3.14.', working: ['<b>Picture:</b> the pizza again — but this time I know how much pizza there is and I want the length of one spoke.', '1. Which formula? Inside → A = π × r². I know A and want r, so I go <b>backwards</b>.', '2. Undo the × 3.14 first: r² = 78.5 ÷ 3.14 = 25.', '3. Now undo the squaring: which number times itself is 25? 5 × 5 = 25.', 'r = 5'], a: '5 cm',
          visual: SVG(360, 150, (() => {
            const box = (x, y, w, txt, fill) => `<rect x="${x}" y="${y}" width="${w}" height="30" rx="8" fill="${fill}" stroke="${INK}" stroke-width="1.8"/><text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" fill="${INK}">${txt}</text>`;
            const arr = (x1, x2, y, txt, col, below) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="2.5"/><polygon points="${x2},${y} ${x2 + (x2 > x1 ? -9 : 9)},${y - 5} ${x2 + (x2 > x1 ? -9 : 9)},${y + 5}" fill="${col}"/><text x="${(x1 + x2) / 2}" y="${y + (below ? 26 : -9)}" text-anchor="middle" fill="${col}" font-size="12">${txt}</text>`;
            return `<text x="10" y="18" fill="${BLUE}" font-size="12">forwards</text>`
              + box(20, 26, 56, 'r = 5', '#FFE98A') + box(150, 26, 56, 'r² = 25', '#FFE98A') + box(272, 26, 76, 'A = 78.5', '#FFE98A')
              + arr(80, 146, 41, 'square it', BLUE) + arr(210, 268, 41, '× 3.14', BLUE)
              + `<text x="10" y="92" fill="${ROSE}" font-size="12">backwards</text>`
              + box(272, 100, 76, 'A = 78.5', '#F9A8C9') + box(150, 100, 56, 'r² = 25', '#F9A8C9') + box(20, 100, 56, 'r = 5', '#F9A8C9')
              + arr(268, 210, 115, '÷ 3.14', ROSE, true) + arr(146, 80, 115, 'what × itself?', ROSE, true);
          })()) },
      ],
      tips: [
        '<b>Area needs the radius.</b> If you are given the diameter, halve it first. This is the number one mistake.',
        'r² means r × r, <b>not</b> r × 2.',
        'Circumference answers use plain units (cm); area answers use squared units (cm²).',
        'Memory hook: "<b>C</b>herry pies are <b>d</b>elicious" → C = π d. "<b>A</b>pple pies <b>are</b> too" → A = π r².',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
