/* Topic: Integers (positive and negative numbers) — EXEMPLAR topic file. Copy this structure. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const show = (x) => (x < 0 ? `(${N.fmt(x)})` : N.fmt(x));   // wrap negatives in brackets inside expressions

  function arith(level) {
    const range = level === 1 ? 10 : level === 2 ? 20 : 50;
    const op = level === 1 ? R.pick(['+', '-']) : R.pick(['+', '-', '×', '÷', '×']);
    let a, b, ans, working, hint;
    if (op === '+' || op === '-') {
      a = R.nz(range); b = R.nz(range);
      ans = op === '+' ? a + b : a - b;
      const rewritten = op === '-' && b < 0 ? `${N.fmt(a)} − (${N.fmt(b)}) is the same as ${N.fmt(a)} + ${N.fmt(-b)}` : op === '+' && b < 0 ? `${N.fmt(a)} + (${N.fmt(b)}) is the same as ${N.fmt(a)} − ${N.fmt(-b)}` : null;
      working = [];
      if (rewritten) working.push(`Two signs together: ${rewritten}.`);
      working.push(`Start at ${N.fmt(a)} on the number line.`);
      const move = op === '+' ? b : -b;
      working.push(`Move ${Math.abs(move)} ${move >= 0 ? 'to the right (up)' : 'to the left (down)'}.`);
      working.push(`You land on <b>${N.fmt(ans)}</b>.`);
      hint = a < 0 || b < 0 ? 'Picture a number line. Adding a negative moves left; subtracting a negative moves right.' : 'Count along a number line.';
      return {
        prompt: `${show(a)} ${op === '-' ? '−' : '+'} ${show(b)} = ?`,
        answer: { type: 'number', value: ans },
        hint, working, finalAnswer: N.fmt(ans),
      };
    }
    if (op === '×') {
      a = R.nz(level === 3 ? 12 : 9); b = R.nz(level === 3 ? 12 : 9);
      if (a > 0 && b > 0) b = -b;
      ans = a * b;
      return {
        prompt: `${show(a)} × ${show(b)} = ?`,
        answer: { type: 'number', value: ans },
        hint: 'Multiply the numbers first, then decide the sign: same signs → positive, different signs → negative.',
        working: [
          `Ignore the signs: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(ans)}.`,
          `Signs are ${Math.sign(a) === Math.sign(b) ? 'the same (so the answer is positive)' : 'different (so the answer is negative)'}.`,
          `Answer: <b>${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: N.fmt(ans),
      };
    }
    // division: build from a product so it divides exactly
    b = R.nz(level === 3 ? 12 : 9); const q = R.nz(level === 3 ? 12 : 9);
    if (b > 0 && q > 0) b = -b;
    a = b * q; ans = q;
    return {
      prompt: `${show(a)} ÷ ${show(b)} = ?`,
      answer: { type: 'number', value: ans },
      hint: 'Divide the numbers first, then decide the sign: same signs → positive, different signs → negative.',
      working: [
        `Ignore the signs: ${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(ans)}.`,
        `Signs are ${Math.sign(a) === Math.sign(b) ? 'the same → positive' : 'different → negative'}.`,
        `Answer: <b>${N.fmt(ans)}</b>.`,
      ],
      finalAnswer: N.fmt(ans),
    };
  }

  // ---------- comparing and ordering ----------
  function compareTwo(level) {
    const range = level === 1 ? 10 : level === 2 ? 20 : 50;
    let a = R.nz(range), b = R.nz(range);
    while (a === b) b = R.nz(range);
    if (a > 0 && b > 0) a = -a;
    const wantSmall = R.chance(0.5);
    const target = wantSmall ? Math.min(a, b) : Math.max(a, b);
    const choices = [N.fmt(a), N.fmt(b)];
    return {
      prompt: `Which is <b>${wantSmall ? 'smaller' : 'bigger'}</b>: ${N.fmt(a)} or ${N.fmt(b)}?`,
      answer: { type: 'choice', value: choices.indexOf(N.fmt(target)), choices },
      hint: 'Picture the number line. The one further to the <b>left</b> is smaller. Every negative is smaller than every positive.',
      working: [
        `On the number line, ${N.fmt(Math.min(a, b))} sits to the <b>left</b> of ${N.fmt(Math.max(a, b))}.`,
        'Left = smaller, right = bigger.',
        `So the ${wantSmall ? 'smaller' : 'bigger'} number is <b>${N.fmt(target)}</b>.`,
      ],
      finalAnswer: N.fmt(target), skill: 'compare',
    };
  }
  function orderQ(level) {
    const range = level === 1 ? 9 : level === 2 ? 15 : 30;
    const set = new Set();
    while (set.size < 4) set.add(R.nz(range));
    let nums = [...set];
    if (nums.filter((x) => x < 0).length < 2) { nums[0] = -Math.abs(nums[0]); nums[1] = -Math.abs(nums[1]); nums = [...new Set(nums)]; while (nums.length < 4) { const v = R.nz(range); if (!nums.includes(v)) nums.push(v); } }
    const asc = nums.slice().sort((x, y) => x - y);
    const smallestFirst = R.chance(0.6);
    const fmtList = (arr) => arr.map((x) => N.fmt(x)).join(', ');
    const correct = fmtList(smallestFirst ? asc : asc.slice().reverse());
    const opts = new Set([correct]);
    opts.add(fmtList(smallestFirst ? asc.slice().reverse() : asc));
    opts.add(fmtList(nums.slice().sort((x, y) => Math.abs(x) - Math.abs(y))));
    let guard = 0;
    while (opts.size < 3 && guard++ < 30) opts.add(fmtList(R.shuffle(nums)));
    const choices = R.shuffle([...opts]);
    return {
      prompt: `Put these in order, <b>${smallestFirst ? 'smallest' : 'largest'} first</b>: ${fmtList(nums)}`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'Put them on a number line first. The most negative number is furthest left, so it is the smallest.',
      working: [
        `Negatives first: ${fmtList(asc.filter((x) => x < 0))} — the one with the <b>biggest</b> digits is the <b>smallest</b> (furthest left).`,
        `Then the positives: ${fmtList(asc.filter((x) => x > 0))}.`,
        `Smallest to largest: ${fmtList(asc)}.`,
        `Answer: <b>${correct}</b>.`,
      ],
      finalAnswer: correct, skill: 'order',
    };
  }
  function numberLineQ(level) {
    const step = level === 1 ? 1 : 2;
    const lo = step * R.int(-6, -2);
    const ticks = []; for (let i = 0; i <= 8; i++) ticks.push(lo + i * step);
    const hi = ticks[8];
    const v = step === 1 ? R.int(lo + 1, hi - 1) : (R.chance(0.6) ? lo + step * R.int(1, 7) + 1 : lo + step * R.int(1, 7));
    const x = (n) => 20 + ((n - lo) / step) * 35;
    const nearest = lo + step * Math.floor((v - lo) / step);
    const visual = `<svg viewBox="0 0 320 92" width="320" height="92" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
      <line x1="10" y1="46" x2="310" y2="46" stroke="#4A3B48" stroke-width="2"/>
      <polygon points="312,46 302,41 302,51" fill="#4A3B48"/><polygon points="8,46 18,41 18,51" fill="#4A3B48"/>
      ${ticks.map((t) => `<line x1="${x(t)}" y1="39" x2="${x(t)}" y2="53" stroke="#4A3B48" stroke-width="2"/><text x="${x(t)}" y="72" text-anchor="middle" fill="${t < 0 ? '#E0568C' : t === 0 ? '#4A3B48' : '#2A6FA5'}">${N.fmt(t)}</text>`).join('')}
      ${step === 2 ? ticks.slice(0, 8).map((t) => `<line x1="${x(t) + 17.5}" y1="42" x2="${x(t) + 17.5}" y2="50" stroke="#9A8A98" stroke-width="2"/>`).join('') : ''}
      <polygon points="${x(v) - 8},14 ${x(v) + 8},14 ${x(v)},30" fill="#E0568C"/>
      <circle cx="${x(v)}" cy="46" r="5" fill="#E0568C"/>
      <text x="160" y="88" text-anchor="middle" fill="#9A8A98" font-size="12">what number is the arrow on?</text>
    </svg>`;
    return {
      prompt: 'What number is the arrow pointing at?',
      visual,
      answer: { type: 'number', value: v },
      hint: step === 2 ? 'The labelled marks go up in 2s, so the little marks in between are the odd numbers.' : 'Count along from the nearest labelled mark. Going right adds 1 each step.',
      working: [
        `The labelled marks go up in ${step}${step === 1 ? '' : 's'}${step === 2 ? ', and the small marks in between are the odd numbers' : ''}.`,
        `Nearest label to the left is ${N.fmt(nearest)}. Count ${v - nearest} step${v - nearest === 1 ? '' : 's'} to the <b>right</b> from there.`,
        `The arrow is on <b>${N.fmt(v)}</b>.`,
      ],
      finalAnswer: N.fmt(v), skill: 'number-line',
    };
  }

  // ---------- BEDMAS with negatives ----------
  function bedmasNeg(level) {
    const type = R.pick(['mulAdd', 'mulAdd', 'divAdd', 'bracket']);
    const signWord = (p, q) => (Math.sign(p) === Math.sign(q) ? 'the same → the answer is positive' : 'different → the answer is negative');
    if (type === 'mulAdd') {
      const a = R.nz(level === 3 ? 15 : 9);
      let b = R.nz(level === 3 ? 9 : 6), c = R.nz(level === 3 ? 9 : 6);
      if (b > 0 && c > 0) c = -c;
      const op = R.pick(['+', '−']);
      const prod = b * c;
      const ans = op === '+' ? a + prod : a - prod;
      return {
        prompt: `${show(a)} ${op} ${show(b)} × ${show(c)} = ?`,
        answer: { type: 'number', value: ans },
        hint: 'BEDMAS: do the × first, then the + or −. Remember the sign rules.',
        working: [
          'BEDMAS: × comes before + and −, so do the multiplication first.',
          `${show(b)} × ${show(c)}: numbers first — ${Math.abs(b)} × ${Math.abs(c)} = ${Math.abs(prod)}. Signs are ${signWord(b, c)}: ${N.fmt(prod)}.`,
          `Now ${show(a)} ${op} ${show(prod)}${(op === '−' && prod < 0) ? ' — two minuses together, so it becomes + ' + Math.abs(prod) : (op === '+' && prod < 0) ? ' — adding a negative, so move left' : ''}.`,
          `Answer: <b>${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: N.fmt(ans), skill: 'bedmas-negatives',
      };
    }
    if (type === 'divAdd') {
      let b = R.nz(level === 3 ? 9 : 5); const q = R.nz(level === 3 ? 9 : 5);
      if (b > 0 && q > 0) b = -b;
      const a = b * q;
      const c = R.nz(level === 3 ? 15 : 9);
      const op = R.pick(['+', '−']);
      const ans = op === '+' ? q + c : q - c;
      return {
        prompt: `${show(a)} ÷ ${show(b)} ${op} ${show(c)} = ?`,
        answer: { type: 'number', value: ans },
        hint: 'BEDMAS: do the ÷ first, then the + or −.',
        working: [
          'BEDMAS: ÷ comes before + and −, so divide first.',
          `${show(a)} ÷ ${show(b)}: numbers first — ${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(q)}. Signs are ${signWord(a, b)}: ${N.fmt(q)}.`,
          `Now ${show(q)} ${op} ${show(c)}.`,
          `Answer: <b>${N.fmt(ans)}</b>.`,
        ],
        finalAnswer: N.fmt(ans), skill: 'bedmas-negatives',
      };
    }
    const a = R.int(1, level === 3 ? 9 : 6), b = a + R.int(1, level === 3 ? 12 : 8);
    const c = R.nz(level === 3 ? 9 : 5);
    const inner = a - b, ans = inner * c;
    return {
      prompt: `(${a} − ${b}) × ${show(c)} = ?`,
      answer: { type: 'number', value: ans },
      hint: 'Brackets first. The bracket gives a negative number, then use the sign rule for ×.',
      working: [
        `Brackets first: ${a} − ${b} = ${N.fmt(inner)} (start at ${a}, walk back ${b}).`,
        `Now ${show(inner)} × ${show(c)}: numbers first — ${Math.abs(inner)} × ${Math.abs(c)} = ${Math.abs(ans)}.`,
        `Signs are ${signWord(inner, c)}.`,
        `Answer: <b>${N.fmt(ans)}</b>.`,
      ],
      finalAnswer: N.fmt(ans), skill: 'bedmas-negatives',
    };
  }

  function calc(level) {
    const pool = level === 1 ? ['op', 'op', 'op', 'op', 'compare', 'compare', 'line', 'order']
      : level === 2 ? ['op', 'op', 'op', 'op', 'compare', 'line', 'order', 'bedmas']
        : ['op', 'op', 'op', 'order', 'line', 'bedmas', 'bedmas', 'bedmas'];
    const t = R.pick(pool);
    if (t === 'compare') return compareTwo(level);
    if (t === 'order') return orderQ(level);
    if (t === 'line') return numberLineQ(level);
    if (t === 'bedmas') return bedmasNeg(level);
    return arith(level);
  }

  // ---------- word problems (level 1 easy · level 2 two steps · level 3 multi-step) ----------
  const bal = (x) => (x < 0 ? `−$${Math.abs(x)}` : `$${x}`);
  const TOWNS_COLD = ['Ohakune', 'Queenstown', 'Twizel', 'Alexandra', 'Taihape', 'Waiouru'];

  /** LEVEL 1 — one step, small numbers, asked directly */
  function wordL1() {
    const t = R.pick(['temp', 'lift', 'money', 'sea', 'score', 'toZero']);
    if (t === 'temp') {
      const start = R.int(-8, 6), change = R.nz(6);
      const ans = start + change;
      return {
        prompt: `The temperature in ${R.pick(TOWNS_COLD)} was ${N.fmt(start)}°C at 6 am. By noon it had ${change > 0 ? 'risen' : 'dropped'} by ${Math.abs(change)}°C. What was the temperature at noon?`,
        answer: { type: 'number', value: ans, unit: '°C' },
        hint: `${change > 0 ? 'Rising' : 'Dropping'} means ${change > 0 ? 'add' : 'subtract'}: ${N.fmt(start)} ${change > 0 ? '+' : '−'} ${Math.abs(change)}.`,
        working: [`<b>Picture:</b> a thermometer is a number line standing up.`, `Start at ${N.fmt(start)}°C.`, `${change > 0 ? 'Rise' : 'Drop'} of ${Math.abs(change)}°C → ${N.fmt(start)} ${change > 0 ? '+' : '−'} ${Math.abs(change)} = ${N.fmt(ans)}.`, `Noon temperature: <b>${N.fmt(ans)}°C</b>.`],
        finalAnswer: `${N.fmt(ans)}°C`, skill: 'word',
      };
    }
    if (t === 'lift') {
      const floor = R.int(-2, 8);
      let down = R.int(2, 8);
      while (floor - down === 0) down = R.int(2, 8);
      const ans = floor - down;
      return {
        prompt: `A lift in a Wellington carpark is on floor ${N.fmt(floor)}${floor < 0 ? ' (a basement level)' : ''}. It goes down ${down} floors. Which floor is it on now?`,
        answer: { type: 'number', value: ans },
        hint: 'Going down means subtract. Floors below ground are negative.',
        working: [`<b>Picture:</b> the floor numbers are a number line standing up, with 0 at ground level.`, `${N.fmt(floor)} − ${down} = ${N.fmt(ans)}.`, `The lift is on floor <b>${N.fmt(ans)}</b>.`],
        finalAnswer: N.fmt(ans), skill: 'word',
      };
    }
    if (t === 'money') {
      const b = R.int(-40, 30), amt = R.int(10, 40);
      const ans = b + amt;
      return {
        prompt: `A bank account balance is ${bal(b)}${b < 0 ? ' (overdrawn)' : ''}. Then $${amt} of pocket money is paid in. What is the new balance?`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: 'Paying money in means add. Start from the balance you were given.',
        working: [`<b>Picture:</b> money you owe sits behind the gate at 0.`, `${N.fmt(b)} + ${amt} = ${N.fmt(ans)}.`, `New balance: <b>${bal(ans)}</b>.`],
        finalAnswer: bal(ans), skill: 'word',
      };
    }
    if (t === 'sea') {
      const diver = -R.int(3, 12), bird = R.int(5, 20);
      return {
        prompt: `A diver at Goat Island is at ${N.fmt(diver)} m (below sea level) and a seagull is flying at ${bird} m above sea level. How many metres apart are they?`,
        answer: { type: 'number', value: bird - diver, unit: 'm' },
        hint: 'Distance apart = higher number − lower number.',
        working: [`<b>Picture:</b> sea level is 0 on a number line standing up.`, `${bird} − (${N.fmt(diver)}) = ${bird} + ${-diver} = ${bird - diver}.`, `They are <b>${bird - diver} m</b> apart.`],
        finalAnswer: `${bird - diver} m`, skill: 'word',
      };
    }
    if (t === 'score') {
      const start = -R.int(2, 12), won = R.int(3, 15);
      const ans = start + won;
      return {
        prompt: `In a card game at the bach Harper's score is ${N.fmt(start)} points. In the next round she wins ${won} points. What is her score now?`,
        answer: { type: 'number', value: ans, unit: 'points' },
        hint: `Winning points means add: ${N.fmt(start)} + ${won}.`,
        working: [`<b>Picture:</b> her score is a spot on the footpath, 0 is the gate.`, `Winning ${won} means walk forwards ${won} steps.`, `${N.fmt(start)} + ${won} = ${N.fmt(ans)}.`, `Her score is <b>${N.fmt(ans)} points</b>.`],
        finalAnswer: `${N.fmt(ans)} points`, skill: 'word',
      };
    }
    const freezer = -R.int(4, 18);
    return {
      prompt: `The ice-cream freezer at the dairy is set to ${N.fmt(freezer)}°C. How many degrees would it have to rise to reach 0°C?`,
      answer: { type: 'number', value: -freezer, unit: '°C' },
      hint: 'Count the steps from the negative number up to zero.',
      working: [`<b>Picture:</b> walk from ${N.fmt(freezer)} forwards to the gate at 0.`, `From ${N.fmt(freezer)} to 0 is ${-freezer} steps.`, `It must rise <b>${-freezer}°C</b>.`],
      finalAnswer: `${-freezer}°C`, skill: 'word',
    };
  }

  /** LEVEL 2 — two steps, or working backwards, or two negatives */
  function wordL2() {
    const t = R.pick(['temp2', 'lift2', 'money2', 'seabed', 'backwards', 'colder']);
    if (t === 'temp2') {
      const start = R.int(-6, 8), fall = R.int(4, 14), rise = R.int(3, 12);
      const mid = start - fall, ans = mid + rise;
      return {
        prompt: `At the Waiouru army camp the temperature was ${N.fmt(start)}°C at 4 pm. It fell ${fall}°C overnight, then rose ${rise}°C the next morning. What was the temperature then?`,
        answer: { type: 'number', value: ans, unit: '°C' },
        hint: 'Do it in two steps: first the fall, then the rise.',
        working: [`<b>Picture:</b> a thermometer is a number line standing up. Fall = down, rise = up.`, `Step 1: ${N.fmt(start)} − ${fall} = ${N.fmt(mid)}.`, `Step 2: ${N.fmt(mid)} + ${rise} = ${N.fmt(ans)}.`, `The temperature was <b>${N.fmt(ans)}°C</b>.`],
        finalAnswer: `${N.fmt(ans)}°C`, skill: 'word',
      };
    }
    if (t === 'lift2') {
      const floor = R.int(-1, 9), down = R.int(4, 12), up = R.int(2, 8);
      const mid = floor - down, ans = mid + up;
      return {
        prompt: `A lift in a hotel starts on floor ${N.fmt(floor)}. It goes down ${down} floors to the carpark, then back up ${up} floors. Which floor is it on now?`,
        answer: { type: 'number', value: ans },
        hint: 'Two moves: subtract the down floors first, then add the up floors.',
        working: [`<b>Picture:</b> floor numbers are a number line standing up, 0 = ground.`, `Down ${down}: ${N.fmt(floor)} − ${down} = ${N.fmt(mid)}.`, `Up ${up}: ${N.fmt(mid)} + ${up} = ${N.fmt(ans)}.`, `It is on floor <b>${N.fmt(ans)}</b>.`],
        finalAnswer: N.fmt(ans), skill: 'word',
      };
    }
    if (t === 'money2') {
      const b = R.int(-30, 40), spend = R.int(15, 60), paid = R.int(10, 50);
      const mid = b - spend, ans = mid + paid;
      return {
        prompt: `Harper's savings account has ${bal(b)} in it. She spends $${spend} at The Warehouse, then her nana pays in $${paid}. What is the balance now?`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: 'Spending subtracts, paying in adds. Do them in order.',
        working: [`<b>Picture:</b> owing money means you are behind the gate at 0.`, `After spending: ${N.fmt(b)} − ${spend} = ${N.fmt(mid)}.`, `After the deposit: ${N.fmt(mid)} + ${paid} = ${N.fmt(ans)}.`, `Balance: <b>${bal(ans)}</b>.`],
        finalAnswer: bal(ans), skill: 'word',
      };
    }
    if (t === 'seabed') {
      const seabed = -R.int(18, 45), diver = -R.int(4, 16);
      const ans = diver - seabed;
      return {
        prompt: `Off Kaikōura the seabed is at ${N.fmt(seabed)} m and a diver is at ${N.fmt(diver)} m. How many metres above the seabed is the diver?`,
        answer: { type: 'number', value: ans, unit: 'm' },
        hint: 'Both numbers are negative. Take the lower one away from the higher one.',
        working: [`<b>Picture:</b> sea level is 0. Both are below it, so both are negative.`, `Gap = higher − lower = ${N.fmt(diver)} − (${N.fmt(seabed)}).`, `Two minuses make a plus: ${N.fmt(diver)} + ${-seabed} = ${ans}.`, `The diver is <b>${ans} m</b> above the seabed.`],
        finalAnswer: `${ans} m`, skill: 'word',
      };
    }
    if (t === 'backwards') {
      const end = R.int(-4, 9);
      let rise = R.int(6, 16);
      while (rise === end) rise = R.int(6, 16);
      const startT = end - rise;
      return {
        prompt: `The temperature at the Tongariro hut rose ${rise}°C during the day and reached ${N.fmt(end)}°C. What was the temperature at dawn?`,
        answer: { type: 'number', value: startT, unit: '°C' },
        hint: 'Work backwards: undo a rise by subtracting it from the end temperature.',
        working: [`<b>Picture:</b> we know where it finished, so walk backwards down the thermometer.`, `Undo the rise: ${N.fmt(end)} − ${rise} = ${N.fmt(startT)}.`, `Check: ${N.fmt(startT)} + ${rise} = ${N.fmt(end)}. ✓`, `At dawn it was <b>${N.fmt(startT)}°C</b>.`],
        finalAnswer: `${N.fmt(startT)}°C`, skill: 'word',
      };
    }
    const mon = R.int(2, 12), tue = -R.int(2, 10);
    return {
      prompt: `At the marae the temperature on Monday morning was ${mon}°C and on Tuesday morning it was ${N.fmt(tue)}°C. How many degrees colder was Tuesday?`,
      answer: { type: 'number', value: mon - tue, unit: '°C' },
      hint: 'Difference = warmer − colder. Subtracting a negative turns into adding.',
      working: [`<b>Picture:</b> count the steps on the thermometer from ${N.fmt(tue)} up to ${mon}.`, `Difference = ${mon} − (${N.fmt(tue)}).`, `Two minuses make a plus: ${mon} + ${-tue} = ${mon - tue}.`, `Tuesday was <b>${mon - tue}°C</b> colder.`],
      finalAnswer: `${mon - tue}°C`, skill: 'word',
    };
  }

  /** LEVEL 3 — three steps, a graph to read, a distractor, working backwards, or an average */
  function wordL3() {
    const t = R.pick(['graph', 'bank3', 'altitude', 'backwards3', 'mean', 'quiz']);
    if (t === 'graph') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let temps, drops, best, bestIdx;
      do {
        temps = days.map(() => R.int(-9, 8));
        drops = temps.slice(0, 6).map((v, i) => v - temps[i + 1]);
        best = Math.max.apply(null, drops);
        bestIdx = drops.indexOf(best);
      } while (best < 4 || drops.filter((d) => d === best).length !== 1 || !temps.some((v) => v < 0));
      const x = (i) => 40 + i * 38, y0 = 84, y = (v) => y0 - v * 5;
      const visual = `<svg viewBox="0 0 320 170" width="320" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
        <line x1="8" y1="${y0}" x2="312" y2="${y0}" stroke="#4A3B48" stroke-width="2"/>
        <text x="6" y="${y0 - 6}" fill="#9A8A98" font-size="11">0°C</text>
        ${temps.map((v, i) => {
          const top = Math.min(y0, y(v)), h = Math.max(2, Math.abs(v) * 5);
          return `<rect x="${x(i) - 11}" y="${top}" width="22" height="${h}" rx="3" fill="${v < 0 ? '#F9A8C9' : '#A9D8F5'}" stroke="${v < 0 ? '#E0568C' : '#2A6FA5'}" stroke-width="1.5"/>`
            + `<text x="${x(i)}" y="${v >= 0 ? y(v) - 6 : y(v) + 15}" text-anchor="middle" fill="${v < 0 ? '#E0568C' : '#2A6FA5'}">${N.fmt(v)}</text>`
            + `<text x="${x(i)}" y="160" text-anchor="middle" fill="#4A3B48" font-size="12">${days[i]}</text>`;
        }).join('')}
      </svg>`;
      return {
        prompt: `The graph shows the 7 am temperature in ${R.pick(TOWNS_COLD)} every day for a week. Find the <b>biggest drop</b> from one day to the next. How many degrees was that drop?`,
        visual,
        answer: { type: 'number', value: best, unit: '°C' },
        hint: 'Work out each day-to-day change first: yesterday − today. The biggest positive answer is the biggest drop.',
        working: [
          `<b>Picture:</b> a drop means the bar goes <b>down</b> from one day to the next.`,
          `1. Do I want a rise or a drop? A drop, so I do yesterday − today for each pair.`,
          drops.map((d, i) => `${days[i]}→${days[i + 1]}: ${N.fmt(temps[i])} − (${N.fmt(temps[i + 1])}) = ${N.fmt(d)}`).join('; ') + '.',
          `2. Which is the biggest <b>positive</b> one? ${days[bestIdx]}→${days[bestIdx + 1]}.`,
          `The biggest drop is <b>${best}°C</b>.`,
        ],
        finalAnswer: `${best}°C`, skill: 'word',
      };
    }
    if (t === 'bank3') {
      const start = R.int(20, 90), out1 = R.int(40, 120), out2 = R.int(15, 60), inn = R.int(10, 70);
      const a1 = start - out1, a2 = a1 - out2, ans = a2 + inn;
      return {
        prompt: `Harper's account starts the week with $${start}. She pays $${out1} for a school trip, then $${out2} for togs, then her Saturday job pays in $${inn}. What is her balance at the end of the week?`,
        answer: { type: 'number', value: ans, unit: '$' },
        hint: 'Three steps in order. The account can go past 0 into overdraft (a negative balance).',
        working: [
          `<b>Picture:</b> the balance walks along the footpath; 0 is the gate and overdrawn is behind it.`,
          `1. ${start} − ${out1} = ${N.fmt(a1)}${a1 < 0 ? ' (overdrawn)' : ''}.`,
          `2. ${N.fmt(a1)} − ${out2} = ${N.fmt(a2)}.`,
          `3. ${N.fmt(a2)} + ${inn} = ${N.fmt(ans)}.`,
          `Balance at the end of the week: <b>${bal(ans)}</b>.`,
        ],
        finalAnswer: bal(ans), skill: 'word',
      };
    }
    if (t === 'altitude') {
      const top = R.int(180, 900), tunnel = -R.int(20, 160), len = R.int(2, 9);
      return {
        prompt: `A lookout above the Kaimai tunnel is ${top} m above sea level. The tunnel floor is at ${N.fmt(tunnel)} m. The tunnel is ${len} km long. What is the height difference between the lookout and the tunnel floor?`,
        answer: { type: 'number', value: top - tunnel, unit: 'm' },
        hint: 'Only two of the three numbers are heights. The length of the tunnel is not needed.',
        working: [
          `<b>Picture:</b> sea level is 0 on a number line standing up.`,
          `1. Which numbers are heights? ${top} m and ${N.fmt(tunnel)} m. The ${len} km length is <b>not needed</b>.`,
          `2. Difference = higher − lower = ${top} − (${N.fmt(tunnel)}).`,
          `Two minuses make a plus: ${top} + ${-tunnel} = ${top - tunnel}.`,
          `Height difference: <b>${top - tunnel} m</b>.`,
        ],
        finalAnswer: `${top - tunnel} m`, skill: 'word',
      };
    }
    if (t === 'backwards3') {
      const end = R.int(-5, 8), fall = R.int(5, 15), rise = R.int(4, 14);
      const startT = end - rise + fall;
      return {
        prompt: `Overnight at a Ruapehu lodge the temperature fell ${fall}°C, then during the day it rose ${rise}°C, finishing at ${N.fmt(end)}°C. What was the temperature before the fall?`,
        answer: { type: 'number', value: startT, unit: '°C' },
        hint: 'Work backwards from the finish: undo the rise first (subtract it), then undo the fall (add it).',
        working: [
          `<b>Picture:</b> we know the finish, so walk the thermometer backwards.`,
          `1. Undo the rise: ${N.fmt(end)} − ${rise} = ${N.fmt(end - rise)}.`,
          `2. Undo the fall: ${N.fmt(end - rise)} + ${fall} = ${N.fmt(startT)}.`,
          `Check forwards: ${N.fmt(startT)} − ${fall} + ${rise} = ${N.fmt(end)}. ✓`,
          `It started at <b>${N.fmt(startT)}°C</b>.`,
        ],
        finalAnswer: `${N.fmt(startT)}°C`, skill: 'word',
      };
    }
    if (t === 'mean') {
      let t4, sum;
      do { t4 = [0, 0, 0, 0].map(() => R.int(-11, 7)); sum = t4.reduce((a, b) => a + b, 0); } while (sum % 4 !== 0 || !t4.some((v) => v < 0) || t4.every((v) => v === t4[0]));
      const ans = sum / 4;
      return {
        prompt: `The dawn temperatures at Mt Hutt for four days were ${t4.map((v) => N.fmt(v) + '°C').join(', ')}. What was the mean (average) dawn temperature?`,
        answer: { type: 'number', value: ans, unit: '°C' },
        hint: 'Add the four temperatures (watch the negatives), then divide the total by 4.',
        working: [
          `<b>Picture:</b> add them by walking the thermometer, then share the total between the 4 days.`,
          `1. Add: ${t4.map((v) => N.fmt(v)).join(' + ').replace(/\+ −/g, '− ')} = ${N.fmt(sum)}.`,
          `2. Divide by 4: ${N.fmt(sum)} ÷ 4 = ${N.fmt(ans)}. Signs are ${sum < 0 ? 'different → negative' : 'the same → positive'}.`,
          `Mean dawn temperature: <b>${N.fmt(ans)}°C</b>.`,
        ],
        finalAnswer: `${N.fmt(ans)}°C`, skill: 'word',
      };
    }
    let ka, kb, kc, ta, tb, tc, kiwi, tui;
    do {
      ka = R.nz(12); kb = R.nz(12); kc = R.nz(12);
      ta = R.nz(12); tb = R.nz(12); tc = R.nz(12);
      kiwi = ka + kb + kc; tui = ta + tb + tc;
    } while (kiwi === tui || (kiwi > 0 && tui > 0));
    const winner = kiwi > tui ? 'Kiwi' : 'Tūī', margin = Math.abs(kiwi - tui);
    return {
      prompt: `At the school quiz night the Kiwi team scored ${[ka, kb, kc].map((v) => N.fmt(v)).join(', ')} in three rounds and the Tūī team scored ${[ta, tb, tc].map((v) => N.fmt(v)).join(', ')}. By how many points does the winning team win?`,
      answer: { type: 'number', value: margin, unit: 'points' },
      hint: 'Total each team first (careful with the negatives), then find the difference between the two totals.',
      working: [
        `<b>Picture:</b> each team walks along the footpath, forwards for a win and backwards for a loss.`,
        `1. Kiwi: ${[ka, kb, kc].map((v) => N.fmt(v)).join(' + ').replace(/\+ −/g, '− ')} = ${N.fmt(kiwi)}.`,
        `2. Tūī: ${[ta, tb, tc].map((v) => N.fmt(v)).join(' + ').replace(/\+ −/g, '− ')} = ${N.fmt(tui)}.`,
        `3. Difference: ${N.fmt(Math.max(kiwi, tui))} − (${N.fmt(Math.min(kiwi, tui))}) = ${margin}.`,
        `The ${winner} team wins by <b>${margin} points</b>.`,
      ],
      finalAnswer: `${margin} points`, skill: 'word',
    };
  }

  function word(level) {
    return level === 1 ? wordL1() : level === 2 ? wordL2() : wordL3();
  }

  HL.registerTopic({
    id: 'integers', subject: 'maths', strand: 'number', order: 2,
    name: 'Integers', short: 'Integers',
    blurb: 'Adding, subtracting, multiplying and dividing with negative numbers.',
    example: '−7 + 12 = 5 &nbsp;·&nbsp; (−3) × 4 = −12',
    animal: 'penguin',
    learn: {
      what: '<p>Integers are whole numbers that can be <b>positive</b>, <b>negative</b> or zero: … −3, −2, −1, 0, 1, 2, 3 … Negative numbers show up as temperatures below zero, basement floors, and money you owe. The number line is your best friend: <b>right is bigger, left is smaller</b>.</p>',
      visual: `<svg viewBox="0 0 360 120" width="360" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        <line x1="14" y1="70" x2="346" y2="70" stroke="#4A3B48" stroke-width="2"/>
        <polygon points="346,70 336,64 336,76" fill="#4A3B48"/><polygon points="14,70 24,64 24,76" fill="#4A3B48"/>
        ${[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i)=>{const x=40+i*28;return `<line x1="${x}" y1="63" x2="${x}" y2="77" stroke="#4A3B48" stroke-width="2"/><text x="${x}" y="98" text-anchor="middle" fill="${n<0?'#E0568C':n===0?'#4A3B48':'#2A6FA5'}">${n<0?'−'+(-n):n}</text>`}).join('')}
        <path d="M96 58 q28 -30 56 0" stroke="#E0568C" stroke-width="3" fill="none" marker-end="url(#ar)"/>
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#E0568C"/></marker></defs>
        <text x="124" y="22" text-anchor="middle" fill="#E0568C">−3 + 2 = −1</text>
        <text x="60" y="118" fill="#E0568C" font-size="12">◀ smaller</text><text x="300" y="118" text-anchor="end" fill="#2A6FA5" font-size="12">bigger ▶</text>
      </svg>`,
      facts: [
        '<b>Add</b> a positive → move <b>right</b>',
        '<b>Subtract</b> a positive → move <b>left</b>',
        'Two minuses make a plus: <b>5 − (−3) = 5 + 3</b>',
        '× or ÷: <b>same signs → +</b>, <b>different signs → −</b>',
        '−7 is <b>smaller</b> than −2 (further left)',
        'Ordering: <b>−9 &lt; −6 &lt; 0 &lt; 2</b>. On a negative, <b>bigger digits = smaller number</b>',
        'BEDMAS still rules: do <b>× and ÷ first</b>, then + and −, using the sign rules',
      ],
      steps: [
        '<b>Adding</b> a positive number moves you <b>right</b> on the number line. Adding a negative moves you <b>left</b>.',
        '<b>Subtracting</b> a negative is the same as <b>adding</b>: 5 − (−3) = 5 + 3 = 8. (Two minuses make a plus.)',
        '<b>Multiplying or dividing</b>: work out the numbers first, then the sign. <b>Same</b> signs → positive. <b>Different</b> signs → negative.',
      ],
      examples: [
        { q: 'Put these in order, smallest first: −6, &nbsp;2, &nbsp;−9, &nbsp;0',
          visual: `<svg viewBox="0 0 360 86" width="360" height="86" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <line x1="10" y1="40" x2="350" y2="40" stroke="#4A3B48" stroke-width="2"/>
            ${[-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4].map((n) => { const x = 16 + (n + 10) * 23.4; const on = [-9, -6, 0, 2].includes(n); return `<line x1="${x}" y1="${on ? 32 : 35}" x2="${x}" y2="${on ? 48 : 45}" stroke="${on ? '#E0568C' : '#9A8A98'}" stroke-width="${on ? 3 : 1.5}"/>${on ? `<circle cx="${x}" cy="40" r="5" fill="${n < 0 ? '#E0568C' : '#2A6FA5'}"/><text x="${x}" y="66" text-anchor="middle" fill="${n < 0 ? '#E0568C' : '#2A6FA5'}">${N.fmt(n)}</text>` : ''}`; }).join('')}
            <text x="180" y="82" text-anchor="middle" fill="#4A3B48" font-size="12">read them left → right: −9, −6, 0, 2</text>
          </svg>`,
          working: ['<b>Picture:</b> the footpath again. Smallest = furthest <b>behind</b> the gate (furthest left).', '1. Which ones are negative? −6 and −9. They both sit behind the gate.', '2. Which of those is furthest back? <b>−9</b> (bigger digits means further left, so it is <b>smaller</b>).', '3. Then −6, then 0 (the gate), then 2.', 'Order: −9, −6, 0, 2'], a: '−9, &nbsp;−6, &nbsp;0, &nbsp;2' },
        { q: '−6 + 10', working: ['<b>Picture:</b> a footpath with 0 at the gate. Negative = behind the gate, positive = past it. Adding = walk <b>forwards</b>, subtracting = walk <b>backwards</b>.', '1. Where do I start? At −6 (6 steps behind the gate).', '2. Is it + or −? It is +, so I walk <b>forwards</b> 10 steps.', '3. 6 steps get me to the gate (0), and 4 more steps past it.', '−6 + 10 = 4'], a: '4',
          visual: `<svg viewBox="0 0 360 70" width="360" height="70" xmlns="http://www.w3.org/2000/svg" font-size="13" font-weight="700"><line x1="14" y1="44" x2="346" y2="44" stroke="#4A3B48" stroke-width="2"/>${[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i)=>{const x=24+i*26;return `<line x1="${x}" y1="38" x2="${x}" y2="50" stroke="#4A3B48" stroke-width="2"/><text x="${x}" y="66" text-anchor="middle" fill="${n===0?'#E0568C':'#4A3B48'}">${n<0?'−'+(-n):n}</text>`}).join('')}<path d="M50 34 q130 -40 260 0" stroke="#E0568C" stroke-width="3" fill="none"/><polygon points="310,34 300,26 298,38" fill="#E0568C"/><circle cx="50" cy="44" r="5" fill="#E0568C"/><circle cx="310" cy="44" r="5" fill="#2FA97A"/><text x="180" y="14" text-anchor="middle" fill="#E0568C">walk forwards 10 →</text><text x="206" y="30" text-anchor="middle" fill="#4A3B48" font-size="11">gate</text></svg>` },
        { q: '4 − 9', working: ['<b>Picture:</b> the footpath again. Subtracting = walk <b>backwards</b>.', '1. Where do I start? 4 steps past the gate.', '2. It is −, so I walk backwards 9 steps.', '3. 4 steps back gets me to the gate (0), then 5 more steps <b>behind</b> the gate.', '4 − 9 = −5'], a: '−5' },
        { q: '3 − (−5)', working: ['<b>Picture:</b> "subtract a negative" is like <b>taking away a debt</b> — you end up richer, so it is really adding.', '1. Do I see two minus signs together? Yes: − (−5).', '2. Two minuses make a plus, so I rewrite it: 3 + 5.', '3 + 5 = 8'], a: '8' },
        { q: '(−4) × (−6)', working: ['<b>Picture:</b> for × and ÷ I do two jobs: the <b>number job</b>, then the <b>sign job</b>.', '1. Number job: 4 × 6 = 24.', '2. Sign job: are the signs the same? Yes, both negative → the answer is <b>positive</b>.', '(−4) × (−6) = 24'], a: '24' },
        { q: '−36 ÷ 9', working: ['<b>Picture:</b> number job, then sign job.', '1. Number job: 36 ÷ 9 = 4.', '2. Sign job: are the signs the same? No, one negative and one positive → the answer is <b>negative</b>.', '−36 ÷ 9 = −4'], a: '−4' },
        { q: '−3 + 4 × (−2)',
          visual: `<svg viewBox="0 0 344 108" width="344" height="108" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="16" font-weight="700">
            <text x="16" y="28" fill="#4A3B48">−3 + <tspan fill="#E0568C" text-decoration="underline">4 × (−2)</tspan></text>
            <text x="336" y="28" text-anchor="end" font-size="12" fill="#E0568C">× first (BEDMAS)</text>
            <text x="16" y="62" fill="#4A3B48">−3 + <tspan fill="#2A6FA5">(−8)</tspan></text>
            <text x="336" y="62" text-anchor="end" font-size="12" fill="#2A6FA5">adding a negative = walk left 8</text>
            <text x="16" y="96" fill="#2FA97A">−11</text>
          </svg>`,
          working: ['<b>Picture:</b> two jobs. First the × job (number job, then sign job), then walk on the footpath.', '1. Which comes first in BEDMAS? The <b>×</b>, not the +.', '2. 4 × (−2): numbers 4 × 2 = 8. Signs different → <b>negative</b>. So it is −8.', '3. Now −3 + (−8). Adding a negative means walk <b>left</b> 8 from −3.', '−3 + (−8) = −11'], a: '−11' },
        { q: 'The temperature in Ohakune was −4°C at dawn and rose by 11°C by lunchtime. What was the temperature at lunchtime?', working: ['<b>Picture:</b> a thermometer is a number line standing up. Rising = going <b>up</b> (forwards), dropping = going down.', '1. Where do I start? −4 (4 below zero).', '2. "Rose by 11" means add 11: −4 + 11.', '3. 4 steps get me to 0, then 7 more above zero.', '−4 + 11 = 7'], a: '7°C' },
      ],
      tips: [
        'Draw a quick number line if you are unsure — it always works.',
        '"Two signs together" trick: + − → −, &nbsp; − − → +, &nbsp; + + → +.',
        'The sign rule (same → +, different → −) is for × and ÷ only. For + and −, use the number line.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
