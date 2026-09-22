/* Topic: Microbes & health — the three kinds of microbe, useful vs harmful ones,
 * how infectious disease spreads and how to break each route, hygiene, the body's
 * defences, vaccination, antibiotics, and mould-growth fair tests. Living World, order 8. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const MICROBES = [
    {
      key: 'bacteria', name: 'bacteria', one: 'a bacterium', alive: 'Yes — it is a living cell',
      size: 'about 2 µm long (about 1/50 the width of a hair)', um: 2,
      what: 'one living cell with no nucleus, that feeds, grows and splits in two',
      pic: 'a tiny living jelly bean that splits in two every 20 minutes',
      treat: 'antibiotics',
      good: 'yoghurt, cheese, compost and the helpful bacteria in your gut',
      bad: 'strep throat, food poisoning and infected cuts',
    },
    {
      key: 'virus', name: 'viruses', one: 'a virus', alive: 'No — it is not alive on its own',
      size: 'about 0.1 µm across (about 20 times smaller than a bacterium)', um: 0.1,
      what: 'not a cell at all — just a package of instructions in a coat, which has to hijack one of your cells to make copies',
      pic: 'a USB stick full of instructions — useless until you plug it into a computer',
      treat: 'no antibiotic — you rest while your white blood cells beat it',
      good: 'almost none that help us directly',
      bad: 'colds, flu, measles, chickenpox and COVID-19',
    },
    {
      key: 'fungus', name: 'fungi', one: 'a fungus', alive: 'Yes — it is made of living cells',
      size: 'about 5 µm for a yeast cell — bigger than a bacterium', um: 5,
      what: 'a living thing made of cells with a nucleus; yeast is one cell, mould grows in fuzzy threads',
      pic: 'the fuzzy grey patch on forgotten bread in the lunchbox',
      treat: 'antifungal cream or powder',
      good: 'yeast for bread, moulds for blue cheese and for making penicillin',
      bad: "athlete's foot, ringworm and the mould that spoils food",
    },
  ];
  const MNAME = { bacteria: 'bacteria', virus: 'a virus', fungus: 'a fungus' };

  const DISEASES = [
    { name: 'the flu', m: 'virus', r: 'droplets' },
    { name: 'the common cold', m: 'virus', r: 'droplets' },
    { name: 'measles', m: 'virus', r: 'droplets' },
    { name: 'chickenpox', m: 'virus', r: 'droplets' },
    { name: 'COVID-19', m: 'virus', r: 'droplets' },
    { name: 'strep throat', m: 'bacteria', r: 'droplets' },
    { name: 'norovirus (the vomiting bug that races round a camp)', m: 'virus', r: 'touch' },
    { name: 'salmonella food poisoning', m: 'bacteria', r: 'food' },
    { name: 'campylobacter from undercooked chicken', m: 'bacteria', r: 'food' },
    { name: 'typhoid', m: 'bacteria', r: 'water' },
    { name: 'hepatitis A', m: 'virus', r: 'water' },
    { name: 'a tummy bug caught from drinking untreated stream water', m: 'bacteria', r: 'water' },
    { name: "athlete's foot", m: 'fungus', r: 'touch' },
    { name: 'ringworm caught from a new kitten', m: 'fungus', r: 'animals' },
    { name: 'leptospirosis caught milking on a dairy farm', m: 'bacteria', r: 'animals' },
    { name: 'tetanus, from soil getting into a deep cut', m: 'bacteria', r: 'touch' },
    { name: 'rubella', m: 'virus', r: 'droplets' },
    { name: 'TB (tuberculosis)', m: 'bacteria', r: 'droplets' },
    { name: 'cholera', m: 'bacteria', r: 'water' },
    { name: 'a fungal nail infection from a shared shower floor', m: 'fungus', r: 'touch' },
  ];

  const ROUTES = [
    { key: 'droplets', name: 'droplets in the air', how: 'a cough or a sneeze fires thousands of tiny wet drops into the air, and someone else breathes them in',
      brk: 'cough into your elbow, stay home when you are sick, and open a window', pic: 'a sneeze is a spray can' },
    { key: 'touch', name: 'touch', how: 'microbes sit on hands, door handles, phones, towels and drink bottles until the next person picks them up',
      brk: 'wash your hands with soap, and do not share towels or drink bottles', pic: 'hands are the delivery van' },
    { key: 'food', name: 'food', how: 'bacteria multiply in food that is undercooked or left sitting warm',
      brk: 'cook meat right through, keep raw meat away from ready-to-eat food, and keep food in the fridge', pic: 'a warm chicken sandwich left in a bag all day' },
    { key: 'water', name: 'water', how: 'sewage or animal droppings get into a stream, and someone drinks it',
      brk: 'boil or filter water from a stream, and keep sewage and cows out of waterways', pic: 'a stream with a farm just upstream' },
    { key: 'animals', name: 'animals', how: 'a bite, a scratch, an insect, or touching a sick animal passes the microbe on',
      brk: 'wash your hands after touching animals, cover any cuts, and wear gloves on the farm', pic: 'a kitten with a bald itchy patch' },
  ];

  const HYGIENE = [
    { do: 'washing your hands with soap for 20 seconds', why: 'soap breaks the microbes loose from the grease on your skin so the water can rinse them away', route: 'touch' },
    { do: 'coughing into your elbow instead of your hand', why: 'the drops land on your sleeve, not on the hand you are about to open a door with', route: 'droplets' },
    { do: 'cooking chicken right through until it is white', why: 'the heat kills the bacteria that are living in the raw meat', route: 'food' },
    { do: 'keeping raw meat on the bottom shelf of the fridge', why: 'nothing can drip from it onto food that will be eaten without cooking', route: 'food' },
    { do: 'putting leftovers in the fridge instead of leaving them out', why: 'bacteria multiply fast when they are warm and slowly when they are cold', route: 'food' },
    { do: 'boiling water from a bush stream before you drink it', why: 'boiling kills the microbes that got in from animals further upstream', route: 'water' },
    { do: 'staying home from school when you have a fever', why: 'you are breathing out droplets full of the microbe all day', route: 'droplets' },
    { do: 'washing your hands after feeding the calves', why: 'farm animals carry microbes that make people sick', route: 'animals' },
  ];

  const DEFENCES = [
    { name: 'skin', how: 'is an unbroken wall that microbes simply cannot get through', pic: 'the fence right round the house', at: [96, 96] },
    { name: 'mucus in your nose', how: 'traps microbes in sticky snot, and tiny hairs sweep them back out', pic: 'flypaper with a broom behind it', at: [80, 48] },
    { name: 'stomach acid', how: 'kills most of the microbes you swallow with your food', pic: 'a moat of acid at the door', at: [70, 116] },
    { name: 'tears and spit', how: 'wash microbes away and carry a chemical that kills them', pic: 'a hose washing down the path', at: [62, 34] },
    { name: 'white blood cells', how: 'hunt microbes down inside you — some swallow them whole, some make antibodies', pic: 'the guards living inside the house', at: [76, 156] },
    { name: 'a scab', how: 'seals a cut fast so nothing can get in through the gap', pic: 'a plank nailed over a hole in the fence', at: [92, 132] },
  ];

  const USEFUL = [
    { use: 'yoghurt', m: 'bacteria', how: 'bacteria turn the sugar in milk into acid, which thickens the milk and makes it tangy', ask: true },
    { use: 'bread rising', m: 'fungus', how: 'yeast feeds on the sugar in the dough and gives off carbon dioxide bubbles that puff it up', ask: true },
    { use: 'blue cheese', m: 'fungus', how: 'a mould is grown right through the cheese and gives it the blue veins and the strong taste', ask: true },
    { use: 'penicillin and other antibiotics', m: 'fungus', how: 'some moulds make a chemical that kills bacteria, so we grow the mould and collect it', ask: true },
    { use: 'silage on a dairy farm', m: 'bacteria', how: 'bacteria pickle the cut grass in acid so it keeps all winter', ask: true },
    { use: 'the sewage treatment plant', m: 'bacteria', how: 'bacteria eat the waste and break it down into harmless things before the water goes back to the river', ask: true },
    { use: 'the bacteria living in your gut', m: 'bacteria', how: 'they help digest fibre, make some vitamins for you, and crowd out harmful microbes', ask: true },
    { use: 'a compost bin', m: 'both', how: 'bacteria and fungi rot the dead scraps and put the nutrients back into the soil', ask: false },
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
  /** typed synonyms accepted whenever the answer is "which kind of microbe" (bacteria / a virus / a fungus) */
  const MICROBE_ACCEPT = { bacteria: ['bacterium', 'a bacterium', 'bacterias'], virus: ['a virus', 'viruses'], fungus: ['a fungus', 'fungi', 'fungus', 'mould', 'mold'] };
  /** typed synonyms accepted for each of the five spread routes */
  const ROUTE_ACCEPT = {
    droplets: ['droplets in the air', 'in the air', 'airborne', 'droplet'],
    touch: [], food: [], water: [],
    animals: ['an animal'],
  };
  /** typed synonyms accepted for each of the body's own defences */
  const DEFENCE_ACCEPT = {
    skin: [], 'mucus in your nose': ['mucus'], 'stomach acid': ['acid'],
    'tears and spit': ['tears', 'spit', 'tears and saliva'],
    'white blood cells': ['white blood cell'], 'a scab': ['scab'],
  };

  /* ---------- diagrams ---------- */
  /** relative sizes: virus → bacterium → yeast cell → one of your cells */
  function sizeSvg(highlight) {
    const c = (k, def) => (highlight === k ? '#E0568C' : def);
    return `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12">How big? (the order is what matters)</text>
      <circle cx="272" cy="82" r="34" fill="${c('cell', '#A9D8F5')}" stroke="${c('cell', '#5F98C4')}" stroke-width="3"/>
      <circle cx="272" cy="82" r="10" fill="#B9A5E6"/>
      <circle cx="188" cy="92" r="16" fill="${c('fungus', '#E8C24A')}" stroke="${c('fungus', '#C08A10')}" stroke-width="3"/>
      <circle cx="194" cy="76" r="7" fill="${c('fungus', '#E8C24A')}" stroke="${c('fungus', '#C08A10')}" stroke-width="2"/>
      <ellipse cx="90" cy="96" rx="15" ry="6.5" fill="${c('bacteria', '#8FC96E')}" stroke="${c('bacteria', '#6FA04C')}" stroke-width="3"/>
      <circle cx="34" cy="98" r="4.5" fill="${c('virus', '#E0568C')}" stroke="${c('virus', '#B03068')}" stroke-width="2"/>
      <text x="34" y="140" text-anchor="middle" fill="${INK}" font-size="11.5">virus</text>
      <text x="34" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">0.1 µm</text>
      <text x="90" y="140" text-anchor="middle" fill="${INK}" font-size="11.5">bacterium</text>
      <text x="90" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">2 µm</text>
      <text x="188" y="140" text-anchor="middle" fill="${INK}" font-size="11.5">yeast (fungus)</text>
      <text x="188" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">5 µm</text>
      <text x="272" y="140" text-anchor="middle" fill="${INK}" font-size="11.5">your cell</text>
      <text x="272" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">30 µm</text>
      <text x="170" y="180" text-anchor="middle" fill="#6FA04C" font-size="11.5">alive: bacterium ✓ · yeast ✓ · your cell ✓</text>
      <text x="170" y="195" text-anchor="middle" fill="#B03068" font-size="11.5">not alive on its own: virus ✗</text>
    </svg>`;
  }

  /** the five routes a disease takes from a sick person to a well one */
  function routeSvg(highlight, showBreak) {
    const rows = ROUTES.map((rt, i) => {
      const y = 36 + i * 33;
      const on = highlight === rt.key;
      const fill = on ? '#F7D3E2' : '#FDF3E0';
      const line = on ? '#E0568C' : '#D9BE8A';
      const label = showBreak ? rt.brk.split(',')[0] : rt.name;
      return `<rect x="66" y="${y - 12}" width="196" height="24" rx="12" fill="${fill}" stroke="${line}" stroke-width="2"/>
        <text x="164" y="${y + 4}" text-anchor="middle" fill="${on ? '#B03068' : INK}" font-size="11">${label}</text>
        <polygon points="278,${y} 264,${y - 6} 264,${y + 6}" fill="${line}"/>`;
    }).join('');
    return `<svg viewBox="0 0 340 210" width="340" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12">${showBreak ? 'break the route, stop the disease' : 'how a microbe gets from one person to the next'}</text>
      <circle cx="30" cy="96" r="13" fill="#E9A07A" stroke="${INK}" stroke-width="2"/>
      <rect x="20" y="112" width="20" height="30" rx="8" fill="#E9A07A" stroke="${INK}" stroke-width="2"/>
      <text x="30" y="160" text-anchor="middle" fill="#B03068" font-size="10.5">sick</text>
      <circle cx="310" cy="96" r="13" fill="#8FC96E" stroke="${INK}" stroke-width="2"/>
      <rect x="300" y="112" width="20" height="30" rx="8" fill="#8FC96E" stroke="${INK}" stroke-width="2"/>
      <text x="310" y="160" text-anchor="middle" fill="#3F6B22" font-size="10.5">well</text>
      ${rows}
    </svg>`;
  }

  /** the body's own defences, labelled */
  function bodySvg(highlight) {
    const labels = DEFENCES.filter((d) => d.name !== 'a scab').slice().sort((a, b) => a.at[1] - b.at[1]);
    const rows = labels.map((d, i) => {
      const ly = 44 + i * 34;
      const on = highlight === d.name;
      const col = on ? '#E0568C' : INK;
      const short = { skin: 'skin = the wall', 'mucus in your nose': 'mucus = sticky trap', 'stomach acid': 'acid = the moat', 'tears and spit': 'tears = the hose', 'white blood cells': 'white cells = guards' }[d.name];
      return `<line x1="${d.at[0]}" y1="${d.at[1]}" x2="150" y2="${ly - 4}" stroke="${col}" stroke-width="${on ? 2.5 : 1.5}"/>
        <circle cx="${d.at[0]}" cy="${d.at[1]}" r="${on ? 7 : 4}" fill="${on ? 'none' : col}" stroke="${col}" stroke-width="${on ? 3 : 0}"/>
        <text x="156" y="${ly}" fill="${col}" font-size="11.5">${short}</text>`;
    }).join('');
    return `<svg viewBox="0 0 320 210" width="320" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="70" y="16" text-anchor="middle" fill="${INK}" font-size="11.5">your defences</text>
      <circle cx="70" cy="42" r="22" fill="#F6DFC8" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="62" cy="36" r="2.6" fill="${INK}"/><circle cx="78" cy="36" r="2.6" fill="${INK}"/>
      <path d="M62 50 Q70 56 78 50" fill="none" stroke="${INK}" stroke-width="2"/>
      <rect x="44" y="66" width="52" height="86" rx="16" fill="#F6DFC8" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="70" cy="112" rx="15" ry="12" fill="#E9A07A" stroke="${INK}" stroke-width="2"/>
      <circle cx="76" cy="156" r="7" fill="#E0568C" opacity=".55"/>
      <line x1="44" y1="80" x2="26" y2="120" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <line x1="96" y1="80" x2="114" y2="120" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <line x1="58" y1="152" x2="54" y2="194" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <line x1="82" y1="152" x2="86" y2="194" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      ${rows}
    </svg>`;
  }

  /** bar chart of a bread-mould fair test */
  function mouldChartSvg(v) {
    const names = [['warm', 'damp'], ['warm', 'dry'], ['cold', 'damp'], ['cold', 'dry']];
    const cols = ['#8FC96E', '#E8C24A', '#A9D8F5', '#B9A5E6'];
    const max = 40, base = 154, h = 108;
    const bars = v.map((val, i) => {
      const x = 42 + i * 68, bh = Math.max(3, Math.round((val / max) * h));
      return `<rect x="${x}" y="${base - bh}" width="46" height="${bh}" rx="4" fill="${cols[i]}" stroke="${INK}" stroke-width="1.5"/>
        <text x="${x + 23}" y="${base - bh - 5}" text-anchor="middle" fill="${INK}" font-size="11">${val}</text>
        <text x="${x + 23}" y="${base + 15}" text-anchor="middle" fill="${INK}" font-size="11">${names[i][0]}</text>
        <text x="${x + 23}" y="${base + 29}" text-anchor="middle" fill="${INK}" font-size="11">${names[i][1]}</text>`;
    }).join('');
    return `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="160" y="15" text-anchor="middle" fill="${INK}" font-size="11.5">bread mould after 7 days</text>
      <text x="8" y="34" fill="#7A7065" font-size="10.5">squares covered</text>
      <line x1="34" y1="24" x2="34" y2="${base}" stroke="${INK}" stroke-width="2"/>
      <line x1="34" y1="${base}" x2="312" y2="${base}" stroke="${INK}" stroke-width="2"/>
      ${bars}
      <text x="160" y="192" text-anchor="middle" fill="#7A7065" font-size="10.5">same bread · same jar · same 7 days</text>
    </svg>`;
  }
  const mouldTable = (v) => `<table class="data"><tr><th>Slice</th><th>Warmth</th><th>Water</th><th>Squares of mould</th></tr>
    <tr><td>A</td><td>warm cupboard</td><td>sprayed damp</td><td>${v[0]}</td></tr>
    <tr><td>B</td><td>warm cupboard</td><td>dry</td><td>${v[1]}</td></tr>
    <tr><td>C</td><td>fridge</td><td>sprayed damp</td><td>${v[2]}</td></tr>
    <tr><td>D</td><td>fridge</td><td>dry</td><td>${v[3]}</td></tr></table>`;
  const mouldValues = () => [R.int(28, 38), R.int(10, 18), R.int(4, 9), R.int(0, 3)];

  /* ---------- question makers ---------- */
  function microbeFact(level) {
    const m = R.pick(MICROBES);
    const forms = [
      { p: `Is <b>${m.one}</b> alive?`, a: m.alive, w: MICROBES.map((x) => x.alive), n: 3 },
      { p: `What is <b>${m.one}</b>, exactly?`, a: m.what, w: MICROBES.map((x) => x.what), n: 3 },
      { p: `How big is <b>${m.one}</b>?`, a: m.size, w: MICROBES.map((x) => x.size), n: 3 },
      { p: `Which microbes cause <b>${m.bad}</b>?`, a: m.name, w: MICROBES.map((x) => x.name), n: 3, short: m.key === 'bacteria' ? 'bacteria' : m.key === 'virus' ? 'virus' : 'fungus' },
      { p: `Which microbes are used for <b>${m.good}</b>?`, a: m.name, w: MICROBES.map((x) => x.name), n: 3, short: m.key === 'bacteria' ? 'bacteria' : m.key === 'virus' ? 'virus' : 'fungus' },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 2).concat([forms[3]]) : forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, MICROBE_ACCEPT[f.short], 'one word') : ch(f.a, f.w, f.n),
      hint: `Think of ${m.one} as ${m.pic}.`,
      working: [`<b>Picture:</b> ${m.one} is ${m.pic}.`, `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'kinds',
    };
  }
  function sizeQ(level) {
    const forms = [
      { p: 'Which is the <b>smallest</b> of these?', a: 'a virus', w: ['a bacterium', 'a yeast cell', 'one of your own cells'] },
      { p: 'Which is the <b>biggest</b> of these?', a: 'one of your own cells', w: ['a virus', 'a bacterium', 'a yeast cell'] },
      { p: 'Roughly how many times smaller is a virus than a bacterium?', a: 'about 20 times smaller', w: ['about the same size', 'about 2 times smaller', 'about 1000 times bigger'] },
      { p: 'Put these in order, smallest first.', a: 'virus → bacterium → yeast cell → your cell', w: ['bacterium → virus → your cell → yeast cell', 'your cell → yeast cell → bacterium → virus', 'virus → yeast cell → bacterium → your cell'] },
      { p: 'Why do you need an electron microscope to see a virus, when a school microscope shows bacteria?', a: 'A virus is about 20 times smaller than a bacterium — far too small for a light microscope', w: ['Viruses are see-through and bacteria are not', 'Viruses move too fast to photograph', 'Viruses only exist inside cells so they cannot be looked at'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 2) : forms);
    return {
      visual: sizeSvg(),
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Size order: virus, then bacterium, then yeast cell, then your own cells.',
      working: ['<b>Picture:</b> a pea, a marble, a tennis ball and a beach ball.', 'virus (0.1 µm) → bacterium (2 µm) → yeast (5 µm) → your cell (30 µm).', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'size',
    };
  }
  function aliveQ() {
    const forms = [
      { p: 'Which microbe is <b>not really alive</b> on its own?', a: 'a virus', w: ['a bacterium', 'a yeast cell', 'a mould'], short: 'virus', shortAccept: ['a virus', 'viruses'] },
      { p: 'Why do scientists say a virus is not properly alive?', a: 'It cannot feed, grow or make copies by itself — it has to hijack a living cell', w: ['It is too small to be alive', 'It has no colour', 'It dies as soon as it is made'] },
      { p: 'A bacterium can live and multiply in a dish of jelly. Can a virus?', a: 'No — a virus can only copy itself inside a living cell', w: ['Yes, viruses grow in jelly even faster', 'Yes, but only if the jelly is warm', 'No, because viruses need soil'] },
      { p: 'What does a virus need in order to make copies of itself?', a: 'a living cell to hijack', w: ['warm sugary food', 'water and minerals', 'sunlight'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'one word') : ch(f.a, f.w, 4),
      hint: 'A virus is like a USB stick full of instructions — it does nothing until it is plugged into a computer.',
      working: ['<b>Picture:</b> a virus is a USB stick; your cell is the computer.', '1. Can a USB stick do anything on its own? No.', `So: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'kinds',
    };
  }
  function usefulQ(level) {
    const u = R.pick(USEFUL);
    if (u.ask && R.chance(0.5)) {
      const want = MNAME[u.m];
      return {
        prompt: `Which kind of microbe do we use to make <b>${u.use}</b>?`,
        answer: textAns(u.m, MICROBE_ACCEPT[u.m], 'one word'),
        hint: 'Yeast and mould are fungi. Anything soured, pickled or rotted down is usually bacteria.',
        working: [`<b>How it works:</b> ${u.how}.`, `So it is <b>${want}</b>.`],
        finalAnswer: want, skill: 'useful',
      };
    }
    return {
      prompt: `How do microbes help with <b>${u.use}</b>?`,
      answer: ch(u.how, USEFUL.map((x) => x.how), 4),
      hint: 'Most microbes are helpers, not burglars.',
      working: ['<b>Picture:</b> microbes are the neighbours — most of them are helping you.', `With ${u.use}: <b>${u.how}</b>.`],
      finalAnswer: u.how, skill: 'useful',
    };
  }
  function usefulOrHarmful() {
    const items = [
      { thing: 'the bacteria that turn milk into yoghurt', good: true },
      { thing: 'the yeast in a loaf of bread', good: true },
      { thing: 'the bacteria and fungi in a compost bin', good: true },
      { thing: 'the bacteria living in your gut', good: true },
      { thing: 'the mould that penicillin comes from', good: true },
      { thing: 'the bacteria at the sewage treatment plant', good: true },
      { thing: 'the virus that causes measles', good: false },
      { thing: 'the bacteria that grow in warm undercooked chicken', good: false },
      { thing: "the fungus that causes athlete's foot", good: false },
      { thing: 'the mould growing on a forgotten sandwich', good: false },
      { thing: 'the virus that gives you the flu', good: false },
    ];
    const it = R.pick(items);
    const a = it.good ? 'Useful — we want it' : 'Harmful — we want to stop it';
    return {
      prompt: `Is this microbe <b>useful</b> or <b>harmful</b>: ${it.thing}?`,
      answer: it.good
        ? textAns('useful', ['useful — we want it'], 'one word')
        : textAns('harmful', ['harmful — we want to stop it'], 'one word'),
      hint: 'Ask: does it make something we want, or does it make somebody ill?',
      working: ['<b>Picture:</b> microbes are neighbours — most help, a few break in.', `${cap(it.thing)} is <b>${it.good ? 'useful' : 'harmful'}</b>.`],
      finalAnswer: a, skill: 'useful',
    };
  }
  function diseaseType(level) {
    const d = R.pick(DISEASES);
    const want = MNAME[d.m];
    const askShort = level >= 2 && R.chance(0.35);
    return {
      prompt: askShort ? `<b>${cap(d.name)}</b> — which kind of microbe causes it?` : `Which kind of microbe causes <b>${d.name}</b>?`,
      answer: textAns(d.m, MICROBE_ACCEPT[d.m], 'one word'),
      hint: askShort
        ? 'Colds, flu, measles and chickenpox are viruses. Food poisoning, strep throat and sore infected cuts are bacteria. Itchy skin patches are fungi.'
        : 'Coughs, colds and rashes that go round a class are usually viruses; food and cut infections are usually bacteria; itchy skin patches are fungi.',
      working: [`<b>Picture:</b> three families of microbe — bacteria, viruses, fungi.`, `${cap(d.name)} is caused by <b>${want}</b>.`],
      finalAnswer: want, skill: 'diseases',
    };
  }
  function routeQ(level) {
    const d = R.pick(DISEASES);
    const rt = ROUTES.find((x) => x.key === d.r);
    return {
      visual: level === 1 ? routeSvg(undefined, false) : undefined,
      prompt: `How does <b>${d.name}</b> mostly get from one person to another?`,
      answer: textAns(rt.key, ROUTE_ACCEPT[rt.key], 'one word'),
      hint: 'The five routes are: droplets in the air, touch, food, water, animals.',
      working: ['<b>Picture:</b> the microbe needs a lift from one person to the next.', `For ${d.name}, the lift is <b>${rt.name}</b> — ${rt.how}.`],
      finalAnswer: rt.name, skill: 'spread',
    };
  }
  function breakRouteQ(level) {
    const rt = R.pick(ROUTES);
    if (R.chance(0.5)) {
      return {
        visual: routeSvg(rt.key, false),
        prompt: `A disease spreads by <b>${rt.name}</b>. What is the best way to break that route?`,
        answer: ch(rt.brk, ROUTES.map((x) => x.brk), 4),
        hint: `Block the actual lift: ${rt.how}.`,
        working: [`<b>Picture:</b> ${rt.pic}.`, `1. How does it travel? ${cap(rt.how)}.`, `2. So block exactly that: <b>${rt.brk}</b>.`],
        finalAnswer: rt.brk, skill: 'break-route',
      };
    }
    return {
      prompt: `Which route are you blocking when you ${rt.brk.split(',')[0]}?`,
      answer: textAns(rt.key, ROUTE_ACCEPT[rt.key], 'one word'),
      hint: 'Picture the microbe trying to make the journey, and ask which step you just stopped.',
      working: [`<b>Picture:</b> ${rt.pic}.`, `That habit blocks the <b>${rt.name}</b> route.`],
      finalAnswer: rt.name, skill: 'break-route',
    };
  }
  function hygieneQ(level) {
    const h = R.pick(HYGIENE);
    if (R.chance(0.55)) {
      return {
        prompt: `Why does <b>${h.do}</b> help?`,
        answer: ch(h.why, HYGIENE.map((x) => x.why), 4),
        hint: 'Say what the microbes were doing, then what your action does to them.',
        working: ['<b>Picture:</b> you are shutting one of the five doors microbes use.', `${cap(h.do)} works because <b>${h.why}</b>.`],
        finalAnswer: h.why, skill: 'hygiene',
      };
    }
    return {
      prompt: `Which habit best protects you when a microbe spreads by <b>${ROUTES.find((x) => x.key === h.route).name}</b>?`,
      answer: ch(h.do, HYGIENE.map((x) => x.do), 4),
      hint: 'Match the habit to the route it blocks.',
      working: [`<b>Picture:</b> the ${h.route} route is a door — this habit shuts it.`, `Best habit: <b>${h.do}</b>.`],
      finalAnswer: h.do, skill: 'hygiene',
    };
  }
  function defenceQ(level) {
    const d = R.pick(DEFENCES);
    const askName = R.chance(0.5);
    return {
      visual: d.name !== 'a scab' && level <= 2 ? bodySvg(d.name) : undefined,
      prompt: askName ? `Which defence <b>${d.how}</b>?` : `What does <b>${d.name}</b> do to protect you?`,
      answer: askName ? textAns(d.name, DEFENCE_ACCEPT[d.name], 'a word or two') : ch(d.how, DEFENCES.map((x) => x.how), 4),
      hint: `Think of it as ${d.pic}.`,
      working: [`<b>Picture:</b> your body is a house; ${d.name} is ${d.pic}.`, `So ${d.name} <b>${d.how}</b>.`],
      finalAnswer: askName ? d.name : d.how, skill: 'defences',
    };
  }
  function defenceOrder() {
    const forms = [
      { p: 'Which defence stops microbes getting in at all — before they are ever inside you?', a: 'skin', w: ['white blood cells', 'antibodies', 'a fever'], short: 'skin', shortAccept: [] },
      { p: 'A microbe gets past your skin through a cut. Which defence deals with it now?', a: 'white blood cells inside your blood', w: ['stomach acid', 'the mucus in your nose', 'your tears'], short: 'white blood cells', shortAccept: ['white blood cells inside your blood', 'white blood cell'] },
      { p: 'You swallow food with bacteria on it. Which defence meets them first?', a: 'stomach acid', w: ['white blood cells', 'your skin', 'a scab'], short: 'stomach acid', shortAccept: ['acid', 'your stomach acid'] },
      { p: 'You breathe in a lungful of dusty air. Which defence catches the microbes?', a: 'the sticky mucus and tiny hairs in your nose and airways', w: ['stomach acid', 'a scab', 'your tears'] },
      { p: 'What do white blood cells make that sticks to a microbe and marks it for destruction?', a: 'antibodies', w: ['mucus', 'acid', 'enzymes only'], short: 'antibodies', shortAccept: ['antibody'] },
      { p: 'Your defences work in two layers. What is the first layer called?', a: 'barriers that keep microbes out — skin, mucus, acid, tears', w: ['white blood cells', 'antibodies', 'vaccines'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a word or two') : ch(f.a, f.w, 4),
      hint: 'First the walls (skin, mucus, acid, tears), then the guards inside (white blood cells).',
      working: ['<b>Picture:</b> your body is a house — a fence outside, guards inside.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'defences',
    };
  }
  function vaccineQ(level) {
    const forms = [
      { p: 'What is in a <b>vaccine</b>?', a: 'a dead or weakened microbe, or just a harmless piece of one', w: ['a strong dose of the live microbe', 'an antibiotic', 'a vitamin that kills microbes'] },
      { p: 'How does a vaccine protect you?', a: 'Your white blood cells practise on the safe version and remember it, so the real microbe is beaten fast', w: ['It kills every microbe already in your body', 'It puts a chemical shield on your skin', 'It makes your body too hot for microbes'] },
      { p: 'Why does a vaccine <b>not</b> make you ill?', a: 'The microbe in it is dead or weakened, so it cannot multiply and cause the disease', w: ['It is not really a microbe at all, it is soap', 'It only works on people who are already well', 'It does make you ill, that is the point'] },
      { p: 'A vaccinated person meets the real measles virus. What happens?', a: 'Their memory cells recognise it straight away and destroy it before they get sick', w: ['They get measles, but a longer version', 'Nothing happens — the virus cannot enter their body at all', 'The vaccine kills the virus in the air around them'] },
      { p: 'Why does vaccinating most of a school also protect the few children who cannot be vaccinated?', a: 'With almost nobody left to catch it, the microbe cannot find a chain of people to travel along', w: ['The vaccine spreads through the air to them', 'They catch a weak version and get better', 'Unvaccinated children stop being able to catch it after a year'] },
      { p: 'Is a vaccine the same thing as an antibiotic?', a: 'No — a vaccine trains you BEFORE you meet the microbe; an antibiotic is a medicine that kills bacteria AFTER you are ill', w: ['Yes, they are two words for the same medicine', 'No — a vaccine kills bacteria and an antibiotic kills viruses', 'No — a vaccine is a vitamin'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'A vaccine is showing the guards a photo of the burglar, so they know him the second he turns up.',
      working: ['<b>Picture:</b> the guards inside your house get shown a photo of the burglar.', '1. Safe practice now → memory cells made.', '2. Real burglar later → recognised and stopped fast.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'vaccine',
    };
  }
  function antibioticQ(level) {
    const forms = [
      { p: 'What do <b>antibiotics</b> kill?', a: 'bacteria', w: ['viruses', 'every kind of microbe', 'only fungi'], short: 'bacteria', shortAccept: MICROBE_ACCEPT.bacteria },
      { p: 'Why does an antibiotic do nothing at all against a cold?', a: 'A cold is caused by a virus, and a virus is not a living cell for the antibiotic to attack', w: ['Colds are too mild for antibiotics to notice', 'The virus is too big', 'Antibiotics only work in winter'] },
      { p: 'The doctor refuses antibiotics for Harper\'s sore throat because it is viral. Is that right?', a: 'Yes — antibiotics only work on bacteria, so they would do nothing but risk side effects', w: ['No, antibiotics work on everything', 'No, antibiotics would at least shorten it a bit', 'Yes, because antibiotics only work for adults'] },
      { p: 'Why must you finish a whole course of antibiotics, even once you feel better?', a: 'The toughest bacteria survive longest — stop early and they are the ones left to multiply', w: ['The tablets go off if you keep them', 'You will feel ill again immediately if you stop', 'The last tablets are the only ones that work'] },
      { p: 'What are <b>antibiotic-resistant</b> bacteria?', a: 'Bacteria that the antibiotic no longer kills, because the survivors bred more survivors', w: ['Bacteria that have become viruses', 'Bacteria that are bigger than normal', 'Bacteria that only live in hospitals and are harmless'] },
      { p: 'Where did the first antibiotic, penicillin, come from?', a: 'a mould — a fungus that makes a bacteria-killing chemical', w: ['a bacterium grown in a lab', 'a virus that attacks bacteria', 'a mineral dug out of the ground'], short: 'a mould', shortAccept: ['mould', 'a fungus', 'fungus', 'mold', 'a mold'] },
      { p: "What kind of medicine treats athlete's foot?", a: 'an antifungal cream, because it is a fungus', w: ['an antibiotic, because it is bacteria', 'a vaccine, because it is a virus', 'nothing works on it'], short: 'antifungal cream', shortAccept: ['an antifungal cream', 'antifungal'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 2).concat([forms[5]]) : forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a word or two') : ch(f.a, f.w, 4),
      hint: 'Antibiotics attack things that are alive. A virus is not a living cell — and it hides inside your own cells.',
      working: ['<b>Picture:</b> weedkiller kills living weeds. A virus is not a weed, it is a set of instructions.', '1. Is it bacteria? Then an antibiotic works.', '2. Is it a virus? Then it does not.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'antibiotics',
    };
  }
  function mouldTest(level) {
    const v = mouldValues();
    const form = R.int(1, 4);
    if (form === 1) {
      return {
        visual: mouldChartSvg(v),
        prompt: 'Which conditions grew the <b>most</b> mould?',
        answer: textAns('warm and damp', ['warm, damp', 'warm & damp'], 'two words'),
        hint: 'Read the tallest bar.',
        working: [`<b>Picture:</b> mould is a living thing — it wants food, warmth and water.`, `Warm+damp = ${v[0]}, warm+dry = ${v[1]}, cold+damp = ${v[2]}, cold+dry = ${v[3]}.`, 'The tallest bar is <b>warm and damp</b>.'],
        finalAnswer: 'warm and damp', skill: 'fair-test',
      };
    }
    if (form === 2) {
      return {
        visual: mouldTable(v),
        prompt: 'Which two slices should Harper compare to test whether <b>warmth</b> matters?',
        answer: ch('A and C, because both are damp and only the temperature is different', ['A and B, because both are warm', 'B and C, because they are the two middle ones', 'All four at once'], 4),
        hint: 'A fair test changes ONE thing and keeps everything else the same.',
        working: ['<b>Picture:</b> two runners on the same track — only one thing may be different.', '1. A and C are both damp. Only the temperature changes → that tests <b>warmth</b>.', '2. A and B differ in water, not temperature → that tests water instead.', 'So compare <b>A and C</b>.'],
        finalAnswer: 'A and C, because both are damp and only the temperature is different', skill: 'fair-test',
      };
    }
    if (form === 3) {
      return {
        visual: mouldTable(v),
        prompt: 'What conclusion do these results support?',
        answer: ch('Mould grows best when it is both warm and damp', ['Mould only needs warmth, not water', 'Mould only needs water, not warmth', 'Bread always goes mouldy at the same speed'], 4),
        hint: 'Compare A with C (warmth), then A with B (water).',
        working: ['<b>Picture:</b> four identical slices, one thing changed at a time.', `1. A (${v[0]}) beats C (${v[2]}) → <b>warmth helps</b>.`, `2. A (${v[0]}) beats B (${v[1]}) → <b>water helps</b>.`, '3. D, cold and dry, hardly grew anything.', 'So mould grows best when it is <b>warm and damp</b>.'],
        finalAnswer: 'Mould grows best when it is both warm and damp', skill: 'fair-test',
      };
    }
    const forms = [
      { p: 'Why should every slice come from the same loaf?', a: 'So the bread is not the thing that changed — only warmth and water are being tested', w: ['So it is cheaper', 'So the slices weigh the same for the bar chart', 'So the mould has a favourite flavour'] },
      { p: 'Why does Harper seal each slice in its own bag before she starts?', a: 'So the mould cannot spread from one slice to another, and so nobody breathes in the spores', w: ['So the bread stays fresh forever', 'So the bread cannot be weighed', 'Because mould needs no air at all'] },
      { p: 'Why is it better to count squares of mould on a grid than to write "quite a lot"?', a: 'It gives a number, so the slices can be compared fairly and put on a graph', w: ['It makes the experiment take longer', 'Words are always more scientific', 'Squares make the mould grow faster'] },
      { p: 'Why should she repeat the whole experiment three times?', a: 'To check the result was not a one-off — repeats make the conclusion more reliable', w: ['To use up the loaf', 'Because mould grows differently on Tuesdays', 'So she can pick the run with the answer she wanted'] },
      { p: 'Which is the <b>control</b> slice in this experiment?', a: 'D — cold and dry, the conditions where you would expect the least growth', w: ['A, because it grew the most', 'There is no control in this experiment', 'B, because it is second'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'A fair test changes one thing, keeps the rest the same, and measures with numbers.',
      working: ['<b>Picture:</b> two runners on the same track — only one thing may be different.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'fair-test',
    };
  }
  function microbeCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const hours = R.pick([1, 2, 3]);
      const n = Math.pow(2, hours * 3);
      return {
        prompt: `One bacterium splits in two every <b>20 minutes</b>. Starting with 1, how many bacteria are there after <b>${hours} hour${hours > 1 ? 's' : ''}</b>?`,
        answer: { type: 'number', value: n, placeholder: 'e.g. 16' },
        hint: 'Three splits every hour. Double, double, double…',
        working: [`<b>Picture:</b> every 20 minutes each one becomes two.`, `${hours} hour${hours > 1 ? 's' : ''} = ${hours * 3} splits.`, `1 → ${[...Array(Math.min(hours * 3, 6)).keys()].map((i) => Math.pow(2, i + 1)).join(' → ')}${hours * 3 > 6 ? ' → …' : ''}`, `Answer: <b>${n}</b> bacteria.`],
        finalAnswer: `${n} bacteria`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const p = R.pick([[2, 0.1, 20], [4, 0.2, 20], [3, 0.1, 30], [1, 0.1, 10], [4, 0.1, 40], [5, 0.05, 100]]);
      return {
        prompt: `A bacterium is <b>${p[0]} µm</b> long. A virus is <b>${p[1]} µm</b> across. How many times longer is the bacterium?`,
        answer: { type: 'number', value: p[2], unit: 'times' },
        hint: 'Divide the big one by the small one.',
        working: [`${p[0]} ÷ ${p[1]} = <b>${p[2]}</b>.`, `So the bacterium is ${p[2]} times longer.`],
        finalAnswer: `${p[2]} times`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const start = R.pick([200, 400, 600, 800, 2000, 3000]);
      const pct = R.pick([50, 75, 90]);
      const left = (start * (100 - pct)) / 100;
      return {
        prompt: `There were <b>${start}</b> bacteria on Harper's hand. Washing with soap removes <b>${pct}%</b> of them. How many are left?`,
        answer: { type: 'number', value: left, placeholder: 'e.g. 40' },
        hint: `Removing ${pct}% leaves ${100 - pct}%.`,
        working: [`Removed ${pct}%, so <b>${100 - pct}%</b> is left.`, `1% of ${start} = ${start / 100}.`, `${100 - pct}% = ${start / 100} × ${100 - pct} = <b>${left}</b>.`],
        finalAnswer: `${left} bacteria`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const total = R.pick([20, 25, 50]);
      const done = R.pick([total * 0.8, total * 0.6, total * 0.9, total * 0.76]).valueOf();
      const n = Math.round(done);
      const pct = (n / total) * 100;
      return {
        prompt: `<b>${n}</b> of the <b>${total}</b> students in a class are vaccinated against measles. What percentage is that?`,
        answer: { type: 'number', value: pct, unit: '%' },
        hint: 'Divide, then multiply by 100.',
        working: [`${n} ÷ ${total} = ${(n / total).toFixed(2)}.`, `× 100 = <b>${pct}%</b>.`],
        finalAnswer: `${pct}%`, skill: 'numbers',
      };
    }
    const day = R.int(3, 6), start2 = R.pick([1, 2, 3]);
    const end = start2 * Math.pow(2, day - 1);
    return {
      prompt: `A mould patch covers <b>${start2} square${start2 > 1 ? 's' : ''}</b> on day 1 and <b>doubles every day</b>. How many squares on day <b>${day}</b>?`,
      answer: { type: 'number', value: end, unit: 'squares' },
      hint: `From day 1 to day ${day} is ${day - 1} doublings.`,
      working: [`Day 1 → day ${day} is <b>${day - 1}</b> doublings.`, `${start2}${' → ' + [...Array(day - 1).keys()].map((i) => start2 * Math.pow(2, i + 1)).join(' → ')}`, `Answer: <b>${end}</b> squares.`],
      finalAnswer: `${end} squares`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const v = mouldValues();
      return {
        visual: mouldChartSvg(v),
        prompt: 'Harper left four identical slices of bread for a week. Which conclusion do her results support?',
        answer: ch('Mould needs warmth AND water — take either away and it grows much less', ['Mould needs only warmth', 'Mould needs only water', 'Bread goes mouldy at the same rate wherever you keep it'], 4),
        hint: 'Compare the warm damp bar with each of the others.',
        working: ['<b>Picture:</b> mould is a living thing that wants food, warmth and water.', `1. Warm+damp grew ${v[0]}; take the warmth away and it drops to ${v[2]}.`, `2. Take the water away instead and it drops to ${v[1]}.`, `3. Take both away and almost nothing grows (${v[3]}).`, 'So it needs <b>both</b>.'],
        finalAnswer: 'Mould needs warmth AND water — take either away and it grows much less',
      };
    },
    () => ({
      prompt: "Harper has a runny nose and a cough. Her friend says \"just get antibiotics off the doctor\". What is wrong with that?",
      answer: ch('A cold is caused by a virus, and antibiotics only kill bacteria — they would do nothing', ['Antibiotics only work on children under 10', 'Antibiotics would work but they are expensive', 'Nothing is wrong, that is good advice'], 4),
      hint: 'Ask the first question: is it bacteria, or is it a virus?',
      working: ['<b>Picture:</b> weedkiller kills living weeds. A virus is not a living weed.', '1. What causes a cold? A <b>virus</b>.', '2. What do antibiotics kill? <b>Bacteria</b> only.', '3. So the tablets would do nothing — and taking them anyway helps resistant bacteria appear.'],
      finalAnswer: 'A cold is caused by a virus, and antibiotics only kill bacteria — they would do nothing',
    }),
    () => {
      const rt = R.pick(ROUTES);
      const story = {
        droplets: 'Half of Harper\'s class comes down with the same cough in one week, and nobody shared food',
        touch: 'Everyone who used the same drink bottle at netball practice got sick two days later',
        food: 'Six people at a birthday party got stomach cramps that night, and all six ate the chicken that sat out in the sun',
        water: 'A tramping group all got sick after refilling their bottles from a stream below a farm',
        animals: 'A boy who has just got a kitten develops an itchy round patch on his arm',
      };
      return {
        visual: routeSvg(undefined, false),
        prompt: `${story[rt.key]}. Which route did the microbe most likely take?`,
        answer: ch(rt.name, ROUTES.map((x) => x.name), 4),
        hint: 'Look for the one thing all the sick people had in common.',
        working: ['<b>Picture:</b> be a detective — what did all the sick people share?', `That points to the <b>${rt.name}</b> route: ${rt.how}.`, `To stop it next time: ${rt.brk}.`],
        finalAnswer: rt.name,
      };
    },
    () => {
      const rt = R.pick(ROUTES);
      return {
        visual: routeSvg(rt.key, false),
        prompt: `A microbe at Harper's school is spreading by <b>${rt.name}</b>. What single change would help the most?`,
        answer: ch(rt.brk, ROUTES.map((x) => x.brk), 4),
        hint: 'Block the exact step the microbe uses — not a different one.',
        working: [`<b>Picture:</b> ${rt.pic}.`, `1. The microbe travels by <b>${rt.name}</b>.`, '2. Blocking a different route would not touch it.', `So: <b>${rt.brk}</b>.`],
        finalAnswer: rt.brk,
      };
    },
    () => ({
      visual: bodySvg('white blood cells'),
      prompt: 'A microbe gets past Harper\'s skin through a scraped knee. Explain what happens next.',
      answer: ch('White blood cells find it inside her — some swallow it whole, some make antibodies that stick to it', ['Stomach acid comes up and dissolves it', 'Her skin grows back over it and it dies of old age', 'Nothing happens until she takes a vaccine'], 4),
      hint: 'The wall has been breached, so the guards inside take over.',
      working: ['<b>Picture:</b> your body is a house. The fence is broken, so the guards inside do the work.', '1. First defence, skin — <b>failed</b>.', '2. Second layer: <b>white blood cells</b> in the blood.', '3. Some eat the microbe; some make <b>antibodies</b> that stick to it and mark it.', '4. A scab seals the gap so no more can get in.'],
      finalAnswer: 'White blood cells find it inside her — some swallow it whole, some make antibodies that stick to it',
    }),
    () => ({
      prompt: 'Harper had chickenpox when she was five and has never caught it again, even though her cousin had it last year. Why not?',
      answer: ch('Her white blood cells remember that virus, so they destroy it before it can make her ill', ['You can only catch chickenpox once because it uses itself up', 'The virus dies out after a few years', 'Chickenpox only affects five-year-olds'], 4),
      hint: 'What did her body build the first time round?',
      working: ['<b>Picture:</b> the guards were shown the burglar once and never forgot his face.', '1. First time: her body made <b>antibodies</b> — slowly, so she got ill.', '2. It also kept <b>memory cells</b>.', '3. Second time: recognised instantly and destroyed before she notices.', 'That is exactly what a <b>vaccine</b> does, but without the illness.'],
      finalAnswer: 'Her white blood cells remember that virus, so they destroy it before it can make her ill',
    }),
    () => ({
      prompt: 'A yoghurt maker keeps the milk at 42 °C for six hours, then puts the yoghurt in the fridge. Why both steps?',
      answer: ch('The warmth lets the useful bacteria work fast; the cold then slows them right down so it stops there', ['The warmth kills the bacteria and the fridge brings them back', 'The warmth is to melt the milk and the fridge is to set it', 'Both steps are just to save power'], 4),
      hint: 'Microbes multiply fast when warm and slowly when cold — the same rule as food safety.',
      working: ['<b>Picture:</b> warmth is the accelerator, cold is the brake.', '1. 42 °C = perfect for the yoghurt bacteria → they turn milk sugar into acid and it thickens.', '2. Fridge = the brake, so it does not go on souring.', 'Same rule keeps your leftovers safe.'],
      finalAnswer: 'The warmth lets the useful bacteria work fast; the cold then slows them right down so it stops there',
    }),
    () => ({
      prompt: 'Harper says "all microbes are germs and should be killed". Give her a better answer.',
      answer: ch('Most microbes are useful or harmless — they make our food, rot our waste and live helpfully in our gut', ['She is right, all microbes cause disease', 'Only viruses are useful', 'Microbes are not alive so it does not matter'], 4),
      hint: 'Count up the microbes you actually eat on purpose.',
      working: ['<b>Picture:</b> microbes are neighbours; only a few break in.', '1. Useful: <b>yoghurt, bread, cheese, compost, gut bacteria, penicillin</b>.', '2. Harmful: the small number that cause disease.', 'So we block the harmful ones — we do not try to kill them all.'],
      finalAnswer: 'Most microbes are useful or harmless — they make our food, rot our waste and live helpfully in our gut',
    }),
    () => ({
      prompt: 'Why is a chicken sandwich left in a warm school bag all day more dangerous than the same sandwich kept in the fridge?',
      answer: ch('Bacteria multiply very fast when they are warm, so by lunchtime there are millions instead of a few', ['Warm bread grows its own bacteria', 'The fridge kills every bacterium', 'Cold food cannot carry microbes at all'], 4),
      hint: 'Bacteria can double every 20 minutes at body temperature.',
      working: ['<b>Picture:</b> warmth is the accelerator for bacteria.', '1. A few bacteria at 8am, doubling every 20 min.', '2. By lunch that is millions.', '3. The fridge does not kill them — it just puts the brakes on.', 'So keep it cold, and cook meat right through.'],
      finalAnswer: 'Bacteria multiply very fast when they are warm, so by lunchtime there are millions instead of a few',
    }),
    () => ({
      visual: sizeSvg(),
      prompt: 'Harper looks at pond water under the school microscope and sees things swimming. Her friend says "those must be viruses". Why is that wrong?',
      answer: ch('A virus is far too small to see with a school microscope — those will be bacteria or bigger microbes', ['Viruses do not live in water', 'Viruses are much too big to fit on a slide', 'Viruses are invisible because they are transparent'], 4),
      hint: 'Compare the sizes: 0.1 µm against 2 µm.',
      working: ['<b>Picture:</b> a pea next to a beach ball.', '1. A virus is about <b>0.1 µm</b> — you need an electron microscope.', '2. A bacterium is about <b>2 µm</b>, roughly 20 times bigger — a good school microscope can just show them.', '3. And swimming means moving on its own — a virus cannot even do that.'],
      finalAnswer: 'A virus is far too small to see with a school microscope — those will be bacteria or bigger microbes',
    }),
    () => ({
      prompt: 'A whole class is vaccinated against measles except two children who cannot be, for medical reasons. Are those two safe?',
      answer: ch('Mostly yes — with almost nobody able to catch it, the virus has no chain of people to travel along', ['No, they are certain to catch it', 'Yes, because the vaccine spreads to them through the air', 'It makes no difference either way'], 4),
      hint: 'Think of the route map: a microbe needs a chain of people.',
      working: ['<b>Picture:</b> stepping stones across a river — take enough away and nobody can cross.', '1. A virus must hop from person to person.', '2. If almost everyone is immune, the hops fail.', '3. So the few who cannot be vaccinated are protected too.', 'That only works while <b>most</b> people are vaccinated.'],
      finalAnswer: 'Mostly yes — with almost nobody able to catch it, the virus has no chain of people to travel along',
    }),
    () => ({
      prompt: 'Harper wants to test whether hand sanitiser works. She wipes her left hand on one agar plate before sanitising and her right hand on another after. What is wrong with her plan?',
      answer: ch('Her two hands were not equally dirty to start with — she should test the same hand before and after, and repeat it', ['She should have used three plates', 'Agar plates never grow anything from hands', 'Sanitiser only works on the left hand'], 4),
      hint: 'A fair test compares two things that were the same to begin with.',
      working: ['<b>Picture:</b> two runners must start on the same line.', '1. What is she changing? Sanitiser or no sanitiser.', '2. What else is different? <b>Which hand</b> — and hands are never equally dirty.', '3. Fix: press the same hand on plate 1, sanitise, press it on plate 2. Repeat several times.'],
      finalAnswer: 'Her two hands were not equally dirty to start with — she should test the same hand before and after, and repeat it',
    }),
  ];

  HL.registerTopic({
    id: 'microbes-health', subject: 'science', strand: 'living', order: 9,
    name: 'Microbes & health', short: 'Microbes', animal: 'gecko',
    blurb: 'The three kinds of microbe, the ones that help us, and how to stop the ones that do not.',
    example: 'antibiotics kill bacteria — never viruses',
    learn: {
      what: '<p>A <b>microbe</b> is a living thing far too small to see. There are three kinds you need: <b>bacteria</b> (single living cells), <b>viruses</b> (not really alive — just instructions that hijack your cells) and <b>fungi</b> (yeast and moulds). Most microbes are useful: they make our yoghurt, bread and cheese, rot our compost and live helpfully in our gut. Only a few cause <b>infectious disease</b>, and every one of those has to travel to you along a route you can block.</p><p><b>Picture for this topic:</b> your body is a <b>house</b>. Skin is the fence, mucus is the flypaper on the doormat, stomach acid is the moat, and white blood cells are the guards inside. Most microbes are the neighbours; a few are burglars.</p>',
      visual: `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="16" text-anchor="middle" fill="#4A4033" font-size="12">How big? (the order is what matters)</text>
        <circle cx="272" cy="82" r="34" fill="#A9D8F5" stroke="#5F98C4" stroke-width="3"/>
        <circle cx="272" cy="82" r="10" fill="#B9A5E6"/>
        <circle cx="188" cy="92" r="16" fill="#E8C24A" stroke="#C08A10" stroke-width="3"/>
        <circle cx="194" cy="76" r="7" fill="#E8C24A" stroke="#C08A10" stroke-width="2"/>
        <ellipse cx="90" cy="96" rx="15" ry="6.5" fill="#8FC96E" stroke="#6FA04C" stroke-width="3"/>
        <circle cx="34" cy="98" r="4.5" fill="#E0568C" stroke="#B03068" stroke-width="2"/>
        <text x="34" y="140" text-anchor="middle" fill="#4A4033" font-size="11.5">virus</text>
        <text x="34" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">0.1 µm</text>
        <text x="90" y="140" text-anchor="middle" fill="#4A4033" font-size="11.5">bacterium</text>
        <text x="90" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">2 µm</text>
        <text x="188" y="140" text-anchor="middle" fill="#4A4033" font-size="11.5">yeast (fungus)</text>
        <text x="188" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">5 µm</text>
        <text x="272" y="140" text-anchor="middle" fill="#4A4033" font-size="11.5">your cell</text>
        <text x="272" y="155" text-anchor="middle" fill="#7A7065" font-size="10.5">30 µm</text>
        <text x="170" y="180" text-anchor="middle" fill="#6FA04C" font-size="11.5">alive: bacterium ✓ · yeast ✓ · your cell ✓</text>
        <text x="170" y="195" text-anchor="middle" fill="#B03068" font-size="11.5">not alive on its own: virus ✗</text>
      </svg>`,
      facts: [
        'Three kinds: <b>bacteria</b> (living cells) · <b>viruses</b> (not alive on their own) · <b>fungi</b> (yeast and moulds)',
        'Size order: <b>virus → bacterium → yeast cell → your cell</b> (a virus is about 20× smaller than a bacterium)',
        'Most microbes are <b>useful</b>: yoghurt, bread, cheese, compost, gut bacteria, penicillin from a mould',
        'Five routes: <b>droplets · touch · food · water · animals</b> — block the route and the disease stops',
        'Your defences: <b>skin, mucus, stomach acid, tears</b> keep them out; <b>white blood cells</b> deal with the ones that get in',
        '<b>Antibiotics kill bacteria, never viruses.</b> A <b>vaccine</b> trains your defences before the real microbe arrives',
      ],
      steps: [
        'First ask "<b>is it alive?</b>" Bacteria and fungi are living cells that feed and grow. A virus is just instructions in a coat — it must hijack one of your cells to make copies.',
        'For "how do I stop it?", name the <b>route</b> first (droplets, touch, food, water, animals), then block <b>that</b> route. Blocking a different one does nothing.',
        'For "what medicine?", ask "<b>is it bacteria?</b>" Yes → antibiotic. Virus → rest, and let your white blood cells win. Fungus → antifungal cream.',
        'For defences, walk into the house: <b>fence</b> (skin), <b>flypaper</b> (mucus), <b>moat</b> (stomach acid), then the <b>guards</b> (white blood cells).',
        'In a mould experiment, change <b>one</b> thing, keep everything else the same, and count squares so you get a number you can graph.',
      ],
      examples: [
        {
          q: 'Which is bigger — a bacterium or a virus? And which one is actually alive?',
          visual: `<svg viewBox="0 0 320 160" width="320" height="160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <circle cx="60" cy="70" r="5" fill="#E0568C" stroke="#B03068" stroke-width="2"/>
            <text x="60" y="106" text-anchor="middle" fill="#4A4033" font-size="12">virus</text>
            <text x="60" y="122" text-anchor="middle" fill="#7A7065" font-size="10.5">0.1 µm</text>
            <text x="60" y="140" text-anchor="middle" fill="#B03068" font-size="11">not alive ✗</text>
            <text x="160" y="76" text-anchor="middle" fill="#7A7065" font-size="18">→</text>
            <ellipse cx="252" cy="70" rx="34" ry="15" fill="#8FC96E" stroke="#6FA04C" stroke-width="3"/>
            <text x="252" y="106" text-anchor="middle" fill="#4A4033" font-size="12">bacterium</text>
            <text x="252" y="122" text-anchor="middle" fill="#7A7065" font-size="10.5">2 µm = 20× bigger</text>
            <text x="252" y="140" text-anchor="middle" fill="#3F6B22" font-size="11">alive ✓</text>
            <text x="160" y="22" text-anchor="middle" fill="#4A4033" font-size="12">20 times bigger</text>
          </svg>`,
          working: ['<b>Picture:</b> a pea next to a tennis ball.', '1. How big is a virus? About <b>0.1 µm</b>.', '2. How big is a bacterium? About <b>2 µm</b> — that is 2 ÷ 0.1 = <b>20 times</b> bigger.', '3. Is a bacterium alive? <b>Yes</b> — it is a cell that feeds and splits in two.', '4. Is a virus alive? <b>No</b> — it can only copy itself inside one of your cells.'],
          a: 'The bacterium — about 20× bigger, and it is the one that is alive',
        },
        {
          q: 'Why does a loaf of bread rise, and which microbe does it?',
          working: ['<b>Picture:</b> tiny living things breathing out bubbles into the dough.', '1. Which microbe is yeast? A <b>fungus</b>.', '2. What does it feed on? The <b>sugar</b> in the dough.', '3. What does it give off? <b>Carbon dioxide</b> gas.', '4. The bubbles get trapped in the stretchy dough, so it puffs up.'],
          a: 'Yeast — a fungus — makes carbon dioxide bubbles that puff the dough up',
        },
        {
          q: 'Name three useful microbes and say what each one does for us.',
          working: ['<b>Picture:</b> microbes are neighbours, and most of them are helping.', '1. <b>Yoghurt and cheese</b>: bacteria turn milk sugar into acid, so the milk thickens and tastes tangy.', '2. <b>Compost</b>: bacteria and fungi rot dead scraps and put the nutrients back in the soil.', '3. <b>Your gut</b>: bacteria help digest fibre, make some vitamins, and crowd out harmful microbes.', '(Bonus: <b>penicillin</b> comes from a mould.)'],
          a: 'Yoghurt bacteria, compost decomposers and gut bacteria — plus yeast for bread and mould for penicillin',
        },
        {
          q: 'Half of Harper\'s class catches the same cough in one week. Which route did it take, and what would stop it?',
          visual: `<svg viewBox="0 0 320 170" width="320" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="16" text-anchor="middle" fill="#4A4033" font-size="12">five routes — block the right one</text>
            <circle cx="26" cy="76" r="12" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <rect x="17" y="90" width="18" height="26" rx="7" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <text x="26" y="132" text-anchor="middle" fill="#B03068" font-size="10.5">sick</text>
            <circle cx="294" cy="76" r="12" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <rect x="285" y="90" width="18" height="26" rx="7" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <text x="294" y="132" text-anchor="middle" fill="#3F6B22" font-size="10.5">well</text>
            <rect x="56" y="26" width="180" height="22" rx="11" fill="#F7D3E2" stroke="#E0568C" stroke-width="2.5"/>
            <text x="146" y="41" text-anchor="middle" fill="#B03068" font-size="11">droplets in the air</text>
            <rect x="56" y="54" width="180" height="22" rx="11" fill="#FDF3E0" stroke="#D9BE8A" stroke-width="2"/>
            <text x="146" y="69" text-anchor="middle" fill="#4A4033" font-size="11">touch</text>
            <rect x="56" y="82" width="180" height="22" rx="11" fill="#FDF3E0" stroke="#D9BE8A" stroke-width="2"/>
            <text x="146" y="97" text-anchor="middle" fill="#4A4033" font-size="11">food</text>
            <rect x="56" y="110" width="180" height="22" rx="11" fill="#FDF3E0" stroke="#D9BE8A" stroke-width="2"/>
            <text x="146" y="125" text-anchor="middle" fill="#4A4033" font-size="11">water</text>
            <rect x="56" y="138" width="180" height="22" rx="11" fill="#FDF3E0" stroke="#D9BE8A" stroke-width="2"/>
            <text x="146" y="153" text-anchor="middle" fill="#4A4033" font-size="11">animals</text>
            <polygon points="256,37 242,31 242,43" fill="#E0568C"/>
          </svg>`,
          working: ['<b>Picture:</b> be a detective — what did all the sick people share?', '1. They shared a <b>room</b>, not a meal or a water bottle.', '2. A cough fires wet drops into the air, and other people breathe them in → the <b>droplet</b> route.', '3. So block droplets: <b>cough into your elbow, stay home when you are sick, open a window</b>.', '4. Washing your hands still helps, but it is the touch route — it would not fix this on its own.'],
          a: 'The droplet route — cough into your elbow, stay home when sick, and open a window',
        },
        {
          q: 'A microbe gets in through a scraped knee. Which defences meet it, and in what order?',
          visual: `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <circle cx="70" cy="40" r="22" fill="#F6DFC8" stroke="#4A4033" stroke-width="2.5"/>
            <circle cx="62" cy="34" r="2.6" fill="#4A4033"/><circle cx="78" cy="34" r="2.6" fill="#4A4033"/>
            <path d="M62 48 Q70 54 78 48" fill="none" stroke="#4A4033" stroke-width="2"/>
            <rect x="44" y="64" width="52" height="84" rx="16" fill="#F6DFC8" stroke="#4A4033" stroke-width="2.5"/>
            <ellipse cx="70" cy="110" rx="15" ry="12" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <line x1="44" y1="78" x2="26" y2="116" stroke="#4A4033" stroke-width="6" stroke-linecap="round"/>
            <line x1="96" y1="78" x2="114" y2="116" stroke="#4A4033" stroke-width="6" stroke-linecap="round"/>
            <line x1="58" y1="148" x2="54" y2="190" stroke="#4A4033" stroke-width="6" stroke-linecap="round"/>
            <line x1="82" y1="148" x2="86" y2="190" stroke="#4A4033" stroke-width="6" stroke-linecap="round"/>
            <circle cx="56" cy="170" r="6" fill="#E0568C" opacity=".6"/>
            <line x1="62" y1="30" x2="150" y2="34" stroke="#4A4033" stroke-width="1.5"/><text x="156" y="38" fill="#4A4033" font-size="11.5">tears = the hose</text>
            <line x1="80" y1="46" x2="150" y2="68" stroke="#4A4033" stroke-width="1.5"/><text x="156" y="72" fill="#4A4033" font-size="11.5">mucus = sticky trap</text>
            <line x1="96" y1="90" x2="150" y2="100" stroke="#4A4033" stroke-width="1.5"/><text x="156" y="104" fill="#4A4033" font-size="11.5">skin = the wall</text>
            <line x1="84" y1="112" x2="150" y2="132" stroke="#4A4033" stroke-width="1.5"/><text x="156" y="136" fill="#4A4033" font-size="11.5">acid = the moat</text>
            <line x1="60" y1="168" x2="150" y2="164" stroke="#E0568C" stroke-width="2.5"/><text x="156" y="168" fill="#E0568C" font-size="11.5">white cells = guards</text>
          </svg>`,
          working: ['<b>Picture:</b> your body is a house — a fence outside, guards inside.', '1. First defence: <b>skin</b>, the wall. The scrape has broken it, so this one failed.', '2. A <b>scab</b> forms to plug the hole so no more get in.', '3. Inside, <b>white blood cells</b> take over: some swallow the microbes whole.', '4. Others make <b>antibodies</b> that stick to the microbe and mark it for destruction.'],
          a: 'Skin first (broken), then a scab seals it, then white blood cells swallow the microbes and make antibodies',
        },
        {
          q: 'Harper has a cold. Why will antibiotics not help, and what actually will?',
          working: ['<b>Picture:</b> weedkiller kills living weeds. A virus is not a weed — it is a set of instructions.', '1. What causes a cold? A <b>virus</b>.', '2. What do antibiotics attack? Living <b>bacteria</b> cells — their walls and their machinery.', '3. A virus has none of that, and it hides inside her own cells.', '4. So: rest, fluids, and let her <b>white blood cells</b> beat it. Taking antibiotics anyway helps resistant bacteria appear.'],
          a: 'A cold is viral — antibiotics only kill bacteria. Rest, and her white blood cells do the work',
        },
        {
          q: 'Harper tests what bread mould needs. Four identical slices, one week. What do her results show, and what makes it a fair test?',
          visual: `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="15" text-anchor="middle" fill="#4A4033" font-size="11.5">bread mould after 7 days</text>
            <text x="8" y="34" fill="#7A7065" font-size="10.5">squares covered</text>
            <line x1="34" y1="24" x2="34" y2="154" stroke="#4A4033" stroke-width="2"/>
            <line x1="34" y1="154" x2="312" y2="154" stroke="#4A4033" stroke-width="2"/>
            <rect x="42" y="59" width="46" height="95" rx="4" fill="#8FC96E" stroke="#4A4033" stroke-width="1.5"/>
            <text x="65" y="54" text-anchor="middle" fill="#4A4033" font-size="11">35</text>
            <text x="65" y="169" text-anchor="middle" fill="#4A4033" font-size="11">warm</text><text x="65" y="183" text-anchor="middle" fill="#4A4033" font-size="11">damp</text>
            <rect x="110" y="116" width="46" height="38" rx="4" fill="#E8C24A" stroke="#4A4033" stroke-width="1.5"/>
            <text x="133" y="111" text-anchor="middle" fill="#4A4033" font-size="11">14</text>
            <text x="133" y="169" text-anchor="middle" fill="#4A4033" font-size="11">warm</text><text x="133" y="183" text-anchor="middle" fill="#4A4033" font-size="11">dry</text>
            <rect x="178" y="138" width="46" height="16" rx="4" fill="#A9D8F5" stroke="#4A4033" stroke-width="1.5"/>
            <text x="201" y="133" text-anchor="middle" fill="#4A4033" font-size="11">6</text>
            <text x="201" y="169" text-anchor="middle" fill="#4A4033" font-size="11">cold</text><text x="201" y="183" text-anchor="middle" fill="#4A4033" font-size="11">damp</text>
            <rect x="246" y="149" width="46" height="5" rx="2" fill="#B9A5E6" stroke="#4A4033" stroke-width="1.5"/>
            <text x="269" y="144" text-anchor="middle" fill="#4A4033" font-size="11">2</text>
            <text x="269" y="169" text-anchor="middle" fill="#4A4033" font-size="11">cold</text><text x="269" y="183" text-anchor="middle" fill="#4A4033" font-size="11">dry</text>
            <text x="160" y="196" text-anchor="middle" fill="#7A7065" font-size="10.5">same loaf · same jars · same 7 days</text>
          </svg>`,
          working: ['<b>Picture:</b> mould is alive — it wants food, warmth and water.', '1. Warm+damp (35) against cold+damp (6): only the <b>temperature</b> changed → warmth matters.', '2. Warm+damp (35) against warm+dry (14): only the <b>water</b> changed → water matters.', '3. Cold+dry grew almost nothing (2).', '4. Fair test: same loaf, same size slices, same jars, same 7 days — only one thing different at a time, and mould counted in <b>squares</b> so it can be graphed.'],
          a: 'Mould grows best warm AND damp — and it is fair because only one thing changed at a time',
        },
      ],
      tips: [
        '<b>Antibiotics never work on a virus.</b> If the illness is a cold, flu, measles or chickenpox, antibiotics do nothing at all.',
        'A vaccine is <b>not</b> a medicine that cures you. It is training your defences <b>before</b> the microbe ever turns up.',
        'The fridge does not kill bacteria — it just slows them down. Only <b>cooking</b> kills them.',
        'Do not say "germs are all bad". Most microbes are harmless or useful; only a few cause disease.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [microbeFact, sizeQ, aliveQ, usefulQ, usefulOrHarmful, diseaseType, routeQ, defenceQ, hygieneQ, vaccineQ, antibioticQ, microbeCalc]
        : level === 2
          ? [microbeFact, sizeQ, aliveQ, usefulQ, usefulOrHarmful, diseaseType, routeQ, breakRouteQ, hygieneQ, defenceQ, defenceOrder, vaccineQ, antibioticQ, mouldTest, microbeCalc]
          : [sizeQ, aliveQ, usefulQ, diseaseType, routeQ, breakRouteQ, hygieneQ, defenceQ, defenceOrder, vaccineQ, antibioticQ, mouldTest, microbeCalc, microbeFact];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
