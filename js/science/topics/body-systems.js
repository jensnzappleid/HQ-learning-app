/* Topic: Body systems — digestive, circulatory and breathing systems, and how they work together.
 * Living World, order 2. Structure copied from cells.js (the exemplar). */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const DIGEST = [
    { name: 'mouth', job: 'chews food into small pieces and mixes it with saliva', pic: 'a blender', n: 1 },
    { name: 'oesophagus', job: 'squeezes the ball of food down to the stomach', pic: 'a squeezy slide' , n: 2 },
    { name: 'stomach', job: 'churns food with acid until it is a thick soup', pic: 'a washing machine full of acid', n: 3 },
    { name: 'small intestine', job: 'finishes digestion and absorbs the food into the blood', pic: 'a long velvet hose', n: 4 },
    { name: 'large intestine', job: 'takes the water back out of what is left over', pic: 'wringing out a wet towel', n: 5 },
  ];
  const HELPERS = [
    { name: 'liver', job: 'makes bile, which breaks fat into tiny droplets', pic: 'washing-up liquid on a greasy pan' },
    { name: 'pancreas', job: 'makes enzymes and squirts them into the small intestine', pic: 'a tube of glue squeezed in' },
  ];
  const ENZYMES = [
    { name: 'amylase', food: 'starch', into: 'sugar', where: 'the mouth and the small intestine' },
    { name: 'protease', food: 'protein', into: 'amino acids', where: 'the stomach and the small intestine' },
    { name: 'lipase', food: 'fat', into: 'fatty acids and glycerol', where: 'the small intestine' },
  ];
  const CIRC = [
    { name: 'heart', job: 'pumps blood all the way round the body', pic: 'the pump in a fish tank' },
    { name: 'artery', job: 'carries blood away from the heart at high pressure', pic: 'a thick fire hose' },
    { name: 'vein', job: 'carries blood back to the heart at low pressure', pic: 'a floppy hose with one-way gates' },
    { name: 'capillary', job: 'a tube one cell thick where the swap with the cells happens', pic: 'a leaky straw right beside the cells' },
  ];
  const BLOOD = [
    { name: 'red blood cells', job: 'carry oxygen around the body', pic: 'delivery vans full of oxygen' },
    { name: 'white blood cells', job: 'find and kill germs that get inside', pic: 'the security guards' },
    { name: 'platelets', job: 'clump together to make a scab and stop bleeding', pic: 'tiny sticky plasters' },
    { name: 'plasma', job: 'the yellow liquid everything else floats along in', pic: 'the river the boats float on' },
  ];
  const BREATHE = [
    { name: 'trachea', job: 'the windpipe — carries air down from your throat', pic: 'a vacuum hose with rings in it' },
    { name: 'bronchi', job: 'the two tubes that take air into each lung', pic: 'the fork in a road' },
    { name: 'lungs', job: 'hold the millions of air sacs where oxygen gets in', pic: 'two big sponges' },
    { name: 'alveoli', job: 'tiny air sacs with walls one cell thick where gases swap over', pic: 'a bunch of tiny grapes' },
    { name: 'diaphragm', job: 'the sheet of muscle under the lungs that pulls air in', pic: 'the plunger of a syringe' },
    { name: 'ribs', job: 'protect the lungs and heart, and swing out to make room for air', pic: 'a cage that can open out' },
  ];
  const NERVE = [
    { name: 'brain', job: 'the control centre — it works out what the messages mean and decides what to do', pic: 'the manager in the office' },
    { name: 'spinal cord', job: 'the thick cable of nerves down your back that carries messages to and from the brain', pic: 'the main cable running down the middle of a building' },
    { name: 'nerves', job: 'thin wires that carry electrical messages between the body and the spinal cord', pic: 'the wires reaching every room' },
    { name: 'receptor', job: 'a cell in a sense organ that detects a change and starts the message off', pic: 'a doorbell button' },
    { name: 'effector', job: 'the muscle or gland that actually carries out the response', pic: 'the person who opens the door' },
  ];
  const SENSES = [
    { sense: 'sight', organ: 'eyes', detects: 'light' },
    { sense: 'hearing', organ: 'ears', detects: 'sound' },
    { sense: 'smell', organ: 'nose', detects: 'chemicals floating in the air' },
    { sense: 'taste', organ: 'tongue', detects: 'chemicals in food and drink' },
    { sense: 'touch', organ: 'skin', detects: 'pressure, pain, heat and cold' },
  ];
  const STIMULI = [
    { stim: 'a bright torch is shone in your eyes', organ: 'eyes', resp: 'your pupils get smaller', reflex: true },
    { stim: 'you touch a hot oven tray', organ: 'skin', resp: 'you snatch your hand away', reflex: true },
    { stim: 'something flies towards your face', organ: 'eyes', resp: 'you blink', reflex: true },
    { stim: 'you step on something sharp', organ: 'skin', resp: 'you lift your foot straight up', reflex: true },
    { stim: 'you smell dinner cooking', organ: 'nose', resp: 'your mouth waters', reflex: true },
    { stim: 'a loud bang goes off behind you', organ: 'ears', resp: 'you jump and spin round', reflex: true },
    { stim: 'you taste something very sour', organ: 'tongue', resp: 'you screw your face up', reflex: false },
    { stim: 'the school bell rings', organ: 'ears', resp: 'you pack your books away', reflex: false },
    { stim: 'the crossing light turns green', organ: 'eyes', resp: 'you start walking across', reflex: false },
  ];
  const askAbout = (name) => R.pick([
    `What is the job of the <b>${name}</b>?`,
    `Which of these is the job of the <b>${name}</b>?`,
    `The <b>${name}</b> — what is it for?`,
  ]);

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ch = (correct, wrongs, n) => { const c = choice(correct, wrongs, n); return { type: 'choice', value: c.value, choices: c.choices }; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- diagrams ---------- */
  /** the gut, top to bottom. highlight = organ name (everything else greys out); labelled = draw all five labels */
  function digestSvg(highlight, labelled) {
    const c = (n, def) => (highlight ? (highlight === n ? '#E0568C' : '#E8E2D8') : def);
    const lab = (x1, y1, x2, y2, ty, t) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4A4033" stroke-width="1.5"/><text x="${x2 + 4}" y="${ty}" fill="#4A4033">${t}</text>`;
    return `<svg viewBox="0 0 300 220" width="300" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <ellipse cx="60" cy="18" rx="26" ry="12" fill="${c('mouth', '#E9A07A')}" stroke="#4A4033" stroke-width="2"/>
      <rect x="52" y="28" width="16" height="38" rx="8" fill="${c('oesophagus', '#A9D8F5')}" stroke="#4A4033" stroke-width="2"/>
      <path d="M52 64 C22 72 20 118 56 122 C86 126 100 106 92 90 C86 78 72 74 68 64 Z" fill="${c('stomach', '#E8C24A')}" stroke="#4A4033" stroke-width="2"/>
      <path d="M118 200 V146 H36 V196" fill="none" stroke="${c('large intestine', '#E9A07A')}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M92 120 V158 H62 q-12 0 -12 9 t12 9 H96 q12 0 12 9 t-12 9 H58" fill="none" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round"/>
      <path d="M92 120 V158 H62 q-12 0 -12 9 t12 9 H96 q12 0 12 9 t-12 9 H58" fill="none" stroke="${c('small intestine', '#B9A5E6')}" stroke-width="9" stroke-linecap="round"/>
      ${labelled ? [
        lab(86, 18, 140, 18, 22, 'mouth'),
        lab(68, 47, 140, 44, 48, 'oesophagus'),
        lab(94, 96, 140, 92, 96, 'stomach'),
        lab(118, 160, 140, 140, 144, 'large intestine'),
        lab(108, 185, 140, 182, 186, 'small intestine'),
      ].join('') : '<text x="212" y="108" text-anchor="middle" fill="#E0568C" font-size="13">the pink one</text>'}
    </svg>`;
  }

  /** an arrow made of straight segments, with a triangle head on the end */
  function flowArrow(pts, colour) {
    const a = pts[pts.length - 2], b = pts[pts.length - 1];
    const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]), s = 8;
    const head = dx
      ? `${b[0]},${b[1]} ${b[0] - dx * s},${b[1] - 5} ${b[0] - dx * s},${b[1] + 5}`
      : `${b[0]},${b[1]} ${b[0] - 5},${b[1] - dy * s} ${b[0] + 5},${b[1] - dy * s}`;
    return `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${colour}" stroke-width="4" stroke-linejoin="round"/><polygon points="${head}" fill="${colour}"/>`;
  }

  const BLUE = '#5F98C4', RED = '#E0568C';
  /** double circulation as a loop: body → heart → lungs → heart → body.
   *  missing = box label to replace with '?'; hiArrow = 1..4 to mark one arrow with a star */
  function flowSvg(missing, hiArrow) {
    const box = (x, y, w, h, fill, txt, key) =>
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${missing === key ? '#FFFFFF' : fill}" stroke="#4A4033" stroke-width="${missing === key ? 3 : 2}" ${missing === key ? 'stroke-dasharray="6 4"' : ''}/>` +
      `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" fill="${missing === key ? '#E0568C' : '#4A4033'}" font-size="14">${missing === key ? '?' : txt}</text>`;
    const star = (x, y, n) => (hiArrow === n ? `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#E8C24A" stroke-width="4"/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="#4A4033" font-size="13">?</text>` : '');
    return `<svg viewBox="0 0 300 212" width="300" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${box(100, 8, 100, 36, '#A9D8F5', 'LUNGS', 'LUNGS')}
      ${box(110, 82, 80, 44, '#F5C3D4', 'HEART', 'HEART')}
      ${box(100, 150, 100, 36, '#DFF0D0', 'BODY', 'BODY')}
      ${flowArrow([[100, 168], [44, 168], [44, 116], [108, 116]], BLUE)}
      ${flowArrow([[110, 92], [72, 92], [72, 26], [98, 26]], BLUE)}
      ${flowArrow([[200, 26], [256, 26], [256, 92], [192, 92]], RED)}
      ${flowArrow([[190, 116], [228, 116], [228, 168], [202, 168]], RED)}
      ${star(44, 142, 1)}${star(72, 60, 2)}${star(256, 60, 3)}${star(228, 142, 4)}
      <text x="6" y="206" fill="${BLUE}" font-size="11.5">blue = low in oxygen</text>
      <text x="294" y="206" text-anchor="end" fill="${RED}" font-size="11.5">red = full of oxygen</text>
    </svg>`;
  }

  /** one air sac beside one capillary, with the two gases swapping */
  function alveolusSvg() {
    return `<svg viewBox="0 0 300 180" width="300" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11.5" font-weight="700">
      <circle cx="80" cy="82" r="46" fill="#EAF6FD" stroke="#5F98C4" stroke-width="4"/>
      <text x="80" y="86" text-anchor="middle" fill="#4A4033" font-size="12">AIR</text>
      <rect x="146" y="18" width="34" height="128" rx="17" fill="#FBD8E4" stroke="#E0568C" stroke-width="3"/>
      ${[42, 74, 112].map((y) => `<circle cx="163" cy="${y}" r="9" fill="#E0568C"/>`).join('')}
      ${flowArrow([[128, 62], [144, 62]], '#6FA04C')}
      ${flowArrow([[144, 112], [128, 112]], '#B9A5E6')}
      <text x="188" y="58" fill="#6FA04C">oxygen</text><text x="188" y="72" fill="#6FA04C">into blood</text>
      <text x="188" y="108" fill="#8A6FD0">carbon</text><text x="188" y="122" fill="#8A6FD0">dioxide out</text>
      <text x="80" y="146" text-anchor="middle" fill="#4A4033">air sac (alveolus)</text>
      <text x="150" y="170" text-anchor="middle" fill="#4A4033">walls only one cell thick</text>
    </svg>`;
  }

  /** ribs + diaphragm, breathing in (flat) or out (domed) */
  function breathSvg(inBreath) {
    return `<svg viewBox="0 0 280 180" width="280" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="34" y="16" width="212" height="118" rx="18" fill="#FFFFFF" stroke="#4A4033" stroke-width="2.5"/>
      <rect x="132" y="4" width="14" height="26" rx="6" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
      <ellipse cx="95" cy="72" rx="${inBreath ? 40 : 32}" ry="${inBreath ? 42 : 34}" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2.5"/>
      <ellipse cx="185" cy="72" rx="${inBreath ? 40 : 32}" ry="${inBreath ? 42 : 34}" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2.5"/>
      <path d="M38 ${inBreath ? 126 : 126} Q140 ${inBreath ? 134 : 88} 242 ${inBreath ? 126 : 126}" fill="none" stroke="#E9A07A" stroke-width="7" stroke-linecap="round"/>
      <text x="140" y="152" text-anchor="middle" fill="#E9A07A">diaphragm ${inBreath ? 'pulled flat (down)' : 'domed up'}</text>
      <text x="140" y="172" text-anchor="middle" fill="#4A4033">lungs ${inBreath ? 'big' : 'small'} — is air going in or out?</text>
    </svg>`;
  }

  /** brain, spinal cord and nerves. highlight = the part drawn in pink; labelled = draw all three labels */
  function nerveSvg(highlight, labelled) {
    const c = (n, def) => (highlight ? (highlight === n ? '#E0568C' : '#E8E2D8') : def);
    const branch = (y) => `<path d="M82 ${y} q-32 -4 -52 16" fill="none" stroke="${c('nerves', '#E8C24A')}" stroke-width="4" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 300 214" width="300" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <ellipse cx="90" cy="42" rx="40" ry="30" fill="${c('brain', '#F5C3D4')}" stroke="#4A4033" stroke-width="2.5"/>
      <path d="M66 34 q10 -8 20 0 t20 0 M64 50 q12 -8 22 0 t22 0" fill="none" stroke="#4A4033" stroke-width="2" opacity=".5"/>
      <rect x="82" y="70" width="16" height="104" rx="8" fill="${c('spinal cord', '#B9A5E6')}" stroke="#4A4033" stroke-width="2"/>
      ${[92, 120, 148].map(branch).join('')}
      <path d="M90 174 q-6 18 -16 30" fill="none" stroke="${c('nerves', '#E8C24A')}" stroke-width="4" stroke-linecap="round"/>
      <line x1="34" y1="168" x2="34" y2="184" stroke="#4A4033" stroke-width="1.5"/>
      ${labelled
        ? `<line x1="128" y1="32" x2="176" y2="32" stroke="#4A4033" stroke-width="1.5"/><text x="180" y="36" fill="#4A4033">brain</text>
           <line x1="98" y1="112" x2="176" y2="102" stroke="#4A4033" stroke-width="1.5"/><text x="180" y="106" fill="#4A4033">spinal cord</text>
           <text x="34" y="198" text-anchor="middle" fill="#4A4033">nerves</text>`
        : `<text x="34" y="198" text-anchor="middle" fill="#4A4033">nerves</text>
           <text x="212" y="112" text-anchor="middle" fill="#E0568C" font-size="13">which part is pink?</text>`}
    </svg>`;
  }

  /** the message pathway as five stacked boxes. missing = 1..5 → that box shows "?" */
  function pathwaySvg(ex, missing) {
    const tags = ['stimulus', 'receptor', 'nerve', 'brain', 'response'];
    const fills = ['#E8C24A', '#DFF0D0', '#FFE6B8', '#F5C3D4', '#DCEEF9'];
    const body = [ex.stim, `${ex.organ} — receptor cells`, 'the message runs along a nerve', 'the brain decides what to do', ex.resp];
    return `<svg viewBox="0 0 300 212" width="300" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
      ${body.map((t, i) => {
        const y = 6 + i * 40, gone = missing === i + 1;
        return `<text x="72" y="${y + 21}" text-anchor="end" fill="#7A7065" font-size="10.5">${tags[i]}</text>
          <rect x="80" y="${y}" width="214" height="32" rx="8" fill="${gone ? '#FFFFFF' : fills[i]}" stroke="#4A4033" stroke-width="${gone ? 3 : 2}" ${gone ? 'stroke-dasharray="6 4"' : ''}/>
          <text x="187" y="${y + 21}" text-anchor="middle" fill="${gone ? '#E0568C' : '#4A4033'}" font-size="${gone ? 15 : 11}">${gone ? '?' : t}</text>
          ${i < 4 ? `<line x1="187" y1="${y + 32}" x2="187" y2="${y + 36}" stroke="#4A4033" stroke-width="3"/><polygon points="187,${y + 41} 182,${y + 33} 192,${y + 33}" fill="#4A4033"/>` : ''}`;
      }).join('')}
    </svg>`;
  }

  const reactTable = (vals) => `<table class="data"><tr><th>Try</th><th>Reaction time (ms)</th></tr>
    ${vals.map((v, i) => `<tr><td>${i + 1}</td><td>${v}</td></tr>`).join('')}</table>`;

  const pulseTable = (rest, run) => `<table class="data"><tr><th>When</th><th>Heart rate (bpm)</th></tr>
    <tr><td>sitting still</td><td>${rest}</td></tr><tr><td>after running</td><td>${run}</td></tr></table>`;

  /* ---------- question makers ---------- */
  function digestJob() {
    const p = R.pick(DIGEST.concat(HELPERS));
    const wrongs = DIGEST.concat(HELPERS).map((q) => q.job);
    return {
      prompt: askAbout(p.name),
      answer: ch(p.job, wrongs),
      hint: `Think of it as ${p.pic}.`,
      working: [`<b>Picture:</b> the ${p.name} is like ${p.pic}.`, `So its job is: <b>${p.job}</b>.`],
      finalAnswer: p.job, skill: 'digest',
    };
  }
  function digestOrder() {
    const i = R.int(0, DIGEST.length - 2);
    const forward = R.chance(0.65);
    const want = forward ? DIGEST[i + 1] : DIGEST[i];
    const from = forward ? DIGEST[i] : DIGEST[i + 1];
    return {
      prompt: `Food travels: mouth → oesophagus → stomach → small intestine → large intestine. Which part does food reach <b>${forward ? 'straight after' : 'just before'}</b> the <b>${from.name}</b>?`,
      answer: ch(want.name, DIGEST.map((d) => d.name)),
      hint: 'Say the order out loud: mouth, oesophagus, stomach, small intestine, large intestine.',
      working: ['<b>Picture:</b> one long tube from your mouth to the toilet.', `Find the ${from.name} in the order, then step ${forward ? 'forwards' : 'backwards'} one.`, `That gives the <b>${want.name}</b>.`],
      finalAnswer: want.name, skill: 'digest',
    };
  }
  function digestLabel(level) {
    const p = R.pick(DIGEST);
    const askJob = level >= 2 && R.chance(0.5);
    return {
      visual: digestSvg(p.name, false),
      prompt: askJob ? 'Look at the gut. What happens to the food in the <b>pink</b> part?' : 'Look at the gut. What is the <b>pink</b> part called?',
      answer: askJob ? ch(p.job, DIGEST.map((d) => d.job)) : ch(p.name, DIGEST.map((d) => d.name)),
      hint: askJob ? 'Work out which organ it is first, then remember its job.' : 'Follow the tube down from the mouth and count the parts.',
      working: [`<b>Picture:</b> the tube runs mouth → oesophagus → stomach → small intestine → large intestine.`, `The pink part is the <b>${p.name}</b>.`, askJob ? `It <b>${p.job}</b>.` : `So the answer is the ${p.name}.`],
      finalAnswer: askJob ? p.job : p.name, skill: 'digest',
    };
  }
  function enzymeQ(level) {
    const e = R.pick(ENZYMES);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `Which enzyme breaks down <b>${e.food}</b>?`,
        answer: ch(e.name, ENZYMES.map((x) => x.name).concat(['bile'])),
        hint: 'Two of the three names tell you the food: amylase → starch, lipase → fat (think lipids).',
        working: ['<b>Picture:</b> an enzyme is a pair of scissors that only cuts one kind of food.', `${e.food.charAt(0).toUpperCase() + e.food.slice(1)} is cut up by <b>${e.name}</b>.`],
        finalAnswer: e.name, skill: 'enzymes',
      };
    }
    if (form === 2) {
      return {
        prompt: `<b>${e.name.charAt(0).toUpperCase() + e.name.slice(1)}</b> breaks ${e.food} down into what?`,
        answer: ch(e.into, ENZYMES.map((x) => x.into).concat(['water and carbon dioxide'])),
        hint: 'Big food molecule in, small molecules out.',
        working: ['<b>Picture:</b> a Lego model being pulled apart into single bricks.', `${e.name} cuts <b>${e.food}</b> into <b>${e.into}</b>.`],
        finalAnswer: e.into, skill: 'enzymes',
      };
    }
    return {
      prompt: `Why does food have to be broken into really small pieces before it is any use?`,
      answer: ch('So it is small enough to pass through the gut wall into the blood', ['So it tastes better', 'So it can be stored in the stomach', 'So it weighs less'], 4),
      hint: 'Think about the tiny holes in the wall of the small intestine.',
      working: ['<b>Picture:</b> a big beanbag will not fit through a letterbox — you have to empty the beans out first.', 'Only tiny molecules fit through the gut wall.', 'So food is digested <b>so it is small enough to be absorbed into the blood</b>.'],
      finalAnswer: 'So it is small enough to pass through the gut wall into the blood', skill: 'enzymes',
    };
  }
  function absorbQ(level) {
    const forms = [
      { p: 'Where is digested food <b>absorbed</b> into the blood?', a: 'the small intestine', w: ['the stomach', 'the mouth', 'the large intestine'], r: 'Its walls are covered in millions of tiny villi that reach into the food.' },
      { p: 'The small intestine is lined with millions of tiny finger-shaped bumps. What are they for?', a: 'They give a huge surface for absorbing food', w: ['They grip the food so it cannot slide out', 'They make acid', 'They chew the food'], r: 'More surface means more food absorbed each second.' },
      { p: 'What does the <b>large intestine</b> take back out of the leftovers?', a: 'water', w: ['oxygen', 'protein', 'acid'], r: 'That is why you get thirsty if you have an upset tummy.' },
      { p: 'Where does digested food go once it is absorbed?', a: 'into the blood, which carries it to every cell', w: ['back into the stomach', 'into the lungs to be breathed out', 'straight into the muscles through the skin'], r: 'The blood is the delivery service.' },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w),
      hint: f.r,
      working: ['<b>Picture:</b> the small intestine is a long velvet hose — the velvet is millions of villi.', f.r, `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'absorb',
    };
  }
  function circJob() {
    const p = R.pick(CIRC);
    return {
      prompt: askAbout(p.name),
      answer: ch(p.job, CIRC.map((q) => q.job)),
      hint: `Think of it as ${p.pic}.`,
      working: [`<b>Picture:</b> the ${p.name} is like ${p.pic}.`, `So: <b>${p.job}</b>.`],
      finalAnswer: p.job, skill: 'circulation',
    };
  }
  function vesselQ() {
    const forms = [
      { p: 'Which blood vessel carries blood <b>away from</b> the heart?', a: 'artery', w: ['vein', 'capillary'], r: 'A for Artery, A for Away.' },
      { p: 'Which blood vessel carries blood <b>back to</b> the heart?', a: 'vein', w: ['artery', 'capillary'], r: 'Veins have valves so blood cannot slip backwards.' },
      { p: 'Which blood vessel has a wall only <b>one cell thick</b>?', a: 'capillary', w: ['artery', 'vein'], r: 'It has to be thin so oxygen can step straight across into the cell.' },
      { p: 'Why do <b>arteries</b> have thick muscly walls?', a: 'The blood in them is at high pressure straight from the heart', w: ['They carry more blood than veins', 'They are closer to the skin', 'They have to hold valves inside'], r: 'The heart squeezes hard, so the pipe must be strong.' },
      { p: 'Why do <b>veins</b> have valves inside them?', a: 'To stop the blood sliding backwards', w: ['To speed the blood up', 'To take oxygen out of the blood', 'To make new blood cells'], r: 'The pressure is low by the time blood gets back, so it needs one-way gates.' },
      { p: 'Where does the swap of oxygen and food into the cells actually happen?', a: 'in the capillaries', w: ['in the arteries', 'in the veins', 'in the heart'], r: 'Only the capillary wall is thin enough.' },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, f.w.length + 1),
      hint: f.r,
      working: ['<b>Picture:</b> artery = thick fire hose, vein = floppy hose with gates, capillary = leaky straw.', f.r, `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'circulation',
    };
  }
  function bloodQ() {
    const b = R.pick(BLOOD);
    if (R.chance(0.5)) {
      return {
        prompt: `What do <b>${b.name}</b> do?`,
        answer: ch(b.job, BLOOD.map((x) => x.job)),
        hint: `Think of them as ${b.pic}.`,
        working: [`<b>Picture:</b> ${b.name} are ${b.pic}.`, `So they <b>${b.job}</b>.`],
        finalAnswer: b.job, skill: 'blood',
      };
    }
    return {
      prompt: `Which part of the blood does this job: <b>${b.job}</b>?`,
      answer: ch(b.name, BLOOD.map((x) => x.name)),
      hint: `Picture ${b.pic}.`,
      working: [`<b>Picture:</b> ${b.pic}.`, `That is the job of the <b>${b.name}</b>.`],
      finalAnswer: b.name, skill: 'blood',
    };
  }
  function heartFlowBox(level) {
    const which = R.pick(['LUNGS', 'HEART', 'BODY']);
    const wants = { LUNGS: 'lungs', HEART: 'heart', BODY: 'body' };
    const why = { LUNGS: 'because that is where blood picks up oxygen and drops off carbon dioxide', HEART: 'because every trip starts and ends with the pump', BODY: 'because that is where the oxygen gets used up' };
    return {
      visual: flowSvg(which, 0),
      prompt: `Follow the arrows round the circulation. What belongs in the <b>dotted box</b>?`,
      answer: ch(wants[which], ['lungs', 'heart', 'body', 'stomach'], 4),
      hint: 'Blood always goes body → heart → lungs → heart → body.',
      working: ['<b>Picture:</b> a figure-of-eight racetrack with the heart at the crossing point.', 'The order is body → heart → lungs → heart → body.', `The missing box is the <b>${wants[which]}</b>, ${why[which]}.`],
      finalAnswer: wants[which], skill: 'circulation',
    };
  }
  function heartFlowArrow(level) {
    const n = R.int(1, 4);
    const info = {
      1: { from: 'body', to: 'heart', ox: 'low in oxygen', why: 'the body cells have just used the oxygen up' },
      2: { from: 'heart', to: 'lungs', ox: 'low in oxygen', why: 'it has not reached the lungs yet' },
      3: { from: 'lungs', to: 'heart', ox: 'full of oxygen', why: 'it has just been past the air sacs' },
      4: { from: 'heart', to: 'body', ox: 'full of oxygen', why: 'it is on its way to deliver oxygen to the cells' },
    }[n];
    const askOx = R.chance(0.55);
    return {
      visual: flowSvg(null, n),
      prompt: askOx ? 'Look at the arrow marked <b>?</b>. Is that blood full of oxygen or low in oxygen?' : 'Look at the arrow marked <b>?</b>. Where is that blood going <b>to</b>?',
      answer: askOx ? ch(info.ox, ['low in oxygen', 'full of oxygen', 'it has no oxygen at all'], 3) : ch(info.to, ['lungs', 'heart', 'body'], 3),
      hint: askOx ? 'Blood is only refilled with oxygen at the lungs, and only emptied at the body.' : 'Trace the arrow with your finger from its tail to its point.',
      working: ['<b>Picture:</b> a figure-of-eight racetrack: body → heart → lungs → heart → body.', `That arrow runs from the <b>${info.from}</b> to the <b>${info.to}</b>.`, askOx ? `So the blood is <b>${info.ox}</b> — ${info.why}.` : `So it is going to the <b>${info.to}</b>.`],
      finalAnswer: askOx ? info.ox : info.to, skill: 'circulation',
    };
  }
  function breatheJob() {
    const p = R.pick(BREATHE);
    if (R.chance(0.5)) {
      return {
        prompt: askAbout(p.name),
        answer: ch(p.job, BREATHE.map((q) => q.job)),
        hint: `Think of it as ${p.pic}.`,
        working: [`<b>Picture:</b> the ${p.name} is like ${p.pic}.`, `So: <b>${p.job}</b>.`],
        finalAnswer: p.job, skill: 'breathing',
      };
    }
    return {
      prompt: `Which part of the breathing system is like <b>${p.pic}</b>?`,
      answer: ch(p.name, BREATHE.map((q) => q.name)),
      hint: p.job,
      working: [`That part ${p.job}.`, `So it is the <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'breathing',
    };
  }
  function gasSwap(level) {
    const forms = [
      { p: 'Which gas moves <b>from the air sac into the blood</b>?', a: 'oxygen', w: ['carbon dioxide', 'nitrogen', 'water vapour'] },
      { p: 'Which gas moves <b>from the blood into the air sac</b>?', a: 'carbon dioxide', w: ['oxygen', 'nitrogen', 'hydrogen'] },
      { p: 'Why are the walls of the air sacs <b>only one cell thick</b>?', a: 'So gases can cross over quickly', w: ['So the lungs weigh less', 'So germs cannot get in', 'So the sacs can hold more air'] },
      { p: 'Why are there millions of tiny air sacs instead of two big bags?', a: 'Millions of small sacs give a much bigger surface for swapping gases', w: ['Small sacs are stronger', 'Small sacs warm the air up', 'Big bags would not fit in the chest'] },
    ];
    const f = R.pick(forms);
    return {
      visual: alveolusSvg(),
      prompt: f.p,
      answer: ch(f.a, f.w),
      hint: 'Fresh air is full of oxygen; the blood coming back is full of carbon dioxide. Each gas moves to where there is less of it.',
      working: ['<b>Picture:</b> a bunch of tiny grapes with a blood pipe wrapped round them.', 'Oxygen crosses <b>into</b> the blood; carbon dioxide crosses <b>out</b> into the air.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'gas-exchange',
    };
  }
  function diaphragmQ(level) {
    const inB = R.chance(0.5);
    const forms = [
      { p: 'Look at the diagram. Is this person breathing <b>in</b> or <b>out</b>?', a: () => (inB ? 'in' : 'out'), w: ['in', 'out'], n: 2 },
      { p: 'Look at the diagram. What is the <b>diaphragm</b> doing?', a: () => (inB ? 'It has pulled flat and down, making the chest bigger' : 'It has relaxed back up into a dome, making the chest smaller'), w: ['It has pulled flat and down, making the chest bigger', 'It has relaxed back up into a dome, making the chest smaller', 'It has stopped moving completely'], n: 3 },
      { p: 'Look at the diagram. What are the <b>ribs</b> doing at this moment?', a: () => (inB ? 'moving up and out' : 'moving down and in'), w: ['moving up and out', 'moving down and in', 'staying completely still'], n: 3 },
    ];
    const f = R.pick(forms);
    const a = f.a();
    return {
      visual: breathSvg(inB),
      prompt: f.p,
      answer: ch(a, f.w, f.n),
      hint: 'Bigger chest = lower pressure = air rushes IN. Smaller chest = air pushed OUT.',
      working: ['<b>Picture:</b> the chest is a syringe. Pull the plunger down and air rushes in.', `Here the diaphragm is <b>${inB ? 'flat and low' : 'domed up high'}</b> and the lungs are <b>${inB ? 'big' : 'small'}</b>.`, `So the person is breathing <b>${inB ? 'in' : 'out'}</b>, and the answer is <b>${a}</b>.`],
      finalAnswer: a, skill: 'breathing',
    };
  }
  function togetherQ() {
    const forms = [
      { p: 'Your cells need two things delivered before they can release energy. What are they?', a: 'glucose and oxygen', w: ['carbon dioxide and water', 'protein and water', 'oxygen and carbon dioxide'] },
      { p: 'Which system gets the <b>glucose</b> into the blood?', a: 'the digestive system', w: ['the breathing system', 'the circulatory system', 'the nervous system'] },
      { p: 'Which system gets the <b>oxygen</b> into the blood?', a: 'the breathing system', w: ['the digestive system', 'the circulatory system', 'the skeletal system'] },
      { p: 'Which system <b>delivers</b> the glucose and the oxygen to every cell?', a: 'the circulatory system', w: ['the digestive system', 'the breathing system', 'the muscular system'] },
      { p: 'Releasing energy from glucose inside a cell has a name. What is it?', a: 'respiration', w: ['photosynthesis', 'digestion', 'circulation'] },
      { p: 'Which two waste products does respiration make, that the blood has to carry away?', a: 'carbon dioxide and water', w: ['oxygen and glucose', 'glucose and water', 'carbon dioxide and oxygen'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w),
      hint: 'glucose (from food) + oxygen (from air) → energy, and the blood is the courier.',
      working: ['<b>Picture:</b> the gut and the lungs are two loading bays; the blood is the courier van; every cell is a house waiting for a delivery.', 'glucose + oxygen → energy + carbon dioxide + water.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'together',
    };
  }
  function pulseCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const beats = R.int(15, 30);
      return {
        prompt: `Harper counts <b>${beats}</b> heartbeats in 15 seconds. What is her heart rate in <b>beats per minute</b>?`,
        answer: { type: 'number', value: beats * 4, unit: 'bpm' },
        hint: 'There are four lots of 15 seconds in a minute.',
        working: ['15 seconds × 4 = 60 seconds = 1 minute.', `So multiply the beats by 4: ${beats} × 4 = <b>${beats * 4}</b>.`],
        finalAnswer: `${beats * 4} beats per minute`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const rate = R.int(12, 20), mins = R.int(3, 9);
      return {
        prompt: `Harper takes <b>${rate}</b> breaths a minute while she is resting. How many breaths is that in <b>${mins} minutes</b>?`,
        answer: { type: 'number', value: rate * mins, unit: 'breaths' },
        hint: 'Breaths per minute × number of minutes.',
        working: [`${rate} breaths every minute, for ${mins} minutes.`, `${rate} × ${mins} = <b>${rate * mins}</b> breaths.`],
        finalAnswer: `${rate * mins} breaths`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const rest = R.int(60, 80), run = R.int(120, 165);
      return {
        visual: pulseTable(rest, run),
        prompt: `Look at the table. How much <b>higher</b> is Harper's heart rate after running?`,
        answer: { type: 'number', value: run - rest, unit: 'bpm' },
        hint: 'Take the resting rate away from the running rate.',
        working: ['<b>Picture:</b> running muscles need more oxygen, so the pump speeds up.', `${run} − ${rest} = <b>${run - rest}</b> beats per minute higher.`],
        finalAnswer: `${run - rest} bpm`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const perBeat = R.pick([60, 70, 80]), beats = R.pick([10, 20, 50, 100]);
      return {
        prompt: `Each beat, the heart pushes out <b>${perBeat} mL</b> of blood. How much blood is that in <b>${beats}</b> beats?`,
        answer: { type: 'number', value: perBeat * beats, unit: 'mL' },
        hint: 'Volume per beat × number of beats.',
        working: [`${perBeat} mL every beat, ${beats} beats.`, `${perBeat} × ${beats} = <b>${perBeat * beats}</b> mL.`],
        finalAnswer: `${perBeat * beats} mL`, skill: 'numbers',
      };
    }
    const inO = 21, outO = R.pick([15, 16, 17]);
    return {
      prompt: `Air breathed <b>in</b> is ${inO}% oxygen. Air breathed <b>out</b> is ${outO}% oxygen. What percentage of the oxygen was taken into the blood?`,
      answer: { type: 'number', value: inO - outO, unit: '%' },
      hint: 'How much oxygen went missing between going in and coming out?',
      working: ['<b>Picture:</b> a bag of 21 lollies goes in and a bag of ' + outO + ' comes out.', `${inO} − ${outO} = <b>${inO - outO}</b>%.`, 'Notice most of the oxygen is breathed straight back out again.'],
      finalAnswer: `${inO - outO}%`, skill: 'numbers',
    };
  }

  function nerveJob() {
    const p = R.pick(NERVE);
    if (R.chance(0.5)) {
      return {
        prompt: askAbout(p.name),
        answer: ch(p.job, NERVE.map((q) => q.job)),
        hint: `Think of it as ${p.pic}.`,
        working: [`<b>Picture:</b> the nervous system is a building full of wires. The ${p.name} is ${p.pic}.`, `So its job is: <b>${p.job}</b>.`],
        finalAnswer: p.job, skill: 'nervous',
      };
    }
    return {
      prompt: `Which part of the message system is like <b>${p.pic}</b>?`,
      answer: ch(p.name, NERVE.map((q) => q.name)),
      hint: p.job,
      working: [`That part is ${p.job}.`, `So it is the <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'nervous',
    };
  }
  function nerveLabel(level) {
    const p = R.pick([NERVE[0], NERVE[1], NERVE[2]]);
    const askJob = level >= 2 && R.chance(0.45);
    return {
      visual: nerveSvg(p.name, false),
      prompt: askJob ? 'Look at the message system. What does the <b>pink</b> part do?' : 'Look at the message system. What is the <b>pink</b> part called?',
      answer: askJob ? ch(p.job, NERVE.map((q) => q.job)) : ch(p.name, NERVE.map((q) => q.name)),
      hint: askJob ? 'Work out which part it is first, then remember its job.' : 'Brain at the top, spinal cord down the back, nerves branching out to everywhere else.',
      working: ['<b>Picture:</b> the brain is the manager, the spinal cord is the main cable, the nerves are the wires to every room.', `The pink part is the <b>${p.name}</b>.`, askJob ? `It is <b>${p.job}</b>.` : `So the answer is the ${p.name}.`],
      finalAnswer: askJob ? p.job : p.name, skill: 'nervous',
    };
  }
  function senseQ(level) {
    const s = R.pick(SENSES);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `Which sense organ do you use for <b>${s.sense}</b>?`,
        answer: ch(s.organ, SENSES.map((x) => x.organ), 5),
        hint: `It is the organ that detects ${s.detects}.`,
        working: [`${cap(s.sense)} means detecting <b>${s.detects}</b>.`, `The organ for that is the <b>${s.organ}</b>.`],
        finalAnswer: s.organ, skill: 'senses',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which sense do your <b>${s.organ}</b> give you?`,
        answer: ch(s.sense, SENSES.map((x) => x.sense), 5),
        hint: `They detect ${s.detects}.`,
        working: [`Your ${s.organ} detect <b>${s.detects}</b>.`, `That sense is <b>${s.sense}</b>.`],
        finalAnswer: s.sense, skill: 'senses',
      };
    }
    return {
      prompt: `What do the receptor cells in your <b>${s.organ}</b> detect?`,
      answer: ch(s.detects, SENSES.map((x) => x.detects), 5),
      hint: 'A receptor only detects one kind of change.',
      working: ['<b>Picture:</b> each sense organ is a different kind of doorbell button.', `The receptors in your ${s.organ} detect <b>${s.detects}</b>.`],
      finalAnswer: s.detects, skill: 'senses',
    };
  }
  function pathwayQ(level) {
    const ex = R.pick(STIMULI);
    const missing = level === 1 ? R.pick([2, 5]) : R.int(2, 5);
    const right = { 2: `the ${ex.organ}`, 3: 'a nerve', 4: 'the brain', 5: ex.resp }[missing];
    const wrongs = { 2: SENSES.map((x) => `the ${x.organ}`), 3: ['a nerve', 'an artery', 'the windpipe', 'a bone'], 4: ['the brain', 'the stomach', 'the heart', 'the lungs'], 5: STIMULI.map((x) => x.resp) }[missing];
    return {
      visual: pathwaySvg(ex, missing),
      prompt: `Follow the message down the chain. What belongs in the <b>dotted box</b>?`,
      answer: ch(right, wrongs, 4),
      hint: 'The chain is always: stimulus → receptor → nerve → brain → response.',
      working: [
        '<b>Picture:</b> a doorbell. Someone presses the button (stimulus), the wire carries it, the person inside decides, and the door opens.',
        `1. The stimulus here is: ${ex.stim}.`,
        `2. Which sense organ picks that up? The <b>${ex.organ}</b>.`,
        `So the missing box is <b>${right}</b>.`,
      ],
      finalAnswer: right, skill: 'pathway',
    };
  }
  function pathwayOrderQ() {
    const chain = ['stimulus', 'receptor', 'nerve', 'brain', 'response'];
    const i = R.int(0, 3);
    const forward = R.chance(0.7);
    const want = forward ? chain[i + 1] : chain[i];
    const from = forward ? chain[i] : chain[i + 1];
    return {
      prompt: `The message path is: stimulus → receptor → nerve → brain → response. What comes <b>${forward ? 'straight after' : 'just before'}</b> the <b>${from}</b>?`,
      answer: ch(want, chain, 4),
      hint: 'Say the chain out loud: stimulus, receptor, nerve, brain, response.',
      working: ['<b>Picture:</b> a doorbell: press the button → the wire → the person inside → the door opens.', `Find "${from}" in the chain, then step ${forward ? 'forwards' : 'backwards'} one.`, `That gives the <b>${want}</b>.`],
      finalAnswer: want, skill: 'pathway',
    };
  }
  function stimulusQ(level) {
    const ex = R.pick(STIMULI);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `<b>Stimulus:</b> ${ex.stim}. Which sense organ picks it up?`,
        answer: ch(ex.organ, SENSES.map((x) => x.organ), 5),
        hint: 'Ask what kind of change it is: light, sound, a smell, a taste or a touch.',
        working: ['<b>Picture:</b> each sense organ is a different doorbell button.', `1. What kind of change is it? ${cap(ex.stim)}.`, `2. That is picked up by the <b>${ex.organ}</b>.`],
        finalAnswer: ex.organ, skill: 'pathway',
      };
    }
    if (form === 2) {
      return {
        prompt: `<b>Stimulus:</b> ${ex.stim}. What is the <b>response</b>?`,
        answer: ch(ex.resp, STIMULI.map((x) => x.resp)),
        hint: 'The response is what your body actually does about it.',
        working: [`<b>Picture:</b> stimulus → receptor → nerve → brain → response.`, `1. The change is: ${ex.stim}.`, `2. What does the body do? <b>${ex.resp}</b>.`],
        finalAnswer: ex.resp, skill: 'pathway',
      };
    }
    return {
      prompt: `"${cap(ex.stim)}, and ${ex.resp}." Is that a <b>reflex</b> or something you <b>chose</b> to do?`,
      answer: ch(ex.reflex ? 'a reflex — it happens automatically' : 'something you chose to do', ['a reflex — it happens automatically', 'something you chose to do'], 2),
      hint: 'Did you have to think about it first?',
      working: [
        '<b>Picture:</b> a reflex is your hand leaving the hot tray before your brain has even said "ouch".',
        `1. Did you have to decide to do it? <b>${ex.reflex ? 'No.' : 'Yes.'}</b>`,
        `So it is <b>${ex.reflex ? 'a reflex' : 'a chosen action'}</b>.`,
      ],
      finalAnswer: ex.reflex ? 'a reflex — it happens automatically' : 'something you chose to do', skill: 'reflex',
    };
  }
  function reflexQ(level) {
    const forms = [
      { p: 'What is a <b>reflex</b>?', a: 'An automatic response that happens without you thinking about it', w: ['A message that never reaches a muscle', 'Something you practise until it is fast', 'A very fast decision made by the brain'] },
      { p: 'Why is a reflex so much faster than a normal response?', a: 'The message takes a short cut through the spinal cord instead of going up to the brain first', w: ['Reflex nerves are made of a different material', 'The muscles move before the message arrives', 'Reflexes do not need any nerves'] },
      { p: 'Why are reflexes useful?', a: 'They protect you from damage before you have had time to think', w: ['They save energy', 'They make your muscles stronger', 'They stop you feeling anything at all'] },
      { p: 'You pull your hand off a hot tray. What is the <b>effector</b>?', a: 'the muscle in your arm', w: ['the skin on your hand', 'the spinal cord', 'the hot tray'] },
      { p: 'You pull your hand off a hot tray. What is the <b>receptor</b>?', a: 'the receptor cells in the skin of your hand', w: ['the muscle in your arm', 'the brain', 'the nerve'] },
      { p: 'Does your brain ever find out about a reflex?', a: 'Yes, but only just after your body has already moved', w: ['No, the brain never finds out', 'Yes, and it decides what to do first', 'Only if you were looking at the time'] },
      { p: 'Which of these is a reflex?', a: 'blinking when something flies at your face', w: ['waving at a friend', 'writing your name', 'kicking a netball on purpose'] },
      { p: 'Which part of the nervous system handles a reflex on its own?', a: 'the spinal cord', w: ['the brain', 'the heart', 'the skin'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'A reflex turns round in the spinal cord — the brain only hears about it afterwards.',
      working: ['<b>Picture:</b> your hand leaves the hot tray before your brain has even said "ouch".', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'reflex',
    };
  }
  function moveTogetherQ() {
    const forms = [
      { p: 'Which system carries the message that tells a muscle to move?', a: 'the nervous system', w: ['the digestive system', 'the breathing system', 'the circulatory system'] },
      { p: 'What does a muscle do when the message from the nerve arrives?', a: 'It contracts — it gets shorter and pulls on a bone', w: ['It pushes the bone away', 'It gets longer and pushes', 'It turns the bone into energy'] },
      { p: 'Why do muscles have to work in <b>pairs</b>?', a: 'A muscle can only pull, never push, so another one is needed to pull the bone back', w: ['One muscle would get too tired', 'One muscle pulls and the other pushes', 'Bones need two messages before they move'] },
      { p: 'Which bone protects the <b>brain</b>?', a: 'the skull', w: ['the ribs', 'the backbone', 'the pelvis'] },
      { p: 'Which bones protect the <b>spinal cord</b>?', a: 'the backbone (the vertebrae)', w: ['the skull', 'the ribs', 'the leg bones'] },
      { p: 'Put these in order for kicking a ball: muscle contracts, brain decides, nerve carries the message, bone moves.', a: 'brain decides → nerve carries the message → muscle contracts → bone moves', w: ['muscle contracts → bone moves → nerve carries the message → brain decides', 'nerve carries the message → brain decides → bone moves → muscle contracts', 'bone moves → muscle contracts → brain decides → nerve carries the message'] },
      { p: 'Moving your arm needs three systems working together. Which three?', a: 'nervous, muscular and skeletal', w: ['nervous, digestive and breathing', 'muscular, digestive and circulatory', 'skeletal, breathing and digestive'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'The nerve carries the order, the muscle pulls, and the bone is the lever that moves.',
      working: ['<b>Picture:</b> a puppet — the nerve is the string, the muscle is the hand pulling it, and the bone is the wooden arm that swings.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'move',
    };
  }
  function reactionQ(level) {
    const base = R.int(16, 26) * 10;
    const vals = R.shuffle([base - 20, base, base + 20]);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 4);
    if (form === 1) {
      return {
        visual: reactTable(vals),
        prompt: 'Harper catches a dropped ruler three times. What is her <b>mean</b> reaction time?',
        answer: { type: 'number', value: base, unit: 'ms' },
        hint: 'Add the three times, then divide by 3.',
        working: [`${vals.join(' + ')} = ${vals[0] + vals[1] + vals[2]}.`, `${vals[0] + vals[1] + vals[2]} ÷ 3 = <b>${base}</b> ms.`],
        finalAnswer: `${base} ms`, skill: 'reaction',
      };
    }
    if (form === 2) {
      return {
        visual: reactTable(vals),
        prompt: 'Look at the table. What is the <b>range</b> of Harper’s three times (biggest − smallest)?',
        answer: { type: 'number', value: 40, unit: 'ms' },
        hint: 'Take the smallest time away from the biggest one.',
        working: [`Biggest: ${base + 20}. Smallest: ${base - 20}.`, `${base + 20} − ${base - 20} = <b>40</b> ms.`],
        finalAnswer: '40 ms', skill: 'reaction',
      };
    }
    if (form === 3) {
      return {
        visual: reactTable(vals),
        prompt: 'Why does Harper do the ruler drop <b>three times</b> instead of once?',
        answer: ch('One try could be a fluke — the mean of several is more reliable', ['To make her reaction time get faster', 'Because the ruler changes length', 'So she can pick her best result'], 4),
        hint: 'A fair test needs repeats, then a mean.',
        working: ['<b>Picture:</b> one shot at goal tells you nothing; ten shots tell you how good you are.', '1. Any single try can go oddly well or oddly badly.', '2. Repeating and taking the <b>mean</b> smooths that out.', 'Never just pick the best one — that is not honest data.'],
        finalAnswer: 'One try could be a fluke — the mean of several is more reliable', skill: 'reaction',
      };
    }
    return {
      visual: reactTable(vals),
      prompt: 'Harper wants to test whether reaction time is slower when she is tired. What must she keep the <b>same</b>?',
      answer: ch('The same person, same hand, ruler held at the same place, no countdown', ['The time of day only', 'The colour of the ruler only', 'Nothing — reaction time is always the same'], 4),
      hint: 'A fair test changes ONE thing and keeps everything else the same.',
      working: [
        '<b>Picture:</b> two runners in a race — same track, same distance, or it is not fair.',
        '1. What is she changing? Whether she is tired.',
        '2. So everything else must match: same catcher, same hand, same starting position, no warning.',
        '3. And repeat several times and take the mean.',
      ],
      finalAnswer: 'The same person, same hand, ruler held at the same place, no countdown', skill: 'reaction',
    };
  }
  function nerveCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 4);
    if (form === 1) {
      const base = R.int(15, 28) * 10;
      const vals = [base - 30, base, base + 30];
      return {
        prompt: `Harper's three reaction times were <b>${vals.join(' ms, ')} ms</b>. What is the mean?`,
        answer: { type: 'number', value: base, unit: 'ms' },
        hint: 'Add them all up, then divide by 3.',
        working: [`${vals.join(' + ')} = ${vals[0] + vals[1] + vals[2]}.`, `${vals[0] + vals[1] + vals[2]} ÷ 3 = <b>${base}</b> ms.`],
        finalAnswer: `${base} ms`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const before = R.int(20, 30) * 10, drop = R.pick([20, 40, 60]);
      return {
        prompt: `Awake, Harper's reaction time is <b>${before} ms</b>. Tired, it is <b>${before + drop} ms</b>. How much <b>slower</b> is she when tired?`,
        answer: { type: 'number', value: drop, unit: 'ms' },
        hint: 'Take the awake time away from the tired time.',
        working: [`${before + drop} − ${before} = <b>${drop}</b> ms slower.`],
        finalAnswer: `${drop} ms`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const speed = 100, secs = R.pick([2, 3, 4, 5]);
      return {
        prompt: `A message travels along the fastest nerves at about <b>${speed} m/s</b>. How far would it travel in <b>${secs} seconds</b>?`,
        answer: { type: 'number', value: speed * secs, unit: 'm' },
        hint: 'distance = speed × time.',
        working: [`${speed} × ${secs} = <b>${speed * secs}</b> m.`, 'That is why a message from your toe reaches your brain almost instantly.'],
        finalAnswer: `${speed * secs} m`, skill: 'numbers',
      };
    }
    const tries = R.pick([4, 5, 8, 10]), total = tries * R.int(18, 26) * 10;
    return {
      prompt: `Harper did the ruler drop <b>${tries}</b> times. Her times added up to <b>${total} ms</b>. What was her mean reaction time?`,
      answer: { type: 'number', value: total / tries, unit: 'ms' },
      hint: 'Mean = total ÷ number of tries.',
      working: [`${total} ÷ ${tries} = <b>${total / tries}</b> ms.`],
      finalAnswer: `${total / tries} ms`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const d = R.pick(DIGEST);
      return {
        visual: digestSvg(d.name, false),
        prompt: `Harper eats a slice of toast. Trace it through the gut. When it reaches the <b>pink</b> organ, what is happening to it there?`,
        answer: ch(d.job, DIGEST.map((x) => x.job)),
        hint: 'Name the pink organ first, then say its job.',
        working: ['<b>Picture:</b> one long tube — mouth, oesophagus, stomach, small intestine, large intestine.', `The pink organ is the <b>${d.name}</b>.`, `There the toast is being handled by an organ that <b>${d.job}</b>.`],
        finalAnswer: d.job,
      };
    },
    () => ({
      prompt: 'Harper runs the 800 m at athletics day. Her heart beats much faster and she breathes hard. Why do <b>both</b> happen?',
      answer: ch('Her muscles need more oxygen and glucose delivered, and more carbon dioxide taken away', ['Her body is trying to cool down only', 'Her lungs have shrunk while she runs', 'Her blood has stopped carrying oxygen'], 4),
      hint: 'What do working muscles use up faster?',
      working: ['<b>Picture:</b> busy muscles are a busy kitchen — deliveries have to come faster.', '1. Working muscles use glucose and oxygen faster. Yes.', '2. So the lungs load oxygen faster (fast breathing) and the heart delivers faster (fast pulse).', 'Answer: <b>more oxygen and glucose in, more carbon dioxide out</b>.'],
      finalAnswer: 'Her muscles need more oxygen and glucose delivered, and more carbon dioxide taken away',
    }),
    (level) => {
      const rest = R.int(62, 78), run = R.int(125, 160);
      return {
        visual: pulseTable(rest, run),
        prompt: `Harper measured her heart rate sitting still and again straight after running. Which sentence best explains the results in the table?`,
        answer: ch('Running muscles need more oxygen, so the heart pumps faster to deliver it', ['Running makes the blood thinner so it moves faster', 'The heart gets bigger when you run', 'Running fills the lungs with carbon dioxide'], 4),
        hint: `Her rate went from ${rest} to ${run}. What extra job is the blood doing?`,
        working: ['<b>Picture:</b> the heart is a delivery van; running muscles order more parcels.', `1. Did the rate go up? Yes, ${rest} → ${run} bpm.`, '2. What do the muscles need more of? Oxygen and glucose.', 'So the heart <b>pumps faster to deliver more oxygen</b>.'],
        finalAnswer: 'Running muscles need more oxygen, so the heart pumps faster to deliver it',
      };
    },
    () => ({
      visual: alveolusSvg(),
      prompt: 'A smoker damages the walls of the air sacs so they join up into a few big bags instead of millions of tiny ones. Why does that make them short of breath?',
      answer: ch('There is far less surface, so much less oxygen gets into the blood', ['The lungs cannot hold any air at all', 'The blood stops going to the lungs', 'The diaphragm stops working'], 4),
      hint: 'What is the advantage of millions of tiny sacs?',
      working: ['<b>Picture:</b> a bunch of grapes has far more skin than one big balloon of the same size.', '1. What do air sacs do? Swap oxygen into the blood.', '2. Fewer, bigger sacs = much less surface.', 'So <b>less oxygen crosses into the blood</b> and they feel breathless.'],
      finalAnswer: 'There is far less surface, so much less oxygen gets into the blood',
    }),
    () => ({
      prompt: 'A person has an illness where their small intestine cannot absorb properly. They eat plenty but still get thin and tired. Explain why.',
      answer: ch('The digested food never reaches the blood, so the cells get no glucose', ['They are not chewing enough', 'Their stomach makes too much acid', 'Their lungs cannot take in oxygen'], 4),
      hint: 'Eating is not the same as absorbing.',
      working: ['<b>Picture:</b> parcels arriving at the depot but never being loaded onto the van.', '1. Is the food digested? Yes.', '2. Does it get into the blood? No — absorption is broken.', 'So the <b>cells never get the glucose</b>, and there is no energy released.'],
      finalAnswer: 'The digested food never reaches the blood, so the cells get no glucose',
    }),
    () => {
      const inB = R.chance(0.5);
      return {
        visual: breathSvg(inB),
        prompt: `Harper holds a model chest: a plastic bottle with balloons inside and a rubber sheet across the bottom. She ${inB ? 'pulls the rubber sheet down' : 'lets the rubber sheet spring back up'}. What happens to the balloons?`,
        answer: ch(inB ? 'They blow up, because the space inside got bigger and air rushed in' : 'They shrink, because the space inside got smaller and air was pushed out', ['They blow up, because the space inside got bigger and air rushed in', 'They shrink, because the space inside got smaller and air was pushed out', 'Nothing happens — the balloons are sealed'], 3),
        hint: 'The rubber sheet is the diaphragm. Bigger space inside = air comes in.',
        working: ['<b>Picture:</b> the chest is a syringe; the diaphragm is the plunger.', `1. Did the space get bigger or smaller? ${inB ? 'Bigger.' : 'Smaller.'}`, `2. Bigger space = lower pressure = air rushes <b>${inB ? 'in' : 'out'}</b>.`, `So the balloons <b>${inB ? 'blow up' : 'shrink'}</b>.`],
        finalAnswer: inB ? 'They blow up, because the space inside got bigger and air rushed in' : 'They shrink, because the space inside got smaller and air was pushed out',
      };
    },
    () => ({
      prompt: 'Harper chews a piece of plain bread for a full minute and it starts to taste sweet. What has happened?',
      answer: ch('Amylase in her saliva has broken the starch down into sugar', ['The bread has been warmed up by her mouth', 'Acid from her stomach has come up', 'The bread has soaked up water'], 4),
      hint: 'Which enzyme is in saliva, and what does it cut up?',
      working: ['<b>Picture:</b> saliva is full of scissors that only cut starch.', '1. What is bread mostly made of? Starch.', '2. Which enzyme cuts starch? Amylase, in saliva.', '3. What does starch turn into? Sugar — which tastes sweet.', 'So <b>amylase turned the starch into sugar</b>.'],
      finalAnswer: 'Amylase in her saliva has broken the starch down into sugar',
    }),
    () => ({
      visual: flowSvg(null, R.int(1, 4)),
      prompt: 'A friend says "arteries always carry red blood full of oxygen". Look at the diagram. Is that always true?',
      answer: ch('No — the artery from the heart to the lungs carries blood that is low in oxygen', ['Yes, arteries are always full of oxygen', 'No, arteries never carry oxygen', 'Yes, because arteries are always red'], 4),
      hint: 'What is the blood like on the way TO the lungs?',
      working: ['<b>Picture:</b> the racetrack: body → heart → lungs → heart → body.', '1. Do arteries carry blood away from the heart? Yes — that part is always true.', '2. On the trip heart → lungs, has the blood picked up oxygen yet? No, not until it reaches the lungs.', 'So <b>the artery to the lungs carries blood low in oxygen</b>.'],
      finalAnswer: 'No — the artery from the heart to the lungs carries blood that is low in oxygen',
    }),
    () => {
      const b = R.pick(BLOOD);
      const RESULT = {
        'red blood cells': 'She would feel tired and out of breath, because less oxygen is carried',
        'white blood cells': 'She would catch infections easily, because germs are not fought off',
        platelets: 'Small cuts would keep bleeding, because clots do not form',
        plasma: 'Nothing in the blood would be carried along properly',
      };
      const right = RESULT[b.name];
      return {
        prompt: `A blood test shows that Harper has very few <b>${b.name}</b>. Which problem would that cause?`,
        answer: ch(right, Object.keys(RESULT).map((k) => RESULT[k]), 4),
        hint: `Start with the job: ${b.name} ${b.job}.`,
        working: [`<b>Picture:</b> ${b.name} are ${b.pic}.`, `1. What is their job? They <b>${b.job}</b>.`, '2. Take them away — that job stops being done.', `So: <b>${right}</b>`],
        finalAnswer: right,
      };
    },
    () => ({
      prompt: 'Why can a kiwi chick not survive on food alone, even with a full stomach, if it cannot breathe?',
      answer: ch('Cells need oxygen as well as glucose to release energy', ['Food will not go down without air', 'The stomach needs air to make acid', 'Food turns into oxygen inside the body'], 4),
      hint: 'Write the respiration sentence: glucose + ? → energy.',
      working: ['<b>Picture:</b> a fire needs fuel AND air. Take the air away and the fire goes out.', '1. Respiration is glucose + <b>oxygen</b> → energy + carbon dioxide + water.', '2. Food gives the glucose. Breathing gives the oxygen.', 'Without oxygen the cells <b>cannot release the energy</b> from the food.'],
      finalAnswer: 'Cells need oxygen as well as glucose to release energy',
    }),
    () => ({
      prompt: 'Harper wants to test whether her heart rate goes up more after skipping than after walking. Which is the most important thing to keep the same?',
      answer: ch('How long she does each activity for, and resting properly in between', ['The colour of her shoes', 'The time of day only', 'Who is holding the stopwatch'], 4),
      hint: 'A fair test changes one thing and keeps everything else the same.',
      working: ['<b>Picture:</b> two runners in a race — same track, same distance, or it is not fair.', '1. What is she changing? The activity (skipping vs walking).', '2. So everything else must match: same length of time, same start rate.', 'Answer: <b>same time for each, with a proper rest in between</b>.'],
      finalAnswer: 'How long she does each activity for, and resting properly in between',
    }),
    (level) => {
      const ex = R.pick(STIMULI);
      return {
        visual: pathwaySvg(ex, R.int(2, 5)),
        prompt: `${cap(ex.stim)}. Follow the chain and work out what belongs in the <b>dotted box</b>.`,
        answer: (() => {
          const right = ex.resp;
          return ch(right, STIMULI.map((x) => x.resp), 4);
        })(),
        hint: 'Whatever is missing, the chain is always stimulus → receptor → nerve → brain → response. The last box is what your body actually does.',
        working: [
          '<b>Picture:</b> a doorbell. The button is pressed (stimulus), the wire carries it, someone decides, the door opens (response).',
          `1. Stimulus: ${ex.stim}.`,
          `2. Receptor: the <b>${ex.organ}</b>.`,
          '3. Nerve → brain (or spinal cord) → back out to a muscle.',
          `4. Response: <b>${ex.resp}</b>.`,
        ],
        finalAnswer: ex.resp,
      };
    },
    () => ({
      visual: nerveSvg(null, true),
      prompt: 'Harper touches a hot oven tray and her hand is away before she even feels the pain. How can the hand move before she feels it?',
      answer: ch('The message turned round in the spinal cord instead of going up to the brain first', ['Her hand moved by itself with no message at all', 'Her brain is faster than the nerve', 'The heat pushed her hand away'], 4),
      hint: 'Follow the message on the diagram — how far does it have to travel for a reflex?',
      working: [
        '<b>Picture:</b> a phone call answered at the front desk instead of being put through to the manager upstairs.',
        '1. Receptors in her skin start the message.',
        '2. It runs up the nerve to the <b>spinal cord</b> — and turns straight round there.',
        '3. The order goes back out to the arm muscle, which pulls the hand away.',
        '4. The message also carries on up to the brain, so a moment later she feels the pain.',
        'That short cut is what makes it a <b>reflex</b>.',
      ],
      finalAnswer: 'The message turned round in the spinal cord instead of going up to the brain first',
    }),
    (level) => {
      const base = R.int(17, 25) * 10;
      const vals = R.shuffle([base - 20, base, base + 20]);
      return {
        visual: reactTable(vals),
        prompt: 'Harper tests whether her reaction time gets worse when she is tired. What must she do to make it a <b>fair test</b>?',
        answer: ch('Change only whether she is tired, keep everything else the same, and repeat several times for a mean', ['Try once when tired and once when awake, and compare', 'Ask a different person for each try', 'Use a longer ruler when she is tired'], 4),
        hint: 'One thing changed, everything else the same, and repeats.',
        working: [
          '<b>Picture:</b> two runners racing — same track, same distance, or the result means nothing.',
          '1. What is she changing? Only whether she is tired.',
          '2. What must stay the same? Same catcher, same hand, ruler held at the same place, no countdown.',
          `3. Repeat and take the mean — her three times here average <b>${base} ms</b>.`,
        ],
        finalAnswer: 'Change only whether she is tired, keep everything else the same, and repeat several times for a mean',
      };
    },
    () => ({
      prompt: 'Harper has a heavy cold, her nose is blocked, and her dinner tastes of almost nothing. Why does a blocked nose change how food tastes?',
      answer: ch('Most of what we call taste is really smell, and blocked receptors in the nose cannot detect the chemicals', ['A cold changes the food itself', 'The tongue stops working when you are ill', 'Taste receptors are inside the nose only'], 4),
      hint: 'Two senses are working together every time you eat.',
      working: [
        '<b>Picture:</b> two doorbell buttons pressed at once — take one away and the sound is much weaker.',
        '1. The <b>tongue</b> detects chemicals in the food.',
        '2. The <b>nose</b> detects chemicals in the air coming off the food.',
        '3. A blocked nose stops the smell receptors working.',
        'So the brain gets only half the information, and the food seems flat.',
      ],
      finalAnswer: 'Most of what we call taste is really smell, and blocked receptors in the nose cannot detect the chemicals',
    }),
    (level) => ({
      visual: nerveSvg(null, true),
      prompt: 'Someone damages their spinal cord low down in their back and cannot move their legs, although their legs are not hurt. Explain why.',
      answer: ch('The messages from the brain cannot get past the damaged part of the cable to reach the leg muscles', ['The leg muscles have stopped existing', 'The brain has forgotten how to move legs', 'The legs have run out of blood'], 4),
      hint: 'Look at the diagram — everything below the damage has lost its connection.',
      working: [
        '<b>Picture:</b> the main cable down a building is cut halfway. Every floor below it loses power, even though the lights all still work.',
        '1. Where do the orders come from? The <b>brain</b>.',
        '2. How do they reach the legs? Down the <b>spinal cord</b>, then out along <b>nerves</b>.',
        '3. If the cord is damaged, the message cannot get through.',
        'The muscles are fine — the <b>message</b> never arrives.',
      ],
      finalAnswer: 'The messages from the brain cannot get past the damaged part of the cable to reach the leg muscles',
    }),
    () => ({
      prompt: 'Harper kicks a netball. Which three systems worked together, and in what order?',
      answer: ch('Nervous, muscular and skeletal: the brain sends a message down a nerve, the muscle contracts, and it pulls the bone', ['Digestive, breathing and circulatory, in that order', 'Muscular then nervous then digestive', 'Only the muscular system is involved'], 4),
      hint: 'Something has to give the order, something has to pull, and something has to move.',
      working: [
        '<b>Picture:</b> a puppet — the nerve is the string, the muscle is the hand pulling it, the bone is the wooden leg that swings.',
        '1. <b>Brain</b> decides → message goes down a <b>nerve</b> (nervous system).',
        '2. The <b>muscle contracts</b> — it gets shorter and pulls (muscular system).',
        '3. It pulls on a <b>bone</b>, which swings at a joint (skeletal system).',
        'A muscle can only pull, never push, so another muscle pulls the leg back again.',
      ],
      finalAnswer: 'Nervous, muscular and skeletal: the brain sends a message down a nerve, the muscle contracts, and it pulls the bone',
    }),
  ];

  HL.registerTopic({
    id: 'body-systems', subject: 'science', strand: 'living', order: 2,
    name: 'Body systems', short: 'Body systems', animal: 'kiwi',
    blurb: 'How food, oxygen and blood get to every cell in your body.',
    example: 'gut → glucose · lungs → oxygen · blood delivers both',
    learn: {
      what: '<p>Your body runs on a delivery system. The <b>digestive system</b> turns food into tiny molecules like glucose. The <b>breathing system</b> gets oxygen out of the air. The <b>circulatory system</b> — heart, blood and vessels — carries both of them to every single cell, and takes the waste away. On top of all that sits the <b>nervous system</b> — brain, spinal cord and nerves — the message system that notices what is happening through your <b>senses</b> and tells your muscles what to do about it.</p><p><b>Picture for this topic:</b> your body is a <b>town</b>. The gut and the lungs are two <b>loading bays</b>, the blood is the <b>courier van</b>, and every cell is a <b>house waiting for a delivery</b>. The nervous system is the <b>phone network</b> laid over that town: your senses ring in, the brain answers, and the order goes straight back out.</p>',
      visual: `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <rect x="8" y="8" width="110" height="30" rx="8" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/><text x="63" y="28" text-anchor="middle" fill="#4A4033">food</text>
        <rect x="222" y="8" width="110" height="30" rx="8" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/><text x="277" y="28" text-anchor="middle" fill="#4A4033">air</text>
        <polyline points="63,38 63,56" fill="none" stroke="#4A4033" stroke-width="3"/><polygon points="63,60 58,52 68,52" fill="#4A4033"/>
        <polyline points="277,38 277,56" fill="none" stroke="#4A4033" stroke-width="3"/><polygon points="277,60 272,52 282,52" fill="#4A4033"/>
        <rect x="8" y="60" width="110" height="32" rx="8" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/><text x="63" y="80" text-anchor="middle" fill="#4A4033" font-size="11">digestive system</text>
        <rect x="222" y="60" width="110" height="32" rx="8" fill="#5F98C4" stroke="#4A4033" stroke-width="2"/><text x="277" y="80" text-anchor="middle" fill="#FFFFFF" font-size="11">breathing system</text>
        <polyline points="63,92 63,112 104,112" fill="none" stroke="#6FA04C" stroke-width="3.5" stroke-linejoin="round"/><polygon points="108,112 100,107 100,117" fill="#6FA04C"/>
        <polyline points="277,92 277,112 236,112" fill="none" stroke="#6FA04C" stroke-width="3.5" stroke-linejoin="round"/><polygon points="232,112 240,107 240,117" fill="#6FA04C"/>
        <text x="8" y="130" fill="#6FA04C" font-size="11.5">glucose</text>
        <text x="332" y="130" text-anchor="end" fill="#6FA04C" font-size="11.5">oxygen</text>
        <rect x="110" y="96" width="120" height="34" rx="9" fill="#E0568C" stroke="#4A4033" stroke-width="2"/><text x="170" y="117" text-anchor="middle" fill="#FFFFFF">heart + blood</text>
        <polyline points="170,130 170,144" fill="none" stroke="#4A4033" stroke-width="3"/><polygon points="170,150 165,141 175,141" fill="#4A4033"/>
        <ellipse cx="170" cy="174" rx="56" ry="23" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/><text x="170" y="179" text-anchor="middle" fill="#4A4033">every cell</text>
        <text x="170" y="209" text-anchor="middle" fill="#4A4033" font-size="12.5">glucose + oxygen → ENERGY</text>
      </svg>`,
      facts: [
        'Gut order: <b>mouth → oesophagus → stomach → small intestine → large intestine</b>',
        'Food is <b>absorbed</b> in the <b>small intestine</b>; <b>water</b> is taken back in the large intestine',
        'Enzymes: <b>amylase</b> cuts starch → sugar · <b>protease</b> cuts protein → amino acids · <b>lipase</b> cuts fat',
        '<b>A</b>rteries carry blood <b>A</b>way from the heart · veins carry it back · <b>capillaries</b> are one cell thick',
        'Blood order: <b>body → heart → lungs → heart → body</b> (it goes through the heart twice)',
        'Breathing in: <b>diaphragm flattens, ribs go up and out, chest gets bigger, air rushes in</b>',
        '<b>Nervous system</b> = <b>brain</b> + <b>spinal cord</b> + <b>nerves</b> — the body’s message system',
        'The message path is always <b>stimulus → receptor → nerve → brain → response</b>',
        'Five senses: <b>sight</b> (eyes) · <b>hearing</b> (ears) · <b>smell</b> (nose) · <b>taste</b> (tongue) · <b>touch</b> (skin)',
        'A <b>reflex</b> short-cuts through the <b>spinal cord</b>, so it happens before you can think. The muscle that acts is the <b>effector</b>',
      ],
      steps: [
        'For a gut question, say the tube out loud in order: <b>mouth, oesophagus, stomach, small intestine, large intestine</b>. Then point to where the food has got to.',
        'For a blood vessel, ask "<b>which way is it going?</b>" Away from the heart → <b>artery</b>. Back to the heart → <b>vein</b>. Swapping with a cell → <b>capillary</b>.',
        'For an oxygen question, ask "<b>has this blood been past the lungs yet?</b>" Just been = full of oxygen. Just been round the body = low in oxygen.',
        'For breathing, use the syringe: <b>chest bigger = air in, chest smaller = air out</b>.',
        'For a "why is she puffing?" question, always end at the cells: they need <b>more glucose and oxygen</b>, and the <b>carbon dioxide</b> has to go.',
        'For anything about a message, say the chain out loud: <b>stimulus → receptor → nerve → brain → response</b>. Find where the question has got to, then step forward one.',
        'For a reflex, ask "<b>did I have to think about it?</b>" If not, the message took the short cut through the <b>spinal cord</b> — the brain only finds out afterwards.',
      ],
      examples: [
        { q: 'What is the job of the stomach?',
          working: ['<b>Picture:</b> the stomach is a washing machine full of acid.', '1. Does it absorb food into the blood? No — that is the small intestine.', '2. So what does it do? It churns the food with acid and protease.', 'It <b>turns the food into a thick soup and starts breaking protein down</b>.'],
          a: 'It churns food with acid until it is a soup' },
        { q: 'Trace a piece of toast through the gut. Where is the glucose from it finally absorbed into the blood?',
          visual: `<svg viewBox="0 0 300 220" width="300" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <ellipse cx="60" cy="18" rx="26" ry="12" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <rect x="52" y="28" width="16" height="38" rx="8" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
            <path d="M52 64 C22 72 20 118 56 122 C86 126 100 106 92 90 C86 78 72 74 68 64 Z" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <path d="M118 200 V146 H36 V196" fill="none" stroke="#E9A07A" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M92 120 V158 H62 q-12 0 -12 9 t12 9 H96 q12 0 12 9 t-12 9 H58" fill="none" stroke="#FFFFFF" stroke-width="15" stroke-linecap="round"/>
            <path d="M92 120 V158 H62 q-12 0 -12 9 t12 9 H96 q12 0 12 9 t-12 9 H58" fill="none" stroke="#B9A5E6" stroke-width="9" stroke-linecap="round"/>
            <line x1="86" y1="18" x2="140" y2="18" stroke="#4A4033" stroke-width="1.5"/><text x="144" y="22" fill="#4A4033">mouth</text>
            <line x1="68" y1="47" x2="140" y2="44" stroke="#4A4033" stroke-width="1.5"/><text x="144" y="48" fill="#4A4033">oesophagus</text>
            <line x1="94" y1="96" x2="140" y2="92" stroke="#4A4033" stroke-width="1.5"/><text x="144" y="96" fill="#4A4033">stomach</text>
            <line x1="118" y1="160" x2="140" y2="140" stroke="#4A4033" stroke-width="1.5"/><text x="144" y="144" fill="#4A4033">large intestine</text>
            <line x1="108" y1="185" x2="140" y2="182" stroke="#4A4033" stroke-width="1.5"/><text x="144" y="186" fill="#4A4033">small intestine</text>
          </svg>`,
          working: ['<b>Picture:</b> one long tube from your mouth all the way down.', '1. Chewed in the <b>mouth</b>, pushed down the <b>oesophagus</b>.', '2. Churned in the <b>stomach</b>.', '3. Broken right down and <b>absorbed in the small intestine</b> — its walls are covered in tiny villi.', '4. Only water is taken out in the large intestine.'],
          a: 'In the small intestine' },
        { q: 'Harper chews plain bread for a minute and it goes sweet. Which enzyme did that, and what did it make?',
          working: ['<b>Picture:</b> saliva is full of scissors that only cut starch.', '1. What is bread made of? <b>Starch</b>.', '2. Which enzyme cuts starch? <b>Amylase</b> — it is in saliva.', '3. Starch cut up gives <b>sugar</b>, and sugar tastes sweet.'],
          a: 'Amylase turned the starch into sugar' },
        { q: 'Blood is leaving the heart on its way to the lungs. Is it full of oxygen or low in oxygen?',
          visual: `<svg viewBox="0 0 300 212" width="300" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="100" y="8" width="100" height="36" rx="10" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/><text x="150" y="31" text-anchor="middle" fill="#4A4033" font-size="14">LUNGS</text>
            <rect x="110" y="82" width="80" height="44" rx="10" fill="#F5C3D4" stroke="#4A4033" stroke-width="2"/><text x="150" y="109" text-anchor="middle" fill="#4A4033" font-size="14">HEART</text>
            <rect x="100" y="150" width="100" height="36" rx="10" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/><text x="150" y="173" text-anchor="middle" fill="#4A4033" font-size="14">BODY</text>
            <polyline points="100,168 44,168 44,116 108,116" fill="none" stroke="#5F98C4" stroke-width="4" stroke-linejoin="round"/><polygon points="108,116 100,111 100,121" fill="#5F98C4"/>
            <polyline points="110,92 72,92 72,26 98,26" fill="none" stroke="#5F98C4" stroke-width="4" stroke-linejoin="round"/><polygon points="98,26 90,21 90,31" fill="#5F98C4"/>
            <polyline points="200,26 256,26 256,92 192,92" fill="none" stroke="#E0568C" stroke-width="4" stroke-linejoin="round"/><polygon points="192,92 200,87 200,97" fill="#E0568C"/>
            <polyline points="190,116 228,116 228,168 202,168" fill="none" stroke="#E0568C" stroke-width="4" stroke-linejoin="round"/><polygon points="202,168 210,163 210,173" fill="#E0568C"/>
            <text x="6" y="206" fill="#5F98C4" font-size="11.5">blue = low in oxygen</text>
            <text x="294" y="206" text-anchor="end" fill="#E0568C" font-size="11.5">red = full of oxygen</text>
          </svg>`,
          working: ['<b>Picture:</b> a figure-of-eight racetrack with the heart at the crossing point.', '1. Where does blood pick oxygen up? <b>Only at the lungs.</b>', '2. Has this blood been to the lungs yet? <b>No</b> — it is on the way there.', 'So it is <b>low in oxygen</b>. (Yes — an artery carrying low-oxygen blood!)'],
          a: 'Low in oxygen' },
        { q: 'Harper counts 22 heartbeats in 15 seconds. What is her heart rate in beats per minute?',
          working: ['1. How many 15-second blocks are in a minute? <b>Four</b>.', '2. So multiply by 4: 22 × 4 = 88.'],
          a: '88 beats per minute' },
        { q: 'Harper measured her heart rate before and after running. Explain her results.',
          visual: `<table class="data"><tr><th>When</th><th>Heart rate (bpm)</th></tr><tr><td>sitting still</td><td>72</td></tr><tr><td>after running</td><td>144</td></tr></table>`,
          working: ['<b>Picture:</b> the heart is a courier van; running muscles order twice as many parcels.', '1. Did it go up? Yes — it <b>doubled</b>, 72 → 144.', '2. What do running muscles need more of? <b>Glucose and oxygen</b>.', '3. And what has to be taken away faster? <b>Carbon dioxide</b>.', 'So the heart pumps faster to deliver more oxygen and clear the waste.'],
          a: 'Her muscles needed more oxygen, so the heart doubled its rate to deliver it' },
        { q: 'A smoker\'s air sacs join up into a few big bags instead of millions of tiny ones. Why does that leave them breathless?',
          working: ['<b>Picture:</b> a bunch of grapes has far more skin than one balloon the same size.', '1. What do air sacs do? Let <b>oxygen cross into the blood</b>.', '2. What helps that happen fast? A <b>huge surface</b> and walls one cell thick.', '3. Fewer, bigger sacs = much less surface.', 'So <b>less oxygen gets into the blood</b> and they feel out of breath.'],
          a: 'Less surface means much less oxygen gets into the blood' },
        { q: 'Harper touches a hot oven tray. Put the whole message in order, from the tray to her hand moving.',
          visual: `<svg viewBox="0 0 300 212" width="300" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
            <text x="72" y="27" text-anchor="end" fill="#7A7065" font-size="10.5">stimulus</text>
            <rect x="80" y="6" width="214" height="32" rx="8" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <text x="187" y="27" text-anchor="middle" fill="#4A4033" font-size="11">you touch a hot oven tray</text>
            <line x1="187" y1="38" x2="187" y2="42" stroke="#4A4033" stroke-width="3"/><polygon points="187,47 182,39 192,39" fill="#4A4033"/>
            <text x="72" y="67" text-anchor="end" fill="#7A7065" font-size="10.5">receptor</text>
            <rect x="80" y="46" width="214" height="32" rx="8" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/>
            <text x="187" y="67" text-anchor="middle" fill="#4A4033" font-size="11">skin — receptor cells</text>
            <line x1="187" y1="78" x2="187" y2="82" stroke="#4A4033" stroke-width="3"/><polygon points="187,87 182,79 192,79" fill="#4A4033"/>
            <text x="72" y="107" text-anchor="end" fill="#7A7065" font-size="10.5">nerve</text>
            <rect x="80" y="86" width="214" height="32" rx="8" fill="#FFE6B8" stroke="#4A4033" stroke-width="2"/>
            <text x="187" y="107" text-anchor="middle" fill="#4A4033" font-size="11">the message runs along a nerve</text>
            <line x1="187" y1="118" x2="187" y2="122" stroke="#4A4033" stroke-width="3"/><polygon points="187,127 182,119 192,119" fill="#4A4033"/>
            <text x="72" y="147" text-anchor="end" fill="#7A7065" font-size="10.5">spinal cord</text>
            <rect x="80" y="126" width="214" height="32" rx="8" fill="#F5C3D4" stroke="#E0568C" stroke-width="3"/>
            <text x="187" y="147" text-anchor="middle" fill="#4A4033" font-size="11">turns straight round here (reflex!)</text>
            <line x1="187" y1="158" x2="187" y2="162" stroke="#4A4033" stroke-width="3"/><polygon points="187,167 182,159 192,159" fill="#4A4033"/>
            <text x="72" y="187" text-anchor="end" fill="#7A7065" font-size="10.5">response</text>
            <rect x="80" y="166" width="214" height="32" rx="8" fill="#DCEEF9" stroke="#4A4033" stroke-width="2"/>
            <text x="187" y="187" text-anchor="middle" fill="#4A4033" font-size="11">arm muscle pulls the hand away</text>
          </svg>`,
          working: ['<b>Picture:</b> a doorbell. Someone presses the button, the wire carries it, someone decides, the door opens.', '1. <b>Stimulus</b> — the change: the tray is hot.', '2. <b>Receptor</b> — receptor cells in the skin of her hand pick it up.', '3. <b>Nerve</b> — the message runs up the nerve.', '4. Because it is a <b>reflex</b>, it turns round in the <b>spinal cord</b> instead of going up to the brain.', '5. <b>Response</b> — the arm muscle (the <b>effector</b>) contracts and pulls her hand away.', 'A moment later the message reaches her brain and she feels the pain.'],
          a: 'stimulus → receptor (skin) → nerve → spinal cord → response (muscle pulls the hand away)' },
        { q: 'Which sense organ picks up each of these, and what is it detecting?',
          visual: `<table class="data"><tr><th>Sense</th><th>Organ</th><th>Detects</th></tr>
            <tr><td>sight</td><td>eyes</td><td>light</td></tr>
            <tr><td>hearing</td><td>ears</td><td>sound</td></tr>
            <tr><td>smell</td><td>nose</td><td>smells in the air</td></tr>
            <tr><td>taste</td><td>tongue</td><td>chemicals in food</td></tr>
            <tr><td>touch</td><td>skin</td><td>touch, heat, pain</td></tr></table>`,
          working: ['<b>Picture:</b> five different doorbell buttons, each one only reacting to its own kind of change.', '1. A bright light → <b>eyes</b> (they detect light).', '2. A loud bang → <b>ears</b> (they detect sound).', '3. Dinner cooking → <b>nose</b> (chemicals floating in the air).', '4. Something sour → <b>tongue</b> (chemicals in the food).', '5. A hot tray → <b>skin</b> (heat and pain).', 'Inside every one of them are <b>receptor cells</b>, and every one starts its message the same way.'],
          a: 'eyes–light, ears–sound, nose–air chemicals, tongue–food chemicals, skin–touch, heat and pain' },
        { q: 'Harper drops a ruler for a friend to catch, three times. Her friend’s reaction times were 220 ms, 200 ms and 180 ms. Find the mean, and say what she must keep the same to make it a fair test.',
          visual: `<table class="data"><tr><th>Try</th><th>Reaction time (ms)</th></tr>
            <tr><td>1</td><td>220</td></tr><tr><td>2</td><td>200</td></tr><tr><td>3</td><td>180</td></tr></table>`,
          working: ['<b>Picture:</b> two runners in a race — same track, same distance, or the result means nothing.', '1. Mean = add them and divide: 220 + 200 + 180 = 600. 600 ÷ 3 = <b>200 ms</b>.', '2. Why repeat at all? One try could be a fluke — the mean is more reliable.', '3. Fair test: <b>same catcher, same hand, ruler held at the same place, no countdown</b>.', '4. Change only ONE thing (tired or awake, say) and keep everything else the same.'],
          a: 'Mean = 200 ms; keep the same catcher, hand and starting position, with no warning, and repeat' },
      ],
      tips: [
        '<b>A</b>rtery = <b>A</b>way from the heart. That is the one to remember; veins are the other way.',
        'The artery going to the lungs is the odd one out — it carries blood that is <b>low</b> in oxygen. So "arteries are always red" is a myth.',
        'Food is <b>digested</b> all the way down, but only <b>absorbed</b> in the <b>small</b> intestine. The large one just takes the water back.',
        'A reflex is not you being fast — it is the message <b>skipping the brain</b> and turning round in the spinal cord. Your brain only hears about it a moment later.',
        'Muscles can only <b>pull</b>, never push. That is why they come in pairs, and why the nerve, the muscle and the bone all have to work together to move you.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [digestJob, digestOrder, digestLabel, circJob, bloodQ, breatheJob, vesselQ, togetherQ, pulseCalc, nerveJob, nerveLabel, senseQ, pathwayQ, pathwayOrderQ, stimulusQ, reflexQ, moveTogetherQ, reactionQ, nerveCalc]
        : level === 2
          ? [digestJob, digestOrder, digestLabel, enzymeQ, absorbQ, circJob, vesselQ, bloodQ, heartFlowBox, heartFlowArrow, breatheJob, gasSwap, diaphragmQ, togetherQ, pulseCalc, nerveJob, nerveLabel, senseQ, pathwayQ, pathwayOrderQ, stimulusQ, reflexQ, moveTogetherQ, reactionQ, nerveCalc]
          : [digestLabel, enzymeQ, absorbQ, vesselQ, heartFlowBox, heartFlowArrow, gasSwap, diaphragmQ, togetherQ, pulseCalc, bloodQ, digestOrder, nerveLabel, senseQ, pathwayQ, stimulusQ, reflexQ, moveTogetherQ, reactionQ, nerveCalc, pathwayOrderQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
