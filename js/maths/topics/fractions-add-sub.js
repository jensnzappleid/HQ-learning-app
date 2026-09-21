/* Topic: Adding & subtracting fractions — same and different denominators, mixed numbers, three fractions */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const F = (n, d) => N.fracHtml(n, d);
  const M = (n, d) => N.fracHtml(n, d, { mixed: true });
  const simp = (n, d) => N.simplify(n, d);
  /** answer object + pretty final answer for a fraction n/d (any form) */
  function fracAnswer(n, d, unit) {
    const s = simp(n, d);
    const a = { type: 'fraction', value: { n: s.n, d: s.d }, placeholder: 'e.g. 3/4 or 1 1/2' };
    if (unit) a.unit = unit;
    return { answer: a, pretty: M(s.n, s.d) + (unit ? ' ' + unit : ''), text: N.fracText(s.n, s.d, true) };
  }

  /** working lines for a/b ± c/d (or three fractions) using the common denominator method */
  function addSubWorking(parts, ops) {
    // parts: [{n,d}], ops: ['+','−'] between them (length parts.length-1)
    const lines = [];
    const dens = parts.map((p) => p.d);
    const L = dens.reduce((acc, d) => N.lcm(acc, d), 1);
    const same = dens.every((d) => d === dens[0]);
    if (same) lines.push(`The denominators are already the same (${L}), so just work with the tops.`);
    else {
      lines.push(`Denominators are ${listDens(dens.filter((d) => d !== 1))}. The lowest common denominator is <b>${L}</b>.`);
      lines.push('Convert: ' + parts.map((p) => (p.d === L ? `${F(p.n, p.d)} stays as it is` : p.d === 1 ? `${p.n} = ${F(p.n * L, L)}` : `${F(p.n, p.d)} = ${F(p.n * (L / p.d), L)} (× ${L / p.d} top and bottom)`)).join('; ') + '.');
    }
    const tops = parts.map((p) => p.n * (L / p.d));
    let total = tops[0];
    let expr = String(tops[0]);
    ops.forEach((o, i) => { total = o === '+' ? total + tops[i + 1] : total - tops[i + 1]; expr += ` ${o} ${tops[i + 1]}`; });
    lines.push(`Now the tops: ${expr} = ${total}, so the answer is ${F(total, L)}.`);
    const s = simp(total, L);
    if (s.d !== L) lines.push(`Simplify: divide top and bottom by ${N.gcd(total, L)} → ${F(s.n, s.d)}.`);
    if (Math.abs(s.n) >= s.d && s.d !== 1) lines.push(`Write as a mixed number: ${F(s.n, s.d)} = ${M(s.n, s.d)}.`);
    lines.push(`Answer: <b>${M(s.n, s.d)}</b>`);
    return { lines, n: total, d: L };
  }

  /** working for mixed numbers: convert to improper first */
  function mixedWorking(a, b, op) {
    // a, b: {w, n, d}
    const A = { n: a.w * a.d + a.n, d: a.d }, B = { n: b.w * b.d + b.n, d: b.d };
    const conv = [a, b].filter((x) => x.w > 0).map((x) => `${M(x.w * x.d + x.n, x.d)} = ${F(x.w * x.d + x.n, x.d)} (${x.w} × ${x.d} + ${x.n} = ${x.w * x.d + x.n})`);
    const lines = [`Change to improper fractions: ${conv.join(' and ')}.`];
    const w = addSubWorking([A, B], [op]);
    return { lines: lines.concat(w.lines), n: w.n, d: w.d };
  }

  // ---------- generators ----------
  /** proper numerator that does not share a factor with d (so fractions in the question are already simplified) */
  function pickProper(d) { if (d <= 2) return 1; let n; do { n = R.int(1, d - 1); } while (N.gcd(n, d) !== 1); return n; }
  const listDens = (ds) => (ds.length > 2 ? ds.slice(0, -1).join(', ') + ' and ' + ds[ds.length - 1] : ds.join(' and '));

  function level1() {
    if (R.chance(0.5)) {
      // same denominator
      const d = R.pick([3, 4, 5, 6, 8, 10]);
      const op = R.pick(['+', '−']);
      let n1 = pickProper(d), n2 = pickProper(d);
      if (op === '−') { if (n1 < n2) [n1, n2] = [n2, n1]; if (n1 === n2) { if (n1 < d - 1) n1++; else n2--; } }
      return { parts: [{ n: n1, d }, { n: n2, d }], ops: [op] };
    }
    // simple unlike: one denominator is a multiple of the other
    const [d1, d2] = R.pick([[2, 4], [2, 8], [4, 8], [3, 6], [2, 6], [5, 10], [2, 10]]);
    const op = R.pick(['+', '+', '−']);
    let a = { n: pickProper(d1), d: d1 }, b = { n: pickProper(d2), d: d2 };
    if (R.chance(0.5)) [a, b] = [b, a];
    if (op === '−' && a.n / a.d <= b.n / b.d) [a, b] = [b, a];
    if (op === '−' && a.n * b.d === b.n * a.d) return level1();
    return { parts: [a, b], ops: [op] };
  }

  function level2() {
    const pool = [2, 3, 4, 5, 6, 8, 9, 10, 12];
    let d1, d2;
    do { [d1, d2] = R.sample(pool, 2); } while (d1 % d2 === 0 || d2 % d1 === 0 || N.lcm(d1, d2) > 40);
    const op = R.pick(['+', '+', '−']);
    let a = { n: pickProper(d1), d: d1 }, b = { n: pickProper(d2), d: d2 };
    if (op === '−' && a.n / a.d < b.n / b.d) [a, b] = [b, a];
    if (op === '−' && a.n * b.d === b.n * a.d) return level2();
    return { parts: [a, b], ops: [op] };
  }

  function level3() {
    if (R.chance(0.35)) {
      // three fractions
      const pool = [2, 3, 4, 5, 6, 8, 10, 12];
      let ds;
      do { ds = R.sample(pool, 3); } while (ds.reduce((acc, d) => N.lcm(acc, d), 1) > 60);
      const parts = ds.map((d) => ({ n: pickProper(d), d }));
      const ops = [R.pick(['+', '−']), R.pick(['+', '−'])];
      // make sure running total stays positive
      const L = ds.reduce((acc, d) => N.lcm(acc, d), 1);
      let tot = parts[0].n * L / parts[0].d;
      for (let i = 0; i < 2; i++) { const t = parts[i + 1].n * L / parts[i + 1].d; if (ops[i] === '−' && tot - t <= 0) ops[i] = '+'; tot = ops[i] === '+' ? tot + t : tot - t; }
      return { parts, ops };
    }
    // mixed numbers
    const pool = [2, 3, 4, 5, 6, 8, 10, 12];
    let d1, d2;
    do { [d1, d2] = R.sample(pool, 2); } while (N.lcm(d1, d2) > 40);
    const op = R.pick(['+', '−', '−']);
    let a = { w: R.int(1, 5), n: pickProper(d1), d: d1 }, b = { w: R.int(1, 4), n: pickProper(d2), d: d2 };
    if (op === '−') {
      // want borrowing: fraction part of a smaller than fraction part of b, and a bigger overall
      if (a.n / a.d >= b.n / b.d && R.chance(0.7)) [a, b] = [{ w: a.w, n: b.n, d: b.d }, { w: b.w, n: a.n, d: a.d }];
      if (a.w <= b.w) a.w = b.w + R.int(1, 3);
    }
    return { mixed: [a, b], ops: [op] };
  }

  function calc(level) {
    const g = level === 1 ? level1() : level === 2 ? level2() : level3();
    let work, prompt;
    if (g.mixed) {
      const [a, b] = g.mixed;
      work = mixedWorking(a, b, g.ops[0]);
      prompt = `${M(a.w * a.d + a.n, a.d)} ${g.ops[0]} ${M(b.w * b.d + b.n, b.d)} = ?`;
    } else {
      work = addSubWorking(g.parts, g.ops);
      prompt = g.parts.map((p, i) => (i ? ` ${g.ops[i - 1]} ` : '') + F(p.n, p.d)).join('') + ' = ?';
    }
    const fa = fracAnswer(work.n, work.d);
    const unlike = g.mixed ? g.mixed[0].d !== g.mixed[1].d : g.parts.some((p) => p.d !== g.parts[0].d);
    return {
      prompt: prompt + ' <span class="muted">(fraction in simplest form)</span>',
      answer: fa.answer,
      hint: g.mixed ? 'Change each mixed number into an improper fraction first, then find a common denominator.'
        : unlike ? 'Make the denominators the same first. Multiply top AND bottom by the same number.'
          : 'Same denominators: just add or subtract the tops. Keep the bottom the same.',
      working: work.lines,
      finalAnswer: fa.pretty,
      skill: g.mixed ? 'mixed' : g.parts.length === 3 ? 'three' : unlike ? 'unlike' : 'like',
    };
  }

  // ---------- word problems ----------
  const NICE1 = [[4, 4], [8, 8], [6, 6], [2, 4], [4, 8], [3, 6], [2, 8], [5, 10]];
  const NICE2 = [[3, 4], [2, 3], [4, 6], [3, 8], [5, 6], [4, 5], [6, 8], [2, 5]];
  const NICE3 = [[3, 8], [5, 12], [4, 6], [5, 8], [3, 10], [6, 9], [4, 9]];
  const twoFrom = (opts) => { const [d1, d2] = R.pick(opts); return [{ n: pickProper(d1), d: d1 }, { n: pickProper(d2), d: d2 }]; };
  /** two fractions from opts whose total is still under 1 whole */
  function twoUnderOne(opts) {
    for (let i = 0; i < 40; i++) { const [a, b] = twoFrom(opts); if (a.n / a.d + b.n / b.d < 1) return [a, b]; }
    return [{ n: 1, d: 4 }, { n: 1, d: 8 }];
  }
  /** mixed numbers -> improper parts, plus the "change them first" working line */
  function improperParts(list) {
    return {
      parts: list.map((x) => ({ n: x.w * x.d + x.n, d: x.d })),
      line: 'Change every mixed number to an improper fraction: ' + list.map((x) => `${M(x.w * x.d + x.n, x.d)} = ${F(x.w * x.d + x.n, x.d)}`).join(', ') + '.',
    };
  }
  /** three big buttons; `right` is the index of the correct one */
  const choice = (choices, right) => ({ type: 'choice', value: right, choices });

  // ----- level 1: one step, friendly bottoms, asked straight out -----
  function wordL1() {
    const t = R.pick(['pizza', 'walk', 'time', 'baking', 'bottle', 'leftOne']);
    if (t === 'pizza') {
      const [a, b] = twoUnderOne(NICE1);
      const who = R.pick(['her brother', 'her friend', 'Dad', 'Mum']);
      const food = R.pick(['pizza', 'cake']);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d);
      return {
        prompt: `Harper eats ${F(a.n, a.d)} of a ${food} and ${who} eats ${F(b.n, b.d)} of it. What fraction of the ${food} has been eaten altogether? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Add the two fractions. Make the denominators the same first.',
        working: [`Total eaten = ${F(a.n, a.d)} + ${F(b.n, b.d)}.`].concat(w.lines),
        finalAnswer: `${fa.pretty} of the ${food}`, skill: 'word-add',
      };
    }
    if (t === 'walk') {
      const [a, b] = twoFrom(NICE1);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d, 'km');
      return {
        prompt: `Harper walks ${F(a.n, a.d)} km to school and then ${F(b.n, b.d)} km to netball practice. How far does she walk altogether, in km? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Add the two distances. Find a common denominator first.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-add',
      };
    }
    if (t === 'time') {
      const [a, b] = twoFrom([[2, 4], [4, 4], [2, 2], [4, 8]]);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d, 'hours');
      return {
        prompt: `Harper spends ${F(a.n, a.d)} of an hour on homework and ${F(b.n, b.d)} of an hour at netball. How long is that altogether, in hours? Give your answer as a fraction or mixed number in simplest form.`,
        answer: fa.answer,
        hint: 'Add the fractions of an hour. Common denominator first.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-add',
      };
    }
    if (t === 'baking') {
      const [a, b] = twoFrom([[4, 4], [2, 4], [4, 8], [3, 3]]);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d, 'cups');
      return {
        prompt: `Harper uses ${F(a.n, a.d)} of a cup of flour and ${F(b.n, b.d)} of a cup of oats. How many cups is that altogether? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Add the two fractions.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-add',
      };
    }
    if (t === 'bottle') {
      const d = R.pick([4, 6, 8, 10]);
      const n1 = R.int(2, d - 1), n2 = R.int(1, n1 - 1);
      const w = addSubWorking([{ n: n1, d }, { n: n2, d }], ['−']);
      const fa = fracAnswer(w.n, w.d, 'L');
      return {
        prompt: `Harper's drink bottle has ${F(n1, d)} of a litre in it. She drinks ${F(n2, d)} of a litre at lunchtime. How much is left, in litres? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'The bottoms are already the same, so just subtract the tops.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-sub',
      };
    }
    // leftOne: one whole take away one fraction
    const d = R.pick([3, 4, 5, 6, 8, 10]);
    const n = pickProper(d);
    const food = R.pick(['pizza', 'chocolate bar', 'birthday cake']);
    const w = addSubWorking([{ n: 1, d: 1 }, { n, d }], ['−']);
    const fa = fracAnswer(w.n, w.d);
    return {
      prompt: `A whole ${food} is on the table. Harper's family eats ${F(n, d)} of it. What fraction of the ${food} is left? Give your answer in simplest form.`,
      answer: fa.answer,
      hint: `The whole thing is 1. Write 1 as ${F(d, d)}, then take away ${F(n, d)}.`,
      working: [`Left = 1 − ${F(n, d)}. Write the whole as a fraction with the same bottom.`].concat(w.lines),
      finalAnswer: `${fa.pretty} of the ${food}`, skill: 'word-sub',
    };
  }

  // ----- level 2: unlike bottoms, mixed numbers, two things to do -----
  function wordL2() {
    const t = R.pick(['pizza', 'left', 'walk', 'time', 'baking', 'ribbon', 'water']);
    if (t === 'pizza') {
      const [a, b] = twoUnderOne(NICE2);
      const who = R.pick(['her brother', 'her friend', 'Dad', 'Mum']);
      const food = R.pick(['pizza', 'cake']);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d);
      return {
        prompt: `Harper eats ${F(a.n, a.d)} of a ${food} and ${who} eats ${F(b.n, b.d)} of it. What fraction of the ${food} has been eaten altogether? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Add the two fractions. Make the denominators the same first.',
        working: [`Total eaten = ${F(a.n, a.d)} + ${F(b.n, b.d)}.`].concat(w.lines),
        finalAnswer: `${fa.pretty} of the ${food}`, skill: 'word-add',
      };
    }
    if (t === 'left') {
      const [a, b] = twoUnderOne(NICE2);
      const w = addSubWorking([{ n: 1, d: 1 }, a, b], ['−', '−']);
      const fa = fracAnswer(w.n, w.d);
      return {
        prompt: `A chocolate bar is shared out. Harper gets ${F(a.n, a.d)} of it and her friend gets ${F(b.n, b.d)}. What fraction of the bar is left? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'The whole bar is 1. Take away both fractions: 1 − first − second.',
        working: [`Left = 1 − ${F(a.n, a.d)} − ${F(b.n, b.d)}. Write 1 as a fraction with the common denominator.`].concat(w.lines),
        finalAnswer: `${fa.pretty} of the bar`, skill: 'word-sub',
      };
    }
    if (t === 'walk') {
      const [a, b] = twoFrom(NICE2);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d, 'km');
      return {
        prompt: `Harper walks ${F(a.n, a.d)} km to the dairy and then ${F(b.n, b.d)} km home along the beach. How far does she walk altogether, in km? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Add the two distances. Find a common denominator first.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-add',
      };
    }
    if (t === 'time') {
      const [a, b] = twoFrom([[2, 3], [3, 4], [4, 6], [2, 6], [3, 8], [4, 5]]);
      const w = addSubWorking([a, b], ['+']);
      const fa = fracAnswer(w.n, w.d, 'hours');
      return {
        prompt: `Harper spends ${F(a.n, a.d)} of an hour on homework and ${F(b.n, b.d)} of an hour at netball. How long is that altogether, in hours? Give your answer as a fraction or mixed number in simplest form.`,
        answer: fa.answer,
        hint: 'Add the fractions of an hour. Common denominator first.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-add',
      };
    }
    if (t === 'baking') {
      const a = { w: R.int(1, 2), n: 1, d: R.pick([2, 4]) }, b = { w: 0, n: R.pick([1, 3]), d: R.pick([4, 8]) };
      const w = mixedWorking(a, b, '+');
      const fa = fracAnswer(w.n, w.d, 'cups');
      return {
        prompt: `A muffin recipe needs ${M(a.w * a.d + a.n, a.d)} cups of flour and ${F(b.n, b.d)} of a cup of sugar. How many cups of dry ingredients is that altogether? Give your answer as a mixed number in simplest form.`,
        answer: fa.answer,
        hint: 'Add the whole number and the fractions. Use a common denominator for the fraction parts.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-mixed',
      };
    }
    if (t === 'ribbon') {
      const a = { w: R.int(1, 4), n: R.pick([1, 1, 3]), d: R.pick([2, 4]) }, b = { w: 0, n: R.pick([1, 3, 5]), d: R.pick([4, 8]) };
      if (a.n >= a.d) a.n = 1;
      if (b.n >= b.d) b.n = 1;
      const w = mixedWorking(a, b, '−');
      const fa = fracAnswer(w.n, w.d, 'm');
      return {
        prompt: `Harper has ${M(a.w * a.d + a.n, a.d)} m of ribbon for the school gala. She cuts off ${F(b.n, b.d)} m to wrap a present. How much ribbon is left, in m? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Subtract. Change the mixed number to an improper fraction first so you do not need to borrow.',
        working: w.lines, finalAnswer: fa.pretty, skill: 'word-mixed',
      };
    }
    // water
    const bd = R.pick([3, 4, 5]);
    const a = { w: R.int(1, 2), n: 1, d: 2 }, b = { w: 0, n: pickProper(bd), d: bd };
    const w = mixedWorking(a, b, '−');
    const fa = fracAnswer(w.n, w.d, 'L');
    return {
      prompt: `A drink bottle holds ${M(a.w * a.d + a.n, a.d)} L. Harper drinks ${F(b.n, b.d)} L on the way home. How much is left, in litres? Give your answer in simplest form.`,
      answer: fa.answer,
      hint: 'Subtract the amount she drank. Improper fraction first, then a common denominator.',
      working: w.lines, finalAnswer: fa.pretty, skill: 'word-mixed',
    };
  }

  // ----- level 3: three fractions, scaling up, working backwards, distractors, deciding -----
  const TRIPLES = [
    [[1, 4], [1, 3], [1, 6]], [[1, 2], [1, 8], [1, 4]], [[1, 3], [1, 4], [1, 12]],
    [[2, 5], [1, 4], [1, 10]], [[3, 8], [1, 4], [1, 6]], [[1, 2], [1, 6], [1, 9]],
    [[2, 3], [1, 8], [1, 12]], [[1, 5], [3, 10], [1, 4]], [[1, 2], [1, 5], [1, 4]],
    [[5, 12], [1, 4], [1, 6]], [[1, 3], [3, 8], [1, 8]],
  ];
  function wordL3() {
    const t = R.pick(['share3', 'recipeJug', 'jugFit', 'backRibbon', 'tramp', 'homework', 'garden', 'walkMixed']);
    if (t === 'share3') {
      const tri = R.shuffle(R.pick(TRIPLES)).map(([n, d]) => ({ n, d }));
      const food = R.pick(['pizza', 'kūmara pie', 'birthday cake']);
      const w = addSubWorking([{ n: 1, d: 1 }].concat(tri), ['−', '−', '−']);
      const fa = fracAnswer(w.n, w.d);
      return {
        prompt: `Three friends share a ${food}. Harper eats ${F(tri[0].n, tri[0].d)} of it, Mia eats ${F(tri[1].n, tri[1].d)} and Tane eats ${F(tri[2].n, tri[2].d)}. What fraction of the ${food} is left over? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Take all three fractions away from 1 whole. One common denominator works for all of them.',
        working: [`Left = 1 − ${F(tri[0].n, tri[0].d)} − ${F(tri[1].n, tri[1].d)} − ${F(tri[2].n, tri[2].d)}.`].concat(w.lines),
        finalAnswer: `${fa.pretty} of the ${food}`, skill: 'word-three',
      };
    }
    if (t === 'recipeJug' || t === 'jugFit') {
      let d1, d2;
      do { [d1, d2] = R.sample([2, 3, 4, 6, 8], 2); } while (N.lcm(d1, d2) > 12);
      const a = { n: pickProper(d1), d: d1 }, b = { n: pickProper(d2), d: d2 };
      const k = R.int(2, 3);
      const bs = N.simplify(a.n * d2 + b.n * d1, d1 * d2);
      const batch = { n: bs.n, d: bs.d };
      const parts = []; for (let i = 0; i < k; i++) parts.push(batch);
      const first = addSubWorking([a, b], ['+']);
      const w = addSubWorking(parts, k === 2 ? ['+'] : ['+', '+']);
      const fa = fracAnswer(w.n, w.d, 'L');
      const total = w.n / w.d;
      const lead = `A smoothie recipe uses ${F(a.n, a.d)} L of milk and ${F(b.n, b.d)} L of yoghurt. For Matariki breakfast Harper makes <b>${k} times</b> the recipe.`;
      const leadJug = `For Matariki breakfast Harper makes <b>${k} times</b> a smoothie recipe. One batch uses ${F(a.n, a.d)} L of milk and ${F(b.n, b.d)} L of yoghurt.`;
      const shared = [`One batch needs ${F(a.n, a.d)} + ${F(b.n, b.d)} L.`].concat(first.lines.slice(0, -1))
        .concat([`So one batch is ${M(N.simplify(first.n, first.d).n, N.simplify(first.n, first.d).d)} L.`, `Now add up ${k} batches:`]).concat(w.lines);
      if (t === 'recipeJug') {
        return {
          prompt: `${lead} How many litres of liquid does she need altogether? Give your answer in simplest form.`,
          answer: fa.answer,
          hint: 'Work out one batch first (add the two amounts), then add that up for each batch.',
          working: shared, finalAnswer: fa.pretty, skill: 'word-scale',
        };
      }
      let cap = R.chance(0.5) ? Math.ceil(total) : Math.floor(total);
      if (cap <= 0) cap = 1;
      if (cap === total) cap = R.chance(0.5) ? cap + 1 : cap - 1;   // never ask about an exactly-full jug
      if (cap < 1) cap = total + 1;
      const fits = total < cap;
      const opts = R.shuffle([`Yes, it fits in the ${cap} L jug`, `No, it is too much for the ${cap} L jug`]);
      const right = opts.indexOf(fits ? `Yes, it fits in the ${cap} L jug` : `No, it is too much for the ${cap} L jug`);
      const choices = opts.concat(['There is not enough information']);
      return {
        prompt: `${leadJug} Her jug holds ${cap} L. Will all the liquid fit in the jug?`,
        answer: choice(choices, right),
        hint: 'Work out the total first, then compare it with the size of the jug.',
        working: shared.concat([`Compare ${fa.pretty} with ${cap} L: ${fa.pretty} is ${fits ? 'less than' : 'more than'} ${cap} L.`, `Answer: <b>${choices[right]}</b>`]),
        finalAnswer: choices[right], skill: 'word-decide',
      };
    }
    if (t === 'backRibbon') {
      let ds;
      do { ds = R.sample([2, 3, 4, 6, 8, 12], 3); } while (ds.reduce((acc, d) => N.lcm(acc, d), 1) > 24);
      const p = ds.map((d) => ({ n: pickProper(d), d }));
      const w = addSubWorking(p, ['+', '+']);
      const fa = fracAnswer(w.n, w.d, 'm');
      return {
        prompt: `Harper cut two pieces off a roll of ribbon: one ${F(p[0].n, p[0].d)} m long and one ${F(p[1].n, p[1].d)} m long. There is ${F(p[2].n, p[2].d)} m still on the roll. How long was the ribbon before she started, in m? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Work backwards: the start = the two pieces she cut off <b>plus</b> what is left.',
        working: [`Start = ${F(p[0].n, p[0].d)} + ${F(p[1].n, p[1].d)} + ${F(p[2].n, p[2].d)}.`].concat(w.lines),
        finalAnswer: fa.pretty, skill: 'word-backwards',
      };
    }
    if (t === 'tramp') {
      const legs = R.sample([2, 4, 3, 6, 8], 3).map((d) => ({ w: R.int(1, 4), n: pickProper(d), d }));
      const ip = improperParts(legs);
      const w = addSubWorking(ip.parts, ['+', '+']);
      const fa = fracAnswer(w.n, w.d, 'km');
      return {
        prompt: `On a tramp Harper walks ${M(legs[0].w * legs[0].d + legs[0].n, legs[0].d)} km to the first hut, ${M(legs[1].w * legs[1].d + legs[1].n, legs[1].d)} km to the lookout and ${M(legs[2].w * legs[2].d + legs[2].n, legs[2].d)} km back to the car park. How far does she walk in total, in km? Give your answer as a mixed number.`,
        answer: fa.answer,
        hint: 'Change all three mixed numbers to improper fractions, then find one common denominator.',
        working: [ip.line].concat(w.lines),
        finalAnswer: fa.pretty, skill: 'word-mixed',
      };
    }
    if (t === 'homework') {
      let d1, d2;
      do { [d1, d2] = R.sample([2, 3, 4, 6, 8, 12], 2); } while (N.lcm(d1, d2) > 24);
      const a = { n: pickProper(d1), d: d1 }, b = { n: pickProper(d2), d: d2 };
      const totalW = { w: R.int(2, 3), n: 1, d: R.pick([2, 4]) };
      const T = { n: totalW.w * totalW.d + totalW.n, d: totalW.d };
      const w = addSubWorking([T, a, b], ['−', '−']);
      if (w.n <= 0) return wordL3();
      const fa = fracAnswer(w.n, w.d, 'hours');
      return {
        prompt: `Harper plans ${M(T.n, T.d)} hours of study before her exam. She spends ${F(a.n, a.d)} of an hour on maths and ${F(b.n, b.d)} of an hour on science. How many hours of her plan are left? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'Take both fraction times off the total. Change the mixed number to an improper fraction first.',
        working: [`Left = ${M(T.n, T.d)} − ${F(a.n, a.d)} − ${F(b.n, b.d)}, and ${M(T.n, T.d)} = ${F(T.n, T.d)}.`].concat(w.lines),
        finalAnswer: fa.pretty, skill: 'word-mixed',
      };
    }
    if (t === 'garden') {
      const [pa, pb] = twoUnderOne(NICE3);
      const len = R.int(6, 15);
      const w = addSubWorking([{ n: 1, d: 1 }, pa, pb], ['−', '−']);
      const fa = fracAnswer(w.n, w.d);
      return {
        prompt: `The garden bed at the marae is ${len} m long. Harper plants kūmara in ${F(pa.n, pa.d)} of the bed and spinach in ${F(pb.n, pb.d)} of it. What fraction of the bed is still empty? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: 'You do not need the length of the bed. The whole bed is 1: take both fractions away from 1.',
        working: [`The ${len} m is <b>not needed</b> — the question asks for a fraction of the whole bed.`, `Empty = 1 − ${F(pa.n, pa.d)} − ${F(pb.n, pb.d)}.`].concat(w.lines),
        finalAnswer: `${fa.pretty} of the bed`, skill: 'word-distractor',
      };
    }
    // walkMixed: two mixed-number distances added
    const a = { w: R.int(1, 4), n: 1, d: R.pick([2, 4]) }, b = { w: R.int(1, 3), n: R.pick([1, 2]), d: R.pick([3, 5, 8]) };
    const w = mixedWorking(a, b, '+');
    const fa = fracAnswer(w.n, w.d, 'km');
    return {
      prompt: `Harper walks ${M(a.w * a.d + a.n, a.d)} km to the beach and then ${M(b.w * b.d + b.n, b.d)} km along the sand. How far does she walk in total, in km? Give your answer as a mixed number.`,
      answer: fa.answer,
      hint: 'Change both to improper fractions, or add the whole numbers and the fractions separately.',
      working: w.lines, finalAnswer: fa.pretty, skill: 'word-mixed',
    };
  }

  const word = (level) => (level === 1 ? wordL1() : level === 2 ? wordL2() : wordL3());

  HL.registerTopic({
    id: 'fractions-add-sub', subject: 'maths', strand: 'number', order: 8,
    name: 'Adding & subtracting fractions', short: 'Fractions + −',
    blurb: 'Make the bottoms the same, then add or subtract the tops.',
    example: '2/3 + 1/4 = 8/12 + 3/12 = 11/12',
    animal: 'bunny',
    learn: {
      what: '<p>You can only add or subtract fractions when the <b>denominators</b> (bottoms) are the <b>same</b>. Halves and quarters are different-sized pieces, so first you cut them into the same size. Once the bottoms match, you simply add or subtract the <b>numerators</b> (tops) and keep the bottom.</p><p><b>Picture for this topic:</b> a <b>pizza</b>. The bottom number says how many slices the pizza is cut into; the top number says how many slices you have. You can only add slices that are the <b>same size</b>.</p>',
      visual: `<svg viewBox="0 0 360 205" width="360" height="205" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        ${[[16,2,1,['#F9A8C9'],'= 2 quarters'],[66,4,1,['#A9D8F5'],'= 1 quarter'],[116,4,3,['#F9A8C9','#F9A8C9','#A9D8F5'],'= 3 quarters']].map(([y,parts,shaded,cols,label])=>{const w=200/parts;return [...Array(parts)].map((_,k)=>`<rect x="${70+k*w}" y="${y}" width="${w}" height="30" fill="${k<shaded?cols[k]:'#fff'}" stroke="#4A3B48" stroke-width="2"/>`).join('')+(parts===2?`<line x1="120" y1="${y}" x2="120" y2="${y+30}" stroke="#4A3B48" stroke-width="2" stroke-dasharray="4 3"/><line x1="220" y1="${y}" x2="220" y2="${y+30}" stroke="#4A3B48" stroke-width="2" stroke-dasharray="4 3"/>`:'')+`<text x="276" y="${y+19}" fill="#2A6FA5" font-size="11">${label}</text>`;}).join('')}
        ${[[36,31,1,2,'#E0568C'],[36,81,1,4,'#2A6FA5'],[36,131,3,4,'#2FA97A']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+15}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
        <text x="56" y="62" text-anchor="middle" fill="#4A3B48" font-size="16">+</text><text x="56" y="112" text-anchor="middle" fill="#4A3B48" font-size="16">=</text>
        <text x="180" y="172" text-anchor="middle" fill="#4A3B48" font-size="13">Cut into same-size slices: quarters</text>
        <text x="180" y="194" text-anchor="middle" fill="#2FA97A" font-size="13">2 quarters + 1 quarter = 3 quarters</text>
      </svg>`,
      facts: [
        'Only add or subtract when the <b>bottoms are the same</b>',
        'Same bottoms → <b>add the tops, keep the bottom</b>: ' + N.fracHtml(2, 5) + ' + ' + N.fracHtml(1, 5) + ' = ' + N.fracHtml(3, 5),
        'Different bottoms → find the <b>LCD</b> (smallest number both bottoms go into)',
        'Whatever you × the bottom by, <b>× the top by the same</b>: ' + N.fracHtml(1, 4) + ' = ' + N.fracHtml(2, 8),
        'Mixed numbers → change to <b>improper</b> first: 2' + N.fracHtml(1, 3) + ' = ' + N.fracHtml(7, 3),
        '<b>Never</b> add the bottoms: ' + N.fracHtml(1, 2) + ' + ' + N.fracHtml(1, 2) + ' = 1, not ' + N.fracHtml(2, 4),
      ],
      steps: [
        'Ask "<b>Are the bottoms the same?</b>" If not, find the <b>lowest common denominator</b> (LCD): the smallest number both bottoms go into. For 3 and 4 it is 12.',
        '<b>Convert</b> each fraction: "whatever I multiply the bottom by, I multiply the top by the same." ' + N.fracHtml(2, 3) + ' = ' + N.fracHtml(8, 12) + ' (× 4 top and bottom).',
        '"Now the slices are the same size, so I <b>add or subtract the tops</b> and keep the bottom." ' + N.fracHtml(8, 12) + ' + ' + N.fracHtml(3, 12) + ' = ' + N.fracHtml(11, 12) + '.',
        'Ask "<b>Can I simplify?</b>" (divide top and bottom by the same number), and turn top-heavy fractions into <b>mixed numbers</b>.',
        '<b>Mixed numbers</b>: change them to improper fractions first (2' + N.fracHtml(1, 3) + ' = ' + N.fracHtml(7, 3) + '), then follow the same steps. No borrowing needed!',
      ],
      examples: [
        { q: N.fracHtml(3, 8) + ' + ' + N.fracHtml(1, 4),
          visual: `<svg viewBox="0 0 360 150" width="360" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
            ${[[12,8,3,['#F9A8C9','#F9A8C9','#F9A8C9'],'3 eighths'],[58,4,1,['#A9D8F5'],'= 2 eighths'],[104,8,5,['#F9A8C9','#F9A8C9','#F9A8C9','#A9D8F5','#A9D8F5'],'5 eighths']].map(([y,parts,shaded,cols,label])=>{const w=200/parts;return [...Array(parts)].map((_,k)=>`<rect x="${70+k*w}" y="${y}" width="${w}" height="28" fill="${k<shaded?cols[k]:'#fff'}" stroke="#4A3B48" stroke-width="2"/>`).join('')+(parts===4?[1,3,5,7].map(k=>`<line x1="${70+k*25}" y1="${y}" x2="${70+k*25}" y2="${y+28}" stroke="#4A3B48" stroke-width="2" stroke-dasharray="4 3"/>`).join(''):'')+`<text x="276" y="${y+18}" fill="#2A6FA5" font-size="11">${label}</text>`;}).join('')}
            ${[[36,26,3,8,'#E0568C'],[36,72,1,4,'#2A6FA5'],[36,118,5,8,'#2FA97A']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+15}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
            <text x="56" y="56" text-anchor="middle" fill="#4A3B48" font-size="16">+</text><text x="56" y="102" text-anchor="middle" fill="#4A3B48" font-size="16">=</text>
          </svg>`,
          working: ['<i>Picture:</i> 3 slices of a pizza cut into 8, plus 1 slice of a pizza cut into 4. The slices are different sizes.', '1. Are the bottoms the same? <b>No</b> (8 and 4), so I make them the same. Does 4 go into 8? <b>Yes</b>, so the LCD is 8.', '2. Cut each quarter in half: ' + N.fracHtml(1, 4) + ' = ' + N.fracHtml(2, 8) + ' (× 2 top and bottom).', '3. Now the slices match, so add the tops: 3 + 2 = 5 → ' + N.fracHtml(5, 8), '4. Can I simplify? <b>No</b>, 5 and 8 share no factor.'], a: N.fracHtml(5, 8) },
        { q: N.fracHtml(5, 6) + ' − ' + N.fracHtml(1, 4), working: ['<i>Picture:</i> 5 slices of a pizza cut into 6, and I eat a slice the size of a quarter. Different-sized slices again.', '1. Are the bottoms the same? <b>No</b> (6 and 4). Does 4 go into 6? <b>No.</b> Smallest number in both tables: 12.', '2. ' + N.fracHtml(5, 6) + ' = ' + N.fracHtml(10, 12) + ' (× 2), and ' + N.fracHtml(1, 4) + ' = ' + N.fracHtml(3, 12) + ' (× 3).', '3. Now subtract the tops: 10 − 3 = 7 → ' + N.fracHtml(7, 12), '4. Can I simplify? <b>No.</b>'], a: N.fracHtml(7, 12) },
        { q: N.fracHtml(2, 3) + ' + ' + N.fracHtml(1, 4), working: ['<i>Picture:</i> thirds and quarters — neither cuts into the other, so I need a new slice size that both fit.', '1. Are the bottoms the same? <b>No.</b> Does one go into the other? <b>No</b>, so I multiply the bottoms: 3 × 4 = 12.', '2. ' + N.fracHtml(2, 3) + ' = ' + N.fracHtml(8, 12) + ' (× 4), and ' + N.fracHtml(1, 4) + ' = ' + N.fracHtml(3, 12) + ' (× 3).', '3. Add the tops: 8 + 3 = 11 → ' + N.fracHtml(11, 12), '4. Can I simplify? <b>No.</b>'], a: N.fracHtml(11, 12) },
        { q: N.fracHtml(1, 2) + ' + ' + N.fracHtml(3, 4),
          visual: `<svg viewBox="0 0 360 150" width="360" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
            ${[[12,2,1,['#F9A8C9'],'= 2 quarters'],[58,4,3,['#A9D8F5','#A9D8F5','#A9D8F5'],'3 quarters']].map(([y,parts,shaded,cols,label])=>{const w=200/parts;return [...Array(parts)].map((_,k)=>`<rect x="${70+k*w}" y="${y}" width="${w}" height="28" fill="${k<shaded?cols[k]:'#fff'}" stroke="#4A3B48" stroke-width="2"/>`).join('')+(parts===2?`<line x1="120" y1="${y}" x2="120" y2="${y+28}" stroke="#4A3B48" stroke-width="2" stroke-dasharray="4 3"/><line x1="220" y1="${y}" x2="220" y2="${y+28}" stroke="#4A3B48" stroke-width="2" stroke-dasharray="4 3"/>`:'')+`<text x="276" y="${y+18}" fill="#2A6FA5" font-size="11">${label}</text>`;}).join('')}
            ${[0,1,2,3].map(k=>`<rect x="${70+k*25}" y="104" width="25" height="28" fill="${k<2?'#F9A8C9':'#A9D8F5'}" stroke="#4A3B48" stroke-width="2"/>`).join('')}<rect x="190" y="104" width="25" height="28" fill="#A9D8F5" stroke="#4A3B48" stroke-width="2"/>${[1,2,3].map(k=>`<rect x="${190+k*25}" y="104" width="25" height="28" fill="#fff" stroke="#4A3B48" stroke-width="2"/>`).join('')}
            <text x="120" y="146" text-anchor="middle" fill="#4A3B48" font-size="12">1 whole pizza</text><text x="240" y="146" text-anchor="middle" fill="#4A3B48" font-size="12">+ 1 quarter</text>
            ${[[36,26,1,2,'#E0568C'],[36,72,3,4,'#2A6FA5']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+15}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
            <text x="36" y="123" text-anchor="middle" fill="#2FA97A">1</text><text x="52" y="115" text-anchor="middle" fill="#2FA97A" font-size="11">1</text><line x1="46" y1="118" x2="58" y2="118" stroke="#2FA97A" stroke-width="2"/><text x="52" y="130" text-anchor="middle" fill="#2FA97A" font-size="11">4</text>
            <text x="56" y="56" text-anchor="middle" fill="#4A3B48" font-size="16">+</text><text x="56" y="102" text-anchor="middle" fill="#4A3B48" font-size="16">=</text>
          </svg>`,
          working: ['<i>Picture:</i> half a pizza plus three quarters of a pizza — that is more than one whole pizza.', '1. Are the bottoms the same? <b>No.</b> Does 2 go into 4? <b>Yes</b>, so the LCD is 4.', '2. ' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(2, 4) + ' (× 2 top and bottom).', '3. Add the tops: 2 + 3 = 5 → ' + N.fracHtml(5, 4), '4. Is it top-heavy? <b>Yes</b>, 5 quarters = 1 whole and 1 quarter left over.'], a: '1' + N.fracHtml(1, 4) },
        { q: '2' + N.fracHtml(1, 2) + ' − 1' + N.fracHtml(3, 4), working: ['<i>Picture:</i> two and a half pizzas, and someone takes one and three-quarter pizzas.', '1. Any mixed numbers? <b>Yes</b>, so change them to improper first: 2' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(5, 2) + ' and 1' + N.fracHtml(3, 4) + ' = ' + N.fracHtml(7, 4) + '.', '2. Are the bottoms the same? <b>No.</b> 2 goes into 4, so LCD is 4: ' + N.fracHtml(5, 2) + ' = ' + N.fracHtml(10, 4) + '.', '3. Subtract the tops: 10 − 7 = 3 → ' + N.fracHtml(3, 4), '4. Can I simplify? <b>No.</b>'], a: N.fracHtml(3, 4) },
        { q: 'Harper ate ' + N.fracHtml(1, 3) + ' of a pizza and her brother ate ' + N.fracHtml(1, 4) + ' of the same pizza. What fraction of the pizza is left?', working: ['<i>Picture:</i> one whole pizza. Take away a third-sized slice and a quarter-sized slice. What is left?', '1. What is the whole pizza as a fraction? 1 = ' + N.fracHtml(12, 12) + ' (I choose 12 because 3 and 4 both go into it).', '2. Are the bottoms the same? Not yet: ' + N.fracHtml(1, 3) + ' = ' + N.fracHtml(4, 12) + ' and ' + N.fracHtml(1, 4) + ' = ' + N.fracHtml(3, 12) + '.', '3. Eaten altogether: 4 + 3 = 7 twelfths.', '4. Left: 12 − 7 = 5 → ' + N.fracHtml(5, 12) + '. Can I simplify? <b>No.</b>'], a: N.fracHtml(5, 12) + ' of the pizza' },
      ],
      tips: [
        '<b>Never add the bottoms.</b> ' + N.fracHtml(1, 2) + ' + ' + N.fracHtml(1, 2) + ' is 1 whole, not ' + N.fracHtml(2, 4) + '.',
        'Whatever you do to the bottom, do to the top. Multiplying top and bottom by the same number does not change the fraction.',
        'If one bottom divides into the other (4 and 8), the LCD is just the bigger one. Otherwise try multiplying the two bottoms together, then check for something smaller.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
