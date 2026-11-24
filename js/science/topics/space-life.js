/* Topic: Are we alone? — what life needs, the Goldilocks (habitable) zone, the five conditions from the
 * "Life will require a special kind of home" handout (energy, temperature, raw materials, time, protection),
 * the three candidates (Europa, Proxima Centauri b, K2-18 b), exoplanets, and designing an alien.
 * Year 8 Cosmology LO14 (workbook) / notes "Are we alone?". */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const zone = (planet) => `<svg viewBox="0 0 340 110" width="340" height="110" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="106" rx="12" fill="#14213D"/>
    <rect x="12" y="20" width="96" height="54" fill="#E0568C" opacity=".35"/><rect x="108" y="20" width="90" height="54" fill="#8FC96E" opacity=".45"/><rect x="198" y="20" width="130" height="54" fill="#5F98C4" opacity=".4"/>
    <text x="60" y="16" text-anchor="middle" fill="#F7A8C4">too hot: water boils</text><text x="153" y="16" text-anchor="middle" fill="#E3F3D8">just right: liquid water</text><text x="263" y="16" text-anchor="middle" fill="#A9D8F5">too cold: water freezes</text>
    <circle cx="10" cy="47" r="14" fill="#F6C343"/>
    ${[['Mercury', 45, 0.4], ['Venus', 78, 0.7], ['Earth', 128, 1], ['Mars', 205, 1.5]].map(([n, x, au]) => `<circle cx="${x}" cy="47" r="${n === planet ? 7 : 5}" fill="${n === planet ? '#FFF1C9' : '#E7E2D6'}"/><text x="${x}" y="90" text-anchor="middle" fill="#FFFFFF">${n}</text><text x="${x}" y="102" text-anchor="middle" fill="#A9D8F5">${au} au</text>`).join('')}
  </svg>`;
  const visual = zone('Earth');

  const NEEDS = [
    { k: 'Energy', h: 'The star must be the ideal size', d: 'a medium (G-type) star like the Sun shines steadily for billions of years. Red dwarfs: planets must orbit very close and get blasted by radiation. Giant stars: planets are too far away to get much energy.' },
    { k: 'Temperature', h: 'Water must flow on the surface', d: 'the planet must be in the Goldilocks (habitable) zone, where water is liquid — not ice, not vapour. In our Solar System that is about 0.95–1.37 au from the Sun.' },
    { k: 'Raw materials', h: 'The ideal ingredients must be present', d: 'water (an excellent solvent) and carbon, whose atoms form long chains for complex molecules like proteins. Some think silicon could work, but it has drawbacks.' },
    { k: 'Time', h: 'Primaeval soup needs millions of years', d: 'life takes hundreds of millions of years to start and billions to become complex, so the star and planet must stay stable for a very long time.' },
    { k: 'Protection', h: 'Life must be shielded from radiation', d: 'a magnetic field (from a metal core) and an atmosphere block deadly radiation; the atmosphere also burns up small meteorites.' },
  ];
  const mcq = [
    { p: 'What is the <b>Goldilocks zone</b>?', a: 'The distance from a star where it is not too hot and not too cold, so water can be liquid', w: ['The hottest part of a star', 'A zone inside a black hole', 'The area between Mars and Jupiter full of rocks'], short: 'habitable zone', accept: ['the habitable zone', 'where water is liquid', 'not too hot not too cold', 'where liquid water can exist', 'liquid water zone'], why: 'Also called the habitable zone. Like Goldilocks\' porridge: just right.' },
    { p: 'Why is <b>liquid water</b> so important for life as we know it?', a: 'Everything living on Earth needs it — it dissolves substances so chemical reactions can happen', w: ['It makes planets shiny', 'It keeps planets cold', 'It is only needed for swimming'], why: 'Nothing on Earth survives without liquid water. It is an excellent solvent.' },
    { p: 'What would happen to Earth\'s water if Earth were much closer to the Sun?', a: 'It would boil away into water vapour', w: ['It would freeze into ice', 'Nothing', 'It would turn into salt'], short: 'it would boil', accept: ['boil', 'it boils', 'evaporate', 'it would evaporate', 'boil away', 'turn to gas', 'turn into vapour', 'water vapour', 'it would boil away'], why: 'Too hot → only gas (vapour). That is what happens on Venus (0.7 au).' },
    { p: 'What would happen to Earth\'s water if Earth were much further from the Sun?', a: 'It would freeze into ice', w: ['It would boil away', 'Nothing', 'It would become oil'], short: 'it would freeze', accept: ['freeze', 'it freezes', 'turn to ice', 'ice', 'it would turn to ice', 'freeze into ice'], why: 'Too cold → only ice. That is why water on Mars (1.5 au) is frozen.' },
    { p: 'Which elements are essential for life as we know it?', a: 'Carbon, hydrogen, nitrogen and oxygen', w: ['Gold, silver and platinum', 'Only iron', 'Helium and neon'], why: 'Life on Earth is built on carbon, with hydrogen, nitrogen and oxygen.' },
    { p: 'Why is <b>carbon</b> so good for building living things?', a: 'Its atoms can join into long chains and bond with other atoms to make complex molecules like proteins', w: ['It is the heaviest element', 'It glows in the dark', 'It is very rare'], why: 'Carbon is also common: after hydrogen, helium and oxygen it is the most abundant element in the universe.' },
    { p: 'Some scientists think alien life might be based on which element instead of carbon?', a: 'Silicon', w: ['Gold', 'Helium', 'Sodium'], short: 'silicon', why: 'Silicon is similar to carbon in structure, but it has drawbacks (it reacts strongly with oxygen).' },
    { p: 'What type of star do astronomers think is best for life?', a: 'A medium-sized G-type star like the Sun', w: ['A tiny red dwarf', 'A giant star 20 times heavier than the Sun', 'A black hole'], short: 'g-type', accept: ['g type', 'g-type star', 'a g-type star', 'like the sun', 'medium sized', 'medium', 'a star like the sun'], why: 'G-type stars shine steadily for billions of years. There are about 30 billion in the Milky Way.' },
    { p: 'Why is a planet around a <b>red dwarf</b> star not ideal for life?', a: 'It must orbit very close to the small star, where it is blasted by powerful radiation', w: ['It is too far away to get light', 'Red dwarfs are too hot', 'Red dwarfs have no gravity at all'], why: 'Red dwarfs\' gravity is weak, so planets orbit close — and get extreme radiation.' },
    { p: 'Why is a planet around a <b>giant</b> star not ideal for life?', a: 'Its orbit is so far away that it gets very little energy from the star', w: ['It is too close and gets burnt', 'Giant stars are too cold', 'Giant stars have no light'], why: 'The opposite problem to red dwarfs. (Giant stars also burn out fast.)' },
    { p: 'Why does life need a <b>long time</b> and a <b>stable</b> planet?', a: 'Life takes hundreds of millions of years to start and billions of years to become complex', w: ['Life appears in a few days', 'Stars need to be young', 'Planets must change quickly'], why: 'If temperature or air changes too fast, life cannot adapt. 252 million years ago a sudden CO₂ rise on Earth killed 70–90% of species ("the Great Dying").' },
    { p: 'What protects life on Earth from deadly radiation?', a: 'The magnetic field (from Earth\'s metal core) and the atmosphere', w: ['The Moon', 'The oceans', 'Clouds only'], why: 'The field deflects most radiation; the atmosphere absorbs more and burns up small meteorites.' },
    { p: 'What is an <b>exoplanet</b>?', a: 'A planet outside our Solar System, orbiting another star', w: ['A planet that has exploded', 'A moon of Jupiter', 'A planet with no atmosphere'], short: 'a planet outside our solar system', accept: ['planet outside our solar system', 'planet outside the solar system', 'a planet outside the solar system', 'planet orbiting another star', 'a planet orbiting another star'], why: 'Almost 6000 exoplanets have been found; only 62 are in their star\'s habitable zone.' },
    { p: 'About how many exoplanets had been found when the handout was written, and how many were in the habitable zone?', a: 'Almost 6000 found, only 62 in the habitable zone', w: ['About 10 found, all habitable', '62 found, 6000 habitable', 'None found yet'], why: 'Only about 1 in 100 is in the "just right" zone.' },
    { p: 'Where in our own Solar System might there be life, under thick ice?', a: 'In the ocean under the ice of Jupiter\'s moon Europa', w: ['On the surface of the Sun', 'On Mercury', 'Inside Saturn\'s rings'], short: 'europa', accept: ['jupiter\'s moon europa', 'europa\'s ocean'], why: 'Europa (628 million km away) has a deep ocean under its ice. The Clipper probe will study it from 2030.' },
    { p: 'What is <b>Proxima Centauri b</b>?', a: 'An Earth-sized planet in the habitable zone of our closest neighbouring star, about 4 light years away', w: ['A moon of Saturn', 'A black hole', 'A galaxy'], why: 'It is "only" 40 000 billion km away.' },
    { p: 'Why is <b>K2-18 b</b> thought to be the most promising place to look for alien life?', a: 'Its atmosphere contains gases that scientists think most likely come from living things', w: ['It is the closest planet to Earth', 'Astronauts have visited it', 'It is made of gold'], why: 'Hubble (2019) and JWST (2023–25) studied it. It is 120 light years away.' },
    { p: 'In our Solar System, about where is the Goldilocks zone?', a: 'About 0.95 to 1.37 au from the Sun — Earth (1 au) is inside it', w: ['From the Sun to Mercury', 'Out past Neptune', 'Between Jupiter and Saturn'], why: 'Mercury (0.4 au) and Venus (0.7 au) are too close; Mars (1.5 au) is just outside, so its water is ice.' },
    { p: 'Why might radio signals from an alien civilisation not have reached us yet?', a: 'Space is so big that the signals could take millions of years to arrive', w: ['Radio waves cannot travel through space', 'Aliens do not use electricity', 'The Moon blocks them'], why: 'Even at the speed of light, crossing the galaxy takes up to 100 000 years.' },
  ];
  NEEDS.forEach((n) => mcq.push({ p: `In the handout "Life will require a special kind of home", what does the <b>${n.k.toLowerCase()}</b> section say?`, a: n.h, w: NEEDS.map((x) => x.h), why: `${n.k}: ${n.d}` }));
  const tf = [
    { s: 'Scientists have already found definite proof of alien life.', t: false, why: 'Not yet — but many think it is likely, and they are searching planets like K2-18 b and moons like Europa.' },
    { s: 'Mars is just outside the Goldilocks zone, so its water is frozen.', t: true, why: 'Mars is about 1.5 au from the Sun.' },
    { s: 'Venus is in the Goldilocks zone.', t: false, why: 'At 0.7 au it is too close — water evaporates.' },
    { s: 'Carbon is a rare element in the universe.', t: false, why: 'After hydrogen, helium and oxygen, it is the most common element.' },
    { s: 'An exoplanet is any planet outside our Solar System.', t: true, why: 'Exo = outside.' },
    { s: 'With billions of galaxies each with billions of stars, many scientists think life elsewhere is possible.', t: true, why: 'The chance on one planet is tiny, but there are so many planets.' },
    { s: 'A planet near a red dwarf star is a perfect place for life.', t: false, why: 'It would orbit very close and be blasted by radiation.' },
    { s: 'Some bacteria can repair themselves as fast as radiation damages them.', t: true, why: 'But complex life probably needs protection.' },
  ];
  const groups = [
    { label: 'a condition needed for life as we know it', items: ['liquid water', 'being in the Goldilocks zone', 'carbon, hydrogen, nitrogen and oxygen', 'a long, stable time', 'protection from radiation'] },
    { label: 'a place scientists think might have life', items: ['Europa', 'Proxima Centauri b', 'K2-18 b', 'Mars (in the past, underground)'] },
    { label: 'NOT a good sign for life', distractorOnly: true, items: ['water that is always frozen', 'no atmosphere', 'blasted by radiation', 'a star that keeps flaring and changing'] },
  ];
  function zoneQ(level) {
    const P = [['Mercury', 0.4, 'too hot — water evaporates'], ['Venus', 0.7, 'too hot — water evaporates'], ['Earth', 1, 'just right — liquid water'], ['Mars', 1.5, 'too cold — water freezes']];
    const p = R.pick(P);
    return {
      prompt: `<b>${p[0]}</b> is ${p[1]} au from the Sun. The Goldilocks zone is about 0.95–1.37 au. What is it like for water there?`, visual: zone(p[0]),
      answer: K.choice(p[2].charAt(0).toUpperCase() + p[2].slice(1), ['Too hot — water evaporates', 'Just right — liquid water', 'Too cold — water freezes']),
      hint: 'Less than 0.95 au → too hot. More than 1.37 au → too cold.',
      working: [`${p[1]} au is ${p[1] < 0.95 ? 'less than 0.95 → closer than the zone' : p[1] > 1.37 ? 'more than 1.37 → further than the zone' : 'between 0.95 and 1.37 → inside the zone'}.`, `So: <b>${p[2]}</b>.`],
      finalAnswer: p[2], skill: 'space-life-zone',
    };
  }
  function auQ(level) {
    const au = R.pick([0.4, 0.7, 1.5, 2, 5]);
    const km = Math.round(au * 150 * 10) / 10;
    return {
      prompt: `1 au is about <b>150 million km</b>. How many million km is <b>${au} au</b>?`,
      answer: K.num(km, 'million km', 0.01), hint: 'Multiply by 150.',
      working: [`${au} × 150 = <b>${km}</b> million km.`], finalAnswer: `${km} million km`, skill: 'space-life-au',
    };
  }
  function percentQ(level) {
    return {
      prompt: 'Of almost <b>6000</b> exoplanets found, <b>62</b> are in the habitable zone. Roughly what fraction is that?',
      answer: K.choice('About 1 in 100', ['About 1 in 2', 'About 1 in 10', 'About 1 in 10 000']),
      hint: '6000 ÷ 62 ≈ ?', working: ['6000 ÷ 62 ≈ 97 — about 100.', 'So about <b>1 in 100</b> found exoplanets is in the habitable zone.'],
      finalAnswer: 'About 1 in 100', skill: 'space-life-numbers',
    };
  }
  const word = [
    (level) => ({
      prompt: 'You are designing an alien for a planet that is very cold and dark most of the time, with an ocean under thick ice (like Europa). Which feature makes most sense?',
      answer: K.choice('It gets energy from chemicals around hot vents on the sea floor, not from sunlight', ['Big leaves to catch sunlight', 'Thin skin to stay cool', 'Wings to fly through the air'], level === 1 ? 3 : 4),
      hint: 'No sunlight reaches under thick ice.', working: ['Step 1: environment — dark, cold, liquid water under ice.', 'Step 2: energy cannot come from sunlight → chemicals from vents.', 'Link every body feature to the planet.'],
      finalAnswer: 'Chemical energy, not sunlight', skill: 'space-life-design',
    }),
    (level) => ({
      prompt: 'An alien lives on a planet very close to a red dwarf, blasted by radiation. Which feature would best help it survive?',
      answer: K.choice('Thick protective skin or shell, or living underground', ['Huge see-through wings', 'No skin at all', 'Living on mountain tops in the open'], level === 1 ? 3 : 4),
      hint: 'What protects from radiation?', working: ['Problem: strong radiation.', 'Solution: a shield — thick skin or shell, or live underground or underwater.'],
      finalAnswer: 'Thick shielding skin or living underground', skill: 'space-life-design',
    }),
    (level) => ({
      prompt: 'Harper says: "Proxima Centauri b is in the habitable zone, so it definitely has life." What is wrong?',
      answer: K.choice('Being in the zone only means water could be liquid — it also needs the right ingredients, protection and a long stable time', ['Nothing — it definitely has life', 'It is not a real planet', 'The habitable zone means it has aliens'], level === 1 ? 3 : 4),
      hint: 'How many conditions does life need?', working: ['Habitable zone = right temperature for liquid water.', 'Life also needs raw materials (carbon, water), time, and protection — and even then it is not guaranteed.'],
      finalAnswer: 'The zone is only one condition', skill: 'space-life-apply',
    }),
    (level) => ({
      prompt: 'Why do scientists study the gases in an exoplanet\'s atmosphere (like K2-18 b\'s)?',
      answer: K.choice('Some gases are most likely made by living things, so they could be a sign of life', ['To see how windy it is', 'To find gold', 'To measure its distance'], level === 1 ? 3 : 4),
      hint: 'On Earth, which gases come from life?', working: ['Living things change the gases in an atmosphere.', 'Finding those gases far away hints at life.'],
      finalAnswer: 'Some gases are signs of life', skill: 'space-life-apply',
    }),
  ];

  K.topic({
    id: 'space-life', strand: 'earth', order: 0.21,
    name: 'Are we alone? Life on other worlds', short: 'Alien life', animal: 'turtle',
    blurb: 'What life needs, the Goldilocks zone, Europa and exoplanets — and designing an alien.',
    example: 'Goldilocks zone: not too hot, not too cold — liquid water',
    hint: 'Life needs: liquid water (Goldilocks zone), carbon and other elements, a long stable time, protection from radiation, the right star.',
    learn: {
      what: '<p>Scientists don\'t know for sure if aliens exist, but with billions of galaxies, each with billions of stars and planets, Earth being the only place with life seems unlikely. For life as we know it, a planet needs the right <b>star</b>, the right <b>temperature</b> (liquid water), the right <b>ingredients</b>, enough <b>time</b> and <b>protection</b>.</p>',
      visual,
      facts: [
        '<b>Liquid water</b> is essential — nothing on Earth lives without it.',
        '<b>Goldilocks (habitable) zone</b>: not too hot, not too cold. Too close → water boils; too far → water freezes. Ours is about 0.95–1.37 au: Mercury 0.4 and Venus 0.7 (too hot), Earth 1 (just right), Mars 1.5 (ice).',
        '<b>Elements:</b> carbon, hydrogen, nitrogen, oxygen (maybe silicon). Carbon makes long chains → proteins.',
      ].concat(NEEDS.map((n) => `<b>${n.k}</b> — ${n.h.toLowerCase()}: ${n.d}`)).concat([
        '<b>Exoplanets</b> = planets outside our Solar System: almost 6000 found, only 62 in the habitable zone.',
        '<b>Candidates:</b> <b>Europa</b> (Jupiter\'s moon, ocean under the ice, 628 million km; Clipper probe from 2030) · <b>Proxima Centauri b</b> (Earth-sized, habitable zone, 4 light years) · <b>K2-18 b</b> (120 light years; atmosphere has gases that may come from life).',
        'Radio signals from aliens could take millions of years to reach us.',
      ]),
      steps: [
        'List the conditions: water (Goldilocks zone), elements, time, protection, star.',
        'For a planet question: check each condition and say yes or no.',
        'Designing an alien: environment → energy source → survival features → link each feature to the planet.',
      ],
      examples: [
        { q: 'What conditions does a planet need for life as we know it?', working: ['In the Goldilocks zone with liquid water.', 'Carbon, hydrogen, nitrogen, oxygen.', 'Stable and old enough for life to evolve.', 'An atmosphere or magnetic field to block radiation.'], a: 'Liquid water, elements, time, protection' },
        { q: 'Why is Mars not in the Goldilocks zone?', visual: zone('Mars'), working: ['Mars is 1.5 au from the Sun.', 'The zone ends at about 1.37 au, so it is too cold — water is ice.'], a: 'Too far → water freezes' },
        { q: 'Why is a G-type star like the Sun best for life?', working: ['It shines steadily for billions of years.', 'Red dwarfs: planets too close → radiation. Giants: planets too far → too little energy.'], a: 'Steady energy for billions of years' },
        { q: 'Why might life exist on Europa?', working: ['Under its icy surface is a deep ocean of liquid water.', 'Water is the key ingredient for life.'], a: 'An ocean of liquid water under the ice' },
        { q: 'Why is K2-18 b exciting?', working: ['Hubble and JWST studied its atmosphere.', 'It has gases that scientists think most likely come from living things.'], a: 'Possible signs of life in its atmosphere' },
        { q: 'Design an alien for a hot, bright planet with little water.', working: ['Environment: hot, lots of sunlight, little water.', 'Energy: sunlight (photosynthesis like plants).', 'Features: thick waxy skin to save water, reflective colour, active at night.'], a: 'Features that match the planet' },
      ],
      tips: [
        'Goldilocks zone = right temperature for <b>liquid</b> water — it does not guarantee life.',
        'Exo = outside: an exoplanet orbits another star.',
        'When you design an alien, every feature needs a <b>because</b> linked to the planet.',
      ],
    },
    mcq, tf, groups, calc: [zoneQ, zoneQ, auQ, percentQ], word,
  });
})(window.HL);
