/* Topic: Solving equations (one-step, two-step, brackets, unknown on both sides) */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const f = N.fmt;
  const fracH = (top, bot) => `<span class="frac"><span class="frac-n">${top}</span><span class="frac-d">${bot}</span></span>`;
  const VARS = ['x', 'x', 'x', 'n', 'y', 'a', 'm'];
  const coef = (k, v) => (k === 1 ? v : k === -1 ? '−' + v : `${f(k)}${v}`);
  /** "ax + b" with signs tidy */
  const lin = (a, b, v) => (b === 0 ? coef(a, v) : a === 0 ? f(b) : `${coef(a, v)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`);
  const wrap = (x) => (x < 0 ? `(${f(x)})` : f(x));

  const answerOf = (v, x) => ({ type: 'number', value: x, placeholder: `${v} = ?` });
  const make = (eq, v, x, hint, working) => ({
    prompt: `Solve for ${v}: <b>${eq}</b>`,
    answer: answerOf(v, x),
    hint,
    working,
    finalAnswer: `${v} = ${f(x)}`,
  });

  /* ---------- level 1: one-step ---------- */
  function oneStep(v, x, opts = {}) {
    const t = R.pick(['add', 'add', 'sub', 'mul', 'mul', 'div', 'addRev']);
    if (t === 'add' || t === 'addRev') {
      const b = R.int(1, opts.big ? 30 : 12), c = x + b;
      const eq = t === 'add' ? `${v} + ${b} = ${f(c)}` : `${b} + ${v} = ${f(c)}`;
      return Object.assign(make(eq, v, x, `To undo "+ ${b}", subtract ${b} from both sides.`, [
        `Subtract ${b} from both sides: ${v} = ${f(c)} − ${b}.`,
        `<b>${v} = ${f(x)}</b>`,
      ]), { skill: 'one-step' });
    }
    if (t === 'sub') {
      const b = R.int(1, opts.big ? 30 : 12), c = x - b;
      return Object.assign(make(`${v} − ${b} = ${f(c)}`, v, x, `To undo "− ${b}", add ${b} to both sides.`, [
        `Add ${b} to both sides: ${v} = ${f(c)} + ${b}.`,
        `<b>${v} = ${f(x)}</b>`,
      ]), { skill: 'one-step' });
    }
    if (t === 'mul') {
      const a = R.int(2, opts.big ? 12 : 9), c = a * x;
      return Object.assign(make(`${a}${v} = ${f(c)}`, v, x, `${a}${v} means ${a} × ${v}. To undo "× ${a}", divide both sides by ${a}.`, [
        `Divide both sides by ${a}: ${v} = ${f(c)} ÷ ${a}.`,
        `<b>${v} = ${f(x)}</b>`,
      ]), { skill: 'one-step' });
    }
    const a = R.int(2, opts.big ? 10 : 6), c = x;
    const xx = a * c; // the unknown is a multiple so the division is exact
    const eq = R.chance(0.5) ? `${v} ÷ ${a} = ${f(c)}` : `${fracH(v, a)} = ${f(c)}`;
    return Object.assign(make(eq, v, xx, `To undo "÷ ${a}", multiply both sides by ${a}.`, [
      `Multiply both sides by ${a}: ${v} = ${f(c)} × ${a}.`,
      `<b>${v} = ${f(xx)}</b>`,
    ]), { skill: 'one-step' });
  }

  /* ---------- level 2: two-step and brackets ---------- */
  function twoStep(v, x) {
    let t = R.pick(['axb', 'axb', 'axb', 'divb', 'bracket', 'bracket', 'bminus']);
    if (t === 'bminus' && x <= 0) t = 'axb';   // keep "b − x = c" with a positive x so the numbers stay friendly
    if (t === 'axb') {
      const a = R.int(2, 9), b = R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15);
      const c = a * x + b;
      const undo = b < 0 ? `add ${Math.abs(b)} to` : `subtract ${b} from`;
      return Object.assign(make(`${lin(a, b, v)} = ${f(c)}`, v, x, `Undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}" first (${undo} both sides), then divide by ${a}.`, [
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}${v} = ${f(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${f(a * x)}.`,
        `Divide both sides by ${a}: ${v} = ${f(a * x)} ÷ ${a}.`,
        `<b>${v} = ${f(x)}</b>`,
      ]), { skill: 'two-step' });
    }
    if (t === 'divb') {
      const a = R.int(2, 6), b = R.chance(0.6) ? R.int(1, 12) : -R.int(1, 12);
      const xx = a * x, c = x + b;
      return Object.assign(make(`${fracH(v, a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(c)}`, v, xx, `First ${b < 0 ? 'add ' + Math.abs(b) + ' to' : 'subtract ' + b + ' from'} both sides, then multiply by ${a}.`, [
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${fracH(v, a)} = ${f(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${f(x)}.`,
        `Multiply both sides by ${a}: ${v} = ${f(x)} × ${a}.`,
        `<b>${v} = ${f(xx)}</b>`,
      ]), { skill: 'two-step' });
    }
    if (t === 'bminus') {
      const b = R.int(x + 1, x + 20), c = b - x;
      return Object.assign(make(`${b} − ${v} = ${f(c)}`, v, x, `${v} is being taken away from ${b}. Add ${v} to both sides, then get ${v} on its own.`, [
        `Add ${v} to both sides: ${b} = ${f(c)} + ${v}.`,
        `Subtract ${f(c)} from both sides: ${b} − ${f(c)} = ${v}.`,
        `<b>${v} = ${f(x)}</b>`,
      ]), { skill: 'two-step' });
    }
    const a = R.int(2, 7), b = R.chance(0.6) ? R.int(1, 9) : -R.int(1, 9);
    const c = a * (x + b);
    const inner = x + b;
    return Object.assign(make(`${a}(${lin(1, b, v)}) = ${f(c)}`, v, x, `Divide both sides by ${a} first to remove the bracket, then undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}".`, [
      `Divide both sides by ${a}: ${lin(1, b, v)} = ${f(c)} ÷ ${a} = ${f(inner)}.`,
      `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${v} = ${f(inner)} ${b < 0 ? '+' : '−'} ${Math.abs(b)}.`,
      `<b>${v} = ${f(x)}</b>`,
    ]), { skill: 'brackets' });
  }

  /* ---------- level 3: both sides, fractions, decimal / negative solutions ---------- */
  function hard(v, x) {
    const t = R.pick(['both', 'both', 'both', 'bothNeg', 'fracEq', 'twoBrackets', 'decimal']);
    if (t === 'decimal') {
      // solution is a half or quarter: a x + b = c with a even
      const xd = R.pick([0.5, 1.5, 2.5, 3.5, 4.5, -0.5, -1.5, -2.5, 0.25, 0.75, 1.25]);
      const a = Number.isInteger(xd * 2) ? R.pick([2, 4, 6, 8]) : R.pick([4, 8]);
      const b = R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15);
      const c = a * xd + b;
      return Object.assign(make(`${lin(a, b, v)} = ${f(c)}`, v, xd, `Undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}" first, then divide by ${a}. The answer is a decimal.`, [
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}${v} = ${f(a * xd)}.`,
        `Divide both sides by ${a}: ${v} = ${f(a * xd)} ÷ ${a}.`,
        `<b>${v} = ${f(xd)}</b>`,
      ]), { skill: 'both-sides' });
    }
    if (t === 'fracEq') {
      // (x + b) / a = c
      const a = R.int(2, 6), b = R.chance(0.6) ? R.int(1, 12) : -R.int(1, 12);
      const c = R.nz(8), xx = a * c - b;
      return Object.assign(make(`${fracH(`${v} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, a)} = ${f(c)}`, v, xx, `The whole top is divided by ${a}. Multiply both sides by ${a} first.`, [
        `Multiply both sides by ${a}: ${lin(1, b, v)} = ${f(c)} × ${a} = ${f(a * c)}.`,
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${v} = ${f(a * c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)}.`,
        `<b>${v} = ${f(xx)}</b>`,
      ]), { skill: 'fractions' });
    }
    if (t === 'twoBrackets') {
      // a(x + b) = c(x + d), a > c
      const a = R.int(3, 6), c = R.int(1, a - 1), b = R.chance(0.6) ? R.int(1, 8) : -R.int(1, 8);
      // a x + a b = c x + c d → (a − c) x = c d − a b → d = ((a − c) x + a b) / c must be an integer
      const dNum = (a - c) * x + a * b;
      if (dNum % c !== 0) return hard(v, x);
      const d = dNum / c;
      const right = c === 1 ? `${lin(1, d, v)}` : `${c}(${lin(1, d, v)})`;
      return Object.assign(make(`${a}(${lin(1, b, v)}) = ${right}`, v, x, `Expand both brackets first. Then collect the ${v} terms on one side and the numbers on the other.`, [
        `Expand: ${lin(a, a * b, v)} = ${lin(c, c * d, v)}.`,
        `Subtract ${coef(c, v)} from both sides: ${lin(a - c, a * b, v)} = ${f(c * d)}.`,
        `${a * b < 0 ? 'Add ' + Math.abs(a * b) + ' to' : 'Subtract ' + a * b + ' from'} both sides: ${coef(a - c, v)} = ${f(c * d - a * b)}.`,
        a - c === 1 ? `<b>${v} = ${f(x)}</b>` : `Divide both sides by ${a - c}: <b>${v} = ${f(x)}</b>`,
      ]), { skill: 'both-sides' });
    }
    // unknown on both sides: a x + b = c x + d with a > c
    const a = R.int(3, 9), c = R.int(1, a - 1);
    const b = t === 'bothNeg' ? -R.int(1, 15) : R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15);
    const d = (a - c) * x + b;
    const step1 = lin(a - c, b, v);
    return Object.assign(make(`${lin(a, b, v)} = ${lin(c, d, v)}`, v, x, `Get all the ${v} terms on one side: subtract ${coef(c, v)} from both sides. Then solve the two-step equation.`, [
      `Subtract ${coef(c, v)} from both sides: ${step1} = ${f(d)}.`,
      `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${coef(a - c, v)} = ${f(d - b)}.`,
      a - c === 1 ? `<b>${v} = ${f(x)}</b>` : `Divide both sides by ${a - c}: ${v} = ${f(d - b)} ÷ ${a - c} = <b>${f(x)}</b>.`,
    ]), { skill: 'both-sides' });
  }

  /* ---------- checking a solution by substituting it back ---------- */
  function checkSolution(level, v) {
    const x = level === 1 ? R.int(1, 10) : level === 2 ? R.int(2, 12) : (R.chance(0.6) ? R.int(2, 15) : -R.int(1, 9));
    const a = level === 1 ? R.pick([1, 1, 2, 3]) : level === 2 ? R.int(2, 6) : R.int(2, 9);
    const b = level === 1 ? R.int(1, 10) : (R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15));
    const c = a * x + b;
    const isRight = R.chance(0.5);
    const guess = isRight ? x : x + R.pick([1, -1, 2, -2, 3, -3]);
    const lhs = a * guess + b;
    const sub = `${a === 1 ? '' : a + ' × '}${wrap(guess)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
    return {
      prompt: `Is ${v} = ${f(guess)} the solution of <b>${lin(a, b, v)} = ${f(c)}</b>? Check by putting it back in.`,
      answer: { type: 'choice', value: isRight ? 0 : 1, choices: ['Yes — it works', 'No — it does not work'] },
      hint: `Swap ${v} for ${f(guess)} on the left side and work it out. Does it come to ${f(c)}?`,
      working: [
        `Put ${v} = ${f(guess)} into the left side: ${sub}.`,
        a === 1 ? `Left side = ${f(lhs)}.` : `${a} × ${wrap(guess)} = ${f(a * guess)}, then ${f(a * guess)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(lhs)}.`,
        `Right side is ${f(c)}. So ${f(lhs)} ${isRight ? '=' : 'is not equal to'} ${f(c)}.`,
        isRight ? `Both sides match, so ${v} = ${f(guess)} <b>is</b> the solution.` : `The sides do not match, so ${v} = ${f(guess)} is <b>not</b> the solution. (The real solution is ${v} = ${f(x)}.)`,
      ],
      finalAnswer: isRight ? 'Yes — it works' : 'No — it does not work',
      skill: 'check-solution',
    };
  }

  function whichSolution(level, v) {
    const x = level === 1 ? R.int(2, 10) : level === 2 ? R.int(2, 12) : (R.chance(0.6) ? R.int(2, 15) : -R.int(1, 9));
    const a = level === 1 ? R.pick([1, 2, 3]) : R.int(2, 7);
    const b = level === 1 ? R.int(1, 10) : (R.chance(0.6) ? R.int(1, 18) : -R.int(1, 18));
    const c = a * x + b;
    const offs = R.sample([1, -1, 2, -2, 3, -3, 4], 2);
    const opts = R.shuffle([x, x + offs[0], x + offs[1]]);
    const choices = opts.map((n) => `${v} = ${f(n)}`);
    const other = opts.filter((n) => n !== x)[0];
    return {
      prompt: `Which of these is the solution of <b>${lin(a, b, v)} = ${f(c)}</b>?`,
      answer: { type: 'choice', value: opts.indexOf(x), choices },
      hint: `Try each one: put it in place of ${v} and see which makes the left side equal ${f(c)}.`,
      working: [
        `Try ${v} = ${f(other)}: ${a === 1 ? '' : a + ' × '}${wrap(other)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(a * other + b)}. That is not ${f(c)}. ✗`,
        `Try ${v} = ${f(x)}: ${a === 1 ? '' : a + ' × '}${wrap(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(c)}. That matches! ✓`,
        `The solution is <b>${v} = ${f(x)}</b>.`,
      ],
      finalAnswer: `${v} = ${f(x)}`,
      skill: 'check-solution',
    };
  }

  /* ---------- inequalities ---------- */
  const SHOW = { '>': '&gt;', '<': '&lt;', '≥': '≥', '≤': '≤' };
  const FLIP = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
  const SWAP = { '>': '≥', '≥': '>', '<': '≤', '≤': '<' };
  const symWord = { '>': 'greater than', '<': 'less than', '≥': 'greater than or equal to', '≤': 'less than or equal to' };
  const isClosed = (sym) => sym === '≥' || sym === '≤';
  const isRightWay = (sym) => sym === '>' || sym === '≥';
  const ineqText = (v, sym, n) => `${v} ${SHOW[sym]} ${f(n)}`;

  /** a number line from lo to hi with a circle at n and an arrow: open ○ for < >, filled ● for ≤ ≥ */
  function numberLine(n, sym, lo, hi) {
    const W = 320, H = 78, m = 26, stepPx = (W - 2 * m) / (hi - lo);
    const X = (t) => m + (t - lo) * stepPx;
    const right = isRightWay(sym), closed = isClosed(sym);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="number line" style="max-width:100%;height:auto">`;
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="#FFFDF8" rx="8"/>`;
    s += `<line x1="12" y1="40" x2="308" y2="40" stroke="#4A3B48" stroke-width="2"/>`;
    s += `<polygon points="316,40 304,34 304,46" fill="#4A3B48"/><polygon points="4,40 16,34 16,46" fill="#4A3B48"/>`;
    for (let t = lo; t <= hi; t++) {
      s += `<line x1="${X(t)}" y1="34" x2="${X(t)}" y2="46" stroke="#4A3B48" stroke-width="2"/>`;
      s += `<text x="${X(t)}" y="67" text-anchor="middle" font-size="14" font-weight="700" fill="#4A3B48" font-family="sans-serif">${f(t)}</text>`;
    }
    const tip = right ? 300 : 20;
    s += `<line x1="${X(n)}" y1="18" x2="${tip}" y2="18" stroke="#E0568C" stroke-width="4" stroke-linecap="round"/>`;
    s += `<polygon points="${tip + (right ? 10 : -10)},18 ${tip},11 ${tip},25" fill="#E0568C"/>`;
    s += `<circle cx="${X(n)}" cy="18" r="7.5" fill="${closed ? '#E0568C' : '#FFFDF8'}" stroke="#E0568C" stroke-width="3"/>`;
    return s + '</svg>';
  }

  function ineqChoices(v, sym, n, alt) {
    const right = ineqText(v, sym, n);
    const wrongs = [];
    const cands = [ineqText(v, FLIP[sym], n), ineqText(v, SWAP[sym], n)];
    if (alt != null && alt !== n) cands.push(ineqText(v, sym, alt), ineqText(v, FLIP[sym], alt));
    cands.push(ineqText(v, sym, n + 1), ineqText(v, FLIP[sym], n - 1), ineqText(v, sym, n - 1), ineqText(v, FLIP[sym], n + 1));
    for (const c of cands) { if (c !== right && wrongs.indexOf(c) < 0) wrongs.push(c); if (wrongs.length === 3) break; }
    const opts = R.shuffle([right, ...wrongs]);
    return { choices: opts, value: opts.indexOf(right) };
  }

  const signStays = (what) => `We only ${what}, so the sign stays the same way round.`;

  function ineqSolve(level, v) {
    const sym = R.pick(['>', '<', '≥', '≤']);
    const ans = (n, alt, eq, hint, working) => {
      const ch = ineqChoices(v, sym, n, alt);
      return {
        prompt: `Solve the inequality: <b>${eq}</b>`,
        answer: { type: 'choice', value: ch.value, choices: ch.choices },
        hint,
        working: working.concat([`So <b>${ineqText(v, sym, n)}</b> — ${v} is ${symWord[sym]} ${f(n)}.`]),
        finalAnswer: ineqText(v, sym, n),
        skill: 'inequality',
      };
    };
    if (level === 1) {
      const t = R.pick(['add', 'add', 'sub', 'mul', 'mul']);
      const x = R.int(2, 12);
      if (t === 'mul') {
        const a = R.int(2, 6), c = a * x;
        return ans(x, c, `${a}${v} ${SHOW[sym]} ${f(c)}`,
          `Solve it just like an equation. ${a}${v} means ${a} × ${v}, so divide both sides by ${a}.`,
          [`Divide both sides by ${a}: ${v} ${SHOW[sym]} ${f(c)} ÷ ${a} = ${f(x)}.`, signStays('divided by a positive number')]);
      }
      const b = R.int(1, 12), add = t === 'add', c = add ? x + b : x - b;
      return ans(x, c, `${v} ${add ? '+' : '−'} ${b} ${SHOW[sym]} ${f(c)}`,
        `Solve it just like an equation: to undo "${add ? '+' : '−'} ${b}", ${add ? 'subtract' : 'add'} ${b} on both sides.`,
        [`${add ? 'Subtract' : 'Add'} ${b} ${add ? 'from' : 'to'} both sides: ${v} ${SHOW[sym]} ${f(c)} ${add ? '−' : '+'} ${b} = ${f(x)}.`, signStays(add ? 'subtracted a number' : 'added a number')]);
    }
    if (level === 2) {
      const a = R.int(2, 8), x = R.int(1, 12), b = R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15), c = a * x + b;
      return ans(x, a * x, `${lin(a, b, v)} ${SHOW[sym]} ${f(c)}`,
        `Two steps, same as an equation: undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}" first, then divide by ${a}.`,
        [
          `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}${v} ${SHOW[sym]} ${f(a * x)}.`,
          `Divide both sides by ${a}: ${v} ${SHOW[sym]} ${f(a * x)} ÷ ${a} = ${f(x)}.`,
          signStays('added, subtracted and divided by positive numbers'),
        ]);
    }
    const t = R.pick(['two', 'two', 'divide', 'bracket']);
    if (t === 'divide') {
      const a = R.int(2, 5), x = a * R.int(2, 8), b = R.chance(0.5) ? R.int(1, 12) : -R.int(1, 12), c = x / a + b;
      return ans(x, x / a, `${fracH(v, a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} ${SHOW[sym]} ${f(c)}`,
        `First ${b < 0 ? 'add ' + Math.abs(b) + ' to' : 'subtract ' + b + ' from'} both sides, then multiply both sides by ${a}.`,
        [
          `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${fracH(v, a)} ${SHOW[sym]} ${f(x / a)}.`,
          `Multiply both sides by ${a}: ${v} ${SHOW[sym]} ${f(x / a)} × ${a} = ${f(x)}.`,
          signStays('used + − and × with positive numbers'),
        ]);
    }
    if (t === 'bracket') {
      const a = R.int(2, 5), x = R.int(1, 10), b = R.chance(0.6) ? R.int(1, 8) : -R.int(1, 8), c = a * (x + b);
      return ans(x, x + b, `${a}(${lin(1, b, v)}) ${SHOW[sym]} ${f(c)}`,
        `Divide both sides by ${a} first to get rid of the bracket, then undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}".`,
        [
          `Divide both sides by ${a}: ${lin(1, b, v)} ${SHOW[sym]} ${f(c)} ÷ ${a} = ${f(x + b)}.`,
          `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${v} ${SHOW[sym]} ${f(x)}.`,
          signStays('divided by a positive number then added or subtracted'),
        ]);
    }
    const a = R.int(2, 9), x = R.chance(0.5) ? -R.int(1, 8) : R.int(2, 14), b = R.chance(0.5) ? R.int(1, 20) : -R.int(1, 20), c = a * x + b;
    return ans(x, a * x, `${lin(a, b, v)} ${SHOW[sym]} ${f(c)}`,
      `Undo the "${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}" first, then divide by ${a}. The answer can be negative.`,
      [
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}${v} ${SHOW[sym]} ${f(a * x)}.`,
        `Divide both sides by ${a}: ${v} ${SHOW[sym]} ${f(x)}.`,
        signStays('added, subtracted and divided by positive numbers'),
      ]);
  }

  /** "what is the largest / smallest whole number x can be?" — tests open vs closed */
  function ineqValue(level, v) {
    const sym = R.pick(['>', '<', '≥', '≤']);
    const a = level === 2 ? R.int(2, 6) : R.int(2, 9);
    const x = R.int(3, 12);
    const b = level === 2 ? R.int(1, 12) : (R.chance(0.5) ? R.int(1, 20) : -R.int(1, 12));
    const c = a * x + b;
    const small = isRightWay(sym);
    const closed = isClosed(sym);
    const value = closed ? x : (small ? x + 1 : x - 1);
    return {
      prompt: `Solve <b>${lin(a, b, v)} ${SHOW[sym]} ${f(c)}</b>. What is the ${small ? 'smallest' : 'largest'} whole number ${v} can be?`,
      answer: { type: 'number', value },
      hint: `Solve it first. Then ask: is ${f(x)} itself allowed? "${symWord[sym]}" ${closed ? 'includes' : 'does not include'} ${f(x)}.`,
      working: [
        `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}${v} ${SHOW[sym]} ${f(a * x)}.`,
        `Divide both sides by ${a}: ${ineqText(v, sym, x)}.`,
        closed ? `The circle would be filled ●, so ${f(x)} <b>is</b> allowed.` : `The circle would be open ○, so ${f(x)} is <b>not</b> allowed — the next whole number ${small ? 'up' : 'down'} is ${f(value)}.`,
        `${small ? 'Smallest' : 'Largest'} whole number: <b>${f(value)}</b>`,
      ],
      finalAnswer: f(value),
      skill: 'inequality',
    };
  }

  /** read an inequality off a number line */
  function ineqLine(level, v) {
    const sym = R.pick(['>', '<', '≥', '≤']);
    const n = level === 1 ? R.int(1, 6) : R.int(-4, 7);
    const closed = isClosed(sym), right = isRightWay(sym);
    const ch = ineqChoices(v, sym, n);
    return {
      visual: numberLine(n, sym, n - 4, n + 4),
      prompt: `Which inequality does this number line show?`,
      answer: { type: 'choice', value: ch.value, choices: ch.choices },
      hint: 'Look at the circle first: <b>open ○</b> means that number is <b>not</b> included (&gt; or &lt;), <b>filled ●</b> means it <b>is</b> included (≥ or ≤). Then follow the arrow.',
      working: [
        `The circle is at ${f(n)}.`,
        closed ? `It is <b>filled ●</b>, so ${f(n)} <b>is</b> included → the sign is ≥ or ≤.` : `It is <b>open ○</b>, so ${f(n)} is <b>not</b> included → the sign is &gt; or &lt;.`,
        right ? `The arrow points <b>right</b>, towards the bigger numbers → ${SHOW[sym]}.` : `The arrow points <b>left</b>, towards the smaller numbers → ${SHOW[sym]}.`,
        `The inequality is <b>${ineqText(v, sym, n)}</b>.`,
      ],
      finalAnswer: ineqText(v, sym, n),
      skill: 'inequality',
    };
  }

  /** given an inequality, choose the number line that shows it */
  function ineqDescribe(level, v) {
    const sym = R.pick(['>', '<', '≥', '≤']);
    const n = level === 1 ? R.int(1, 8) : R.int(-5, 8);
    const closed = isClosed(sym), right = isRightWay(sym);
    const opt = (cl, rt) => `${cl ? 'Filled ● circle' : 'Open ○ circle'} at ${f(n)}, arrow pointing ${rt ? 'right' : 'left'}`;
    const correct = opt(closed, right);
    const opts = R.shuffle([opt(true, true), opt(true, false), opt(false, true), opt(false, false)]);
    return {
      prompt: `You are drawing <b>${ineqText(v, sym, n)}</b> on a number line. Which picture is right?`,
      answer: { type: 'choice', value: opts.indexOf(correct), choices: opts },
      hint: '"or equal to" (≥ ≤) means the number is included, so the circle is <b>filled ●</b>. Plain &gt; or &lt; means it is not included, so the circle is <b>open ○</b>.',
      working: [
        `The sign is ${SHOW[sym]}, which means "${symWord[sym]}".`,
        closed ? `"or equal to" → ${f(n)} <b>is</b> included → <b>filled ●</b> circle.` : `No "or equal to" → ${f(n)} is <b>not</b> included → <b>open ○</b> circle.`,
        right ? `${symWord[sym]} ${f(n)} means all the <b>bigger</b> numbers → arrow to the <b>right</b>.` : `${symWord[sym]} ${f(n)} means all the <b>smaller</b> numbers → arrow to the <b>left</b>.`,
        `So: <b>${correct}</b>.`,
      ],
      finalAnswer: correct,
      skill: 'inequality',
    };
  }

  function inequality(level, v) {
    const t = level === 1 ? R.pick(['solve', 'solve', 'line', 'line', 'describe'])
      : R.pick(['solve', 'solve', 'line', 'line', 'describe', 'value']);
    if (t === 'line') return ineqLine(level, v);
    if (t === 'describe') return ineqDescribe(level, v);
    if (t === 'value') return ineqValue(level, v);
    return ineqSolve(level, v);
  }

  /* ---------- form an equation from a word problem, then solve it ---------- */
  function formQ(s) {
    if (R.chance(0.5)) {
      const choices = R.shuffle([s.eq, ...s.wrongs]);
      return {
        prompt: `${s.story}<br>Which equation matches this problem?`,
        answer: { type: 'choice', value: choices.indexOf(s.eq), choices },
        hint: `Name the unknown first: let ${s.v} = ${s.what}. Then turn the words into maths, in the order they happen.`,
        working: [`Let ${s.v} = ${s.what}.`, ...s.build, `Equation: <b>${s.eq}</b>`],
        finalAnswer: s.eq,
        skill: 'form-equation',
      };
    }
    return {
      prompt: `${s.story}<br>${s.ask}`,
      answer: { type: 'number', value: s.x, unit: s.unit },
      hint: `Let ${s.v} = ${s.what}. That gives the equation ${s.eq}. Now solve it.`,
      working: [`Let ${s.v} = ${s.what}.`, ...s.build, `Equation: ${s.eq}.`, ...s.solve, `<b>${s.v} = ${f(s.x)}</b>`],
      finalAnswer: s.final || f(s.x),
      skill: 'form-equation',
    };
  }

  function formEquation(level) {
    const who = R.pick(['Harper', 'Mia', 'Aroha', 'Tane', 'Liam']);
    if (level === 1) {
      const t = R.pick(['more', 'left', 'each', 'shared']);
      if (t === 'more') {
        const x = R.int(5, 25), more = R.int(3, 12), thing = R.pick(['stickers', 'marbles', 'shells', 'trading cards']);
        return formQ({
          story: `${who} had some ${thing}. She was given ${more} more, and now she has ${x + more}.`,
          v: 's', what: `the number of ${thing} she started with`,
          eq: `s + ${more} = ${x + more}`,
          wrongs: [`s − ${more} = ${x + more}`, `${more}s = ${x + more}`, `s + ${x + more} = ${more}`],
          build: [`She started with s, then ${more} more were added: s + ${more}.`, `That comes to ${x + more}.`],
          ask: `How many ${thing} did she start with?`, x, unit: thing,
          solve: [`Subtract ${more} from both sides: s = ${x + more} − ${more}.`],
          final: `${x} ${thing}`,
        });
      }
      if (t === 'left') {
        const x = R.int(8, 30), ate = R.int(3, 7), food = R.pick(['muffins', 'sushi rolls', 'feijoas', 'biscuits']);
        return formQ({
          story: `A box held some ${food}. ${ate} were eaten, and ${x - ate} are left.`,
          v: 'b', what: `the number of ${food} in the box at the start`,
          eq: `b − ${ate} = ${x - ate}`,
          wrongs: [`b + ${ate} = ${x - ate}`, `${ate} − b = ${x - ate}`, `${ate}b = ${x - ate}`],
          build: [`Start with b, then ${ate} were taken away: b − ${ate}.`, `That leaves ${x - ate}.`],
          ask: `How many ${food} were in the box at the start?`, x, unit: food,
          solve: [`Add ${ate} to both sides: b = ${x - ate} + ${ate}.`],
          final: `${x} ${food}`,
        });
      }
      if (t === 'each') {
        const n = R.int(3, 8), price = R.int(2, 9), thing = R.pick(['movie tickets', 'pies', 'smoothies', 'ice creams']);
        return formQ({
          story: `${n} ${thing} cost $${n * price} altogether. They all cost the same, $t each.`,
          v: 't', what: `the cost of one of the ${thing} in dollars`,
          eq: `${n}t = ${n * price}`,
          wrongs: [`t + ${n} = ${n * price}`, `t − ${n} = ${n * price}`, `${n} + t = ${n * price}`],
          build: [`${n} ${thing} at $t each: ${n} × t = ${n}t.`, `That comes to $${n * price}.`],
          ask: `How much does one cost?`, x: price, unit: '$',
          solve: [`Divide both sides by ${n}: t = ${n * price} ÷ ${n}.`],
          final: `$${price}`,
        });
      }
      const groups = R.int(3, 8), each = R.int(3, 9);
      return formQ({
        story: `${groups * each} students are put into ${groups} equal teams for a netball tournament.`,
        v: 'p', what: 'the number of players in one team',
        eq: `${groups}p = ${groups * each}`,
        wrongs: [`p + ${groups} = ${groups * each}`, `p − ${groups} = ${groups * each}`, `${groups * each}p = ${groups}`],
        build: [`${groups} teams with p players in each: ${groups} × p = ${groups}p.`, `Altogether that is ${groups * each} students.`],
        ask: `How many players are in each team?`, x: each, unit: 'players',
        solve: [`Divide both sides by ${groups}: p = ${groups * each} ÷ ${groups}.`],
        final: `${each} players`,
      });
    }
    if (level === 2) {
      const t = R.pick(['pens', 'tries', 'tank', 'save']);
      if (t === 'pens') {
        const n = R.int(3, 6), price = R.int(2, 8), book = R.int(3, 9), total = n * price + book;
        return formQ({
          story: `A pen costs $p. ${who} buys ${n} pens and a $${book} notebook, and spends $${total} in total.`,
          v: 'p', what: 'the cost of one pen in dollars',
          eq: `${n}p + ${book} = ${total}`,
          wrongs: [`${n}(p + ${book}) = ${total}`, `${n}p − ${book} = ${total}`, `p + ${n + book} = ${total}`],
          build: [`${n} pens at $p each: ${n}p.`, `Add the $${book} notebook: ${n}p + ${book}.`, `The total is $${total}.`],
          ask: `How much does one pen cost?`, x: price, unit: '$',
          solve: [`Subtract ${book} from both sides: ${n}p = ${total - book}.`, `Divide both sides by ${n}: p = ${total - book} ÷ ${n}.`],
          final: `$${price}`,
        });
      }
      if (t === 'tries') {
        const tries = R.int(2, 7), conv = R.int(2, 8), total = 5 * tries + conv;
        return formQ({
          story: `A rugby team scores t tries worth 5 points each, plus ${conv} points from conversions. They score ${total} points in total.`,
          v: 't', what: 'the number of tries',
          eq: `5t + ${conv} = ${total}`,
          wrongs: [`5(t + ${conv}) = ${total}`, `t + ${5 + conv} = ${total}`, `5t − ${conv} = ${total}`],
          build: [`t tries at 5 points each: 5t.`, `Add the ${conv} conversion points: 5t + ${conv}.`, `The total is ${total}.`],
          ask: `How many tries did they score?`, x: tries, unit: 'tries',
          solve: [`Subtract ${conv} from both sides: 5t = ${total - conv}.`, `Divide both sides by 5: t = ${total - conv} ÷ 5.`],
          final: `${tries} tries`,
        });
      }
      if (t === 'tank') {
        const rate = R.pick([4, 5, 6, 8, 10]), hours = R.int(3, 9), start = rate * hours + R.pick([10, 20, 30]);
        const end = start - rate * hours;
        return formQ({
          story: `A water tank starts with ${start} litres and loses ${rate} litres every hour. After h hours there are ${end} litres left.`,
          v: 'h', what: 'the number of hours',
          eq: `${start} − ${rate}h = ${end}`,
          wrongs: [`${start} + ${rate}h = ${end}`, `${rate}h − ${start} = ${end}`, `h − ${rate} = ${end}`],
          build: [`It loses ${rate} litres each hour, so in h hours it loses ${rate}h litres.`, `Start with ${start} and take that away: ${start} − ${rate}h.`, `That leaves ${end} litres.`],
          ask: `How many hours have passed?`, x: hours, unit: 'hours',
          solve: [`Add ${rate}h to both sides: ${start} = ${end} + ${rate}h.`, `Subtract ${end} from both sides: ${rate}h = ${start - end}.`, `Divide both sides by ${rate}: h = ${start - end} ÷ ${rate}.`],
          final: `${hours} hours`,
        });
      }
      const start = R.pick([10, 15, 20, 25]), per = R.pick([4, 5, 6, 8]), weeks = R.int(4, 12), goal = start + per * weeks;
      return formQ({
        story: `${who} already has $${start} and saves $${per} every week. She wants $${goal} for a new skateboard.`,
        v: 'w', what: 'the number of weeks of saving',
        eq: `${per}w + ${start} = ${goal}`,
        wrongs: [`${start}w + ${per} = ${goal}`, `${per}w − ${start} = ${goal}`, `w + ${per + start} = ${goal}`],
        build: [`She saves $${per} a week, so after w weeks she has saved ${per}w.`, `Add the $${start} she already has: ${per}w + ${start}.`, `She wants that to be $${goal}.`],
        ask: `How many weeks will it take?`, x: weeks, unit: 'weeks',
        solve: [`Subtract ${start} from both sides: ${per}w = ${goal - start}.`, `Divide both sides by ${per}: w = ${goal - start} ÷ ${per}.`],
        final: `${weeks} weeks`,
      });
    }
    const t = R.pick(['bracket', 'gyms', 'consec']);
    if (t === 'bracket') {
      const n = R.int(3, 6), price = R.int(3, 8), drink = R.int(2, 5), total = n * (price + drink);
      return formQ({
        story: `${n} friends each buy a pie costing $p and a $${drink} drink. The whole order costs $${total}.`,
        v: 'p', what: 'the cost of one pie in dollars',
        eq: `${n}(p + ${drink}) = ${total}`,
        wrongs: [`${n}p + ${drink} = ${total}`, `p + ${n * drink} = ${total}`, `${n}(p − ${drink}) = ${total}`],
        build: [`One friend spends p + ${drink} dollars.`, `There are ${n} friends, so multiply by ${n}: ${n}(p + ${drink}).`, `That comes to $${total}.`],
        ask: `How much does one pie cost?`, x: price, unit: '$',
        solve: [`Divide both sides by ${n}: p + ${drink} = ${total / n}.`, `Subtract ${drink} from both sides: p = ${total / n} − ${drink}.`],
        final: `$${price}`,
      });
    }
    if (t === 'gyms') {
      const cheapWeek = R.pick([4, 5, 6, 8]), extra = R.pick([2, 3, 4, 5]), weeks = R.int(3, 12), join = extra * weeks;
      const bWeek = cheapWeek + extra;
      const clubA = R.pick(['Swim squad', 'Climbing gym', 'Skate park']), clubB = R.pick(['the pool', 'the other gym', 'the day pass']);
      return formQ({
        story: `${clubA} charges a $${join} joining fee plus $${cheapWeek} a week. Paying for ${clubB} costs $${bWeek} a week with no joining fee.`,
        v: 'w', what: 'the number of weeks',
        eq: `${join} + ${cheapWeek}w = ${bWeek}w`,
        wrongs: [`${join} + ${cheapWeek}w = ${bWeek}`, `${join}w + ${cheapWeek} = ${bWeek}w`, `${cheapWeek}w = ${bWeek}w + ${join}`],
        build: [`After w weeks the club costs ${join} + ${cheapWeek}w.`, `After w weeks the other one costs ${bWeek}w.`, `"The same cost" means the two sides are equal.`],
        ask: `After how many weeks do they cost the same?`, x: weeks, unit: 'weeks',
        solve: [`Subtract ${cheapWeek}w from both sides: ${join} = ${extra}w.`, `Divide both sides by ${extra}: w = ${join} ÷ ${extra}.`],
        final: `${weeks} weeks`,
      });
    }
    const first = R.int(5, 40), total = 3 * first + 3;
    return formQ({
      story: `Three <b>consecutive</b> whole numbers (numbers that follow on, like 7, 8, 9) add up to ${total}.`,
      v: 'n', what: 'the smallest of the three numbers',
      eq: `n + (n + 1) + (n + 2) = ${total}`,
      wrongs: [`3n = ${total}`, `n + 3 = ${total}`, `n + (n + 2) + (n + 4) = ${total}`],
      build: [`The smallest is n, the next is n + 1, the next is n + 2.`, `Add them: n + (n + 1) + (n + 2).`, `That comes to ${total}.`],
      ask: `What is the smallest of the three numbers?`, x: first,
      solve: [`Collect like terms: 3n + 3 = ${total}.`, `Subtract 3 from both sides: 3n = ${total - 3}.`, `Divide both sides by 3: n = ${total - 3} ÷ 3.`],
      final: `${first} (the numbers are ${first}, ${first + 1}, ${first + 2})`,
    });
  }

  function calc(level) {
    const v = R.pick(VARS);
    const r = Math.random();
    if (r < 0.13) return R.chance(0.6) ? checkSolution(level, v) : whichSolution(level, v);
    if (r < 0.32) return inequality(level, v);
    if (level === 1) return oneStep(v, R.int(1, 12));
    if (level === 2) {
      if (R.chance(0.15)) return oneStep(v, R.int(-9, 20), { big: true });
      return twoStep(v, R.chance(0.7) ? R.int(1, 12) : -R.int(1, 9));
    }
    if (R.chance(0.2)) return twoStep(v, R.chance(0.5) ? R.int(2, 15) : -R.int(1, 12));
    return hard(v, R.chance(0.6) ? R.int(1, 12) : -R.int(1, 10));
  }

  /* ---------- word problems ---------- */
  function word(level) {
    const t = level === 3
      ? R.pick(['think', 'think', 'form', 'form', 'form', 'pies', 'club', 'taxi', 'ages', 'perimeter', 'sameCost3', 'sameCost3', 'consec3', 'consec3'])
      : R.pick(['think', 'think', 'form', 'form', 'form', 'form', 'pies', 'club', 'taxi', 'ages', 'perimeter']);
    if (t === 'sameCost3') {
      // two hire options, unknown on both sides
      const perA = R.pick([8, 10, 12, 15]), gap = R.pick([2, 3, 4, 5]);
      const perB = perA + gap, h = R.int(3, 9);
      const baseB = R.pick([5, 10, 15]), baseA = baseB + gap * h;
      const total = baseA + perA * h;
      const thing = R.pick([
        ['Kayak Shed', 'Beach Hire', 'a kayak'],
        ['Bike Barn', 'Cycle Co', 'a bike'],
        ['Board Hut', 'Surf Shack', 'a paddleboard'],
      ]);
      return {
        prompt: `${thing[0]} hires ${thing[2]} for a $${baseA} booking fee plus $${perA} an hour. ${thing[1]} charges a $${baseB} booking fee plus $${perB} an hour. After how many hours do the two shops cost the same?`,
        answer: { type: 'number', value: h, unit: 'hours' },
        hint: `Let the number of hours be h. ${baseA} + ${perA}h = ${baseB} + ${perB}h. Get the h terms onto one side first.`,
        working: [
          `Let the hours be h: ${baseA} + ${perA}h = ${baseB} + ${perB}h.`,
          `Take ${perA}h from both sides: ${baseA} = ${baseB} + ${gap}h.`,
          `Take ${baseB} from both sides: ${baseA - baseB} = ${gap}h.`,
          `Divide by ${gap}: <b>h = ${h}</b>. (Both cost $${total}.)`,
        ],
        finalAnswer: `${h} hours`,
      };
    }
    if (t === 'consec3') {
      const n = R.int(6, 40);
      const three = R.chance(0.5);
      const total = three ? 3 * n + 3 : 2 * n + 1;
      const what = R.pick(['raffle tickets', 'house numbers on the street', 'pages in a book', 'seat numbers at the gala']);
      return {
        prompt: `${three ? 'Three' : 'Two'} numbers next to each other (like 7, 8${three ? ', 9' : ''}) are used as ${what}. They add up to ${total}. What is the smallest of the numbers?`,
        answer: { type: 'number', value: n },
        hint: `Call the smallest one n. The next ${three ? 'two are n + 1 and n + 2' : 'one is n + 1'}. Add them all up and make it ${total}.`,
        working: three
          ? [`Let the smallest be n, so the numbers are n, n + 1 and n + 2.`, `n + (n + 1) + (n + 2) = ${total}, so 3n + 3 = ${total}.`, `Subtract 3: 3n = ${total - 3}.`, `Divide by 3: <b>n = ${n}</b>. (The numbers are ${n}, ${n + 1}, ${n + 2}.)`]
          : [`Let the smaller be n, so the numbers are n and n + 1.`, `n + (n + 1) = ${total}, so 2n + 1 = ${total}.`, `Subtract 1: 2n = ${total - 1}.`, `Divide by 2: <b>n = ${n}</b>. (The numbers are ${n} and ${n + 1}.)`],
        finalAnswer: f(n),
      };
    }
    if (t === 'form') return formEquation(level);
    if (t === 'think') {
      const x = level === 3 ? R.nz(12) : R.int(2, 12);
      if (level === 1) {
        const op = R.pick(['add', 'sub', 'mul']);
        const b = R.int(2, 12);
        const res = op === 'add' ? x + b : op === 'sub' ? x - b : x * b;
        const words = op === 'add' ? `add ${b}` : op === 'sub' ? `subtract ${b}` : `multiply it by ${b}`;
        const eq = op === 'add' ? `n + ${b} = ${f(res)}` : op === 'sub' ? `n − ${b} = ${f(res)}` : `${b}n = ${f(res)}`;
        const undo = op === 'add' ? `subtract ${b}` : op === 'sub' ? `add ${b}` : `divide by ${b}`;
        return {
          prompt: `I think of a number and ${words}. The answer is ${f(res)}. What was my number?`,
          answer: { type: 'number', value: x },
          hint: `Call the number n. Then ${eq}. Undo the operation: ${undo}.`,
          working: [`Let the number be n: ${eq}.`, `Undo it: ${undo} on both sides.`, `<b>n = ${f(x)}</b>`],
          finalAnswer: f(x),
        };
      }
      if (level === 2 || R.chance(0.5)) {
        const a = R.int(2, 6), b = R.chance(0.6) ? R.int(1, 15) : -R.int(1, 15);
        const res = a * x + b;
        return {
          prompt: `I think of a number, multiply it by ${a} and ${b < 0 ? 'subtract ' + Math.abs(b) : 'add ' + b}. I get ${f(res)}. What was my number?`,
          answer: { type: 'number', value: x },
          hint: `Call the number n: ${lin(a, b, 'n')} = ${f(res)}. Undo the ${b < 0 ? 'subtracting' : 'adding'} first, then the multiplying.`,
          working: [
            `Let the number be n: ${lin(a, b, 'n')} = ${f(res)}.`,
            `${b < 0 ? 'Add ' + Math.abs(b) + ' to' : 'Subtract ' + b + ' from'} both sides: ${a}n = ${f(a * x)}.`,
            `Divide both sides by ${a}: <b>n = ${f(x)}</b>`,
          ],
          finalAnswer: f(x),
        };
      }
      // level 3: both sides
      const a = R.int(3, 6), b = R.int(1, 12), d = (a - 1) * x + b;
      return {
        prompt: `I think of a number. Multiplying it by ${a} and adding ${b} gives the same answer as adding ${f(d)} to the number. What is my number?`,
        answer: { type: 'number', value: x },
        hint: `Call the number n: ${a}n + ${b} = n + ${f(d)}. Take n from both sides first.`,
        working: [
          `Let the number be n: ${a}n + ${b} = n + ${f(d)}.`,
          `Subtract n from both sides: ${a - 1}n + ${b} = ${f(d)}.`,
          `Subtract ${b} from both sides: ${a - 1}n = ${f(d - b)}.`,
          `Divide by ${a - 1}: <b>n = ${f(x)}</b>`,
        ],
        finalAnswer: f(x),
      };
    }
    if (t === 'pies') {
      const n = R.int(2, 6), drink = R.int(2, 5), price = level === 1 ? R.int(2, 6) : R.pick([3, 4, 5, 4.5, 5.5, 6.5]);
      const total = n * price + drink;
      const item = R.pick(['pies', 'sushi rolls', 'sausage rolls', 'muffins']);
      return {
        prompt: `At the canteen, ${n} ${item} and a $${drink} juice cost $${f(total)} altogether. How much does one of the ${item} cost?`,
        answer: { type: 'number', value: price, unit: '$', placeholder: 'price of one' },
        hint: `Let one cost $p. Then ${n}p + ${drink} = ${f(total)}. Take off the juice first.`,
        working: [
          `Let one cost $p: ${n}p + ${drink} = ${f(total)}.`,
          `Subtract ${drink} from both sides: ${n}p = ${f(total - drink)}.`,
          `Divide by ${n}: <b>p = ${f(price)}</b>`,
        ],
        finalAnswer: `$${f(price)}`,
      };
    }
    if (t === 'club') {
      const join = R.pick([10, 15, 20, 25, 30]), weeks = level === 1 ? R.int(2, 5) : R.int(4, 12), per = R.pick([4, 5, 6, 8, 10, 12]);
      const total = join + weeks * per;
      const club = R.pick(['netball club', 'surf life saving club', 'swim squad', 'drama group']);
      return {
        prompt: `A ${club} charges a $${join} joining fee plus a weekly fee. ${weeks} weeks costs $${total} in total. What is the weekly fee?`,
        answer: { type: 'number', value: per, unit: '$' },
        hint: `Let the weekly fee be $w: ${weeks}w + ${join} = ${total}. Subtract the joining fee, then divide by ${weeks}.`,
        working: [
          `Let the weekly fee be $w: ${weeks}w + ${join} = ${total}.`,
          `Subtract ${join} from both sides: ${weeks}w = ${total - join}.`,
          `Divide by ${weeks}: <b>w = ${per}</b>`,
        ],
        finalAnswer: `$${per}`,
      };
    }
    if (t === 'taxi') {
      const flag = R.int(3, 6), per = R.pick([2, 2.5, 3]), km = level === 1 ? R.int(2, 8) : R.int(6, 25);
      const total = flag + per * km;
      return {
        prompt: `A taxi charges $${flag} plus $${f(per)} per km. A trip costs $${f(total)}. How many km was the trip?`,
        answer: { type: 'number', value: km, unit: 'km' },
        hint: `Let the distance be d km: ${f(per)}d + ${flag} = ${f(total)}. Subtract ${flag}, then divide by ${f(per)}.`,
        working: [
          `Let the distance be d: ${f(per)}d + ${flag} = ${f(total)}.`,
          `Subtract ${flag} from both sides: ${f(per)}d = ${f(total - flag)}.`,
          `Divide by ${f(per)}: <b>d = ${km}</b>`,
        ],
        finalAnswer: `${km} km`,
      };
    }
    if (t === 'ages') {
      const x = R.int(6, 14), more = R.int(2, 8);
      const total = 2 * x + more;
      const who = R.pick(['Harper and her brother', 'Mia and her cousin', 'Tane and his sister']);
      return {
        prompt: `${who} have ages that add up to ${total}. One is ${more} years older than the other. How old is the younger one?`,
        answer: { type: 'number', value: x, unit: 'years' },
        hint: `Let the younger age be y. The older is y + ${more}. So y + (y + ${more}) = ${total}.`,
        working: [
          `Let the younger age be y. The older is y + ${more}.`,
          `y + y + ${more} = ${total}, so 2y + ${more} = ${total}.`,
          `Subtract ${more}: 2y = ${total - more}.`,
          `Divide by 2: <b>y = ${x}</b>`,
        ],
        finalAnswer: `${x} years`,
      };
    }
    const w = R.int(3, 12), extra = R.int(2, 10), l = w + extra;
    const per = 2 * l + 2 * w;
    return {
      prompt: `A rectangular netball court section has a length ${extra} m more than its width. Its perimeter is ${per} m. What is the width?`,
      answer: { type: 'number', value: w, unit: 'm' },
      hint: `Let the width be w. Length = w + ${extra}. Perimeter = 2w + 2(w + ${extra}) = ${per}.`,
      working: [
        `Let the width be w, so the length is w + ${extra}.`,
        `Perimeter: 2w + 2(w + ${extra}) = ${per}.`,
        `Expand and simplify: 4w + ${2 * extra} = ${per}.`,
        `Subtract ${2 * extra}: 4w = ${per - 2 * extra}.`,
        `Divide by 4: <b>w = ${w}</b>`,
      ],
      finalAnswer: `${w} m`,
    };
  }

  HL.registerTopic({
    id: 'equations', subject: 'maths', strand: 'algebra', order: 5,
    name: 'Solving equations', short: 'Equations',
    blurb: 'Find the mystery number by undoing each operation on both sides.',
    example: '3x + 5 = 20 → 3x = 15 → x = 5',
    animal: 'penguin',
    learn: (() => {
      const INK = '#4A3B48', ROSE = '#E0568C', BLUE = '#2A6FA5', GREEN = '#2FA97A', PEACH = '#FFC79A', LAV = '#C9B8F2', SKY = '#A9D8F5';
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // equation lines written one under another, with an inverse-operation arrow down the right-hand side between each pair
      const solve = (lines, ops, ax = 200) => { const gap = 50; let o = ''; lines.forEach((t, i) => { const y = 34 + i * gap; o += `<text x="30" y="${y}" font-size="22" fill="${i === lines.length - 1 ? GREEN : INK}">${t}</text>`; if (i < ops.length) { const y1 = y + 8, y2 = y + gap - 22; o += `<line x1="${ax}" y1="${y1}" x2="${ax}" y2="${y2 - 6}" stroke="${ROSE}" stroke-width="2.5"/><polygon points="${ax},${y2 + 2} ${ax - 6},${y2 - 8} ${ax + 6},${y2 - 8}" fill="${ROSE}"/><text x="${ax + 12}" y="${(y1 + y2) / 2 + 5}" fill="${ROSE}">${ops[i]}</text>`; } }); return o; };
      const solveSvg = (lines, ops, ax) => SVG(360, 34 + (lines.length - 1) * 50 + 14, solve(lines, ops, ax));
      const cube = (x, y, crossed) => `<rect x="${x}" y="${y}" width="18" height="18" rx="3" fill="${PEACH}" stroke="${INK}" stroke-width="1.2"/><text x="${x + 9}" y="${y + 14}" text-anchor="middle" fill="${INK}">1</text>`;
      const cross = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ROSE}" stroke-width="3"/><line x1="${x1}" y1="${y2}" x2="${x2}" y2="${y1}" stroke="${ROSE}" stroke-width="3"/>`;
      return {
      what: '<p>An <b>equation</b> is a <b>balance scale</b>: whatever is on the left weighs the same as what is on the right. <b>Solving</b> means finding the number the letter stands for. The golden rule: <b>whatever you do to one side, do to the other</b>, and it stays balanced.</p>',
      visual: SVG(360, 220, `
        <text x="180" y="28" text-anchor="middle" font-size="20" fill="${INK}">x + 3 = 10</text>
        <text x="180" y="48" text-anchor="middle" fill="${ROSE}">take 3 off BOTH sides — still balanced</text>
        <line x1="40" y1="120" x2="320" y2="120" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
        <polygon points="180,120 156,162 204,162" fill="${LAV}" stroke="${INK}" stroke-width="2"/>
        <line x1="110" y1="162" x2="250" y2="162" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
        <rect x="46" y="108" width="124" height="8" rx="3" fill="${PEACH}" stroke="${INK}" stroke-width="1.2"/>
        <rect x="190" y="108" width="124" height="8" rx="3" fill="${PEACH}" stroke="${INK}" stroke-width="1.2"/>
        <rect x="54" y="66" width="40" height="40" rx="6" fill="${LAV}" stroke="${INK}" stroke-width="1.5"/><text x="74" y="94" text-anchor="middle" font-size="22" fill="${INK}">x</text>
        ${cube(104, 88)}${cube(126, 88)}${cube(148, 88)}${cross(100, 84, 170, 110)}<text x="135" y="78" text-anchor="middle" fill="${ROSE}">− 3</text>
        <rect x="198" y="66" width="40" height="40" rx="6" fill="${SKY}" stroke="${INK}" stroke-width="1.5"/><text x="218" y="94" text-anchor="middle" font-size="22" fill="${INK}">7</text>
        ${cube(248, 88)}${cube(270, 88)}${cube(292, 88)}${cross(244, 84, 314, 110)}<text x="279" y="78" text-anchor="middle" fill="${ROSE}">− 3</text>
        <text x="180" y="196" text-anchor="middle" font-size="22" fill="${GREEN}">x = 7</text>
        <text x="180" y="216" text-anchor="middle" fill="${INK}">check: 7 + 3 = 10 ✓</text>`),
      facts: [
        'An equation is a <b>balance</b>: do the same to <b>both sides</b> and it stays level',
        '<b>Undo</b> with the opposite: + ↔ −, × ↔ ÷',
        'Two-step (3x + 5 = 20): undo the <b>+ or − first</b>, then the ×',
        '<b>Brackets</b> outside → divide both sides by that number first',
        'Letters on <b>both sides</b> → subtract the smaller letter term from both sides',
        '<b>Check</b>: put your answer back in — do both sides match?',
        '<b>Word problem</b>: name the unknown (<b>let p = …</b>), write the equation, then solve it',
        'An <b>inequality</b> (&gt; &lt; ≥ ≤) is solved <b>exactly like</b> an equation: x + 3 &gt; 7 → <b>x &gt; 4</b>',
        'Number line: <b>open ○ = NOT included</b> (&gt; &lt;) &nbsp;·&nbsp; <b>filled ● = included</b> (≥ ≤). Arrow <b>right</b> = bigger, <b>left</b> = smaller',
      ],
      steps: [
        'Ask: <b>"What is being done to x?"</b> Undo it with the opposite: + ↔ −, × ↔ ÷. "It says + 5, so I take 5 off both sides."',
        'For two-step equations like 3x + 5 = 20: <b>undo the adding or subtracting first</b>, then the multiplying. 3x = 15, then x = 5.',
        '<b>Brackets</b>: "Divide both sides by the number outside first." 3(x + 2) = 21 → x + 2 = 7 → x = 5.',
        '<b>Letters on both sides</b>: "Take the smaller letter term off both sides, so x is only on one side." 5x + 3 = 2x + 15 → 3x + 3 = 15 → 3x = 12 → x = 4.',
        '<b>Check</b>: "Put my answer back in — do both sides balance?"',
      ],
      examples: [
        { q: 'Solve x + 5 = 12',
          working: ['<b>Picture:</b> a balance scale — x and 5 blocks on the left, 12 blocks on the right.', '1. What is being done to x? + 5. What is the opposite? − 5.', '2. Do it to BOTH sides so the scale stays level: x + 5 − 5 = 12 − 5.', 'x = 7', '3. Check: 7 + 5 = 12. Yes!'],
          a: 'x = 7',
          visual: solveSvg(['x + 5 = 12', 'x = 7'], ['− 5 both sides']) },
        { q: 'Solve 4x = 24',
          working: ['<b>Picture:</b> 4 identical x-boxes on the left balance 24 blocks on the right.', '1. What is being done to x? × 4. What is the opposite? ÷ 4.', '2. Divide BOTH sides by 4: 4x ÷ 4 = 24 ÷ 4.', 'x = 6', '3. Check: 4 × 6 = 24. Yes!'],
          a: 'x = 6',
          visual: solveSvg(['4x = 24', 'x = 6'], ['÷ 4 both sides']) },
        { q: 'Solve 3x + 5 = 20',
          working: ['<b>Picture:</b> 3 x-boxes and 5 blocks on the left, 20 blocks on the right. Take the loose blocks off first, then share.', '1. What is furthest from x? The + 5. Undo it: − 5 on both sides → 3x = 15.', '2. What is left? × 3. Undo it: ÷ 3 on both sides.', 'x = 5', '3. Check: 3 × 5 + 5 = 20. Yes!'],
          a: 'x = 5',
          visual: solveSvg(['3x + 5 = 20', '3x = 15', 'x = 5'], ['− 5 both sides', '÷ 3 both sides']) },
        { q: 'Solve 2(x − 4) = 10',
          working: ['<b>Picture:</b> two identical bags on the left, each holding "x − 4"; 10 blocks on the right.', '1. Is there a number outside a bracket? Yes, 2. Undo it first: ÷ 2 on both sides → x − 4 = 5.', '2. Now what is done to x? − 4. Undo it: + 4 on both sides.', 'x = 9', '3. Check: 2 × (9 − 4) = 2 × 5 = 10. Yes!'],
          a: 'x = 9' },
        { q: 'Solve 6x + 1 = 2x + 13',
          working: ['<b>Picture:</b> x-boxes on BOTH pans of the scale — take the same number off each pan until only one side has x.', '1. Which side has fewer x? The right (2x). Take 2x off both sides → 4x + 1 = 13.', '2. Now it is a two-step equation. Undo + 1: − 1 both sides → 4x = 12.', '3. Undo × 4: ÷ 4 both sides.', 'x = 3', '4. Check: 6 × 3 + 1 = 19 and 2 × 3 + 13 = 19. Yes!'],
          a: 'x = 3' },
        { q: 'At the canteen, 3 pies and a $2 juice cost $17 altogether. How much does one pie cost?',
          working: ['<b>Picture:</b> 3 pies and a juice on one pan, $17 on the other.', '1. What do I not know? The price of a pie — call it p. Equation: 3p + 2 = 17.', '2. Undo the + 2 first: − 2 both sides → 3p = 15.', '3. Undo the × 3: ÷ 3 both sides.', 'p = 5', '4. Check: 3 × 5 + 2 = 17. Yes!'],
          a: '$5 each' },
        { q: 'Is x = 4 the solution of 3x + 2 = 14?',
          working: ['<b>Picture:</b> checking is putting the weights back on the scale to see if it really balances.', '1. What do I do to check? Put x = 4 into the <b>left</b> side: 3 × 4 + 2.', '2. Work it out: 3 × 4 = 12, then 12 + 2 = 14.', '3. Does it match the right side? The right side is 14. 14 = 14. Yes!', 'So x = 4 <b>is</b> the solution. (If it had come to 15, the answer would be "no".)'],
          a: 'Yes — it works' },
        { q: 'Harper had some marbles. She was given 7 more and now has 19. How many did she start with?',
          working: ['<b>Picture:</b> a bag with a secret number of marbles, then 7 more dropped in on top.', '1. What do I not know? How many were in the bag — <b>let m = the number she started with</b>.', '2. Turn the words into maths: m + 7 = 19.', '3. Undo the + 7: take 7 off both sides.', 'm = 19 − 7 = 12', '4. Check: 12 + 7 = 19. Yes!'],
          a: 'She started with 12 marbles' },
        { q: 'Solve x + 3 &gt; 7 and show it on a number line',
          working: ['<b>Picture:</b> the same scale, but one side is <b>heavier</b>. Do the same to both sides and it stays heavier.', '1. What is being done to x? + 3. Undo it: − 3 on both sides.', 'x &gt; 7 − 3, so <b>x &gt; 4</b>', '2. Is 4 itself allowed? "Greater than" does <b>not</b> include 4 → <b>open ○</b> circle.', '3. Which way does the arrow go? Bigger numbers → <b>right</b>.'],
          a: 'x &gt; 4',
          visual: numberLine(4, '>', 0, 8) },
        { q: 'Solve 2x ≤ 10 and show it on a number line',
          working: ['<b>Picture:</b> 2 boxes of x weigh 10 or less. One box weighs 5 or less.', '1. What is being done to x? × 2. Undo it: ÷ 2 on both sides.', 'x ≤ 10 ÷ 2, so <b>x ≤ 5</b>', '2. Is 5 itself allowed? "or equal to" says <b>yes</b> → <b>filled ●</b> circle.', '3. Which way does the arrow go? Smaller numbers → <b>left</b>.'],
          a: 'x ≤ 5',
          visual: numberLine(5, '≤', 1, 9) },
        { q: 'What inequality does this number line show?',
          working: ['<b>Picture:</b> the circle tells you whether that number is invited to the party.', '1. Where is the circle? At −2.', '2. Filled or open? <b>Filled ●</b> → −2 <b>is</b> invited → the sign is ≥ or ≤.', '3. Which way is the arrow? <b>Right</b> → the bigger numbers → ≥.'],
          a: 'x ≥ −2',
          visual: numberLine(-2, '≥', -6, 2) },
      ],
      tips: [
        'Write each step on a <b>new line</b> with the = signs lined up. It stops silly slips.',
        'The answer can be <b>negative</b> or a <b>decimal</b>. That is fine: 2x = 5 gives x = 2.5, and 2x + 9 = 3 gives x = −3.',
        '"I think of a number" problems: call the number <b>n</b>, write the equation, then solve it the same way.',
        'Always <b>check</b> by putting the answer back — it takes 5 seconds and catches most mistakes.',
        '<b>Inequalities</b> are solved exactly like equations. The only new bit is the circle: <b>○ open = not included</b>, <b>● filled = included</b>.',
        'Word problems: the hardest bit is the <b>first line</b>. Write "<b>let n = …</b>" and say out loud what n stands for.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
