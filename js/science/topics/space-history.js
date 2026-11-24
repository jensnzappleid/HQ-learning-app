/* Topic: History of cosmology — from the ancient Greeks to Newton.
 * Year 8 Cosmology LO1 (workbook) / LO3 (notes). Facts as the class notes teach them; where the
 * notes are loose with a date, the question avoids the date rather than teach a wrong one. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const modelSvg = (helio) => {
    const centre = helio ? { fill: '#F6C343', label: 'Sun' } : { fill: '#5F98C4', label: 'Earth' };
    const ring = helio ? [['Mercury', 34], ['Venus', 50], ['Earth', 66], ['Mars', 82]] : [['Moon', 30], ['Sun', 52], ['Mars', 70], ['stars', 88]];
    return `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
      <rect x="2" y="2" width="196" height="196" rx="12" fill="#14213D"/>
      ${ring.map(([n, r], i) => `<circle cx="100" cy="100" r="${r}" fill="none" stroke="#8FA8C8" stroke-dasharray="3 3"/>
        <circle cx="${100 + r * Math.cos(i * 1.4)}" cy="${100 + r * Math.sin(i * 1.4)}" r="5" fill="${n === 'Sun' ? '#F6C343' : n === 'Earth' ? '#5F98C4' : '#E7E2D6'}"/>
        <text x="${100 + r * Math.cos(i * 1.4)}" y="${100 + r * Math.sin(i * 1.4) - 8}" text-anchor="middle" fill="#FFFFFF">${n}</text>`).join('')}
      <circle cx="100" cy="100" r="11" fill="${centre.fill}"/>
      <text x="100" y="124" text-anchor="middle" fill="#FFFFFF">${centre.label}</text>
    </svg>`;
  };

  const mcq = [
    { p: 'What is <b>cosmology</b>?', a: 'The study of the universe — where it came from and how it works', w: ['The study of rocks and the Earth', 'The study of living things', 'Predicting the future from the stars', 'The study of weather'], short: 'the universe', accept: ['universe', 'study of the universe', 'the study of the universe', 'space', 'the universe and space'], why: 'Cosmology = the study of the whole universe: how it began, what is in it and how it changes.' },
    { p: 'What was the ancient Greeks\' model of the universe called?', a: 'Geocentric — Earth at the centre', w: ['Heliocentric — Sun at the centre', 'The Big Bang model', 'The steady state model'], short: 'geocentric', accept: ['geo-centric', 'geocentric theory', 'earth centred', 'earth-centred', 'earth centered'], why: '<b>Geo</b> = Earth. The Greeks put a round Earth at the centre with everything orbiting it.' },
    { p: 'What did <b>Copernicus</b> put at the centre of his model?', a: 'The Sun', w: ['The Earth', 'The Moon', 'The Milky Way'], short: 'the sun', accept: ['sun'], why: 'Copernicus\' <b>heliocentric</b> model: Earth and all the planets orbit the Sun (<b>helio</b> = Sun).' },
    { p: 'Why did the Greeks\' Earth-centred idea make sense to them?', a: 'The Sun, Moon, planets and stars all seem to rise in the east, move across the sky and set in the west', w: ['They had telescopes that showed it', 'Newton told them so', 'They could see Earth from space', 'The Bible said so'], why: 'From where we stand, everything appears to circle round us — so it looked like Earth was still and in the middle.' },
    { p: 'Which observation could the Greeks NOT explain well with their model?', a: 'Mars sometimes appears to move backwards (retrograde motion)', w: ['The Sun rises in the east', 'The Moon has phases', 'Stars come out at night'], why: 'Retrograde motion: Mars sometimes seems to loop backwards across the sky. It is easy to explain if Earth is overtaking Mars as both orbit the Sun.' },
    { p: 'Copernicus said the Sun and planets <b>appear</b> to move across the sky each day because…', a: 'the Earth rotates (spins) on its axis', w: ['the Sun orbits the Earth every day', 'the stars push the planets', 'the Moon pulls them'], short: 'the earth rotates', accept: ['earth rotates', 'the earth spins', 'earth spins', 'rotation', 'the earth rotating', 'earth rotating on its axis', 'the earth rotates on its axis'], why: 'Earth spins once a day, so everything in the sky seems to sweep from east to west.' },
    { p: 'Give one reason Copernicus\' idea was ignored at first.', a: 'Nobody had heard of him', w: ['He had too many observations', 'He used a telescope that was too strong', 'Newton disproved him'], why: 'The notes give two reasons: it did not seem to make sense, and nobody had heard of him.' },
    { p: 'What did Galileo use to support Copernicus\' idea?', a: 'Observations made with a telescope', w: ['A computer model', 'Rockets', 'Photos from space'], short: 'a telescope', accept: ['telescope', 'telescopes', 'his telescope'], why: 'Galileo turned one of the first telescopes on the sky and gathered evidence.' },
    { p: 'Which TWO things did Galileo see with his telescope?', a: 'Details of the Moon\'s surface and moons orbiting Jupiter', w: ['Black holes and galaxies', 'Pluto and Neptune', 'The Big Bang and the Milky Way\'s shape'], why: 'Moons going round Jupiter proved not everything orbits the Earth.' },
    { p: 'Why did people listen to Galileo when they had ignored Copernicus?', a: 'He was well known and had observations to back up his theory', w: ['He was a priest', 'He was richer', 'He shouted louder'], why: 'Being well known + having evidence (observations) made people take the idea seriously.' },
    { p: 'Why was Galileo put on trial by the Catholic Church?', a: 'His statements disagreed with the Bible and the teachings of the Church', w: ['He broke his telescope', 'He stole Copernicus\' work', 'He refused to pay taxes'], why: 'Saying Earth was not the centre disagreed with Church teaching at the time.' },
    { p: 'What was Galileo\'s punishment?', a: 'House arrest for the rest of his life', w: ['Burnt at the stake', 'A small fine', 'Banished to England'], short: 'house arrest', accept: ['house arrest for life', 'he was put under house arrest'], why: 'Galileo got house arrest. Bruno, a few years earlier, was burnt at the stake.' },
    { p: 'How did the Sun-centred idea finally become accepted?', a: 'Over about 100 years, better telescopes gave more observations that supported it', w: ['The Church announced it the next day', 'Galileo won his trial', 'Copernicus came back to explain it'], why: 'Galileo\'s book was published, people read it, and improved telescopes kept finding supporting evidence.' },
    { p: 'What did <b>Isaac Newton</b> show about gravity?', a: 'Everything produces a gravity force — the Sun pulls the Earth and the Earth pulls the Moon', w: ['Gravity only pulls towards the centre of the universe', 'Gravity only exists on Earth', 'Gravity pushes things away'], short: 'gravity', accept: ['everything has gravity', 'everything produces gravity', 'all objects have gravity'], why: 'People thought gravity pulled everything to the centre of the universe (Earth). Newton showed every object pulls on every other — so the Sun can hold the planets in orbit.' },
    { p: 'How did Newton\'s gravity idea challenge the Earth-centred model?', a: 'It showed gravity does not just pull towards Earth — every object pulls on others, so the Sun\'s gravity keeps planets in orbit', w: ['It proved the Moon is made of cheese', 'It showed planets have no gravity', 'It showed Earth does not move at all'], why: 'If everything pulls, the huge Sun pulling the planets explains their orbits.' },
    { p: 'How did the Sun-centred idea change how people saw themselves?', a: 'We went from living at the centre of the universe to living on one planet orbiting an ordinary star — we were no longer special', w: ['People felt more important', 'Nothing changed', 'People thought Earth was flat again'], why: 'A huge shift in perception: Earth is one of several planets around a fairly ordinary star.' },
    { p: 'What is the difference between Earth\'s <b>rotation</b> and its <b>orbit</b>?', a: 'Rotation is spinning on its axis (once a day); orbit is travelling around the Sun (once a year)', w: ['Rotation is around the Sun; orbit is spinning', 'They are the same thing', 'Rotation takes a year; orbit takes a day'], why: 'Rotation → day and night (24 hours). Orbit → one year (365 ¼ days).' },
    { p: 'How long does it take the Earth to <b>rotate</b> once?', a: 'About 24 hours (one day)', w: ['About 365 days', 'About a month', 'About an hour'], short: '24 hours', accept: ['one day', '1 day', 'a day', '24 hrs', '24h', '24'], why: 'One spin on its axis = one day.' },
    { p: 'How long does it take the Earth to <b>orbit</b> the Sun once?', a: 'About 365 days (one year)', w: ['About 24 hours', 'About 28 days', 'About 10 years'], short: 'one year', accept: ['a year', '1 year', '365 days', '365 ¼ days', '365.25 days', 'year'], why: 'One trip around the Sun = one year.' },
    { p: 'During the Middle Ages, who kept making detailed observations of the sky while Europe made little progress?', a: 'Arab, Indian and Chinese astronomers', w: ['Nobody at all', 'Only the Romans', 'Isaac Newton'], why: 'Little progress in Europe, but careful astronomy continued in the Arab world, India, China and elsewhere.' },
    { p: 'Put these in time order, earliest first.', a: 'Greeks → Copernicus → Galileo → Newton', w: ['Copernicus → Greeks → Newton → Galileo', 'Galileo → Copernicus → Greeks → Newton', 'Newton → Galileo → Copernicus → Greeks', 'Greeks → Galileo → Newton → Copernicus'], why: 'Greeks (about 500 BC) → Copernicus (1500s) → Galileo (early 1600s) → Newton (late 1600s).' },
  ];
  const tf = [
    { s: 'The ancient Greeks thought the Earth was flat.', t: false, why: 'They believed Earth was a <b>sphere</b> — but at the centre of the universe.' },
    { s: 'In the heliocentric model, the Earth orbits the Sun.', t: true, why: 'Helio = Sun at the centre.' },
    { s: 'The Sun rises in the east because the Sun travels around the Earth every day.', t: false, why: 'It is the Earth\'s <b>rotation</b> that makes the Sun appear to move.' },
    { s: 'Galileo was burnt at the stake for his ideas.', t: false, why: 'Galileo got house arrest. It was Bruno who was burnt at the stake.' },
    { s: 'Seeing moons orbit Jupiter showed that not everything orbits the Earth.', t: true, why: 'Those moons circle Jupiter — evidence against the Earth-centred model.' },
    { s: 'Copernicus\' idea was accepted straight away because he had a telescope.', t: false, why: 'It was ignored — it did not seem to make sense and no one knew him.' },
    { s: 'Newton showed that only the Earth has gravity.', t: false, why: 'Newton showed <b>everything</b> produces gravity.' },
    { s: 'It took about 2000 years after the Greeks for a more accurate model to be worked out.', t: true, why: 'Greek ideas (about 500 BC) lasted until Copernicus and Galileo.' },
    { s: 'Most of the Greeks\' ideas turned out to be wrong, but they made sense from what they could see.', t: true, why: 'From Earth everything appears to circle us.' },
    { s: 'Rotation and orbit mean the same thing.', t: false, why: 'Rotation = spinning on the axis; orbit = travelling around another object.' },
  ];
  const groups = [
    { label: 'part of the geocentric (Earth-centred) model', items: ['Earth is at the centre', 'the Sun orbits the Earth', 'the stars circle the Earth', 'Earth stays still'] },
    { label: 'part of the heliocentric (Sun-centred) model', items: ['the Sun is at the centre', 'Earth orbits the Sun', 'Earth spins on its axis', 'planets orbit the Sun'] },
    { label: 'something Galileo saw or did', items: ['saw moons orbiting Jupiter', 'saw details on the Moon\'s surface', 'was put under house arrest', 'used a telescope'] },
  ];
  const PEOPLE = [
    { n: 'the ancient Greeks', did: 'proposed an Earth-centred (geocentric) universe' },
    { n: 'Copernicus', did: 'proposed a Sun-centred (heliocentric) model from careful measurements' },
    { n: 'Galileo', did: 'used a telescope to find evidence (Moon details, Jupiter\'s moons) and was put on trial' },
    { n: 'Newton', did: 'showed every object produces a gravity force' },
  ];
  function whoQ(level) {
    const p = R.pick(PEOPLE);
    if (R.chance(0.5)) {
      return {
        prompt: `Who <b>${p.did}</b>?`,
        answer: K.choice(p.n, PEOPLE.map((x) => x.n).concat(['Edwin Hubble', 'Georges Lemaître']), level === 1 ? 3 : 4),
        hint: 'Greeks → Copernicus → Galileo → Newton: one big idea each.',
        working: [`${p.n.charAt(0).toUpperCase() + p.n.slice(1)} ${p.did}.`],
        finalAnswer: p.n, skill: 'space-history-people',
      };
    }
    return {
      prompt: `What did <b>${p.n}</b> contribute to cosmology?`,
      answer: K.choice(p.did, PEOPLE.map((x) => x.did), level === 1 ? 3 : 4),
      hint: 'Greeks → Copernicus → Galileo → Newton: one big idea each.',
      working: [`${p.n.charAt(0).toUpperCase() + p.n.slice(1)} ${p.did}.`],
      finalAnswer: p.did, skill: 'space-history-people',
    };
  }
  function modelPicQ() {
    const helio = R.chance(0.5);
    return {
      prompt: 'Which model of the universe does this picture show?', visual: modelSvg(helio),
      answer: K.fixed(['Geocentric (Earth-centred)', 'Heliocentric (Sun-centred)'], helio ? 'Heliocentric (Sun-centred)' : 'Geocentric (Earth-centred)'),
      hint: 'Look at what is in the middle. Geo = Earth, helio = Sun.',
      working: [`The ${helio ? 'Sun' : 'Earth'} is in the middle.`, helio ? 'Sun at the centre = heliocentric (Copernicus, Galileo).' : 'Earth at the centre = geocentric (the ancient Greeks).'],
      finalAnswer: helio ? 'Heliocentric' : 'Geocentric', skill: 'space-history-models',
    };
  }
  function yearsQ(level) {
    // how long Earth has done things: rotations in n days, orbits in n years
    const days = R.pick([7, 14, 30, 100, 365]);
    if (level === 1 || R.chance(0.5)) {
      return {
        prompt: `How many times does the Earth <b>rotate</b> in <b>${days} days</b>?`,
        answer: K.num(days, 'number of spins'),
        hint: 'One rotation = one day.',
        working: ['Earth rotates once every day (24 hours).', `${days} days → <b>${days}</b> rotations.`],
        finalAnswer: String(days), skill: 'space-history-rotation',
      };
    }
    const age = R.int(9, 15);
    return {
      prompt: `Harper is <b>${age}</b>. How many times has the Earth <b>orbited</b> the Sun since she was born?`,
      answer: K.num(age, 'number of orbits'),
      hint: 'One orbit of the Sun = one year.',
      working: ['One trip around the Sun takes one year.', `${age} years old → <b>${age}</b> orbits.`],
      finalAnswer: String(age), skill: 'space-history-rotation',
    };
  }
  const word = [
    (level) => ({
      prompt: 'A friend says: "The Sun moves across the sky every day, so it must go round the Earth." What would Copernicus say?',
      answer: K.choice('The Earth is spinning on its axis, so the Sun only appears to move', ['She is right — the Sun orbits the Earth daily', 'The Sun is pushed by the wind', 'The Moon drags the Sun across the sky'], level === 1 ? 3 : 4),
      hint: 'Rotation vs orbit.', working: ['Earth rotates once a day.', 'So the Sun <b>appears</b> to rise in the east and set in the west.'],
      finalAnswer: 'Earth rotates, so the Sun only appears to move', skill: 'space-history-apply',
    }),
    (level) => ({
      prompt: 'Imagine a scientist today proposes a theory a powerful leader disagrees with. Compared with Galileo\'s time, what usually decides if the theory is accepted?',
      answer: K.choice('Evidence from observations and experiments that others can check', ['Whether the leader likes it', 'How famous the scientist\'s family is', 'Whether it is in an old book'], level === 1 ? 3 : 4),
      hint: 'Why did Galileo\'s idea eventually win?', working: ['Galileo\'s idea won through observations that others could repeat with better telescopes.', 'Science today works the same way: <b>evidence</b> decides.'],
      finalAnswer: 'Evidence that others can check', skill: 'space-history-apply',
    }),
    (level) => ({
      prompt: 'Galileo saw four moons going round Jupiter. Why was that such a problem for the Earth-centred model?',
      answer: K.choice('It showed there were objects orbiting something other than the Earth', ['It showed Jupiter was the centre of the universe', 'It proved the Earth was flat', 'It showed the Moon was a planet'], level === 1 ? 3 : 4),
      hint: 'The geocentric model says EVERYTHING orbits the Earth.', working: ['Geocentric model: everything orbits the Earth.', 'Jupiter\'s moons orbit <b>Jupiter</b> — so not everything orbits Earth.'],
      finalAnswer: 'Things orbit objects other than Earth', skill: 'space-history-apply',
    }),
    (level) => ({
      prompt: 'Harper writes: "Copernicus\' idea was ignored because it was wrong." What is wrong with her sentence?',
      answer: K.choice('His idea was mostly right — it was ignored because it seemed strange and nobody had heard of him', ['Nothing — that is correct', 'Copernicus was famous, so it was not ignored', 'It was ignored because Newton disagreed'], level === 1 ? 3 : 4),
      hint: 'Was the Sun-centred idea right or wrong?', working: ['The heliocentric idea was largely right.', 'Reasons it was ignored: it did not seem to make sense, and nobody knew him.'],
      finalAnswer: 'It was right — ignored because it seemed odd and he was unknown', skill: 'space-history-apply',
    }),
  ];

  K.topic({
    id: 'space-history', strand: 'earth', order: 0.11,
    name: 'Cosmology: Greeks to Newton', short: 'Greeks to Newton', animal: 'owl',
    blurb: 'Earth-centred to Sun-centred: the Greeks, Copernicus, Galileo and Newton.',
    example: 'Copernicus: the Sun is at the centre (heliocentric)',
    hint: 'Greeks → Copernicus → Galileo → Newton. Geo = Earth, helio = Sun.',
    learn: {
      what: '<p><b>Cosmology</b> is the study of the universe. Over 2000 years people changed their minds about where we are: from the Greeks\' <b>Earth-centred</b> universe to Copernicus\' <b>Sun-centred</b> one, backed up by Galileo\'s telescope and explained by Newton\'s gravity.</p>',
      visual: modelSvg(true),
      facts: [
        '<b>Ancient Greeks (about 500 BC):</b> <b>geocentric</b> — a round Earth at the centre, everything orbiting it. It made sense because the Sun, Moon and stars all seem to rise in the east and set in the west. They could not explain <b>retrograde motion</b> (Mars sometimes looping backwards).',
        '<b>Middle Ages:</b> little progress in Europe, but Arab, Indian and Chinese astronomers kept careful records.',
        '<b>Copernicus (1500s, Poland):</b> <b>heliocentric</b> — Earth and planets orbit the Sun; the Sun and stars only <i>appear</i> to move because Earth <b>rotates</b>. Ignored because it seemed strange and nobody had heard of him.',
        '<b>Galileo (1610, Italy):</b> used a telescope — saw details of the <b>Moon\'s surface</b> and <b>moons orbiting Jupiter</b>. People listened: he was well known and had <b>observations</b>. The Church put him on trial; punishment: <b>house arrest for life</b> (Bruno had been burnt at the stake). Over about 100 years, better telescopes made the idea accepted.',
        '<b>Newton:</b> <b>everything produces a gravity force</b> — the Sun pulls the Earth, the Earth pulls the Moon. Gravity does not just pull to the "centre".',
        '<b>Rotation</b> = spinning on its axis (1 day). <b>Orbit</b> = travelling around the Sun (1 year).',
      ],
      steps: [
        'For "describe the history", go in time order: Greeks → Copernicus → Galileo → Newton.',
        'For each person, say <b>what they proposed</b> and <b>what evidence or reason</b> they had.',
        'Use the key words: geocentric, heliocentric, rotation, orbit, observation, gravity.',
        'Explain why ideas were ignored or accepted: fame + evidence.',
      ],
      examples: [
        { q: 'What was the main difference between the Greeks\' and Copernicus\' theories?', working: ['Greeks: geocentric — Earth at the centre.', 'Copernicus: heliocentric — Sun at the centre, Earth and planets orbit it.'], a: 'Earth at the centre vs the Sun at the centre' },
        { q: 'Why did the Greeks believe the Earth was the centre?', working: ['From Earth, the Sun, Moon, planets and stars all appear to rise in the east and set in the west.', 'So it looked like everything circled us.'], a: 'Everything appears to move around us across the sky' },
        { q: 'Give two reasons Copernicus\' theory was ignored.', working: ['It did not seem to make sense.', 'Nobody had heard of him.'], a: 'It seemed strange, and he was unknown' },
        { q: 'Give two discoveries Galileo made with his telescope.', working: ['Details of the Moon\'s surface.', 'Moons orbiting Jupiter.'], a: 'Moon\'s surface details and Jupiter\'s moons' },
        { q: 'Why was Galileo put on trial, and what was his punishment?', working: ['His statements disagreed with the Bible and Church teaching.', 'He was sentenced to house arrest for life.'], a: 'Disagreed with the Church → house arrest for life' },
        { q: 'What did Newton show about gravity that challenged the Earth-centred model?', working: ['People thought gravity pulled everything to the centre (Earth).', 'Newton: everything produces gravity, so the Sun pulls the planets into orbit.'], a: 'Every object has gravity — the Sun holds the planets in orbit' },
      ],
      tips: [
        '<b>Geo</b> = Earth (geography). <b>Helio</b> = Sun (helium was first found in the Sun).',
        'Galileo did not "prove" it alone — <b>evidence + fame</b> got people listening, then better telescopes over about 100 years.',
        'Don\'t mix up the punishments: Galileo = house arrest; Bruno = burnt at the stake.',
        'Rotation → day and night. Orbit → years and seasons.',
      ],
    },
    mcq, tf, groups, calc: [whoQ, modelPicQ, yearsQ], word,
  });
})(window.HL);
