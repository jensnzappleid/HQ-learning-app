/* Topic: Nutrition — the nutrient groups and their jobs, good food sources, a balanced
 * diet, deficiency and energy balance, reading a food label, energy in kilojoules,
 * and the link back to the digestive system. Living World, order 9. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const NUTRIENTS = [
    { key: 'carb', name: 'carbohydrate', job: 'gives you energy — it is your body\'s main fuel',
      pic: 'the petrol in the tank', foods: ['bread', 'rice', 'pasta', 'potato', 'kūmara', 'porridge oats'],
      short: 'energy', lack: 'you feel tired and flat, and your body starts burning fat and even muscle instead' },
    { key: 'protein', name: 'protein', job: 'is used for growth and for repairing your body',
      pic: 'the spare parts and the builders', foods: ['meat', 'fish', 'eggs', 'milk', 'beans', 'nuts'],
      short: 'growth and repair', lack: 'you stop growing properly, your muscles get weak and cuts are slow to heal' },
    { key: 'fat', name: 'fat', job: 'stores energy for later, keeps you warm and protects your organs',
      pic: 'the reserve tank plus a woolly jumper', foods: ['butter', 'oil', 'cheese', 'nuts', 'avocado', 'oily fish'],
      short: 'stored energy and warmth', lack: 'you feel cold easily and cannot store energy for later' },
    { key: 'vitamin', name: 'vitamins', job: 'are needed in tiny amounts to keep everything working properly',
      pic: 'the few drops of oil that keep the engine running', foods: ['kiwifruit', 'oranges', 'carrots', 'broccoli', 'oily fish'],
      short: 'keep the body working', lack: 'you get a deficiency disease — like scurvy from too little vitamin C' },
    { key: 'mineral', name: 'minerals', job: 'build things like bones, teeth and red blood cells',
      pic: 'the bricks and the nails', foods: ['milk', 'cheese', 'red meat', 'spinach', 'wholegrain bread'],
      short: 'build bones, teeth and blood', lack: 'your bones go weak (too little calcium) or you get tired and pale (too little iron)' },
    { key: 'fibre', name: 'fibre', job: 'is not digested at all — it gives the food bulk so it keeps moving through your gut',
      pic: 'the brush that keeps the pipe clear', foods: ['wholegrain bread', 'vegetables', 'fruit with the skin on', 'baked beans'],
      short: 'keeps food moving', lack: 'food moves too slowly and you get constipated' },
    { key: 'water', name: 'water', job: 'carries everything around the body, lets the reactions happen and cools you when you sweat',
      pic: 'the river that everything floats along', foods: ['drinking water', 'milk', 'fruit', 'soup'],
      short: 'transport and cooling', lack: 'you get a headache, feel dizzy and get dehydrated fast' },
  ];

  const SOURCES = [
    { food: 'a slice of wholegrain bread', best: 'carbohydrate' },
    { food: 'a bowl of rice', best: 'carbohydrate' },
    { food: 'a roast kūmara', best: 'carbohydrate' },
    { food: 'a boiled egg', best: 'protein' },
    { food: 'a piece of grilled fish', best: 'protein' },
    { food: 'a handful of beans', best: 'protein' },
    { food: 'a spoon of butter', best: 'fat' },
    { food: 'half an avocado', best: 'fat' },
    { food: 'a glass of milk', best: 'minerals (calcium)' },
    { food: 'a slice of cheese', best: 'minerals (calcium)' },
    { food: 'a piece of red meat', best: 'minerals (iron)' },
    { food: 'a kiwifruit', best: 'vitamins (vitamin C)' },
    { food: 'an orange', best: 'vitamins (vitamin C)' },
    { food: 'a raw carrot', best: 'vitamins (vitamin A)' },
    { food: 'a bowl of broccoli', best: 'fibre' },
    { food: 'an apple with the skin on', best: 'fibre' },
  ];
  const SOURCE_OPTS = ['carbohydrate', 'protein', 'fat', 'fibre', 'minerals (calcium)', 'minerals (iron)', 'vitamins (vitamin C)', 'vitamins (vitamin A)'];

  const DEFICIENCY = [
    { missing: 'vitamin C', result: 'scurvy — bleeding gums, sore joints and slow-healing cuts', fix: 'kiwifruit, oranges and other fresh fruit and vegetables' },
    { missing: 'vitamin D or calcium', result: 'weak, soft bones (rickets in children)', fix: 'milk, cheese, oily fish and some sunshine' },
    { missing: 'iron', result: 'anaemia — feeling tired, weak and looking pale', fix: 'red meat, spinach and wholegrain bread' },
    { missing: 'protein', result: 'poor growth, weak muscles and cuts that will not heal', fix: 'meat, fish, eggs, milk, beans and nuts' },
    { missing: 'fibre', result: 'constipation, because the food moves too slowly through the gut', fix: 'wholegrain bread, vegetables and fruit with the skin on' },
    { missing: 'water', result: 'dehydration — a headache, dizziness and dark urine', fix: 'drinking more water, especially in the heat' },
  ];

  const TOOMUCH = [
    { what: 'more energy than you use up', result: 'the extra is stored as fat, and you slowly gain weight', pic: 'money going into the bank faster than it comes out' },
    { what: 'sugary drinks and lollies', result: 'tooth decay, because mouth bacteria turn the sugar into acid', pic: 'acid dripping on your enamel' },
    { what: 'salt', result: 'high blood pressure, which is hard on the heart', pic: 'too much pressure in a hose' },
    { what: 'saturated fat', result: 'fatty deposits that narrow the arteries', pic: 'gunk narrowing a pipe' },
  ];

  const FOODS = [
    { name: 'an apple', kj: 250, per100: 220, s1: 'apple', s2: '' },
    { name: 'a slice of bread', kj: 350, per100: 1000, s1: 'bread', s2: 'slice' },
    { name: 'a banana', kj: 400, per100: 370, s1: 'banana', s2: '' },
    { name: 'a glass of milk', kj: 550, per100: 270, s1: 'milk', s2: 'glass' },
    { name: 'a can of fizzy drink', kj: 600, per100: 180, s1: 'fizzy', s2: 'drink' },
    { name: 'a muesli bar', kj: 700, per100: 1700, s1: 'muesli', s2: 'bar' },
    { name: 'a small packet of chips', kj: 1100, per100: 2200, s1: 'chips', s2: 'packet' },
    { name: 'a mince pie', kj: 1600, per100: 1100, s1: 'mince', s2: 'pie' },
  ];

  const LABEL_ROWS = [
    { k: 'Energy', unit: 'kJ' }, { k: 'Protein', unit: 'g' }, { k: 'Fat, total', unit: 'g' },
    { k: 'Sugars', unit: 'g' }, { k: 'Fibre', unit: 'g' }, { k: 'Sodium', unit: 'mg' },
  ];


  /* ---------- food tests (the four lab tests) ---------- */
  const FOOD_TESTS = [
    {
      key: 'starch', nutrient: 'starch', chem: 'iodine solution',
      how: 'put a little food on a spotting tile and add <b>2–3 drops of iodine solution</b>',
      neg: 'orange-brown', pos: 'blue-black', posCol: '#1D2B6B', negCol: '#C97B22',
      heat: false, ex: 'bread, potato, rice, pasta, cornflour',
      pic: 'iodine is a tiny detective that turns almost black the moment it finds starch',
    },
    {
      key: 'sugar', nutrient: 'glucose (a simple sugar)', chem: "Benedict's solution",
      how: "add <b>Benedict's solution</b> to the food in a test tube and stand it in a <b>hot water bath</b>",
      neg: 'blue', pos: 'brick red', posCol: '#B5401E', negCol: '#2F6FD0',
      heat: true, ex: 'grapes, honey, milk, fruit juice',
      pic: 'Benedict\'s goes from a cold blue to a hot brick red, like a cooking ring warming up',
    },
    {
      key: 'protein', nutrient: 'protein', chem: 'Biuret solution',
      how: 'add <b>Biuret solution</b> to the food in a test tube and shake it gently',
      neg: 'blue', pos: 'purple', posCol: '#7A3FA8', negCol: '#2F6FD0',
      heat: false, ex: 'egg white, meat, fish, milk, beans',
      pic: 'Biuret turns royal purple — purple for protein',
    },
    {
      key: 'lipid', nutrient: 'fat (a lipid)', chem: 'the ethanol emulsion test',
      how: 'shake the food with <b>ethanol</b>, let it settle, then pour the liquid into a tube of <b>water</b>',
      neg: 'stays clear', pos: 'a cloudy white emulsion', posCol: '#E8E4DA', negCol: '#DCEEF9',
      heat: false, ex: 'butter, oil, nuts, cheese, avocado',
      pic: 'the fat comes out of the ethanol as millions of tiny drops — cloudy like milk',
    },
  ];

  /* ---------- the school’s carbohydrate / lipid detail ---------- */
  const SCHOOL = [
    { p: 'Simple sugars almost all end in the same three letters. Which?', a: '‑ose — glucose, fructose, sucrose, lactose', w: ['‑ase — glucase, fructase', '‑ine — glucine, sucrine', '‑ate — glucate, sucrate'] },
    { p: 'What is the difference between a <b>sugar</b> and a <b>starch</b>?', a: 'Sugar is a simple carbohydrate for instant energy; starch is complex, so it takes time to break down and fills you up', w: ['Starch gives instant energy and sugar is slow', 'Sugar has energy and starch has none', 'They are two words for exactly the same thing'] },
    { p: 'Harper needs energy that will last all morning, not a five-minute burst. Which carbohydrate should she eat?', a: 'a starchy one — porridge, wholegrain bread or pasta', w: ['a sugary one — lollies or fizzy drink', 'neither — she should eat only protein', 'it makes no difference which she eats'] },
    { p: 'What is another word for <b>fats and oils</b>?', a: 'lipids', w: ['proteins', 'carbohydrates', 'minerals'] },
    { p: 'What is the difference between a <b>fat</b> and an <b>oil</b>?', a: 'A fat is solid at room temperature and mostly comes from animals; an oil is liquid and mostly comes from plants', w: ['An oil is solid and a fat is liquid', 'A fat has energy and an oil does not', 'Only the colour is different'] },
    { p: 'Apart from storing energy, what else are lipids needed for in every single cell?', a: 'making the outside of the cell — the cell membrane', w: ['making the nucleus', 'carrying oxygen round the blood', 'making bones hard'] },
    { p: 'Where do <b>vitamins</b> come from, and where do <b>minerals</b> come from?', a: 'Vitamins are made by living things; minerals come out of the ground', w: ['Minerals are made by living things; vitamins come out of the ground', 'Both are made by living things', 'Both are dug out of the ground'] },
    { p: 'Name the main vitamins you are expected to know.', a: 'vitamin A, the B group, vitamin C and vitamin D', w: ['vitamins A, E, I, O and U', 'vitamins 1, 2 and 3', 'vitamins X, Y and Z'] },
    { p: 'Which mineral comes from dairy food, and what is it for?', a: 'calcium — it keeps bones and teeth strong', w: ['iron — it keeps bones and teeth strong', 'calcium — it carries oxygen in the blood', 'sodium — it builds muscle'] },
    { p: 'Which mineral comes from red meat and green vegetables, and what is it for?', a: 'iron — it is needed to make red blood cells', w: ['calcium — it is needed to make red blood cells', 'iron — it builds bones and teeth', 'iodine — it gives you energy'] },
    { p: 'What exactly <b>is</b> fibre?', a: 'plant material that you eat but cannot digest at all', w: ['a kind of protein found in meat', 'a vitamin made by your gut', 'a mineral dug out of the ground'] },
    { p: 'Too little fibre causes constipation. What does <b>too much</b> fibre cause?', a: 'diarrhoea — the food is pushed through far too fast', w: ['constipation as well', 'nothing at all — you cannot have too much', 'scurvy'] },
    { p: 'How long can a person survive with no water at all?', a: 'only about 3 days', w: ['about 3 weeks', 'about 3 months', 'about 3 hours'] },
    { p: 'Why does your body need water so badly?', a: 'It dissolves things and transports them all round the body', w: ['It is the body’s main source of energy', 'It is used to build muscle', 'It kills the microbes in your food'] },
    { p: 'How many portions of fruit and vegetables should you aim for each day?', a: 'at least 5', w: ['at least 1', 'at least 12', 'exactly 3, no more'] },
    { p: 'Fruit and vegetables are the best source of which two things?', a: 'fibre and vitamins', w: ['protein and fat', 'calcium and iron', 'starch and sugar'] },
    { p: 'Why should you go easy on ice-cream and cheese even though dairy gives you calcium?', a: 'They are also high in fat, so too much brings in a lot of extra energy', w: ['Dairy has no calcium in it once it is frozen', 'They stop your body absorbing protein', 'They contain no nutrients at all'] },
    { p: 'Which nutrient would a person who eats no meat need to plan carefully, and where could they get it?', a: 'protein — from tofu and soya beans, nuts, eggs, milk, beans and spinach', w: ['carbohydrate — from meat only', 'fibre — from meat only', 'vitamin C — from red meat'] },
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
  /** the balanced plate, split into food groups. highlight = a wedge key */
  function plateSvg(highlight) {
    const cx = 108, cy = 104, r = 74;
    const wedges = [
      { key: 'veg', label: 'fruit &', label2: 'vegetables', frac: 0.5, col: '#8FC96E' },
      { key: 'carb', label: 'breads &', label2: 'cereals', frac: 0.25, col: '#E8C24A' },
      { key: 'protein', label: 'meat, fish,', label2: 'eggs, beans', frac: 0.15, col: '#E9A07A' },
      { key: 'dairy', label: 'milk &', label2: 'cheese', frac: 0.1, col: '#A9D8F5' },
    ];
    let a0 = -Math.PI / 2;
    const parts = wedges.map((w) => {
      const a1 = a0 + w.frac * Math.PI * 2;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const big = w.frac > 0.5 ? 1 : 0;
      const on = highlight === w.key;
      const seg = `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${w.col}" stroke="${on ? '#E0568C' : '#FFFFFF'}" stroke-width="${on ? 4 : 3}"/>`;
      a0 = a1;
      return seg;
    }).join('');
    const key = wedges.map((w, i) => `<rect x="196" y="${34 + i * 38}" width="16" height="16" rx="4" fill="${w.col}" stroke="${INK}" stroke-width="1.5"/>
      <text x="220" y="${45 + i * 38}" fill="${INK}" font-size="11.5">${w.label}</text>
      <text x="220" y="${59 + i * 38}" fill="${INK}" font-size="11.5">${w.label2}</text>`).join('');
    return `<svg viewBox="0 0 340 212" width="340" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="#FFFFFF" stroke="#D9BE8A" stroke-width="3"/>
      ${parts}
      <text x="${cx}" y="202" text-anchor="middle" fill="${INK}" font-size="11.5">half the plate is fruit and veges</text>
      ${key}
      <text x="196" y="20" fill="#7A7065" font-size="11">a balanced plate</text>
    </svg>`;
  }

  /** a nutrition information panel you can read numbers off */
  function labelSvg(vals, name) {
    const rows = LABEL_ROWS.map((r0, i) => {
      const y = 78 + i * 20;
      return `<text x="16" y="${y}" fill="${INK}" font-size="11.5">${r0.k}</text>
        <text x="212" y="${y}" text-anchor="end" fill="${INK}" font-size="11.5">${vals.serve[i]} ${r0.unit}</text>
        <text x="312" y="${y}" text-anchor="end" fill="${INK}" font-size="11.5">${vals.hundred[i]} ${r0.unit}</text>
        <line x1="12" y1="${y + 6}" x2="316" y2="${y + 6}" stroke="#E4D7BE" stroke-width="1"/>`;
    }).join('');
    return `<svg viewBox="0 0 328 200" width="328" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="6" y="6" width="316" height="188" rx="8" fill="#FFFDF6" stroke="${INK}" stroke-width="2.5"/>
      <text x="16" y="26" fill="${INK}" font-size="12">Nutrition Information — ${name}</text>
      <text x="16" y="42" fill="#7A7065" font-size="10.5">Serving size: ${vals.serving} g</text>
      <line x1="12" y1="50" x2="316" y2="50" stroke="${INK}" stroke-width="2"/>
      <text x="212" y="62" text-anchor="end" fill="#B03068" font-size="11">per serving</text>
      <text x="312" y="62" text-anchor="end" fill="#5F98C4" font-size="11">per 100 g</text>
      ${rows}
    </svg>`;
  }
  function labelValues() {
    const serving = R.pick([30, 40, 50]);
    const kj100 = R.pick([1200, 1500, 1600, 1800, 2000]);
    const f = serving / 100;
    const hundred = [kj100, R.pick([6, 8, 10, 12]), R.pick([10, 14, 18, 22]), R.pick([8, 16, 24, 30]), R.pick([3, 5, 7, 9]), R.pick([200, 300, 400, 500])];
    const serve = hundred.map((v, i) => (i === 0 ? Math.round(v * f) : Math.round(v * f * 10) / 10));
    return { serving, hundred, serve, name: R.pick(['crunchy muesli', 'oat biscuits', 'corn chips', 'breakfast cereal']) };
  }

  /** bar chart comparing the energy in different foods */
  function energySvg(items) {
    const max = Math.max(...items.map((f) => f.kj));
    const base = 150, h = 108, w = Math.floor(268 / items.length);
    const bars = items.map((f, i) => {
      const x = 40 + i * w, bh = Math.max(4, Math.round((f.kj / max) * h));
      const l1 = f.s1, l2 = f.s2;
      return `<rect x="${x}" y="${base - bh}" width="${w - 16}" height="${bh}" rx="4" fill="${['#8FC96E', '#E8C24A', '#A9D8F5', '#E9A07A'][i % 4]}" stroke="${INK}" stroke-width="1.5"/>
        <text x="${x + (w - 16) / 2}" y="${base - bh - 5}" text-anchor="middle" fill="${INK}" font-size="10.5">${f.kj}</text>
        <text x="${x + (w - 16) / 2}" y="${base + 16}" text-anchor="middle" fill="${INK}" font-size="10.5">${l1}</text>
        <text x="${x + (w - 16) / 2}" y="${base + 30}" text-anchor="middle" fill="${INK}" font-size="10.5">${l2}</text>`;
    }).join('');
    return `<svg viewBox="0 0 320 195" width="320" height="195" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="160" y="15" text-anchor="middle" fill="${INK}" font-size="11.5">energy in one serve (kJ)</text>
      <text x="6" y="32" fill="#7A7065" font-size="10.5">kJ</text>
      <line x1="34" y1="22" x2="34" y2="${base}" stroke="${INK}" stroke-width="2"/>
      <line x1="34" y1="${base}" x2="312" y2="${base}" stroke="${INK}" stroke-width="2"/>
      ${bars}
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function nutrientJob(level) {
    const n = R.pick(NUTRIENTS);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What is <b>${n.name}</b> for?`,
        answer: ch(n.job, NUTRIENTS.map((x) => x.job), 4),
        hint: `Think of it as ${n.pic}.`,
        working: [`<b>Picture:</b> your body is a car; ${n.name} is ${n.pic}.`, `So ${n.name} <b>${n.job}</b>.`],
        finalAnswer: n.job, skill: 'nutrients',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which nutrient is for <b>${n.short}</b>?`,
        answer: ch(n.name, NUTRIENTS.map((x) => x.name), 4),
        hint: `In the car picture, that is ${n.pic}.`,
        working: [`<b>Picture:</b> ${n.pic}.`, `That is <b>${n.name}</b>.`],
        finalAnswer: n.name, skill: 'nutrients',
      };
    }
    return {
      prompt: `Which of these is a good source of <b>${n.name}</b>?`,
      answer: ch(R.pick(n.foods), NUTRIENTS.filter((x) => x.key !== n.key).map((x) => R.pick(x.foods)), 4),
      hint: `${cap(n.name)} ${n.job}.`,
      working: [`<b>Picture:</b> ${n.name} is ${n.pic}.`, `Good sources: ${n.foods.slice(0, 4).join(', ')}.`],
      finalAnswer: n.foods.slice(0, 3).join(', '), skill: 'sources',
    };
  }
  function sourceQ(level) {
    const s = R.pick(SOURCES);
    return {
      prompt: `Which nutrient is <b>${s.food}</b> especially good for?`,
      answer: ch(s.best, SOURCE_OPTS, 4),
      hint: 'Starchy = carbohydrate. Meat, eggs, beans = protein. Milk and cheese = calcium. Fresh fruit and veg = vitamins and fibre.',
      working: ['<b>Picture:</b> put the food on the balanced plate and see which quarter it belongs in.', `${cap(s.food)} is a good source of <b>${s.best}</b>.`],
      finalAnswer: s.best, skill: 'sources',
    };
  }
  function plateQ(level) {
    const forms = [
      { p: 'On a balanced plate, which group should take up about <b>half</b> the plate?', a: 'fruit and vegetables', w: ['breads and cereals', 'meat and fish', 'milk and cheese'], k: 'veg' },
      { p: 'Which group gives you most of your <b>energy</b> on a balanced plate?', a: 'breads and cereals (carbohydrate)', w: ['fruit and vegetables', 'meat, fish and eggs', 'milk and cheese'], k: 'carb' },
      { p: 'Which group on the plate is mostly there for <b>growth and repair</b>?', a: 'meat, fish, eggs and beans (protein)', w: ['breads and cereals', 'fruit and vegetables', 'oils and spreads'], k: 'protein' },
      { p: 'Which group is the main source of <b>calcium</b> for your bones and teeth?', a: 'milk and cheese', w: ['fruit and vegetables', 'breads and cereals', 'meat and fish'], k: 'dairy' },
      { p: 'What does a <b>balanced diet</b> actually mean?', a: 'Eating the right amount of every nutrient group — nothing missing and nothing overloaded', w: ['Eating exactly the same weight of every food', 'Only eating vegetables', 'Eating three meals at exactly the same time every day'], k: undefined },
    ];
    const f = R.pick(forms);
    return {
      visual: plateSvg(f.k),
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Half the plate fruit and veges, a quarter carbohydrate, a quarter protein, plus a little dairy.',
      working: ['<b>Picture:</b> the plate split into wedges.', 'Half fruit and veges · a quarter breads and cereals · a quarter meat, fish, eggs and beans · a little milk and cheese.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'balanced',
    };
  }
  function deficiencyQ(level) {
    const d = R.pick(DEFICIENCY);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What happens if someone gets far too little <b>${d.missing}</b>?`,
        answer: ch(d.result, DEFICIENCY.map((x) => x.result), 4),
        hint: 'A shortage of one nutrient causes one particular deficiency problem.',
        working: [`<b>Picture:</b> one part of the car is missing, so one thing goes wrong.`, `Too little ${d.missing} → <b>${d.result}</b>.`],
        finalAnswer: d.result, skill: 'deficiency',
      };
    }
    if (form === 2) {
      return {
        prompt: `Someone has <b>${d.result.split(' — ')[0].split(',')[0]}</b>. Which nutrient are they most likely short of?`,
        answer: ch(d.missing, DEFICIENCY.map((x) => x.missing), 4),
        hint: 'Work backwards from the symptom to the job that nutrient does.',
        working: ['<b>Picture:</b> which part of the car stopped working?', `That is what happens with too little <b>${d.missing}</b>.`],
        finalAnswer: d.missing, skill: 'deficiency',
      };
    }
    return {
      prompt: `Which foods would fix a shortage of <b>${d.missing}</b>?`,
      answer: ch(d.fix, DEFICIENCY.map((x) => x.fix), 4),
      hint: 'Match the nutrient to the foods that are packed with it.',
      working: [`<b>Picture:</b> refill the part that ran out.`, `For ${d.missing}: <b>${d.fix}</b>.`],
      finalAnswer: d.fix, skill: 'deficiency',
    };
  }
  function balanceQ(level) {
    const t = R.pick(TOOMUCH);
    if (R.chance(0.5)) {
      return {
        prompt: `What happens if you regularly take in <b>too much ${t.what}</b>?`,
        answer: ch(t.result, TOOMUCH.map((x) => x.result), 4),
        hint: `Think of ${t.pic}.`,
        working: [`<b>Picture:</b> ${t.pic}.`, `Too much ${t.what} → <b>${t.result}</b>.`],
        finalAnswer: t.result, skill: 'balance',
      };
    }
    const forms = [
      { p: 'What does "<b>energy in versus energy out</b>" mean?', a: 'The energy from your food against the energy your body uses — if in is bigger, the extra is stored as fat', w: ['The energy in your food against the energy in the food you throw away', 'How fast you can run compared with your friends', 'How much you eat compared with how much you drink'] },
      { p: 'Harper eats the same as usual but starts training three nights a week. What happens to her energy needs?', a: 'They go up — she is using more energy, so she needs more food', w: ['They go down, because exercise saves energy', 'They stay exactly the same', 'She only needs more water, not more food'] },
      { p: 'Why do growing 12-year-olds need more energy and protein than a small adult of the same weight?', a: 'They are still building new body tissue as well as running it — growth needs extra fuel and extra building material', w: ['Children waste more food', 'Children digest food less well so they need extra', 'They do not — they need less'] },
      { p: 'Why does a rower training every day need a much bigger daily kilojoule intake than someone at a desk?', a: 'Their muscles are using far more energy, so more must come in to match it', w: ['Athletes digest food more slowly', 'Athletes need more food but not more energy', 'Because sport makes you hungry, not because you need it'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Energy is like money: what comes in has to match what goes out, or it piles up.',
      working: ['<b>Picture:</b> money into the bank against money out of the bank.', 'in > out → stored as fat. in < out → the stores get used up. in = out → weight stays steady.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'balance',
    };
  }
  function labelQ(level) {
    const v = labelValues();
    const idx = R.int(0, LABEL_ROWS.length - 1);
    const form = R.int(1, level === 1 ? 2 : 4);
    if (form === 1) {
      const val = v.hundred[idx];
      return {
        visual: labelSvg(v, v.name),
        prompt: `Read the label. How much <b>${LABEL_ROWS[idx].k.toLowerCase()}</b> is there in <b>100 g</b>?`,
        answer: { type: 'number', value: val, unit: LABEL_ROWS[idx].unit, tolerance: 0.05 },
        hint: 'Use the right-hand column — that is the per 100 g one.',
        working: ['<b>Picture:</b> two columns — the pink one is one serve, the blue one is 100 g.', `Find the ${LABEL_ROWS[idx].k} row, then read the <b>per 100 g</b> column.`, `Answer: <b>${val} ${LABEL_ROWS[idx].unit}</b>.`],
        finalAnswer: `${val} ${LABEL_ROWS[idx].unit}`, skill: 'label',
      };
    }
    if (form === 2) {
      const val = v.serve[idx];
      return {
        visual: labelSvg(v, v.name),
        prompt: `Read the label. How much <b>${LABEL_ROWS[idx].k.toLowerCase()}</b> is in <b>one ${v.serving} g serving</b>?`,
        answer: { type: 'number', value: val, unit: LABEL_ROWS[idx].unit, tolerance: 0.05 },
        hint: 'Use the left-hand (per serving) column, not the per 100 g one.',
        working: ['<b>Picture:</b> two columns — the pink one is one serve, the blue one is 100 g.', `Find the ${LABEL_ROWS[idx].k} row, then read the <b>per serving</b> column.`, `Answer: <b>${val} ${LABEL_ROWS[idx].unit}</b>.`],
        finalAnswer: `${val} ${LABEL_ROWS[idx].unit}`, skill: 'label',
      };
    }
    if (form === 3) {
      const servings = R.int(2, 4);
      const val = Math.round(v.serve[0] * servings);
      return {
        visual: labelSvg(v, v.name),
        prompt: `Harper eats <b>${servings} servings</b>. How much energy is that, in kilojoules?`,
        answer: { type: 'number', value: val, unit: 'kJ', tolerance: 1 },
        hint: 'Energy per serving × number of servings.',
        working: [`One serving = <b>${v.serve[0]} kJ</b>.`, `${v.serve[0]} × ${servings} = <b>${val}</b> kJ.`],
        finalAnswer: `${val} kJ`, skill: 'label',
      };
    }
    const forms = [
      { p: 'Why is the <b>per 100 g</b> column the fair one to use when you compare two different packets?', a: 'Because the serving sizes on two packets are usually different, so per 100 g is the only like-for-like comparison', w: ['Because 100 g is what most people eat', 'Because the per serving column is often wrong', 'Because 100 g is the legal serving size'] },
      { p: 'A packet says 1900 kJ per 100 g. Is that a high-energy food or a low-energy one?', a: 'High — that is a lot of energy packed into a small amount of food', w: ['Low, because 1900 is a small number of kilojoules', 'Neither — kJ has nothing to do with energy', 'You cannot tell from a per 100 g figure at all'] },
      { p: 'What is <b>sodium</b> on a food label really telling you about?', a: 'How much salt is in it', w: ['How much sugar is in it', 'How much protein is in it', 'How much water is in it'] },
      { p: 'Two cereals have the same kJ per 100 g, but one has 9 g of fibre and the other 1 g. Which is the better everyday choice?', a: 'The one with 9 g of fibre — it keeps food moving through the gut and fills you up for longer', w: ['The one with 1 g, because fibre is not digested so it is wasted', 'They are exactly the same because the energy matches', 'The one with 1 g, because less fibre means more nutrients'] },
    ];
    const f = R.pick(forms);
    return {
      visual: labelSvg(v, v.name),
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Per 100 g is for comparing; per serving is for what you actually eat.',
      working: ['<b>Picture:</b> two columns — one serve, and 100 g for fair comparisons.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'label',
    };
  }
  function energyChart(level) {
    const items = R.sample(FOODS, 4).sort((a, b) => a.kj - b.kj);
    const form = R.int(1, 3);
    if (form === 1) {
      const top = items[items.length - 1];
      return {
        visual: energySvg(items),
        prompt: 'Which of these foods gives the <b>most</b> energy in one serve?',
        answer: ch(top.name, items.map((x) => x.name), 4),
        hint: 'Read the tallest bar.',
        working: ['<b>Picture:</b> taller bar = more kilojoules = more fuel.', items.map((x) => `${x.name}: ${x.kj} kJ`).join(' · '), `The tallest is <b>${top.name}</b>.`],
        finalAnswer: top.name, skill: 'energy',
      };
    }
    if (form === 2) {
      const a = items[items.length - 1], b = items[0];
      return {
        visual: energySvg(items),
        prompt: `How many more kilojoules are in <b>${a.name}</b> than in <b>${b.name}</b>?`,
        answer: { type: 'number', value: a.kj - b.kj, unit: 'kJ' },
        hint: 'Take the smaller bar away from the bigger one.',
        working: [`${a.kj} − ${b.kj} = <b>${a.kj - b.kj}</b> kJ.`],
        finalAnswer: `${a.kj - b.kj} kJ`, skill: 'energy',
      };
    }
    const two = R.sample(items, 2);
    return {
      visual: energySvg(items),
      prompt: `Harper eats <b>${two[0].name}</b> and <b>${two[1].name}</b>. How much energy is that altogether?`,
      answer: { type: 'number', value: two[0].kj + two[1].kj, unit: 'kJ' },
      hint: 'Add the two bars together.',
      working: [`${two[0].kj} + ${two[1].kj} = <b>${two[0].kj + two[1].kj}</b> kJ.`],
      finalAnswer: `${two[0].kj + two[1].kj} kJ`, skill: 'energy',
    };
  }
  function digestLink(level) {
    const forms = [
      { p: 'Carbohydrate is digested into small molecules. What are they?', a: 'glucose (a simple sugar)', w: ['amino acids', 'fatty acids and glycerol', 'vitamins'] },
      { p: 'Protein is digested into small molecules. What are they?', a: 'amino acids', w: ['glucose', 'fatty acids and glycerol', 'minerals'] },
      { p: 'Fat is digested into small molecules. What are they?', a: 'fatty acids and glycerol', w: ['glucose', 'amino acids', 'starch'] },
      { p: 'Why does food have to be digested at all?', a: 'The molecules must be small enough to pass through the gut wall into the blood', w: ['So it tastes better', 'So it weighs less', 'So the body can store it in the stomach'] },
      { p: 'Where is most of the digested food absorbed into the blood?', a: 'the small intestine', w: ['the stomach', 'the mouth', 'the large intestine'] },
      { p: 'Which nutrient is <b>not</b> digested at all, and passes right through you?', a: 'fibre', w: ['protein', 'carbohydrate', 'fat'] },
      { p: 'What happens to the glucose from your food once it reaches a cell?', a: 'It is used in respiration: glucose + oxygen → energy + carbon dioxide + water', w: ['It is turned back into food', 'It is breathed straight out again', 'It is stored in the nucleus'] },
      { p: 'Which nutrients do <b>not</b> need digesting because their molecules are already small enough?', a: 'vitamins, minerals and water', w: ['protein and fat', 'carbohydrate and protein', 'fibre and fat'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(3, 6) : forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Big food molecules → small ones → through the gut wall → into the blood → to every cell.',
      working: ['<b>Picture:</b> a big beanbag will not fit through a letterbox — you have to empty the beans out first.', 'carbohydrate → glucose · protein → amino acids · fat → fatty acids and glycerol.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'digestion',
    };
  }
  function nutritionCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const two = R.sample(FOODS, 2);
      return {
        prompt: `Harper's lunch is <b>${two[0].name}</b> (${two[0].kj} kJ) and <b>${two[1].name}</b> (${two[1].kj} kJ). How much energy altogether?`,
        answer: { type: 'number', value: two[0].kj + two[1].kj, unit: 'kJ' },
        hint: 'Add the two amounts.',
        working: [`${two[0].kj} + ${two[1].kj} = <b>${two[0].kj + two[1].kj}</b> kJ.`],
        finalAnswer: `${two[0].kj + two[1].kj} kJ`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const f = R.pick(FOODS), n = R.int(2, 5);
      return {
        prompt: `<b>${cap(f.name)}</b> has <b>${f.kj} kJ</b>. How much energy is in <b>${n}</b> of them?`,
        answer: { type: 'number', value: f.kj * n, unit: 'kJ' },
        hint: 'Energy in one × how many.',
        working: [`${f.kj} × ${n} = <b>${f.kj * n}</b> kJ.`],
        finalAnswer: `${f.kj * n} kJ`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const need = R.pick([8000, 9000, 10000]);
      const eaten = R.pick([3200, 4500, 5600, 6400]);
      return {
        prompt: `Harper needs about <b>${need} kJ</b> a day. By lunchtime she has eaten <b>${eaten} kJ</b>. How much is left for the rest of the day?`,
        answer: { type: 'number', value: need - eaten, unit: 'kJ' },
        hint: 'Take what she has eaten away from what she needs.',
        working: [`${need} − ${eaten} = <b>${need - eaten}</b> kJ.`],
        finalAnswer: `${need - eaten} kJ`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const per100 = R.pick([1500, 1800, 2000, 2400]);
      const grams = R.pick([50, 150, 200, 250]);
      const val = (per100 * grams) / 100;
      return {
        prompt: `A cereal has <b>${per100} kJ per 100 g</b>. How much energy is in a <b>${grams} g</b> bowl?`,
        answer: { type: 'number', value: val, unit: 'kJ' },
        hint: 'Find the energy in 1 g first (divide by 100), then multiply.',
        working: [`1 g = ${per100} ÷ 100 = ${per100 / 100} kJ.`, `${grams} g = ${per100 / 100} × ${grams} = <b>${val}</b> kJ.`],
        finalAnswer: `${val} kJ`, skill: 'numbers',
      };
    }
    const total = R.pick([200, 400, 500]);
    const pct = R.pick([10, 20, 25, 50]);
    return {
      prompt: `A ${total} g pack of yoghurt is <b>${pct}%</b> of Harper's daily calcium. How much of the day's calcium is still to come, as a percentage?`,
      answer: { type: 'number', value: 100 - pct, unit: '%' },
      hint: 'The whole day is 100%.',
      working: [`100% − ${pct}% = <b>${100 - pct}%</b> still to come.`],
      finalAnswer: `${100 - pct}%`, skill: 'numbers',
    };
  }

  /** one food test drawn as before / after test tubes */
  function testTubeSvg(t) {
    const tube = (x, col, cap, sub) => `
      <rect x="${x}" y="40" width="34" height="96" rx="17" fill="${col}" stroke="${INK}" stroke-width="2.5"/>
      <rect x="${x}" y="40" width="34" height="14" rx="7" fill="#FFFFFF" opacity=".55"/>
      <rect x="${x - 4}" y="34" width="42" height="10" rx="5" fill="#EFE6D6" stroke="${INK}" stroke-width="2"/>
      <text x="${x + 17}" y="156" text-anchor="middle" fill="${INK}" font-size="11.5">${cap}</text>
      <text x="${x + 17}" y="171" text-anchor="middle" fill="#7A7065" font-size="10.5">${sub}</text>`;
    const flame = t.heat
      ? `<text x="170" y="120" text-anchor="middle" fill="#B5401E" font-size="11.5">heat in a</text>
         <text x="170" y="134" text-anchor="middle" fill="#B5401E" font-size="11.5">hot water bath</text>`
      : `<text x="170" y="127" text-anchor="middle" fill="#7A7065" font-size="11.5">no heating needed</text>`;
    return `<svg viewBox="0 0 340 186" width="340" height="186" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="18" text-anchor="middle" fill="${INK}" font-size="12">testing for ${t.nutrient}</text>
      <text x="170" y="32" text-anchor="middle" fill="#7A7065" font-size="11">with ${t.chem}</text>
      ${tube(58, t.negCol, 'no ' + t.key, t.neg)}
      <text x="170" y="82" text-anchor="middle" fill="${INK}" font-size="20">&#8594;</text>
      ${flame}
      ${tube(248, t.posCol, t.key + ' found', t.pos)}
      <text x="170" y="182" text-anchor="middle" fill="#7A7065" font-size="10.5">${t.neg} &#8594; ${t.pos} = positive</text>
    </svg>`;
  }

  function foodTestQ(level) {
    const t = R.pick(FOOD_TESTS);
    const forms = [];
    forms.push(() => ({
      visual: testTubeSvg(t),
      prompt: `Which chemical do you use to test a food for <b>${t.nutrient}</b>?`,
      answer: ch(t.chem, FOOD_TESTS.map((x) => x.chem), 4),
      hint: `Starch → iodine. Sugar → Benedict's. Protein → Biuret. Fat → ethanol.`,
      working: [`<b>Picture:</b> ${t.pic}.`, `To test for ${t.nutrient} you use <b>${t.chem}</b>.`],
      finalAnswer: t.chem, skill: 'foodtest',
    }));
    forms.push(() => ({
      visual: testTubeSvg(t),
      prompt: `You test a food with <b>${t.chem}</b>. What colour change means <b>${t.nutrient} is there</b>?`,
      answer: ch(`${t.neg} → ${t.pos}`, FOOD_TESTS.map((x) => `${x.neg} → ${x.pos}`), 4),
      hint: 'Say the starting colour first, then the colour it goes if the test is positive.',
      working: [`<b>Picture:</b> ${t.pic}.`, `1. ${cap(t.chem)} starts <b>${t.neg}</b>.`, `2. If ${t.nutrient} is there it goes <b>${t.pos}</b>.`],
      finalAnswer: `${t.neg} → ${t.pos}`, skill: 'foodtest',
    }));
    forms.push(() => ({
      prompt: `Harper tests a food with <b>${t.chem}</b> and it stays <b>${t.neg}</b>. What does that tell her?`,
      answer: ch(`There is no ${t.nutrient} in that food`, [`There is a lot of ${t.nutrient} in that food`, 'The test has gone wrong and must be repeated', `There is ${t.nutrient}, but only a tiny amount`], 4),
      hint: 'No colour change at all = a negative result.',
      working: ['<b>Picture:</b> the detective looked and found nothing.', `1. A positive result would be <b>${t.pos}</b>.`, `2. It stayed <b>${t.neg}</b>, so that is <b>negative</b>.`, `3. So that food has no ${t.nutrient} in it.`],
      finalAnswer: `There is no ${t.nutrient} in that food`, skill: 'foodtest',
    }));
    forms.push(() => ({
      prompt: `Which food would give a <b>positive</b> result with ${t.chem}?`,
      answer: ch(R.pick(t.ex.split(', ')), FOOD_TESTS.filter((x) => x.key !== t.key).map((x) => R.pick(x.ex.split(', '))), 4),
      hint: `Think what ${t.nutrient} is actually found in.`,
      working: [`<b>Picture:</b> ${t.pic}.`, `${cap(t.nutrient)} is found in <b>${t.ex}</b>.`],
      finalAnswer: `any of: ${t.ex}`, skill: 'foodtest',
    }));
    if (level >= 2) {
      forms.push(() => ({
        prompt: 'Which food test is the only one that needs <b>heating</b>?',
        answer: ch("the Benedict's test for sugar — it is heated in a hot water bath", ['the iodine test for starch', 'the Biuret test for protein', 'the ethanol test for fat'], 4),
        hint: "Benedict's only changes colour once it is hot.",
        working: ['<b>Picture:</b> a cold blue ring warming up to glowing red.', "1. Iodine, Biuret and ethanol all work cold.", "2. <b>Benedict's</b> stays blue unless you heat it.", '3. Use a <b>hot water bath</b>, not a flame — it is safer and heats evenly.'],
        finalAnswer: "the Benedict's test for sugar", skill: 'foodtest',
      }));
      forms.push(() => ({
        prompt: 'Why is a <b>hot water bath</b> used for the sugar test instead of holding the tube in a flame?',
        answer: ch('It heats the tube evenly and gently, so nothing spits out of the tube at anyone', ['A flame would turn the solution purple instead', 'Water is what makes the colour change happen', 'A flame is not hot enough to work'], 4),
        hint: 'Think about what a boiling tube does when one spot gets very hot.',
        working: ['<b>Picture:</b> one hot spot makes the liquid bump and spit.', '1. A water bath never goes above 100 °C and heats all sides at once.', '2. So the liquid cannot suddenly boil over and shoot out.', '3. Safer, and the colour change is easier to watch.'],
        finalAnswer: 'It heats the tube evenly and gently, so nothing spits out of the tube at anyone', skill: 'foodtest',
      }));
      forms.push(() => ({
        prompt: 'Why must there be <b>no flames</b> anywhere near the ethanol fat test?',
        answer: ch('Ethanol catches fire very easily', ['Ethanol turns purple in the heat', 'A flame would evaporate the fat', 'Flames make the emulsion go clear again'], 4),
        hint: 'Ethanol is alcohol — the same stuff that burns in a spirit burner.',
        working: ['<b>Picture:</b> ethanol is the fuel in a spirit burner.', '1. It is <b>highly flammable</b>, and so are its fumes.', '2. So: no Bunsen alight on the bench during that test.'],
        finalAnswer: 'Ethanol catches fire very easily', skill: 'foodtest',
      }));
      forms.push(() => {
        const a = R.pick(FOOD_TESTS), b = R.pick(FOOD_TESTS.filter((x) => x.key !== a.key));
        return {
          prompt: `A food turns ${a.chem} <b>${a.pos}</b> and turns ${b.chem} <b>${b.pos}</b>. What is in it?`,
          answer: ch(`both ${a.nutrient} and ${b.nutrient}`, [`only ${a.nutrient}`, `only ${b.nutrient}`, 'neither — both tests were negative'], 4),
          hint: 'Take one test at a time and write down what each one proves.',
          working: ['<b>Picture:</b> two detectives, each looking for one thing.', `1. ${cap(a.chem)} went <b>${a.pos}</b> → <b>${a.nutrient}</b> is present.`, `2. ${cap(b.chem)} went <b>${b.pos}</b> → <b>${b.nutrient}</b> is present.`, '3. A food can easily contain more than one nutrient.'],
          finalAnswer: `both ${a.nutrient} and ${b.nutrient}`, skill: 'foodtest',
        };
      });
    }
    return R.pick(forms)();
  }

  function schoolFactQ(level) {
    const f = R.pick(SCHOOL);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'This one is straight off the food groups sheet — learn it as a fact.',
      working: [`Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'groups',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const t = R.pick(FOOD_TESTS);
      return {
        visual: testTubeSvg(t),
        prompt: `In the lab Harper adds <b>${t.chem}</b> to a mashed-up piece of food and it goes <b>${t.pos}</b>. What has she proved, and how does she know?`,
        answer: ch(`The food contains ${t.nutrient} — ${t.neg} going to ${t.pos} is the positive result for that test`, [`The food contains no ${t.nutrient} — the colour should have stayed ${t.neg}`, 'Nothing — that chemical changes colour with every food', `The food contains starch, because every test goes ${t.pos} for starch`], 4),
        hint: 'Write the starting colour, the finishing colour, and what the finishing colour means.',
        working: ['<b>Picture:</b> each test chemical is a detective that only looks for one thing.', `1. ${cap(t.chem)} starts <b>${t.neg}</b>.`, `2. It finished <b>${t.pos}</b>, which is the <b>positive</b> result.`, `3. So this food contains <b>${t.nutrient}</b>. (Foods like ${t.ex} would do the same.)`],
        finalAnswer: `The food contains ${t.nutrient}`,
      };
    },
    () => ({
      prompt: 'Harper is given an unknown white powder and told it is either cornflour or powdered egg white. Describe a test that would tell her which it is.',
      answer: ch('Add iodine — cornflour is starch so it goes blue-black; egg white is protein so it stays orange-brown (Biuret would go purple for the egg)', ['Taste a little of each — starch tastes sweeter', 'Heat both — protein burns and starch does not', 'Weigh both — protein is always heavier'], 4),
      hint: 'Pick the test that gives a different answer for the two possibilities.',
      working: ['<b>Picture:</b> use a detective who only reacts to one of the two suspects.', '1. Cornflour = <b>starch</b>. Egg white = <b>protein</b>.', '2. <b>Iodine</b> finds starch: orange-brown → <b>blue-black</b>.', '3. Blue-black → it was the cornflour. Stayed orange-brown → it was the egg white.', '4. You could confirm with <b>Biuret</b>: purple means protein, so that one is the egg white.', 'Never taste anything in the lab.'],
      finalAnswer: 'Add iodine — blue-black means the starch (cornflour); no change means the protein (egg white)',
    }),
    () => ({
      prompt: 'Harper tests a slice of bread and it is positive for starch. Her friend says "so bread is pure carbohydrate". Is that right?',
      answer: ch('No — one positive test only proves starch is there; bread also has protein, some fat, fibre and water', ['Yes — a positive iodine test proves there is nothing else in it', 'No — the iodine test does not work on bread', 'Yes, because all baked food is pure carbohydrate'], 4),
      hint: 'What does a positive test actually prove — and what does it not prove?',
      working: ['<b>Picture:</b> finding one thing in a bag does not tell you the bag is empty.', '1. Iodine went blue-black → there is <b>starch</b>.', '2. That says nothing about anything else.', '3. To check the rest, run <b>Biuret</b> (protein) and the <b>ethanol</b> test (fat) too.', '4. Real foods are almost always a mixture.'],
      finalAnswer: 'No — it only proves starch is present; you would need the other tests for the rest',
    }),
    () => ({
      prompt: 'A rugby player eats lollies right before a game and porridge two hours before. Explain why he uses two different carbohydrates.',
      answer: ch('Lollies are simple sugar for instant energy; porridge is starch, which breaks down slowly and keeps him going', ['Porridge gives instant energy and lollies are slow', 'Lollies give protein and porridge gives fat', 'There is no difference — he is just being fussy'], 4),
      hint: 'Simple sugars are fast. Complex starch is slow.',
      working: ['<b>Picture:</b> kindling lights fast; a log burns for hours.', '1. Lollies = <b>simple sugars</b> (the ones ending in <b>-ose</b>) → straight into the blood → instant energy.', '2. Porridge = <b>starch</b>, a complex carbohydrate → takes time to break down → energy that lasts and fills him up.', '3. So: the slow one early, the fast one at the last minute.'],
      finalAnswer: 'Sugar is simple and instant; starch is complex and slow-release',
    }),
    () => ({
      prompt: 'Harper goes tramping for three days and takes plenty of food but forgets her water bottle. Which is the more urgent problem, and why?',
      answer: ch('The water — you can last weeks without food but only about three days without water', ['The food — you cannot last a day without eating', 'Neither — food and water matter exactly the same', 'The water, but only because it is heavy to carry'], 4),
      hint: 'Which one does your body have no store of?',
      working: ['<b>Picture:</b> the body has a fuel tank (fat) but no water tank.', '1. Food: the body has <b>stored fat</b> to burn, so it can go a long time.', '2. Water: there is no store. It is lost all day in sweat, breath and urine.', '3. Water <b>dissolves and transports</b> everything, so without it nothing works.', '4. About <b>3 days</b> is the limit — so the bottle is the urgent one.'],
      finalAnswer: 'The water — about 3 days is the limit, because the body has no water store',
    }),
    () => ({
      prompt: 'A friend has started eating enormous amounts of bran because "fibre is healthy", and now has diarrhoea. Explain what has happened.',
      answer: ch('Fibre speeds food through the gut — too little means constipation, but too much pushes it through far too fast', ['Bran contains a microbe that causes diarrhoea', 'Fibre is poisonous in large amounts', 'Nothing to do with the bran — fibre has no effect on the gut'], 4),
      hint: 'Fibre is the brush that keeps the pipe moving. What happens if you brush too hard?',
      working: ['<b>Picture:</b> fibre is the brush that keeps the pipe clear.', '1. Fibre is plant material you <b>cannot digest</b> — it adds bulk so the gut can grip and push.', '2. <b>Too little</b> → the food sits still → <b>constipation</b>.', '3. <b>Too much</b> → pushed through too fast → <b>diarrhoea</b>.', '4. Like everything in a balanced diet, the answer is the right amount — not the most possible.'],
      finalAnswer: 'Too much fibre pushes food through the gut too fast, which causes diarrhoea',
    }),
    () => {
      const d = R.pick(DEFICIENCY);
      return {
        prompt: `Someone eats almost no fresh food for months and develops <b>${d.result}</b>. Which nutrient is missing, and how would you fix it?`,
        answer: ch(`${d.missing} — eat more ${d.fix}`, DEFICIENCY.map((x) => `${x.missing} — eat more ${x.fix}`), 4),
        hint: 'Work backwards: which job has stopped being done?',
        working: ['<b>Picture:</b> one part of the car has run out, so one thing goes wrong.', `1. The symptom is ${d.result}.`, `2. That is the job of <b>${d.missing}</b>.`, `3. Fix it with <b>${d.fix}</b>.`],
        finalAnswer: `${d.missing} — eat more ${d.fix}`,
      };
    },
    () => ({
      visual: plateSvg('veg'),
      prompt: 'Harper\'s lunch is white bread, a cheese slice and a can of fizzy drink. What is missing, and what would you add?',
      answer: ch('Fruit and vegetables — so no vitamins or fibre. Add an apple and some carrot sticks', ['Nothing is missing, that is balanced', 'Protein — add another slice of bread', 'Carbohydrate — add more fizzy drink'], 4),
      hint: 'Put the lunch on the balanced plate and see which wedge is empty.',
      working: ['<b>Picture:</b> lay the lunch out on the balanced plate.', '1. Bread → <b>carbohydrate</b> ✓.', '2. Cheese → <b>protein and calcium</b> ✓.', '3. Fruit and veges wedge → <b>empty</b>, so no vitamin C and almost no fibre.', '4. The fizzy drink is sugar with no nutrients at all.', 'Add an apple and carrot sticks, and swap the drink for water.'],
      finalAnswer: 'Fruit and vegetables — so no vitamins or fibre. Add an apple and some carrot sticks',
    }),
    () => {
      const v = labelValues();
      const v2 = labelValues();
      const hi = v.hundred[0] >= v2.hundred[0] ? 'the first' : 'the second';
      return {
        visual: labelSvg(v, v.name),
        prompt: `This packet says <b>${v.hundred[0]} kJ per 100 g</b>. A second packet says <b>${v2.hundred[0]} kJ per 100 g</b>. Which figures should Harper compare, and why?`,
        answer: ch('The per 100 g figures, because the two packets have different serving sizes', ['The per serving figures, because that is what she eats', 'Whichever number is smaller', 'It does not matter, both columns say the same thing'], 4),
        hint: 'Serving sizes are chosen by the company and are almost never the same.',
        working: ['<b>Picture:</b> comparing two runners means using the same track.', '1. Serving sizes differ between packets, so per serving is not a fair comparison.', '2. Per 100 g is the same amount for both.', `3. Here ${hi} packet has more energy per 100 g.`],
        finalAnswer: 'The per 100 g figures, because the two packets have different serving sizes',
      };
    },
    () => ({
      prompt: 'Harper\'s brother trains for rowing every morning and eats twice as much as she does. Is something wrong with him?',
      answer: ch('No — he uses far more energy, so he needs far more energy in. Energy in should match energy out', ['Yes, nobody should eat that much', 'Yes, athletes should eat less to stay light', 'No, but only because boys always need more than girls'], 4),
      hint: 'Energy in versus energy out.',
      working: ['<b>Picture:</b> money into the bank has to match money out.', '1. Training burns a lot of energy → energy <b>out</b> is high.', '2. So energy <b>in</b> must be high to match.', '3. He also needs extra <b>protein</b> to repair and build muscle.', 'Nothing wrong at all.'],
      finalAnswer: 'No — he uses far more energy, so he needs far more energy in. Energy in should match energy out',
    }),
    () => {
      const items = R.sample(FOODS, 4).sort((a, b) => a.kj - b.kj);
      const top = items[items.length - 1], low = items[0];
      return {
        visual: energySvg(items),
        prompt: `Harper wants a snack that will keep her going through netball. Using the chart, which gives the most energy, and is "most energy" always the best choice?`,
        answer: ch(`${cap(top.name)} gives the most energy — but the best snack also has other nutrients, not just kilojoules`, [`${cap(low.name)}, because low energy is always healthier`, 'The one with the most energy is always the best snack', 'Kilojoules have nothing to do with energy'], 4),
        hint: 'Read the tallest bar, then think about what else is in the food.',
        working: ['<b>Picture:</b> taller bar = more fuel, but fuel is not the whole story.', items.map((x) => `${x.name}: ${x.kj} kJ`).join(' · '), `1. Most energy: <b>${top.name}</b>.`, '2. But a food can be all sugar and fat with no vitamins, minerals or fibre.', 'So look at the whole label, not just the kJ.'],
        finalAnswer: `${cap(top.name)} gives the most energy — but the best snack also has other nutrients, not just kilojoules`,
      };
    },
    () => ({
      prompt: 'A friend says "fat is bad, I never eat any". What would you tell her?',
      answer: ch('Your body needs some fat — it stores energy, keeps you warm and protects your organs. It is only too much that is a problem', ['She is right, fat has no use at all', 'Fat is only needed by athletes', 'Fat is the same thing as fibre so she still gets it'], 4),
      hint: 'Every nutrient group has a job — the problem is always the amount.',
      working: ['<b>Picture:</b> the reserve fuel tank plus a woolly jumper.', '1. Fat <b>stores energy</b> for later.', '2. It <b>keeps you warm</b> and <b>cushions your organs</b>.', '3. Some vitamins can only be carried around in fat.', 'Too much is the problem — none at all is also a problem.'],
      finalAnswer: 'Your body needs some fat — it stores energy, keeps you warm and protects your organs. It is only too much that is a problem',
    }),
    () => ({
      prompt: 'Why does eating a bowl of wholegrain porridge keep Harper full much longer than the same kilojoules of lollies?',
      answer: ch('The porridge has fibre and is digested slowly, so the energy trickles in; the sugar in lollies arrives all at once', ['Porridge has more kilojoules than the label says', 'Lollies are not digested at all', 'Porridge sits in the stomach and is never absorbed'], 4),
      hint: 'Think about how fast the energy actually gets into the blood.',
      working: ['<b>Picture:</b> a log fire against a handful of paper — same fuel, very different burn.', '1. Lollies = simple sugar → absorbed almost instantly → a quick spike, then hungry again.', '2. Porridge = starch plus <b>fibre</b> → digested slowly → steady energy.', '3. The fibre also gives the food bulk, which makes you feel full.'],
      finalAnswer: 'The porridge has fibre and is digested slowly, so the energy trickles in; the sugar in lollies arrives all at once',
    }),
    () => {
      const n = R.pick(NUTRIENTS.filter((x) => ['carb', 'protein', 'fat', 'fibre', 'water'].includes(x.key)));
      return {
        prompt: `Someone eats plenty of everything except <b>${n.name}</b>. What goes wrong, and why?`,
        answer: ch(n.lack, NUTRIENTS.map((x) => x.lack), 4),
        hint: `${cap(n.name)} ${n.job}.`,
        working: [`<b>Picture:</b> ${n.name} is ${n.pic}.`, `1. Its job is: ${n.job}.`, '2. Take it away and that job stops.', `So: <b>${n.lack}</b>.`],
        finalAnswer: n.lack,
      };
    },
    () => ({
      visual: plateSvg('protein'),
      prompt: 'A 12-year-old and a 30-year-old office worker weigh the same. Why does the 12-year-old need more protein?',
      answer: ch('She is still growing, so she needs building material for new tissue as well as for repair', ['Children digest protein badly so they need extra', 'Adults do not repair their bodies at all', 'She does not — she needs less'], 4),
      hint: 'Protein does two jobs: growth and repair. Only one of them applies to a fully grown adult.',
      working: ['<b>Picture:</b> protein is the bricks and the builders.', '1. An adult uses protein for <b>repair</b> only.', '2. A 12-year-old uses it for repair <b>and growth</b> — new bone, new muscle.', '3. So she needs more bricks per kilogram of body than he does.'],
      finalAnswer: 'She is still growing, so she needs building material for new tissue as well as for repair',
    }),
    () => ({
      prompt: 'Harper drinks almost no water on a hot day at athletics and gets a headache and feels dizzy. Explain what has happened.',
      answer: ch('She is dehydrated — she lost water in sweat and did not replace it, so her body cannot transport or cool properly', ['She has run out of protein', 'She has too much fibre in her gut', 'Her body has stopped digesting carbohydrate'], 4),
      hint: 'What is water actually doing in your body?',
      working: ['<b>Picture:</b> water is the river everything floats along.', '1. Sweating <b>cools</b> her, but it uses up water.', '2. Less water → blood cannot carry things around as well, and cooling gets harder.', '3. Result: headache, dizziness, dark urine — <b>dehydration</b>.', 'Fix: drink water steadily, before she feels thirsty.'],
      finalAnswer: 'She is dehydrated — she lost water in sweat and did not replace it, so her body cannot transport or cool properly',
    }),
    () => ({
      prompt: 'A muesli bar label says "97% fat free". Its energy is 1700 kJ per 100 g, and 45 g of that 100 g is sugar. Is it a healthy snack?',
      answer: ch('Not really — "fat free" says nothing about the sugar, and 1700 kJ per 100 g is high-energy food', ['Yes — anything fat free is healthy', 'Yes, because sugar is not measured in kilojoules', 'You cannot tell without knowing the serving size'], 4),
      hint: 'Read the whole panel, not the claim on the front of the packet.',
      working: ['<b>Picture:</b> the front of a packet is an advert; the back is the evidence.', '1. "97% fat free" only talks about <b>fat</b>.', '2. Sugar is 45 g in every 100 g — nearly half.', '3. Energy is <b>1700 kJ per 100 g</b>, which is high.', 'So: high-sugar, high-energy — a treat, not an everyday snack.'],
      finalAnswer: 'Not really — "fat free" says nothing about the sugar, and 1700 kJ per 100 g is high-energy food',
    }),
    () => ({
      prompt: 'Harper eats a chicken and salad wrap. Trace what happens to the protein in it, from her mouth to a muscle cell.',
      answer: ch('It is digested into amino acids, absorbed in the small intestine, carried in the blood, and used to build new muscle', ['It goes straight into the muscle as whole protein', 'It is turned into glucose and breathed out', 'It stays in the stomach until it is needed'], 4),
      hint: 'Big molecules must be broken into small ones before they can cross the gut wall.',
      working: ['<b>Picture:</b> a beanbag emptied out so the beans fit through the letterbox.', '1. Chewing and enzymes break the protein into <b>amino acids</b>.', '2. They are absorbed through the wall of the <b>small intestine</b>.', '3. The <b>blood</b> carries them everywhere.', '4. A muscle cell joins them back together as new muscle protein — <b>growth and repair</b>.'],
      finalAnswer: 'It is digested into amino acids, absorbed in the small intestine, carried in the blood, and used to build new muscle',
    }),
  ];

  HL.registerTopic({
    id: 'nutrition', subject: 'science', strand: 'living', order: 8,
    name: 'Food & nutrition', short: 'Nutrition', animal: 'kiwi',
    blurb: 'What is in your food, what each nutrient is for, and how to read a label.',
    example: 'carbohydrate = energy · protein = growth & repair',
    learn: {
      what: '<p>Food is not one thing — it is a mix of <b>nutrients</b>, and each one has a different job. Carbohydrate is your fuel, protein builds and repairs you, fat stores energy and keeps you warm, and vitamins, minerals, fibre and water keep everything else running. A <b>balanced diet</b> means getting the right amount of each: too little of one causes a <b>deficiency</b>, and more energy in than out gets stored as fat.</p><p><b>Picture for this topic:</b> your body is a <b>car</b>. Carbohydrate is the <b>petrol</b>, fat is the <b>reserve tank</b>, protein is the <b>spare parts and the builders</b>, vitamins and minerals are the <b>few drops of oil and the nuts and bolts</b>, fibre is the <b>brush that keeps the pipes clear</b>, and water is the <b>coolant</b>.</p>',
      visual: `<svg viewBox="0 0 340 212" width="340" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <circle cx="108" cy="104" r="81" fill="#FFFFFF" stroke="#D9BE8A" stroke-width="3"/>
        <path d="M108 104 L108.0 30.0 A74 74 0 0 1 108.0 178.0 Z" fill="#8FC96E" stroke="#FFFFFF" stroke-width="3"/>
        <path d="M108 104 L108.0 178.0 A74 74 0 0 1 34.0 104.0 Z" fill="#E8C24A" stroke="#FFFFFF" stroke-width="3"/>
        <path d="M108 104 L34.0 104.0 A74 74 0 0 1 64.5 44.1 Z" fill="#E9A07A" stroke="#FFFFFF" stroke-width="3"/>
        <path d="M108 104 L64.5 44.1 A74 74 0 0 1 108.0 30.0 Z" fill="#A9D8F5" stroke="#FFFFFF" stroke-width="3"/>
        <text x="108" y="202" text-anchor="middle" fill="#4A4033" font-size="11.5">half the plate is fruit and veges</text>
        <text x="196" y="20" fill="#7A7065" font-size="11">a balanced plate</text>
        <rect x="196" y="34" width="16" height="16" rx="4" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
        <text x="220" y="45" fill="#4A4033" font-size="11.5">fruit &amp;</text><text x="220" y="59" fill="#4A4033" font-size="11.5">vegetables</text>
        <rect x="196" y="72" width="16" height="16" rx="4" fill="#E8C24A" stroke="#4A4033" stroke-width="1.5"/>
        <text x="220" y="83" fill="#4A4033" font-size="11.5">breads &amp;</text><text x="220" y="97" fill="#4A4033" font-size="11.5">cereals</text>
        <rect x="196" y="110" width="16" height="16" rx="4" fill="#E9A07A" stroke="#4A4033" stroke-width="1.5"/>
        <text x="220" y="121" fill="#4A4033" font-size="11.5">meat, fish,</text><text x="220" y="135" fill="#4A4033" font-size="11.5">eggs, beans</text>
        <rect x="196" y="148" width="16" height="16" rx="4" fill="#A9D8F5" stroke="#4A4033" stroke-width="1.5"/>
        <text x="220" y="159" fill="#4A4033" font-size="11.5">milk &amp;</text><text x="220" y="173" fill="#4A4033" font-size="11.5">cheese</text>
      </svg>`,
      facts: [
        '<b>Carbohydrate</b> = energy (bread, rice, pasta, potato, kūmara)',
        '<b>Protein</b> = growth and repair (meat, fish, eggs, milk, beans, nuts)',
        '<b>Fat</b> = stored energy, warmth and protection (butter, oil, cheese, nuts, avocado)',
        '<b>Vitamins</b> and <b>minerals</b> are needed in tiny amounts: vitamin C stops scurvy, calcium builds bones, iron makes red blood cells',
        '<b>Fibre</b> is never digested — it gives the food bulk so it keeps moving. <b>Water</b> transports everything and cools you',
        'Energy is measured in <b>kilojoules (kJ)</b>. Energy in &gt; energy out → stored as fat',
        '<b>Carbohydrate = sugars + starch.</b> Simple sugars end in <b>-ose</b> (glucose, fructose, sucrose, lactose) and give instant energy; <b>starch</b> is complex, so it is slow and fills you up',
        '<b>Lipid</b> is the proper word for fats and oils. Fats are <b>solid</b> at room temperature and mostly from animals; oils are <b>liquid</b> and mostly from plants. Lipids also build the outside of every cell',
        '<b>Vitamins are made by living things; minerals come out of the ground.</b> Main vitamins: A, the B group, C and D. Calcium (dairy) → bones and teeth; iron (red meat, greens) → red blood cells',
        '<b>Fibre</b> is plant material you cannot digest. Too little → constipation. Too much → diarrhoea. <b>Water</b> dissolves and transports everything — you last only about <b>3 days</b> without it',
        '<b>The four food tests:</b> starch → <b>iodine</b>, orange-brown → blue-black · sugar → <b>Benedict\'s</b> (heated), blue → brick red · protein → <b>Biuret</b>, blue → purple · fat → <b>ethanol</b> into water, clear → cloudy white',
      ],
      steps: [
        'For "what is this nutrient for?", use the car: <b>petrol</b> (carbohydrate), <b>spare parts</b> (protein), <b>reserve tank</b> (fat), <b>drops of oil</b> (vitamins), <b>bricks and nails</b> (minerals), <b>pipe brush</b> (fibre), <b>coolant</b> (water).',
        'For a deficiency question, work <b>backwards</b>: name the symptom, ask which job has stopped, then name the nutrient that does that job.',
        'On a food label, use <b>per 100 g</b> when you compare two packets, and <b>per serving</b> when you want what you actually ate. Serving sizes are never the same between brands.',
        'For energy questions, say "<b>in versus out</b>". More in than out → stored as fat. More out than in → the stores get used.',
        'For a <b>food test</b>, say it in three parts: the <b>chemical</b>, the <b>starting colour</b>, the <b>positive colour</b>. "Biuret, blue, purple." Only Benedict\'s needs heating — in a hot water bath, never a flame.',
        'Link it back to digestion: carbohydrate → <b>glucose</b>, protein → <b>amino acids</b>, fat → <b>fatty acids and glycerol</b>, absorbed in the <b>small intestine</b>.',
      ],
      examples: [
        {
          q: 'How do you test a food for <b>starch</b>, and what tells you the answer?',
          visual: `<svg viewBox="0 0 320 190" width="320" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="18" text-anchor="middle" fill="#4A4033" font-size="12">the iodine test for starch</text>
            <rect x="46" y="44" width="34" height="96" rx="17" fill="#C97B22" stroke="#4A4033" stroke-width="2.5"/>
            <rect x="46" y="44" width="34" height="14" rx="7" fill="#FFFFFF" opacity=".55"/>
            <rect x="42" y="38" width="42" height="10" rx="5" fill="#EFE6D6" stroke="#4A4033" stroke-width="2"/>
            <text x="63" y="158" text-anchor="middle" fill="#4A4033" font-size="11.5">no starch</text>
            <text x="63" y="173" text-anchor="middle" fill="#7A7065" font-size="10.5">orange-brown</text>
            <text x="160" y="92" text-anchor="middle" fill="#4A4033" font-size="20">&#8594;</text>
            <text x="160" y="116" text-anchor="middle" fill="#7A7065" font-size="11">add 2–3 drops</text>
            <text x="160" y="130" text-anchor="middle" fill="#7A7065" font-size="11">of iodine</text>
            <rect x="238" y="44" width="34" height="96" rx="17" fill="#1D2B6B" stroke="#4A4033" stroke-width="2.5"/>
            <rect x="238" y="44" width="34" height="14" rx="7" fill="#FFFFFF" opacity=".45"/>
            <rect x="234" y="38" width="42" height="10" rx="5" fill="#EFE6D6" stroke="#4A4033" stroke-width="2"/>
            <text x="255" y="158" text-anchor="middle" fill="#4A4033" font-size="11.5">starch found</text>
            <text x="255" y="173" text-anchor="middle" fill="#7A7065" font-size="10.5">blue-black</text>
            <text x="160" y="186" text-anchor="middle" fill="#7A7065" font-size="10.5">bread · potato · rice · pasta</text>
          </svg>`,
          working: ['<b>Picture:</b> iodine is a tiny detective that turns almost black the second it finds starch.', '1. Put a little of the food on a <b>spotting tile</b>.', '2. Add <b>2–3 drops of iodine solution</b>. No heating needed.', '3. <b>Watch the colour.</b> Iodine starts <b>orange-brown</b>.', '4. Goes <b>blue-black</b> → <b>positive</b>, the food has starch (bread, potato, rice, pasta).', '5. Stays orange-brown → <b>negative</b>, no starch.'],
          a: 'Add iodine solution: orange-brown → blue-black means starch is there',
        },
        {
          q: 'How do you test a food for <b>protein</b> and for <b>fat</b>? Give the chemical and the colour change for each.',
          visual: `<svg viewBox="0 0 320 190" width="320" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="80" y="18" text-anchor="middle" fill="#4A4033" font-size="11.5">protein: Biuret</text>
            <rect x="30" y="34" width="28" height="74" rx="14" fill="#2F6FD0" stroke="#4A4033" stroke-width="2.5"/>
            <text x="44" y="124" text-anchor="middle" fill="#7A7065" font-size="10.5">blue</text>
            <text x="80" y="76" text-anchor="middle" fill="#4A4033" font-size="17">&#8594;</text>
            <rect x="102" y="34" width="28" height="74" rx="14" fill="#7A3FA8" stroke="#4A4033" stroke-width="2.5"/>
            <text x="116" y="124" text-anchor="middle" fill="#7A7065" font-size="10.5">purple</text>
            <text x="82" y="146" text-anchor="middle" fill="#4A4033" font-size="10">egg white · meat · milk</text>
            <line x1="160" y1="26" x2="160" y2="156" stroke="#D9BE8A" stroke-width="2"/>
            <text x="240" y="18" text-anchor="middle" fill="#4A4033" font-size="11.5">fat: ethanol + water</text>
            <rect x="190" y="34" width="28" height="74" rx="14" fill="#DCEEF9" stroke="#4A4033" stroke-width="2.5"/>
            <text x="204" y="124" text-anchor="middle" fill="#7A7065" font-size="10.5">clear</text>
            <text x="240" y="76" text-anchor="middle" fill="#4A4033" font-size="17">&#8594;</text>
            <rect x="262" y="34" width="28" height="74" rx="14" fill="#E8E4DA" stroke="#4A4033" stroke-width="2.5"/>
            <text x="276" y="124" text-anchor="middle" fill="#7A7065" font-size="10.5">cloudy white</text>
            <text x="240" y="146" text-anchor="middle" fill="#4A4033" font-size="10">butter · oil · nuts</text>
            <text x="160" y="178" text-anchor="middle" fill="#B5401E" font-size="10">ethanol is flammable — keep flames away</text>
          </svg>`,
          working: ['<b>Picture:</b> every test is a detective who only looks for one thing.', '<b>Protein — Biuret.</b>', '1. Add <b>Biuret solution</b> to the food in a test tube and shake gently.', '2. It starts <b>blue</b>. Goes <b>purple</b> → protein is there. Remember: <b>P</b>urple for <b>P</b>rotein.', '<b>Fat — the ethanol emulsion test.</b>', '3. Shake the food with <b>ethanol</b> and let it settle.', '4. Pour the liquid into a tube of <b>water</b>.', '5. <b>Cloudy white</b> → fat is there. Stays <b>clear</b> → no fat.', '6. Safety: ethanol is <b>highly flammable</b>, so nothing must be alight nearby.'],
          a: 'Biuret: blue → purple = protein. Ethanol then water: clear → cloudy white = fat',
        },
        {
          q: "Harper tests grape juice with Benedict's solution and it goes brick red. Explain the test, step by step.",
          working: ['<b>Picture:</b> Benedict’s goes from a cold blue to a hot brick red, like a ring warming up.', '1. Put the grape juice in a test tube and add <b>Benedict’s solution</b>. Right now it is <b>blue</b>.', '2. Stand the tube in a <b>hot water bath</b>. This is the <b>only</b> food test that needs heating.', '3. Why a water bath and not a flame? It heats gently and evenly, so nothing spits out of the tube.', '4. Watch it travel: blue → green → orange → <b>brick red</b>.', '5. Brick red = <b>positive</b> → the juice contains <b>glucose</b>, a simple sugar.', '6. Stayed blue = negative → no simple sugar.'],
          a: "Benedict's, heated in a water bath: blue → brick red means a simple sugar (glucose) is there",
        },
        {
          q: 'Harper is handed an unknown food and asked "what is in it?". Plan the whole set of tests.',
          working: ['<b>Picture:</b> four detectives, and each only recognises one suspect.', '1. Mash the food up and share it between <b>four</b> tubes, so one test cannot spoil another.', '2. <b>Iodine</b> → orange-brown to blue-black = <b>starch</b>.', '3. <b>Benedict’s + hot water bath</b> → blue to brick red = <b>simple sugar</b>.', '4. <b>Biuret</b> → blue to purple = <b>protein</b>.', '5. <b>Ethanol then water</b> → clear to cloudy white = <b>fat</b>.', '6. Write down <b>every</b> result, positive and negative. A food can easily be positive for two or three — milk is positive for sugar, protein and fat.'],
          a: 'Four separate tubes: iodine, Benedict’s (heated), Biuret and ethanol — then record every result',
        },
        {
          q: 'Why do you need both <b>sugar</b> and <b>starch</b>, and where does each come from?',
          working: ['<b>Picture:</b> kindling lights fast; a log burns for hours.', '1. Both are <b>carbohydrates</b>, so both are for <b>energy</b>.', '2. <b>Sugars</b> are simple. Their names end in <b>-ose</b>: glucose, fructose, sucrose, lactose. They go straight into the blood → <b>instant</b> energy. From fruit, honey, milk and vegetables.', '3. <b>Starch</b> is complex. It has to be broken down first → <b>slow</b> energy that fills you up. From cereals, bread, pasta, flour, potatoes.', '4. So: starch at meals to keep you going, sugar only for a quick top-up.'],
          a: 'Sugars (-ose) are simple and instant; starch is complex, slow and filling',
        },
        {
          q: 'Name the nutrient each of these is mainly for: a bowl of rice, a boiled egg, an avocado.',
          working: ['<b>Picture:</b> your body is a car — petrol, spare parts, reserve tank.', '1. Rice is starchy → <b>carbohydrate</b> → the <b>petrol</b>, for energy.', '2. An egg is → <b>protein</b> → the <b>spare parts</b>, for growth and repair.', '3. An avocado is oily → <b>fat</b> → the <b>reserve tank</b>, for stored energy and warmth.'],
          a: 'Rice = carbohydrate · egg = protein · avocado = fat',
        },
        {
          q: 'What should a balanced plate look like, and where does a chicken and salad wrap fit?',
          visual: `<svg viewBox="0 0 340 212" width="340" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <circle cx="108" cy="104" r="81" fill="#FFFFFF" stroke="#D9BE8A" stroke-width="3"/>
            <path d="M108 104 L108.0 30.0 A74 74 0 0 1 108.0 178.0 Z" fill="#8FC96E" stroke="#FFFFFF" stroke-width="3"/>
            <path d="M108 104 L108.0 178.0 A74 74 0 0 1 34.0 104.0 Z" fill="#E8C24A" stroke="#FFFFFF" stroke-width="3"/>
            <path d="M108 104 L34.0 104.0 A74 74 0 0 1 64.5 44.1 Z" fill="#E9A07A" stroke="#FFFFFF" stroke-width="3"/>
            <path d="M108 104 L64.5 44.1 A74 74 0 0 1 108.0 30.0 Z" fill="#A9D8F5" stroke="#FFFFFF" stroke-width="3"/>
            <text x="146" y="108" text-anchor="middle" fill="#3F6B22" font-size="11.5">salad</text>
            <text x="79" y="137" text-anchor="middle" fill="#8A6410" font-size="11.5">wrap</text>
            <text x="73" y="80" text-anchor="middle" fill="#A8552A" font-size="11.5">chicken</text>
            <text x="10" y="202" fill="#4A4033" font-size="11.5">half veges · quarter carbs · quarter protein</text>
            <rect x="196" y="40" width="16" height="16" rx="4" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
            <text x="220" y="52" fill="#4A4033" font-size="11.5">salad = vitamins</text>
            <text x="220" y="68" fill="#7A7065" font-size="11">+ fibre</text>
            <rect x="196" y="86" width="16" height="16" rx="4" fill="#E8C24A" stroke="#4A4033" stroke-width="1.5"/>
            <text x="220" y="98" fill="#4A4033" font-size="11.5">wrap = energy</text>
            <text x="220" y="118" fill="#7A7065" font-size="11">carbohydrate</text>
            <rect x="196" y="132" width="16" height="16" rx="4" fill="#E9A07A" stroke="#4A4033" stroke-width="1.5"/>
            <text x="220" y="144" fill="#4A4033" font-size="11.5">chicken = protein</text>
            <text x="220" y="160" fill="#7A7065" font-size="11">growth &amp; repair</text>
          </svg>`,
          working: ['<b>Picture:</b> lay the food out on the plate and see which wedges get filled.', '1. About <b>half</b> the plate should be fruit and vegetables → that is the <b>salad</b>.', '2. About a <b>quarter</b> is breads and cereals → the <b>wrap</b>, for energy.', '3. About a <b>quarter</b> is meat, fish, eggs or beans → the <b>chicken</b>, for growth and repair.', '4. Add a glass of milk for calcium and a drink of water and it is balanced.'],
          a: 'Half veges (salad), a quarter carbohydrate (wrap), a quarter protein (chicken) — it is well balanced',
        },
        {
          q: 'A sailor in the 1700s ate only salted meat and dry biscuit for months and got bleeding gums. What went wrong?',
          working: ['<b>Picture:</b> one part of the car has run completely dry.', '1. What is the symptom? Bleeding gums and slow-healing cuts → that is <b>scurvy</b>.', '2. Which nutrient stops scurvy? <b>Vitamin C</b>.', '3. Where does vitamin C come from? <b>Fresh fruit and vegetables</b> — which he had none of.', '4. Fix: kiwifruit, oranges, lemons, fresh greens.'],
          a: 'Not enough vitamin C — scurvy. Fixed by fresh fruit and vegetables',
        },
        {
          q: 'Read this label. How much energy is in one serving, and how much sugar is in 100 g?',
          visual: `<svg viewBox="0 0 328 200" width="328" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="6" y="6" width="316" height="188" rx="8" fill="#FFFDF6" stroke="#4A4033" stroke-width="2.5"/>
            <text x="16" y="26" fill="#4A4033" font-size="12">Nutrition Information — crunchy muesli</text>
            <text x="16" y="42" fill="#7A7065" font-size="10.5">Serving size: 40 g</text>
            <line x1="12" y1="50" x2="316" y2="50" stroke="#4A4033" stroke-width="2"/>
            <text x="212" y="62" text-anchor="end" fill="#B03068" font-size="11">per serving</text>
            <text x="312" y="62" text-anchor="end" fill="#5F98C4" font-size="11">per 100 g</text>
            <text x="16" y="78" fill="#4A4033" font-size="11.5">Energy</text><text x="212" y="78" text-anchor="end" fill="#B03068" font-size="11.5">720 kJ</text><text x="312" y="78" text-anchor="end" fill="#4A4033" font-size="11.5">1800 kJ</text>
            <line x1="12" y1="84" x2="316" y2="84" stroke="#E4D7BE" stroke-width="1"/>
            <text x="16" y="98" fill="#4A4033" font-size="11.5">Protein</text><text x="212" y="98" text-anchor="end" fill="#4A4033" font-size="11.5">4 g</text><text x="312" y="98" text-anchor="end" fill="#4A4033" font-size="11.5">10 g</text>
            <line x1="12" y1="104" x2="316" y2="104" stroke="#E4D7BE" stroke-width="1"/>
            <text x="16" y="118" fill="#4A4033" font-size="11.5">Fat, total</text><text x="212" y="118" text-anchor="end" fill="#4A4033" font-size="11.5">5.6 g</text><text x="312" y="118" text-anchor="end" fill="#4A4033" font-size="11.5">14 g</text>
            <line x1="12" y1="124" x2="316" y2="124" stroke="#E4D7BE" stroke-width="1"/>
            <text x="16" y="138" fill="#4A4033" font-size="11.5">Sugars</text><text x="212" y="138" text-anchor="end" fill="#4A4033" font-size="11.5">9.6 g</text><text x="312" y="138" text-anchor="end" fill="#5F98C4" font-size="11.5">24 g</text>
            <line x1="12" y1="144" x2="316" y2="144" stroke="#E4D7BE" stroke-width="1"/>
            <text x="16" y="158" fill="#4A4033" font-size="11.5">Fibre</text><text x="212" y="158" text-anchor="end" fill="#4A4033" font-size="11.5">2.8 g</text><text x="312" y="158" text-anchor="end" fill="#4A4033" font-size="11.5">7 g</text>
            <line x1="12" y1="164" x2="316" y2="164" stroke="#E4D7BE" stroke-width="1"/>
            <text x="16" y="178" fill="#4A4033" font-size="11.5">Sodium</text><text x="212" y="178" text-anchor="end" fill="#4A4033" font-size="11.5">120 mg</text><text x="312" y="178" text-anchor="end" fill="#4A4033" font-size="11.5">300 mg</text>
            <line x1="12" y1="184" x2="316" y2="184" stroke="#E4D7BE" stroke-width="1"/>
          </svg>`,
          working: ['<b>Picture:</b> two columns — pink is one serve, blue is 100 g.', '1. Energy, <b>per serving</b> column → <b>720 kJ</b>.', '2. Sugars, <b>per 100 g</b> column → <b>24 g</b>. That is nearly a quarter sugar.', '3. To compare with another brand, always use the <b>per 100 g</b> column — the serving sizes will be different.'],
          a: '720 kJ per serving; 24 g of sugar in every 100 g',
        },
        {
          q: 'Which of these snacks has the most energy, and how much more than the apple?',
          visual: `<svg viewBox="0 0 320 195" width="320" height="195" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="15" text-anchor="middle" fill="#4A4033" font-size="11.5">energy in one serve (kJ)</text>
            <text x="6" y="32" fill="#7A7065" font-size="10.5">kJ</text>
            <line x1="34" y1="22" x2="34" y2="150" stroke="#4A4033" stroke-width="2"/>
            <line x1="34" y1="150" x2="312" y2="150" stroke="#4A4033" stroke-width="2"/>
            <rect x="46" y="129" width="50" height="21" rx="4" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
            <text x="71" y="124" text-anchor="middle" fill="#4A4033" font-size="10.5">250</text>
            <text x="71" y="166" text-anchor="middle" fill="#4A4033" font-size="10.5">apple</text>
            <rect x="112" y="120" width="50" height="30" rx="4" fill="#E8C24A" stroke="#4A4033" stroke-width="1.5"/>
            <text x="137" y="115" text-anchor="middle" fill="#4A4033" font-size="10.5">350</text>
            <text x="137" y="166" text-anchor="middle" fill="#4A4033" font-size="10.5">slice of</text>
            <text x="137" y="180" text-anchor="middle" fill="#4A4033" font-size="10.5">bread</text>
            <rect x="178" y="90" width="50" height="60" rx="4" fill="#A9D8F5" stroke="#4A4033" stroke-width="1.5"/>
            <text x="203" y="85" text-anchor="middle" fill="#4A4033" font-size="10.5">700</text>
            <text x="203" y="166" text-anchor="middle" fill="#4A4033" font-size="10.5">muesli</text>
            <text x="203" y="180" text-anchor="middle" fill="#4A4033" font-size="10.5">bar</text>
            <rect x="244" y="42" width="50" height="108" rx="4" fill="#E9A07A" stroke="#4A4033" stroke-width="1.5"/>
            <text x="269" y="37" text-anchor="middle" fill="#4A4033" font-size="10.5">1600</text>
            <text x="269" y="166" text-anchor="middle" fill="#4A4033" font-size="10.5">mince</text>
            <text x="269" y="180" text-anchor="middle" fill="#4A4033" font-size="10.5">pie</text>
          </svg>`,
          working: ['<b>Picture:</b> taller bar = more fuel in the tank.', '1. The tallest bar is the <b>mince pie</b> at <b>1600 kJ</b>.', '2. The apple is <b>250 kJ</b>.', '3. 1600 − 250 = <b>1350 kJ</b> more.', '4. But the apple also brings <b>fibre and vitamin C</b>, which the pie does not.'],
          a: 'The mince pie — 1350 kJ more than the apple',
        },
        {
          q: 'Harper eats a chicken sandwich. Trace the protein from her mouth to a muscle cell.',
          working: ['<b>Picture:</b> a beanbag will not fit through a letterbox — tip the beans out first.', '1. Enzymes break the protein down into <b>amino acids</b>.', '2. They are absorbed through the wall of the <b>small intestine</b>.', '3. The <b>blood</b> carries them to every cell.', '4. A muscle cell joins them back together as new muscle — that is <b>growth and repair</b>.'],
          a: 'Protein → amino acids → absorbed in the small intestine → carried in the blood → built into new muscle',
        },
        {
          q: 'Harper eats the same food as always but stops playing sport. She slowly gains weight. Explain why, using energy in and energy out.',
          working: ['<b>Picture:</b> money going into the bank faster than it comes out.', '1. Energy <b>in</b> from her food: unchanged.', '2. Energy <b>out</b>: sport has stopped, so it has gone down.', '3. in > out, so the extra energy has to go somewhere.', '4. The body stores it as <b>fat</b>.', 'To balance it she can eat a bit less or move a bit more — either side of the sum works.'],
          a: 'Energy in is now bigger than energy out, so the extra is stored as fat',
        },
      ],
      tips: [
        'Fibre is a nutrient you <b>never digest</b> — that is the whole point of it. It gives the food bulk so the gut can push it along.',
        'When you compare two packets, always use the <b>per 100 g</b> column. Serving sizes are chosen by the company and are almost never the same.',
        '"Fat free" or "no added sugar" on the front of a packet tells you about <b>one</b> thing only. Turn it over and read the whole panel.',
        'Energy is in <b>kilojoules (kJ)</b>, not grams. A tiny amount of fat carries a lot of kilojoules.',
        'A <b>positive</b> food test only proves that <b>one</b> nutrient is there. It never proves the others are absent — real food is a mixture, so you run all four tests.',
        'Remember the colours by their letters: <b>B</b>iuret → <b>b</b>lue to purple for protein. <b>I</b>odine → <b>i</b>nky blue-black for starch. Benedict\'s goes from cold <b>blue</b> to hot <b>brick red</b>.',
        'Safety: the sugar test is heated in a <b>hot water bath</b>; the fat test uses <b>ethanol</b>, which catches fire easily — so no Bunsen alight on the bench.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [nutrientJob, sourceQ, plateQ, deficiencyQ, labelQ, energyChart, digestLink, nutritionCalc, foodTestQ, foodTestQ, schoolFactQ, schoolFactQ]
        : level === 2
          ? [nutrientJob, sourceQ, plateQ, deficiencyQ, balanceQ, labelQ, energyChart, digestLink, nutritionCalc, foodTestQ, foodTestQ, schoolFactQ, schoolFactQ]
          : [nutrientJob, sourceQ, plateQ, deficiencyQ, balanceQ, labelQ, labelQ, energyChart, digestLink, nutritionCalc, foodTestQ, foodTestQ, schoolFactQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
