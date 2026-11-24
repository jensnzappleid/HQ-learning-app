/* Topic: Exploring space — telescopes, Hubble and James Webb, probes and rovers, the ISS and living in space.
 * Year 8 Cosmology LO2 (technology used to explore space and how it has changed) and notes LO12 (problems of living in space). */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const visual = `<svg viewBox="0 0 340 150" width="340" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
    <rect x="2" y="2" width="336" height="146" rx="12" fill="#FFFFFF" stroke="#D9BE8A" stroke-width="2"/>
    <text x="170" y="20" text-anchor="middle" fill="${INK}" font-size="12">How we explore space has changed</text>
    ${[['eyes', 'naked eye', 'Greeks'], ['scope', 'telescope', 'Galileo 1610'], ['mount', 'mountain-top', 'big mirrors'], ['space', 'space telescope', 'Hubble 1990'], ['jwst', 'JWST', '2021'], ['rover', 'probes, rovers', 'Voyager, Perseverance']]
      .map(([k, a, b], i) => `<rect x="${10 + i * 54}" y="40" width="50" height="70" rx="8" fill="${['#FDF3E0', '#FCE6EF', '#E4F1FB', '#E3F3D8', '#EDE4F7', '#FFF1C9'][i]}" stroke="#C8B48C"/>
      <text x="${35 + i * 54}" y="70" text-anchor="middle" fill="${INK}" font-size="9">${a}</text>
      <text x="${35 + i * 54}" y="88" text-anchor="middle" fill="#7D7080" font-size="8">${b}</text>`).join('')}
    <path d="M14 125 H326" stroke="${INK}" stroke-width="2" marker-end="url(#ar)"/>
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${INK}"/></marker></defs>
    <text x="170" y="142" text-anchor="middle" fill="#7D7080" font-size="9">older → newer</text>
  </svg>`;

  const mcq = [
    { p: 'What do telescopes use to collect and focus light from space?', a: 'Lenses and mirrors', w: ['Magnets and wires', 'Radio speakers', 'Batteries and bulbs'], short: 'lenses and mirrors', accept: ['mirrors and lenses', 'lenses', 'mirrors', 'lens and mirror'], why: 'Telescopes use lenses and mirrors to focus the light into an image our eyes (or cameras) can pick up.' },
    { p: 'Why do stars appear to <b>twinkle</b>?', a: 'Their light passes through Earth\'s atmosphere, and moving air bends it', w: ['Stars switch on and off', 'Stars are spinning fast', 'The Moon blocks them every second'], short: 'the atmosphere', accept: ['atmosphere', 'air currents', 'moving air', 'the air', 'earth\'s atmosphere'], why: 'Air currents in the atmosphere bend the light, so it wobbles — twinkling.' },
    { p: 'Name the two problems for astronomers using telescopes on Earth.', a: 'Twinkling from the atmosphere, and clouds blocking the view', w: ['The Sun is too far and the Moon is too small', 'Telescopes are too cheap and too light', 'Stars are too bright and too close'], why: 'The atmosphere makes stars twinkle and clouds can block the sky.' },
    { p: 'Why are big telescopes built on high mountains?', a: 'There is less air above to make stars twinkle, and they are often above the clouds', w: ['To be closer to the stars by a lot', 'Because mountains are magnetic', 'So they do not need lenses'], why: 'Less atmosphere = less twinkling; above the clouds = more clear nights.' },
    { p: 'Why does the Hubble Space Telescope get better pictures than telescopes on Earth?', a: 'It is above the atmosphere, so there is no twinkling and no clouds', w: ['It is much closer to the stars', 'It uses a brighter light bulb', 'Space is warmer'], why: 'Out in space there is no air to bend the light and no clouds.' },
    { p: 'What is a disadvantage of having a telescope in space?', a: 'It is very expensive to launch and very hard to repair', w: ['It can only see the Moon', 'It gets cloudy in space', 'It cannot send pictures back'], short: 'expensive to repair', accept: ['hard to repair', 'expensive', 'cost', 'it is expensive', 'difficult to fix', 'hard to fix', 'expensive to fix'], why: 'If it breaks it is very expensive to fix. The space shuttles that fixed Hubble retired in 2011.' },
    { p: 'When was the Hubble Space Telescope launched?', a: '1990', w: ['1610', '1969', '2021'], short: '1990', why: 'Hubble went up in 1990.' },
    { p: 'How did NASA fix Hubble when it broke down in 2021?', a: 'They uploaded a software fix from Earth', w: ['They sent the space shuttle', 'Astronauts walked to it from the ISS', 'They could not fix it'], why: 'No shuttle since 2011, so the 2021 fix was software sent from the ground.' },
    { p: 'What is Hubble\'s replacement, launched on Christmas Day 2021?', a: 'The James Webb Space Telescope', w: ['The International Space Station', 'Voyager', 'The Perseverance rover'], short: 'james webb', accept: ['james webb space telescope', 'jwst', 'the james webb space telescope', 'webb', 'james webb telescope'], why: 'The James Webb Space Telescope (JWST) is already producing even better images than Hubble.' },
    { p: 'Juno is a spacecraft that travels around Jupiter studying it. What type of mission is it?', a: 'A planetary orbiter', w: ['A lander', 'A deep space probe', 'A crewed mission'], short: 'orbiter', accept: ['an orbiter', 'planetary orbiter', 'a planetary orbiter'], why: 'An orbiter goes round a planet. Juno orbits Jupiter.' },
    { p: 'Voyager and New Horizons are examples of…', a: 'deep space probes', w: ['Mars rovers', 'space stations', 'telescopes on mountains'], short: 'probes', accept: ['deep space probes', 'space probes', 'probe', 'a probe'], why: 'Probes fly far out into the Solar System. Voyager has left the Solar System; New Horizons flew past Pluto.' },
    { p: 'Curiosity and Perseverance are…', a: 'rovers that landed on Mars', w: ['telescopes orbiting Earth', 'crewed spacecraft to the Moon', 'probes to Pluto'], short: 'rovers', accept: ['mars rovers', 'landers', 'rover', 'a rover', 'landers on mars'], why: 'Landers/rovers land on a planet\'s surface and drive around doing experiments.' },
    { p: 'Which missions carried people to the Moon?', a: 'Apollo', w: ['Voyager', 'Hubble', 'Curiosity'], short: 'apollo', accept: ['the apollo missions', 'apollo missions'], why: 'Apollo was the crewed (manned) mission that landed astronauts on the Moon.' },
    { p: 'About how high above the Earth does the ISS orbit?', a: 'About 400–500 km', w: ['About 5 km', 'About 400 000 km (as far as the Moon)', 'About 150 million km'], why: 'The ISS orbits a few hundred kilometres up — your notes say about 500 km.' },
    { p: 'How did the ISS get into space?', a: 'In pieces, carried up by rockets and the space shuttle, then joined together in orbit', w: ['It was built on Earth and flew up in one piece', 'A giant balloon lifted it', 'It was built on the Moon'], why: 'Modules were launched one at a time and assembled in orbit.' },
    { p: 'Where do ISS astronauts get their food?', a: 'It is sent up from Earth on cargo spacecraft, mostly dried or sealed in packets', w: ['They grow all of it on board', 'They catch it in space', 'It is made from moon rock'], why: 'Supply ships bring food; it is packaged so it keeps and does not float away in crumbs.' },
    { p: 'Where does most of the water on the ISS come from?', a: 'It is recycled — even sweat and urine are cleaned back into drinking water', w: ['It rains inside the station', 'It is melted from comets', 'They do not drink water'], why: 'Water is heavy to launch, so the ISS recycles almost all of it. Extra arrives on supply ships.' },
    { p: 'How does the ISS toilet work without gravity?', a: 'Air suction (fans) pulls the waste away', w: ['It flushes with water like at home', 'Astronauts wait until they land', 'Waste just floats away outside'], why: 'With no gravity, flowing air does the job that gravity does on Earth.' },
    { p: 'Why doesn\'t the ISS fall back down to Earth?', a: 'It is moving sideways so fast (about 28 000 km/h) that as it falls it keeps missing the Earth — it is in orbit', w: ['There is no gravity up there', 'It has engines pushing it up all the time', 'It is tied to a satellite'], why: 'Gravity is still pulling it! Its huge sideways speed means it falls <b>around</b> the Earth instead of into it.' },
    { p: 'What do astronauts on the ISS spend their time doing?', a: 'Science experiments, repairs and maintenance, and about two hours of exercise a day', w: ['Mostly sleeping', 'Mining asteroids', 'Building rockets'], why: 'The ISS is a science laboratory. Exercise stops their muscles and bones weakening.' },
    { p: 'Why must astronauts exercise for about 2 hours a day?', a: 'In weightlessness their muscles and bones get weaker', w: ['To keep warm', 'To make electricity', 'To stop the ISS falling'], why: 'Without gravity to work against, muscle and bone are lost.' },
    { p: 'Which of these is a big problem for people living in space or travelling to Mars?', a: 'Harmful radiation from the Sun and space', w: ['Too much oxygen', 'Being too heavy', 'Getting sunburnt from Mars'], why: 'Outside Earth\'s magnetic field and atmosphere there is much more radiation. Others: muscle/bone loss, food/water/air supply, isolation, a long trip.' },
  ];
  const tf = [
    { s: 'There are people living in space right now.', t: true, why: 'Astronauts live on the ISS all the time — it has been lived on non-stop since 2000.' },
    { s: 'There is no gravity on the ISS, which is why it does not fall down.', t: false, why: 'Gravity at the ISS is still about 90% as strong as on the ground. It stays up because it moves sideways so fast.' },
    { s: 'Astronauts have landed on the Moon.', t: true, why: 'The Apollo missions landed astronauts on the Moon (first in 1969).' },
    { s: 'Telescopes on Earth have to look through the atmosphere.', t: true, why: 'That is why stars twinkle and why Hubble went into space.' },
    { s: 'The space shuttle still flies up to repair Hubble.', t: false, why: 'The shuttles were retired in 2011.' },
    { s: 'The James Webb Space Telescope replaced Hubble and gives even better images.', t: true, why: 'JWST launched on 25 December 2021.' },
    { s: 'Rovers like Perseverance drive on the surface of Mars.', t: true, why: 'They are landers/rovers.' },
    { s: 'Voyager is a telescope on a mountain.', t: false, why: 'Voyager is a deep space probe that has travelled beyond the planets.' },
    { s: 'Astronauts on the ISS get all their water from deliveries.', t: false, why: 'Most of it is recycled, even from sweat and urine.' },
  ];
  const groups = [
    { label: 'a problem for telescopes on the ground', items: ['twinkling from moving air', 'clouds blocking the sky', 'light from city streets', 'looking through thick air'] },
    { label: 'an advantage of a space telescope', items: ['no twinkling', 'no clouds', 'can see more clearly', 'above the atmosphere'] },
    { label: 'a problem with living in space', items: ['muscle and bone loss', 'harmful radiation', 'all food sent from Earth', 'water must be recycled'] },
    { label: 'a robot space mission', items: ['Voyager', 'Juno', 'Curiosity', 'New Horizons', 'Perseverance'] },
  ];
  function missionTypeQ(level) {
    const M = [['Juno', 'orbiter', 'goes round Jupiter'], ['Voyager', 'deep space probe', 'has flown beyond the planets'], ['New Horizons', 'deep space probe', 'flew past Pluto'], ['Curiosity', 'lander / rover', 'drives on Mars'], ['Perseverance', 'lander / rover', 'drives on Mars'], ['Apollo', 'crewed mission', 'took astronauts to the Moon'], ['the ISS', 'crewed space station', 'has astronauts living on it'], ['Hubble', 'space telescope', 'looks at stars from orbit']];
    const m = R.pick(M);
    const kinds = ['orbiter', 'deep space probe', 'lander / rover', 'crewed mission', 'crewed space station', 'space telescope'];
    return {
      prompt: `<b>${m[0]}</b> ${m[2]}. What kind of space technology is it?`,
      answer: K.choice(m[1], kinds, level === 1 ? 3 : 4),
      hint: 'Orbiter = goes round a planet · probe = flies far away · lander/rover = on the surface · crewed = people on board.',
      working: [`${m[0]} ${m[2]} → <b>${m[1]}</b>.`],
      finalAnswer: m[1], skill: 'space-exploration-missions',
    };
  }
  function issMathsQ(level) {
    const form = level === 1 ? 1 : R.int(1, 3);
    if (form === 1) {
      const h = R.pick([2, 3, 5, 10]);
      return {
        prompt: `The ISS goes round the Earth about <b>16 times a day</b>. How many orbits is that in <b>${h} days</b>?`,
        answer: K.num(16 * h), hint: 'Multiply orbits per day by the number of days.',
        working: [`16 × ${h} = <b>${16 * h}</b> orbits.`], finalAnswer: String(16 * h), skill: 'space-exploration-iss',
      };
    }
    if (form === 2) {
      const days = R.pick([30, 60, 90, 180]);
      const litre = R.pick([2, 3, 4]);
      return {
        prompt: `An astronaut uses about <b>${litre} litres</b> of drinking water a day. How much is that for a <b>${days}-day</b> stay?`,
        answer: K.num(litre * days, 'litres'), hint: 'Litres per day × number of days.',
        working: [`${litre} × ${days} = <b>${litre * days} litres</b>.`, 'That is heavy to launch — which is why the ISS recycles water.'], finalAnswer: `${litre * days} litres`, skill: 'space-exploration-iss',
      };
    }
    const mins = 90;
    const hrs = R.pick([3, 6, 12, 24]);
    return {
      prompt: `One orbit of the ISS takes about <b>90 minutes</b>. How many orbits does it make in <b>${hrs} hours</b>?`,
      answer: K.num(hrs * 60 / mins), hint: 'Change hours to minutes first (× 60), then divide by 90.',
      working: [`${hrs} hours = ${hrs * 60} minutes.`, `${hrs * 60} ÷ 90 = <b>${hrs * 60 / mins}</b> orbits.`], finalAnswer: String(hrs * 60 / mins), skill: 'space-exploration-iss',
    };
  }
  const word = [
    (level) => ({
      prompt: 'An astronomer in a city cannot see faint stars well, even on a clear night. What would help most?',
      answer: K.choice('Using a telescope on a high, dark mountain or in space', ['Using a smaller telescope', 'Looking during the day', 'Turning on more lights'], level === 1 ? 3 : 4),
      hint: 'What gets in the way: air, clouds, and city lights.', working: ['City lights and thick air make faint stars hard to see.', 'Go higher (less air, above clouds), darker — or into space.'],
      finalAnswer: 'A telescope on a high dark mountain or in space', skill: 'space-exploration-apply',
    }),
    (level) => ({
      prompt: 'NASA asks students to suggest an experiment for the ISS. Which experiment needs the ISS rather than a school lab?',
      answer: K.choice('How plant roots grow when there is almost no feeling of gravity', ['How fast ice melts on a kitchen bench', 'Which paper towel soaks up most water', 'How tall bean plants grow in a sunny window'], level === 1 ? 3 : 4),
      hint: 'What does the ISS have that Earth does not?', working: ['The ISS is in free fall — things float (microgravity).', 'A good ISS experiment tests what <b>weightlessness</b> changes.'],
      finalAnswer: 'Plant growth in microgravity', skill: 'space-exploration-apply',
    }),
    (level) => ({
      prompt: 'Harper says "Hubble doesn\'t fall because there\'s no gravity in space." Which correction is best?',
      answer: K.choice('Gravity still pulls it, but it moves sideways so fast it keeps falling around the Earth', ['She is right', 'It has a rope to the ISS', 'The Sun\'s gravity pushes it up'], level === 1 ? 3 : 4),
      hint: 'Is there gravity a few hundred km up?', working: ['Gravity is still strong there.', 'Orbit = falling while moving sideways fast enough to keep missing the ground.'],
      finalAnswer: 'Gravity pulls it; its sideways speed keeps it in orbit', skill: 'space-exploration-apply',
    }),
    (level) => ({
      prompt: 'A trip to Mars takes about 7 months each way. Which is the hardest problem for the crew that the ISS crew do not face as badly?',
      answer: K.choice('No quick supplies or rescue from Earth, and much more space radiation over a long time', ['They would be too warm', 'There would be too much food', 'Mars has too much gravity'], level === 1 ? 3 : 4),
      hint: 'The ISS gets supply ships every few months and sits inside Earth\'s magnetic field.', working: ['The ISS can be resupplied and is partly protected by Earth\'s magnetic field.', 'On the way to Mars: no resupply, long isolation, more radiation, muscle and bone loss.'],
      finalAnswer: 'No resupply/rescue and more radiation', skill: 'space-exploration-apply',
    }),
  ];

  K.topic({
    id: 'space-exploration', strand: 'earth', order: 0.12,
    name: 'Exploring space: telescopes, probes & the ISS', short: 'Exploring space', animal: 'seal',
    blurb: 'Telescopes, Hubble and Webb, orbiters, probes, rovers — and living on the ISS.',
    example: 'Stars twinkle because moving air bends their light',
    hint: 'Think about what gets in the way (air, clouds, distance) and what each machine is for.',
    learn: {
      what: '<p>We explore space with <b>telescopes</b> (on the ground and in space), <b>robot spacecraft</b> (orbiters, probes, landers and rovers) and <b>crewed missions</b> (Apollo, the ISS). The technology has changed hugely — from Galileo\'s small telescope in 1610 to the James Webb Space Telescope in 2021.</p>',
      visual,
      facts: [
        '<b>Telescopes</b> use lenses and mirrors to focus light from space.',
        'Stars <b>twinkle</b> because moving air in the atmosphere bends their light. Ground telescopes also have <b>clouds</b>. Fix: build on <b>high mountains</b> (less air, above the clouds).',
        '<b>Hubble Space Telescope</b> (1990): above the atmosphere — no twinkling, no clouds. Downside: very <b>expensive to repair</b>; shuttles retired 2011; a <b>software fix</b> saved it in 2021.',
        '<b>James Webb Space Telescope</b>: launched Christmas Day 2021, even better images.',
        'Robot missions: <b>orbiters</b> (Juno → Jupiter), <b>deep space probes</b> (Voyager, New Horizons → Pluto), <b>landers/rovers</b> (Curiosity, Perseverance → Mars). Crewed: <b>Apollo</b> (Moon), the <b>ISS</b>.',
        '<b>ISS</b>: about 400–500 km up, built in pieces launched by rockets and the shuttle. Usually about 7 people. Food comes on cargo ships; water is mostly <b>recycled</b>; the toilet uses <b>air suction</b>. They do experiments, repairs and 2 h of exercise a day.',
        'The ISS does not fall because it moves sideways at about <b>28 000 km/h</b> — it keeps falling <b>around</b> the Earth. Gravity is still there.',
        '<b>Problems of living in space:</b> muscle and bone loss, radiation, all supplies from Earth, recycling air and water, isolation. Mars adds months of travel with no resupply.',
      ],
      steps: [
        'Name the technology and say what it does (orbits, flies past, lands, carries people).',
        'For "how has it changed": go oldest → newest and say what each step improved.',
        'For a problem question, link the problem to the cause (no air → no twinkling; no gravity → muscle loss).',
      ],
      examples: [
        { q: 'Why do some stars appear to twinkle?', working: ['Their light travels through Earth\'s atmosphere.', 'Air currents bend the light, so it wobbles.'], a: 'Moving air in the atmosphere bends the light' },
        { q: 'Name two problems astronomers have with telescopes on Earth, and how they reduce them.', working: ['Problems: twinkling (atmosphere) and clouds.', 'Solution: build on high mountains — less air, often above the clouds.'], a: 'Twinkling and clouds → build on mountains' },
        { q: 'Why does Hubble get better pictures, and what is the disadvantage?', working: ['Above the atmosphere: no twinkling, no clouds.', 'Disadvantage: very expensive and hard to repair.'], a: 'No atmosphere in the way · but expensive to fix' },
        { q: 'Why doesn\'t the ISS fall down?', working: ['Gravity pulls it towards Earth.', 'It moves sideways at about 28 000 km/h, so it keeps falling around the Earth — it is in orbit.'], a: 'Its sideways speed keeps it falling around Earth' },
        { q: 'Where do ISS astronauts get water, and how do they go to the toilet?', working: ['Water is recycled (even urine and sweat), plus some deliveries.', 'The toilet uses air suction because there is no gravity.'], a: 'Recycled water · suction toilet' },
        { q: 'Describe how technology for exploring space has changed.', working: ['Naked eye (Greeks) → Galileo\'s telescope (1610) → big mountain telescopes → Hubble in space (1990) → James Webb (2021).', 'Plus robot probes and rovers, and crewed missions (Apollo, ISS).'], a: 'From eyes to space telescopes, probes, rovers and space stations' },
      ],
      tips: [
        'There <b>is</b> gravity on the ISS. "Weightless" means falling freely, not "no gravity".',
        'Orbiter = goes round. Probe = flies on. Lander/rover = on the surface.',
        'Space telescope pros: no air, no clouds. Cons: cost, can\'t easily fix it.',
      ],
    },
    mcq, tf, groups, calc: [missionTypeQ, issMathsQ], word,
  });
})(window.HL);
