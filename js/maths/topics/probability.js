/* Topic: Probability — single events, complements, likelihood words, sample spaces, expected numbers, experimental probability. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const C = { pink: '#F9A8C9', rose: '#E0568C', lav: '#C9B8F2', peach: '#FFC79A', mint: '#A6E3B8', sky: '#A9D8F5', butter: '#FFE98A', ink: '#4A3B48' };
  const colourHex = { pink: C.pink, blue: C.sky, green: C.mint, yellow: C.butter, purple: C.lav, orange: C.peach };
  const colourNames = Object.keys(colourHex);
  const D = Math.PI / 180;
  const r1 = (v) => Math.round(v * 10) / 10;
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-size="15" fill="${C.ink}">${body}</svg>`;
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const frac = (n, d) => N.fracHtml(n, d);
  const fracAns = (n, d) => ({ type: 'fraction', value: N.simplify(n, d), placeholder: 'e.g. 3/4' });
  const simp = (n, d) => { const f = N.simplify(n, d); return frac(f.n, f.d); };
  const choiceQ = (prompt, visual, options, correct, hint, working, skill) => {
    const order = R.shuffle(options.map((_, i) => i));
    return { prompt, visual, answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) }, hint, working, finalAnswer: options[correct], skill };
  };
  /** answer form for a probability n/d: 'fraction' | 'decimal' | 'percent' */
  const probAnswer = (n, d, form) => {
    const f = N.simplify(n, d);
    if (form === 'percent') return { answer: { type: 'number', value: N.round(100 * n / d, 2), unit: '%' }, shown: `${N.fmt(100 * n / d)}%`, ask: 'as a percentage' };
    if (form === 'decimal') return { answer: { type: 'number', value: N.round(n / d, 4) }, shown: N.fmt(n / d), ask: 'as a decimal' };
    return { answer: fracAns(n, d), shown: frac(f.n, f.d), ask: 'as a fraction in simplest form' };
  };
  const niceForm = (d, level) => (level === 1 ? 'fraction' : (100 % d === 0 && R.chance(0.4) ? R.pick(['decimal', 'percent']) : 'fraction'));

  // ----- spinner -----
  function spinner(n, colours) { // colours: array of n colour names
    const cx = 105, cy = 108, r = 88;
    let b = '';
    for (let i = 0; i < n; i++) {
      const a1 = (-90 + 360 / n * i) * D, a2 = (-90 + 360 / n * (i + 1)) * D;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      b += `<path d="M${cx} ${cy} L${r1(x1)} ${r1(y1)} A${r} ${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${r1(x2)} ${r1(y2)} Z" fill="${colourHex[colours[i]]}" stroke="${C.ink}" stroke-width="2"/>`;
      const am = (a1 + a2) / 2; b += `<text x="${r1(cx + r * 0.62 * Math.cos(am))}" y="${r1(cy + r * 0.62 * Math.sin(am) + 5)}" text-anchor="middle" font-weight="bold">${i + 1}</text>`;
    }
    b += `<polygon points="${cx},${cy - 14} ${cx + 8},${cy + 4} ${cx - 8},${cy + 4}" fill="${C.ink}" transform="rotate(${R.int(0, 359)} ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="4" fill="${C.ink}"/>`;
    const used = [...new Set(colours)];
    used.forEach((c, i) => { b += `<rect x="215" y="${40 + i * 26}" width="18" height="18" rx="4" fill="${colourHex[c]}" stroke="${C.ink}" stroke-width="1.5"/><text x="240" y="${54 + i * 26}">${c}</text>`; });
    return svg(320, 215, b);
  }
  function spinnerQ(level) {
    const n = level === 1 ? R.pick([4, 5, 6]) : R.pick([5, 6, 8, 10]);
    const used = R.sample(colourNames, R.int(2, Math.min(4, n - 1)));
    let colours; do { colours = Array(n).fill(0).map(() => R.pick(used)); } while (new Set(colours).size < used.length);
    const visual = spinner(n, colours);
    const kind = R.pick(level === 1 ? ['colour', 'colour', 'number'] : ['colour', 'number', 'notcolour', 'range', 'even']);
    let fav, desc, w;
    if (kind === 'colour' || kind === 'notcolour') {
      const c = R.pick(used), cnt = colours.filter((x) => x === c).length;
      if (kind === 'colour') { fav = cnt; desc = `<b>${c}</b>`; w = [`${cnt} of the ${n} equal sectors are ${c}.`]; }
      else { fav = n - cnt; desc = `<b>not ${c}</b>`; w = [`${cnt} sectors are ${c}, so ${n} − ${cnt} = ${n - cnt} sectors are not ${c}.`]; }
    } else if (kind === 'number') { const k = R.int(1, n); fav = 1; desc = `the number <b>${k}</b>`; w = [`Only 1 of the ${n} equal sectors shows ${k}.`]; }
    else if (kind === 'even') { fav = Math.floor(n / 2); desc = 'an <b>even number</b>'; w = [`Even numbers on the spinner: ${Array(n).fill(0).map((_, i) => i + 1).filter((v) => v % 2 === 0).join(', ')} (${fav} of ${n}).`]; }
    else { const k = R.int(2, n - 2); fav = n - k; desc = `a number <b>greater than ${k}</b>`; w = [`Numbers greater than ${k}: ${Array(n).fill(0).map((_, i) => i + 1).filter((v) => v > k).join(', ')} (${fav} of ${n}).`]; }
    if (fav === 0 || fav === n) return spinnerQ(level);
    const form = niceForm(n, level), pa = probAnswer(fav, n, form);
    const f = N.simplify(fav, n);
    return {
      prompt: `The spinner has ${n} equal sectors. What is the probability it lands on ${desc}? Give your answer ${pa.ask}.`,
      visual, answer: pa.answer,
      hint: 'Probability = number of sectors you want ÷ total number of sectors.',
      working: w.concat([`P = ${frac(fav, n)}${f.d !== n ? ` = ${frac(f.n, f.d)}` : ''}.`, form === 'fraction' ? `Answer: <b>${pa.shown}</b>.` : `${frac(f.n, f.d)} ${form === 'percent' ? '× 100' : 'as a decimal'} = <b>${pa.shown}</b>.`]),
      finalAnswer: pa.shown, skill: 'single',
    };
  }

  // ----- marbles / lollies -----
  function bagQ(level, ctx) {
    const things = ctx || R.pick([{ thing: 'marbles', place: 'a bag' }, { thing: 'lollies', place: 'a jar' }, { thing: 'socks', place: 'a drawer' }, { thing: 'counters', place: 'a box' }]);
    const nCol = level === 1 ? 2 : R.pick([2, 3, 3]);
    const cols = R.sample(colourNames, nCol);
    let counts, total;
    if (level >= 2 && R.chance(0.5)) { total = R.pick([10, 20, 25, 50]); counts = []; let left = total; for (let i = 0; i < nCol - 1; i++) { const v = R.int(1, left - (nCol - 1 - i)); counts.push(v); left -= v; } counts.push(left); }
    else { counts = cols.map(() => R.int(1, level === 1 ? 6 : 9)); total = sum(counts); }
    const listing = cols.map((c, i) => `${counts[i]} ${c}`).slice(0, -1).join(', ') + ' and ' + `${counts[nCol - 1]} ${cols[nCol - 1]}`;
    const kind = R.pick(level === 1 ? ['one'] : ['one', 'one', 'not', 'either']);
    let fav, desc, w;
    if (kind === 'one') { const i = R.int(0, nCol - 1); fav = counts[i]; desc = `<b>${cols[i]}</b>`; w = [`${counts[i]} ${cols[i]} out of ${total} altogether.`]; }
    else if (kind === 'not') { const i = R.int(0, nCol - 1); fav = total - counts[i]; desc = `<b>not ${cols[i]}</b>`; w = [`${total} − ${counts[i]} = ${fav} are not ${cols[i]}.`]; }
    else { const [i, j] = R.pair(0, nCol - 1); fav = counts[i] + counts[j]; desc = `<b>${cols[i]} or ${cols[j]}</b>`; w = [`${counts[i]} + ${counts[j]} = ${fav} are ${cols[i]} or ${cols[j]}.`]; }
    if (fav === 0 || fav === total) return bagQ(level, ctx);
    const form = niceForm(total, level), pa = probAnswer(fav, total, form), f = N.simplify(fav, total);
    return {
      prompt: `${things.place[0].toUpperCase() + things.place.slice(1)} has ${listing} ${things.thing}. One is taken out without looking. What is the probability it is ${desc}? Give your answer ${pa.ask}.`,
      answer: pa.answer,
      hint: `First find the total: ${counts.join(' + ')}. Probability = the ones you want ÷ total.`,
      working: [`Total = ${counts.join(' + ')} = ${total}.`].concat(w, [`P = ${frac(fav, total)}${f.d !== total ? ` = ${frac(f.n, f.d)}` : ''}.`, form === 'fraction' ? `Answer: <b>${pa.shown}</b>.` : `= <b>${pa.shown}</b> ${form === 'percent' ? '(multiply by 100)' : 'as a decimal'}.`]),
      finalAnswer: pa.shown, skill: 'single',
    };
  }

  // ----- dice and cards -----
  function diceQ(level) {
    const events = [
      { d: 'a <b>6</b>', ok: [6] }, { d: 'an <b>even</b> number', ok: [2, 4, 6] }, { d: 'an <b>odd</b> number', ok: [1, 3, 5] },
      { d: 'a number <b>greater than 4</b>', ok: [5, 6] }, { d: 'a number <b>less than 3</b>', ok: [1, 2] }, { d: 'a <b>prime</b> number', ok: [2, 3, 5] },
      { d: 'a <b>multiple of 3</b>', ok: [3, 6] }, { d: 'a number <b>at least 2</b>', ok: [2, 3, 4, 5, 6] }, { d: 'a <b>1 or a 2</b>', ok: [1, 2] }, { d: 'a <b>square number</b>', ok: [1, 4] },
    ];
    const e = R.pick(level === 1 ? events.slice(0, 5) : events);
    const form = niceForm(6, level), pa = probAnswer(e.ok.length, 6, form), f = N.simplify(e.ok.length, 6);
    return {
      prompt: `A fair dice (numbered 1 to 6) is rolled once. What is the probability of getting ${e.d}? Give your answer ${pa.ask}.`,
      answer: pa.answer,
      hint: 'List the numbers on the dice that count. Probability = how many count ÷ 6.',
      working: [`Numbers that count: ${e.ok.join(', ')} (${e.ok.length} of the 6 faces).`, `P = ${frac(e.ok.length, 6)}${f.d !== 6 ? ` = ${frac(f.n, f.d)}` : ''}.`, `Answer: <b>${pa.shown}</b>.`],
      finalAnswer: pa.shown, skill: 'single',
    };
  }
  function cardQ() {
    const events = [
      { d: 'a <b>heart</b>', n: 13, why: '13 of the 52 cards are hearts' }, { d: 'a <b>red</b> card', n: 26, why: '26 of the 52 cards are red (hearts and diamonds)' },
      { d: 'a <b>king</b>', n: 4, why: 'there are 4 kings (one in each suit)' }, { d: 'the <b>ace of spades</b>', n: 1, why: 'there is only 1 ace of spades' },
      { d: 'a <b>picture card</b> (jack, queen or king)', n: 12, why: '3 picture cards × 4 suits = 12' }, { d: 'a <b>black queen</b>', n: 2, why: 'queen of spades and queen of clubs = 2' },
      { d: 'a <b>club</b> or a <b>spade</b>', n: 26, why: '13 + 13 = 26 black cards' }, { d: 'a <b>7</b>', n: 4, why: 'there are four 7s' },
    ];
    const e = R.pick(events), f = N.simplify(e.n, 52);
    return {
      prompt: `A card is picked at random from a normal pack of 52 playing cards. What is the probability it is ${e.d}? Give your answer as a fraction in simplest form.`,
      answer: fracAns(e.n, 52),
      hint: 'A pack has 4 suits (hearts, diamonds, clubs, spades) with 13 cards each. Hearts and diamonds are red.',
      working: [`${e.why[0].toUpperCase() + e.why.slice(1)}.`, `P = ${frac(e.n, 52)} = <b>${frac(f.n, f.d)}</b>.`],
      finalAnswer: frac(f.n, f.d), skill: 'single',
    };
  }

  // ----- likelihood words -----
  function likelihoodQ(level) {
    const items = [
      ['Rolling a 7 on a normal dice', 'impossible', 'a normal dice only goes up to 6'], ['Getting a head when you flip a fair coin', 'even chance', 'heads and tails are equally likely (1/2)'],
      ['The sun rising tomorrow morning', 'certain', 'it happens every day'], ['Picking a red marble from a bag with 9 red and 1 blue', 'likely', '9 out of 10 are red'],
      ['Picking a blue marble from a bag with 9 red and 1 blue', 'unlikely', 'only 1 out of 10 is blue'], ['Rolling a number less than 7 on a normal dice', 'certain', 'every face is less than 7'],
      ['Rolling an even number on a normal dice', 'even chance', '3 of the 6 faces are even (1/2)'], ['It snowing in Auckland in January', 'unlikely', 'it is summer and Auckland is warm'],
      ['Picking a green lolly from a jar of only red lollies', 'impossible', 'there are no green lollies'], ['Spinning a 4-sector spinner with 3 pink sectors and landing on pink', 'likely', '3 out of 4 sectors are pink'],
      ['Picking a weekday when you choose a random day of the week', 'likely', '5 of the 7 days are weekdays'], ['Rolling a 1 on a normal dice', 'unlikely', 'only 1 of the 6 faces (1/6)'],
    ];
    const [ev, ans, why] = R.pick(items);
    const all = ['impossible', 'unlikely', 'even chance', 'likely', 'certain'];
    const opts = R.shuffle(R.sample(all.filter((o) => o !== ans), 3).concat([ans]));
    return { prompt: `Which word best describes this event?<br><b>${ev}</b>`, answer: { type: 'choice', value: opts.indexOf(ans), choices: opts }, hint: 'Impossible = 0, even chance = 1/2, certain = 1. Unlikely is below 1/2, likely is above 1/2.', working: [`${ev}: ${why}.`, `So it is <b>${ans}</b>.`], finalAnswer: ans, skill: 'words' };
  }

  // ----- complement -----
  function complementQ(level) {
    const form = level === 1 ? R.pick(['percent', 'fraction']) : R.pick(['decimal', 'percent', 'fraction']);
    const ev = R.pick([['it rains tomorrow', 'it does not rain'], ['the bus is late', 'the bus is on time'], ['Harper wins the raffle', 'Harper does not win'], ['a netball shot goes in', 'the shot misses'], ['the spinner lands on pink', 'the spinner does not land on pink'], ['a seed sprouts', 'the seed does not sprout']]);
    if (form === 'fraction') {
      const d = R.pick([3, 4, 5, 6, 7, 8, 9, 10]), n = R.int(1, d - 1), f = N.simplify(n, d), g = N.simplify(d - n, d);
      return { prompt: `The probability that ${ev[0]} is ${frac(f.n, f.d)}. What is the probability that ${ev[1]}? Give your answer as a fraction in simplest form.`, answer: fracAns(d - n, d), hint: 'The two probabilities add up to 1. Subtract from 1.', working: [`P(not) = 1 − ${frac(f.n, f.d)}.`, `1 = ${frac(f.d, f.d)}, so ${frac(f.d, f.d)} − ${frac(f.n, f.d)} = ${frac(f.d - f.n, f.d)}${g.d !== f.d ? ` = ${frac(g.n, g.d)}` : ''}.`, `Answer: <b>${frac(g.n, g.d)}</b>.`], finalAnswer: frac(g.n, g.d), skill: 'complement' };
    }
    if (form === 'percent') {
      const p = R.step(5, 95, 5);
      return { prompt: `The probability that ${ev[0]} is ${p}%. What is the probability that ${ev[1]}? Give your answer as a percentage.`, answer: { type: 'number', value: 100 - p, unit: '%' }, hint: 'The two probabilities add to 100%.', working: [`100% − ${p}% = ${100 - p}%.`, `Answer: <b>${100 - p}%</b>.`], finalAnswer: `${100 - p}%`, skill: 'complement' };
    }
    const p = R.pick([0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9]);
    const q = N.round(1 - p, 2);
    return { prompt: `The probability that ${ev[0]} is ${p}. What is the probability that ${ev[1]}? Give your answer as a decimal.`, answer: { type: 'number', value: q }, hint: 'The two probabilities add to 1. Work out 1 − ' + p + '.', working: [`1 − ${p} = ${q}.`, `Answer: <b>${q}</b>.`], finalAnswer: String(q), skill: 'complement' };
  }

  // ----- sample spaces -----
  function twoCoinsQ() {
    const ev = R.pick([['<b>two heads</b>', 1, 'HH'], ['<b>exactly one head</b>', 2, 'HT and TH'], ['<b>at least one tail</b>', 3, 'HT, TH and TT'], ['<b>two tails</b>', 1, 'TT'], ['<b>a head and a tail</b> (in any order)', 2, 'HT and TH']]);
    if (R.chance(0.25)) return { prompt: 'Two fair coins are flipped. How many different outcomes are there in the sample space?', answer: { type: 'number', value: 4 }, hint: 'List them: HH, HT, TH, TT.', working: ['Outcomes: HH, HT, TH, TT.', 'That is <b>4</b> outcomes.'], finalAnswer: '4', skill: 'sample-space' };
    const f = N.simplify(ev[1], 4);
    return { prompt: `Two fair coins are flipped. What is the probability of getting ${ev[0]}? Give your answer as a fraction in simplest form.`, answer: fracAns(ev[1], 4), hint: 'List all 4 outcomes first: HH, HT, TH, TT.', working: ['Sample space: HH, HT, TH, TT (4 outcomes).', `Outcomes that count: ${ev[2]} (${ev[1]}).`, `P = ${frac(ev[1], 4)}${f.d !== 4 ? ` = ${frac(f.n, f.d)}` : ''}. Answer: <b>${frac(f.n, f.d)}</b>.`], finalAnswer: frac(f.n, f.d), skill: 'sample-space' };
  }
  function coinDiceQ() {
    const ev = R.pick([['a <b>head and a 6</b>', 1, 'H6'], ['a <b>tail and an even number</b>', 3, 'T2, T4, T6'], ['a <b>head and a number greater than 2</b>', 4, 'H3, H4, H5, H6'], ['a <b>tail and a 1</b>', 1, 'T1'], ['a <b>head and an odd number</b>', 3, 'H1, H3, H5']]);
    if (R.chance(0.25)) return { prompt: 'A coin is flipped and a dice is rolled. How many different outcomes are there altogether?', answer: { type: 'number', value: 12 }, hint: '2 choices for the coin × 6 for the dice.', working: ['Coin: 2 outcomes. Dice: 6 outcomes.', '2 × 6 = <b>12</b> outcomes.'], finalAnswer: '12', skill: 'sample-space' };
    const f = N.simplify(ev[1], 12);
    return { prompt: `A fair coin is flipped and a fair dice is rolled. What is the probability of getting ${ev[0]}? Give your answer as a fraction in simplest form.`, answer: fracAns(ev[1], 12), hint: 'There are 2 × 6 = 12 equally likely outcomes. Count the ones that fit.', working: ['Sample space has 2 × 6 = 12 outcomes.', `Outcomes that count: ${ev[2]} (${ev[1]}).`, `P = ${frac(ev[1], 12)}${f.d !== 12 ? ` = ${frac(f.n, f.d)}` : ''}. Answer: <b>${frac(f.n, f.d)}</b>.`], finalAnswer: frac(f.n, f.d), skill: 'sample-space' };
  }
  function sumTable() {
    let h = '<table class="data" style="font-size:.9em"><tr><th>+</th>' + [1, 2, 3, 4, 5, 6].map((c) => `<th>${c}</th>`).join('') + '</tr>';
    for (let r = 1; r <= 6; r++) h += `<tr><th>${r}</th>` + [1, 2, 3, 4, 5, 6].map((c) => `<td>${r + c}</td>`).join('') + '</tr>';
    return h + '</table>';
  }
  function twoDiceQ() {
    const kind = R.pick(['sum', 'sum', 'sum', 'double', 'gt', 'lt', 'count']);
    const visual = sumTable();
    if (kind === 'count') return { prompt: 'Two dice are rolled and the numbers are added. How many equally likely outcomes are there in the sample space (see the table)?', visual, answer: { type: 'number', value: 36 }, hint: '6 outcomes for the first dice × 6 for the second.', working: ['6 × 6 = <b>36</b> outcomes.'], finalAnswer: '36', skill: 'two-dice' };
    let fav, desc, w;
    if (kind === 'sum') { const s = R.int(2, 12); fav = 6 - Math.abs(s - 7); desc = `the total is <b>${s}</b>`; w = [`Count the ${s}s in the table: ${fav}.`]; }
    else if (kind === 'double') { fav = 6; desc = 'you get a <b>double</b> (both dice the same)'; w = ['Doubles: 1+1, 2+2, 3+3, 4+4, 5+5, 6+6 (6 outcomes).']; }
    else if (kind === 'gt') { const s = R.pick([8, 9, 10]); fav = 0; for (let t = s + 1; t <= 12; t++) fav += 6 - Math.abs(t - 7); desc = `the total is <b>more than ${s}</b>`; w = [`Totals more than ${s}: count them in the table: ${fav}.`]; }
    else { const s = R.pick([4, 5, 6]); fav = 0; for (let t = 2; t < s; t++) fav += 6 - Math.abs(t - 7); desc = `the total is <b>less than ${s}</b>`; w = [`Totals less than ${s}: count them in the table: ${fav}.`]; }
    const f = N.simplify(fav, 36);
    return { prompt: `Two fair dice are rolled and the numbers are added. Use the table to find the probability that ${desc}. Give your answer as a fraction in simplest form.`, visual, answer: fracAns(fav, 36), hint: 'There are 36 outcomes in the table. Count the cells that fit, then simplify.', working: ['36 equally likely outcomes.'].concat(w, [`P = ${frac(fav, 36)}${f.d !== 36 ? ` = ${frac(f.n, f.d)}` : ''}. Answer: <b>${frac(f.n, f.d)}</b>.`]), finalAnswer: frac(f.n, f.d), skill: 'two-dice' };
  }

  // ----- expected number -----
  function expectedQ(level) {
    const sc = R.pick([
      { intro: (d) => `A spinner has ${d} equal sectors and 1 of them is pink. It is spun`, n: 1, d: R.pick([4, 5, 6, 8]), ev: 'pink' },
      { intro: () => 'A fair dice is rolled', n: 1, d: 6, ev: 'a 6' },
      { intro: () => 'A fair dice is rolled', n: 3, d: 6, ev: 'an even number' },
      { intro: () => 'A fair coin is flipped', n: 1, d: 2, ev: 'a head' },
      { intro: (d) => `A bag has 3 blue and ${d - 3} red marbles. A marble is picked and put back. This is done`, n: 3, d: R.pick([5, 8, 10]), ev: 'blue' },
      { intro: () => 'A spinner has 3 pink and 2 blue equal sectors. It is spun', n: 2, d: 5, ev: 'blue' },
    ]);
    const trials = sc.d * R.pick(level === 1 ? [5, 10] : [10, 12, 15, 20]);
    const exp = trials * sc.n / sc.d, f = N.simplify(sc.n, sc.d);
    return { prompt: `${sc.intro(sc.d)} ${trials} times. About how many times would you expect to get <b>${sc.ev}</b>?`, answer: { type: 'number', value: exp }, hint: `Expected number = probability × number of tries. P(${sc.ev}) = ${frac(f.n, f.d)}.`, working: [`P(${sc.ev}) = ${frac(sc.n, sc.d)}${f.d !== sc.d ? ` = ${frac(f.n, f.d)}` : ''}.`, `Expected = ${frac(f.n, f.d)} × ${trials} = ${trials} ÷ ${f.d} × ${f.n} = ${exp}.`, `About <b>${exp}</b> times.`], finalAnswer: String(exp), skill: 'expected' };
  }

  // ----- experimental probability -----
  function experimentalQ(level) {
    const sc = R.pick([
      { intro: 'A spinner was spun', outs: ['pink', 'blue', 'green'], ev: 'The results are shown in the table.' },
      { intro: 'A drawing pin was dropped', outs: ['point up', 'point down'], ev: 'The results are shown in the table.' },
      { intro: 'A bag of marbles was sampled (with replacement)', outs: ['red', 'blue', 'yellow', 'green'], ev: 'The results are shown in the table.' },
      { intro: 'A dice was rolled', outs: ['1', '2', '3', '4', '5', '6'], ev: 'The results are shown in the table.' },
    ]);
    const total = R.pick(level === 1 ? [20, 50] : [20, 25, 40, 50, 100]);
    let counts; do { counts = []; let left = total; for (let i = 0; i < sc.outs.length - 1; i++) { const v = R.int(1, left - (sc.outs.length - 1 - i)); counts.push(v); left -= v; } counts.push(left); } while (counts.filter((c) => c === Math.max(...counts)).length > 1);
    const visual = `<table class="data"><tr><th>Outcome</th>${sc.outs.map((o) => `<th>${o}</th>`).join('')}</tr><tr><th>Frequency</th>${counts.map((c) => `<td>${c}</td>`).join('')}</tr></table>`;
    const kind = R.pick(level === 1 ? ['prob', 'most'] : ['prob', 'prob', 'most', 'total']);
    if (kind === 'most') { const i = counts.indexOf(Math.max(...counts)); return choiceQ(`${sc.intro} ${total} times. ${sc.ev} Based on these results, which outcome is <b>most likely</b>?`, visual, sc.outs, i, 'The most likely outcome is the one that happened most often.', [`The biggest frequency is ${counts[i]} for ${sc.outs[i]}.`, `Most likely: <b>${sc.outs[i]}</b>.`], 'experimental'); }
    if (kind === 'total') return { prompt: `${sc.intro} a number of times. ${sc.ev} How many trials were there altogether?`, visual, answer: { type: 'number', value: total }, hint: 'Add up all the frequencies.', working: [`${counts.join(' + ')} = <b>${total}</b>.`], finalAnswer: String(total), skill: 'experimental' };
    const i = R.int(0, sc.outs.length - 1), form = level === 1 ? 'fraction' : R.pick(['fraction', 'decimal', 'percent']);
    const pa = probAnswer(counts[i], total, form), f = N.simplify(counts[i], total);
    return { prompt: `${sc.intro} ${total} times. ${sc.ev} What is the <b>experimental probability</b> of <b>${sc.outs[i]}</b>? Give your answer ${pa.ask}.`, visual, answer: pa.answer, hint: 'Experimental probability = how many times it happened ÷ total number of trials.', working: [`${sc.outs[i]} happened ${counts[i]} times out of ${total}.`, `P = ${frac(counts[i], total)}${f.d !== total ? ` = ${frac(f.n, f.d)}` : ''}.`, `Answer: <b>${pa.shown}</b>.`], finalAnswer: pa.shown, skill: 'experimental' };
  }

  // ----- tree diagrams (two events) -----
  const COIN = [{ lab: 'H', name: 'Head', col: C.butter }, { lab: 'T', name: 'Tail', col: C.sky }];
  const SPIN3 = [{ lab: 'P', name: 'Pink', col: C.pink }, { lab: 'B', name: 'Blue', col: C.sky }, { lab: 'G', name: 'Green', col: C.mint }];
  const NUM3 = [{ lab: '1', name: '1', col: C.peach }, { lab: '2', name: '2', col: C.lav }, { lab: '3', name: '3', col: C.mint }];
  function treeSvg(o1, o2, hit) {
    const n1 = o1.length, n2 = o2.length, leaves = n1 * n2;
    const top = 26, bot = 194, H = bot - top;
    const ly = (k) => top + H * k / (leaves - 1);
    const rx = 24, ry = (top + bot) / 2, x1 = 104, x2 = 184;
    let b = '';
    for (let i = 0; i < n1; i++) {
      const y1 = (ly(i * n2) + ly(i * n2 + n2 - 1)) / 2;
      b += `<line x1="${rx + 6}" y1="${ry}" x2="${x1 - 14}" y2="${y1}" stroke="${C.ink}" stroke-width="2"/>`;
      for (let j = 0; j < n2; j++) {
        const y2 = ly(i * n2 + j);
        b += `<line x1="${x1 + 14}" y1="${y1}" x2="${x2 - 14}" y2="${y2}" stroke="${C.ink}" stroke-width="2"/>`;
      }
      b += `<circle cx="${x1}" cy="${y1}" r="14" fill="${o1[i].col}" stroke="${C.ink}" stroke-width="2"/><text x="${x1}" y="${y1 + 5}" font-size="13" font-weight="700" text-anchor="middle">${o1[i].lab}</text>`;
      for (let j = 0; j < n2; j++) {
        const y2 = ly(i * n2 + j), on = hit ? hit(i, j) : false;
        b += `<circle cx="${x2}" cy="${y2}" r="14" fill="${o2[j].col}" stroke="${C.ink}" stroke-width="2"/><text x="${x2}" y="${y2 + 5}" font-size="13" font-weight="700" text-anchor="middle">${o2[j].lab}</text>`;
        b += `<text x="${x2 + 20}" y="${y2 + 5}" font-size="13" font-weight="${on ? '700' : '400'}" fill="${on ? C.rose : C.ink}">${o1[i].name}, ${o2[j].name}${on ? ' ✓' : ''}</text>`;
      }
    }
    b += `<circle cx="${rx}" cy="${ry}" r="5" fill="${C.ink}"/><text x="${rx}" y="${ry - 14}" font-size="13" text-anchor="middle">start</text>`;
    return svg(320, 220, b);
  }
  const treeSetups = [
    { o1: COIN, o2: COIN, intro: 'Two fair coins are flipped. The tree diagram shows every outcome.', first: 'first coin', second: 'second coin',
      events: [
        { d: '<b>two heads</b>', hit: (i, j) => i === 0 && j === 0, list: 'Head, Head' },
        { d: '<b>two tails</b>', hit: (i, j) => i === 1 && j === 1, list: 'Tail, Tail' },
        { d: '<b>one head and one tail</b> (in any order)', hit: (i, j) => i !== j, list: 'Head-Tail and Tail-Head' },
        { d: '<b>at least one head</b>', hit: (i, j) => i === 0 || j === 0, list: 'Head-Head, Head-Tail and Tail-Head' },
        { d: '<b>no heads at all</b>', hit: (i, j) => i === 1 && j === 1, list: 'Tail, Tail' },
      ] },
    { o1: COIN, o2: SPIN3, intro: 'A fair coin is flipped and a spinner with 3 equal sectors (pink, blue, green) is spun. The tree diagram shows every outcome.', first: 'coin', second: 'spinner',
      events: [
        { d: 'a <b>head and pink</b>', hit: (i, j) => i === 0 && j === 0, list: 'Head, Pink' },
        { d: 'a <b>tail and green</b>', hit: (i, j) => i === 1 && j === 2, list: 'Tail, Green' },
        { d: 'a <b>head and either pink or blue</b>', hit: (i, j) => i === 0 && j < 2, list: 'Head-Pink and Head-Blue' },
        { d: '<b>pink</b> (with either side of the coin)', hit: (i, j) => j === 0, list: 'Head-Pink and Tail-Pink' },
        { d: 'a <b>tail and not pink</b>', hit: (i, j) => i === 1 && j > 0, list: 'Tail-Blue and Tail-Green' },
      ] },
    { o1: COIN, o2: NUM3, intro: 'A fair coin is flipped and a spinner numbered 1, 2, 3 (equal sectors) is spun. The tree diagram shows every outcome.', first: 'coin', second: 'spinner',
      events: [
        { d: 'a <b>head and a 3</b>', hit: (i, j) => i === 0 && j === 2, list: 'Head, 3' },
        { d: 'a <b>tail and an even number</b>', hit: (i, j) => i === 1 && j === 1, list: 'Tail, 2' },
        { d: 'a <b>head and an odd number</b>', hit: (i, j) => i === 0 && j !== 1, list: 'Head-1 and Head-3' },
        { d: 'a <b>1</b> (with either side of the coin)', hit: (i, j) => j === 0, list: 'Head-1 and Tail-1' },
        { d: 'a <b>head and a number bigger than 1</b>', hit: (i, j) => i === 0 && j > 0, list: 'Head-2 and Head-3' },
      ] },
  ];
  function treeQ(level) {
    const s = R.pick(treeSetups), n1 = s.o1.length, n2 = s.o2.length, total = n1 * n2;
    const visual = treeSvg(s.o1, s.o2, null);
    const k = R.pick(level === 1 ? ['count', 'count', 'prob'] : level === 2 ? ['count', 'prob', 'prob', 'howmany'] : ['prob', 'prob', 'howmany']);
    if (k === 'count') {
      return {
        prompt: `${s.intro} How many different outcomes are there <b>altogether</b>?`, visual,
        answer: { type: 'number', value: total },
        hint: 'Count the ends of the branches on the right, or multiply: branches on the left × branches on the right.',
        working: [`The ${s.first} has ${n1} branches, and the ${s.second} has ${n2} branches from each of them.`, `${n1} × ${n2} = <b>${total}</b> outcomes.`],
        finalAnswer: String(total), skill: 'tree',
      };
    }
    const e = R.pick(s.events);
    let fav = 0; for (let i = 0; i < n1; i++) for (let j = 0; j < n2; j++) if (e.hit(i, j)) fav++;
    if (fav === 0 || fav === total) return treeQ(level);
    if (k === 'howmany') {
      return {
        prompt: `${s.intro} How many of the outcomes give ${e.d}?`, visual,
        answer: { type: 'number', value: fav },
        hint: 'Follow each branch to its end and read the outcome. Count the ones that match.',
        working: [`The outcomes that match are: ${e.list}.`, `That is <b>${fav}</b> of the ${total} outcomes.`],
        finalAnswer: String(fav), skill: 'tree',
      };
    }
    const f = N.simplify(fav, total);
    return {
      prompt: `${s.intro} What is the probability of getting ${e.d}? Give your answer as a fraction in simplest form.`, visual,
      answer: fracAns(fav, total),
      hint: `The tree has ${total} equally likely endings. Count how many of them match, then write that over ${total}.`,
      working: [`The tree has ${n1} × ${n2} = ${total} equally likely endings.`, `Endings that match: ${e.list} (${fav}).`,
        `P = ${frac(fav, total)}${f.d !== total ? ` = ${frac(f.n, f.d)}` : ''}. Answer: <b>${frac(f.n, f.d)}</b>.`],
      finalAnswer: frac(f.n, f.d), skill: 'tree',
    };
  }

  // ----- theoretical vs experimental, side by side -----
  const teScens = [
    { k: 2, outs: ['heads', 'tails'], intro: (n) => `A fair coin was flipped ${n} times.`, thing: 'the coin', why: 'a coin has <b>2</b> equally likely sides' },
    { k: 3, outs: ['pink', 'blue', 'green'], intro: (n) => `A spinner has 3 equal sectors (pink, blue, green). It was spun ${n} times.`, thing: 'the spinner', why: 'the spinner has <b>3</b> equal sectors' },
    { k: 4, outs: ['pink', 'blue', 'green', 'yellow'], intro: (n) => `A spinner has 4 equal sectors (pink, blue, green, yellow). It was spun ${n} times.`, thing: 'the spinner', why: 'the spinner has <b>4</b> equal sectors' },
    { k: 6, outs: ['1', '2', '3', '4', '5', '6'], intro: (n) => `A fair dice was rolled ${n} times.`, thing: 'the dice', why: 'a dice has <b>6</b> equally likely faces' },
  ];
  function teData(level) {
    const sc = R.pick(teScens);
    const trials = sc.k * R.pick(level === 1 ? [5, 10] : [10, 15, 20]);
    const exp = trials / sc.k;
    const f = sc.outs.map(() => exp);
    for (let t = 0; t < sc.k * 3; t++) {
      const i = R.int(0, sc.k - 1), j = R.int(0, sc.k - 1);
      const move = R.int(1, Math.max(1, Math.round(exp / 4)));
      if (i === j || f[i] - move < 1) continue;
      f[i] -= move; f[j] += move;
    }
    return { sc, trials, exp, f };
  }
  function teTable(d, showExpected) {
    let h = `<table class="data"><tr><th>Outcome</th>${d.sc.outs.map((o) => `<th>${o}</th>`).join('')}</tr>`;
    h += `<tr><th>What happened</th>${d.f.map((v) => `<td>${v}</td>`).join('')}</tr>`;
    if (showExpected) h += `<tr><th>What you expect</th>${d.f.map(() => `<td><b>${d.exp}</b></td>`).join('')}</tr>`;
    return h + '</table>';
  }
  function theoExpQ(level) {
    const d = teData(level), sc = d.sc;
    const k = R.pick(level === 1 ? ['expect', 'expect', 'compare'] : level === 2 ? ['expect', 'expprob', 'compare', 'why'] : ['expprob', 'compare', 'why', 'closer']);
    if (k === 'expect') {
      const i = R.int(0, sc.k - 1);
      return {
        prompt: `${sc.intro(d.trials)} Before looking at the results, how many <b>${sc.outs[i]}</b> would you <b>expect</b>?`, visual: teTable(d, false),
        answer: { type: 'number', value: d.exp },
        hint: `Theoretical probability first: ${sc.why}, so P = ${frac(1, sc.k)}. Then expected = P × number of tries.`,
        working: [`Theoretical: ${sc.why}, so P(${sc.outs[i]}) = ${frac(1, sc.k)}.`,
          `Expected = ${frac(1, sc.k)} × ${d.trials} = ${d.trials} ÷ ${sc.k} = ${d.exp}.`,
          `You would expect about <b>${d.exp}</b> (the table shows ${d.f[i]} actually happened).`],
        finalAnswer: String(d.exp), skill: 'theo-exp',
      };
    }
    if (k === 'expprob') {
      const i = R.int(0, sc.k - 1), f = N.simplify(d.f[i], d.trials);
      return {
        prompt: `${sc.intro(d.trials)} From these results, what is the <b>experimental</b> probability of <b>${sc.outs[i]}</b>? Give your answer as a fraction in simplest form.`, visual: teTable(d, true),
        answer: fracAns(d.f[i], d.trials),
        hint: 'Experimental probability = how many times it actually happened ÷ how many trials there were.',
        working: [`${sc.outs[i]} happened ${d.f[i]} times out of ${d.trials}.`,
          `P(experimental) = ${frac(d.f[i], d.trials)}${f.d !== d.trials ? ` = ${frac(f.n, f.d)}` : ''}.`,
          `The theoretical probability is ${frac(1, sc.k)} — close, but not exactly the same.`],
        finalAnswer: frac(f.n, f.d), skill: 'theo-exp',
      };
    }
    if (k === 'compare') {
      let i = 0; for (let t = 0; t < 40; t++) { i = R.int(0, sc.k - 1); if (d.f[i] !== d.exp) break; }
      if (d.f[i] === d.exp) return theoExpQ(level);
      const opts = ['more often than expected', 'less often than expected', 'exactly as often as expected'];
      const correct = d.f[i] > d.exp ? 0 : 1;
      return choiceQ(`${sc.intro(d.trials)} Did <b>${sc.outs[i]}</b> happen more or less often than expected?`, teTable(d, true), opts, correct,
        `Expected = ${d.trials} ÷ ${sc.k} = ${d.exp}. Compare that with what the table says actually happened.`,
        [`Expected = ${d.trials} ÷ ${sc.k} = ${d.exp}.`, `${sc.outs[i]} actually happened ${d.f[i]} times.`,
          `${d.f[i]} is ${d.f[i] > d.exp ? 'more' : 'less'} than ${d.exp}, so it happened <b>${opts[correct]}</b>.`], 'theo-exp');
    }
    if (k === 'closer') {
      const opts = ['Do many more trials', 'Do fewer trials', 'Change which outcome you count', 'Nothing — they can never get closer'];
      return choiceQ(`${sc.intro(d.trials)} The experimental probabilities are not exactly the same as the theoretical ones. What would bring them <b>closer together</b>?`, teTable(d, true), opts, 0,
        'Think about flipping a coin 10 times versus 1000 times. Which one gives a result closer to a half?',
        ['With only a few trials, luck wobbles the results around.', 'The <b>more trials</b> you do, the closer the experimental probability gets to the theoretical one.',
          'Answer: <b>do many more trials</b>.'], 'theo-exp');
    }
    const opts = ['Because with only a few tries, chance makes the results wobble around the expected numbers', `Because ${sc.thing} must be broken`, 'Because the theoretical probability was worked out wrongly'];
    return choiceQ(`${sc.intro(d.trials)} The results do not match the expected numbers exactly. What is the <b>best</b> explanation?`, teTable(d, true), opts, 0,
      'Expected numbers say what should happen on average, not exactly what will happen.',
      [`Theoretical probability = ${frac(1, sc.k)} each, so you expect ${d.exp} of each.`,
        'Real results are almost never exactly the expected numbers: that is what randomness means.',
        'Answer: <b>chance makes the results wobble around the expected numbers</b>.'], 'theo-exp');
  }

  // ----- fair or unfair games -----
  function fairGameQ() {
    const cases = [
      { s: 'A coin is flipped. <b>Ana</b> wins on heads, <b>Ben</b> wins on tails.', fair: true, why: 'each of them has 1 of the 2 equally likely sides: P = ' + frac(1, 2) + ' each.' },
      { s: 'A dice is rolled. <b>Ana</b> wins on an even number, <b>Ben</b> wins on an odd number.', fair: true, why: '3 of the 6 faces are even and 3 are odd: P = ' + frac(1, 2) + ' each.' },
      { s: 'A dice is rolled. <b>Ana</b> wins on a 6, <b>Ben</b> wins on anything else.', fair: false, w: 'Ben', why: 'Ana has 1 face out of 6 (' + frac(1, 6) + ') and Ben has 5 (' + frac(5, 6) + ').' },
      { s: 'A spinner has 4 equal sectors: 3 red and 1 blue. <b>Ana</b> wins on red, <b>Ben</b> wins on blue.', fair: false, w: 'Ana', why: 'Ana has 3 of the 4 sectors (' + frac(3, 4) + ') and Ben only ' + frac(1, 4) + '.' },
      { s: 'A spinner has 6 equal sectors: 3 red and 3 blue. <b>Ana</b> wins on red, <b>Ben</b> wins on blue.', fair: true, why: 'both have 3 of the 6 sectors: P = ' + frac(1, 2) + ' each.' },
      { s: 'A bag has 5 red and 5 blue marbles. <b>Ana</b> wins on red, <b>Ben</b> wins on blue.', fair: true, why: '5 out of 10 each: P = ' + frac(1, 2) + ' each.' },
      { s: 'A bag has 8 red and 2 blue marbles. <b>Ana</b> wins on red, <b>Ben</b> wins on blue.', fair: false, w: 'Ana', why: 'Ana has ' + frac(8, 10) + ' and Ben only ' + frac(2, 10) + '.' },
      { s: 'A dice is rolled. <b>Ana</b> wins if the number is less than 3, <b>Ben</b> wins if it is 3 or more.', fair: false, w: 'Ben', why: 'Ana has 1 and 2 (' + frac(2, 6) + ') but Ben has 3, 4, 5 and 6 (' + frac(4, 6) + ').' },
      { s: 'Two coins are flipped. <b>Ana</b> wins on two heads, <b>Ben</b> wins on anything else.', fair: false, w: 'Ben', why: 'the outcomes are HH, HT, TH, TT: Ana wins on 1 of 4, Ben on 3 of 4.' },
      { s: 'A dice is rolled. <b>Ana</b> wins on 1, 2 or 3; <b>Ben</b> wins on 4, 5 or 6.', fair: true, why: '3 faces each out of 6: P = ' + frac(1, 2) + ' each.' },
      { s: 'A spinner has 6 equal sectors numbered 1 to 6. <b>Ana</b> wins on a multiple of 3, <b>Ben</b> wins on anything else.', fair: false, w: 'Ben', why: 'multiples of 3 are 3 and 6, so Ana has ' + frac(2, 6) + ' and Ben ' + frac(4, 6) + '.' },
      { s: 'A bag has 4 red, 4 blue and 4 green counters. <b>Ana</b> wins on red, <b>Ben</b> wins on blue, <b>Cam</b> wins on green.', fair: true, why: 'each of the three has 4 out of 12: P = ' + frac(1, 3) + ' each.' },
    ];
    const c = R.pick(cases);
    const opts = ['Fair: everyone has the same chance of winning', 'Not fair: Ana has the better chance', 'Not fair: Ben has the better chance'];
    const correct = c.fair ? 0 : (c.w === 'Ana' ? 1 : 2);
    return choiceQ(`Is this game <b>fair</b>?<br>${c.s}`, null, opts, correct,
      'A game is fair when every player has the <b>same probability</b> of winning. Work out each player\'s probability and compare.',
      [`${c.s.replace(/<\/?b>/g, '')}`, `Here, ${c.why}`, `So the game is <b>${c.fair ? 'fair' : 'not fair'}</b>${c.fair ? '' : ` — ${c.w} has the better chance`}.`], 'fair');
  }

  // ----- one probability, three outfits (fraction / decimal / percentage) -----
  function formsQ(level) {
    const pairs = level === 1 ? [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10], [3, 10]]
      : [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [1, 8], [3, 8], [5, 8], [1, 25], [7, 100]];
    const [n, d] = R.pick(pairs), f = N.simplify(n, d);
    const dec = N.round(n / d, 4), pct = N.round(100 * n / d, 2);
    const ev = R.pick([
      { s: 'the spinner lands on pink', short: 'pink' }, { s: 'Harper picks a red marble', short: 'red' },
      { s: 'it rains in Wellington tomorrow', short: 'rain' }, { s: 'the netball shot goes in', short: 'a goal' },
      { s: 'the bus is late', short: 'late' }, { s: 'Harper wins the lucky dip', short: 'a win' },
    ]);
    const dir = R.pick(level === 1 ? ['toDec', 'toPct', 'toPct'] : ['toDec', 'toPct', 'fromPct', 'fromDec']);
    const triple = `${frac(f.n, f.d)} = ${N.fmt(dec)} = ${N.fmt(pct)}%`;
    if (dir === 'toDec') {
      return {
        prompt: `The probability that ${ev.s} is ${frac(f.n, f.d)}. Write this probability as a <b>decimal</b>.`,
        answer: { type: 'number', value: dec },
        hint: 'A fraction is a division: work out top ÷ bottom.',
        working: [`${frac(f.n, f.d)} means ${f.n} ÷ ${f.d}.`, `${f.n} ÷ ${f.d} = ${N.fmt(dec)}.`, `All three outfits of the same probability: <b>${triple}</b>.`],
        finalAnswer: N.fmt(dec), skill: 'forms',
      };
    }
    if (dir === 'toPct') {
      return {
        prompt: `The probability that ${ev.s} is ${frac(f.n, f.d)}. Write this probability as a <b>percentage</b>.`,
        answer: { type: 'number', value: pct, unit: '%' },
        hint: 'Per cent means "out of 100". Work out top ÷ bottom, then × 100.',
        working: [`${f.n} ÷ ${f.d} = ${N.fmt(dec)}.`, `${N.fmt(dec)} × 100 = ${N.fmt(pct)}%.`, `All three outfits of the same probability: <b>${triple}</b>.`],
        finalAnswer: `${N.fmt(pct)}%`, skill: 'forms',
      };
    }
    if (dir === 'fromDec') {
      return {
        prompt: `The probability that ${ev.s} is ${N.fmt(dec)}. Write this probability as a <b>percentage</b>.`,
        answer: { type: 'number', value: pct, unit: '%' },
        hint: 'To turn a decimal into a percentage, multiply by 100 (move the digits two places left).',
        working: [`${N.fmt(dec)} × 100 = ${N.fmt(pct)}.`, `So the probability is ${N.fmt(pct)}%.`, `All three outfits of the same probability: <b>${triple}</b>.`],
        finalAnswer: `${N.fmt(pct)}%`, skill: 'forms',
      };
    }
    return {
      prompt: `The probability that ${ev.s} is ${N.fmt(pct)}%. Write this probability as a <b>fraction in simplest form</b>.`,
      answer: fracAns(Math.round(pct * 100), 10000),
      hint: 'Per cent means "out of 100". Write it over 100, then simplify.',
      working: [`${N.fmt(pct)}% means ${N.fmt(pct)} out of 100.`,
        `Write it as a fraction: ${Number.isInteger(pct) ? frac(pct, 100) : frac(Math.round(pct * 10), 1000)}.`,
        `Simplify: <b>${frac(f.n, f.d)}</b>.`, `All three outfits of the same probability: <b>${triple}</b>.`],
      finalAnswer: frac(f.n, f.d), skill: 'forms',
    };
  }

  // ----- "not A" in words -----
  function notWordsQ() {
    const cases = [
      { q: 'Which of these is <b>always</b> the same as P(not A)?', opts: ['1 − P(A)', 'P(A) − 1', '1 ÷ P(A)', 'P(A) + 1'], correct: 0, why: 'A either happens or it does not, and those two chances add up to <b>1</b>.' },
      { q: 'P(A) + P(not A) always equals…', opts: ['1', '0', '2', 'it depends on A'], correct: 0, why: 'between them they cover <b>everything</b> that can happen, which is a probability of 1.' },
      { q: 'The probability that it rains tomorrow is 0.3. Which sentence is <b>correct</b>?', opts: ['The probability it does not rain is 0.7', 'The probability it does not rain is 0.3', 'The probability it does not rain is 1.3'], correct: 0, why: '1 − 0.3 = 0.7.' },
      { q: 'P(Harper wins the raffle) = 5%. Which sentence is <b>correct</b>?', opts: ['The probability she does not win is 95%', 'The probability she does not win is 5%', 'The probability she does not win is 105%'], correct: 0, why: '100% − 5% = 95%.' },
      { q: 'A spinner lands on pink ' + frac(1, 4) + ' of the time. In words, what is P(<b>not</b> pink)?', opts: ['one whole take away a quarter, which is three quarters', 'a quarter', 'one and a quarter'], correct: 0, why: '1 − ' + frac(1, 4) + ' = ' + frac(3, 4) + '.' },
      { q: 'P(the bus is late) = ' + frac(2, 5) + '. Which sentence is <b>correct</b>?', opts: ['P(the bus is on time) = ' + frac(3, 5), 'P(the bus is on time) = ' + frac(2, 5), 'P(the bus is on time) = ' + frac(5, 2)], correct: 0, why: '1 − ' + frac(2, 5) + ' = ' + frac(3, 5) + '.' },
    ];
    const c = R.pick(cases);
    return choiceQ(c.q, null, c.opts, c.correct,
      'Something either happens or it does not. The two chances always add up to 1 (or 100%).',
      [`<b>P(not A) = 1 − P(A)</b> in words: "one whole, take away the chance it does happen".`, `Here, ${c.why}`, `Answer: <b>${c.opts[c.correct]}</b>.`], 'complement');
  }

  function calc(level) {
    if (level === 1) return R.pick([() => spinnerQ(1), () => spinnerQ(1), () => bagQ(1), () => diceQ(1), () => likelihoodQ(1), () => complementQ(1), () => experimentalQ(1), () => treeQ(1), () => formsQ(1), notWordsQ, fairGameQ, () => theoExpQ(1)])();
    if (level === 2) return R.pick([() => spinnerQ(2), () => bagQ(2), () => diceQ(2), cardQ, () => complementQ(2), twoCoinsQ, coinDiceQ, () => expectedQ(2), () => experimentalQ(2), () => likelihoodQ(2), () => treeQ(2), () => treeQ(2), () => theoExpQ(2), () => theoExpQ(2), fairGameQ, () => formsQ(2), notWordsQ])();
    return R.pick([twoDiceQ, twoDiceQ, coinDiceQ, cardQ, () => bagQ(3), () => spinnerQ(3), () => expectedQ(3), () => experimentalQ(3), () => complementQ(3), () => treeQ(3), () => treeQ(3), () => theoExpQ(3), () => theoExpQ(3), fairGameQ, () => formsQ(3)])();
  }

  // ----- word problems -----
  function word(level) {
    const t = R.pick(level === 1 ? ['raffle', 'weather', 'sport', 'lollies', 'names', 'tree', 'fair', 'forms'] : level === 2 ? ['raffle', 'weather', 'sport', 'lollies', 'names', 'shots', 'bus', 'tree', 'tree', 'fair', 'forms', 'theoexp', 'theoexp'] : ['raffle3', 'shots', 'bus', 'weather3', 'names', 'draw3', 'tree', 'tree', 'theoexp', 'theoexp', 'fair', 'forms']);
    if (t === 'tree') return treeQ(level);
    if (t === 'fair') return fairGameQ();
    if (t === 'forms') return formsQ(level);
    if (t === 'theoexp') return theoExpQ(level);
    if (t === 'raffle' || t === 'raffle3') {
      const total = R.pick(level === 1 ? [20, 50, 100] : [100, 200, 250, 500]), mine = R.pick(level === 1 ? [1, 2, 5, 10] : [4, 5, 10, 20, 25]);
      if (t === 'raffle3') {
        const form = R.pick(['percent', 'decimal']), pa = probAnswer(mine, total, form);
        return { prompt: `A school raffle sells ${total} tickets. Harper's family buys ${mine} of them. One ticket is drawn to win the prize. What is the probability that Harper's family wins? Give your answer ${pa.ask}.`, answer: pa.answer, hint: `P = ${mine} ÷ ${total}, then change to ${form === 'percent' ? 'a percentage (× 100)' : 'a decimal'}.`, working: [`P = ${frac(mine, total)} = ${simp(mine, total)}.`, `${form === 'percent' ? `${mine} ÷ ${total} × 100` : `${mine} ÷ ${total}`} = ${pa.shown}.`, `Answer: <b>${pa.shown}</b>.`], finalAnswer: pa.shown, skill: 'word' };
      }
      const f = N.simplify(mine, total);
      return { prompt: `A netball club raffle sells ${total} tickets. Harper buys ${mine} ticket${mine > 1 ? 's' : ''}. One winning ticket is drawn. What is the probability Harper wins? Give your answer as a fraction in simplest form.`, answer: fracAns(mine, total), hint: 'Probability = Harper\'s tickets ÷ all the tickets.', working: [`P = ${frac(mine, total)}${f.d !== total ? ` = ${frac(f.n, f.d)}` : ''}.`, `Answer: <b>${frac(f.n, f.d)}</b>.`], finalAnswer: frac(f.n, f.d), skill: 'word' };
    }
    if (t === 'weather' || t === 'weather3') {
      const p = R.step(10, 90, 10), place = R.pick(['Wellington', 'Auckland', 'Dunedin', 'Rotorua', 'Christchurch']);
      if (t === 'weather3') {
        const days = R.pick([10, 20, 30]), exp = days * p / 100;
        return { prompt: `The forecast says there is a ${p}% chance of rain on each day in ${place}. Over the next ${days} days, about how many days would you expect it to rain?`, answer: { type: 'number', value: exp, unit: 'days' }, hint: `${p}% of ${days} days.`, working: [`${p}% = ${p / 100}.`, `${p / 100} × ${days} = ${exp}.`, `About <b>${exp} days</b>.`], finalAnswer: `${exp} days`, skill: 'word' };
      }
      return { prompt: `The forecast for ${place} says there is a ${p}% chance of rain tomorrow. What is the probability that it does <b>not</b> rain? Give your answer as a percentage.`, answer: { type: 'number', value: 100 - p, unit: '%' }, hint: 'Rain and no rain add up to 100%.', working: [`100% − ${p}% = ${100 - p}%.`, `P(no rain) = <b>${100 - p}%</b>.`], finalAnswer: `${100 - p}%`, skill: 'word' };
    }
    if (t === 'sport') {
      const teams = R.pick([['Crusaders', 'Blues'], ['Silver Ferns', 'Diamonds'], ['Phoenix', 'Auckland FC']]);
      const p = R.pick([0.3, 0.4, 0.45, 0.55, 0.6, 0.65, 0.7, 0.75]);
      const q = N.round(1 - p, 2);
      return { prompt: `A sports app says the probability that the ${teams[0]} beat the ${teams[1]} is ${p}. There are no draws. What is the probability the ${teams[1]} win? Give your answer as a decimal.`, answer: { type: 'number', value: q }, hint: 'The two probabilities add to 1.', working: [`1 − ${p} = ${q}.`, `P(${teams[1]} win) = <b>${q}</b>.`], finalAnswer: String(q), skill: 'word' };
    }
    if (t === 'shots') {
      const pct = R.pick([60, 70, 75, 80, 90]), shots = R.pick([10, 20, 40, 50]);
      const goals = shots * pct / 100;
      if (R.chance(0.5)) return { prompt: `A netball shooter scores ${pct}% of her shots. In a game she takes ${shots} shots. About how many goals would you expect her to score?`, answer: { type: 'number', value: goals, unit: 'goals' }, hint: `${pct}% of ${shots}.`, working: [`${pct}% = ${pct / 100}.`, `${pct / 100} × ${shots} = ${goals}.`, `About <b>${goals} goals</b>.`], finalAnswer: `${goals} goals`, skill: 'word' };
      return { prompt: `A netball shooter scores ${pct}% of her shots. What is the probability that her next shot <b>misses</b>? Give your answer as a percentage.`, answer: { type: 'number', value: 100 - pct, unit: '%' }, hint: 'Score and miss add to 100%.', working: [`100% − ${pct}% = ${100 - pct}%.`, `P(miss) = <b>${100 - pct}%</b>.`], finalAnswer: `${100 - pct}%`, skill: 'word' };
    }
    if (t === 'bus') {
      const days = R.pick([20, 25, 40, 50]), late = R.int(1, Math.floor(days / 4)), f = N.simplify(late, days);
      const form = level === 3 ? R.pick(['fraction', 'decimal', 'percent']) : 'fraction', pa = probAnswer(late, days, form);
      return { prompt: `Over the last ${days} school days, Harper's bus was late ${late} time${late > 1 ? 's' : ''}. Based on this, what is the experimental probability the bus is late tomorrow? Give your answer ${pa.ask}.`, answer: pa.answer, hint: 'Experimental probability = times it happened ÷ total days.', working: [`P = ${frac(late, days)}${f.d !== days ? ` = ${frac(f.n, f.d)}` : ''}.`, `Answer: <b>${pa.shown}</b>.`], finalAnswer: pa.shown, skill: 'word' };
    }
    if (t === 'lollies') return bagQ(level, R.pick([{ thing: 'lollies', place: 'a party bag' }, { thing: 'jellybeans', place: 'a jar' }]));
    if (t === 'draw3') {
      const g = R.int(8, 16), b = R.int(8, 16), total = g + b;
      const form = R.pick(['fraction', 'percent']), pick = R.pick(['girl', 'boy']), fav = pick === 'girl' ? g : b;
      if (form === 'percent' && (100 * fav) % total !== 0) return word(level);
      const pa = probAnswer(fav, total, form);
      return { prompt: `A class has ${g} girls and ${b} boys. The teacher picks one student's name out of a hat to be class leader. What is the probability a ${pick} is picked? Give your answer ${pa.ask}.`, answer: pa.answer, hint: `Total students = ${g} + ${b}. P = ${pick}s ÷ total.`, working: [`Total = ${g} + ${b} = ${total}.`, `P = ${frac(fav, total)} = ${simp(fav, total)}.`, `Answer: <b>${pa.shown}</b>.`], finalAnswer: pa.shown, skill: 'word' };
    }
    // names in a hat
    const names = R.sample(['Aroha', 'Ben', 'Chloe', 'Dev', 'Ella', 'Finn', 'Grace', 'Hemi', 'Isla', 'Jack', 'Kiri', 'Liam'], R.pick([4, 5, 6, 8, 10]));
    const nCount = names.length, who = R.pick(['Harper', names[0]]);
    const includeHarper = who === 'Harper';
    const total = nCount + (includeHarper ? 1 : 0);
    const f = N.simplify(1, total);
    return { prompt: `${total} students${includeHarper ? ' (including Harper)' : ''} put their names in a hat to choose who goes first. One name is picked. What is the probability that it is ${who}? Give your answer as a fraction in simplest form.`, answer: fracAns(1, total), hint: 'One name out of all the names.', working: [`${who} has 1 name in the hat out of ${total}.`, `P = <b>${frac(f.n, f.d)}</b>.`], finalAnswer: frac(f.n, f.d), skill: 'word' };
  }

  HL.registerTopic({
    id: 'probability', subject: 'maths', strand: 'probability', order: 1,
    name: 'Probability', short: 'Probability',
    blurb: 'How likely is it? Write chances as fractions, decimals and percentages.',
    example: 'Bag: 3 red, 5 blue → P(red) = 3/8',
    animal: 'chick',
    learn: {
      what: '<p>Picture a <b>bag of marbles</b> and pulling one out without looking. <b>Probability</b> is how likely something is, on a scale from <b>0</b> (impossible: no marble of that colour) to <b>1</b> (certain: every marble is that colour). Write it as a fraction, decimal or percentage: ' + N.fracHtml(1, 4) + ' = 0.25 = 25%. For equally likely outcomes: <b>P = the ones you want ÷ all of them</b>.</p>',
      visual: (() => {
        let b = `<line x1="40" y1="42" x2="320" y2="42" stroke="${C.ink}" stroke-width="3"/>`;
        const marks = [[0, '0', 'impossible'], [0.25, '¼', 'unlikely'], [0.5, '½', 'even'], [0.75, '¾', 'likely'], [1, '1', 'certain']];
        marks.forEach(([p, v, w]) => { const x = 40 + p * 280; b += `<line x1="${x}" y1="34" x2="${x}" y2="50" stroke="${C.ink}" stroke-width="3"/><text x="${x}" y="24" font-size="15" text-anchor="middle" fill="#2A6FA5">${v}</text><text x="${x}" y="66" font-size="13" text-anchor="middle" fill="${C.rose}">${w}</text>`; });
        // spinner: 8 sectors, 3 pink
        const cx = 84, cy = 150, r = 58, cols = [C.pink, C.sky, C.mint, C.pink, C.butter, C.pink, C.lav, C.peach];
        for (let i = 0; i < 8; i++) {
          const a1 = (-90 + 45 * i) * D, a2 = (-90 + 45 * (i + 1)) * D;
          b += `<path d="M${cx} ${cy} L${r1(cx + r * Math.cos(a1))} ${r1(cy + r * Math.sin(a1))} A${r} ${r} 0 0 1 ${r1(cx + r * Math.cos(a2))} ${r1(cy + r * Math.sin(a2))} Z" fill="${cols[i]}" stroke="${C.ink}" stroke-width="2"/>`;
        }
        b += `<polygon points="${cx},${cy - 14} ${cx + 7},${cy + 4} ${cx - 7},${cy + 4}" fill="${C.ink}" transform="rotate(30 ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="4" fill="${C.ink}"/>`;
        b += `<text x="150" y="150" font-size="17">P(pink) =</text>`;
        b += `<text x="240" y="138" font-size="19" text-anchor="middle" fill="${C.rose}">3</text><line x1="226" y1="146" x2="254" y2="146" stroke="${C.ink}" stroke-width="2.5"/><text x="240" y="166" font-size="19" text-anchor="middle" fill="#2A6FA5">8</text>`;
        b += `<text x="262" y="138" font-size="13" fill="${C.rose}">← 3 pink</text><text x="262" y="166" font-size="13" fill="#2A6FA5">← 8 sectors</text>`;
        b += `<text x="150" y="200" font-size="13">spinner = a bag of 8 marbles</text>`;
        return `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`;
      })(),
      facts: [
        '<b>P(event) = <span class="frac"><span class="frac-n">want</span><span class="frac-d">total</span></span></b> = the ones you want ÷ all the equally likely outcomes',
        '0 = <b>impossible</b>, ½ = <b>even chance</b>, 1 = <b>certain</b>. A probability is never bigger than 1',
        '<b>Not</b> happening: P(not A) = <b>1 − P(A)</b>. Together they always make 1 (100%)',
        'Fractions, decimals and percentages are the same thing: ' + N.fracHtml(1, 4) + ' = 0.25 = 25%',
        '<b>Two things</b> (two coins, two dice): list or table the whole sample space first. Two dice = <b>36</b> outcomes',
        '<b>Expected number</b> = probability × number of tries. <b>Experimental</b> probability = times it happened ÷ total trials',
        '<b>Tree diagram</b>: one branch for each choice. Number of outcomes = <b>left branches × right branches</b>',
        '<b>Theoretical</b> = what <b>should</b> happen (from the maths). <b>Experimental</b> = what <b>did</b> happen (from the results). More trials → closer together',
        'A game is <b>fair</b> when every player has the <b>same</b> probability of winning',
        'Say "not" out loud: <b>P(not A) = 1 − P(A)</b> — "one whole, take away the chance it happens"',
      ],
      steps: [
        '<b>Ask: how many marbles are in the bag altogether?</b> Count every equally likely outcome (sectors, faces, cards, names). That is the <b>bottom</b>.',
        '<b>How many of them do I want?</b> That is the <b>top</b>.',
        'Write <b>want over total</b> and <b>simplify</b>. Change to a decimal or % only if asked.',
        '"<b>Not</b>": take it away from 1.',
        '<b>Two things</b> happening: draw the <b>tree</b> (or the table) first, count every ending, then count the ones you want.',
        '<b>Is the game fair?</b> Work out each player\'s probability. Same → fair. Different → the bigger one has the better chance.',
        '<b>Theoretical or experimental?</b> "Should happen" = count the equally likely outcomes. "Did happen" = use the results table.',
      ],
      examples: [
        (() => {
          let b = `<path d="M30 30 Q20 100 40 116 L170 116 Q190 100 180 30 Z" fill="${C.butter}" fill-opacity=".4" stroke="${C.ink}" stroke-width="2"/>`;
          const pos = [[60, 52], [96, 48], [132, 52], [150, 80], [50, 82], [80, 76], [112, 78], [64, 104], [100, 102], [136, 104]];
          pos.forEach((p, i) => { b += `<circle cx="${p[0]}" cy="${p[1]}" r="12" fill="${i < 4 ? C.rose : C.sky}" stroke="${C.ink}" stroke-width="1.5"/>`; });
          b += `<text x="224" y="48" font-size="19" text-anchor="middle" fill="${C.rose}">4</text><line x1="208" y1="56" x2="240" y2="56" stroke="${C.ink}" stroke-width="2.5"/><text x="224" y="78" font-size="19" text-anchor="middle" fill="#2A6FA5">10</text>`;
          b += `<text x="248" y="48" font-size="13" fill="${C.rose}">← 4 red</text><text x="248" y="78" font-size="13" fill="#2A6FA5">← 10 in all</text><text x="224" y="108" font-size="13" text-anchor="middle">= 2/5</text>`;
          return { q: 'A bag has 4 red and 6 blue marbles. One is picked without looking. Find <b>P(red)</b>.', visual: `<svg viewBox="0 0 340 126" width="340" height="126" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the <b>bag of marbles</b>: 4 red, 6 blue, all mixed up.', '1. How many marbles altogether? 4 + 6 = <b>10</b> → bottom.', '2. How many do I want? <b>4</b> red → top.', '3. P(red) = ' + N.fracHtml(4, 10) + '. Simplify (÷ 2): <b>' + N.fracHtml(2, 5) + '</b>.'], a: 'P(red) = ' + N.fracHtml(2, 5) + ' (= 0.4 = 40%)' };
        })(),
        (() => {
          let b = '';
          for (let i = 1; i <= 6; i++) { const x = 20 + (i - 1) * 46, win = i > 4; b += `<rect x="${x}" y="20" width="38" height="38" rx="7" fill="${win ? C.rose : '#fff'}" stroke="${C.ink}" stroke-width="2"/><text x="${x + 19}" y="46" font-size="18" text-anchor="middle" fill="${win ? '#fff' : C.ink}">${i}</text>`; }
          b += `<text x="158" y="82" font-size="13" text-anchor="middle" fill="${C.rose}">2 faces are more than 4, out of 6 faces</text>`;
          return { q: 'A normal dice is rolled. Find P(<b>more than 4</b>).', visual: `<svg viewBox="0 0 316 92" width="316" height="92" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the dice as a <b>bag of 6 marbles</b> numbered 1 to 6.', '1. How many altogether? <b>6</b> → bottom.', '2. How many do I want? More than 4 means 5 or 6 → <b>2</b> → top.', '3. P = ' + N.fracHtml(2, 6) + '. Simplify (÷ 2): <b>' + N.fracHtml(1, 3) + '</b>.'], a: 'P(more than 4) = ' + N.fracHtml(1, 3) };
        })(),
        (() => {
          let b = `<rect x="20" y="30" width="280" height="34" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="2"/><rect x="20" y="30" width="84" height="34" rx="6" fill="${C.sky}" stroke="${C.ink}" stroke-width="2"/>`;
          b += `<text x="62" y="52" font-size="14" text-anchor="middle" fill="#2A6FA5">rain 0.3</text><text x="202" y="52" font-size="14" text-anchor="middle" fill="${C.rose}">no rain = ?</text>`;
          b += `<text x="20" y="18" font-size="13">0</text><text x="300" y="18" font-size="13" text-anchor="end">1 (whole bar)</text><text x="160" y="86" font-size="13" text-anchor="middle">1 − 0.3 = 0.7</text>`;
          return { q: 'The forecast says P(rain tomorrow) = 0.3. Find P(<b>no rain</b>).', visual: `<svg viewBox="0 0 320 96" width="320" height="96" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture a bag of <b>10 marbles</b>: 3 say "rain", the rest say "no rain".', '1. Is this a "<b>not</b>" question? Yes → take away from 1.', '2. Rain + no rain must make the whole bag: 1.', '3. 1 − 0.3 = <b>0.7</b>.'], a: 'P(no rain) = 0.7 (= 70%)' };
        })(),
        { q: 'Two coins are flipped. Find P(<b>one head and one tail</b>).',
          visual: `<table class="data"><tr><th></th><th>2nd coin H</th><th>2nd coin T</th></tr><tr><th>1st coin H</th><td>HH</td><td style="background:#F9A8C9">HT</td></tr><tr><th>1st coin T</th><td style="background:#F9A8C9">TH</td><td>TT</td></tr></table>`,
          working: ['Picture a bag holding <b>every possible result</b>, one marble each: HH, HT, TH, TT.', '1. Two things happen, so list the sample space first: HH, HT, TH, TT.', '2. How many altogether? <b>4</b> → bottom.', '3. How many have one head and one tail? HT and TH → <b>2</b> → top.', '4. P = ' + N.fracHtml(2, 4) + ' = <b>' + N.fracHtml(1, 2) + '</b>.'], a: 'P = ' + N.fracHtml(1, 2) },
        (() => {
          const s = 26, x0 = 34, y0 = 34;
          let b = `<text x="${x0 + s * 3.5}" y="12" font-size="13" text-anchor="middle">second dice</text><text transform="translate(10 ${y0 + s * 3.5}) rotate(-90)" font-size="13" text-anchor="middle">first dice</text>`;
          for (let i = 1; i <= 6; i++) { b += `<text x="${x0 + i * s + s / 2}" y="${y0 - 6}" font-size="13" text-anchor="middle" fill="#2A6FA5">${i}</text><text x="${x0 + s / 2}" y="${y0 + i * s - 8}" font-size="13" text-anchor="middle" fill="#2A6FA5">${i}</text>`; }
          for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) { const x = x0 + j * s, y = y0 + (i - 1) * s, hit = i + j === 7; b += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${hit ? C.rose : '#fff'}" stroke="${C.lav}" stroke-width="1"/><text x="${x + s / 2}" y="${y + 18}" font-size="13" text-anchor="middle" fill="${hit ? '#fff' : C.ink}">${i + j}</text>`; }
          b += `<text x="${x0 + s * 7 + 12}" y="${y0 + 60}" font-size="13" fill="${C.rose}">6 sevens</text><text x="${x0 + s * 7 + 12}" y="${y0 + 78}" font-size="13">out of 36</text><text x="${x0 + s * 7 + 12}" y="${y0 + 96}" font-size="13">squares</text>`;
          return { q: 'Two dice are rolled and the numbers added. Find P(<b>total = 7</b>).', visual: `<svg viewBox="0 0 320 222" width="320" height="222" xmlns="http://www.w3.org/2000/svg" font-weight="700" fill="${C.ink}">${b}</svg>`,
            working: ['Picture a bag with <b>36 marbles</b>, one for every square in the table.', '1. Two things happen → draw the table first. 6 × 6 = <b>36</b> squares → bottom.', '2. How many squares say 7? 1+6, 2+5, 3+4, 4+3, 5+2, 6+1 → <b>6</b> → top.', '3. P = ' + N.fracHtml(6, 36) + '. Simplify (÷ 6): <b>' + N.fracHtml(1, 6) + '</b>.'], a: 'P(7) = ' + N.fracHtml(1, 6) };
        })(),
        { q: 'At the school gala, the lucky dip has P(win) = ' + N.fracHtml(1, 5) + '. If 80 people have a turn, about how many prizes will be won?', working: ['Picture a bag of 5 marbles where 1 is a winner. Every 5 turns, about <b>1 win</b>.', '1. Is this an <b>expected number</b> question? Yes → probability × number of tries.', '2. ' + N.fracHtml(1, 5) + ' × 80 = 80 ÷ 5 = <b>16</b>.', '3. "About" 16, because chance does not come out exactly every time.'], a: 'about 16 prizes' },
        { q: 'Two coins are flipped. Use a <b>tree diagram</b> to find P(<b>one head and one tail</b>).',
          visual: treeSvg(COIN, COIN, (i, j) => i !== j),
          working: ['Picture a bag holding <b>one marble for every possible ending</b> of the tree.',
            '1. Two things happen, so I draw a tree: 2 branches for the first coin, then 2 more from each.',
            '2. How many endings altogether? 2 × 2 = <b>4</b> → bottom.',
            '3. Which endings have one head and one tail? Head-Tail and Tail-Head → <b>2</b> → top.',
            '4. P = ' + N.fracHtml(2, 4) + ' = <b>' + N.fracHtml(1, 2) + '</b>.'],
          a: 'P = ' + N.fracHtml(1, 2) },
        { q: 'A spinner has 4 equal sectors. It was spun <b>40</b> times. Compare what you <b>expected</b> with what <b>happened</b>.',
          visual: '<table class="data"><tr><th>Colour</th><th>pink</th><th>blue</th><th>green</th><th>yellow</th></tr><tr><th>What happened</th><td>13</td><td>8</td><td>11</td><td>8</td></tr><tr><th>What you expect</th><td><b>10</b></td><td><b>10</b></td><td><b>10</b></td><td><b>10</b></td></tr></table>',
          working: ['Picture a bag of 4 marbles, one of each colour, picked 40 times and put back each time.',
            '1. <b>Theoretical</b> (should happen): 4 equal sectors → P(pink) = ' + N.fracHtml(1, 4) + '.',
            '2. Expected number = ' + N.fracHtml(1, 4) + ' × 40 = 40 ÷ 4 = <b>10</b> of each.',
            '3. <b>Experimental</b> (did happen): pink came up 13 times → P = ' + N.fracHtml(13, 40) + '.',
            '4. 13 is a bit more than 10. That is normal — chance wobbles. More spins would bring them closer.'],
          a: 'expected 10 pink; experimental P(pink) = ' + N.fracHtml(13, 40) + ' (13 out of 40)' },
        (() => {
          const cx = 84, cy = 100, r = 66, labs = ['Ana', 'Ana', 'Ana', 'Ben'], fills = [C.pink, C.pink, C.pink, C.sky];
          let b = '';
          for (let i = 0; i < 4; i++) {
            const a1 = (-90 + 90 * i) * D, a2 = (-90 + 90 * (i + 1)) * D, am = (-90 + 90 * i + 45) * D;
            b += `<path d="M${cx} ${cy} L${r1(cx + r * Math.cos(a1))} ${r1(cy + r * Math.sin(a1))} A${r} ${r} 0 0 1 ${r1(cx + r * Math.cos(a2))} ${r1(cy + r * Math.sin(a2))} Z" fill="${fills[i]}" stroke="${C.ink}" stroke-width="2"/>`;
            b += `<text x="${r1(cx + r * 0.6 * Math.cos(am))}" y="${r1(cy + r * 0.6 * Math.sin(am) + 5)}" font-size="13" font-weight="700" text-anchor="middle">${labs[i]}</text>`;
          }
          b += `<text x="170" y="52" font-size="13" font-weight="700" fill="${C.rose}">Ana wins 3 of 4</text>`;
          b += `<text x="170" y="70" font-size="13" font-weight="700" fill="${C.rose}">P(Ana) = 3/4</text>`;
          b += `<text x="170" y="98" font-size="13" font-weight="700" fill="#2A6FA5">Ben wins 1 of 4</text>`;
          b += `<text x="170" y="116" font-size="13" font-weight="700" fill="#2A6FA5">P(Ben) = 1/4</text>`;
          b += `<text x="170" y="146" font-size="13" font-weight="700">not the same →</text><text x="170" y="164" font-size="14" font-weight="700" fill="${C.rose}">NOT FAIR</text>`;
          return { q: 'A spinner has 4 equal sectors. <b>Ana</b> wins on pink, <b>Ben</b> wins on blue. Is the game <b>fair</b>?',
            visual: `<svg viewBox="0 0 330 180" width="330" height="180" xmlns="http://www.w3.org/2000/svg" font-size="14" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the spinner as a <b>bag of 4 marbles</b>: 3 say Ana, 1 says Ben.',
              '1. What does <b>fair</b> mean? Everyone has the <b>same</b> chance of winning.',
              '2. P(Ana wins) = ' + N.fracHtml(3, 4) + '. P(Ben wins) = ' + N.fracHtml(1, 4) + '.',
              '3. Are they the same? No! So the game is <b>not fair</b>, and Ana has the better chance.'],
            a: 'not fair: Ana has ' + N.fracHtml(3, 4) + ' and Ben only ' + N.fracHtml(1, 4) };
        })(),
        (() => {
          let b = `<rect x="20" y="26" width="280" height="40" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="2"/>`;
          b += `<rect x="20" y="26" width="70" height="40" rx="6" fill="${C.rose}" stroke="${C.ink}" stroke-width="2"/>`;
          for (let i = 1; i < 4; i++) b += `<line x1="${20 + i * 70}" y1="26" x2="${20 + i * 70}" y2="66" stroke="${C.ink}" stroke-width="2"/>`;
          b += `<text x="55" y="52" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">pink</text>`;
          b += `<text x="55" y="18" font-size="13" font-weight="700" text-anchor="middle" fill="${C.rose}">1 of 4</text>`;
          b += `<text x="195" y="18" font-size="13" font-weight="700" text-anchor="middle" fill="#2A6FA5">the other 3 of 4 are not pink</text>`;
          b += `<text x="20" y="90" font-size="14" fill="${C.rose}">P(pink) = 1/4 = 0.25 = 25%</text>`;
          b += `<text x="20" y="112" font-size="14" fill="#2A6FA5">P(not pink) = 3/4 = 0.75 = 75%</text>`;
          b += `<text x="20" y="132" font-size="13">25% + 75% = 100%  (one whole)</text>`;
          return { q: 'A spinner lands on pink ' + N.fracHtml(1, 4) + ' of the time. Write P(pink) as a <b>decimal</b> and a <b>percentage</b>, then find P(<b>not</b> pink).',
            visual: `<svg viewBox="0 0 320 142" width="320" height="142" xmlns="http://www.w3.org/2000/svg" font-size="14" fill="${C.ink}">${b}</svg>`,
            working: ['Picture the bag of 4 marbles: <b>1 pink, 3 not pink</b>. The bar is the whole bag.',
              '1. Fraction → decimal: ' + N.fracHtml(1, 4) + ' means 1 ÷ 4 = <b>0.25</b>.',
              '2. Decimal → percentage: 0.25 × 100 = <b>25%</b>. Same probability, three outfits.',
              '3. "Not" question → take away from 1: 1 − ' + N.fracHtml(1, 4) + ' = <b>' + N.fracHtml(3, 4) + '</b>.',
              '4. In words: one whole, take away the chance it is pink. ' + N.fracHtml(3, 4) + ' = 0.75 = <b>75%</b>.'],
            a: 'P(pink) = 0.25 = 25%; P(not pink) = ' + N.fracHtml(3, 4) + ' = 0.75 = 75%' };
        })(),
      ],
      tips: [
        'A probability can never be bigger than 1 or less than 0. If you get ' + N.fracHtml(7, 6) + ', the top and bottom are the wrong way round.',
        'Always <b>simplify</b> fractions: ' + N.fracHtml(6, 36) + ' → ' + N.fracHtml(1, 6) + '.',
        '"Even chance" means exactly ' + N.fracHtml(1, 2) + '. "Likely" is more than a half, "unlikely" is less.',
        'The bottom number is <b>all the marbles</b>, not just the ones you do not want.',
        'On a <b>tree diagram</b> count the endings on the right — that number is the bottom of your fraction.',
        'Experimental probability almost never matches the theoretical one exactly. That is normal: do <b>more trials</b> and they get closer.',
        '<b>Fair</b> does not mean "nice" — it means every player has exactly the <b>same probability</b>.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
