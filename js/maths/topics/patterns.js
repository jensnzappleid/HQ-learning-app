/* Topic: Patterns & rules (linear sequences, nth-term rules, tables of values, matchstick patterns) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = N.fmt;

  /** rule text "3n + 2", "2n − 5", "n + 4", "−2n + 20" */
  const ruleText = (d, c) => {
    const nPart = d === 1 ? 'n' : d === -1 ? '−n' : `${f(d)}n`;
    if (c === 0) return nPart;
    return `${nPart} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
  };
  const seqText = (a, d, len) => Array.from({ length: len }, (_, i) => f(a + i * d)).join(', ') + ', …';
  const term = (a, d, n) => a + (n - 1) * d;
  /** the rule for term = a + (n−1)d  is  dn + (a − d) */
  const ruleOf = (a, d) => ({ d, c: a - d });

  /** four distinct rule choices including the right one */
  function ruleChoices(d, c) {
    const right = ruleText(d, c);
    const wrongs = new Set();
    const cands = [[c, d], [d, -c], [d, c + d], [d + 1, c], [d, c - d], [d - 1, c], [d, c + 1], [d, c - 1], [-d, c]];
    for (const [wd, wc] of cands) {
      if (wd === 0) continue;
      const w = ruleText(wd, wc);
      if (w !== right) wrongs.add(w);
      if (wrongs.size === 3) break;
    }
    const opts = R.shuffle([right, ...wrongs]);
    return { choices: opts, value: opts.indexOf(right) };
  }

  function tableHtml(rows) {
    const cell = (v, i) => `<${i === 0 ? 'th' : 'td'} style="padding:4px 12px;border:1px solid #C9B8F2;text-align:center;${i === 0 ? 'background:#F3EEFC' : ''}">${v}</${i === 0 ? 'th' : 'td'}>`;
    const body = rows.map((r) => `<tr>${r.map(cell).join('')}</tr>`).join('');
    return `<table style="border-collapse:collapse;margin:6px auto;font-size:16px">${body}</table>`;
  }

  function pickSeq(level) {
    // a = first term, d = common difference. Level 3 allows decreasing and negative starts.
    let d, a;
    if (level === 1) { d = R.chance(0.3) ? -R.pick([2, 3, 4, 5]) : R.int(2, 5); a = d > 0 ? R.int(1, 9) : R.int(16, 30); }
    else if (level === 2) { d = R.pick([2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -4, -5, -6]); a = d > 0 ? R.int(1, 15) : R.pick([R.int(5, 16), R.int(20, 45)]); }
    else { d = R.pick([3, 4, 6, 7, 8, 9, 11, 12, -3, -4, -6, -7, -8, -9]); a = d > 0 ? R.int(-12, 20) : R.pick([R.int(4, 20), R.int(25, 70)]); }
    return { a, d };
  }

  /* ---------- non-linear patterns: squares, doubling, triangular ---------- */
  const NONLIN = {
    square: {
      label: 'The <b>square numbers</b>: 1×1, 2×2, 3×3 … (n × n)',
      short: 'The square numbers (n × n)',
      term: (n, s) => n * n,
      why: (s) => ['Gaps: 4 − 1 = 3, 9 − 4 = 5, 16 − 9 = 7. The gaps are <b>not</b> the same, so it is not an "add the same each time" pattern.', 'Look again: 1 = 1 × 1, 4 = 2 × 2, 9 = 3 × 3, 16 = 4 × 4. These are the <b>square numbers</b>.'],
    },
    triangle: {
      label: 'Each gap grows by 1: <b>+2, then +3, then +4</b> … (the triangular numbers)',
      short: 'The gaps grow by 1 each time (+2, +3, +4 …)',
      term: (n, s) => (n * (n + 1)) / 2,
      why: (s) => ['Gaps: 3 − 1 = 2, 6 − 3 = 3, 10 − 6 = 4. The gaps are <b>not</b> the same — each gap is 1 bigger.', 'This is the <b>triangular number</b> pattern: add 2, then 3, then 4, then 5 …'],
    },
    double: {
      label: '<b>Double</b> the term before (× 2 each time)',
      short: 'Double the term before (× 2)',
      term: (n, s) => s * Math.pow(2, n - 1),
      why: (s) => [`Gaps: they get bigger and bigger, so it is not "add the same each time".`, `Try dividing instead: each term ÷ the one before = <b>2</b>. So it <b>doubles</b> every time.`],
    },
  };
  const NONLIN_CHOICES = ['The square numbers (n × n)', 'The gaps grow by 1 each time (+2, +3, +4 …)', 'Double the term before (× 2)', 'Add the same amount each time'];

  function nonLinear(level) {
    const kind = R.pick(level === 1 ? ['square', 'double', 'double', 'triangle'] : ['square', 'square', 'double', 'triangle', 'triangle']);
    const cfg = NONLIN[kind];
    const start = kind === 'double' ? R.pick(level === 1 ? [1, 2, 3, 5] : [2, 3, 4, 5, 6, 10]) : 1;
    const T = (n) => cfg.term(n, start);
    const shown = 4;
    const seq = [1, 2, 3, 4].map((n) => f(T(n))).join(', ') + ', …';
    const ask = R.pick(level === 3 ? ['next', 'rule', 'far', 'far'] : level === 2 ? ['next', 'next', 'rule', 'far'] : ['next', 'next', 'rule']);
    if (ask === 'rule') {
      const choices = R.shuffle(NONLIN_CHOICES);
      return {
        prompt: `Here is a pattern: <b>${seq}</b><br>Which rule describes it?`,
        answer: { type: 'choice', value: choices.indexOf(cfg.short), choices },
        hint: 'First check the gaps. If the gaps are not all the same, the pattern is not a "+ the same number" one — look for squaring, doubling, or growing gaps.',
        working: [...cfg.why(start), `Rule: <b>${cfg.label}</b>.`],
        finalAnswer: cfg.short,
        skill: 'non-linear',
      };
    }
    if (ask === 'next') {
      const ans = T(shown + 1);
      return {
        prompt: `Here is a pattern: <b>${seq}</b><br>What is the next term?`,
        answer: { type: 'number', value: ans },
        hint: 'The gaps are not all the same here. Look for a pattern in the numbers themselves: are they squares, or are they doubling, or are the gaps growing?',
        working: [...cfg.why(start), `Next term: ${kind === 'double' ? `${f(T(shown))} × 2` : kind === 'square' ? `${shown + 1} × ${shown + 1}` : `${f(T(shown))} + ${shown + 1}`} = <b>${f(ans)}</b>.`],
        finalAnswer: f(ans),
        skill: 'non-linear',
      };
    }
    const n = kind === 'double' ? R.int(6, level === 3 ? 10 : 8) : R.int(6, level === 3 ? 12 : 8);
    const ans = T(n);
    return {
      prompt: `Here is a pattern: <b>${seq}</b><br>What is the ${n}th term?`,
      answer: { type: 'number', value: ans },
      hint: kind === 'square' ? `Each term is its position times itself. Term ${n} = ${n} × ${n}.` : kind === 'double' ? `Keep doubling until you reach term ${n}.` : `Keep adding one more each time (+2, +3, +4 …) until you reach term ${n}.`,
      working: [
        ...cfg.why(start),
        kind === 'square' ? `Term ${n} = ${n} × ${n} = <b>${f(ans)}</b>.`
          : kind === 'double' ? `Doubling from ${f(start)}: ${Array.from({ length: Math.min(n, 8) }, (_, i) => f(T(i + 1))).join(', ')}${n > 8 ? ', …' : ''}.`
          : `Keep adding: ${Array.from({ length: Math.min(n, 8) }, (_, i) => f(T(i + 1))).join(', ')}${n > 8 ? ', …' : ''}.`,
        `The ${n}th term is <b>${f(ans)}</b>.`,
      ],
      finalAnswer: f(ans),
      skill: 'non-linear',
    };
  }

  /* ---------- term-to-term rule vs position-to-term rule ---------- */
  function ruleType(level) {
    const { a, d } = pickSeq(level === 1 ? 1 : level);
    const r = ruleOf(a, d);
    const seq = seqText(a, d, 4);
    const t2t = d > 0 ? `Add ${d} each time` : `Subtract ${Math.abs(d)} each time`;
    const p2t = ruleText(r.d, r.c);
    const askPos = R.chance(0.5);
    if (askPos) {
      const wrongs = [t2t, `Start at ${f(a)}, then ${d > 0 ? 'add' : 'subtract'} ${Math.abs(d)}`, ruleText(d, a)];
      const opts = R.shuffle([p2t, ...wrongs.filter((w) => w !== p2t).slice(0, 3)]);
      return {
        prompt: `Here is a pattern: <b>${seq}</b><br>Which one is the <b>position-to-term</b> rule (the one with n in it)?`,
        answer: { type: 'choice', value: opts.indexOf(p2t), choices: opts },
        hint: 'A position-to-term rule uses <b>n</b>, the position number. You put n in and the term comes out — no need to know the term before.',
        working: [
          `A <b>term-to-term</b> rule tells you how to get the <b>next</b> term: here that is "${t2t.toLowerCase()}".`,
          `A <b>position-to-term</b> rule uses <b>n</b> so you can jump straight to any term.`,
          `The difference is ${f(d)}, so it starts with ${f(d)}n. n = 1 gives ${f(d)}, but the first term is ${f(a)}, so ${r.c < 0 ? 'subtract' : 'add'} ${Math.abs(r.c)}.`,
          `Position-to-term rule: <b>${p2t}</b>.`,
        ],
        finalAnswer: p2t,
        skill: 'rule-type',
      };
    }
    const wrongs = [p2t, `${d > 0 ? 'Add' : 'Subtract'} ${Math.abs(d) + 1} each time`, `Multiply by ${Math.max(2, Math.abs(d))} each time`];
    const opts = R.shuffle([t2t, ...wrongs.filter((w) => w !== t2t).slice(0, 3)]);
    return {
      prompt: `Here is a pattern: <b>${seq}</b><br>Which one is the <b>term-to-term</b> rule (how you get from one term to the next)?`,
      answer: { type: 'choice', value: opts.indexOf(t2t), choices: opts },
      hint: 'A term-to-term rule says what you do to <b>one term to get the next one</b>. Look at the gap between the terms.',
      working: [
        `Gap: ${f(term(a, d, 2))} − ${f(a)} = ${f(d)}, and it is the same every time.`,
        `So to get the next term you <b>${d > 0 ? 'add ' + d : 'subtract ' + Math.abs(d)}</b>. That is the <b>term-to-term</b> rule.`,
        `(${p2t} is the <b>position-to-term</b> rule — it uses n instead.)`,
        `Term-to-term rule: <b>${t2t}</b>.`,
      ],
      finalAnswer: t2t,
      skill: 'rule-type',
    };
  }

  /* ---------- is this number a term in the sequence? (level 3) ---------- */
  function isTerm() {
    const d = R.pick([3, 4, 5, 6, 7, 8, 9]);
    const a = R.int(1, 12);
    const r = ruleOf(a, d);
    const seq = seqText(a, d, 4);
    const n = R.int(7, 30);
    const onSeq = term(a, d, n);
    const yes = R.chance(0.5);
    const target = yes ? onSeq : onSeq + R.int(1, d - 1);
    const leftover = target - r.c;
    return {
      prompt: `Here is a pattern: <b>${seq}</b><br>Is <b>${f(target)}</b> a term in this pattern?`,
      answer: { type: 'choice', value: yes ? 0 : 1, choices: ['Yes', 'No'] },
      hint: `Find the rule, set it equal to ${f(target)}, and solve for n. If n is a whole number it <b>is</b> a term.`,
      working: [
        `The difference is ${d}, so the rule is <b>${ruleText(r.d, r.c)}</b>.`,
        `Set the rule equal to ${f(target)}: ${ruleText(r.d, r.c)} = ${f(target)}.`,
        ...(r.c === 0 ? [] : [`${r.c < 0 ? 'Add ' + Math.abs(r.c) + ' to both sides' : 'Subtract ' + r.c + ' from both sides'}: ${d}n = ${f(leftover)}.`]),
        `Divide by ${d}: n = ${f(leftover)} ÷ ${d} = ${yes ? f(n) : N.round(leftover / d, 2)}.`,
        yes ? `n = ${f(n)} is a <b>whole number</b>, so ${f(target)} <b>is</b> the ${n}th term.` : `That is <b>not a whole number</b>, so ${f(target)} is <b>not</b> a term in this pattern.`,
      ],
      finalAnswer: yes ? `Yes — it is the ${n}th term` : 'No',
      skill: 'is-term',
    };
  }

  function calc(level) {
    const types = level === 1 ? ['next', 'next', 'nth', 'rule', 'table', 'match', 'nonlin', 'nonlin', 'ruletype']
      : level === 2 ? ['next', 'nth', 'nth', 'rule', 'rule', 'table', 'match', 'nonlin', 'nonlin', 'ruletype', 'ruletype']
      : ['nth', 'rule', 'findn', 'findn', 'table', 'match', 'nonlin', 'nonlin', 'ruletype', 'isterm', 'isterm'];
    const t = R.pick(types);
    if (t === 'nonlin') return nonLinear(level);
    if (t === 'ruletype') return ruleType(level);
    if (t === 'isterm') return isTerm();
    const { a, d } = pickSeq(level);
    const seq = seqText(a, d, 4);
    const diffWord = d > 0 ? `adds ${d}` : `subtracts ${Math.abs(d)}`;

    if (t === 'next') {
      const ans = term(a, d, 5);
      return {
        prompt: `Here is a number pattern: <b>${seq}</b><br>What is the next term?`,
        answer: { type: 'number', value: ans },
        hint: `Look at the gap between the terms. Each term ${diffWord}.`,
        working: [
          `Find the difference: ${f(term(a, d, 2))} − ${f(a)} = ${f(d)}.`,
          `Each term ${diffWord}.`,
          `Next term: ${f(term(a, d, 4))} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = <b>${f(ans)}</b>.`,
        ],
        finalAnswer: f(ans),
        skill: 'next-term',
      };
    }
    if (t === 'nth') {
      const n = level === 1 ? R.pick([6, 7, 8]) : level === 2 ? R.pick([10, 10, 12, 15]) : R.pick([10, 20, 25, 50, 100]);
      const ans = term(a, d, n);
      const r = ruleOf(a, d);
      return {
        prompt: `Here is a number pattern: <b>${seq}</b><br>What is the ${n}th term?`,
        answer: { type: 'number', value: ans },
        hint: level === 1 ? `Keep ${d > 0 ? 'adding' : 'subtracting'} ${Math.abs(d)} until you reach term ${n}, or use: first term + ${n - 1} lots of the difference.` : `Rule: term = ${ruleText(r.d, r.c)}. Put n = ${n} into the rule.`,
        working: [
          `The difference is ${f(d)}, so the rule is <b>${ruleText(r.d, r.c)}</b>.`,
          `Check: n = 1 gives ${f(r.d)} × 1 ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = ${f(a)}. ✓`,
          `n = ${n}: ${f(r.d)} × ${n} ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = ${f(r.d * n)} ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = <b>${f(ans)}</b>.`,
        ],
        finalAnswer: f(ans),
        skill: 'nth-term',
      };
    }
    if (t === 'rule') {
      const r = ruleOf(a, d);
      const ch = ruleChoices(r.d, r.c);
      return {
        prompt: `Here is a number pattern: <b>${seq}</b><br>Which rule gives the nth term?`,
        answer: { type: 'choice', value: ch.value, choices: ch.choices },
        hint: `The difference between terms is the number in front of n. Then check what you add or subtract to get the first term.`,
        working: [
          `Difference: ${f(term(a, d, 2))} − ${f(a)} = ${f(d)}, so the rule starts with <b>${f(d)}n</b>.`,
          `When n = 1, ${f(d)}n = ${f(d)}. The first term is ${f(a)}, so we need ${f(a)} − (${f(d)}) = ${f(r.c)}.`,
          `Rule: <b>${ruleText(r.d, r.c)}</b>.`,
        ],
        finalAnswer: ruleText(r.d, r.c),
        skill: 'rule',
      };
    }
    if (t === 'findn') {
      const n = R.int(8, 30);
      const target = term(a, d, n);
      const r = ruleOf(a, d);
      return {
        prompt: `Here is a number pattern: <b>${seq}</b><br>Which term is equal to ${f(target)}? (Give the value of n.)`,
        answer: { type: 'number', value: n },
        hint: `Rule: ${ruleText(r.d, r.c)}. Solve ${ruleText(r.d, r.c)} = ${f(target)}.`,
        working: [
          `The rule is ${ruleText(r.d, r.c)}.`,
          `Set it equal to ${f(target)}: ${ruleText(r.d, r.c)} = ${f(target)}.`,
          `${r.c < 0 ? 'Add' : 'Subtract'} ${Math.abs(r.c)}: ${f(r.d)}n = ${f(target - r.c)}.`,
          `Divide by ${f(r.d)}: n = <b>${n}</b>.`,
        ],
        finalAnswer: `n = ${n}`,
        skill: 'find-n',
      };
    }
    if (t === 'table') {
      const r = ruleOf(a, d);
      const rows = [['n', 1, 2, 3, 4], ['term', f(term(a, d, 1)), f(term(a, d, 2)), f(term(a, d, 3)), f(term(a, d, 4))]];
      const visual = tableHtml(rows);
      const askRule = level >= 2 && R.chance(0.4);
      if (askRule) {
        const ch = ruleChoices(r.d, r.c);
        return {
          visual,
          prompt: `The table shows a pattern. Which rule connects n and the term?`,
          answer: { type: 'choice', value: ch.value, choices: ch.choices },
          hint: 'How much does the term go up each time n goes up by 1? That number goes in front of n.',
          working: [
            `Each time n goes up by 1, the term changes by ${f(d)}, so the rule has <b>${f(d)}n</b>.`,
            `n = 1: ${f(d)} × 1 = ${f(d)}, but the term is ${f(a)}, so ${r.c < 0 ? 'subtract' : 'add'} ${Math.abs(r.c)}.`,
            `Rule: <b>${ruleText(r.d, r.c)}</b>.`,
          ],
          finalAnswer: ruleText(r.d, r.c),
          skill: 'table',
        };
      }
      const n = level === 1 ? R.pick([5, 6, 7]) : level === 2 ? R.pick([8, 10, 12]) : R.pick([15, 20, 30, 50]);
      const ans = term(a, d, n);
      return {
        visual,
        prompt: `The table shows a pattern. What is the term when n = ${n}?`,
        answer: { type: 'number', value: ans },
        hint: `The term changes by ${f(d)} each time n goes up by 1. Rule: ${ruleText(r.d, r.c)}.`,
        working: [
          `The term changes by ${f(d)} each step, so the rule is <b>${ruleText(r.d, r.c)}</b>.`,
          `n = ${n}: ${f(r.d)} × ${n} ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = <b>${f(ans)}</b>.`,
        ],
        finalAnswer: f(ans),
        skill: 'table',
      };
    }
    // matchstick / tile patterns described in words
    const shape = R.pick([
      { name: 'squares', unit: 'matchsticks', first: 4, add: 3 },
      { name: 'triangles', unit: 'matchsticks', first: 3, add: 2 },
      { name: 'hexagons', unit: 'matchsticks', first: 6, add: 5 },
      { name: 'pentagons', unit: 'matchsticks', first: 5, add: 4 },
      { name: 'L-shapes', unit: 'tiles', first: 3, add: 2 },
      { name: 'T-shapes', unit: 'tiles', first: 4, add: 3 },
      { name: 'crosses', unit: 'tiles', first: 5, add: 4 },
    ]);
    const n = level === 1 ? R.int(4, 7) : level === 2 ? R.int(8, 15) : R.int(20, 60);
    const ans = shape.first + (n - 1) * shape.add;
    const r = ruleOf(shape.first, shape.add);
    return {
      prompt: `A row of ${shape.name} is made from ${shape.unit}. Pattern 1 uses ${shape.first} ${shape.unit}, and each new shape in the row adds ${shape.add} more. How many ${shape.unit} are in pattern ${n}?`,
      answer: { type: 'number', value: ans },
      hint: `Pattern ${n} has ${n - 1} extra shapes after the first one. Each extra shape adds ${shape.add}.`,
      working: [
        `Rule: ${shape.first} + (n − 1) × ${shape.add}, which simplifies to <b>${ruleText(r.d, r.c)}</b>.`,
        `n = ${n}: ${shape.add} × ${n} ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = ${shape.add * n} ${r.c < 0 ? '−' : '+'} ${Math.abs(r.c)} = <b>${ans}</b>.`,
      ],
      finalAnswer: `${ans} ${shape.unit}`,
      skill: 'matchstick',
    };
  }

  function word(level) {
    const t = level === 3
      ? R.pick(['save', 'taxi', 'plant', 'club', 'cool', 'tank', 'tiles3', 'tiles3', 'sameWeek3', 'sameWeek3'])
      : R.pick(['save', 'save', 'taxi', 'plant', 'club', 'cool', 'cool', 'tank']);
    const askRule = level === 3 && R.chance(0.35);
    if (t === 'tiles3') {
      // work backwards: given the rule in words and a term value, find which step it is
      const per = R.pick([3, 4, 5, 6]), start = R.pick([2, 3, 4, 5]);
      const n = R.int(8, 25), tiles = per * n + start;
      const shape = R.pick(['a mosaic path at the marae', 'a tile pattern on the school wall', 'a pattern of pavers', 'a border of tiles']);
      return {
        prompt: `In ${shape}, step 1 uses ${per + start} tiles and every step after that uses ${per} more tiles. Which step uses ${tiles} tiles?`,
        answer: { type: 'number', value: n, unit: 'step' },
        hint: `The rule is ${per}n + ${start}. Take the ${start} off ${tiles} first, then see how many lots of ${per} are left.`,
        working: [
          `Step 1 has ${per + start} tiles and each step adds ${per}, so the rule is <b>${per}n + ${start}</b>.`,
          `Check step 1: ${per} × 1 + ${start} = ${per + start} ✓`,
          `Now work backwards: ${tiles} − ${start} = ${tiles - start}.`,
          `${tiles - start} ÷ ${per} = ${n}.`,
          `It is <b>step ${n}</b>.`,
        ],
        finalAnswer: `step ${n}`,
      };
    }
    if (t === 'sameWeek3') {
      const per1 = R.pick([2, 3, 4, 5]), gap = R.pick([1, 2, 3]);
      const per2 = per1 + gap, weeks = R.int(3, 12);
      const start2 = R.pick([0, 5, 10]), start1 = start2 + gap * weeks;
      const total = start1 + per1 * weeks;
      const a = R.pick(['Harper', 'Mia', 'Aroha']), b = R.pick(['Tane', 'Liam', 'Ruby']);
      return {
        prompt: `${a} has $${start1} and saves $${per1} a week. ${b} has $${start2} and saves $${per2} a week. After how many weeks will they have the same amount of money?`,
        answer: { type: 'number', value: weeks, unit: 'weeks' },
        hint: `${b} starts $${start1 - start2} behind but gains $${gap} on ${a} every week. How many weeks to close the gap?`,
        working: [
          `${a}'s pattern: ${start1}, ${start1 + per1}, ${start1 + 2 * per1}, … (up $${per1} a week).`,
          `${b}'s pattern: ${start2}, ${start2 + per2}, ${start2 + 2 * per2}, … (up $${per2} a week).`,
          `The gap starts at ${start1} − ${start2} = $${start1 - start2}.`,
          `${b} closes $${per2} − $${per1} = $${gap} of the gap each week.`,
          `${start1 - start2} ÷ ${gap} = ${weeks} weeks. (Both then have $${total}.)`,
          `<b>${weeks} weeks</b>.`,
        ],
        finalAnswer: `${weeks} weeks`,
      };
    }
    if (t === 'cool') {
      const start = R.int(6, 20), drop = R.pick([2, 3, 4, 5]);
      const hours = level === 1 ? R.int(2, 4) : level === 2 ? R.int(4, 8) : R.int(6, 14);
      const place = R.pick(['Ohakune', 'Queenstown', 'Tekapo', 'Waiouru']);
      const ans = start - drop * hours;
      if (askRule) {
        const ch = ruleChoices(-drop, start);
        return {
          prompt: `At 6 pm it is ${start}°C in ${place}. The temperature drops ${drop}°C every hour. Which rule gives the temperature after n hours?`,
          answer: { type: 'choice', value: ch.value, choices: ch.choices },
          hint: 'Going <b>down</b> means the number in front of n is <b>negative</b>. The starting temperature is added on.',
          working: [
            `It drops ${drop}°C every hour, so after n hours it has dropped ${drop}n. That is <b>−${drop}n</b>.`,
            `It started at ${start}°C, so add ${start}.`,
            `Check n = 1: −${drop} × 1 + ${start} = ${start - drop}°C. ✓`,
            `Rule: <b>${ruleText(-drop, start)}</b>.`,
          ],
          finalAnswer: ruleText(-drop, start),
        };
      }
      return {
        prompt: `At 6 pm it is ${start}°C in ${place}. The temperature drops ${drop}°C every hour. What is the temperature after ${hours} hours?`,
        answer: { type: 'number', value: ans, unit: '°C' },
        hint: `Each hour takes ${drop} off. Work out ${drop} × ${hours}, then subtract it from ${start}. The answer can go below zero.`,
        working: [
          `Total drop: ${drop} × ${hours} = ${drop * hours}°C.`,
          `Start at ${start} and take ${drop * hours} off: ${start} − ${drop * hours} = <b>${f(ans)}°C</b>.`,
          ans < 0 ? `The pattern goes past zero into <b>negative</b> temperatures.` : `Still above zero.`,
        ],
        finalAnswer: `${f(ans)}°C`,
      };
    }
    if (t === 'tank') {
      const per = R.pick([3, 4, 5, 6, 8, 10]);
      const steps = level === 1 ? R.int(2, 5) : level === 2 ? R.int(5, 10) : R.int(8, 16);
      const start = per * (steps + R.int(1, 4));
      const left = start - per * steps;
      if (level === 3 && R.chance(0.5)) {
        return {
          prompt: `A water tank holds ${start} litres and loses ${per} litres every day. After how many days is it empty?`,
          answer: { type: 'number', value: start / per, unit: 'days' },
          hint: `Each day takes ${per} litres off. How many lots of ${per} are in ${start}?`,
          working: [`The pattern goes down ${per} each day: ${start}, ${start - per}, ${start - 2 * per}, …`, `Days until empty: ${start} ÷ ${per} = <b>${start / per} days</b>.`],
          finalAnswer: `${start / per} days`,
        };
      }
      return {
        prompt: `A water tank holds ${start} litres and loses ${per} litres every day. How many litres are left after ${steps} days?`,
        answer: { type: 'number', value: left, unit: 'L' },
        hint: `This pattern goes <b>down</b> by ${per} each day. Work out ${per} × ${steps} and take it off ${start}.`,
        working: [`Lost in ${steps} days: ${per} × ${steps} = ${per * steps} litres.`, `${start} − ${per * steps} = <b>${left} litres</b>.`],
        finalAnswer: `${left} L`,
      };
    }
    if (t === 'save') {
      const start = R.pick([0, 5, 10, 15, 20, 25]), per = level === 1 ? R.pick([2, 3, 5]) : R.pick([4, 6, 7, 8, 12, 15]);
      const weeks = level === 1 ? R.int(3, 6) : level === 2 ? R.int(8, 12) : R.int(15, 30);
      const who = R.pick(['Harper', 'Mia', 'Tane', 'Aroha', 'Liam']);
      const item = R.pick(['a new netball', 'a skateboard', 'concert tickets', 'a phone case', 'a surfboard']);
      const total = start + per * weeks;
      if (askRule) {
        const ch = ruleChoices(per, start);
        return {
          prompt: `${who} has $${start} and saves $${per} every week for ${item}. Which rule gives the total saved after n weeks?`,
          answer: { type: 'choice', value: ch.value, choices: ch.choices },
          hint: 'The amount saved each week goes in front of n. The starting money is added on.',
          working: [`Each week adds $${per}, so that is ${per}n.`, `Start with $${start}, so add ${start}.`, `Rule: <b>${ruleText(per, start)}</b>.`],
          finalAnswer: ruleText(per, start),
        };
      }
      return {
        prompt: `${who} has $${start} and saves $${per} every week for ${item}. How much will ${who} have after ${weeks} weeks?`,
        answer: { type: 'number', value: total, unit: '$' },
        hint: `Total = starting money + ${per} × number of weeks.`,
        working: [`Saved in ${weeks} weeks: ${per} × ${weeks} = $${per * weeks}.`, `Add the starting money: ${start} + ${per * weeks} = <b>$${total}</b>.`],
        finalAnswer: `$${total}`,
      };
    }
    if (t === 'taxi') {
      const flag = R.pick([3, 4, 5, 6]), perKm = level === 1 ? 2 : R.pick([2, 3, 4]);
      const km = level === 1 ? R.int(3, 8) : level === 2 ? R.int(8, 20) : R.int(15, 45);
      const total = flag + perKm * km;
      if (level === 3 && R.chance(0.5)) {
        return {
          prompt: `A taxi in Wellington charges a $${flag} flag fee plus $${perKm} per km. A ride costs $${total}. How many km was the ride?`,
          answer: { type: 'number', value: km, unit: 'km' },
          hint: `Take off the flag fee first, then divide by the cost per km.`,
          working: [`Take off the flag fee: ${total} − ${flag} = ${total - flag}.`, `Divide by $${perKm} per km: ${total - flag} ÷ ${perKm} = <b>${km} km</b>.`],
          finalAnswer: `${km} km`,
        };
      }
      return {
        prompt: `A taxi in Wellington charges a $${flag} flag fee plus $${perKm} per km. How much does a ${km} km ride cost?`,
        answer: { type: 'number', value: total, unit: '$' },
        hint: `Cost = flag fee + ${perKm} × km.`,
        working: [`Distance cost: ${perKm} × ${km} = $${perKm * km}.`, `Add the flag fee: ${flag} + ${perKm * km} = <b>$${total}</b>.`],
        finalAnswer: `$${total}`,
      };
    }
    if (t === 'plant') {
      const h0 = R.int(4, 15), grow = level === 1 ? R.pick([2, 3]) : R.pick([2, 3, 4, 5]);
      const weeks = level === 1 ? R.int(2, 5) : level === 2 ? R.int(6, 10) : R.int(12, 25);
      const plant = R.pick(['sunflower', 'tomato plant', 'bean plant', 'kowhai seedling', 'flax plant']);
      const h = h0 + grow * weeks;
      if (askRule) {
        const ch = ruleChoices(grow, h0);
        return {
          prompt: `A ${plant} is ${h0} cm tall and grows ${grow} cm every week. Which rule gives its height in cm after n weeks?`,
          answer: { type: 'choice', value: ch.value, choices: ch.choices },
          hint: 'Growth per week goes in front of n. The starting height is added on.',
          working: [`Grows ${grow} cm each week: ${grow}n.`, `Starts at ${h0} cm: add ${h0}.`, `Rule: <b>${ruleText(grow, h0)}</b>.`],
          finalAnswer: ruleText(grow, h0),
        };
      }
      return {
        prompt: `A ${plant} is ${h0} cm tall and grows ${grow} cm every week. How tall will it be after ${weeks} weeks?`,
        answer: { type: 'number', value: h, unit: 'cm' },
        hint: `Height = starting height + ${grow} × weeks.`,
        working: [`Growth: ${grow} × ${weeks} = ${grow * weeks} cm.`, `Add the starting height: ${h0} + ${grow * weeks} = <b>${h} cm</b>.`],
        finalAnswer: `${h} cm`,
      };
    }
    // club: joining fee + weekly cost
    const join = R.pick([10, 15, 20, 25, 30]), per = R.pick([4, 5, 6, 8, 10]);
    const weeks = level === 1 ? R.int(3, 6) : level === 2 ? R.int(6, 12) : R.int(10, 40);
    const club = R.pick(['netball club', 'swim squad', 'surf club', 'coding club', 'touch rugby team']);
    const total = join + per * weeks;
    if (level === 3 && R.chance(0.5)) {
      return {
        prompt: `A ${club} charges a $${join} joining fee plus $${per} a week. So far someone has paid $${total} in total. How many weeks have they been a member?`,
        answer: { type: 'number', value: weeks, unit: 'weeks' },
        hint: 'Take off the joining fee, then divide by the weekly cost.',
        working: [`${total} − ${join} = ${total - join}.`, `${total - join} ÷ ${per} = <b>${weeks} weeks</b>.`],
        finalAnswer: `${weeks} weeks`,
      };
    }
    return {
      prompt: `A ${club} charges a $${join} joining fee plus $${per} a week. What is the total cost for ${weeks} weeks?`,
      answer: { type: 'number', value: total, unit: '$' },
      hint: `Total = joining fee + ${per} × weeks.`,
      working: [`Weekly cost: ${per} × ${weeks} = $${per * weeks}.`, `Add the joining fee: ${join} + ${per * weeks} = <b>$${total}</b>.`],
      finalAnswer: `$${total}`,
    };
  }

  HL.registerTopic({
    id: 'patterns', subject: 'maths', strand: 'algebra', order: 1,
    name: 'Patterns & rules', short: 'Patterns',
    blurb: 'Spot how a pattern grows, then write the rule so you can jump to any term.',
    example: '5, 8, 11, 14, … → rule 3n + 2 → 10th term = 32',
    animal: 'cat',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', PEACH = '#FFC79A', LAV = '#C9B8F2', MINT = '#A6E3B8';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // one matchstick: a peach stick with a rose head
      const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${PEACH}" stroke-width="4" stroke-linecap="round"/><circle cx="${x1 + (x2 - x1) * 0.14}" cy="${y1 + (y2 - y1) * 0.14}" r="2.6" fill="${ROSE}"/>`;
      // a row of n squares of side s (uses 3n + 1 sticks)
      const squares = (x0, y0, n, s) => { let o = ''; for (let i = 0; i < n; i++) { const x = x0 + i * s; o += stick(x, y0, x + s, y0) + stick(x, y0 + s, x + s, y0 + s); } for (let i = 0; i <= n; i++) o += stick(x0 + i * s, y0, x0 + i * s, y0 + s); return o; };
      // a strip of n triangles of side s (uses 2n + 1 sticks)
      const triangles = (x0, y0, n, s) => { const h = Math.round(s * 0.87); const V = (i) => [x0 + i * s / 2, i % 2 === 0 ? y0 + h : y0]; let o = ''; for (let i = 0; i <= n; i++) o += stick(...V(i), ...V(i + 1)); for (let i = 0; i < n; i++) o += stick(...V(i), ...V(i + 2)); return o; };
      // "+d" arc from (x1,y) to (x2,y) bulging downwards, label under the arc
      const arcDown = (x1, x2, y, label, col = ROSE) => `<path d="M${x1} ${y} q${(x2 - x1) / 2} 24 ${x2 - x1} 0" stroke="${col}" stroke-width="2.5" fill="none"/><polygon points="${x2},${y - 1} ${x2 - 8},${y + 7} ${x2 - 1},${y + 9}" fill="${col}"/><text x="${(x1 + x2) / 2}" y="${y + 26}" text-anchor="middle" fill="${col}">${label}</text>`;
      // "+d" arc from (x1,y) to (x2,y) bulging upwards, label above the arc
      const arcUp = (x1, x2, y, label, col = ROSE) => `<path d="M${x1} ${y} q${(x2 - x1) / 2} -24 ${x2 - x1} 0" stroke="${col}" stroke-width="2.5" fill="none"/><polygon points="${x2},${y + 1} ${x2 - 8},${y - 7} ${x2 - 1},${y - 9}" fill="${col}"/><text x="${(x1 + x2) / 2}" y="${y - 16}" text-anchor="middle" fill="${col}">${label}</text>`;
      // a row of big terms with "+d" arcs above them
      const termRow = (terms, y, d, lastCol) => { const xs = terms.map((_, i) => 40 + i * 70); return terms.map((t, i) => `<text x="${xs[i]}" y="${y}" text-anchor="middle" font-size="22" fill="${i === terms.length - 1 && lastCol ? lastCol : INK}">${t}</text>`).join('') + xs.slice(1).map((x, i) => arcUp(xs[i] + 16, x - 16, y - 20, d)).join(''); };
      // 2-row table: header row n = 1..k, second row values, with "+d" arcs underneath
      const table = (x0, y0, label, vals, d, rowLabel = 'Pattern n') => { const w = 55, h = 24, lw = 86; let o = `<rect x="${x0}" y="${y0}" width="${lw + w * vals.length}" height="${h * 2}" fill="#fff" stroke="${INK}" stroke-width="1.5"/><rect x="${x0}" y="${y0}" width="${lw + w * vals.length}" height="${h}" fill="${LAV}" opacity="0.55"/><line x1="${x0}" y1="${y0 + h}" x2="${x0 + lw + w * vals.length}" y2="${y0 + h}" stroke="${INK}" stroke-width="1.5"/><text x="${x0 + 6}" y="${y0 + 17}" fill="${INK}">${rowLabel}</text><text x="${x0 + 6}" y="${y0 + h + 17}" fill="${INK}">${label}</text>`; vals.forEach((v, i) => { const cx = x0 + lw + w * i + w / 2; o += `<line x1="${x0 + lw + w * i}" y1="${y0}" x2="${x0 + lw + w * i}" y2="${y0 + h * 2}" stroke="${INK}" stroke-width="1.5"/><text x="${cx}" y="${y0 + 17}" text-anchor="middle" fill="${INK}">${i + 1}</text><text x="${cx}" y="${y0 + h + 17}" text-anchor="middle" fill="${BLUE}">${v}</text>`; if (i) o += arcDown(cx - w + 12, cx - 12, y0 + h * 2 + 4, d); }); return o; };
      // a k × k array of dots, bottom row on baseY, centred on cx
      const dotSq = (cx, baseY, k, sp, col) => { let o = ''; for (let r = 0; r < k; r++) for (let c = 0; c < k; c++) o += `<circle cx="${cx - (k - 1) * sp / 2 + c * sp}" cy="${baseY - (k - 1) * sp + r * sp}" r="${sp * 0.33}" fill="${col}"/>`; return o; };
      // a triangle of dots: rows of 1, 2, 3 … k, bottom row on baseY
      const dotTri = (cx, baseY, k, sp, col) => { let o = ''; for (let r = 0; r < k; r++) { const cnt = r + 1; for (let c = 0; c < cnt; c++) o += `<circle cx="${cx - (cnt - 1) * sp / 2 + c * sp}" cy="${baseY - (k - 1) * sp + r * sp}" r="${sp * 0.33}" fill="${col}"/>`; } return o; };
      // four groups of dots with the count and the working underneath
      const dotRow = (title, draw, labels) => SVG(360, 140, `<text x="180" y="14" text-anchor="middle" fill="${INK}">${title}</text>` + [1, 2, 3, 4].map((k, i) => { const cx = [46, 130, 218, 312][i]; return draw(cx, 96, k) + `<text x="${cx}" y="118" text-anchor="middle" font-size="18" fill="${BLUE}">${labels[i][0]}</text><text x="${cx}" y="134" text-anchor="middle" font-size="13" fill="${ROSE}">${labels[i][1]}</text>`; }).join(''));
      return {
      what: '<p>A <b>linear pattern</b> goes up (or down) by the <b>same amount</b> each time, like climbing a staircase where every step is the same height. That step size is the <b>common difference</b>. Once you know it, you can write a <b>rule</b> using <b>n</b> (the position number) and jump straight to any term without counting all the way.</p>',
      visual: SVG(360, 220, `
        <text x="55" y="16" text-anchor="middle" fill="${INK}">Pattern 1</text><text x="145" y="16" text-anchor="middle" fill="${INK}">Pattern 2</text><text x="260" y="16" text-anchor="middle" fill="${INK}">Pattern 3</text>
        ${squares(40, 24, 1, 30)}${squares(115, 24, 2, 30)}${squares(215, 24, 3, 30)}
        <text x="55" y="76" text-anchor="middle" fill="${BLUE}">4 sticks</text><text x="145" y="76" text-anchor="middle" fill="${BLUE}">7 sticks</text><text x="260" y="76" text-anchor="middle" fill="${BLUE}">10 sticks</text>
        ${table(30, 88, 'Sticks', [4, 7, 10, 13], '+3')}
        <text x="180" y="190" text-anchor="middle" fill="${ROSE}">Up by 3 each time → the rule starts with 3n</text>
        <text x="180" y="212" text-anchor="middle" fill="${GREEN}">3 × 1 = 3, but pattern 1 has 4 → 3n + 1</text>`),
      facts: [
        '<b>Common difference</b> = 2nd term − 1st term (the size of each step)',
        'The difference goes <b>in front of n</b>: up by 3 each time → <b>3n</b>',
        'Then fix the start: 3n gives 3, 6, 9 … but the pattern is 5, 8, 11 … → 2 more → <b>3n + 2</b>',
        'To find the <b>nth term</b>, put n into the rule: 10th term of 3n + 2 = 3 × 10 + 2 = <b>32</b>',
        'Going <b>down</b> → <b>negative</b> difference: 20, 17, 14 → <b>−3n + 23</b>',
        'Always <b>check</b> the rule with n = 1 and n = 2',
        '<b>Term-to-term</b> rule = how to get the <b>next</b> term ("add 3 each time"). <b>Position-to-term</b> rule uses <b>n</b> ("3n + 2") and jumps straight to any term',
        'Not every pattern is linear: <b>squares</b> 1, 4, 9, 16 (n × n) &nbsp;·&nbsp; <b>doubling</b> 3, 6, 12, 24 (× 2) &nbsp;·&nbsp; <b>triangular</b> 1, 3, 6, 10 (+2, +3, +4 …)',
        '"Is 68 a term?" → <b>solve</b> 3n + 2 = 68. If n is a <b>whole number</b>, yes',
      ],
      steps: [
        'Ask: <b>"How much does it go up by each step?"</b> Find 2nd − 1st and check it is the same every time.',
        'That number goes <b>in front of n</b>: "It goes up by 3, so my rule starts with <b>3n</b>."',
        'Ask: <b>"What does 3n give for n = 1?"</b> 3 × 1 = 3. "The pattern starts at 5, so I need <b>+ 2</b>." Rule: <b>3n + 2</b>.',
        '<b>Check</b> it: n = 2 → 3 × 2 + 2 = 8. ✓',
        'To find any term, <b>put the position number in for n</b>: 10th term = 3 × 10 + 2 = 32.',
        'To find <b>which term</b> equals a number, <b>solve</b> the rule as an equation: 3n + 2 = 47 → 3n = 45 → n = 15.',
      ],
      examples: [
        { q: 'What is the next term in 4, 7, 10, 13, …?',
          working: ['<b>Picture:</b> a staircase — every step is the same height.', '1. How big is each step? 7 − 4 = <b>3</b>. Is it 3 every time? 10 − 7 = 3, 13 − 10 = 3. Yes!', '2. So the next step is 13 + 3.', '13 + 3 = 16'],
          a: '16',
          visual: SVG(360, 84, termRow(['4', '7', '10', '13', '16'], 66, '+3', GREEN)) },
        { q: 'Find the rule for 5, 8, 11, 14, …',
          working: ['<b>Picture:</b> a staircase with steps of 3 — that is the 3 times table, shifted.', '1. How big is each step? 8 − 5 = <b>3</b>. So the rule starts with <b>3n</b>.', '2. What does 3n give? 3, 6, 9, 12. How far is the pattern above that? 5 − 3 = <b>2</b> more, every time.', '3. So the rule is 3n + 2. Check n = 2: 3 × 2 + 2 = 8. Yes!'],
          a: '3n + 2',
          visual: SVG(360, 124, termRow(['5', '8', '11', '14'], 44, '+3') + `<text x="278" y="44" fill="${INK}">← pattern</text>` + [3, 6, 9, 12].map((v, i) => `<text x="${40 + i * 70}" y="104" text-anchor="middle" font-size="22" fill="${BLUE}">${v}</text><line x1="${40 + i * 70}" y1="86" x2="${40 + i * 70}" y2="56" stroke="${GREEN}" stroke-width="2.5"/><polygon points="${40 + i * 70},52 ${34 + i * 70},62 ${46 + i * 70},62" fill="${GREEN}"/><text x="${52 + i * 70}" y="76" fill="${GREEN}">+2</text>`).join('') + `<text x="278" y="104" fill="${BLUE}">← 3n</text><text x="180" y="122" text-anchor="middle" fill="${ROSE}">rule: 3n + 2</text>`) },
        { q: 'Find the 20th term of 7, 11, 15, 19, …',
          working: ['<b>Picture:</b> 20 steps up the staircase — too many to count, so use the rule.', '1. How big is each step? 11 − 7 = <b>4</b>. So the rule starts with 4n.', '2. 4 × 1 = 4, but the first term is 7. How much more? <b>3</b>. Rule: <b>4n + 3</b>.', '3. Put n = 20 in: 4 × 20 + 3 = 80 + 3.'],
          a: '83' },
        { q: 'The table shows a pattern. Which rule connects n and the term?',
          working: ['<b>Picture:</b> the top row is the step number, the bottom row is how high you are.', '1. How much does the bottom row go up each step? 10 − 6 = <b>4</b>. So it starts with 4n.', '2. 4 × 1 = 4, but the first term is 6. How much more? <b>2</b>.', '3. Rule: 4n + 2. Check n = 3: 4 × 3 + 2 = 14. Yes!'],
          a: '4n + 2',
          visual: SVG(360, 108, table(30, 8, 'Term', [6, 10, 14, 18], '+4', 'n') + `<text x="180" y="102" text-anchor="middle" fill="${ROSE}">up by 4 → 4n, then + 2 → 4n + 2</text>`) },
        { q: 'Triangles are made from matchsticks: pattern 1 uses 3, pattern 2 uses 5, pattern 3 uses 7. How many sticks does pattern 10 use?',
          working: ['<b>Picture:</b> each new triangle is a step that adds the same number of sticks.', '1. How many sticks does each new triangle add? 5 − 3 = <b>2</b>. So the rule starts with 2n.', '2. 2 × 1 = 2, but pattern 1 has 3 sticks. How much more? <b>1</b>. Rule: <b>2n + 1</b>.', '3. Put n = 10 in: 2 × 10 + 1 = 21.'],
          a: '21 matchsticks',
          visual: SVG(360, 92, `${triangles(30, 20, 1, 34)}${triangles(105, 20, 2, 34)}${triangles(215, 20, 3, 34)}<text x="47" y="16" text-anchor="middle" fill="${INK}">Pattern 1</text><text x="156" y="16" text-anchor="middle" fill="${INK}">Pattern 2</text><text x="283" y="16" text-anchor="middle" fill="${INK}">Pattern 3</text><text x="47" y="70" text-anchor="middle" fill="${BLUE}">3 sticks</text><text x="156" y="70" text-anchor="middle" fill="${BLUE}">5 sticks</text><text x="283" y="70" text-anchor="middle" fill="${BLUE}">7 sticks</text><text x="180" y="88" text-anchor="middle" fill="${ROSE}">+2 sticks each time → 2n + 1</text>`) },
        { q: 'Kiri has $20 and saves $6 every week for a netball hoodie that costs $80. After how many weeks can she buy it?',
          working: ['<b>Picture:</b> a savings staircase — she starts on step $20 and every week is a $6 step up.', '1. How much does it go up each week? <b>$6</b> → 6n. What does she start with? <b>$20</b> → rule: <b>6n + 20</b>.', '2. Which week reaches $80? Solve 6n + 20 = 80.', '6n = 80 − 20 = 60', 'n = 60 ÷ 6 = 10'],
          a: '10 weeks' },
        { q: 'Find the next two terms of 8, 5, 2, …',
          working: ['<b>Picture:</b> the same staircase, but you are walking <b>down</b> it. Every step drops the same amount.', '1. How big is each step? 5 − 8 = <b>−3</b>, so it goes <b>down 3</b> every time. Check: 2 − 5 = −3. Yes!', '2. Next term: 2 − 3 = −1. It goes <b>past zero</b> into the negatives — that is allowed.', '3. Then: −1 − 3 = −4.'],
          a: '−1 and −4',
          visual: SVG(360, 96, termRow(['8', '5', '2', '−1', '−4'], 62, '−3', GREEN) + `<text x="180" y="90" text-anchor="middle" fill="${ROSE}">going down 3 each time, straight past zero</text>`) },
        { q: 'What is the next term in 1, 4, 9, 16, … and what is the rule?',
          working: ['<b>Picture:</b> square tiles — 1 tile, then a 2 by 2 square, then 3 by 3, then 4 by 4.', '1. Are the gaps the same? 4 − 1 = 3, 9 − 4 = 5, 16 − 9 = 7. <b>No</b> — so it is not an "add the same each time" pattern.', '2. What are these numbers? 1 = 1×1, 4 = 2×2, 9 = 3×3, 16 = 4×4. They are the <b>square numbers</b>!', '3. So the next one is 5 × 5 = 25.'],
          a: '25 — the rule is n × n (square the position number)',
          visual: dotRow('The square numbers (n × n)', (cx, base, k) => dotSq(cx, base, k, 14, LAV), [['1', '1×1'], ['4', '2×2'], ['9', '3×3'], ['16', '4×4']]) },
        { q: 'What is the next term in 1, 3, 6, 10, …?',
          working: ['<b>Picture:</b> a triangle of netball players — each new row has <b>one more</b> player than the row above.', '1. Are the gaps the same? 3 − 1 = 2, 6 − 3 = 3, 10 − 6 = 4. <b>No</b> — each gap is 1 bigger than the one before.', '2. So the next gap must be <b>5</b>.', '3. Next term: 10 + 5 = 15. These are called the <b>triangular numbers</b>.'],
          a: '15',
          visual: dotRow('The triangular numbers', (cx, base, k) => dotTri(cx, base, k, 14, MINT), [['1', '1'], ['3', '1+2'], ['6', '1+2+3'], ['10', '1+2+3+4']]) },
        { q: 'What is the next term in 3, 6, 12, 24, …?',
          working: ['<b>Picture:</b> a cell that splits in two every hour — the number <b>doubles</b>, it does not just grow by the same amount.', '1. Are the gaps the same? +3, then +6, then +12. <b>No</b>.', '2. Try dividing instead: 6 ÷ 3 = 2, 12 ÷ 6 = 2, 24 ÷ 12 = 2. It <b>doubles</b> every time.', '3. Next term: 24 × 2 = 48.'],
          a: '48 — the rule is "double the term before"',
          visual: SVG(360, 96, termRow(['3', '6', '12', '24', '48'], 62, '× 2', GREEN) + `<text x="180" y="90" text-anchor="middle" fill="${ROSE}">not "+ the same": it doubles each time</text>`) },
        { q: 'For 5, 8, 11, 14, … what is the term-to-term rule and what is the position-to-term rule?',
          working: ['<b>Picture:</b> the staircase. <b>Term-to-term</b> = "how big is one step". <b>Position-to-term</b> = "how high is step number n".', '1. <b>Term-to-term:</b> the gap is 3, so the rule is <b>add 3 each time</b>. It only works if you know the term before.', '2. <b>Position-to-term:</b> the gap of 3 gives 3n; 3 × 1 = 3 but the first term is 5, so <b>+ 2</b>. The rule is <b>3n + 2</b>.', '3. Which is quicker for the 50th term? Position-to-term: 3 × 50 + 2 = 152. (Term-to-term would need 49 additions!)'],
          a: 'term-to-term: add 3 each time &nbsp;·&nbsp; position-to-term: 3n + 2',
          visual: SVG(360, 176, termRow(['5', '8', '11', '14'], 48, '+3')
            + `<text x="180" y="72" text-anchor="middle" fill="${ROSE}">TERM-to-TERM: add 3 each time</text>`
            + [1, 2, 3, 4].map((n, i) => { const x = 40 + i * 70; return `<line x1="${x}" y1="118" x2="${x}" y2="92" stroke="${GREEN}" stroke-width="2"/><polygon points="${x},84 ${x - 6},94 ${x + 6},94" fill="${GREEN}"/><text x="${x}" y="136" text-anchor="middle" font-size="15" fill="${BLUE}">3×${n}+2</text>`; }).join('')
            + `<text x="180" y="164" text-anchor="middle" fill="${BLUE}">POSITION-to-TERM: 3n + 2</text>`) },
        { q: 'Is 68 a term in the pattern 5, 8, 11, 14, …?',
          working: ['<b>Picture:</b> the staircase again — does one of the steps land <b>exactly</b> on 68?', '1. What is the rule? Gaps of 3, first term 5 → <b>3n + 2</b>.', '2. Set the rule equal to 68: 3n + 2 = 68.', '3. Solve it: 3n = 66, so n = 66 ÷ 3 = 22.', '4. Is n a <b>whole number</b>? Yes → 68 is the 22nd term. (If n had come out as 21.5, the answer would be <b>no</b>.)'],
          a: 'Yes — it is the 22nd term' },
      ],
      tips: [
        '<b>Always check</b> your rule with n = 1 and n = 2 before you use it.',
        'A pattern going <b>down</b> has a <b>negative</b> difference: 20, 17, 14 → −3n + 23.',
        'For a table of values, the "n" row is the position; the other row is the term.',
        'In matchstick patterns, count the sticks in patterns 1, 2, 3 first — then it is just a number pattern.',
        '<b>Check the gaps first.</b> If the gaps are <b>not</b> all the same it is not a "+ the same number" pattern — look for <b>squares</b>, <b>doubling</b>, or <b>growing gaps</b>.',
        'Say which rule you are giving: "<b>term-to-term</b>" (add 3 each time) or "<b>position-to-term</b>" (3n + 2). They are both right, but they answer different questions.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
