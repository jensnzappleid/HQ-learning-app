/* Harper Learning — marking. HL.mark(question, rawInput) => { ok: boolean, empty?: boolean, note?: string } */
window.HL = window.HL || {};
(function (HL) {
  const N = HL.num;
  const normText = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!]+$/, '').replace(/−|–/g, '-');
  HL.mark = function (q, input) {
    const a = q.answer;
    if (a.type === 'choice') {
      if (input == null || input === '') return { ok: false, empty: true };
      return { ok: Number(input) === Number(a.value) };
    }
    const raw = String(input == null ? '' : input).trim();
    if (!raw) return { ok: false, empty: true };
    if (a.type === 'number') {
      const v = N.parseNumber(raw);
      if (v == null) return { ok: false, note: 'Type a number (you can use / for fractions).' };
      const tol = a.tolerance != null ? a.tolerance : 1e-6;
      return { ok: Math.abs(v - a.value) <= tol + 1e-9 };
    }
    if (a.type === 'fraction') {
      const f = N.parseFraction(raw);
      if (!f) return { ok: false, note: 'Write a fraction like 3/4 or 1 1/2.' };
      const target = N.simplify(a.value.n, a.value.d);
      const given = N.simplify(f.n, f.d);
      const equal = given.n === target.n && given.d === target.d;
      if (!equal) return { ok: false };
      if (f.decimal) return { ok: false, note: 'Correct value — but write it as a fraction.' };
      if (!a.allowUnsimplified && N.gcd(f.n, f.d) !== 1) {
        return { ok: false, note: 'Right value! Now simplify it (divide top and bottom by the same number).' };
      }
      return { ok: true };
    }
    if (a.type === 'text') {
      const g = normText(raw);
      const targets = [a.value].concat(a.accept || []).map(normText);
      return { ok: targets.includes(g) };
    }
    return { ok: false };
  };
  /** the same lenient number parsing + tolerance the main answer box uses, for checking one
   *  intermediate working-out step against its expected value. */
  HL.mark.checkStep = function (raw, expected, tolerance) {
    const r = String(raw == null ? '' : raw).trim();
    if (!r) return { ok: false, empty: true };
    const v = N.parseNumber(r);
    if (v == null) return { ok: false, note: 'Type a number.' };
    const tol = tolerance != null ? tolerance : 1e-6;
    return { ok: Math.abs(v - expected) <= tol + 1e-9 };
  };
  /** she types the unit herself for a working-out step (m vs m², m vs cm) instead of it being
   *  shown — "²" has no easy key, so "m2" and "m²" are treated the same. */
  HL.mark.checkUnit = function (raw, expected) {
    const norm = (s) => String(s || '').trim().toLowerCase().replace(/²/g, '2').replace(/\s+/g, '');
    const r = norm(raw);
    if (!r) return { ok: false, empty: true };
    return { ok: r === norm(expected) };
  };
})(window.HL);
