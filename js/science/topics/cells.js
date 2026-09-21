/* Topic: Cells — EXEMPLAR science topic. Copy this structure.
 * Science questions are mostly 'choice' (big buttons) and short 'text'; keep numbers rare and easy. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools: randomising WHICH thing is asked is how science questions stay fresh ---------- */
  const PARTS = [
    { name: 'cell membrane', job: 'controls what goes in and out of the cell', where: 'both', pic: 'a skin or a doorway' },
    { name: 'nucleus', job: 'the control centre — it holds the DNA and tells the cell what to do', where: 'both', pic: 'the school principal' },
    { name: 'cytoplasm', job: 'the jelly where the chemical reactions happen', where: 'both', pic: 'jelly filling the room' },
    { name: 'mitochondria', job: 'release energy from food (respiration)', where: 'both', pic: 'tiny power stations' },
    { name: 'cell wall', job: 'a stiff outer layer that gives the cell its shape', where: 'plant', pic: 'a cardboard box around the bag' },
    { name: 'chloroplast', job: 'traps sunlight so the plant can make food (photosynthesis)', where: 'plant', pic: 'little green solar panels' },
    { name: 'vacuole', job: 'a big bag of water and sap that keeps the plant firm', where: 'plant', pic: 'a water balloon' },
  ];
  const ORGANISATION = ['cell', 'tissue', 'organ', 'organ system', 'organism'];
  const SPECIALISED = [
    { cell: 'red blood cell', feature: 'no nucleus and a dish shape', why: 'so it can carry as much oxygen as possible' },
    { cell: 'nerve cell', feature: 'very long and thin', why: 'so it can carry messages a long way' },
    { cell: 'root hair cell', feature: 'a long thin hair sticking out', why: 'so it can take in more water from the soil' },
    { cell: 'sperm cell', feature: 'a tail', why: 'so it can swim' },
    { cell: 'leaf cell', feature: 'packed with chloroplasts', why: 'so it can catch lots of sunlight' },
    { cell: 'muscle cell', feature: 'lots of mitochondria', why: 'so it can release the energy it needs to move' },
  ];

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const opts = [correct].concat(R.sample(wrongs, Math.min(n - 1, wrongs.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- diagrams ---------- */
  const cellSvg = (kind, highlight) => {
    const plant = kind === 'plant';
    const hi = (name, def) => (highlight === name ? '#E0568C' : def);
    return `<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${plant
        ? `<rect x="30" y="24" width="240" height="140" rx="10" fill="${hi('cell wall', '#DFF0D0')}" stroke="${hi('cell wall', '#6FA04C')}" stroke-width="4"/>
           <rect x="38" y="32" width="224" height="124" rx="8" fill="${hi('cytoplasm', '#F4FBEE')}" stroke="${hi('cell membrane', '#8FC96E')}" stroke-width="2.5"/>
           <ellipse cx="170" cy="94" rx="62" ry="40" fill="${hi('vacuole', '#DCEEF9')}" stroke="#93C7EA" stroke-width="2"/>
           ${[[70, 60], [96, 122], [130, 52], [60, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="${hi('chloroplast', '#8FC96E')}" transform="rotate(${(x + y) % 60 - 30} ${x} ${y})"/>`).join('')}`
        : `<ellipse cx="150" cy="94" rx="118" ry="66" fill="${hi('cytoplasm', '#FDECF3')}" stroke="${hi('cell membrane', '#E88BB0')}" stroke-width="4"/>
           ${[[80, 66], [96, 124], [206, 70], [214, 122]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="${hi('mitochondria', '#F0B383')}" transform="rotate(${(x + y) % 70 - 35} ${x} ${y})"/>`).join('')}`}
      <circle cx="${plant ? 86 : 150}" cy="94" r="24" fill="${hi('nucleus', '#C9B8F2')}" stroke="#9B85E0" stroke-width="2"/>
      <circle cx="${plant ? 86 : 150}" cy="94" r="8" fill="#9B85E0" opacity=".7"/>
      <text x="150" y="182" text-anchor="middle" fill="#4A4033">${plant ? 'a plant cell' : 'an animal cell'}</text>
    </svg>`;
  };
  const labelSvg = (kind, part) => {
    // the part being asked about is pulled out with an arrow
    const plant = kind === 'plant';
    const spots = plant
      ? { 'cell wall': [40, 30], 'cell membrane': [52, 44], nucleus: [86, 94], cytoplasm: [120, 140], chloroplast: [70, 60], vacuole: [176, 94] }
      : { 'cell membrane': [150, 30], nucleus: [150, 94], cytoplasm: [90, 150], mitochondria: [206, 70] };
    const [x, y] = spots[part] || [150, 94];
    return `<svg viewBox="0 0 300 214" width="300" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <g>${cellSvg(kind).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>
      <line x1="${x}" y1="${y}" x2="${x < 150 ? 26 : 274}" y2="200" stroke="#E0568C" stroke-width="2.5"/>
      <circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#E0568C" stroke-width="3"/>
      <text x="${x < 150 ? 26 : 274}" y="212" text-anchor="${x < 150 ? 'start' : 'end'}" fill="#E0568C" font-size="14">what is this part?</text>
    </svg>`;
  };

  /* ---------- question makers ---------- */
  function partJob(level) {
    const pool = level === 1 ? PARTS.filter((p) => ['cell membrane', 'nucleus', 'cytoplasm'].includes(p.name)) : PARTS;
    const p = R.pick(pool);
    const c = choice(p.job, PARTS.filter((q) => q.name !== p.name).map((q) => q.job));
    return {
      prompt: `What is the job of the <b>${p.name}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `Think of it as ${p.pic}.`,
      working: [`<b>Picture:</b> the ${p.name} is like ${p.pic}.`, `So its job is: <b>${p.job}</b>.`],
      finalAnswer: p.job, skill: 'parts',
    };
  }
  function nameThePart(level) {
    const kind = R.chance(0.5) ? 'plant' : 'animal';
    const pool = PARTS.filter((p) => (kind === 'plant' ? true : p.where === 'both'));
    const p = R.pick(level === 1 ? pool.filter((q) => ['nucleus', 'cell membrane', 'cell wall'].includes(q.name)).concat(pool[0]) : pool);
    const c = choice(p.name, PARTS.filter((q) => q.name !== p.name).map((q) => q.name));
    return {
      visual: labelSvg(kind, p.name),
      prompt: `Look at the ${kind} cell. What is the circled part called?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `It ${p.job}.`,
      working: [`The circled part ${p.job}.`, `That part is the <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'parts',
    };
  }
  function plantOrAnimal(level) {
    const p = R.pick(PARTS);
    const isPlantOnly = p.where === 'plant';
    const c = choice(isPlantOnly ? 'Only plant cells' : 'Both plant and animal cells', ['Only animal cells', isPlantOnly ? 'Both plant and animal cells' : 'Only plant cells'], 3);
    return {
      prompt: `Which cells have a <b>${p.name}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Plant cells have three extra parts that animal cells do not: cell wall, chloroplasts and a big vacuole.',
      working: [
        '<b>Picture:</b> a plant cell is an animal cell in a cardboard box, with green solar panels and a water balloon inside.',
        `1. Is the ${p.name} one of those three extras? ${isPlantOnly ? 'Yes.' : 'No.'}`,
        `So it is found in <b>${isPlantOnly ? 'only plant cells' : 'both plant and animal cells'}</b>.`,
      ],
      finalAnswer: isPlantOnly ? 'Only plant cells' : 'Both plant and animal cells', skill: 'plant-animal',
    };
  }
  function organisation(level) {
    const i = R.int(0, ORGANISATION.length - 2);
    const c = choice(ORGANISATION[i + 1], ORGANISATION.filter((x) => x !== ORGANISATION[i + 1]));
    return {
      prompt: `Cells are organised from smallest to biggest. What comes straight after ${/^[aeiou]/.test(ORGANISATION[i]) ? 'an' : 'a'} <b>${ORGANISATION[i]}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'cell → tissue → organ → organ system → organism',
      working: ['<b>Picture:</b> bricks → a wall → a room → a house → a whole street.', `The order is: ${ORGANISATION.join(' → ')}.`, `After ${/^[aeiou]/.test(ORGANISATION[i]) ? 'an' : 'a'} ${ORGANISATION[i]} comes ${/^[aeiou]/.test(ORGANISATION[i + 1]) ? 'an' : 'a'} <b>${ORGANISATION[i + 1]}</b>.`],
      finalAnswer: ORGANISATION[i + 1], skill: 'organisation',
    };
  }
  function specialised(level) {
    const s = R.pick(SPECIALISED);
    if (R.chance(0.5)) {
      const c = choice(s.why, SPECIALISED.filter((x) => x.cell !== s.cell).map((x) => x.why));
      return {
        prompt: `A <b>${s.cell}</b> has ${s.feature}. Why is that useful?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Match the shape to the job the cell has to do.',
        working: [`<b>Picture:</b> the cell is a tool built for one job.`, `1. What does a ${s.cell} have to do?`, `Its ${s.feature} is <b>${s.why}</b>.`],
        finalAnswer: s.why, skill: 'specialised',
      };
    }
    const c = choice(s.cell, SPECIALISED.filter((x) => x.cell !== s.cell).map((x) => x.cell));
    return {
      prompt: `Which cell has <b>${s.feature}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Think about which cell needs that feature to do its job.',
      working: [`${s.feature.charAt(0).toUpperCase() + s.feature.slice(1)} is useful ${s.why}.`, `That is the <b>${s.cell}</b>.`],
      finalAnswer: s.cell, skill: 'specialised',
    };
  }
  function microscope(level) {
    const eyepiece = R.pick([5, 10, 10, 15]);
    const objective = R.pick([4, 10, 40]);
    return {
      prompt: `A microscope has a ×${eyepiece} eyepiece and a ×${objective} objective lens. What is the total magnification?`,
      answer: { type: 'number', value: eyepiece * objective, placeholder: 'e.g. 100' },
      hint: 'Multiply the two lenses together.',
      working: ['<b>Rule:</b> total magnification = eyepiece × objective.', `${eyepiece} × ${objective} = <b>${eyepiece * objective}</b>`, `So the cell looks ${eyepiece * objective} times bigger than it really is.`],
      finalAnswer: `×${eyepiece * objective}`, skill: 'microscope',
    };
  }

  const WORD = [
    () => {
      const s = R.pick(SPECIALISED);
      return {
        prompt: `Harper looks at a slide under the microscope and sees cells that are ${s.feature}. What kind of cells are they most likely to be?`,
        answer: (() => { const c = choice(s.cell, SPECIALISED.filter((x) => x.cell !== s.cell).map((x) => x.cell)); return { type: 'choice', value: c.value, choices: c.choices }; })(),
        hint: 'Shape follows the job. What job would need that shape?',
        working: [`<b>Picture:</b> a cell is built for its job, like a tool.`, `1. What is that feature good for? It is ${s.why}.`, `So they are <b>${s.cell}s</b>.`],
        finalAnswer: s.cell,
      };
    },
    () => {
      const c = choice('It has chloroplasts and a cell wall', ['It has a nucleus', 'It has a cell membrane', 'It has cytoplasm'], 4);
      return {
        prompt: 'Harper looks at a leaf under a microscope. How can she tell straight away that these are plant cells and not animal cells?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Both kinds of cell have a nucleus, a membrane and cytoplasm — look for what only plants have.',
        working: ['<b>Picture:</b> a plant cell is an animal cell in a cardboard box with green solar panels inside.', '1. Do animal cells have a nucleus, membrane and cytoplasm? Yes — so those cannot be the clue.', 'Only plant cells have <b>chloroplasts and a cell wall</b>.'],
        finalAnswer: 'It has chloroplasts and a cell wall',
      };
    },
    () => {
      const organ = R.pick([['heart', 'circulatory system'], ['stomach', 'digestive system'], ['lung', 'breathing system'], ['kidney', 'urinary system']]);
      const c = choice(organ[1], ['nervous system', 'skeletal system', 'muscular system'].filter((x) => x !== organ[1]));
      return {
        prompt: `The ${organ[0]} is an organ. Which organ system is it part of?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Organs that work together on the same job make an organ system.',
        working: [`<b>Picture:</b> rooms that work together make a house.`, `The ${organ[0]} works with other organs in the <b>${organ[1]}</b>.`],
        finalAnswer: organ[1],
      };
    },
    () => ({
      prompt: 'A leaf cell is packed with chloroplasts, but a root cell has none at all. Why not?',
      answer: (() => { const c = choice('No sunlight reaches the roots, so they cannot photosynthesise', ['Roots do not need any energy', 'Roots are too small for chloroplasts', 'Chloroplasts are washed away by water'], 4); return { type: 'choice', value: c.value, choices: c.choices }; })(),
      hint: 'What do chloroplasts need in order to work?',
      working: ['<b>Picture:</b> chloroplasts are little solar panels.', '1. What does a solar panel need? Sunlight.', '2. Is it sunny underground? No.', 'So roots have <b>no chloroplasts — no sunlight reaches them</b>.'],
      finalAnswer: 'No sunlight reaches the roots, so they cannot photosynthesise',
    }),
  ];

  HL.registerTopic({
    id: 'cells', subject: 'science', strand: 'living', order: 1,
    name: 'Cells', short: 'Cells', animal: 'gecko',
    blurb: 'The tiny building blocks that every living thing is made of.',
    example: 'nucleus = the control centre · chloroplast = solar panel',
    learn: {
      what: '<p>Every living thing is built from <b>cells</b>. They are far too small to see without a microscope — about 50 of them would fit across a full stop. Each part of a cell has one job, and cells that do the same job group together into <b>tissues</b>, then <b>organs</b>, then <b>organ systems</b>.</p><p><b>Picture for this topic:</b> a cell is a tiny <b>factory</b>. The nucleus is the boss, the mitochondria are the power station, and the membrane is the door that decides what comes in and out.</p>',
      visual: `<svg viewBox="0 0 340 210" width="340" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11.5" font-weight="700">
        <ellipse cx="96" cy="96" rx="82" ry="60" fill="#FDECF3" stroke="#E88BB0" stroke-width="4"/>
        <circle cx="96" cy="96" r="22" fill="#C9B8F2" stroke="#9B85E0" stroke-width="2"/><circle cx="96" cy="96" r="7" fill="#9B85E0" opacity=".7"/>
        ${[[50, 62], [58, 128], [140, 68], [142, 126]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="7" fill="#F0B383" transform="rotate(${(x + y) % 70 - 35} ${x} ${y})"/>`).join('')}
        <text x="96" y="176" text-anchor="middle" fill="#4A4033">animal cell</text>
        <rect x="196" y="34" width="130" height="124" rx="8" fill="#DFF0D0" stroke="#6FA04C" stroke-width="4"/>
        <rect x="203" y="41" width="116" height="110" rx="6" fill="#F4FBEE" stroke="#8FC96E" stroke-width="2"/>
        <ellipse cx="278" cy="96" rx="34" ry="30" fill="#DCEEF9" stroke="#93C7EA" stroke-width="2"/>
        <circle cx="228" cy="96" r="17" fill="#C9B8F2" stroke="#9B85E0" stroke-width="2"/>
        ${[[228, 58], [246, 132], [214, 128]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="6.5" fill="#8FC96E" transform="rotate(${(x + y) % 60 - 30} ${x} ${y})"/>`).join('')}
        <text x="261" y="176" text-anchor="middle" fill="#4A4033">plant cell</text>
        <text x="170" y="196" text-anchor="middle" fill="#C98A1C" font-size="12">plant extras: cell wall · chloroplasts · big vacuole</text>
      </svg>`,
      facts: [
        '<b>Nucleus</b> = the control centre (holds the DNA)',
        '<b>Cell membrane</b> = the door: controls what goes in and out',
        '<b>Cytoplasm</b> = the jelly where reactions happen',
        '<b>Mitochondria</b> = power stations (release energy from food)',
        'Plants only: <b>cell wall</b>, <b>chloroplasts</b>, big <b>vacuole</b>',
        'Size order: <b>cell → tissue → organ → organ system → organism</b>',
      ],
      steps: [
        'Ask "<b>is this part in the plant-only list?</b>" — cell wall, chloroplast, big vacuole. If yes, only plants have it. If no, both kinds of cell have it.',
        'To remember a part\'s job, use the factory picture: <b>boss</b> (nucleus), <b>door</b> (membrane), <b>power station</b> (mitochondria), <b>solar panel</b> (chloroplast), <b>water balloon</b> (vacuole).',
        'For a specialised cell, ask "<b>what job does it do?</b>" then check how its shape helps: long and thin to reach far, no nucleus to fit more oxygen in, a tail to swim.',
        'Total magnification on a microscope = <b>eyepiece × objective</b>.',
      ],
      examples: [
        { q: 'What is the job of the mitochondria?',
          working: ['<b>Picture:</b> the cell is a factory; mitochondria are its power stations.', '1. What does a power station do? It makes energy available.', 'So mitochondria <b>release energy from food</b>. That is called respiration.'],
          a: 'They release energy from food' },
        { q: 'Which parts does a plant cell have that an animal cell does not?',
          visual: `<svg viewBox="0 0 300 130" width="300" height="130" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="14" y="18" width="120" height="86" rx="8" fill="#DFF0D0" stroke="#6FA04C" stroke-width="4"/>
            <rect x="21" y="25" width="106" height="72" rx="6" fill="#F4FBEE" stroke="#8FC96E" stroke-width="2"/>
            <ellipse cx="98" cy="62" rx="26" ry="22" fill="#DCEEF9" stroke="#93C7EA" stroke-width="2"/>
            <circle cx="46" cy="62" r="14" fill="#C9B8F2" stroke="#9B85E0" stroke-width="2"/>
            <ellipse cx="46" cy="34" rx="10" ry="6" fill="#8FC96E"/><ellipse cx="42" cy="90" rx="10" ry="6" fill="#8FC96E"/>
            <text x="74" y="120" text-anchor="middle" fill="#4A4033">plant</text>
            <ellipse cx="222" cy="62" rx="62" ry="42" fill="#FDECF3" stroke="#E88BB0" stroke-width="4"/>
            <circle cx="222" cy="62" r="15" fill="#C9B8F2" stroke="#9B85E0" stroke-width="2"/>
            <ellipse cx="188" cy="40" rx="11" ry="6" fill="#F0B383"/><ellipse cx="252" cy="84" rx="11" ry="6" fill="#F0B383"/>
            <text x="222" y="120" text-anchor="middle" fill="#4A4033">animal</text></svg>`,
          working: ['<b>Picture:</b> a plant cell is an animal cell put in a cardboard box, with green solar panels and a water balloon inside.', '1. The box → <b>cell wall</b> (keeps the shape stiff).', '2. The solar panels → <b>chloroplasts</b> (catch sunlight to make food).', '3. The water balloon → a big <b>vacuole</b> (keeps the plant firm).'],
          a: 'Cell wall, chloroplasts and a big vacuole' },
        { q: 'A red blood cell has no nucleus. Why is that useful?',
          working: ['<b>Picture:</b> a delivery van with the seats taken out so more parcels fit.', '1. What is a red blood cell\'s job? Carrying oxygen.', '2. Taking the nucleus out leaves more room inside.', 'So it can <b>carry more oxygen</b>.'],
          a: 'It leaves more room to carry oxygen' },
        { q: 'Put these in order from smallest to biggest: organ, cell, organism, tissue, organ system.',
          working: ['<b>Picture:</b> bricks → a wall → a room → a house → a street.', 'cell → tissue → organ → organ system → organism.', 'A muscle <b>cell</b> → muscle <b>tissue</b> → the <b>heart</b> → the <b>circulatory system</b> → <b>Harper</b>.'],
          a: 'cell → tissue → organ → organ system → organism' },
        { q: 'A microscope has a ×10 eyepiece and a ×40 objective lens. What is the total magnification?',
          working: ['<b>Rule:</b> total magnification = eyepiece × objective.', '10 × 40 = 400.', 'The cell looks <b>400 times</b> bigger than it really is.'],
          a: '×400' },
        { q: 'Root hair cells have a long thin hair sticking out into the soil. Why?',
          working: ['<b>Picture:</b> a straw reaching further into a drink.', '1. What is a root\'s job? Taking in water and minerals.', '2. A long thin hair gives a much bigger surface touching the soil.', 'So the plant can <b>take in more water</b>.'],
          a: 'To take in more water from the soil' },
      ],
      tips: [
        'Plant cells have a cell wall <b>as well as</b> a membrane, not instead of one.',
        'Chloroplasts are only where light reaches — leaves have them, roots do not.',
        'Do not mix up the <b>cell wall</b> (stiff, plants only) with the <b>cell membrane</b> (thin, every cell).',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [partJob, nameThePart, plantOrAnimal, organisation]
        : level === 2
          ? [partJob, nameThePart, plantOrAnimal, organisation, specialised, microscope]
          : [nameThePart, plantOrAnimal, specialised, microscope, partJob, organisation];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
