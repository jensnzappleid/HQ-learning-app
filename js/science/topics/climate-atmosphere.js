/* Topic: Climate & the atmosphere — the gases, the layers, the ozone hole and sun safety,
 * the greenhouse effect, the evidence for climate change, and what is being done about it. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const GASES = [
    { name: 'nitrogen', pct: 78, note: 'by far the most common gas — it mostly just sits there', colour: '#A9D8F5' },
    { name: 'oxygen', pct: 21, note: 'the gas we breathe in, and the one fires need to burn', colour: '#8FC96E' },
    { name: 'argon', pct: 0.9, note: 'a gas that does not react with anything', colour: '#B9A5E6' },
    { name: 'carbon dioxide', pct: 0.04, note: 'tiny in amount, but plants need it and it traps heat', colour: '#E9A07A' },
  ];

  const LAYERS = [
    { n: 1, name: 'troposphere', top: '12 km', what: 'where all the weather, clouds and rain happen — and where we live', extra: 'It holds about three quarters of all the air.' },
    { n: 2, name: 'stratosphere', top: '50 km', what: 'calm, dry air with the ozone layer in it — this is where jet planes fly', extra: 'Planes fly here because there is no weather to bump them about.' },
    { n: 3, name: 'mesosphere', top: '85 km', what: 'the coldest layer, where meteors burn up and make shooting stars', extra: 'The air is far too thin to breathe.' },
    { n: 4, name: 'thermosphere', top: '600 km', what: 'very thin air, where the auroras glow and the space station orbits', extra: 'The few particles there are extremely hot, but there are hardly any of them.' },
  ];

  const GREENHOUSE_GASES = ['carbon dioxide', 'methane', 'water vapour', 'nitrous oxide'];
  const NOT_GREENHOUSE = ['nitrogen', 'oxygen', 'argon', 'helium'];

  const EVIDENCE = [
    { what: 'thermometer records', shows: 'the average world temperature has risen by about 1 °C in the last hundred years' },
    { what: 'tide gauges and satellites', shows: 'sea level has risen, so the sea reaches further up the beach in a storm' },
    { what: 'photos of the Southern Alps', shows: 'glaciers like Franz Josef and the Tasman Glacier have retreated a long way up their valleys' },
    { what: 'ice cores from Antarctica', shows: 'there is more carbon dioxide in the air now than at any time in the last 800 000 years' },
    { what: 'ocean measurements', shows: 'the sea is warmer and slightly more acidic than it used to be' },
    { what: 'records kept by gardeners and farmers', shows: 'spring events like blossom now happen earlier in the year' },
  ];

  const EFFECTS = [
    { effect: 'heavier downpours and more flooding', doing: 'councils are building bigger stormwater drains and better flood warnings' },
    { effect: 'longer droughts on the east coast', doing: 'farmers are storing more water and planting hardier crops' },
    { effect: 'higher seas eating into low coastal streets', doing: 'towns are mapping the risk and planning where to build (and where not to)' },
    { effect: 'less snow for the ski fields', doing: 'ski fields are making snow and running more summer activities' },
    { effect: 'warmer seas changing where fish and kelp live', doing: 'scientists track the changes so fishing limits can be adjusted' },
    { effect: 'more days of high fire risk', doing: 'fire services use daily fire-danger forecasts and ban fires early' },
    { effect: 'glaciers in the Southern Alps getting shorter', doing: 'they are measured every year by plane so the change is properly recorded' },
  ];

  const ACTIONS = [
    { do: 'making more electricity from wind, hydro, solar and geothermal', why: 'it replaces the coal and gas we would otherwise burn' },
    { do: 'driving electric cars, or taking the bus or bike', why: 'petrol and diesel are fossil fuels, and transport is one of our biggest sources' },
    { do: 'planting native forest', why: 'growing trees take carbon dioxide out of the air and lock it into wood' },
    { do: 'insulating houses properly', why: 'a warm house needs far less energy for heating' },
    { do: 'wasting less food', why: 'food that rots in a landfill makes methane, a strong greenhouse gas' },
    { do: 'using LED bulbs and switching things off', why: 'the last part of our electricity comes from burning gas and coal' },
    { do: 'walking or biking to school', why: 'short car trips are the easiest ones to swap' },
  ];

  const SUNSAFE = [
    { do: 'put on sunscreen of SPF 30 or higher', why: 'it blocks most of the UV that reaches your skin' },
    { do: 'wear a wide-brimmed hat', why: 'it shades your face, ears and neck, where sunburn is most common' },
    { do: 'stay in the shade between 10 a.m. and 4 p.m.', why: 'that is when the UV is strongest in New Zealand' },
    { do: 'wear sunglasses', why: 'UV damages your eyes as well as your skin' },
    { do: 'wear a t-shirt while swimming', why: 'cloth blocks UV, and water does not stop it' },
    { do: 'check the UV index before going out', why: 'when it is 3 or more you need protection' },
  ];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });

  /* ---------- diagrams ---------- */
  function layersSvg(highlight, blank) {
    const bands = [
      { name: 'thermosphere', y: 26, h: 30, fill: '#8E79C6', note: 'auroras, space station', top: '600 km' },
      { name: 'mesosphere', y: 58, h: 30, fill: '#B9A5E6', note: 'meteors burn up', top: '85 km' },
      { name: 'stratosphere', y: 90, h: 34, fill: '#A9D8F5', note: 'ozone layer, planes', top: '50 km' },
      { name: 'troposphere', y: 126, h: 34, fill: '#DCEEF9', note: 'weather, clouds, us', top: '12 km' },
    ];
    const rows = bands.map((b) => {
      const hi = highlight === b.name, hid = blank === b.name, mid = b.y + b.h / 2 + 4;
      return `<rect x="10" y="${b.y}" width="176" height="${b.h}" rx="5" fill="${b.fill}" stroke="${hi ? '#E0568C' : '#FFFFFF'}" stroke-width="${hi ? 3 : 2}"/>
        <text x="18" y="${mid}" fill="${hid ? '#C33C72' : INK}" font-size="12">${hid ? '?' : b.name}</text>
        <text x="180" y="${mid}" text-anchor="end" fill="#5B5044" font-size="11">${b.top}</text>
        <text x="194" y="${mid}" fill="${INK}" font-size="11">${hid ? '&#8212;' : b.note}</text>`;
    }).join('');
    return `<svg viewBox="0 0 350 200" width="350" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">the layers of the atmosphere</text>
      ${rows}
      <rect x="10" y="164" width="176" height="11" rx="3" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
      <text x="194" y="174" fill="${INK}" font-size="11">the ground (0 km)</text>
      <text x="175" y="194" text-anchor="middle" fill="#C33C72" font-size="12">the higher you go, the thinner the air</text>
    </svg>`;
  }

  function blanketSvg() {
    return `<svg viewBox="0 0 350 216" width="350" height="216" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">the greenhouse effect: a blanket</text>
      <circle cx="28" cy="48" r="14" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="28" y="76" text-anchor="middle" fill="#9A6A0F" font-size="11.5">Sun</text>
      <rect x="10" y="96" width="330" height="18" rx="9" fill="#B9A5E6" stroke="#8E79C6" stroke-width="2"/>
      <text x="175" y="109" text-anchor="middle" fill="#3F3070" font-size="11.5">blanket of greenhouse gases</text>
      <line x1="44" y1="64" x2="88" y2="136" stroke="#E8C24A" stroke-width="4"/><polygon points="94,146 82,140 90,130" fill="#E8C24A"/>
      <text x="70" y="162" text-anchor="middle" fill="#9A6A0F" font-size="11.5">sunlight in</text>
      <line x1="196" y1="146" x2="196" y2="124" stroke="#E9A07A" stroke-width="4"/><polygon points="196,114 189,126 203,126" fill="#E9A07A"/>
      <text x="196" y="162" text-anchor="middle" fill="#A5603A" font-size="11.5">heat rises</text>
      <line x1="296" y1="118" x2="296" y2="136" stroke="#E0568C" stroke-width="4"/><polygon points="296,146 289,134 303,134" fill="#E0568C"/>
      <text x="296" y="162" text-anchor="middle" fill="#C33C72" font-size="11.5">bounced back</text>
      <rect x="10" y="170" width="330" height="24" rx="6" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
      <text x="175" y="186" text-anchor="middle" fill="#2F5A1C" font-size="12">the Earth&#8217;s surface warms up</text>
      <text x="175" y="210" text-anchor="middle" fill="${INK}" font-size="12">more greenhouse gas = warmer Earth</text>
    </svg>`;
  }

  function graphSvg(pts, markIndex) {
    // pts: [[year, temp]] — a simple line graph to read values off
    const x0 = 44, y0 = 152, w = 274, h = 108;
    const years = pts.map((p) => p[0]), temps = pts.map((p) => p[1]);
    const yMin = 13, yMax = 17;
    const px = (yr) => x0 + ((yr - years[0]) / (years[years.length - 1] - years[0])) * w;
    const py = (t) => y0 - ((t - yMin) / (yMax - yMin)) * h;
    const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join(' ');
    const dots = pts.map((p, i) => `<circle cx="${px(p[0]).toFixed(1)}" cy="${py(p[1]).toFixed(1)}" r="${i === markIndex ? 6 : 4}" fill="${i === markIndex ? '#E0568C' : '#5F98C4'}"/>`).join('');
    const xlab = pts.map((p) => `<text x="${px(p[0]).toFixed(1)}" y="${y0 + 18}" text-anchor="middle" fill="${INK}" font-size="11">${p[0]}</text>`).join('');
    const ylab = [13, 14, 15, 16, 17].map((t) => `<text x="36" y="${(py(t) + 4).toFixed(1)}" text-anchor="end" fill="${INK}" font-size="11">${t}</text>
      <line x1="${x0}" y1="${py(t).toFixed(1)}" x2="${x0 + w}" y2="${py(t).toFixed(1)}" stroke="#EFE7D8" stroke-width="1.5"/>`).join('');
    return `<svg viewBox="0 0 350 196" width="350" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">average temperature at one NZ town (°C)</text>
      ${ylab}
      <line x1="${x0}" y1="26" x2="${x0}" y2="${y0}" stroke="${INK}" stroke-width="2"/>
      <line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="${INK}" stroke-width="2"/>
      <path d="${line}" fill="none" stroke="#5F98C4" stroke-width="3"/>
      ${dots}${xlab}
      <text x="14" y="90" fill="${INK}" font-size="11" transform="rotate(-90 14 90)" text-anchor="middle">°C</text>
      <text x="181" y="190" text-anchor="middle" fill="${INK}" font-size="11.5">year</text>
    </svg>`;
  }

  function gasPieSvg() {
    const slices = [{ pct: 78, colour: '#A9D8F5' }, { pct: 21, colour: '#8FC96E' }, { pct: 1, colour: '#B9A5E6' }];
    let a = -Math.PI / 2, arcs = '';
    const cx = 74, cy = 108, r = 54;
    slices.forEach((s) => {
      const a2 = a + (s.pct / 100) * Math.PI * 2;
      arcs += `<path d="M ${cx} ${cy} L ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} A ${r} ${r} 0 ${s.pct > 50 ? 1 : 0} 1 ${(cx + r * Math.cos(a2)).toFixed(1)} ${(cy + r * Math.sin(a2)).toFixed(1)} Z" fill="${s.colour}" stroke="#FFFFFF" stroke-width="2"/>`;
      a = a2;
    });
    return `<svg viewBox="0 0 350 200" width="350" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">what the air is made of</text>
      ${arcs}
      ${[['nitrogen 78%', '#A9D8F5', 58], ['oxygen 21%', '#8FC96E', 92], ['everything else 1%', '#B9A5E6', 126]].map(([t, c, y]) =>
        `<rect x="152" y="${y - 11}" width="13" height="13" rx="3" fill="${c}" stroke="#FFFFFF" stroke-width="1"/><text x="172" y="${y}" fill="${INK}" font-size="12">${t}</text>`).join('')}
      <text x="152" y="152" fill="#A5603A" font-size="11">of that 1%, CO&#8322; is only 0.04%</text>
      <text x="175" y="182" text-anchor="middle" fill="#C33C72" font-size="12">tiny slice, huge job: CO&#8322; traps heat</text>
    </svg>`;
  }

  const TEMP_SERIES = () => {
    const base = R.pick([13.4, 13.6, 14.0]);
    const rises = [0, 0.2, 0.4, 0.8, 1.2, 1.6];
    const years = [1920, 1940, 1960, 1980, 2000, 2020];
    return years.map((y, i) => [y, Math.round((base + rises[i]) * 10) / 10]);
  };

  /* ---------- question makers ---------- */
  function gasPct() {
    const g = R.pick(GASES.slice(0, 2));
    return {
      visual: gasPieSvg(),
      prompt: `About what percentage of the air is <b>${g.name}</b>?`,
      answer: { type: 'number', value: g.pct, unit: '%', placeholder: 'e.g. 78' },
      hint: 'Nitrogen is about 78%, oxygen about 21%. Everything else is about 1%.',
      working: ['<b>Picture:</b> if the air were 100 marbles, 78 would be nitrogen and 21 would be oxygen.', `${cap(g.name)} is about <b>${g.pct}%</b>.`],
      finalAnswer: `about ${g.pct}%`, skill: 'gases',
    };
  }
  function gasLeftover() {
    return {
      visual: gasPieSvg(),
      prompt: 'Nitrogen is about 78% of the air and oxygen is about 21%. What percentage is left for every other gas put together?',
      answer: { type: 'number', value: 1, unit: '%', placeholder: 'e.g. 1' },
      hint: 'The whole pie is 100%. Take off the two big slices.',
      working: ['<b>Rule:</b> the whole pie is 100%.', '1. 78 + 21 = 99.', '2. 100 − 99 = <b>1%</b>.', 'Carbon dioxide is only about 0.04% of that — tiny, but it still traps heat.'],
      finalAnswer: '1%', skill: 'gases',
    };
  }
  function gasRole() {
    const g = R.pick(GASES);
    const c = choice(g.note, GASES.filter((x) => x.name !== g.name).map((x) => x.note), 4);
    return {
      prompt: `What is <b>${g.name}</b> like in the air?`,
      answer: ans(c),
      hint: 'Which gas do we breathe, which one is just filler, and which one traps heat?',
      working: [`${cap(g.name)} is about ${g.pct}% of the air.`, `It is <b>${g.note}</b>.`],
      finalAnswer: g.note, skill: 'gases',
    };
  }
  const GB_TEXT = [
    { p: 'Which gas is the <b>most common</b> in air?', a: 'nitrogen', accept: [] },
    { p: 'Which gas in the air do we <b>breathe in and use</b>?', a: 'oxygen', accept: [] },
    { p: 'Which gas do plants take in for photosynthesis?', a: 'carbon dioxide', accept: ['co2'] },
  ];
  const GB_CHOICE = [
    { p: 'Carbon dioxide is only about 0.04% of the air. Does that make it unimportant?', a: 'No — it traps heat and plants need it, so a small change matters a lot', w: ['Yes, it is far too small to matter', 'Yes, because plants ignore it', 'No, because it is really 40% of the air'] },
  ];
  function gasBiggest() {
    if (R.chance(0.7)) {
      const q = R.pick(GB_TEXT);
      return {
        visual: gasPieSvg(),
        prompt: q.p, answer: textAns(q.a, q.accept, 'one word'),
        hint: 'Nitrogen 78%, oxygen 21%, carbon dioxide only 0.04% — but that little slice traps heat.',
        working: ['<b>Picture:</b> 100 marbles of air: 78 nitrogen, 21 oxygen, 1 everything else.', `Answer: <b>${q.a}</b>.`],
        finalAnswer: q.a, skill: 'gases',
      };
    }
    const q = R.pick(GB_CHOICE);
    const c = choice(q.a, q.w, 4);
    return {
      visual: gasPieSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Nitrogen 78%, oxygen 21%, carbon dioxide only 0.04% — but that little slice traps heat.',
      working: ['<b>Picture:</b> 100 marbles of air: 78 nitrogen, 21 oxygen, 1 everything else.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'gases',
    };
  }
  function layerName() {
    const l = R.pick(LAYERS);
    return {
      visual: layersSvg(l.name, l.name),
      prompt: `Which layer of the atmosphere is <b>${l.what}</b>?`,
      answer: textAns(l.name, [], 'one word'),
      hint: 'Order from the ground up: troposphere, stratosphere, mesosphere, thermosphere.',
      working: ['<b>Picture:</b> four blankets stacked on the Earth, thinnest air at the top.', `Layer ${l.n} up is the <b>${l.name}</b>: ${l.what}.`],
      finalAnswer: l.name, skill: 'layers',
    };
  }
  function layerWhat() {
    const l = R.pick(LAYERS);
    const c = choice(l.what, LAYERS.filter((x) => x.name !== l.name).map((x) => x.what), 4);
    return {
      visual: layersSvg(l.name),
      prompt: `What happens in the <b>${l.name}</b>?`,
      answer: ans(c),
      hint: 'Weather is lowest down; ozone and planes are next; then meteors; then space.',
      working: [`<b>Picture:</b> the ${l.name} is layer ${l.n} counting up from the ground.`, `It is <b>${l.what}</b>.`, l.extra],
      finalAnswer: l.what, skill: 'layers',
    };
  }
  function layerOrder() {
    const i = R.int(0, LAYERS.length - 2);
    const up = R.chance(0.7);
    const want = up ? LAYERS[i + 1].name : LAYERS[i].name;
    const from = up ? LAYERS[i].name : LAYERS[i + 1].name;
    return {
      visual: layersSvg(from),
      prompt: `Which layer comes straight <b>${up ? 'above' : 'below'}</b> the <b>${from}</b>?`,
      answer: textAns(want, [], 'one word'),
      hint: 'From the ground up: troposphere → stratosphere → mesosphere → thermosphere.',
      working: ['<b>Memory hook:</b> <b>T</b>errible <b>S</b>torms <b>M</b>ake <b>T</b>rouble — troposphere, stratosphere, mesosphere, thermosphere.', `${up ? 'Above' : 'Below'} the ${from} is the <b>${want}</b>.`],
      finalAnswer: want, skill: 'layers',
    };
  }
  const LW_TEXT = [
    { p: 'In which layer does <b>all our weather</b> happen?', a: 'troposphere' },
    { p: 'In which layer do <b>jet planes</b> fly on a long trip?', a: 'stratosphere' },
    { p: 'In which layer is the <b>ozone layer</b>?', a: 'stratosphere' },
    { p: 'In which layer do <b>meteors burn up</b> as shooting stars?', a: 'mesosphere' },
    { p: 'In which layer does the <b>space station</b> orbit?', a: 'thermosphere' },
    { p: 'Which layer are you standing in right now?', a: 'troposphere' },
  ];
  const LW_CHOICE = [
    { p: 'Why do long-distance planes fly in the stratosphere?', a: 'The air is calm and dry there, with no weather to bump them', w: ['It is closer to the Sun', 'There is more oxygen there', 'The ozone pushes them along'] },
  ];
  function layerWhere() {
    if (R.chance(0.75)) {
      const q = R.pick(LW_TEXT);
      return {
        visual: layersSvg(),
        prompt: q.p, answer: textAns(q.a, [], 'one word'),
        hint: 'Weather at the bottom, ozone and planes next, meteors above that, space station at the top.',
        working: ['<b>Picture:</b> the layer diagram, ground at the bottom.', `Answer: <b>${q.a}</b>.`],
        finalAnswer: q.a, skill: 'layers',
      };
    }
    const q = R.pick(LW_CHOICE);
    const c = choice(q.a, q.w, 4);
    return {
      visual: layersSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Weather at the bottom, ozone and planes next, meteors above that, space station at the top.',
      working: ['<b>Picture:</b> the layer diagram, ground at the bottom.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'layers',
    };
  }
  function ozoneQ() {
    const q = R.pick([
      { p: 'What does the <b>ozone layer</b> do?', a: 'It soaks up most of the harmful UV from the Sun', w: ['It keeps the Earth warm like a blanket', 'It gives us the oxygen we breathe', 'It makes the clouds and rain'] },
      { p: 'What made the hole in the ozone layer?', a: 'Chemicals called CFCs that used to be in fridges and spray cans', w: ['Carbon dioxide from cars', 'Volcanic ash', 'Too much oxygen'] },
      { p: 'Where is the ozone hole?', a: 'Over Antarctica, close to New Zealand', w: ['Over the Arctic', 'Over the equator', 'Over Australia only'] },
      { p: 'Why does the ozone hole matter to people in Aotearoa?', a: 'We are close to it, so more UV reaches us and we burn faster', w: ['It makes our winters colder', 'It causes earthquakes', 'It blocks our internet'] },
      { p: 'What is being done about the ozone hole?', a: 'CFCs were banned worldwide, and the hole is slowly healing', w: ['Nothing can be done', 'Ozone is being pumped up by rockets', 'The hole was filled with concrete'] },
      { p: 'Is the ozone hole the same thing as the greenhouse effect?', a: 'No — ozone is about UV rays; the greenhouse effect is about trapped heat', w: ['Yes, they are two names for one thing', 'Yes, both are caused by CFCs', 'No, but both are about oxygen'] },
      { p: 'New Zealand has some of the strongest UV in the world. Why?', a: 'Thin ozone above us, clean clear air, and we are closer to the Sun in summer', w: ['We are nearest the equator', 'Our air is very polluted', 'The Sun is bigger here'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Ozone = the sunblock in the stratosphere. Greenhouse gases = the blanket lower down. Two different jobs.',
      working: ['<b>Picture:</b> the ozone layer is the Earth’s sunscreen, sitting up in the stratosphere.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'ozone',
    };
  }
  function sunSafeQ() {
    const s = R.pick(SUNSAFE);
    const c = choice(s.why, SUNSAFE.filter((x) => x.do !== s.do).map((x) => x.why));
    return {
      prompt: `Why should you <b>${s.do}</b>?`,
      answer: ans(c),
      hint: 'UV is invisible and it still gets through cloud and water.',
      working: ['<b>Picture:</b> UV is invisible light that burns — you cannot feel it happening.', `Reason: <b>${s.why}</b>.`, 'Slip, slop, slap and wrap: shirt, sunscreen, hat, sunglasses.'],
      finalAnswer: s.why, skill: 'sun-safety',
    };
  }
  function uvIndexQ() {
    const uv = R.pick([1, 2, 3, 5, 8, 11, 12]);
    const need = uv >= 3;
    const c = choice(need ? 'Yes — at 3 or more you need sun protection' : 'No — below 3 you do not need protection',
      ['Yes — at 3 or more you need sun protection', 'No — below 3 you do not need protection'], 2);
    return {
      prompt: `The UV index today is <b>${uv}</b>. Does Harper need a hat and sunscreen?`,
      answer: ans(c),
      hint: 'The rule is simple: UV index 3 or more means protect yourself.',
      working: ['<b>Rule:</b> UV index <b>3 or more</b> = sun protection needed.', `Today it is ${uv}, which is <b>${need ? '3 or more' : 'under 3'}</b>.`, `So the answer is <b>${need ? 'yes' : 'no'}</b>. In a NZ summer it is often 11 or 12.`],
      finalAnswer: need ? 'Yes' : 'No', skill: 'sun-safety',
    };
  }
  const GH_TEXT = [
    { p: 'Which of these is a greenhouse gas — carbon dioxide, nitrogen or oxygen?', a: 'carbon dioxide', accept: ['co2'] },
    { p: 'Name a greenhouse gas that comes mostly from farm animals.', a: 'methane', accept: [] },
    { p: 'Which gas makes up most of the air but is NOT a greenhouse gas?', a: 'nitrogen', accept: [] },
  ];
  const GH_CHOICE = [
    { p: 'What is the <b>greenhouse effect</b>?', a: 'Gases in the air let sunlight in but stop some heat escaping, like a blanket', w: ['The ozone layer blocking UV rays', 'The Sun getting hotter each year', 'Clouds reflecting rain back down'] },
    { p: 'Is the natural greenhouse effect a good thing?', a: 'Yes — without it the Earth would be about 30 °C colder and frozen', w: ['No, it is always harmful', 'It makes no difference at all', 'Yes, because it blocks UV'] },
    { p: 'What is the problem we have now?', a: 'Burning fossil fuels adds extra greenhouse gas, making the blanket thicker', w: ['The greenhouse effect has stopped', 'The Sun has moved closer', 'The ozone hole traps the heat'] },
    { p: 'Where does the extra carbon dioxide mainly come from?', a: 'Burning fossil fuels — coal, oil and natural gas', w: ['Breathing out', 'Volcanoes only', 'The ozone hole'] },
    { p: 'Where does most of New Zealand’s methane come from?', a: 'Farm animals, especially cows and sheep', w: ['Car exhausts', 'Wind turbines', 'The ocean'] },
    { p: 'In the blanket picture, what does a THICKER blanket mean?', a: 'Less heat escapes, so it gets warmer', w: ['More heat escapes, so it gets colder', 'The Sun shines less', 'Nothing changes'] },
  ];
  function greenhouseQ() {
    if (R.chance(0.35)) {
      const q = R.pick(GH_TEXT);
      return {
        visual: blanketSvg(),
        prompt: q.p, answer: textAns(q.a, q.accept, 'one word'),
        hint: 'The main greenhouse gases are carbon dioxide, methane, water vapour and nitrous oxide. Nitrogen and oxygen are not.',
        working: ['<b>List to remember:</b> carbon dioxide, methane, water vapour, nitrous oxide.', `Answer: <b>${q.a}</b>.`],
        finalAnswer: q.a, skill: 'greenhouse',
      };
    }
    const q = R.pick(GH_CHOICE);
    const c = choice(q.a, q.w, 4);
    return {
      visual: blanketSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Picture a blanket: sunlight gets in easily, but some of the heat trying to leave gets bounced back.',
      working: [
        '<b>Picture:</b> a blanket on a bed. Your body heat still escapes, just more slowly — so you get warmer.',
        '1. Natural greenhouse effect = the blanket we need. Without it Earth would be frozen.',
        '2. Extra greenhouse gas from burning fuel = a <b>thicker</b> blanket = extra warming.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'greenhouse',
    };
  }
  function greenhouseGasSort() {
    const isGh = R.chance(0.5);
    const g = isGh ? R.pick(GREENHOUSE_GASES) : R.pick(NOT_GREENHOUSE);
    const c = choice(isGh ? 'Yes, it is a greenhouse gas' : 'No, it is not a greenhouse gas',
      ['Yes, it is a greenhouse gas', 'No, it is not a greenhouse gas'], 2);
    return {
      prompt: `Is <b>${g}</b> a greenhouse gas?`,
      answer: ans(c),
      hint: 'The main greenhouse gases are carbon dioxide, methane, water vapour and nitrous oxide. Nitrogen and oxygen are not.',
      working: [
        '<b>List to remember:</b> carbon dioxide, methane, water vapour, nitrous oxide.',
        `${cap(g)} is ${isGh ? 'on that list' : 'not on that list'}.`,
        `So: <b>${isGh ? 'yes' : 'no'}</b>.`,
      ],
      finalAnswer: isGh ? 'Yes' : 'No', skill: 'greenhouse',
    };
  }
  function evidenceQ() {
    const e = R.pick(EVIDENCE);
    const c = choice(e.shows, EVIDENCE.filter((x) => x.what !== e.what).map((x) => x.shows));
    return {
      prompt: `Scientists use <b>${e.what}</b> as evidence. What do they show?`,
      answer: ans(c),
      hint: 'Match the measurement to the thing it actually measures.',
      working: ['<b>Picture:</b> evidence is measurements written down over many years, not one hot day.', `${cap(e.what)} show that <b>${e.shows}</b>.`],
      finalAnswer: e.shows, skill: 'evidence',
    };
  }
  function graphRead() {
    const pts = TEMP_SERIES();
    const i = R.int(0, pts.length - 1);
    return {
      visual: graphSvg(pts, i),
      prompt: `Read the graph. What was the average temperature in <b>${pts[i][0]}</b>?`,
      answer: { type: 'number', value: pts[i][1], unit: '°C', tolerance: 0.06, placeholder: 'e.g. 14.2' },
      hint: 'Find the year on the bottom, go straight up to the pink dot, then straight across to the °C scale.',
      working: [`1. Find <b>${pts[i][0]}</b> along the bottom.`, '2. Go up to the marked point.', `3. Read across: <b>${pts[i][1]} °C</b>.`],
      finalAnswer: `${pts[i][1]} °C`, skill: 'graph',
    };
  }
  function graphRise() {
    const pts = TEMP_SERIES();
    const a = R.int(0, 2), b = R.int(3, pts.length - 1);
    const rise = Math.round((pts[b][1] - pts[a][1]) * 10) / 10;
    return {
      visual: graphSvg(pts, b),
      prompt: `Read the graph. How much warmer was <b>${pts[b][0]}</b> than <b>${pts[a][0]}</b>?`,
      answer: { type: 'number', value: rise, unit: '°C', tolerance: 0.06, placeholder: 'e.g. 1.2' },
      hint: 'Read both temperatures, then subtract the older one from the newer one.',
      working: [`1. ${pts[a][0]}: ${pts[a][1]} °C.`, `2. ${pts[b][0]}: ${pts[b][1]} °C.`, `3. ${pts[b][1]} − ${pts[a][1]} = <b>${rise} °C</b> warmer.`, 'A degree or two sounds small, but it is an average over the whole year and the whole world.'],
      finalAnswer: `${rise} °C`, skill: 'graph',
    };
  }
  function graphTrend() {
    const pts = TEMP_SERIES();
    const c = choice('It has gone up over the whole hundred years', ['It has gone down steadily', 'It has stayed exactly the same', 'It jumps up and down with no pattern'], 4);
    return {
      visual: graphSvg(pts, -1),
      prompt: 'Look at the whole line on the graph. What is the <b>trend</b>?',
      answer: ans(c),
      hint: 'A trend is the overall direction, not what one single point does.',
      working: ['<b>Picture:</b> stand back from the graph and look at the shape of the whole line.', `1. Start: ${pts[0][1]} °C. End: ${pts[pts.length - 1][1]} °C.`, '2. The line climbs from left to right.', 'So the trend is <b>upwards</b>.'],
      finalAnswer: 'It has gone up', skill: 'graph',
    };
  }
  function effectQ() {
    const e = R.pick(EFFECTS);
    if (R.chance(0.5)) {
      const c = choice(e.doing, EFFECTS.filter((x) => x.effect !== e.effect).map((x) => x.doing));
      return {
        prompt: `Aotearoa is getting <b>${e.effect}</b>. What are people doing about it?`,
        answer: ans(c),
        hint: 'Every problem on this list has people working on it. Match the action to the problem.',
        working: [`<b>Problem:</b> ${e.effect}.`, `<b>Being done:</b> ${e.doing}.`, 'Naming the effect AND the response is what a good answer looks like.'],
        finalAnswer: e.doing, skill: 'effects',
      };
    }
    const c = choice(e.effect, EFFECTS.filter((x) => x.effect !== e.effect).map((x) => x.effect));
    return {
      prompt: `In Aotearoa, ${e.doing}. Which change is that a response to?`,
      answer: ans(c),
      hint: 'Read what is being done, and ask what problem it fixes.',
      working: [`<b>Being done:</b> ${e.doing}.`, `That is a response to <b>${e.effect}</b>.`],
      finalAnswer: e.effect, skill: 'effects',
    };
  }
  function actionQ() {
    const a = R.pick(ACTIONS);
    if (R.chance(0.5)) {
      const c = choice(a.why, ACTIONS.filter((x) => x.do !== a.do).map((x) => x.why));
      return {
        prompt: `Why does <b>${a.do}</b> cut greenhouse gases?`,
        answer: ans(c),
        hint: 'Ask: which fuel is not being burnt now, or where is the carbon going instead?',
        working: [`<b>Action:</b> ${a.do}.`, `<b>Reason:</b> ${a.why}.`],
        finalAnswer: a.why, skill: 'actions',
      };
    }
    const c = choice(cap(a.do), ACTIONS.filter((x) => x.do !== a.do).map((x) => cap(x.do)));
    return {
      prompt: `Which action helps because <i>${a.why}</i>?`,
      answer: ans(c),
      hint: 'Match the reason back to the action that causes it.',
      working: [`<b>Reason:</b> ${a.why}.`, `<b>Action:</b> ${cap(a.do)}.`],
      finalAnswer: cap(a.do), skill: 'actions',
    };
  }
  function mixUpQ() {
    const q = R.pick([
      { p: 'What is the difference between the <b>ozone hole</b> and the <b>greenhouse effect</b>?', a: 'Ozone is about UV getting in; the greenhouse effect is about heat not getting out', w: ['They are exactly the same thing', 'Ozone is about heat; greenhouse is about UV', 'Both are caused by cows'] },
      { p: 'What is the difference between <b>weather</b> and <b>climate</b>?', a: 'Weather is today; climate is the pattern over many years', w: ['Weather is worldwide; climate is local', 'Climate is today; weather is over years', 'They mean the same thing'] },
      { p: 'It snowed one cold day. Does that prove the climate is not warming?', a: 'No — one cold day is weather; climate is the average over many years', w: ['Yes, snow proves it is cooling', 'Yes, because it was very cold', 'No, because it never snows in New Zealand'] },
      { p: 'Where does the extra heat mostly go?', a: 'Into the oceans, which is why the sea is warmer and rising', w: ['Into space straight away', 'Into the ozone layer', 'Nowhere — it disappears'] },
      { p: 'Why is sea level rising?', a: 'Warm water takes up more room, and melting ice adds more water', w: ['Rivers have got wider', 'The Moon is closer', 'There is more rain in the sea'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Ozone = sunscreen (UV in). Greenhouse gases = blanket (heat out). Weather = today, climate = the long pattern.',
      working: ['<b>Two different jobs:</b> the ozone layer blocks UV coming in; greenhouse gases slow heat going out.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'ideas',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('The stratosphere — it is calm and dry with no weather', ['The troposphere — it has the most oxygen', 'The mesosphere — it is coldest', 'The thermosphere — it is closest to space'], 4);
      return {
        visual: layersSvg('stratosphere'),
        prompt: 'Harper flies to Australia. The pilot says they are cruising at 11 km, just above the clouds. Which layer are they in, and why fly there?',
        answer: ans(c),
        hint: 'Where does weather stop? Just above that is a very smooth ride.',
        working: [
          '<b>Picture:</b> the layer diagram — weather only fills the bottom layer.',
          '1. The troposphere goes up to about 12 km, and all the weather is in it.',
          '2. Just above it is the <b>stratosphere</b>: calm, dry, no storms.',
          'That is why long flights cruise up there.',
        ],
        finalAnswer: 'The stratosphere — calm air with no weather',
      };
    },
    () => {
      const c = choice('The UV is very strong here, and it burns even when the air feels cool', ['UV only burns you when you feel hot', 'Cloud stops all UV', 'Wind burns your skin, not the Sun'], 4);
      return {
        prompt: 'It is a breezy, cloudy Wellington day and Harper does not feel hot, but she still gets badly sunburnt. Explain why.',
        answer: ans(c),
        hint: 'Heat and UV are different things. Which one burns you?',
        working: [
          '<b>Picture:</b> UV is invisible — you cannot feel it arriving.',
          '1. Feeling hot is about heat, not UV.',
          '2. UV goes through thin cloud and reflects off water and sand.',
          '3. New Zealand’s UV is very strong: thin ozone above us and clean, clear air.',
          'So: hat, shirt, shade and SPF 30+ even on a cool day.',
        ],
        finalAnswer: 'UV burns you even when it does not feel hot',
      };
    },
    () => {
      const pts = TEMP_SERIES();
      const rise = Math.round((pts[pts.length - 1][1] - pts[0][1]) * 10) / 10;
      return {
        visual: graphSvg(pts, pts.length - 1),
        prompt: `Harper has to describe this graph in her report. How much has the average temperature risen from ${pts[0][0]} to ${pts[pts.length - 1][0]}?`,
        answer: { type: 'number', value: rise, unit: '°C', tolerance: 0.06, placeholder: 'e.g. 1.6' },
        hint: 'Read the first point and the last point, then subtract.',
        working: [`1. ${pts[0][0]}: ${pts[0][1]} °C.`, `2. ${pts[pts.length - 1][0]}: ${pts[pts.length - 1][1]} °C.`, `3. ${pts[pts.length - 1][1]} − ${pts[0][1]} = <b>${rise} °C</b>.`, 'That is an <b>average</b> — some days are still cold.'],
        finalAnswer: `${rise} °C`,
      };
    },
    () => {
      const c = choice('No — one hot day is weather; climate is the average over many years', ['Yes, one hot day proves it', 'Yes, if it is the hottest day ever', 'No, because temperature does not matter'], 4);
      return {
        prompt: 'Harper’s friend says "It was 30 °C in Christchurch yesterday, so that proves the climate is changing." Is that good evidence?',
        answer: ans(c),
        hint: 'What is the difference between weather and climate?',
        working: [
          '<b>Picture:</b> one photo vs a whole photo album.',
          '1. Weather = what happened yesterday.',
          '2. Climate = the pattern over 30 years or more.',
          '3. Good evidence uses <b>long records</b>: thermometers, sea level, glacier photos.',
          'So one hot day is not proof — but a rising 100-year line is.',
        ],
        finalAnswer: 'No — that is weather, not climate',
      };
    },
    () => {
      const e = R.pick(EFFECTS);
      const c = choice(e.doing, EFFECTS.filter((x) => x.effect !== e.effect).map((x) => x.doing));
      return {
        prompt: `Harper’s class is making a poster about <b>${e.effect}</b> in Aotearoa. The last box says "what people are doing". What goes in it?`,
        answer: ans(c),
        hint: 'Every effect has people already working on it. Match the action to this problem.',
        working: [`<b>Effect:</b> ${e.effect}.`, `<b>Response:</b> ${e.doing}.`, 'Always finish with what is being done — the problem is real, and so is the work on it.'],
        finalAnswer: e.doing,
      };
    },
    () => {
      const c = choice('Comparing old photos of the glacier with new ones from the same spot', ['Asking people what they remember', 'Measuring how cold the ice feels', 'Counting the tourists each year'], 4);
      return {
        prompt: 'Scientists say the Franz Josef and Tasman glaciers in the Southern Alps have retreated. How would you show that with evidence?',
        answer: ans(c),
        hint: 'Evidence means a measurement or a record you can check, taken the same way each time.',
        working: [
          '<b>Picture:</b> two photos taken from the exact same rock, 100 years apart.',
          '1. Same spot, same view, different year → you can measure how far the ice has gone back.',
          '2. Aerial surveys are flown every year to measure the ice properly.',
          'That is proper evidence: repeatable measurements, not memories.',
        ],
        finalAnswer: 'Repeat photographs and yearly surveys from the same place',
      };
    },
    () => {
      const a = R.pick(ACTIONS);
      const c = choice(cap(a.do), ACTIONS.filter((x) => x.do !== a.do).map((x) => cap(x.do)));
      return {
        prompt: `Harper’s family wants to cut their greenhouse gases. Which action works because <i>${a.why}</i>?`,
        answer: ans(c),
        hint: 'Follow the reason back to the thing that causes it.',
        working: [`<b>Reason:</b> ${a.why}.`, `<b>So the action is:</b> ${cap(a.do)}.`],
        finalAnswer: cap(a.do),
      };
    },
    () => {
      const c = choice('The blanket gets thicker, so less heat escapes and it warms up', ['The blanket gets thinner and it cools down', 'Nothing changes at all', 'The Sun starts giving out more heat'], 4);
      return {
        visual: blanketSvg(),
        prompt: 'Harper adds more carbon dioxide to her model of the atmosphere. Using the blanket picture, what should she predict?',
        answer: ans(c),
        hint: 'More greenhouse gas = a thicker blanket. What does a thicker blanket do?',
        working: [
          '<b>Picture:</b> adding a second blanket to your bed.',
          '1. Sunlight still comes in the same as before.',
          '2. More greenhouse gas means <b>more heat is bounced back down</b>.',
          '3. So the surface gets <b>warmer</b>.',
        ],
        finalAnswer: 'A thicker blanket, so it gets warmer',
      };
    },
    () => {
      const c = choice('No — without any greenhouse effect the Earth would be frozen; the problem is the EXTRA amount', ['Yes, all greenhouse gases should be removed', 'Yes, because they block the Sun', 'No, because they do not really trap heat'], 4);
      return {
        prompt: 'Harper writes: "Greenhouse gases are bad and we should get rid of them all." Is that right?',
        answer: ans(c),
        hint: 'What would the Earth be like with no blanket at all?',
        working: [
          '<b>Picture:</b> a blanket in winter — you need one, you just do not want five.',
          '1. The <b>natural</b> greenhouse effect keeps the Earth about 30 °C warmer than it would be. Without it, everything freezes.',
          '2. The problem is the <b>extra</b> gas from burning fossil fuels.',
          'So the aim is to stop adding more, not to remove the effect.',
        ],
        finalAnswer: 'No — the natural effect is needed; the extra is the problem',
      };
    },
    () => {
      const g = R.pick(GASES.slice(0, 2));
      return {
        visual: gasPieSvg(),
        prompt: `Harper is drawing a pie chart of the air for her book. About what percentage should she make the <b>${g.name}</b> slice?`,
        answer: { type: 'number', value: g.pct, unit: '%', placeholder: 'e.g. 78' },
        hint: 'Nitrogen takes up most of it; oxygen is about a fifth.',
        working: ['<b>Picture:</b> 100 marbles of air: 78 nitrogen, 21 oxygen, 1 other.', `${cap(g.name)} = about <b>${g.pct}%</b>.`],
        finalAnswer: `${g.pct}%`,
      };
    },
    () => {
      const c = choice('Check the UV index and slip, slop, slap and wrap when it is 3 or more', ['Only wear sunscreen if it feels hot', 'Only worry about the Sun in the middle of winter', 'Stay inside all summer'], 4);
      return {
        prompt: 'Harper’s school is writing a summer sun-safety rule for the whole class. What should it say?',
        answer: ans(c),
        hint: 'What number on the UV index means you need protection?',
        working: [
          '<b>Rule:</b> UV index <b>3 or more</b> = protect yourself.',
          '1. Slip on a shirt, slop on SPF 30+, slap on a hat, wrap on sunglasses.',
          '2. Stay in the shade between 10 a.m. and 4 p.m.',
          'New Zealand’s UV is among the strongest in the world, so this matters here.',
        ],
        finalAnswer: 'Check the UV index; at 3 or more, slip, slop, slap and wrap',
      };
    },
    () => {
      const l = R.pick(LAYERS);
      const c = choice(l.name, LAYERS.filter((x) => x.name !== l.name).map((x) => x.name), 4);
      return {
        visual: layersSvg(l.name, l.name),
        prompt: `Harper is labelling a diagram of the atmosphere. Which layer is the highlighted one — the one that is ${l.what}?`,
        answer: ans(c),
        hint: 'Count up from the ground: troposphere, stratosphere, mesosphere, thermosphere.',
        working: ['<b>Memory hook:</b> <b>T</b>errible <b>S</b>torms <b>M</b>ake <b>T</b>rouble.', `Layer ${l.n} from the ground is the <b>${l.name}</b>.`, l.extra],
        finalAnswer: l.name,
      };
    },
  ];

  HL.registerTopic({
    id: 'climate-atmosphere', subject: 'science', strand: 'earth', order: 6,
    name: 'Climate & the atmosphere', short: 'Climate & air', animal: 'whale',
    blurb: 'The air above us: what it is made of, its layers, the ozone hole, and why the planet is warming.',
    example: 'air = 78% nitrogen, 21% oxygen · CO₂ = the blanket',
    learn: {
      what: '<p>The <b>atmosphere</b> is the layer of air wrapped around the Earth. It is about <b>78% nitrogen</b> and <b>21% oxygen</b>, with a tiny amount of <b>carbon dioxide</b> that does a very big job. It is stacked in layers: <b>troposphere</b> (all the weather), <b>stratosphere</b> (the ozone layer and jet planes), <b>mesosphere</b> (meteors burn up) and <b>thermosphere</b> (auroras and the space station).</p><p>Two different things happen up there. The <b>ozone layer</b> soaks up harmful <b>UV</b> — and because the ozone hole sits over Antarctica, close to us, Aotearoa has some of the strongest UV in the world. Separately, <b>greenhouse gases</b> act like a <b>blanket</b>: sunlight gets in, but some heat cannot get back out. We need that blanket — without it the Earth would be frozen. The problem is the <b>extra</b> gas from burning fossil fuels, which is making the blanket thicker.</p><p><b>Picture for this topic:</b> the ozone layer is the Earth’s <b>sunscreen</b>; greenhouse gases are its <b>blanket</b>. Two jobs, two different problems.</p>',
      visual: layersSvg('stratosphere'),
      facts: [
        'Air is about <b>78% nitrogen</b>, <b>21% oxygen</b>, about 1% other — including only <b>0.04% carbon dioxide</b>.',
        'Layers from the ground up: <b>troposphere</b> (weather, us) → <b>stratosphere</b> (ozone layer, planes) → <b>mesosphere</b> (meteors) → <b>thermosphere</b> (auroras, space station).',
        'The <b>ozone layer</b> blocks harmful <b>UV</b>. The hole over Antarctica was caused by <b>CFCs</b>; they were banned worldwide and it is slowly healing.',
        'NZ sun safety: <b>UV index 3 or more = protect yourself</b> — SPF 30+, hat, shade between 10 a.m. and 4 p.m.',
        'Greenhouse gases: <b>carbon dioxide</b>, <b>methane</b>, <b>water vapour</b>, <b>nitrous oxide</b>. Nitrogen and oxygen are <b>not</b>.',
        'The <b>natural</b> greenhouse effect keeps Earth about 30 °C warmer — we need it. Burning fossil fuels adds <b>extra</b>, and that is the warming problem.',
        'Evidence: rising <b>temperature records</b>, rising <b>sea level</b>, and <b>glaciers retreating</b> in the Southern Alps.',
      ],
      steps: [
        'For the layers, count up from the ground and use the hook <b>T</b>errible <b>S</b>torms <b>M</b>ake <b>T</b>rouble: <b>t</b>roposphere, <b>s</b>tratosphere, <b>m</b>esosphere, <b>t</b>hermosphere.',
        'If the question says <b>UV, sunburn or the hole</b>, it is about <b>ozone</b> — the sunscreen. If it says <b>heat, warming or carbon dioxide</b>, it is about the <b>greenhouse blanket</b>. Never mix the two up.',
        'For the greenhouse effect, say the blanket story in order: <b>sunlight in → the ground warms → heat tries to leave → greenhouse gases bounce some back down</b>.',
        'For evidence, only count things that are <b>measured and written down over many years</b>: thermometers, sea level, glacier photos, ice cores. One hot day is weather, not climate.',
        'When you name an effect, name what is being <b>done about it</b> too. That is what a full answer looks like.',
      ],
      examples: [
        {
          q: 'What are the two main gases in the air, and roughly how much of each?',
          visual: gasPieSvg(),
          working: [
            '<b>Picture:</b> if the air were 100 marbles in a jar…',
            '1. 78 of them would be <b>nitrogen</b>.',
            '2. 21 would be <b>oxygen</b>.',
            '3. That leaves about 1 for everything else — and carbon dioxide is only 0.04 of a marble.',
          ],
          a: 'About 78% nitrogen and 21% oxygen',
        },
        {
          q: 'Which layer do jet planes fly in, and why?',
          visual: layersSvg('stratosphere'),
          working: [
            '<b>Hook:</b> Terrible Storms Make Trouble — troposphere, stratosphere, mesosphere, thermosphere.',
            '1. All the weather is in the <b>troposphere</b>, up to about 12 km.',
            '2. Just above that is the <b>stratosphere</b>: dry, calm, no storms.',
            'So planes cruise in the stratosphere for a smooth ride.',
          ],
          a: 'The stratosphere — calm, dry air above all the weather',
        },
        {
          q: 'Why do New Zealanders have to be so careful in the sun?',
          working: [
            '<b>Picture:</b> the ozone layer is the Earth’s sunscreen — and ours is thin.',
            '1. The ozone hole sits over Antarctica, which is close to us.',
            '2. Our air is also very clean and clear, so less UV is filtered out.',
            '3. So NZ has some of the strongest UV in the world.',
            '4. Rule: UV index <b>3 or more</b> → SPF 30+, hat, shirt, sunglasses, and shade from 10 a.m. to 4 p.m.',
          ],
          a: 'Thin ozone plus clear air means very strong UV, so protection is needed whenever the UV index is 3 or more',
        },
        {
          q: 'Explain the greenhouse effect using the blanket picture.',
          visual: blanketSvg(),
          working: [
            '<b>Picture:</b> a blanket on a bed.',
            '1. Sunlight comes straight through and warms the ground.',
            '2. The warm ground gives off heat, which tries to escape to space.',
            '3. Greenhouse gases (carbon dioxide, methane, water vapour) <b>bounce some of it back down</b>.',
            '4. So the surface stays warmer than it would with no atmosphere.',
          ],
          a: 'Sunlight gets in, but greenhouse gases stop some heat getting out — like a blanket',
        },
        {
          q: 'Is the greenhouse effect a bad thing?',
          working: [
            '<b>Picture:</b> one blanket is cosy, five blankets is too hot.',
            '1. Is the natural effect needed? <b>Yes</b> — without it Earth would be about 30 °C colder and frozen.',
            '2. What has changed? Burning coal, oil and gas adds <b>extra</b> carbon dioxide.',
            '3. Extra gas = a thicker blanket = extra warming.',
            'So the natural effect is good; the extra is the problem.',
          ],
          a: 'No — we need the natural greenhouse effect. The problem is the extra gas from burning fossil fuels',
        },
        {
          q: 'Read the graph: what was the temperature in 1960, and how much warmer was 2020 than 1920?',
          visual: graphSvg([[1920, 13.6], [1940, 13.8], [1960, 14.0], [1980, 14.4], [2000, 14.8], [2020, 15.2]], 2),
          working: [
            '1. Find 1960 on the bottom, go up to the dot, read across: <b>14.0 °C</b>.',
            '2. 1920 reads 13.6 °C and 2020 reads 15.2 °C.',
            '3. 15.2 − 13.6 = <b>1.6 °C</b> warmer.',
            'The trend over the whole line is upwards — that is the evidence, not any single point.',
          ],
          a: '14.0 °C in 1960; 2020 was 1.6 °C warmer than 1920',
        },
        {
          q: 'Name one effect of climate change on Aotearoa, and one thing people are doing about it.',
          working: [
            '<b>Picture:</b> a poster with two boxes: "what is happening" and "what we are doing".',
            '1. Effect: heavier downpours and more flooding.',
            '2. Response: councils are building bigger stormwater drains and better flood warnings.',
            '3. Other pairs: glaciers retreating → measured by plane every year; more fire-risk days → daily fire-danger forecasts and early fire bans.',
            'Always finish with the response — the problem is real, and so is the work on it.',
          ],
          a: 'Heavier rain and flooding — and councils are improving drains and flood warnings',
        },
      ],
      tips: [
        'The <b>ozone hole</b> and the <b>greenhouse effect</b> are two different things. Ozone = UV coming in (sunscreen). Greenhouse = heat not getting out (blanket).',
        'Do not say greenhouse gases are simply "bad". Without the natural effect the Earth would be frozen — it is the <b>extra</b> that causes warming.',
        '<b>Weather</b> is today. <b>Climate</b> is the pattern over many years. One cold day proves nothing either way.',
        'Nitrogen and oxygen make up 99% of the air but are <b>not</b> greenhouse gases. Carbon dioxide is a tiny slice doing a very big job.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [gasPct, gasRole, gasBiggest, layerName, layerWhere, greenhouseGasSort, sunSafeQ, uvIndexQ]
        : level === 2
          ? [gasPct, gasBiggest, layerWhat, layerWhere, layerOrder, ozoneQ, sunSafeQ, uvIndexQ, greenhouseQ, greenhouseGasSort, evidenceQ, graphRead, actionQ]
          : [gasLeftover, layerOrder, layerName, ozoneQ, greenhouseQ, mixUpQ, evidenceQ, graphRead, graphRise, graphTrend, effectQ, actionQ, uvIndexQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
