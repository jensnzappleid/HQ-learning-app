/* Topic: Heat — temperature vs heat, conduction, convection, radiation, conductors, insulation, thermometers. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const WAYS = [
    { name: 'conduction', desc: 'heat passed along a solid from particle to touching particle', pic: 'a metal spoon left in hot soup' },
    { name: 'convection', desc: 'heat carried around by a moving liquid or gas — hot rises, cool sinks', pic: 'warm air rising off a heater' },
    { name: 'radiation', desc: 'heat travelling as invisible waves, even across empty space', pic: 'the sun warming your face' },
  ];
  const WAY_NAMES = WAYS.map((w) => w.name);

  const EXAMPLES = [
    { s: 'a metal spoon left in a pot of soup gets hot', t: 'conduction' },
    { s: 'the handle of a frying pan slowly warms up', t: 'conduction' },
    { s: 'your hands warm up when you hold a hot mug', t: 'conduction' },
    { s: 'a hot water bottle warms your feet', t: 'conduction' },
    { s: 'the metal legs of a chair feel cold to touch', t: 'conduction' },
    { s: 'warm air rises above a heater', t: 'convection' },
    { s: 'the water at the top of a pot gets hot even though the flame is underneath', t: 'convection' },
    { s: 'a hot air balloon lifts off', t: 'convection' },
    { s: 'a cool sea breeze blows in on a hot Northland day', t: 'convection' },
    { s: 'upstairs is always warmer than downstairs', t: 'convection' },
    { s: 'the warmth of the sun on your face', t: 'radiation' },
    { s: 'you can feel a bonfire from metres away', t: 'radiation' },
    { s: 'heat from the sun crosses empty space to reach Earth', t: 'radiation' },
    { s: 'toast browns under the grill without touching it', t: 'radiation' },
    { s: 'you feel the glow of a heater across the room', t: 'radiation' },
  ];

  const MATERIALS = [
    { m: 'copper', c: true }, { m: 'aluminium', c: true }, { m: 'steel', c: true }, { m: 'iron', c: true }, { m: 'silver', c: true },
    { m: 'wood', c: false }, { m: 'plastic', c: false }, { m: 'wool', c: false }, { m: 'air', c: false },
    { m: 'polystyrene', c: false }, { m: 'rubber', c: false }, { m: 'feathers', c: false }, { m: 'fibreglass ceiling batts', c: false }, { m: 'cardboard', c: false },
  ];

  const INSULATION = [
    { s: 'fibreglass batts in the ceiling', why: 'they trap air, and air is a poor conductor', stops: 'conduction' },
    { s: 'double glazing on the windows', why: 'the trapped air between the two panes is a poor conductor', stops: 'conduction' },
    { s: 'thick curtains closed at night', why: 'they trap a layer of still air against the cold glass', stops: 'conduction' },
    { s: 'carpet on a wooden floor', why: 'it traps air and stops heat conducting into the floor', stops: 'conduction' },
    { s: 'shiny foil behind a heater', why: 'shiny surfaces reflect heat radiation back into the room', stops: 'radiation' },
    { s: 'draught stoppers under the doors', why: 'they stop warm air being carried out of the room', stops: 'convection' },
    { s: 'a woolly jumper', why: 'the wool traps a layer of air next to your skin', stops: 'conduction' },
  ];

  const THINGS_HOT = ['a mug of Milo', 'a pot of soup', 'a hot water bottle', 'a bath', 'a cup of tea'];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms for the three ways heat travels. */
  const WAY_ACCEPT = {
    conduction: ['conducted', 'by conduction'],
    convection: ['a convection current', 'by convection'],
    radiation: ['radiated', 'by radiation'],
  };
  const r1 = (v) => Math.round(v * 10) / 10;
  const arrow = (x1, y1, x2, y2, col, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / L, uy = dy / L, hx = r1(x2 - ux * 11), hy = r1(y2 - uy * 11), px = r1(-uy * 6), py = r1(ux * 6);
    return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="${w || 4}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${r1(hx + px)},${r1(hy + py)} ${r1(hx - px)},${r1(hy - py)}" fill="${col}"/>`;
  };

  /* ---------- diagrams ---------- */
  function thermometerSvg(value, lo, hi) {
    const Y = (t) => r1(176 - ((t - lo) / (hi - lo)) * 148);
    let ticks = '';
    for (let t = lo; t <= hi; t += 2) {
      const major = (t - lo) % 10 === 0;
      ticks += `<line x1="${major ? 46 : 54}" y1="${Y(t)}" x2="62" y2="${Y(t)}" stroke="${INK}" stroke-width="${major ? 2 : 1}"/>`;
      if (major) ticks += `<text x="42" y="${Y(t) + 4}" text-anchor="end" fill="${INK}" font-size="10">${t}</text>`;
    }
    return `<svg viewBox="0 0 200 210" width="200" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="62" y="22" width="22" height="158" rx="11" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>
      <rect x="66" y="${Y(value)}" width="14" height="${r1(180 - Y(value))}" fill="#E0568C"/>
      <circle cx="73" cy="188" r="15" fill="#E0568C" stroke="${INK}" stroke-width="2.5"/>
      ${ticks}
      <text x="96" y="40" fill="${INK}" font-size="12">°C</text>
      <text x="96" y="120" fill="#C33C72" font-size="12">read the</text>
      <text x="96" y="136" fill="#C33C72" font-size="12">top of the</text>
      <text x="96" y="152" fill="#C33C72" font-size="12">red line</text>
    </svg>`;
  }

  function potSvg(letters) {
    const L = letters || {};
    return `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="58" y="46" width="204" height="112" rx="6" fill="#DCEEF9" stroke="${INK}" stroke-width="3"/>
      <rect x="46" y="40" width="228" height="10" rx="5" fill="#C9C2B4" stroke="${INK}" stroke-width="2"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${118 + i * 28} 178 q6 -14 0 -22 q12 8 6 22 z" fill="#E9A07A" stroke="#D07C50" stroke-width="1.5"/>`).join('')}
      <line x1="70" y1="160" x2="250" y2="160" stroke="#C98A1C" stroke-width="4"/>
      ${arrow(160, 146, 160, 74, '#E0568C', 5)}
      ${arrow(152, 66, 96, 66, '#E0568C', 4)}
      ${arrow(168, 66, 226, 66, '#E0568C', 4)}
      ${arrow(86, 74, 86, 138, '#5F98C4', 4)}
      ${arrow(236, 74, 236, 138, '#5F98C4', 4)}
      ${arrow(94, 148, 144, 148, '#5F98C4', 4)}
      ${arrow(228, 148, 178, 148, '#5F98C4', 4)}
      <text x="176" y="112" fill="#C33C72" font-size="13">${L.rise || 'A'}</text>
      <text x="104" y="94" fill="#3C6E96" font-size="13">${L.sink || 'B'}</text>
      <text x="160" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">heating water in a pot &#183; flame underneath</text>
    </svg>`;
  }

  function roomSvg() {
    return `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="20" y="24" width="280" height="140" rx="6" fill="#FDF8EC" stroke="${INK}" stroke-width="3"/>
      <rect x="34" y="120" width="34" height="40" rx="4" fill="#E9A07A" stroke="#D07C50" stroke-width="2"/>
      <text x="51" y="176" text-anchor="middle" fill="#B0653A" font-size="10">heater</text>
      ${arrow(51, 114, 51, 48, '#E0568C', 5)}
      ${arrow(62, 40, 240, 40, '#E0568C', 4)}
      ${arrow(268, 50, 268, 132, '#5F98C4', 4)}
      ${arrow(256, 148, 84, 148, '#5F98C4', 4)}
      <text x="150" y="30" text-anchor="middle" fill="#C33C72" font-size="11">warm air rises and spreads across the ceiling</text>
      <text x="176" y="140" text-anchor="middle" fill="#3C6E96" font-size="11">cool air sinks and slides back along the floor</text>
      <text x="160" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">a convection current in a room</text>
    </svg>`;
  }

  function houseSvg() {
    return `<svg viewBox="0 0 320 210" width="320" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <polygon points="160,26 274,86 46,86" fill="#E9A07A" stroke="${INK}" stroke-width="3"/>
      <rect x="66" y="86" width="188" height="82" fill="#FBF1D3" stroke="${INK}" stroke-width="3"/>
      <rect x="96" y="106" width="42" height="36" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>
      <rect x="182" y="106" width="42" height="36" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/>
      ${arrow(160, 40, 160, 12, '#E0568C', 4)}
      <text x="170" y="24" fill="#C33C72" font-size="13">A</text>
      ${arrow(70, 100, 30, 100, '#E0568C', 4)}
      <text x="26" y="90" text-anchor="end" fill="#C33C72" font-size="13">B</text>
      ${arrow(226, 124, 300, 124, '#E0568C', 4)}
      <text x="302" y="118" fill="#C33C72" font-size="13">C</text>
      ${arrow(160, 168, 160, 186, '#E0568C', 4)}
      <text x="170" y="184" fill="#C33C72" font-size="13">D</text>
      <text x="160" y="202" text-anchor="middle" fill="${INK}" font-size="11">heat escaping from a house</text>
    </svg>`;
  }

  const coolTable = (rows) => `<table class="data"><tr><th>time (min)</th><th>cup A: no lid (°C)</th><th>cup B: with a lid (°C)</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>`;

  /* ---------- question makers ---------- */
  function wayFromExample() {
    const e = R.pick(EXAMPLES);
    return {
      prompt: `How is the heat travelling here: <b>${e.s}</b>?`,
      answer: textAns(e.t, WAY_ACCEPT[e.t], 'one word'),
      hint: 'Solid touching solid = conduction. Moving liquid or gas = convection. Across a gap with nothing touching = radiation.',
      working: [
        '<b>Picture:</b> ask the three questions — is it through a solid? is something flowing? is it across a gap?',
        `1. ${e.s.charAt(0).toUpperCase() + e.s.slice(1)} → ${e.t === 'conduction' ? 'heat is passed along a solid by touching' : e.t === 'convection' ? 'a liquid or gas is carrying the heat around' : 'the heat crosses a gap as waves'}.`,
        `So it is <b>${e.t}</b>.`,
      ],
      finalAnswer: e.t, skill: 'transfer',
    };
  }
  function wayFromDesc() {
    const w = R.pick(WAYS);
    return {
      prompt: `Which way of moving heat is <b>${w.desc}</b>?`,
      answer: textAns(w.name, WAY_ACCEPT[w.name], 'one word'),
      hint: `Think of ${w.pic}.`,
      working: [`<b>Picture:</b> ${w.pic}.`, `That is <b>${w.name}</b>.`],
      finalAnswer: w.name, skill: 'transfer',
    };
  }
  const WAYFACT_TEXT = [
    { p: 'Which way of moving heat works in <b>solids</b>?', a: 'conduction' },
    { p: 'Which way of moving heat only works in <b>liquids and gases</b>?', a: 'convection' },
    { p: 'Which way of moving heat can cross <b>empty space</b>, with no particles at all?', a: 'radiation' },
    { p: 'How does heat from the Sun reach Earth?', a: 'radiation' },
  ];
  const WAYFACT_CHOICE = [
    { p: 'In a convection current, what does the warm liquid or gas do?', a: 'It rises, because it is less dense', w: ['It sinks, because it is heavier', 'It stays exactly where it is', 'It turns into a solid'] },
    { p: 'In a convection current, what does the cool liquid or gas do?', a: 'It sinks, and takes the place of the warm stuff', w: ['It rises to the top', 'It stops moving', 'It heats up straight away'] },
  ];
  function wayFact() {
    if (R.chance(0.5)) {
      const q = R.pick(WAYFACT_TEXT);
      return {
        prompt: q.p, answer: textAns(q.a, WAY_ACCEPT[q.a], 'one word'),
        hint: 'Conduction needs touching. Convection needs something that can flow. Radiation needs nothing at all.',
        working: ['<b>Picture:</b> spoon in soup (conduction) · air rising off a heater (convection) · sun on your face (radiation).', `Answer: <b>${q.a}</b>.`],
        finalAnswer: q.a, skill: 'transfer',
      };
    }
    const q = R.pick(WAYFACT_CHOICE);
    const c = choice(q.a, q.w, 3);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Conduction needs touching. Convection needs something that can flow. Radiation needs nothing at all.',
      working: ['<b>Picture:</b> spoon in soup (conduction) · air rising off a heater (convection) · sun on your face (radiation).', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'transfer',
    };
  }
  function conductorInsulator() {
    const m = R.pick(MATERIALS);
    return {
      prompt: `Is <b>${m.m}</b> a good conductor of heat, or an insulator?`,
      answer: textAns(m.c ? 'conductor' : 'insulator', m.c ? ['a conductor', 'a good conductor', 'good conductor'] : ['an insulator', 'a poor conductor', 'poor conductor'], 'one word'),
      hint: 'Metals are the good conductors. Almost everything else — and especially anything that traps air — is an insulator.',
      working: [
        '<b>Picture:</b> a metal spoon in soup gets hot fast; a wooden spoon does not.',
        `1. Is ${m.m} a metal? ${m.c ? 'Yes.' : 'No.'}`,
        `So it is <b>${m.c ? 'a good conductor' : 'an insulator (a poor conductor)'}</b>.`,
      ],
      finalAnswer: m.c ? 'A good conductor' : 'An insulator (a poor conductor)', skill: 'conductors',
    };
  }
  function metalFeelsColder() {
    const q = R.pick([
      { p: 'A metal chair leg and a wooden seat are both at 18 °C. Why does the metal feel colder?', a: 'Metal conducts heat away from your hand much faster', w: ['The metal really is colder', 'Wood makes heat', 'Metal has less mass'] },
      { p: 'Why does a tiled bathroom floor feel colder than a carpeted one at the same temperature?', a: 'Tiles conduct heat away from your feet faster than carpet', w: ['Tiles are actually colder', 'Carpet warms itself up', 'Tiles are heavier'] },
      { p: 'Why do we use wooden or plastic handles on saucepans?', a: 'They are insulators, so the handle stays cool enough to hold', w: ['They look nicer', 'They conduct heat away from the food', 'They are heavier than metal'] },
      { p: 'Why is the pot itself made of metal?', a: 'Metal is a good conductor, so heat gets to the food quickly', w: ['Metal is an insulator', 'Metal makes its own heat', 'Metal stops convection'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'You never feel "cold" — you feel heat leaving your skin. The faster it leaves, the colder it feels.',
      working: [
        '<b>Picture:</b> your hand is the hot thing; the heat is leaving YOU.',
        '1. Metal is a good conductor, so it pulls heat out of your hand quickly.',
        '2. Wood is an insulator, so heat leaves slowly and it feels warmer.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'conductors',
    };
  }
  const TVH_TEXT = [
    { p: 'What unit is temperature measured in?', a: 'celsius', accept: ['degrees celsius', '°c', 'c', 'degrees c'], full: 'degrees Celsius (°C)' },
    { p: 'What unit is heat <b>energy</b> measured in?', a: 'joules', accept: ['joule', 'j'], full: 'joules (J)' },
    { p: 'What instrument measures temperature?', a: 'thermometer', accept: ['a thermometer'], full: 'a thermometer' },
  ];
  const TVH_CHOICE = [
    { p: 'What does <b>temperature</b> measure?', a: 'How hot something is — how fast its particles are moving', w: ['How much energy it holds altogether', 'How much stuff it is made of', 'How much space it takes up'] },
    { p: 'What is <b>heat</b>?', a: 'Energy that moves from a hotter place to a cooler place', w: ['The same thing as temperature', 'A kind of material inside hot things', 'How fast something moves'] },
    { p: 'Which way does heat always flow?', a: 'From hotter to cooler', w: ['From cooler to hotter', 'Both ways equally', 'Downwards, always'] },
    { p: 'A whole bath at 40 °C and a cup of tea at 90 °C. Which holds <b>more heat energy</b> altogether?', a: 'The bath — it has far more particles', w: ['The tea — it is at a higher temperature', 'They hold the same', 'Neither holds heat energy'] },
    { p: 'A hot drink cools down on the bench. Where does the energy go?', a: 'Into the mug, the air and the bench around it', w: ['It is destroyed', 'It goes back into the kettle', 'It turns into cold'] },
  ];
  function tempVsHeat() {
    if (R.chance(0.4)) {
      const q = R.pick(TVH_TEXT);
      return {
        prompt: q.p, answer: textAns(q.a, q.accept, 'one word'),
        hint: 'Temperature = how hot (°C). Heat = the energy that moves (J). Heat always flows hot → cold.',
        working: ['<b>Picture:</b> temperature is how hot one particle is jiggling; heat is the total energy that flows away.', `Answer: <b>${q.full}</b>.`],
        finalAnswer: q.full, skill: 'temp-heat',
      };
    }
    const q = R.pick(TVH_CHOICE);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Temperature = how hot (°C). Heat = the energy that moves (J). Heat always flows hot → cold.',
      working: ['<b>Picture:</b> temperature is how hot one particle is jiggling; heat is the total energy that flows away.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'temp-heat',
    };
  }
  function readThermometer(level) {
    const weather = R.chance(0.4);
    const lo = weather ? -10 : 0, hi = weather ? 40 : 100;
    const v = lo + 2 * R.int(1, (hi - lo) / 2 - 1);
    return {
      visual: thermometerSvg(v, lo, hi),
      prompt: `What temperature does this thermometer read?`,
      answer: { type: 'number', value: v, unit: '°C', placeholder: 'e.g. 24' },
      hint: `The long lines are every 10 °C and the short lines are every 2 °C. Read the top of the red line.`,
      working: [
        '<b>Picture:</b> the red liquid climbs up the tube as it gets hotter.',
        `1. Long marks are 10 °C apart; each short mark is 2 °C.`,
        `2. Follow the top of the red line across to the scale.`,
        `It reads <b>${v} °C</b>.`,
      ],
      finalAnswer: `${v} °C`, skill: 'thermometer',
    };
  }
  function tempChange() {
    const start = R.step(10, 30, 2), end = R.step(60, 96, 2);
    if (R.chance(0.5)) {
      return {
        prompt: `Water starts at <b>${start} °C</b> and is heated to <b>${end} °C</b>. What is the temperature rise?`,
        answer: { type: 'number', value: end - start, unit: '°C', placeholder: 'e.g. 60' },
        hint: 'Rise = finish − start.',
        working: ['<b>Rule:</b> temperature rise = final − starting temperature.', `${end} − ${start} = <b>${end - start} °C</b>.`],
        finalAnswer: `${end - start} °C`, skill: 'thermometer',
      };
    }
    const freezer = -R.step(4, 18, 2), room = R.step(16, 24, 2);
    return {
      prompt: `The freezer is at <b>${freezer} °C</b> and the kitchen is at <b>${room} °C</b>. What is the temperature difference?`,
      answer: { type: 'number', value: room - freezer, unit: '°C', placeholder: 'e.g. 40' },
      hint: 'Count up from the negative number to zero, then keep counting up to the other number.',
      working: [
        '<b>Picture:</b> a thermometer scale like a number line.',
        `From ${freezer} °C up to 0 °C is ${-freezer} °C.`,
        `From 0 °C up to ${room} °C is ${room} °C.`,
        `${-freezer} + ${room} = <b>${room - freezer} °C</b>.`,
      ],
      finalAnswer: `${room - freezer} °C`, skill: 'thermometer',
    };
  }
  function coolingCalc() {
    const start = R.step(70, 90, 5), rate = R.pick([3, 4, 5]), mins = R.int(3, 8);
    return {
      prompt: `${R.pick(THINGS_HOT).replace(/^a /, 'A ')} starts at <b>${start} °C</b> and cools by <b>${rate} °C every minute</b>. What temperature is it after <b>${mins} minutes</b>?`,
      answer: { type: 'number', value: start - rate * mins, unit: '°C', placeholder: 'e.g. 55' },
      hint: 'Work out the total drop first, then take it off the starting temperature.',
      working: ['<b>Step 1:</b> total drop = rate × time.', `${rate} × ${mins} = ${rate * mins} °C.`, `<b>Step 2:</b> ${start} − ${rate * mins} = <b>${start - rate * mins} °C</b>.`],
      finalAnswer: `${start - rate * mins} °C`, skill: 'thermometer',
    };
  }
  function potQuestion() {
    const q = R.pick([
      { p: 'Look at the pot. What does arrow <b>A</b> in the middle show?', a: 'Hot water rising, because it is less dense', w: ['Cold water sinking', 'Heat radiating out of the pot', 'Steam turning back into water'] },
      { p: 'Look at the pot. What does arrow <b>B</b> at the side show?', a: 'Cooler water sinking to take the hot water\'s place', w: ['Hot water rising', 'Heat being conducted through the metal', 'Bubbles of air rising'] },
      { p: 'The flame is only under the middle of the pot. Why does the water at the top get hot too?', a: 'A convection current carries the hot water up and round', w: ['Radiation from the flame passes through the water', 'The water conducts heat as well as a metal does', 'Hot water sinks and pushes the cold up'] },
      { p: 'What is the loop of moving water in this pot called?', a: 'a convection current', w: ['a conduction current', 'a radiation loop', 'an insulation cycle'], short: 'convection current', shortAccept: ['a convection current', 'convection'] },
    ]);
    return {
      visual: potSvg(),
      prompt: q.p,
      answer: q.short ? textAns(q.short, q.shortAccept, 'two words') : ans(choice(q.a, q.w, 4)),
      hint: 'Warm stuff rises because it spreads out and becomes less dense; cool stuff sinks into the space it left.',
      working: [
        '<b>Picture:</b> the water goes round in a loop — up the middle, across the top, down the sides.',
        '1. Heated water expands, gets less dense and <b>rises</b>.',
        '2. Cooler, denser water <b>sinks</b> to take its place.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'convection',
    };
  }
  function roomQuestion() {
    const q = R.pick([
      { p: 'Look at the room. Why is a heater usually put down low, near the floor?', a: 'The warm air rises and spreads round the whole room', w: ['Warm air sinks, so it must start high', 'It is only for safety', 'Radiation only travels upwards'] },
      { p: 'Look at the room. Why is it warmer near the ceiling than near the floor?', a: 'Warm air is less dense, so it rises and collects at the top', w: ['Heat is made in the ceiling', 'Cool air rises to the ceiling', 'The ceiling conducts heat downwards'] },
      { p: 'In this room, what is the cooler air at floor level doing?', a: 'Sinking and moving back towards the heater', w: ['Rising to the ceiling', 'Staying completely still', 'Radiating out of the window'] },
      { p: 'What is the name for the loop of moving air in this room?', a: 'a convection current', w: ['a conduction current', 'a radiation current', 'an insulation loop'], short: 'convection current', shortAccept: ['a convection current', 'convection'] },
    ]);
    return {
      visual: roomSvg(),
      prompt: q.p,
      answer: q.short ? textAns(q.short, q.shortAccept, 'two words') : ans(choice(q.a, q.w, 4)),
      hint: 'Hot air rises; cool air sinks. That loop is a convection current.',
      working: ['<b>Picture:</b> a hot air balloon rising — warm air always goes up.', '1. Air over the heater warms, expands, becomes less dense and rises.', '2. Cool air slides along the floor to take its place, and round it goes.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'convection',
    };
  }
  function houseQuestion() {
    const q = R.pick([
      { p: 'Which arrow shows the heat that ceiling batts would stop?', a: 'A', w: ['B', 'C', 'D'] },
      { p: 'Which arrow shows heat escaping through the windows?', a: 'C', w: ['A', 'B', 'D'] },
      { p: 'Which arrow would carpet and underfloor insulation reduce?', a: 'D', w: ['A', 'B', 'C'] },
      { p: 'Which arrow shows heat escaping through the walls?', a: 'B', w: ['A', 'C', 'D'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: houseSvg(),
      prompt: `A New Zealand house is losing heat in winter. ${q.p}`,
      answer: ans(c),
      hint: 'A = roof, B = walls, C = windows, D = floor.',
      working: ['<b>Picture:</b> heat leaks out of a house in every direction, and warm air rises so the roof matters most.', 'A = through the roof · B = through the walls · C = through the windows · D = through the floor.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'insulation',
    };
  }
  function insulationQ() {
    const i = R.pick(INSULATION);
    const c = choice(i.why, INSULATION.filter((x) => x.why !== i.why).map((x) => x.why), 4);
    return {
      prompt: `Why does <b>${i.s}</b> keep a house warmer?`,
      answer: ans(c),
      hint: 'Most insulation works by trapping a layer of still air — air is a rubbish conductor.',
      working: ['<b>Picture:</b> a woolly jumper works because of the air trapped in the wool, not the wool itself.', `1. ${i.s.charAt(0).toUpperCase() + i.s.slice(1)}: ${i.why}.`, `That mostly slows down <b>${i.stops}</b>.`],
      finalAnswer: i.why, skill: 'insulation',
    };
  }
  function radiationColour() {
    const q = R.pick([
      { p: 'Two cans of hot water are left out — one black, one shiny silver. Which cools down fastest?', a: 'The black one — dark surfaces give out radiation best', w: ['The shiny one — shiny metal is a conductor', 'They cool at the same rate', 'Neither cools down'] },
      { p: 'Why is the inside of a vacuum flask shiny and silver?', a: 'Shiny surfaces reflect heat radiation back in', w: ['Shiny surfaces conduct heat better', 'It looks tidy', 'It stops the drink from moving'] },
      { p: 'Why do people wear light-coloured clothes on a hot Nelson day?', a: 'Light, shiny colours reflect heat radiation away', w: ['Light colours absorb more radiation', 'Light colours conduct heat away', 'Colour makes no difference at all'] },
      { p: 'Why is there a vacuum (no air) between the walls of a thermos flask?', a: 'With no particles, heat cannot conduct or convect across the gap', w: ['A vacuum stops radiation', 'It makes the flask lighter', 'A vacuum makes the drink hotter'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Dark and dull = good at absorbing AND giving out radiation. Shiny and light = reflects it away.',
      working: ['<b>Picture:</b> a black car in the sun gets far hotter than a white one.', 'Dark, dull surfaces absorb and radiate heat best; shiny ones reflect it.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'radiation',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const rows = [[0, 80, 80], [5, 66, 72], [10, 55, 66], [15, 47, 61]];
      const c = choice('Cup A, because the lid on cup B stops heat escaping with the steam', ['Cup B, because lids make things cool faster', 'They cooled at exactly the same rate', 'Cup A, because it had less water in it'], 4);
      return {
        visual: coolTable(rows),
        prompt: 'Harper timed two identical cups of hot water cooling. Which cooled faster, and why?',
        answer: ans(c),
        hint: 'Compare the temperatures after 15 minutes.',
        working: [
          '<b>Picture:</b> steam carries heat straight out of an open cup.',
          '1. After 15 min: cup A is 47 °C, cup B is 61 °C.',
          '2. Cup A dropped 33 °C; cup B only dropped 19 °C.',
          'So <b>cup A cooled faster</b> — the lid on B trapped the hot steam and air.',
        ],
        finalAnswer: 'Cup A — the lid on cup B slowed the heat loss',
      };
    },
    () => {
      const c = choice('Everything except the wrapping must stay the same', ['Use different amounts of water in each beaker', 'Use a different thermometer for each', 'Start them at different temperatures'], 4);
      return {
        prompt: 'Harper tests which material is the best insulator by wrapping beakers of hot water in wool, foil and bubble wrap. What makes it a fair test?',
        answer: ans(c),
        hint: 'One thing changes: the material. Everything else is kept identical.',
        working: [
          '<b>Picture:</b> a fair race — same start line for everyone.',
          '1. What is she changing? The wrapping material.',
          '2. So keep the same: beaker, amount of water, starting temperature, thickness of wrapping, room, thermometer.',
          '3. Measure the same thing each time: temperature after the same number of minutes.',
        ],
        finalAnswer: 'Change only the material; keep everything else the same',
      };
    },
    () => {
      const e = R.pick(EXAMPLES);
      const c = choice(e.t, WAY_NAMES, 3);
      return {
        prompt: `In her book Harper has to say how heat travels when <b>${e.s}</b>. What should she write?`,
        answer: ans(c),
        hint: 'Through a solid = conduction. Carried by a flowing liquid or gas = convection. Across a gap = radiation.',
        working: ['<b>Picture:</b> spoon in soup · air off a heater · sun on your face.', `Here the heat travels by <b>${e.t}</b>.`],
        finalAnswer: e.t,
      };
    },
    () => {
      const c = choice('The wool traps air, and trapped air is a very poor conductor', ['Wool makes its own heat', 'Wool is a good conductor', 'Wool stops radiation completely'], 4);
      return {
        prompt: 'It is snowing in Ohakune. Why does a woolly jumper keep Harper warm?',
        answer: ans(c),
        hint: 'What is stuck in between all those fibres?',
        working: ['<b>Picture:</b> thousands of tiny air pockets in the wool.', '1. Air is a rubbish conductor of heat.', '2. The trapped air slows the heat leaving her body.', 'The jumper does not make heat — it just keeps hers in.'],
        finalAnswer: 'It traps air, which is a poor conductor',
      };
    },
    () => {
      const start = R.step(70, 90, 5), end = R.step(20, 40, 5);
      return {
        prompt: `Harper's Milo starts at ${start} °C and is ${end} °C when she finally drinks it. How much has the temperature dropped?`,
        answer: { type: 'number', value: start - end, unit: '°C', placeholder: 'e.g. 45' },
        hint: 'Drop = start − finish.',
        working: ['<b>Rule:</b> temperature drop = starting − final temperature.', `${start} − ${end} = <b>${start - end} °C</b>.`, 'That energy went into the mug, the bench and the air.'],
        finalAnswer: `${start - end} °C`,
      };
    },
    () => {
      const c = choice('Heat is conducted along the metal spoon to the handle', ['The handle radiates its own heat', 'Convection currents travel up the metal', 'The soup pushes heat up the spoon'], 4);
      return {
        visual: potSvg(),
        prompt: 'Harper leaves a metal spoon standing in the soup. Two minutes later the handle is too hot to hold. Why?',
        answer: ans(c),
        hint: 'The spoon is a solid metal — which of the three ways works in solids?',
        working: [
          '<b>Picture:</b> the particles at the hot end jiggle harder and knock into their neighbours all the way up.',
          '1. Is the spoon a solid? Yes → conduction.',
          '2. Is it a metal? Yes → a good conductor, so it happens fast.',
          'A wooden spoon would stay cool because wood is an insulator.',
        ],
        finalAnswer: 'Heat is conducted up the metal spoon',
      };
    },
    () => {
      const c = choice('Warm air rises, so the heat collects upstairs', ['Cold air rises upstairs', 'Heat is conducted up through the walls', 'The roof radiates heat downwards'], 4);
      return {
        visual: roomSvg(),
        prompt: 'The upstairs bedrooms are always warmer than the downstairs lounge, even with one heater. Why?',
        answer: ans(c),
        hint: 'Which way do convection currents carry warm air?',
        working: ['<b>Picture:</b> a hot air balloon — warm air always heads upwards.', '1. Warm air expands, becomes less dense and rises.', '2. Cool air sinks down to take its place.', 'So the warm air ends up <b>upstairs</b>.'],
        finalAnswer: 'Warm air rises, so heat collects upstairs',
      };
    },
    () => {
      const c = choice('Ceiling insulation, because most heat is lost through the roof', ['Nothing — houses do not lose heat', 'A bigger window', 'Removing the carpet'], 4);
      return {
        visual: houseSvg(),
        prompt: 'A cold Dunedin flat has no insulation at all. What single change would save the most heat?',
        answer: ans(c),
        hint: 'Warm air rises — so which surface does most of the heat reach?',
        working: [
          '<b>Picture:</b> warm air floats up and presses against the ceiling.',
          '1. Convection carries the warm air to the top of the room.',
          '2. From there it conducts straight out through the roof (arrow A).',
          'So <b>ceiling batts</b> save the most heat. Curtains and draught stoppers help too.',
        ],
        finalAnswer: 'Ceiling insulation',
      };
    },
    () => {
      const c = choice('Heat is leaving her hand quickly, so it feels cold', ['The metal is colder than the room', 'The metal is making cold', 'Her hand is conducting cold from the metal'], 4);
      return {
        prompt: 'Harper touches the metal gate and the wooden fence on the same frosty morning. Both are at 4 °C, but the gate feels much colder. What is really happening?',
        answer: ans(c),
        hint: 'There is no such thing as "cold" moving into you — only heat moving out.',
        working: [
          '<b>Picture:</b> your hand is the hot thing; heat flows out of you into the gate.',
          '1. Both really are at 4 °C — the thermometer proves it.',
          '2. Metal conducts heat away from your skin fast; wood is an insulator, so it takes heat slowly.',
          'Fast heat loss = "feels colder". Nothing cold moved into her hand.',
        ],
        finalAnswer: 'Metal conducts heat out of her hand faster',
      };
    },
    () => {
      const c = choice('It is a vacuum, so there are no particles to conduct or carry heat', ['The gap is full of a special hot gas', 'The gap makes the flask lighter', 'Air in the gap conducts heat away'], 4);
      return {
        prompt: 'A vacuum flask keeps a drink hot for hours. Why is there a gap with nothing in it between the two walls?',
        answer: ans(c),
        hint: 'Conduction and convection both need particles.',
        working: [
          '<b>Picture:</b> heat needs something to travel through — take it away and it is stuck.',
          '1. No particles → no <b>conduction</b> and no <b>convection</b> across the gap.',
          '2. Radiation can still cross empty space, so the walls are made <b>shiny</b> to reflect it back.',
          '3. The plastic stopper stops warm air escaping out the top.',
        ],
        finalAnswer: 'A vacuum has no particles, so conduction and convection cannot happen',
      };
    },
    () => {
      const c = choice('The black one, because dark surfaces absorb radiation best', ['The white one, because white attracts heat', 'They warm up the same', 'Neither warms up in the sun'], 4);
      return {
        prompt: 'Two identical water bottles sit in the sun at the beach — one black, one white. Which water gets hotter?',
        answer: ans(c),
        hint: 'Think about a black car versus a white car parked in the sun.',
        working: ['<b>Picture:</b> the sun\'s heat arrives as radiation.', '1. Dark, dull surfaces <b>absorb</b> radiation best.', '2. Shiny, light surfaces <b>reflect</b> it away.', 'So the <b>black</b> bottle gets hotter.'],
        finalAnswer: 'The black bottle',
      };
    },
  ];

  HL.registerTopic({
    id: 'heat', subject: 'science', strand: 'physical', order: 4,
    name: 'Heat', short: 'Heat', animal: 'gecko',
    blurb: 'How heat moves — through solids, in currents, and across empty space — and how we stop it.',
    example: 'metal spoon in soup = conduction · warm air rising = convection',
    learn: {
      what: '<p><b>Temperature</b> is how hot something is, measured in <b>°C</b> with a thermometer. <b>Heat</b> is the <i>energy</i> that flows, measured in joules — and it always flows from the <b>hotter</b> thing to the <b>cooler</b> one, never the other way.</p><p>Heat travels in three ways: <b>conduction</b> through solids, <b>convection</b> in liquids and gases, and <b>radiation</b> across a gap (even empty space). <b>Insulators</b> are materials that slow heat down — nearly all of them work by trapping air.</p><p><b>Picture for this topic:</b> a <b>pot of soup on the stove</b>. The metal spoon gets hot (conduction), the soup goes round in a loop (convection), and you can feel the element glowing from across the kitchen (radiation).</p>',
      visual: `<svg viewBox="0 0 350 214" width="350" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
        <text x="175" y="16" text-anchor="middle" fill="#4A4033" font-size="12.5">three ways heat travels</text>
        <rect x="8" y="24" width="108" height="128" rx="10" fill="#FBF1D3" stroke="#E8C24A" stroke-width="2.5"/>
        <text x="62" y="42" text-anchor="middle" fill="#9A6A0F" font-size="11.5">CONDUCTION</text>
        <rect x="26" y="88" width="72" height="14" rx="4" fill="#C9C2B4" stroke="#4A4033" stroke-width="2"/>
        ${[32, 48, 64, 80].map((x) => `<circle cx="${x}" cy="95" r="4" fill="#E0568C"/>`).join('')}
        ${arrow(32, 72, 84, 72, '#E0568C', 3)}
        <text x="62" y="122" text-anchor="middle" fill="#4A4033" font-size="10">SOLIDS only</text>
        <text x="62" y="138" text-anchor="middle" fill="#4A4033" font-size="10">particles pass it</text>
        <rect x="122" y="24" width="108" height="128" rx="10" fill="#E7F2FB" stroke="#5F98C4" stroke-width="2.5"/>
        <text x="176" y="42" text-anchor="middle" fill="#3C6E96" font-size="11.5">CONVECTION</text>
        <rect x="147" y="58" width="58" height="46" rx="4" fill="#DCEEF9" stroke="#4A4033" stroke-width="2"/>
        ${arrow(176, 100, 176, 66, '#E0568C', 3)}${arrow(154, 66, 154, 98, '#5F98C4', 3)}${arrow(198, 66, 198, 98, '#5F98C4', 3)}
        <text x="176" y="122" text-anchor="middle" fill="#4A4033" font-size="10">LIQUIDS &amp; GASES</text>
        <text x="176" y="138" text-anchor="middle" fill="#4A4033" font-size="10">hot rises, cool sinks</text>
        <rect x="236" y="24" width="108" height="128" rx="10" fill="#FDF0E8" stroke="#D07C50" stroke-width="2.5"/>
        <text x="290" y="42" text-anchor="middle" fill="#B0653A" font-size="11.5">RADIATION</text>
        <circle cx="258" cy="82" r="14" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
        ${[68, 82, 96].map((y) => arrow(276, y, 322, y, '#E9A07A', 3)).join('')}
        <text x="290" y="122" text-anchor="middle" fill="#4A4033" font-size="10">across a GAP</text>
        <text x="290" y="138" text-anchor="middle" fill="#4A4033" font-size="10">even in space</text>
        <rect x="8" y="160" width="334" height="46" rx="10" fill="#F3EFE6" stroke="#D9CFBE" stroke-width="2"/>
        <text x="175" y="180" text-anchor="middle" fill="#4A4033" font-size="12">heat always flows from HOTTER → COOLER</text>
        <text x="175" y="198" text-anchor="middle" fill="#C33C72" font-size="10.5">metals conduct fast &#183; trapped air insulates best</text>
      </svg>`,
      facts: [
        '<b>Temperature</b> = how hot (°C, thermometer). <b>Heat</b> = the energy that flows (joules).',
        'Heat always flows from <b>hotter to cooler</b> — never the other way.',
        '<b>Conduction</b>: through solids, particle to particle. Metals are the best.',
        '<b>Convection</b>: in liquids and gases. <b>Hot rises, cool sinks</b> — that loop is a convection current.',
        '<b>Radiation</b>: waves across a gap, no particles needed. <b>Dark and dull</b> absorbs best; <b>shiny and light</b> reflects.',
        '<b>Insulators</b> (wool, plastic, polystyrene, batts) work by <b>trapping air</b>. Air is a very poor conductor.',
      ],
      steps: [
        'Ask "<b>what is it travelling through?</b>" — a solid → <b>conduction</b>; a moving liquid or gas → <b>convection</b>; a gap or empty space → <b>radiation</b>.',
        'For convection, say it out loud: "<b>hot rises, cool sinks</b>", then draw the loop as a circle of arrows.',
        'For "why does it feel cold?", remember heat is leaving <b>you</b>. A good conductor takes it away fast, so it feels colder.',
        'For insulation, look for the <b>trapped air</b>: batts, wool, double glazing, bubble wrap, feathers.',
        'Reading a thermometer: find what one small mark is worth first, then read the <b>top</b> of the liquid.',
      ],
      examples: [
        {
          q: 'A metal spoon is left in a pot of soup and the handle gets hot. How did the heat travel?',
          working: ['<b>Picture:</b> hot particles jiggling and bumping their neighbours up the spoon.', '1. What is it travelling through? A solid.', '2. Solid → <b>conduction</b>.', '3. Metal is a good conductor, so it happens quickly.'],
          a: 'Conduction',
        },
        {
          q: 'The flame is only under the middle of the pot. Why does all the water get hot?',
          visual: potSvg(),
          working: ['<b>Picture:</b> the water goes round in a loop like a fairground ride.', '1. Water above the flame warms up, expands and becomes <b>less dense</b>.', '2. Less dense → it <b>rises</b> (arrow A).', '3. Cooler water at the sides <b>sinks</b> to take its place (arrow B).', '4. Round and round: that is a <b>convection current</b>.'],
          a: 'A convection current carries the heat all round the pot',
        },
        {
          q: 'What temperature does this thermometer read?',
          visual: thermometerSvg(38, 0, 100),
          working: ['<b>Picture:</b> the red liquid climbs as it gets hotter.', '1. The long marks are 10 °C apart.', '2. Each short mark is 2 °C.', '3. The top of the red line is 4 short marks above 30.', '4. 30 + 8 = 38.'],
          a: '38 °C',
        },
        {
          q: 'A metal gate and a wooden fence are both at 4 °C. Why does the gate feel colder?',
          working: [
            '<b>Picture:</b> your hand is the hot thing — heat is leaving YOU.',
            '1. Are they really different temperatures? No, both 4 °C.',
            '2. Metal is a good <b>conductor</b>, so it pulls heat out of your hand fast.',
            '3. Wood is an <b>insulator</b>, so heat leaves slowly.',
            'Fast heat loss = feels colder.',
          ],
          a: 'Metal conducts heat away from your hand much faster',
        },
        {
          q: 'Where does a New Zealand house lose most of its heat, and what fixes it?',
          visual: houseSvg(),
          working: [
            '<b>Picture:</b> warm air floats up and presses on the ceiling.',
            '1. Convection carries warm air upwards → arrow <b>A</b>, out through the roof.',
            '2. Fix it with ceiling batts: they trap air, which is a poor conductor.',
            '3. Windows (C) need curtains or double glazing; the floor (D) needs carpet.',
          ],
          a: 'Mostly through the roof (A) — ceiling insulation helps most',
        },
        {
          q: 'Harper wraps one beaker of hot water in wool and leaves another bare. Both start at 80 °C. What will she find, and what must she keep the same?',
          visual: `<table class="data"><tr><th>time (min)</th><th>bare (°C)</th><th>wrapped in wool (°C)</th></tr><tr><td>0</td><td>80</td><td>80</td></tr><tr><td>5</td><td>66</td><td>74</td></tr><tr><td>10</td><td>55</td><td>69</td></tr><tr><td>15</td><td>47</td><td>65</td></tr></table>`,
          working: [
            '<b>Picture:</b> the wool is a jumper for the beaker.',
            '1. Bare beaker drops 80 → 47, so 33 °C in 15 min.',
            '2. Wrapped beaker drops 80 → 65, so only 15 °C.',
            '3. The wool traps air, which slows conduction — so it cools more slowly.',
            '4. Fair test: same beaker, same volume of water, same start temperature, same room. Only the wrapping changes.',
          ],
          a: 'The wrapped beaker stays hotter; only the wrapping may change',
        },
        {
          q: 'Explain how a vacuum flask keeps a drink hot, using all three ways heat travels.',
          working: [
            '<b>Picture:</b> block all three escape routes at once.',
            '1. <b>Vacuum</b> between the walls: no particles → no conduction, no convection.',
            '2. <b>Shiny silver</b> walls: reflect the heat radiation back into the drink.',
            '3. <b>Plastic stopper</b>: plastic is an insulator, and it stops hot air escaping out the top.',
          ],
          a: 'The vacuum stops conduction and convection; the shiny walls reflect radiation; the stopper blocks the top',
        },
      ],
      tips: [
        '"It feels cold" really means "<b>heat is leaving my hand fast</b>". Cold never flows into you.',
        'Convection needs something that can <b>flow</b> — it never happens in a solid.',
        'Insulation does not <b>make</b> heat. It just slows heat down on its way out.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [wayFromExample, wayFromDesc, conductorInsulator, tempVsHeat, readThermometer, wayFact]
        : level === 2
          ? [wayFromExample, wayFromDesc, wayFact, conductorInsulator, metalFeelsColder, tempVsHeat, readThermometer, tempChange, potQuestion, roomQuestion, insulationQ]
          : [wayFromExample, wayFact, metalFeelsColder, tempVsHeat, readThermometer, tempChange, coolingCalc, potQuestion, roomQuestion, houseQuestion, insulationQ, radiationColour];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
