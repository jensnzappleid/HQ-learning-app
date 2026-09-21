/* Topic: Metric units — converting length, mass, capacity, area and volume units,
 * reading a scale where not every mark is labelled, choosing a sensible unit, and estimating. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const r4 = (x) => N.round(x, 4);
  /** number answer; decimals get a tiny tolerance so float noise never marks a right answer wrong */
  const numAns = (value, unit) => Number.isInteger(value) ? { type: 'number', value, unit } : { type: 'number', value, unit, tolerance: 0.001 };

  const INK = '#4A3B48', ROSE = '#E0568C';
  const SVGQ = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48;font-weight:600}</style>${inner}</svg>`;
  const TQ = (x, y, s, opt = '') => `<text x="${x}" y="${y}" ${opt}>${s}</text>`;
  const sgn = (v) => (v < 0 ? '−' + Math.abs(v) : String(N.round(v, 4)));

  /** a ruler 0…maxCm long with mm marks; only every `labelEvery` cm is numbered. Arrow points at valueCm. */
  function rulerSvg(maxCm, valueCm, labelEvery) {
    const x0 = 28, x1 = 296, px = (x1 - x0) / maxCm, yT = 66, yB = 136;
    let ticks = '';
    for (let i = 0; i <= maxCm * 10; i++) {
      const x = N.round(x0 + i * px / 10, 2), isCm = i % 10 === 0, isHalf = i % 5 === 0;
      ticks += `<line x1="${x}" y1="${yT}" x2="${x}" y2="${yT + (isCm ? 30 : isHalf ? 19 : 11)}" stroke="${INK}" stroke-width="${isCm ? 1.8 : 1}"/>`;
      if (isCm && (i / 10) % labelEvery === 0) ticks += TQ(x, yT + 50, String(i / 10), 'text-anchor="middle" style="font-size:13px"');
    }
    const ax = N.round(x0 + valueCm * px, 2);
    const arrow = `<line x1="${ax}" y1="${yT - 32}" x2="${ax}" y2="${yT - 8}" stroke="${ROSE}" stroke-width="3"/><polygon points="${ax},${yT} ${ax - 7},${yT - 11} ${ax + 7},${yT - 11}" fill="${ROSE}"/>`;
    return SVGQ(320, 160, `<rect x="${x0}" y="${yT}" width="${x1 - x0}" height="${yB - yT}" fill="#FFE98A" stroke="${INK}" stroke-width="2"/>${ticks}${arrow}`
      + TQ(160, 154, 'centimetres', 'text-anchor="middle" style="font-size:12px;fill:#8A7C88"'));
  }
  /** a measuring jug marked every `step`, numbered only every `labelEvery` marks, filled to `value` */
  function jugSvg(max, step, labelEvery, value, uLabel) {
    const xL = 128, xR = 226, yT = 26, yB = 172, h = yB - yT;
    const Y = (v) => N.round(yB - (v / max) * h, 2);
    let ticks = '';
    for (let v = 0; v <= max; v += step) {
      const on = Math.round(v / step) % labelEvery === 0;
      ticks += `<line x1="${xL}" y1="${Y(v)}" x2="${xL + (on ? 34 : 20)}" y2="${Y(v)}" stroke="${INK}" stroke-width="${on ? 2 : 1.2}"/>`;
      if (on) ticks += TQ(xL - 8, Y(v) + 5, String(v), 'text-anchor="end" style="font-size:13px"');
    }
    return SVGQ(320, 196, `<rect x="${xL}" y="${Y(value)}" width="${xR - xL}" height="${yB - Y(value)}" fill="#A9D8F5"/>`
      + `<path d="M${xL} ${yT} L${xL} ${yB} L${xR} ${yB} L${xR} ${yT}" fill="none" stroke="${INK}" stroke-width="2.5"/>`
      + `<path d="M${xR} ${yT} l16 -9" stroke="${INK}" stroke-width="2.5" fill="none"/>`
      + ticks
      + `<line x1="${xL}" y1="${Y(value)}" x2="${xR}" y2="${Y(value)}" stroke="${ROSE}" stroke-width="2.5"/>`
      + TQ(xR + 8, Y(value) + 5, '← water', `style="font-size:12px;fill:${ROSE}"`)
      + TQ(177, 190, uLabel, 'text-anchor="middle" style="font-size:12px;fill:#8A7C88"'));
  }
  /** kitchen scales: a round dial marked every `step`, numbered every `labelEvery` marks, needle at `value` */
  function dialSvg(max, step, labelEvery, value, uLabel) {
    const cx = 160, cy = 100, r = 80;
    const pt = (v, rad) => { const a = ((v / max) * 360 - 90) * Math.PI / 180; return [N.round(cx + rad * Math.cos(a), 2), N.round(cy + rad * Math.sin(a), 2)]; };
    let ticks = '';
    for (let v = 0; v < max; v += step) {
      const on = Math.round(v / step) % labelEvery === 0;
      const a = pt(v, r), b = pt(v, r - (on ? 15 : 8));
      ticks += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${INK}" stroke-width="${on ? 2 : 1}"/>`;
      if (on) { const c = pt(v, r - 31); ticks += TQ(c[0], c[1] + 5, String(v), 'text-anchor="middle" style="font-size:13px"'); }
    }
    const n = pt(value, r - 26);
    return SVGQ(320, 200, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>${ticks}`
      + `<line x1="${cx}" y1="${cy}" x2="${n[0]}" y2="${n[1]}" stroke="${ROSE}" stroke-width="3.5" stroke-linecap="round"/>`
      + `<circle cx="${cx}" cy="${cy}" r="5" fill="${INK}"/>`
      + TQ(160, 196, 'kitchen scales — ' + uLabel, 'text-anchor="middle" style="font-size:12px;fill:#8A7C88"'));
  }
  /** thermometer from min to max, marked every `step`, numbered every `labelEvery` marks, reading `value` */
  function thermoSvg(min, max, step, labelEvery, value) {
    const x = 132, w = 20, yT = 22, yB = 152, bulb = yB + 18;
    const Y = (v) => N.round(yB - ((v - min) / (max - min)) * (yB - yT), 2);
    let ticks = '';
    for (let v = min; v <= max; v += step) {
      const on = Math.round((v - min) / step) % labelEvery === 0;
      ticks += `<line x1="${x + w}" y1="${Y(v)}" x2="${x + w + (on ? 15 : 8)}" y2="${Y(v)}" stroke="${INK}" stroke-width="${on ? 2 : 1.2}"/>`;
      if (on) ticks += TQ(x + w + 21, Y(v) + 5, sgn(v), 'style="font-size:13px"');
    }
    return SVGQ(320, 200, `<rect x="${x}" y="${yT}" width="${w}" height="${bulb - yT}" rx="10" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`
      + `<circle cx="${x + w / 2}" cy="${bulb}" r="16" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>`
      + `<rect x="${x + 5}" y="${Y(value)}" width="${w - 10}" height="${bulb - Y(value)}" fill="${ROSE}"/>`
      + `<circle cx="${x + w / 2}" cy="${bulb}" r="12" fill="${ROSE}"/>`
      + ticks
      + `<line x1="${x - 22}" y1="${Y(value)}" x2="${x - 3}" y2="${Y(value)}" stroke="${ROSE}" stroke-width="2.5"/>`
      + `<polygon points="${x - 2},${Y(value)} ${x - 12},${Y(value) - 6} ${x - 12},${Y(value) + 6}" fill="${ROSE}"/>`
      + TQ(x + w + 50, 30, '°C', 'style="font-size:14px"'));
  }

  /** the same self-talk for every scale: find two labels, count the gaps, work out one mark, count on */
  function scaleWorking(lo, hi, gaps, per, value, uTxt) {
    const steps = Math.round((value - lo) / per);
    return [
      `Find two numbers next to each other on the scale: <b>${sgn(lo)}</b> and <b>${sgn(hi)}</b>.`,
      `Count the little gaps between them: <b>${gaps}</b>.`,
      `So one little mark is (${sgn(hi)} ${lo < 0 ? '+ ' + Math.abs(lo) : '− ' + lo}) ÷ ${gaps} = <b>${sgn(per)} ${uTxt}</b>.`,
      `The pointer is ${steps} mark${steps === 1 ? '' : 's'} past ${sgn(lo)}: ${sgn(lo)} + ${steps} × ${sgn(per)} = ${sgn(value)}.`,
      `Reading: <b>${sgn(value)} ${uTxt}</b>.`,
    ];
  }
  /** pick a reading that is NOT on a numbered mark */
  function offLabel(lo, hi, per, gaps) { return lo + per * R.int(1, gaps - 1); }

  function scaleQ(level) {
    const kind = R.pick(['ruler', 'jug', 'scales', 'thermo']);
    if (kind === 'ruler') {
      const maxCm = level === 1 ? 6 : level === 2 ? 8 : 10;
      const labelEvery = level === 3 ? 2 : 1;
      const gaps = labelEvery * 10, per = 0.1;
      const loCm = R.int(0, maxCm - labelEvery); const lo = loCm - (loCm % labelEvery);
      const mm = level === 1 ? R.pick([5]) : R.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const valueCm = r4(lo + R.int(0, labelEvery - 1) + mm / 10);
      const inMm = R.chance(0.4);
      const ans = inMm ? r4(valueCm * 10) : valueCm;
      return {
        prompt: `The arrow points at a mark on this ruler. What length does it show, in ${inMm ? 'millimetres' : 'centimetres'}?`,
        visual: rulerSvg(maxCm, valueCm, labelEvery),
        answer: numAns(ans, inMm ? 'mm' : 'cm'),
        hint: `Only the ${labelEvery === 1 ? 'centimetres' : 'even centimetres'} are numbered. Between two numbers there are ${gaps} little marks, so each one is ${labelEvery === 1 ? '0.1 cm = 1 mm' : '0.1 cm'}.`,
        working: scaleWorking(lo, lo + labelEvery, gaps, per, valueCm, 'cm')
          .concat(inMm ? [`In millimetres: ${sgn(valueCm)} × 10 = <b>${sgn(ans)} mm</b>.`] : []),
        finalAnswer: `${sgn(ans)} ${inMm ? 'mm' : 'cm'}`, skill: 'scale',
      };
    }
    if (kind === 'jug') {
      const cfg = level === 1 ? { max: 1000, step: 100, every: 2 } : level === 2 ? { max: 2000, step: 100, every: 5 } : { max: 1000, step: 50, every: 4 };
      const gaps = cfg.every, per = cfg.step, band = cfg.step * cfg.every;
      const lo = band * R.int(0, cfg.max / band - 1);
      const value = offLabel(lo, lo + band, per, gaps);
      const inL = level === 3 && R.chance(0.5);
      const ans = inL ? r4(value / 1000) : value;
      return {
        prompt: `This measuring jug is marked in millilitres, but not every mark is numbered. How much water is in the jug${inL ? ', in litres' : ''}?`,
        visual: jugSvg(cfg.max, cfg.step, cfg.every, value, 'millilitres'),
        answer: numAns(ans, inL ? 'L' : 'mL'),
        hint: `Between two numbers there are ${gaps} gaps. Work out what one gap is worth before you read the level.`,
        working: scaleWorking(lo, lo + band, gaps, per, value, 'mL')
          .concat(inL ? [`In litres: ${value} ÷ 1000 = <b>${sgn(ans)} L</b>.`] : []),
        finalAnswer: `${sgn(ans)} ${inL ? 'L' : 'mL'}`, skill: 'scale',
      };
    }
    if (kind === 'scales') {
      const cfg = level === 1 ? { max: 1000, step: 100, every: 2 } : level === 2 ? { max: 2000, step: 100, every: 5 } : { max: 1000, step: 25, every: 4 };
      const gaps = cfg.every, per = cfg.step, band = cfg.step * cfg.every;
      const lo = band * R.int(0, cfg.max / band - 1);
      const value = offLabel(lo, lo + band, per, gaps);
      const inKg = level === 3 && R.chance(0.5);
      const ans = inKg ? r4(value / 1000) : value;
      const item = R.pick(['flour', 'sugar', 'potatoes', 'apples', 'oats', 'rice']);
      return {
        prompt: `A bag of ${item} is on the kitchen scales. Not every mark is numbered. What is the mass${inKg ? ', in kilograms' : ', in grams'}?`,
        visual: dialSvg(cfg.max, cfg.step, cfg.every, value, 'grams'),
        answer: numAns(ans, inKg ? 'kg' : 'g'),
        hint: `Between two numbers there are ${gaps} gaps. Find what one gap is worth first, then count round from the number before the needle.`,
        working: scaleWorking(lo, lo + band, gaps, per, value, 'g')
          .concat(inKg ? [`In kilograms: ${value} ÷ 1000 = <b>${sgn(ans)} kg</b>.`] : []),
        finalAnswer: `${sgn(ans)} ${inKg ? 'kg' : 'g'}`, skill: 'scale',
      };
    }
    const cfg = level === 1 ? { min: 0, max: 50, step: 2, every: 5 } : level === 2 ? { min: -10, max: 40, step: 2, every: 5 } : { min: -20, max: 40, step: 5, every: 4 };
    const gaps = cfg.every, per = cfg.step, band = cfg.step * cfg.every;
    const lo = cfg.min + band * R.int(0, (cfg.max - cfg.min) / band - 1);
    const value = offLabel(lo, lo + band, per, gaps);
    const place = R.pick(['Ohakune', 'Dunedin', 'Taupō', 'Wellington', 'Christchurch']);
    return {
      prompt: `This thermometer is in ${place}. Not every mark is numbered. What temperature does it show?`,
      visual: thermoSvg(cfg.min, cfg.max, cfg.step, cfg.every, value),
      answer: numAns(value, '°C'),
      hint: `Between two numbers there are ${gaps} gaps, so work out what one gap is worth first.`,
      working: scaleWorking(lo, lo + band, gaps, per, value, '°C'),
      finalAnswer: `${sgn(value)} °C`, skill: 'scale',
    };
  }

  const UNIT_ITEMS = [
    { q: 'the length of a pencil', a: 'cm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the thickness of a $1 coin', a: 'mm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the height of a classroom door', a: 'm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the distance from Auckland to Hamilton', a: 'km', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the length of a netball court', a: 'm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the width of your little fingernail', a: 'mm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the length of a kayak', a: 'm', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the length of a walking track in the bush', a: 'km', opts: ['mm', 'cm', 'm', 'km'] },
    { q: 'the mass of a paperclip', a: 'g', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the mass of a bag of sugar', a: 'kg', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the mass of a truck', a: 't', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the mass of a Year 8 student', a: 'kg', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the mass of one strawberry', a: 'g', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the mass of a whale', a: 't', opts: ['mg', 'g', 'kg', 't'] },
    { q: 'the medicine in a teaspoon', a: 'mL', opts: ['mL', 'L', 'kL'] },
    { q: 'the water in a bucket', a: 'L', opts: ['mL', 'L', 'kL'] },
    { q: 'the drink in a can', a: 'mL', opts: ['mL', 'L', 'kL'] },
    { q: 'the water in a swimming pool', a: 'kL', opts: ['mL', 'L', 'kL'] },
    { q: 'the water in a rainwater tank', a: 'L', opts: ['mL', 'L', 'kL'] },
    { q: 'the area of a page in your maths book', a: 'cm²', opts: ['mm²', 'cm²', 'm²', 'ha'] },
    { q: 'the area of a classroom floor', a: 'm²', opts: ['mm²', 'cm²', 'm²', 'ha'] },
    { q: 'the area of a sheep farm', a: 'ha', opts: ['mm²', 'cm²', 'm²', 'ha'] },
  ];
  const UNIT_WHY = { mm: 'millimetres are for tiny things you would measure with the small marks on a ruler', cm: 'centimetres are for things about the size of your hand or your book', m: 'metres are for things about the size of a room or a person', km: 'kilometres are for long journeys', mg: 'milligrams are far too tiny for everyday things', g: 'grams are for light things you could hold in one hand', kg: 'kilograms are for shopping-bag sized weights', t: 'tonnes are for very heavy things like vehicles', mL: 'millilitres are for small amounts, like a spoon or a can', L: 'litres are for bottles, buckets and tanks', kL: 'kilolitres (1000 L) are for huge amounts of water', 'mm²': 'square millimetres are tiny', 'cm²': 'square centimetres suit page-sized areas', 'm²': 'square metres suit rooms and gardens', ha: 'hectares are for farms and big paddocks' };

  function unitChoiceQ() {
    const it = R.pick(UNIT_ITEMS);
    const shuffled = R.shuffle(it.opts);
    return {
      prompt: `Which unit would you use to measure <b>${it.q}</b>?`,
      answer: { type: 'choice', value: shuffled.indexOf(it.a), choices: shuffled },
      hint: 'Picture the real thing. Would the number come out sensible in this unit, or silly and huge?',
      working: [`Picture ${it.q}.`, `Think about size: ${UNIT_WHY[it.a]}.`, `The sensible unit is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'choose-unit',
    };
  }

  const ESTIMATES = [
    { q: 'how tall a classroom door is', a: '2 m', wrong: ['20 cm', '20 m', '2 km'] },
    { q: 'how heavy a Year 8 student is', a: '45 kg', wrong: ['45 g', '450 kg', '4.5 kg'] },
    { q: 'how much water is in a bath', a: '150 L', wrong: ['15 L', '1500 L', '1.5 L'] },
    { q: 'how long a school bus is', a: '12 m', wrong: ['1.2 m', '120 m', '12 cm'] },
    { q: 'how heavy an apple is', a: '150 g', wrong: ['15 g', '1.5 kg', '15 kg'] },
    { q: 'how wide a doorway is', a: '80 cm', wrong: ['8 cm', '8 m', '80 m'] },
    { q: 'how far you can walk in one hour', a: '5 km', wrong: ['500 m', '50 km', '5 m'] },
    { q: 'how thick a $2 coin is', a: '3 mm', wrong: ['3 cm', '30 mm', '3 m'] },
    { q: 'how tall a Year 8 student is', a: '155 cm', wrong: ['15 cm', '155 mm', '15 m'] },
    { q: 'how much milk fits in a mug', a: '250 mL', wrong: ['25 mL', '2.5 L', '25 L'] },
    { q: 'how heavy a netball is', a: '400 g', wrong: ['40 g', '4 kg', '40 kg'] },
    { q: 'how long a school swimming pool is', a: '25 m', wrong: ['25 cm', '250 m', '2.5 m'] },
    { q: 'how heavy a family car is', a: '1.5 t', wrong: ['150 kg', '15 t', '1.5 kg'] },
    { q: 'how long a maths lesson desk is', a: '1.2 m', wrong: ['12 cm', '12 m', '1.2 km'] },
    { q: 'how much juice is in a small bottle', a: '600 mL', wrong: ['60 mL', '6 L', '60 L'] },
    { q: 'how heavy a loaf of bread is', a: '700 g', wrong: ['70 g', '7 kg', '70 kg'] },
    { q: 'how wide a single bed is', a: '90 cm', wrong: ['9 cm', '9 m', '900 cm'] },
    { q: 'how far it is around a running track', a: '400 m', wrong: ['40 m', '4 km', '40 km'] },
  ];

  function estimateQ() {
    const e = R.pick(ESTIMATES);
    const shuffled = R.shuffle([e.a].concat(e.wrong));
    return {
      prompt: `Choose the best estimate for <b>${e.q}</b>.`,
      answer: { type: 'choice', value: shuffled.indexOf(e.a), choices: shuffled },
      hint: 'Compare it with something you know well: your own height, a metre ruler, a 1 kg bag of sugar, a 1 litre milk bottle.',
      working: [`Picture ${e.q} next to something you know.`, `Check each answer: is it silly-small or silly-big?`, `The sensible estimate is <b>${e.a}</b>.`],
      finalAnswer: e.a, skill: 'estimate',
    };
  }

  // Conversion pairs: small unit, big unit, factor (1 big = factor small)
  const PAIRS = {
    length: [
      { small: 'mm', big: 'cm', f: 10 },
      { small: 'cm', big: 'm', f: 100 },
      { small: 'm', big: 'km', f: 1000 },
    ],
    mass: [
      { small: 'g', big: 'kg', f: 1000 },
      { small: 'kg', big: 't', f: 1000 },
    ],
    capacity: [{ small: 'mL', big: 'L', f: 1000 }],
    area: [
      { small: 'cm²', big: 'm²', f: 10000 },
      { small: 'm²', big: 'ha', f: 10000 },
      { small: 'mm²', big: 'cm²', f: 100 },
    ],
    volume: [
      { small: 'cm³', big: 'mL', f: 1 },
      { small: 'cm³', big: 'L', f: 1000 },
      { small: 'mL', big: 'cm³', f: 1 },
    ],
  };
  const unitName = { mm: 'millimetres', cm: 'centimetres', m: 'metres', km: 'kilometres', g: 'grams', kg: 'kilograms', t: 'tonnes', mL: 'millilitres', L: 'litres', 'cm²': 'square centimetres', 'm²': 'square metres', ha: 'hectares', 'mm²': 'square millimetres', 'cm³': 'cubic centimetres' };
  const fmtF = (f) => N.fmt(f);

  /** pick a "small unit" amount so that the big-unit amount is nice at this level */
  function smallAmount(p, level) {
    const f = p.f;
    if (f === 1) return R.int(50, 900);
    if (level === 1) {
      // whole big units, or a half
      const whole = R.int(1, 9) * f;
      return R.chance(0.25) && f >= 100 ? whole + f / 2 : whole;
    }
    if (f === 10) return R.int(11, 99);                       // 4.5 cm
    if (f === 100) return R.chance(0.5) ? R.int(101, 999) : R.int(2, 9) * 10 + R.int(1, 9) * 100 + (R.chance(0.5) ? 5 : 0); // 2.35 m or 450 cm
    if (f === 1000) return R.pick([R.int(1, 9) * 1000 + R.int(1, 9) * 100, R.int(1, 99) * 10, R.int(1, 9) * 1000 + R.int(1, 19) * 50]); // 3200, 450, 1250
    if (f === 10000) return R.pick([5000, 15000, 20000, 25000, 30000, 45000, 50000, 75000, 12500, 2500, 70000, 35000]);
    return R.int(1, 9) * f;
  }

  function calc(level) {
    // reading a scale / choosing a unit / estimating share the calc slot with the conversions
    const extra = R.int(1, 100);
    if (extra <= 18) return scaleQ(level);
    if (extra <= 26) return unitChoiceQ(level);
    if (extra <= 33) return estimateQ(level);
    // L3: sometimes an "add different units" question, sometimes multi-step mm ↔ m
    if (level === 3 && R.chance(0.3)) return addMixed(level);
    if (level === 3 && R.chance(0.2)) return twoStep();
    const family = level === 3 ? R.pick(['area', 'volume', 'area', 'volume', 'length', 'mass']) : R.pick(['length', 'mass', 'capacity', 'length']);
    const p = R.pick(PAIRS[family]);
    const s = smallAmount(p, level);
    const b = r4(s / p.f);
    const toBig = R.chance(0.5);
    const from = toBig ? s : b, fromU = toBig ? p.small : p.big, toU = toBig ? p.big : p.small, ans = toBig ? b : s;
    const opWord = toBig ? 'divide' : 'multiply';
    const opSym = toBig ? '÷' : '×';
    const zeros = String(p.f).length - 1;
    const working = p.f === 1
      ? [`1 ${p.small} is exactly the same as 1 ${p.big}.`, `So ${N.fmt(from)} ${fromU} = <b>${N.fmt(ans)} ${toU}</b>.`]
      : [
        `1 ${p.big} = ${fmtF(p.f)} ${p.small}.`,
        `Going from ${fromU} to ${toU} means ${toBig ? 'a bigger unit, so the number gets smaller' : 'a smaller unit, so the number gets bigger'}: ${opWord} by ${fmtF(p.f)}.`,
        `${N.fmt(from)} ${opSym} ${fmtF(p.f)} = ${N.fmt(ans)} (move the decimal point ${zeros} place${zeros > 1 ? 's' : ''} to the ${toBig ? 'left' : 'right'}).`,
        `Answer: <b>${N.fmt(ans)} ${toU}</b>.`,
      ];
    return {
      prompt: `Convert ${N.fmt(from)} ${fromU} to ${toU}.`,
      answer: numAns(ans, toU),
      hint: p.f === 1 ? `1 ${p.small} = 1 ${p.big}. They are the same size.` : `1 ${p.big} = ${fmtF(p.f)} ${p.small}. Are you going to a bigger or a smaller unit?`,
      working,
      finalAnswer: `${N.fmt(ans)} ${toU}`,
      skill: family,
    };
  }

  function twoStep() {
    // mm ↔ m (1000) or km ↔ cm (100 000)
    const t = R.pick(['mm-m', 'm-mm', 'km-cm']);
    if (t === 'mm-m') {
      const mm = R.int(1, 99) * 50;
      const ans = r4(mm / 1000);
      return {
        prompt: `Convert ${N.fmt(mm)} mm to m.`,
        answer: numAns(ans, 'm'),
        hint: 'Go mm → cm (÷ 10), then cm → m (÷ 100). Altogether that is ÷ 1000.',
        working: [`${N.fmt(mm)} mm ÷ 10 = ${N.fmt(mm / 10)} cm.`, `${N.fmt(mm / 10)} cm ÷ 100 = ${N.fmt(ans)} m.`, `Answer: <b>${N.fmt(ans)} m</b>.`],
        finalAnswer: `${N.fmt(ans)} m`, skill: 'length',
      };
    }
    if (t === 'm-mm') {
      const m = R.dec(0.2, 9.9, 1);
      const ans = r4(m * 1000);
      return {
        prompt: `Convert ${N.fmt(m)} m to mm.`,
        answer: numAns(ans, 'mm'),
        hint: 'Go m → cm (× 100), then cm → mm (× 10). Altogether that is × 1000.',
        working: [`${N.fmt(m)} m × 100 = ${N.fmt(m * 100)} cm.`, `${N.fmt(m * 100)} cm × 10 = ${N.fmt(ans)} mm.`, `Answer: <b>${N.fmt(ans)} mm</b>.`],
        finalAnswer: `${N.fmt(ans)} mm`, skill: 'length',
      };
    }
    const km = R.dec(0.1, 4.5, 1);
    const ans = r4(km * 100000);
    return {
      prompt: `Convert ${N.fmt(km)} km to cm.`,
      answer: numAns(ans, 'cm'),
      hint: 'Go km → m (× 1000), then m → cm (× 100).',
      working: [`${N.fmt(km)} km × 1000 = ${N.fmt(km * 1000)} m.`, `${N.fmt(km * 1000)} m × 100 = ${N.fmt(ans)} cm.`, `Answer: <b>${N.fmt(ans)} cm</b>.`],
      finalAnswer: `${N.fmt(ans)} cm`, skill: 'length',
    };
  }

  function addMixed(level) {
    const t = R.pick(['m+cm', 'kg+g', 'km+m', 'L+mL', 'cm+mm']);
    const table = {
      'm+cm': { big: 'm', small: 'cm', f: 100, bigV: R.dec(1, 4.9, 1), smallV: R.int(1, 9) * 5 },
      'kg+g': { big: 'kg', small: 'g', f: 1000, bigV: R.dec(1, 5.5, 1), smallV: R.int(1, 19) * 50 },
      'km+m': { big: 'km', small: 'm', f: 1000, bigV: R.dec(1, 9.5, 1), smallV: R.int(1, 19) * 50 },
      'L+mL': { big: 'L', small: 'mL', f: 1000, bigV: R.dec(1, 4.5, 1), smallV: R.int(1, 19) * 50 },
      'cm+mm': { big: 'cm', small: 'mm', f: 10, bigV: R.dec(2, 9.5, 1), smallV: R.int(1, 9) * 3 },
    };
    const c = table[t];
    const inSmall = R.chance(0.5);
    const first = R.chance(0.5);
    const partA = `${N.fmt(c.bigV)} ${c.big}`, partB = `${N.fmt(c.smallV)} ${c.small}`;
    const expr = first ? `${partA} + ${partB}` : `${partB} + ${partA}`;
    const totalSmall = r4(c.bigV * c.f + c.smallV);
    const ans = inSmall ? totalSmall : r4(totalSmall / c.f);
    const unit = inSmall ? c.small : c.big;
    const working = inSmall
      ? [`Change everything to ${c.small}: ${N.fmt(c.bigV)} ${c.big} × ${N.fmt(c.f)} = ${N.fmt(c.bigV * c.f)} ${c.small}.`, `${N.fmt(c.bigV * c.f)} + ${N.fmt(c.smallV)} = ${N.fmt(totalSmall)}.`, `Answer: <b>${N.fmt(ans)} ${c.small}</b>.`]
      : [`Change everything to ${c.big}: ${N.fmt(c.smallV)} ${c.small} ÷ ${N.fmt(c.f)} = ${N.fmt(r4(c.smallV / c.f))} ${c.big}.`, `${N.fmt(c.bigV)} + ${N.fmt(r4(c.smallV / c.f))} = ${N.fmt(ans)}.`, `Answer: <b>${N.fmt(ans)} ${c.big}</b>.`];
    return {
      prompt: `Work out ${expr}. Give your answer in ${unit}.`,
      answer: numAns(ans, unit),
      hint: `Change both amounts to ${unit} first, then add.`,
      working, finalAnswer: `${N.fmt(ans)} ${unit}`, skill: 'mixed',
    };
  }

  function word(level) {
    const t = level === 1 ? R.pick(['shop1', 'run1', 'tank1', 'drink1', 'jugWord'])
      : level === 2 ? R.pick(['shop2', 'run2', 'tank2', 'drink2', 'truck', 'jugWord', 'scalesWord', 'lengths2'])
      : R.pick(['shop3', 'run3', 'tank3', 'paddock', 'juice', 'shop3', 'scalesWord', 'thermoWord', 'recipe3', 'packs3']);
    const bag = R.pick(['apples', 'potatoes', 'carrots', 'kumara', 'rice', 'flour', 'kiwifruit']);
    const name = R.pick(['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Sophie']);
    switch (t) {
      case 'lengths2': {
        const cm = R.int(20, 90), m = R.int(2, 9), mm = R.int(2, 9) * 10;
        const totalCm = r4(cm + m * 100 + mm / 10);
        return {
          prompt: `${name} tapes three pieces of ribbon end to end for the school gala: ${m} m, ${cm} cm and ${mm} mm. How long is the ribbon altogether, in centimetres?`,
          answer: numAns(totalCm, 'cm'),
          hint: 'Change every length to centimetres first: 1 m = 100 cm, and 10 mm = 1 cm. Then add.',
          working: [
            `${m} m = ${m} × 100 = ${N.fmt(m * 100)} cm.`,
            `${mm} mm = ${mm} ÷ 10 = ${N.fmt(mm / 10)} cm.`,
            `${N.fmt(m * 100)} + ${cm} + ${N.fmt(mm / 10)} = ${N.fmt(totalCm)}.`,
            `<b>${N.fmt(totalCm)} cm</b>.`,
          ],
          finalAnswer: `${N.fmt(totalCm)} cm`,
        };
      }
      case 'recipe3': {
        const per = R.pick([150, 200, 250, 120, 180]), batches = R.int(4, 12);
        const g = per * batches, kg = r4(g / 1000);
        const food = R.pick(['Anzac biscuits', 'muffins', 'fudge', 'gingerbread']);
        return {
          prompt: `A recipe for one batch of ${food} needs ${per} g of flour. The school gala needs ${batches} batches. How many kilograms of flour is that?`,
          answer: numAns(kg, 'kg'),
          hint: 'Find the total grams first (multiply), then change grams to kilograms by dividing by 1000.',
          working: [
            `Total flour: ${per} × ${batches} = ${N.fmt(g)} g.`,
            `1000 g = 1 kg, so divide by 1000: ${N.fmt(g)} ÷ 1000 = ${N.fmt(kg)}.`,
            `<b>${N.fmt(kg)} kg</b> of flour.`,
          ],
          finalAnswer: `${N.fmt(kg)} kg`,
        };
      }
      case 'packs3': {
        const gA = R.pick([500, 750, 250, 400]), gB = R.pick([1500, 2000, 1200, 800]);
        if (gA === gB) return word(3);
        const perKgA = R.pick([4, 5, 6, 8, 10]);
        let perKgB = R.pick([4, 5, 6, 8, 10, 12]);
        if (perKgB === perKgA) perKgB = perKgA + 2;
        const priceA = r4(perKgA * gA / 1000), priceB = r4(perKgB * gB / 1000);
        const cheaper = perKgA < perKgB ? 'Pack A' : 'Pack B';
        const choices = ['Pack A', 'Pack B'];
        return {
          prompt: `At the supermarket, Pack A holds ${gA} g of ${bag} for $${priceA.toFixed(2)} and Pack B holds ${gB} g for $${priceB.toFixed(2)}. Which pack is better value per kilogram?`,
          answer: { type: 'choice', value: choices.indexOf(cheaper), choices },
          hint: 'Change each pack to kilograms first (÷ 1000), then work out the price for 1 kg of each: price ÷ kilograms.',
          working: [
            `Pack A: ${gA} g = ${N.fmt(gA / 1000)} kg. Price per kg: ${priceA.toFixed(2)} ÷ ${N.fmt(gA / 1000)} = $${N.fmt(perKgA)}.`,
            `Pack B: ${gB} g = ${N.fmt(gB / 1000)} kg. Price per kg: ${priceB.toFixed(2)} ÷ ${N.fmt(gB / 1000)} = $${N.fmt(perKgB)}.`,
            `$${N.fmt(Math.min(perKgA, perKgB))} per kg is cheaper than $${N.fmt(Math.max(perKgA, perKgB))} per kg.`,
            `<b>${cheaper}</b> is better value.`,
          ],
          finalAnswer: cheaper,
        };
      }
      case 'jugWord': {
        const cfg = level === 1 ? { max: 1000, step: 100, every: 2 } : { max: 2000, step: 100, every: 5 };
        const band = cfg.step * cfg.every;
        const lo = band * R.int(0, cfg.max / band - 2);
        const value = lo + cfg.step * R.int(1, cfg.every - 1);
        const need = value + cfg.step * R.int(1, cfg.every);
        return {
          prompt: `${name} is making soup. The recipe needs ${need} mL of stock, and the jug already has this much in it. How many more millilitres are needed?`,
          visual: jugSvg(cfg.max, cfg.step, cfg.every, value, 'millilitres'),
          answer: numAns(need - value, 'mL'),
          hint: 'Read the jug first (work out what one little mark is worth), then take that away from what the recipe needs.',
          working: scaleWorking(lo, lo + band, cfg.every, cfg.step, value, 'mL')
            .concat([`Still needed: ${need} − ${value} = ${need - value}.`, `<b>${need - value} mL</b> more.`]),
          finalAnswer: `${need - value} mL`, skill: 'scale',
        };
      }
      case 'scalesWord': {
        const cfg = level === 3 ? { max: 1000, step: 25, every: 4 } : { max: 2000, step: 100, every: 5 };
        const band = cfg.step * cfg.every;
        const lo = band * R.int(0, cfg.max / band - 1);
        const value = lo + cfg.step * R.int(1, cfg.every - 1);
        const inKg = R.chance(0.4);
        const ans = inKg ? r4(value / 1000) : value;
        return {
          prompt: `${name} is weighing ${bag} on the kitchen scales. Not every mark is numbered. What is the mass, in ${inKg ? 'kilograms' : 'grams'}?`,
          visual: dialSvg(cfg.max, cfg.step, cfg.every, value, 'grams'),
          answer: numAns(ans, inKg ? 'kg' : 'g'),
          hint: 'Find two numbers next to each other, count the little gaps between them, and work out what one gap is worth.',
          working: scaleWorking(lo, lo + band, cfg.every, cfg.step, value, 'g')
            .concat(inKg ? [`In kilograms: ${value} ÷ 1000 = <b>${sgn(ans)} kg</b>.`] : []),
          finalAnswer: `${sgn(ans)} ${inKg ? 'kg' : 'g'}`, skill: 'scale',
        };
      }
      case 'thermoWord': {
        const cfg = { min: -20, max: 40, step: 5, every: 4 }, band = cfg.step * cfg.every;
        const lo = cfg.min + band * R.int(0, (cfg.max - cfg.min) / band - 1);
        const value = lo + cfg.step * R.int(1, cfg.every - 1);
        const rise = R.int(3, 12);
        return {
          prompt: `At dawn the thermometer outside ${name}'s house showed this temperature. By midday it had risen ${rise}°C. What was the midday temperature?`,
          visual: thermoSvg(cfg.min, cfg.max, cfg.step, cfg.every, value),
          answer: numAns(value + rise, '°C'),
          hint: 'Read the thermometer first (what is one little mark worth?), then add the rise.',
          working: scaleWorking(lo, lo + band, cfg.every, cfg.step, value, '°C')
            .concat([`Midday: ${sgn(value)} + ${rise} = ${sgn(value + rise)}.`, `<b>${sgn(value + rise)}°C</b>.`]),
          finalAnswer: `${sgn(value + rise)}°C`, skill: 'scale',
        };
      }
      case 'shop1': {
        const kg = R.int(2, 9);
        return {
          prompt: `A bag of ${bag} weighs ${kg} kg. How many grams is that?`,
          answer: numAns(kg * 1000, 'g'),
          hint: '1 kg = 1000 g.',
          working: [`1 kg = 1000 g.`, `${kg} × 1000 = ${N.fmt(kg * 1000)}.`, `The bag weighs <b>${N.fmt(kg * 1000)} g</b>.`],
          finalAnswer: `${N.fmt(kg * 1000)} g`,
        };
      }
      case 'shop2': {
        const g = R.int(2, 19) * 50 + R.int(0, 1) * 25;
        const ans = r4(g / 1000);
        return {
          prompt: `At the supermarket ${name} buys ${g} g of ${bag}. Write this weight in kilograms.`,
          answer: numAns(ans, 'kg'),
          hint: 'Grams to kilograms: divide by 1000.',
          working: [`1000 g = 1 kg, so divide by 1000.`, `${g} ÷ 1000 = ${N.fmt(ans)}.`, `That is <b>${N.fmt(ans)} kg</b>.`],
          finalAnswer: `${N.fmt(ans)} kg`,
        };
      }
      case 'shop3': {
        const kg = R.dec(1.2, 3.5, 1), g = R.int(3, 17) * 50;
        const total = r4(kg * 1000 + g);
        const inKg = R.chance(0.5);
        const ans = inKg ? r4(total / 1000) : total;
        return {
          prompt: `${name} buys ${N.fmt(kg)} kg of ${bag} and ${g} g of cheese. What is the total weight in ${inKg ? 'kilograms' : 'grams'}?`,
          answer: numAns(ans, inKg ? 'kg' : 'g'),
          hint: `Change both weights to ${inKg ? 'kg' : 'g'} first, then add.`,
          working: [`${N.fmt(kg)} kg = ${N.fmt(kg * 1000)} g.`, `${N.fmt(kg * 1000)} + ${g} = ${N.fmt(total)} g.`].concat(inKg ? [`${N.fmt(total)} ÷ 1000 = ${N.fmt(ans)} kg.`] : []).concat([`Total: <b>${N.fmt(ans)} ${inKg ? 'kg' : 'g'}</b>.`]),
          finalAnswer: `${N.fmt(ans)} ${inKg ? 'kg' : 'g'}`,
        };
      }
      case 'run1': {
        const km = R.int(2, 12);
        return {
          prompt: `${name} runs ${km} km around the park. How many metres is that?`,
          answer: numAns(km * 1000, 'm'),
          hint: '1 km = 1000 m.',
          working: [`1 km = 1000 m.`, `${km} × 1000 = ${N.fmt(km * 1000)}.`, `<b>${N.fmt(km * 1000)} m</b>.`],
          finalAnswer: `${N.fmt(km * 1000)} m`,
        };
      }
      case 'run2': {
        const laps = R.int(3, 9), lap = R.pick([400, 250, 500, 200]);
        const m = laps * lap, ans = r4(m / 1000);
        return {
          prompt: `The school running track is ${lap} m long. ${name} runs ${laps} laps. How far is that in kilometres?`,
          answer: numAns(ans, 'km'),
          hint: 'Find the total metres first, then divide by 1000.',
          working: [`${laps} × ${lap} = ${N.fmt(m)} m.`, `${N.fmt(m)} ÷ 1000 = ${N.fmt(ans)} km.`, `<b>${N.fmt(ans)} km</b>.`],
          finalAnswer: `${N.fmt(ans)} km`,
        };
      }
      case 'run3': {
        const a = R.dec(1.2, 4.8, 1), b = R.int(3, 17) * 50, c = R.dec(0.5, 2.5, 1);
        const total = r4(a * 1000 + b + c * 1000);
        const ans = r4(total / 1000);
        return {
          prompt: `On a tramp, ${name} walks ${N.fmt(a)} km to the river, ${b} m across the bridge and then ${N.fmt(c)} km to the hut. How far does ${name} walk altogether, in km?`,
          answer: numAns(ans, 'km'),
          hint: 'Change the metres to kilometres (÷ 1000), then add the three parts.',
          working: [`${b} m = ${N.fmt(b / 1000)} km.`, `${N.fmt(a)} + ${N.fmt(b / 1000)} + ${N.fmt(c)} = ${N.fmt(ans)}.`, `Total: <b>${N.fmt(ans)} km</b>.`],
          finalAnswer: `${N.fmt(ans)} km`,
        };
      }
      case 'tank1': {
        const L = R.int(2, 9);
        return {
          prompt: `A bucket holds ${L} L of water. How many millilitres is that?`,
          answer: numAns(L * 1000, 'mL'),
          hint: '1 L = 1000 mL.',
          working: [`1 L = 1000 mL.`, `${L} × 1000 = ${N.fmt(L * 1000)}.`, `<b>${N.fmt(L * 1000)} mL</b>.`],
          finalAnswer: `${N.fmt(L * 1000)} mL`,
        };
      }
      case 'tank2': {
        const mL = R.int(2, 9) * 500 + R.pick([0, 250, 0]);
        const ans = r4(mL / 1000);
        return {
          prompt: `A rainwater tank has ${N.fmt(mL)} mL of water in it. How many litres is that?`,
          answer: numAns(ans, 'L'),
          hint: 'Millilitres to litres: divide by 1000.',
          working: [`1000 mL = 1 L.`, `${N.fmt(mL)} ÷ 1000 = ${N.fmt(ans)}.`, `<b>${N.fmt(ans)} L</b>.`],
          finalAnswer: `${N.fmt(ans)} L`,
        };
      }
      case 'tank3': {
        const tankL = R.pick([2000, 2500, 3000, 4000, 5000]), litre = R.pick([250, 500, 750, 1250, 1500]);
        const per = R.pick([250, 500, 750]);
        const left = tankL - litre;
        const bottles = Math.floor(left * 1000 / per);
        const cm3 = R.pick([1500, 2500, 4500, 12000, 750]);
        if (R.chance(0.5)) {
          return {
            prompt: `A water tank holds ${N.fmt(tankL)} L. ${N.fmt(litre)} L is used to wash the car. How many ${per} mL bottles could be filled from the water that is left?`,
            answer: numAns(bottles, 'bottles'),
            hint: 'Work out the litres left, change to mL (× 1000), then divide by the bottle size.',
            working: [`${N.fmt(tankL)} − ${N.fmt(litre)} = ${N.fmt(left)} L left.`, `${N.fmt(left)} L = ${N.fmt(left * 1000)} mL.`, `${N.fmt(left * 1000)} ÷ ${per} = ${N.fmt(bottles)}.`, `<b>${N.fmt(bottles)} bottles</b>.`],
            finalAnswer: `${N.fmt(bottles)} bottles`,
          };
        }
        return {
          prompt: `A fish tank has a volume of ${N.fmt(cm3)} cm³. How many litres of water does it hold when full? (1 cm³ = 1 mL)`,
          answer: numAns(r4(cm3 / 1000), 'L'),
          hint: '1 cm³ = 1 mL, and 1000 mL = 1 L.',
          working: [`${N.fmt(cm3)} cm³ = ${N.fmt(cm3)} mL.`, `${N.fmt(cm3)} ÷ 1000 = ${N.fmt(cm3 / 1000)} L.`, `<b>${N.fmt(cm3 / 1000)} L</b>.`],
          finalAnswer: `${N.fmt(cm3 / 1000)} L`,
        };
      }
      case 'drink1': {
        const mL = R.pick([250, 500, 750, 1500, 2000]);
        const n = R.int(2, 6);
        const total = mL * n, ans = r4(total / 1000);
        return {
          prompt: `A juice bottle holds ${mL} mL. How many litres are in ${n} bottles?`,
          answer: numAns(ans, 'L'),
          hint: 'Find the total mL first, then divide by 1000.',
          working: [`${n} × ${mL} = ${N.fmt(total)} mL.`, `${N.fmt(total)} ÷ 1000 = ${N.fmt(ans)} L.`, `<b>${N.fmt(ans)} L</b>.`],
          finalAnswer: `${N.fmt(ans)} L`,
        };
      }
      case 'drink2': {
        const L = R.dec(1.2, 3, 1), cup = R.pick([200, 250, 300]);
        const totalmL = r4(L * 1000);
        const cups = Math.floor(totalmL / cup);
        return {
          prompt: `A jug holds ${N.fmt(L)} L of lemonade. How many full ${cup} mL cups can be poured from it?`,
          answer: numAns(cups, 'cups'),
          hint: 'Change the litres to mL first (× 1000), then divide by the cup size. Only count full cups.',
          working: [`${N.fmt(L)} L = ${N.fmt(totalmL)} mL.`, `${N.fmt(totalmL)} ÷ ${cup} = ${N.fmt(r4(totalmL / cup))}.`, `Only full cups count: <b>${cups} cups</b>.`],
          finalAnswer: `${cups} cups`,
        };
      }
      case 'truck': {
        const kg = R.int(12, 45) * 100;
        const ans = r4(kg / 1000);
        return {
          prompt: `A truck carries ${N.fmt(kg)} kg of gravel. Write this in tonnes.`,
          answer: numAns(ans, 't'),
          hint: '1 tonne = 1000 kg.',
          working: [`1 t = 1000 kg, so divide by 1000.`, `${N.fmt(kg)} ÷ 1000 = ${N.fmt(ans)}.`, `<b>${N.fmt(ans)} t</b>.`],
          finalAnswer: `${N.fmt(ans)} t`,
        };
      }
      case 'paddock': {
        const ha = R.dec(0.5, 6, 1);
        const toM2 = R.chance(0.5);
        const m2 = r4(ha * 10000);
        if (toM2) {
          return {
            prompt: `A sheep paddock has an area of ${N.fmt(ha)} ha. What is its area in m²? (1 ha = 10 000 m²)`,
            answer: numAns(m2, 'm²'),
            hint: 'Hectares to square metres: multiply by 10 000.',
            working: [`1 ha = 10 000 m².`, `${N.fmt(ha)} × 10 000 = ${N.fmt(m2)}.`, `<b>${N.fmt(m2)} m²</b>.`],
            finalAnswer: `${N.fmt(m2)} m²`,
          };
        }
        return {
          prompt: `A rugby field has an area of ${N.fmt(m2)} m². What is its area in hectares? (1 ha = 10 000 m²)`,
          answer: numAns(ha, 'ha'),
          hint: 'Square metres to hectares: divide by 10 000.',
          working: [`1 ha = 10 000 m².`, `${N.fmt(m2)} ÷ 10 000 = ${N.fmt(ha)}.`, `<b>${N.fmt(ha)} ha</b>.`],
          finalAnswer: `${N.fmt(ha)} ha`,
        };
      }
      default: { // juice: capacity from cm³
        const l = R.int(5, 12), w = R.int(4, 10), h = R.int(5, 15);
        const cm3 = l * w * h;
        return {
          prompt: `A juice carton is a box ${l} cm by ${w} cm by ${h} cm, so its volume is ${N.fmt(cm3)} cm³. How many millilitres of juice does it hold?`,
          answer: numAns(cm3, 'mL'),
          hint: '1 cm³ holds exactly 1 mL.',
          working: [`1 cm³ = 1 mL.`, `So ${N.fmt(cm3)} cm³ = <b>${N.fmt(cm3)} mL</b>.`],
          finalAnswer: `${N.fmt(cm3)} mL`,
        };
      }
    }
  }

  HL.registerTopic({
    id: 'units', subject: 'maths', strand: 'measurement', order: 1,
    name: 'Metric units', short: 'Units',
    blurb: 'Changing between mm, cm, m, km, grams, kilograms, millilitres and litres.',
    example: '3.2 km = 3200 m &nbsp;·&nbsp; 450 g = 0.45 kg',
    animal: 'dog',
    learn: (() => {
      const INK = '#4A3B48', BLUE = '#2A6FA5', ROSE = '#E0568C', GREEN = '#2FA97A';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      const arrows = (id) => `<defs><marker id="${id}R" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${BLUE}"/></marker><marker id="${id}L" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${ROSE}"/></marker></defs>`;
      // a unit box (44 wide, 30 tall)
      const box = (x, y, label, fill) => `<rect x="${x}" y="${y}" width="44" height="30" rx="7" fill="${fill}" stroke="${INK}" stroke-width="2"/><text x="${x + 22}" y="${y + 20}" text-anchor="middle" fill="${INK}" font-size="15">${label}</text>`;
      // × arrow (right, above) and ÷ arrow (left, below) between the boxes starting at x1 and x2
      const link = (x1, x2, y, f, id) => { const a = x1 + 48, b = x2 - 4, cx = (a + b) / 2; return `<line x1="${a}" y1="${y - 6}" x2="${b - 8}" y2="${y - 6}" stroke="${BLUE}" stroke-width="2.5" marker-end="url(#${id}R)"/><text x="${cx}" y="${y - 12}" text-anchor="middle" fill="${BLUE}">× ${f}</text><line x1="${b}" y1="${y + 36}" x2="${a + 8}" y2="${y + 36}" stroke="${ROSE}" stroke-width="2.5" marker-end="url(#${id}L)"/><text x="${cx}" y="${y + 54}" text-anchor="middle" fill="${ROSE}">÷ ${f}</text>`; };
      const row = (y, units, fill, factors, xs, id) => units.map((u, i) => box(xs[i], y, u, fill)).join('') + factors.map((f, i) => link(xs[i], xs[i + 1], y, f, id)).join('');
      // "decimal point hops": big number with small arcs showing the point moving `n` places right (dir 1) or left (dir −1)
      const hops = (x, y, digits, n, dir, colour) => {
        const w = 13, dotW = 6; // approx widths of a 20px bold digit and of the decimal point
        const dot = digits.indexOf('.');
        const start = x + dot * w + dotW / 2; // x of the decimal point
        return `<text x="${x}" y="${y}" fill="${INK}" font-size="20">${digits}</text>` + Array.from({ length: n }, (_, i) => { const a = start + dir * i * w, b = a + dir * w; return `<path d="M${a} ${y + 5} q${(b - a) / 2} 12 ${b - a} 0" stroke="${colour}" stroke-width="2.5" fill="none"/><circle cx="${b}" cy="${y + 5}" r="2.5" fill="${colour}"/>`; }).join('');
      };
      return {
      what: '<p>Metric units come in families. <b>Length</b>: mm, cm, m, km. <b>Mass</b>: g, kg, t. <b>Capacity</b>: mL, L. To change units you only ever <b>multiply or divide by 10, 100 or 1000</b>, which just moves the decimal point.</p><p>Big unit → small unit: the <b>number gets bigger</b> (multiply). Small unit → big unit: the <b>number gets smaller</b> (divide).</p>',
      visual: SVG(360, 220, `${arrows('un')}
        <text x="8" y="22" fill="${INK}">Length</text>
        ${row(52, ['km', 'm', 'cm', 'mm'], '#FFC79A', ['1000', '100', '10'], [8, 108, 208, 308], 'un')}
        <text x="8" y="122" fill="${BLUE}">→ smaller unit: ×</text><text x="352" y="122" text-anchor="end" fill="${ROSE}">← bigger unit: ÷</text>
        <text x="20" y="140" fill="${INK}">Mass</text><text x="200" y="140" fill="${INK}">Capacity</text>
        ${row(164, ['kg', 'g'], '#A6E3B8', ['1000'], [20, 120], 'un')}
        ${row(164, ['L', 'mL'], '#A9D8F5', ['1000'], [200, 300], 'un')}`),
      facts: [
        '<b>1 cm = 10 mm</b> &nbsp; <b>1 m = 100 cm</b> &nbsp; <b>1 km = 1000 m</b>',
        '<b>1 kg = 1000 g</b> &nbsp; <b>1 t = 1000 kg</b>',
        '<b>1 L = 1000 mL</b> &nbsp; and <b>1 cm³ = 1 mL</b>',
        'Big unit → small unit: <b>multiply</b> (number gets bigger)',
        'Small unit → big unit: <b>divide</b> (number gets smaller)',
        'Area units are squared: <b>1 m² = 10 000 cm²</b>',
        'Reading a scale: work out what <b>ONE little mark</b> is worth first',
        'One mark = <b>(the gap between two numbers) ÷ (how many little gaps)</b>',
        'Sensible units: <b>mm</b> tiny · <b>cm</b> hand-sized · <b>m</b> room-sized · <b>km</b> journeys',
        'Things to compare with: a <b>1 kg</b> bag of sugar · a <b>1 L</b> milk bottle · a <b>1 m</b> ruler',
      ],
      steps: [
        'Say the link: "<b>1 km = 1000 m</b>", "<b>1 m = 100 cm</b>", "<b>1 cm = 10 mm</b>", "<b>1 kg = 1000 g</b>", "<b>1 L = 1000 mL</b>".',
        'Ask: "Am I going to a <b>smaller</b> unit? Then I need <b>more</b> of them → <b>multiply</b>." Or "a <b>bigger</b> unit? Then <b>fewer</b> → <b>divide</b>."',
        'Multiply or divide by 10, 100 or 1000 by <b>hopping the decimal point</b> one place per zero (right for ×, left for ÷).',
        'Check: "Did my number get bigger for a smaller unit?" If not, I went the wrong way.',
        '<b>Area units are squared</b>: 1 m² = 100 × 100 = <b>10 000 cm²</b>, and 1 ha = 10 000 m².',
        '<b>Reading a scale</b> (ruler, jug, scales, thermometer): find <b>two numbers next to each other</b>, count the <b>little gaps</b> between them, then divide the difference by that many. That is what <b>one mark</b> is worth. Now start at the number below the pointer and count on.',
        '<b>Choosing a unit</b>: picture the real thing and ask "would the number come out <b>sensible</b>, or silly-big / silly-small?" A door is 2 m, not 2000 mm and not 0.002 km.',
        '<b>Estimating</b>: compare with something you know — your own height (about 1.5 m), a 1 kg bag of sugar, a 1 L milk bottle, a 1 m ruler.',
      ],
      examples: [
        { q: '3.2 km in metres', working: ['<b>Picture:</b> a ruler. Lots of tiny marks fit inside one big one — a <b>smaller unit</b> always needs a <b>bigger number</b>.', '1. Which unit is bigger, km or m? km. So going km → m is going to a <b>smaller</b> unit.', '2. Smaller unit → more of them → I <b>multiply</b>.', '3. By how much? 1 km = 1000 m, so × 1000 (3 zeros → hop the point 3 places right).', '3.2 × 1000 = 3200'], a: '3200 m',
          visual: SVG(360, 92, `${arrows('u1')}<text x="12" y="34" fill="${INK}" font-size="20">3.2 km</text><line x1="100" y1="27" x2="176" y2="27" stroke="${BLUE}" stroke-width="2.5" marker-end="url(#u1R)"/><text x="140" y="16" text-anchor="middle" fill="${BLUE}">× 1000</text><text x="188" y="34" fill="${GREEN}" font-size="20">3200 m</text>${hops(12, 68, '3.200', 3, 1, BLUE)}<text x="112" y="68" fill="${BLUE}">3 hops right →</text><text x="230" y="68" fill="${GREEN}" font-size="20">3200.</text>`) },
        { q: '450 g in kilograms', working: ['<b>Picture:</b> the ruler idea again, on the kitchen scales: 1000 tiny grams make one kilogram.', '1. Which unit is bigger, g or kg? kg. So g → kg is going to a <b>bigger</b> unit.', '2. Bigger unit → fewer of them → I <b>divide</b>.', '3. By how much? 1 kg = 1000 g, so ÷ 1000 (hop the point 3 places left).', '450 ÷ 1000 = 0.45'], a: '0.45 kg',
          visual: SVG(360, 92, `${arrows('u2')}<text x="12" y="34" fill="${INK}" font-size="20">450 g</text><line x1="160" y1="27" x2="92" y2="27" stroke="${ROSE}" stroke-width="2.5" marker-end="url(#u2L)"/><text x="126" y="16" text-anchor="middle" fill="${ROSE}">÷ 1000</text><text x="172" y="34" fill="${GREEN}" font-size="20">0.45 kg</text>${hops(12, 68, '450.', 3, -1, ROSE)}<text x="70" y="68" fill="${ROSE}">← 3 hops left</text><text x="180" y="68" fill="${GREEN}" font-size="20">0.450 = 0.45</text>`) },
        { q: '7.5 cm in millimetres', working: ['<b>Picture:</b> the ruler: 10 tiny mm marks inside every cm.', '1. Which is bigger, cm or mm? cm. So cm → mm is a <b>smaller</b> unit → <b>multiply</b>.', '2. By how much? 1 cm = 10 mm, so × 10 (one hop right).', '7.5 × 10 = 75'], a: '75 mm' },
        { q: '1.2 m + 35 cm &nbsp;(answer in cm)', working: ['<b>Picture:</b> the ruler: I cannot add metres to centimetres — they are different-sized marks.', '1. Are the units the same? <b>No</b>, so I change one first. The answer wants cm, so 1.2 m → cm.', '2. m → cm is a smaller unit → multiply: 1 m = 100 cm, so 1.2 × 100 = 120 cm.', '3. Now both are cm: 120 + 35.', '120 + 35 = 155'], a: '155 cm' },
        { q: '2.5 m² in cm²', working: ['<b>Picture:</b> a 1 m square tile on the floor. Each side is 100 cm, so it is 100 rows of 100 little cm squares.', '1. Is this an <b>area</b> unit (²)? Yes! So the factor is <b>squared</b>: 100 × 100 = 10 000, not 100.', '2. m² → cm² is a smaller unit → multiply by 10 000.', '2.5 × 10 000 = 25 000'], a: '25 000 cm²',
          visual: SVG(360, 150, `<rect x="24" y="30" width="100" height="100" fill="#FFC79A" stroke="${INK}" stroke-width="2"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${34 + i * 10}" y1="30" x2="${34 + i * 10}" y2="130" stroke="${INK}" stroke-width=".6" opacity=".5"/><line x1="24" y1="${40 + i * 10}" x2="124" y2="${40 + i * 10}" stroke="${INK}" stroke-width=".6" opacity=".5"/>`).join('')}<text x="74" y="20" text-anchor="middle" fill="${BLUE}">1 m = 100 cm</text><text x="74" y="146" text-anchor="middle" fill="${INK}">1 m²</text><text x="132" y="84" fill="${BLUE}">100 cm</text><text x="200" y="50" fill="${INK}">1 m² = 100 × 100</text><text x="200" y="74" fill="${GREEN}">= 10 000 cm²</text><text x="200" y="110" fill="${INK}">2.5 × 10 000</text><text x="200" y="134" fill="${GREEN}">= 25 000 cm²</text>`) },
        { q: 'A 2 L bottle of juice is poured into 250 mL cups for the netball team. How many cups can be filled?', working: ['<b>Picture:</b> a measuring jug: the 2 L bottle fills the jug to the top; each cup takes 250 mL off it.', '1. Are the units the same? <b>No</b> (L and mL). Change the litres to mL.', '2. L → mL is a smaller unit → multiply: 2 × 1000 = 2000 mL.', '3. How many 250s fit in 2000? 2000 ÷ 250.', '2000 ÷ 250 = 8'], a: '8 cups',
          visual: SVG(360, 84, `<text x="180" y="18" text-anchor="middle" fill="${INK}">2 L = 2000 mL</text>${Array.from({ length: 8 }, (_, i) => `<rect x="${20 + i * 40}" y="28" width="40" height="30" fill="${i % 2 ? '#A9D8F5' : '#FFC79A'}" stroke="${INK}" stroke-width="2"/><text x="${40 + i * 40}" y="48" text-anchor="middle" fill="${INK}">250</text>`).join('')}<text x="180" y="78" text-anchor="middle" fill="${GREEN}">2000 ÷ 250 = 8 cups</text>`) },
        { q: 'What length does the arrow show on this ruler?', working: ['<b>Picture:</b> the ruler in your pencil case. Only the big centimetre marks have numbers — the little ones in between do not.', '1. Which two numbers is the arrow between? <b>3</b> and <b>4</b>.', '2. How many little gaps between 3 and 4? <b>10</b>.', '3. So one little mark = 1 ÷ 10 = <b>0.1 cm</b> (which is 1 mm).', '4. The arrow is 7 marks past 3: 3 + 7 × 0.1 = 3.7'], a: '3.7 cm (the same as 37 mm)',
          visual: SVG(360, 128, (() => {
            const x0 = 24, px = 62, yT = 44, yB = 92;
            let t = `<rect x="${x0}" y="${yT}" width="${px * 5}" height="${yB - yT}" fill="#FFE98A" stroke="${INK}" stroke-width="2"/>`;
            for (let i = 0; i <= 50; i++) { const x = x0 + i * px / 10, cm = i % 10 === 0; t += `<line x1="${x}" y1="${yT}" x2="${x}" y2="${yT + (cm ? 22 : i % 5 === 0 ? 14 : 8)}" stroke="${INK}" stroke-width="${cm ? 1.8 : 1}"/>`; if (cm) t += `<text x="${x}" y="${yT + 40}" text-anchor="middle" fill="${INK}">${i / 10}</text>`; }
            const ax = x0 + 3.7 * px;
            return t + `<line x1="${ax}" y1="14" x2="${ax}" y2="${yT - 8}" stroke="${ROSE}" stroke-width="3"/><polygon points="${ax},${yT} ${ax - 7},${yT - 11} ${ax + 7},${yT - 11}" fill="${ROSE}"/><text x="${ax - 12}" y="24" text-anchor="end" fill="${ROSE}">3.7 cm</text><text x="24" y="114" fill="${BLUE}" font-size="12">10 little marks in every cm, so each one is 0.1 cm</text>`;
          })()) },
        { q: 'How much water is in this measuring jug?', working: ['<b>Picture:</b> a measuring jug on the bench. The numbers only go up in 200s, but there are marks in between with no number.', '1. Which two numbers is the water between? <b>600</b> and <b>800</b>.', '2. How many little gaps between them? <b>2</b>.', '3. So one mark = (800 − 600) ÷ 2 = <b>100 mL</b>.', '4. The water is 1 mark past 600: 600 + 100 = 700'], a: '700 mL',
          visual: SVG(360, 200, (() => {
            const xL = 108, xR = 200, yT = 22, yB = 168, Y = (v) => yB - (v / 1000) * (yB - yT);
            let t = `<rect x="${xL}" y="${Y(700)}" width="${xR - xL}" height="${yB - Y(700)}" fill="#A9D8F5"/>`
              + `<path d="M${xL} ${yT} L${xL} ${yB} L${xR} ${yB} L${xR} ${yT}" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M${xR} ${yT} l14 -8" stroke="${INK}" stroke-width="2.5" fill="none"/>`;
            for (let v = 0; v <= 1000; v += 100) { const on = v % 200 === 0; t += `<line x1="${xL}" y1="${Y(v)}" x2="${xL + (on ? 30 : 18)}" y2="${Y(v)}" stroke="${INK}" stroke-width="${on ? 2 : 1.2}"/>`; if (on) t += `<text x="${xL - 8}" y="${Y(v) + 5}" text-anchor="end" fill="${INK}">${v}</text>`; }
            return t + `<line x1="${xL}" y1="${Y(700)}" x2="${xR}" y2="${Y(700)}" stroke="${ROSE}" stroke-width="3"/>`
              + `<text x="${xR + 8}" y="${Y(700) + 5}" fill="${ROSE}">← 700 mL</text>`
              + `<text x="${xR + 8}" y="${Y(700) - 22}" fill="${BLUE}" font-size="12">800 − 600 = 200</text>`
              + `<text x="${xR + 8}" y="${Y(700) - 6}" fill="${BLUE}" font-size="12">200 ÷ 2 gaps = 100</text>`
              + `<text x="20" y="192" fill="${GREEN}">600 + 100 = 700 mL</text>`;
          })()) },
        { q: 'Which unit would you use for the height of a door — mm, cm, m or km?', working: ['<b>Picture:</b> stand next to a door. It is about as tall as you, plus a bit.', '1. Would <b>mm</b> work? The door would be 2000 mm — a silly big number.', '2. Would <b>km</b> work? 0.002 km — a silly small number.', '3. Which unit gives a nice, sensible number? <b>metres</b>: about 2 m.'], a: 'metres (m)',
          visual: SVG(360, 190, [['mm', 'the thickness of a coin', '#F9A8C9'], ['cm', 'the width of your hand', '#FFC79A'], ['m', 'the height of a door', '#A6E3B8'], ['km', 'the drive to the next town', '#A9D8F5']]
            .map((row, i) => { const y = 26 + i * 38; return `<rect x="20" y="${y}" width="52" height="30" rx="8" fill="${row[2]}" stroke="${INK}" stroke-width="2"/><text x="46" y="${y + 20}" text-anchor="middle" fill="${INK}" font-size="15">${row[0]}</text><text x="84" y="${y + 20}" fill="${INK}">${row[1]}</text>${i === 2 ? `<text x="330" y="${y + 20}" text-anchor="end" fill="${GREEN}" font-size="15">✓</text>` : ''}`; }).join('')
            + `<text x="20" y="182" fill="${BLUE}" font-size="12">Pick the unit that gives a small, sensible number.</text>`) },
      ],
      tips: [
        'Big unit → small unit → <b>bigger number</b>. If your answer got smaller when it should have got bigger, you went the wrong way.',
        'The prefixes tell you the size: <b>milli</b> = thousandth, <b>centi</b> = hundredth, <b>kilo</b> = thousand.',
        'Never add two measurements until they are in the <b>same unit</b>.',
        'Area units: square the factor (m² → cm² is × 10 000, not × 100).',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
