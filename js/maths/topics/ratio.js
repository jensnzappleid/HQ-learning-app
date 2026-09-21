/* Topic: Ratio (simplifying, equivalent ratios, sharing in a ratio, scale drawings) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});
  /** text answer for a ratio: '3:4' also accepts '3 : 4' and '3 to 4' */
  function ratioAns(parts) {
    const v = parts.join(':');
    return { type: 'text', value: v, accept: [parts.join(' : '), parts.join(' to '), parts.join(' :'), parts.join(': ')], placeholder: parts.length === 3 ? 'e.g. 1:2:3' : 'e.g. 2:3' };
  }
  const show = (parts) => parts.join(' : ');
  const gcdAll = (arr) => arr.reduce((g, x) => N.gcd(g, x), 0);
  /** a simplest-form ratio with `count` parts (no common factor), each part ≤ max */
  function baseRatio(count, max) {
    for (let i = 0; i < 50; i++) {
      const parts = Array.from({ length: count }, () => R.int(1, max));
      if (gcdAll(parts) === 1 && !(count === 2 && parts[0] === parts[1])) return parts;
    }
    return count === 3 ? [1, 2, 3] : [2, 3];
  }
  const names = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby', 'Sione', 'Kahu'];
  const pairNames = () => R.sample(names, 3);

  // ---------- calc ----------
  function simplify(level) {
    const count = level === 3 && R.chance(0.6) ? 3 : 2;
    const base = baseRatio(count, level === 1 ? 5 : level === 2 ? 9 : 8);
    const k = level === 1 ? R.int(2, 5) : level === 2 ? R.int(2, 12) : R.int(3, 15);
    const big = base.map((x) => x * k);
    return {
      prompt: `Write the ratio ${show(big)} in its simplest form.`,
      answer: ratioAns(base),
      hint: `Find the biggest number that divides into ${big.length === 3 ? 'all three' : 'both'} numbers (it is ${k}), and divide each part by it.`,
      working: [
        `The highest common factor of ${big.join(' and ')} is ${k}.`,
        `Divide every part by ${k}: ${big.map((x) => `${x} ÷ ${k} = ${x / k}`).join(', ')}.`,
        `Simplest form: <b>${show(base)}</b>.`,
      ],
      finalAnswer: show(base), skill: 'simplify',
    };
  }
  function equivalent(level) {
    const base = baseRatio(2, level === 1 ? 6 : 9);
    const k = level === 1 ? R.int(2, 5) : level === 2 ? R.int(2, 10) : R.int(3, 15);
    const big = base.map((x) => x * k);
    const missing = R.int(0, 1); // which part of the scaled ratio is hidden
    const known = 1 - missing;
    const shown = [big[0], big[1]]; shown[missing] = '?';
    return {
      prompt: `Find the missing number: ${show(base)} = ${show(shown)}`,
      answer: numAns(big[missing]),
      hint: `${base[known]} has been multiplied by ${k} to get ${big[known]}. Do the same to ${base[missing]}.`,
      working: [
        `Compare the parts you know: ${base[known]} → ${big[known]}, so each part is multiplied by ${big[known]} ÷ ${base[known]} = ${k}.`,
        `${base[missing]} × ${k} = ${big[missing]}.`,
        `Missing number: <b>${big[missing]}</b>.`,
      ],
      finalAnswer: String(big[missing]), skill: 'equivalent',
    };
  }
  function share(level) {
    const count = level === 3 && R.chance(0.5) ? 3 : 2;
    const base = baseRatio(count, level === 1 ? 4 : level === 2 ? 7 : 8);
    const sum = base.reduce((a, b) => a + b, 0);
    const per = level === 1 ? R.int(2, 10) : level === 2 ? R.int(3, 20) : R.int(4, 40);
    const total = sum * per;
    const which = R.int(0, count - 1);
    const label = count === 2 ? (base[which] > base[1 - which] ? 'larger' : 'smaller') : ['first', 'second', 'third'][which];
    return {
      prompt: `Share ${f(total)} in the ratio ${show(base)}. What is the ${label} share?`,
      answer: numAns(base[which] * per),
      hint: `Add the parts of the ratio (${base.join(' + ')} = ${sum}). Divide ${f(total)} by ${sum} to find one part.`,
      working: [
        `Total parts: ${base.join(' + ')} = ${sum}.`,
        `One part = ${f(total)} ÷ ${sum} = ${per}.`,
        `Shares: ${base.map((b) => `${b} × ${per} = ${b * per}`).join(', ')}.`,
        `The ${label} share is <b>${f(base[which] * per)}</b>.`,
      ],
      finalAnswer: f(base[which] * per), skill: 'share',
    };
  }
  function describe(level) {
    const base = baseRatio(2, level === 1 ? 5 : 8);
    const k = level === 1 ? R.int(1, 3) : R.int(2, 8);
    const a = base[0] * k, b = base[1] * k;
    const [c1, c2] = R.sample(['red', 'blue', 'green', 'yellow', 'purple', 'orange'], 2);
    const thing = R.pick(['marbles', 'counters', 'beads', 'jellybeans', 'balloons']);
    return {
      prompt: `A jar has ${a} ${c1} ${thing} and ${b} ${c2} ${thing}. Write the ratio of ${c1} to ${c2} in simplest form.`,
      answer: ratioAns(base),
      hint: `Write the numbers in the order asked (${c1} first): ${a}:${b}. Then divide both by their highest common factor.`,
      working: [
        `${c1} : ${c2} = ${a} : ${b}.`,
        k === 1 ? `${a} and ${b} have no common factor, so it is already simplest.` : `Divide both by ${k}: ${a} ÷ ${k} = ${base[0]}, ${b} ÷ ${k} = ${base[1]}.`,
        `Ratio: <b>${show(base)}</b>.`,
      ],
      finalAnswer: show(base), skill: 'describe',
    };
  }
  function ratioFraction() {
    const base = baseRatio(2, 7);
    const sum = base[0] + base[1];
    const [g1, g2] = R.pick([['boys', 'girls'], ['cats', 'dogs'], ['apples', 'oranges'], ['adults', 'children']]);
    if (R.chance(0.5)) {
      const which = R.int(0, 1);
      const fr = N.simplify(base[which], sum);
      return {
        prompt: `The ratio of ${g1} to ${g2} in a group is ${show(base)}. What fraction of the group are ${which === 0 ? g1 : g2}? Give your answer in simplest form.`,
        answer: { type: 'fraction', value: fr, placeholder: 'e.g. 3/5' },
        hint: `A ratio ${show(base)} means ${base[0]} + ${base[1]} = ${sum} parts altogether. The fraction is parts out of the total.`,
        working: [`Total parts: ${base[0]} + ${base[1]} = ${sum}.`, `${which === 0 ? g1 : g2} are ${base[which]} of the ${sum} parts: ${N.fracText(base[which], sum)}.`, `Fraction: <b>${N.fracText(fr.n, fr.d)}</b>.`],
        finalAnswer: N.fracHtml(fr.n, fr.d), skill: 'ratio-fraction',
      };
    }
    const n = base[0], d = sum;
    return {
      prompt: `${N.fracHtml(n, d)} of a group are ${g1}; the rest are ${g2}. Write the ratio of ${g1} to ${g2} in simplest form.`,
      answer: ratioAns([n, d - n]),
      hint: `If ${n} out of ${d} parts are ${g1}, then ${d} − ${n} parts are ${g2}.`,
      working: [`${g1}: ${n} parts out of ${d}.`, `${g2}: ${d} − ${n} = ${d - n} parts.`, `Ratio ${g1} : ${g2} = <b>${n} : ${d - n}</b>.`],
      finalAnswer: `${n} : ${d - n}`, skill: 'ratio-fraction',
    };
  }
  function scale() {
    const sc = R.pick([20, 25, 50, 100, 200, 500]);
    const cm = R.int(2, 12);
    const realCm = cm * sc;
    const toReal = R.chance(0.6);
    const thing = R.pick(['a wall', 'a garden', 'a classroom', 'a swimming pool', 'a boat', 'a driveway']);
    const inM = realCm % 100 === 0;
    const realShown = inM ? `${realCm / 100} m` : `${realCm} cm`;
    if (toReal) {
      return {
        prompt: `A scale drawing of ${thing} uses a scale of 1:${sc}. On the drawing it is ${cm} cm long. How long is it in real life? Give your answer in ${inM ? 'metres' : 'centimetres'}.`,
        answer: numAns(inM ? realCm / 100 : realCm, { unit: inM ? 'm' : 'cm' }),
        hint: `1:${sc} means every 1 cm on the drawing is ${sc} cm in real life. Multiply by ${sc}${inM ? ', then change cm to m (÷ 100)' : ''}.`,
        working: [`Real length = ${cm} × ${sc} = ${realCm} cm.`].concat(inM ? [`${realCm} cm ÷ 100 = ${realCm / 100} m.`] : []).concat([`Real length: <b>${realShown}</b>.`]),
        finalAnswer: realShown, skill: 'scale',
      };
    }
    return {
      prompt: `A scale drawing uses a scale of 1:${sc}. In real life ${thing} is ${realShown} long. How long should it be on the drawing, in cm?`,
      answer: numAns(cm, { unit: 'cm' }),
      hint: `${inM ? `Change ${realShown} into cm first (× 100). ` : ''}Then divide by ${sc}, because 1 cm on the drawing = ${sc} cm in real life.`,
      working: (inM ? [`${realShown} = ${realCm} cm.`] : []).concat([`Drawing length = ${realCm} ÷ ${sc} = ${cm} cm.`, `On the drawing: <b>${cm} cm</b>.`]),
      finalAnswer: `${cm} cm`, skill: 'scale',
    };
  }

  // ---------- unitary method (find one first) ----------
  const UNIT_ITEMS = [['pens', 'pen'], ['muffins', 'muffin'], ['tennis balls', 'tennis ball'], ['exercise books', 'exercise book'], ['apples', 'apple'], ['stickers', 'sticker'], ['ice blocks', 'ice block'], ['pies', 'pie']];
  function unitary(level) {
    const [plural, one] = R.pick(UNIT_ITEMS);
    const per = level === 1 ? R.int(2, 9) : level === 2 ? R.pick([1.5, 2.5, 3.5, 4.5, 0.5, 1.25, 2.25, 3.75]) : R.pick([0.75, 1.25, 1.75, 2.75, 3.25, 4.75, 6.5]);
    const n = level === 1 ? R.int(2, 6) : level === 2 ? R.pick([2, 3, 4, 5, 6, 8]) : R.pick([3, 4, 5, 6, 8, 12]);
    let k = level === 1 ? R.int(2, 9) : level === 2 ? R.int(2, 12) : R.int(5, 20);
    if (k === n) k = n + 1;
    const total = N.round(per * n, 2), want = N.round(per * k, 2);
    if (level === 3 && R.chance(0.35)) {
      // reverse: how many can you buy?
      const budget = N.round(per * k, 2);
      return {
        prompt: `${n} ${plural} cost ${N.money(total)}. How many ${plural} can you buy for ${N.money(budget)}?`,
        answer: numAns(k, { unit: plural }),
        hint: `Find the cost of ONE ${one} first (${N.money(total)} ÷ ${n}). Then see how many of those fit into ${N.money(budget)}.`,
        working: [
          `One ${one}: ${N.money(total)} ÷ ${n} = ${N.money(per)}.`,
          `How many? ${N.money(budget)} ÷ ${N.money(per)} = ${k}.`,
          `<b>${k} ${plural}</b>.`,
        ],
        finalAnswer: `${k} ${plural}`, skill: 'unitary',
      };
    }
    return {
      prompt: `${n} ${plural} cost ${N.money(total)}. At the same price, how much do ${k} ${plural} cost?`,
      answer: numAns(want, { unit: '$' }),
      hint: `Find the cost of <b>ONE</b> ${one} first: ${N.money(total)} ÷ ${n}. Then multiply by ${k}.`,
      working: [
        `Find ONE first: ${N.money(total)} ÷ ${n} = ${N.money(per)} for one ${one}.`,
        `Now multiply up: ${N.money(per)} × ${k} = ${N.money(want)}.`,
        `${k} ${plural} cost <b>${N.money(want)}</b>.`,
      ],
      finalAnswer: N.money(want), skill: 'unitary',
    };
  }
  /** direct proportion with a measurement (not money) */
  function proportion(level) {
    const kinds = [
      { thing: 'identical bricks', unit: 'kg', verb: 'weigh', per: level === 1 ? R.int(2, 6) : R.pick([1.5, 2.5, 3.5, 4]) },
      { thing: 'identical tins of paint', unit: 'L', verb: 'hold', per: level === 1 ? R.int(2, 5) : R.pick([2.5, 1.5, 4.5]) },
      { thing: 'identical water bottles', unit: 'mL', verb: 'hold', per: R.pick([250, 500, 750, 350]) },
      { thing: 'identical bags of feijoas', unit: 'kg', verb: 'weigh', per: level === 1 ? R.int(2, 5) : R.pick([1.5, 2.5, 0.5]) },
    ];
    const c = R.pick(kinds);
    const n = level === 1 ? R.int(2, 6) : R.pick([3, 4, 5, 6, 8, 10]);
    let k = level === 1 ? R.int(2, 9) : R.int(3, 15);
    if (k === n) k = n + 1;
    const total = N.round(c.per * n, 2), want = N.round(c.per * k, 2);
    return {
      prompt: `${n} ${c.thing} ${c.verb} ${f(total)} ${c.unit}. How much do ${k} ${c.thing} ${c.verb}?`,
      answer: numAns(want, { unit: c.unit }),
      hint: `Find ONE first: ${f(total)} ÷ ${n}. Then multiply by ${k}.`,
      working: [
        `One: ${f(total)} ÷ ${n} = ${f(c.per)} ${c.unit}.`,
        `${k} of them: ${f(c.per)} × ${k} = ${f(want)} ${c.unit}.`,
        `<b>${f(want)} ${c.unit}</b>.`,
      ],
      finalAnswer: `${f(want)} ${c.unit}`, skill: 'unitary',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['simp', 'simp', 'equiv', 'share', 'desc', 'unit', 'prop']
      : level === 2 ? ['simp', 'equiv', 'share', 'share', 'desc', 'unit', 'prop']
      : ['simp', 'equiv', 'share', 'rf', 'rf', 'scale', 'scale', 'unit', 'prop'];
    const t = R.pick(pool);
    if (t === 'simp') return simplify(level);
    if (t === 'equiv') return equivalent(level);
    if (t === 'share') return share(level);
    if (t === 'desc') return describe(level);
    if (t === 'rf') return ratioFraction();
    if (t === 'unit') return unitary(level);
    if (t === 'prop') return proportion(level);
    return scale();
  }

  // ---------- word ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['juice', 'prize', 'recipe', 'class', 'buy'] : level === 2 ? ['juice', 'prize', 'recipe', 'class', 'map', 'buy'] : ['juice', 'prize3', 'recipe', 'class', 'map', 'paint', 'buy']);
    const [p1, p2, p3] = pairNames();
    if (t === 'juice') {
      const water = R.pick([3, 4, 5, 6]);
      const cordial = level === 1 ? R.pick([50, 100, 200]) : R.pick([150, 250, 300, 350]);
      const askTotal = level === 3;
      const ans = askTotal ? cordial * (water + 1) : cordial * water;
      return {
        prompt: `Cordial is mixed with water in the ratio 1:${water} (1 part cordial to ${water} parts water). ${p1} uses ${cordial} mL of cordial. ${askTotal ? 'How much drink is made altogether?' : 'How much water is needed?'}`,
        answer: numAns(ans, { unit: 'mL' }),
        hint: `Every 1 part of cordial needs ${water} parts of water, so multiply ${cordial} by ${water}.${askTotal ? ' Then add the cordial too.' : ''}`,
        working: [`Water = ${cordial} × ${water} = ${cordial * water} mL.`].concat(askTotal ? [`Total drink = ${cordial} + ${cordial * water} = ${ans} mL.`] : []).concat([`<b>${f(ans)} mL</b>.`]),
        finalAnswer: `${f(ans)} mL`, skill: 'equivalent',
      };
    }
    if (t === 'prize' || t === 'prize3') {
      const count = t === 'prize3' ? 3 : 2;
      const base = baseRatio(count, level === 1 ? 4 : 7);
      const sum = base.reduce((a, b) => a + b, 0);
      const per = level === 1 ? R.int(2, 10) : R.int(5, 30);
      const total = sum * per;
      const who = [p1, p2, p3].slice(0, count);
      const which = R.int(0, count - 1);
      return {
        prompt: `${who.join(', ').replace(/, ([^,]*)$/, ' and $1')} win ${N.money(total)} in a raffle and share it in the ratio ${show(base)}. How much does ${who[which]} get?`,
        answer: numAns(base[which] * per, { unit: '$' }),
        hint: `Add the parts (${base.join(' + ')} = ${sum}) and divide the money by ${sum} to get one part.`,
        working: [`Total parts = ${sum}. One part = ${N.money(total)} ÷ ${sum} = ${N.money(per)}.`, `${who[which]} gets ${N.plural(base[which], 'part')}: ${base[which]} × ${N.money(per)} = ${N.money(base[which] * per)}.`, `<b>${N.money(base[which] * per)}</b>.`],
        finalAnswer: N.money(base[which] * per), skill: 'share',
      };
    }
    if (t === 'recipe') {
      const base = baseRatio(2, 5);
      const k = level === 1 ? R.int(2, 4) : R.int(2, 8);
      const [food, i1, i2] = R.pick([['pancakes', 'cups of flour', 'eggs'], ['muesli bars', 'cups of oats', 'tablespoons of honey'], ['fried rice', 'cups of rice', 'cups of water'], ['a smoothie', 'scoops of protein powder', 'cups of milk'], ['a cake', 'cups of flour', 'cups of sugar']]);
      return {
        prompt: `A recipe for ${food} uses ${base[0]} ${i1} for every ${base[1]} ${i2}. ${p1} uses ${base[0] * k} ${i1}. How many ${i2} are needed?`,
        answer: numAns(base[1] * k),
        hint: `${base[0]} → ${base[0] * k} is × ${k}. Multiply the ${i2} by ${k} too.`,
        working: [`${base[0] * k} ÷ ${base[0]} = ${k}, so the recipe is multiplied by ${k}.`, `${base[1]} × ${k} = ${base[1] * k}.`, `<b>${base[1] * k} ${i2}</b>.`],
        finalAnswer: `${base[1] * k} ${i2}`, skill: 'equivalent',
      };
    }
    if (t === 'class') {
      const base = baseRatio(2, level === 1 ? 4 : 7);
      const sum = base[0] + base[1];
      const per = level === 1 ? R.int(2, 6) : R.int(3, 8);
      const total = sum * per;
      const which = R.int(0, 1);
      const g = which === 0 ? 'boys' : 'girls';
      return {
        prompt: `In a class of ${total} students, the ratio of boys to girls is ${show(base)}. How many ${g} are there?`,
        answer: numAns(base[which] * per),
        hint: `Total parts = ${base[0]} + ${base[1]} = ${sum}. One part = ${total} ÷ ${sum}.`,
        working: [`One part = ${total} ÷ ${sum} = ${per} students.`, `${g}: ${base[which]} × ${per} = ${base[which] * per}.`, `<b>${base[which] * per} ${g}</b>.`],
        finalAnswer: `${base[which] * per} ${g}`, skill: 'share',
      };
    }
    if (t === 'map') {
      const sc = R.pick([10000, 25000, 50000, 100000, 200000]);
      const cm = R.int(2, 12);
      const km = N.round(cm * sc / 100000, 2);
      const [a, b] = R.sample(['Hamilton', 'Rotorua', 'Taupō', 'Napier', 'Nelson', 'Whanganui', 'Tauranga', 'Blenheim'], 2);
      return {
        prompt: `A map has a scale of 1:${sc.toLocaleString('en-NZ').replace(/,/g, ' ')}. ${a} and ${b} are ${cm} cm apart on the map. How far apart are they in real life, in km?`,
        answer: numAns(km, { unit: 'km' }),
        hint: `Multiply by ${sc.toLocaleString('en-NZ').replace(/,/g, ' ')} to get cm, then change to km (100 000 cm = 1 km).`,
        working: [`Real distance = ${cm} × ${sc.toLocaleString('en-NZ').replace(/,/g, ' ')} = ${(cm * sc).toLocaleString('en-NZ').replace(/,/g, ' ')} cm.`, `÷ 100 000 to change cm to km: ${f(km)} km.`, `<b>${f(km)} km</b>.`],
        finalAnswer: `${f(km)} km`, skill: 'scale',
      };
    }
    if (t === 'buy') {
      if (R.chance(0.5)) {
        const q = unitary(level);
        q.prompt = `${p1} is at the dairy. ${q.prompt}`;
        return q;
      }
      const per = level === 1 ? R.int(2, 8) : R.pick([1.5, 2.5, 3.5, 4.5, 1.25, 2.25]);
      const n = level === 1 ? R.int(2, 5) : R.pick([3, 4, 5, 6, 8]);
      const k = R.int(n + 1, n + 10);
      const total = N.round(per * n, 2), want = N.round(per * k, 2);
      const thing = R.pick(['sausage rolls', 'raffle tickets', 'ice creams', 'school hot dogs', 'cans of drink']);
      return {
        prompt: `At the school gala, ${n} ${thing} cost ${N.money(total)}. How much would ${k} ${thing} cost?`,
        answer: numAns(want, { unit: '$' }),
        hint: `Use the unitary method: find the cost of <b>one</b> first (${N.money(total)} ÷ ${n}), then multiply by ${k}.`,
        working: [`One costs ${N.money(total)} ÷ ${n} = ${N.money(per)}.`, `${k} cost ${N.money(per)} × ${k} = ${N.money(want)}.`, `<b>${N.money(want)}</b>.`],
        finalAnswer: N.money(want), skill: 'unitary',
      };
    }
    // paint: three-part ratio share
    const base = baseRatio(3, 5);
    const sum = base.reduce((a, b) => a + b, 0);
    const per = R.int(2, 12) * 0.5;
    const total = N.round(sum * per, 1);
    const which = R.int(0, 2);
    const cols = ['red', 'blue', 'white'];
    return {
      prompt: `A shade of paint mixes red, blue and white in the ratio ${show(base)}. ${p1} needs ${f(total)} litres of paint. How much ${cols[which]} paint is needed?`,
      answer: numAns(N.round(base[which] * per, 1), { unit: 'L' }),
      hint: `Add the three parts (${sum}) and divide ${f(total)} by ${sum} to find one part.`,
      working: [`Total parts = ${base.join(' + ')} = ${sum}.`, `One part = ${f(total)} ÷ ${sum} = ${f(per)} L.`, `${cols[which]}: ${base[which]} × ${f(per)} = <b>${f(N.round(base[which] * per, 1))} L</b>.`],
      finalAnswer: `${f(N.round(base[which] * per, 1))} L`, skill: 'share',
    };
  }

  HL.registerTopic({
    id: 'ratio', subject: 'maths', strand: 'number', order: 13,
    name: 'Ratio', short: 'Ratio',
    blurb: 'Comparing amounts with ratios, simplifying them and sharing in a ratio.',
    example: '6:9 = 2:3 &nbsp;·&nbsp; Share $50 in 2:3 → $20 and $30',
    animal: 'cat',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const M = (id, c) => `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      const F = (n, d) => N.fracHtml(n, d);
      const dots = (x0, y, n, c) => Array.from({ length: n }, (_, i) => `<circle cx="${x0 + i * 36}" cy="${y}" r="14" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`).join('');
      const bar = (x, y, h, parts) => parts.map((p) => { const s = `<rect x="${x}" y="${y}" width="${p.w}" height="${h}" fill="${p.f}" stroke="${INK}" stroke-width="1.5"/>` + (p.t ? T(x + p.w / 2, y + h / 2 + 5, p.t, p.c || INK, 'font-size="13"') : ''); x += p.w; return s; }).join('');
      /** "a : b" on top, arrows down labelled lab, "c : d" underneath */
      const chg = (id, a, b, lab, c) => S(220, 96, `${M(id, c)}
        ${T(70, 28, a[0], INK, 'font-size="20"')}${T(100, 28, ':', INK, 'font-size="20"')}${T(130, 28, a[1], INK, 'font-size="20"')}
        <line x1="70" y1="38" x2="70" y2="62" stroke="${c}" stroke-width="3" marker-end="url(#${id})"/><line x1="130" y1="38" x2="130" y2="62" stroke="${c}" stroke-width="3" marker-end="url(#${id})"/>
        <text x="80" y="56" fill="${c}" font-size="13">${lab}</text><text x="140" y="56" fill="${c}" font-size="13">${lab}</text>
        ${T(70, 88, b[0], GREEN, 'font-size="20"')}${T(100, 88, ':', INK, 'font-size="20"')}${T(130, 88, b[1], GREEN, 'font-size="20"')}`);
      return {
        what: '<p>A <b>ratio</b> compares two (or more) amounts, like 1 part cordial to 4 parts water, written <b>1:4</b>. Picture a <b>bag of lollies</b> shared out: 2:3 means "every time you get 2, I get 3". The order matters — 2:3 is not 3:2. Ratios work like fractions: multiply or divide <b>every</b> part by the same number and the ratio stays the same.</p>',
        visual: S(360, 212, `
          ${T(160, 22, '2', ROSE, 'font-size="18"')}${T(180, 22, ':', INK, 'font-size="18"')}${T(200, 22, '3', BLUE, 'font-size="18"')}
          ${dots(40, 54, 2, ROSE)}${dots(140, 54, 3, '#A9D8F5')}
          ${T(58, 86, '2 parts', ROSE, 'font-size="13"')}${T(176, 86, '3 parts', BLUE, 'font-size="13"')}<text x="246" y="59" fill="${INK}">= 5 parts</text>
          ${T(180, 112, 'Share $50 in the ratio 2 : 3', INK)}
          ${bar(20, 120, 34, Array.from({ length: 5 }, (_, i) => ({ w: 64, f: i < 2 ? ROSE : '#A9D8F5', t: '$10', c: i < 2 ? '#fff' : INK })))}
          <path d="M20 162 v6 h128 v-6" fill="none" stroke="${ROSE}" stroke-width="2"/><path d="M148 162 v6 h192 v-6" fill="none" stroke="${BLUE}" stroke-width="2"/>
          ${T(84, 186, '$20', ROSE)}${T(244, 186, '$30', BLUE)}
          ${T(180, 208, '$50 ÷ 5 parts = $10 per part', GREEN, 'font-size="13"')}
        `),
        facts: [
          'Order matters: <b>2:3 is not 3:2</b>',
          '<b>Simplify</b>: ÷ every part by the HCF. 12:18 → 2:3',
          '<b>Equivalent</b>: × or ÷ <b>every</b> part by the same number. 2:5 = 6:15',
          '<b>Sharing</b>: add the parts → amount ÷ parts = <b>one part</b> → multiply up',
          '2:3 means the first share is ' + F(2, 5) + ' of the total (<b>not</b> ' + F(2, 3) + ')',
          'Scale <b>1:50</b>: drawing × 50 = real life; real ÷ 50 = drawing',
          '<b>Unitary method</b>: find <b>ONE</b> first (÷), then multiply up (×). 3 pens $7.50 → 1 pen $2.50 → 7 pens $17.50',
        ],
        steps: [
          '<b>Simplify</b>: say "what goes into both?" Divide every part by the highest common factor. 12:18 → both ÷ 6 → 2:3.',
          '<b>Equivalent ratios</b>: say "whatever I do to one part, I do to the other". 2:5 = 6:15 (both × 3).',
          '<b>Sharing in a ratio</b>: say "add the parts, find one part, multiply up". Share $60 in 2:3 → 5 parts → one part = $12 → $24 and $36.',
          '<b>Ratio to fraction</b>: say "part over total parts". 3:5 means 3 + 5 = 8 parts, so the first group is 3/8 of the total.',
          '<b>Scale drawings</b>: 1:50 means 1 cm on the drawing = 50 cm in real life. Multiply to go to real life, divide to go back to the drawing.',
          '<b>Unitary method</b> (for "how much do 7 cost?"): say "<b>find one first, then multiply up</b>". Divide to get the price of ONE, then multiply by how many you want.',
        ],
        examples: [
          { q: 'Simplify 20:35', working: ['<b>Picture:</b> a bag of lollies — 20 red and 35 blue. Can I make the same "pattern" with fewer lollies?', '1. What goes into both 20 and 35? 5 does (the HCF).', '2. Divide every part by 5: 20 ÷ 5 = 4, 35 ÷ 5 = 7.', '3. Can 4:7 simplify more? No — nothing goes into both.', '20:35 = 4:7'], a: '4:7',
            visual: chg('rt-a', ['20', '35'], ['4', '7'], '÷ 5', ROSE) },
          { q: 'Fill the gap: 2:5 = ?:15', working: ['<b>Picture:</b> lollies — for every 2 red there are 5 blue. Now there are 15 blue.', '1. What happened to the 5? It was multiplied by 3 (5 × 3 = 15).', '2. Whatever I do to one part I do to the other: 2 × 3 = 6.', '2:5 = 6:15'], a: '6',
            visual: chg('rt-b', ['2', '5'], ['6', '15'], '× 3', BLUE) },
          { q: 'Share 45 lollies between Harper and Sam in the ratio 4:5', working: ['<b>Picture:</b> the lolly bag is dealt into piles: Harper gets 4 piles, Sam gets 5 piles.', '1. How many piles altogether? 4 + 5 = 9.', '2. How many lollies in one pile? 45 ÷ 9 = 5.', '3. Harper: 4 × 5 = 20. Sam: 5 × 5 = 25.', '4. Check: do the shares add to 45? 20 + 25 = 45. Yes!', 'Harper 20, Sam 25'], a: 'Harper 20 lollies, Sam 25 lollies',
            visual: S(346, 92, `${T(88, 16, '4 piles = 20', ROSE, 'font-size="13"')}${T(241, 16, '5 piles = 25', BLUE, 'font-size="13"')}
              ${bar(20, 24, 34, Array.from({ length: 9 }, (_, i) => ({ w: 34, f: i < 4 ? ROSE : '#A9D8F5', t: '5', c: i < 4 ? '#fff' : INK })))}
              ${T(173, 82, '45 ÷ 9 = 5 lollies per pile', GREEN, 'font-size="13"')}`) },
          { q: 'In a class the ratio of boys to girls is 3:5. What fraction of the class are girls?', working: ['<b>Picture:</b> lollies in a row — 3 red (boys) then 5 blue (girls), repeating.', '1. How many parts altogether? 3 + 5 = 8.', '2. Which part do I want? Girls = 5 parts.', '3. Fraction = part over total parts: 5/8. (Not 5/3!)', 'Girls are ' + F(5, 8) + ' of the class'], a: F(5, 8),
            visual: S(340, 84, `${dots(30, 30, 3, ROSE)}${dots(138, 30, 5, '#A9D8F5')}${T(165, 74, 'girls: 5 out of 8 = 5/8', BLUE, 'font-size="13"')}`) },
          { q: 'A plan uses a scale of 1:100. A wall is 7 cm on the plan. How long is the real wall?', working: ['<b>Picture:</b> 1:100 means every 1 cm on the paper stands for 100 cm in real life.', '1. Am I going to real life or to the drawing? Real life → <b>multiply</b>.', '2. 7 × 100 = 700 cm.', '3. Nicer unit? 700 cm = 7 m.', 'The real wall is 7 m'], a: '7 m' },
          { q: 'Harper makes cordial by mixing cordial and water in the ratio 1:4. She uses 200 mL of cordial. How much water does she need?', working: ['<b>Picture:</b> for every 1 cup of cordial, 4 cups of water.', '1. What happened to the 1? It became 200 (× 200).', '2. Do the same to the other part: 4 × 200 = 800.', '3. Check: 200:800 simplifies to 1:4. Yes!', 'She needs 800 mL of water'], a: '800 mL',
            visual: chg('rt-c', ['1', '4'], ['200', '800'], '× 200', BLUE) },
          { q: '3 pens cost $7.50. How much do 7 pens cost?', working: ['<b>Picture:</b> a shelf of identical pens. I cannot jump straight from 3 to 7, so I find the <b>price tag on ONE pen</b> first.', '1. Do all the pens cost the same? Yes, so this is the <b>unitary method</b>.', '2. Find ONE: $7.50 ÷ 3 = $2.50 for one pen.', '3. Multiply up: $2.50 × 7 = $17.50.', '4. Check: 7 pens is a bit more than double 3 pens, and $17.50 is a bit more than double $7.50. Yes!', '7 pens cost $17.50'], a: '$17.50',
            visual: S(340, 154, `${M('rt-u1', ROSE)}${M('rt-u2', GREEN)}
              ${T(74, 26, '3 pens', INK, 'font-size="16"')}${T(238, 26, '$7.50', INK, 'font-size="16"')}
              <line x1="74" y1="36" x2="74" y2="66" stroke="${ROSE}" stroke-width="3" marker-end="url(#rt-u1)"/>
              <line x1="238" y1="36" x2="238" y2="66" stroke="${ROSE}" stroke-width="3" marker-end="url(#rt-u1)"/>
              ${T(106, 58, '÷ 3', ROSE, 'font-size="13"')}${T(270, 58, '÷ 3', ROSE, 'font-size="13"')}
              ${T(74, 86, '1 pen', ROSE, 'font-size="16"')}${T(238, 86, '$2.50', ROSE, 'font-size="16"')}
              <line x1="74" y1="96" x2="74" y2="126" stroke="${GREEN}" stroke-width="3" marker-end="url(#rt-u2)"/>
              <line x1="238" y1="96" x2="238" y2="126" stroke="${GREEN}" stroke-width="3" marker-end="url(#rt-u2)"/>
              ${T(106, 118, '× 7', GREEN, 'font-size="13"')}${T(270, 118, '× 7', GREEN, 'font-size="13"')}
              ${T(74, 148, '7 pens', GREEN, 'font-size="16"')}${T(238, 148, '$17.50', GREEN, 'font-size="16"')}`) },
        ],
        tips: [
          'Always write the parts in the order the question asks (red to blue means red first).',
          'When sharing, check: the shares should add up to the total amount.',
          'Ratio 2:3 does NOT mean 2/3. The fraction is 2 out of 5 parts.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
