/* Topic: Percentages (of an amount, increase/decrease, GST, one number as a % of another, reverse %) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});
  const money = (x) => N.money(x);
  const names = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby'];
  const shops = ['The Warehouse', 'Farmers', 'Rebel Sport', 'Kmart', 'Briscoes', 'JB Hi-Fi'];
  const products = ['a pair of sneakers', 'a hoodie', 'a skateboard', 'a backpack', 'a netball', 'a pair of headphones', 'a jacket', 'a bike helmet', 'a board game'];

  /** percentages by level */
  const PCTS = { 1: [10, 50, 25, 20, 5, 10, 50], 2: [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 5, 15, 35, 45, 12.5, 15, 15] };
  function pickPct(level) {
    if (level === 3) return R.chance(0.5) ? R.int(1, 99) : R.pick([12.5, 2.5, 7.5, 17.5, 37.5, 62.5, 15, 35, 65, 85]);
    return R.pick(PCTS[level]);
  }
  /** an amount so that p% of it is exact (integer at L1/L2, ≤ 2 dp at L3) */
  function amountFor(p, level, lo, hi) {
    const p10 = Math.round(p * 10); // p as tenths of a percent
    const stepInt = 1000 / N.gcd(p10, 1000);        // multiple needed for an integer answer
    if (level < 3 || stepInt <= 20) return R.step(Math.ceil(lo / stepInt) * stepInt, Math.max(lo, hi), stepInt);
    // level 3 with an awkward percent: answers may have up to 2 dp
    const step = Number.isInteger(p) ? 1 : 2;
    return R.step(lo, hi, step);
  }
  const pctOf = (p, a) => N.round(p * a / 100, 2);

  /** friendly method steps for p% of a */
  function strategy(p, a) {
    const ten = N.round(a / 10, 2), one = N.round(a / 100, 2);
    if (p === 10) return [`10% is the same as ÷ 10.`, `${f(a)} ÷ 10 = ${f(ten)}.`];
    if (p === 50) return [`50% is a half.`, `${f(a)} ÷ 2 = ${f(a / 2)}.`];
    if (p === 25) return [`25% is a quarter (half of a half).`, `${f(a)} ÷ 4 = ${f(N.round(a / 4, 2))}.`];
    if (p === 75) return [`75% is three quarters.`, `${f(a)} ÷ 4 = ${f(N.round(a / 4, 2))}, then × 3 = ${f(N.round(3 * a / 4, 2))}.`];
    if (p === 20) return [`20% is a fifth (or 10% doubled).`, `10% of ${f(a)} = ${f(ten)}, so 20% = ${f(N.round(ten * 2, 2))}.`];
    if (p === 5) return [`5% is half of 10%.`, `10% of ${f(a)} = ${f(ten)}, so 5% = ${f(N.round(ten / 2, 2))}.`];
    if (p === 15) return [`15% = 10% + 5%.`, `10% of ${f(a)} = ${f(ten)} and 5% = ${f(N.round(ten / 2, 2))}.`, `${f(ten)} + ${f(N.round(ten / 2, 2))} = ${f(N.round(ten * 1.5, 2))}.`];
    if (p === 12.5) return [`12.5% is an eighth (half of a quarter).`, `${f(a)} ÷ 8 = ${f(N.round(a / 8, 2))}.`];
    if (Number.isInteger(p) && p % 10 === 0) return [`10% of ${f(a)} = ${f(ten)}.`, `${p}% = ${p / 10} lots of 10%: ${f(ten)} × ${p / 10} = ${f(N.round(ten * p / 10, 2))}.`];
    return [`1% of ${f(a)} = ${f(a)} ÷ 100 = ${f(one)}.`, `${f(p)}% = ${f(one)} × ${f(p)} = ${f(pctOf(p, a))}.`];
  }
  function hintFor(p) {
    if (p === 10) return 'To find 10%, divide by 10.';
    if (p === 50) return '50% is a half.';
    if (p === 25) return '25% is a quarter: divide by 4.';
    if (p === 75) return 'Find a quarter (÷ 4), then multiply by 3.';
    if (p === 20) return 'Find 10% (÷ 10), then double it.';
    if (p === 5) return 'Find 10% (÷ 10), then halve it.';
    if (p === 15) return 'Find 10% and 5%, then add them.';
    if (p === 12.5) return '12.5% is one eighth: divide by 8.';
    if (Number.isInteger(p) && p % 10 === 0) return `Find 10% first (÷ 10), then multiply by ${p / 10}.`;
    return 'Find 1% first (÷ 100), then multiply by the percentage.';
  }

  // ---------- calc generators ----------
  function percentOf(level) {
    const p = pickPct(level);
    const a = amountFor(p, level, level === 1 ? 20 : 40, level === 1 ? 200 : level === 2 ? 600 : 900);
    const ans = pctOf(p, a);
    const asMoney = R.chance(0.4);
    return {
      prompt: `Find ${f(p)}% of ${asMoney ? money(a) : f(a)}.`,
      answer: numAns(ans, asMoney ? { unit: '$' } : {}),
      hint: hintFor(p),
      working: strategy(p, a).concat([`${f(p)}% of ${asMoney ? money(a) : f(a)} = <b>${asMoney ? money(ans) : f(ans)}</b>.`]),
      finalAnswer: asMoney ? money(ans) : f(ans), skill: 'pct-of',
    };
  }
  function incDec(level) {
    const p = pickPct(level);
    const a = amountFor(p, level, 40, level === 2 ? 500 : 900);
    const up = R.chance(0.5);
    const change = pctOf(p, a);
    const ans = N.round(up ? a + change : a - change, 2);
    return {
      prompt: `${up ? 'Increase' : 'Decrease'} ${f(a)} by ${f(p)}%.`,
      answer: numAns(ans),
      hint: `First find ${f(p)}% of ${f(a)}. Then ${up ? 'add it to' : 'take it away from'} ${f(a)}.`,
      working: strategy(p, a).concat([`${f(p)}% of ${f(a)} = ${f(change)}.`, `${f(a)} ${up ? '+' : '−'} ${f(change)} = <b>${f(ans)}</b>.`]),
      finalAnswer: f(ans), skill: 'inc-dec',
    };
  }
  function gst(level) {
    if (level === 3 && R.chance(0.5)) {
      // GST-exclusive from inclusive: excl is a multiple of $20 (or $2 at L3) so incl is exact
      const excl = R.step(20, 400, R.pick([20, 2]));
      const incl = N.round(excl * 1.15, 2);
      return {
        prompt: `A price of ${money(incl)} <b>includes</b> 15% GST. What was the price before GST was added?`,
        answer: numAns(excl, { unit: '$' }),
        hint: 'Adding 15% GST means × 1.15. To undo it, divide by 1.15 (do NOT subtract 15%).',
        working: [
          `Price with GST = original × 1.15 (100% + 15%).`,
          `Original = ${money(incl)} ÷ 1.15 = ${money(excl)}.`,
          `Check: ${money(excl)} × 1.15 = ${money(incl)}. Price before GST: <b>${money(excl)}</b>.`,
        ],
        finalAnswer: money(excl), skill: 'gst-reverse',
      };
    }
    const a = level === 1 ? R.step(20, 200, 20) : level === 2 ? R.step(2, 300, 2) : N.round(R.step(2, 500, 0.2), 2);
    const g = N.round(a * 0.15, 2), incl = N.round(a + g, 2);
    const askIncl = level === 1 ? R.chance(0.3) : R.chance(0.6);
    const ten = N.round(a / 10, 2), five = N.round(ten / 2, 2);
    return {
      prompt: askIncl ? `A price is ${money(a)} before GST. Add 15% GST. What is the price including GST?` : `GST in New Zealand is 15%. How much GST is added to a price of ${money(a)}?`,
      answer: numAns(askIncl ? incl : g, { unit: '$' }),
      hint: `15% = 10% + 5%. 10% of ${money(a)} is ${money(ten)}; 5% is half of that.${askIncl ? ' Then add the GST to the price.' : ''}`,
      working: [
        `10% of ${money(a)} = ${money(ten)}, and 5% = ${money(five)}.`,
        `GST = 15% = ${money(ten)} + ${money(five)} = ${money(g)}.`,
        askIncl ? `Price including GST = ${money(a)} + ${money(g)} = <b>${money(incl)}</b>.` : `GST added: <b>${money(g)}</b>.`,
      ],
      finalAnswer: money(askIncl ? incl : g), skill: 'gst',
    };
  }
  function asPercent(level) {
    const total = level === 1 ? R.pick([10, 20, 50, 25]) : level === 2 ? R.pick([20, 25, 40, 50, 80, 200]) : R.pick([40, 80, 200, 400, 250, 500]);
    const part = R.int(1, total - 1);
    const ans = N.round(part / total * 100, 2);
    const k = 100 / total;
    return {
      prompt: `Write ${part} as a percentage of ${total}.`,
      answer: numAns(ans, { unit: '%' }),
      hint: `Write it as a fraction, ${N.fracText(part, total)}, then make the bottom 100 (or divide and × 100).`,
      working: [
        `Fraction: ${N.fracText(part, total)}.`,
        total <= 100 ? `Multiply top and bottom by ${f(k)}: ${N.fracText(part, total)} = ${f(ans)} out of 100.` : `${part} ÷ ${total} = ${f(N.round(part / total, 4))}, then × 100 = ${f(ans)}.`,
        `Answer: <b>${f(ans)}%</b>.`,
      ],
      finalAnswer: `${f(ans)}%`, skill: 'as-pct',
    };
  }
  function findWhole(level) {
    const p = level === 2 ? R.pick([10, 20, 25, 50, 5, 40, 75]) : R.pick([10, 20, 25, 50, 5, 40, 75, 15, 30, 60, 12.5, 35, 8]);
    const whole = amountFor(p, 2, 40, level === 2 ? 400 : 800);
    const part = pctOf(p, whole);
    const one = N.round(part / p, 2);
    return {
      prompt: `${f(p)}% of a number is ${f(part)}. What is the number?`,
      answer: numAns(whole),
      hint: `Work out what 1% is (${f(part)} ÷ ${f(p)}), then multiply by 100 to get the whole (100%).`,
      working: [
        `${f(p)}% = ${f(part)}, so 1% = ${f(part)} ÷ ${f(p)} = ${f(one)}.`,
        `100% = ${f(one)} × 100 = ${f(whole)}.`,
        `The number is <b>${f(whole)}</b>.`,
      ],
      finalAnswer: f(whole), skill: 'find-whole',
    };
  }
  function reverse() {
    const p = R.pick([10, 20, 25, 30, 40, 50, 15, 35, 60, 75]);
    const up = R.chance(0.4);
    const orig = amountFor(p, 2, 40, 600);
    const now = N.round(up ? orig * (100 + p) / 100 : orig * (100 - p) / 100, 2);
    const mult = N.round((up ? 100 + p : 100 - p) / 100, 2);
    return {
      prompt: `A number was ${up ? 'increased' : 'decreased'} by ${f(p)}% and is now ${f(now)}. What was the original number?`,
      answer: numAns(orig),
      hint: `After a ${f(p)}% ${up ? 'increase' : 'decrease'}, the new number is ${up ? 100 + p : 100 - p}% of the original. Find 1% first, or divide by ${f(mult)}.`,
      working: [
        `New number = ${up ? 100 + p : 100 - p}% of the original (100% ${up ? '+' : '−'} ${f(p)}%).`,
        `1% of the original = ${f(now)} ÷ ${up ? 100 + p : 100 - p} = ${f(N.round(now / (up ? 100 + p : 100 - p), 3))}.`,
        `Original = 100% = ${f(now)} ÷ ${f(mult)} = <b>${f(orig)}</b>.`,
      ],
      finalAnswer: f(orig), skill: 'reverse',
    };
  }


  // ---------- simple interest ----------
  /** simple interest: I = P x R x T (whole years) */
  function interest(level) {
    const rate = level === 1 ? R.pick([5, 10, 20]) : level === 2 ? R.pick([4, 5, 6, 8, 10, 12, 15, 20, 25]) : R.pick([3, 6, 7, 9, 11, 2.5, 4.5, 7.5, 12.5]);
    const p = level === 1 ? R.step(200, 1200, 100) : level === 2 ? R.step(400, 5000, 200) : R.step(800, 12000, 400);
    const years = level === 1 ? R.int(1, 2) : level === 2 ? R.int(2, 4) : R.int(3, 6);
    const perYear = N.round(p * rate / 100, 2);
    const I = N.round(perYear * years, 2);
    const total = N.round(p + I, 2);
    const askTotal = level === 1 ? false : R.chance(0.45);
    return {
      prompt: `${money(p)} is put in a savings account that pays <b>${f(rate)}% simple interest</b> each year. ${askTotal ? `How much is in the account after ${N.plural(years, 'year')}?` : `How much interest is earned in ${N.plural(years, 'year')}?`}`,
      answer: numAns(askTotal ? total : I, { unit: '$' }),
      hint: `Interest for ONE year = ${f(rate)}% of ${money(p)}. Then multiply by ${years} (simple interest is the same every year).${askTotal ? ' Then add the interest to the money you started with.' : ''}`,
      working: [
        `Simple interest: <b>I = P × R × T</b> (money × rate × years).`,
        `One year: ${f(rate)}% of ${money(p)} = ${money(perYear)}.`,
        `${N.plural(years, 'year')}: ${money(perYear)} × ${years} = ${money(I)}.`,
        askTotal ? `Altogether = ${money(p)} + ${money(I)} = <b>${money(total)}</b>.` : `Interest earned: <b>${money(I)}</b>.`,
      ],
      finalAnswer: money(askTotal ? total : I), skill: 'interest',
    };
  }

  // ---------- percentage profit / loss ----------
  function profitLoss(level) {
    const p = level === 1 ? R.pick([10, 20, 25, 50]) : level === 2 ? R.pick([5, 10, 15, 20, 25, 30, 40, 50]) : R.pick([8, 12, 15, 24, 35, 45, 60, 75]);
    const cost = amountFor(p, 2, 20, level === 1 ? 200 : 600);
    const up = level === 1 ? true : R.chance(0.55);
    const diff = pctOf(p, cost);
    const sale = N.round(up ? cost + diff : cost - diff, 2);
    const item = R.pick(products);
    return {
      prompt: `A shop buys ${item} for ${money(cost)} and sells it for ${money(sale)}. What is the percentage ${up ? 'profit' : 'loss'}?`,
      answer: numAns(p, { unit: '%' }),
      hint: `${up ? 'Profit' : 'Loss'} = ${money(sale)} ${up ? '−' : 'is'} ${up ? money(cost) : `${money(cost)} − ${money(sale)}`}. Then divide by the <b>price the shop paid</b> (${money(cost)}) and × 100.`,
      working: [
        `${up ? 'Profit' : 'Loss'} = ${up ? `${money(sale)} − ${money(cost)}` : `${money(cost)} − ${money(sale)}`} = ${money(diff)}.`,
        `Percentage ${up ? 'profit' : 'loss'} = ${up ? 'profit' : 'loss'} ÷ <b>cost price</b> × 100.`,
        `${f(diff)} ÷ ${f(cost)} = ${f(N.round(diff / cost, 4))}, and × 100 = ${f(p)}.`,
        `Percentage ${up ? 'profit' : 'loss'}: <b>${f(p)}%</b>.`,
      ],
      finalAnswer: `${f(p)}% ${up ? 'profit' : 'loss'}`, skill: 'profit-loss',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['of', 'of', 'of', 'gst', 'as', 'int', 'pl']
      : level === 2 ? ['of', 'of', 'inc', 'gst', 'as', 'whole', 'int', 'pl']
      : ['of', 'inc', 'gst', 'as', 'whole', 'rev', 'rev', 'int', 'pl'];
    const t = R.pick(pool);
    if (t === 'of') return percentOf(level);
    if (t === 'inc') return incDec(level);
    if (t === 'gst') return gst(level);
    if (t === 'as') return asPercent(level);
    if (t === 'whole') return findWhole(level);
    if (t === 'int') return interest(level);
    if (t === 'pl') return profitLoss(level);
    return reverse();
  }

  // ---------- word problems ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['sale', 'netball', 'tip', 'gst', 'score', 'bank', 'stall']
      : level === 2 ? ['sale', 'netball', 'tip', 'gst', 'population', 'sale', 'bank', 'stall']
        : ['sale', 'netball', 'population', 'gstrev', 'revsale', 'tip', 'bank', 'stall', 'saleGst', 'saleGst', 'twoOff', 'twoOff', 'betterDeal', 'betterDeal']);
    const who = R.pick(names), shop = R.pick(shops), item = R.pick(products);
    if (t === 'saleGst') {
      let price = 200, p = 20, sale = 160;
      for (let i = 0; i < 60; i++) {
        p = R.pick([10, 20, 25, 30, 40, 50, 15]);
        price = R.step(60, 320, 20);
        sale = N.round(price * (100 - p) / 100, 2);
        if (Number.isInteger(sale) && sale % 2 === 0) break;
      }
      const g = N.round(sale * 0.15, 2), total = N.round(sale + g, 2);
      const ten = N.round(sale / 10, 2), five = N.round(ten / 2, 2);
      return {
        prompt: `${shop} has ${f(p)}% off ${item}, which is normally ${money(price)} before GST. 15% GST is added to the sale price at the till. How much does ${who} pay altogether?`,
        answer: numAns(total, { unit: '$' }),
        hint: 'Two steps in order: take the discount off first, then add 15% GST to the <b>sale</b> price.',
        working: strategy(p, price).concat([
          `Step 1 — discount: ${f(p)}% of ${money(price)} = ${money(N.round(price - sale, 2))}, so the sale price is ${money(price)} − ${money(N.round(price - sale, 2))} = ${money(sale)}.`,
          `Step 2 — GST on the <b>sale</b> price: 10% of ${money(sale)} = ${money(ten)} and 5% = ${money(five)}, so GST = ${money(g)}.`,
          `Total = ${money(sale)} + ${money(g)} = <b>${money(total)}</b>.`,
        ]),
        finalAnswer: money(total), skill: 'discount-gst',
      };
    }
    if (t === 'twoOff') {
      let price = 200, p1 = 20, p2 = 10, after1 = 160, final = 144;
      for (let i = 0; i < 60; i++) {
        p1 = R.pick([10, 20, 25, 50, 30, 40]); p2 = R.pick([10, 20, 25, 50]);
        price = R.step(80, 300, 20);
        after1 = N.round(price * (100 - p1) / 100, 2);
        final = N.round(after1 * (100 - p2) / 100, 2);
        if (Number.isInteger(after1) && Number.isInteger(final) && p1 + p2 <= 60) break;
      }
      const askSingle = R.chance(0.4);
      const singlePct = N.round((price - final) / price * 100, 2);
      const shared = [
        `Step 1: ${f(p1)}% off ${money(price)} → ${f(p1)}% of ${money(price)} = ${money(N.round(price - after1, 2))}, so the price is now ${money(after1)}.`,
        `Step 2: the extra ${f(p2)}% comes off the <b>new</b> price, not the old one: ${f(p2)}% of ${money(after1)} = ${money(N.round(after1 - final, 2))}.`,
        `Price at the counter = ${money(after1)} − ${money(N.round(after1 - final, 2))} = ${money(final)}.`,
      ];
      if (askSingle) {
        return {
          prompt: `${shop} has ${f(p1)}% off ${item} (normally ${money(price)}), and today there is a further ${f(p2)}% off at the counter. What <b>single</b> percentage off would give the same final price?`,
          answer: numAns(singlePct, { unit: '%' }),
          hint: `Work out the final price step by step first, then ask "how much came off ${money(price)}, as a percentage of ${money(price)}?"`,
          working: shared.concat([
            `Total taken off = ${money(price)} − ${money(final)} = ${money(N.round(price - final, 2))}.`,
            `As a percentage of the original: ${f(N.round(price - final, 2))} ÷ ${f(price)} × 100 = <b>${f(singlePct)}%</b>.`,
            `Notice it is <b>not</b> ${f(p1 + p2)}% — the second discount comes off a smaller price.`,
          ]),
          finalAnswer: `${f(singlePct)}%`, skill: 'two-discounts',
        };
      }
      return {
        prompt: `${shop} has ${f(p1)}% off ${item}, which normally costs ${money(price)}. At the counter ${who} gets a further ${f(p2)}% off the sale price. How much does ${who} pay?`,
        answer: numAns(final, { unit: '$' }),
        hint: `Do it in two steps. The second discount comes off the <b>new</b> price, so it is not just ${f(p1 + p2)}% off.`,
        working: shared.concat([`${who} pays <b>${money(final)}</b>.`]),
        finalAnswer: money(final), skill: 'two-discounts',
      };
    }
    if (t === 'betterDeal') {
      let pA = 25, pB = 40, priceA = 160, priceB = 200, finalA = 120, finalB = 120;
      for (let i = 0; i < 80; i++) {
        [pA, pB] = R.sample([10, 20, 25, 30, 40, 50], 2);
        priceA = R.step(60, 260, 20); priceB = R.step(60, 260, 20);
        finalA = N.round(priceA * (100 - pA) / 100, 2);
        finalB = N.round(priceB * (100 - pB) / 100, 2);
        // a real comparison: the shop with the lower normal price is NOT the cheaper one
        if (Number.isInteger(finalA) && Number.isInteger(finalB) && Math.abs(finalA - finalB) >= 5
          && priceA !== priceB && (priceA < priceB) !== (finalA < finalB)) break;
      }
      const [shopA, shopB] = R.sample(shops, 2);
      const cheaper = finalA < finalB ? 0 : 1;
      const opts = [shopA, shopB];
      return {
        prompt: `${shopA} sells ${item} for ${money(priceA)} with ${f(pA)}% off. ${shopB} sells the same thing for ${money(priceB)} with ${f(pB)}% off. Which shop is <b>cheaper</b>?`,
        answer: { type: 'choice', value: cheaper, choices: opts.concat(['Both shops cost the same']) },
        hint: 'You cannot compare the percentages on their own — the normal prices are different. Work out both sale prices.',
        working: [
          `${shopA}: ${f(pA)}% of ${money(priceA)} = ${money(N.round(priceA - finalA, 2))}, so the sale price is ${money(finalA)}.`,
          `${shopB}: ${f(pB)}% of ${money(priceB)} = ${money(N.round(priceB - finalB, 2))}, so the sale price is ${money(finalB)}.`,
          `${money(Math.min(finalA, finalB))} is less than ${money(Math.max(finalA, finalB))}.`,
          `Cheaper shop: <b>${opts[cheaper]}</b>.`,
        ],
        finalAnswer: opts[cheaper], skill: 'compare-discounts',
      };
    }
    if (t === 'sale') {
      const p = level === 1 ? R.pick([10, 50, 25, 20]) : level === 2 ? R.pick([10, 20, 25, 30, 40, 15, 35]) : R.pick([15, 35, 45, 12.5, 65, 22, 33]);
      const price = amountFor(p, level === 3 ? 3 : 2, 20, level === 1 ? 200 : 400);
      const disc = pctOf(p, price), sale = N.round(price - disc, 2);
      const askSale = level === 1 ? R.chance(0.5) : true;
      return {
        prompt: `${shop} has ${f(p)}% off everything. ${item[0].toUpperCase() + item.slice(1)} normally costs ${money(price)}. ${askSale ? 'What is the sale price?' : 'How much money is taken off?'}`,
        answer: numAns(askSale ? sale : disc, { unit: '$' }),
        hint: `${hintFor(p)}${askSale ? ' Then subtract the discount from the normal price.' : ''}`,
        working: strategy(p, price).concat([`Discount = ${f(p)}% of ${money(price)} = ${money(disc)}.`, askSale ? `Sale price = ${money(price)} − ${money(disc)} = <b>${money(sale)}</b>.` : `Money off: <b>${money(disc)}</b>.`]),
        finalAnswer: money(askSale ? sale : disc), skill: 'discount',
      };
    }
    if (t === 'netball') {
      const played = level === 1 ? R.pick([10, 20]) : level === 2 ? R.pick([20, 25, 40, 50]) : R.pick([40, 80, 16, 200]);
      const won = R.int(1, played - 1);
      const ans = N.round(won / played * 100, 2);
      const team = R.pick(['netball', 'rugby', 'hockey', 'basketball', 'football']);
      return {
        prompt: `${who}'s ${team} team played ${played} games and won ${won}. What percentage of games did they win?`,
        answer: numAns(ans, { unit: '%' }),
        hint: `Fraction won = ${N.fracText(won, played)}. Make the bottom 100, or divide and × 100.`,
        working: [`Games won as a fraction: ${N.fracText(won, played)}.`, `${won} ÷ ${played} = ${f(N.round(won / played, 4))}, then × 100 = ${f(ans)}.`, `Win rate: <b>${f(ans)}%</b>.`],
        finalAnswer: `${f(ans)}%`, skill: 'as-pct',
      };
    }
    if (t === 'tip') {
      const p = level === 1 ? 10 : R.pick([10, 15, 20]);
      const bill = amountFor(p, 2, 20, level === 3 ? 300 : 120);
      const tip = pctOf(p, bill), total = N.round(bill + tip, 2);
      const askTotal = level > 1 && R.chance(0.5);
      return {
        prompt: `A family's restaurant bill is ${money(bill)}. They leave a ${p}% tip. ${askTotal ? 'How much do they pay altogether?' : 'How much is the tip?'}`,
        answer: numAns(askTotal ? total : tip, { unit: '$' }),
        hint: `${hintFor(p)}${askTotal ? ' Then add the tip to the bill.' : ''}`,
        working: strategy(p, bill).concat([`Tip = ${money(tip)}.`, askTotal ? `Total = ${money(bill)} + ${money(tip)} = <b>${money(total)}</b>.` : `Tip: <b>${money(tip)}</b>.`]),
        finalAnswer: money(askTotal ? total : tip), skill: 'pct-of',
      };
    }
    if (t === 'gst') {
      const q = gst(Math.min(level, 2));
      const a = R.step(20, level === 1 ? 200 : 400, level === 1 ? 20 : 2);
      const g = N.round(a * 0.15, 2), incl = N.round(a + g, 2);
      const ten = N.round(a / 10, 2), five = N.round(ten / 2, 2);
      q.prompt = `A tradie quotes ${money(a)} to fix a fence, plus 15% GST. What is the total price including GST?`;
      q.answer = numAns(incl, { unit: '$' });
      q.hint = `Find 15% of ${money(a)} (10% + 5%), then add it on.`;
      q.working = [`10% of ${money(a)} = ${money(ten)}, and 5% = ${money(five)}.`, `GST = ${money(ten)} + ${money(five)} = ${money(g)}.`, `Total = ${money(a)} + ${money(g)} = <b>${money(incl)}</b>.`];
      q.finalAnswer = money(incl);
      return q;
    }
    if (t === 'score') {
      const total = R.pick([10, 20, 25, 50]);
      const got = R.int(1, total - 1);
      const ans = N.round(got / total * 100, 2);
      return {
        prompt: `${who} scored ${got} out of ${total} in a spelling test. What is that as a percentage?`,
        answer: numAns(ans, { unit: '%' }),
        hint: `Make the fraction ${N.fracText(got, total)} into a fraction out of 100.`,
        working: [`${N.fracText(got, total)}: multiply top and bottom by ${100 / total}.`, `= ${f(ans)} out of 100.`, `Score: <b>${f(ans)}%</b>.`],
        finalAnswer: `${f(ans)}%`, skill: 'as-pct',
      };
    }
    if (t === 'population') {
      const p = level === 2 ? R.pick([5, 10, 20, 25, 15]) : R.pick([5, 15, 8, 12, 35, 4]);
      const town = R.pick(['Taupō', 'Whangārei', 'Timaru', 'Gisborne', 'Blenheim', 'Levin']);
      const base = R.step(2000, 20000, 100 / N.gcd(p, 100) * 10);
      const up = R.chance(0.7);
      const change = pctOf(p, base), ans = N.round(up ? base + change : base - change, 2);
      return {
        prompt: `The population of ${town} was ${f(base)}. It ${up ? 'grew' : 'fell'} by ${p}% over ten years. What is the population now?`,
        answer: numAns(ans),
        hint: `Find ${p}% of ${f(base)} first. Then ${up ? 'add it on' : 'take it off'}.`,
        working: strategy(p, base).concat([`${p}% of ${f(base)} = ${f(change)}.`, `${f(base)} ${up ? '+' : '−'} ${f(change)} = <b>${f(ans)}</b>.`]),
        finalAnswer: f(ans), skill: 'inc-dec',
      };
    }
    if (t === 'gstrev') {
      const excl = R.step(20, 600, R.pick([20, 2]));
      const incl = N.round(excl * 1.15, 2);
      return {
        prompt: `${who} buys ${item} for ${money(incl)}. This price includes 15% GST. How much was the price before GST?`,
        answer: numAns(excl, { unit: '$' }),
        hint: 'The price with GST is 115% of the original, so divide by 1.15. Do not just take off 15%.',
        working: [`Price including GST = original × 1.15.`, `Original = ${money(incl)} ÷ 1.15 = ${money(excl)}.`, `Check: ${money(excl)} × 1.15 = ${money(incl)}. Before GST: <b>${money(excl)}</b>.`],
        finalAnswer: money(excl), skill: 'gst-reverse',
      };
    }
    if (t === 'bank') {
      const rate = level === 1 ? R.pick([5, 10]) : level === 2 ? R.pick([4, 5, 6, 8, 10, 12]) : R.pick([3, 6, 7, 9, 4.5, 7.5]);
      const p = level === 1 ? R.step(200, 1000, 100) : level === 2 ? R.step(400, 4000, 200) : R.step(800, 9000, 400);
      const years = level === 1 ? R.int(1, 2) : level === 2 ? R.int(2, 4) : R.int(3, 5);
      const perYear = N.round(p * rate / 100, 2), I = N.round(perYear * years, 2), total = N.round(p + I, 2);
      const borrow = R.chance(0.4);
      const askTotal = borrow || R.chance(0.4);
      return {
        prompt: borrow
          ? `${who} borrows ${money(p)} to buy a second-hand scooter. The loan charges ${f(rate)}% simple interest per year and ${who} takes ${N.plural(years, 'year')} to pay it back. How much does ${who} pay back altogether?`
          : `${who} puts ${money(p)} in a savings account that pays ${f(rate)}% simple interest each year. ${askTotal ? `How much is in the account after ${N.plural(years, 'year')}?` : `How much interest is earned in ${N.plural(years, 'year')}?`}`,
        answer: numAns(askTotal ? total : I, { unit: '$' }),
        hint: `Find ${f(rate)}% of ${money(p)} for ONE year, then multiply by ${years}.${askTotal ? ` Then add it to the ${money(p)}.` : ''}`,
        working: [
          `Simple interest: <b>I = P × R × T</b>.`,
          `One year: ${f(rate)}% of ${money(p)} = ${money(perYear)}.`,
          `${N.plural(years, 'year')}: ${money(perYear)} × ${years} = ${money(I)}.`,
          askTotal ? `${borrow ? 'Pay back' : 'In the account'} = ${money(p)} + ${money(I)} = <b>${money(total)}</b>.` : `Interest: <b>${money(I)}</b>.`,
        ],
        finalAnswer: money(askTotal ? total : I), skill: 'interest',
      };
    }
    if (t === 'stall') {
      const pct = level === 1 ? R.pick([10, 20, 25, 50]) : level === 2 ? R.pick([5, 10, 15, 20, 25, 30, 40]) : R.pick([8, 12, 15, 24, 35, 45, 60]);
      const cost = amountFor(pct, 2, 20, level === 1 ? 120 : 400);
      const up = level === 1 ? true : R.chance(0.6);
      const diff = pctOf(pct, cost), sale = N.round(up ? cost + diff : cost - diff, 2);
      const thing = R.pick(['a second-hand bike', 'a box of feijoas', 'a skateboard', 'a phone case', 'a pair of rugby boots', 'a guitar']);
      return {
        prompt: `${who} bought ${thing} for ${money(cost)} and later sold it for ${money(sale)}. What was the percentage ${up ? 'profit' : 'loss'}?`,
        answer: numAns(pct, { unit: '%' }),
        hint: `Work out the ${up ? 'profit' : 'loss'} in dollars first, then divide by the price ${who} <b>paid</b> (${money(cost)}) and × 100.`,
        working: [
          `${up ? 'Profit' : 'Loss'} = ${up ? `${money(sale)} − ${money(cost)}` : `${money(cost)} − ${money(sale)}`} = ${money(diff)}.`,
          `Percentage ${up ? 'profit' : 'loss'} = ${up ? 'profit' : 'loss'} ÷ <b>what it cost</b> × 100.`,
          `${f(diff)} ÷ ${f(cost)} × 100 = ${f(pct)}.`,
          `<b>${f(pct)}% ${up ? 'profit' : 'loss'}</b>.`,
        ],
        finalAnswer: `${f(pct)}% ${up ? 'profit' : 'loss'}`, skill: 'profit-loss',
      };
    }
    // revsale: reverse percentage
    const p = R.pick([10, 20, 25, 30, 40, 50, 15]);
    const orig = amountFor(p, 2, 40, 400);
    const sale = N.round(orig * (100 - p) / 100, 2);
    return {
      prompt: `In a ${p}% off sale at ${shop}, ${item} costs ${money(sale)}. What was the original price?`,
      answer: numAns(orig, { unit: '$' }),
      hint: `The sale price is ${100 - p}% of the original. Find 1% (÷ ${100 - p}), then × 100.`,
      working: [
        `Sale price = ${100 - p}% of the original.`,
        `1% = ${money(sale)} ÷ ${100 - p} = ${money(N.round(sale / (100 - p), 2))}.`,
        `Original = 100% = ${money(N.round(sale / (100 - p), 2))} × 100 = <b>${money(orig)}</b>.`,
      ],
      finalAnswer: money(orig), skill: 'reverse',
    };
  }

  HL.registerTopic({
    id: 'percentages', subject: 'maths', strand: 'number', order: 12,
    name: 'Percentages', short: 'Percentages',
    blurb: 'Finding a percentage of an amount, percentage change, discounts and GST.',
    example: '25% of 80 = 20 &nbsp;·&nbsp; $40 + 15% GST = $46',
    animal: 'bunny',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      /** bar model: parts = [{w, f (fill), t (label), c (label colour), dash}] drawn left to right from x */
      const bar = (x, y, h, parts) => parts.map((p) => { const s = `<rect x="${x}" y="${y}" width="${p.w}" height="${h}" fill="${p.f}" stroke="${INK}" stroke-width="1.5"${p.dash ? ' stroke-dasharray="5 4"' : ''}/>` + (p.t ? T(x + p.w / 2, y + h / 2 + 5, p.t, p.c || INK, 'font-size="13"') : ''); x += p.w; return s; }).join('');
      const blocks = (n, w, fill, label) => Array.from({ length: n }, (_, i) => ({ w, f: typeof fill === 'function' ? fill(i) : fill, t: typeof label === 'function' ? label(i) : label, c: INK }));
      return {
        what: '<p><b>Percent</b> means "out of 100". Picture a cake cut into <b>100 equal slices</b>: 25% is 25 slices (a quarter of the cake), 10% is 10 slices, 1% is one slice. Percentages are everywhere: shop sales, GST on prices, test scores. Nearly every percentage question can be built from two friendly blocks: <b>10%</b> (÷ 10) and <b>1%</b> (÷ 100).</p>',
        visual: S(360, 205, `
          <text x="20" y="18" fill="${ROSE}">20% of 80</text><text x="340" y="18" text-anchor="end" fill="${INK}" font-size="13">80 ÷ 5 = 16 per part</text>
          ${bar(20, 26, 34, Array.from({ length: 5 }, (_, i) => ({ w: 64, f: i ? '#F9A8C9' : ROSE, t: '20%', c: i ? INK : '#fff' })))}
          ${[0, 1, 2, 3, 4].map((i) => T(52 + i * 64, 80, '16', i ? INK : ROSE)).join('')}
          <text x="20" y="106" fill="${BLUE}">GST 15% on $60</text>
          ${bar(20, 114, 34, [{ w: 278, f: '#A9D8F5', t: '100% = $60' }, { w: 42, f: '#FFC79A', t: '15%' }])}
          ${T(319, 166, '$9', ROSE)}
          <path d="M20 174 v8 h320 v-8" fill="none" stroke="${INK}" stroke-width="2"/>
          ${T(180, 200, '$60 + $9 = $69 with GST', GREEN)}
        `),
        facts: [
          '<b>10%</b> = ÷ 10 &nbsp;·&nbsp; <b>1%</b> = ÷ 100 &nbsp;·&nbsp; <b>50%</b> = half &nbsp;·&nbsp; <b>25%</b> = quarter',
          '<b>5%</b> = half of 10% &nbsp;·&nbsp; <b>15%</b> = 10% + 5%',
          '"of" means <b>×</b>: 40% of 60 = 0.4 × 60 = 24',
          '<b>GST 15%</b>: with GST = price <b>× 1.15</b> &nbsp;·&nbsp; back to the price = <b>÷ 1.15</b>',
          'Sale price = price − discount (<b>finish the job!</b>)',
          'Part as a %: <b>part ÷ whole × 100</b>: 18 out of 24 = 75%',
          '<b>Simple interest</b>: I = P × R × T ÷ 100. The <b>same</b> interest is added every year. Owed / saved altogether = <b>P + I</b>',
          '<b>% profit or loss</b> = difference ÷ <b>the price you paid</b> × 100',
        ],
        steps: [
          '<b>Percentage of an amount</b>: say "find 10% first". 10% = ÷ 10, 1% = ÷ 100, then build up. 30% of 240 → 10% = 24, so 30% = 72.',
          '<b>Increase or decrease</b>: say "find the percentage, then add it on or take it off". Decrease 80 by 25% → 25% of 80 = 20, so 80 − 20 = 60.',
          '<b>GST (15%)</b>: say "10% plus 5%". GST on $60 = 6 + 3 = $9, so the price with GST is $69. To go <b>backwards</b> from a GST-inclusive price, <b>÷ 1.15</b>.',
          '<b>One number as a % of another</b>: say "part over whole, then make it out of 100". 18 out of 24 = 18 ÷ 24 = 0.75 = 75%.',
          '<b>Reverse percentage</b> (find the original): say "what percent is the new amount?" After 20% off, $64 is 80%. 1% = 64 ÷ 80 = $0.80, so 100% = $80.',
        ],
        examples: [
          { q: 'Find 15% of $80', working: ['<b>Picture:</b> an $80 cake cut into 100 slices. 10% is 10 slices, 5% is 5 slices.', '1. Can I find 10% easily? Yes: 80 ÷ 10 = 8.', '2. Is 5% half of 10%? Yes: half of 8 = 4.', '3. 15% = 10% + 5% = 8 + 4.', '15% of $80 = $12'], a: '$12',
            visual: S(340, 100, `${bar(20, 26, 32, blocks(10, 30, (i) => (i === 0 ? ROSE : '#F9A8C9'), '8'))}
              <rect x="50" y="26" width="15" height="32" fill="#FFC79A" stroke="${INK}" stroke-width="1.5"/>${T(65, 47, '8', INK, 'font-size="13"')}
              ${T(35, 17, '10% = 8', ROSE, 'font-size="13"')}${T(70, 78, '5% = 4', BLUE, 'font-size="13"')}
              ${T(180, 97, '15% = 8 + 4 = 12', GREEN)}`) },
          { q: 'Find 35% of 240', working: ['<b>Picture:</b> a cake of 240 in 100 slices. 10% = 10 slices.', '1. 10% first: 240 ÷ 10 = 24.', '2. 30% = 3 lots of 10% = 3 × 24 = 72.', '3. 5% = half of 10% = 12.', '4. 35% = 30% + 5% = 72 + 12.', '35% of 240 = 84'], a: '84' },
          { q: 'A $120 jacket is 30% off. What is the sale price?', working: ['<b>Picture:</b> a $120 cake in 100 slices. 30 slices are taken away; I <b>pay for the 70 that are left</b>.', '1. 10% first: 120 ÷ 10 = 12.', '2. 30% off = 3 × 12 = 36 taken away.', '3. Have I finished? No! Sale price = 120 − 36.', '$120 − $36 = $84'], a: '$84',
            visual: S(340, 92, `${bar(20, 24, 34, blocks(10, 30, (i) => (i < 3 ? ROSE : '#A9D8F5'), '12'))}
              ${T(65, 16, '30% off = 36', ROSE, 'font-size="13"')}${T(215, 16, 'pay 70% = 84', BLUE, 'font-size="13"')}${T(170, 84, '120 − 36 = 84', GREEN)}`) },
          { q: 'Add 15% GST to a $60 bill', working: ['<b>Picture:</b> the $60 cake is 100 slices. GST adds <b>15 extra slices</b> on the end.', '1. 10% of 60 = 6.', '2. 5% = half of 10% = 3.', '3. GST = 6 + 3 = $9.', '4. Have I finished? No — add it on: 60 + 9.', 'With GST: $69'], a: '$69',
            visual: S(340, 104, `<text x="20" y="18" fill="${ROSE}" font-size="13">GST = 10% + 5% = 6 + 3 = $9</text>
              ${bar(20, 28, 34, [{ w: 260, f: '#A9D8F5', t: '100% = $60' }, { w: 39, f: '#FFC79A', t: '15%' }])}
              ${T(299, 82, '+ $9', ROSE, 'font-size="13"')}${T(150, 98, '$60 + $9 = $69', GREEN)}`) },
          { q: 'Harper scored 18 out of 24 in a quiz. What percentage is that?', working: ['<b>Picture:</b> the quiz cake has 24 slices, but a percentage needs <b>100 slices</b>. I re-cut it.', '1. Part over whole: 18/24.', '2. Can I simplify? ÷ 6 → 3/4.', '3. 3/4 as a percent: 3 ÷ 4 = 0.75 → × 100 = 75.', '18 out of 24 = 75%'], a: '75%' },
          { q: 'Harper buys a hoodie for $64 in a 20% off sale. What was the full price?', working: ['<b>Picture:</b> the full-price cake is 100 slices. 20 were taken off, so the $64 she paid is only <b>80 slices</b>.', '1. What percent is $64? 100% − 20% = 80%.', '2. One block of 10%: 64 ÷ 8 = $8.', '3. Full price = 10 blocks = 8 × 10.', 'Full price = $80'], a: '$80',
            visual: S(340, 108, `${bar(20, 24, 34, blocks(8, 30, '#A9D8F5', '$8').concat([{ w: 30, f: '#fff', dash: true }, { w: 30, f: '#fff', dash: true }]))}
              ${T(140, 16, '80% = $64 (8 blocks)', BLUE, 'font-size="13"')}${T(290, 16, '20% off', ROSE, 'font-size="13"')}
              ${T(170, 80, '1 block = 64 ÷ 8 = $8', INK, 'font-size="13"')}${T(170, 100, '10 blocks = $80', GREEN)}`) },
          { q: '$500 is saved for 3 years at 4% simple interest per year. How much interest is earned?', working: ['<b>Picture:</b> every year the bank adds the <b>same</b> slice of cake. Three years = three identical slices (simple interest never changes size).', '1. What is ONE year worth? 1% of 500 = 5, so 4% = 4 × 5 = $20.', '2. How many years? 3. So 20 × 3 = $60.', '3. Was I asked for the total? No, just the interest.', 'Interest = $60 (the account holds $560)'], a: '$60',
            visual: S(340, 112, `${T(95, 18, 'money in (P) = $500', BLUE, 'font-size="13"')}${T(250, 18, '3 years of interest', ROSE, 'font-size="13"')}
              ${bar(20, 26, 32, [{ w: 150, f: '#A9D8F5', t: '$500' }, { w: 40, f: '#FFC79A', t: '$20' }, { w: 40, f: '#FFC79A', t: '$20' }, { w: 40, f: '#FFC79A', t: '$20' }])}
              ${T(170, 82, '4% of $500 = $20 every year', ROSE, 'font-size="13"')}${T(170, 104, '$20 × 3 years = $60', GREEN)}`) },
          { q: 'Harper buys a bike for $80 and sells it for $100. What is her percentage profit?', working: ['<b>Picture:</b> the cake is the price she <b>paid</b> ($80 = 100 slices). The profit is extra slices stacked on the end.', '1. Profit in dollars: 100 − 80 = $20.', '2. Out of what? Always out of what she <b>paid</b>: 20 out of 80.', '3. One block of 25%: 80 ÷ 4 = 20, and the profit is exactly one block.', 'Percentage profit = 25%'], a: '25% profit',
            visual: S(340, 116, `${T(130, 20, 'paid $80 = 100%', BLUE, 'font-size="13"')}${T(300, 20, 'profit', ROSE, 'font-size="13"')}
              ${bar(20, 28, 32, blocks(4, 52, '#A9D8F5', '$20').concat([{ w: 52, f: '#FFC79A', t: '$20' }]))}
              ${T(170, 84, 'each block = $20 = 25% of $80', INK, 'font-size="13"')}${T(170, 108, '$20 profit → 25% profit', GREEN)}`) },
        ],
        tips: [
          '"Of" means multiply: 40% of 60 = 0.4 × 60 = 24.',
          'Sale price = normal price − discount. Do not stop after finding the discount!',
          'To undo a 15% increase, divide by 1.15. Taking 15% off the new price gives the WRONG answer.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
