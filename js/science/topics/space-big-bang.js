/* Topic: The Big Bang — Lemaître's idea, the Doppler shift, Hubble's evidence, the balloon model,
 * the sequence of events, and creation stories from other cultures.
 * Year 8 Cosmology LO3 (describe the Big Bang Theory and give evidence) / notes LO7. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const balloon = (big) => {
    const s = big ? 1.5 : 1;
    const dots = [[-20, -14], [16, -18], [-6, 12], [22, 10], [-26, 18]];
    return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
      <ellipse cx="80" cy="74" rx="${40 * s}" ry="${44 * s}" fill="#F7D3E2" stroke="#E0568C" stroke-width="2"/>
      ${dots.map(([x, y]) => `<circle cx="${80 + x * s}" cy="${74 + y * s}" r="4" fill="${INK}"/>`).join('')}
      <path d="M80 ${74 + 44 * s} l-5 8 h10 z" fill="#E0568C"/>
      <text x="80" y="156" text-anchor="middle" fill="${INK}">${big ? 'blown up: every dot further apart' : 'small balloon: dots = galaxies'}</text>
    </svg>`;
  };
  const visual = `<svg viewBox="0 0 340 120" width="340" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="116" rx="12" fill="#14213D"/>
    <circle cx="26" cy="60" r="5" fill="#FFF1C9"/>
    <path d="M30 60 C 90 10, 90 110, 150 60 S 250 0, 330 60" fill="none" stroke="#F6C343" stroke-width="2" opacity=".3"/>
    ${['tiny, dense, hot point', 'expands & cools', 'atoms form: H, He', 'gravity clumps gas', 'first stars & galaxies'].map((t, i) => `<text x="${26 + i * 72}" y="${i % 2 ? 98 : 30}" text-anchor="${i ? 'middle' : 'start'}" fill="#FFFFFF">${t}</text>`).join('')}
    ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${26 + i * 72}" cy="60" r="${4 + i * 3}" fill="${['#FFF1C9', '#F6C343', '#A9D8F5', '#8FA8C8', '#E7E2D6'][i]}"/>`).join('')}
    <text x="320" y="114" text-anchor="end" fill="#A9D8F5" font-size="9">about 13.8 billion years</text>
  </svg>`;

  const mcq = [
    { p: 'What does the Big Bang Theory say?', a: 'The whole universe began as a tiny, extremely hot and dense point that suddenly started expanding', w: ['The universe has always existed and never changes', 'The Earth exploded and made the stars', 'A star exploded and made the Solar System'], why: 'Everything was compressed into a tiny, dense point, then began to expand about 13.8 billion years ago (your notes say 13.5).' },
    { p: 'Who first came up with the idea that the universe began from a tiny object?', a: 'Georges Lemaître, a priest', w: ['Isaac Newton', 'Galileo', 'Copernicus'], short: 'lemaitre', accept: ['georges lemaitre', 'lemaître', 'georges lemaître', 'le maitre', 'lemaitre'], why: 'Lemaître proposed it in the 1920s. Like Copernicus, he was unknown, so at first nobody listened.' },
    { p: 'Whose measurements showed that the galaxies are moving away from us?', a: 'Edwin Hubble', w: ['Galileo', 'Lemaître', 'Newton'], short: 'hubble', accept: ['edwin hubble'], why: 'Hubble analysed the light from galaxies (the Hubble telescope is named after him).' },
    { p: 'About how long ago did the Big Bang happen?', a: 'About 14 billion years ago', w: ['About 14 thousand years ago', 'About 14 million years ago', 'About 4.6 billion years ago'], why: 'About 13.8 billion years — usually rounded to 14 billion (your notes say 13.5 billion). 4.6 billion is the age of the Earth.' },
    { p: 'What was the universe like just after the Big Bang?', a: 'Incredibly hot and dense', w: ['Cold and empty', 'Full of planets', 'The same as today'], short: 'hot', accept: ['hot and dense', 'very hot', 'dense', 'extremely hot', 'incredibly hot'], why: 'The baby universe was incredibly hot (millions of degrees) and dense.' },
    { p: 'As the universe expanded, what happened to its temperature?', a: 'It cooled down', w: ['It got hotter', 'It stayed the same', 'It froze instantly'], short: 'it cooled', accept: ['cooled', 'cooled down', 'it cooled down', 'got colder', 'colder'], why: 'Expanding → cooling → atoms could form.' },
    { p: 'What were the first atoms to form as the universe cooled?', a: 'Mainly hydrogen, with a bit of helium', w: ['Iron and gold', 'Carbon and oxygen', 'Mainly water'], short: 'hydrogen', accept: ['hydrogen and helium', 'helium', 'hydrogen helium', 'h'], why: 'The first atoms were the simplest ones: hydrogen (most) and helium.' },
    { p: 'How did the first stars form after the Big Bang?', a: 'Gravity pulled clouds of hydrogen together until they clumped into stars', w: ['Galaxies crashed together', 'The Sun split into pieces', 'Black holes spat them out'], short: 'gravity', accept: ['by gravity', 'gravity pulled hydrogen together', 'hydrogen clumped together', 'clumping'], why: 'After a few million years, gravity made hydrogen clouds clump together and become stars.' },
    { p: 'What is the <b>Doppler shift</b> with sound?', a: 'A sound gets higher in pitch as the source comes towards you and lower as it moves away', w: ['A sound gets louder when it is hot', 'Sound travels faster than light', 'A sound always stays the same pitch'], why: 'Like a motorbike going past: "neeeeow" — high pitch coming, low pitch going.' },
    { p: 'Light from a star moving <b>away</b> from us has…', a: 'a lower frequency than normal (shifted towards red)', w: ['a higher frequency than normal (shifted towards blue)', 'no change at all', 'no light at all'], short: 'lower frequency', accept: ['a lower frequency', 'red shift', 'redshift', 'redshifted', 'red-shifted', 'lower', 'lower frequency than normal'], why: 'Moving away → lower frequency → <b>redshift</b>. Moving towards → higher frequency → blueshift.' },
    { p: 'Light from a star moving <b>towards</b> us has…', a: 'a higher frequency than normal (shifted towards blue)', w: ['a lower frequency than normal (shifted towards red)', 'no change at all', 'no colour'], short: 'higher frequency', accept: ['a higher frequency', 'blue shift', 'blueshift', 'higher', 'blue-shifted', 'higher frequency than normal'], why: 'Coming towards → squashed waves → higher frequency (blueshift).' },
    { p: 'What did Hubble find when he looked at the light from other galaxies?', a: 'It was shifted to lower frequencies (red) — the galaxies are all moving away from us', w: ['It was blue — galaxies are rushing towards us', 'It did not change — galaxies are still', 'There was no light at all'], why: 'Redshifted light everywhere → galaxies moving apart → the universe is expanding.' },
    { p: 'Why does "all the galaxies moving apart" support the Big Bang?', a: 'If they are all moving apart now, they must once have been together at one point', w: ['It proves the universe is shrinking', 'It shows galaxies never move', 'It shows Earth is the centre'], why: 'Run the film backwards: everything comes back together at one starting point — just as Lemaître said.' },
    { p: 'Besides moving galaxies, what is another piece of evidence for the Big Bang?', a: 'The cosmic microwave background — faint leftover heat glow coming from every direction', w: ['Rainbows', 'The Moon\'s craters', 'Earthquakes'], short: 'cosmic microwave background', accept: ['cmb', 'the cosmic microwave background', 'microwave background', 'background radiation', 'cosmic background radiation', 'cosmic microwave background radiation'], why: 'The cosmic microwave background (CMB) is the cooled-down afterglow of the hot early universe. Also: the universe is mostly hydrogen and helium, as predicted.' },
    { p: 'In the balloon model, what do the dots on the balloon represent?', a: 'Galaxies', w: ['Atoms', 'Planets', 'Black holes'], short: 'galaxies', accept: ['galaxy', 'the galaxies'], why: 'As the balloon is blown up, every dot (galaxy) moves away from every other dot.', vis: balloon(false) },
    { p: 'What does the balloon model show about the centre of the universe?', a: 'There is no centre — every galaxy moves away from every other one', w: ['Earth is the centre', 'The Sun is the centre', 'The Milky Way is the centre'], why: 'On a balloon\'s surface no dot is the middle. Everything just gets further apart.', vis: balloon(true) },
    { p: 'What did most people believe before the Big Bang Theory?', a: 'The steady state model — the universe was created and has stayed the same ever since', w: ['The Earth was flat', 'The Moon made the universe', 'The universe is shrinking'], short: 'steady state', accept: ['steady state model', 'the steady state model', 'steady-state'], why: 'They thought the universe would go on forever as it is now.' },
    { p: 'In Māori tradition, how did the world begin?', a: 'Ranginui (Sky Father) and Papatūānuku (Earth Mother) were held tightly together until their children pushed them apart, letting light in', w: ['A giant turtle carried the Earth up from the sea', 'The Sun laid an egg', 'It was always there'], why: 'This is the Māori creation story from your workbook. Other cultures have their own creation stories too.' },
  ];
  const tf = [
    { s: 'The Big Bang was an explosion that happened at one point in space, and we are near the centre.', t: false, why: 'Space itself expanded everywhere at once — there is no centre (balloon model).' },
    { s: 'All galaxies are moving away from each other.', t: true, why: 'That is what the redshifted light shows: the universe is expanding.' },
    { s: 'The first atoms were mostly carbon and oxygen.', t: false, why: 'They were hydrogen (mostly) and helium. Carbon and oxygen were made later inside stars.' },
    { s: 'Light changes frequency when its source moves, just like sound does.', t: true, why: 'That is the Doppler shift — less noticeable for light because light is so fast.' },
    { s: 'The universe has stayed the same size since it began.', t: false, why: 'That is the old steady-state idea. Evidence shows it is expanding.' },
    { s: 'The universe is about 14 billion years old.', t: true, why: 'About 13.8 billion years.' },
    { s: 'Lemaître\'s idea was accepted straight away because it was so strange.', t: false, why: 'He was unknown and the idea seemed bizarre, so at first nobody listened.' },
    { s: 'The universe cooled as it expanded.', t: true, why: 'Cooling let atoms form.' },
  ];
  const groups = [
    { label: 'evidence for the Big Bang', items: ['galaxies\' light is redshifted', 'galaxies are moving apart', 'the cosmic microwave background', 'lots of hydrogen and helium in the universe'] },
    { label: 'a step in the Big Bang story', items: ['everything was in a tiny dense point', 'the universe expanded and cooled', 'hydrogen and helium atoms formed', 'gravity clumped gas into stars'] },
    { label: 'NOT evidence for the Big Bang', distractorOnly: true, items: ['stars twinkle', 'the Moon has phases', 'Mars looks red', 'comets have tails'] },
  ];
  function orderQ(level) {
    const S = ['Tiny, hot, dense point', 'Expands and cools', 'Hydrogen and helium atoms form', 'Gravity clumps gas into stars', 'Galaxies form'];
    const k = R.int(0, S.length - 2);
    const before = R.chance(0.4) && k > 0;
    const target = before ? S[k - 1] : S[k + 1];
    return {
      prompt: `In the Big Bang story, what comes straight <b>${before ? 'before' : 'after'}</b>: "${S[k]}"?`,
      answer: K.choice(target, S.filter((x) => x !== S[k]), level === 1 ? 3 : 4),
      hint: 'Hot → expand and cool → atoms → gravity clumps → stars and galaxies.',
      working: S.map((x, j) => `${j + 1}. ${x}`),
      finalAnswer: target, skill: 'space-big-bang-sequence',
    };
  }
  function dopplerQ(level) {
    const cases = [
      { s: 'An ambulance siren comes <b>towards</b> you', a: 'Higher pitch than normal' },
      { s: 'An ambulance siren drives <b>away</b> from you', a: 'Lower pitch than normal' },
      { s: 'A galaxy is moving <b>away</b> from Earth', a: 'Lower frequency light (redshift)' },
      { s: 'A star is moving <b>towards</b> Earth', a: 'Higher frequency light (blueshift)' },
      { s: 'A motorbike goes <b>past</b> and away', a: 'The pitch drops' },
    ];
    const c = R.pick(cases);
    return {
      prompt: `${c.s}. What do you notice?`,
      answer: K.choice(c.a, cases.map((x) => x.a).concat(['No change']), level === 1 ? 3 : 4),
      hint: 'Coming towards → squashed waves → higher. Going away → stretched waves → lower (red).',
      working: ['Doppler shift: a moving source changes the frequency we receive.', `${c.s.replace(/<\/?b>/g, '')} → <b>${c.a}</b>.`],
      finalAnswer: c.a, skill: 'space-big-bang-doppler',
    };
  }
  function ageQ(level) {
    const born = R.pick([13.8, 13.5]);
    const items = [['the universe', 'about 14 billion years'], ['the Earth', 'about 4.6 billion years'], ['the Solar System', 'about 4.6 billion years']];
    const it = R.pick(items);
    return {
      prompt: `How old is <b>${it[0]}</b>?`,
      answer: K.choice(it[1], ['about 14 billion years', 'about 4.6 billion years', 'about 14 thousand years', 'about 5 million years', 'about 6000 years'], level === 1 ? 3 : 4),
      hint: 'Universe ≈ 14 billion. Earth and Solar System ≈ 4.6 (about 5) billion.',
      working: [`${it[0].charAt(0).toUpperCase() + it[0].slice(1)}: <b>${it[1]}</b>.`, `(The Big Bang was ${born} billion years ago — rounded, 14 billion.)`],
      finalAnswer: it[1], skill: 'space-big-bang-ages',
    };
  }
  const word = [
    (level) => ({
      prompt: 'You stand beside a road and a fire engine races past with its siren on. What do you hear?',
      answer: K.choice('Higher pitch as it comes, then the pitch drops as it goes away', ['Same pitch the whole time', 'Lower pitch as it comes, higher as it goes', 'Silence until it passes'], level === 1 ? 3 : 4),
      hint: 'Doppler shift.', working: ['Coming towards you: sound waves squashed → higher pitch.', 'Going away: waves stretched → lower pitch.'],
      finalAnswer: 'High then low', skill: 'space-big-bang-apply',
    }),
    (level) => ({
      prompt: 'A friend says: "All the galaxies are moving away from us, so we must be at the centre of the universe." What is the best reply?',
      answer: K.choice('No — like dots on a balloon being blown up, every galaxy moves away from every other one, so there is no centre', ['Yes, Earth is at the centre', 'Yes, the Milky Way is at the centre', 'No — the Sun is the centre of the universe'], level === 1 ? 3 : 4),
      hint: 'Think of the balloon model.', working: ['On an expanding balloon every dot sees all the others moving away.', 'So every galaxy would "see" the same thing. There is no centre.'],
      finalAnswer: 'No centre — balloon model', skill: 'space-big-bang-apply', visual: balloon(true),
    }),
    (level) => ({
      prompt: 'An astronomer finds a galaxy whose light is very strongly shifted towards red. What does that tell her?',
      answer: K.choice('The galaxy is moving away from us', ['The galaxy is moving towards us', 'The galaxy is very hot', 'The galaxy is made of red stars only'], level === 1 ? 3 : 4),
      hint: 'Red = lower frequency = …', working: ['Redshift = lower frequency than normal.', 'Lower frequency → moving <b>away</b>.'],
      finalAnswer: 'It is moving away from us', skill: 'space-big-bang-apply',
    }),
    (level) => ({
      prompt: 'If you could play the history of the universe backwards like a film, what would you see the galaxies do?',
      answer: K.choice('Move closer together until everything is squashed into one tiny point', ['Move further apart forever', 'Stay exactly where they are', 'Turn into planets'], level === 1 ? 3 : 4),
      hint: 'Today they are moving apart…', working: ['Forwards: galaxies moving apart.', 'Backwards: they come together → one tiny, hot, dense starting point = the Big Bang.'],
      finalAnswer: 'They come together into one point', skill: 'space-big-bang-apply',
    }),
  ];

  K.topic({
    id: 'space-big-bang', strand: 'earth', order: 0.14,
    name: 'The Big Bang & the Doppler shift', short: 'Big Bang', animal: 'whale',
    blurb: 'How the universe began, why galaxies\' light is redshifted, and the balloon model.',
    example: 'Galaxies\' light is redshifted → they are moving apart',
    hint: 'Hot dense point → expand and cool → atoms (H, He) → gravity → stars. Away = lower frequency = red.',
    learn: {
      what: '<p>The <b>Big Bang Theory</b> says the whole universe started as a tiny, unbelievably dense, extremely hot point, which began to expand about <b>13.8 billion years ago</b> (your notes say 13.5). The main evidence: the light from galaxies is <b>redshifted</b>, so they are all moving apart — the universe is expanding.</p>',
      visual,
      facts: [
        '<b>Lemaître</b> (a priest, 1920s) first suggested the universe began as a tiny object that "exploded" and expanded. He was unknown, so nobody listened at first.',
        '<b>Doppler shift:</b> a motorbike coming towards you sounds <b>higher</b>; going away, <b>lower</b>. Light does the same: moving towards us → higher frequency (<b>blueshift</b>); moving away → lower frequency (<b>redshift</b>).',
        '<b>Hubble</b> found the light from galaxies is redshifted → all galaxies are moving apart → the universe is <b>expanding</b> → they must once have come from one point.',
        'More evidence: the <b>cosmic microwave background</b> (leftover glow of heat from every direction) and a universe made mostly of hydrogen and helium.',
        '<b>The story:</b> 1 tiny, dense, hot point → 2 expands and <b>cools</b> → 3 atoms form, mainly <b>hydrogen</b> with a bit of <b>helium</b> → 4 after a few million years <b>gravity</b> clumps hydrogen clouds → 5 stars and galaxies.',
        '<b>Balloon model:</b> dots = galaxies. Blow up the balloon and every dot moves away from every other dot — <b>there is no centre</b>.',
        'Before this, most people believed the <b>steady state</b> model: the universe was created and never changes.',
        'Other cultures have creation stories, e.g. Māori: <b>Ranginui</b> (Sky Father) and <b>Papatūānuku</b> (Earth Mother) were pushed apart by their children, letting light in.',
      ],
      steps: [
        'Describe: tiny hot dense point → expansion → cooling → hydrogen and helium → gravity → stars.',
        'Give evidence: redshift of galaxies (moving apart) and the cosmic microwave background.',
        'Explain the link: moving apart now → together in the past → one starting point.',
      ],
      examples: [
        { q: 'According to the Big Bang Theory, what was the universe like before it began expanding?', working: ['Everything was compressed into an incredibly small, unbelievably dense point.', 'It was extremely hot.'], a: 'A tiny, extremely hot, dense point' },
        { q: 'What were the first types of atoms to form?', working: ['The universe cooled as it expanded.', 'Simple atoms formed: mostly hydrogen, some helium.'], a: 'Hydrogen and helium' },
        { q: 'How did stars first form?', working: ['Clouds of hydrogen drifted through space.', 'Gravity pulled the atoms together; they clumped, got hot and became stars.'], a: 'Gravity clumped hydrogen clouds together' },
        { q: 'Explain how the Doppler shift gives evidence for the Big Bang.', working: ['Light from a source moving away has a lower frequency (redshift).', 'Hubble found galaxies\' light is redshifted → they are moving away.', 'Moving apart now → they started together at one point.'], a: 'Redshift shows galaxies moving apart, so they started at one point' },
        { q: 'Why is "we are at the centre of the expansion" a misconception?', visual: balloon(true), working: ['Dots on a balloon all move apart as it inflates.', 'No dot is the centre — every galaxy sees the others moving away.'], a: 'Every galaxy moves away from every other — no centre' },
        { q: 'Give another piece of evidence for the Big Bang.', working: ['The cosmic microwave background: a faint glow of leftover heat from every direction in the sky.'], a: 'The cosmic microwave background' },
      ],
      tips: [
        '<b>Red = retreating</b> (moving away). Blue = coming towards.',
        'Universe ≈ 14 billion years old; Earth ≈ 4.6 billion. Don\'t swap them.',
        'It was not an explosion "in" space — space itself expanded.',
        'First atoms = hydrogen and helium. Heavier atoms (carbon, oxygen, iron) were made later inside stars.',
      ],
    },
    mcq, tf, groups, calc: [orderQ, dopplerQ, ageQ], word,
  });
})(window.HL);
