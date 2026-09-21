/* Topic: Defence & immunity — what a pathogen is and what microbes look like, the
 * body's three lines of defence (barriers, phagocytes, antibodies), antigens,
 * memory cells and immunity, how a vaccine works, and antibiotics vs antiseptics.
 * Living World, order 10. Built to match the Year 8 "Food, disease and microbes" unit. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */

  /** what each kind of microbe actually looks like down a microscope */
  const SHAPES = [
    { key: 'rod', kind: 'bacteria', name: 'a rod (bacillus)', look: 'a tiny stretched sausage or a grain of rice',
      ex: 'the bacteria in salmonella food poisoning and in TB' },
    { key: 'sphere', kind: 'bacteria', name: 'a sphere (coccus)', look: 'a tiny ball, often stuck together in chains or clusters like a bunch of grapes',
      ex: 'the bacteria that cause strep throat and infected cuts' },
    { key: 'spiral', kind: 'bacteria', name: 'a spiral', look: 'a corkscrew or a stretched spring',
      ex: 'the bacteria that cause cholera (a comma shape) and leptospirosis' },
    { key: 'virus', kind: 'viruses', name: 'a package in a coat', look: 'a spiky ball or a tiny lander with legs — a protein coat with instructions folded up inside, and no cell parts at all',
      ex: 'the flu virus, measles and HIV' },
    { key: 'yeast', kind: 'fungi', name: 'a round budding cell', look: 'a fat oval cell with a little bud growing off the side, ready to break away',
      ex: 'the yeast that makes bread rise' },
    { key: 'mould', kind: 'fungi', name: 'fuzzy threads (hyphae)', look: 'a tangle of fine threads with round spore heads on stalks, like tiny lollipops',
      ex: "the grey fuzz on old bread, and athlete's foot" },
  ];

  /** the class disease list: microbe type and how it spreads */
  const DISEASES = [
    { name: "athlete's foot", m: 'a fungus', r: 'touch — bare feet on a wet changing-room floor' },
    { name: 'chickenpox', m: 'a virus', r: 'droplets in the air, and touching the blisters' },
    { name: 'rubella', m: 'a virus', r: 'droplets in the air from coughs and sneezes' },
    { name: 'the common cold', m: 'a virus', r: 'droplets in the air, and hands onto door handles' },
    { name: 'TB (tuberculosis)', m: 'bacteria', r: 'droplets in the air, breathed in from a cough' },
    { name: 'tetanus', m: 'bacteria', r: 'soil getting into a deep cut — not from person to person' },
    { name: 'cholera', m: 'bacteria', r: 'drinking water that sewage has got into' },
    { name: 'salmonella food poisoning', m: 'bacteria', r: 'food — undercooked chicken or eggs, or food left sitting warm' },
    { name: 'malaria', m: 'a parasite carried by mosquitoes', r: 'the bite of an infected mosquito' },
    { name: 'AIDS (caused by HIV)', m: 'a virus', r: 'blood and body fluids — shared needles, or mother to baby' },
    { name: 'the flu', m: 'a virus', r: 'droplets in the air from coughs and sneezes' },
    { name: 'measles', m: 'a virus', r: 'droplets in the air — one of the most catching of all' },
  ];
  const MTYPES = ['a virus', 'bacteria', 'a fungus', 'a parasite carried by mosquitoes'];

  /** first line of defence — the barriers that keep microbes out */
  const BARRIERS = [
    { name: 'the skin', how: 'is a tough unbroken wall that microbes simply cannot get through', pic: 'the fence right round the house', at: [96, 96] },
    { name: 'mucus and tiny hairs in your nose and airways', how: 'trap microbes in sticky snot, and the hairs sweep them back up to be swallowed', pic: 'flypaper with a broom behind it', at: [80, 48] },
    { name: 'stomach acid', how: 'kills almost every microbe you swallow with your food', pic: 'a moat of acid at the door', at: [70, 116] },
    { name: 'tears', how: 'wash microbes out of your eye and carry a chemical that kills them', pic: 'a hose washing down the path', at: [62, 34] },
    { name: 'a scab', how: 'seals a cut within hours so nothing else can get in through the gap', pic: 'a plank nailed over a hole in the fence', at: [92, 132] },
    { name: 'the friendly bacteria on your skin and in your gut', how: 'take up all the space and food, so harmful microbes cannot settle', pic: 'every seat on the bus already taken', at: [76, 150] },
  ];

  /** antibiotic / antiseptic / disinfectant / vaccine — the four that get muddled */
  const MEDICINES = [
    { name: 'an antibiotic', what: 'a medicine you take inside you that kills bacteria', use: 'a bacterial infection like strep throat, once you are already ill',
      no: 'it does nothing at all against a virus', ex: 'penicillin, which came from a mould' },
    { name: 'an antiseptic', what: 'a chemical you put on your skin or on a cut to kill microbes there',
      use: 'cleaning a grazed knee before you put a plaster on', no: 'it is never swallowed, and it does not treat an infection deep inside you', ex: 'antiseptic cream or wipes' },
    { name: 'a disinfectant', what: 'a strong chemical for killing microbes on surfaces, not on people',
      use: 'wiping down the kitchen bench or the lab bench', no: 'far too harsh to put on skin, and never swallowed', ex: 'bleach and bench cleaner' },
    { name: 'a vaccine', what: 'a dead or weakened microbe (or just a harmless piece of one) that trains your defences',
      use: 'protecting you before you ever meet the real microbe', no: 'it is not a cure — it does nothing once you are already ill', ex: 'the measles and tetanus vaccines' },
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

  /** what microbes look like: the three bacterial shapes, a virus, yeast and mould */
  function shapesSvg(highlight) {
    const on = (k) => (highlight === k ? '#E0568C' : INK);
    const w = (k) => (highlight === k ? 3.5 : 2);
    return `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="15" text-anchor="middle" fill="${INK}" font-size="12">what microbes look like</text>
      <text x="54" y="34" text-anchor="middle" fill="#3F6B22" font-size="11">bacteria</text>
      <rect x="18" y="46" width="38" height="16" rx="8" fill="#8FC96E" stroke="${on('rod')}" stroke-width="${w('rod')}"/>
      <text x="54" y="78" text-anchor="middle" fill="${INK}" font-size="10.5">rod</text>
      <circle cx="26" cy="100" r="8" fill="#8FC96E" stroke="${on('sphere')}" stroke-width="${w('sphere')}"/>
      <circle cx="43" cy="100" r="8" fill="#8FC96E" stroke="${on('sphere')}" stroke-width="${w('sphere')}"/>
      <circle cx="60" cy="100" r="8" fill="#8FC96E" stroke="${on('sphere')}" stroke-width="${w('sphere')}"/>
      <text x="54" y="124" text-anchor="middle" fill="${INK}" font-size="10.5">spheres</text>
      <path d="M22 148 q10 -12 19 0 q9 12 19 0" fill="none" stroke="${on('spiral')}" stroke-width="${highlight === 'spiral' ? 5 : 4}" stroke-linecap="round"/>
      <text x="54" y="172" text-anchor="middle" fill="${INK}" font-size="10.5">spiral</text>
      <line x1="104" y1="28" x2="104" y2="184" stroke="#D9BE8A" stroke-width="2"/>
      <text x="162" y="34" text-anchor="middle" fill="#B03068" font-size="11">a virus</text>
      <circle cx="162" cy="92" r="26" fill="#F7D3E2" stroke="${on('virus')}" stroke-width="${w('virus')}"/>
      <path d="M162 66 v-10 M162 118 v10 M136 92 h-10 M188 92 h10 M144 74 l-7 -7 M180 74 l7 -7 M144 110 l-7 7 M180 110 l7 7" stroke="${on('virus')}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M154 84 q9 8 0 16" fill="none" stroke="#B03068" stroke-width="2.5"/>
      <text x="162" y="146" text-anchor="middle" fill="${INK}" font-size="10.5">a coat, with</text>
      <text x="162" y="160" text-anchor="middle" fill="${INK}" font-size="10.5">instructions inside</text>
      <text x="162" y="175" text-anchor="middle" fill="#7A7065" font-size="10">not a cell at all</text>
      <line x1="220" y1="28" x2="220" y2="184" stroke="#D9BE8A" stroke-width="2"/>
      <text x="280" y="34" text-anchor="middle" fill="#C08A10" font-size="11">fungi</text>
      <ellipse cx="270" cy="60" rx="16" ry="12" fill="#E8C24A" stroke="${on('yeast')}" stroke-width="${w('yeast')}"/>
      <circle cx="288" cy="48" r="7" fill="#E8C24A" stroke="${on('yeast')}" stroke-width="${w('yeast')}"/>
      <text x="280" y="86" text-anchor="middle" fill="${INK}" font-size="10.5">yeast, budding</text>
      <path d="M236 144 h84 M250 144 v-24 M276 144 v-30 M302 144 v-20" stroke="${on('mould')}" stroke-width="${w('mould')}" fill="none" stroke-linecap="round"/>
      <circle cx="250" cy="116" r="7" fill="#B9A5E6" stroke="${on('mould')}" stroke-width="2"/>
      <circle cx="276" cy="110" r="7" fill="#B9A5E6" stroke="${on('mould')}" stroke-width="2"/>
      <circle cx="302" cy="120" r="7" fill="#B9A5E6" stroke="${on('mould')}" stroke-width="2"/>
      <text x="280" y="162" text-anchor="middle" fill="${INK}" font-size="10.5">mould: threads</text>
      <text x="280" y="176" text-anchor="middle" fill="#7A7065" font-size="10">+ spore heads</text>
      <text x="170" y="204" text-anchor="middle" fill="#7A7065" font-size="10.5">bacteria and fungi are cells \u00B7 a virus is not</text>
    </svg>`;
  }

  /** the three lines of defence, as a corridor the microbe has to get through */
  function linesSvg(highlight) {
    const rows = [
      { key: 1, t: '1st line: keep them OUT', s: 'skin · mucus + hairs · stomach acid · tears · scabs', c: '#8FC96E' },
      { key: 2, t: '2nd line: EAT the ones that get in', s: 'phagocytes — white blood cells that eat microbes', c: '#A9D8F5' },
      { key: 3, t: '3rd line: TAG them, and REMEMBER', s: 'antibodies lock on · memory cells remember', c: '#F7D3E2' },
    ];
    const bars = rows.map((r, i) => {
      const y = 36 + i * 52, on = highlight === r.key;
      return `<rect x="16" y="${y}" width="308" height="44" rx="12" fill="${r.c}" stroke="${on ? '#E0568C' : INK}" stroke-width="${on ? 3.5 : 2}"/>
        <text x="28" y="${y + 19}" fill="${INK}" font-size="11.5">${r.t}</text>
        <text x="28" y="${y + 35}" fill="#4A4033" font-size="10.5" font-weight="400">${r.s}</text>`;
    }).join('');
    return `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="22" text-anchor="middle" fill="${INK}" font-size="12">three lines of defence, in order</text>
      ${bars}
      <text x="170" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">a microbe has to beat all three</text>
    </svg>`;
  }

  /** antibody + antigen: the right shape locks on, the wrong shape does not */
  function antibodySvg(fit) {
    /* a Y whose fork points DOWN, straddling the antigen on top of the microbe */
    const yShape = (cx, col) => `<path d="M${cx} 44 v16 M${cx} 60 l-15 14 M${cx} 60 l15 14" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12">one antibody fits one antigen</text>
      <text x="84" y="36" text-anchor="middle" fill="#B03068" font-size="11">right shape \u2713</text>
      ${yShape(84, '#E0568C')}
      <path d="M71 92 l0 -14 l13 -8 l13 8 l0 14" fill="#3F6B22" stroke="${INK}" stroke-width="2"/>
      <circle cx="84" cy="126" r="34" fill="#8FC96E" stroke="${INK}" stroke-width="2.5"/>
      <text x="84" y="131" text-anchor="middle" fill="#FFFFFF" font-size="11">microbe</text>
      <text x="84" y="180" text-anchor="middle" fill="#3F6B22" font-size="11">pointed ANTIGEN</text>
      <text x="84" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">locks on \u2713</text>
      <line x1="170" y1="30" x2="170" y2="188" stroke="#D9BE8A" stroke-width="2"/>
      <text x="256" y="36" text-anchor="middle" fill="#7A7065" font-size="11">same antibody \u2717</text>
      ${yShape(256, '#B0A79A')}
      <circle cx="256" cy="84" r="12" fill="#2F6FD0" stroke="${INK}" stroke-width="2"/>
      <circle cx="256" cy="126" r="34" fill="#A9D8F5" stroke="${INK}" stroke-width="2.5"/>
      <text x="256" y="131" text-anchor="middle" fill="#FFFFFF" font-size="11">another</text>
      <text x="256" y="180" text-anchor="middle" fill="#B03068" font-size="11">round ANTIGEN</text>
      <text x="256" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">will not fit \u2717</text>
      <text x="170" y="210" text-anchor="middle" fill="${INK}" font-size="10.5">${fit ? 'the key fits this lock only' : 'wrong shape \u2192 the key will not turn'}</text>
    </svg>`;
  }

  /** antibody level: slow and small the first time, fast and huge the second */
  function memorySvg() {
    return `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="15" text-anchor="middle" fill="${INK}" font-size="12">antibodies in the blood</text>
      <line x1="38" y1="26" x2="38" y2="156" stroke="${INK}" stroke-width="2"/>
      <line x1="38" y1="156" x2="322" y2="156" stroke="${INK}" stroke-width="2"/>
      <text x="16" y="96" fill="#7A7065" font-size="10.5" transform="rotate(-90 16 96)">how many</text>
      <path d="M38 156 L70 154 L104 118 L138 128 L170 146 L186 148" fill="none" stroke="#2F6FD0" stroke-width="3.5"/>
      <path d="M186 148 L196 40 L222 34 L262 62 L322 96" fill="none" stroke="#E0568C" stroke-width="3.5"/>
      <line x1="60" y1="156" x2="60" y2="168" stroke="#3F6B22" stroke-width="3"/>
      <text x="60" y="182" text-anchor="middle" fill="#3F6B22" font-size="10.5">1st time</text>
      <line x1="192" y1="156" x2="192" y2="168" stroke="#3F6B22" stroke-width="3"/>
      <text x="196" y="182" text-anchor="middle" fill="#3F6B22" font-size="10.5">2nd time</text>
      <text x="96" y="86" fill="#2F6FD0" font-size="10.5">slow, small</text>
      <text x="96" y="100" fill="#2F6FD0" font-size="10.5">→ you get ill</text>
      <text x="318" y="120" text-anchor="end" fill="#B03068" font-size="10.5">fast and huge</text>
      <text x="318" y="134" text-anchor="end" fill="#B03068" font-size="10.5">→ no illness</text>
      <text x="170" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">that difference is what IMMUNITY means</text>
    </svg>`;
  }

  /* ---------- question generators ---------- */

  function pathogenQ(level) {
    const forms = [
      { p: 'What is a <b>pathogen</b>?', a: 'a microbe that causes disease', w: ['any microbe at all, harmful or not', 'a medicine that kills microbes', 'a white blood cell'] },
      { p: 'Is every microbe a pathogen?', a: 'No — only the small number that cause disease. Most microbes are useful or harmless', w: ['Yes, every microbe causes disease', 'Yes, but only the bacteria ones', 'No — only viruses are pathogens'] },
      { p: 'What is an <b>infectious disease</b>?', a: 'a disease caused by a pathogen, which can be passed from one person to another', w: ['any disease at all, including a broken leg', 'a disease you are born with', 'a disease caused by eating too much sugar'] },
      { p: 'Which of these is <b>not</b> caused by a pathogen?', a: 'a broken arm from falling off a bike', w: ['chickenpox', 'the flu', "athlete's foot"] },
      { p: 'What is an <b>antigen</b>?', a: 'a marker on the outside of a microbe that your body can recognise', w: ['a chemical your white blood cells fire at microbes', 'another word for a pathogen', 'the medicine you take to kill bacteria'] },
      { p: 'What is an <b>antibody</b>?', a: 'a Y-shaped protein made by your white blood cells that locks onto one particular antigen', w: ['a marker on the outside of a microbe', 'a medicine made from mould', 'a kind of bacteria that lives in your gut'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 4) : forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Pathogen = the trouble-maker. Antigen = its name badge. Antibody = the handcuffs that fit that badge.',
      working: ['<b>Picture:</b> the burglar (pathogen) wears a name badge (antigen), and your body makes handcuffs (antibodies) that only fit that badge.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'words',
    };
  }

  function looksQ(level) {
    const sh = R.pick(SHAPES);
    if (R.chance(0.5)) {
      return {
        visual: shapesSvg(sh.key),
        prompt: `Down a microscope this looks like <b>${sh.look}</b>. What is it?`,
        answer: ch(sh.name, SHAPES.map((x) => x.name), 4),
        hint: 'Bacteria come in rods, spheres and spirals. Yeast buds. Mould makes threads. A virus is not a cell at all.',
        working: [`<b>Picture:</b> ${sh.look}.`, `That is <b>${sh.name}</b> — one of the ${sh.kind}.`, `You would find it in: ${sh.ex}.`],
        finalAnswer: sh.name, skill: 'looks',
      };
    }
    return {
      visual: shapesSvg(sh.key),
      prompt: `What does <b>${sh.name}</b> look like?`,
      answer: ch(sh.look, SHAPES.map((x) => x.look), 4),
      hint: 'Picture the shape, not the name.',
      working: [`<b>${cap(sh.name)}</b> looks like <b>${sh.look}</b>.`, `It is one of the ${sh.kind}. Example: ${sh.ex}.`],
      finalAnswer: sh.look, skill: 'looks',
    };
  }

  function looksGroupQ(level) {
    const forms = [
      { p: 'Bacteria come in three main shapes. Which three?', a: 'rods, spheres and spirals', w: ['squares, triangles and stars', 'threads, buds and spikes', 'they are all exactly the same shape'] },
      { p: 'How can you tell a virus apart from a bacterium under a very powerful microscope?', a: 'A bacterium is a whole cell with a wall and contents; a virus is just a coat with instructions inside, and it is about 20× smaller', w: ['A virus is much bigger and greener', 'A virus has a nucleus and a bacterium does not', 'You cannot — they look identical'] },
      { p: 'What does a <b>mould</b> look like close up?', a: 'a tangle of fine threads with round spore heads on stalks', w: ['a single round cell with a bud', 'a spiky ball with nothing inside', 'a long smooth rod'] },
      { p: 'Yeast is drawn with a little bump on the side. What is the bump?', a: 'a bud — a new yeast cell growing, which will break off', w: ['its nucleus poking out', 'a virus attacking it', 'a spore head full of spores'] },
      { p: 'Why can you see bacteria with a school microscope but never a virus?', a: 'A bacterium is about 2 µm across; a virus is about 0.1 µm, so it needs an electron microscope', w: ['Viruses are transparent, so no microscope shows them', 'Viruses are far bigger and will not fit on a slide', 'Viruses only exist inside sealed containers'] },
      { p: 'Which microbes are made of <b>cells</b>?', a: 'bacteria and fungi — a virus is not a cell', w: ['viruses and bacteria — fungi are not cells', 'all three of them', 'none of them'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 4) : forms);
    return {
      visual: level <= 2 ? shapesSvg() : undefined,
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Rods, spheres, spirals for bacteria. Buds for yeast, threads for mould. A virus is a coat with instructions.',
      working: ['<b>Picture:</b> line them up — sausage, ball, corkscrew, spiky package, budding oval, fuzzy threads.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'looks',
    };
  }

  function diseaseQ(level) {
    const d = R.pick(DISEASES);
    if (R.chance(0.5)) {
      return {
        prompt: `Which kind of microbe causes <b>${d.name}</b>?`,
        answer: ch(d.m, MTYPES, 4),
        hint: 'Colds, flu, measles, rubella, chickenpox and HIV are all viruses.',
        working: [`<b>${cap(d.name)}</b> is caused by <b>${d.m}</b>.`, `It spreads by: ${d.r}.`],
        finalAnswer: d.m, skill: 'diseases',
      };
    }
    return {
      prompt: `How does <b>${d.name}</b> spread?`,
      answer: ch(d.r, DISEASES.map((x) => x.r), 4),
      hint: 'Ask where the microbe has to travel: through the air, on hands, in food, in water, or in blood.',
      working: [`<b>Picture:</b> trace the journey from a sick person to a well one.`, `${cap(d.name)} spreads by <b>${d.r}</b>.`, `It is caused by ${d.m}.`],
      finalAnswer: d.r, skill: 'diseases',
    };
  }

  function barrierQ(level) {
    const b = R.pick(BARRIERS);
    if (R.chance(0.5)) {
      return {
        prompt: `Which first-line defence <b>${b.how}</b>?`,
        answer: ch(b.name, BARRIERS.map((x) => x.name), 4),
        hint: `Think of it as ${b.pic}.`,
        working: ['<b>Picture:</b> your body is a house, and the first line of defence is everything outside the door.', `${cap(b.name)} is ${b.pic}.`],
        finalAnswer: b.name, skill: 'barriers',
      };
    }
    return {
      prompt: `What does <b>${b.name}</b> do to keep microbes out?`,
      answer: ch(b.how, BARRIERS.map((x) => x.how), 4),
      hint: `Think of it as ${b.pic}.`,
      working: ['<b>Picture:</b> your body is a house.', `${cap(b.name)} is ${b.pic} — it <b>${b.how}</b>.`],
      finalAnswer: b.how, skill: 'barriers',
    };
  }

  function phagocyteQ(level) {
    const forms = [
      { p: 'What is a <b>phagocyte</b>?', a: 'a white blood cell that swallows microbes whole and dissolves them', w: ['a white blood cell that makes antibodies', 'a marker on the outside of a microbe', 'a kind of bacteria that lives in your blood'] },
      { p: 'A microbe gets through a cut. What does a phagocyte do first?', a: 'It notices something foreign and moves towards it', w: ['It waits for a vaccine to arrive', 'It makes an antibody and fires it across the room', 'It seals the cut with a scab'] },
      { p: 'Once a phagocyte has reached a microbe, what happens?', a: 'It flows around the microbe, swallows it whole, and dissolves it with chemicals inside itself', w: ['It sticks an antibody on it and leaves it there', 'It pushes it back out through the skin', 'It waits for the microbe to die of old age'] },
      { p: 'Why are white blood cells called the <b>second</b> line of defence?', a: 'They only get to work on microbes that have already got past the skin, mucus and acid', w: ['They are the second most important', 'They are made second, after the red blood cells', 'They only work on the second day of an illness'] },
      { p: 'Which cells do the two different white-blood-cell jobs?', a: '<b>Phagocytes</b> swallow microbes whole; <b>lymphocytes</b> make antibodies', w: ['Phagocytes make antibodies; lymphocytes swallow microbes', 'Red blood cells do both jobs', 'Platelets do both jobs'] },
      { p: 'Why does a bad cut sometimes fill with yellow pus?', a: 'Pus is mostly dead white blood cells and dead microbes — the sign of a battle that has been fought there', w: ['Pus is the antiseptic your body makes', 'Pus is blood that has gone off', 'Pus is fat leaking out of the cut'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      visual: level <= 2 ? linesSvg(2) : undefined,
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Phagocyte = "the eater". It notices, moves over, swallows and dissolves.',
      working: ['<b>Picture:</b> a guard inside the house who swallows the burglar whole.', '1. Notices something <b>foreign</b>.', '2. <b>Moves towards</b> it.', '3. <b>Swallows</b> it.', '4. <b>Dissolves</b> it inside.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'phagocytes',
    };
  }

  function antibodyQ(level) {
    const forms = [
      { p: 'Where is the <b>antigen</b>?', a: 'on the outside of the microbe — it is the microbe’s marker', w: ['on the outside of a white blood cell', 'inside your bones', 'in the medicine you swallow'], fit: true },
      { p: 'What do antibodies actually <b>do</b> to a microbe?', a: 'They lock onto its antigen, which clumps the microbes together and marks them for the phagocytes to eat', w: ['They cut the microbe in half with a sharp edge', 'They push the microbe back out through the skin', 'They turn the microbe into a useful gut bacterium'], fit: true },
      { p: 'Why does the antibody for measles do nothing at all against chickenpox?', a: 'Antibodies are made to fit one antigen only — the chickenpox antigen is a different shape', w: ['Chickenpox has no antigen at all', 'Antibodies only work on the disease you had most recently', 'The measles antibody wears out after a year'], fit: false },
      { p: 'Which cells make antibodies?', a: 'white blood cells — the ones called lymphocytes', w: ['red blood cells', 'skin cells', 'the bacteria in your gut'], fit: true },
      { p: 'An antibody is often drawn as a <b>Y</b> shape. Why?', a: 'The two arms of the Y are the part that grips the antigen, and each antibody’s arms are a different shape', w: ['Y stands for "yellow", the colour they are', 'The Y shape helps them swim through the blood', 'It is just how they are drawn — the shape means nothing'], fit: true },
      { p: 'Why does it take <b>days</b> to get better the first time you catch something?', a: 'Your body has to find the lymphocyte with the right-shaped antibody and then make millions of copies, and that takes time', w: ['The microbe has to finish growing first', 'Antibodies only work at night', 'Your phagocytes have to be replaced first'], fit: true },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      visual: level <= 2 ? antibodySvg(f.fit) : undefined,
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Antigen = the lock on the microbe. Antibody = the key your body cuts to fit it. One key, one lock.',
      working: ['<b>Picture:</b> the microbe wears a name badge (the <b>antigen</b>); your body makes handcuffs (the <b>antibody</b>) shaped to fit that badge and nothing else.', '1. Lymphocyte finds the matching shape.', '2. Makes millions of copies of that antibody.', '3. They lock on, clump the microbes and mark them.', '4. Phagocytes eat the clumps.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'antibodies',
    };
  }

  function immunityQ(level) {
    const forms = [
      { p: 'What does it mean to be <b>immune</b> to a disease?', a: 'Your body already has the memory cells for it, so it destroys the microbe before it can make you ill', w: ['The microbe cannot get into your body at all', 'You have taken an antibiotic for it', 'You are too old to catch it any more'] },
      { p: 'What are <b>memory cells</b>?', a: 'White blood cells kept after an infection that remember the antigen, so the right antibody can be made instantly next time', w: ['Cells in your brain that remember being ill', 'Leftover antibodies floating in the blood forever', 'Bacteria that stay in your gut and warn you'] },
      { p: 'Harper had chickenpox at five and has never caught it again. Why not?', a: 'Her memory cells recognise that antigen instantly, so the virus is destroyed before she notices', w: ['The chickenpox virus has died out', 'You can only catch chickenpox before you are six', 'She still has all the antibodies from when she was five'] },
      { p: 'Why can you catch a cold again and again, but measles only once?', a: 'There are hundreds of different cold viruses, each with a different antigen — being immune to one does not help against the next', w: ['Cold memory cells only last a week', 'Measles is a bacterium and colds are viruses', 'Colds are not caused by microbes at all'] },
      { p: 'The second time a microbe gets in, your antibody level shoots up much faster and much higher. Why?', a: 'The memory cells already know the shape, so there is no searching to do — copying starts straight away', w: ['The microbe is weaker the second time', 'Your body keeps a stock of every antibody at all times', 'The second microbe helps your body by making antibodies for you'] },
      { p: 'A newborn baby gets some antibodies from its mother. Is that the same as being immune?', a: 'It protects the baby for a few months, but they are borrowed antibodies — the baby has no memory cells of its own yet', w: ['Yes, it lasts for life exactly like having the disease', 'No, borrowed antibodies do nothing at all', 'Yes, because the baby copies the mother’s memory cells'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      visual: level <= 2 ? memorySvg() : undefined,
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Immunity is memory. The first time your body searches; after that it already knows.',
      working: ['<b>Picture:</b> the guards were shown the burglar once, and they never forgot his face.', '1. <b>First time:</b> slow search → few antibodies → you get ill.', '2. Your body keeps <b>memory cells</b>.', '3. <b>Next time:</b> recognised instantly → a flood of antibodies → no illness.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'immunity',
    };
  }

  function vaccineQ(level) {
    const forms = [
      { p: 'What is in a <b>vaccine</b>?', a: 'a dead or weakened microbe, or just a harmless piece of one — the part that carries the antigen', w: ['a full-strength living microbe', 'an antibiotic', 'a vitamin that kills microbes'] },
      { p: 'Put the steps of how a vaccine works in order.', a: 'Vaccine carries the antigen → lymphocytes make antibodies → memory cells are kept → the real microbe is destroyed fast', w: ['Vaccine kills the microbes already inside you → you get better', 'Vaccine coats your skin → microbes slide off', 'Vaccine gives you the disease → you get better → you are immune'] },
      { p: 'Why does a vaccine <b>not</b> make you ill?', a: 'The microbe in it is dead or weakened, so it carries the antigen but cannot multiply and cause the disease', w: ['It is not really a microbe, it is an antiseptic', 'It does make you ill — that is how it works', 'It works only on people who are already immune'] },
      { p: 'What is the <b>one thing</b> a vaccine has to contain for it to work at all?', a: 'the antigen — the marker your body learns to recognise', w: ['live microbes, or it cannot teach anything', 'an antibiotic to kill any bacteria present', 'sugar, to feed the white blood cells'] },
      { p: 'Is a vaccine any use once you are already ill with that disease?', a: 'No — a vaccine trains you beforehand. Once you are ill you need your own defences, or a medicine', w: ['Yes, a vaccine cures any disease straight away', 'Yes, but only for bacterial diseases', 'Yes, but it takes a year to work'] },
      { p: 'Why does vaccinating most of a school protect the few children who cannot be vaccinated?', a: 'With almost nobody left to catch it, the microbe has no chain of people to travel along', w: ['The vaccine drifts through the air to them', 'Unvaccinated children stop being able to catch it after a year', 'It does not protect them at all'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'A vaccine is showing the guards a photo of the burglar, before he ever turns up.',
      working: ['<b>Picture:</b> a photo of the burglar, handed to the guards in advance.', '1. The vaccine carries the <b>antigen</b> but cannot make you ill.', '2. Lymphocytes make the matching <b>antibodies</b>.', '3. <b>Memory cells</b> are kept.', '4. The real microbe arrives later and is destroyed before you feel a thing — you are <b>immune</b>.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'vaccine',
    };
  }

  function medicineQ(level) {
    const m = R.pick(MEDICINES);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What is <b>${m.name}</b>?`,
        answer: ch(m.what, MEDICINES.map((x) => x.what), 4),
        hint: 'Inside you, on your skin, on the bench, or before you are ill?',
        working: [`<b>${cap(m.name)}</b> is ${m.what}.`, `Use it for: ${m.use}.`, `Example: ${m.ex}.`],
        finalAnswer: m.what, skill: 'medicines',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which of these would you use for <b>${m.use}</b>?`,
        answer: ch(m.name, MEDICINES.map((x) => x.name), 4),
        hint: 'Match the job to the right one of the four.',
        working: [`<b>Picture:</b> inside you → antibiotic; on your skin → antiseptic; on the bench → disinfectant; before you are ill → vaccine.`, `For ${m.use} you want <b>${m.name}</b>.`],
        finalAnswer: m.name, skill: 'medicines',
      };
    }
    return {
      prompt: `What is the catch with <b>${m.name}</b>?`,
      answer: ch(m.no, MEDICINES.map((x) => x.no), 4),
      hint: 'Every one of the four has something it cannot do.',
      working: [`<b>${cap(m.name)}</b> is ${m.what}.`, `But: <b>${m.no}</b>.`],
      finalAnswer: m.no, skill: 'medicines',
    };
  }

  function stopSpreadQ(level) {
    const forms = [
      { p: 'Name three simple things that stop diseases spreading between people.', a: 'washing your hands with soap, coughing into your elbow, and staying home when you are ill', w: ['taking an antibiotic every day just in case', 'sharing drink bottles so everyone gets used to the germs', 'opening no windows, so the microbes stay outside'] },
      { p: 'Why does <b>soap</b> work so well, even though it is not an antiseptic?', a: 'It breaks the microbes loose from the grease on your skin so the water can rinse them straight down the drain', w: ['It poisons every microbe on contact', 'It makes your skin too slippery for microbes to land on', 'It replaces the microbes with useful ones'] },
      { p: 'Why should you cough into your <b>elbow</b> rather than your hand?', a: 'The droplets land on your sleeve instead of the hand you are about to touch a door handle with', w: ['Your elbow kills microbes and your hand does not', 'It is only about being polite', 'Coughing into your hand pushes the microbes into your skin'] },
      { p: 'How does <b>cooking chicken right through</b> stop disease?', a: 'The heat kills the bacteria living in the raw meat, so there are none left to make you ill', w: ['The heat washes the bacteria off into the pan', 'Cooked meat is too dry for bacteria to like', 'It does not — only the fridge kills bacteria'] },
      { p: 'Why are people told to boil water from a stream before drinking it?', a: 'Sewage or animal droppings upstream can put pathogens in it, and boiling kills them', w: ['Boiling makes the water taste better', 'Boiling adds oxygen back into the water', 'Stream water is safe — the rule is just being careful'] },
      { p: 'Why does a hospital insist that everybody cleans their hands between patients?', a: 'Hands carry pathogens straight from one person to the next, and people in hospital are the least able to fight them off', w: ['It keeps the floors clean', 'Doctors only do it to set an example', 'It stops the antibiotics wearing off'] },
      { p: 'In the 1800s John Snow stopped a cholera outbreak in London. What did he do?', a: 'He worked out the cases were all around one water pump, and had its handle removed', w: ['He gave everyone an antibiotic', 'He vaccinated the whole city', 'He told everyone to stay indoors for a year'] },
      { p: 'Malaria spreads by mosquito bite. Which of these would help most?', a: 'sleeping under a treated mosquito net and draining still water where they breed', w: ['washing your hands more often', 'cooking your food more thoroughly', 'coughing into your elbow'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 4) : forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Find the route the microbe uses, then block that route.',
      working: ['<b>Picture:</b> the microbe needs a road to travel along. Dig up the road.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'stopping',
    };
  }

  function defenceOrderQ(level) {
    const forms = [
      { p: 'Which line of defence is your <b>skin</b>?', a: 'the first — it keeps microbes out altogether', w: ['the second — it eats microbes', 'the third — it makes antibodies', 'it is not a defence at all'], k: 1 },
      { p: 'Which line of defence are <b>phagocytes</b>?', a: 'the second — they swallow the microbes that get in', w: ['the first — they are a barrier on the outside', 'the third — they make antibodies', 'they are not part of your defences'], k: 2 },
      { p: 'Which line of defence are <b>antibodies</b>?', a: 'the third — they tag one particular microbe, and memory cells remember it', w: ['the first — they coat your skin', 'the second — they swallow microbes whole', 'they are made by the microbe, not by you'], k: 3 },
      { p: 'You swallow food with bacteria on it. Which defence meets them first?', a: 'stomach acid', w: ['phagocytes', 'antibodies', 'a scab'], k: 1 },
      { p: 'A microbe gets in through a scraped knee. Which defence deals with it now?', a: 'white blood cells inside your blood', w: ['stomach acid', 'the mucus in your nose', 'your tears'], k: 2 },
      { p: 'Put the three lines of defence in the right order.', a: 'barriers keep them out → phagocytes eat the ones that get in → antibodies tag them and memory cells remember', w: ['antibodies → barriers → phagocytes', 'phagocytes → barriers → antibodies', 'memory cells → antibodies → skin'], k: 0 },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 4) : forms);
    return {
      visual: level <= 2 ? linesSvg(f.k || undefined) : undefined,
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Out → eat → tag and remember.',
      working: ['<b>Picture:</b> a fence, then guards who swallow, then guards who handcuff and never forget a face.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'lines',
    };
  }

  /* ---------- number questions ---------- */
  function immunityCalc(level) {
    const form = R.int(1, level === 1 ? 3 : 5);
    if (form === 1) {
      const start = R.pick([20, 40, 60, 80]);
      const hours = R.pick([2, 3, 4]);
      const val = start * Math.pow(2, hours * 3);
      return {
        prompt: `A bacterium splits in two every <b>20 minutes</b>. Starting with <b>${start}</b> of them, how many are there after <b>${hours} hours</b>?`,
        answer: { type: 'number', value: val },
        hint: 'How many 20-minute steps are in the time? Double for each one.',
        working: [`1. ${hours} hours = ${hours * 60} minutes = <b>${hours * 3}</b> steps of 20 minutes.`, `2. Each step doubles: ${start} × 2<sup>${hours * 3}</sup>.`, `3. 2<sup>${hours * 3}</sup> = ${Math.pow(2, hours * 3)}, so ${start} × ${Math.pow(2, hours * 3)} = <b>${val}</b>.`],
        finalAnswer: String(val), skill: 'numbers',
      };
    }
    if (form === 2) {
      const total = R.pick([200, 400, 500, 800]);
      const pct = R.pick([5, 10, 20, 25]);
      const n = (total * pct) / 100;
      return {
        prompt: `In a school of <b>${total}</b> students, <b>${pct}%</b> have not had the measles vaccine. How many students is that?`,
        answer: { type: 'number', value: n },
        hint: 'Find 1% first, then multiply.',
        working: [`1. 1% of ${total} = ${total / 100}.`, `2. ${pct}% = ${total / 100} × ${pct} = <b>${n}</b> students.`],
        finalAnswer: `${n} students`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const day = R.pick([2, 3, 4, 5]);
      const first = R.pick([8, 10, 12, 14]);
      return {
        prompt: `The first time Harper meets a microbe, her antibodies take <b>${first} days</b> to reach full strength. The second time it takes <b>${day} days</b>. How many days faster is the second time?`,
        answer: { type: 'number', value: first - day, unit: 'days' },
        hint: 'Take the second time away from the first.',
        working: [`${first} − ${day} = <b>${first - day}</b> days faster.`, 'That speed-up is exactly what memory cells give you.'],
        finalAnswer: `${first - day} days`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const before = R.pick([1200, 1600, 2000, 2400]);
      const drop = R.pick([75, 80, 90]);
      const after = Math.round(before * (1 - drop / 100));
      return {
        prompt: `Before a vaccine was introduced a country had <b>${before}</b> cases a year. The vaccine cut cases by <b>${drop}%</b>. How many cases a year now?`,
        answer: { type: 'number', value: after, unit: 'cases' },
        hint: `If ${drop}% has gone, what percentage is left?`,
        working: [`1. ${100 - drop}% is left.`, `2. ${before} × ${(100 - drop) / 100} = <b>${after}</b> cases a year.`],
        finalAnswer: `${after} cases`, skill: 'numbers',
      };
    }
    const cls = R.pick([24, 25, 28, 30]);
    const sick = R.pick([3, 5, 6, 7]);
    const pct = Math.round((sick / cls) * 100);
    return {
      prompt: `<b>${sick}</b> students out of a class of <b>${cls}</b> are off with the flu. What percentage of the class is that? (Round to the nearest whole number.)`,
      answer: { type: 'number', value: pct, unit: '%' },
      hint: 'Part ÷ whole × 100.',
      working: [`${sick} ÷ ${cls} = ${(sick / cls).toFixed(3)}`, `× 100 = ${((sick / cls) * 100).toFixed(1)}% → <b>${pct}%</b>.`],
      finalAnswer: `${pct}%`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => ({
      visual: linesSvg(),
      prompt: 'Harper falls off her bike and grazes her knee on the gravel. Track what her body does, from the moment the skin breaks.',
      answer: ch('Skin (1st line) has failed → a scab seals it → phagocytes swallow the microbes → lymphocytes make antibodies and memory cells', ['Antibodies arrive first, then the skin heals, then phagocytes', 'Stomach acid is pumped to the knee to kill the microbes', 'Nothing happens until she takes an antibiotic'], 4),
      hint: 'Out → eat → tag and remember. Which one has just been breached?',
      working: ['<b>Picture:</b> the fence is broken, so the guards inside take over.', '1. <b>1st line:</b> her <b>skin</b> was the wall. It has failed.', '2. A <b>scab</b> forms within hours to seal the gap, so nothing more gets in.', '3. <b>2nd line:</b> <b>phagocytes</b> notice something foreign, move to it, swallow it whole and dissolve it.', '4. <b>3rd line:</b> <b>lymphocytes</b> make <b>antibodies</b> shaped to fit that microbe’s antigen, which clump them up.', '5. Afterwards she keeps <b>memory cells</b>, so that microbe would never get so far again.'],
      finalAnswer: 'Skin fails → scab seals → phagocytes eat → antibodies tag → memory cells remember',
    }),
    () => ({
      visual: memorySvg(),
      prompt: 'Harper had chickenpox at five. Her cousin had it last year and she was fine. Explain why, using the words antigen, antibody and memory cell.',
      answer: ch('Her memory cells recognised the chickenpox antigen instantly and flooded her blood with the matching antibody before she could get ill', ['She still has the very same antibodies from when she was five, floating about', 'The chickenpox virus gets weaker every year that passes', 'Being ill once uses the virus up so there is none left'], 4),
      hint: 'The graph: first time slow and small, second time fast and huge.',
      working: ['<b>Picture:</b> the guards were shown the burglar once and never forgot his face.', '1. <b>Age five:</b> her body had to <b>search</b> for a lymphocyte whose antibody fitted the chickenpox <b>antigen</b>. That took days — so she got ill.', '2. When it was over, she kept <b>memory cells</b> for that exact antigen.', '3. <b>Last year:</b> the same antigen arrived. The memory cells recognised it <b>straight away</b>.', '4. A flood of the matching <b>antibody</b> destroyed the virus before she felt anything. That is what <b>immunity</b> means.'],
      finalAnswer: 'Memory cells recognised the antigen instantly and made the matching antibody fast — she is immune',
    }),
    () => ({
      visual: antibodySvg(false),
      prompt: 'Harper is immune to measles. She then catches rubella anyway. Her friend says her immune system has stopped working. Is that right?',
      answer: ch('No — antibodies fit one antigen only, and rubella’s antigen is a different shape from measles’, so a new set had to be made', ['Yes — if she was really immune she could not catch anything', 'Yes — immunity wears off after about a year', 'No — rubella is not caused by a microbe at all'], 4),
      hint: 'One key opens one lock.',
      working: ['<b>Picture:</b> a key cut for the front door will not open next door.', '1. Her measles <b>memory cells</b> hold the shape of the <b>measles antigen</b>.', '2. Rubella is a different virus with a <b>different antigen</b>.', '3. The measles antibody simply does not fit it — no lock, no effect.', '4. So her body had to start the slow search again. Her defences are working perfectly; they are just <b>specific</b>.'],
      finalAnswer: 'No — antibodies are specific. Rubella has a different antigen, so the measles antibody does not fit',
    }),
    () => ({
      prompt: 'Harper is given a measles vaccine and does not get ill at all. Explain what the vaccine did, in order.',
      answer: ch('It carried the measles antigen in a dead or weakened form → lymphocytes made antibodies → memory cells were kept → she is now immune', ['It killed every measles virus in the country around her', 'It put a chemical shield onto her skin for a year', 'It gave her a mild dose of measles which she fought off'], 4),
      hint: 'A vaccine is a photo of the burglar, handed over in advance.',
      working: ['<b>Picture:</b> a wanted poster, before the burglar ever turns up.', '1. The vaccine contains the measles microbe <b>dead or weakened</b>, or just a piece of it.', '2. It still carries the <b>antigen</b> — that is the only part that matters.', '3. But it cannot multiply, so she does <b>not</b> get the disease.', '4. Her <b>lymphocytes</b> make the matching <b>antibody</b> and keep <b>memory cells</b>.', '5. If real measles ever arrives, it is destroyed before she notices — she is <b>immune</b>.'],
      finalAnswer: 'The vaccine gave her the antigen safely, so she made antibodies and memory cells without the illness',
    }),
    () => {
      const d = R.pick(DISEASES);
      return {
        prompt: `A doctor sees a patient with <b>${d.name}</b>. Which microbe is behind it, and how did the patient most likely catch it?`,
        answer: ch(`${d.m} — caught by ${d.r}`, DISEASES.map((x) => `${x.m} — caught by ${x.r}`), 4),
        hint: 'Name the microbe first, then trace the journey it had to make.',
        working: ['<b>Picture:</b> be a detective — what is the culprit, and what road did it travel?', `1. <b>${cap(d.name)}</b> is caused by <b>${d.m}</b>.`, `2. It travels by: <b>${d.r}</b>.`, '3. Block that road and the disease stops.'],
        finalAnswer: `${d.m} — caught by ${d.r}`,
      };
    },
    () => ({
      prompt: 'Harper cleans a grazed knee with antiseptic wipes, and her mum wipes the bench with bleach. Why two different products?',
      answer: ch('An antiseptic is gentle enough for skin; a disinfectant is much stronger and is only for surfaces', ['They are the same thing with different labels', 'Bleach is for skin and antiseptic is for benches', 'Antiseptics only work on viruses and bleach only on bacteria'], 4),
      hint: 'One goes on a person, one goes on a bench.',
      working: ['<b>Picture:</b> the right tool for the surface.', '1. <b>Antiseptic</b> → kills microbes <b>on skin</b> or in a cut. Gentle enough not to damage you.', '2. <b>Disinfectant</b> → kills microbes <b>on surfaces</b>. Far too harsh for skin.', '3. Neither is swallowed. A medicine you swallow to kill bacteria inside you is an <b>antibiotic</b>.'],
      finalAnswer: 'Antiseptic is for skin; disinfectant is for surfaces — and neither is swallowed',
    }),
    () => ({
      prompt: 'Harper has a fever, and her friend says "take the fever away, it is making you worse". Why might the fever actually be helping?',
      answer: ch('A fever is part of the defence — the extra heat slows the microbes down and makes your white blood cells work faster', ['A fever is the microbe cooking itself on purpose', 'A fever has no effect at all either way', 'A fever is caused by the antibiotic, not by the illness'], 4),
      hint: 'Your body chose to turn the heat up. Why would it do that?',
      working: ['<b>Picture:</b> turning the heat up to make it too uncomfortable for the intruder.', '1. A fever is <b>your body</b> raising the temperature on purpose.', '2. Most microbes grow best at normal body temperature — hotter slows them down.', '3. Your <b>white blood cells</b> work faster when warm.', '4. So a mild fever is a sign the defences are running. A very high one still needs help.'],
      finalAnswer: 'A fever is a defence — it slows the microbes and speeds up your white blood cells',
    }),
    () => ({
      visual: shapesSvg(),
      prompt: 'Harper looks at two slides. Slide A shows corkscrew shapes; slide B shows fat oval cells, some with a little bump on the side. What is on each slide?',
      answer: ch('A is spiral bacteria; B is yeast, a fungus, and the bumps are new cells budding off', ['A is yeast and B is spiral bacteria', 'A is a virus and B is a rod bacterium', 'Both slides show the same thing at different magnifications'], 4),
      hint: 'Corkscrew = one of the three bacterial shapes. A bump on the side = budding.',
      working: ['<b>Picture:</b> a corkscrew, then an oval with a small oval growing out of it.', '1. Bacteria come in three shapes: <b>rods</b>, <b>spheres</b> and <b>spirals</b>. A corkscrew is a <b>spiral bacterium</b>.', '2. A round cell with a bump growing off it is <b>yeast</b> — a <b>fungus</b> — and the bump is a <b>bud</b> that will break away as a new cell.', '3. Neither can be a virus: a virus is about 20× smaller and needs an electron microscope.'],
      finalAnswer: 'A = spiral bacteria; B = yeast (a fungus) budding',
    }),
    () => ({
      prompt: 'A whole family gets bad stomach cramps the evening after a barbecue. Nobody else at the park was ill. Work out what happened and how to stop it next time.',
      answer: ch('Food poisoning — most likely salmonella bacteria from chicken that was undercooked or left sitting warm. Cook it right through and keep it cold until then', ['A virus in the air at the park — they should have worn masks', 'The grass at the park — they should not have sat down', 'Nothing can be done — stomach cramps are random'], 4),
      hint: 'What did the sick people share that nobody else did?',
      working: ['<b>Picture:</b> be a detective — what did all the sick people share?', '1. Only the family was ill, and only they ate the barbecue food → the route is <b>food</b>.', '2. Cramps within hours points to <b>bacteria</b> — <b>salmonella</b> is the classic one, from chicken and eggs.', '3. Bacteria double every 20 minutes when <b>warm</b>, so a few become millions in an afternoon.', '4. Stop it: <b>cook meat right through</b>, keep it in the <b>fridge</b> until it is cooked, and keep raw meat away from ready-to-eat food.'],
      finalAnswer: 'Salmonella food poisoning from undercooked or warm chicken — cook it through and keep it cold',
    }),
    () => ({
      visual: linesSvg(1),
      prompt: 'Someone says "if my skin keeps microbes out, why do I need white blood cells at all?". Answer them properly.',
      answer: ch('Skin only works while it is unbroken — and microbes also come in through your mouth, nose and eyes, so you need the inside defences too', ['You do not — white blood cells are left over from evolution', 'Because skin only works in summer', 'Because white blood cells are what make your skin grow'], 4),
      hint: 'List every way in that is not through the skin.',
      working: ['<b>Picture:</b> a fence with a gate, a letterbox and a chimney.', '1. <b>Skin</b> is a great wall — but a cut, a graze or a bite makes a hole in it.', '2. There are openings anyway: <b>mouth, nose, eyes</b>. Mucus, acid and tears guard those, but not perfectly.', '3. So some microbes always get in → you need the <b>2nd line</b> (phagocytes eat them) and the <b>3rd line</b> (antibodies tag them, memory cells remember).'],
      finalAnswer: 'Skin only guards an unbroken outside — microbes get in through cuts and openings, so you need the inner lines too',
    }),
  ];

  HL.registerTopic({
    id: 'immunity', subject: 'science', strand: 'living', order: 10,
    name: 'Defence & immunity', short: 'Immunity', animal: 'turtle',
    blurb: 'What microbes look like, how your body fights them off, and what antibodies, vaccines and immunity really are.',
    example: 'antigen = the badge · antibody = the handcuffs that fit it',
    learn: {
      what: '<p>A <b>pathogen</b> is a microbe that causes disease. Your body stops them in <b>three lines of defence</b>. <b>First</b>, barriers keep them out: skin, mucus and tiny hairs, stomach acid, tears and scabs. <b>Second</b>, white blood cells called <b>phagocytes</b> notice anything foreign that gets in, move over to it, swallow it whole and dissolve it. <b>Third</b>, other white blood cells make <b>antibodies</b> — Y-shaped proteins that lock onto the <b>antigen</b>, the marker on the outside of that one microbe, which clumps them together and marks them to be eaten. Afterwards you keep <b>memory cells</b>, so next time the same microbe is destroyed before it can make you ill. That is <b>immunity</b>, and a <b>vaccine</b> gives it to you without the illness.</p><p><b>Picture for this topic:</b> your body is a <b>house</b>. Skin is the <b>fence</b>, mucus is the <b>flypaper</b>, stomach acid is the <b>moat</b>. Phagocytes are guards who <b>swallow the burglar whole</b>. The burglar wears a <b>name badge</b> (the antigen) and your body makes <b>handcuffs</b> (antibodies) cut to fit that badge and no other. A <b>vaccine</b> is showing the guards his photo before he ever turns up.</p>',
      visual: `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="22" text-anchor="middle" fill="#4A4033" font-size="12">three lines of defence, in order</text>
        <rect x="16" y="36" width="308" height="44" rx="12" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
        <text x="28" y="55" fill="#4A4033" font-size="11.5">1st line: keep them OUT</text>
        <text x="28" y="71" fill="#4A4033" font-size="10.5" font-weight="400">skin · mucus + hairs · stomach acid · tears · scabs</text>
        <rect x="16" y="88" width="308" height="44" rx="12" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
        <text x="28" y="107" fill="#4A4033" font-size="11.5">2nd line: EAT the ones that get in</text>
        <text x="28" y="123" fill="#4A4033" font-size="10.5" font-weight="400">phagocytes — white blood cells that eat microbes</text>
        <rect x="16" y="140" width="308" height="44" rx="12" fill="#F7D3E2" stroke="#4A4033" stroke-width="2"/>
        <text x="28" y="159" fill="#4A4033" font-size="11.5">3rd line: TAG them, and REMEMBER</text>
        <text x="28" y="175" fill="#4A4033" font-size="10.5" font-weight="400">antibodies lock on · memory cells remember</text>
      </svg>`,
      facts: [
        'A <b>pathogen</b> is a microbe that causes disease. Most microbes are not pathogens at all',
        '<b>Bacteria</b> are rods, spheres or spirals · <b>yeast</b> is a round cell with a bud · <b>mould</b> is threads with spore heads · a <b>virus</b> is a coat with instructions inside, and no cell parts',
        '<b>1st line:</b> skin, mucus and hairs, stomach acid, tears, scabs, and the friendly bacteria that take up the space',
        '<b>2nd line: phagocytes</b> — white blood cells that notice something foreign, move towards it, swallow it whole and dissolve it',
        '<b>3rd line: antibodies</b> — made by lymphocytes, Y-shaped, and each one fits <b>one antigen only</b>, like a key in a lock',
        'An <b>antigen</b> is the marker on the <b>outside of the microbe</b>. An <b>antibody</b> is what <b>your body makes</b> to fit it',
        '<b>Memory cells</b> stay behind afterwards, so the second time is fast and you never feel ill. That is <b>immunity</b>',
        'A <b>vaccine</b> is a dead or weakened microbe (or a piece of one) — it carries the antigen, so you get antibodies and memory cells without the illness',
        '<b>Antibiotic</b> = swallowed, kills bacteria inside you · <b>antiseptic</b> = on skin and cuts · <b>disinfectant</b> = on surfaces · <b>vaccine</b> = before you are ill',
      ],
      steps: [
        'For "how does my body fight this?", always walk the <b>three lines in order</b>: <b>out</b> (barriers) → <b>eat</b> (phagocytes) → <b>tag and remember</b> (antibodies, memory cells).',
        'Never mix up <b>antigen</b> and <b>antibody</b>. <b>Antigen</b> is on the microbe (think: the microbe’s name badge). <b>Antibody</b> is made by <b>you</b> (think: handcuffs cut to fit that badge). "Anti<b>body</b>" — your <b>body</b> makes it.',
        'Antibodies are <b>specific</b>: one antibody, one antigen. If an exam asks why being immune to one disease does not protect you from another, this is always the answer.',
        'For a vaccine question, give the four steps: <b>antigen in safely → antibodies made → memory cells kept → real microbe destroyed fast</b>.',
        'For "which medicine?", ask <b>where</b> it goes: inside you (antibiotic, and only for bacteria) · on skin (antiseptic) · on the bench (disinfectant) · before you are ill at all (vaccine).',
        'For "how do we stop it spreading?", name the <b>route</b> first (air, touch, food, water, animal bite, blood), then block <b>that</b> route.',
      ],
      examples: [
        {
          q: 'A microbe lands on Harper’s grazed knee. Walk through every defence it meets, in order.',
          visual: `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="16" text-anchor="middle" fill="#4A4033" font-size="12">out → eat → tag and remember</text>
            <rect x="12" y="28" width="296" height="44" rx="12" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <text x="24" y="47" fill="#4A4033" font-size="11.5">1. skin (broken) → a scab seals it</text>
            <text x="24" y="63" fill="#4A4033" font-size="10.5" font-weight="400">the wall failed, so plug the hole fast</text>
            <rect x="12" y="80" width="296" height="44" rx="12" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
            <text x="24" y="99" fill="#4A4033" font-size="11.5">2. phagocytes swallow it whole</text>
            <text x="24" y="115" fill="#4A4033" font-size="10.5" font-weight="400">notice → move over → swallow → dissolve</text>
            <rect x="12" y="132" width="296" height="44" rx="12" fill="#F7D3E2" stroke="#4A4033" stroke-width="2"/>
            <text x="24" y="151" fill="#4A4033" font-size="11.5">3. antibodies lock onto its antigen</text>
            <text x="24" y="167" fill="#4A4033" font-size="10.5" font-weight="400">then memory cells stay behind</text>
            <text x="160" y="193" text-anchor="middle" fill="#7A7065" font-size="10.5">a microbe has to beat all three</text>
          </svg>`,
          working: ['<b>Picture:</b> your body is a house — a fence outside, guards inside.', '1. <b>First line — the skin.</b> Normally an unbroken wall. The graze has broken it, so this one has failed.', '2. A <b>scab</b> forms within hours: a plank nailed over the hole so nothing else gets in.', '3. <b>Second line — phagocytes.</b> These white blood cells <b>notice</b> something foreign, <b>move towards</b> it, <b>swallow</b> it whole and <b>dissolve</b> it inside themselves.', '4. <b>Third line — antibodies.</b> Lymphocytes make Y-shaped antibodies that fit the <b>antigen</b> on that microbe. They lock on, clump the microbes together and mark them for the phagocytes.', '5. Afterwards <b>memory cells</b> stay behind, so the same microbe would never get that far again.'],
          a: 'Skin (broken) → scab → phagocytes swallow it → antibodies tag it → memory cells remember it',
        },
        {
          q: 'Explain the difference between an <b>antigen</b> and an <b>antibody</b>, and why an antibody only works on one microbe.',
          visual: `<svg viewBox="0 0 320 214" width="320" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="16" text-anchor="middle" fill="#4A4033" font-size="11.5">one antibody fits one antigen</text>
            <text x="78" y="36" text-anchor="middle" fill="#B03068" font-size="11">right shape \u2713</text>
            <path d="M78 44 v16 M78 60 l-15 14 M78 60 l15 14" fill="none" stroke="#E0568C" stroke-width="6" stroke-linecap="round"/>
            <path d="M65 92 l0 -14 l13 -8 l13 8 l0 14" fill="#3F6B22" stroke="#4A4033" stroke-width="2"/>
            <circle cx="78" cy="126" r="34" fill="#8FC96E" stroke="#4A4033" stroke-width="2.5"/>
            <text x="78" y="131" text-anchor="middle" fill="#FFFFFF" font-size="11">microbe</text>
            <text x="78" y="180" text-anchor="middle" fill="#3F6B22" font-size="11">pointed ANTIGEN</text>
            <text x="78" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">locks on \u2713</text>
            <line x1="160" y1="30" x2="160" y2="188" stroke="#D9BE8A" stroke-width="2"/>
            <text x="242" y="36" text-anchor="middle" fill="#7A7065" font-size="11">same antibody \u2717</text>
            <path d="M242 44 v16 M242 60 l-15 14 M242 60 l15 14" fill="none" stroke="#B0A79A" stroke-width="6" stroke-linecap="round"/>
            <circle cx="242" cy="84" r="12" fill="#2F6FD0" stroke="#4A4033" stroke-width="2"/>
            <circle cx="242" cy="126" r="34" fill="#A9D8F5" stroke="#4A4033" stroke-width="2.5"/>
            <text x="242" y="131" text-anchor="middle" fill="#FFFFFF" font-size="11">another</text>
            <text x="242" y="180" text-anchor="middle" fill="#B03068" font-size="11">round ANTIGEN</text>
            <text x="242" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">will not fit \u2717</text>
            <text x="160" y="210" text-anchor="middle" fill="#7A7065" font-size="10.5">wrong shape \u2192 no lock \u2192 no effect</text>
          </svg>`,
          working: ['<b>Picture:</b> the burglar wears a <b>name badge</b>; your body makes <b>handcuffs</b> cut to fit that badge.', '1. The <b>antigen</b> is on the <b>outside of the microbe</b>. The microbe brings it with it. You do not make it.', '2. The <b>antibody</b> is made by <b>your</b> white blood cells (the lymphocytes). Remember: anti<b>body</b> — your <b>body</b> makes it.', '3. An antibody is <b>Y-shaped</b>, and the two arms are cut to the exact shape of one antigen.', '4. So it locks onto that antigen and no other — like a key in a lock.', '5. Once locked on, the microbes are <b>clumped together</b> and <b>marked</b>, and the phagocytes eat them.', '6. That is why being immune to measles does nothing against rubella: different antigen, different shape, and the key does not fit.'],
          a: 'Antigen = the marker on the microbe. Antibody = the Y-shaped protein your body makes to fit it, and only it',
        },
        {
          q: 'Harper is vaccinated against measles. Explain, step by step, how that makes her immune without making her ill.',
          working: ['<b>Picture:</b> a wanted poster handed to the guards before the burglar ever turns up.', '1. The vaccine contains the measles microbe <b>dead or weakened</b>, or just a harmless <b>piece</b> of it.', '2. Whatever form it is in, it still carries the <b>antigen</b> — that is the only part that matters.', '3. It <b>cannot multiply</b>, so it cannot cause the disease. That is why she does not get ill.', '4. Her <b>lymphocytes</b> find the shape and make the matching <b>antibody</b>.', '5. She keeps <b>memory cells</b> for that antigen.', '6. Years later the real measles virus arrives. The memory cells recognise it instantly, a flood of antibodies is made, and it is destroyed before she feels anything. She is <b>immune</b>.'],
          a: 'The vaccine gives her the antigen safely → antibodies → memory cells → immunity, with no illness',
        },
        {
          q: 'What does each kind of microbe actually look like down a microscope?',
          visual: `<svg viewBox="0 0 320 208" width="320" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="15" text-anchor="middle" fill="#4A4033" font-size="12">what microbes look like</text>
            <text x="50" y="34" text-anchor="middle" fill="#3F6B22" font-size="11">bacteria</text>
            <rect x="16" y="46" width="36" height="16" rx="8" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <text x="50" y="78" text-anchor="middle" fill="#4A4033" font-size="10.5">rod</text>
            <circle cx="24" cy="100" r="8" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <circle cx="41" cy="100" r="8" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <circle cx="58" cy="100" r="8" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <text x="50" y="124" text-anchor="middle" fill="#4A4033" font-size="10.5">spheres</text>
            <path d="M20 148 q10 -12 19 0 q9 12 19 0" fill="none" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <text x="50" y="172" text-anchor="middle" fill="#4A4033" font-size="10.5">spiral</text>
            <line x1="98" y1="28" x2="98" y2="182" stroke="#D9BE8A" stroke-width="2"/>
            <text x="154" y="34" text-anchor="middle" fill="#B03068" font-size="11">a virus</text>
            <circle cx="154" cy="92" r="25" fill="#F7D3E2" stroke="#B03068" stroke-width="2"/>
            <path d="M154 67 v-9 M154 117 v9 M129 92 h-9 M179 92 h9 M137 75 l-6 -6 M171 75 l6 -6 M137 109 l-6 6 M171 109 l6 6" stroke="#B03068" stroke-width="2.5" stroke-linecap="round"/>
            <text x="154" y="146" text-anchor="middle" fill="#4A4033" font-size="10.5">a coat, with</text>
            <text x="154" y="160" text-anchor="middle" fill="#4A4033" font-size="10.5">instructions inside</text>
            <text x="154" y="175" text-anchor="middle" fill="#7A7065" font-size="10">not a cell at all</text>
            <line x1="212" y1="28" x2="212" y2="182" stroke="#D9BE8A" stroke-width="2"/>
            <text x="266" y="34" text-anchor="middle" fill="#C08A10" font-size="11">fungi</text>
            <ellipse cx="256" cy="60" rx="15" ry="11" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <circle cx="274" cy="49" r="7" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <text x="266" y="86" text-anchor="middle" fill="#4A4033" font-size="10.5">yeast, budding</text>
            <path d="M224 144 h76 M238 144 v-24 M262 144 v-30 M286 144 v-20" stroke="#4A4033" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="238" cy="116" r="6.5" fill="#B9A5E6" stroke="#4A4033" stroke-width="2"/>
            <circle cx="262" cy="110" r="6.5" fill="#B9A5E6" stroke="#4A4033" stroke-width="2"/>
            <circle cx="286" cy="120" r="6.5" fill="#B9A5E6" stroke="#4A4033" stroke-width="2"/>
            <text x="266" y="162" text-anchor="middle" fill="#4A4033" font-size="10.5">mould: threads</text>
            <text x="266" y="176" text-anchor="middle" fill="#7A7065" font-size="10">+ spore heads</text>
            <text x="160" y="200" text-anchor="middle" fill="#7A7065" font-size="10.5">bacteria and fungi are cells \u00B7 a virus is not</text>
          </svg>`,
          working: ['<b>Picture:</b> sausage, ball, corkscrew, spiky package, budding oval, fuzzy threads.', '1. <b>Bacteria</b> come in three shapes: a <b>rod</b> (like a grain of rice), a <b>sphere</b> (often in chains or clusters like grapes), and a <b>spiral</b> (a corkscrew).', '2. A <b>virus</b> is not a cell. It is a <b>protein coat</b> with <b>instructions</b> folded inside, often drawn as a spiky ball. It is about 20× smaller than a bacterium, so a school microscope will never show you one.', '3. <b>Yeast</b> is a fungus: a fat oval cell with a little <b>bud</b> growing off the side, which breaks away as a new cell.', '4. <b>Mould</b> is a fungus too: a tangle of fine <b>threads</b> with round <b>spore heads</b> on stalks, like tiny lollipops.', '5. The big divide: bacteria and fungi are made of <b>cells</b>. A virus is not.'],
          a: 'Bacteria: rods, spheres, spirals · virus: a coat with instructions · yeast: a budding cell · mould: threads with spore heads',
        },
        {
          q: 'Harper catches a cold every winter, but she had measles once and never again. Why the difference?',
          visual: `<svg viewBox="0 0 320 190" width="320" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="15" text-anchor="middle" fill="#4A4033" font-size="12">antibodies in the blood</text>
            <line x1="36" y1="26" x2="36" y2="148" stroke="#4A4033" stroke-width="2"/>
            <line x1="36" y1="148" x2="304" y2="148" stroke="#4A4033" stroke-width="2"/>
            <path d="M36 148 L66 146 L98 112 L130 122 L162 140 L176 142" fill="none" stroke="#2F6FD0" stroke-width="3.5"/>
            <path d="M176 142 L186 40 L210 34 L248 60 L304 92" fill="none" stroke="#E0568C" stroke-width="3.5"/>
            <line x1="58" y1="148" x2="58" y2="160" stroke="#3F6B22" stroke-width="3"/>
            <text x="58" y="174" text-anchor="middle" fill="#3F6B22" font-size="10.5">1st time</text>
            <line x1="182" y1="148" x2="182" y2="160" stroke="#3F6B22" stroke-width="3"/>
            <text x="186" y="174" text-anchor="middle" fill="#3F6B22" font-size="10.5">2nd time</text>
            <text x="104" y="100" fill="#2F6FD0" font-size="10.5">slow → you get ill</text>
            <text x="202" y="26" fill="#B03068" font-size="10.5">fast → no illness</text>
            <text x="160" y="187" text-anchor="middle" fill="#7A7065" font-size="10.5">memory cells make the second curve</text>
          </svg>`,
          working: ['<b>Picture:</b> the guards remember one face perfectly — but the cold sends a different burglar every year.', '1. <b>Measles:</b> one virus, one <b>antigen</b>. After she had it she kept <b>memory cells</b> for that exact shape. Any measles virus that arrives now is destroyed before she notices — she is <b>immune</b>.', '2. <b>Colds:</b> there are <b>hundreds</b> of different cold viruses, and each has a <b>different antigen</b>.', '3. Being immune to last winter’s cold does nothing against this winter’s, because the antibody is the wrong shape for it.', '4. So her body starts the slow search again — and she gets another cold.', '5. Same reason the flu vaccine is redone every year: the virus keeps changing its antigen.'],
          a: 'Measles has one antigen so her memory cells cover it; colds come in hundreds of different antigens',
        },
        {
          q: 'Harper grazes her knee, cleans it with antiseptic and it heals. Her brother gets strep throat and is given antibiotics. Explain why each got a different thing.',
          working: ['<b>Picture:</b> the right tool for the place — on the skin, or inside you.', '1. Harper’s problem is <b>on the outside</b>: microbes on a graze. An <b>antiseptic</b> is a chemical that kills microbes <b>on skin</b> and is gentle enough not to damage her.', '2. Her brother’s problem is <b>inside</b>: <b>bacteria</b> growing in his throat. That needs an <b>antibiotic</b> — a medicine you swallow that kills bacteria in your body.', '3. An antiseptic would be useless swallowed, and it is not meant to be.', '4. And if his sore throat had been <b>viral</b>, the antibiotic would have done nothing at all — antibiotics never work on viruses.', '5. The fourth one in this family is a <b>vaccine</b>: not for treating either of them, but for training the defences <b>before</b> you ever meet the microbe. And a <b>disinfectant</b> is for the bench, never for people.'],
          a: 'Antiseptic kills microbes on skin; antibiotics kill bacteria inside you — and only bacteria',
        },
        {
          q: 'Name four diseases caused by microbes and say how each one spreads.',
          working: ['<b>Picture:</b> every disease needs a <b>road</b> to travel along. Name the road and you know how to block it.', '1. <b>The common cold</b> (a virus) — <b>droplets in the air</b> from coughs and sneezes, and hands onto door handles. Block it: cough into your elbow, wash your hands.', '2. <b>Salmonella food poisoning</b> (bacteria) — <b>food</b>, from undercooked chicken or food left sitting warm. Block it: cook it through, keep it cold.', '3. <b>Cholera</b> (bacteria) — <b>water</b> that sewage has got into. Block it: clean water and proper sewers.', '4. <b>Athlete’s foot</b> (a fungus) — <b>touch</b>, from bare feet on a wet changing-room floor. Block it: dry your feet, wear jandals.', '5. Two more worth knowing: <b>malaria</b> spreads by <b>mosquito bite</b> (net and drain still water), and <b>tetanus</b> comes from <b>soil in a deep cut</b> — not from other people at all.'],
          a: 'Cold → air · salmonella → food · cholera → water · athlete’s foot → touch (and malaria → mosquito bite)',
        },
      ],
      tips: [
        'The single most common mix-up: <b>antigen is on the microbe, antibody is made by you</b>. Say "anti<b>body</b> — my <b>body</b> makes it" every time.',
        'Antibodies do not kill the microbe by themselves. They <b>lock on, clump them and mark them</b> — the phagocytes do the eating.',
        'A vaccine is <b>not</b> a cure. It only works <b>before</b> you meet the microbe.',
        '<b>Antibiotics never work on a virus.</b> Colds, flu, measles, rubella, chickenpox and HIV are all viruses.',
        'Immunity is <b>specific</b>. Being immune to one disease says nothing about any other one.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [pathogenQ, looksQ, looksGroupQ, diseaseQ, barrierQ, phagocyteQ, antibodyQ, immunityQ, vaccineQ, medicineQ, stopSpreadQ, defenceOrderQ, immunityCalc]
        : level === 2
          ? [pathogenQ, looksQ, looksGroupQ, diseaseQ, barrierQ, phagocyteQ, antibodyQ, antibodyQ, immunityQ, immunityQ, vaccineQ, medicineQ, stopSpreadQ, defenceOrderQ, immunityCalc]
          : [pathogenQ, looksQ, looksGroupQ, diseaseQ, phagocyteQ, antibodyQ, antibodyQ, immunityQ, immunityQ, vaccineQ, vaccineQ, medicineQ, stopSpreadQ, defenceOrderQ, immunityCalc];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
