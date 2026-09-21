/* Topic: Rates & unit rates (unit price, best buy, speed, distance, time) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const money = (x) => N.money(x);
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});
  const names = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby'];
  const GOODS = [['apples', 'kg'], ['potatoes', 'kg'], ['mince', 'kg'], ['cheese', 'kg'], ['rice', 'kg'], ['bananas', 'kg'], ['milk', 'L'], ['juice', 'L'], ['petrol', 'L']];
  /** hours as "2 hours 30 minutes" */
  const hm = (h) => { const w = Math.floor(h), m = Math.round((h - w) * 60); if (!w) return `${m} minutes`; return m ? `${w} hour${w === 1 ? '' : 's'} ${m} minutes` : `${w} hour${w === 1 ? '' : 's'}`; };
  const unitPrice = (level) => level === 1 ? R.int(2, 9) : level === 2 ? R.pick([1.5, 2.5, 3.5, 4.5, 0.5, 2.25, 3.75, 1.25]) : R.dec(0.85, 9.95, 2);

  // ---------- calc ----------
  function unitRate(level) {
    const [item, unit] = R.pick(GOODS);
    const qty = level === 1 ? R.int(2, 6) : level === 2 ? R.pick([2, 4, 5, 8, 10]) : R.pick([3, 4, 5, 6, 8, 12, 20]);
    const per = unitPrice(level);
    const total = N.round(per * qty, 2);
    return {
      prompt: `Find the unit rate: ${qty} ${unit} of ${item} costs ${money(total)}. What is the price per ${unit}?`,
      answer: numAns(per, { unit: `$ per ${unit}` }),
      hint: `Price per ${unit} = total cost ÷ number of ${unit}: ${money(total)} ÷ ${qty}.`,
      working: [`${money(total)} ÷ ${qty} = ${money(per)}.`, `Unit price: <b>${money(per)} per ${unit}</b>.`],
      finalAnswer: `${money(per)} per ${unit}`, skill: 'unit-price',
    };
  }
  function perItem(level) {
    const n = level === 1 ? R.pick([2, 4, 5, 10]) : level === 2 ? R.pick([3, 4, 5, 6, 8, 12]) : R.pick([6, 8, 12, 15, 24, 30]);
    const each = level === 1 ? R.pick([0.5, 1, 1.5, 2, 2.5]) : level === 2 ? R.pick([0.75, 1.25, 0.6, 0.8, 1.2, 0.45]) : R.dec(0.35, 2.95, 2);
    const total = N.round(each * n, 2);
    const thing = R.pick(['muesli bars', 'pens', 'cans of drink', 'yoghurt pottles', 'mandarins', 'tennis balls']);
    return {
      prompt: `A pack of ${n} ${thing} costs ${money(total)}. What is the cost of one?`,
      answer: numAns(each, { unit: '$' }),
      hint: `Cost of one = ${money(total)} ÷ ${n}.`,
      working: [`${money(total)} ÷ ${n} = ${money(each)}.`, `Each one costs <b>${money(each)}</b>.`],
      finalAnswer: money(each), skill: 'unit-price',
    };
  }
  function bestBuy(level) {
    const [item, unit] = R.pick(GOODS);
    const count = level === 1 ? 2 : 3;
    // build deals with distinct unit prices
    const deals = [];
    const used = new Set();
    for (let i = 0; i < 40 && deals.length < count; i++) {
      const qty = level === 1 ? R.pick([1, 2, 5, 10]) : R.pick([2, 3, 4, 5, 6, 8, 10, 12]);
      const per = level === 1 ? R.int(2, 8) : level === 2 ? R.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) : R.dec(1.2, 6, 2);
      if (used.has(per) || deals.some((d) => d.qty === qty)) continue;
      used.add(per); deals.push({ qty, per, total: N.round(per * qty, 2) });
    }
    if (deals.length < count) { deals.length = 0; deals.push({ qty: 2, per: 3, total: 6 }, { qty: 5, per: 2.5, total: 12.5 }, { qty: 10, per: 2, total: 20 }); deals.length = count; }
    const labels = ['A', 'B', 'C'];
    const choices = deals.map((d, i) => `${labels[i]}: ${d.qty} ${unit} for ${money(d.total)}`);
    let best = 0; deals.forEach((d, i) => { if (d.per < deals[best].per) best = i; });
    return {
      prompt: `Which is the best buy for ${item}? &nbsp;${choices.join(' &nbsp;·&nbsp; ')}`,
      answer: { type: 'choice', value: best, choices },
      hint: `Work out the price for 1 ${unit} in each deal (total ÷ ${unit}). The cheapest per ${unit} wins.`,
      working: deals.map((d, i) => `${labels[i]}: ${money(d.total)} ÷ ${d.qty} = ${money(d.per)} per ${unit}.`).concat([`Cheapest per ${unit}: <b>${labels[best]}</b>.`]),
      finalAnswer: choices[best], skill: 'best-buy',
    };
  }
  function speed(level) {
    const ask = R.pick(['speed', 'distance', 'time']);
    const vehicle = R.pick(['A car', 'A bus', 'A train', 'A cyclist', 'A ferry', 'A truck']);
    let v, t;
    if (level === 1) { v = R.step(20, 100, 10); t = R.int(2, 5); }
    else if (level === 2) { v = R.step(30, 110, 5); t = R.pick([2, 3, 4, 1.5, 2.5, 0.5]); }
    else { v = R.step(36, 120, 4); t = R.pick([1.5, 2.5, 3.5, 1.25, 2.75, 0.75, 3.25]); }
    const d = N.round(v * t, 2);
    const tText = level === 3 ? hm(t) : `${f(t)} hours`;
    const tNum = level === 3 ? `${f(t)} h` : `${f(t)} h`;
    if (ask === 'speed') {
      return {
        prompt: `${vehicle} travels ${f(d)} km in ${tText}. What is its average speed in km/h?`,
        answer: numAns(v, { unit: 'km/h' }),
        hint: `Speed = distance ÷ time.${level === 3 ? ` First write ${tText} as a decimal: ${f(t)} hours.` : ''}`,
        working: (level === 3 ? [`${tText} = ${f(t)} hours (${Math.round((t % 1) * 60)} min ÷ 60 = ${f(t % 1)}).`] : []).concat([`Speed = ${f(d)} ÷ ${f(t)} = ${f(v)}.`, `Average speed: <b>${f(v)} km/h</b>.`]),
        finalAnswer: `${f(v)} km/h`, skill: 'speed',
      };
    }
    if (ask === 'distance') {
      return {
        prompt: `${vehicle} travels at ${f(v)} km/h for ${tText}. How far does it go?`,
        answer: numAns(d, { unit: 'km' }),
        hint: `Distance = speed × time.${level === 3 ? ` Write ${tText} as ${f(t)} hours first.` : ''}`,
        working: (level === 3 ? [`${tText} = ${f(t)} hours.`] : []).concat([`Distance = ${f(v)} × ${f(t)} = ${f(d)}.`, `Distance: <b>${f(d)} km</b>.`]),
        finalAnswer: `${f(d)} km`, skill: 'distance',
      };
    }
    return {
      prompt: `${vehicle} travels ${f(d)} km at ${f(v)} km/h. How long does it take, in hours?`,
      answer: numAns(t, { unit: 'hours', placeholder: 'e.g. 2.5' }),
      hint: `Time = distance ÷ speed: ${f(d)} ÷ ${f(v)}.`,
      working: [`Time = ${f(d)} ÷ ${f(v)} = ${f(t)}.`].concat(level >= 2 && !Number.isInteger(t) ? [`${f(t)} hours is ${hm(t)}.`] : []).concat([`Time: <b>${f(t)} hours</b>.`]),
      finalAnswer: `${f(t)} hours${!Number.isInteger(t) ? ` (${hm(t)})` : ''}`, skill: 'time',
    };
  }
  function perMinute(level) {
    const kind = R.pick(['words', 'heartbeats', 'pages', 'skips']);
    const rate = kind === 'words' ? R.int(25, 70) : kind === 'heartbeats' ? R.step(60, 150, 5) : kind === 'pages' ? R.int(1, 4) : R.step(40, 120, 10);
    const mins = level === 1 ? R.int(2, 5) : level === 2 ? R.int(3, 12) : R.pick([15, 20, 25, 30, 45]);
    const total = rate * mins;
    const who = R.pick(names);
    const verb = kind === 'words' ? `types ${total} words` : kind === 'heartbeats' ? `has a heart that beats ${total} times` : kind === 'pages' ? `reads ${total} pages` : `does ${total} skips`;
    const unit = kind === 'words' ? 'words per minute' : kind === 'heartbeats' ? 'beats per minute' : kind === 'pages' ? 'pages per minute' : 'skips per minute';
    if (R.chance(0.6)) {
      return {
        prompt: `${who} ${verb} in ${mins} minutes. What is the rate in ${unit}?`,
        answer: numAns(rate, { unit }),
        hint: `Rate per minute = total ÷ minutes: ${total} ÷ ${mins}.`,
        working: [`${total} ÷ ${mins} = ${rate}.`, `Rate: <b>${rate} ${unit}</b>.`],
        finalAnswer: `${rate} ${unit}`, skill: 'per-minute',
      };
    }
    const mins2 = level === 1 ? R.int(2, 6) : R.int(4, 20);
    return {
      prompt: `${who}'s rate is ${rate} ${unit}. How many ${kind} in ${mins2} minutes?`,
      answer: numAns(rate * mins2),
      hint: `Multiply the rate by the number of minutes: ${rate} × ${mins2}.`,
      working: [`${rate} × ${mins2} = ${rate * mins2}.`, `<b>${rate * mins2} ${kind}</b>.`],
      finalAnswer: `${rate * mins2} ${kind}`, skill: 'per-minute',
    };
  }
  function convertRate(level) {
    const v = level === 1 ? R.step(20, 100, 20) : level === 2 ? R.step(20, 120, 10) : R.step(24, 120, 4);
    const mins = level === 1 ? 30 : level === 2 ? R.pick([30, 15, 20]) : R.pick([15, 20, 45, 10, 40]);
    const d = N.round(v * mins / 60, 2);
    const frac = N.simplify(mins, 60);
    return {
      prompt: `A car travels at ${v} km/h. How far does it travel in ${mins} minutes?`,
      answer: numAns(d, { unit: 'km' }),
      hint: `${mins} minutes is ${N.fracText(frac.n, frac.d)} of an hour. Find that fraction of ${v} km.`,
      working: [`${mins} min = ${N.fracText(mins, 60)} = ${N.fracText(frac.n, frac.d)} of an hour.`, `${v} ÷ ${frac.d} × ${frac.n} = ${f(d)}.`, `Distance: <b>${f(d)} km</b>.`],
      finalAnswer: `${f(d)} km`, skill: 'convert-rate',
    };
  }
  function fill() {
    const rate = R.pick([4, 5, 6, 8, 9, 12, 15]);
    const mins = R.int(3, 8);
    const litres = rate * mins;
    const target = rate * R.int(mins + 2, mins + 20);
    return {
      prompt: `A tap fills ${litres} L in ${mins} minutes. At the same rate, how long will it take to fill a ${target} L tank, in minutes?`,
      answer: numAns(target / rate, { unit: 'minutes' }),
      hint: `First find litres per minute (${litres} ÷ ${mins}). Then divide ${target} by that rate.`,
      working: [`Rate = ${litres} ÷ ${mins} = ${rate} L per minute.`, `Time = ${target} ÷ ${rate} = ${target / rate} minutes.`, `<b>${target / rate} minutes</b>.`],
      finalAnswer: `${target / rate} minutes`, skill: 'multi-step',
    };
  }
  // ---------- exchange rates (the rate is always given in the question) ----------
  const CURR = [
    { code: 'AUD', sym: 'A$', name: 'Australian dollars', rates: { 1: [0.9, 0.8], 2: [0.92, 0.85, 0.95], 3: [0.92, 0.88, 0.94] } },
    { code: 'USD', sym: 'US$', name: 'US dollars', rates: { 1: [0.6, 0.5], 2: [0.6, 0.65, 0.55], 3: [0.62, 0.58, 0.64] } },
    { code: 'GBP', sym: '£', name: 'British pounds', rates: { 1: [0.5, 0.4], 2: [0.45, 0.5, 0.48], 3: [0.47, 0.52, 0.44] } },
    { code: 'EUR', sym: '€', name: 'euros', rates: { 1: [0.5, 0.6], 2: [0.55, 0.6, 0.52], 3: [0.56, 0.58, 0.54] } },
    { code: 'FJD', sym: 'FJ$', name: 'Fijian dollars', rates: { 1: [1.5, 2], 2: [1.25, 1.4, 1.5], 3: [1.35, 1.28, 1.45] } },
  ];
  const cash = (sym, x) => `${sym}${N.round(x, 2).toFixed(2)}`;
  function exchange(level) {
    const c = R.pick(CURR);
    const rate = R.pick(c.rates[level]);
    const toForeign = level === 1 ? R.chance(0.75) : R.chance(0.5);
    const nz = level === 1 ? R.step(20, 200, 10) : level === 2 ? R.step(20, 500, 10) : R.step(25, 900, 25);
    const foreign = N.round(nz * rate, 2);
    const who = R.pick(names);
    if (toForeign) {
      return {
        prompt: `The exchange rate is <b>NZ$1 = ${cash(c.sym, rate)}</b>. ${who} changes NZ$${f(nz)} into ${c.name}. How many ${c.name} does ${who} get?`,
        answer: numAns(foreign, { unit: c.code }),
        hint: `NZ$1 buys ${cash(c.sym, rate)}, so to go from NZ dollars to ${c.name} you <b>multiply</b> by ${f(rate)}.`,
        working: [
          `Rate: NZ$1 = ${cash(c.sym, rate)}.`,
          `NZ dollars → ${c.name}: multiply by ${f(rate)}.`,
          `${f(nz)} × ${f(rate)} = ${f(foreign)}.`,
          `${who} gets <b>${cash(c.sym, foreign)}</b>.`,
        ],
        finalAnswer: cash(c.sym, foreign), skill: 'exchange',
      };
    }
    return {
      prompt: `The exchange rate is <b>NZ$1 = ${cash(c.sym, rate)}</b>. ${who} comes home with ${cash(c.sym, foreign)} left over. How much is that in New Zealand dollars?`,
      answer: numAns(nz, { unit: 'NZD' }),
      hint: `Going back to NZ dollars is the opposite, so <b>divide</b> by ${f(rate)}.`,
      working: [
        `Rate: NZ$1 = ${cash(c.sym, rate)}.`,
        `${c.name} → NZ dollars: divide by ${f(rate)}.`,
        `${f(foreign)} ÷ ${f(rate)} = ${f(nz)}.`,
        `That is <b>NZ$${f(nz)}</b>.`,
      ],
      finalAnswer: `NZ$${f(nz)}`, skill: 'exchange',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['unit', 'item', 'best', 'speed', 'min', 'conv', 'fx']
      : level === 2 ? ['unit', 'item', 'best', 'speed', 'speed', 'min', 'conv', 'fx']
      : ['unit', 'best', 'speed', 'speed', 'min', 'conv', 'fill', 'fx'];
    const t = R.pick(pool);
    if (t === 'fx') return exchange(level);
    if (t === 'unit') return unitRate(level);
    if (t === 'item') return perItem(level);
    if (t === 'best') return bestBuy(level);
    if (t === 'speed') return speed(level);
    if (t === 'min') return perMinute(level);
    if (t === 'conv') return convertRate(level);
    return fill();
  }

  // ---------- word ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['pay', 'trip', 'shop', 'run', 'holiday'] : level === 2 ? ['pay', 'trip', 'shop', 'run', 'water', 'holiday'] : ['pay', 'trip', 'shop3', 'run', 'water', 'holiday']);
    const who = R.pick(names);
    if (t === 'pay') {
      const rate = level === 1 ? R.int(15, 25) : level === 2 ? R.pick([18.5, 20.5, 22.5, 23.5, 25.5]) : R.dec(20.25, 30.75, 2);
      const hours = level === 1 ? R.int(2, 6) : level === 3 ? R.pick([4.5, 5.5, 6.5, 7.5]) : R.int(3, 8);
      const pay = N.round(rate * hours, 2);
      if (R.chance(0.5)) {
        return {
          prompt: `${who} earns ${money(pay)} for ${f(hours)} hours of work at the local dairy. What is the hourly rate of pay?`,
          answer: numAns(rate, { unit: '$ per hour' }),
          hint: `Hourly rate = total pay ÷ hours: ${money(pay)} ÷ ${f(hours)}.`,
          working: [`${money(pay)} ÷ ${f(hours)} = ${money(rate)}.`, `Hourly rate: <b>${money(rate)} per hour</b>.`],
          finalAnswer: `${money(rate)} per hour`, skill: 'unit-price',
        };
      }
      return {
        prompt: `${who} is paid ${money(rate)} per hour at the local dairy. How much does ${who} earn for ${f(hours)} hours?`,
        answer: numAns(pay, { unit: '$' }),
        hint: `Pay = rate × hours: ${money(rate)} × ${f(hours)}.`,
        working: [`${money(rate)} × ${f(hours)} = ${money(pay)}.`, `Pay: <b>${money(pay)}</b>.`],
        finalAnswer: money(pay), skill: 'distance',
      };
    }
    if (t === 'trip') {
      const [a, b] = R.sample(['Auckland', 'Hamilton', 'Rotorua', 'Taupō', 'Napier', 'Wellington', 'Nelson', 'Christchurch', 'Dunedin'], 2);
      const v = level === 1 ? R.step(60, 100, 10) : R.step(60, 100, 5);
      const t2 = level === 1 ? R.int(2, 5) : level === 2 ? R.pick([2.5, 3.5, 1.5, 4.5, 3]) : R.pick([2.25, 3.75, 1.75, 4.25, 2.5]);
      const d = N.round(v * t2, 2);
      const tText = level === 1 ? `${t2} hours` : hm(t2);
      const ask = R.pick(['speed', 'distance', 'time']);
      if (ask === 'speed') return {
        prompt: `${who}'s family drives from ${a} to ${b}, a distance of ${f(d)} km, in ${tText}. What was their average speed in km/h?`,
        answer: numAns(v, { unit: 'km/h' }),
        hint: `Speed = distance ÷ time.${level > 1 ? ` ${tText} = ${f(t2)} hours.` : ''}`,
        working: [`Time = ${f(t2)} hours.`, `Speed = ${f(d)} ÷ ${f(t2)} = ${f(v)}.`, `Average speed: <b>${f(v)} km/h</b>.`],
        finalAnswer: `${f(v)} km/h`, skill: 'speed',
      };
      if (ask === 'distance') return {
        prompt: `${who}'s family drives from ${a} towards ${b} at an average speed of ${v} km/h for ${tText}. How far do they travel?`,
        answer: numAns(d, { unit: 'km' }),
        hint: `Distance = speed × time.${level > 1 ? ` ${tText} = ${f(t2)} hours.` : ''}`,
        working: [`Time = ${f(t2)} hours.`, `Distance = ${v} × ${f(t2)} = ${f(d)}.`, `Distance: <b>${f(d)} km</b>.`],
        finalAnswer: `${f(d)} km`, skill: 'distance',
      };
      return {
        prompt: `${a} to ${b} is ${f(d)} km. ${who}'s family drives at an average speed of ${v} km/h. How long does the trip take, in hours?`,
        answer: numAns(t2, { unit: 'hours', placeholder: 'e.g. 2.5' }),
        hint: `Time = distance ÷ speed: ${f(d)} ÷ ${v}.`,
        working: [`Time = ${f(d)} ÷ ${v} = ${f(t2)} hours.`].concat(Number.isInteger(t2) ? [] : [`That is ${hm(t2)}.`]).concat([`<b>${f(t2)} hours</b>.`]),
        finalAnswer: `${f(t2)} hours`, skill: 'time',
      };
    }
    if (t === 'shop' || t === 'shop3') {
      const q = bestBuy(t === 'shop3' ? 3 : Math.min(level, 2));
      const shop = R.pick(['Pak\'nSave', 'New World', 'Countdown', 'the dairy']);
      q.prompt = `${who} is shopping at ${shop}. ${q.prompt}`;
      return q;
    }
    if (t === 'run') {
      const pace = level === 1 ? R.int(4, 7) : R.pick([4.5, 5.5, 6.5, 5, 6]);
      const km = level === 1 ? R.int(2, 6) : level === 2 ? R.int(3, 10) : R.pick([2.5, 7.5, 12, 10.5]);
      const mins = N.round(pace * km, 2);
      if (R.chance(0.5)) return {
        prompt: `${who} runs ${f(km)} km in ${f(mins)} minutes. How many minutes does each kilometre take, on average?`,
        answer: numAns(pace, { unit: 'min per km' }),
        hint: `Minutes per km = total minutes ÷ km: ${f(mins)} ÷ ${f(km)}.`,
        working: [`${f(mins)} ÷ ${f(km)} = ${f(pace)}.`, `Pace: <b>${f(pace)} minutes per km</b>.`],
        finalAnswer: `${f(pace)} min per km`, skill: 'unit-price',
      };
      return {
        prompt: `${who} runs at a steady ${f(pace)} minutes per kilometre. How long will a ${f(km)} km fun run take, in minutes?`,
        answer: numAns(mins, { unit: 'minutes' }),
        hint: `Multiply the pace by the distance: ${f(pace)} × ${f(km)}.`,
        working: [`${f(pace)} × ${f(km)} = ${f(mins)}.`, `Time: <b>${f(mins)} minutes</b>.`],
        finalAnswer: `${f(mins)} minutes`, skill: 'distance',
      };
    }
    if (t === 'holiday') {
      const c = R.pick(CURR);
      const rate = R.pick(c.rates[level]);
      const place = c.code === 'AUD' ? 'the Gold Coast' : c.code === 'USD' ? 'Los Angeles' : c.code === 'GBP' ? 'London' : c.code === 'EUR' ? 'Paris' : 'Fiji';
      if (R.chance(0.5)) {
        const price = level === 1 ? R.step(10, 100, 10) : R.step(10, 400, 10);
        const nzCost = N.round(price / rate, 2);
        return {
          prompt: `${who} is in ${place}, where the exchange rate is <b>NZ$1 = ${cash(c.sym, rate)}</b>. A pair of shoes costs ${cash(c.sym, price)}. How much is that in New Zealand dollars?`,
          answer: numAns(N.round(nzCost, 2), { unit: 'NZD', tolerance: 0.011 }),
          hint: `To change ${c.name} back into NZ dollars, <b>divide</b> by ${f(rate)}.`,
          working: [`Rate: NZ$1 = ${cash(c.sym, rate)}.`, `${c.name} → NZ dollars: divide by ${f(rate)}.`, `${f(price)} ÷ ${f(rate)} = ${f(N.round(nzCost, 2))}.`, `About <b>NZ$${f(N.round(nzCost, 2))}</b>.`],
          finalAnswer: `NZ$${f(N.round(nzCost, 2))}`, skill: 'exchange',
        };
      }
      const nz = level === 1 ? R.step(50, 300, 50) : R.step(50, 900, 50);
      const foreign = N.round(nz * rate, 2);
      return {
        prompt: `${who} is going to ${place} and changes NZ$${f(nz)} of holiday money. The exchange rate is <b>NZ$1 = ${cash(c.sym, rate)}</b>. How many ${c.name} does ${who} get?`,
        answer: numAns(foreign, { unit: c.code }),
        hint: `NZ dollars → ${c.name} means <b>multiply</b> by ${f(rate)}.`,
        working: [`Rate: NZ$1 = ${cash(c.sym, rate)}.`, `${f(nz)} × ${f(rate)} = ${f(foreign)}.`, `${who} gets <b>${cash(c.sym, foreign)}</b>.`],
        finalAnswer: cash(c.sym, foreign), skill: 'exchange',
      };
    }
    // water: multi-step rate
    const perMin = R.pick([6, 8, 9, 10, 12]);
    const mins = R.int(4, 10);
    const litres = perMin * mins;
    const showerMins = R.int(5, 12);
    return {
      prompt: `A shower uses ${litres} litres of water in ${mins} minutes. How much water does a ${showerMins}-minute shower use?`,
      answer: numAns(perMin * showerMins, { unit: 'L' }),
      hint: `Find litres per minute first (${litres} ÷ ${mins}), then multiply by ${showerMins}.`,
      working: [`Rate = ${litres} ÷ ${mins} = ${perMin} L per minute.`, `${perMin} × ${showerMins} = ${perMin * showerMins} L.`, `<b>${perMin * showerMins} L</b>.`],
      finalAnswer: `${perMin * showerMins} L`, skill: 'multi-step',
    };
  }

  HL.registerTopic({
    id: 'rates', subject: 'maths', strand: 'number', order: 14,
    name: 'Rates & unit rates', short: 'Rates',
    blurb: 'Price per kg, best buys, and speed = distance ÷ time.',
    example: '12 kg for $30 → $2.50 per kg &nbsp;·&nbsp; 150 km in 2 h = 75 km/h',
    animal: 'dog',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const M = (id, c) => `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      /** double number line at height y: top quantity (blue) over bottom quantity (rose); hi = index of the point to highlight */
      const dn = (y, ua, la, ub, lb, hi) => { const st = 240 / (la.length - 1); return `
        <text x="8" y="${y + 5}" fill="${BLUE}" font-size="13">${ua}</text><text x="8" y="${y + 33}" fill="${ROSE}" font-size="13">${ub}</text>
        <line x1="40" y1="${y}" x2="292" y2="${y}" stroke="${BLUE}" stroke-width="2"/><line x1="40" y1="${y + 28}" x2="292" y2="${y + 28}" stroke="${ROSE}" stroke-width="2"/>
        ${la.map((l, i) => { const x = 40 + i * st; return `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 34}" stroke="#C9B8F2" stroke-width="2"/>${i === hi ? `<circle cx="${x}" cy="${y}" r="5" fill="${BLUE}"/><circle cx="${x}" cy="${y + 28}" r="5" fill="${ROSE}"/>` : ''}${T(x, y - 10, l, BLUE, 'font-size="13"')}${T(x, y + 48, lb[i], ROSE, 'font-size="13"')}`; }).join('')}`; };
      const arrow = (id, lab) => `${M(id, ROSE)}<line x1="268" y1="18" x2="112" y2="18" stroke="${ROSE}" stroke-width="3" marker-end="url(#${id})"/>${T(190, 12, lab, ROSE, 'font-size="13"')}`;
      return {
        what: '<p>A <b>rate</b> compares two different kinds of amounts, like dollars and kilograms ($3 per kg) or kilometres and hours (60 km/h). A <b>unit rate</b> tells you how much for <b>one</b>: one kg, one hour, one item. Picture pouring the total into <b>equal boxes, one box per kg (or per hour)</b> — one box is the rate. Unit rates make it easy to compare deals and to work out speeds.</p>',
        visual: S(360, 212, `
          ${T(180, 16, 'apples: $3 per kg', INK)}
          ${dn(40, '$', ['0', '3', '6', '9', '12'], 'kg', ['0', '1', '2', '3', '4'], 1)}
          ${T(180, 118, 'car: 60 km per hour', INK)}
          ${dn(142, 'km', ['0', '60', '120', '180'], 'h', ['0', '1', '2', '3'], 1)}
          ${T(180, 208, 'one step right = one more kg / hour', '#9A8A98', 'font-size="13"')}
        `),
        facts: [
          '<b>Unit rate</b> = total ÷ how many: 5 kg for $12.50 → <b>$2.50 per kg</b>',
          '"<b>per</b>" means "for each one" → <b>divide</b>',
          '<b>Speed = distance ÷ time</b>',
          '<b>Distance = speed × time</b> &nbsp;·&nbsp; <b>Time = distance ÷ speed</b>',
          '15 min = 0.25 h &nbsp;·&nbsp; 30 min = 0.5 h &nbsp;·&nbsp; 45 min = 0.75 h &nbsp;·&nbsp; 1 h 30 min = <b>1.5 h</b> (not 1.3)',
          'Best buy: compare the <b>price per unit</b>, not the pack size',
          '<b>Exchange rate</b> NZ$1 = A$0.92 → NZ$ to A$: <b>× 0.92</b>. &nbsp;A$ back to NZ$: <b>÷ 0.92</b>',
        ],
        steps: [
          '<b>Unit rate</b>: say "total ÷ how many = for one". 5 kg for $12.50 → 12.50 ÷ 5 = $2.50 per kg.',
          '<b>Best buy</b>: say "price per unit for every deal, then pick the cheapest". Bigger is not always cheaper.',
          '<b>Speed</b>: say "distance ÷ time". &nbsp; <b>Distance</b> = speed × time. &nbsp; <b>Time</b> = distance ÷ speed. (Cover the one you want in the D-S-T triangle.)',
          '<b>Minutes to hours</b>: say "÷ 60". 30 min = 0.5 h, 15 min = 0.25 h, 45 min = 0.75 h, 2 h 30 min = 2.5 h.',
          '<b>Part of an hour</b>: at 80 km/h, in 15 minutes (a quarter of an hour) you go 80 ÷ 4 = 20 km.',
          '<b>Exchange rate</b>: an exchange rate is just a rate — "NZ$1 buys A$0.92". Going <b>away</b> from NZ dollars → <b>multiply</b> by the rate. Coming <b>back</b> to NZ dollars → <b>divide</b> by the rate.',
        ],
        examples: [
          { q: '3 kg of apples cost $8.40. What is the price per kg?', working: ['<b>Picture:</b> pour the $8.40 into <b>3 equal boxes</b>, one box per kg.', '1. What is "one"? One kg. So I need total ÷ 3.', '2. 8.40 ÷ 3 = 2.80.', '3. Check: 3 boxes of $2.80 = $8.40. Yes!', '$2.80 per kg'], a: '$2.80 per kg',
            visual: S(320, 108, `${arrow('rate-a', '÷ 3')}${dn(50, '$', ['0', '2.80', '5.60', '8.40'], 'kg', ['0', '1', '2', '3'], 1)}`) },
          { q: 'Deal A: 2 L of juice for $5. Deal B: 5 L for $11. Which is the best buy?', working: ['<b>Picture:</b> pour each deal into <b>1-litre boxes</b> and see what one box costs.', '1. A: one litre = 5 ÷ 2 = $2.50.', '2. B: one litre = 11 ÷ 5 = $2.20.', '3. Which box is cheaper? $2.20 < $2.50, so B.', 'B is the best buy'], a: 'Deal B ($2.20 per L)',
            visual: `<table class="data"><tr><th>Deal</th><th>Price</th><th>Litres</th><th>Per litre</th></tr><tr><td>A</td><td>$5</td><td>2 L</td><td>5 ÷ 2 = <b>$2.50</b></td></tr><tr><td>B</td><td>$11</td><td>5 L</td><td>11 ÷ 5 = <b style="color:#2FA97A">$2.20</b></td></tr></table>` },
          { q: 'A bus travels 210 km in 3 hours 30 minutes. What is its average speed?', working: ['<b>Picture:</b> pour the 210 km into <b>1-hour boxes</b>. One box = the speed.', '1. Is the time in hours? No — 3 h 30 min = 3.5 h (not 3.3!).', '2. Which formula? Speed = distance ÷ time (cover S in the triangle).', '3. 210 ÷ 3.5 = 60.', '60 km/h'], a: '60 km/h',
            visual: S(320, 130, `<path d="M100 8 L20 122 L180 122 Z" fill="#FFE98A" stroke="${INK}" stroke-width="2"/><line x1="56" y1="68" x2="144" y2="68" stroke="${INK}" stroke-width="2"/><line x1="100" y1="68" x2="100" y2="122" stroke="${INK}" stroke-width="2"/>
              ${T(100, 54, 'D', ROSE, 'font-size="24"')}${T(70, 108, 'S', BLUE, 'font-size="24"')}${T(130, 108, 'T', GREEN, 'font-size="24"')}
              <text x="196" y="50" fill="${BLUE}" font-size="13">Speed = D ÷ T</text><text x="196" y="80" fill="${GREEN}" font-size="13">Time = D ÷ S</text><text x="196" y="110" fill="${ROSE}" font-size="13">Distance = S × T</text>`) },
          { q: 'A car drives at 80 km/h. How far does it go in 15 minutes?', working: ['<b>Picture:</b> one hour is a box holding 80 km. 15 minutes is a <b>quarter</b> of the box.', '1. Is the time in hours? 15 min = 15 ÷ 60 = 0.25 h (a quarter).', '2. Which formula? Distance = speed × time (cover D).', '3. 80 × 0.25 = 80 ÷ 4 = 20.', '20 km'], a: '20 km',
            visual: S(320, 108, `${arrow('rate-b', '÷ 4')}${dn(50, 'km', ['0', '20', '40', '60', '80'], 'min', ['0', '15', '30', '45', '60'], 1)}`) },
          { q: 'How long does it take to ride 150 km at 50 km/h?', working: ['<b>Picture:</b> each 1-hour box holds 50 km. How many boxes do I fill?', '1. Which formula? Time = distance ÷ speed (cover T).', '2. 150 ÷ 50 = 3.', '3. Check: 3 boxes × 50 km = 150 km. Yes!', '3 hours'], a: '3 hours' },
          { q: 'Harper babysits for 4 hours and is paid $70. What is her hourly rate?', working: ['<b>Picture:</b> pour the $70 into <b>4 equal boxes</b>, one per hour.', '1. What is "one"? One hour, so total ÷ 4.', '2. 70 ÷ 4 = 17.50.', '3. Check: 4 × $17.50 = $70. Yes!', '$17.50 per hour'], a: '$17.50 per hour' },
          { q: 'The exchange rate is <b>NZ$1 = A$0.92</b>. Harper changes NZ$50 for a trip to Sydney. How many Australian dollars does she get?',
            working: ['<b>Picture:</b> a swap shop at the airport. You hand over NZ$1 notes and each one comes back as A$0.92.', '1. Which way am I going? <b>NZ dollars → Australian dollars</b> (away from home).', '2. Away from NZ dollars means <b>multiply</b> by the rate.', '3. 50 × 0.92 = 46.', '4. Sensible? A$0.92 is less than NZ$1, so the Aussie number should be smaller. It is. Yes!', 'A$46.00'], a: 'A$46.00',
            visual: S(320, 150, `${M('fx-out', GREEN)}${M('fx-back', BLUE)}
              <rect x="18" y="40" width="96" height="40" rx="10" fill="#A9D8F5"/>${T(66, 67, 'NZ$1', INK, 'font-size="20"')}
              <rect x="206" y="40" width="96" height="40" rx="10" fill="#F9A8C9"/>${T(254, 67, 'A$0.92', INK, 'font-size="19"')}
              <path d="M120 44 q40 -22 80 0" stroke="${GREEN}" stroke-width="3" fill="none" marker-end="url(#fx-out)"/>${T(160, 22, '× 0.92', GREEN, 'font-size="14"')}
              <path d="M200 76 q-40 24 -80 0" stroke="${BLUE}" stroke-width="3" fill="none" marker-end="url(#fx-back)"/>${T(160, 112, '÷ 0.92', BLUE, 'font-size="14"')}
              ${T(160, 140, 'NZ$50 × 0.92 = A$46', INK, 'font-size="14"')}`) },
          { q: 'Still <b>NZ$1 = A$0.92</b>. A pair of togs in Sydney costs A$23. How much is that in New Zealand dollars?',
            working: ['<b>Picture:</b> the same swap shop, but walking back the other way.', '1. Which way am I going? <b>Australian dollars → NZ dollars</b> (back home).', '2. Back to NZ dollars is the opposite job, so I <b>divide</b> by the rate.', '3. 23 ÷ 0.92 = 25.', '4. Sensible? Coming home the number should get <b>bigger</b>. It did. Yes!', 'NZ$25'], a: 'NZ$25.00' },
        ],
        tips: [
          '"Per" means "for each one" and tells you to divide: km per hour = km ÷ hours.',
          'Bigger packs are NOT always cheaper per unit. Always check.',
          'Never write 1 h 30 min as 1.3 hours. It is 1.5 hours.',
          'Exchange rates: check your answer makes sense. If NZ$1 buys <b>less</b> than A$1, the Australian number must be the <b>smaller</b> one.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
