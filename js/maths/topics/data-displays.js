/* Topic: Reading graphs & tables — bar charts, dot plots, pictographs, stem-and-leaf plots, two-way tables. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
  const cols = [C.pink, C.sky, C.mint, C.peach, C.lav, C.butter];
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const sorted = (arr) => arr.slice().sort((a, b) => a - b);
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-size="14" fill="${C.ink}">${body}</svg>`;
  const fracAns = (n, d) => ({ type: 'fraction', value: HL.num.simplify(n, d), placeholder: 'e.g. 3/4' });
  const choiceQ = (prompt, visual, options, correct, hint, working, skill) => {
    const order = R.shuffle(options.map((_, i) => i));
    return { prompt, visual, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct], skill };
  };
  const numQ = (prompt, visual, value, hint, working, skill) => ({ prompt, visual, answer: { type: 'number', value }, hint, working, finalAnswer: String(value), skill });
  const listStr = (arr) => arr.join(', ');
  const andList = (parts) => parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];

  // ----- scenarios -----
  const scenarios = [
    { title: 'Favourite fruit', who: 'students', cats: ['Apple', 'Pear', 'Kiwi', 'Grape', 'Plum', 'Peach'], verb: 'chose', extra: 'Banana' },
    { title: 'Pets owned', who: 'pets', cats: ['Dog', 'Cat', 'Fish', 'Bird', 'Rabbit'], verb: 'are', extra: 'Horse' },
    { title: 'Favourite sport', who: 'students', cats: ['Rugby', 'Netball', 'Soccer', 'Hockey', 'Swim'], verb: 'chose', extra: 'Tennis' },
    { title: 'How we get to school', who: 'students', cats: ['Walk', 'Bus', 'Car', 'Bike', 'Scooter'], verb: 'chose', extra: 'Train' },
    { title: 'Ice cream flavour', who: 'students', cats: ['Choc', 'Vanilla', 'Berry', 'Mint', 'Lime'], verb: 'chose', extra: 'Caramel' },
    { title: 'Favourite colour', who: 'students', cats: ['Red', 'Blue', 'Green', 'Pink', 'Purple', 'Orange'], verb: 'chose', extra: 'Yellow' },
  ];

  // ----- bar chart -----
  function barChart(level) {
    const sc = R.pick(scenarios);
    const n = level === 1 ? 4 : R.pick([4, 5]);
    const cats = R.sample(sc.cats, n);
    const step = level === 1 ? R.pick([1, 2]) : R.pick([2, 5, 10]);
    const maxUnits = 8;
    let vals; do { vals = cats.map(() => R.int(1, maxUnits) * step); } while (new Set(vals).size < n); // distinct so most/least is clear
    // draw
    const left = 48, right = 306, top = 20, bottom = 176, W = right - left, H = bottom - top;
    let b = '';
    for (let i = 0; i <= maxUnits; i++) {
      const y = bottom - (H * i) / maxUnits;
      b += `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${i === 0 ? C.ink : C.lav}" stroke-width="${i === 0 ? 2 : 1}"/>`;
      b += `<text x="${left - 6}" y="${y + 5}" text-anchor="end">${i * step}</text>`;
    }
    b += `<line x1="${left}" y1="${top - 8}" x2="${left}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
    const bw = W / n, barW = bw * 0.62;
    cats.forEach((c, i) => {
      const h = (H * vals[i]) / (maxUnits * step), x = left + bw * i + (bw - barW) / 2;
      b += `<rect x="${x}" y="${bottom - h}" width="${barW}" height="${h}" fill="${cols[i]}" stroke="${C.ink}" stroke-width="1.5" rx="3"/>`;
      b += `<text x="${x + barW / 2}" y="${bottom + 16}" text-anchor="middle">${c}</text>`;
    });
    b += `<text x="${(left + right) / 2}" y="${bottom + 36}" text-anchor="middle" font-weight="bold">${sc.title}</text>`;
    const visual = svg(320, 220, b);
    return { sc, cats, vals, visual, step };
  }
  function barCalc(level) {
    const d = barChart(level);
    const k = R.pick(level === 1 ? ['read', 'read', 'most'] : ['read', 'most', 'least']);
    if (k === 'read') {
      const i = R.int(0, d.cats.length - 1);
      return numQ(`Look at the bar chart. How many ${d.sc.who} ${d.sc.verb} <b>${d.cats[i]}</b>?`, d.visual, d.vals[i],
        `Find the ${d.cats[i]} bar and follow its top across to the scale on the left. The gridlines go up in ${d.step}s.`,
        [`The top of the ${d.cats[i]} bar lines up with ${d.vals[i]} on the scale.`, `<b>${d.vals[i]}</b> ${d.sc.who} ${d.sc.verb} ${d.cats[i]}.`], 'bar');
    }
    const want = k === 'most' ? Math.max(...d.vals) : Math.min(...d.vals), i = d.vals.indexOf(want);
    return choiceQ(`Look at the bar chart. Which was the <b>${k === 'most' ? 'most' : 'least'}</b> common?`, d.visual, d.cats, i,
      k === 'most' ? 'The tallest bar is the most common.' : 'The shortest bar is the least common.',
      [`The ${k === 'most' ? 'tallest' : 'shortest'} bar is ${d.cats[i]} (${want}).`, `Answer: <b>${d.cats[i]}</b>.`], 'bar');
  }
  function barWord(level) {
    const d = barChart(level);
    const k = R.pick(level === 1 ? ['more', 'total'] : level === 2 ? ['more', 'total', 'combined'] : ['more', 'total', 'fraction', 'fraction']);
    const total = sum(d.vals);
    if (k === 'more') {
      const [i, j] = R.pair(0, d.cats.length - 1);
      const hi = d.vals[i] > d.vals[j] ? i : j, lo = hi === i ? j : i;
      return numQ(`Look at the bar chart. How many more ${d.sc.who} ${d.sc.verb} <b>${d.cats[hi]}</b> than <b>${d.cats[lo]}</b>?`, d.visual, d.vals[hi] - d.vals[lo],
        'Read both bars from the scale, then subtract.',
        [`${d.cats[hi]} = ${d.vals[hi]}, ${d.cats[lo]} = ${d.vals[lo]}.`, `${d.vals[hi]} − ${d.vals[lo]} = <b>${d.vals[hi] - d.vals[lo]}</b>.`], 'bar');
    }
    if (k === 'total') return numQ(`Look at the bar chart. How many ${d.sc.who} were surveyed altogether?`, d.visual, total,
      'Read every bar and add them all up.',
      [`Bars: ${d.cats.map((c, i) => `${c} ${d.vals[i]}`).join(', ')}.`, `${d.vals.join(' + ')} = <b>${total}</b>.`], 'bar');
    if (k === 'combined') {
      const [i, j] = R.pair(0, d.cats.length - 1);
      return numQ(`Look at the bar chart. How many ${d.sc.who} ${d.sc.verb} <b>${d.cats[i]}</b> or <b>${d.cats[j]}</b>?`, d.visual, d.vals[i] + d.vals[j],
        'Read both bars, then add.',
        [`${d.cats[i]} = ${d.vals[i]}, ${d.cats[j]} = ${d.vals[j]}.`, `${d.vals[i]} + ${d.vals[j]} = <b>${d.vals[i] + d.vals[j]}</b>.`], 'bar');
    }
    const i = R.int(0, d.cats.length - 1), f = N.simplify(d.vals[i], total);
    if (f.d > 10) return barWord(level);
    return {
      prompt: `Look at the bar chart. What <b>fraction</b> of the ${d.sc.who} ${d.sc.verb} <b>${d.cats[i]}</b>? Give your answer in simplest form.`,
      visual: d.visual, answer: fracAns(d.vals[i], total),
      hint: 'Fraction = this bar ÷ total of all bars. Then simplify.',
      working: [`Total = ${d.vals.join(' + ')} = ${total}.`, `${d.cats[i]} = ${d.vals[i]}, so the fraction is ${N.fracHtml(d.vals[i], total)}.`, `Simplify: <b>${N.fracHtml(f.n, f.d)}</b>.`],
      finalAnswer: N.fracHtml(f.n, f.d), skill: 'bar',
    };
  }

  // ----- dot plot -----
  function dotPlot(level) {
    const sc = R.pick([
      { title: 'Goals scored per game', unit: 'goals', lo: 0, item: 'games' },
      { title: 'Number of siblings', unit: 'siblings', lo: 0, item: 'students' },
      { title: 'Books read this term', unit: 'books', lo: 0, item: 'students' },
      { title: 'Score out of 10 on a quiz', unit: 'points', lo: 4, item: 'students' },
      { title: 'Hours of sport per week', unit: 'hours', lo: 0, item: 'students' },
    ]);
    const span = level === 1 ? 5 : 7, values = []; for (let v = sc.lo; v < sc.lo + span; v++) values.push(v);
    let counts; do { counts = values.map(() => R.int(0, level === 1 ? 4 : 5)); } while (sum(counts) < 6 || counts.filter((c) => c === Math.max(...counts)).length !== 1 || counts[0] === 0 || counts[counts.length - 1] === 0);
    const left = 30, right = 290, baseY = 150, gap = (right - left) / (values.length - 1);
    let b = `<line x1="${left - 10}" y1="${baseY}" x2="${right + 10}" y2="${baseY}" stroke="${C.ink}" stroke-width="2"/>`;
    values.forEach((v, i) => {
      const x = left + gap * i;
      b += `<line x1="${x}" y1="${baseY}" x2="${x}" y2="${baseY + 6}" stroke="${C.ink}" stroke-width="2"/><text x="${x}" y="${baseY + 22}" text-anchor="middle">${v}</text>`;
      for (let k = 0; k < counts[i]; k++) b += `<circle cx="${x}" cy="${baseY - 12 - k * 22}" r="8" fill="${C.rose}" stroke="${C.ink}" stroke-width="1.5"/>`;
    });
    b += `<text x="160" y="${baseY + 44}" text-anchor="middle" font-weight="bold">${sc.title}</text>`;
    const data = []; values.forEach((v, i) => { for (let k = 0; k < counts[i]; k++) data.push(v); });
    return { sc, values, counts, data, visual: svg(320, 200, b) };
  }
  function dotCalc(level) {
    const d = dotPlot(level);
    const k = R.pick(level === 1 ? ['count', 'count', 'mode'] : ['count', 'mode', 'range', 'total']);
    if (k === 'count') {
      const idx = R.pick(d.values.map((_, i) => i).filter((i) => d.counts[i] > 0)); const v = d.values[idx];
      return numQ(`Look at the dot plot. How many ${d.sc.item} had exactly <b>${v}</b> ${d.sc.unit}?`, d.visual, d.counts[idx],
        `Count the dots stacked above ${v}.`, [`There are ${d.counts[idx]} dots above ${v}.`, `<b>${d.counts[idx]}</b> ${d.sc.item}.`], 'dot');
    }
    if (k === 'mode') {
      const m = d.values[d.counts.indexOf(Math.max(...d.counts))];
      return numQ(`Look at the dot plot. What is the <b>mode</b> (the most common value)?`, d.visual, m,
        'The mode is the value with the tallest stack of dots.', [`The tallest stack is above ${m}.`, `Mode = <b>${m}</b>.`], 'dot');
    }
    if (k === 'range') {
      const lo = Math.min(...d.data), hi = Math.max(...d.data);
      return numQ(`Look at the dot plot. What is the <b>range</b> of the data?`, d.visual, hi - lo,
        'Range = biggest value with a dot − smallest value with a dot.', [`Biggest = ${hi}, smallest = ${lo}.`, `${hi} − ${lo} = <b>${hi - lo}</b>.`], 'dot');
    }
    return numQ(`Look at the dot plot. How many ${d.sc.item} are shown altogether?`, d.visual, d.data.length,
      'Each dot is one of them. Count all the dots.', [`Dots: ${d.counts.join(' + ')} = ${d.data.length}.`, `<b>${d.data.length}</b> ${d.sc.item}.`], 'dot');
  }
  function dotWord(level) {
    const d = dotPlot(level);
    const k = R.pick(level === 1 ? ['more', 'atleast'] : level === 2 ? ['more', 'atleast', 'compare'] : ['median', 'median', 'atleast', 'mean']);
    if (k === 'more') {
      const [i, j] = R.pair(0, d.values.length - 1); const hi = d.counts[i] >= d.counts[j] ? i : j, lo = hi === i ? j : i;
      return numQ(`How many more ${d.sc.item} had <b>${d.values[hi]}</b> ${d.sc.unit} than <b>${d.values[lo]}</b> ${d.sc.unit}?`, d.visual, d.counts[hi] - d.counts[lo],
        'Count the dots in each stack, then subtract.', [`${d.values[hi]}: ${d.counts[hi]} dots. ${d.values[lo]}: ${d.counts[lo]} dots.`, `${d.counts[hi]} − ${d.counts[lo]} = <b>${d.counts[hi] - d.counts[lo]}</b>.`], 'dot');
    }
    if (k === 'atleast') {
      const cut = d.values[R.int(1, d.values.length - 2)]; const c = d.data.filter((v) => v >= cut).length;
      return numQ(`How many ${d.sc.item} had <b>${cut} or more</b> ${d.sc.unit}?`, d.visual, c,
        `Count the dots above ${cut} and above every number to the right of it.`, [`Stacks from ${cut} upwards: ${d.values.map((v, i) => v >= cut ? d.counts[i] : null).filter((x) => x !== null).join(' + ')} = ${c}.`, `<b>${c}</b> ${d.sc.item}.`], 'dot');
    }
    if (k === 'compare') {
      const cut = d.values[R.int(1, d.values.length - 2)]; const below = d.data.filter((v) => v < cut).length;
      return numQ(`How many ${d.sc.item} had <b>fewer than ${cut}</b> ${d.sc.unit}?`, d.visual, below,
        `Count the dots to the left of ${cut} (do not include ${cut} itself).`, [`Stacks below ${cut}: ${d.values.map((v, i) => v < cut ? d.counts[i] : null).filter((x) => x !== null).join(' + ')} = ${below}.`, `<b>${below}</b> ${d.sc.item}.`], 'dot');
    }
    if (k === 'mean') {
      const tot = sum(d.data), n = d.data.length;
      if (!Number.isInteger((tot / n) * 2)) return dotWord(level);
      return numQ(`Use the dot plot to find the <b>mean</b> number of ${d.sc.unit}.`, d.visual, tot / n,
        'Total = add up (value × number of dots) for each stack. Then divide by the number of dots.',
        [`Total = ${d.values.map((v, i) => d.counts[i] ? `${v} × ${d.counts[i]}` : null).filter(Boolean).join(' + ')} = ${tot}.`, `Number of dots = ${n}.`, `Mean = ${tot} ÷ ${n} = <b>${N.fmt(tot / n)}</b>.`], 'dot');
    }
    const s = sorted(d.data), n = s.length, med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    return numQ(`Use the dot plot to find the <b>median</b> number of ${d.sc.unit}.`, d.visual, med,
      'The dots are already in order (left to right). Count in from both ends to find the middle dot.',
      [`There are ${n} dots. The data in order: ${listStr(s)}.`, n % 2 ? `The middle (${(n + 1) / 2}th) value is ${med}.` : `Middle two values: ${s[n / 2 - 1]} and ${s[n / 2]}, average = ${N.fmt(med)}.`, `Median = <b>${N.fmt(med)}</b>.`], 'dot');
  }

  // ----- pictograph -----
  function pictograph(level) {
    const sc = R.pick(scenarios);
    const n = level === 1 ? 3 : 4, cats = R.sample(sc.cats, n);
    const key = level === 1 ? R.pick([2, 5]) : R.pick([5, 10]);
    const halves = level === 3;
    let syms; do { syms = cats.map(() => R.int(1, 6) * 2 + (halves && R.chance(0.5) ? 1 : 0)); } while (new Set(syms).size < n); // syms in half-units
    const vals = syms.map((s) => (s / 2) * key);
    const sym = `<span style="color:${C.rose};font-size:1.3em">&#9679;</span>`, half = `<span style="color:${C.rose};font-size:1.3em">&#9686;</span>`;
    const rows = cats.map((c, i) => `<tr><th style="text-align:left">${c}</th><td style="text-align:left;letter-spacing:2px">${sym.repeat(Math.floor(syms[i] / 2))}${syms[i] % 2 ? half : ''}</td></tr>`).join('');
    const visual = `<table class="data"><tr><th colspan="2">${sc.title}</th></tr>${rows}<tr><td colspan="2" style="text-align:left">Key: ${sym} = ${key} ${sc.who}${halves ? `, ${half} = ${key / 2}` : ''}</td></tr></table>`;
    return { sc, cats, vals, syms, key, visual };
  }
  function pictoCalc(level) {
    const d = pictograph(level);
    const i = R.int(0, d.cats.length - 1);
    const full = Math.floor(d.syms[i] / 2), h = d.syms[i] % 2;
    return numQ(`Look at the pictograph. How many ${d.sc.who} ${d.sc.verb} <b>${d.cats[i]}</b>?`, d.visual, d.vals[i],
      `Each symbol stands for ${d.key}. Count the symbols in the ${d.cats[i]} row and multiply.`,
      [`${d.cats[i]} has ${full} full symbol${full === 1 ? '' : 's'}${h ? ' and a half symbol' : ''}.`, `${full} × ${d.key}${h ? ` + ${d.key / 2}` : ''} = ${d.vals[i]}.`, `<b>${d.vals[i]}</b> ${d.sc.who}.`], 'picto');
  }
  function pictoWord(level) {
    const d = pictograph(level);
    const k = R.pick(level === 1 ? ['more', 'total'] : ['more', 'total', 'symbols']);
    if (k === 'more') {
      const [i, j] = R.pair(0, d.cats.length - 1); const hi = d.vals[i] > d.vals[j] ? i : j, lo = hi === i ? j : i;
      return numQ(`Look at the pictograph. How many more ${d.sc.who} ${d.sc.verb} <b>${d.cats[hi]}</b> than <b>${d.cats[lo]}</b>?`, d.visual, d.vals[hi] - d.vals[lo],
        `Work out each row (symbols × ${d.key}), then subtract.`, [`${d.cats[hi]} = ${d.vals[hi]}, ${d.cats[lo]} = ${d.vals[lo]}.`, `${d.vals[hi]} − ${d.vals[lo]} = <b>${d.vals[hi] - d.vals[lo]}</b>.`], 'picto');
    }
    if (k === 'total') {
      const tot = sum(d.vals);
      return numQ(`Look at the pictograph. How many ${d.sc.who} are there altogether?`, d.visual, tot,
        `Count all the symbols, then multiply by ${d.key}.`, [`Rows: ${d.cats.map((c, i) => `${c} ${d.vals[i]}`).join(', ')}.`, `${d.vals.join(' + ')} = <b>${tot}</b>.`], 'picto');
    }
    const target = R.int(2, 6) * d.key;
    return numQ(`In this pictograph each symbol is ${d.key} ${d.sc.who}. A new row, <b>${d.sc.extra}</b>, needs to show ${target} ${d.sc.who}. How many symbols should it have?`, d.visual, target / d.key,
      `Number of symbols = number of ${d.sc.who} ÷ ${d.key}.`, [`${target} ÷ ${d.key} = ${target / d.key}.`, `<b>${target / d.key}</b> symbols.`], 'picto');
  }

  // ----- stem and leaf -----
  function stemLeaf(level) {
    const sc = R.pick([
      { title: 'Test scores (%)', item: 'scores', lo: 3, hi: 9 },
      { title: 'Ages of people at a bus stop', item: 'people', lo: 1, hi: 6 },
      { title: 'Heights of seedlings (cm)', item: 'seedlings', lo: 1, hi: 5 },
      { title: 'Minutes spent on homework', item: 'students', lo: 2, hi: 7 },
    ]);
    const stems = []; const s0 = R.int(sc.lo, sc.hi - 2), nStem = level === 1 ? 3 : 4;
    for (let s = s0; s < s0 + nStem; s++) stems.push(s);
    const n = level === 1 ? R.int(7, 9) : R.int(9, 12);
    let data; do { data = []; for (let i = 0; i < n; i++) data.push(R.pick(stems) * 10 + R.int(0, 9)); data = sorted(data); } while (stems.some((s) => !data.some((v) => Math.floor(v / 10) === s)));
    const rows = stems.map((s) => `<tr><th>${s}</th><td style="text-align:left;letter-spacing:6px">${data.filter((v) => Math.floor(v / 10) === s).map((v) => v % 10).join(' ')}</td></tr>`).join('');
    const ex = data[R.int(0, n - 1)];
    const visual = `<table class="data"><tr><th colspan="2">${sc.title}</th></tr><tr><th>Stem</th><th style="text-align:left">Leaf</th></tr>${rows}<tr><td colspan="2" style="text-align:left;font-size:.9em">Key: ${Math.floor(ex / 10)} | ${ex % 10} means ${ex}</td></tr></table>`;
    return { sc, data, visual, stems };
  }
  function stemCalc(level) {
    const d = stemLeaf(level);
    const k = R.pick(level === 1 ? ['count', 'largest', 'smallest'] : ['count', 'largest', 'smallest', 'range', 'mode']);
    const n = d.data.length;
    if (k === 'count') return numQ(`Look at the stem-and-leaf plot. How many ${d.sc.item} are shown?`, d.visual, n, 'Each leaf is one value. Count all the leaves.', [`Leaves per row: ${d.stems.map((s) => d.data.filter((v) => Math.floor(v / 10) === s).length).join(' + ')} = ${n}.`, `<b>${n}</b> ${d.sc.item}.`], 'stem');
    if (k === 'largest') return numQ('Look at the stem-and-leaf plot. What is the <b>largest</b> value?', d.visual, d.data[n - 1], 'The largest value is the last leaf on the bottom stem. Put stem and leaf together.', [`Bottom stem ${Math.floor(d.data[n - 1] / 10)}, last leaf ${d.data[n - 1] % 10}.`, `Largest = <b>${d.data[n - 1]}</b>.`], 'stem');
    if (k === 'smallest') return numQ('Look at the stem-and-leaf plot. What is the <b>smallest</b> value?', d.visual, d.data[0], 'The smallest value is the first leaf on the top stem.', [`Top stem ${Math.floor(d.data[0] / 10)}, first leaf ${d.data[0] % 10}.`, `Smallest = <b>${d.data[0]}</b>.`], 'stem');
    if (k === 'range') return numQ('Look at the stem-and-leaf plot. What is the <b>range</b>?', d.visual, d.data[n - 1] - d.data[0], 'Range = largest − smallest.', [`Largest = ${d.data[n - 1]}, smallest = ${d.data[0]}.`, `${d.data[n - 1]} − ${d.data[0]} = <b>${d.data[n - 1] - d.data[0]}</b>.`], 'stem');
    // mode: ensure unique
    const counts = {}; d.data.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
    const maxC = Math.max(...Object.values(counts)), modes = Object.keys(counts).filter((v) => counts[v] === maxC);
    if (maxC < 2 || modes.length > 1) return stemCalc(level);
    return numQ('Look at the stem-and-leaf plot. What is the <b>mode</b>?', d.visual, +modes[0], 'Look for a leaf that repeats on the same stem.', [`The leaf ${modes[0] % 10} appears ${maxC} times on stem ${Math.floor(modes[0] / 10)}.`, `Mode = <b>${modes[0]}</b>.`], 'stem');
  }
  function stemWord(level) {
    const d = stemLeaf(level), n = d.data.length;
    const k = R.pick(level === 1 ? ['atleast', 'below'] : level === 2 ? ['atleast', 'below', 'median'] : ['median', 'median', 'atleast']);
    if (k === 'atleast' || k === 'below') {
      const cut = d.stems[R.int(1, d.stems.length - 1)] * 10;
      const c = k === 'atleast' ? d.data.filter((v) => v >= cut).length : d.data.filter((v) => v < cut).length;
      return numQ(`Look at the stem-and-leaf plot. How many of the values are <b>${k === 'atleast' ? `${cut} or more` : `less than ${cut}`}</b>?`, d.visual, c,
        k === 'atleast' ? `Count the leaves on stem ${cut / 10} and every stem below it.` : `Count the leaves on the stems above stem ${cut / 10}.`,
        [`Values ${k === 'atleast' ? '≥' : '<'} ${cut}: ${listStr(d.data.filter((v) => (k === 'atleast' ? v >= cut : v < cut)))}.`, `That is <b>${c}</b> values.`], 'stem');
    }
    const med = n % 2 ? d.data[(n - 1) / 2] : (d.data[n / 2 - 1] + d.data[n / 2]) / 2;
    return numQ('Use the stem-and-leaf plot to find the <b>median</b>.', d.visual, med,
      'The values are already in order. Count the leaves, then count in to the middle one.',
      [`There are ${n} values: ${listStr(d.data)}.`, n % 2 ? `The middle (${(n + 1) / 2}th) value is ${med}.` : `The middle two are ${d.data[n / 2 - 1]} and ${d.data[n / 2]}: (${d.data[n / 2 - 1]} + ${d.data[n / 2]}) ÷ 2 = ${N.fmt(med)}.`, `Median = <b>${N.fmt(med)}</b>.`], 'stem');
  }

  // ----- two-way table -----
  function twoWay(level) {
    const sc = R.pick([
      { rows: ['Year 7', 'Year 8'], cols: ['Netball', 'Rugby', 'Hockey'], rowName: 'year group', title: 'Sport played' },
      { rows: ['Girls', 'Boys'], cols: ['Bus', 'Walk', 'Car'], rowName: 'group', title: 'How students get to school' },
      { rows: ['Room 5', 'Room 6'], cols: ['Dog', 'Cat', 'No pet'], rowName: 'class', title: 'Pets at home' },
      { rows: ['Morning', 'Afternoon'], cols: ['Pie', 'Sushi', 'Salad'], rowName: 'time', title: 'Canteen sales' },
    ]);
    const nc = level === 1 ? 2 : 3, cols = sc.cols.slice(0, nc);
    const cells = sc.rows.map(() => cols.map(() => R.int(level === 1 ? 2 : 3, level === 1 ? 12 : 20)));
    const showTotals = level === 1;
    const rowT = cells.map(sum), colT = cols.map((_, j) => sum(cells.map((r) => r[j]))), grand = sum(rowT);
    let html = `<table class="data"><tr><th>${sc.title}</th>${cols.map((c) => `<th>${c}</th>`).join('')}${showTotals ? '<th>Total</th>' : ''}</tr>`;
    sc.rows.forEach((r, i) => { html += `<tr><th>${r}</th>${cells[i].map((v) => `<td>${v}</td>`).join('')}${showTotals ? `<td><b>${rowT[i]}</b></td>` : ''}</tr>`; });
    if (showTotals) html += `<tr><th>Total</th>${colT.map((v) => `<td><b>${v}</b></td>`).join('')}<td><b>${grand}</b></td></tr>`;
    html += '</table>';
    return { sc, cols, cells, rowT, colT, grand, visual: html };
  }
  function twoWayCalc(level) {
    const d = twoWay(level);
    const i = R.int(0, 1), j = R.int(0, d.cols.length - 1);
    return numQ(`Look at the two-way table. How many in <b>${d.sc.rows[i]}</b> are in the <b>${d.cols[j]}</b> column?`, d.visual, d.cells[i][j],
      `Find the ${d.sc.rows[i]} row, then move along to the ${d.cols[j]} column.`,
      [`Row ${d.sc.rows[i]}, column ${d.cols[j]}: ${d.cells[i][j]}.`, `Answer: <b>${d.cells[i][j]}</b>.`], 'twoway');
  }
  function twoWayWord(level) {
    const d = twoWay(level);
    const k = R.pick(level === 1 ? ['rowtotal', 'coltotal', 'more'] : level === 2 ? ['rowtotal', 'coltotal', 'more', 'grand'] : ['fraction', 'fraction', 'grand', 'more']);
    if (k === 'rowtotal') { const i = R.int(0, 1); return numQ(`How many are in <b>${d.sc.rows[i]}</b> altogether?`, d.visual, d.rowT[i], `Add up every number in the ${d.sc.rows[i]} row.`, [`${d.cells[i].join(' + ')} = ${d.rowT[i]}.`, `<b>${d.rowT[i]}</b> in ${d.sc.rows[i]}.`], 'twoway'); }
    if (k === 'coltotal') { const j = R.int(0, d.cols.length - 1); return numQ(`How many are in the <b>${d.cols[j]}</b> column altogether (both ${d.sc.rowName}s)?`, d.visual, d.colT[j], `Add the two numbers in the ${d.cols[j]} column.`, [`${d.cells.map((r) => r[j]).join(' + ')} = ${d.colT[j]}.`, `<b>${d.colT[j]}</b> in ${d.cols[j]}.`], 'twoway'); }
    if (k === 'grand') return numQ('How many people are in the table altogether?', d.visual, d.grand, 'Add every number in the table (or add the row totals).', [`Row totals: ${d.rowT.join(' + ')} = ${d.grand}.`, `<b>${d.grand}</b> altogether.`], 'twoway');
    if (k === 'more') {
      const j = R.int(0, d.cols.length - 1); const a = d.cells[0][j], b = d.cells[1][j];
      if (a === b) return twoWayWord(level);
      const hi = a > b ? 0 : 1, lo = 1 - hi;
      return numQ(`In the <b>${d.cols[j]}</b> column, how many more are in ${d.sc.rows[hi]} than ${d.sc.rows[lo]}?`, d.visual, Math.abs(a - b), 'Find the two numbers in that column and subtract.', [`${d.sc.rows[hi]} ${d.cells[hi][j]}, ${d.sc.rows[lo]} ${d.cells[lo][j]}.`, `${d.cells[hi][j]} − ${d.cells[lo][j]} = <b>${Math.abs(a - b)}</b>.`], 'twoway');
    }
    const i = R.int(0, 1), j = R.int(0, d.cols.length - 1), f = N.simplify(d.cells[i][j], d.rowT[i]);
    if (f.d > 10) return twoWayWord(level);
    return {
      prompt: `What <b>fraction</b> of <b>${d.sc.rows[i]}</b> are in the <b>${d.cols[j]}</b> column? Give your answer in simplest form.`,
      visual: d.visual, answer: fracAns(d.cells[i][j], d.rowT[i]),
      hint: `Fraction = the ${d.cols[j]} number in the ${d.sc.rows[i]} row ÷ the total of that row.`,
      working: [`${d.sc.rows[i]} total = ${d.cells[i].join(' + ')} = ${d.rowT[i]}.`, `Fraction = ${N.fracHtml(d.cells[i][j], d.rowT[i])}.`, `Simplest form: <b>${N.fracHtml(f.n, f.d)}</b>.`],
      finalAnswer: N.fracHtml(f.n, f.d), skill: 'twoway',
    };
  }

  // ----- pie chart -----
  const rnd1 = (v) => Math.round(v * 10) / 10;
  const numUQ = (prompt, visual, value, unit, hint, working, skill) => ({
    prompt, visual, answer: { type: 'number', value, unit },
    hint, working, finalAnswer: `${N.fmt(value)}${!unit ? '' : (unit === '°C' || unit === '%' ? unit : ' ' + unit)}`, skill,
  });
  const pieScenarios = [
    { title: 'Favourite fruit', intro: (t) => `The pie chart shows the favourite fruit of ${t} students.`, introN: 'The pie chart shows the favourite fruit of a group of students.', ask: (c) => `chose <b>${c}</b>`, noun: 'students', cats: ['Apple', 'Pear', 'Kiwi', 'Grape', 'Plum'] },
    { title: 'Favourite sport', intro: (t) => `The pie chart shows the favourite sport of ${t} students.`, introN: 'The pie chart shows the favourite sport of a group of students.', ask: (c) => `chose <b>${c}</b>`, noun: 'students', cats: ['Rugby', 'Netball', 'Soccer', 'Hockey', 'Cricket'] },
    { title: 'How we get to school', intro: (t) => `The pie chart shows how ${t} students get to school.`, introN: 'The pie chart shows how a group of students get to school.', ask: (c) => `travel by <b>${c}</b>`, noun: 'students', cats: ['Walk', 'Bus', 'Car', 'Bike', 'Scooter'] },
    { title: 'Pets in Room 6', intro: (t) => `The pie chart shows the ${t} pets owned by Room 6.`, introN: 'The pie chart shows the pets owned by Room 6.', ask: (c) => `are <b>${c}</b>`, noun: 'pets', cats: ['Dogs', 'Cats', 'Fish', 'Birds', 'Rabbits'] },
    { title: 'Ice cream flavour', intro: (t) => `The pie chart shows the ice cream flavour picked by ${t} students.`, introN: 'The pie chart shows the ice cream flavour picked by a group of students.', ask: (c) => `picked <b>${c}</b>`, noun: 'students', cats: ['Choc', 'Vanilla', 'Berry', 'Mint', 'Lime'] },
    { title: 'After-school clubs', intro: (t) => `The pie chart shows the club chosen by ${t} students.`, introN: 'The pie chart shows the club chosen by a group of students.', ask: (c) => `chose <b>${c}</b>`, noun: 'students', cats: ['Chess', 'Art', 'Coding', 'Drama', 'Choir'] },
  ];
  /** want: 'quarter' | 'half' | 'percent' | null. Sectors are always exact halves/thirds/quarters/sixths/eighths. */
  function pieData(level, want) {
    const sc = R.pick(pieScenarios);
    let Ds = level === 1 ? [4, 8] : level === 2 ? [4, 6, 8] : [6, 8, 8];
    if (want === 'quarter') Ds = [8];
    if (want === 'percent') Ds = Ds.filter((d) => d !== 6);
    if (!Ds.length) Ds = [8];
    const D = R.pick(Ds);
    let nParts = Math.min(level === 1 ? 3 : R.pick([3, 4, 4, 5]), D === 4 ? 3 : D === 6 ? 4 : 5, sc.cats.length);
    const target = want === 'quarter' ? D / 4 : want === 'half' ? D / 2 : null;
    let parts = null;
    for (let t = 0; t < 400; t++) {
      const p = Array(nParts).fill(1);
      let left = D - nParts;
      while (left > 0) { p[R.int(0, nParts - 1)]++; left--; }
      if (target != null && p.filter((v) => v === target).length !== 1) continue;
      if (target == null && new Set(p).size < 2) continue;
      parts = p; break;
    }
    if (!parts) { parts = D === 4 ? [1, 1, 2] : D === 6 ? [1, 2, 3] : [1, 3, 4]; nParts = parts.length; }
    parts = R.shuffle(parts);
    const cats = R.sample(sc.cats, nParts);
    const m = R.pick([2, 3, 4, 5, 6]);
    return { sc, cats, parts, D, m, total: D * m, counts: parts.map((p) => p * m) };
  }
  function pieSvg(d, showShares) {
    const cx = 96, cy = 104, r = 82;
    let b = '', a = -90;
    d.parts.forEach((p, i) => {
      const sweep = 360 * p / d.D, a1 = a * Math.PI / 180, a2 = (a + sweep) * Math.PI / 180;
      b += `<path d="M${cx} ${cy} L${rnd1(cx + r * Math.cos(a1))} ${rnd1(cy + r * Math.sin(a1))} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${rnd1(cx + r * Math.cos(a2))} ${rnd1(cy + r * Math.sin(a2))} Z" fill="${cols[i]}" stroke="${C.ink}" stroke-width="2"/>`;
      if (showShares) {
        const am = (a + sweep / 2) * Math.PI / 180;
        b += `<text x="${rnd1(cx + r * 0.62 * Math.cos(am))}" y="${rnd1(cy + r * 0.62 * Math.sin(am) + 5)}" font-size="13" font-weight="bold" text-anchor="middle">${p}/${d.D}</text>`;
      }
      a += sweep;
    });
    d.cats.forEach((c, i) => {
      const y = 36 + i * 26;
      b += `<rect x="196" y="${y - 12}" width="15" height="15" rx="3" fill="${cols[i]}" stroke="${C.ink}" stroke-width="1.5"/>`;
      b += `<text x="216" y="${y + 1}" font-size="13">${c}${showShares ? ` ${d.parts[i]}/${d.D}` : ''}</text>`;
    });
    b += `<text x="160" y="212" font-size="13" font-weight="bold" text-anchor="middle">${d.sc.title}</text>`;
    return svg(320, 220, b);
  }
  function pieCalc(level) {
    const k = R.pick(level === 1 ? ['half', 'quarter', 'fraction'] : level === 2 ? ['fraction', 'fraction', 'count', 'half', 'quarter'] : ['fraction', 'count', 'percent', 'percent']);
    if (k === 'half' || k === 'quarter') {
      const d = pieData(level, k), v = pieSvg(d, false);
      const share = k === 'half' ? d.D / 2 : d.D / 4, i = d.parts.indexOf(share);
      return choiceQ(`Look at the pie chart. Which group takes up <b>${k === 'half' ? 'half' : 'a quarter'}</b> of the circle?`, v, d.cats, i,
        k === 'half' ? 'Half the circle is the piece that fills exactly one side of the pie.' : 'A quarter is a square corner: one quarter turn, like a slice of toast cut in four.',
        [`${k === 'half' ? 'Half' : 'A quarter'} of the circle is ${k === 'half' ? N.fracHtml(1, 2) : N.fracHtml(1, 4)} of it.`,
          `The <b>${d.cats[i]}</b> slice is ${N.fracHtml(share, d.D)} = ${k === 'half' ? N.fracHtml(1, 2) : N.fracHtml(1, 4)} of the circle.`,
          `Answer: <b>${d.cats[i]}</b>.`], 'pie');
    }
    if (k === 'fraction') {
      const d = pieData(level), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
      const f = N.simplify(d.parts[i], d.D);
      return {
        prompt: `${d.sc.introN} What <b>fraction</b> of the ${d.sc.noun} ${d.sc.ask(d.cats[i])}? Give your answer in simplest form.`,
        visual: v, answer: fracAns(d.parts[i], d.D),
        hint: `The whole circle is everybody. Read the ${d.cats[i]} slice: it is ${d.parts[i]} pieces out of ${d.D}.`,
        working: [`The circle is cut into ${d.D} equal pieces.`, `${d.cats[i]} takes ${d.parts[i]} of them: ${N.fracHtml(d.parts[i], d.D)}.`, `Simplify: <b>${N.fracHtml(f.n, f.d)}</b>.`],
        finalAnswer: N.fracHtml(f.n, f.d), skill: 'pie',
      };
    }
    if (k === 'percent') {
      const d = pieData(level, 'percent'), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
      const pct = 100 * d.parts[i] / d.D;
      return numUQ(`${d.sc.introN} What <b>percentage</b> of the ${d.sc.noun} ${d.sc.ask(d.cats[i])}?`, v, pct, '%',
        `${d.cats[i]} is ${N.fracHtml(d.parts[i], d.D)} of the circle. A fraction becomes a percentage when you multiply by 100.`,
        [`${d.cats[i]} = ${N.fracHtml(d.parts[i], d.D)} of the circle.`, `${d.parts[i]} ÷ ${d.D} × 100 = ${N.fmt(pct)}.`, `<b>${N.fmt(pct)}%</b>.`], 'pie');
    }
    const d = pieData(level), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
    return numQ(`${d.sc.intro(d.total)} How many ${d.sc.noun} ${d.sc.ask(d.cats[i])}?`, v, d.counts[i],
      `The whole circle is ${d.total} ${d.sc.noun}. One piece out of ${d.D} is ${d.total} ÷ ${d.D} = ${d.m}.`,
      [`The circle is ${d.D} equal pieces, so one piece = ${d.total} ÷ ${d.D} = ${d.m} ${d.sc.noun}.`,
        `${d.cats[i]} is ${d.parts[i]} piece${d.parts[i] === 1 ? '' : 's'}: ${d.parts[i]} × ${d.m} = ${d.counts[i]}.`,
        `<b>${d.counts[i]}</b> ${d.sc.noun}.`], 'pie');
  }
  function pieWord(level) {
    const k = R.pick(level === 1 ? ['count', 'count', 'more'] : level === 2 ? ['count', 'more', 'percent'] : ['more', 'percent', 'reverse', 'reverse']);
    if (k === 'reverse') {
      const d = pieData(level), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
      return numQ(`${d.sc.introN} <b>${d.counts[i]}</b> of the ${d.sc.noun} ${d.sc.ask(d.cats[i])}. How many ${d.sc.noun} are there altogether?`, v, d.total,
        `${d.cats[i]} is ${d.parts[i]} pieces out of ${d.D}, and those ${d.parts[i]} pieces are ${d.counts[i]}. First find what <b>one</b> piece is worth.`,
        [`${d.cats[i]} = ${d.parts[i]} of the ${d.D} equal pieces, and that is ${d.counts[i]} ${d.sc.noun}.`,
          `One piece = ${d.counts[i]} ÷ ${d.parts[i]} = ${d.m}.`,
          `The whole circle = ${d.D} pieces = ${d.D} × ${d.m} = <b>${d.total}</b>.`], 'pie');
    }
    if (k === 'percent') {
      const d = pieData(level, 'percent'), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
      const pct = 100 * d.parts[i] / d.D;
      return numUQ(`${d.sc.introN} What <b>percentage</b> of the ${d.sc.noun} ${d.sc.ask(d.cats[i])}?`, v, pct, '%',
        'A whole pie chart is 100%. Work out what share this slice is, then multiply by 100.',
        [`${d.cats[i]} = ${N.fracHtml(d.parts[i], d.D)} of the circle.`, `${d.parts[i]} ÷ ${d.D} × 100 = ${N.fmt(pct)}.`, `<b>${N.fmt(pct)}%</b>.`], 'pie');
    }
    if (k === 'more') {
      const d = pieData(level), v = pieSvg(d, true);
      const [i, j] = R.pair(0, d.cats.length - 1);
      if (d.counts[i] === d.counts[j]) return pieWord(level);
      const hi = d.counts[i] > d.counts[j] ? i : j, lo = hi === i ? j : i;
      return numQ(`${d.sc.intro(d.total)} How many more ${d.sc.noun} ${d.sc.ask(d.cats[hi])} than ${d.cats[lo]}?`, v, d.counts[hi] - d.counts[lo],
        `One piece = ${d.total} ÷ ${d.D} = ${d.m}. Work out both slices, then subtract.`,
        [`One piece = ${d.total} ÷ ${d.D} = ${d.m}.`,
          `${d.cats[hi]}: ${d.parts[hi]} × ${d.m} = ${d.counts[hi]}. ${d.cats[lo]}: ${d.parts[lo]} × ${d.m} = ${d.counts[lo]}.`,
          `${d.counts[hi]} − ${d.counts[lo]} = <b>${d.counts[hi] - d.counts[lo]}</b>.`], 'pie');
    }
    const d = pieData(level), v = pieSvg(d, true), i = R.int(0, d.cats.length - 1);
    return numQ(`${d.sc.intro(d.total)} How many ${d.sc.noun} ${d.sc.ask(d.cats[i])}?`, v, d.counts[i],
      `Whole circle = ${d.total}. One piece out of ${d.D} = ${d.total} ÷ ${d.D}.`,
      [`One piece = ${d.total} ÷ ${d.D} = ${d.m} ${d.sc.noun}.`, `${d.cats[i]} is ${d.parts[i]} piece${d.parts[i] === 1 ? '' : 's'}: ${d.parts[i]} × ${d.m} = ${d.counts[i]}.`, `<b>${d.counts[i]}</b> ${d.sc.noun}.`], 'pie');
  }

  // ----- line graph (time series) -----
  const lineScenarios = [
    { title: 'Midday temperature in Dunedin', ylab: '°C', unit: '°C', noun: 'the temperature', shape: 'wobble', steps: [1, 2], xword: 'day', xs: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], read: (x) => `What was the temperature on <b>${x}</b>?` },
    { title: 'Height of a bean plant', ylab: 'cm', unit: 'cm', noun: "the plant's height", shape: 'rise', steps: [2, 5], xword: 'day', xs: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'], read: (x) => `How tall was the plant on <b>${x}</b>?` },
    { title: 'Water in the school tank', ylab: 'litres', unit: 'L', noun: 'the water level', shape: 'fall', steps: [5, 10], xword: 'day', xs: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], read: (x) => `How much water was in the tank on <b>${x}</b>?` },
    { title: 'Visitors at the gala stall', ylab: 'people', unit: 'people', noun: 'the number of visitors', shape: 'peak', steps: [5, 10], xword: 'time', xs: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'], read: (x) => `How many visitors came at <b>${x}</b>?` },
  ];
  function lineUnits(shape, n, maxU) {
    const u = [];
    if (shape === 'rise') { u.push(R.int(0, 2)); for (let i = 1; i < n; i++) u.push(u[i - 1] + R.int(1, 2)); return u; }
    if (shape === 'fall') { u.push(R.int(maxU - 1, maxU)); for (let i = 1; i < n; i++) u.push(u[i - 1] - R.int(1, 2)); return u; }
    if (shape === 'peak') {
      const top = R.int(2, n - 2); u.push(R.int(0, 2));
      for (let i = 1; i < n; i++) u.push(i <= top ? u[i - 1] + R.int(1, 3) : u[i - 1] - R.int(1, 3));
      return u;
    }
    u.push(R.int(2, maxU - 2));
    for (let i = 1; i < n; i++) u.push(u[i - 1] + R.nz(3));
    return u;
  }
  function lineData(level, need) {
    const sc = R.pick(lineScenarios), maxU = 8;
    const n = level === 1 ? 5 : R.pick([5, 6, 7]);
    const step = R.pick(sc.steps);
    for (let t = 0; t < 600; t++) {
      const u = lineUnits(sc.shape, n, maxU);
      if (u.some((v) => v < 0 || v > maxU)) continue;
      const gaps = []; for (let i = 1; i < n; i++) gaps.push(u[i] - u[i - 1]);
      const up = Math.max(...gaps), down = Math.min(...gaps);
      const signs = gaps.map((g) => Math.sign(g)).filter((s) => s !== 0);
      let flips = 0; for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) flips++;
      if (sc.shape === 'wobble' && flips < 2) continue;
      if (sc.shape === 'peak' && (flips !== 1 || up <= 0 || down >= 0)) continue;
      if (need === 'rise' && (up <= 0 || gaps.filter((g) => g === up).length !== 1)) continue;
      if (need === 'fall' && (down >= 0 || gaps.filter((g) => g === down).length !== 1)) continue;
      if (need === 'pass' && !u.some((v, i) => i > 0 && v > u[0] && u.slice(0, i).every((w) => w < v))) continue;
      return { sc, n, step, maxU, u, gaps, xs: sc.xs.slice(0, n), vals: u.map((v) => v * step) };
    }
    const u = [3, 5, 4, 8, 6], gaps = [2, -1, 4, -2];
    return { sc, n: 5, step, maxU, u, gaps, xs: sc.xs.slice(0, 5), vals: u.map((v) => v * step) };
  }
  function lineSvg(d) {
    const left = 48, right = 302, top = 16, bottom = 170, H = bottom - top;
    const y = (u) => rnd1(bottom - H * u / d.maxU), x = (i) => rnd1(left + (right - left) * i / (d.n - 1));
    let b = '';
    for (let i = 0; i <= d.maxU; i++) {
      b += `<line x1="${left}" y1="${y(i)}" x2="${right}" y2="${y(i)}" stroke="${i === 0 ? C.ink : C.lav}" stroke-width="${i === 0 ? 2 : 1}"/>`;
      b += `<text x="${left - 6}" y="${y(i) + 5}" font-size="13" text-anchor="end">${i * d.step}</text>`;
    }
    d.xs.forEach((lab, i) => {
      b += `<line x1="${x(i)}" y1="${top}" x2="${x(i)}" y2="${bottom}" stroke="${C.lav}" stroke-width="1"/>`;
      b += `<text x="${x(i)}" y="${bottom + 18}" font-size="13" text-anchor="middle">${lab}</text>`;
    });
    b += `<line x1="${left}" y1="${top - 4}" x2="${left}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
    b += `<polyline points="${d.u.map((v, i) => `${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="${C.rose}" stroke-width="3"/>`;
    d.u.forEach((v, i) => { b += `<circle cx="${x(i)}" cy="${y(v)}" r="4.5" fill="#fff" stroke="${C.rose}" stroke-width="2.5"/>`; });
    b += `<text x="175" y="212" font-size="13" font-weight="bold" text-anchor="middle">${d.sc.title}</text>`;
    b += `<text transform="translate(13 ${(top + bottom) / 2}) rotate(-90)" font-size="13" text-anchor="middle">${d.sc.ylab}</text>`;
    return svg(320, 220, b);
  }
  function lineCalc(level) {
    const k = R.pick(level === 1 ? ['read', 'read', 'trend'] : level === 2 ? ['read', 'rise', 'trend', 'fall'] : ['rise', 'fall', 'pass', 'read']);
    if (k === 'read') {
      const d = lineData(level), i = R.int(0, d.n - 1);
      return numUQ(`Look at the line graph. ${d.sc.read(d.xs[i])}`, lineSvg(d), d.vals[i], d.sc.unit,
        `Go up from <b>${d.xs[i]}</b> to the dot, then straight across to the scale. Each line is worth ${d.step}.`,
        [`Each gridline is worth ${d.step} ${d.sc.ylab}.`, `The dot above ${d.xs[i]} lines up with ${d.vals[i]}.`, `Answer: <b>${d.vals[i]}${d.sc.unit === '°C' ? '°C' : ' ' + d.sc.unit}</b>.`], 'line');
    }
    if (k === 'rise' || k === 'fall') {
      const d = lineData(level, k), g = k === 'rise' ? Math.max(...d.gaps) : Math.min(...d.gaps), i = d.gaps.indexOf(g);
      const opts = [];
      for (let j = 0; j < d.n - 1; j++) opts.push(`${d.xs[j]} → ${d.xs[j + 1]}`);
      const keep = R.shuffle(opts.map((_, j) => j).filter((j) => j !== i)).slice(0, 3).concat([i]).sort((a, b) => a - b);
      return choiceQ(`Look at the line graph. Between which two ${d.sc.xword}s did ${d.sc.noun} <b>${k === 'rise' ? 'rise' : 'drop'}</b> the most?`,
        lineSvg(d), keep.map((j) => opts[j]), keep.indexOf(i),
        `The biggest ${k === 'rise' ? 'rise' : 'drop'} is the <b>steepest</b> bit of line going ${k === 'rise' ? 'up' : 'down'}.`,
        [`Change each step: ${d.gaps.map((gg, j) => `${d.xs[j]}→${d.xs[j + 1]} ${gg > 0 ? '+' : '−'}${Math.abs(gg) * d.step}`).join(', ')}.`,
          `The biggest ${k === 'rise' ? 'rise' : 'drop'} is ${Math.abs(g) * d.step}, from ${d.xs[i]} to ${d.xs[i + 1]}.`,
          `Answer: <b>${opts[i]}</b>.`], 'line');
    }
    const d = lineData(level, 'pass');
    const cand = d.u.map((v, i) => i).filter((i) => i > 0 && d.u[i] > d.u[0] && d.u.slice(0, i).every((w) => w < d.u[i]));
    const i = R.pick(cand), T = d.vals[i];
    const opts = R.shuffle(d.xs.map((_, j) => j).filter((j) => j !== i)).slice(0, 3).concat([i]).sort((a, b) => a - b);
    return choiceQ(`Look at the line graph. On which ${d.sc.xword} did ${d.sc.noun} <b>first</b> reach ${T}${d.sc.unit === '°C' ? '°C' : ' ' + d.sc.unit} or more?`,
      lineSvg(d), opts.map((j) => d.xs[j]), opts.indexOf(i),
      `Find ${T} on the scale, slide across, and look for the <b>first</b> dot that is at that height or above.`,
      [`Values: ${d.xs.map((xx, j) => `${xx} ${d.vals[j]}`).join(', ')}.`,
        `The first one that reaches ${T} is <b>${d.xs[i]}</b>.`], 'line');
  }
  function lineWord(level) {
    const k = R.pick(level === 1 ? ['trend', 'diff'] : level === 2 ? ['diff', 'trend', 'highlow'] : ['diff', 'highlow', 'pass']);
    if (k === 'trend') {
      const d = lineData(level);
      const opts = ['It goes up steadily', 'It goes down steadily', 'It goes up and then down', 'It goes up and down with no clear pattern'];
      const idx = { rise: 0, fall: 1, peak: 2, wobble: 3 }[d.sc.shape];
      const why = ['every dot is higher than the one before', 'every dot is lower than the one before', 'the line climbs to a high point and then falls away', 'the line goes up, then down, then up again'][idx];
      return choiceQ('Look at the line graph. Which sentence best describes what the graph shows?', lineSvg(d), opts, idx,
        'Follow the line from left to right with your finger. Does it climb, fall, or do both?',
        [`Values from left to right: ${d.vals.join(', ')}.`, `Reading left to right, ${why}.`, `Answer: <b>${opts[idx]}</b>.`], 'line');
    }
    if (k === 'highlow') {
      const d = lineData(level), hi = Math.max(...d.vals), lo = Math.min(...d.vals);
      if (hi === lo) return lineWord(level);
      return numUQ(`Look at the line graph. What is the <b>difference</b> between the highest and the lowest value?`, lineSvg(d), hi - lo, d.sc.unit,
        'Read the highest dot and the lowest dot, then subtract.',
        [`Highest = ${hi}, lowest = ${lo}.`, `${hi} − ${lo} = <b>${hi - lo}</b>.`], 'line');
    }
    if (k === 'pass') return lineCalc(3);
    const d = lineData(level);
    let i = 0, j = 0;
    for (let t = 0; t < 60; t++) { const [a, b2] = R.pair(0, d.n - 1); i = Math.min(a, b2); j = Math.max(a, b2); if (d.vals[i] !== d.vals[j]) break; }
    if (d.vals[i] === d.vals[j]) return lineWord(level);
    const up = d.vals[j] > d.vals[i];
    return numUQ(`Look at the line graph. How much did ${d.sc.noun} <b>${up ? 'go up' : 'go down'}</b> between ${d.xs[i]} and ${d.xs[j]}?`, lineSvg(d), Math.abs(d.vals[j] - d.vals[i]), d.sc.unit,
      'Read both dots off the scale, then subtract the smaller from the bigger.',
      [`${d.xs[i]} = ${d.vals[i]}, ${d.xs[j]} = ${d.vals[j]}.`, `${Math.max(d.vals[i], d.vals[j])} − ${Math.min(d.vals[i], d.vals[j])} = <b>${Math.abs(d.vals[j] - d.vals[i])}</b>.`], 'line');
  }

  // ----- scatter plot -----
  const scatterScenarios = [
    { x: 'Hours of practice', y: 'Goals scored', rel: 'pos' },
    { x: 'Hours of TV watched', y: 'Test score', rel: 'neg' },
    { x: 'Temperature', y: 'Ice creams sold', rel: 'pos' },
    { x: 'Temperature', y: 'Hot drinks sold', rel: 'neg' },
    { x: 'Age of a car (years)', y: 'Price of the car', rel: 'neg' },
    { x: 'Shoe size', y: 'Spelling score', rel: 'none' },
    { x: 'Height of student', y: 'Number of pets', rel: 'none' },
    { x: 'Minutes spent revising', y: 'Marks in the test', rel: 'pos' },
  ];
  function scatterData() {
    const sc = R.pick(scatterScenarios), n = 9;
    for (let t = 0; t < 300; t++) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const px = rnd1(0.5 + i * 9 / n + R.dec(-0.4, 0.4, 1));
        let py;
        if (sc.rel === 'pos') py = rnd1(px + R.dec(-1.2, 1.2, 1));
        else if (sc.rel === 'neg') py = rnd1(9.5 - px + R.dec(-1.2, 1.2, 1));
        else py = rnd1(R.dec(1, 9, 1));
        pts.push([px, Math.max(0.5, Math.min(9.5, py))]);
      }
      const mx = sum(pts.map((p) => p[0])) / n, my = sum(pts.map((p) => p[1])) / n;
      const sxy = sum(pts.map((p) => (p[0] - mx) * (p[1] - my)));
      const sx = Math.sqrt(sum(pts.map((p) => (p[0] - mx) ** 2))), sy = Math.sqrt(sum(pts.map((p) => (p[1] - my) ** 2)));
      const r = sx && sy ? sxy / (sx * sy) : 0;
      if (sc.rel === 'pos' && r < 0.75) continue;
      if (sc.rel === 'neg' && r > -0.75) continue;
      if (sc.rel === 'none' && Math.abs(r) > 0.25) continue;
      return { sc, pts };
    }
    return { sc, pts: [[1, 5], [2, 3], [3, 7], [4, 4], [5, 6], [6, 3], [7, 7], [8, 4], [9, 6]] };
  }
  function scatterSvg(d) {
    const left = 54, right = 300, top = 18, bottom = 162;
    const X = (v) => rnd1(left + (right - left) * v / 10), Y = (v) => rnd1(bottom - (bottom - top) * v / 10);
    let b = '';
    b += `<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
    b += `<line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
    for (let i = 1; i <= 10; i++) { b += `<line x1="${X(i)}" y1="${bottom}" x2="${X(i)}" y2="${bottom - 5}" stroke="${C.ink}" stroke-width="1.5"/><line x1="${left}" y1="${Y(i)}" x2="${left + 5}" y2="${Y(i)}" stroke="${C.ink}" stroke-width="1.5"/>`; }
    d.pts.forEach((p) => { b += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" fill="${C.sky}" stroke="${C.ink}" stroke-width="1.5"/>`; });
    b += `<text x="${(left + right) / 2}" y="${bottom + 24}" font-size="13" text-anchor="middle">${d.sc.x} →</text>`;
    b += `<text transform="translate(18 ${(top + bottom) / 2}) rotate(-90)" font-size="13" text-anchor="middle">${d.sc.y} →</text>`;
    b += `<text x="160" y="206" font-size="13" font-weight="bold" text-anchor="middle">${d.sc.y} against ${d.sc.x.toLowerCase()}</text>`;
    return svg(320, 216, b);
  }
  function scatterQ(level) {
    const d = scatterData(), v = scatterSvg(d);
    const k = R.pick(level === 1 ? ['dir', 'dir', 'rel'] : ['rel', 'rel', 'dir']);
    const iRel = { pos: 0, neg: 1, none: 2 }[d.sc.rel];
    if (k === 'rel') {
      const opts = ['a positive relationship (both go up together)', 'a negative relationship (one goes up, the other goes down)', 'no relationship'];
      return choiceQ(`Look at the scatter plot. What kind of relationship does it show between <b>${d.sc.x.toLowerCase()}</b> and <b>${d.sc.y.toLowerCase()}</b>?`, v, opts, iRel,
        'Dots climbing to the right = positive. Dots falling to the right = negative. Dots all over the place = no relationship.',
        [d.sc.rel === 'pos' ? 'Reading left to right, the dots go <b>up</b>.' : d.sc.rel === 'neg' ? 'Reading left to right, the dots go <b>down</b>.' : 'The dots are scattered with no pattern going up or down.',
          `So there is <b>${['a positive relationship', 'a negative relationship', 'no relationship'][iRel]}</b>.`], 'scatter');
    }
    const opts = ['It goes up', 'It goes down', 'There is no clear pattern'];
    return choiceQ(`Look at the scatter plot. As <b>${d.sc.x.toLowerCase()}</b> increases, what happens to <b>${d.sc.y.toLowerCase()}</b>?`, v, opts, iRel,
      'Put your finger on the left-hand dots and slide right. Do the dots climb, fall, or stay all over the place?',
      [d.sc.rel === 'pos' ? 'The dots climb as you move to the right.' : d.sc.rel === 'neg' ? 'The dots fall as you move to the right.' : 'The dots do not climb or fall: they are scattered.',
        `So <b>${opts[iRel].toLowerCase()}</b>.`], 'scatter');
  }

  // ----- choosing the right display -----
  function chooseDisplayQ() {
    const cases = [
      { s: 'the midday temperature in Christchurch on each day of a week', a: 1, why: 'this is one thing measured <b>over time</b>, and a line shows how it changes day by day.' },
      { s: 'how many students chose each of 5 favourite sports', a: 0, why: 'you are comparing <b>separate groups</b>, and bars are easy to compare side by side.' },
      { s: 'what share of a class voted for each of 4 school lunch options', a: 2, why: 'you are showing <b>parts of one whole</b> (the whole class), and a circle is one whole.' },
      { s: 'the height of a sunflower measured every week for 8 weeks', a: 1, why: 'it is measured <b>over time</b>, so a line shows the growth.' },
      { s: 'how the 24 hours of Harper\'s day are split between sleep, school, sport and free time', a: 2, why: 'the four parts add up to <b>one whole day</b>.' },
      { s: 'the number of pets owned by students in Room 5, Room 6 and Room 7', a: 0, why: 'you are comparing <b>separate groups</b> (three classes).' },
      { s: 'how many people visited the school gala each hour from 9am to 3pm', a: 1, why: 'it is measured <b>over time</b> (hour by hour).' },
      { s: 'the fraction of a $20 pocket money that goes on snacks, saving and games', a: 2, why: 'the parts add up to <b>one whole</b> $20.' },
      { s: 'how many goals each of 6 netball players scored this season', a: 0, why: 'you are comparing <b>separate players</b>.' },
      { s: 'how much water was left in a tank at the end of each day for a week', a: 1, why: 'it is the same measurement <b>over time</b>.' },
    ];
    const c = R.pick(cases);
    const opts = ['Bar chart', 'Line graph', 'Pie chart'];
    return choiceQ(`Which display is the <b>best</b> way to show this data?<br>${c.s[0].toUpperCase() + c.s.slice(1)}.`, null, opts, c.a,
      '<b>Bar</b> = compare separate groups. <b>Line</b> = something changing over time. <b>Pie</b> = parts of one whole.',
      [`Ask: is it changing <b>over time</b>? Is it <b>parts of a whole</b>? Or is it <b>separate groups</b> to compare?`,
        `Here, ${c.why}`, `Answer: <b>${opts[c.a]}</b>.`], 'choose');
  }

  function calc(level) {
    if (level === 1) return R.pick([() => barCalc(1), () => dotCalc(1), () => pictoCalc(1), () => twoWayCalc(1), () => pieCalc(1), () => pieCalc(1), () => lineCalc(1), () => lineCalc(1)])();
    if (level === 2) return R.pick([() => barCalc(2), () => dotCalc(2), () => pictoCalc(2), () => stemCalc(2), () => twoWayCalc(2), () => pieCalc(2), () => pieCalc(2), () => lineCalc(2), () => lineCalc(2), () => scatterQ(2), chooseDisplayQ])();
    return R.pick([() => barCalc(3), () => dotCalc(3), () => pictoCalc(3), () => stemCalc(3), () => twoWayCalc(3), () => pieCalc(3), () => pieCalc(3), () => lineCalc(3), () => lineCalc(3), () => scatterQ(3), chooseDisplayQ])();
  }
  function word(level) {
    if (level === 1) return R.pick([() => barWord(1), () => dotWord(1), () => pictoWord(1), () => stemWord(1), () => twoWayWord(1), () => pieWord(1), () => pieWord(1), () => lineWord(1), () => lineWord(1)])();
    if (level === 2) return R.pick([() => barWord(2), () => dotWord(2), () => pictoWord(2), () => stemWord(2), () => twoWayWord(2), () => pieWord(2), () => pieWord(2), () => lineWord(2), () => lineWord(2), () => scatterQ(2), chooseDisplayQ])();
    return R.pick([() => barWord(3), () => dotWord(3), () => pictoWord(3), () => stemWord(3), () => twoWayWord(3), () => pieWord(3), () => pieWord(3), () => lineWord(3), () => lineWord(3), () => scatterQ(3), chooseDisplayQ])();
  }

  HL.registerTopic({
    id: 'data-displays', subject: 'maths', strand: 'statistics', order: 2,
    name: 'Reading graphs & tables', short: 'Graphs & tables',
    blurb: 'Read numbers off bar charts, pie charts, line graphs, dot plots, pictographs, stem-and-leaf plots and two-way tables.',
    example: 'Bar chart: Kiwi bar reaches 15, Apple reaches 10 → 5 more chose Kiwi',
    animal: 'frog',
    learn: {
      what: '<p>Picture the data as <b>students standing in groups</b>: everyone who chose Kiwi stands in the Kiwi queue. A data display is a photo of those queues. A <b>bar</b> is a queue, a <b>dot</b> is one student, a pictograph <b>symbol</b> is a small group. The skill is to <b>read carefully</b>: check the <b>scale</b> or <b>key</b> first, then the labels, then the numbers. Most mistakes come from reading the scale wrong, not from the maths.</p>',
      visual: (() => {
        const B = '#2A6FA5', G = '#2FA97A', cats = ['Apple', 'Kiwi', 'Pear', 'Plum'], vals = [6, 14, 10, 4];
        const left = 46, right = 226, top = 26, bottom = 164, H = bottom - top, maxV = 16;
        const y = (v) => bottom - (H * v) / maxV;
        let b = '';
        for (let i = 0; i <= 8; i++) b += `<line x1="${left}" y1="${y(i * 2)}" x2="${right}" y2="${y(i * 2)}" stroke="${i === 0 ? C.ink : C.lav}" stroke-width="${i === 0 ? 2 : 1}"/><text x="${left - 6}" y="${y(i * 2) + 5}" font-size="13" text-anchor="end">${i * 2}</text>`;
        b += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
        const bw = (right - left) / 4, barW = 28;
        cats.forEach((c, i) => { const x = left + bw * i + (bw - barW) / 2; b += `<rect x="${x}" y="${y(vals[i])}" width="${barW}" height="${bottom - y(vals[i])}" rx="3" fill="${[C.pink, C.mint, C.butter, C.lav][i]}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + barW / 2}" y="${bottom + 16}" font-size="13" text-anchor="middle">${c}</text>`; });
        b += `<line x1="${left}" y1="${y(14)}" x2="${left + bw * 1.5}" y2="${y(14)}" stroke="${C.rose}" stroke-width="2.5" stroke-dasharray="5 3"/>`;
        b += `<text x="${(left + right) / 2}" y="${bottom + 36}" font-size="13" text-anchor="middle">Favourite fruit</text>`;
        b += `<text transform="translate(12 ${(top + bottom) / 2}) rotate(-90)" font-size="13" text-anchor="middle">Students</text>`;
        const badge = (x, yy, n, col) => `<circle cx="${x}" cy="${yy}" r="9" fill="${col}"/><text x="${x}" y="${yy + 5}" font-size="13" text-anchor="middle" fill="#fff">${n}</text>`;
        b += badge(left - 28, top + 2, 1, B) + badge(left + bw * 1.5 + 12, y(14), 2, C.rose) + badge(206, bottom + 36, 3, G);
        b += `<text x="242" y="30" font-size="13" fill="${B}">① scale goes</text><text x="242" y="46" font-size="13" fill="${B}">up in 2s</text>`;
        b += `<text x="242" y="80" font-size="13" fill="${C.rose}">② top of bar,</text><text x="242" y="96" font-size="13" fill="${C.rose}">read across:</text><text x="242" y="112" font-size="13" fill="${C.rose}">Kiwi = 14</text>`;
        b += `<text x="242" y="146" font-size="13" fill="${G}">③ labels say</text><text x="242" y="162" font-size="13" fill="${G}">what each</text><text x="242" y="178" font-size="13" fill="${G}">bar counts</text>`;
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        '<b>Bar chart</b>: read the top of the bar <b>across</b> to the scale. Check what each gridline is worth (1, 2, 5 or 10)',
        '<b>Dot plot</b>: each dot = one item. Tallest stack = <b>mode</b>. Count dots for totals',
        '<b>Pictograph</b>: read the <b>key</b> first. Number = symbols × key value. Half a symbol = half the key',
        '<b>Stem-and-leaf</b>: stem = tens, leaf = ones. "3 | 7" means <b>37</b>. Each leaf is one value, already in order',
        '<b>Two-way table</b>: find the <b>row</b>, then the <b>column</b>. Totals are found by adding along',
        '"How many <b>more</b>" = subtract. "<b>Altogether</b>" = add',
        '<b>Pie chart</b>: the whole circle = <b>everyone</b>. Half the circle = half of them, a quarter = a quarter of them',
        '<b>Pie chart</b> count: one equal piece = total ÷ number of pieces. Then multiply by how many pieces the slice has',
        '<b>Line graph</b>: dots joined up show <b>change over time</b>. The steepest climb is the biggest <b>rise</b>',
        '<b>Scatter plot</b>: dots climbing to the right = <b>positive</b>, falling to the right = <b>negative</b>, all over the place = <b>no relationship</b>',
        '<b>Which display?</b> bar = compare <b>separate groups</b>, line = <b>over time</b>, pie = <b>parts of one whole</b>',
      ],
      steps: [
        '<b>Ask: what is the scale or key?</b> Say it out loud: "each line is 2", "each symbol is 5".',
        '<b>Find the right group</b>: which bar, row, stem or dot stack is the question about?',
        '<b>Read the number</b>: top of bar across to the scale; count dots; symbols × key; stem then leaf.',
        '<b>Do the maths</b> the question asks: subtract for "more than", add for "altogether", order for median.',
        '<b>Pie chart?</b> Say how many equal pieces the circle is cut into, work out what <b>one piece</b> is worth, then count the pieces in the slice.',
        '<b>Line graph?</b> Go up from the day, across to the scale. For the biggest rise, look for the <b>steepest</b> climb.',
        '<b>Check</b> it makes sense: does the biggest bar give the biggest number?',
      ],
      examples: [
        (() => {
          const cats = ['Apple', 'Kiwi', 'Pear', 'Plum'], vals = [6, 14, 10, 4], left = 40, right = 220, top = 20, bottom = 140, H = bottom - top, maxV = 16;
          const y = (v) => bottom - (H * v) / maxV;
          let b = '';
          for (let i = 0; i <= 8; i++) b += `<line x1="${left}" y1="${y(i * 2)}" x2="${right}" y2="${y(i * 2)}" stroke="${i === 0 ? C.ink : C.lav}" stroke-width="${i === 0 ? 2 : 1}"/><text x="${left - 6}" y="${y(i * 2) + 5}" font-size="13" text-anchor="end">${i * 2}</text>`;
          b += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${bottom}" stroke="${C.ink}" stroke-width="2"/>`;
          const bw = (right - left) / 4, barW = 28;
          cats.forEach((c, i) => { const x = left + bw * i + (bw - barW) / 2; b += `<rect x="${x}" y="${y(vals[i])}" width="${barW}" height="${bottom - y(vals[i])}" rx="3" fill="${[C.pink, C.mint, C.butter, C.lav][i]}" stroke="${C.ink}" stroke-width="1.5"/><text x="${x + barW / 2}" y="${bottom + 16}" font-size="13" text-anchor="middle">${c}</text>`; });
          [[0, 6, C.rose], [1, 14, C.rose]].forEach(([i, v, col]) => { const x = left + bw * i + bw / 2; b += `<text x="${x}" y="${y(v) - 6}" font-size="13" text-anchor="middle" fill="${col}">${v}</text>`; });
          b += `<text x="236" y="60" font-size="13" fill="${C.rose}">Kiwi 14</text><text x="236" y="78" font-size="13" fill="${C.rose}">Apple 6</text><text x="236" y="96" font-size="13">14 − 6 = 8</text>`;
          return { q: 'The bar chart shows favourite fruit. How many <b>more</b> students chose Kiwi than Apple?', visual: `<svg viewBox="0 0 320 160" width="320" height="160" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the <b>Kiwi queue</b> and the <b>Apple queue</b> of students standing next to each other.', '1. What is the scale? Each line is <b>2</b>.', '2. Read the Kiwi bar across: 14. Read the Apple bar across: 6.', '3. "How many more" → subtract: 14 − 6 = <b>8</b>.'], a: '8 more students' };
        })(),
        { q: 'Pictograph of pets: the Dog row shows ★★★★ and the Cat row shows ★★ and a half star. Key: ★ = 10 pets. How many dogs and how many cats?',
          visual: `<table class="data"><tr><th>Pet</th><th style="text-align:left">Number</th></tr><tr><th>Dog</th><td style="text-align:left;color:#E0568C;font-size:1.3em;letter-spacing:3px">★★★★</td></tr><tr><th>Cat</th><td style="text-align:left;color:#2A6FA5;font-size:1.3em;letter-spacing:3px">★★<span style="display:inline-block;width:.55em;overflow:hidden;vertical-align:bottom">★</span></td></tr><tr><td colspan="2" style="text-align:left"><b>Key:</b> ★ = 10 pets</td></tr></table>`,
          working: ['Picture each ★ as a <b>group of 10 pets</b> standing together.', '1. What is the key? One star = <b>10</b>.', '2. Dogs: 4 stars → 4 × 10 = <b>40</b>.', '3. Cats: 2 and a half stars → 2 × 10 = 20, plus half of 10 is 5 → 20 + 5 = <b>25</b>.'], a: '40 dogs, 25 cats' },
        (() => {
          const counts = [3, 5, 4, 1, 1], x0 = 50, step = 44, base = 112;
          let b = `<line x1="30" y1="${base}" x2="240" y2="${base}" stroke="${C.ink}" stroke-width="2"/>`;
          counts.forEach((n, i) => { const x = x0 + i * step; for (let k = 0; k < n; k++) b += `<circle cx="${x}" cy="${base - 12 - k * 18}" r="7" fill="${i === 1 ? C.rose : C.sky}" stroke="${C.ink}" stroke-width="1.5"/>`; b += `<text x="${x}" y="${base + 18}" font-size="13" text-anchor="middle">${i}</text>`; });
          b += `<text x="138" y="148" font-size="13" text-anchor="middle">Number of brothers and sisters</text>`;
          b += `<text x="94" y="12" font-size="13" fill="${C.rose}" text-anchor="middle">tallest stack = mode</text><text x="250" y="60" font-size="13">3 + 5 + 4</text><text x="250" y="78" font-size="13">+ 1 + 1 = 14</text>`;
          return { q: 'The dot plot shows how many brothers and sisters each student in a class has. What is the <b>mode</b>, and how many students were asked?', visual: `<svg viewBox="0 0 330 158" width="330" height="158" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture <b>each dot as one student</b> standing on the number that matches them.', '1. What is each dot worth? One student.', '2. Mode = the tallest stack. The stack on 1 has 5 dots → mode = <b>1</b>.', '3. How many students? Count every dot: 3 + 5 + 4 + 1 + 1 = <b>14</b>.'], a: 'mode = 1, 14 students' };
        })(),
        { q: 'The stem-and-leaf plot shows test scores. What is the <b>highest</b> score, the <b>mode</b>, and the <b>median</b>?',
          visual: `<table class="data"><tr><th colspan="2">Test scores (%)</th></tr><tr><th>Stem</th><th style="text-align:left">Leaf</th></tr><tr><th>2</th><td style="text-align:left;letter-spacing:6px">1 4 4 8</td></tr><tr><th>3</th><td style="text-align:left;letter-spacing:6px">0 2 7</td></tr><tr><th>4</th><td style="text-align:left;letter-spacing:6px">5</td></tr><tr><td colspan="2" style="text-align:left"><b>Key:</b> 3 | 7 means 37 &nbsp;→&nbsp; <span style="color:#2A6FA5">stem = tens</span>, <span style="color:#E0568C">leaf = ones</span></td></tr></table>`,
          working: ['Picture each <b>stem as a shelf</b> (the 20s shelf, the 30s shelf, the 40s shelf) and each leaf as one student\'s score sitting on it.', '1. What is the key? 3 | 7 = 37, so stem is the <b>tens</b>, leaf is the <b>ones</b>.', '2. Highest: the last leaf on the last shelf: 4 | 5 = <b>45</b>.', '3. Mode: which leaf repeats on the same shelf? 2 | 4 twice → <b>24</b>.', '4. Median: 8 scores in order: 21, 24, 24, 28, 30, 32, 37, 45. The two middles are 28 and 30 → (28 + 30) ÷ 2 = <b>29</b>.'], a: 'highest 45, mode 24, median 29' },
        { q: 'The two-way table shows which sport Year 7 and Year 8 students chose. What <b>fraction</b> of Year 8 students chose netball?',
          visual: `<table class="data"><tr><th></th><th>Netball</th><th>Rugby</th><th>Total</th></tr><tr><th>Year 7</th><td>9</td><td>11</td><td>20</td></tr><tr><th>Year 8</th><td style="background:#F9A8C9">12</td><td style="background:#F9A8C9">8</td><td style="background:#F9A8C9"><b>20</b></td></tr><tr><th>Total</th><td>21</td><td>19</td><td>40</td></tr></table>`,
          working: ['Picture the Year 8 students <b>standing in one line</b>: 12 hold netballs, 8 hold rugby balls.', '1. Which row? <b>Year 8</b> (the pink row).', '2. How many Year 8 students altogether? 12 + 8 = 20 (the row total).', '3. Fraction = netball ÷ row total = ' + N.fracHtml(12, 20) + '.', '4. Simplify: divide top and bottom by 4 → <b>' + N.fracHtml(3, 5) + '</b>.'], a: N.fracHtml(3, 5) + ' of Year 8 chose netball' },
        { q: 'A pictograph shows rainy days in Wellington. The key says ☂ = 4 days. May shows ☂☂☂ and a half. How many rainy days were there in May?', working: ['Picture each ☂ as a <b>group of 4 rainy days</b>.', '1. What is the key? One symbol = <b>4</b> days.', '2. Whole symbols: 3 × 4 = 12.', '3. Half a symbol: half of 4 = 2.', '4. Altogether: 12 + 2 = <b>14</b>.'], a: '14 rainy days' },
        (() => {
          const d = { sc: { title: 'How we get to school' }, cats: ['Bus', 'Walk', 'Car', 'Bike'], parts: [4, 2, 1, 1], D: 8, m: 3, total: 24, counts: [12, 6, 3, 3] };
          return { q: 'The pie chart shows how <b>24 students</b> get to school. How many come by <b>bus</b>? What <b>fraction</b> walk?', visual: pieSvg(d, true),
            working: ['Picture all <b>24 students standing in one big ring</b>. Each slice of the pie is one queue of them.',
              '1. How many equal pieces is the circle cut into? <b>8</b>.',
              '2. So one piece = 24 ÷ 8 = <b>3</b> students.',
              '3. Bus is 4 pieces: 4 × 3 = <b>12</b> students.',
              '4. Walk is 2 pieces out of 8 = ' + N.fracHtml(2, 8) + ' = <b>' + N.fracHtml(1, 4) + '</b>.'],
            a: '12 students by bus, ' + N.fracHtml(1, 4) + ' walk' };
        })(),
        (() => {
          const d = { sc: lineScenarios[0], n: 5, step: 2, maxU: 8, u: [4, 5, 3, 6, 3], gaps: [1, -2, 3, -3], xs: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals: [8, 10, 6, 12, 6] };
          return { q: 'The line graph shows the midday temperature. What was it on <b>Wednesday</b>, and between which two days was the <b>biggest rise</b>?', visual: lineSvg(d),
            working: ['Picture one thermometer read at midday each day, and the dots joined up so you can see the <b>story of the week</b>.',
              '1. What is each gridline worth? The labels go 0, 2, 4, 6 … so each line is <b>2</b>.',
              '2. Wednesday: go up to the dot, then straight across → <b>6°C</b>.',
              '3. Biggest rise = the <b>steepest climb</b>. Wed 6 → Thu 12 is up 6, bigger than Mon → Tue (up 2).',
              '4. So the biggest rise is <b>Wed → Thu</b>.'],
            a: 'Wednesday 6°C, biggest rise Wed → Thu (+6°C)' };
        })(),
        (() => {
          const d = { sc: { x: 'Hours of practice', y: 'Goals scored', rel: 'pos' }, pts: [[1, 2], [2, 3], [3, 3.5], [4, 5], [5, 4.5], [6, 6], [7, 7], [8, 8], [9, 8.5]] };
          return { q: 'Each dot is one player. Does this scatter plot show a <b>positive</b>, a <b>negative</b>, or <b>no</b> relationship?', visual: scatterSvg(d),
            working: ['Picture the players <b>lined up from least practice to most practice</b>, each holding up their goal tally.',
              '1. Where do I start reading? At the <b>left</b>, then slide right.',
              '2. Do the dots climb or fall? They <b>climb</b>.',
              '3. Both go up together → that is a <b>positive relationship</b>: more practice, more goals.'],
            a: 'a positive relationship' };
        })(),
        { q: 'Which display is best: (a) the temperature each day for a week, (b) favourite sport of 5 groups of students, (c) how a class of 30 voted between 4 lunch options?',
          working: ['Picture the three questions: (a) one thermometer read <b>day after day</b>, (b) five <b>separate queues</b> of students, (c) <b>one whole class</b> split into 4 slices.',
            '1. Is it changing <b>over time</b>? (a) yes → <b>line graph</b>.',
            '2. Is it <b>separate groups</b> to compare? (b) yes → <b>bar chart</b>.',
            '3. Is it <b>parts of one whole</b>? (c) yes, the whole class → <b>pie chart</b>.'],
          a: '(a) line graph, (b) bar chart, (c) pie chart' },
      ],
      tips: [
        'Always look at the <b>scale or key first</b>. Then read the data.',
        '"How many more" means <b>subtract</b>. "Altogether" means <b>add</b>.',
        'For a median from a stem-and-leaf plot, count the leaves first, then count in from both ends.',
        'A bar halfway between two gridlines is worth <b>half the gap</b>: halfway between 10 and 20 is 15.',
        'On a pie chart do not guess the numbers: work out what <b>one equal piece</b> is worth first.',
        'On a line graph the <b>steepest</b> part is the fastest change, not the highest point.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
