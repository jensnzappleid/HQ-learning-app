/* Topic: Estimation & mental strategies (rounding to estimate, compensation, doubling/halving, ×5 ×25 ×50 tricks) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = (x) => N.fmt(x);
  const numAns = (v, extra) => Object.assign({ type: 'number', value: v }, Number.isInteger(v) ? {} : { tolerance: 0.0001 }, extra || {});
  /** estimate answer: value is the rounded-number estimate; tolerance is generous (12%), and always covers the exact answer */
  function estAns(est, exact, extra) {
    const tol = Math.max(Math.abs(est) * 0.12, Math.abs(exact - est) * 1.05, 0.5);
    return Object.assign({ type: 'number', value: est, tolerance: N.round(tol, 3) }, extra || {});
  }
  const roundTo = (x, place) => Math.round(x / place) * place;
  /** a number close to a round number so the estimate is good: e.g. near a multiple of `place` */
  const nearRound = (lo, hi, place) => { const base = R.step(lo, hi, place); const off = R.pick([-2, -1, 1, 2]); return base + off * (place / 10 >= 1 ? place / 10 : 1) ; };
  const names = ['Harper', 'Mia', 'Aroha', 'Liam', 'Tane', 'Ella', 'Noah', 'Ruby'];
  const ESTIMATE = 'Estimate (round each number first):';

  // ---------- estimating ----------
  function estMul(level) {
    let a, b, ra, rb, place;
    if (level === 1) { a = nearRound(20, 90, 10); b = R.pick([3, 4, 5, 6, 7, 8, 9, 11, 12]); ra = roundTo(a, 10); rb = b; place = 10; }
    else if (level === 2) { a = nearRound(20, 90, 10); b = nearRound(20, 90, 10); ra = roundTo(a, 10); rb = roundTo(b, 10); place = 10; }
    else { a = nearRound(200, 900, 100); b = R.pick([4, 6, 7, 8, 9, 12]); ra = roundTo(a, 100); rb = b; place = 100; }
    const est = ra * rb, exact = a * b;
    return {
      prompt: `${ESTIMATE} ${a} × ${b}`,
      answer: estAns(est, exact),
      hint: `Round ${a} to the nearest ${place}${level === 2 ? ` and ${b} to the nearest 10` : ''}, then multiply the easy numbers.`,
      working: [
        `${a} rounds to ${ra}${level === 2 ? ` and ${b} rounds to ${rb}` : ''}.`,
        `${ra} × ${rb} = ${f(est)}.`,
        `Estimate: <b>about ${f(est)}</b> (the exact answer is ${f(exact)}).`,
      ],
      finalAnswer: `about ${f(est)}`, skill: 'estimate',
    };
  }
  function estAddSub(level) {
    const place = level === 1 ? 10 : 100;
    const a = level === 1 ? R.int(21, 98) : R.int(120, 980), b = level === 1 ? R.int(21, 98) : R.int(120, 980);
    const op = R.pick(['+', '−']);
    const [x, y] = op === '−' && b > a ? [b, a] : [a, b];
    const rx = roundTo(x, place), ry = roundTo(y, place);
    const est = op === '+' ? rx + ry : rx - ry, exact = op === '+' ? x + y : x - y;
    if (op === '−' && est === 0) return estAddSub(level);
    return {
      prompt: `${ESTIMATE} ${x} ${op} ${y}`,
      answer: estAns(est, exact),
      hint: `Round both numbers to the nearest ${place}, then ${op === '+' ? 'add' : 'subtract'}.`,
      working: [`${x} → ${rx} and ${y} → ${ry}.`, `${rx} ${op} ${ry} = ${f(est)}.`, `Estimate: <b>about ${f(est)}</b> (exact: ${f(exact)}).`],
      finalAnswer: `about ${f(est)}`, skill: 'estimate',
    };
  }
  function estDiv(level) {
    const b = level === 1 ? R.pick([2, 3, 4, 5]) : R.pick([3, 4, 6, 7, 8, 9]);
    const q = level === 1 ? R.int(2, 9) * 10 : level === 2 ? R.int(2, 9) * 10 : R.int(2, 9) * 100;
    const nice = q * b;
    const a = nice + R.pick([-3, -2, -1, 1, 2, 3, 4]) * (level === 3 ? 10 : 1);
    return {
      prompt: `${ESTIMATE} ${a} ÷ ${b}`,
      answer: estAns(q, a / b),
      hint: `Round ${a} to a number that ${b} divides into easily. ${nice} is close and ${nice} ÷ ${b} is easy.`,
      working: [`${a} is close to ${nice}, and ${nice} is in the ${b} times table.`, `${nice} ÷ ${b} = ${q}.`, `Estimate: <b>about ${q}</b>.`],
      finalAnswer: `about ${q}`, skill: 'estimate',
    };
  }
  function estDecimal() {
    if (R.chance(0.5)) {
      const a = R.pick([1.9, 2.1, 2.9, 3.1, 3.9, 4.1, 4.9, 5.1, 5.9, 6.1, 6.9, 7.1, 7.9, 8.1, 8.9, 9.1]);
      const b = R.pick([1.9, 2.1, 2.9, 3.1, 3.9, 4.1, 4.9, 5.1, 5.9, 6.1, 6.9, 7.1, 7.9, 8.1, 8.9, 9.1, 10.2, 9.8]);
      const ra = Math.round(a), rb = Math.round(b);
      return {
        prompt: `${ESTIMATE} ${f(a)} × ${f(b)}`,
        answer: estAns(ra * rb, a * b),
        hint: 'Round each decimal to the nearest whole number, then multiply.',
        working: [`${f(a)} → ${ra} and ${f(b)} → ${rb}.`, `${ra} × ${rb} = ${ra * rb}.`, `Estimate: <b>about ${ra * rb}</b> (exact: ${f(N.round(a * b, 2))}).`],
        finalAnswer: `about ${ra * rb}`, skill: 'estimate',
      };
    }
    const p = R.pick([9, 11, 19, 21, 24, 26, 49, 51, 74, 76]);
    const rp = p < 15 ? 10 : p < 23 ? 20 : p < 30 ? 25 : p < 60 ? 50 : 75;
    const a = nearRound(200, 900, 100);
    const ra = roundTo(a, 100);
    const est = rp * ra / 100, exact = p * a / 100;
    return {
      prompt: `${ESTIMATE} ${p}% of ${a}`,
      answer: estAns(est, exact),
      hint: `${p}% is close to ${rp}%, and ${a} is close to ${ra}. Find ${rp}% of ${ra}.`,
      working: [`${p}% → ${rp}% and ${a} → ${ra}.`, `${rp}% of ${ra} = ${f(est)}.`, `Estimate: <b>about ${f(est)}</b> (exact: ${f(exact)}).`],
      finalAnswer: `about ${f(est)}`, skill: 'estimate',
    };
  }

  // ---------- exact mental strategies ----------
  function compensation(level) {
    if (level === 1 || R.chance(0.35)) {
      // addition/subtraction near a round number: 199 + 46, 58 + 39, 245 − 99
      const near = level === 1 ? R.pick([9, 19, 29, 39, 49]) : R.pick([99, 199, 299, 98, 149]);
      const other = level === 1 ? R.int(23, 88) : R.int(123, 688);
      const op = R.pick(['+', '−']);
      const round = near + (near % 10 === 8 ? 2 : 1), diff = round - near;
      const ans = op === '+' ? other + near : other - near;
      return {
        prompt: `Use a mental strategy: ${other} ${op} ${near} = ?`,
        answer: numAns(ans),
        hint: `${near} is ${diff} less than ${round}. ${op === '+' ? 'Add' : 'Subtract'} ${round}, then fix it up by ${diff}.`,
        working: [
          `${near} = ${round} − ${diff}.`,
          op === '+' ? `${other} + ${round} = ${other + round}, but that is ${diff} too many, so take ${diff} off.` : `${other} − ${round} = ${other - round}, but that took away ${diff} too many, so add ${diff} back.`,
          `Answer: <b>${f(ans)}</b>.`,
        ],
        finalAnswer: f(ans), skill: 'compensation',
      };
    }
    const near = level === 2 ? R.pick([9, 19, 29, 99, 101, 21]) : R.pick([99, 98, 199, 101, 102, 201, 49, 51]);
    const k = level === 2 ? R.int(3, 9) : R.int(3, 12);
    const round = roundTo(near, near < 15 ? 10 : near < 60 ? 10 : 100), diff = near - round;
    const ans = near * k;
    return {
      prompt: `Use a mental strategy: ${near} × ${k} = ?`,
      answer: numAns(ans),
      hint: `${near} is close to ${round}. Work out ${round} × ${k}, then ${diff < 0 ? 'take off' : 'add'} ${Math.abs(diff)} × ${k}.`,
      working: [
        `${near} = ${round} ${diff < 0 ? '−' : '+'} ${Math.abs(diff)}.`,
        `${round} × ${k} = ${round * k} and ${Math.abs(diff)} × ${k} = ${Math.abs(diff) * k}.`,
        `${round * k} ${diff < 0 ? '−' : '+'} ${Math.abs(diff) * k} = <b>${f(ans)}</b>.`,
      ],
      finalAnswer: f(ans), skill: 'compensation',
    };
  }
  function doubleHalve(level) {
    const pairs = level === 1 ? [[14, 5], [18, 5], [16, 5], [12, 15], [6, 15], [8, 25], [4, 35], [22, 5]]
      : level === 2 ? [[16, 25], [12, 25], [24, 25], [18, 15], [14, 15], [8, 45], [6, 35], [36, 5], [28, 5], [32, 25]]
      : [[16, 35], [24, 45], [48, 25], [32, 15], [64, 25], [28, 45], [36, 15], [56, 25], [44, 15]];
    const [a, b] = R.pick(pairs);
    const ans = a * b;
    const steps = [];
    let x = a, y = b;
    while (x % 2 === 0 && steps.length < 3 && !(y % 10 === 0 || y % 100 === 0) ) { x /= 2; y *= 2; steps.push(`${x} × ${y}`); }
    return {
      prompt: `Use doubling and halving: ${a} × ${b} = ?`,
      answer: numAns(ans),
      hint: `Halve ${a} and double ${b}: ${a / 2} × ${b * 2}. Keep going until one number is easy.`,
      working: [`${a} × ${b} = ${steps.join(' = ')} (halve one, double the other).`, `${x} × ${y} = ${f(ans)}.`, `Answer: <b>${f(ans)}</b>.`],
      finalAnswer: f(ans), skill: 'double-halve',
    };
  }
  function nearDoubles() {
    const a = R.int(15, 88);
    const off = R.pick([1, 2, 1]);
    const b = a + off;
    const ans = a + b;
    return {
      prompt: `Use near doubles: ${a} + ${b} = ?`,
      answer: numAns(ans),
      hint: `${b} is ${off} more than ${a}. Double ${a}, then add ${off}.`,
      working: [`Double ${a} = ${2 * a}.`, `${2 * a} + ${off} = ${ans}.`, `Answer: <b>${ans}</b>.`],
      finalAnswer: f(ans), skill: 'near-doubles',
    };
  }
  function times5(level) {
    const m = level === 1 ? 5 : R.pick([5, 50, 25]);
    const a = m === 25 ? R.pick([12, 16, 24, 28, 32, 36, 44, 48, 52, 64, 72, 84]) : level === 1 ? R.int(12, 48) : R.int(14, 96);
    const ans = a * m;
    const working = m === 25
      ? [`× 25 is the same as × 100 then ÷ 4.`, `${a} × 100 = ${a * 100}, and ${a * 100} ÷ 4 = ${ans}.`, `Answer: <b>${f(ans)}</b>.`]
      : m === 50
        ? [`× 50 is the same as × 100 then ÷ 2.`, `${a} × 100 = ${a * 100}, and ${a * 100} ÷ 2 = ${ans}.`, `Answer: <b>${f(ans)}</b>.`]
        : [`× 5 is the same as × 10 then ÷ 2.`, `${a} × 10 = ${a * 10}, and ${a * 10} ÷ 2 = ${ans}.`, `Answer: <b>${f(ans)}</b>.`];
    return {
      prompt: `Use a mental strategy: ${a} × ${m} = ?`,
      answer: numAns(ans),
      hint: m === 25 ? 'Multiply by 100, then divide by 4.' : m === 50 ? 'Multiply by 100, then halve.' : 'Multiply by 10, then halve.',
      working, finalAnswer: f(ans), skill: 'times-5',
    };
  }
  function mentalSub(level) {
    const from = level === 1 ? 100 : level === 2 ? 1000 : R.pick([1000, 5000, 10000]);
    const b = level === 1 ? R.int(11, 89) : level === 2 ? R.int(101, 899) : R.int(from === 10000 ? 1001 : 101, from - 101);
    const ans = from - b;
    const up1 = Math.ceil(b / 10) * 10, up2 = Math.ceil(b / 100) * 100;
    const working = level === 1
      ? [`Count up from ${b}: ${b} → ${up1} is ${up1 - b}, then ${up1} → 100 is ${100 - up1}.`, `${up1 - b} + ${100 - up1} = ${ans}.`, `Answer: <b>${ans}</b>.`]
      : [`Count up from ${b}: to ${up1} is ${up1 - b}, to ${up2} is ${up2 - up1}, to ${f(from)} is ${f(from - up2)}.`, `${up1 - b} + ${up2 - up1} + ${f(from - up2)} = ${f(ans)}.`, `Answer: <b>${f(ans)}</b>.`];
    return {
      prompt: `Work it out in your head: ${f(from)} − ${b} = ?`,
      answer: numAns(ans),
      hint: `Count up from ${b} to the next ten, then to the next hundred, then to ${f(from)}. Add up the jumps.`,
      working, finalAnswer: f(ans), skill: 'mental-sub',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['estMul', 'estAdd', 'estDiv', 'comp', 'dh', 'near', 't5', 'sub']
      : level === 2 ? ['estMul', 'estAdd', 'estDiv', 'comp', 'comp', 'dh', 't5', 'sub']
      : ['estMul', 'estDiv', 'estDec', 'estDec', 'comp', 'dh', 't5', 'sub'];
    const t = R.pick(pool);
    if (t === 'estMul') return estMul(level);
    if (t === 'estAdd') return estAddSub(level);
    if (t === 'estDiv') return estDiv(level);
    if (t === 'estDec') return estDecimal();
    if (t === 'comp') return compensation(level);
    if (t === 'dh') return doubleHalve(level);
    if (t === 'near') return nearDoubles();
    if (t === 't5') return times5(level);
    return mentalSub(level);
  }

  // ---------- word ----------
  function reasonable(level) {
    let a, b;
    if (level === 1) { a = nearRound(20, 90, 10); b = R.int(3, 9); }
    else if (level === 2) { a = nearRound(20, 90, 10); b = nearRound(20, 60, 10); }
    else { a = nearRound(200, 900, 100); b = nearRound(20, 50, 10); }
    const exact = a * b;
    const ra = roundTo(a, level === 3 ? 100 : 10), rb = level === 1 ? b : roundTo(b, 10);
    // distractors are decimal-point slips only (× 10, ÷ 10, × 100) so the estimate clearly picks out the right one
    const wrong = [exact * 10, Math.round(exact / 10), exact * 100];
    const options = R.shuffle([exact].concat(wrong));
    const who = R.pick(names);
    return {
      prompt: `${who} worked out ${a} × ${b} on a calculator. Which of these answers is reasonable? (Estimate first: ${ra} × ${rb}.)`,
      answer: { type: 'choice', value: options.indexOf(exact), choices: options.map((o) => f(o)) },
      hint: `${ra} × ${rb} = ${f(ra * rb)}. Pick the answer closest to that.`,
      working: [`Estimate: ${a} → ${ra}, ${b} → ${rb}, so ${ra} × ${rb} = ${f(ra * rb)}.`, `The only answer near ${f(ra * rb)} is ${f(exact)}.`, `Reasonable answer: <b>${f(exact)}</b>.`],
      finalAnswer: f(exact), skill: 'reasonable',
    };
  }
  /** a price like 4.95 / 12.10 that rounds cleanly to the nearest dollar */
  const nicePrice = (lo, hi) => N.round(R.int(lo, hi) + R.pick([-0.15, -0.1, -0.05, 0.05, 0.1, 0.15, 0.2, 0.25]), 2);
  const listMoney = (arr) => arr.map((p) => N.money(p)).join(', ').replace(/, ([^,]*)$/, ' and $1');

  /** LEVEL 1 — round ONE thing to the nearest 10 or nearest dollar, then one operation */
  function wordL1() {
    const t = R.pick(['shop', 'bus', 'boxes', 'walk', 'icecream', 'reasonable']);
    const who = R.pick(names);
    if (t === 'reasonable') return reasonable(1);
    if (t === 'shop') {
      const prices = [nicePrice(2, 9), nicePrice(2, 12)];
      const rounded = prices.map((p) => Math.round(p));
      const est = rounded[0] + rounded[1], exact = N.round(prices[0] + prices[1], 2);
      return {
        prompt: `${who} buys two things at the dairy costing ${listMoney(prices)}. Estimate the total by rounding each price to the nearest dollar.`,
        answer: estAns(est, exact, { unit: '$' }),
        hint: 'Round each price to the nearest whole dollar, then add the two whole dollars.',
        working: [`<b>Picture:</b> shopping in your head — swap the awkward prices for friendly ones.`, `${N.money(prices[0])} → $${rounded[0]} and ${N.money(prices[1])} → $${rounded[1]}.`, `$${rounded[0]} + $${rounded[1]} = $${est}.`, `Estimate: <b>about $${est}</b> (exact: ${N.money(exact)}).`],
        finalAnswer: `about $${est}`, skill: 'estimate',
      };
    }
    if (t === 'bus') {
      const per = R.pick([48, 49, 51, 52, 38, 41, 29, 31]), n = R.pick([3, 4, 5, 6]);
      const rp = roundTo(per, 10);
      return {
        prompt: `Each bus carries ${per} students. There are ${n} buses going to the school swimming sports. About how many students can travel? (Round the number on each bus first.)`,
        answer: estAns(rp * n, per * n, { unit: 'students' }),
        hint: `${per} is about ${rp}. Now do ${rp} × ${n}.`,
        working: [`<b>Picture:</b> ${n} buses, each with about ${rp} kids on board.`, `${per} → ${rp}.`, `${rp} × ${n} = ${f(rp * n)}.`, `About <b>${f(rp * n)} students</b>.`],
        finalAnswer: `about ${f(rp * n)}`, skill: 'estimate',
      };
    }
    if (t === 'boxes') {
      const per = R.pick([2, 3, 4, 5]);
      const q = R.int(2, 9) * 5;
      const nice = q * per;
      const total = nice + R.pick([-3, -2, -1, 1, 2, 3]);
      return {
        prompt: `Harper packs ${total} kiwifruit into boxes that hold ${per} each. About how many boxes will she need? (Estimate first.)`,
        answer: estAns(q, total / per, { unit: 'boxes' }),
        hint: `${total} is close to ${nice}, and ${nice} ÷ ${per} is easy.`,
        working: [`<b>Picture:</b> swap ${total} for a friendly number in the ${per} times table.`, `${total} is about ${nice}.`, `${nice} ÷ ${per} = ${q}.`, `About <b>${q} boxes</b>.`],
        finalAnswer: `about ${q}`, skill: 'estimate',
      };
    }
    if (t === 'walk') {
      const d = R.pick([180, 220, 290, 310, 380, 420, 480, 520]), days = R.pick([4, 5]);
      const rd = roundTo(d, 100), trips = days * 2;
      return {
        prompt: `Harper walks ${d} m to school. She makes that trip twice a day for ${days} days. About how many metres does she walk? (Round the distance first.)`,
        answer: estAns(rd * trips, d * trips, { unit: 'm' }),
        hint: `${d} rounds to ${rd}. She makes ${days} × 2 = ${trips} trips.`,
        working: [`<b>Picture:</b> the same walk over and over, so it is a times table.`, `${d} → ${rd}.`, `Trips: ${days} × 2 = ${trips}.`, `${rd} × ${trips} = ${f(rd * trips)}.`, `About <b>${f(rd * trips)} m</b>.`],
        finalAnswer: `about ${f(rd * trips)} m`, skill: 'estimate',
      };
    }
    const price = nicePrice(3, 8), n = R.int(3, 8);
    const rp = Math.round(price);
    return {
      prompt: `Ice creams at the dairy cost ${N.money(price)} each. About how much would ${n} of them cost? (Round the price to the nearest dollar first.)`,
      answer: estAns(rp * n, price * n, { unit: '$' }),
      hint: `${N.money(price)} is about $${rp}. Now do $${rp} × ${n}.`,
      working: [`<b>Picture:</b> pretend each ice cream is a nice round $${rp}.`, `${N.money(price)} → $${rp}.`, `$${rp} × ${n} = $${rp * n}.`, `About <b>$${rp * n}</b> (exact: ${N.money(N.round(price * n, 2))}).`],
      finalAnswer: `about $${rp * n}`, skill: 'estimate',
    };
  }

  /** LEVEL 2 — three numbers, percentages, or an add-then-subtract */
  function wordL2() {
    const t = R.pick(['gala', 'book', 'pct', 'tramp', 'change', 'reasonable']);
    const who = R.pick(names);
    if (t === 'reasonable') return reasonable(2);
    if (t === 'gala') {
      const prices = [nicePrice(3, 12), nicePrice(4, 15), nicePrice(2, 10)];
      const rounded = prices.map((p) => Math.round(p));
      const est = rounded.reduce((s, x) => s + x, 0), exact = N.round(prices.reduce((s, x) => s + x, 0), 2);
      return {
        prompt: `At the school gala Harper spends ${listMoney(prices)} on three stalls. Estimate what she spent altogether by rounding each amount to the nearest dollar.`,
        answer: estAns(est, exact, { unit: '$' }),
        hint: 'Round all three prices to the nearest whole dollar, then add them.',
        working: [`<b>Picture:</b> three friendly whole-dollar prices instead of three awkward ones.`, `Rounded: ${rounded.map((r) => '$' + r).join(' + ')}.`, `= $${est}.`, `Estimate: <b>about $${est}</b> (exact: ${N.money(exact)}).`],
        finalAnswer: `about $${est}`, skill: 'estimate',
      };
    }
    if (t === 'book') {
      const pages = R.pick([198, 203, 289, 312, 396, 407]), per = R.pick([19, 21, 29, 31, 38, 42]);
      const rp = roundTo(pages, 100), rr = roundTo(per, 10);
      return {
        prompt: `A book has ${pages} pages with about ${per} lines on each page. About how many lines are in the whole book? (Round both numbers first.)`,
        answer: estAns(rp * rr, pages * per, { unit: 'lines' }),
        hint: `Round ${pages} to ${rp} and ${per} to ${rr}, then multiply.`,
        working: [`<b>Picture:</b> a stack of pages, each with about the same number of lines.`, `${pages} → ${rp} and ${per} → ${rr}.`, `${rp} × ${rr} = ${f(rp * rr)}.`, `About <b>${f(rp * rr)} lines</b>.`],
        finalAnswer: `about ${f(rp * rr)}`, skill: 'estimate',
      };
    }
    if (t === 'pct') {
      const p = R.pick([9, 11, 19, 21, 24, 26, 49, 51]);
      const rp = p < 15 ? 10 : p < 23 ? 20 : p < 30 ? 25 : 50;
      const total = nearRound(200, 900, 100), rt = roundTo(total, 100);
      return {
        prompt: `A school has ${total} students and about ${p}% of them walk to school. About how many students walk? (Round both numbers first.)`,
        answer: estAns(rp * rt / 100, p * total / 100, { unit: 'students' }),
        hint: `${p}% is about ${rp}% and ${total} is about ${rt}. Find ${rp}% of ${rt}.`,
        working: [`<b>Picture:</b> cut the school into ${rp === 50 ? 'halves' : rp === 25 ? 'quarters' : rp === 20 ? '5 equal parts' : '10 equal parts'}.`, `${p}% → ${rp}% and ${total} → ${rt}.`, `${rp}% of ${rt} = ${f(rp * rt / 100)}.`, `About <b>${f(rp * rt / 100)} students</b>.`],
        finalAnswer: `about ${f(rp * rt / 100)}`, skill: 'estimate',
      };
    }
    if (t === 'tramp') {
      const speed = R.pick([3.9, 4.1, 4.9, 5.1, 2.9, 3.1]);
      const rs = Math.round(speed);
      const hours = R.int(3, 6);
      const dist = N.round(rs * hours + R.pick([-0.4, -0.2, 0.3, 0.6]), 1);
      const rd = Math.round(dist);
      return {
        prompt: `A tramping track is ${f(dist)} km long and ${who} walks about ${f(speed)} km each hour. About how many hours will the walk take? (Round both numbers first.)`,
        answer: estAns(N.round(rd / rs, 2), dist / speed, { unit: 'hours' }),
        hint: `Round ${f(dist)} to ${rd} km and ${f(speed)} to ${rs} km/h, then divide.`,
        working: [`<b>Picture:</b> how many ${rs} km chunks fit into the track?`, `${f(dist)} → ${rd} and ${f(speed)} → ${rs}.`, `${rd} ÷ ${rs} = ${f(N.round(rd / rs, 2))}.`, `About <b>${f(N.round(rd / rs, 2))} hours</b>.`],
        finalAnswer: `about ${f(N.round(rd / rs, 2))} hours`, skill: 'estimate',
      };
    }
    const prices = [nicePrice(4, 14), nicePrice(3, 11)];
    const rounded = prices.map((p) => Math.round(p));
    const spent = rounded[0] + rounded[1];
    const paid = R.pick([20, 30, 40, 50]);
    const exactChange = N.round(paid - prices[0] - prices[1], 2);
    if (paid - spent < 3) return wordL2();
    return {
      prompt: `Harper pays with $${paid} at The Warehouse for things costing ${listMoney(prices)}. Estimate the change she should get.`,
      answer: estAns(paid - spent, exactChange, { unit: '$' }),
      hint: 'Two steps: round and add the prices first, then take that away from what she paid.',
      working: [
        `<b>Picture:</b> round the prices up to friendly dollars, add them, then count back from $${paid}.`,
        `1. ${N.money(prices[0])} → $${rounded[0]} and ${N.money(prices[1])} → $${rounded[1]}.`,
        `2. Total spent: $${rounded[0]} + $${rounded[1]} = $${spent}.`,
        `3. Change: $${paid} − $${spent} = $${paid - spent}.`,
        `Estimate: <b>about $${paid - spent}</b> (exact: ${N.money(exactChange)}).`,
      ],
      finalAnswer: `about $${paid - spent}`, skill: 'estimate',
    };
  }

  /** LEVEL 3 — check a total, decide if money is enough, decide above or below, three-number estimates */
  function wordL3() {
    const t = R.pick(['receipt', 'enough', 'aboveBelow', 'classes', 'minutes', 'reasonable']);
    const who = R.pick(names);
    if (t === 'reasonable') return reasonable(3);
    if (t === 'receipt') {
      const prices = [nicePrice(3, 12), nicePrice(4, 18), nicePrice(2, 9), nicePrice(5, 20), nicePrice(3, 14)];
      const rounded = prices.map((p) => Math.round(p));
      const est = rounded.reduce((s, x) => s + x, 0);
      const exact = N.round(prices.reduce((s, x) => s + x, 0), 2);
      const kind = R.pick(['right', 'big', 'small']);
      const printed = kind === 'right' ? exact
        : kind === 'big' ? N.round(exact + Math.max(12, Math.round(exact * 0.5)), 2)
          : N.round(exact - Math.max(12, Math.round(exact * 0.45)), 2);
      const choices = ['About right', 'No — the printed total is far too big', 'No — the printed total is far too small'];
      const idx = kind === 'right' ? 0 : kind === 'big' ? 1 : 2;
      return {
        prompt: `A supermarket receipt lists ${listMoney(prices)}, and the printed total is <b>${N.money(printed)}</b>. Estimate the total in your head. Does the printed total look right?`,
        answer: { type: 'choice', value: idx, choices },
        hint: 'Round every price to the nearest dollar and add them up. Then compare that estimate with the printed total.',
        working: [
          `<b>Picture:</b> you are at the checkout with no calculator — friendly dollars only.`,
          `1. Round each price: ${rounded.map((r) => '$' + r).join(' + ')}.`,
          `2. Estimate of the total: <b>$${est}</b>.`,
          `3. The receipt says ${N.money(printed)}. ${kind === 'right' ? 'That is very close to $' + est + ', so it looks fine.' : kind === 'big' ? 'That is much <b>more</b> than $' + est + ' — something has been charged twice or typed wrong.' : 'That is much <b>less</b> than $' + est + ' — something has been missed.'}`,
          `Answer: <b>${choices[idx]}</b>.`,
        ],
        finalAnswer: choices[idx], skill: 'reasonable',
      };
    }
    if (t === 'enough') {
      const budget = R.pick([50, 60, 80, 100]);
      let prices, exact, est;
      let guard = 0;
      do {
        prices = [nicePrice(8, Math.round(budget * 0.45)), nicePrice(6, Math.round(budget * 0.4)), nicePrice(4, Math.round(budget * 0.35))];
        exact = N.round(prices[0] + prices[1] + prices[2], 2);
        est = prices.map((p) => Math.round(p)).reduce((s, x) => s + x, 0);
      } while (guard++ < 60 && (Math.abs(budget - exact) < 5 || (exact <= budget) !== (est <= budget)));
      const ok = exact <= budget;
      const choices = ['Yes — there is enough', 'No — she is short'];
      return {
        prompt: `Harper has $${budget} saved. She wants ${listMoney(prices)} of things at Kmart. Without adding it up exactly, estimate: is $${budget} enough?`,
        answer: { type: 'choice', value: ok ? 0 : 1, choices },
        hint: `Round each price to the nearest dollar, add the whole dollars, then compare the total with $${budget}.`,
        working: [
          `<b>Picture:</b> you only need to know which side of $${budget} you land on, not the exact cents.`,
          `1. Round: ${prices.map((p) => Math.round(p)).map((r) => '$' + r).join(' + ')} = $${est}.`,
          `2. Compare: $${est} is ${est <= budget ? 'less than' : 'more than'} $${budget}.`,
          `3. So the answer is <b>${ok ? 'yes' : 'no'}</b> (the exact total is ${N.money(exact)}).`,
        ],
        finalAnswer: choices[ok ? 0 : 1], skill: 'reasonable',
      };
    }
    if (t === 'aboveBelow') {
      const up = R.chance(0.5);   // true: total rounded UP and students rounded DOWN -> estimate is above
      const [rt, rs] = R.pick([[2000, 40], [2000, 50], [2400, 60], [2400, 80], [3000, 50], [3000, 60], [3500, 50], [3500, 70], [4000, 50], [4000, 80], [4200, 60], [4800, 60], [4800, 80]]);
      const total = up ? rt - R.int(60, 240) : rt + R.int(60, 240);
      const students = up ? rs + R.int(2, 7) : rs - R.int(2, 7);
      const est = rt / rs;
      const right = up
        ? `Above the true cost — the total was rounded <b>up</b> and the number of students was rounded <b>down</b>`
        : `Below the true cost — the total was rounded <b>down</b> and the number of students was rounded <b>up</b>`;
      const other = up
        ? `Below the true cost — the total was rounded <b>down</b> and the number of students was rounded <b>up</b>`
        : `Above the true cost — the total was rounded <b>up</b> and the number of students was rounded <b>down</b>`;
      const choices = R.shuffle([right, other, 'Exactly the true cost — rounding never changes a division']);
      return {
        prompt: `The Year 8 trip costs $${f(total)} in total and ${students} students are going. Harper estimates the cost per student as $${f(rt)} ÷ ${rs} = $${f(est)}. Is her estimate <b>above</b> or <b>below</b> the true cost per student?`,
        answer: { type: 'choice', value: choices.indexOf(right), choices },
        hint: 'A bigger top or a smaller bottom makes a division bigger. Check which way each number was rounded.',
        working: [
          `<b>Picture:</b> sharing one pile of money between a group. More money each way, fewer people each way, both push the share <b>up</b>.`,
          `1. The total went ${f(total)} → ${f(rt)}, so it was rounded <b>${up ? 'up' : 'down'}</b>.`,
          `2. The students went ${students} → ${rs}, so that was rounded <b>${up ? 'down' : 'up'}</b>.`,
          `3. ${up ? 'More money shared between fewer people' : 'Less money shared between more people'} → the estimate is <b>${up ? 'above' : 'below'}</b> the true cost.`,
          `True cost: $${f(N.round(total / students, 2))} per student. Estimate: $${f(est)}.`,
          `Answer: <b>${right}</b>.`,
        ],
        finalAnswer: right, skill: 'reasonable',
      };
    }
    if (t === 'classes') {
      const classes = R.int(4, 9), per = R.pick([27, 28, 29, 31, 32]), cost = nicePrice(6, 14);
      const rp = roundTo(per, 10), rc = Math.round(cost);
      const est = classes * rp * rc, exact = classes * per * cost;
      return {
        prompt: `${classes} classes are going to the museum. Each class has ${per} students and each student pays ${N.money(cost)} for the bus. Estimate how much money will be collected altogether.`,
        answer: estAns(est, exact, { unit: '$' }),
        hint: `Round ${per} to ${rp} and ${N.money(cost)} to $${rc}, then multiply all three numbers.`,
        working: [
          `<b>Picture:</b> ${classes} classes × about ${rp} students × about $${rc} each.`,
          `1. Round: ${per} → ${rp} and ${N.money(cost)} → $${rc}.`,
          `2. Students: ${classes} × ${rp} = ${f(classes * rp)}.`,
          `3. Money: ${f(classes * rp)} × $${rc} = $${f(est)}.`,
          `Estimate: <b>about $${f(est)}</b> (exact: ${N.money(N.round(exact, 2))}).`,
        ],
        finalAnswer: `about $${f(est)}`, skill: 'estimate',
      };
    }
    const speed = R.pick([3.9, 4.1, 4.9, 5.1]);
    const rs = Math.round(speed);
    const hrs = R.int(2, 5);
    const dist = N.round(rs * hrs + R.pick([-0.4, -0.3, 0.2, 0.4]), 1);
    const rd = Math.round(dist);
    const estHours = rd / rs, estMin = estHours * 60;
    return {
      prompt: `The Te Henga coast walk is ${f(dist)} km and ${who} walks about ${f(speed)} km each hour. About how many <b>minutes</b> will it take? (Estimate, then change hours into minutes.)`,
      answer: estAns(estMin, dist / speed * 60, { unit: 'min' }),
      hint: `Round to ${rd} km ÷ ${rs} km/h to get the hours, then multiply the hours by 60.`,
      working: [
        `<b>Picture:</b> chunks of ${rs} km, one for each hour of walking.`,
        `1. Round: ${f(dist)} → ${rd} and ${f(speed)} → ${rs}.`,
        `2. Hours: ${rd} ÷ ${rs} = ${f(estHours)}.`,
        `3. Minutes: ${f(estHours)} × 60 = ${f(estMin)}.`,
        `About <b>${f(estMin)} minutes</b>.`,
      ],
      finalAnswer: `about ${f(estMin)} min`, skill: 'estimate',
    };
  }

  function word(level) {
    return level === 1 ? wordL1() : level === 2 ? wordL2() : wordL3();
  }

  HL.registerTopic({
    id: 'estimation', subject: 'maths', strand: 'number', order: 15,
    name: 'Estimation & mental strategies', short: 'Estimation',
    blurb: 'Round to estimate, and use clever tricks to work things out in your head.',
    example: '49 × 21 ≈ 50 × 20 = 1000 &nbsp;·&nbsp; 99 × 6 = 600 − 6 = 594',
    animal: 'koala',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', GREY = '#9A8A98';
      const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">${body}</svg>`;
      const M = (id, c) => `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker></defs>`;
      const T = (x, y, s, c = INK, o = '') => `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" ${o}>${s}</text>`;
      /** number line from lo to hi (25 px per unit, x = 30 + (v − lo) × 25) at height y, with a hop from a to b */
      const nl = (y, lo, hi, a, b, c) => { const X = (v) => 30 + (v - lo) * 25; return `
        <line x1="20" y1="${y}" x2="340" y2="${y}" stroke="${INK}" stroke-width="2"/>
        ${Array.from({ length: hi - lo + 1 }, (_, i) => { const v = lo + i, x = X(v), big = v % 10 === 0; return `<line x1="${x}" y1="${y - (big ? 8 : 5)}" x2="${x}" y2="${y + (big ? 8 : 5)}" stroke="${INK}" stroke-width="2"/>${T(x, y + 22, v, big ? c : INK, 'font-size="13"')}`; }).join('')}
        <circle cx="${X(a)}" cy="${y}" r="5" fill="${c}"/><circle cx="${X(b)}" cy="${y}" r="5" fill="${GREEN}"/>
        <path d="M${X(a)} ${y - 6} q${(X(b) - X(a)) / 2} -22 ${X(b) - X(a)} 0" stroke="${c}" stroke-width="2.5" fill="none" marker-end="url(#est-${c === ROSE ? 'r' : 'b'})"/>`; };
      return {
        what: '<p><b>Estimating</b> means finding an answer that is <b>close enough</b>, fast. Picture a number line with <b>signposts at the round numbers</b> (10, 20, 50, 100, 400…): each number hops to its nearest signpost, then you calculate with the easy numbers. It is great for checking whether a calculator answer is sensible. <b>Mental strategies</b> use the same signposts to get the <b>exact</b> answer in your head, like 99 × 6 = 600 − 6.</p>',
        visual: S(360, 212, `${M('est-r', ROSE)}${M('est-b', BLUE)}
          ${T(168, 20, '49 hops up to the 50 signpost', ROSE, 'font-size="13"')}
          ${nl(50, 44, 56, 49, 50, ROSE)}
          ${T(192, 104, '21 hops back to the 20 signpost', BLUE, 'font-size="13"')}
          ${nl(134, 14, 26, 21, 20, BLUE)}
          <text x="180" y="188" text-anchor="middle" font-size="18" fill="${INK}"><tspan fill="${ROSE}">49</tspan> × <tspan fill="${BLUE}">21</tspan> ≈ <tspan fill="${ROSE}">50</tspan> × <tspan fill="${BLUE}">20</tspan> = <tspan fill="${GREEN}">1000</tspan></text>
          ${T(180, 208, 'exact answer 1029 — close!', GREY, 'font-size="13"')}
        `),
        facts: [
          '<b>Estimate</b>: round each number to <b>1 significant figure</b>, then calculate. 49 × 21 ≈ 50 × 20 = 1000',
          '<b>Compensation</b>: use the signpost, then fix it. 99 × 6 = 100 × 6 − 6 = 594',
          '<b>Double and halve</b>: 16 × 25 = 8 × 50 = 4 × 100 = 400',
          '<b>× 5</b> = × 10 then halve &nbsp;·&nbsp; <b>× 25</b> = × 100 then ÷ 4 &nbsp;·&nbsp; <b>× 50</b> = × 100 then halve',
          '<b>Count up</b> to subtract from 100 or 1000: 1000 − 387 → 3 + 10 + 600 = 613',
          'Estimate first, then check: the calculator answer must be <b>close</b> to the estimate',
        ],
        steps: [
          '<b>Estimate</b>: say "hop each number to its signpost" — round to 1 significant figure (49 → 50, 21 → 20, 387 → 400), then calculate. 49 × 21 ≈ 50 × 20 = 1000.',
          '<b>Compensation</b>: say "use the signpost, then pay back the difference". 99 × 6 = (100 × 6) − 6 = 594. &nbsp; 58 + 39 = 58 + 40 − 1 = 97.',
          '<b>Doubling and halving</b>: say "halve one, double the other". 16 × 25 = 8 × 50 = 4 × 100 = 400.',
          '<b>× 5, × 50, × 25</b>: × 5 is × 10 then halve; × 50 is × 100 then halve; × 25 is × 100 then ÷ 4.',
          '<b>Subtracting from 100 or 1000</b>: say "count up to the signposts". 1000 − 387: 387 → 390 (3), → 400 (10), → 1000 (600). Total 613.',
        ],
        examples: [
          { q: 'Estimate 38 × 52', working: ['<b>Picture:</b> a number line with signposts at 40 and 50. Each number hops to its nearest one.', '1. Nearest signpost to 38? 40 (it is only 2 away).', '2. Nearest signpost to 52? 50.', '3. Easy multiply: 40 × 50 = 2000.', '38 × 52 ≈ 2000'], a: 'about 2000 (exact: 1976)' },
          { q: 'Estimate 412 + 189', working: ['<b>Picture:</b> signposts at the hundreds: 400 and 200.', '1. 412 hops back to 400 (only 12 away).', '2. 189 hops up to 200 (11 away).', '3. 400 + 200 = 600.', '412 + 189 ≈ 600'], a: 'about 600 (exact: 601)' },
          { q: '199 × 4 exactly (in your head)', working: ['<b>Picture:</b> 199 is standing 1 step short of the 200 signpost. I let it borrow that 1 step, then pay it back.', '1. Is 199 close to a signpost? Yes — 200, just 1 more.', '2. Easy multiply: 200 × 4 = 800.', '3. Pay back: I added 1 four times, so take off 1 × 4 = 4.', '800 − 4 = 796'], a: '796',
            visual: S(340, 84, `${M('est-c', ROSE)}<text x="16" y="30" font-size="16" fill="${INK}">199 × 4</text>
              <line x1="96" y1="24" x2="130" y2="24" stroke="${ROSE}" stroke-width="3" marker-end="url(#est-c)"/>${T(113, 14, 'up 1', ROSE, 'font-size="13"')}
              <text x="142" y="30" font-size="16" fill="${BLUE}">200 × 4 = 800</text>
              <line x1="196" y1="38" x2="196" y2="60" stroke="${ROSE}" stroke-width="3" marker-end="url(#est-c)"/><text x="206" y="54" fill="${ROSE}" font-size="13">pay back 1 × 4 = 4</text>
              <text x="142" y="80" font-size="16" fill="${GREEN}">800 − 4 = 796</text>`) },
          { q: '16 × 25 exactly', working: ['<b>Picture:</b> 25 is half-way to the 50 signpost, and 50 is half-way to 100. Every time I double one number I halve the other, and the answer stays the same.', '1. Is one number even? Yes, 16 — so I can halve it: 8 × 50.', '2. Again: 4 × 100.', '3. × 100 is easy: 400.', '16 × 25 = 400'], a: '400',
            visual: S(360, 76, `${M('est-d', INK)}<text x="10" y="44" font-size="16" fill="${INK}">16 × 25</text>
              <line x1="82" y1="38" x2="114" y2="38" stroke="${INK}" stroke-width="3" marker-end="url(#est-d)"/>${T(99, 22, 'halve', ROSE, 'font-size="13"')}${T(99, 62, 'double', BLUE, 'font-size="13"')}
              <text x="124" y="44" font-size="16" fill="${INK}">8 × 50</text>
              <line x1="188" y1="38" x2="220" y2="38" stroke="${INK}" stroke-width="3" marker-end="url(#est-d)"/>${T(205, 22, 'halve', ROSE, 'font-size="13"')}${T(205, 62, 'double', BLUE, 'font-size="13"')}
              <text x="230" y="44" font-size="16" fill="${GREEN}">4 × 100 = 400</text>`) },
          { q: '1000 − 387 exactly', working: ['<b>Picture:</b> walking from 387 up the number line to 1000, stopping at each signpost.', '1. Next signpost from 387? 390 — that is 3 steps.', '2. Next? 400 — 10 more steps.', '3. Next? 1000 — 600 more steps.', '4. Add the steps: 3 + 10 + 600 = 613.', '1000 − 387 = 613'], a: '613',
            visual: S(360, 112, `${M('est-e', ROSE)}<line x1="20" y1="60" x2="340" y2="60" stroke="${INK}" stroke-width="2"/>
              ${[[40, '387'], [100, '390'], [170, '400'], [320, '1000']].map(([x, l]) => `<line x1="${x}" y1="53" x2="${x}" y2="67" stroke="${INK}" stroke-width="2"/>${T(x, 84, l, INK, 'font-size="13"')}`).join('')}
              <path d="M40 54 q30 -34 60 0" stroke="${ROSE}" stroke-width="2.5" fill="none" marker-end="url(#est-e)"/><path d="M100 54 q35 -36 70 0" stroke="${ROSE}" stroke-width="2.5" fill="none" marker-end="url(#est-e)"/><path d="M170 54 q75 -50 150 0" stroke="${ROSE}" stroke-width="2.5" fill="none" marker-end="url(#est-e)"/>
              ${T(70, 30, '+3', ROSE, 'font-size="13"')}${T(135, 28, '+10', ROSE, 'font-size="13"')}${T(245, 22, '+600', ROSE, 'font-size="13"')}
              ${T(180, 106, '3 + 10 + 600 = 613', GREEN)}`) },
          { q: 'Harper has $30. She picks up items costing $4.95, $9.99, $2.10 and $12.80. Does she have enough?', working: ['<b>Picture:</b> each price hops to its nearest dollar signpost.', '1. Round each one: $4.95 → 5, $9.99 → 10, $2.10 → 2, $12.80 → 13.', '2. Add the easy numbers: 5 + 10 + 2 + 13 = 30.', '3. Is that close to $30? Yes — right on the edge, so I check exactly: $29.84.', 'Yes, just — about $30 (exactly $29.84)'], a: 'Yes — about $30 (exactly $29.84)' },
        ],
        tips: [
          'An estimate is not wrong if it is not exact. It just needs to be close.',
          'Always check a calculator answer with an estimate. If 39 × 52 shows 202.8, the point is in the wrong place.',
          'Near doubles: 47 + 48 = double 47 + 1 = 95.',
        ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
