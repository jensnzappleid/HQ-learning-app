/* Topic: Space travel in the 21st century — rockets vs space planes, the five space-plane concepts
 * from the "Designing the best space plane" handout, design problems, and the ethics debate.
 * Year 8 Cosmology LO11 (common methods of space travel; debate the ethics). */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const PLANES = [
    { n: 'Eco Rocket', who: 'Space Walker (Japan)', key: 'uses climate-friendly fuel very efficiently', jobs: 'research, space tourism, transport', when: 'test flight 2026', more: 'aims to launch satellites (2028), carry tourists (2030) and fly people across the world via space (2040)' },
    { n: 'Radian One', who: 'Radian Aerospace (USA)', key: 'takes off from an ordinary runway with no boosters — it needs a new kind of engine', jobs: 'space tourism, cargo', when: 'complete spaceplane 2035', more: 'could carry people to and from space stations and launch satellites' },
    { n: 'RLV', who: 'India\'s space programme', key: 'is India\'s reusable space shuttle, already test-dropped from a helicopter', jobs: 'cargo, research', when: 'larger model 2035', more: 'India is testing new engines and wing designs' },
    { n: 'Space Rider', who: 'the European Space Agency (ESA)', key: 'is unmanned and can stay in orbit for up to two months', jobs: 'research, repair, cargo', when: 'first launch 2027', more: 'repairs satellites and runs experiments; larger crewed versions planned' },
    { n: 'Dawn Mk-II Aurora', who: 'Dawn Aerospace (New Zealand–Dutch)', key: 'is a sub-orbital plane that uses normal runways and airports', jobs: 'research, emergency response', when: 'first launch 2035', more: 'broke the sound barrier in November 2024 (Mach 1.12) and set a record for fastest climb to 20 km' },
  ];
  const DESIGN = [
    { f: 'Take-off', p: 'getting fast enough to leave the atmosphere needs huge amounts of fuel', s: 'reusable engines or a runway take-off like Radian One, efficient fuel like Eco Rocket' },
    { f: 'Return to Earth', p: 'it must slow down and land safely', s: 'wings to glide down to a runway, parachutes' },
    { f: 'Heat stress', p: 'air rubbing on the craft on re-entry makes it extremely hot', s: 'a heat shield / heat-resistant tiles on the underside' },
    { f: 'Radiation', p: 'outside the atmosphere there is harmful radiation from the Sun and space', s: 'shielded walls and windows, short trips' },
    { f: 'Movement in space', p: 'wings and rudders do not work where there is no air', s: 'small thrusters to turn and steer' },
    { f: 'Customer comfort', p: 'passengers feel strong forces at take-off and float when weightless', s: 'padded reclining seats, straps, handholds, big windows' },
  ];
  const visual = `<svg viewBox="0 0 340 150" width="340" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="146" rx="12" fill="#14213D"/>
    <path d="M60 95 L230 70 L285 78 L230 88 L120 108 Z" fill="#E7E2D6" stroke="#FFFFFF"/>
    <path d="M150 92 L120 125 L170 100 Z" fill="#C9C2B0"/><path d="M230 72 L250 48 L258 75 Z" fill="#C9C2B0"/>
    <rect x="60" y="96" width="120" height="7" fill="#E0568C" transform="rotate(-8 60 96)"/>
    <text x="40" y="132" fill="#F7A8C4">heat shield underneath</text>
    <text x="196" y="40" fill="#A9D8F5">thrusters to steer in space</text>
    <text x="22" y="24" fill="#FFF1C9">Design checklist: take-off · return · heat · radiation · steering · comfort</text>
    <text x="250" y="110" fill="#E3F3D8">wings to land</text>
  </svg>`;

  const mcq = PLANES.map((pl) => ({ p: `Which space plane <b>${pl.key}</b>?`, a: pl.n, w: PLANES.map((x) => x.n), why: `${pl.n} (${pl.who}) ${pl.key}. Jobs: ${pl.jobs}.` }))
    .concat(PLANES.map((pl) => ({ p: `Who is developing the <b>${pl.n}</b>?`, a: pl.who, w: PLANES.map((x) => x.who), why: `${pl.n} is from ${pl.who}; ${pl.more}.` })))
    .concat(DESIGN.map((d) => ({ p: `Designing a space plane: how could you deal with <b>${d.f.toLowerCase()}</b>?`, a: d.s.charAt(0).toUpperCase() + d.s.slice(1), w: DESIGN.map((x) => x.s.charAt(0).toUpperCase() + x.s.slice(1)), why: `Problem: ${d.p}. Solution: ${d.s}.` })))
    .concat([
      { p: 'What is the main way spacecraft get into space today?', a: 'Rockets', w: ['Hot-air balloons', 'Ordinary jet planes', 'Catapults'], short: 'rockets', accept: ['rocket', 'a rocket', 'by rocket'], why: 'Rockets push out hot gas very fast to blast upwards. Space planes are being developed to be reusable and take off from runways.' },
      { p: 'What is the big advantage of a <b>reusable</b> space plane over a normal rocket?', a: 'It can fly again and again, which makes going to space much cheaper', w: ['It goes faster than light', 'It needs no fuel at all', 'It does not need a pilot or computer'], why: 'Most rockets are used once. Reusing the craft cuts the cost per trip.' },
      { p: 'Why does a space plane need a heat shield?', a: 'Coming back into the atmosphere very fast, friction with the air makes it extremely hot', w: ['Space is very hot', 'To keep the passengers warm', 'To block the Sun\'s light'], short: 'heat', accept: ['re-entry', 'friction', 're-entry heat', 'reentry', 'it gets hot', 'heat stress'], why: 'Re-entry heating — the shield stops the craft burning up.' },
      { p: 'Why can\'t a space plane use its wings to turn while it is in space?', a: 'There is no air in space for the wings to push against', w: ['Wings freeze in space', 'Wings are removed in space', 'Gravity stops wings working'], why: 'Wings need air. In space, small <b>thrusters</b> push the craft around.' },
      { p: 'What does "sub-orbital" (like the Dawn Mk-II Aurora) mean?', a: 'It flies very high but does not go fast enough to stay in orbit', w: ['It flies underground', 'It orbits the Moon', 'It goes to Mars'], why: 'Sub-orbital flights go up very high and come back down without circling the Earth.' },
      { p: 'Which space plane is partly from <b>New Zealand</b>?', a: 'Dawn Mk-II Aurora', w: PLANES.map((x) => x.n), short: 'dawn aurora', accept: ['dawn mk-ii aurora', 'aurora', 'dawn', 'dawn mk ii aurora', 'dawn mk2 aurora', 'dawn aerospace', 'mk-ii aurora'], why: 'Dawn Aerospace is a New Zealand–Dutch company.' },
      { p: 'Which space plane carries <b>no crew</b> at all?', a: 'Space Rider', w: PLANES.map((x) => x.n), short: 'space rider', why: 'ESA\'s Space Rider is unmanned (for now).' },
    ]);
  const tf = [
    { s: 'Some space-plane technology from space travel has ended up in everyday things like GPS and phones.', t: true, why: 'Spin-offs include GPS, phone cameras, medical technology and even non-stick pans (as the workbook says).' },
    { s: 'Space travel is completely safe — nobody has ever been hurt.', t: false, why: 'Space exploration is high risk; there have been injuries and deaths.' },
    { s: 'Wings help a space plane steer while it is in space.', t: false, why: 'No air in space — it uses thrusters.' },
    { s: 'A space plane gets very hot when it comes back into the atmosphere.', t: true, why: 'Friction with the air on re-entry → heat shield needed.' },
    { s: 'Space Rider is designed to stay in orbit for up to two months.', t: true, why: 'It repairs satellites and runs experiments.' },
    { s: 'Radian One needs boosters to take off.', t: false, why: 'Its idea is to <b>ditch the boosters</b> and take off from an ordinary runway.' },
    { s: 'An ethics question has one right answer that science can prove.', t: false, why: 'Ethics is about values. You give your opinion and back it with reasons and facts from both sides.' },
  ];
  const groups = [
    { label: 'an argument FOR spending money on space exploration', items: ['it pushes the boundaries of knowledge', 'it gave us GPS and medical technology', 'it helps us understand our place in the universe', 'it inspires people into science'] },
    { label: 'an argument AGAINST spending money on space exploration', items: ['the money could end world hunger', 'the money could fund research on diseases', 'astronauts risk injury and death', 'launches can pollute the atmosphere'] },
  ];
  function ethicsQ(level) {
    const S = [
      { s: 'Trillions of dollars spent on space could have been spent on world hunger or curing diseases.', side: 'against' },
      { s: 'Space exploration pushes the boundaries of knowledge and helps us understand our role in the universe.', side: 'for' },
      { s: 'Technology from space travel is now used in mobile phones, GPS, medical technology and non-stick cookware.', side: 'for' },
      { s: 'Space exploration is extremely high-risk and people have died.', side: 'against' },
      { s: 'Satellites help us forecast weather and track climate change.', side: 'for' },
      { s: 'Space junk from old rockets is cluttering Earth\'s orbit.', side: 'against' },
    ];
    const st = R.pick(S);
    return {
      prompt: `Is this an argument <b>for</b> or <b>against</b> space exploration?<br><i>"${st.s}"</i>`,
      answer: K.fixed(['For space exploration', 'Against space exploration'], st.side === 'for' ? 'For space exploration' : 'Against space exploration'),
      hint: 'Does it give a benefit (for) or a cost or risk (against)?',
      working: [st.side === 'for' ? 'It describes a <b>benefit</b> → an argument <b>for</b>.' : 'It describes a <b>cost or risk</b> → an argument <b>against</b>.', 'In an ethics answer, give your view <b>and</b> a reason, and mention the other side.'],
      finalAnswer: st.side === 'for' ? 'For' : 'Against', skill: 'space-travel-ethics',
    };
  }
  function datesQ(level) {
    const items = [['Space Rider', 2027], ['Eco Rocket test flight', 2026], ['Radian One complete spaceplane', 2035], ['Dawn Mk-II Aurora', 2035], ['larger RLV', 2035]];
    const it = R.pick(items);
    const now = 2026;
    return {
      prompt: `The handout says the expected first launch of the <b>${it[0]}</b> is <b>${it[1]}</b>. How many years after 2026 is that?`,
      answer: K.num(it[1] - now, 'years'),
      hint: 'Subtract: launch year − 2026.',
      working: [`${it[1]} − 2026 = <b>${it[1] - now}</b> years.`],
      finalAnswer: String(it[1] - now), skill: 'space-travel-dates',
    };
  }
  const word = [
    (level) => {
      const d = R.pick(DESIGN);
      return {
        prompt: `You are designing your own space plane. Your teacher\'s checklist says <b>${d.f}</b>. What is the problem, and how would you solve it?`,
        answer: K.choice(`${d.p.charAt(0).toUpperCase() + d.p.slice(1)} → ${d.s}`, DESIGN.filter((x) => x !== d).map((x) => `${x.p.charAt(0).toUpperCase() + x.p.slice(1)} → ${x.s}`), level === 1 ? 3 : 4),
        hint: 'Say the problem first, then the feature that fixes it.',
        working: [`Problem: ${d.p}.`, `Feature: ${d.s}.`, 'Label this feature on your drawing and explain it.'],
        finalAnswer: d.s, skill: 'space-travel-design',
      };
    },
    (level) => ({
      prompt: 'A company wants space flights to be cheap enough for tourists. Which design choice helps most?',
      answer: K.choice('Make the craft reusable so it can fly again and again', ['Use a new rocket every time', 'Make it heavier', 'Remove the heat shield'], level === 1 ? 3 : 4),
      hint: 'What makes rockets so expensive?', working: ['Most rockets are thrown away after one flight.', 'A reusable space plane spreads the cost over many flights.'],
      finalAnswer: 'Make it reusable', skill: 'space-travel-design',
    }),
    (level) => ({
      prompt: 'Your class debates: "Space exploration is worth the money." Which answer would score best?',
      answer: K.choice('I agree, because it gave us GPS and medical technology — but I understand the money could also help fight hunger', ['I agree because space is cool', 'I disagree', 'Space is big'], level === 1 ? 3 : 4),
      hint: 'A strong ethics answer = your opinion + a reason + the other side.', working: ['State where you sit on the scale.', 'Give a reason with a fact.', 'Show you considered the other side.'],
      finalAnswer: 'Opinion + reason + other side', skill: 'space-travel-ethics',
    }),
  ];

  K.topic({
    id: 'space-travel', strand: 'earth', order: 0.13,
    name: 'Space travel: space planes & ethics', short: 'Space travel', animal: 'seal',
    blurb: 'Rockets and the new space planes, designing your own, and whether space is worth it.',
    example: 'Re-entry heat → heat shield',
    hint: 'Problem → feature that solves it. For ethics: benefit = for, cost or risk = against.',
    learn: {
      what: '<p>Today most spacecraft go up on <b>rockets</b> that are used once. Engineers around the world are building <b>space planes</b> that can be reused and take off from runways. Designing one means solving problems: take-off, getting back, heat, radiation, steering in space and comfort. Then there is the big ethics question: is space exploration worth it?</p>',
      visual,
      facts: PLANES.map((pl) => `<b>${pl.n}</b> — ${pl.who}: ${pl.key}. Jobs: ${pl.jobs}. Expected: ${pl.when}.`).concat([
        '<b>Design checklist:</b> take-off (fuel, engines) · return to Earth (wings, parachutes) · <b>heat stress</b> on re-entry (heat shield) · <b>radiation</b> (shielding) · <b>movement in space</b> (thrusters — wings need air) · customer comfort (seats, straps).',
        '<b>For</b> space exploration: knowledge, understanding our place in the universe, spin-offs (phones, GPS, medical technology, non-stick pans). <b>Against:</b> trillions of dollars that could fight hunger or disease, risk of injury and death.',
      ]),
      steps: [
        'Space-plane question: name the plane, say who makes it and its key new feature.',
        'Design question: name the problem, then the feature that solves it, then label it.',
        'Ethics question: say where you stand, give a reason with a fact, and mention the other side.',
      ],
      examples: [
        { q: 'Write one interesting feature of each space-plane concept.', visual: K.table(['Space plane', 'New / interesting feature'], PLANES.map((p) => [p.n, p.key])), working: ['Read the handout card for each one.', 'Pick the thing that is new: fuel, runway take-off, unmanned, sub-orbital…'], a: 'See the table' },
        { q: 'Your space plane must come back through the atmosphere. What feature does it need?', working: ['Re-entry: friction with the air makes it extremely hot.', 'A heat shield (heat-resistant tiles) underneath.'], a: 'A heat shield' },
        { q: 'How does your space plane turn in space?', working: ['Wings and rudders need air — there is none in space.', 'Small thrusters push it the way you want.'], a: 'Thrusters' },
        { q: 'How will you protect passengers from radiation?', working: ['Above the atmosphere there is much more radiation.', 'Shielded walls and windows; keep trips short.'], a: 'Shielding and short trips' },
        { q: '"Trillions of dollars have been spent on space that could have ended world hunger." Where do you sit?', working: ['Pick your view, e.g. partly agree.', 'Reason: hunger needs money now — but space research gave us satellites that help farmers and weather forecasts.', 'Mention both sides.'], a: 'A view + a reason + the other side' },
        { q: 'Why are companies building space planes instead of rockets?', working: ['Rockets are mostly used once.', 'Space planes can be reused and take off from runways, making trips cheaper and more frequent.'], a: 'Reusable → cheaper, more frequent flights' },
      ],
      tips: [
        'Dawn Mk-II Aurora is the New Zealand one (with the Netherlands).',
        'Space Rider = unmanned. Radian One = runway, no boosters. Eco Rocket = climate-friendly fuel. RLV = India, test-dropped from a helicopter.',
        'In ethics there is no single right answer — the marks are for <b>reasons</b>.',
      ],
    },
    mcq, tf, groups, calc: [ethicsQ, datesQ], word,
  });
})(window.HL);
