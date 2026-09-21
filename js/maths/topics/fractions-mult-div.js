/* Topic: Multiplying & dividing fractions — fraction of an amount, × and ÷ fractions (keep-change-flip), mixed numbers */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const F = (n, d) => N.fracHtml(n, d);
  const M = (n, d) => N.fracHtml(n, d, { mixed: true });
  const simp = (n, d) => N.simplify(n, d);
  /** a whole number written as a stacked fraction over 1 (fracHtml would collapse it) */
  const over1 = (n) => `<span class="frac"><span class="frac-n">${n}</span><span class="frac-d">1</span></span>`;
  /** proper numerator coprime with d */
  const properN = (d) => { if (d <= 2) return 1; let n; do { n = R.int(1, d - 1); } while (N.gcd(n, d) !== 1); return n; };
  /** answer: number if whole, else fraction in simplest form */
  function fracAnswer(n, d, unit) {
    const s = simp(n, d);
    const a = s.d === 1 ? { type: 'number', value: s.n } : { type: 'fraction', value: { n: s.n, d: s.d }, placeholder: 'e.g. 3/4 or 1 1/2' };
    if (unit) a.unit = unit;
    return { answer: a, pretty: M(s.n, s.d) + (unit ? ' ' + unit : '') };
  }
  const simplifyLines = (n, d) => {
    const s = simp(n, d), lines = [];
    if (s.d !== d) lines.push(`Simplify: divide top and bottom by ${N.gcd(n, d)} → ${F(s.n, s.d)}.`);
    if (s.d !== 1 && Math.abs(s.n) > s.d) lines.push(`Write as a mixed number: ${F(s.n, s.d)} = ${M(s.n, s.d)}.`);
    lines.push(`Answer: <b>${M(s.n, s.d)}</b>`);
    return lines;
  };
  /** working for a/b × c/d */
  function mulWorking(a, b, c, d) {
    return [`Multiply the tops: ${a} × ${c} = ${a * c}. Multiply the bottoms: ${b} × ${d} = ${b * d}.`, `${F(a, b)} × ${F(c, d)} = ${F(a * c, b * d)}.`].concat(simplifyLines(a * c, b * d));
  }
  /** working for a/b ÷ c/d using keep-change-flip */
  function divWorking(a, b, c, d) {
    return [`<b>Keep</b> the first fraction, <b>change</b> ÷ to ×, <b>flip</b> the second: ${F(a, b)} ÷ ${F(c, d)} = ${F(a, b)} × ${F(d, c)}.`].concat(mulWorking(a, b, d, c));
  }
  const improperLine = (w, n, d) => `${M(w * d + n, d)} = ${F(w * d + n, d)} (${w} × ${d} + ${n} = ${w * d + n})`;

  // ---------- calc ----------
  function fractionOf(level) {
    const d = level === 1 ? R.pick([2, 3, 4, 5, 6, 8, 10]) : R.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const n = level === 1 ? R.pick([1, 1, properN(d)]) : properN(d);
    const W = d * R.int(level === 1 ? 2 : 4, level === 1 ? 10 : 15);
    const ans = W / d * n;
    return {
      prompt: `${F(n, d)} of ${W} = ?`,
      answer: { type: 'number', value: ans },
      hint: `Divide by the bottom (${W} ÷ ${d}), then multiply by the top (× ${n}).`,
      working: [`${W} ÷ ${d} = ${W / d}, so ${F(1, d)} of ${W} is ${W / d}.`].concat(n === 1 ? [`Answer: <b>${ans}</b>`] : [`${W / d} × ${n} = ${ans}, so ${F(n, d)} of ${W} is <b>${ans}</b>.`]),
      finalAnswer: String(ans), skill: 'fraction-of',
    };
  }
  function fracTimesWhole(level) {
    const d = R.pick([2, 3, 4, 5, 6, 8]), n = properN(d), W = R.int(2, level === 1 ? 6 : 12);
    const fa = fracAnswer(n * W, d);
    return {
      prompt: `${F(n, d)} × ${W} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: `Write ${W} as ${over1(W)}. Multiply the tops, multiply the bottoms.`,
      working: [`${W} is the same as ${over1(W)}.`].concat(mulWorking(n, d, W, 1)),
      finalAnswer: fa.pretty, skill: 'frac-times-whole',
    };
  }
  function fracTimesFrac(level) {
    const pool = level === 2 ? [2, 3, 4, 5, 6, 8] : [3, 4, 5, 6, 8, 9, 10, 12];
    const b = R.pick(pool), d = R.pick(pool);
    const a = properN(b), c = properN(d);
    const fa = fracAnswer(a * c, b * d);
    return {
      prompt: `${F(a, b)} × ${F(c, d)} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: 'Tops times tops, bottoms times bottoms. Then simplify.',
      working: mulWorking(a, b, c, d),
      finalAnswer: fa.pretty, skill: 'frac-times-frac',
    };
  }
  function fracDivFrac(level) {
    const pool = level === 2 ? [2, 3, 4, 5, 6, 8] : [3, 4, 5, 6, 8, 9, 10, 12];
    const b = R.pick(pool), d = R.pick(pool);
    const a = properN(b), c = properN(d);
    const fa = fracAnswer(a * d, b * c);
    return {
      prompt: `${F(a, b)} ÷ ${F(c, d)} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: 'Keep, Change, Flip: keep the first fraction, change ÷ to ×, flip the second fraction upside down.',
      working: divWorking(a, b, c, d),
      finalAnswer: fa.pretty, skill: 'keep-change-flip',
    };
  }
  function wholeDivFrac(level) {
    const d = R.pick([2, 3, 4, 5, 6, 8]), n = level === 2 ? R.pick([1, 1, properN(d)]) : properN(d);
    const W = n * R.int(2, level === 2 ? 6 : 9);
    const fa = fracAnswer(W * d, n);
    return {
      prompt: `${W} ÷ ${F(n, d)} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: `How many ${F(n, d)}s fit into ${W}? Keep ${W}, change ÷ to ×, flip ${F(n, d)} to ${F(d, n)}.`,
      working: [`Write ${W} as ${over1(W)}.`].concat(divWorking(W, 1, n, d)),
      finalAnswer: fa.pretty, skill: 'keep-change-flip',
    };
  }
  function fracDivWhole(level) {
    const d = level === 2 ? R.pick([2, 3, 4, 5, 6, 8]) : R.pick([3, 4, 5, 6, 8, 9, 10]), n = properN(d), W = R.int(2, level === 2 ? 5 : 9);
    const fa = fracAnswer(n, d * W);
    return {
      prompt: `${F(n, d)} ÷ ${W} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: `Dividing by ${W} is the same as multiplying by ${F(1, W)}.`,
      working: [`Write ${W} as ${over1(W)}.`].concat(divWorking(n, d, W, 1)),
      finalAnswer: fa.pretty, skill: 'keep-change-flip',
    };
  }
  function mixedMul() {
    const d1 = R.pick([2, 3, 4, 5]), d2 = R.pick([2, 3, 4, 5, 6]);
    const a = { w: R.int(1, 3), n: properN(d1), d: d1 };
    const useWhole = R.chance(0.3);
    const b = useWhole ? { w: R.int(2, 6), n: 0, d: 1 } : { w: R.int(0, 2), n: properN(d2), d: d2 };
    const A = a.w * a.d + a.n, B = b.w * b.d + b.n;
    const fa = fracAnswer(A * B, a.d * b.d);
    const bStr = useWhole ? String(b.w) : M(B, b.d);
    const conv = [improperLine(a.w, a.n, a.d)].concat(!useWhole && b.w ? [improperLine(b.w, b.n, b.d)] : useWhole ? [`${b.w} = ${over1(b.w)}`] : []);
    return {
      prompt: `${M(A, a.d)} × ${bStr} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: 'Change mixed numbers to improper fractions first. Then tops × tops, bottoms × bottoms.',
      working: [`Improper fractions first: ${conv.join(' and ')}.`].concat(mulWorking(A, a.d, B, b.d)),
      finalAnswer: fa.pretty, skill: 'mixed',
    };
  }
  function mixedDiv() {
    const d1 = R.pick([2, 3, 4, 5]), d2 = R.pick([2, 3, 4, 5, 6, 8]);
    const a = { w: R.int(1, 4), n: properN(d1), d: d1 };
    const b = R.chance(0.5) ? { w: 0, n: properN(d2), d: d2 } : { w: R.int(1, 2), n: properN(d2), d: d2 };
    const A = a.w * a.d + a.n, B = b.w * b.d + b.n;
    const fa = fracAnswer(A * b.d, a.d * B);
    const conv = [improperLine(a.w, a.n, a.d)].concat(b.w ? [improperLine(b.w, b.n, b.d)] : []);
    return {
      prompt: `${M(A, a.d)} ÷ ${M(B, b.d)} = ? <span class="muted">(simplest form)</span>`,
      answer: fa.answer,
      hint: 'Improper fractions first, then Keep, Change, Flip.',
      working: [`Improper fractions first: ${conv.join(' and ')}.`].concat(divWorking(A, a.d, B, b.d)),
      finalAnswer: fa.pretty, skill: 'mixed',
    };
  }

  function calc(level) {
    if (level === 1) return R.chance(0.65) ? fractionOf(1) : fracTimesWhole(1);
    if (level === 2) {
      const t = R.pick(['of', 'timesWhole', 'timesFrac', 'timesFrac', 'divFrac', 'divFrac', 'wholeDiv', 'divWhole']);
      if (t === 'of') return fractionOf(2);
      if (t === 'timesWhole') return fracTimesWhole(2);
      if (t === 'timesFrac') return fracTimesFrac(2);
      if (t === 'divFrac') return fracDivFrac(2);
      if (t === 'wholeDiv') return wholeDivFrac(2);
      return fracDivWhole(2);
    }
    const t = R.pick(['mixedMul', 'mixedMul', 'mixedDiv', 'mixedDiv', 'timesFrac', 'divFrac', 'wholeDiv', 'divWhole']);
    if (t === 'mixedMul') return mixedMul();
    if (t === 'mixedDiv') return mixedDiv();
    if (t === 'timesFrac') return fracTimesFrac(3);
    if (t === 'divFrac') return fracDivFrac(3);
    if (t === 'wholeDiv') return wholeDivFrac(3);
    return fracDivWhole(3);
  }

  // ---------- word problems ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['students', 'book', 'money', 'pizzaShare', 'minutes', 'slices']
      : level === 2 ? ['students', 'recipe', 'half', 'rope', 'bottle', 'pizzaShare', 'cups', 'minutes', 'reverse']
        : ['recipe', 'rope', 'bottle', 'cups', 'walk', 'paint', 'ropeLeft', 'ropeLeft', 'classHalf', 'classHalf', 'pocket', 'pocket', 'reverse']);
    if (t === 'students') {
      const d = R.pick(level === 1 ? [2, 3, 4, 5, 10] : [2, 3, 4, 5, 6, 8, 10]), n = level === 1 ? R.pick([1, 1, properN(d)]) : properN(d), W = d * R.int(3, level === 1 ? 8 : 12);
      const ans = W / d * n;
      const act = R.pick(['play netball', 'walk to school', 'have a pet', 'bring a packed lunch', 'went on the camp']);
      return {
        prompt: `${F(n, d)} of the ${W} students in Harper's year ${act}. How many students is that?`,
        answer: { type: 'number', value: ans, unit: 'students' },
        hint: `${W} ÷ ${d} gives one ${d === 2 ? 'half' : d === 3 ? 'third' : d === 4 ? 'quarter' : 'part'}, then × ${n}.`,
        working: [`${W} ÷ ${d} = ${W / d}`, `${W / d} × ${n} = <b>${ans}</b> students`],
        finalAnswer: `${ans} students`, skill: 'fraction-of',
      };
    }
    if (t === 'book') {
      const d = R.pick([2, 3, 4, 5]), n = properN(d), W = d * R.int(20, 60);
      const ans = W / d * n;
      return {
        prompt: `Harper's book has ${W} pages. She has read ${F(n, d)} of it. How many pages has she read?`,
        answer: { type: 'number', value: ans, unit: 'pages' },
        hint: `Divide ${W} by ${d}, then multiply by ${n}.`,
        working: [`${W} ÷ ${d} = ${W / d}`, `${W / d} × ${n} = <b>${ans}</b> pages`],
        finalAnswer: `${ans} pages`, skill: 'fraction-of',
      };
    }
    if (t === 'money') {
      const d = R.pick([2, 4, 5, 10]), n = R.pick([1, 1, properN(d)]), W = d * R.int(2, 8);
      const ans = W / d * n;
      return {
        prompt: `Harper has $${W} of birthday money. She spends ${F(n, d)} of it on a book. How much does she spend?`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: `$${W} ÷ ${d} = $${W / d}, then × ${n}.`,
        working: [`${W} ÷ ${d} = ${W / d}`, `${W / d} × ${n} = <b>$${ans}</b>`],
        finalAnswer: `$${ans}`, skill: 'fraction-of',
      };
    }
    if (t === 'pizzaShare') {
      const d = R.pick([2, 4]), n = d === 2 ? 1 : R.pick([1, 3]), k = R.pick([2, 3, 4]);
      const fa = fracAnswer(n, d * k);
      return {
        prompt: `${F(n, d)} of a pizza is left. Harper shares it equally between ${k} people. What fraction of the whole pizza does each person get? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: `Dividing by ${k} is the same as multiplying by ${F(1, k)}.`,
        working: [`Each person gets ${F(n, d)} ÷ ${k}.`].concat(divWorking(n, d, k, 1)),
        finalAnswer: `${fa.pretty} of the pizza`, skill: 'keep-change-flip',
      };
    }
    if (t === 'recipe') {
      const d = R.pick([2, 3, 4]), n = properN(d), k = R.int(2, 4);
      const ing = R.pick(['sugar', 'flour', 'cocoa', 'oats']);
      const fa = fracAnswer(n * k, d, 'cups');
      return {
        prompt: `A recipe uses ${F(n, d)} of a cup of ${ing}. Harper makes ${k} batches. How many cups of ${ing} does she need? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: `Multiply ${F(n, d)} by ${k}.`,
        working: [`${F(n, d)} × ${k} = ${F(n, d)} × ${over1(k)}.`].concat(mulWorking(n, d, k, 1)),
        finalAnswer: fa.pretty, skill: 'frac-times-whole',
      };
    }
    if (t === 'half') {
      const d = R.pick([2, 3, 4, 5]), n = properN(d);
      const ing = R.pick(['milk', 'sugar', 'butter', 'rice']);
      const unit = R.pick(['a cup', 'a litre', 'a kilogram']);
      const fa = fracAnswer(n, d * 2);
      return {
        prompt: `A recipe uses ${F(n, d)} of ${unit} of ${ing}. Harper only wants to make half the recipe. How much ${ing} does she need? Give your answer as a fraction of ${unit}, in simplest form.`,
        answer: fa.answer,
        hint: `Half of something is the same as × ${F(1, 2)}.`,
        working: [`Half of ${F(n, d)} = ${F(n, d)} × ${F(1, 2)}.`].concat(mulWorking(n, d, 1, 2)),
        finalAnswer: `${fa.pretty} of ${unit}`, skill: 'frac-times-frac',
      };
    }
    if (t === 'rope') {
      const d = R.pick([2, 3, 4, 5, 8]), n = properN(d);
      const pieces = R.int(3, 12);
      const total = simp(n * pieces, d);
      const totalStr = total.d === 1 ? String(total.n) : M(total.n, total.d);
      const thing = R.pick(['rope', 'ribbon', 'fabric', 'wire']);
      return {
        prompt: `Harper cuts ${totalStr} m of ${thing} into pieces that are each ${F(n, d)} m long. How many pieces does she get?`,
        answer: { type: 'number', value: pieces, unit: 'pieces' },
        hint: `This is ${totalStr} ÷ ${F(n, d)}. Keep, Change, Flip.`,
        working: (total.d === 1 ? [`${total.n} = ${over1(total.n)}.`] : [`${totalStr} as an improper fraction is ${F(total.n, total.d)}.`]).concat(divWorking(total.n, total.d, n, d)),
        finalAnswer: `${pieces} pieces`, skill: 'keep-change-flip',
      };
    }
    if (t === 'bottle') {
      const d = R.pick([2, 3, 4, 5, 8]), n = properN(d), d2 = R.pick([2, 3, 4]), n2 = properN(d2);
      const fa = fracAnswer(n * n2, d * d2, 'L');
      return {
        prompt: `A bottle holds ${F(n, d)} L of juice. Harper drinks ${F(n2, d2)} of it. How many litres does she drink? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: `"Of" means multiply: ${F(n2, d2)} × ${F(n, d)}.`,
        working: [`${F(n2, d2)} of ${F(n, d)} = ${F(n2, d2)} × ${F(n, d)}.`].concat(mulWorking(n2, d2, n, d)),
        finalAnswer: fa.pretty, skill: 'frac-times-frac',
      };
    }
    if (t === 'cups') {
      const d = R.pick([2, 3, 4]), scoopD = R.pick([3, 4, 8].filter((x) => x % d === 0 || d % x === 0)), scoopN = 1;
      const w = R.int(1, 3), n = properN(d);
      const total = w * d + n;
      const pieces = simp(total * scoopD, d * scoopN);
      if (pieces.d !== 1) return word(level);
      return {
        prompt: `Harper needs ${M(total, d)} cups of flour but only has a ${F(scoopN, scoopD)}-cup scoop. How many scoops does she need?`,
        answer: { type: 'number', value: pieces.n, unit: 'scoops' },
        hint: `Work out ${M(total, d)} ÷ ${F(scoopN, scoopD)}. Improper fraction first, then Keep, Change, Flip.`,
        working: [`${improperLine(w, n, d)}.`].concat(divWorking(total, d, scoopN, scoopD)),
        finalAnswer: `${pieces.n} scoops`, skill: 'mixed',
      };
    }
    if (t === 'walk') {
      const d = R.pick([2, 4, 5]), n = properN(d), w = R.int(1, 3), days = R.int(2, 7);
      const total = w * d + n;
      const fa = fracAnswer(total * days, d, 'km');
      return {
        prompt: `Harper walks ${M(total, d)} km to school and back each day. How far does she walk in ${days} days? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: `Multiply ${M(total, d)} by ${days}. Change to an improper fraction first.`,
        working: [`${improperLine(w, n, d)}.`, `${F(total, d)} × ${days} = ${F(total, d)} × ${over1(days)}.`].concat(mulWorking(total, d, days, 1)),
        finalAnswer: fa.pretty, skill: 'mixed',
      };
    }
    if (t === 'minutes') {
      const d = R.pick([2, 3, 4, 5, 6, 10, 12]), n = properN(d);
      const ans = 60 / d * n;
      const job = R.pick(['on her homework', 'at netball training', 'reading her library book', 'walking to the bus stop']);
      return {
        prompt: `Harper spends ${F(n, d)} of an hour ${job}. How many minutes is that?`,
        answer: { type: 'number', value: ans, unit: 'minutes' },
        hint: `One hour is 60 minutes. Divide 60 by ${d}, then multiply by ${n}.`,
        working: [`60 ÷ ${d} = ${60 / d}, so ${F(1, d)} of an hour is ${60 / d} minutes.`, `${60 / d} × ${n} = <b>${ans}</b> minutes.`],
        finalAnswer: `${ans} minutes`, skill: 'fraction-of',
      };
    }
    if (t === 'slices') {
      const d = R.pick([2, 3, 4, 6]), n = properN(d), slices = d * R.int(2, 4);
      const ans = slices / d * n;
      const food = R.pick(['birthday cake', 'pizza', 'chocolate loaf']);
      return {
        prompt: `A ${food} is cut into ${slices} equal slices. Harper's family eats ${F(n, d)} of it. How many slices is that?`,
        answer: { type: 'number', value: ans, unit: 'slices' },
        hint: `Split the ${slices} slices into ${d} equal groups, then take ${n} of the groups.`,
        working: [`${slices} ÷ ${d} = ${slices / d} slices in each ${d === 2 ? 'half' : d === 3 ? 'third' : d === 4 ? 'quarter' : 'part'}.`, `${slices / d} × ${n} = <b>${ans}</b> slices.`],
        finalAnswer: `${ans} slices`, skill: 'fraction-of',
      };
    }
    if (t === 'ropeLeft') {
      let d, n, W, whole, leftN;
      for (let i = 0; i < 40; i++) {
        d = R.pick([2, 3, 4, 5, 8]); n = properN(d); W = R.int(3, 9);
        whole = Math.floor(W * d / n); leftN = W * d - whole * n;
        if (leftN > 0 && whole >= 2) break;
        leftN = 0;
      }
      if (!leftN) { d = 4; n = 3; W = 5; whole = 6; leftN = 2; }
      const askWhole = R.chance(0.5);
      const thing = R.pick(['rope', 'flax', 'ribbon', 'garden hose']);
      const fa = fracAnswer(leftN, d, 'm');
      const shared = [
        `How many ${F(n, d)} m pieces fit? Work out ${W} ÷ ${F(n, d)}.`,
        `Keep ${over1(W)}, change ÷ to ×, flip ${F(n, d)} to ${F(d, n)}: ${F(W * d, n)} = ${M(W * d, n)}.`,
        `That is ${whole} whole pieces and a bit more, so she can only cut <b>${whole}</b> whole pieces.`,
      ];
      if (askWhole) {
        return {
          prompt: `Harper has ${W} m of ${thing}. She cuts it into pieces ${F(n, d)} m long. How many <b>whole</b> pieces can she cut?`,
          answer: { type: 'number', value: whole, unit: 'pieces' },
          hint: 'Divide, then round <b>down</b> — a part-piece is not a whole piece.',
          working: shared, finalAnswer: `${whole} pieces`, skill: 'interpret',
        };
      }
      return {
        prompt: `Harper has ${W} m of ${thing}. She cuts off as many ${F(n, d)} m pieces as she can. How much ${thing} is left over, in m? Give your answer in simplest form.`,
        answer: fa.answer,
        hint: `Work out how many whole pieces fit first, then take that much off the ${W} m.`,
        working: shared.concat([
          `Those ${whole} pieces use ${whole} × ${F(n, d)} = ${F(whole * n, d)} = ${M(simp(whole * n, d).n, simp(whole * n, d).d)} m.`,
          `Left over: ${W} − ${M(simp(whole * n, d).n, simp(whole * n, d).d)} = <b>${fa.pretty}</b>.`,
        ]),
        finalAnswer: fa.pretty, skill: 'interpret',
      };
    }
    if (t === 'classHalf') {
      const d1 = R.pick([2, 3, 4, 5]), n1 = properN(d1);
      const d2 = R.pick([2, 3, 4]), n2 = properN(d2);
      const size = d1 * d2 * R.int(1, 3);
      const fa = fracAnswer(n1 * n2, d1 * d2);
      const sport = R.pick(['netball', 'rugby', 'hockey', 'football']);
      if (R.chance(0.5)) {
        return {
          prompt: `${F(n1, d1)} of the ${size} students in Harper's class play a sport. ${F(n2, d2)} of those students play ${sport}. What fraction of the <b>whole class</b> plays ${sport}? Give your answer in simplest form.`,
          answer: fa.answer,
          hint: `"Of" means ×. You do not need the ${size} — multiply ${F(n2, d2)} × ${F(n1, d1)}.`,
          working: [`The ${size} students is <b>not needed</b> for a fraction answer.`, `${F(n2, d2)} of ${F(n1, d1)} = ${F(n2, d2)} × ${F(n1, d1)}.`].concat(mulWorking(n2, d2, n1, d1)),
          finalAnswer: `${fa.pretty} of the class`, skill: 'frac-times-frac',
        };
      }
      const some = size / d1 * n1, ans = some / d2 * n2;
      return {
        prompt: `There are ${size} students in Harper's class. ${F(n1, d1)} of them play a sport, and ${F(n2, d2)} of those students play ${sport}. How many students play ${sport}?`,
        answer: { type: 'number', value: ans, unit: 'students' },
        hint: `Do it in two steps: first ${F(n1, d1)} of ${size}, then ${F(n2, d2)} of that answer.`,
        working: [
          `Step 1: ${F(n1, d1)} of ${size} = ${size} ÷ ${d1} × ${n1} = ${some} students play a sport.`,
          `Step 2: ${F(n2, d2)} of ${some} = ${some} ÷ ${d2} × ${n2} = ${ans}.`,
          `<b>${ans}</b> students play ${sport}.`,
        ],
        finalAnswer: `${ans} students`, skill: 'two-step',
      };
    }
    if (t === 'pocket') {
      const d1 = R.pick([2, 3, 4, 5]), n1 = properN(d1);
      const d2 = R.pick([2, 3, 4]), n2 = properN(d2);
      const m = R.int(2, 8);
      const total = d1 * d2 * m, saved = d2 * m * n1, spent = m * n1 * n2;
      const buy = R.pick(['a book', 'a netball top', 'a birthday present for her cousin', 'art supplies']);
      const askLeft = R.chance(0.5);
      const left = saved - spent;
      const shared = [
        `Step 1: ${F(n1, d1)} of $${total} = ${total} ÷ ${d1} × ${n1} = $${saved} saved.`,
        `Step 2: ${F(n2, d2)} of $${saved} = ${saved} ÷ ${d2} × ${n2} = $${spent}.`,
      ];
      if (askLeft) {
        return {
          prompt: `Harper has $${total} of pocket money. She saves ${F(n1, d1)} of it, then spends ${F(n2, d2)} of her savings on ${buy}. How much of her savings is left?`,
          answer: { type: 'number', value: left, unit: '$' },
          hint: 'Three steps: find the savings, find what she spent, then take one from the other.',
          working: shared.concat([`Step 3: $${saved} − $${spent} = <b>$${left}</b> left.`]),
          finalAnswer: `$${left}`, skill: 'two-step',
        };
      }
      return {
        prompt: `Harper has $${total} of pocket money. She saves ${F(n1, d1)} of it, then spends ${F(n2, d2)} of her savings on ${buy}. How much does she spend on ${buy}?`,
        answer: { type: 'number', value: spent, unit: '$' },
        hint: `Careful: the second fraction is of her <b>savings</b>, not of the $${total}. Do it in two steps.`,
        working: shared.concat([`She spends <b>$${spent}</b>.`]),
        finalAnswer: `$${spent}`, skill: 'two-step',
      };
    }
    if (t === 'reverse') {
      const d = R.pick([2, 3, 4, 5, 8]), n = properN(d), m = R.int(2, 6);
      const total = d * m, used = n * m;
      const thing = R.pick([['ribbon', 'm'], ['rope', 'm'], ['flax', 'm'], ['fabric', 'm']]);
      return {
        prompt: `Harper used ${F(n, d)} of a roll of ${thing[0]} for a Matariki kite. The piece she used was ${used} ${thing[1]} long. How long was the whole roll, in ${thing[1]}?`,
        answer: { type: 'number', value: total, unit: thing[1] },
        hint: `Working backwards: ${used} is ${F(n, d)} of the roll, so the roll = ${used} ÷ ${F(n, d)}.`,
        working: [
          `${F(n, d)} of the roll = ${used} ${thing[1]}.`,
          `So ${F(1, d)} of the roll = ${used} ÷ ${n} = ${used / n} ${thing[1]}.`,
          `The whole roll is ${d} of those: ${used / n} × ${d} = <b>${total} ${thing[1]}</b>.`,
        ],
        finalAnswer: `${total} ${thing[1]}`, skill: 'reverse',
      };
    }
    // paint: mixed ÷ fraction
    const d = R.pick([2, 4]), n = properN(d), w = R.int(2, 5);
    const total = w * d + n;
    const per = R.pick([[1, 4], [1, 2], [3, 4]].filter(([pn, pd]) => (total * pd) % (d * pn) === 0));
    if (!per) return word(level);
    const pieces = (total * per[1]) / (d * per[0]);
    return {
      prompt: `Harper has ${M(total, d)} L of paint. Each fence panel needs ${F(per[0], per[1])} L. How many panels can she paint?`,
      answer: { type: 'number', value: pieces, unit: 'panels' },
      hint: `${M(total, d)} ÷ ${F(per[0], per[1])}. Improper fraction, then Keep, Change, Flip.`,
      working: [`${improperLine(w, n, d)}.`].concat(divWorking(total, d, per[0], per[1])),
      finalAnswer: `${pieces} panels`, skill: 'mixed',
    };
  }

  HL.registerTopic({
    id: 'fractions-mult-div', subject: 'maths', strand: 'number', order: 9,
    name: 'Multiplying & dividing fractions', short: 'Fractions × ÷',
    blurb: 'Tops times tops, bottoms times bottoms. To divide: Keep, Change, Flip.',
    example: '2/3 × 3/4 = 6/12 = 1/2 &nbsp;·&nbsp; 3/4 ÷ 1/2 = 3/4 × 2/1 = 1 1/2',
    animal: 'giraffe',
    learn: {
      what: '<p>Multiplying fractions is the easy one: you do <b>not</b> need the same denominators. Just multiply the tops and multiply the bottoms. "<b>Of</b>" means multiply: ' + N.fracHtml(3, 4) + ' of 24 is ' + N.fracHtml(3, 4) + ' × 24 = 18.</p><p>Dividing by a fraction asks "how many of these fit?" 6 ÷ ' + N.fracHtml(1, 2) + ' = 12 because twelve halves fit into 6. The trick is <b>Keep, Change, Flip</b>: keep the first fraction, change ÷ to ×, flip the second fraction upside down.</p><p><b>Picture for this topic:</b> a <b>pizza</b> again. ' + N.fracHtml(1, 2) + ' × ' + N.fracHtml(1, 3) + ' is "half of a third-slice". Dividing asks "how many slices of this size fit in what I have?"</p>',
      visual: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        <defs>${[['g','#2FA97A'],['r','#E0568C'],['b','#2A6FA5']].map(([k,c])=>`<marker id="fm-c-${k}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${c}"/></marker>`).join('')}</defs>
        <text x="100" y="18" text-anchor="middle" fill="#4A3B48">Area model</text>
        <rect x="40" y="52" width="120" height="108" fill="#fff" stroke="#4A3B48" stroke-width="2"/>
        <rect x="40" y="52" width="60" height="108" fill="#F9A8C9"/><rect x="40" y="52" width="120" height="36" fill="#A9D8F5" fill-opacity="0.7"/><rect x="40" y="52" width="60" height="36" fill="#E0568C"/>
        <line x1="100" y1="52" x2="100" y2="160" stroke="#4A3B48" stroke-width="2"/><line x1="40" y1="88" x2="160" y2="88" stroke="#4A3B48" stroke-width="2"/><line x1="40" y1="124" x2="160" y2="124" stroke="#4A3B48" stroke-width="2"/>
        ${[[70,38,1,2,'#E0568C'],[22,70,1,3,'#2A6FA5'],[64,200,1,2,'#E0568C'],[104,200,1,3,'#2A6FA5'],[150,200,1,6,'#4A3B48']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-8}" y1="${y}" x2="${x+8}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+14}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
        <text x="84" y="204" text-anchor="middle" fill="#4A3B48">×</text><text x="127" y="204" text-anchor="middle" fill="#4A3B48">=</text>
        <text x="100" y="176" text-anchor="middle" fill="#4A3B48" font-size="12">overlap = 1 of 6 pieces</text>
        <text x="270" y="18" text-anchor="middle" fill="#4A3B48">Keep · Change · Flip</text>
        ${[[200,90,3,4,'#2FA97A'],[290,90,1,2,'#2A6FA5'],[200,166,3,4,'#2FA97A'],[290,166,2,1,'#2A6FA5']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+15}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
        <text x="245" y="96" text-anchor="middle" fill="#E0568C" font-size="20">÷</text><text x="245" y="172" text-anchor="middle" fill="#E0568C" font-size="20">×</text>
        <text x="196" y="56" text-anchor="middle" fill="#2FA97A" font-size="13">Keep</text><text x="252" y="56" text-anchor="middle" fill="#E0568C" font-size="13">Change</text><text x="305" y="56" text-anchor="middle" fill="#2A6FA5" font-size="13">Flip</text>
        <line x1="200" y1="112" x2="200" y2="140" stroke="#2FA97A" stroke-width="2.5" marker-end="url(#fm-c-g)"/>
        <line x1="245" y1="112" x2="245" y2="140" stroke="#E0568C" stroke-width="2.5" marker-end="url(#fm-c-r)"/>
        <path d="M308 90 Q345 128 308 166" stroke="#2A6FA5" stroke-width="2.5" fill="none" marker-end="url(#fm-c-b)"/>
        <text x="270" y="208" text-anchor="middle" fill="#4A3B48" font-size="12">then multiply: 6 ÷ 4 = 1½</text>
      </svg>`,
      facts: [
        '"<b>of</b>" means <b>×</b>: ' + N.fracHtml(3, 4) + ' of 24 = 24 ÷ 4 × 3 = 18',
        '<b>Multiply</b>: tops × tops, bottoms × bottoms — <b>no</b> common denominator needed',
        '<b>Divide</b>: <b>Keep</b> the first, <b>Change</b> ÷ to ×, <b>Flip</b> the second',
        'Whole number = over 1: 5 = ' + over1(5),
        'Mixed → improper first: 1' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(3, 2),
        'Dividing by a fraction less than 1 makes the answer <b>bigger</b>',
      ],
      steps: [
        '<b>Fraction of an amount</b>: say "divide by the bottom, multiply by the top". ' + N.fracHtml(2, 5) + ' of 30: 30 ÷ 5 = 6, then 6 × 2 = 12.',
        '<b>Multiply</b>: say "tops × tops, bottoms × bottoms, then simplify". ' + N.fracHtml(2, 3) + ' × ' + N.fracHtml(3, 4) + ' = ' + N.fracHtml(6, 12) + ' = ' + N.fracHtml(1, 2) + '.',
        '<b>Divide</b>: say "<b>Keep</b> the first fraction, <b>Change</b> ÷ to ×, <b>Flip</b> the second fraction", then multiply as usual. ' + N.fracHtml(3, 4) + ' ÷ ' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(3, 4) + ' × ' + over1(2) + ' = ' + N.fracHtml(6, 4) + ' = 1' + N.fracHtml(1, 2) + '.',
        'Ask "<b>Any whole numbers or mixed numbers?</b>" Whole numbers go over 1: 5 = ' + over1(5) + '. Mixed numbers become improper: 2' + N.fracHtml(1, 3) + ' = ' + N.fracHtml(7, 3) + '.',
        'Always ask "<b>Can I simplify?</b>" at the end (and write top-heavy answers as mixed numbers).',
      ],
      examples: [
        { q: N.fracHtml(3, 4) + ' of 24',
          visual: `<svg viewBox="0 0 360 120" width="360" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${[0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=>`<circle cx="${90+c*26}" cy="${20+r*26}" r="10" fill="${r<3?'#F9A8C9':'#fff'}" stroke="${r<3?'#E0568C':'#4A3B48'}" stroke-width="2"/>`).join('')+`<text x="62" y="${25+r*26}" text-anchor="end" fill="${r<3?'#E0568C':'#4A3B48'}">${r<3?'6 ✓':'6'}</text>`).join('')}
            <text x="300" y="60" text-anchor="middle" fill="#4A3B48" font-size="12">24 ÷ 4 = 6 a row</text><text x="300" y="78" text-anchor="middle" fill="#E0568C" font-size="12">3 rows = 18</text>
          </svg>`,
          working: ['<i>Picture:</i> 24 slices of pizza shared into 4 equal rows; I take 3 of the rows.', '1. Does "of" mean ×? <b>Yes.</b> So divide by the bottom, multiply by the top.', '2. 24 ÷ 4 = 6 (one quarter is 6 slices).', '3. 6 × 3 = 18 (three quarters).'], a: '18' },
        { q: N.fracHtml(2, 5) + ' × ' + N.fracHtml(3, 4),
          visual: `<svg viewBox="0 0 360 150" width="360" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>`<rect x="${80+c*30}" y="${16+r*28}" width="30" height="28" fill="${c<2&&r<3?'#E0568C':c<2?'#F9A8C9':r<3?'#A9D8F5':'#fff'}" stroke="#4A3B48" stroke-width="2"/>`).join('')).join('')}
            <text x="110" y="140" text-anchor="middle" fill="#E0568C">2 of 5 columns</text><text x="54" y="62" text-anchor="end" fill="#2A6FA5">3 of 4</text><text x="54" y="78" text-anchor="end" fill="#2A6FA5">rows</text>
            <text x="298" y="60" text-anchor="middle" fill="#4A3B48" font-size="12">overlap: 6 cells</text><text x="298" y="78" text-anchor="middle" fill="#4A3B48" font-size="12">out of 20</text>
          </svg>`,
          working: ['<i>Picture:</i> a pizza cut into 5 strips one way and 4 strips the other way — 20 pieces. Take 2 strips of the 3 rows.', '1. Do I need the same bottoms? <b>No</b>, this is ×.', '2. Tops × tops: 2 × 3 = 6. Bottoms × bottoms: 5 × 4 = 20 → ' + N.fracHtml(6, 20), '3. Can I simplify? <b>Yes</b>, ÷ 2 top and bottom: ' + N.fracHtml(3, 10)], a: N.fracHtml(3, 10) },
        { q: '6 ÷ ' + N.fracHtml(3, 4),
          visual: `<svg viewBox="0 0 360 116" width="360" height="116" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="15" font-weight="700">
            <defs><marker id="fm-e3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#2A6FA5"/></marker></defs>
            ${[[60,46,6,1,'#2FA97A'],[150,46,3,4,'#2A6FA5'],[220,46,6,1,'#2FA97A'],[310,46,4,3,'#2A6FA5']].map(([x,y,n,d,c])=>`<text x="${x}" y="${y-3}" text-anchor="middle" fill="${c}">${n}</text><line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y}" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+16}" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
            <text x="105" y="52" text-anchor="middle" fill="#E0568C" font-size="20">÷</text><text x="265" y="52" text-anchor="middle" fill="#E0568C" font-size="20">×</text>
            <text x="185" y="52" text-anchor="middle" fill="#4A3B48" font-size="18">→</text>
            <text x="60" y="18" text-anchor="middle" fill="#2FA97A" font-size="12">Keep</text><text x="60" y="92" text-anchor="middle" fill="#2FA97A" font-size="11">(6 is 6 over 1)</text><text x="265" y="18" text-anchor="middle" fill="#E0568C" font-size="12">Change</text><text x="310" y="18" text-anchor="middle" fill="#2A6FA5" font-size="12">Flip</text>
            <text x="232" y="92" text-anchor="middle" fill="#4A3B48" font-size="12">tops: 6 × 4 = 24 &nbsp; bottoms: 1 × 3 = 3</text><text x="232" y="110" text-anchor="middle" fill="#2FA97A" font-size="13">24 ÷ 3 = 8</text>
          </svg>`,
          working: ['<i>Picture:</i> 6 whole pizzas. How many three-quarter-pizza servings fit?', '1. Is it dividing by a fraction? <b>Yes</b>, so Keep, Change, Flip.', '2. Keep the 6 (write it as ' + over1(6) + '). Change ÷ to ×. Flip ' + N.fracHtml(3, 4) + ' to ' + N.fracHtml(4, 3) + '.', '3. Multiply: ' + over1(6) + ' × ' + N.fracHtml(4, 3) + ' = ' + N.fracHtml(24, 3), '4. Simplify: 24 ÷ 3 = 8'], a: '8' },
        { q: N.fracHtml(2, 3) + ' ÷ ' + N.fracHtml(4, 5), working: ['<i>Picture:</i> I have two-thirds of a pizza. How many four-fifths-of-a-pizza servings fit? Less than one!', '1. Dividing by a fraction? <b>Yes</b> → Keep, Change, Flip.', '2. Keep ' + N.fracHtml(2, 3) + ', change to ×, flip ' + N.fracHtml(4, 5) + ' to ' + N.fracHtml(5, 4) + '.', '3. Tops: 2 × 5 = 10. Bottoms: 3 × 4 = 12 → ' + N.fracHtml(10, 12), '4. Can I simplify? <b>Yes</b>, ÷ 2: ' + N.fracHtml(5, 6)], a: N.fracHtml(5, 6) },
        { q: '1' + N.fracHtml(1, 2) + ' × ' + N.fracHtml(2, 3), working: ['<i>Picture:</i> one and a half pizzas, and I want two-thirds of that.', '1. Any mixed numbers? <b>Yes</b>, so change it first: 1' + N.fracHtml(1, 2) + ' = ' + N.fracHtml(3, 2) + ' (2 halves + 1 half).', '2. Same bottoms needed? <b>No</b>, it is ×. Tops: 3 × 2 = 6. Bottoms: 2 × 3 = 6 → ' + N.fracHtml(6, 6), '3. Can I simplify? <b>Yes</b>: 6 ÷ 6 = 1 whole.'], a: '1' },
        { q: 'For Matariki kites, Harper has ' + N.fracHtml(3, 4) + ' m of ribbon and cuts it into pieces ' + N.fracHtml(1, 8) + ' m long. How many pieces does she get?', working: ['<i>Picture:</i> like asking how many eighth-slices fit into three quarters of a pizza.', '1. Is this "how many fit"? <b>Yes</b>, so it is ÷: ' + N.fracHtml(3, 4) + ' ÷ ' + N.fracHtml(1, 8), '2. Keep ' + N.fracHtml(3, 4) + ', change to ×, flip ' + N.fracHtml(1, 8) + ' to ' + over1(8) + '.', '3. Tops: 3 × 8 = 24. Bottoms: 4 × 1 = 4 → ' + N.fracHtml(24, 4), '4. Simplify: 24 ÷ 4 = 6'], a: '6 pieces' },
      ],
      tips: [
        'No common denominator needed for × or ÷. That is only for + and −.',
        'Only flip the <b>second</b> fraction (the one you are dividing by). Never flip the first.',
        'Dividing by a fraction less than 1 makes the answer <b>bigger</b>. If 6 ÷ ' + N.fracHtml(1, 2) + ' gave you 3, you multiplied by mistake.',
        'You can cancel before multiplying: in ' + N.fracHtml(2, 3) + ' × ' + N.fracHtml(3, 4) + ' the 3s cancel, leaving ' + N.fracHtml(2, 4) + ' = ' + N.fracHtml(1, 2) + '.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
