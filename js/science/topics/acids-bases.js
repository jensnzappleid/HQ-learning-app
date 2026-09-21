/* Topic: Acids, bases and the pH scale (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const PH_COLOURS = ['#D14B3C', '#D9553C', '#E0603C', '#E9843C', '#EDA43C', '#E8C24A', '#D5CE4A', '#6FA04C', '#4FB89A', '#5F98C4', '#4F7FC0', '#6C6FC4', '#8B76C4', '#7A5FB0', '#6A4B9E'];
  const uiColour = (ph) => (ph <= 2 ? 'red' : ph <= 4 ? 'orange' : ph <= 6 ? 'yellow' : ph === 7 ? 'green' : ph <= 10 ? 'blue' : 'purple');
  const COLOUR_NAMES = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  const phType = (ph) => (ph < 7 ? 'an acid' : ph === 7 ? 'neutral' : 'an alkali (a base)');

  const STUFF = [
    { name: 'stomach acid', ph: 1 }, { name: 'lemon juice', ph: 2 }, { name: 'vinegar', ph: 3 },
    { name: 'fizzy drink', ph: 3 }, { name: 'orange juice', ph: 4 }, { name: 'tomato juice', ph: 4 },
    { name: 'black coffee', ph: 5 }, { name: 'rain water', ph: 6 }, { name: 'milk', ph: 6 },
    { name: 'pure water', ph: 7 }, { name: 'salt water', ph: 7 },
    { name: 'toothpaste', ph: 8 }, { name: 'sea water', ph: 8 }, { name: 'baking soda solution', ph: 9 },
    { name: 'hand soap', ph: 10 }, { name: 'limewater', ph: 11 }, { name: 'bleach', ph: 12 },
    { name: 'oven cleaner', ph: 13 }, { name: 'drain cleaner', ph: 14 },
  ];

  const USES = [
    { problem: 'you have indigestion from too much stomach acid', fix: 'take an antacid tablet (a base)', why: 'the base neutralises the extra acid in your stomach' },
    { problem: 'a farmer\'s paddock in the Waikato has soil that is too acidic for grass', fix: 'spread lime (a base) on the soil', why: 'lime is a base, so it neutralises the acid in the soil' },
    { problem: 'a bee has stung you (bee stings are acidic)', fix: 'dab on baking soda paste (a base)', why: 'you need the opposite of an acid, so an alkali cancels it out' },
    { problem: 'a wasp has stung you (wasp stings are alkaline)', fix: 'dab on vinegar (a weak acid)', why: 'you need the opposite of an alkali, so a weak acid cancels it out' },
    { problem: 'acid from bacteria is attacking your teeth', fix: 'brush with toothpaste (slightly alkaline)', why: 'the toothpaste neutralises the acid before it eats the enamel' },
    { problem: 'a lake has become too acidic for fish', fix: 'add powdered lime to the water', why: 'lime is a base, so it raises the pH back towards neutral' },
    { problem: 'a factory has spilled acid on the lab floor', fix: 'cover it with sodium hydrogen carbonate powder', why: 'the base neutralises the acid so it is safe to clean up' },
  ];

  const SAFETY = [
    { rule: 'wear safety goggles whenever you use acids or alkalis', why: 'even dilute acid can badly damage your eyes' },
    { rule: 'wash any spill off your skin with lots of cold water', why: 'water dilutes the chemical and washes it away' },
    { rule: 'never taste or smell a chemical to identify it', why: 'many acids and alkalis are corrosive and poisonous' },
    { rule: 'add acid to water, never water to acid', why: 'the other way round can spit hot acid out of the beaker' },
    { rule: 'tell the teacher straight away if you spill something', why: 'a spill can burn skin or damage the bench if it is left' },
  ];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- the pH scale diagram ---------- */
  const cellX = (i) => 14 + i * 21;
  const cellMid = (i) => 24.5 + i * 21;
  const phScale = (mark, markLabel) => `<svg viewBox="0 0 344 168" width="344" height="168" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${mark == null
        ? `<text x="171" y="18" text-anchor="middle" fill="#6FA04C" font-size="12">NEUTRAL</text>
           <line x1="171" y1="24" x2="171" y2="50" stroke="#6FA04C" stroke-width="2"/>
           <text x="84" y="46" text-anchor="middle" fill="#D14B3C">ACIDS</text>
           <text x="258" y="46" text-anchor="middle" fill="#6A4B9E">ALKALIS (BASES)</text>`
        : `<text x="${Math.min(296, Math.max(48, cellMid(mark)))}" y="24" text-anchor="middle" fill="#E0568C" font-size="12.5">${markLabel || 'this one'}</text>
           <path d="M${cellMid(mark)} 50 l-8 -16 l16 0 z" fill="#E0568C"/>`}
      ${PH_COLOURS.map((c, i) => `<rect x="${cellX(i)}" y="52" width="21" height="34" fill="${c}"/>`).join('')}
      <rect x="14" y="52" width="315" height="34" fill="none" stroke="#4A4033" stroke-width="1.5"/>
      ${PH_COLOURS.map((c, i) => `<text x="${cellMid(i)}" y="102" text-anchor="middle" fill="#4A4033" font-size="12">${i}</text>`).join('')}
      ${mark == null
        ? `<line x1="${cellMid(2)}" y1="106" x2="${cellMid(2)}" y2="114" stroke="#4A4033" stroke-width="1.5"/>
           <text x="${cellMid(2)}" y="128" text-anchor="middle" fill="#4A4033" font-size="11.5">lemon</text>
           <line x1="${cellMid(7)}" y1="106" x2="${cellMid(7)}" y2="114" stroke="#4A4033" stroke-width="1.5"/>
           <text x="${cellMid(7)}" y="128" text-anchor="middle" fill="#4A4033" font-size="11.5">pure water</text>
           <line x1="${cellMid(11)}" y1="106" x2="${cellMid(11)}" y2="114" stroke="#4A4033" stroke-width="1.5"/>
           <text x="${cellMid(11)}" y="128" text-anchor="middle" fill="#4A4033" font-size="11.5">soap</text>
           <text x="171" y="152" text-anchor="middle" fill="#C98A1C" font-size="12">lower number = stronger acid</text>`
        : `<text x="84" y="126" text-anchor="middle" fill="#D14B3C" font-size="12">ACIDS</text>
           <text x="171" y="126" text-anchor="middle" fill="#6FA04C" font-size="12">NEUTRAL</text>
           <text x="266" y="126" text-anchor="middle" fill="#6A4B9E" font-size="12">ALKALIS</text>
           <text x="171" y="152" text-anchor="middle" fill="#C98A1C" font-size="12">lower number = stronger acid</text>`}
    </svg>`;

  const litmusSvg = () => `<svg viewBox="0 0 340 150" width="340" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="66" y="22" text-anchor="middle" fill="#4A4033">in ACID</text>
      <text x="248" y="22" text-anchor="middle" fill="#4A4033">in ALKALI</text>
      <rect x="30" y="34" width="72" height="26" rx="4" fill="#D14B3C"/>
      <rect x="212" y="34" width="72" height="26" rx="4" fill="#4F7FC0"/>
      <text x="130" y="52" fill="#4A4033" font-size="11.5">red litmus</text>
      <rect x="30" y="82" width="72" height="26" rx="4" fill="#D14B3C"/>
      <rect x="212" y="82" width="72" height="26" rx="4" fill="#4F7FC0"/>
      <text x="130" y="100" fill="#4A4033" font-size="11.5">blue litmus</text>
      <text x="66" y="76" text-anchor="middle" fill="#4A4033" font-size="11">stays red</text>
      <text x="248" y="76" text-anchor="middle" fill="#4A4033" font-size="11">turns blue</text>
      <text x="66" y="124" text-anchor="middle" fill="#4A4033" font-size="11">turns red</text>
      <text x="248" y="124" text-anchor="middle" fill="#4A4033" font-size="11">stays blue</text>
      <text x="170" y="144" text-anchor="middle" fill="#C98A1C" font-size="11.5">acid = red · alkali = blue</text>
    </svg>`;

  const neutralSvg = () => `<svg viewBox="0 0 344 150" width="344" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12.5" font-weight="700">
      <rect x="16" y="30" width="94" height="34" rx="8" fill="#F7D9D2" stroke="#D14B3C" stroke-width="2.5"/>
      <text x="63" y="52" text-anchor="middle" fill="#D14B3C">ACID</text>
      <text x="122" y="52" text-anchor="middle" fill="#4A4033" font-size="16">+</text>
      <rect x="134" y="30" width="112" height="34" rx="8" fill="#E4E0F6" stroke="#6A4B9E" stroke-width="2.5"/>
      <text x="190" y="52" text-anchor="middle" fill="#6A4B9E">BASE (alkali)</text>
      <text x="262" y="52" text-anchor="middle" fill="#E0568C" font-size="17">➜</text>
      <rect x="280" y="30" width="48" height="34" rx="8" fill="#DFF0D0" stroke="#6FA04C" stroke-width="2.5"/>
      <text x="304" y="52" text-anchor="middle" fill="#6FA04C">pH 7</text>
      <text x="172" y="92" text-anchor="middle" fill="#4A4033">acid + base ➜ salt + water</text>
      <text x="172" y="118" text-anchor="middle" fill="#C98A1C" font-size="12">this is called NEUTRALISATION</text>
      <text x="172" y="140" text-anchor="middle" fill="#4A4033" font-size="12">the opposites cancel each other out</text>
    </svg>`;

  /* ---------- question makers ---------- */
  function classifyPH(level) {
    const ph = R.int(0, 14);
    const correct = phType(ph);
    const opt = choice(correct, ['an acid', 'neutral', 'an alkali (a base)'].filter((x) => x !== correct), 3);
    return {
      prompt: `A solution has a <b>pH of ${ph}</b>. Is it an acid, neutral, or an alkali?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Below 7 = acid. Exactly 7 = neutral. Above 7 = alkali.',
      working: ['<b>Picture:</b> the pH ruler, 0 to 14, with pure water sitting bang in the middle at 7.', `1. Is ${ph} less than 7? ${ph < 7 ? 'Yes.' : 'No.'}`, `2. Is it exactly 7? ${ph === 7 ? 'Yes.' : 'No.'}`, `So pH ${ph} is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'ph-scale',
    };
  }
  function scaleRead(level) {
    const ph = R.int(0, 14);
    const form = R.pick(['type', 'colour', 'number']);
    if (form === 'number') {
      return {
        visual: phScale(ph, 'read this'),
        prompt: 'The arrow points at one place on the pH scale. What pH number is it pointing at?',
        answer: { type: 'number', value: ph, placeholder: 'e.g. 7' },
        hint: 'Count the boxes along, starting at 0 on the far left.',
        working: ['<b>Picture:</b> the pH ruler runs 0 to 14 from left to right.', '1. Follow the arrow straight down to the number under the box.', `2. It is pointing at <b>pH ${ph}</b>.`],
        finalAnswer: `pH ${ph}`, skill: 'ph-scale',
      };
    }
    if (form === 'colour') {
      const col = uiColour(ph);
      const opt = choice(col, COLOUR_NAMES.filter((c) => c !== col), 4);
      return {
        visual: phScale(ph, `pH ${ph}`),
        prompt: `Universal indicator is added to a solution with a <b>pH of ${ph}</b>. What colour does it turn?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Red → orange → yellow → GREEN at 7 → blue → purple, like a rainbow across the scale.',
        working: ['<b>Picture:</b> the pH ruler is a rainbow: hot red acids on the left, green neutral in the middle, cool purple alkalis on the right.', `1. Find pH ${ph} on the scale.`, `2. That box is <b>${col}</b>.`],
        finalAnswer: col, skill: 'indicators',
      };
    }
    const correct = phType(ph);
    const opt = choice(correct, ['an acid', 'neutral', 'an alkali (a base)'].filter((x) => x !== correct), 3);
    return {
      visual: phScale(ph, `pH ${ph}`),
      prompt: `The arrow shows the pH of a solution Harper has tested. Is it an acid, neutral or an alkali?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Look at which side of 7 the arrow is on.',
      working: ['<b>Picture:</b> 7 is the middle of the ruler — everything left is acid, everything right is alkali.', `1. The arrow is at pH ${ph}.`, `2. That is ${ph < 7 ? 'to the LEFT of 7' : ph === 7 ? 'exactly on 7' : 'to the RIGHT of 7'}.`, `So it is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'ph-scale',
    };
  }
  function colourToPh(level) {
    const col = R.pick(COLOUR_NAMES);
    const answer = { red: 'a strong acid', orange: 'a weaker acid', yellow: 'a weak acid', green: 'neutral', blue: 'an alkali', purple: 'a strong alkali' }[col];
    const opt = choice(answer, ['a strong acid', 'a weak acid', 'neutral', 'an alkali', 'a strong alkali'].filter((x) => x !== answer), 4);
    return {
      prompt: `Harper adds universal indicator to a solution and it turns <b>${col}</b>. What does that tell her?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Red = strong acid, green = neutral, purple = strong alkali.',
      working: ['<b>Picture:</b> the rainbow ruler — hot colours are acids, green is neutral, cool colours are alkalis.', `1. ${col.charAt(0).toUpperCase() + col.slice(1)} sits ${col === 'green' ? 'right in the middle' : ['red', 'orange', 'yellow'].includes(col) ? 'on the acid side' : 'on the alkali side'}.`, `So the solution is <b>${answer}</b>.`],
      finalAnswer: answer, skill: 'indicators',
    };
  }
  function substanceQ(level) {
    const s = R.pick(STUFF);
    const form = R.chance(0.5) ? 'type' : 'ph';
    if (form === 'ph') {
      return {
        prompt: `${s.name.charAt(0).toUpperCase() + s.name.slice(1)} has a pH of about ${s.ph}. Roughly what pH would you expect for it? Write the number.`,
        answer: { type: 'number', value: s.ph, placeholder: 'e.g. 7' },
        hint: 'It is written in the question — just copy the number.',
        working: [`<b>${s.name}</b> has a pH of about <b>${s.ph}</b>, which makes it ${phType(s.ph)}.`],
        finalAnswer: `pH ${s.ph}`, skill: 'everyday',
      };
    }
    const correct = phType(s.ph);
    const opt = choice(correct, ['an acid', 'neutral', 'an alkali (a base)'].filter((x) => x !== correct), 3);
    return {
      prompt: `Is <b>${s.name}</b> an acid, neutral, or an alkali?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Sour, sharp things are usually acids. Soapy, slippery, cleaning things are usually alkalis.',
      working: ['<b>Picture:</b> the pH ruler — sour lemon on the left, soap on the right, water in the middle.', `1. ${s.name.charAt(0).toUpperCase() + s.name.slice(1)} has a pH of about <b>${s.ph}</b>.`, `2. ${s.ph < 7 ? 'That is less than 7.' : s.ph === 7 ? 'That is exactly 7.' : 'That is more than 7.'}`, `So it is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'everyday',
    };
  }
  function compareQ(level) {
    const [a, b] = R.sample(STUFF.filter((s) => s.ph !== 7), 2);
    if (a.ph === b.ph) return substanceQ(level);
    const wantAcid = R.chance(0.5);
    const target = wantAcid ? (a.ph < b.ph ? a : b) : (a.ph > b.ph ? a : b);
    const opt = choice(target.name, [a.name === target.name ? b.name : a.name], 2);
    return {
      prompt: `${a.name.charAt(0).toUpperCase() + a.name.slice(1)} has a pH of ${a.ph} and ${b.name} has a pH of ${b.ph}. Which one is <b>more ${wantAcid ? 'acidic' : 'alkaline'}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: wantAcid ? 'The FURTHER BELOW 7, the stronger the acid.' : 'The FURTHER ABOVE 7, the stronger the alkali.',
      working: ['<b>Picture:</b> the pH ruler with 7 in the middle — the further from 7 you go, the stronger it is.', `1. ${wantAcid ? 'More acidic means a LOWER number.' : 'More alkaline means a HIGHER number.'}`, `2. ${target.ph} is ${wantAcid ? 'lower' : 'higher'}.`, `So <b>${target.name}</b> is more ${wantAcid ? 'acidic' : 'alkaline'}.`],
      finalAnswer: target.name, skill: 'ph-scale',
    };
  }
  function litmusQ(level) {
    const paper = R.chance(0.5) ? 'red' : 'blue';
    const inWhat = R.chance(0.5) ? 'an acid' : 'an alkali';
    const correct = paper === 'red' ? (inWhat === 'an acid' ? 'it stays red' : 'it turns blue') : (inWhat === 'an acid' ? 'it turns red' : 'it stays blue');
    const opt = choice(correct, ['it stays red', 'it turns blue', 'it turns red', 'it stays blue'].filter((x) => x !== correct), 4);
    return {
      visual: litmusSvg(),
      prompt: `A piece of <b>${paper} litmus paper</b> is dipped into <b>${inWhat}</b>. What happens to it?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Litmus only ever ends up red or blue: acid makes it RED, alkali makes it BLUE.',
      working: [
        '<b>Picture:</b> litmus has only two answers — <b>red for acid, blue for alkali</b>.',
        `1. It is in ${inWhat}, so it must end up <b>${inWhat === 'an acid' ? 'red' : 'blue'}</b>.`,
        `2. It started ${paper}, so ${correct}.`,
      ],
      finalAnswer: correct, skill: 'indicators',
    };
  }
  function cabbageQ(level) {
    const kind = R.pick([['an acid', 'red or pink'], ['a neutral solution', 'purple'], ['an alkali', 'green or yellow']]);
    const opt = choice(kind[1], ['red or pink', 'purple', 'green or yellow'].filter((x) => x !== kind[1]), 3);
    return {
      prompt: `Harper makes an indicator by boiling red cabbage. What colour does it go in <b>${kind[0]}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Red cabbage goes pink in acid, stays purple in the middle, and turns green in alkali.',
      working: ['<b>Picture:</b> cabbage juice starts purple (neutral) and swings pink one way, green the other.', `In ${kind[0]} it goes <b>${kind[1]}</b>.`],
      finalAnswer: kind[1], skill: 'indicators',
    };
  }
  function indicatorWhat(level) {
    const opt = choice('a substance that changes colour to show whether something is an acid or an alkali', [
      'a chemical that makes acids stronger',
      'a machine that measures temperature',
      'a substance that neutralises acids',
    ], 4);
    return {
      prompt: 'What is an <b>indicator</b>?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Universal indicator, litmus and red cabbage juice are all examples.',
      working: ['<b>Picture:</b> litmus paper going red in lemon juice.', 'An indicator <b>changes colour</b> to tell you if something is acid or alkali.'],
      finalAnswer: 'A substance that changes colour to show acid or alkali', skill: 'indicators',
    };
  }
  function neutralisationQ(level) {
    const form = R.pick(['equation', 'what-add', 'result-ph', 'name']);
    if (form === 'equation') {
      const opt = choice('salt + water', ['acid + water', 'a stronger acid', 'oxygen + water'], 4);
      return {
        visual: neutralSvg(),
        prompt: 'Complete the word equation: <b>acid + base ➜ ?</b>',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Two opposites cancel out and leave something harmless.',
        working: ['<b>Picture:</b> +1 and −1 cancel to zero.', 'The rule to learn: <b>acid + base ➜ salt + water</b>.'],
        finalAnswer: 'salt + water', skill: 'neutralisation',
      };
    }
    if (form === 'result-ph') {
      return {
        visual: neutralSvg(),
        prompt: 'An acid is exactly neutralised by adding a base. What is the pH at the end? Write the number.',
        answer: { type: 'number', value: 7, placeholder: 'e.g. 7' },
        hint: 'Neutral is the middle of the pH scale.',
        working: ['<b>Picture:</b> the acid climbs the pH ruler until it lands on the green square in the middle.', 'Exactly neutralised means <b>pH 7</b>.'],
        finalAnswer: 'pH 7', skill: 'neutralisation',
      };
    }
    if (form === 'what-add') {
      const acidic = R.chance(0.5);
      const correct = acidic ? 'a base (an alkali)' : 'an acid';
      const opt = choice(correct, ['a base (an alkali)', 'an acid', 'more water only', 'another indicator'].filter((x) => x !== correct), 4);
      return {
        prompt: `A solution has a pH of <b>${acidic ? R.int(1, 4) : R.int(10, 13)}</b>. What should you add to bring it back to neutral?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'To cancel something out you always add its opposite.',
        working: ['<b>Picture:</b> a see-saw — to level it, push down the other side.', `1. The solution is ${acidic ? 'an acid (below 7)' : 'an alkali (above 7)'}.`, `2. The opposite of ${acidic ? 'an acid is a base' : 'an alkali is an acid'}.`, `So add <b>${correct}</b>.`],
        finalAnswer: correct, skill: 'neutralisation',
      };
    }
    const opt = choice('neutralisation', ['evaporation', 'diffusion', 'filtration'], 4);
    return {
      visual: neutralSvg(),
      prompt: 'What is the name of the reaction when an acid and a base cancel each other out?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'The clue is in the word "neutral".',
      working: ['<b>Picture:</b> both sides of the see-saw balance at pH 7.', 'It is called <b>neutralisation</b>.'],
      finalAnswer: 'neutralisation', skill: 'neutralisation',
    };
  }
  function useQ(level) {
    const u = R.pick(USES);
    const opt = choice(u.fix, USES.filter((x) => x.problem !== u.problem).map((x) => x.fix), 4);
    return {
      prompt: `What should you do if <b>${u.problem}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Neutralise it with the opposite: acid problem → add a base; alkali problem → add a weak acid.',
      working: ['<b>Picture:</b> a see-saw — add the opposite to bring it level.', `1. ${u.why.charAt(0).toUpperCase() + u.why.slice(1)}.`, `So: <b>${u.fix}</b>.`],
      finalAnswer: u.fix, skill: 'neutralisation',
    };
  }
  function safetyQ(level) {
    const s = R.pick(SAFETY);
    const opt = choice(s.why, SAFETY.filter((x) => x.rule !== s.rule).map((x) => x.why), 4);
    return {
      prompt: `In the lab you must <b>${s.rule}</b>. Why?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Acids and alkalis are corrosive — they attack skin, eyes and clothes.',
      working: ['<b>Picture:</b> the orange corrosive hazard symbol — a hand with a hole burned in it.', `Because <b>${s.why}</b>.`],
      finalAnswer: s.why, skill: 'safety',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('Baking soda paste, because a bee sting is acidic and a base neutralises it', [
        'Vinegar, because acid cancels acid',
        'Lemon juice, because it is soothing',
        'Nothing — the sting will neutralise itself',
      ], 4);
      return {
        visual: phScale(3, 'bee sting'),
        prompt: 'Harper gets stung by a bee at the beach. Bee stings are <b>acidic</b>. What should be dabbed on it, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Cancel an acid with its opposite. Memory hook: B for Bee, B for Bicarb.',
        working: ['<b>Picture:</b> a see-saw — an acid on one side needs a base on the other.', '1. A bee sting is an <b>acid</b> (low pH).', '2. To neutralise an acid you need a <b>base</b>.', '3. Baking soda is a base.', 'Answer: <b>baking soda paste</b>.'],
        finalAnswer: 'Baking soda — a base neutralises the acidic sting',
      };
    },
    () => {
      const opt = choice('Vinegar, because a wasp sting is alkaline and a weak acid neutralises it', [
        'Baking soda, because it works for every sting',
        'Soap, because it is slippery',
        'Bleach, because it is strong',
      ], 4);
      return {
        visual: phScale(10, 'wasp sting'),
        prompt: 'A wasp sting is <b>alkaline</b>. What should be dabbed on it, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Cancel an alkali with a weak acid. Memory hook: W for Wasp, W for Weak acid (vinegar).',
        working: ['<b>Picture:</b> the see-saw again — this time the alkali side is down.', '1. A wasp sting is an <b>alkali</b> (high pH).', '2. To neutralise an alkali you need an <b>acid</b>.', '3. Vinegar is a weak acid, so it is safe on skin.', 'Answer: <b>vinegar</b>.'],
        finalAnswer: 'Vinegar — a weak acid neutralises the alkaline sting',
      };
    },
    () => {
      const opt = choice('Spread lime on it — lime is a base, so it neutralises the acid and raises the pH towards 7', [
        'Add vinegar to make it more acidic',
        'Water it more so the acid washes deeper in',
        'Nothing can be done about soil pH',
      ], 4);
      return {
        visual: phScale(4, 'the soil'),
        prompt: 'A Waikato farmer tests his paddock and the soil has a pH of 4, which is too acidic for good grass. What should he do?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'He needs to move the pH UP the scale towards 7.',
        working: ['<b>Picture:</b> the pH ruler — he needs to shift from 4 up to about 7.', '1. pH 4 is <b>acidic</b>.', '2. To raise the pH you add a <b>base</b>.', '3. Farmers use lime, which is a base.'],
        finalAnswer: 'Spread lime (a base) to neutralise the acid',
      };
    },
    () => {
      const opt = choice('An antacid tablet, because it is a base that neutralises the extra stomach acid', [
        'A glass of lemon juice, because it is acidic too',
        'A fizzy drink, because the bubbles help',
        'Nothing — stomach acid cannot be neutralised',
      ], 4);
      return {
        visual: phScale(1, 'stomach acid'),
        prompt: 'Harper\'s grandad has indigestion — too much acid in his stomach. What will help, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'You need something that cancels an acid out.',
        working: ['<b>Picture:</b> the see-saw — the acid side is right down at pH 1.', '1. The problem is too much <b>acid</b>.', '2. The opposite of an acid is a <b>base</b>.', '3. Antacid tablets contain a base, so they neutralise it.'],
        finalAnswer: 'An antacid — a base that neutralises the stomach acid',
      };
    },
    () => {
      const ph = R.int(0, 6);
      const col = uiColour(ph);
      const opt = choice(`It is an acid — universal indicator goes ${col} at about pH ${ph}`, [
        'It is neutral — universal indicator is green',
        'It is an alkali — universal indicator goes blue',
        'You cannot tell anything from the colour',
      ], 4);
      return {
        visual: phScale(ph, `pH ${ph}`),
        prompt: `Harper drips universal indicator into an unknown liquid and it turns <b>${col}</b>. What can she say about it?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Match the colour to the pH scale, then decide which side of 7 it is on.',
        working: ['<b>Picture:</b> the rainbow ruler — hot colours are acids, green is neutral, cool colours are alkalis.', `1. ${col.charAt(0).toUpperCase() + col.slice(1)} matches about <b>pH ${ph}</b>.`, `2. ${ph} is less than 7.`, 'So it is an <b>acid</b>.'],
        finalAnswer: `An acid — ${col} means about pH ${ph}`,
      };
    },
    () => {
      const opt = choice('Universal indicator — it gives a whole pH number, not just "acid or alkali"', [
        'Litmus paper — it is more accurate',
        'Red cabbage juice — it never fails',
        'Neither can tell you anything',
      ], 4);
      return {
        prompt: 'Harper needs to know <b>how strong</b> an acid is, not just that it is an acid. Which indicator should she use, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Litmus only ever gives two answers. Universal indicator gives a whole rainbow.',
        working: ['<b>Picture:</b> litmus is a yes/no switch; universal indicator is a full ruler.', '1. Litmus only tells you red (acid) or blue (alkali).', '2. Universal indicator matches a colour to a <b>pH number</b> from 0 to 14.', 'So use <b>universal indicator</b>.'],
        finalAnswer: 'Universal indicator — it gives an actual pH number',
      };
    },
    () => {
      const opt = choice('The pH slowly rises towards 7 and the colour goes from red through orange and yellow to green', [
        'The pH drops even lower',
        'The colour stays red the whole time',
        'The solution turns purple straight away',
      ], 4);
      return {
        visual: phScale(null),
        prompt: 'Harper adds a base drop by drop to an acid with universal indicator in it. What does she see happen?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Adding a base moves the solution along the pH scale towards 7.',
        working: ['<b>Picture:</b> the acid climbing the rainbow ruler from red towards green.', '1. Adding a base <b>neutralises</b> the acid, so the pH goes up.', '2. As the pH rises, the colour follows the scale: red → orange → yellow → green.', '3. Keep going past 7 and it would carry on to blue and purple.'],
        finalAnswer: 'The pH rises towards 7 and the colour goes red → orange → yellow → green',
      };
    },
    () => {
      const opt = choice('Wash it off straight away with plenty of cold water and tell the teacher', [
        'Rub it off with a paper towel',
        'Put a strong alkali on your skin to neutralise it',
        'Leave it and see if it stings',
      ], 4);
      return {
        prompt: 'Harper spills dilute acid on her hand in the lab. What should she do?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Never use another chemical on skin — you would only make a second problem.',
        working: ['<b>Picture:</b> the tap running cold, for a good long time.', '1. Water <b>dilutes and washes away</b> the acid.', '2. Putting a strong alkali on skin would burn as well.', 'Answer: <b>plenty of cold water, then tell the teacher</b>.'],
        finalAnswer: 'Wash with plenty of cold water and tell the teacher',
      };
    },
    () => {
      const opt = choice('Toothpaste is a mild base, so it neutralises the acid that bacteria make on your teeth', [
        'Toothpaste is an acid that dissolves the plaque',
        'Toothpaste is neutral so it does nothing chemical',
        'Toothpaste makes your mouth more acidic to kill germs',
      ], 4);
      return {
        visual: phScale(8, 'toothpaste'),
        prompt: 'Toothpaste has a pH of about 8. Why is that useful for your teeth?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'What is attacking your enamel, and what cancels it?',
        working: ['<b>Picture:</b> the see-saw — acid attacking your teeth, a base pushing back.', '1. Bacteria in your mouth make <b>acid</b>, which eats enamel.', '2. pH 8 means toothpaste is a mild <b>base</b>.', '3. A base <b>neutralises</b> the acid.'],
        finalAnswer: 'It is a mild base, so it neutralises the acid on your teeth',
      };
    },
    () => {
      const opt = choice('Spot the mistake: pH 3 is the STRONGER acid — the lower the number, the stronger the acid', [
        'Her friend is right: pH 5 is stronger',
        'They are exactly the same strength',
        'Neither is an acid',
      ], 4);
      return {
        visual: phScale(null),
        prompt: 'Harper\'s friend says "pH 5 must be a stronger acid than pH 3 because 5 is a bigger number". Is he right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'On the pH scale, the further BELOW 7 you go, the stronger the acid.',
        working: ['<b>Picture:</b> the pH ruler — 0 on the far left is the fiercest acid of all.', '1. Strong acids are at the LOW end: 0, 1, 2…', '2. pH 3 is further from 7 than pH 5 is.', 'So <b>pH 3 is the stronger acid</b> — her friend has it backwards.'],
        finalAnswer: 'No — pH 3 is the stronger acid',
      };
    },
    () => {
      const opt = choice('It would be green — pure water is neutral, pH 7', ['Red, because water is a weak acid', 'Purple, because water is a base', 'Colourless — water has no pH'], 4);
      return {
        visual: phScale(7, 'pure water'),
        prompt: 'Harper tests pure water with universal indicator as a control. What colour should it turn?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Pure water sits exactly in the middle of the scale.',
        working: ['<b>Picture:</b> the middle green square of the rainbow ruler.', '1. Pure water is <b>neutral</b>.', '2. Neutral is pH <b>7</b>.', '3. At pH 7 universal indicator is <b>green</b>.'],
        finalAnswer: 'Green — pure water is neutral at pH 7',
      };
    },
  ];
  HL.registerTopic({
    id: 'acids-bases', subject: 'science', strand: 'material', order: 5,
    name: 'Acids & bases', short: 'Acids & bases', animal: 'gecko',
    blurb: 'The pH scale from 0 to 14, indicators, and how opposites cancel each other out.',
    example: 'lemon pH 2 · water pH 7 · soap pH 10',
    learn: {
      what: '<p><b>Acids</b> taste sour and have a pH <b>below 7</b> — lemon juice, vinegar, fizzy drink, the acid in your stomach. <b>Bases</b> (the ones that dissolve are called <b>alkalis</b>) feel soapy and have a pH <b>above 7</b> — soap, baking soda, oven cleaner. Pure water sits in the middle at <b>7: neutral</b>. An <b>indicator</b> changes colour to tell you which you have.</p><p><b>Picture for this topic:</b> a <b>ruler from 0 to 14</b> coloured like a rainbow — hot red acids on the left, green neutral in the middle, cool purple alkalis on the right. The further from the middle, the stronger it is.</p>',
      visual: phScale(null),
      facts: [
        '<b>pH below 7 = acid</b> · <b>pH 7 = neutral</b> · <b>pH above 7 = alkali (base)</b>',
        'Universal indicator: <b>red</b> (strong acid) → orange → yellow → <b>green</b> (neutral) → blue → <b>purple</b> (strong alkali)',
        'Litmus has only two answers: <b>acid turns it red</b>, <b>alkali turns it blue</b>',
        'Red cabbage indicator: <b>pink</b> in acid, <b>purple</b> neutral, <b>green</b> in alkali',
        '<b>Neutralisation:</b> acid + base ➜ <b>salt + water</b> (both opposites cancel, ending at pH 7)',
        'Stings: <b>bee = acid</b> (use baking soda), <b>wasp = alkali</b> (use vinegar)',
      ],
      steps: [
        'Put the number on the ruler: "<b>is it below 7, exactly 7, or above 7?</b>" That is the whole first step.',
        'For strength, ask "<b>how far from 7 is it?</b>" pH 1 is a much stronger acid than pH 6; pH 14 is a much stronger alkali than pH 8.',
        'For an indicator question, use the rainbow: red-orange-yellow are acids, <b>green is exactly neutral</b>, blue-purple are alkalis.',
        'To fix a pH problem, <b>add the opposite</b>: too acidic → add a base; too alkaline → add an acid. That is neutralisation.',
        'Safety first, every time: <b>goggles on</b>, and any spill on skin gets washed with lots of cold water — never another chemical.',
      ],
      examples: [
        {
          q: 'A liquid has a pH of 3. Is it an acid, neutral or an alkali — and what colour would universal indicator go?',
          visual: phScale(3, 'pH 3'),
          working: ['<b>Picture:</b> the rainbow ruler, with 7 in the middle.', '1. Is 3 below 7? <b>Yes</b> → it is an <b>acid</b>.', '2. Find box 3 on the scale: it is <b>orange</b>.'],
          a: 'An acid — universal indicator turns orange',
        },
        {
          q: 'Blue litmus paper is dipped in vinegar. What happens?',
          visual: litmusSvg(),
          working: ['<b>Picture:</b> litmus is a switch with only two settings — red for acid, blue for alkali.', '1. Is vinegar an acid? <b>Yes</b> (pH about 3).', '2. Acid always makes litmus <b>red</b>.', '3. It started blue, so it changes.'],
          a: 'It turns red',
        },
        {
          q: 'Which is the stronger acid: pH 2 or pH 5?',
          working: ['<b>Picture:</b> the ruler — 0 on the far left is the fiercest acid there is.', '1. Both are below 7, so both are acids.', '2. Stronger acid = <b>further from 7</b> = the lower number.', '3. 2 is lower than 5.'],
          a: 'pH 2',
        },
        {
          q: 'Complete the word equation and name the reaction: acid + base ➜ ?',
          visual: neutralSvg(),
          working: ['<b>Picture:</b> a see-saw — one side pushes down, the other pushes back, and it ends up level at pH 7.', '1. The acid and the base cancel each other out.', '2. What is left is harmless: <b>salt + water</b>.', '3. The reaction is called <b>neutralisation</b>.'],
          a: 'acid + base ➜ salt + water — this is neutralisation',
        },
        {
          q: 'Harper is stung by a bee (bee stings are acidic). What should be put on it, and why?',
          visual: phScale(3, 'bee sting'),
          working: ['<b>Picture:</b> the see-saw with the acid side right down.', '1. The sting is an <b>acid</b>.', '2. To cancel an acid you need a <b>base</b>.', '3. Baking soda paste is a base. (B for Bee, B for Bicarb.)', '4. A wasp sting is the other way round — alkaline — so that one gets vinegar.'],
          a: 'Baking soda paste — a base neutralises the acid',
        },
        {
          q: 'A farmer\'s paddock has soil of pH 4. Grass grows best near pH 7. What should he add?',
          visual: phScale(4, 'the soil'),
          working: ['<b>Picture:</b> the ruler — he has to shift the soil from 4 up to about 7.', '1. pH 4 is <b>acidic</b>.', '2. To raise a pH you add a <b>base</b>.', '3. Farmers spread <b>lime</b>, which is a base.'],
          a: 'Lime — a base that neutralises the acid and raises the pH',
        },
        {
          q: 'EXPERIMENT: Harper adds a base drop by drop to an acid that has universal indicator in it. Describe what she sees, and how she knows when to stop.',
          working: [
            '<b>Picture:</b> the acid climbing the rainbow ruler from red towards green.',
            '1. At the start the acid is <b>red</b>.',
            '2. As base goes in the pH rises: red → orange → yellow.',
            '3. She stops the moment it turns <b>green</b> — that is pH 7, exactly neutral.',
            '4. If she keeps going it will turn blue, meaning she has added too much.',
          ],
          a: 'The colour goes red → orange → yellow → green; stop at green (pH 7)',
        },
      ],
      tips: [
        'Lower number = <b>stronger</b> acid. It feels backwards, so say it out loud: "pH 1 is fiercer than pH 6."',
        'Litmus can only ever say <b>acid or alkali</b>. If you need an actual number, you need <b>universal indicator</b>.',
        'Never put a chemical on a chemical spill on skin — <b>lots of cold water</b>, then tell the teacher.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[0], WORD[3], WORD[7], WORD[10], WORD[8]])(level);
        if (level === 2) return R.pick(WORD)(level);
        return R.pick([WORD[1], WORD[2], WORD[4], WORD[5], WORD[6], WORD[9], WORD[8]])(level);
      }
      const pool = level === 1
        ? [classifyPH, substanceQ, litmusQ, indicatorWhat, scaleRead]
        : level === 2
          ? [classifyPH, scaleRead, substanceQ, litmusQ, cabbageQ, neutralisationQ, useQ, safetyQ, colourToPh]
          : [scaleRead, compareQ, colourToPh, neutralisationQ, useQ, litmusQ, safetyQ, classifyPH];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
