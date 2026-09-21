/* Topic: Volume & capacity — cuboids, cubes, triangular prisms, cm³ ↔ mL ↔ L. */
(function (HL) {
  const R = HL.rng, N = HL.num;
  const numAns = (value, unit) => Number.isInteger(value) ? { type: 'number', value, unit } : { type: 'number', value, unit, tolerance: 0.001 };
  const INK = '#4A3B48', ROSE = '#E0568C';
  const SVG = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto"><style>text{font-family:system-ui,sans-serif;font-size:15px;fill:#4A3B48}</style>${inner}<text x="${w - 4}" y="${h - 4}" text-anchor="end" font-size="12" fill="#888">not to scale</text></svg>`;
  const T = (x, y, s, opt = '') => `<text x="${x}" y="${y}" ${opt}>${s}</text>`;
  const u = (x, unit) => `${N.fmt(x)} ${unit}`;
  /** net of a cube: a cross of 6 identical squares */
  function cubeNetSvg(s, unit) {
    const c = 42, x0 = 66, y0 = 22;
    const cells = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
    const inner = cells.map(([cx, cy], i) => `<rect x="${x0 + cx * c}" y="${y0 + cy * c}" width="${c}" height="${c}" fill="#FFC79A" stroke="${INK}" stroke-width="2"/>`
      + T(x0 + cx * c + c / 2, y0 + cy * c + c / 2 + 5, String(i + 1), 'text-anchor="middle" style="font-size:13px;fill:#9A6E44"')).join('')
      + T(150, y0 + 3 * c + 26, `net: 6 faces, each ${N.fmt(s)} × ${N.fmt(s)} ${unit}`, 'text-anchor="middle" style="font-size:13px"');
    return SVG(320, 200, inner);
  }
  /** net of a triangular prism: 2 triangle ends + a band of 3 rectangles */
  function prismNetSvg(b, h, hyp, L, unit) {
    const k = Math.min(226 / (b + h + hyp), 148 / (2 * h + L));
    const bw = b * k, hw = h * k, yw = hyp * k, bandH = L * k, triH = h * k;
    const netW = bw + hw + yw;
    const x0 = Math.round((320 - netW) / 2), y0 = 22 + triH;
    const H = Math.round(y0 + bandH + triH + 32);
    const inner = `<polygon points="${x0},${y0} ${x0 + bw},${y0} ${x0},${y0 - triH}" fill="#A6E3B8" stroke="${INK}" stroke-width="2"/>`
      + `<polygon points="${x0},${y0 + bandH} ${x0 + bw},${y0 + bandH} ${x0},${y0 + bandH + triH}" fill="#A6E3B8" stroke="${INK}" stroke-width="2"/>`
      + `<rect x="${x0}" y="${y0}" width="${bw}" height="${bandH}" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>`
      + `<rect x="${x0 + bw}" y="${y0}" width="${hw}" height="${bandH}" fill="#D6ECFA" stroke="${INK}" stroke-width="2"/>`
      + `<rect x="${x0 + bw + hw}" y="${y0}" width="${yw}" height="${bandH}" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>`
      + T(x0 - 6, y0 - triH / 2, 'end', 'text-anchor="end" style="font-size:12px"')
      + T(x0 - 6, y0 + bandH + triH / 2, 'end', 'text-anchor="end" style="font-size:12px"')
      + T(x0 + bw / 2, y0 + bandH / 2 + 5, N.fmt(b), 'text-anchor="middle" style="font-size:13px"')
      + T(x0 + bw + hw / 2, y0 + bandH / 2 + 5, N.fmt(h), 'text-anchor="middle" style="font-size:13px"')
      + T(x0 + bw + hw + yw / 2, y0 + bandH / 2 + 5, N.fmt(hyp), 'text-anchor="middle" style="font-size:13px"')
      + T(160, H - 22, `the 3 rectangles are each ${N.fmt(L)} ${unit} long`, 'text-anchor="middle" style="font-size:13px"');
    return SVG(320, H, inner);
  }
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]];

  /** isometric-ish cuboid. Front face at (x,y) size fw×fh, depth offset (dx,-dy). Labels l (front bottom), w (depth edge), h (left edge). */
  function cuboidParts(x, y, fw, fh, dx, dy, fills) {
    const front = `<rect x="${x}" y="${y - fh}" width="${fw}" height="${fh}" fill="${fills[0]}" stroke="${INK}" stroke-width="2"/>`;
    const top = `<polygon points="${x},${y - fh} ${x + dx},${y - fh - dy} ${x + fw + dx},${y - fh - dy} ${x + fw},${y - fh}" fill="${fills[1]}" stroke="${INK}" stroke-width="2"/>`;
    const side = `<polygon points="${x + fw},${y - fh} ${x + fw + dx},${y - fh - dy} ${x + fw + dx},${y - dy} ${x + fw},${y}" fill="${fills[2]}" stroke="${INK}" stroke-width="2"/>`;
    return front + top + side;
  }
  function cuboidSvg(l, w, h, unit, cube) {
    const x = 50, y = 170, fw = 150, fh = 90, dx = 55, dy = 38;
    const inner = cuboidParts(x, y, fw, fh, dx, dy, ['#FFC79A', '#FFE3C7', '#F5A96A'])
      + T(x + fw / 2, y + 22, u(l, unit), 'text-anchor="middle"')
      + (cube ? '' : T(x - 8, y - fh / 2 + 5, u(h, unit), 'text-anchor="end"') + T(x + fw + dx / 2 + 8, y - dy / 2 + 12, u(w, unit)));
    return SVG(320, 200, inner);
  }
  function prismSvg(b, h, L, unit) {
    // triangular prism: front triangle, visible right face, hidden edges dashed
    const dx = 70, dy = 40;
    const f = [[40, 170], [170, 170], [105, 80]];
    const k = f.map(([px, py]) => [px + dx, py - dy]);
    const P = (a) => a.map((p) => p.join(',')).join(' ');
    const dashed = (a, c) => `<line x1="${a[0]}" y1="${a[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#9A8FA0" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    const inner = dashed(f[0], k[0]) + dashed(k[0], k[1]) + dashed(k[0], k[2])
      + `<polygon points="${f[1]},${k[1]},${k[2]},${f[2]}" fill="#CFF0DA" stroke="${INK}" stroke-width="2"/>`
      + `<polygon points="${P(f)}" fill="#A6E3B8" stroke="${INK}" stroke-width="2"/>`
      + `<line x1="${f[2][0]}" y1="${f[2][1]}" x2="${f[2][0]}" y2="170" stroke="${ROSE}" stroke-width="2" stroke-dasharray="6 4"/>`
      + `<path d="M${f[2][0] + 12} 170 L${f[2][0] + 12} 158 L${f[2][0]} 158" fill="none" stroke="${INK}" stroke-width="1.5"/>`
      + T(105, 192, u(b, unit), 'text-anchor="middle"')
      + T(112, 150, u(h, unit))
      + T(f[1][0] + dx / 2 + 6, f[1][1] - dy / 2 + 14, u(L, unit));
    return SVG(320, 205, inner);
  }
  function compositeSvg(l1, w, h1, l2, h2, unit) {
    // bottom cuboid l1 × w × h1, top cuboid l2 × w × h2 sitting on the left end
    const x = 62, y = 175, dx = 50, dy = 34;
    const s = Math.min(150 / l1, 100 / (h1 + h2));
    const fw1 = l1 * s, fh1 = h1 * s, fw2 = l2 * s, fh2 = h2 * s;
    const inner = cuboidParts(x, y, fw1, fh1, dx, dy, ['#A9D8F5', '#D6ECFA', '#7FBDE8'])
      + cuboidParts(x, y - fh1, fw2, fh2, dx, dy, ['#C9B8F2', '#E6DDF9', '#A995E6'])
      + T(x + fw1 / 2, y + 22, u(l1, unit), 'text-anchor="middle"')
      + T(x - 8, y - fh1 / 2 + 5, u(h1, unit), 'text-anchor="end"')
      + T(x - 8, y - fh1 - fh2 / 2 + 5, u(h2, unit), 'text-anchor="end"')
      + T(x + fw2 / 2, y - fh1 - fh2 - dy - 6, u(l2, unit), 'text-anchor="middle"')
      + T(x + fw1 + dx / 2 + 8, y - dy / 2 + 12, u(w, unit));
    return SVG(320, 205, inner);
  }

  function calc(level) {
    const unit = R.pick(['cm', 'cm', 'm', 'mm']);
    const t = level === 1 ? R.pick(['cuboid', 'cuboid', 'cube', 'cuboid', 'saCube'])
      : level === 2 ? R.pick(['cuboid', 'prism', 'prism', 'cube', 'toMl', 'saCuboid', 'saCube', 'saCuboid', 'saPrism'])
      : R.pick(['missing', 'toL', 'composite', 'prism3', 'missing', 'composite', 'm3', 'saPrism', 'saCuboid', 'saPrism']);
    if (t === 'saCube') {
      const s = level === 1 ? R.int(2, 8) : R.int(2, 12);
      const face = s * s, SA = 6 * face;
      return {
        prompt: `Find the surface area of a cube with edges of ${s} ${unit}. Give your answer in ${unit}².`,
        visual: cubeNetSvg(s, unit),
        answer: numAns(SA, unit + '²'),
        hint: 'Unfold the cube: it is 6 identical squares. Find one face, then multiply by 6.',
        working: [`One face is a square: ${s} × ${s} = ${face} ${unit}².`, `A cube has 6 faces the same.`, `6 × ${face} = ${N.fmt(SA)}.`, `Surface area = <b>${N.fmt(SA)} ${unit}²</b>.`],
        finalAnswer: `${N.fmt(SA)} ${unit}²`, skill: 'surface-area',
      };
    }
    if (t === 'saCuboid') {
      const l = level === 3 ? R.int(4, 15) : R.int(3, 10), w = level === 3 ? R.int(3, 12) : R.int(2, 8), h = level === 3 ? R.int(2, 10) : R.int(2, 7);
      const SA = 2 * (l * w + l * h + w * h);
      return {
        prompt: `Find the surface area of this cuboid. Give your answer in ${unit}².`,
        visual: cuboidSvg(l, w, h, unit),
        answer: numAns(SA, unit + '²'),
        hint: 'A cuboid has 6 faces in 3 matching pairs. Surface area = 2 × (lw + lh + wh).',
        working: [
          `Top and bottom: ${l} × ${w} = ${N.fmt(l * w)} ${unit}² each.`,
          `Front and back: ${l} × ${h} = ${N.fmt(l * h)} ${unit}² each.`,
          `The two ends: ${w} × ${h} = ${N.fmt(w * h)} ${unit}² each.`,
          `SA = 2 × (${N.fmt(l * w)} + ${N.fmt(l * h)} + ${N.fmt(w * h)}) = 2 × ${N.fmt(l * w + l * h + w * h)} = ${N.fmt(SA)}.`,
          `Surface area = <b>${N.fmt(SA)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(SA)} ${unit}²`, skill: 'surface-area',
      };
    }
    if (t === 'saPrism') {
      const [b, h, hyp] = level === 2 ? R.pick(TRIPLES.slice(0, 2)) : R.pick(TRIPLES);
      const L = level === 2 ? R.int(3, 10) : R.int(5, 20);
      const ends = b * h, sides = (b + h + hyp) * L, SA = ends + sides;
      return {
        prompt: `A triangular prism is ${L} ${unit} long. Its end is a right-angled triangle with sides ${b} ${unit}, ${h} ${unit} and ${hyp} ${unit}. Find the surface area in ${unit}².`,
        visual: prismNetSvg(b, h, hyp, L, unit),
        answer: numAns(SA, unit + '²'),
        hint: 'Unfold it: 2 triangle ends + 3 rectangles. Each rectangle is one triangle side × the length of the prism.',
        working: [
          `One triangle end: ½ × ${b} × ${h} = ${N.fmt(b * h / 2)} ${unit}². Two ends: ${N.fmt(ends)} ${unit}².`,
          `The 3 rectangles are ${b}, ${h} and ${hyp} wide, and all ${L} long.`,
          `Rectangles: (${b} + ${h} + ${hyp}) × ${L} = ${b + h + hyp} × ${L} = ${N.fmt(sides)} ${unit}².`,
          `SA = ${N.fmt(ends)} + ${N.fmt(sides)} = ${N.fmt(SA)}.`,
          `Surface area = <b>${N.fmt(SA)} ${unit}²</b>.`,
        ],
        finalAnswer: `${N.fmt(SA)} ${unit}²`, skill: 'surface-area',
      };
    }
    if (t === 'cuboid') {
      const l = level === 1 ? R.int(2, 6) : R.int(3, 12), w = level === 1 ? R.int(2, 5) : R.int(2, 10), h = level === 1 ? R.int(1, 5) : (R.chance(0.3) ? R.int(2, 8) + 0.5 : R.int(2, 9));
      const V = N.round(l * w * h, 2);
      return {
        prompt: `Find the volume of this cuboid. Give your answer in ${unit}³.`,
        visual: cuboidSvg(l, w, h, unit),
        answer: numAns(V, unit + '³'),
        hint: 'Volume of a cuboid = length × width × height.',
        working: [`V = l × w × h.`, `${l} × ${w} × ${N.fmt(h)} = ${l * w} × ${N.fmt(h)} = ${N.fmt(V)}.`, `Volume = <b>${N.fmt(V)} ${unit}³</b>.`],
        finalAnswer: `${N.fmt(V)} ${unit}³`, skill: 'cuboid',
      };
    }
    if (t === 'cube') {
      const s = level === 1 ? R.int(2, 5) : R.int(2, 10);
      const V = s * s * s;
      return {
        prompt: `Find the volume of this cube (all edges are ${s} ${unit}). Give your answer in ${unit}³.`,
        visual: cuboidSvg(s, s, s, unit, true),
        answer: numAns(V, unit + '³'),
        hint: 'A cube has equal edges: side × side × side.',
        working: [`V = s × s × s = ${s} × ${s} × ${s}.`, `${s} × ${s} = ${s * s}, then ${s * s} × ${s} = ${V}.`, `Volume = <b>${V} ${unit}³</b>.`],
        finalAnswer: `${V} ${unit}³`, skill: 'cube',
      };
    }
    if (t === 'prism' || t === 'prism3') {
      const b = t === 'prism3' ? R.int(4, 14) : R.int(2, 10), h = t === 'prism3' ? R.int(3, 12) : R.int(2, 8), L = t === 'prism3' ? R.int(5, 20) : R.int(3, 12);
      const A = b * h / 2, V = N.round(A * L, 2);
      return {
        prompt: `Find the volume of this triangular prism. Give your answer in ${unit}³.`,
        visual: prismSvg(b, h, L, unit),
        answer: numAns(V, unit + '³'),
        hint: 'Volume of a prism = area of the end face × length. The end is a triangle: ½ × base × height.',
        working: [`End area = ½ × ${b} × ${h} = ${N.fmt(A)} ${unit}².`, `Volume = end area × length = ${N.fmt(A)} × ${L} = ${N.fmt(V)}.`, `Volume = <b>${N.fmt(V)} ${unit}³</b>.`],
        finalAnswer: `${N.fmt(V)} ${unit}³`, skill: 'prism',
      };
    }
    if (t === 'toMl') {
      const l = R.int(3, 12), w = R.int(2, 10), h = R.int(2, 10);
      const V = l * w * h;
      return {
        prompt: `A container is a cuboid ${l} cm by ${w} cm by ${h} cm. How many millilitres of water does it hold? (1 cm³ = 1 mL)`,
        visual: cuboidSvg(l, w, h, 'cm'),
        answer: numAns(V, 'mL'),
        hint: 'Find the volume in cm³ first. Every cm³ holds 1 mL.',
        working: [`V = ${l} × ${w} × ${h} = ${N.fmt(V)} cm³.`, `1 cm³ = 1 mL, so it holds <b>${N.fmt(V)} mL</b>.`],
        finalAnswer: `${N.fmt(V)} mL`, skill: 'capacity',
      };
    }
    if (t === 'toL') {
      const l = R.pick([10, 20, 25, 30, 40, 50]), w = R.pick([10, 20, 25, 30, 15]), h = R.pick([10, 20, 30, 40, 12, 24]);
      const V = l * w * h, L = N.round(V / 1000, 3);
      return {
        prompt: `A tank is a cuboid ${l} cm by ${w} cm by ${h} cm. How many litres does it hold? (1000 cm³ = 1 L)`,
        visual: cuboidSvg(l, w, h, 'cm'),
        answer: numAns(L, 'L'),
        hint: 'Volume in cm³ = mL. Then divide by 1000 to get litres.',
        working: [`V = ${l} × ${w} × ${h} = ${N.fmt(V)} cm³.`, `${N.fmt(V)} cm³ = ${N.fmt(V)} mL.`, `${N.fmt(V)} ÷ 1000 = ${N.fmt(L)} L.`, `Capacity = <b>${N.fmt(L)} L</b>.`],
        finalAnswer: `${N.fmt(L)} L`, skill: 'capacity',
      };
    }
    if (t === 'm3') {
      const m3 = R.pick([2, 3, 5, 1.5, 2.5, 4, 10, 0.5]);
      const toL = R.chance(0.6);
      return toL ? {
        prompt: `A skip bin has a volume of ${N.fmt(m3)} m³. How many litres is that? (1 m³ = 1000 L)`,
        answer: numAns(m3 * 1000, 'L'),
        hint: '1 m³ = 1000 L, so multiply by 1000.',
        working: [`${N.fmt(m3)} × 1000 = ${N.fmt(m3 * 1000)}.`, `<b>${N.fmt(m3 * 1000)} L</b>.`],
        finalAnswer: `${N.fmt(m3 * 1000)} L`, skill: 'capacity',
      } : {
        prompt: `Convert ${N.fmt(m3 * 1000)} L to cubic metres. (1 m³ = 1000 L)`,
        answer: numAns(m3, 'm³'),
        hint: '1000 L = 1 m³, so divide by 1000.',
        working: [`${N.fmt(m3 * 1000)} ÷ 1000 = ${N.fmt(m3)}.`, `<b>${N.fmt(m3)} m³</b>.`],
        finalAnswer: `${N.fmt(m3)} m³`, skill: 'capacity',
      };
    }
    if (t === 'missing') {
      const l = R.int(3, 12), w = R.int(2, 10), h = R.int(2, 12);
      const V = l * w * h;
      return {
        prompt: `A cuboid has a volume of ${N.fmt(V)} ${unit}³. Its length is ${l} ${unit} and its width is ${w} ${unit}. What is its height?`,
        answer: numAns(h, unit),
        hint: 'Volume = l × w × h. Work out l × w first, then divide the volume by it.',
        working: [`l × w = ${l} × ${w} = ${l * w}.`, `Height = volume ÷ (l × w) = ${N.fmt(V)} ÷ ${l * w} = ${h}.`, `Height = <b>${h} ${unit}</b>.`],
        finalAnswer: `${h} ${unit}`, skill: 'missing',
      };
    }
    // composite: two cuboids sharing width
    const l1 = R.int(8, 14), w = R.int(2, 6), h1 = R.int(2, 5), l2 = R.int(2, l1 - 3), h2 = R.int(2, 5);
    const V1 = l1 * w * h1, V2 = l2 * w * h2, V = V1 + V2;
    return {
      prompt: `This solid is made from two cuboids stacked together. Find its total volume in ${unit}³.`,
      visual: compositeSvg(l1, w, h1, l2, h2, unit),
      answer: numAns(V, unit + '³'),
      hint: 'Find the volume of each cuboid separately, then add them. Both have the same width.',
      working: [`Bottom cuboid: ${l1} × ${w} × ${h1} = ${N.fmt(V1)}.`, `Top cuboid: ${l2} × ${w} × ${h2} = ${N.fmt(V2)}.`, `${N.fmt(V1)} + ${N.fmt(V2)} = ${N.fmt(V)}.`, `Total volume = <b>${N.fmt(V)} ${unit}³</b>.`],
      finalAnswer: `${N.fmt(V)} ${unit}³`, skill: 'composite',
    };
  }

  function word(level) {
    const name = R.pick(['Harper', 'Aroha', 'Mia', 'Liam', 'Tane', 'Ruby']);
    const t = level === 1 ? R.pick(['box1', 'tank1', 'lunch', 'dice', 'blocks1', 'sandpit1'])
      : level === 2 ? R.pick(['tank2', 'pool2', 'box2', 'tent', 'sandpit', 'wrap', 'wrap', 'fill2'])
      : R.pick(['tank3', 'pool3', 'box3', 'garden', 'tank3b', 'paint', 'wrap', 'paint', 'tentWrap', 'tentWrap', 'twoThirds3', 'compare3']);
    switch (t) {
      case 'blocks1': {
        const l = R.int(3, 8), w = R.int(2, 6), h = R.int(2, 5);
        const n = l * w * h;
        return {
          prompt: `${name} builds a solid block of Lego ${l} bricks long, ${w} bricks wide and ${h} bricks high. How many bricks are used altogether?`,
          answer: numAns(n, 'bricks'),
          hint: 'One layer is length × width. Then there are height layers of them.',
          working: [`One layer: ${l} × ${w} = ${l * w} bricks.`, `${h} layers: ${l * w} × ${h} = ${n}.`, `<b>${n} bricks</b>.`],
          finalAnswer: `${n} bricks`,
        };
      }
      case 'sandpit1': {
        const l = R.int(2, 6), w = R.int(1, 4), h = R.int(1, 3);
        return {
          prompt: `A sandpit at the playground is ${l} m long, ${w} m wide and ${h} m deep. What is its volume?`,
          visual: cuboidSvg(l, w, h, 'm'),
          answer: numAns(l * w * h, 'm³'),
          hint: 'Volume = length × width × depth.',
          working: [`${l} × ${w} = ${l * w}.`, `${l * w} × ${h} = ${l * w * h}.`, `Volume = <b>${l * w * h} m³</b>.`],
          finalAnswer: `${l * w * h} m³`,
        };
      }
      case 'fill2': {
        const l = R.pick([30, 40, 50, 60]), w = R.pick([20, 25, 30]), h = R.pick([20, 30, 40]);
        const V = l * w * h, litres = V / 1000;
        const rates = [2, 3, 4, 5, 6, 8].filter((r) => Number.isInteger(litres / r) && litres / r > 1);
        if (!rates.length) return word(2);
        const rate = R.pick(rates), mins = litres / rate;
        return {
          prompt: `${name}'s fish tank is ${l} cm long, ${w} cm wide and ${h} cm high. A hose fills it at ${rate} litres a minute. How many minutes does it take to fill the tank? (1000 cm³ = 1 L)`,
          visual: cuboidSvg(l, w, h, 'cm'),
          answer: numAns(mins, 'minutes'),
          hint: 'Two steps: find the volume in cm³ and change it to litres (÷ 1000), then see how many lots of the hose rate fit in.',
          working: [
            `Volume: ${l} × ${w} × ${h} = ${N.fmt(V)} cm³.`,
            `In litres: ${N.fmt(V)} ÷ 1000 = ${N.fmt(litres)} L.`,
            `Time: ${N.fmt(litres)} ÷ ${rate} = ${N.fmt(mins)}.`,
            `<b>${N.fmt(mins)} minutes</b>.`,
          ],
          finalAnswer: `${N.fmt(mins)} minutes`,
        };
      }
      case 'twoThirds3': {
        const frac = R.pick([[2, 3], [3, 4], [1, 2], [2, 5], [3, 5]]);
        const l = R.pick([30, 40, 50, 60]), w = R.pick([20, 30, 40]), h = R.pick([20, 30, 40, 50]);
        const V = l * w * h, litres = V / 1000;
        const part = litres * frac[0] / frac[1];
        if (!Number.isInteger(part * 100)) return word(3);
        return {
          prompt: `A rainwater tank is ${l} cm long, ${w} cm wide and ${h} cm high. It is filled ${N.fracHtml(frac[0], frac[1])} of the way up. How many litres of water are in it? (1000 cm³ = 1 L)`,
          visual: cuboidSvg(l, w, h, 'cm'),
          answer: numAns(part, 'L'),
          hint: `Find the full tank in litres first, then take ${N.fracHtml(frac[0], frac[1])} of that: divide by ${frac[1]}, then multiply by ${frac[0]}.`,
          working: [
            `Full tank: ${l} × ${w} × ${h} = ${N.fmt(V)} cm³ = ${N.fmt(litres)} L.`,
            `One ${frac[1] === 2 ? 'half' : frac[1] === 3 ? 'third' : frac[1] === 4 ? 'quarter' : 'fifth'}: ${N.fmt(litres)} ÷ ${frac[1]} = ${N.fmt(litres / frac[1])} L.`,
            `${frac[0]} of them: ${N.fmt(litres / frac[1])} × ${frac[0]} = ${N.fmt(part)}.`,
            `<b>${N.fmt(part)} L</b> of water.`,
          ],
          finalAnswer: `${N.fmt(part)} L`,
        };
      }
      case 'compare3': {
        const a = [R.int(10, 30), R.int(10, 25), R.int(5, 20)];
        const b = [R.int(10, 30), R.int(10, 25), R.int(5, 20)];
        const va = a[0] * a[1] * a[2], vb = b[0] * b[1] * b[2];
        if (va === vb) return word(3);
        const choices = ['Box A', 'Box B'];
        const bigger = va > vb ? 'Box A' : 'Box B';
        return {
          prompt: `Box A is ${a[0]} cm by ${a[1]} cm by ${a[2]} cm. Box B is ${b[0]} cm by ${b[1]} cm by ${b[2]} cm. Which box holds more?`,
          answer: { type: 'choice', value: choices.indexOf(bigger), choices },
          hint: 'You cannot tell from the side lengths. Work out both volumes (l × w × h) and compare them.',
          working: [
            `Box A: ${a[0]} × ${a[1]} × ${a[2]} = ${N.fmt(va)} cm³.`,
            `Box B: ${b[0]} × ${b[1]} × ${b[2]} = ${N.fmt(vb)} cm³.`,
            `${N.fmt(Math.max(va, vb))} is bigger than ${N.fmt(Math.min(va, vb))}.`,
            `<b>${bigger}</b> holds more (by ${N.fmt(Math.abs(va - vb))} cm³).`,
          ],
          finalAnswer: bigger,
        };
      }
      case 'box1': {
        const l = R.int(2, 8), w = R.int(2, 6), h = R.int(2, 5);
        return {
          prompt: `A shoebox is ${l} cm long, ${w} cm wide and ${h} cm high. What is its volume?`,
          answer: numAns(l * w * h, 'cm³'),
          hint: 'Volume = length × width × height.',
          working: [`${l} × ${w} × ${h} = ${l * w * h}.`, `Volume = <b>${l * w * h} cm³</b>.`],
          finalAnswer: `${l * w * h} cm³`,
        };
      }
      case 'tank1': {
        const l = R.int(3, 9), w = R.int(2, 6), h = R.int(2, 6);
        return {
          prompt: `A small fish tank is ${l} cm by ${w} cm by ${h} cm on the inside. How many millilitres of water fills it? (1 cm³ = 1 mL)`,
          answer: numAns(l * w * h, 'mL'),
          hint: 'Find the volume in cm³. Each cm³ is 1 mL.',
          working: [`${l} × ${w} × ${h} = ${l * w * h} cm³.`, `= <b>${l * w * h} mL</b>.`],
          finalAnswer: `${l * w * h} mL`,
        };
      }
      case 'lunch': {
        const l = R.int(10, 20), w = R.int(5, 12), h = R.int(3, 8);
        return {
          prompt: `${name}'s lunchbox is ${l} cm long, ${w} cm wide and ${h} cm deep. What is its volume?`,
          answer: numAns(l * w * h, 'cm³'),
          hint: 'Length × width × height.',
          working: [`${l} × ${w} = ${l * w}.`, `${l * w} × ${h} = ${l * w * h}.`, `Volume = <b>${l * w * h} cm³</b>.`],
          finalAnswer: `${l * w * h} cm³`,
        };
      }
      case 'dice': {
        const s = R.int(2, 6);
        return {
          prompt: `A wooden cube has edges of ${s} cm. What is its volume?`,
          answer: numAns(s ** 3, 'cm³'),
          hint: 'A cube is side × side × side.',
          working: [`${s} × ${s} × ${s} = ${s ** 3}.`, `Volume = <b>${s ** 3} cm³</b>.`],
          finalAnswer: `${s ** 3} cm³`,
        };
      }
      case 'wrap': {
        const l = R.int(10, 30), w = R.int(8, 20), h = R.int(5, 15);
        const SA = 2 * (l * w + l * h + w * h);
        return {
          prompt: `${name} is wrapping a present. The box is ${l} cm long, ${w} cm wide and ${h} cm high. What is the smallest area of wrapping paper that would cover the whole box?`,
          visual: cuboidSvg(l, w, h, 'cm'),
          answer: numAns(SA, 'cm²'),
          hint: 'Wrapping paper covers the outside of the box: that is the surface area, 2 × (lw + lh + wh).',
          working: [`lw = ${l} × ${w} = ${N.fmt(l * w)}, lh = ${l} × ${h} = ${N.fmt(l * h)}, wh = ${w} × ${h} = ${N.fmt(w * h)}.`, `Add the three: ${N.fmt(l * w)} + ${N.fmt(l * h)} + ${N.fmt(w * h)} = ${N.fmt(l * w + l * h + w * h)}.`, `Every face has a matching partner, so double it: 2 × ${N.fmt(l * w + l * h + w * h)} = ${N.fmt(SA)}.`, `<b>${N.fmt(SA)} cm²</b> of paper.`],
          finalAnswer: `${N.fmt(SA)} cm²`,
        };
      }
      case 'paint': {
        const l = R.int(2, 8), w = R.int(2, 6), h = R.int(1, 4), cost = R.pick([6, 8, 10, 12, 15]);
        const openTop = R.chance(0.5);
        if (openTop) {
          const SA = l * w + 2 * l * h + 2 * w * h;
          return {
            prompt: `A rectangular water trough is ${l} m long, ${w} m wide and ${h} m deep. It is open at the top. What area has to be painted to cover the base and the four sides?`,
            visual: cuboidSvg(l, w, h, 'm'),
            answer: numAns(SA, 'm²'),
            hint: 'Open at the top means only 5 faces: the base + two long sides + two short sides.',
            working: [`Base: ${l} × ${w} = ${N.fmt(l * w)} m².`, `Two long sides: 2 × (${l} × ${h}) = ${N.fmt(2 * l * h)} m².`, `Two short sides: 2 × (${w} × ${h}) = ${N.fmt(2 * w * h)} m².`, `${N.fmt(l * w)} + ${N.fmt(2 * l * h)} + ${N.fmt(2 * w * h)} = ${N.fmt(SA)}.`, `<b>${N.fmt(SA)} m²</b> to paint.`],
            finalAnswer: `${N.fmt(SA)} m²`,
          };
        }
        const SA = 2 * (l * w + l * h + w * h), total = SA * cost;
        return {
          prompt: `A shipping container is ${l} m long, ${w} m wide and ${h} m high. All six outside faces are painted. Paint costs $${cost} per square metre. What is the total cost?`,
          visual: cuboidSvg(l, w, h, 'm'),
          answer: numAns(total, '$'),
          hint: 'Find the surface area first, 2 × (lw + lh + wh), then multiply by the price per m².',
          working: [`SA = 2 × (${N.fmt(l * w)} + ${N.fmt(l * h)} + ${N.fmt(w * h)}) = 2 × ${N.fmt(l * w + l * h + w * h)} = ${N.fmt(SA)} m².`, `${N.fmt(SA)} × $${cost} = $${N.fmt(total)}.`, `<b>$${N.fmt(total)}</b>.`],
          finalAnswer: `$${N.fmt(total)}`,
        };
      }
      case 'tentWrap': {
        const trip = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
        const b = trip[0], h = trip[1], hyp = trip[2];
        const L = R.int(3, 9);
        const ends = b * h, sides = (b + h + hyp) * L, SA = ends + sides;
        const isTent = R.chance(0.5);
        return {
          prompt: isTent
            ? `${name}'s camping shelter is a triangular prism ${L} m long. Its end is a right-angled triangle with sides ${b} m, ${h} m and ${hyp} m. Canvas covers the two ends and all three long faces. How much canvas is needed?`
            : `A chocolate box is a triangular prism ${L} cm long. Its end is a right-angled triangle with sides ${b} cm, ${h} cm and ${hyp} cm. How much cardboard is needed to make the whole box?`,
          visual: prismNetSvg(b, h, hyp, L, isTent ? 'm' : 'cm'),
          answer: numAns(SA, isTent ? 'm²' : 'cm²'),
          hint: 'Unfold it into its net: 2 triangle ends + 3 rectangles. Each rectangle is one side of the triangle × the length of the prism.',
          working: [
            `One triangle end: ½ × ${b} × ${h} = ${N.fmt(b * h / 2)}. Two ends: ${N.fmt(ends)}.`,
            `The 3 rectangles are ${b}, ${h} and ${hyp} wide, and all ${L} long.`,
            `Rectangles: (${b} + ${h} + ${hyp}) × ${L} = ${b + h + hyp} × ${L} = ${N.fmt(sides)}.`,
            `Total: ${N.fmt(ends)} + ${N.fmt(sides)} = ${N.fmt(SA)}.`,
            `<b>${N.fmt(SA)} ${isTent ? 'm²' : 'cm²'}</b>.`,
          ],
          finalAnswer: `${N.fmt(SA)} ${isTent ? 'm²' : 'cm²'}`,
        };
      }
      case 'tank2': {
        const l = R.pick([30, 40, 50, 60]), w = R.pick([20, 25, 30]), h = R.pick([20, 30, 40, 25]);
        const V = l * w * h, L = N.round(V / 1000, 3);
        return {
          prompt: `${name}'s fish tank is ${l} cm long, ${w} cm wide and ${h} cm high. How many litres of water does it hold when full? (1000 cm³ = 1 L)`,
          answer: numAns(L, 'L'),
          hint: 'Volume in cm³, then ÷ 1000 for litres.',
          working: [`${l} × ${w} × ${h} = ${N.fmt(V)} cm³.`, `${N.fmt(V)} ÷ 1000 = ${N.fmt(L)}.`, `<b>${N.fmt(L)} L</b>.`],
          finalAnswer: `${N.fmt(L)} L`,
        };
      }
      case 'tank3': {
        const l = R.pick([40, 50, 60, 80]), w = R.pick([20, 25, 30, 40]), h = R.pick([30, 40, 50]);
        const fillH = h - R.pick([5, 10]);
        const V = l * w * fillH, L = N.round(V / 1000, 3);
        return {
          prompt: `A fish tank is ${l} cm long and ${w} cm wide. It is filled with water to a depth of ${fillH} cm. How many litres of water are in it? (1000 cm³ = 1 L)`,
          answer: numAns(L, 'L'),
          hint: 'Use the water depth as the height. Volume in cm³ ÷ 1000 = litres.',
          working: [`Water volume = ${l} × ${w} × ${fillH} = ${N.fmt(V)} cm³.`, `${N.fmt(V)} ÷ 1000 = ${N.fmt(L)}.`, `<b>${N.fmt(L)} L</b>.`],
          finalAnswer: `${N.fmt(L)} L`,
        };
      }
      case 'tank3b': {
        const L = R.pick([24, 36, 48, 60, 72, 90, 120]), l = R.pick([40, 60, 50]), w = R.pick([20, 30]);
        const cm3 = L * 1000;
        const h = cm3 / (l * w);
        if (!Number.isInteger(h * 100)) return word(level);
        return {
          prompt: `A tank holds ${L} L when full. Its base is ${l} cm by ${w} cm. How high is the tank? (1 L = 1000 cm³)`,
          answer: numAns(N.round(h, 2), 'cm'),
          hint: 'Change litres to cm³ (× 1000), then divide by the base area (l × w).',
          working: [`${L} L = ${N.fmt(cm3)} cm³.`, `Base area = ${l} × ${w} = ${N.fmt(l * w)} cm².`, `Height = ${N.fmt(cm3)} ÷ ${N.fmt(l * w)} = ${N.fmt(h)}.`, `Height = <b>${N.fmt(h)} cm</b>.`],
          finalAnswer: `${N.fmt(h)} cm`,
        };
      }
      case 'pool2': {
        const l = R.pick([8, 10, 12, 15, 20]), w = R.pick([4, 5, 6, 8]), d = R.pick([1, 1.5, 2, 1.2]);
        const V = N.round(l * w * d, 3);
        return {
          prompt: `A swimming pool is ${l} m long, ${w} m wide and ${N.fmt(d)} m deep. What is its volume in cubic metres?`,
          answer: numAns(V, 'm³'),
          hint: 'Length × width × depth.',
          working: [`${l} × ${w} = ${l * w}.`, `${l * w} × ${N.fmt(d)} = ${N.fmt(V)}.`, `Volume = <b>${N.fmt(V)} m³</b>.`],
          finalAnswer: `${N.fmt(V)} m³`,
        };
      }
      case 'pool3': {
        const l = R.pick([8, 10, 12, 15, 25]), w = R.pick([4, 5, 6, 10]), d = R.pick([1, 1.5, 2, 1.2]);
        const V = N.round(l * w * d, 3), L = V * 1000;
        return {
          prompt: `A swimming pool is ${l} m long, ${w} m wide and ${N.fmt(d)} m deep. How many litres of water does it hold? (1 m³ = 1000 L)`,
          answer: numAns(L, 'L'),
          hint: 'Find the volume in m³ first, then multiply by 1000 for litres.',
          working: [`${l} × ${w} × ${N.fmt(d)} = ${N.fmt(V)} m³.`, `${N.fmt(V)} × 1000 = ${N.fmt(L)} L.`, `<b>${N.fmt(L)} L</b>.`],
          finalAnswer: `${N.fmt(L)} L`,
        };
      }
      case 'box2': {
        const l = R.int(20, 60), w = R.int(15, 40), h = R.int(10, 40);
        return {
          prompt: `A moving box is ${l} cm by ${w} cm by ${h} cm. What is its volume?`,
          answer: numAns(l * w * h, 'cm³'),
          hint: 'Volume = length × width × height.',
          working: [`${l} × ${w} = ${N.fmt(l * w)}.`, `${N.fmt(l * w)} × ${h} = ${N.fmt(l * w * h)}.`, `<b>${N.fmt(l * w * h)} cm³</b>.`],
          finalAnswer: `${N.fmt(l * w * h)} cm³`,
        };
      }
      case 'box3': {
        const s = R.pick([2, 3, 4, 5]);
        const l = s * R.int(3, 8), w = s * R.int(2, 6), h = s * R.int(2, 5);
        const n = (l / s) * (w / s) * (h / s);
        return {
          prompt: `A box is ${l} cm by ${w} cm by ${h} cm. It is packed full of small cubes with ${s} cm edges. How many cubes fit in the box?`,
          answer: numAns(n, 'cubes'),
          hint: 'Divide the box volume by the volume of one cube (or count how many fit along each edge).',
          working: [`Box volume = ${l} × ${w} × ${h} = ${N.fmt(l * w * h)} cm³.`, `One cube = ${s} × ${s} × ${s} = ${s ** 3} cm³.`, `${N.fmt(l * w * h)} ÷ ${s ** 3} = ${N.fmt(n)}.`, `<b>${N.fmt(n)} cubes</b>.`],
          finalAnswer: `${N.fmt(n)} cubes`,
        };
      }
      case 'tent': {
        const b = R.pick([2, 3, 4, 2.5]), h = R.pick([1.5, 2, 1.8, 1.6]), L = R.pick([3, 4, 5, 2.5]);
        const A = N.round(b * h / 2, 3), V = N.round(A * L, 3);
        return {
          prompt: `A tent is a triangular prism. The triangular end has a base of ${N.fmt(b)} m and a height of ${N.fmt(h)} m, and the tent is ${N.fmt(L)} m long. What is the volume of the tent?`,
          answer: numAns(V, 'm³'),
          hint: 'Area of the triangle end (½ × b × h) times the length.',
          working: [`End area = ½ × ${N.fmt(b)} × ${N.fmt(h)} = ${N.fmt(A)} m².`, `Volume = ${N.fmt(A)} × ${N.fmt(L)} = ${N.fmt(V)}.`, `<b>${N.fmt(V)} m³</b>.`],
          finalAnswer: `${N.fmt(V)} m³`,
        };
      }
      case 'sandpit': {
        const l = R.int(2, 4), w = R.int(2, 3), d = R.pick([0.5, 0.4, 0.3, 0.25]);
        const V = N.round(l * w * d, 3);
        return {
          prompt: `A sandpit is ${l} m long, ${w} m wide and ${N.fmt(d)} m deep. How many cubic metres of sand fill it?`,
          answer: numAns(V, 'm³'),
          hint: 'Length × width × depth.',
          working: [`${l} × ${w} × ${N.fmt(d)} = ${N.fmt(V)}.`, `<b>${N.fmt(V)} m³</b> of sand.`],
          finalAnswer: `${N.fmt(V)} m³`,
        };
      }
      default: { // garden: composite, two raised beds joined
        const l1 = R.int(3, 6), w = R.int(1, 2), h1 = R.pick([0.5, 0.4]), l2 = R.int(2, 4), h2 = R.pick([0.5, 0.4, 0.3]);
        const V1 = N.round(l1 * w * h1, 3), V2 = N.round(l2 * w * h2, 3), V = N.round(V1 + V2, 3);
        return {
          prompt: `${name} builds two raised garden beds joined together. One is ${l1} m by ${w} m by ${N.fmt(h1)} m deep, the other is ${l2} m by ${w} m by ${N.fmt(h2)} m deep. How much soil is needed to fill both, in m³?`,
          answer: numAns(V, 'm³'),
          hint: 'Work out each bed separately, then add.',
          working: [`Bed 1: ${l1} × ${w} × ${N.fmt(h1)} = ${N.fmt(V1)} m³.`, `Bed 2: ${l2} × ${w} × ${N.fmt(h2)} = ${N.fmt(V2)} m³.`, `${N.fmt(V1)} + ${N.fmt(V2)} = ${N.fmt(V)}.`, `<b>${N.fmt(V)} m³</b> of soil.`],
          finalAnswer: `${N.fmt(V)} m³`,
        };
      }
    }
  }

  HL.registerTopic({
    id: 'volume', subject: 'maths', strand: 'measurement', order: 4,
    name: 'Volume & capacity', short: 'Volume',
    blurb: 'How much space is inside a 3D shape, and how much liquid it holds.',
    example: 'Cuboid 5 × 3 × 2 = 30 cm³ = 30 mL',
    animal: 'giraffe',
    learn: (() => {
      const INK = '#4A3B48', BLUE = '#2A6FA5', ROSE = '#E0568C', GREEN = '#2FA97A';
      const LAYER = ['#F9A8C9', '#FFC79A', '#FFE98A', '#A6E3B8', '#A9D8F5', '#C9B8F2'];   // one colour per layer, bottom → top
      const SVG = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">${body}</svg>`;
      // an oblique cuboid of unit cubes: front face top-left at (x0, y0); l cubes along, h cubes down, w cubes back along (dx, dy) per cube; u = cube size.
      // opts.plain = one colour (no layers); opts.grid === false = no cube lines
      const box = (x0, y0, l, w, h, u, dx, dy, opts = {}) => {
        const fill = (k) => opts.plain ? (opts.fill || '#FFE98A') : LAYER[k % LAYER.length];
        const g = opts.grid !== false, line = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${INK}" stroke-width=".8"/>`;
        let s = '';
        for (let r = 0; r < h; r++) {   // front + side faces, one row (layer) at a time
          const k = h - 1 - r, Y = y0 + r * u, X = x0 + l * u;
          s += `<rect x="${x0}" y="${Y}" width="${l * u}" height="${u}" fill="${fill(k)}" stroke="${INK}" stroke-width="1.5"/>`;
          if (g) for (let i = 1; i < l; i++) s += line(x0 + i * u, Y, x0 + i * u, Y + u);
          s += `<polygon points="${X},${Y} ${X + w * dx},${Y + w * dy} ${X + w * dx},${Y + w * dy + u} ${X},${Y + u}" fill="${fill(k)}" stroke="${INK}" stroke-width="1.5"/>`;
          if (g) for (let j = 1; j < w; j++) s += line(X + j * dx, Y + j * dy, X + j * dx, Y + j * dy + u);
        }
        const X = x0 + l * u;
        s += `<polygon points="${X},${y0} ${X + w * dx},${y0 + w * dy} ${X + w * dx},${y0 + h * u + w * dy} ${X},${y0 + h * u}" fill="${INK}" opacity=".13"/>`;   // shade the side
        s += `<polygon points="${x0},${y0} ${X},${y0} ${X + w * dx},${y0 + w * dy} ${x0 + w * dx},${y0 + w * dy}" fill="${fill(h - 1)}" stroke="${INK}" stroke-width="1.5"/>`;
        if (g) { for (let i = 1; i < l; i++) s += line(x0 + i * u, y0, x0 + i * u + w * dx, y0 + w * dy); for (let j = 1; j < w; j++) s += line(x0 + j * dx, y0 + j * dy, X + j * dx, y0 + j * dy); }
        return s;
      };
      return {
      what: '<p><b>Volume</b> is the amount of space inside a 3D object, measured in cubes: cm³ or m³. Think of a block built from Lego: one layer of bricks, then more layers stacked on top.</p><p><b>Capacity</b> is how much liquid something holds: mL or L. They are linked: <b>1 cm³ = 1 mL</b>, <b>1000 cm³ = 1 L</b>, and <b>1 m³ = 1000 L</b>.</p>',
      visual: SVG(360, 220, `${box(50, 70, 4, 3, 3, 26, 16, -12)}
        <text x="102" y="168" text-anchor="middle" fill="${BLUE}">l = 4</text>
        <text x="44" y="113" text-anchor="end" fill="${BLUE}">h = 3</text>
        <text x="210" y="46" fill="${BLUE}">w = 3</text>
        <text x="250" y="104" fill="${INK}" font-size="15">V = l × w × h</text>
        <text x="250" y="128" fill="${INK}">= 4 × 3 × 3</text>
        <text x="250" y="152" fill="${GREEN}" font-size="15">= 36 cm³</text>
        <text x="20" y="196" fill="${INK}">1 layer = l × w = 4 × 3 = <tspan fill="${ROSE}">12 cubes</tspan></text>
        <text x="20" y="214" fill="${INK}">3 layers high: 12 × 3 = <tspan fill="${GREEN}">36 cubes</tspan></text>`),
      facts: [
        'Cuboid: <b>V = length × width × height</b>',
        'Cube: <b>V = side × side × side</b>',
        'Any prism: <b>V = area of the end × length</b>',
        'Units are <b>cubed</b>: cm³, m³',
        '<b>1 cm³ = 1 mL</b> &nbsp; <b>1000 cm³ = 1 L</b> &nbsp; <b>1 m³ = 1000 L</b>',
        'Missing side: <b>volume ÷ (the two sides you know, multiplied)</b>',
        '<b>Surface area</b> of a cube = <b>6 × side × side</b> (6 equal faces)',
        '<b>Surface area</b> of a cuboid = <b>2 × (lw + lh + wh)</b>',
        '<b>Surface area</b> of a triangular prism = <b>2 triangle ends + (the triangle\'s perimeter × the length)</b>',
        'Surface area is in <b>cm²</b> (flat squares); volume is in <b>cm³</b> (cubes)',
      ],
      steps: [
        'Say "one layer, then stack": <b>Cuboid</b> V = length × width (one layer) × height (how many layers). <b>Cube</b>: side × side × side.',
        '<b>Any prism</b> (same shape all the way through): V = area of the end × length. Triangular prism: end area = ½ × base × height.',
        'Multiply <b>three</b> lengths, then write the unit as <b>cubed</b>: cm³ or m³.',
        'For <b>capacity</b>: cm³ → mL is the same number; ÷ 1000 for litres. m³ × 1000 = litres.',
        '<b>Missing side</b>: multiply the two sides you know, then divide the volume by that.',
        '<b>Surface area</b> is different: unfold the solid into its <b>net</b> and add up the faces. Cube: 6 × side². Cuboid: work out lw, lh and wh, add them, then <b>double</b> (every face has a twin). Prism: 2 triangle ends + each side of the triangle × the length.',
      ],
      examples: [
        { q: 'Volume of a 6 cm × 4 cm × 5 cm cuboid', working: ['<b>Picture:</b> Lego bricks. One layer is 6 bricks long and 4 wide; the block is 5 layers high.', '1. What shape? A cuboid → V = l × w × h.', '2. One layer: 6 × 4 = 24 bricks.', '3. How many layers? 5. So 24 × 5.', '24 × 5 = 120'], a: '120 cm³',
          visual: SVG(360, 170, `${box(40, 60, 6, 4, 5, 16, 9, -7)}<text x="88" y="158" text-anchor="middle" fill="${BLUE}">6 cm</text><text x="34" y="104" text-anchor="end" fill="${BLUE}">5 cm</text><text x="176" y="40" fill="${BLUE}">4 cm</text><text x="210" y="70" fill="${INK}">V = l × w × h</text><text x="210" y="96" fill="${INK}">= 6 × 4 × 5</text><text x="210" y="122" fill="${GREEN}">= 120 cm³</text>`) },
        { q: 'Volume of a cube with sides 3 m', working: ['<b>Picture:</b> a Lego cube: every layer is 3 × 3, and there are 3 layers.', '1. What shape? A cube → all three sides are 3.', '2. One layer: 3 × 3 = 9.', '3. Three layers: 9 × 3.', '9 × 3 = 27'], a: '27 m³' },
        { q: 'Triangular prism: triangle end with base 8 cm and height 5 cm, length 10 cm', working: ['<b>Picture:</b> a Toblerone box — the same triangle all the way along.', '1. What shape? A prism → V = end area × length.', '2. What is the end? A triangle: ½ × 8 × 5 = 20 cm².', '3. How long is it? 10 cm. So 20 × 10.', '20 × 10 = 200'], a: '200 cm³',
          visual: SVG(360, 190, `<polygon points="30,120 70,60 200,26 160,86" fill="#FFC79A" stroke="${INK}" stroke-width="1.5"/><polygon points="70,60 110,120 240,86 200,26" fill="#FFE98A" stroke="${INK}" stroke-width="1.5"/><line x1="160" y1="86" x2="240" y2="86" stroke="${INK}" stroke-width="1" stroke-dasharray="4 3" opacity=".5"/><polygon points="30,120 110,120 70,60" fill="#F9A8C9" stroke="${INK}" stroke-width="2"/><line x1="70" y1="60" x2="70" y2="120" stroke="${ROSE}" stroke-width="3" stroke-dasharray="6 4"/><text x="82" y="100" fill="${ROSE}">5 cm</text><text x="70" y="138" text-anchor="middle" fill="${BLUE}">base 8 cm</text><text x="182" y="124" fill="${GREEN}">length 10 cm</text><text x="20" y="164" fill="${INK}">End = ½ × 8 × 5 = <tspan fill="${ROSE}">20 cm²</tspan></text><text x="20" y="184" fill="${INK}">V = 20 × 10 = <tspan fill="${GREEN}">200 cm³</tspan></text>`) },
        { q: 'A tank is 50 cm × 20 cm × 30 cm. How many litres does it hold?', working: ['<b>Picture:</b> fill the tank with 1 cm Lego cubes; every 1000 cubes is one litre.', '1. What shape? A cuboid → 50 × 20 × 30.', '2. 50 × 20 = 1000, then 1000 × 30 = 30 000 cm³.', '3. Litres? 1000 cm³ = 1 L, so ÷ 1000.', '30 000 ÷ 1000 = 30'], a: '30 L' },
        { q: 'A cuboid has volume 60 cm³, length 5 cm and width 3 cm. Find the height.', working: ['<b>Picture:</b> 60 Lego bricks, laid in layers of 5 × 3 — how many layers?', '1. What do I know? l × w × h = 60, with l = 5 and w = 3.', '2. One layer: 5 × 3 = 15 bricks.', '3. How many layers make 60? 60 ÷ 15.', '60 ÷ 15 = 4'], a: '4 cm' },
        { q: 'The classroom fish tank is 40 cm long and 25 cm wide. The water is 20 cm deep. How many litres of water are in it?', working: ['<b>Picture:</b> the water is a cuboid of Lego cubes sitting in the tank — only as tall as the <b>water</b>, not the tank.', '1. Which height do I use? The water depth, 20 cm.', '2. V = 40 × 25 × 20 = 20 000 cm³.', '3. Litres? ÷ 1000.', '20 000 ÷ 1000 = 20'], a: '20 L',
          visual: SVG(360, 140, `${box(56, 40, 5, 3, 3, 24, 14, -10, { plain: true, fill: '#FFFFFF', grid: false })}<polygon points="56,64 176,64 218,34 98,34" fill="#A9D8F5" opacity=".9"/><rect x="56" y="64" width="120" height="48" fill="#A9D8F5" opacity=".85"/><polygon points="176,64 218,34 218,82 176,112" fill="#A9D8F5" opacity=".85"/><line x1="56" y1="64" x2="176" y2="64" stroke="${ROSE}" stroke-width="2.5" stroke-dasharray="6 4"/><text x="116" y="94" text-anchor="middle" fill="${ROSE}">depth 20 cm</text><text x="50" y="60" text-anchor="end" fill="${INK}" opacity=".55">30 cm</text><text x="116" y="130" text-anchor="middle" fill="${BLUE}">40 cm</text><text x="222" y="22" fill="${BLUE}">25 cm</text><text x="232" y="62" fill="${INK}">V = 40 × 25 × 20</text><text x="232" y="88" fill="${INK}">= 20 000 cm³</text><text x="232" y="114" fill="${GREEN}">= 20 L</text>`) },
        { q: 'Surface area of a cube with edges 4 cm', working: ['<b>Picture:</b> a Lego box you <b>unfold flat</b>. Volume is the cubes <b>inside</b>; surface area is the wrapping paper <b>outside</b>.', '1. Volume or surface area? Surface area → I add up the <b>faces</b>.', '2. What shape is each face? A square, 4 × 4 = 16 cm².', '3. How many faces does a cube have? <b>6</b>, all the same.', '6 × 16 = 96'], a: '96 cm²',
          visual: SVG(360, 150, `${[[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]].map(([cx, cy]) => `<rect x="${26 + cx * 34}" y="${16 + cy * 34}" width="34" height="34" fill="#FFC79A" stroke="${INK}" stroke-width="1.5"/><text x="${43 + cx * 34}" y="${37 + cy * 34}" text-anchor="middle" fill="${INK}" font-size="12">16</text>`).join('')}<text x="94" y="136" text-anchor="middle" fill="${BLUE}">6 faces, each 4 × 4 = 16</text><text x="196" y="52" fill="${INK}">6 × 16</text><text x="196" y="82" fill="${GREEN}" font-size="16">= 96 cm²</text><text x="196" y="112" fill="${ROSE}">cm² not cm³!</text>`) },
        { q: 'Surface area of a cuboid 5 cm × 3 cm × 2 cm', working: ['<b>Picture:</b> unfold the Lego box into its <b>net</b>. The 6 faces come in <b>3 matching pairs</b>.', '1. Pair 1 (top and bottom): 5 × 3 = 15.', '2. Pair 2 (front and back): 5 × 2 = 10.', '3. Pair 3 (the two ends): 3 × 2 = 6.', '4. Add one of each: 15 + 10 + 6 = 31. Then double it (each has a twin): 2 × 31 = 62'], a: '62 cm²',
          visual: SVG(360, 206, `<rect x="24" y="10" width="90" height="54" fill="#A6E3B8" stroke="${INK}" stroke-width="1.5"/><text x="69" y="42" text-anchor="middle" fill="${INK}">5×3=15</text><rect x="24" y="64" width="90" height="36" fill="#F9A8C9" stroke="${INK}" stroke-width="1.5"/><text x="69" y="87" text-anchor="middle" fill="${INK}">5×2=10</text><rect x="114" y="64" width="54" height="36" fill="#A9D8F5" stroke="${INK}" stroke-width="1.5"/><text x="141" y="87" text-anchor="middle" fill="${INK}" font-size="12">3×2=6</text><rect x="168" y="64" width="90" height="36" fill="#F9A8C9" stroke="${INK}" stroke-width="1.5"/><text x="213" y="87" text-anchor="middle" fill="${INK}">5×2=10</text><rect x="258" y="64" width="54" height="36" fill="#A9D8F5" stroke="${INK}" stroke-width="1.5"/><text x="285" y="87" text-anchor="middle" fill="${INK}" font-size="12">3×2=6</text><rect x="24" y="100" width="90" height="54" fill="#A6E3B8" stroke="${INK}" stroke-width="1.5"/><text x="69" y="132" text-anchor="middle" fill="${INK}">5×3=15</text><text x="24" y="176" fill="${INK}">15 + 10 + 6 = <tspan fill="${ROSE}">31</tspan></text><text x="24" y="198" fill="${INK}">2 × 31 = <tspan fill="${GREEN}" font-size="16">62 cm²</tspan></text><text x="196" y="176" fill="${BLUE}" font-size="12">3 matching pairs</text><text x="196" y="196" fill="${BLUE}" font-size="12">→ do 3, then double</text>`) },
        { q: 'Harper wraps a present in a box 20 cm × 15 cm × 10 cm. What is the smallest area of wrapping paper that covers it?', working: ['<b>Picture:</b> the paper has to cover the <b>outside</b> of the Lego box, so this is surface area, not volume.', '1. Volume or surface area? Paper covers the outside → <b>surface area</b>.', '2. Three pairs: 20 × 15 = 300, 20 × 10 = 200, 15 × 10 = 150.', '3. Add them: 300 + 200 + 150 = 650.', '4. Double it: 2 × 650 = 1300'], a: '1300 cm²' },
        { q: 'Surface area of a triangular prism 10 cm long, with a right-angled triangle end with sides 3 cm, 4 cm and 5 cm', working: ['<b>Picture:</b> a Toblerone box <b>cut open and flattened</b>. It falls apart into <b>2 triangle ends</b> and <b>3 rectangles</b>.', '1. Volume or surface area? Surface area → I add up the faces.', '2. One triangle end: ½ × 3 × 4 = 6 cm². There are <b>two</b> ends: 2 × 6 = 12 cm².', '3. Each rectangle is one side of the triangle × the length. The sides are 3, 4 and 5, and the prism is 10 long.', '4. Rectangles: (3 + 4 + 5) × 10 = 12 × 10 = 120 cm².', '5. Add: 12 + 120 = 132'], a: '132 cm²',
          visual: SVG(360, 200, (() => {
            const x0 = 26, y0 = 56, k = 8;   // 8 px per cm
            const bw = 3 * k, hw = 4 * k, yw = 5 * k, band = 10 * k, tri = 4 * k;
            const rect = (x, w, fill, txt) => `<rect x="${x}" y="${y0}" width="${w}" height="${band}" fill="${fill}" stroke="${INK}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y0 + band / 2 + 5}" text-anchor="middle" fill="${INK}" font-size="12">${txt}</text>`;
            return `<polygon points="${x0},${y0} ${x0 + bw},${y0} ${x0},${y0 - tri}" fill="#A6E3B8" stroke="${INK}" stroke-width="1.5"/>`
              + `<polygon points="${x0},${y0 + band} ${x0 + bw},${y0 + band} ${x0},${y0 + band + tri}" fill="#A6E3B8" stroke="${INK}" stroke-width="1.5"/>`
              + `<text x="${x0 + 3}" y="${y0 - 8}" fill="${INK}" font-size="11">6</text><text x="${x0 + 3}" y="${y0 + band + 16}" fill="${INK}" font-size="11">6</text>`
              + rect(x0, bw, '#A9D8F5', '3') + rect(x0 + bw, hw, '#D6ECFA', '4') + rect(x0 + bw + hw, yw, '#A9D8F5', '5')
              + `<text x="${x0}" y="188" fill="${BLUE}" font-size="12">each rectangle is 10 cm long</text>`
              + `<text x="140" y="42" fill="${INK}">2 triangle ends:</text>`
              + `<text x="140" y="66" fill="${GREEN}">2 × 6 = 12</text>`
              + `<text x="140" y="104" fill="${INK}">3 rectangles:</text>`
              + `<text x="140" y="128" fill="${BLUE}">(3+4+5) × 10 = 120</text>`
              + `<text x="140" y="164" fill="${INK}" font-size="15">12 + 120 = <tspan fill="${GREEN}">132 cm²</tspan></text>`;
          })()) },
      ],
      tips: [
        'Multiply <b>three</b> lengths for volume. If you only multiplied two, you found an area.',
        'Do not mix units: change everything to cm (or m) before multiplying.',
        'A tank filled to a certain <b>depth</b>: use the water depth, not the full height.',
        '1 L = 1000 cm³. A 10 cm cube holds exactly 1 litre.',
        '<b>Volume or surface area?</b> Filling it up (water, soil, Lego) → volume, cm³. Covering the outside (paint, wrapping paper, cardboard) → surface area, cm².',
        'For a cuboid\'s surface area, work out <b>three</b> faces and then double. Doing all six one by one is slower and easier to get wrong.',
      ],
      };
    })(),
    generate: (level, kind) => (kind === 'word' ? word(level) : calc(level)),
  });
})(window.HL);
