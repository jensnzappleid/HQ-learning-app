/* Topic: Test review — Nutrition & Microbes.
 * Built from the teacher's marking of Harper's Microbes test: one generator per question on the
 * paper, aimed at exactly where the marks went. Most of the facts are already in nutrition.js,
 * microbes-health.js, immunity.js and classification.js; what this adds is the exam side —
 * written definitions instead of picking from a list, filling in the tables the paper used,
 * reading a nutrition label for what is missing, reading a data table, herd immunity, and
 * questions with a trap in the wording ("other than", "natural", "features"). */
window.HL = window.HL || {};
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { value: shuffled.indexOf(correct), choices: shuffled };
  }
  const ch = (correct, wrongs, n) => { const c = choice(correct, wrongs, n); return { type: 'choice', value: c.value, choices: c.choices }; };
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /** an exam-style table; a cell of null is drawn as the blank to fill in */
  const table = (head, rows) => `<table class="data"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
    rows.map((r) => `<tr>${r.map((c) => (c === null ? '<td style="background:#FFE7A8;font-weight:800">?</td>' : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;

  /* ---------- Q1 the job of each nutrient, said the way the marker wants it ---------- */
  const NUTRIENTS = [
    { name: 'carbohydrate', job: 'gives the body energy — it is the main fuel', key: 'energy', keyAccept: ['energy', 'fuel'],
      cloze: 'Carbohydrate is the body\'s main source of ____.' },
    { name: 'protein', job: 'is used for growth and to repair cells and tissues', key: 'repair', keyAccept: ['repair', 'repairing', 'growth and repair'],
      cloze: 'Protein is used for growth and to ____ damaged cells.' },
    { name: 'fats (lipids)', job: 'store energy for later, keep the body warm (insulation), protect the organs and build cell membranes', key: 'warm', keyAccept: ['warm', 'warmth', 'insulated', 'insulation'],
      cloze: 'Fats store energy, protect the organs and keep the body ____.' },
    { name: 'vitamins', job: 'are needed in tiny amounts to keep the body healthy and working properly — for example vitamin C keeps skin and gums healthy', key: 'healthy', keyAccept: ['healthy', 'working', 'working properly', 'well'],
      cloze: 'Vitamins are needed in small amounts to keep the body ____.' },
    { name: 'minerals', job: 'are needed in tiny amounts to build parts of the body — calcium for bones and teeth, iron for red blood cells', key: 'bones', keyAccept: ['bones', 'bone', 'bones and teeth', 'teeth'],
      cloze: 'Calcium is a mineral that builds strong ____ and teeth.' },
    { name: 'fibre', job: 'is not digested — it keeps food moving through the gut and stops constipation', key: 'constipation', keyAccept: ['constipation', 'constipated'],
      cloze: 'Fibre keeps food moving through the gut and stops ____.' },
    { name: 'water', job: 'carries (transports) substances round the body, dissolves things so reactions can happen, and cools you down by sweating', key: 'transports', keyAccept: ['transports', 'transport', 'carries', 'moves'],
      cloze: 'Water ____ dissolved substances around the body, like a river.' },
  ];
  /** the three she did not know, asked twice as often */
  const NUTRIENT_WEIGHTED = NUTRIENTS.concat(NUTRIENTS.filter((n) => /fats|vitamins|minerals|water/.test(n.name)));

  function functionQ(level) {
    const n = R.pick(NUTRIENT_WEIGHTED);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `Give the <b>function</b> of <b>${n.name}</b> in the body.`,
        answer: ch(n.job, NUTRIENTS.map((x) => x.job), 4),
        hint: '"Function" means the job it does inside the body — not which foods it is in.',
        working: [`"Give the function" = say what it <b>does</b> for the body.`, `${cap(n.name)} ${n.job}.`],
        finalAnswer: `${cap(n.name)} ${n.job}`, skill: 'q1-function',
      };
    }
    if (form === 2) {
      return {
        prompt: `Fill in the missing word: ${n.cloze.replace('____', '<b>______</b>')}`,
        answer: textAns(n.key, n.keyAccept, 'one word'),
        hint: `Say the whole job of ${n.name} out loud, then pick the word that fits the gap.`,
        working: [`${cap(n.name)} ${n.job}.`, `So the missing word is <b>${n.key}</b>.`],
        finalAnswer: n.key, skill: 'q1-function',
      };
    }
    return {
      prompt: `Which nutrient has this job? "<i>${cap(n.job.replace(/^(is|are|gives|store|carries) /, (m) => m))}</i>"`,
      answer: textAns(n.name.split(' ')[0], n.name === 'fats (lipids)' ? ['fat', 'lipids', 'lipid', 'fats and oils'] : n.name === 'carbohydrate' ? ['carbohydrates', 'carbs'] : n.name === 'vitamins' ? ['vitamin'] : n.name === 'minerals' ? ['mineral'] : n.name === 'protein' ? ['proteins'] : [], 'one word'),
      hint: 'Seven groups: carbohydrate, protein, fats, vitamins, minerals, fibre, water.',
      working: ['Run down the seven nutrient groups and match the job.', `That job belongs to <b>${n.name}</b>.`],
      finalAnswer: n.name, skill: 'q1-function',
    };
  }

  /* ---------- Q2 the food test table ---------- */
  const TESTS = [
    { nutrient: 'starch', reagent: 'iodine solution', start: 'orange-brown', pos: 'blue-black', heat: 'no',
      rAccept: ['iodine'], pAccept: ['blue black', 'black', 'dark blue', 'blue-black colour'] },
    { nutrient: 'glucose', reagent: "Benedict's solution", start: 'blue', pos: 'brick red', heat: 'yes — hot water bath',
      rAccept: ["benedict's", 'benedicts', 'benedicts solution'], pAccept: ['brick-red', 'red', 'orange-red', 'orange', 'red-orange'] },
    { nutrient: 'protein', reagent: 'Biuret solution', start: 'blue', pos: 'purple', heat: 'no',
      rAccept: ['biuret', 'biuret reagent', 'copper sulfate and sodium hydroxide', 'copper sulphate and sodium hydroxide'], pAccept: ['lilac', 'violet', 'mauve', 'purple colour'] },
    { nutrient: 'fat (lipid)', reagent: 'ethanol, then pour into water', start: 'clear', pos: 'cloudy white (an emulsion)', heat: 'no',
      rAccept: ['ethanol', 'alcohol', 'the ethanol test', 'ethanol emulsion'], pAccept: ['cloudy', 'cloudy white', 'milky', 'white', 'milky white', 'an emulsion', 'emulsion'] },
  ];
  /** protein and fat were the shaky rows, so they come up more */
  const TESTS_WEIGHTED = TESTS.concat([TESTS[2], TESTS[3]]);
  const testTable = (blankRow, blankCol) => table(['Nutrient', 'Test chemical', 'Colour at start', 'Colour if present', 'Heat?'],
    TESTS.map((t, i) => [t.nutrient, t.reagent, t.start, t.pos, t.heat].map((c, j) => (i === blankRow && j === blankCol ? null : c))));

  function foodTestTableQ(level) {
    const t = R.pick(TESTS_WEIGHTED);
    const row = TESTS.indexOf(t);
    const col = level === 1 ? R.pick([1, 3]) : R.pick([1, 3, 3, 4, 2]);
    const colName = ['', 'test chemical', 'colour at the start', 'colour if the nutrient is present', 'heat'][col];
    if (col === 1) {
      return {
        visual: testTable(row, 1),
        prompt: `Fill in the missing box: which <b>test chemical</b> is used for <b>${t.nutrient}</b>?`,
        answer: textAns(t.reagent.split(/,| then/)[0].replace(' solution', ''), t.rAccept.concat([t.reagent]), 'name the chemical'),
        hint: 'Starch → iodine · glucose → Benedict\'s · protein → Biuret · fat → ethanol.',
        working: ['Read across the row: nutrient first, then its test chemical.', `${cap(t.nutrient)} is tested with <b>${t.reagent}</b>.`],
        finalAnswer: t.reagent, skill: 'q2-tests',
      };
    }
    if (col === 3) {
      return {
        visual: testTable(row, 3),
        prompt: `Fill in the missing box: what colour shows that <b>${t.nutrient}</b> is present?`,
        answer: textAns(t.pos.split(' (')[0], t.pAccept, 'a colour'),
        hint: `It starts ${t.start}. What does it turn into when the test is positive?`,
        working: [`${cap(t.reagent)} starts <b>${t.start}</b>.`, `If ${t.nutrient} is there it turns <b>${t.pos}</b>.`],
        finalAnswer: t.pos, skill: 'q2-tests',
      };
    }
    if (col === 2) {
      return {
        visual: testTable(row, 2),
        prompt: `Fill in the missing box: what colour is the <b>${t.reagent.split(',')[0]}</b> before anything happens?`,
        answer: ch(t.start, ['orange-brown', 'blue', 'clear', 'green', 'purple'], 4),
        hint: 'This is the colour you would see if the food had none of that nutrient.',
        working: [`A negative result means no colour change — it stays its starting colour.`, `${cap(t.reagent.split(',')[0])} starts <b>${t.start}</b>.`],
        finalAnswer: t.start, skill: 'q2-tests',
      };
    }
    return {
      visual: testTable(row, 4),
      prompt: `Fill in the missing box: does the test for <b>${t.nutrient}</b> need heating?`,
      answer: ch(t.heat === 'no' ? 'no' : 'yes — in a hot water bath', ['no', 'yes — in a hot water bath', 'yes — straight in a Bunsen flame'], 3),
      hint: 'Only one of the four tests is heated.',
      working: ["Only the <b>Benedict's</b> test (glucose) is heated, in a hot water bath.", `So for ${t.nutrient}: <b>${t.heat}</b>.`],
      finalAnswer: t.heat, skill: 'q2-tests',
    };
  }

  /* ---------- Q3 the deficiency table: the nutrient goes in the nutrient box ---------- */
  const DEFICIENCY = [
    { disease: 'scurvy', nutrient: 'vitamin C', symptoms: 'bleeding gums, bruising, tiredness, cuts that heal slowly', treat: 'oranges, lemons, kiwifruit', nAccept: ['vit c', 'vitamin c (ascorbic acid)', 'ascorbic acid'] },
    { disease: 'rickets', nutrient: 'vitamin D', symptoms: 'soft, weak bones and bowed legs', treat: 'sunlight, oily fish, eggs, milk', nAccept: ['vit d', 'vitamin d and calcium', 'calcium and vitamin d'] },
    { disease: 'anaemia', nutrient: 'iron', symptoms: 'tiredness, pale skin, short of breath', treat: 'red meat, spinach, beans', nAccept: ['iron (a mineral)'] },
    { disease: 'goitre', nutrient: 'iodine', symptoms: 'a swollen lump in the neck (the thyroid gland)', treat: 'iodised salt, seafood, bread made with iodised salt', nAccept: ['iodine (a mineral)'] },
    { disease: 'night blindness', nutrient: 'vitamin A', symptoms: 'cannot see well in dim light', treat: 'carrots, sweet potato, liver', nAccept: ['vit a'] },
    { disease: 'kwashiorkor', nutrient: 'protein', symptoms: 'swollen belly, thin arms and legs, poor growth', treat: 'meat, fish, eggs, beans, milk', nAccept: ['proteins'] },
  ];
  const DEF_WEIGHTED = DEFICIENCY.concat([DEFICIENCY[0], DEFICIENCY[0]]);
  const defTable = (d, blank) => table(['Deficiency', 'Nutrient missing', 'Symptoms', 'Treatment (foods)'],
    [[d.disease, d.nutrient, d.symptoms, d.treat].map((c, j) => (j === blank ? null : c))]);

  function deficiencyTableQ(level) {
    const d = R.pick(DEF_WEIGHTED);
    const blank = level === 1 ? 1 : R.pick([1, 1, 0, 2, 3]);
    if (blank === 1) {
      // the trap she fell into: putting the food (or nothing) where the nutrient belongs
      return {
        visual: defTable(d, 1),
        prompt: `Fill in the <b>Nutrient missing</b> box for ${d.disease}.`,
        answer: ch(d.nutrient, [d.treat.split(', ')[0], d.treat.split(', ')[1] || 'fresh fruit', 'a balanced diet', DEFICIENCY.find((x) => x !== d).nutrient], 4),
        hint: 'This box wants a NUTRIENT (a vitamin, a mineral or protein) — not a food. Foods go in the Treatment box.',
        working: ['"Nutrient missing" = the vitamin, mineral or other nutrient the body is short of.', `${cap(d.disease)} is caused by too little <b>${d.nutrient}</b>.`, `The foods (${d.treat}) belong in the <b>Treatment</b> box instead.`],
        finalAnswer: d.nutrient, skill: 'q3-deficiency',
      };
    }
    if (blank === 0) {
      return {
        visual: defTable(d, 0),
        prompt: 'Fill in the missing box: what is the name of this <b>deficiency disease</b>?',
        answer: textAns(d.disease, d.disease === 'anaemia' ? ['anemia'] : d.disease === 'goitre' ? ['goiter'] : [], 'name the disease'),
        hint: `Which disease comes from too little ${d.nutrient}?`,
        working: [`Too little <b>${d.nutrient}</b> → <b>${d.disease}</b>.`],
        finalAnswer: d.disease, skill: 'q3-deficiency',
      };
    }
    if (blank === 2) {
      return {
        visual: defTable(d, 2),
        prompt: `Fill in the missing box: what are the <b>symptoms</b> of ${d.disease}?`,
        answer: ch(d.symptoms, DEFICIENCY.map((x) => x.symptoms), 4),
        hint: `Think what ${d.nutrient} normally does for the body. What goes wrong without it?`,
        working: [`${cap(d.disease)} (too little ${d.nutrient}): <b>${d.symptoms}</b>.`],
        finalAnswer: d.symptoms, skill: 'q3-deficiency',
      };
    }
    return {
      visual: defTable(d, 3),
      prompt: `Fill in the missing box: which <b>foods</b> would treat ${d.disease}?`,
      answer: ch(d.treat, DEFICIENCY.map((x) => x.treat), 4),
      hint: `Which foods are packed with ${d.nutrient}?`,
      working: [`To treat ${d.disease}, eat foods rich in <b>${d.nutrient}</b>: ${d.treat}.`],
      finalAnswer: d.treat, skill: 'q3-deficiency',
    };
  }

  /* ---------- Q4 examples of each nutrient type (yoghurt is not a carbohydrate) ---------- */
  const FOODS = [
    { food: 'bread', also: ['fibre'], group: 'carbohydrate' }, { food: 'rice', group: 'carbohydrate' }, { food: 'pasta', group: 'carbohydrate' },
    { food: 'potato', also: ['vitamins'], group: 'carbohydrate' }, { food: 'kūmara', also: ['fibre','vitamins'], group: 'carbohydrate' }, { food: 'breakfast cereal', also: ['fibre'], group: 'carbohydrate' },
    { food: 'yoghurt', also: ['minerals'], group: 'protein', note: 'yoghurt is a dairy food: mostly protein and calcium (a mineral) — not a carbohydrate' },
    { food: 'eggs', group: 'protein' }, { food: 'chicken', also: ['fat'], group: 'protein' }, { food: 'fish', also: ['fat','minerals'], group: 'protein' },
    { food: 'lentils', also: ['fibre','carbohydrate'], group: 'protein' }, { food: 'tofu', group: 'protein' },
    { food: 'butter', group: 'fat' }, { food: 'olive oil', group: 'fat' }, { food: 'cream', group: 'fat' }, { food: 'avocado', also: ['vitamins','fibre'], group: 'fat' },
    { food: 'oranges', also: ['fibre','carbohydrate'], group: 'vitamins' }, { food: 'kiwifruit', also: ['fibre'], group: 'vitamins' }, { food: 'carrots', also: ['fibre'], group: 'vitamins' },
    { food: 'milk', also: ['protein','fat'], group: 'minerals', note: 'milk is rich in calcium, a mineral (it also has protein)' }, { food: 'red meat', also: ['protein','fat'], group: 'minerals', note: 'red meat is rich in iron, a mineral (it also has protein)' },
    { food: 'bananas', also: ['carbohydrate','fibre','vitamins'], group: 'minerals', note: 'bananas are rich in potassium, a mineral' },
    { food: 'bran flakes', also: ['carbohydrate'], group: 'fibre' }, { food: 'wholemeal bread', also: ['carbohydrate'], group: 'fibre' }, { food: 'broccoli', also: ['vitamins','minerals'], group: 'fibre' },
  ];
  /** true when the food is a fair answer for that group, even if it is not its main one */
  const fits = (f, g) => f.group === g || (f.also || []).includes(g);
  const GROUPS = ['carbohydrate', 'protein', 'fat', 'vitamins', 'minerals', 'fibre'];
  const GROUP_ACCEPT = {
    carbohydrate: ['carbohydrates', 'carbs', 'carb', 'starch'], protein: ['proteins'], fat: ['fats', 'lipid', 'lipids', 'fats and oils'],
    vitamins: ['vitamin', 'vitamin c'], minerals: ['mineral', 'calcium', 'iron', 'potassium'], fibre: ['fiber'],
  };

  function foodGroupQ(level) {
    const form = R.int(1, 3);
    if (form === 1) {
      // the one that is NOT in the group — yoghurt turns up often, because that is the mark she lost
      const odd = R.chance(0.5) ? FOODS.find((f) => f.food === 'yoghurt') : R.pick(FOODS.filter((f) => !fits(f, 'carbohydrate')));
      const carbs = R.sample(FOODS.filter((f) => f.group === 'carbohydrate'), 3).map((f) => f.food);
      return {
        prompt: 'Which of these is <b>NOT</b> a good example of a carbohydrate food?',
        answer: ch(odd.food, carbs, 4),
        hint: 'Carbohydrate foods are the starchy and sugary ones — breads, cereals, rice, pasta, potatoes.',
        working: ['Carbohydrate foods are starchy: bread, rice, pasta, potato, kūmara, cereal.', `<b>${cap(odd.food)}</b> is the odd one out — ${odd.note || `it is mainly ${odd.group}`}.`],
        finalAnswer: odd.food, skill: 'q4-examples',
      };
    }
    const f = form === 2 && R.chance(0.4) ? FOODS.find((x) => x.food === 'yoghurt') : R.pick(FOODS);
    if (form === 2) {
      return {
        prompt: `<b>${cap(f.food)}</b> is mainly a source of which type of nutrient?`,
        answer: ch(f.group, GROUPS.filter((g) => !fits(f, g) || g === f.group), 4),
        hint: 'Ask: is it starchy? from an animal or a bean? oily? a fruit or veg? Dairy foods are protein and calcium.',
        working: [`${cap(f.food)} → <b>${f.group}</b>.`].concat(f.note ? [cap(f.note) + '.'] : []),
        finalAnswer: f.group, skill: 'q4-examples',
      };
    }
    const g = R.pick(GROUPS);
    const right = R.pick(FOODS.filter((x) => x.group === g));
    return {
      prompt: `Give an example of a food that is a good source of <b>${g}</b>.`,
      answer: ch(right.food, FOODS.filter((x) => !fits(x, g)).map((x) => x.food), 4),
      hint: 'Match the food to the job: energy, growth and repair, warmth, keep healthy, build bones and blood, keep food moving.',
      working: [`Good sources of ${g}: ${FOODS.filter((x) => x.group === g).map((x) => x.food).join(', ')}.`],
      finalAnswer: right.food, skill: 'q4-examples',
    };
  }

  /* ---------- Q5 the nutrition label: what is on it, and what is missing ---------- */
  const LABEL_POOL = [
    { row: 'Energy', unit: 'kJ', group: null },
    { row: 'Protein', unit: 'g', group: 'protein' },
    { row: 'Fat, total', unit: 'g', group: 'fats (lipids)' },
    { row: '– saturated', unit: 'g', group: 'fats (lipids)' },
    { row: 'Carbohydrate', unit: 'g', group: 'carbohydrate' },
    { row: '– sugars', unit: 'g', group: 'carbohydrate' },
    { row: 'Dietary fibre', unit: 'g', group: 'fibre' },
    { row: 'Sodium', unit: 'mg', group: 'minerals', mineral: 'sodium' },
    { row: 'Potassium', unit: 'mg', group: 'minerals', mineral: 'potassium' },
    { row: 'Calcium', unit: 'mg', group: 'minerals', mineral: 'calcium' },
    { row: 'Iron', unit: 'mg', group: 'minerals', mineral: 'iron' },
    { row: 'Vitamin C', unit: 'mg', group: 'vitamins', vitamin: 'vitamin C' },
  ];
  const SEVEN = ['carbohydrate', 'protein', 'fats (lipids)', 'vitamins', 'minerals', 'fibre', 'water'];
  const PRODUCTS = ['muesli bar', 'breakfast cereal', 'fruit yoghurt', 'sports drink', 'crackers', 'baked beans'];
  function makeLabel() {
    // always energy, protein, fat, carbohydrate, sodium (the legal five); then a random extra few
    const base = [0, 1, 2, 4, 7];
    const extras = R.sample([3, 5, 6, 8, 9, 10, 11], R.int(1, 3));
    const idx = base.concat(extras).sort((a, b) => a - b);
    const rows = idx.map((i) => LABEL_POOL[i]);
    const vals = rows.map((r) => (r.unit === 'kJ' ? R.pick([420, 760, 1450, 1680]) : r.unit === 'mg' ? R.pick([12, 45, 120, 230, 380]) : R.pick([0.4, 1.2, 3.5, 6.8, 12, 24])));
    const name = R.pick(PRODUCTS);
    const html = `<div style="text-align:center"><b>NUTRITION INFORMATION — ${name}</b><br><small>average quantity per 100 g</small></div>` +
      table(['', 'Per 100 g'], rows.map((r, i) => [r.row, `${vals[i]} ${r.unit}`]));
    const present = Array.from(new Set(rows.map((r) => r.group).filter(Boolean)));
    return { rows, html, present, missing: SEVEN.filter((g) => !present.includes(g)), name };
  }

  function labelQ(level) {
    const L = makeLabel();
    const form = level === 1 ? R.pick([1, 2, 3]) : R.int(1, 4);
    if (form === 1) {
      const miss = R.pick(L.missing);
      return {
        visual: L.html,
        prompt: 'Compare this label with the <b>seven nutrient groups</b>. Which group is <b>missing</b> from the label?',
        answer: ch(miss, L.present, 4),
        hint: 'Write the seven groups down first: carbohydrate, protein, fats (lipids), vitamins, minerals, fibre, water. Tick each one you can find on the label. "Fat" is the same thing as lipids.',
        working: ['Seven groups: carbohydrate, protein, fats (lipids), vitamins, minerals, fibre, water.', `On this label: ${L.present.join(', ')}.`, `Not on it: <b>${L.missing.join(', ')}</b>.`, '"Fat, total" counts as lipids — fats and lipids are the same group.'],
        finalAnswer: miss, skill: 'q5-label',
      };
    }
    if (form === 2) {
      return {
        visual: L.html,
        prompt: 'A student says "<b>lipids</b> are missing from this label". Are they right?',
        answer: ch('No — lipids are fats, and "Fat, total" is on the label', ['Yes — the word lipids is not on the label', 'Yes — lipids are a kind of protein', 'No — lipids are a kind of carbohydrate'], 4),
        hint: 'What is another word for fats and oils?',
        working: ['<b>Lipids</b> is the science word for <b>fats and oils</b>.', 'The label has a "Fat, total" row, so lipids are there.'],
        finalAnswer: 'No — lipids = fats, and fat is on the label', skill: 'q5-label',
      };
    }
    if (form === 3) {
      const shown = L.rows.filter((r) => r.mineral);
      const m = R.pick(shown);
      return {
        visual: L.html,
        prompt: '"Minerals" is too general for full marks. <b>Name one specific mineral</b> that is on this label.',
        answer: textAns(m.mineral, shown.map((r) => r.mineral), 'name the mineral'),
        hint: 'Minerals on labels are listed by name: sodium, potassium, calcium, iron…',
        working: ['Look for rows measured in <b>mg</b> that are not vitamins.', `Minerals on this label: <b>${shown.map((r) => r.mineral).join(', ')}</b>.`],
        finalAnswer: shown.map((r) => r.mineral).join(' or '), skill: 'q5-label',
      };
    }
    const absentMinerals = ['potassium', 'calcium', 'iron'].filter((x) => !L.rows.some((r) => r.mineral === x));
    if (absentMinerals.length) {
      const am = R.pick(absentMinerals);
      return {
        visual: L.html,
        prompt: 'Which <b>specific mineral</b> is NOT listed on this label?',
        answer: ch(am, L.rows.filter((r) => r.mineral).map((r) => r.mineral).concat(['protein', 'vitamin C'].filter((x) => !L.rows.some((r) => r.row === cap(x) || r.vitamin === x))), 4),
        hint: 'Minerals: sodium, potassium, calcium, iron. Protein and vitamins are not minerals.',
        working: [`Minerals listed: ${L.rows.filter((r) => r.mineral).map((r) => r.mineral).join(', ')}.`, `<b>${cap(am)}</b> is a mineral that is not there.`],
        finalAnswer: am, skill: 'q5-label',
      };
    }
    return {
      visual: L.html,
      prompt: 'Sodium, potassium, calcium and iron all belong to which nutrient group?',
      answer: textAns('minerals', ['mineral'], 'one word'),
      hint: 'They come out of the ground, and they are measured in milligrams.',
      working: ['Sodium, potassium, calcium and iron are all <b>minerals</b>.'],
      finalAnswer: 'minerals', skill: 'q5-label',
    };
  }

  /* ---------- Q6 FEATURES of living things, not EXAMPLES of them ---------- */
  const MRSGREN = [
    { word: 'Movement', mean: 'moving all or part of the body' },
    { word: 'Respiration', mean: 'releasing energy from food' },
    { word: 'Sensitivity', mean: 'sensing and responding to changes around it' },
    { word: 'Growth', mean: 'getting bigger' },
    { word: 'Reproduction', mean: 'making new living things like itself' },
    { word: 'Excretion', mean: 'getting rid of waste' },
    { word: 'Nutrition', mean: 'taking in or making food' },
  ];
  const EXAMPLES = ['yeast', 'bacteria', 'fungi', 'seeds', 'a tree', 'a kiwi', 'a mushroom', 'mould'];
  const FEATURE_WORDING = [
    'Give a <b>feature</b> of living organisms.',
    'Name one <b>characteristic</b> that all living things share.',
    'State one <b>life process</b> carried out by every living organism.',
    'What is one <b>sign</b> that something is alive?',
  ];

  function featuresQ(level) {
    const m = R.pick(MRSGREN);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        visual: '<div style="max-width:320px;text-align:left;font-size:.95rem">⚠️ <b>Feature</b> = something living things <b>do</b>.<br><b>Example</b> = a living thing.</div>',
        prompt: R.pick(FEATURE_WORDING),
        answer: ch(`${m.word} — ${m.mean}`, R.sample(EXAMPLES, 3).map((e) => `${cap(e)} — it is alive`), 4),
        hint: 'The question wants a FEATURE — one of the seven things in MRS GREN — not the name of a living thing.',
        working: ['"Feature / characteristic / life process / sign of life" all mean the same thing: <b>MRS GREN</b>.', 'Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.', `So: <b>${m.word}</b> — ${m.mean}. Yeast, bacteria and seeds are <b>examples</b> of living things, not features.`],
        finalAnswer: `${m.word} — ${m.mean}`, skill: 'q6-mrsgren',
      };
    }
    if (form === 2) {
      return {
        prompt: 'A question says "<b>Give features of living organisms</b>". Which answer is the right <b>kind</b> of answer?',
        answer: ch('Growth, reproduction and excretion', ['Yeast, fungi, bacteria and seeds', 'Plants, animals and humans', 'Microscopes, Petri dishes and agar'], 4),
        hint: 'Features are things living things DO. A list of living things is the wrong kind of answer.',
        working: ['Features = MRS GREN processes.', 'Yeast, fungi, bacteria and seeds are <b>examples</b> of living things — that answers a different question.', 'So the answer is <b>growth, reproduction and excretion</b>.'],
        finalAnswer: 'Growth, reproduction and excretion', skill: 'q6-mrsgren',
      };
    }
    return {
      prompt: `MRS GREN: which life process means <b>${m.mean}</b>?`,
      answer: textAns(m.word.toLowerCase(), [], 'one word'),
      hint: 'Movement · Respiration · Sensitivity · Growth · Reproduction · Excretion · Nutrition.',
      working: [`${m.mean} = <b>${m.word}</b>.`],
      finalAnswer: m.word, skill: 'q6-mrsgren',
    };
  }

  /* ---------- Q7 features shared by microbes ---------- */
  const MICROBE_TRUE = [
    'they are microscopic — far too small to see without a microscope',
    'they reproduce very quickly when conditions are right',
    'they are found almost everywhere — in air, water, soil and inside us',
    'they need food, water and warmth to grow',
    'some are helpful and some are harmful',
  ];
  const MICROBE_FALSE = [
    'they are all harmful and cause disease',
    'they can all be seen with just your eyes',
    'they are all bacteria',
    'they can all be killed with antibiotics',
    'they only live in dirty places',
  ];
  function microbeFeatureQ(level) {
    if (R.chance(0.5)) {
      const t = R.pick(MICROBE_TRUE);
      return {
        prompt: 'Which of these is a feature that <b>microbes have in common</b>?',
        answer: ch(t, MICROBE_FALSE, 4),
        hint: 'Bacteria, viruses and fungi are very different — pick the thing that is true for all of them.',
        working: ['Common features of microbes: microscopic · reproduce quickly · found everywhere · need food, water and warmth · some helpful, some harmful.', `So: <b>${t}</b>.`],
        finalAnswer: t, skill: 'q7-features',
      };
    }
    const f = R.pick(MICROBE_FALSE);
    return {
      prompt: 'Which statement about microbes is <b>FALSE</b>?',
      answer: ch(f, MICROBE_TRUE, 4),
      hint: 'Three of these are true for all microbes. Find the one that is not.',
      working: [`"${cap(f)}" is false.`, 'Most microbes are harmless or useful, antibiotics only work on bacteria, and you need a microscope to see them.'],
      finalAnswer: f, skill: 'q7-features',
    };
  }

  /* ---------- Q8 / Q9 helpful and harmful microbes, with "other than" in the wording ---------- */
  const HELPFUL = [
    'yeast (makes bread rise)', 'bacteria that turn milk into yoghurt and cheese', 'Penicillium mould (gives us the antibiotic penicillin)',
    'decomposer bacteria and fungi (break down dead things in compost)', 'gut bacteria (help digest food)',
  ];
  const HARMFUL = [
    'the influenza (flu) virus', 'the measles virus', 'Salmonella bacteria (food poisoning)', 'Streptococcus bacteria (strep throat)',
    "the fungus that causes athlete's foot", 'norovirus (vomiting bug)', 'the tuberculosis (TB) bacterium',
  ];
  const BANNED = [
    { word: 'COVID-19', item: 'the COVID-19 virus', list: 'harmful' },
    { word: 'the flu', item: 'the influenza (flu) virus', list: 'harmful' },
    { word: 'yeast', item: 'yeast (makes bread rise)', list: 'helpful' },
  ];
  const EXCLUDE = ['other than', 'apart from', 'besides', 'not including'];

  function otherThanQ(level) {
    const b = R.pick(BANNED);
    const phrase = R.pick(EXCLUDE);
    const pool = (b.list === 'harmful' ? HARMFUL : HELPFUL).filter((x) => x !== b.item);
    const right = R.pick(pool);
    const other = b.list === 'harmful' ? HELPFUL : HARMFUL;
    return {
      prompt: `Name a <b>${b.list}</b> microbe <u>${phrase} ${b.word}</u>.`,
      answer: ch(right, [b.item].concat(R.sample(other, 2)), 4),
      hint: `Two traps: "${phrase} ${b.word}" means ${b.word} does not count, and the microbe must be ${b.list}.`,
      working: [`Underline the trap words: <b>${b.list}</b> and <b>${phrase} ${b.word}</b>.`, `${cap(b.item)} is ruled out by the question.`, `A ${b.list} one that is allowed: <b>${right}</b>.`],
      finalAnswer: right, skill: 'q9-otherthan',
    };
  }
  function helpfulHarmfulQ(level) {
    const helpful = R.chance(0.5);
    const right = R.pick(helpful ? HELPFUL : HARMFUL.concat(['the COVID-19 virus']));
    return {
      prompt: `Which of these is a <b>${helpful ? 'helpful' : 'harmful'}</b> microbe?`,
      answer: ch(right, R.sample(helpful ? HARMFUL : HELPFUL, 3), 4),
      hint: helpful ? 'Helpful microbes make food, medicine or break down waste.' : 'Harmful microbes (pathogens) cause disease.',
      working: [helpful ? 'Helpful: yeast, yoghurt bacteria, Penicillium, decomposers, gut bacteria.' : 'Harmful (pathogens): flu, measles, COVID-19, Salmonella, strep, TB, athlete\'s foot fungus.', `Answer: <b>${right}</b>.`],
      finalAnswer: right, skill: helpful ? 'q8-helpful' : 'q9-harmful',
    };
  }

  /* ---------- Q10 the body's NATURAL defences vs things people do ---------- */
  const NATURAL = [
    { d: 'skin', how: 'a tough barrier that stops microbes getting in', line: 'first' },
    { d: 'mucus and cilia in the nose and airways', how: 'mucus traps microbes and tiny hairs (cilia) sweep them out', line: 'first' },
    { d: 'stomach acid', how: 'kills most microbes swallowed with food', line: 'first' },
    { d: 'tears and saliva', how: 'wash microbes away and contain a chemical (lysozyme) that kills bacteria', line: 'first' },
    { d: 'blood clotting (a scab)', how: 'seals a cut so microbes cannot get in', line: 'first' },
    { d: 'white blood cells called phagocytes', how: 'engulf (swallow) and digest microbes', line: 'second' },
    { d: 'white blood cells called lymphocytes', how: 'make antibodies that stick to a microbe and mark it for destruction', line: 'second' },
    { d: 'a fever', how: 'raises the body temperature so microbes cannot multiply as fast', line: 'second' },
  ];
  const WE_DO = ['washing your hands', 'staying home when you are sick', 'wearing a mask', 'getting vaccinated', 'cooking food properly', 'coughing into your elbow', 'cleaning benches with disinfectant'];

  function defenceQ(level) {
    const form = R.int(1, level === 1 ? 3 : 4);
    if (form === 1) {
      const n = R.pick(NATURAL);
      return {
        prompt: 'Which of these is one of the body\'s <b>natural</b> defences against disease?',
        answer: ch(n.d, R.sample(WE_DO, 3), 4),
        hint: '"Natural defence" = something your body does by itself, without you doing anything.',
        working: ['Natural defences are built into the body. Hand washing, masks and staying home are things <b>people do</b> — they are prevention, not natural defences.', `<b>${cap(n.d)}</b>: ${n.how}.`],
        finalAnswer: n.d, skill: 'q10-defence',
      };
    }
    if (form === 2) {
      const w = R.pick(WE_DO);
      return {
        prompt: 'Which of these is <b>NOT</b> a natural defence of the body?',
        answer: ch(w, R.sample(NATURAL, 3).map((x) => x.d), 4),
        hint: 'Three of these happen inside your body on their own. One is something you choose to do.',
        working: [`<b>${cap(w)}</b> is something people do to prevent disease — it is not part of the body.`],
        finalAnswer: w, skill: 'q10-defence',
      };
    }
    if (form === 3) {
      const n = R.pick(NATURAL);
      return {
        prompt: `How does <b>${n.d}</b> protect the body?`,
        answer: ch(n.how, NATURAL.filter((x) => x !== n).map((x) => x.how), 4),
        hint: 'First line = stop microbes getting in. Second line = white blood cells fight the ones that do.',
        working: [`${cap(n.d)}: <b>${n.how}</b>.`],
        finalAnswer: n.how, skill: 'q10-defence',
      };
    }
    const n = R.pick(NATURAL);
    return {
      prompt: `Is <b>${n.d}</b> part of the <b>first</b> line of defence or the <b>second</b>?`,
      answer: ch(n.line === 'first' ? 'first line — it stops microbes getting in' : 'second line — it fights microbes that are already inside',
        ['first line — it stops microbes getting in', 'second line — it fights microbes that are already inside'], 2),
      hint: 'First line = barriers on the outside. Second line = fighting inside the body.',
      working: ['First line: skin, mucus and cilia, stomach acid, tears, scabs.', 'Second line: white blood cells (phagocytes, lymphocytes making antibodies) and fever.', `${cap(n.d)} → <b>${n.line} line</b>.`],
      finalAnswer: `${n.line} line`, skill: 'q10-defence',
    };
  }

  /* ---------- Q11 COVID-19 case study: herd immunity and reading a data table ---------- */
  const HERD = [
    { p: 'What is <b>herd immunity</b>?', a: 'When enough people in a community are immune that the disease cannot spread easily, so even people who are not immune are protected',
      w: ['When a herd of animals catches a disease from people', 'When one person is immune to every disease', 'When everybody in a country catches the disease at once'] },
    { p: 'Why does herd immunity protect a newborn baby who is too young to be vaccinated?', a: 'The people around the baby are immune, so the virus cannot reach the baby',
      w: ['The baby is born with every antibody it will ever need', 'Babies cannot catch viruses', 'The vaccine passes through the air to the baby'] },
    { p: 'Which people <b>depend</b> on herd immunity the most?', a: 'People who cannot be vaccinated — tiny babies, and people who are very sick or have a weak immune system',
      w: ['Healthy adults who are already vaccinated', 'Doctors and nurses only', 'Nobody — herd immunity does not really exist'] },
    { p: 'Why does herd immunity stop working if too few people are vaccinated?', a: 'The virus can find enough people who are not immune to keep spreading from person to person',
      w: ['The vaccine stops working in people who are vaccinated', 'The virus becomes too big to spread', 'Herd immunity only works in winter'] },
    { p: 'How does a vaccine make a person immune?', a: 'It contains a harmless (dead, weakened or part of a) microbe, so white blood cells make antibodies and memory cells without the person getting ill',
      w: ['It contains antibiotics that kill the virus', 'It kills every microbe in the body', 'It makes the skin too thick for viruses to get through'] },
    { p: 'What is a <b>pathogen</b>?', a: 'A microbe that causes disease', w: ['Any living thing in a Petri dish', 'A medicine that kills bacteria', 'A white blood cell'] },
  ];
  function herdQ(level) {
    const h = R.pick(HERD);
    return {
      prompt: h.p, answer: ch(h.a, h.w, 4),
      hint: 'Think about the whole community, not just one person.',
      working: [`Answer: <b>${h.a}</b>.`],
      finalAnswer: h.a, skill: 'q11-herd',
    };
  }
  function makeCovidTable() {
    const months = ['March', 'April', 'May', 'June', 'July'];
    const start = R.pick([10, 15, 20]);
    const step = R.pick([15, 20]);
    const vacc = months.map((_, i) => Math.min(95, start + i * step));
    const top = R.pick([1800, 2400, 3000]);
    const fall = R.pick([0.6, 0.5]);
    const cases = vacc.map((_, i) => Math.round((top * Math.pow(fall, i)) / 10) * 10);
    return { months, vacc, cases, html: table(['Month', '% of people fully vaccinated', 'New COVID-19 cases per week'], months.map((m, i) => [m, `${vacc[i]}%`, cases[i].toLocaleString('en-NZ')])) };
  }
  function covidTableQ(level) {
    const T = makeCovidTable();
    const form = level === 1 ? R.int(1, 2) : R.int(1, 5);
    if (form === 1) {
      return {
        visual: T.html,
        prompt: 'In which month were there the <b>most</b> new cases per week?',
        answer: textAns(T.months[0].toLowerCase(), [T.months[0]], 'a month'),
        hint: 'Run your finger down the cases column and find the biggest number.',
        working: [`Biggest number in the cases column: <b>${T.cases[0]}</b>, in <b>${T.months[0]}</b>.`],
        finalAnswer: T.months[0], skill: 'q11-data',
      };
    }
    if (form === 2) {
      const i = R.int(1, 4);
      return {
        visual: T.html,
        prompt: `What percentage of people were fully vaccinated in <b>${T.months[i]}</b>?`,
        answer: { type: 'number', value: T.vacc[i], unit: '%' },
        hint: 'Find the row for that month, then read across to the vaccinated column.',
        working: [`${T.months[i]} row → vaccinated column: <b>${T.vacc[i]}%</b>.`],
        finalAnswer: `${T.vacc[i]}%`, skill: 'q11-data',
      };
    }
    if (form === 3) {
      return {
        visual: T.html,
        prompt: 'Describe the <b>pattern</b> in this table.',
        answer: ch('As the percentage of people vaccinated went up, the number of new cases went down',
          ['As the percentage vaccinated went up, the number of cases went up too', 'The number of cases stayed the same every month', 'Fewer people were vaccinated each month'], 4),
        hint: 'A pattern answer links the two columns: "As ___ went up, ___ went ___".',
        working: [`Vaccinated: ${T.vacc[0]}% → ${T.vacc[4]}% (going <b>up</b>).`, `Cases: ${T.cases[0]} → ${T.cases[4]} (going <b>down</b>).`, 'So: <b>as vaccination went up, new cases went down</b>.'],
        finalAnswer: 'As vaccination went up, cases went down', skill: 'q11-data',
      };
    }
    if (form === 4) {
      const a = R.int(0, 2), b = a + R.int(1, 2);
      return {
        visual: T.html,
        prompt: `By how many did the weekly cases <b>drop</b> from ${T.months[a]} to ${T.months[b]}?`,
        answer: { type: 'number', value: T.cases[a] - T.cases[b] },
        hint: 'Bigger number take away smaller number.',
        working: [`${T.months[a]}: ${T.cases[a]}. ${T.months[b]}: ${T.cases[b]}.`, `${T.cases[a]} − ${T.cases[b]} = <b>${T.cases[a] - T.cases[b]}</b>.`],
        finalAnswer: `${T.cases[a] - T.cases[b]}`, skill: 'q11-data',
      };
    }
    return {
      visual: T.html,
      prompt: 'Use the table and the idea of <b>herd immunity</b> to explain why cases fell.',
      answer: ch('As more people became immune, the virus found fewer people it could infect, so it could not spread as easily — protecting even the unvaccinated',
        ['The virus got tired and stopped working', 'Vaccinated people could not catch any illness at all, including colds', 'Fewer people were tested, so the virus disappeared'], 4),
      hint: 'Use a number from the table, then say what happens to the spread when more people are immune.',
      working: [`Vaccinated rose from ${T.vacc[0]}% to ${T.vacc[4]}%, and cases fell from ${T.cases[0]} to ${T.cases[4]}.`, 'More immune people → fewer people the virus can pass to → each sick person infects fewer others → spread slows.', 'That is <b>herd immunity</b>: it also protects people who are not vaccinated.'],
      finalAnswer: 'More people immune → virus cannot spread easily (herd immunity)', skill: 'q11-data',
    };
  }

  /* ---------- reading the question: what is it actually asking for? ---------- */
  const READ = [
    { q: 'Name three harmful microbes <u>other than COVID-19</u>.', a: 'Three disease-causing microbes, and COVID-19 is not allowed', w: ['Any three microbes, including COVID-19', 'Three facts about COVID-19', 'Three helpful microbes'] },
    { q: 'Describe the body\'s <u>natural</u> defences against disease.', a: 'What the body does by itself — skin, mucus, stomach acid, white blood cells', w: ['What people do — washing hands, staying home, wearing masks', 'Which medicines a doctor gives', 'How vaccines are made'] },
    { q: 'Give <u>features</u> of living organisms.', a: 'The life processes — MRS GREN', w: ['Examples of living things, like yeast and bacteria', 'The parts of a microscope', 'The five kingdoms'] },
    { q: 'Fill in the <u>nutrient missing</u> for scurvy.', a: 'The nutrient itself — vitamin C', w: ['The foods that fix it — oranges and lemons', 'The symptoms — bleeding gums', 'The name of the disease'] },
    { q: 'List the nutrients <u>missing from this label</u>.', a: 'Nutrient groups that do not appear on the label at all, named as specifically as possible', w: ['Every nutrient on the label', 'The nutrients with the smallest numbers', 'The ingredients list'] },
    { q: '<u>Explain</u> herd immunity.', a: 'Say what it is AND why it works — enough people immune, so the virus cannot spread', w: ['Just write the words "herd immunity"', 'Draw a herd of cows', 'Give one example of a vaccine'] },
    { q: 'Give an example of a food that is a source of <u>carbohydrate</u>.', a: 'A starchy or sugary food like bread, rice or pasta — not a dairy food like yoghurt', w: ['Any food you like', 'Yoghurt', 'A vitamin'] },
  ];
  function readingQ(level) {
    const r = R.pick(READ);
    return {
      prompt: `Exam question: "<i>${r.q}</i>" — what is this question <b>asking for</b>?`,
      answer: ch(r.a, r.w, 4),
      hint: 'Read it twice. Look at the underlined words — they decide what kind of answer gets the marks.',
      working: ['Read the question twice and underline the command word and any trap words.', `Here the key words are underlined. It wants: <b>${r.a}</b>.`],
      finalAnswer: r.a, skill: 'reading',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const d = R.pick(DEFICIENCY);
      return {
        prompt: `A patient has <b>${d.symptoms}</b>. Name the deficiency, the nutrient that is missing, and how to treat it.`,
        answer: ch(`${cap(d.disease)} — not enough ${d.nutrient} — treat with ${d.treat}`, DEFICIENCY.filter((x) => x !== d).map((x) => `${cap(x.disease)} — not enough ${x.nutrient} — treat with ${x.treat}`), 4),
        hint: 'Three parts: the disease, the NUTRIENT (not a food), then the foods.',
        working: [`Symptoms: ${d.symptoms}.`, `Disease: <b>${d.disease}</b>. Nutrient missing: <b>${d.nutrient}</b>. Treatment: <b>${d.treat}</b>.`],
        finalAnswer: `${d.disease} · ${d.nutrient} · ${d.treat}`,
      };
    },
    () => ({
      prompt: 'Harper\'s little cousin is 2 months old — too young for the measles vaccine. Explain how the rest of the family being vaccinated protects her.',
      answer: ch('If everyone around her is immune, the measles virus cannot be passed to her — that is herd immunity',
        ['The family\'s antibodies float through the air into the baby', 'Babies cannot catch measles', 'The vaccine makes the house germ-free'], 4),
      hint: 'How does a virus reach a person? Through other people.',
      working: ['Measles spreads from person to person.', 'If the people around the baby are immune, nobody can catch it and pass it on.', 'That is <b>herd immunity</b>.'],
      finalAnswer: 'Herd immunity — nobody near her can catch it and pass it on',
    }),
    () => ({
      prompt: 'A microbe gets past Harper\'s skin through a cut. Describe what her body does <b>naturally</b> next.',
      answer: ch('A scab forms; white blood cells (phagocytes) engulf the microbes, and lymphocytes make antibodies against them',
        ['She washes her hands and puts on a plaster', 'She takes antibiotics straight away', 'Nothing — the skin was the only defence'], 4),
      hint: '"Naturally" = what the body does by itself. Hand washing and plasters are things people do.',
      working: ['1. Blood clots → a <b>scab</b> seals the cut.', '2. <b>Phagocytes</b> engulf and digest microbes.', '3. <b>Lymphocytes</b> make <b>antibodies</b>; memory cells remember it for next time.'],
      finalAnswer: 'Scab, then phagocytes engulf, lymphocytes make antibodies',
    }),
    () => {
      const L = makeLabel();
      const miss = L.missing.filter((m) => m !== 'water');
      const m = miss.length ? R.pick(miss) : 'water';
      return {
        visual: L.html,
        prompt: `Harper wants the <b>${L.name}</b> to give her every nutrient group. Using the label, which group would she still need from other food?`,
        answer: ch(m, L.present, 4),
        hint: 'Tick off the seven groups against the label. "Fat" = lipids. Sodium, calcium and so on = minerals.',
        working: [`On the label: ${L.present.join(', ')}.`, `Missing: <b>${L.missing.join(', ')}</b>.`],
        finalAnswer: m,
      };
    },
    () => ({
      prompt: 'Harper says "microbes are bad and we should get rid of all of them". Give the best reply.',
      answer: ch('No — most microbes are harmless or helpful, like yeast in bread, yoghurt bacteria and decomposers; only some are pathogens',
        ['Yes — every microbe causes disease', 'Yes — but only viruses are bad', 'No — microbes are not really alive'], 4),
      hint: 'Think of two helpful microbes.',
      working: ['Helpful: yeast, yoghurt bacteria, Penicillium, decomposers, gut bacteria.', 'Only some microbes are <b>pathogens</b> (cause disease).'],
      finalAnswer: 'Most microbes are harmless or helpful; only some are pathogens',
    }),
  ];

  /* ---------- revision notes ---------- */
  const visual = `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
    <rect x="6" y="6" width="328" height="202" rx="14" fill="#FFFFFF" stroke="#D9BE8A" stroke-width="2.5"/>
    <text x="170" y="28" text-anchor="middle" fill="${INK}" font-size="13">Before you write — read it TWICE</text>
    <rect x="22" y="42" width="296" height="34" rx="9" fill="#F7D3E2" stroke="#E0568C" stroke-width="2"/>
    <text x="34" y="64" fill="#B03068" font-size="12">1  Underline the command word</text>
    <rect x="22" y="84" width="296" height="34" rx="9" fill="#FDF3E0" stroke="#D9BE8A" stroke-width="2"/>
    <text x="34" y="106" fill="${INK}" font-size="12">2  Circle traps: other than · NOT · natural</text>
    <rect x="22" y="126" width="296" height="34" rx="9" fill="#E3F3D8" stroke="#8FC96E" stroke-width="2"/>
    <text x="34" y="148" fill="#3F6B22" font-size="12">3  What KIND of answer is it asking for?</text>
    <rect x="22" y="168" width="296" height="30" rx="9" fill="#E4F1FB" stroke="#A9D8F5" stroke-width="2"/>
    <text x="34" y="188" fill="#2E5F86" font-size="12">4  Count the marks = that many points</text>
  </svg>`;

  HL.registerTopic({
    id: 'test-review-microbes', subject: 'science', strand: 'living', order: 0,
    name: 'Test review: Nutrition & Microbes', short: 'Test review', animal: 'turtle',
    blurb: 'Every question from the Microbes test, practised the way the paper asks it.',
    example: 'scurvy → nutrient missing: vitamin C (not oranges)',
    learn: {
      what: '<p>This topic follows the 11 questions on the Microbes test, one by one. Most of the marks that were lost were not about missing knowledge — they were about <b>reading what the question wanted</b>: a nutrient instead of a food, a feature instead of an example, a natural defence instead of something people do, and "other than COVID-19". The rest were three nutrient jobs, two rows of the food test table, reading a label, reading a data table, and herd immunity.</p>',
      visual,
      facts: [
        '<b>Q1 functions.</b> Carbohydrate = energy · Protein = growth and repair · <b>Fats (lipids)</b> = store energy, keep you warm, protect organs · <b>Vitamins</b> = tiny amounts to keep the body healthy (vitamin C → gums and skin) · <b>Minerals</b> = tiny amounts to build the body (calcium → bones, iron → blood) · Fibre = keeps food moving · <b>Water</b> = transports and dissolves substances, cools you by sweating',
        '<b>Q2 food tests.</b> Starch: iodine, orange-brown → blue-black · Glucose: Benedict\'s + <b>heat</b>, blue → brick red · <b>Protein: Biuret, blue → purple</b> · <b>Fat: ethanol then water, clear → cloudy white</b>',
        '<b>Q3 deficiencies.</b> Scurvy → <b>vitamin C</b> · Rickets → vitamin D · Anaemia → iron · Goitre → iodine · Night blindness → vitamin A · Kwashiorkor → protein. The "nutrient missing" box takes the nutrient, never the food',
        '<b>Q4 examples.</b> Carbohydrate: bread, rice, pasta, potato. <b>Yoghurt is dairy — protein and calcium, not carbohydrate</b>',
        '<b>Q5 labels.</b> Fat on a label = <b>lipids</b>. Sodium, potassium, calcium, iron = <b>minerals</b> — name the specific one. Check the label against all seven groups',
        '<b>Q6 MRS GREN.</b> Features of living things = Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition. Yeast, bacteria and seeds are <b>examples</b>, not features',
        '<b>Q10 natural defences.</b> First line: skin, mucus and cilia, stomach acid, tears, scabs. Second line: phagocytes engulf, lymphocytes make antibodies, fever. Hand washing and staying home are <b>things people do</b>',
        '<b>Q11 herd immunity.</b> When enough people are immune, the virus cannot spread easily, so people who cannot be vaccinated (babies, very sick people) are protected too',
      ],
      steps: [
        'Read the question <b>twice</b>.',
        'Underline the <b>command word</b>: Name (just say it) · Describe (say what happens) · Explain (say what AND why).',
        'Circle any <b>trap words</b>: other than, apart from, NOT, natural, specific.',
        'Decide what <b>kind</b> of answer it wants: a feature, an example, a nutrient, a food, a number from the table.',
        'Look at the <b>marks</b>: 2 marks = 2 points, 3 marks = 3 points.',
        'For a table or label, <b>quote a number</b> from it in your answer.',
      ],
      examples: [
        { q: 'Give the function of fats.', working: ['"Function" = the job in the body.', 'Fats store energy for later, keep the body warm (insulation) and protect the organs.'], a: 'Fats store energy, keep you warm and protect your organs' },
        { q: 'Scurvy: fill in "nutrient missing", "symptoms" and "treatment".',
          visual: table(['Deficiency', 'Nutrient missing', 'Symptoms', 'Treatment'], [['scurvy', '<b>vitamin C</b>', 'bleeding gums, bruising, slow healing', 'oranges, lemons, kiwifruit']]),
          working: ['The nutrient box gets the <b>nutrient</b>: vitamin C.', 'The foods go in the treatment box.'], a: 'Vitamin C · bleeding gums · oranges and lemons' },
        { q: 'A label shows Energy, Protein, Fat total, Carbohydrate, Sugars and Sodium. Which nutrient groups are missing?',
          working: ['Tick off the seven groups: carbohydrate ✓ protein ✓ fats (lipids) ✓ (that is "Fat, total") minerals ✓ (sodium).', 'Not there: vitamins, fibre, water. A more specific answer gets the mark: e.g. no fibre, no vitamin C, no potassium or calcium.'],
          a: 'Fibre, vitamins and water are missing (and minerals like potassium or calcium)' },
        { q: 'Give features of living organisms.', working: ['Features = MRS GREN, not examples like yeast or seeds.', 'Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.'], a: 'e.g. growth, reproduction, respiration, excretion' },
        { q: 'Name three harmful microbes other than COVID-19.', working: ['"Other than COVID-19" — so COVID-19 scores nothing.', 'Harmful = pathogens.'], a: 'The flu virus, Salmonella bacteria, the measles virus' },
        { q: 'Describe two of the body\'s natural defences.', working: ['Natural = the body does it by itself. Hand washing does not count.', 'Skin is a barrier that stops microbes getting in. Phagocytes (white blood cells) engulf and digest microbes.'], a: 'Skin (barrier) and phagocytes (engulf microbes)' },
        { q: 'Explain herd immunity.',
          visual: table(['Month', '% vaccinated', 'Cases per week'], [['March', '20%', '2400'], ['May', '60%', '600'], ['July', '90%', '150']]),
          working: ['What it is: enough people immune that the virus cannot spread easily.', 'Use the table: as vaccination rose from 20% to 90%, cases fell from 2400 to 150.', 'Why it matters: it protects people who cannot be vaccinated, like babies.'], a: 'Enough people are immune that the virus cannot spread, protecting those who are not' },
      ],
      tips: [
        'If a question gives an example and says "other than", that example scores <b>zero</b>. Cross it out on the paper before you start.',
        '<b>Natural</b> defences are inside the body. Hand washing, masks, staying home and vaccines are things <b>people do</b>.',
        '<b>Features</b> of living things are things they do (MRS GREN). <b>Examples</b> are living things. Check which one the question asks for.',
        'In a table, every box has its own kind of answer. The "nutrient" box needs a vitamin, a mineral or another nutrient — never a food.',
        'Lipids and fats are the <b>same thing</b>. Carbohydrates include sugars and starch.',
        'A data table answer needs a <b>number from the table</b> and the <b>pattern</b>: "As ___ went up, ___ went down".',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = [functionQ, functionQ, foodTestTableQ, deficiencyTableQ, foodGroupQ, labelQ, labelQ, featuresQ, featuresQ,
        microbeFeatureQ, helpfulHarmfulQ, otherThanQ, defenceQ, defenceQ, herdQ, covidTableQ, covidTableQ, readingQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
