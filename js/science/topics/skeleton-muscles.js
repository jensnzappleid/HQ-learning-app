/* Topic: Skeleton & muscles — what bones are for, joints, and antagonistic muscle pairs.
 * Living World, order 3. Structure copied from cells.js (the exemplar). */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const BONES = [
    { key: 'skull', name: 'skull', where: 'your head', protects: 'the brain' },
    { key: 'ribs', name: 'ribs', where: 'your chest', protects: 'the heart and lungs' },
    { key: 'spine', name: 'spine', where: 'your back', protects: 'the spinal cord' },
    { key: 'humerus', name: 'humerus', where: 'your upper arm' },
    { key: 'radius + ulna', name: 'radius and ulna', where: 'your forearm' },
    { key: 'pelvis', name: 'pelvis', where: 'your hips' },
    { key: 'femur', name: 'femur', where: 'your thigh' },
    { key: 'tibia', name: 'tibia', where: 'your shin' },
  ];
  const JOBS = [
    { job: 'support', detail: 'holds you up so you keep your shape', pic: 'the poles inside a tent' },
    { job: 'protection', detail: 'shields the soft organs like the brain, heart and lungs', pic: 'a bike helmet' },
    { job: 'movement', detail: 'gives the muscles something firm to pull on', pic: 'the handle on a door' },
    { job: 'making blood', detail: 'the marrow inside the big bones makes new blood cells', pic: 'a little factory hidden inside the bone' },
  ];
  const JOINTS = [
    { type: 'hinge', ex: ['elbow', 'knee', 'finger', 'ankle'], move: 'opens and shuts one way only', pic: 'a door hinge' },
    { type: 'ball and socket', ex: ['shoulder', 'hip'], move: 'moves in every direction and can circle right round', pic: 'a joystick sitting in its cup' },
    { type: 'fixed', ex: ['the joints between the plates of your skull', 'the joints in your pelvis'], move: 'does not move at all', pic: 'a jigsaw that has been glued' },
    { type: 'pivot', ex: ['the top of your neck', 'the joint that lets you turn your palm over'], move: 'turns and twists round', pic: 'a key turning in a lock' },
  ];
  const CONNECT = [
    { name: 'tendon', joins: 'muscle to bone', extra: 'it is strong and hardly stretches, so all the pull goes into moving the bone', pic: 'a tow rope' },
    { name: 'ligament', joins: 'bone to bone', extra: 'it is a bit stretchy, and it holds the joint together', pic: 'a strong elastic strap' },
    { name: 'cartilage', joins: 'nothing — it is the smooth, slippery cushion on the end of a bone', extra: 'it stops the bones grinding on each other', pic: 'the rubber on the bottom of a chair leg' },
  ];

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
  const BONE = '#EFE4CE', INK = '#4A4033', HI = '#E0568C', HIINK = '#9E2B57';
  /** whole skeleton. highlight = bone key (that bone turns pink); labelled = draw all eight labels */
  function skeletonSvg(highlight, labelled) {
    const f = (k) => (highlight === k ? HI : BONE);
    const s = (k) => (highlight === k ? HIINK : INK);
    const bone = (k, d, w) =>
      `<path d="${d}" fill="none" stroke="${s(k)}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${f(k)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const ribs = [54, 66, 78, 90].map((y) =>
      bone('ribs', `M149 ${y} C120 ${y} 112 ${y + 8} 116 ${y + 18}`, 6) +
      bone('ribs', `M151 ${y} C180 ${y} 188 ${y + 8} 184 ${y + 18}`, 6)).join('');
    const lab = (x1, y1, x2, y2, tx, ty, t, anchor) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1.5"/><text x="${tx}" y="${ty}" text-anchor="${anchor}" fill="${INK}" font-size="11.5">${t}</text>`;
    return `<svg viewBox="0 0 340 218" width="340" height="218" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="150" cy="24" r="18" fill="${f('skull')}" stroke="${s('skull')}" stroke-width="3"/>
      ${bone('spine', 'M150 44 V124', 8)}
      ${ribs}
      ${bone('humerus', 'M129 52 L115 92', 9)}${bone('humerus', 'M171 52 L185 92', 9)}
      ${bone('radius + ulna', 'M115 92 L105 130', 8)}${bone('radius + ulna', 'M185 92 L195 130', 8)}
      <path d="M121 126 Q150 118 179 126 L173 148 Q150 142 127 148 Z" fill="${f('pelvis')}" stroke="${s('pelvis')}" stroke-width="3"/>
      ${bone('femur', 'M136 146 L130 180', 10)}${bone('femur', 'M164 146 L170 180', 10)}
      ${bone('tibia', 'M130 180 L128 208', 8)}${bone('tibia', 'M170 180 L172 208', 8)}
      ${bone('foot', 'M128 208 L114 212', 6)}${bone('foot', 'M172 208 L186 212', 6)}
      ${labelled ? [
        lab(132, 20, 100, 20, 96, 24, 'skull', 'end'),
        lab(117, 86, 100, 88, 96, 92, 'humerus', 'end'),
        lab(108, 116, 100, 132, 96, 136, 'radius + ulna', 'end'),
        lab(129, 198, 104, 204, 96, 208, 'tibia', 'end'),
        lab(184, 70, 218, 64, 222, 68, 'ribs', 'start'),
        lab(152, 116, 218, 112, 222, 116, 'spine', 'start'),
        lab(179, 134, 218, 140, 222, 144, 'pelvis', 'start'),
        lab(170, 164, 218, 176, 222, 180, 'femur', 'start'),
      ].join('') : `<text x="290" y="30" text-anchor="middle" fill="${HI}" font-size="13">the pink bone</text>`}
    </svg>`;
  }

  /** the arm as a lever: humerus, forearm, biceps and triceps. bent = biceps contracted */
  function armSvg(bent, labelled) {
    const fx = bent ? 180 : 196, fy = bent ? 62 : 146;
    const bi = bent ? { rx: 18, ry: 24 } : { rx: 9, ry: 32 };
    const tri = bent ? { rx: 9, ry: 32 } : { rx: 18, ry: 24 };
    return `<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="80" cy="26" r="14" fill="${BONE}" stroke="${INK}" stroke-width="3"/>
      <path d="M80 26 V112" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="M80 26 V112" stroke="${BONE}" stroke-width="13" stroke-linecap="round"/>
      <path d="M80 112 L${fx} ${fy}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M80 112 L${fx} ${fy}" stroke="${BONE}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="80" cy="112" r="10" fill="#E8C24A" stroke="${INK}" stroke-width="3"/>
      <line x1="102" y1="${72 - bi.ry}" x2="86" y2="34" stroke="${INK}" stroke-width="3"/>
      <line x1="102" y1="${72 + bi.ry}" x2="98" y2="122" stroke="${INK}" stroke-width="3"/>
      <line x1="58" y1="${72 - tri.ry}" x2="74" y2="34" stroke="${INK}" stroke-width="3"/>
      <line x1="58" y1="${72 + tri.ry}" x2="70" y2="120" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="102" cy="72" rx="${bi.rx}" ry="${bi.ry}" fill="#E0568C" stroke="#9E2B57" stroke-width="2.5"/>
      <ellipse cx="58" cy="72" rx="${tri.rx}" ry="${tri.ry}" fill="#5F98C4" stroke="#3D6F94" stroke-width="2.5"/>
      ${labelled ? `<line x1="114" y1="58" x2="140" y2="44" stroke="${INK}" stroke-width="1.5"/><text x="144" y="42" fill="#9E2B57" font-size="11.5">biceps</text><text x="144" y="56" fill="#9E2B57" font-size="11.5">${bent ? 'CONTRACTS' : 'relaxes'}</text><text x="144" y="70" fill="#9E2B57" font-size="11.5">${bent ? '(short + fat)' : '(long + thin)'}</text>
        <line x1="44" y1="94" x2="24" y2="146" stroke="${INK}" stroke-width="1.5"/><text x="6" y="162" fill="#3D6F94" font-size="11.5">triceps</text><text x="6" y="176" fill="#3D6F94" font-size="11.5">${bent ? 'relaxes' : 'CONTRACTS'}</text><text x="6" y="190" fill="#3D6F94" font-size="11.5">${bent ? '(long + thin)' : '(short + fat)'}</text>`
        : `<text x="150" y="192" text-anchor="middle" fill="${INK}" font-size="12.5">the arm is ${bent ? 'BENDING up' : 'STRAIGHTENING down'}</text>
           <text x="150" y="176" text-anchor="middle" fill="${INK}" font-size="11.5">pink = biceps · blue = triceps</text>`}
    </svg>`;
  }

  /** one joint, drawn four ways */
  function jointSvg(kind) {
    const head = `<svg viewBox="0 0 240 156" width="240" height="156" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">`;
    const cap2 = (t) => `<text x="120" y="146" text-anchor="middle" fill="${INK}" font-size="12">${t}</text></svg>`;
    const bar = (d, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${BONE}" stroke-width="${w}" stroke-linecap="round"/>`;
    if (kind === 'hinge') {
      return head + bar('M24 40 H112', 18) + bar('M112 40 L186 104', 16) +
        `<path d="M112 40 L206 40" stroke="#C9C1B4" stroke-width="6" stroke-dasharray="7 6" stroke-linecap="round"/>
         <path d="M196 46 A88 88 0 0 1 174 96" fill="none" stroke="#E0568C" stroke-width="4"/><polygon points="176,102 166,92 182,88" fill="#E0568C"/>
         <circle cx="112" cy="40" r="11" fill="#E8C24A" stroke="${INK}" stroke-width="3"/>` + cap2('opens and shuts ONE way');
    }
    if (kind === 'ball and socket') {
      const rays = [-70, -35, 0, 35, 70].map((deg) => {
        const r = (deg * Math.PI) / 180, x = 174 + Math.cos(r) * 22, y = 66 + Math.sin(r) * 22;
        return `<line x1="174" y1="66" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E0568C" stroke-width="3.5" stroke-linecap="round"/>` +
          `<circle cx="${(174 + Math.cos(r) * 28).toFixed(1)}" cy="${(66 + Math.sin(r) * 28).toFixed(1)}" r="4.5" fill="#E0568C"/>`;
      }).join('');
      return head + bar('M104 26 A42 42 0 1 0 104 106', 16) +
        `<circle cx="96" cy="66" r="23" fill="${BONE}" stroke="${INK}" stroke-width="4"/>` +
        bar('M104 66 H172', 15) + rays +
        cap2('moves in EVERY direction');
    }
    if (kind === 'fixed') {
      return head +
        `<path d="M20 34 H120 L128 48 L112 62 L128 76 L112 90 L124 104 H20 Z" fill="${BONE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
         <path d="M220 34 H128 L136 48 L120 62 L136 76 L120 90 L132 104 H220 Z" fill="#E8DCC2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
         <text x="120" y="126" text-anchor="middle" fill="#E0568C" font-size="13">locked together</text>` + cap2('does NOT move');
    }
    return head +
      bar('M120 16 V120', 17) +
      `<ellipse cx="120" cy="52" rx="44" ry="20" fill="none" stroke="#E0568C" stroke-width="5"/>
       <polygon points="174,52 152,40 156,64" fill="#E0568C"/>
       <ellipse cx="120" cy="52" rx="44" ry="20" fill="none" stroke="#E0568C" stroke-width="5" opacity=".35"/>` +
      cap2('turns and twists round');
  }

  const armTable = () => `<table class="data"><tr><th>Muscle</th><th>Bending the arm</th><th>Straightening it</th></tr>
    <tr><td>biceps</td><td>contracts</td><td>relaxes</td></tr><tr><td>triceps</td><td>relaxes</td><td>contracts</td></tr></table>`;

  /* ---------- question makers ---------- */
  function boneOnDiagram(level) {
    const b = R.pick(BONES);
    const askWhere = level >= 2 && b.where && R.chance(0.4);
    return {
      visual: skeletonSvg(b.key, false),
      prompt: askWhere ? 'Look at the skeleton. Where in the body is the <b>pink</b> bone?' : 'Look at the skeleton. What is the <b>pink</b> bone called?',
      answer: askWhere ? ch(b.where, BONES.map((x) => x.where)) : ch(b.name, BONES.map((x) => x.name)),
      hint: askWhere ? 'Name the bone first, then say where it sits.' : 'Start at the head and work down: skull, ribs, spine, humerus, radius and ulna, pelvis, femur, tibia.',
      working: ['<b>Picture:</b> work down the skeleton from head to toe.', `The pink bone is the <b>${b.name}</b>, in <b>${b.where}</b>.`],
      finalAnswer: askWhere ? b.where : b.name, skill: 'bones',
    };
  }
  function boneWhere() {
    const b = R.pick(BONES);
    if (R.chance(0.5)) {
      return {
        prompt: `Which bone is in <b>${b.where}</b>?`,
        answer: ch(b.name, BONES.map((x) => x.name)),
        hint: 'Say the list from the top down: skull, ribs, spine, humerus, radius and ulna, pelvis, femur, tibia.',
        working: [`<b>Picture:</b> point to ${b.where} on yourself.`, `The bone there is the <b>${b.name}</b>.`],
        finalAnswer: b.name, skill: 'bones',
      };
    }
    return {
      prompt: `Where in the body is the <b>${b.name}</b>?`,
      answer: ch(b.where, BONES.map((x) => x.where)),
      hint: 'Picture the skeleton and point to it.',
      working: [`<b>Picture:</b> the whole skeleton, head to toe.`, `The ${b.name} is in <b>${b.where}</b>.`],
      finalAnswer: b.where, skill: 'bones',
    };
  }
  function protectQ() {
    const p = R.pick(BONES.filter((b) => b.protects));
    if (R.chance(0.5)) {
      return {
        prompt: `Which soft part of the body do the <b>${p.name}</b> protect?`,
        answer: ch(p.protects, BONES.filter((b) => b.protects).map((b) => b.protects).concat(['the stomach'])),
        hint: 'What is right underneath that bone?',
        working: ['<b>Picture:</b> bones are the crash helmet for the soft bits.', `The ${p.name} sits right over <b>${p.protects}</b>.`],
        finalAnswer: p.protects, skill: 'jobs',
      };
    }
    return {
      prompt: `Which bones protect <b>${p.protects}</b>?`,
      answer: ch(p.name, BONES.map((b) => b.name)),
      hint: 'Which bone is wrapped around it?',
      working: [`<b>Picture:</b> a crash helmet around the soft part.`, `${cap(p.protects)} is protected by the <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'jobs',
    };
  }
  function skeletonJob() {
    const j = R.pick(JOBS);
    if (R.chance(0.5)) {
      return {
        prompt: `One job of the skeleton is <b>${j.job}</b>. What does that mean?`,
        answer: ch(j.detail, JOBS.map((x) => x.detail)),
        hint: `Think of ${j.pic}.`,
        working: [`<b>Picture:</b> ${j.pic}.`, `So "${j.job}" means it <b>${j.detail}</b>.`],
        finalAnswer: j.detail, skill: 'jobs',
      };
    }
    return {
      prompt: `Which job of the skeleton is being described: it <b>${j.detail}</b>?`,
      answer: ch(j.job, JOBS.map((x) => x.job)),
      hint: 'The four jobs are support, protection, movement and making blood.',
      working: ['<b>Picture:</b> tent poles (support), helmet (protection), door handle (movement), hidden factory (making blood).', `That description is <b>${j.job}</b>.`],
      finalAnswer: j.job, skill: 'jobs',
    };
  }
  function jointFromExample() {
    const j = R.pick(JOINTS);
    const e = R.pick(j.ex);
    return {
      prompt: `What type of joint is <b>${e}</b>?`,
      answer: ch(j.type, JOINTS.map((x) => x.type)),
      hint: 'Try moving it. Does it only fold one way, go every way, twist, or not move at all?',
      working: [`<b>Picture:</b> ${j.pic}.`, `Your ${e} <b>${j.move}</b>.`, `So it is a <b>${j.type}</b> joint.`],
      finalAnswer: j.type, skill: 'joints',
    };
  }
  function jointFromMove() {
    const j = R.pick(JOINTS);
    if (R.chance(0.5)) {
      return {
        prompt: `Which joint <b>${j.move}</b>?`,
        answer: ch(j.type, JOINTS.map((x) => x.type)),
        hint: `It is like ${j.pic}.`,
        working: [`<b>Picture:</b> ${j.pic}.`, `That is a <b>${j.type}</b> joint — for example, your ${j.ex[0]}.`],
        finalAnswer: j.type, skill: 'joints',
      };
    }
    return {
      prompt: `How does a <b>${j.type}</b> joint move?`,
      answer: ch(j.move, JOINTS.map((x) => x.move)),
      hint: `Think of ${j.pic}.`,
      working: [`<b>Picture:</b> ${j.pic}.`, `A ${j.type} joint <b>${j.move}</b>.`, `Example: your ${j.ex[0]}.`],
      finalAnswer: j.move, skill: 'joints',
    };
  }
  function jointOnDiagram(level) {
    const j = R.pick(JOINTS);
    const form = level === 1 ? 1 : R.int(1, 3);
    if (form === 1) {
      return {
        visual: jointSvg(j.type),
        prompt: 'Look at the joint in the picture. What type of joint is it?',
        answer: ch(j.type, JOINTS.map((x) => x.type)),
        hint: 'Look at the arrows: one way only, every way, a twist, or none at all.',
        working: [`<b>Picture:</b> ${j.pic}.`, `The arrows show it <b>${j.move}</b>.`, `So it is a <b>${j.type}</b> joint.`],
        finalAnswer: j.type, skill: 'joints',
      };
    }
    if (form === 2) {
      return {
        visual: jointSvg(j.type),
        prompt: 'Look at the joint in the picture. Which part of the body has a joint like this?',
        answer: ch(j.ex[0], JOINTS.map((x) => x.ex[0])),
        hint: 'Work out the joint type first, then name a body part with that joint.',
        working: [`The arrows show it <b>${j.move}</b>, so it is a <b>${j.type}</b> joint.`, `Your <b>${j.ex[0]}</b> is one of those.`],
        finalAnswer: j.ex[0], skill: 'joints',
      };
    }
    return {
      visual: jointSvg(j.type),
      prompt: 'Look at the joint in the picture. How does it move?',
      answer: ch(j.move, JOINTS.map((x) => x.move)),
      hint: 'Follow the pink arrows with your finger.',
      working: [`<b>Picture:</b> ${j.pic}.`, `It is a ${j.type} joint, so it <b>${j.move}</b>.`],
      finalAnswer: j.move, skill: 'joints',
    };
  }
  function armDiagramQ(level) {
    const bent = R.chance(0.5);
    const form = R.int(1, 3);
    if (form === 1) {
      const right = bent ? 'The biceps is contracting and the triceps is relaxing' : 'The triceps is contracting and the biceps is relaxing';
      return {
        visual: armSvg(bent, false),
        prompt: `The arm is <b>${bent ? 'bending up' : 'straightening down'}</b>. What are the two muscles doing?`,
        answer: ch(right, ['The biceps is contracting and the triceps is relaxing', 'The triceps is contracting and the biceps is relaxing', 'Both muscles are contracting at once', 'Both muscles are relaxing at once'], 4),
        hint: 'Muscles can only PULL. Whichever muscle is on the side the arm is moving towards must be the one pulling.',
        working: ['<b>Picture:</b> two people on either end of a rope — only one can pull at a time.', `1. Which way is the arm moving? <b>${bent ? 'Up (bending)' : 'Down (straightening)'}</b>.`, `2. Which muscle pulls it that way? The <b>${bent ? 'biceps' : 'triceps'}</b>.`, `So the ${bent ? 'biceps' : 'triceps'} contracts and the <b>${bent ? 'triceps' : 'biceps'} relaxes</b>.`],
        finalAnswer: right, skill: 'muscles',
      };
    }
    if (form === 2) {
      const fat = bent ? 'biceps' : 'triceps';
      return {
        visual: armSvg(bent, false),
        prompt: 'Look at the picture. Which muscle has gone <b>short and fat</b> (contracted)?',
        answer: ch(fat, ['biceps', 'triceps', 'both of them', 'neither of them'], 4),
        hint: 'A contracting muscle bunches up. Compare the two shapes.',
        working: ['<b>Picture:</b> squeeze a sponge and it gets shorter and thicker.', `The ${fat} is the fat, bunched-up one.`, `So the <b>${fat}</b> is contracted — and it is pulling the arm ${bent ? 'up' : 'down'}.`],
        finalAnswer: fat, skill: 'muscles',
      };
    }
    return {
      visual: armSvg(bent, false),
      prompt: `The <b>${bent ? 'biceps' : 'triceps'}</b> is pulling. Which way is the arm moving?`,
      answer: ch(bent ? 'bending up' : 'straightening down', ['bending up', 'straightening down', 'twisting sideways'], 3),
      hint: 'Follow the muscle: which bone is it pulling, and which way?',
      working: ['<b>Picture:</b> a rope pulling a drawbridge.', `The ${bent ? 'biceps is at the front, so it pulls the forearm UP' : 'triceps is at the back, so it pulls the forearm DOWN'}.`, `The arm is <b>${bent ? 'bending up' : 'straightening down'}</b>.`],
      finalAnswer: bent ? 'bending up' : 'straightening down', skill: 'muscles',
    };
  }
  function muscleRule() {
    const forms = [
      { p: 'What is the only thing a muscle can do?', a: 'pull (by getting shorter)', w: ['push (by getting longer)', 'both push and pull', 'stretch itself out'], r: 'A muscle contracts — it never pushes.' },
      { p: 'Why do muscles have to work in <b>pairs</b>?', a: 'Because a muscle can only pull, so another muscle is needed to pull the bone back', w: ['Because one muscle is not strong enough', 'Because bones have two ends', 'So one can rest while the other works all day'], r: 'Nothing can push the bone back, so a second muscle pulls the other way.' },
      { p: 'What is a pair of muscles that pull in opposite directions called?', a: 'an antagonistic pair', w: ['a tendon pair', 'a ligament pair', 'a hinge pair'], r: 'Antagonists are opponents — they work against each other.' },
      { p: 'Which muscle <b>contracts</b> to bend your arm at the elbow?', a: 'the biceps', w: ['the triceps', 'both together', 'neither — the bone bends itself'], r: 'The biceps is at the front of your upper arm.' },
      { p: 'Which muscle <b>contracts</b> to straighten your arm again?', a: 'the triceps', w: ['the biceps', 'both together', 'neither — gravity does all of it'], r: 'The triceps is at the back of your upper arm.' },
      { p: 'When the biceps contracts, what is the triceps doing?', a: 'relaxing and getting longer', w: ['contracting as well', 'staying exactly the same', 'pushing the bone'], r: 'One shortens while the other lengthens.' },
      { p: 'What actually happens inside a muscle when it "contracts"?', a: 'It gets shorter and fatter, and pulls on the bone', w: ['It gets longer and thinner and pushes the bone', 'It fills up with air', 'It turns to bone'], r: 'Short and fat = pulling.' },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: f.r,
      working: ['<b>Picture:</b> two people on either end of a rope. Only one can pull at a time.', f.r, `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'muscles',
    };
  }
  function connectQ() {
    const c = R.pick(CONNECT);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What does a <b>${c.name}</b> join together?`,
        answer: ch(c.joins, CONNECT.map((x) => x.joins)),
        hint: `Think of it as ${c.pic}.`,
        working: [`<b>Picture:</b> a ${c.name} is like ${c.pic}.`, `It joins <b>${c.joins}</b>.`],
        finalAnswer: c.joins, skill: 'connect',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which part joins <b>${c.joins}</b>?`,
        answer: ch(c.name, CONNECT.map((x) => x.name)),
        hint: 'Tendon: muscle to bone. Ligament: bone to bone (they both start with the same letters as their job if you say "liga-bone").',
        working: ['<b>Picture:</b> a tow rope (tendon) and an elastic strap (ligament).', `That is a <b>${c.name}</b>.`],
        finalAnswer: c.name, skill: 'connect',
      };
    }
    return {
      prompt: `Why does a <b>${c.name}</b> need to be the way it is?`,
      answer: ch(c.extra, CONNECT.map((x) => x.extra)),
      hint: `A ${c.name} is like ${c.pic}.`,
      working: [`<b>Picture:</b> ${c.pic}.`, `A ${c.name} works because <b>${c.extra}</b>.`],
      finalAnswer: c.extra, skill: 'connect',
    };
  }
  function boneCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 4);
    if (form === 1) {
      const baby = R.pick([270, 280, 300, 305]);
      return {
        prompt: `A baby is born with about <b>${baby}</b> bones. An adult has <b>206</b>. How many bones have joined together as the baby grows up?`,
        answer: { type: 'number', value: baby - 206, unit: 'bones' },
        hint: 'Take the adult number away from the baby number.',
        working: ['<b>Picture:</b> soft baby bones fusing together like puzzle pieces.', `${baby} − 206 = <b>${baby - 206}</b> bones.`],
        finalAnswer: `${baby - 206} bones`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const pct = R.pick([40, 45, 50]);
      const mass = R.pick([40, 50, 60]);
      return {
        prompt: `Muscle is about <b>${pct}%</b> of a person's body mass. For someone who weighs <b>${mass} kg</b>, how many kilograms is that?`,
        answer: { type: 'number', value: (mass * pct) / 100, unit: 'kg', tolerance: 0.05 },
        hint: `${pct}% means ${pct} out of every 100. Find 1% first, then multiply.`,
        working: [`1% of ${mass} kg = ${(mass / 100).toFixed(1)} kg.`, `${pct}% = ${(mass / 100).toFixed(1)} × ${pct} = <b>${(mass * pct) / 100} kg</b>.`],
        finalAnswer: `${(mass * pct) / 100} kg`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const each = R.pick([12, 14, 26, 27]);
      const label = { 12: 'ribs on each side', 14: 'bones in each foot', 26: 'bones in each foot', 27: 'bones in each hand' }[each];
      return {
        prompt: `There are <b>${each}</b> ${label}. How many is that altogether for both sides?`,
        answer: { type: 'number', value: each * 2, unit: 'bones' },
        hint: 'You have two of them, so double it.',
        working: [`${each} on one side, ${each} on the other.`, `${each} × 2 = <b>${each * 2}</b>.`],
        finalAnswer: `${each * 2}`, skill: 'numbers',
      };
    }
    const total = 206, spine = R.pick([26, 33]);
    return {
      prompt: `An adult skeleton has <b>${total}</b> bones, and <b>${spine}</b> of them are in the spine. How many bones are <b>not</b> in the spine?`,
      answer: { type: 'number', value: total - spine, unit: 'bones' },
      hint: 'Take the spine bones away from the total.',
      working: [`${total} − ${spine} = <b>${total - spine}</b> bones.`],
      finalAnswer: `${total - spine} bones`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const bent = R.chance(0.5);
      return {
        visual: armSvg(bent, false),
        prompt: `Harper picks up her kete of books and ${bent ? 'lifts it up towards her shoulder' : 'lowers it back down to the table'}. Which muscle is doing the pulling?`,
        answer: ch(bent ? 'the biceps' : 'the triceps', ['the biceps', 'the triceps', 'both at exactly the same time', 'neither — the bone pushes'], 4),
        hint: 'Which way is the forearm going, and which muscle is on that side?',
        working: ['<b>Picture:</b> two people on a rope, one at the front of the arm and one at the back.', `1. Which way is the forearm moving? <b>${bent ? 'Up' : 'Down'}</b>.`, `2. Which muscle is on that side? The <b>${bent ? 'biceps (front)' : 'triceps (back)'}</b>.`, `So the ${bent ? 'biceps' : 'triceps'} contracts and the other one relaxes.`],
        finalAnswer: bent ? 'the biceps' : 'the triceps',
      };
    },
    () => ({
      visual: armTable(),
      prompt: 'Look at the table. A friend says "when you bend your arm, both muscles contract to make it stronger". Is that right?',
      answer: ch('No — one contracts while the other relaxes, or the arm could not move', ['Yes, two contracting muscles are stronger', 'Yes, but only when lifting something heavy', 'No, because muscles never contract at all'], 4),
      hint: 'If both pulled at once, which way would the arm go?',
      working: ['<b>Picture:</b> tug of war. If both sides pull equally hard, nothing moves.', '1. Can a muscle push? No — only pull.', '2. If both pulled at once, would the arm move? No, it would lock.', 'So <b>one contracts while the other relaxes</b>.'],
      finalAnswer: 'No — one contracts while the other relaxes, or the arm could not move',
    }),
    () => ({
      prompt: 'A rugby player tears the ligament in her knee. Which problem would that cause?',
      answer: ch('The knee joint becomes wobbly, because the bones are no longer strapped together', ['Her muscle can no longer pull on the bone', 'Her bone marrow stops making blood', 'Her femur snaps in half'], 4),
      hint: 'What does a ligament join? Start there.',
      working: ['<b>Picture:</b> a ligament is a strong elastic strap holding two bones together.', '1. What does a ligament join? <b>Bone to bone.</b>', '2. Take the strap away — the joint has nothing holding it.', 'So the <b>knee goes wobbly and unstable</b>.'],
      finalAnswer: 'The knee joint becomes wobbly, because the bones are no longer strapped together',
    }),
    () => ({
      prompt: 'Someone cuts the tendon at the back of their ankle (the Achilles tendon). Why can they no longer push off with that foot?',
      answer: ch('The calf muscle can still contract, but the pull no longer reaches the bone', ['The bone has been cut in half', 'The muscle disappears', 'The ankle joint turns into a fixed joint'], 4),
      hint: 'A tendon is the rope between muscle and bone.',
      working: ['<b>Picture:</b> a tow rope between a car and a trailer. Cut the rope and the car still moves, but the trailer stays put.', '1. What does a tendon join? <b>Muscle to bone.</b>', '2. Cut it: the muscle still pulls, but nothing is on the other end.', 'So the <b>pull never reaches the bone</b> and the foot cannot push off.'],
      finalAnswer: 'The calf muscle can still contract, but the pull no longer reaches the bone',
    }),
    () => {
      const j = R.pick(JOINTS.filter((x) => x.type !== 'fixed'));
      return {
        visual: jointSvg(j.type),
        prompt: `Harper builds a model arm out of card and split pins. She wants the model joint to behave like the one in the picture. What must it be able to do?`,
        answer: ch(j.move, JOINTS.map((x) => x.move)),
        hint: 'Read the arrows in the picture.',
        working: [`<b>Picture:</b> ${j.pic}.`, `That is a <b>${j.type}</b> joint.`, `So her model must <b>${j.move}</b>.`],
        finalAnswer: j.move,
      };
    },
    () => ({
      prompt: 'Why is a <b>hinge</b> joint safer than a ball and socket joint for your knee?',
      answer: ch('It only bends one way, so it cannot twist and get damaged as easily', ['It is made of softer bone', 'It has no ligaments to tear', 'It moves faster'], 4),
      hint: 'Think about what happens to a knee when it twists.',
      working: ['<b>Picture:</b> a door hinge — it swings, but it will not twist.', '1. What does a hinge joint do? Opens and shuts one way only.', '2. Your body weight goes through the knee, so twisting would be dangerous.', 'A hinge <b>stops the joint twisting</b>.'],
      finalAnswer: 'It only bends one way, so it cannot twist and get damaged as easily',
    }),
    () => ({
      prompt: 'An astronaut spends six months in space with no gravity pulling on her bones. Back on Earth her bones are weaker. What does that tell you about bones?',
      answer: ch('Bones get stronger when they are used and weaker when they are not', ['Bones are not alive', 'Bones only grow when you are a baby', 'Space makes bones dissolve into the blood'], 4),
      hint: 'Bone is living tissue — it responds to being used, just like muscle.',
      working: ['<b>Picture:</b> a muscle you never use goes floppy. Bone does the same.', '1. Is bone alive? Yes — it has cells, blood and marrow inside.', '2. No weight on it for six months = no reason to stay strong.', 'So <b>bones get stronger when used and weaker when not</b>.'],
      finalAnswer: 'Bones get stronger when they are used and weaker when they are not',
    }),
    () => {
      const b = R.pick(BONES.filter((x) => x.protects));
      return {
        prompt: `In a bike crash Harper lands hard on ${b.key === 'skull' ? 'her head' : b.key === 'ribs' ? 'her chest' : 'her back'}. Which job of the skeleton is doing the most important work right then?`,
        answer: ch('protection', JOBS.map((x) => x.job)),
        hint: `The ${b.name} is wrapped around ${b.protects}.`,
        working: ['<b>Picture:</b> a bike helmet around something soft.', `1. What is under the ${b.name}? <b>${cap(b.protects)}</b>.`, '2. Which of the four jobs is that? <b>Protection</b>.'],
        finalAnswer: 'protection',
      };
    },
    () => ({
      prompt: 'Harper tests how many star jumps she can do in a minute before and after a warm-up. Why should she rest for the same time before both tries?',
      answer: ch('So the only thing that changes is the warm-up — that makes it a fair test', ['So she does not get bored', 'Because muscles need exactly the same food', 'So her bones do not break'], 4),
      hint: 'A fair test changes one thing and keeps everything else the same.',
      working: ['<b>Picture:</b> two runners in a race — same track, same start, or it proves nothing.', '1. What is she changing? The <b>warm-up</b>.', '2. So everything else — rest, time, counting — must be the same.', 'That makes it a <b>fair test</b>.'],
      finalAnswer: 'So the only thing that changes is the warm-up — that makes it a fair test',
    }),
    () => ({
      prompt: 'A weta has a hard shell on the OUTSIDE and no bones inside. What is one disadvantage of that compared with our skeleton?',
      answer: ch('It has to shed the whole shell to grow bigger', ['It cannot protect its organs', 'It cannot move at all', 'It cannot make any blood'], 4),
      hint: 'An outside shell cannot stretch. What has to happen when the animal grows?',
      working: ['<b>Picture:</b> a suit of armour that does not stretch.', '1. Does the shell protect it? Yes, very well.', '2. Can the shell grow? No — it is hard.', 'So the weta must <b>shed the whole shell to grow</b>, and it is soft and in danger until the new one hardens.'],
      finalAnswer: 'It has to shed the whole shell to grow bigger',
    }),
    (level) => {
      const b = R.pick(BONES);
      return {
        visual: skeletonSvg(b.key, false),
        prompt: `Harper takes an X-ray at the museum and the pink bone is broken. Which bone did she break?`,
        answer: ch(b.name, BONES.map((x) => x.name)),
        hint: 'Work down the skeleton from the head: skull, ribs, spine, humerus, radius and ulna, pelvis, femur, tibia.',
        working: ['<b>Picture:</b> read the skeleton from head to toe.', `The pink bone is in <b>${b.where}</b>.`, `That is the <b>${b.name}</b>.`],
        finalAnswer: b.name,
      };
    },
  ];

  HL.registerTopic({
    id: 'skeleton-muscles', subject: 'science', strand: 'living', order: 3,
    name: 'Skeleton & muscles', short: 'Bones & muscles', animal: 'owl',
    blurb: 'The frame that holds you up, and the pairs of muscles that move it.',
    example: 'biceps pulls the arm up · triceps pulls it back down',
    learn: {
      what: '<p>Your <b>skeleton</b> is a frame of 206 bones. It holds you up, protects the soft organs, gives the muscles something to pull on, and makes new blood inside the big bones. Bones meet at <b>joints</b>, and <b>muscles</b> move them — but a muscle can only <b>pull</b>, never push, so they always come in pairs.</p><p><b>Picture for this topic:</b> your arm is a <b>drawbridge</b>. The bones are the planks, the joint is the hinge, and two ropes (the biceps and the triceps) pull it up and let it down.</p>',
      visual: `<svg viewBox="0 0 340 216" width="340" height="216" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="16" text-anchor="middle" fill="#4A4033" font-size="12">muscles only PULL — so they work in pairs</text>
        <circle cx="80" cy="42" r="13" fill="#EFE4CE" stroke="#4A4033" stroke-width="3"/>
        <path d="M80 42 V126" stroke="#4A4033" stroke-width="17" stroke-linecap="round"/><path d="M80 42 V126" stroke="#EFE4CE" stroke-width="13" stroke-linecap="round"/>
        <path d="M80 126 L166 78" stroke="#4A4033" stroke-width="16" stroke-linecap="round"/><path d="M80 126 L166 78" stroke="#EFE4CE" stroke-width="12" stroke-linecap="round"/>
        <circle cx="80" cy="126" r="10" fill="#E8C24A" stroke="#4A4033" stroke-width="3"/>
        <line x1="102" y1="64" x2="88" y2="50" stroke="#4A4033" stroke-width="3"/><line x1="102" y1="112" x2="98" y2="136" stroke="#4A4033" stroke-width="3"/>
        <line x1="58" y1="56" x2="72" y2="50" stroke="#4A4033" stroke-width="3"/><line x1="58" y1="120" x2="70" y2="134" stroke="#4A4033" stroke-width="3"/>
        <ellipse cx="102" cy="88" rx="18" ry="24" fill="#E0568C" stroke="#9E2B57" stroke-width="2.5"/>
        <ellipse cx="58" cy="88" rx="9" ry="32" fill="#5F98C4" stroke="#3D6F94" stroke-width="2.5"/>
        <line x1="120" y1="76" x2="150" y2="46" stroke="#4A4033" stroke-width="1.5"/>
        <text x="154" y="42" fill="#9E2B57" font-size="11">biceps CONTRACTS</text><text x="154" y="55" fill="#9E2B57" font-size="11">(short + fat)</text><text x="154" y="68" fill="#9E2B57" font-size="11">→ pulls the arm up</text>
        <line x1="48" y1="112" x2="26" y2="158" stroke="#4A4033" stroke-width="1.5"/>
        <text x="6" y="174" fill="#3D6F94" font-size="11">triceps relaxes</text><text x="6" y="188" fill="#3D6F94" font-size="11">(long + thin)</text>
        <text x="186" y="118" fill="#4A4033" font-size="11">to straighten it,</text>
        <text x="186" y="131" fill="#4A4033" font-size="11">they swap over:</text>
        <text x="186" y="147" fill="#3D6F94" font-size="11">triceps contracts,</text>
        <text x="186" y="160" fill="#9E2B57" font-size="11">biceps relaxes</text>
        <text x="186" y="182" fill="#C08A10" font-size="11">yellow dot = elbow</text>
        <text x="186" y="195" fill="#C08A10" font-size="11">= a HINGE joint</text>
      </svg>`,
      facts: [
        'Four jobs of the skeleton: <b>support</b>, <b>protection</b>, <b>movement</b>, <b>making blood</b> (in the marrow)',
        'Joints: <b>hinge</b> (elbow, knee) · <b>ball and socket</b> (shoulder, hip) · <b>fixed</b> (skull) · <b>pivot</b> (neck)',
        'A muscle can only <b>pull</b> (contract). It can never push — so muscles come in <b>antagonistic pairs</b>',
        '<b>Biceps</b> contracts to bend the arm · <b>triceps</b> contracts to straighten it',
        '<b>Tendon</b> joins muscle to bone · <b>Ligament</b> joins bone to bone',
        'Bones to know: <b>skull, ribs, spine, humerus, radius + ulna, pelvis, femur, tibia</b>',
      ],
      steps: [
        'For a bone name, read down the skeleton in order: <b>skull, ribs, spine, humerus, radius and ulna, pelvis, femur, tibia</b>.',
        'For a joint, try moving it: one way only = <b>hinge</b>, every way = <b>ball and socket</b>, twisting = <b>pivot</b>, no movement = <b>fixed</b>.',
        'For a muscle question, always ask "<b>which way is the bone moving?</b>" The muscle on that side is the one <b>pulling</b>; its partner is <b>relaxing</b>.',
        'For tendon vs ligament: "<b>liga-bone</b>" — ligament joins <b>bone to bone</b>. The other one (tendon) must be muscle to bone.',
        'Never say a muscle "pushes". Say it <b>contracts and pulls</b>.',
      ],
      examples: [
        { q: 'Which bone is in your thigh, and what type of joint is at the top of it?',
          visual: `<svg viewBox="0 0 340 218" width="340" height="218" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <circle cx="150" cy="24" r="18" fill="#EFE4CE" stroke="#4A4033" stroke-width="3"/>
            <path d="M150 44 V124" stroke="#4A4033" stroke-width="11" stroke-linecap="round"/><path d="M150 44 V124" stroke="#EFE4CE" stroke-width="8" stroke-linecap="round"/>
            <path d="M149 54 C120 54 112 62 116 72 M151 54 C180 54 188 62 184 72 M149 66 C120 66 112 74 116 84 M151 66 C180 66 188 74 184 84 M149 78 C120 78 112 86 116 96 M151 78 C180 78 188 86 184 96 M149 90 C120 90 112 98 116 108 M151 90 C180 90 188 98 184 108" fill="none" stroke="#4A4033" stroke-width="9" stroke-linecap="round"/>
            <path d="M149 54 C120 54 112 62 116 72 M151 54 C180 54 188 62 184 72 M149 66 C120 66 112 74 116 84 M151 66 C180 66 188 74 184 84 M149 78 C120 78 112 86 116 96 M151 78 C180 78 188 86 184 96 M149 90 C120 90 112 98 116 108 M151 90 C180 90 188 98 184 108" fill="none" stroke="#EFE4CE" stroke-width="6" stroke-linecap="round"/>
            <path d="M129 52 L115 92 M171 52 L185 92" stroke="#4A4033" stroke-width="12" stroke-linecap="round"/><path d="M129 52 L115 92 M171 52 L185 92" stroke="#EFE4CE" stroke-width="9" stroke-linecap="round"/>
            <path d="M115 92 L105 130 M185 92 L195 130" stroke="#4A4033" stroke-width="11" stroke-linecap="round"/><path d="M115 92 L105 130 M185 92 L195 130" stroke="#EFE4CE" stroke-width="8" stroke-linecap="round"/>
            <path d="M121 126 Q150 118 179 126 L173 148 Q150 142 127 148 Z" fill="#EFE4CE" stroke="#4A4033" stroke-width="3"/>
            <path d="M136 146 L130 180 M164 146 L170 180" stroke="#9E2B57" stroke-width="13" stroke-linecap="round"/><path d="M136 146 L130 180 M164 146 L170 180" stroke="#E0568C" stroke-width="10" stroke-linecap="round"/>
            <path d="M130 180 L128 208 M170 180 L172 208" stroke="#4A4033" stroke-width="11" stroke-linecap="round"/><path d="M130 180 L128 208 M170 180 L172 208" stroke="#EFE4CE" stroke-width="8" stroke-linecap="round"/>
            <line x1="132" y1="20" x2="100" y2="20" stroke="#4A4033" stroke-width="1.5"/><text x="96" y="24" text-anchor="end" fill="#4A4033" font-size="11.5">skull</text>
            <line x1="117" y1="86" x2="100" y2="88" stroke="#4A4033" stroke-width="1.5"/><text x="96" y="92" text-anchor="end" fill="#4A4033" font-size="11.5">humerus</text>
            <line x1="108" y1="116" x2="100" y2="132" stroke="#4A4033" stroke-width="1.5"/><text x="96" y="136" text-anchor="end" fill="#4A4033" font-size="11.5">radius + ulna</text>
            <line x1="129" y1="198" x2="104" y2="204" stroke="#4A4033" stroke-width="1.5"/><text x="96" y="208" text-anchor="end" fill="#4A4033" font-size="11.5">tibia</text>
            <line x1="184" y1="70" x2="218" y2="64" stroke="#4A4033" stroke-width="1.5"/><text x="222" y="68" fill="#4A4033" font-size="11.5">ribs</text>
            <line x1="152" y1="116" x2="218" y2="112" stroke="#4A4033" stroke-width="1.5"/><text x="222" y="116" fill="#4A4033" font-size="11.5">spine</text>
            <line x1="179" y1="134" x2="218" y2="140" stroke="#4A4033" stroke-width="1.5"/><text x="222" y="144" fill="#4A4033" font-size="11.5">pelvis</text>
            <line x1="170" y1="164" x2="218" y2="176" stroke="#4A4033" stroke-width="1.5"/><text x="222" y="180" fill="#9E2B57" font-size="11.5">femur</text>
          </svg>`,
          working: ['<b>Picture:</b> read the skeleton from head to toe.', '1. Which pink bone is between the pelvis and the knee? The <b>femur</b> — the longest bone you have.', '2. What joint is at the top of it, where it meets the pelvis? Your hip.', '3. Can your hip go every direction? Yes — so it is a <b>ball and socket</b> joint.'],
          a: 'The femur, and the hip is a ball and socket joint' },
        { q: 'Your elbow only folds one way. What type of joint is it, and what everyday thing is it like?',
          working: ['<b>Picture:</b> a door hinge.', '1. Does it move every way? No.', '2. Does it twist? No.', '3. Does it fold one way and shut again? Yes.', 'So the elbow is a <b>hinge joint</b>, just like the knee, the fingers and the ankle.'],
          a: 'A hinge joint — like a door hinge' },
        { q: 'Harper bends her arm to lift her kete. What are the biceps and triceps each doing?',
          visual: `<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <circle cx="80" cy="26" r="14" fill="#EFE4CE" stroke="#4A4033" stroke-width="3"/>
            <path d="M80 26 V112" stroke="#4A4033" stroke-width="17" stroke-linecap="round"/><path d="M80 26 V112" stroke="#EFE4CE" stroke-width="13" stroke-linecap="round"/>
            <path d="M80 112 L180 62" stroke="#4A4033" stroke-width="16" stroke-linecap="round"/><path d="M80 112 L180 62" stroke="#EFE4CE" stroke-width="12" stroke-linecap="round"/>
            <circle cx="80" cy="112" r="10" fill="#E8C24A" stroke="#4A4033" stroke-width="3"/>
            <line x1="102" y1="48" x2="86" y2="34" stroke="#4A4033" stroke-width="3"/><line x1="102" y1="96" x2="98" y2="122" stroke="#4A4033" stroke-width="3"/>
            <line x1="58" y1="40" x2="74" y2="34" stroke="#4A4033" stroke-width="3"/><line x1="58" y1="104" x2="70" y2="120" stroke="#4A4033" stroke-width="3"/>
            <ellipse cx="102" cy="72" rx="18" ry="24" fill="#E0568C" stroke="#9E2B57" stroke-width="2.5"/>
            <ellipse cx="58" cy="72" rx="9" ry="32" fill="#5F98C4" stroke="#3D6F94" stroke-width="2.5"/>
            <line x1="114" y1="58" x2="140" y2="44" stroke="#4A4033" stroke-width="1.5"/>
            <text x="144" y="42" fill="#9E2B57" font-size="11.5">biceps</text><text x="144" y="56" fill="#9E2B57" font-size="11.5">CONTRACTS</text><text x="144" y="70" fill="#9E2B57" font-size="11.5">(short + fat)</text>
            <line x1="44" y1="94" x2="24" y2="146" stroke="#4A4033" stroke-width="1.5"/>
            <text x="6" y="162" fill="#3D6F94" font-size="11.5">triceps</text><text x="6" y="176" fill="#3D6F94" font-size="11.5">relaxes</text><text x="6" y="190" fill="#3D6F94" font-size="11.5">(long + thin)</text>
          </svg>`,
          working: ['<b>Picture:</b> two people on either end of a rope — only one can pull at a time.', '1. Which way is the forearm going? <b>Up</b>.', '2. Which muscle is on that side? The <b>biceps</b>, at the front.', '3. So the biceps <b>contracts</b> — short and fat.', '4. Its partner must get out of the way, so the triceps <b>relaxes</b> — long and thin.'],
          a: 'The biceps contracts and the triceps relaxes' },
        { q: 'Why can a muscle not push your arm straight again?',
          working: ['<b>Picture:</b> you can pull a rope, but you cannot push one.', '1. What can a muscle do? Only <b>get shorter and pull</b>.', '2. So how does the arm straighten? A <b>different</b> muscle on the other side pulls it back.', 'That is why they are called an <b>antagonistic pair</b>.'],
          a: 'Muscles can only pull, so a second muscle pulls the bone the other way' },
        { q: 'A netballer tears a ligament in her ankle. Why does her ankle now feel wobbly?',
          working: ['<b>Picture:</b> a ligament is a strong elastic strap holding two bones together.', '1. What does a ligament join? <b>Bone to bone</b> (remember "liga-bone").', '2. Take the strap away and the bones are no longer held in place.', 'So the <b>joint becomes wobbly and unstable</b> — but her muscles still work, because those are joined by tendons.'],
          a: 'The bones are no longer strapped together, so the joint is unstable' },
        { q: 'A baby is born with about 300 bones but an adult has 206. How many have joined together?',
          working: ['<b>Picture:</b> soft baby bones fusing together like puzzle pieces.', '300 − 206 = 94.', 'So about <b>94</b> bones fuse as she grows up — that is why a baby is so bendy.'],
          a: '94 bones' },
        { q: 'An astronaut comes back from six months in space with weaker bones. What does that show about bone?',
          working: ['<b>Picture:</b> a muscle you never use goes floppy — bone does the same thing.', '1. Is bone alive? <b>Yes</b> — it has living cells, blood and marrow.', '2. In space nothing pushes down on the bones, so there is no reason for them to stay strong.', '3. Back on Earth, weight-bearing exercise builds them back up.'],
          a: 'Bone is living tissue: it gets stronger when used and weaker when it is not' },
      ],
      tips: [
        'Muscles <b>never push</b>. If an answer says "the muscle pushes the bone", it is wrong.',
        '"<b>Liga-bone</b>" — ligament joins <b>bone to bone</b>. Tendon is the other one (muscle to bone).',
        'The <b>biceps</b> is at the <b>front</b> of your upper arm and pulls the arm <b>up</b>. Feel it bulge when you bend your elbow.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [boneOnDiagram, boneWhere, skeletonJob, jointFromExample, muscleRule, connectQ, protectQ, boneCalc]
        : level === 2
          ? [boneOnDiagram, boneWhere, protectQ, skeletonJob, jointFromExample, jointFromMove, jointOnDiagram, armDiagramQ, muscleRule, connectQ, boneCalc]
          : [boneOnDiagram, protectQ, jointFromMove, jointOnDiagram, armDiagramQ, muscleRule, connectQ, boneCalc, jointFromExample, skeletonJob];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
