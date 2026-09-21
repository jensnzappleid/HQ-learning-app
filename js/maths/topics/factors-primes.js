/* Topic: Factors, multiples & primes — factors, HCF, LCM, prime factorisation, divisibility */
(function (HL) {
  const R = HL.rng, N = HL.num;

  // ---------- number helpers ----------
  const factors = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const primesTo = (max) => { const p = []; for (let i = 2; i <= max; i++) if (isPrime(i)) p.push(i); return p; };
  /** prime factorisation -> [[p, e], ...] */
  const primeFac = (n) => { const out = []; let m = n; for (let p = 2; p <= m; p++) { let e = 0; while (m % p === 0) { m /= p; e++; } if (e) out.push([p, e]); } return out; };
  const facHtml = (pf) => pf.map(([p, e]) => (e === 1 ? String(p) : N.pow(p, e))).join(' × ');
  const list = (arr) => arr.join(', ');
  const smallestPrimeFactor = (n) => { for (let i = 2; i <= n; i++) if (n % i === 0) return i; return n; };
  /** repeated division working lines for n */
  function divisionLines(n) {
    const lines = []; let m = n;
    while (!isPrime(m)) { const p = smallestPrimeFactor(m); lines.push(`${m} ÷ ${p} = ${m / p}`); m /= p; }
    lines.push(`${m} is prime, so stop.`);
    return lines;
  }
  /** a random composite in [lo, hi] with at least `minFactors` factors */
  function composite(lo, hi, minFactors = 4) {
    for (let i = 0; i < 100; i++) { const n = R.int(lo, hi); if (!isPrime(n) && factors(n).length >= minFactors) return n; }
    return 24;
  }
  /** two numbers with a "nice" HCF (> 1) */
  function hcfPair(level) {
    const g = level === 1 ? R.pick([2, 3, 4, 5, 6]) : level === 2 ? R.pick([3, 4, 5, 6, 7, 8, 9, 12]) : R.pick([6, 8, 9, 12, 14, 15, 18]);
    const max = level === 1 ? 6 : level === 2 ? 9 : 12;
    let a, b;
    do { [a, b] = R.pair(2, max); } while (N.gcd(a, b) !== 1);
    return [g * a, g * b];
  }
  function lcmPair(level) {
    const pool = level === 1 ? [2, 3, 4, 5, 6, 8, 10] : level === 2 ? [4, 6, 8, 9, 10, 12, 15] : [6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
    let a, b;
    do { [a, b] = R.sample(pool, 2); } while (a % b === 0 || b % a === 0 || N.lcm(a, b) > 200);
    return [a, b];
  }
  const hcfWorking = (a, b, level) => {
    const g = N.gcd(a, b);
    if (level < 3) {
      const common = factors(a).filter((f) => b % f === 0);
      return [
        `Factors of ${a}: ${list(factors(a))}.`,
        `Factors of ${b}: ${list(factors(b))}.`,
        `Common factors: ${list(common)}.`,
        `The highest common factor is <b>${g}</b>.`,
      ];
    }
    const pa = primeFac(a), pb = primeFac(b);
    const shared = pa.filter(([p]) => pb.some(([q]) => q === p)).map(([p, e]) => [p, Math.min(e, pb.find(([q]) => q === p)[1])]);
    return [
      `Prime factors: ${a} = ${facHtml(pa)} and ${b} = ${facHtml(pb)}.`,
      `Take the primes they <b>share</b> (lowest power of each): ${shared.length ? facHtml(shared) : 'none'}.`,
      `Multiply them: HCF = <b>${g}</b>.`,
    ];
  };
  const lcmWorking = (a, b, level) => {
    const l = N.lcm(a, b);
    const big = Math.max(a, b), small = Math.min(a, b);
    if (level < 3 || l <= 60) {
      const mults = []; for (let k = 1; k * big <= l; k++) mults.push(k * big);
      return [
        `List multiples of the bigger number, ${big}: ${list(mults)}${mults.length < 6 ? ' …' : '.'}`,
        `Check each one: is it also a multiple of ${small}? The first one that works is ${l} (${l} ÷ ${small} = ${l / small}).`,
        `The lowest common multiple is <b>${l}</b>.`,
      ];
    }
    const pa = primeFac(a), pb = primeFac(b);
    const all = {}; pa.concat(pb).forEach(([p, e]) => { all[p] = Math.max(all[p] || 0, e); });
    const merged = Object.keys(all).map(Number).sort((x, y) => x - y).map((p) => [p, all[p]]);
    return [
      `Prime factors: ${a} = ${facHtml(pa)} and ${b} = ${facHtml(pb)}.`,
      `Take <b>every</b> prime that appears, using the highest power of each: ${facHtml(merged)}.`,
      `Multiply them: LCM = <b>${l}</b>.`,
    ];
  };

  // ---------- calc questions ----------
  function countFactors(level) {
    const n = level === 1 ? composite(6, 30) : level === 2 ? composite(20, 60, 6) : composite(40, 100, 8);
    const f = factors(n);
    return {
      prompt: `How many factors does ${n} have? (Count 1 and ${n} too.)`,
      answer: { type: 'number', value: f.length },
      hint: `Find factor pairs: 1 × ${n}, then try 2, 3, 4… Keep going until the pairs meet in the middle.`,
      working: [
        `Factor pairs of ${n}: ${f.filter((x) => x * x <= n).map((x) => `${x} × ${n / x}`).join(', ')}.`,
        `So the factors are ${list(f)}.`,
        `That is <b>${f.length}</b> factors.`,
      ],
      finalAnswer: String(f.length), skill: 'factors',
    };
  }

  function factorListChoice(level) {
    const n = level === 1 ? composite(8, 30) : level === 2 ? composite(20, 60, 6) : composite(40, 100, 8);
    const f = factors(n);
    const correct = list(f);
    const opts = new Set([correct]);
    let guard = 0;
    while (opts.size < 4 && guard++ < 50) {
      const kind = R.int(0, 2);
      if (kind === 0 && f.length > 3) { const i = R.int(1, f.length - 2); opts.add(list(f.filter((_, j) => j !== i))); }
      else if (kind === 1) { let x; do { x = R.int(2, n - 1); } while (n % x === 0); opts.add(list(f.concat(x).sort((a, b) => a - b))); }
      else opts.add(list(f.slice(1, -1)));
    }
    const choices = R.shuffle([...opts]);
    return {
      prompt: `Which list shows <b>all</b> the factors of ${n}?`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: 'A factor divides into the number exactly. Check every number in the list, and remember 1 and the number itself are always factors.',
      working: [
        `Work in pairs: ${f.filter((x) => x * x <= n).map((x) => `${x} × ${n / x}`).join(', ')}.`,
        `Factors of ${n}: <b>${correct}</b>.`,
      ],
      finalAnswer: correct, skill: 'factors',
    };
  }

  function whichPrime(level) {
    const max = level === 1 ? 30 : level === 2 ? 80 : 140;
    const primes = primesTo(max).filter((p) => p > (level === 1 ? 3 : level === 2 ? 10 : 40));
    const tricky = level === 3 ? [51, 57, 87, 91, 111, 119, 121, 133, 129, 123, 117, 143] : [];
    const p = R.pick(primes);
    const comps = new Set();
    let guard = 0;
    while (comps.size < 3 && guard++ < 100) {
      const c = level === 3 && R.chance(0.6) ? R.pick(tricky) : R.int(level === 1 ? 4 : 10, max);
      if (!isPrime(c) && c % 2 === 1 || (level === 1 && !isPrime(c))) comps.add(c);
    }
    const choices = R.shuffle([p, ...comps]);
    return {
      prompt: 'Which of these numbers is <b>prime</b>?',
      answer: { type: 'choice', value: choices.indexOf(p), choices: choices.map(String) },
      hint: 'A prime has exactly two factors: 1 and itself. Try dividing each number by 2, 3, 5, 7…',
      working: [...comps].map((c) => `${c} = ${smallestPrimeFactor(c)} × ${c / smallestPrimeFactor(c)}, so it is not prime.`).concat([`${p} cannot be divided by any number except 1 and ${p}. <b>${p}</b> is prime.`]),
      finalAnswer: String(p), skill: 'primes',
    };
  }

  function isItPrime(level) {
    const max = level === 1 ? 30 : level === 2 ? 70 : 130;
    let n;
    if (R.chance(0.5)) n = R.pick(primesTo(max).filter((p) => p > 5));
    else if (level === 3 && R.chance(0.6)) n = R.pick([51, 57, 87, 91, 111, 119, 121, 129, 133, 143, 117, 123]);
    else { do { n = R.int(6, max); } while (isPrime(n) || (level > 1 && n % 2 === 0)); }
    const prime = isPrime(n);
    const p = smallestPrimeFactor(n);
    return {
      prompt: `Is ${n} a prime number?`,
      answer: { type: 'choice', value: prime ? 0 : 1, choices: ['Yes, prime', 'No, not prime'] },
      hint: `Try dividing ${n} by the small primes: 2, 3, 5, 7, 11. If none divide exactly, it is prime.`,
      working: prime
        ? [`Try 2, 3, 5, 7${n > 121 ? ', 11' : ''}: none of them divide into ${n} exactly.`, `The only factors of ${n} are 1 and ${n}, so <b>${n} is prime</b>.`]
        : [`${n} ÷ ${p} = ${n / p} exactly.`, `So ${n} has the factor ${p} (as well as 1 and ${n}). <b>${n} is not prime</b>.`],
      finalAnswer: prime ? `Yes, ${n} is prime` : `No, ${n} = ${p} × ${n / p}`, skill: 'primes',
    };
  }

  function hcf(level) {
    const [a, b] = hcfPair(level);
    const g = N.gcd(a, b);
    return {
      prompt: `Find the highest common factor (HCF) of ${a} and ${b}.`,
      answer: { type: 'number', value: g },
      hint: level < 3 ? 'List the factors of each number, then find the biggest number that is in both lists.' : 'Write each number as a product of primes, then multiply the primes they share.',
      working: hcfWorking(a, b, level),
      finalAnswer: String(g), skill: 'hcf',
    };
  }

  function lcm(level) {
    const [a, b] = lcmPair(level);
    const l = N.lcm(a, b);
    return {
      prompt: `Find the lowest common multiple (LCM) of ${a} and ${b}.`,
      answer: { type: 'number', value: l },
      hint: `List the multiples of ${Math.max(a, b)} and stop at the first one that ${Math.min(a, b)} also divides into.`,
      working: lcmWorking(a, b, level),
      finalAnswer: String(l), skill: 'lcm',
    };
  }

  function primeFactorisation(level) {
    let n;
    do { n = level === 1 ? composite(8, 40) : level === 2 ? composite(24, 100) : composite(60, 250); } while (primeFac(n).length < 2 && n < 32);
    const pf = primeFac(n);
    const correct = facHtml(pf);
    const opts = new Set([correct]);
    let guard = 0;
    while (opts.size < 4 && guard++ < 60) {
      const kind = R.int(0, 3);
      const copy = pf.map((x) => x.slice());
      if (kind === 0) { const i = R.int(0, copy.length - 1); copy[i][1] += R.pick([1, -1]); if (copy[i][1] < 1) copy[i][1] = 2; opts.add(facHtml(copy)); }
      else if (kind === 1) { const i = R.int(0, copy.length - 1); const next = R.pick([2, 3, 5, 7, 11].filter((q) => !copy.some(([p]) => p === q))); copy[i][0] = next; opts.add(facHtml(copy.sort((x, y) => x[0] - y[0]))); }
      else if (kind === 2) { const f = factors(n).filter((x) => x > 1 && x < n && !isPrime(x)); if (f.length) { const c = R.pick(f); opts.add(`${c} × ${n / c}`); } }
      else { const extra = R.pick([2, 3, 5]); opts.add(facHtml(copy.concat(copy.some(([p]) => p === extra) ? [[7, 1]] : [[extra, 1]]).sort((x, y) => x[0] - y[0]))); }
    }
    const choices = R.shuffle([...opts]);
    return {
      prompt: `Which of these is the prime factorisation of ${n}?`,
      answer: { type: 'choice', value: choices.indexOf(correct), choices },
      hint: `Keep dividing by the smallest prime that fits. Start with ${smallestPrimeFactor(n)}: ${n} ÷ ${smallestPrimeFactor(n)} = ${n / smallestPrimeFactor(n)}.`,
      working: divisionLines(n).concat([`Collect the primes you divided by: ${n} = <b>${correct}</b>.`]),
      finalAnswer: `${n} = ${correct}`, skill: 'prime-factorisation',
    };
  }

  function multiples(level) {
    const kind = level === 1 ? R.pick(['nth', 'which']) : R.pick(['nth', 'which', 'above']);
    if (kind === 'nth') {
      const m = R.int(3, level === 1 ? 9 : 12), k = R.int(3, level === 1 ? 9 : 15);
      const ordinal = (x) => x + (x % 10 === 1 && x !== 11 ? 'st' : x % 10 === 2 && x !== 12 ? 'nd' : x % 10 === 3 && x !== 13 ? 'rd' : 'th');
      return {
        prompt: `What is the ${ordinal(k)} multiple of ${m}?`,
        answer: { type: 'number', value: m * k },
        hint: `The multiples of ${m} are ${m}, ${2 * m}, ${3 * m}… The ${ordinal(k)} one is ${k} × ${m}.`,
        working: [`Multiples of ${m}: ${Array.from({ length: Math.min(k, 5) }, (_, i) => m * (i + 1)).join(', ')}${k > 5 ? '…' : ''}.`, `The ${ordinal(k)} multiple is ${k} × ${m} = <b>${m * k}</b>.`],
        finalAnswer: String(m * k), skill: 'multiples',
      };
    }
    if (kind === 'which') {
      const m = R.int(3, level === 1 ? 9 : 12);
      const correct = m * R.int(level === 1 ? 2 : 4, level === 1 ? 9 : 15);
      const opts = new Set([correct]);
      let guard = 0;
      while (opts.size < 4 && guard++ < 50) { const x = correct + R.nz(m > 4 ? m - 1 : 3); if (x > 0 && x % m !== 0) opts.add(x); }
      const choices = R.shuffle([...opts]);
      return {
        prompt: `Which of these is a multiple of ${m}?`,
        answer: { type: 'choice', value: choices.indexOf(correct), choices: choices.map(String) },
        hint: `A multiple of ${m} is in the ${m} times table. Divide each number by ${m} and see which one has no remainder.`,
        working: choices.map((c) => `${c} ÷ ${m} = ${c % m === 0 ? c / m + ' exactly' : Math.floor(c / m) + ' remainder ' + (c % m)}.`).concat([`<b>${correct}</b> is the multiple of ${m}.`]),
        finalAnswer: String(correct), skill: 'multiples',
      };
    }
    const m = R.int(6, 15), limit = R.int(40, 160);
    const ans = (Math.floor(limit / m) + 1) * m;
    return {
      prompt: `What is the smallest multiple of ${m} that is bigger than ${limit}?`,
      answer: { type: 'number', value: ans },
      hint: `Divide ${limit} by ${m}, round up to the next whole number, then multiply by ${m}.`,
      working: [`${limit} ÷ ${m} = ${N.fmt(N.round(limit / m, 2))}, so ${Math.floor(limit / m)} × ${m} = ${Math.floor(limit / m) * m} is just below ${limit}.`, `The next multiple is ${Math.floor(limit / m) + 1} × ${m} = <b>${ans}</b>.`],
      finalAnswer: String(ans), skill: 'multiples',
    };
  }

  // ---------- divisibility rules ----------
  const RULE = {
    2: 'the last digit is even (0, 2, 4, 6 or 8)',
    3: 'the digits add up to a multiple of 3',
    4: 'the last two digits make a multiple of 4',
    5: 'it ends in 0 or 5',
    6: 'it passes the 2 test <b>and</b> the 3 test',
    9: 'the digits add up to a multiple of 9',
    10: 'it ends in 0',
  };
  const digitSum = (n) => String(n).split('').reduce((s, d) => s + Number(d), 0);
  /** working lines that show the test for k on n */
  function ruleLines(n, k) {
    const ds = String(n).split('');
    const s = digitSum(n);
    const last2 = Number(String(n).slice(-2));
    if (k === 2) return [`Test for 2: is the last digit even? The last digit of ${N.fmt(n)} is <b>${n % 10}</b>, which is ${n % 2 === 0 ? 'even ✓' : 'odd ✗'}.`];
    if (k === 5) return [`Test for 5: does it end in 0 or 5? ${N.fmt(n)} ends in <b>${n % 10}</b> ${n % 5 === 0 ? '✓' : '✗'}.`];
    if (k === 10) return [`Test for 10: does it end in 0? ${N.fmt(n)} ends in <b>${n % 10}</b> ${n % 10 === 0 ? '✓' : '✗'}.`];
    if (k === 4) return [`Test for 4: look at the last two digits, <b>${String(n).slice(-2)}</b>.`, `${last2} ÷ 4 = ${last2 % 4 === 0 ? last2 / 4 + ' exactly ✓' : N.fmt(N.round(last2 / 4, 2)) + ', not a whole number ✗'}.`];
    if (k === 6) return [`Test for 6 = the 2 test <b>and</b> the 3 test.`,
      `Even? last digit ${n % 10} is ${n % 2 === 0 ? 'even ✓' : 'odd ✗'}.`,
      `Digits: ${ds.join(' + ')} = ${s}. Is ${s} a multiple of 3? ${s % 3 === 0 ? 'Yes ✓' : 'No ✗'}.`];
    return [`Test for ${k}: add the digits. ${ds.join(' + ')} = <b>${s}</b>.`,
      `Is ${s} a multiple of ${k}? ${s % k === 0 ? `Yes (${s} ÷ ${k} = ${s / k}) ✓` : 'No ✗'}.`];
  }
  function divisibleYesNo(level) {
    const k = level === 1 ? R.pick([2, 5, 10, 3]) : level === 2 ? R.pick([3, 4, 9, 6, 5]) : R.pick([3, 4, 6, 9]);
    const yes = R.chance(0.5);
    const lo = level === 1 ? 24 : level === 2 ? 120 : 1000;
    const hi = level === 1 ? 400 : level === 2 ? 999 : 9999;
    let n = R.int(lo, hi), guard = 0;
    while ((n % k === 0) !== yes && guard++ < 400) n = R.int(lo, hi);
    if ((n % k === 0) !== yes) n = yes ? k * Math.floor(hi / k) : k * Math.floor(hi / k) + 1;
    return {
      prompt: `Is ${N.fmt(n)} divisible by ${k}?`,
      answer: { type: 'choice', value: yes ? 0 : 1, choices: ['Yes', 'No'] },
      hint: `Use the divisibility rule for ${k}: ${RULE[k]}.`,
      working: [`A number divides by ${k} when ${RULE[k]}.`].concat(ruleLines(n, k)).concat([`So ${N.fmt(n)} is <b>${yes ? '' : 'not '}divisible by ${k}</b>${yes ? ` (${N.fmt(n)} ÷ ${k} = ${N.fmt(n / k)})` : ''}.`]),
      finalAnswer: yes ? `Yes (${N.fmt(n)} ÷ ${k} = ${N.fmt(n / k)})` : `No, ${k} does not divide into ${N.fmt(n)}`,
      skill: 'divisibility',
    };
  }
  function whichDivisible(level) {
    const k = level === 1 ? R.pick([2, 5, 10, 3]) : level === 2 ? R.pick([3, 4, 6, 9]) : R.pick([4, 6, 9, 3]);
    const lo = level === 1 ? 20 : level === 2 ? 100 : 300;
    const hi = level === 1 ? 200 : level === 2 ? 900 : 2000;
    const correct = k * R.int(Math.ceil(lo / k), Math.floor(hi / k));
    const opts = new Set([correct]);
    let guard = 0;
    while (opts.size < 4 && guard++ < 300) {
      const near = correct + R.pick([-3, -2, -1, 1, 2, 3, 4, 5, 9, 11]);
      if (near > 0 && near % k !== 0) opts.add(near);
    }
    const choices = R.shuffle([...opts]).map(String);
    return {
      prompt: `Which of these numbers is divisible by ${k}?`,
      answer: { type: 'choice', value: choices.indexOf(String(correct)), choices },
      hint: `Rule for ${k}: ${RULE[k]}. Test each number in turn.`,
      working: choices.map((c) => {
        const v = Number(c);
        return `${c}: ${k === 3 || k === 9 ? `digits add to ${digitSum(v)}` : k === 4 ? `last two digits ${String(v).slice(-2)}` : k === 6 ? `${v % 2 === 0 ? 'even' : 'odd'}, digits add to ${digitSum(v)}` : `ends in ${v % 10}`} → ${v % k === 0 ? '<b>divisible ✓</b>' : 'not divisible ✗'}`;
      }).concat([`Answer: <b>${correct}</b> (${correct} ÷ ${k} = ${correct / k}).`]),
      finalAnswer: String(correct), skill: 'divisibility',
    };
  }

  // ---------- named number sequences: squares and triangular numbers ----------
  const SQUARES = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  const TRIANGLES = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];
  function sequenceQ(level) {
    const kind = R.pick(level === 1 ? ['sqNext', 'sqNext', 'triNext', 'sqWhich'] : ['sqNext', 'triNext', 'triNext', 'sqWhich', 'triWhich']);
    const top = level === 1 ? 6 : level === 2 ? 9 : 12;
    if (kind === 'sqNext' || kind === 'triNext') {
      const sq = kind === 'sqNext';
      const seq = sq ? SQUARES : TRIANGLES;
      const i = R.int(2, Math.min(top - 1, seq.length - 2));
      const shown = seq.slice(0, i + 1);
      const ans = seq[i + 1];
      return {
        prompt: `These are the ${sq ? 'square' : 'triangular'} numbers: ${shown.join(', ')}, … What is the <b>next</b> one?`,
        answer: { type: 'number', value: ans },
        hint: sq ? `Square numbers are 1×1, 2×2, 3×3, … The last one shown is ${i + 1} × ${i + 1}, so the next is ${i + 2} × ${i + 2}.`
          : `Each gap grows by one: +2, +3, +4, +5 … The last gap was ${shown[i] - shown[i - 1]}, so the next gap is ${shown[i] - shown[i - 1] + 1}.`,
        working: sq
          ? [`Square numbers come from a number times itself: 1×1 = 1, 2×2 = 4, 3×3 = 9 …`, `${shown[i]} = ${i + 1} × ${i + 1}, so it is the ${i + 1}th square number.`, `Next: ${i + 2} × ${i + 2} = <b>${ans}</b>.`]
          : [`Triangular numbers are dots stacked in a triangle: 1, then +2, then +3, then +4 …`, `Gaps so far: ${shown.slice(1).map((v, j) => '+' + (v - shown[j])).join(', ')}.`, `The next gap is +${ans - shown[i]}: ${shown[i]} + ${ans - shown[i]} = <b>${ans}</b>.`],
        finalAnswer: String(ans), skill: sq ? 'square-numbers' : 'triangular-numbers',
      };
    }
    const sq = kind === 'sqWhich';
    const seq = sq ? SQUARES : TRIANGLES;
    const pool = seq.slice(1, top + 1);
    const correct = R.pick(pool);
    const opts = new Set([correct]);
    let guard = 0;
    while (opts.size < 4 && guard++ < 200) {
      const near = correct + R.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
      if (near > 1 && !seq.includes(near)) opts.add(near);
    }
    const choices = R.shuffle([...opts]).map(String);
    return {
      prompt: `Which of these is a <b>${sq ? 'square' : 'triangular'}</b> number?`,
      answer: { type: 'choice', value: choices.indexOf(String(correct)), choices },
      hint: sq ? 'Square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144 …' : 'Triangular numbers: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55 …',
      working: [
        sq ? 'Square numbers: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144.' : 'Triangular numbers: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78.',
        `Check the list: ${choices.map((c) => `${c} ${seq.includes(Number(c)) ? '✓' : '✗'}`).join(', ')}.`,
        sq ? `<b>${correct}</b> = ${Math.round(Math.sqrt(correct))} × ${Math.round(Math.sqrt(correct))}.` : `<b>${correct}</b> is in the triangular list.`,
      ],
      finalAnswer: String(correct), skill: sq ? 'square-numbers' : 'triangular-numbers',
    };
  }

  function calc(level) {
    const pool = level === 1
      ? ['count', 'list', 'whichPrime', 'isPrime', 'hcf', 'lcm', 'multiples', 'multiples', 'primeFac', 'divYesNo', 'divWhich', 'seq']
      : level === 2 ? ['count', 'list', 'whichPrime', 'isPrime', 'hcf', 'hcf', 'lcm', 'lcm', 'primeFac', 'primeFac', 'multiples', 'divYesNo', 'divWhich', 'seq', 'seq']
        : ['count', 'whichPrime', 'isPrime', 'hcf', 'hcf', 'lcm', 'lcm', 'primeFac', 'primeFac', 'multiples', 'divYesNo', 'divWhich', 'seq', 'seq'];
    const t = R.pick(pool);
    if (t === 'divYesNo') return divisibleYesNo(level);
    if (t === 'divWhich') return whichDivisible(level);
    if (t === 'seq') return sequenceQ(level);
    if (t === 'count') return countFactors(level);
    if (t === 'list') return factorListChoice(level);
    if (t === 'whichPrime') return whichPrime(level);
    if (t === 'isPrime') return isItPrime(level);
    if (t === 'hcf') return hcf(level);
    if (t === 'lcm') return lcm(level);
    if (t === 'primeFac') return primeFactorisation(level);
    return multiples(level);
  }

  // ---------- word problems ----------
  // ---------- word problems (level 1 easy · level 2 typical · level 3 multi-step) ----------
  const pad2 = (n) => String(n).padStart(2, '0');
  const clock = (mins) => `${Math.floor(mins / 60)}:${pad2(mins % 60)} am`;

  /** LEVEL 1 — one step, small friendly numbers */
  function wordL1() {
    const t = R.pick(['lights', 'laps', 'bags', 'rows', 'share', 'teamsize']);
    if (t === 'lights' || t === 'laps') {
      const [a, b] = lcmPair(1);
      const l = N.lcm(a, b);
      const story = t === 'lights'
        ? { p: `At the beach one lighthouse flashes every ${a} seconds and another flashes every ${b} seconds. They flash together now. How many seconds until they next flash together?`, unit: 's' }
        : { p: `Harper runs a lap of the field every ${a} minutes and her friend takes ${b} minutes per lap. They start together. After how many minutes are they next at the start line together?`, unit: 'min' };
      return {
        prompt: story.p,
        answer: { type: 'number', value: l, unit: story.unit },
        hint: `This is asking for the lowest common multiple of ${a} and ${b}.`,
        working: [`We need the first time that is a multiple of both ${a} and ${b}: the LCM.`].concat(lcmWorking(a, b, 1)),
        finalAnswer: `${l} ${story.unit}`, skill: 'lcm',
      };
    }
    if (t === 'bags') {
      const [a, b] = hcfPair(1);
      const g = N.gcd(a, b);
      return {
        prompt: `Harper has ${a} kiwifruit and ${b} feijoas. She wants to make identical fruit bags using all the fruit, with none left over. What is the greatest number of bags she can make?`,
        answer: { type: 'number', value: g, unit: 'bags' },
        hint: `You need the biggest number that divides exactly into both ${a} and ${b}: the highest common factor.`,
        working: [`We need the highest common factor of ${a} and ${b}.`].concat(hcfWorking(a, b, 1)).concat([`Each bag gets ${a / g} kiwifruit and ${b / g} feijoas.`]),
        finalAnswer: `${g} bags`, skill: 'hcf',
      };
    }
    if (t === 'rows') {
      const n = composite(12, 30, 6);
      const f = factors(n).filter((x) => x > 1 && x < n);
      const good = R.sample(f, 3);
      let bad; do { bad = R.int(2, Math.min(n - 1, 12)); } while (n % bad === 0);
      const choices = R.shuffle(good.concat(bad));
      return {
        prompt: `Harper is arranging ${n} chairs for assembly into equal rows. Which of these row sizes will <b>not</b> work?`,
        answer: { type: 'choice', value: choices.indexOf(bad), choices: choices.map(String) },
        hint: `A row size works only if it is a factor of ${n}. Try dividing.`,
        working: choices.map((c) => `${n} ÷ ${c} = ${c === bad ? N.fmt(N.round(n / c, 2)) + ', not a whole number' : n / c + ' rows, works'}.`).concat([`<b>${bad}</b> is not a factor of ${n}, so rows of ${bad} will not work.`]),
        finalAnswer: String(bad), skill: 'factors',
      };
    }
    if (t === 'teamsize') {
      const n = composite(18, 48, 6);
      const f = factors(n).filter((x) => x > 2 && x < n);
      const good = R.pick(f);
      const bads = new Set();
      let guard = 0;
      while (bads.size < 3 && guard++ < 200) { const c = R.int(3, 12); if (n % c !== 0) bads.add(c); }
      const choices = R.shuffle([good].concat([...bads])).map(String);
      return {
        prompt: `The netball club has ${n} players. Which of these team sizes uses <b>every</b> player, with nobody left out?`,
        answer: { type: 'choice', value: choices.indexOf(String(good)), choices },
        hint: `A team size works only if it divides into ${n} with no remainder. That means it must be a factor of ${n}.`,
        working: [`<b>Picture:</b> the players line up in equal teams — nobody may be left standing on the side.`]
          .concat(choices.map((c) => `${n} ÷ ${c} = ${n % Number(c) === 0 ? n / Number(c) + ' teams exactly ✓' : Math.floor(n / Number(c)) + ' remainder ' + (n % Number(c)) + ' ✗'}`))
          .concat([`Only <b>${good}</b> is a factor of ${n}.`]),
        finalAnswer: String(good), skill: 'factors',
      };
    }
    const k = R.int(3, 6);
    const yes = R.chance(0.5);
    let n; do { n = R.int(20, 60); } while ((n % k === 0) !== yes);
    const item = R.pick(['muffins', 'stickers', 'marbles', 'pipis', 'jellybeans']);
    return {
      prompt: `Can ${n} ${item} be shared equally between ${k} people with none left over?`,
      answer: { type: 'choice', value: yes ? 0 : 1, choices: ['Yes', 'No'] },
      hint: `Divide ${n} by ${k}. If there is no remainder, they share equally.`,
      working: [`${n} ÷ ${k} = ${yes ? n / k + ' exactly' : Math.floor(n / k) + ' remainder ' + (n % k)}.`, yes ? `<b>Yes</b>, each person gets ${n / k} ${item}.` : `<b>No</b>, ${n % k} would be left over.`],
      finalAnswer: yes ? `Yes (${n / k} each)` : `No (${n % k} left over)`, skill: 'factors',
    };
  }

  /** LEVEL 2 — typical Year 8: bigger numbers, and a follow-up step */
  function wordL2() {
    const t = R.pick(['buses', 'hotdogs', 'tiles', 'ribbon', 'teams', 'sharebig']);
    if (t === 'buses') {
      const [a, b] = lcmPair(2);
      const l = N.lcm(a, b);
      return {
        prompt: `At the bus station the Number 1 bus leaves every ${a} minutes and the Number 2 bus leaves every ${b} minutes. They both leave at 9:00 am. How many minutes later do they next leave together?`,
        answer: { type: 'number', value: l, unit: 'min' },
        hint: `This is asking for the lowest common multiple of ${a} and ${b}.`,
        working: [`We need the first time that is a multiple of both ${a} and ${b}: the LCM.`].concat(lcmWorking(a, b, 2)),
        finalAnswer: `${l} min`, skill: 'lcm',
      };
    }
    if (t === 'hotdogs') {
      const [a, b] = lcmPair(2);
      const l = N.lcm(a, b);
      return {
        prompt: `Sausages come in packs of ${a} and bread rolls come in packs of ${b}. Harper wants the same number of sausages and rolls with none left over. What is the smallest number of sausages she can buy?`,
        answer: { type: 'number', value: l, unit: 'sausages' },
        hint: `The number must be a multiple of ${a} and a multiple of ${b}. Find the lowest common multiple.`,
        working: [`The number of sausages must be in both the ${a} and ${b} times tables: the LCM.`].concat(lcmWorking(a, b, 2)).concat([`She buys ${l / a} packs of sausages and ${l / b} packs of rolls.`]),
        finalAnswer: `${l} sausages`, skill: 'lcm',
      };
    }
    const [a, b] = hcfPair(2);
    const g = N.gcd(a, b);
    if (t === 'tiles' || t === 'ribbon' || t === 'teams') {
      const stories = {
        tiles: { p: `A bathroom floor is ${a} cm by ${b} cm. Harper wants to cover it exactly with identical square tiles, as large as possible. How long is each side of a tile?`, unit: 'cm', extra: `That needs ${a / g} tiles by ${b / g} tiles.` },
        ribbon: { p: `Two ribbons are ${a} cm and ${b} cm long. Harper cuts them both into pieces of the same length, as long as possible, with nothing wasted. How long is each piece?`, unit: 'cm', extra: `She gets ${a / g} + ${b / g} = ${a / g + b / g} pieces.` },
        teams: { p: `${a} girls and ${b} boys are split into equal teams. Every team must have the same number of girls and the same number of boys. What is the greatest number of teams?`, unit: 'teams', extra: `Each team has ${a / g} girls and ${b / g} boys.` },
      };
      const s = stories[t];
      return {
        prompt: s.p,
        answer: { type: 'number', value: g, unit: s.unit },
        hint: `You need the biggest number that divides exactly into both ${a} and ${b}: the highest common factor.`,
        working: [`We need the highest common factor of ${a} and ${b}.`].concat(hcfWorking(a, b, 2)).concat([s.extra]),
        finalAnswer: `${g} ${s.unit}`, skill: 'hcf',
      };
    }
    const k = R.int(3, 9);
    const yes = R.chance(0.5);
    let n; do { n = R.int(40, 140); } while ((n % k === 0) !== yes);
    return {
      prompt: `A tray of ${n} mini pies is shared out at the school gala between ${k} stalls. Will every stall get the same number with none left over?`,
      answer: { type: 'choice', value: yes ? 0 : 1, choices: ['Yes', 'No'] },
      hint: `Divide ${n} by ${k}. No remainder means yes: ${k} is a factor of ${n}.`,
      working: [`<b>Picture:</b> deal the pies out one at a time round the ${k} stalls until they run out.`, `${n} ÷ ${k} = ${yes ? n / k + ' exactly' : Math.floor(n / k) + ' remainder ' + (n % k)}.`, yes ? `<b>Yes</b> — each stall gets ${n / k} pies.` : `<b>No</b> — ${n % k} would be left over.`],
      finalAnswer: yes ? `Yes (${n / k} each)` : `No (${n % k} left over)`, skill: 'factors',
    };
  }

  /** LEVEL 3 — three numbers, a clock time, counting repeats, or explaining why */
  function wordL3() {
    const t = R.pick(['buses3', 'hcf3', 'shareReason', 'lcmPacks', 'lcmCount', 'primeFactor']);
    if (t === 'buses3') {
      const pool = [4, 6, 8, 9, 10, 12, 15, 20];
      let a, b, c, l;
      do { [a, b, c] = R.sample(pool, 3); l = N.lcm(N.lcm(a, b), c); } while (l < 40 || l > 180);
      const h = R.pick([7, 8]), m = R.pick([0, 10, 15, 20, 30, 45]);
      const startMin = h * 60 + m, endMin = startMin + l;
      const ans = clock(endMin);
      return {
        prompt: `Three buses leave the Hamilton depot together at ${clock(startMin)}. The red bus goes every ${a} minutes, the blue bus every ${b} minutes and the green bus every ${c} minutes. At what time do all three next leave together? Give the time like 9:35 am.`,
        answer: { type: 'text', value: ans, accept: [ans.replace(' am', ''), ans.replace(':', '.'), ans.replace(':', '.').replace(' am', ''), pad2(Math.floor(endMin / 60)) + ':' + pad2(endMin % 60)], placeholder: 'e.g. 9:35 am' },
        hint: `First find the lowest common multiple of ${a}, ${b} and ${c}. That is how many minutes until they meet. Then add it to the start time.`,
        working: [
          `<b>Picture:</b> three clocks ticking, and we want the first tick they all share.`,
          `1. LCM of ${a} and ${b}: ${N.lcm(a, b)}.`,
          `2. LCM of ${N.lcm(a, b)} and ${c}: <b>${l} minutes</b>.`,
          `3. Add ${l} minutes to ${clock(startMin)}: ${l >= 60 ? `${Math.floor(l / 60)} hour${Math.floor(l / 60) > 1 ? 's' : ''} ${l % 60} min` : `${l} min`} later.`,
          `They next leave together at <b>${ans}</b>.`,
        ],
        finalAnswer: ans, skill: 'lcm',
      };
    }
    if (t === 'hcf3') {
      const g = R.pick([4, 6, 8, 9, 12]);
      let x, y, z;
      do { [x, y, z] = R.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3); } while (N.gcd(N.gcd(x, y), z) !== 1);
      const a = g * x, b = g * y, c = g * z;
      return {
        prompt: `For the Matariki shared kai Harper has ${a} sausage rolls, ${b} mini pies and ${c} fruit skewers. She makes identical platters using everything, with nothing left over. What is the greatest number of platters she can make?`,
        answer: { type: 'number', value: g, unit: 'platters' },
        hint: `The number of platters must divide exactly into all three numbers. Find the highest common factor of ${a}, ${b} and ${c}.`,
        working: [
          `<b>Picture:</b> every platter must look exactly the same, so the number of platters has to divide all three amounts.`,
          `1. HCF of ${a} and ${b} first: ${N.gcd(a, b)}.`,
          `2. Now HCF of ${N.gcd(a, b)} and ${c}: <b>${g}</b>.`,
          `3. Check: ${a} ÷ ${g} = ${x}, ${b} ÷ ${g} = ${y}, ${c} ÷ ${g} = ${z}. All whole numbers ✓`,
          `She can make <b>${g} platters</b> (each with ${x} sausage rolls, ${y} pies and ${z} skewers).`,
        ],
        finalAnswer: `${g} platters`, skill: 'hcf',
      };
    }
    if (t === 'shareReason') {
      const k = R.pick([4, 6, 8, 9, 12]);
      const yes = R.chance(0.5);
      let n; do { n = R.int(90, 260); } while ((n % k === 0) !== yes);
      const right = yes ? `Yes — ${n} is in the ${k} times table` : `No — ${n} ÷ ${k} leaves a remainder`;
      const choices = R.shuffle([right, yes ? `No — ${k} does not go into ${n}` : `Yes — ${n} is bigger than ${k}`, `Yes — ${n} is an even number`, `No — ${k} is not a prime number`]);
      return {
        prompt: `Can ${n} hāngī plates be shared equally between ${k} whānau with none left over? Pick the answer <b>and</b> the correct reason.`,
        answer: { type: 'choice', value: choices.indexOf(right), choices },
        hint: `Do the division ${n} ÷ ${k} first. Then check which reason actually matches what you found.`,
        working: [
          `<b>Picture:</b> deal the plates out one at a time round the ${k} whānau.`,
          `1. ${n} ÷ ${k} = ${yes ? n / k + ' exactly' : Math.floor(n / k) + ' remainder ' + (n % k)}.`,
          `2. So the answer is <b>${yes ? 'yes' : 'no'}</b>.`,
          `3. The reason must be about ${k} being ${yes ? 'a factor of' : 'not a factor of'} ${n} — being even or prime does not decide it.`,
          `Answer: <b>${right}</b>.`,
        ],
        finalAnswer: right, skill: 'factors',
      };
    }
    if (t === 'lcmPacks') {
      const [a, b] = lcmPair(3);
      const l = N.lcm(a, b);
      return {
        prompt: `Paper plates come in packs of ${a} and paper cups come in packs of ${b}. Harper needs exactly the same number of each for the gala, with none spare. How many <b>packs of plates</b> must she buy?`,
        answer: { type: 'number', value: l / a, unit: 'packs' },
        hint: `First find the smallest number that is a multiple of both ${a} and ${b}. Then divide that by ${a} to get the packs.`,
        working: [
          `<b>Picture:</b> two number lines of packs, and we want the first place they line up.`,
          `1. The total must be a multiple of both ${a} and ${b}, so find the LCM.`,
        ].concat(lcmWorking(a, b, 3)).concat([
          `2. Now turn ${l} plates into packs: ${l} ÷ ${a} = <b>${l / a} packs</b>.`,
          `(She also needs ${l / b} packs of cups.)`,
        ]),
        finalAnswer: `${l / a} packs`, skill: 'lcm',
      };
    }
    if (t === 'lcmCount') {
      let a, b, l;
      do { [a, b] = lcmPair(2); l = N.lcm(a, b); } while (l < 12 || l > 90);
      const hours = R.pick([2, 3, 4]);
      const mins = hours * 60;
      const times = Math.floor(mins / l);
      return {
        prompt: `The ferry leaves every ${a} minutes and the shuttle bus leaves every ${b} minutes. They both leave at 9:00 am. How many more times do they leave together in the next ${hours} hours?`,
        answer: { type: 'number', value: times, unit: 'times' },
        hint: `They leave together every LCM(${a}, ${b}) minutes. Change ${hours} hours into minutes, then divide.`,
        working: [
          `<b>Picture:</b> the two timetables line up again and again, at equal gaps.`,
          `1. They meet every LCM of ${a} and ${b} minutes.`,
        ].concat(lcmWorking(a, b, 2)).concat([
          `2. ${hours} hours = ${hours} × 60 = ${mins} minutes.`,
          `3. ${mins} ÷ ${l} = ${N.fmt(N.round(mins / l, 2))}, so they meet <b>${times}</b> more time${times === 1 ? '' : 's'} (only whole meetings count).`,
        ]),
        finalAnswer: `${times} times`, skill: 'lcm',
      };
    }
    let n, pf;
    do { n = R.int(60, 400); pf = primeFac(n); } while (isPrime(n) || pf.length < 2 || pf[pf.length - 1][0] < 5 || pf[pf.length - 1][0] > 19);
    const big = pf[pf.length - 1][0];
    return {
      prompt: `The school hall has ${n} seats set out in equal rows. Harper writes ${n} as a product of prime numbers. What is the <b>largest prime factor</b> of ${n}?`,
      answer: { type: 'number', value: big },
      hint: `Keep dividing ${n} by the smallest prime that goes into it (2, then 3, then 5, then 7...) until you are left with a prime.`,
      working: [
        `<b>Picture:</b> a factor tree — keep splitting until every branch ends on a prime.`,
      ].concat(divisionLines(n)).concat([
        `So ${n} = ${facHtml(pf)}.`,
        `The largest prime in that list is <b>${big}</b>.`,
      ]),
      finalAnswer: String(big), skill: 'primes',
    };
  }

  function word(level) {
    return level === 1 ? wordL1() : level === 2 ? wordL2() : wordL3();
  }

  HL.registerTopic({
    id: 'factors-primes', subject: 'maths', strand: 'number', order: 4,
    name: 'Factors, multiples & primes', short: 'Factors & primes',
    blurb: 'Factors divide in exactly, multiples are the times tables, and primes have only two factors.',
    example: 'Factors of 12: 1, 2, 3, 4, 6, 12 &nbsp;·&nbsp; HCF(12, 18) = 6 &nbsp;·&nbsp; 60 = 2² × 3 × 5',
    animal: 'hedgehog',
    learn: {
      what: '<p>A <b>factor</b> of a number divides into it exactly (no remainder). A <b>multiple</b> of a number is in its times table. A <b>prime</b> number has exactly <b>two</b> factors: 1 and itself (2, 3, 5, 7, 11, 13 …). 1 is <b>not</b> prime.</p><p>The <b>HCF</b> (highest common factor) is the biggest number that divides into two numbers. The <b>LCM</b> (lowest common multiple) is the smallest number that is in both times tables.</p><p><b>Picture for this topic:</b> a packet of <b>biscuits shared onto plates</b>. A factor is a number of plates that shares the biscuits out with none left over.</p>',
      visual: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        <text x="95" y="24" text-anchor="middle" fill="#4A3B48">Factor rainbow: 24</text>
        ${[[3,4,'#E0568C'],[2,5,'#2A6FA5'],[1,6,'#2FA97A'],[0,7,'#4A3B48']].map(([i,j,c],k)=>{const x1=18+i*22,x2=18+j*22,h=40+k*40;return `<path d="M${x1} 160 Q${(x1+x2)/2} ${160-h} ${x2} 160" stroke="${c}" stroke-width="3" fill="none"/>`;}).join('')}
        ${[1,2,3,4,6,8,12,24].map((n,i)=>`<text x="${18+i*22}" y="180" text-anchor="middle" fill="${[0,7].includes(i)?'#4A3B48':[1,6].includes(i)?'#2FA97A':[2,5].includes(i)?'#2A6FA5':'#E0568C'}">${n}</text>`).join('')}
        <text x="95" y="204" text-anchor="middle" fill="#4A3B48" font-size="12">each pair × to 24</text>
        <text x="275" y="24" text-anchor="middle" fill="#4A3B48">Factor tree: 60</text>
        ${[[275,52,240,100],[275,52,310,100],[240,100,215,152],[240,100,262,152],[310,100,290,152],[310,100,337,152]].map(([a,b,c,d])=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#4A3B48" stroke-width="2"/>`).join('')}
        ${[[275,52,'60',false],[240,100,'6',false],[310,100,'10',false],[215,152,'2',true],[262,152,'3',true],[290,152,'2',true],[337,152,'5',true]].map(([x,y,n,p])=>`<circle cx="${x}" cy="${y}" r="16" fill="${p?'#A6E3B8':'#FFE98A'}" stroke="${p?'#2FA97A':'#4A3B48'}" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#4A3B48">${n}</text>`).join('')}
        <text x="275" y="192" text-anchor="middle" fill="#2FA97A" font-size="12">green = prime → stop</text>
        <text x="275" y="212" text-anchor="middle" fill="#4A3B48" font-size="13">60 = 2² × 3 × 5</text>
      </svg>`,
      facts: [
        '<b>Factor</b> = divides in exactly. Factors of 12: <b>1, 2, 3, 4, 6, 12</b>',
        '<b>Multiple</b> = in the times table. Multiples of 4: <b>4, 8, 12, 16 …</b>',
        '<b>Prime</b> = exactly two factors. <b>2, 3, 5, 7, 11, 13, 17, 19, 23</b> … (1 is not prime)',
        '<b>HCF</b> = biggest number in <b>both</b> factor lists',
        '<b>LCM</b> = smallest number in <b>both</b> times tables',
        'Prime factorisation: keep splitting until every branch is prime, e.g. <b>60 = 2² × 3 × 5</b>',
        '<b>Divisibility tests</b> — <b>2</b>: last digit is even. <b>5</b>: ends in 0 or 5. <b>10</b>: ends in 0. <b>4</b>: the <b>last two digits</b> make a multiple of 4',
        '<b>Digit-sum tests</b> — <b>3</b>: the digits <b>add</b> to a multiple of 3. <b>9</b>: the digits add to a multiple of 9. <b>6</b>: it passes the <b>2 test and the 3 test</b>',
        '<b>Square numbers</b>: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144 (n × n).<br><b>Triangular numbers</b>: 1, 3, 6, 10, 15, 21, 28, 36 (add 2, then 3, then 4 …)',
      ],
      steps: [
        '<b>Finding factors</b>: say "how many plates share it out evenly?" Work in pairs from the outside in. For 24: 1 × 24, 2 × 12, 3 × 8, 4 × 6. Stop when the pairs meet. Factors: 1, 2, 3, 4, 6, 8, 12, 24.',
        '<b>HCF</b>: say "list both, circle the ones in both lists, pick the <b>biggest</b>".',
        '<b>LCM</b>: say "count up in the <b>bigger</b> number\'s times table and stop at the first one the smaller number divides into".',
        '<b>Prime factorisation</b>: say "split it into two numbers that multiply, keep splitting until every branch is prime". Then write the answer with powers: 60 = 2² × 3 × 5.',
        '<b>Is it prime?</b> Say "does 2, 3, 5 or 7 divide in?" (and 11 for numbers over 120). If nothing divides exactly, it is prime.',
        '<b>Divisibility tests</b>: say the test out loud instead of dividing. For 3 and 9, <b>add the digits</b>. For 4, look at the <b>last two digits</b>. For 6, do the 2 test and the 3 test — it must pass <b>both</b>.',
      ],
      examples: [
        { q: 'List all the factors of 20',
          visual: `<svg viewBox="0 0 360 130" width="360" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="15" font-weight="700">
            ${[[2,3,'#E0568C'],[1,4,'#2A6FA5'],[0,5,'#2FA97A']].map(([i,j,c],k)=>{const x1=80+i*40,x2=80+j*40,h=36+k*34;return `<path d="M${x1} 86 Q${(x1+x2)/2} ${86-h} ${x2} 86" stroke="${c}" stroke-width="3" fill="none"/>`;}).join('')}
            ${[1,2,4,5,10,20].map((n,i)=>`<text x="${80+i*40}" y="108" text-anchor="middle" fill="${[0,5].includes(i)?'#2FA97A':[1,4].includes(i)?'#2A6FA5':'#E0568C'}">${n}</text>`).join('')}
            <text x="180" y="127" text-anchor="middle" fill="#4A3B48" font-size="12">1 × 20 &nbsp; 2 × 10 &nbsp; 4 × 5</text>
          </svg>`,
          working: ['<i>Picture:</i> 20 biscuits. How many plates can I use so every plate gets the same and none are left?', '1. 1 plate? <b>Yes</b> (20 each) → pair 1 × 20.', '2. 2 plates? <b>Yes</b> (10 each) → 2 × 10. &nbsp;3 plates? <b>No</b>, 20 ÷ 3 leaves 2 over.', '3. 4 plates? <b>Yes</b> (5 each) → 4 × 5. The pairs have met, so stop.', 'Factors: 1, 2, 4, 5, 10, 20'], a: '1, 2, 4, 5, 10, 20' },
        { q: 'Is 51 a prime number?', working: ['<i>Picture:</i> 51 biscuits. Prime means the <b>only</b> ways to share are 1 plate or 51 plates.', '1. Does 2 divide in? <b>No</b>, 51 is odd.', '2. Does 3 divide in? Digits 5 + 1 = 6, and 6 is in the 3 times table, so <b>yes</b>: 51 ÷ 3 = 17.', '3. So 51 = 3 × 17 — it has more than two factors.'], a: 'No, 51 is not prime (3 × 17)' },
        { q: 'HCF of 18 and 24',
          visual: `<svg viewBox="0 0 360 110" width="360" height="110" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="15" font-weight="700">
            ${[[18,[1,2,3,6,9,18],28],[24,[1,2,3,4,6,8,12,24],76]].map(([n,fs,y])=>`<text x="12" y="${y+5}" fill="#2A6FA5">${n}:</text>`+fs.map((f,i)=>{const x=64+i*38;const common=[1,2,3,6].includes(f);return `${common?`<circle cx="${x}" cy="${y}" r="15" fill="${f===6?'#E0568C':'#F9A8C9'}"/>`:''}<text x="${x}" y="${y+5}" text-anchor="middle" fill="${f===6?'#fff':'#4A3B48'}">${f}</text>`;}).join('')).join('')}
            <text x="180" y="105" text-anchor="middle" fill="#E0568C" font-size="13">in both lists: 1, 2, 3, 6 → biggest is 6</text>
          </svg>`,
          working: ['<i>Picture:</i> 18 biscuits and 24 biscuits. What is the <b>biggest</b> number of plates that shares both out evenly?', '1. Plates that work for 18: 1, 2, 3, 6, 9, 18.', '2. Plates that work for 24: 1, 2, 3, 4, 6, 8, 12, 24.', '3. Which numbers are in both lists? 1, 2, 3, 6. Which is biggest? <b>6</b>.'], a: '6' },
        { q: 'LCM of 6 and 8',
          visual: `<svg viewBox="0 0 360 110" width="360" height="110" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="15" font-weight="700">
            ${[[8,[8,16,24,32,40],28],[6,[6,12,18,24,30],76]].map(([n,ms,y])=>`<text x="12" y="${y+5}" fill="#2A6FA5">${n}s:</text>`+ms.map((m,i)=>{const x=74+i*48;return `${m===24?`<circle cx="${x}" cy="${y}" r="17" fill="#2FA97A"/>`:''}<text x="${x}" y="${y+5}" text-anchor="middle" fill="${m===24?'#fff':'#4A3B48'}">${m}</text>`;}).join('')).join('')}
            <text x="180" y="105" text-anchor="middle" fill="#2FA97A" font-size="13">first number in both times tables: 24</text>
          </svg>`,
          working: ['<i>Picture:</i> biscuits come in packs of 6 or packs of 8. What is the smallest number of biscuits I can make with either pack size?', '1. Count in the bigger table (8s): 8, 16, 24, 32 …', '2. Does 6 divide into 8? <b>No.</b> Into 16? <b>No.</b> Into 24? <b>Yes</b>, 24 ÷ 6 = 4.', '3. So 24 is the first number in both times tables.'], a: '24' },
        { q: 'Write 72 as a product of prime factors',
          visual: `<svg viewBox="0 0 360 215" width="360" height="215" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
            ${[[180,28,120,78],[180,28,240,78],[120,78,85,128],[120,78,155,128],[240,78,215,128],[240,78,265,128],[155,128,135,178],[155,128,175,178]].map(([a,b,c,d])=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#4A3B48" stroke-width="2"/>`).join('')}
            ${[[180,28,'72',false],[120,78,'8',false],[240,78,'9',false],[85,128,'2',true],[155,128,'4',false],[215,128,'3',true],[265,128,'3',true],[135,178,'2',true],[175,178,'2',true]].map(([x,y,n,p])=>`<circle cx="${x}" cy="${y}" r="16" fill="${p?'#A6E3B8':'#FFE98A'}" stroke="${p?'#2FA97A':'#4A3B48'}" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#4A3B48">${n}</text>`).join('')}
            <text x="180" y="210" text-anchor="middle" fill="#4A3B48" font-size="13">72 = 2 × 2 × 2 × 3 × 3 = 2³ × 3²</text>
          </svg>`,
          working: ['<i>Picture:</i> keep splitting the pile of 72 biscuits into two smaller piles that multiply, until every pile is a prime size.', '1. Can I split 72? <b>Yes</b>: 8 × 9.', '2. Is 8 prime? <b>No</b> → 2 × 4, and 4 → 2 × 2. Is 9 prime? <b>No</b> → 3 × 3.', '3. Are all the ends prime? <b>Yes</b>: 2, 2, 2, 3, 3. Count them: three 2s and two 3s.', '72 = 2 × 2 × 2 × 3 × 3 = 2³ × 3²'], a: '2³ × 3²' },
        { q: 'Is 4 725 divisible by 9?',
          visual: `<svg viewBox="0 0 360 126" width="360" height="126" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            <text x="175" y="18" text-anchor="middle" fill="#9A8A98">add the digits</text>
            ${[[100, '4'], [150, '7'], [200, '2'], [250, '5']].map(([x, d]) => `<text x="${x}" y="50" font-size="30" text-anchor="middle" fill="#4A3B48">${d}</text>`).join('')}
            ${[125, 175, 225].map((x) => `<text x="${x}" y="50" font-size="20" text-anchor="middle" fill="#E0568C">+</text>`).join('')}
            <line x1="84" y1="60" x2="266" y2="60" stroke="#4A3B48" stroke-width="2"/>
            <text x="175" y="90" font-size="26" text-anchor="middle" fill="#E0568C">18</text>
            <text x="180" y="116" text-anchor="middle" fill="#2FA97A">18 is in the 9 times table → 4725 divides by 9</text>
          </svg>`,
          working: ['<i>Picture:</i> instead of doing a big division, use the <b>digit-sum trick</b> for 9.', '1. Which test do I need? Divisible by <b>9</b> → add the digits.', '2. 4 + 7 + 2 + 5 = <b>18</b>.', '3. Is 18 a multiple of 9? <b>Yes</b> (18 ÷ 9 = 2).', 'So 4725 is divisible by 9 (4725 ÷ 9 = 525).'], a: 'Yes' },
        { q: 'Which of these is a <b>triangular</b> number: 20, 21, 22 or 24?',
          visual: `<svg viewBox="0 0 360 128" width="360" height="128" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
            ${[[40, 1], [120, 2], [210, 3], [310, 4]].map(([cx, k]) => {
              let dots = '';
              for (let r = 0; r < k; r++) for (let j = 0; j <= r; j++) dots += `<circle cx="${cx - r * 9 + j * 18}" cy="${20 + r * 18}" r="7" fill="#F9A8C9" stroke="#E0568C" stroke-width="2"/>`;
              return dots + `<text x="${cx}" y="102" text-anchor="middle" fill="#E0568C">${[1, 3, 6, 10][k - 1]}</text>`;
            }).join('')}
            <text x="180" y="124" text-anchor="middle" fill="#4A3B48" font-size="12">each row adds one more dot: +2, +3, +4 …</text>
          </svg>`,
          working: ['<i>Picture:</i> dots stacked in a triangle, like bowling pins. Each new row has one more dot than the row above.', '1. Build the list: 1, then +2 → 3, then +3 → 6, then +4 → 10, +5 → 15, +6 → <b>21</b>, +7 → 28.', '2. Which of 20, 21, 22, 24 is in my list? <b>21</b>.', '3. Check: 21 dots make a triangle with rows of 1, 2, 3, 4, 5, 6.'], a: '21' },
        { q: 'At the Hamilton bus station, the Cambridge bus leaves every 12 minutes and the Te Awamutu bus leaves every 20 minutes. Both leave at 9:00 am. When do they next leave together?', working: ['<i>Picture:</i> two times tables counting up in minutes — 12, 24, 36 … and 20, 40, 60 … Where do they first meet?', '1. "Next time together" means the <b>LCM</b> (smallest number in both tables).', '2. Count in 20s (the bigger one): 20, 40, 60. Does 12 divide into 20? <b>No.</b> Into 40? <b>No.</b> Into 60? <b>Yes</b>, 60 ÷ 12 = 5.', '3. LCM = 60 minutes = 1 hour after 9:00 am.'], a: '10:00 am' },
      ],
      tips: [
        'Word problems: "every … minutes, when together again?" or "smallest number of packs" → <b>LCM</b>. "Largest equal groups / biggest tile / longest piece" → <b>HCF</b>.',
        '2 is the only even prime. Odd numbers ending in 5 are never prime (except 5). 91 = 7 × 13 and 51 = 3 × 17 look prime but are not.',
        'Every number has at least two factors (1 and itself). A square number has an <b>odd</b> number of factors.',
        'Quick tests: a number is divisible by 3 if its <b>digits add</b> to a multiple of 3, by 5 if it ends in 0 or 5, by 2 if it is even.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
