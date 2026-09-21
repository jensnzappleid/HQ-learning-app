/* Harper Learning — the money box. HL.piggyBank({size, coins, alt}) and HL.coin(i, size).
 * The piggy itself is the picture Harper's parent chose, embedded as a data URI by
 * scripts/embed-image.js (js/art/piggy-image.js) so it survives the single-file build and
 * works offline. HL.coin is still drawn, for the prize list. */
window.HL = window.HL || {};
(function (HL) {
  const GOLD = { face: '#FFD34D', edge: '#F0A81E', shine: '#FFF0B8' };
  const SILVER = { face: '#DCE4EC', edge: '#A8B4C2', shine: '#F4F8FB' };
  const PINK = '#F9B2CA', LINE = '#E8799F', DEEP = '#F291AE', DARK = '#3D2B33';

  /** one coin drawn around (0,0) */
  const coinSvg = (i, r = 10) => {
    const c = i % 3 === 2 ? SILVER : GOLD;
    return `<g><ellipse cx="0" cy="2" rx="${r}" ry="${r * 0.92}" fill="${c.edge}"/>
      <circle cx="0" cy="0" r="${r}" fill="${c.face}" stroke="${c.edge}" stroke-width="${r * 0.16}"/>
      <ellipse cx="${-r * 0.32}" cy="${-r * 0.34}" rx="${r * 0.24}" ry="${r * 0.18}" fill="${c.shine}" opacity=".95"/></g>`;
  };
  HL.coin = (i = 0, size = 22) => `<svg class="coin" width="${size}" height="${size}" viewBox="-13 -13 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${coinSvg(i, 11)}</svg>`;

  /** The money box: the piggy bank picture Harper's parent chose. */
  HL.piggyBank = function (opts = {}) {
    const size = opts.size || 130;
    const w = 420, h = 296;                                  // the picture's own proportions
    if (!HL.piggyImage) return '';
    return `<img class="piggy" src="${HL.piggyImage}" width="${Math.round(size)}" height="${Math.round(size * h / w)}" alt="${opts.alt || 'money box'}" draggable="false">`;
  };
})(window.HL);
