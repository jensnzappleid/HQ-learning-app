/* Topic: Order of operations (BEDMAS) — expressions are built as small trees so the working can show ONE operation per line */
(function (HL) {
  const R = HL.rng, N = HL.num;

  // ---------- expression trees ----------
  const PREC = { '+': 1, '-': 1, '×': 2, '÷': 2, '^': 3 };
  const LABEL = { '+': 'Addition', '-': 'Subtraction', '×': 'Multiplication', '÷': 'Division', '^': 'Exponent' };
  const leaf = (v) => ({ v });
  const op = (o, l, r) => ({ o, l: typeof l === 'number' ? leaf(l) : l, r: typeof r === 'number' ? leaf(r) : r });
  const isLeaf = (n) => n.o === undefined;
  const sym = (o) => (o === '-' ? '−' : o);
  const showNum = (x) => (x < 0 ? `(${N.fmt(x)})` : N.fmt(x));

  /** does `child` need brackets when sitting inside `parent` on this side? (non-leaf children only) */
  function needsBr(child, parent, side) {
    if (isLeaf(child)) return false;
    if (parent.o === '^') return true;
    if (PREC[child.o] < PREC[parent.o]) return true;
    if (PREC[child.o] === PREC[parent.o] && side === 'right' && (parent.o === '-' || parent.o === '÷')) return true;
    return false;
  }

  function render(n, parent, side) {
    if (isLeaf(n)) return parent && n.v < 0 ? `(${N.fmt(n.v)})` : N.fmt(n.v);
    if (n.o === '^') {
      const base = isLeaf(n.l) && n.l.v >= 0 ? N.fmt(n.l.v) : `(${render(n.l)})`;
      return `${base}<sup>${n.r.v}</sup>`;
    }
    const s = `${render(n.l, n, 'left')} ${sym(n.o)} ${render(n.r, n, 'right')}`;
    return parent && needsBr(n, parent, side) ? `(${s})` : s;
  }

  const apply = (o, a, b) => (o === '+' ? a + b : o === '-' ? a - b : o === '×' ? a * b : o === '÷' ? a / b : Math.pow(a, b));

  /** collect operations that are ready (both children are numbers), left to right, with bracket depth */
  function ready(n, depth, path, out) {
    if (isLeaf(n)) return;
    ready(n.l, depth + (needsBr(n.l, n, 'left') ? 1 : 0), path.concat('l'), out);
    if (isLeaf(n.l) && isLeaf(n.r)) out.push({ depth, prec: PREC[n.o], idx: out.length, path, node: n });
    ready(n.r, depth + (needsBr(n.r, n, 'right') ? 1 : 0), path.concat('r'), out);
  }
  function replaceAt(n, path, node) {
    if (!path.length) return node;
    return path[0] === 'l' ? { o: n.o, l: replaceAt(n.l, path.slice(1), node), r: n.r } : { o: n.o, l: n.l, r: replaceAt(n.r, path.slice(1), node) };
  }

  /** evaluate the tree one BEDMAS step at a time -> { value, lines, ok } (ok=false if any step is not an integer) */
  function solve(tree) {
    const lines = []; let t = tree, ok = true;
    let guard = 0;
    while (!isLeaf(t) && guard++ < 30) {
      const out = []; ready(t, 0, [], out);
      out.sort((x, y) => y.depth - x.depth || y.prec - x.prec || x.idx - y.idx);
      const c = out[0], n = c.node, a = n.l.v, b = n.r.v;
      const v = apply(n.o, a, b);
      if (!Number.isInteger(v)) ok = false;
      const sameLevel = out.filter((x) => x.depth === c.depth && x.prec === c.prec).length > 1 && n.o !== '^';
      t = replaceAt(t, c.path, leaf(v));
      let label = c.depth > 1 ? `Innermost brackets (${LABEL[n.o].toLowerCase()})` : c.depth === 1 ? `Brackets (${LABEL[n.o].toLowerCase()})` : LABEL[n.o];
      if (sameLevel) label += ', left to right';
      const result = isLeaf(t) ? `<b>${N.fmt(v)}</b>` : N.fmt(v);
      const calcStr = n.o === '^' ? `${showNum(a)}<sup>${b}</sup> = ${result}` : `${showNum(a)} ${sym(n.o)} ${showNum(b)} = ${result}`;
      lines.push(`<b>${label}</b>: ${calcStr}${isLeaf(t) ? '' : ' &nbsp;→&nbsp; ' + render(t)}`);
    }
    return { value: t.v, lines, ok };
  }

  /** divisors of n between 2 and max */
  const divisors = (n, max) => { const d = []; for (let i = 2; i <= Math.min(n, max); i++) if (n % i === 0) d.push(i); return d; };

  // ---------- templates ----------
  const T1 = [
    () => op('+', R.int(2, 15), op('×', R.int(2, 9), R.int(2, 9))),
    () => op('+', op('×', R.int(2, 9), R.int(2, 9)), R.int(2, 15)),
    () => { const b = R.int(2, 9), c = R.int(2, 9); return op('-', op('×', b, c), R.int(1, b * c - 1)); },
    () => { const b = R.int(2, 6), c = R.int(2, 6); return op('-', b * c + R.int(1, 20), op('×', b, c)); },
    () => { const c = R.int(2, 9), q = R.int(2, 9); return op('+', R.int(2, 15), op('÷', c * q, c)); },
    () => { const c = R.int(2, 9), q = R.int(2, 9); return op('+', op('÷', c * q, c), R.int(2, 15)); },
    () => { const c = R.int(2, 9), q = R.int(2, 9); return op('-', c * q + R.int(1, 10), op('÷', c * q, c)); },
    () => op('+', op('-', R.int(10, 30), R.int(2, 9)), R.int(2, 9)),
  ];
  const T2 = [
    () => { const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 6); return op('-', op('×', op('+', a, b), c), R.int(1, (a + b) * c - 1)); },
    () => { const b = R.int(5, 15), c = R.int(1, b - 1); return op('+', R.int(2, 20), op('×', op('-', b, c), R.int(2, 9))); },
    () => { const a = R.int(2, 6), b = R.int(2, 9), c = R.int(2, 9); return op('-', op('×', a, op('+', b, c)), R.int(1, 20)); },
    () => { const c = R.int(2, 9), q = R.int(2, 9), s = c * q, a = R.int(1, s - 1); return op('+', op('÷', op('+', a, s - a), c), R.int(2, 15)); },
    () => { const b = R.int(2, 9), c = R.int(2, 6); return op('+', op('-', b * c + R.int(1, 15), op('×', b, c)), R.int(2, 12)); },
    () => op('+', op('×', R.int(2, 9), R.int(2, 9)), op('×', R.int(2, 9), R.int(2, 9))),
    () => { const b = R.int(2, 9); return op('×', op('-', b + R.int(2, 9), b), op('+', R.int(2, 9), R.int(2, 9))); },
    () => { const k = R.int(2, 9), c = R.int(2, 9), p = k * c; const d = R.pick(divisors(p, 12)); return op('÷', op('×', op('-', k + R.int(1, 9), k), c), d); },
    () => { const d = R.int(2, 9), q = R.int(2, 9), s = d * q, b = R.int(1, s - 1); return op('-', q + R.int(1, 20), op('÷', op('+', b, s - b), d)); },
    () => { const c = R.int(2, 6), q = R.int(2, 9); return op('-', op('+', R.int(2, 12), op('÷', c * q, c)), R.int(1, q)); },
    () => op('-', op('×', R.int(3, 9), R.int(2, 9)), op('×', R.int(2, 5), R.int(2, 5))),
  ];
  const T3 = [
    () => { const c = R.int(5, 12); return op('+', R.int(2, 20), op('×', op('^', R.int(2, 6), 2), op('-', c, R.int(1, c - 1)))); },
    () => { const k = R.int(2, 6), c = R.pick(divisors(k * k, 16)); return op('+', op('÷', op('^', op('-', k + R.int(1, 9), k), 2), c), R.int(2, 15)); },
    () => { const c = R.int(4, 12), d = R.int(1, c - 1), e = R.int(2, 6), b = R.int(2, 9); const inner = b + (c - d) * e; return op('-', inner + R.int(1, 20), op('+', b, op('×', op('-', c, d), e))); },
    () => { const a = R.int(1, 8), b = a + R.int(1, 9); return op('+', op('×', op('-', a, b), R.int(2, 6)), op('^', R.int(2, 6), 2)); },
    () => { const b = R.int(1, 8), c = b + R.int(1, 5); return op('-', op('×', R.int(2, 5), op('^', op('-', b, c), 2)), R.int(1, 20)); },
    () => { const b = R.int(1, 5), c = R.int(1, 5), q = R.int(2, 5); return op('+', op('÷', (b + c) * (b + c) * q, op('^', op('+', b, c), 2)), R.int(2, 12)); },
    () => { const b = R.int(2, 6), c = R.int(2, 6), d = R.int(2, 9); const q = Math.ceil((b * c + 1) / d) + R.int(0, 3); return op('-', op('÷', op('+', d * q - b * c, op('×', b, c)), d), R.int(1, q)); },
    () => { const a = R.int(2, 5), b = R.int(2, 9), c = R.int(2, 9), d = R.int(2, 5); return op('-', op('^', a, 3), op('×', op('+', b, c), d)); },
    () => { const c = R.int(2, 6), q = R.int(1, 5), a = R.int(1, 9); return op('+', op('÷', op('-', a, a + c * q), c), op('×', R.int(2, 9), R.int(2, 9))); },
    () => { const b = R.int(2, 12), c = R.int(1, b - 1), a = R.int(b - c + 1, 20); return op('×', R.int(2, 6), op('-', a, op('-', b, c))); },
    () => { const c = R.int(1, 8), d = c + R.int(1, 9); return op('×', op('+', R.int(2, 9), R.int(2, 9)), op('-', c, d)); },
    () => op('-', op('^', R.int(2, 5), 3), op('×', op('^', R.int(2, 6), 2), R.int(2, 4))),
    () => { const c = R.int(2, 6), q = R.int(2, 9), r = R.int(1, 12); return op('+', op('×', op('^', R.int(2, 4), 2), R.int(2, 5)), op('÷', op('-', c * q + r, r), c)); },
    () => { const n = R.int(2, 6); return op('+', op('^', op('-', R.int(1, 5), n + R.int(1, 5)), 2), op('×', R.int(2, 9), R.int(2, 9))); },
  ];

  function build(level) {
    const T = level === 1 ? T1 : level === 2 ? T2 : T3;
    for (let tries = 0; tries < 40; tries++) {
      const tree = R.pick(T)();
      const s = solve(tree);
      if (s.ok && Math.abs(s.value) < 2000) return { tree, s };
    }
    const tree = op('+', R.int(2, 9), op('×', R.int(2, 9), R.int(2, 9)));
    return { tree, s: solve(tree) };
  }

  function calc(level) {
    const { tree, s } = build(level);
    const expr = render(tree);
    const hasBr = /\(/.test(expr), hasPow = /<sup>/.test(expr);
    const hint = hasBr ? 'Do what is inside the brackets first.' + (hasPow ? ' Then exponents, then × and ÷, then + and −.' : ' Then × and ÷ before + and −.')
      : hasPow ? 'Exponents first, then × and ÷, then + and − (left to right).'
        : 'Multiply and divide before you add and subtract. Work left to right.';
    return {
      prompt: `${expr} = ?`,
      answer: { type: 'number', value: s.value },
      hint,
      working: s.lines,
      finalAnswer: N.fmt(s.value),
      skill: level === 1 ? 'two-ops' : level === 2 ? 'brackets' : 'exponents',
    };
  }

  // ---------- word problems ----------
  function word(level) {
    const t = R.pick(level === 1 ? ['pens', 'rugby', 'canteen', 'tickets', 'netball', 'fruit']
      : level === 2 ? ['pens', 'rugby', 'canteen', 'tickets', 'netball', 'fruit']
        : ['pens', 'rugby', 'canteen', 'tickets', 'garden', 'stickers', 'bakesale', 'kayak', 'market']);
    let prompt, tree, unit = '';
    if (t === 'pens') {
      const n = R.int(2, 6), p = R.int(3, 10);
      if (level === 1) {
        const s = R.int(1, 5);
        prompt = `Harper buys ${n} packs of ${p} pens and ${N.plural(s, 'single pen')}. How many pens does she have?`;
        tree = op('+', op('×', n, p), s);
      } else if (level === 2) {
        const s = R.int(1, 5), g = R.int(2, n * p);
        prompt = `Harper buys ${n} packs of ${p} pens and ${N.plural(s, 'single pen')}. She gives ${g} pens to her brother. How many pens does she have left?`;
        tree = op('-', op('+', op('×', n, p), s), g);
      } else {
        const k = R.int(2, 6); const q = Math.ceil((n * p + 1) / k) + R.int(0, 2); const s = k * q - n * p;
        prompt = `Harper buys ${n} packs of ${p} pens and ${N.plural(s, 'single pen')}, then shares them equally between ${k} friends. How many pens does each friend get?`;
        tree = op('÷', op('+', op('×', n, p), s), k);
      }
      unit = 'pens';
    } else if (t === 'rugby') {
      const tr = R.int(1, 6), cv = R.int(0, tr);
      unit = 'points';
      if (level === 1) {
        prompt = `In a rugby game the Hurricanes score ${N.plural(tr, 'try', 'tries')} (5 points each) and ${N.plural(cv, 'conversion')} (2 points each). How many points is that?`;
        tree = op('+', op('×', tr, 5), op('×', cv, 2));
      } else if (level === 2) {
        const pen = R.int(1, 4);
        prompt = `The Crusaders score ${N.plural(tr, 'try', 'tries')} (5 points each), ${N.plural(cv, 'conversion')} (2 points each) and ${N.plural(pen, 'penalty', 'penalties')} (3 points each). What is their total?`;
        tree = op('+', op('+', op('×', tr, 5), op('×', cv, 2)), op('×', pen, 3));
      } else {
        let tr2, cv2;
        do { tr2 = R.int(1, 5); cv2 = R.int(0, tr2); } while (tr * 5 + cv * 2 === tr2 * 5 + cv2 * 2);
        prompt = `The Blues score ${N.plural(tr, 'try', 'tries')} and ${N.plural(cv, 'conversion')}. The Chiefs score ${N.plural(tr2, 'try', 'tries')} and ${N.plural(cv2, 'conversion')}. A try is 5 points and a conversion is 2 points. By how many points do the Blues win (or lose, as a negative number)?`;
        tree = op('-', op('+', op('×', tr, 5), op('×', cv, 2)), op('+', op('×', tr2, 5), op('×', cv2, 2)));
      }
    } else if (t === 'canteen') {
      const a = R.int(1, 4), pp = R.int(3, 6), b = R.int(1, 4), jp = R.int(2, 4);
      unit = '$';
      if (level === 1) {
        prompt = `At the school canteen Harper buys ${N.plural(a, 'pie')} at $${pp} each and ${N.plural(b, 'juice')} at $${jp} each. How much does she spend?`;
        tree = op('+', op('×', a, pp), op('×', b, jp));
      } else if (level === 2) {
        const total = a * pp + b * jp; const pay = Math.ceil(total / 10) * 10 + R.pick([0, 10]);
        prompt = `At the canteen Harper buys ${N.plural(a, 'pie')} at $${pp} each and ${N.plural(b, 'juice')} at $${jp} each. She pays with $${pay}. How much change does she get?`;
        tree = op('-', pay, op('+', op('×', a, pp), op('×', b, jp)));
      } else {
        const k = R.pick(divisors(a * pp + b * jp, 6).length ? divisors(a * pp + b * jp, 6) : [1]);
        if (k === 1) { prompt = `Harper buys ${N.plural(a, 'pie')} at $${pp} each and ${N.plural(b, 'juice')} at $${jp} each, then gets a $${R.int(1, 3)} discount. What does she pay?`; tree = op('-', op('+', op('×', a, pp), op('×', b, jp)), R.int(1, 3)); }
        else { prompt = `Harper and her friends buy ${N.plural(a, 'pie')} at $${pp} each and ${N.plural(b, 'juice')} at $${jp} each, then split the cost equally between ${k} people. How much does each person pay?`; tree = op('÷', op('+', op('×', a, pp), op('×', b, jp)), k); }
      }
    } else if (t === 'tickets') {
      const ad = R.int(1, 4), ch = R.int(1, 5), ap = R.pick([10, 12, 15]), cp = R.pick([5, 6, 8]);
      unit = '$';
      if (level === 1) {
        prompt = `Movie tickets cost $${ap} for adults and $${cp} for children. How much do ${N.plural(ad, 'adult')} and ${N.plural(ch, 'child', 'children')} pay altogether?`;
        tree = op('+', op('×', ad, ap), op('×', ch, cp));
      } else if (level === 2) {
        const disc = R.pick([5, 10]);
        prompt = `Zoo tickets cost $${ap} for adults and $${cp} for children. A family of ${N.plural(ad, 'adult')} and ${N.plural(ch, 'child', 'children')} has a $${disc} discount voucher. How much do they pay?`;
        tree = op('-', op('+', op('×', ad, ap), op('×', ch, cp)), disc);
      } else {
        const total = 2 * ap + ch * cp;
        if (total % 2 === 0) {
          prompt = `Two adults take ${N.plural(ch, 'child', 'children')} to the pools. Adults pay $${ap} and children pay $${cp}. The two adults split the total cost equally. How much does each adult pay?`;
          tree = op('÷', op('+', op('×', 2, ap), op('×', ch, cp)), 2);
        } else {
          const pay = total + R.int(1, 10);
          prompt = `Two adults take ${N.plural(ch, 'child', 'children')} to the pools. Adults pay $${ap} and children pay $${cp}. They pay with $${pay}. How much change do they get?`;
          tree = op('-', pay, op('+', op('×', 2, ap), op('×', ch, cp)));
        }
      }
    } else if (t === 'netball') {
      const g = R.int(3, 12);
      unit = 'goals';
      if (level === 1) {
        const extra = R.int(1, 6);
        prompt = `Harper's netball team scores ${N.plural(g, 'goal')} in each of the 4 quarters, and Harper shoots ${extra} more in a practice shoot-out afterwards. How many goals is that in total?`;
        tree = op('+', op('×', 4, g), extra);
      } else {
        const last = R.int(3, 12), opp = R.int(10, 3 * g + last - 1);
        prompt = `Harper's team scores ${N.plural(g, 'goal')} in each of the first 3 quarters and ${last} in the last quarter. The other team scores ${opp}. By how many goals does Harper's team win?`;
        tree = op('-', op('+', op('×', 3, g), last), opp);
      }
    } else if (t === 'fruit') {
      const b = R.int(2, 6), f = R.int(4, 12), e = R.int(1, 8);
      unit = 'feijoas';
      if (level === 1) { prompt = `Harper picks ${N.plural(b, 'box', 'boxes')} of feijoas with ${f} in each box, then eats ${e}. How many feijoas are left?`; tree = op('-', op('×', b, f), e); }
      else {
        const ks = divisors(b * f - e, 6);
        if (!ks.length) {
          const m = R.int(2, 9);
          prompt = `Harper picks ${N.plural(b, 'box', 'boxes')} of feijoas with ${f} in each box, eats ${e}, then picks ${m} more. How many does she have now?`;
          tree = op('+', op('-', op('×', b, f), e), m);
        } else {
          const k = R.pick(ks);
          prompt = `Harper picks ${N.plural(b, 'box', 'boxes')} of feijoas with ${f} in each box and eats ${e}. She shares the rest equally between ${k} friends. How many does each friend get?`;
          tree = op('÷', op('-', op('×', b, f), e), k);
        }
      }
    } else if (t === 'garden') {
      const s = R.int(6, 15), p = R.int(2, s - 3);
      unit = 'm²';
      prompt = `A square lawn has sides of ${s} m. A square sandpit with sides of ${p} m is cut out of it. What area of lawn is left, in m²?`;
      tree = op('-', op('^', s, 2), op('^', p, 2));
    } else if (t === 'bakesale') {
      const trays = R.int(3, 8), per = R.int(8, 12), eaten = R.int(2, 9), price = R.pick([2, 3, 4]);
      const oven = R.pick([15, 20, 25]);
      unit = '$';
      prompt = `Harper bakes ${N.plural(trays, 'tray')} of ${per} muffins for the school gala. Her brother eats ${eaten} of them. She sells the rest for $${price} each. The oven takes ${oven} minutes per tray. How much money does she make?`;
      tree = op('×', op('-', op('×', trays, per), eaten), price);
    } else if (t === 'kayak') {
      const first = R.pick([18, 20, 24]), extra = R.pick([8, 9, 10, 12]), hours = R.int(3, 6);
      unit = '$';
      prompt = `Kayak hire at the lake costs $${first} for the <b>first</b> hour and $${extra} for each <b>extra</b> hour. Harper hires a kayak for ${hours} hours. How much does she pay?`;
      tree = op('+', first, op('×', extra, op('-', hours, 1)));
    } else if (t === 'market') {
      const a = R.int(3, 6), b = R.pick([10, 12, 15, 20]), c = R.int(2, 5), d = R.pick([6, 8, 10, 12]);
      const total = a * b + c * d;
      const ks = divisors(total, 12).filter((k) => k > 2);
      unit = 'bags';
      if (!ks.length) {
        const gone = R.int(5, Math.max(6, Math.floor(total / 2)));
        unit = 'items';
        prompt = `At the Matariki market Harper has ${N.plural(a, 'box', 'boxes')} of ${b} fry bread and ${N.plural(c, 'box', 'boxes')} of ${d} hāngī packs. By lunchtime ${gone} items have sold. How many are left?`;
        tree = op('-', op('+', op('×', a, b), op('×', c, d)), gone);
      } else {
        const k = R.pick(ks);
        prompt = `At the Matariki market Harper has ${N.plural(a, 'box', 'boxes')} of ${b} fry bread and ${N.plural(c, 'box', 'boxes')} of ${d} hāngī packs. She puts them into bags of ${k}. How many bags does she fill?`;
        tree = op('÷', op('+', op('×', a, b), op('×', c, d)), k);
      }
    } else {
      const sheets = R.int(2, 5), per = R.int(2, 6), given = R.int(1, 3), k = R.int(2, 4);
      unit = 'stickers';
      const total = sheets * per * per;
      const remain = total - given * k;
      prompt = `Harper has ${N.plural(sheets, 'sheet')} of stickers. Each sheet is a ${per} by ${per} square of stickers. She gives ${N.plural(given, 'sticker')} to each of ${N.plural(k, 'friend')}. How many stickers does she have left?`;
      tree = op('-', op('×', sheets, op('^', per, 2)), op('×', given, k));
      if (remain < 0) tree = op('×', sheets, op('^', per, 2));
    }
    const s = solve(tree);
    const expr = render(tree);
    return {
      prompt,
      answer: { type: 'number', value: s.value, unit },
      hint: `Write it as one calculation: ${expr}. Then use BEDMAS.`,
      working: [`Write it as one calculation: ${expr}`].concat(s.lines),
      finalAnswer: unit === '$' ? `$${N.fmt(s.value)}` : `${N.fmt(s.value)} ${unit}`,
      skill: 'word',
    };
  }

  HL.registerTopic({
    id: 'order-of-operations', subject: 'maths', strand: 'number', order: 3,
    name: 'Order of operations (BEDMAS)', short: 'BEDMAS',
    blurb: 'Which part of a calculation do you do first? Brackets, Exponents, Division & Multiplication, Addition & Subtraction.',
    example: '3 + 4 × 2 = 11 (not 14) &nbsp;·&nbsp; (3 + 4) × 2 = 14',
    animal: 'cat',
    learn: {
      what: '<p>When a calculation has more than one operation, everyone must do it in the <b>same order</b> or we would all get different answers. That order is called <b>BEDMAS</b>. It is why 3 + 4 × 2 = 11 and not 14: the × happens before the +.</p><p><b>Picture for this topic:</b> BEDMAS is a <b>ladder</b>. Brackets stand on the top rung, then exponents, then ÷ and ×, then + and − at the bottom. You always do the operation standing on the <b>highest rung</b> first, and climb down.</p>',
      visual: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="14" font-weight="700">
        ${[['B','Brackets','( ) — do these first','#F9A8C9','#E0568C'],['E','Exponents','powers like 3², 2³','#FFC79A','#4A3B48'],['DM','Divide & Multiply','a tie — work left → right','#FFE98A','#4A3B48'],['AS','Add & Subtract','a tie — work left → right','#A9D8F5','#2A6FA5']].map(([L,name,sub,bg,c],i)=>{const y=6+i*48;return `
          <rect x="14" y="${y}" width="296" height="42" rx="10" fill="${bg}"/>
          <rect x="14" y="${y}" width="66" height="42" rx="10" fill="#fff" fill-opacity="0.55"/>
          <text x="47" y="${y+29}" text-anchor="middle" font-size="24" fill="${c}">${L}</text>
          <text x="92" y="${y+18}" fill="#4A3B48">${name}</text>
          <text x="92" y="${y+36}" fill="${c}" font-size="12">${sub}</text>`;}).join('')}
        <line x1="336" y1="12" x2="336" y2="182" stroke="#4A3B48" stroke-width="3"/><polygon points="336,192 328,178 344,178" fill="#4A3B48"/>
        <text x="180" y="213" text-anchor="middle" fill="#4A3B48" font-size="13">Start at the top rung and climb down ↓</text>
      </svg>`,
      facts: [
        '<b>B</b>rackets → <b>E</b>xponents → <b>D</b>ivide & <b>M</b>ultiply → <b>A</b>dd & <b>S</b>ubtract',
        'D and M are a <b>tie</b>: work <b>left to right</b>. Same for A and S.',
        '3 + 4 × 2 = <b>11</b> (× first), but (3 + 4) × 2 = <b>14</b> (brackets first)',
        '10 − 4 + 2 = <b>8</b> (left to right), not 4',
        'Do <b>one operation per line</b> and copy the rest exactly',
      ],
      steps: [
        'Ask "<b>Are there brackets?</b>" If yes, do the inside of the brackets first (innermost brackets first).',
        'Ask "<b>Any exponents?</b>" (powers like 3² and 2³). Work them out next.',
        'Ask "<b>Any ÷ or ×?</b>" Do them <b>left to right</b>. They are equal partners; neither goes first.',
        'Ask "<b>Any + or −?</b>" Do them <b>left to right</b>. Also equal partners.',
        'Do <b>one operation per line</b> and rewrite the whole calculation each time. Slow and steady gets it right.',
      ],
      examples: [
        { q: '3 + 4 × 2',
          visual: `<svg viewBox="0 0 360 84" width="360" height="84" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="18" font-weight="700">
            ${[['DM','#FFE98A','#4A3B48',['3 + ','4 × 2',''],'× is higher than +'],['AS','#A9D8F5','#2A6FA5',['','3 + 8',''],'now the +'],['','','#2FA97A',['','11',''],'']].map(([L,bg,c,[a,hi,b],note],i)=>{const y=26+i*28;return `${L?`<rect x="10" y="${y-18}" width="36" height="24" rx="6" fill="${bg}"/><text x="28" y="${y}" text-anchor="middle" font-size="14" fill="#4A3B48">${L}</text>`:''}<text x="60" y="${y}" fill="#4A3B48">${a}<tspan fill="${c}" text-decoration="underline">${hi}</tspan>${b}</text><text x="350" y="${y}" text-anchor="end" font-size="12" fill="${c}">${note}</text>`;}).join('')}
          </svg>`,
          working: ['<i>Picture:</i> the + and the × are both on the ladder. Which one stands higher?', '1. Any brackets? <b>No.</b> Any exponents? <b>No.</b>', '2. Any × or ÷? <b>Yes</b>, 4 × 2 — that rung is higher than +, so it goes first: 4 × 2 = 8', '3. Now the +: 3 + 8 = 11'], a: '11' },
        { q: '10 − 4 + 2', working: ['<i>Picture:</i> − and + stand on the <b>same</b> rung of the ladder, so it is a tie.', '1. Any brackets, exponents, × or ÷? <b>No.</b>', '2. Only + and −. Is it a tie? <b>Yes</b>, so I work <b>left to right</b>.', '3. 10 − 4 = 6 first (it is on the left).', '4. 6 + 2 = 8'], a: '8 &nbsp;(not 4!)' },
        { q: '(8 − 3) × 4 + 10 ÷ 2',
          visual: `<svg viewBox="0 0 360 168" width="360" height="168" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="16" font-weight="700">
            ${[['B','#F9A8C9','#E0568C',['','(8 − 3)',' × 4 + 10 ÷ 2'],'B first'],['DM','#FFE98A','#4A3B48',['','5 × 4',' + 10 ÷ 2'],'tie: left first'],['DM','#FFE98A','#4A3B48',['20 + ','10 ÷ 2',''],'then the ÷'],['AS','#A9D8F5','#2A6FA5',['','20 + 5',''],'last: the +'],['','','#2FA97A',['','25',''],'']].map(([L,bg,c,[a,hi,b],note],i)=>{const y=26+i*28;return `${L?`<rect x="10" y="${y-18}" width="36" height="24" rx="6" fill="${bg}"/><text x="28" y="${y}" text-anchor="middle" font-size="14" fill="#4A3B48">${L}</text>`:''}<text x="60" y="${y}" fill="#4A3B48">${a}<tspan fill="${c}" text-decoration="underline">${hi}</tspan>${b}</text><text x="350" y="${y}" text-anchor="end" font-size="12" fill="${c}">${note}</text>`;}).join('')}
          </svg>`,
          working: ['<i>Picture:</i> four operations are on the ladder. I climb down one rung at a time.', '1. Any brackets? <b>Yes</b>, (8 − 3) is on the top rung: 8 − 3 = 5 &nbsp;→&nbsp; 5 × 4 + 10 ÷ 2', '2. Any exponents? <b>No.</b>', '3. Any × or ÷? <b>Yes</b>, two of them — a tie, so left first: 5 × 4 = 20 &nbsp;→&nbsp; 20 + 10 ÷ 2', '4. Still a ÷: 10 ÷ 2 = 5 &nbsp;→&nbsp; 20 + 5', '5. Bottom rung, the +: 20 + 5 = 25'], a: '25' },
        { q: '2 + 3² × (10 − 4)',
          visual: `<svg viewBox="0 0 360 168" width="360" height="168" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="16" font-weight="700">
            ${[['B','#F9A8C9','#E0568C',['2 + 3² × ','(10 − 4)',''],'B first'],['E','#FFC79A','#4A3B48',['2 + ','3²',' × 6'],'E next'],['DM','#FFE98A','#4A3B48',['2 + ','9 × 6',''],'then the ×'],['AS','#A9D8F5','#2A6FA5',['','2 + 54',''],'last: the +'],['','','#2FA97A',['','56',''],'']].map(([L,bg,c,[a,hi,b],note],i)=>{const y=26+i*28;return `${L?`<rect x="10" y="${y-18}" width="36" height="24" rx="6" fill="${bg}"/><text x="28" y="${y}" text-anchor="middle" font-size="14" fill="#4A3B48">${L}</text>`:''}<text x="60" y="${y}" fill="#4A3B48">${a}<tspan fill="${c}" text-decoration="underline">${hi}</tspan>${b}</text><text x="350" y="${y}" text-anchor="end" font-size="12" fill="${c}">${note}</text>`;}).join('')}
          </svg>`,
          working: ['<i>Picture:</i> brackets on the top rung, then the exponent one rung down, then ×, then +.', '1. Any brackets? <b>Yes</b>: 10 − 4 = 6 &nbsp;→&nbsp; 2 + 3² × 6', '2. Any exponents? <b>Yes</b>, 3² means 3 × 3 = 9 &nbsp;→&nbsp; 2 + 9 × 6', '3. Any × or ÷? <b>Yes</b>: 9 × 6 = 54 &nbsp;→&nbsp; 2 + 54', '4. Bottom rung: 2 + 54 = 56'], a: '56' },
        { q: '24 ÷ (2 × 3) − 1', working: ['<i>Picture:</i> the × is <b>inside</b> brackets, so it is lifted up to the top rung.', '1. Any brackets? <b>Yes</b>: 2 × 3 = 6 &nbsp;→&nbsp; 24 ÷ 6 − 1', '2. Any exponents? <b>No.</b> Any × or ÷? <b>Yes</b>: 24 ÷ 6 = 4 &nbsp;→&nbsp; 4 − 1', '3. Bottom rung: 4 − 1 = 3'], a: '3' },
        { q: 'At the school canteen Harper buys 3 pies at $4 each and 2 juices at $3 each. Write one calculation for the total and work it out.', working: ['<i>Picture:</i> two piles of money — the pies pile and the juices pile — then add the piles.', '1. Write it as one line: 3 × 4 + 2 × 3', '2. Any brackets or exponents? <b>No.</b> Any ×? <b>Yes</b>, two — left first: 3 × 4 = 12 &nbsp;→&nbsp; 12 + 2 × 3', '3. Next ×: 2 × 3 = 6 &nbsp;→&nbsp; 12 + 6', '4. Bottom rung: 12 + 6 = 18'], a: '$18' },
      ],
      tips: [
        '<b>BEDMAS</b>: <b>B</b>rackets, <b>E</b>xponents, <b>D</b>ivision & <b>M</b>ultiplication (left to right), <b>A</b>ddition & <b>S</b>ubtraction (left to right).',
        'D and M are a tie, and A and S are a tie. 10 − 4 + 2 = 8 (left to right), <b>not</b> 4.',
        'Underline or circle the part you are doing next. Only change that part; copy everything else exactly.',
        'A negative inside brackets is fine: (5 − 9) = −4, and (−4) × 3 = −12. Squaring a negative gives a positive: (−3)² = 9.',
      ],
    },
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
