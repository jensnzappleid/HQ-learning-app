/* Topic: Decimal calculations (+ − × ÷ with decimals) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const places = (x) => { const s = String(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  /** random decimal in [lo, hi] with exactly d decimal places (last digit not 0) */
  function decimal(lo, hi, d) {
    let v = R.dec(lo, hi, d);
    for (let i = 0; i < 12 && places(v) !== d; i++) v = R.dec(lo, hi, d);
    return v;
  }
  /** shift a decimal to an integer: 3.25 -> 325 */
  const toInt = (x) => Math.round(x * Math.pow(10, places(x)));
  const pad = (x, d) => N.round(x, d).toFixed(d);
  /** number answer; exact decimals get a tiny tolerance so float noise never marks a right answer wrong */
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});

  // ---------- add / subtract ----------
  function addSub(level) {
    let a, b, c = null, op;
    if (level === 1) {
      a = decimal(0.1, 9.9, 1); b = decimal(0.1, 9.9, 1); op = R.pick(['+', '−']);
    } else if (level === 2) {
      const d1 = R.pick([1, 2]), d2 = R.pick([1, 2]);
      a = decimal(0.5, 60, d1); b = decimal(0.5, 60, d2); op = R.pick(['+', '−']);
    } else {
      op = R.pick(['+', '−', '+3']);
      a = decimal(1, 150, R.pick([1, 2])); b = decimal(0.1, 60, R.pick([1, 2]));
      if (op === '+3') c = decimal(0.1, 30, R.pick([1, 2]));
    }
    if (op === '−' && b > a) [a, b] = [b, a];
    if (op === '−' && a === b) b = N.round(b - 0.5, 2);
    const d = Math.max(places(a), places(b), c == null ? 0 : places(c));
    let ans, prompt, working;
    if (op === '+3') {
      ans = N.round(a + b + c, d);
      prompt = `${f(a)} + ${f(b)} + ${f(c)} = ?`;
      working = [
        `Line up the decimal points and write every number with ${d} decimal place${d > 1 ? 's' : ''}: ${pad(a, d)}, ${pad(b, d)}, ${pad(c, d)}.`,
        `Add the first two: ${pad(a, d)} + ${pad(b, d)} = ${pad(N.round(a + b, d), d)}.`,
        `Add the third: ${pad(N.round(a + b, d), d)} + ${pad(c, d)} = ${pad(ans, d)}.`,
        `Answer: <b>${f(ans)}</b>.`,
      ];
    } else if (op === '+') {
      ans = N.round(a + b, d);
      prompt = `${f(a)} + ${f(b)} = ?`;
      working = [
        `Line up the decimal points: ${pad(a, d)} over ${pad(b, d)} (fill empty places with 0).`,
        `Add column by column from the right, carrying if needed.`,
        `${pad(a, d)} + ${pad(b, d)} = <b>${f(ans)}</b>.`,
      ];
    } else {
      ans = N.round(a - b, d);
      prompt = `${f(a)} − ${f(b)} = ?`;
      working = [
        `Line up the decimal points: ${pad(a, d)} over ${pad(b, d)} (fill empty places with 0).`,
        `Subtract column by column from the right, borrowing if needed.`,
        `${pad(a, d)} − ${pad(b, d)} = <b>${f(ans)}</b>.`,
      ];
    }
    return {
      prompt, answer: numAns(ans),
      hint: `Write the numbers under each other with the decimal points lined up. Fill gaps with zeros, then ${op === '−' ? 'subtract' : 'add'} like whole numbers.`,
      working, finalAnswer: f(ans), skill: 'add-sub',
    };
  }

  // ---------- decimal × whole ----------
  function mulWhole(level) {
    const d = level === 1 ? 1 : 2;
    const a = decimal(level === 1 ? 0.2 : 0.25, level === 1 ? 9.9 : level === 2 ? 20 : 60, d);
    const b = level === 1 ? R.int(2, 9) : level === 2 ? R.int(2, 12) : R.int(11, 25);
    const ai = toInt(a), prod = ai * b;
    const ans = N.round(prod / Math.pow(10, d), d);
    return {
      prompt: `${f(a)} × ${b} = ?`,
      answer: numAns(ans),
      hint: `Ignore the decimal point, multiply ${ai} × ${b}, then put the point back so the answer has ${d} decimal place${d > 1 ? 's' : ''}.`,
      working: [
        `Ignore the point: ${ai} × ${b} = ${prod}.`,
        `${f(a)} has ${d} decimal place${d > 1 ? 's' : ''}, so the answer needs ${d} decimal place${d > 1 ? 's' : ''}.`,
        `${prod} → <b>${f(ans)}</b>.`,
      ],
      finalAnswer: f(ans), skill: 'mul-whole',
    };
  }

  // ---------- decimal × decimal ----------
  function mulDec(level) {
    const da = level === 3 ? R.pick([1, 2]) : 1, db = 1;
    const a = decimal(0.2, level === 3 ? 12 : 9.9, da);
    const b = decimal(0.2, level === 3 ? 9.9 : 0.9, db);
    const ai = toInt(a), bi = toInt(b), prod = ai * bi, d = da + db;
    const ans = N.round(prod / Math.pow(10, d), d);
    return {
      prompt: `${f(a)} × ${f(b)} = ?`,
      answer: numAns(ans),
      hint: `Multiply ${ai} × ${bi} first. Then count the decimal places in both numbers (${da} + ${db} = ${d}) and put the point back.`,
      working: [
        `Ignore the points: ${ai} × ${bi} = ${prod}.`,
        `Count decimal places: ${f(a)} has ${da}, ${f(b)} has ${db}, so ${da} + ${db} = ${d} in total.`,
        `Put the point back ${d} place${d > 1 ? 's' : ''} from the right: <b>${f(ans)}</b>.`,
      ],
      finalAnswer: f(ans), skill: 'mul-dec',
    };
  }

  // ---------- decimal ÷ whole ----------
  function divWhole(level) {
    const d = level === 1 ? 1 : 2;
    const q = decimal(level === 1 ? 0.2 : 0.15, level === 1 ? 9.9 : level === 2 ? 15 : 40, d);
    const b = level === 3 ? R.int(3, 12) : R.int(2, 9);
    const a = N.round(q * b, d);
    return {
      prompt: `${f(a)} ÷ ${b} = ?`,
      answer: numAns(q),
      hint: `Divide as usual, keeping the decimal point in the answer directly above the point in ${f(a)}.`,
      working: [
        `Set out ${f(a)} ÷ ${b} as short division. The point in the answer goes straight above the point in ${f(a)}.`,
        `Check by multiplying back: ${f(q)} × ${b} = ${f(a)}.`,
        `Answer: <b>${f(q)}</b>.`,
      ],
      finalAnswer: f(q), skill: 'div-whole',
    };
  }

  // ---------- ÷ by a decimal (L3) ----------
  function divDec() {
    const b = decimal(0.2, 0.9, 1);
    const q = R.chance(0.7) ? R.int(2, 15) : decimal(1.5, 9.5, 1);
    const a = N.round(q * b, 2);
    const ai10 = N.round(a * 10, 1), bi10 = Math.round(b * 10);
    return {
      prompt: `${f(a)} ÷ ${f(b)} = ?`,
      answer: numAns(q),
      hint: `Multiply both numbers by 10 so you are dividing by a whole number: ${f(ai10)} ÷ ${bi10}.`,
      working: [
        `Dividing by a decimal is awkward, so multiply BOTH numbers by 10 (this does not change the answer).`,
        `${f(a)} × 10 = ${f(ai10)} and ${f(b)} × 10 = ${bi10}.`,
        `${f(ai10)} ÷ ${bi10} = <b>${f(q)}</b>.`,
      ],
      finalAnswer: f(q), skill: 'div-dec',
    };
  }

  // ---------- × ÷ by 0.1 / 0.01 ----------
  function pow10(level) {
    const k = level === 3 ? R.pick([0.1, 0.01]) : 0.1;
    const op = R.pick(['×', '÷']);
    const a = R.chance(0.5) ? R.int(2, 99) : decimal(0.5, 60, 1);
    const shift = k === 0.1 ? 1 : 2;
    const ans = op === '×' ? N.round(a * k, places(a) + shift) : N.round(a / k, 3);
    const dir = op === '×' ? 'left (smaller)' : 'right (bigger)';
    return {
      prompt: `${f(a)} ${op} ${k} = ?`,
      answer: numAns(ans),
      hint: `${op === '×' ? 'Multiplying' : 'Dividing'} by ${k} is the same as ${op === '×' ? 'dividing' : 'multiplying'} by ${k === 0.1 ? 10 : 100}. Move the decimal point ${shift} place${shift > 1 ? 's' : ''} ${dir}.`,
      working: [
        `${k} = ${N.fracText(1, k === 0.1 ? 10 : 100)}, so ${op} ${k} means ${op === '×' ? '÷' : '×'} ${k === 0.1 ? 10 : 100}.`,
        `Move the decimal point ${shift} place${shift > 1 ? 's' : ''} to the ${dir}.`,
        `${f(a)} → <b>${f(ans)}</b>.`,
      ],
      finalAnswer: f(ans), skill: 'pow10',
    };
  }

  // ---------- recurring decimals (dot notation) ----------
  const DOT = (d) => `${d}&#775;`;
  /** dot notation html for a repeating block, e.g. pre '1', rep '6' -> 0.16̇ */
  const dotHtml = (pre, rep) => `0.${pre}${rep.length === 1 ? DOT(rep) : DOT(rep[0]) + rep.slice(1, -1) + DOT(rep[rep.length - 1])}`;
  /** exact decimal digits of n/d by long division */
  function expand(n, d, k) {
    let r = n % d, s = '';
    for (let i = 0; i < k; i++) { r *= 10; s += Math.floor(r / d); r %= d; }
    return `${Math.floor(n / d)}.${s}`;
  }
  const RECUR = {
    easy: [[1, 3, '', '3'], [2, 3, '', '6'], [1, 9, '', '1'], [2, 9, '', '2'], [4, 9, '', '4'], [5, 9, '', '5'], [7, 9, '', '7'], [8, 9, '', '8']],
    hard: [[1, 6, '1', '6'], [5, 6, '8', '3'], [1, 11, '', '09'], [2, 11, '', '18'], [7, 11, '', '63'], [1, 12, '08', '3'], [5, 12, '41', '6'], [1, 15, '0', '6']],
  };
  function recurringQ(level) {
    const [n, d, pre, rep] = R.pick(level === 3 ? RECUR.easy.concat(RECUR.hard, RECUR.hard) : RECUR.easy);
    const html = dotHtml(pre, rep);
    const long = expand(n, d, 8);
    if (level === 1 && R.chance(0.5)) {
      const correct = `${long.slice(0, 7)}…`;
      const opts = new Set([correct, `0.${pre}${rep}`, `${long.slice(0, 4)}`, `${Math.max(1, Number(rep[0]))}.${rep.repeat(3)}…`]);
      const choices = R.shuffle([...opts]).slice(0, 4);
      return {
        prompt: `The dot means those digits repeat for ever. What does ${html} mean?`,
        answer: { type: 'choice', value: choices.indexOf(correct), choices },
        hint: 'A dot above a digit means that digit keeps repeating without ever stopping.',
        working: [`The dot sits above the ${rep.length === 1 ? rep : rep + ' block'}, so ${rep.length === 1 ? 'that digit repeats' : 'those digits repeat'} for ever.`, `${html} = <b>${correct}</b>`],
        finalAnswer: correct, skill: 'recurring',
      };
    }
    const dp = level === 1 ? 2 : R.pick([2, 2, 3]);
    const ans = N.round(n / d, dp);
    const nextDigit = Number(long.split('.')[1][dp]);
    return {
      prompt: `${html} means ${long.slice(0, 8)}… &nbsp;Write it correct to ${dp} decimal place${dp > 1 ? 's' : ''}.`,
      answer: { type: 'number', value: ans, tolerance: Math.pow(10, -dp) / 10, placeholder: dp === 2 ? 'e.g. 0.67' : 'e.g. 0.667' },
      hint: `Keep ${dp} decimal place${dp > 1 ? 's' : ''}, then look at the very next digit: 5 or more rounds up.`,
      working: [
        `Write out enough digits: ${long.slice(0, 8)}…`,
        `Keep ${dp} decimal place${dp > 1 ? 's' : ''}: ${long.slice(0, 2 + dp)}.`,
        `The next digit is ${nextDigit}, so ${nextDigit >= 5 ? 'round <b>up</b>' : 'leave it the <b>same</b>'}.`,
        `Answer: <b>${ans.toFixed(dp)}</b>.`,
      ],
      finalAnswer: ans.toFixed(dp), skill: 'recurring',
    };
  }

  // ---------- a division that must be rounded ----------
  function divRound(level) {
    const dp = level === 1 ? 1 : R.pick([1, 2, 2]);
    let a, b, guard = 0;
    do {
      b = level === 3 ? R.pick([3, 4, 6, 7, 8, 9, 11, 12]) : R.int(3, 9);
      a = level === 1 ? R.int(2 * b + 1, 20 * b) : level === 2 ? decimal(5, 90, 1) : decimal(10, 200, R.pick([1, 2]));
    } while (guard++ < 60 && (N.round(a / b, dp) === N.round(a / b, dp + 4) || a / b < 0.5));
    const exact = a / b;
    const ans = N.round(exact, dp);
    const longStr = exact.toFixed(dp + 3);
    const nextDigit = Number(longStr.split('.')[1][dp]);
    return {
      prompt: `${f(a)} ÷ ${b} = ? &nbsp;Give your answer to ${dp} decimal place${dp > 1 ? 's' : ''}.`,
      answer: { type: 'number', value: ans, tolerance: Math.pow(10, -dp) / 10, placeholder: dp === 1 ? 'e.g. 4.3' : 'e.g. 4.27' },
      hint: `Divide until you have ${dp + 1} decimal place${dp > 0 ? 's' : ''}, then round: 5 or more rounds up.`,
      working: [
        `${f(a)} ÷ ${b} = ${longStr}…`,
        `You only need ${dp} decimal place${dp > 1 ? 's' : ''}, so look at the next digit: ${nextDigit}.`,
        `${nextDigit >= 5 ? 'It is 5 or more, so round <b>up</b>' : 'It is less than 5, so leave it the <b>same</b>'}.`,
        `Answer: <b>${ans.toFixed(dp)}</b>.`,
      ],
      finalAnswer: ans.toFixed(dp), skill: 'div-round',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['add', 'add', 'mulW', 'divW', 'mulW', 'recur', 'divRound']
      : level === 2 ? ['add', 'add', 'mulW', 'mulD', 'divW', 'pow10', 'recur', 'divRound']
      : ['add', 'mulW', 'mulD', 'divW', 'divD', 'divD', 'pow10', 'recur', 'divRound'];
    const t = R.pick(pool);
    if (t === 'recur') return recurringQ(level);
    if (t === 'divRound') return divRound(level);
    if (t === 'add') return addSub(level);
    if (t === 'mulW') return mulWhole(level);
    if (t === 'mulD') return mulDec(level);
    if (t === 'divW') return divWhole(level);
    if (t === 'divD') return divDec();
    return pow10(level);
  }

  // ---------- word problems ----------
  const ITEMS = [['a pie', 4.5], ['a juice', 3.2], ['a sandwich', 6.8], ['a muffin', 3.75], ['a sushi pack', 8.4], ['an ice block', 2.5], ['a bag of chips', 2.75], ['a milkshake', 5.9], ['a fruit cup', 4.25], ['a hot chocolate', 4.6]];
  const kidNames = ['Harper', 'Mia', 'Liam', 'Aroha', 'Noah', 'Tane', 'Ella', 'Sione'];

  function word(level) {
    const t = R.pick(level === 1 ? ['shop', 'change', 'length', 'share']
      : level === 2 ? ['shop', 'change', 'fuel', 'length', 'share', 'shop']
        : ['shop', 'change', 'fuel', 'length', 'share', 'receipt', 'receipt', 'petrolChange', 'petrolChange', 'perKg', 'perKg']);
    if (t === 'receipt') {
      const items = R.sample(ITEMS, R.pick([3, 4]));
      const total = N.round(items.reduce((s, it) => s + it[1], 0), 2);
      const err = R.pick([0.1, 0.2, 0.5, 0.75, 1, 1.2, 1.5, 2]);
      const over = R.chance(0.6);
      const printed = N.round(total + (over ? err : -err), 2);
      const list = items.map((it) => `${it[0]} ${N.money(it[1])}`).join(', ').replace(/, ([^,]*)$/, ' and $1');
      const who = R.pick(kidNames);
      const askDiff = R.chance(0.5);
      const lines = [
        `Line the points up and add: ${items.map((it) => it[1].toFixed(2)).join(' + ')} = ${N.money(total)}.`,
        `The till printed ${N.money(printed)}, which is ${over ? 'more' : 'less'} than it should be.`,
      ];
      if (askDiff) {
        return {
          prompt: `${who} buys ${list} at the dairy. The till prints a total of ${N.money(printed)}. How much has ${who} been ${over ? 'over' : 'under'}charged?`,
          answer: numAns(err, { unit: '$' }),
          hint: 'Add the prices yourself first, then find the difference between your total and the printed one.',
          working: lines.concat([`Difference: ${N.money(Math.max(total, printed))} − ${N.money(Math.min(total, printed))} = <b>${N.money(err)}</b>.`]),
          finalAnswer: N.money(err), skill: 'add-sub',
        };
      }
      return {
        prompt: `${who} buys ${list} at the dairy. The till prints a total of ${N.money(printed)}, but that looks wrong. What <b>should</b> the total be?`,
        answer: numAns(total, { unit: '$' }),
        hint: 'Ignore the printed total. Add the prices yourself with the decimal points lined up.',
        working: lines.concat([`The correct total is <b>${N.money(total)}</b>.`]),
        finalAnswer: N.money(total), skill: 'add-sub',
      };
    }
    if (t === 'petrolChange') {
      const price = R.pick([2.4, 2.5, 2.6, 2.8, 3.0, 3.2]);
      const litres = decimal(15.5, 38.5, 1);
      const cost = N.round((toInt(litres) * toInt(price)) / Math.pow(10, places(litres) + places(price)), 2);
      const note = cost < 50 ? 50 : 100;
      const change = N.round(note - cost, 2);
      return {
        prompt: `Petrol costs ${N.money(price)} a litre. Harper's mum puts ${f(litres)} litres in the car and pays with a $${note} note. How much change should she get?`,
        answer: numAns(change, { unit: '$' }),
        hint: `Two steps: first the cost (${f(litres)} × ${f(price)}), then $${note} − the cost.`,
        working: [
          `Step 1 — cost: ignore the points and multiply ${toInt(litres)} × ${toInt(price)} = ${toInt(litres) * toInt(price)}.`,
          `Count the decimal places: ${places(litres)} + ${places(price)} = ${places(litres) + places(price)}, so the cost is ${N.money(cost)}.`,
          `Step 2 — change: ${note}.00 − ${cost.toFixed(2)} = ${change.toFixed(2)}.`,
          `Change: <b>${N.money(change)}</b>.`,
        ],
        finalAnswer: N.money(change), skill: 'mul-dec',
      };
    }
    if (t === 'perKg') {
      const thing = R.pick([['kūmara', 'kg'], ['kiwifruit', 'kg'], ['apples', 'kg'], ['mince', 'kg'], ['cheese', 'kg']]);
      let uA = 0, uB = 0, mA = 0, mB = 0;
      for (let i = 0; i < 60; i++) {
        uA = decimal(2.5, 7.5, 2); uB = decimal(2.5, 7.5, 2);
        mA = R.int(2, 5); mB = R.int(2, 5);
        if (Math.abs(uA - uB) >= 0.2 && mA !== mB) break;
      }
      const costA = N.round(uA * mA, 2), costB = N.round(uB * mB, 2);
      const cheaper = uA < uB ? 0 : 1;
      const opts = [`the ${mA} ${thing[1]} bag`, `the ${mB} ${thing[1]} bag`];
      return {
        prompt: `At the supermarket a ${mA} ${thing[1]} bag of ${thing[0]} costs ${N.money(costA)} and a ${mB} ${thing[1]} bag costs ${N.money(costB)}. Which bag is better value <b>per kilogram</b>?`,
        answer: { type: 'choice', value: cheaper, choices: opts.concat(['They cost the same per kilogram']) },
        hint: 'Work out the price of ONE kilogram for each bag: cost ÷ number of kilograms.',
        working: [
          `Bag 1: ${f(costA)} ÷ ${mA} = ${N.money(uA)} per ${thing[1]}.`,
          `Bag 2: ${f(costB)} ÷ ${mB} = ${N.money(uB)} per ${thing[1]}.`,
          `${N.money(Math.min(uA, uB))} is less than ${N.money(Math.max(uA, uB))}.`,
          `Better value: <b>${opts[cheaper]}</b>.`,
        ],
        finalAnswer: opts[cheaper], skill: 'div-whole',
      };
    }
    if (t === 'shop') {
      const items = R.sample(ITEMS, level === 1 ? 2 : 3);
      const total = N.round(items.reduce((s, it) => s + it[1], 0), 2);
      const list = items.map((it) => `${it[0]} (${N.money(it[1])})`).join(', ').replace(/, ([^,]*)$/, ' and $1');
      return {
        prompt: `At the school canteen ${R.pick(kidNames)} buys ${list}. What is the total cost?`,
        answer: numAns(total, { unit: '$' }),
        hint: 'Add the prices with the decimal points lined up.',
        working: [
          `Line up the points and add: ${items.map((it) => it[1].toFixed(2)).join(' + ')}.`,
          `Total = <b>${N.money(total)}</b>.`,
        ],
        finalAnswer: N.money(total), skill: 'add-sub',
      };
    }
    if (t === 'change') {
      const note = level === 1 ? 10 : R.pick([20, 50]);
      const cost = level === 1 ? decimal(1.5, 9.5, 1) : decimal(5, note - 2, 2);
      const change = N.round(note - cost, 2);
      return {
        prompt: `A shopping bill comes to ${N.money(cost)}. ${R.pick(kidNames)} pays with a $${note} note. How much change should there be?`,
        answer: numAns(change, { unit: '$' }),
        hint: `Change = ${note}.00 − ${cost.toFixed(2)}. Line up the decimal points.`,
        working: [
          `Write $${note} as ${note}.00 so the decimal places match.`,
          `${note}.00 − ${cost.toFixed(2)} = ${change.toFixed(2)}.`,
          `Change: <b>${N.money(change)}</b>.`,
        ],
        finalAnswer: N.money(change), skill: 'add-sub',
      };
    }
    if (t === 'fuel') {
      const price = R.pick([2.4, 2.5, 2.6, 2.8, 3.0, 3.2]);
      const litres = level === 3 ? decimal(20.5, 50.5, 1) : R.int(20, 50);
      const cost = N.round((toInt(litres) * toInt(price)) / Math.pow(10, places(litres) + places(price)), 2);
      return {
        prompt: `Petrol costs ${N.money(price)} per litre. How much does it cost to fill a car with ${f(litres)} litres?`,
        answer: numAns(cost, { unit: '$' }),
        hint: `Cost = ${f(litres)} × ${f(price)}. Multiply without the points, then count the decimal places.`,
        working: [
          `${f(litres)} × ${f(price)}: ignore the points and multiply ${toInt(litres)} × ${toInt(price)} = ${toInt(litres) * toInt(price)}.`,
          `Count decimal places: ${places(litres)} + ${places(price)} = ${places(litres) + places(price)}, so put the point back there.`,
          `Cost = <b>${N.money(cost)}</b>.`,
        ],
        finalAnswer: N.money(cost), skill: 'mul-dec',
      };
    }
    if (t === 'length') {
      if (R.chance(0.5)) {
        const pieces = level === 1 ? R.int(2, 4) : R.int(3, 8);
        const each = level === 1 ? decimal(0.5, 3, 1) : decimal(0.25, 2.5, 2);
        const total = N.round(each * pieces, 2);
        return {
          prompt: `A ribbon is ${f(total)} m long. It is cut into ${pieces} equal pieces. How long is each piece?`,
          answer: numAns(each, { unit: 'm' }),
          hint: `Each piece = ${f(total)} ÷ ${pieces}. Keep the decimal point in line.`,
          working: [`${f(total)} ÷ ${pieces} = ${f(each)}.`, `Check: ${f(each)} × ${pieces} = ${f(total)}.`, `Each piece is <b>${f(each)} m</b>.`],
          finalAnswer: `${f(each)} m`, skill: 'div-whole',
        };
      }
      const days = level === 1 ? 2 : 3;
      const runs = Array.from({ length: days }, () => decimal(1.5, level === 3 ? 8.5 : 5, level === 3 ? 2 : 1));
      const total = N.round(runs.reduce((s, x) => s + x, 0), 2);
      const who = R.pick(kidNames);
      const listed = runs.map((x) => `${f(x)} km`).join(', ').replace(/, ([^,]*)$/, ' and $1');
      return {
        prompt: `${who} ran ${listed} on ${days === 2 ? 'two' : 'three'} different days. How far did ${who} run altogether?`,
        answer: numAns(total, { unit: 'km' }),
        hint: 'Add the distances with the decimal points lined up.',
        working: [`${runs.map(f).join(' + ')} = ${f(total)}.`, `Total distance: <b>${f(total)} km</b>.`],
        finalAnswer: `${f(total)} km`, skill: 'add-sub',
      };
    }
    // share a cost
    const people = level === 1 ? R.int(2, 4) : R.int(3, 6);
    const each = level === 1 ? R.int(2, 9) + R.pick([0.5, 0]) : decimal(3.25, 15, 2);
    const total = N.round(each * people, 2);
    return {
      prompt: `${people} friends share a pizza bill of ${N.money(total)} equally. How much does each person pay?`,
      answer: numAns(each, { unit: '$' }),
      hint: `Each share = ${f(total)} ÷ ${people}.`,
      working: [`${f(total)} ÷ ${people} = ${f(each)}.`, `Check: ${f(each)} × ${people} = ${f(total)}.`, `Each person pays <b>${N.money(each)}</b>.`],
      finalAnswer: N.money(each), skill: 'div-whole',
    };
  }

  HL.registerTopic({
    id: 'decimals-ops', subject: 'maths', strand: 'number', order: 10,
    name: 'Decimal calculations', short: 'Decimals + − × ÷',
    blurb: 'Adding, subtracting, multiplying and dividing numbers with decimal points.',
    example: '3.6 + 2.75 = 6.35 &nbsp;·&nbsp; 0.4 × 0.3 = 0.12',
    animal: 'dog',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', GREY = '#9A8A98';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const M = (id, c) => `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      /** column grid with the points lined up. cols like ['T','O','.','t','h']; rows of digits ('(0)' = a filled gap shown grey); last row = answer.
       *  o.op '+'|'−'; o.carry [[col, digit]] small digit above row 0; o.borrow [[col, newDigit]] strikes row-0 digit; o.one [col] small 1 in front of a row-0 digit */
      const grid = (x0, top, cols, rows, o = {}) => {
        let x = x0; const cx = cols.map((c) => { const w = c === '.' ? 16 : 30; const m = x + w / 2; x += w; return m; });
        const right = x, pi = cols.indexOf('.'), last = rows.length - 1;
        const base = (ri) => top + 44 + ri * 30 + (ri === last ? 8 : 0);
        let s = `<rect x="${cx[pi] - 8}" y="${top}" width="16" height="${base(last) - top + 6}" fill="#F9A8C9" opacity=".55"/>`;
        cols.forEach((c, ci) => { if (c !== '.') s += T(cx[ci], top + 14, c, GREY, 'font-size="13"'); });
        rows.forEach((r, ri) => r.forEach((d, ci) => {
          if (d === '') return;
          const gap = d === '(0)';
          s += T(cx[ci], base(ri), gap ? '0' : d, ri === last ? GREEN : gap ? GREY : INK, 'font-size="18"');
        }));
        s += `<text x="${x0 - 16}" y="${base(last - 1)}" fill="${INK}" font-size="18">${o.op || '+'}</text>`;
        s += `<line x1="${x0 - 4}" y1="${base(last - 1) + 10}" x2="${right + 2}" y2="${base(last - 1) + 10}" stroke="${INK}" stroke-width="2"/>`;
        (o.carry || []).forEach(([ci, d]) => { s += T(cx[ci] + 9, base(0) - 16, d, ROSE, 'font-size="13"'); });
        (o.borrow || []).forEach(([ci, d]) => { const b = base(0), c = cx[ci]; s += `<line x1="${c - 8}" y1="${b + 2}" x2="${c + 8}" y2="${b - 16}" stroke="${ROSE}" stroke-width="2"/>` + T(c + 11, b - 18, d, ROSE, 'font-size="13"'); });
        (o.one || []).forEach((ci) => { s += T(cx[ci] - 11, base(0) - 8, '1', ROSE, 'font-size="13"'); });
        return s;
      };
      /** the "count the decimal places" picture for 0.4 × 0.3, centred on cx0 */
      const mul = (cx0, top) => [
        T(cx0 - 38, top + 20, '0.4', INK, 'font-size="22"'), T(cx0, top + 20, '×', INK, 'font-size="22"'), T(cx0 + 38, top + 20, '0.3', INK, 'font-size="22"'),
        `<line x1="${cx0 - 32}" y1="${top + 26}" x2="${cx0 - 20}" y2="${top + 26}" stroke="${ROSE}" stroke-width="3"/>`,
        `<line x1="${cx0 + 44}" y1="${top + 26}" x2="${cx0 + 56}" y2="${top + 26}" stroke="${ROSE}" stroke-width="3"/>`,
        T(cx0 - 38, top + 44, '1 place', ROSE, 'font-size="13"'), T(cx0 + 38, top + 44, '1 place', ROSE, 'font-size="13"'),
        T(cx0, top + 76, '4 × 3 = 12', BLUE, 'font-size="16"'),
        T(cx0, top + 102, '1 + 1 = 2 places', ROSE, 'font-size="13"'),
        T(cx0, top + 138, '0.12', GREEN, 'font-size="24"'),
        T(cx0, top + 160, '2 places ✓', ROSE, 'font-size="13"'),
      ].join('');
      return {
        what: '<p>Decimals are numbers with a <b>decimal point</b>, like 3.6 or 12.75 — money, lengths and petrol all use them. The point is the <b>wall between the whole part and the parts</b> (dollars | cents, metres | centimetres). Every decimal rule is really about keeping that wall in the right place.</p>',
        visual: S(360, 200, `
          ${T(88, 14, 'points lined up ↓', ROSE, 'font-size="13"')}
          ${grid(20, 20, ['T', 'O', '.', 't', 'h'], [['', '5', '.', '7', '(0)'], ['1', '2', '.', '8', '5'], ['1', '8', '.', '5', '5']], { carry: [[1, '1']] })}
          ${T(88, 168, '5.7 → 5.70', ROSE, 'font-size="13"')}${T(88, 186, 'fill the gap with 0', INK, 'font-size="13"')}
          <line x1="184" y1="10" x2="184" y2="190" stroke="#C9B8F2" stroke-width="2" stroke-dasharray="4 4"/>
          ${mul(272, 20)}
        `),
        facts: [
          '<b>+ or −</b>: line up the <b>points</b>, fill gaps with 0, then work like whole numbers',
          '<b>×</b>: ignore the points, multiply, then <b>count the decimal places</b> (both numbers together)',
          '<b>÷ by a whole number</b>: the point in the answer sits <b>directly above</b> the point below',
          '<b>÷ by a decimal</b>: × 10 (or 100) <b>both</b> numbers first: 9.6 ÷ 0.3 = 96 ÷ 3',
          '× 0.1 = ÷ 10 &nbsp;·&nbsp; × 0.01 = ÷ 100 &nbsp;·&nbsp; ÷ 0.1 = × 10',
          '0.3 × 0.3 = <b>0.09</b>, not 0.9 — the answer gets <b>more</b> places',
          '<b>Recurring decimal</b>: the dot means that digit repeats for ever. 1 ÷ 3 = <b>0.3&#775;</b> = 0.3333…',
          '<b>Rounding a division</b>: work out <b>one extra</b> decimal place, then round it (5 or more → up)',
        ],
        steps: [
          '<b>Adding or subtracting</b>: say "points under points". Write the numbers under each other with the <b>points lined up</b>, fill gaps with 0, then add or subtract like whole numbers (carry or borrow as usual).',
          '<b>Multiplying</b>: say "ignore the points, multiply, count the places". Multiply the whole numbers, then count the decimal places in the question (<b>both</b> numbers) and put that many in the answer.',
          '<b>Dividing by a whole number</b>: short division, and the point in the answer goes <b>straight up</b> above the point in the question.',
          '<b>Dividing by a decimal</b>: say "make the divider whole". Multiply <b>both</b> numbers by 10 (or 100) until you divide by a whole number: 4.8 ÷ 0.4 = 48 ÷ 4 = 12.',
          '<b>× 0.1</b> is ÷ 10, <b>× 0.01</b> is ÷ 100. <b>÷ 0.1</b> is × 10, <b>÷ 0.01</b> is × 100.',
        ],
        examples: [
          { q: '3.25 + 4.8', working: ['<b>Picture:</b> money. The point is the wall between <b>dollars</b> and <b>cents</b>: $3.25 + $4.80.', '1. Are the points lined up? I write 4.8 under 3.25 with the <b>points under each other</b>.', '2. Any gaps? Yes — 4.8 has no hundredths, so I write 4.8<b>0</b>.', '3. Now add like whole numbers: 5 + 0 = 5, 2 + 8 = 10 (write 0, carry 1), 3 + 4 + 1 = 8.', '3.25 + 4.80 = 8.05'], a: '8.05',
            visual: S(180, 150, `${grid(36, 6, ['O', '.', 't', 'h'], [['3', '.', '2', '5'], ['4', '.', '8', '(0)'], ['8', '.', '0', '5']], { carry: [[0, '1']] })}${T(90, 140, '4.8 → 4.80', ROSE, 'font-size="13"')}`) },
          { q: '8.4 − 2.75', working: ['<b>Picture:</b> money. I have $8.40 and spend $2.75 — dollars under dollars, cents under cents.', '1. Points lined up? Yes. Gaps? 8.4 becomes 8.4<b>0</b>.', '2. Hundredths: 0 − 5 can\'t do, so I <b>borrow</b> from the 4 (it becomes 3): 10 − 5 = 5.', '3. Tenths: 3 − 7 can\'t do, so I borrow from the 8 (it becomes 7): 13 − 7 = 6.', '4. Ones: 7 − 2 = 5.', '8.40 − 2.75 = 5.65'], a: '5.65',
            visual: S(180, 150, `${grid(36, 6, ['O', '.', 't', 'h'], [['8', '.', '4', '(0)'], ['2', '.', '7', '5'], ['5', '.', '6', '5']], { op: '−', borrow: [[0, '7'], [2, '3']], one: [2, 3] })}${T(90, 140, 'borrow: 4 → 3, 8 → 7', ROSE, 'font-size="13"')}`) },
          { q: '0.4 × 0.3', working: ['<b>Picture:</b> knock the wall down, multiply, then <b>rebuild the wall</b> by counting places.', '1. Ignore the points: 4 × 3 = 12.', '2. How many decimal places in the question? 0.4 has 1, 0.3 has 1 → <b>2 places</b> altogether.', '3. So the answer needs 2 places: 12 → 0.12.', '0.4 × 0.3 = 0.12'], a: '0.12',
            visual: S(200, 186, mul(100, 14)) },
          { q: '2.6 × 1.5', working: ['<b>Picture:</b> knock the wall down, multiply, count places, rebuild.', '1. Ignore the points: 26 × 15 = 390.', '2. Places in the question? 2.6 has 1, 1.5 has 1 → 2 places.', '3. 390 with 2 places → 3.90, which is 3.9.', '2.6 × 1.5 = 3.9'], a: '3.9' },
          { q: '7.2 ÷ 4', working: ['<b>Picture:</b> sharing $7.20 between 4 people — the wall stays exactly where it is.', '1. Am I dividing by a whole number? Yes (4), so short division, point <b>straight above</b>.', '2. 4 into 7 = 1 remainder 3. Write 1, carry the 3 to make 32.', '3. 4 into 32 = 8. Write 8 after the point.', '7.2 ÷ 4 = 1.8'], a: '1.8',
            visual: S(330, 92, `<text x="14" y="66" font-size="20" fill="${INK}">4</text><path d="M44 80 q-8 -20 0 -40 h96" stroke="${INK}" stroke-width="2" fill="none"/>
              ${T(60, 66, '7', INK, 'font-size="20"')}${T(80, 66, '.', INK, 'font-size="20"')}${T(102, 66, '2', INK, 'font-size="20"')}${T(90, 54, '3', ROSE, 'font-size="13"')}
              ${T(60, 30, '1', GREEN, 'font-size="20"')}${T(80, 30, '.', GREEN, 'font-size="20"')}${T(102, 30, '8', GREEN, 'font-size="20"')}
              <line x1="80" y1="8" x2="80" y2="86" stroke="${ROSE}" stroke-width="2" stroke-dasharray="4 3"/>
              <text x="152" y="44" fill="${ROSE}" font-size="13">point sits straight</text><text x="152" y="62" fill="${ROSE}" font-size="13">above the point</text>`) },
          { q: '1 ÷ 3 as a decimal, and then to 2 decimal places',
            working: ['<b>Picture:</b> one pizza shared between 3 people. It never divides evenly — the 3s go on for ever.', '1. Does it stop? 1 ÷ 3 = 0.3333333… <b>No</b>, it never stops. That is a <b>recurring</b> decimal.', '2. Short way to write it: put a <b>dot</b> above the repeating digit → 0.3&#775;', '3. To 2 decimal places: keep 0.33, and the next digit is 3, so it stays.', '1 ÷ 3 = 0.3&#775; = 0.33 (2 dp)'], a: '0.3&#775; &nbsp;→&nbsp; 0.33 (2 dp)',
            visual: S(320, 100, `${T(160, 32, '1 ÷ 3 = 0.3333333…', INK, 'font-size="20"')}
              <text x="152" y="70" text-anchor="end" font-size="28" fill="${ROSE}">0.</text><text x="154" y="70" text-anchor="start" font-size="28" fill="${ROSE}">3</text><circle cx="162" cy="41" r="4" fill="${ROSE}"/>
              ${T(160, 94, 'the dot means the 3 repeats for ever', GREY, 'font-size="13"')}`) },
          { q: '47 ÷ 6, to 2 decimal places',
            working: ['<b>Picture:</b> $47 shared between 6 people. Money only goes to 2 decimal places (cents), so I must round.', '1. Divide: 6 into 47 = 7 remainder 5 → 7.8333…', '2. How many places do I need? <b>2</b>. So I write 7.83 and look at the <b>next</b> digit.', '3. The next digit is 3. Is it 5 or more? <b>No</b>, so 7.83 stays.', '47 ÷ 6 = 7.83 (2 dp)'], a: '7.83',
            visual: S(320, 112, `
              ${[[60, '7'], [80, '.'], [104, '8'], [136, '3'], [176, '3'], [208, '3'], [240, '…']].map(([x, d]) => T(x, 52, d, INK, 'font-size="26"')).join('')}
              <line x1="156" y1="20" x2="156" y2="62" stroke="${ROSE}" stroke-width="2" stroke-dasharray="4 3"/>
              ${T(102, 18, 'keep 2 dp', BLUE, 'font-size="13"')}${T(212, 18, 'the rest goes', GREY, 'font-size="13"')}
              ${T(198, 82, 'next digit is 3 → round down', ROSE, 'font-size="13"')}
              ${T(160, 106, '47 ÷ 6 = 7.83', GREEN, 'font-size="16"')}`) },
          { q: 'Harper buys 3 pies at $4.50 each and a juice for $2.75. How much does she pay?', working: ['<b>Picture:</b> money at the tuck shop — dollars | cents.', '1. What do I need first? The pies: 3 × 4.50. Ignore the point: 3 × 450 = 1350, 2 places → 13.50.', '2. Now add the juice, points lined up: 13.50 + 2.75.', '3. 0 + 5 = 5, 5 + 7 = 12 (write 2, carry 1), 3 + 2 + 1 = 6, 1 + 0 = 1 → 16.25.', 'Does it make sense? 3 pies ≈ $13.50 plus about $3 ≈ $16. Yes!'], a: '$16.25' },
        ],
        tips: [
          'Money check: $3.50 + $2.25 must be about $5 or $6. If you get $57.5 the point is in the wrong place.',
          'When multiplying, the answer usually has MORE decimal places than either number. 0.3 × 0.3 = 0.09, not 0.9.',
          'Dividing by a number less than 1 makes the answer BIGGER (8 ÷ 0.5 = 16). That is normal — how many halves in 8?',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
