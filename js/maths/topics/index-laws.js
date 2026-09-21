/* Topic: Index laws (powers with letters) — the multiply / divide / power-of-a-power / bracket laws,
 * with letters at every level, plus like terms and the cases where the laws do NOT apply. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  /** 2<sup>3</sup> (index 1 is just the base) */
  const P = (b, e) => (e === 1 ? String(b) : `${b}<sup>${e}</sup>`);
  /** always shows the index, even when it is 1 (2<sup>1</sup>) */
  const PF = (b, e) => `${b}<sup>${e}</sup>`;
  const SUPD = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const sup = (n) => String(n).split('').map((d) => SUPD[+d]).join('');
  const rep = (b, e) => Array(e).fill(b).join(' × ');
  const pw = (b, e) => Math.pow(b, e);
  const VARS = ['x', 'y', 'a', 'n', 'm', 'p'];
  /** whole-number divisors of v that are ≥ 2 (and ≤ v) */
  const divisorsOf = (v) => { const out = []; for (let d = 2; d <= v; d++) if (v % d === 0) out.push(d); return out.length ? out : [1]; };

  /* ================= monomial helpers: {k, parts: [[letter, index], ...]} =================
   * mono(12, [['x', 5]])            → 12x⁵
   * mono(8, [['x', 6], ['y', 3]])   → 8x⁶y³
   */
  const mono = (k, parts) => ({ k, parts: (parts || []).filter((p) => p[1] !== 0) });
  const partHtml = (p) => (p[1] === 1 ? p[0] : `${p[0]}<sup>${p[1]}</sup>`);
  const partText = (p) => (p[1] === 1 ? p[0] : `${p[0]}${sup(p[1])}`);
  const coefStr = (m) => (m.k === 1 && m.parts.length ? '' : N.fmt(m.k));
  const monoHtml = (m) => coefStr(m) + m.parts.map(partHtml).join('');
  const monoText = (m) => coefStr(m) + m.parts.map(partText).join('');

  /** typed forms of one letter power: x^2, x², x**2, xx */
  function powForms(p, rich) {
    const [v, e] = p;
    if (e === 1) return [v];
    const out = [`${v}^${e}`, `${v}${sup(e)}`];
    if (rich) { out.push(`${v}**${e}`); if (e === 2) out.push(v + v); if (e === 3) out.push(v + v + v); }
    return out;
  }
  /** every sensible way Harper might type this monomial (letters swapped, spaces or not, 1 written or left off) */
  function monoForms(m, rich) {
    const out = new Set();
    const orders = m.parts.length === 2 ? [[m.parts[0], m.parts[1]], [m.parts[1], m.parts[0]]] : [m.parts];
    const coefs = (m.k === 1 && m.parts.length) ? ['', '1'] : [N.fmt(m.k)];
    for (const ord of orders) {
      let bodies = [''];
      ord.forEach((p, i) => {
        const forms = powForms(p, rich && m.parts.length === 1);
        const next = [];
        bodies.forEach((b) => forms.forEach((f) => {
          if (i === 0) next.push(f);
          else { next.push(b + f); next.push(`${b} ${f}`); next.push(`${b}*${f}`); next.push(`${b}×${f}`); }
        }));
        bodies = next.length ? next : bodies;
      });
      bodies.forEach((b) => coefs.forEach((c) => {
        out.add(c + b);
        if (c && b) { out.add(`${c} ${b}`); out.add(`${c}*${b}`); out.add(`${c}×${b}`); }
      }));
    }
    return [...out];
  }
  const monoAnswer = (m, extra) => Object.assign({
    type: 'text',
    value: monoText(m),
    accept: monoForms(m, true),
    placeholder: m.parts.length > 1 ? 'e.g. 8x^6y^3' : `e.g. 12${m.parts.length ? m.parts[0][0] : 'x'}^5`,
  }, extra || {});

  /** answer for "m1 + m2" — both term orders, spaces or none, 1 written or left off */
  function sumAnswer(m1, m2) {
    const out = new Set();
    const A = monoForms(m1, false), B = monoForms(m2, false);
    for (const [Pa, Qa] of [[A, B], [B, A]]) for (const a of Pa) for (const b of Qa) {
      for (const s of ['+', ' + ', '+ ', ' +']) out.add(a + s + b);
    }
    return {
      type: 'text',
      value: `${monoText(m1)} + ${monoText(m2)}`,
      accept: [...out],
      placeholder: 'e.g. 5x^2 + x^3',
    };
  }

  /** build a 3–4 button choice from a correct html string + candidate distractors */
  function choiceOf(correct, candidates) {
    const set = new Set([correct]);
    for (const c of candidates) { if (set.size < 4) set.add(c); }
    const choices = R.shuffle([...set]);
    return { type: 'choice', value: choices.indexOf(correct), choices };
  }
  const RIGHT_PROMPT = ['Which working is <b>right</b>?', 'Only one of these is correct. Which one?', 'Spot the mistake: which line is <b>right</b>?'];

  /* ================= L1: evaluate powers mixed with + − × ÷ ================= */
  const SMALL = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2], [6, 2], [10, 2]];
  const MED = [[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [9, 2], [10, 2], [10, 3]];

  function evaluateQ(level) {
    const pool = level === 1 ? SMALL : MED;
    const t = R.pick(level === 1 ? ['add', 'add', 'sub', 'mul', 'div', 'same'] : ['add', 'sub', 'mul', 'div', 'same', 'diffBase', 'diffBase']);

    if (t === 'add' || t === 'sub') {
      let [a, m] = R.pick(pool), [b, n] = R.pick(pool);
      let va = pw(a, m), vb = pw(b, n), guard = 0;
      while (va === vb && guard++ < 20) { [b, n] = R.pick(pool); vb = pw(b, n); }
      if (t === 'sub' && va < vb) { [a, m, va, b, n, vb] = [b, n, vb, a, m, va]; }
      const ans = t === 'add' ? va + vb : va - vb;
      const opSym = t === 'add' ? '+' : '−';
      return {
        prompt: `${P(a, m)} ${opSym} ${P(b, n)} = ?`,
        answer: { type: 'number', value: ans },
        hint: 'Work each power out on its own first, then do the + or −. You cannot add or subtract the indices here.',
        working: [
          `${P(a, m)} = ${rep(a, m)} = ${va}`,
          `${P(b, n)} = ${rep(b, n)} = ${vb}`,
          `${va} ${opSym} ${vb} = <b>${N.fmt(ans)}</b>`,
        ],
        finalAnswer: N.fmt(ans), skill: 'evaluate',
      };
    }

    if (t === 'mul') {
      const [a, m] = R.pick(pool), c = R.int(2, level === 1 ? 5 : 9);
      const va = pw(a, m), ans = va * c;
      return {
        prompt: `${P(a, m)} × ${c} = ?`,
        answer: { type: 'number', value: ans },
        hint: `${P(a, m)} is a power, ${c} is just a number. Work the power out first.`,
        working: [`${P(a, m)} = ${rep(a, m)} = ${va}`, `${va} × ${c} = <b>${N.fmt(ans)}</b>`],
        finalAnswer: N.fmt(ans), skill: 'evaluate',
      };
    }

    if (t === 'div') {
      const [a, m] = R.pick(pool);
      const va = pw(a, m);
      const divs = [];
      for (let d = 2; d <= 12; d++) if (va % d === 0 && d < va) divs.push(d);
      const c = divs.length ? R.pick(divs) : 2;
      const ans = va / c;
      return {
        prompt: `${P(a, m)} ÷ ${c} = ?`,
        answer: { type: 'number', value: ans },
        hint: `Work ${P(a, m)} out first, then divide by ${c}.`,
        working: [`${P(a, m)} = ${rep(a, m)} = ${va}`, `${va} ÷ ${c} = <b>${N.fmt(ans)}</b>`],
        finalAnswer: N.fmt(ans), skill: 'evaluate',
      };
    }

    if (t === 'same') {
      const [a, m] = R.pick(pool);
      const va = pw(a, m), ans = va * 2;
      return {
        prompt: `${P(a, m)} + ${P(a, m)} = ?`,
        answer: { type: 'number', value: ans },
        hint: `This is a + , not a ×, so you cannot add the indices. Work ${P(a, m)} out and add it to itself.`,
        working: [
          `It is <b>+</b>, so the index law does not apply. (${P(a, m)} + ${P(a, m)} is <b>not</b> ${P(a, m + m)}.)`,
          `${P(a, m)} = ${va}`,
          `${va} + ${va} = <b>${N.fmt(ans)}</b>`,
        ],
        finalAnswer: N.fmt(ans), skill: 'no-law',
      };
    }

    // different bases: the laws do not apply, work each one out
    const DIFF = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2], [10, 2]];
    let [a, m] = R.pick(DIFF), [b, n] = R.pick(DIFF), guard = 0;
    while ((a === b || pw(a, m) * pw(b, n) > 400) && guard++ < 30) { [a, m] = R.pick(DIFF); [b, n] = R.pick(DIFF); }
    if (a === b || pw(a, m) * pw(b, n) > 400) { a = 2; m = 3; b = 3; n = 2; }
    const va = pw(a, m), vb = pw(b, n), ans = va * vb;
    return {
      prompt: `${P(a, m)} × ${P(b, n)} = ? Give your answer as a number.`,
      answer: { type: 'number', value: ans },
      hint: `The bases are different (${a} and ${b}), so you cannot add the indices. Work each power out.`,
      working: [
        `Bases are <b>different</b> (${a} and ${b}) → the index law does <b>not</b> work here.`,
        `${P(a, m)} = ${va} and ${P(b, n)} = ${vb}`,
        `${va} × ${vb} = <b>${N.fmt(ans)}</b>`,
      ],
      finalAnswer: N.fmt(ans), skill: 'no-law',
    };
  }

  /* ================= L1: what does x³ mean? ================= */
  function meaningQ() {
    if (R.chance(0.55)) {
      const v = R.pick(VARS), e = R.int(2, 5);
      const correct = Array(e).fill(v).join(' × ');
      const wrong = [`${e} × ${v}`, Array(e).fill(v).join(' + '), `${v} × ${e}`];
      return {
        prompt: `What does ${PF(v, e)} mean?`,
        answer: choiceOf(correct, wrong),
        hint: `The little ${e} tells you <b>how many ${v}s are multiplied together</b>. It does not mean ${e} × ${v}.`,
        working: [
          `<b>Picture:</b> a bag with ${e} ${v}s inside, all multiplied together.`,
          `1. What is the base? <b>${v}</b> — that is the thing being multiplied.`,
          `2. What is the index? <b>${e}</b> — that is how many of them.`,
          `So ${PF(v, e)} = <b>${correct}</b>`,
        ],
        finalAnswer: correct, skill: 'meaning',
      };
    }
    let b = R.int(2, 6), e = R.int(2, 5);
    while (b === e) e = R.int(2, 5);
    const correct = Array(e).fill(b).join(' × ');
    const wrong = [`${b} × ${e}`, Array(e).fill(b).join(' + '), `${e} × ${b}`];
    return {
      prompt: `What does ${PF(b, e)} mean?`,
      answer: choiceOf(correct, wrong),
      hint: `The little ${e} tells you <b>how many ${b}s are multiplied together</b>. It does not mean ${b} × ${e}.`,
      working: [
        `<b>Picture:</b> a bag with ${e} ${b}s inside, all multiplied together.`,
        `1. What is the base? <b>${b}</b>.`,
        `2. What is the index? <b>${e}</b> — how many ${b}s.`,
        `So ${PF(b, e)} = <b>${correct}</b> = ${pw(b, e)}`,
      ],
      finalAnswer: correct, skill: 'meaning',
    };
  }

  /* ================= like terms: 2x² + 3x² = 5x² (the oranges) ================= */
  function likeTerms(level) {
    const v = R.pick(VARS), e = R.pick(level === 1 ? [2, 2, 1, 3] : [2, 2, 3, 4, 5]);
    const plus = R.chance(level === 3 ? 0.5 : 0.7);
    const k1 = level === 1 ? R.pick([1, 1, 2, 3, 4, 5]) : R.int(2, level === 3 ? 9 : 6);
    const k2 = plus ? (level === 1 ? R.int(1, 5) : R.int(2, level === 3 ? 9 : 6)) : R.int(1, Math.max(1, k1 - 1));
    if (!plus && k1 - k2 < 1) return likeTerms(level);
    const k = plus ? k1 + k2 : k1 - k2;
    const one = mono(1, [[v, e]]);
    const q = `${monoHtml(mono(k1, [[v, e]]))} ${plus ? '+' : '−'} ${monoHtml(mono(k2, [[v, e]]))}`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(mono(k, [[v, e]])),
      hint: `Both terms are <b>${monoHtml(one)}</b> terms — same letter, same index, so they are <b>like terms</b>. Imagine each ${monoHtml(one)} is an orange and just ${plus ? 'add' : 'take away'} the numbers in front.`,
      working: [
        `<b>Picture:</b> like terms are <b>oranges</b>.`,
        `1. Are they like terms? Same letter (${v}) and same index (${e}) → <b>yes</b>.`,
        `2. So each ${monoHtml(one)} is an orange: ${k1} ${k1 === 1 ? 'orange' : 'oranges'} ${plus ? '+' : '−'} ${k2} ${k2 === 1 ? 'orange' : 'oranges'} = ${k} ${k === 1 ? 'orange' : 'oranges'}.`,
        `3. The ${monoHtml(one)} part does <b>not</b> change: <b>${monoHtml(mono(k, [[v, e]]))}</b>`,
      ],
      finalAnswer: monoHtml(mono(k, [[v, e]])), skill: 'like-terms',
    };
  }

  /** are these like terms? (choice) */
  function areLikeQ() {
    const mode = R.pick(['same', 'diffIndex', 'diffIndex', 'diffLetter']);
    const v = R.pick(VARS);
    const w = R.pick(VARS.filter((s) => s !== v));
    const e = R.int(2, 4);
    const e2 = mode === 'diffIndex' ? (e === 2 ? R.pick([3, 4]) : e - 1) : e;
    const letter2 = mode === 'diffLetter' ? w : v;
    const k1 = R.int(2, 8), k2 = R.int(2, 8);
    const t1 = mono(k1, [[v, e]]), t2 = mono(k2, [[letter2, e2]]);
    const CH = ['Yes, they are like terms', 'No, the indices are different', 'No, the letters are different', 'No, the numbers in front are different'];
    const correct = mode === 'same' ? CH[0] : mode === 'diffIndex' ? CH[1] : CH[2];
    const choices = R.shuffle(CH);
    return {
      prompt: `Are <b>${monoHtml(t1)}</b> and <b>${monoHtml(t2)}</b> like terms?`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'Like terms need the <b>same letter</b> AND the <b>same index</b>. The number in front does not matter.',
      working: mode === 'same'
        ? [`<b>Picture:</b> like terms are the same fruit — both oranges.`,
          `1. Same letter? <b>Yes</b>, both ${v}.`,
          `2. Same index? <b>Yes</b>, both ${e}.`,
          `So they are <b>like terms</b> and could be added: ${monoHtml(mono(k1 + k2, [[v, e]]))}.`]
        : mode === 'diffIndex'
          ? [`<b>Picture:</b> ${monoHtml(mono(1, [[v, e]]))} is an orange, ${monoHtml(mono(1, [[v, e2]]))} is an apple.`,
            `1. Same letter? <b>Yes</b>, both ${v}.`,
            `2. Same index? <b>No</b> — one is ${e} and one is ${e2}.`,
            `So they are <b>not</b> like terms: <b>the indices are different</b>.`]
          : [`<b>Picture:</b> ${monoHtml(mono(1, [[v, e]]))} is an orange, ${monoHtml(mono(1, [[w, e2]]))} is an apple.`,
            `1. Same letter? <b>No</b> — one is ${v}, one is ${w}.`,
            `2. Different fruit cannot be added together.`,
            `So they are <b>not</b> like terms: <b>the letters are different</b>.`],
      finalAnswer: correct, skill: 'like-terms',
    };
  }

  /** can these be collected? (choice) */
  function likeOrNot() {
    const v = R.pick(VARS), e = R.int(2, 4);
    const k1 = R.int(2, 8), k2 = R.int(2, 8);
    const same = R.chance(0.5);
    const e2 = same ? e : (e === 2 ? 3 : e - 1);
    const q = `${monoHtml(mono(k1, [[v, e]]))} + ${monoHtml(mono(k2, [[v, e2]]))}`;
    const correct = same ? monoHtml(mono(k1 + k2, [[v, e]])) : 'They cannot be added';
    const fourth = same ? monoHtml(mono(k1 + k2 + 1, [[v, e]])) : monoHtml(mono(k1 + k2, [[v, e2]]));
    const choices = R.shuffle([...new Set([monoHtml(mono(k1 + k2, [[v, e]])), monoHtml(mono(k1 + k2, [[v, e + e2]])), 'They cannot be added', fourth])]);
    return {
      prompt: `Simplify if you can: ${q}`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'You can only add LIKE terms: same letter AND same index.',
      working: same
        ? [`<b>Picture:</b> both terms are oranges.`, `1. Same letter (${v}) and same index (${e}) → they are <b>like terms</b>.`, `2. ${k1} oranges + ${k2} oranges = ${k1 + k2} oranges.`, `Answer: <b>${monoHtml(mono(k1 + k2, [[v, e]]))}</b>`]
        : [`<b>Picture:</b> oranges and apples.`, `1. The indices are <b>different</b> (${e} and ${e2}), so they are <b>not</b> like terms.`, `2. Oranges and apples cannot be added together.`, `Answer: <b>They cannot be added</b>`],
      finalAnswer: correct, skill: 'like-terms',
    };
  }

  /** collect like terms when a stray power is mixed in: 2x² + 3x² + x³ → 5x² + x³ */
  function collectTwo(level) {
    const v = R.pick(VARS);
    const pair = R.shuffle([2, 3, 4]).slice(0, 2);
    const e1 = pair[0], e2 = pair[1];
    const k1 = level === 3 ? R.int(2, 6) : R.pick([1, 2, 2, 3, 4]);
    const k2 = level === 3 ? R.int(2, 6) : R.int(1, 4);
    const k3 = R.pick([1, 1, 2, 3]);
    const collected = mono(k1 + k2, [[v, e1]]);
    const odd = mono(k3, [[v, e2]]);
    const bits = [monoHtml(mono(k1, [[v, e1]])), monoHtml(mono(k2, [[v, e1]])), monoHtml(odd)];
    const order = level === 3 ? R.shuffle([0, 1, 2]) : [0, 1, 2];
    const q = order.map((i) => bits[i]).join(' + ');
    return {
      prompt: `Simplify: ${q}`,
      answer: sumAnswer(collected, odd),
      hint: `Only the two ${monoHtml(mono(1, [[v, e1]]))} terms are like terms. Add those, and leave the ${monoHtml(mono(1, [[v, e2]]))} term on its own.`,
      working: [
        `<b>Picture:</b> ${monoHtml(mono(1, [[v, e1]]))} is an orange and ${monoHtml(mono(1, [[v, e2]]))} is an apple.`,
        `1. Which terms are like terms? The two ${monoHtml(mono(1, [[v, e1]]))} ones (same letter, same index ${e1}).`,
        `2. Add those: ${k1} + ${k2} = ${k1 + k2}, so they make ${monoHtml(collected)}.`,
        `3. The ${monoHtml(odd)} is a different fruit, so it just stays as it is.`,
        `Answer: <b>${monoHtml(collected)} + ${monoHtml(odd)}</b>`,
      ],
      finalAnswer: `${monoHtml(collected)} + ${monoHtml(odd)}`, skill: 'collect',
    };
  }

  /* ================= the multiplication law with numbers: same base, add the indices ================= */
  function multLaw(level, asNumber) {
    const opts = level === 3 ? [[2, 6], [3, 4], [5, 3], [10, 4], [4, 3], [2, 8]] : [[2, 6], [3, 4], [5, 3], [10, 3], [4, 3], [2, 7]];
    const [b, cap] = R.pick(opts);
    const m = R.int(2, cap - 1), n = R.int(1, cap - m);
    const total = m + n, ans = pw(b, total);
    const q = `${P(b, m)} × ${P(b, n)}`;
    if (asNumber) {
      return {
        prompt: `${q} = ? Give your answer as a number.`,
        answer: { type: 'number', value: ans },
        hint: `Same base, MULTIPLY → ADD the indices: ${m} + ${n} = ${total}. Then work ${P(b, total)} out.`,
        working: [
          `<b>Picture:</b> a bag of ${m} ${b}s tipped in with a bag of ${n} ${b}s.`,
          `1. Same base? <b>Yes</b>, both ${b}. Is it ×? <b>Yes</b> → add the indices.`,
          `2. ${m} + ${n} = ${total}, so ${q} = ${P(b, total)}.`,
          `3. ${P(b, total)} = ${rep(b, total)} = <b>${N.fmt(ans)}</b>`,
        ],
        finalAnswer: N.fmt(ans), skill: 'mult-law',
      };
    }
    const correct = P(b, total);
    return {
      prompt: `${q} = ? Write it as a single power.`,
      answer: choiceOf(correct, [P(b, m * n), P(b * b, total), P(b, total + 1), P(b, total + 2), P(b * b, total + 1)]),
      hint: 'Same base, MULTIPLY → ADD the indices. The base stays the same.',
      working: [
        `<b>Picture:</b> two bags of ${b}s tipped together — count all the ${b}s.`,
        `1. ${q} = ${rep(b, m)} × ${rep(b, n)}.`,
        `2. That is ${m} + ${n} = ${total} lots of ${b} multiplied together.`,
        `So ${q} = <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'mult-law',
    };
  }

  /* ================= the division law with numbers: same base, subtract the indices ================= */
  function divLaw(level, asNumber) {
    const b = R.pick(level === 3 ? [2, 2, 3, 5, 10, 4] : [2, 2, 3, 5, 10]);
    const cap = b === 2 ? 8 : b === 3 ? 5 : 4;
    const lo = Math.min(level === 3 ? 3 : 2, cap);
    const m = asNumber ? R.int(lo, cap) : R.int(Math.min(3, cap), cap);
    const n = asNumber ? R.int(1, Math.max(1, m - 1)) : R.int(1, Math.max(1, m - 2));
    const left = m - n, ans = pw(b, left);
    const q = `${P(b, m)} ÷ ${P(b, n)}`;
    if (asNumber) {
      return {
        prompt: `${q} = ? Give your answer as a number.`,
        answer: { type: 'number', value: ans },
        hint: `Same base, DIVIDE → SUBTRACT the indices: ${m} − ${n} = ${left}.${left === 1 ? '' : ` Then work ${P(b, left)} out.`}`,
        working: [
          `<b>Picture:</b> ${m} ${b}s in a bag; dividing crosses ${n} of them off.`,
          `1. Same base? <b>Yes</b>, both ${b}. Is it ÷? <b>Yes</b> → subtract the indices.`,
          `2. ${m} − ${n} = ${left}, so ${q} = ${PF(b, left)}.`,
          left === 1 ? `3. ${PF(b, 1)} is just ${b}, so the answer is <b>${b}</b>.` : `3. ${P(b, left)} = ${rep(b, left)} = <b>${N.fmt(ans)}</b>`,
        ],
        finalAnswer: N.fmt(ans), skill: 'div-law',
      };
    }
    const correct = P(b, left);
    return {
      prompt: `${q} = ? Write it as a single power.`,
      answer: choiceOf(correct, [P(b, m + n), P(b, m * n), P(b, left + 1), P(b, m), P(b, left + 2), P(b, m + n + 1)]),
      hint: 'Same base, DIVIDE → SUBTRACT the indices. The base stays the same.',
      working: [
        `<b>Picture:</b> ${m} ${b}s in a bag, and you cross ${n} of them off.`,
        `1. Write it out: ${rep(b, m)} on top, ${rep(b, n)} underneath.`,
        `2. Cross off ${n} of the ${b}s from each: ${m} − ${n} = ${left} left.`,
        `So ${q} = <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'div-law',
    };
  }

  /* ================= the same laws with LETTERS: x⁵ × x³, y⁶ ÷ y², a⁴ × a ================= */
  function algLaw(level) {
    const v = R.pick(VARS);
    const t = R.pick(['mult', 'mult', 'mult1', 'div', 'div']);
    if (t === 'mult' || t === 'mult1') {
      const m = t === 'mult1' ? R.int(2, 6) : R.int(2, 5);
      const n = t === 'mult1' ? 1 : R.int(2, 5);
      const q = `${PF(v, m)} × ${P(v, n)}`;
      return {
        prompt: `Simplify: ${q}`,
        answer: monoAnswer(mono(1, [[v, m + n]])),
        hint: `Same letter, MULTIPLY → ADD the indices: ${m} + ${n}.${n === 1 ? ` Remember ${v} on its own means ${PF(v, 1)}.` : ''}`,
        working: [
          `<b>Picture:</b> a bag of ${m} ${v}s tipped in with a bag of ${n} ${v}${n === 1 ? '' : 's'}.`,
          `1. Same letter? <b>Yes</b>, both ${v}.`,
          `2. Is it × or ÷? It is <b>×</b>, so I <b>add</b> the indices.${n === 1 ? ` (${v} means ${PF(v, 1)}.)` : ''}`,
          `3. ${m} + ${n} = ${m + n}, and the letter stays ${v}.`,
          `Answer: <b>${PF(v, m + n)}</b>`,
        ],
        finalAnswer: PF(v, m + n), skill: 'alg-mult',
      };
    }
    const m = R.int(4, 9), n = R.int(1, m - 1);
    const q = `${PF(v, m)} ÷ ${P(v, n)}`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(mono(1, [[v, m - n]])),
      hint: `Same letter, DIVIDE → SUBTRACT the indices: ${m} − ${n}.`,
      working: [
        `<b>Picture:</b> ${m} ${v}s written out, and you cross ${n} of them off.`,
        `1. Same letter? <b>Yes</b>, both ${v}.`,
        `2. Is it × or ÷? It is <b>÷</b>, so I <b>subtract</b> the indices.`,
        `3. ${m} − ${n} = ${m - n}, and the letter stays ${v}.`,
        `Answer: <b>${P(v, m - n)}</b>`,
      ],
      finalAnswer: P(v, m - n), skill: 'alg-div',
    };
  }

  /** terms with numbers in front: 3x² × 4x³ = 12x⁵ and 12x⁵ ÷ 3x² = 4x³ */
  function coefTerm(level) {
    const v = R.pick(VARS);
    if (R.chance(0.5)) {
      const k1 = R.int(2, level === 3 ? 8 : 5), k2 = R.int(2, level === 3 ? 8 : 5);
      const e1 = R.int(1, level === 3 ? 4 : 3), e2 = R.int(1, level === 3 ? 4 : 3);
      const ansM = mono(k1 * k2, [[v, e1 + e2]]);
      const q = `${monoHtml(mono(k1, [[v, e1]]))} × ${monoHtml(mono(k2, [[v, e2]]))}`;
      return {
        prompt: `Simplify: ${q}`,
        answer: monoAnswer(ansM),
        hint: `Do it in two halves: the numbers ${k1} × ${k2}, then the letters ${PF(v, e1)} × ${PF(v, e2)} (add those indices).`,
        working: [
          `<b>Picture:</b> ${k1} bags with ${e1} ${v}${e1 === 1 ? '' : 's'} in each, times ${k2} bags with ${e2} ${v}${e2 === 1 ? '' : 's'}.`,
          `1. The numbers in front multiply separately: ${k1} × ${k2} = ${k1 * k2}.`,
          `2. The letters use the index law: ${e1} + ${e2} = ${e1 + e2}, so ${PF(v, e1)} × ${PF(v, e2)} = ${PF(v, e1 + e2)}.`,
          `3. Put them together.`,
          `Answer: <b>${monoHtml(ansM)}</b>`,
        ],
        finalAnswer: monoHtml(ansM), skill: 'coef-term',
      };
    }
    const q2 = R.int(2, level === 3 ? 7 : 5), k2 = R.int(2, level === 3 ? 6 : 4);
    const k1 = q2 * k2;
    const e2 = R.int(1, 3), d = R.int(1, level === 3 ? 4 : 3);
    const e1 = e2 + d;
    const ansM = mono(q2, [[v, d]]);
    const q = `${monoHtml(mono(k1, [[v, e1]]))} ÷ ${monoHtml(mono(k2, [[v, e2]]))}`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(ansM),
      hint: `Do it in two halves: the numbers ${k1} ÷ ${k2}, then the letters ${PF(v, e1)} ÷ ${PF(v, e2)} (subtract those indices).`,
      working: [
        `<b>Picture:</b> ${k1} ${v}-bags shared into ${k2} equal piles.`,
        `1. The numbers in front divide separately: ${k1} ÷ ${k2} = ${q2}.`,
        `2. The letters use the index law: ${e1} − ${e2} = ${d}, so ${PF(v, e1)} ÷ ${PF(v, e2)} = ${P(v, d)}.`,
        `3. Put them together.`,
        `Answer: <b>${monoHtml(ansM)}</b>`,
      ],
      finalAnswer: monoHtml(ansM), skill: 'coef-term',
    };
  }

  /* ================= power of a power ================= */
  const POW_POW = [[2, 2, 2], [2, 3, 2], [2, 2, 3], [2, 4, 2], [3, 2, 2], [5, 2, 2], [4, 2, 2], [10, 2, 2], [2, 3, 3], [3, 2, 3]];
  function powerOfPower(asNumber) {
    const [b, m, n] = R.pick(asNumber ? POW_POW.filter((x) => Math.pow(x[0], x[1] * x[2]) <= 1000) : POW_POW);
    const total = m * n, ans = pw(b, total);
    const q = `(${P(b, m)})<sup>${n}</sup>`;
    if (asNumber) {
      return {
        prompt: `${q} = ? Give your answer as a number.`,
        answer: { type: 'number', value: ans },
        hint: `Power of a power → MULTIPLY the indices: ${m} × ${n} = ${total}.`,
        working: [
          `<b>Picture:</b> ${n} identical bags, each holding ${m} ${b}s.`,
          `1. ${q} means ${Array(n).fill(P(b, m)).join(' × ')}.`,
          `2. ${m} × ${n} = ${total}, so ${q} = ${P(b, total)}.`,
          `3. ${P(b, total)} = <b>${N.fmt(ans)}</b>`,
        ],
        finalAnswer: N.fmt(ans), skill: 'power-power',
      };
    }
    const correct = P(b, total);
    return {
      prompt: `${q} = ? Write it as a single power.`,
      answer: choiceOf(correct, [P(b, m + n), P(b, total + 1), P(b * b, total), P(b, m), P(b, total + 2), P(b * b, total + 1)]),
      hint: 'Power of a power → MULTIPLY the indices.',
      working: [
        `<b>Picture:</b> ${n} identical bags, each holding ${m} ${b}s.`,
        `1. ${q} means ${Array(n).fill(P(b, m)).join(' × ')}.`,
        `2. That is ${n} lots of ${m} ${b}s: ${m} × ${n} = ${total}.`,
        `So ${q} = <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'power-power',
    };
  }

  /** (x³)² = x⁶ with letters */
  function algPowerOfPower() {
    const v = R.pick(VARS), m = R.int(2, 5), n = R.int(2, 3);
    const q = `(${PF(v, m)})<sup>${n}</sup>`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(mono(1, [[v, m * n]])),
      hint: `Power of a power → MULTIPLY the indices: ${m} × ${n}.`,
      working: [
        `<b>Picture:</b> ${n} identical bags, each holding ${m} ${v}s.`,
        `1. ${q} means ${Array(n).fill(PF(v, m)).join(' × ')}.`,
        `2. That is ${n} lots of ${m} ${v}s: ${m} × ${n} = ${m * n}.`,
        `Answer: <b>${PF(v, m * n)}</b>`,
      ],
      finalAnswer: PF(v, m * n), skill: 'power-power',
    };
  }

  /* ================= a power OUTSIDE a bracket hits everything inside ================= */
  /** (2x)³ = 8x³, (3x³)² = 9x⁶, (5x²)² = 25x⁴ */
  function bracketPower(level) {
    const v = R.pick(VARS);
    if (level === 3 && R.chance(0.4)) {
      // two letters: (2x²y)³ = 8x⁶y³
      const w = R.pick(VARS.filter((s) => s !== v));
      const k = R.pick([2, 2, 3]), n = R.pick([2, 3]);
      const e1 = R.int(1, 3), e2 = R.int(1, 2);
      const K = pw(k, n);
      const ansM = mono(K, [[v, e1 * n], [w, e2 * n]]);
      const inside = `${k}${partHtml([v, e1])}${partHtml([w, e2])}`;
      return {
        prompt: `Simplify: (${inside})<sup>${n}</sup>`,
        answer: monoAnswer(ansM),
        hint: `The power ${n} outside hits <b>everything</b> inside: the ${k}, the ${v} and the ${w}.`,
        working: [
          `<b>Picture:</b> the outside ${n} is a stamp that lands on every single thing in the bracket.`,
          `1. What is outside the bracket? A power of <b>${n}</b>, so everything inside gets that power.`,
          `2. The number: ${k}<sup>${n}</sup> = ${K}.`,
          `3. The letters: multiply each index by ${n} → ${partHtml([v, e1])} → ${partHtml([v, e1 * n])} and ${partHtml([w, e2])} → ${partHtml([w, e2 * n])}.`,
          `4. Put them together: <b>${monoHtml(ansM)}</b>`,
        ],
        finalAnswer: monoHtml(ansM), skill: 'bracket-power',
      };
    }
    const combos = level === 3
      ? [[2, 1, 3], [2, 2, 3], [3, 3, 2], [5, 2, 2], [4, 1, 2], [3, 2, 2], [2, 3, 3], [10, 2, 2], [5, 3, 2], [3, 1, 3], [4, 2, 2], [2, 4, 2]]
      : [[2, 1, 3], [3, 3, 2], [5, 2, 2], [4, 1, 2], [2, 2, 2], [3, 1, 2], [2, 3, 2], [3, 2, 2], [10, 1, 2], [5, 1, 2], [2, 2, 3]];
    const [k, e, n] = R.pick(combos);
    const K = pw(k, n), E = e * n;
    const ansM = mono(K, [[v, E]]);
    const inside = `${k}${partHtml([v, e])}`;
    return {
      prompt: `Simplify: (${inside})<sup>${n}</sup>`,
      answer: monoAnswer(ansM),
      hint: `The power ${n} outside the bracket hits <b>everything</b> inside — the ${k} as well as the ${v}. Do ${k}<sup>${n}</sup> and then multiply the letter's index by ${n}.`,
      working: [
        `<b>Picture:</b> the outside ${n} is a stamp that lands on every thing inside the bracket.`,
        `1. What is outside the bracket? A power of <b>${n}</b>, so everything inside gets that power.`,
        `2. The number: ${k}<sup>${n}</sup> = ${rep(k, n)} = ${K}.`,
        `3. The letter: ${partHtml([v, e])} to the power ${n} → multiply the indices → ${e} × ${n} = ${E}, so ${PF(v, E)}.`,
        `4. Put them together: <b>${monoHtml(ansM)}</b>`,
      ],
      finalAnswer: monoHtml(ansM), skill: 'bracket-power',
    };
  }

  /** a chain that contains a bracket: (2x²)³ ÷ 4x³ = 2x³ */
  function bracketChain() {
    const v = R.pick(VARS);
    const k = R.pick([2, 2, 3]), n = R.pick([2, 3]), e = R.int(1, 3);
    const K = pw(k, n), E = e * n;
    if (R.chance(0.5)) {
      const d = R.pick(divisorsOf(K));
      const f = R.int(1, Math.max(1, E - 1));
      const ansM = mono(K / d, [[v, E - f]]);
      if (E - f < 1) return bracketChain();
      const q = `(${k}${partHtml([v, e])})<sup>${n}</sup> ÷ ${monoHtml(mono(d, [[v, f]]))}`;
      return {
        prompt: `Simplify: ${q}`,
        answer: monoAnswer(ansM),
        hint: `Do the bracket first: (${k}${partHtml([v, e])})<sup>${n}</sup> = ${monoHtml(mono(K, [[v, E]]))}. Then divide.`,
        working: [
          `<b>Picture:</b> open the bracket first, then share what is left out.`,
          `1. Bracket first: the outside ${n} hits everything → ${k}<sup>${n}</sup> = ${K} and ${e} × ${n} = ${E}.`,
          `2. So (${k}${partHtml([v, e])})<sup>${n}</sup> = ${monoHtml(mono(K, [[v, E]]))}.`,
          `3. Now divide: numbers ${K} ÷ ${d} = ${K / d}; letters ${E} − ${f} = ${E - f}.`,
          `Answer: <b>${monoHtml(ansM)}</b>`,
        ],
        finalAnswer: monoHtml(ansM), skill: 'bracket-chain',
      };
    }
    const c = R.int(2, 4), f = R.int(1, 3);
    const ansM = mono(K * c, [[v, E + f]]);
    const q = `(${k}${partHtml([v, e])})<sup>${n}</sup> × ${monoHtml(mono(c, [[v, f]]))}`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(ansM),
      hint: `Do the bracket first: (${k}${partHtml([v, e])})<sup>${n}</sup> = ${monoHtml(mono(K, [[v, E]]))}. Then multiply.`,
      working: [
        `<b>Picture:</b> open the bracket first, then tip the two bags together.`,
        `1. Bracket first: the outside ${n} hits everything → ${k}<sup>${n}</sup> = ${K} and ${e} × ${n} = ${E}.`,
        `2. So (${k}${partHtml([v, e])})<sup>${n}</sup> = ${monoHtml(mono(K, [[v, E]]))}.`,
        `3. Now multiply: numbers ${K} × ${c} = ${K * c}; letters ${E} + ${f} = ${E + f}.`,
        `Answer: <b>${monoHtml(ansM)}</b>`,
      ],
      finalAnswer: monoHtml(ansM), skill: 'bracket-chain',
    };
  }

  /* ================= zero index ================= */
  function zeroIndex() {
    const b = R.int(2, 12);
    const t = R.pick(['plain', 'plain', 'plusPower', 'timesNum']);
    if (t === 'plain') {
      return {
        prompt: `${PF(b, 0)} = ?`,
        answer: { type: 'number', value: 1 },
        hint: 'Anything to the power 0 is 1.',
        working: [`Any number (except 0) to the power <b>0</b> is <b>1</b>.`, `${PF(b, 0)} = <b>1</b>`],
        finalAnswer: '1', skill: 'zero-index',
      };
    }
    if (t === 'plusPower') {
      const [c, e] = R.pick(SMALL);
      const ans = 1 + pw(c, e);
      return {
        prompt: `${PF(b, 0)} + ${P(c, e)} = ?`,
        answer: { type: 'number', value: ans },
        hint: `${PF(b, 0)} = 1. Then work out ${P(c, e)} and add.`,
        working: [`${PF(b, 0)} = <b>1</b> (anything to the power 0 is 1).`, `${P(c, e)} = ${pw(c, e)}`, `1 + ${pw(c, e)} = <b>${N.fmt(ans)}</b>`],
        finalAnswer: N.fmt(ans), skill: 'zero-index',
      };
    }
    const c = R.int(2, 12);
    return {
      prompt: `${PF(b, 0)} × ${c} = ?`,
      answer: { type: 'number', value: c },
      hint: `${PF(b, 0)} = 1, and 1 × anything stays the same.`,
      working: [`${PF(b, 0)} = <b>1</b>.`, `1 × ${c} = <b>${c}</b>`],
      finalAnswer: String(c), skill: 'zero-index',
    };
  }

  /** x⁰ = 1, 4x⁰ = 4, x⁵ ÷ x⁵ = 1 */
  function algZero() {
    const v = R.pick(VARS);
    const t = R.pick(['plain', 'plain', 'coef', 'divSame']);
    if (t === 'plain') {
      return {
        prompt: `Simplify ${PF(v, 0)}. Give your answer as a number.`,
        answer: { type: 'number', value: 1 },
        hint: 'Anything to the power 0 is 1 — letters too.',
        working: [
          `<b>Picture:</b> an empty bag — no ${v}s left to multiply.`,
          `1. What is the index? <b>0</b>.`,
          `2. anything<sup>0</sup> = 1, and that includes letters.`,
          `${PF(v, 0)} = <b>1</b>`,
        ],
        finalAnswer: '1', skill: 'zero-index',
      };
    }
    if (t === 'coef') {
      const k = R.int(2, 9);
      return {
        prompt: `Simplify ${k}${PF(v, 0)}. Give your answer as a number.`,
        answer: { type: 'number', value: k },
        hint: `${PF(v, 0)} = 1, so ${k}${PF(v, 0)} = ${k} × 1.`,
        working: [
          `<b>Picture:</b> ${k} empty bags — the ${v} part has vanished.`,
          `1. ${PF(v, 0)} = <b>1</b> (anything to the power 0 is 1).`,
          `2. The ${k} in front stays: ${k} × 1 = ${k}.`,
          `Answer: <b>${k}</b>`,
        ],
        finalAnswer: String(k), skill: 'zero-index',
      };
    }
    const m = R.int(3, 7);
    return {
      prompt: `Simplify ${PF(v, m)} ÷ ${PF(v, m)}. Give your answer as a number.`,
      answer: { type: 'number', value: 1 },
      hint: `Same letter, DIVIDE → SUBTRACT: ${m} − ${m} = 0, and ${PF(v, 0)} = 1.`,
      working: [
        `<b>Picture:</b> ${m} ${v}s written out, and you cross all ${m} of them off.`,
        `1. Same letter, and it is ÷ → subtract the indices.`,
        `2. ${m} − ${m} = 0, so the answer is ${PF(v, 0)}.`,
        `3. ${PF(v, 0)} = <b>1</b>.`,
      ],
      finalAnswer: '1', skill: 'zero-index',
    };
  }

  /* ================= chains: two laws in one ================= */
  /** 2⁵ × 2³ ÷ 2⁶ */
  function chain() {
    const b = R.pick([2, 2, 2, 3]);
    const cap = b === 2 ? 9 : 5;
    const m = R.int(2, cap - 2), n = R.int(2, cap - m), k = R.int(1, Math.max(1, m + n - 2));
    const total = m + n - k;
    const correct = P(b, total);
    return {
      prompt: `${P(b, m)} × ${P(b, n)} ÷ ${P(b, k)} = ? Write it as a single power.`,
      answer: choiceOf(correct, [P(b, m + n + k), P(b, m * n), P(b, total + 1), P(b, m), P(b, total + 2), P(b, m + n)]),
      hint: `Left to right: add the first two indices, then subtract ${k}.`,
      working: [
        `<b>Picture:</b> tip two bags of ${b}s together, then cross ${k} of them off.`,
        `1. Multiply first: ${m} + ${n} = ${m + n}, so ${P(b, m)} × ${P(b, n)} = ${P(b, m + n)}.`,
        `2. Now divide: ${m + n} − ${k} = ${total}.`,
        `Answer: <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'chain',
    };
  }

  /** x⁵ × x³ ÷ x² and 2x³ × 3x² ÷ x */
  function algChain(level) {
    const v = R.pick(VARS);
    const m = R.int(3, 6), n = R.int(2, 4), k = R.int(1, m + n - 2);
    const e = m + n - k;
    if (R.chance(level === 3 ? 0.5 : 0.35)) {
      const a = R.int(2, 5), b = R.int(2, 5);
      const divs = divisorsOf(a * b);
      const d = R.pick(divs.filter((x) => x <= a * b) );
      const ansM = mono((a * b) / d, [[v, e]]);
      const q = `${monoHtml(mono(a, [[v, m]]))} × ${monoHtml(mono(b, [[v, n]]))} ÷ ${monoHtml(mono(d, [[v, k]]))}`;
      return {
        prompt: `Simplify: ${q}`,
        answer: monoAnswer(ansM),
        hint: `Numbers on one side (${a} × ${b} ÷ ${d}), letters on the other (${m} + ${n} − ${k}).`,
        working: [
          `<b>Picture:</b> tip two ${v}-bags together, then share them out.`,
          `1. The numbers: ${a} × ${b} = ${a * b}, then ${a * b} ÷ ${d} = ${(a * b) / d}.`,
          `2. The letters: × means add → ${m} + ${n} = ${m + n}; ÷ means subtract → ${m + n} − ${k} = ${e}.`,
          `3. Put them together.`,
          `Answer: <b>${monoHtml(ansM)}</b>`,
        ],
        finalAnswer: monoHtml(ansM), skill: 'alg-chain',
      };
    }
    const ansM = mono(1, [[v, e]]);
    const q = `${PF(v, m)} × ${PF(v, n)} ÷ ${P(v, k)}`;
    return {
      prompt: `Simplify: ${q}`,
      answer: monoAnswer(ansM),
      hint: `Work left to right: add the first two indices, then subtract ${k}.`,
      working: [
        `<b>Picture:</b> tip two bags of ${v}s together, then cross ${k} ${v}${k === 1 ? '' : 's'} off.`,
        `1. Multiply first: ${m} + ${n} = ${m + n}, so ${PF(v, m)} × ${PF(v, n)} = ${PF(v, m + n)}.`,
        `2. Now divide: ${m + n} − ${k} = ${e}.`,
        `Answer: <b>${PF(v, e)}</b>`,
      ],
      finalAnswer: PF(v, e), skill: 'alg-chain',
    };
  }

  /* ================= the laws do NOT apply: different letters / different bases ================= */
  function diffLetters() {
    const picked = R.sample(VARS, 2);
    const v = picked[0], w = picked[1];
    const m = R.int(2, 5), n = R.int(2, 4);
    const ansM = mono(1, [[v, m], [w, n]]);
    const correct = monoHtml(ansM);
    if (R.chance(0.5)) {
      return {
        prompt: `Simplify if you can: ${PF(v, m)} × ${PF(w, n)}`,
        answer: choiceOf(correct, [PF(v, m + n), `(${v}${w})<sup>${m + n}</sup>`, `${PF(v, m * n)}${PF(w, m * n)}`, `${PF(v, m + n)}${PF(w, m + n)}`]),
        hint: `The letters are <b>different</b> (${v} and ${w}), so there is no index law to use. Just write them next to each other.`,
        working: [
          `<b>Picture:</b> a bag of ${v}s and a bag of ${w}s — different fruit, so you cannot count them as one pile.`,
          `1. Same letter? <b>No</b> — one is ${v}, one is ${w}.`,
          `2. So the add-the-indices law does <b>not</b> apply.`,
          `3. Just write them side by side.`,
          `Answer: <b>${correct}</b>`,
        ],
        finalAnswer: correct, skill: 'no-law',
      };
    }
    return {
      prompt: `Simplify if you can: ${PF(v, m)} × ${PF(w, n)}`,
      answer: monoAnswer(ansM),
      hint: `The letters are <b>different</b> (${v} and ${w}), so there is no index law. Write the answer as ${v} to the power ${m} next to ${w} to the power ${n}.`,
      working: [
        `<b>Picture:</b> a bag of ${v}s and a bag of ${w}s — different fruit, so they stay separate.`,
        `1. Same letter? <b>No</b> — one is ${v}, one is ${w}.`,
        `2. So you cannot add the indices.`,
        `3. It just stays as it is, written side by side.`,
        `Answer: <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'no-law',
    };
  }

  /* ================= spot the mistake ================= */
  function spotMistake() {
    const t = R.pick(['mult', 'mult', 'div', 'add']);
    if (t === 'mult') {
      const b = R.int(2, 5), m = R.int(2, 4), n = R.int(2, 4);
      const correct = `${P(b, m)} × ${P(b, n)} = ${P(b, m + n)}`;
      const wrong = [`${P(b, m)} × ${P(b, n)} = ${P(b * b, m + n)}`, `${P(b, m)} × ${P(b, n)} = ${P(b, m * n)}`, `${P(b, m)} × ${P(b, n)} = ${P(b, m + n + 1)}`, `${P(b, m)} × ${P(b, n)} = ${P(b, m + n + 2)}`];
      return {
        prompt: R.pick(RIGHT_PROMPT),
        answer: choiceOf(correct, wrong),
        hint: 'Same base, MULTIPLY → ADD the indices. The base never changes.',
        working: [`Same base (${b}) and it is ×, so add the indices: ${m} + ${n} = ${m + n}.`, `The base stays ${b} (it does <b>not</b> become ${b * b}).`, `Right working: <b>${correct}</b>`],
        finalAnswer: correct, skill: 'spot-mistake',
      };
    }
    if (t === 'div') {
      const b = R.int(2, 5), m = R.int(3, 6), n = R.int(1, 2);
      const correct = `${P(b, m)} ÷ ${P(b, n)} = ${PF(b, m - n)}`;
      const wrong = [`${P(b, m)} ÷ ${P(b, n)} = ${PF(b, m + n)}`, `${P(b, m)} ÷ ${P(b, n)} = ${PF(b, m - n + 1)}`, `${P(b, m)} ÷ ${P(b, n)} = ${PF(b, m)}`, `${P(b, m)} ÷ ${P(b, n)} = ${PF(b, m + n + 1)}`];
      return {
        prompt: R.pick(RIGHT_PROMPT),
        answer: choiceOf(correct, wrong),
        hint: 'Same base, DIVIDE → SUBTRACT the indices.',
        working: [`Same base (${b}) and it is ÷, so subtract the indices: ${m} − ${n} = ${m - n}.`, `Right working: <b>${correct}</b>`],
        finalAnswer: correct, skill: 'spot-mistake',
      };
    }
    const b = R.int(2, 5), m = R.int(2, 3);
    const v = pw(b, m);
    const correct = `${P(b, m)} + ${P(b, m)} = ${N.fmt(2 * v)}`;
    const wrong = [`${P(b, m)} + ${P(b, m)} = ${P(b, m + m)}`, `${P(b, m)} + ${P(b, m)} = ${P(b * 2, m)}`, `${P(b, m)} + ${P(b, m)} = ${P(b, m + 1)}`];
    return {
      prompt: R.pick(RIGHT_PROMPT),
      answer: choiceOf(correct, wrong),
      hint: 'The index laws are for × and ÷ only. For + you must work the powers out.',
      working: [`It is <b>+</b>, so there is no index law to use.`, `${P(b, m)} = ${v}, so ${v} + ${v} = ${N.fmt(2 * v)}.`, `Right working: <b>${correct}</b>`],
      finalAnswer: correct, skill: 'spot-mistake',
    };
  }

  /** spot the mistake with letters: x⁵ × x³ = x¹⁵ or x⁸?  2x² + 3x² = 5x⁴ or 5x²?  (3x³)² = 3x⁶ or 9x⁶? */
  function algSpotMistake() {
    const v = R.pick(VARS);
    const t = R.pick(['mult', 'add', 'bracket', 'bracket', 'div']);
    if (t === 'mult') {
      const m = R.int(3, 6), n = R.int(2, 4);
      const q = `${PF(v, m)} × ${PF(v, n)}`;
      const correct = `${q} = ${PF(v, m + n)}`;
      const wrong = [`${q} = ${PF(v, m * n)}`, `${q} = 2${PF(v, m + n)}`, `${q} = ${PF(v, m + n + 1)}`, `${q} = ${PF(v, m + n + 2)}`];
      return {
        prompt: R.pick(RIGHT_PROMPT),
        answer: choiceOf(correct, wrong),
        hint: 'Same letter, MULTIPLY → ADD the indices (do not multiply them).',
        working: [
          `1. Same letter (${v}) and it is × → <b>add</b> the indices.`,
          `2. ${m} + ${n} = ${m + n}, not ${m} × ${n} = ${m * n}.`,
          `Right working: <b>${correct}</b>`,
        ],
        finalAnswer: correct, skill: 'spot-mistake',
      };
    }
    if (t === 'add') {
      const e = R.int(2, 4), k1 = R.int(2, 5), k2 = R.int(2, 5);
      const q = `${monoHtml(mono(k1, [[v, e]]))} + ${monoHtml(mono(k2, [[v, e]]))}`;
      const correct = `${q} = ${monoHtml(mono(k1 + k2, [[v, e]]))}`;
      const wrong = [`${q} = ${monoHtml(mono(k1 + k2, [[v, e + e]]))}`, `${q} = ${monoHtml(mono(k1 * k2, [[v, e]]))}`, `${q} = ${monoHtml(mono(k1 + k2, [[v, e + 1]]))}`, `${q} = ${monoHtml(mono(k1 + k2 + 1, [[v, e]]))}`];
      return {
        prompt: R.pick(RIGHT_PROMPT),
        answer: choiceOf(correct, wrong),
        hint: 'Adding like terms only changes the number in front. The index stays the same.',
        working: [
          `<b>Picture:</b> ${k1} oranges + ${k2} oranges = ${k1 + k2} oranges.`,
          `1. It is <b>+</b>, so there is no index law — the index does <b>not</b> change.`,
          `2. Only the numbers in front add: ${k1} + ${k2} = ${k1 + k2}.`,
          `Right working: <b>${correct}</b>`,
        ],
        finalAnswer: correct, skill: 'spot-mistake',
      };
    }
    if (t === 'bracket') {
      const k = R.pick([3, 4, 5]), e = R.int(1, 3), n = 2;
      const K = pw(k, n), E = e * n;
      const q = `(${k}${partHtml([v, e])})<sup>${n}</sup>`;
      const correct = `${q} = ${monoHtml(mono(K, [[v, E]]))}`;
      const wrong = [`${q} = ${monoHtml(mono(k, [[v, E]]))}`, `${q} = ${monoHtml(mono(k * n, [[v, E]]))}`, `${q} = ${monoHtml(mono(K, [[v, E - 1]]))}`, `${q} = ${monoHtml(mono(K, [[v, E + 1]]))}`];
      return {
        prompt: R.pick(RIGHT_PROMPT),
        answer: choiceOf(correct, wrong),
        hint: `The power outside the bracket hits the <b>number too</b>: ${k}<sup>${n}</sup> = ${K}, not ${k} and not ${k * n}.`,
        working: [
          `<b>Picture:</b> the outside ${n} is a stamp that lands on every thing inside.`,
          `1. The number gets the power as well: ${k}<sup>${n}</sup> = ${K}.`,
          `2. The letter's index is multiplied: ${e} × ${n} = ${E}.`,
          `Right working: <b>${correct}</b>`,
        ],
        finalAnswer: correct, skill: 'spot-mistake',
      };
    }
    const m = R.int(5, 9), n = R.int(2, 3);
    const q = `${PF(v, m)} ÷ ${PF(v, n)}`;
    const correct = `${q} = ${PF(v, m - n)}`;
    const wrong = [`${q} = ${PF(v, m / n === Math.round(m / n) ? m / n : m - n + 1)}`, `${q} = ${PF(v, m + n)}`, `${q} = ${PF(v, m)}`, `${q} = ${PF(v, m - n + 2)}`];
    return {
      prompt: R.pick(RIGHT_PROMPT),
      answer: choiceOf(correct, wrong),
      hint: 'Same letter, DIVIDE → SUBTRACT the indices (do not divide them).',
      working: [
        `1. Same letter (${v}) and it is ÷ → <b>subtract</b> the indices.`,
        `2. ${m} − ${n} = ${m - n}.`,
        `Right working: <b>${correct}</b>`,
      ],
      finalAnswer: correct, skill: 'spot-mistake',
    };
  }

  /* ================= calc router — letters at every level ================= */
  function calc(level) {
    if (level === 1) {
      // numeric: eval ×3, meaning (half numeric)  |  letters: meaning, like ×2, areLike, mult law
      const t = R.pick(['eval', 'eval', 'eval', 'mean', 'mean', 'like', 'like', 'areLike', 'multC']);
      if (t === 'mean') return meaningQ();
      if (t === 'like') return likeTerms(1);
      if (t === 'areLike') return areLikeQ();
      if (t === 'multC') return multLaw(1, false);
      return evaluateQ(1);
    }
    if (level === 2) {
      const t = R.pick([
        // numbers
        'multC', 'multN', 'divC', 'divN', 'eval', 'eval', 'multC',
        // letters
        'alg', 'alg', 'coef', 'coef', 'bracket', 'bracket', 'collect', 'like', 'likeOrNot',
      ]);
      if (t === 'multC') return multLaw(2, false);
      if (t === 'multN') return multLaw(2, true);
      if (t === 'divC') return divLaw(2, false);
      if (t === 'divN') return divLaw(2, true);
      if (t === 'alg') return algLaw(2);
      if (t === 'coef') return coefTerm(2);
      if (t === 'bracket') return bracketPower(2);
      if (t === 'collect') return collectTwo(2);
      if (t === 'like') return likeTerms(2);
      if (t === 'likeOrNot') return likeOrNot();
      return evaluateQ(2);
    }
    const t = R.pick([
      // numbers
      'powC', 'powN', 'zero', 'divN', 'spot', 'spot', 'chain', 'eval', 'eval',
      // letters
      'algPow', 'algZero', 'algChain', 'algChain', 'bracket', 'bracket', 'bracketChain', 'algSpot', 'algSpot', 'diffLet', 'coef', 'collect',
    ]);
    if (t === 'powC') return powerOfPower(false);
    if (t === 'powN') return powerOfPower(true);
    if (t === 'zero') return zeroIndex();
    if (t === 'divN') return divLaw(3, true);
    if (t === 'spot') return spotMistake();
    if (t === 'chain') return chain();
    if (t === 'algPow') return algPowerOfPower();
    if (t === 'algZero') return algZero();
    if (t === 'algChain') return algChain(3);
    if (t === 'bracket') return bracketPower(3);
    if (t === 'bracketChain') return bracketChain();
    if (t === 'algSpot') return algSpotMistake();
    if (t === 'diffLet') return diffLetters();
    if (t === 'coef') return coefTerm(3);
    if (t === 'collect') return collectTwo(3);
    return evaluateQ(3);
  }

  /* ================= word problems ================= */
  function word(level) {
    const t = R.pick(level === 1 ? ['bacteria', 'fold', 'split', 'jars', 'tileX', 'tileX']
      : level === 2 ? ['bacteria', 'fold', 'jars', 'boxes10', 'road', 'squareK', 'cubeK', 'gardenK', 'shareK']
        : ['bacteria', 'boxes10', 'road', 'tournament', 'squareK', 'cubeK', 'gardenK', 'shareK', 'squareK']);

    /* ---- letters ---- */
    if (t === 'tileX') {
      const v = R.pick(['x', 'y', 'a']);
      const thing = R.pick(['tile', 'photo', 'sticker', 'coaster']);
      return {
        prompt: `A square ${thing} has sides of ${v} cm. Write an expression for its area. (Area = side × side.)`,
        answer: monoAnswer(mono(1, [[v, 2]]), { unit: 'cm²' }),
        hint: `Area = ${v} × ${v}. Same letter, MULTIPLY → ADD the indices (${v} means ${PF(v, 1)}).`,
        working: [
          `<b>Picture:</b> a square ${thing}, both sides the same length.`,
          `1. Area = side × side = ${v} × ${v}.`,
          `2. ${v} means ${PF(v, 1)}, so 1 + 1 = 2.`,
          `Answer: <b>${PF(v, 2)}</b> cm²`,
        ],
        finalAnswer: `${PF(v, 2)} cm²`, skill: 'word-alg',
      };
    }

    if (t === 'squareK') {
      const v = R.pick(['x', 'y', 'a']);
      const k = R.pick([2, 3, 4, 5]), e = level === 3 ? R.int(2, 3) : R.int(1, 3);
      const ansM = mono(k * k, [[v, 2 * e]]);
      const side = monoHtml(mono(k, [[v, e]]));
      return {
        prompt: `A square photo frame has sides of ${side} cm. Write an expression for its area. (Area = side × side.)`,
        answer: monoAnswer(ansM, { unit: 'cm²' }),
        hint: `Area = (${side})<sup>2</sup>. The power 2 hits everything inside: ${k}<sup>2</sup> = ${k * k}, and the letter's index doubles.`,
        working: [
          `<b>Picture:</b> a square, both sides ${side} cm.`,
          `1. Area = side × side = (${side})<sup>2</sup>.`,
          `2. The number: ${k}<sup>2</sup> = ${k * k}.`,
          `3. The letter: ${e} × 2 = ${2 * e}, so ${PF(v, 2 * e)}.`,
          `Answer: <b>${monoHtml(ansM)}</b> cm²`,
        ],
        finalAnswer: `${monoHtml(ansM)} cm²`, skill: 'word-alg',
      };
    }

    if (t === 'cubeK') {
      const v = R.pick(['x', 'y', 'a']);
      const k = R.pick([2, 2, 3]), e = level === 3 ? R.int(1, 2) : 1;
      const ansM = mono(pw(k, 3), [[v, 3 * e]]);
      const side = monoHtml(mono(k, [[v, e]]));
      return {
        prompt: `A cube-shaped box has sides of ${side} cm. Write an expression for its volume. (Volume = side × side × side.)`,
        answer: monoAnswer(ansM, { unit: 'cm³' }),
        hint: `Volume = (${side})<sup>3</sup>. The power 3 hits everything inside: ${k}<sup>3</sup> = ${pw(k, 3)}, and the letter's index is multiplied by 3.`,
        working: [
          `<b>Picture:</b> a cube — all three sides the same, ${side} cm.`,
          `1. Volume = side × side × side = (${side})<sup>3</sup>.`,
          `2. The number: ${k}<sup>3</sup> = ${rep(k, 3)} = ${pw(k, 3)}.`,
          `3. The letter: ${e} × 3 = ${3 * e}, so ${PF(v, 3 * e)}.`,
          `Answer: <b>${monoHtml(ansM)}</b> cm³`,
        ],
        finalAnswer: `${monoHtml(ansM)} cm³`, skill: 'word-alg',
      };
    }

    if (t === 'gardenK') {
      const v = R.pick(['x', 'y', 'a']);
      const k1 = R.int(2, 6), k2 = R.int(2, 6);
      const e1 = R.int(1, level === 3 ? 4 : 2), e2 = R.int(1, level === 3 ? 4 : 3);
      const ansM = mono(k1 * k2, [[v, e1 + e2]]);
      const place = R.pick(['vegetable garden', 'netball court', 'sandpit', 'deck']);
      return {
        prompt: `A rectangular ${place} is ${monoHtml(mono(k1, [[v, e1]]))} m long and ${monoHtml(mono(k2, [[v, e2]]))} m wide. Write an expression for its area.`,
        answer: monoAnswer(ansM, { unit: 'm²' }),
        hint: `Area = length × width. Numbers: ${k1} × ${k2}. Letters: add the indices ${e1} + ${e2}.`,
        working: [
          `<b>Picture:</b> a rectangle — area is length × width.`,
          `1. Area = ${monoHtml(mono(k1, [[v, e1]]))} × ${monoHtml(mono(k2, [[v, e2]]))}.`,
          `2. The numbers multiply separately: ${k1} × ${k2} = ${k1 * k2}.`,
          `3. The letters add their indices: ${e1} + ${e2} = ${e1 + e2}.`,
          `Answer: <b>${monoHtml(ansM)}</b> m²`,
        ],
        finalAnswer: `${monoHtml(ansM)} m²`, skill: 'word-alg',
      };
    }

    if (t === 'shareK') {
      const v = R.pick(['x', 'y', 'a']);
      const q2 = R.int(2, 6), k2 = R.int(2, 5);
      const k1 = q2 * k2;
      const e2 = R.int(1, 2), d = R.int(1, level === 3 ? 4 : 2), e1 = e2 + d;
      const ansM = mono(q2, [[v, d]]);
      const thing = R.pick(['lollies', 'marbles', 'feijoas', 'stickers']);
      return {
        prompt: `A shop has ${monoHtml(mono(k1, [[v, e1]]))} ${thing}. They are shared equally into ${monoHtml(mono(k2, [[v, e2]]))} bags. Write an expression for how many go in each bag.`,
        answer: monoAnswer(ansM),
        hint: `Sharing means divide: ${monoHtml(mono(k1, [[v, e1]]))} ÷ ${monoHtml(mono(k2, [[v, e2]]))}. Numbers ${k1} ÷ ${k2}, letters ${e1} − ${e2}.`,
        working: [
          `<b>Picture:</b> a big pile of ${thing} shared into equal bags.`,
          `1. Sharing = divide: ${monoHtml(mono(k1, [[v, e1]]))} ÷ ${monoHtml(mono(k2, [[v, e2]]))}.`,
          `2. The numbers divide separately: ${k1} ÷ ${k2} = ${q2}.`,
          `3. The letters subtract their indices: ${e1} − ${e2} = ${d}.`,
          `Answer: <b>${monoHtml(ansM)}</b>`,
        ],
        finalAnswer: monoHtml(ansM), skill: 'word-alg',
      };
    }

    /* ---- numbers ---- */
    if (t === 'bacteria') {
      const hours = level === 1 ? R.int(3, 4) : level === 2 ? R.int(5, 6) : R.int(7, 8);
      const ans = pw(2, hours);
      const name = R.pick(['a science class', 'Harper\'s science class', 'a lab at the museum']);
      return {
        prompt: `In ${name} there is 1 bacterium in a dish. It <b>doubles every hour</b>. How many bacteria are there after ${hours} hours?`,
        answer: { type: 'number', value: ans, unit: 'bacteria' },
        hint: `Doubling means × 2 each hour, so after ${hours} hours it is 2<sup>${hours}</sup>.`,
        working: [`Doubling → the base is <b>2</b>. ${hours} hours → the index is <b>${hours}</b>.`, `${P(2, hours)} = ${rep(2, hours)}`, `= <b>${N.fmt(ans)}</b> bacteria`],
        finalAnswer: `${N.fmt(ans)} bacteria`, skill: 'word-power',
      };
    }

    if (t === 'fold') {
      const folds = level === 1 ? R.int(3, 4) : R.int(5, 6);
      const ans = pw(2, folds);
      return {
        prompt: `Harper folds a piece of paper in half ${folds} times. Each fold <b>doubles</b> the number of layers. How many layers are there?`,
        answer: { type: 'number', value: ans, unit: 'layers' },
        hint: `Each fold is × 2, so ${folds} folds give 2<sup>${folds}</sup> layers.`,
        working: [`Each fold doubles the layers → base <b>2</b>, index <b>${folds}</b>.`, `${P(2, folds)} = ${rep(2, folds)} = <b>${ans}</b>`, `<b>${ans} layers</b>`],
        finalAnswer: `${ans} layers`, skill: 'word-power',
      };
    }

    if (t === 'split') {
      const hours = R.int(2, level === 1 ? 3 : 4);
      const ans = pw(3, hours);
      return {
        prompt: `A tiny plant cell splits into <b>3</b> cells every hour. Starting with 1 cell, how many cells are there after ${hours} hours?`,
        answer: { type: 'number', value: ans, unit: 'cells' },
        hint: `Times 3 each hour, so after ${hours} hours it is 3<sup>${hours}</sup>.`,
        working: [`Splitting into 3 → base <b>3</b>, index <b>${hours}</b>.`, `${P(3, hours)} = ${rep(3, hours)} = <b>${ans}</b>`, `<b>${ans} cells</b>`],
        finalAnswer: `${ans} cells`, skill: 'word-power',
      };
    }

    if (t === 'jars') {
      const m = level === 1 ? 2 : R.int(3, 4), n = level === 1 ? 2 : R.int(2, 3);
      const ans = pw(2, m + n);
      const thing = R.pick(['lollies', 'marbles', 'feijoas', 'jelly beans']);
      return {
        prompt: `A jar holds ${P(2, m)} ${thing}. Harper buys ${P(2, n)} jars. How many ${thing} is that altogether?`,
        answer: { type: 'number', value: ans, unit: thing },
        hint: `${P(2, m)} × ${P(2, n)}: same base, MULTIPLY → ADD the indices (${m} + ${n}).`,
        working: [`Altogether = ${P(2, m)} × ${P(2, n)}.`, `Same base, so add the indices: ${m} + ${n} = ${m + n} → ${P(2, m + n)}.`, `${P(2, m + n)} = <b>${ans}</b> ${thing}`],
        finalAnswer: `${ans} ${thing}`, skill: 'word-law',
      };
    }

    if (t === 'boxes10') {
      const m = 2, n = level === 3 ? 3 : 2;
      const ans = pw(10, m + n);
      return {
        prompt: `A box holds ${P(10, m)} nails. A hardware shop has ${P(10, n)} boxes. How many nails is that altogether?`,
        answer: { type: 'number', value: ans, unit: 'nails' },
        hint: `${P(10, m)} × ${P(10, n)}: same base, so add the indices (${m} + ${n}).`,
        working: [`Altogether = ${P(10, m)} × ${P(10, n)}.`, `Same base, MULTIPLY → ADD the indices: ${m} + ${n} = ${m + n}.`, `${P(10, m + n)} = <b>${N.fmt(ans)}</b> nails`],
        finalAnswer: `${N.fmt(ans)} nails`, skill: 'word-law',
      };
    }

    if (t === 'road') {
      const m = level === 3 ? R.int(3, 4) : 3, n = 2;
      const ans = pw(10, m - n);
      const road = R.pick(['road to the beach', 'walk to the marae', 'cycle trail']);
      return {
        prompt: `The school field is ${P(10, n)} m long. The ${road} is ${P(10, m)} m long. How many times longer is the ${road}?`,
        answer: { type: 'number', value: ans, unit: 'times' },
        hint: `"How many times longer" means divide: ${P(10, m)} ÷ ${P(10, n)}. Same base, so subtract the indices.`,
        working: [`How many times longer = ${P(10, m)} ÷ ${P(10, n)}.`, `Same base, DIVIDE → SUBTRACT the indices: ${m} − ${n} = ${m - n}.`, `${PF(10, m - n)} = <b>${N.fmt(ans)}</b> times longer`],
        finalAnswer: `${N.fmt(ans)} times`, skill: 'word-law',
      };
    }

    // knockout tournament: half the teams go out each round
    const rounds = R.int(3, 5);
    const teams = pw(2, rounds);
    return {
      prompt: `A netball knockout tournament has ${teams} teams. Half the teams are knocked out each round. How many rounds until there is 1 winner?`,
      answer: { type: 'number', value: rounds, unit: 'rounds' },
      hint: `${teams} = 2<sup>?</sup>. The index tells you how many rounds of halving.`,
      working: [`Halving each round → write ${teams} as a power of 2.`, `${P(2, rounds)} = ${rep(2, rounds)} = ${teams}.`, `The index is ${rounds}, so it takes <b>${rounds} rounds</b>.`],
      finalAnswer: `${rounds} rounds`, skill: 'word-power',
    };
  }

  HL.registerTopic({
    id: 'index-laws', subject: 'maths', strand: 'algebra', order: 3,
    name: 'Index laws (powers with letters)', short: 'Index laws',
    blurb: 'The short cuts for multiplying, dividing and bracketing powers — with letters as well as numbers.',
    example: 'x<sup>5</sup> × x<sup>3</sup> = x<sup>8</sup> &nbsp;·&nbsp; (3x<sup>3</sup>)<sup>2</sup> = 9x<sup>6</sup>',
    animal: 'koala',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', PINK = '#F9A8C9', SKY = '#A9D8F5', GREEN = '#2FA97A', LAV = '#C9B8F2', PEACH = '#FFC79A';
      const GREY = '#8A7D8F';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      /** one little box holding a base (a number or a letter) */
      const box = (x, y, label, fill, stroke, crossed, w) => {
        const bw = w || 28;
        return `<rect x="${x}" y="${y}" width="${bw}" height="28" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
          + `<text x="${x + bw / 2}" y="${y + 20}" text-anchor="middle" fill="${INK}" font-size="15">${label}</text>`
          + (crossed ? `<line x1="${x + 5}" y1="${y + 5}" x2="${x + bw - 5}" y2="${y + 23}" stroke="${ROSE}" stroke-width="3"/><line x1="${x + bw - 5}" y1="${y + 5}" x2="${x + 5}" y2="${y + 23}" stroke="${ROSE}" stroke-width="3"/>` : '');
      };
      /** a row of identical boxes starting at x */
      const row = (x0, y, n, label, fill, stroke, gap, w) => Array.from({ length: n }, (_, i) => box(x0 + i * ((w || 28) + (gap || 6)), y, label, fill, stroke, false, w)).join('');
      /** an orange with a leaf */
      const orange = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PEACH}" stroke="#D9822B" stroke-width="2"/><path d="M${cx} ${cy - r} q4 -6 9 -7" stroke="${GREEN}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      /** a curved arrow from (x1,y1) to (x2,y2) bending through (cx,cy) */
      const arc = (x1, y1, cx, cy, x2, y2, colour) => `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${colour}" stroke-width="2.5" fill="none" marker-end="url(#ilArrow${colour.replace('#', '')})"/>`;
      const marker = (colour) => `<marker id="ilArrow${colour.replace('#', '')}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${colour}"/></marker>`;

      return {
        what: '<p>An <b>index</b> (the little number) tells you <b>how many</b> of the base are multiplied together. It works exactly the same with letters: x<sup>5</sup> = x × x × x × x × x. Once you see it that way, the <b>index laws</b> are just counting x&#39;s.</p>'
          + '<p>If the <b>letter (or base) is the same</b>, multiplying means putting the x&#39;s together (so you <b>add</b> the indices) and dividing means crossing x&#39;s off (so you <b>subtract</b> them). Numbers in front are done separately, and a power outside a bracket hits everything inside.</p>'
          + '<p><b>Picture for this topic:</b> <b>a bag of identical x&#39;s.</b> x<sup>3</sup> is a bag with three x&#39;s in it. Tip two bags together to multiply; cross some off to divide. And for <b>adding</b>, think <b>oranges</b>: only the same fruit can be added.</p>',
        visual: SVG(360, 218, [
          `<text x="180" y="13" text-anchor="middle" fill="${ROSE}">MULTIPLY → ADD the indices</text>`,
          `<text x="4" y="40" fill="${INK}" font-size="15">x³ × x²</text>`,
          row(72, 20, 3, 'x', PINK, ROSE, 5, 26),
          `<text x="170" y="40" text-anchor="middle" fill="${INK}" font-size="16">×</text>`,
          row(182, 20, 2, 'x', SKY, BLUE, 5, 26),
          `<text x="250" y="41" fill="${GREEN}" font-size="17">= x⁵</text>`,
          `<path d="M72 52 v5 h88 v-5" stroke="${ROSE}" stroke-width="2" fill="none"/>`,
          `<text x="116" y="70" text-anchor="middle" fill="${ROSE}" font-size="11">three x&#39;s</text>`,
          `<path d="M182 52 v5 h57 v-5" stroke="${BLUE}" stroke-width="2" fill="none"/>`,
          `<text x="210" y="70" text-anchor="middle" fill="${BLUE}" font-size="11">two x&#39;s</text>`,
          `<text x="180" y="88" text-anchor="middle" fill="${INK}">3 + 2 = 5 x&#39;s multiplied together</text>`,
          `<text x="180" y="102" text-anchor="middle" fill="${GREY}" font-size="11">same with numbers: 2³ × 2² = 2⁵</text>`,
          `<line x1="10" y1="110" x2="350" y2="110" stroke="${LAV}" stroke-width="2"/>`,
          `<text x="180" y="126" text-anchor="middle" fill="${BLUE}">DIVIDE → SUBTRACT the indices</text>`,
          `<text x="4" y="152" fill="${INK}" font-size="15">x⁵ ÷ x²</text>`,
          row(72, 132, 3, 'x', PINK, ROSE, 5, 26),
          box(165, 132, 'x', '#F2EEF4', '#B6A9BE', true, 26),
          box(196, 132, 'x', '#F2EEF4', '#B6A9BE', true, 26),
          `<text x="234" y="153" fill="${GREEN}" font-size="17">= x³</text>`,
          `<text x="180" y="174" text-anchor="middle" fill="${ROSE}" font-size="11">cross off two x&#39;s</text>`,
          `<text x="180" y="192" text-anchor="middle" fill="${INK}">5 − 2 = 3 x&#39;s left</text>`,
          `<text x="180" y="208" text-anchor="middle" fill="${GREY}" font-size="11">same with numbers: 2⁵ ÷ 2² = 2³</text>`,
        ].join('')),
        facts: [
          '<b>Same letter (or same base), MULTIPLY → ADD the indices: x⁵ × x³ = x⁸</b>',
          '<b>Same letter, DIVIDE → SUBTRACT the indices: x⁶ ÷ x² = x⁴</b>',
          '<b>Power of a power → MULTIPLY the indices: (x³)² = x⁶</b>',
          '<b>anything⁰ = 1</b> &nbsp;·&nbsp; so 5<sup>0</sup> = 1 and x<sup>0</sup> = 1. Also x means x<sup>1</sup>',
          '<b>Numbers in front multiply or divide separately: 3x² × 4x³ = 12x⁵</b>',
          'A power outside a bracket hits EVERYTHING inside it: (3x³)² = 3² × x³ˣ² = 9x⁶ — square the number as well as the letter.',
          'You can only ADD like terms (same letter AND same index) — 2x² + 3x² = 5x², but 2x² + 3x³ cannot be added',
          'The laws need the same letter or base: x³ × y² just stays x³y²',
        ],
        steps: [
          '<b>Look at the letters (or bases) first.</b> The laws only work when they are the same: x³ × y² just stays x³y², and 2<sup>3</sup> × 3<sup>2</sup> has to be worked out as 8 × 9.',
          '<b>Same letter, MULTIPLY → ADD the indices.</b> x<sup>5</sup> × x<sup>3</sup> = x<sup>8</sup>. (The letter never changes.)',
          '<b>Same letter, DIVIDE → SUBTRACT the indices.</b> x<sup>6</sup> ÷ x<sup>2</sup> = x<sup>4</sup>.',
          '<b>Power of a power → MULTIPLY the indices.</b> (x<sup>3</sup>)<sup>2</sup> = x<sup>6</sup>.',
          '<b>Numbers in front are done separately.</b> 3x<sup>2</sup> × 4x<sup>3</sup>: do 3 × 4 = 12, then x<sup>2</sup> × x<sup>3</sup> = x<sup>5</sup>, so 12x<sup>5</sup>.',
          'A power outside a bracket hits EVERYTHING inside it: (3x³)² = 3² × x³ˣ² = 9x⁶ — square the number as well as the letter.',
          '<b>anything<sup>0</sup> = 1.</b> So 9<sup>0</sup> = 1 and x<sup>0</sup> = 1.',
          '<b>You can only ADD like terms (same letter AND same index) — 2x² + 3x² = 5x², but 2x² + 3x³ cannot be added.</b> Say it as oranges: 2 oranges + 3 oranges = 5 oranges.',
          'If it says <b>"give your answer as a number"</b>, use the law first, then work the power out at the end.',
        ],
        examples: [
          {
            q: '2<sup>3</sup> + 3<sup>2</sup>',
            visual: SVG(360, 132, [
              `<text x="90" y="32" text-anchor="middle" fill="${ROSE}" font-size="26">2³</text>`,
              `<text x="170" y="32" text-anchor="middle" fill="${INK}" font-size="22">+</text>`,
              `<text x="250" y="32" text-anchor="middle" fill="${BLUE}" font-size="26">3²</text>`,
              `<line x1="90" y1="42" x2="90" y2="62" stroke="${ROSE}" stroke-width="3"/><polygon points="90,68 84,56 96,56" fill="${ROSE}"/>`,
              `<line x1="250" y1="42" x2="250" y2="62" stroke="${BLUE}" stroke-width="3"/><polygon points="250,68 244,56 256,56" fill="${BLUE}"/>`,
              `<text x="90" y="88" text-anchor="middle" fill="${ROSE}">2 × 2 × 2 = 8</text>`,
              `<text x="250" y="88" text-anchor="middle" fill="${BLUE}">3 × 3 = 9</text>`,
              `<text x="170" y="112" text-anchor="middle" fill="${GREEN}" font-size="18">8 + 9 = 17</text>`,
              `<text x="180" y="128" text-anchor="middle" fill="${INK}" font-size="12">different bases → no short cut, work each one out</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> two different bags — one with 2s in it, one with 3s. You cannot mix them.',
              '1. Are the bases the same? <b>No</b> (2 and 3), so there is no index law to use.',
              '2. Work each power out: 2<sup>3</sup> = 2 × 2 × 2 = <b>8</b>.',
              '3. And 3<sup>2</sup> = 3 × 3 = <b>9</b>.',
              '4. Now add: 8 + 9 = 17',
            ],
            a: '17',
          },
          {
            q: 'Simplify 2x² + 3x²',
            visual: SVG(360, 112, [
              `<text x="180" y="16" text-anchor="middle" fill="${INK}" font-size="13">every x² is one orange</text>`,
              orange(20, 48, 12), orange(46, 48, 12),
              `<text x="70" y="54" text-anchor="middle" fill="${INK}" font-size="18">+</text>`,
              orange(94, 48, 12), orange(120, 48, 12), orange(146, 48, 12),
              `<text x="168" y="54" text-anchor="middle" fill="${INK}" font-size="18">=</text>`,
              orange(190, 48, 12), orange(216, 48, 12), orange(242, 48, 12), orange(268, 48, 12), orange(294, 48, 12),
              `<text x="33" y="86" text-anchor="middle" fill="${ROSE}" font-size="15">2x²</text>`,
              `<text x="120" y="86" text-anchor="middle" fill="${BLUE}" font-size="15">3x²</text>`,
              `<text x="242" y="86" text-anchor="middle" fill="${GREEN}" font-size="15">5x²</text>`,
              `<text x="180" y="106" text-anchor="middle" fill="${INK}" font-size="12">2 oranges + 3 oranges = 5 oranges</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> like terms are <b>oranges</b>. You can only add things that are the same fruit.',
              '1. Are x² and x² like terms? Same letter, same index → <b>they are!</b>',
              '2. So each x² is an orange: 2 oranges + 3 oranges = 5 oranges.',
              '3. The x² part does not change, only the number in front.',
              '2x² + 3x² = 5x²',
            ],
            a: '5x²',
          },
          {
            q: 'Simplify x<sup>5</sup> × x<sup>3</sup>, then x<sup>6</sup> ÷ x<sup>2</sup>',
            visual: SVG(360, 156, [
              `<text x="4" y="33" fill="${INK}" font-size="14">x⁵ × x³</text>`,
              row(66, 14, 5, 'x', PINK, ROSE, 4, 22),
              `<text x="200" y="33" text-anchor="middle" fill="${INK}" font-size="16">×</text>`,
              row(216, 14, 3, 'x', SKY, BLUE, 4, 22),
              `<text x="300" y="34" fill="${GREEN}" font-size="17">= x⁸</text>`,
              `<text x="129" y="54" text-anchor="middle" fill="${ROSE}" font-size="11">five x&#39;s</text>`,
              `<text x="255" y="54" text-anchor="middle" fill="${BLUE}" font-size="11">three x&#39;s</text>`,
              `<text x="180" y="72" text-anchor="middle" fill="${INK}" font-size="13">5 + 3 = 8 x&#39;s → x⁸</text>`,
              `<line x1="10" y1="82" x2="350" y2="82" stroke="${LAV}" stroke-width="2"/>`,
              `<text x="4" y="113" fill="${INK}" font-size="14">x⁶ ÷ x²</text>`,
              row(66, 94, 4, 'x', PINK, ROSE, 4, 22),
              box(170, 94, 'x', '#F2EEF4', '#B6A9BE', true, 22),
              box(196, 94, 'x', '#F2EEF4', '#B6A9BE', true, 22),
              `<text x="232" y="115" fill="${GREEN}" font-size="17">= x⁴</text>`,
              `<text x="195" y="134" text-anchor="middle" fill="${ROSE}" font-size="11">cross off two x&#39;s</text>`,
              `<text x="180" y="151" text-anchor="middle" fill="${INK}" font-size="13">6 − 2 = 4 x&#39;s left → x⁴</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> a bag of x&#39;s. x<sup>5</sup> is five x&#39;s; tip in three more to multiply.',
              '1. x<sup>5</sup> × x<sup>3</sup>: same letter? <b>Yes</b> (both x). Is it ×? Yes → <b>add</b>: 5 + 3 = 8.',
              '2. So x<sup>5</sup> × x<sup>3</sup> = x<sup>8</sup>.',
              '3. x<sup>6</sup> ÷ x<sup>2</sup>: same letter, and it is ÷ → <b>cross two off</b>: 6 − 2 = 4.',
              'x<sup>5</sup> × x<sup>3</sup> = x<sup>8</sup> &nbsp; and &nbsp; x<sup>6</sup> ÷ x<sup>2</sup> = x<sup>4</sup>',
            ],
            a: 'x<sup>8</sup> &nbsp;·&nbsp; x<sup>4</sup>',
          },
          {
            q: 'Simplify 3x<sup>2</sup> × 4x<sup>3</sup>',
            visual: SVG(360, 146, [
              `<text x="130" y="34" fill="${ROSE}" font-size="24">3</text>`,
              `<text x="146" y="34" fill="${BLUE}" font-size="24">x</text>`,
              `<text x="160" y="24" fill="${BLUE}" font-size="15">2</text>`,
              `<text x="174" y="34" fill="${INK}" font-size="20">×</text>`,
              `<text x="196" y="34" fill="${ROSE}" font-size="24">4</text>`,
              `<text x="212" y="34" fill="${BLUE}" font-size="24">x</text>`,
              `<text x="226" y="24" fill="${BLUE}" font-size="15">3</text>`,
              `<rect x="16" y="50" width="152" height="52" rx="10" fill="#FDE8F0" stroke="${ROSE}" stroke-width="2"/>`,
              `<text x="92" y="70" text-anchor="middle" fill="${INK}" font-size="12">the numbers</text>`,
              `<text x="92" y="92" text-anchor="middle" fill="${ROSE}" font-size="17">3 × 4 = 12</text>`,
              `<rect x="192" y="50" width="152" height="52" rx="10" fill="#E8F2FB" stroke="${BLUE}" stroke-width="2"/>`,
              `<text x="268" y="70" text-anchor="middle" fill="${INK}" font-size="12">the letters</text>`,
              `<text x="268" y="92" text-anchor="middle" fill="${BLUE}" font-size="17">x² × x³ = x⁵</text>`,
              `<text x="180" y="128" text-anchor="middle" fill="${GREEN}" font-size="22">= 12x⁵</text>`,
              `<text x="180" y="143" text-anchor="middle" fill="${INK}" font-size="11">numbers multiply, letters add their indices</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> 3 bags each holding two x&#39;s, times 4 bags each holding three x&#39;s.',
              '1. Do the numbers in front on their own: 3 × 4 = <b>12</b>.',
              '2. Do the letters with the index law: 2 + 3 = 5, so x<sup>2</sup> × x<sup>3</sup> = <b>x<sup>5</sup></b>.',
              '3. Put the two halves back together.',
              '3x<sup>2</sup> × 4x<sup>3</sup> = 12x<sup>5</sup>',
            ],
            a: '12x<sup>5</sup>',
          },
          {
            q: 'Simplify 2x² + 3x² + x³',
            working: [
              '<b>Picture:</b> x² is an <b>orange</b> and x³ is an <b>apple</b>. Only the same fruit can be added.',
              '1. Which terms are like terms? The two x² ones (same letter, same index).',
              '2. Add just those: 2 oranges + 3 oranges = 5 oranges → 5x².',
              '3. Is x³ a like term? <b>No</b> — it is an apple, so it stays on its own.',
              '2x² + 3x² + x³ = 5x² + x³',
            ],
            a: '5x² + x³',
          },
          {
            q: 'Simplify (3x<sup>3</sup>)<sup>2</sup>',
            visual: SVG(360, 168, [
              `<defs>${marker(ROSE)}${marker(BLUE)}</defs>`,
              `<text x="14" y="16" fill="${INK}" font-size="12">the power outside hits EVERYTHING inside</text>`,
              `<text x="140" y="48" fill="${INK}" font-size="30">(</text>`,
              `<text x="153" y="48" fill="${ROSE}" font-size="30">3</text>`,
              `<text x="172" y="48" fill="${BLUE}" font-size="30">x</text>`,
              `<text x="188" y="34" fill="${BLUE}" font-size="18">3</text>`,
              `<text x="199" y="48" fill="${INK}" font-size="30">)</text>`,
              `<text x="212" y="34" fill="${GREEN}" font-size="22">2</text>`,
              arc(214, 40, 180, 68, 108, 80, ROSE),
              arc(224, 40, 258, 64, 264, 80, BLUE),
              `<rect x="16" y="86" width="156" height="48" rx="10" fill="#FDE8F0" stroke="${ROSE}" stroke-width="2"/>`,
              `<text x="94" y="104" text-anchor="middle" fill="${INK}" font-size="12">the number</text>`,
              `<text x="94" y="126" text-anchor="middle" fill="${ROSE}" font-size="16">3² = 9</text>`,
              `<rect x="188" y="86" width="156" height="48" rx="10" fill="#E8F2FB" stroke="${BLUE}" stroke-width="2"/>`,
              `<text x="266" y="104" text-anchor="middle" fill="${INK}" font-size="12">the letter x³</text>`,
              `<text x="266" y="126" text-anchor="middle" fill="${BLUE}" font-size="15">3 × 2 = 6 → x⁶</text>`,
              `<text x="180" y="160" text-anchor="middle" fill="${GREEN}" font-size="22">= 9x⁶</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> the outside 2 is a <b>stamp</b> that lands on every single thing inside the bracket.',
              '1. What is outside the bracket? A power of 2, so everything inside gets squared.',
              '2. The number: 3<sup>2</sup> = 9.',
              '3. The letter: x<sup>3</sup> squared → multiply the indices → x<sup>6</sup>.',
              '4. Put them together: 9x<sup>6</sup>.',
              '(3x<sup>3</sup>)<sup>2</sup> = 9x<sup>6</sup>',
            ],
            a: '9x<sup>6</sup>',
          },
          {
            q: 'A square photo frame has sides of 3x<sup>3</sup> cm. Write an expression for its area.',
            visual: SVG(360, 152, [
              `<rect x="22" y="34" width="96" height="96" rx="8" fill="#EAF8EF" stroke="${GREEN}" stroke-width="2.5"/>`,
              `<text x="70" y="26" text-anchor="middle" fill="${ROSE}" font-size="14">3x³ cm</text>`,
              `<text x="70" y="88" text-anchor="middle" fill="${INK}" font-size="13">area = ?</text>`,
              `<text x="132" y="82" text-anchor="middle" fill="${ROSE}" font-size="14" transform="rotate(90 132 82)">3x³ cm</text>`,
              `<text x="158" y="42" fill="${INK}" font-size="13">Area = side × side</text>`,
              `<text x="158" y="66" fill="${INK}" font-size="13">= 3x³ × 3x³</text>`,
              `<text x="158" y="90" fill="${ROSE}" font-size="13">numbers: 3 × 3 = 9</text>`,
              `<text x="158" y="112" fill="${BLUE}" font-size="13">letters: 3 + 3 = 6 → x⁶</text>`,
              `<text x="158" y="140" fill="${GREEN}" font-size="18">= 9x⁶ cm²</text>`,
            ].join('')),
            working: [
              '<b>Picture:</b> a square photo frame — both sides are exactly the same length.',
              '1. What is the rule for area of a square? side × side.',
              '2. So area = 3x<sup>3</sup> × 3x<sup>3</sup>.',
              '3. The numbers in front: 3 × 3 = <b>9</b>.',
              '4. The letters: 3 + 3 = 6, so x<sup>3</sup> × x<sup>3</sup> = <b>x<sup>6</sup></b>.',
              'Area = 9x<sup>6</sup> cm²',
            ],
            a: '9x<sup>6</sup> cm²',
          },
        ],
        tips: [
          '<b>x<sup>5</sup> × x<sup>3</sup> is x<sup>8</sup>, not x<sup>15</sup>.</b> Multiply the powers → <b>add</b> the indices. Only a power of a power multiplies them.',
          '<b>2x² + 3x² = 5x², not 5x⁴.</b> Adding like terms only changes the number in front — the index never moves.',
          '<b>(3x³)² = 9x⁶, not 3x⁶.</b> The outside power hits the number as well: 3² = 9.',
          'A letter on its own has index 1: <b>x = x<sup>1</sup></b>, so x<sup>5</sup> × x = x<sup>6</sup>.',
          'Different letters → no short cut. x³ × y² just stays x³y², and 2<sup>3</sup> × 3<sup>2</sup> = 8 × 9 = 72.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
