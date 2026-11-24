/* Topic: The scale of the universe and how distances are measured — light years, light time,
 * astronomical units, the planet scale model, sizes and ages.
 * Year 8 Cosmology LO4 + LO5 (workbook) / notes LO10 + LO11. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;
  const C = 300000; // km per second, as the class notes use

  const DIST = [
    { n: 'the Sun', d: '8.3 light minutes', k: '150 million km' },
    { n: 'Pluto', d: 'about 5 light hours', k: '' },
    { n: 'Proxima Centauri (the next closest star)', d: '4.27 light years', k: '40 million million km' },
    { n: 'Sirius (the brightest star in the night sky)', d: '8.7 light years', k: '' },
    { n: 'the far side of the Milky Way', d: 'about 100 000 light years (the galaxy\'s diameter)', k: '' },
    { n: 'the Andromeda Galaxy (nearest big spiral galaxy)', d: 'about 2.5 million light years', k: '' },
  ];
  const SIZES = ['the Moon', 'the Earth', 'the Sun', 'the Solar System', 'the Milky Way Galaxy', 'the Universe'];
  const visual = `<svg viewBox="0 0 340 120" width="340" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="116" rx="12" fill="#14213D"/>
    <text x="170" y="18" text-anchor="middle" fill="#FFF1C9" font-size="11">How long light takes to get there</text>
    ${[['Sun', '8 min'], ['Pluto', '5 h'], ['Proxima', '4.27 yr'], ['Sirius', '8.7 yr'], ['Milky Way', '100 000 yr'], ['Andromeda', '2.5 million yr']]
      .map(([a, b], i) => `<circle cx="${28 + i * 56}" cy="58" r="${5 + i}" fill="${['#F6C343', '#C9C2B0', '#F7A8C4', '#FFFFFF', '#A9D8F5', '#C9B8F0'][i]}"/>
      <text x="${28 + i * 56}" y="86" text-anchor="middle" fill="#FFFFFF">${a}</text>
      <text x="${28 + i * 56}" y="102" text-anchor="middle" fill="#A9D8F5">${b}</text>`).join('')}
    <path d="M14 40 H326" stroke="#F6C343" stroke-dasharray="4 4"/>
  </svg>`;

  const mcq = [
    { p: 'What is a <b>light year</b>?', a: 'The distance light travels in one year', w: ['The time light takes to reach the Sun', 'One year on another planet', 'How bright a star is in a year'], short: 'a distance', accept: ['distance', 'the distance light travels in one year', 'distance light travels in a year', 'the distance light travels in a year'], why: 'A light year is a <b>distance</b> (not a time!): about 9.5 million million km.' },
    { p: 'What is a light year used to measure?', a: 'The huge distances between stars and galaxies', w: ['How old a star is', 'How hot a star is', 'Time on Earth'], why: 'Kilometres are far too small a unit for space, so we use light years.' },
    { p: 'How fast does light travel?', a: '300 000 km every second', w: ['300 km every second', '300 000 km every hour', 'About as fast as sound'], short: '300 000 km/s', accept: ['300000 km/s', '300 000 km per second', '300000 km per second', '300 000', '300000', '300,000 km/s', '300,000 km per second', '300,000'], why: 'Light: 300 000 km/s — it could go round the Earth about 7 times in one second.' },
    { p: 'How far does light travel in one year?', a: 'About 9.5 million million km', w: ['About 300 000 km', 'About 150 million km', 'About 1 million km'], why: '300 000 km/s × the seconds in a year ≈ 9 500 000 000 000 km.' },
    { p: 'How long does sunlight take to reach the Earth?', a: 'About 8 minutes', w: ['About 8 seconds', 'About 8 hours', 'About 8 years'], short: '8 minutes', accept: ['8 min', 'eight minutes', '8.3 minutes', 'about 8 minutes', '8 mins'], why: 'The Sun is 8.3 light minutes away (150 million km).' },
    { p: 'How far is the Sun from the Earth?', a: 'About 150 million km', w: ['About 150 thousand km', 'About 4 light years', 'About 384 000 km'], why: '150 million km = 1 <b>astronomical unit (au)</b>.' },
    { p: 'What is an <b>astronomical unit (au)</b>?', a: 'The average distance from the Earth to the Sun, about 150 million km', w: ['The distance light travels in a year', 'The size of a galaxy', 'The distance to the Moon'], short: 'earth sun distance', accept: ['the distance from the earth to the sun', 'distance from earth to the sun', 'earth to sun', 'distance between earth and sun', 'the earth-sun distance'], why: 'Used for distances inside a solar system. Mars is about 1.5 au from the Sun.' },
    { p: 'What is the next closest star to us after the Sun?', a: 'Proxima Centauri', w: ['Sirius', 'The Moon', 'Andromeda'], short: 'proxima centauri', accept: ['proxima', 'alpha centauri'], why: 'Proxima Centauri: 4.27 light years (40 million million km) away.' },
    { p: 'Which is the brightest star in the night sky?', a: 'Sirius', w: ['Proxima Centauri', 'Mars', 'The North Star'], short: 'sirius', why: 'Sirius, 8.7 light years away and about 20 times brighter than the Sun.' },
    { p: 'About how wide is the Milky Way galaxy?', a: '100 000 light years', w: ['100 light years', '8 light minutes', '100 million km'], why: 'Light takes about 100 000 years to cross our galaxy.' },
    { p: 'What is the nearest big spiral galaxy to ours?', a: 'Andromeda', w: ['Proxima Centauri', 'Sirius', 'The Milky Way'], short: 'andromeda', accept: ['the andromeda galaxy', 'andromeda galaxy'], why: 'Andromeda: about 2.5 million light years away.' },
    { p: 'When we look at a star 1000 light years away, we see it…', a: 'as it was 1000 years ago', w: ['exactly as it is right now', 'as it will be in 1000 years', 'only in the daytime'], why: 'The light left it 1000 years ago — we are looking back in time. The star might not even exist any more!' },
    { p: 'Why might some stars we see no longer exist?', a: 'Their light took so long to reach us that the star may have died since it left', w: ['Telescopes make up stars', 'Stars only exist at night', 'Clouds hide them'], why: 'Looking at distant stars = looking into the past.' },
    { p: 'Rank from <b>smallest to largest</b>.', a: 'Moon → Earth → Sun → Milky Way → Universe', w: ['Earth → Moon → Sun → Universe → Milky Way', 'Moon → Sun → Earth → Milky Way → Universe', 'Sun → Earth → Moon → Milky Way → Universe', 'Moon → Earth → Milky Way → Sun → Universe'], why: 'Moon < Earth < Sun < Milky Way galaxy < the whole Universe.' },
    { p: 'How many times wider is the Sun than the Earth?', a: 'About 109 times (about 100 times)', w: ['About 2 times', 'About 10 times', 'About 1 million times'], why: 'Sun\'s diameter ≈ 1.4 million km = 109 Earths side by side.' },
    { p: 'In the classroom planet model, why are the planet sizes and distances <b>not</b> on the same scale?', a: 'If they were, the planets would be tiny dots or the model would be many metres long (Mercury 14 m from the Sun)', w: ['Because the teacher made a mistake', 'Because planets change size', 'Because distances do not matter'], why: 'Space is mostly empty. On the same scale as the drawings, Mercury would be 14 m from the Sun.' },
    { p: 'About how many stars do the notes estimate there are? (1000 million galaxies × 1000 million stars each)', a: '1000 million million million — a billion billion (10¹⁸)', w: ['1000 million', '2000 million', 'About 9000'], why: '1 000 000 000 × 1 000 000 000 = 1 000 000 000 000 000 000. Modern estimates are even bigger!' },
    { p: 'How long would light take to go around the Earth (about 40 000 km)?', a: 'Less than a fifth of a second — about 7 times round in 1 second', w: ['About 1 hour', 'About 1 day', 'About 8 minutes'], why: '40 000 ÷ 300 000 ≈ 0.13 s. That is why light seems instant on Earth.' },
  ];
  const tf = [
    { s: 'A light year is a measure of time.', t: false, why: 'It is a <b>distance</b>: how far light travels in a year.' },
    { s: 'When you look at the stars you are seeing them as they were in the past.', t: true, why: 'Their light took years — or thousands of years — to get here.' },
    { s: 'In a rugby match you see the ball kicked before you hear it.', t: true, why: 'Light travels much faster than sound.' },
    { s: 'Proxima Centauri is closer to us than the Sun.', t: false, why: 'The Sun is 8.3 light <b>minutes</b> away; Proxima is 4.27 light <b>years</b>.' },
    { s: 'The Sun is about 100 times wider than the Earth.', t: true, why: 'About 109 times.' },
    { s: 'The Milky Way is bigger than the universe.', t: false, why: 'The Milky Way is one galaxy among billions in the universe.' },
    { s: 'Light from the Sun reaches us instantly.', t: false, why: 'It takes about 8 minutes.' },
    { s: 'A star 500 light years away might have already died.', t: true, why: 'We see light that left it 500 years ago.' },
  ];
  const groups = [
    { label: 'a unit used to measure distance in space', items: ['light year', 'astronomical unit (au)', 'light minute', 'light hour'] },
    { label: 'NOT a unit of distance', items: ['year', 'second', 'kilogram', 'degree Celsius'] },
  ];

  function lightTimeQ(level) {
    // time = distance ÷ speed, with distances that divide cleanly
    const trips = [
      { what: 'from here to London and back', km: 40000, ans: 40000 / C },
      { what: 'once around the Earth', km: 40000, ans: 40000 / C },
      { what: 'to the Moon', km: 384000, ans: 1.28 },
      { what: 'across a 600 000 km gap', km: 600000, ans: 2 },
      { what: 'across a 1 500 000 km gap', km: 1500000, ans: 5 },
      { what: 'across a 3 000 000 km gap', km: 3000000, ans: 10 },
      { what: 'across a 900 000 km gap', km: 900000, ans: 3 },
    ];
    const t = level === 1 ? R.pick(trips.slice(3)) : R.pick(trips);
    const exact = Math.round(t.km / C * 100) / 100;
    return {
      prompt: `Light travels <b>300 000 km every second</b>. How many seconds does light take to travel <b>${K.big(t.km)} km</b> (${t.what})?${exact % 1 ? ' <span class="muted">(2 decimal places)</span>' : ''}`,
      answer: K.num(exact, 'seconds', exact % 1 ? 0.01 : null),
      hint: 'Time = distance ÷ speed.',
      working: ['Time = distance ÷ speed.', `${K.big(t.km)} ÷ 300 000 = <b>${exact} seconds</b>.`, exact < 1 ? 'Compare: a jet plane takes 48 hours for London and back!' : 'Light is so fast it seems instant on Earth.'],
      finalAnswer: `${exact} s`, skill: 'space-scale-light-time',
    };
  }
  function lightYearQ(level) {
    const ly = R.pick([2, 3, 4, 5, 10, 20, 100]);
    if (level === 1 || R.chance(0.5)) {
      return {
        prompt: `A light year is about <b>9.5 million million km</b>. A star is <b>${ly} light years</b> away. How many million million km is that?`,
        answer: K.num(Math.round(ly * 9.5 * 10) / 10, 'million million km', 0.01),
        hint: 'Multiply the light years by 9.5.',
        working: [`${ly} × 9.5 = <b>${Math.round(ly * 95) / 10}</b> million million km.`, 'Writing that in km is awkward — that is exactly why astronomers use light years.'],
        finalAnswer: `${Math.round(ly * 95) / 10} million million km`, skill: 'space-scale-light-years',
      };
    }
    const yr = R.pick([50, 300, 1000, 2500, 8000]);
    return {
      prompt: `A star is <b>${K.big(yr)} light years</b> away. How many years ago did the light we see tonight leave it?`,
      answer: K.num(yr, 'years'),
      hint: 'One light year = the distance light covers in one year.',
      working: [`${K.big(yr)} light years away → the light has travelled for <b>${K.big(yr)} years</b>.`, 'We see the star as it was then — looking back in time.'],
      finalAnswer: `${yr} years`, skill: 'space-scale-light-years',
    };
  }
  function distQ(level) {
    const d = R.pick(DIST);
    return {
      prompt: `About how far away is <b>${d.n}</b>?`,
      answer: K.choice(d.d, DIST.map((x) => x.d), level === 1 ? 3 : 4),
      hint: 'Sun: minutes · Pluto: hours · nearby stars: years · galaxies: thousands to millions of years.',
      working: [`${d.n.charAt(0).toUpperCase() + d.n.slice(1)}: <b>${d.d}</b>${d.k ? ' (' + d.k + ')' : ''}.`],
      finalAnswer: d.d, skill: 'space-scale-distances',
    };
  }
  function sizeQ(level) {
    const [a, b] = R.sample(SIZES, 2);
    const big = SIZES.indexOf(a) > SIZES.indexOf(b) ? a : b;
    return {
      prompt: `Which is bigger: <b>${a}</b> or <b>${b}</b>?`,
      answer: K.fixed([a.charAt(0).toUpperCase() + a.slice(1), b.charAt(0).toUpperCase() + b.slice(1)], big.charAt(0).toUpperCase() + big.slice(1)),
      hint: 'Moon < Earth < Sun < Solar System < Milky Way < Universe.',
      working: ['Smallest → largest: ' + SIZES.join(' → ') + '.', `So <b>${big}</b> is bigger.`],
      finalAnswer: big, skill: 'space-scale-sizes',
    };
  }
  function modelQ(level) {
    const P = [['Mercury', 3], ['Venus', 5.5], ['Earth', 7.5], ['Mars', 11.5], ['Jupiter', 39], ['Saturn', 71], ['Uranus', 143], ['Neptune', 225]];
    const [a, b] = R.sample(P, 2).sort((x, y) => x[1] - y[1]);
    const diff = Math.round((b[1] - a[1]) * 10) / 10;
    return {
      prompt: `In the class Solar System model, ${a[0]} is <b>${a[1]} cm</b> from the Sun and ${b[0]} is <b>${b[1]} cm</b>. How far apart are they on the model (in cm)?`,
      visual: K.table(['Planet', 'Distance from Sun on display (cm)'], P.map((p) => [p[0], p[1]])),
      answer: K.num(diff, 'cm', 0.01),
      hint: 'Subtract the smaller distance from the bigger one.',
      working: [`${b[1]} − ${a[1]} = <b>${diff} cm</b>.`, 'Remember: the planet sizes use a different scale from the distances.'],
      finalAnswer: `${diff} cm`, skill: 'space-scale-model',
    };
  }
  const word = [
    (level) => ({
      prompt: 'Why don\'t astronomers measure the distance to other stars in kilometres?',
      answer: K.choice('The numbers would be far too big to use — light years are much easier', ['Kilometres only work on Earth', 'Stars move too fast', 'Nobody knows how far stars are'], level === 1 ? 3 : 4),
      hint: 'Proxima Centauri is 40 million million km away…', working: ['Proxima Centauri = 40 000 000 000 000 km.', 'Saying "4.27 light years" is much easier.'],
      finalAnswer: 'The numbers are too big', skill: 'space-scale-apply',
    }),
    (level) => ({
      prompt: 'A news report says a star 600 light years away has just exploded — but astronomers only saw it last night. When did it really explode?',
      answer: K.choice('About 600 years ago', ['Last night', '600 days ago', '6 million years ago'], level === 1 ? 3 : 4),
      hint: 'How long did the light take to get here?', working: ['Light from 600 light years away takes 600 years to arrive.', 'So the explosion really happened about 600 years ago.'],
      finalAnswer: 'About 600 years ago', skill: 'space-scale-apply',
    }),
    (level) => ({
      prompt: 'Mission control sends a laser signal to Mars. Why is there a delay of several minutes before it arrives?',
      answer: K.choice('Even at 300 000 km/s, light takes minutes to cross the huge distance', ['Lasers are slow', 'Mars is behind the Sun', 'Signals wait in a queue'], level === 1 ? 3 : 4),
      hint: 'Time = distance ÷ speed.', working: ['Mars is many millions of km away.', 'Distance ÷ 300 000 km/s = several minutes.'],
      finalAnswer: 'The distance is huge, even for light', skill: 'space-scale-apply',
    }),
  ];

  K.topic({
    id: 'space-scale', strand: 'earth', order: 0.15,
    name: 'Scale of the universe & light years', short: 'Scale & light years', animal: 'whale',
    blurb: 'How big is big: light years, astronomical units, light time and looking back in time.',
    example: 'Sunlight takes about 8 minutes to reach us',
    hint: 'Light: 300 000 km/s. Time = distance ÷ speed. A light year is a DISTANCE.',
    learn: {
      what: '<p>Distances in space are so huge that kilometres stop being useful. Astronomers use <b>light years</b> — how far light travels in a year (about <b>9.5 million million km</b>) — and, inside the Solar System, <b>astronomical units</b> (1 au = Earth to Sun = 150 million km). Because light takes time to travel, <b>looking at stars is looking back in time</b>.</p>',
      visual,
      facts: [
        'Light travels <b>300 000 km every second</b> — about 7 times around the Earth in one second.',
        '<b>Light year</b> = a distance: about 9.5 million million km. <b>1 au</b> = 150 million km (Earth to Sun).',
        'Sun: <b>8.3 light minutes</b> (150 million km) · Pluto: about 5 light hours · Proxima Centauri: <b>4.27 light years</b> (40 million million km) · Sirius: 8.7 light years · Milky Way: <b>100 000 light years</b> across · Andromeda: about <b>2.5 million light years</b>.',
        'Light from the far side of our galaxy takes about 100 000 years to reach us — some stars we see may already have died.',
        'Sizes: <b>Moon &lt; Earth &lt; Sun &lt; Solar System &lt; Milky Way &lt; Universe</b>. The Sun is about 109 Earths wide.',
        'Ages: universe about 14 billion years; Earth about 4.6 (≈5) billion years.',
        'Class model: planet sizes and distances use <b>different scales</b> — on the same scale Mercury would be 14 m from the Sun.',
        'The notes\' estimate: about 1000 million galaxies × 1000 million stars = 10¹⁸ stars.',
      ],
      steps: [
        'Time for light: <b>time = distance ÷ 300 000</b> (km → seconds).',
        'Light years → km: multiply by 9.5 million million.',
        'A star X light years away → the light left it X years ago.',
        'Ranking question: Moon → Earth → Sun → Solar System → Milky Way → Universe.',
      ],
      examples: [
        { q: 'A jet takes 48 hours to fly from here to London and back (40 000 km). How long would light take?', working: ['Time = distance ÷ speed.', '40 000 ÷ 300 000 = 0.13 seconds.'], a: 'About 0.13 seconds' },
        { q: 'What is a light year, and what is it used to measure?', working: ['The distance light travels in one year (≈ 9.5 million million km).', 'Used for distances between stars and galaxies.'], a: 'A distance — for stars and galaxies' },
        { q: 'How long does sunlight take to reach Earth?', working: ['The Sun is 150 million km away.', '150 000 000 ÷ 300 000 = 500 s ≈ 8.3 minutes.'], a: 'About 8 minutes' },
        { q: 'A star is 4 light years away. How far is that in km?', working: ['4 × 9.5 million million = 38 million million km.'], a: '38 million million km' },
        { q: 'Why might some stars we see no longer exist?', working: ['Their light took thousands of years to get here.', 'The star could have died since — we would not know yet.'], a: 'We see old light' },
        { q: 'Rank smallest to largest: Milky Way, Moon, Universe, Sun, Earth.', working: ['Moon is smaller than Earth; Sun is 109 Earths wide.', 'The Milky Way holds billions of suns; the universe holds billions of galaxies.'], a: 'Moon, Earth, Sun, Milky Way, Universe' },
      ],
      tips: [
        'A light <b>year</b> is a <b>distance</b> — the most common exam trap.',
        'Divide by 300 000 to get seconds; then ÷ 60 for minutes.',
        'Light minutes/hours: inside the Solar System. Light years: stars. Millions of light years: other galaxies.',
      ],
    },
    mcq, tf, groups, calc: [lightTimeQ, lightTimeQ, lightYearQ, lightYearQ, distQ, sizeQ, modelQ], word,
    weights: { mcq: 4, typed: 2, tf: 2, group: 1, calc: 5 },
  });
})(window.HL);
