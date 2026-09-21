/* Topic: Ecosystems — producers, consumers, decomposers, food chains and webs, energy flow.
 * Living World, order 5. Structure copied from cells.js (the exemplar). */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const ROLES = [
    { role: 'producer', mean: 'makes its own food using sunlight (photosynthesis)', pic: 'the solar panel at the start of everything' },
    { role: 'consumer', mean: 'cannot make its own food, so it eats other living things', pic: 'a customer buying lunch' },
    { role: 'decomposer', mean: 'breaks down dead things and returns the goodness to the soil', pic: 'the clean-up crew' },
  ];
  const DIETS = [
    { diet: 'herbivore', mean: 'eats only plants', ex: ['possum', 'weta', 'rabbit', 'kererū', 'caterpillar'] },
    { diet: 'carnivore', mean: 'eats only other animals', ex: ['stoat', 'kāhu (harrier hawk)', 'longfin eel', 'shark', 'ferret'] },
    { diet: 'omnivore', mean: 'eats both plants and animals', ex: ['rat', 'kiwi', 'pūkeko', 'person', 'pig'] },
  ];
  const DECOMPOSERS = [
    { name: 'fungi', how: 'grow over dead wood and soak the goodness out of it' },
    { name: 'bacteria', how: 'are far too small to see, but rot dead things down from the inside' },
    { name: 'earthworms', how: 'drag dead leaves under the ground and chew them into soil' },
  ];
  const CHAINS = [
    ['rātā leaves', 'weta', 'kiwi', 'stoat'],
    ['grass seeds', 'mouse', 'stoat'],
    ['leaves', 'caterpillar', 'pīwakawaka'],
    ['algae', 'kōura', 'longfin eel'],
    ['clover', 'rabbit', 'kāhu'],
    ['plankton', 'small fish', 'penguin', 'fur seal'],
    ['grass', 'grasshopper', 'skink', 'kōtare'],
  ];
  const WEB = {
    'rātā leaves': { role: 'producer', diet: null, eats: [], eatenBy: ['weta', 'possum'] },
    'seeds & berries': { role: 'producer', diet: null, eats: [], eatenBy: ['possum', 'rat'] },
    weta: { role: 'consumer', diet: 'herbivore', eats: ['rātā leaves'], eatenBy: ['kiwi', 'rat'] },
    possum: { role: 'consumer', diet: 'herbivore', eats: ['rātā leaves', 'seeds & berries'], eatenBy: [] },
    rat: { role: 'consumer', diet: 'omnivore', eats: ['seeds & berries', 'weta'], eatenBy: ['stoat'] },
    kiwi: { role: 'consumer', diet: 'omnivore', eats: ['weta'], eatenBy: ['stoat'] },
    stoat: { role: 'consumer', diet: 'carnivore', eats: ['rat', 'kiwi'], eatenBy: [] },
  };
  const WEB_NAMES = Object.keys(WEB);
  const NODE = {
    'rātā leaves': { cx: 76, cy: 196, w: 84 },
    'seeds & berries': { cx: 248, cy: 196, w: 104 },
    weta: { cx: 44, cy: 140, w: 56 },
    rat: { cx: 140, cy: 140, w: 48 },
    possum: { cx: 254, cy: 140, w: 68 },
    kiwi: { cx: 90, cy: 84, w: 56 },
    stoat: { cx: 190, cy: 28, w: 62 },
  };

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ch = (correct, wrongs, n) => { const c = choice(correct, wrongs, n); return { type: 'choice', value: c.value, choices: c.choices }; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const list = (a) => (a.length === 0 ? 'nothing' : a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

  /* ---------- diagrams ---------- */
  /** a straight arrow with a triangle head */
  function arrow(x1, y1, x2, y2, colour, w) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len, s = 9;
    const bx = x2 - ux * s, by = y2 - uy * s;
    return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${colour}" stroke-width="${w || 3}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${(bx - uy * 5).toFixed(1)},${(by + ux * 5).toFixed(1)} ${(bx + uy * 5).toFixed(1)},${(by - ux * 5).toFixed(1)}" fill="${colour}"/>`;
  }

  /** a straight food chain, left to right. blank = index shown as "?" */
  function chainSvg(chain, blank) {
    const w = chain.map((t) => Math.max(44, t.length * 5.8 + 14));
    const total = w.reduce((a, b) => a + b, 0) + (chain.length - 1) * 22;
    let x = (340 - total) / 2;
    const parts = chain.map((t, i) => {
      const isBlank = blank === i;
      const box = `<rect x="${x.toFixed(1)}" y="46" width="${w[i].toFixed(1)}" height="34" rx="9" fill="${isBlank ? '#FFFFFF' : i === 0 ? '#DFF0D0' : '#FBE8D8'}" stroke="${isBlank ? '#E0568C' : INK}" stroke-width="${isBlank ? 3 : 2}" ${isBlank ? 'stroke-dasharray="6 4"' : ''}/>` +
        `<text x="${(x + w[i] / 2).toFixed(1)}" y="68" text-anchor="middle" fill="${isBlank ? '#E0568C' : INK}" font-size="${isBlank ? 15 : 11}">${isBlank ? '?' : t}</text>`;
      const a = i < chain.length - 1 ? arrow(x + w[i] + 3, 63, x + w[i] + 19, 63, '#6FA04C', 3.5) : '';
      x += w[i] + 22;
      return box + a;
    }).join('');
    return `<svg viewBox="0 0 340 120" width="340" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="22" text-anchor="middle" fill="${INK}" font-size="12">the arrow means "energy goes to…"</text>
      <text x="170" y="36" text-anchor="middle" fill="#6FA04C" font-size="11">green box = producer</text>
      ${parts}
      <text x="170" y="104" text-anchor="middle" fill="#7A7065" font-size="11">read it as: is eaten by → is eaten by →</text>
    </svg>`;
  }

  /** the NZ bush food web. gone = a species crossed out */
  function webSvg(gone) {
    const box = (n) => {
      const p = NODE[n], off = gone === n;
      const x = p.cx - p.w / 2, y = p.cy - 11;
      return `<rect x="${x}" y="${y}" width="${p.w}" height="22" rx="8" fill="${off ? '#F7EEF2' : WEB[n].role === 'producer' ? '#DFF0D0' : '#FBE8D8'}" stroke="${off ? '#E0568C' : INK}" stroke-width="2"/>` +
        (off ? `<line x1="${x + 4}" y1="${y + 3}" x2="${x + p.w - 4}" y2="${y + 19}" stroke="#E0568C" stroke-width="3" opacity=".5"/><line x1="${x + 4}" y1="${y + 19}" x2="${x + p.w - 4}" y2="${y + 3}" stroke="#E0568C" stroke-width="3" opacity=".5"/>` : '') +
        `<text x="${p.cx}" y="${p.cy + 4}" text-anchor="middle" fill="${off ? '#9E2B57' : INK}" font-size="10.5">${n}</text>`;
    };
    const edge = (from, to) => {
      const a = NODE[from], b = NODE[to];
      const dead = gone === from || gone === to;
      const ax = a.cx, ay = a.cy - 11, bx = b.cx, by = b.cy + 11;
      if (Math.abs(a.cy - b.cy) < 4) return arrow(a.cx + a.w / 2 + 2, a.cy, b.cx - b.w / 2 - 3, b.cy, dead ? '#CFC8BC' : '#6FA04C', 3);
      return arrow(ax, ay - 1, bx, by + 3, dead ? '#CFC8BC' : '#6FA04C', 3);
    };
    const edges = [['rātā leaves', 'weta'], ['rātā leaves', 'possum'], ['seeds & berries', 'possum'], ['seeds & berries', 'rat'],
      ['weta', 'rat'], ['weta', 'kiwi'], ['rat', 'stoat'], ['kiwi', 'stoat']];
    return `<svg viewBox="0 0 340 220" width="340" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${edges.map(([f, t]) => edge(f, t)).join('')}
      ${WEB_NAMES.map(box).join('')}
      <text x="332" y="72" text-anchor="end" fill="#7A7065" font-size="10.5">arrows point to</text>
      <text x="332" y="86" text-anchor="end" fill="#7A7065" font-size="10.5">the eater</text>
    </svg>`;
  }

  /** energy pyramid: 90% lost at each step */
  function pyramidSvg() {
    const bands = [
      { y: 150, h: 36, w: 190, e: '10 000 J', n: 'rātā leaves', c: '#DFF0D0' },
      { y: 112, h: 36, w: 130, e: '1000 J', n: 'weta', c: '#F5E2B8' },
      { y: 74, h: 36, w: 78, e: '100 J', n: 'kiwi', c: '#F3CBAE' },
      { y: 36, h: 36, w: 42, e: '10 J', n: 'stoat', c: '#F0AFC6' },
    ];
    return `<svg viewBox="0 0 300 208" width="300" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="150" y="18" text-anchor="middle" fill="${INK}" font-size="12">only 10% carries on at each step</text>
      ${bands.map((b) => `<rect x="${110 - b.w / 2}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6" fill="${b.c}" stroke="${INK}" stroke-width="2"/>
        <text x="110" y="${b.y + 23}" text-anchor="middle" fill="${INK}" font-size="11">${b.e}</text>
        <text x="214" y="${b.y + 23}" fill="${INK}" font-size="11">${b.n}</text>`).join('')}
      <text x="150" y="200" text-anchor="middle" fill="#C43A6E" font-size="11">90% is lost as heat and waste each step</text>
    </svg>`;
  }

  const popTable = (a, b, c) => `<table class="data"><tr><th>Year</th><th>Stoats</th><th>Kiwi chicks</th></tr>
    <tr><td>before trapping</td><td>${a}</td><td>${b}</td></tr><tr><td>after trapping</td><td>${Math.round(a / 10)}</td><td>${c}</td></tr></table>`;

  /* ---------- question makers ---------- */
  function roleQ() {
    const r = R.pick(ROLES);
    if (R.chance(0.5)) {
      return {
        prompt: `What does a <b>${r.role}</b> do in an ecosystem?`,
        answer: ch(r.mean, ROLES.map((x) => x.mean)),
        hint: `Think of it as ${r.pic}.`,
        working: [`<b>Picture:</b> ${r.pic}.`, `A ${r.role} <b>${r.mean}</b>.`],
        finalAnswer: r.mean, skill: 'roles',
      };
    }
    const thing = r.role === 'producer' ? R.pick(['a rātā tree', 'harakeke (flax)', 'grass', 'seaweed'])
      : r.role === 'decomposer' ? R.pick(['a mushroom on a log', 'bacteria in the soil', 'an earthworm'])
        : R.pick(['a kiwi', 'a stoat', 'a possum', 'a weta']);
    return {
      prompt: `In a food chain, what is <b>${thing}</b>?`,
      answer: ch(r.role, ROLES.map((x) => x.role)),
      hint: 'Producers make their own food. Consumers eat things. Decomposers clean up dead things.',
      working: ['<b>Picture:</b> a solar panel (producer), a customer (consumer), a clean-up crew (decomposer).', `${cap(thing)} ${r.mean}.`, `So it is a <b>${r.role}</b>.`],
      finalAnswer: r.role, skill: 'roles',
    };
  }
  function dietQ() {
    const d = R.pick(DIETS);
    if (R.chance(0.55)) {
      const a = R.pick(d.ex);
      return {
        prompt: `A <b>${a}</b> eats ${d.mean.replace('eats ', '')}. What kind of consumer is it?`,
        answer: ch(d.diet, DIETS.map((x) => x.diet)),
        hint: 'Herb = plant. Carn = meat. Omni = everything.',
        working: ['<b>Picture:</b> herb = herbs = plants; carne = meat (like carnival food); omni = all.', `A ${a} ${d.mean}.`, `So it is a <b>${d.diet}</b>.`],
        finalAnswer: d.diet, skill: 'diets',
      };
    }
    return {
      prompt: `What does a <b>${d.diet}</b> eat?`,
      answer: ch(d.mean, DIETS.map((x) => x.mean), 3),
      hint: `For example, a ${d.ex[0]}.`,
      working: ['<b>Picture:</b> herb = plants, carne = meat, omni = everything.', `A ${d.diet} <b>${d.mean}</b> — like a ${d.ex[0]}.`],
      finalAnswer: d.mean, skill: 'diets',
    };
  }
  function decomposerQ() {
    const d = R.pick(DECOMPOSERS);
    if (R.chance(0.5)) {
      return {
        prompt: `Why are <b>${d.name}</b> so important in a forest?`,
        answer: ch('They break dead things down and put the goodness back into the soil for the plants', ['They eat the living animals so the forest does not get too full', 'They make oxygen for the trees', 'They carry seeds to new places'], 4),
        hint: 'What would happen to the forest floor if nothing rotted?',
        working: ['<b>Picture:</b> the clean-up crew after a party.', `${cap(d.name)} ${d.how}.`, 'The goodness goes back into the soil, and the plants use it again. Without them the forest would be buried in dead leaves.'],
        finalAnswer: 'They break dead things down and put the goodness back into the soil for the plants', skill: 'decomposers',
      };
    }
    return {
      prompt: `Which of these is a <b>decomposer</b>?`,
      answer: ch(d.name, DECOMPOSERS.map((x) => x.name).concat(['a stoat', 'a rātā tree'])),
      hint: 'A decomposer feeds on things that are already dead.',
      working: ['<b>Picture:</b> the clean-up crew.', `${cap(d.name)} ${d.how}.`, `So <b>${d.name}</b> is the decomposer.`],
      finalAnswer: d.name, skill: 'decomposers',
    };
  }
  function chainRead(level) {
    const c = R.pick(CHAINS);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 4);
    if (form === 1) {
      return {
        visual: chainSvg(c, -1),
        prompt: 'Look at the food chain. Which one is the <b>producer</b>?',
        answer: ch(c[0], c.slice(1)),
        hint: 'The producer is always at the start, because it makes its own food from sunlight.',
        working: ['<b>Picture:</b> the sun shines on the first box — everything else is queueing for lunch.', `The chain starts with <b>${c[0]}</b>, and it makes its own food.`],
        finalAnswer: c[0], skill: 'chains',
      };
    }
    if (form === 2) {
      const i = R.int(0, c.length - 2);
      return {
        visual: chainSvg(c, -1),
        prompt: `Look at the food chain. What eats the <b>${c[i]}</b>?`,
        answer: ch(c[i + 1], c.filter((x) => x !== c[i + 1])),
        hint: 'Follow the arrow OUT of that box. The arrow points at the eater.',
        working: ['<b>Picture:</b> the arrow is the energy walking to its next owner.', `The arrow leaves ${c[i]} and points at <b>${c[i + 1]}</b>.`],
        finalAnswer: c[i + 1], skill: 'chains',
      };
    }
    if (form === 3) {
      const i = R.int(1, c.length - 1);
      return {
        visual: chainSvg(c, -1),
        prompt: `Look at the food chain. What does the <b>${c[i]}</b> eat?`,
        answer: ch(c[i - 1], c.filter((x) => x !== c[i - 1])),
        hint: 'Follow the arrow INTO that box, and go backwards along it.',
        working: ['<b>Picture:</b> the arrow points at the eater, so go back down the arrow to find the meal.', `The arrow into ${c[i]} comes from <b>${c[i - 1]}</b>.`],
        finalAnswer: c[i - 1], skill: 'chains',
      };
    }
    const top = c[c.length - 1];
    return {
      visual: chainSvg(c, -1),
      prompt: `Look at the food chain. Which animal is the <b>top predator</b> — the one nothing in this chain eats?`,
      answer: ch(top, c.slice(0, -1)),
      hint: 'Look for the box with no arrow leaving it.',
      working: ['<b>Picture:</b> the last one in the queue — nobody is behind it.', `No arrow leaves the <b>${top}</b>, so nothing here eats it.`],
      finalAnswer: top, skill: 'chains',
    };
  }
  function chainBlank(level) {
    const c = R.pick(CHAINS);
    const i = level === 1 ? R.int(1, c.length - 1) : R.int(0, c.length - 1);
    const others = CHAINS.reduce((a, x) => a.concat(x), []).filter((x) => !c.includes(x));
    return {
      visual: chainSvg(c, i),
      prompt: 'One link in the food chain has been rubbed out. What belongs in the <b>?</b> box?',
      answer: ch(c[i], others),
      hint: i === 0 ? 'The first box must be a plant, because it makes its own food.' : `Ask: what would ${c[i - 1]} be eaten by, and what would eat ${c[i + 1] || 'nothing'}?`,
      working: ['<b>Picture:</b> a queue for lunch, in order of who eats whom.', `The full chain is: ${c.join(' → ')}.`, `So the missing one is <b>${c[i]}</b>.`],
      finalAnswer: c[i], skill: 'chains',
    };
  }
  function arrowMeaning(level) {
    const c = R.pick(CHAINS);
    const forms = [
      { p: 'What does an arrow in a food chain actually mean?', a: 'energy is passed on to whatever the arrow points at', w: ['the animal is running that way', 'this one hunts that one down', 'they live in the same place'] },
      { p: `In the chain shown, which way does the <b>energy</b> travel?`, a: 'from left to right, in the same direction as the arrows', w: ['from right to left, back down the chain', 'both ways at once', 'the arrows do not show energy at all'] },
      { p: 'Where does the energy in <b>every</b> food chain come from in the first place?', a: 'the Sun', w: ['the soil', 'the decomposers', 'water'] },
    ];
    const f = R.pick(forms);
    return {
      visual: chainSvg(c, -1),
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Say the arrow out loud as the words "is eaten by".',
      working: ['<b>Picture:</b> the arrow is the energy walking from one animal to the next.', `Read it: ${c[0]} <b>is eaten by</b> ${c[1]}…`, `So the answer is <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'chains',
    };
  }
  function webRead(level) {
    const n = R.pick(WEB_NAMES);
    const w = WEB[n];
    const form = w.eats.length && w.eatenBy.length ? R.int(1, 3) : w.eats.length ? R.pick([2, 3]) : R.pick([1, 3]);
    if (form === 1) {
      const right = list(w.eatenBy);
      return {
        visual: webSvg(null),
        prompt: `In this bush food web, what eats the <b>${n}</b>?`,
        answer: ch(right, WEB_NAMES.map((x) => list(WEB[x].eatenBy))),
        hint: 'Follow every arrow that LEAVES that box. Arrows point at the eater.',
        working: ['<b>Picture:</b> each arrow is energy walking to whoever eats it.', `Arrows leave ${n} and point at <b>${right}</b>.`],
        finalAnswer: right, skill: 'webs',
      };
    }
    if (form === 2) {
      const right = list(w.eats);
      return {
        visual: webSvg(null),
        prompt: `In this bush food web, what does the <b>${n}</b> eat?`,
        answer: ch(right, WEB_NAMES.map((x) => list(WEB[x].eats))),
        hint: 'Follow the arrows that point INTO that box, and go backwards along them.',
        working: ['<b>Picture:</b> arrows point at the eater, so trace backwards to find the meal.', `The arrows into ${n} come from <b>${right}</b>.`],
        finalAnswer: right, skill: 'webs',
      };
    }
    const right = w.role === 'producer' ? 'producer' : w.diet;
    return {
      visual: webSvg(null),
      prompt: `In this bush food web, what kind of feeder is the <b>${n}</b>?`,
      answer: ch(right, ['producer', 'herbivore', 'carnivore', 'omnivore'], 4),
      hint: 'Look at what the arrows into it come from: green boxes are plants, orange boxes are animals.',
      working: ['<b>Picture:</b> green box = plant, orange box = animal.', w.role === 'producer' ? `${cap(n)} makes its own food, so it is a <b>producer</b>.` : `${cap(n)} eats ${list(w.eats)}.`, `So it is a <b>${right}</b>.`],
      finalAnswer: right, skill: 'webs',
    };
  }
  function webRemove(level) {
    const cases = [
      { gone: 'stoat', q: 'the kiwi', a: 'The kiwi numbers go UP, because nothing is hunting them any more', w: ['The kiwi die out straight away', 'Nothing at all changes for the kiwi', 'The kiwi start eating rātā leaves'] },
      { gone: 'stoat', q: 'the rat', a: 'The rat numbers go UP, because their predator has gone', w: ['The rats die out', 'The rats become producers', 'Nothing changes for the rats'] },
      { gone: 'weta', q: 'the kiwi', a: 'The kiwi have less to eat, so their numbers go DOWN', w: ['The kiwi numbers go up', 'The kiwi start making their own food', 'The kiwi are not affected at all'] },
      { gone: 'weta', q: 'the rātā leaves', a: 'Fewer leaves get eaten, so the rātā does better', w: ['The rātā dies out', 'The rātā starts eating insects', 'The rātā turns into a decomposer'] },
      { gone: 'rātā leaves', q: 'the weta', a: 'The weta lose their food, so their numbers crash', w: ['The weta numbers go up', 'The weta start eating stoats', 'Nothing changes for the weta'] },
      { gone: 'rat', q: 'the stoat', a: 'The stoats have less to eat, so more of them hunt kiwi instead', w: ['The stoats become herbivores', 'The stoats are not affected at all', 'The stoat numbers go up'] },
    ];
    const c = R.pick(cases);
    return {
      visual: webSvg(c.gone),
      prompt: `Every <b>${c.gone}</b> is removed from this bush (crossed out). What happens to <b>${c.q}</b>?`,
      answer: ch(c.a, c.w, 4),
      hint: 'Find the arrow between the two. Was the removed one food, or was it the hunter?',
      working: ['<b>Picture:</b> pull one thread out of a net and the whole net sags.', `1. Which arrow joins ${c.gone} to ${c.q}? Follow it.`, `2. Was ${c.gone} the food or the hunter? That decides which way the numbers go.`, `So: <b>${c.a}</b>`],
      finalAnswer: c.a, skill: 'webs',
    };
  }
  function predPrey() {
    const pairs = [
      { pred: 'stoat', prey: 'kiwi chick' }, { pred: 'stoat', prey: 'mouse' },
      { pred: 'kāhu (harrier hawk)', prey: 'rabbit' }, { pred: 'longfin eel', prey: 'kōura' },
      { pred: 'kingfisher (kōtare)', prey: 'skink' }, { pred: 'fur seal', prey: 'fish' },
      { pred: 'kiwi', prey: 'weta' },
    ];
    const p = R.pick(pairs);
    const askPred = R.chance(0.5);
    return {
      prompt: `A <b>${p.pred}</b> hunts and eats a <b>${p.prey}</b>. Which one is the <b>${askPred ? 'predator' : 'prey'}</b>?`,
      answer: ch(askPred ? p.pred : p.prey, [p.pred, p.prey], 2),
      hint: 'The predator does the hunting. The prey is the one that gets eaten.',
      working: ['<b>Picture:</b> the hunter and the hunted.', `The ${p.pred} does the hunting → <b>predator</b>. The ${p.prey} gets eaten → <b>prey</b>.`],
      finalAnswer: askPred ? p.pred : p.prey, skill: 'pred-prey',
    };
  }
  function energyQ(level) {
    const form = R.int(1, level === 1 ? 2 : 4);
    if (form === 1) {
      return {
        visual: pyramidSvg(),
        prompt: 'Look at the energy pyramid. Why do food chains almost never have more than four or five links?',
        answer: ch('So much energy is lost at each step that there is not enough left for another animal', ['Animals get bored of eating the same food', 'There are not enough different animals', 'The arrows would get too long to draw'], 4),
        hint: 'Look at how the numbers shrink: 10 000 → 1000 → 100 → 10.',
        working: ['<b>Picture:</b> pouring juice from cup to cup, spilling 9/10 every time.', '1. How much passes on at each step? Only about <b>10%</b>.', '2. The rest is lost as heat, movement and waste.', 'After four or five steps there is <b>too little energy left</b> to feed anything.'],
        finalAnswer: 'So much energy is lost at each step that there is not enough left for another animal', skill: 'energy',
      };
    }
    if (form === 2) {
      const start = R.pick([1000, 2000, 5000, 10000, 20000]);
      return {
        visual: pyramidSvg(),
        prompt: `A plant traps <b>${start} J</b> of energy. Only <b>10%</b> of it passes on to the animal that eats the plant. How much energy does that animal get?`,
        answer: { type: 'number', value: start / 10, unit: 'J' },
        hint: '10% means one tenth — divide by 10.',
        working: ['<b>Picture:</b> ten lollies go in, one lolly comes out the other end.', `10% of ${start} = ${start} ÷ 10 = <b>${start / 10} J</b>.`],
        finalAnswer: `${start / 10} J`, skill: 'energy',
      };
    }
    if (form === 3) {
      const start = R.pick([10000, 20000, 50000]);
      return {
        visual: pyramidSvg(),
        prompt: `A plant traps <b>${start} J</b>. Only 10% passes on at each step. How much energy reaches the animal <b>two</b> steps up the chain?`,
        answer: { type: 'number', value: start / 100, unit: 'J' },
        hint: 'Take 10% once, then take 10% of that again.',
        working: ['<b>Picture:</b> two cups poured, spilling 9/10 each time.', `Step 1: ${start} ÷ 10 = ${start / 10} J.`, `Step 2: ${start / 10} ÷ 10 = <b>${start / 100} J</b>.`],
        finalAnswer: `${start / 100} J`, skill: 'energy',
      };
    }
    return {
      prompt: 'About what percentage of the energy is <b>lost</b> at each step of a food chain?',
      answer: { type: 'number', value: 90, unit: '%' },
      hint: 'Only 10% carries on. How much is that out of 100?',
      working: ['<b>Picture:</b> 10 lollies in, 1 lolly out.', '100% − 10% = <b>90%</b> lost as heat, movement and waste.'],
      finalAnswer: '90%', skill: 'energy',
    };
  }
  function popCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 3);
    if (form === 1) {
      const before = R.pick([200, 400, 500, 800]), pct = R.pick([10, 20, 25, 50]);
      return {
        prompt: `A bush reserve has <b>${before}</b> kiwi. Stoats kill <b>${pct}%</b> of them in a year. How many kiwi are killed?`,
        answer: { type: 'number', value: (before * pct) / 100, unit: 'kiwi' },
        hint: `Find 1% first (divide by 100), then multiply by ${pct}.`,
        working: [`1% of ${before} = ${before / 100}.`, `${pct}% = ${before / 100} × ${pct} = <b>${(before * pct) / 100}</b> kiwi.`],
        finalAnswer: `${(before * pct) / 100} kiwi`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const a = R.pick([200, 300, 400]), b = R.pick([40, 60, 80]), c = b * R.pick([2, 3]);
      return {
        visual: popTable(a, b, c),
        prompt: `Look at the table. How many <b>more</b> kiwi chicks survived after the stoat trapping started?`,
        answer: { type: 'number', value: c - b, unit: 'chicks' },
        hint: 'Take the "before" number away from the "after" number.',
        working: ['<b>Picture:</b> fewer hunters means more chicks live.', `${c} − ${b} = <b>${c - b}</b> more chicks.`],
        finalAnswer: `${c - b} chicks`, skill: 'numbers',
      };
    }
    const each = R.int(2, 6), possums = R.pick([50, 100, 200]);
    return {
      prompt: `Each possum eats about <b>${each} kg</b> of leaves a week. How many kilograms do <b>${possums}</b> possums eat in a week?`,
      answer: { type: 'number', value: each * possums, unit: 'kg' },
      hint: 'Multiply the amount for one possum by the number of possums.',
      working: [`${each} × ${possums} = <b>${each * possums}</b> kg a week.`, 'That is why possums strip a rātā tree bare.'],
      finalAnswer: `${each * possums} kg`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => ({
      visual: webSvg('stoat'),
      prompt: 'A predator-free project traps every stoat in a valley. Predict what happens to the kiwi over the next few years.',
      answer: ch('Kiwi chick numbers rise, because far fewer are being killed', ['Kiwi numbers fall, because they have lost a food source', 'Kiwi turn into herbivores', 'Nothing changes, because kiwi do not meet stoats'], 4),
      hint: 'Was the stoat the kiwi\'s food, or the kiwi\'s hunter?',
      working: ['<b>Picture:</b> the arrow runs kiwi → stoat, so the stoat was eating the kiwi.', '1. Take the hunter away.', '2. More chicks survive to grow up.', 'So <b>kiwi numbers rise</b> — which is exactly what happens in real NZ sanctuaries.'],
      finalAnswer: 'Kiwi chick numbers rise, because far fewer are being killed',
    }),
    () => ({
      prompt: 'Possums strip the leaves off rātā trees until the tree dies. Which two problems does that cause for the bush?',
      answer: ch('The tree stops making food and shelter, and the birds that used it lose their home and nectar', ['The possums run out of predators', 'The soil stops making its own food', 'The bush gets too much sunlight for the stoats'], 4),
      hint: 'The rātā is a producer AND a home. Take it away and two things break.',
      working: ['<b>Picture:</b> the rātā is the solar panel AND the block of flats.', '1. As a producer it feeds the whole chain — no leaves, no energy in.', '2. As a home it holds nests and nectar for tūī and kererū.', 'So <b>the food supply and the shelter both go</b>.'],
      finalAnswer: 'The tree stops making food and shelter, and the birds that used it lose their home and nectar',
    }),
    (level) => {
      const c = R.pick(CHAINS);
      const i = R.int(1, c.length - 1);
      return {
        visual: chainSvg(c, -1),
        prompt: `A disease wipes out every <b>${c[i - 1]}</b> in this chain. What happens to the <b>${c[i]}</b> first?`,
        answer: ch(`Their numbers fall, because they have lost their food`, ['Their numbers rise, because they have lost a predator', 'They start making their own food from sunlight', 'Nothing happens to them at all'], 4),
        hint: 'Look at the arrow: which one is the food, and which one is the eater?',
        working: ['<b>Picture:</b> follow the arrow — it points at the eater.', `1. The arrow runs ${c[i - 1]} → ${c[i]}, so ${c[i - 1]} is the <b>food</b>.`, '2. Take away the food and the eater goes hungry.', `So <b>${c[i]} numbers fall</b>.`],
        finalAnswer: 'Their numbers fall, because they have lost their food',
      };
    },
    () => ({
      visual: pyramidSvg(),
      prompt: 'Harper asks why there are lots of weta in the bush but only a few stoats. Use the pyramid to explain.',
      answer: ch('Only about 10% of the energy passes on each step, so there is only enough for a few animals at the top', ['Stoats are just harder to breed', 'Weta live longer than stoats', 'Stoats do not need any energy'], 4),
      hint: 'Look at how the energy numbers shrink going up.',
      working: ['<b>Picture:</b> pouring juice cup to cup, spilling 9/10 each time.', '1. 10 000 J → 1000 J → 100 J → 10 J.', '2. There is only a tenth as much energy at each level up.', 'So there is only enough energy for <b>a few animals at the top</b>.'],
      finalAnswer: 'Only about 10% of the energy passes on each step, so there is only enough for a few animals at the top',
    }),
    () => ({
      prompt: 'A farmer sprays to kill every insect on her land. Later she notices there are far fewer birds too. Why?',
      answer: ch('Many of the birds ate those insects, so their food supply disappeared', ['The spray made the birds fly away', 'Birds and insects are the same species', 'The birds became producers instead'], 4),
      hint: 'Draw the food chain: plants → insects → birds.',
      working: ['<b>Picture:</b> plants → insects → birds. Cut out the middle box.', '1. What did the birds eat? <b>Insects.</b>', '2. Remove the insects — the arrow into the birds disappears.', 'So the <b>birds lose their food</b> and their numbers fall.'],
      finalAnswer: 'Many of the birds ate those insects, so their food supply disappeared',
    }),
    (level) => {
      const n = R.pick(['weta', 'rat', 'kiwi']);
      const w = WEB[n];
      return {
        visual: webSvg(null),
        prompt: `Harper is drawing this bush web in her book. She writes "the ${n} eats ${list(w.eatenBy) === 'nothing' ? 'nobody' : list(w.eatenBy)}". Has she read the arrows correctly?`,
        answer: ch(`No — those are the things that eat the ${n}. The arrows point at the eater`, [`Yes, that is exactly right`, `No, the arrows show which animals live together`, `No, arrows in a web mean nothing at all`], 4),
        hint: 'An arrow always points AT the animal doing the eating.',
        working: ['<b>Picture:</b> the arrow is the energy walking to whoever eats it.', `1. Arrows leaving the ${n} point at ${list(w.eatenBy)}.`, `2. So those are the ones that <b>eat</b> the ${n}.`, `The ${n} actually eats ${list(w.eats)}.`],
        finalAnswer: `No — those are the things that eat the ${n}. The arrows point at the eater`,
      };
    },
    () => ({
      prompt: 'Why is a food WEB a better picture of a real bush than a single food chain?',
      answer: ch('Most animals eat more than one thing, so a web shows all the connections at once', ['A web is prettier to draw', 'Chains only work for plants', 'Webs show how fast the animals move'], 4),
      hint: 'Think about how many different things a rat eats.',
      working: ['<b>Picture:</b> a chain is one thread; a web is the whole net.', '1. Does a rat eat only one thing? No — seeds, weta, eggs.', '2. A single chain can only show one line.', 'So a <b>web shows every connection</b>, and shows what happens when one thread is pulled out.'],
      finalAnswer: 'Most animals eat more than one thing, so a web shows all the connections at once',
    }),
    (level) => {
      const a = R.pick([300, 400, 600]), b = R.pick([30, 50, 60]), c = b * R.pick([2, 3, 4]);
      return {
        visual: popTable(a, b, c),
        prompt: 'Look at the results of the trapping programme. What do the numbers show, and why?',
        answer: ch('Fewer stoats means more kiwi chicks survive, because kiwi are the stoats\' prey', ['Fewer stoats means fewer kiwi, because stoats feed the kiwi', 'The numbers show nothing — they are unrelated', 'More kiwi caused the stoat numbers to drop'], 4),
        hint: `Stoats went from ${a} down to ${Math.round(a / 10)}. Chicks went from ${b} up to ${c}.`,
        working: ['<b>Picture:</b> fewer hunters in the bush = more chicks live to grow up.', `1. Stoats: ${a} → ${Math.round(a / 10)} (down).`, `2. Kiwi chicks: ${b} → ${c} (up).`, '3. The arrow in the web runs kiwi → stoat, so stoats eat kiwi.', 'So <b>fewer predators means more prey survive</b>.'],
        finalAnswer: 'Fewer stoats means more kiwi chicks survive, because kiwi are the stoats\' prey',
      };
    },
    () => ({
      prompt: 'What would happen to a forest if all the decomposers suddenly vanished?',
      answer: ch('Dead leaves and animals would pile up, and the soil would run out of nutrients for the plants', ['The plants would grow much faster', 'The animals would all become herbivores', 'The Sun would stop feeding the food chain'], 4),
      hint: 'Decomposers do two jobs: clear the mess AND recycle the goodness.',
      working: ['<b>Picture:</b> a party with nobody to clean up, and the shop never getting restocked.', '1. Nothing rots → dead stuff <b>piles up</b>.', '2. The nutrients stay locked inside it → the <b>soil runs out</b>.', 'So the plants — the producers — would eventually fail, and the whole web with them.'],
      finalAnswer: 'Dead leaves and animals would pile up, and the soil would run out of nutrients for the plants',
    }),
    () => ({
      visual: webSvg('rat'),
      prompt: 'A poison drop kills every rat in the valley (crossed out). Predict what happens to the stoats.',
      answer: ch('Stoats lose a big part of their food, so their numbers drop — but at first more of them hunt kiwi', ['Stoat numbers go up, because rats used to eat them', 'Stoats become herbivores and eat rātā leaves', 'Nothing changes for the stoats'], 4),
      hint: 'The arrow runs rat → stoat, so rats were food for stoats.',
      working: ['<b>Picture:</b> pull a thread out of the net and the whole net sags.', '1. Which way does the arrow go? rat → stoat, so rats were <b>food</b>.', '2. Less food = fewer stoats in the long run.', '3. But in the short term the hungry stoats <b>switch to other prey</b> like kiwi — real pest control has to remove both.'],
      finalAnswer: 'Stoats lose a big part of their food, so their numbers drop — but at first more of them hunt kiwi',
    }),
    () => ({
      prompt: 'Harper wants to find out whether there are more weta under logs in the damp bush than in the dry paddock. Which is the most important thing to keep the same?',
      answer: ch('The number of logs she looks under and how long she searches in each place', ['The colour of her torch', 'The day of the week', 'Whether her friend is with her'], 4),
      hint: 'A fair test changes one thing only.',
      working: ['<b>Picture:</b> two identical searches, one in each habitat.', '1. What is she changing? The <b>habitat</b> (damp bush vs dry paddock).', '2. So everything else must match: same number of logs, same search time.', 'That is a <b>fair test</b>.'],
      finalAnswer: 'The number of logs she looks under and how long she searches in each place',
    }),
  ];

  HL.registerTopic({
    id: 'ecosystems', subject: 'science', strand: 'living', order: 5,
    name: 'Ecosystems & food webs', short: 'Food webs', animal: 'bee',
    blurb: 'Who eats whom, and how energy moves through a bush or a river.',
    example: 'rātā leaves → weta → kiwi → stoat',
    learn: {
      what: '<p>An ecosystem is all the living things in one place plus the air, water and soil around them. <b>Producers</b> (plants) capture the Sun\'s energy. <b>Consumers</b> eat things. <b>Decomposers</b> break the dead ones down. A <b>food chain</b> shows one path the energy takes; a <b>food web</b> shows all the paths at once.</p><p><b>Picture for this topic:</b> a food chain is a <b>relay race</b>. The plant runs the first leg with energy from the Sun, and each animal takes the baton — but <b>drops 9 out of every 10 lollies</b> along the way.</p>',
      visual: `<svg viewBox="0 0 340 220" width="340" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="15" text-anchor="middle" fill="#4A4033" font-size="12">a bush food web — arrows point at the eater</text>
        <line x1="76" y1="184" x2="47" y2="157" stroke="#6FA04C" stroke-width="3"/><polygon points="44,154 55,156 53,164" fill="#6FA04C"/>
        <line x1="90" y1="186" x2="222" y2="157" stroke="#6FA04C" stroke-width="3"/><polygon points="228,156 218,151 220,161" fill="#6FA04C"/>
        <line x1="248" y1="184" x2="254" y2="158" stroke="#6FA04C" stroke-width="3"/><polygon points="255,152 249,161 260,162" fill="#6FA04C"/>
        <line x1="228" y1="186" x2="156" y2="157" stroke="#6FA04C" stroke-width="3"/><polygon points="150,154 160,151 158,161" fill="#6FA04C"/>
        <line x1="74" y1="140" x2="108" y2="140" stroke="#6FA04C" stroke-width="3"/><polygon points="116,140 106,135 106,145" fill="#6FA04C"/>
        <line x1="52" y1="128" x2="82" y2="101" stroke="#6FA04C" stroke-width="3"/><polygon points="87,96 84,107 76,100" fill="#6FA04C"/>
        <line x1="146" y1="128" x2="180" y2="47" stroke="#6FA04C" stroke-width="3"/><polygon points="183,40 176,50 186,53" fill="#6FA04C"/>
        <line x1="100" y1="74" x2="168" y2="45" stroke="#6FA04C" stroke-width="3"/><polygon points="175,42 165,38 167,48" fill="#6FA04C"/>
        <rect x="34" y="185" width="84" height="22" rx="8" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/><text x="76" y="200" text-anchor="middle" fill="#4A4033" font-size="10.5">rātā leaves</text>
        <rect x="196" y="185" width="104" height="22" rx="8" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/><text x="248" y="200" text-anchor="middle" fill="#4A4033" font-size="10.5">seeds &amp; berries</text>
        <rect x="16" y="129" width="56" height="22" rx="8" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="44" y="144" text-anchor="middle" fill="#4A4033" font-size="10.5">weta</text>
        <rect x="116" y="129" width="48" height="22" rx="8" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="140" y="144" text-anchor="middle" fill="#4A4033" font-size="10.5">rat</text>
        <rect x="220" y="129" width="68" height="22" rx="8" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="254" y="144" text-anchor="middle" fill="#4A4033" font-size="10.5">possum</text>
        <rect x="62" y="73" width="56" height="22" rx="8" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="90" y="88" text-anchor="middle" fill="#4A4033" font-size="10.5">kiwi</text>
        <rect x="159" y="17" width="62" height="22" rx="8" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="190" y="32" text-anchor="middle" fill="#4A4033" font-size="10.5">stoat</text>
        <text x="332" y="66" text-anchor="end" fill="#6FA04C" font-size="10.5">green = producer</text>
        <text x="332" y="80" text-anchor="end" fill="#C0763E" font-size="10.5">orange = consumer</text>
        <text x="332" y="100" text-anchor="end" fill="#7A7065" font-size="10.5">nothing eats the</text>
        <text x="332" y="113" text-anchor="end" fill="#7A7065" font-size="10.5">stoat or the possum</text>
      </svg>`,
      facts: [
        '<b>Producer</b> = makes its own food from sunlight · <b>Consumer</b> = eats other living things · <b>Decomposer</b> = rots dead things down',
        'Consumers: <b>herbivore</b> (plants only) · <b>carnivore</b> (animals only) · <b>omnivore</b> (both)',
        'An arrow means <b>"energy goes to"</b> — it always points at the <b>eater</b>',
        'Every food chain starts with a <b>producer</b>, and all the energy came from the <b>Sun</b>',
        'Only about <b>10%</b> of the energy passes on at each step — <b>90% is lost</b> as heat and waste',
        'That is why chains are short, and why there are <b>far fewer</b> animals at the top',
      ],
      steps: [
        'Read every arrow as the words "<b>is eaten by</b>". rātā leaves → weta means the leaves are eaten by the weta.',
        'To find <b>what eats X</b>, follow the arrows <b>out</b> of X. To find <b>what X eats</b>, follow the arrows <b>into</b> X backwards.',
        'To sort a living thing: does it make its own food? <b>producer</b>. Does it eat living things? <b>consumer</b>. Does it feed on dead things? <b>decomposer</b>.',
        'When something is removed, ask "<b>was it food, or was it the hunter?</b>" Lose your food → your numbers go <b>down</b>. Lose your hunter → your numbers go <b>up</b>.',
        'For an energy question, remember <b>÷ 10 each step</b>.',
      ],
      examples: [
        { q: 'In the chain rātā leaves → weta → kiwi → stoat, what does the kiwi eat, and what eats the kiwi?',
          visual: `<svg viewBox="0 0 340 120" width="340" height="120" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="170" y="22" text-anchor="middle" fill="#4A4033" font-size="12">the arrow means "energy goes to…"</text>
            <rect x="32" y="46" width="78" height="34" rx="9" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/><text x="71" y="68" text-anchor="middle" fill="#4A4033" font-size="11">rātā leaves</text>
            <line x1="113" y1="63" x2="123" y2="63" stroke="#6FA04C" stroke-width="3.5"/><polygon points="129,63 120,58 120,68" fill="#6FA04C"/>
            <rect x="132" y="46" width="44" height="34" rx="9" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="154" y="68" text-anchor="middle" fill="#4A4033" font-size="11">weta</text>
            <line x1="179" y1="63" x2="189" y2="63" stroke="#6FA04C" stroke-width="3.5"/><polygon points="195,63 186,58 186,68" fill="#6FA04C"/>
            <rect x="198" y="46" width="44" height="34" rx="9" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="220" y="68" text-anchor="middle" fill="#4A4033" font-size="11">kiwi</text>
            <line x1="245" y1="63" x2="255" y2="63" stroke="#6FA04C" stroke-width="3.5"/><polygon points="261,63 252,58 252,68" fill="#6FA04C"/>
            <rect x="264" y="46" width="46" height="34" rx="9" fill="#FBE8D8" stroke="#4A4033" stroke-width="2"/><text x="287" y="68" text-anchor="middle" fill="#4A4033" font-size="11">stoat</text>
            <text x="170" y="104" text-anchor="middle" fill="#7A7065" font-size="11">read it as: is eaten by → is eaten by →</text>
          </svg>`,
          working: ['<b>Picture:</b> the arrow is the energy walking to whoever eats it next.', '1. Which arrow points INTO kiwi? The one from <b>weta</b> — so the kiwi eats weta.', '2. Which arrow points OUT of kiwi? The one to <b>stoat</b> — so the stoat eats the kiwi.', 'Say it out loud: "weta is eaten by kiwi is eaten by stoat".'],
          a: 'The kiwi eats weta, and the stoat eats the kiwi' },
        { q: 'A possum eats only leaves and berries. What kind of consumer is it?',
          working: ['<b>Picture:</b> herb = plants, carne = meat, omni = everything.', '1. Does it eat plants? <b>Yes.</b>', '2. Does it eat animals? <b>No.</b>', 'Plants only → <b>herbivore</b>.'],
          a: 'A herbivore' },
        { q: 'A plant traps 10 000 J of energy. Only 10% passes on at each step. How much reaches the kiwi, two steps up?',
          visual: `<svg viewBox="0 0 300 208" width="300" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="150" y="18" text-anchor="middle" fill="#4A4033" font-size="12">only 10% carries on at each step</text>
            <rect x="15" y="150" width="190" height="36" rx="6" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/><text x="110" y="173" text-anchor="middle" fill="#4A4033" font-size="11">10 000 J</text><text x="214" y="173" fill="#4A4033" font-size="11">rātā leaves</text>
            <rect x="45" y="112" width="130" height="36" rx="6" fill="#F5E2B8" stroke="#4A4033" stroke-width="2"/><text x="110" y="135" text-anchor="middle" fill="#4A4033" font-size="11">1000 J</text><text x="214" y="135" fill="#4A4033" font-size="11">weta</text>
            <rect x="71" y="74" width="78" height="36" rx="6" fill="#F3CBAE" stroke="#4A4033" stroke-width="2"/><text x="110" y="97" text-anchor="middle" fill="#4A4033" font-size="11">100 J</text><text x="214" y="97" fill="#4A4033" font-size="11">kiwi</text>
            <rect x="89" y="36" width="42" height="36" rx="6" fill="#F0AFC6" stroke="#4A4033" stroke-width="2"/><text x="110" y="59" text-anchor="middle" fill="#4A4033" font-size="11">10 J</text><text x="214" y="59" fill="#4A4033" font-size="11">stoat</text>
            <text x="150" y="200" text-anchor="middle" fill="#C43A6E" font-size="11">90% is lost as heat and waste each step</text>
          </svg>`,
          working: ['<b>Picture:</b> pouring juice from cup to cup and spilling nine tenths every time.', '1. Leaves → weta: 10 000 ÷ 10 = <b>1000 J</b>.', '2. Weta → kiwi: 1000 ÷ 10 = <b>100 J</b>.', 'Only 100 J out of 10 000 J gets to the kiwi. That is why there are so few animals at the top.'],
          a: '100 J' },
        { q: 'Every stoat in a valley is trapped. Predict what happens to the kiwi.',
          working: ['<b>Picture:</b> the arrow runs kiwi → stoat, so the stoat is the hunter.', '1. Was the stoat the kiwi\'s food, or its hunter? Its <b>hunter</b>.', '2. Take the hunter away → more chicks survive.', 'So <b>kiwi numbers go up</b> — which is exactly what happens in real NZ sanctuaries.'],
          a: 'Kiwi numbers go up' },
        { q: 'A poison drop kills every rat. Predict what happens to the stoats — and why real pest control removes both.',
          working: ['<b>Picture:</b> pull one thread out of the net and the whole net sags.', '1. Which way is the arrow? rat → stoat, so rats were <b>food</b> for stoats.', '2. Long term: less food → <b>fewer stoats</b>.', '3. Short term: the hungry stoats <b>switch to other prey</b> — including kiwi chicks.', 'That is why NZ projects trap stoats and rats together.'],
          a: 'Stoat numbers fall in the long run, but at first they hunt more kiwi' },
        { q: 'Why is a food web a better picture of a real bush than a single food chain?',
          working: ['<b>Picture:</b> a chain is one thread; a web is the whole net.', '1. Does a rat eat only one thing? No — seeds, weta and eggs.', '2. One chain can only show one line of that.', 'A web shows <b>all the links at once</b>, so you can see what happens when one species disappears.'],
          a: 'Because most animals eat more than one thing' },
        { q: 'What would happen to a forest with no decomposers at all?',
          working: ['<b>Picture:</b> a party with nobody to clean up, and the shop never restocked.', '1. Nothing rots, so dead leaves and animals <b>pile up</b>.', '2. The nutrients stay locked inside them, so the <b>soil runs out</b>.', '3. No nutrients means the producers fail — and everything above them fails too.'],
          a: 'Dead material piles up and the soil runs out of nutrients' },
      ],
      tips: [
        'The arrow does <b>not</b> mean "eats". It means "<b>is eaten by</b>" — it points at the eater, because that is the way the energy goes.',
        'When a species is removed, always ask <b>food or hunter?</b> Lose your food → numbers <b>down</b>. Lose your hunter → numbers <b>up</b>.',
        'Every chain starts with a plant, and every bit of the energy started at the <b>Sun</b> — even for a stoat.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [roleQ, dietQ, chainRead, chainBlank, predPrey, decomposerQ, arrowMeaning, popCalc]
        : level === 2
          ? [roleQ, dietQ, chainRead, chainBlank, arrowMeaning, webRead, predPrey, decomposerQ, energyQ, popCalc]
          : [chainRead, chainBlank, webRead, webRemove, energyQ, popCalc, roleQ, dietQ, decomposerQ, arrowMeaning];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
