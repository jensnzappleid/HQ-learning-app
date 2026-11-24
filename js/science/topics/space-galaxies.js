/* Topic: Galaxies and the Milky Way — what a galaxy is, examples, the four shapes, why the Milky Way
 * looks like a band and why we have no photo of it.
 * Year 8 Cosmology LO6 (workbook) / notes LO5 + LO6. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const shape = (kind) => {
    const body = {
      spiral: `<ellipse cx="60" cy="50" rx="10" ry="8" fill="#FFF1C9"/>
        <path d="M60 50 C 85 30, 100 55, 85 75 M60 50 C 35 70, 20 45, 35 25" fill="none" stroke="#A9D8F5" stroke-width="7" stroke-linecap="round" opacity=".85"/>`,
      elliptical: `<ellipse cx="60" cy="50" rx="38" ry="26" fill="#F6C343" opacity=".45"/><ellipse cx="60" cy="50" rx="22" ry="15" fill="#FFF1C9" opacity=".8"/>`,
      lenticular: `<ellipse cx="60" cy="50" rx="44" ry="9" fill="#C9B8F0" opacity=".7"/><ellipse cx="60" cy="50" rx="12" ry="9" fill="#FFF1C9"/>`,
      irregular: `${[[40, 40, 9], [62, 55, 12], [80, 38, 7], [52, 68, 6], [74, 70, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F7A8C4" opacity=".7"/>`).join('')}`,
    }[kind];
    return `<svg viewBox="0 0 120 100" width="150" height="125" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="100" rx="10" fill="#14213D"/>${body}</svg>`;
  };
  const visual = `<svg viewBox="0 0 340 130" width="340" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="126" rx="12" fill="#14213D"/>
    <ellipse cx="90" cy="62" rx="70" ry="13" fill="#A9D8F5" opacity=".35"/><ellipse cx="90" cy="62" rx="22" ry="14" fill="#FFF1C9" opacity=".8"/>
    <circle cx="125" cy="62" r="4" fill="#F6C343"/><text x="125" y="88" text-anchor="middle" fill="#F6C343">Sun (us)</text>
    <text x="90" y="24" text-anchor="middle" fill="#FFFFFF">side view: a flat disc, fatter in the middle</text>
    <path d="M200 30 C 240 20, 300 45, 300 62 C 300 85, 240 105, 200 95" fill="none" stroke="#FFFFFF" stroke-dasharray="3 3"/>
    <text x="252" y="58" text-anchor="middle" fill="#FFFFFF">looking along the disc</text>
    <text x="252" y="72" text-anchor="middle" fill="#FFFFFF">= the bright band we call</text>
    <text x="252" y="86" text-anchor="middle" fill="#F6C343">the Milky Way</text>
  </svg>`;

  const mcq = [
    { p: 'What is a <b>galaxy</b>?', a: 'A vast collection of millions or billions of stars held together by gravity', w: ['A single very bright star', 'A planet with many moons', 'A cloud of rain in space'], short: 'a collection of stars', accept: ['collection of stars', 'a group of stars', 'group of stars', 'lots of stars', 'billions of stars', 'a vast collection of stars', 'a huge group of stars'], why: 'A galaxy is a vast collection of stars (with gas and dust) held together by gravity.' },
    { p: 'What is the name of <b>our</b> galaxy?', a: 'The Milky Way', w: ['Andromeda', 'The Solar System', 'Proxima Centauri'], short: 'the milky way', accept: ['milky way', 'milky way galaxy', 'the milky way galaxy'], why: 'Our Solar System is part of the Milky Way Galaxy.' },
    { p: 'Give an example of a galaxy other than the Milky Way.', a: 'Andromeda', w: ['Sirius', 'Jupiter', 'The Sun'], short: 'andromeda', accept: ['the andromeda galaxy', 'andromeda galaxy'], why: 'Andromeda is the nearest big spiral galaxy, 2.5 million light years away.' },
    { p: 'What shape is the Milky Way?', a: 'A spiral — like a flat dish, fatter in the middle, with arms', w: ['A perfect ball', 'A long straight line', 'A cube'], short: 'spiral', accept: ['a spiral', 'spiral galaxy', 'a spiral galaxy'], why: 'Astronomers measured the distances to stars and found they are arranged in spiral arms.' },
    { p: 'Why do we see the Milky Way as a bright band across the night sky?', a: 'We are inside a flat disc, so we see it edge-on — lots of stars in one direction', w: ['It is a cloud lit by the Moon', 'It is a line of planets', 'It is a jet plane trail'], why: 'Looking along the disc you see a dense band of stars; looking up out of the disc you see far fewer.' },
    { p: 'Why is our galaxy called the <b>Milky Way</b>?', a: 'The ancient Greeks thought the band of stars was milk spilled by the goddess Hera', w: ['It is made of milk', 'It is white because it is cold', 'A dairy company named it'], why: 'Like many constellations, the Greeks named it. The name now means the whole galaxy.' },
    { p: 'Why are there no photos of the whole Milky Way from outside?', a: 'We are inside it, and no spacecraft can travel far enough to look back at it', w: ['It is too dark to photograph', 'Cameras do not work in space', 'It is behind the Sun'], why: 'Spacecraft have not even reached the nearest star. Pictures of "the Milky Way from above" are drawings or other galaxies.' },
    { p: 'How many shapes of galaxy have astronomers seen?', a: 'Four', w: ['One', 'Two', 'Ten'], short: '4', accept: ['four'], why: 'Spiral, elliptical, lenticular and irregular.' },
    { p: 'Which galaxy shape is like a flat disc but with <b>no</b> spiral arms?', a: 'Lenticular', w: ['Spiral', 'Elliptical', 'Irregular'], short: 'lenticular', why: 'Lenticular = lens-shaped disc without arms.' },
    { p: 'Which galaxy shape has no regular shape at all?', a: 'Irregular', w: ['Spiral', 'Elliptical', 'Lenticular'], short: 'irregular', why: 'Irregular galaxies are messy clumps.' },
    { p: 'Which galaxy shape looks like a stretched ball (an oval) of stars?', a: 'Elliptical', w: ['Spiral', 'Lenticular', 'Irregular'], short: 'elliptical', why: 'Elliptical galaxies are smooth oval balls of stars.' },
    { p: 'What is an <b>astronomer</b>?', a: 'A scientist who studies stars, planets, galaxies and space', w: ['Someone who predicts your future from the stars', 'A person who flies spacecraft', 'Someone who builds telescopes only'], why: 'Astronomy is a science. (Astrology — horoscopes — is not.)' },
    { p: 'In the 1800s, what were the faint "blobs of light" people saw that did not look like stars?', a: 'Other galaxies, far outside our own', w: ['Clouds on Earth', 'Planets', 'Comets'], why: 'Better telescopes showed the blobs were whole galaxies containing millions of stars.' },
    { p: 'About how many stars are in the Milky Way?', a: 'About 100 billion', w: ['About 100', 'About 8', 'About 1 million'], why: 'Around 100 billion stars (the alien-worlds handout) — most probably with planets.' },
    { p: 'Where is our Solar System in the Milky Way?', a: 'In one of the spiral arms, away from the centre', w: ['Exactly at the centre', 'Outside the galaxy', 'In a different galaxy'], why: 'The Sun is out in a spiral arm; the band we see is the view towards the crowded centre.' },
    { p: 'What holds a galaxy together?', a: 'Gravity', w: ['Magnetism', 'Air pressure', 'Electricity'], short: 'gravity', why: 'Gravity pulls the stars, gas and dust together.' },
  ];
  const tf = [
    { s: 'The Milky Way is the name of our Solar System.', t: false, why: 'The Milky Way is our <b>galaxy</b>. The Solar System is the Sun and its planets — a tiny part of the galaxy.' },
    { s: 'Astronomers with powerful telescopes can see every star in the Milky Way.', t: false, why: 'Dust and gas block the view, many stars are too faint, and stars behind the centre are hidden.' },
    { s: 'There are photographs of the whole Milky Way taken from outside it.', t: false, why: 'No spacecraft has gone that far. Those pictures are drawings or other galaxies.' },
    { s: 'A galaxy contains millions or billions of stars.', t: true, why: 'Galaxies are vast collections of stars.' },
    { s: 'The Milky Way is a spiral galaxy.', t: true, why: 'Measured star distances show spiral arms.' },
    { s: 'All galaxies are spiral-shaped.', t: false, why: 'There are four shapes: spiral, elliptical, lenticular and irregular.' },
    { s: 'The bright band across the sky is our edge-on view of our own galaxy.', t: true, why: 'We see it from inside the disc.' },
  ];
  const groups = [
    { label: 'a shape of galaxy', items: ['spiral', 'elliptical', 'lenticular', 'irregular'] },
    { label: 'a galaxy', items: ['the Milky Way', 'Andromeda', 'the Large Magellanic Cloud', 'the Whirlpool Galaxy'] },
    { label: 'a star', items: ['the Sun', 'Sirius', 'Proxima Centauri', 'Betelgeuse'] },
  ];
  function shapeQ(level) {
    const kinds = ['spiral', 'elliptical', 'lenticular', 'irregular'];
    const k = R.pick(kinds);
    const desc = { spiral: 'a disc with a bright middle and arms curling out', elliptical: 'a smooth oval ball of stars', lenticular: 'a flat disc with a bulge but no arms', irregular: 'no regular shape — messy clumps' }[k];
    return {
      prompt: 'Which type of galaxy is this?', visual: shape(k),
      answer: K.choice(k.charAt(0).toUpperCase() + k.slice(1), kinds.map((x) => x.charAt(0).toUpperCase() + x.slice(1)), level === 1 ? 3 : 4),
      hint: 'Arms → spiral · oval ball → elliptical · disc without arms → lenticular · messy → irregular.',
      working: [`It is ${desc}.`, `That is a <b>${k}</b> galaxy.`],
      finalAnswer: k, skill: 'space-galaxies-shapes',
    };
  }
  function starsCountQ(level) {
    const g = R.pick([2, 3, 5, 10]);
    return {
      prompt: `If each galaxy had about <b>100 billion</b> stars, how many billion stars would <b>${g} galaxies</b> have?`,
      answer: K.num(100 * g, 'billion'),
      hint: 'Multiply.',
      working: [`100 billion × ${g} = <b>${100 * g} billion</b> stars.`],
      finalAnswer: `${100 * g} billion`, skill: 'space-galaxies-count',
    };
  }
  const word = [
    (level) => ({
      prompt: 'Imagine the Sun was in the middle of an <b>elliptical</b> galaxy. How would our night sky be different?',
      answer: K.choice('Stars would be spread all over the sky — there would be no single bright band', ['There would be no stars at all', 'The sky would be exactly the same', 'We would only see one star'], level === 1 ? 3 : 4),
      hint: 'An elliptical galaxy is a ball, not a flat disc.', working: ['In a flat disc, stars crowd into a band when we look along it.', 'In a ball-shaped galaxy, stars would surround us in every direction — no band.'],
      finalAnswer: 'Stars everywhere, no Milky Way band', skill: 'space-galaxies-apply',
    }),
    (level) => ({
      prompt: 'Harper lives in Auckland and can hardly see the Milky Way. On a camping trip far from town, she sees it clearly. Why?',
      answer: K.choice('Far from streetlights the sky is darker, so the faint band of stars shows up', ['The Milky Way moves closer to campsites', 'Cities are in a different galaxy', 'Tents are magnetic'], level === 1 ? 3 : 4),
      hint: 'What drowns out faint starlight in a city?', working: ['City lights brighten the sky and hide faint stars.', 'A dark sky lets you see the band.'],
      finalAnswer: 'Darker skies away from city lights', skill: 'space-galaxies-apply',
    }),
    (level) => ({
      prompt: 'Hold your thumb at arm\'s length against the night sky. The notes say about 10 million million million stars are behind your thumbnail. How is that possible?',
      answer: K.choice('Behind it are countless distant galaxies, each with billions of stars, too faint to see', ['Your thumb makes stars', 'It is only stars in our Solar System', 'They are all planets'], level === 1 ? 3 : 4),
      hint: 'How many galaxies are out there?', working: ['Even a tiny patch of sky contains huge numbers of faraway galaxies.', 'Each has billions of stars — but too faint for our eyes.'],
      finalAnswer: 'Huge numbers of faint distant galaxies', skill: 'space-galaxies-apply',
    }),
  ];

  K.topic({
    id: 'space-galaxies', strand: 'earth', order: 0.16,
    name: 'Galaxies & the Milky Way', short: 'Galaxies', animal: 'whale',
    blurb: 'What a galaxy is, the four shapes, and why the Milky Way is a band across the sky.',
    example: 'Our galaxy, the Milky Way, is a spiral galaxy',
    hint: 'Galaxy = billions of stars held by gravity. Shapes: spiral, elliptical, lenticular, irregular.',
    learn: {
      what: '<p>A <b>galaxy</b> is a vast collection of stars, gas and dust held together by gravity. Our Solar System is in the <b>Milky Way</b>, a <b>spiral</b> galaxy about 100 000 light years across with about 100 billion stars. There are billions of other galaxies, such as <b>Andromeda</b>.</p>',
      visual,
      facts: [
        'In the 1800s people realised our galaxy is made of huge numbers of stars, and that faint "blobs" were <b>other galaxies</b>.',
        'Examples: the <b>Milky Way</b> (ours), <b>Andromeda</b> (nearest big spiral, 2.5 million light years), the Magellanic Clouds.',
        '<b>Four shapes:</b> spiral (arms) · elliptical (oval ball) · lenticular (disc, no arms) · irregular (no shape).',
        'The Milky Way is shaped like a <b>dish, fatter in the middle</b>. The bright band in the sky is our <b>edge-on view</b> from inside it.',
        'The name: the Greeks thought the band was milk from the goddess <b>Hera</b>.',
        'No photo of the whole Milky Way exists — we are <b>inside</b> it and can\'t send a craft far enough out.',
        'We can\'t see all its stars: gas and dust block them, many are too faint, and some are behind the centre.',
        'The notes estimate 1000 million galaxies × 1000 million stars each. An <b>astronomer</b> is a scientist who studies space.',
      ],
      steps: [
        'Define: galaxy = vast collection of stars held together by gravity.',
        'Give examples: Milky Way, Andromeda.',
        'Name the shape and describe it.',
        'For "why" questions, use: we are inside a flat disc.',
      ],
      examples: [
        { q: 'What discovery did improved telescopes lead to about the blobs of light in the night sky?', working: ['The blobs did not look like star points.', 'Better telescopes showed they were other galaxies outside ours.'], a: 'They were other galaxies' },
        { q: 'Why is our galaxy called the Milky Way?', working: ['The Greeks named the milky band of stars after milk from the goddess Hera.'], a: 'Greek myth — milk from Hera' },
        { q: 'Why are there no photos of the whole of our galaxy?', working: ['We are inside it.', 'No spacecraft can get far enough away to look back.'], a: 'We are inside it' },
        { q: 'How many shapes of galaxy are there?', visual: K.table(['Shape', 'Looks like'], [['Spiral', 'disc with arms (Milky Way)'], ['Elliptical', 'oval ball'], ['Lenticular', 'disc, no arms'], ['Irregular', 'no regular shape']]), working: ['Four: spiral, elliptical, lenticular, irregular.'], a: 'Four' },
        { q: 'Can astronomers with powerful telescopes see all the stars in the Milky Way?', working: ['No — dust and gas block the view, some stars are too faint, and the centre hides stars behind it.'], a: 'No, dust/faintness/the centre hide many' },
        { q: 'If the Sun was in the middle of an elliptical galaxy, how would the sky look?', working: ['Elliptical = ball of stars.', 'Stars would be all around us, no band across the sky.'], a: 'Stars everywhere, no band' },
      ],
      tips: [
        'Solar System ≠ galaxy. The Solar System is one star and its planets inside the galaxy.',
        'Edge-on view = why it\'s a <b>band</b>.',
        'Lenticular = <b>lens</b> shape, no arms.',
      ],
    },
    mcq, tf, groups, calc: [shapeQ, shapeQ, starsCountQ], word,
  });
})(window.HL);
