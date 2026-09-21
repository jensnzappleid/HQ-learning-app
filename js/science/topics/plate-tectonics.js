/* Topic: Plate Tectonics — Earth's layers, plates, faults, earthquakes, volcanoes and tsunami in Aotearoa. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const LAYERS = [
    { n: 'crust', what: 'the thin rocky skin we live on — only 5–70 km thick', pic: 'the skin of an apple', state: 'solid rock' },
    { n: 'mantle', what: 'the thick layer of hot, slowly flowing rock beneath the crust', pic: 'warm toffee that oozes very slowly', state: 'hot rock that can flow' },
    { n: 'outer core', what: 'a layer of liquid metal — mostly iron and nickel', pic: 'melted metal', state: 'liquid metal' },
    { n: 'inner core', what: 'a solid ball of metal at the very centre, about 5500 °C', pic: 'a solid metal ball squashed by everything above it', state: 'solid metal' },
  ];
  const LAYER_ORDER = ['crust', 'mantle', 'outer core', 'inner core'];

  const BOUNDARIES = [
    { key: 'push', name: 'plates pushing together (convergent)', makes: 'mountains, deep ocean trenches, volcanoes and big earthquakes', nz: 'off the east coast of the North Island, where the Pacific Plate dives under', pic: 'two cars crashing head-on and crumpling' },
    { key: 'pull', name: 'plates pulling apart (divergent)', makes: 'new rock rising into the gap, rift valleys and undersea ridges', nz: 'the Taupō Volcanic Zone, where the crust is being stretched', pic: 'pulling a jam sandwich apart so the jam wells up' },
    { key: 'slide', name: 'plates sliding past each other (transform)', makes: 'earthquakes along a fault line, but no volcanoes', nz: 'the Alpine Fault down the South Island', pic: 'two hands sliding past each other, sticking then jerking' },
  ];

  const VOLCANOES = [
    { n: 'Ruapehu', what: 'an active cone volcano in Tongariro National Park that throws out ash and sends lahars down its slopes' },
    { n: 'Taupō', what: 'a huge caldera — a supervolcano crater that collapsed and filled with water to make the lake' },
    { n: 'Rotorua', what: 'geysers, boiling mud and hot pools, heated by hot rock not far under the ground' },
    { n: 'Whakaari / White Island', what: 'an active island volcano off the Bay of Plenty that steams all the time' },
    { n: 'Taranaki maunga', what: 'a big, almost perfectly shaped cone volcano that has not erupted since the 1700s' },
    { n: 'the Auckland volcanic field', what: 'about 50 small cones, like Rangitoto and Maungawhau, made by a hot spot under the city' },
  ];

  const QUAKE_WORDS = [
    { n: 'focus', what: 'the exact point <b>underground</b> where the rock breaks and the earthquake starts' },
    { n: 'epicentre', what: 'the point on the <b>surface</b> directly above the focus — usually the worst shaking' },
    { n: 'fault', what: 'a crack in the crust where two blocks of rock can slip past each other' },
    { n: 'magnitude', what: 'a number that says how much energy the earthquake released' },
    { n: 'aftershock', what: 'a smaller quake that follows the main one as the rock settles' },
    { n: 'tsunami', what: 'a huge sea wave set off when the sea floor suddenly moves' },
  ];

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- diagrams ---------- */
  function layersSvg(hide) {
    const cx = 88, cy = 100;
    const rows = [
      { n: 'crust', sub: 'thin + rocky', y: 28, from: [134, 39] },
      { n: 'mantle', sub: 'hot squishy rock', y: 72, from: [134, 74] },
      { n: 'outer core', sub: 'liquid metal', y: 116, from: [110, 116] },
      { n: 'inner core', sub: 'solid metal', y: 160, from: [88, 100] },
    ];
    let s = `<svg viewBox="0 0 336 194" width="336" height="194" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="336" height="194" fill="#FFFFFF"/>
      <circle cx="${cx}" cy="${cy}" r="76" fill="#E9A07A" stroke="#6FA04C" stroke-width="5"/>
      <circle cx="${cx}" cy="${cy}" r="42" fill="#E8C24A" stroke="#C98A1C" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="18" fill="#E0568C" stroke="#B03A6C" stroke-width="1.5"/>`;
    rows.forEach((r, i) => {
      const hidden = hide === i;
      s += `<line x1="${r.from[0]}" y1="${r.from[1]}" x2="166" y2="${r.y - 4}" stroke="#8A7B63" stroke-width="1.5"/>`;
      s += `<circle cx="${r.from[0]}" cy="${r.from[1]}" r="3.5" fill="#4A4033"/>`;
      s += `<text x="172" y="${r.y}" fill="${hidden ? '#E0568C' : '#4A4033'}" font-size="12.5">${hidden ? '? ? ?' : r.n}</text>`;
      s += `<text x="172" y="${r.y + 15}" fill="#8A7B63" font-size="11.5">${r.sub}</text>`;
    });
    return s + '</svg>';
  }

  function boundarySvg(key) {
    const ground = '#C08A5A', deep = '#E9A07A';
    const arrow = (x, y, dir, colour) => `<line x1="${x}" y1="${y}" x2="${x + 24 * dir}" y2="${y}" stroke="${colour}" stroke-width="3"/><polygon points="${x + 32 * dir},${y} ${x + 22 * dir},${y - 5} ${x + 22 * dir},${y + 5}" fill="${colour}"/>`;
    let body, cap;
    if (key === 'push') {
      body = `<polygon points="150,80 320,80 320,146 238,146" fill="${ground}" stroke="#8A7B63" stroke-width="1.5"/>
        <polygon points="0,80 150,80 250,160 250,182 150,102 0,102" fill="#B7B0A4" stroke="#8A7B63" stroke-width="1.5"/>
        <polygon points="280,56 264,80 296,80" fill="#E0568C"/>
        <text x="280" y="48" text-anchor="middle" fill="#E0568C" font-size="11.5">volcano</text>
        <text x="128" y="72" text-anchor="middle" fill="#5F98C4" font-size="11.5">trench</text>
        ${arrow(40, 91, 1, '#4A4033')}${arrow(306, 118, -1, '#4A4033')}
        <text x="112" y="38" text-anchor="middle" fill="#5F98C4" font-size="11.5">one plate dives under and melts</text>`;
      cap = 'pushing together → volcanoes + mountains';
    } else if (key === 'pull') {
      body = `<rect x="0" y="80" width="132" height="76" fill="${ground}" stroke="#8A7B63" stroke-width="1.5"/>
        <rect x="188" y="80" width="132" height="76" fill="${ground}" stroke="#8A7B63" stroke-width="1.5"/>
        <polygon points="132,80 188,80 176,182 144,182" fill="#E0568C"/>
        <text x="160" y="72" text-anchor="middle" fill="#E0568C" font-size="11.5">magma rises</text>
        ${arrow(66, 116, -1, '#4A4033')}${arrow(254, 116, 1, '#4A4033')}`;
      cap = 'pulling apart → new rock fills the gap';
    } else {
      body = `<rect x="0" y="80" width="156" height="76" fill="${ground}" stroke="#8A7B63" stroke-width="1.5"/>
        <rect x="164" y="80" width="156" height="76" fill="${ground}" stroke="#8A7B63" stroke-width="1.5"/>
        <line x1="160" y1="74" x2="160" y2="160" stroke="#E0568C" stroke-width="4"/>
        <text x="160" y="68" text-anchor="middle" fill="#E0568C" font-size="11.5">fault</text>
        ${arrow(56, 112, 1, '#4A4033')}${arrow(264, 112, -1, '#4A4033')}
        <text x="66" y="140" text-anchor="middle" fill="#4A4033" font-size="11">this way</text>
        <text x="254" y="140" text-anchor="middle" fill="#4A4033" font-size="11">that way</text>`;
      cap = 'sliding past → earthquakes, no volcano';
    }
    return `<svg viewBox="0 0 320 204" width="320" height="204" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="320" height="204" fill="#FFFFFF"/>
      <rect x="0" y="20" width="320" height="60" fill="#DCEEF9"/>
      <rect x="0" y="80" width="320" height="104" fill="${deep}"/>
      ${body}
      <text x="160" y="198" text-anchor="middle" fill="#4A4033" font-size="12">${cap}</text>
    </svg>`;
  }

  function quakeSvg() {
    return `<svg viewBox="0 0 330 192" width="330" height="192" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="330" height="192" fill="#FFFFFF"/>
      <clipPath id="grd"><rect x="0" y="52" width="330" height="112"/></clipPath>
      <rect x="0" y="52" width="330" height="112" fill="#C08A5A"/>
      <rect x="0" y="46" width="330" height="8" fill="#6FA04C"/>
      <g clip-path="url(#grd)">${[28, 48, 68].map((r) => `<circle cx="150" cy="122" r="${r}" fill="none" stroke="#E8C24A" stroke-width="2.5"/>`).join('')}</g>
      <polygon points="150,114 155,124 166,125 158,133 160,144 150,138 140,144 142,133 134,125 145,124" fill="#E0568C"/>
      <circle cx="150" cy="50" r="6" fill="#E0568C" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="150" y1="114" x2="150" y2="56" stroke="#4A4033" stroke-width="1.5" stroke-dasharray="4 3"/>
      <text x="200" y="32" fill="#E0568C" font-size="12">epicentre (on top)</text>
      <line x1="196" y1="28" x2="158" y2="45" stroke="#8A7B63" stroke-width="1.5"/>
      <line x1="220" y1="124" x2="166" y2="126" stroke="#4A4033" stroke-width="1.5"/>
      <rect x="222" y="110" width="102" height="36" rx="6" fill="#FFFFFF" opacity=".92"/>
      <text x="228" y="124" fill="#E0568C" font-size="12">focus</text>
      <text x="228" y="139" fill="#E0568C" font-size="12">(underground)</text>
      <text x="12" y="184" fill="#8A7B63" font-size="11.5">shaking spreads out from the focus</text>
    </svg>`;
  }

  function nzPlatesSvg() {
    return `<svg viewBox="0 0 340 210" width="340" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="210" fill="#DCEEF9"/>
      <path d="M 232 24 L 254 44 L 262 72 L 246 92 L 238 114 L 216 122 L 204 104 L 214 82 L 206 58 L 218 32 Z" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
      <path d="M 200 126 L 216 134 L 194 172 L 160 196 L 138 190 L 148 168 L 176 142 Z" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
      <path d="M 206 128 L 146 186" stroke="#E0568C" stroke-width="3.5"/>
      <text x="60" y="150" fill="#E0568C" font-size="12">Alpine Fault</text>
      <line x1="142" y1="146" x2="170" y2="158" stroke="#E0568C" stroke-width="1.5"/>
      <text x="14" y="40" fill="#4A4033" font-size="12.5">Australian</text>
      <text x="14" y="56" fill="#4A4033" font-size="12.5">Plate</text>
      <text x="248" y="176" fill="#4A4033" font-size="12.5">Pacific</text>
      <text x="248" y="192" fill="#4A4033" font-size="12.5">Plate</text>
      <line x1="96" y1="80" x2="140" y2="104" stroke="#4A4033" stroke-width="3"/>
      <polygon points="148,109 134,106 140,96" fill="#4A4033"/>
      <line x1="292" y1="128" x2="250" y2="106" stroke="#4A4033" stroke-width="3"/>
      <polygon points="242,101 256,104 250,114" fill="#4A4033"/>
      <text x="170" y="18" text-anchor="middle" fill="#4A4033" font-size="12">Aotearoa sits ON the plate boundary</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function layerOrderQ(level) {
    const i = R.int(0, LAYER_ORDER.length - 2);
    const inward = R.chance(0.7);
    const ans = inward ? LAYER_ORDER[i + 1] : LAYER_ORDER[i];
    const from = inward ? LAYER_ORDER[i] : LAYER_ORDER[i + 1];
    const c = choice(ans, LAYER_ORDER, 4);
    return {
      visual: layersSvg(),
      prompt: `Travelling ${inward ? 'down towards the centre of the Earth' : 'back up towards the surface'}, which layer comes straight after the <b>${from}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'From the outside in: crust → mantle → outer core → inner core.',
      working: ['<b>Picture:</b> a boiled egg — thin shell (crust), thick white (mantle), yolk (the core).', `Order inwards: ${LAYER_ORDER.join(' → ')}.`, `So the answer is the <b>${ans}</b>.`],
      finalAnswer: ans, skill: 'layers',
    };
  }

  function layerFactQ(level) {
    const l = R.pick(LAYERS);
    const style = R.pick(['what', 'name', 'state']);
    if (style === 'what') {
      const c = choice(l.what, LAYERS.map((x) => x.what), 4);
      return {
        visual: R.chance(0.5) ? layersSvg(LAYER_ORDER.indexOf(l.n)) : undefined,
        prompt: `What is the <b>${l.n}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Think of ${l.pic}.`,
        working: [`<b>Picture:</b> ${l.pic}.`, `The ${l.n} is <b>${l.what}</b>.`],
        finalAnswer: l.what, skill: 'layers',
      };
    }
    if (style === 'name') {
      const c = choice(l.n, LAYER_ORDER, 4);
      return {
        visual: layersSvg(LAYER_ORDER.indexOf(l.n)),
        prompt: `Which layer of the Earth is <b>${l.what}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Think of ${l.pic}.`,
        working: ['<b>Picture:</b> a boiled egg cut in half — shell, white, yolk.', `That is the <b>${l.n}</b>.`],
        finalAnswer: l.n, skill: 'layers',
      };
    }
    const c = choice(l.state, LAYERS.map((x) => x.state), 4);
    return {
      prompt: `Is the <b>${l.n}</b> solid, liquid, or something in between?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Only the outer core is truly liquid. The mantle is solid rock that can creep very slowly.',
      working: [`<b>Picture:</b> ${l.pic}.`, `The ${l.n} is <b>${l.state}</b>.`],
      finalAnswer: l.state, skill: 'layers',
    };
  }

  function plateBasicsQ(level) {
    const items = [
      { q: 'What are tectonic plates?', a: 'Huge slabs of the Earth&rsquo;s crust that slowly move about', wrongs: ['Layers of soil on top of the rock', 'Sheets of ice floating on the sea', 'Pools of magma inside a volcano'],
        w: ['<b>Picture:</b> a cracked eggshell — the pieces still fit, but they can shift.', 'The crust is broken into <b>plates</b> that slide on the squishy mantle below.'] },
      { q: 'What makes the plates move?', a: 'Slow currents of hot rock circling in the mantle', wrongs: ['The Earth spinning', 'Waves in the ocean pushing them', 'Earthquakes pushing them apart'],
        w: ['<b>Picture:</b> a pot of thick soup on the stove — hot soup rises, cools, sinks, and drags the skin on top with it.', 'Hot rock rises, cool rock sinks: <b>convection currents</b> drag the plates along.'] },
      { q: 'How fast do tectonic plates usually move?', a: 'A few centimetres a year — about as fast as your fingernails grow', wrongs: ['A few metres a day', 'Hundreds of kilometres a year', 'They do not move at all'],
        w: ['<b>Picture:</b> fingernails growing — you never see it happen, but it adds up.', 'A few <b>cm each year</b> is enough to build mountains over millions of years.'] },
      { q: 'Where do most earthquakes and volcanoes happen?', a: 'Along the edges of tectonic plates', wrongs: ['Right in the middle of plates', 'Only under the ocean', 'Randomly, all over the world'],
        w: ['<b>Picture:</b> a cracked eggshell — the movement happens at the cracks.', 'The edges are where plates grind, so that is where the <b>action</b> is.'] },
      { q: 'Why does the crust "float" on the mantle?', a: 'The mantle is hot rock that can slowly flow', wrongs: ['The mantle is completely liquid', 'The crust is filled with air', 'There is water between them'],
        w: ['<b>Picture:</b> a biscuit resting on very thick warm toffee.', 'The mantle is solid, but hot enough to <b>creep</b> — so the plates can ride on it.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The crust is a cracked shell riding on slowly circling hot rock.',
      working: it.w, finalAnswer: it.a, skill: 'plates',
    };
  }

  function boundaryQ(level) {
    const b = R.pick(BOUNDARIES);
    const style = R.pick(['id', 'makes', 'nz']);
    if (style === 'id') {
      const c = choice(b.name, BOUNDARIES.map((x) => x.name), 3);
      return {
        visual: boundarySvg(b.key),
        prompt: 'What kind of plate boundary is this diagram showing?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Follow the arrows: towards each other, away from each other, or sliding past?',
        working: [`<b>Picture:</b> ${b.pic}.`, `The arrows show <b>${b.name}</b>.`, `That makes ${b.makes}.`],
        finalAnswer: b.name, skill: 'boundaries',
      };
    }
    if (style === 'makes') {
      const c = choice(b.makes, BOUNDARIES.map((x) => x.makes), 3);
      return {
        visual: R.chance(0.5) ? boundarySvg(b.key) : undefined,
        prompt: `What do you get where <b>${b.name.replace(/ \(.*\)/, '')}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Picture ${b.pic}.`,
        working: [`<b>Picture:</b> ${b.pic}.`, `You get <b>${b.makes}</b>.`],
        finalAnswer: b.makes, skill: 'boundaries',
      };
    }
    const c = choice(b.name, BOUNDARIES.map((x) => x.name), 3);
    return {
      prompt: `<b>${b.nz.charAt(0).toUpperCase() + b.nz.slice(1)}</b> — what kind of plate movement is that?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `It makes ${b.makes}.`,
      working: [`<b>Picture:</b> ${b.pic}.`, `${b.nz.charAt(0).toUpperCase() + b.nz.slice(1)} is <b>${b.name}</b>.`],
      finalAnswer: b.name, skill: 'boundaries',
    };
  }

  function nzPlateQ(level) {
    const items = [
      { q: 'Which two tectonic plates meet under Aotearoa New Zealand?', a: 'The Pacific Plate and the Australian Plate', wrongs: ['The Pacific Plate and the African Plate', 'The Australian Plate and the Antarctic Plate', 'The Indian Plate and the Eurasian Plate'],
        w: ['<b>Picture:</b> New Zealand sitting right on the join between two giant slabs.', 'It is the <b>Pacific Plate</b> and the <b>Australian Plate</b>.', 'That is why we get so many earthquakes and volcanoes.'] },
      { q: 'What is the Alpine Fault?', a: 'The huge crack down the South Island where the two plates slide past each other', wrongs: ['A chain of volcanoes in the North Island', 'A deep trench in the Pacific Ocean', 'A crack in the Earth&rsquo;s mantle'],
        w: ['<b>Picture:</b> two hands pressed together, sliding past each other in jerks.', 'The <b>Alpine Fault</b> runs about 600 km down the western side of the South Island.'] },
      { q: 'Why does New Zealand get so many earthquakes?', a: 'It sits right on the boundary of two plates', wrongs: ['It is a long thin country', 'It is surrounded by sea', 'It is far from the equator'],
        w: ['<b>Picture:</b> living right on the crack of a cracked eggshell.', 'Plate edges are where rock grinds, sticks and suddenly slips.', 'That is why we are part of the <b>Pacific Ring of Fire</b>.'] },
      { q: 'How were the Southern Alps made?', a: 'Two plates pushing together crumpled the crust upwards', wrongs: ['Volcanoes built them up out of lava', 'Glaciers piled up the rock', 'The sea floor dried out and rose'],
        w: ['<b>Picture:</b> pushing a rug from both ends — it buckles up into ridges.', 'The Pacific and Australian plates <b>push together</b> along the Alpine Fault.', 'The crust crumples upwards — and they are still growing.'] },
      { q: 'The Alpine Fault moves about 3 cm a year. What does that tell you about the plates?', a: 'They move slowly but never stop', wrongs: ['They only move during earthquakes', 'They move a few metres each day', 'They have stopped moving now'],
        w: ['<b>Picture:</b> fingernails growing — slow, but it never stops.', '3 cm a year adds up to 30 m in 1000 years.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: nzPlatesSvg(),
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Aotearoa sits right on the join between the Pacific and Australian plates.',
      working: it.w, finalAnswer: it.a, skill: 'nz-plates',
    };
  }

  function quakeWordQ(level) {
    const w = R.pick(QUAKE_WORDS);
    if (R.chance(0.5)) {
      const c = choice(w.what, QUAKE_WORDS.map((x) => x.what), 4);
      return {
        visual: /focus|epicentre/.test(w.n) ? quakeSvg() : undefined,
        prompt: `In an earthquake, what is the <b>${w.n}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Focus = underground where it starts. Epicentre = the spot on the surface right above it.',
        working: ['<b>Picture:</b> a stone dropped in a pond. The focus is where it lands; the ripples spread out from there.', `The ${w.n} is ${w.what}.`],
        finalAnswer: w.what, skill: 'earthquakes',
      };
    }
    const c = choice(w.n, QUAKE_WORDS.map((x) => x.n), 4);
    return {
      visual: /focus|epicentre/.test(w.n) ? quakeSvg() : undefined,
      prompt: `Which word means "${w.what.replace(/<\/?b>/g, '')}"?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Focus is deep down; the epicentre is directly above it on the surface.',
      working: ['<b>Picture:</b> a stone dropped in a pond — the splash point and the ripples.', `That word is <b>${w.n}</b>.`],
      finalAnswer: w.n, skill: 'earthquakes',
    };
  }

  function safetyQ(level) {
    const items = [
      { q: 'The ground starts shaking hard while Harper is in the classroom. What should she do?', a: 'Drop, cover and hold — get under a desk and hold on', wrongs: ['Run outside straight away', 'Stand in the middle of the room', 'Stand under the doorway and wait'],
        w: ['<b>Picture:</b> things falling off shelves — you need something over your head.', '1. <b>Drop</b> to your hands and knees.', '2. <b>Cover</b> your head and neck — get under a table if you can.', '3. <b>Hold</b> on until the shaking stops.'] },
      { q: 'Why is running outside during the shaking a bad idea?', a: 'Things can fall on you — glass, bricks and signs', wrongs: ['You might get lost', 'Outside shakes more than inside', 'The ground opens up outside'],
        w: ['<b>Picture:</b> a shower of broken glass and roof tiles along the footpath.', 'Most injuries come from <b>falling objects</b>, so stay covered until the shaking stops.'] },
      { q: 'Harper is at the beach when a strong earthquake makes it hard to stand. What is the tsunami rule?', a: 'Long or strong, get gone — move inland or uphill straight away', wrongs: ['Wait for an official warning', 'Watch the sea to see if a wave comes', 'Go down to the water to look'],
        w: ['<b>Picture:</b> the sea suddenly sucking backwards, then coming back much bigger.', '1. A tsunami can arrive in <b>minutes</b> — too fast for a warning.', '2. The rule in Aotearoa: <b>Long or Strong, Get Gone</b>.', 'Head inland or to high ground and stay there.'] },
      { q: 'What is the safest thing to do after the shaking stops?', a: 'Check for injuries, then move away from anything that could still fall', wrongs: ['Go straight back inside to collect your things', 'Light a candle to see', 'Stand next to the building'],
        w: ['<b>Picture:</b> a wobbly stack of blocks — aftershocks can knock down what the first quake weakened.', 'Expect <b>aftershocks</b>, so keep clear of damaged walls and chimneys.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Drop, Cover, Hold. At the beach: Long or Strong, Get Gone.',
      working: it.w, finalAnswer: it.a, skill: 'safety',
    };
  }

  function volcanoQ(level) {
    const v = R.pick(VOLCANOES);
    if (R.chance(0.5)) {
      const c = choice(v.what, VOLCANOES.map((x) => x.what), 4);
      return {
        prompt: `What is <b>${v.n}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'All of these are in the North Island, where the Pacific Plate is diving under.',
        working: ['<b>Picture:</b> a map of the North Island dotted with volcanoes.', `${v.n} is <b>${v.what}</b>.`],
        finalAnswer: v.what, skill: 'volcanoes',
      };
    }
    const c = choice(v.n, VOLCANOES.map((x) => x.n), 4);
    return {
      prompt: `Which New Zealand place is <b>${v.what}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Think about where in the North Island it is.',
      working: ['<b>Picture:</b> a map of the North Island dotted with volcanoes.', `That is <b>${v.n}</b>.`],
      finalAnswer: v.n, skill: 'volcanoes',
    };
  }

  function volcanoWhyQ(level) {
    const items = [
      { q: 'Why does Aotearoa have so many volcanoes in the North Island?', a: 'The Pacific Plate is diving under, melting and feeding magma upwards', wrongs: ['The North Island is hotter than the South Island', 'The crust there is thicker', 'There is more rain there'],
        w: ['<b>Picture:</b> one slab sliding under another and melting as it goes deeper.', '1. Where the plates <b>push together</b>, one dives beneath the other.', '2. It melts, and the magma is squeezed up through the cracks.', 'That builds the volcanoes of the Taupō Volcanic Zone.'] },
      { q: 'Why does Rotorua have geysers, hot pools and steam?', a: 'Hot rock close to the surface heats the groundwater', wrongs: ['The sun heats the pools', 'Chemicals in the water make heat', 'The pools sit on top of a lava lake'],
        w: ['<b>Picture:</b> a kettle sitting on a hot element under the ground.', 'Hot rock is <b>close to the surface</b> there, so the water underground boils and bursts out.'] },
      { q: 'What is a lahar?', a: 'A fast flood of mud, ash and water rushing down a volcano', wrongs: ['A cloud of ash in the sky', 'A river of red-hot lava', 'A kind of earthquake'],
        w: ['<b>Picture:</b> a river of wet concrete pouring down the mountain.', 'Ruapehu&rsquo;s crater lake can burst out and mix with ash → a <b>lahar</b>.'] },
      { q: 'Why is a big ash cloud a problem even for people far away?', a: 'Ash blocks roads and airports and is dangerous to breathe', wrongs: ['Ash is red hot for weeks', 'Ash makes earthquakes happen', 'Ash melts metal'],
        w: ['<b>Picture:</b> fine, sharp grit blown for hundreds of kilometres.', 'Ash grounds planes, blocks gutters, spoils water and <b>hurts your lungs</b>.'] },
      { q: 'What is magma called once it reaches the surface?', a: 'Lava', wrongs: ['Ash', 'Pumice', 'Basalt'], w: ['Underground → <b>magma</b>. Out in the air → <b>lava</b>.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Volcanoes form where plates push together and rock melts.',
      working: it.w, finalAnswer: it.a, skill: 'volcanoes',
    };
  }

  function tsunamiQ(level) {
    const items = [
      { q: 'What usually sets off a tsunami?', a: 'The sea floor suddenly moving in an undersea earthquake', wrongs: ['A very strong wind', 'A big high tide', 'Heavy rain over the sea'],
        w: ['<b>Picture:</b> slapping the bottom of a full bath — the whole body of water lurches.', 'A sudden shift of the <b>sea floor</b> pushes the whole depth of water.'] },
      { q: 'Out in deep ocean a tsunami is barely noticeable. Why is it so dangerous at the coast?', a: 'In shallow water it slows down and piles up into a huge wall of water', wrongs: ['It speeds up near the shore', 'It picks up extra water from rivers', 'The wind makes it bigger'],
        w: ['<b>Picture:</b> a long low wave running out of room and stacking up.', '1. Deep water: fast, but only a small hump.', '2. Shallow water: it slows down, so the water behind piles in.', 'It arrives as a fast, deep <b>surge</b>, not a surfing wave.'] },
      { q: 'The sea suddenly drains far out, showing rocks that are normally underwater. What should you do?', a: 'Get inland or uphill immediately — that is a tsunami warning sign', wrongs: ['Go and look at the rocks', 'Wait to see what happens', 'Take photos from the beach'],
        w: ['<b>Picture:</b> the sea taking a huge breath in before it comes back.', 'A sudden drop in sea level is a <b>natural warning</b>.', 'Move inland or uphill straight away.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'A tsunami is the whole depth of the sea moving, not just the surface.',
      working: it.w, finalAnswer: it.a, skill: 'tsunami',
    };
  }

  function faultNumberQ(level) {
    const style = R.pick(['years', 'distance', 'magnitude', 'depth']);
    if (style === 'years') {
      const rate = R.pick([2, 3, 4, 5]);
      const yrs = R.pick([10, 20, 50, 100]);
      return {
        prompt: `A fault slips about <b>${rate} cm every year</b>. How far will it have moved in <b>${yrs} years</b>?`,
        answer: { type: 'number', value: rate * yrs, unit: 'cm', placeholder: 'e.g. 150' },
        hint: `Multiply ${rate} by ${yrs}.`,
        working: ['<b>Picture:</b> fingernails growing — a tiny bit each year, but it adds up.', `${rate} × ${yrs} = <b>${rate * yrs}</b> cm.`],
        finalAnswer: `${rate * yrs} cm`, skill: 'plates',
      };
    }
    if (style === 'distance') {
      const rate = R.pick([2, 4, 5]);
      const total = rate * R.pick([20, 25, 50]);
      return {
        prompt: `A plate moves <b>${rate} cm a year</b>. How many years does it take to move <b>${total} cm</b>?`,
        answer: { type: 'number', value: total / rate, unit: 'years', placeholder: 'e.g. 25' },
        hint: `Divide ${total} by ${rate}.`,
        working: ['<b>Picture:</b> counting how many years of fingernail growth make that length.', `${total} ÷ ${rate} = <b>${total / rate}</b> years.`],
        finalAnswer: `${total / rate} years`, skill: 'plates',
      };
    }
    if (style === 'magnitude') {
      const m = R.int(3, 6);
      const steps = R.int(1, 2);
      const factor = Math.pow(10, steps);
      return {
        prompt: `Each whole step up the magnitude scale means the ground shakes <b>10 times more</b>. How many times more shaking is a magnitude <b>${m + steps}</b> quake than a magnitude <b>${m}</b>?`,
        answer: { type: 'number', value: factor, unit: '× more', placeholder: 'e.g. 10' },
        hint: steps === 1 ? 'One step up = ×10.' : 'Two steps up = 10 × 10.',
        working: ['<b>Picture:</b> each step on the scale is a whole new size of shake, not a little bit more.', steps === 1 ? `One step: <b>10</b> times more.` : `Two steps: 10 × 10 = <b>100</b> times more.`],
        finalAnswer: `${factor} times more`, skill: 'earthquakes',
      };
    }
    const depth = R.pick([5, 10, 12, 15, 20, 30]);
    const dist = R.pick([20, 30, 40, 50]);
    return {
      prompt: `An earthquake&rsquo;s focus is <b>${depth} km</b> underground. A town is <b>${dist} km</b> from the epicentre. How far is the town from the <b>epicentre</b>?`,
      answer: { type: 'number', value: dist, unit: 'km', placeholder: 'e.g. 30' },
      hint: 'Careful — the question asks for the distance from the EPICENTRE, which is already given.',
      working: ['<b>Picture:</b> the focus is underground; the epicentre is the spot on the surface right above it.', `The town is <b>${dist} km</b> from the epicentre — the ${depth} km depth is the focus, a different measurement.`],
      finalAnswer: `${dist} km`, skill: 'earthquakes',
    };
  }

  function vocabQ(level) {
    const items = [
      { q: 'What is the thin rocky outer layer of the Earth called?', a: 'crust', accept: ['the crust'] },
      { q: 'What is the thick layer of hot flowing rock under the crust called?', a: 'mantle', accept: ['the mantle'] },
      { q: 'What is a crack in the crust where rock slips called?', a: 'fault', accept: ['a fault', 'fault line', 'faults'] },
      { q: 'What is the point on the surface directly above an earthquake called?', a: 'epicentre', accept: ['the epicentre', 'epicenter'] },
      { q: 'What is the point underground where an earthquake starts called?', a: 'focus', accept: ['the focus', 'hypocentre'] },
      { q: 'What is a giant sea wave caused by an undersea earthquake called?', a: 'tsunami', accept: ['a tsunami', 'tsunamis'] },
      { q: 'What do we call the huge slabs that the Earth&rsquo;s crust is broken into?', a: 'plates', accept: ['plate', 'tectonic plates', 'tectonic plate'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one word)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Picture the boiled egg: shell = crust, white = mantle, yolk = core.',
      working: ['Match the word to the picture in your head.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Two plates pushing together crumpled the crust upwards', ['A volcano built them from lava', 'Glaciers pushed the rock into piles', 'The sea level dropped and left them behind'], 4);
      return {
        visual: nzPlatesSvg(),
        prompt: 'Marine fossils have been found high up in the Southern Alps. How did sea-floor rock end up on a mountain top?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What happens to a rug when you push it from both ends?',
        working: ['<b>Picture:</b> pushing a rug from both ends — it buckles up into ridges.', '1. Those rocks formed on the <b>sea floor</b> long ago.', '2. The Pacific and Australian plates push together along the Alpine Fault.', 'The crust <b>crumples upwards</b>, lifting old sea floor into the sky. The Alps are still rising.'],
        finalAnswer: 'Two plates pushing together crumpled the crust upwards',
      };
    },
    () => {
      const c = choice('Drop, cover and hold under the table until the shaking stops', ['Run outside immediately', 'Stand in a doorway', 'Get under the window to see out'], 4);
      return {
        prompt: 'Harper is eating lunch at the kitchen table when a strong earthquake starts. What is the safest thing to do?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Most injuries come from things falling on people.',
        working: ['<b>Picture:</b> cups and shelves crashing down around the room.', '1. <b>Drop</b> to hands and knees so you are not thrown over.', '2. <b>Cover</b> your head and neck — get under the table.', '3. <b>Hold</b> the table leg and move with it until the shaking stops.'],
        finalAnswer: 'Drop, cover and hold under the table until the shaking stops',
      };
    },
    () => {
      const c = choice('Move inland or uphill straight away — do not wait for a warning', ['Wait for an official tsunami warning', 'Watch the sea from the beach', 'Go and look at the exposed rocks'], 4);
      return {
        prompt: 'At Gisborne beach, a quake shakes so hard Harper cannot stand, and then the sea drains far out. What should her family do?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Long or Strong, Get Gone.',
        working: ['<b>Picture:</b> the sea taking a huge breath in before it rushes back.', '1. A quake that is <b>long or strong</b> near the coast is itself the warning.', '2. A local tsunami can arrive in minutes — faster than any official alert.', 'So go <b>inland or uphill</b> immediately and stay there.'],
        finalAnswer: 'Move inland or uphill straight away — do not wait for a warning',
      };
    },
    () => {
      const c = choice('Plates sliding past each other — earthquakes but no volcanoes', ['Plates pushing together', 'Plates pulling apart', 'A hot spot under the crust'], 4);
      return {
        visual: boundarySvg('slide'),
        prompt: 'A place has frequent earthquakes along a long straight crack, but no volcanoes at all. What kind of plate boundary is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Volcanoes need a way for magma to reach the surface. Sliding does not make one.',
        working: ['<b>Picture:</b> two hands pressed together sliding past — they stick, then jerk.', '1. Earthquakes but no volcanoes? Nothing is melting or diving down.', 'That is a <b>sliding (transform)</b> boundary — like the Alpine Fault.'],
        finalAnswer: 'Plates sliding past each other — earthquakes but no volcanoes',
      };
    },
    () => {
      const c = choice('100 times more', ['2 times more', '10 times more', '20 times more'], 4);
      return {
        prompt: 'A magnitude 4 quake rattles the windows. A magnitude 6 quake hits the same town. How much more shaking is that?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Each whole step up multiplies the shaking by 10.',
        working: ['<b>Picture:</b> each step on the scale is a whole new size, not a small increase.', '1. 4 → 5 is ×10.', '2. 5 → 6 is ×10 again.', '10 × 10 = <b>100 times</b> more shaking.'],
        finalAnswer: '100 times more',
      };
    },
    () => {
      const c = choice('Directly above the focus, where the shaking is usually worst', ['Where the fault ends', 'At the coast nearest the fault', 'Where the first building fell'], 4);
      return {
        visual: quakeSvg(),
        prompt: 'A news report says the epicentre was 8 km from Blenheim. What does that tell Harper about where the earthquake happened?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The focus is underground. The epicentre is its shadow on the surface.',
        working: ['<b>Picture:</b> a stone dropped in a pond — the splash point is the focus, and ripples spread out.', '1. The rock broke at the <b>focus</b>, underground.', '2. The <b>epicentre</b> is the point on the surface directly above it.', 'So the break was under a point 8 km from town — usually the hardest-shaken spot.'],
        finalAnswer: 'Directly above the focus, where the shaking is usually worst',
      };
    },
    () => {
      const c = choice('Hot rock close to the surface heats the groundwater', ['The sun heats the pools all day', 'Chemicals in the water react and make heat', 'The pools are heated by lightning'], 4);
      return {
        prompt: 'At Whakarewarewa in Rotorua, water shoots out of the ground as steam and boiling water. Why is the ground so hot there?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What is unusual about the rock beneath the Taupō Volcanic Zone?',
        working: ['<b>Picture:</b> a kettle sitting on a hot element buried in the ground.', '1. Rotorua sits in the Taupō Volcanic Zone.', '2. Hot rock is unusually close to the surface there.', 'Groundwater is heated until it boils and bursts out as a <b>geyser</b>.'],
        finalAnswer: 'Hot rock close to the surface heats the groundwater',
      };
    },
    () => {
      const c = choice('A boiled egg — thin shell, thick white, dense yolk', ['A glass of water', 'A solid steel ball', 'A balloon full of air'], 4);
      return {
        visual: layersSvg(),
        prompt: 'Harper needs a model to explain Earth&rsquo;s layers to her class. Which everyday object works best, and why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'You need something with a thin outside, a thick middle and a dense centre.',
        working: ['<b>Picture:</b> a boiled egg cut in half.', '1. The thin <b>shell</b> = the crust (only 5–70 km thick).', '2. The thick <b>white</b> = the mantle (most of the Earth).', '3. The <b>yolk</b> = the core: liquid metal outside, solid metal in the middle.'],
        finalAnswer: 'A boiled egg — thin shell, thick white, dense yolk',
      };
    },
    () => {
      const c = choice('Pushing together — one plate dives under and melts', ['Pulling apart', 'Sliding past', 'No boundary at all'], 4);
      return {
        visual: boundarySvg('push'),
        prompt: 'Off the east coast of the North Island there is a very deep ocean trench, and a line of volcanoes inland from it. What is happening at that boundary?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'A trench plus volcanoes is the signature of one particular boundary.',
        working: ['<b>Picture:</b> two cars crashing head-on — one slides under the other.', '1. A deep <b>trench</b> means one plate is diving down.', '2. As it sinks it melts, and the magma rises to make <b>volcanoes</b>.', 'So the plates are <b>pushing together</b>.'],
        finalAnswer: 'Pushing together — one plate dives under and melts',
      };
    },
    () => {
      const c = choice('No — the mantle is solid rock that flows very slowly, not a liquid', ['Yes, it is completely liquid', 'Yes, it is liquid metal', 'No, the mantle is frozen solid'], 4);
      return {
        visual: layersSvg(1),
        prompt: 'Harper writes: "The plates float on a sea of liquid rock." Is that right?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which layer is genuinely liquid — the mantle or the outer core?',
        working: ['<b>Picture:</b> very thick, warm toffee — you can push a finger through it, but slowly.', '1. Is the mantle liquid? No — it is <b>solid rock that can creep</b>.', '2. The only truly liquid layer is the <b>outer core</b>.', 'So the plates ride on slowly flowing solid rock.'],
        finalAnswer: 'No — the mantle is solid rock that flows very slowly, not a liquid',
      };
    },
    () => {
      const c = choice('Convection currents in the mantle drag the plates along', ['The Earth&rsquo;s spin throws them around', 'Ocean waves push them', 'Earthquakes shove them apart'], 4);
      return {
        prompt: 'Harper heats soup and watches the skin on top drift as the soup circles. Her teacher says this models plate movement. What is the link?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What is circling in the pot, and what is riding on top?',
        working: ['<b>Picture:</b> hot soup rises at the middle, spreads out, cools, sinks at the edge — and drags the skin with it.', '1. The soup = the hot <b>mantle</b>.', '2. The skin = the <b>plates</b> of crust.', 'Those circling <b>convection currents</b> are what move the plates a few cm a year.'],
        finalAnswer: 'Convection currents in the mantle drag the plates along',
      };
    },
  ];

  HL.registerTopic({
    id: 'plate-tectonics', subject: 'science', strand: 'earth', order: 4,
    name: 'Plates, Quakes & Volcanoes', short: 'Plates & quakes', animal: 'gecko',
    blurb: 'Why Aotearoa shakes: the Earth&rsquo;s layers, moving plates, faults and volcanoes.',
    example: 'crust → mantle → outer core → inner core',
    learn: {
      what: '<p>The Earth has four layers: a thin rocky <b>crust</b>, a thick hot <b>mantle</b>, a liquid metal <b>outer core</b> and a solid metal <b>inner core</b>. The crust is cracked into huge slabs called <b>tectonic plates</b>, which slide on the mantle at about the speed your fingernails grow. Aotearoa sits right on the join between the <b>Pacific</b> and <b>Australian</b> plates — which is why we get earthquakes, volcanoes and the Southern Alps.</p><p><b>Picture for this topic:</b> a <b>boiled egg with a cracked shell</b>. Thin shell = crust, thick white = mantle, yolk = core. Push the shell pieces around and they crunch, ride over each other and grind — that is a plate boundary.</p>',
      visual: layersSvg(),
      facts: [
        'Layers outwards-in: <b>crust</b> (thin, rocky) → <b>mantle</b> (hot rock that slowly flows) → <b>outer core</b> (liquid metal) → <b>inner core</b> (solid metal, ~5500 °C)',
        'Plates are moved by <b>convection currents</b> in the mantle — a few <b>cm a year</b>',
        'Three boundaries: <b>pushing together</b> (mountains, trenches, volcanoes) · <b>pulling apart</b> (new rock fills the gap) · <b>sliding past</b> (earthquakes, no volcano)',
        'NZ sits on the <b>Pacific</b> + <b>Australian</b> plate boundary; the <b>Alpine Fault</b> runs ~600 km down the South Island',
        'Earthquake words: <b>focus</b> = underground start point · <b>epicentre</b> = the point on the surface above it · each magnitude step = <b>10× more shaking</b>',
        'Safety: <b>Drop, Cover, Hold</b>. At the coast: <b>Long or Strong, Get Gone</b>',
      ],
      steps: [
        'For layer questions, run the boiled egg from the outside in: <b>crust → mantle → outer core → inner core</b>, and remember only the <b>outer core</b> is really liquid.',
        'For a boundary, follow the arrows: pointing <b>towards</b> each other = pushing together; pointing <b>away</b> = pulling apart; pointing <b>opposite ways side by side</b> = sliding past.',
        'To decide what a boundary makes, ask "<b>can magma get up?</b>" Diving plate melts → volcanoes. Just sliding → earthquakes only.',
        'For earthquakes, say it in order: rock breaks at the <b>focus</b>, the <b>epicentre</b> is straight above it, and the shaking spreads out like ripples in a pond.',
        'For any safety question: <b>Drop, Cover, Hold</b> indoors. On the coast after a long or strong quake, <b>get inland or uphill</b> without waiting for a warning.',
      ],
      examples: [
        { q: 'Name the Earth&rsquo;s layers from the outside in, and say which one is liquid.',
          visual: layersSvg(),
          working: ['<b>Picture:</b> a boiled egg cut in half.', '1. Thin shell → <b>crust</b> (only 5–70 km thick).', '2. Thick white → <b>mantle</b> (hot rock that creeps).', '3. Yolk → the core: <b>outer core</b> is liquid metal, <b>inner core</b> is solid metal.', 'Only the <b>outer core</b> is truly liquid.'],
          a: 'Crust, mantle, outer core, inner core — the outer core is the liquid one' },
        { q: 'What kind of plate boundary is this, and what does it make?',
          visual: boundarySvg('push'),
          working: ['<b>Picture:</b> two cars crashing head-on and crumpling.', '1. Which way do the arrows point? <b>Towards</b> each other.', '2. One plate dives under, melts, and magma rises.', 'So: <b>pushing together</b> → mountains, a deep trench, volcanoes and big earthquakes.'],
          a: 'Plates pushing together — mountains, trenches and volcanoes' },
        { q: 'Which two plates meet under New Zealand, and what is the Alpine Fault?',
          visual: nzPlatesSvg(),
          working: ['<b>Picture:</b> two giant slabs grinding past each other, with our islands sitting right on the join.', '1. The plates are the <b>Pacific</b> and the <b>Australian</b> plates.', '2. Down the South Island they mostly <b>slide past</b> each other.', 'That grinding join is the <b>Alpine Fault</b> — about 600 km long.'],
          a: 'The Pacific and Australian plates; the Alpine Fault is where they slide past' },
        { q: 'An earthquake starts 12 km underground, 8 km from Blenheim. Label the focus and epicentre.',
          visual: quakeSvg(),
          working: ['<b>Picture:</b> a stone dropped in a pond.', '1. Where the rock actually breaks, 12 km down = the <b>focus</b>.', '2. The point on the surface directly above it = the <b>epicentre</b>.', '3. Shaking spreads out from the focus like ripples, so the epicentre usually shakes hardest.'],
          a: 'Focus = 12 km underground; epicentre = the surface point right above it' },
        { q: 'How much more shaking is a magnitude 7 earthquake than a magnitude 5?',
          working: ['<b>Picture:</b> each step on the scale is a whole new size of shake.', '1. 5 → 6 is ×10.', '2. 6 → 7 is ×10 again.', '3. 10 × 10 = 100.'],
          a: '100 times more shaking' },
        { q: 'Why does the North Island have volcanoes but the South Island mostly has earthquakes?',
          visual: boundarySvg('slide'),
          working: ['<b>Picture:</b> one slab diving under (North Island) vs two slabs grinding side by side (South Island).', '1. In the north, the Pacific Plate <b>dives under</b> and melts → magma rises → volcanoes.', '2. In the south, the plates mostly <b>slide past</b> along the Alpine Fault.', 'Sliding gives no path for magma, so you get quakes without volcanoes.'],
          a: 'The north has a diving plate that melts; the south mostly slides past' },
        { q: 'A strong earthquake shakes the beach and then the sea drains far out. What should you do, and why?',
          working: ['<b>Picture:</b> the sea taking a huge breath in before rushing back.', '1. Is the quake long or strong near the coast? Yes — that is your warning.', '2. A local tsunami can arrive in <b>minutes</b>, faster than any official alert.', '3. The rule is <b>Long or Strong, Get Gone</b>.'],
          a: 'Go inland or uphill immediately — do not wait for a warning' },
      ],
      tips: [
        'The mantle is <b>not</b> liquid — it is solid rock that flows very slowly. The only liquid layer is the <b>outer core</b>.',
        '<b>Focus</b> is underground, <b>epicentre</b> is on the surface. "Epi-" means "on top of".',
        'One step up the magnitude scale is <b>ten times</b> the shaking, not one bit more — a 6 is not "a little worse" than a 5.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [layerOrderQ, layerFactQ, vocabQ, safetyQ, volcanoQ, quakeWordQ]
        : level === 2
          ? [layerOrderQ, layerFactQ, plateBasicsQ, boundaryQ, nzPlateQ, quakeWordQ, safetyQ, volcanoQ, volcanoWhyQ, vocabQ]
          : [layerFactQ, plateBasicsQ, boundaryQ, nzPlateQ, quakeWordQ, volcanoWhyQ, tsunamiQ, faultNumberQ, safetyQ, layerOrderQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
