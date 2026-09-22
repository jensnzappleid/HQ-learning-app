/* Topic: Fair Testing — planning an investigation, variables, repeats and spotting an unfair test.
 * Almost every question is a SCENARIO, because that is how she meets these ideas in class. */
(function (HL) {
  const R = HL.rng;

  /* ---------- the investigation pool: the engine of this whole topic ---------- */
  const INV = [
    { t: 'Harper tests which fertiliser grows the tallest bean plant.',
      iv: 'the type of fertiliser', dv: 'the height of the bean plant', unit: 'cm', tool: 'a ruler',
      keep: ['the amount of water', 'the size of the pot', 'the amount of light', 'the type of bean seed', 'the amount of soil'],
      pred: 'If I use fertiliser B, the bean plant will grow taller than with no fertiliser.' },
    { t: 'Harper tests whether a longer wing makes a paper plane fly further.',
      iv: 'the length of the wings', dv: 'the distance the plane flies', unit: 'm', tool: 'a tape measure',
      keep: ['the type of paper', 'the person throwing', 'how hard it is thrown', 'the height it is thrown from', 'throwing indoors with no wind'],
      pred: 'If the wings are longer, the plane will fly further.' },
    { t: 'Harper tests which material keeps hot water hot for longest.',
      iv: 'the type of insulating material', dv: 'the temperature after 10 minutes', unit: '°C', tool: 'a thermometer',
      keep: ['the starting temperature of the water', 'the volume of water', 'the thickness of the material', 'the same size beakers', 'the length of time'],
      pred: 'If I wrap the beaker in wool, the water will stay hotter than with no wrapping.' },
    { t: 'Harper tests whether a longer string makes a pendulum swing more slowly.',
      iv: 'the length of the string', dv: 'the time for 10 swings', unit: 's', tool: 'a stopwatch',
      keep: ['the mass of the bob', 'the angle it is released from', 'the same person timing', 'letting it go instead of pushing it'],
      pred: 'If the string is longer, 10 swings will take longer.' },
    { t: 'Harper tests whether a steeper ramp makes a toy car roll further.',
      iv: 'the height of the ramp', dv: 'the distance the car rolls', unit: 'cm', tool: 'a metre ruler',
      keep: ['the same toy car', 'the same ramp surface', 'the same floor', 'letting go without pushing', 'the same starting point on the ramp'],
      pred: 'If the ramp is higher, the car will roll further.' },
    { t: 'Harper tests whether sugar dissolves faster in hot water.',
      iv: 'the temperature of the water', dv: 'the time taken for the sugar to disappear', unit: 's', tool: 'a stopwatch',
      keep: ['the amount of sugar', 'the volume of water', 'how much it is stirred', 'the size of the sugar grains'],
      pred: 'If the water is hotter, the sugar will dissolve faster.' },
    { t: 'Harper tests whether bread goes mouldy faster in the dark.',
      iv: 'the amount of light', dv: 'the area covered in mould after a week', unit: 'cm²', tool: 'a squared grid',
      keep: ['the same type of bread', 'the same size slice', 'the temperature', 'how damp the bread is', 'the same bag'],
      pred: 'If the bread is kept in the dark, more mould will grow.' },
    { t: 'Harper tests which sunscreen blocks the most UV, using beads that change colour in sunlight.',
      iv: 'the brand of sunscreen', dv: 'how much the beads change colour', unit: 'colour score out of 5', tool: 'a colour chart',
      keep: ['the same beads', 'the same time in the sun', 'the same thickness of sunscreen', 'testing at the same time of day'],
      pred: 'If the sunscreen has a higher SPF, the beads will change colour less.' },
    { t: 'Harper tests whether worms prefer damp soil or dry soil.',
      iv: 'how damp the soil is', dv: 'the number of worms on each side after 10 minutes', unit: 'worms', tool: 'counting',
      keep: ['the same worms', 'the same light on both sides', 'the same temperature', 'the same amount of time', 'the same type of soil'],
      pred: 'If the soil is damp, more worms will move onto that side.' },
    { t: 'Harper tests whether seeds germinate faster in a warm place.',
      iv: 'the temperature', dv: 'the number of seeds that have sprouted after 5 days', unit: 'seeds', tool: 'counting',
      keep: ['the same type of seed', 'the same amount of water', 'the same amount of light', 'the same number of seeds in each dish'],
      pred: 'If the seeds are kept warm, more of them will sprout in 5 days.' },
    { t: 'Harper tests whether a bigger parachute falls more slowly.',
      iv: 'the size of the parachute canopy', dv: 'the time it takes to fall', unit: 's', tool: 'a stopwatch',
      keep: ['the height it is dropped from', 'the mass hanging underneath', 'the length of the strings', 'dropping it indoors with no wind'],
      pred: 'If the canopy is bigger, the parachute will take longer to fall.' },
    { t: 'Harper tests whether more batteries make a bulb brighter.',
      iv: 'the number of batteries', dv: 'the brightness of the bulb', unit: 'lux', tool: 'a light meter',
      keep: ['the same bulb', 'the same wires', 'the same distance from the light meter', 'the same darkened room'],
      pred: 'If I add more batteries, the bulb will get brighter.' },
  ];

  const PARTS = [
    { n: 'independent variable', d: 'the one thing you deliberately <b>change</b>', short: 'the thing you change' },
    { n: 'dependent variable', d: 'the thing you <b>measure</b> to see what happened', short: 'the thing you measure' },
    { n: 'controlled variables', d: 'everything you deliberately <b>keep the same</b>', short: 'the things you keep the same' },
    { n: 'prediction', d: 'what you think will happen, and why, written before you start', short: 'what you think will happen' },
    { n: 'conclusion', d: 'what your results actually showed, written as an answer to your question', short: 'what the results showed' },
  ];

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms accepted for the equipment used to measure each investigation's result. */
  const TOOL_ACCEPT = {
    'a ruler': ['ruler'],
    'a tape measure': ['tape measure'],
    'a thermometer': ['thermometer'],
    'a stopwatch': ['stopwatch', 'a stop watch', 'stop watch'],
    'a metre ruler': ['metre ruler', 'meter ruler', 'a meter ruler'],
    'a colour chart': ['colour chart', 'color chart', 'a color chart'],
    counting: ['count them', 'counting them'],
    'a light meter': ['light meter'],
    'a squared grid': ['squared grid', 'a grid'],
  };
  /** typed synonyms for the five named parts of an investigation. */
  const PART_ACCEPT = {
    'independent variable': ['independent', 'the independent variable'],
    'dependent variable': ['dependent', 'the dependent variable'],
    'controlled variables': ['controlled variable', 'controls', 'constants', 'the controlled variables'],
    prediction: ['a prediction'],
    conclusion: ['a conclusion'],
  };

  /* ---------- diagrams ---------- */
  function wrap(text, perLine) {
    const words = text.split(' '); const lines = []; let cur = '';
    words.forEach((w) => {
      if ((cur + ' ' + w).trim().length > perLine) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w;
    });
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function varMapSvg(inv, hide) {
    const secs = [
      { key: 'iv', title: 'CHANGE just one thing (independent)', fill: '#FBD9E6', lines: wrap(inv.iv, 44) },
      { key: 'keep', title: 'KEEP everything else the same (controlled)', fill: '#F6EEDC', lines: wrap(inv.keep.slice(0, 4).join(' · '), 44) },
      { key: 'dv', title: 'MEASURE one thing (dependent)', fill: '#DFF0D0', lines: wrap(`${inv.dv} (${inv.unit})`, 44) },
    ];
    let y = 6, body = '';
    secs.forEach((sec) => {
      const hidden = hide === sec.key;
      const lines = hidden ? ['? ? ?'] : sec.lines;
      const h = 24 + lines.length * 15 + 4;
      body += `<rect x="6" y="${y}" width="336" height="${h}" rx="9" fill="${sec.fill}" stroke="#4A4033" stroke-width="1.5"/>`;
      body += `<text x="16" y="${y + 18}" fill="#4A4033" font-size="12">${sec.title}</text>`;
      lines.forEach((l, i) => {
        body += `<text x="16" y="${y + 35 + i * 15}" fill="${hidden ? '#E0568C' : '#4A4033'}" font-size="${hidden ? 14 : 12}">${l}</text>`;
      });
      y += h + 6;
    });
    const H = y;
    return `<svg viewBox="0 0 348 ${H}" width="348" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="348" height="${H}" fill="#FFFFFF"/>
      ${body}
    </svg>`;
  }

  function conceptSvg() {
    return `<svg viewBox="0 0 348 200" width="348" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="348" height="200" fill="#FFFFFF"/>
      <rect x="6" y="6" width="336" height="40" rx="9" fill="#FBD9E6" stroke="#4A4033" stroke-width="1.5"/>
      <text x="16" y="24" fill="#E0568C" font-size="12.5">1. CHANGE one thing</text>
      <text x="16" y="40" fill="#4A4033" font-size="12">the independent variable</text>
      <rect x="6" y="52" width="336" height="40" rx="9" fill="#F6EEDC" stroke="#4A4033" stroke-width="1.5"/>
      <text x="16" y="70" fill="#C98A1C" font-size="12.5">2. KEEP everything else the same</text>
      <text x="16" y="86" fill="#4A4033" font-size="12">the controlled variables</text>
      <rect x="6" y="98" width="336" height="40" rx="9" fill="#DFF0D0" stroke="#4A4033" stroke-width="1.5"/>
      <text x="16" y="116" fill="#6FA04C" font-size="12.5">3. MEASURE one thing</text>
      <text x="16" y="132" fill="#4A4033" font-size="12">the dependent variable</text>
      <rect x="6" y="144" width="336" height="48" rx="9" fill="#DCEEF9" stroke="#4A4033" stroke-width="1.5"/>
      <text x="16" y="162" fill="#5F98C4" font-size="12.5">4. REPEAT it 3 times and take the average</text>
      <text x="16" y="180" fill="#4A4033" font-size="12">so one odd result cannot fool you</text>
    </svg>`;
  }

  function twoSetupsSvg(sameOk) {
    const pot = (x, pw, ph, plantH, label) => `
      <rect x="${x}" y="${152 - ph}" width="${pw}" height="${ph}" rx="5" fill="#E9A07A" stroke="#4A4033" stroke-width="1.5"/>
      <line x1="${x + pw / 2}" y1="${152 - ph}" x2="${x + pw / 2}" y2="${152 - ph - plantH}" stroke="#6FA04C" stroke-width="4"/>
      <ellipse cx="${x + pw / 2 - 11}" cy="${156 - ph - plantH}" rx="11" ry="6" fill="#8FC96E"/>
      <ellipse cx="${x + pw / 2 + 11}" cy="${162 - ph - plantH}" rx="11" ry="6" fill="#8FC96E"/>
      <text x="${x + pw / 2}" y="${170}" text-anchor="middle" fill="#4A4033" font-size="12">${label}</text>`;
    return `<svg viewBox="0 0 340 212" width="340" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="212" fill="#FFFFFF"/>
      <text x="170" y="22" text-anchor="middle" fill="${sameOk ? '#6FA04C' : '#E0568C'}" font-size="12.5">${sameOk ? 'a FAIR test' : 'NOT a fair test'}</text>
      ${pot(66, 52, 32, 40, 'fertiliser A')}
      ${sameOk ? pot(222, 52, 32, 58, 'fertiliser B') : pot(212, 76, 48, 58, 'fertiliser B')}
      ${sameOk ? '' : '<rect x="206" y="98" width="88" height="60" rx="7" fill="none" stroke="#E0568C" stroke-width="3"/>'}
      ${sameOk
        ? `<text x="170" y="192" text-anchor="middle" fill="#6FA04C" font-size="12">same pot · same water · same light</text>
           <text x="170" y="206" text-anchor="middle" fill="#6FA04C" font-size="12">only the fertiliser is different</text>`
        : `<text x="170" y="192" text-anchor="middle" fill="#E0568C" font-size="12">different pot AND different fertiliser</text>
           <text x="170" y="206" text-anchor="middle" fill="#E0568C" font-size="12">two changes — you cannot tell which did it</text>`}
    </svg>`;
  }

  const repeatTable = (rows, label, unit) => `<table class="data"><tr><th>${label}</th><th>try 1</th><th>try 2</th><th>try 3</th><th>average</th></tr>${
    rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4] == null ? '?' : r[4]}</td></tr>`).join('')}</table><p class="muted">all readings in ${unit}</p>`;

  /* ---------- question makers ---------- */
  function ivQ(level) {
    const inv = R.pick(INV);
    const c = choice(inv.iv, [inv.dv].concat(R.sample(inv.keep, 2)), 4);
    return {
      visual: R.chance(0.35) ? varMapSvg(inv, 'iv') : undefined,
      prompt: `${inv.t}<br>Which variable does she <b>change</b>? <span class="muted">(the independent variable)</span>`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The independent variable is the one thing she deliberately makes different between the tests.',
      working: ['<b>Picture:</b> three boxes — CHANGE one thing, KEEP the rest the same, MEASURE one thing.', `1. What is the question about? ${inv.iv}.`, `So the variable she <b>changes</b> is <b>${inv.iv}</b>.`],
      finalAnswer: inv.iv, skill: 'variables',
    };
  }

  function dvQ(level) {
    const inv = R.pick(INV);
    const c = choice(inv.dv, [inv.iv].concat(R.sample(inv.keep, 2)), 4);
    return {
      visual: R.chance(0.35) ? varMapSvg(inv, 'dv') : undefined,
      prompt: `${inv.t}<br>Which variable does she <b>measure</b>? <span class="muted">(the dependent variable)</span>`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The dependent variable is the result — the thing you write in the table at the end.',
      working: ['<b>Picture:</b> three boxes — CHANGE, KEEP THE SAME, MEASURE.', `1. What goes in the results table? ${inv.dv}, in ${inv.unit}.`, `So she <b>measures ${inv.dv}</b> with ${inv.tool}.`],
      finalAnswer: inv.dv, skill: 'variables',
    };
  }

  function keepSameQ(level) {
    const inv = R.pick(INV);
    const k = R.pick(inv.keep);
    const c = choice(k, [inv.iv, inv.dv, 'nothing needs to stay the same'], 4);
    return {
      visual: R.chance(0.3) ? varMapSvg(inv, 'keep') : undefined,
      prompt: `${inv.t}<br>Which of these must she <b>keep the same</b> for it to be a fair test?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `She has to change ${inv.iv} and measure ${inv.dv}, so neither of those can be kept the same.`,
      working: ['<b>Picture:</b> two plants side by side that are identical in <b>every</b> way except one.', `1. What is she changing? ${inv.iv} — so that one has to be different.`, `2. What is she measuring? ${inv.dv} — that is the result.`, `3. Everything else must stay the same, including <b>${k}</b>.`],
      finalAnswer: k, skill: 'controls',
    };
  }

  function unfairQ(level) {
    const inv = R.pick(INV);
    const k = R.pick(inv.keep);
    const correct = `She changed ${k} as well, so she cannot tell which change caused the result`;
    const c = choice(correct, [
      'Nothing — it is a fair test',
      'She should have measured something different',
      'She did not write a prediction first',
      `She should have changed ${inv.dv} too`,
    ], 4);
    return {
      visual: R.chance(0.3) ? twoSetupsSvg(false) : undefined,
      prompt: `${inv.t}<br>She changes ${inv.iv} — but she also changes <b>${k}</b> at the same time. What is wrong with her test?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'If two things change at once, which one caused the difference?',
      working: ['<b>Picture:</b> two plants that differ in <b>two</b> ways — you cannot tell which one did it.', `1. She changed ${inv.iv}. Good — that is the plan.`, `2. But she also changed ${k}.`, '3. Two changes at once = you cannot tell which one caused the result.', 'Only <b>one</b> variable can change at a time.'],
      finalAnswer: correct, skill: 'unfair',
    };
  }

  function fixUnfairQ(level) {
    const inv = R.pick(INV);
    const k = R.pick(inv.keep);
    const correct = `Do it again, keeping ${k} the same in every test`;
    const c = choice(correct, [
      `Change ${k} even more next time`,
      'Change two things at once but write it down',
      'Only do one test instead of several',
    ], 4);
    return {
      prompt: `${inv.t}<br>Her teacher says the test was not fair because <b>${k}</b> was different each time. How should she fix it?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'A fair test changes one thing and keeps everything else identical.',
      working: ['<b>Picture:</b> two identical setups with exactly one difference.', `1. The only thing allowed to change is ${inv.iv}.`, `2. So ${k} must be <b>the same</b> in every test.`, 'Then any difference in the result must be caused by the one thing she changed.'],
      finalAnswer: correct, skill: 'unfair',
    };
  }

  function partsQ(level) {
    const p = R.pick(PARTS);
    if (R.chance(0.5)) {
      const c = choice(p.d, PARTS.map((x) => x.d), 4);
      return {
        visual: R.chance(0.3) ? conceptSvg() : undefined,
        prompt: `What is the <b>${p.n}</b> in an investigation?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Change one · keep the rest the same · measure one.',
        working: ['<b>Picture:</b> the three boxes: CHANGE, KEEP THE SAME, MEASURE.', `The ${p.n} is ${p.d}.`],
        finalAnswer: p.d, skill: 'parts',
      };
    }
    return {
      prompt: `Which one is "<b>${p.short}</b>"?`,
      answer: textAns(p.n, PART_ACCEPT[p.n], 'two or three words'),
      hint: 'Independent = I change it. Dependent = it depends on what I changed, so I measure it.',
      working: ['<b>Picture:</b> the three boxes: CHANGE, KEEP THE SAME, MEASURE.', `${cap(p.short)} is the <b>${p.n}</b>.`],
      finalAnswer: p.n, skill: 'parts',
    };
  }

  function onlyOneQ(level) {
    const items = [
      { q: 'Why can you only change <b>one</b> variable at a time in a fair test?', a: 'So you know which change caused the result', wrongs: ['So the experiment is quicker', 'So you need fewer measurements', 'So the results look tidier'],
        w: ['<b>Picture:</b> two plants that are different in two ways — which difference grew the taller plant? You cannot tell.', 'One change at a time = you know <b>exactly</b> what caused any difference.'] },
      { q: 'What makes an investigation a <b>fair test</b>?', a: 'Only one variable is changed; everything else is kept the same', wrongs: ['Everyone gets a turn', 'You repeat it once', 'You get the answer you predicted'],
        w: ['<b>Picture:</b> two identical setups with exactly one difference.', 'Change <b>one</b>, keep the rest the <b>same</b>, measure <b>one</b>.'] },
      { q: 'Why is a <b>control</b> (a test with no treatment at all) useful?', a: 'It shows what happens with no change, so you can compare', wrongs: ['It doubles your results', 'It makes the test faster', 'It is the one you measure most carefully'],
        w: ['<b>Picture:</b> a plant with no fertiliser sitting next to the fertilised ones.', 'Without it you do not know how much of the growth was just the plant doing its thing.'] },
      { q: 'Harper gets the result she predicted. Does that prove her prediction was right?', a: 'Not on its own — the test still has to be fair and repeated', wrongs: ['Yes, a matching result always proves it', 'No, predictions can never be right', 'Yes, as long as she wrote it down first'],
        w: ['<b>Picture:</b> guessing a coin flip correctly once — that does not make you a coin expert.', '1. Was only one thing changed? 2. Was it repeated?', 'Evidence has to be <b>fair</b> and <b>repeated</b> before it supports a prediction.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Change one thing, keep the rest the same, measure one thing.',
      working: it.w, finalAnswer: it.a, skill: 'fairness',
    };
  }

  function predictionQ(level) {
    const inv = R.pick(INV);
    const bad = [
      'I will do the experiment carefully and write down my results.',
      'I think the experiment will work.',
      'Plants are interesting to study.',
      'I will use a table and a graph.',
    ];
    const c = choice(inv.pred, bad, 4);
    return {
      prompt: `${inv.t}<br>Which of these is a good <b>prediction</b> for her investigation?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'A good prediction says "if I change ___, then ___ will happen" — and you could actually test it.',
      working: ['<b>Picture:</b> a sentence with an "if…then…" shape.', '1. Does it say what she will change? Yes.', '2. Does it say what will happen to what she measures? Yes.', `So: <b>${inv.pred}</b>`],
      finalAnswer: inv.pred, skill: 'prediction',
    };
  }

  function repeatsQ(level) {
    const items = [
      { q: 'Why should Harper repeat each measurement three times?', a: 'To spot odd results and make the answer more reliable', wrongs: ['To use up the whole lesson', 'To get a bigger number', 'Because the teacher said so'],
        w: ['<b>Picture:</b> measuring your height once while standing on tiptoe — one go can fool you.', 'Repeats let you <b>spot a mistake</b> and take an average.'] },
      { q: 'What should Harper do with her three repeat readings?', a: 'Work out the average (mean) of them', wrongs: ['Use only the biggest one', 'Use only the first one', 'Add them all together and use the total'],
        w: ['<b>Picture:</b> three goes at a long jump — your average tells the truer story.', 'Add the readings, divide by how many there were = the <b>mean</b>.'] },
      { q: 'One of Harper&rsquo;s three readings is wildly different from the other two. What is it called, and what should she do?', a: 'An anomaly — leave it out of the average and, if she can, measure again', wrongs: ['A conclusion — write it up as the answer', 'A variable — keep it in the average', 'An average — use it as the result'],
        w: ['<b>Picture:</b> three long jumps: 3.1 m, 3.2 m, and 0.4 m because you tripped.', '1. The odd one out is an <b>anomaly</b>.', '2. It is usually a mistake, so leave it out of the mean and repeat if you can.'] },
      { q: 'What makes a set of results <b>reliable</b>?', a: 'You get very similar readings each time you repeat it', wrongs: ['The readings are all very big', 'You only measured once, very carefully', 'The results match what you hoped for'],
        w: ['<b>Picture:</b> three goes that all land in almost the same place.', 'Close-together repeats = <b>reliable</b>. Wildly different repeats = something is wrong.'] },
      { q: 'Harper measures each plant once and one plant was knocked over by the cat. Why is that a problem?', a: 'She has no repeats, so she cannot tell a real result from an accident', wrongs: ['It is not a problem at all', 'The cat is a controlled variable', 'She should measure the cat instead'],
        w: ['<b>Picture:</b> one long jump where you slipped — is that really your best?', 'With no repeats, an accident looks exactly like a real result.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Repeats let you check yourself. The average smooths out small mistakes.',
      working: it.w, finalAnswer: it.a, skill: 'repeats',
    };
  }

  function meanQ(level) {
    const inv = R.pick(INV);
    const base = R.int(8, 30);
    const a = base, b = base + R.pick([-2, -1, 1, 2]), c3 = 3 * (base + R.int(-1, 1)) - a - b;
    const mean = (a + b + c3) / 3;
    const rows = [['test A', a, b, c3, null]];
    return {
      visual: repeatTable(rows, 'setup', inv.unit),
      prompt: `${inv.t}<br>She measured ${inv.dv} three times. What is the <b>average</b> of ${a}, ${b} and ${c3}?`,
      answer: { type: 'number', value: mean, unit: inv.unit, tolerance: 0.01, placeholder: 'e.g. 12' },
      hint: 'Add the three readings, then divide by 3.',
      working: ['<b>Picture:</b> three goes at the long jump, shared out evenly.', `${a} + ${b} + ${c3} = ${a + b + c3}.`, `${a + b + c3} ÷ 3 = <b>${Math.round(mean * 100) / 100}</b> ${inv.unit}.`],
      finalAnswer: `${Math.round(mean * 100) / 100} ${inv.unit}`, skill: 'averages',
    };
  }

  function anomalyMeanQ(level) {
    const inv = R.pick(INV);
    const base = R.int(10, 28);
    const a = base, b = base + R.pick([-2, 0, 2]);
    const odd = base + R.pick([40, 55, 70]);
    const order = R.shuffle([a, b, odd]);
    const mean = (a + b) / 2;
    return {
      visual: repeatTable([['test A', order[0], order[1], order[2], null]], 'setup', inv.unit),
      prompt: `${inv.t}<br>Her three readings for ${inv.dv} were <b>${order.join(', ')}</b> ${inv.unit}. One is an anomaly. What is the average of the two sensible readings?`,
      answer: { type: 'number', value: mean, unit: inv.unit, tolerance: 0.01, placeholder: 'e.g. 14' },
      hint: `${odd} is nothing like the other two — leave it out.`,
      working: ['<b>Picture:</b> three long jumps where one go you tripped — you would not count that one.', `1. The odd one out (the <b>anomaly</b>) is ${odd}.`, `2. Average the other two: ${a} + ${b} = ${a + b}.`, `3. ${a + b} ÷ 2 = <b>${Math.round(mean * 100) / 100}</b> ${inv.unit}.`],
      finalAnswer: `${Math.round(mean * 100) / 100} ${inv.unit}`, skill: 'averages',
    };
  }

  function toolQ(level) {
    const inv = R.pick(INV);
    return {
      prompt: `${inv.t}<br>What should she use to measure <b>${inv.dv}</b>?`,
      answer: textAns(inv.tool, TOOL_ACCEPT[inv.tool], 'one or two words'),
      hint: `The result is measured in ${inv.unit}.`,
      working: [`<b>Picture:</b> writing "${inv.dv} (${inv.unit})" as the heading of her results column.`, `To measure that you need <b>${inv.tool}</b>.`],
      finalAnswer: inv.tool, skill: 'measuring',
    };
  }

  function unitQ(level) {
    const inv = R.pick(INV);
    const c = choice(inv.unit, INV.map((x) => x.unit), 4);
    return {
      prompt: `${inv.t}<br>What unit should she write at the top of her results column for <b>${inv.dv}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `She measures it with ${inv.tool}.`,
      working: ['<b>Picture:</b> the heading row of a results table — the unit goes there, not beside every number.', `${cap(inv.dv)} is measured in <b>${inv.unit}</b>.`],
      finalAnswer: inv.unit, skill: 'measuring',
    };
  }

  function vocabQ(level) {
    const items = [
      { q: 'What do we call the variable you deliberately change?', a: 'independent', accept: ['independent variable', 'the independent variable'] },
      { q: 'What do we call the variable you measure?', a: 'dependent', accept: ['dependent variable', 'the dependent variable'] },
      { q: 'What do we call the variables you keep the same?', a: 'controlled', accept: ['controlled variables', 'control variables', 'controls', 'constants'] },
      { q: 'What word means a result that is wildly different from the others?', a: 'anomaly', accept: ['an anomaly', 'anomalous', 'outlier'] },
      { q: 'What do you call the number you get by adding your repeats and dividing by how many there were?', a: 'average', accept: ['mean', 'the average', 'the mean'] },
      { q: 'What is the sentence you write before the experiment saying what you think will happen?', a: 'prediction', accept: ['a prediction', 'hypothesis', 'my prediction'] },
      { q: 'What do you call an investigation where only one thing is changed?', a: 'fair test', accept: ['a fair test', 'fair'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one or two words)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'I change the INdependent. The DEpendent DEpends on it, so I measure it.',
      working: ['<b>Picture:</b> the three boxes: CHANGE, KEEP THE SAME, MEASURE.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  function conclusionQ(level) {
    const inv = R.pick(INV);
    const good = `The results show that changing ${inv.iv} did change ${inv.dv}`;
    const c = choice(good, [
      'The experiment was fun and went well',
      'I think I would get the same answer next time',
      'My prediction was interesting',
    ], 4);
    return {
      prompt: `${inv.t}<br>Which of these is a proper <b>conclusion</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'A conclusion answers the original question, using the results.',
      working: ['<b>Picture:</b> going back to the question at the top of the page and answering it.', '1. Does it mention the thing she changed? Yes.', '2. Does it say what happened to the thing she measured? Yes.', `So: <b>${good}</b>.`],
      finalAnswer: good, skill: 'conclusion',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const inv = R.pick(INV);
      const k = R.pick(inv.keep);
      const c = choice(k, [inv.iv, inv.dv, 'nothing — it does not matter'], 4);
      return {
        visual: varMapSvg(inv, 'keep'),
        prompt: `${inv.t}<br>Her teacher asks what she is keeping the same. Which of these belongs in the middle box?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Everything except the one thing she changes and the one thing she measures.',
        working: ['<b>Picture:</b> two setups that are identical apart from one thing.', `1. Changing: ${inv.iv}.`, `2. Measuring: ${inv.dv}.`, `3. Keeping the same: everything else, including <b>${k}</b>.`],
        finalAnswer: k,
      };
    },
    () => {
      const inv = R.pick(INV);
      const c = choice('Repeat each one three times and take the average', ['Do each one once but very carefully', 'Test more different things at once', 'Only write down the best result'], 4);
      return {
        prompt: `${inv.t}<br>She only has time to do each test once. Her friend says the results might not be reliable. What should she do instead?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'How do you tell a real result from a one-off accident?',
        working: ['<b>Picture:</b> one long jump where you slipped — is that really your best?', '1. One reading can be wrong and you would never know.', '2. Three readings let you spot an odd one and take an <b>average</b>.', 'Reliable = the repeats agree with each other.'],
        finalAnswer: 'Repeat each one three times and take the average',
      };
    },
    () => {
      const inv = R.pick(INV);
      const k1 = R.pick(inv.keep);
      const correct = 'She changed two things at once, so she cannot say which one caused it';
      const c = choice(correct, ['She should have repeated it more', 'She measured the wrong thing', 'Nothing — the test was fair'], 4);
      return {
        visual: twoSetupsSvg(false),
        prompt: `${inv.t}<br>Setup A and setup B had different ${inv.iv} <b>and</b> different ${k1}. B did better. What is wrong with saying "${inv.iv} caused it"?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Two differences, one result. Which difference did it?',
        working: ['<b>Picture:</b> two plants, two differences — you cannot untangle them.', `1. Difference one: ${inv.iv}.`, `2. Difference two: ${k1}.`, '3. Either could have caused the result, or both.', 'A fair test allows exactly <b>one</b> difference.'],
        finalAnswer: correct,
      };
    },
    () => {
      const inv = R.pick(INV);
      const c = choice(inv.pred, ['I will be careful and neat.', 'This experiment will be interesting.', 'I will draw a bar chart of my results.'], 4);
      return {
        prompt: `${inv.t}<br>Before she starts, she has to write a prediction. Which sentence works as a prediction?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'A prediction says what will happen to the thing you measure when you change the thing you change.',
        working: ['<b>Picture:</b> an "if … then …" sentence.', '1. Does it name the change? Yes.', '2. Does it say what will happen to the measurement? Yes.', '3. Could you actually test it? Yes.'],
        finalAnswer: inv.pred,
      };
    },
    () => {
      const inv = R.pick(INV);
      const base = R.int(12, 24);
      const odd = base + R.pick([45, 60]);
      const vals = R.shuffle([base, base + 2, odd]);
      const mean = (base + base + 2) / 2;
      return {
        visual: repeatTable([['setup 1', vals[0], vals[1], vals[2], null]], 'setup', inv.unit),
        prompt: `${inv.t}<br>Her three readings were ${vals.join(', ')} ${inv.unit}. She thinks one is a mistake. What is the average of the other two?`,
        answer: { type: 'number', value: mean, unit: inv.unit, tolerance: 0.01, placeholder: 'e.g. 14' },
        hint: `One reading is nothing like the others — that is the anomaly.`,
        working: ['<b>Picture:</b> three long jumps, one of which you tripped on.', `1. The anomaly is ${odd} — it is far from the other two.`, `2. ${base} + ${base + 2} = ${2 * base + 2}.`, `3. ${2 * base + 2} ÷ 2 = <b>${mean}</b> ${inv.unit}.`],
        finalAnswer: `${mean} ${inv.unit}`,
      };
    },
    () => {
      const c = choice('Use the same amount of water for every plant', ['Give the taller plants more water', 'Water them whenever she remembers', 'Water only the plant with fertiliser'], 4);
      return {
        visual: twoSetupsSvg(true),
        prompt: 'Harper is testing fertilisers on bean plants. How should she water them?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Water is a controlled variable here — what does that mean you do with it?',
        working: ['<b>Picture:</b> two identical pots, identical soil, identical light — only the fertiliser is different.', '1. Is water the thing she is testing? No.', '2. So water is a <b>controlled variable</b>.', 'Controlled variables must be <b>exactly the same</b> for every plant — same amount, same times.'],
        finalAnswer: 'Use the same amount of water for every plant',
      };
    },
    () => {
      const c = choice('A control with no fertiliser at all, to compare against', ['A fourth type of fertiliser', 'A plant that gets no water', 'Nothing else is needed'], 4);
      return {
        prompt: 'Harper tests three fertilisers on bean plants. Her teacher says she is missing something important. What is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'How would she know whether the fertiliser helped at all?',
        working: ['<b>Picture:</b> a fourth pot, treated exactly the same but with plain water.', '1. All three plants grow. Does that mean the fertiliser worked? Not necessarily — plants grow anyway.', '2. She needs a <b>control</b>: no fertiliser, everything else the same.', 'Then she can see how much extra growth the fertiliser caused.'],
        finalAnswer: 'A control with no fertiliser at all, to compare against',
      };
    },
    () => {
      const inv = R.pick(INV);
      const c = choice('No — one result could easily be an accident', ['Yes, one result is enough', 'Yes, as long as she measured carefully', 'No, because she should have changed two things'], 4);
      return {
        prompt: `${inv.t}<br>She does the test once, gets the answer she predicted, and writes "this proves I was right". Is that fair?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Think about guessing a coin toss correctly once.',
        working: ['<b>Picture:</b> guessing heads once and calling yourself a coin expert.', '1. Was it repeated? No.', '2. One reading might be a fluke or a mistake.', 'She needs <b>repeats</b> that agree before her evidence supports the prediction.'],
        finalAnswer: 'No — one result could easily be an accident',
      };
    },
    () => {
      const c = choice('Time how long the sugar takes to dissolve, using the same stirring for both', ['Stir the hot one more, since it is faster anyway', 'Use more sugar in the hot water', 'Use a bigger beaker for the hot water'], 4);
      return {
        prompt: 'Harper wants to show that sugar dissolves faster in hot water than cold. How should she set it up?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What is she changing, and what must therefore stay exactly the same?',
        working: ['<b>Picture:</b> two identical beakers, identical sugar, identical stirring — only the temperature differs.', '1. Change: the <b>temperature</b>.', '2. Measure: the <b>time to dissolve</b>.', '3. Keep the same: amount of sugar, volume of water, stirring, grain size.'],
        finalAnswer: 'Time how long the sugar takes to dissolve, using the same stirring for both',
      };
    },
    () => {
      const inv = R.pick(INV);
      const c = choice(`Yes — but only about ${inv.iv}, because that is the only thing she changed`, ['Yes, about everything she noticed', 'No, results can never tell you anything', 'Yes, and she can say it will work for every plant on Earth'], 4);
      return {
        visual: varMapSvg(inv),
        prompt: `${inv.t}<br>Her results are clear and her repeats agree. Can she draw a conclusion?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'A conclusion can only be about the variable you actually changed.',
        working: ['<b>Picture:</b> going back to the question at the top of the page and answering it.', `1. What did she change? ${inv.iv}.`, `2. What did she measure? ${inv.dv}.`, `So her conclusion can only be about how <b>${inv.iv}</b> affects <b>${inv.dv}</b> — nothing else.`],
        finalAnswer: `Yes — but only about ${inv.iv}`,
      };
    },
    () => {
      const c = choice('Her friend threw one plane much harder — that is a second change', ['She should have used more paper', 'The distance is the independent variable', 'Nothing was wrong'], 4);
      return {
        prompt: 'Harper tests whether longer wings make a paper plane fly further. Her friend throws the long-winged one and Harper throws the short one. What is wrong?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Two different throwers means two different throwing strengths.',
        working: ['<b>Picture:</b> two planes, but also two different throwing arms.', '1. Change she planned: wing length.', '2. Change she did not plan: who throws it, and how hard.', 'Two changes = <b>not a fair test</b>. The same person should throw both, as alike as possible.'],
        finalAnswer: 'Her friend threw one plane much harder — that is a second change',
      };
    },
    () => {
      const c = choice('Measure at exactly the same time each day, with the same ruler, from the soil to the tip', ['Measure whenever she walks past', 'Measure the tallest leaf sometimes and the stem other times', 'Estimate the height by eye'], 4);
      return {
        prompt: 'Harper is measuring how tall her bean plants grow. How should she take each measurement?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The way you measure must be the same every single time.',
        working: ['<b>Picture:</b> marking the doorframe for your height — same wall, same shoes off, every time.', '1. Same tool: the same ruler.', '2. Same method: soil to the tip, every time.', '3. Same timing: same time each day.', 'Changing how you measure adds a hidden extra change.'],
        finalAnswer: 'Measure at exactly the same time each day, with the same ruler, from the soil to the tip',
      };
    },
  ];

  HL.registerTopic({
    id: 'fair-testing', subject: 'science', strand: 'nature', order: 1,
    name: 'Fair Testing', short: 'Fair testing', animal: 'bee',
    blurb: 'Change one thing, keep the rest the same, and measure what happens.',
    example: 'change 1 · keep the rest same · measure 1 · repeat 3×',
    learn: {
      what: '<p>A <b>fair test</b> is an experiment where you change <b>one</b> thing, keep <b>everything else</b> the same, and measure <b>one</b> thing. That way, if the result changes, you know exactly what caused it. Scientists also <b>repeat</b> each measurement and take an <b>average</b>, so one odd reading cannot fool them.</p><p><b>Picture for this topic:</b> <b>two plant pots side by side</b>. Same soil, same water, same window, same seed. The only difference is the fertiliser. Any difference in height must be the fertiliser&rsquo;s doing.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Independent variable</b> = the ONE thing you change (<i>I</i> change the <i>I</i>ndependent)',
        '<b>Dependent variable</b> = the thing you measure (it <i>depends</i> on what you changed)',
        '<b>Controlled variables</b> = everything you keep exactly the same',
        'Change <b>only one</b> variable at a time, or you cannot say which change caused the result',
        '<b>Repeat</b> each measurement (usually 3×) and take the <b>average</b> — close repeats mean <b>reliable</b> results',
        'An <b>anomaly</b> is a reading wildly different from the others: leave it out of the average and measure again',
      ],
      steps: [
        'Write the <b>question</b> first: "Does ___ change ___?" The first blank is what you change, the second is what you measure.',
        'Write a <b>prediction</b> in "if…then…" shape: "If I make the string longer, then 10 swings will take longer."',
        'Fill in the three boxes: <b>CHANGE</b> one thing · <b>KEEP THE SAME</b> everything else · <b>MEASURE</b> one thing.',
        'To find the controlled variables, list everything that could possibly affect the result, then cross off the one you are changing and the one you are measuring. <b>All the rest must stay the same.</b>',
        'Do each test <b>3 times</b>, look for any anomaly, then take the <b>average</b>. Finally write a <b>conclusion</b> that answers your original question.',
      ],
      examples: [
        { q: 'Harper tests which fertiliser grows the tallest bean plant. What does she change, and what does she measure?',
          visual: varMapSvg(INV[0]),
          working: ['<b>Picture:</b> pots side by side, identical apart from the fertiliser.', '1. What is the question about? The fertiliser → so <b>the type of fertiliser</b> is what she changes (independent).', '2. What tells her the answer? How tall the plant grew → <b>height in cm</b> (dependent).', '3. Everything else — water, pot, light, seed, soil — must stay the same.'],
          a: 'Change: the type of fertiliser. Measure: the height in cm' },
        { q: 'In that same experiment, name three things she must keep the same.',
          visual: twoSetupsSvg(true),
          working: ['<b>Picture:</b> two pots that are identical in every way except one.', '1. Cross off the thing she changes: fertiliser.', '2. Cross off the thing she measures: height.', '3. Everything left over is a <b>controlled variable</b>.'],
          a: 'Same amount of water, same size pot, same amount of light (and same seed, same soil)' },
        { q: 'She gives the fertilised plant more water than the others. Why is her test now unfair?',
          visual: twoSetupsSvg(false),
          working: ['<b>Picture:</b> two plants that differ in <b>two</b> ways.', '1. Difference one: the fertiliser.', '2. Difference two: the amount of water.', '3. If that plant grows taller, which difference caused it? You cannot tell.', 'A fair test allows exactly <b>one</b> difference.'],
          a: 'Two things changed at once, so she cannot say which one caused the result' },
        { q: 'Harper times a pendulum three times: 14 s, 15 s, 16 s. What is the average?',
          visual: `<table class="data"><tr><th>string length</th><th>try 1</th><th>try 2</th><th>try 3</th><th>average</th></tr><tr><td>50 cm</td><td>14 s</td><td>15 s</td><td>16 s</td><td>?</td></tr></table>`,
          working: ['<b>Picture:</b> three long jumps shared out evenly.', '1. Add them: 14 + 15 + 16 = 45.', '2. Divide by how many: 45 ÷ 3 = 15.'],
          a: '15 seconds' },
        { q: 'Her next three readings are 21 s, 22 s and 58 s. What should she do?',
          visual: `<table class="data"><tr><th>string length</th><th>try 1</th><th>try 2</th><th>try 3</th></tr><tr><td>90 cm</td><td>21 s</td><td>22 s</td><td>58 s</td></tr></table>`,
          working: ['<b>Picture:</b> three long jumps where on one go you tripped.', '1. Is 58 anything like 21 and 22? No — it is an <b>anomaly</b>.', '2. Leave the anomaly out and measure again if she can.', '3. Average of the two good ones: (21 + 22) ÷ 2 = 21.5 s.'],
          a: 'Ignore the anomaly (58 s) and average the rest: 21.5 s' },
        { q: 'Harper tests whether longer wings make a paper plane fly further, but her friend throws one of the planes. What is wrong?',
          working: ['<b>Picture:</b> two planes — and two different throwing arms.', '1. Planned change: wing length.', '2. Accidental change: who throws it and how hard.', 'Two changes = not a fair test. <b>The same person</b> should throw both, as alike as possible.'],
          a: 'The thrower changed too, so it is not a fair test' },
        { q: 'She tests three fertilisers and they all grow well. Her teacher says something is missing. What?',
          working: ['<b>Picture:</b> a fourth pot with plain water only.', '1. Plants grow anyway, fertiliser or not.', '2. Without a plant that gets <b>no</b> fertiliser, there is nothing to compare against.', 'That extra pot is called the <b>control</b>.'],
          a: 'A control — a plant with no fertiliser, everything else the same' },
      ],
      tips: [
        '<b>I</b> change the <b>I</b>ndependent variable. The <b>D</b>ependent variable <b>D</b>epends on it, so I measure it.',
        'If two things changed, the test tells you nothing — you cannot say which one did it.',
        'Getting the result you predicted does not prove you were right. It only counts if the test was <b>fair</b> and the <b>repeats agree</b>.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [ivQ, dvQ, keepSameQ, partsQ, vocabQ, toolQ, onlyOneQ]
        : level === 2
          ? [ivQ, dvQ, keepSameQ, unfairQ, partsQ, predictionQ, repeatsQ, toolQ, unitQ, onlyOneQ, vocabQ]
          : [keepSameQ, unfairQ, fixUnfairQ, repeatsQ, meanQ, anomalyMeanQ, predictionQ, conclusionQ, onlyOneQ, unitQ, ivQ, dvQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
