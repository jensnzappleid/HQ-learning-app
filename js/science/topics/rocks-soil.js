/* Topic: Rocks & Soil — the three rock types, the rock cycle, weathering, erosion and soil. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const ROCKS = [
    { n: 'basalt', t: 'igneous', how: 'runny lava that cooled quickly at the surface', nz: 'the old lava flows under Auckland and on Rangitoto', clue: 'dark, heavy and full of tiny crystals' },
    { n: 'pumice', t: 'igneous', how: 'frothy lava full of gas bubbles that cooled very fast', nz: 'the pale floating stones on the shore of Lake Taupō', clue: 'so full of holes that it floats on water' },
    { n: 'obsidian', t: 'igneous', how: 'lava that cooled so fast no crystals had time to grow', nz: 'Tūhua / Mayor Island, where Māori prized it for cutting tools', clue: 'shiny black volcanic glass' },
    { n: 'granite', t: 'igneous', how: 'magma that cooled slowly deep underground, so big crystals grew', nz: 'the granite of Rakiura / Stewart Island', clue: 'speckled, with crystals big enough to see' },
    { n: 'sandstone', t: 'sedimentary', how: 'sand grains that settled in layers, then got buried and cemented together', nz: 'the cliffs along the Whanganui River', clue: 'you can rub the grains off with your finger' },
    { n: 'limestone', t: 'sedimentary', how: 'shells and skeletons of sea creatures pressed together over millions of years', nz: 'the Pancake Rocks at Punakaiki', clue: 'pale, layered, and often full of fossils' },
    { n: 'mudstone', t: 'sedimentary', how: 'fine mud that settled in still water and was squashed', nz: 'the soft papa hills of Taranaki', clue: 'so fine you cannot see any grains' },
    { n: 'coal', t: 'sedimentary', how: 'dead swamp plants buried and squashed for millions of years', nz: 'the West Coast coal mines near Westport', clue: 'black, light, and it burns' },
    { n: 'greywacke', t: 'sedimentary', how: 'sand and mud from the sea floor buried, squashed and hardened', nz: 'the grey backbone rock of the Southern Alps and most NZ riverbeds', clue: 'hard grey rock that breaks into sharp blocks' },
    { n: 'marble', t: 'metamorphic', how: 'limestone changed by heat and pressure, so its crystals re-grew', nz: 'Takaka Hill and the caves of Mount Owen', clue: 'pale, sparkly, and smooth when polished' },
    { n: 'schist', t: 'metamorphic', how: 'mudstone squashed and heated until its minerals lined up in shiny bands', nz: 'the flat grey rock walls and hillsides of Central Otago', clue: 'splits into flat shiny sheets with silvery bands' },
    { n: 'pounamu (greenstone)', t: 'metamorphic', how: 'rock changed by enormous heat and pressure near the Alpine Fault', nz: 'Te Tai Poutini, the West Coast — a taonga carved by Māori', clue: 'tough green stone that takes a beautiful polish' },
    { n: 'slate', t: 'metamorphic', how: 'mudstone squashed until it splits into flat sheets', nz: 'used for old roof tiles and blackboards', clue: 'splits into thin flat plates' },
  ];

  const TYPES = ['igneous', 'sedimentary', 'metamorphic'];
  const TYPE_INFO = {
    igneous: { def: 'melted rock (magma or lava) that has cooled and set hard', pic: 'chocolate that melted and set again', crystal: 'crystals — big ones if it cooled slowly, tiny ones if it cooled fast' },
    sedimentary: { def: 'layers of bits — sand, mud, shells — buried and squashed together', pic: 'a squashed sandwich of layers', crystal: 'flat layers, and often fossils' },
    metamorphic: { def: 'any rock changed by heat and pressure, without melting', pic: 'a toasted sandwich — squashed and heated, but not melted', crystal: 'wavy bands or lined-up shiny crystals' },
  };

  const PROCESSES = [
    { p: 'ice freezing in a crack and splitting the rock apart', kind: 'weathering', why: 'the rock is broken up but stays where it is' },
    { p: 'a tree root growing into a crack and widening it', kind: 'weathering', why: 'it breaks the rock up on the spot' },
    { p: 'rain that is slightly acidic slowly dissolving limestone', kind: 'weathering', why: 'it eats away at the rock where it stands' },
    { p: 'a river carrying pebbles downstream', kind: 'erosion', why: 'the bits are being carried away' },
    { p: 'wind blowing sand off a dune', kind: 'erosion', why: 'the material is moved somewhere else' },
    { p: 'waves dragging sand off a beach in a storm', kind: 'erosion', why: 'the sand is transported away' },
    { p: 'a glacier scraping rock down a valley', kind: 'erosion', why: 'the ice carries the rock away with it' },
    { p: 'hot days and cold nights making a rock face flake', kind: 'weathering', why: 'the rock crumbles in place' },
    { p: 'a river slowing down and dropping its sand at the river mouth', kind: 'deposition', why: 'the load is being dropped in a new place' },
    { p: 'sand settling on the sea floor in layers', kind: 'deposition', why: 'the material is being laid down' },
  ];

  const SOIL_PARTS = [
    { part: 'humus', what: 'rotted dead plants and animals — it holds water and feeds the plants' },
    { part: 'weathered rock bits', what: 'sand, silt and clay broken off the bedrock below' },
    { part: 'water', what: 'held in the gaps, so roots can drink' },
    { part: 'air', what: 'in the gaps between the grains, so roots and worms can breathe' },
    { part: 'living things', what: 'worms, insects, fungi and bacteria that mix it and rot things down' },
  ];

  const LAYERS = ['leaf litter', 'topsoil', 'subsoil', 'weathered rock', 'bedrock'];

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms accepted for each unit's actual vocabulary term, used wherever she has to
   *  type the term herself instead of picking it from a list. */
  const ROCK_NAME_ACCEPT = { 'pounamu (greenstone)': ['pounamu', 'greenstone'] };
  const SOIL_LAYER_ACCEPT = { 'leaf litter': ['leaves'], topsoil: ['top soil'], subsoil: ['sub soil'], 'weathered rock': ['weathered rock bits'], bedrock: ['bed rock'] };

  /* ---------- diagrams ---------- */
  function rockCycleSvg(highlight) {
    const box = (x, y, label, hi) => `
      <rect x="${x}" y="${y}" width="104" height="30" rx="8" fill="${hi ? '#FBD9E6' : '#F6EEDC'}" stroke="${hi ? '#E0568C' : '#C98A1C'}" stroke-width="${hi ? 3 : 2}"/>
      <text x="${x + 52}" y="${y + 20}" text-anchor="middle" fill="#4A4033" font-size="12.5">${label}</text>`;
    const arrow = (x1, y1, x2, y2) => {
      const a = Math.atan2(y2 - y1, x2 - x1);
      const p = (t, s) => `${x2 - 11 * Math.cos(a - s)},${y2 - 11 * Math.sin(a - s)}`;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6FA04C" stroke-width="2.5"/>
        <polygon points="${x2},${y2} ${p(0, 0.42)} ${p(0, -0.42)}" fill="#6FA04C"/>`;
    };
    return `<svg viewBox="0 0 350 212" width="350" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="350" height="212" fill="#FFFFFF"/>
      ${box(123, 12, 'igneous', highlight === 'igneous')}
      ${box(236, 92, 'sedimentary', highlight === 'sedimentary')}
      ${box(123, 172, 'metamorphic', highlight === 'metamorphic')}
      ${box(10, 92, 'magma', highlight === 'magma')}
      ${arrow(227, 33, 282, 88)}
      ${arrow(288, 124, 233, 174)}
      ${arrow(123, 187, 66, 126)}
      ${arrow(60, 88, 118, 34)}
      <text x="208" y="56" text-anchor="middle" fill="#6FA04C" font-size="11">worn down</text>
      <text x="208" y="69" text-anchor="middle" fill="#6FA04C" font-size="11">+ buried</text>
      <text x="210" y="150" text-anchor="middle" fill="#6FA04C" font-size="11">heat +</text>
      <text x="210" y="163" text-anchor="middle" fill="#6FA04C" font-size="11">pressure</text>
      <text x="70" y="166" text-anchor="middle" fill="#6FA04C" font-size="11">melts</text>
      <text x="66" y="58" text-anchor="middle" fill="#6FA04C" font-size="11">cools</text>
      <text x="175" y="102" text-anchor="middle" fill="#8A7B63" font-size="12">THE ROCK</text>
      <text x="175" y="118" text-anchor="middle" fill="#8A7B63" font-size="12">CYCLE</text>
    </svg>`;
  }

  function textureSvg(type) {
    const body = type === 'sedimentary'
      ? `${[0, 1, 2, 3].map((i) => `<rect x="30" y="${34 + i * 22}" width="200" height="21" fill="${i % 2 ? '#E9C99A' : '#D9B078'}" stroke="#8A7B63" stroke-width="1.2"/>`).join('')}
         <ellipse cx="90" cy="78" rx="12" ry="7" fill="#FFFFFF" stroke="#8A7B63" stroke-width="1.2"/>
         <text x="130" y="146" text-anchor="middle" fill="#4A4033" font-size="11.5">flat layers, with a fossil shell</text>`
      : type === 'igneous'
        ? `<rect x="30" y="34" width="200" height="88" fill="#B7B0A4" stroke="#8A7B63" stroke-width="1.5"/>
           ${[[62, 56], [110, 74], [160, 52], [200, 96], [84, 106], [140, 108], [186, 64], [120, 44]].map(([x, y], i) => `<polygon points="${x},${y - 9} ${x + 9},${y} ${x},${y + 9} ${x - 9},${y}" fill="${i % 3 === 0 ? '#4A4033' : i % 3 === 1 ? '#E9A07A' : '#FFFFFF'}" stroke="#8A7B63" stroke-width="1"/>`).join('')}
           <text x="130" y="146" text-anchor="middle" fill="#4A4033" font-size="11.5">crystals locked together, no layers</text>`
        : `<rect x="30" y="34" width="200" height="88" fill="#C9BCA6" stroke="#8A7B63" stroke-width="1.5"/>
           ${[0, 1, 2, 3].map((i) => `<path d="M 30 ${48 + i * 20} q 50 -12 100 0 q 50 12 100 0" fill="none" stroke="${i % 2 ? '#6FA04C' : '#4A4033'}" stroke-width="3"/>`).join('')}
           <text x="130" y="146" text-anchor="middle" fill="#4A4033" font-size="11.5">wavy squashed bands</text>`;
    return `<svg viewBox="0 0 260 158" width="260" height="158" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="260" height="158" fill="#FFFFFF"/>
      <text x="130" y="22" text-anchor="middle" fill="#8A7B63" font-size="12">a rock sample under a hand lens</text>
      ${body}
    </svg>`;
  }

  function soilSvg() {
    const rows = [
      ['leaf litter', 16, '#6FA04C'],
      ['topsoil (dark, lots of humus)', 32, '#5A4A34'],
      ['subsoil (clay + stones)', 36, '#C08A5A'],
      ['weathered rock', 28, '#B7B0A4'],
      ['bedrock (solid)', 26, '#8A7B63'],
    ];
    let y = 26, s = '';
    rows.forEach(([label, h, fill]) => {
      s += `<rect x="16" y="${y}" width="118" height="${h}" fill="${fill}" stroke="#4A4033" stroke-width="1.2"/>`;
      s += `<line x1="134" y1="${y + h / 2}" x2="146" y2="${y + h / 2}" stroke="#C9BCA6" stroke-width="1.5"/>`;
      s += `<text x="150" y="${y + h / 2 + 4}" fill="#4A4033" font-size="11.5">${label}</text>`;
      y += h;
    });
    return `<svg viewBox="0 0 340 190" width="340" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="190" fill="#FFFFFF"/>
      <text x="16" y="18" fill="#8A7B63" font-size="12">a slice down through the ground</text>
      ${s}
      <text x="16" y="184" fill="#6FA04C" font-size="11.5">1 cm of topsoil can take 200 years to form</text>
    </svg>`;
  }

  function freezeThawSvg() {
    const panel = (x, l1, l2, extra) => `
      <rect x="${x}" y="30" width="94" height="72" rx="6" fill="#C9BCA6" stroke="#8A7B63" stroke-width="1.5"/>
      ${extra}
      <text x="${x + 47}" y="120" text-anchor="middle" fill="#4A4033" font-size="12">${l1}</text>
      <text x="${x + 47}" y="136" text-anchor="middle" fill="#4A4033" font-size="12">${l2}</text>`;
    return `<svg viewBox="0 0 340 148" width="340" height="148" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="148" fill="#FFFFFF"/>
      <text x="170" y="18" text-anchor="middle" fill="#8A7B63" font-size="12">freeze–thaw weathering</text>
      ${panel(10, '1. rain fills', 'a crack', '<path d="M 57 30 L 51 70 L 63 70 Z" fill="#A9D8F5" stroke="#5F98C4" stroke-width="1.5"/>')}
      ${panel(123, '2. it freezes', 'and swells', '<path d="M 170 30 L 158 74 L 182 74 Z" fill="#FFFFFF" stroke="#5F98C4" stroke-width="2"/><text x="170" y="62" text-anchor="middle" fill="#5F98C4" font-size="10.5">ice</text>')}
      ${panel(236, '3. the rock', 'splits', '<path d="M 283 30 L 268 102 M 283 30 L 298 102" stroke="#4A4033" stroke-width="2.5" fill="none"/>')}
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function rockTypeQ(level) {
    const r = R.pick(ROCKS);
    return {
      prompt: `What type of rock is <b>${r.n}</b>?`,
      answer: textAns(r.t, [], 'one word'),
      hint: `Clue: it forms from ${r.how}.`,
      working: ['<b>Picture:</b> melted chocolate that set (igneous) · a squashed layer sandwich (sedimentary) · a toasted sandwich (metamorphic).', `1. How does ${r.n} form? From ${r.how}.`, `That makes it <b>${r.t}</b>.`],
      finalAnswer: r.t, skill: 'rock-types',
    };
  }

  function rockFormQ(level) {
    const r = R.pick(ROCKS);
    if (R.chance(0.5)) {
      const c = choice(r.how, ROCKS.map((x) => x.how));
      return {
        prompt: `How does <b>${r.n}</b> form?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `${r.n.charAt(0).toUpperCase() + r.n.slice(1)} is ${r.t}. ${r.clue.charAt(0).toUpperCase() + r.clue.slice(1)}.`,
        working: [`<b>Picture:</b> ${TYPE_INFO[r.t].pic}.`, `${r.n.charAt(0).toUpperCase() + r.n.slice(1)} is a <b>${r.t}</b> rock.`, `It forms from <b>${r.how}</b>.`],
        finalAnswer: r.how, skill: 'formation',
      };
    }
    return {
      prompt: `Which rock forms from <b>${r.how}</b>?`,
      answer: textAns(r.n, ROCK_NAME_ACCEPT[r.n], 'one word'),
      hint: `It is a ${r.t} rock — ${r.clue}.`,
      working: [`<b>Picture:</b> ${TYPE_INFO[r.t].pic}.`, `That description is <b>${r.n}</b>, a ${r.t} rock.`],
      finalAnswer: r.n, skill: 'formation',
    };
  }

  function typeDefQ(level) {
    const t = R.pick(TYPES);
    if (R.chance(0.5)) {
      const c = choice(TYPE_INFO[t].def, TYPES.map((x) => TYPE_INFO[x].def), 3);
      return {
        prompt: `What are <b>${t}</b> rocks made from?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Think: ${TYPE_INFO[t].pic}.`,
        working: [`<b>Picture:</b> ${TYPE_INFO[t].pic}.`, `${t.charAt(0).toUpperCase() + t.slice(1)} rocks are <b>${TYPE_INFO[t].def}</b>.`],
        finalAnswer: TYPE_INFO[t].def, skill: 'rock-types',
      };
    }
    return {
      prompt: `Which type of rock is made from <b>${TYPE_INFO[t].def}</b>?`,
      answer: textAns(t, [], 'one word'),
      hint: `Remember: ${TYPE_INFO[t].pic}.`,
      working: [`<b>Picture:</b> ${TYPE_INFO[t].pic}.`, `That is <b>${t}</b>.`],
      finalAnswer: t, skill: 'rock-types',
    };
  }

  function textureQ(level) {
    const t = R.pick(TYPES);
    return {
      visual: textureSvg(t),
      prompt: 'Look at the rock sample. Which type of rock is it?',
      answer: textAns(t, [], 'one word'),
      hint: 'Layers → sedimentary. Locked-together crystals → igneous. Wavy squashed bands → metamorphic.',
      working: ['<b>Picture:</b> layer sandwich · melted-and-set chocolate · toasted sandwich.', `1. What can you see? ${TYPE_INFO[t].crystal}.`, `So it is <b>${t}</b>.`],
      finalAnswer: t, skill: 'rock-types',
    };
  }

  function nzExampleQ(level) {
    const r = R.pick(ROCKS);
    return {
      prompt: `Which New Zealand rock would you find at <b>${r.nz}</b>?`,
      answer: textAns(r.n, ROCK_NAME_ACCEPT[r.n], 'one word'),
      hint: `It is a ${r.t} rock — ${r.clue}.`,
      working: [`<b>Picture:</b> a map of Aotearoa with the rocks marked on.`, `${r.nz.charAt(0).toUpperCase() + r.nz.slice(1)} → <b>${r.n}</b> (${r.t}).`],
      finalAnswer: r.n, skill: 'nz-rocks',
    };
  }

  function rockCycleQ(level) {
    const steps = [
      { q: 'What has to happen to turn <b>magma</b> into an <b>igneous</b> rock?', a: 'It cools down and sets hard', wrongs: ['It gets squashed into layers', 'It is heated even more', 'It is worn away by a river'], hi: 'igneous' },
      { q: 'What has to happen to turn an <b>igneous</b> rock into a <b>sedimentary</b> rock?', a: 'It is worn down into bits, then the bits are buried and squashed', wrongs: ['It melts and cools', 'It is heated and squashed without melting', 'Nothing — it happens on its own'], hi: 'sedimentary' },
      { q: 'What has to happen to turn a <b>sedimentary</b> rock into a <b>metamorphic</b> rock?', a: 'Heat and pressure change it, without melting it', wrongs: ['It melts completely', 'It is worn down by a river', 'It dries out in the sun'], hi: 'metamorphic' },
      { q: 'What has to happen to turn a <b>metamorphic</b> rock back into <b>magma</b>?', a: 'It gets hot enough to melt', wrongs: ['It gets squashed harder', 'It is buried in sand', 'It cools right down'], hi: 'magma' },
      { q: 'Limestone is buried deep and heated until it becomes marble. What is that change called?', a: 'It has become a metamorphic rock', wrongs: ['It has become an igneous rock', 'It has become a sedimentary rock', 'It has melted into magma'], hi: 'metamorphic' },
    ];
    const it = R.pick(steps);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: rockCycleSvg(it.hi),
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Round the cycle: magma —cools→ igneous —worn down & buried→ sedimentary —heat & pressure→ metamorphic —melts→ magma.',
      working: ['<b>Picture:</b> the rock cycle wheel — every rock can become any other rock, given enough time.', it.a + '.'],
      finalAnswer: it.a, skill: 'rock-cycle',
    };
  }

  function weatherErodeQ(level) {
    const p = R.pick(level === 1 ? PROCESSES.filter((x) => x.kind !== 'deposition') : PROCESSES);
    return {
      prompt: `Is this <b>weathering</b>, <b>erosion</b> or <b>deposition</b>?<br>${p.p.charAt(0).toUpperCase() + p.p.slice(1)}.`,
      answer: textAns(p.kind, [], 'one word'),
      hint: 'Weathering = broken up ON THE SPOT. Erosion = carried AWAY. Deposition = dropped somewhere new.',
      working: ['<b>Picture:</b> breaking a biscuit (weathering), carrying the crumbs off (erosion), tipping them on the floor (deposition).', `1. Ask: does the rock stay put or move? ${p.why.charAt(0).toUpperCase() + p.why.slice(1)}.`, `So it is <b>${p.kind}</b>.`],
      finalAnswer: p.kind, skill: 'weathering',
      visual: /ice freezing/.test(p.p) ? freezeThawSvg() : undefined,
    };
  }

  const WEATHER_TEXT = [
    { q: 'Water gets into a crack, freezes overnight, swells, and cracks the rock apart. What is this called?', a: 'freeze-thaw weathering', accept: ['freeze thaw weathering', 'freezethaw weathering', 'freeze-thaw', 'freeze thaw'], full: 'Freeze–thaw weathering',
      w: ['<b>Picture:</b> a full drink bottle left in the freezer — the ice pushes the sides out.', '1. Water expands by about a tenth when it freezes.', '2. That push widens the crack a tiny bit every night.', 'That is <b>freeze–thaw weathering</b>.'], svg: true },
    { q: 'Slightly acidic rain slowly dissolves the limestone at Punakaiki. What kind of weathering is this?', a: 'chemical weathering', accept: ['chemical'], full: 'Chemical weathering',
      w: ['<b>Picture:</b> a fizzy drink slowly eating away at a tooth.', '1. Is the rock being smashed or dissolved? Dissolved.', 'Rock dissolved by a chemical = <b>chemical weathering</b>.'] },
    { q: 'A tree root grows into a crack and slowly forces it wider. What kind of weathering is this?', a: 'biological weathering', accept: ['biological'], full: 'Biological weathering (a living thing does it)',
      w: ['<b>Picture:</b> a root working like a very slow crowbar.', '1. What is doing the breaking? A living thing.', 'So it is <b>biological weathering</b>.'] },
  ];
  const WEATHER_CHOICE = [
    { q: 'What is the difference between weathering and erosion?', a: 'Weathering breaks rock up where it is; erosion carries the pieces away', wrongs: ['They are two words for the same thing', 'Weathering only happens in the rain', 'Erosion happens first, then weathering'],
      w: ['<b>Picture:</b> breaking a biscuit on the bench (weathering), then sweeping the crumbs into the bin (erosion).', 'Weathering = <b>break up in place</b>. Erosion = <b>carry away</b>.'] },
  ];
  function weatheringTypeQ(level) {
    if (R.chance(0.75)) {
      const it = R.pick(WEATHER_TEXT);
      return {
        visual: it.svg ? freezeThawSvg() : undefined,
        prompt: it.q,
        answer: textAns(it.a, it.accept, 'two or three words'),
        hint: 'Break it up = weathering. Move it = erosion.',
        working: it.w, finalAnswer: it.full, skill: 'weathering',
      };
    }
    const it = R.pick(WEATHER_CHOICE);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Break it up = weathering. Move it = erosion.',
      working: it.w, finalAnswer: it.a, skill: 'weathering',
    };
  }

  function soilQ(level) {
    const style = R.pick(['part', 'layer', 'made']);
    if (style === 'part') {
      const s = R.pick(SOIL_PARTS);
      if (R.chance(0.5)) {
        const c = choice(s.what, SOIL_PARTS.map((x) => x.what));
        return {
          visual: R.chance(0.4) ? soilSvg() : undefined,
          prompt: `Soil contains <b>${s.part}</b>. What is it, and what does it do?`,
          answer: { type: 'choice', value: c.value, choices: c.choices },
          hint: 'Soil is not just dirt — it is rock bits, rotted stuff, water, air and living things.',
          working: ['<b>Picture:</b> soil as a recipe with five ingredients.', `<b>${s.part}</b>: ${s.what}.`],
          finalAnswer: s.what, skill: 'soil',
        };
      }
      const c = choice(s.part, SOIL_PARTS.map((x) => x.part));
      return {
        prompt: `Which part of soil is "${s.what}"?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The five ingredients: humus, weathered rock bits, water, air and living things.',
        working: ['<b>Picture:</b> soil as a recipe with five ingredients.', `That is <b>${s.part}</b>.`],
        finalAnswer: s.part, skill: 'soil',
      };
    }
    if (style === 'layer') {
      const i = R.int(0, LAYERS.length - 2);
      return {
        visual: soilSvg(),
        prompt: `Digging straight down, which layer comes <b>just below</b> the ${LAYERS[i]}?`,
        answer: textAns(LAYERS[i + 1], SOIL_LAYER_ACCEPT[LAYERS[i + 1]], 'one or two words'),
        hint: LAYERS.join(' → '),
        working: ['<b>Picture:</b> a slice down through the ground, like a layer cake.', `Order down: ${LAYERS.join(' → ')}.`, `Below the ${LAYERS[i]} is the <b>${LAYERS[i + 1]}</b>.`],
        finalAnswer: LAYERS[i + 1], skill: 'soil',
      };
    }
    const items = [
      { q: 'How is soil made?', a: 'Rock is weathered into tiny bits, and dead plants and animals rot into it', wrongs: ['It falls from the sky as dust', 'It is made by worms out of nothing', 'It is washed in from the sea'] },
      { q: 'Which layer of soil is the best for growing plants?', a: 'The topsoil — it has the most humus', wrongs: ['The bedrock', 'The subsoil', 'The weathered rock layer'] },
      { q: 'Why do gardeners dig compost into their soil?', a: 'It adds humus, which holds water and feeds plants', wrongs: ['It makes the soil heavier', 'It kills the worms', 'It stops the soil freezing'] },
      { q: 'Why is losing topsoil off a bare hillside such a problem?', a: 'It takes hundreds of years to replace', wrongs: ['It grows back in a few weeks', 'It makes the hill taller', 'Bedrock grows plants just as well'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: soilSvg(),
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Soil = weathered rock + humus + water + air + living things.',
      working: ['<b>Picture:</b> a slice down through the ground — dark rich topsoil on top, solid bedrock at the bottom.', it.a + '.'],
      finalAnswer: it.a, skill: 'soil',
    };
  }

  function soilNumberQ(level) {
    const style = R.pick(['time', 'depth', 'percent']);
    if (style === 'time') {
      const cm = R.int(2, 9);
      return {
        prompt: `Topsoil forms at about <b>1 cm every 200 years</b>. About how many years would <b>${cm} cm</b> take?`,
        answer: { type: 'number', value: cm * 200, unit: 'years', placeholder: 'e.g. 600' },
        hint: `Multiply 200 by ${cm}.`,
        working: ['<b>Picture:</b> 1 cm of soil = 200 birthdays.', `200 × ${cm} = <b>${cm * 200}</b> years.`, 'That is why washed-away topsoil is such a big loss.'],
        finalAnswer: `${cm * 200} years`, skill: 'soil',
      };
    }
    if (style === 'depth') {
      const yrs = R.pick([400, 600, 800, 1000, 1200]);
      return {
        prompt: `Topsoil forms at about <b>1 cm every 200 years</b>. How many centimetres would form in <b>${yrs} years</b>?`,
        answer: { type: 'number', value: yrs / 200, unit: 'cm', placeholder: 'e.g. 3' },
        hint: `Divide ${yrs} by 200.`,
        working: ['<b>Picture:</b> every 200 years adds one more centimetre.', `${yrs} ÷ 200 = <b>${yrs / 200}</b> cm.`],
        finalAnswer: `${yrs / 200} cm`, skill: 'soil',
      };
    }
    const air = R.pick([20, 25, 30]);
    const water = R.pick([20, 25]);
    const solid = 100 - air - water;
    return {
      prompt: `A soil sample is <b>${air}% air</b> and <b>${water}% water</b>. What percentage is solid (rock bits and humus)?`,
      answer: { type: 'number', value: solid, unit: '%', placeholder: 'e.g. 50' },
      hint: 'The whole sample is 100%. Take the air and water off.',
      working: ['<b>Picture:</b> a jar of soil — some gaps hold air, some hold water, the rest is solid.', `${air} + ${water} = ${air + water}.`, `100 − ${air + water} = <b>${solid}</b>%.`],
      finalAnswer: `${solid}%`, skill: 'soil',
    };
  }

  function vocabQ(level) {
    const items = [
      { q: 'What is melted rock called while it is still underground?', a: 'magma', accept: ['the magma'] },
      { q: 'What is melted rock called once it has come out of a volcano?', a: 'lava', accept: ['the lava'] },
      { q: 'What word means rock being broken up where it sits?', a: 'weathering', accept: ['weather', 'weathered'] },
      { q: 'What word means the broken bits being carried away?', a: 'erosion', accept: ['eroded', 'erode'] },
      { q: 'What is the rotted plant and animal matter in soil called?', a: 'humus', accept: ['humous', 'compost'] },
      { q: 'What do we call the remains of a living thing preserved in sedimentary rock?', a: 'fossil', accept: ['a fossil', 'fossils'] },
      { q: 'What is the top, richest layer of soil called?', a: 'topsoil', accept: ['top soil', 'the topsoil'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one word)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Underground = magma, out in the air = lava. Break = weathering, move = erosion.',
      working: ['Match the word to the picture in your head.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Sedimentary — fossils only survive in gently laid-down layers', ['Igneous — the heat preserved it', 'Metamorphic — the pressure squashed it flat', 'Any of the three types'], 4);
      return {
        visual: textureSvg('sedimentary'),
        prompt: 'Harper splits a rock open at the beach and finds a perfect shell fossil inside. What type of rock is it almost certainly?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Would a fossil survive being melted, or squashed and cooked?',
        working: ['<b>Picture:</b> a shell settling gently into mud, then getting buried.', '1. Would the shell survive melting? No — igneous is out.', '2. Would it survive heat and huge pressure? It would be destroyed — metamorphic is out.', 'So the rock is <b>sedimentary</b>.'],
        finalAnswer: 'Sedimentary — fossils only survive in gently laid-down layers',
      };
    },
    () => {
      const c = choice('Pumice — it is full of gas bubbles, so it is less dense than water', ['It is hollow inside', 'It is made of wood', 'It is warm, so it floats'], 4);
      return {
        prompt: 'Harper finds a pale, holey rock floating on Lake Taupō. What is it, and why does it float?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'It was frothy lava, like the foam on top of a milkshake.',
        working: ['<b>Picture:</b> frothy lava, full of gas bubbles, cooling in mid-air.', '1. What is it? <b>Pumice</b>, an igneous rock.', '2. The trapped bubbles make it very light for its size.', 'Less dense than water → it <b>floats</b>.'],
        finalAnswer: 'Pumice — it is full of gas bubbles, so it is less dense than water',
      };
    },
    () => {
      const c = choice('Slowly, deep underground — slow cooling grows big crystals', ['Very fast, in the air', 'Very fast, under water', 'It never cooled at all'], 4);
      return {
        visual: textureSvg('igneous'),
        prompt: 'Two igneous rocks: one has crystals you can see easily, the other has crystals too small to see. How did the big-crystal one cool?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Crystals need time to grow — like sugar crystals in a jar.',
        working: ['<b>Picture:</b> growing sugar crystals. Left alone for weeks → big crystals. Cooled in a rush → tiny ones.', '1. Big crystals mean lots of time.', '2. Underground, magma is insulated and cools very slowly.', 'So it cooled <b>slowly, deep underground</b> — like granite.'],
        finalAnswer: 'Slowly, deep underground — slow cooling grows big crystals',
      };
    },
    () => {
      const c = choice('Weathering broke it up; erosion carried the pieces down', ['Only erosion', 'Only weathering', 'Deposition did both jobs'], 4);
      return {
        prompt: 'After a frosty winter, chunks of rock lie at the bottom of a bluff, and the stream below is cloudy with grit. Which processes have happened?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'One process broke the rock. A different one moved the bits.',
        working: ['<b>Picture:</b> breaking a biscuit (weathering), then sweeping the crumbs away (erosion).', '1. What split the rock? Frost — freeze–thaw <b>weathering</b>.', '2. What is carrying the grit downstream? The water — <b>erosion</b>.', 'So both, in that order.'],
        finalAnswer: 'Weathering broke it up; erosion carried the pieces down',
      };
    },
    () => {
      const c = choice('Marble — limestone changed by heat and pressure', ['Granite', 'Pumice', 'Coal'], 4);
      return {
        visual: rockCycleSvg('metamorphic'),
        prompt: 'Limestone under Takaka Hill was buried deep and cooked by heat and pressure. What did it turn into?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Sedimentary + heat + pressure = metamorphic. Which metamorphic rock comes from limestone?',
        working: ['<b>Picture:</b> a toasted sandwich — squashed and heated, but never melted.', '1. Limestone is <b>sedimentary</b>.', '2. Heat + pressure turns it <b>metamorphic</b>.', 'Limestone → <b>marble</b>.'],
        finalAnswer: 'Marble — limestone changed by heat and pressure',
      };
    },
    () => {
      const c = choice('Plant trees and grasses so roots hold the soil together', ['Dig the soil over more often', 'Remove the remaining plants', 'Add sand to the hillside'], 4);
      return {
        visual: soilSvg(),
        prompt: 'A farm hillside has lost its trees, and every heavy rain washes more topsoil into the river. What would help most?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What physically holds soil in place on a slope?',
        working: ['<b>Picture:</b> a hairnet holding hair in place — roots do that for soil.', '1. Bare soil has nothing gripping it, so rain washes it off.', '2. Topsoil takes about 200 years per centimetre to replace.', 'So <b>plant trees and grasses</b> — roots bind the soil.'],
        finalAnswer: 'Plant trees and grasses so roots hold the soil together',
      };
    },
    () => {
      const c = choice('The limestone is being dissolved by slightly acidic rain', ['Waves are melting the rock', 'The rock is turning into magma', 'Wind has blown the middle out'], 4);
      return {
        prompt: 'At Punakaiki the limestone has deep grooves and holes worn into its surface, even where waves cannot reach. What is happening?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Rainwater is slightly acidic, and limestone reacts with acid.',
        working: ['<b>Picture:</b> a fizzy drink slowly eating a tooth.', '1. Is the rock being smashed, or dissolved? Dissolved — the surface is smooth and rounded.', 'That is <b>chemical weathering</b> by slightly acidic rain.'],
        finalAnswer: 'The limestone is being dissolved by slightly acidic rain',
      };
    },
    () => {
      const c = choice('Igneous — the crystals are locked together with no layers', ['Sedimentary', 'Metamorphic', 'You cannot tell from crystals'], 4);
      return {
        visual: textureSvg('igneous'),
        prompt: 'Harper looks at a rock through a hand lens. She sees crystals of different colours locked tightly together, and no layers or bands at all. What type is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Layers → sedimentary. Bands → metamorphic. Interlocking crystals → ?',
        working: ['<b>Picture:</b> melted chocolate with nuts in it, set hard.', '1. Any flat layers? No — so not sedimentary.', '2. Any wavy bands? No — so not metamorphic.', 'Interlocking crystals = <b>igneous</b>.'],
        finalAnswer: 'Igneous — the crystals are locked together with no layers',
      };
    },
    () => {
      const c = choice('The bottom layer — sediment is laid down oldest first', ['The top layer', 'The middle layer', 'They are all the same age'], 4);
      return {
        visual: textureSvg('sedimentary'),
        prompt: 'A cliff face shows four flat layers of sandstone stacked on top of each other. Which layer is the oldest?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Think about a pile of washing that has built up over a week.',
        working: ['<b>Picture:</b> a week of washing dumped on a chair — Monday&rsquo;s clothes end up at the bottom.', '1. New sediment always settles <b>on top</b> of the old.', 'So the <b>bottom</b> layer went down first — it is oldest.'],
        finalAnswer: 'The bottom layer — sediment is laid down oldest first',
      };
    },
    () => {
      const c = choice('It could not have been formed by heat and pressure alone — that is metamorphic', ['She is right, it is metamorphic', 'It must be sedimentary', 'Rocks cannot change type at all'], 4);
      return {
        visual: rockCycleSvg('igneous'),
        prompt: 'Harper writes: "Basalt is metamorphic because it came out of a volcano." What is wrong with that sentence?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What makes a rock metamorphic — coming out of a volcano, or being heated and squashed without melting?',
        working: ['<b>Picture:</b> melted chocolate that set hard (igneous) vs a toasted sandwich (metamorphic).', '1. Basalt came from <b>lava that cooled</b> — it was fully melted.', '2. Melted then cooled = <b>igneous</b>.', 'Metamorphic rocks are changed by heat and pressure but never fully melt.'],
        finalAnswer: 'It could not have been formed by heat and pressure alone — that is metamorphic',
      };
    },
    () => {
      const c = choice('The river slowed down and dropped what it was carrying — deposition', ['Weathering built the sandbank', 'Erosion built the sandbank', 'The sand grew there'], 4);
      return {
        prompt: 'Where a fast stream meets the flat land, a wide sandbank has built up. What has happened there?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Fast water carries a lot. Slow water carries very little.',
        working: ['<b>Picture:</b> carrying an armful of books, then getting tired and putting them down.', '1. Fast water can carry sand and pebbles.', '2. On flat land it slows down, so it can no longer hold them.', 'It drops them: that is <b>deposition</b>.'],
        finalAnswer: 'The river slowed down and dropped what it was carrying — deposition',
      };
    },
  ];

  HL.registerTopic({
    id: 'rocks-soil', subject: 'science', strand: 'earth', order: 3,
    name: 'Rocks & Soil', short: 'Rocks & soil', animal: 'crab',
    blurb: 'Three kinds of rock, the cycle that turns one into another, and how soil is made.',
    example: 'igneous = cooled magma · sedimentary = squashed layers · metamorphic = heated + squashed',
    learn: {
      what: '<p>Every rock on Earth belongs to one of <b>three families</b>. <b>Igneous</b> rock is melted rock that cooled and set. <b>Sedimentary</b> rock is layers of bits squashed together. <b>Metamorphic</b> rock is any rock changed by heat and pressure without melting. Rocks slowly turn into one another — that is the <b>rock cycle</b>. When rock is broken down and mixed with rotted plants, you get <b>soil</b>.</p><p><b>Picture for this topic:</b> a <b>sandwich</b>. Melted cheese that set again = igneous. A layered sandwich squashed in your bag = sedimentary. A toasted sandwich — squashed and heated but not melted = metamorphic.</p>',
      visual: rockCycleSvg(),
      facts: [
        '<b>Igneous</b>: magma or lava cooled and set. Slow cooling → big crystals (granite); fast → tiny crystals or glass (basalt, obsidian, pumice)',
        '<b>Sedimentary</b>: bits settle in <b>layers</b>, get buried and cemented. Only these hold <b>fossils</b> (limestone, sandstone, greywacke, coal)',
        '<b>Metamorphic</b>: heat + pressure, <b>no melting</b>. Limestone → <b>marble</b>; mudstone → <b>schist</b>; NZ <b>pounamu</b> formed near the Alpine Fault',
        '<b>Rock cycle</b>: magma —cools→ igneous —worn down & buried→ sedimentary —heat & pressure→ metamorphic —melts→ magma',
        '<b>Weathering</b> = broken up where it is · <b>Erosion</b> = carried away · <b>Deposition</b> = dropped somewhere new',
        '<b>Soil</b> = weathered rock bits + <b>humus</b> (rotted plants) + water + air + living things. 1 cm of topsoil takes about <b>200 years</b>',
      ],
      steps: [
        'To name a rock family, ask "<b>was it melted, layered, or cooked-and-squashed?</b>" Melted and set → igneous. Layers → sedimentary. Bands, no melting → metamorphic.',
        'To read a rock sample: <b>flat layers or fossils</b> = sedimentary; <b>interlocking crystals, no layers</b> = igneous; <b>wavy shiny bands</b> = metamorphic.',
        'For crystal size in igneous rock: "<b>slow = big, fast = small</b>". Crystals need time to grow.',
        'Weathering or erosion? Ask "<b>did the rock stay put or get carried away?</b>" Stayed = weathering. Moved = erosion. Dropped again = deposition.',
        'For soil, list the five ingredients: <b>rock bits, humus, water, air, living things</b> — and remember it is very slow to replace.',
      ],
      examples: [
        { q: 'What type of rock is limestone, and how did it form?',
          working: ['<b>Picture:</b> a squashed layered sandwich.', '1. Was it melted? No.', '2. Is it in layers? Yes — shells and skeletons that settled on the sea floor.', '3. Buried, squashed and cemented together.', 'So limestone is <b>sedimentary</b> — like the Pancake Rocks at Punakaiki.'],
          a: 'Sedimentary — sea shells settled, then were buried and squashed' },
        { q: 'Look at this rock sample. Which family is it from?',
          visual: textureSvg('metamorphic'),
          working: ['<b>Picture:</b> a toasted sandwich — squashed and heated, but not melted.', '1. Flat layers? No — the bands are wavy and squashed.', '2. Interlocking crystals with no pattern? No.', 'Wavy bands = <b>metamorphic</b>, like Central Otago schist.'],
          a: 'Metamorphic' },
        { q: 'Granite has crystals you can see; basalt&rsquo;s are too small to see. Why?',
          working: ['<b>Picture:</b> growing sugar crystals — weeks in a jar make big ones, a quick freeze makes tiny ones.', '1. Granite cooled <b>slowly</b>, deep underground → lots of time → big crystals.', '2. Basalt cooled <b>fast</b> as lava on the surface → no time → tiny crystals.', 'Slow = big, fast = small.'],
          a: 'Granite cooled slowly underground; basalt cooled quickly at the surface' },
        { q: 'Draw the rock cycle: how does a sedimentary rock become an igneous rock?',
          visual: rockCycleSvg('igneous'),
          working: ['<b>Picture:</b> the rock cycle wheel — you can get anywhere if you go round far enough.', '1. Sedimentary is buried and cooked → <b>metamorphic</b>.', '2. Buried deeper and hotter still → it <b>melts</b> into magma.', '3. The magma cools and sets → <b>igneous</b>.'],
          a: 'Sedimentary → metamorphic → melts to magma → cools into igneous' },
        { q: 'Ice freezes in a crack in a rock at Aoraki and the rock splits. Then the stream carries the pieces downhill. Name each process.',
          visual: freezeThawSvg(),
          working: ['<b>Picture:</b> breaking a biscuit on the bench, then sweeping the crumbs away.', '1. Did the ice break the rock where it sat? Yes → <b>freeze–thaw weathering</b>.', '2. Did the stream move the pieces? Yes → <b>erosion</b>.', '3. When the stream slows and drops them → <b>deposition</b>.'],
          a: 'Weathering (freeze–thaw), then erosion' },
        { q: 'What is soil made of, and why is losing topsoil so serious?',
          visual: soilSvg(),
          working: ['<b>Picture:</b> a recipe with five ingredients.', '1. Weathered <b>rock bits</b> + <b>humus</b> (rotted plants) + <b>water</b> + <b>air</b> + <b>living things</b>.', '2. How fast does topsoil form? About 1 cm every 200 years.', '3. So 5 cm washed off a bare hillside = about 1000 years to replace.'],
          a: 'Rock bits, humus, water, air and living things — and it takes centuries to replace' },
        { q: 'A cliff shows four flat layers. Which layer is oldest, and could you find a fossil in it?',
          visual: textureSvg('sedimentary'),
          working: ['<b>Picture:</b> a week of washing piled on a chair — Monday is at the bottom.', '1. New sediment lands on top, so the <b>bottom</b> layer is oldest.', '2. Flat layers means <b>sedimentary</b> rock.', '3. Fossils only survive in sedimentary rock — so yes, you might.'],
          a: 'The bottom layer is oldest, and yes — it is sedimentary, so fossils are possible' },
      ],
      tips: [
        'Coming out of a volcano makes a rock <b>igneous</b>, not metamorphic — metamorphic rock is cooked and squashed but never fully melted.',
        'Fossils are only ever found in <b>sedimentary</b> rock. Melting or extreme pressure destroys them.',
        '<b>Weathering</b> and <b>erosion</b> are not the same word: break it up, then carry it away.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [rockTypeQ, typeDefQ, weatherErodeQ, vocabQ, soilQ, nzExampleQ]
        : level === 2
          ? [rockTypeQ, rockFormQ, typeDefQ, textureQ, nzExampleQ, rockCycleQ, weatherErodeQ, weatheringTypeQ, soilQ, vocabQ]
          : [rockFormQ, textureQ, rockCycleQ, weatheringTypeQ, weatherErodeQ, soilQ, soilNumberQ, nzExampleQ, rockTypeQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
