/* Topic: Money & budgeting — totals, change, splitting bills, wages, budgets, saving, receipts, discounts.
 * Every figure is built from whole numbers of CENTS so there is never any float noise. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', INK = '#4A3B48';

  const M = (c) => N.money(c / 100);              // cents -> "$4.50"
  const D = (c) => N.round(c / 100, 2);           // cents -> 4.5
  const sum = (a) => a.reduce((x, y) => x + y, 0);

  /** money answer built from whole cents (exact to the cent) */
  function money(cents, extra) {
    const v = D(cents);
    const a = { type: 'number', value: v, unit: '$' };
    if (!Number.isInteger(v)) a.tolerance = 0.005;
    return Object.assign(a, extra || {});
  }
  function plainAns(v, unit) {
    const a = { type: 'number', value: v };
    if (unit) a.unit = unit;
    if (!Number.isInteger(v)) a.tolerance = 0.005;
    return a;
  }
  /** NZ cash rounding: to the nearest 10c */
  const roundCash = (c) => Math.round(c / 10) * 10;

  function choiceQ(prompt, visual, options, correct, hint, working, skill) {
    const order = R.shuffle(options.map((_, i) => i));
    return {
      prompt, visual,
      answer: { type: 'choice', value: order.indexOf(correct), choices: order.map((i) => options[i]) },
      hint, working, finalAnswer: options[correct], skill,
    };
  }

  const NAMES = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby', 'Sione'];
  const andList = (a) => (a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
  const tbl = (r) => `<table class="data">${r}</table>`;
  const priceRows = (lines) => lines.map(([n2, v]) => `<tr><td style="text-align:left">${n2}</td><td>${v}</td></tr>`).join('');
  const receiptTable = (title, lines, foot) =>
    tbl(`<tr><th colspan="2">${title}</th></tr>${priceRows(lines)}${foot || ''}`);
  const totalRow = (label, v, colour) =>
    `<tr><th style="text-align:left">${label}</th><th style="color:${colour || ROSE}">${v}</th></tr>`;

  // ---------------------------------------------------------------- shops
  const SHOPS = [
    { at: 'the school canteen', till: 'CANTEEN', items: [['a mince pie', 380, 520], ['a juice', 240, 340], ['a muffin', 220, 320], ['a sushi pack', 500, 700], ['a milk', 200, 300], ['hot chips', 300, 420]] },
    { at: 'the dairy', till: 'DAIRY', items: [['a bag of chips', 260, 400], ['an ice block', 180, 260], ['a fizzy drink', 300, 440], ['a chocolate bar', 240, 360], ['a loaf of bread', 320, 480], ['a pie', 400, 560]] },
    { at: 'Countdown', till: 'COUNTDOWN', items: [['milk', 340, 480], ['bread', 320, 460], ['bananas', 280, 400], ['cheese', 820, 1240], ['a dozen eggs', 700, 980], ['apples', 400, 620]] },
    { at: 'The Warehouse', till: 'THE WAREHOUSE', items: [['a T-shirt', 1200, 1900], ['socks', 600, 980], ['a notebook', 350, 560], ['a drink bottle', 900, 1500], ['a phone case', 1500, 2300], ['a beanie', 800, 1400]] },
  ];
  const buy = (shop, n, step) => R.sample(shop.items, n).map((it) => [it[0], R.step(it[1], it[2], step || 5)]);
  const noteFor = (total) => [2000, 5000, 10000].find((v) => v >= total + 100) || 10000;

  // ------------------------------------------------- 1. totals and change
  function shopTotal(level) {
    const shop = R.pick(SHOPS);
    const items = buy(shop, level === 1 ? 2 : level === 2 ? 3 : 4);
    const total = sum(items.map((i) => i[1]));
    return {
      prompt: `Add up this shopping at ${shop.at}. What is the total?`,
      visual: receiptTable(shop.till, items.map(([n2, c]) => [n2, M(c)]), totalRow('TOTAL', '?')),
      answer: money(total),
      hint: 'Write the prices under each other with the decimal points lined up, then add.',
      working: [
        `${items.map((i) => M(i[1])).join(' + ')}`,
        'Line up the decimal points and add the cents first.',
        `Total: <b>${M(total)}</b>.`,
      ],
      finalAnswer: M(total), skill: 'total',
    };
  }

  function changeQ(level, isWord) {
    const shop = R.pick(SHOPS);
    const items = buy(shop, level === 1 ? 2 : level === 2 ? 3 : 4);
    const total = sum(items.map((i) => i[1]));
    const note = noteFor(total);
    const change = note - total;
    const who = R.pick(NAMES);
    if (isWord) {
      return {
        prompt: `${who} buys ${andList(items.map(([n2, c]) => `${n2} (${M(c)})`))} at ${shop.at}. ${who} pays with a ${M(note)} note. How much change does ${who} get?`,
        answer: money(change),
        hint: 'First add up what the shopping cost. Then take that away from the note.',
        working: [
          `Cost: ${items.map((i) => M(i[1])).join(' + ')} = ${M(total)}.`,
          'Change = what you gave − what it cost.',
          `${M(note)} − ${M(total)} = ${M(change)}.`,
          `Change: <b>${M(change)}</b>.`,
        ],
        finalAnswer: M(change), skill: 'change',
      };
    }
    return {
      prompt: `The shopping below comes to ${M(total)}. You pay with a ${M(note)} note. How much change do you get?`,
      visual: receiptTable(shop.till, items.map(([n2, c]) => [n2, M(c)]), totalRow('TOTAL', M(total)) + totalRow('you paid', M(note), BLUE)),
      answer: money(change),
      hint: `Change = what you gave − what it cost, so work out ${M(note)} − ${M(total)}.`,
      working: [
        'Change = what you gave − what it cost.',
        `${M(note)} − ${M(total)}, decimal points lined up.`,
        `Change: <b>${M(change)}</b>.`,
      ],
      finalAnswer: M(change), skill: 'change',
    };
  }

  /** cash rounding to the nearest 10c (level 2 = the rounded total, level 3 = the change as well) */
  function cashRoundQ(level, isWord) {
    const shop = R.pick(SHOPS);
    const items = buy(shop, level === 1 ? 2 : 3, 1);
    let total = sum(items.map((i) => i[1]));
    if (total % 10 === 0 || total % 10 === 5) { items[0][1] += 3; total += 3; }
    const d = total % 10;
    const rounded = roundCash(total);
    const note = noteFor(rounded);
    const change = note - rounded;
    const who = R.pick(NAMES);
    const roundLine = `The cents end in ${d}c, so it rounds ${d < 5 ? 'down' : 'up'} to <b>${M(rounded)}</b>.`;
    if (level >= 3) {
      return {
        prompt: isWord
          ? `${who} spends ${M(total)} at ${shop.at} and pays with a ${M(note)} note in cash. Cash totals round to the nearest 10c. How much change does ${who} get?`
          : `A shopping total is ${M(total)}. It is paid in cash, so it rounds to the nearest 10c. The note handed over is ${M(note)}. How much change comes back?`,
        answer: money(change),
        hint: 'Round the total to the nearest 10c first, then take it away from the note.',
        working: [
          'Cash payments round to the nearest 10c.',
          roundLine,
          `Change = ${M(note)} − ${M(rounded)} = ${M(change)}.`,
          `Change: <b>${M(change)}</b>.`,
        ],
        finalAnswer: M(change), skill: 'cash-round',
      };
    }
    return {
      prompt: isWord
        ? `${who} buys ${andList(items.map((i) => i[0]))} at ${shop.at}. The till says ${M(total)}. ${who} pays with cash, so the total is rounded to the nearest 10c. How much does ${who} pay?`
        : `A till total is ${M(total)}. The customer pays in <b>cash</b>, so the total rounds to the nearest 10c. How much is paid?`,
      visual: receiptTable(shop.till, items.map(([n2, c]) => [n2, M(c)]), totalRow('TOTAL', M(total)) + totalRow('cash rounded', '?', GREEN)),
      answer: money(rounded),
      hint: 'Look at the last digit. 1c to 4c rounds down, 6c to 9c rounds up.',
      working: [
        'Cash payments round to the nearest 10c; card payments do not.',
        roundLine,
        `Cash to pay: <b>${M(rounded)}</b>.`,
      ],
      finalAnswer: M(rounded), skill: 'cash-round',
    };
  }

  // ------------------------------------------------------ 2. splitting a bill
  const BILLS = ['fish and chips', 'a pizza order', 'a taxi from the airport', 'a birthday present for the teacher', 'dinner out', 'a camp ground booking'];
  function splitQ(level, isWord) {
    const n = level === 1 ? R.pick([2, 3, 4]) : level === 2 ? R.pick([3, 4, 5]) : R.pick([3, 4, 6, 7]);
    const what = R.pick(BILLS);
    if (level < 3) {
      const each = level === 1 ? 100 * R.int(4, 15) : R.step(450, 2400, 25);
      const total = each * n;
      return {
        prompt: isWord
          ? `${n} friends share ${what} costing ${M(total)}. They split it equally. How much does each one pay?`
          : `A bill of ${M(total)} is split equally between ${n} people. How much does each person pay?`,
        answer: money(each),
        hint: `Share it out: ${M(total)} ÷ ${n}.`,
        working: [
          `Split equally means divide: ${M(total)} ÷ ${n}.`,
          `${M(total)} ÷ ${n} = ${M(each)}.`,
          `Each person pays <b>${M(each)}</b>.`,
        ],
        finalAnswer: M(each), skill: 'split',
      };
    }
    // level 3: does not divide evenly
    const base = R.int(650, 2400);
    const extra = R.int(1, Math.min(3, n - 1));
    const total = base * n + extra;
    const covered = base * n;
    if (R.chance(0.5)) {
      return {
        prompt: isWord
          ? `${n} friends split ${what} costing ${M(total)} equally. It does not divide evenly, so they each pay the amount rounded <b>down</b> to the nearest cent. How much is that each?`
          : `${M(total)} is split equally between ${n} people. It does not divide evenly. Rounded <b>down</b> to the nearest cent, how much does each person pay?`,
        answer: money(base),
        hint: `Do ${M(total)} ÷ ${n} and then cut the answer off after 2 decimal places.`,
        working: [
          `${M(total)} ÷ ${n} = $${(total / n).toFixed(4)}...`,
          `Money only goes to the cent, so cut it after 2 decimal places: <b>${M(base)}</b>.`,
          `Check: ${n} × ${M(base)} = ${M(covered)}, which is ${M(extra)} short, so one person covers the extra ${extra}c.`,
        ],
        finalAnswer: M(base), skill: 'split-uneven',
      };
    }
    return {
      prompt: isWord
        ? `${n} friends split ${what} costing ${M(total)}. Each of them pays ${M(base)}, and one friend covers the leftover cents. How much does that friend pay?`
        : `${M(total)} is split between ${n} people. ${n - 1} of them pay ${M(base)} each and the last person covers the rest. How much does the last person pay?`,
      answer: money(base + extra),
      hint: `Work out what the ${n - 1} equal payments come to, then take that off the bill.`,
      working: [
        `${n - 1} people pay ${M(base)}: ${n - 1} × ${M(base)} = ${M(base * (n - 1))}.`,
        `Left to pay: ${M(total)} − ${M(base * (n - 1))} = ${M(base + extra)}.`,
        `The last person pays <b>${M(base + extra)}</b> (that is ${extra}c more than the others).`,
      ],
      finalAnswer: M(base + extra), skill: 'split-uneven',
    };
  }

  // --------------------------------------------------------------- 3. wages
  const RATES = [1400, 1450, 1500, 1600, 1620, 1750, 1800, 1900, 2000, 2200, 2350, 2400];
  const JOBS = ['walking dogs', 'stacking shelves at the dairy', 'mowing lawns', 'babysitting', 'washing cars', 'delivering pamphlets', 'working at the garden centre', 'helping at the fruit shop'];
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function wagePay(level, isWord) {
    const who = R.pick(NAMES), job = R.pick(JOBS);
    const rate = level === 1 ? R.pick([1200, 1400, 1500, 1600, 1800, 2000]) : R.pick(RATES);
    const hours = level === 1 ? R.int(3, 8) : R.pick([5, 6, 7, 8, 9, 10, 12, 4.5, 6.5, 7.5]);
    const pay = rate * hours;
    return {
      prompt: isWord
        ? `${who} earns ${M(rate)} an hour ${job}. ${who} works ${hours} hours. How much does ${who} earn?`
        : `Pay = hours × rate. Work out the pay for ${hours} hours at ${M(rate)} an hour.`,
      answer: money(pay),
      hint: 'Pay = hours × rate.',
      working: [
        'Pay = hours × rate.',
        `${hours} × ${M(rate)} = ${M(pay)}.`,
        `Pay: <b>${M(pay)}</b>.`,
      ],
      finalAnswer: M(pay), skill: 'wages',
    };
  }

  function wageWeek(level, isWord) {
    const who = R.pick(NAMES), job = R.pick(JOBS);
    const nD = level === 1 ? 3 : level === 2 ? 4 : 5;
    const days = DAYS.slice(0, nD);
    const hrs = days.map(() => R.pick([2, 2.5, 3, 3.5, 4, 4.5, 5]));
    const totalH = sum(hrs);
    const rate = R.pick(RATES);
    const pay = rate * totalH;
    const visual = tbl(`<tr><th>Day</th>${days.map((d) => `<th>${d}</th>`).join('')}<th>Total</th></tr><tr><th>Hours</th>${hrs.map((h) => `<td>${h}</td>`).join('')}<td>?</td></tr>`);
    if (R.chance(0.35)) {
      return {
        prompt: `${who} works these hours ${job}. How many hours altogether?`,
        visual,
        answer: plainAns(totalH, 'hours'),
        hint: 'Add the daily hours. Two halves make one whole hour.',
        working: [`${hrs.join(' + ')} = ${totalH}.`, `<b>${totalH} hours</b> altogether.`],
        finalAnswer: `${totalH} hours`, skill: 'wages-week',
      };
    }
    return {
      prompt: `${who} is paid ${M(rate)} an hour ${job}. Use the timesheet to work out the pay for the week.`,
      visual,
      answer: money(pay),
      hint: `Add the hours first, then multiply by ${M(rate)}.`,
      working: [
        `Hours: ${hrs.join(' + ')} = ${totalH} hours.`,
        'Pay = hours × rate.',
        `${totalH} × ${M(rate)} = ${M(pay)}.`,
        `Week's pay: <b>${M(pay)}</b>.`,
      ],
      finalAnswer: M(pay), skill: 'wages-week',
    };
  }

  function overtimeQ(level, isWord) {
    const who = R.pick(NAMES), job = R.pick(JOBS);
    const rate = R.pick(RATES);
    const normal = R.pick([30, 35, 37.5, 38, 40]);
    const ot = R.int(2, 6);
    const otRate = rate * 1.5;
    const normalPay = rate * normal, otPay = otRate * ot, pay = normalPay + otPay;
    const visual = tbl(`<tr><th></th><th>Hours</th><th>Rate</th><th>Pay</th></tr>` +
      `<tr><th>normal</th><td>${normal}</td><td>${M(rate)}</td><td>?</td></tr>` +
      `<tr><th>overtime</th><td>${ot}</td><td>?</td><td>?</td></tr>`);
    if (R.chance(0.3)) {
      return {
        prompt: `${who} is paid ${M(rate)} an hour. Overtime is paid at <b>time-and-a-half</b>. What is the overtime rate per hour?`,
        answer: money(otRate),
        hint: 'Time-and-a-half means the rate × 1.5.',
        working: ['Overtime at time-and-a-half = rate × 1.5.', `${M(rate)} × 1.5 = ${M(otRate)}.`, `Overtime rate: <b>${M(otRate)}</b> an hour.`],
        finalAnswer: `${M(otRate)} an hour`, skill: 'overtime',
      };
    }
    return {
      prompt: isWord
        ? `${who} works ${normal} hours ${job} at ${M(rate)} an hour, plus ${ot} hours of overtime at time-and-a-half. What is the total pay?`
        : `${normal} hours at ${M(rate)} an hour, plus ${ot} hours of overtime at time-and-a-half. Work out the total pay.`,
      visual,
      answer: money(pay),
      hint: 'Do the normal pay and the overtime pay separately, then add them.',
      working: [
        `Normal: ${normal} × ${M(rate)} = ${M(normalPay)}.`,
        `Overtime rate = rate × 1.5 = ${M(rate)} × 1.5 = ${M(otRate)}.`,
        `Overtime: ${ot} × ${M(otRate)} = ${M(otPay)}.`,
        `Total: ${M(normalPay)} + ${M(otPay)} = <b>${M(pay)}</b>.`,
      ],
      finalAnswer: M(pay), skill: 'overtime',
    };
  }

  function wageBackQ(level, isWord) {
    const who = R.pick(NAMES), job = R.pick(JOBS);
    const rate = R.pick(RATES);
    const hours = R.int(5, 24);
    const pay = rate * hours;
    if (R.chance(0.3)) {
      return {
        prompt: isWord
          ? `${who} earned ${M(pay)} for ${hours} hours ${job}. What is the hourly rate?`
          : `Total pay ${M(pay)} for ${hours} hours. Work out the pay per hour.`,
        answer: money(rate),
        hint: 'Pay = hours × rate, so rate = pay ÷ hours.',
        working: [`Rate = pay ÷ hours.`, `${M(pay)} ÷ ${hours} = ${M(rate)}.`, `Hourly rate: <b>${M(rate)}</b>.`],
        finalAnswer: `${M(rate)} an hour`, skill: 'wages-back',
      };
    }
    return {
      prompt: isWord
        ? `${who} is paid ${M(rate)} an hour ${job} and earned ${M(pay)} last week. How many hours did ${who} work?`
        : `Someone earned ${M(pay)} at ${M(rate)} an hour. How many hours did they work?`,
      answer: plainAns(hours, 'hours'),
      hint: 'Pay = hours × rate, so hours = pay ÷ rate.',
      working: [
        'Pay = hours × rate, so hours = pay ÷ rate.',
        `${M(pay)} ÷ ${M(rate)} = ${hours}.`,
        `<b>${hours} hours</b>.`,
      ],
      finalAnswer: `${hours} hours`, skill: 'wages-back',
    };
  }

  // -------------------------------------------------------------- 4. budget
  const BUDGETS = [
    { who: 'The Nikau family', per: 'week', cats: ['rent', 'food', 'power', 'petrol', 'phone'], lo: 8, hi: 60 },
    { who: 'The Taylor family', per: 'week', cats: ['rent', 'groceries', 'power', 'car', 'internet'], lo: 8, hi: 60 },
    { who: 'Harper', per: 'week', cats: ['snacks', 'phone credit', 'bus fares', 'saving', 'netball club'], lo: 1, hi: 4 },
    { who: 'The netball team', per: 'month', cats: ['uniforms', 'court hire', 'travel', 'balls'], lo: 8, hi: 40 },
  ];
  function pickPcts(n) {
    const opts = [5, 10, 15, 20, 25, 30, 35];
    for (let i = 0; i < 60; i++) {
      const p = R.sample(opts, n), s = sum(p);
      if (s >= 40 && s <= 85) return p;
    }
    return n === 3 ? [10, 20, 30] : [10, 15, 20, 25];
  }
  function budgetQ(level, isWord) {
    const b = R.pick(BUDGETS);
    const nC = level >= 3 ? 4 : 3;
    const income = 2000 * R.int(b.lo, b.hi);            // whole cents, a multiple of $20
    const pcts = pickPcts(nC);
    const cats = R.sample(b.cats, nC);
    const amounts = pcts.map((p) => (income * p) / 100);
    const spent = sum(amounts);
    const left = income - spent;
    const visual = tbl(
      `<tr><th colspan="2">${b.who} — ${b.per}ly budget</th></tr>` +
      `<tr><th style="text-align:left;color:${GREEN}">income</th><th style="color:${GREEN}">${M(income)}</th></tr>` +
      priceRows(cats.map((c, i) => [c, M(amounts[i])])));
    const type = level >= 3 ? R.pick(['left', 'pct', 'frac', 'balance']) : R.pick(['left', 'left', 'pct', 'frac']);
    if (type === 'pct') {
      const i = R.int(0, nC - 1);
      return {
        prompt: `Look at the budget. What percentage of the income goes on <b>${cats[i]}</b>?`,
        visual,
        answer: plainAns(pcts[i], '%'),
        hint: `Percentage = ${M(amounts[i])} ÷ ${M(income)} × 100.`,
        working: [
          `Part ÷ whole = ${M(amounts[i])} ÷ ${M(income)} = ${N.fmt(pcts[i] / 100)}.`,
          `× 100 to make it a percentage: ${pcts[i]}%.`,
          `<b>${pcts[i]}%</b> goes on ${cats[i]}.`,
        ],
        finalAnswer: `${pcts[i]}%`, skill: 'budget-pct',
      };
    }
    if (type === 'frac') {
      const i = R.int(0, nC - 1);
      const f = N.simplify(pcts[i], 100);
      return {
        prompt: `Look at the budget. What fraction of the income goes on <b>${cats[i]}</b>? Give it in simplest form.`,
        visual,
        answer: { type: 'fraction', value: f, placeholder: 'e.g. 3/10' },
        hint: `Write it as ${M(amounts[i])} out of ${M(income)}, then simplify.`,
        working: [
          `Part out of whole: ${N.fracHtml(amounts[i], income)} .`,
          `That is the same as ${N.fracHtml(pcts[i], 100)}.`,
          `Simplify: <b>${N.fracHtml(f.n, f.d)}</b>.`,
        ],
        finalAnswer: N.fracHtml(f.n, f.d), skill: 'budget-frac',
      };
    }
    if (type === 'balance') {
      let target = R.pick([90, 95, 100, 105, 110]);
      if (target - sum(pcts) < 5) target = sum(pcts) + 5;
      const lastPct = target - sum(pcts);
      const lastCat = b.cats.find((c) => cats.indexOf(c) < 0) || 'other bills';
      const lastAmt = (income * lastPct) / 100;
      const spent2 = spent + lastAmt, left2 = income - spent2;
      const visual2 = tbl(
        `<tr><th colspan="2">${b.who} — ${b.per}ly budget</th></tr>` +
        `<tr><th style="text-align:left;color:${GREEN}">income</th><th style="color:${GREEN}">${M(income)}</th></tr>` +
        priceRows(cats.map((c, i) => [c, M(amounts[i])]).concat([[lastCat, M(lastAmt)]])));
      const opts = [
        `It balances exactly, with nothing left over`,
        `There is ${M(Math.abs(left2) || 100)} left over`,
        `It is ${M(Math.abs(left2) || 100)} short`,
      ];
      const correct = left2 === 0 ? 0 : left2 > 0 ? 1 : 2;
      return choiceQ(
        `Look at the budget. Does it balance?`, visual2, opts, correct,
        'Add up all the expenses, then compare that with the income.',
        [
          `Expenses: ${M(spent2)}.`,
          `Money left over = income − expenses = ${M(income)} − ${M(spent2)} = ${left2 < 0 ? '−' + M(-left2) : M(left2)}.`,
          `<b>${opts[correct]}</b>.`,
        ], 'budget-balance');
    }
    return {
      prompt: `Look at the budget. How much money is left over ${b.per === 'week' ? 'each week' : 'each month'}?`,
      visual,
      answer: money(left),
      hint: 'Add up all the expenses first, then do income − expenses.',
      working: [
        `Expenses: ${amounts.map((a) => M(a)).join(' + ')} = ${M(spent)}.`,
        'Money left over = income − expenses.',
        `${M(income)} − ${M(spent)} = ${M(left)}.`,
        `Left over: <b>${M(left)}</b>.`,
      ],
      finalAnswer: M(left), skill: 'budget-left',
    };
  }

  // -------------------------------------------------------------- 5. saving
  const GOALS = [
    ['a mountain bike from The Warehouse', 24000, 48000],
    ['a pair of netball shoes', 9000, 18000],
    ['a skateboard', 12000, 22000],
    ['a second-hand phone', 15000, 36000],
    ['a school ski trip', 20000, 45000],
    ['a guitar', 18000, 40000],
    ['concert tickets', 8000, 16000],
  ];
  function saveQ(level, isWord) {
    const who = R.pick(NAMES);
    const g = R.pick(GOALS);
    const perWeek = level === 1 ? 100 * R.pick([5, 10]) : level === 2 ? 100 * R.pick([6, 8, 12, 15, 20]) : R.pick([1250, 1550, 1750, 2250, 2500]);
    const weeks = R.int(level === 1 ? 4 : 6, level === 1 ? 10 : 20);
    if (level >= 3) {
      const saved = 100 * R.int(20, 90);
      const goal = saved + perWeek * weeks;
      if (R.chance(0.4)) {
        const n = R.int(3, weeks - 1);
        const after = saved + perWeek * n;
        return {
          prompt: `${who} already has ${M(saved)} saved for ${g[0]} and puts away ${M(perWeek)} a week. How much is saved after ${n} more weeks?`,
          answer: money(after),
          hint: `Work out ${n} × ${M(perWeek)} and add the money already saved.`,
          working: [
            `${n} weeks of saving: ${n} × ${M(perWeek)} = ${M(perWeek * n)}.`,
            `Add what was already there: ${M(saved)} + ${M(perWeek * n)} = ${M(after)}.`,
            `Saved: <b>${M(after)}</b>.`,
          ],
          finalAnswer: M(after), skill: 'saving',
        };
      }
      return {
        prompt: `${g[0][0].toUpperCase() + g[0].slice(1)} costs ${M(goal)}. ${who} has ${M(saved)} saved and adds ${M(perWeek)} a week. How many more weeks until ${who} can buy it?`,
        answer: plainAns(weeks, 'weeks'),
        hint: 'First work out how much more is needed, then divide by the weekly amount.',
        working: [
          `Still needed: ${M(goal)} − ${M(saved)} = ${M(goal - saved)}.`,
          `Weeks = ${M(goal - saved)} ÷ ${M(perWeek)} = ${weeks}.`,
          `<b>${weeks} weeks</b>.`,
        ],
        finalAnswer: `${weeks} weeks`, skill: 'saving',
      };
    }
    if (R.chance(0.4)) {
      const n = R.int(3, weeks);
      return {
        prompt: isWord
          ? `${who} saves ${M(perWeek)} of pocket money every week. How much is saved after ${n} weeks?`
          : `Saving ${M(perWeek)} a week. How much is saved after ${n} weeks?`,
        answer: money(perWeek * n),
        hint: 'Multiply the weekly amount by the number of weeks.',
        working: [`${n} × ${M(perWeek)} = ${M(perWeek * n)}.`, `Saved: <b>${M(perWeek * n)}</b>.`],
        finalAnswer: M(perWeek * n), skill: 'saving',
      };
    }
    const goal = perWeek * weeks;
    return {
      prompt: isWord
        ? `${who} is saving for ${g[0]} which costs ${M(goal)}. ${who} saves ${M(perWeek)} a week. How many weeks will it take?`
        : `A goal of ${M(goal)}, saving ${M(perWeek)} a week. How many weeks does it take?`,
      answer: plainAns(weeks, 'weeks'),
      hint: `How many lots of ${M(perWeek)} fit into ${M(goal)}? Divide.`,
      working: [
        `Weeks = goal ÷ amount each week.`,
        `${M(goal)} ÷ ${M(perWeek)} = ${weeks}.`,
        `It takes <b>${weeks} weeks</b>.`,
      ],
      finalAnswer: `${weeks} weeks`, skill: 'saving',
    };
  }

  // --------------------------------------------- 6. receipts and statements
  function receiptQ(level, isWord) {
    const shop = R.pick(SHOPS);
    const items = buy(shop, level === 1 ? 3 : 4);
    const total = sum(items.map((i) => i[1]));
    const type = level === 1 ? R.pick(['total', 'missing']) : R.pick(['total', 'missing', 'check']);
    if (type === 'missing') {
      const i = R.int(0, items.length - 1);
      const others = sum(items.map((it, j) => (j === i ? 0 : it[1])));
      return {
        prompt: `One price has been smudged on this receipt. How much did the <b>${items[i][0]}</b> cost?`,
        visual: receiptTable(shop.till, items.map(([n2, c], j) => [n2, j === i ? '<b style="color:' + ROSE + '">?</b>' : M(c)]), totalRow('TOTAL', M(total))),
        answer: money(items[i][1]),
        hint: 'Add up the prices you can read, then take that away from the total.',
        working: [
          `The prices you can read: ${M(others)}.`,
          `Missing price = total − the rest = ${M(total)} − ${M(others)}.`,
          `The ${items[i][0]} cost <b>${M(items[i][1])}</b>.`,
        ],
        finalAnswer: M(items[i][1]), skill: 'receipt',
      };
    }
    if (type === 'check') {
      const err = R.pick([0, 1, -1]);
      const d = R.step(50, 300, 10);
      const printed = total + err * d;
      const opts = ['The total is right', `The total is ${M(d)} too much`, `The total is ${M(d)} too little`];
      const correct = err === 0 ? 0 : err > 0 ? 1 : 2;
      return choiceQ(
        `Check this receipt. Is the printed total right?`,
        receiptTable(shop.till, items.map(([n2, c]) => [n2, M(c)]), totalRow('TOTAL', M(printed))),
        opts, correct,
        'Add the prices up yourself, then compare with the printed total.',
        [
          `Adding the items: ${items.map((i) => M(i[1])).join(' + ')} = ${M(total)}.`,
          `The receipt says ${M(printed)}.`,
          `<b>${opts[correct]}</b>.`,
        ], 'receipt-check');
    }
    return {
      prompt: `Add up this receipt. What should the total be?`,
      visual: receiptTable(shop.till, items.map(([n2, c]) => [n2, M(c)]), totalRow('TOTAL', '?')),
      answer: money(total),
      hint: 'Line up the decimal points and add, cents column first.',
      working: [`${items.map((i) => M(i[1])).join(' + ')}`, `Total: <b>${M(total)}</b>.`],
      finalAnswer: M(total), skill: 'receipt',
    };
  }

  const OUTS = [['Countdown', 1500, 8000], ['The Warehouse', 2000, 6000], ['bus card top-up', 1000, 3000], ['petrol', 4000, 9000], ['school trip', 1500, 5000], ['power bill', 6000, 14000], ['phone bill', 2500, 6000]];
  const INS = [['pay from work', 8000, 25000], ['pocket money', 1000, 3000], ['refund', 1200, 4000], ['birthday money', 2000, 5000]];
  function statementQ(level, isWord) {
    const who = R.pick(NAMES);
    const nOut = R.int(2, 3), nIn = R.int(1, 2);
    const outs = R.sample(OUTS, nOut).map((o) => [o[0], R.step(o[1], o[2], 5)]);
    const ins = R.sample(INS, nIn).map((o) => [o[0], R.step(o[1], o[2], 5)]);
    const outT = sum(outs.map((o) => o[1])), inT = sum(ins.map((o) => o[1]));
    const open = outT + 100 * R.int(20, 200);
    const close = open + inT - outT;
    const lines = R.shuffle(outs.map((o) => [o[0], o[1], false]).concat(ins.map((o) => [o[0], o[1], true])));
    const visual = tbl(
      `<tr><th>Details</th><th style="color:${GREEN}">Money in</th><th style="color:${ROSE}">Money out</th></tr>` +
      lines.map(([n2, c, isIn]) => `<tr><td style="text-align:left">${n2}</td><td>${isIn ? M(c) : ''}</td><td>${isIn ? '' : M(c)}</td></tr>`).join(''));
    if (R.chance(0.3)) {
      return {
        prompt: `Look at ${who}'s bank statement. How much money went <b>out</b> altogether?`,
        visual,
        answer: money(outT),
        hint: 'Add up only the amounts in the "money out" column.',
        working: [`${outs.map((o) => M(o[1])).join(' + ')} = ${M(outT)}.`, `<b>${M(outT)}</b> went out.`],
        finalAnswer: M(outT), skill: 'statement',
      };
    }
    return {
      prompt: `${who}'s bank balance started at ${M(open)}. What is the balance after these transactions?`,
      visual,
      answer: money(close),
      hint: 'Add the money in, then take away the money out.',
      working: [
        `Money in: ${ins.map((o) => M(o[1])).join(' + ')} = ${M(inT)}.`,
        `Money out: ${outs.map((o) => M(o[1])).join(' + ')} = ${M(outT)}.`,
        `Balance = ${M(open)} + ${M(inT)} − ${M(outT)} = ${M(close)}.`,
        `New balance: <b>${M(close)}</b>.`,
      ],
      finalAnswer: M(close), skill: 'statement',
    };
  }

  // --------------------------------------------------- 7. discounts and GST
  const STORES = ['The Warehouse', 'Rebel Sport', 'Kmart', 'Farmers', 'the bike shop'];
  const THINGS = ['a hoodie', 'a pair of shoes', 'a bike helmet', 'a school bag', 'a pair of jeans', 'a netball dress', 'a skateboard', 'a sleeping bag'];
  function discountQ(level, isWord) {
    const store = R.pick(STORES), thing = R.pick(THINGS);
    const price = 100 * R.int(level === 1 ? 10 : 15, level === 1 ? 40 : 120);
    const pct = R.pick(level === 1 ? [10, 50] : [10, 15, 20, 25, 50]);
    const off = (price * pct) / 100, sale = price - off;
    if (R.chance(0.3)) {
      return {
        prompt: isWord
          ? `${thing[0].toUpperCase() + thing.slice(1)} at ${store} costs ${M(price)}. It has <b>${pct}% off</b>. How much do you save?`
          : `Work out ${pct}% of ${M(price)}.`,
        answer: money(off),
        hint: `${pct}% means ${pct} out of every 100. Find ${pct}% of ${M(price)}.`,
        working: [`${pct}% of ${M(price)} = ${M(price)} × ${N.fmt(pct / 100)} = ${M(off)}.`, `You save <b>${M(off)}</b>.`],
        finalAnswer: M(off), skill: 'discount',
      };
    }
    return {
      prompt: isWord
        ? `${thing[0].toUpperCase() + thing.slice(1)} at ${store} costs ${M(price)}. There is <b>${pct}% off</b> in the sale. What is the sale price?`
        : `A price of ${M(price)} has ${pct}% off. What is the new price?`,
      answer: money(sale),
      hint: 'Work out the discount first, then take it off the price.',
      working: [
        `Discount: ${pct}% of ${M(price)} = ${M(off)}.`,
        `Sale price = ${M(price)} − ${M(off)} = ${M(sale)}.`,
        `Sale price: <b>${M(sale)}</b>.`,
      ],
      finalAnswer: M(sale), skill: 'discount',
    };
  }

  const TRADES = ['a plumber', 'an electrician', 'a painter', 'a mechanic', 'a gardener'];
  function gstQ(level, isWord) {
    const trade = R.pick(TRADES);
    const excl = 100 * R.int(20, 400);
    const gst = (excl * 15) / 100, incl = excl + gst;
    if (R.chance(0.35)) {
      return {
        prompt: isWord
          ? `${trade[0].toUpperCase() + trade.slice(1)} charges ${M(excl)} for a job, plus GST. GST is 15%. How much is the GST?`
          : `Work out the GST (15%) on ${M(excl)}.`,
        answer: money(gst),
        hint: 'GST is 15%, so find 15% of the price.',
        working: [`15% of ${M(excl)} = ${M(excl)} × 0.15 = ${M(gst)}.`, `GST: <b>${M(gst)}</b>.`],
        finalAnswer: M(gst), skill: 'gst',
      };
    }
    return {
      prompt: isWord
        ? `${trade[0].toUpperCase() + trade.slice(1)} quotes ${M(excl)} <b>plus GST</b> for a job. GST is 15%. What is the total to pay?`
        : `${M(excl)} plus GST at 15%. What is the total?`,
      answer: money(incl),
      hint: 'Find 15% of the price, then add it on.',
      working: [
        `GST: 15% of ${M(excl)} = ${M(gst)}.`,
        `Total = ${M(excl)} + ${M(gst)} = ${M(incl)}.`,
        `Total to pay: <b>${M(incl)}</b>.`,
      ],
      finalAnswer: M(incl), skill: 'gst',
    };
  }

  function discountGstQ(level, isWord) {
    const store = R.pick(STORES), thing = R.pick(THINGS);
    const excl = 2000 * R.int(2, 15);                 // a multiple of $20, so everything stays exact
    const pct = R.pick([10, 20, 25]);
    const after = (excl * (100 - pct)) / 100;
    const gst = (after * 15) / 100, incl = after + gst;
    return {
      prompt: isWord
        ? `${thing[0].toUpperCase() + thing.slice(1)} at ${store} is ${M(excl)} <b>before GST</b>. There is ${pct}% off, and then 15% GST is added. What do you pay?`
        : `Take ${pct}% off ${M(excl)}, then add 15% GST. What is the final price?`,
      answer: money(incl),
      hint: 'Do it in order: take the discount off first, then add GST to the new price.',
      working: [
        `Discount: ${pct}% of ${M(excl)} = ${M(excl - after)}.`,
        `Price after discount: ${M(excl)} − ${M(excl - after)} = ${M(after)}.`,
        `GST: 15% of ${M(after)} = ${M(gst)}.`,
        `Final price: ${M(after)} + ${M(gst)} = <b>${M(incl)}</b>.`,
      ],
      finalAnswer: M(incl), skill: 'discount-gst',
    };
  }

  // ------------------------------------------------ 8. comparing two ways to pay
  function compareQ(level, isWord) {
    const store = R.pick(STORES), thing = R.pick(THINGS);
    if (R.chance(0.5)) {
      // buy now vs weekly payments
      const weeks = R.pick([6, 6, 8, 10]);
      const weekly = R.step(4500, 18000, 250);
      const laterTotal = weekly * weeks;
      const now = laterTotal - 100 * R.int(10, 60);
      const diff = laterTotal - now;
      if (R.chance(0.5)) {
        const opts = [`Buy now for ${M(now)}`, `${weeks} weekly payments of ${M(weekly)}`, 'They cost exactly the same'];
        return choiceQ(
          `${thing[0].toUpperCase() + thing.slice(1)} at ${store} costs ${M(now)} to buy now, or ${weeks} weekly payments of ${M(weekly)}. Which way is <b>cheaper</b>?`,
          null, opts, 0,
          `Work out what the ${weeks} payments come to altogether, then compare.`,
          [
            `${weeks} payments: ${weeks} × ${M(weekly)} = ${M(laterTotal)}.`,
            `Buy now: ${M(now)}.`,
            `${M(now)} is less than ${M(laterTotal)}, so <b>buying now</b> is cheaper (by ${M(diff)}).`,
          ], 'compare');
      }
      return {
        prompt: `${thing[0].toUpperCase() + thing.slice(1)} costs ${M(now)} to buy now, or ${weeks} weekly payments of ${M(weekly)}. How much <b>more</b> do the weekly payments cost altogether?`,
        answer: money(diff),
        hint: `Work out ${weeks} × ${M(weekly)} first, then compare it with ${M(now)}.`,
        working: [
          `Weekly plan total: ${weeks} × ${M(weekly)} = ${M(laterTotal)}.`,
          `Buy now: ${M(now)}.`,
          `Difference: ${M(laterTotal)} − ${M(now)} = <b>${M(diff)}</b>.`,
        ],
        finalAnswer: M(diff), skill: 'compare',
      };
    }
    // $x off vs y% off
    const price = 500 * R.int(6, 24);                  // whole dollars, a multiple of $5
    const pct = R.pick([10, 20, 25]);
    let flat = 100 * R.pick([5, 10, 15, 20]);
    const off = (price * pct) / 100;
    if (off === flat) flat += 500;
    const dealA = price - flat, dealB = price - off;
    const cheaper = dealA < dealB ? 'A' : 'B';
    const diff = Math.abs(dealA - dealB);
    if (R.chance(0.5)) {
      const opts = [`Deal A: ${M(flat)} off`, `Deal B: ${pct}% off`, 'They give the same price'];
      return choiceQ(
        `${thing[0].toUpperCase() + thing.slice(1)} costs ${M(price)}. Deal A takes ${M(flat)} off. Deal B takes ${pct}% off. Which deal is <b>cheaper</b>?`,
        null, opts, cheaper === 'A' ? 0 : 1,
        'Work out the price after each deal, then see which is smaller.',
        [
          `Deal A: ${M(price)} − ${M(flat)} = ${M(dealA)}.`,
          `Deal B: ${pct}% of ${M(price)} = ${M(off)}, so ${M(price)} − ${M(off)} = ${M(dealB)}.`,
          `<b>Deal ${cheaper}</b> is cheaper, by ${M(diff)}.`,
        ], 'compare');
    }
    return {
      prompt: `${thing[0].toUpperCase() + thing.slice(1)} costs ${M(price)}. Deal A takes ${M(flat)} off. Deal B takes ${pct}% off. How much cheaper is the better deal?`,
      answer: money(diff),
      hint: 'Work out both final prices, then find the difference between them.',
      working: [
        `Deal A: ${M(price)} − ${M(flat)} = ${M(dealA)}.`,
        `Deal B: ${pct}% of ${M(price)} = ${M(off)}, so the price is ${M(dealB)}.`,
        `Difference: ${M(Math.max(dealA, dealB))} − ${M(Math.min(dealA, dealB))} = <b>${M(diff)}</b> (Deal ${cheaper} wins).`,
      ],
      finalAnswer: M(diff), skill: 'compare',
    };
  }

  // ------------------------------------------------------------- dispatchers
  function calc(level) {
    const pool = level === 1
      ? [shopTotal, changeQ, splitQ, wagePay, saveQ, receiptQ, wageWeek]
      : level === 2
        ? [changeQ, cashRoundQ, splitQ, wageWeek, budgetQ, receiptQ, discountQ, gstQ, saveQ, shopTotal]
        : [cashRoundQ, splitQ, overtimeQ, wageBackQ, budgetQ, statementQ, discountGstQ, compareQ, saveQ, receiptQ];
    return R.pick(pool)(level, false);
  }
  function word(level) {
    const pool = level === 1
      ? [changeQ, wagePay, saveQ, splitQ, cashRoundQ]
      : level === 2
        ? [changeQ, cashRoundQ, splitQ, wagePay, saveQ, discountQ, gstQ, budgetQ, receiptQ]
        : [changeQ, splitQ, overtimeQ, wageBackQ, saveQ, discountGstQ, compareQ, statementQ, budgetQ];
    return R.pick(pool)(level, true);
  }

  HL.registerTopic({
    id: 'money', subject: 'maths', strand: 'number', order: 16,
    name: 'Money & budgeting', short: 'Money',
    blurb: 'Totals, change, wages, budgets and saving up for something.',
    example: 'Total $27.40, pay $50 → change $22.60',
    animal: 'bear',
    learn: {
      what: '<p>Money maths is the maths you actually use every day: adding up a shop, checking your <b>change</b>, splitting a bill, reading a <b>payslip</b> and making a <b>budget</b>. It is just decimals with a dollar sign in front, so the golden rule is always the same: <b>line up the decimal points</b> and write <b>two digits for the cents</b>. One New Zealand extra: cash totals get rounded to the nearest <b>10c</b>, because we have no 1c or 5c coins.</p>',
      visual: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
        <text x="65" y="14" text-anchor="middle" fill="${ROSE}">what it cost</text>
        <text x="177" y="14" text-anchor="middle" fill="${BLUE}">what you gave</text>
        <text x="300" y="14" text-anchor="middle" fill="${GREEN}">change back</text>
        <rect x="10" y="22" width="110" height="96" rx="4" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>
        <text x="65" y="40" text-anchor="middle" fill="${INK}" font-size="12">CANTEEN</text>
        <text x="18" y="58" fill="${INK}" font-size="12">pie</text><text x="112" y="58" text-anchor="end" fill="${INK}" font-size="12">18.90</text>
        <text x="18" y="74" fill="${INK}" font-size="12">juice</text><text x="112" y="74" text-anchor="end" fill="${INK}" font-size="12">8.50</text>
        <line x1="18" y1="82" x2="112" y2="82" stroke="${INK}" stroke-width="1"/>
        <text x="18" y="99" fill="${ROSE}" font-size="11">TOTAL</text><text x="112" y="99" text-anchor="end" fill="${ROSE}" font-size="13">27.40</text>
        <rect x="128" y="46" width="98" height="48" rx="6" fill="#A6E3B8" stroke="${GREEN}" stroke-width="2"/>
        <circle cx="177" cy="70" r="15" fill="#FFFFFF" opacity=".55"/>
        <text x="177" y="76" text-anchor="middle" fill="${GREEN}" font-size="18">$50</text>
        <text x="348" y="46" text-anchor="end" fill="${BLUE}" font-size="15">$50.00</text>
        <text x="348" y="68" text-anchor="end" fill="${ROSE}" font-size="15">− $27.40</text>
        <line x1="252" y1="76" x2="348" y2="76" stroke="${INK}" stroke-width="2"/>
        <text x="348" y="98" text-anchor="end" fill="${GREEN}" font-size="17">$22.60</text>
        <text x="300" y="116" text-anchor="middle" fill="${INK}" font-size="11">line the dots up</text>
        <text x="16" y="140" fill="${INK}" font-size="13">income $80 splits up:</text>
        <rect x="16" y="150" width="252" height="34" rx="6" fill="#FFC79A" stroke="${INK}" stroke-width="1.5"/>
        <rect x="268" y="150" width="76" height="34" rx="6" fill="#A6E3B8" stroke="${INK}" stroke-width="1.5"/>
        <text x="142" y="172" text-anchor="middle" fill="${INK}">spending $60</text>
        <text x="306" y="172" text-anchor="middle" fill="${GREEN}" font-size="12">save $20</text>
        <text x="16" y="205" fill="${INK}" font-size="12">money left over = income − expenses</text>
      </svg>`,
      facts: [
        'Change = what you gave − what it cost',
        'Line up the decimal points, and always write two digits for the cents',
        'Pay = hours × rate',
        'Overtime at time-and-a-half = rate × 1.5',
        'Money left over = income − expenses',
        'Cash payments round to the nearest 10c; card payments do not',
      ],
      steps: [
        'Write every amount with <b>two digits after the dot</b> ($7.50, not $7.5) and line the dots up under each other before you add or subtract.',
        '<b>Change:</b> add up what it cost, then do <b>what you gave − what it cost</b>. The change is always smaller than the note.',
        '<b>Cash?</b> Round the total to the <b>nearest 10c</b> first (1c–4c down, 6c–9c up). Card or EFTPOS: no rounding.',
        '<b>Wages:</b> pay = hours × rate. For overtime at <b>time-and-a-half</b>, multiply the rate by 1.5 first, then by the overtime hours.',
        '<b>Budget:</b> add up all the expenses, then <b>income − expenses</b> tells you what is left. A negative answer means you overspent.',
      ],
      examples: [
        {
          q: 'You buy a pie ($4.50) and a juice ($3.20) at the canteen and pay with a $20 note. How much change do you get?',
          working: [
            '<b>Picture:</b> your wallet at the school canteen. A $20 note goes out, coins come back.',
            '1. What did it cost? $4.50 + $3.20 = <b>$7.70</b>.',
            '2. What did I hand over? A <b>$20</b> note.',
            '3. Change = what you gave − what it cost.',
            '$20.00 − $7.70 = $12.30',
          ],
          a: '$12.30',
          visual: `<svg viewBox="0 0 240 124" width="240" height="124" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <rect x="118" y="12" width="15" height="88" rx="4" fill="#C9B8F2" opacity=".45"/>
            <text x="8" y="30" fill="${BLUE}" font-size="11">you gave</text>
            <text x="150" y="34" text-anchor="end" fill="${BLUE}" font-size="18">$20.00</text>
            <text x="8" y="60" fill="${ROSE}" font-size="11">it cost</text>
            <text x="150" y="64" text-anchor="end" fill="${ROSE}" font-size="18">− $7.70</text>
            <line x1="60" y1="74" x2="150" y2="74" stroke="${INK}" stroke-width="2"/>
            <text x="150" y="98" text-anchor="end" fill="${GREEN}" font-size="18">$12.30</text>
            <text x="156" y="98" fill="${GREEN}" font-size="11">change</text>
            <text x="120" y="118" text-anchor="middle" fill="${INK}" font-size="11">the dots line up</text>
          </svg>`,
        },
        {
          q: 'The dairy till says $12.47 and you are paying with cash. How much do you actually hand over?',
          working: [
            '<b>Picture:</b> the same wallet, but only coins in it. New Zealand has no 1c or 5c coins.',
            '1. Cash or card? <b>Cash</b>, so the total rounds to the nearest 10c.',
            '2. What are the last cents? <b>7c</b>. Is 7 closer to 0 or to 10? Closer to 10, so round <b>up</b>.',
            '$12.47 → $12.50',
          ],
          a: '$12.50',
          visual: `<svg viewBox="0 0 300 90" width="300" height="90" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <line x1="30" y1="50" x2="270" y2="50" stroke="${INK}" stroke-width="2"/>
            <line x1="30" y1="42" x2="30" y2="58" stroke="${INK}" stroke-width="2"/>
            <line x1="270" y1="42" x2="270" y2="58" stroke="${INK}" stroke-width="2"/>
            <line x1="150" y1="45" x2="150" y2="55" stroke="${INK}" stroke-width="1"/>
            <text x="30" y="76" text-anchor="middle" fill="${INK}" font-size="12">$12.40</text>
            <text x="270" y="76" text-anchor="middle" fill="${GREEN}" font-size="12">$12.50</text>
            <circle cx="198" cy="50" r="6" fill="${ROSE}"/>
            <text x="198" y="30" text-anchor="middle" fill="${ROSE}" font-size="13">$12.47</text>
            <path d="M206 40 q34 -6 58 4" stroke="${GREEN}" stroke-width="3" fill="none"/>
            <polygon points="266,46 254,40 256,50" fill="${GREEN}"/>
            <text x="150" y="16" text-anchor="middle" fill="${INK}" font-size="11">past halfway → round up</text>
          </svg>`,
        },
        {
          q: 'Three friends split a $47.00 bill equally. What does each one pay?',
          working: [
            '<b>Picture:</b> the bill in the middle of the table and three wallets around it.',
            '1. Does it divide evenly? $47.00 ÷ 3 = $15.6666... <b>No.</b>',
            '2. Money only goes to the cent, so cut it after 2 decimal places: <b>$15.66</b> each.',
            '3. Check: 3 × $15.66 = $46.98, which is <b>2c short</b>.',
            '4. So somebody has to cover the 2c: two friends pay $15.66 and one pays $15.68.',
          ],
          a: 'Two pay $15.66 and one pays $15.68',
        },
        {
          q: 'Harper has a dog-walking job at $14.00 an hour. She works 6 hours, plus 2 hours of overtime at time-and-a-half. What is her pay?',
          working: [
            '<b>Picture:</b> the wallet is filling up this time, not emptying. Pay goes <b>in</b>.',
            '1. Pay = hours × rate. Normal pay: 6 × $14.00 = <b>$84.00</b>.',
            '2. What is the overtime rate? Time-and-a-half = rate × 1.5 = $14.00 × 1.5 = <b>$21.00</b>.',
            '3. Overtime pay: 2 × $21.00 = <b>$42.00</b>.',
            '$84.00 + $42.00 = $126.00',
          ],
          a: '$126.00',
          visual: `<table class="data"><tr><th></th><th>Hours</th><th>Rate</th><th>Pay</th></tr><tr><th>normal</th><td>6</td><td>$14.00</td><td>$84.00</td></tr><tr><th style="color:${ROSE}">overtime</th><td>2</td><td style="color:${ROSE}">$21.00</td><td>$42.00</td></tr><tr><th>total</th><td></td><td></td><th style="color:${GREEN}">$126.00</th></tr></table>`,
        },
        {
          q: 'Harper gets $40 a week. Her budget is below. How much is left over, and what percentage goes on snacks?',
          working: [
            '<b>Picture:</b> the $40 goes into the wallet, then each expense takes a bite out of it.',
            '1. What do the expenses add to? $12 + $10 + $6 = <b>$28</b>.',
            '2. Money left over = income − expenses: $40.00 − $28.00 = <b>$12.00</b>.',
            `3. What part is snacks? 12 out of 40 = ${N.fracHtml(12, 40)} = ${N.fracHtml(3, 10)}.`,
            `4. ${N.fracHtml(3, 10)} = 30%, so <b>30%</b> goes on snacks.`,
          ],
          a: '$12.00 left over, and 30% goes on snacks',
          visual: `<table class="data"><tr><th colspan="2">Harper — weekly budget</th></tr><tr><th style="text-align:left;color:${GREEN}">income</th><th style="color:${GREEN}">$40.00</th></tr><tr><td style="text-align:left">snacks</td><td>$12.00</td></tr><tr><td style="text-align:left">phone credit</td><td>$10.00</td></tr><tr><td style="text-align:left">bus fares</td><td>$6.00</td></tr><tr><th style="text-align:left">left over</th><th style="color:${ROSE}">?</th></tr></table>`,
        },
        {
          q: 'A bike at The Warehouse costs $370. Harper has $145 saved and puts away $15 a week of her pocket money. How many more weeks until she can buy it?',
          working: [
            '<b>Picture:</b> the wallet gets $15 heavier every single week until it holds enough.',
            '1. How much more do I still need? $370 − $145 = <b>$225</b>.',
            '2. How many lots of $15 fit into $225? $225 ÷ $15 = <b>15</b>.',
            '3. Check: 15 × $15 = $225, and $225 + $145 = $370. ✓',
          ],
          a: '15 weeks',
        },
        {
          q: 'A jacket costs $60. Shop A takes $10 off. Shop B takes 20% off. Which is cheaper, and by how much?',
          working: [
            '<b>Picture:</b> two wallets, the same jacket. The deal that leaves more money in the wallet wins.',
            '1. Shop A: $60.00 − $10.00 = <b>$50.00</b>.',
            '2. Shop B: 20% of $60 = $12.00, so $60.00 − $12.00 = <b>$48.00</b>.',
            '3. Which price is smaller? $48.00. By how much? $50.00 − $48.00 = $2.00.',
          ],
          a: 'Shop B, by $2.00',
        },
      ],
      tips: [
        'Quick check on change: it must be <b>less</b> than the note you handed over. If it is more, you subtracted the wrong way round.',
        'Always two digits for the cents. $6.5 should be written <b>$6.50</b>, and $6.05 means six dollars and <b>five</b> cents.',
        'Round only at the <b>very end</b>, and only for cash. Rounding halfway through loses cents.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
