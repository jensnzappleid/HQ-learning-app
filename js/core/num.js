/* Harper Learning — number / fraction / formatting helpers */
window.HL = window.HL || {};
(function (HL) {
  const N = {};
  N.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  N.lcm = (a, b) => Math.abs(a * b) / N.gcd(a, b);
  /** round to dp decimal places, avoiding float noise */
  N.round = (x, dp = 2) => { const f = Math.pow(10, dp); return Math.round((x + Number.EPSILON) * f) / f; };
  /** simplify fraction -> {n, d} with d > 0 */
  N.simplify = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = N.gcd(n, d); return { n: n / g, d: d / g }; };
  /** fraction -> HTML (stacked). whole part optional: N.fracHtml(7,4,{mixed:true}) => 1 3/4 */
  N.fracHtml = (n, d, opts = {}) => {
    if (d === 1) return `<span class="num">${n}</span>`;
    if (opts.mixed && Math.abs(n) >= d) {
      const w = Math.trunc(n / d), r = Math.abs(n % d);
      if (r === 0) return `<span class="num">${w}</span>`;
      return `<span class="mixed"><span class="num">${w}</span>${N.fracHtml(r, d)}</span>`;
    }
    const neg = n < 0 ? '−' : '';
    return `<span class="frac">${neg}<span class="frac-n">${Math.abs(n)}</span><span class="frac-d">${d}</span></span>`;
  };
  /** fraction -> plain text "3/4" or "1 3/4" */
  N.fracText = (n, d, mixed = false) => {
    if (d === 1) return String(n);
    if (mixed && Math.abs(n) >= d) { const w = Math.trunc(n / d), r = Math.abs(n % d); return r === 0 ? String(w) : `${w} ${r}/${d}`; }
    return `${n}/${d}`;
  };
  /** money: N.money(12.5) => "$12.50" */
  N.money = (x) => { const neg = x < 0 ? '−' : ''; return `${neg}$${Math.abs(N.round(x, 2)).toFixed(2)}`; };
  /** format number nicely (no float noise, thousands separators for big ints) */
  N.fmt = (x, dp) => {
    if (typeof dp === 'number') return N.round(x, dp).toFixed(dp).replace(/\.?0+$/, (m) => m.includes('.') && dp > 0 ? '' : m);
    const r = N.round(x, 6);
    if (Number.isInteger(r) && Math.abs(r) >= 10000) return r.toLocaleString('en-NZ');
    return String(r).replace(/^-/, '−');
  };
  /** superscript exponent html */
  N.pow = (base, exp) => `${base}<sup>${exp}</sup>`;
  /** degrees */
  N.deg = (x) => `${x}°`;
  /** pluralise */
  N.plural = (n, word, pl) => `${n} ${n === 1 ? word : (pl || word + 's')}`;
  /**
   * Parse a student's typed answer into a number, or null.
   * Accepts: "12", "-3", "−3", "3.5", "1,250", "$4.50", "45%", "3/4", "1 3/4", "2 1/2 cm", "7 cm²"
   */
  N.parseNumber = (s) => {
    if (s == null) return null;
    let t = String(s).trim().toLowerCase();
    if (!t) return null;
    t = t.replace(/−|–|—/g, '-').replace(/,/g, '').replace(/\$/g, '').replace(/%/g, '');
    t = t.replace(/[a-z°²³]+\.?$/g, '').trim(); // strip trailing units
    t = t.replace(/^[a-z]+\s*=\s*/, ''); // "x = 5"
    let m = t.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) { const w = +m[2], n = +m[3], d = +m[4]; if (!d) return null; const v = w + n / d; return m[1] ? -v : v; }
    m = t.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
    if (m) { const d = +m[2]; if (!d) return null; return +m[1] / d; }
    m = t.match(/^-?\d*\.?\d+$/);
    if (m) return +t;
    return null;
  };
  /** Parse "3/4" or "1 3/4" or "2" into {n,d} (unsimplified), or null */
  N.parseFraction = (s) => {
    if (s == null) return null;
    let t = String(s).trim().replace(/−|–/g, '-').replace(/\s+/g, ' ');
    let m = t.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
    if (m) { const d = +m[4]; if (!d) return null; let n = (+m[2]) * d + (+m[3]); if (m[1]) n = -n; return { n, d, mixed: true }; }
    m = t.match(/^(-?\d+)\/(-?\d+)$/);
    if (m) { const d = +m[2]; if (!d) return null; return { n: +m[1], d }; }
    m = t.match(/^-?\d+$/);
    if (m) return { n: +t, d: 1 };
    m = t.match(/^-?\d*\.\d+$/);
    if (m) { const dp = t.split('.')[1].length; const f = Math.pow(10, dp); return { n: Math.round(+t * f), d: f, decimal: true }; }
    return null;
  };
  HL.num = N;
})(window.HL);
