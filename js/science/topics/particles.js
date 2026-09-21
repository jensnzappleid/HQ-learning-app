/* Topic: Particles — the particle model of solids, liquids and gases (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const STATE_ROWS = {
    solid: {
      arrangement: 'packed closely together in a neat, regular pattern',
      movement: 'vibrate on the spot and cannot swap places',
      shape: 'nothing — it keeps its own shape',
      volume: 'a fixed volume and a fixed shape',
      flow: 'no — it cannot flow or be poured',
      squash: 'no — there are no gaps to squash into',
    },
    liquid: {
      arrangement: 'close together but jumbled up, with no pattern',
      movement: 'slide and roll past each other',
      shape: 'it takes the shape of the new container',
      volume: 'a fixed volume but no fixed shape',
      flow: 'yes — it flows and can be poured',
      squash: 'no — the particles are already touching',
    },
    gas: {
      arrangement: 'far apart with big empty gaps between them',
      movement: 'zoom about in all directions, very fast',
      shape: 'it spreads out and fills the whole container',
      volume: 'no fixed volume and no fixed shape',
      flow: 'yes — it spreads out everywhere on its own',
      squash: 'yes — the big gaps can be squashed smaller',
    },
  };
  const STATES = ['solid', 'liquid', 'gas'];
  const PROPS = [
    { key: 'arrangement', ask: (s) => `In a <b>${s}</b>, how are the particles arranged?`, hint: 'Assembly rows, lunchtime crowd, or an empty field?' },
    { key: 'movement', ask: (s) => `In a <b>${s}</b>, how do the particles move?`, hint: 'The hotter and freer they are, the more they move.' },
    { key: 'shape', ask: (s) => `You tip a <b>${s}</b> into a differently shaped container. What happens to its shape?`, hint: 'Only solids keep their own shape.' },
    { key: 'volume', ask: (s) => `Which of these describes a <b>${s}</b>?`, hint: 'Think: fixed shape? fixed volume? both? neither?' },
    { key: 'flow', ask: (s) => `Can a <b>${s}</b> flow or be poured?`, hint: 'Particles have to be able to move past each other to flow.' },
    { key: 'squash', ask: (s) => `Can a <b>${s}</b> be squashed into a smaller space?`, hint: 'You can only squash something that has gaps in it.' },
  ];

  const SUBSTANCES = [
    { name: 'a block of ice from the freezer', state: 'solid', why: 'it holds its own shape' },
    { name: 'the milk in a bottle', state: 'liquid', why: 'it pours and takes the shape of the bottle' },
    { name: 'the air inside a party balloon', state: 'gas', why: 'it fills the whole balloon' },
    { name: 'a gold ring', state: 'solid', why: 'it keeps its shape on its own' },
    { name: 'the petrol in a car tank', state: 'liquid', why: 'it pours and has a flat surface' },
    { name: 'the helium in a floating balloon', state: 'gas', why: 'it spreads out to fill the balloon' },
    { name: 'olive oil in a bottle', state: 'liquid', why: 'it pours and takes the bottle shape' },
    { name: 'the steam above a boiling jug', state: 'gas', why: 'it spreads out into the room' },
    { name: 'a rock from the Southern Alps', state: 'solid', why: 'it keeps its own shape' },
    { name: 'honey in a jar', state: 'liquid', why: 'it flows — slowly, but it flows' },
    { name: 'the oxygen you breathe in', state: 'gas', why: 'it has no shape of its own at all' },
    { name: 'a candle before you light it', state: 'solid', why: 'the wax holds its shape' },
    { name: 'the water vapour in the air', state: 'gas', why: 'it spreads through the whole room' },
    { name: 'orange juice in a glass', state: 'liquid', why: 'it takes the shape of the glass' },
    { name: 'the carbon dioxide in a fizzy drink bubble', state: 'gas', why: 'it fills the bubble it is in' },
    { name: 'the mercury inside an old thermometer', state: 'liquid', why: 'it flows up and down the tube' },
    { name: 'a chocolate bar in the fridge', state: 'solid', why: 'it keeps its bar shape' },
    { name: 'the nitrogen in the air', state: 'gas', why: 'it has no fixed shape or volume' },
  ];

  const SMELLS = [
    'someone opens a bag of hot chips at the other end of the room',
    'a fish and chip shop two doors down starts cooking',
    'Mum sprays perfume by the front door',
    'someone opens a jar of Marmite in the kitchen',
    'a candle is lit at one end of the lounge',
    'someone puts vinegar on their chips at the far table',
  ];
  const SPREADS = [
    { thing: 'a drop of food colouring in a glass of still water', ans: 'diffusion' },
    { thing: 'a teabag colouring the whole cup without stirring', ans: 'diffusion' },
    { thing: 'a squirt of blackcurrant cordial slowly colouring a jug of water', ans: 'diffusion' },
  ];

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- diagrams ---------- */
  const JIT = [[2, -3], [-3, 2], [4, 1], [-2, -4], [1, 3], [-4, -1], [3, -2], [0, 4], [-1, -2], [2, 2], [-3, -3], [4, -4], [-2, 3], [1, -1], [3, 3], [-4, 2]];
  const BOX_STROKE = { solid: '#6FA04C', liquid: '#5F98C4', gas: '#E9A07A' };
  /** the particles themselves are ALWAYS the same colour and size — only the arrangement changes */
  function dots(state, x, y) {
    const out = [];
    if (state === 'solid') {
      for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) out.push([x + 15 + i * 21, y + 15 + j * 21]);
    } else if (state === 'liquid') {
      for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
        const k = j * 4 + i;
        out.push([x + 16 + i * 21 + JIT[k][0], y + 30 + j * 20 + JIT[k][1]]);
      }
    } else {
      [[0, 0], [2, 0], [3, 1], [1, 2], [3, 3], [0, 3]].forEach(([i, j], k) => out.push([x + 17 + i * 21 + JIT[k][0], y + 17 + j * 21 + JIT[k][1]]));
    }
    return out.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="6.5" fill="#B9A5E6" stroke="#8B76C4" stroke-width="1.5"/>`).join('');
  }
  function box(state, x, y, caption) {
    return `<rect x="${x}" y="${y}" width="92" height="92" rx="8" fill="#FFFFFF" stroke="${BOX_STROKE[state]}" stroke-width="3.5"/>${dots(state, x, y)}`
      + (caption ? `<text x="${x + 46}" y="${y + 110}" text-anchor="middle" fill="#4A4033" font-size="13">${caption}</text>` : '');
  }
  const threeBoxes = (labels) => `<svg viewBox="0 0 340 206" width="340" height="206" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${STATES.map((s, i) => box(s, 12 + i * 108, 30, '')).join('')}
      ${STATES.map((s, i) => `<text x="${58 + i * 108}" y="22" text-anchor="middle" fill="${BOX_STROKE[s]}" font-size="14">${labels ? labels[i] : s}</text>`).join('')}
      <text x="58" y="142" text-anchor="middle" fill="#4A4033">packed in rows</text>
      <text x="58" y="158" text-anchor="middle" fill="#4A4033">vibrate in place</text>
      <text x="166" y="142" text-anchor="middle" fill="#4A4033">close, jumbled</text>
      <text x="166" y="158" text-anchor="middle" fill="#4A4033">slide past</text>
      <text x="274" y="142" text-anchor="middle" fill="#4A4033">far apart</text>
      <text x="274" y="158" text-anchor="middle" fill="#4A4033">zoom about</text>
      <line x1="20" y1="176" x2="320" y2="176" stroke="#E8C24A" stroke-width="3"/>
      <path d="M320 176 l-9 -5 l0 10z" fill="#E8C24A"/>
      <text x="170" y="198" text-anchor="middle" fill="#C98A1C" font-size="12.5">more spread out · more energy · faster</text>
    </svg>`;

  const mysteryBoxes = () => {
    const order = R.shuffle(STATES.slice());
    return { order, svg: `<svg viewBox="0 0 340 152" width="340" height="152" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${order.map((s, i) => `<rect x="${12 + i * 108}" y="24" width="92" height="92" rx="8" fill="#FFFFFF" stroke="#8B76C4" stroke-width="3"/>${dots(s, 12 + i * 108, 24)}`).join('')}
      ${['A', 'B', 'C'].map((L, i) => `<text x="${58 + i * 108}" y="17" text-anchor="middle" fill="#4A4033" font-size="15">${L}</text>`).join('')}
      <text x="170" y="140" text-anchor="middle" fill="#4A4033" font-size="12.5">each ball is one particle</text>
    </svg>` };
  };

  const syringeSvg = () => `<svg viewBox="0 0 340 180" width="340" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12.5" font-weight="700">
      <text x="84" y="18" text-anchor="middle" fill="#C97B52">air (a gas)</text>
      <rect x="14" y="26" width="140" height="42" rx="6" fill="#FFFFFF" stroke="#5F98C4" stroke-width="3"/>
      ${[[34, 38], [60, 56], [90, 36], [120, 54], [138, 40], [76, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#E9A07A" stroke="#C97B52" stroke-width="1.4"/>`).join('')}
      <rect x="154" y="32" width="10" height="30" fill="#8B76C4"/><line x1="164" y1="47" x2="190" y2="47" stroke="#8B76C4" stroke-width="6"/>
      <text x="84" y="88" text-anchor="middle" fill="#4A4033">plunger moves in</text>
      <text x="204" y="42" fill="#4A4033">big gaps</text>
      <text x="204" y="60" fill="#C97B52">= squashable</text>
      <text x="84" y="110" text-anchor="middle" fill="#5F98C4">water (a liquid)</text>
      <rect x="14" y="118" width="140" height="30" rx="6" fill="#DCEEF9" stroke="#5F98C4" stroke-width="3"/>
      ${[[28, 133], [44, 127], [44, 140], [60, 133], [76, 127], [76, 140], [92, 133], [108, 127], [108, 140], [124, 133], [140, 133]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#A9D8F5" stroke="#5F98C4" stroke-width="1.4"/>`).join('')}
      <rect x="154" y="123" width="10" height="20" fill="#8B76C4"/><line x1="164" y1="133" x2="190" y2="133" stroke="#8B76C4" stroke-width="6"/>
      <text x="84" y="170" text-anchor="middle" fill="#4A4033">plunger will not move</text>
      <text x="204" y="128" fill="#4A4033">no gaps</text>
      <text x="204" y="146" fill="#5F98C4">= will not squash</text>
    </svg>`;

  /* ---------- question makers ---------- */
  function stateProperty(level) {
    const s = R.pick(STATES);
    const p = R.pick(level === 1 ? PROPS.slice(0, 3) : PROPS);
    const correct = STATE_ROWS[s][p.key];
    const c = choice(correct, STATES.filter((x) => x !== s).map((x) => STATE_ROWS[x][p.key]), 3);
    return {
      prompt: p.ask(s),
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: p.hint,
      working: [
        '<b>Picture:</b> a <b>solid</b> is the whole school standing in neat rows at assembly, a <b>liquid</b> is everyone milling about shoulder to shoulder at lunch, a <b>gas</b> is six kids sprinting around an empty field.',
        `1. Which picture is a ${s}? ${s === 'solid' ? 'The assembly rows.' : s === 'liquid' ? 'The lunchtime crowd.' : 'The empty field.'}`,
        `So the answer is: <b>${correct}</b>.`,
      ],
      finalAnswer: correct, skill: 'states',
    };
  }

  function substanceState(level) {
    const s = R.pick(SUBSTANCES);
    const c = choice(s.state, STATES.filter((x) => x !== s.state), 3);
    return {
      prompt: `What state of matter is <b>${s.name}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Ask: does it keep its own shape (solid), pour (liquid), or fill the whole space (gas)?',
      working: [
        '<b>Picture:</b> shape test → pour test → fill-the-room test.',
        `1. Does it keep its own shape? ${s.state === 'solid' ? 'Yes.' : 'No.'}`,
        `2. ${s.state === 'solid' ? 'That is enough — it is a solid.' : s.state === 'liquid' ? 'Does it pour and sit at the bottom? Yes — a liquid.' : 'Does it spread out and fill the whole space? Yes — a gas.'}`,
        `Because ${s.why}, it is a <b>${s.state}</b>.`,
      ],
      finalAnswer: s.state, skill: 'states',
    };
  }

  function boxToState(level) {
    const m = mysteryBoxes();
    const i = R.int(0, 2);
    const letter = ['A', 'B', 'C'][i];
    const s = m.order[i];
    const c = choice(s, STATES.filter((x) => x !== s), 3);
    return {
      visual: m.svg,
      prompt: `Box <b>${letter}</b> shows the particles in one state of matter. Which state is it?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Look at the gaps: none and neat = solid, none but jumbled = liquid, big gaps = gas.',
      working: [
        '<b>Picture:</b> assembly rows / lunchtime crowd / empty field.',
        `1. Are there big empty gaps? ${s === 'gas' ? 'Yes — so it must be a gas.' : 'No — so it is a solid or a liquid.'}`,
        `2. ${s === 'gas' ? 'Only a few particles, spread right out.' : s === 'solid' ? 'Are they in neat rows? Yes — a solid.' : 'Are they neat or jumbled? Jumbled — a liquid.'}`,
        `Box ${letter} is a <b>${s}</b>.`,
      ],
      finalAnswer: s, skill: 'diagram',
    };
  }

  function stateToBox(level) {
    const m = mysteryBoxes();
    const s = R.pick(STATES);
    const letter = ['A', 'B', 'C'][m.order.indexOf(s)];
    const c = choice(letter, ['A', 'B', 'C'].filter((x) => x !== letter), 3);
    return {
      visual: m.svg,
      prompt: `Look at the three particle boxes. Which box shows a <b>${s}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `In a ${s} the particles are ${STATE_ROWS[s].arrangement}.`,
      working: [
        `1. In a ${s} the particles are <b>${STATE_ROWS[s].arrangement}</b>.`,
        `2. Look for that pattern in the boxes.`,
        `That is box <b>${letter}</b>.`,
      ],
      finalAnswer: `Box ${letter}`, skill: 'diagram',
    };
  }

  function compression(level) {
    const which = R.pick(['why-gas', 'which-squash', 'syringe', 'tyre']);
    if (which === 'which-squash') {
      const c = choice('a gas', ['a solid', 'a liquid', 'all three the same'], 4);
      return {
        prompt: 'Which state of matter can be squashed (compressed) into a much smaller space?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'You can only squash something that has empty space inside it.',
        working: ['<b>Picture:</b> you can squash a bag of chips because it is mostly air.', '1. Which state has big gaps between the particles? A gas.', 'So only <b>a gas</b> can be squashed.'],
        finalAnswer: 'a gas', skill: 'compression',
      };
    }
    if (which === 'syringe') {
      const c = choice('There are big gaps between the gas particles, but none between the water particles', [
        'Gas particles are much smaller than water particles',
        'Gas particles are softer than water particles',
        'The water particles stop moving when you push',
      ], 4);
      return {
        visual: syringeSvg(),
        prompt: 'Harper seals a syringe of air and pushes the plunger — it moves in. She seals a syringe of water and pushes just as hard — it will not move. Why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Squashing means pushing particles into the empty spaces.',
        working: [
          '<b>Picture:</b> squashing a suitcase only works if there is air inside it.',
          '1. In the air syringe, are there gaps between the particles? Yes — big ones.',
          '2. In the water syringe? No — the particles are already touching.',
          'So <b>there are big gaps between the gas particles, but none between the water particles</b>.',
        ],
        finalAnswer: 'There are big gaps between the gas particles, but none between the water particles', skill: 'compression',
      };
    }
    if (which === 'tyre') {
      const c = choice('The air particles are pushed closer together into the gaps', [
        'The air particles get smaller',
        'New air particles are made inside the tyre',
        'The air particles melt together',
      ], 4);
      return {
        prompt: 'You pump lots of air into a bike tyre. What happens to the air particles inside?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Particles never change size — only how far apart they are.',
        working: ['<b>Picture:</b> more and more kids squeezed onto the same field.', '1. Do particles ever shrink? No — never.', '2. So the only thing that can change is the space between them.', 'The air particles are <b>pushed closer together into the gaps</b>.'],
        finalAnswer: 'The air particles are pushed closer together into the gaps', skill: 'compression',
      };
    }
    const c = choice('Because there are big empty gaps between the particles', [
      'Because gas particles are stretchy',
      'Because gas particles are very light',
      'Because gas particles stop moving when squashed',
    ], 4);
    return {
      prompt: 'Why can a <b>gas</b> be squashed into a smaller container?',
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'What is between the particles in a gas?',
      working: ['<b>Picture:</b> six kids on a huge field can easily be moved into one corner.', '1. What is between gas particles? Empty space.', 'So it squashes <b>because there are big empty gaps between the particles</b>.'],
      finalAnswer: 'Because there are big empty gaps between the particles', skill: 'compression',
    };
  }

  function diffusionQ(level) {
    const form = level === 1 ? R.pick(['name', 'name']) : R.pick(['name', 'why', 'temp', 'thing']);
    if (form === 'name') {
      const s = R.pick(SMELLS);
      return {
        prompt: `In class, ${s} — and a minute later you can smell it from across the room. What is this spreading out called?`,
        answer: { type: 'text', value: 'diffusion', accept: ['diffuse', 'diffusing', 'diffusion of gases', 'gas diffusion'], placeholder: 'one word' },
        hint: 'It starts with the letter d.',
        working: ['<b>Picture:</b> six kids let loose on an empty field — they end up everywhere.', '1. Gas particles move fast and in all directions.', '2. So they spread from where there are lots of them to where there are none.', 'This spreading is called <b>diffusion</b>.'],
        finalAnswer: 'diffusion', skill: 'diffusion',
      };
    }
    if (form === 'why') {
      const s = R.pick(SMELLS);
      const c = choice('The smell particles move about and spread through the air on their own', [
        'The smell particles are blown by the classroom wind only',
        'The air particles change into smell particles',
        'The smell particles fall to the floor and slide across it',
      ], 4);
      return {
        prompt: `Nobody opens a window, but when ${s} the smell still reaches every corner of the room. Why?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Gas particles are always moving, even with no breeze.',
        working: ['<b>Picture:</b> kids sprinting in every direction on an empty field.', '1. Do gas particles need wind to move? No — they are always zooming about.', '2. They bump around until they are spread evenly.', 'So <b>the smell particles move about and spread through the air on their own</b> — diffusion.'],
        finalAnswer: 'The smell particles move about and spread through the air on their own', skill: 'diffusion',
      };
    }
    if (form === 'temp') {
      const s = R.pick(SPREADS);
      const c = choice('In the hot water — the particles move faster', ['In the cold water — the particles are heavier', 'The same in both — temperature makes no difference', 'In the cold water — cold particles spread more easily'], 4);
      return {
        prompt: `Harper puts ${s.thing} into hot water and the same into cold water. In which one does the colour spread faster?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Hotter = more energy = faster moving particles.',
        working: ['<b>Picture:</b> kids run around faster on a warm day than a freezing one.', '1. Does heating give particles more energy? Yes.', '2. Faster particles mix together sooner.', 'So it spreads faster <b>in the hot water</b>.'],
        finalAnswer: 'In the hot water — the particles move faster', skill: 'diffusion',
      };
    }
    const s = R.pick(SPREADS);
    const c = choice('diffusion', ['evaporation', 'melting', 'filtering'], 4);
    return {
      prompt: `What is the name of the process when ${s.thing} colours the whole glass without any stirring?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Particles spreading out from where there are lots of them.',
      working: ['1. Nobody stirred it — so the particles moved by themselves.', '2. Particles spreading out on their own is <b>diffusion</b>.'],
      finalAnswer: 'diffusion', skill: 'diffusion',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('The particles slow down and move closer together, so the balloon gets smaller', [
        'Some of the air particles disappear in the cold',
        'The air particles freeze into a solid',
        'The rubber sucks the air particles in',
      ], 4);
      return {
        prompt: 'Harper leaves a blown-up balloon outside on a frosty Ōtautahi night. In the morning it looks much smaller, but no air has leaked out. Why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Cooling takes energy away from particles. Particles are never destroyed.',
        working: [
          '<b>Picture:</b> kids sprinting around a field slow to a walk when they are cold and huddle together.',
          '1. Did any particles leave the balloon? No — it did not leak.',
          '2. What does cooling do? It takes energy away, so the particles move slower.',
          '3. Slower particles hit the balloon walls less often and less hard, so the balloon shrinks.',
          'Answer: <b>the particles slow down and move closer together, so the balloon gets smaller</b>.',
        ],
        finalAnswer: 'The particles slow down and move closer together, so the balloon gets smaller',
      };
    },
    () => {
      const c = choice('The particles gain energy, move faster and push harder on the rubber', [
        'The heat makes new air particles inside the balloon',
        'The air particles grow bigger in the sun',
        'The rubber melts and stretches',
      ], 4);
      return {
        prompt: 'A balloon left in a hot car swells up and can even pop. What has happened to the air particles inside?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Particles never change size — but they can change speed.',
        working: ['<b>Picture:</b> kids on a field speed up in the warmth and crash into the fence harder.', '1. Do particles get bigger when heated? No, never.', '2. Heating gives them more energy, so they move faster.', '3. Faster particles hit the inside of the balloon harder and more often → it stretches.', 'Answer: <b>the particles gain energy, move faster and push harder on the rubber</b>.'],
        finalAnswer: 'The particles gain energy, move faster and push harder on the rubber',
      };
    },
    () => {
      const c = choice('A solid — each tiny grain keeps its own shape', ['A liquid — it pours, so it must be a liquid', 'A gas — the grains are far apart', 'It is a new state, in between solid and liquid'], 4);
      return {
        prompt: 'Sand can be poured out of a bucket just like water. Does that make sand a liquid?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Look at one single grain, not the whole pile.',
        working: [
          '<b>Picture:</b> a bucket of marbles pours too — but each marble is still solid.',
          '1. Look at ONE grain of sand. Does it keep its own shape? Yes.',
          '2. So each grain is a solid; the pile only looks like it flows because the grains slide over each other.',
          'Answer: <b>a solid — each tiny grain keeps its own shape</b>.',
        ],
        finalAnswer: 'A solid — each tiny grain keeps its own shape',
      };
    },
    () => {
      const c = choice('The gas is squashed, so a lot of it fits in a small tank', ['The gas turns into a solid inside the tank', 'The gas particles shrink inside the tank', 'The tank makes extra gas'], 4);
      return {
        prompt: 'A small camping gas bottle can run a cooker for a whole week at Lake Taupō. How does so much gas fit into such a little bottle?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Gases have big gaps between the particles.',
        working: ['<b>Picture:</b> a huge duvet squashed into a tiny stuff-sack.', '1. Do gases have gaps between their particles? Yes — big ones.', '2. Pumping it in pushes the particles into those gaps.', 'Answer: <b>the gas is squashed, so a lot of it fits in a small tank</b>.'],
        finalAnswer: 'The gas is squashed, so a lot of it fits in a small tank',
      };
    },
    () => {
      const item = R.pick([['a bottle of water', 'a liquid'], ['a brick', 'a solid'], ['the air in a bike pump', 'a gas'], ['a bag of flour', 'a solid'], ['a can of fizzy drink', 'a liquid']]);
      const c = choice(item[1], ['a solid', 'a liquid', 'a gas'].filter((x) => x !== item[1]), 3);
      return {
        prompt: `Harper is sorting things for a science display. Which state of matter is <b>${item[0]}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Shape test, pour test, fill-the-room test.',
        working: ['<b>Picture:</b> assembly rows / lunchtime crowd / empty field.', `1. Does it keep its own shape? ${item[1] === 'a solid' ? 'Yes → solid.' : 'No.'}`, `2. ${item[1] === 'a solid' ? 'Done.' : item[1] === 'a liquid' ? 'Does it pour and sit at the bottom? Yes → liquid.' : 'Does it fill every corner of its container? Yes → gas.'}`, `So it is <b>${item[1]}</b>.`],
        finalAnswer: item[1],
      };
    },
    () => {
      const c = choice('Wet — the particles are close together and touching, but jumbled and able to slide', [
        'Wet — the particles are far apart',
        'Dry — the particles are in fixed neat rows',
        'Wet — the particles have melted into each other',
      ], 4);
      return {
        prompt: 'Harper spills a glass of water on the bench and it spreads into a flat puddle instead of staying in a lump. What does that tell her about the particles in a liquid?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'A liquid keeps its volume but not its shape.',
        working: ['<b>Picture:</b> a lunchtime crowd — shoulder to shoulder, but everyone can shuffle.', '1. Did the water spread out for ever, like a gas? No — the puddle stops.', '2. So the particles are still touching (fixed volume) but can slide (no fixed shape).', 'Answer: <b>the particles are close together and touching, but jumbled and able to slide</b>.'],
        finalAnswer: 'The particles are close together and touching, but jumbled and able to slide',
      };
    },
    () => {
      const c = choice('No — the particles are only rearranged, never made or destroyed', ['Yes — squashing destroys some particles', 'Yes — the particles turn into liquid particles', 'No — but the particles do get smaller'], 4);
      return {
        prompt: 'When you squash the air in a sealed syringe, do any air particles get destroyed?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The same particles are still in there — count them before and after.',
        working: ['<b>Picture:</b> the same six kids, just herded into one corner of the field.', '1. Are the same particles still sealed inside? Yes.', '2. Only the space between them changed.', 'Answer: <b>no — the particles are only rearranged, never made or destroyed</b>.'],
        finalAnswer: 'No — the particles are only rearranged, never made or destroyed',
      };
    },
    () => {
      const c = choice('Gas — it changes shape AND changes volume', ['Solid — it can be squashed', 'Liquid — it fills the container', 'Solid — it keeps a fixed volume'], 4);
      return {
        prompt: 'A mystery substance fills every corner of whatever container it is put in, and can be squashed into a container half the size. Which state is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Two clues here: no fixed shape AND no fixed volume.',
        working: ['<b>Picture:</b> six kids on an empty field, easily herded into one corner.', '1. Does it have a fixed shape? No — it fills any container.', '2. Does it have a fixed volume? No — it can be squashed smaller.', 'Only one state does both. It is a <b>gas</b>.'],
        finalAnswer: 'Gas — it changes shape AND changes volume',
      };
    },
    () => {
      const c = choice('Use the same amount of water and the same drop of colouring in both, and only change the temperature', [
        'Use more colouring in the hot water so you can see it',
        'Stir the hot one to help it along',
        'Use a bigger beaker for the hot water',
      ], 4);
      return {
        prompt: 'Harper wants to prove that food colouring spreads faster in hot water than in cold water. How should she set the test up so it is fair?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'In a fair test only ONE thing is allowed to change.',
        working: [
          '<b>Picture:</b> two identical glasses side by side; only the temperature is different.',
          '1. What is she testing? Temperature.',
          '2. So temperature is the only thing allowed to change.',
          '3. Everything else — amount of water, amount of colouring, no stirring — must be the same.',
          'Answer: <b>same water, same colouring, only the temperature changes</b>.',
        ],
        finalAnswer: 'Same amount of water and colouring in both — only the temperature changes',
      };
    },
    () => {
      const s = R.pick(SMELLS.slice(0, 4));
      const c = choice('Diffusion happens faster in a warm room, because the particles move faster', [
        'Diffusion only happens in cold rooms',
        'Temperature makes no difference to how fast a smell spreads',
        'In a warm room the smell particles get heavier and sink',
      ], 4);
      return {
        prompt: `The same thing happens in the school hall on a hot February day and a cold July day: ${s}. What difference would you expect?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Warmer particles have more energy.',
        working: ['<b>Picture:</b> kids sprint on a warm day, trudge on a freezing one.', '1. Warm = more energy = faster particles.', '2. Faster particles spread out sooner.', 'Answer: <b>diffusion happens faster in a warm room</b>.'],
        finalAnswer: 'Diffusion happens faster in a warm room, because the particles move faster',
      };
    },
    () => {
      const c = choice('The gaps between the particles get smaller — the particles themselves stay the same size', [
        'The particles themselves get smaller',
        'The particles join together into bigger ones',
        'Half of the particles disappear',
      ], 4);
      return {
        prompt: 'A diver\'s air tank is filled by pushing lots of air into it. Spot the mistake: Harper\'s friend says "the particles get squashed smaller". What really happens?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Particles are the one thing that never changes size.',
        working: ['<b>Picture:</b> the field does not shrink the kids — it just packs them closer.', '1. Can a particle be squashed? No — it is not squashy.', '2. So what changed? The empty space between them.', 'Answer: <b>the gaps get smaller — the particles stay the same size</b>.'],
        finalAnswer: 'The gaps between the particles get smaller — the particles stay the same size',
      };
    },
  ];

  HL.registerTopic({
    id: 'particles', subject: 'science', strand: 'material', order: 1,
    name: 'Particles: solids, liquids & gases', short: 'Particles', animal: 'gecko',
    blurb: 'Everything is made of tiny particles — how they are arranged makes it a solid, a liquid or a gas.',
    example: 'solid = neat rows · liquid = jumbled but touching · gas = far apart',
    learn: {
      what: '<p>Everything around you is made of unbelievably tiny <b>particles</b>. You cannot see them, but how they are arranged decides whether something is a <b>solid</b>, a <b>liquid</b> or a <b>gas</b>. The particles themselves never change size — only the spacing and the speed change.</p><p><b>Picture for this topic:</b> your <b>school</b>. A <b>solid</b> is the whole school standing in neat rows at assembly. A <b>liquid</b> is everyone milling about shoulder to shoulder at lunch. A <b>gas</b> is six kids sprinting around a huge empty field.</p>',
      visual: threeBoxes(['SOLID', 'LIQUID', 'GAS']),
      facts: [
        '<b>Solid:</b> particles packed in neat rows, <b>vibrate on the spot</b> → fixed shape, fixed volume',
        '<b>Liquid:</b> particles touching but jumbled, <b>slide past</b> each other → fixed volume, takes the container\'s shape',
        '<b>Gas:</b> particles <b>far apart</b>, zooming everywhere → fills the container, no fixed shape or volume',
        'Only a <b>gas</b> can be squashed — because only a gas has big <b>gaps</b> between its particles',
        '<b>Diffusion</b> = particles spreading out on their own, from lots of them to few of them (that is how smells travel)',
        'Heating gives particles <b>more energy</b> → they move faster and spread further apart',
      ],
      steps: [
        'Ask "<b>does it keep its own shape?</b>" If yes → <b>solid</b>. If no, keep going.',
        'Ask "<b>does it pour and sit at the bottom of the container?</b>" If yes → <b>liquid</b>.',
        'Ask "<b>does it fill every corner of the container?</b>" If yes → <b>gas</b>.',
        'To explain anything with particles, say three things: <b>how far apart</b> they are, <b>how fast</b> they move, and <b>what changed</b>. Never say the particles got bigger, smaller, or disappeared.',
        'Hot = fast. Cold = slow. That one line explains balloons shrinking, smells spreading and colouring mixing.',
      ],
      examples: [
        {
          q: 'In a <b>liquid</b>, how are the particles arranged and how do they move?',
          working: ['<b>Picture:</b> everyone milling about at lunch — shoulder to shoulder, but shuffling past each other.', '1. Are they touching? Yes.', '2. Are they in neat rows? No — jumbled.', '3. Can they move past each other? Yes — that is why it pours.'],
          a: 'Close together but jumbled, sliding past each other',
        },
        {
          q: 'Look at the three boxes. Which one is the gas, and how do you know?',
          visual: threeBoxes(['A', 'B', 'C']),
          working: ['<b>Picture:</b> assembly rows → lunch crowd → empty field.', '1. Look for the <b>big empty gaps</b>. That is box <b>C</b>.', '2. Box A is neat rows → solid. Box B is jumbled but touching → liquid.'],
          a: 'Box C — it is the one with big gaps between the particles',
        },
        {
          q: 'Harper seals air in one syringe and water in another, and pushes both plungers. The air one moves in; the water one will not budge. Explain with particles.',
          visual: syringeSvg(),
          working: [
            '<b>Picture:</b> you can only squash a suitcase if there is air inside it.',
            '1. Are there gaps between air particles? <b>Yes — big ones.</b> So the plunger pushes them closer.',
            '2. Are there gaps between water particles? <b>No — they already touch.</b> Nothing to squash into.',
            '3. Note: the particles never get smaller, the <b>space</b> between them does.',
          ],
          a: 'Gases can be compressed because they have big gaps; liquids cannot because their particles already touch',
        },
        {
          q: 'Sand pours out of a bucket like water. Is sand a liquid?',
          working: ['<b>Picture:</b> a bucket of marbles pours too — but each marble is definitely solid.', '1. Look at ONE grain. Does it keep its own shape? <b>Yes.</b>', '2. So each grain is a solid; the pile just slides.'],
          a: 'No — sand is a solid; the grains slide over each other',
        },
        {
          q: 'Someone opens a bag of hot chips at the far end of the classroom. A minute later you can smell it. Name and explain the process.',
          working: [
            '<b>Picture:</b> six kids let loose on an empty field end up everywhere.',
            '1. Smell particles are a <b>gas</b> — they zoom about in all directions.',
            '2. They start where there are lots of them (the chips) and bump their way to where there are none (your nose).',
            '3. No wind or stirring needed.',
          ],
          a: 'Diffusion — gas particles spread out on their own',
        },
        {
          q: 'A blown-up balloon is left outside on a frosty night. In the morning it is smaller, but nothing has leaked. Why?',
          working: [
            '<b>Picture:</b> kids on a field slow to a shivering huddle when it gets cold.',
            '1. Did any particles escape? <b>No.</b>',
            '2. Cooling takes <b>energy</b> away → the particles move slower.',
            '3. Slower particles hit the balloon walls <b>less often and less hard</b>, so the balloon is pushed in.',
          ],
          a: 'The particles slowed down and moved closer together, so the balloon shrank',
        },
        {
          q: 'EXPERIMENT: Harper drops food colouring into hot water and into cold water. It spreads through the hot water much faster. What is she showing, and what must she keep the same for it to be a fair test?',
          working: [
            '<b>Picture:</b> two identical glasses side by side — only the temperature is different.',
            '1. What is she testing? Whether <b>temperature</b> changes how fast diffusion happens.',
            '2. Hot water particles have <b>more energy</b> and move faster, so they mix sooner.',
            '3. Fair test: same volume of water, same drop of colouring, no stirring in either. Only the temperature changes.',
          ],
          a: 'Diffusion is faster when it is hotter — keep everything the same except the temperature',
        },
      ],
      tips: [
        'Particles <b>never</b> get bigger, smaller, or disappear. Only the <b>space between them</b> and their <b>speed</b> change. If your answer says "the particles shrank", it is wrong.',
        'Sand and flour pour, but they are <b>solids</b> — look at one single grain, not the whole pile.',
        'Squashing needs gaps, so <b>only gases can be compressed</b>. That is why a syringe of air squashes and a syringe of water does not.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[2], WORD[4], WORD[5], WORD[3], diffusionQ])(level);
        if (level === 2) return R.pick(WORD.concat([diffusionQ]))(level);
        return R.pick([WORD[0], WORD[1], WORD[6], WORD[7], WORD[8], WORD[9], WORD[10], diffusionQ])(level);
      }
      const pool = level === 1
        ? [stateProperty, substanceState, boxToState, stateToBox, compression]
        : level === 2
          ? [stateProperty, substanceState, boxToState, stateToBox, compression, diffusionQ]
          : [stateProperty, boxToState, compression, diffusionQ, substanceState, stateToBox];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
