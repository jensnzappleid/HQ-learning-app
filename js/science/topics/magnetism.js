/* Topic: Magnetism — magnetic materials, poles, fields, compasses, electromagnets. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';
  const ROSE = '#E0568C', SKY = '#5F98C4';

  /* ---------- item pools ---------- */
  const MATERIALS = [
    { m: 'iron', mag: true }, { m: 'steel', mag: true }, { m: 'nickel', mag: true }, { m: 'cobalt', mag: true },
    { m: 'a steel paper clip', mag: true }, { m: 'an iron nail', mag: true }, { m: 'a steel drink can', mag: true },
    { m: 'aluminium', mag: false }, { m: 'copper', mag: false }, { m: 'gold', mag: false }, { m: 'silver', mag: false },
    { m: 'brass', mag: false }, { m: 'plastic', mag: false }, { m: 'wood', mag: false }, { m: 'glass', mag: false },
    { m: 'rubber', mag: false }, { m: 'paper', mag: false }, { m: 'an aluminium drink can', mag: false },
    { m: 'a cast iron frying pan', mag: true }, { m: 'a steel bike chain', mag: true }, { m: 'a stainless steel fridge door', mag: true },
    { m: 'a copper pipe', mag: false }, { m: 'a glass marble', mag: false }, { m: 'a cotton sock', mag: false },
  ];
  const USES = [
    { u: 'a fridge door seal', why: 'the magnet holds the door shut' },
    { u: 'a compass', why: 'the needle lines up with Earth\'s magnetic field' },
    { u: 'a scrapyard crane', why: 'an electromagnet can be switched off to drop the load' },
    { u: 'headphones and speakers', why: 'a magnet and a coil make the cone vibrate' },
    { u: 'an electric motor', why: 'magnets push and pull the spinning coil round' },
    { u: 'a cupboard catch', why: 'the magnet snaps the door closed' },
    { u: 'a maglev train', why: 'magnets repel so the train floats above the track' },
    { u: 'a magnetic knife rack', why: 'the magnet holds the steel blades against the wall' },
    { u: 'a magnetic screwdriver tip', why: 'the magnet keeps the steel screw stuck on the end' },
    { u: 'a recycling sorter', why: 'the magnet lifts out only the steel cans and leaves the rest' },
    { u: 'a phone case that snaps shut', why: 'a small magnet keeps the flap closed' },
  ];
  const STRONGER = [
    { s: 'add more turns of wire to the coil', ok: true },
    { s: 'add another cell to the circuit', ok: true },
    { s: 'use an iron core instead of a plastic one', ok: true },
    { s: 'use a thicker wire so more current flows', ok: true },
    { s: 'take some turns off the coil', ok: false },
    { s: 'use a plastic rod instead of the iron nail', ok: false },
    { s: 'add a resistor to the circuit', ok: false },
    { s: 'use a smaller cell', ok: false },
  ];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- diagrams ---------- */
  function barMagnet(x, y, w, h, leftPole, small) {
    const half = w / 2, fs = small ? 14 : 18;
    const col = (p) => (p === 'N' ? ROSE : SKY);
    return `<rect x="${x}" y="${y}" width="${half}" height="${h}" fill="${col(leftPole)}" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="${x + half}" y="${y}" width="${half}" height="${h}" fill="${col(leftPole === 'N' ? 'S' : 'N')}" stroke="${INK}" stroke-width="2.5"/>` +
      `<text x="${x + half / 2}" y="${y + h / 2 + fs / 3}" text-anchor="middle" fill="#FFFFFF" font-size="${fs}" font-weight="700">${leftPole}</text>` +
      `<text x="${x + half * 1.5}" y="${y + h / 2 + fs / 3}" text-anchor="middle" fill="#FFFFFF" font-size="${fs}" font-weight="700">${leftPole === 'N' ? 'S' : 'N'}</text>`;
  }

  function fieldSvg(o) {
    const opt = o || {};
    const letters = opt.letters;
    let arcs = '';
    [[-10, 40], [22, 56], [54, 72]].forEach((pair, k) => {
      const c = pair[0], peak = pair[1];
      arcs += `<path d="M 90 88 Q 165 ${c} 240 88" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
      arcs += `<polygon points="${172},${peak} ${162},${peak - 5} ${162},${peak + 5}" fill="${INK}"/>`;
      const cb = 200 - c, peakb = 200 - peak;
      arcs += `<path d="M 90 112 Q 165 ${cb} 240 112" fill="none" stroke="${INK}" stroke-width="1.8"/>`;
      arcs += `<polygon points="${172},${peakb} ${162},${peakb - 5} ${162},${peakb + 5}" fill="${INK}"/>`;
    });
    let marks = '';
    if (letters) {
      marks = `<circle cx="88" cy="100" r="9" fill="#FFFDFE" stroke="${ROSE}" stroke-width="2"/><text x="88" y="105" text-anchor="middle" fill="${ROSE}" font-size="12" font-weight="700">A</text>` +
        `<circle cx="165" cy="46" r="9" fill="#FFFDFE" stroke="${ROSE}" stroke-width="2"/><text x="165" y="51" text-anchor="middle" fill="${ROSE}" font-size="12" font-weight="700">B</text>` +
        `<circle cx="290" cy="100" r="9" fill="#FFFDFE" stroke="${ROSE}" stroke-width="2"/><text x="290" y="105" text-anchor="middle" fill="${ROSE}" font-size="12" font-weight="700">C</text>`;
    }
    return `<svg viewBox="0 0 330 200" width="330" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${arcs}
      ${barMagnet(90, 78, 150, 44, 'N')}
      ${marks}
      <text x="165" y="192" text-anchor="middle" fill="${INK}" font-size="11">${opt.caption || 'the magnetic field around a bar magnet'}</text>
    </svg>`;
  }

  function twoMagnetsSvg(leftPoleL, leftPoleR) {
    return `<svg viewBox="0 0 330 170" width="330" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${barMagnet(16, 56, 120, 44, leftPoleL)}
      ${barMagnet(194, 56, 120, 44, leftPoleR)}
      <text x="165" y="46" text-anchor="middle" fill="#C33C72" font-size="13">?</text>
      <path d="M 140 78 L 190 78" stroke="#D9CFBE" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="165" y="132" text-anchor="middle" fill="${INK}" font-size="11">two magnets pushed close together</text>
      <text x="165" y="150" text-anchor="middle" fill="#9A6A0F" font-size="11">the facing poles are ${leftPoleL === 'N' ? 'S' : 'N'} and ${leftPoleR}</text>
    </svg>`;
  }

  function compassSvg(o) {
    const opt = o || {};
    const cx = opt.magnet ? 268 : 165, cy = 100;
    let s = '';
    if (opt.magnet) s += barMagnet(24, 78, 150, 44, opt.leftPole || 'N', true);
    s += `<circle cx="${cx}" cy="${cy}" r="34" fill="#FFFDFE" stroke="${INK}" stroke-width="2.5"/>`;
    s += `<text x="${cx}" y="${cy - 20}" text-anchor="middle" fill="${INK}" font-size="11">N</text>`;
    s += `<text x="${cx}" y="${cy + 28}" text-anchor="middle" fill="${INK}" font-size="11">S</text>`;
    s += `<text x="${cx - 25}" y="${cy + 4}" text-anchor="middle" fill="${INK}" font-size="11">W</text>`;
    s += `<text x="${cx + 25}" y="${cy + 4}" text-anchor="middle" fill="${INK}" font-size="11">E</text>`;
    if (opt.needle) {
      s += `<polygon points="${cx},${cy - 16} ${cx - 5},${cy} ${cx + 5},${cy}" fill="${ROSE}"/>`;
      s += `<polygon points="${cx},${cy + 16} ${cx - 5},${cy} ${cx + 5},${cy}" fill="${SKY}"/>`;
    } else {
      s += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#C33C72" font-size="16">?</text>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
    return `<svg viewBox="0 0 330 176" width="330" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${s}<text x="165" y="164" text-anchor="middle" fill="${INK}" font-size="11">${opt.caption || 'a compass'}</text>
    </svg>`;
  }

  function electromagnetSvg(turns) {
    const n = turns || 5;
    let coil = '';
    for (let i = 0; i < n; i++) coil += `<ellipse cx="${112 + i * 22}" cy="96" rx="7" ry="24" fill="none" stroke="#C98A1C" stroke-width="3"/>`;
    const lastX = 112 + (n - 1) * 22;
    return `<svg viewBox="0 0 330 200" width="330" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="96" y="88" width="150" height="16" fill="#C9C2B4" stroke="${INK}" stroke-width="2"/>
      <polygon points="246,88 268,96 246,104" fill="#C9C2B4" stroke="${INK}" stroke-width="2"/>
      ${coil}
      <path d="M 112 72 L 112 50 L 56 50 L 56 168 L 274 168 L 274 50 L ${lastX} 50 L ${lastX} 72" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <rect x="150" y="151" width="34" height="34" fill="#FFFDFE"/>
      <line x1="162" y1="155" x2="162" y2="181" stroke="${INK}" stroke-width="2.5"/>
      <line x1="172" y1="161" x2="172" y2="175" stroke="${INK}" stroke-width="6"/>
      <line x1="150" y1="168" x2="162" y2="168" stroke="${INK}" stroke-width="2.5"/>
      <line x1="172" y1="168" x2="184" y2="168" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="284" cy="96" rx="9" ry="5" fill="none" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="300" cy="104" rx="9" ry="5" fill="none" stroke="${INK}" stroke-width="2"/>
      <text x="171" y="42" text-anchor="middle" fill="#9A6A0F" font-size="11">${n} turns of wire</text>
      <text x="171" y="126" text-anchor="middle" fill="${INK}" font-size="11">iron nail</text>
      <text x="165" y="194" text-anchor="middle" fill="${INK}" font-size="11">an electromagnet</text>
    </svg>`;
  }

  const clipTable = (rows) => `<table class="data"><tr><th>turns of wire</th><th>paper clips picked up</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>`;

  /* ---------- question makers ---------- */
  function magneticQ() {
    const m = R.pick(MATERIALS);
    const correct = m.mag ? 'Magnetic' : 'Not magnetic';
    const c = choice(correct, ['Magnetic', 'Not magnetic'], 2);
    return {
      prompt: `Is <b>${m.m}</b> attracted to a magnet?`,
      answer: ans(c),
      hint: 'Only four metals are magnetic: iron, steel, nickel and cobalt. Every other metal — and everything that is not a metal — is not.',
      working: [
        '<b>Picture:</b> a magnet sticks to the fridge door (steel) but not to an aluminium can.',
        `1. Is ${m.m} iron, steel, nickel or cobalt? ${m.mag ? 'Yes.' : 'No.'}`,
        `So it is <b>${correct.toLowerCase()}</b>.`,
      ],
      finalAnswer: correct, skill: 'materials',
    };
  }
  function magneticListQ() {
    const mag = MATERIALS.filter((m) => m.mag), non = MATERIALS.filter((m) => !m.mag);
    const askMag = R.chance(0.5);
    const want = askMag ? R.pick(mag).m : R.pick(non).m;
    const wrongs = (askMag ? non : mag).map((x) => x.m);
    const c = choice(want, wrongs, 4);
    return {
      prompt: `Which of these <b>${askMag ? 'IS' : 'is NOT'}</b> attracted to a magnet?`,
      answer: ans(c),
      hint: 'The magnetic four: iron, steel, nickel, cobalt. Not aluminium, not copper, not gold.',
      working: ['<b>Picture:</b> a fridge magnet sticks to a steel fridge but slides off an aluminium ladder.', `Only iron, steel, nickel and cobalt are magnetic.`, `So the answer is <b>${want}</b>.`],
      finalAnswer: want, skill: 'materials',
    };
  }
  function polesQ() {
    const a = R.pick(['N', 'S']), b = R.pick(['N', 'S']);
    const same = a === b;
    const correct = same ? 'They push apart (repel)' : 'They pull together (attract)';
    const c = choice(correct, ['They push apart (repel)', 'They pull together (attract)'], 2);
    return {
      visual: twoMagnetsSvg(a === 'N' ? 'S' : 'N', b),
      prompt: `A <b>${a} pole</b> is brought up to a <b>${b} pole</b>. What happens?`,
      answer: ans(c),
      hint: 'Like poles repel, unlike poles attract. Say it like "same pushes away".',
      working: [
        '<b>Picture:</b> two fridge magnets — flip one over and it suddenly grips instead of sliding away.',
        `1. The two facing poles are ${a} and ${b}.`,
        `2. They are ${same ? 'the SAME' : 'DIFFERENT'}.`,
        `${same ? 'Like poles <b>repel</b>.' : 'Unlike poles <b>attract</b>.'}`,
      ],
      finalAnswer: correct, skill: 'poles',
    };
  }
  function poleFact() {
    const q = R.pick([
      { p: 'What are the two ends of a magnet called?', a: 'The north pole and the south pole', w: ['The positive and negative ends', 'The strong end and the weak end', 'The top and the bottom'] },
      { p: 'What happens when two <b>like</b> poles meet (N and N)?', a: 'They repel — they push apart', w: ['They attract — they pull together', 'Nothing happens', 'They swap over'] },
      { p: 'What happens when two <b>unlike</b> poles meet (N and S)?', a: 'They attract — they pull together', w: ['They repel — they push apart', 'Nothing happens', 'They cancel out'] },
      { p: 'Where is a bar magnet\'s pull the <b>strongest</b>?', a: 'At the two poles (the ends)', w: ['In the middle', 'All the way along equally', 'Just outside the middle'] },
      { p: 'A magnet is cut in half. What do you get?', a: 'Two smaller magnets, each with a N and a S pole', w: ['One N magnet and one S magnet', 'Two pieces that are no longer magnetic', 'One magnet and one piece of ordinary iron'] },
      { p: 'What is the only sure test that a bar really is a magnet (not just iron)?', a: 'It <b>repels</b> one end of a known magnet', w: ['It attracts a known magnet', 'It sticks to the fridge', 'It is made of metal'] },
      { p: 'How should bar magnets be stored?', a: 'In pairs, N next to S, with iron keepers across the ends', w: ['Loose in a drawer with the N poles together', 'In water', 'Standing up in the sun'] },
      { p: 'What can make a magnet lose its magnetism?', a: 'Dropping it, hammering it or heating it', w: ['Keeping it in a box', 'Putting it near iron keepers', 'Wiping it clean'] },
      { p: 'A paper clip is left stuck to a magnet, then picks up a second clip. Why?', a: 'The clip has been turned into a temporary magnet', w: ['The clip is now permanently a magnet', 'The clip is charged with static', 'Paper clips always stick together'] },
      { p: 'What is the difference between a permanent magnet and a temporary one?', a: 'A temporary magnet only works while it is near a magnet or has current flowing', w: ['A temporary magnet is smaller', 'A permanent magnet has only one pole', 'There is no difference'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Like poles repel, unlike attract — and only a magnet can REPEL another magnet.',
      working: ['<b>Picture:</b> two fridge magnets pushing apart, then flipping one over so they snap together.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'poles',
    };
  }
  function fieldQ() {
    const q = R.pick([
      { p: 'What do we call the space around a magnet where it can push or pull?', a: 'its magnetic field', w: ['its magnetic pole', 'its current', 'its charge'] },
      { p: 'Which way do the field lines point outside a magnet?', a: 'From the north pole round to the south pole', w: ['From the south pole round to the north pole', 'Straight up', 'Towards the middle of the magnet'] },
      { p: 'What does it mean when the field lines are drawn <b>close together</b>?', a: 'The field is stronger there', w: ['The field is weaker there', 'The magnet is broken', 'There is no field there'] },
      { p: 'How can you show the field around a magnet in the lab?', a: 'Sprinkle iron filings on paper over the magnet', w: ['Pour water over the magnet', 'Shine a torch on it', 'Weigh it on scales'] },
      { p: 'Do magnetic field lines ever cross each other?', a: 'No, never', w: ['Yes, at the poles', 'Yes, in the middle', 'Only in a strong magnet'] },
      { p: 'What does the arrow on a field line show?', a: 'The way the north end of a compass needle would point', w: ['How strong the magnet is', 'Which way the magnet will move', 'The direction of the current'] },
      { p: 'Can a magnetic field pass through a sheet of paper or a plastic ruler?', a: 'Yes — the field passes straight through non-magnetic materials', w: ['No, paper blocks it completely', 'Only if the paper is wet', 'Only through metal'] },
      { p: 'What happens to the field as you move further away from a magnet?', a: 'It gets weaker', w: ['It gets stronger', 'It stays exactly the same', 'It reverses direction'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: fieldSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Field lines always leave the N pole and come back into the S pole, and they are closest together at the poles.',
      working: [
        '<b>Picture:</b> iron filings sprinkled on paper make lines that loop from one end round to the other.',
        'Lines go <b>N → S</b> outside the magnet, and are <b>closest at the poles</b> where the field is strongest.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'field',
    };
  }
  function fieldPointQ() {
    const spot = R.pick([
      { L: 'A', where: 'right at the north pole', ans: 'Strongest — the lines are packed closest there' },
      { L: 'C', where: 'out beyond the south pole', ans: 'Strongest — the lines are packed closest there' },
      { L: 'B', where: 'far above the middle', ans: 'Weakest — the lines are far apart there' },
    ]);
    const c = choice(spot.ans, ['Strongest — the lines are packed closest there', 'Weakest — the lines are far apart there', 'There is no field there at all'], 3);
    return {
      visual: fieldSvg({ letters: true, caption: 'iron filings show the field lines' }),
      prompt: `Look at point <b>${spot.L}</b> (${spot.where}). Is the magnetic field strongest or weakest there?`,
      answer: ans(c),
      hint: 'Where the lines are squashed together, the field is strong. Where they spread out, it is weak.',
      working: [
        '<b>Picture:</b> lots of iron filings crowd round the ends of the magnet, and hardly any sit far away.',
        `1. At ${spot.L} the field lines are ${spot.L === 'B' ? 'spread far apart' : 'packed close together'}.`,
        `So the field is <b>${spot.L === 'B' ? 'weakest' : 'strongest'}</b> there.`,
      ],
      finalAnswer: spot.ans, skill: 'field',
    };
  }
  function compassQ() {
    const q = R.pick([
      { p: 'What does the north end of a compass needle point to when it is well away from any magnet?', a: 'North — it lines up with Earth\'s magnetic field', w: ['South', 'Straight down', 'Towards the sun'] },
      { p: 'Why does a compass work at all?', a: 'The needle is a tiny magnet, and Earth is a giant magnet', w: ['The needle is made of copper', 'The needle follows the sun', 'The needle is pushed by the wind'] },
      { p: 'A compass is put next to the <b>north</b> pole of a bar magnet. Which way does the needle\'s north end point?', a: 'Away from the magnet — like poles repel', w: ['Straight at the magnet\'s north pole', 'Straight up', 'It spins round and round'] },
      { p: 'A compass is put next to the <b>south</b> pole of a bar magnet. Which way does the needle\'s north end point?', a: 'Straight at the magnet — unlike poles attract', w: ['Away from the magnet', 'Straight up', 'It stops working'] },
      { p: 'Why should you keep a compass away from a strong magnet?', a: 'The magnet\'s field is much stronger than Earth\'s, so the needle points at it instead', w: ['The magnet melts the needle', 'The compass is not magnetic', 'It makes the compass heavier'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: /bar magnet/.test(q.p) ? compassSvg({ magnet: true, leftPole: /north/.test(q.p) ? 'S' : 'N', caption: 'a compass next to a bar magnet' }) : compassSvg({ needle: true, caption: 'a compass on its own' }),
      prompt: q.p, answer: ans(c),
      hint: 'A compass needle is just a tiny bar magnet that is free to spin. Like poles repel, unlike attract.',
      working: [
        '<b>Picture:</b> a tiny magnet floating on a pivot, free to swing round.',
        '1. Earth behaves like a giant bar magnet, so the needle lines up with its field.',
        '2. Bring a real magnet close and its field wins, so the needle swings to that instead.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'compass',
    };
  }
  function electromagnetQ() {
    const q = R.pick([
      { p: 'What is an <b>electromagnet</b>?', a: 'A coil of wire round an iron core that becomes a magnet when current flows', w: ['A magnet made of plastic', 'A magnet that never switches off', 'A battery with a magnet inside'] },
      { p: 'What is the big advantage of an electromagnet over an ordinary magnet?', a: 'You can switch it on and off', w: ['It is always stronger', 'It never needs electricity', 'It works without a core'] },
      { p: 'What happens to an electromagnet when the switch is opened?', a: 'It stops being a magnet and drops whatever it was holding', w: ['It stays magnetic forever', 'It gets stronger', 'It becomes a permanent magnet'] },
      { p: 'Why is the core of an electromagnet made of <b>iron</b>?', a: 'Iron makes the magnetic field much stronger', w: ['Iron is cheap', 'Iron stops the wire getting hot', 'Iron is an insulator'] },
      { p: 'A scrapyard crane picks up cars and then drops them into a pile. What must it be using?', a: 'An electromagnet', w: ['A permanent bar magnet', 'A compass', 'Static electricity'] },
      { p: 'What makes the magnetic field appear in an electromagnet?', a: 'The current flowing through the coil of wire', w: ['The iron nail on its own', 'The plastic covering on the wire', 'Static electricity on the coil'] },
      { p: 'What happens to an electromagnet if the cell is connected the other way round?', a: 'It still works, but the north and south poles swap ends', w: ['It stops working', 'It gets much stronger', 'The nail melts'] },
      { p: 'Where is an electromagnet used inside a doorbell?', a: 'It pulls an iron arm across to hit the bell', w: ['It lights the bulb', 'It measures the current', 'It stores the charge'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: electromagnetSvg(5),
      prompt: q.p, answer: ans(c),
      hint: 'Current through a coil makes a magnetic field. Switch the current off and the magnetism goes.',
      working: [
        '<b>Picture:</b> a scrapyard crane lifting a car, then switching off to drop it.',
        '1. Current in the coil makes a magnetic field.',
        '2. An iron core makes that field much stronger.',
        '3. No current → no magnetism.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'electromagnet',
    };
  }
  function strongerQ() {
    const good = STRONGER.filter((x) => x.ok), bad = STRONGER.filter((x) => !x.ok);
    const g = R.pick(good);
    const c = choice(g.s, bad.map((x) => x.s), 4);
    return {
      visual: electromagnetSvg(R.pick([4, 5, 6])),
      prompt: 'Which of these would make this electromagnet <b>stronger</b>?',
      answer: ans(c),
      hint: 'Three things make it stronger: more turns, more current (more cells), and an iron core.',
      working: [
        '<b>Picture:</b> more loops of wire and a harder push = a stronger magnet.',
        'To strengthen an electromagnet: <b>more turns</b>, <b>more current</b>, <b>iron core</b>.',
        `So: <b>${g.s}</b>.`,
      ],
      finalAnswer: g.s, skill: 'electromagnet',
    };
  }
  function coilData() {
    const per = R.pick([2, 3, 4]);
    const rows = [10, 20, 30].map((t) => [t, t / 10 * per]);
    const next = 40;
    return {
      visual: clipTable(rows),
      prompt: `Harper tested her electromagnet with different numbers of turns. Using the pattern, how many paper clips should <b>${next} turns</b> pick up?`,
      answer: { type: 'number', value: next / 10 * per, unit: 'clips', placeholder: 'e.g. 12' },
      hint: 'Look at what happens each time she adds 10 turns.',
      working: [
        '<b>Picture:</b> every extra 10 turns adds the same number of clips.',
        `1. 10 turns → ${per} clips, 20 turns → ${2 * per}, 30 turns → ${3 * per}.`,
        `2. Each 10 turns adds ${per} clips.`,
        `3. 40 turns → ${4 * per} clips.`,
      ],
      finalAnswer: `${next / 10 * per} clips`, skill: 'electromagnet',
    };
  }
  function usesQ() {
    const u = R.pick(USES);
    const c = choice(u.why, USES.filter((x) => x.why !== u.why).map((x) => x.why), 4);
    return {
      prompt: `Why is a magnet used in <b>${u.u}</b>?`,
      answer: ans(c),
      hint: 'Ask what job the magnet is doing: holding, pointing, lifting, or making something move.',
      working: [`<b>Picture:</b> ${u.u}.`, `The magnet is there because <b>${u.why}</b>.`],
      finalAnswer: u.why, skill: 'uses',
    };
  }
  function magnetOrIron() {
    const c = choice('Hold each end near a known magnet — only a magnet will REPEL it', ['See if it picks up paper clips', 'See if it sticks to the fridge', 'Check whether it is shiny'], 4);
    return {
      prompt: 'Harper has two identical grey bars. One is a magnet, one is just iron. How can she be sure which is which?',
      answer: ans(c),
      hint: 'Both bars will attract each other. Only one thing can happen with a magnet and nothing else.',
      working: [
        '<b>Picture:</b> plain iron is always attracted — it can never push away.',
        '1. Attraction is no help: iron is attracted to a magnet, and a magnet is attracted to iron.',
        '2. <b>Repulsion</b> only happens between two magnets, like pole to like pole.',
        'So test for a push, not a pull.',
      ],
      finalAnswer: 'Test for repulsion — only a magnet repels a magnet', skill: 'poles',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('The steel cans — steel is magnetic, aluminium is not', ['The aluminium cans — aluminium is a metal', 'Both, because all metals are magnetic', 'Neither, magnets do not work on cans'], 4);
      return {
        prompt: 'At a recycling plant a big magnet is swung over the mixed cans. Which cans does it pick up?',
        answer: ans(c),
        hint: 'Only four metals are magnetic — is aluminium one of them?',
        working: [
          '<b>Picture:</b> a magnet stuck to a fridge but sliding off a ladder.',
          '1. Magnetic metals: <b>iron, steel, nickel, cobalt</b>.',
          '2. Aluminium is a metal, but it is NOT magnetic.',
          'So the magnet lifts out the <b>steel</b> cans and leaves the aluminium behind — a neat way to sort them.',
        ],
        finalAnswer: 'The steel cans',
      };
    },
    () => {
      const a = R.pick(['N', 'S']), b = R.pick(['N', 'S']);
      const same = a === b;
      const c = choice(same ? 'It slides away — like poles repel' : 'It snaps together — unlike poles attract', ['It slides away — like poles repel', 'It snaps together — unlike poles attract'], 2);
      return {
        visual: twoMagnetsSvg(a === 'N' ? 'S' : 'N', b),
        prompt: `Harper slides one magnet towards another so that a <b>${a} pole</b> faces a <b>${b} pole</b>. What does she feel?`,
        answer: ans(c),
        hint: 'Same letters push apart; different letters pull together.',
        working: ['<b>Picture:</b> two fridge magnets — flip one over and everything changes.', `1. Facing poles: ${a} and ${b} — ${same ? 'the same' : 'different'}.`, `So they <b>${same ? 'repel (push apart)' : 'attract (snap together)'}</b>.`],
        finalAnswer: same ? 'They repel' : 'They attract',
      };
    },
    () => {
      const c = choice('Sprinkle iron filings on paper laid over the magnet and tap it', ['Pour water on it', 'Shine a light through it', 'Weigh it before and after'], 4);
      return {
        visual: fieldSvg({ caption: 'the pattern the filings make' }),
        prompt: 'How can Harper make the magnetic field around a bar magnet visible in class?',
        answer: ans(c),
        hint: 'You need something tiny and magnetic that will line up with the field.',
        working: [
          '<b>Picture:</b> thousands of tiny compass needles all lining up at once.',
          '1. Lay paper over the magnet and sprinkle <b>iron filings</b>.',
          '2. Tap the paper so the filings can turn.',
          '3. They line up along the field lines — closest together at the <b>poles</b>, where the field is strongest.',
        ],
        finalAnswer: 'Iron filings on paper over the magnet',
      };
    },
    () => {
      const per = R.pick([2, 3, 4]);
      const rows = [10, 20, 30].map((t) => [t, t / 10 * per]);
      return {
        visual: clipTable(rows),
        prompt: `Harper wraps more and more wire round her nail and counts the paper clips it lifts. What does her data show, and how many clips would 50 turns lift?`,
        answer: { type: 'number', value: 5 * per, unit: 'clips', placeholder: 'e.g. 15' },
        hint: 'Find how many clips each extra 10 turns adds, then keep the pattern going.',
        working: [
          '<b>Picture:</b> each extra loop of wire adds to the magnetic field.',
          `1. Every 10 extra turns adds ${per} more clips.`,
          '2. More turns = a stronger electromagnet.',
          `3. 50 turns → 5 × ${per} = <b>${5 * per} clips</b>.`,
          'Fair test: same nail, same cell, same wire, same paper clips.',
        ],
        finalAnswer: `${5 * per} clips`,
      };
    },
    () => {
      const c = choice('It must be an electromagnet, so it can be switched off to drop the load', ['It is a very strong bar magnet', 'It uses static electricity', 'It is a compass'], 4);
      return {
        visual: electromagnetSvg(5),
        prompt: 'A scrapyard crane lifts a car, swings it over the pile and drops it. What kind of magnet must it use, and why?',
        answer: ans(c),
        hint: 'A permanent magnet would never let go.',
        working: [
          '<b>Picture:</b> the crane holds the car while the current is on, then lets go the moment it is switched off.',
          '1. A permanent magnet cannot be turned off.',
          '2. An <b>electromagnet</b> is only magnetic while current flows.',
          '3. Open the switch → no field → the car drops.',
        ],
        finalAnswer: 'An electromagnet — it can be switched off',
      };
    },
    () => {
      const c = choice('Add more turns, add another cell, and keep the iron core', ['Use fewer turns and a smaller cell', 'Swap the nail for a plastic rod', 'Add a resistor'], 4);
      return {
        visual: electromagnetSvg(4),
        prompt: 'Harper\'s electromagnet only lifts 3 paper clips. Give three ways to make it stronger.',
        answer: ans(c),
        hint: 'Three levers: number of turns, size of the current, and what the core is made of.',
        working: [
          '<b>Picture:</b> more loops + a bigger push + iron in the middle.',
          '1. <b>More turns</b> of wire on the coil.',
          '2. <b>More current</b> — add another cell.',
          '3. Keep an <b>iron core</b> (a plastic rod would make it far weaker).',
        ],
        finalAnswer: 'More turns, more current, iron core',
      };
    },
    () => {
      const c = choice('It points at the magnet instead, because the magnet\'s field is much stronger than Earth\'s', ['It carries on pointing north', 'It stops working forever', 'It points straight down'], 4);
      return {
        visual: compassSvg({ magnet: true, leftPole: 'N', caption: 'a compass beside a bar magnet' }),
        prompt: 'Harper puts her compass next to a strong bar magnet. What happens to the needle?',
        answer: ans(c),
        hint: 'The needle lines up with whichever magnetic field is strongest where it sits.',
        working: [
          '<b>Picture:</b> the needle is a tiny magnet free to swing, and it obeys the strongest pull nearby.',
          '1. Earth\'s field is very weak.',
          '2. A bar magnet right next to it is far stronger.',
          'So the needle swings round to line up with the bar magnet. Move it away and it points north again.',
        ],
        finalAnswer: 'It swings round to point at the magnet',
      };
    },
    () => {
      const c = choice('Two smaller magnets, each with its own north and south pole', ['One north magnet and one south magnet', 'Two pieces of ordinary iron', 'One magnet and one non-magnet'], 4);
      return {
        visual: fieldSvg({ caption: 'what if you cut it in half?' }),
        prompt: 'Harper snaps a bar magnet in half. What does she end up with?',
        answer: ans(c),
        hint: 'You can never get a north pole on its own.',
        working: [
          '<b>Picture:</b> every magnet, however small, has two ends.',
          '1. Poles always come in pairs.',
          '2. Breaking a magnet makes two new complete magnets.',
          'Each half now has its own N and S.',
        ],
        finalAnswer: 'Two smaller magnets, each with a N and a S pole',
      };
    },
    () => {
      const c = choice('Hold it near a known magnet and look for a PUSH', ['See whether it attracts the known magnet', 'See whether it is heavy', 'Check whether it is made of metal'], 4);
      return {
        prompt: 'Two grey bars look identical. One is a magnet and one is plain iron. What test tells Harper which is which?',
        answer: ans(c),
        hint: 'Both will be attracted to each other — so attraction proves nothing.',
        working: [
          '<b>Picture:</b> plain iron can only ever be pulled, never pushed away.',
          '1. Iron is attracted to a magnet, and a magnet is attracted to iron — so a pull tells you nothing.',
          '2. Only two magnets can <b>repel</b> (like pole to like pole).',
          'So look for a push.',
        ],
        finalAnswer: 'Look for repulsion (a push)',
      };
    },
    () => {
      const c = choice('Earth behaves like a giant bar magnet, and the needle lines up with its field', ['The needle follows the sun', 'North is downhill', 'The needle is pushed by the wind'], 4);
      return {
        visual: compassSvg({ needle: true, caption: 'a compass away from any magnet' }),
        prompt: 'Tramping in the Southern Alps, Harper\'s compass needle always swings back to the same direction. Why?',
        answer: ans(c),
        hint: 'What is the biggest magnet she is standing on?',
        working: [
          '<b>Picture:</b> a giant bar magnet buried inside the Earth.',
          '1. The needle is a tiny magnet, free to spin.',
          '2. It lines up with <b>Earth\'s magnetic field</b>.',
          'That is why the same end always ends up pointing north — as long as no other magnet or iron is nearby.',
        ],
        finalAnswer: 'Earth is a giant magnet and the needle lines up with its field',
      };
    },
    () => {
      const u = R.pick(USES);
      const c = choice(u.why, USES.filter((x) => x.why !== u.why).map((x) => x.why), 4);
      return {
        prompt: `Harper is listing where magnets are used at home. She writes down <b>${u.u}</b>. What is the magnet doing there?`,
        answer: ans(c),
        hint: 'Is it holding something, pointing, lifting, or making something move?',
        working: [`<b>Picture:</b> ${u.u}.`, `The magnet is there because <b>${u.why}</b>.`],
        finalAnswer: u.why,
      };
    },
  ];

  HL.registerTopic({
    id: 'magnetism', subject: 'science', strand: 'physical', order: 7,
    name: 'Magnetism', short: 'Magnetism', animal: 'bee',
    blurb: 'Poles, fields, compasses and electromagnets — and why only some metals stick.',
    example: 'like poles repel · unlike poles attract',
    learn: {
      what: '<p>Only four metals are <b>magnetic</b>: <b>iron, steel, nickel</b> and <b>cobalt</b>. Every other metal (aluminium, copper, gold) and everything that is not a metal is <b>not</b> magnetic.</p><p>Every magnet has two <b>poles</b>, north and south. <b>Like poles repel; unlike poles attract.</b> The space around a magnet where it can push or pull is its <b>magnetic field</b>, drawn as lines that leave the <b>N</b> pole and loop round into the <b>S</b> pole. The lines are closest together at the poles, because that is where the field is strongest.</p><p>Wind a coil of wire round an iron nail and switch on a current and you have an <b>electromagnet</b> — a magnet you can turn off.</p><p><b>Picture for this topic:</b> <b>two fridge magnets</b>. One way round they snap together; flip one over and they shove each other away.</p>',
      visual: `<svg viewBox="0 0 350 214" width="350" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
        <text x="175" y="14" text-anchor="middle" fill="#4A4033" font-size="12">field lines go N → S, closest at the poles</text>
        <text x="175" y="31" text-anchor="middle" fill="#9A6A0F" font-size="10.5">magnetic metals: iron &#183; steel &#183; nickel &#183; cobalt</text>
        ${[[-4, 44], [24, 58], [52, 72]].map((pair) => {
          const c = pair[0], peak = pair[1];
          return `<path d="M 108 90 Q 175 ${c} 242 90" fill="none" stroke="#4A4033" stroke-width="1.6"/>` +
            `<polygon points="182,${peak} 172,${peak - 5} 172,${peak + 5}" fill="#4A4033"/>` +
            `<path d="M 108 112 Q 175 ${202 - c} 242 112" fill="none" stroke="#4A4033" stroke-width="1.6"/>` +
            `<polygon points="182,${202 - peak} 172,${197 - peak} 172,${207 - peak}" fill="#4A4033"/>`;
        }).join('')}
        <rect x="108" y="80" width="67" height="42" fill="#E0568C" stroke="#4A4033" stroke-width="2.5"/>
        <rect x="175" y="80" width="67" height="42" fill="#5F98C4" stroke="#4A4033" stroke-width="2.5"/>
        <text x="141" y="107" text-anchor="middle" fill="#FFFFFF" font-size="17">N</text>
        <text x="208" y="107" text-anchor="middle" fill="#FFFFFF" font-size="17">S</text>
        <rect x="8" y="152" width="164" height="54" rx="10" fill="#FDECF3" stroke="#E0568C" stroke-width="2"/>
        <text x="90" y="172" text-anchor="middle" fill="#C33C72" font-size="11.5">N–N or S–S → REPEL</text>
        <text x="90" y="192" text-anchor="middle" fill="#C33C72" font-size="10.5">(same pushes away)</text>
        <rect x="180" y="152" width="162" height="54" rx="10" fill="#E7F2FB" stroke="#5F98C4" stroke-width="2"/>
        <text x="261" y="172" text-anchor="middle" fill="#3C6E96" font-size="11.5">N–S → ATTRACT</text>
        <text x="261" y="192" text-anchor="middle" fill="#3C6E96" font-size="10.5">(opposites pull together)</text>
        
      </svg>`,
      facts: [
        'Magnetic materials: <b>iron, steel, nickel, cobalt</b>. Aluminium, copper, gold, plastic and wood are <b>not</b>.',
        'Every magnet has a <b>north</b> and a <b>south</b> pole — you can never have just one.',
        '<b>Like poles repel. Unlike poles attract.</b>',
        'The <b>magnetic field</b> is the space where the magnet can push or pull. Lines go <b>N → S</b> outside the magnet and never cross.',
        'The field is <b>strongest at the poles</b> — that is where the lines are closest together.',
        'A <b>compass</b> needle is a tiny magnet; it lines up with <b>Earth\'s</b> magnetic field and points north.',
        'An <b>electromagnet</b> = coil + current + iron core. Stronger with <b>more turns</b>, <b>more current</b>, and an <b>iron core</b> — and it can be switched <b>off</b>.',
      ],
      steps: [
        'For "will it stick?", ask: "<b>is it iron, steel, nickel or cobalt?</b>" If not, no — even if it is a shiny metal.',
        'For two magnets, write down the two <b>facing</b> poles. Same letters → <b>repel</b>. Different letters → <b>attract</b>.',
        'Draw field lines from <b>N round to S</b>, with an arrow on each. Draw them <b>closest at the poles</b>.',
        'For a compass, remember the needle is a tiny magnet: it swings until its north end points away from a north pole and towards a south pole.',
        'To make an electromagnet stronger, change one of three things: <b>turns</b>, <b>current</b>, <b>core</b>.',
      ],
      examples: [
        {
          q: 'Will a magnet pick up an aluminium drink can?',
          working: ['<b>Picture:</b> a fridge magnet sticks to the fridge but slides off a ladder.', '1. Is aluminium one of the magnetic four (iron, steel, nickel, cobalt)? No.', '2. Being a metal is not enough.'],
          a: 'No — aluminium is not magnetic',
        },
        {
          q: 'A north pole is pushed towards another north pole. What happens?',
          visual: twoMagnetsSvg('S', 'N'),
          working: ['<b>Picture:</b> two fridge magnets shoving each other apart.', '1. What are the facing poles? N and N.', '2. Are they the same? Yes.', '3. Like poles <b>repel</b>.'],
          a: 'They push apart (repel)',
        },
        {
          q: 'Draw and describe the magnetic field around a bar magnet.',
          visual: fieldSvg({ letters: true, caption: 'A and C are at the poles; B is far away' }),
          working: [
            '<b>Picture:</b> iron filings sprinkled on paper over the magnet.',
            '1. Lines leave the <b>N</b> pole and curve round into the <b>S</b> pole.',
            '2. At A and C (the poles) the lines are packed close → the field is <b>strongest</b>.',
            '3. At B, far above the middle, the lines are far apart → the field is <b>weakest</b>.',
            '4. Field lines never cross.',
          ],
          a: 'Lines run N → S, closest (strongest) at the poles',
        },
        {
          q: 'Why does a compass needle point north?',
          visual: compassSvg({ needle: true, caption: 'a compass away from any magnet' }),
          working: ['<b>Picture:</b> a giant bar magnet buried inside the Earth.', '1. The needle is a tiny magnet that can spin freely.', '2. Earth has its own magnetic field.', '3. The needle turns until it lines up with that field.'],
          a: 'It is a tiny magnet lining up with Earth\'s magnetic field',
        },
        {
          q: 'Harper has two identical grey bars. One is a magnet, one is plain iron. How can she tell?',
          working: [
            '<b>Picture:</b> iron can only be pulled; it can never push back.',
            '1. Try attraction: both bars attract each other — that proves nothing.',
            '2. Only two magnets can <b>repel</b>.',
            '3. Hold each end near a known magnet and look for a <b>push</b>.',
          ],
          a: 'Test for repulsion — only a magnet repels a magnet',
        },
        {
          q: 'Harper counts the paper clips her electromagnet can lift as she adds turns. What is the pattern, and how many would 50 turns lift?',
          visual: clipTable([[10, 3], [20, 6], [30, 9], [40, 12]]),
          working: [
            '<b>Picture:</b> each extra loop of wire adds to the field.',
            '1. Every extra 10 turns adds 3 more clips.',
            '2. So more turns = a stronger electromagnet.',
            '3. 50 turns → 5 × 3 = 15 clips.',
            '4. Fair test: same nail, same cell, same wire, same clips.',
          ],
          a: '15 clips — 3 more for every 10 turns',
        },
        {
          q: 'A scrapyard crane lifts a car, then drops it on the pile. Explain how it works and give two ways to make it lift more.',
          visual: electromagnetSvg(5),
          working: [
            '<b>Picture:</b> a coil of wire round a huge iron core.',
            '1. Switch on → current flows → the coil becomes a strong <b>electromagnet</b>.',
            '2. Switch off → no current → no magnetism → the car drops. A permanent magnet could never let go.',
            '3. To lift more: <b>more turns</b> on the coil and <b>more current</b> (a bigger supply). The <b>iron core</b> must stay.',
          ],
          a: 'It is an electromagnet; more turns and more current make it stronger',
        },
      ],
      tips: [
        'Not all metals are magnetic! Aluminium, copper and gold are metals but a magnet ignores them.',
        'Only <b>repulsion</b> proves something is a magnet — plain iron is attracted too.',
        'Field lines are drawn <b>N → S</b> outside the magnet, and they never cross.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [magneticQ, magneticListQ, polesQ, poleFact, fieldQ, usesQ, compassQ]
        : level === 2
          ? [magneticQ, magneticListQ, polesQ, poleFact, fieldQ, fieldPointQ, compassQ, electromagnetQ, strongerQ, usesQ]
          : [magneticListQ, polesQ, poleFact, fieldQ, fieldPointQ, compassQ, electromagnetQ, strongerQ, coilData, magnetOrIron, usesQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
