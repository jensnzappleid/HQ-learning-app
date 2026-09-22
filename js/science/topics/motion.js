/* Topic: Motion — speed = distance ÷ time, units, average speed, distance-time graphs. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- pools ---------- */
  const WALKERS = [
    { who: 'Harper', act: 'jogging round the field' }, { who: 'a kererū', act: 'flying between trees' },
    { who: 'a kayak', act: 'paddling down the Whanganui River' }, { who: 'a school bus', act: 'driving to Taupō' },
    { who: 'a kiwi', act: 'running through the bush' }, { who: 'a skateboard', act: 'rolling down the path' },
    { who: 'the Interislander ferry', act: 'crossing Cook Strait' }, { who: 'a cyclist', act: 'riding the Otago rail trail' },
    { who: 'a train', act: 'running to Wellington' }, { who: 'a swimmer', act: 'doing lengths at the pool' },
  ];
  const FAST_THINGS = [
    { name: 'a person walking', ms: 1.5 }, { name: 'a person jogging', ms: 3 }, { name: 'a fast sprinter', ms: 10 },
    { name: 'a bike', ms: 6 }, { name: 'a car in town', ms: 14 }, { name: 'a car on the motorway', ms: 28 },
    { name: 'a tuatara walking', ms: 0.3 }, { name: 'a plane', ms: 250 },
  ];
  const JOURNEYS = [
    { pts: [[0, 0], [10, 20], [20, 20], [40, 80]], tMax: 40, tStep: 10, dMax: 80, dStep: 20, who: 'Harper walking to the dairy' },
    { pts: [[0, 0], [20, 60], [30, 60], [50, 100]], tMax: 50, tStep: 10, dMax: 100, dStep: 20, who: 'a dog running in the park' },
    { pts: [[0, 0], [10, 10], [20, 50], [40, 50]], tMax: 40, tStep: 10, dMax: 60, dStep: 20, who: 'a scooter on the footpath' },
    { pts: [[0, 0], [20, 40], [40, 40], [60, 120]], tMax: 60, tStep: 10, dMax: 120, dStep: 20, who: 'a runner at cross-country' },
    { pts: [[0, 0], [15, 45], [30, 45], [45, 90]], tMax: 45, tStep: 15, dMax: 90, dStep: 30, who: 'a cyclist going to school' },
    { pts: [[0, 0], [10, 40], [20, 40], [30, 100]], tMax: 30, tStep: 10, dMax: 100, dStep: 20, who: 'a go-kart on the track' },
  ];
  const LETTERS = ['A', 'B', 'C', 'D'];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  const r1 = (v) => Math.round(v * 10) / 10;
  const segSpeed = (p, q) => r1((q[1] - p[1]) / (q[0] - p[0]));

  /* ---------- diagrams ---------- */
  function graphSvg(j, opts) {
    const o = opts || {};
    const X = (t) => r1(48 + (t / j.tMax) * 262);
    const Y = (d) => r1(160 - (d / j.dMax) * 134);
    let g = '';
    for (let t = 0; t <= j.tMax; t += j.tStep) g += `<line x1="${X(t)}" y1="26" x2="${X(t)}" y2="160" stroke="#E7E0D2" stroke-width="1"/><text x="${X(t)}" y="176" text-anchor="middle" fill="${INK}" font-size="11">${t}</text>`;
    for (let d = 0; d <= j.dMax; d += j.dStep) g += `<line x1="48" y1="${Y(d)}" x2="310" y2="${Y(d)}" stroke="#E7E0D2" stroke-width="1"/><text x="42" y="${Y(d) + 4}" text-anchor="end" fill="${INK}" font-size="11">${d}</text>`;
    const line = j.pts.map((p) => `${X(p[0])},${Y(p[1])}`).join(' ');
    let labels = '';
    for (let i = 0; i < j.pts.length - 1; i++) {
      const a = j.pts[i], b = j.pts[i + 1];
      const mx = (X(a[0]) + X(b[0])) / 2, my = (Y(a[1]) + Y(b[1])) / 2;
      labels += `<circle cx="${r1(mx)}" cy="${r1(my - 12)}" r="10" fill="#FFFFFF" stroke="#5F98C4" stroke-width="2"/><text x="${r1(mx)}" y="${r1(my - 8)}" text-anchor="middle" fill="#3C6E96" font-size="12">${LETTERS[i]}</text>`;
    }
    return `<svg viewBox="0 0 330 208" width="330" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${g}
      <line x1="48" y1="26" x2="48" y2="160" stroke="${INK}" stroke-width="2.5"/>
      <line x1="48" y1="160" x2="314" y2="160" stroke="${INK}" stroke-width="2.5"/>
      <polyline points="${line}" fill="none" stroke="#E0568C" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${j.pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="#E0568C"/>`).join('')}
      ${labels}
      <text x="180" y="196" text-anchor="middle" fill="${INK}" font-size="11">time (s)</text>
      <text x="14" y="96" text-anchor="middle" fill="${INK}" font-size="11" transform="rotate(-90 14 96)">distance (m)</text>
      <text x="180" y="14" text-anchor="middle" fill="${INK}" font-size="12">${o.title || j.who}</text>
    </svg>`;
  }

  const MINI = {
    'steady speed': [[0, 0], [10, 10]],
    'stopped': [[0, 6], [10, 6]],
    'speeding up': [[0, 0], [3, 1], [6, 3.5], [10, 10]],
    'slow steady speed': [[0, 0], [10, 4]],
  };
  function miniGraphs(kinds) {
    let s = '';
    kinds.forEach((k, i) => {
      const ox = 12 + i * 106;
      const X = (t) => r1(ox + 18 + (t / 10) * 74);
      const Y = (d) => r1(140 - (d / 10) * 104);
      s += `<line x1="${ox + 18}" y1="34" x2="${ox + 18}" y2="140" stroke="${INK}" stroke-width="2"/><line x1="${ox + 18}" y1="140" x2="${ox + 96}" y2="140" stroke="${INK}" stroke-width="2"/>`;
      s += `<polyline points="${MINI[k].map((p) => `${X(p[0])},${Y(p[1])}`).join(' ')}" fill="none" stroke="#E0568C" stroke-width="3" stroke-linejoin="round"/>`;
      s += `<text x="${ox + 57}" y="162" text-anchor="middle" fill="#3C6E96" font-size="14">${LETTERS[i]}</text>`;
      s += `<text x="${ox + 12}" y="26" fill="${INK}" font-size="10">dist</text>`;
      s += `<text x="${ox + 78}" y="154" fill="${INK}" font-size="10">time</text>`;
    });
    return `<svg viewBox="0 0 330 172" width="330" height="172" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">${s}</svg>`;
  }

  function tableSvg(rows, head) {
    return `<table class="data"><tr><th>${head[0]}</th><th>${head[1]}</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>`;
  }

  /* ---------- question makers ---------- */
  function speedCalc(level) {
    const s = level === 1 ? R.pick([2, 3, 4, 5, 10]) : R.pick([2, 3, 4, 5, 6, 8, 9, 12, 15, 20]);
    const t = level === 1 ? R.pick([2, 4, 5, 10]) : R.pick([3, 4, 5, 6, 8, 10, 12, 15, 20]);
    const w = R.pick(WALKERS);
    return {
      prompt: `${w.who.charAt(0).toUpperCase() + w.who.slice(1)} travels <b>${s * t} m</b> in <b>${t} s</b>. What is the speed?`,
      answer: { type: 'number', value: s, unit: 'm/s', placeholder: 'e.g. 5' },
      hint: 'speed = distance ÷ time',
      working: ['<b>Rule:</b> speed = distance ÷ time.', `${s * t} ÷ ${t} = <b>${s} m/s</b>.`, `That means ${s} metres go by every single second.`],
      finalAnswer: `${s} m/s`, skill: 'speed',
    };
  }
  function distanceCalc(level) {
    const s = R.pick([2, 3, 4, 5, 6, 8, 10, 12, 20]);
    const t = R.pick([3, 4, 5, 6, 8, 10, 12, 15]);
    const w = R.pick(WALKERS);
    return {
      prompt: `${w.who.charAt(0).toUpperCase() + w.who.slice(1)} goes at <b>${s} m/s</b> for <b>${t} s</b>. How far does it travel?`,
      answer: { type: 'number', value: s * t, unit: 'm', placeholder: 'e.g. 40' },
      hint: 'Cover "distance" in the triangle and you are left with speed × time.',
      working: ['<b>Rule:</b> distance = speed × time.', `${s} × ${t} = <b>${s * t} m</b>.`],
      finalAnswer: `${s * t} m`, skill: 'distance',
    };
  }
  function timeCalc(level) {
    const s = R.pick([2, 3, 4, 5, 6, 8, 10, 12]);
    const t = R.pick([3, 4, 5, 6, 8, 10, 12, 15]);
    const w = R.pick(WALKERS);
    return {
      prompt: `${w.who.charAt(0).toUpperCase() + w.who.slice(1)} travels <b>${s * t} m</b> at <b>${s} m/s</b>. How long does it take?`,
      answer: { type: 'number', value: t, unit: 's', placeholder: 'e.g. 8' },
      hint: 'Cover "time" in the triangle: you are left with distance ÷ speed.',
      working: ['<b>Rule:</b> time = distance ÷ speed.', `${s * t} ÷ ${s} = <b>${t} s</b>.`],
      finalAnswer: `${t} s`, skill: 'time',
    };
  }
  function kmhCalc() {
    const v = R.pick([40, 50, 60, 80, 90, 100, 120]);
    const t = R.pick([2, 3, 4, 5]);
    return {
      prompt: `A car drives <b>${v * t} km</b> in <b>${t} hours</b>. What is its average speed in km/h?`,
      answer: { type: 'number', value: v, unit: 'km/h', placeholder: 'e.g. 80' },
      hint: 'Same rule: speed = distance ÷ time. Kilometres ÷ hours gives km/h.',
      working: ['<b>Rule:</b> speed = distance ÷ time.', `${v * t} ÷ ${t} = <b>${v} km/h</b>.`, 'The units come from what you divided: km ÷ h = km/h.'],
      finalAnswer: `${v} km/h`, skill: 'speed',
    };
  }
  function convertUnits() {
    const ms = R.pick([5, 10, 15, 20, 25, 30]);
    if (R.chance(0.5)) {
      return {
        prompt: `A car is going <b>${ms} m/s</b>. What is that in km/h? (× 3.6)`,
        answer: { type: 'number', value: Math.round(ms * 3.6), unit: 'km/h', placeholder: 'e.g. 36' },
        hint: 'To go from m/s to km/h, multiply by 3.6.',
        working: ['<b>Rule:</b> m/s → km/h means × 3.6.', `${ms} × 3.6 = <b>${Math.round(ms * 3.6)} km/h</b>.`],
        finalAnswer: `${Math.round(ms * 3.6)} km/h`, skill: 'units',
      };
    }
    const kmh = Math.round(ms * 3.6);
    return {
      prompt: `A cyclist is going <b>${kmh} km/h</b>. What is that in m/s? (÷ 3.6)`,
      answer: { type: 'number', value: ms, unit: 'm/s', placeholder: 'e.g. 10' },
      hint: 'Going back the other way, km/h → m/s, divide by 3.6.',
      working: ['<b>Rule:</b> km/h → m/s means ÷ 3.6.', `${kmh} ÷ 3.6 = <b>${ms} m/s</b>.`],
      finalAnswer: `${ms} m/s`, skill: 'units',
    };
  }
  function unitFact() {
    const q = R.pick([
      { p: 'Which unit is a <b>speed</b>?', a: 'metres per second (m/s)', w: ['metres (m)', 'seconds (s)', 'newtons (N)'], short: 'm/s', shortAccept: ['metres per second', 'meters per second'] },
      { p: 'What does <b>m/s</b> mean?', a: 'How many metres are covered each second', w: ['How many seconds each metre takes', 'How many metres there are altogether', 'How heavy something is'] },
      { p: 'You measure a distance in km and a time in hours. What unit will the speed be in?', a: 'km/h', w: ['m/s', 'km', 'hours'], short: 'km/h', shortAccept: ['kilometres per hour', 'kilometers per hour', 'km per h'] },
      { p: 'You measure a distance in metres and a time in seconds. What unit will the speed be in?', a: 'm/s', w: ['km/h', 'metres', 'seconds'], short: 'm/s', shortAccept: ['metres per second', 'meters per second'] },
      { p: 'Which of these is the <b>fastest</b>?', a: '30 m/s', w: ['30 km/h', '3 m/s', '10 km/h'] },
      { p: 'What do you need to measure to work out a speed?', a: 'A distance and a time', w: ['A distance and a mass', 'A time and a force', 'Only a distance'] },
      { p: 'Which instruments would you use to measure speed on the field?', a: 'A trundle wheel and a stopwatch', w: ['A ruler and a thermometer', 'A newton meter and a stopwatch', 'Scales and a measuring cylinder'] },
    ]);
    return {
      prompt: q.p, answer: q.short ? textAns(q.short, q.shortAccept, 'a unit') : ans(choice(q.a, q.w, 4)),
      hint: 'Speed is always "how much distance" divided by "how much time".',
      working: ['<b>Picture:</b> speed is how much ground you cover in one second.', 'speed = distance ÷ time, so the unit is distance-unit / time-unit.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'units',
    };
  }
  function compareSpeeds() {
    const [a, b] = R.sample(FAST_THINGS, 2);
    const faster = a.ms > b.ms ? a : b;
    const choices = [a.name, b.name];
    return {
      prompt: `Which is faster: <b>${a.name}</b> (${a.ms} m/s) or <b>${b.name}</b> (${b.ms} m/s)?`,
      answer: { type: 'choice', value: choices.indexOf(faster.name), choices },
      hint: 'Both are in m/s, so you can compare them straight away — bigger number = faster.',
      working: ['<b>Picture:</b> m/s tells you how many metres go by each second.', `${a.ms} m/s vs ${b.ms} m/s → ${Math.max(a.ms, b.ms)} is bigger.`, `So <b>${faster.name}</b> is faster.`],
      finalAnswer: faster.name, skill: 'compare',
    };
  }
  function compareMixed() {
    const ms = R.pick([5, 10, 15, 20]);
    const otherKmh = R.pick([ms * 3.6 - 18, ms * 3.6 + 18]);
    const msFaster = ms * 3.6 > otherKmh;
    const choices = [`${ms} m/s`, `${otherKmh} km/h`];
    return {
      prompt: `Which is faster: <b>${ms} m/s</b> or <b>${otherKmh} km/h</b>? (m/s → km/h is × 3.6)`,
      answer: { type: 'choice', value: msFaster ? 0 : 1, choices },
      hint: 'You cannot compare different units. Change them both to km/h first.',
      working: [
        '<b>Rule:</b> you can only compare speeds in the <b>same unit</b>.',
        `${ms} m/s × 3.6 = ${Math.round(ms * 3.6)} km/h.`,
        `${Math.round(ms * 3.6)} km/h vs ${otherKmh} km/h → <b>${msFaster ? `${ms} m/s` : `${otherKmh} km/h`}</b> is faster.`,
      ],
      finalAnswer: msFaster ? `${ms} m/s` : `${otherKmh} km/h`, skill: 'compare',
    };
  }
  function averageSpeed() {
    const v = R.pick([2, 3, 4, 5]);
    const t1 = R.int(1, 3), tr = R.int(1, 2), t2 = R.int(1, 3);
    const T = t1 + tr + t2, d = v * T;
    const d1 = Math.round(d * 0.6), d2 = d - d1;
    return {
      prompt: `A tramper walks <b>${d1} km in ${t1} h</b>, rests for <b>${tr} h</b>, then walks <b>${d2} km in ${t2} h</b>. What is her <b>average speed</b> for the whole trip?`,
      answer: { type: 'number', value: v, unit: 'km/h', placeholder: 'e.g. 4' },
      hint: 'Average speed = TOTAL distance ÷ TOTAL time. The rest counts as time!',
      working: [
        '<b>Rule:</b> average speed = total distance ÷ total time.',
        `Total distance = ${d1} + ${d2} = ${d} km.`,
        `Total time = ${t1} + ${tr} + ${t2} = ${T} h (the rest still counts).`,
        `${d} ÷ ${T} = <b>${v} km/h</b>.`,
      ],
      finalAnswer: `${v} km/h`, skill: 'average',
    };
  }
  function graphStopped() {
    const j = R.pick(JOURNEYS);
    const flat = j.pts.findIndex((p, i) => i < j.pts.length - 1 && j.pts[i + 1][1] === p[1]);
    const c = choice(LETTERS[flat], LETTERS.slice(0, j.pts.length - 1), 3);
    return {
      visual: graphSvg(j),
      prompt: 'Look at the distance-time graph. In which section is it <b>stopped</b>?',
      answer: ans(c),
      hint: 'Stopped means the distance is not growing — the line goes flat.',
      working: ['<b>Picture:</b> if you are not moving, the distance from home stays the same.', '1. A flat line means the distance is not changing.', `2. Section <b>${LETTERS[flat]}</b> is the flat one.`],
      finalAnswer: LETTERS[flat], skill: 'graphs',
    };
  }
  function graphFastest() {
    const j = R.pick(JOURNEYS);
    const speeds = j.pts.slice(0, -1).map((p, i) => segSpeed(p, j.pts[i + 1]));
    const best = speeds.indexOf(Math.max.apply(null, speeds));
    const c = choice(LETTERS[best], LETTERS.slice(0, speeds.length), 3);
    return {
      visual: graphSvg(j),
      prompt: 'Which section of the journey is the <b>fastest</b>?',
      answer: ans(c),
      hint: 'On a distance-time graph, the steeper the line, the faster it is going.',
      working: ['<b>Picture:</b> a steep hill on the graph = lots of distance in a short time.', `1. Section speeds: ${speeds.map((s, i) => `${LETTERS[i]} = ${s} m/s`).join(', ')}.`, `2. The steepest (biggest) is <b>${LETTERS[best]}</b>.`],
      finalAnswer: LETTERS[best], skill: 'graphs',
    };
  }
  function graphRead() {
    const j = R.pick(JOURNEYS);
    const i = R.int(1, j.pts.length - 1);
    const p = j.pts[i];
    return {
      visual: graphSvg(j),
      prompt: `Use the graph. How far has it travelled after <b>${p[0]} seconds</b>?`,
      answer: { type: 'number', value: p[1], unit: 'm', placeholder: 'e.g. 40' },
      hint: 'Go up from that time on the bottom axis until you hit the line, then straight across to the distance axis.',
      working: [`<b>Picture:</b> put your finger on ${p[0]} s, slide up to the pink line, then across.`, `You land on <b>${p[1]} m</b>.`],
      finalAnswer: `${p[1]} m`, skill: 'graphs',
    };
  }
  function graphSpeedSection() {
    const j = R.pick(JOURNEYS);
    const moving = j.pts.slice(0, -1).map((p, i) => i).filter((i) => j.pts[i + 1][1] !== j.pts[i][1]);
    const i = R.pick(moving);
    const a = j.pts[i], b = j.pts[i + 1];
    const s = segSpeed(a, b);
    return {
      visual: graphSvg(j),
      prompt: `What is the speed during section <b>${LETTERS[i]}</b> of this graph?`,
      answer: { type: 'number', value: s, unit: 'm/s', placeholder: 'e.g. 3', tolerance: 0.05 },
      hint: 'Read the distance travelled in that section and the time it took, then divide.',
      working: [
        '<b>Rule:</b> speed = distance ÷ time.',
        `Section ${LETTERS[i]}: distance goes from ${a[1]} m to ${b[1]} m → ${b[1] - a[1]} m.`,
        `Time goes from ${a[0]} s to ${b[0]} s → ${b[0] - a[0]} s.`,
        `${b[1] - a[1]} ÷ ${b[0] - a[0]} = <b>${s} m/s</b>.`,
      ],
      finalAnswer: `${s} m/s`, skill: 'graphs',
    };
  }
  function graphShape() {
    const kinds = R.shuffle(['steady speed', 'stopped', 'speeding up']);
    const want = R.pick(['stopped', 'steady speed', 'speeding up']);
    const words = { stopped: 'is <b>stopped</b>', 'steady speed': 'is moving at a <b>steady speed</b>', 'speeding up': 'is <b>speeding up</b>' };
    const idx = kinds.indexOf(want);
    const c = choice(LETTERS[idx], ['A', 'B', 'C'], 3);
    return {
      visual: miniGraphs(kinds),
      prompt: `These are all distance-time graphs. Which one shows something that ${words[want]}?`,
      answer: ans(c),
      hint: 'Flat = stopped. Straight and sloping = steady speed. Curving upwards = speeding up.',
      working: [
        '<b>Picture:</b> the steepness of the line IS the speed.',
        'Flat line → not moving. Straight sloping line → same speed all the way. Curve getting steeper → going faster and faster.',
        `So the answer is graph <b>${LETTERS[idx]}</b>.`,
      ],
      finalAnswer: LETTERS[idx], skill: 'graphs',
    };
  }
  function graphMeaning() {
    const q = R.pick([
      { p: 'On a distance-time graph, what does a <b>flat</b> (horizontal) line mean?', a: 'It is stopped', w: ['It is going very fast', 'It is going backwards', 'It is speeding up'] },
      { p: 'On a distance-time graph, what does a <b>steeper</b> line mean?', a: 'It is going faster', w: ['It is going slower', 'It has stopped', 'It is heavier'] },
      { p: 'On a distance-time graph, what goes on the bottom (x) axis?', a: 'Time', w: ['Distance', 'Speed', 'Mass'], short: 'time', shortAccept: [] },
      { p: 'A distance-time graph is a straight sloping line. What does that tell you?', a: 'It is moving at a steady speed', w: ['It is speeding up', 'It is slowing down', 'It is stopped'] },
      { p: 'A distance-time line curves and gets steeper and steeper. What is happening?', a: 'It is speeding up', w: ['It is slowing down', 'It is stopped', 'It is going backwards'] },
    ]);
    return {
      prompt: q.p, answer: q.short ? textAns(q.short, q.shortAccept, 'one word') : ans(choice(q.a, q.w, 4)),
      hint: 'Steepness = speed. No steepness at all = no speed.',
      working: ['<b>Picture:</b> the line is like a hill — the steeper the hill, the faster you are going.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'graphs',
    };
  }
  function tableSpeed() {
    const s = R.pick([2, 3, 4, 5]);
    const step = R.pick([5, 10]);
    const rows = [0, 1, 2, 3, 4].map((i) => [String(i * step), String(i * step * s)]);
    const i = R.int(2, 4);
    return {
      visual: tableSvg(rows, ['time (s)', 'distance (m)']),
      prompt: 'Harper timed a remote-control car. Use the results table: what is its speed?',
      answer: { type: 'number', value: s, unit: 'm/s', placeholder: 'e.g. 4' },
      hint: 'Pick any row and do distance ÷ time.',
      working: [
        '<b>Rule:</b> speed = distance ÷ time.',
        `Take the row time = ${rows[i][0]} s, distance = ${rows[i][1]} m.`,
        `${rows[i][1]} ÷ ${rows[i][0]} = <b>${s} m/s</b>.`,
        'Every row gives the same answer, so the speed is steady.',
      ],
      finalAnswer: `${s} m/s`, skill: 'graphs',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const s = R.pick([4, 5, 6, 8, 10]), t = R.pick([20, 25, 30, 40, 50]);
      return {
        prompt: `Harper runs the ${s * t} m sprint at athletics day in <b>${t} seconds</b>. What was her average speed?`,
        answer: { type: 'number', value: s, unit: 'm/s', placeholder: 'e.g. 6' },
        hint: 'speed = distance ÷ time.',
        working: ['<b>Rule:</b> speed = distance ÷ time.', `${s * t} ÷ ${t} = <b>${s} m/s</b>.`, `So she covers ${s} m every second.`],
        finalAnswer: `${s} m/s`,
      };
    },
    () => {
      const v = R.pick([60, 80, 90, 100]), t = R.pick([2, 3, 4]);
      return {
        prompt: `The bus to Rotorua keeps a steady <b>${v} km/h</b> for <b>${t} hours</b>. How far does it go?`,
        answer: { type: 'number', value: v * t, unit: 'km', placeholder: 'e.g. 240' },
        hint: 'distance = speed × time. Hours × km/h gives km.',
        working: ['<b>Rule:</b> distance = speed × time.', `${v} × ${t} = <b>${v * t} km</b>.`],
        finalAnswer: `${v * t} km`,
      };
    },
    () => {
      const v = R.pick([50, 60, 80, 90]), t = R.pick([2, 3, 4, 5]);
      return {
        prompt: `A family drives <b>${v * t} km</b> from Auckland towards Wellington at an average <b>${v} km/h</b>. How long does the drive take?`,
        answer: { type: 'number', value: t, unit: 'hours', placeholder: 'e.g. 3' },
        hint: 'time = distance ÷ speed.',
        working: ['<b>Rule:</b> time = distance ÷ speed.', `${v * t} ÷ ${v} = <b>${t} hours</b>.`],
        finalAnswer: `${t} hours`,
      };
    },
    () => {
      const j = R.pick(JOURNEYS);
      const flat = j.pts.findIndex((p, i) => i < j.pts.length - 1 && j.pts[i + 1][1] === p[1]);
      const a = j.pts[flat], b = j.pts[flat + 1];
      const c = choice(`Stopped for ${b[0] - a[0]} seconds`, [`Going faster for ${b[0] - a[0]} seconds`, `Going backwards for ${b[0] - a[0]} seconds`, `Going ${b[1]} m/s`], 4);
      return {
        visual: graphSvg(j),
        prompt: 'What is happening in the middle of this journey?',
        answer: ans(c),
        hint: 'The line stops climbing — the distance is not changing.',
        working: ['<b>Picture:</b> waiting at the traffic lights — time passes but you get no further.', `1. Between ${a[0]} s and ${b[0]} s the distance stays at ${a[1]} m.`, `So it was <b>stopped for ${b[0] - a[0]} seconds</b>.`],
        finalAnswer: `Stopped for ${b[0] - a[0]} seconds`,
      };
    },
    () => {
      const c = choice('Measure the distance with a trundle wheel and the time with a stopwatch', ['Guess how fast it looks', 'Weigh it and time it', 'Measure only the distance'], 4);
      return {
        prompt: 'Harper wants to find the speed of her scooter down the school driveway. What should she measure?',
        answer: ans(c),
        hint: 'speed = distance ÷ time, so you need both of those.',
        working: ['<b>Rule:</b> speed = distance ÷ time.', '1. She needs a distance → trundle wheel or tape measure.', '2. She needs a time → stopwatch.', 'Then divide distance by time.'],
        finalAnswer: 'Measure the distance and the time',
      };
    },
    () => {
      const c = choice('Repeat it three times and take the average', ['Do it once and trust it', 'Change the distance each try', 'Use a different timer each try'], 4);
      return {
        prompt: 'Harper times her scooter run once and gets 4.2 s. How can she make her speed result more reliable?',
        answer: ans(c),
        hint: 'One reading can easily be a bit out — human reaction time on the stopwatch.',
        working: ['<b>Picture:</b> one shot at goal tells you less than three.', '1. A stopwatch depends on reaction time, so one go can be off.', '2. Doing it three times and averaging evens out the mistakes.', 'So: <b>repeat and average</b>.'],
        finalAnswer: 'Repeat it three times and take the average',
      };
    },
    () => {
      const v1 = R.pick([3, 4, 5]), v2 = v1 + R.pick([1, 2, 3]);
      const t = R.pick([10, 20, 30]);
      const c = choice(`${(v2 - v1) * t} m`, [`${(v1 + v2) * t} m`, `${v2 * t} m`, `${t} m`], 4);
      return {
        prompt: `Two swimmers race for ${t} s. One swims at ${v1} m/s, the other at ${v2} m/s. How far ahead is the faster one at the end?`,
        answer: ans(c),
        hint: 'Work out how far each one goes, then take the difference.',
        working: [
          '<b>Rule:</b> distance = speed × time.',
          `Slower: ${v1} × ${t} = ${v1 * t} m.`,
          `Faster: ${v2} × ${t} = ${v2 * t} m.`,
          `Gap = ${v2 * t} − ${v1 * t} = <b>${(v2 - v1) * t} m</b>.`,
        ],
        finalAnswer: `${(v2 - v1) * t} m`,
      };
    },
    () => {
      const v = R.pick([2, 3, 4, 5]);
      const t1 = R.int(1, 3), tr = R.int(1, 2), t2 = R.int(1, 3);
      const T = t1 + tr + t2, d = v * T, d1 = Math.round(d * 0.5), d2 = d - d1;
      const c = choice(`${v} km/h`, [`${r1(d / (t1 + t2))} km/h`, `${d} km/h`, `${T} km/h`], 4);
      return {
        prompt: `A cyclist rides ${d1} km in ${t1} h, has a ${tr} h lunch stop, then rides ${d2} km in ${t2} h. What is her average speed for the whole ride?`,
        answer: ans(c),
        hint: 'Average speed uses the TOTAL distance and the TOTAL time, stop included.',
        working: [
          '<b>Rule:</b> average speed = total distance ÷ total time.',
          `Distance = ${d1} + ${d2} = ${d} km.`,
          `Time = ${t1} + ${tr} + ${t2} = ${T} h (the lunch stop counts).`,
          `${d} ÷ ${T} = <b>${v} km/h</b>.`,
        ],
        finalAnswer: `${v} km/h`,
      };
    },
    () => {
      const c = choice('Because she stops and starts, so her speed is not steady the whole way', ['Because average speed is always wrong', 'Because distance changes', 'Because a stopwatch is not accurate'], 4);
      return {
        prompt: 'Harper cycles to school at an average of 12 km/h, but she never actually rides at exactly 12 km/h. Why not?',
        answer: ans(c),
        hint: 'Think about the corners, the hill and the crossing.',
        working: ['<b>Picture:</b> the ride is fast downhill, slow uphill, stopped at the crossing.', '1. Average speed = whole trip distance ÷ whole trip time.', '2. It is a summary of the trip, not the speed at any one moment.', 'So her real speed is <b>changing all the way</b>.'],
        finalAnswer: 'Her speed changes; the average just summarises the whole trip',
      };
    },
    () => {
      const kinds = R.shuffle(['steady speed', 'stopped', 'speeding up']);
      const idx = kinds.indexOf('speeding up');
      const c = choice(LETTERS[idx], ['A', 'B', 'C'], 3);
      return {
        visual: miniGraphs(kinds),
        prompt: 'A ball rolls down a slope and gets faster and faster. Which distance-time graph matches it?',
        answer: ans(c),
        hint: 'Faster and faster means the line has to get steeper and steeper.',
        working: ['<b>Picture:</b> each second the ball covers more ground than the second before.', '1. More distance per second → steeper line.', '2. Getting steeper every second → a curve, not a straight line.', `So graph <b>${LETTERS[idx]}</b>.`],
        finalAnswer: LETTERS[idx],
      };
    },
    () => {
      const ms = R.pick([10, 15, 20, 25]);
      const c = choice(`${ms} m/s`, [`${Math.round(ms * 3.6)} m/s`, `${ms} km/h`, `${Math.round(ms / 3.6)} m/s`], 4);
      return {
        prompt: `A road sign says the speed limit is ${Math.round(ms * 3.6)} km/h. What is that in m/s? (÷ 3.6)`,
        answer: ans(c),
        hint: 'km/h → m/s means divide by 3.6.',
        working: ['<b>Rule:</b> km/h ÷ 3.6 = m/s.', `${Math.round(ms * 3.6)} ÷ 3.6 = <b>${ms} m/s</b>.`, 'Always check the unit matches the numbers you divided.'],
        finalAnswer: `${ms} m/s`,
      };
    },
  ];

  HL.registerTopic({
    id: 'motion', subject: 'science', strand: 'physical', order: 2,
    name: 'Speed & motion', short: 'Speed', animal: 'dolphin',
    blurb: 'How fast something goes, and how to read its journey off a graph.',
    example: 'speed = distance ÷ time · 100 m in 20 s = 5 m/s',
    learn: {
      what: '<p><b>Speed</b> tells you how much distance something covers in a certain time. The rule is <b>speed = distance ÷ time</b>, and you can turn it around to find a distance or a time. The unit comes straight from what you divided: metres ÷ seconds gives <b>m/s</b>, kilometres ÷ hours gives <b>km/h</b>.</p><p>A <b>distance-time graph</b> shows a whole journey at once. The steepness of the line is the speed: steeper means faster, and a flat line means stopped.</p><p><b>Picture for this topic:</b> Harper walking to the dairy. Every second she covers the same few metres — until she stops to pat a dog, and the line on her graph goes flat.</p>',
      visual: `<svg viewBox="0 0 350 210" width="350" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <polygon points="88,18 20,118 156,118" fill="#FBF1D3" stroke="#E8C24A" stroke-width="3"/>
        <line x1="42" y1="70" x2="134" y2="70" stroke="#E8C24A" stroke-width="3"/>
        <text x="88" y="58" text-anchor="middle" fill="#4A4033" font-size="19">d</text>
        <text x="62" y="106" text-anchor="middle" fill="#4A4033" font-size="19">s</text>
        <text x="88" y="106" text-anchor="middle" fill="#C98A1C" font-size="15">×</text>
        <text x="114" y="106" text-anchor="middle" fill="#4A4033" font-size="19">t</text>
        <text x="88" y="136" text-anchor="middle" fill="#9A6A0F" font-size="11">cover the one you want</text>
        <line x1="196" y1="26" x2="196" y2="124" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="196" y1="124" x2="338" y2="124" stroke="#4A4033" stroke-width="2.5"/>
        <polyline points="196,124 238,66 286,66 330,32" fill="none" stroke="#E0568C" stroke-width="3.5" stroke-linejoin="round"/>
        <text x="262" y="58" text-anchor="middle" fill="#3C6E96" font-size="11">flat = stopped</text>
        <text x="278" y="112" text-anchor="middle" fill="#C33C72" font-size="10.5">steeper = faster</text>
        <text x="188" y="76" text-anchor="middle" fill="#4A4033" font-size="10" transform="rotate(-90 188 76)">distance</text>
        <text x="267" y="140" text-anchor="middle" fill="#4A4033" font-size="10">time</text>
        <rect x="10" y="150" width="330" height="52" rx="10" fill="#E7F2FB" stroke="#5F98C4" stroke-width="2"/>
        <text x="175" y="172" text-anchor="middle" fill="#3C6E96" font-size="14">speed = distance ÷ time</text>
        <text x="175" y="192" text-anchor="middle" fill="#4A4033" font-size="10.5">distance = speed × time &#183; time = distance ÷ speed</text>
      </svg>`,
      facts: [
        '<b>speed = distance ÷ time</b> — say it every single time.',
        'Turn it round: <b>distance = speed × time</b>, <b>time = distance ÷ speed</b>.',
        'Units come from what you divided: m ÷ s = <b>m/s</b>; km ÷ h = <b>km/h</b>.',
        '<b>m/s → km/h: × 3.6.</b> <b>km/h → m/s: ÷ 3.6.</b>',
        '<b>Average speed</b> = total distance ÷ total time — stops count as time!',
        'Distance-time graph: <b>steeper = faster</b>, <b>flat = stopped</b>, <b>curving up = speeding up</b>.',
      ],
      steps: [
        'Write down what you are given and what you want: distance? time? speed?',
        'Draw the triangle: <b>d</b> on top, <b>s × t</b> underneath. Cover the one you want with your thumb, and the triangle shows you what to do.',
        'Do the sum, then write the <b>unit</b> straight away — m/s if you used metres and seconds, km/h if you used km and hours.',
        'Comparing two speeds? Put them in the <b>same unit</b> first (× 3.6 or ÷ 3.6), then compare.',
        'On a graph: find the section, read the distance it covered and the time it took, then divide. Flat section → speed is 0.',
      ],
      examples: [
        {
          q: 'A kererū flies 60 m in 5 seconds. What is its speed?',
          working: ['<b>Picture:</b> the triangle. I want <b>s</b>, so cover s → d over t.', '1. What do I have? distance 60 m, time 5 s.', '2. speed = distance ÷ time = 60 ÷ 5.', 'Units: metres and seconds → m/s.'],
          a: '12 m/s',
        },
        {
          q: 'A ferry sails at 15 m/s for 40 seconds. How far does it go?',
          working: ['<b>Picture:</b> cover <b>d</b> in the triangle → s × t is left.', '1. distance = speed × time.', '2. 15 × 40 = 600.', 'Units: m/s × s = metres.'],
          a: '600 m',
        },
        {
          q: 'A car drives 240 km at an average of 80 km/h. How long does it take?',
          working: ['<b>Picture:</b> cover <b>t</b> in the triangle → d over s is left.', '1. time = distance ÷ speed.', '2. 240 ÷ 80 = 3.', 'Units: km ÷ km/h = hours.'],
          a: '3 hours',
        },
        {
          q: 'Which is faster: 20 m/s or 60 km/h?',
          working: ['<b>Rule:</b> never compare two different units — change one first.', '1. 20 m/s × 3.6 = 72 km/h.', '2. 72 km/h vs 60 km/h.', '72 is bigger.'],
          a: '20 m/s is faster',
        },
        {
          q: 'Read the graph: in which section is the runner stopped, and how fast is section C?',
          visual: graphSvg(JOURNEYS[3], { title: 'a runner at cross-country' }),
          working: [
            '<b>Picture:</b> the line is her journey; steepness is her speed.',
            '1. Which bit is flat? Section <b>B</b> — 20 s to 40 s, distance stuck at 40 m. She is stopped.',
            '2. Section C: distance goes 40 m → 120 m, so 80 m.',
            '3. Time goes 40 s → 60 s, so 20 s.',
            '4. speed = 80 ÷ 20 = 4 m/s.',
          ],
          a: 'Stopped in section B; section C is 4 m/s',
        },
        {
          q: 'A tramper walks 9 km in 2 h, rests for 1 h, then walks 6 km in 2 h. What is her average speed?',
          visual: `<table class="data"><tr><th>part</th><th>distance</th><th>time</th></tr><tr><td>walk 1</td><td>9 km</td><td>2 h</td></tr><tr><td>rest</td><td>0 km</td><td>1 h</td></tr><tr><td>walk 2</td><td>6 km</td><td>2 h</td></tr><tr><th>total</th><th>15 km</th><th>5 h</th></tr></table>`,
          working: ['<b>Rule:</b> average speed = <b>total</b> distance ÷ <b>total</b> time.', '1. Total distance = 9 + 6 = 15 km.', '2. Total time = 2 + 1 + 2 = 5 h — the rest still counts as time.', '3. 15 ÷ 5 = 3.'],
          a: '3 km/h',
        },
        {
          q: 'Harper times her scooter over 30 m and gets 5.0 s, 6.0 s and 4.0 s. What speed should she report, and why not just use the first go?',
          working: [
            '<b>Picture:</b> three shots at goal tell you more than one.',
            '1. Average time = (5.0 + 6.0 + 4.0) ÷ 3 = 5.0 s.',
            '2. speed = distance ÷ time = 30 ÷ 5.0 = 6 m/s.',
            '3. One reading can be off because of reaction time on the stopwatch; averaging three evens that out.',
          ],
          a: '6 m/s, from the average of three timings',
        },
      ],
      tips: [
        'Always write the <b>unit</b>. "5" is not an answer; "5 m/s" is.',
        'Stops count! Average speed uses the <b>whole</b> time, including waiting at the lights.',
        'A flat line on a distance-time graph means <b>stopped</b>, not "going backwards" and not "steady speed".',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [speedCalc, distanceCalc, unitFact, graphStopped, graphMeaning, compareSpeeds, tableSpeed]
        : level === 2
          ? [speedCalc, distanceCalc, timeCalc, kmhCalc, unitFact, compareSpeeds, graphStopped, graphFastest, graphRead, graphShape, graphMeaning, tableSpeed]
          : [timeCalc, kmhCalc, convertUnits, compareMixed, averageSpeed, graphSpeedSection, graphFastest, graphRead, graphShape, speedCalc, tableSpeed];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
