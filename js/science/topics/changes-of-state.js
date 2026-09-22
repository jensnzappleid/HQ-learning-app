/* Topic: Changes of state — melting, freezing, evaporating, condensing, subliming (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const CHANGES = [
    { name: 'melting', from: 'solid', to: 'liquid', energy: 'gains', particles: 'the particles gain energy, break out of their neat rows and start to slide past each other' },
    { name: 'freezing', from: 'liquid', to: 'solid', energy: 'loses', particles: 'the particles lose energy, slow down and lock into neat rows' },
    { name: 'evaporating', from: 'liquid', to: 'gas', energy: 'gains', particles: 'the particles gain enough energy to break away from each other and escape into the air' },
    { name: 'condensing', from: 'gas', to: 'liquid', energy: 'loses', particles: 'the particles lose energy, slow down and clump back together into a liquid' },
    { name: 'subliming', from: 'solid', to: 'gas', energy: 'gains', particles: 'the particles gain so much energy they escape straight from the solid into the air, with no liquid stage' },
  ];
  /** typed synonyms accepted for each change-of-state name. */
  const CHANGE_ACCEPT = {
    melting: ['melt'],
    freezing: ['freeze'],
    evaporating: ['evaporation', 'evaporate'],
    condensing: ['condensation', 'condense'],
    subliming: ['sublimation', 'sublime'],
  };

  const EVENTS = [
    { text: 'an ice cube in a glass of juice slowly turns into water', change: 'melting' },
    { text: 'a puddle on the netball court dries up in the sun', change: 'evaporating' },
    { text: 'the bathroom mirror fogs up after a hot shower', change: 'condensing' },
    { text: 'water in an ice-cube tray goes hard in the freezer', change: 'freezing' },
    { text: 'dew appears on the grass on a cold Waikato morning', change: 'condensing' },
    { text: 'chocolate left on the dashboard of the car goes runny', change: 'melting' },
    { text: 'a wet school jersey on the line dries out by lunchtime', change: 'evaporating' },
    { text: 'a block of dry ice makes smoky fog with no puddle underneath it', change: 'subliming' },
    { text: 'the wax at the top of a lit candle turns into a little pool', change: 'melting' },
    { text: 'steam from the kettle turns into droplets on the cold window', change: 'condensing' },
    { text: 'red-hot lava from Ruapehu cools into solid rock', change: 'freezing' },
    { text: 'snow on the Southern Alps slowly disappears on a dry, sunny, freezing day without ever melting', change: 'subliming' },
    { text: 'butter left on the bench in a Northland summer goes soft and runny', change: 'melting' },
    { text: 'clouds form as water vapour rises and cools high in the sky', change: 'condensing' },
    { text: 'the paint on a fence dries', change: 'evaporating' },
    { text: 'a pond in Central Otago gets a lid of ice on top in July', change: 'freezing' },
    { text: 'the fog you breathe out on a cold morning', change: 'condensing' },
    { text: 'solid air freshener in the toilet slowly shrinks away to nothing', change: 'subliming' },
  ];

  const SUBS = [
    { name: 'water', mp: 0, bp: 100 },
    { name: 'ethanol', mp: -114, bp: 78 },
    { name: 'oxygen', mp: -219, bp: -183 },
    { name: 'nitrogen', mp: -210, bp: -196 },
    { name: 'chlorine', mp: -101, bp: -34 },
    { name: 'bromine', mp: -7, bp: 59 },
    { name: 'mercury', mp: -39, bp: 357 },
    { name: 'sodium', mp: 98, bp: 883 },
    { name: 'sulfur', mp: 115, bp: 445 },
    { name: 'lead', mp: 327, bp: 1749 },
    { name: 'aluminium', mp: 660, bp: 2470 },
    { name: 'gold', mp: 1064, bp: 2856 },
    { name: 'copper', mp: 1085, bp: 2562 },
    { name: 'iron', mp: 1538, bp: 2862 },
  ];
  const stateAt = (s, t) => (t < s.mp ? 'solid' : t < s.bp ? 'liquid' : 'gas');

  const COOLING = [
    'Harper climbs out of the pool at the Waiwera baths and shivers, even though the air is warm',
    'Harper is sweaty after cross-country and the breeze makes her feel freezing',
    'a wet tea towel wrapped round a drink bottle keeps the drink cold on a hot day',
    'a splash of hand sanitiser feels cold on your hands',
    'a dab of nail polish remover feels icy on your skin',
  ];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });

  /* ---------- diagrams ---------- */
  const JIT = [[2, -2], [-2, 2], [3, 1], [-2, -3], [1, 2], [-3, -1], [2, -2], [0, 3]];
  function dots(state, x, y) {
    const out = [];
    if (state === 'solid') { for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) out.push([x + 18 + i * 18, y + 18 + j * 18]); }
    else if (state === 'liquid') { for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) { const k = j * 4 + i; out.push([x + 14 + i * 15 + JIT[k][0], y + 34 + j * 18 + JIT[k][1]]); } }
    else { [[0, 0], [2, 0], [1, 2], [3, 2]].forEach(([i, j], k) => out.push([x + 18 + i * 16 + JIT[k][0], y + 18 + j * 20 + JIT[k][1]])); }
    return out.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="5.5" fill="#B9A5E6" stroke="#8B76C4" stroke-width="1.3"/>`).join('');
  }
  const arrow = (x1, x2, y, colour) => {
    const dir = x2 > x1 ? 1 : -1;
    return `<line x1="${x1}" y1="${y}" x2="${x2 - dir * 8}" y2="${y}" stroke="${colour}" stroke-width="3"/><path d="M${x2} ${y} l${-dir * 9} -5 l0 10z" fill="${colour}"/>`;
  };
  const stateWheel = () => `<svg viewBox="0 0 344 208" width="344" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${[['solid', 18], ['liquid', 136], ['gas', 254]].map(([s, x]) => `<rect x="${x}" y="64" width="72" height="72" rx="8" fill="#FFFFFF" stroke="#8B76C4" stroke-width="3"/>${dots(s, x, 64)}`).join('')}
      ${arrow(58, 168, 52, '#D9941F')}${arrow(176, 286, 52, '#D9941F')}
      <text x="113" y="42" text-anchor="middle" fill="#D9941F">melting</text>
      <text x="231" y="42" text-anchor="middle" fill="#D9941F">evaporating</text>
      <text x="172" y="22" text-anchor="middle" fill="#C97B52" font-size="12.5">heating ➜ particles gain energy</text>
      ${arrow(168, 58, 164, '#5F98C4')}${arrow(286, 176, 164, '#5F98C4')}
      <text x="113" y="184" text-anchor="middle" fill="#5F98C4">freezing</text>
      <text x="231" y="184" text-anchor="middle" fill="#5F98C4">condensing</text>
      <text x="54" y="152" text-anchor="middle" fill="#4A4033" font-size="12.5">SOLID</text>
      <text x="172" y="152" text-anchor="middle" fill="#4A4033" font-size="12.5">LIQUID</text>
      <text x="290" y="152" text-anchor="middle" fill="#4A4033" font-size="12.5">GAS</text>
      <text x="172" y="202" text-anchor="middle" fill="#8B76C4" font-size="12">subliming = solid straight to gas (dry ice)</text>
    </svg>`;

  /** heating graph with two flat parts; segments labelled A–E */
  const heatGraph = (mp, bp) => `<svg viewBox="0 0 344 206" width="344" height="206" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <line x1="52" y1="24" x2="52" y2="164" stroke="#4A4033" stroke-width="2.5"/>
      <line x1="52" y1="164" x2="330" y2="164" stroke="#4A4033" stroke-width="2.5"/>
      <line x1="52" y1="112" x2="316" y2="112" stroke="#C9C0B4" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="52" y1="62" x2="316" y2="62" stroke="#C9C0B4" stroke-width="1.5" stroke-dasharray="4 4"/>
      <polyline points="60,150 100,112 152,112 196,62 262,62 312,34" fill="none" stroke="#E0568C" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
      <text x="84" y="152" fill="#4A4033">A</text>
      <text x="122" y="104" fill="#4A4033">B</text>
      <text x="178" y="110" fill="#4A4033">C</text>
      <text x="226" y="54" fill="#4A4033">D</text>
      <text x="300" y="82" fill="#4A4033">E</text>
      <text x="46" y="116" text-anchor="end" fill="#5F98C4">${mp}</text>
      <text x="46" y="66" text-anchor="end" fill="#5F98C4">${bp}</text>
      <text x="26" y="30" fill="#4A4033" font-size="12">°C</text>
      <text x="190" y="186" text-anchor="middle" fill="#4A4033" font-size="12.5">time the substance is heated ➜</text>
    </svg>`;

  const subTable = (rows) => `<table class="data"><tr><th>substance</th><th>melts at</th><th>boils at</th></tr>`
    + rows.map((s) => `<tr><td>${s.name}</td><td>${s.mp} °C</td><td>${s.bp} °C</td></tr>`).join('') + `</table>`;

  /* ---------- question makers ---------- */
  function nameChange(level) {
    const c = R.pick(CHANGES);
    return {
      prompt: `What is the name of the change from a <b>${c.from}</b> to a <b>${c.to}</b>?`,
      answer: textAns(c.name, CHANGE_ACCEPT[c.name], 'one word'),
      hint: c.energy === 'gains' ? 'The particles are gaining energy (heating up).' : 'The particles are losing energy (cooling down).',
      working: ['<b>Picture:</b> an ice cube on a hot day — block → puddle → invisible vapour.', `1. ${c.from} → ${c.to}: are the particles gaining or losing energy? They are <b>${c.energy === 'gains' ? 'gaining' : 'losing'}</b> it.`, `That change is called <b>${c.name}</b>.`],
      finalAnswer: c.name, skill: 'names',
    };
  }
  function changeStates(level) {
    const c = R.pick(CHANGES);
    const askFrom = R.chance(0.5);
    const correct = askFrom ? c.from : c.to;
    return {
      prompt: `When something is <b>${c.name}</b>, what state does it ${askFrom ? 'start as' : 'end up as'}?`,
      answer: textAns(correct, [], 'one word'),
      hint: `${c.name.charAt(0).toUpperCase() + c.name.slice(1)} goes ${c.from} → ${c.to}.`,
      working: [`1. ${c.name.charAt(0).toUpperCase() + c.name.slice(1)} goes <b>${c.from} → ${c.to}</b>.`, `So it ${askFrom ? 'starts as' : 'ends up as'} a <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'names',
    };
  }
  function eventChange(level) {
    const e = R.pick(level === 1 ? EVENTS.filter((x) => x.change !== 'subliming') : EVENTS);
    const c = CHANGES.find((x) => x.name === e.change);
    return {
      prompt: `Which change of state is happening when <b>${e.text}</b>?`,
      answer: textAns(e.change, CHANGE_ACCEPT[e.change], 'one word'),
      hint: 'Work out what state it started as and what state it ended as.',
      working: ['<b>Picture:</b> ice cube → puddle → invisible vapour.', `1. What state did it start as? A <b>${c.from}</b>.`, `2. What state did it end as? A <b>${c.to}</b>.`, `${c.from} → ${c.to} is <b>${c.change || c.name}</b>.`],
      finalAnswer: e.change, skill: 'everyday',
    };
  }
  function particleStory(level) {
    const c = R.pick(CHANGES);
    const opt = choice(c.particles, CHANGES.filter((x) => x.name !== c.name).map((x) => x.particles), 4);
    return {
      prompt: `What are the particles doing during <b>${c.name}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Heating adds energy and spreads particles out; cooling takes energy away and pulls them together.',
      working: ['<b>Picture:</b> the same class of kids — sitting in rows, then milling about, then let loose on the field. Same kids every time!', `1. ${c.name} goes ${c.from} → ${c.to}, so energy is <b>${c.energy === 'gains' ? 'added' : 'taken away'}</b>.`, `So <b>${c.particles}</b>.`],
      finalAnswer: c.particles, skill: 'particles',
    };
  }
  function sameParticles(level) {
    const opt = choice('Nothing — they are exactly the same particles, just arranged differently', [
      'They turn into water vapour particles, which are a different kind',
      'They get bigger and lighter',
      'Some of them are destroyed and new ones are made',
    ], 4);
    return {
      prompt: 'An ice cube melts and then the water boils away. What happens to the water particles themselves?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'A change of state only changes the ARRANGEMENT, never the particles.',
      working: ['<b>Picture:</b> the same class of kids, first in assembly rows, then milling about, then sprinting on the field. Still the same kids.', '1. Is any new substance made? No — it is water the whole way through.', '2. Only the spacing and speed change.', 'Answer: <b>they are exactly the same particles, just arranged differently</b>.'],
      finalAnswer: 'Nothing — they are exactly the same particles, just arranged differently', skill: 'particles',
    };
  }
  function waterPoints(level) {
    if (R.chance(0.5)) {
      return {
        prompt: 'At what temperature does pure water <b>melt and freeze</b>?',
        answer: { type: 'number', value: 0, unit: '°C', placeholder: 'e.g. 0' },
        hint: 'It is the temperature ice turns to water — and water turns to ice.',
        working: ['<b>Picture:</b> ice cubes coming out of the freezer.', 'Water melts AND freezes at the same temperature: <b>0 °C</b>.'],
        finalAnswer: '0 °C', skill: 'points',
      };
    }
    return {
      prompt: 'At what temperature does pure water <b>boil</b>?',
      answer: { type: 'number', value: 100, unit: '°C', placeholder: 'e.g. 100' },
      hint: 'Think of the kettle at sea level.',
      working: ['<b>Picture:</b> a jug of water bubbling like mad.', 'Pure water boils at <b>100 °C</b>.'],
      finalAnswer: '100 °C', skill: 'points',
    };
  }
  function lookupPoint(level) {
    const s = R.pick(SUBS);
    const melting = R.chance(0.5);
    const rows = R.shuffle([s].concat(R.sample(SUBS.filter((x) => x.name !== s.name), 3)));
    return {
      visual: subTable(rows),
      prompt: `Use the table. What is the <b>${melting ? 'melting' : 'boiling'} point</b> of ${s.name}?`,
      answer: { type: 'number', value: melting ? s.mp : s.bp, unit: '°C', placeholder: 'e.g. 100' },
      hint: `Find the ${s.name} row, then read the ${melting ? 'melting' : 'boiling'} point column.`,
      working: [`1. Find the row for <b>${s.name}</b>.`, `2. Read across to the ${melting ? 'melting' : 'boiling'} point column.`, `It is <b>${melting ? s.mp : s.bp} °C</b>.`],
      finalAnswer: `${melting ? s.mp : s.bp} °C`, skill: 'table',
    };
  }
  function stateFromPoints(level) {
    const s = R.pick(SUBS);
    const want = R.pick(['solid', 'liquid', 'gas']);
    let t;
    if (want === 'solid') t = Math.max(-265, s.mp - R.pick([5, 10, 20, 50]));
    else if (want === 'gas') t = s.bp + R.pick([5, 20, 50, 100]);
    else t = Math.round(s.mp + (s.bp - s.mp) * R.pick([0.25, 0.5, 0.75]));
    if (t <= s.mp) t = s.mp + 1;
    const real = stateAt(s, t);
    const rows = R.shuffle([s].concat(R.sample(SUBS.filter((x) => x.name !== s.name), 3)));
    return {
      visual: subTable(rows),
      prompt: `Use the table. What state is <b>${s.name}</b> in at <b>${t} °C</b>?`,
      answer: textAns(real, [], 'one word'),
      hint: 'Below the melting point = solid. Between the two = liquid. Above the boiling point = gas.',
      working: [
        '<b>Picture:</b> a temperature ladder with two rungs on it — the melting point and the boiling point.',
        `1. ${s.name} melts at ${s.mp} °C and boils at ${s.bp} °C.`,
        `2. Is ${t} below ${s.mp}? ${t < s.mp ? 'Yes → solid.' : 'No.'}`,
        `3. Is ${t} above ${s.bp}? ${t >= s.bp ? 'Yes → gas.' : 'No — so it is between the two.'}`,
        `At ${t} °C, ${s.name} is a <b>${real}</b>.`,
      ],
      finalAnswer: real, skill: 'table',
    };
  }
  function roomState(level) {
    const groups = { solid: SUBS.filter((s) => stateAt(s, 20) === 'solid'), liquid: SUBS.filter((s) => stateAt(s, 20) === 'liquid'), gas: SUBS.filter((s) => stateAt(s, 20) === 'gas') };
    const want = R.pick(['solid', 'liquid', 'gas']);
    const target = R.pick(groups[want]);
    const others = R.sample(SUBS.filter((s) => stateAt(s, 20) !== want), 3);
    const rows = R.shuffle([target].concat(others));
    const opt = choice(target.name, others.map((s) => s.name), 4);
    return {
      visual: subTable(rows),
      prompt: `Room temperature is about 20 °C. Which substance in the table is a <b>${want}</b> at room temperature?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'For each one ask: is 20 °C below the melting point, between the two, or above the boiling point?',
      working: [
        '<b>Picture:</b> put 20 °C on the temperature ladder and see where it lands for each substance.',
        `1. ${target.name}: melts at ${target.mp} °C, boils at ${target.bp} °C.`,
        `2. 20 °C is ${want === 'solid' ? `below ${target.mp}` : want === 'gas' ? `above ${target.bp}` : `between ${target.mp} and ${target.bp}`}.`,
        `So <b>${target.name}</b> is a ${want} at room temperature.`,
      ],
      finalAnswer: target.name, skill: 'table',
    };
  }
  function rangeCalc(level) {
    const s = R.pick(SUBS);
    return {
      visual: subTable(R.shuffle([s].concat(R.sample(SUBS.filter((x) => x.name !== s.name), 2)))),
      prompt: `Use the table. Over how many degrees is <b>${s.name}</b> a liquid? (boiling point − melting point)`,
      answer: { type: 'number', value: s.bp - s.mp, unit: '°C', placeholder: 'e.g. 100' },
      hint: 'It is a liquid from its melting point up to its boiling point. Subtract.',
      working: [`<b>Picture:</b> the gap between the two rungs on the temperature ladder.`, `1. Boiling point = ${s.bp} °C, melting point = ${s.mp} °C.`, `2. ${s.bp} − (${s.mp}) = <b>${s.bp - s.mp}</b>.`, `${s.name} is a liquid over a range of <b>${s.bp - s.mp} °C</b>.`],
      finalAnswer: `${s.bp - s.mp} °C`, skill: 'table',
    };
  }
  function graphQ(level) {
    const mp = R.pick([0, 10, 20, 40, 50]);
    const bp = mp + R.pick([60, 70, 80, 100]);
    const form = R.pick(level === 1 ? ['letter-melt', 'read-mp'] : ['letter-melt', 'letter-boil', 'read-mp', 'read-bp', 'flat-why', 'segment']);
    const g = heatGraph(mp, bp);
    if (form === 'read-mp' || form === 'read-bp') {
      const isMp = form === 'read-mp';
      return {
        visual: g,
        prompt: `The graph shows a solid being heated. What is its <b>${isMp ? 'melting' : 'boiling'} point</b>?`,
        answer: { type: 'number', value: isMp ? mp : bp, unit: '°C', placeholder: 'e.g. 100' },
        hint: `The ${isMp ? 'first' : 'second'} flat part is where it is ${isMp ? 'melting' : 'boiling'} — read the temperature there.`,
        working: ['<b>Picture:</b> the temperature stops climbing while the change of state happens.', `1. Find the ${isMp ? 'first' : 'second'} flat part of the line (that is part ${isMp ? 'B' : 'D'}).`, '2. Read straight across to the temperature axis.', `The ${isMp ? 'melting' : 'boiling'} point is <b>${isMp ? mp : bp} °C</b>.`],
        finalAnswer: `${isMp ? mp : bp} °C`, skill: 'graph',
      };
    }
    if (form === 'letter-melt' || form === 'letter-boil') {
      const melt = form === 'letter-melt';
      const correct = melt ? 'B' : 'D';
      const opt = choice(correct, ['A', 'B', 'C', 'D', 'E'].filter((x) => x !== correct), 4);
      return {
        visual: g,
        prompt: `The graph shows a solid being heated until it becomes a gas. Which lettered part shows it <b>${melt ? 'melting' : 'boiling'}</b>?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'A change of state is always a FLAT part — the temperature stays still.',
        working: ['<b>Picture:</b> the thermometer freezes in place while the ice turns to water.', '1. Changes of state are the <b>flat</b> parts: B and D.', '2. B is the first flat part (lower temperature) → melting. D is the second → boiling.', `So it is part <b>${correct}</b>.`],
        finalAnswer: correct, skill: 'graph',
      };
    }
    if (form === 'flat-why') {
      const opt = choice('The energy is being used to pull the particles apart, not to raise the temperature', [
        'The heater has been switched off during that time',
        'The substance has stopped absorbing any energy',
        'The thermometer is broken during that part',
      ], 4);
      return {
        visual: g,
        prompt: 'The heater stays on the whole time, but during part <b>B</b> the temperature does not rise at all. Why not?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Something else is using up the energy while the substance changes state.',
        working: [
          '<b>Picture:</b> the energy is busy breaking the particles out of their neat rows.',
          '1. Is heat still going in? Yes — the heater is on.',
          '2. What is that energy doing? Breaking the forces holding the particles in place.',
          '3. Only once every particle is free does the temperature start climbing again.',
          'Answer: <b>the energy is being used to pull the particles apart, not to raise the temperature</b>.',
        ],
        finalAnswer: 'The energy is being used to pull the particles apart, not to raise the temperature', skill: 'graph',
      };
    }
    const seg = R.pick([['A', 'a solid warming up'], ['B', 'melting — solid and liquid together'], ['C', 'a liquid warming up'], ['D', 'boiling — liquid turning into gas'], ['E', 'a gas warming up']]);
    const opt = choice(seg[1], ['a solid warming up', 'melting — solid and liquid together', 'a liquid warming up', 'boiling — liquid turning into gas', 'a gas warming up'].filter((x) => x !== seg[1]), 4);
    return {
      visual: g,
      prompt: `On the heating graph, what is happening during part <b>${seg[0]}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Sloping = just warming up. Flat = changing state.',
      working: ['<b>Picture:</b> read the graph left to right: solid → melting → liquid → boiling → gas.', '1. Is part ' + seg[0] + ' sloping or flat? ' + (seg[0] === 'B' || seg[0] === 'D' ? 'Flat → a change of state.' : 'Sloping → just warming up.'), `So part ${seg[0]} is <b>${seg[1]}</b>.`],
      finalAnswer: seg[1], skill: 'graph',
    };
  }
  function evapCooling(level) {
    const s = R.pick(COOLING);
    const opt = choice('The fastest particles escape first, so the ones left behind are slower — and slower means cooler', [
      'The water pushes the heat out of your skin',
      'The liquid turns into ice on your skin',
      'Cold particles from the air stick to the wet patch',
    ], 4);
    return {
      prompt: `Explain why ${s}.`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Which particles manage to escape from a liquid — the fast ones or the slow ones?',
      working: [
        '<b>Picture:</b> the fastest kids sprint out the school gate first; the ones left in the yard are the slow ones.',
        '1. To evaporate, a particle needs lots of energy — so only the <b>fastest</b> ones escape.',
        '2. That leaves the slower particles behind.',
        '3. Slower particles = lower temperature. So evaporation <b>cools</b> whatever is left.',
        'Answer: <b>the fastest particles escape first, so what is left behind is cooler</b>.',
      ],
      finalAnswer: 'The fastest particles escape first, so the ones left behind are cooler', skill: 'evaporation',
    };
  }
  function evapVsBoil(level) {
    const opt = choice('Evaporation happens at any temperature and only at the surface; boiling happens only at the boiling point and all through the liquid', [
      'They are exactly the same thing with two names',
      'Evaporation only happens above the boiling point',
      'Boiling happens only at the surface of the liquid',
    ], 4);
    return {
      prompt: 'What is the difference between <b>evaporating</b> and <b>boiling</b>?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'A puddle dries up at 15 °C — it is certainly not boiling.',
      working: ['<b>Picture:</b> a puddle drying on a cool day vs a jug bubbling like mad.', '1. Does a puddle need to be at 100 °C to dry up? No — evaporation happens at any temperature, from the surface only.', '2. Boiling needs the boiling point, and bubbles form all the way through.', 'Answer: <b>evaporation: any temperature, surface only. Boiling: at the boiling point, all through.</b>'],
      finalAnswer: 'Evaporation: any temperature, surface only. Boiling: only at the boiling point, all through the liquid', skill: 'evaporation',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('Water vapour from the shower touched the cold mirror, lost energy and condensed into drops', [
        'The mirror made new water out of the air',
        'The hot air melted on the mirror',
        'Water evaporated out of the mirror',
      ], 4);
      return {
        prompt: 'After a hot shower the bathroom mirror is covered in tiny water drops. Where did the water come from?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Something invisible in the warm air met something cold.',
        working: ['<b>Picture:</b> invisible vapour hits a cold surface and slows right down.', '1. The hot shower filled the room with invisible <b>water vapour</b> (a gas).', '2. The mirror is cold, so the vapour <b>lost energy</b> and slowed down.', '3. Slow particles clump back together → a liquid. That is <b>condensing</b>.'],
        finalAnswer: 'Water vapour condensed on the cold mirror',
      };
    },
    () => {
      const opt = choice('Subliming — the solid turns straight into a gas with no liquid stage', ['Melting, then evaporating very quickly', 'Freezing', 'Condensing'], 4);
      return {
        prompt: 'Dry ice is put in a bowl for a school production. It makes thick fog but leaves no puddle behind at all. Which change of state is happening?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'No puddle means it never became a liquid.',
        working: ['<b>Picture:</b> the block just vanishes into smoke — nothing wet is left.', '1. Did it become a liquid at any point? No — there is no puddle.', '2. Solid straight to gas has a special name.', 'Answer: <b>subliming</b> (sublimation).'],
        finalAnswer: 'Subliming — solid straight to gas',
      };
    },
    () => {
      const opt = choice('The washing dries faster — more energy and moving air help the fastest particles escape', [
        'The washing dries slower because the wind pushes water back in',
        'It makes no difference at all',
        'The water freezes onto the washing',
      ], 4);
      return {
        prompt: 'Harper hangs the washing out on a warm, windy Canterbury day instead of a cold, still one. What difference does it make, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Evaporation needs energy, and it helps if the escaped particles get blown away.',
        working: ['<b>Picture:</b> the fastest kids sprinting out the gate — and nobody blocking the gate.', '1. Warm = particles have more energy, so more of them can escape.', '2. Wind carries the escaped vapour away, so fewer come back.', 'So it <b>dries faster</b>.'],
        finalAnswer: 'It dries faster — warmth gives particles energy and wind carries the vapour away',
      };
    },
    () => {
      const opt = choice('No — melting and freezing happen at exactly the same temperature, just in opposite directions', [
        'Yes — freezing point is always lower than melting point',
        'Yes — freezing point is always higher than melting point',
        'Only water has them at the same temperature',
      ], 4);
      return {
        prompt: 'Harper\'s friend says "the melting point and the freezing point of a substance are different temperatures". Is that right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Water melts at 0 °C. What temperature does water freeze at?',
        working: ['<b>Picture:</b> one line on the thermometer, crossed going up or going down.', '1. Water melts at 0 °C. Water freezes at 0 °C.', '2. Same temperature — only the direction changes.', 'Answer: <b>no — they are the same temperature</b>.'],
        finalAnswer: 'No — they are the same temperature, just in opposite directions',
      };
    },
    () => {
      const s = R.pick(SUBS.filter((x) => x.mp > 200));
      const opt = choice(`Heat it above ${s.mp} °C`, [`Heat it above ${s.bp} °C`, `Cool it below ${s.mp} °C`, `Heat it to exactly 100 °C`], 4);
      return {
        visual: subTable([s].concat(R.sample(SUBS.filter((x) => x.name !== s.name), 2))),
        prompt: `A metalworker wants to <b>melt ${s.name}</b> so it can be poured into a mould. Use the table: what does she have to do?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Melting starts at the melting point, not the boiling point.',
        working: [`<b>Picture:</b> the temperature ladder — the first rung is the melting point.`, `1. What is the melting point of ${s.name}? <b>${s.mp} °C</b>.`, `2. To melt it, get it above that.`, `Answer: <b>heat it above ${s.mp} °C</b> (heating past ${s.bp} °C would boil it away).`],
        finalAnswer: `Heat it above ${s.mp} °C`,
      };
    },
    () => {
      const opt = choice('The water vapour you breathe out condenses when it hits the cold air', [
        'You breathe out tiny ice crystals',
        'Your breath is smoke from your lungs',
        'The cold air melts inside your mouth',
      ], 4);
      return {
        prompt: 'On a frosty Ōhakune morning you can see your breath, but in summer you cannot. Why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Your breath always has invisible water vapour in it.',
        working: ['<b>Picture:</b> a warm shower meeting a cold mirror.', '1. Your breath contains invisible water <b>vapour</b>.', '2. Cold air makes it lose energy fast, so it <b>condenses</b> into tiny visible drops.', '3. In summer the air is too warm for that, so it stays invisible.'],
        finalAnswer: 'The water vapour in your breath condenses into tiny drops in the cold air',
      };
    },
    () => {
      const opt = choice('Take the temperature every minute and plot it — look for the flat part', [
        'Watch until it looks melted and guess the temperature',
        'Measure the temperature once at the start and once at the end',
        'Weigh it before and after',
      ], 4);
      return {
        prompt: 'EXPERIMENT: Harper wants to find the melting point of a lump of wax. What is the best way to do it?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The melting point shows up as something special on a graph.',
        working: [
          '<b>Picture:</b> the thermometer stops climbing while the wax turns runny.',
          '1. What happens to the temperature while something melts? It <b>stays still</b>.',
          '2. So take readings every minute and draw a graph.',
          '3. The temperature of the <b>flat part</b> is the melting point.',
        ],
        finalAnswer: 'Take the temperature every minute, plot a graph, and read the flat part',
      };
    },
    () => {
      const opt = choice('It is still 0 °C — the temperature does not change while the ice is melting', ['It rises steadily the whole time', 'It drops below 0 °C', 'It jumps to 100 °C'], 4);
      return {
        visual: heatGraph(0, 100),
        prompt: 'A beaker of ice at 0 °C is heated. Five minutes later some ice is still floating in the water. What is the temperature now?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Look at the flat part of the graph — what happens to the temperature there?',
        working: [
          '<b>Picture:</b> the thermometer stuck in place while the flat part of the graph happens.',
          '1. Is there still ice in there? Yes — so it is still melting.',
          '2. While something is melting, all the energy goes into breaking the particles free, not into heating.',
          'So the temperature is <b>still 0 °C</b>.',
        ],
        finalAnswer: 'Still 0 °C',
      };
    },
    () => {
      const opt = choice('Water expands when it freezes, so the ice pushes the bottle apart', ['The plastic shrinks in the cold and tears', 'The water particles get bigger when frozen', 'Air is sucked into the bottle'], 4);
      return {
        prompt: 'Harper fills a plastic bottle right to the top with water and puts it in the freezer. In the morning the bottle has split. Why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Water is unusual — ice takes up MORE room than the water it came from. (That is why ice floats.)',
        working: [
          '<b>Picture:</b> ice cubes floating in a drink — they float because ice is less dense.',
          '1. Do the particles get bigger? No — never.',
          '2. But water particles lock into an open pattern when they freeze, taking up <b>more space</b>.',
          '3. A full sealed bottle has nowhere for that extra volume to go, so it splits.',
        ],
        finalAnswer: 'Water expands when it freezes, so the ice pushed the bottle apart',
      };
    },
    () => {
      const opt = choice('It condenses back into a liquid', ['It melts', 'It freezes into ice', 'It sublimes'], 4);
      return {
        prompt: 'Steam from a boiling jug is trapped and cooled down. What happens to it?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Cooling a gas is the opposite of evaporating.',
        working: ['<b>Picture:</b> steam hitting a cold window and running down it as drops.', '1. It starts as a gas.', '2. Cooling takes energy away, so the particles slow and clump.', 'Gas → liquid is <b>condensing</b>.'],
        finalAnswer: 'It condenses back into a liquid',
      };
    },
    () => {
      const opt = choice('Spot the mistake: the mass stays the same — no particles are lost when ice melts', [
        'The mass goes down because water is lighter than ice',
        'The mass goes up because water is heavier than ice',
        'The mass halves',
      ], 4);
      return {
        prompt: 'Harper weighs a sealed jar of ice, lets it melt, and weighs it again. Her friend predicts the jar will be lighter. Who is right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Count the particles before and after — none escaped from the sealed jar.',
        working: ['<b>Picture:</b> the same class of kids, just standing differently. Nobody left the room.', '1. Is the jar sealed? Yes — nothing can escape.', '2. Melting only rearranges the particles.', 'So the <b>mass stays exactly the same</b> — Harper is right.'],
        finalAnswer: 'The mass stays the same — melting does not lose any particles',
      };
    },
  ];

  HL.registerTopic({
    id: 'changes-of-state', subject: 'science', strand: 'material', order: 2,
    name: 'Changes of state', short: 'State changes', animal: 'owl',
    blurb: 'Melting, freezing, evaporating and condensing — the same particles, rearranged.',
    example: 'ice → water → steam: melting at 0 °C, boiling at 100 °C',
    learn: {
      what: '<p>Heating or cooling something can change it from a <b>solid</b> to a <b>liquid</b> to a <b>gas</b> and back again. These are <b>changes of state</b>. Nothing new is made: the particles are exactly the same particles, they are just arranged differently and moving at a different speed. That means every change of state can be <b>reversed</b>.</p><p><b>Picture for this topic:</b> one <b>ice cube on a hot day</b> — a hard block, then a puddle, then invisible vapour. Same water the whole way through, like the same class of kids sitting in rows, then milling about, then let loose on the field.</p>',
      visual: stateWheel(),
      facts: [
        'Heating: <b>melting</b> (solid → liquid), <b>evaporating / boiling</b> (liquid → gas)',
        'Cooling: <b>condensing</b> (gas → liquid), <b>freezing</b> (liquid → solid)',
        '<b>Subliming</b> = solid straight to gas, with no liquid in between (dry ice)',
        'Pure water: <b>melts and freezes at 0 °C</b>, <b>boils at 100 °C</b>',
        'Melting point and freezing point are the <b>same temperature</b> — just opposite directions',
        'On a heating graph the <b>flat parts</b> are the changes of state — the temperature stays still while the particles are being pulled apart',
      ],
      steps: [
        'Ask "<b>what state did it start as, and what state did it end as?</b>" Then name the arrow: solid→liquid = melting, liquid→gas = evaporating, gas→liquid = condensing, liquid→solid = freezing, solid→gas = subliming.',
        'Ask "<b>is it heating up or cooling down?</b>" Heating = particles gain energy and spread out. Cooling = particles lose energy and pull together.',
        'Never say the particles changed, grew or disappeared. Say the <b>arrangement</b> and the <b>speed</b> changed.',
        'For a temperature question, put the number on a ladder with two rungs: <b>below the melting point = solid</b>, <b>between = liquid</b>, <b>above the boiling point = gas</b>.',
        'On a graph: <b>sloping = warming up</b>, <b>flat = changing state</b>. First flat part = melting, second = boiling.',
      ],
      examples: [
        {
          q: 'Dew appears on the grass on a cold morning. Which change of state is that?',
          working: ['<b>Picture:</b> a hot shower fogging a cold mirror.', '1. What was it before? Invisible water <b>vapour</b> (a gas) in the air.', '2. What is it now? Liquid drops.', '3. Gas → liquid, and it happened because the grass was <b>cold</b>.'],
          a: 'Condensing',
        },
        {
          q: 'Follow the arrows: what is the change from a liquid to a solid called, and are the particles gaining or losing energy?',
          visual: stateWheel(),
          working: ['<b>Picture:</b> the kids stop running and sit back down in rows.', '1. Liquid → solid is the <b>blue (cooling) arrow</b>: freezing.', '2. Cooling means the particles <b>lose</b> energy, slow down and lock into place.'],
          a: 'Freezing — the particles are losing energy',
        },
        {
          q: 'An ice cube melts and then boils away. What has happened to the water particles themselves?',
          working: ['<b>Picture:</b> the same class of kids — assembly rows, then lunchtime crowd, then loose on the field.', '1. Was a new substance made? <b>No</b> — it is water all the way through.', '2. So the particles are the same ones.', '3. Only their <b>arrangement</b> and their <b>speed</b> changed.'],
          a: 'Nothing — they are the same particles, just arranged differently',
        },
        {
          q: 'Ethanol melts at −114 °C and boils at 78 °C. What state is it in at 25 °C?',
          visual: `<table class="data"><tr><th>substance</th><th>melts at</th><th>boils at</th></tr><tr><td>ethanol</td><td>−114 °C</td><td>78 °C</td></tr><tr><td>oxygen</td><td>−219 °C</td><td>−183 °C</td></tr><tr><td>iron</td><td>1538 °C</td><td>2862 °C</td></tr></table>`,
          working: ['<b>Picture:</b> a temperature ladder with two rungs — the melting point and the boiling point.', '1. Is 25 below −114? <b>No.</b>', '2. Is 25 above 78? <b>No.</b>', '3. So it sits <b>between</b> the two rungs.'],
          a: 'A liquid',
        },
        {
          q: 'Read the heating graph. Which part shows melting, and what is the boiling point?',
          visual: heatGraph(0, 100),
          working: [
            '<b>Picture:</b> the thermometer stops climbing while the change of state happens.',
            '1. Find the <b>flat</b> parts — those are the changes of state: B and D.',
            '2. B is the lower one → <b>melting</b>. D is the higher one → boiling.',
            '3. Read straight across from D to the temperature axis: <b>100 °C</b>.',
          ],
          a: 'B shows melting; the boiling point is 100 °C',
        },
        {
          q: 'The heater stays on all the way through, but during the flat part the temperature does not rise. Why not?',
          working: [
            '<b>Picture:</b> the energy is busy breaking the kids out of their neat rows, not making them warmer.',
            '1. Is energy still going in? <b>Yes</b> — the heater is on.',
            '2. What is that energy doing? Breaking the forces that hold the particles together.',
            '3. Only when every particle is free does the temperature climb again.',
          ],
          a: 'The energy is used to pull the particles apart, not to raise the temperature',
        },
        {
          q: 'EXPERIMENT: Harper gets out of the pool on a warm day and shivers. Explain, using particles, why evaporation cools her down.',
          working: [
            '<b>Picture:</b> the fastest kids sprint out the school gate first — the ones left in the yard are the slow ones.',
            '1. To escape from a liquid a particle needs <b>lots</b> of energy.',
            '2. So only the <b>fastest</b> water particles evaporate off her skin.',
            '3. The particles left behind are the <b>slower</b> ones.',
            '4. Slower particles = lower temperature, so the water (and her skin) cools.',
          ],
          a: 'The fastest particles escape, leaving slower, cooler ones behind',
        },
      ],
      tips: [
        'A change of state is <b>never</b> a new substance — melted ice is still water. If a new substance appears, it is a chemical change instead.',
        'Melting point = freezing point. Water: <b>0 °C</b> both ways. Do not learn two different numbers.',
        'Boiling only happens at the boiling point; <b>evaporating happens at any temperature</b>, which is why a puddle dries on a cold day.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[0], WORD[1], WORD[5], WORD[9], eventChange])(level);
        if (level === 2) return R.pick(WORD.concat([eventChange, evapCooling]))(level);
        return R.pick([WORD[2], WORD[3], WORD[4], WORD[6], WORD[7], WORD[8], WORD[10], evapCooling, evapVsBoil])(level);
      }
      const pool = level === 1
        ? [nameChange, changeStates, eventChange, waterPoints, lookupPoint]
        : level === 2
          ? [nameChange, eventChange, particleStory, waterPoints, lookupPoint, stateFromPoints, graphQ, sameParticles]
          : [stateFromPoints, roomState, rangeCalc, graphQ, particleStory, evapVsBoil, evapCooling, eventChange];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
