/* Topic: Physical vs chemical change — signs of a reaction, burning, rusting, word equations. */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const PHYSICAL = [
    { what: 'an ice cube melting in a drink', why: 'it is still water — freeze it and you get the ice back' },
    { what: 'water boiling in a jug', why: 'the steam is still water, just as a gas' },
    { what: 'sugar dissolving in a cup of tea', why: 'the sugar is still there — taste it, or evaporate the tea to get it back' },
    { what: 'crushing an empty drink can', why: 'it is still exactly the same aluminium, just a different shape' },
    { what: 'cutting a sheet of paper in half', why: 'both halves are still paper' },
    { what: 'freezing juice into an iceblock', why: 'melt it and you have the juice back' },
    { what: 'mixing salt and sand together', why: 'nothing new is made — you can separate them again' },
    { what: 'steam condensing on a cold window', why: 'the drops are still water' },
    { what: 'melting chocolate in a bowl over hot water', why: 'let it cool and it sets back into chocolate' },
    { what: 'sharpening a pencil', why: 'the shavings are still wood and graphite' },
    { what: 'grating cheese', why: 'it is still cheese, just in smaller pieces' },
    { what: 'blowing up a balloon', why: 'the air inside is unchanged' },
    { what: 'washing drying on the line', why: 'the water has evaporated, but it is still water in the air' },
    { what: 'stirring red and blue paint together', why: 'the two paints are just mixed — nothing new is made' },
    { what: 'a copper wire being bent into a coil', why: 'it is still copper' },
    { what: 'making a snowman from snow at Ruapehu', why: 'it is still frozen water' },
  ];
  const CHEMICAL = [
    { what: 'a piece of wood burning in a fire', why: 'the ash and smoke are brand-new substances — you cannot turn them back into wood', sign: 'heat and light are given out' },
    { what: 'an iron nail going rusty', why: 'rust is a completely new substance, not iron any more', sign: 'a colour change to orange-brown' },
    { what: 'baking a cake in the oven', why: 'the runny mixture becomes something new that you can never turn back', sign: 'a new smell and a colour change' },
    { what: 'frying an egg', why: 'the clear runny white becomes a white solid you cannot un-cook', sign: 'a colour change' },
    { what: 'milk going sour in the sun', why: 'new substances have formed — the milk is not milk any more', sign: 'a new smell' },
    { what: 'vinegar fizzing when baking soda is added', why: 'a brand-new gas (carbon dioxide) is being made', sign: 'bubbles of a new gas' },
    { what: 'magnesium ribbon burning with a bright white flame', why: 'the grey ribbon becomes white magnesium oxide powder', sign: 'light given out and a colour change' },
    { what: 'toasting a slice of bread until it goes brown', why: 'new brown substances form on the surface', sign: 'a colour change and a new smell' },
    { what: 'a silver spoon slowly going black (tarnishing)', why: 'the black layer is a new substance, not silver', sign: 'a colour change' },
    { what: 'your body digesting a sandwich', why: 'the food is broken down into completely new substances', sign: 'new substances are made' },
    { what: 'a banana going brown after it is cut', why: 'the brown patches are a new substance made with oxygen from the air', sign: 'a colour change' },
    { what: 'a firework exploding on Guy Fawkes night', why: 'new gases and powders are made and cannot be turned back', sign: 'heat, light and a new gas' },
    { what: 'a plant photosynthesising in the sun', why: 'carbon dioxide and water become brand-new glucose and oxygen', sign: 'a new gas is made' },
    { what: 'concrete setting hard on a driveway', why: 'the wet mix reacts to make a new hard substance for good', sign: 'heat is given out' },
    { what: 'a match burning', why: 'the match head becomes new gases and ash', sign: 'heat and light are given out' },
    { what: 'lemon juice curdling a jug of milk', why: 'new solid lumps form that were not there before', sign: 'a solid (precipitate) appears' },
  ];

  const SIGNS = [
    'bubbles of a new gas appear',
    'the colour changes',
    'heat or light is given out',
    'a solid (a precipitate) suddenly forms',
    'there is a new smell',
    'the change is very hard to reverse',
  ];
  const NOT_SIGNS = [
    'the mixture changes shape',
    'the substance is poured into a new container',
    'the mixture is stirred',
    'the substance gets wet',
    'the pieces are cut smaller',
  ];

  const EQUATIONS = [
    { l: 'magnesium + oxygen', r: 'magnesium oxide', name: 'burning magnesium' },
    { l: 'carbon + oxygen', r: 'carbon dioxide', name: 'burning charcoal' },
    { l: 'hydrogen + oxygen', r: 'water', name: 'burning hydrogen' },
    { l: 'copper + oxygen', r: 'copper oxide', name: 'heating copper in air' },
    { l: 'iron + oxygen + water', r: 'hydrated iron oxide (rust)', name: 'rusting' },
    { l: 'methane + oxygen', r: 'carbon dioxide + water', name: 'burning natural gas on a hob' },
    { l: 'zinc + hydrochloric acid', r: 'zinc chloride + hydrogen', name: 'zinc in acid' },
    { l: 'calcium carbonate + hydrochloric acid', r: 'calcium chloride + water + carbon dioxide', name: 'chalk in acid' },
    { l: 'glucose + oxygen', r: 'carbon dioxide + water', name: 'respiration' },
    { l: 'carbon dioxide + water', r: 'glucose + oxygen', name: 'photosynthesis' },
    { l: 'sodium + chlorine', r: 'sodium chloride', name: 'making table salt' },
  ];

  const RUST_STOP = [
    { how: 'painting the gate', why: 'the paint keeps air and water off the iron' },
    { how: 'oiling a bike chain', why: 'the oil is a waterproof barrier' },
    { how: 'galvanising a roof (coating it in zinc)', why: 'the zinc layer keeps the oxygen and water away from the iron' },
    { how: 'keeping tools dry in a shed', why: 'no water means no rusting' },
    { how: 'using stainless steel cutlery', why: 'stainless steel does not rust the way plain iron does' },
    { how: 'greasing the underneath of a car', why: 'the grease stops salty water touching the metal' },
  ];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });

  /* ---------- diagrams ---------- */
  const conceptSvg = () => `<svg viewBox="0 0 344 200" width="344" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="24" y="26" width="44" height="44" rx="6" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2.5"/>
      <text x="46" y="86" text-anchor="middle" fill="#4A4033" font-size="11.5">ice</text>
      <line x1="80" y1="42" x2="124" y2="42" stroke="#5F98C4" stroke-width="2.5"/><path d="M130 42 l-9 -5 l0 10z" fill="#5F98C4"/>
      <line x1="130" y1="58" x2="86" y2="58" stroke="#5F98C4" stroke-width="2.5"/><path d="M80 58 l9 -5 l0 10z" fill="#5F98C4"/>
      <text x="105" y="34" text-anchor="middle" fill="#5F98C4" font-size="11">melt</text>
      <text x="105" y="72" text-anchor="middle" fill="#5F98C4" font-size="11">freeze</text>
      <path d="M138 62 q10 -14 22 0 q10 -12 20 0 l0 10 l-42 0 z" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2.5"/>
      <text x="160" y="86" text-anchor="middle" fill="#4A4033" font-size="11.5">water</text>
      <text x="198" y="38" fill="#5F98C4" font-size="12.5">PHYSICAL CHANGE</text>
      <text x="198" y="58" fill="#4A4033" font-size="11.5">same substance</text>
      <text x="198" y="76" fill="#4A4033" font-size="11.5">easy to reverse</text>
      <line x1="20" y1="100" x2="324" y2="100" stroke="#E8C24A" stroke-width="2"/>
      <rect x="24" y="118" width="44" height="44" rx="4" fill="#B98A5E" stroke="#8A6440" stroke-width="2.5"/>
      <text x="46" y="178" text-anchor="middle" fill="#4A4033" font-size="11.5">wood</text>
      <line x1="80" y1="140" x2="124" y2="140" stroke="#E0568C" stroke-width="3"/><path d="M130 140 l-9 -5 l0 10z" fill="#E0568C"/>
      <text x="105" y="130" text-anchor="middle" fill="#E0568C" font-size="11">burn</text>
      <line x1="126" y1="158" x2="88" y2="158" stroke="#EFC4D2" stroke-width="2.5"/><path d="M82 158 l9 -5 l0 10z" fill="#EFC4D2"/><path d="M98 150 l14 16 M112 150 l-14 16" stroke="#E0568C" stroke-width="2.5"/>
      <path d="M138 150 q6 -10 14 -4 q8 -10 18 -2 q8 -4 12 6 l0 8 l-44 0 z" fill="#9A938A" stroke="#6E675F" stroke-width="2"/>
      <text x="160" y="178" text-anchor="middle" fill="#4A4033" font-size="11.5">ash + gases</text>
      <text x="198" y="130" fill="#E0568C" font-size="12.5">CHEMICAL CHANGE</text>
      <text x="198" y="150" fill="#4A4033" font-size="11.5">NEW substance</text>
      <text x="198" y="168" fill="#4A4033" font-size="11.5">hard to reverse</text>
    </svg>`;

  const fireTriangle = () => `<svg viewBox="0 0 300 194" width="300" height="194" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
      <path d="M150 32 L252 162 L48 162 Z" fill="#FDEBD8" stroke="#E0568C" stroke-width="4" stroke-linejoin="round"/>
      <text x="150" y="20" text-anchor="middle" fill="#E0568C">HEAT</text>
      <text x="40" y="182" fill="#D9941F">FUEL</text>
      <text x="260" y="182" text-anchor="end" fill="#5F98C4">OXYGEN</text>
      <text x="150" y="118" text-anchor="middle" fill="#E0568C" font-size="15">FIRE</text>
      <text x="150" y="140" text-anchor="middle" fill="#4A4033" font-size="11.5">take one away</text>
      <text x="150" y="155" text-anchor="middle" fill="#4A4033" font-size="11.5">and it goes out</text>
    </svg>`;

  const eqSvg = (e) => `<svg viewBox="0 0 344 130" width="344" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12.5" font-weight="700">
      <text x="172" y="20" text-anchor="middle" fill="#D9941F" font-size="11.5">REACTANTS — what you start with</text>
      <rect x="16" y="26" width="312" height="26" rx="8" fill="#FDF3DC" stroke="#E8C24A" stroke-width="2"/>
      <text x="172" y="44" text-anchor="middle" fill="#4A4033">${e.l}</text>
      <text x="172" y="70" text-anchor="middle" fill="#E0568C" font-size="16">➜</text>
      <rect x="16" y="78" width="312" height="26" rx="8" fill="#F0E7FB" stroke="#8B76C4" stroke-width="2"/>
      <text x="172" y="96" text-anchor="middle" fill="#4A4033">${e.r}</text>
      <text x="172" y="122" text-anchor="middle" fill="#8B76C4" font-size="11.5">PRODUCTS — the new substances made</text>
    </svg>`;

  const rustTable = () => `<table class="data"><tr><th>tube</th><th>the nail is in…</th><th>after a week</th></tr>`
    + `<tr><td>A</td><td>water + air</td><td><b>rusty</b></td></tr>`
    + `<tr><td>B</td><td>water, <b>no air</b></td><td>no rust</td></tr>`
    + `<tr><td>C</td><td>air, <b>no water</b></td><td>no rust</td></tr></table>`;

  /* ---------- question makers ---------- */
  function classify(level) {
    const isChem = R.chance(0.5);
    const item = isChem ? R.pick(CHEMICAL) : R.pick(PHYSICAL);
    return {
      prompt: `Is <b>${item.what}</b> a physical change or a chemical change?`,
      answer: textAns(isChem ? 'chemical' : 'physical', isChem ? ['chemical change', 'a chemical change'] : ['physical change', 'a physical change'], 'one word'),
      hint: 'Ask the big question: is a BRAND-NEW substance made?',
      working: [
        '<b>Picture:</b> melting ice (you can freeze it back) vs burning wood (you can never un-burn it).',
        `1. Is a brand-new substance made? <b>${isChem ? 'Yes' : 'No'}</b>.`,
        `2. ${item.why}.`,
        `So it is <b>${isChem ? 'a chemical change' : 'a physical change'}</b>.`,
      ],
      finalAnswer: isChem ? 'a chemical change' : 'a physical change', skill: 'classify',
    };
  }
  function reversible(level) {
    const p = R.pick(PHYSICAL);
    const c = R.pick(CHEMICAL);
    const opt = choice(p.what, [c.what, R.pick(CHEMICAL.filter((x) => x.what !== c.what)).what], 3);
    return {
      prompt: 'Which one of these changes could you <b>reverse</b> (get the starting substance back)?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Physical changes can usually be undone. Chemical ones cannot.',
      working: ['<b>Picture:</b> ice ↔ water goes both ways; wood → ash only goes one way.', `1. ${p.what.charAt(0).toUpperCase() + p.what.slice(1)}: ${p.why}.`, '2. The others make a brand-new substance, so they are one-way.', `Answer: <b>${p.what}</b>.`],
      finalAnswer: p.what, skill: 'classify',
    };
  }
  function signQ(level) {
    const form = R.pick(['which-is-sign', 'which-not', 'name-sign']);
    if (form === 'which-not') {
      const bad = R.pick(NOT_SIGNS);
      const opt = choice(bad, R.sample(SIGNS, 3), 4);
      return {
        prompt: 'Which of these is <b>NOT</b> a sign that a chemical reaction has taken place?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'A sign of a reaction means something NEW has appeared.',
        working: ['<b>Picture:</b> bubbles, a colour change, heat or light, a new solid, a new smell — those five say "new substance".', `1. Does "${bad}" make anything new? No — it is just a physical thing happening.`, `Answer: <b>${bad}</b>.`],
        finalAnswer: bad, skill: 'signs',
      };
    }
    if (form === 'name-sign') {
      const c = R.pick(CHEMICAL);
      const opt = choice(c.sign, SIGNS.filter((s) => !c.sign.includes(s.split(' ')[0])).slice(0, 3).concat(NOT_SIGNS.slice(0, 2)), 4);
      return {
        prompt: `Harper watches <b>${c.what}</b>. What is the clearest sign that a chemical reaction is happening?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Look for something NEW appearing: a gas, a colour, heat, light, a solid or a smell.',
        working: ['<b>Picture:</b> the five clues that shout "new substance".', `1. What do you actually see or smell? <b>${c.sign}</b>.`, `2. ${c.why.charAt(0).toUpperCase() + c.why.slice(1)}.`],
        finalAnswer: c.sign, skill: 'signs',
      };
    }
    const good = R.pick(SIGNS);
    const opt = choice(good, R.sample(NOT_SIGNS, 3), 4);
    return {
      prompt: 'Which of these <b>is</b> a sign that a chemical reaction has taken place?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'The five clues: bubbles of a new gas, colour change, heat/light, a precipitate, a new smell.',
      working: ['<b>Picture:</b> the five clues that shout "new substance".', `1. Only one of these means something new was made.`, `Answer: <b>${good}</b>.`],
      finalAnswer: good, skill: 'signs',
    };
  }
  function equationParts(level) {
    const e = R.pick(EQUATIONS);
    const askReactants = R.chance(0.5);
    const correct = askReactants ? e.l : e.r;
    const wrongs = EQUATIONS.filter((x) => x.l !== e.l).map((x) => (askReactants ? x.l : x.r)).concat([askReactants ? e.r : e.l]);
    const opt = choice(correct, wrongs, 4);
    return {
      visual: eqSvg(e),
      prompt: `Look at the word equation for <b>${e.name}</b>. What are the <b>${askReactants ? 'reactants' : 'products'}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Reactants are BEFORE the arrow. Products are AFTER it.',
      working: ['<b>Picture:</b> the arrow is a one-way door. In front = what you start with, behind = what you end up with.', `1. Reactants (before the arrow): <b>${e.l}</b>.`, `2. Products (after the arrow): <b>${e.r}</b>.`, `So the ${askReactants ? 'reactants' : 'products'} are <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'equations',
    };
  }
  function completeEquation(level) {
    const e = R.pick(EQUATIONS);
    const hideRight = R.chance(0.6);
    const correct = hideRight ? e.r : e.l;
    const wrongs = EQUATIONS.filter((x) => x.name !== e.name).map((x) => (hideRight ? x.r : x.l));
    const opt = choice(correct, wrongs, 4);
    return {
      prompt: `Complete the word equation for <b>${e.name}</b>:<br>${hideRight ? `${e.l} ➜ <b>?</b>` : `<b>?</b> ➜ ${e.r}`}`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: hideRight ? 'What new substance is made?' : 'What did you have to start with?',
      working: ['<b>Picture:</b> reactants go in the front door, products come out the back.', `The full equation is: <b>${e.l} ➜ ${e.r}</b>.`, `So the missing part is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'equations',
    };
  }
  function eqVocab(level) {
    const askReactant = R.chance(0.5);
    const def = askReactant ? 'the substances you start with, written before the arrow' : 'the new substances that are made, written after the arrow';
    const term = askReactant ? 'reactants' : 'products';
    return {
      prompt: `In a word equation, what word means <b>${def}</b> — reactants or products?`,
      answer: textAns(term, [term.slice(0, -1)], 'one word'),
      hint: 'REactants are REady at the start. PROducts are PROduced.',
      working: ['<b>Picture:</b> reactants ➜ products, like ingredients ➜ cake.', `<b>${askReactant ? 'Reactants' : 'Products'}</b> = ${def}.`],
      finalAnswer: askReactant ? 'Reactants' : 'Products', skill: 'equations',
    };
  }
  function rustNeeds(level) {
    const form = R.pick(['what-needed', 'table', 'prevent', 'is-new']);
    if (form === 'table') {
      const tube = R.pick(['A', 'B', 'C']);
      const answers = { A: 'It has both water and air, which is exactly what rusting needs', B: 'There is no air (no oxygen), so it cannot rust', C: 'There is no water, so it cannot rust' };
      const opt = choice(answers[tube], Object.keys(answers).filter((k) => k !== tube).map((k) => answers[k]).concat(['Iron never rusts in a test tube']), 4);
      return {
        visual: rustTable(),
        prompt: `Look at the results of the rusting experiment. Explain the result for test tube <b>${tube}</b>.`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Rusting needs BOTH oxygen (from air) and water. Take either one away and it stops.',
        working: [
          '<b>Picture:</b> rust needs two ingredients — air and water. Remove either and the recipe fails.',
          '1. Tube A has water AND air → it rusts.',
          '2. Tube B has water but the oil seals the air out → no rust.',
          '3. Tube C has air but no water → no rust.',
          `So for tube ${tube}: <b>${answers[tube]}</b>.`,
        ],
        finalAnswer: answers[tube], skill: 'rusting',
      };
    }
    if (form === 'prevent') {
      const p = R.pick(RUST_STOP);
      const opt = choice(p.why, RUST_STOP.filter((x) => x.how !== p.how).map((x) => x.why), 4);
      return {
        prompt: `Why does <b>${p.how}</b> stop it going rusty?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Rusting needs oxygen AND water touching the iron.',
        working: ['<b>Picture:</b> rust needs air + water touching the metal — so build a wall.', '1. Rusting needs oxygen and water to reach the iron.', `2. ${p.why.charAt(0).toUpperCase() + p.why.slice(1)}.`],
        finalAnswer: p.why, skill: 'rusting',
      };
    }
    if (form === 'is-new') {
      return {
        prompt: 'An iron nail left outside at the beach goes orange and flaky. Is rusting a physical or a chemical change?',
        answer: textAns('chemical', ['chemical change', 'a chemical change'], 'one word'),
        hint: 'Is the orange stuff still iron?',
        working: ['<b>Picture:</b> the orange flakes are not iron any more.', '1. Is a new substance made? Yes — hydrated iron oxide.', '2. Can you turn rust back into a shiny nail? No.', 'So it is a <b>chemical change</b>.'],
        finalAnswer: 'Chemical — a new substance (rust) is made', skill: 'rusting',
      };
    }
    const opt = choice('oxygen (from the air) and water', ['oxygen only', 'water only', 'heat and light'], 4);
    return {
      prompt: 'What two things does iron need in order to <b>rust</b>?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Think about where things rust fastest — outside in the rain, especially at the beach.',
      working: ['<b>Picture:</b> a bike left out in the rain goes rusty; one in a dry shed does not.', 'Rusting needs <b>oxygen (air) and water</b>. Take either one away and it stops.'],
      finalAnswer: 'oxygen (from the air) and water', skill: 'rusting',
    };
  }
  function burning(level) {
    const form = R.pick(['triangle', 'remove', 'products']);
    if (form === 'triangle') {
      const missing = R.pick(['fuel', 'oxygen', 'heat']);
      const clue = { fuel: 'the thing that actually burns, like wood or gas', oxygen: 'the gas from the air that the fire needs', heat: 'what starts the fire off and keeps it going' };
      return {
        visual: fireTriangle(),
        prompt: `The fire triangle shows the three things a fire needs. Which one is <b>${clue[missing]}</b>?`,
        answer: textAns(missing, [], 'one word'),
        hint: 'Fuel, oxygen and heat — take any one away and the fire goes out.',
        working: ['<b>Picture:</b> a three-legged stool — remove one leg and it falls over.', `1. ${clue[missing].charAt(0).toUpperCase() + clue[missing].slice(1)}.`, `That is <b>${missing}</b>.`],
        finalAnswer: missing, skill: 'burning',
      };
    }
    if (form === 'remove') {
      const way = R.pick([
        { act: 'putting a lid on a burning pan', part: 'oxygen' },
        { act: 'pouring water on a campfire', part: 'heat' },
        { act: 'turning the gas knob off on the cooker', part: 'fuel' },
        { act: 'smothering a fire with a fire blanket', part: 'oxygen' },
        { act: 'clearing dry scrub away in front of a bush fire', part: 'fuel' },
      ]);
      return {
        visual: fireTriangle(),
        prompt: `Which side of the fire triangle are you taking away by <b>${way.act}</b>?`,
        answer: textAns(way.part, [], 'one word'),
        hint: 'Fuel = the thing that burns. Oxygen = air getting in. Heat = the temperature.',
        working: ['<b>Picture:</b> the three-legged stool — knock out one leg.', `1. ${way.act.charAt(0).toUpperCase() + way.act.slice(1)} stops the ${way.part} reaching the fire.`, `So you are removing the <b>${way.part}</b>.`],
        finalAnswer: way.part, skill: 'burning',
      };
    }
    const opt = choice('carbon dioxide and water', ['only smoke', 'oxygen and hydrogen', 'nothing — it just disappears'], 4);
    return {
      prompt: 'Natural gas (methane) burns on a cooker. What new substances are made?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Burning a fuel in plenty of oxygen makes two things — one is the gas plants use.',
      working: ['<b>Picture:</b> the gas ring — the flame makes the pot damp underneath.', 'Word equation: <b>methane + oxygen ➜ carbon dioxide + water</b>.'],
      finalAnswer: 'carbon dioxide and water', skill: 'burning',
    };
  }
  function massQ(level) {
    const opt = choice('It goes up — oxygen from the air joins the magnesium', ['It goes down — some magnesium burns away', 'It stays exactly the same', 'It halves'], 4);
    return {
      visual: eqSvg(EQUATIONS[0]),
      prompt: 'Harper weighs a strip of magnesium, burns it in a crucible, and weighs the white powder left behind. What happens to the mass?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Look at the word equation — how many things went IN?',
      working: [
        '<b>Picture:</b> two ingredients go in, one product comes out — so the product holds both.',
        '1. The equation is magnesium + <b>oxygen</b> ➜ magnesium oxide.',
        '2. The oxygen came out of the air and is now part of the powder.',
        'So the mass <b>goes up</b>.',
      ],
      finalAnswer: 'It goes up — oxygen from the air has joined on', skill: 'equations',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('Chemical — the fizzing is a brand-new gas being made', ['Physical — the powder is just dissolving', 'Physical — it is only mixing', 'Chemical — because it gets wet'], 4);
      return {
        prompt: 'Harper drops baking soda into vinegar and it froths right over the top of the glass. Physical or chemical change — and how can she tell?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Where did all that gas come from? There was none before.',
        working: ['<b>Picture:</b> a volcano model erupting at the school science fair.', '1. Was there any gas before? No.', '2. Bubbles of a <b>new gas</b> is one of the five signs.', '3. You cannot un-fizz it either.', 'So it is a <b>chemical change</b>.'],
        finalAnswer: 'Chemical — bubbles of a new gas appeared',
      };
    },
    () => {
      const opt = choice('Physical — the sugar is still sugar, just spread out; evaporate the water and you get it back', [
        'Chemical — the sugar has turned into a new substance',
        'Chemical — because the sugar disappeared',
        'Physical — because the drink changed colour',
      ], 4);
      return {
        prompt: 'Sugar stirred into hot tea seems to vanish. Harper\'s friend says that is a chemical change because the sugar has gone. Is he right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Taste the tea. Is the sugar still in there?',
        working: ['<b>Picture:</b> the sugar hiding between the water particles — still there, just invisible.', '1. Is a new substance made? No — it still tastes sweet.', '2. Can you get it back? Yes — evaporate the water.', 'So it is a <b>physical change</b>.'],
        finalAnswer: 'No — dissolving is a physical change',
      };
    },
    () => {
      const c = R.pick(CHEMICAL);
      const opt = choice('a chemical change', ['a physical change'], 2);
      return {
        prompt: `Harper is writing up her book. She notes: "${c.what} — ${c.sign}." Which kind of change has she recorded?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'She has spotted one of the five signs of a reaction.',
        working: [`<b>Picture:</b> the five clues that shout "new substance".`, `1. Her clue is: <b>${c.sign}</b>.`, `2. ${c.why.charAt(0).toUpperCase() + c.why.slice(1)}.`, 'So it is <b>a chemical change</b>.'],
        finalAnswer: 'a chemical change',
      };
    },
    () => {
      const opt = choice('No — the steam is still water, so it is a physical change', ['Yes — steam is a new substance', 'Yes — because bubbles appeared', 'Yes — because heat was used'], 4);
      return {
        prompt: 'Spot the mistake: Harper\'s friend says boiling water must be a chemical reaction because you can see bubbles. Is he right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The sign is bubbles of a NEW gas. Is steam a new substance?',
        working: [
          '<b>Picture:</b> hold a cold plate over the steam — water drips back off it.',
          '1. What is the gas in the bubbles? Water vapour — still water.',
          '2. Nothing new was made, and cooling brings the water straight back.',
          'So boiling is a <b>physical</b> change.',
        ],
        finalAnswer: 'No — steam is still water, so boiling is physical',
      };
    },
    () => {
      const opt = choice('Tube A only — it is the only one with both air and water', ['All three tubes', 'Tubes A and B', 'None of them'], 4);
      return {
        visual: rustTable(),
        prompt: 'Look at the rusting experiment. Which test tube(s) would you expect to have a rusty nail after a week?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Rusting needs BOTH oxygen and water.',
        working: ['<b>Picture:</b> rust is a recipe with two ingredients — air and water.', '1. Tube A: water ✓ air ✓ → rusts.', '2. Tube B: the oil seals the air out → no rust.', '3. Tube C: dry air, no water → no rust.', 'Answer: <b>tube A only</b>.'],
        finalAnswer: 'Tube A only',
      };
    },
    () => {
      const opt = choice('It shows that rusting needs BOTH water and oxygen — remove either one and it stops', [
        'It shows that rusting needs only water',
        'It shows that rusting needs only oxygen',
        'It shows that nails never rust indoors',
      ], 4);
      return {
        visual: rustTable(),
        prompt: 'What does this experiment prove about rusting?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Compare A with B, then A with C.',
        working: [
          '<b>Picture:</b> a recipe test — take out one ingredient at a time and see if it still works.',
          '1. A vs B: the only difference is <b>air</b>. No air → no rust. So oxygen is needed.',
          '2. A vs C: the only difference is <b>water</b>. No water → no rust. So water is needed.',
          'Answer: <b>rusting needs both water and oxygen</b>.',
        ],
        finalAnswer: 'Rusting needs both water and oxygen',
      };
    },
    () => {
      const p = R.pick(RUST_STOP);
      const opt = choice(p.how, RUST_STOP.filter((x) => x.how !== p.how).map((x) => x.how).slice(0, 2).concat(['leaving it out in the rain']), 4);
      return {
        prompt: `Harper wants to stop the iron gate at the bach going rusty. Which of these would work, because ${p.why}?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'You need a barrier that keeps air and water off the iron.',
        working: ['<b>Picture:</b> a raincoat for the metal.', `1. ${p.why.charAt(0).toUpperCase() + p.why.slice(1)}.`, `So: <b>${p.how}</b>.`],
        finalAnswer: p.how,
      };
    },
    () => {
      const opt = choice('Put the lid on — that takes the oxygen away', ['Blow on it', 'Add more oil', 'Turn the heat up'], 4);
      return {
        visual: fireTriangle(),
        prompt: 'A pan of oil catches fire on the stove. Using the fire triangle, what is the safest way to put it out?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Take away one side of the triangle — and never use water on an oil fire.',
        working: ['<b>Picture:</b> the three-legged stool — knock out one leg.', '1. The fuel (oil) is already there and water on hot oil is dangerous.', '2. A lid seals the pan so no <b>oxygen</b> can get in.', 'Answer: <b>put the lid on</b>.'],
        finalAnswer: 'Put the lid on — it removes the oxygen',
      };
    },
    () => {
      const e = R.pick(EQUATIONS);
      const opt = choice(e.r, EQUATIONS.filter((x) => x.name !== e.name).map((x) => x.r), 4);
      return {
        visual: eqSvg(e),
        prompt: `Harper's book shows the reaction for <b>${e.name}</b>. What is made?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The products are always written AFTER the arrow.',
        working: ['<b>Picture:</b> ingredients ➜ cake. The cake is on the right.', `1. Reactants: ${e.l}.`, `2. Products (after the arrow): <b>${e.r}</b>.`],
        finalAnswer: e.r,
      };
    },
    () => {
      const opt = choice('Chemical — the toast is a new substance, and you can never turn it back into bread', [
        'Physical — it is still bread, just hotter',
        'Physical — because only the colour changed',
        'Chemical — because the toaster is electric',
      ], 4);
      return {
        prompt: 'Harper burns her toast: it goes black and smells different. Physical or chemical? Give two reasons.',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Count the signs: colour change, new smell, and can you undo it?',
        working: [
          '<b>Picture:</b> nobody has ever un-toasted a piece of toast.',
          '1. Colour change ✓ (a sign).',
          '2. New smell ✓ (a sign).',
          '3. Can you reverse it? No.',
          'So it is a <b>chemical change</b>.',
        ],
        finalAnswer: 'Chemical — a colour change, a new smell, and you cannot reverse it',
      };
    },
    () => {
      const opt = choice('Chemical — the milk has turned into new substances and cannot be turned back', ['Physical — the milk just got warm', 'Physical — it is only a change of state', 'Chemical — because it was in the sun'], 4);
      return {
        prompt: 'A bottle of milk left in the sun goes lumpy and smells terrible. Which kind of change is that, and how do you know?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'New smell, new solid lumps — how many signs is that?',
        working: ['<b>Picture:</b> no fridge in the world will turn sour milk back into fresh milk.', '1. New smell ✓', '2. New solid lumps forming ✓', '3. Reversible? No.', 'So it is a <b>chemical change</b>.'],
        finalAnswer: 'Chemical — a new smell and new solids, and it cannot be reversed',
      };
    },
  ];

  HL.registerTopic({
    id: 'physical-chemical', subject: 'science', strand: 'material', order: 4,
    name: 'Physical & chemical change', short: 'Change type', animal: 'crab',
    blurb: 'Did you just change the shape of something, or make a brand-new substance?',
    example: 'melting ice = physical · burning wood = chemical',
    learn: {
      what: '<p>In a <b>physical change</b> the substance is still the same substance — you have only changed its shape, its size or its state. It can usually be <b>reversed</b>. In a <b>chemical change</b> a <b>brand-new substance</b> is made, and it is usually very hard to get the original back.</p><p><b>Picture for this topic:</b> <b>melting ice ↔ water</b> (you can freeze it straight back) versus <b>burning wood ➜ ash</b> (nobody has ever un-burnt a log).</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Physical change:</b> no new substance, usually reversible (melting, dissolving, crushing, boiling)',
        '<b>Chemical change:</b> a NEW substance is made, usually not reversible (burning, rusting, cooking)',
        'The 5 signs of a reaction: <b>bubbles of a new gas</b>, a <b>colour change</b>, <b>heat or light</b> given out, a <b>precipitate</b> (new solid), a <b>new smell</b>',
        'Word equation: <b>reactants ➜ products</b> (what you start with ➜ what is made)',
        'Rusting needs <b>oxygen AND water</b>: iron + oxygen + water ➜ rust',
        'Burning needs three things — the <b>fire triangle</b>: fuel, oxygen, heat',
      ],
      steps: [
        'Ask the one big question: "<b>is a brand-new substance made?</b>" Yes → chemical. No → physical.',
        'Check for the <b>five signs</b>: new gas bubbling, colour change, heat or light, a new solid appearing, a new smell. Spotting any of them means chemical.',
        'Ask "<b>could I get it back?</b>" Melted ice, dissolved sugar and a crushed can can all be undone. Toast, rust and ash cannot.',
        'Careful traps: <b>dissolving</b> and <b>boiling</b> look dramatic, but they are <b>physical</b> — the substance is still in there.',
        'For a word equation, read the arrow as a one-way door: <b>reactants ➜ products</b>. Everything before the arrow goes in; everything after it comes out.',
      ],
      examples: [
        {
          q: 'Is melting chocolate a physical or a chemical change?',
          working: ['<b>Picture:</b> ice ↔ water, both ways.', '1. Is a brand-new substance made? <b>No</b> — it is still chocolate.', '2. Can you get it back? Yes — let it cool and it sets again.'],
          a: 'Physical',
        },
        {
          q: 'Harper adds baking soda to vinegar and it froths over the glass. Which change is it, and which sign tells you?',
          working: ['<b>Picture:</b> the volcano model at the science fair.', '1. Was there any gas before? <b>No.</b>', '2. So this is <b>bubbles of a new gas</b> — one of the five signs.', '3. You cannot un-fizz it.'],
          a: 'Chemical — a new gas was made',
        },
        {
          q: 'Spot the mistake: "boiling water is a chemical reaction because I can see bubbles."',
          working: ['<b>Picture:</b> hold a cold plate over the steam — water drips straight back off it.', '1. What is in the bubbles? Water vapour — still water.', '2. A sign of a reaction is a bubble of a <b>NEW</b> gas.', '3. Cooling it gives the water straight back.'],
          a: 'Wrong — boiling is a physical change',
        },
        {
          q: 'Read the word equation for burning magnesium. Name the reactants and the product.',
          visual: eqSvg({ l: 'magnesium + oxygen', r: 'magnesium oxide' }),
          working: ['<b>Picture:</b> ingredients ➜ cake. Ingredients go in the front, the cake comes out the back.', '1. Before the arrow = the <b>reactants</b>: magnesium and oxygen.', '2. After the arrow = the <b>product</b>: magnesium oxide.', '3. The bright white light is a sign a reaction is happening.'],
          a: 'Reactants: magnesium + oxygen. Product: magnesium oxide',
        },
        {
          q: 'Harper weighs magnesium, burns it, and weighs the white powder. Why is the powder heavier than the ribbon was?',
          working: ['<b>Picture:</b> two ingredients go in, one product comes out — so the product holds both.', '1. The equation is magnesium + <b>oxygen</b> ➜ magnesium oxide.', '2. The oxygen came out of the air.', '3. That oxygen is now locked inside the powder, so the mass goes up.'],
          a: 'Oxygen from the air joined on, so the mass increased',
        },
        {
          q: 'EXPERIMENT: three nails are set up as in the table. Which will rust, and what does the experiment prove?',
          visual: rustTable(),
          working: [
            '<b>Picture:</b> rust is a recipe with two ingredients — air and water. Take one out and it fails.',
            '1. Tube A: water ✓ air ✓ → <b>rusts</b>.',
            '2. Tube B vs A: the only change is <b>no air</b> → no rust. So oxygen is needed.',
            '3. Tube C vs A: the only change is <b>no water</b> → no rust. So water is needed.',
          ],
          a: 'Only A rusts — rusting needs both oxygen and water',
        },
        {
          q: 'A pan of oil catches fire. Using the fire triangle, what is the safest way to put it out?',
          visual: fireTriangle(),
          working: ['<b>Picture:</b> a three-legged stool — knock one leg out and it falls.', '1. The three sides are fuel, oxygen and heat.', '2. The oil (fuel) is already in the pan, and water on hot oil is dangerous.', '3. A lid seals the pan so no <b>oxygen</b> gets in.'],
          a: 'Put a lid on it — that removes the oxygen',
        },
      ],
      tips: [
        '<b>Dissolving is physical, not chemical.</b> The sugar is still there — taste it, or evaporate the water and get it back.',
        'Bubbles only count as a sign if they are a <b>new gas</b>. Boiling bubbles are just the same substance turning into a gas.',
        'Rust needs <b>both</b> air and water — that is why a bike rusts in the rain but not in a dry shed, and why it is worst at the beach.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[0], WORD[2], WORD[8], WORD[9], WORD[10]])(level);
        if (level === 2) return R.pick(WORD)(level);
        return R.pick([WORD[1], WORD[3], WORD[4], WORD[5], WORD[6], WORD[7], WORD[9]])(level);
      }
      const pool = level === 1
        ? [classify, signQ, eqVocab, rustNeeds, burning]
        : level === 2
          ? [classify, reversible, signQ, equationParts, completeEquation, rustNeeds, burning, eqVocab]
          : [classify, reversible, equationParts, completeEquation, rustNeeds, burning, massQ, signQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
