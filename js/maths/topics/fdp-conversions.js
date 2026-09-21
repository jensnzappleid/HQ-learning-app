/* Topic: Fractions, decimals & percentages (converting between the three, and ordering) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});
  const FH = (n, d) => N.fracHtml(n, d);
  const FT = (n, d) => N.fracText(n, d);

  /** denominators available at each level (all give terminating decimals except 3, 6, 9) */
  const DENOMS = { 1: [2, 4, 5, 10], 2: [4, 5, 10, 20, 25, 50, 100], 3: [4, 8, 20, 40, 25, 50, 100, 8, 8] };
  const RECUR = [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [2, 9]];

  /** one equivalent set {n, d, dec, pct} — terminating only */
  function entry(level) {
    const d = R.pick(DENOMS[level]);
    let n = R.int(1, d - 1);
    for (let i = 0; i < 20 && N.gcd(n, d) !== 1; i++) n = R.int(1, d - 1);
    const s = N.simplify(n, d);
    const dec = N.round(s.n / s.d, 3);
    const pct = N.round(dec * 100, 1);
    return { n: s.n, d: s.d, dec, pct };
  }
  /** how to get the denominator to a power of 10: returns {k, big} such that d*k = big (100 or 1000) */
  function scale(d) {
    if (100 % d === 0) return { k: 100 / d, big: 100 };
    if (1000 % d === 0) return { k: 1000 / d, big: 1000 };
    return null;
  }

  function fracToDec(e) {
    const sc = scale(e.d);
    const working = sc
      ? [`Make the bottom a power of 10: multiply top and bottom by ${sc.k}.`, `${FT(e.n, e.d)} = ${FT(e.n * sc.k, sc.big)}.`, `${e.n * sc.k} ${sc.big === 100 ? 'hundredths' : 'thousandths'} = <b>${f(e.dec)}</b>.`]
      : [`A fraction means top ÷ bottom: ${e.n} ÷ ${e.d}.`, `${e.n} ÷ ${e.d} = <b>${f(e.dec)}</b>.`];
    return {
      prompt: `Write ${FH(e.n, e.d)} as a decimal.`,
      answer: numAns(e.dec, { placeholder: 'e.g. 0.75' }),
      hint: sc ? `Change the fraction so the bottom is ${sc.big} (multiply top and bottom by ${sc.k}). Then read it as a decimal.` : `Divide the top by the bottom: ${e.n} ÷ ${e.d}.`,
      working, finalAnswer: f(e.dec), skill: 'frac-dec',
    };
  }
  function decToPct(e) {
    return {
      prompt: `Write ${f(e.dec)} as a percentage.`,
      answer: numAns(e.pct, { unit: '%' }),
      hint: 'Percent means "out of 100". Multiply the decimal by 100 (move the point 2 places right).',
      working: [`${f(e.dec)} × 100 = ${f(e.pct)}.`, `So ${f(e.dec)} = <b>${f(e.pct)}%</b>.`],
      finalAnswer: `${f(e.pct)}%`, skill: 'dec-pct',
    };
  }
  function pctToDec(e) {
    return {
      prompt: `Write ${f(e.pct)}% as a decimal.`,
      answer: numAns(e.dec, { placeholder: 'e.g. 0.75' }),
      hint: 'Percent means "out of 100". Divide by 100 (move the point 2 places left).',
      working: [`${f(e.pct)}% = ${f(e.pct)} ÷ 100.`, `Move the decimal point 2 places left: <b>${f(e.dec)}</b>.`],
      finalAnswer: f(e.dec), skill: 'pct-dec',
    };
  }
  function pctToFrac(e) {
    const whole = Number.isInteger(e.pct);
    const top = whole ? e.pct : Math.round(e.pct * 10), bot = whole ? 100 : 1000;
    const g = N.gcd(top, bot);
    const working = [];
    if (!whole) working.push(`${f(e.pct)}% has a decimal, so write it as ${top} out of ${bot} instead of out of 100.`);
    else working.push(`${e.pct}% means ${e.pct} out of 100: ${FT(top, bot)}.`);
    working.push(`Divide top and bottom by ${g}: ${FT(top, bot)} = ${FT(e.n, e.d)}.`);
    working.push(`Answer: <b>${FT(e.n, e.d)}</b>.`);
    return {
      prompt: `Write ${f(e.pct)}% as a fraction in simplest form.`,
      answer: { type: 'fraction', value: { n: e.n, d: e.d }, placeholder: 'e.g. 3/4' },
      hint: `Write it over 100 first${whole ? '' : ' (or over 1000 if there is a decimal)'}, then simplify.`,
      working, finalAnswer: FH(e.n, e.d), skill: 'pct-frac',
    };
  }
  function fracToPct(e) {
    const sc = scale(e.d);
    const working = sc && sc.big === 100
      ? [`Make the bottom 100: multiply top and bottom by ${sc.k}.`, `${FT(e.n, e.d)} = ${FT(e.n * sc.k, 100)}.`, `${e.n * sc.k} out of 100 = <b>${f(e.pct)}%</b>.`]
      : [`Turn it into a decimal first: ${e.n} ÷ ${e.d} = ${f(e.dec)}.`, `Multiply by 100: ${f(e.dec)} × 100 = <b>${f(e.pct)}%</b>.`];
    return {
      prompt: `Write ${FH(e.n, e.d)} as a percentage.`,
      answer: numAns(e.pct, { unit: '%' }),
      hint: sc && sc.big === 100 ? `Make the bottom 100 (multiply top and bottom by ${sc.k}). The top is then the percentage.` : 'Change it to a decimal first (top ÷ bottom), then multiply by 100.',
      working, finalAnswer: `${f(e.pct)}%`, skill: 'frac-pct',
    };
  }
  function decToFrac(e) {
    const s = String(e.dec), dp = s.length - s.indexOf('.') - 1;
    const bot = Math.pow(10, dp), top = Math.round(e.dec * bot);
    const g = N.gcd(top, bot);
    const name = dp === 1 ? 'tenths' : dp === 2 ? 'hundredths' : 'thousandths';
    return {
      prompt: `Write ${f(e.dec)} as a fraction in simplest form.`,
      answer: { type: 'fraction', value: { n: e.n, d: e.d }, placeholder: 'e.g. 3/4' },
      hint: `${f(e.dec)} has ${dp} decimal place${dp > 1 ? 's' : ''}, so it is ${top} ${name}. Write that as a fraction and simplify.`,
      working: [`${f(e.dec)} = ${top} ${name} = ${FT(top, bot)}.`, `Divide top and bottom by ${g}: ${FT(top, bot)} = ${FT(e.n, e.d)}.`, `Answer: <b>${FT(e.n, e.d)}</b>.`],
      finalAnswer: FH(e.n, e.d), skill: 'dec-frac',
    };
  }
  function recurring() {
    const [n, d] = R.pick(RECUR);
    const asPct = R.chance(0.6);
    const exact = n / d;
    const val = asPct ? N.round(exact * 100, 1) : N.round(exact, 2);
    const digit = String(Math.round((exact * 10) % 10)).slice(-1);
    return {
      prompt: asPct ? `Write ${FH(n, d)} as a percentage, to 1 decimal place.` : `Write ${FH(n, d)} as a decimal, to 2 decimal places.`,
      answer: numAns(val, asPct ? { unit: '%', tolerance: 0.05 } : { tolerance: 0.005 }),
      hint: `${n} ÷ ${d} gives a recurring decimal (the digits repeat). Work it out, ${asPct ? 'multiply by 100, ' : ''}then round.`,
      working: [
        `${n} ÷ ${d} = ${exact.toFixed(4)}… (the ${digit === '3' || digit === '6' ? digit : 'digits'} keep repeating).`,
        asPct ? `× 100 = ${(exact * 100).toFixed(3)}…` : `Look at the 3rd decimal place to round.`,
        `Rounded: <b>${f(val)}${asPct ? '%' : ''}</b>.`,
      ],
      finalAnswer: `${f(val)}${asPct ? '%' : ''}`, skill: 'recurring',
    };
  }
  function ordering(level) {
    const count = level === 1 ? 3 : level === 2 ? 3 : 4;
    const items = [];
    const seen = new Set();
    for (let i = 0; i < 40 && items.length < count; i++) {
      const e = entry(level);
      if (seen.has(e.dec)) continue;
      seen.add(e.dec); items.push(e);
    }
    if (items.length < count) items.push({ n: 1, d: 2, dec: 0.5, pct: 50 }, { n: 1, d: 4, dec: 0.25, pct: 25 }, { n: 1, d: 5, dec: 0.2, pct: 20 }, { n: 3, d: 4, dec: 0.75, pct: 75 });
    const forms = R.shuffle(['frac', 'dec', 'pct', R.pick(['frac', 'dec', 'pct'])]).slice(0, count);
    const shown = items.slice(0, count).map((e, i) => ({
      e, form: forms[i],
      html: forms[i] === 'frac' ? FH(e.n, e.d) : forms[i] === 'dec' ? f(e.dec) : `${f(e.pct)}%`,
    }));
    const wantSmall = R.chance(0.5);
    let best = 0;
    shown.forEach((s, i) => { if (wantSmall ? s.e.dec < shown[best].e.dec : s.e.dec > shown[best].e.dec) best = i; });
    return {
      prompt: `Which of these is the <b>${wantSmall ? 'smallest' : 'largest'}</b>? ${shown.map((s) => s.html).join(', &nbsp;')}`,
      answer: { type: 'choice', value: best, choices: shown.map((s) => s.html) },
      hint: 'Change every number into a decimal first. Then compare the decimals.',
      working: [
        `As decimals: ${shown.map((s) => `${s.html} = ${f(s.e.dec)}`).join('; &nbsp;')}.`,
        `In order from smallest: ${shown.slice().sort((a, b) => a.e.dec - b.e.dec).map((s) => f(s.e.dec)).join(' < ')}.`,
        `The ${wantSmall ? 'smallest' : 'largest'} is <b>${shown[best].html}</b>.`,
      ],
      finalAnswer: shown[best].html, skill: 'ordering',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['fd', 'dp', 'pf', 'fp', 'pd', 'df', 'ord']
      : level === 2 ? ['fd', 'dp', 'pf', 'fp', 'pd', 'df', 'ord', 'ord']
      : ['fd', 'dp', 'pf', 'fp', 'pd', 'df', 'ord', 'rec', 'rec'];
    const t = R.pick(pool);
    if (t === 'ord') return ordering(level);
    if (t === 'rec') return recurring();
    const e = entry(level);
    return { fd: fracToDec, dp: decToPct, pf: pctToFrac, fp: fracToPct, pd: pctToDec, df: decToFrac }[t](e);
  }

  const names = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby'];
  /** {n, d, dec, pct} for a percentage that is a whole number of percent */
  function fromPct(pct) {
    const s = N.simplify(pct, 100);
    return { n: s.n, d: s.d, dec: N.round(pct / 100, 4), pct };
  }
  const NICE_PCTS = [55, 60, 64, 65, 70, 72, 75, 76, 80, 84, 85, 88, 90, 92, 95, 45, 48, 50, 52, 56];

  function word(level) {
    const t = R.pick(level === 1 ? ['test', 'survey', 'team', 'sale', 'rain', 'battery']
      : level === 2 ? ['test', 'survey', 'team', 'sale', 'rain', 'battery', 'twoForms']
        : ['rankThree', 'rankThree', 'order3', 'discount', 'discount', 'pointsDiff', 'tank', 'test', 'team']);

    if (t === 'battery') {
      const dec = R.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.45, 0.5, 0.6, 0.65, 0.75, 0.8, 0.9]);
      const pct = N.round(dec * 100, 1);
      const thing = R.pick([['Harper\'s phone battery', 'charge'], ['the tablet battery', 'charge'], ['the school bus fuel gauge', 'tank']]);
      return {
        prompt: `${thing[0].charAt(0).toUpperCase() + thing[0].slice(1)} shows ${f(dec)} of a full ${thing[1]}. What percentage is that?`,
        answer: numAns(pct, { unit: '%' }),
        hint: 'Decimal → percentage: multiply by 100 (the point hops 2 places right).',
        working: [`${f(dec)} × 100 = ${f(pct)}.`, `So ${f(dec)} = <b>${f(pct)}%</b> full.`],
        finalAnswer: `${f(pct)}%`, skill: 'dec-pct',
      };
    }

    if (t === 'twoForms') {
      const [p1, p2] = R.sample(NICE_PCTS, 2);
      const e1 = fromPct(p1), e2 = fromPct(p2);
      const subj = R.sample(['maths', 'science', 'English', 'te reo Māori', 'social studies'], 2);
      const better = p1 > p2 ? 0 : 1;
      const shown = [FH(e1.n, e1.d), `${f(p2)}%`];
      const choices = shown.concat(['They are the same score']);
      return {
        prompt: `Harper got ${FH(e1.n, e1.d)} in her ${subj[0]} test and ${f(p2)}% in her ${subj[1]} test. Which score is better?`,
        answer: { type: 'choice', value: better, choices },
        hint: 'Put both scores in the <b>same form</b> first. Turning the fraction into a percentage is easiest.',
        working: [
          '<b>Picture:</b> a chocolate block of 100 squares. How many squares does each score cover?',
          `1. ${subj[0]}: ${FT(e1.n, e1.d)} = ${e1.n} ÷ ${e1.d} = ${f(e1.dec)} = ${f(p1)}%.`,
          `2. ${subj[1]} is already ${f(p2)}%.`,
          `3. Compare: ${Math.max(p1, p2)}% beats ${Math.min(p1, p2)}%.`,
          `Better score: <b>${choices[better]}</b>.`,
        ],
        finalAnswer: choices[better], skill: 'compare-forms',
      };
    }

    if (t === 'rankThree' || t === 'order3') {
      let pcts = R.sample(NICE_PCTS, 3);
      const es = pcts.map(fromPct);
      const subj = R.sample(['maths', 'science', 'English', 'te reo Māori', 'social studies', 'art'], 3);
      const html = [FH(es[0].n, es[0].d), `${f(es[1].pct)}%`, f(es[2].dec)];
      const forms = ['a fraction', 'a percentage', 'a decimal'];
      const asDec = es.map((e) => e.dec);
      const order = [0, 1, 2].sort((i, j) => asDec[j] - asDec[i]);
      const list = `${subj[0]}: ${html[0]}, &nbsp; ${subj[1]}: ${html[1]}, &nbsp; ${subj[2]}: ${html[2]}`;
      const convert = `As percentages: ${subj[0]} = ${f(es[0].pct)}%, ${subj[1]} = ${f(es[1].pct)}%, ${subj[2]} = ${f(es[2].pct)}%.`;
      const shared = [
        '<b>Picture:</b> the 100-square chocolate block. Change every mark into "squares out of 100" and they line up.',
        `1. Are they in the same form? <b>No</b> — one is ${forms[0]}, one is ${forms[1]}, one is ${forms[2]}.`,
        `2. ${FT(es[0].n, es[0].d)} = ${es[0].n} ÷ ${es[0].d} = ${f(es[0].dec)} = ${f(es[0].pct)}%, and ${f(es[2].dec)} × 100 = ${f(es[2].pct)}%.`,
        `3. ${convert}`,
      ];
      if (t === 'rankThree') {
        return {
          prompt: `Harper's three test marks are ${list}. Which was her <b>best</b> mark?`,
          answer: { type: 'choice', value: order[0], choices: subj.slice() },
          hint: 'Change all three into percentages, then compare.',
          working: shared.concat([`Biggest percentage: <b>${subj[order[0]]}</b>.`]),
          finalAnswer: subj[order[0]], skill: 'compare-forms',
        };
      }
      const correct = order.map((i) => subj[i]).join(', ');
      const opts = new Set([correct, order.slice().reverse().map((i) => subj[i]).join(', ')]);
      for (let i = 0; i < 20 && opts.size < 3; i++) opts.add(R.shuffle(subj).join(', '));
      const choices = R.shuffle([...opts]);
      return {
        prompt: `Harper's three test marks are ${list}. Put the subjects in order, <b>best first</b>.`,
        answer: { type: 'choice', value: choices.indexOf(correct), choices },
        hint: 'Change all three into percentages, then order them from biggest to smallest.',
        working: shared.concat([`Best first: <b>${correct}</b>.`]),
        finalAnswer: correct, skill: 'compare-forms',
      };
    }

    if (t === 'discount') {
      const PAIRS = [[[1, 4], 20], [[1, 4], 30], [[2, 5], 45], [[3, 8], 40], [[1, 5], 25], [[5, 8], 60], [[3, 4], 70], [[1, 3], 30], [[2, 3], 70], [[1, 2], 45], [[3, 5], 65]];
      const [[fn, fd], pct] = R.pick(PAIRS);
      const fPct = N.round(fn / fd * 100, 1);
      const [shopA, shopB] = R.sample(['The Warehouse', 'Kmart', 'Farmers', 'Rebel Sport', 'Briscoes'], 2);
      const item = R.pick(['a hoodie', 'a skateboard', 'a netball', 'a pair of headphones', 'a bike helmet']);
      const fracBigger = fPct > pct;
      const choices = R.shuffle([`${shopA} (${FH(fn, fd)} off)`, `${shopB} (${f(pct)}% off)`]);
      const right = choices.indexOf(fracBigger ? `${shopA} (${FH(fn, fd)} off)` : `${shopB} (${f(pct)}% off)`);
      return {
        prompt: `${shopA} takes ${FH(fn, fd)} off the price of ${item}. ${shopB} takes ${f(pct)}% off the same price. Which shop gives the <b>bigger</b> discount?`,
        answer: { type: 'choice', value: right, choices: choices.concat(['The discounts are the same']) },
        hint: 'Change the fraction into a percentage, then compare the two percentages.',
        working: [
          '<b>Picture:</b> the 100-square block again — how many squares does each discount take off?',
          `1. Same form? <b>No</b> — one is a fraction, one is a percentage.`,
          `2. ${FT(fn, fd)} = ${fn} ÷ ${fd} = ${f(N.round(fn / fd, 4))}, × 100 = ${f(fPct)}%.`,
          `3. Compare: ${f(fPct)}% and ${f(pct)}% → ${f(Math.max(fPct, pct))}% is bigger.`,
          `Bigger discount: <b>${choices[right]}</b>.`,
        ],
        finalAnswer: choices[right], skill: 'compare-forms',
      };
    }

    if (t === 'pointsDiff') {
      const [p1, p2] = R.sample(NICE_PCTS, 2);
      const e1 = fromPct(p1);
      const subj = R.sample(['maths', 'science', 'English', 'te reo Māori'], 2);
      const diff = N.round(Math.abs(p1 - p2), 1);
      const higher = p1 > p2 ? subj[0] : subj[1];
      return {
        prompt: `Harper got ${FH(e1.n, e1.d)} in ${subj[0]} and ${f(p2)}% in ${subj[1]}. How many <b>percentage points</b> higher was her better mark?`,
        answer: numAns(diff, { unit: '%' }),
        hint: 'Change the fraction to a percentage first, then subtract the smaller percentage from the bigger one.',
        working: [
          `1. ${FT(e1.n, e1.d)} = ${e1.n} ÷ ${e1.d} = ${f(e1.dec)} = ${f(p1)}%.`,
          `2. The other mark is ${f(p2)}%.`,
          `3. ${f(Math.max(p1, p2))} − ${f(Math.min(p1, p2))} = ${f(diff)}.`,
          `Her ${higher} mark was <b>${f(diff)} percentage points</b> higher.`,
        ],
        finalAnswer: `${f(diff)}%`, skill: 'compare-forms',
      };
    }

    if (t === 'tank') {
      const e = R.pick([{ dec: 0.375 }, { dec: 0.625 }, { dec: 0.875 }, { dec: 0.125 }, { dec: 0.24 }, { dec: 0.35 }, { dec: 0.44 }, { dec: 0.56 }, { dec: 0.96 }]);
      const s = String(e.dec), dp = s.length - s.indexOf('.') - 1;
      const bot = Math.pow(10, dp), top = Math.round(e.dec * bot);
      const sm = N.simplify(top, bot);
      const q = decToFrac({ n: sm.n, d: sm.d, dec: e.dec, pct: N.round(e.dec * 100, 1) });
      q.prompt = `The rain tank at Harper's bach is ${f(e.dec)} full. Write that as a fraction of the tank, in simplest form.`;
      q.finalAnswer = FH(sm.n, sm.d) + ' of the tank';
      return q;
    }

    if (t === 'test') {
      const total = level === 1 ? R.pick([10, 20]) : level === 2 ? R.pick([20, 25, 50]) : R.pick([40, 8, 25, 3, 6]);
      let got = R.int(1, total - 1);
      const e = { n: 0, d: 0 }; Object.assign(e, N.simplify(got, total));
      const rec = total === 3 || total === 6;
      const pct = rec ? N.round(got / total * 100, 1) : N.round(got / total * 100, 2);
      const who = R.pick(names);
      const sc = scale(total);
      return {
        prompt: `${who} got ${got} out of ${total} in a maths test. What is ${who}'s score as a percentage${rec ? ', to 1 decimal place' : ''}?`,
        answer: numAns(pct, rec ? { unit: '%', tolerance: 0.05 } : { unit: '%' }),
        hint: sc && sc.big === 100 ? `Make the fraction out of 100: multiply top and bottom of ${FT(got, total)} by ${sc.k}.` : `Work out ${got} ÷ ${total} as a decimal, then multiply by 100.`,
        working: [
          `Score as a fraction: ${FT(got, total)}.`,
          sc && sc.big === 100 ? `Multiply top and bottom by ${sc.k}: ${FT(got * sc.k, 100)}.` : `${got} ÷ ${total} = ${N.round(got / total, 4)}${rec ? '…' : ''}, then × 100.`,
          `Score: <b>${f(pct)}%</b>.`,
        ],
        finalAnswer: `${f(pct)}%`, skill: 'frac-pct',
      };
    }
    if (t === 'survey') {
      const total = level === 1 ? R.pick([10, 20]) : level === 2 ? R.pick([20, 25, 40, 50]) : R.pick([40, 80, 200, 400]);
      const chose = R.int(1, total - 1);
      const s = N.simplify(chose, total);
      const thing = R.pick(['netball', 'rugby', 'swimming', 'basketball', 'football', 'hockey']);
      if (R.chance(0.5)) {
        return {
          prompt: `In a survey of ${total} students, ${chose} chose ${thing} as their favourite sport. What fraction of the students chose ${thing}? Give your answer in simplest form.`,
          answer: { type: 'fraction', value: s, placeholder: 'e.g. 3/4' },
          hint: `Write ${chose} out of ${total} as a fraction, then divide top and bottom by the same number.`,
          working: [`${chose} out of ${total} = ${FT(chose, total)}.`, `Divide top and bottom by ${N.gcd(chose, total)}: ${FT(s.n, s.d)}.`, `Answer: <b>${FT(s.n, s.d)}</b>.`],
          finalAnswer: FH(s.n, s.d), skill: 'pct-frac',
        };
      }
      const pct = N.round(chose / total * 100, 2);
      return {
        prompt: `In a survey of ${total} students, ${chose} chose ${thing} as their favourite sport. What percentage chose ${thing}?`,
        answer: numAns(pct, { unit: '%' }),
        hint: `Fraction first: ${FT(chose, total)}. Then make it out of 100, or divide and multiply by 100.`,
        working: [`${chose} out of ${total} = ${FT(chose, total)}.`, `${chose} ÷ ${total} = ${f(N.round(chose / total, 4))}, and × 100 = ${f(pct)}.`, `Answer: <b>${f(pct)}%</b>.`],
        finalAnswer: `${f(pct)}%`, skill: 'frac-pct',
      };
    }
    if (t === 'team') {
      const played = level === 1 ? R.pick([4, 5, 10]) : level === 2 ? R.pick([8, 10, 20, 25]) : R.pick([16, 40, 12, 3]);
      const won = R.int(1, played - 1);
      const rec = !Number.isInteger(won * 10000 / played);
      const exact = won / played;
      const asDec = !rec && R.chance(0.4);
      const val = asDec ? N.round(exact, 4) : rec ? N.round(exact * 100, 1) : N.round(exact * 100, 2);
      return {
        prompt: `A netball team won ${won} of its ${played} games this season. Write the fraction of games won as a ${asDec ? 'decimal' : 'percentage'}${rec ? ', to 1 decimal place' : ''}.`,
        answer: asDec ? numAns(val, { placeholder: 'e.g. 0.75' }) : numAns(val, rec ? { unit: '%', tolerance: 0.05 } : { unit: '%' }),
        hint: `Fraction won = ${FT(won, played)}. Divide top by bottom${asDec ? '' : ', then × 100'}.`,
        working: [`Games won as a fraction: ${FT(won, played)}.`, `${won} ÷ ${played} = ${exact.toFixed(4).replace(/0+$/, '')}${rec ? '…' : ''}.`, asDec ? `Answer: <b>${f(val)}</b>.` : `× 100 → <b>${f(val)}%</b>.`],
        finalAnswer: asDec ? f(val) : `${f(val)}%`, skill: asDec ? 'frac-dec' : 'frac-pct',
      };
    }
    if (t === 'sale') {
      const e = entry(level);
      const toFrac = R.chance(0.5);
      const shop = R.pick(['The Warehouse', 'Farmers', 'Rebel Sport', 'Kmart', 'Briscoes']);
      if (toFrac) {
        const q = pctToFrac(e);
        q.prompt = `A sign at ${shop} says "${f(e.pct)}% off". Write ${f(e.pct)}% as a fraction in simplest form.`;
        return q;
      }
      const q = pctToDec(e);
      q.prompt = `A sign at ${shop} says "${f(e.pct)}% off". Write ${f(e.pct)}% as a decimal.`;
      return q;
    }
    // rain / weather: fraction of days -> decimal or percent
    const e = entry(level);
    const place = R.pick(['Auckland', 'Wellington', 'Dunedin', 'Rotorua', 'Nelson']);
    if (R.chance(0.5)) {
      const q = fracToDec(e);
      q.prompt = `It rained on ${FH(e.n, e.d)} of the days in ${place} last month. Write this fraction as a decimal.`;
      return q;
    }
    const q = fracToPct(e);
    q.prompt = `It rained on ${FH(e.n, e.d)} of the days in ${place} last month. What percentage of days was that?`;
    return q;
  }

  HL.registerTopic({
    id: 'fdp-conversions', subject: 'maths', strand: 'number', order: 11,
    name: 'Fractions, decimals & percentages', short: 'FDP',
    blurb: 'Change between fractions, decimals and percentages, and put them in order.',
    example: '<span class="frac"><span class="frac-n">3</span><span class="frac-d">4</span></span> = 0.75 = 75%',
    animal: 'chick',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', GREY = '#9A8A98';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const M = (id, c) => `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      const F = (n, d) => N.fracHtml(n, d);
      /** 10 × 10 chocolate block with the first `n` squares shaded */
      const block = (x0, y0, cell, n) => Array.from({ length: 100 }, (_, i) => `<rect x="${x0 + (i % 10) * cell}" y="${y0 + Math.floor(i / 10) * cell}" width="${cell}" height="${cell}" fill="${i < n ? ROSE : '#fff'}" stroke="#C9B8F2" stroke-width="1"/>`).join('');
      return {
        what: '<p>Fractions, decimals and percentages are <b>three ways of writing the same amount</b>. A quarter of a chocolate block is <b>1/4</b>, <b>0.25</b> and <b>25%</b>. If you can switch between them you can compare any two amounts and pick the easiest form for a calculation.</p>',
        visual: S(360, 220, `${M('fdp-tri', INK)}
          <rect x="140" y="4" width="80" height="36" rx="9" fill="#FFE98A"/>${T(180, 19, 'Fraction', INK, 'font-size="13"')}${T(180, 35, '1/4')}
          <rect x="4" y="178" width="80" height="36" rx="9" fill="#A9D8F5"/>${T(44, 193, 'Decimal', INK, 'font-size="13"')}${T(44, 209, '0.25')}
          <rect x="276" y="178" width="80" height="36" rx="9" fill="#F9A8C9"/>${T(316, 193, 'Percent', INK, 'font-size="13"')}${T(316, 209, '25%')}
          <line x1="150" y1="42" x2="60" y2="176" stroke="${INK}" stroke-width="2.5" marker-start="url(#fdp-tri)" marker-end="url(#fdp-tri)"/>
          <line x1="210" y1="42" x2="300" y2="176" stroke="${INK}" stroke-width="2.5" marker-start="url(#fdp-tri)" marker-end="url(#fdp-tri)"/>
          <line x1="88" y1="196" x2="272" y2="196" stroke="${INK}" stroke-width="2.5" marker-start="url(#fdp-tri)" marker-end="url(#fdp-tri)"/>
          ${block(140, 64, 8, 25)}
          ${T(180, 160, '25 out of 100', ROSE, 'font-size="13"')}
          <text x="104" y="96" text-anchor="end" fill="${ROSE}" font-size="13">1 ÷ 4 ↓</text>
          <text x="86" y="124" text-anchor="end" fill="${BLUE}" font-size="13">↑ over 100</text>
          <text x="256" y="96" fill="${ROSE}" font-size="13">↓ 0.25 × 100</text>
          <text x="274" y="124" fill="${BLUE}" font-size="13">↑ over 100</text>
          ${T(180, 190, '× 100 →', ROSE, 'font-size="13"')}${T(180, 213, '← ÷ 100', BLUE, 'font-size="13"')}
        `),
        facts: [
          'Percent means <b>per hundred</b>: 25% = ' + F(25, 100) + ' = 0.25',
          '<b>Decimal → %</b>: × 100 (point hops 2 places <b>right</b>): 0.4 → 40%',
          '<b>% → decimal</b>: ÷ 100 (point hops 2 places <b>left</b>): 7% → 0.07',
          '<b>Fraction → decimal</b>: top ÷ bottom, or make the bottom 10 / 100 / 1000',
          '<b>Decimal → fraction</b>: read the place value, then simplify: 0.6 = ' + F(6, 10) + ' = ' + F(3, 5),
          'Famous ones: ' + F(1, 2) + ' = 0.5 = 50% &nbsp;·&nbsp; ' + F(1, 4) + ' = 0.25 = 25% &nbsp;·&nbsp; ' + F(1, 5) + ' = 0.2 = 20% &nbsp;·&nbsp; ' + F(1, 8) + ' = 0.125 = 12.5%',
        ],
        steps: [
          '<b>Fraction → decimal</b>: say "top divided by bottom". Or make the bottom 10, 100 or 1000 first: 3/4 = 75/100 = 0.75.',
          '<b>Decimal → percentage</b>: say "times 100, point hops 2 right". 0.4 → 40%.',
          '<b>Percentage → decimal</b>: say "divide by 100, point hops 2 left". 7% → 0.07.',
          '<b>Percentage → fraction</b>: say "put it over 100, then simplify". 45% = 45/100 = 9/20.',
          '<b>Decimal → fraction</b>: say "read the place value". 0.375 = 375/1000 = 3/8.',
          '<b>To compare or order</b> a mixed set, change everything into decimals (or percentages) first.',
        ],
        examples: [
          { q: 'Write ' + F(3, 8) + ' as a decimal and a percentage', working: ['<b>Picture:</b> a chocolate block with <b>100 squares</b>. Every form is just "how many squares".', '1. Can I make the bottom 10 or 100? 8 doesn\'t go into 100 nicely, so I divide: 3 ÷ 8 = 0.375.', '2. Decimal → percent: × 100, point hops 2 places right: 0.375 → 37.5.', '3. Check: 37.5 squares out of 100 — a bit over a third of the block. Sensible!', F(3, 8) + ' = 0.375 = 37.5%'], a: '0.375 = 37.5%',
            visual: S(330, 70, `${M('fdp-a', ROSE)}${T(30, 30, '3', INK, 'font-size="16"')}<line x1="20" y1="35" x2="40" y2="35" stroke="${INK}" stroke-width="2"/>${T(30, 53, '8', INK, 'font-size="16"')}
              <line x1="52" y1="40" x2="104" y2="40" stroke="${ROSE}" stroke-width="3" marker-end="url(#fdp-a)"/>${T(78, 26, '3 ÷ 8', ROSE, 'font-size="13"')}
              ${T(148, 46, '0.375', BLUE, 'font-size="20"')}
              <line x1="192" y1="40" x2="244" y2="40" stroke="${ROSE}" stroke-width="3" marker-end="url(#fdp-a)"/>${T(218, 26, '× 100', ROSE, 'font-size="13"')}
              ${T(290, 46, '37.5%', GREEN, 'font-size="20"')}`) },
          { q: 'Write 0.6 as a percentage and as a fraction in simplest form', working: ['<b>Picture:</b> the chocolate block. 0.6 is 6 rows out of 10, so 60 squares out of 100.', '1. Decimal → percent: × 100, point hops 2 right: 0.6 → 60%.', '2. Decimal → fraction: what place is the 6 in? Tenths, so 6/10.', '3. Can I simplify? Yes, 6 and 10 are both even: ÷ 2 → 3/5.', '0.6 = 60% = ' + F(3, 5)], a: '60% and ' + F(3, 5),
            visual: S(300, 112, `${Array.from({ length: 10 }, (_, i) => `<rect x="${20 + i * 26}" y="20" width="26" height="36" fill="${i < 6 ? ROSE : '#fff'}" stroke="${INK}" stroke-width="1"/>`).join('')}
              ${[0, 1, 2, 3, 4, 5].map((k) => `<line x1="${20 + k * 52}" y1="16" x2="${20 + k * 52}" y2="60" stroke="${BLUE}" stroke-width="3"/>`).join('')}
              ${T(150, 82, '6 out of 10 → 0.6 = 60%', ROSE, 'font-size="13"')}${T(150, 104, 'in pairs: 3 out of 5 → 3/5', BLUE, 'font-size="13"')}`) },
          { q: 'Write 65% as a fraction in simplest form', working: ['<b>Picture:</b> 65 squares of the 100-square block.', '1. Percent means per hundred, so 65% = 65/100.', '2. Can I simplify? Both end in 5 or 0, so ÷ 5: 65 ÷ 5 = 13, 100 ÷ 5 = 20.', '3. Can 13/20 simplify more? No — 13 is prime.', '65% = ' + F(13, 20)], a: F(13, 20) },
          { q: 'Write 7% as a decimal', working: ['<b>Picture:</b> only 7 squares out of 100 — a tiny bit of the block, so the decimal must be small.', '1. Percent → decimal: ÷ 100, the point hops 2 places <b>left</b>.', '2. 7 is really 7.0 → hop, hop → 0.07.', '3. Check: is 0.7 right? No! 0.7 would be 70 squares. 7 squares is <b>0.07</b>.', '7% = 0.07'], a: '0.07',
            visual: S(290, 84, `${M('fdp-b', ROSE)}${T(34, 56, '7%', INK, 'font-size="22"')}${T(72, 56, '→', INK, 'font-size="20"')}
              ${T(112, 56, '0', INK, 'font-size="24"')}${T(134, 56, '.', ROSE, 'font-size="24"')}${T(156, 56, '0', INK, 'font-size="24"')}${T(180, 56, '7', INK, 'font-size="24"')}${T(202, 56, '.', GREY, 'font-size="24"')}
              <path d="M202 36 q-17 -22 -34 0" stroke="${ROSE}" stroke-width="2.5" fill="none" marker-end="url(#fdp-b)"/><path d="M168 36 q-17 -22 -34 0" stroke="${ROSE}" stroke-width="2.5" fill="none" marker-end="url(#fdp-b)"/>
              ${T(150, 78, '÷ 100: the point hops 2 places left', ROSE, 'font-size="13"')}`) },
          { q: 'Put in order, smallest first: ' + F(2, 5) + ', 0.35, 45%', working: ['<b>Picture:</b> how many squares of the block does each one cover?', '1. Are they all in the same form? No, so I change everything to decimals.', '2. 2/5 = 4/10 = 0.4 (40 squares). 0.35 stays (35 squares). 45% = 0.45 (45 squares).', '3. Now compare: 0.35 < 0.4 < 0.45.', 'Order: 0.35, ' + F(2, 5) + ', 45%'], a: '0.35, ' + F(2, 5) + ', 45%',
            visual: S(330, 84, `<line x1="30" y1="50" x2="290" y2="50" stroke="${INK}" stroke-width="2"/>
              ${[30, 35, 40, 45, 50].map((v, i) => { const x = 30 + i * 65; return `<line x1="${x}" y1="44" x2="${x}" y2="56" stroke="${INK}" stroke-width="2"/>${T(x, 74, '0.' + v, INK, 'font-size="13"')}`; }).join('')}
              ${[[95, '0.35', ROSE, 20], [160, '2/5 = 0.4', BLUE, 20], [225, '45% = 0.45', GREEN, 36]].map(([x, l, c, y]) => `<circle cx="${x}" cy="50" r="5" fill="${c}"/>${T(x, y, l, c, 'font-size="13"')}`).join('')}`) },
          { q: 'Harper got ' + F(17, 20) + ' in a maths test and 82% in a science test. Which score is better?', working: ['<b>Picture:</b> turn both scores into squares of the 100-square block.', '1. Are they in the same form? No — one fraction, one percent.', '2. Fraction → percent: can I make the bottom 100? Yes, 20 × 5 = 100, so 17 × 5 = 85 → 85/100 = 85%.', '3. Compare: 85% vs 82%. 85 squares is more than 82.', 'Maths (85%) is the better score'], a: 'Maths — 85% beats 82%' },
        ],
        tips: [
          'Learn the "famous" ones by heart: 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 3/4 = 0.75 = 75%, 1/5 = 0.2 = 20%, 1/10 = 0.1 = 10%, 1/8 = 0.125 = 12.5%, 1/3 ≈ 0.333 ≈ 33.3%.',
          'Percent means "per hundred". 5% is 0.05, NOT 0.5 (that would be 50%).',
          'Fraction answers must be simplified: if top and bottom are both even, keep dividing by 2; if both end in 0 or 5, divide by 5.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
