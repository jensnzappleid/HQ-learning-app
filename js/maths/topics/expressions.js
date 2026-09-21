/* Topic: Expressions & substitution (writing expressions, like terms, multiplying terms, substituting values) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = N.fmt;
  /** stacked fraction html that allows a symbolic top/bottom (HL.num.fracHtml only takes numbers) */
  const fracH = (top, bot) => `<span class="frac"><span class="frac-n">${top}</span><span class="frac-d">${bot}</span></span>`;

  /* ---------- expression text helpers ---------- */
  /** pretty term: 3x, x, −x, −3x, or a plain number when v is '' */
  const termText = (k, v) => {
    if (!v) return f(k);
    if (k === 1) return v;
    if (k === -1) return '−' + v;
    return f(k) + v;
  };
  /** pretty "t1 + t2" where each t = {k, v}; drops zero terms */
  const exprText = (t1, t2) => {
    if (t1.k === 0 && t2.k === 0) return '0';
    if (t2.k === 0) return termText(t1.k, t1.v);
    if (t1.k === 0) return termText(t2.k, t2.v);
    return `${termText(t1.k, t1.v)} ${t2.k < 0 ? '−' : '+'} ${termText(Math.abs(t2.k), t2.v)}`;
  };
  /** typed forms of |k|v: ['x','1x'] or ['3x'] or ['7'] */
  const absForms = (k, v) => { const a = Math.abs(k); if (!v) return [String(a)]; return a === 1 ? [v, '1' + v] : [a + v]; };
  /** all accepted typed answers for t1 + t2 (uses plain '-'; the marker normalises − to -) */
  function variants(t1, t2) {
    const out = new Set();
    const terms = [t1, t2].filter((t) => t.k !== 0);
    if (!terms.length) return ['0'];
    if (terms.length === 1) { absForms(terms[0].k, terms[0].v).forEach((s) => out.add((terms[0].k < 0 ? '-' : '') + s)); return [...out]; }
    const sp = ['', ' '];
    for (const [p, q] of [[terms[0], terms[1]], [terms[1], terms[0]]]) {
      for (const ps of absForms(p.k, p.v)) for (const qs of absForms(q.k, q.v)) for (const s1 of sp) for (const s2 of sp) {
        const first = (p.k < 0 ? '-' : '') + ps;
        out.add(`${first}${s1}${q.k < 0 ? '-' : '+'}${s2}${qs}`);
        if (q.k < 0) out.add(`${first}${s1}+${s2}-${qs}`);
      }
    }
    return [...out];
  }
  const textAnswer = (t1, t2, extra = {}) => {
    const value = exprText(t1, t2);
    return Object.assign({ type: 'text', value, accept: variants(t1, t2), placeholder: 'e.g. 5x + 3' }, extra);
  };
  const VARS = ['x', 'a', 'n', 'y', 'm', 'p', 'k', 't'];

  /* ---------- substitution ---------- */
  function substitution(level) {
    const v = R.pick(VARS);
    if (level === 1) {
      const kind = R.pick(['ax+b', 'ax+b', 'x+b', 'ax', 'ax-b', 'b-x']);
      const x = R.int(1, 9);
      if (kind === 'x+b') { const b = R.int(1, 12); return sub1(`${v} + ${b}`, v, x, x + b, [`${x} + ${b} = <b>${x + b}</b>`]); }
      if (kind === 'ax') { const a = R.int(2, 9); return sub1(`${a}${v}`, v, x, a * x, [`${a}${v} means ${a} × ${v}.`, `${a} × ${x} = <b>${a * x}</b>`]); }
      if (kind === 'b-x') { const b = R.int(x + 1, 20); return sub1(`${b} − ${v}`, v, x, b - x, [`${b} − ${x} = <b>${b - x}</b>`]); }
      const a = R.int(2, 6), b = R.int(1, 10);
      if (kind === 'ax-b') { const ans = a * x - b; if (ans < 0) return substitution(1); return sub1(`${a}${v} − ${b}`, v, x, ans, [`${a}${v} means ${a} × ${v} = ${a} × ${x} = ${a * x}.`, `${a * x} − ${b} = <b>${ans}</b>`]); }
      return sub1(`${a}${v} + ${b}`, v, x, a * x + b, [`${a}${v} means ${a} × ${v} = ${a} × ${x} = ${a * x}.`, `${a * x} + ${b} = <b>${a * x + b}</b>`]);
    }
    if (level === 2) {
      const kind = R.pick(['ax+b', 'ax-b', 'two', 'two', 'sq', 'bracket', 'div', 'prod']);
      const x = R.int(2, 12);
      if (kind === 'ax+b' || kind === 'ax-b') {
        const a = R.int(3, 9), b = R.int(2, 20);
        const ans = kind === 'ax+b' ? a * x + b : a * x - b;
        return sub1(`${a}${v} ${kind === 'ax+b' ? '+' : '−'} ${b}`, v, x, ans, [`${a} × ${x} = ${a * x}.`, `${a * x} ${kind === 'ax+b' ? '+' : '−'} ${b} = <b>${f(ans)}</b>`]);
      }
      if (kind === 'sq') {
        const b = R.int(1, 15), plus = R.chance(0.6);
        const ans = plus ? x * x + b : x * x - b;
        return sub1(`${v}<sup>2</sup> ${plus ? '+' : '−'} ${b}`, v, x, ans, [`${v}<sup>2</sup> = ${x} × ${x} = ${x * x}.`, `${x * x} ${plus ? '+' : '−'} ${b} = <b>${f(ans)}</b>`]);
      }
      if (kind === 'bracket') {
        const a = R.int(2, 6), b = R.int(1, 9);
        return sub1(`${a}(${v} + ${b})`, v, x, a * (x + b), [`Brackets first: ${x} + ${b} = ${x + b}.`, `${a} × ${x + b} = <b>${a * (x + b)}</b>`]);
      }
      if (kind === 'div') {
        const dv = R.pick([2, 3, 4, 5]), xx = dv * R.int(2, 9), b = R.int(1, 10);
        return sub1(`${fracH(v, dv)} + ${b}`, v, xx, xx / dv + b, [`${v} ÷ ${dv} = ${xx} ÷ ${dv} = ${xx / dv}.`, `${xx / dv} + ${b} = <b>${xx / dv + b}</b>`]);
      }
      const w = R.pick(VARS.filter((s) => s !== v));
      const y = R.int(2, 9);
      if (kind === 'prod') {
        const a = R.pick([1, 2, 3]);
        return sub2(`${a === 1 ? '' : a}${v}${w}`, v, x, w, y, a * x * y, [`${a === 1 ? '' : a}${v}${w} means ${a === 1 ? '' : a + ' × '}${v} × ${w}.`, `${a === 1 ? '' : a + ' × '}${x} × ${y} = <b>${a * x * y}</b>`]);
      }
      const a = R.int(2, 6), b = R.int(2, 6), plus = R.chance(0.6);
      const ans = plus ? a * x + b * y : a * x - b * y;
      return sub2(`${a}${v} ${plus ? '+' : '−'} ${b}${w}`, v, x, w, y, ans, [`${a}${v} = ${a} × ${x} = ${a * x} and ${b}${w} = ${b} × ${y} = ${b * y}.`, `${a * x} ${plus ? '+' : '−'} ${b * y} = <b>${f(ans)}</b>`]);
    }
    // level 3: negatives, two variables, formulas
    if (R.chance(0.45)) return formula();
    const kind = R.pick(['neg', 'neg', 'sqneg', 'twoNeg', 'twoNeg', 'fracsum']);
    const w = R.pick(VARS.filter((s) => s !== v));
    if (kind === 'neg') {
      const a = R.int(2, 7), b = R.int(1, 15), x = -R.int(1, 9);
      const ans = a * x + b;
      return sub1(`${a}${v} + ${b}`, v, x, ans, [`${a}${v} = ${a} × (${f(x)}) = ${f(a * x)}.`, `${f(a * x)} + ${b} = <b>${f(ans)}</b>`]);
    }
    if (kind === 'sqneg') {
      const x = -R.int(2, 8), a = R.int(2, 5);
      const ans = x * x - a * x;
      return sub1(`${v}<sup>2</sup> − ${a}${v}`, v, x, ans, [`${v}<sup>2</sup> = (${f(x)}) × (${f(x)}) = ${x * x} (negative × negative = positive).`, `${a}${v} = ${a} × (${f(x)}) = ${f(a * x)}.`, `${x * x} − (${f(a * x)}) = ${x * x} + ${-a * x} = <b>${ans}</b>`]);
    }
    if (kind === 'fracsum') {
      const dv = R.pick([2, 3, 4]), x = R.int(1, 12), y = dv * R.int(1, 6) - x;
      const ans = (x + y) / dv;
      return sub2(`${fracH(`${v} + ${w}`, dv)}`, v, x, w, y, ans, [`Top first: ${v} + ${w} = ${f(x)} + (${f(y)}) = ${f(x + y)}.`, `${f(x + y)} ÷ ${dv} = <b>${f(ans)}</b>`]);
    }
    const a = R.int(2, 6), b = R.int(2, 6), x = R.nz(8), y = R.nz(8), plus = R.chance(0.5);
    const ans = plus ? a * x + b * y : a * x - b * y;
    return sub2(`${a}${v} ${plus ? '+' : '−'} ${b}${w}`, v, x, w, y, ans, [
      `${a}${v} = ${a} × (${f(x)}) = ${f(a * x)}.`,
      `${b}${w} = ${b} × (${f(y)}) = ${f(b * y)}.`,
      `${f(a * x)} ${plus ? '+' : '−'} (${f(b * y)}) = <b>${f(ans)}</b>`,
    ]);
  }
  function sub1(expr, v, x, ans, working) {
    return {
      prompt: `Find the value of <b>${expr}</b> when ${v} = ${f(x)}.`,
      answer: { type: 'number', value: ans },
      hint: `Replace every ${v} with ${x < 0 ? '(' + f(x) + ')' : f(x)}, then work it out. Remember ${expr.includes('(') ? 'brackets first, then ' : ''}multiply before you add or subtract.`,
      working: [`Replace ${v} with ${x < 0 ? '(' + f(x) + ')' : f(x)}.`, ...working],
      finalAnswer: f(ans),
      skill: 'substitute',
    };
  }
  function sub2(expr, v, x, w, y, ans, working) {
    return {
      prompt: `Find the value of <b>${expr}</b> when ${v} = ${f(x)} and ${w} = ${f(y)}.`,
      answer: { type: 'number', value: ans },
      hint: `Swap ${v} for ${f(x)} and ${w} for ${f(y)}. Work out each part, then combine.`,
      working: [`Replace ${v} with ${f(x)} and ${w} with ${f(y)}.`, ...working],
      finalAnswer: f(ans),
      skill: 'substitute',
    };
  }
  function formula() {
    const t = R.pick(['perim', 'tri', 'speed', 'vel', 'vol', 'fahr', 'cels', 'mean', 'cube', 'cube', 'sqArea', 'speedFrac']);
    if (t === 'cube') {
      const sd = R.int(2, 9);
      return frm(`V = s<sup>3</sup>`, `s = ${sd}`, 'V', sd * sd * sd, [`V = ${sd}<sup>3</sup> means ${sd} × ${sd} × ${sd}.`, `${sd} × ${sd} = ${sd * sd}, then ${sd * sd} × ${sd} = <b>${sd * sd * sd}</b>`]);
    }
    if (t === 'sqArea') {
      const sd = R.int(3, 15);
      return frm(`A = s<sup>2</sup>`, `s = ${sd}`, 'A', sd * sd, [`A = ${sd}<sup>2</sup> means ${sd} × ${sd}.`, `= <b>${sd * sd}</b>`]);
    }
    if (t === 'speedFrac') {
      const tm = R.pick([2, 3, 4, 5]), sp = R.pick([40, 50, 60, 70, 80, 90]), dd = sp * tm;
      return frm(`s = ${fracH('d', 't')}`, `d = ${dd} and t = ${tm}`, 's', sp, [`The line means divide: s = ${dd} ÷ ${tm}.`, `= <b>${sp}</b>`]);
    }
    if (t === 'perim') {
      const l = R.int(5, 20), w = R.int(2, l - 1);
      return frm(`P = 2l + 2w`, `l = ${l} and w = ${w}`, 'P', 2 * l + 2 * w, [`P = 2 × ${l} + 2 × ${w}`, `= ${2 * l} + ${2 * w} = <b>${2 * l + 2 * w}</b>`]);
    }
    if (t === 'tri') {
      const b = R.pick([4, 6, 8, 10, 12, 14]), h = R.int(3, 15);
      return frm(`A = ${N.fracHtml(1, 2)}bh`, `b = ${b} and h = ${h}`, 'A', b * h / 2, [`A = ${N.fracHtml(1, 2)} × ${b} × ${h}`, `= ${b / 2} × ${h} = <b>${b * h / 2}</b>`]);
    }
    if (t === 'speed') {
      const s = R.pick([40, 50, 60, 80, 100]), tm = R.pick([1.5, 2, 2.5, 3, 4]);
      return frm(`d = st`, `s = ${s} and t = ${f(tm)}`, 'd', s * tm, [`d = ${s} × ${f(tm)} = <b>${f(s * tm)}</b>`]);
    }
    if (t === 'vel') {
      const u = R.int(0, 20), a = R.int(2, 10), tm = R.int(2, 9);
      return frm(`v = u + at`, `u = ${u}, a = ${a} and t = ${tm}`, 'v', u + a * tm, [`v = ${u} + ${a} × ${tm}`, `= ${u} + ${a * tm} = <b>${u + a * tm}</b>`]);
    }
    if (t === 'vol') {
      const l = R.int(2, 9), w = R.int(2, 9), h = R.int(2, 9);
      return frm(`V = lwh`, `l = ${l}, w = ${w} and h = ${h}`, 'V', l * w * h, [`V = ${l} × ${w} × ${h}`, `= ${l * w} × ${h} = <b>${l * w * h}</b>`]);
    }
    if (t === 'fahr') {
      const c = R.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 100]);
      return frm(`F = 1.8C + 32`, `C = ${c}`, 'F', 1.8 * c + 32, [`F = 1.8 × ${c} + 32`, `= ${f(1.8 * c)} + 32 = <b>${f(1.8 * c + 32)}</b>`]);
    }
    if (t === 'cels') {
      const c = R.pick([5, 10, 15, 20, 25, 30, 35, 40]), fa = c * 9 / 5 + 32;
      return frm(`C = ${fracH('5(F − 32)', 9)}`, `F = ${f(fa)}`, 'C', c, [`C = 5 × (${f(fa)} − 32) ÷ 9`, `= 5 × ${f(fa - 32)} ÷ 9 = ${f(5 * (fa - 32))} ÷ 9 = <b>${c}</b>`]);
    }
    const a = R.int(1, 20), b = R.int(1, 20), c = 3 * R.int(5, 20) - a - b;
    if (c < 0) return formula();
    return frm(`m = ${fracH('a + b + c', 3)}`, `a = ${a}, b = ${b} and c = ${c}`, 'm', (a + b + c) / 3, [`m = (${a} + ${b} + ${c}) ÷ 3`, `= ${a + b + c} ÷ 3 = <b>${(a + b + c) / 3}</b>`]);
  }
  function frm(formula, given, out, ans, working) {
    return {
      prompt: `Use the formula <b>${formula}</b> to find ${out} when ${given}.`,
      answer: { type: 'number', value: ans },
      hint: 'Write the formula out again with the numbers in place of the letters. Letters next to each other mean multiply.',
      working: [`Put the numbers in: ${given}.`, ...working],
      finalAnswer: `${out} = ${f(ans)}`,
      skill: 'formula',
    };
  }

  /* ---------- write an expression from words (choice) ---------- */
  function fromWords(level) {
    const v = R.pick(['n', 'x', 'y']);
    const a = R.int(2, 9), b = R.int(1, 12);
    const pool = [
      { w: `${b} more than ${v}`, r: `${v} + ${b}`, ws: [`${v} − ${b}`, `${b}${v}`, `${b} − ${v}`] },
      { w: `${b} less than ${v}`, r: `${v} − ${b}`, ws: [`${b} − ${v}`, `${v} + ${b}`, `${v} ÷ ${b}`] },
      { w: `${v} multiplied by ${a}`, r: `${a}${v}`, ws: [`${v} + ${a}`, `${v}<sup>${a}</sup>`, `${v} ÷ ${a}`] },
      { w: `${v} divided by ${a}`, r: `${fracH(v, a)}`, ws: [`${a}${v}`, `${fracH(a, v)}`, `${v} − ${a}`] },
      { w: `double ${v}`, r: `2${v}`, ws: [`${v}<sup>2</sup>`, `${v} + 2`, `${v} ÷ 2`] },
      { w: `${v} squared`, r: `${v}<sup>2</sup>`, ws: [`2${v}`, `${v} + 2`, `${v} × 2`] },
      { w: `half of ${v}`, r: `${fracH(v, 2)}`, ws: [`2${v}`, `${v} − 2`, `${v}<sup>2</sup>`] },
      { w: `double ${v}, then add ${b}`, r: `2${v} + ${b}`, ws: [`2(${v} + ${b})`, `${v}<sup>2</sup> + ${b}`, `${b}${v} + 2`] },
      { w: `multiply ${v} by ${a}, then take away ${b}`, r: `${a}${v} − ${b}`, ws: [`${a}(${v} − ${b})`, `${b} − ${a}${v}`, `${a}${v} + ${b}`] },
    ];
    const pool2 = [
      { w: `multiply ${v} by ${a}, then add ${b}`, r: `${a}${v} + ${b}`, ws: [`${a}(${v} + ${b})`, `${a}${v} − ${b}`, `${v} + ${a}${b}`] },
      { w: `multiply ${v} by ${a}, then subtract ${b}`, r: `${a}${v} − ${b}`, ws: [`${a}(${v} − ${b})`, `${b} − ${a}${v}`, `${a}${v} + ${b}`] },
      { w: `add ${b} to ${v}, then multiply by ${a}`, r: `${a}(${v} + ${b})`, ws: [`${a}${v} + ${b}`, `${v} + ${a}${b}`, `${a}${v} + ${a}`] },
      { w: `${b} more than ${a} lots of ${v}`, r: `${a}${v} + ${b}`, ws: [`${b}${v} + ${a}`, `${a}(${v} + ${b})`, `${a} + ${b}${v}`] },
      { w: `${b} less than double ${v}`, r: `2${v} − ${b}`, ws: [`${b} − 2${v}`, `2(${v} − ${b})`, `${v}<sup>2</sup> − ${b}`] },
      { w: `divide ${v} by ${a}, then add ${b}`, r: `${fracH(v, a)} + ${b}`, ws: [`${fracH(`${v} + ${b}`, a)}`, `${a}${v} + ${b}`, `${fracH(a, v)} + ${b}`] },
      { w: `square ${v}, then add ${b}`, r: `${v}<sup>2</sup> + ${b}`, ws: [`2${v} + ${b}`, `(${v} + ${b})<sup>2</sup>`, `${v} + ${b}<sup>2</sup>`] },
      { w: `multiply ${v} by ${a}, then subtract ${b} from the answer`, r: `${a}${v} − ${b}`, ws: [`${a}(${v} − ${b})`, `${b} − ${a}${v}`, `${v} − ${a}${b}`] },
    ];
    const pool3 = [
      { w: `add ${b} to ${v}, then divide by ${a}`, r: `${fracH(`${v} + ${b}`, a)}`, ws: [`${fracH(v, a)} + ${b}`, `${a}(${v} + ${b})`, `${v} + ${fracH(b, a)}`] },
      { w: `square ${v}, then subtract ${b}`, r: `${v}<sup>2</sup> − ${b}`, ws: [`(${v} − ${b})<sup>2</sup>`, `2${v} − ${b}`, `${b} − ${v}<sup>2</sup>`] },
      { w: `subtract ${v} from ${b}, then multiply by ${a}`, r: `${a}(${b} − ${v})`, ws: [`${a}(${v} − ${b})`, `${a}${b} − ${v}`, `${b} − ${a}${v}`] },
      { w: `the sum of ${v} and ${b}, all multiplied by ${a}`, r: `${a}(${v} + ${b})`, ws: [`${a}${v} + ${b}`, `${v} + ${a}${b}`, `${a}${v}${b}`] },
      { w: `${a} times the difference between ${v} and ${b}`, r: `${a}(${v} − ${b})`, ws: [`${a}${v} − ${b}`, `${a} − ${v} − ${b}`, `${a}${v} − ${a}`] },
    ];
    const item = R.pick(level === 1 ? pool : level === 2 ? pool2.concat(pool.slice(0, 3)) : pool3.concat(pool2.slice(0, 3)));
    const choices = R.shuffle([item.r, ...item.ws]);
    return {
      prompt: `Which expression means "<b>${item.w}</b>"?`,
      answer: { type: 'choice', value: choices.indexOf(item.r), choices },
      hint: 'Read it slowly, one action at a time. "More than" means add, "less than" means subtract, "lots of" or "times" means multiply. Do the first action first.',
      working: [`Start with ${v}.`, `Follow the words in order: "${item.w}".`, `Expression: <b>${item.r}</b>`],
      finalAnswer: item.r,
      skill: 'from-words',
    };
  }

  /* ---------- collect like terms (text) ---------- */
  function likeTerms(level) {
    const v = R.pick(VARS);
    if (level === 1) {
      const a = R.int(2, 8), b = R.int(1, 7);
      const plus = R.chance(0.65);
      const k = plus ? a + b : Math.max(a, b) - Math.min(a, b);
      const big = Math.max(a, b), small = Math.min(a, b);
      const shown = plus ? `${a}${v} + ${b}${v}` : `${big}${v} − ${small}${v}`;
      if (k === 0) return likeTerms(1);
      return {
        prompt: `Simplify: <b>${shown}</b>`,
        answer: textAnswer({ k, v }, { k: 0, v: '' }, { placeholder: `e.g. 4${v}` }),
        hint: `${a}${v} means ${a} lots of ${v}. Count how many ${v}s there are altogether.`,
        working: [`Both terms are "${v}" terms, so they are like terms.`, plus ? `${a} + ${b} = ${k}, so the answer is <b>${k}${v}</b>.` : `${big} − ${small} = ${k}, so the answer is <b>${termText(k, v)}</b>.`],
        finalAnswer: termText(k, v),
        skill: 'like-terms',
      };
    }
    if (level === 2) {
      // ax + b + cx  or  ax + b + cx + d
      const a = R.int(2, 7), c = R.int(1, 7), b = R.int(1, 9), d = R.chance(0.5) ? 0 : R.int(1, 9);
      const sub = R.chance(0.4);
      const kx = sub ? a - c : a + c, kc = b + d;
      if (kx === 0) return likeTerms(2);
      const parts = [`${a}${v}`, `+ ${b}`, `${sub ? '−' : '+'} ${termText(c, v)}`];
      if (d) parts.push(`+ ${d}`);
      const shown = parts.join(' ');
      return {
        prompt: `Simplify by collecting like terms: <b>${shown}</b>`,
        answer: textAnswer({ k: kx, v }, { k: kc, v: '' }),
        hint: `Collect the ${v} terms together, then collect the plain numbers. Keep the sign that is in front of each term.`,
        working: [
          `${v} terms: ${a}${v} ${sub ? '−' : '+'} ${termText(c, v)} = ${termText(kx, v)}.`,
          d ? `Numbers: ${b} + ${d} = ${kc}.` : `Number: ${b}.`,
          `Answer: <b>${exprText({ k: kx, v }, { k: kc, v: '' })}</b>`,
        ],
        finalAnswer: exprText({ k: kx, v }, { k: kc, v: '' }),
        skill: 'like-terms',
      };
    }
    // level 3: negatives, two variables
    const w = R.pick(VARS.filter((s) => s !== v));
    const two = R.chance(0.5);
    const a = R.int(2, 9), c = R.nz(9), b = R.nz(9), d = R.nz(9);
    if (two) {
      // ax + by + cx + dy  → (a+c)x + (b+d)y
      const kx = a + c, ky = b + d;
      if (kx === 0 || ky === 0) return likeTerms(3);
      const sgn = (k) => (k < 0 ? '−' : '+');
      const shown = `${a}${v} ${sgn(b)} ${termText(Math.abs(b), w)} ${sgn(c)} ${termText(Math.abs(c), v)} ${sgn(d)} ${termText(Math.abs(d), w)}`;
      return {
        prompt: `Simplify by collecting like terms: <b>${shown}</b>`,
        answer: textAnswer({ k: kx, v }, { k: ky, v: w }),
        hint: `Collect the ${v} terms, then the ${w} terms. The sign in front of a term belongs to it.`,
        working: [
          `${v} terms: ${a}${v} ${sgn(c)} ${termText(Math.abs(c), v)} = ${termText(kx, v)}.`,
          `${w} terms: ${termText(b, w)} ${sgn(d)} ${termText(Math.abs(d), w)} = ${termText(ky, w)}.`,
          `Answer: <b>${exprText({ k: kx, v }, { k: ky, v: w })}</b>`,
        ],
        finalAnswer: exprText({ k: kx, v }, { k: ky, v: w }),
        skill: 'like-terms',
      };
    }
    const kx = a + c, kc = b + d;
    if (kx === 0 || kc === 0) return likeTerms(3);
    const sgn = (k) => (k < 0 ? '−' : '+');
    const shown = `${a}${v} ${sgn(b)} ${Math.abs(b)} ${sgn(c)} ${termText(Math.abs(c), v)} ${sgn(d)} ${Math.abs(d)}`;
    return {
      prompt: `Simplify by collecting like terms: <b>${shown}</b>`,
      answer: textAnswer({ k: kx, v }, { k: kc, v: '' }),
      hint: `Collect the ${v} terms (with their signs), then the numbers (with their signs).`,
      working: [
        `${v} terms: ${a}${v} ${sgn(c)} ${termText(Math.abs(c), v)} = ${termText(kx, v)}.`,
        `Numbers: ${f(b)} ${sgn(d)} ${Math.abs(d)} = ${f(kc)}.`,
        `Answer: <b>${exprText({ k: kx, v }, { k: kc, v: '' })}</b>`,
      ],
      finalAnswer: exprText({ k: kx, v }, { k: kc, v: '' }),
      skill: 'like-terms',
    };
  }

  /* ---------- multiply terms (text) ---------- */
  function multiply(level) {
    const v = R.pick(VARS), w = R.pick(VARS.filter((s) => s !== v));
    const sq = (s) => `${s}²`;
    if (level === 1) {
      const a = R.int(2, 9), b = R.int(2, 9);
      const swap = R.chance(0.3);
      return {
        prompt: `Simplify: <b>${swap ? `${b}${v} × ${a}` : `${a} × ${b}${v}`}</b>`,
        answer: { type: 'text', value: `${a * b}${v}`, accept: [`${a * b} ${v}`, `${a * b}×${v}`, `${a * b}*${v}`], placeholder: `e.g. 12${v}` },
        hint: `${b}${v} means ${b} × ${v}. Multiply the numbers together and keep the letter.`,
        working: [`${a} × ${b}${v} = ${a} × ${b} × ${v}.`, `${a} × ${b} = ${a * b}, so the answer is <b>${a * b}${v}</b>.`],
        finalAnswer: `${a * b}${v}`,
        skill: 'multiply-terms',
      };
    }
    const kind = level === 2 ? R.pick(['vv', 'vv', 'avbw', 'avw', 'avb']) : R.pick(['avav', 'avav', 'avbv', 'avbw3', 'vvv']);
    if (kind === 'vv') return {
      prompt: `Simplify: <b>${v} × ${v}</b>`,
      answer: { type: 'text', value: sq(v), accept: [`${v}^2`, `${v}**2`, `${v}${v}`], placeholder: `e.g. ${v}^2` },
      hint: 'A letter times itself is the letter squared. Type ^2 for the little 2.',
      working: [`${v} × ${v} means ${v} used twice as a factor.`, `That is <b>${sq(v)}</b> (type ${v}^2).`],
      finalAnswer: sq(v),
      skill: 'multiply-terms',
    };
    if (kind === 'avbw') {
      const a = R.int(2, 6), b = R.int(2, 6);
      return {
        prompt: `Simplify: <b>${a}${v} × ${b}${w}</b>`,
        answer: { type: 'text', value: `${a * b}${v}${w}`, accept: [`${a * b}${w}${v}`, `${a * b} ${v}${w}`, `${a * b}${v}*${w}`], placeholder: `e.g. 6${v}${w}` },
        hint: 'Multiply the numbers together, then write the letters next to each other.',
        working: [`Numbers: ${a} × ${b} = ${a * b}.`, `Letters: ${v} × ${w} = ${v}${w}.`, `Answer: <b>${a * b}${v}${w}</b>`],
        finalAnswer: `${a * b}${v}${w}`,
        skill: 'multiply-terms',
      };
    }
    if (kind === 'avw') {
      const a = R.int(2, 9);
      return {
        prompt: `Simplify: <b>${a}${v} × ${w}</b>`,
        answer: { type: 'text', value: `${a}${v}${w}`, accept: [`${a}${w}${v}`, `${a} ${v}${w}`, `${a}${v}*${w}`], placeholder: `e.g. 6${v}${w}` },
        hint: 'Keep the number, and write the two letters next to each other.',
        working: [`${a}${v} × ${w} = ${a} × ${v} × ${w}.`, `Answer: <b>${a}${v}${w}</b>`],
        finalAnswer: `${a}${v}${w}`,
        skill: 'multiply-terms',
      };
    }
    if (kind === 'avb') {
      const a = R.int(2, 9), b = R.int(2, 9);
      return {
        prompt: `Simplify: <b>${a}${v} × ${b}</b>`,
        answer: { type: 'text', value: `${a * b}${v}`, accept: [`${a * b} ${v}`, `${a * b}*${v}`], placeholder: `e.g. 12${v}` },
        hint: 'Multiply the numbers together and keep the letter.',
        working: [`${a} × ${b} = ${a * b}.`, `Answer: <b>${a * b}${v}</b>`],
        finalAnswer: `${a * b}${v}`,
        skill: 'multiply-terms',
      };
    }
    if (kind === 'avav' || kind === 'avbv') {
      const a = R.int(2, 7), b = kind === 'avav' ? a : R.int(2, 7);
      return {
        prompt: `Simplify: <b>${a}${v} × ${b}${v}</b>`,
        answer: { type: 'text', value: `${a * b}${sq(v)}`, accept: [`${a * b}${v}^2`, `${a * b}${v}**2`, `${a * b} ${v}^2`, `${a * b}${v}${v}`], placeholder: `e.g. 12${v}^2` },
        hint: `Numbers: ${a} × ${b}. Letters: ${v} × ${v} = ${sq(v)}.`,
        working: [`Numbers: ${a} × ${b} = ${a * b}.`, `Letters: ${v} × ${v} = ${sq(v)}.`, `Answer: <b>${a * b}${sq(v)}</b> (type ${a * b}${v}^2).`],
        finalAnswer: `${a * b}${sq(v)}`,
        skill: 'multiply-terms',
      };
    }
    if (kind === 'vvv') {
      return {
        prompt: `Simplify: <b>${v} × ${v} × ${v}</b>`,
        answer: { type: 'text', value: `${v}³`, accept: [`${v}^3`, `${v}**3`, `${v}${v}${v}`], placeholder: `e.g. ${v}^3` },
        hint: 'Count how many times the letter is multiplied. That is the power.',
        working: [`${v} is used three times as a factor.`, `Answer: <b>${v}³</b> (type ${v}^3).`],
        finalAnswer: `${v}³`,
        skill: 'multiply-terms',
      };
    }
    const a = R.int(2, 5), b = R.int(2, 5), c = R.int(2, 3);
    return {
      prompt: `Simplify: <b>${a}${v} × ${b}${w} × ${c}</b>`,
      answer: { type: 'text', value: `${a * b * c}${v}${w}`, accept: [`${a * b * c}${w}${v}`, `${a * b * c} ${v}${w}`], placeholder: `e.g. 24${v}${w}` },
      hint: 'Multiply all the numbers, then write the letters together.',
      working: [`Numbers: ${a} × ${b} × ${c} = ${a * b * c}.`, `Letters: ${v}${w}.`, `Answer: <b>${a * b * c}${v}${w}</b>`],
      finalAnswer: `${a * b * c}${v}${w}`,
      skill: 'multiply-terms',
    };
  }

  /* ---------- dividing terms: 12x ÷ 3 = 4x, 20ab ÷ 4a = 5b ---------- */
  function divideTerms(level) {
    const v = R.pick(VARS), w = R.pick(VARS.filter((s) => s !== v));
    const kind = level >= 3 ? R.pick(['num', 'twoLetter', 'twoLetter', 'same']) : R.pick(['num', 'num', 'num', 'twoLetter']);
    const asFrac = R.chance(0.35);
    const shown = (top, bot) => (asFrac ? fracH(top, bot) : `${top} ÷ ${bot}`);
    const q = (top, bot, value, accept, hint, working, ph) => ({
      prompt: `Simplify: <b>${shown(top, bot)}</b>`,
      answer: { type: 'text', value, accept, placeholder: ph },
      hint,
      working,
      finalAnswer: value,
      skill: 'divide-terms',
    });
    if (kind === 'num') {
      const a = R.int(2, level === 2 ? 6 : 9), b = R.int(2, 9), top = a * b;
      return q(`${top}${v}`, `${a}`, `${b}${v}`, [`${b} ${v}`, `${b}*${v}`, `${b}×${v}`], `${top}${v} means ${top} lots of ${v}. Share them into ${a} equal groups: divide the number, keep the ${v}.`, [
        `Numbers: ${top} ÷ ${a} = ${b}.`,
        `The ${v} is not divided by anything, so it stays.`,
        `Answer: <b>${b}${v}</b>`,
      ], `e.g. 4${v}`);
    }
    if (kind === 'same') {
      const a = R.int(2, 9), b = R.int(2, 9), top = a * b;
      return q(`${top}${v}`, `${a}${v}`, `${b}`, [`${b}.0`], `Divide the numbers, then divide ${v} by ${v}. Anything divided by itself is 1.`, [
        `Numbers: ${top} ÷ ${a} = ${b}.`,
        `Letters: ${v} ÷ ${v} = 1, so the letter disappears.`,
        `Answer: <b>${b}</b>`,
      ], 'e.g. 4');
    }
    const a = R.int(2, 6), b = R.int(2, 9), top = a * b;
    const flip = R.chance(0.5);
    const topTerm = flip ? `${top}${w}${v}` : `${top}${v}${w}`;
    return q(topTerm, `${a}${v}`, `${b}${w}`, [`${b} ${w}`, `${b}*${w}`, `${b}×${w}`], `Do the numbers first (${top} ÷ ${a}), then cancel the letter that is on the top and the bottom.`, [
      `Numbers: ${top} ÷ ${a} = ${b}.`,
      `Letters: there is a ${v} on the top and a ${v} on the bottom, so they <b>cancel</b>. The ${w} has nothing to cancel with, so it stays.`,
      `Answer: <b>${b}${w}</b>`,
    ], `e.g. 5${w}`);
  }

  /* ---------- 2x is NOT x²  ---------- */
  function powerVsDouble(level) {
    const v = R.pick(['x', 'n', 'y', 'a']);
    const t = level === 1 ? R.pick(['means', 'means', 'compare']) : R.pick(['compare', 'compare', 'means']);
    if (t === 'means') {
      const timesItself = R.chance(0.5);
      const right = timesItself ? `${v}<sup>2</sup>` : `2${v}`;
      const choices = R.shuffle([`${v}<sup>2</sup>`, `2${v}`, `${v} + 2`, `${fracH(v, 2)}`]);
      return {
        prompt: `Which expression means "<b>${timesItself ? `${v} × ${v}` : `${v} + ${v}`}</b>"?`,
        answer: { type: 'choice', value: choices.indexOf(right), choices },
        hint: `${v}<sup>2</sup> means ${v} <b>times</b> ${v}. 2${v} means ${v} <b>plus</b> ${v} (two lots of ${v}). They are different!`,
        working: [
          `2${v} means two lots of ${v}: ${v} + ${v}.`,
          `${v}<sup>2</sup> means ${v} multiplied by itself: ${v} × ${v}.`,
          `"${timesItself ? `${v} × ${v}` : `${v} + ${v}`}" is <b>${right}</b>.`,
        ],
        finalAnswer: right,
        skill: 'power-vs-double',
      };
    }
    const k = R.chance(0.18) ? 2 : R.pick([1, 3, 4, 5, 6, 7, 8, 10]);
    const dbl = 2 * k, sq = k * k;
    const choices = [`2${v}`, `${v}<sup>2</sup>`, 'They are equal'];
    const value = sq > dbl ? 1 : sq < dbl ? 0 : 2;
    return {
      prompt: `When ${v} = ${k}, which is bigger: <b>2${v}</b> or <b>${v}<sup>2</sup></b>?`,
      answer: { type: 'choice', value, choices },
      hint: `Work out both. 2${v} means 2 × ${k}. ${v}<sup>2</sup> means ${k} × ${k}.`,
      working: [
        `2${v} = 2 × ${k} = ${dbl}.`,
        `${v}<sup>2</sup> = ${k} × ${k} = ${sq}.`,
        value === 2 ? `${dbl} and ${sq} are the same: ${v} = 2 is the one value where they match!` : `${Math.max(dbl, sq)} is bigger, so <b>${choices[value]}</b> is bigger.`,
      ],
      finalAnswer: choices[value],
      skill: 'power-vs-double',
    };
  }

  function calc(level) {
    const r = Math.random();
    if (r < 0.08) return powerVsDouble(level);
    if (r < 0.18) return level === 1 ? fromWords(level) : divideTerms(level);
    if (r < 0.62) return substitution(level);
    if (r < 0.75) return fromWords(level);
    if (r < 0.88) return likeTerms(level);
    return multiply(level);
  }

  /* ---------- word problems ----------
   * Level 1: one step, small friendly numbers, the question asked straight out.
   * Level 2: two steps — substitute into a given formula, or build an expression from two parts.
   * Level 3: multi-step — compare two options, work backwards, or write AND simplify. */
  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['lollies', 'pies', 'netball', 'trays', 'pocket', 'stickers'])
      : level === 2 ? R.pick(['kayak', 'perimEval', 'bus', 'phone', 'canteen', 'court', 'piesDrink'])
      : R.pick(['plans', 'tables', 'backwards', 'gala', 'simplify', 'trip']);
      /* ----- level 1 ----- */
      if (t === 'lollies') {
        const more = R.int(2, 6);
        const right = `n + ${more}`;
        const choices = R.shuffle([right, `${more}n`, `n − ${more}`, `${more} − n`]);
        return {
          prompt: `A bag holds n lollies. ${name} puts ${more} more lollies in the bag. Which expression gives the number of lollies in the bag now?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: '"More" means <b>add</b>. Start with what you already have: n.',
          working: [`Start with what is in the bag: n.`, `${more} more means add ${more}.`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'pies') {
        const price = R.pick([3, 4, 5, 6]);
        const right = `${price}n`;
        const choices = R.shuffle([right, `n + ${price}`, `n − ${price}`, fracH('n', price)]);
        return {
          prompt: `A pie at the school canteen costs $${price}. Which expression gives the cost of n pies?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: `Each pie is $${price}, so n pies cost ${price} × n.`,
          working: [`One pie: $${price}.`, `n pies: ${price} × n.`, `We write that without the ×: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'netball') {
        const g = R.int(2, 5);
        const right = `${g}n`;
        const choices = R.shuffle([right, `n + ${g}`, `n − ${g}`, fracH('n', g)]);
        return {
          prompt: `A netball team scores n goals in the first quarter. In the whole game they score ${g} times as many. Which expression gives the goals scored in the whole game?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: '"Times as many" means multiply.',
          working: [`${g} times n is ${g} × n.`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'trays') {
        const per = R.int(3, 8), rows = R.int(3, 9);
        const ans = per * rows;
        return {
          prompt: `A tray of muffins holds ${per}r muffins, where r is the number of rows. How many muffins are on a tray with ${rows} rows?`,
          answer: { type: 'number', value: ans, unit: 'muffins' },
          hint: `${per}r means ${per} × r. Swap r for ${rows}.`,
          working: [`${per}r means ${per} × r.`, `Swap r for ${rows}: ${per} × ${rows} = ${ans}.`, `<b>${ans} muffins</b>`],
          finalAnswer: `${ans} muffins`,
        };
      }
      if (t === 'pocket') {
        const per = R.pick([4, 5, 6, 8, 10]);
        const right = `${per}w`;
        const choices = R.shuffle([right, `w + ${per}`, `w − ${per}`, fracH('w', per)]);
        return {
          prompt: `${name} gets $${per} pocket money every week. Which expression gives the total pocket money after w weeks?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: `Each week adds $${per}, so w weeks give ${per} × w.`,
          working: [`One week: $${per}.`, `w weeks: ${per} × w.`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'stickers') {
        const gone = R.int(2, 7);
        const right = `s − ${gone}`;
        const choices = R.shuffle([right, `s + ${gone}`, `${gone} − s`, `${gone}s`]);
        return {
          prompt: `${name} has s stickers and gives ${gone} of them away. Which expression gives the number of stickers left?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: 'Giving away means <b>take off</b>. Start from what she had: s.',
          working: [`Start with s stickers.`, `Give ${gone} away: take ${gone} off.`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }

      /* ----- level 2 ----- */
      if (t === 'piesDrink') {
        const n = R.int(2, 6), drink = R.int(2, 5);
        const right = `${n}p + ${drink}`;
        const choices = R.shuffle([right, `${n}(p + ${drink})`, `p + ${n + drink}`, `${drink}p + ${n}`]);
        return {
          prompt: `At the school canteen a pie costs $p. Which expression gives the cost of ${n} pies and one $${drink} drink?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: `${n} pies cost ${n} × p. The drink is bought once, so it is just added on.`,
          working: [`${n} pies at $p each: ${n}p.`, `Add the one drink: ${n}p + ${drink}.`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'kayak') {
        const base = R.pick([10, 12, 15, 20]), per = R.pick([6, 8, 10, 12]), h = R.int(2, 6);
        const cost = base + per * h;
        return {
          prompt: `Hiring a kayak at the beach costs a $${base} booking fee plus $${per} an hour, so C = ${base} + ${per}h dollars. Find the cost of hiring it for ${h} hours.`,
          answer: { type: 'number', value: cost, unit: '$' },
          hint: `Replace h with ${h}. Multiply before you add.`,
          working: [`C = ${base} + ${per} × ${h}`, `${per} × ${h} = ${per * h}.`, `${base} + ${per * h} = <b>$${cost}</b>`],
          finalAnswer: `$${cost}`,
        };
      }
      if (t === 'perimEval') {
        const w = R.int(2, 9), x = R.int(3, 12);
        const ans = 2 * x + 2 * w;
        return {
          prompt: `A vege garden is x m long and ${w} m wide, so its perimeter is P = 2x + ${2 * w} metres. How many metres of edging are needed when x = ${x}?`,
          answer: { type: 'number', value: ans, unit: 'm' },
          hint: `Swap x for ${x} in 2x + ${2 * w}. Do the × first.`,
          working: [`P = 2 × ${x} + ${2 * w}`, `2 × ${x} = ${2 * x}.`, `${2 * x} + ${2 * w} = <b>${ans} m</b>`],
          finalAnswer: `${ans} m`,
        };
      }
      if (t === 'bus') {
        const fare = R.pick([2, 3, 4, 5]), kids = R.int(2, 6);
        const right = `${fare}(k + ${kids})`;
        const choices = R.shuffle([right, `${fare}k + ${kids}`, `k + ${fare * kids}`, `${fare}k − ${kids}`]);
        return {
          prompt: `A bus ticket into town costs $${fare}. A group of k adults and ${kids} children all pay the same fare. Which expression gives the total cost?`,
          answer: { type: 'choice', value: choices.indexOf(right), choices },
          hint: `First find how many people: k + ${kids}. Then multiply by the fare.`,
          working: [`Number of people: k + ${kids}.`, `Each pays $${fare}: ${fare} × (k + ${kids}).`, `Expression: <b>${right}</b>`],
          finalAnswer: right,
        };
      }
      if (t === 'phone') {
        const base = R.pick([20, 25, 30, 40]), per = R.pick([0.5, 1, 2]), mins = R.pick([40, 50, 60, 80, 100, 120]);
        const cost = base + per * mins;
        return {
          prompt: `A phone plan costs C = ${base} + ${f(per)}m dollars a month, where m is the number of extra minutes. Find the cost when m = ${mins}.`,
          answer: { type: 'number', value: cost, unit: '$' },
          hint: `Replace m with ${mins}, multiply, then add ${base}.`,
          working: [`C = ${base} + ${f(per)} × ${mins}`, `${f(per)} × ${mins} = ${f(per * mins)}.`, `${base} + ${f(per * mins)} = <b>$${f(cost)}</b>`],
          finalAnswer: `$${f(cost)}`,
        };
      }
      if (t === 'canteen') {
        const p1 = R.int(2, 5), d1 = R.int(1, 4), p2 = R.int(1, 4), d2 = R.int(1, 4);
        const t1 = { k: p1 + p2, v: 'p' }, t2 = { k: d1 + d2, v: 'd' };
        const ans = exprText(t1, t2);
        return {
          prompt: `At the gala ${name} buys ${N.plural(p1, 'pie')} at $p each and ${N.plural(d1, 'drink')} at $d each. A friend buys ${N.plural(p2, 'pie')} and ${N.plural(d2, 'drink')}. Write an expression for what they spend altogether, in its simplest form.`,
          answer: textAnswer(t1, t2, { placeholder: 'e.g. 5p + 3d' }),
          hint: 'Add the pies to the pies and the drinks to the drinks. Pies and drinks are different, so they stay apart.',
          working: [
            `${name}: ${termText(p1, 'p')} + ${termText(d1, 'd')}. The friend: ${termText(p2, 'p')} + ${termText(d2, 'd')}.`,
            `Pies together: ${p1}p + ${p2}p = ${termText(p1 + p2, 'p')}.`,
            `Drinks together: ${d1}d + ${d2}d = ${termText(d1 + d2, 'd')}.`,
            `Altogether: <b>${ans}</b>`,
          ],
          finalAnswer: ans,
        };
      }
      if (t === 'court') {
        const l = R.int(6, 18), w = R.int(3, l);
        const ans = 2 * l + 2 * w;
        return {
          prompt: `A netball court section is a rectangle with length l = ${l} m and width w = ${w} m. Use P = 2l + 2w to find the perimeter.`,
          answer: { type: 'number', value: ans, unit: 'm' },
          hint: 'Put the numbers into the formula: 2 × length + 2 × width.',
          working: [`P = 2 × ${l} + 2 × ${w}`, `= ${2 * l} + ${2 * w} = <b>${ans} m</b>`],
          finalAnswer: `${ans} m`,
        };
      }

      /* ----- level 3 ----- */
      if (t === 'plans') {
        const aBase = R.pick([20, 25, 30]), aPer = R.pick([0.5, 1]);
        const extra = R.pick([10, 15, 20]), bBase = aBase + extra, bPer = R.pick([0.1, 0.2, 0.25]);
        // put the minutes clearly on one side or the other of the crossover, so each plan wins about half the time
        const cross = extra / (aPer - bPer);
        const m = Math.max(10, Math.round((R.chance(0.5) ? cross * 0.4 : cross * 1.8) / 10) * 10);
        const aCost = N.round(aBase + aPer * m, 2), bCost = N.round(bBase + bPer * m, 2);
        if (aCost === bCost) return word(3);
        const cheaper = aCost < bCost ? 'Plan A' : 'Plan B';
        const choices = ['Plan A', 'Plan B'];
        return {
          prompt: `Two phone plans: Plan A costs C = ${aBase} + ${f(aPer)}m dollars and Plan B costs C = ${bBase} + ${f(bPer)}m dollars, where m is the number of extra minutes. ${name} uses ${m} extra minutes a month. Which plan is cheaper?`,
          answer: { type: 'choice', value: choices.indexOf(cheaper), choices },
          hint: `Work out both plans with m = ${m}, then compare the two answers.`,
          working: [
            `Plan A: ${aBase} + ${f(aPer)} × ${m} = ${aBase} + ${f(aPer * m)} = $${f(aCost)}.`,
            `Plan B: ${bBase} + ${f(bPer)} × ${m} = ${bBase} + ${f(bPer * m)} = $${f(bCost)}.`,
            `$${f(Math.min(aCost, bCost))} is less than $${f(Math.max(aCost, bCost))}.`,
            `<b>${cheaper}</b> is cheaper (by $${f(N.round(Math.abs(aCost - bCost), 2))}).`,
          ],
          finalAnswer: cheaper,
        };
      }
      if (t === 'tables') {
        const per = R.pick([4, 6]), ends = R.pick([2, 4]), n = R.pick([10, 12, 15, 20, 25]);
        const ans = per * n + ends;
        return {
          prompt: `Tables are pushed into one long row for the Matariki dinner. Each table seats ${per} people along the sides, and ${ends} more people sit at the two ends of the row. Work out the expression for n tables, then use it to find how many people can sit at ${n} tables.`,
          answer: { type: 'number', value: ans, unit: 'people' },
          hint: `Each table adds ${per} seats, so n tables give ${per}n. The ${ends} end seats are added once only.`,
          working: [
            `${per} seats per table: ${per}n.`,
            `Then the ${ends} end seats, once: rule is ${per}n + ${ends}.`,
            `Swap n for ${n}: ${per} × ${n} + ${ends} = ${per * n} + ${ends}.`,
            `<b>${ans} people</b>`,
          ],
          finalAnswer: `${ans} people`,
        };
      }
      if (t === 'backwards') {
        const base = R.pick([15, 20, 25, 30]), per = R.pick([6, 8, 10, 12]), h = R.int(3, 9);
        const paid = base + per * h;
        return {
          prompt: `Hiring a paddleboard costs C = ${base} + ${per}h dollars, where h is the number of hours. ${name} paid $${paid} in total. For how many hours was the paddleboard hired?`,
          answer: { type: 'number', value: h, unit: 'hours' },
          hint: `Take the $${base} booking fee off the total first, then see how many lots of $${per} are left.`,
          working: [
            `${base} + ${per}h = ${paid}.`,
            `Take off the booking fee: ${paid} − ${base} = ${paid - base}.`,
            `That is the hourly part: ${paid - base} ÷ ${per} = ${h}.`,
            `<b>${h} hours</b>`,
          ],
          finalAnswer: `${h} hours`,
        };
      }
      if (t === 'gala') {
        const a = R.int(5, 12), c = R.int(2, 8), na = R.int(2, 4), nc = R.int(2, 5), hours = R.int(3, 6);
        const ans = na * a + nc * c;
        return {
          prompt: `Entry to the school gala costs $a for an adult and $c for a child, so a family of ${na} adults and ${nc} children pays ${na}a + ${nc}c dollars. The gala runs for ${hours} hours. Find what the family pays when a = ${a} and c = ${c}.`,
          answer: { type: 'number', value: ans, unit: '$' },
          hint: `Swap a for ${a} and c for ${c}. The ${hours} hours is not needed here.`,
          working: [
            `${na}a = ${na} × ${a} = ${na * a}.`,
            `${nc}c = ${nc} × ${c} = ${nc * c}.`,
            `${na * a} + ${nc * c} = ${ans}. (The ${hours} hours was extra information.)`,
            `<b>$${ans}</b>`,
          ],
          finalAnswer: `$${ans}`,
        };
      }
      if (t === 'simplify') {
        const pie = R.int(3, 6), drink = R.int(2, 5), bag = R.int(1, 4);
        const t1 = { k: pie + drink, v: 'n' }, t2 = { k: bag, v: '' };
        const ans = exprText(t1, t2);
        return {
          prompt: `${name} buys n pies at $${pie} each and n drinks at $${drink} each, plus one bag for $${bag}. Write an expression for the total cost, in its simplest form.`,
          answer: textAnswer(t1, t2, { placeholder: 'e.g. 7n + 2' }),
          hint: `The pies cost ${pie}n and the drinks cost ${drink}n. Both are lots of n, so they collect together. The bag is just a number.`,
          working: [
            `Pies: ${pie} × n = ${pie}n. Drinks: ${drink} × n = ${drink}n.`,
            `${pie}n and ${drink}n are like terms: ${pie}n + ${drink}n = ${termText(pie + drink, 'n')}.`,
            `The bag is $${bag} once, so add ${bag}.`,
            `Total: <b>${ans}</b>`,
          ],
          finalAnswer: ans,
        };
      }
      // trip: substitute into a formula with brackets
      const each = R.pick([6, 8, 10, 12]), fixed = R.int(2, 6), n = R.int(4, 12);
      const ans = each * (n + fixed);
      return {
        prompt: `The cost of a school trip is C = ${each}(n + ${fixed}) dollars, where n is the number of students who sign up late. Find the cost when n = ${n}.`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: `Brackets first: work out ${n} + ${fixed}, then multiply by ${each}.`,
        working: [
          `C = ${each}(${n} + ${fixed})`,
          `Brackets first: ${n} + ${fixed} = ${n + fixed}.`,
          `${each} × ${n + fixed} = ${ans}.`,
          `<b>$${ans}</b>`,
        ],
        finalAnswer: `$${ans}`,
      };
  }

  HL.registerTopic({
    id: 'expressions', subject: 'maths', strand: 'algebra', order: 2,
    name: 'Expressions & substitution', short: 'Expressions',
    blurb: 'Letters stand for numbers. Write expressions, tidy them up, and swap in values.',
    example: '3x + 2 when x = 4 → 14 &nbsp;·&nbsp; 5x + 3x = 8x',
    animal: 'koala',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', PEACH = '#FFC79A', MINT = '#A6E3B8', SKY = '#A9D8F5', PINK = '#F9A8C9';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // a row of expression tokens; each token = [text, colour|null]. Coloured tokens get an ellipse round them.
      const tokens = (list, x0, y, size = 24) => { let x = x0, o = ''; list.forEach(([t, col]) => { const w = t.length * size * 0.62 + 4; if (col) o += `<ellipse cx="${x + w / 2}" cy="${y - size * 0.32}" rx="${w / 2 + 5}" ry="${size * 0.75}" fill="${col === ROSE ? PINK : SKY}" opacity="0.45"/><ellipse cx="${x + w / 2}" cy="${y - size * 0.32}" rx="${w / 2 + 5}" ry="${size * 0.75}" fill="none" stroke="${col}" stroke-width="2.5"/>`; o += `<text x="${x + w / 2}" y="${y}" text-anchor="middle" font-size="${size}" fill="${col || INK}">${t}</text>`; x += w + 16; }); return o; };
      const orange = (cx, cy, r = 9) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PEACH}" stroke="#E08A3C" stroke-width="1.5"/><path d="M${cx - 1} ${cy - r} q4 -5 6 -3" stroke="${GREEN}" stroke-width="2.5" fill="none"/>`;
      const oranges = (x0, y, n, col) => Array.from({ length: n }, (_, i) => orange(x0 + i * 22, y)).join('') + (col ? `<text x="${x0 + n * 22 - 4}" y="${y + 5}" fill="${col}">= ${n}</text>` : '');
      const down = (x, y1, y2, col, label) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - 8}" stroke="${col}" stroke-width="2.5"/><polygon points="${x},${y2} ${x - 6},${y2 - 10} ${x + 6},${y2 - 10}" fill="${col}"/>${label ? `<text x="${x + 10}" y="${(y1 + y2) / 2 + 5}" fill="${col}">${label}</text>` : ''}`;
      // rows × cols grid of dots, bottom row on baseY, centred on cx
      const dotGrid = (cx, baseY, rows, cols, sp, col) => { let o = ''; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o += `<circle cx="${cx - (cols - 1) * sp / 2 + c * sp}" cy="${baseY - (rows - 1) * sp + r * sp}" r="${sp * 0.33}" fill="${col}"/>`; return o; };
      // a small tile with a letter on it
      const tile = (x, y, t) => `<rect x="${x}" y="${y}" width="24" height="24" rx="5" fill="${PEACH}" stroke="${INK}" stroke-width="1.2"/><text x="${x + 12}" y="${y + 17}" text-anchor="middle" font-size="15" fill="${INK}">${t}</text>`;
      return {
      what: '<p>In algebra a <b>letter</b> (like x or n) stands for a number we do not know yet, or one that can change. An <b>expression</b> is a maths phrase using letters and numbers, like <b>3x + 2</b>. <b>3x</b> means 3 × x. <b>Substitution</b> means swapping the letter for a number and working it out. <b>Like terms</b> have exactly the same letter — think of them as <b>oranges</b>: you can only add oranges to oranges.</p>',
      visual: SVG(360, 220, `
        <text x="12" y="18" fill="${INK}">Collect like terms — oranges with oranges</text>
        ${tokens([['3x', ROSE], ['+', null], ['2', BLUE], ['+', null], ['5x', ROSE]], 22, 62)}
                <text x="22" y="104" font-size="20" fill="${ROSE}">3x + 5x = 8x</text>${oranges(200, 98, 3)}<text x="268" y="103" text-anchor="middle" fill="${ROSE}">+</text>${oranges(286, 98, 2)}
        <text x="22" y="136" font-size="22" fill="${INK}">= <tspan fill="${ROSE}">8x</tspan> + <tspan fill="${BLUE}">2</tspan></text>
        <text x="140" y="136" fill="${BLUE}">2 stays 2 — it is an apple</text>
        <line x1="12" y1="152" x2="348" y2="152" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="12" y="174" fill="${INK}">Substitute: swap the letter for the number</text>
        <text x="22" y="196" font-size="18" fill="${INK}">3<tspan fill="${ROSE}">x</tspan> + 2  when  <tspan fill="${ROSE}">x</tspan> = <tspan fill="${GREEN}">4</tspan></text><text x="22" y="216" font-size="18" fill="${INK}">→  3 × <tspan fill="${GREEN}">4</tspan> + 2 = 12 + 2 = <tspan fill="${GREEN}">14</tspan></text>`),
      facts: [
        '<b>3x</b> means <b>3 × x</b>. A letter on its own means <b>1x</b>',
        '<b>Substitute</b> = swap the letter for its number, then use <b>BEDMAS</b> (× before +)',
        '<b>Like terms</b> = exactly the same letter: 5x and 3x are like (oranges), 5x and 3 are not',
        'Collect like terms by adding the numbers in front: <b>5x + 3x = 8x</b>',
        'The sign <b>belongs to the term after it</b>: in 5x − 2x + 3 the "−2x" travels together',
        'Multiply terms: numbers × numbers, then letters: <b>2a × 3b = 6ab</b>, <b>a × a = a²</b>',
        '<b>2x</b> means x + x (two lots). <b>x²</b> means x × x. When x = 5: 2x = <b>10</b> but x² = <b>25</b>',
        '<b>Divide</b> terms: divide the numbers, then cancel any letter that is on the top <b>and</b> the bottom: <b>12x ÷ 3 = 4x</b>, <b>20ab ÷ 4a = 5b</b>',
      ],
      steps: [
        '<b>Substituting:</b> "Swap the letter for the number, brackets round negatives." 3x + 2 with x = −4 → 3(−4) + 2.',
        '"<b>Multiply before adding</b>": 3 × 4 = 12, then 12 + 2 = 14.',
        '<b>Collecting like terms:</b> "Are they the <b>same letter</b>? Then they are oranges — add the numbers in front." 5x + 3x = 8x.',
        '"Different letters or plain numbers? <b>Leave them apart</b>." 5x + 3 stays 5x + 3.',
        '<b>Multiplying terms:</b> "Numbers first, then write the letters together." 3 × 4a = 12a, 2a × 3b = 6ab, a × a = a².',
        '<b>From words:</b> "Do the actions in the order the words say." "Double n then add 3" → 2n + 3.',
      ],
      examples: [
        { q: 'Find 3x + 2 when x = 4',
          working: ['<b>Picture:</b> x is a box with a number hiding inside — today the number is 4.', '1. Which letter am I swapping? x → 4. So 3x + 2 becomes 3 × 4 + 2.', '2. Which comes first in BEDMAS, × or +? × first!', '3 × 4 = 12', '12 + 2 = 14'],
          a: '14',
          visual: SVG(360, 96, `<text x="20" y="34" font-size="24" fill="${INK}">3<tspan fill="${ROSE}">x</tspan> + 2</text>${down(52, 40, 66, GREEN, 'x = 4')}<text x="20" y="88" font-size="24" fill="${INK}">3 × <tspan fill="${GREEN}">4</tspan> + 2</text><text x="150" y="88" font-size="24" fill="${INK}">= 12 + 2 = <tspan fill="${GREEN}">14</tspan></text>`) },
        { q: 'Find 2a − 3b when a = 5 and b = −2',
          working: ['<b>Picture:</b> two boxes, a and b. Negative numbers go in brackets so the sign is not lost.', '1. Swap a → 5 and b → (−2): 2(5) − 3(−2).', '2. Multiply first: 2 × 5 = 10 and 3 × (−2) = −6.', '3. Now 10 − (−6). Two minuses together? That makes a plus: 10 + 6.', '10 + 6 = 16'],
          a: '16' },
        { q: 'Write "double n then add 3" as an expression',
          working: ['<b>Picture:</b> n goes into a machine — first it is doubled, then 3 is added on.', '1. What happens first? Double → 2n.', '2. What happens next? Add 3 → 2n + 3.', '3. Check with n = 5: double 5 is 10, add 3 gives 13. 2 × 5 + 3 = 13. Yes!'],
          a: '2n + 3',
          visual: SVG(360, 64, `<rect x="16" y="14" width="44" height="36" rx="8" fill="${PEACH}"/><text x="38" y="38" text-anchor="middle" font-size="20" fill="${INK}">n</text><text x="90" y="30" text-anchor="middle" fill="${ROSE}">× 2</text><line x1="66" y1="32" x2="112" y2="32" stroke="${ROSE}" stroke-width="2.5"/><polygon points="120,32 110,26 110,38" fill="${ROSE}"/><rect x="126" y="14" width="54" height="36" rx="8" fill="${PINK}"/><text x="153" y="38" text-anchor="middle" font-size="20" fill="${INK}">2n</text><text x="212" y="30" text-anchor="middle" fill="${BLUE}">+ 3</text><line x1="186" y1="32" x2="232" y2="32" stroke="${BLUE}" stroke-width="2.5"/><polygon points="240,32 230,26 230,38" fill="${BLUE}"/><rect x="246" y="14" width="98" height="36" rx="8" fill="${SKY}"/><text x="295" y="38" text-anchor="middle" font-size="20" fill="${INK}">2n + 3</text>`) },
        { q: 'Simplify 4x + 7 − x + 2',
          working: ['<b>Picture:</b> x terms are oranges, plain numbers are apples.', '1. Are 4x and −x like terms? Same letter x — yes! 4 oranges take away 1 orange = 3 oranges → 3x.', '2. Are 7 and 2 like terms? Both plain numbers — yes! 7 apples + 2 apples = 9 apples → 9.', '3. Can I add 3x and 9? Oranges and apples — no, so they stay apart.', '4x − x = 3x and 7 + 2 = 9'],
          a: '3x + 9',
          visual: SVG(360, 130, `${tokens([['4x', ROSE], ['+7', BLUE], ['−x', ROSE], ['+2', BLUE]], 22, 40)}<text x="22" y="90" font-size="20" fill="${ROSE}">4x − x = 3x</text><text x="190" y="90" font-size="20" fill="${BLUE}">7 + 2 = 9</text><text x="22" y="122" font-size="22" fill="${INK}">= <tspan fill="${ROSE}">3x</tspan> + <tspan fill="${BLUE}">9</tspan></text><text x="150" y="122" fill="${INK}">(keep them apart)</text>`) },
        { q: 'Simplify 2y × 3y',
          working: ['<b>Picture:</b> a × sign means "groups of", so the numbers and the letters can be multiplied separately.', '1. Numbers first: 2 × 3 = 6.', '2. Letters next: y × y = y² (y squared, not 2y).', '3. Put them together: 6y².'],
          a: '6y²' },
        { q: 'Hiring a kayak at Mission Bay costs C = 15 + 12h dollars, where h is the number of hours. Find the cost for 3 hours.',
          working: ['<b>Picture:</b> $15 to get the kayak, then $12 for every hour on the water.', '1. Which letter do I know? h = 3. Swap it in: C = 15 + 12 × 3.', '2. Which comes first, × or +? × first: 12 × 3 = 36.', 'C = 15 + 36 = 51'],
          a: '$51' },
        { q: 'When x = 5, which is bigger: 2x or x²?',
          working: ['<b>Picture:</b> 2x is <b>two rows</b> of 5 oranges. x² is a <b>square</b> of 5 rows of 5.', '1. What does 2x mean? Two lots of x: 5 + 5 = <b>10</b>.', '2. What does x² mean? x times itself: 5 × 5 = <b>25</b>.', '3. 25 is much bigger than 10, so <b>x²</b> wins. They are <b>not</b> the same thing!'],
          a: 'x² = 25 is bigger than 2x = 10',
          visual: SVG(360, 158, `<text x="180" y="16" text-anchor="middle" fill="${INK}">when x = 5</text>`
            + dotGrid(85, 108, 2, 5, 16, PINK) + `<text x="85" y="132" text-anchor="middle" font-size="18" fill="${ROSE}">2x = 10</text><text x="85" y="152" text-anchor="middle" fill="${ROSE}">two rows of 5</text>`
            + dotGrid(268, 108, 5, 5, 16, SKY) + `<text x="268" y="132" text-anchor="middle" font-size="18" fill="${BLUE}">x² = 25</text><text x="268" y="152" text-anchor="middle" fill="${BLUE}">a 5 by 5 square</text>`
            + `<line x1="176" y1="30" x2="176" y2="140" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>`) },
        { q: 'Simplify 12x ÷ 3',
          working: ['<b>Picture:</b> 12 oranges shared fairly into 3 bags. How many oranges in each bag?', '1. Do the numbers first: 12 ÷ 3 = <b>4</b>.', '2. Is the x divided by anything? There is <b>no x on the bottom</b>, so the x just stays.', '12x ÷ 3 = 4x'],
          a: '4x',
          visual: SVG(360, 136, `<text x="180" y="16" text-anchor="middle" fill="${INK}">12x shared into 3 equal groups</text>`
            + [0, 1, 2].map((r) => `<rect x="${104}" y="${24 + r * 32}" width="${132}" height="28" rx="7" fill="none" stroke="${ROSE}" stroke-width="2"/>` + [0, 1, 2, 3].map((c) => tile(110 + c * 32, 26 + r * 32, 'x')).join('')).join('')
            + `<text x="180" y="130" text-anchor="middle" font-size="16" fill="${GREEN}">each group gets 4 x's → 12x ÷ 3 = 4x</text>`) },
        { q: 'Simplify 20ab ÷ 4a',
          working: ['<b>Picture:</b> write it as a fraction, then <b>cross out</b> anything that is on the top AND the bottom.', '1. Numbers first: 20 ÷ 4 = <b>5</b>.', '2. Letters: there is an <b>a</b> on the top and an <b>a</b> on the bottom, so they <b>cancel</b>.', '3. The b has nothing to cancel with, so it stays.', '20ab ÷ 4a = 5b'],
          a: '5b',
          visual: SVG(360, 124, `
            <text x="52" y="52" text-anchor="middle" font-size="24" fill="${INK}">20ab</text>
            <line x1="16" y1="62" x2="88" y2="62" stroke="${INK}" stroke-width="2"/>
            <text x="52" y="90" text-anchor="middle" font-size="24" fill="${INK}">4a</text>
            <text x="104" y="72" font-size="24" fill="${INK}">=</text>`
            + ['5', '×', '4', '×', 'a', '×', 'b'].map((t, i) => `<text x="${146 + i * 22}" y="52" text-anchor="middle" font-size="19" fill="${t === '4' || t === 'a' ? ROSE : INK}">${t}</text>`).join('')
            + `<line x1="136" y1="62" x2="286" y2="62" stroke="${INK}" stroke-width="2"/>`
            + ['4', '×', 'a'].map((t, i) => `<text x="${190 + i * 22}" y="90" text-anchor="middle" font-size="19" fill="${t === '×' ? INK : ROSE}">${t}</text>`).join('')
            + [[190, 46], [234, 46], [190, 84], [234, 84]].map(([x, y]) => `<line x1="${x - 8}" y1="${y + 7}" x2="${x + 8}" y2="${y - 9}" stroke="${ROSE}" stroke-width="2.5"/>`).join('')
            + `<text x="300" y="72" font-size="24" fill="${GREEN}">= 5b</text>`
            + `<text x="180" y="116" text-anchor="middle" fill="${ROSE}">the 4 and the a cancel out</text>`) },
        { q: 'The volume of a cube is V = s³. Find V when s = 4.',
          working: ['<b>Picture:</b> a Lego cube 4 bricks long, 4 bricks wide and 4 bricks high.', '1. What does s³ mean? s × s × s — the same number <b>three times</b> (not s × 3).', '2. Swap s for 4: 4 × 4 × 4.', '3. 4 × 4 = 16, then 16 × 4 = 64.'],
          a: 'V = 64' },
      ],
      tips: [
        '<b>x on its own means 1x.</b> So 4x − x = 3x, not 4.',
        'A <b>minus sign belongs to the term after it</b>: in 5x − 2x + 3, the "−2x" travels together.',
        'When you substitute a <b>negative</b> number, put it in <b>brackets</b> so you keep the sign: x² with x = −3 is (−3)² = 9.',
        'x² and x are <b>not</b> like terms — a squared orange is a different fruit!',
        'In a formula, <b>s³</b> means s × s × s (<b>not</b> s × 3), and a fraction line means <b>divide</b>.',
        'When you <b>divide</b> terms, only cancel a letter that appears on the <b>top and the bottom</b>. 20ab ÷ 4a = 5b, because the b has nothing to cancel with.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
