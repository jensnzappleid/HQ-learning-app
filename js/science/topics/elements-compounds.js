/* Topic: Atoms, elements, compounds and the periodic table (Material World). */
(function (HL) {
  const R = HL.rng;

  /* ---------- pools ---------- */
  const ELEMENTS = [
    { z: 1, sym: 'H', name: 'hydrogen', metal: false, g: 1, p: 1 },
    { z: 2, sym: 'He', name: 'helium', metal: false, g: 0, p: 1 },
    { z: 3, sym: 'Li', name: 'lithium', metal: true, g: 1, p: 2 },
    { z: 4, sym: 'Be', name: 'beryllium', metal: true, g: 2, p: 2 },
    { z: 5, sym: 'B', name: 'boron', metal: false, g: 3, p: 2 },
    { z: 6, sym: 'C', name: 'carbon', metal: false, g: 4, p: 2 },
    { z: 7, sym: 'N', name: 'nitrogen', metal: false, g: 5, p: 2 },
    { z: 8, sym: 'O', name: 'oxygen', metal: false, g: 6, p: 2 },
    { z: 9, sym: 'F', name: 'fluorine', metal: false, g: 7, p: 2 },
    { z: 10, sym: 'Ne', name: 'neon', metal: false, g: 0, p: 2 },
    { z: 11, sym: 'Na', name: 'sodium', metal: true, g: 1, p: 3 },
    { z: 12, sym: 'Mg', name: 'magnesium', metal: true, g: 2, p: 3 },
    { z: 13, sym: 'Al', name: 'aluminium', metal: true, g: 3, p: 3 },
    { z: 14, sym: 'Si', name: 'silicon', metal: false, g: 4, p: 3 },
    { z: 15, sym: 'P', name: 'phosphorus', metal: false, g: 5, p: 3 },
    { z: 16, sym: 'S', name: 'sulfur', metal: false, g: 6, p: 3 },
    { z: 17, sym: 'Cl', name: 'chlorine', metal: false, g: 7, p: 3 },
    { z: 18, sym: 'Ar', name: 'argon', metal: false, g: 0, p: 3 },
    { z: 19, sym: 'K', name: 'potassium', metal: true, g: 1, p: 4 },
    { z: 20, sym: 'Ca', name: 'calcium', metal: true, g: 2, p: 4 },
  ];

  const FORMULAS = [
    { text: 'H₂O', parts: [['H', 2], ['O', 1]], name: 'water' },
    { text: 'CO₂', parts: [['C', 1], ['O', 2]], name: 'carbon dioxide' },
    { text: 'NaCl', parts: [['Na', 1], ['Cl', 1]], name: 'sodium chloride (table salt)' },
    { text: 'O₂', parts: [['O', 2]], name: 'oxygen gas' },
    { text: 'CH₄', parts: [['C', 1], ['H', 4]], name: 'methane' },
    { text: 'NH₃', parts: [['N', 1], ['H', 3]], name: 'ammonia' },
    { text: 'H₂SO₄', parts: [['H', 2], ['S', 1], ['O', 4]], name: 'sulfuric acid' },
    { text: 'CaCO₃', parts: [['Ca', 1], ['C', 1], ['O', 3]], name: 'calcium carbonate (chalk)' },
    { text: 'MgO', parts: [['Mg', 1], ['O', 1]], name: 'magnesium oxide' },
    { text: 'HCl', parts: [['H', 1], ['Cl', 1]], name: 'hydrochloric acid' },
    { text: 'N₂', parts: [['N', 2]], name: 'nitrogen gas' },
    { text: 'NaOH', parts: [['Na', 1], ['O', 1], ['H', 1]], name: 'sodium hydroxide' },
    { text: 'CaO', parts: [['Ca', 1], ['O', 1]], name: 'calcium oxide (lime)' },
    { text: 'C₆H₁₂O₆', parts: [['C', 6], ['H', 12], ['O', 6]], name: 'glucose' },
    { text: 'Fe₂O₃', parts: [['Fe', 2], ['O', 3]], name: 'iron oxide (rust)' },
  ];
  const total = (f) => f.parts.reduce((a, [, n]) => a + n, 0);

  const SUBSTANCES = [
    { name: 'oxygen gas', type: 'an element', why: 'it is made of only one kind of atom' },
    { name: 'a bar of pure gold', type: 'an element', why: 'every atom in it is a gold atom' },
    { name: 'copper wire', type: 'an element', why: 'it is made of copper atoms only' },
    { name: 'helium in a balloon', type: 'an element', why: 'only helium atoms are in there' },
    { name: 'an iron nail', type: 'an element', why: 'it is made of iron atoms only' },
    { name: 'a diamond (pure carbon)', type: 'an element', why: 'it is nothing but carbon atoms' },
    { name: 'water (H₂O)', type: 'a compound', why: 'hydrogen and oxygen atoms are chemically joined' },
    { name: 'carbon dioxide (CO₂)', type: 'a compound', why: 'carbon and oxygen atoms are joined together' },
    { name: 'table salt (NaCl)', type: 'a compound', why: 'sodium and chlorine atoms are joined' },
    { name: 'magnesium oxide (MgO)', type: 'a compound', why: 'magnesium and oxygen atoms are joined' },
    { name: 'methane (CH₄)', type: 'a compound', why: 'carbon and hydrogen atoms are joined' },
    { name: 'rust (Fe₂O₃)', type: 'a compound', why: 'iron and oxygen atoms are joined' },
    { name: 'the air we breathe', type: 'a mixture', why: 'nitrogen, oxygen and other gases are jumbled together but not joined' },
    { name: 'sea water', type: 'a mixture', why: 'salt and water are mixed but not chemically joined' },
    { name: 'brass', type: 'a mixture', why: 'copper and zinc are mixed together as an alloy' },
    { name: 'muddy river water', type: 'a mixture', why: 'the mud and the water are not joined at all' },
    { name: 'a cup of tea', type: 'a mixture', why: 'lots of substances are jumbled in the water' },
    { name: 'steel', type: 'a mixture', why: 'it is iron mixed with a little carbon' },
  ];

  const DEFS = [
    { word: 'an atom', def: 'the smallest particle of an element' },
    { word: 'an element', def: 'a substance made of only ONE kind of atom' },
    { word: 'a compound', def: 'two or more different atoms chemically JOINED together' },
    { word: 'a mixture', def: 'different substances jumbled together but NOT joined' },
    { word: 'a group', def: 'a column of the periodic table — the elements in it behave alike' },
    { word: 'a period', def: 'a row across the periodic table' },
  ];

  function choice(correct, wrongs, n = 4) {
    const uniq = wrongs.filter((w, i) => w !== correct && wrongs.indexOf(w) === i);
    const opts = [correct].concat(R.sample(uniq, Math.min(n - 1, uniq.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });

  /* ---------- diagrams ---------- */
  const ball = (x, y, fill, stroke, r) => `<circle cx="${x}" cy="${y}" r="${r || 8}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
  const conceptSvg = () => `<svg viewBox="0 0 344 200" width="344" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="16" y="26" width="96" height="76" rx="8" fill="#FFFFFF" stroke="#8B76C4" stroke-width="3"/>
      ${[[42, 48], [70, 48], [96, 62], [42, 80], [70, 80], [96, 36]].map(([x, y]) => ball(x, y, '#B9A5E6', '#8B76C4')).join('')}
      <rect x="124" y="26" width="96" height="76" rx="8" fill="#FFFFFF" stroke="#5F98C4" stroke-width="3"/>
      ${[[150, 48], [186, 48], [150, 82], [186, 82]].map(([x, y], i) => `<line x1="${x}" y1="${y}" x2="${x + 20}" y2="${y}" stroke="#4A4033" stroke-width="3"/>${ball(x, y, '#B9A5E6', '#8B76C4')}${ball(x + 20, y, '#E9A07A', '#C97B52', 6)}`).join('')}
      <rect x="232" y="26" width="96" height="76" rx="8" fill="#FFFFFF" stroke="#D9941F" stroke-width="3"/>
      ${[[254, 44], [288, 40], [312, 60], [258, 84], [296, 88]].map(([x, y], i) => ball(x, y, i % 2 ? '#E9A07A' : '#B9A5E6', i % 2 ? '#C97B52' : '#8B76C4')).join('')}
      ${[[280, 66], [300, 66]].map(([x, y], i) => ball(x, y, i ? '#E9A07A' : '#B9A5E6', i ? '#C97B52' : '#8B76C4', 6)).join('')}
      <line x1="280" y1="66" x2="300" y2="66" stroke="#4A4033" stroke-width="2.5"/>
      <text x="64" y="120" text-anchor="middle" fill="#8B76C4" font-size="12.5">ELEMENT</text>
      <text x="172" y="120" text-anchor="middle" fill="#5F98C4" font-size="12.5">COMPOUND</text>
      <text x="280" y="120" text-anchor="middle" fill="#D9941F" font-size="12.5">MIXTURE</text>
      <text x="64" y="138" text-anchor="middle" fill="#4A4033" font-size="11.5">same atoms</text>
      <text x="172" y="138" text-anchor="middle" fill="#4A4033" font-size="11.5">joined up</text>
      <text x="280" y="138" text-anchor="middle" fill="#4A4033" font-size="11.5">not joined</text>
      <line x1="20" y1="152" x2="324" y2="152" stroke="#E8C24A" stroke-width="2"/>
      <text x="172" y="172" text-anchor="middle" fill="#4A4033" font-size="12.5">a line between balls = JOINED</text>
      <text x="172" y="192" text-anchor="middle" fill="#C98A1C" font-size="12">a compound is a NEW substance</text>
    </svg>`;

  const TABLE_CELLS = [];
  ELEMENTS.forEach((e) => { const col = e.g === 0 ? 7 : e.g - 1; TABLE_CELLS.push({ e, col, row: e.p - 1 }); });
  const periodicSvg = (highlight) => {
    const x0 = 20, w = 38, h = 30, y0 = 36;
    return `<svg viewBox="0 0 344 196" width="344" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="13" font-weight="700">
      <text x="172" y="14" text-anchor="middle" fill="#4A4033" font-size="11.5">columns = GROUPS · rows = PERIODS</text>
      ${[1, 2, 3, 4, 5, 6, 7, 0].map((g, i) => `<text x="${x0 + i * w + w / 2}" y="30" text-anchor="middle" fill="#C98A1C" font-size="11.5">${g}</text>`).join('')}
      ${[1, 2, 3, 4].map((p, i) => `<text x="14" y="${y0 + i * h + 20}" text-anchor="end" fill="#C98A1C" font-size="11.5">${p}</text>`).join('')}
      ${TABLE_CELLS.map(({ e, col, row }) => {
        const hi = highlight === e.sym;
        return `<rect x="${x0 + col * w}" y="${y0 + row * h}" width="${w - 2}" height="${h - 2}" rx="5" fill="${e.metal ? '#F5DFA2' : '#CFE7F7'}" stroke="${hi ? '#E0568C' : '#B9AE9C'}" stroke-width="${hi ? 3.5 : 1.5}"/>
                <text x="${x0 + col * w + (w - 2) / 2}" y="${y0 + row * h + 20}" text-anchor="middle" fill="#4A4033">${e.sym}</text>`;
      }).join('')}
      <rect x="20" y="172" width="16" height="12" fill="#F5DFA2" stroke="#B9AE9C" stroke-width="1.5"/>
      <text x="42" y="182" fill="#4A4033" font-size="12">metals</text>
      <rect x="196" y="172" width="16" height="12" fill="#CFE7F7" stroke="#B9AE9C" stroke-width="1.5"/>
      <text x="218" y="182" fill="#4A4033" font-size="12">non-metals</text>
    </svg>`;
  };

  const COLS = ['#5F98C4', '#E0568C', '#6FA04C', '#D9941F'];
  const formulaSvg = (f) => {
    let acc = 0;
    const items = f.parts.map(([el, n], i) => {
      const wid = el.length * 17 + (n > 1 ? String(n).length * 11 : 0);
      const it = { el, n, x: acc, wid, c: COLS[i % COLS.length] };
      acc += wid; return it;
    });
    const x0 = 172 - acc / 2;
    const rows = items.map((it, i) => `<circle cx="30" cy="${74 + i * 22}" r="5" fill="${it.c}"/>`
      + `<text x="44" y="${79 + i * 22}" fill="#4A4033" font-size="12.5">${it.n} × ${it.el} = ${it.n} ${it.n === 1 ? 'atom' : 'atoms'} of ${ELEMENTS.find((e) => e.sym === it.el) ? ELEMENTS.find((e) => e.sym === it.el).name : it.el}</text>`).join('');
    return `<svg viewBox="0 0 344 ${86 + f.parts.length * 22 + 24}" width="344" height="${86 + f.parts.length * 22 + 24}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-weight="700">
      ${items.map((it) => `<text x="${x0 + it.x}" y="46" fill="${it.c}" font-size="27">${it.el}</text>`
        + (it.n > 1 ? `<text x="${x0 + it.x + it.el.length * 17}" y="53" fill="${it.c}" font-size="16">${it.n}</text>` : '')).join('')}
      <text x="172" y="20" text-anchor="middle" fill="#4A4033" font-size="12">${f.name}</text>
      ${rows}
      <text x="30" y="${86 + f.parts.length * 22 + 12}" fill="#C98A1C" font-size="13">total = ${total(f)} atoms altogether</text>
    </svg>`;
  };

  /* ---------- question makers ---------- */
  function symbolToName(level) {
    const e = R.pick(level === 1 ? ELEMENTS.filter((x) => x.z <= 12) : ELEMENTS);
    return {
      visual: periodicSvg(e.sym),
      prompt: `Which element has the symbol <b>${e.sym}</b>?`,
      answer: textAns(e.name, [], 'one word'),
      hint: 'Find the symbol highlighted in pink on the table.',
      working: [`<b>Picture:</b> a symbol is the element's short name badge.`, `1. Find <b>${e.sym}</b> on the table (element number ${e.z}).`, `2. That is <b>${e.name}</b>.`],
      finalAnswer: e.name, skill: 'symbols',
    };
  }
  function nameToSymbol(level) {
    const e = R.pick(level === 1 ? ELEMENTS.filter((x) => x.z <= 12) : ELEMENTS);
    return {
      prompt: `What is the chemical symbol for <b>${e.name}</b>?`,
      answer: textAns(e.sym, [], 'one or two letters'),
      hint: 'A symbol is one capital letter, or a capital followed by a small letter.',
      working: [`<b>Picture:</b> the badge on the periodic table square.`, `1. ${e.name.charAt(0).toUpperCase() + e.name.slice(1)} is element number ${e.z}.`, `2. Its symbol is <b>${e.sym}</b>.`],
      finalAnswer: e.sym, skill: 'symbols',
    };
  }
  function metalOrNot(level) {
    const e = R.pick(ELEMENTS);
    const correct = e.metal ? 'a metal' : 'a non-metal';
    return {
      visual: periodicSvg(e.sym),
      prompt: `Look at the periodic table. Is <b>${e.name} (${e.sym})</b> a metal or a non-metal?`,
      answer: textAns(e.metal ? 'metal' : 'non-metal', e.metal ? ['a metal'] : ['a non-metal', 'nonmetal', 'non metal']),
      hint: 'Metals are on the LEFT of the table (yellow), non-metals on the RIGHT (blue).',
      working: ['<b>Picture:</b> the table is split down the middle — metals on the left, non-metals on the right.', `1. Find ${e.sym} on the table.`, `2. It is in the ${e.metal ? 'yellow (metal)' : 'blue (non-metal)'} part.`, `So ${e.name} is <b>${correct}</b>.`],
      finalAnswer: correct, skill: 'periodic-table',
    };
  }
  function groupPeriod(level) {
    const e = R.pick(ELEMENTS);
    const askGroup = R.chance(0.5);
    const val = askGroup ? e.g : e.p;
    return {
      visual: periodicSvg(e.sym),
      prompt: `Use the periodic table. Which <b>${askGroup ? 'group (column)' : 'period (row)'}</b> is <b>${e.name} (${e.sym})</b> in? Write the number.`,
      answer: { type: 'number', value: val, placeholder: 'e.g. 2' },
      hint: askGroup ? 'Groups are the columns — read the number along the top.' : 'Periods are the rows — read the number down the side.',
      working: ['<b>Picture:</b> groups go down (columns), periods go across (rows).', `1. Find ${e.sym} — it is highlighted in pink.`, `2. Read ${askGroup ? 'up to the group number at the top' : 'across to the period number at the side'}.`, `The answer is <b>${val}</b>.`],
      finalAnswer: String(val), skill: 'periodic-table',
    };
  }
  function sameGroup(level) {
    const e = R.pick(ELEMENTS.filter((x) => ELEMENTS.filter((y) => y.g === x.g).length > 2));
    const mates = ELEMENTS.filter((x) => x.g === e.g && x.sym !== e.sym);
    const correct = R.pick(mates).name;
    const opt = choice(correct, ELEMENTS.filter((x) => x.g !== e.g).map((x) => x.name), 4);
    return {
      visual: periodicSvg(e.sym),
      prompt: `Elements in the same <b>group</b> behave in similar ways. Which of these is in the same group as <b>${e.name}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Same group = same column. Look straight up and down from the pink square.',
      working: ['<b>Picture:</b> a group is a family standing in one column.', `1. ${e.name.charAt(0).toUpperCase() + e.name.slice(1)} is in group <b>${e.g}</b>.`, `2. Look up and down that column.`, `<b>${correct}</b> is in the same column.`],
      finalAnswer: correct, skill: 'periodic-table',
    };
  }
  const ECM_TYPE_ACCEPT = { 'an element': ['element'], 'a compound': ['compound'], 'a mixture': ['mixture'] };
  function classifyEcm(level) {
    const s = R.pick(SUBSTANCES);
    return {
      prompt: `Is <b>${s.name}</b> an element, a compound or a mixture?`,
      answer: textAns(s.type, ECM_TYPE_ACCEPT[s.type], 'one word'),
      hint: 'One kind of atom = element. Different atoms JOINED = compound. Different substances NOT joined = mixture.',
      working: [
        '<b>Picture:</b> one colour of ball (element) · balls joined with a stick (compound) · loose balls of different colours (mixture).',
        `1. ${s.why.charAt(0).toUpperCase() + s.why.slice(1)}.`,
        `So it is <b>${s.type}</b>.`,
      ],
      finalAnswer: s.type, skill: 'classify',
    };
  }
  const DEF_WORD_ACCEPT = {
    'an atom': ['atom'], 'an element': ['element'], 'a compound': ['compound'],
    'a mixture': ['mixture'], 'a group': ['group'], 'a period': ['period'],
  };
  function defineQ(level) {
    const d = R.pick(DEFS);
    if (R.chance(0.5)) {
      const opt = choice(d.def, DEFS.filter((x) => x.word !== d.word).map((x) => x.def));
      return {
        prompt: `What is <b>${d.word}</b>?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'One kind of atom = element. Joined = compound. Jumbled = mixture.',
        working: ['<b>Picture:</b> the three boxes of balls.', `<b>${d.word}</b> = ${d.def}.`],
        finalAnswer: d.def, skill: 'vocab',
      };
    }
    return {
      prompt: `What is the word for <b>${d.def}</b>?`,
      answer: textAns(d.word, DEF_WORD_ACCEPT[d.word], 'one word'),
      hint: 'Element, compound, mixture, atom, group or period?',
      working: ['<b>Picture:</b> the three boxes of balls.', `That is <b>${d.word}</b>.`],
      finalAnswer: d.word, skill: 'vocab',
    };
  }
  function countAtoms(level) {
    const f = R.pick(level === 1 ? FORMULAS.filter((x) => total(x) <= 5) : FORMULAS);
    return {
      visual: formulaSvg(f),
      prompt: `How many atoms altogether are in one molecule of <b>${f.text}</b> (${f.name})?`,
      answer: { type: 'number', value: total(f), placeholder: 'e.g. 3' },
      hint: 'A little number tells you how many of the letter in front of it. No number means just one.',
      working: [
        '<b>Picture:</b> the little number is like a shopping list quantity — no number means "just 1".',
        ...f.parts.map(([el, n]) => `${el}: <b>${n}</b>`),
        `Add them up: <b>${total(f)}</b> atoms.`,
      ],
      finalAnswer: `${total(f)} atoms`, skill: 'formulas',
    };
  }
  function countOne(level) {
    const f = R.pick(FORMULAS.filter((x) => x.parts.length > 1));
    const [el, n] = R.pick(f.parts);
    const full = ELEMENTS.find((e) => e.sym === el);
    return {
      visual: formulaSvg(f),
      prompt: `In the formula <b>${f.text}</b>, how many <b>${full ? full.name : el}</b> atoms are there?`,
      answer: { type: 'number', value: n, placeholder: 'e.g. 2' },
      hint: 'Look for the little number just after that letter. No little number means one.',
      working: [`<b>Picture:</b> the little number belongs to the letter in front of it.`, `1. Find <b>${el}</b> in ${f.text}.`, `2. The little number after it is ${n === 1 ? 'missing, which means <b>1</b>' : `<b>${n}</b>`}.`],
      finalAnswer: String(n), skill: 'formulas',
    };
  }
  function howManyElements(level) {
    const f = R.pick(FORMULAS.filter((x) => x.parts.length > 1));
    return {
      visual: formulaSvg(f),
      prompt: `How many <b>different elements</b> are joined together in <b>${f.text}</b>?`,
      answer: { type: 'number', value: f.parts.length, placeholder: 'e.g. 2' },
      hint: 'Count the different CAPITAL letters — each one starts a new element.',
      working: ['<b>Picture:</b> every capital letter starts a new element.', `1. The elements are: ${f.parts.map((p) => p[0]).join(', ')}.`, `2. That is <b>${f.parts.length}</b> different elements.`],
      finalAnswer: String(f.parts.length), skill: 'formulas',
    };
  }
  function formulaName(level) {
    const f = R.pick(FORMULAS);
    if (R.chance(0.5)) {
      const opt = choice(f.name, FORMULAS.filter((x) => x.text !== f.text).map((x) => x.name));
      return {
        prompt: `What is the name of the substance with the formula <b>${f.text}</b>?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Read the symbols: which elements are joined together?',
        working: [`1. ${f.text} contains ${f.parts.map((p) => (ELEMENTS.find((e) => e.sym === p[0]) || { name: p[0] }).name).join(' and ')}.`, `2. That substance is <b>${f.name}</b>.`],
        finalAnswer: f.name, skill: 'formulas',
      };
    }
    const opt = choice(f.text, FORMULAS.filter((x) => x.name !== f.name).map((x) => x.text));
    return {
      prompt: `What is the chemical formula for <b>${f.name}</b>?`,
      answer: { type: 'choice', value: opt.value, choices: opt.choices },
      hint: 'Which elements are in it, and how many of each?',
      working: [`<b>Picture:</b> the formula is a recipe list.`, `${f.name} is made of ${f.parts.map(([el, n]) => `${n} ${el}`).join(' and ')}.`, `So the formula is <b>${f.text}</b>.`],
      finalAnswer: f.text, skill: 'formulas',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const opt = choice('A compound — the hydrogen and oxygen are chemically joined, so water is nothing like either of them', [
        'A mixture — you could filter the hydrogen out',
        'An element — water cannot be broken down',
        'A mixture — because two things are in it',
      ], 4);
      return {
        prompt: 'Water is made from hydrogen (a gas that burns) and oxygen (a gas you breathe), but water is a liquid that puts fires out. Is water a compound or a mixture?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'In a mixture each part keeps its own properties. Water behaves nothing like hydrogen or oxygen.',
        working: [
          '<b>Picture:</b> balls joined with a stick make something brand new; loose balls stay themselves.',
          '1. Does water behave like hydrogen or oxygen? <b>No, not at all.</b>',
          '2. So the atoms must be chemically <b>joined</b>.',
          'Water is a <b>compound</b>.',
        ],
        finalAnswer: 'A compound — the atoms are chemically joined',
      };
    },
    () => {
      const opt = choice('A mixture — the gases are jumbled together but not joined, so they can be separated', [
        'A compound, because it has more than one gas in it',
        'An element, because it is invisible',
        'A compound, because you cannot see the separate gases',
      ], 4);
      return {
        prompt: 'Air contains nitrogen, oxygen, argon and carbon dioxide. Is air a compound or a mixture, and how do you know?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Can the parts be separated without a chemical reaction?',
        working: ['<b>Picture:</b> loose balls of different colours rolling around in the same box.', '1. Are the gases joined? <b>No.</b>', '2. Each one keeps its own properties, and they can be separated by cooling the air.', 'So air is a <b>mixture</b>.'],
        finalAnswer: 'A mixture — the gases are not joined',
      };
    },
    () => {
      const f = R.pick(FORMULAS.filter((x) => x.parts.length > 1 && total(x) <= 8));
      return {
        visual: formulaSvg(f),
        prompt: `Harper's book says ${f.name} has the formula <b>${f.text}</b>. How many atoms is that altogether?`,
        answer: { type: 'number', value: total(f), placeholder: 'e.g. 3' },
        hint: 'Add up the little numbers. A letter with no little number counts as 1.',
        working: ['<b>Picture:</b> the little number is a shopping quantity — none written means "just 1".', ...f.parts.map(([el, n]) => `${el}: <b>${n}</b>`), `Total: <b>${total(f)}</b> atoms.`],
        finalAnswer: `${total(f)} atoms`,
      };
    },
    () => {
      const opt = choice('Spot the mistake: the little 2 belongs to the H, so there are 2 hydrogens and 1 oxygen — 3 atoms', [
        'She is right: 2 atoms',
        'There are 2 oxygen atoms and 1 hydrogen',
        'There are 4 atoms altogether',
      ], 4);
      return {
        visual: formulaSvg(FORMULAS[0]),
        prompt: 'Harper\'s friend says H₂O has "2 atoms — one H and one O". What has she got wrong?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'The little number tells you how many of the letter IN FRONT of it.',
        working: ['<b>Picture:</b> the little 2 sits behind the H, so it belongs to the H.', '1. H₂ means <b>2 hydrogen atoms</b>.', '2. O has no little number, so that is <b>1 oxygen atom</b>.', '3. 2 + 1 = <b>3 atoms</b>.'],
        finalAnswer: '3 atoms — 2 hydrogen and 1 oxygen',
      };
    },
    () => {
      const e = R.pick(ELEMENTS.filter((x) => x.metal));
      const opt = choice('It is a metal — metals are on the left-hand side of the periodic table', [
        'It is a non-metal — it is on the right',
        'You cannot tell from the periodic table',
        'It is a compound',
      ], 4);
      return {
        visual: periodicSvg(e.sym),
        prompt: `Harper finds <b>${e.name} (${e.sym})</b> on the periodic table. What can she say about it straight away?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Which side of the table is it on?',
        working: ['<b>Picture:</b> the table is split — yellow metals on the left, blue non-metals on the right.', `1. ${e.sym} is in the yellow part on the left.`, 'So it is a <b>metal</b>.'],
        finalAnswer: 'It is a metal — it is on the left of the table',
      };
    },
    () => {
      const opt = choice('They are in the same group (column), so they behave in similar ways', [
        'They are in the same period, so they are the same weight',
        'They are both compounds',
        'It is just a coincidence',
      ], 4);
      return {
        visual: periodicSvg('Na'),
        prompt: 'Lithium, sodium and potassium all fizz violently when dropped in water. What does the periodic table tell you about why?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Look at where all three sit in the table.',
        working: ['<b>Picture:</b> a group is a family standing in one column — family members act alike.', '1. Li, Na and K are all in <b>group 1</b> (the first column).', '2. Elements in the same group behave in similar ways.', 'So they all react with water in the same way.'],
        finalAnswer: 'They are all in group 1, and a group behaves alike',
      };
    },
    () => {
      const opt = choice('No — you can only separate a compound with a chemical reaction, not by filtering', [
        'Yes — a filter would trap the sodium',
        'Yes — evaporating would separate them',
        'Yes — a magnet would pull the sodium out',
      ], 4);
      return {
        prompt: 'Table salt is the compound sodium chloride (NaCl). Could Harper separate the sodium from the chlorine by filtering it?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Separating methods like filtering only work on mixtures.',
        working: [
          '<b>Picture:</b> the balls in a compound are joined by a stick — you cannot just shake them apart.',
          '1. Is NaCl a mixture or a compound? A <b>compound</b> — the atoms are joined.',
          '2. Filtering, sieving and magnets only work on <b>mixtures</b>.',
          'So no — it would need a chemical reaction.',
        ],
        finalAnswer: 'No — compounds need a chemical reaction to split up',
      };
    },
    () => {
      const opt = choice('An element — it is made of only one kind of atom', ['A compound — gold has lots of parts', 'A mixture — gold contains other metals', 'An atom'], 4);
      return {
        visual: conceptSvg(),
        prompt: 'A bar of pure gold is made of nothing but gold atoms. Element, compound or mixture?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Count how many different kinds of atom are in there.',
        working: ['<b>Picture:</b> a box of balls that are all the same colour.', '1. How many different kinds of atom? <b>One.</b>', 'So it is an <b>element</b>.'],
        finalAnswer: 'An element',
      };
    },
    () => {
      const f = R.pick([FORMULAS[6], FORMULAS[7], FORMULAS[13]]);
      const [el, n] = f.parts[f.parts.length - 1];
      const full = ELEMENTS.find((e) => e.sym === el);
      return {
        visual: formulaSvg(f),
        prompt: `Harper is labelling a diagram of <b>${f.name} (${f.text})</b>. How many <b>${full ? full.name : el}</b> atoms should she draw?`,
        answer: { type: 'number', value: n, placeholder: 'e.g. 4' },
        hint: 'Read the little number that comes straight after that letter.',
        working: ['<b>Picture:</b> the little number belongs to the letter in front of it.', `1. Find <b>${el}</b> in ${f.text}.`, `2. The little number after it is <b>${n}</b>.`],
        finalAnswer: String(n),
      };
    },
    () => {
      const opt = choice('Hydrogen — it sits in group 1 but it is a non-metal, not a metal', ['Sodium', 'Potassium', 'Lithium'], 4);
      return {
        visual: periodicSvg('H'),
        prompt: 'Group 1 is full of soft, reactive metals — except for one element at the very top. Which one is the odd one out?',
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'Look at the very top-left square of the table and check its colour.',
        working: ['<b>Picture:</b> the family photo with one member who does not look like the rest.', '1. Group 1 contains H, Li, Na and K.', '2. Li, Na and K are metals (yellow).', '3. H is coloured as a <b>non-metal</b>.', 'So hydrogen is the odd one out.'],
        finalAnswer: 'Hydrogen — a non-metal sitting in group 1',
      };
    },
    () => {
      const s = R.pick(SUBSTANCES);
      const opt = choice(s.type, ['an element', 'a compound', 'a mixture'].filter((x) => x !== s.type), 3);
      return {
        visual: conceptSvg(),
        prompt: `Harper is sorting labels into three piles: elements, compounds and mixtures. Which pile does <b>${s.name}</b> go in?`,
        answer: { type: 'choice', value: opt.value, choices: opt.choices },
        hint: 'One kind of atom? Different atoms joined? Or different substances just jumbled?',
        working: ['<b>Picture:</b> one colour of ball · balls joined with a stick · loose balls of different colours.', `1. ${s.why.charAt(0).toUpperCase() + s.why.slice(1)}.`, `So it goes in the <b>${s.type}</b> pile.`],
        finalAnswer: s.type,
      };
    },
  ];

  HL.registerTopic({
    id: 'elements-compounds', subject: 'science', strand: 'material', order: 6,
    name: 'Elements & compounds', short: 'Elements', animal: 'owl',
    blurb: 'Atoms, the periodic table, and reading a chemical formula.',
    example: 'H₂O = 2 hydrogen + 1 oxygen = 3 atoms',
    learn: {
      what: '<p>Everything is built from <b>atoms</b>. A substance made of only <b>one kind</b> of atom is an <b>element</b> — there are about 118 of them, and they are all listed on the <b>periodic table</b>. When different atoms are chemically <b>joined</b> you get a <b>compound</b>, which is a brand-new substance. If substances are only jumbled together and <b>not joined</b>, that is a <b>mixture</b>.</p><p><b>Picture for this topic:</b> a box of <b>coloured balls</b>. All one colour = element. Balls <b>joined by a stick</b> = compound. Loose balls of different colours rolling around = mixture.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Element</b> = one kind of atom only (gold, oxygen, carbon)',
        '<b>Compound</b> = different atoms <b>chemically joined</b> — a brand-new substance (H₂O, CO₂, NaCl)',
        '<b>Mixture</b> = jumbled but <b>not joined</b>, so it can be separated (air, sea water, brass)',
        'A symbol is <b>one capital letter</b>, or a capital + a small letter: <b>H, O, C, Na, Mg, Cl</b>',
        'Periodic table: <b>columns = groups</b> (a family that behaves alike), <b>rows = periods</b>. <b>Metals left, non-metals right</b>',
        'In a formula the <b>little number</b> tells you how many of the letter <b>in front of it</b>. No number means <b>1</b>',
      ],
      steps: [
        'To sort a substance, ask: "<b>how many kinds of atom, and are they joined?</b>" One kind → element. Different and joined → compound. Different and loose → mixture.',
        'To read a formula, go letter by letter. Every <b>CAPITAL</b> letter starts a new element; a small letter belongs to the capital before it (Na, Cl, Mg).',
        'The <b>little number</b> counts the element just before it. Nothing written means one. Add them all up for the total.',
        'On the periodic table, find the square first, then read <b>up</b> for the group and <b>across</b> for the period.',
        'Colour check: <b>left = metal, right = non-metal</b>. The one to watch out for is <b>hydrogen</b> — it sits top-left but is a non-metal.',
      ],
      examples: [
        {
          q: 'Is carbon dioxide (CO₂) an element, a compound or a mixture?',
          working: ['<b>Picture:</b> balls joined with a stick.', '1. How many different kinds of atom? <b>Two</b> — carbon and oxygen.', '2. Are they joined? <b>Yes</b> — that is what a formula means.', 'So it is a <b>compound</b>.'],
          a: 'A compound',
        },
        {
          q: 'Count the atoms in H₂SO₄ (sulfuric acid).',
          visual: formulaSvg({ text: 'H₂SO₄', parts: [['H', 2], ['S', 1], ['O', 4]], name: 'sulfuric acid' }),
          working: ['<b>Picture:</b> the little number is a shopping quantity — none written means "just 1".', '1. H has a little 2 → <b>2 hydrogen</b>.', '2. S has no number → <b>1 sulfur</b>.', '3. O has a little 4 → <b>4 oxygen</b>.', '4. 2 + 1 + 4 = <b>7</b>.'],
          a: '7 atoms altogether',
        },
        {
          q: 'What is the symbol for sodium, and what element is Mg?',
          visual: periodicSvg('Na'),
          working: ['<b>Picture:</b> the symbol is the badge in the element\'s square.', '1. Sodium is number 11 — its badge says <b>Na</b> (from its old Latin name).', '2. <b>Mg</b> is <b>magnesium</b>.', '3. Careful: a symbol is one CAPITAL, then any second letter is small.'],
          a: 'Sodium = Na; Mg = magnesium',
        },
        {
          q: 'Use the table: which group and period is chlorine (Cl) in, and is it a metal?',
          visual: periodicSvg('Cl'),
          working: ['<b>Picture:</b> groups go down the columns, periods go across the rows.', '1. Read <b>up</b> from Cl to the group number: <b>group 7</b>.', '2. Read <b>across</b> to the period number: <b>period 3</b>.', '3. It is blue, and blue is on the right → <b>non-metal</b>.'],
          a: 'Group 7, period 3, and it is a non-metal',
        },
        {
          q: 'Water is made from hydrogen (a gas that burns) and oxygen (a gas you breathe), but water puts fires out. What does that tell you?',
          working: [
            '<b>Picture:</b> loose balls stay themselves; balls joined by a stick make something brand new.',
            '1. In a <b>mixture</b>, each part keeps its own properties.',
            '2. Water behaves nothing like hydrogen or oxygen.',
            '3. So the atoms must be chemically <b>joined</b>.',
          ],
          a: 'Water is a compound, not a mixture',
        },
        {
          q: 'Lithium, sodium and potassium all fizz when dropped in water. Why would you expect that from the periodic table?',
          visual: periodicSvg('Na'),
          working: ['<b>Picture:</b> a group is a family standing in one column — family members act alike.', '1. Find Li, Na and K: they are all in the <b>first column</b>.', '2. That column is <b>group 1</b>.', '3. Elements in the same group behave in similar ways.'],
          a: 'They are all in group 1, and a group behaves alike',
        },
        {
          q: 'Spot the mistake: "H₂O has 2 atoms — one H and one O."',
          visual: formulaSvg({ text: 'H₂O', parts: [['H', 2], ['O', 1]], name: 'water' }),
          working: ['<b>Picture:</b> the little 2 sits just behind the H, so it belongs to the H.', '1. H₂ = <b>2 hydrogen atoms</b>, not one.', '2. O has no little number → <b>1 oxygen atom</b>.', '3. 2 + 1 = <b>3 atoms</b>.'],
          a: '3 atoms — 2 hydrogen and 1 oxygen',
        },
      ],
      tips: [
        'A symbol never has two capitals. <b>CO</b> is carbon + oxygen (carbon monoxide); <b>Co</b> is the single element cobalt.',
        'The little number counts the element <b>in front of</b> it, not after it.',
        '<b>Compounds cannot be filtered apart</b> — only mixtures can. Splitting a compound needs a chemical reaction.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') {
        if (level === 1) return R.pick([WORD[2], WORD[4], WORD[7], WORD[10], WORD[1]])(level);
        if (level === 2) return R.pick(WORD)(level);
        return R.pick([WORD[0], WORD[3], WORD[5], WORD[6], WORD[8], WORD[9], WORD[1]])(level);
      }
      const pool = level === 1
        ? [symbolToName, nameToSymbol, classifyEcm, defineQ, metalOrNot]
        : level === 2
          ? [symbolToName, nameToSymbol, classifyEcm, defineQ, metalOrNot, countAtoms, countOne, formulaName, groupPeriod]
          : [countAtoms, countOne, howManyElements, formulaName, groupPeriod, sameGroup, classifyEcm, metalOrNot, symbolToName];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
