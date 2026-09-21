/* Harper Learning — random helpers. Global namespace: HL */
window.HL = window.HL || {};
(function (HL) {
  const R = {};
  /** integer in [a, b] inclusive */
  R.int = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  /** random element */
  R.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  /** shuffled copy */
  R.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  /** true with probability p */
  R.chance = (p) => Math.random() < p;
  /** random non-zero integer in [-n, n] */
  R.nz = (n) => { let v = 0; while (v === 0) v = R.int(-n, n); return v; };
  /** random multiple of step in [a,b] */
  R.step = (a, b, step) => a + step * R.int(0, Math.floor((b - a) / step));
  /** random decimal with dp decimal places in [a,b] */
  R.dec = (a, b, dp) => { const f = Math.pow(10, dp); return R.int(Math.round(a * f), Math.round(b * f)) / f; };
  /** pick n distinct elements */
  R.sample = (arr, n) => R.shuffle(arr).slice(0, n);
  /** two different ints in range */
  R.pair = (a, b) => { const x = R.int(a, b); let y = R.int(a, b); while (y === x) y = R.int(a, b); return [x, y]; };
  HL.rng = R;
})(window.HL);
