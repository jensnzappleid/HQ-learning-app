/* Topic: Mean, median, mode & range — from lists, frequency tables, and missing-value problems. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const list = (arr) => arr.map((v) => N.fmt(v)).join(', ');
  const sorted = (arr) => arr.slice().sort((a, b) => a - b);
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const plus = (arr) => arr.map((v) => N.fmt(v)).join(' + ');

  /** list of n integers in [lo, hi] whose mean is exactly m (m may end in .5) */
  function listWithMean(n, lo, hi, m) {
    // draw values from a window centred on m so the last value usually lands in range
    const wlo = Math.max(lo, Math.ceil(2 * m - hi)), whi = Math.min(hi, Math.floor(2 * m - lo));
    for (let t = 0; t < 300; t++) {
      const arr = []; for (let i = 0; i < n - 1; i++) arr.push(R.int(wlo, whi));
      const last = m * n - sum(arr);
      if (Number.isInteger(last) && last >= lo && last <= hi) { arr.push(last); return R.shuffle(arr); }
    }
    // fallback: symmetric pairs around m always average to m
    const arr = []; const base = Number.isInteger(m) ? m : m - 0.5;
    while (arr.length < n - 1) { const k = R.int(Number.isInteger(m) ? 1 : 0, Math.min(base - lo, hi - base - (Number.isInteger(m) ? 0 : 1))); arr.push(base - k, base + k + (Number.isInteger(m) ? 0 : 1)); }
    if (arr.length < n) arr.push(Number.isInteger(m) ? m : base);
    return R.shuffle(arr.slice(0, n));
  }
  /** list with exactly one mode */
  function listWithMode(n, lo, hi) {
    n = Math.min(n, hi - lo); // need enough distinct values
    for (let t = 0; t < 200; t++) {
      const mode = R.int(lo, hi), reps = R.pick([2, 3]);
      const others = new Set(); while (others.size < n - reps) others.add(R.int(lo, hi));
      if (others.has(mode)) continue;
      return { arr: R.shuffle(Array(reps).fill(mode).concat([...others])), mode };
    }
    return { arr: [lo, lo, hi], mode: lo };
  }
  const distinctList = (n, lo, hi) => { n = Math.min(n, hi - lo + 1); const s = new Set(); while (s.size < n) s.add(R.int(lo, hi)); return R.shuffle([...s]); };

  // ----- core question builders (context gives the noun/unit) -----
  const contexts = {
    plain: { intro: (arr) => `Here is a list of numbers: <b>${list(arr)}</b>.`, unit: '', lo: 1, hi: 20 },
    scores: { intro: (arr) => `Harper's last test scores (out of 20) were: <b>${list(arr)}</b>.`, unit: '', lo: 8, hi: 20 },
    netball: { intro: (arr) => `Goals scored by a netball team in their last games: <b>${list(arr)}</b>.`, unit: 'goals', lo: 10, hi: 40 },
    temp: { intro: (arr) => `Daily high temperatures in Nelson one week (°C): <b>${list(arr)}</b>.`, unit: '°C', lo: 12, hi: 30 },
    heights: { intro: (arr) => `Heights of some seedlings (cm): <b>${list(arr)}</b>.`, unit: 'cm', lo: 5, hi: 30 },
    rugby: { intro: (arr) => `Points scored by a rugby team in their last matches: <b>${list(arr)}</b>.`, unit: 'points', lo: 6, hi: 40 },
    sleep: { intro: (arr) => `Hours of sleep some students got last night: <b>${list(arr)}</b>.`, unit: 'hours', lo: 4, hi: 12 },
    money: { intro: (arr) => `Amounts (in $) some friends spent at the school canteen: <b>${list(arr)}</b>.`, unit: '$', lo: 2, hi: 15 },
    swim: { intro: (arr) => `Lengths of the pool swum by students in a session: <b>${list(arr)}</b>.`, unit: 'lengths', lo: 4, hi: 30 },
  };
  const unitStr = (u) => (u ? (u === '$' || u === '°C' ? u : ' ' + u) : '');
  const fmtU = (v, u) => (u === '$' ? N.money(v) : `${N.fmt(v)}${unitStr(u)}`);
  const ansObj = (v, u) => Object.assign({ type: 'number', value: v }, u ? { unit: u } : {});

  function meanQ(level, ctxKey) {
    const c = contexts[ctxKey];
    const n = level === 1 ? R.pick([4, 5]) : level === 2 ? R.pick([5, 6]) : R.pick([6, 7, 8]);
    const half = level >= 2 && R.chance(0.4);
    const lo = c.lo, hi = level === 1 ? Math.min(c.hi, lo + 12) : c.hi;
    const m = half ? R.int(lo, hi - 1) + 0.5 : R.int(lo + 1, hi - 1);
    const arr = listWithMean(n, lo, hi, m);
    const s = sum(arr);
    return {
      prompt: `${c.intro(arr)} What is the <b>mean</b>?`,
      answer: ansObj(m, c.unit),
      hint: 'Mean = add them all up, then divide by how many there are.',
      working: [`Add: ${plus(arr)} = ${s}.`, `There are ${n} values, so divide: ${s} ÷ ${n} = ${N.fmt(m)}.`, `Mean = <b>${fmtU(m, c.unit)}</b>.`],
      finalAnswer: fmtU(m, c.unit), skill: 'mean',
    };
  }
  function medianQ(level, ctxKey) {
    const c = contexts[ctxKey];
    let n = level === 1 ? R.pick([5, 7]) : level === 2 ? R.pick([5, 6, 7, 8]) : R.pick([6, 8]);
    const arr = level === 1 ? distinctList(n, c.lo, c.hi) : (R.chance(0.5) ? distinctList(n, c.lo, c.hi) : listWithMode(n, c.lo, c.hi).arr);
    const s = sorted(arr); n = arr.length;
    let med, w;
    if (n % 2) { med = s[(n - 1) / 2]; w = [`Put them in order: ${list(s)}.`, `There are ${n} values, so the middle one is the ${(n + 1) / 2}th value.`, `Median = <b>${fmtU(med, c.unit)}</b>.`]; }
    else { const a = s[n / 2 - 1], b = s[n / 2]; med = (a + b) / 2; w = [`Put them in order: ${list(s)}.`, `There are ${n} values (even), so take the middle two: ${a} and ${b}.`, `Average them: (${a} + ${b}) ÷ 2 = ${N.fmt(med)}.`, `Median = <b>${fmtU(med, c.unit)}</b>.`]; }
    return {
      prompt: `${c.intro(arr)} What is the <b>median</b>?`,
      answer: ansObj(med, c.unit),
      hint: n % 2 ? 'Put the numbers in order first, then find the middle one.' : 'Put the numbers in order. With an even count there are two middle numbers: add them and halve.',
      working: w, finalAnswer: fmtU(med, c.unit), skill: 'median',
    };
  }
  function modeQ(level, ctxKey) {
    const c = contexts[ctxKey];
    const n = level === 1 ? 5 : R.pick([6, 7, 8]);
    const { arr, mode } = listWithMode(n, c.lo, c.hi);
    return {
      prompt: `${c.intro(arr)} What is the <b>mode</b>?`,
      answer: ansObj(mode, c.unit),
      hint: 'The mode is the value that appears most often.',
      working: [`In order: ${list(sorted(arr))}.`, `${mode} appears ${arr.filter((v) => v === mode).length} times, more than any other value.`, `Mode = <b>${fmtU(mode, c.unit)}</b>.`],
      finalAnswer: fmtU(mode, c.unit), skill: 'mode',
    };
  }
  function rangeQ(level, ctxKey) {
    const c = contexts[ctxKey];
    let n = level === 1 ? 5 : R.pick([6, 7, 8]);
    const arr = level === 1 ? distinctList(n, c.lo, c.hi) : listWithMode(n, c.lo, c.hi).arr;
    n = arr.length;
    const s = sorted(arr), range = s[n - 1] - s[0];
    return {
      prompt: `${c.intro(arr)} What is the <b>range</b>?`,
      answer: ansObj(range, c.unit),
      hint: 'Range = biggest value − smallest value.',
      working: [`Biggest = ${s[n - 1]}, smallest = ${s[0]}.`, `${s[n - 1]} − ${s[0]} = ${range}.`, `Range = <b>${fmtU(range, c.unit)}</b>.`],
      finalAnswer: fmtU(range, c.unit), skill: 'range',
    };
  }
  function missingQ(ctxKey) {
    const c = contexts[ctxKey];
    const n = R.pick([4, 5, 6]), m = R.int(c.lo + 2, c.hi - 2);
    const arr = listWithMean(n, c.lo, c.hi, m);
    const known = arr.slice(0, n - 1), missing = arr[n - 1];
    const total = m * n, ks = sum(known);
    const noun = ctxKey === 'plain' ? 'numbers' : ctxKey === 'scores' ? 'test scores' : ctxKey === 'netball' ? 'games' : ctxKey === 'temp' ? 'days' : ctxKey === 'rugby' ? 'matches' : ctxKey === 'sleep' ? 'nights' : ctxKey === 'money' ? 'amounts spent' : ctxKey === 'swim' ? 'students' : 'seedlings';
    return {
      prompt: `The mean of ${n} ${noun} is ${fmtU(m, c.unit)}. ${n - 1} of the values are <b>${list(known)}</b>. What is the missing value?`,
      answer: ansObj(missing, c.unit),
      hint: `If the mean is ${N.fmt(m)} and there are ${n} values, the total must be ${N.fmt(m)} × ${n}.`,
      working: [`Total of all ${n} values = mean × count = ${N.fmt(m)} × ${n} = ${total}.`, `Known values add to ${plus(known)} = ${ks}.`, `Missing value = ${total} − ${ks} = <b>${fmtU(missing, c.unit)}</b>.`],
      finalAnswer: fmtU(missing, c.unit), skill: 'missing',
    };
  }
  function addValueQ(ctxKey) {
    const c = contexts[ctxKey];
    for (let t = 0; t < 100; t++) {
      const n = R.pick([4, 5, 6, 9]), m = R.int(c.lo + 1, c.hi - 1), extra = R.int(c.lo, c.hi);
      const newTotal = m * n + extra, nm = newTotal / (n + 1);
      if (nm === m || !Number.isInteger(nm * 2)) continue;
      return {
        prompt: `The mean of ${n} values is ${fmtU(m, c.unit)}. Another value of ${fmtU(extra, c.unit)} is added to the list. What is the new mean?`,
        answer: ansObj(nm, c.unit),
        hint: 'Find the old total first (mean × count). Add the new value. Divide by the new count.',
        working: [`Old total = ${N.fmt(m)} × ${n} = ${m * n}.`, `New total = ${m * n} + ${extra} = ${newTotal}.`, `New count = ${n + 1}, so new mean = ${newTotal} ÷ ${n + 1} = ${N.fmt(nm)}.`, `New mean = <b>${fmtU(nm, c.unit)}</b>.`],
        finalAnswer: fmtU(nm, c.unit), skill: 'missing',
      };
    }
    return missingQ(ctxKey);
  }
  function freqTableQ() {
    const scen = R.pick([
      { thing: 'Goals per game', item: 'goals', values: [0, 1, 2, 3, 4], intro: 'The table shows how many goals a football team scored in each game this season.' },
      { thing: 'Number of pets', item: 'pets', values: [0, 1, 2, 3, 4], intro: 'The table shows how many pets the students in a class have.' },
      { thing: 'Books read', item: 'books', values: [1, 2, 3, 4, 5], intro: 'The table shows how many books each student read in the holidays.' },
      { thing: 'Score on a quiz', item: 'points', values: [6, 7, 8, 9, 10], intro: 'The table shows the scores in a 10-question quiz.' },
    ]);
    let freqs, n, total, mean;
    for (let t = 0; t < 300; t++) {
      freqs = scen.values.map(() => R.int(1, 8));
      n = sum(freqs); total = sum(scen.values.map((v, i) => v * freqs[i])); mean = total / n;
      if (Number.isInteger(mean * 2)) break;
    }
    if (!Number.isInteger(mean * 2)) { freqs = [2, 2, 2, 2, 2]; n = 10; total = sum(scen.values) * 2; mean = total / n; }
    const rows = scen.values.map((v, i) => `<tr><td>${v}</td><td>${freqs[i]}</td></tr>`).join('');
    const visual = `<table class="data"><tr><th>${scen.thing}</th><th>Frequency</th></tr>${rows}</table>`;
    const fx = scen.values.map((v, i) => `${v} × ${freqs[i]} = ${v * freqs[i]}`).join(', ');
    const ask = R.pick(['mean', 'mean', 'mode', 'total']);
    if (ask === 'mode') {
      const maxF = Math.max(...freqs); const modes = scen.values.filter((v, i) => freqs[i] === maxF);
      if (modes.length === 1) return { prompt: `${scen.intro} What is the <b>mode</b> (the most common number of ${scen.item})?`, visual, answer: { type: 'number', value: modes[0] }, hint: 'The mode is the value with the biggest frequency, not the biggest frequency itself.', working: [`The biggest frequency is ${maxF}.`, `That is the row for ${modes[0]} ${scen.item}.`, `Mode = <b>${modes[0]}</b>.`], finalAnswer: String(modes[0]), skill: 'freq-table' };
    }
    if (ask === 'total') return { prompt: `${scen.intro} How many ${scen.item} were there altogether?`, visual, answer: { type: 'number', value: total }, hint: 'Multiply each value by its frequency, then add those up.', working: [`Value × frequency: ${fx}.`, `Add: ${total}.`, `Total = <b>${total}</b> ${scen.item}.`], finalAnswer: String(total), skill: 'freq-table' };
    return {
      prompt: `${scen.intro} Calculate the <b>mean</b> number of ${scen.item}.`,
      visual, answer: { type: 'number', value: mean },
      hint: 'Multiply each value by its frequency and add them (that is the total). Then divide by the total frequency (how many there are).',
      working: [`Value × frequency: ${fx}. Total = ${total}.`, `Total frequency = ${freqs.join(' + ')} = ${n}.`, `Mean = ${total} ÷ ${n} = ${N.fmt(mean)}.`, `Mean = <b>${N.fmt(mean)}</b> ${scen.item}.`],
      finalAnswer: N.fmt(mean), skill: 'freq-table',
    };
  }
  function whichAverageQ() {
    const cases = [
      { s: 'Which average is the value that appears most often?', a: 'mode' },
      { s: 'Which average do you find by adding all the values and dividing by how many there are?', a: 'mean' },
      { s: 'Which average is the middle value when the data is in order?', a: 'median' },
      { s: 'Which measure tells you how spread out the data is (biggest − smallest)?', a: 'range' },
    ];
    const c = R.pick(cases), opts = R.shuffle(['mean', 'median', 'mode', 'range']);
    return { prompt: c.s, answer: { type: 'choice', value: opts.indexOf(c.a), choices: opts }, hint: 'MOde = MOst often. MEDian = MIDdle. MEAN = the "fair share" one.', working: [`${c.s.replace('Which average is', 'The').replace('Which average do you find by', 'The one you find by').replace('Which measure tells you', 'The measure that tells you')}: <b>${c.a}</b>.`], finalAnswer: c.a, skill: 'vocab' };
  }

  const choiceQ = (prompt, options, correct, hint, working, skill) => {
    const order = R.shuffle(options.map((_, i) => i));
    return { prompt, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct], skill };
  };

  // ----- outliers -----
  const outlierScens = [
    { intro: (l) => `Harper's last test scores (out of 100) were: <b>${l}</b>.`, unit: '', word: 'score', clo: 70, chi: 88, dir: 'low', ovLo: 6, ovHi: 30 },
    { intro: (l) => `The ages of the people waiting at a bus stop are: <b>${l}</b>.`, unit: 'years', word: 'age', clo: 12, chi: 19, dir: 'high', ovLo: 66, ovHi: 88 },
    { intro: (l) => `The amounts (in $) some friends spent at the school gala were: <b>${l}</b>.`, unit: '$', word: 'amount', clo: 4, chi: 11, dir: 'high', ovLo: 44, ovHi: 70 },
    { intro: (l) => `The minutes some students spent on homework were: <b>${l}</b>.`, unit: 'minutes', word: 'time', clo: 20, chi: 36, dir: 'high', ovLo: 96, ovHi: 130 },
    { intro: (l) => `The heights of some seedlings (cm) are: <b>${l}</b>.`, unit: 'cm', word: 'height', clo: 9, chi: 17, dir: 'high', ovLo: 42, ovHi: 62 },
    { intro: (l) => `Goals scored by a netball team in each game: <b>${l}</b>.`, unit: 'goals', word: 'score', clo: 22, chi: 31, dir: 'low', ovLo: 2, ovHi: 7 },
    { intro: (l) => `The weights (kg) of the dogs at the dog park are: <b>${l}</b>.`, unit: 'kg', word: 'weight', clo: 6, chi: 14, dir: 'high', ovLo: 48, ovHi: 66 },
  ];
  function outlierData(level) {
    const sc = R.pick(outlierScens);
    const n = level === 1 ? 4 : R.pick([4, 5, 5, 6]);
    let cluster = null, m = 0;
    for (let t = 0; t < 400; t++) {
      const a = []; for (let i = 0; i < n; i++) a.push(R.int(sc.clo, sc.chi));
      const s = sum(a);
      if (s % n) continue;
      if (new Set(a).size < n - 1) continue;
      cluster = a; m = s / n; break;
    }
    if (!cluster) { cluster = Array(n).fill(sc.clo); m = sc.clo; }
    const k = n + 1, valid = [];
    for (let v = sc.ovLo; v <= sc.ovHi; v++) if (((v - m) % k + k) % k === 0) valid.push(v);
    const out = valid.length ? R.pick(valid) : sc.ovLo;
    const all = R.shuffle(cluster.concat([out]));
    const s2 = sorted(all), meanAll = (sum(cluster) + out) / (n + 1);
    const med = s2.length % 2 ? s2[(s2.length - 1) / 2] : (s2[s2.length / 2 - 1] + s2[s2.length / 2]) / 2;
    return { sc, n, cluster, m, out, all, meanAll, med };
  }
  function outlierQ(level) {
    const d = outlierData(level), c = d.sc, u = c.unit;
    const k = R.pick(level === 1 ? ['which', 'which', 'effect'] : level === 2 ? ['which', 'effect', 'without', 'better'] : ['without', 'meanall', 'better', 'effect']);
    if (k === 'which') {
      return {
        prompt: `${c.intro(list(d.all))} Which value is the <b>outlier</b> (the odd one out)?`,
        answer: ansObj(d.out, u),
        hint: 'The outlier is the one value that sits a long way away from all the others.',
        working: [`In order: ${list(sorted(d.all))}.`, `Most of the values are between ${Math.min(...d.cluster)} and ${Math.max(...d.cluster)}.`, `${N.fmt(d.out)} is a long way from the rest, so the outlier is <b>${fmtU(d.out, u)}</b>.`],
        finalAnswer: fmtU(d.out, u), skill: 'outlier',
      };
    }
    if (k === 'effect') {
      const opts = ['It pulls the mean a long way <b>up</b>', 'It pulls the mean a long way <b>down</b>', 'It makes <b>no difference</b> to the mean'];
      const correct = c.dir === 'high' ? 0 : 1;
      return choiceQ(`${c.intro(list(d.all))} The value <b>${N.fmt(d.out)}</b> is an outlier. What does it do to the <b>mean</b>?`, opts, correct,
        'Work out the mean with the outlier and the mean without it, then compare.',
        [`Without the outlier the mean is ${N.fmt(d.m)}.`, `With the outlier the mean is ${N.fmt(d.meanAll)}.`,
          `The outlier is much ${c.dir === 'high' ? 'bigger' : 'smaller'} than the rest, so it drags the mean ${c.dir === 'high' ? 'up' : 'down'}: <b>${opts[correct].replace(/<\/?b>/g, '')}</b>.`], 'outlier');
    }
    if (k === 'without') {
      return {
        prompt: `${c.intro(list(d.all))} <b>${N.fmt(d.out)}</b> is an outlier. Work out the <b>mean of the other values</b> (leave the outlier out).`,
        answer: ansObj(d.m, u),
        hint: `Cross out ${N.fmt(d.out)} first. Then add the ${d.n} values that are left and divide by ${d.n}.`,
        working: [`Leave out the outlier ${N.fmt(d.out)}. The other values are ${list(d.cluster)}.`,
          `Add: ${plus(d.cluster)} = ${sum(d.cluster)}.`,
          `There are ${d.n} of them: ${sum(d.cluster)} ÷ ${d.n} = ${N.fmt(d.m)}.`,
          `Mean without the outlier = <b>${fmtU(d.m, u)}</b>.`],
        finalAnswer: fmtU(d.m, u), skill: 'outlier',
      };
    }
    if (k === 'meanall') {
      return {
        prompt: `${c.intro(list(d.all))} Work out the <b>mean</b> of all ${d.n + 1} values.`,
        answer: ansObj(d.meanAll, u),
        hint: 'Add every value (including the odd one out), then divide by how many there are.',
        working: [`Add: ${plus(d.all)} = ${sum(d.all)}.`,
          `There are ${d.n + 1} values: ${sum(d.all)} ÷ ${d.n + 1} = ${N.fmt(d.meanAll)}.`,
          `Mean = <b>${fmtU(d.meanAll, u)}</b>. Notice the outlier ${N.fmt(d.out)} has dragged it ${c.dir === 'high' ? 'up' : 'down'} (without it the mean is ${N.fmt(d.m)}).`],
        finalAnswer: fmtU(d.meanAll, u), skill: 'outlier',
      };
    }
    const opts = ['the mean', 'the median', 'the mode'];
    return choiceQ(`${c.intro(list(d.all))} There is an outlier of <b>${N.fmt(d.out)}</b>. Which average describes this data <b>best</b>?`, opts, 1,
      'The mean uses every value, so one very odd value drags it. The median only cares about the middle.',
      [`Mean of all of them = ${N.fmt(d.meanAll)} — but almost none of the values are near that.`,
        `Median (the middle value in order) = ${N.fmt(d.med)}, which is right in the middle of the group.`,
        `An outlier drags the mean but hardly moves the median, so use <b>the median</b>.`], 'outlier');
  }

  // ----- which average suits the situation -----
  function suitAverageQ() {
    const cases = [
      { s: 'A shoe shop wants to know which size to order the most of.', a: 'mode', why: 'they want the <b>most popular</b> size, and "most often" is the mode.' },
      { s: 'The school canteen wants to know the most popular lunch.', a: 'mode', why: 'lunches are words, so you cannot add them up. "Most popular" is the mode.' },
      { s: 'Five friends want to share the cost of a pizza fairly.', a: 'mean', why: 'a <b>fair share</b> for everyone is exactly what the mean is.' },
      { s: 'A teacher wants the class’s average test mark, and all the marks are close together.', a: 'mean', why: 'there is no odd value, so the mean uses all the information.' },
      { s: 'House prices on a street, where one house sold for $5 million and the rest for about $700,000.', a: 'median', why: 'the $5 million house is an <b>outlier</b> that drags the mean up, so the median is fairer.' },
      { s: 'The ages of people at a party: eight teenagers and one 90 year old great-grandad.', a: 'median', why: 'the 90 is an <b>outlier</b>, so the median describes the group better.' },
      { s: 'The most common number of goals a team scores in a game.', a: 'mode', why: '"most common" always means the mode.' },
      { s: 'Sharing 20 lollies evenly between 5 people.', a: 'mean', why: 'sharing evenly is the <b>fair share</b>, which is the mean.' },
      { s: 'Pay at a company where the boss earns 20 times more than everyone else.', a: 'median', why: 'the boss’s pay is an <b>outlier</b> that pulls the mean up, so the median is fairer.' },
      { s: 'The favourite colour chosen by a class.', a: 'mode', why: 'colours are words, so only the mode works.' },
      { s: 'Working out how many mm of rain fell per day, on average, over a normal week.', a: 'mean', why: 'the total shared out over the days is the mean.' },
      { s: 'Times for a 100 m sprint where one runner tripped and took three times as long.', a: 'median', why: 'the tripped runner’s time is an <b>outlier</b>.' },
    ];
    const c = R.pick(cases), opts = ['mean', 'median', 'mode'];
    return choiceQ(`Which average would be <b>best</b> here?<br>${c.s}`, opts, opts.indexOf(c.a),
      '<b>Mode</b> = most popular. <b>Median</b> = middle, good when there is an odd value. <b>Mean</b> = fair share.',
      [`${c.s}`, `Here, ${c.why}`, `So use the <b>${c.a}</b>.`], 'choose-average');
  }

  // ----- comparing two data sets with mean AND range -----
  const comparePairs = [
    { a: 'Ana', b: 'Ben', line: 'Ana and Ben scored these goals in their last few netball games:', unit: 'goals', lo: 8, hi: 30, subj: 'Who', meanAsk: 'did <b>better on average</b>', bw: 'scored more on average' },
    { a: 'The Tuis', b: 'The Kea', line: 'Two teams scored these points in their last few matches:', unit: 'points', lo: 10, hi: 40, subj: 'Which team', meanAsk: 'did <b>better on average</b>', bw: 'scored more on average' },
    { a: 'Mia', b: 'Jack', line: 'Mia and Jack got these marks in their weekly spelling tests:', unit: '', lo: 8, hi: 20, subj: 'Who', meanAsk: 'did <b>better on average</b>', bw: 'did better on average' },
    { a: 'Room 5', b: 'Room 6', line: 'Room 5 and Room 6 read these numbers of books each week:', unit: 'books', lo: 5, hi: 25, subj: 'Which class', meanAsk: 'read <b>more on average</b>', bw: 'read more on average' },
    { a: 'Bus A', b: 'Bus B', line: 'Two buses were late by these numbers of minutes each morning:', unit: 'minutes', lo: 0, hi: 16, subj: 'Which bus', meanAsk: 'was <b>later on average</b>', bw: 'was later on average' },
  ];
  function compareData(level, split) {
    const p = R.pick(comparePairs), n = level === 1 ? 4 : 5;
    for (let t = 0; t < 300; t++) {
      const mA = R.int(p.lo + 2, p.hi - 2), mB = R.int(p.lo + 2, p.hi - 2);
      if (mA === mB) continue;
      const A = listWithMean(n, p.lo, p.hi, mA), B = listWithMean(n, p.lo, p.hi, mB);
      if (sum(A) !== mA * n || sum(B) !== mB * n) continue;
      const rA = Math.max(...A) - Math.min(...A), rB = Math.max(...B) - Math.min(...B);
      if (rA === rB || rA === 0 || rB === 0) continue;
      const betterMean = mA > mB ? 0 : 1, moreConsistent = rA < rB ? 0 : 1;
      if (split && betterMean === moreConsistent) continue;
      return { p, n, A, B, mA, mB, rA, rB, betterMean, moreConsistent };
    }
    const p2 = comparePairs[0];
    return { p: p2, n: 4, A: [12, 14, 16, 18], B: [10, 20, 12, 18], mA: 15, mB: 15, rA: 6, rB: 10, betterMean: 0, moreConsistent: 0 };
  }
  function compareQ(level) {
    const k = R.pick(level === 1 ? ['summary', 'summary', 'average'] : level === 2 ? ['average', 'consistent', 'summary', 'diff'] : ['consistent', 'statement', 'statement', 'diff']);
    if (k === 'summary') {
      const p = R.pick(comparePairs), m = R.int(p.lo + 3, p.hi - 3);
      const r1v = R.int(2, 5), r2v = r1v + R.int(4, 10);
      const flip = R.chance(0.5), names = flip ? [p.b, p.a] : [p.a, p.b];
      const ask = R.chance(0.5);
      const rows = `<table class="data"><tr><th></th><th>Mean</th><th>Range</th></tr><tr><th>${names[0]}</th><td>${m}</td><td>${r1v}</td></tr><tr><th>${names[1]}</th><td>${m}</td><td>${r2v}</td></tr></table>`;
      const q = ask ? `${p.subj} is <b>more consistent</b> (less spread out)?` : `${p.subj} is <b>less consistent</b> (more spread out)?`;
      const correct = ask ? 0 : 1;
      const o = choiceQ(`${names[0]} and ${names[1]} have the same mean. ${q}`, names, correct,
        'Same mean means they are equally good on average. The <b>range</b> tells you who is more spread out. A <b>smaller range</b> = more consistent.',
        [`Both means are ${m}, so on average they are the same.`,
          `${names[0]}: range ${r1v}. ${names[1]}: range ${r2v}.`,
          `A ${ask ? 'smaller' : 'bigger'} range means ${ask ? 'more' : 'less'} consistent, so the answer is <b>${names[correct]}</b>.`], 'compare');
      o.visual = rows;
      return o;
    }
    const d = compareData(level, k === 'statement');
    const intro = `${d.p.line}<br><b>${d.p.a}:</b> ${list(d.A)}<br><b>${d.p.b}:</b> ${list(d.B)}`;
    const names = [d.p.a, d.p.b];
    const meanLine = `${d.p.a}: mean = ${sum(d.A)} ÷ ${d.n} = ${N.fmt(d.mA)}. &nbsp; ${d.p.b}: mean = ${sum(d.B)} ÷ ${d.n} = ${N.fmt(d.mB)}.`;
    const rangeLine = `${d.p.a}: range = ${Math.max(...d.A)} − ${Math.min(...d.A)} = ${d.rA}. &nbsp; ${d.p.b}: range = ${Math.max(...d.B)} − ${Math.min(...d.B)} = ${d.rB}.`;
    if (k === 'average') {
      return choiceQ(`${intro}<br>${d.p.subj} ${d.p.meanAsk}?`, names, d.betterMean,
        'Work out the mean for each one (add them up, divide by how many), then compare.',
        [meanLine, `${N.fmt(Math.max(d.mA, d.mB))} is bigger, so <b>${names[d.betterMean]}</b> ${d.p.bw}.`], 'compare');
    }
    if (k === 'consistent') {
      return choiceQ(`${intro}<br>${d.p.subj} is <b>more consistent</b> (results less spread out)?`, names, d.moreConsistent,
        'Consistent means the numbers are close together. Work out the <b>range</b> (biggest − smallest) for each.',
        [rangeLine, `${Math.min(d.rA, d.rB)} is the smaller range, so <b>${names[d.moreConsistent]}</b> is more consistent.`], 'compare');
    }
    if (k === 'statement') {
      const good = names[d.betterMean], steady = names[d.moreConsistent];
      const opts = [
        `${good} ${d.p.bw}, but ${steady} is more consistent`,
        `${steady} ${d.p.bw}, but ${good} is more consistent`,
        `${good} ${d.p.bw} and is more consistent`,
        `They have the same mean and the same range`,
      ];
      return choiceQ(`${intro}<br>Which statement is <b>true</b>?`, opts, 0,
        'You need two things: the <b>mean</b> (who is better on average) and the <b>range</b> (who is more consistent).',
        [meanLine, rangeLine, `Bigger mean → ${good} ${d.p.bw}. Smaller range → ${steady} is more consistent.`,
          `Answer: <b>${opts[0]}</b>.`], 'compare');
    }
    const diff = Math.abs(d.mA - d.mB);
    const diffStr = d.p.unit && diff === 1 ? `${N.fmt(diff)} ${d.p.unit.replace(/s$/, '')}` : fmtU(diff, d.p.unit);
    return {
      prompt: `${intro}<br>How much <b>bigger</b> is ${names[d.betterMean]}'s mean than ${names[1 - d.betterMean]}'s?`,
      answer: ansObj(diff, d.p.unit),
      hint: 'Work out both means first, then subtract the smaller from the bigger.',
      working: [meanLine, `${N.fmt(Math.max(d.mA, d.mB))} − ${N.fmt(Math.min(d.mA, d.mB))} = ${N.fmt(diff)}.`,
        `<b>${diffStr}</b> bigger.`],
      finalAnswer: diffStr, skill: 'compare',
    };
  }

  // ----- mean straight from a total -----
  function totalMeanQ(level) {
    const scens = [
      { q: (n, t) => `Harper's ${n} test scores add up to <b>${t}</b>. What is the <b>mean</b> score?`, unit: '', lo: 10, hi: 20, noun: 'test scores' },
      { q: (n, t) => `A netball team scored <b>${t}</b> goals in ${n} games. What was the <b>mean</b> number of goals per game?`, unit: 'goals', lo: 12, hi: 30, noun: 'games' },
      { q: (n, t) => `${n} friends spent <b>$${t}</b> altogether at the school canteen. What is the <b>mean</b> amount each friend spent?`, unit: '$', lo: 3, hi: 12, noun: 'friends' },
      { q: (n, t) => `The rain over ${n} days added up to <b>${t} mm</b>. What is the <b>mean</b> rainfall per day?`, unit: 'mm', lo: 2, hi: 15, noun: 'days' },
      { q: (n, t) => `A class of ${n} students read <b>${t}</b> books in the holidays. What is the <b>mean</b> number of books per student?`, unit: 'books', lo: 2, hi: 8, noun: 'students' },
      { q: (n, t) => `Harper walked <b>${t} km</b> over ${n} days. What is the <b>mean</b> distance per day?`, unit: 'km', lo: 2, hi: 9, noun: 'days' },
      { q: (n, t) => `${n} netball games lasted <b>${t}</b> minutes altogether. What is the <b>mean</b> length of a game?`, unit: 'minutes', lo: 30, hi: 60, noun: 'games' },
    ];
    const s = R.pick(scens);
    const n = level === 1 ? R.pick([4, 5]) : level === 2 ? R.pick([5, 6, 8]) : R.pick([6, 8, 10, 12]);
    const half = level >= 2 && n % 2 === 0 && R.chance(0.3);
    const m = half ? R.int(s.lo, s.hi - 1) + 0.5 : R.int(s.lo, s.hi);
    const total = m * n;
    return {
      prompt: s.q(n, N.fmt(total)),
      answer: ansObj(m, s.unit),
      hint: 'You already have the total. Mean = total ÷ how many there are.',
      working: [`Mean = <b>total ÷ how many</b>.`, `Total = ${N.fmt(total)}, and there are ${n} ${s.noun}.`, `${N.fmt(total)} ÷ ${n} = ${N.fmt(m)}.`, `Mean = <b>${fmtU(m, s.unit)}</b>.`],
      finalAnswer: fmtU(m, s.unit), skill: 'mean-from-total',
    };
  }

  function calc(level) {
    const ctx = 'plain';
    if (level === 1) return R.pick([() => meanQ(1, ctx), () => meanQ(1, ctx), () => medianQ(1, ctx), () => modeQ(1, ctx), () => rangeQ(1, ctx), whichAverageQ, suitAverageQ, () => totalMeanQ(1), () => outlierQ(1)])();
    if (level === 2) return R.pick([() => meanQ(2, ctx), () => meanQ(2, ctx), () => medianQ(2, ctx), () => medianQ(2, ctx), () => modeQ(2, ctx), () => rangeQ(2, ctx), suitAverageQ, () => totalMeanQ(2), () => outlierQ(2), () => outlierQ(2), () => compareQ(2)])();
    return R.pick([() => meanQ(3, ctx), () => medianQ(3, ctx), () => missingQ(ctx), () => addValueQ(ctx), freqTableQ, freqTableQ, () => outlierQ(3), () => outlierQ(3), () => compareQ(3), () => totalMeanQ(3), suitAverageQ])();
  }
  function word(level) {
    const ctx = R.pick(['scores', 'netball', 'temp', 'heights', 'rugby', 'sleep', 'money', 'swim']);
    if (level === 1) return R.pick([() => meanQ(1, ctx), () => medianQ(1, ctx), () => modeQ(1, ctx), () => rangeQ(1, ctx), () => totalMeanQ(1), () => outlierQ(1), suitAverageQ, () => compareQ(1)])();
    if (level === 2) return R.pick([() => meanQ(2, ctx), () => meanQ(2, ctx), () => medianQ(2, ctx), () => modeQ(2, ctx), () => rangeQ(2, ctx), () => totalMeanQ(2), () => outlierQ(2), () => compareQ(2), () => compareQ(2), suitAverageQ])();
    return R.pick([() => meanQ(3, ctx), () => medianQ(3, ctx), () => missingQ(ctx), () => missingQ(ctx), () => addValueQ(ctx), freqTableQ, () => outlierQ(3), () => outlierQ(3), () => compareQ(3), () => compareQ(3), () => totalMeanQ(3)])();
  }

  HL.registerTopic({
    id: 'averages', subject: 'maths', strand: 'statistics', order: 1,
    name: 'Mean, median, mode & range', short: 'Averages',
    blurb: 'Summarise a list of numbers with one number: mean, median, mode, or the spread (range).',
    example: '3, 7, 7, 9, 14 → mean 8, median 7, mode 7, range 11',
    animal: 'frog',
    learn: {
      what: '<p>Picture the numbers as <b>friends lined up by height</b>. An <b>average</b> is one number that stands for the whole line. The <b>mean</b> is the "fair share" height if everyone were the same. The <b>median</b> is the <b>middle friend</b>. The <b>mode</b> is the height <b>most friends</b> share. The <b>range</b> is not an average: it is tallest − shortest, how spread out the line is.</p>',
      visual: (() => {
        const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
        const B = '#2A6FA5', G = '#2FA97A', vals = [3, 4, 6, 10, 12], u = 11, base = 178, x0 = 52, w = 30, gap = 14;
        let b = `<text x="8" y="20" font-size="14">3, 4, 6, 10, 12  (in order)</text>`;
        b += `<line x1="40" y1="${base}" x2="262" y2="${base}" stroke="${C.ink}" stroke-width="2"/>`;
        vals.forEach((v, i) => { const x = x0 + i * (w + gap), y = base - v * u; b += `<rect x="${x}" y="${y}" width="${w}" height="${v * u}" rx="3" fill="${[C.sky, C.mint, C.butter, C.peach, C.lav][i]}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y - (i === 2 ? 16 : 6)}" font-size="13" text-anchor="middle">${v}</text>`; });
        const my = base - 7 * u;
        b += `<line x1="40" y1="${my}" x2="262" y2="${my}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="7 4"/>`;
        b += `<ellipse cx="${x0 + 2 * (w + gap) + w / 2}" cy="${base - 32}" rx="24" ry="42" fill="none" stroke="${B}" stroke-width="2.5"/>`;
        b += `<text x="270" y="${my + 5}" font-size="14" fill="${C.rose}">mean = 7</text><text x="270" y="${my + 22}" font-size="13" fill="${C.rose}">35 ÷ 5</text>`;
        b += `<text x="270" y="152" font-size="14" fill="${B}">median = 6</text><text x="270" y="169" font-size="13" fill="${B}">middle one</text>`;
        b += `<text x="270" y="52" font-size="14" fill="${G}">range = 9</text><text x="270" y="69" font-size="13" fill="${G}">12 − 3</text>`;
        b += `<text x="8" y="206" font-size="13">no number repeats → <tspan fill="${G}">no mode</tspan></text>`;
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        '<b>Mean</b> = add them all up ÷ how many there are',
        '<b>Median</b> = put them <b>in order</b>, take the <b>middle</b> one (two middles → add and halve)',
        '<b>Mode</b> = the value that appears <b>most often</b> (can be none, or more than one)',
        '<b>Range</b> = biggest − smallest',
        '<b>Missing value</b>: total = mean × count, then subtract the ones you know',
        '<b>Mean from a total</b>: mean = <b>total ÷ how many</b> (you do not need the separate values)',
        '<b>Outlier</b> = one value a <b>long way</b> from all the others. It drags the <b>mean</b>, but hardly moves the median',
        'Which average? <b>mode</b> = most popular, <b>median</b> = when there is an outlier, <b>mean</b> = fair share',
        'Comparing two sets: the <b>mean</b> says who is <b>better</b>, the <b>range</b> says who is more <b>consistent</b> (smaller range = more consistent)',
      ],
      steps: [
        '<b>Ask: which one do they want?</b> Mean (add and divide), median (middle), mode (most often) or range (biggest − smallest)?',
        '<b>Median or range?</b> Line the friends up: write the numbers <b>in order</b> first.',
        '<b>Mean?</b> Add them all, count them, divide: "total ÷ how many".',
        '<b>Median?</b> Cross off one from each end until you reach the middle. Two left → add and halve.',
        '<b>Mode?</b> Look for the repeat. <b>Range?</b> Tallest − shortest.',
        '<b>Odd one out?</b> If one value is miles away from the rest it is an <b>outlier</b>. It drags the mean, so the <b>median</b> is usually the better summary.',
        '<b>Comparing two people or teams?</b> Do <b>both</b>: the mean (who is better) <b>and</b> the range (who is more consistent).',
      ],
      examples: [
        (() => {
          const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
          const vals = [4, 8, 5, 7], base = 118, u = 10, x0 = 30, w = 34, gap = 16;
          let b = `<line x1="20" y1="${base}" x2="230" y2="${base}" stroke="${C.ink}" stroke-width="2"/>`;
          vals.forEach((v, i) => { const x = x0 + i * (w + gap), y = base - v * u; b += `<rect x="${x}" y="${y}" width="${w}" height="${v * u}" rx="3" fill="${[C.sky, C.mint, C.butter, C.peach][i]}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y - 6}" font-size="13" text-anchor="middle">${v}</text>`; });
          const my = base - 6 * u;
          b += `<line x1="20" y1="${my}" x2="230" y2="${my}" stroke="${C.rose}" stroke-width="3" stroke-dasharray="7 4"/><text x="238" y="${my + 5}" font-size="14" fill="${C.rose}">mean = 6</text><text x="238" y="${my + 22}" font-size="13" fill="${C.rose}">fair share</text>`;
          b += `<text x="20" y="18" font-size="14">4 + 8 + 5 + 7 = 24 → 24 ÷ 4 = 6</text>`;
          return { q: 'Find the <b>mean</b> of 4, 8, 5, 7.', visual: `<svg viewBox="0 0 320 130" width="320" height="130" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture 4 friends of heights 4, 8, 5, 7. The mean is the height if they <b>shared it out evenly</b>.', '1. Which one? <b>Mean</b> → add and divide.', '2. Add them all: 4 + 8 + 5 + 7 = 24.', '3. How many? 4. Divide: 24 ÷ 4 = <b>6</b>.'], a: 'mean = 6' };
        })(),
        (() => {
          const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
          const box = (x, y, v, fill) => `<rect x="${x}" y="${y}" width="34" height="30" rx="5" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + 17}" y="${y + 20}" font-size="15" text-anchor="middle">${v}</text>`;
          let b = `<text x="20" y="16" font-size="13">as given:</text>` + [9, 2, 6, 4].map((v, i) => box(20 + i * 44, 24, v, '#fff')).join('');
          b += `<text x="105" y="76" font-size="13" fill="${C.rose}" text-anchor="middle">line them up in order ↓</text>`;
          b += `<text x="20" y="96" font-size="13">in order:</text>` + [2, 4, 6, 9].map((v, i) => box(20 + i * 44, 104, v, i === 1 || i === 2 ? C.pink : '#fff')).join('');
          b += `<text x="210" y="118" font-size="13" fill="${C.rose}">← middle two</text><text x="210" y="136" font-size="13">(4 + 6) ÷ 2 = 5</text>`;
          return { q: 'Find the <b>median</b> of 9, 2, 6, 4.', visual: `<svg viewBox="0 0 320 145" width="320" height="145" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the 4 friends <b>lined up by height</b>: 2, 4, 6, 9.', '1. Which one? <b>Median</b> → the middle friend.', '2. Are they in order? No! So I line them up: 2, 4, 6, 9.', '3. Cross off the ends: 2 and 9 go. Two are left: 4 and 6.', '4. Two middles → add and halve: (4 + 6) ÷ 2 = <b>5</b>.'], a: 'median = 5' };
        })(),
        (() => {
          const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
          const vals = [3, 6, 8, 8, 12, 15, 20];
          let b = '';
          vals.forEach((v, i) => { const x = 16 + i * 42, mid = i === 3; b += `<rect x="${x}" y="30" width="36" height="30" rx="5" fill="${mid ? C.pink : '#fff'}" stroke="${mid ? C.rose : C.ink}" stroke-width="${mid ? 3 : 1.5}"/><text x="${x + 18}" y="50" font-size="15" text-anchor="middle">${v}</text>`; if (!mid) b += `<line x1="${x + 4}" y1="56" x2="${x + 32}" y2="34" stroke="#9a8a98" stroke-width="2.5"/>`; });
          b += `<text x="16" y="16" font-size="13">in order, cross off one from each end:</text><text x="160" y="82" font-size="13" fill="${C.rose}" text-anchor="middle">cross off 3 from each end → middle = 8</text>`;
          return { q: 'Find the <b>median</b> and the <b>mode</b> of 12, 3, 8, 15, 8, 6, 20.', visual: `<svg viewBox="0 0 320 92" width="320" height="92" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture 7 friends <b>lined up by height</b>: 3, 6, 8, 8, 12, 15, 20.', '1. Are they in order? No, so line them up first.', '2. Median: cross off one from each end, 3 times. The middle friend is <b>8</b>.', '3. Mode: which height repeats? 8 appears twice → mode = <b>8</b>.'], a: 'median = 8, mode = 8' };
        })(),
        { q: 'Find the <b>mode</b> and the <b>range</b> of 5, 9, 5, 12, 7, 5.', working: ['Picture the friends lined up: 5, 5, 5, 7, 9, 12.', '1. Mode: which height do most friends share? Three of them are 5 → mode = <b>5</b>.', '2. Range: tallest − shortest = 12 − 5 = <b>7</b>.'], a: 'mode = 5, range = 7' },
        { q: 'The mean of 5 numbers is 12. Four of them are 10, 15, 8 and 14. Find the fifth number.', working: ['Picture 5 friends who would all be height 12 if they <b>shared evenly</b>. So their heights add up to 5 lots of 12.', '1. Which one? Mean, but backwards: I need the <b>total</b> first.', '2. Total = mean × count = 12 × 5 = 60.', '3. Add the four I know: 10 + 15 + 8 + 14 = 47.', '4. What is left? 60 − 47 = <b>13</b>.'], a: '13' },
        { q: 'Harper\'s netball team scored 18, 22, 15, 25 and 20 goals in five games. What was the mean number of goals per game?', working: ['Picture the 5 games as 5 friends holding score cards. The mean is the score if every game had <b>shared the goals evenly</b>.', '1. Which one? "Mean" → add and divide.', '2. Add: 18 + 22 + 15 + 25 + 20 = 100.', '3. How many games? 5. Divide: 100 ÷ 5 = <b>20</b>.'], a: '20 goals per game' },
        (() => {
          const C = { rose: '#E0568C', sky: '#A9D8F5', ink: '#4A3B48' }, B = '#2A6FA5', G = '#2FA97A';
          const X = (v) => 24 + v * 3.2;
          let b = `<line x1="20" y1="96" x2="320" y2="96" stroke="${C.ink}" stroke-width="2"/>`;
          for (let v = 0; v <= 90; v += 10) b += `<line x1="${X(v)}" y1="96" x2="${X(v)}" y2="102" stroke="${C.ink}" stroke-width="2"/>` + (v % 20 === 0 ? `<text x="${X(v)}" y="118" font-size="13" text-anchor="middle">${v}</text>` : '');
          [13, 14, 15, 16].forEach((v, i) => { b += `<circle cx="${X(v)}" cy="${84 - i * 15}" r="7" fill="${C.sky}" stroke="${C.ink}" stroke-width="1.5"/>`; });
          b += `<circle cx="${X(82)}" cy="84" r="9" fill="${C.rose}" stroke="${C.ink}" stroke-width="2"/>`;
          b += `<text x="${X(15)}" y="18" font-size="13" text-anchor="middle" fill="${B}">the group</text>`;
          b += `<text x="${X(82)}" y="60" font-size="13" text-anchor="middle" fill="${C.rose}">outlier!</text>`;
          b += `<text x="20" y="138" font-size="13" fill="${C.rose}">mean of all 5 = 28 → nobody is near 28</text>`;
          b += `<text x="20" y="158" font-size="13" fill="${G}">median = 15 → that is the group</text>`;
          return { q: 'Ages at a bus stop: <b>13, 14, 15, 16, 82</b>. Which value is the <b>outlier</b>, and why is the <b>median</b> a better summary than the mean?',
            visual: `<svg viewBox="0 0 340 168" width="340" height="168" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the friends <b>lined up by height</b> — but one of them is standing right down the far end of the field.',
              '1. Is one value miles from the rest? Yes: <b>82</b>. That is the outlier.',
              '2. Mean of all 5: 13 + 14 + 15 + 16 + 82 = 140, and 140 ÷ 5 = <b>28</b>.',
              '3. Does 28 describe the group? No! Four of the five are teenagers.',
              '4. Median (middle one in order) = <b>15</b>, which really does describe the group.'],
            a: 'outlier = 82; median 15 is the better summary (the mean of 28 is dragged up by the outlier)' };
        })(),
        { q: 'A shoe shop sold these sizes today: <b>4, 5, 5, 5, 6, 6, 7</b>. Which average should the shop use to decide what to order more of?',
          visual: '<table class="data"><tr><th>Shoe size</th><th>How many sold</th></tr><tr><td>4</td><td>1</td></tr><tr style="background:#F9A8C9"><td><b>5</b></td><td><b>3</b></td></tr><tr><td>6</td><td>2</td></tr><tr><td>7</td><td>1</td></tr></table>',
          working: ['Picture the shop owner <b>deciding which box of shoes to order</b>. She wants the size most feet are.',
            '1. What does she actually want? The <b>most popular</b> size.',
            '2. Which average means "most often"? The <b>mode</b>.',
            '3. Size 5 sold 3 pairs, more than any other → mode = <b>5</b>.',
            '4. (The mean would be 5.4 — and you cannot buy a size 5.4 shoe!)'],
          a: 'use the mode: size 5' },
        (() => {
          const C = { rose: '#E0568C', sky: '#A9D8F5', peach: '#FFC79A', ink: '#4A3B48' }, B = '#2A6FA5';
          const A = [7, 8, 9, 10, 11], Bn = [2, 5, 9, 13, 16], X = (v) => 34 + v * 17;
          let b = `<text x="8" y="34" font-size="13" fill="${B}">Ana</text><text x="8" y="90" font-size="13" fill="${C.rose}">Ben</text>`;
          b += `<line x1="${X(0)}" y1="40" x2="${X(16)}" y2="40" stroke="#d9cfe0" stroke-width="1.5"/>`;
          b += `<line x1="${X(0)}" y1="96" x2="${X(16)}" y2="96" stroke="#d9cfe0" stroke-width="1.5"/>`;
          A.forEach((v) => { b += `<circle cx="${X(v)}" cy="40" r="7" fill="${C.sky}" stroke="${C.ink}" stroke-width="1.5"/>`; });
          Bn.forEach((v) => { b += `<circle cx="${X(v)}" cy="96" r="7" fill="${C.peach}" stroke="${C.ink}" stroke-width="1.5"/>`; });
          b += `<line x1="${X(9)}" y1="20" x2="${X(9)}" y2="112" stroke="${C.rose}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
          b += `<text x="${X(9)}" y="16" font-size="13" text-anchor="middle" fill="${C.rose}">mean 9 (both)</text>`;
          b += `<line x1="${X(7)}" y1="56" x2="${X(11)}" y2="56" stroke="${B}" stroke-width="2"/><text x="${X(13.5)}" y="60" font-size="13" fill="${B}">range 4</text>`;
          b += `<line x1="${X(2)}" y1="112" x2="${X(16)}" y2="112" stroke="${C.ink}" stroke-width="2"/><text x="${X(9)}" y="128" font-size="13" text-anchor="middle">range 14</text>`;
          return { q: 'Ana scored <b>7, 8, 9, 10, 11</b> goals. Ben scored <b>2, 5, 9, 13, 16</b>. Who is <b>more consistent</b>?',
            visual: `<svg viewBox="0 0 340 136" width="340" height="136" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture both of them lined up on the <b>same number line</b>. Ana’s dots huddle together; Ben’s are spread all over.',
              '1. Means: Ana 45 ÷ 5 = 9. Ben 45 ÷ 5 = 9. <b>Same on average!</b>',
              '2. So the mean cannot separate them. Use the <b>range</b>.',
              '3. Ana: 11 − 7 = <b>4</b>. Ben: 16 − 2 = <b>14</b>.',
              '4. Smaller range = closer together = more consistent → <b>Ana</b>.'],
            a: 'same mean (9), but Ana has the smaller range (4 v 14), so Ana is more consistent' };
        })(),
        (() => {
          const C = { mint: '#A6E3B8', butter: '#FFE98A', ink: '#4A3B48' }, G = '#2FA97A';
          let b = `<rect x="14" y="30" width="86" height="46" rx="8" fill="${C.butter}" stroke="${C.ink}" stroke-width="2"/><text x="57" y="60" font-size="18" text-anchor="middle">340</text>`;
          b += `<text x="57" y="22" font-size="13" text-anchor="middle">total</text>`;
          b += `<text x="118" y="60" font-size="16" text-anchor="middle" fill="${G}">÷ 5</text>`;
          for (let i = 0; i < 5; i++) { const x = 142 + i * 38; b += `<rect x="${x}" y="34" width="34" height="38" rx="6" fill="${C.mint}" stroke="${C.ink}" stroke-width="2"/><text x="${x + 17}" y="59" font-size="15" text-anchor="middle">68</text>`; }
          b += `<text x="218" y="22" font-size="13" text-anchor="middle">5 equal shares</text>`;
          b += `<text x="14" y="98" font-size="13">340 ÷ 5 = 68 → the mean score is 68</text>`;
          return { q: 'Harper’s <b>five</b> test scores add up to <b>340</b>. What is the <b>mean</b> score?',
            visual: `<svg viewBox="0 0 340 108" width="340" height="108" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>340 marks in one big pile</b>, shared out fairly into 5 equal piles.',
              '1. Do I know the total? Yes: 340. Do I know how many? Yes: 5.',
              '2. So I do not need the separate scores at all.',
              '3. Mean = total ÷ how many = 340 ÷ 5 = <b>68</b>.'],
            a: 'mean = 68' };
        })(),
      ],
      tips: [
        '<b>MO</b>de = <b>MO</b>st often. <b>MED</b>ian = <b>MID</b>dle. Mean = the one with the most work (add and divide).',
        'Always put the numbers in <b>order</b> before finding the median. Forgetting this is the number one mistake.',
        'In a frequency table, the mode is the <b>value</b> with the biggest frequency, not the frequency itself.',
        'Check: the mean must sit <b>between</b> the smallest and biggest number. If it does not, redo the adding.',
        'An <b>outlier</b> moves the mean a lot but the median hardly at all. That is why house prices and pay are reported as <b>medians</b>.',
        'Write <b>total = mean × how many</b> at the top of the page. Missing-value and "mean from a total" questions both come straight out of it.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
