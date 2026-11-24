/* Topic: Stars (Ngā Whetū) and the life cycle of a star — what a star is, colour and temperature,
 * the Sun, nuclear fusion, how stars are born and die, supernovae and stardust, how the Solar System formed.
 * Year 8 Cosmology LO7 + LO8 (workbook) / notes LO4. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const SMALL = ['Nebula (cloud of hydrogen gas and dust)', 'Gravity pulls the gas into a clump', 'Clump heats up and fusion starts — a star is born', 'Main sequence star like the Sun (shines for about 10 billion years)', 'Red giant', 'White dwarf (then slowly fades)'];
  const BIG = ['Nebula (cloud of hydrogen gas and dust)', 'Gravity pulls the gas into a clump', 'Clump heats up and fusion starts — a star is born', 'Massive star (burns its fuel faster)', 'Red supergiant', 'Supernova explosion', 'Neutron star or black hole'];
  const visual = `<svg viewBox="0 0 340 170" width="340" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="9" font-weight="700">
    <rect x="2" y="2" width="336" height="166" rx="12" fill="#14213D"/>
    <ellipse cx="34" cy="85" rx="24" ry="16" fill="#C9B8F0" opacity=".6"/><text x="34" y="112" text-anchor="middle" fill="#FFFFFF">nebula</text>
    <circle cx="88" cy="85" r="10" fill="#F6C343"/><text x="88" y="112" text-anchor="middle" fill="#FFFFFF">star born</text>
    <path d="M58 85 H76 M100 80 L130 50 M100 90 L130 120" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="215" y="24" text-anchor="middle" fill="#FFF1C9">star like the Sun</text>
    <circle cx="150" cy="45" r="9" fill="#F6C343"/><circle cx="205" cy="45" r="16" fill="#E0568C"/><circle cx="262" cy="45" r="5" fill="#FFFFFF"/>
    <text x="150" y="70" text-anchor="middle" fill="#FFFFFF">Sun-like</text><text x="205" y="70" text-anchor="middle" fill="#FFFFFF">red giant</text><text x="262" y="70" text-anchor="middle" fill="#FFFFFF">white dwarf</text>
    <text x="215" y="100" text-anchor="middle" fill="#A9D8F5">much bigger star</text>
    <circle cx="150" cy="128" r="12" fill="#A9D8F5"/><circle cx="205" cy="128" r="20" fill="#E0568C"/>
    <path d="M250 128 l8 -14 l4 12 l12 -6 l-6 12 l12 4 l-14 4 l4 12 l-10 -8 l-8 10 l0 -12 l-12 -2 z" fill="#F6C343"/>
    <circle cx="310" cy="128" r="7" fill="#000000" stroke="#FFFFFF"/>
    <text x="150" y="158" text-anchor="middle" fill="#FFFFFF">massive</text><text x="205" y="158" text-anchor="middle" fill="#FFFFFF">supergiant</text><text x="262" y="158" text-anchor="middle" fill="#FFFFFF">supernova</text><text x="310" y="158" text-anchor="middle" fill="#FFFFFF">black hole</text>
  </svg>`;

  const mcq = [
    { p: 'What is a <b>star</b>?', a: 'A huge ball of hot, glowing gas (mostly hydrogen) held together by gravity, that makes its own light and heat', w: ['A rocky ball that reflects sunlight', 'A hole in the sky', 'A small planet far away'], short: 'a ball of gas', accept: ['ball of gas', 'a ball of hot gas', 'ball of hot gas', 'a huge ball of gas', 'a huge ball of hot gas', 'burning gas', 'a ball of burning gas', 'hot gas'], why: 'Stars are huge balls of hot gas, mostly hydrogen, held together by gravity.' },
    { p: 'What are stars mostly made of?', a: 'Hydrogen', w: ['Iron', 'Oxygen', 'Rock'], short: 'hydrogen', accept: ['hydrogen gas', 'hydrogen and helium'], why: 'Mostly hydrogen, with helium.' },
    { p: 'What do stars produce?', a: 'Light and heat (energy)', w: ['Water and oxygen', 'Only sound', 'Nothing — they reflect light'], short: 'light and heat', accept: ['heat and light', 'light', 'energy', 'heat', 'light and heat energy'], why: 'Nuclear fusion in the core releases huge amounts of energy as light and heat.' },
    { p: 'What process makes a star shine?', a: 'Nuclear fusion — hydrogen atoms join to make helium and release energy', w: ['Burning like a wood fire', 'Reflecting light from the Moon', 'Chemical batteries'], short: 'nuclear fusion', accept: ['fusion', 'nuclear fusion of hydrogen'], why: 'Squashed, extremely hot hydrogen atoms fuse into helium, releasing energy.' },
    { p: 'In nuclear fusion in a star, hydrogen atoms join together to make…', a: 'helium', w: ['oxygen', 'water', 'carbon dioxide'], short: 'helium', why: 'Hydrogen + hydrogen → helium + energy.' },
    { p: 'What decides a star\'s colour?', a: 'Its temperature', w: ['Its distance from Earth', 'Its age only', 'The colour of its planets'], short: 'temperature', accept: ['its temperature', 'how hot it is', 'heat'], why: 'Red = coolest, yellow = in-between (like the Sun), blue = hottest.' },
    { p: 'Which colour of star is the <b>hottest</b>?', a: 'Blue', w: ['Red', 'Yellow', 'Orange'], short: 'blue', accept: ['blue-white', 'blue white'], why: 'Blue stars are hottest; red stars are coolest.' },
    { p: 'Which colour of star is the <b>coolest</b>?', a: 'Red', w: ['Blue', 'White', 'Yellow'], short: 'red', why: 'Red stars are the coolest.' },
    { p: 'What colour is our Sun, and what does that tell us?', a: 'Yellow — it is an in-between temperature', w: ['Blue — it is one of the hottest stars', 'Red — it is one of the coolest stars', 'White — it is a white dwarf'], why: 'The Sun is a typical, medium (G-type) yellow star.' },
    { p: 'What is the Sun\'s surface temperature?', a: 'About 6000 °C', w: ['About 100 °C', 'About 15 million °C', 'About −270 °C'], why: 'Surface ≈ 6000 °C; the core ≈ 15 million °C.' },
    { p: 'How wide is the Sun?', a: 'About 1.4 million km — 109 times the Earth\'s diameter', w: ['About 1400 km', 'About twice the Earth', 'About 150 million km'], why: 'Diameter ≈ 1.4 million km = 109 Earths.' },
    { p: 'Why should you never look directly at the Sun?', a: 'Its light is so strong it can permanently damage your eyes', w: ['It makes you sneeze forever', 'It is rude', 'It makes the Sun dimmer'], why: 'Even a few seconds can burn the retina and cause permanent damage.' },
    { p: 'Where do new stars form?', a: 'In huge clouds of gas and dust (nebulae), when gravity pulls the gas together', w: ['Inside planets', 'In black holes', 'On the Moon'], short: 'a nebula', accept: ['nebula', 'nebulae', 'gas clouds', 'clouds of gas', 'in a nebula', 'clouds of gas and dust', 'a cloud of gas'], why: 'Gravity clumps hydrogen in a nebula; it gets squashed and hot until fusion starts.' },
    { p: 'What happens to a star like the Sun when it runs out of hydrogen fuel (after about 10 billion years)?', a: 'It swells into a red giant, then shrinks to a white dwarf', w: ['It explodes as a supernova', 'It becomes a black hole', 'It turns into a planet'], why: 'Sun-sized stars die quietly: red giant → white dwarf (which slowly cools and fades).' },
    { p: 'What happens when a very big star dies?', a: 'It explodes in a supernova', w: ['It fades quietly into a white dwarf', 'It turns into a nebula straight away', 'It becomes a moon'], short: 'supernova', accept: ['a supernova', 'it explodes', 'explodes', 'supernova explosion', 'it becomes a supernova'], why: 'Big stars explode as a supernova, brighter than 100 million stars for a few seconds.' },
    { p: 'After a supernova, what can be left behind?', a: 'A neutron star or a black hole', w: ['A white dwarf and a red giant', 'A new Sun', 'Nothing at all'], why: 'The leftover core collapses into a super-dense neutron star — or, for the biggest stars, a black hole.' },
    { p: 'Before they die, older stars make bigger atoms. Which?', a: 'Carbon, nitrogen and oxygen', w: ['Only hydrogen', 'Plastic and glass', 'Water and salt'], why: 'Once hydrogen runs low, stars fuse heavier atoms like carbon, nitrogen and oxygen.' },
    { p: 'Your hand is made of atoms like carbon, oxygen and nitrogen. Where were these atoms made?', a: 'Inside stars that then exploded', w: ['In the Big Bang only', 'In your stomach', 'In the Earth\'s core'], short: 'in stars', accept: ['stars', 'inside stars', 'in a star', 'exploding stars', 'in exploded stars', 'supernovas', 'supernova'], why: 'We are made of stardust: atoms made in stars, flung out by supernovae, which ended up on Earth and in our food.' },
    { p: 'About how long ago did the Solar System form?', a: 'About 4.6 billion years ago', w: ['About 14 billion years ago', 'About 4600 years ago', 'About 46 million years ago'], why: 'From a spinning cloud of gas and dust left over from earlier stars (your notes round it to 5 billion).' },
    { p: 'How did the Solar System form?', a: 'A cloud of gas and dust collapsed; the middle became the Sun and leftover material clumped into planets', w: ['The Earth exploded into pieces', 'The planets were captured from other galaxies', 'It has always been here'], why: 'Gravity pulled the cloud in. Most went into the Sun; the leftover disc clumped into planets.' },
    { p: 'People used to think stars were "eternal". What do we know now?', a: 'Stars are born, live their lives, grow old and die', w: ['Stars really do last forever', 'Stars only last a few years', 'Stars turn into planets'], why: 'Stars have life cycles; how they live depends on their size.' },
    { p: 'Which stars live longest?', a: 'Smaller stars — they use their fuel slowly', w: ['The biggest stars', 'Blue stars', 'Stars in black holes'], why: 'Big stars burn their fuel fast and die young, often in a supernova.' },
  ];
  const tf = [
    { s: 'The Sun is a star.', t: true, why: 'A typical, medium-sized yellow star.' },
    { s: 'Stars burn like a giant bonfire.', t: false, why: 'They shine by nuclear <b>fusion</b>, not ordinary burning.' },
    { s: 'Red stars are hotter than blue stars.', t: false, why: 'Blue is hottest, red is coolest.' },
    { s: 'The Sun will explode as a supernova.', t: false, why: 'It is too small. It will become a red giant, then a white dwarf.' },
    { s: 'We are made of stardust.', t: true, why: 'Our atoms were made in stars and spread by supernovae.' },
    { s: 'All stars are the same size and temperature.', t: false, why: 'Size, temperature, brightness and colour vary a lot.' },
    { s: 'Sirius looks brighter than other stars partly because it gives out about 20 times more light than the Sun.', t: true, why: 'And it is fairly close — 8.7 light years.' },
    { s: 'A white dwarf is the hot, dense core left behind by a Sun-like star.', t: true, why: 'It slowly cools and fades.' },
  ];
  const groups = [
    { label: 'a stage in the life of a star like the Sun', items: ['nebula', 'main sequence star', 'red giant', 'white dwarf'] },
    { label: 'a stage only a very massive star reaches', items: ['red supergiant', 'supernova', 'neutron star', 'black hole'] },
  ];
  function cycleQ(level) {
    const big = R.chance(0.5);
    const S = big ? BIG : SMALL;
    const k = R.int(2, S.length - 2);
    return {
      prompt: `In the life cycle of ${big ? 'a <b>very massive</b> star' : 'a star <b>like the Sun</b>'}, what comes straight after: "${S[k]}"?`,
      answer: K.choice(S[k + 1], SMALL.concat(BIG).filter((x) => x !== S[k]).filter((x, i, a) => a.indexOf(x) === i), level === 1 ? 3 : 4),
      hint: big ? 'Massive: … → red supergiant → supernova → neutron star or black hole.' : 'Sun-like: … → red giant → white dwarf.',
      working: S.map((x, i) => `${i + 1}. ${x}`),
      finalAnswer: S[k + 1], skill: 'space-stars-cycle',
    };
  }
  function colourQ(level) {
    const stars = [['blue', 'hottest'], ['white', 'very hot'], ['yellow', 'in-between, like the Sun'], ['orange', 'cooler'], ['red', 'coolest']];
    const [a, b] = R.sample(stars, 2);
    const hot = stars.indexOf(a) < stars.indexOf(b) ? a : b;
    return {
      prompt: `Which star is <b>hotter</b>: a ${a[0]} star or a ${b[0]} star?`,
      answer: K.fixed([a[0].charAt(0).toUpperCase() + a[0].slice(1) + ' star', b[0].charAt(0).toUpperCase() + b[0].slice(1) + ' star'], hot[0].charAt(0).toUpperCase() + hot[0].slice(1) + ' star'),
      hint: 'Like a flame or a stove element: red = cooler, blue = hottest.',
      working: ['Hottest → coolest: blue, white, yellow, orange, red.', `So the <b>${hot[0]}</b> star is hotter.`],
      finalAnswer: hot[0], skill: 'space-stars-colour',
    };
  }
  function sunMathsQ(level) {
    const form = R.int(1, 2);
    if (form === 1) {
      const n = R.pick([2, 3, 5, 10]);
      return {
        prompt: `The Sun is about 109 Earths wide. If you lined up <b>${n} Suns</b>, how many Earths wide would that be?`,
        answer: K.num(109 * n), hint: 'Multiply by 109.', working: [`109 × ${n} = <b>${109 * n}</b>.`], finalAnswer: String(109 * n), skill: 'space-stars-sun',
      };
    }
    const age = R.pick([4.6, 5]);
    return {
      prompt: `A Sun-like star shines for about <b>10 billion years</b>. The Sun is about <b>${age} billion years</b> old. About how many billion years does it have left?`,
      answer: K.num(Math.round((10 - age) * 10) / 10, 'billion years', 0.01), hint: '10 − its age.',
      working: [`10 − ${age} = <b>${Math.round((10 - age) * 10) / 10}</b> billion years.`, 'Plenty of time!'], finalAnswer: `${Math.round((10 - age) * 10) / 10} billion years`, skill: 'space-stars-sun',
    };
  }
  const word = [
    (level) => ({
      prompt: 'A scientist says "you are made of stardust". What does she mean?',
      answer: K.choice('The atoms in your body were made inside stars that exploded long ago', ['You are covered in dust from space', 'Your body glows at night', 'You were born on a star'], level === 1 ? 3 : 4),
      hint: 'Where were carbon, oxygen and nitrogen made?', working: ['Heavier atoms are made by fusion inside stars.', 'Supernovae flung them into space; they became part of Earth and, through food, part of you.'],
      finalAnswer: 'Our atoms were made in stars', skill: 'space-stars-apply',
    }),
    (level) => ({
      prompt: 'An astronomer sees a cloud of gas slowly getting smaller and hotter in the middle. What is probably happening?',
      answer: K.choice('A new star is forming — gravity is squashing the gas until fusion can start', ['A star is dying', 'A black hole is evaporating', 'A planet is melting'], level === 1 ? 3 : 4),
      hint: 'Nebula + gravity → …', working: ['Gravity pulls the gas together.', 'Squashed gas gets hotter until hydrogen fuses — a star is born.'],
      finalAnswer: 'A star is forming', skill: 'space-stars-apply',
    }),
    (level) => ({
      prompt: 'Two stars are the same distance from us. One looks red and one looks blue. What can you say?',
      answer: K.choice('The blue star is hotter than the red star', ['The red star is hotter', 'They are the same temperature', 'The blue one is a planet'], level === 1 ? 3 : 4),
      hint: 'Colour tells you temperature.', working: ['Colour depends on temperature.', 'Blue = hottest, red = coolest.'],
      finalAnswer: 'The blue star is hotter', skill: 'space-stars-apply',
    }),
  ];

  K.topic({
    id: 'space-stars', strand: 'earth', order: 0.17,
    name: 'Stars (Ngā Whetū) & their life cycle', short: 'Stars', animal: 'owl',
    blurb: 'What stars are, why they shine, their colours, and how they are born and die.',
    example: 'Sun-like star: nebula → star → red giant → white dwarf',
    hint: 'Gas + gravity → fusion → star. Small stars: red giant → white dwarf. Big stars: supernova → neutron star or black hole.',
    learn: {
      what: '<p><b>Stars</b> are huge balls of hot gas, mostly <b>hydrogen</b>, held together by <b>gravity</b>. They shine because of <b>nuclear fusion</b>: hydrogen atoms join to make helium, releasing energy as light and heat. Stars are not eternal — they are born, live and die, and <b>how</b> depends on their size.</p>',
      visual,
      facts: [
        '<b>Colour = temperature:</b> red (coolest) → orange → yellow (the Sun, in-between) → white → blue (hottest).',
        '<b>The Sun:</b> a typical medium yellow star. Diameter 1.4 million km (109 Earths). Surface about 6000 °C; core about 15 million °C. Never look directly at it.',
        'Proxima Centauri is the next closest star (4.27 light years). Sirius is the brightest in the night sky (about 20 times brighter than the Sun).',
        '<b>Birth:</b> a cloud of hydrogen (a <b>nebula</b>) → gravity clumps it → it gets squashed and very hot → hydrogen fuses into helium → a star is born.',
        '<b>Sun-sized star:</b> shines about 10 billion years → runs out of hydrogen → makes bigger atoms (carbon, nitrogen, oxygen) → <b>red giant</b> → <b>white dwarf</b>.',
        '<b>Much bigger star:</b> → red supergiant → explodes as a <b>supernova</b> (brighter than 100 million stars for a few seconds) → <b>neutron star</b> or <b>black hole</b>.',
        'Supernovae fling the atoms made in the star into space; some clump into new planets. <b>We are made of stardust.</b>',
        'The <b>Solar System</b> formed about 4.6 billion years ago from a collapsing cloud of gas and dust: the middle became the Sun, leftovers became planets.',
      ],
      steps: [
        'Define a star: hot gas (hydrogen), gravity, makes its own light by fusion.',
        'Life cycle: start with the nebula, then split by size — Sun-like vs massive.',
        'Link colour to temperature in every colour question.',
      ],
      examples: [
        { q: 'What are stars made of and what do they produce?', working: ['Mostly hydrogen gas (some helium).', 'They produce light and heat by nuclear fusion.'], a: 'Hydrogen · light and heat' },
        { q: 'Describe the life cycle of a star like the Sun.', working: ['Nebula → gravity pulls gas together → fusion starts.', 'Main-sequence star for ~10 billion years.', 'Red giant → white dwarf.'], a: 'Nebula → star → red giant → white dwarf' },
        { q: 'What happens when a massive star dies?', working: ['It swells into a red supergiant.', 'It explodes in a supernova.', 'It leaves a neutron star or a black hole.'], a: 'Supernova → neutron star or black hole' },
        { q: 'Where were the atoms in your hand made?', working: ['Inside stars, by fusion.', 'Supernovae spread them; they became part of Earth and your food.'], a: 'Inside stars — we are stardust' },
        { q: 'What do you think would happen to Earth\'s water if we were closer to the Sun? Further away?', working: ['Closer: hotter → water boils into vapour.', 'Further: colder → water freezes into ice.', 'We are in the "Goldilocks zone".'], a: 'Closer: boils · further: freezes' },
        { q: 'Why is a blue star hotter than a red star?', working: ['A star\'s colour is set by its temperature.', 'Blue = hottest, red = coolest.'], a: 'Colour shows temperature' },
      ],
      tips: [
        'Fusion (joining atoms) — not burning.',
        'Only <b>massive</b> stars go supernova. The Sun will become a white dwarf.',
        'Red = cool, blue = hot (the opposite of taps!).',
      ],
    },
    mcq, tf, groups, calc: [cycleQ, cycleQ, colourQ, sunMathsQ], word,
  });
})(window.HL);
