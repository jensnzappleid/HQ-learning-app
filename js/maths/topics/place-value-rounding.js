/* Topic: Place value & rounding — decimals to thousandths, ordering, rounding, × and ÷ by 10, 100, 1000 */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const DEC_PLACES = ['tenths', 'hundredths', 'thousandths'];
  const WHOLE_PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
  const p10 = (k) => Math.pow(10, k);
  /** exact decimal from an integer and a number of decimal places (avoids float noise) */
  const fromInt = (i, dp) => N.round(i / p10(dp), dp);
  const PLACE_BELOW = { 10: 'ones', 100: 'tens', 1000: 'hundreds', 10000: 'thousands' };

  /** a random decimal with exactly dp places (last digit non-zero): {value, str, whole, digs} */
  function makeDecimal(dp, wholeMax) {
    const whole = R.int(0, wholeMax);
    const digs = [];
    for (let i = 0; i < dp; i++) digs.push(R.int(0, 9));
    digs[dp - 1] = R.int(1, 9);
    const dec = Number(digs.join(''));
    return { value: fromInt(whole * p10(dp) + dec, dp), str: `${whole}.${digs.join('')}`, whole, digs };
  }

  // ---------- value of a digit ----------
  function digitValue(level) {
    if (level === 1 && R.chance(0.4)) {
      const nDig = R.int(3, 4);
      let digs = [], pos = 0;
      for (let tries = 0; tries < 60; tries++) {
        digs = []; for (let i = 0; i < nDig; i++) digs.push(R.int(i === 0 ? 1 : 0, 9));
        pos = R.int(0, nDig - 1);
        const d = digs[pos];
        if (d !== 0 && digs.filter((x) => x === d).length === 1) break;
      }
      const digit = digs[pos];
      const placeIdx = nDig - 1 - pos;
      const value = digit * p10(placeIdx);
      const numStr = N.fmt(Number(digs.join('')));
      return {
        prompt: `What is the value of the digit ${digit} in ${numStr}?`,
        answer: { type: 'number', value },
        hint: `Count the columns from the right: ones, tens, hundreds, thousands. Which column is the ${digit} in?`,
        working: [
          'Place value columns from the right: ones, tens, hundreds, thousands.',
          `The ${digit} is in the <b>${WHOLE_PLACES[placeIdx]}</b> column.`,
          `${digit} ${WHOLE_PLACES[placeIdx]} = ${digit} × ${N.fmt(p10(placeIdx))} = <b>${N.fmt(value)}</b>.`,
        ],
        finalAnswer: N.fmt(value),
        skill: 'digit-value',
      };
    }
    const dp = level === 1 ? 2 : 3;
    let dec = makeDecimal(dp, 9), pos = 0;
    for (let tries = 0; tries < 60; tries++) {
      dec = makeDecimal(dp, level === 3 ? 99 : 9);
      pos = level === 1 ? R.int(0, 1) : R.int(0, dp - 1);
      const d = dec.digs[pos];
      const all = String(dec.whole).split('').map(Number).concat(dec.digs);
      if (d !== 0 && all.filter((x) => x === d).length === 1) break;
    }
    const digit = dec.digs[pos];
    const value = fromInt(digit, pos + 1);
    const place = DEC_PLACES[pos];
    return {
      prompt: `What is the value of the digit ${digit} in ${dec.str}? Give your answer as a decimal.`,
      answer: { type: 'number', value, tolerance: 1e-9, placeholder: 'e.g. 0.05' },
      hint: `After the decimal point the columns are tenths, hundredths, thousandths. Which column is the ${digit} in?`,
      working: [
        'Columns after the decimal point: <b>tenths, hundredths, thousandths</b>.',
        `The ${digit} is ${pos + 1} place${pos ? 's' : ''} after the point, so it is in the <b>${place}</b> column.`,
        `${digit} ${digit === 1 ? place.slice(0, -1) : place} = ${N.fracHtml(digit, p10(pos + 1))} = <b>${N.fmt(value)}</b>.`,
      ],
      finalAnswer: N.fmt(value),
      skill: 'digit-value',
    };
  }

  // ---------- ordering decimals ----------
  function ordering(level) {
    const whole = level === 1 ? R.int(0, 5) : R.int(0, 9);
    const maxDp = level === 1 ? 2 : 3;
    const vals = [];
    let guard = 0;
    while (vals.length < 4 && guard++ < 500) {
      const dp = level === 1 ? R.int(1, 2) : R.int(1, 3);
      const d = makeDecimal(dp, 0);
      const v = N.round(whole + d.value, 3);
      if (level === 3 && vals.length && Math.abs(v - vals[0]) > 0.15) continue;
      if (!vals.includes(v)) vals.push(v);
    }
    while (vals.length < 4) vals.push(N.round(whole + 0.1 * (vals.length + 1) + 0.01, 3));
    const largest = R.chance(0.6);
    const target = largest ? Math.max(...vals) : Math.min(...vals);
    const idx = vals.indexOf(target);
    const sorted = vals.slice().sort((a, b) => (largest ? b - a : a - b));
    const padded = vals.map((v) => v.toFixed(maxDp));
    return {
      prompt: `Which of these decimals is the <b>${largest ? 'largest' : 'smallest'}</b>?`,
      answer: { type: 'choice', value: idx, choices: vals.map((v) => N.fmt(v)) },
      hint: 'Give every number the same number of decimal places by adding zeros on the end. Then compare column by column from the left.',
      working: [
        `Write them all with ${maxDp} decimal places: ${padded.join(', ')}.`,
        'Compare from the left: whole numbers first, then tenths, then hundredths, then thousandths.',
        `In order from ${largest ? 'largest' : 'smallest'}: ${sorted.map((v) => N.fmt(v)).join(', ')}.`,
        `The ${largest ? 'largest' : 'smallest'} is <b>${N.fmt(target)}</b>.`,
      ],
      finalAnswer: N.fmt(target),
      skill: 'ordering',
    };
  }

  // ---------- rounding to nearest 10 / 100 / 1000 ----------
  function roundWhole(level) {
    const to = level === 1 ? 10 : level === 2 ? R.pick([10, 100, 1000]) : R.pick([100, 1000, 10000]);
    const max = level === 1 ? 999 : level === 2 ? 9999 : 999999;
    let n = R.int(to + 1, max);
    if (n % to === 0) n += R.int(1, to - 1);
    const lower = Math.floor(n / to) * to, upper = lower + to;
    const ans = Math.round(n / to) * to;
    const keyDigit = Math.floor((n % to) / (to / 10));
    return {
      prompt: `Round ${N.fmt(n)} to the nearest ${N.fmt(to)}.`,
      answer: { type: 'number', value: ans },
      hint: `${N.fmt(n)} is between ${N.fmt(lower)} and ${N.fmt(upper)}. Look at the ${PLACE_BELOW[to]} digit: 5 or more rounds up, less than 5 rounds down.`,
      working: [
        `${N.fmt(n)} sits between ${N.fmt(lower)} and ${N.fmt(upper)}.`,
        `Look at the next digit down (the ${PLACE_BELOW[to]} digit): it is ${keyDigit}.`,
        `${keyDigit} is ${keyDigit >= 5 ? '5 or more, so round <b>up</b> to ' + N.fmt(upper) : 'less than 5, so round <b>down</b> to ' + N.fmt(lower)}.`,
        `${N.fmt(n)} rounded to the nearest ${N.fmt(to)} is <b>${N.fmt(ans)}</b>.`,
      ],
      finalAnswer: N.fmt(ans),
      skill: 'round-whole',
    };
  }

  // ---------- rounding to decimal places ----------
  function roundDp(level) {
    const dp = level === 1 ? 1 : level === 2 ? R.pick([1, 2]) : R.pick([0, 1, 2]);
    const src = Math.max(level === 1 ? 2 : level === 2 ? 3 : R.pick([3, 4]), dp + 1);
    const dec = makeDecimal(src, level === 3 ? 99 : 9);
    const asInt = dec.whole * p10(src) + Number(dec.digs.join(''));
    const ans = fromInt(Math.round(asInt / p10(src - dp)), dp);
    const nextDigit = dec.digs[dp];
    const kept = dp === 0 ? String(dec.whole) : `${dec.whole}.${dec.digs.slice(0, dp).join('')}`;
    const label = dp === 0 ? 'the nearest whole number' : `${dp} decimal place${dp > 1 ? 's' : ''}`;
    const ansStr = ans.toFixed(dp);
    return {
      prompt: `Round ${dec.str} to ${label}.`,
      answer: { type: 'number', value: ans },
      hint: `Look at the digit just after the ${dp === 0 ? 'decimal point' : DEC_PLACES[dp - 1] + ' place'}. 5 or more rounds up; 4 or less leaves it alone.`,
      working: [
        `Keep ${dp === 0 ? 'the whole number part' : dp + ' decimal place' + (dp > 1 ? 's' : '')}: ${kept}.`,
        `The next digit along is ${nextDigit}.`,
        `${nextDigit} is ${nextDigit >= 5 ? '5 or more, so round <b>up</b>' : 'less than 5, so keep it the <b>same</b>'}.`,
        `${dec.str} rounded to ${label} is <b>${ansStr}</b>.`,
      ],
      finalAnswer: ansStr,
      skill: 'round-dp',
    };
  }

  // ---------- significant figures ----------
  /** value = 0.digs × 10^expo. Round the digit list to sf significant figures. */
  function roundSf(digs, expo, sf) {
    const keep = digs.slice(0, sf);
    const next = digs.length > sf ? digs[sf] : 0;
    let e = expo;
    if (next >= 5) {
      let i = sf - 1;
      while (i >= 0) { keep[i]++; if (keep[i] === 10) { keep[i] = 0; i--; } else break; }
      if (i < 0) { keep.unshift(1); keep.pop(); e = expo + 1; }
    }
    return { digs: keep, expo: e };
  }
  const sfValue = (digs, expo) => { const D = Number(digs.join('')); const p = expo - digs.length; return p >= 0 ? D * p10(p) : N.round(D / p10(-p), -p); };
  const sfText = (digs, expo) => {
    const p = expo - digs.length;
    if (p >= 0) return N.fmt(Number(digs.join('')) * p10(p));
    if (expo <= 0) return `0.${'0'.repeat(-expo)}${digs.join('')}`;
    return `${digs.slice(0, expo).join('')}.${digs.slice(expo).join('')}`;
  };
  function sigFig(level) {
    const sf = R.pick([1, 2]);
    const form = R.pick(['big', 'big', 'mid', 'small', 'small']);
    let expo, L;
    if (form === 'big') { L = R.int(sf + 1, 5); expo = L; }
    else if (form === 'mid') { const w = R.int(1, 2); L = Math.max(sf + 1, w + R.int(1, 2)); expo = w; }
    else { expo = -R.int(1, 2); L = R.int(sf + 1, 3); }
    const digs = [R.int(1, 9)];
    for (let i = 1; i < L; i++) digs.push(R.int(0, 9));
    if (digs[L - 1] === 0) digs[L - 1] = R.int(1, 9);
    const str = sfText(digs, expo);
    const r = roundSf(digs, expo, sf);
    const ans = sfValue(r.digs, r.expo);
    const ansStr = sfText(r.digs, r.expo);
    const nextDigit = digs.length > sf ? digs[sf] : 0;
    const label = `${sf} significant figure${sf > 1 ? 's' : ''}`;
    return {
      prompt: `Round ${str} to ${label}.`,
      answer: Object.assign({ type: 'number', value: ans }, form === 'small' ? { placeholder: 'e.g. 0.004' } : {}),
      hint: `The first significant figure is the first digit that is <b>not zero</b>. Count ${sf} digit${sf > 1 ? 's' : ''} from there, then look at the next digit: 5 or more rounds up.`,
      working: [
        `First significant figure = the first digit that is not zero. In ${str} that is the <b>${digs[0]}</b>.${form === 'small' ? ' The zeros at the front only hold the place, so they do not count.' : ''}`,
        `Keep ${label}: ${digs.slice(0, sf).join(' then ')}.`,
        `The next digit is ${nextDigit}, so ${nextDigit >= 5 ? 'round <b>up</b>' : 'leave it the <b>same</b>'}.`,
        form === 'big' ? `Fill the rest with zeros to keep the number the right size: <b>${ansStr}</b>.` : `${str} to ${label} is <b>${ansStr}</b>.`,
      ],
      finalAnswer: ansStr,
      skill: 'sig-figs',
    };
  }

  // ---------- × and ÷ by 10, 100, 1000 ----------
  function mulDiv(level) {
    const k = level === 1 ? R.pick([10, 100]) : R.pick([10, 100, 1000]);
    const kk = Math.round(Math.log10(k));
    const div = level === 1 ? R.chance(0.35) : R.chance(0.5);
    let a, ans;
    if (level === 1) {
      const base = R.chance(0.5) ? R.int(2, 99) : fromInt(R.int(11, 999), 1);
      if (div) { ans = base; a = N.round(base * k, 3); } else { a = base; ans = N.round(base * k, 3); }
    } else {
      const dp = div ? R.int(1, 4 - kk) : R.int(1, level === 3 ? 3 : 2);
      a = makeDecimal(dp, level === 3 ? 999 : 99).value;
      ans = div ? N.round(a / k, dp + kk) : N.round(a * k, Math.max(0, dp - kk));
    }
    const sym = div ? '÷' : '×';
    const dir = div ? 'right' : 'left';
    const pointDir = div ? 'left' : 'right';
    return {
      prompt: `${N.fmt(a)} ${sym} ${N.fmt(k)} = ?`,
      answer: { type: 'number', value: ans, tolerance: 1e-9 },
      hint: `${div ? 'Dividing' : 'Multiplying'} by ${N.fmt(k)} moves every digit ${kk} place${kk > 1 ? 's' : ''} to the ${dir}. The number gets ${div ? 'smaller' : 'bigger'}.`,
      working: [
        `${div ? 'Dividing' : 'Multiplying'} by ${N.fmt(k)} moves the digits ${kk} place${kk > 1 ? 's' : ''} to the ${dir} (the decimal point moves ${kk} place${kk > 1 ? 's' : ''} ${pointDir}).`,
        `${N.fmt(a)} → ${N.fmt(ans)}${div ? '' : ' (fill any empty spaces with zeros)'}.`,
        `${N.fmt(a)} ${sym} ${N.fmt(k)} = <b>${N.fmt(ans)}</b>.`,
      ],
      finalAnswer: N.fmt(ans),
      skill: 'mul-div-10',
    };
  }

  function calc(level) {
    const pool = level === 1
      ? ['digit', 'digit', 'order', 'roundWhole', 'roundDp', 'mulDiv', 'mulDiv']
      : level === 2 ? ['digit', 'order', 'roundWhole', 'roundDp', 'roundDp', 'mulDiv', 'mulDiv']
        : ['digit', 'order', 'roundWhole', 'roundDp', 'mulDiv', 'mulDiv', 'sigFig', 'sigFig'];
    const t = R.pick(pool);
    if (t === 'sigFig') return sigFig(level);
    if (t === 'digit') return digitValue(level);
    if (t === 'order') return ordering(level);
    if (t === 'roundWhole') return roundWhole(level);
    if (t === 'roundDp') return roundDp(level);
    return mulDiv(level);
  }

  // ---------- word problems ----------
  const TOWNS = ['Nelson', 'Whanganui', 'Gisborne', 'Blenheim', 'Timaru', 'Taupō', 'Rotorua', 'Hastings', 'Invercargill', 'New Plymouth'];
  const SHOPS = ['dairy', 'bakery', 'school canteen', 'op shop', 'fish and chip shop'];

  function word(level) {
    const t = level === 1
      ? R.pick(['roll', 'dollar', 'cash', 'times', 'measure'])
      : level === 2 ? R.pick(['cash', 'population', 'measure', 'times', 'divide'])
        : R.pick(['population', 'measure', 'times', 'divide', 'cash', 'bulk', 'packprice', 'roundcompare', 'crowd']);

    if (t === 'bulk') {
      const priceInt = R.int(1250, 4990);                    // a price with 3 decimal places
      const price = fromInt(priceInt, 3);
      const exact = N.round(priceInt / 10, 1);               // price x 100
      const ans = Math.round(exact);
      const story = R.pick([
        { p: `Petrol costs $${price.toFixed(3)} per litre. Harper's dad puts in 100 litres. How much does that cost, to the nearest dollar?` },
        { p: `Diesel for the farm ute costs $${price.toFixed(3)} per litre. The tank takes 100 litres. What does a full tank cost, to the nearest dollar?` },
      ]);
      return {
        prompt: story.p,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: 'Two steps: multiply by 100 first (move the digits 2 places to the left), then round that answer to the nearest dollar.',
        working: [
          `<b>Picture:</b> the digits slide 2 columns to the left when you multiply by 100.`,
          `1. $${price.toFixed(3)} × 100 = $${N.fmt(exact)}.`,
          `2. The digit after the point is ${Math.round(exact * 10) % 10}, so round ${Math.round(exact * 10) % 10 >= 5 ? 'up' : 'down'}.`,
          `To the nearest dollar: <b>$${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: `$${N.fmt(ans)}`,
      };
    }
    if (t === 'packprice') {
      const total = R.int(125, 899);
      const ans = N.round(total / 100, 2);
      const single = N.round(ans + R.int(40, 180) / 100, 2);   // the single price is dearer, and is NOT needed
      const item = R.pick(['exercise books', 'gel pens', 'glue sticks', 'name badges']);
      return {
        prompt: `A box of 100 ${item} costs $${total}. The same shop sells single ones for ${N.money(single)}. How much does <b>one</b> from the box cost?`,
        answer: { type: 'number', value: ans, unit: '$', placeholder: 'e.g. 2.85' },
        hint: 'You only need the box price and the 100. The single price is extra information you do not need.',
        working: [
          `<b>Picture:</b> share the box price between 100 items — the digits slide 2 columns to the <b>right</b>.`,
          `1. Which numbers do I need? $${total} and 100. The ${N.money(single)} single price is <b>not needed</b>.`,
          `2. $${total} ÷ 100 = ${N.money(ans)}.`,
          `One costs <b>${N.money(ans)}</b>.`,
        ],
        finalAnswer: N.money(ans),
      };
    }
    if (t === 'roundcompare') {
      const to = R.pick([100, 1000]);
      let a, b;
      do { a = R.int(12000, 98000); b = R.int(12000, 98000); } while (Math.abs(Math.round(a / to) * to - Math.round(b / to) * to) < to);
      const ra = Math.round(a / to) * to, rb = Math.round(b / to) * to;
      const diff = Math.abs(ra - rb);
      const [t1, t2] = R.sample(TOWNS, 2);
      return {
        prompt: `${t1} has ${N.fmt(a)} people and ${t2} has ${N.fmt(b)} people. Round each population to the nearest ${N.fmt(to)}, then find the difference between the two rounded numbers.`,
        answer: { type: 'number', value: diff, unit: 'people' },
        hint: `Round both numbers to the nearest ${N.fmt(to)} first, then subtract the smaller rounded number from the bigger one.`,
        working: [
          `<b>Picture:</b> tidy both numbers first, then compare the tidy ones.`,
          `1. ${N.fmt(a)} → ${N.fmt(ra)} (nearest ${N.fmt(to)}).`,
          `2. ${N.fmt(b)} → ${N.fmt(rb)} (nearest ${N.fmt(to)}).`,
          `3. ${N.fmt(Math.max(ra, rb))} − ${N.fmt(Math.min(ra, rb))} = ${N.fmt(diff)}.`,
          `Difference: <b>${N.fmt(diff)} people</b>.`,
        ],
        finalAnswer: `${N.fmt(diff)} people`,
      };
    }
    if (t === 'crowd') {
      const sf = R.pick([1, 2]);
      const place = sf === 1 ? 10000 : 1000;
      let crowd; do { crowd = R.int(11000, 89999); } while (crowd % place === 0);
      const ans = Math.round(crowd / place) * place;
      const keyDigit = Math.floor((crowd % place) / (place / 10));
      const event = R.pick(['a rugby test at Eden Park', 'the Warriors game', 'the Black Ferns test', 'the school gala weekend']);
      return {
        prompt: `The crowd at ${event} was ${N.fmt(crowd)}. The newspaper prints this to ${sf} significant figure${sf > 1 ? 's' : ''}. What number does it print?`,
        answer: { type: 'number', value: ans },
        hint: `The first significant figure is the first non-zero digit. Keep ${sf} digit${sf > 1 ? 's' : ''}, then look at the very next digit: 5 or more rounds up.`,
        working: [
          `<b>Picture:</b> keep the ${sf} most important digit${sf > 1 ? 's' : ''} and turn the rest into zeros.`,
          `1. ${N.fmt(crowd)} has 5 digits, so ${sf} significant figure${sf > 1 ? 's means rounding to the nearest ' : ' means rounding to the nearest '}${N.fmt(place)}.`,
          `2. The next digit along is ${keyDigit}, so round ${keyDigit >= 5 ? 'up' : 'down'}.`,
          `To ${sf} significant figure${sf > 1 ? 's' : ''}: <b>${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: N.fmt(ans),
      };
    }

    if (t === 'roll') {
      const n = R.int(112, 998);
      const ans = Math.round(n / 10) * 10;
      return {
        prompt: `Harper's school has ${n} students. The newsletter gives the roll to the nearest 10. What number does it print?`,
        answer: { type: 'number', value: ans, unit: 'students' },
        hint: `Is ${n} closer to ${Math.floor(n / 10) * 10} or ${Math.floor(n / 10) * 10 + 10}? Check the ones digit.`,
        working: [
          `${n} is between ${Math.floor(n / 10) * 10} and ${Math.floor(n / 10) * 10 + 10}.`,
          `The ones digit is ${n % 10}, so round ${n % 10 >= 5 ? 'up' : 'down'}.`,
          `The newsletter prints <b>${ans}</b> students.`,
        ],
        finalAnswer: `${ans} students`,
      };
    }
    if (t === 'dollar') {
      const cents = R.int(500, 9999);
      const price = fromInt(cents, 2);
      const ans = Math.round(price);
      const item = R.pick(['hoodie', 'pair of togs', 'netball', 'book', 'skateboard', 'backpack']);
      return {
        prompt: `A ${item} costs ${N.money(price)}. Round the price to the nearest dollar.`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: 'Look at the tenths digit (the first digit after the point). 5 or more rounds up to the next dollar.',
        working: [
          `${N.money(price)} is between $${Math.floor(price)} and $${Math.floor(price) + 1}.`,
          `The digit after the point is ${Math.floor(cents / 10) % 10}, so round ${Math.floor(cents / 10) % 10 >= 5 ? 'up' : 'down'}.`,
          `Nearest dollar: <b>$${ans}</b>.`,
        ],
        finalAnswer: `$${ans}`,
      };
    }
    if (t === 'cash') {
      let cents = R.int(150, level === 1 ? 2999 : 9999);
      while (cents % 10 === 0 || cents % 10 === 5) cents = R.int(150, level === 1 ? 2999 : 9999);
      const total = fromInt(cents, 2);
      const ans = fromInt(Math.round(cents / 10) * 10, 2);
      return {
        prompt: `Harper pays with cash at the ${R.pick(SHOPS)}. The total comes to ${N.money(total)}. Cash payments are rounded to the nearest 10 cents. How much does she pay?`,
        answer: { type: 'number', value: ans, unit: '$', placeholder: 'e.g. 4.50' },
        hint: 'Look at the last digit (the cents). 1–4 rounds down to the 10 below, 6–9 rounds up to the 10 above.',
        working: [
          `The cents part is ${String(cents % 100).padStart(2, '0')}c. It sits between ${Math.floor((cents % 100) / 10) * 10}c and ${Math.floor((cents % 100) / 10) * 10 + 10}c.`,
          `The last digit is ${cents % 10}, so round ${cents % 10 >= 5 ? 'up' : 'down'}.`,
          `She pays <b>${N.money(ans)}</b>.`,
        ],
        finalAnswer: N.money(ans),
      };
    }
    if (t === 'population') {
      const to = level === 3 ? R.pick([1000, 10000]) : R.pick([100, 1000]);
      let pop = R.int(20000, 160000);
      if (pop % to === 0) pop += 137;
      const ans = Math.round(pop / to) * to;
      const lower = Math.floor(pop / to) * to;
      const keyDigit = Math.floor((pop % to) / (to / 10));
      return {
        prompt: `The population of ${R.pick(TOWNS)} is ${N.fmt(pop)}. Round it to the nearest ${N.fmt(to)}.`,
        answer: { type: 'number', value: ans },
        hint: `${N.fmt(pop)} is between ${N.fmt(lower)} and ${N.fmt(lower + to)}. Check the ${PLACE_BELOW[to]} digit.`,
        working: [
          `${N.fmt(pop)} is between ${N.fmt(lower)} and ${N.fmt(lower + to)}.`,
          `The ${PLACE_BELOW[to]} digit is ${keyDigit}, so round ${keyDigit >= 5 ? 'up' : 'down'}.`,
          `Population to the nearest ${N.fmt(to)}: <b>${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: N.fmt(ans),
      };
    }
    if (t === 'measure') {
      const items = [
        { text: (v) => `Harper's long jump measured ${v} m.`, unit: 'm', wholeMax: 4 },
        { text: (v) => `A kiwi weighed ${v} kg.`, unit: 'kg', wholeMax: 3 },
        { text: (v) => `Harper ran 100 m in ${v} seconds.`, unit: 's', wholeMax: 19 },
        { text: (v) => `A netball court measured ${v} m long.`, unit: 'm', wholeMax: 30 },
        { text: (v) => `A bottle held ${v} L of water.`, unit: 'L', wholeMax: 2 },
        { text: (v) => `The distance from home to school is ${v} km.`, unit: 'km', wholeMax: 6 },
      ];
      const it = R.pick(items);
      const dp = level === 1 ? 1 : level === 2 ? R.pick([1, 2]) : R.pick([0, 1, 2]);
      const src = Math.max(level === 1 ? 2 : 3, dp + 1);
      const dec = makeDecimal(src, it.wholeMax);
      const asInt = dec.whole * p10(src) + Number(dec.digs.join(''));
      const ans = fromInt(Math.round(asInt / p10(src - dp)), dp);
      const label = dp === 0 ? 'the nearest whole number' : `${dp} decimal place${dp > 1 ? 's' : ''}`;
      const nextDigit = dec.digs[dp];
      return {
        prompt: `${it.text(dec.str)} Round this to ${label}.`,
        answer: { type: 'number', value: ans, unit: it.unit },
        hint: `Keep ${dp === 0 ? 'the whole number' : dp + ' decimal place' + (dp > 1 ? 's' : '')}, then look at the next digit: 5 or more rounds up.`,
        working: [
          `Keep ${dp === 0 ? 'the whole number part' : dp + ' decimal place' + (dp > 1 ? 's' : '')}: ${dp === 0 ? dec.whole : dec.whole + '.' + dec.digs.slice(0, dp).join('')}.`,
          `The next digit is ${nextDigit}, so ${nextDigit >= 5 ? 'round up' : 'leave it the same'}.`,
          `Rounded: <b>${ans.toFixed(dp)} ${it.unit}</b>.`,
        ],
        finalAnswer: `${ans.toFixed(dp)} ${it.unit}`,
      };
    }
    if (t === 'times') {
      const k = level === 1 ? R.pick([10, 100]) : R.pick([10, 100, 1000]);
      const kk = Math.round(Math.log10(k));
      const kinds = [
        { make: () => fromInt(R.int(25, 499), 2), text: (v) => `One kiwifruit costs ${N.money(v)}. How much do ${N.fmt(k)} kiwifruit cost?`, unit: '$', money: true },
        { make: () => fromInt(R.int(15, 45), 1), text: (v) => `A bag of rice weighs ${v} kg. What do ${N.fmt(k)} bags weigh?`, unit: 'kg' },
        { make: () => fromInt(R.int(199, 349), 2), text: (v) => `Petrol costs ${N.money(v)} per litre. How much do ${N.fmt(k)} litres cost?`, unit: '$', money: true },
        { make: () => fromInt(R.int(12, 45), 1), text: (v) => `One plank of wood is ${v} cm thick. How tall is a stack of ${N.fmt(k)} planks?`, unit: 'cm' },
        { make: () => fromInt(R.int(2501, 4799), 1), text: (v) => `One lap of the school field is ${v} m. How far is ${N.fmt(k)} laps?`, unit: 'm' },
      ];
      const it = R.pick(kinds);
      const v = it.make();
      const ans = N.round(v * k, 3);
      const show = it.money ? N.money(ans) : `${N.fmt(ans)} ${it.unit}`;
      return {
        prompt: it.text(v),
        answer: { type: 'number', value: ans, unit: it.unit, tolerance: 1e-9 },
        hint: `Multiply by ${N.fmt(k)}: move the digits ${kk} place${kk > 1 ? 's' : ''} to the left (decimal point ${kk} to the right).`,
        working: [
          `${N.fmt(v)} × ${N.fmt(k)}: move the digits ${kk} place${kk > 1 ? 's' : ''} to the left.`,
          `${N.fmt(v)} → ${N.fmt(ans)}.`,
          `Answer: <b>${show}</b>.`,
        ],
        finalAnswer: show,
      };
    }
    // divide
    const k = level === 2 ? R.pick([10, 100]) : R.pick([10, 100, 1000]);
    const kk = Math.round(Math.log10(k));
    const kinds = [
      { make: () => fromInt(R.int(1250, 4990), 2), text: (v) => `${N.fmt(k)} identical pens cost ${N.money(v)} altogether. How much does one pen cost?`, unit: '$', money: true },
      { make: () => fromInt(R.int(45, 120), 1), text: (v) => `A stack of ${N.fmt(k)} identical tiles is ${v} cm tall. How thick is one tile?`, unit: 'cm' },
      { make: () => R.int(120, 480), text: (v) => `${N.fmt(k)} m of rope costs $${v}. How much does 1 m cost?`, unit: '$', money: true },
      { make: () => R.int(150, 960), text: (v) => `A box of ${N.fmt(k)} nails weighs ${v} g. How much does one nail weigh?`, unit: 'g' },
      { make: () => fromInt(R.int(120, 480), 1), text: (v) => `${N.fmt(k)} students paid $${v} in total for a trip. How much did each student pay?`, unit: '$', money: true },
    ];
    const it = R.pick(kinds);
    const v = it.make();
    const ans = N.round(v / k, 5);
    const show = it.money ? N.money(ans) : `${N.fmt(ans)} ${it.unit}`;
    return {
      prompt: it.text(v),
      answer: { type: 'number', value: ans, unit: it.unit, tolerance: 1e-9 },
      hint: `Divide by ${N.fmt(k)}: move the digits ${kk} place${kk > 1 ? 's' : ''} to the right (decimal point ${kk} to the left).`,
      working: [
        `${N.fmt(v)} ÷ ${N.fmt(k)}: move the digits ${kk} place${kk > 1 ? 's' : ''} to the right.`,
        `${N.fmt(v)} → ${N.fmt(ans)}.`,
        `Answer: <b>${show}</b>.`,
      ],
      finalAnswer: show,
    };
  }

  /** mini place-value strip: digits hop columns. dir 'left' (× 10) or 'right' (÷ 10) */
  function slideStrip(dir) {
    const cols = [
      { x0: 6, x1: 50, label: 'tens' },
      { x0: 50, x1: 94, label: 'ones' },
      { x0: 102, x1: 146, label: 'tenths' },
      { x0: 146, x1: 190, label: 'hths' },
    ];
    const c = (i) => (cols[i].x0 + cols[i].x1) / 2;
    const rose = '#E0568C', ink = '#4A3B48', muted = '#8F7C8B';
    const from = dir === 'left' ? [1, 2] : [0, 1];      // 2.5 × 10   |   25 ÷ 10
    const to = dir === 'left' ? [0, 1] : [1, 2];
    const digits = ['2', '5'];
    const hops = from.map((f, i) => {
      const x1 = c(f), x2 = c(to[i]), mid = (x1 + x2) / 2;
      return `<path d="M${x1} 60 Q${mid} 68 ${x2} 78" stroke="${rose}" stroke-width="2.5" fill="none" marker-end="url(#sl-${dir})"/>`;
    }).join('');
    return `<svg viewBox="0 0 196 124" width="196" height="124" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-weight="700">
      <defs><marker id="sl-${dir}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 z" fill="${rose}"/></marker></defs>
      <rect x="6" y="24" width="184" height="76" rx="8" fill="#FFF4F8"/>
      ${[50, 146].map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="100" stroke="#F2D9E3" stroke-width="1.5"/>`).join('')}
      <line x1="98" y1="24" x2="98" y2="100" stroke="${rose}" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="98" y="52" font-size="20" text-anchor="middle" fill="${rose}">.</text>
      <text x="98" y="96" font-size="20" text-anchor="middle" fill="${rose}">.</text>
      ${from.map((f, i) => `<text x="${c(f)}" y="52" font-size="22" text-anchor="middle" fill="${ink}">${digits[i]}</text>`).join('')}
      ${to.map((t, i) => `<text x="${c(t)}" y="96" font-size="22" text-anchor="middle" fill="${rose}">${digits[i]}</text>`).join('')}
      ${hops}
      ${cols.map((col) => `<text x="${(col.x0 + col.x1) / 2}" y="17" font-size="9.5" text-anchor="middle" fill="${muted}">${col.label}</text>`).join('')}
      <text x="98" y="118" font-size="12" text-anchor="middle" fill="${ink}">${dir === 'left' ? '2.5 × 10 = 25' : '25 ÷ 10 = 2.5'}</text>
    </svg>`;
  }

  HL.registerTopic({
    id: 'place-value-rounding', subject: 'maths', strand: 'number', order: 1,
    name: 'Place value & rounding', short: 'Place value',
    blurb: 'What each digit is worth, ordering decimals, rounding, and moving digits when you × or ÷ by 10, 100, 1000.',
    example: '3.472 → the 7 is worth 0.07 &nbsp;·&nbsp; 4.86 × 100 = 486',
    animal: 'bunny',
    learn: {
      what: '<p>Every digit in a number has a <b>place</b> that tells you what it is worth. To the left of the decimal point: ones, tens, hundreds, thousands. To the right: <b>tenths, hundredths, thousandths</b>. So in 3.472 the 4 is worth 0.4, the 7 is worth 0.07 and the 2 is worth 0.002.</p><p><b>Rounding</b> means giving a number roughly, to a level that is easy to say. <b>Multiplying or dividing by 10, 100 or 1000</b> just slides the digits along the columns.</p><p><b>Picture for this topic:</b> the columns are <b>houses on Place Value Street</b>. Each digit lives in a house, and the house tells you what that digit is worth.</p>',
      visual: `<svg viewBox="0 0 360 205" width="360" height="205" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
        <defs>${['#2A6FA5','#E0568C','#2FA97A','#4A3B48'].map((c,i)=>`<marker id="pv-c-${i}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${c}"/></marker>`).join('')}</defs>
        <text x="134" y="62" font-size="46" fill="#4A3B48" text-anchor="middle">.</text>
        ${[[110,45,'3','#2A6FA5','#A9D8F5','ones','worth 3'],[158,135,'4','#E0568C','#F9A8C9','tenths','worth 0.4'],[190,225,'7','#2FA97A','#A6E3B8','hundredths','worth 0.07'],[222,315,'2','#4A3B48','#C9B8F2','thousandths','worth 0.002']].map(([dx,bx,dg,c,bg,name,val],i)=>`
          <text x="${dx}" y="62" font-size="46" fill="${c}" text-anchor="middle">${dg}</text>
          <line x1="${dx-13}" y1="70" x2="${dx+13}" y2="70" stroke="${c}" stroke-width="4"/>
          <line x1="${dx}" y1="76" x2="${bx}" y2="108" stroke="${c}" stroke-width="2.5" marker-end="url(#pv-c-${i})"/>
          <rect x="${bx-44}" y="114" width="88" height="56" rx="10" fill="${bg}"/>
          <text x="${bx}" y="137" text-anchor="middle" fill="#4A3B48" font-size="11.5">${name}</text>
          <text x="${bx}" y="159" text-anchor="middle" fill="${c}">${val}</text>`).join('')}
        <text x="180" y="196" text-anchor="middle" fill="#4A3B48">3.472 = 3 + 0.4 + 0.07 + 0.002</text>
      </svg>`,
      facts: [
        'Right of the point: <b>tenths, hundredths, thousandths</b> (in that order)',
        'Digit value = the digit in its column, <b>zeros everywhere else</b>: the 7 in 3.472 is <b>0.07</b>',
        'Rounding: look at the <b>next digit</b> only. <b>5 or more → up</b>, <b>4 or less → stays</b>',
        `<b>× 10, 100, 1000</b> → digits slide <b>left</b> 1, 2, 3 places (bigger). The point never moves — the digits do.${slideStrip('left')}`,
        `<b>÷ 10, 100, 1000</b> → digits slide <b>right</b> 1, 2, 3 places (smaller).${slideStrip('right')}`,
        'Compare decimals by <b>adding zeros</b> so they have the same length: 0.7 = 0.700',
        '<b>Significant figures</b> start at the <b>first digit that is not zero</b>. In 0.0043 the front zeros only hold the place, so the <b>4</b> is the 1st significant figure',
      ],
      steps: [
        '<b>Value of a digit</b>: say "which house does it live in?" Find its column, then write the digit in that column with zeros everywhere else. (7 in the hundredths house = 0.07.)',
        '<b>Ordering decimals</b>: say "make them the same length". Add zeros on the end (0.5 → 0.500), then compare from the left, column by column.',
        '<b>Rounding</b>: say "which house am I rounding to? Now look at the <b>next digit to the right</b>." <b>5 or more → round up</b>. <b>4 or less → leave it</b>. Everything after that place disappears.',
        '<b>× 10 / 100 / 1000</b>: say "slide every digit 1 / 2 / 3 houses to the <b>left</b>" (the number gets bigger). Fill empty houses with zeros.',
        '<b>÷ 10 / 100 / 1000</b>: say "slide every digit 1 / 2 / 3 houses to the <b>right</b>" (the number gets smaller). Put a zero in front if you need to: 3.4 ÷ 100 = 0.034.',
        '<b>Significant figures</b>: say "start counting at the first digit that is <b>not zero</b>". Keep that many digits, look at the <b>next</b> digit (5 or more → round up), then fill with zeros so the number stays the right size.',
      ],
      examples: [
        { q: 'What is the <b>6</b> worth in 25.68?',
          visual: `<svg viewBox="0 0 360 96" width="360" height="96" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${[[118,'2','#4A3B48'],[146,'5','#4A3B48'],[166,'.','#4A3B48'],[188,'6','#E0568C'],[216,'8','#4A3B48']].map(([x,d,c])=>`<text x="${x}" y="40" font-size="36" fill="${c}" text-anchor="middle">${d}</text>`).join('')}
            <line x1="178" y1="46" x2="198" y2="46" stroke="#E0568C" stroke-width="4"/>
            <line x1="188" y1="50" x2="188" y2="64" stroke="#E0568C" stroke-width="2"/><polygon points="188,70 183,61 193,61" fill="#E0568C"/>
            <rect x="80" y="72" width="216" height="22" rx="8" fill="#F9A8C9"/>
            <text x="188" y="88" text-anchor="middle" fill="#4A3B48">hundredths → worth 0.06</text>
          </svg>`,
          working: ['<i>Picture:</i> the 6 lives in a house on Place Value Street. Which house?', '1. Is the 6 left or right of the point? <b>Right</b>, so it is a fraction of one.', '2. Which house? First house right of the point is tenths, the second is <b>hundredths</b>. The 6 is in the second house.', '3. Write the 6 in the hundredths column, zeros everywhere else: 0.06'], a: '0.06 (six hundredths)' },
        { q: 'Put in order, smallest first: 0.7, &nbsp;0.65, &nbsp;0.703',
          visual: `<table class="data"><tr><th></th><th>ones</th><th>.</th><th>tenths</th><th>hundredths</th><th>thousandths</th></tr><tr><td>0.7</td><td>0</td><td>.</td><td>7</td><td style="color:#2A6FA5">0</td><td style="color:#2A6FA5">0</td></tr><tr><td>0.65</td><td>0</td><td>.</td><td style="color:#E0568C">6</td><td>5</td><td style="color:#2A6FA5">0</td></tr><tr><td>0.703</td><td>0</td><td>.</td><td>7</td><td>0</td><td style="color:#E0568C">3</td></tr></table>`,
          working: ['<i>Picture:</i> line the numbers up so every digit is in its own house. Add zeros to fill empty houses.', '1. Are they the same length? <b>No</b>, so I add zeros: 0.700, 0.650, 0.703.', '2. Compare the tenths house first: 6 is smallest, so <b>0.65</b> comes first.', '3. 0.700 and 0.703 tie until the thousandths house: 0 is less than 3, so 0.7 is next.', 'Order: 0.65, 0.7, 0.703'], a: '0.65, &nbsp;0.7, &nbsp;0.703' },
        { q: 'Round 8.697 to 1 decimal place',
          visual: `<svg viewBox="0 0 360 100" width="360" height="100" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <rect x="30" y="44" width="150" height="12" fill="#A9D8F5"/><rect x="180" y="44" width="150" height="12" fill="#A6E3B8"/>
            <line x1="30" y1="50" x2="330" y2="50" stroke="#4A3B48" stroke-width="2"/>
            ${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<line x1="${30+i*30}" y1="${i%5?45:40}" x2="${30+i*30}" y2="${i%5?55:60}" stroke="#4A3B48" stroke-width="2"/>`).join('')}
            <line x1="180" y1="24" x2="180" y2="62" stroke="#E0568C" stroke-width="2" stroke-dasharray="4 3"/>
            <text x="30" y="78" text-anchor="middle" fill="#2A6FA5">8.6</text><text x="180" y="78" text-anchor="middle" fill="#E0568C">8.65 halfway</text><text x="330" y="78" text-anchor="middle" fill="#2FA97A">8.7</text>
            <text x="100" y="36" text-anchor="middle" fill="#2A6FA5" font-size="12">rounds down to 8.6</text><text x="258" y="36" text-anchor="middle" fill="#2FA97A" font-size="12">rounds up to 8.7</text>
            <circle cx="321" cy="50" r="6" fill="#E0568C"/><text x="312" y="20" text-anchor="middle" fill="#E0568C">8.697</text>
            <text x="180" y="97" text-anchor="middle" fill="#4A3B48">8.697 is past halfway → 8.7</text>
          </svg>`,
          working: ['<i>Picture:</i> 8.697 is standing on the footpath between house 8.6 and house 8.7. Which one is nearer?', '1. Which house am I rounding to? 1 decimal place = the <b>tenths</b> house: 8.<b>6</b>97.', '2. Look at the next digit only. It is <b>9</b>. Is it 5 or more? <b>Yes</b>, so the 6 goes up to 7.', '3. Everything after the tenths house disappears: 8.697 → 8.7'], a: '8.7' },
        { q: 'Round 8,449 to the nearest 100', working: ['<i>Picture:</i> 8,449 is between house 8,400 and house 8,500. Which is nearer?', '1. Which house am I rounding to? The <b>hundreds</b> house: 8,<b>4</b>49.', '2. Next digit to the right is <b>4</b>. Is it 5 or more? <b>No</b>, so the 4 stays a 4.', '3. The digits after it become zeros: 8,449 → 8,400'], a: '8,400' },
        { q: '2.85 × 100',
          visual: `<svg viewBox="0 0 360 104" width="360" height="104" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="15" font-weight="700">
            <defs><marker id="pv-e5" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#E0568C"/></marker></defs>
            ${[['H',60],['T',110],['O',160],['·',185],['t',210],['h',260]].map(([h,x])=>`<text x="${x}" y="20" text-anchor="middle" fill="#2A6FA5" font-size="13">${h}</text><line x1="${x-20}" y1="26" x2="${x+20}" y2="26" stroke="#A9D8F5" stroke-width="2"/>`).join('')}
            <text x="185" y="52" text-anchor="middle" fill="#4A3B48">.</text><text x="185" y="90" text-anchor="middle" fill="#4A3B48">.</text>
            ${[[160,'2'],[210,'8'],[260,'5']].map(([x,d])=>`<text x="${x}" y="52" text-anchor="middle" fill="#4A3B48">${d}</text>`).join('')}
            ${[[60,'2'],[110,'8'],[160,'5'],[210,'0'],[260,'0']].map(([x,d])=>`<text x="${x}" y="90" text-anchor="middle" fill="${d==='0'?'#2FA97A':'#E0568C'}">${d}</text>`).join('')}
            ${[[160,60],[210,110],[260,160]].map(([a,b])=>`<line x1="${a-6}" y1="58" x2="${b+8}" y2="76" stroke="#E0568C" stroke-width="2" marker-end="url(#pv-e5)"/>`).join('')}
            <text x="320" y="48" text-anchor="middle" fill="#E0568C" font-size="13">× 100</text><text x="320" y="66" text-anchor="middle" fill="#E0568C" font-size="12">2 houses</text><text x="320" y="82" text-anchor="middle" fill="#E0568C" font-size="12">← left</text>
          </svg>`,
          working: ['<i>Picture:</i> every digit slides along Place Value Street to a bigger house.', '1. Bigger or smaller? × 100 makes it <b>bigger</b>, so digits slide <b>left</b>.', '2. How many houses? 100 has 2 zeros → <b>2 houses</b>.', '3. 2 moves to hundreds, 8 to tens, 5 to ones. Fill the empty houses with zeros: 2.85 → 285.00', 'Answer: 285'], a: '285' },
        { q: 'Round 4,728 to <b>2 significant figures</b>',
          visual: `<svg viewBox="0 0 360 130" width="360" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${[[110, '4', '#E0568C'], [150, '7', '#E0568C'], [190, '2', '#2A6FA5'], [230, '8', '#9A8A98']].map(([x, d, c]) => `<text x="${x}" y="48" font-size="34" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
            <line x1="92" y1="58" x2="168" y2="58" stroke="#E0568C" stroke-width="4"/>
            <text x="130" y="78" text-anchor="middle" fill="#E0568C">1st and 2nd significant figure</text>
            <text x="196" y="100" text-anchor="middle" fill="#2A6FA5">next digit is 2 → round down</text>
            <text x="180" y="124" text-anchor="middle" fill="#2FA97A">4728 → 4700</text>
          </svg>`,
          working: ['<i>Picture:</i> significant figures ask "give me the first 2 digits that matter, then make it the right size with zeros".', '1. Where do I start counting? At the first digit that is <b>not zero</b>: the <b>4</b>.', '2. Keep 2 figures: 4 and 7.', '3. Next digit along is <b>2</b>. Is it 5 or more? <b>No</b>, so the 7 stays.', '4. Fill the rest with zeros so it is still about four and a half thousand: 4700'], a: '4,700' },
        { q: 'Round 0.00482 to <b>1 significant figure</b>',
          visual: `<svg viewBox="0 0 360 132" width="360" height="132" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <text x="126" y="20" text-anchor="middle" fill="#9A8A98">these zeros only hold the place</text>
            ${[[80, '0', '#9A8A98'], [100, '.', '#9A8A98'], [122, '0', '#9A8A98'], [148, '0', '#9A8A98'], [176, '4', '#E0568C'], [204, '8', '#2A6FA5'], [232, '2', '#9A8A98']].map(([x, d, c]) => `<text x="${x}" y="56" font-size="30" text-anchor="middle" fill="${c}">${d}</text>`).join('')}
            <line x1="162" y1="64" x2="190" y2="64" stroke="#E0568C" stroke-width="4"/>
            <text x="176" y="84" text-anchor="middle" fill="#E0568C">1st significant figure</text>
            <text x="196" y="106" text-anchor="middle" fill="#2A6FA5">next digit is 8 → round up</text>
            <text x="180" y="128" text-anchor="middle" fill="#2FA97A">0.00482 → 0.005</text>
          </svg>`,
          working: ['<i>Picture:</i> the zeros at the front are just holding the door open — they are not "figures that matter".', '1. Which is the first digit that is not zero? The <b>4</b>. That is my 1st significant figure.', '2. I only keep 1 figure, so look at the next digit: <b>8</b>. Is it 5 or more? <b>Yes</b>, so the 4 rounds up to 5.', '3. The 5 must stay in the same house (thousandths): 0.005'], a: '0.005' },
        { q: 'A pack of 1000 sheets of printer paper at Harper\'s school is 47.2 mm thick. How thick is one sheet?', working: ['<i>Picture:</i> sharing 47.2 mm between 1000 sheets — each sheet gets a tiny slice, so the digits slide to smaller houses.', '1. Which operation? "Thick is one sheet" means 47.2 <b>÷ 1000</b>.', '2. Bigger or smaller? Smaller, so digits slide <b>right</b>. 1000 has 3 zeros → <b>3 houses</b>.', '3. 47.2 → 4.72 → 0.472 → 0.0472. Put a zero in front so the point is not lonely.'], a: '0.0472 mm' },
      ],
      tips: [
        'Longer does <b>not</b> mean bigger: 0.7 is bigger than 0.699. Line up the decimal points and add zeros before comparing.',
        'When rounding, only look at <b>one</b> digit to the right. 2.449 to 1 dp is 2.4 (the 4 decides, not the 9).',
        'Multiplying by 10 makes a number bigger, dividing makes it smaller. If your answer went the wrong way, you moved the digits the wrong way.',
        'Money is always rounded to 2 decimal places (cents). NZ cash gets rounded to the nearest 10 cents.',
        'Significant figures are <b>not</b> the same as decimal places. 0.0482 to 2 significant figures is 0.048, but to 2 decimal places it is 0.05.',
      ],
    },
    generate: (level, kind) => {
      const q = kind === 'word' ? word(level) : calc(level);
      // decimal answers: allow a hair of float tolerance (4.1 typed is exactly right)
      if (q.answer.type === 'number' && !Number.isInteger(q.answer.value) && q.answer.tolerance == null) q.answer.tolerance = 1e-9;
      return q;
    },
  });
})(window.HL);
