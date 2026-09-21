/* Topic: Forces — pushes and pulls, force arrows, balanced vs unbalanced, mass vs weight, friction. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const FORCES = [
    { name: 'gravity', desc: 'the pull of the Earth on everything, always straight down', contact: false, pic: 'the Earth holding on to you' },
    { name: 'friction', desc: 'the force between two surfaces rubbing together that slows things down', contact: true, pic: 'sandpaper dragging' },
    { name: 'air resistance', desc: 'the air pushing back on something moving through it', contact: true, pic: 'your hand out of a car window' },
    { name: 'water resistance', desc: 'the water pushing back on something moving through it', contact: true, pic: 'trying to run in the sea' },
    { name: 'upthrust', desc: 'the upward push of the water on something floating in it', contact: true, pic: 'the water holding a boat up' },
    { name: 'tension', desc: 'the pull inside a stretched rope, string or spring', contact: true, pic: 'a tight tug-of-war rope' },
    { name: 'magnetism', desc: 'the push or pull between magnets, with nothing touching', contact: false, pic: 'a fridge magnet' },
    { name: 'a push', desc: 'a contact force that presses something away from you', contact: true, pic: 'shoving a trolley' },
    { name: 'a pull', desc: 'a contact force that drags something towards you', contact: true, pic: 'opening a heavy door' },
  ];
  const NAMES = FORCES.map((f) => f.name);

  const SITUATIONS = [
    { s: 'a skydiver falling with the parachute open', f: 'air resistance' },
    { s: 'a paper plane slowing down as it glides', f: 'air resistance' },
    { s: 'a waka slowing down when the paddlers stop', f: 'water resistance' },
    { s: 'a swimmer feeling the water push back on her', f: 'water resistance' },
    { s: 'a netball rolling to a stop on the court', f: 'friction' },
    { s: 'bike brakes squeezing the wheel rim', f: 'friction' },
    { s: 'a rock falling off a bank on the Desert Road', f: 'gravity' },
    { s: 'an apple dropping from a tree', f: 'gravity' },
    { s: 'a fridge magnet holding up a shopping list', f: 'magnetism' },
    { s: 'a compass needle swinging round to point north', f: 'magnetism' },
    { s: 'a life jacket holding you up in the sea', f: 'upthrust' },
    { s: 'a beach ball bobbing back up out of the water', f: 'upthrust' },
    { s: 'a bungy cord stretched tight at the Kawarau bridge', f: 'tension' },
    { s: 'a kite string pulled straight by the wind', f: 'tension' },
    { s: 'a dog lead going tight when the dog runs off', f: 'tension' },
  ];

  const EFFECTS = ['speed it up', 'slow it down', 'change its direction', 'change its shape'];
  const EFFECT_ITEMS = [
    { s: 'squashing a lump of plasticine flat', e: 'change its shape' },
    { s: 'stretching a rubber band', e: 'change its shape' },
    { s: 'standing on an empty drink can', e: 'change its shape' },
    { s: 'a tennis racquet hitting a ball back over the net', e: 'change its direction' },
    { s: 'the wind blowing a yacht off its course', e: 'change its direction' },
    { s: 'a magnet swinging a compass needle round', e: 'change its direction' },
    { s: 'pedalling harder on a flat road', e: 'speed it up' },
    { s: 'gravity pulling a dropped ball down', e: 'speed it up' },
    { s: 'the engine pushing a car away from the lights', e: 'speed it up' },
    { s: 'putting the brakes on a bike', e: 'slow it down' },
    { s: 'a goalkeeper catching a fast ball', e: 'slow it down' },
    { s: 'a parachute opening above a skydiver', e: 'slow it down' },
  ];

  const FRICTION = [
    { s: 'the grip of your shoes on the netball court', use: true, why: 'without it you would slip over' },
    { s: 'bike brakes gripping the wheel', use: true, why: 'the rubbing is what stops the bike' },
    { s: 'car tyres holding the road on a wet day', use: true, why: 'the grip lets the car steer and stop' },
    { s: 'striking a match on the box', use: true, why: 'the rubbing makes enough heat to light it' },
    { s: 'rubbing your hands together to warm them', use: true, why: 'friction turns movement into heat' },
    { s: 'the soles of tramping boots on a muddy track', use: true, why: 'the grip stops you sliding' },
    { s: 'a bike chain wearing thin and squeaking', use: false, why: 'the rubbing wears the metal away' },
    { s: 'the soles of your shoes wearing out', use: false, why: 'the rubbing slowly wears them down' },
    { s: 'a machine getting hot while it runs', use: false, why: 'the heat is wasted energy' },
    { s: 'a car using more petrol because the wheels drag', use: false, why: 'the engine has to work harder' },
    { s: 'a drawer that sticks and is hard to pull open', use: false, why: 'the rubbing makes it hard to move' },
  ];
  const REDUCE = [
    { s: 'put oil on a squeaky bike chain', ok: true },
    { s: 'put wheels or rollers under a heavy box', ok: true },
    { s: 'make a car a smooth, streamlined shape', ok: true },
    { s: 'polish a rough slide until it is smooth', ok: true },
    { s: 'put grip tape on the handle', ok: false },
    { s: 'use rubber tyres with deep tread', ok: false },
    { s: 'sprinkle sand on an icy path', ok: false },
  ];

  const SCENES = [
    { name: 'a boat being rowed across Lake Taupō', obj: 'boat', up: 'upthrust', down: 'weight (gravity)', right: 'the push of the oars', left: 'water resistance' },
    { name: 'a car driving along the motorway', obj: 'car', up: 'the support of the road', down: 'weight (gravity)', right: 'the push of the engine', left: 'friction and air resistance' },
    { name: 'a plane flying over the Southern Alps', obj: 'plane', up: 'lift', down: 'weight (gravity)', right: 'the thrust of the engines', left: 'air resistance' },
    { name: 'a swimmer at the school pool', obj: 'swimmer', up: 'upthrust', down: 'weight (gravity)', right: 'the push of her arms', left: 'water resistance' },
    { name: 'a cyclist on the Otago rail trail', obj: 'bike', up: 'the support of the ground', down: 'weight (gravity)', right: 'the push from pedalling', left: 'friction and air resistance' },
  ];

  const MASSES = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 45, 50, 60];
  const MOON_MASSES = [5, 10, 15, 20, 25, 30, 40, 50];
  const THINGS = ['school bag', 'watermelon', 'dog', 'bag of potatoes', 'skateboard', 'crate of feijoas', 'suitcase', 'box of books'];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const r1 = (v) => Math.round(v * 10) / 10;

  /* ---------- diagrams ---------- */
  const arrow = (x1, y1, x2, y2, col, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / L, uy = dy / L, hx = r1(x2 - ux * 12), hy = r1(y2 - uy * 12), px = r1(-uy * 7), py = r1(ux * 7);
    return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="${w || 5}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${r1(hx + px)},${r1(hy + py)} ${r1(hx - px)},${r1(hy - py)}" fill="${col}"/>`;
  };
  const HS = (v) => 26 + Math.min(v, 120) * 0.52;
  const VS = (v) => 12 + Math.min(v, 100) * 0.5;

  /** box with force arrows. o = {left,right,up,down} values (N) or label strings, caption, obj */
  function forceBox(o) {
    const vert = !!(o.up || o.down);
    const cx = 165, cy = vert ? 96 : 70, H = vert ? 200 : 152;
    const txt = (v) => (typeof v === 'number' ? v + ' N' : v);
    let s = '';
    if (o.left) { const L = HS(typeof o.left === 'number' ? o.left : 60); s += arrow(cx - 32, cy, r1(cx - 32 - L), cy, '#5F98C4') + `<text x="${r1(cx - 32 - L / 2)}" y="${cy - 13}" text-anchor="middle" fill="#3C6E96">${txt(o.left)}</text>`; }
    if (o.right) { const L = HS(typeof o.right === 'number' ? o.right : 60); s += arrow(cx + 32, cy, r1(cx + 32 + L), cy, '#E0568C') + `<text x="${r1(cx + 32 + L / 2)}" y="${cy - 13}" text-anchor="middle" fill="#C33C72">${txt(o.right)}</text>`; }
    if (o.up) { const L = VS(typeof o.up === 'number' ? o.up : 60); s += arrow(cx, cy - 26, cx, r1(cy - 26 - L), '#6FA04C') + `<text x="${cx + 9}" y="${r1(cy - 30 - L / 2)}" fill="#4E7A34">${txt(o.up)}</text>`; }
    if (o.down) { const L = VS(typeof o.down === 'number' ? o.down : 60); s += arrow(cx, cy + 26, cx, r1(cy + 26 + L), '#C98A1C') + `<text x="${cx + 9}" y="${r1(cy + 34 + L / 2)}" fill="#9A6A0F">${txt(o.down)}</text>`; }
    return `<svg viewBox="0 0 330 ${H}" width="330" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
      <rect x="${cx - 32}" y="${cy - 26}" width="64" height="52" rx="8" fill="#E8C24A" stroke="${INK}" stroke-width="3"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="${INK}" font-size="12">${o.obj || 'box'}</text>
      ${s}
      <text x="165" y="${H - 10}" text-anchor="middle" fill="${INK}" font-size="12">${o.caption || ''}</text>
    </svg>`;
  }

  /** a scene with four lettered arrows */
  function sceneBox(scene, letters) {
    return forceBox({ obj: scene.obj, left: letters.left, right: letters.right, up: letters.up, down: letters.down, caption: scene.name });
  }

  /* ---------- question makers ---------- */
  function nameForce() {
    const f = R.pick(FORCES);
    const c = choice(f.name, NAMES);
    return {
      prompt: `Which force is <b>${f.desc}</b>?`,
      answer: ans(c),
      hint: `Think of ${f.pic}.`,
      working: [`<b>Picture:</b> ${f.pic}.`, `That is <b>${f.name}</b>: ${f.desc}.`],
      finalAnswer: f.name, skill: 'naming',
    };
  }
  function forceHere() {
    const s = R.pick(SITUATIONS);
    const c = choice(s.f, NAMES);
    return {
      prompt: `Which force is mainly at work here: <b>${s.s}</b>?`,
      answer: ans(c),
      hint: 'Ask yourself: is something rubbing, falling, floating, stretched, or pushing through air or water?',
      working: [`<b>Picture:</b> ${s.s}.`, `The force doing that job is <b>${s.f}</b>.`],
      finalAnswer: s.f, skill: 'naming',
    };
  }
  function contactOrNot() {
    const f = R.pick(FORCES);
    const correct = f.contact ? 'A contact force' : 'A non-contact force';
    const c = choice(correct, ['A contact force', 'A non-contact force'], 2);
    return {
      prompt: `Is <b>${f.name}</b> a contact force or a non-contact force?`,
      answer: ans(c),
      hint: 'Only three forces work with a gap: gravity, magnetism and static electricity. Everything else has to touch.',
      working: [
        '<b>Picture:</b> can it work across a gap, like a magnet pulling a paper clip from a few cm away?',
        `1. Does ${f.name} need the two things to touch? ${f.contact ? 'Yes.' : 'No — it works across a gap.'}`,
        `So it is <b>${correct.toLowerCase()}</b>.`,
      ],
      finalAnswer: correct, skill: 'contact',
    };
  }
  function forceEffect() {
    const e = R.pick(EFFECT_ITEMS);
    const c = choice(e.e, EFFECTS);
    return {
      prompt: `What is the force doing here: <b>${e.s}</b>?`,
      answer: ans(c),
      hint: 'A force can only do three things: change speed, change direction, or change shape.',
      working: ['<b>Picture:</b> a force is a push or a pull that changes something.', `1. Is the object going faster, slower, turning, or being squashed/stretched?`, `Here the force will <b>${e.e}</b>.`],
      finalAnswer: e.e, skill: 'effects',
    };
  }
  function effectFact() {
    const c = choice('Its shape', ['Its colour', 'Its mass', 'Its temperature'], 4);
    return {
      prompt: 'A force can change how fast something goes and which way it goes. What is the <b>third</b> thing a force can change?',
      answer: ans(c),
      hint: 'Think about standing on an empty drink can.',
      working: ['<b>Picture:</b> squashing a can, stretching a rubber band.', 'A force can change <b>speed</b>, <b>direction</b> and <b>shape</b>.', 'The third one is <b>its shape</b>.'],
      finalAnswer: 'Its shape', skill: 'effects',
    };
  }
  function arrowsBalanced(level) {
    const same = R.chance(0.45);
    const a = R.step(20, 80, 10);
    const b = same ? a : R.pick([a + R.step(10, 40, 10), Math.max(10, a - R.step(10, 10, 10) * R.int(1, 3))]);
    const vertical = R.chance(0.4);
    const o = vertical ? { up: a, down: b, obj: R.pick(['balloon', 'ball', 'diver']) } : { left: a, right: b, obj: R.pick(['box', 'sledge', 'trolley']) };
    o.caption = 'the two forces on this object';
    const balanced = a === b;
    const c = choice(balanced ? 'Balanced' : 'Unbalanced', ['Balanced', 'Unbalanced'], 2);
    return {
      visual: forceBox(o),
      prompt: `Look at the force arrows. Are the forces <b>balanced</b> or <b>unbalanced</b>?`,
      answer: ans(c),
      hint: 'Balanced means the two arrows are exactly the same size and pull opposite ways.',
      working: [
        '<b>Picture:</b> a tug-of-war. If both teams pull equally hard, the rope does not move.',
        `1. One force is ${a} N, the other is ${b} N.`,
        balanced ? 'They are the same size and opposite, so they cancel out: <b>balanced</b>.' : `They are different sizes (${Math.abs(a - b)} N apart), so they do not cancel: <b>unbalanced</b>.`,
      ],
      finalAnswer: balanced ? 'Balanced' : 'Unbalanced', skill: 'balanced',
    };
  }
  function arrowsDirection() {
    const a = R.step(20, 60, 10);
    const bigger = R.chance(0.5) ? 'right' : 'left';
    const b = a + R.step(10, 40, 10);
    const left = bigger === 'left' ? b : a, right = bigger === 'left' ? a : b;
    const obj = R.pick(['box', 'sledge', 'trolley', 'crate']);
    const correct = bigger === 'right' ? 'It speeds up to the right' : 'It speeds up to the left';
    const c = choice(correct, ['It speeds up to the right', 'It speeds up to the left', 'It stays still', 'It keeps a steady speed'], 4);
    return {
      visual: forceBox({ left, right, obj, caption: 'which way does it go?' }),
      prompt: 'The forces on this object are unbalanced. What happens to it?',
      answer: ans(c),
      hint: 'The bigger arrow wins. The object speeds up in that direction.',
      working: [
        '<b>Picture:</b> tug-of-war — the stronger team drags the rope their way.',
        `1. Left force = ${left} N, right force = ${right} N.`,
        `2. The bigger one is ${b} N to the <b>${bigger}</b>.`,
        `So <b>${correct.toLowerCase()}</b>.`,
      ],
      finalAnswer: correct, skill: 'balanced',
    };
  }
  function arrowsResultant() {
    const a = R.step(20, 90, 10);
    let b = R.step(10, 80, 10);
    while (b === a) b = R.step(10, 80, 10);
    const left = a, right = b;
    const res = Math.abs(right - left);
    return {
      visual: forceBox({ left, right, obj: 'box', caption: 'work out the overall force' }),
      prompt: 'What is the <b>overall (resultant) force</b> on this box?',
      answer: { type: 'number', value: res, unit: 'N', placeholder: 'e.g. 20' },
      hint: 'The forces point opposite ways, so take the small one away from the big one.',
      working: [
        '<b>Picture:</b> a tug-of-war — only the extra pull counts.',
        `Bigger force = ${Math.max(left, right)} N, smaller force = ${Math.min(left, right)} N.`,
        `${Math.max(left, right)} − ${Math.min(left, right)} = <b>${res} N</b>, pointing ${right > left ? 'right' : 'left'}.`,
      ],
      finalAnswer: `${res} N to the ${right > left ? 'right' : 'left'}`, skill: 'resultant',
    };
  }
  function whichArrow() {
    const sc = R.pick(SCENES);
    const ltr = R.shuffle(['A', 'B', 'C', 'D']);
    const letters = { up: ltr[0], down: ltr[1], left: ltr[2], right: ltr[3] };
    const dir = R.pick(['up', 'down', 'left', 'right']);
    const forceName = sc[dir];
    const c = choice(letters[dir], ['A', 'B', 'C', 'D'], 4);
    return {
      visual: sceneBox(sc, letters),
      prompt: `In this diagram of ${sc.name}, which arrow shows <b>${forceName}</b>?`,
      answer: ans(c),
      hint: 'Decide first which way that force must point, then read off the letter.',
      working: [
        `<b>Picture:</b> ${sc.name}.`,
        `1. Which way does ${forceName} push or pull? ${dir === 'up' ? 'Upwards.' : dir === 'down' ? 'Downwards.' : dir === 'left' ? 'Backwards (to the left).' : 'Forwards (to the right).'}`,
        `That is arrow <b>${letters[dir]}</b>.`,
      ],
      finalAnswer: letters[dir], skill: 'arrows',
    };
  }
  function nameArrow() {
    const sc = R.pick(SCENES);
    const ltr = R.shuffle(['A', 'B', 'C', 'D']);
    const letters = { up: ltr[0], down: ltr[1], left: ltr[2], right: ltr[3] };
    const dir = R.pick(['up', 'down', 'left', 'right']);
    const c = choice(sc[dir], [sc.up, sc.down, sc.left, sc.right], 4);
    return {
      visual: sceneBox(sc, letters),
      prompt: `Here is ${sc.name}. What force does arrow <b>${letters[dir]}</b> show?`,
      answer: ans(c),
      hint: 'Look which way the arrow points: down is always weight, up holds the object up.',
      working: [
        `<b>Picture:</b> ${sc.name}.`,
        `1. Arrow ${letters[dir]} points ${dir === 'up' ? 'upwards' : dir === 'down' ? 'downwards' : dir === 'left' ? 'backwards' : 'forwards'}.`,
        `The force that points that way here is <b>${sc[dir]}</b>.`,
      ],
      finalAnswer: sc[dir], skill: 'arrows',
    };
  }
  function weightCalc() {
    const m = R.pick(MASSES), thing = R.pick(THINGS);
    return {
      prompt: `A ${thing} has a mass of <b>${m} kg</b>. What is its weight on Earth? (gravity = 10 N per kg)`,
      answer: { type: 'number', value: m * 10, unit: 'N', placeholder: 'e.g. 50' },
      hint: 'weight = mass × gravity. On Earth that is × 10.',
      working: ['<b>Rule:</b> weight = mass × 10 N/kg on Earth.', `${m} × 10 = <b>${m * 10} N</b>.`],
      finalAnswer: `${m * 10} N`, skill: 'weight',
    };
  }
  function massFromWeight() {
    const m = R.pick(MASSES), thing = R.pick(THINGS);
    return {
      prompt: `A ${thing} weighs <b>${m * 10} N</b> on Earth. What is its mass? (gravity = 10 N per kg)`,
      answer: { type: 'number', value: m, unit: 'kg', placeholder: 'e.g. 5' },
      hint: 'Weight = mass × 10, so go backwards: mass = weight ÷ 10.',
      working: ['<b>Rule:</b> weight = mass × 10, so mass = weight ÷ 10.', `${m * 10} ÷ 10 = <b>${m} kg</b>.`],
      finalAnswer: `${m} kg`, skill: 'weight',
    };
  }
  function moonWeight() {
    const m = R.pick(MOON_MASSES);
    return {
      prompt: `An astronaut's toolbag has a mass of <b>${m} kg</b>. What would it weigh on the <b>Moon</b>? (Moon gravity = 1.6 N per kg)`,
      answer: { type: 'number', value: Math.round(m * 1.6), unit: 'N', placeholder: 'e.g. 16' },
      hint: 'Same rule: weight = mass × gravity. Just use 1.6 instead of 10.',
      working: [
        '<b>Rule:</b> weight = mass × gravity.',
        `On the Moon gravity is only 1.6 N/kg: ${m} × 1.6 = <b>${Math.round(m * 1.6)} N</b>.`,
        `On Earth the same bag would weigh ${m * 10} N — about six times more.`,
      ],
      finalAnswer: `${Math.round(m * 1.6)} N`, skill: 'weight',
    };
  }
  function massVsWeight() {
    const q = R.pick([
      { p: 'What is <b>mass</b> measured in?', a: 'kilograms (kg)', w: ['newtons (N)', 'metres (m)', 'litres (L)'] },
      { p: 'What is <b>weight</b> measured in?', a: 'newtons (N)', w: ['kilograms (kg)', 'metres (m)', 'litres (L)'] },
      { p: 'What does <b>mass</b> tell you?', a: 'How much stuff (matter) something is made of', w: ['How hard gravity pulls on it', 'How big it looks', 'How fast it can go'] },
      { p: 'What does <b>weight</b> tell you?', a: 'How hard gravity pulls on it', w: ['How much stuff it is made of', 'How big it looks', 'How much space it takes up'] },
      { p: 'You take a 6 kg bag to the Moon. What happens to its <b>mass</b>?', a: 'It stays exactly the same', w: ['It gets about 6 times smaller', 'It becomes zero', 'It gets 6 times bigger'] },
      { p: 'You take a 6 kg bag to the Moon. What happens to its <b>weight</b>?', a: 'It gets about 6 times smaller', w: ['It stays exactly the same', 'It becomes zero', 'It gets 6 times bigger'] },
      { p: 'Which instrument measures a <b>force</b>?', a: 'A newton meter (force meter)', w: ['A thermometer', 'A measuring cylinder', 'A stopwatch'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p,
      answer: ans(c),
      hint: 'Mass = how much stuff, in kg. Weight = the pull of gravity on that stuff, in newtons.',
      working: ['<b>Picture:</b> your body has the same amount of stuff everywhere, but the Moon pulls on it far more gently.', '<b>mass</b> = kg, never changes. <b>weight</b> = newtons, changes with gravity.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'mass-weight',
    };
  }
  function frictionUseful() {
    const f = R.pick(FRICTION);
    const correct = f.use ? 'Useful' : 'A nuisance';
    const c = choice(correct, ['Useful', 'A nuisance'], 2);
    return {
      prompt: `Is friction <b>useful</b> or <b>a nuisance</b> here: ${f.s}?`,
      answer: ans(c),
      hint: 'Ask: is the rubbing helping us grip and stop, or is it wearing things out and wasting energy?',
      working: ['<b>Picture:</b> friction is grip. Grip is great on your shoes, but awful inside a machine.', `1. What is the rubbing doing? ${f.why}.`, `So here friction is <b>${correct.toLowerCase()}</b>.`],
      finalAnswer: correct, skill: 'friction',
    };
  }
  function reduceFriction() {
    const good = REDUCE.filter((x) => x.ok), bad = REDUCE.filter((x) => !x.ok);
    const g = R.pick(good);
    const c = choice(g.s, bad.map((x) => x.s), 4);
    return {
      prompt: 'Which of these would <b>reduce</b> friction?',
      answer: ans(c),
      hint: 'To reduce friction: make it smoother, add oil, or use wheels.',
      working: ['<b>Picture:</b> friction is two rough surfaces catching on each other.', 'To reduce it: <b>oil</b>, <b>wheels</b>, or a <b>smoother/streamlined</b> shape.', `So: <b>${g.s}</b>. The others all add grip.`],
      finalAnswer: g.s, skill: 'friction',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('It falls at a steady speed', ['It speeds up faster and faster', 'It slows down and stops in the air', 'It goes back upwards'], 4);
      return {
        visual: forceBox({ up: 50, down: 50, obj: 'diver', caption: 'air resistance up, weight down' }),
        prompt: 'A skydiver with her parachute open has 50 N of air resistance pushing up and 50 N of weight pulling down. What happens to her?',
        answer: ans(c),
        hint: 'Equal and opposite forces are balanced — and balanced forces never change the speed.',
        working: ['<b>Picture:</b> tug-of-war with two equal teams — nothing changes.', '1. Are the forces the same size and opposite? Yes, 50 N each.', '2. So they are <b>balanced</b>.', 'Balanced forces mean no change of speed: she <b>falls at a steady speed</b>.'],
        finalAnswer: 'She falls at a steady speed',
      };
    },
    () => {
      const m = R.pick(MOON_MASSES);
      return {
        prompt: `Harper's suitcase has a mass of <b>${m} kg</b>. How much heavier is it on Earth than on the Moon? (Earth 10 N/kg, Moon 1.6 N/kg) Give the difference in newtons.`,
        answer: { type: 'number', value: m * 10 - Math.round(m * 1.6), unit: 'N', placeholder: 'e.g. 42' },
        hint: 'Work out both weights first, then subtract.',
        working: [
          '<b>Rule:</b> weight = mass × gravity.',
          `Earth: ${m} × 10 = ${m * 10} N.`,
          `Moon: ${m} × 1.6 = ${Math.round(m * 1.6)} N.`,
          `Difference: ${m * 10} − ${Math.round(m * 1.6)} = <b>${m * 10 - Math.round(m * 1.6)} N</b>. The mass stays ${m} kg in both places.`,
        ],
        finalAnswer: `${m * 10 - Math.round(m * 1.6)} N`,
      };
    },
    () => {
      const a = R.step(200, 500, 50);
      const b = a + R.step(50, 150, 50);
      const teamA = R.chance(0.5);
      const left = teamA ? b : a, right = teamA ? a : b;
      return {
        visual: forceBox({ left, right, obj: 'rope', caption: 'tug-of-war at the school gala' }),
        prompt: `Room 9 pulls left with ${left} N and Room 10 pulls right with ${right} N. What is the resultant force on the rope?`,
        answer: { type: 'number', value: Math.abs(right - left), unit: 'N', placeholder: 'e.g. 100' },
        hint: 'Opposite directions, so subtract the smaller from the bigger.',
        working: ['<b>Picture:</b> only the extra pull moves the rope.', `${Math.max(left, right)} − ${Math.min(left, right)} = <b>${Math.abs(right - left)} N</b>.`, `The rope moves ${right > left ? 'right, so Room 10 wins' : 'left, so Room 9 wins'}.`],
        finalAnswer: `${Math.abs(right - left)} N`,
      };
    },
    () => {
      const c = choice('The big parachute — it catches more air, so there is more air resistance', ['The small parachute — it is lighter', 'They land at exactly the same time', 'The big parachute, because it is heavier'], 4);
      return {
        prompt: 'Harper drops two paper parachutes with the same weight from the same height. One canopy is big, one is small. Which lands <b>last</b>, and why?',
        answer: ans(c),
        hint: 'Air resistance depends on how much air the object has to push out of the way.',
        working: ['<b>Picture:</b> a big canopy is a big hand pushing against the air.', '1. Which one pushes against more air? The big one.', '2. More air resistance means the upward force is bigger, so it falls more slowly.', 'The <b>big parachute</b> lands last.'],
        finalAnswer: 'The big parachute — more air resistance',
      };
    },
    () => {
      const c = choice('Change the size of the parachute only', ['Change the size and drop it from higher', 'Use a heavier weight each time', 'Change who is holding the stopwatch'], 4);
      return {
        prompt: 'Harper is testing how parachute size changes the fall time. To make it a <b>fair test</b>, what should she do?',
        answer: ans(c),
        hint: 'In a fair test you change one thing and keep everything else exactly the same.',
        working: ['<b>Picture:</b> a fair race — everyone starts from the same line.', '1. What is she testing? Parachute size.', '2. So size is the only thing allowed to change.', 'Keep the height, the weight and the timer the same: <b>change the size only</b>.'],
        finalAnswer: 'Change the size of the parachute only',
      };
    },
    () => {
      const c = choice('Upthrust from the water is as big as its weight', ['Boats are always lighter than water', 'Gravity does not act on boats', 'The wind holds it up'], 4);
      return {
        visual: forceBox({ up: 60, down: 60, obj: 'boat', caption: 'a boat floating still in Milford Sound' }),
        prompt: 'A boat floats still in Milford Sound. Why does it not sink?',
        answer: ans(c),
        hint: 'Look at the two arrows on the diagram.',
        working: ['<b>Picture:</b> the water pushes up on the hull, gravity pulls down.', '1. Weight pulls down 60 N.', '2. Upthrust pushes up 60 N.', 'They are balanced, so the boat stays put: <b>upthrust equals its weight</b>.'],
        finalAnswer: 'Upthrust from the water balances its weight',
      };
    },
    () => {
      const s = R.pick([
        { s: 'a cyclist pedalling at a steady 20 km/h along a flat road', a: 'The forces are balanced', w: ['There are no forces on her', 'The forces are unbalanced forwards', 'The forces are unbalanced backwards'] },
        { s: 'a car speeding up away from the traffic lights', a: 'The forces are unbalanced forwards', w: ['The forces are balanced', 'There are no forces on it', 'The forces are unbalanced backwards'] },
        { s: 'a bus slowing down at the bus stop', a: 'The forces are unbalanced backwards', w: ['The forces are balanced', 'There are no forces on it', 'The forces are unbalanced forwards'] },
        { s: 'a book sitting still on a table', a: 'The forces are balanced', w: ['There are no forces on it', 'The forces are unbalanced downwards', 'The forces are unbalanced upwards'] },
      ]);
      const c = choice(s.a, s.w, 4);
      return {
        prompt: `Think about <b>${s.s}</b>. What can you say about the forces?`,
        answer: ans(c),
        hint: 'Steady speed or standing still = balanced. Speeding up, slowing down or turning = unbalanced.',
        working: ['<b>Picture:</b> tug-of-war. Rope still or moving steadily = equal teams.', `1. Is the speed changing? ${s.a === 'The forces are balanced' ? 'No.' : 'Yes.'}`, `So: <b>${s.a.toLowerCase()}</b>.`],
        finalAnswer: s.a,
      };
    },
    () => {
      const c = choice('Friction between the tyres and the road', ['Gravity pulling the car sideways', 'Upthrust from the road', 'Magnetism in the brakes'], 4);
      return {
        prompt: 'It is raining in Wellington and a car takes much longer to stop. Which force has got weaker?',
        answer: ans(c),
        hint: 'What is gripping the road?',
        working: ['<b>Picture:</b> wet shoes on a smooth floor — you slide.', '1. What normally stops the car? The grip of the tyres.', '2. Water makes the surfaces slide more easily.', 'So <b>friction between the tyres and the road</b> is weaker.'],
        finalAnswer: 'Friction between the tyres and the road',
      };
    },
    () => {
      const f = R.pick(FRICTION.filter((x) => !x.use));
      const c = choice('Put oil on the moving parts', ['Push harder every time', 'Add sand to the surface', 'Make the surfaces rougher'], 4);
      return {
        prompt: `In a factory, ${f.s}. What is the best way to fix that problem?`,
        answer: ans(c),
        hint: 'You want less rubbing between the surfaces.',
        working: ['<b>Picture:</b> a squeaky door hinge — one squirt of oil and it goes quiet.', `1. The problem is unwanted friction (${f.why}).`, '2. Oil keeps the surfaces apart so they slide.', 'Best fix: <b>put oil on the moving parts</b>.'],
        finalAnswer: 'Put oil on the moving parts',
      };
    },
    () => {
      const m = R.pick(MASSES);
      const c = choice(`${m} kg on both`, [`${m} kg on Earth, ${m * 10} kg on the Moon`, `${m} kg on Earth, ${r1(m / 6)} kg on the Moon`, 'It has no mass on the Moon'], 4);
      return {
        prompt: `A rock with a mass of ${m} kg is carried from Earth to the Moon. What is its <b>mass</b> in each place?`,
        answer: ans(c),
        hint: 'Mass is how much stuff there is. Did any stuff fall off on the way?',
        working: ['<b>Picture:</b> the rock is the same rock — no atoms were lost on the trip.', '1. Mass = amount of stuff → unchanged.', '2. Only its <b>weight</b> changes, because Moon gravity is weaker.', `So it is <b>${m} kg in both places</b>.`],
        finalAnswer: `${m} kg on both`,
      };
    },
    () => {
      const e = R.pick(EFFECT_ITEMS);
      const c = choice(e.e, EFFECTS, 4);
      return {
        prompt: `In PE, Harper notices this: <b>${e.s}</b>. Which of the three jobs is the force doing?`,
        answer: ans(c),
        hint: 'Speed, direction or shape — pick one.',
        working: ['<b>Picture:</b> a force is a push or a pull that changes something.', '1. Is it going faster, slower, turning, or being squashed?', `Answer: it will <b>${e.e}</b>.`],
        finalAnswer: e.e,
      };
    },
    () => {
      const c = choice('The spring stretches further each time', ['The spring gets shorter', 'The spring stays the same length', 'The spring gets heavier'], 4);
      return {
        prompt: 'Harper hangs 1 N, then 2 N, then 3 N of weights on a spring. What does she see?',
        answer: ans(c),
        hint: 'A force can change an object\'s shape.',
        working: ['<b>Picture:</b> a rubber band stretching further the harder you pull.', '1. A bigger force means a bigger change of shape.', 'So <b>the spring stretches further each time</b>. That is how a newton meter works.'],
        finalAnswer: 'The spring stretches further each time',
      };
    },
  ];

  HL.registerTopic({
    id: 'forces', subject: 'science', strand: 'physical', order: 1,
    name: 'Forces', short: 'Forces', animal: 'owl',
    blurb: 'Pushes and pulls — what they do, how we draw them, and why things speed up or stay still.',
    example: 'weight = mass × 10 · 5 kg → 50 N on Earth',
    learn: {
      what: '<p>A <b>force</b> is a push or a pull, measured in <b>newtons (N)</b>. A force can only do three things: change how fast something is going, change the direction it is going, or change its shape. We draw forces as <b>arrows</b> — the arrow points the way the force pushes, and a longer arrow means a bigger force.</p><p>If the arrows on an object cancel out, the forces are <b>balanced</b> and nothing about the motion changes. If one arrow is bigger, the forces are <b>unbalanced</b> and the object speeds up that way.</p><p><b>Picture for this topic:</b> a <b>tug-of-war</b>. Two equal teams = balanced = the rope does not move. One stronger team = unbalanced = the rope shoots their way.</p>',
      visual: `<svg viewBox="0 0 350 210" width="350" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="88" y="20" text-anchor="middle" fill="#4E7A34" font-size="14">BALANCED</text>
        <rect x="66" y="46" width="44" height="34" rx="6" fill="#E8C24A" stroke="#4A4033" stroke-width="3"/>
        ${arrow(64, 63, 24, 63, '#5F98C4', 5)}${arrow(112, 63, 152, 63, '#E0568C', 5)}
        <text x="42" y="52" text-anchor="middle" fill="#3C6E96">30 N</text>
        <text x="134" y="52" text-anchor="middle" fill="#C33C72">30 N</text>
        <text x="88" y="104" text-anchor="middle" fill="#4A4033">arrows the same size</text>
        <text x="88" y="122" text-anchor="middle" fill="#4E7A34">→ speed does not change</text>
        <line x1="176" y1="8" x2="176" y2="132" stroke="#D9CFBE" stroke-width="2"/>
        <text x="264" y="20" text-anchor="middle" fill="#C33C72" font-size="14">UNBALANCED</text>
        <rect x="248" y="46" width="44" height="34" rx="6" fill="#E8C24A" stroke="#4A4033" stroke-width="3"/>
        ${arrow(246, 63, 218, 63, '#5F98C4', 5)}${arrow(294, 63, 342, 63, '#E0568C', 6)}
        <text x="226" y="52" text-anchor="middle" fill="#3C6E96">20 N</text>
        <text x="318" y="52" text-anchor="middle" fill="#C33C72">50 N</text>
        <text x="264" y="104" text-anchor="middle" fill="#4A4033">one arrow bigger</text>
        <text x="264" y="122" text-anchor="middle" fill="#C33C72">→ speeds up that way</text>
        <rect x="10" y="140" width="330" height="62" rx="10" fill="#FBF1D3" stroke="#E8C24A" stroke-width="2"/>
        <text x="175" y="164" text-anchor="middle" fill="#4A4033" font-size="15">weight = mass × gravity</text>
        <text x="175" y="187" text-anchor="middle" fill="#9A6A0F" font-size="11">Earth (×10): 5 kg → 50 N &#183; Moon (×1.6): 5 kg → 8 N</text>
      </svg>`,
      facts: [
        'A force is a <b>push or a pull</b>, measured in <b>newtons (N)</b> with a <b>newton meter</b>.',
        'A force can change an object\'s <b>speed</b>, its <b>direction</b> or its <b>shape</b>.',
        '<b>Balanced</b> forces → still, or steady speed. <b>Unbalanced</b> forces → speeds up, slows down or turns.',
        'Non-contact forces (work across a gap): <b>gravity</b> and <b>magnetism</b>. All the rest need touching.',
        '<b>weight = mass × gravity</b>. On Earth gravity = <b>10 N per kg</b>; on the Moon only <b>1.6 N per kg</b>.',
        '<b>Mass</b> (kg) never changes. <b>Weight</b> (N) changes when gravity changes.',
      ],
      steps: [
        'Name the forces first. Ask: is anything <b>rubbing</b> (friction), <b>falling</b> (gravity), <b>floating</b> (upthrust), <b>stretched</b> (tension), or moving through <b>air/water</b> (resistance)?',
        'Draw an arrow for each force, starting at the object and pointing the way it pushes. <b>Longer arrow = bigger force.</b>',
        'Compare the opposite arrows. Same size = <b>balanced</b> → no change. Different = <b>unbalanced</b> → it speeds up towards the bigger arrow.',
        'For the overall force, <b>subtract</b> the smaller from the bigger and say which way it points.',
        'For weight, say the rule out loud: "weight = mass × 10 on Earth". Newtons come out, kilograms go in.',
      ],
      examples: [
        {
          q: 'Name the force that slows a netball rolling across the court.',
          working: ['<b>Picture:</b> the ball rubbing against the wooden floor.', '1. Are two surfaces rubbing? Yes.', '2. Rubbing that slows things down is called friction.'],
          a: 'Friction',
        },
        {
          q: 'A box has 40 N pushing right and 40 N of friction pushing left. What happens to it?',
          visual: forceBox({ left: 40, right: 40, obj: 'box', caption: 'equal arrows = balanced' }),
          working: ['<b>Picture:</b> tug-of-war with two equal teams — the rope does not budge.', '1. Are the arrows the same size? Yes, 40 N each.', '2. Are they opposite? Yes.', 'So they are <b>balanced</b> → the speed does not change.'],
          a: 'Balanced forces — it keeps the speed it already had',
        },
        {
          q: 'A sledge is pulled with 60 N to the right while friction pulls 25 N to the left. What is the resultant force, and which way does the sledge go?',
          visual: forceBox({ left: 25, right: 60, obj: 'sledge', caption: 'bigger arrow wins' }),
          working: ['<b>Picture:</b> tug-of-war — only the extra pull counts.', '1. Which arrow is bigger? The 60 N one, to the right.', '2. 60 − 25 = 35.', 'Resultant = <b>35 N to the right</b>, so the sledge speeds up to the right.'],
          a: '35 N to the right',
        },
        {
          q: 'Harper\'s school bag has a mass of 8 kg. What does it weigh on Earth?',
          working: ['<b>Rule:</b> weight = mass × gravity.', 'On Earth gravity = 10 N per kg.', '8 × 10 = 80.'],
          a: '80 N',
        },
        {
          q: 'The same 8 kg bag is taken to the Moon, where gravity is 1.6 N/kg. What is its mass and its weight there?',
          visual: `<table class="data"><tr><th></th><th>Earth</th><th>Moon</th></tr><tr><th>gravity</th><td>10 N/kg</td><td>1.6 N/kg</td></tr><tr><th>mass</th><td>8 kg</td><td>8 kg</td></tr><tr><th>weight</th><td>80 N</td><td>12.8 N</td></tr></table>`,
          working: ['<b>Picture:</b> the bag still has all the same stuff in it — nothing fell out on the way.', '1. Does mass change? No — still <b>8 kg</b>.', '2. Weight = mass × gravity = 8 × 1.6 = <b>12.8 N</b>.', 'It feels about 6 times lighter, but it is exactly as much stuff.'],
          a: 'Mass 8 kg, weight 12.8 N',
        },
        {
          q: 'A skydiver has just jumped. Weight pulls down 700 N; air resistance pushes up 300 N. What happens? Later air resistance grows to 700 N — what happens then?',
          visual: forceBox({ up: 30, down: 70, obj: 'diver', caption: 'just after the jump: weight wins' }),
          working: ['<b>Picture:</b> tug-of-war between gravity and the air.', '1. At first: 700 down vs 300 up → unbalanced, 400 N downwards, so she <b>speeds up</b>.', '2. The faster she falls, the more air she pushes, so air resistance grows.', '3. When air resistance reaches 700 N the arrows are equal → <b>balanced</b>.', 'Balanced does not mean stopped: she keeps falling at a <b>steady speed</b>.'],
          a: 'First she speeds up; once the forces balance she falls at a steady speed',
        },
        {
          q: 'Harper tests three surfaces by pulling the same shoe across each with a newton meter. Which surface has the most friction, and what should she keep the same?',
          visual: `<table class="data"><tr><th>surface</th><th>force needed</th></tr><tr><td>polished wood</td><td>3 N</td></tr><tr><td>carpet</td><td>7 N</td></tr><tr><td>rubber mat</td><td>11 N</td></tr></table>`,
          working: ['<b>Picture:</b> the harder you must pull, the more the surface grabs the shoe.', '1. Which needed the biggest pull? The rubber mat, 11 N.', '2. So the rubber mat has the <b>most friction</b>.', '3. Fair test: same shoe, same weight in it, same speed of pull — only the surface changes.'],
          a: 'The rubber mat; keep the shoe, its weight and the pulling speed the same',
        },
      ],
      tips: [
        '<b>Balanced does not mean stopped.</b> A car at a steady 50 km/h has balanced forces too — balanced just means the speed is not changing.',
        'Weight is a <b>force</b>, so it is in newtons, never kilograms. Scales say "kg" because they secretly divide by 10 for you.',
        'On the Moon your <b>mass</b> is the same — only your <b>weight</b> shrinks. Nothing fell off you on the way.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [nameForce, forceHere, forceEffect, effectFact, massVsWeight, weightCalc, arrowsBalanced, whichArrow, frictionUseful]
        : level === 2
          ? [nameForce, forceHere, contactOrNot, forceEffect, arrowsBalanced, arrowsDirection, whichArrow, nameArrow, weightCalc, massFromWeight, massVsWeight, frictionUseful, reduceFriction]
          : [forceHere, contactOrNot, arrowsDirection, arrowsResultant, nameArrow, whichArrow, massFromWeight, moonWeight, massVsWeight, reduceFriction, frictionUseful];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
