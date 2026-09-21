/* Topic: Expanding brackets and factorising (distributive law forwards and backwards) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = N.fmt;

  /* ---------- expression text + accept helpers (term = {k, v}; v '' = constant, v may be an array of spellings e.g. ['x²','x^2']) ---------- */
  const spell = (v) => (Array.isArray(v) ? v[0] : v);
  const termText = (k, v) => {
    const s = spell(v);
    if (!s) return f(k);
    if (k === 1) return s;
    if (k === -1) return '−' + s;
    return f(k) + s;
  };
  const exprText = (t1, t2) => {
    if (t1.k === 0 && t2.k === 0) return '0';
    if (t2.k === 0) return termText(t1.k, t1.v);
    if (t1.k === 0) return termText(t2.k, t2.v);
    return `${termText(t1.k, t1.v)} ${t2.k < 0 ? '−' : '+'} ${termText(Math.abs(t2.k), t2.v)}`;
  };
  const absForms = (k, v) => {
    const a = Math.abs(k);
    const spellings = Array.isArray(v) ? v : v ? [v] : [];
    if (!spellings.length) return [String(a)];
    const out = [];
    spellings.forEach((s) => { out.push(a === 1 ? s : a + s); if (a === 1) out.push('1' + s); });
    return out;
  };
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
  const textAnswer = (t1, t2, extra = {}) => Object.assign({ type: 'text', value: exprText(t1, t2), accept: variants(t1, t2), placeholder: 'e.g. 3x + 12' }, extra);
  /** bracket display: a(bx + c) with proper signs, e.g. −2(x − 5) */
  const bracket = (a, b, c, v) => `${a === -1 ? '−' : f(a)}(${exprText({ k: b, v }, { k: c, v: '' })})`;
  const VARS = ['x', 'x', 'a', 'n', 'y', 'm', 'p'];

  /* ---------- single bracket ---------- */
  function single(level) {
    const v = R.pick(VARS);
    let a, b, c;
    if (level === 1) { a = R.int(2, 6); b = 1; c = R.int(1, 9); }
    else if (level === 2) {
      const kind = R.pick(['minus', 'negOut', 'negOut', 'coef', 'coefMinus']);
      if (kind === 'minus') { a = R.int(2, 7); b = 1; c = -R.int(1, 9); }
      else if (kind === 'negOut') { a = -R.int(2, 6); b = 1; c = R.chance(0.5) ? R.int(1, 9) : -R.int(1, 9); }
      else if (kind === 'coef') { a = R.int(2, 6); b = R.int(2, 5); c = R.int(1, 9); }
      else { a = R.int(2, 6); b = R.int(2, 5); c = -R.int(1, 9); }
    } else {
      a = R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]); b = R.int(2, 7); c = R.chance(0.5) ? R.int(2, 12) : -R.int(2, 12);
    }
    const k1 = a * b, k2 = a * c;
    const shown = bracket(a, b, c, v);
    const ans = exprText({ k: k1, v }, { k: k2, v: '' });
    const negNote = a < 0 ? ' Multiplying by a negative flips the sign of each term.' : '';
    return {
      prompt: `Expand: <b>${shown}</b>`,
      answer: textAnswer({ k: k1, v }, { k: k2, v: '' }),
      hint: `Multiply the number outside by <b>each</b> term inside the brackets.${negNote}`,
      working: [
        `${f(a)} × ${termText(b, v)} = ${termText(k1, v)}.`,
        `${f(a)} × ${c < 0 ? '(' + f(c) + ')' : f(c)} = ${f(k2)}.`,
        `Put them together: <b>${ans}</b>`,
      ],
      finalAnswer: ans,
      skill: 'expand-single',
    };
  }

  /* ---------- x(x + b) at level 3 ---------- */
  function squareTerm() {
    const v = R.pick(['x', 'a', 'n', 'y']);
    const a = R.pick([1, 1, 2, 3]), b = R.chance(0.6) ? R.int(2, 9) : -R.int(2, 9);
    const shown = `${a === 1 ? '' : a}${v}(${v} ${b < 0 ? '−' : '+'} ${Math.abs(b)})`;
    const t1 = { k: a, v: [`${v}²`, `${v}^2`] }, t2 = { k: a * b, v };
    const ans = exprText(t1, t2);
    return {
      prompt: `Expand: <b>${shown}</b>`,
      answer: textAnswer(t1, t2, { placeholder: `e.g. ${v}^2 + 3${v}` }),
      hint: `${v} × ${v} = ${v}² (type ${v}^2). Then multiply ${a === 1 ? v : a + v} by ${f(b)}.`,
      working: [
        `${a === 1 ? v : a + v} × ${v} = ${termText(a, `${v}²`)}.`,
        `${a === 1 ? v : a + v} × ${b < 0 ? '(' + f(b) + ')' : f(b)} = ${termText(a * b, v)}.`,
        `Answer: <b>${ans}</b> (type ${ans.replace('²', '^2')}).`,
      ],
      finalAnswer: ans,
      skill: 'expand-single',
    };
  }

  /* ---------- expand and simplify two brackets (level 3) ---------- */
  function double() {
    const v = R.pick(VARS);
    const a = R.int(2, 5), b = R.chance(0.7) ? R.int(1, 8) : -R.int(1, 8);
    const c = R.pick([2, 3, 4, 5, -2, -3]), d = R.chance(0.5) ? R.int(1, 8) : -R.int(1, 8);
    const kx = a + c, kc = a * b + c * d;
    if (kx === 0 && kc === 0) return double();
    const second = `${c < 0 ? '−' : '+'} ${Math.abs(c)}(${exprText({ k: 1, v }, { k: d, v: '' })})`;
    const shown = `${bracket(a, 1, b, v)} ${second}`;
    const p1 = exprText({ k: a, v }, { k: a * b, v: '' });
    const p2 = exprText({ k: c, v }, { k: c * d, v: '' });
    const ans = exprText({ k: kx, v }, { k: kc, v: '' });
    return {
      prompt: `Expand and simplify: <b>${shown}</b>`,
      answer: textAnswer({ k: kx, v }, { k: kc, v: '' }),
      hint: `Expand each bracket on its own first, then collect the like terms.${c < 0 ? ' Careful: the second bracket is multiplied by a negative.' : ''}`,
      working: [
        `First bracket: ${bracket(a, 1, b, v)} = ${p1}.`,
        `Second bracket: ${f(c)}(${exprText({ k: 1, v }, { k: d, v: '' })}) = ${p2}.`,
        `${v} terms: ${termText(a, v)} ${c < 0 ? '−' : '+'} ${termText(Math.abs(c), v)} = ${termText(kx, v)}.`,
        `Numbers: ${f(a * b)} ${c * d < 0 ? '−' : '+'} ${Math.abs(c * d)} = ${f(kc)}.`,
        `Answer: <b>${ans}</b>`,
      ],
      finalAnswer: ans,
      skill: 'expand-simplify',
    };
  }

  /* ---------- numeric distributive law (number answer) ---------- */
  function numeric(level) {
    let a, big, small, plus;
    if (level === 1) { a = R.int(2, 6); big = R.pick([10, 20, 30, 40, 50]); small = R.int(1, 5); plus = true; }
    else if (level === 2) { a = R.int(3, 9); big = R.pick([20, 30, 40, 50, 60, 70, 80, 90, 100]); small = R.int(1, 9); plus = R.chance(0.6); }
    else { a = R.int(4, 12); big = R.pick([100, 200, 300, 500]); small = R.int(2, 25); plus = R.chance(0.5); }
    const inside = plus ? big + small : big - small;
    const ans = a * inside;
    const bracketTxt = `${a} × (${big} ${plus ? '+' : '−'} ${small})`;
    const asked = R.chance(0.5) ? `Use the distributive law to work out <b>${bracketTxt}</b>.` : `Work out <b>${a} × ${inside}</b> by splitting it as ${bracketTxt}.`;
    return {
      prompt: asked,
      answer: { type: 'number', value: ans },
      hint: `Multiply ${a} by ${big}, multiply ${a} by ${small}, then ${plus ? 'add' : 'subtract'}.`,
      working: [
        `${a} × ${big} = ${a * big}.`,
        `${a} × ${small} = ${a * small}.`,
        `${a * big} ${plus ? '+' : '−'} ${a * small} = <b>${ans}</b>`,
      ],
      finalAnswer: f(ans),
      skill: 'distributive-number',
    };
  }

  /* ---------- FACTORISING: expanding run backwards ---------- */
  /** accepted typed forms of "out(inner)" */
  function factorVariants(outForms, t1, t2) {
    const inner = variants(t1, t2);
    const out = new Set();
    outForms.forEach((o) => inner.forEach((s) => { out.add(`${o}(${s})`); out.add(`${o} (${s})`); }));
    return [...out];
  }
  const factorAnswer = (outText, outForms, t1, t2, extra = {}) => Object.assign({
    type: 'text',
    value: `${outText}(${exprText(t1, t2)})`,
    accept: factorVariants(outForms, t1, t2),
    placeholder: 'e.g. 3(x + 4)',
  }, extra);

  /** "What is the highest common factor of 12x and 18?" (choice) — the first step of factorising */
  function hcfChoice(level) {
    const v = R.pick(VARS);
    const h = R.pick(level === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 7, 8, 9, 12]);
    let b = R.int(2, 9), c = R.int(2, 12), guard = 0;
    while ((N.gcd(b, c) !== 1 || b === c) && guard++ < 40) { b = R.int(2, 9); c = R.int(2, 12); }
    if (N.gcd(b, c) !== 1) return hcfChoice(level);
    const A = h * b, B = h * c;
    const wrongs = [];
    for (const n of [2, 3, 4, 5, 6, h * 2, Math.floor(h / 2), b, c, h + 1]) {
      if (Number.isInteger(n) && n > 1 && n !== h && !wrongs.includes(n)) wrongs.push(n);
      if (wrongs.length === 3) break;
    }
    const choices = R.shuffle([h, ...wrongs]).map(String);
    return {
      prompt: `What is the <b>highest common factor</b> of ${A}${v} and ${B}?`,
      answer: { type: 'choice', value: choices.indexOf(String(h)), choices },
      hint: `Which numbers divide exactly into both ${A} and ${B}? Pick the biggest one.`,
      working: [
        `${A} ÷ ${h} = ${b} exactly, and ${B} ÷ ${h} = ${c} exactly.`,
        `Nothing bigger than ${h} goes into both.`,
        `Highest common factor: <b>${h}</b>.`,
      ],
      finalAnswer: String(h),
      skill: 'hcf',
    };
  }

  /** take out a NUMBER: 3x + 12 = 3(x + 4), 12x − 18 = 6(2x − 3) */
  function factorise(level) {
    const v = R.pick(VARS);
    if (level === 3 && R.chance(0.5)) return factoriseVar(v);
    let h, b, c, guard = 0;
    if (level === 1) { h = R.int(2, 6); b = 1; c = R.int(2, 9); }
    else if (level === 2) {
      h = R.int(2, 9); b = R.pick([1, 1, 1, 2, 3]);
      c = R.int(2, 9) * (R.chance(0.4) ? -1 : 1);
      while (N.gcd(b, Math.abs(c)) !== 1 && guard++ < 30) c = R.int(2, 9) * (R.chance(0.4) ? -1 : 1);
    } else {
      h = R.pick([3, 4, 5, 6, 7, 8, 9, 12]); b = R.pick([2, 3, 4, 5]);
      c = R.int(2, 11) * (R.chance(0.5) ? -1 : 1);
      while (N.gcd(b, Math.abs(c)) !== 1 && guard++ < 30) c = R.int(2, 11) * (R.chance(0.5) ? -1 : 1);
    }
    if (N.gcd(b, Math.abs(c)) !== 1) return factorise(level);
    const A = h * b, C = h * c;
    const t1 = { k: b, v }, t2 = { k: c, v: '' };
    const shown = exprText({ k: A, v }, { k: C, v: '' });
    const ans = `${h}(${exprText(t1, t2)})`;
    return {
      prompt: `Factorise: <b>${shown}</b>`,
      answer: factorAnswer(String(h), [String(h)], t1, t2, { placeholder: `e.g. 3(${v} + 4)` }),
      hint: `Find the biggest number that divides into both ${A} and ${Math.abs(C)}. Put it outside the bracket, then divide each term by it.`,
      working: [
        `What is the highest common factor of ${A} and ${Math.abs(C)}? It is <b>${h}</b>.`,
        `${A}${v} ÷ ${h} = ${termText(b, v)}.`,
        `${Math.abs(C)} ÷ ${h} = ${Math.abs(c)}, and the sign stays ${c < 0 ? 'minus' : 'plus'}.`,
        `Answer: <b>${ans}</b>`,
        `Check by expanding: ${h} × ${termText(b, v)} = ${termText(A, v)} and ${h} × ${c < 0 ? '(−' + Math.abs(c) + ')' : Math.abs(c)} = ${f(C)}. ✓`,
      ],
      finalAnswer: ans,
      skill: 'factorise',
    };
  }

  /** take out a LETTER too: x² + 5x = x(x + 5), 4x² + 6x = 2x(2x + 3) */
  function factoriseVar(v) {
    const h = R.pick([1, 1, 2, 3, 4, 5]);
    let b = R.pick([1, 2, 3, 4]), c = R.int(2, 9) * (R.chance(0.3) ? -1 : 1), guard = 0;
    while (N.gcd(b, Math.abs(c)) !== 1 && guard++ < 30) c = R.int(2, 9) * (R.chance(0.3) ? -1 : 1);
    if (N.gcd(b, Math.abs(c)) !== 1) return factoriseVar(v);
    const A = h * b, C = h * c;
    const sq = [`${v}²`, `${v}^2`];
    const outText = `${h === 1 ? '' : h}${v}`;
    const outForms = h === 1 ? [v, `1${v}`] : [`${h}${v}`];
    const t1 = { k: b, v }, t2 = { k: c, v: '' };
    const shown = exprText({ k: A, v: sq }, { k: C, v });
    const ans = `${outText}(${exprText(t1, t2)})`;
    return {
      prompt: `Factorise: <b>${shown}</b>`,
      answer: factorAnswer(outText, outForms, t1, t2, { placeholder: `e.g. 2${v}(2${v} + 3)` }),
      hint: `Two jobs. Numbers: what goes into both ${A} and ${Math.abs(C)}? Letters: ${v} is in both terms, so ${v} comes out too.`,
      working: [
        `Numbers: the highest common factor of ${A} and ${Math.abs(C)} is ${h}.`,
        `Letters: ${v} is in ${termText(A, `${v}²`)} and in ${termText(C, v)}, so ${v} comes out as well.`,
        `Common factor: <b>${outText}</b>.`,
        `${termText(A, `${v}²`)} ÷ ${outText} = ${termText(b, v)}, and ${termText(C, v)} ÷ ${outText} = ${f(c)}.`,
        `Answer: <b>${ans}</b>`,
      ],
      finalAnswer: ans,
      skill: 'factorise',
    };
  }

  function calc(level) {
    const r = Math.random();
    if (level === 1) {
      if (r < 0.5) return single(1);
      if (r < 0.7) return factorise(1);
      if (r < 0.82) return hcfChoice(1);
      return numeric(1);
    }
    if (level === 2) {
      if (r < 0.48) return single(2);
      if (r < 0.72) return factorise(2);
      if (r < 0.8) return hcfChoice(2);
      return numeric(2);
    }
    if (r < 0.3) return double();
    if (r < 0.45) return single(3);
    if (r < 0.6) return squareTerm();
    if (r < 0.85) return factorise(3);
    return numeric(3);
  }

  /* ---------- word problems ----------
   * Level 1: one bracket, small numbers, expand it and stop.
   * Level 2: build the bracket yourself first (perimeter, groups), or undo one (÷, factorise).
   * Level 3: two brackets added or taken away, then collected — or factorising a bigger area. */
  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['bags', 'square', 'rectArea', 'packs', 'pies', 'tickets'])
      : level === 2 ? R.pick(['rect', 'friends', 'area', 'garden', 'busTrip', 'mat'])
      : R.pick(['carpet', 'twoGroups', 'deck', 'area3', 'garden3', 'price3']);

    /* ----- level 1 ----- */
    if (t === 'bags') {
      const n = R.int(2, 5), orange = R.int(2, 6);
      const t1 = { k: n, v: 'x' }, t2 = { k: n * orange, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `${name} packs ${n} lunch bags. Each bag holds x apples and ${orange} mandarins. Write an expression for the total number of pieces of fruit, expanded.`,
        answer: textAnswer(t1, t2, { placeholder: 'e.g. 3x + 6' }),
        hint: `One bag holds (x + ${orange}) pieces of fruit. ${n} bags hold ${n}(x + ${orange}). Multiply the ${n} by <b>each</b> thing inside.`,
        working: [`One bag: x + ${orange}.`, `${n} bags: ${n}(x + ${orange}).`, `${n} × x = ${termText(n, 'x')} and ${n} × ${orange} = ${n * orange}.`, `Total: <b>${ans}</b>`],
        finalAnswer: ans,
      };
    }
    if (t === 'square') {
      const b = R.int(1, 9);
      const t1 = { k: 4, v: 'x' }, t2 = { k: 4 * b, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A square trampoline mat has sides of length (x + ${b}) m. Write an expression for its perimeter, expanded.`,
        answer: textAnswer(t1, t2, { unit: 'm' }),
        hint: `A square has 4 equal sides, so the perimeter is 4(x + ${b}). Expand it.`,
        working: [`P = 4(x + ${b}).`, `4 × x = 4x and 4 × ${b} = ${4 * b}.`, `P = <b>${ans}</b>`],
        finalAnswer: `${ans} m`,
      };
    }
    if (t === 'rectArea') {
      const h = R.int(2, 6), c = R.int(2, 9);
      const t1 = { k: h, v: 'x' }, t2 = { k: h * c, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A rectangular beach towel is ${h} m wide and (x + ${c}) m long. Write an expression for its area, expanded.`,
        answer: textAnswer(t1, t2, { unit: 'm²', placeholder: 'e.g. 3x + 12' }),
        hint: `Area = width × length = ${h}(x + ${c}). Multiply the ${h} by both terms inside.`,
        working: [`A = ${h}(x + ${c}).`, `${h} × x = ${termText(h, 'x')}.`, `${h} × ${c} = ${h * c}.`, `A = <b>${ans}</b>`],
        finalAnswer: `${ans} m²`,
      };
    }
    if (t === 'packs') {
      const a = R.int(3, 9), big = R.pick([20, 30, 40, 50]), small = R.int(1, 8);
      const ans = a * (big + small);
      return {
        prompt: `A canteen order has ${a} boxes. Each box holds ${big + small} muesli bars. Work out the total by splitting it as ${a} × (${big} + ${small}).`,
        answer: { type: 'number', value: ans, unit: 'bars' },
        hint: `${a} × ${big} first, then ${a} × ${small}, then add.`,
        working: [`${a} × ${big} = ${a * big}.`, `${a} × ${small} = ${a * small}.`, `${a * big} + ${a * small} = <b>${ans}</b>`],
        finalAnswer: `${ans} bars`,
      };
    }
    if (t === 'pies') {
      const n = R.int(3, 9), price = R.pick([3.2, 4.1, 4.5, 5.2, 6.1, 2.5]);
      const whole = Math.floor(price), cents = N.round(price - whole, 2);
      const ans = N.round(n * price, 2);
      return {
        prompt: `Pies cost $${price.toFixed(2)} each. Find the cost of ${n} pies by splitting it as ${n} × (${whole} + ${f(cents)}).`,
        answer: { type: 'number', value: ans, unit: '$', tolerance: 0.005 },
        hint: `${n} × ${whole} first, then ${n} × ${f(cents)}, then add.`,
        working: [`${n} × ${whole} = ${n * whole}.`, `${n} × ${f(cents)} = ${f(N.round(n * cents, 2))}.`, `${n * whole} + ${f(N.round(n * cents, 2))} = <b>$${ans.toFixed(2)}</b>`],
        finalAnswer: `$${ans.toFixed(2)}`,
      };
    }
    if (t === 'tickets') {
      const n = R.int(2, 5), fee = R.int(2, 6);
      const t1 = { k: n, v: 't' }, t2 = { k: n * fee, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A movie ticket costs $t plus a $${fee} booking fee per ticket. Write an expression for the cost of ${n} tickets, expanded.`,
        answer: textAnswer(t1, t2, { unit: '$' }),
        hint: `Each ticket costs (t + ${fee}). ${n} tickets cost ${n}(t + ${fee}). Expand it.`,
        working: [`One ticket costs t + ${fee}.`, `${n} tickets: ${n}(t + ${fee}).`, `${n} × t = ${termText(n, 't')} and ${n} × ${fee} = ${n * fee}.`, `Cost = <b>${ans}</b>`],
        finalAnswer: `$${ans}`,
      };
    }

    /* ----- level 2 ----- */
    if (t === 'rect') {
      const b = R.int(1, 9), w = R.int(2, 9);
      const t1 = { k: 2, v: 'x' }, t2 = { k: 2 * b + 2 * w, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A rectangle has length (x + ${b}) cm and width ${w} cm. Write an expression for its perimeter, expanded and simplified.`,
        answer: textAnswer(t1, t2, { unit: 'cm' }),
        hint: `Perimeter = 2 × length + 2 × width = 2(x + ${b}) + 2 × ${w}. Expand, then collect the numbers.`,
        working: [`P = 2(x + ${b}) + 2 × ${w}.`, `2(x + ${b}) = 2x + ${2 * b}.`, `2 × ${w} = ${2 * w}.`, `2x + ${2 * b} + ${2 * w} = <b>${ans}</b>`],
        finalAnswer: `${ans} cm`,
      };
    }
    if (t === 'friends') {
      const n = R.int(3, 6), extra = R.int(2, 8);
      const item = R.pick(['a smoothie', 'an ice cream', 'a bus fare', 'a pie']);
      const t1 = { k: n, v: 'm' }, t2 = { k: n * extra, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `${n} friends go to the beach. Each one spends $m on lunch and $${extra} on ${item}. Write an expression for the total they spend, expanded.`,
        answer: textAnswer(t1, t2, { unit: '$' }),
        hint: `Each friend spends (m + ${extra}). Multiply by ${n}, then expand.`,
        working: [`Each friend: m + ${extra}.`, `${n} friends: ${n}(m + ${extra}).`, `= <b>${ans}</b>`],
        finalAnswer: `$${ans}`,
      };
    }
    if (t === 'busTrip') {
      const n = R.int(3, 8), e = R.int(2, 9);
      const t1 = { k: n, v: 'x' }, t2 = { k: n * e, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `${n} students go to the museum. Each student pays $x for the bus and $${e} to get in. Write an expression for the total the class pays, expanded.`,
        answer: textAnswer(t1, t2, { unit: '$' }),
        hint: `One student pays (x + ${e}). Multiply that by ${n}, then multiply into the bracket.`,
        working: [`One student: x + ${e}.`, `${n} students: ${n}(x + ${e}).`, `${n} × x = ${termText(n, 'x')} and ${n} × ${e} = ${n * e}.`, `Total: <b>${ans}</b>`],
        finalAnswer: `$${ans}`,
      };
    }
    if (t === 'mat') {
      const w = R.int(3, 8), b = R.int(1, 6);
      const t1 = { k: w, v: 'x' }, t2 = { k: -w * b, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A rectangular mat for the marae is ${w} m wide and (x − ${b}) m long. Write an expression for its area, expanded.`,
        answer: textAnswer(t1, t2, { unit: 'm²', placeholder: 'e.g. 5x − 10' }),
        hint: `Area = ${w}(x − ${b}). Multiply the ${w} by <b>both</b> terms — the minus sign stays with the ${b}.`,
        working: [`A = ${w}(x − ${b}).`, `${w} × x = ${termText(w, 'x')}.`, `${w} × ${b} = ${w * b}, and it is being taken away.`, `A = <b>${ans}</b>`],
        finalAnswer: `${ans} m²`,
      };
    }
    if (t === 'area') {
      const h = R.int(2, 9), b = R.pick([1, 1, 2, 3]);
      let c = R.int(2, 9), guard = 0;
      while (N.gcd(b, c) !== 1 && guard++ < 20) c = R.int(2, 9);
      const t1 = { k: b, v: 'x' }, t2 = { k: c, v: '' };
      const shown = exprText({ k: h * b, v: 'x' }, { k: h * c, v: '' });
      const ans = exprText(t1, t2);
      return {
        prompt: `A rectangle has area (${shown}) cm² and width ${h} cm. Write an expression for its length.`,
        answer: textAnswer(t1, t2, { unit: 'cm', placeholder: 'e.g. 2x + 5' }),
        hint: `Area = width × length, so length = area ÷ ${h}. Divide <b>each</b> term by ${h}.`,
        working: [
          `Length = (${shown}) ÷ ${h}.`,
          `${h * b}x ÷ ${h} = ${termText(b, 'x')}.`,
          `${h * c} ÷ ${h} = ${c}.`,
          `Length = <b>${ans}</b> cm. Check: ${h}(${ans}) = ${shown} ✓`,
        ],
        finalAnswer: `${ans} cm`,
        skill: 'factorise',
      };
    }
    if (t === 'garden') {
      const h = R.int(2, 6), b = R.pick([1, 2, 3]);
      let c = R.int(2, 9), guard = 0;
      while (N.gcd(b, c) !== 1 && guard++ < 20) c = R.int(2, 9);
      const t1 = { k: b, v: 'x' }, t2 = { k: c, v: '' };
      const shown = exprText({ k: h * b, v: 'x' }, { k: h * c, v: '' });
      const ans = `${h}(${exprText(t1, t2)})`;
      const place = R.pick(['a school garden bed', 'a kūmara patch', 'a beach volleyball court', 'a vege garden']);
      return {
        prompt: `${place.charAt(0).toUpperCase() + place.slice(1)} has area (${shown}) m². Factorise this expression to show the two side lengths.`,
        answer: factorAnswer(String(h), [String(h)], t1, t2, { placeholder: 'e.g. 3(x + 4)' }),
        hint: `Take out the highest common factor of ${h * b} and ${h * c}. That gives you width × length.`,
        working: [
          `Highest common factor of ${h * b} and ${h * c}: <b>${h}</b>.`,
          `${h * b}x ÷ ${h} = ${termText(b, 'x')} and ${h * c} ÷ ${h} = ${c}.`,
          `Area = <b>${ans}</b>, so the sides are ${h} m and (${exprText(t1, t2)}) m.`,
        ],
        finalAnswer: ans,
        skill: 'factorise',
      };
    }

    /* ----- level 3 ----- */
    if (t === 'carpet') {
      const a = R.int(2, 6), b = R.int(1, 9), c = R.int(2, 6), d = R.int(1, 9);
      const t1 = { k: a + c, v: 'x' }, t2 = { k: a * b + c * d, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `${name}'s lounge is ${a} m wide and (x + ${b}) m long. The hallway is ${c} m wide and (x + ${d}) m long. Both are carpeted. Write an expression for the total area, expanded and simplified.`,
        answer: textAnswer(t1, t2, { unit: 'm²', placeholder: 'e.g. 5x + 16' }),
        hint: `Expand each room on its own — ${a}(x + ${b}) and ${c}(x + ${d}) — then add the x terms together and the numbers together.`,
        working: [
          `Lounge: ${a}(x + ${b}) = ${termText(a, 'x')} + ${a * b}.`,
          `Hallway: ${c}(x + ${d}) = ${termText(c, 'x')} + ${c * d}.`,
          `Add the x terms: ${a}x + ${c}x = ${termText(a + c, 'x')}.`,
          `Add the numbers: ${a * b} + ${c * d} = ${a * b + c * d}.`,
          `Total area: <b>${ans}</b>`,
        ],
        finalAnswer: `${ans} m²`,
      };
    }
    if (t === 'twoGroups') {
      const a = R.int(2, 6), b = R.int(2, 6), fee = R.int(2, 6);
      const n = a + b;
      const t1 = { k: n, v: 't' }, t2 = { k: n * fee, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `One whānau books ${a} concert tickets and another books ${b}. Every ticket costs $t plus a $${fee} booking fee. Write an expression for the total cost of all the tickets, expanded and simplified.`,
        answer: textAnswer(t1, t2, { unit: '$', placeholder: 'e.g. 7t + 35' }),
        hint: `How many tickets altogether? ${a} + ${b}. Each one costs (t + ${fee}), so the total is that many lots of (t + ${fee}).`,
        working: [
          `Tickets altogether: ${a} + ${b} = ${n}.`,
          `Each ticket: t + ${fee}. So the total is ${n}(t + ${fee}).`,
          `${n} × t = ${termText(n, 't')} and ${n} × ${fee} = ${n * fee}.`,
          `Total: <b>${ans}</b>`,
        ],
        finalAnswer: `$${ans}`,
      };
    }
    if (t === 'deck') {
      const c = R.int(2, 4), a = c + R.int(1, 4), d = R.int(1, 5);
      const b = d + R.int(1, 5);
      const t1 = { k: a - c, v: 'x' }, t2 = { k: a * b - c * d, v: '' };
      const ans = exprText(t1, t2);
      return {
        prompt: `A deck is a rectangle ${a} m wide and (x + ${b}) m long. A sandpit ${c} m wide and (x + ${d}) m long is cut out of it. Write an expression for the area of decking left, expanded and simplified.`,
        answer: textAnswer(t1, t2, { unit: 'm²', placeholder: 'e.g. 2x + 14' }),
        hint: `Expand both areas, then take the sandpit away from the deck. Careful: <b>both</b> parts of the sandpit get taken away.`,
        working: [
          `Deck: ${a}(x + ${b}) = ${termText(a, 'x')} + ${a * b}.`,
          `Sandpit: ${c}(x + ${d}) = ${termText(c, 'x')} + ${c * d}.`,
          `Take it away: ${a}x + ${a * b} − ${c}x − ${c * d}.`,
          `x terms: ${a}x − ${c}x = ${termText(a - c, 'x')}. Numbers: ${a * b} − ${c * d} = ${a * b - c * d}.`,
          `Decking left: <b>${ans}</b>`,
        ],
        finalAnswer: `${ans} m²`,
      };
    }
    if (t === 'area3') {
      const h = R.int(3, 9), b = R.pick([2, 3, 4, 5]);
      let c = R.int(2, 12), guard = 0;
      while (N.gcd(b, c) !== 1 && guard++ < 20) c = R.int(2, 12);
      const t1 = { k: b, v: 'x' }, t2 = { k: -c, v: '' };
      const shown = exprText({ k: h * b, v: 'x' }, { k: -h * c, v: '' });
      const ans = exprText(t1, t2);
      return {
        prompt: `A rectangular court has area (${shown}) m² and width ${h} m. Write an expression for its length.`,
        answer: textAnswer(t1, t2, { unit: 'm', placeholder: 'e.g. 3x − 4' }),
        hint: `Length = area ÷ ${h}. Divide <b>each</b> term by ${h}, and keep the minus sign.`,
        working: [
          `Length = (${shown}) ÷ ${h}.`,
          `${h * b}x ÷ ${h} = ${termText(b, 'x')}.`,
          `${h * c} ÷ ${h} = ${c}, and it is being taken away.`,
          `Length = <b>${ans}</b> m. Check: ${h}(${ans}) = ${shown} ✓`,
        ],
        finalAnswer: `${ans} m`,
        skill: 'factorise',
      };
    }
    if (t === 'garden3') {
      const h = R.pick([4, 6, 8, 9, 12]), b = R.pick([2, 3, 5]);
      let c = R.int(2, 12), guard = 0;
      while (N.gcd(b, c) !== 1 && guard++ < 20) c = R.int(2, 12);
      const t1 = { k: b, v: 'x' }, t2 = { k: c, v: '' };
      const shown = exprText({ k: h * b, v: 'x' }, { k: h * c, v: '' });
      const ans = `${h}(${exprText(t1, t2)})`;
      return {
        prompt: `A kiwifruit block has area (${shown}) m². Factorise it fully to show the two side lengths.`,
        answer: factorAnswer(String(h), [String(h)], t1, t2, { placeholder: 'e.g. 6(2x + 5)' }),
        hint: `Find the <b>highest</b> common factor of ${h * b} and ${h * c} — not just any factor. Take it right out the front.`,
        working: [
          `Highest common factor of ${h * b} and ${h * c}: <b>${h}</b>.`,
          `${h * b}x ÷ ${h} = ${termText(b, 'x')} and ${h * c} ÷ ${h} = ${c}.`,
          `Area = <b>${ans}</b>, so the sides are ${h} m and (${exprText(t1, t2)}) m.`,
        ],
        finalAnswer: ans,
        skill: 'factorise',
      };
    }
    // price3: split a tricky price two ways, then find the change
    const n3 = R.int(4, 9), price3 = R.pick([3.2, 4.5, 5.2, 6.1, 2.5, 7.5]);
    const whole3 = Math.floor(price3), cents3 = N.round(price3 - whole3, 2);
    const total3 = N.round(n3 * price3, 2);
    const paid = Math.ceil(total3 / 10) * 10;
    const change = N.round(paid - total3, 2);
    return {
      prompt: `Sausage rolls cost $${price3.toFixed(2)} each. ${name} buys ${n3} of them and pays with $${paid}. Split the cost as ${n3} × (${whole3} + ${f(cents3)}) to work it out, then find the change.`,
      answer: { type: 'number', value: change, unit: '$', tolerance: 0.005 },
      hint: `Do ${n3} × ${whole3} and ${n3} × ${f(cents3)}, add them for the cost, then take that off $${paid}.`,
      working: [
        `${n3} × ${whole3} = ${n3 * whole3}.`,
        `${n3} × ${f(cents3)} = ${f(N.round(n3 * cents3, 2))}.`,
        `Cost: ${n3 * whole3} + ${f(N.round(n3 * cents3, 2))} = $${total3.toFixed(2)}.`,
        `Change: ${paid} − ${total3.toFixed(2)} = <b>$${change.toFixed(2)}</b>`,
      ],
      finalAnswer: `$${change.toFixed(2)}`,
    };
  }

  HL.registerTopic({
    id: 'expanding', subject: 'maths', strand: 'algebra', order: 4,
    name: 'Expanding & factorising', short: 'Expand/factorise',
    blurb: 'Multiply out the brackets, then learn to put them back in by taking out the common factor.',
    example: '3(x + 4) = 3x + 12 &nbsp;·&nbsp; 5x − 20 = 5(x − 4)',
    animal: 'giraffe',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', PEACH = '#FFC79A', LAV = '#C9B8F2', SKY = '#A9D8F5', PINK = '#F9A8C9', MINT = '#A6E3B8';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // "out(t1 sign t2)" written at (x0, y) with rainbow arcs from `out` to each inside term; results listed under it
      const rainbow = (x0, y, out, t1, sign, t2, results, size = 24) => { const cw = size * 0.62; let x = x0, o = ''; const put = (t, col) => { const w = t === '(' || t === ')' ? size * 0.4 : t.length * cw; o += `<text x="${x}" y="${y}" font-size="${size}" fill="${col}">${t}</text>`; const c = x + w / 2; x += w; return c; }; const co = put(out, INK); put('(', INK); const c1 = put(t1, ROSE); x += 6; put(sign, INK); x += 6; const c2 = put(t2, BLUE); put(')', INK); const top = y - size * 0.8; const arc = (cx, col, lift) => `<path d="M${co} ${top} q${(cx - co) / 2} ${-lift} ${cx - co} 0" stroke="${col}" stroke-width="2.5" fill="none"/><polygon points="${cx},${top + 2} ${cx - 6},${top - 8} ${cx + 5},${top - 9}" fill="${col}"/>`; o += arc(c1, ROSE, 26) + arc(c2, BLUE, 40); results.forEach(([t, col], i) => { o += `<text x="${x0}" y="${y + 34 + i * 24}" font-size="16" fill="${col}">${t}</text>`; }); return o; };
      // FACTORISING picture: the expression on top, "÷ HCF" arrows down to what is left, the answer underneath
      const unrainbow = (cx1, cx2, y, aTxt, sign, bTxt, h, q1, q2, ansHtml) => {
        const y2 = y + 54, mid = (cx1 + cx2) / 2;
        const arm = (cx, col) => `<line x1="${cx}" y1="${y + 9}" x2="${cx}" y2="${y2 - 28}" stroke="${col}" stroke-width="2.5"/><polygon points="${cx},${y2 - 18} ${cx - 6},${y2 - 28} ${cx + 6},${y2 - 28}" fill="${col}"/><text x="${cx + 10}" y="${y + 36}" fill="${col}">÷ ${h}</text>`;
        return `<text x="${cx1}" y="${y}" text-anchor="middle" font-size="24" fill="${ROSE}">${aTxt}</text>`
          + `<text x="${mid}" y="${y}" text-anchor="middle" font-size="24" fill="${INK}">${sign}</text>`
          + `<text x="${cx2}" y="${y}" text-anchor="middle" font-size="24" fill="${BLUE}">${bTxt}</text>`
          + arm(cx1, ROSE) + arm(cx2, BLUE)
          + `<text x="${cx1}" y="${y2}" text-anchor="middle" font-size="24" fill="${ROSE}">${q1}</text>`
          + `<text x="${cx2}" y="${y2}" text-anchor="middle" font-size="24" fill="${BLUE}">${q2}</text>`
          + `<text x="${mid}" y="${y2 + 40}" text-anchor="middle" font-size="24" fill="${INK}">${ansHtml}</text>`;
      };
      // area model: a rectangle of height h split into widths w1 (rose) and w2 (blue)
      const area = (x0, y0, w1, w2, h, labels) => `<rect x="${x0}" y="${y0}" width="${w1}" height="${h}" fill="${PINK}" opacity="0.5" stroke="${INK}" stroke-width="1.5"/><rect x="${x0 + w1}" y="${y0}" width="${w2}" height="${h}" fill="${SKY}" opacity="0.6" stroke="${INK}" stroke-width="1.5"/><text x="${x0 + w1 / 2}" y="${y0 - 8}" text-anchor="middle" fill="${ROSE}">${labels.top1}</text><text x="${x0 + w1 + w2 / 2}" y="${y0 - 8}" text-anchor="middle" fill="${BLUE}">${labels.top2}</text><text x="${x0 - 10}" y="${y0 + h / 2 + 5}" text-anchor="end" fill="${INK}">${labels.left}</text><text x="${x0 + w1 / 2}" y="${y0 + h / 2 + 6}" text-anchor="middle" font-size="18" fill="${ROSE}">${labels.in1}</text><text x="${x0 + w1 + w2 / 2}" y="${y0 + h / 2 + 6}" text-anchor="middle" font-size="18" fill="${BLUE}">${labels.in2}</text>`;
      return {
      what: '<p><b>Expanding</b> means getting rid of the brackets. The number outside the bracket multiplies <b>every</b> term inside — draw a <b>rainbow</b> of arcs from the outside number to each term so none gets missed. This is the <b>distributive law</b>: 3(x + 4) = 3 × x + 3 × 4 = <b>3x + 12</b>. <b>Factorising</b> is the same journey <b>backwards</b>: you find the <b>highest common factor</b>, put it outside a bracket, and divide each term by it. 3x + 12 = <b>3(x + 4)</b>.</p>',
      visual: SVG(360, 220, `
        <text x="12" y="18" fill="${INK}">Rainbow arcs (expand)</text>
        ${rainbow(18, 92, '3', 'x', '+', '4', [['3 × x = 3x', ROSE], ['3 × 4 = 12', BLUE], ['= 3x + 12', GREEN]])}
        <line x1="180" y1="10" x2="180" y2="176" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="200" y="18" fill="${INK}">Area model</text>
        ${area(212, 60, 84, 44, 70, { top1: 'x', top2: '4', left: '3', in1: '3x', in2: '12' })}
        <text x="270" y="166" text-anchor="middle" fill="${GREEN}">area = 3x + 12</text>
        <text x="180" y="196" text-anchor="middle" font-size="18" fill="${INK}">3(x + 4) &nbsp;⇄&nbsp; 3x + 12</text>
        <text x="96" y="215" text-anchor="middle" font-size="12" fill="${GREEN}">◀ factorise</text>
        <text x="268" y="215" text-anchor="middle" font-size="12" fill="${ROSE}">expand ▶</text>`),
      facts: [
        'The number outside multiplies <b>every</b> term inside: <b>3(x + 4) = 3x + 12</b>',
        'Draw a <b>rainbow</b>: one arc to each term. Two terms inside → two arcs → two answers',
        'Keep the sign of each inside term: <b>2(x − 5) = 2x − 10</b>',
        'A <b>negative</b> outside flips every sign: <b>−2(x − 5) = −2x + 10</b>',
        'Two brackets added → expand each, then <b>collect like terms</b>',
        'Numbers too: <b>4 × 23 = 4 × (20 + 3) = 80 + 12 = 92</b>',
        '<b>Factorising</b> = expanding <b>backwards</b>: <b>3x + 12 = 3(x + 4)</b>',
        'To factorise: find the <b>highest common factor</b> (HCF), put it <b>outside</b>, divide each term by it',
        'If the letter is in <b>every</b> term, it comes out too: <b>4x² + 6x = 2x(2x + 3)</b>',
        '<b>Check a factorised answer by expanding it again</b> — you should get back what you started with',
      ],
      steps: [
        'Draw an <b>arc</b> from the number outside to <b>each</b> term inside (a "rainbow"). "How many terms inside? That is how many arcs I need."',
        'Multiply along each arc: "outside × first term", then "outside × second term".',
        'Keep the <b>sign</b> of each inside term: 2(x − 5) = 2x − 10. "Is the outside number negative? Then every sign flips."',
        'If there are <b>two brackets</b> added together, expand each one, then <b>collect like terms</b> (oranges with oranges).',
        '<b>Check</b> by putting x = 1 into the question and your answer — they should match.',
        '<b>Factorising (going backwards):</b> "What is the biggest thing that goes into <b>both</b> terms?" That is the HCF — write it outside a bracket.',
        'Then ask: "<b>What is left</b> when I divide each term by it?" Those go inside the bracket. 3x ÷ 3 = x, 12 ÷ 3 = 4, so 3x + 12 = 3(x + 4).',
        'Check your factorising by <b>expanding it again</b> — the arcs should take you straight back.',
      ],
      examples: [
        { q: 'Expand 2(x + 5)',
          working: ['<b>Picture:</b> a rainbow — one arc from the 2 to each thing inside the bracket.', '1. How many terms inside? Two (x and 5), so I need two arcs.', '2. Along arc 1: 2 × x = 2x.', '3. Along arc 2: 2 × 5 = 10.', '2x + 10'],
          a: '2x + 10',
          visual: SVG(360, 110, rainbow(20, 60, '2', 'x', '+', '5', []) + `<text x="150" y="60" font-size="24" fill="${INK}">= <tspan fill="${ROSE}">2x</tspan> + <tspan fill="${BLUE}">10</tspan></text><text x="20" y="100" fill="${ROSE}">2 × x = 2x</text><text x="150" y="100" fill="${BLUE}">2 × 5 = 10</text>`) },
        { q: 'Expand 4(y − 3)',
          working: ['<b>Picture:</b> a rainbow again — but the second term is <b>−3</b>, and the minus travels with it.', '1. How many arcs? Two: 4 → y and 4 → −3.', '2. Arc 1: 4 × y = 4y.', '3. Arc 2: 4 × (−3) = −12. Is the sign kept? Yes, still minus.', '4y − 12'],
          a: '4y − 12',
          visual: SVG(360, 110, rainbow(20, 60, '4', 'y', '−', '3', []) + `<text x="150" y="60" font-size="24" fill="${INK}">= <tspan fill="${ROSE}">4y</tspan> <tspan fill="${BLUE}">− 12</tspan></text><text x="20" y="100" fill="${ROSE}">4 × y = 4y</text><text x="150" y="100" fill="${BLUE}">4 × (−3) = −12</text>`) },
        { q: 'Expand −2(x − 5)',
          working: ['<b>Picture:</b> a rainbow from a <b>negative</b> number — every arc carries a minus, so every sign flips.', '1. Is the outside number negative? Yes! So the signs inside will flip.', '2. Arc 1: −2 × x = −2x.', '3. Arc 2: −2 × (−5). Same signs → positive: +10.', '−2x + 10'],
          a: '−2x + 10',
          visual: SVG(360, 110, rainbow(20, 60, '−2', 'x', '−', '5', []) + `<text x="166" y="60" font-size="24" fill="${INK}">= <tspan fill="${ROSE}">−2x</tspan> <tspan fill="${BLUE}">+ 10</tspan></text><text x="20" y="100" fill="${ROSE}">−2 × x = −2x</text><text x="166" y="100" fill="${BLUE}">−2 × (−5) = +10</text>`) },
        { q: 'Expand and simplify 2(x + 3) + 3(x − 1)',
          working: ['<b>Picture:</b> two rainbows, then sort the answers into oranges (x terms) and apples (numbers).', '1. Rainbow 1: 2(x + 3) = 2x + 6.', '2. Rainbow 2: 3(x − 1) = 3x − 3.', '3. Which are like terms? 2x and 3x (oranges): 2x + 3x = 5x. 6 and −3 (apples): 6 − 3 = 3.', '5x + 3'],
          a: '5x + 3' },
        { q: 'A rectangle has length (x + 3) cm and width 4 cm. Write an expression for its perimeter, expanded and simplified.',
          working: ['<b>Picture:</b> walking round the rectangle — two long sides and two short sides.', '1. Perimeter = 2 × length + 2 × width = 2(x + 3) + 2 × 4.', '2. Rainbow: 2(x + 3) = 2x + 6.', '3. 2 × 4 = 8. Like terms? 6 and 8 are both numbers: 6 + 8 = 14.', '2x + 14'],
          a: '(2x + 14) cm',
          visual: SVG(360, 110, `<rect x="60" y="30" width="160" height="60" fill="${MINT}" opacity="0.6" stroke="${INK}" stroke-width="2"/><text x="140" y="22" text-anchor="middle" fill="${ROSE}">x + 3</text><text x="140" y="108" text-anchor="middle" fill="${ROSE}">x + 3</text><text x="48" y="65" text-anchor="end" fill="${BLUE}">4</text><text x="232" y="65" fill="${BLUE}">4</text><text x="250" y="46" fill="${INK}">P = 2(x + 3)</text><text x="262" y="66" fill="${INK}">+ 2 × 4</text><text x="250" y="90" fill="${GREEN}">= 2x + 6 + 8</text>`) },
        { q: 'Each of 6 boxes holds 24 muesli bars. Find the total by splitting 24 into 20 + 4.',
          working: ['<b>Picture:</b> a rectangle 6 rows tall — cut it into an easy 20-wide part and a small 4-wide part.', '1. Write it with a bracket: 6 × 24 = 6 × (20 + 4).', '2. Arc 1: 6 × 20 = 120.', '3. Arc 2: 6 × 4 = 24.', '120 + 24 = 144'],
          a: '144 muesli bars',
          visual: SVG(360, 120, area(60, 30, 180, 50, 60, { top1: '20', top2: '4', left: '6', in1: '120', in2: '24' }) + `<text x="180" y="112" text-anchor="middle" fill="${GREEN}">6 × (20 + 4) = 120 + 24 = 144</text>`) },
      ],
      tips: [
        'The most common slip is forgetting to multiply the <b>second</b> term. Always draw both arcs.',
        'Negative × negative = <b>positive</b>: −3(x − 2) = −3x <b>+</b> 6.',
        '<b>Check</b> by substituting x = 1 into both the original and your answer. They should give the same number.',
        'The area model is the same idea as the rainbow — pick whichever picture you like best.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
