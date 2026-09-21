/* Topic: Comparing & equivalent fractions — same bottom, same top, common denominator,
 * equivalents, simplifying, ordering, improper ↔ mixed, fraction vs decimal / percentage. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const F = (n, d) => N.fracHtml(n, d);
  const M = (n, d) => N.fracHtml(n, d, { mixed: true });
  const LT = ' &lt; ';
  const GT = ' &gt; ';
  /** a fraction with a gap (?) on top or bottom */
  const gapFrac = (top, bottom) => `<span class="frac"><span class="frac-n">${top}</span><span class="frac-d">${bottom}</span></span>`;
  /** positive when a is bigger */
  const cmp = (a, b) => a.n * b.d - b.n * a.d;
  const NAMES = ['Ana', 'Maia', 'Ruby', 'Sione', 'Tane', 'Ella', 'Aroha', 'Jack'];
  const PIZZA = '<i>Picture:</i> two pizzas <b>the same size</b>. The bottom number says how many slices the pizza is cut into, the top says how many slices you have.';

  /* ---------- answer helpers ---------- */
  /** Two real options (one of them right) plus a third option that is never right.
   *  The two real options are shuffled between the first two buttons. */
  function twoWay(htmlA, htmlB, aIsCorrect, third) {
    const swap = R.chance(0.5);
    const choices = swap ? [htmlB, htmlA, third] : [htmlA, htmlB, third];
    const value = swap ? (aIsCorrect ? 1 : 0) : (aIsCorrect ? 0 : 1);
    return { answer: { type: 'choice', value, choices }, correctHtml: aIsCorrect ? htmlA : htmlB };
  }

  function fracAnswer(n, d, placeholder) {
    const s = N.simplify(n, d);
    return { type: 'fraction', value: { n: s.n, d: s.d }, placeholder: placeholder || 'e.g. 3/4' };
  }

  /* ---------- fraction pickers ---------- */
  /** numerator coprime with d, so the fraction is already in simplest form */
  function proper(d) { if (d <= 2) return 1; let n, g = 0; do { n = R.int(1, d - 1); g = N.gcd(n, d); } while (g !== 1); return n; }

  function sameBottomPair(level) {
    const d = R.pick(level === 1 ? [4, 5, 6, 8, 10] : [6, 8, 9, 10, 12]);
    let n1 = R.int(1, d - 1), n2 = R.int(1, d - 1), guard = 0;
    while (n1 === n2 && guard++ < 20) n2 = R.int(1, d - 1);
    if (n1 === n2) n2 = n1 === 1 ? 2 : 1;
    return [{ n: n1, d }, { n: n2, d }];
  }

  function sameTopPair(level) {
    const n = R.int(1, level === 1 ? 3 : 4);
    const pool = (level === 1 ? [2, 3, 4, 5, 6, 8] : [3, 4, 5, 6, 7, 8, 9, 10, 12]).filter((d) => d > n);
    const [d1, d2] = R.sample(pool, 2);
    return [{ n, d: d1 }, { n, d: d2 }];
  }

  /** two proper fractions with different bottoms AND different tops */
  function unlikePair(pool, maxLcd) {
    for (let i = 0; i < 60; i++) {
      const [d1, d2] = R.sample(pool, 2);
      if (N.lcm(d1, d2) > maxLcd) continue;
      const a = { n: proper(d1), d: d1 }, b = { n: proper(d2), d: d2 };
      if (a.n === b.n) continue;
      if (cmp(a, b) === 0) continue;
      return [a, b];
    }
    return [{ n: 2, d: 3 }, { n: 5, d: 8 }];
  }

  function pairForLevel(level) {
    if (level === 1) return R.chance(0.5) ? sameBottomPair(1) : sameTopPair(1);
    if (level === 2) return unlikePair([2, 3, 4, 5, 6, 8, 10, 12], 40);
    return unlikePair([3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 132);
  }

  /* ---------- comparing: working + hint ---------- */
  function routeHint(a, b) {
    if (a.d === b.d) return 'The bottoms are the same, so the slices are the same size. Just look at the tops.';
    if (a.n === b.n) return 'The tops are the same. More slices in the pizza means <b>smaller</b> slices.';
    return 'Make the bottoms the same first. What is the smallest number both bottoms go into?';
  }

  function compareWorking(a, b, showA, showB, picture) {
    const lines = [picture || PIZZA];
    const bigger = cmp(a, b) > 0 ? showA : showB;
    if (a.d === b.d) {
      lines.push(`1. Are the <b>bottoms</b> the same? <b>Yes</b>, both ${a.d}, so the slices are the same size.`);
      lines.push(`2. Same bottom → the bigger <b>top</b> wins: ${Math.max(a.n, b.n)} slices beats ${Math.min(a.n, b.n)} slices.`);
    } else if (a.n === b.n) {
      const small = a.d < b.d ? showA : showB;
      lines.push(`1. Are the bottoms the same? <b>No.</b> Are the <b>tops</b> the same? <b>Yes</b>, both ${a.n}.`);
      lines.push(`2. Same top → the <b>smaller bottom</b> wins. Cutting a pizza into ${Math.max(a.d, b.d)} gives smaller slices than cutting it into ${Math.min(a.d, b.d)}.`);
      lines.push(`3. Same number of slices, but ${small} has the <b>bigger</b> slices.`);
    } else {
      const L = N.lcm(a.d, b.d);
      const ta = a.n * (L / a.d), tb = b.n * (L / b.d);
      lines.push('1. Bottoms different, tops different → I <b>make the bottoms the same</b>.');
      lines.push(`2. Smallest number both ${a.d} and ${b.d} go into: <b>${L}</b>.`);
      lines.push(`3. ${showA} = ${F(ta, L)} (× ${L / a.d} top and bottom), and ${showB} = ${F(tb, L)} (× ${L / b.d} top and bottom).`);
      lines.push(`4. Same slice size now, so compare the tops: ${Math.max(ta, tb)}${GT}${Math.min(ta, tb)}.`);
    }
    lines.push(`So <b>${bigger}</b> is bigger.`);
    return lines;
  }

  /** build a "which is bigger / smaller" choice question from two fractions */
  function compareQ(a, b, opts) {
    opts = opts || {};
    const showA = opts.showA || F(a.n, a.d);
    const showB = opts.showB || F(b.n, b.d);
    const aBigger = cmp(a, b) > 0;
    const askSmaller = !!opts.askSmaller;
    const aWins = askSmaller ? !aBigger : aBigger;
    const t = twoWay(showA, showB, aWins, opts.third || 'They are equal');
    const working = (opts.working || compareWorking(a, b, showA, showB, opts.picture)).slice();
    if (askSmaller) working.push(`So the <b>smaller</b> one is ${t.correctHtml}.`);
    return {
      prompt: opts.prompt || `Which is ${askSmaller ? 'smaller' : 'bigger'}: ${showA} or ${showB}?`,
      answer: t.answer,
      hint: opts.hint || routeHint(a, b),
      working,
      finalAnswer: t.correctHtml,
      skill: opts.skill || (a.d === b.d ? 'compare-same-bottom' : a.n === b.n ? 'compare-same-top' : 'compare-lcd'),
    };
  }

  /* ---------- the individual calc skills ---------- */
  function compareTwo(level) {
    if (level === 3) {
      const flavour = R.pick(['lcd', 'lcd', 'mixed', 'decimal', 'percent']);
      if (flavour === 'mixed') {
        const w = R.int(1, 4);
        const [f1, f2] = unlikePair([2, 3, 4, 5, 6, 8, 10], 40);
        const a = { n: w * f1.d + f1.n, d: f1.d }, b = { n: w * f2.d + f2.n, d: f2.d };
        const L = N.lcm(f1.d, f2.d);
        const t1 = f1.n * (L / f1.d), t2 = f2.n * (L / f2.d);
        const bigger = t1 > t2 ? M(a.n, a.d) : M(b.n, b.d);
        return compareQ(a, b, {
          showA: M(a.n, a.d), showB: M(b.n, b.d),
          hint: 'The whole numbers are the same, so it comes down to the fraction parts.',
          picture: '<i>Picture:</i> two people each have the same number of whole pizzas, plus a bit extra. The extra bit decides it.',
          working: [
            '<i>Picture:</i> whole pizzas first, then the leftover slices.',
            `1. Whole numbers: both are <b>${w}</b>, so that is a tie.`,
            `2. Now compare the fraction parts: ${F(f1.n, f1.d)} and ${F(f2.n, f2.d)}.`,
            `3. Bottoms are different → common bottom <b>${L}</b>: ${F(t1, L)} and ${F(t2, L)}.`,
            `4. ${Math.max(t1, t2)}${GT}${Math.min(t1, t2)}, so ${t1 > t2 ? F(f1.n, f1.d) : F(f2.n, f2.d)} is the bigger fraction part.`,
            `So <b>${bigger}</b> is bigger.`,
          ],
          skill: 'compare-mixed',
        });
      }
      if (flavour === 'decimal' || flavour === 'percent') {
        const d = R.pick([2, 4, 5, 8, 10, 20, 25]);
        const n = proper(d);
        const v = n / d;
        const isPct = flavour === 'percent';
        let other;
        if (isPct) {
          other = Math.round(v * 100) + R.pick([-15, -10, -5, 5, 10, 15]);
          if (other <= 0 || other >= 100 || other === Math.round(v * 100)) other = Math.round(v * 100) + 10;
          if (other >= 100) other = Math.round(v * 100) - 10;
        } else {
          other = N.round(v + R.pick([-0.2, -0.15, -0.1, -0.05, 0.05, 0.1, 0.15, 0.2]), 2);
          if (other <= 0 || other >= 1 || other === v) other = N.round(v + 0.1, 2);
          if (other >= 1) other = N.round(v - 0.1, 2);
        }
        const otherVal = isPct ? other / 100 : other;
        const showOther = isPct ? `${other}%` : String(other);
        const aBigger = v > otherVal;
        const t = twoWay(F(n, d), showOther, aBigger, 'They are the same size');
        const decOfFrac = N.fmt(v);
        return {
          prompt: `Which is bigger: ${F(n, d)} or ${showOther}?`,
          answer: t.answer,
          hint: isPct ? 'Turn the fraction into a percentage: divide the top by the bottom, then × 100.' : 'A fraction is a division. Work out top ÷ bottom to get a decimal.',
          working: [
            '<i>Picture:</i> a fraction is just a division waiting to happen — the line means "÷".',
            `1. Can I compare them as they are? <b>No</b>, they are different kinds of number.`,
            `2. Change the fraction: ${n} ÷ ${d} = ${decOfFrac}${isPct ? ` = ${N.fmt(v * 100)}%` : ''}.`,
            `3. Compare ${isPct ? `${N.fmt(v * 100)}% and ${other}%` : `${decOfFrac} and ${other}`} (line up the decimal points).`,
            `So <b>${aBigger ? F(n, d) : showOther}</b> is bigger.`,
          ],
          finalAnswer: t.correctHtml,
          skill: isPct ? 'compare-percent' : 'compare-decimal',
        };
      }
    }
    const [a, b] = pairForLevel(level);
    return compareQ(a, b, { askSmaller: R.chance(0.3) });
  }

  function equivalentGap(level) {
    const d = R.pick(level === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 8, 9, 12]);
    const n = proper(d);
    const k = level === 1 ? R.int(2, 4) : R.int(2, 8);
    const topGap = R.chance(0.5);
    const prompt = topGap
      ? `${F(n, d)} = ${gapFrac('?', d * k)} &nbsp; What number goes in the gap?`
      : `${F(n, d)} = ${gapFrac(n * k, '?')} &nbsp; What number goes in the gap?`;
    return {
      prompt,
      answer: { type: 'number', value: topGap ? n * k : d * k },
      hint: `What do you multiply ${topGap ? d : n} by to get ${topGap ? d * k : n * k}? Do the same to the other number.`,
      working: [
        '<i>Picture:</i> the same pizza, just cut into more slices. The amount does not change.',
        `1. Look at the number I already know: ${topGap ? d : n} → ${topGap ? d * k : n * k}. What did I multiply by? <b>× ${k}</b>.`,
        `2. Golden rule: whatever I do to the bottom, I do to the <b>top</b>.`,
        `3. ${topGap ? n : d} × ${k} = ${topGap ? n * k : d * k}.`,
        `So ${F(n, d)} = ${F(n * k, d * k)} and the gap is <b>${topGap ? n * k : d * k}</b>.`,
      ],
      finalAnswer: String(topGap ? n * k : d * k),
      skill: 'equivalent-gap',
    };
  }

  function equivalentChoice(level) {
    const d = R.pick(level === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 8, 9]);
    const n = proper(d);
    const k = level === 1 ? R.int(2, 3) : R.int(2, 5);
    const target = { n: n * k, d: d * k };
    const wrong = [];
    const tryAdd = (f) => {
      if (f.n <= 0 || f.d <= 1) return;
      if (cmp(f, target) === 0) return;
      if (wrong.some((w) => w.n === f.n && w.d === f.d)) return;
      if (f.n === target.n && f.d === target.d) return;
      wrong.push(f);
    };
    tryAdd({ n: n + k, d: d + k });
    tryAdd({ n: n * k, d: d });
    tryAdd({ n: n, d: d * k });
    tryAdd({ n: n * k + 1, d: d * k });
    tryAdd({ n: n + 1, d: d + 1 });
    const opts = R.shuffle([target].concat(wrong.slice(0, 3)));
    const value = opts.findIndex((f) => f.n === target.n && f.d === target.d);
    return {
      prompt: `Which one of these is the same as ${F(n, d)}?`,
      answer: { type: 'choice', value, choices: opts.map((f) => F(f.n, f.d)) },
      hint: 'Equivalent fractions come from multiplying the top AND the bottom by the same number.',
      working: [
        '<i>Picture:</i> the same pizza cut into more slices — same amount, more (smaller) pieces.',
        `1. Multiply top and bottom by the same number: ${n} × ${k} = ${n * k} and ${d} × ${k} = ${d * k}.`,
        `2. So ${F(n, d)} = ${F(n * k, d * k)}.`,
        `3. Check the others: if you change only the top, or only the bottom, the fraction changes size.`,
        `Answer: <b>${F(target.n, target.d)}</b>.`,
      ],
      finalAnswer: F(target.n, target.d),
      skill: 'equivalent-choice',
    };
  }

  function simplify(level) {
    const base = level === 1
      ? R.pick([{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 4 }, { n: 2, d: 3 }, { n: 3, d: 4 }, { n: 1, d: 5 }, { n: 2, d: 5 }])
      : R.pick([{ n: 2, d: 3 }, { n: 3, d: 4 }, { n: 3, d: 5 }, { n: 4, d: 5 }, { n: 5, d: 6 }, { n: 5, d: 8 }, { n: 3, d: 8 }, { n: 7, d: 9 }, { n: 5, d: 12 }, { n: 7, d: 10 }]);
    const k = level === 1 ? R.int(2, 4) : level === 2 ? R.int(2, 6) : R.int(3, 9);
    const n = base.n * k, d = base.d * k;
    return {
      prompt: `Write ${F(n, d)} in its simplest form.`,
      answer: fracAnswer(base.n, base.d, 'e.g. 3/4'),
      hint: `What number goes into both ${n} and ${d}? Divide top and bottom by it.`,
      working: [
        '<i>Picture:</i> simplifying is cutting the pizza into <b>fewer, bigger</b> slices. The amount stays the same.',
        `1. What is the biggest number that goes into both ${n} and ${d}? <b>${k}</b>.`,
        `2. Divide the top: ${n} ÷ ${k} = ${base.n}.`,
        `3. Divide the bottom: ${d} ÷ ${k} = ${base.d}.`,
        `4. Can I go further? <b>No</b>, nothing goes into both ${base.n} and ${base.d}.`,
        `Answer: <b>${F(base.n, base.d)}</b>`,
      ],
      finalAnswer: F(base.n, base.d),
      skill: 'simplify',
    };
  }

  function improperMixed(level) {
    const d = R.pick(level === 2 ? [2, 3, 4, 5, 6, 8] : [3, 4, 5, 6, 7, 8, 9, 10]);
    const w = R.int(1, level === 3 ? 6 : 4);
    const r = proper(d);
    const n = w * d + r;
    if (R.chance(0.5)) {
      // improper → mixed
      return {
        prompt: `Write ${F(n, d)} as a mixed number.`,
        answer: fracAnswer(n, d, 'e.g. 1 3/4'),
        hint: `How many whole lots of ${d} fit inside ${n}? That is the whole number; the rest stays on top.`,
        working: [
          `<i>Picture:</i> ${n} slices of pizza, and every <b>${d}</b> slices make one whole pizza.`,
          `1. How many whole pizzas? ${n} ÷ ${d} = ${w} remainder ${r}.`,
          `2. So that is <b>${w}</b> whole ${w === 1 ? 'pizza' : 'pizzas'} and ${r} ${r === 1 ? 'slice' : 'slices'} left over.`,
          `3. The leftover slices keep the same bottom: ${F(r, d)}.`,
          `Answer: <b>${M(n, d)}</b>`,
        ],
        finalAnswer: M(n, d),
        skill: 'improper-to-mixed',
      };
    }
    // mixed → improper
    return {
      prompt: `Write ${M(n, d)} as an improper (top-heavy) fraction.`,
      answer: fracAnswer(n, d, 'e.g. 7/4'),
      hint: `Each whole pizza is ${d} slices. How many slices in ${w} whole ${w === 1 ? 'pizza' : 'pizzas'}, plus ${r} more?`,
      working: [
        `<i>Picture:</i> ${w} whole ${w === 1 ? 'pizza' : 'pizzas'} plus ${r} extra ${r === 1 ? 'slice' : 'slices'}, and every pizza is cut into ${d}.`,
        `1. Slices in the whole pizzas: ${w} × ${d} = ${w * d}.`,
        `2. Add the extra slices: ${w * d} + ${r} = ${n}.`,
        `3. They are all ${d}ths, so the bottom stays ${d}.`,
        `Answer: <b>${F(n, d)}</b>`,
      ],
      finalAnswer: F(n, d),
      skill: 'mixed-to-improper',
    };
  }

  /** every ordering of a small list (3 or 4 items) */
  function permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    const out = [];
    arr.forEach((x, i) => {
      permutations(arr.slice(0, i).concat(arr.slice(i + 1))).forEach((p) => out.push([x].concat(p)));
    });
    return out;
  }

  function orderFractions(level) {
    const howMany = level === 3 && R.chance(0.4) ? 4 : 3;
    const pool = level === 2 ? [2, 3, 4, 5, 6, 8, 10, 12] : [3, 4, 5, 6, 8, 9, 10, 12];
    const cap = level === 2 ? 24 : 72;
    let fracs = null;
    for (let attempt = 0; attempt < 80 && !fracs; attempt++) {
      const ds = R.sample(pool, howMany);
      if (ds.reduce((acc, d) => N.lcm(acc, d), 1) > cap) continue;
      const cand = ds.map((d) => ({ n: proper(d), d }));
      const clash = cand.some((f, i) => cand.some((g, j) => j > i && cmp(f, g) === 0));
      if (!clash) fracs = cand;
    }
    if (!fracs) fracs = howMany === 4 ? [{ n: 1, d: 2 }, { n: 2, d: 3 }, { n: 3, d: 4 }, { n: 1, d: 6 }] : [{ n: 1, d: 2 }, { n: 2, d: 3 }, { n: 3, d: 4 }];
    const listed = R.shuffle(fracs);
    const sorted = fracs.slice().sort((x, y) => cmp(x, y));
    const asText = (arr) => arr.map((f) => F(f.n, f.d)).join(LT);
    const correct = asText(sorted);
    // three wrong orderings, taken from the real permutations so every button looks plausible
    const options = [correct];
    for (const p of R.shuffle(permutations(sorted))) {
      if (options.length >= 4) break;
      const s = asText(p);
      if (!options.includes(s)) options.push(s);
    }
    const shown = R.shuffle(options);
    const L = fracs.reduce((acc, f) => N.lcm(acc, f.d), 1);
    return {
      prompt: `Put these in order, <b>smallest first</b>: ${listed.map((f) => F(f.n, f.d)).join(' , ')}`,
      answer: { type: 'choice', value: shown.indexOf(correct), choices: shown },
      hint: `Give them all the same bottom first. All the bottoms go into ${L}.`,
      working: [
        '<i>Picture:</i> you cannot line up slices of different sizes. Cut every pizza into the <b>same</b> size slices first.',
        `1. Bottoms are ${fracs.map((f) => f.d).join(', ')}. The smallest number they all go into is <b>${L}</b>.`,
        `2. Rewrite them all: ${fracs.map((f) => `${F(f.n, f.d)} = ${F(f.n * (L / f.d), L)}`).join(', ')}.`,
        `3. Now just order the tops: ${sorted.map((f) => f.n * (L / f.d)).join(LT)}.`,
        `Answer: <b>${correct}</b>`,
      ],
      finalAnswer: correct,
      skill: 'order',
    };
  }

  /* ---------- calc ---------- */
  function calc(level) {
    const menu = level === 1
      ? ['compare', 'compare', 'compare', 'compare', 'equivGap', 'equivGap', 'equivChoice', 'simplify', 'simplify']
      : level === 2
        ? ['compare', 'compare', 'compare', 'compare', 'equivGap', 'equivChoice', 'simplify', 'improper', 'improper', 'order']
        : ['compare', 'compare', 'compare', 'compare', 'order', 'order', 'improper', 'simplify', 'equivChoice', 'equivGap'];
    const pick = R.pick(menu);
    if (pick === 'compare') return compareTwo(level);
    if (pick === 'equivGap') return equivalentGap(level);
    if (pick === 'equivChoice') return equivalentChoice(level);
    if (pick === 'simplify') return simplify(level);
    if (pick === 'improper') return improperMixed(level === 1 ? 2 : level);
    return orderFractions(level === 1 ? 2 : level);
  }

  /* ---------- word problems ---------- */
  function word(level) {
    const t = R.pick(level === 1 ? ['pizza', 'bottle', 'netball', 'reading', 'sprint', 'chocolate']
      : level === 2 ? ['pizza', 'bottle', 'netball', 'recipe', 'chocolate', 'reading', 'sprint', 'roomWalk']
        : ['shooters', 'shooters', 'order3', 'jars', 'jars', 'roomWalk', 'roomWalk', 'recipe', 'chocolate', 'netball']);
    const [n1, n2] = R.sample(NAMES, 2);

    if (t === 'shooters' || t === 'order3') {
      const who = R.sample(NAMES, 3);
      const L = R.pick([12, 20, 24, 40]);
      const divs = [3, 4, 5, 6, 8, 10, 12, 20, 24, 40].filter((d) => L % d === 0);
      let fr = [];
      for (let i = 0; i < 300 && fr.length < 3; i++) {
        const d = R.pick(divs), n = proper(d), v = n / d;
        if (v < 0.3 || v > 0.96) continue;
        if (fr.some((x) => Math.abs(x.n / x.d - v) < 1e-9)) continue;
        fr.push({ n, d });
      }
      if (fr.length < 3) fr = [{ n: 2, d: 3 }, { n: 3, d: 4 }, { n: 5, d: 8 }];
      const tops = fr.map((x) => x.n * (L / x.d));
      const order = [0, 1, 2].sort((i, j) => tops[j] - tops[i]);   // best first
      const list = fr.map((x, i) => `${who[i]} hit ${F(x.n, x.d)}${i === 0 ? ' of their shots' : ''}`).join(', ').replace(/, ([^,]*)$/, ' and $1');
      const convert = `Same bottom for all three (${L}): ${fr.map((x, i) => `${who[i]} = ${F(tops[i], L)}`).join(', ')}.`;
      const shared = [
        '<i>Picture:</i> every shooter takes a different number of shots, so I make the bottoms the same before I compare.',
        `1. Smallest number ${fr.map((x) => x.d).join(', ')} all go into: <b>${L}</b>.`,
        `2. ${convert}`,
        `3. Now compare the tops: ${order.map((i) => tops[i]).join(GT)}.`,
      ];
      if (t === 'shooters') {
        return {
          prompt: `At netball practice ${list}. Who had the <b>best</b> shooting fraction?`,
          answer: { type: 'choice', value: order[0], choices: who.slice() },
          hint: `All three bottoms go into ${L}. Change all three fractions, then compare the tops.`,
          working: shared.concat([`So <b>${who[order[0]]}</b> shot best.`]),
          finalAnswer: who[order[0]], skill: 'word-compare-three',
        };
      }
      const correct = order.map((i) => who[i]).join(', ');
      const opts = new Set([correct, order.slice().reverse().map((i) => who[i]).join(', ')]);
      for (let i = 0; i < 20 && opts.size < 3; i++) opts.add(R.shuffle(who).join(', '));
      const choices = R.shuffle([...opts]);
      return {
        prompt: `At netball practice ${list}. Put the three shooters in order, <b>best first</b>.`,
        answer: { type: 'choice', value: choices.indexOf(correct), choices },
        hint: `Change all three to the same bottom (${L}), then order the tops from biggest to smallest.`,
        working: shared.concat([`Best first: <b>${correct}</b>.`]),
        finalAnswer: correct, skill: 'word-order-three',
      };
    }

    if (t === 'jars') {
      const PAIRS = [[{ n: 5, d: 8 }, { n: 3, d: 5 }], [{ n: 2, d: 3 }, { n: 3, d: 5 }], [{ n: 3, d: 4 }, { n: 5, d: 8 }],
        [{ n: 1, d: 2 }, { n: 2, d: 5 }], [{ n: 5, d: 6 }, { n: 3, d: 4 }], [{ n: 4, d: 5 }, { n: 7, d: 10 }]];
      let fa = { n: 5, d: 8 }, fb = { n: 3, d: 5 }, sizeA = 400, sizeB = 500, amtA = 250, amtB = 300;
      for (let i = 0; i < 60; i++) {
        const p = R.shuffle(R.pick(PAIRS));
        const A = p[0], B = p[1];
        const sA = A.d * R.pick([10, 20, 25, 40, 50]);
        const sB = B.d * R.pick([10, 20, 25, 40, 50]);
        if (sB <= sA || sA < 100 || sB > 900) continue;
        const aAmt = sA / A.d * A.n, bAmt = sB / B.d * B.n;
        if (aAmt === bAmt) continue;
        fa = A; fb = B; sizeA = sA; sizeB = sB; amtA = aAmt; amtB = bAmt; break;
      }
      const aBigger = amtA > amtB;
      const c = twoWay(n1, n2, aBigger, 'They ate the same amount');
      const treat = R.pick(['lollies', 'jelly beans', 'muesli', 'popcorn']);
      return {
        prompt: `${n1}'s jar holds ${sizeA} g of ${treat}, and ${n1} eats ${F(fa.n, fa.d)} of the jar. ${n2}'s jar is bigger: it holds ${sizeB} g, and ${n2} eats ${F(fb.n, fb.d)} of that jar. Who ate more ${treat}?`,
        answer: c.answer,
        hint: 'Careful! The jars are <b>different sizes</b>, so you cannot just compare the fractions. Work out the grams each one ate.',
        working: [
          '<i>Picture:</i> two jars, but one is bigger. A smaller fraction of a bigger jar can still be more.',
          `1. Can I compare the fractions straight away? <b>No</b> — the wholes are different sizes.`,
          `2. ${n1}: ${F(fa.n, fa.d)} of ${sizeA} g = ${sizeA} ÷ ${fa.d} × ${fa.n} = <b>${amtA} g</b>.`,
          `3. ${n2}: ${F(fb.n, fb.d)} of ${sizeB} g = ${sizeB} ÷ ${fb.d} × ${fb.n} = <b>${amtB} g</b>.`,
          `4. Compare the grams: ${Math.max(amtA, amtB)}${GT}${Math.min(amtA, amtB)}.`,
          `So <b>${c.correctHtml}</b> ate more.`,
        ],
        finalAnswer: c.correctHtml, skill: 'word-compare-wholes',
      };
    }

    if (t === 'roomWalk') {
      const POOL = [{ n: 1, d: 2 }, { n: 2, d: 3 }, { n: 3, d: 4 }, { n: 3, d: 5 }, { n: 2, d: 5 }, { n: 5, d: 8 }, { n: 4, d: 5 }, { n: 5, d: 6 }, { n: 7, d: 10 }, { n: 1, d: 3 }];
      let a = { n: 2, d: 5 }, b = { n: 3, d: 4 }, kA = 6, kB = 5;
      for (let i = 0; i < 60; i++) {
        const [x, y] = R.sample(POOL, 2);
        if (cmp(x, y) === 0 || N.lcm(x.d, y.d) > 40) continue;
        const ka = R.int(3, 7), kb = R.int(3, 7);
        if (x.d * ka > 32 || y.d * kb > 32 || x.d * ka < 12 || y.d * kb < 12) continue;
        a = x; b = y; kA = ka; kB = kb; break;
      }
      const tA = a.d * kA, wA = a.n * kA, tB = b.d * kB, wB = b.n * kB;
      const [rA, rB] = R.sample(['Room 8', 'Room 9', 'Room 12', 'Room 5', 'Room 3'], 2);
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(rA, rB, aBigger, 'The two rooms are the same');
      const act = R.pick(['walk to school', 'bring a packed lunch', 'play a winter sport', 'catch the bus']);
      return {
        prompt: `In ${rA}, ${wA} of the ${tA} students ${act}. In ${rB}, ${wB} of the ${tB} students ${act}. Which room has the <b>bigger fraction</b> doing it?`,
        answer: c.answer,
        hint: 'Write each one as a fraction, simplify it, then make the bottoms the same.',
        working: [
          '<i>Picture:</i> the classes are different sizes, so "more students" does not mean "a bigger fraction".',
          `1. ${rA}: ${wA} out of ${tA} = ${F(wA, tA)} = ${F(a.n, a.d)} (÷ ${kA} top and bottom).`,
          `2. ${rB}: ${wB} out of ${tB} = ${F(wB, tB)} = ${F(b.n, b.d)} (÷ ${kB} top and bottom).`,
        ].concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> has the bigger fraction.`]),
        finalAnswer: c.correctHtml, skill: 'word-compare-simplify',
      };
    }

    if (t === 'pizza') {
      const [a, b] = pairForLevel(level);
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(n1, n2, aBigger, 'They ate the same amount');
      return {
        prompt: `${n1} ate ${F(a.n, a.d)} of her pizza and ${n2} ate ${F(b.n, b.d)} of his. The pizzas are the same size. Who ate more?`,
        answer: c.answer,
        hint: routeHint(a, b),
        working: [`<i>Picture:</i> two pizzas the same size — compare ${F(a.n, a.d)} and ${F(b.n, b.d)}.`]
          .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> ate more.`]),
        finalAnswer: c.correctHtml,
        skill: 'word-compare',
      };
    }

    if (t === 'bottle') {
      const [a, b] = pairForLevel(level);
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(`${n1}'s bottle`, `${n2}'s bottle`, aBigger, 'They are equally full');
      return {
        prompt: `${n1} and ${n2} have identical drink bottles. ${n1}'s is ${F(a.n, a.d)} full and ${n2}'s is ${F(b.n, b.d)} full. Whose bottle is fuller?`,
        answer: c.answer,
        hint: routeHint(a, b),
        working: [`<i>Picture:</i> two bottles the same size, so I just compare ${F(a.n, a.d)} and ${F(b.n, b.d)}.`]
          .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> is fuller.`]),
        finalAnswer: c.correctHtml,
        skill: 'word-compare',
      };
    }

    if (t === 'netball') {
      const sets = level === 1 ? [[3, 4, 2, 4], [5, 8, 3, 8], [4, 5, 3, 5]] : level === 2 ? [[3, 4, 5, 8], [2, 3, 3, 5], [5, 6, 7, 9], [3, 5, 5, 8]] : [[4, 5, 7, 9], [5, 7, 7, 10], [7, 8, 8, 9], [6, 7, 7, 9], [5, 9, 4, 7]];
      const s = R.pick(sets);
      const flip = R.chance(0.5);
      const a = flip ? { n: s[2], d: s[3] } : { n: s[0], d: s[1] };
      const b = flip ? { n: s[0], d: s[1] } : { n: s[2], d: s[3] };
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(n1, n2, aBigger, 'They shot equally well');
      return {
        prompt: `At netball practice ${n1} scored ${a.n} out of ${a.d} shots and ${n2} scored ${b.n} out of ${b.d}. Who had the better shooting fraction?`,
        answer: c.answer,
        hint: 'Write each one as a fraction, then give them the same bottom.',
        working: [`<i>Picture:</i> "${a.n} out of ${a.d}" is the fraction ${F(a.n, a.d)}, and "${b.n} out of ${b.d}" is ${F(b.n, b.d)}.`]
          .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> shot better.`]),
        finalAnswer: c.correctHtml,
        skill: 'word-compare',
      };
    }

    if (t === 'recipe') {
      const d = R.pick([2, 3, 4, 5, 8]);
      const w = R.int(1, 3);
      const r = proper(d);
      const n = w * d + r;
      if (R.chance(0.5)) {
        return {
          prompt: `A muffin recipe needs ${F(n, d)} cups of flour. Write that as a mixed number so ${n1} can measure it out.`,
          answer: fracAnswer(n, d, 'e.g. 1 3/4'),
          hint: `Every ${d} of these pieces makes one whole cup. How many whole cups fit inside ${n}?`,
          working: [
            `<i>Picture:</i> a measuring cup marked in ${d}ths. ${n} of those marks, ${d} to a full cup.`,
            `1. How many full cups? ${n} ÷ ${d} = ${w} remainder ${r}.`,
            `2. So ${w} full ${w === 1 ? 'cup' : 'cups'} and ${r} ${d}${r === 1 ? 'th' : 'ths'} left over.`,
            `Answer: <b>${M(n, d)} cups</b>`,
          ],
          finalAnswer: `${M(n, d)} cups`,
          skill: 'word-improper',
        };
      }
      const need = { n, d };
      const has = { n: 3, d: 2 }; // 1 1/2 cups
      let question = need, other = has;
      if (cmp(need, has) === 0) { question = { n: n + 1, d }; other = has; }
      const enough = cmp(other, question) > 0;
      const c = twoWay('Yes, she has enough', 'No, she needs more flour', enough, 'She has exactly the right amount');
      const L = N.lcm(question.d, 2);
      return {
        prompt: `A recipe needs ${M(question.n, question.d)} cups of flour. ${n1} has ${M(3, 2)} cups in the jar. Does she have enough?`,
        answer: c.answer,
        hint: 'Compare the two amounts. Same whole number? Then compare the fraction parts.',
        working: [
          '<i>Picture:</i> two measuring jugs side by side — which one holds more?',
          `1. Recipe: ${M(question.n, question.d)} cups. In the jar: ${M(3, 2)} cups.`,
          `2. Give both the same bottom (${L}): ${F(question.n * (L / question.d), L)} and ${F(3 * (L / 2), L)}.`,
          `3. ${Math.max(question.n * (L / question.d), 3 * (L / 2))}${GT}${Math.min(question.n * (L / question.d), 3 * (L / 2))}, so ${cmp(question, has) > 0 ? 'the recipe needs more than she has' : 'she has more than the recipe needs'}.`,
          `Answer: <b>${c.correctHtml}</b>`,
        ],
        finalAnswer: c.correctHtml,
        skill: 'word-compare-mixed',
      };
    }

    if (t === 'chocolate') {
      if (R.chance(0.5)) {
        const base = R.pick(level === 1 ? [{ n: 1, d: 2 }, { n: 3, d: 4 }, { n: 2, d: 3 }] : [{ n: 2, d: 3 }, { n: 3, d: 4 }, { n: 3, d: 5 }, { n: 5, d: 8 }, { n: 5, d: 6 }]);
        const k = level === 1 ? R.int(2, 3) : R.int(2, 5);
        const total = base.d * k, eaten = base.n * k;
        return {
          prompt: `A chocolate block is broken into ${total} equal pieces. ${n1} eats ${eaten} of them. What fraction of the block is that? Give your answer in simplest form.`,
          answer: fracAnswer(base.n, base.d, 'e.g. 3/4'),
          hint: `Write it as ${F(eaten, total)}, then divide top and bottom by the same number.`,
          working: [
            '<i>Picture:</i> a chocolate block. Pieces eaten on top, pieces in the whole block on the bottom.',
            `1. The fraction is ${F(eaten, total)}.`,
            `2. The biggest number that goes into both ${eaten} and ${total} is <b>${k}</b>.`,
            `3. ${eaten} ÷ ${k} = ${base.n} and ${total} ÷ ${k} = ${base.d}.`,
            `Answer: <b>${F(base.n, base.d)}</b> of the block`,
          ],
          finalAnswer: `${F(base.n, base.d)} of the block`,
          skill: 'word-simplify',
        };
      }
      const d1 = R.pick(level === 1 ? [4, 6, 8] : [8, 10, 12]), d2 = R.pick(level === 1 ? [8, 12] : [6, 9, 15]);
      const a = { n: R.int(2, d1 - 1), d: d1 }, b = { n: R.int(2, d2 - 1), d: d2 };
      for (let i = 0; i < 20 && cmp(a, b) === 0; i++) b.n = R.int(1, d2 - 1);
      if (cmp(a, b) === 0) a.n = a.n < d1 - 1 ? a.n + 1 : a.n - 1;
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(n1, n2, aBigger, 'They ate the same amount');
      return {
        prompt: `${n1}'s chocolate block has ${d1} pieces and she eats ${a.n}. ${n2}'s block is the same size but has ${d2} pieces, and he eats ${b.n}. Who ate more chocolate?`,
        answer: c.answer,
        hint: 'Write each as a fraction of the whole block, then give them the same bottom.',
        working: [`<i>Picture:</i> two blocks the same size, cut up differently. ${n1} ate ${F(a.n, a.d)}, ${n2} ate ${F(b.n, b.d)}.`]
          .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> ate more.`]),
        finalAnswer: c.correctHtml,
        skill: 'word-compare',
      };
    }

    if (t === 'reading') {
      const [a, b] = pairForLevel(level);
      const aBigger = cmp(a, b) > 0;
      const c = twoWay(n1, n2, aBigger, 'They are the same distance through');
      return {
        prompt: `${n1} has read ${F(a.n, a.d)} of her library book and ${n2} has read ${F(b.n, b.d)} of his. The books have the same number of pages. Who is further through?`,
        answer: c.answer,
        hint: routeHint(a, b),
        working: [`<i>Picture:</i> two identical books with a bookmark in each — whose bookmark is further along?`]
          .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
          .concat([`So <b>${c.correctHtml}</b> is further through.`]),
        finalAnswer: c.correctHtml,
        skill: 'word-compare',
      };
    }

    // sprint: fraction of a training run finished
    const [a, b] = pairForLevel(level);
    const aBigger = cmp(a, b) > 0;
    const c = twoWay(n1, n2, aBigger, 'They have run the same amount');
    return {
      prompt: `In cross country ${n1} has finished ${F(a.n, a.d)} of the course and ${n2} has finished ${F(b.n, b.d)}. Who is in front?`,
      answer: c.answer,
      hint: routeHint(a, b),
      working: [`<i>Picture:</i> one course, two runners. Compare ${F(a.n, a.d)} and ${F(b.n, b.d)}.`]
        .concat(compareWorking(a, b, F(a.n, a.d), F(b.n, b.d)).slice(1))
        .concat([`So <b>${c.correctHtml}</b> is in front.`]),
      finalAnswer: c.correctHtml,
      skill: 'word-compare',
    };
  }

  /* ---------- learn: diagram builders ---------- */
  /** one fraction bar: x,y,width,height, parts, shaded, colour */
  const bar = (x, y, w, h, parts, shaded, col, dash) => {
    const p = w / parts;
    return [...Array(parts)].map((_, k) => `<rect x="${N.round(x + k * p, 2)}" y="${y}" width="${N.round(p, 2)}" height="${h}" fill="${k < shaded ? col : '#fff'}" stroke="#4A3B48" stroke-width="${dash ? 1 : 2}"/>`).join('');
  };

  HL.registerTopic({
    id: 'fractions-compare', subject: 'maths', strand: 'number', order: 7,
    name: 'Comparing & equivalent fractions', short: 'Compare fractions',
    blurb: 'Which fraction is bigger? Make the bottoms the same and look at the tops.',
    example: '3/5 vs 5/8 → 24/40 vs 25/40',
    animal: 'bunny',
    learn: {
      what: '<p>Fractions only line up when the pieces are the <b>same size</b>. If the <b>bottoms</b> match you can compare the tops straight away. If they do not match, you make an <b>equivalent fraction</b> (multiply top and bottom by the same number) until both bottoms are the same, then compare.</p><p><b>Picture for this topic:</b> a <b>pizza</b>. The bottom number is how many slices the pizza is cut into, the top is how many slices you have. Cutting into more slices makes each slice <b>smaller</b>.</p>',
      visual: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
        <text x="176" y="13" text-anchor="middle" fill="#4A3B48" font-size="13">Same-size bars: which shaded part is bigger?</text>
        ${bar(50, 22, 210, 26, 5, 3, '#F9A8C9')}
        <text x="42" y="40" text-anchor="end" fill="#E0568C" font-size="15">3/5</text>
        <text x="268" y="40" fill="#2A6FA5" font-size="13">= 24/40</text>
        ${bar(50, 56, 210, 26, 8, 5, '#A9D8F5')}
        <text x="42" y="74" text-anchor="end" fill="#2A6FA5" font-size="15">5/8</text>
        <text x="268" y="74" fill="#2A6FA5" font-size="13">= 25/40</text>
        ${[...Array(40)].map((_, k) => `<rect x="${N.round(50 + k * 5.25, 2)}" y="92" width="5.25" height="16" fill="${k < 24 ? '#F9A8C9' : k === 24 ? '#A9D8F5' : '#fff'}" stroke="#4A3B48" stroke-width="1"/>`).join('')}
        <text x="268" y="105" fill="#4A3B48" font-size="12">40ths</text>
        <text x="50" y="126" fill="#4A3B48" font-size="12">cut both into 40ths — 5/8 reaches 1 more</text>
        <text x="176" y="148" text-anchor="middle" fill="#2FA97A" font-size="15">24/40 &lt; 25/40 &nbsp; so &nbsp; 3/5 &lt; 5/8</text>
        <rect x="6" y="156" width="348" height="58" rx="8" fill="#F5EFFF" stroke="#C9B8F2" stroke-width="2"/>
        <text x="14" y="174" fill="#4A3B48" font-size="12">Same TOP?</text>
        <text x="14" y="190" fill="#4A3B48" font-size="12">The SMALLER</text>
        <text x="14" y="206" fill="#4A3B48" font-size="12">bottom wins.</text>
        ${bar(148, 162, 96, 18, 5, 3, '#FFC79A')}
        <text x="142" y="176" text-anchor="end" fill="#E0568C" font-size="13">3/5</text>
        <text x="250" y="176" fill="#2FA97A" font-size="12">fat slices</text>
        ${bar(148, 188, 96, 18, 7, 3, '#FFE98A')}
        <text x="142" y="202" text-anchor="end" fill="#2A6FA5" font-size="13">3/7</text>
        <text x="250" y="202" fill="#E0568C" font-size="12">thin slices</text>
      </svg>`,
      facts: [
        '<b>Same bottom</b> → the bigger <b>TOP</b> wins',
        '<b>Same top</b> → the <b>SMALLER</b> bottom wins (bigger pieces)',
        '<b>Different both</b> → make the bottoms the same, then compare tops',
        '<b>Equivalent fractions</b>: multiply or divide top AND bottom by the same number',
        'More than 1/2 or less than 1/2 is a quick check',
      ],
      steps: [
        'Ask "<b>are the bottoms the same?</b>" If yes, the slices are the same size, so the bigger <b>top</b> is the bigger fraction.',
        'Ask "<b>are the tops the same?</b>" If yes, the fraction with the <b>smaller bottom</b> is bigger, because fewer slices means <b>bigger</b> slices. ' + N.fracHtml(3, 5) + ' beats ' + N.fracHtml(3, 7) + '.',
        'If both are different, find the <b>smallest number both bottoms go into</b> (the common denominator) and make two <b>equivalent fractions</b>: multiply top AND bottom by the same number.',
        'Now the bottoms match, so <b>compare the tops</b> and say which fraction is bigger.',
        'Quick check before you start: is each fraction <b>more or less than 1/2</b>? If one is over a half and one is under, you already know the answer.',
      ],
      examples: [
        {
          q: 'Which is bigger: ' + N.fracHtml(5, 8) + ' or ' + N.fracHtml(3, 8) + '?',
          visual: `<svg viewBox="0 0 360 100" width="360" height="100" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${bar(60, 14, 240, 26, 8, 5, '#F9A8C9')}
            <text x="52" y="32" text-anchor="end" fill="#E0568C" font-size="15">5/8</text>
            <text x="306" y="32" fill="#2FA97A" font-size="12">5 slices</text>
            ${bar(60, 50, 240, 26, 8, 3, '#A9D8F5')}
            <text x="52" y="68" text-anchor="end" fill="#2A6FA5" font-size="15">3/8</text>
            <text x="306" y="68" fill="#4A3B48" font-size="12">3 slices</text>
            <text x="180" y="94" text-anchor="middle" fill="#4A3B48" font-size="12">Same bottom → same size slices → count them</text>
          </svg>`,
          working: [
            '<i>Picture:</i> two pizzas, both cut into <b>8</b> slices.',
            '1. Are the bottoms the same? <b>Yes</b>, both 8. So the slices are the same size.',
            '2. Same bottom → the bigger <b>top</b> wins: 5 slices beats 3 slices.',
          ],
          a: N.fracHtml(5, 8) + ' is bigger',
        },
        {
          q: 'Which is bigger: ' + N.fracHtml(3, 5) + ' or ' + N.fracHtml(3, 7) + '?',
          visual: `<svg viewBox="0 0 360 110" width="360" height="110" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${bar(60, 14, 224, 26, 5, 3, '#FFC79A')}
            <text x="52" y="32" text-anchor="end" fill="#E0568C" font-size="15">3/5</text>
            <text x="290" y="32" fill="#2FA97A" font-size="12">fat slices</text>
            ${bar(60, 50, 224, 26, 7, 3, '#FFE98A')}
            <text x="52" y="68" text-anchor="end" fill="#2A6FA5" font-size="15">3/7</text>
            <text x="290" y="68" fill="#E0568C" font-size="12">thin slices</text>
            <text x="176" y="98" text-anchor="middle" fill="#4A3B48" font-size="12">3 slices each — fifths are fatter than sevenths</text>
          </svg>`,
          working: [
            '<i>Picture:</i> the same number of slices (3), but one pizza is cut into 5 and one into 7.',
            '1. Are the tops the same? <b>Yes</b>, both 3.',
            '2. Same top → the <b>smaller bottom</b> wins. Cutting into 7 makes thinner slices than cutting into 5.',
            '3. Three fat slices beat three thin slices.',
          ],
          a: N.fracHtml(3, 5) + ' is bigger',
        },
        {
          q: 'Fill the gap: ' + N.fracHtml(3, 4) + ' = ' + gapFrac('?', 12),
          visual: `<svg viewBox="0 0 360 120" width="360" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${bar(60, 14, 240, 26, 4, 3, '#F9A8C9')}
            <text x="52" y="32" text-anchor="end" fill="#E0568C" font-size="15">3/4</text>
            ${[1, 2, 4, 5, 7, 8, 10, 11].map((k) => `<line x1="${60 + k * 20}" y1="14" x2="${60 + k * 20}" y2="40" stroke="#4A3B48" stroke-width="1" stroke-dasharray="3 3"/>`).join('')}
            <text x="306" y="32" fill="#4A3B48" font-size="12">× 3 cuts</text>
            ${bar(60, 56, 240, 26, 12, 9, '#A9D8F5')}
            <text x="52" y="74" text-anchor="end" fill="#2A6FA5" font-size="15">9/12</text>
            <text x="180" y="104" text-anchor="middle" fill="#2FA97A" font-size="13">same amount of pizza, just more slices</text>
          </svg>`,
          working: [
            '<i>Picture:</i> the same pizza, cut again. Each quarter is chopped into 3, so 4 slices become 12.',
            '1. What did the bottom do? 4 × <b>3</b> = 12.',
            '2. Golden rule: do the same to the top. 3 × <b>3</b> = 9.',
            '3. So ' + N.fracHtml(3, 4) + ' = ' + N.fracHtml(9, 12) + '.',
          ],
          a: '9',
        },
        {
          q: 'Write ' + N.fracHtml(18, 24) + ' in its simplest form.',
          working: [
            '<i>Picture:</i> simplifying is joining slices back up — <b>fewer, bigger</b> slices, same amount of pizza.',
            '1. What number goes into both 18 and 24? <b>6</b>.',
            '2. Top: 18 ÷ 6 = 3.',
            '3. Bottom: 24 ÷ 6 = 4.',
            '4. Can I go further? <b>No</b>, nothing goes into both 3 and 4.',
          ],
          a: N.fracHtml(3, 4),
        },
        {
          q: 'Which is bigger: ' + N.fracHtml(2, 3) + ' or ' + N.fracHtml(5, 8) + '?',
          visual: `<svg viewBox="0 0 360 130" width="360" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${bar(52, 14, 216, 26, 3, 2, '#F9A8C9')}
            ${[...Array(23)].map((_, i) => `<line x1="${N.round(52 + (i + 1) * 9, 2)}" y1="14" x2="${N.round(52 + (i + 1) * 9, 2)}" y2="40" stroke="#4A3B48" stroke-width="1" stroke-dasharray="3 3"/>`).join('')}
            <text x="44" y="32" text-anchor="end" fill="#E0568C" font-size="15">2/3</text>
            <text x="276" y="32" fill="#2FA97A" font-size="13">= 16/24</text>
            ${bar(52, 50, 216, 26, 8, 5, '#A9D8F5')}
            ${[...Array(23)].map((_, i) => `<line x1="${N.round(52 + (i + 1) * 9, 2)}" y1="50" x2="${N.round(52 + (i + 1) * 9, 2)}" y2="76" stroke="#4A3B48" stroke-width="1" stroke-dasharray="3 3"/>`).join('')}
            <text x="44" y="68" text-anchor="end" fill="#2A6FA5" font-size="15">5/8</text>
            <text x="276" y="68" fill="#2A6FA5" font-size="13">= 15/24</text>
            <text x="176" y="100" text-anchor="middle" fill="#4A3B48" font-size="12">both cut into 24ths — now compare the tops</text>
            <text x="176" y="120" text-anchor="middle" fill="#2FA97A" font-size="14">16 &gt; 15</text>
          </svg>`,
          working: [
            '<i>Picture:</i> thirds and eighths are different-sized slices, so I re-cut both pizzas the same way.',
            '1. Bottoms different, tops different → make the bottoms the same.',
            '2. Smallest number both 3 and 8 go into: <b>24</b>.',
            '3. ' + N.fracHtml(2, 3) + ' = ' + N.fracHtml(16, 24) + ' (× 8 top and bottom), ' + N.fracHtml(5, 8) + ' = ' + N.fracHtml(15, 24) + ' (× 3 top and bottom).',
            '4. Same slice size now, so compare the tops: 16 &gt; 15.',
          ],
          a: N.fracHtml(2, 3) + ' is bigger',
        },
        {
          q: 'A muffin recipe needs ' + N.fracHtml(7, 4) + ' cups of flour. Harper has ' + N.fracHtml(3, 2, { mixed: true }) + ' cups. Does she have enough?',
          working: [
            '<i>Picture:</i> two measuring jugs side by side — which one holds more?',
            '1. Is the recipe amount top-heavy? <b>Yes</b>, so I change it: 7 ÷ 4 = 1 remainder 3, so ' + N.fracHtml(7, 4) + ' = ' + N.fracHtml(7, 4, { mixed: true }) + ' cups.',
            '2. Both are 1 and a bit, so I compare the fraction parts: ' + N.fracHtml(3, 4) + ' and ' + N.fracHtml(1, 2) + '.',
            '3. Same bottom (4): ' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(2, 4) + '. Now 3 &gt; 2.',
            '4. The recipe needs ' + N.fracHtml(7, 4, { mixed: true }) + ' cups, she only has ' + N.fracHtml(3, 2, { mixed: true }) + ' cups.',
          ],
          a: 'No — she needs ' + N.fracHtml(1, 4) + ' of a cup more',
        },
      ],
      tips: [
        '<b>A bigger bottom does not mean a bigger fraction.</b> ' + N.fracHtml(1, 10) + ' is much smaller than ' + N.fracHtml(1, 3) + ' — more slices means smaller slices.',
        'Never compare the tops when the bottoms are different. Make the bottoms match first.',
        'Half is your friend: ' + N.fracHtml(5, 9) + ' is just over a half, ' + N.fracHtml(4, 9) + ' is just under, so you know the answer without any working.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
