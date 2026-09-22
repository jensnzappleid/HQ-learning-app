/* Topic: Variation & inheritance — continuous/discontinuous variation, inherited vs acquired
 * characteristics, genes on DNA in the nucleus, a mix from both parents, twins,
 * selective breeding in NZ, and how variation links to survival. Living World, order 11. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const TRAITS = [
    { name: 'height', type: 'continuous', why: 'you can be any height in between — 152 cm, 152.4 cm, anything', unit: 'cm' },
    { name: 'hand span', type: 'continuous', why: 'it can be any measurement in a range, not just a few sizes', unit: 'cm' },
    { name: 'foot length', type: 'continuous', why: 'you measure it, and every value in between is possible', unit: 'cm' },
    { name: 'body mass', type: 'continuous', why: 'it can be any value on the scales, not a few fixed groups', unit: 'kg' },
    { name: 'arm span', type: 'continuous', why: 'you measure it with a tape, so every value in between exists', unit: 'cm' },
    { name: 'resting heart rate', type: 'continuous', why: 'it can be any number of beats, not a few set groups', unit: 'bpm' },
    { name: 'tongue rolling', type: 'discontinuous', why: 'you either can or you cannot — there is nothing in between' },
    { name: 'eye colour', type: 'discontinuous', why: 'there are a few separate groups, and you are in one of them' },
    { name: 'earlobes (free or attached)', type: 'discontinuous', why: 'there are only two groups — free or attached' },
    { name: 'blood group', type: 'discontinuous', why: 'there are only four groups: A, B, AB and O' },
    { name: 'being left or right handed', type: 'discontinuous', why: 'there are separate groups, not a sliding scale' },
    { name: 'having dimples', type: 'discontinuous', why: 'you either have them or you do not' },
  ];

  const INH_ACQ = [
    { full: 'the colour of your eyes', card: 'eye colour', kind: 'inherited', why: 'you were born with it — it came from your parents’ genes' },
    { full: 'your natural hair colour', card: 'natural hair colour', kind: 'inherited', why: 'the instructions for it came in the genes from your parents' },
    { full: 'your blood group', card: 'blood group', kind: 'inherited', why: 'it is set by genes before you are even born' },
    { full: 'whether you can roll your tongue', card: 'tongue rolling', kind: 'inherited', why: 'it is set by the genes you were born with, not by practice' },
    { full: 'whether your earlobes hang free or are attached', card: 'earlobe shape', kind: 'inherited', why: 'you were born with that shape — it came from your genes' },
    { full: 'having dimples when you smile', card: 'dimples', kind: 'inherited', why: 'they were built in before you were born' },
    { full: 'the shape of your nose', card: 'nose shape', kind: 'inherited', why: 'the plan for it came from your parents’ genes' },
    { full: 'a scar on your knee from falling off your bike', card: 'a scar', kind: 'acquired', why: 'it happened to you during your life — you were not born with it' },
    { full: 'being able to speak te reo Māori', card: 'speaking te reo', kind: 'acquired', why: 'you learned it, and learning is never passed on in genes' },
    { full: 'being able to play the guitar', card: 'playing guitar', kind: 'acquired', why: 'it is a skill you practised, not something in your genes' },
    { full: 'a suntan after a summer at the beach', card: 'a suntan', kind: 'acquired', why: 'the sun changed your skin during your life' },
    { full: 'bright blue dyed hair', card: 'dyed blue hair', kind: 'acquired', why: 'the dye was put on during your life — your genes never changed' },
    { full: 'big muscles after months of training', card: 'muscles from training', kind: 'acquired', why: 'the training built them during your life' },
    { full: 'a pierced ear', card: 'a pierced ear', kind: 'acquired', why: 'it was done to you — nobody is born with it' },
    { full: 'being able to swim', card: 'swimming', kind: 'acquired', why: 'it is a learned skill, and skills are not in genes' },
    { full: 'a broken arm in a cast', card: 'a broken arm', kind: 'acquired', why: 'it happened during your life, in an accident' },
  ];

  const WORDS = [
    { word: 'variation', mean: 'the differences between individuals of the same species', ex: 'no two kākāpō are exactly the same size' },
    { word: 'continuous variation', mean: 'a feature that can take any value in a range, so you measure it', ex: 'height' },
    { word: 'discontinuous variation', mean: 'a feature with a few separate groups and nothing in between', ex: 'tongue rolling' },
    { word: 'gene', mean: 'a short section of DNA carrying one instruction', ex: 'a gene for eye colour' },
    { word: 'DNA', mean: 'the long coiled molecule all the instructions are written on', ex: 'DNA is kept in the nucleus' },
    { word: 'chromosome', mean: 'a long thread of DNA — humans have 23 pairs in each body cell', ex: '23 threads come from mum and 23 from dad' },
    { word: 'inherited characteristic', mean: 'something you were born with, passed on in your parents’ genes', ex: 'eye colour' },
    { word: 'acquired characteristic', mean: 'something that happened to you during your life', ex: 'a scar' },
    { word: 'offspring', mean: 'the young that parents produce', ex: 'a lamb is a sheep’s offspring' },
    { word: 'selective breeding', mean: 'people choosing which parents breed, to get the young they want', ex: 'breeding merino sheep for very fine wool' },
    { word: 'species', mean: 'living things that can breed together and have young that can breed too', ex: 'every domestic sheep is one species' },
  ];

  const BREEDS = [
    { thing: 'merino sheep', want: 'very fine, soft wool' },
    { thing: 'romney sheep', want: 'plenty of meat and hard-wearing wool' },
    { thing: 'Friesian dairy cows', want: 'a bigger milk yield' },
    { thing: 'the huntaway dog', want: 'a deep loud bark to push sheep up a hill' },
    { thing: 'the heading dog', want: 'the quiet creeping stare that moves sheep without a sound' },
    { thing: 'gold kiwifruit', want: 'sweeter fruit with a smooth skin' },
    { thing: 'Royal Gala apples', want: 'crisp sweet apples that keep well in a store' },
    { thing: 'wheat', want: 'short strong stalks that do not blow flat in the wind' },
    { thing: 'potatoes', want: 'big tubers that do not catch disease so easily' },
  ];

  const FAMILY = [
    { trait: 'eye colour', mum: 'brown eyes', dad: 'blue eyes' },
    { trait: 'tongue rolling', mum: 'can roll', dad: 'cannot roll' },
    { trait: 'earlobes', mum: 'free lobes', dad: 'attached lobes' },
    { trait: 'hair colour', mum: 'dark hair', dad: 'red hair' },
    { trait: 'dimples', mum: 'has dimples', dad: 'no dimples' },
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
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms accepted for each unit's actual vocabulary term, used wherever she has to
   *  type the term herself instead of picking it from a list. */
  const WORD_ACCEPT = {
    variation: [], 'continuous variation': ['continuous'], 'discontinuous variation': ['discontinuous'],
    gene: [], DNA: ['dna'], chromosome: ['chromosomes'],
    'inherited characteristic': ['inherited', 'an inherited characteristic'],
    'acquired characteristic': ['acquired', 'an acquired characteristic'],
    offspring: [], 'selective breeding': [], species: [],
  };

  /* ---------- diagrams ---------- */
  /** parents → child on top; cell → nucleus → chromosome → DNA along the bottom */
  function conceptSvg() {
    const dna = (cx, cy) => `<line x1="${cx - 11}" y1="${cy - 19}" x2="${cx - 11}" y2="${cy + 19}" stroke="#6FA04C" stroke-width="4" stroke-linecap="round"/>
      <line x1="${cx + 11}" y1="${cy - 19}" x2="${cx + 11}" y2="${cy + 19}" stroke="#6FA04C" stroke-width="4" stroke-linecap="round"/>
      ${[-12, -4, 4, 12].map((d) => `<line x1="${cx - 11}" y1="${cy + d}" x2="${cx + 11}" y2="${cy + d}" stroke="#E8C24A" stroke-width="3.5" stroke-linecap="round"/>`).join('')}`;
    const chrom = (cx, cy) => `<path d="M${cx - 11} ${cy - 19} C${cx - 3} ${cy - 8} ${cx + 3} ${cy + 8} ${cx + 11} ${cy + 19}" fill="none" stroke="#B9A5E6" stroke-width="7" stroke-linecap="round"/>
      <path d="M${cx + 11} ${cy - 19} C${cx + 3} ${cy - 8} ${cx - 3} ${cy + 8} ${cx - 11} ${cy + 19}" fill="none" stroke="#B9A5E6" stroke-width="7" stroke-linecap="round"/>`;
    const arrow = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2 - 7}" y2="${y}" stroke="${INK}" stroke-width="3"/><polygon points="${x2},${y} ${x2 - 8},${y - 5} ${x2 - 8},${y + 5}" fill="${INK}"/>`;
    return `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="14" text-anchor="middle" fill="${INK}" font-size="12">you get <tspan fill="#E0568C">half</tspan> your genes from each parent</text>
      <circle cx="70" cy="46" r="22" fill="#F5C3D4" stroke="${INK}" stroke-width="2"/><text x="70" y="50" text-anchor="middle" fill="${INK}">mum</text>
      <circle cx="270" cy="46" r="22" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/><text x="270" y="50" text-anchor="middle" fill="${INK}">dad</text>
      <line x1="90" y1="58" x2="142" y2="80" stroke="#E0568C" stroke-width="3"/><polygon points="148,83 137,80 140,72" fill="#E0568C"/>
      <line x1="250" y1="58" x2="198" y2="80" stroke="#E0568C" stroke-width="3"/><polygon points="192,83 200,72 203,80" fill="#E0568C"/>
      <text x="112" y="82" text-anchor="middle" fill="#E0568C" font-size="12">½</text>
      <text x="228" y="82" text-anchor="middle" fill="#E0568C" font-size="12">½</text>
      <circle cx="170" cy="96" r="24" fill="#B9A5E6" stroke="${INK}" stroke-width="2"/><text x="170" y="100" text-anchor="middle" fill="${INK}">child</text>
      <line x1="8" y1="124" x2="332" y2="124" stroke="#E0D8C8" stroke-width="2"/>
      <ellipse cx="42" cy="156" rx="30" ry="21" fill="#FDECF3" stroke="#E88BB0" stroke-width="3"/><circle cx="42" cy="156" r="9" fill="#C9B8F2" stroke="#9B85E0" stroke-width="2"/>
      ${arrow(76, 104, 156)}
      <circle cx="130" cy="156" r="20" fill="#C9B8F2" stroke="#9B85E0" stroke-width="3"/>
      ${arrow(154, 190, 156)}
      ${chrom(214, 156)}
      ${arrow(238, 274, 156)}
      ${dna(298, 156)}
      <text x="42" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">cell</text>
      <text x="130" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">nucleus</text>
      <text x="214" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">chromosome</text>
      <text x="298" y="192" text-anchor="middle" fill="${INK}" font-size="11.5">DNA</text>
      <text x="170" y="209" text-anchor="middle" fill="#C98A1C" font-size="11.5">a gene = one short piece of DNA = one instruction</text>
    </svg>`;
  }

  /** a variation chart. cont = true → touching bars over measured ranges; false → separate bars */
  function varChartSvg(cont, vals) {
    const cats = cont ? ['140–149', '150–159', '160–169', '170–179'] : ['brown', 'blue', 'green', 'hazel'];
    const max = Math.max.apply(null, vals);
    const w = cont ? 56 : 40;
    const bx = (i) => (cont ? 56 + i * 56 : 66 + i * 56);
    return `<svg viewBox="0 0 300 196" width="300" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="150" y="14" text-anchor="middle" fill="${INK}" font-size="11.5">${cont ? 'height of everyone in the class (cm)' : 'eye colour of everyone in the class'}</text>
      <line x1="52" y1="24" x2="52" y2="152" stroke="${INK}" stroke-width="2"/>
      <line x1="52" y1="152" x2="290" y2="152" stroke="${INK}" stroke-width="2"/>
      ${[0, 0.5, 1].map((f) => `<text x="46" y="${156 - f * 120}" text-anchor="end" fill="#7A7065" font-size="10.5">${Math.round(f * max)}</text><line x1="49" y1="${152 - f * 120}" x2="52" y2="${152 - f * 120}" stroke="${INK}" stroke-width="2"/>`).join('')}
      ${vals.map((v, i) => {
        const h = (v / max) * 120;
        return `<rect x="${bx(i)}" y="${152 - h}" width="${w}" height="${h}" rx="${cont ? 0 : 4}" fill="${cont ? '#A9D8F5' : '#8FC96E'}" stroke="${INK}" stroke-width="2"/>
          <text x="${bx(i) + w / 2}" y="168" text-anchor="middle" fill="${INK}" font-size="10.5">${cats[i]}</text>`;
      }).join('')}
      <text x="150" y="188" text-anchor="middle" fill="#7A7065" font-size="10.5">${cont ? 'measured — every value in between is possible' : 'you are in ONE group — nothing in between'}</text>
    </svg>`;
  }

  /** a card with one characteristic on it, and two bins to sort it into */
  function sortSvg(card) {
    return `<svg viewBox="0 0 320 186" width="320" height="186" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="76" y="6" width="168" height="34" rx="8" fill="#E8C24A" stroke="${INK}" stroke-width="2.5"/>
      <text x="160" y="28" text-anchor="middle" fill="${INK}" font-size="13">${card}</text>
      <line x1="160" y1="42" x2="160" y2="56" stroke="#E0568C" stroke-width="3"/><polygon points="160,62 154,52 166,52" fill="#E0568C"/>
      <text x="176" y="58" fill="#E0568C" font-size="13">which bin?</text>
      <rect x="8" y="68" width="146" height="94" rx="10" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
      <text x="81" y="92" text-anchor="middle" fill="${INK}" font-size="13">INHERITED</text>
      <text x="81" y="114" text-anchor="middle" fill="${INK}" font-size="11">born with it —</text>
      <text x="81" y="132" text-anchor="middle" fill="${INK}" font-size="11">came from your</text>
      <text x="81" y="150" text-anchor="middle" fill="${INK}" font-size="11">parents’ genes</text>
      <rect x="166" y="68" width="146" height="94" rx="10" fill="#DCEEF9" stroke="#5F98C4" stroke-width="3"/>
      <text x="239" y="92" text-anchor="middle" fill="${INK}" font-size="13">ACQUIRED</text>
      <text x="239" y="114" text-anchor="middle" fill="${INK}" font-size="11">happened to you</text>
      <text x="239" y="132" text-anchor="middle" fill="${INK}" font-size="11">during your life —</text>
      <text x="239" y="150" text-anchor="middle" fill="${INK}" font-size="11">not passed on</text>
      <text x="160" y="180" text-anchor="middle" fill="#7A7065" font-size="10.5">only the left bin is passed on to your children</text>
    </svg>`;
  }

  /** mum + dad and three children, each labelled with one feature */
  function familySvg(f, kids) {
    const kid = (cx, n) => `<circle cx="${cx}" cy="${140}" r="21" fill="#C9B8F2" stroke="${INK}" stroke-width="2"/>
      <text x="${cx}" y="${145}" text-anchor="middle" fill="${INK}" font-size="13">${n}</text>
      <text x="${cx}" y="${180}" text-anchor="middle" fill="${INK}" font-size="11.5">${kids[n - 1]}</text>`;
    return `<svg viewBox="0 0 320 192" width="320" height="192" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="160" y="13" text-anchor="middle" fill="${INK}" font-size="11.5">${f.trait} in one family</text>
      <circle cx="70" cy="42" r="21" fill="#F5C3D4" stroke="${INK}" stroke-width="2"/><text x="70" y="47" text-anchor="middle" fill="${INK}">Mum</text>
      <circle cx="250" cy="42" r="21" fill="#A9D8F5" stroke="${INK}" stroke-width="2"/><text x="250" y="47" text-anchor="middle" fill="${INK}">Dad</text>
      <text x="70" y="80" text-anchor="middle" fill="${INK}" font-size="11.5">${f.mum}</text>
      <text x="250" y="80" text-anchor="middle" fill="${INK}" font-size="11.5">${f.dad}</text>
      <line x1="70" y1="86" x2="70" y2="96" stroke="${INK}" stroke-width="2"/>
      <line x1="250" y1="86" x2="250" y2="96" stroke="${INK}" stroke-width="2"/>
      <line x1="70" y1="96" x2="250" y2="96" stroke="${INK}" stroke-width="2"/>
      <line x1="160" y1="96" x2="160" y2="106" stroke="${INK}" stroke-width="2"/>
      <line x1="60" y1="106" x2="260" y2="106" stroke="${INK}" stroke-width="2"/>
      ${[60, 160, 260].map((x) => `<line x1="${x}" y1="106" x2="${x}" y2="119" stroke="${INK}" stroke-width="2"/>`).join('')}
      ${kid(60, 1)}${kid(160, 2)}${kid(260, 3)}
    </svg>`;
  }

  const milkTable = (a, b) => `<table class="data"><tr><th>Herd</th><th>Milk per cow (L/day)</th></tr>
    <tr><td>great-grandparents’</td><td>${a}</td></tr><tr><td>today</td><td>${b}</td></tr>
    <tr><td colspan="2">bred from the best milkers</td></tr></table>`;

  /* ---------- question makers ---------- */
  function traitTypeQ() {
    const t = R.pick(TRAITS);
    return {
      prompt: `Is <b>${t.name}</b> continuous or discontinuous variation?`,
      answer: textAns(t.type, [], 'one word'),
      hint: 'Do you MEASURE it (continuous) or do you fall into one of a few GROUPS (discontinuous)?',
      working: [
        '<b>Picture:</b> continuous is a ramp — every point in between exists. Discontinuous is a set of steps with gaps.',
        `1. Could you land anywhere in between with ${t.name}? ${t.type === 'continuous' ? 'Yes.' : 'No — there are separate groups.'}`,
        `So it is <b>${t.type}</b> variation, because ${t.why}.`,
      ],
      finalAnswer: t.type, skill: 'variation',
    };
  }
  function traitWhyQ() {
    const t = R.pick(TRAITS);
    return {
      prompt: `<b>${cap(t.name)}</b> is ${t.type} variation. Why?`,
      answer: ch(t.why, TRAITS.map((x) => x.why)),
      hint: t.type === 'continuous' ? 'Continuous means you measure it and any value is possible.' : 'Discontinuous means a few separate groups with nothing in between.',
      working: ['<b>Picture:</b> a ramp (continuous) or a set of steps (discontinuous).', `${cap(t.name)} is ${t.type}, because <b>${t.why}</b>.`],
      finalAnswer: t.why, skill: 'variation',
    };
  }
  function traitExampleQ() {
    const wantCont = R.chance(0.5);
    const good = R.pick(TRAITS.filter((t) => (wantCont ? t.type === 'continuous' : t.type === 'discontinuous')));
    return {
      prompt: `Which of these is an example of <b>${wantCont ? 'continuous' : 'discontinuous'}</b> variation?`,
      answer: ch(good.name, TRAITS.filter((t) => t.type !== good.type).map((t) => t.name)),
      hint: wantCont ? 'Look for something you would measure with a ruler or scales.' : 'Look for something where you fall into one of a few groups.',
      working: [
        '<b>Picture:</b> a ramp = continuous, steps with gaps = discontinuous.',
        `1. Which option would you ${wantCont ? 'measure' : 'sort into groups'}? <b>${good.name}</b>.`,
        `${cap(good.why)}.`,
      ],
      finalAnswer: good.name, skill: 'variation',
    };
  }
  function wordQ() {
    const w = R.pick(WORDS);
    if (R.chance(0.5)) {
      return {
        prompt: `What does <b>${w.word}</b> mean?`,
        answer: ch(w.mean, WORDS.map((x) => x.mean)),
        hint: `An example is ${w.ex}.`,
        working: [`<b>Example:</b> ${w.ex}.`, `${cap(w.word)} means <b>${w.mean}</b>.`],
        finalAnswer: w.mean, skill: 'words',
      };
    }
    return {
      prompt: `Which word means "<b>${w.mean}</b>"?`,
      answer: textAns(w.word, WORD_ACCEPT[w.word], 'one or two words'),
      hint: `Think of ${w.ex}.`,
      working: [`<b>Example:</b> ${w.ex}.`, `That word is <b>${w.word}</b>.`],
      finalAnswer: w.word, skill: 'words',
    };
  }
  function sortQ(level) {
    const item = R.pick(INH_ACQ);
    const askWhy = level >= 2 && R.chance(0.4);
    if (askWhy) {
      return {
        visual: sortSvg(item.card),
        prompt: `Sort the card. <b>Why</b> does ${item.full} go in that bin?`,
        answer: ch(item.why, INH_ACQ.map((x) => x.why)),
        hint: 'Ask: were you born with it, or did it happen to you later?',
        working: ['<b>Picture:</b> two bins — "born with it" and "happened to me".', `1. Was ${item.full} there at birth? <b>${item.kind === 'inherited' ? 'Yes.' : 'No.'}</b>`, `So it is <b>${item.kind}</b>: ${item.why}.`],
        finalAnswer: item.why, skill: 'inherited-acquired',
      };
    }
    return {
      visual: sortSvg(item.card),
      prompt: `Which bin does <b>${item.full}</b> go in?`,
      answer: textAns(item.kind, [], 'one word'),
      hint: 'Were you born with it (inherited), or did it happen during your life (acquired)?',
      working: ['<b>Picture:</b> two bins — "born with it" and "happened to me".', `1. Could a newborn baby have it? <b>${item.kind === 'inherited' ? 'Yes.' : 'No.'}</b>`, `So it goes in the <b>${item.kind}</b> bin — ${item.why}.`],
      finalAnswer: item.kind, skill: 'inherited-acquired',
    };
  }
  function passOnQ(level) {
    const item = R.pick(INH_ACQ);
    const yes = item.kind === 'inherited';
    return {
      prompt: `Could <b>${item.full}</b> be passed on to a person’s children?`,
      answer: ch(yes ? 'Yes — it is carried in the genes' : 'No — it is not carried in the genes', ['Yes — it is carried in the genes', 'No — it is not carried in the genes', 'Only if it happened before they were 10'], 3),
      hint: 'Only things written in your genes get passed on. Anything that happened to your body does not.',
      working: [
        '<b>Picture:</b> genes are the recipe. Whatever happens to the cake afterwards is never written back into the recipe.',
        `1. Is ${item.full} in the recipe or is it something that happened to the cake? <b>${yes ? 'In the recipe.' : 'Something that happened to the cake.'}</b>`,
        `So the answer is <b>${yes ? 'yes' : 'no'}</b> — ${item.why}.`,
      ],
      finalAnswer: yes ? 'Yes — it is carried in the genes' : 'No — it is not carried in the genes', skill: 'inherited-acquired',
    };
  }
  const GENE_TEXT = [
    { p: 'Where in a cell are the genes kept?', a: 'nucleus', accept: ['the nucleus', 'in the nucleus'], full: 'in the nucleus' },
    { p: 'What are chromosomes made of?', a: 'DNA', accept: ['dna'], full: 'DNA' },
  ];
  const GENE_CHOICE = [
    { p: 'What is a <b>gene</b>?', a: 'a short section of DNA carrying one instruction', w: ['a tiny animal inside the cell', 'the jelly that fills a cell', 'a kind of blood cell'] },
    { p: 'How many chromosomes are in a normal human body cell?', a: '46 (23 pairs)', w: ['23 (no pairs)', '2', '100'] },
    { p: 'Where did the DNA in your cells come from?', a: 'half from your mother and half from your father', w: ['all of it from your mother', 'all of it from your father', 'it was made new when you were born'] },
    { p: 'Genes are instructions for what?', a: 'building and running your body', w: ['storing your memories', 'carrying oxygen', 'digesting food only'] },
    { p: 'Which of these is the right order, biggest to smallest?', a: 'cell → nucleus → chromosome → gene', w: ['gene → chromosome → nucleus → cell', 'chromosome → cell → gene → nucleus', 'nucleus → cell → gene → chromosome'] },
    { p: 'Why do family members look alike but not identical?', a: 'Each child gets a different mix of genes from the same two parents', w: ['Children copy the way their parents look', 'Each child gets all its genes from one parent', 'Looks are decided by what you eat'] },
    { p: 'Which cells carry only <b>half</b> a set of genes?', a: 'sperm cells and egg cells', w: ['red blood cells', 'nerve cells', 'skin cells'] },
  ];
  function geneQ() {
    if (R.chance(2 / 9)) {
      const f = R.pick(GENE_TEXT);
      return {
        prompt: f.p,
        answer: textAns(f.a, f.accept, 'one word'),
        hint: 'DNA is coiled into chromosomes, which sit in the nucleus. A gene is one short piece of that DNA.',
        working: ['<b>Picture:</b> the nucleus is a library, a chromosome is a book, and a gene is one sentence in it.', `Answer: <b>${f.full}</b>.`],
        finalAnswer: f.full, skill: 'genes',
      };
    }
    const f = R.pick(GENE_CHOICE);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'DNA is coiled into chromosomes, which sit in the nucleus. A gene is one short piece of that DNA.',
      working: ['<b>Picture:</b> the nucleus is a library, a chromosome is a book, and a gene is one sentence in it.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'genes',
    };
  }
  function twinQ() {
    const forms = [
      { p: 'How do <b>identical</b> twins form?', a: 'One fertilised egg splits into two', w: ['Two eggs are fertilised by two sperm', 'Two babies grow from the same sperm', 'One baby splits in half at birth'] },
      { p: 'How do <b>non-identical</b> twins form?', a: 'Two eggs are fertilised by two different sperm', w: ['One fertilised egg splits into two', 'One egg is fertilised twice by the same sperm', 'The mother has two nuclei'] },
      { p: 'Identical twins have exactly the same genes. How alike are <b>non-identical</b> twins?', a: 'About as alike as any brother and sister', w: ['Exactly the same as each other', 'Completely different, with no shared genes', 'Alike only if they are the same sex'] },
      { p: 'One identical twin trains hard and gets much stronger than the other. Why are they now different?', a: 'The difference is acquired — caused by the environment, not the genes', w: ['Their genes changed with the training', 'They were never really identical', 'Training changes your chromosomes'] },
      { p: 'Why are identical twins so useful to scientists?', a: 'Their genes are the same, so any difference must come from the environment', w: ['They are easier to find than other people', 'They always behave the same way', 'They have twice as many genes'] },
      { p: 'Do identical twins have exactly the same fingerprints?', a: 'No — fingerprints also depend on how the skin grew before birth', w: ['Yes, always exactly the same', 'Yes, but only until they are ten', 'No, because their genes are different'] },
    ];
    if (R.chance(1 / 7)) {
      return {
        prompt: 'Two twins are a boy and a girl. What kind of twins must they be?',
        answer: textAns('non-identical', ['non identical', 'fraternal', 'fraternal twins'], 'one word'),
        hint: 'Identical = ONE egg that split (same genes, so always the same sex). Non-identical = TWO eggs.',
        working: ['<b>Picture:</b> identical twins are one cake cut in half. Non-identical twins are two cakes baked from the same recipe book on the same day.', 'Identical twins share every gene, so they are always the same sex.', 'A boy and a girl cannot be identical.', 'Answer: <b>non-identical</b>.'],
        finalAnswer: 'non-identical', skill: 'twins',
      };
    }
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Identical = ONE egg that split (same genes). Non-identical = TWO eggs (an ordinary brother/sister mix).',
      working: ['<b>Picture:</b> identical twins are one cake cut in half. Non-identical twins are two cakes baked from the same recipe book on the same day.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'twins',
    };
  }
  function familyQ(level) {
    const f = R.pick(FAMILY);
    const kids = R.shuffle([f.mum, f.dad, R.chance(0.5) ? f.mum : f.dad]);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 3);
    if (form === 1) {
      const want = R.chance(0.5) ? f.mum : f.dad;
      const n = kids.filter((k) => k === want).length;
      return {
        visual: familySvg(f, kids),
        prompt: `Look at the family chart. How many of the three children have <b>${want}</b>?`,
        answer: { type: 'number', value: n, unit: 'children' },
        hint: 'Read the label under each child and count the matches.',
        working: [`Child 1: ${kids[0]}. Child 2: ${kids[1]}. Child 3: ${kids[2]}.`, `Matching "${want}": <b>${n}</b>.`],
        finalAnswer: `${n}`, skill: 'family',
      };
    }
    if (form === 2) {
      const i = R.int(0, 2);
      const from = kids[i] === f.mum ? 'Mum' : 'Dad';
      return {
        visual: familySvg(f, kids),
        prompt: `Child ${i + 1} has <b>${kids[i]}</b>. Which parent shows the same feature?`,
        answer: ch(from, ['Mum', 'Dad', 'neither of them'], 3),
        hint: 'Look at the two labels under Mum and Dad and find the one that matches.',
        working: [`<b>Picture:</b> the child’s genes came half from each parent.`, `1. Mum shows "${f.mum}", Dad shows "${f.dad}".`, `2. Child ${i + 1} shows "${kids[i]}" — that matches <b>${from}</b>.`],
        finalAnswer: from, skill: 'family',
      };
    }
    return {
      visual: familySvg(f, kids),
      prompt: 'The three children have the same two parents. Why are they <b>not all the same</b>?',
      answer: ch('Each child got a different mix of genes from the two parents', ['One of them must have a different parent', 'Children change to look like whoever they spend time with', 'The features were caused by what they ate'], 4),
      hint: 'Each child gets half from each parent — but not the SAME half.',
      working: [
        '<b>Picture:</b> two card packs shuffled together, and each child is dealt a different hand.',
        '1. Does each child get half its genes from each parent? Yes.',
        '2. Is it the same half every time? <b>No</b> — it is a different mix each time.',
        'So brothers and sisters look alike but <b>never identical</b> (unless they are identical twins).',
      ],
      finalAnswer: 'Each child got a different mix of genes from the two parents', skill: 'family',
    };
  }
  function chartQ(level) {
    const cont = R.chance(0.5);
    const vals = cont ? [R.pick([2, 3, 4]), R.pick([8, 9, 10]), R.pick([6, 7]), R.pick([2, 3])]
      : [R.pick([12, 14, 16]), R.pick([6, 8, 9]), R.pick([2, 3]), R.pick([4, 5])];
    const cats = cont ? ['140–149 cm', '150–159 cm', '160–169 cm', '170–179 cm'] : ['brown', 'blue', 'green', 'hazel'];
    const total = vals.reduce((a, b) => a + b, 0);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 5);
    if (form === 1) {
      const i = R.int(0, 3);
      return {
        visual: varChartSvg(cont, vals),
        prompt: `Read the chart. How many students are in the <b>${cats[i]}</b> group?`,
        answer: { type: 'number', value: vals[i], unit: 'students' },
        hint: 'Find that bar, then run your finger up to the scale on the left.',
        working: ['<b>Picture:</b> the taller the bar, the more students.', `The "${cats[i]}" bar reaches <b>${vals[i]}</b>.`],
        finalAnswer: `${vals[i]} students`, skill: 'data',
      };
    }
    if (form === 2) {
      const best = cats[vals.indexOf(Math.max.apply(null, vals))];
      return {
        visual: varChartSvg(cont, vals),
        prompt: 'Read the chart. Which group is the <b>most common</b>?',
        answer: ch(best, cats, 4),
        hint: 'The most common group has the tallest bar.',
        working: ['<b>Picture:</b> tallest bar = biggest group.', `The tallest bar is <b>${best}</b>.`],
        finalAnswer: best, skill: 'data',
      };
    }
    if (form === 3) {
      return {
        visual: varChartSvg(cont, vals),
        prompt: 'Read the chart. How many students were surveyed <b>altogether</b>?',
        answer: { type: 'number', value: total, unit: 'students' },
        hint: 'Add up every bar.',
        working: [`${vals.join(' + ')} = <b>${total}</b> students.`],
        finalAnswer: `${total} students`, skill: 'data',
      };
    }
    if (form === 4) {
      return {
        visual: varChartSvg(cont, vals),
        prompt: 'Does this chart show <b>continuous</b> or <b>discontinuous</b> variation?',
        answer: textAns(cont ? 'continuous' : 'discontinuous', [], 'one word'),
        hint: 'Measured in a range with values in between = continuous. A few named groups = discontinuous.',
        working: [
          '<b>Picture:</b> a ramp (continuous) or steps with gaps (discontinuous).',
          `1. Are the groups <b>${cont ? 'measured ranges like 150–159 cm' : 'separate named groups like brown and blue'}</b>? Yes.`,
          `So the chart shows <b>${cont ? 'continuous' : 'discontinuous'}</b> variation.`,
        ],
        finalAnswer: cont ? 'continuous' : 'discontinuous', skill: 'data',
      };
    }
    const i = R.int(0, 2);
    return {
      visual: varChartSvg(cont, vals),
      prompt: `Read the chart. How many <b>more</b> students are in the "${cats[i]}" group than the "${cats[i + 1]}" group?`,
      answer: { type: 'number', value: Math.abs(vals[i] - vals[i + 1]), unit: 'students' },
      hint: 'Read both bars, then subtract the smaller from the bigger.',
      working: [`${cats[i]}: ${vals[i]}. ${cats[i + 1]}: ${vals[i + 1]}.`, `Difference = <b>${Math.abs(vals[i] - vals[i + 1])}</b> students.`],
      finalAnswer: `${Math.abs(vals[i] - vals[i + 1])} students`, skill: 'data',
    };
  }
  function breedQ(level) {
    const b = R.pick(BREEDS);
    if (R.chance(0.5)) {
      return {
        prompt: `A farmer or grower has bred <b>${b.thing}</b>. What were they selecting for?`,
        answer: ch(b.want, BREEDS.map((x) => x.want)),
        hint: 'Ask what that plant or animal is famous for.',
        working: ['<b>Picture:</b> every generation, only the best ones are chosen as parents.', `${cap(b.thing)} were bred for <b>${b.want}</b>.`],
        finalAnswer: b.want, skill: 'breeding',
      };
    }
    return {
      prompt: `Which one was selectively bred for <b>${b.want}</b>?`,
      answer: ch(b.thing, BREEDS.map((x) => x.thing)),
      hint: 'Match the wanted feature to the animal or plant it belongs to.',
      working: [`<b>Picture:</b> choosing the parents you want, over and over.`, `${cap(b.want)} → <b>${b.thing}</b>.`],
      finalAnswer: b.thing, skill: 'breeding',
    };
  }
  function breedHowQ(level) {
    const forms = [
      { p: 'What is <b>selective breeding</b>?', a: 'People choose which parents breed, so the young have the features people want', w: ['Animals choose their own mates in the wild', 'Changing an animal’s genes with a needle', 'Feeding animals so they grow bigger'] },
      { p: 'A farmer wants sheep with finer wool. What should she do each year?', a: 'Breed only from the sheep with the finest wool', w: ['Shear the sheep more often', 'Feed all the sheep more grass', 'Keep the sheep somewhere colder'] },
      { p: 'Why does selective breeding take many generations?', a: 'Each generation is only slightly better than the last, so the change builds up slowly', w: ['The animals have to get used to the idea', 'Genes only change once a year', 'It does not — it works in one generation'] },
      { p: 'Is selective breeding a natural process?', a: 'No — people choose the parents, instead of the environment deciding who survives', w: ['Yes, it is exactly the same as natural selection', 'Yes, because it uses genes', 'No, because no genes are involved'] },
      { p: 'How is selective breeding different from natural selection?', a: 'In selective breeding <b>people</b> choose the parents; in natural selection the environment does', w: ['They are two names for the same thing', 'Selective breeding does not use genes', 'Natural selection only happens to plants'] },
      { p: 'What has to already exist in a flock before you can selectively breed from it?', a: '<b>Variation</b> — the animals must already be different from each other', w: ['A vet', 'Exactly the same genes in every animal', 'At least a hundred animals'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Selective breeding = pick the parents you want, repeat for many generations.',
      working: ['<b>Picture:</b> a farmer standing at a gate letting only the best two sheep through to breed — every year, for fifty years.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'breeding',
    };
  }
  function breedProblemQ() {
    const forms = [
      { p: 'What is the main risk of breeding thousands of plants that are all almost identical?', a: 'One disease that beats one plant can wipe out the whole crop', w: ['They will grow more slowly', 'They will not need any water', 'They will turn back into wild plants'] },
      { p: 'Selective breeding reduces variation in a population. Why is that a problem?', a: 'If the conditions change, there may be no individuals able to cope', w: ['The animals get bored', 'It makes the animals grow too fast', 'Genes wear out over time'] },
      { p: 'Some pedigree dog breeds have painful hip problems. What causes that?', a: 'Breeding closely related dogs together brings out inherited health problems', w: ['Dogs get hip problems from running', 'Their food is too rich', 'They were bred with wolves'] },
      { p: 'Dogs bred for very short flat faces often struggle to breathe. What does that show?', a: 'Breeding hard for looks can leave an animal less healthy', w: ['Short faces need more oxygen', 'It shows the breed is very fit', 'Breathing is an acquired characteristic'] },
      { p: 'In 2010 a disease swept through New Zealand’s gold kiwifruit vines, which were nearly all the same variety. Why did it spread so fast?', a: 'The vines were almost genetically identical, so what beat one beat them all', w: ['The vines were too far apart', 'The vines had no roots', 'Kiwifruit cannot catch diseases'] },
      { p: 'How can growers protect a crop against that kind of disaster?', a: 'Keep a range of different varieties, so some have genes that resist the disease', w: ['Plant everything even closer together', 'Use only one variety, but more of it', 'Stop breeding new plants at all'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Selective breeding always throws variation away — and variation is the safety net.',
      working: [
        '<b>Picture:</b> a whole orchard of identical trees is like a class where everyone has the same immune system — one bug and everybody is off sick.',
        '1. Selective breeding makes the population <b>more alike</b>.',
        '2. Less variation = less chance that anybody can cope with a change.',
        `Answer: <b>${f.a}</b>.`,
      ],
      finalAnswer: f.a, skill: 'breeding-risk',
    };
  }
  function survivalQ() {
    const forms = [
      { p: 'Why does variation matter for the survival of a species?', a: 'If conditions change, some individuals will happen to have features that let them cope', w: ['It makes the animals look nicer', 'It lets animals choose to change themselves', 'It stops the species from breeding'] },
      { p: 'Beetles in one area vary from pale to dark. Birds hunt the ones they can see. What happens over many generations?', a: 'The best-hidden beetles survive and have more young, so that colour becomes common', w: ['All the beetles change colour to hide', 'The beetles stop breeding', 'Nothing changes — colour is acquired'] },
      { p: 'Kākāpō numbers dropped so low that all the survivors are closely related. Why does that worry scientists?', a: 'There is very little variation left, so the species may not cope with a new disease', w: ['The birds will forget how to feed', 'Their genes will run out', 'They will start to look like other parrots'] },
      { p: 'A herd is hit by a new disease and a few animals survive. What was most likely true of those few?', a: 'They already had genes that happened to help them resist it', w: ['They wanted to survive more than the others', 'They changed their genes when they got sick', 'They were the youngest animals'] },
      { p: 'Which sentence about adaptation is written correctly?', a: 'The individuals that happened to suit the conditions survived and had more young', w: ['The animals decided to change to suit the conditions', 'The animals grew the features they needed', 'The environment changed the animals’ genes on purpose'] },
      { p: 'Where does the variation in a population come from in the first place?', a: 'Each offspring gets a different mix of genes from its two parents', w: ['Animals copy each other', 'The weather changes their genes', 'Variation appears only in captivity'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Nobody chooses to change. The ones that already suit the conditions simply leave more young.',
      working: [
        '<b>Picture:</b> a class sitting a surprise test. Nobody can decide to be ready — the ones who happen to know the topic do best.',
        '1. Variation means the individuals are already different.',
        '2. When conditions change, some of those differences turn out to help.',
        `Answer: <b>${f.a}</b>.`,
      ],
      finalAnswer: f.a, skill: 'survival',
    };
  }
  function inhCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const total = R.pick([20, 25, 30, 40]), pct = R.pick([25, 40, 60, 75]);
      return {
        prompt: `<b>${pct}%</b> of the <b>${total}</b> students in a class can roll their tongue. How many students is that?`,
        answer: { type: 'number', value: (total * pct) / 100, unit: 'students' },
        hint: `Find 1% (divide by 100), then multiply by ${pct}.`,
        working: [`1% of ${total} = ${total / 100}.`, `${pct}% = ${total / 100} × ${pct} = <b>${(total * pct) / 100}</b> students.`],
        finalAnswer: `${(total * pct) / 100} students`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const half = R.pick([23, 23, 23]);
      const which = R.pick(['mother', 'father']);
      return {
        prompt: `A human body cell has <b>46</b> chromosomes, half from each parent. How many came from your <b>${which}</b>?`,
        answer: { type: 'number', value: half, unit: 'chromosomes' },
        hint: 'Half of 46.',
        working: ['<b>Picture:</b> 23 threads in the egg, 23 threads in the sperm.', `46 ÷ 2 = <b>23</b> chromosomes from your ${which}.`],
        finalAnswer: '23 chromosomes', skill: 'numbers',
      };
    }
    if (form === 3) {
      const total = R.pick([24, 28, 30, 32]), can = R.pick([6, 12, 15, 18]).valueOf();
      const n = Math.min(can, total);
      const pct = Math.round((n / total) * 1000) / 10;
      return {
        prompt: `In a class of <b>${total}</b>, <b>${n}</b> students have free earlobes. What percentage is that? (Round to 1 decimal place.)`,
        answer: { type: 'number', value: pct, unit: '%', tolerance: 0.06 },
        hint: 'Divide the number with free lobes by the total, then × 100.',
        working: [`${n} ÷ ${total} = ${Math.round((n / total) * 10000) / 10000}…`, `× 100 = <b>${pct}%</b>.`],
        finalAnswer: `${pct}%`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const a = R.pick([12, 14, 16]), b = a + R.pick([8, 10, 12]);
      return {
        visual: milkTable(a, b),
        prompt: 'Read the table. How much <b>more</b> milk does a cow give today than in the great-grandparents’ herd?',
        answer: { type: 'number', value: b - a, unit: 'L per day' },
        hint: 'Take the old number away from the new one.',
        working: ['<b>Picture:</b> every year the farmer keeps calves from the best milkers only.', `${b} − ${a} = <b>${b - a}</b> L more each day.`],
        finalAnswer: `${b - a} L per day`, skill: 'numbers',
      };
    }
    const sheep = R.pick([200, 400, 600]), keep = R.pick([5, 10, 25]);
    return {
      prompt: `A farmer has <b>${sheep}</b> ewes and breeds from only the best <b>${keep}%</b> of them. How many ewes is that?`,
      answer: { type: 'number', value: (sheep * keep) / 100, unit: 'ewes' },
      hint: `Find 1% of ${sheep}, then multiply by ${keep}.`,
      working: [`1% of ${sheep} = ${sheep / 100}.`, `${keep}% = ${sheep / 100} × ${keep} = <b>${(sheep * keep) / 100}</b> ewes.`, 'Choosing so few parents makes the flock more alike each year.'],
      finalAnswer: `${(sheep * keep) / 100} ewes`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const item = R.pick(INH_ACQ.filter((x) => x.kind === 'acquired'));
      return {
        visual: sortSvg(item.card),
        prompt: `Harper’s uncle has ${item.full}. Will his new baby be born with it too?`,
        answer: ch('No — it is acquired, so it is not in his genes to pass on', ['Yes — anything a parent has is passed on', 'Yes, but only to a son', 'Only if it happened before the baby was born'], 4),
        hint: 'Only what is written in the genes gets passed on.',
        working: [
          '<b>Picture:</b> genes are a recipe. Whatever happens to the cake afterwards never gets written back into the recipe.',
          `1. Is ${item.full} in the recipe? <b>No</b> — ${item.why}.`,
          '2. So there is nothing to pass on.',
          'The baby will <b>not</b> be born with it.',
        ],
        finalAnswer: 'No — it is acquired, so it is not in his genes to pass on',
      };
    },
    () => ({
      prompt: 'A weightlifter has trained for ten years and has huge muscles. Will his children be born with huge muscles?',
      answer: ch('No — the muscles are acquired, so they are not passed on', ['Yes — his children will be born very strong', 'Yes, but only his sons', 'Yes, because training changes your DNA'], 4),
      hint: 'Did the training change the instructions in his genes, or only his body?',
      working: [
        '<b>Picture:</b> a recipe for a cake. Icing the cake does not change the recipe.',
        '1. Did the training change his genes? <b>No</b> — it changed his body.',
        '2. Only genes are passed on.',
        'So his children are <b>not</b> born with big muscles — though they might inherit a build that trains up well.',
      ],
      finalAnswer: 'No — the muscles are acquired, so they are not passed on',
    }),
    () => ({
      prompt: 'Two identical twins are raised in different towns. One spends every summer surfing, the other stays indoors. At 20 they look quite different. Explain why.',
      answer: ch('Their genes are the same, so the difference must be acquired — caused by how they lived', ['Their genes slowly changed apart', 'They were never really identical twins', 'One of them chose to change her DNA'], 4),
      hint: 'What is the ONE thing that can be different when the genes are the same?',
      working: [
        '<b>Picture:</b> two identical cakes from one recipe — one left in the sun, one kept in a tin.',
        '1. Do identical twins have the same genes? <b>Yes.</b>',
        '2. So the difference cannot be inherited.',
        '3. That leaves the <b>environment</b>: sun, food, exercise, what they practised.',
        'The difference is <b>acquired</b>.',
      ],
      finalAnswer: 'Their genes are the same, so the difference must be acquired — caused by how they lived',
    }),
    (level) => {
      const f = R.pick(FAMILY);
      const kids = R.shuffle([f.mum, f.dad, R.chance(0.5) ? f.mum : f.dad]);
      return {
        visual: familySvg(f, kids),
        prompt: 'Harper’s friend says "these three cannot be brother and sister — they do not match". What would you tell her?',
        answer: ch('They can — each child gets a different mix of the same two parents’ genes', ['She is right, they must have different parents', 'Only twins can be brother and sister', 'Children always look exactly like their mother'], 4),
        hint: 'Half from each parent — but a different half every time.',
        working: [
          '<b>Picture:</b> two card packs shuffled together; each child is dealt a different hand.',
          '1. Does each child get half its genes from each parent? <b>Yes.</b>',
          '2. Is it the same half each time? <b>No.</b>',
          'So brothers and sisters look alike but <b>never identical</b>.',
        ],
        finalAnswer: 'They can — each child gets a different mix of the same two parents’ genes',
      };
    },
    (level) => {
      const cont = R.chance(0.5);
      const vals = cont ? [3, 9, 7, 3] : [14, 8, 3, 5];
      return {
        visual: varChartSvg(cont, vals),
        prompt: `Harper surveyed her class and drew this chart. What kind of variation is she showing, and how can you tell?`,
        answer: ch(
          cont ? 'Continuous — the groups are measured ranges with every value in between possible'
            : 'Discontinuous — there are a few separate groups with nothing in between',
          ['Continuous — the groups are measured ranges with every value in between possible',
            'Discontinuous — there are a few separate groups with nothing in between',
            'Neither — a bar chart cannot show variation'], 3),
        hint: 'Did she MEASURE each person, or put each person into one of a few named groups?',
        working: [
          '<b>Picture:</b> a ramp = continuous, steps with gaps = discontinuous.',
          `1. What is along the bottom? <b>${cont ? 'Measured height ranges in cm.' : 'Named colours.'}</b>`,
          `2. Could someone be halfway between two of them? <b>${cont ? 'Yes — any height is possible.' : 'No — you are in one group only.'}</b>`,
          `So it is <b>${cont ? 'continuous' : 'discontinuous'}</b> variation.`,
        ],
        finalAnswer: cont ? 'Continuous — the groups are measured ranges with every value in between possible' : 'Discontinuous — there are a few separate groups with nothing in between',
      };
    },
    () => {
      const b = R.pick(BREEDS);
      return {
        prompt: `A grower wants ${b.want} in their ${b.thing.replace(/^the /, '')}. What should they do, generation after generation?`,
        answer: ch('Choose the individuals closest to what they want and breed only from those', ['Give every plant or animal extra food', 'Change the environment instead', 'Buy a new variety every year'], 4),
        hint: 'Selective breeding = choose the parents, repeat.',
        working: [
          '<b>Picture:</b> a gate. Only the best individuals are let through to breed.',
          '1. Is there variation to start with? Yes — they are not all the same.',
          `2. Pick the ones with the most ${b.want}, and breed only from them.`,
          '3. Repeat for many generations — the whole population slowly shifts.',
        ],
        finalAnswer: 'Choose the individuals closest to what they want and breed only from those',
      };
    },
    () => ({
      prompt: 'An orchard is planted with thousands of vines that are all cuttings of one single plant. A new disease arrives. Predict what happens, and why.',
      answer: ch('Almost all of them get sick, because they are genetically identical with no resistant plants', ['Only the oldest vines get sick', 'The vines will slowly become resistant on their own', 'Nothing — identical plants cannot catch disease'], 4),
      hint: 'What has been lost when every plant is a copy of one plant?',
      working: [
        '<b>Picture:</b> a whole class with exactly the same immune system — one bug and everyone is off sick.',
        '1. Is there any variation between the vines? <b>No</b> — they are copies.',
        '2. So if the disease beats one, it beats them all.',
        'This really happened to New Zealand gold kiwifruit — growers had to breed a <b>new, more resistant variety</b>.',
      ],
      finalAnswer: 'Almost all of them get sick, because they are genetically identical with no resistant plants',
    }),
    () => ({
      prompt: 'Harper is taller than both her parents were at her age. Her friend says "then height cannot be inherited". Is her friend right?',
      answer: ch('No — height is inherited but also affected by food, sleep and health', ['Yes — height is completely acquired', 'Yes — you can choose how tall you grow', 'No — height is decided only by genes'], 4),
      hint: 'Some features are decided by genes AND by the environment.',
      working: [
        '<b>Picture:</b> genes set the <b>size of the pot</b>; food and health decide how much of the pot the plant fills.',
        '1. Do her genes affect her height? <b>Yes</b> — tall parents tend to have tall children.',
        '2. Does anything else affect it? <b>Yes</b> — diet, sleep and health.',
        'So height is <b>inherited and affected by the environment</b>. That is also why it is continuous variation.',
      ],
      finalAnswer: 'No — height is inherited but also affected by food, sleep and health',
    }),
    () => ({
      prompt: 'A pair of twins are born on the same day. One is a boy, one is a girl. What can you say for certain about them?',
      answer: ch('They are non-identical — they grew from two different fertilised eggs', ['They are identical twins', 'They must have different mothers', 'They have exactly the same genes'], 4),
      hint: 'Identical twins come from ONE egg, so they always have the same set of genes.',
      working: [
        '<b>Picture:</b> identical = one cake cut in half. Non-identical = two cakes baked the same day.',
        '1. Identical twins come from one fertilised egg, so they share every gene — including the ones that set sex.',
        '2. These two are a boy and a girl, so they cannot share every gene.',
        'They must be <b>non-identical</b> — as alike as any brother and sister.',
      ],
      finalAnswer: 'They are non-identical — they grew from two different fertilised eggs',
    }),
    (level) => {
      const t = R.pick(TRAITS.filter((x) => x.type === 'continuous'));
      return {
        prompt: `Harper wants to survey <b>${t.name}</b> across her whole class. Which is the best way to record the results?`,
        answer: ch(`Measure each person in ${t.unit} and group the results into ranges`, ['Sort everyone into just two groups: big and small', 'Ask each person to guess their own value', 'Only record the biggest and the smallest person'], 4),
        hint: `${cap(t.name)} is continuous variation — you measure it.`,
        working: [
          '<b>Picture:</b> a ramp, not steps. Every value in between is possible.',
          `1. Is ${t.name} measured or sorted into named groups? <b>Measured.</b>`,
          `2. So take a real measurement in ${t.unit} for every person.`,
          '3. Then group them into ranges so you can draw a chart with the bars touching.',
        ],
        finalAnswer: `Measure each person in ${t.unit} and group the results into ranges`,
      };
    },
    () => ({
      prompt: 'A friend says "my nana got a tattoo, so my mum was born with one too". What is wrong with that?',
      answer: ch('A tattoo is acquired — it changes the skin, not the genes, so it cannot be passed on', ['Nothing, that is exactly right', 'Tattoos are only passed on to sons', 'Tattoos change your DNA slowly'], 4),
      hint: 'Sort it: was she born with it, or did it happen during her life?',
      working: [
        '<b>Picture:</b> writing on the outside of a recipe card does not change the recipe inside.',
        '1. Was nana born with the tattoo? <b>No.</b>',
        '2. So it is <b>acquired</b>.',
        'Acquired characteristics are never passed on to children.',
      ],
      finalAnswer: 'A tattoo is acquired — it changes the skin, not the genes, so it cannot be passed on',
    }),
  ];

  HL.registerTopic({
    id: 'inheritance', subject: 'science', strand: 'living', order: 12,
    name: 'Variation & inheritance', short: 'Inheritance', animal: 'dolphin',
    blurb: 'Why no two people are the same, and what gets passed from parents to children.',
    example: 'eye colour = inherited · a scar = acquired',
    learn: {
      what: '<p>No two living things of the same kind are exactly alike. Those differences are called <b>variation</b>. Some of them are <b>inherited</b> — they came in the <b>genes</b> your parents passed on, carried on <b>DNA</b> inside the <b>nucleus</b> of every cell. Others are <b>acquired</b>: they happened to you during your life, and they are never passed on.</p><p><b>Picture for this topic:</b> your genes are a <b>recipe</b>. You got half the recipe from your mum and half from your dad, which is why you look like them but not exactly like them. Anything that happens to the cake afterwards — a scar, a suntan, a skill you practised — never gets written back into the recipe.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Variation</b> = the differences between individuals of the same species',
        '<b>Continuous</b> = measured, any value in a range (height). <b>Discontinuous</b> = a few separate groups (tongue rolling)',
        '<b>Inherited</b> = born with it, carried in genes. <b>Acquired</b> = happened during your life, <b>not</b> passed on',
        'Genes are sections of <b>DNA</b>, coiled into <b>chromosomes</b>, kept in the <b>nucleus</b> — 46 chromosomes, 23 from each parent',
        '<b>Identical twins</b> = one egg that split (same genes) · <b>non-identical</b> = two eggs (as alike as any brother and sister)',
        '<b>Selective breeding</b> = people choose the parents, for many generations — but it uses up <b>variation</b>',
      ],
      steps: [
        'For "continuous or discontinuous?", ask "<b>do I measure it, or do I sort it into a few groups?</b>" Measure it (a ramp) → continuous. A few named groups with nothing in between (steps) → discontinuous.',
        'For "inherited or acquired?", ask "<b>could a newborn baby have it?</b>" Yes → inherited. No, it happened later → acquired. Only the inherited ones get passed on.',
        'For a family question, say it out loud: "<b>half from mum, half from dad — but a different half each time</b>." That is why brothers and sisters look alike but never identical.',
        'For twins, count the eggs: <b>one egg that split</b> = identical (same genes). <b>Two eggs</b> = non-identical.',
        'For anything about survival or breeding, never say the animal <b>chose</b> to change. Say the ones that <b>already happened to suit</b> the conditions survived and had more young.',
      ],
      examples: [
        { q: 'Is eye colour continuous or discontinuous variation?',
          working: ['<b>Picture:</b> continuous is a ramp — every point in between exists. Discontinuous is steps with gaps.', '1. Could someone be exactly halfway between brown and blue eyes? <b>No.</b>', '2. So you are in one of a few separate groups.', 'It is <b>discontinuous</b> variation. (Height would be continuous — you measure it.)'],
          a: 'Discontinuous — a few separate groups' },
        { q: 'Harper surveyed her class. Which chart shows continuous variation, and how can you tell?',
          visual: `<svg viewBox="0 0 320 176" width="320" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="80" y="14" text-anchor="middle" fill="#4A4033" font-size="11.5">eye colour (groups)</text>
            <line x1="20" y1="26" x2="20" y2="118" stroke="#4A4033" stroke-width="2"/><line x1="20" y1="118" x2="150" y2="118" stroke="#4A4033" stroke-width="2"/>
            ${[[26, 74], [58, 44], [90, 20], [122, 32]].map(([x, h]) => `<rect x="${x}" y="${118 - h}" width="22" height="${h}" rx="3" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>`).join('')}
            <text x="85" y="136" text-anchor="middle" fill="#4A4033" font-size="10.5">named groups → gaps</text>
            <text x="85" y="156" text-anchor="middle" fill="#E0568C" font-size="12">DIScontinuous</text>
            <text x="240" y="14" text-anchor="middle" fill="#4A4033" font-size="11.5">height (measured, cm)</text>
            <line x1="180" y1="26" x2="180" y2="118" stroke="#4A4033" stroke-width="2"/><line x1="180" y1="118" x2="312" y2="118" stroke="#4A4033" stroke-width="2"/>
            ${[[182, 26], [214, 60], [246, 84], [278, 34]].map(([x, h]) => `<rect x="${x}" y="${118 - h}" width="32" height="${h}" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>`).join('')}
            <text x="246" y="136" text-anchor="middle" fill="#4A4033" font-size="10.5">ranges → bars touch</text>
            <text x="246" y="156" text-anchor="middle" fill="#5F98C4" font-size="12">CONTINUOUS</text>
          </svg>`,
          working: ['<b>Picture:</b> a ramp has every point in between; steps have gaps.', '1. Left chart: the bottom says brown, blue, green, hazel — <b>named groups</b>, so gaps between the bars.', '2. Right chart: the bottom says 140–149 cm, 150–159 cm — <b>measured ranges</b>, so the bars touch.', '3. Could you be 155.4 cm tall? Yes. Could you be halfway between brown and blue? No.'],
          a: 'The right one — height, because it is measured and every value in between is possible' },
        { q: 'Harper’s dad has a scar on his knee from falling off his bike. Will Harper have one too?',
          visual: `<svg viewBox="0 0 320 186" width="320" height="186" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="76" y="6" width="168" height="34" rx="8" fill="#E8C24A" stroke="#4A4033" stroke-width="2.5"/>
            <text x="160" y="28" text-anchor="middle" fill="#4A4033" font-size="13">a scar</text>
            <line x1="160" y1="42" x2="160" y2="56" stroke="#E0568C" stroke-width="3"/><polygon points="160,62 154,52 166,52" fill="#E0568C"/>
            <text x="176" y="58" fill="#E0568C" font-size="13">which bin?</text>
            <rect x="8" y="68" width="146" height="94" rx="10" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
            <text x="81" y="92" text-anchor="middle" fill="#4A4033" font-size="13">INHERITED</text>
            <text x="81" y="114" text-anchor="middle" fill="#4A4033" font-size="11">born with it —</text>
            <text x="81" y="132" text-anchor="middle" fill="#4A4033" font-size="11">came from your</text>
            <text x="81" y="150" text-anchor="middle" fill="#4A4033" font-size="11">parents’ genes</text>
            <rect x="166" y="68" width="146" height="94" rx="10" fill="#DCEEF9" stroke="#E0568C" stroke-width="4"/>
            <text x="239" y="92" text-anchor="middle" fill="#4A4033" font-size="13">ACQUIRED</text>
            <text x="239" y="114" text-anchor="middle" fill="#4A4033" font-size="11">happened to you</text>
            <text x="239" y="132" text-anchor="middle" fill="#4A4033" font-size="11">during your life —</text>
            <text x="239" y="150" text-anchor="middle" fill="#4A4033" font-size="11">not passed on</text>
            <text x="160" y="180" text-anchor="middle" fill="#7A7065" font-size="10.5">a scar goes in the pink bin</text>
          </svg>`,
          working: ['<b>Picture:</b> genes are a recipe. Icing or dropping the cake never changes the recipe.', '1. Was her dad born with the scar? <b>No</b> — it happened when he fell off his bike.', '2. So it is <b>acquired</b>.', '3. Acquired things are not written in the genes, so there is nothing to pass on.'],
          a: 'No — a scar is acquired, so it is never inherited' },
        { q: 'Where exactly are your genes kept, and how much did each parent give you?',
          working: ['<b>Picture:</b> the nucleus is a library, a chromosome is a book, and a gene is one sentence in it.', '1. Genes are short sections of <b>DNA</b>.', '2. DNA is coiled up into <b>chromosomes</b>, which sit in the <b>nucleus</b> of every cell.', '3. A body cell has <b>46</b> chromosomes: <b>23 from mum</b> (in the egg) and <b>23 from dad</b> (in the sperm).'],
          a: 'On DNA, in chromosomes, in the nucleus — 23 chromosomes from each parent' },
        { q: 'Two babies are born as twins: one boy, one girl. Are they identical or non-identical?',
          working: ['<b>Picture:</b> identical = one cake cut in half. Non-identical = two cakes baked on the same day.', '1. Identical twins come from <b>one</b> fertilised egg that split, so they share every gene.', '2. Sharing every gene means they must be the same sex.', '3. These two are not the same sex.', 'So they came from <b>two</b> eggs and two sperm.'],
          a: 'Non-identical — as alike as any brother and sister' },
        { q: 'A farmer wants finer wool. Explain how she uses selective breeding, and what she gives up.',
          visual: `<table class="data"><tr><th>Generation</th><th>Wool fibre (microns)</th></tr>
            <tr><td>1</td><td>24</td></tr><tr><td>5</td><td>21</td></tr><tr><td>10</td><td>18</td></tr>
            <tr><td colspan="2">smaller = finer wool</td></tr></table>`,
          working: ['<b>Picture:</b> a gate — only the best sheep are let through to breed, every single year.', '1. Is there variation to start with? <b>Yes</b> — the flock is not all the same. Without that, nothing can be selected.', '2. She breeds only from the finest-woolled sheep.', '3. Their lambs are finer than average, and she repeats it. 24 → 21 → 18 microns.', '4. But every generation throws variation away, so the flock becomes very alike — and a new disease could hit them all at once.'],
          a: 'Breed only from the finest-woolled sheep each generation — but the flock loses variation' },
        { q: 'Kākāpō numbers fell so low that every survivor is closely related. Why does that worry scientists, and how does it link to variation?',
          working: ['<b>Picture:</b> a whole class with exactly the same immune system — one bug and everybody is off sick.', '1. Where does variation come from? A different <b>mix of genes</b> in every offspring.', '2. With very few, closely related birds, there is hardly any mix left.', '3. If a new disease or a warmer climate arrives, there may be <b>no bird that happens to cope</b>.', '4. That is why every kākāpō is tracked and pairings are chosen to keep as much variation as possible.'],
          a: 'Almost no variation is left, so the species may have nobody able to survive a change' },
      ],
      tips: [
        'Never write "the animal <b>wanted</b> to change" or "she <b>grew</b> the feature because she needed it". Say the ones that <b>happened</b> to suit the conditions survived and had more young.',
        'Learning something, getting a scar or getting a suntan changes your <b>body</b>, never your <b>genes</b> — so it is never passed on.',
        'Height is a sneaky one: it is <b>inherited AND affected by the environment</b> (food, sleep, health). Genes set the size of the pot; food decides how much of it you fill.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [traitTypeQ, traitExampleQ, wordQ, sortQ, geneQ, twinQ, familyQ, chartQ, breedQ, inhCalc]
        : level === 2
          ? [traitTypeQ, traitWhyQ, traitExampleQ, wordQ, sortQ, passOnQ, geneQ, twinQ, familyQ, chartQ, breedQ, breedHowQ, breedProblemQ, survivalQ, inhCalc]
          : [traitWhyQ, wordQ, sortQ, passOnQ, geneQ, twinQ, familyQ, chartQ, breedHowQ, breedProblemQ, survivalQ, inhCalc, traitTypeQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
