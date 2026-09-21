/* Topic: Powers & square roots — squares, cubes, index notation, square and cube roots, estimating roots */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const sq = (n) => n * n, cube = (n) => n * n * n;
  const rep = (b, e) => Array(e).fill(b).join(' × ');
  const sqrtHtml = (x) => `√${x}`;
  const cbrtHtml = (x) => `<sup>3</sup>√${x}`;
  const SQUARES_TEXT = 'Square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.';

  // ---------- calc pieces ----------
  function square(level) {
    const n = level === 1 ? R.int(2, 10) : R.int(6, 15);
    return {
      prompt: `${N.pow(n, 2)} = ?`,
      answer: { type: 'number', value: sq(n) },
      hint: `${n}² means ${n} × ${n} (not ${n} × 2).`,
      working: [`${n}² = ${n} × ${n}`, `= <b>${sq(n)}</b>`],
      finalAnswer: String(sq(n)), skill: 'squares',
    };
  }
  function cubeQ(level) {
    const n = level === 1 ? R.int(2, 4) : R.int(2, 6);
    return {
      prompt: `${N.pow(n, 3)} = ?`,
      answer: { type: 'number', value: cube(n) },
      hint: `${n}³ means ${n} × ${n} × ${n}. Do it in two steps: ${n} × ${n} first.`,
      working: [`${n}³ = ${n} × ${n} × ${n}`, `${n} × ${n} = ${sq(n)}`, `${sq(n)} × ${n} = <b>${cube(n)}</b>`],
      finalAnswer: String(cube(n)), skill: 'cubes',
    };
  }
  function sqrtQ(level) {
    const n = level === 1 ? R.int(2, 10) : R.int(4, 15);
    return {
      prompt: `${sqrtHtml(sq(n))} = ?`,
      answer: { type: 'number', value: n },
      hint: `Which number times itself makes ${sq(n)}? ${n - 1} × ${n - 1} = ${sq(n - 1)}, so try the next one.`,
      working: [`Square root asks: which number squared gives ${sq(n)}?`, `${n} × ${n} = ${sq(n)}`, `${sqrtHtml(sq(n))} = <b>${n}</b>`],
      finalAnswer: String(n), skill: 'roots',
    };
  }
  function cbrtQ(level) {
    const n = level === 1 ? R.int(2, 3) : R.int(2, 6);
    return {
      prompt: `${cbrtHtml(cube(n))} = ?`,
      answer: { type: 'number', value: n },
      hint: `Which number cubed (n × n × n) makes ${cube(n)}? Try 2, 3, 4, 5, 6.`,
      working: [`Cube root asks: which number cubed gives ${cube(n)}?`, `${n} × ${n} × ${n} = ${cube(n)}`, `${cbrtHtml(cube(n))} = <b>${n}</b>`],
      finalAnswer: String(n), skill: 'roots',
    };
  }
  function indexQ(level) {
    const pairs = level === 1 ? [[2, 3], [2, 4], [3, 3], [10, 2], [10, 3], [5, 2], [4, 2]] : [[2, 5], [2, 6], [3, 4], [4, 3], [5, 3], [10, 4], [2, 7], [3, 5], [6, 3], [10, 5], [7, 2], [2, 8]];
    const [b, e] = R.pick(pairs);
    const v = Math.pow(b, e);
    const steps = []; let run = b;
    for (let i = 2; i <= e; i++) { steps.push(`${run} × ${b} = ${run * b}`); run *= b; }
    return {
      prompt: `${N.pow(b, e)} = ?`,
      answer: { type: 'number', value: v },
      hint: `${b}<sup>${e}</sup> means ${rep(b, e)}. Multiply one step at a time.`,
      working: [`${N.pow(b, e)} = ${rep(b, e)}`].concat(steps).concat([`${N.pow(b, e)} = <b>${N.fmt(v)}</b>`]),
      finalAnswer: N.fmt(v), skill: 'index',
    };
  }
  function asPower(level) {
    const b = R.int(2, level === 1 ? 6 : 12), e = R.int(2, level === 1 ? 4 : 6);
    const correct = N.pow(b, e);
    const opts = new Set([correct]);
    opts.add(N.pow(e, b));
    opts.add(`${b} × ${e}`);
    opts.add(N.pow(b, e + 1));
    if (opts.size < 4) opts.add(N.pow(b, e - 1));
    const choices = R.shuffle([...opts].slice(0, 4));
    return {
      prompt: `Write ${rep(b, e)} as a power (using index notation).`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: `Count how many ${b}s are multiplied together. That count is the little number (the index).`,
      working: [`${b} is multiplied by itself ${e} times.`, `The base is ${b} and the index (power) is ${e}.`, `${rep(b, e)} = <b>${correct}</b>`],
      finalAnswer: correct, skill: 'index',
    };
  }
  function meaning(level) {
    const b = R.int(2, 9), e = R.int(2, level === 1 ? 4 : 6);
    const correct = rep(b, e);
    const opts = new Set([correct, `${b} × ${e}`, rep(e, b), rep(b, e + 1)]);
    const choices = R.shuffle([...opts].slice(0, 4));
    return {
      prompt: `What does ${N.pow(b, e)} mean?`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'The big number is the base. The little number tells you how many times to multiply the base by itself.',
      working: [`Base ${b}, index ${e}: multiply ${b} by itself ${e} times.`, `${N.pow(b, e)} = <b>${correct}</b>`],
      finalAnswer: correct, skill: 'index',
    };
  }
  function estimate(level) {
    const lo = level === 2 ? R.int(2, 9) : R.int(5, 14);
    const x = R.int(sq(lo) + 1, sq(lo + 1) - 1);
    const correct = `${lo} and ${lo + 1}`;
    const opts = new Set([correct, `${lo + 1} and ${lo + 2}`, `${lo - 1} and ${lo}`, `${lo + 2} and ${lo + 3}`]);
    const choices = R.shuffle([...opts]);
    return {
      prompt: `${sqrtHtml(x)} is between which two whole numbers?`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: `Find the square numbers just below and just above ${x}. ${SQUARES_TEXT}`,
      working: [`${sq(lo)} < ${x} < ${sq(lo + 1)}`, `${sqrtHtml(sq(lo))} = ${lo} and ${sqrtHtml(sq(lo + 1))} = ${lo + 1}`, `So ${sqrtHtml(x)} is between <b>${lo} and ${lo + 1}</b>.`],
      finalAnswer: `between ${lo} and ${lo + 1}`, skill: 'estimate',
    };
  }
  // ---------- powers of 10 ----------
  function powerOfTen(level) {
    const kind = R.pick(level === 1 ? ['value', 'value', 'zeros', 'asPower'] : ['value', 'zeros', 'asPower', 'asPower', 'zeros']);
    if (kind === 'value') {
      const e = level === 1 ? R.int(2, 4) : R.int(2, 6);
      const v = Math.pow(10, e);
      return {
        prompt: `${N.pow(10, e)} = ?`,
        answer: { type: 'number', value: v },
        hint: `10<sup>${e}</sup> means ${e} tens multiplied together. Each × 10 adds one zero.`,
        working: [
          `${N.pow(10, e)} = ${rep(10, e)}.`,
          `Every × 10 adds a zero, so the answer is a <b>1 followed by ${e} zeros</b>.`,
          `${N.pow(10, e)} = <b>${N.fmt(v)}</b>.`,
        ],
        finalAnswer: N.fmt(v), skill: 'powers-of-10',
      };
    }
    if (kind === 'zeros') {
      const e = level === 1 ? R.int(2, 5) : level === 2 ? R.int(3, 8) : R.int(6, 12);
      return {
        prompt: `When ${N.pow(10, e)} is written out in full, how many zeros does it have?`,
        answer: { type: 'number', value: e, unit: 'zeros' },
        hint: 'Count the zeros: 10² = 100 has 2 zeros, 10³ = 1000 has 3 zeros. The index tells you.',
        working: [
          '10<sup>2</sup> = 100 (2 zeros), 10<sup>3</sup> = 1000 (3 zeros), 10<sup>4</sup> = 10 000 (4 zeros).',
          `The <b>index is the number of zeros</b>.`,
          `${N.pow(10, e)} has <b>${e} zeros</b>.`,
        ],
        finalAnswer: `${e} zeros`, skill: 'powers-of-10',
      };
    }
    const e = level === 1 ? R.int(2, 4) : R.int(3, 6);
    const v = Math.pow(10, e);
    const correct = N.pow(10, e);
    const choices = R.shuffle([correct, N.pow(10, e + 1), N.pow(10, e - 1), N.pow(e, 10)]);
    return {
      prompt: `Write ${N.fmt(v)} as a power of 10.`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'Count the zeros. That count is the little number (the index).',
      working: [
        `${N.fmt(v)} is a 1 followed by <b>${e} zeros</b>.`,
        'The number of zeros is the index.',
        `${N.fmt(v)} = <b>${correct}</b>.`,
      ],
      finalAnswer: correct, skill: 'powers-of-10',
    };
  }

  function mixed() {
    const t = R.int(0, 7);
    if (t === 0) { // √a + b²
      const a = R.int(2, 12), b = R.int(2, 9);
      const v = a + sq(b);
      return { prompt: `${sqrtHtml(sq(a))} + ${N.pow(b, 2)} = ?`, value: v, working: [`${sqrtHtml(sq(a))} = ${a}`, `${N.pow(b, 2)} = ${sq(b)}`, `${a} + ${sq(b)} = <b>${v}</b>`] };
    }
    if (t === 1) { // a³ × √b
      const a = R.int(2, 4), b = R.int(2, 9);
      const v = cube(a) * b;
      return { prompt: `${N.pow(a, 3)} × ${sqrtHtml(sq(b))} = ?`, value: v, working: [`${N.pow(a, 3)} = ${cube(a)}`, `${sqrtHtml(sq(b))} = ${b}`, `${cube(a)} × ${b} = <b>${v}</b>`] };
    }
    if (t === 2) { // a² − b²
      const b = R.int(2, 9), a = b + R.int(1, 6);
      const v = sq(a) - sq(b);
      return { prompt: `${N.pow(a, 2)} − ${N.pow(b, 2)} = ?`, value: v, working: [`${N.pow(a, 2)} = ${sq(a)}`, `${N.pow(b, 2)} = ${sq(b)}`, `${sq(a)} − ${sq(b)} = <b>${v}</b>`] };
    }
    if (t === 3) { // √(a² + b²) pythagorean triple
      const [a, b, c] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
      return { prompt: `√(${N.pow(a, 2)} + ${N.pow(b, 2)}) = ?`, value: c, working: [`Inside the root first: ${N.pow(a, 2)} = ${sq(a)}, ${N.pow(b, 2)} = ${sq(b)}`, `${sq(a)} + ${sq(b)} = ${sq(c)}`, `${sqrtHtml(sq(c))} = <b>${c}</b>`] };
    }
    if (t === 4) { // √a ÷ b²
      const b = R.int(2, 3), k = R.int(2, 6), a = b * b * k;
      return { prompt: `${sqrtHtml(sq(a))} ÷ ${N.pow(b, 2)} = ?`, value: k, working: [`${sqrtHtml(sq(a))} = ${a}`, `${N.pow(b, 2)} = ${sq(b)}`, `${a} ÷ ${sq(b)} = <b>${k}</b>`] };
    }
    if (t === 5) { // a² + b³
      const a = R.int(2, 12), b = R.int(2, 5);
      const v = sq(a) + cube(b);
      return { prompt: `${N.pow(a, 2)} + ${N.pow(b, 3)} = ?`, value: v, working: [`${N.pow(a, 2)} = ${sq(a)}`, `${N.pow(b, 3)} = ${cube(b)}`, `${sq(a)} + ${cube(b)} = <b>${v}</b>`] };
    }
    if (t === 6) { // (√a)² or √a × √b
      const a = R.int(2, 12), b = R.int(2, 12);
      const v = a * b;
      return { prompt: `${sqrtHtml(sq(a))} × ${sqrtHtml(sq(b))} = ?`, value: v, working: [`${sqrtHtml(sq(a))} = ${a}`, `${sqrtHtml(sq(b))} = ${b}`, `${a} × ${b} = <b>${v}</b>`] };
    }
    const a = R.int(2, 6), b = R.int(2, 6); // a² × b²
    const v = sq(a) * sq(b);
    return { prompt: `${N.pow(a, 2)} × ${N.pow(b, 2)} = ?`, value: v, working: [`${N.pow(a, 2)} = ${sq(a)}`, `${N.pow(b, 2)} = ${sq(b)}`, `${sq(a)} × ${sq(b)} = <b>${v}</b>`] };
  }
  function mixedQ() {
    const m = mixed();
    return {
      prompt: m.prompt,
      answer: { type: 'number', value: m.value },
      hint: 'Work out each power or root on its own first, then do the + − × ÷.',
      working: m.working,
      finalAnswer: String(m.value), skill: 'mixed',
    };
  }
  function compare() {
    const forms = [
      () => { const b = R.int(2, 5), e = R.int(2, 4); return { html: N.pow(b, e), v: Math.pow(b, e) }; },
      () => { const n = R.int(3, 15); return { html: sqrtHtml(sq(n)), v: n }; },
      () => { const n = R.int(2, 6); return { html: N.pow(n, 3), v: cube(n) }; },
      () => { const n = R.int(2, 12); return { html: N.pow(n, 2), v: sq(n) }; },
    ];
    let a, b, guard = 0;
    do { a = R.pick(forms)(); b = R.pick(forms)(); } while (a.v === b.v && guard++ < 20);
    if (a.v === b.v) { a = { html: N.pow(2, 5), v: 32 }; b = { html: N.pow(5, 2), v: 25 }; }
    const choices = [a.html, b.html];
    const idx = a.v > b.v ? 0 : 1;
    return {
      prompt: `Which is <b>bigger</b>: ${a.html} or ${b.html}?`,
      answer: { type: 'choice', value: idx, choices },
      hint: 'Work out the value of each one, then compare.',
      working: [`${a.html} = ${a.v}`, `${b.html} = ${b.v}`, `${Math.max(a.v, b.v)} is bigger, so <b>${choices[idx]}</b> is bigger.`],
      finalAnswer: choices[idx], skill: 'index',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['square', 'square', 'cube', 'sqrt', 'sqrt', 'index', 'asPower', 'meaning', 'pow10']
      : level === 2 ? ['square', 'cube', 'sqrt', 'cbrt', 'index', 'index', 'asPower', 'estimate', 'compare', 'pow10', 'pow10']
        : ['mixed', 'mixed', 'mixed', 'index', 'cbrt', 'estimate', 'compare', 'sqrt', 'pow10', 'pow10'];
    const t = R.pick(pool);
    if (t === 'pow10') return powerOfTen(level);
    if (t === 'square') return square(level);
    if (t === 'cube') return cubeQ(level);
    if (t === 'sqrt') return sqrtQ(level);
    if (t === 'cbrt') return cbrtQ(level);
    if (t === 'index') return indexQ(level);
    if (t === 'asPower') return asPower(level);
    if (t === 'meaning') return meaning(level);
    if (t === 'estimate') return estimate(level);
    if (t === 'compare') return compare();
    return mixedQ();
  }

  // ---------- word problems ----------
  // ---------- word problems (level 1 one step · level 2 typical · level 3 multi-step) ----------
  function areaQ(level) {
    const s = level === 1 ? R.int(2, 10) : R.int(6, 15);
    const thing = R.pick(['garden', 'sandpit', 'vege patch', 'paddock', 'deck']);
    return {
      prompt: `A square ${thing} has sides of ${s} m. What is its area in m²?`,
      answer: { type: 'number', value: sq(s), unit: 'm²' },
      hint: 'Area of a square = side × side = side².',
      working: [`<b>Picture:</b> a grid of 1 m squares, ${s} along and ${s} down.`, `Area = side² = ${N.pow(s, 2)}`, `${s} × ${s} = <b>${sq(s)} m²</b>`],
      finalAnswer: `${sq(s)} m²`, skill: 'squares',
    };
  }
  function sideQ(level) {
    const s = level === 1 ? R.int(2, 10) : R.int(5, 15);
    const thing = R.pick(['rugby training grid', 'square lawn', 'square photo', 'square courtyard', 'square tablecloth']);
    const unit = thing.includes('photo') ? 'cm' : 'm';
    return {
      prompt: `A ${thing} has an area of ${sq(s)} ${unit}². How long is each side?`,
      answer: { type: 'number', value: s, unit },
      hint: `Side = square root of the area. Which number times itself gives ${sq(s)}?`,
      working: [`<b>Picture:</b> undo the squaring — the area is side × side.`, `Side = ${sqrtHtml(sq(s))}`, `${s} × ${s} = ${sq(s)}, so the side is <b>${s} ${unit}</b>.`],
      finalAnswer: `${s} ${unit}`, skill: 'roots',
    };
  }
  function tilesQ(level) {
    const n = level === 1 ? R.int(3, 10) : R.int(6, 15);
    return {
      prompt: `Harper arranges ${sq(n)} square tiles into one big square. How many tiles are along each side?`,
      answer: { type: 'number', value: n, unit: 'tiles' },
      hint: `Rows × rows = ${sq(n)}. Find the square root.`,
      working: [`A square of tiles has the same number in each row: n × n = ${sq(n)}.`, `${sqrtHtml(sq(n))} = <b>${n}</b>, so ${n} tiles along each side.`],
      finalAnswer: `${n} tiles`, skill: 'roots',
    };
  }
  function volumeQ(level) {
    const e = level === 1 ? R.int(2, 4) : R.int(2, 6);
    const thing = R.pick(['dice', 'gift box', 'ice cube', 'wooden block']);
    return {
      prompt: `A cube-shaped ${thing} has edges of ${e} cm. What is its volume in cm³?`,
      answer: { type: 'number', value: cube(e), unit: 'cm³' },
      hint: 'Volume of a cube = edge × edge × edge = edge³.',
      working: [`<b>Picture:</b> layers of Lego — ${sq(e)} cubes in a layer, ${e} layers high.`, `Volume = edge³ = ${N.pow(e, 3)}`, `${e} × ${e} = ${sq(e)}`, `${sq(e)} × ${e} = <b>${cube(e)} cm³</b>`],
      finalAnswer: `${cube(e)} cm³`, skill: 'cubes',
    };
  }
  function rubikQ(level) {
    const n = level === 1 ? 3 : R.pick([3, 4, 5]);
    return {
      prompt: `A puzzle cube is ${n} small cubes long, ${n} wide and ${n} high. How many small cubes is it made of?`,
      answer: { type: 'number', value: cube(n), unit: 'cubes' },
      hint: `${n} × ${n} × ${n} = ${n}³.`,
      working: [`Number of cubes = ${N.pow(n, 3)} = ${n} × ${n} × ${n}`, `= <b>${cube(n)}</b>`],
      finalAnswer: `${cube(n)} cubes`, skill: 'cubes',
    };
  }
  function sugarQ() {
    const e = R.int(3, 6);
    return {
      prompt: `Sugar cubes are 1 cm on each side. How many fit exactly inside a cube-shaped tin with edges of ${e} cm?`,
      answer: { type: 'number', value: cube(e), unit: 'cubes' },
      hint: `${e} along, ${e} across, ${e} up: that is ${e}³.`,
      working: [`Each layer holds ${e} × ${e} = ${sq(e)} cubes.`, `There are ${e} layers: ${sq(e)} × ${e} = <b>${cube(e)}</b>.`],
      finalAnswer: `${cube(e)} cubes`, skill: 'cubes',
    };
  }

  /** LEVEL 1 — one step, small squares and cubes */
  function wordL1() {
    const t = R.pick(['area', 'side', 'tiles', 'volume', 'rubik']);
    if (t === 'area') return areaQ(1);
    if (t === 'side') return sideQ(1);
    if (t === 'tiles') return tilesQ(1);
    if (t === 'volume') return volumeQ(1);
    return rubikQ(1);
  }

  /** LEVEL 2 — bigger numbers, and roots as well as powers */
  function wordL2() {
    const t = R.pick(['area', 'side', 'tiles', 'volume', 'edge', 'rubik', 'sugar']);
    if (t === 'area') return areaQ(2);
    if (t === 'side') return sideQ(2);
    if (t === 'tiles') return tilesQ(2);
    if (t === 'volume') return volumeQ(2);
    if (t === 'rubik') return rubikQ(2);
    if (t === 'sugar') return sugarQ();
    const e = R.int(2, 6);
    return {
      prompt: `A cube-shaped box has a volume of ${cube(e)} cm³. How long is each edge?`,
      answer: { type: 'number', value: e, unit: 'cm' },
      hint: `Edge = cube root of the volume. Which number cubed gives ${cube(e)}?`,
      working: [`<b>Picture:</b> undo the cubing — the volume is edge × edge × edge.`, `Edge = ${cbrtHtml(cube(e))}`, `${e} × ${e} × ${e} = ${cube(e)}, so each edge is <b>${e} cm</b>.`],
      finalAnswer: `${e} cm`, skill: 'roots',
    };
  }

  /** LEVEL 3 — two or three steps: square then cost, root then perimeter, unit changes, comparing */
  function wordL3() {
    const t = R.pick(['deck', 'paddock', 'tank', 'gate', 'compare', 'lawn', 'frame', 'boxes', 'sugar', 'double', 'between']);
    if (t === 'sugar') return sugarQ();
    if (t === 'deck') {
      const s = R.int(4, 12), rate = R.pick([6, 7, 8, 9, 12, 15]);
      const place = R.pick(['deck at the bach', 'wooden patio', 'boat shed floor']);
      const area = sq(s), cost = area * rate;
      return {
        prompt: `A square ${place} has sides of ${s} m. Harper's dad stains it at $${rate} per square metre. How much does the stain cost?`,
        answer: { type: 'number', value: cost, unit: '$' },
        hint: 'Two steps: work out the area first (side²), then multiply the area by the price per square metre.',
        working: [
          `<b>Picture:</b> the deck is a grid of 1 m squares, and each square costs $${rate} to stain.`,
          `1. Area = ${N.pow(s, 2)} = ${s} × ${s} = ${area} m².`,
          `2. Cost = ${area} × $${rate} = $${N.fmt(cost)}.`,
          `The stain costs <b>$${N.fmt(cost)}</b>.`,
        ],
        finalAnswer: `$${N.fmt(cost)}`, skill: 'mixed',
      };
    }
    if (t === 'paddock') {
      const s = R.int(7, 20);
      const place = R.pick(['paddock', 'school garden plot', 'skate ramp base']);
      return {
        prompt: `A square ${place} has an area of ${sq(s)} m². What is the distance all the way around it (its perimeter)?`,
        answer: { type: 'number', value: 4 * s, unit: 'm' },
        hint: 'Two steps: square root the area to get one side, then multiply that side by 4.',
        working: [
          `<b>Picture:</b> a square field — first find one fence line, then walk all four.`,
          `1. Side = ${sqrtHtml(sq(s))} = ${s} m (because ${s} × ${s} = ${sq(s)}).`,
          `2. Perimeter = 4 × ${s} = ${4 * s} m.`,
          `The perimeter is <b>${4 * s} m</b>.`,
        ],
        finalAnswer: `${4 * s} m`, skill: 'mixed',
      };
    }
    if (t === 'tank') {
      const e = R.pick([10, 20, 30, 40]);
      const thing = R.pick(['water tank', 'chilly bin', 'fish tank']);
      const vol = cube(e), litres = vol / 1000;
      return {
        prompt: `A cube-shaped ${thing} has edges of ${e} cm. How many litres does it hold? (1000 cm³ = 1 litre.)`,
        answer: { type: 'number', value: litres, unit: 'L' },
        hint: 'Two steps: find the volume in cm³ with edge³, then divide by 1000 to change cm³ into litres.',
        working: [
          `<b>Picture:</b> layers of centimetre cubes filling the tank.`,
          `1. Volume = ${N.pow(e, 3)} = ${e} × ${e} × ${e} = ${N.fmt(vol)} cm³.`,
          `2. Change to litres: ${N.fmt(vol)} ÷ 1000 = ${litres}.`,
          `The tank holds <b>${litres} L</b>.`,
        ],
        finalAnswer: `${litres} L`, skill: 'mixed',
      };
    }
    if (t === 'gate') {
      const s = R.int(8, 20), gate = R.pick([2, 3, 4]);
      const ans = 4 * s - gate;
      return {
        prompt: `A square paddock has an area of ${sq(s)} m². A gate ${gate} m wide sits in one side. How many metres of fencing are needed for the rest of the boundary?`,
        answer: { type: 'number', value: ans, unit: 'm' },
        hint: 'Three steps: square root the area for one side, times 4 for the whole way round, then take off the gate.',
        working: [
          `<b>Picture:</b> walk the whole boundary, then skip the gap where the gate is.`,
          `1. Side = ${sqrtHtml(sq(s))} = ${s} m.`,
          `2. All the way round = 4 × ${s} = ${4 * s} m.`,
          `3. Take off the gate: ${4 * s} − ${gate} = ${ans} m.`,
          `She needs <b>${ans} m</b> of fencing.`,
        ],
        finalAnswer: `${ans} m`, skill: 'mixed',
      };
    }
    if (t === 'compare') {
      const c = R.int(3, 7), s = R.int(6, 15);
      if (cube(c) === sq(s)) return wordL3();
      const cubeBigger = cube(c) > sq(s);
      const choices = [`${N.pow(c, 3)}`, `${N.pow(s, 2)}`];
      return {
        prompt: `A cube-shaped crate holds ${N.pow(c, 3)} blocks and a square tray holds ${N.pow(s, 2)} tiles. Which number is <b>bigger</b>?`,
        answer: { type: 'choice', value: cubeBigger ? 0 : 1, choices },
        hint: `Work each one out properly: ${c}³ means ${c} × ${c} × ${c}, and ${s}² means ${s} × ${s}. Do not just compare the small numbers.`,
        working: [
          `<b>Picture:</b> a power tells you how many times to multiply, not what to multiply by.`,
          `1. ${N.pow(c, 3)} = ${c} × ${c} × ${c} = ${cube(c)}.`,
          `2. ${N.pow(s, 2)} = ${s} × ${s} = ${sq(s)}.`,
          `3. ${N.fmt(Math.max(cube(c), sq(s)))} is bigger than ${N.fmt(Math.min(cube(c), sq(s)))}.`,
          `So <b>${cubeBigger ? N.pow(c, 3) : N.pow(s, 2)}</b> is bigger.`,
        ],
        finalAnswer: cubeBigger ? `${N.pow(c, 3)} = ${cube(c)}` : `${N.pow(s, 2)} = ${sq(s)}`, skill: 'mixed',
      };
    }
    if (t === 'lawn') {
      const s = R.int(8, 15), p = R.int(2, s - 4);
      const v = sq(s) - sq(p);
      return {
        prompt: `A square lawn has sides of ${s} m. A square pond with sides of ${p} m sits in the middle of it. What area of grass is left, in m²?`,
        answer: { type: 'number', value: v, unit: 'm²' },
        hint: 'Big square minus small square: s² − p².',
        working: [`<b>Picture:</b> the whole lawn as a grid, then cut the pond square out of it.`, `Lawn: ${N.pow(s, 2)} = ${sq(s)} m²`, `Pond: ${N.pow(p, 2)} = ${sq(p)} m²`, `${sq(s)} − ${sq(p)} = <b>${v} m²</b>`],
        finalAnswer: `${v} m²`, skill: 'mixed',
      };
    }
    if (t === 'boxes') {
      const e = R.int(2, 5), total = cube(e) * R.int(2, 6);
      return {
        prompt: `A cube-shaped box has edges of ${e} cm. Harper has ${total} centimetre cubes to pack. How many boxes does she need?`,
        answer: { type: 'number', value: total / cube(e), unit: 'boxes' },
        hint: `One box holds ${e}³ cubes. Then divide.`,
        working: [`One box holds ${N.pow(e, 3)} = ${cube(e)} cubes.`, `${total} ÷ ${cube(e)} = <b>${total / cube(e)}</b> boxes.`],
        finalAnswer: `${total / cube(e)} boxes`, skill: 'mixed',
      };
    }
    if (t === 'double') {
      const s = R.int(3, 12);
      const bigger = sq(2 * s) - sq(s);
      return {
        prompt: `A square vege patch has sides of ${s} m. Harper doubles the length of every side. How many m² <b>bigger</b> is the new patch?`,
        answer: { type: 'number', value: bigger, unit: 'm²' },
        hint: 'Work out both areas: the old side², then the new side² (double the side). Then subtract.',
        working: [
          `<b>Picture:</b> doubling the side does <b>not</b> just double the area — the grid grows both ways.`,
          `1. Old area = ${N.pow(s, 2)} = ${sq(s)} m².`,
          `2. New side = 2 × ${s} = ${2 * s} m, so new area = ${N.pow(2 * s, 2)} = ${sq(2 * s)} m².`,
          `3. Difference = ${sq(2 * s)} − ${sq(s)} = ${bigger} m².`,
          `The new patch is <b>${bigger} m²</b> bigger (4 times the area, not 2).`,
        ],
        finalAnswer: `${bigger} m²`, skill: 'mixed',
      };
    }
    if (t === 'between') {
      const n = R.int(5, 14);
      const a = R.int(sq(n) + 1, sq(n + 1) - 1);
      const right = `${n} and ${n + 1}`;
      const choices = R.shuffle([right, `${n - 1} and ${n}`, `${n + 1} and ${n + 2}`, `${n} and ${n + 2}`]);
      return {
        prompt: `A square section of land has an area of ${a} m². The side length is between which two whole numbers of metres?`,
        answer: { type: 'choice', value: choices.indexOf(right), choices },
        hint: `${a} is not a square number. Find the square number just below it and the square number just above it.`,
        working: [
          `<b>Picture:</b> ${a} sits between two perfect squares on the number line.`,
          `1. ${N.pow(n, 2)} = ${sq(n)}, and ${sq(n)} is less than ${a}.`,
          `2. ${N.pow(n + 1, 2)} = ${sq(n + 1)}, and ${sq(n + 1)} is more than ${a}.`,
          `3. So the side must be between ${n} m and ${n + 1} m.`,
          `Answer: <b>${right}</b>.`,
        ],
        finalAnswer: `between ${right} m`, skill: 'roots',
      };
    }
    const inner = R.int(4, 12), s = inner + R.int(2, 6);
    const v = sq(s) - sq(inner);
    return {
      prompt: `A square photo has an area of ${sq(inner)} cm². It sits inside a square frame with sides of ${s} cm. What is the area of the frame border (the part around the photo), in cm²?`,
      answer: { type: 'number', value: v, unit: 'cm²' },
      hint: `Frame area is ${s}². Then take away the photo area.`,
      working: [`<b>Picture:</b> the big square, with the photo square cut out of the middle.`, `Frame: ${N.pow(s, 2)} = ${sq(s)} cm²`, `Photo: ${sq(inner)} cm²`, `${sq(s)} − ${sq(inner)} = <b>${v} cm²</b>`],
      finalAnswer: `${v} cm²`, skill: 'mixed',
    };
  }

  function word(level) {
    return level === 1 ? wordL1() : level === 2 ? wordL2() : wordL3();
  }

  HL.registerTopic({
    id: 'powers-roots', subject: 'maths', strand: 'number', order: 5,
    name: 'Powers & square roots', short: 'Powers & roots',
    blurb: 'Squares, cubes and other powers, and going backwards with square roots and cube roots.',
    example: '7² = 49 &nbsp;·&nbsp; 2⁵ = 32 &nbsp;·&nbsp; √81 = 9',
    animal: 'koala',
    learn: {
      what: '<p>A <b>power</b> is a short way of writing repeated multiplication. 2<sup>5</sup> means 2 × 2 × 2 × 2 × 2 = 32. The big number is the <b>base</b>; the little number is the <b>index</b> (or exponent) and tells you <b>how many</b> of the base to multiply.</p><p><b>Squaring</b> is power 2 (5² = 25), <b>cubing</b> is power 3 (5³ = 125). A <b>square root</b> (√) goes backwards: √25 = 5 because 5² = 25. A <b>cube root</b> (<sup>3</sup>√) undoes cubing: <sup>3</sup>√125 = 5.</p><p><b>Picture for this topic:</b> <b>square tiles on a floor</b>. 4² is a 4-by-4 patch of tiles (16 tiles). √16 asks "16 tiles make a square — how many along one side?" A cube is a block of Lego: 4³ is 4 layers of 4-by-4.</p>',
      visual: `<svg viewBox="0 0 360 200" width="360" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        <defs><marker id="pr-c-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#E0568C"/></marker><marker id="pr-c-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#2A6FA5"/></marker></defs>
        ${[0,1,2,3].map(i=>[0,1,2,3].map(j=>`<circle cx="${46+i*30}" cy="${62+j*30}" r="10" fill="#F9A8C9" stroke="#E0568C" stroke-width="2"/>`).join('')).join('')}
        <line x1="34" y1="40" x2="148" y2="40" stroke="#2A6FA5" stroke-width="2"/><text x="91" y="30" text-anchor="middle" fill="#2A6FA5">4 across</text>
        <line x1="18" y1="50" x2="18" y2="164" stroke="#2A6FA5" stroke-width="2"/><text x="18" y="112" text-anchor="middle" fill="#2A6FA5" transform="rotate(-90 18 112)" font-size="13">4 down</text>
        <text x="91" y="188" text-anchor="middle" fill="#4A3B48">4 × 4 = 16 tiles</text>
        <text x="215" y="118" text-anchor="middle" font-size="40" fill="#2A6FA5">4</text><text x="315" y="118" text-anchor="middle" font-size="40" fill="#E0568C">16</text>
        <path d="M225 76 Q265 40 305 76" stroke="#E0568C" stroke-width="3" fill="none" marker-end="url(#pr-c-r)"/>
        <text x="265" y="34" text-anchor="middle" fill="#E0568C">square: 4² = 16</text>
        <path d="M305 132 Q265 168 225 132" stroke="#2A6FA5" stroke-width="3" fill="none" marker-end="url(#pr-c-b)"/>
        <text x="265" y="188" text-anchor="middle" fill="#2A6FA5">square root: √16 = 4</text>
      </svg>`,
      facts: [
        '<b>3² = 3 × 3 = 9</b>, not 3 × 2. The index counts how many 3s',
        'Squares: <b>1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225</b>',
        'Cubes: <b>1, 8, 27, 64, 125, 216</b>',
        '<b>√</b> undoes squaring: √49 = 7 because 7² = 49',
        '<b><sup>3</sup>√</b> undoes cubing: <sup>3</sup>√64 = 4 because 4³ = 64',
        'In BEDMAS, powers and roots are <b>E</b> — do them before × ÷ + −',
        '<b>Powers of 10</b>: the index is the number of <b>zeros</b>. 10<sup>3</sup> = 1000, &nbsp;10<sup>6</sup> = 1 000 000 (a million)',
      ],
      steps: [
        '<b>Power</b>: say "the index tells me how many". Write out the multiplication (3<sup>4</sup> = 3 × 3 × 3 × 3), then multiply one step at a time: 9, 27, 81.',
        '<b>Square root</b>: say "what number times itself makes this?" Use the square numbers you know: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.',
        '<b>Cube root</b>: say "what number cubed makes this?" Cubes to know: 1, 8, 27, 64, 125, 216.',
        '<b>Estimating √</b>: say "which two square numbers is it between?" √50 is between √49 = 7 and √64 = 8, so it is a bit more than 7.',
        '<b>Mixed calculations</b>: say "powers and roots first, then the rest" (BEDMAS: E comes before DMAS).',
      ],
      examples: [
        { q: '2<sup>5</sup>',
          visual: `<svg viewBox="0 0 360 100" width="360" height="100" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="16" font-weight="700">
            <text x="180" y="20" text-anchor="middle" fill="#4A3B48" font-size="14">2⁵ = 2 × 2 × 2 × 2 × 2 &nbsp;(five 2s)</text>
            ${[2,4,8,16,32].map((n,i)=>{const x=22+i*72;return `<rect x="${x}" y="40" width="44" height="36" rx="8" fill="${i===4?'#A6E3B8':'#A9D8F5'}"/><text x="${x+22}" y="64" text-anchor="middle" fill="#4A3B48">${n}</text>${i<4?`<text x="${x+58}" y="64" text-anchor="middle" fill="#E0568C" font-size="14">→</text><text x="${x+58}" y="36" text-anchor="middle" fill="#E0568C" font-size="12">×2</text>`:''}`;}).join('')}
            <text x="180" y="96" text-anchor="middle" fill="#4A3B48" font-size="12">start at 2, then ×2 four more times</text>
          </svg>`,
          working: ['<i>Picture:</i> the little 5 is a counter — it says "use five 2s". It is <b>not</b> 2 × 5.', '1. Which is the base? <b>2</b>. How many of them? <b>5</b>.', '2. Write them out: 2 × 2 × 2 × 2 × 2', '3. Multiply one step at a time: 2, 4, 8, 16, 32'], a: '32' },
        { q: 'What is 10<sup>6</sup>? And how would you write 1 000 000 as a power of 10?',
          visual: `<svg viewBox="0 0 360 152" width="360" height="152" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="16" font-weight="700">
            ${[[1, '10'], [2, '100'], [3, '1000'], [6, '1 000 000']].map(([e, v], i) => { const y = 28 + i * 30; return `<text x="20" y="${y}" fill="#2A6FA5">10<tspan font-size="11" dy="-6">${e}</tspan></text><text x="80" y="${y}" fill="#4A3B48">=</text><text x="106" y="${y}" fill="#E0568C">${v}</text><text x="344" y="${y}" text-anchor="end" font-size="12" fill="#9A8A98">${e} zero${e > 1 ? 's' : ''}</text>`; }).join('')}
            <text x="180" y="146" text-anchor="middle" font-size="13" fill="#2FA97A">the index counts the zeros</text>
          </svg>`,
          working: ['<i>Picture:</i> every × 10 pushes the 1 one house to the left and drops a zero behind it.', '1. What does 10<sup>6</sup> mean? Six 10s multiplied: 10 × 10 × 10 × 10 × 10 × 10.', '2. Each × 10 adds one zero, so I write a <b>1 followed by 6 zeros</b>: 1 000 000.', '3. Going backwards: 1 000 000 has 6 zeros, so it is <b>10<sup>6</sup></b>.'], a: '10<sup>6</sup> = 1 000 000 (one million)' },
        { q: '√144', working: ['<i>Picture:</i> 144 tiles laid out as a square — how many along one side?', '1. Which square number is 144? Is it 10 × 10 = 100? <b>No</b>. 11 × 11 = 121? <b>No</b>. 12 × 12 = 144? <b>Yes!</b>', '2. So the side is 12.'], a: '12' },
        { q: '<sup>3</sup>√64', working: ['<i>Picture:</i> a Lego cube made of 64 little blocks — how many blocks along one edge?', '1. Is this a square root or a cube root? The little 3 means <b>cube root</b>: "what number cubed makes 64?"', '2. Try 3: 3 × 3 × 3 = 27. <b>Too small.</b> Try 4: 4 × 4 × 4 = 64. <b>Yes!</b>'], a: '4' },
        { q: 'Estimate √50 to 1 decimal place',
          visual: `<svg viewBox="0 0 360 96" width="360" height="96" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <line x1="40" y1="50" x2="320" y2="50" stroke="#4A3B48" stroke-width="2"/>
            ${[[40,'49','√49 = 7'],[320,'64','√64 = 8']].map(([x,n,r])=>`<line x1="${x}" y1="40" x2="${x}" y2="60" stroke="#2A6FA5" stroke-width="3"/><text x="${x}" y="78" text-anchor="middle" fill="#2A6FA5">${n}</text><text x="${x}" y="30" text-anchor="middle" fill="#2A6FA5">${r}</text>`).join('')}
            <circle cx="59" cy="50" r="6" fill="#E0568C"/><text x="80" y="78" text-anchor="middle" fill="#E0568C">50</text>
            <text x="180" y="94" text-anchor="middle" fill="#E0568C">√50 is just past 7 → about 7.1</text>
          </svg>`,
          working: ['<i>Picture:</i> 50 tiles is not quite a square. Which square patches is it between?', '1. Which square numbers are either side of 50? <b>49</b> (7²) and <b>64</b> (8²).', '2. So √50 is between 7 and 8. Is 50 closer to 49 or 64? <b>Much closer to 49</b>, so it is only a little more than 7.', '3. Check: 7.1 × 7.1 = 50.41. Close enough!'], a: '≈ 7.1' },
        { q: '√49 + 3²', working: ['<i>Picture:</i> two tile patches — one with 49 tiles (find its side) and one that is 3 by 3 (count its tiles) — then add.', '1. Any powers or roots? <b>Yes</b>, both. BEDMAS says do E first.', '2. √49: what times itself is 49? <b>7</b>.', '3. 3² = 3 × 3 = <b>9</b>.', '4. Now add: 7 + 9 = 16'], a: '16' },
        { q: 'A square netball training court at Harper\'s school has an area of 81 m². How long is each side?',
          visual: `<svg viewBox="0 0 360 130" width="360" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
            <rect x="130" y="14" width="100" height="100" fill="#A6E3B8" stroke="#2FA97A" stroke-width="2"/>
            <text x="180" y="58" text-anchor="middle" fill="#4A3B48">area</text><text x="180" y="78" text-anchor="middle" fill="#4A3B48">81 m²</text>
            <text x="250" y="68" fill="#2A6FA5">? m</text><text x="180" y="128" text-anchor="middle" fill="#2A6FA5">? m</text>
            <text x="60" y="68" text-anchor="middle" fill="#E0568C">side = √81</text>
          </svg>`,
          working: ['<i>Picture:</i> the court is a square patch of 81 one-metre tiles. How many tiles along one side?', '1. Is this squaring or going backwards? I know the <b>area</b> and want the <b>side</b> → going backwards → <b>square root</b>.', '2. What times itself makes 81? 9 × 9 = 81. <b>Yes!</b>', '3. Side = √81 = 9'], a: '9 m' },
      ],
      tips: [
        '<b>3² is 3 × 3 = 9, not 3 × 2 = 6.</b> The index counts how many 3s, it is not a number to multiply by.',
        'Squares up to 15² and cubes up to 6³ are worth knowing by heart; they make roots instant.',
        'Area of a square = side²; volume of a cube = edge³. Going backwards (area → side) is a root.',
        'Powers of 10 are the easy ones: 10<sup>4</sup> is just 1 with 4 zeros. Count the zeros and you have the index.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
