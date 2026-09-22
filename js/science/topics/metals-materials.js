/* Topic: Properties of materials, metals vs non-metals, and density (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const PROPS = [
    { name: 'hardness', def: 'how well it resists being scratched or dented', test: 'try to scratch it with something else' },
    { name: 'strength', def: 'how much force it can take before it breaks', test: 'hang heavier and heavier weights on it' },
    { name: 'flexibility', def: 'how far it bends without snapping', test: 'bend it and see if it springs back' },
    { name: 'thermal conductivity', def: 'how easily heat travels through it', test: 'stand a rod in hot water and feel the top' },
    { name: 'electrical conductivity', def: 'how easily electricity travels through it', test: 'put it in a circuit and see if the bulb lights' },
    { name: 'density', def: 'how much mass is packed into each cubic centimetre', test: 'weigh it, measure its volume, then divide' },
    { name: 'magnetism', def: 'whether a magnet is attracted to it', test: 'hold a magnet near it' },
    { name: 'transparency', def: 'whether you can see through it', test: 'try to read a page through it' },
    { name: 'brittleness', def: 'whether it snaps or shatters instead of bending', test: 'bend it and see if it cracks straight away' },
    { name: 'being waterproof', def: 'whether water soaks into it or runs off', test: 'drip water on it and watch' },
  ];

  const CHOICES = [
    { job: 'a window', material: 'glass', prop: 'it is transparent', wrong: 'you could not see through steel' },
    { job: 'the bottom of a saucepan', material: 'steel', prop: 'it conducts heat well', wrong: 'plastic would melt and would not pass the heat through' },
    { job: 'the handle of a saucepan', material: 'plastic', prop: 'it is a poor conductor of heat, so it stays cool', wrong: 'a metal handle would burn your hand' },
    { job: 'the wire inside an electric cable', material: 'copper', prop: 'it conducts electricity really well and bends easily', wrong: 'plastic would not let the current through at all' },
    { job: 'the covering around an electric cable', material: 'plastic', prop: 'it does not conduct electricity, so it keeps you safe', wrong: 'a metal covering would give you a shock' },
    { job: 'a raincoat', material: 'coated nylon', prop: 'it is waterproof and flexible', wrong: 'cotton would soak the rain straight up' },
    { job: 'a road bridge', material: 'steel', prop: 'it is extremely strong', wrong: 'plastic would bend and snap under the traffic' },
    { job: 'a car tyre', material: 'rubber', prop: 'it is flexible and grips the road', wrong: 'a metal tyre could not grip or absorb bumps' },
    { job: 'a fizzy drink can', material: 'aluminium', prop: 'it is light and does not rust', wrong: 'an iron can would go rusty on the shelf' },
    { job: 'an oven glove', material: 'thick fabric', prop: 'it is a poor conductor of heat', wrong: 'metal would conduct the heat straight into your hand' },
    { job: 'a knife blade', material: 'steel', prop: 'it is hard and keeps a sharp edge', wrong: 'a plastic blade would go blunt immediately' },
    { job: 'a ladder you have to carry', material: 'aluminium', prop: 'it is strong but has a low density, so it is light', wrong: 'a lead ladder would be far too heavy to lift' },
    { job: 'a life jacket', material: 'foam', prop: 'it has a very low density, so it floats', wrong: 'a steel jacket would take you straight to the bottom' },
    { job: 'a diving weight belt', material: 'lead', prop: 'it has a very high density, so it is heavy for its size', wrong: 'foam would float you back to the surface' },
    { job: 'a greenhouse at the school garden', material: 'glass', prop: 'it lets the sunlight through', wrong: 'wooden walls would keep the plants in the dark' },
    { job: 'a roof at a beach house', material: 'coated steel', prop: 'the coating keeps out the salty air so it will not rust', wrong: 'bare iron would rust within a year at the beach' },
    { job: 'a mountain bike frame', material: 'aluminium', prop: 'it is strong but light', wrong: 'a lead frame would be impossible to pedal' },
    { job: 'a fishing line', material: 'nylon', prop: 'it is strong, thin and flexible', wrong: 'a glass line would snap the moment a fish pulled' },
  ];

  const METAL_PROPS = ['shiny when polished', 'good conductor of heat', 'good conductor of electricity', 'can be hammered into shape (malleable)', 'can be pulled into wires (ductile)', 'usually a high melting point', 'usually a high density'];
  const NONMETAL_PROPS = ['dull, not shiny', 'poor conductor of heat (an insulator)', 'does not conduct electricity', 'brittle — it snaps instead of bending', 'usually a low melting point', 'usually a low density', 'many of them are gases at room temperature'];

  const MATS = [
    { name: 'cork', m: 12, v: 50, d: 0.24 },
    { name: 'pine wood', m: 25, v: 50, d: 0.5 },
    { name: 'ice', m: 46, v: 50, d: 0.92 },
    { name: 'plastic', m: 95, v: 100, d: 0.95 },
    { name: 'glass', m: 50, v: 20, d: 2.5 },
    { name: 'aluminium', m: 54, v: 20, d: 2.7 },
    { name: 'iron', m: 79, v: 10, d: 7.9 },
    { name: 'copper', m: 89, v: 10, d: 8.9 },
    { name: 'lead', m: 113, v: 10, d: 11.3 },
    { name: 'gold', m: 193, v: 10, d: 19.3 },
  ];

  const MAGNETIC = ['iron', 'steel', 'nickel', 'cobalt'];
  const NOT_MAGNETIC = ['aluminium', 'copper', 'gold', 'silver', 'brass', 'plastic', 'glass', 'wood'];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms for each material property, used when she has to name the property herself. */
  const PROP_ACCEPT = {
    hardness: ['hard'],
    strength: ['strong'],
    flexibility: ['flexible'],
    'thermal conductivity': ['conducts heat', 'heat conductivity', 'conducts heat well'],
    'electrical conductivity': ['conducts electricity', 'electrical conductivity', 'conductivity'],
    density: [],
    magnetism: ['magnetic'],
    transparency: ['transparent'],
    brittleness: ['brittle'],
    'being waterproof': ['waterproof'],
  };

  /* ---------- diagrams ---------- */
  const conceptSvg = () => `<svg viewBox="0 0 344 200" width="344" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <path d="M84 26 L146 132 L22 132 Z" fill="#FDF3DC" stroke="#E8C24A" stroke-width="3" stroke-linejoin="round"/>
      <line x1="50" y1="88" x2="118" y2="88" stroke="#E8C24A" stroke-width="3"/>
      <text x="84" y="76" text-anchor="middle" fill="#4A4033" font-size="22">m</text>
      <text x="62" y="122" text-anchor="middle" fill="#4A4033" font-size="20">d</text>
      <text x="84" y="122" text-anchor="middle" fill="#C98A1C" font-size="15">×</text>
      <text x="106" y="122" text-anchor="middle" fill="#4A4033" font-size="20">v</text>
      <text x="84" y="152" text-anchor="middle" fill="#C98A1C" font-size="11.5">cover the one you want</text>
      <text x="84" y="170" text-anchor="middle" fill="#4A4033" font-size="11.5">d = m ÷ v</text>
      <path d="M196 46 L196 152 L322 152 L322 46" fill="none" stroke="#8B76C4" stroke-width="2.5"/>
      <rect x="198" y="76" width="122" height="74" fill="#DCEEF9"/>
      <rect x="210" y="66" width="34" height="22" rx="3" fill="#E9A07A" stroke="#C97B52" stroke-width="2"/>
      <rect x="278" y="128" width="30" height="20" rx="3" fill="#9A938A" stroke="#6E675F" stroke-width="2"/>
      <text x="259" y="36" text-anchor="middle" fill="#5F98C4" font-size="11.5">water = 1 g/cm³</text>
      <text x="252" y="76" fill="#C97B52" font-size="11.5">floats</text>
      <text x="272" y="122" text-anchor="end" fill="#4A4033" font-size="11.5">sinks</text>
      <text x="172" y="190" text-anchor="middle" fill="#4A4033" font-size="12">under 1 = floats · over 1 = sinks</text>
    </svg>`;

  /* two narrow tables — a wide 4-column one does not fit a phone screen */
  const mvTable = (rows) => `<table class="data"><tr><th>object</th><th>mass (g)</th><th>volume (cm³)</th></tr>`
    + rows.map((r) => `<tr><td>${r.name}</td><td>${r.m}</td><td>${r.v}</td></tr>`).join('') + `</table>`;
  const dTable = (rows) => `<table class="data"><tr><th>material</th><th>density (g/cm³)</th></tr>`
    + rows.map((r) => `<tr><td>${r.name}</td><td>${r.d}</td></tr>`).join('') + `</table>`;

  const metalTable = () => `<table class="data"><tr><th></th><th>metals</th><th>non-metals</th></tr>`
    + `<tr><td>look</td><td>shiny</td><td>dull</td></tr>`
    + `<tr><td>heat</td><td>good conductor</td><td>poor conductor</td></tr>`
    + `<tr><td>electricity</td><td>good conductor</td><td>does not conduct</td></tr>`
    + `<tr><td>bending</td><td>bends and hammers</td><td>brittle — snaps</td></tr>`
    + `<tr><td>density</td><td>usually high</td><td>usually low</td></tr></table>`;

  const testSvg = (prop) => `<svg viewBox="0 0 330 160" width="330" height="160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="18" y="30" width="120" height="30" rx="6" fill="#E8C24A" stroke="#C98A1C" stroke-width="2.5"/>
      <text x="78" y="50" text-anchor="middle" fill="#4A4033">sample</text>
      <text x="78" y="80" text-anchor="middle" fill="#4A4033" font-size="11.5">the same size</text>
      <text x="78" y="96" text-anchor="middle" fill="#4A4033" font-size="11.5">and shape each time</text>
      <line x1="152" y1="45" x2="184" y2="45" stroke="#4A4033" stroke-width="2.5"/><path d="M190 45 l-9 -5 l0 10z" fill="#4A4033"/>
      <rect x="198" y="24" width="118" height="44" rx="8" fill="#F0E7FB" stroke="#8B76C4" stroke-width="2.5"/>
      <text x="257" y="42" text-anchor="middle" fill="#8B76C4" font-size="11.5">TEST</text>
      <text x="257" y="60" text-anchor="middle" fill="#4A4033" font-size="11.5">${prop}</text>
      <text x="165" y="126" text-anchor="middle" fill="#C98A1C" font-size="12">change ONE thing: the material</text>
      <text x="165" y="146" text-anchor="middle" fill="#4A4033" font-size="12">keep everything else the same</text>
    </svg>`;

  /* ---------- question makers ---------- */
  function propMeaning(level) {
    const p = R.pick(PROPS);
    if (R.chance(0.5)) {
      const opt = choice(p.def, PROPS.filter((x) => x.name !== p.name).map((x) => x.def));
      return {
        prompt: `What does <b>${p.name}</b> mean?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: `You would test it like this: ${p.test}.`,
        working: [`<b>Picture:</b> to test it you would ${p.test}.`, `<b>${p.name}</b> = ${p.def}.`],
        finalAnswer: p.def, skill: 'properties',
      };
    }
    return {
      prompt: `Which property means <b>${p.def}</b>?`,
      answer: textAns(p.name, PROP_ACCEPT[p.name], 'one or two words'),
      hint: `You would test it by: ${p.test}.`,
      working: [`<b>Picture:</b> ${p.test}.`, `That property is <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'properties',
    };
  }
  function propTest(level) {
    const p = R.pick(PROPS);
    const opt = choice(p.test, PROPS.filter((x) => x.name !== p.name).map((x) => x.test));
    return {
      visual: testSvg(p.name),
      prompt: `How would you test a material for its <b>${p.name}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: p.def.charAt(0).toUpperCase() + p.def.slice(1) + '.',
      working: [`<b>Picture:</b> same-size samples, one test, only the material changes.`, `1. ${p.name} means ${p.def}.`, `2. So you would <b>${p.test}</b>.`],
      finalAnswer: p.test, skill: 'properties',
    };
  }
  function bestMaterial(level) {
    const c = R.pick(CHOICES);
    const opt = choice(c.material, CHOICES.filter((x) => x.material !== c.material).map((x) => x.material));
    return {
      prompt: `Which material should be used for <b>${c.job}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: `Think about the one property the job really needs.`,
      working: ['<b>Picture:</b> match the property to the job — a window needs to be see-through, a saucepan needs heat to get through it.', `1. What does ${c.job} need? Something where <b>${c.prop}</b>.`, `2. ${c.wrong.charAt(0).toUpperCase() + c.wrong.slice(1)}.`, `So use <b>${c.material}</b>.`],
      finalAnswer: c.material, skill: 'choosing',
    };
  }
  function whyMaterial(level) {
    const c = R.pick(CHOICES);
    const opt = choice(c.prop, CHOICES.filter((x) => x.job !== c.job).map((x) => x.prop));
    return {
      prompt: `<b>${c.job.charAt(0).toUpperCase() + c.job.slice(1)}</b> is made of <b>${c.material}</b>. Why is that a good choice?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Name the property that matters for this particular job.',
      working: ['<b>Picture:</b> match the property to the job.', `1. ${c.wrong.charAt(0).toUpperCase() + c.wrong.slice(1)}.`, `2. ${c.material.charAt(0).toUpperCase() + c.material.slice(1)} is used because <b>${c.prop}</b>.`],
      finalAnswer: c.prop, skill: 'choosing',
    };
  }
  function metalProperty(level) {
    const isMetal = R.chance(0.5);
    const correct = R.pick(isMetal ? METAL_PROPS : NONMETAL_PROPS);
    const opt = choice(correct, isMetal ? NONMETAL_PROPS : METAL_PROPS, 4);
    return {
      visual: metalTable(),
      prompt: `Use the table. Which of these is a property of <b>${isMetal ? 'metals' : 'non-metals'}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Metals: shiny, conduct, bend. Non-metals: dull, insulate, snap.',
      working: ['<b>Picture:</b> a shiny spoon (metal) next to a dull plastic ruler (non-metal).', `1. Read down the ${isMetal ? 'metals' : 'non-metals'} column.`, `<b>${correct}</b> is in that column.`],
      finalAnswer: correct, skill: 'metals',
    };
  }
  function whichIsMetal(level) {
    const isMetal = R.chance(0.5);
    const clue = isMetal
      ? R.pick(['it is shiny, bends without snapping and lights the bulb in a circuit', 'it conducts heat quickly and can be hammered flat', 'it is shiny, dense and can be pulled into a wire'])
      : R.pick(['it is dull, snaps when you bend it and will not light the bulb', 'it is dull, light and does not conduct heat', 'it shatters when hit and does not conduct electricity']);
    const correct = isMetal ? 'a metal' : 'a non-metal';
    return {
      visual: metalTable(),
      prompt: `Harper tests an unknown solid: <b>${clue}</b>. Is it a metal or a non-metal?`,
      answer: textAns(isMetal ? 'metal' : 'non-metal', isMetal ? ['a metal'] : ['a non-metal', 'nonmetal', 'non metal'], 'one word'),
      hint: 'Check the clues against the table.',
      working: ['<b>Picture:</b> a shiny spoon (metal) next to a dull plastic ruler (non-metal).', `1. Her clues: ${clue}.`, `2. Those all match the <b>${isMetal ? 'metals' : 'non-metals'}</b> column.`, `So it is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'metals',
    };
  }
  function magnetQ(level) {
    const isMag = R.chance(0.5);
    const item = isMag ? R.pick(MAGNETIC) : R.pick(NOT_MAGNETIC);
    const opt = choice(isMag ? 'Yes' : 'No', [isMag ? 'No' : 'Yes'], 2);
    return {
      prompt: `Will a magnet stick to <b>${item}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Only iron, steel, nickel and cobalt are magnetic — most metals are NOT.',
      working: ['<b>Picture:</b> a fridge magnet sticks to a steel fridge but slides off an aluminium can.', `1. The magnetic ones are iron, steel, nickel and cobalt.`, `2. Is ${item} on that list? ${isMag ? 'Yes.' : 'No.'}`, `So the answer is <b>${isMag ? 'yes' : 'no'}</b>.`],
      finalAnswer: isMag ? 'Yes' : 'No', skill: 'metals',
    };
  }
  function densityCalc(level) {
    const mat = R.pick(MATS);
    return {
      prompt: `A block of <b>${mat.name}</b> has a mass of <b>${mat.m} g</b> and a volume of <b>${mat.v} cm³</b>. What is its density?`,
      answer: { type: 'number', value: mat.d, unit: 'g/cm³', tolerance: 0.01, placeholder: 'e.g. 2.5' },
      hint: 'density = mass ÷ volume.',
      working: [
        '<b>Picture:</b> density is how much stuff is squashed into each little 1 cm cube.',
        '1. Which one do I want? Density → cover <b>d</b> in the triangle: it leaves <b>m over v</b>.',
        `2. ${mat.m} ÷ ${mat.v} = <b>${mat.d}</b>`,
      ],
      finalAnswer: `${mat.d} g/cm³`, skill: 'density',
    };
  }
  function massCalc(level) {
    const mat = R.pick(MATS);
    return {
      prompt: `<b>${mat.name.charAt(0).toUpperCase() + mat.name.slice(1)}</b> has a density of <b>${mat.d} g/cm³</b>. What is the mass of a <b>${mat.v} cm³</b> piece?`,
      answer: { type: 'number', value: mat.m, unit: 'g', tolerance: 0.01, placeholder: 'e.g. 54' },
      hint: 'Cover m in the triangle — it leaves d × v.',
      working: ['<b>Picture:</b> the density triangle — cover the letter you want.', '1. Cover <b>m</b>: what is left is <b>d × v</b>.', `2. ${mat.d} × ${mat.v} = <b>${mat.m}</b> g`],
      finalAnswer: `${mat.m} g`, skill: 'density',
    };
  }
  function volumeCalc(level) {
    const mat = R.pick(MATS);
    return {
      prompt: `A piece of <b>${mat.name}</b> has a mass of <b>${mat.m} g</b> and a density of <b>${mat.d} g/cm³</b>. What is its volume?`,
      answer: { type: 'number', value: mat.v, unit: 'cm³', tolerance: 0.05, placeholder: 'e.g. 20' },
      hint: 'Cover v in the triangle — it leaves m ÷ d.',
      working: ['<b>Picture:</b> the density triangle — cover the letter you want.', '1. Cover <b>v</b>: what is left is <b>m over d</b>.', `2. ${mat.m} ÷ ${mat.d} = <b>${mat.v}</b> cm³`],
      finalAnswer: `${mat.v} cm³`, skill: 'density',
    };
  }
  function tableDensity(level) {
    const rows = R.sample(MATS, 3);
    const target = R.pick(rows);
    return {
      visual: mvTable(rows),
      prompt: `Use the table. What is the <b>density of the ${target.name}</b>?`,
      answer: { type: 'number', value: target.d, unit: 'g/cm³', tolerance: 0.01, placeholder: 'e.g. 2.5' },
      hint: 'density = mass ÷ volume. Read the two numbers off that row.',
      working: ['<b>Picture:</b> the density triangle — cover <b>d</b> and you are left with m over v.', `1. Read the ${target.name} row: mass = ${target.m} g, volume = ${target.v} cm³.`, `2. ${target.m} ÷ ${target.v} = <b>${target.d} g/cm³</b>`],
      finalAnswer: `${target.d} g/cm³`, skill: 'density',
    };
  }
  function tableCompare(level) {
    const rows = R.sample(MATS, 4);
    const form = R.pick(['densest', 'lightest', 'floats']);
    if (form === 'floats') {
      const floaters = rows.filter((r) => r.d < 1);
      if (!floaters.length) return tableDensity(level);
      const target = floaters[0];
      const opt = choice(target.name, rows.filter((r) => r.name !== target.name).map((r) => r.name), 4);
      return {
        visual: dTable(rows),
        prompt: 'Use the table. Which of these would <b>float</b> in water?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Water has a density of 1 g/cm³. Anything less dense than that floats.',
        working: ['<b>Picture:</b> a cork bobs on top; a coin drops to the bottom.', '1. Water = <b>1 g/cm³</b>.', '2. Look for a density <b>less than 1</b>.', `3. ${target.name} is ${target.d} g/cm³, which is under 1.`, `So the <b>${target.name}</b> floats.`],
        finalAnswer: target.name, skill: 'density',
      };
    }
    const densest = form === 'densest';
    const target = rows.slice().sort((a, b) => (densest ? b.d - a.d : a.d - b.d))[0];
    const opt = choice(target.name, rows.filter((r) => r.name !== target.name).map((r) => r.name), 4);
    return {
      visual: dTable(rows),
      prompt: `Use the table. Which material is the <b>${densest ? 'most dense' : 'least dense'}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: `${densest ? 'Most' : 'Least'} dense = the ${densest ? 'biggest' : 'smallest'} number in the density column.`,
      working: ['<b>Picture:</b> the same-size cube of each material — which one weighs the most?', `1. Compare the density column.`, `2. The ${densest ? 'biggest' : 'smallest'} is <b>${target.d} g/cm³</b>.`, `That is the <b>${target.name}</b>.`],
      finalAnswer: target.name, skill: 'density',
    };
  }
  function floatSink(level) {
    const mat = R.pick(MATS);
    const floats = mat.d < 1;
    const opt = choice(floats ? 'It floats' : 'It sinks', [floats ? 'It sinks' : 'It floats'], 2);
    return {
      visual: conceptSvg(),
      prompt: `<b>${mat.name.charAt(0).toUpperCase() + mat.name.slice(1)}</b> has a density of <b>${mat.d} g/cm³</b>. Does it float or sink in water?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Water is 1 g/cm³. Less than that floats, more than that sinks.',
      working: ['<b>Picture:</b> a cork bobbing on top, a coin on the bottom.', `1. Water = <b>1 g/cm³</b>.`, `2. ${mat.name} is ${mat.d}, which is ${floats ? 'LESS' : 'MORE'} than 1.`, `So <b>it ${floats ? 'floats' : 'sinks'}</b>.`],
      finalAnswer: floats ? 'It floats' : 'It sinks', skill: 'density',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('Metal for the pan (it conducts heat to the food) and plastic for the handle (it does not, so it stays cool)', [
        'Metal for both, because metal is stronger',
        'Plastic for both, because plastic is lighter',
        'Plastic for the pan and metal for the handle',
      ], 4);
      return {
        prompt: 'A saucepan has a metal base and a plastic handle. Explain why each part is made of a different material.',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The two parts need OPPOSITE properties: one must pass heat on, one must not.',
        working: [
          '<b>Picture:</b> the pan must let the heat through; your hand must not feel it.',
          '1. The base needs heat to travel through fast → a good <b>conductor</b> → metal.',
          '2. The handle must stop heat reaching your hand → a good <b>insulator</b> → plastic.',
        ],
        finalAnswer: 'Metal conducts heat into the food; plastic insulates the handle',
      };
    },
    () => {
      const opt = choice('Copper inside because it conducts electricity, plastic outside because it does not', [
        'Copper because it is cheap and plastic because it is pretty',
        'Plastic inside because it is flexible and copper outside because it is shiny',
        'Both are just for strength',
      ], 4);
      return {
        prompt: 'An electric cable has copper inside and plastic on the outside. Why those two materials?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'One must let electricity through; the other must definitely not.',
        working: ['<b>Picture:</b> the current runs down the middle and must never reach your hand.', '1. Copper is a great <b>conductor</b> → the current flows through it.', '2. Plastic is an <b>insulator</b> → it keeps the current in and you safe.'],
        finalAnswer: 'Copper conducts the electricity; plastic insulates it',
      };
    },
    () => {
      const mat = R.pick(MATS);
      return {
        visual: mvTable([mat].concat(R.sample(MATS.filter((x) => x.name !== mat.name), 2))),
        prompt: `Harper measures a block of <b>${mat.name}</b>: mass ${mat.m} g, volume ${mat.v} cm³. Work out its density.`,
        answer: { type: 'number', value: mat.d, unit: 'g/cm³', tolerance: 0.01, placeholder: 'e.g. 2.5' },
        hint: 'density = mass ÷ volume.',
        working: ['<b>Picture:</b> the density triangle — cover the <b>d</b> and you are left with m over v.', `1. ${mat.m} ÷ ${mat.v}`, `2. = <b>${mat.d} g/cm³</b>`],
        finalAnswer: `${mat.d} g/cm³`,
      };
    },
    () => {
      const opt = choice('Because ice is less dense than water (0.92 g/cm³ against 1 g/cm³)', [
        'Because ice is lighter than water in every way',
        'Because ice is colder than water',
        'Because ice has no mass',
      ], 4);
      return {
        visual: conceptSvg(),
        prompt: 'Why do ice cubes float in a glass of water?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Compare the two densities, not the two weights.',
        working: ['<b>Picture:</b> the same-size cube of each — the icy one weighs less.', '1. Water = 1 g/cm³.', '2. Ice = 0.92 g/cm³, which is <b>less than 1</b>.', 'Anything less dense than water floats.'],
        finalAnswer: 'Ice is less dense than water (0.92 vs 1 g/cm³)',
      };
    },
    () => {
      const opt = choice('Use the same size and shape of every material and change only the material', [
        'Use a bigger piece of the material you think will win',
        'Test each one in a different way',
        'Only test the materials you already know about',
      ], 4);
      return {
        visual: testSvg('strength'),
        prompt: 'Harper wants to find out which material is strongest. How should she make it a <b>fair test</b>?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'In a fair test only ONE thing is allowed to change.',
        working: [
          '<b>Picture:</b> identical strips, identical hooks, identical weights added one at a time.',
          '1. What is she testing? The <b>material</b>.',
          '2. So the material is the only thing allowed to change.',
          '3. Same size, same shape, same way of adding weight, every time.',
        ],
        finalAnswer: 'Keep everything the same except the material',
      };
    },
    () => {
      const opt = choice('Aluminium — it is strong enough but has a much lower density, so the ladder is light to carry', [
        'Lead — it is the heaviest so it must be the strongest',
        'Glass — it is see-through',
        'Rubber — it bends easily',
      ], 4);
      return {
        prompt: 'A ladder has to be strong AND easy to carry up a hill. Which material, and why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'You need two properties at once: strong, and low density.',
        working: ['<b>Picture:</b> carrying a metal ladder up a track — you want strength without the weight.', '1. It must not bend or snap → <b>strong</b>.', '2. It must be light for its size → <b>low density</b>.', '3. Aluminium ticks both; lead is far too dense.'],
        finalAnswer: 'Aluminium — strong but low density',
      };
    },
    () => {
      const opt = choice('No — most metals are not magnetic. Only iron, steel, nickel and cobalt are', [
        'Yes — every metal is magnetic',
        'Yes — but only shiny metals',
        'No metal is magnetic',
      ], 4);
      return {
        prompt: 'Spot the mistake: Harper\'s friend says "if a magnet does not stick to it, it cannot be a metal". Is he right?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Try a magnet on an aluminium drink can, a copper coin and a gold ring.',
        working: ['<b>Picture:</b> a fridge magnet sticks to a steel fridge but slides straight off an aluminium can.', '1. Aluminium, copper and gold are all metals.', '2. A magnet does not stick to any of them.', 'So he is <b>wrong</b> — only iron, steel, nickel and cobalt are magnetic.'],
        finalAnswer: 'No — only iron, steel, nickel and cobalt are magnetic',
      };
    },
    () => {
      const rows = R.sample(MATS, 4);
      const target = rows.slice().sort((a, b) => b.d - a.d)[0];
      const opt = choice(target.name, rows.filter((r) => r.name !== target.name).map((r) => r.name), 4);
      return {
        visual: dTable(rows),
        prompt: 'Harper needs a diving weight: something very heavy for its size. Use the table to pick the best material.',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Heavy for its size = the highest density.',
        working: ['<b>Picture:</b> a small block you can barely lift — that is high density.', '1. "Heavy for its size" means <b>high density</b>.', `2. The biggest number in the density column is <b>${target.d} g/cm³</b>.`, `So use <b>${target.name}</b>.`],
        finalAnswer: target.name,
      };
    },
    () => {
      const c = R.pick(CHOICES);
      const opt = choice(c.prop, CHOICES.filter((x) => x.job !== c.job).map((x) => x.prop));
      return {
        prompt: `Harper is designing <b>${c.job}</b> for a technology project and chooses <b>${c.material}</b>. Which property is she relying on?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Ask what would go wrong if she used the wrong material.',
        working: ['<b>Picture:</b> match the property to the job.', `1. ${c.wrong.charAt(0).toUpperCase() + c.wrong.slice(1)}.`, `2. She is relying on the fact that <b>${c.prop}</b>.`],
        finalAnswer: c.prop,
      };
    },
    () => {
      const opt = choice('It would be waterproof but you could not see out of it', [
        'It would work perfectly well',
        'It would be see-through but let the rain in',
        'It would conduct electricity',
      ], 4);
      return {
        prompt: 'What would be wrong with making a window out of steel? Name the property it fails on.',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'A window has one job above all others.',
        working: ['<b>Picture:</b> a wall with a metal plate where the glass should be.', '1. What does a window need? To be <b>transparent</b>.', '2. Steel is strong and waterproof, but it is not see-through.'],
        finalAnswer: 'Steel is not transparent',
      };
    },
    () => {
      const opt = choice('The mass and the volume — then divide the mass by the volume', [
        'Just the mass', 'Just the volume', 'The temperature and the mass',
      ], 4);
      return {
        visual: conceptSvg(),
        prompt: 'Harper is given a lump of unknown metal and asked to find its density. What two things must she measure?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Look at the density triangle — what is underneath the line?',
        working: [
          '<b>Picture:</b> the density triangle — cover the <b>d</b> and m over v is left.',
          '1. Weigh it on a balance → the <b>mass</b> in grams.',
          '2. Lower it into a measuring cylinder of water and see how far the water rises → the <b>volume</b> in cm³.',
          '3. Then divide: mass ÷ volume.',
        ],
        finalAnswer: 'Mass and volume — then density = mass ÷ volume',
      };
    },
  ];

  HL.registerTopic({
    id: 'metals-materials', subject: 'science', strand: 'material', order: 7,
    name: 'Materials, metals & density', short: 'Materials', animal: 'crab',
    blurb: 'Choosing the right stuff for the job — and working out density.',
    example: 'density = mass ÷ volume · under 1 g/cm³ floats',
    learn: {
      what: '<p>Every material has its own set of <b>properties</b>: how hard it is, how strong, whether it bends, whether heat or electricity travels through it, how dense it is, whether a magnet sticks. Engineers choose a material by asking which property the job really needs. <b>Density</b> tells you how much mass is packed into each cubic centimetre — and it decides whether something floats.</p><p><b>Picture for this topic:</b> a <b>saucepan</b>. The base is metal so the heat gets through, the handle is plastic so your hand stays cool. Same object, two materials, two different properties.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>density = mass ÷ volume</b>, in <b>g/cm³</b>. Cover the letter you want on the triangle',
        'Water is <b>1 g/cm³</b>. Less dense than 1 → it <b>floats</b>. More than 1 → it <b>sinks</b>',
        '<b>Metals:</b> shiny, good conductors of heat and electricity, bend and hammer into shape, usually dense',
        '<b>Non-metals:</b> dull, poor conductors (insulators), <b>brittle</b> — they snap instead of bending',
        'Only <b>iron, steel, nickel and cobalt</b> are magnetic — most metals are not',
        'Pick a material by asking: <b>which property does this job actually need?</b>',
      ],
      steps: [
        'For "which material?", say the job out loud and name the <b>one property</b> it needs: see through it → transparent; carry heat → conductor; keep heat out → insulator; hold a lot of weight → strong; bend without snapping → flexible.',
        'For "why this material?", give the property AND what would go wrong without it: "plastic, because it does not conduct heat, so the handle stays cool".',
        'For density, write down what you have and what you want, then use the triangle: cover <b>d</b> → m ÷ v; cover <b>m</b> → d × v; cover <b>v</b> → m ÷ d.',
        'For float or sink, only ever compare with <b>1 g/cm³</b>. Do not compare weights — a huge log floats and a tiny nail sinks.',
        'For a metal-or-non-metal mystery solid, check three things: <b>shiny? conducts? bends or snaps?</b>',
      ],
      examples: [
        {
          q: 'Why is the handle of a saucepan made of plastic and the base made of metal?',
          working: ['<b>Picture:</b> the pan must let heat through; your hand must not feel it.', '1. The base needs heat to travel through → a good <b>conductor</b> → metal.', '2. The handle must stop heat reaching your hand → an <b>insulator</b> → plastic.'],
          a: 'Metal conducts heat into the food; plastic insulates the handle',
        },
        {
          q: 'A block has a mass of 54 g and a volume of 20 cm³. What is its density?',
          visual: conceptSvg(),
          working: ['<b>Picture:</b> the triangle — cover the letter you want.', '1. I want <b>d</b>, so cover it: <b>m over v</b> is left.', '2. 54 ÷ 20 = <b>2.7</b>', '3. Units: <b>g/cm³</b>.'],
          a: '2.7 g/cm³ (that is aluminium)',
        },
        {
          q: 'Use the table. Which material would float in water, and which is the densest?',
          visual: `<table class="data"><tr><th>material</th><th>density (g/cm³)</th></tr><tr><td>cork</td><td>0.24</td></tr><tr><td>glass</td><td>2.5</td></tr><tr><td>iron</td><td>7.9</td></tr></table>`,
          working: ['<b>Picture:</b> a cork bobs, a nail drops.', '1. Water is <b>1 g/cm³</b>.', '2. Only cork (0.24) is under 1 → cork <b>floats</b>.', '3. The biggest number in the column is 7.9 → <b>iron</b> is densest.'],
          a: 'Cork floats; iron is the densest',
        },
        {
          q: 'Harper tests a mystery solid: it is dull, it snaps when she bends it, and it will not light the bulb in a circuit. Metal or non-metal?',
          visual: `<table class="data"><tr><th></th><th>metals</th><th>non-metals</th></tr><tr><td>look</td><td>shiny</td><td>dull</td></tr><tr><td>electricity</td><td>good conductor</td><td>does not conduct</td></tr><tr><td>bending</td><td>bends and hammers</td><td>brittle — snaps</td></tr></table>`,
          working: ['<b>Picture:</b> a shiny spoon next to a dull plastic ruler.', '1. Dull → non-metal column.', '2. Snaps (brittle) → non-metal column.', '3. Does not conduct → non-metal column.', 'All three clues agree.'],
          a: 'A non-metal',
        },
        {
          q: 'A ladder must be strong but easy to carry. Which material, and why?',
          working: ['<b>Picture:</b> carrying a ladder up a hill — you want strength without the weight.', '1. It must not bend or break → <b>strong</b>.', '2. It must be light for its size → <b>low density</b>.', '3. Aluminium has both; lead would be far too dense.'],
          a: 'Aluminium — strong but low density',
        },
        {
          q: 'Why do ice cubes float in a drink?',
          working: ['<b>Picture:</b> two identical cubes — the icy one weighs less.', '1. Water = <b>1 g/cm³</b>.', '2. Ice = <b>0.92 g/cm³</b>.', '3. 0.92 is less than 1, and anything less dense than water floats.'],
          a: 'Ice is less dense than water',
        },
        {
          q: 'EXPERIMENT: Harper wants to find out which of four materials is the strongest. How does she make it fair, and how does she measure strength?',
          visual: testSvg('strength'),
          working: [
            '<b>Picture:</b> four identical strips, each with a hook, weights added one at a time.',
            '1. What is she changing? Only the <b>material</b>.',
            '2. Keep the same: the size and shape of each strip, how it is held, how the weights are added.',
            '3. Measure: the <b>mass it holds before it breaks</b>.',
            '4. Repeat each one and take an average, in case one strip has a flaw.',
          ],
          a: 'Same size and shape every time; change only the material; measure the weight it holds before breaking',
        },
      ],
      tips: [
        'Density is <b>not</b> the same as weight. A whole log floats and a single nail sinks — what matters is <b>mass ÷ volume</b>, compared with 1.',
        'Most metals are <b>not</b> magnetic. If a magnet does not stick, it can still easily be aluminium, copper or gold.',
        'When you explain a choice of material, always name the <b>property</b> — "plastic because it does not conduct heat", not just "plastic because it is better".',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[0], WORD[3], WORD[9], WORD[8], WORD[1]])(level);
        if (level === 2) return R.pick(WORD)(level);
        return R.pick([WORD[2], WORD[4], WORD[5], WORD[6], WORD[7], WORD[10], WORD[1]])(level);
      }
      const pool = level === 1
        ? [propMeaning, bestMaterial, metalProperty, magnetQ, floatSink]
        : level === 2
          ? [propMeaning, propTest, bestMaterial, whyMaterial, metalProperty, magnetQ, densityCalc, floatSink, whichIsMetal]
          : [densityCalc, massCalc, volumeCalc, tableDensity, tableCompare, whyMaterial, whichIsMetal, propTest, floatSink];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
