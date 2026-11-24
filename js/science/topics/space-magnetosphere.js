/* Topic: Earth's magnetic field and magnetosphere — what causes it (moving liquid iron in the outer core),
 * why it matters (shield from solar wind and radiation, keeps the atmosphere), the bar magnet practical,
 * and how a compass works.
 * Year 8 Cosmology LO12 + LO13 (workbook). The general magnet facts are in magnetism.js; this is the Earth side. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const field = (mode) => {
    // mode: 'single' | 'attract' | 'repel'
    const mag = (x, l, r) => `<rect x="${x}" y="52" width="60" height="22" fill="none" stroke="${INK}" stroke-width="2"/><rect x="${x}" y="52" width="30" height="22" fill="#E0568C"/><rect x="${x + 30}" y="52" width="30" height="22" fill="#5F98C4"/>
      <text x="${x + 15}" y="68" text-anchor="middle" fill="#FFFFFF">${l}</text><text x="${x + 45}" y="68" text-anchor="middle" fill="#FFFFFF">${r}</text>`;
    let lines = '', mags = '';
    if (mode === 'single') {
      mags = mag(110, 'N', 'S');
      lines = [14, 26, 38].map((h) => `<path d="M110 63 C 90 ${63 - h * 1.6}, 190 ${63 - h * 1.6}, 170 63 M110 63 C 90 ${63 + h * 1.6}, 190 ${63 + h * 1.6}, 170 63" fill="none" stroke="#7D7080" stroke-dasharray="2 3"/>`).join('');
    } else if (mode === 'attract') {
      mags = mag(60, 'N', 'S') + mag(160, 'N', 'S');
      lines = [-8, 0, 8].map((d) => `<path d="M120 ${63 + d} H160" stroke="#7D7080" stroke-dasharray="2 3"/>`).join('') + `<text x="140" y="104" text-anchor="middle" fill="${INK}">lines join straight across: attract</text>`;
    } else {
      mags = mag(60, 'S', 'N') + mag(160, 'N', 'S');
      lines = [-14, -6, 6, 14].map((d) => `<path d="M120 ${63 + d} C 132 ${63 + d * 3}, 136 ${63 + d * 4}, 132 ${63 + d * 5} M160 ${63 + d} C 148 ${63 + d * 3}, 144 ${63 + d * 4}, 148 ${63 + d * 5}" fill="none" stroke="#7D7080" stroke-dasharray="2 3"/>`).join('') + `<text x="140" y="112" text-anchor="middle" fill="${INK}">lines push apart, empty gap: repel</text>`;
    }
    return `<svg viewBox="0 0 280 120" width="280" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700"><rect width="280" height="120" rx="10" fill="#FFFFFF" stroke="#D9BE8A"/>${lines}${mags}</svg>`;
  };
  const visual = `<svg viewBox="0 0 340 170" width="340" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="166" rx="12" fill="#14213D"/>
    <circle cx="36" cy="85" r="22" fill="#F6C343"/><text x="36" y="125" text-anchor="middle" fill="#FFFFFF">Sun</text>
    ${[60, 75, 90, 105].map((y) => `<path d="M62 ${y} H120" stroke="#F6C343" stroke-dasharray="4 3"/>`).join('')}
    <text x="92" y="50" text-anchor="middle" fill="#F6C343">solar wind</text>
    <path d="M150 85 C 160 20, 330 20, 330 85 C 330 150, 160 150, 150 85 Z" fill="none" stroke="#A9D8F5" stroke-width="2"/>
    <text x="270" y="30" text-anchor="middle" fill="#A9D8F5">magnetosphere</text>
    <circle cx="220" cy="85" r="28" fill="#5F98C4"/><circle cx="220" cy="85" r="15" fill="#E0568C"/><circle cx="220" cy="85" r="7" fill="#F6C343"/>
    <text x="220" y="132" text-anchor="middle" fill="#FFFFFF">moving liquid iron in the outer core</text>
    <text x="220" y="146" text-anchor="middle" fill="#FFFFFF">→ electric currents → magnetic field</text>
  </svg>`;

  const mcq = [
    { p: 'What material inside the Earth helps create its magnetic field?', a: 'Liquid iron and other metals', w: ['Water', 'Rocks', 'Air'], short: 'liquid iron', accept: ['iron', 'molten iron', 'liquid iron and other metals', 'iron and nickel', 'liquid metal', 'molten metal'], why: 'Hot liquid iron (and nickel) in the outer core.' },
    { p: 'What causes the Earth\'s magnetic field?', a: 'Moving liquid metal in the outer core makes electric currents, which produce the field', w: ['The pull of the Moon', 'Volcanoes', 'Earth being cold at the poles'], short: 'electric currents', accept: ['electric currents from moving metal', 'moving liquid iron', 'moving metal in the core', 'electric currents in the core', 'moving iron', 'currents'], why: 'Moving liquid iron → electric currents → magnetic field (the workbook MCQ answer: electric currents from moving metals).' },
    { p: 'Which layer of the Earth has the moving liquid iron?', a: 'The outer core', w: ['The crust', 'The inner core', 'The atmosphere'], short: 'outer core', accept: ['the outer core'], why: 'Outer core = liquid. Inner core = solid.' },
    { p: 'What is the name of the protective bubble around Earth made by the magnetic field?', a: 'The magnetosphere', w: ['The atmosphere', 'The biosphere', 'The stratosphere'], short: 'magnetosphere', accept: ['the magnetosphere'], why: 'The magnetic field stretches far out into space, making the magnetosphere.' },
    { p: 'What does the magnetosphere protect Earth from?', a: 'The solar wind and harmful radiation from the Sun', w: ['Earthquakes', 'Volcanoes', 'Asteroids'], short: 'solar wind', accept: ['the solar wind', 'radiation', 'solar wind and radiation', 'harmful radiation', 'radiation from the sun', 'solar radiation'], why: 'It deflects charged particles from the Sun (solar wind) and harmful radiation.' },
    { p: 'Why is the Earth\'s magnetic field important for life?', a: 'It helps protect life by stopping the atmosphere from being stripped away by the solar wind', w: ['It makes Earth spin', 'It keeps Earth warm', 'It controls the weather'], why: 'Without it, the solar wind could strip the atmosphere away (this probably happened to Mars).' },
    { p: 'What is the <b>solar wind</b>?', a: 'A stream of charged particles blowing out from the Sun', w: ['Wind on Earth caused by sunshine', 'A breeze on the Sun\'s surface', 'Light from the Moon'], why: 'The magnetosphere bends most of it away from Earth.' },
    { p: 'The Earth\'s magnetic field is shaped like the field around…', a: 'a bar magnet', w: ['a horseshoe', 'a ball of string', 'a straight wire'], short: 'a bar magnet', accept: ['bar magnet', 'a giant bar magnet', 'giant bar magnet'], why: 'Earth acts like a giant bar magnet with field lines looping from pole to pole.' },
    { p: 'In the practical, what do iron filings do near a single bar magnet?', a: 'They line up along curved lines going from one pole to the other, crowded at the poles', w: ['They all fly to the middle', 'They do nothing', 'They melt'], why: 'The filings show the magnetic field lines — densest where the field is strongest (the poles).', vis: field('single') },
    { p: 'What happens to the iron filings when a <b>north</b> and a <b>south</b> pole are put close together?', a: 'The lines join straight across the gap — the magnets attract', w: ['The lines bend away, leaving an empty gap — they repel', 'The filings fall off', 'Nothing changes'], why: 'Unlike poles attract: field lines go straight from one to the other.', vis: field('attract') },
    { p: 'What happens to the iron filings when two <b>north</b> poles (or two south poles) are put together?', a: 'The lines push away from each other, leaving an empty gap in the middle — the magnets repel', w: ['The lines join straight across — they attract', 'All the filings stick to one magnet', 'The magnets lose their magnetism'], why: 'Like poles repel: lines curve away and there is a spot with almost no field (a neutral point).', vis: field('repel') },
    { p: 'How does a compass work?', a: 'Its needle is a tiny magnet that lines up with Earth\'s magnetic field and points north', w: ['It follows the Sun', 'It is pulled by the Moon', 'It points wherever is downhill'], short: 'it lines up with earth\'s magnetic field', accept: ['lines up with the magnetic field', 'magnetic needle', 'the needle is a magnet', 'the needle lines up with earth\'s magnetic field', 'it is a magnet', 'earth\'s magnetic field'], why: 'The needle is a magnet that can spin freely, so it lines up with Earth\'s field.' },
    { p: 'What colourful light show in the sky is caused by the solar wind hitting Earth\'s magnetic field near the poles?', a: 'An aurora (in New Zealand, the Aurora Australis — the southern lights)', w: ['A rainbow', 'Lightning', 'A meteor shower'], short: 'aurora', accept: ['aurora australis', 'the aurora australis', 'southern lights', 'the southern lights', 'auroras', 'an aurora'], why: 'Particles funnelled down near the poles make the air glow.' },
    { p: 'Why is Mars thought to have lost most of its atmosphere?', a: 'It lost its magnetic field, so the solar wind could strip the atmosphere away', w: ['It is too close to the Sun', 'It has too much water', 'Its moons ate it'], why: 'No magnetic shield → the solar wind removes the atmosphere over time.' },
  ];
  const tf = [
    { s: 'Earth\'s magnetic field comes from a giant bar magnet buried inside it.', t: false, why: 'It <b>behaves like</b> a bar magnet, but it is made by moving liquid iron making electric currents.' },
    { s: 'The magnetosphere protects Earth from solar wind and radiation.', t: true, why: 'It deflects most of the charged particles.' },
    { s: 'The Earth\'s inner core is liquid.', t: false, why: 'The <b>outer</b> core is liquid; the inner core is solid.' },
    { s: 'Without a magnetic field, Earth could lose its atmosphere.', t: true, why: 'The solar wind could strip it away.' },
    { s: 'Two south poles attract each other.', t: false, why: 'Like poles repel.' },
    { s: 'Iron filings crowd most thickly near the poles of a magnet.', t: true, why: 'The field is strongest there.' },
    { s: 'The magnetosphere protects us from asteroids.', t: false, why: 'It protects from solar wind and radiation — not rocks. (The atmosphere burns up small meteors.)' },
  ];
  const groups = [
    { label: 'part of how Earth\'s magnetic field is made', items: ['liquid iron in the outer core', 'the moving metal makes electric currents', 'the currents produce a magnetic field', 'heat keeps the metal moving'] },
    { label: 'something the magnetosphere protects us from', items: ['the solar wind', 'harmful radiation from the Sun', 'losing our atmosphere', 'charged particles from space'] },
    { label: 'NOT what the magnetosphere protects us from', distractorOnly: true, items: ['earthquakes', 'volcanoes', 'asteroids', 'the cold'] },
  ];
  function practicalQ(level) {
    const mode = R.pick(['single', 'attract', 'repel']);
    const ans = { single: 'One bar magnet', attract: 'North pole facing south pole (attract)', repel: 'Like poles facing (repel)' }[mode];
    return {
      prompt: 'Which set-up from the bar magnet practical made this pattern of iron filings?', visual: field(mode),
      answer: K.fixed(['One bar magnet', 'North pole facing south pole (attract)', 'Like poles facing (repel)'], ans),
      hint: 'Lines straight across the gap = attract. Lines bending away with an empty middle = repel.',
      working: [mode === 'single' ? 'Loops from one end to the other: a single magnet.' : mode === 'attract' ? 'Lines join straight across: unlike poles attracting.' : 'Lines curve away, empty gap: like poles repelling.'],
      finalAnswer: ans, skill: 'space-magnetosphere-practical',
    };
  }
  function chainQ(level) {
    const S = ['Heat keeps liquid iron moving in the outer core', 'The moving metal makes electric currents', 'The currents produce a magnetic field', 'The field reaches into space as the magnetosphere', 'The magnetosphere deflects the solar wind and radiation'];
    const k = R.int(0, S.length - 2);
    return {
      prompt: `Put the chain in order. What comes straight after "<b>${S[k]}</b>"?`,
      answer: K.choice(S[k + 1], S.filter((x) => x !== S[k]), level === 1 ? 3 : 4),
      hint: 'Moving iron → currents → field → magnetosphere → protection.',
      working: S.map((x, i) => `${i + 1}. ${x}`), finalAnswer: S[k + 1], skill: 'space-magnetosphere-chain',
    };
  }
  const word = [
    (level) => ({
      prompt: 'Harper sees the Aurora Australis glowing over the sea in winter. What is causing it?',
      answer: K.choice('Charged particles from the Sun are steered towards the pole by Earth\'s magnetic field and make the air glow', ['Moonlight reflecting off ice', 'Lightning far away', 'City lights on clouds'], level === 1 ? 3 : 4),
      hint: 'Solar wind + magnetic field near the poles.', working: ['The solar wind hits the magnetosphere.', 'The field funnels particles down near the poles, where they make the upper air glow.'],
      finalAnswer: 'Solar wind particles guided by the magnetic field', skill: 'space-magnetosphere-apply',
    }),
    (level) => ({
      prompt: 'Scientists look for planets that might have life. Why do they care whether a planet has a magnetic field?',
      answer: K.choice('A magnetic field shields the surface from radiation and helps the planet keep its atmosphere', ['It keeps the planet spinning', 'It makes the planet warmer', 'It makes the oceans salty'], level === 1 ? 3 : 4),
      hint: 'What does the magnetosphere do for Earth?', working: ['Our magnetosphere blocks solar wind and radiation.', 'It stops the atmosphere being stripped away.'],
      finalAnswer: 'It protects from radiation and keeps the atmosphere', skill: 'space-magnetosphere-apply',
    }),
    (level) => ({
      prompt: 'A hiker\'s compass points the wrong way when she holds it next to her speaker. Why?',
      answer: K.choice('The speaker has a magnet whose field is stronger nearby than Earth\'s, so the needle points at it', ['Speakers make sound waves that push the needle', 'The compass is broken forever', 'Music confuses the north pole'], level === 1 ? 3 : 4),
      hint: 'The needle lines up with whatever magnetic field is strongest.', working: ['Speakers contain magnets.', 'Close up, that field beats Earth\'s, so the needle follows it.'],
      finalAnswer: 'The speaker\'s magnet overpowers Earth\'s field', skill: 'space-magnetosphere-apply',
    }),
  ];

  K.topic({
    id: 'space-magnetosphere', strand: 'earth', order: 0.2,
    name: 'Earth\'s magnetic field & magnetosphere', short: 'Magnetosphere', animal: 'whale',
    blurb: 'Why Earth is a giant magnet, and how its magnetic bubble keeps us safe.',
    example: 'Moving liquid iron → electric currents → magnetic field',
    hint: 'Moving liquid iron (outer core) → electric currents → field → magnetosphere → shields us.',
    learn: {
      what: '<p>The Earth acts like a giant magnet. Deep inside, <b>hot liquid iron and other metals move around in the outer core</b>. This makes <b>electric currents</b>, which produce Earth\'s magnetic field. The field reaches far into space as a protective bubble — the <b>magnetosphere</b> — that shields us from the <b>solar wind</b> and harmful radiation and stops our atmosphere being stripped away.</p>',
      visual,
      facts: [
        '<b>Cause:</b> moving liquid iron (outer core) → electric currents → magnetic field. (Inner core = solid; outer core = liquid.)',
        '<b>Magnetosphere</b> = the protective bubble the field makes around Earth.',
        'It protects us from the <b>solar wind and harmful radiation</b>. Without it the atmosphere could be stripped away and life would be at risk (Mars probably lost its field and most of its air).',
        'Earth\'s field is shaped like a <b>bar magnet\'s</b> field.',
        '<b>Practical:</b> iron filings over a bar magnet make loops from pole to pole, crowded at the poles. N next to S: lines join across (attract). N next to N or S next to S: lines push apart with an empty gap (repel).',
        '<b>Compass:</b> the needle is a tiny magnet that lines up with Earth\'s magnetic field.',
        'The <b>aurora</b> (Aurora Australis in NZ) happens when solar-wind particles are guided down near the poles and make the air glow.',
      ],
      steps: [
        'Cause → mechanism → result: liquid iron moves → currents → field.',
        'Importance: shield from solar wind and radiation → keeps the atmosphere → protects life.',
        'Practical questions: describe the filings pattern, then say attract or repel.',
      ],
      examples: [
        { q: 'Explain what causes the Earth\'s magnetic field.', working: ['Hot liquid iron and other metals move in the outer core.', 'This movement creates electric currents.', 'The currents produce the magnetic field.'], a: 'Moving liquid iron → electric currents → field' },
        { q: 'Explain why the magnetosphere is important.', working: ['It shields Earth from the solar wind and harmful radiation.', 'Without it the atmosphere could be stripped away and life would be at risk.'], a: 'Protects from solar wind/radiation and keeps our atmosphere' },
        { q: 'What do the iron filings do near a single magnet?', visual: field('single'), working: ['They line up in curved lines from one pole to the other.', 'Most filings crowd near the poles, where the field is strongest.'], a: 'Curved lines from pole to pole' },
        { q: 'What happens to the filings when N and S poles face each other?', visual: field('attract'), working: ['The lines join straight across the gap.', 'Unlike poles attract.'], a: 'Lines join — attract' },
        { q: 'What happens when two N poles face each other?', visual: field('repel'), working: ['The lines bend away from each other, leaving an empty gap.', 'Like poles repel.'], a: 'Lines push apart — repel' },
        { q: 'How is Earth\'s field like a bar magnet\'s? How does a compass work?', working: ['Both have field lines looping from one pole to the other.', 'A compass needle is a tiny magnet that lines up with Earth\'s field and points north.'], a: 'Same looping shape · needle lines up with the field' },
      ],
      tips: [
        'Magnet<b>o</b>sphere (magnetic bubble) ≠ atmosphere (air).',
        'Workbook MCQ answers: liquid iron · electric currents from moving metals · magnetosphere · solar wind and radiation · stops the atmosphere being stripped away.',
        'It is <b>not</b> really a buried bar magnet — it only behaves like one.',
      ],
    },
    mcq, tf, groups, calc: [practicalQ, practicalQ, chainQ], word,
  });
})(window.HL);
