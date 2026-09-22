/* Topic: Mixtures, solutions and separating techniques (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const METHODS = [
    { name: 'filtration', how: 'pour the mixture through filter paper in a funnel', use: 'an insoluble solid mixed into a liquid' },
    { name: 'evaporation', how: 'heat the solution gently so the liquid escapes as a gas', use: 'getting the dissolved solid back out of a solution' },
    { name: 'distillation', how: 'boil the mixture, then cool the vapour back into a liquid', use: 'getting the pure liquid back out of a solution' },
    { name: 'chromatography', how: 'let a solvent creep up a strip of paper', use: 'splitting up the different colours in an ink or a dye' },
    { name: 'using a magnet', how: 'run a magnet over the mixture', use: 'pulling a magnetic solid out of a non-magnetic one' },
    { name: 'sieving', how: 'shake the mixture through a mesh', use: 'separating solid bits of different sizes' },
    { name: 'decanting', how: 'let it settle, then carefully pour the liquid off the top', use: 'a heavy solid that has settled, or two liquids that do not mix' },
  ];
  const METHOD_NAMES = METHODS.map((m) => m.name);

  const JOBS = [
    { job: 'sand from a beaker of water', method: 'filtration', why: 'sand does not dissolve, so the paper traps it while the water runs through' },
    { job: 'salt from salt water, keeping the salt', method: 'evaporation', why: 'the salt is dissolved, so the water has to be driven off and the salt is left behind' },
    { job: 'pure drinking water from sea water', method: 'distillation', why: 'you want the liquid back, so the water is boiled off and then cooled back into a liquid' },
    { job: 'the different colours in a black felt pen', method: 'chromatography', why: 'each dye travels a different distance up the paper' },
    { job: 'iron filings from a pile of sand', method: 'using a magnet', why: 'iron is magnetic and sand is not' },
    { job: 'pebbles from a bucket of sand', method: 'sieving', why: 'the sand grains fall through the mesh but the pebbles cannot' },
    { job: 'the tea leaves out of a cup of tea', method: 'filtration', why: 'the leaves are insoluble bits floating in a liquid' },
    { job: 'mud from river water once it has settled to the bottom', method: 'decanting', why: 'the heavy mud has settled, so the clear water can be poured off the top' },
    { job: 'steel paperclips from a bowl of rice', method: 'using a magnet', why: 'steel is magnetic and rice is not' },
    { job: 'sugar from sugar solution, keeping the sugar', method: 'evaporation', why: 'the sugar is dissolved, so the water must be driven off' },
    { job: 'flour from a mixture of flour and dried peas', method: 'sieving', why: 'the flour is fine enough to fall through the mesh, the peas are not' },
    { job: 'chalk powder stirred into water', method: 'filtration', why: 'chalk is insoluble, so it stays on the filter paper' },
    { job: 'the coloured dyes in the shell of a lolly', method: 'chromatography', why: 'the dyes travel different distances up the paper' },
    { job: 'copper sulfate crystals from copper sulfate solution', method: 'evaporation', why: 'the crystals are dissolved, so the water is evaporated away' },
    { job: 'sawdust floating in a bucket of water', method: 'filtration', why: 'sawdust is insoluble, so the paper traps it' },
    { job: 'small stones from garden soil', method: 'sieving', why: 'the soil falls through the mesh and the stones stay on top' },
    { job: 'iron nails mixed into a box of plastic beads', method: 'using a magnet', why: 'iron is magnetic and plastic is not' },
    { job: 'pure water from a beaker of blue copper sulfate solution', method: 'distillation', why: 'you want the liquid back, so it is boiled off and cooled back down' },
    { job: 'the oil floating on top of a jar of water', method: 'decanting', why: 'the two liquids do not mix, so the top layer can be poured off' },
    { job: 'the different pigments in a crushed green leaf', method: 'chromatography', why: 'each pigment travels a different distance up the paper' },
    { job: 'gravel from a bucket of muddy water, keeping the gravel', method: 'filtration', why: 'the gravel is insoluble and stays behind' },
    { job: 'the salt from a rock pool at Piha once the tide has gone', method: 'evaporation', why: 'the sun drives the water off and leaves the salt crusted on the rock' },
  ];

  const VOCAB = [
    { word: 'solute', def: 'the substance that dissolves (usually the solid)' },
    { word: 'solvent', def: 'the liquid that does the dissolving' },
    { word: 'solution', def: 'the clear mixture you get when something has dissolved' },
    { word: 'soluble', def: 'able to dissolve in a liquid' },
    { word: 'insoluble', def: 'not able to dissolve — it stays as bits you can filter out' },
    { word: 'saturated', def: 'so full that no more solid will dissolve in it' },
    { word: 'filtrate', def: 'the liquid that runs through the filter paper' },
    { word: 'residue', def: 'the solid left behind in the filter paper' },
    { word: 'solubility', def: 'how many grams will dissolve in 100 g of water' },
  ];

  const PURE = ['distilled water', 'oxygen gas from a cylinder', 'a bar of pure gold', 'pure copper wire', 'a diamond', 'nitrogen gas', 'pure iron'];
  const MIXTURES = ['sea water', 'the air we breathe', 'milk', 'orange juice with bits', 'muddy river water', 'brass (copper + zinc)', 'steel', 'a cup of tea', 'raspberry cordial', 'garden soil', 'fizzy drink', 'salt stirred into sand'];

  const SOLUBILITY = [
    { name: 'table salt', s: 36 }, { name: 'sugar', s: 204 }, { name: 'copper sulfate', s: 21 },
    { name: 'baking soda', s: 10 }, { name: 'potassium nitrate', s: 32 }, { name: 'Epsom salts', s: 34 },
  ];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms accepted for each separating-method name */
  const METHOD_ACCEPT = {
    filtration: [], evaporation: [], distillation: [], chromatography: [],
    'using a magnet': ['a magnet', 'magnet', 'magnetism', 'use a magnet'],
    sieving: ['a sieve', 'sieve'],
    decanting: ['decant', 'decantation'],
  };

  /* ---------- diagrams ---------- */
  const dotGrid = (pts, fill, stroke, r) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r || 5.5}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`).join('');
  const conceptSvg = () => `<svg viewBox="0 0 344 206" width="344" height="206" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="24" y="20" width="76" height="66" rx="8" fill="#FFFFFF" stroke="#8B76C4" stroke-width="3"/>
      ${dotGrid([[42, 38], [62, 38], [82, 38], [42, 56], [62, 56], [82, 56], [42, 74], [62, 74], [82, 74]], '#B9A5E6', '#8B76C4')}
      <rect x="134" y="20" width="76" height="66" rx="8" fill="#FFFFFF" stroke="#8B76C4" stroke-width="3"/>
      ${dotGrid([[152, 38], [172, 38], [152, 56], [172, 56], [152, 74]], '#B9A5E6', '#8B76C4')}
      ${dotGrid([[194, 38], [194, 56], [192, 74], [172, 74]], '#E9A07A', '#C97B52')}
      <rect x="244" y="20" width="76" height="66" rx="8" fill="#DCEEF9" stroke="#5F98C4" stroke-width="3"/>
      ${dotGrid([[262, 34], [300, 34], [272, 52], [306, 60], [258, 70], [292, 76]], '#E9A07A', '#C97B52', 4.5)}
      <text x="62" y="102" text-anchor="middle" fill="#8B76C4">PURE</text>
      <text x="172" y="102" text-anchor="middle" fill="#8B76C4">MIXTURE</text>
      <text x="282" y="102" text-anchor="middle" fill="#5F98C4">SOLUTION</text>
      <text x="62" y="118" text-anchor="middle" fill="#4A4033" font-size="11.5">one kind</text>
      <text x="172" y="118" text-anchor="middle" fill="#4A4033" font-size="11.5">two kinds</text>
      <text x="282" y="118" text-anchor="middle" fill="#4A4033" font-size="11.5">dissolved</text>
      <line x1="24" y1="132" x2="320" y2="132" stroke="#E8C24A" stroke-width="2"/>
      <text x="172" y="152" text-anchor="middle" fill="#4A4033" font-size="13">salt + water = salt water</text>
      <text x="172" y="172" text-anchor="middle" fill="#8B76C4" font-size="12">solute + solvent = solution</text>
      <text x="172" y="194" text-anchor="middle" fill="#C98A1C" font-size="12">evaporate to get the salt back</text>
    </svg>`;

  const filtrationSvg = () => `<svg viewBox="0 0 340 196" width="340" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <path d="M56 34 L144 34 L104 86 L96 86 Z" fill="#FFFFFF" stroke="#8B76C4" stroke-width="2.5"/>
      <path d="M62 40 L138 40 L100 86 Z" fill="#FFFBF2" stroke="#C9C0B4" stroke-width="2"/>
      <path d="M68 46 L132 46 L100 84 Z" fill="#A9D8F5" opacity="0.55"/>
      ${dotGrid([[96, 74], [104, 74], [100, 66], [92, 66], [108, 66]], '#E9A07A', '#C97B52', 4.5)}
      <rect x="96" y="86" width="8" height="22" fill="#FFFFFF" stroke="#8B76C4" stroke-width="2"/>
      <circle cx="100" cy="116" r="3.5" fill="#A9D8F5"/>
      <path d="M64 124 L64 178 L136 178 L136 124" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <rect x="66" y="146" width="68" height="31" fill="#DCEEF9"/>
      <line x1="146" y1="38" x2="176" y2="38" stroke="#4A4033" stroke-width="1.5"/>
      <text x="180" y="42" fill="#4A4033">funnel + filter paper</text>
      <line x1="112" y1="70" x2="176" y2="82" stroke="#C97B52" stroke-width="1.5"/>
      <text x="180" y="86" fill="#C97B52">residue = the solid</text>
      <line x1="140" y1="160" x2="176" y2="160" stroke="#5F98C4" stroke-width="1.5"/>
      <text x="180" y="164" fill="#5F98C4">filtrate = the liquid</text>
      <text x="100" y="192" text-anchor="middle" fill="#4A4033" font-size="11.5">filtration</text>
    </svg>`;

  const distillationSvg = () => `<svg viewBox="0 0 340 190" width="340" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="52" cy="112" r="28" fill="#FFFFFF" stroke="#8B76C4" stroke-width="2.5"/>
      <path d="M24 112 A28 28 0 0 0 80 112 Z" fill="#A9D8F5" opacity="0.7"/>
      <rect x="44" y="72" width="16" height="16" fill="#FFFFFF" stroke="#8B76C4" stroke-width="2.5"/>
      <path d="M46 150 l6 -12 l6 12 z" fill="#E0568C"/>
      <text x="52" y="176" text-anchor="middle" fill="#4A4033" font-size="11.5">salt water</text>
      <text x="76" y="152" fill="#E0568C" font-size="11.5">heat</text>
      <path d="M52 72 L52 58 L150 58" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <text x="100" y="48" text-anchor="middle" fill="#C97B52" font-size="11.5">vapour ➜</text>
      <rect x="150" y="46" width="106" height="26" rx="6" fill="#DCEEF9" stroke="#5F98C4" stroke-width="2.5"/>
      <line x1="150" y1="59" x2="256" y2="59" stroke="#8B76C4" stroke-width="2.5"/>
      <text x="203" y="36" text-anchor="middle" fill="#5F98C4" font-size="11.5">condenser (cold)</text>
      <path d="M256 59 L272 59 L272 104" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <path d="M244 112 L244 164 L308 164 L308 112" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <rect x="246" y="140" width="60" height="23" fill="#DCEEF9"/>
      <text x="276" y="184" text-anchor="middle" fill="#5F98C4" font-size="11.5">pure water collects</text>
      <text x="203" y="94" text-anchor="middle" fill="#4A4033" font-size="11.5">gas cools back</text>
      <text x="203" y="110" text-anchor="middle" fill="#4A4033" font-size="11.5">to a liquid</text>
    </svg>`;

  const CHROM_COLOURS = [['#E0568C', 'pink'], ['#5F98C4', 'blue'], ['#E8C24A', 'yellow'], ['#6FA04C', 'green']];
  const chromSvg = (spots) => {
    const ys = [118, 96, 74, 54];
    return `<svg viewBox="0 0 340 196" width="340" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <path d="M74 34 L74 172 L214 172 L214 34" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <rect x="76" y="146" width="136" height="25" fill="#DCEEF9"/>
      <rect x="122" y="26" width="44" height="140" fill="#FFFDF6" stroke="#C9C0B4" stroke-width="2"/>
      <line x1="122" y1="140" x2="166" y2="140" stroke="#4A4033" stroke-width="1.5" stroke-dasharray="4 3"/>
      ${spots.map((i, k) => `<ellipse cx="144" cy="${ys[k]}" rx="12" ry="6" fill="${CHROM_COLOURS[i][0]}"/>`).join('')}
      <line x1="168" y1="140" x2="228" y2="140" stroke="#4A4033" stroke-width="1.5"/>
      <text x="232" y="144" fill="#4A4033" font-size="11.5">start line</text>
      <line x1="168" y1="60" x2="228" y2="60" stroke="#C97B52" stroke-width="1.5"/>
      <text x="232" y="52" fill="#C97B52" font-size="11.5">dyes have</text>
      <text x="232" y="68" fill="#C97B52" font-size="11.5">separated</text>
      <text x="232" y="176" fill="#5F98C4" font-size="11.5">solvent</text>
      <text x="144" y="190" text-anchor="middle" fill="#4A4033" font-size="11.5">chromatography</text>
    </svg>`;
  };

  const solTable = (rows) => `<table class="data"><tr><th>substance</th><th>g per 100 g water</th></tr>`
    + rows.map((r) => `<tr><td>${r.name}</td><td>${r.s} g</td></tr>`).join('') + `</table>`;

  /* ---------- question makers ---------- */
  function whichMethod(level) {
    const j = R.pick(JOBS);
    return {
      prompt: `Which method would you use to separate <b>${j.job}</b>?`,
      answer: textAns(j.method, METHOD_ACCEPT[j.method], 'one or two words'),
      hint: 'Ask: has it dissolved? Is it magnetic? Do I want the solid or the liquid back?',
      working: [
        '<b>Picture:</b> a colander, a magnet, a kettle and a strip of paper — pick the right tool.',
        '1. Has anything <b>dissolved</b>? If yes, filtering will not work.',
        '2. Which part do you want to keep — the solid or the liquid?',
        `So use <b>${j.method}</b>: ${j.why}.`,
      ],
      finalAnswer: j.method, skill: 'choose-method',
    };
  }
  function methodUse(level) {
    const m = R.pick(METHODS);
    const opt = choice(m.use, METHODS.filter((x) => x.name !== m.name).map((x) => x.use));
    return {
      prompt: `What is <b>${m.name}</b> used for?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: `In ${m.name} you ${m.how}.`,
      working: [`1. In ${m.name} you <b>${m.how}</b>.`, `2. So it is for: <b>${m.use}</b>.`],
      finalAnswer: m.use, skill: 'methods',
    };
  }
  function methodHow(level) {
    const m = R.pick(METHODS);
    const opt = choice(m.how, METHODS.filter((x) => x.name !== m.name).map((x) => x.how));
    return {
      prompt: `In <b>${m.name}</b>, what do you actually do?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: `It is used for ${m.use}.`,
      working: [`1. ${m.name.charAt(0).toUpperCase() + m.name.slice(1)} is used for ${m.use}.`, `2. To do that you <b>${m.how}</b>.`],
      finalAnswer: m.how, skill: 'methods',
    };
  }
  function vocabQ(level) {
    const v = R.pick(VOCAB);
    if (R.chance(0.5)) {
      const opt = choice(v.def, VOCAB.filter((x) => x.word !== v.word).map((x) => x.def));
      return {
        prompt: `What does the word <b>${v.word}</b> mean?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Salt + water: the salt is the solute, the water is the solvent, salt water is the solution.',
        working: ['<b>Picture:</b> stirring salt into a glass of water.', `<b>${v.word}</b> = ${v.def}.`],
        finalAnswer: v.def, skill: 'vocab',
      };
    }
    return {
      prompt: `What is the word for <b>${v.def}</b>?`,
      answer: textAns(v.word, [], 'one word'),
      hint: 'Salt + water: salt = solute, water = solvent, salt water = solution.',
      working: ['<b>Picture:</b> stirring salt into a glass of water.', `That is the <b>${v.word}</b>.`],
      finalAnswer: v.word, skill: 'vocab',
    };
  }
  function soluteSolvent(level) {
    const pair = R.pick([
      ['salt', 'water', 'salt water'], ['sugar', 'tea', 'sweet tea'], ['cordial powder', 'water', 'raspberry drink'],
      ['coffee granules', 'hot water', 'a cup of coffee'], ['Epsom salts', 'warm water', 'a foot bath'], ['copper sulfate', 'water', 'blue solution'],
    ]);
    const askSolute = R.chance(0.5);
    const correct = askSolute ? pair[0] : pair[1];
    const opt = choice(correct, [askSolute ? pair[1] : pair[0], pair[2], 'neither of them'], 4);
    return {
      prompt: `${pair[0].charAt(0).toUpperCase() + pair[0].slice(1)} is stirred into ${pair[1]} to make ${pair[2]}. What is the <b>${askSolute ? 'solute' : 'solvent'}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'The solute is the thing that disappears into the liquid. The solvent is the liquid doing the dissolving.',
      working: ['<b>Picture:</b> stirring cordial powder into water.', `1. What disappeared into the liquid? <b>${pair[0]}</b> — that is the solute.`, `2. What did the dissolving? <b>${pair[1]}</b> — that is the solvent.`, `So the ${askSolute ? 'solute' : 'solvent'} is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'vocab',
    };
  }
  function pureOrMixture(level) {
    const isPure = R.chance(0.4);
    const item = isPure ? R.pick(PURE) : R.pick(MIXTURES);
    return {
      prompt: `Is <b>${item}</b> a pure substance or a mixture?`,
      answer: isPure
        ? textAns('pure', ['a pure substance', 'pure substance'], 'one word')
        : textAns('mixture', ['a mixture'], 'one word'),
      hint: 'Pure = only ONE substance in there. Mixture = two or more, just jumbled together.',
      working: [
        '<b>Picture:</b> a box of only purple balls (pure) vs a box of purple AND orange balls (mixture).',
        `1. Is there more than one substance in ${item}? ${isPure ? 'No — just the one.' : 'Yes.'}`,
        `So it is <b>${isPure ? 'a pure substance' : 'a mixture'}</b>.`,
      ],
      finalAnswer: isPure ? 'a pure substance' : 'a mixture', skill: 'pure',
    };
  }
  function filterDiagram(level) {
    const askResidue = R.chance(0.5);
    const correct = askResidue ? 'the residue — the solid trapped in the filter paper' : 'the filtrate — the liquid that runs through';
    return {
      visual: filtrationSvg(),
      prompt: `Harper filters muddy water. What is the name for <b>${askResidue ? 'the mud left in the filter paper' : 'the clear liquid collected in the beaker'}</b>?`,
      answer: askResidue
        ? textAns('residue', ['the residue'], 'one word')
        : textAns('filtrate', ['the filtrate'], 'one word'),
      hint: 'Residue stays behind (like the "rest" of it). Filtrate goes through the filter.',
      working: ['<b>Picture:</b> a strainer over a bowl of pasta.', '1. The solid trapped on top = the <b>residue</b>.', '2. The liquid that drips through = the <b>filtrate</b>.', `So the answer is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'filtration',
    };
  }
  function filterFails(level) {
    const opt = choice('No — the salt is dissolved, so it goes straight through the paper with the water', [
      'Yes — the filter paper traps all solids, including dissolved ones',
      'Yes, but only if the paper is folded twice',
      'No — salt water cannot be poured through a funnel',
    ], 4);
    return {
      visual: filtrationSvg(),
      prompt: 'Harper pours <b>salt water</b> through filter paper, hoping to get the salt out. Will it work?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Filter paper only catches bits that are big enough — dissolved particles are far too small.',
      working: [
        '<b>Picture:</b> a strainer catches pasta but not the water — and dissolved salt is even smaller than water.',
        '1. Has the salt dissolved? <b>Yes.</b>',
        '2. Dissolved particles are far too small to be trapped by the paper.',
        '3. To get salt back you need <b>evaporation</b> instead.',
        'Answer: <b>no — it goes straight through with the water</b>.',
      ],
      finalAnswer: 'No — dissolved salt passes straight through the filter paper', skill: 'filtration',
    };
  }
  function distilDiagram(level) {
    const form = R.pick(['what-collects', 'why-cool', 'why-not-evap']);
    if (form === 'why-cool') {
      const opt = choice('To turn the vapour back into a liquid so it can be collected', [
        'To stop the salt from boiling',
        'To make the water boil faster',
        'To keep the flask from cracking',
      ], 4);
      return {
        visual: distillationSvg(),
        prompt: 'In distillation, why is the tube in the middle kept <b>cold</b>?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'What has to happen to a gas before you can pour it into a beaker?',
        working: ['<b>Picture:</b> steam from the shower turning to drops on a cold mirror.', '1. The water leaves the flask as a <b>gas</b>.', '2. A gas cannot be collected in a beaker.', '3. Cooling makes it <b>condense</b> back into a liquid.'],
        finalAnswer: 'To condense the vapour back into a liquid', skill: 'distillation',
      };
    }
    if (form === 'why-not-evap') {
      const opt = choice('Evaporation lets the water escape into the air; distillation catches it and keeps it', [
        'They are exactly the same thing',
        'Distillation keeps the salt and throws away the water',
        'Evaporation needs a magnet, distillation does not',
      ], 4);
      return {
        visual: distillationSvg(),
        prompt: 'Why use <b>distillation</b> rather than simple evaporation to get drinking water from sea water?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Which part do you want to keep here — the salt or the water?',
        working: ['<b>Picture:</b> a rock pool drying out leaves salt behind — the water is gone for good.', '1. Here you want the <b>water</b>, not the salt.', '2. Evaporation loses the water into the air.', '3. Distillation cools the vapour and <b>collects</b> it.'],
        finalAnswer: 'Distillation catches the water; evaporation lets it escape', skill: 'distillation',
      };
    }
    return {
      visual: distillationSvg(),
      prompt: 'Salt water is distilled using this apparatus. What collects in the beaker on the right?',
      answer: textAns('pure water', ['water', 'the pure water'], 'two words'),
      hint: 'Only one of the two substances can turn into a gas and travel down the tube.',
      working: ['<b>Picture:</b> a kettle with a lid held over it — the drips that fall off are pure water.', '1. Which part boils off? The <b>water</b> (salt needs 1400 °C).', '2. It travels down the tube and cools back to a liquid.', '3. The salt is left behind in the flask.', 'So <b>pure water</b> collects.'],
      finalAnswer: 'pure water', skill: 'distillation',
    };
  }
  function chromQ(level) {
    const n = R.int(2, 4);
    const idx = R.sample([0, 1, 2, 3], n).sort();
    const form = R.pick(['count', 'furthest']);
    if (form === 'count') {
      return {
        visual: chromSvg(idx),
        prompt: 'Harper puts one spot of black ink on the paper and runs a chromatogram. How many different dyes were mixed in the ink?',
        answer: { type: 'number', value: n, placeholder: 'e.g. 3' },
        hint: 'Count the separate coloured spots on the paper.',
        working: ['<b>Picture:</b> one spot of ink walks up the paper and splits into its colours.', '1. Each dye travels its own distance, so it ends up as its own spot.', `2. Count the spots: there are <b>${n}</b>.`, `So the ink was made from <b>${n}</b> different dyes.`],
        finalAnswer: `${n} dyes`, skill: 'chromatography',
      };
    }
    const top = CHROM_COLOURS[idx[n - 1]][1];
    const opt = choice(`the ${top} dye`, idx.slice(0, n - 1).map((i) => `the ${CHROM_COLOURS[i][1]} dye`).concat(['they all travelled the same distance']), 4);
    return {
      visual: chromSvg(idx),
      prompt: 'Look at the chromatogram. Which dye travelled <b>furthest</b> up the paper?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Furthest up = highest spot above the start line.',
      working: ['<b>Picture:</b> a race up the paper — the most soluble dye gets carried the furthest.', '1. Find the highest spot.', `2. That is <b>the ${top} dye</b>.`],
      finalAnswer: `the ${top} dye`, skill: 'chromatography',
    };
  }
  function solubilityCalc(level) {
    const s = R.pick(SOLUBILITY);
    const rows = R.shuffle([s].concat(R.sample(SOLUBILITY.filter((x) => x.name !== s.name), 2)));
    const water = R.pick([50, 200, 300, 500]);
    const ans = s.s * water / 100;
    return {
      visual: solTable(rows),
      prompt: `Use the table. How many grams of <b>${s.name}</b> will dissolve in <b>${water} g</b> of water?`,
      answer: { type: 'number', value: ans, unit: 'g', placeholder: 'e.g. 36' },
      hint: 'The table is per 100 g of water. Scale it up or down.',
      working: [
        '<b>Picture:</b> a recipe — double the water, double the amount that dissolves.',
        `1. In 100 g of water: <b>${s.s} g</b> dissolves.`,
        `2. ${water} g is ${water / 100} × 100 g.`,
        `3. ${s.s} × ${water / 100} = <b>${ans} g</b>.`,
      ],
      finalAnswer: `${ans} g`, skill: 'solubility',
    };
  }
  function solubilityCompare(level) {
    const rows = R.sample(SOLUBILITY, 4);
    const most = R.chance(0.5);
    const target = rows.slice().sort((a, b) => (most ? b.s - a.s : a.s - b.s))[0];
    const opt = choice(target.name, rows.filter((r) => r.name !== target.name).map((r) => r.name), 4);
    return {
      visual: solTable(rows),
      prompt: `Use the table. Which substance is the <b>${most ? 'most' : 'least'} soluble</b> in water?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: `${most ? 'Most' : 'Least'} soluble = the ${most ? 'biggest' : 'smallest'} number of grams per 100 g.`,
      working: ['<b>Picture:</b> a race to see how much you can stir in before it stops dissolving.', `1. Compare the numbers in the table.`, `2. The ${most ? 'biggest' : 'smallest'} is <b>${target.s} g</b>.`, `So <b>${target.name}</b> is ${most ? 'most' : 'least'} soluble.`],
      finalAnswer: target.name, skill: 'solubility',
    };
  }
  function saturatedQ(level) {
    const form = R.pick(['what', 'more-dissolve', 'heat']);
    if (form === 'more-dissolve') {
      const opt = choice('Nothing — it sinks to the bottom and stays there', ['It dissolves and makes the solution stronger', 'It turns the solution into a new substance', 'It makes the water evaporate'], 4);
      return {
        prompt: 'Harper has a <b>saturated</b> salt solution and stirs in one more spoon of salt. What happens to it?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Saturated means the water is already completely full.',
        working: ['<b>Picture:</b> a full carpark — the next car has nowhere to go.', '1. Saturated = no more can dissolve.', '2. So the extra salt just sits on the bottom as a solid.'],
        finalAnswer: 'Nothing — it sinks to the bottom undissolved', skill: 'solubility',
      };
    }
    if (form === 'heat') {
      const opt = choice('More of it dissolves — warmer water can hold more solute', ['Less of it dissolves', 'Exactly the same amount dissolves', 'The solid turns into a liquid'], 4);
      return {
        prompt: 'Harper stirs sugar into <b>hot</b> water instead of cold water. What difference does it make?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Think about stirring sugar into hot tea versus cold water.',
        working: ['<b>Picture:</b> sugar vanishes into a hot cup of tea but sits at the bottom of a cold drink.', '1. Heating gives the particles more energy and spreads the water particles out.', '2. So more solute fits between them.', 'Answer: <b>more dissolves in hot water</b>.'],
        finalAnswer: 'More dissolves — warm water can hold more solute', skill: 'solubility',
      };
    }
    const opt = choice('It is so full that no more solid will dissolve in it', ['It has nothing dissolved in it yet', 'It has been filtered', 'It is boiling'], 4);
    return {
      prompt: 'What does it mean to say a solution is <b>saturated</b>?',
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Picture a full carpark.',
      working: ['<b>Picture:</b> a full carpark — no space left for another car.', 'Saturated = <b>no more solid will dissolve in it</b>.'],
      finalAnswer: 'No more solid will dissolve in it', skill: 'solubility',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('Filter it first to remove the sand, then evaporate the filtrate to get the salt', [
        'Just filter it — the salt will stay in the paper',
        'Just evaporate it — the sand will boil away',
        'Use a magnet, then filter it',
      ], 4);
      return {
        prompt: 'Harper has a beaker of <b>sand mixed with salt water</b>. She wants clean, dry salt at the end. What should she do — and in what order?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Two steps. Deal with the undissolved bits first.',
        working: [
          '<b>Picture:</b> a strainer first, then a hot pan.',
          '1. Sand is <b>insoluble</b> → filter it out. The sand is the residue.',
          '2. The salt is dissolved in the filtrate.',
          '3. <b>Evaporate</b> the filtrate and the salt is left behind.',
        ],
        finalAnswer: 'Filter out the sand, then evaporate the filtrate to get the salt',
      };
    },
    () => {
      const opt = choice('The salt would be left behind and only the water would boil away', ['Both the salt and the water would boil away together', 'Only the salt would boil away', 'Nothing would happen at all'], 4);
      return {
        prompt: 'Salt water is left in a dish in the sun at a rock pool in Piha for a week. What is left in the dish?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Water evaporates at everyday temperatures. Salt needs over 1400 °C.',
        working: ['<b>Picture:</b> a rock pool drying to a white salty crust.', '1. Which part can escape into the air? The <b>water</b>.', '2. The salt has a very high boiling point, so it stays.', 'Answer: <b>a crust of salt is left; the water evaporates away</b>.'],
        finalAnswer: 'The salt is left behind; the water evaporates away',
      };
    },
    () => {
      const opt = choice('Draw the start line in pencil — ink would run up the paper too and ruin the result', [
        'Draw it in the same colour as the ink',
        'Draw it in felt pen so you can see it clearly',
        'Do not draw a start line at all',
      ], 4);
      return {
        visual: chromSvg([0, 1, 2]),
        prompt: 'Harper is setting up a chromatography experiment. Why must the start line be drawn in <b>pencil</b>?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Pencil is graphite — it does not dissolve in the solvent.',
        working: ['<b>Picture:</b> a felt-tip line would join the race and mix with your spots.', '1. The solvent carries dissolved dyes up the paper.', '2. Pen ink contains dyes; pencil is graphite and does not dissolve.', 'Answer: <b>use pencil so the line does not run</b>.'],
        finalAnswer: 'Pencil does not dissolve, so the line stays put',
      };
    },
    () => {
      const opt = choice('The solvent level must start BELOW the spots, or the dyes wash straight off into the solvent', [
        'The solvent must cover the spots completely',
        'The paper must not touch the solvent at all',
        'The beaker must be full to the top',
      ], 4);
      return {
        visual: chromSvg([0, 1, 2, 3]),
        prompt: 'Spot the mistake: Harper dips the paper so deep that the ink spots are under the solvent. Why is that wrong?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The solvent must creep UP to the spots, not sit on top of them.',
        working: ['<b>Picture:</b> a felt pen mark held under a tap — it just washes away.', '1. The dyes must be carried up the paper.', '2. If they start underwater they dissolve straight into the solvent.', 'Answer: <b>the solvent must start below the spots</b>.'],
        finalAnswer: 'The solvent must start below the spots',
      };
    },
    () => {
      const j = R.pick(JOBS);
      const opt = choice(j.method, METHOD_NAMES.filter((m) => m !== j.method));
      return {
        prompt: `In the lab Harper is given a mixture and asked to get <b>${j.job}</b>. Which technique should she set up?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Dissolved or not? Magnetic or not? Do you want the solid or the liquid?',
        working: ['<b>Picture:</b> pick the right tool — strainer, magnet, kettle, sieve or paper.', `1. ${j.why.charAt(0).toUpperCase() + j.why.slice(1)}.`, `So she should use <b>${j.method}</b>.`],
        finalAnswer: j.method,
      };
    },
    () => {
      const opt = choice('Air is a mixture — mostly nitrogen and oxygen, not joined together', [
        'Air is a pure substance because you cannot see anything in it',
        'Air is a pure substance because it is a gas',
        'Air is a solution of oxygen dissolved in nitrogen',
      ], 4);
      return {
        prompt: 'Harper\'s friend says "air must be pure because it is invisible". Is that right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Pure means one substance only — not "clean" or "invisible".',
        working: ['<b>Picture:</b> a box of purple AND orange balls — still a mixture even if you cannot see it.', '1. What is air made of? Nitrogen, oxygen, argon, carbon dioxide…', '2. More than one substance, and they are not joined.', 'Answer: <b>air is a mixture</b>.'],
        finalAnswer: 'Air is a mixture of gases',
      };
    },
    () => {
      const opt = choice('It stayed the same — the sugar is still there, just spread through the water', [
        'It went down, because the sugar disappeared',
        'It went up, because dissolving makes more matter',
        'It halved',
      ], 4);
      return {
        prompt: 'Harper weighs a beaker of water plus a spoon of sugar (total 210 g). She stirs until the sugar dissolves and weighs it again. What does the balance read?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Dissolving hides the sugar, but it does not destroy it.',
        working: ['<b>Picture:</b> the sugar is still in there — taste it!', '1. Did any sugar leave the beaker? No.', '2. Dissolving just spreads the particles between the water particles.', 'So it still reads <b>210 g</b>.'],
        finalAnswer: '210 g — the mass does not change',
      };
    },
    () => {
      const opt = choice('Use a magnet to lift out the iron, then sieve the sand from the pebbles', [
        'Filter the whole lot, then evaporate it',
        'Distil the mixture',
        'Use chromatography on it',
      ], 4);
      return {
        prompt: 'Harper is given a dry mixture of <b>iron filings, sand and small pebbles</b>. How can she separate all three?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Two steps: which one has a special property nothing else has?',
        working: [
          '<b>Picture:</b> a magnet in one hand, a sieve in the other.',
          '1. Only the iron is <b>magnetic</b> → take it out with a magnet first.',
          '2. Sand and pebbles are different <b>sizes</b> → sieve them.',
        ],
        finalAnswer: 'Magnet for the iron, then sieve the sand from the pebbles',
      };
    },
    () => {
      const opt = choice('Only one — the dye is a single pure colour', ['Three', 'None — pure dyes do not move', 'It is impossible to tell'], 4);
      return {
        visual: chromSvg([1]),
        prompt: 'Harper tests a green marker and gets this chromatogram. How many dyes are in the marker?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Count the separate spots.',
        working: ['<b>Picture:</b> one spot walks up the paper — and stays one spot.', '1. Count the spots above the start line: just one.', '2. One spot means only one dye.', 'Answer: <b>one — it is a pure dye</b>.'],
        finalAnswer: 'One — it is a single pure dye',
      };
    },
    () => {
      const opt = choice('Filtration — the leaves are insoluble bits, the dissolved flavour goes through', [
        'Evaporation — to boil the tea away',
        'Distillation — to collect the tea leaves',
        'Chromatography — to split the tea into colours',
      ], 4);
      return {
        visual: filtrationSvg(),
        prompt: 'A tea strainer holds the leaves back but lets the brown tea through. Which separating technique is a tea strainer doing?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'What are the leaves called in this apparatus? What is the tea called?',
        working: ['<b>Picture:</b> the strainer catches the pasta, the water goes through.', '1. The leaves are insoluble → they are the <b>residue</b>.', '2. The brown liquid is the <b>filtrate</b>.', 'That is <b>filtration</b>.'],
        finalAnswer: 'Filtration',
      };
    },
    () => {
      const opt = choice('Stir it, warm it, and crush the solid into smaller pieces', ['Cool it down and leave it still', 'Add more solid at once', 'Filter it first'], 4);
      return {
        prompt: 'Harper wants sugar to dissolve <b>faster</b> in her drink. Name three things she could do.',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Anything that gets water particles bumping into more of the solid, more often.',
        working: [
          '<b>Picture:</b> sugar vanishing in hot tea vs sitting in cold water.',
          '1. <b>Stir</b> — brings fresh water to the solid.',
          '2. <b>Warm it</b> — faster particles collide more.',
          '3. <b>Crush it</b> — smaller pieces have more surface touching the water.',
        ],
        finalAnswer: 'Stir it, warm it, and use smaller pieces',
      };
    },
  ];

  HL.registerTopic({
    id: 'mixtures', subject: 'science', strand: 'material', order: 3,
    name: 'Mixtures & separating them', short: 'Mixtures', animal: 'bee',
    blurb: 'Pure or mixed? Dissolving, solutions, and how to get the parts back out again.',
    example: 'sand + water → filter · salt water → evaporate',
    learn: {
      what: '<p>A <b>pure substance</b> has only one thing in it. A <b>mixture</b> has two or more substances jumbled together but <b>not joined</b>, so each one keeps its own properties — and that is exactly why you can separate them again. When a solid <b>dissolves</b> in a liquid you get a <b>solution</b>.</p><p><b>Picture for this topic:</b> the <b>kitchen</b>. A strainer (filtration), a hot pan (evaporation), a kettle with a cold lid (distillation), a sieve, a magnet and a strip of paper — you just have to pick the right tool.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Solute</b> = the solid that dissolves · <b>solvent</b> = the liquid · <b>solution</b> = the two together',
        '<b>Soluble</b> = it dissolves. <b>Insoluble</b> = it does not (so you can filter it out)',
        '<b>Saturated</b> = so full that no more will dissolve',
        '<b>Filtration:</b> insoluble solid out of a liquid. Solid = <b>residue</b>, liquid = <b>filtrate</b>',
        '<b>Evaporation</b> keeps the <b>solid</b>. <b>Distillation</b> keeps the <b>liquid</b>',
        '<b>Chromatography</b> splits up dyes · <b>magnet</b> for iron · <b>sieve</b> for different sizes · <b>decant</b> for a settled solid or two layers',
      ],
      steps: [
        'First ask: "<b>has it dissolved?</b>" If it has dissolved, filtering will never work — the particles are far too small for the paper.',
        'Then ask: "<b>which part do I want to keep?</b>" The solid → <b>evaporate</b>. The liquid → <b>distil</b>.',
        'Look for a property only one of them has: magnetic → <b>magnet</b>. Different sizes → <b>sieve</b>. Settled or floating layer → <b>decant</b>. Coloured dyes → <b>chromatography</b>.',
        'Some mixtures need <b>two steps</b>. Do the undissolved bits first (filter), then deal with what is dissolved (evaporate).',
        'Remember: separating is only ever <b>physical</b> — no new substance is made, so you always get the originals back.',
      ],
      examples: [
        {
          q: 'Sugar is stirred into water. Name the solute, the solvent and the solution.',
          working: ['<b>Picture:</b> stirring cordial into a glass of water.', '1. What disappeared into the liquid? The <b>sugar</b> → the solute.', '2. What did the dissolving? The <b>water</b> → the solvent.', '3. What you end up with is the <b>solution</b>.'],
          a: 'Solute = sugar, solvent = water, solution = sugar water',
        },
        {
          q: 'How would you separate sand from water — and what are the two parts called?',
          visual: filtrationSvg(),
          working: ['<b>Picture:</b> a strainer over a bowl of pasta.', '1. Is sand soluble? <b>No</b> — so filtration will work.', '2. The sand is trapped in the paper: the <b>residue</b>.', '3. The water runs through: the <b>filtrate</b>.'],
          a: 'Filtration — sand is the residue, water is the filtrate',
        },
        {
          q: 'Harper pours salt water through filter paper to get the salt out. Why does it fail?',
          working: ['<b>Picture:</b> a strainer catches pasta but never the water.', '1. Has the salt dissolved? <b>Yes.</b>', '2. Dissolved particles are far too small to be trapped by the paper.', '3. To get salt back, <b>evaporate</b> the water instead.'],
          a: 'The dissolved salt goes straight through — she needs evaporation',
        },
        {
          q: 'How do you get pure drinking water out of sea water?',
          visual: distillationSvg(),
          working: [
            '<b>Picture:</b> a kettle with a cold lid held over it — the drips that fall off are pure.',
            '1. Which part do you want here? The <b>water</b>, not the salt.',
            '2. Boil the sea water: only the water turns to vapour.',
            '3. Cool the vapour in the condenser so it <b>condenses</b> back to a liquid and drips into the beaker.',
            '4. The salt stays behind in the flask.',
          ],
          a: 'Distillation — boil the water off, then cool it back to a liquid and collect it',
        },
        {
          q: 'A chromatogram of a black felt pen looks like this. What does it tell you?',
          visual: chromSvg([0, 1, 2]),
          working: ['<b>Picture:</b> one spot of ink races up the paper and splits into its colours.', '1. Count the separate spots: <b>3</b>.', '2. Each spot is one dye, so the ink is a <b>mixture</b> of 3 dyes.', '3. The highest spot is the most soluble one — it got carried furthest.'],
          a: 'The black ink is a mixture of 3 different dyes',
        },
        {
          q: 'The table says 36 g of salt dissolves in 100 g of water. How much dissolves in 250 g of water?',
          visual: `<table class="data"><tr><th>substance</th><th>g per 100 g water</th></tr><tr><td>table salt</td><td>36 g</td></tr><tr><td>sugar</td><td>204 g</td></tr><tr><td>baking soda</td><td>10 g</td></tr></table>`,
          working: ['<b>Picture:</b> a recipe — 2½ times the water, 2½ times the salt.', '1. 250 ÷ 100 = <b>2.5</b>', '2. 36 × 2.5 = <b>90</b>'],
          a: '90 g',
        },
        {
          q: 'EXPERIMENT: Harper is given a dry mixture of sand, salt and iron filings, and must end up with all three separately. Plan it.',
          working: [
            '<b>Picture:</b> magnet → jug of water → strainer → hot pan.',
            '1. Only the iron is <b>magnetic</b> → lift it out with a magnet first (do this while it is dry).',
            '2. Add water and stir: the <b>salt dissolves</b>, the sand does not.',
            '3. <b>Filter</b>: sand is the residue, salt water is the filtrate.',
            '4. <b>Evaporate</b> the filtrate: the salt is left in the dish.',
          ],
          a: 'Magnet → dissolve in water → filter (sand) → evaporate (salt)',
        },
      ],
      tips: [
        'Filtering never separates a <b>dissolved</b> solid — the particles slip straight through the paper. Dissolved means "evaporate or distil".',
        '<b>Evaporation keeps the solid, distillation keeps the liquid.</b> Ask which one you are being asked for.',
        'In chromatography the start line must be in <b>pencil</b> and must sit <b>above</b> the solvent, or the dyes just wash off.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[1], WORD[4], WORD[8], WORD[9], WORD[5]])(level);
        if (level === 2) return R.pick(WORD)(level);
        return R.pick([WORD[0], WORD[2], WORD[3], WORD[6], WORD[7], WORD[10], WORD[5]])(level);
      }
      const pool = level === 1
        ? [whichMethod, methodUse, vocabQ, pureOrMixture, soluteSolvent]
        : level === 2
          ? [whichMethod, methodUse, methodHow, vocabQ, pureOrMixture, soluteSolvent, filterDiagram, chromQ, saturatedQ, solubilityCompare]
          : [whichMethod, filterFails, distilDiagram, chromQ, solubilityCalc, solubilityCompare, saturatedQ, filterDiagram, methodHow];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
