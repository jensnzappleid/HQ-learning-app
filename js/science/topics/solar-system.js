/* Topic: The Solar System — Planet Earth & Space.
 * Variety comes from the PLANETS pool: which planet is asked, and which fact about it. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const PLANETS = [
    { n: 'Mercury', i: 1, type: 'rocky', moons: 0, r: 7,  fill: '#C7B9A8',
      feature: 'the smallest planet, and the closest to the Sun',
      clue: 'it is closest to the Sun and covered in craters like our Moon' },
    { n: 'Venus',   i: 2, type: 'rocky', moons: 0, r: 9,  fill: '#E8C24A',
      feature: 'the hottest planet, wrapped in thick clouds that trap the heat',
      clue: 'thick clouds trap the heat, so it is hotter than Mercury' },
    { n: 'Earth',   i: 3, type: 'rocky', moons: 1, r: 9,  fill: '#5F98C4',
      feature: 'the only planet we know of with liquid water and living things',
      clue: 'it has oceans, air we can breathe and living things' },
    { n: 'Mars',    i: 4, type: 'rocky', moons: 2, r: 8,  fill: '#E9A07A',
      feature: 'the red planet, covered in rusty dust',
      clue: 'its rusty red dust and the tallest volcano in the Solar System' },
    { n: 'Jupiter', i: 5, type: 'gas',   moons: 95, r: 17, fill: '#E8A05A',
      feature: 'the biggest planet, with a giant storm called the Great Red Spot',
      clue: 'it is the biggest planet and has the Great Red Spot storm' },
    { n: 'Saturn',  i: 6, type: 'gas',   moons: 146, r: 15, fill: '#E8C24A',
      feature: 'famous for its bright rings of ice and rock',
      clue: 'its bright rings made of ice and rock' },
    { n: 'Uranus',  i: 7, type: 'gas',   moons: 28, r: 12, fill: '#A9D8F5',
      feature: 'tipped right over on its side, so it rolls around the Sun',
      clue: 'it is tipped on its side and is a pale blue-green ice giant' },
    { n: 'Neptune', i: 8, type: 'gas',   moons: 16, r: 12, fill: '#5F98C4',
      feature: 'the furthest planet from the Sun, deep blue and very windy',
      clue: 'it is the furthest planet out, deep blue with the fastest winds' },
  ];
  const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const BODIES = [
    { name: 'star', def: 'a huge ball of hot gas that makes its own light and heat', eg: 'the Sun' },
    { name: 'planet', def: 'a big round object that orbits a star and does not make its own light', eg: 'Mars' },
    { name: 'moon', def: 'an object that orbits a planet', eg: 'our Moon' },
    { name: 'asteroid', def: 'a lump of rock, most of them in the belt between Mars and Jupiter', eg: 'Ceres' },
    { name: 'comet', def: 'a ball of ice and dust that grows a glowing tail when it comes near the Sun', eg: "Halley's Comet" },
    { name: 'galaxy', def: 'a huge group of billions of stars held together by gravity', eg: 'the Milky Way' },
  ];

  const SUPERLATIVE = [
    { q: 'the biggest planet', a: 'Jupiter' },
    { q: 'the smallest planet', a: 'Mercury' },
    { q: 'the hottest planet', a: 'Venus' },
    { q: 'the planet closest to the Sun', a: 'Mercury' },
    { q: 'the planet furthest from the Sun', a: 'Neptune' },
    { q: 'the planet with the brightest rings', a: 'Saturn' },
    { q: 'the planet we live on', a: 'Earth' },
    { q: 'the red planet', a: 'Mars' },
    { q: 'the planet that is tipped on its side', a: 'Uranus' },
    { q: 'the planet with the Great Red Spot', a: 'Jupiter' },
  ];

  const ORBIT_YEARS = [
    { n: 'Mercury', y: 0.24 }, { n: 'Mars', y: 2 }, { n: 'Jupiter', y: 12 },
    { n: 'Saturn', y: 29 }, { n: 'Uranus', y: 84 }, { n: 'Neptune', y: 165 },
  ];

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const names = (not) => PLANETS.map((p) => p.n).filter((x) => x !== not);
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  const BODY_ACCEPT = { star: ['a star'], planet: ['a planet'], moon: ['a moon'], asteroid: ['an asteroid'], comet: ['a comet'], galaxy: ['a galaxy'] };

  /* ---------- diagrams ---------- */
  function planetsSvg(opts) {
    opts = opts || {};
    const hi = opts.highlight;            // planet name to ring with a "?"
    const showNames = opts.names !== false;
    const px = (i) => 46 + i * 41;
    let s = `<svg viewBox="0 0 360 176" width="360" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11.5" font-weight="700">
      <rect x="0" y="0" width="360" height="176" fill="#FFFFFF"/>
      <circle cx="0" cy="90" r="32" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="8" y="94" fill="#4A4033" font-size="11">Sun</text>
      <line x1="34" y1="90" x2="352" y2="90" stroke="#E7DCC8" stroke-width="2"/>`;
    PLANETS.forEach((p, k) => {
      const x = px(k), up = k % 2 === 0;
      const isHi = hi === p.n;
      s += `<circle cx="${x}" cy="90" r="${p.r}" fill="${p.fill}" stroke="#4A4033" stroke-width="1.5"/>`;
      if (p.n === 'Saturn') s += `<ellipse cx="${x}" cy="90" rx="${p.r + 8}" ry="4" fill="none" stroke="#C98A1C" stroke-width="2.5"/>`;
      if (isHi) s += `<circle cx="${x}" cy="90" r="${p.r + 7}" fill="none" stroke="#E0568C" stroke-width="3"/>`;
      const ly = up ? 52 : 140;
      const label = isHi ? '?' : showNames ? p.n : String(k + 1);
      s += `<line x1="${x}" y1="${up ? 90 - p.r - 4 : 90 + p.r + 4}" x2="${x}" y2="${up ? ly + 5 : ly - 12}" stroke="#C9BCA6" stroke-width="1.5"/>`;
      s += `<text x="${x}" y="${ly}" text-anchor="middle" fill="${isHi ? '#E0568C' : '#4A4033'}" font-size="${isHi ? 16 : 11.5}">${label}</text>`;
    });
    // asteroid belt between Mars and Jupiter
    const bx = (px(3) + px(4)) / 2;
    s += [[-6, -8], [0, 0], [5, 7], [-3, 6], [4, -6]].map(([dx, dy]) => `<circle cx="${bx + dx}" cy="${90 + dy}" r="1.8" fill="#8A7B63"/>`).join('');
    s += `<text x="180" y="168" text-anchor="middle" fill="#8A7B63" font-size="11">← rocky planets · asteroid belt · gas giants →</text>`;
    return s + '</svg>';
  }

  function scaleSvg() {
    return `<svg viewBox="0 0 340 150" width="340" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="0" y="0" width="340" height="150" fill="#FFFFFF"/>
      <circle cx="34" cy="60" r="26" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="34" y="106" text-anchor="middle" fill="#4A4033">Sun</text>
      <circle cx="150" cy="60" r="6" fill="#5F98C4" stroke="#4A4033" stroke-width="1.5"/>
      <text x="150" y="106" text-anchor="middle" fill="#4A4033">Earth</text>
      <circle cx="300" cy="60" r="6" fill="#5F98C4" stroke="#4A4033" stroke-width="1.5"/>
      <text x="300" y="106" text-anchor="middle" fill="#4A4033">Neptune</text>
      <line x1="60" y1="34" x2="144" y2="34" stroke="#E0568C" stroke-width="2.5"/>
      <text x="102" y="26" text-anchor="middle" fill="#E0568C" font-size="11.5">150 million km</text>
      <line x1="158" y1="34" x2="294" y2="34" stroke="#5F98C4" stroke-width="2.5"/>
      <text x="226" y="26" text-anchor="middle" fill="#5F98C4" font-size="11.5">30 × further out</text>
      <text x="170" y="132" text-anchor="middle" fill="#4A4033" font-size="12">Space is mostly empty space!</text>
    </svg>`;
  }

  function orbitSvg() {
    return `<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="0" y="0" width="300" height="190" fill="#FFFFFF"/>
      <ellipse cx="150" cy="92" rx="118" ry="66" fill="none" stroke="#C9BCA6" stroke-width="2" stroke-dasharray="6 5"/>
      <circle cx="150" cy="92" r="24" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="150" y="96" text-anchor="middle" fill="#4A4033" font-size="11.5">Sun</text>
      <circle cx="268" cy="92" r="9" fill="#5F98C4" stroke="#4A4033" stroke-width="1.5"/>
      <line x1="256" y1="92" x2="180" y2="92" stroke="#E0568C" stroke-width="3"/>
      <polygon points="180,92 190,87 190,97" fill="#E0568C"/>
      <text x="212" y="78" text-anchor="middle" fill="#E0568C" font-size="11.5">gravity pulls in</text>
      <line x1="268" y1="80" x2="268" y2="26" stroke="#6FA04C" stroke-width="3"/>
      <polygon points="268,20 263,32 273,32" fill="#6FA04C"/>
      <text x="268" y="14" text-anchor="middle" fill="#6FA04C" font-size="11.5">moving</text>
      <text x="150" y="180" text-anchor="middle" fill="#4A4033">pull in + moving along = a curved orbit</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function positionQ(level) {
    const p = R.pick(PLANETS);
    if (R.chance(0.5)) {
      return {
        visual: planetsSvg({ names: false }),
        prompt: `Counting outwards from the Sun, <b>${p.n}</b> is which planet? (Give the number.)`,
        answer: { type: 'number', value: p.i, placeholder: 'e.g. 3' },
        hint: 'My Very Easy Method Just Speeds Up Names → Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
        working: ['<b>Picture:</b> the planets lined up in a row leaving the Sun.', `Count: ${PLANETS.slice(0, p.i).map((q) => q.n).join(' → ')}.`, `${p.n} is planet number <b>${p.i}</b>.`],
        finalAnswer: `${p.i} (${ORDINAL[p.i]})`, skill: 'order',
      };
    }
    return {
      visual: planetsSvg({ highlight: p.n }),
      prompt: `Which planet is <b>${ORDINAL[p.i]}</b> from the Sun?`,
      answer: textAns(p.n, [], 'type the planet name'),
      hint: 'My Very Easy Method Just Speeds Up Names.',
      working: ['<b>Picture:</b> the planets lined up in a row leaving the Sun.', `Count out: ${PLANETS.slice(0, p.i).map((q) => q.n).join(' → ')}.`, `The ${ORDINAL[p.i]} planet is <b>${p.n}</b>.`],
      finalAnswer: p.n, skill: 'order',
    };
  }

  function neighbourQ(level) {
    const k = R.int(0, 6);
    const out = R.chance(0.5) || k === 0;
    const from = out ? PLANETS[k] : PLANETS[k + 1];
    const ans = out ? PLANETS[k + 1] : PLANETS[k];
    return {
      prompt: `Which planet comes straight <b>${out ? 'after' : 'before'}</b> ${from.n}${out ? ', going away from the Sun' : ', going back towards the Sun'}?`,
      answer: textAns(ans.n, [], 'type the planet name'),
      hint: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
      working: ['<b>Picture:</b> the planets in a row, Sun on the left.', `${from.n} is number ${from.i}.`, `So the one ${out ? 'after' : 'before'} it is number ${ans.i} — <b>${ans.n}</b>.`],
      finalAnswer: ans.n, skill: 'order',
    };
  }

  function orderRunQ(level) {
    const k = R.int(0, PLANETS.length - (level === 1 ? 3 : 4));
    const run = PLANETS.slice(k, k + (level === 1 ? 3 : 4)).map((p) => p.n);
    const correct = run.join(' → ');
    const wrongs = [];
    for (let t = 0; t < 6; t++) {
      const s = R.shuffle(run).join(' → ');
      if (s !== correct && !wrongs.includes(s)) wrongs.push(s);
    }
    const c = choice(correct, wrongs);
    return {
      visual: planetsSvg({ names: false }),
      prompt: `Which list puts these planets in the right order, <b>closest to the Sun first</b>?<br>${R.shuffle(run).join(', ')}`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Say the mnemonic: My Very Easy Method Just Speeds Up Names.',
      working: ['<b>Picture:</b> walking outwards from the Sun, one planet at a time.', 'Full order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', `So it is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'order',
    };
  }

  function rockyOrGasQ(level) {
    const p = R.pick(PLANETS);
    const correct = p.type === 'rocky' ? 'A rocky planet (small, solid ground)' : 'A gas giant (huge, no solid surface)';
    return {
      prompt: `Is <b>${p.n}</b> a rocky planet or a gas giant?`,
      answer: textAns(p.type === 'rocky' ? 'rocky planet' : 'gas giant', p.type === 'rocky' ? ['rocky', 'a rocky planet'] : ['gas', 'a gas giant'], 'two words'),
      hint: 'The first four (Mercury, Venus, Earth, Mars) are rocky. The outer four are gas giants.',
      working: ['<b>Picture:</b> four small marbles close to the Sun, then four beach balls far out.', `${p.n} is planet number ${p.i}.`, `Number ${p.i} is in the ${p.i <= 4 ? 'inner four' : 'outer four'}, so it is <b>${p.type === 'rocky' ? 'a rocky planet' : 'a gas giant'}</b>.`],
      finalAnswer: p.type === 'rocky' ? 'A rocky planet' : 'A gas giant', skill: 'rocky-gas',
    };
  }

  function featureQ(level) {
    const p = R.pick(PLANETS);
    if (R.chance(0.5)) {
      const c = choice(p.feature, PLANETS.map((q) => q.feature));
      return {
        prompt: `What is <b>${p.n}</b> known for?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Think about ${p.clue}.`,
        working: [`<b>Picture:</b> a poster of ${p.n} on the wall.`, `${p.n} is ${p.feature}.`],
        finalAnswer: p.feature, skill: 'features',
      };
    }
    return {
      prompt: `Which planet is <b>${p.feature}</b>?`,
      answer: textAns(p.n, [], 'type the planet name'),
      hint: `Its other clue: ${p.clue}.`,
      working: ['<b>Picture:</b> matching each planet to its one famous fact.', `That describes <b>${p.n}</b>.`],
      finalAnswer: p.n, skill: 'features',
    };
  }

  function superlativeQ(level) {
    const s = R.pick(SUPERLATIVE);
    return {
      prompt: `Which planet is <b>${s.q}</b>?`,
      answer: textAns(s.a, [], 'type the planet name'),
      hint: 'Picture the row of planets and their sizes.',
      working: ['<b>Picture:</b> the planets lined up from the Sun outwards.', `${s.q.charAt(0).toUpperCase() + s.q.slice(1)} is <b>${s.a}</b>.`],
      finalAnswer: s.a, skill: 'features',
    };
  }

  function bodyQ(level) {
    const b = R.pick(BODIES);
    if (R.chance(0.5)) {
      const c = choice(b.def, BODIES.map((x) => x.def));
      return {
        prompt: `What is a <b>${b.name}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `${b.eg} is one.`,
        working: [`<b>Picture:</b> ${b.eg}.`, `A ${b.name} is <b>${b.def}</b>.`],
        finalAnswer: b.def, skill: 'bodies',
      };
    }
    return {
      prompt: `Which word means "${b.def}"?`,
      answer: textAns(b.name, BODY_ACCEPT[b.name], 'one word'),
      hint: `One example is ${b.eg}.`,
      working: [`<b>Picture:</b> ${b.eg}.`, `That is a <b>${b.name}</b>.`],
      finalAnswer: b.name, skill: 'bodies',
    };
  }

  function starPlanetMoonQ(level) {
    const items = [
      { thing: 'the Sun', kind: 'a star', why: 'it makes its own light and heat' },
      { thing: 'Jupiter', kind: 'a planet', why: 'it orbits the Sun and only reflects light' },
      { thing: 'our Moon', kind: 'a moon', why: 'it orbits a planet (Earth)' },
      { thing: 'Titan, which orbits Saturn', kind: 'a moon', why: 'it orbits a planet' },
      { thing: 'Mars', kind: 'a planet', why: 'it orbits the Sun and makes no light of its own' },
      { thing: "Halley's Comet", kind: 'a comet', why: 'it is ice and dust with a tail near the Sun' },
      { thing: 'Sirius, the brightest star in the night sky', kind: 'a star', why: 'it makes its own light' },
    ];
    const it = R.pick(items);
    return {
      prompt: `Is <b>${it.thing}</b> a star, a planet, a moon or a comet?`,
      answer: textAns(it.kind.replace(/^a /, ''), [it.kind], 'one word'),
      hint: 'Star = makes its own light. Planet = orbits a star. Moon = orbits a planet.',
      working: ['<b>Picture:</b> a torch (star), a ball lit by the torch (planet), a smaller ball going round the ball (moon).', `${it.thing.charAt(0).toUpperCase() + it.thing.slice(1)}: ${it.why}.`, `So it is <b>${it.kind}</b>.`],
      finalAnswer: it.kind, skill: 'bodies',
    };
  }

  function gravityQ(level) {
    const items = [
      { q: 'What holds the planets in their orbits around the Sun?', a: 'The Sun&rsquo;s gravity', w: ['Gravity is a pull between any two objects with mass.', 'The Sun is by far the heaviest thing here, so its pull is huge.', 'That pull keeps the planets curving around it.'],
        wrongs: ['The Sun&rsquo;s heat', 'The air between them', 'Magnets in the planets'] },
      { q: 'If the Sun&rsquo;s gravity suddenly switched off, what would Earth do?', a: 'Fly off in a straight line', w: ['<b>Picture:</b> swinging a ball on a string. The string is gravity.', 'Let go of the string and the ball does not stop — it flies off straight.', 'So Earth would <b>travel off in a straight line</b>.'],
        wrongs: ['Stop dead where it is', 'Fall straight into the Sun', 'Start spinning much faster'] },
      { q: 'Why does a moon stay near its planet instead of drifting away?', a: 'The planet&rsquo;s gravity keeps pulling it in', w: ['Gravity acts between the planet and the moon.', 'The moon is moving sideways at the same time.', 'Pull in + moving sideways = it goes round and round.'],
        wrongs: ['The moon is stuck to the planet', 'Space pushes it back', 'The Sun pushes it there'] },
      { q: 'Which object in the Solar System has the strongest gravity?', a: 'The Sun', w: ['Gravity gets stronger the more mass something has.', 'The Sun holds about 99.8% of all the mass in the Solar System.', 'So the <b>Sun</b> has the strongest pull.'],
        wrongs: ['Jupiter', 'Earth', 'The Moon'] },
      { q: 'Astronauts weigh less on the Moon than on Earth. Why?', a: 'The Moon is much smaller, so its gravity is weaker', w: ['Weight is how hard gravity pulls on you.', 'The Moon has much less mass than Earth.', 'Less mass → <b>weaker gravity</b> → you weigh less (but you are still you).'],
        wrongs: ['There is no gravity at all on the Moon', 'Space suits make people lighter', 'They are further from the Sun'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Gravity is a pull. The heavier the object, the stronger the pull.',
      working: it.w, finalAnswer: it.a, skill: 'gravity',
      visual: it.q.indexOf('orbits') > -1 ? orbitSvg() : undefined,
    };
  }

  function moonsQ(level) {
    const p = R.pick(PLANETS.filter((x) => x.moons <= 2));
    const c = choice(String(p.moons), ['0', '1', '2', '4'], 4);
    return {
      prompt: `How many moons does <b>${p.n}</b> have?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Mercury and Venus have none, Earth has one, Mars has two small ones.',
      working: ['<b>Picture:</b> the inner planets have hardly any moons; the gas giants have dozens.', `${p.n} has <b>${p.moons}</b>.`],
      finalAnswer: String(p.moons), skill: 'moons',
    };
  }

  function orbitYearsQ(level) {
    const o = R.pick(ORBIT_YEARS.filter((x) => x.y >= 2));
    const k = R.pick([2, 3, 4, 5]);
    return {
      prompt: `${o.n} takes about <b>${o.y} Earth years</b> to go once around the Sun. How many Earth years is <b>${k} orbits</b>?`,
      answer: { type: 'number', value: o.y * k, unit: 'years', placeholder: 'e.g. 24' },
      hint: `Multiply ${o.y} by ${k}.`,
      working: ['<b>Picture:</b> one lap of the running track = one orbit.', `${o.y} × ${k} = <b>${o.y * k}</b>.`, `So ${k} orbits of ${o.n} take ${o.y * k} Earth years.`],
      finalAnswer: `${o.y * k} years`, skill: 'orbits',
    };
  }

  function countTypeQ(level) {
    const which = R.pick(['rocky', 'gas']);
    const n = PLANETS.filter((p) => p.type === which).length;
    return {
      prompt: `How many <b>${which === 'rocky' ? 'rocky planets' : 'gas giants'}</b> are there in our Solar System?`,
      answer: { type: 'number', value: n, placeholder: 'e.g. 4' },
      hint: 'Eight planets, split evenly by the asteroid belt.',
      working: ['<b>Picture:</b> four marbles, then the asteroid belt, then four beach balls.', `${which === 'rocky' ? 'Mercury, Venus, Earth, Mars' : 'Jupiter, Saturn, Uranus, Neptune'} = <b>${n}</b>.`],
      finalAnswer: String(n), skill: 'rocky-gas',
    };
  }

  function sunTextQ(level) {
    const items = [
      { q: 'What is the name of the star at the centre of our Solar System?', a: 'sun', accept: ['the sun', 'sol'] },
      { q: 'What do we call the path a planet takes around the Sun?', a: 'orbit', accept: ['an orbit', 'orbits', 'its orbit'] },
      { q: 'What is the force that keeps the planets going round the Sun?', a: 'gravity', accept: ['the force of gravity', 'gravitational force'] },
      { q: 'What do we call a ball of ice and dust that grows a tail near the Sun?', a: 'comet', accept: ['a comet', 'comets'] },
      { q: 'What do we call the ring of rocks between Mars and Jupiter?', a: 'asteroid belt', accept: ['the asteroid belt', 'asteroids', 'asteroid'] },
      { q: 'What is the name of our galaxy?', a: 'milky way', accept: ['the milky way', 'milkyway'] },
      { q: 'Which planet do we live on?', a: 'earth', accept: ['the earth', 'planet earth'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one word or two)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Say it out loud first — it is a word you already know.',
      working: ['Think back to the picture of the Solar System.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  function scaleQ(level) {
    const items = [
      { q: 'Sunlight takes about 8 minutes to reach Earth. What does that tell us?', a: 'The Sun is a very long way away', wrongs: ['The Sun moves slowly', 'Light is slow', 'The Sun is close to Earth'],
        w: ['Light is the fastest thing there is — 300,000 km every second.', 'Even so it takes 8 whole minutes to get here.', 'So the Sun must be <b>very, very far away</b> (about 150 million km).'] },
      { q: 'Why do the planets look like tiny dots of light from Earth?', a: 'They are enormously far away', wrongs: ['They are actually tiny', 'They are behind clouds', 'They make very little light of their own'],
        w: ['<b>Picture:</b> a bus looks like a dot when it is kilometres away.', 'Jupiter is 11 times wider than Earth but still looks like a dot.', 'That is because it is <b>hundreds of millions of km away</b>.'] },
      { q: 'If Earth were shrunk to the size of a pea, the Sun would be about the size of a beach ball. How far away would the pea have to sit?', a: 'About 25 metres away — most of a netball court', wrongs: ['About 25 centimetres away', 'Touching the beach ball', 'About 2 metres away'],
        w: ['<b>Picture:</b> a beach ball at one end of the netball court and a pea at the other.', 'Space is mostly empty — the gaps are far bigger than the objects.', 'So the pea sits about <b>25 m</b> away.'] },
      { q: 'Which is bigger: the distance from the Sun to Earth, or the distance from the Sun to Neptune?', a: 'Sun to Neptune — about 30 times bigger', wrongs: ['Sun to Earth', 'They are the same', 'Sun to Neptune, but only twice as big'],
        w: ['Neptune is the 8th planet, Earth is the 3rd.', 'Neptune sits about 30 times further out than Earth.', 'So <b>Sun → Neptune</b> is much bigger.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: scaleSvg(),
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Space is mostly empty space — the distances are much bigger than the objects.',
      working: it.w, finalAnswer: it.a, skill: 'scale',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const p = R.pick(PLANETS.filter((x) => x.type === 'gas'));
      const c = choice('There is no solid ground to land on', ['It is too cold to land', 'It spins too fast to land', 'There is no gravity there'], 4);
      return {
        prompt: `A space agency wants to land a robot on <b>${p.n}</b>. Why is that a problem?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What are the outer four planets actually made of?',
        working: ['<b>Picture:</b> trying to park a car on a cloud.', `1. Is ${p.n} rocky or gas? It is a <b>gas giant</b>.`, 'Gas giants have no solid surface, so <b>there is nothing to land on</b>.'],
        finalAnswer: 'There is no solid ground to land on',
      };
    },
    () => {
      const c = choice('Venus — its thick clouds trap the heat', ['Mercury — it is closest to the Sun', 'Mars — its red dust holds heat', 'Jupiter — it is the biggest'], 4);
      return {
        prompt: 'Harper expects Mercury to be the hottest planet because it is closest to the Sun. Her book says a different planet is hotter. Which one, and why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Think about what a blanket does, even on a cold night.',
        working: ['<b>Picture:</b> a car left in the sun with the windows shut.', '1. Does Mercury have an atmosphere? Almost none — heat escapes at night.', '2. Does Venus? Yes — thick clouds like a blanket.', 'So <b>Venus</b> is hotter, because its clouds trap the heat.'],
        finalAnswer: 'Venus — its thick clouds trap the heat',
      };
    },
    () => {
      const c = choice('The Moon reflects sunlight — it does not make its own', ['The Moon is a small star', 'The Moon is burning', 'The Moon glows because it is hot'], 4);
      return {
        prompt: 'The Moon looks bright in the night sky. Does that mean the Moon makes its own light?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Only stars make their own light.',
        working: ['<b>Picture:</b> a mirror in a dark room — it looks bright only when a torch shines on it.', '1. Is the Moon a star? No, it is a moon.', 'So it must be <b>reflecting sunlight</b>.'],
        finalAnswer: 'The Moon reflects sunlight — it does not make its own',
      };
    },
    () => {
      const p = R.pick(PLANETS);
      const c = choice(p.n, names(p.n));
      return {
        visual: planetsSvg({ highlight: p.n }),
        prompt: 'Harper is labelling a poster of the Solar System. Which planet belongs in the circled spot?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Count out from the Sun: My Very Easy Method Just Speeds Up Names.',
        working: ['<b>Picture:</b> counting the planets outwards from the Sun.', `The circled planet is number ${p.i}.`, `Number ${p.i} is <b>${p.n}</b>.`],
        finalAnswer: p.n,
      };
    },
    () => {
      const c = choice('A comet — its tail only grows near the Sun', ['A planet', 'A moon', 'A galaxy'], 4);
      return {
        prompt: 'A fuzzy object appears in the sky with a long glowing tail that points away from the Sun. What has Harper spotted?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Ice + dust + heat from the Sun = a tail.',
        working: ['<b>Picture:</b> a dirty snowball melting and streaming behind itself.', '1. Do planets have tails? No.', '2. What is made of ice and dust? A comet.', 'The Sun heats it and blows the gas and dust into a <b>tail</b>.'],
        finalAnswer: 'A comet — its tail only grows near the Sun',
      };
    },
    () => {
      const c = choice('Jupiter — it is much more massive, so its gravity is stronger', ['Mercury — it is closer to the Sun', 'Mars — it has two moons already', 'They would be exactly the same'], 4);
      return {
        prompt: 'A rock drifts close to Jupiter and also close to Mercury. Which planet is more likely to capture it as a moon?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'More mass → stronger pull. Count who has the most moons.',
        working: ['<b>Picture:</b> a big magnet and a tiny magnet.', '1. Which planet has more mass? Jupiter, by far.', '2. More mass means stronger gravity.', 'That is why Jupiter has about 95 moons and Mercury has <b>none</b>.'],
        finalAnswer: 'Jupiter — it is much more massive, so its gravity is stronger',
      };
    },
    () => {
      const c = choice('Between Mars and Jupiter', ['Between Earth and Mars', 'Beyond Neptune', 'Between the Sun and Mercury'], 4);
      return {
        prompt: 'A probe flying outwards from Earth passes through a wide band of rocky rubble. Where in the Solar System is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'It is the belt that splits the rocky planets from the gas giants.',
        working: ['<b>Picture:</b> a gravel road between the marbles and the beach balls.', 'That band is the <b>asteroid belt</b>.', 'It sits <b>between Mars and Jupiter</b>.'],
        finalAnswer: 'Between Mars and Jupiter',
      };
    },
    () => {
      const c = choice('The Sun — everything else orbits it', ['Earth — we live on it', 'Jupiter — it is the biggest planet', 'The Moon — it is closest to us'], 4);
      return {
        prompt: 'Harper builds a Solar System mobile for her bedroom. Which object should go in the middle, and why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which object has the strongest gravity?',
        working: ['<b>Picture:</b> a merry-go-round — everything spins around the middle pole.', '1. What holds the planets in? The Sun&rsquo;s gravity.', 'So the <b>Sun</b> goes in the middle and the planets orbit it.'],
        finalAnswer: 'The Sun — everything else orbits it',
      };
    },
    () => {
      const p = R.pick(PLANETS.filter((x) => x.i >= 5));
      const c = choice(`${p.n} — it is much further from the Sun`, ['Mercury — it has no clouds', 'Venus — it is covered in clouds', 'Earth — it has oceans'], 4);
      return {
        prompt: `Which would be colder at the cloud tops: Mercury or ${p.n}? Pick the right answer <b>and</b> the right reason.`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The further from a heater you sit, the less heat reaches you.',
        working: ['<b>Picture:</b> standing near a campfire, then walking a long way back.', `1. Which is further out? ${p.n} (planet ${p.i}) is far past Mercury (planet 1).`, `Sunlight spreads out and weakens, so <b>${p.n}</b> is much colder.`],
        finalAnswer: `${p.n} — it is much further from the Sun`,
      };
    },
    () => {
      const c = choice('No — a star makes its own light, a planet does not', ['Yes — they both shine', 'Yes — both orbit the Sun', 'No — planets are hotter than stars'], 4);
      return {
        prompt: 'Harper points at a bright dot and says "that star is Venus". Is calling Venus a star correct?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What is the one thing only stars do?',
        working: ['<b>Picture:</b> a torch (star) and a ball lit up by the torch (planet).', '1. Does Venus make its own light? No — it reflects sunlight.', 'So Venus is a <b>planet</b>, not a star, even though it looks bright.'],
        finalAnswer: 'No — a star makes its own light, a planet does not',
      };
    },
    () => {
      const o = R.pick(ORBIT_YEARS.filter((x) => x.y >= 12));
      const c = choice(`${o.n} — it has a much longer path to travel`, ['Earth — it spins faster', 'Earth — it is heavier', 'They take the same time'], 4);
      return {
        prompt: `Earth takes 1 year to orbit the Sun. ${o.n} takes about ${o.y} years. Which planet has the longer journey, and why?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The further out you are, the bigger the circle you have to go round.',
        working: ['<b>Picture:</b> the inside lane and the outside lane of a running track.', `1. Which planet is further out? ${o.n}.`, 'A bigger orbit is a longer path <b>and</b> the planet travels more slowly.', `So ${o.n} takes ${o.y} Earth years for one lap.`],
        finalAnswer: `${o.n} — it has a much longer path to travel`,
      };
    },
  ];

  HL.registerTopic({
    id: 'solar-system', subject: 'science', strand: 'earth', order: 1,
    name: 'The Solar System', short: 'Solar System', animal: 'whale',
    blurb: 'The Sun, the eight planets, their moons, and the huge empty space in between.',
    example: 'My Very Easy Method Just Speeds Up Names',
    learn: {
      what: '<p>Our <b>Solar System</b> is the Sun plus everything its gravity holds on to: eight <b>planets</b>, their <b>moons</b>, plus asteroids and comets. The four planets nearest the Sun are small and <b>rocky</b>; the four furthest out are huge <b>gas giants</b>. Everything goes round the Sun in a path called an <b>orbit</b>.</p><p><b>Picture for this topic:</b> a <b>merry-go-round</b>. The Sun is the pole in the middle, gravity is the arm holding on, and the planets are riders going round — the ones on the outside have much further to travel.</p>',
      visual: planetsSvg({}),
      facts: [
        'Order out from the Sun: <b>Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune</b> — <i>My Very Easy Method Just Speeds Up Names</i>',
        'Inner four = <b>rocky</b> (solid ground). Outer four = <b>gas giants</b> (no surface to stand on)',
        '<b>Star</b> makes its own light · <b>planet</b> orbits a star · <b>moon</b> orbits a planet',
        'The Sun&rsquo;s <b>gravity</b> keeps every planet in orbit — pull inwards + moving sideways = a curve',
        'The <b>asteroid belt</b> (rocks) sits between Mars and Jupiter; <b>comets</b> are ice and dust with a tail',
        'Distances are <b>enormous</b>: sunlight takes 8 minutes to reach us; Neptune is 30× further out than Earth',
      ],
      steps: [
        'To place a planet, say the mnemonic in your head: "<b>My Very Easy Method Just Speeds Up Names</b>" and count on your fingers.',
        'Ask "<b>is it in the inner four or the outer four?</b>" Inner four = small and rocky. Outer four = giant and gassy.',
        'For "star, planet or moon?", ask "<b>does it make its own light?</b>" Yes → star. No → does it go round a star (planet) or round a planet (moon)?',
        'For anything about orbits, remember the merry-go-round: <b>gravity pulls in, movement carries it sideways</b>, so it curves round instead of flying off.',
        'If a question is about size or distance, remember space is <b>mostly empty</b> — the gaps are far bigger than the objects.',
      ],
      examples: [
        { q: 'Which planet is 5th from the Sun?',
          working: ['<b>Picture:</b> counting riders on the merry-go-round from the middle out.', '1. Say the mnemonic: My (Mercury) Very (Venus) Easy (Earth) Method (Mars) Just (Jupiter)…', '2. The 5th word is "Just" → Jupiter.'],
          a: 'Jupiter' },
        { q: 'Is Saturn a rocky planet or a gas giant? How do you know?',
          visual: planetsSvg({}),
          working: ['<b>Picture:</b> four marbles near the Sun, then the gravel belt, then four beach balls.', '1. Where is Saturn? Number 6 — that is past the asteroid belt.', '2. Everything past the belt is a gas giant.', 'So Saturn is a <b>gas giant</b> — you could not land on it.'],
          a: 'A gas giant' },
        { q: 'Titan goes around Saturn, and Saturn goes around the Sun. Is Titan a star, a planet or a moon?',
          working: ['<b>Picture:</b> a torch (star), a ball lit by it (planet), a small ball circling that ball (moon).', '1. Does Titan make its own light? No.', '2. Does it orbit a star, or a planet? A planet — Saturn.', 'Something that orbits a planet is a <b>moon</b>.'],
          a: 'A moon' },
        { q: 'What keeps Earth going round the Sun instead of flying off into space?',
          visual: orbitSvg(),
          working: ['<b>Picture:</b> swinging a ball on a string around your head. The string is <b>gravity</b>.', '1. What pulls Earth inwards? The Sun&rsquo;s gravity.', '2. What stops it falling in? Earth is also moving sideways, fast.', 'Pull in + moving sideways = a curved <b>orbit</b>.'],
          a: 'The Sun&rsquo;s gravity, while Earth keeps moving sideways' },
        { q: 'Jupiter takes about 12 Earth years for one orbit. How many Earth years do 4 orbits take?',
          working: ['<b>Picture:</b> 4 laps of the running track.', '1. One lap = 12 years.', '2. 12 × 4 = 48.'],
          a: '48 Earth years' },
        { q: 'Mercury is closest to the Sun, but Venus is hotter. Explain why.',
          working: ['<b>Picture:</b> two cars in the sun — one with the windows open, one shut tight.', '1. Does Mercury have a thick atmosphere? No, so its heat escapes at night.', '2. Does Venus? Yes — thick clouds, like a blanket.', 'The clouds <b>trap the heat</b>, so Venus stays about 460 °C day and night.'],
          a: 'Venus&rsquo;s thick clouds trap the heat' },
        { q: 'If Earth were a pea, the Sun would be a beach ball. About how far apart should they sit?',
          visual: scaleSvg(),
          working: ['<b>Picture:</b> a beach ball at one end of the netball court, a pea at the other.', '1. Is space mostly full or mostly empty? Mostly <b>empty</b>.', '2. Real distance: 150 million km — light itself takes 8 minutes.', 'On that model the pea sits about <b>25 metres</b> away.'],
          a: 'About 25 metres apart' },
      ],
      tips: [
        'The Sun is a <b>star</b>, not a planet — it is the only thing here that makes its own light.',
        'Closest to the Sun does <b>not</b> mean hottest: Venus beats Mercury because of its blanket of cloud.',
        'Planets do not "float" because there is no gravity — gravity is exactly what keeps them going round.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [positionQ, neighbourQ, rockyOrGasQ, featureQ, superlativeQ, sunTextQ, moonsQ, bodyQ]
        : level === 2
          ? [positionQ, neighbourQ, orderRunQ, rockyOrGasQ, featureQ, superlativeQ, bodyQ, starPlanetMoonQ, gravityQ, moonsQ, countTypeQ, sunTextQ]
          : [orderRunQ, featureQ, bodyQ, starPlanetMoonQ, gravityQ, orbitYearsQ, scaleQ, countTypeQ, positionQ, superlativeQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
