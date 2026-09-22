/* Topic: Plants — parts and their jobs, photosynthesis, leaves, transport,
 * pollination, seed dispersal and what a plant needs to grow. Living World, order 7. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const PARTS = [
    { key: 'roots', name: 'roots', job: 'take in water and minerals from the soil, and hold the plant down', pic: 'straws pushed into the ground' },
    { key: 'stem', name: 'stem', job: 'holds the plant up and carries water and food between the parts', pic: 'the lift shaft in a building' },
    { key: 'leaf', name: 'leaves', job: 'catch the sunlight and make the food by photosynthesis', pic: 'solar panels' },
    { key: 'flower', name: 'flower', job: 'makes the seeds — it is the part that reproduces', pic: 'a bright shop window pulling customers in' },
    { key: 'seed', name: 'seed', job: 'holds a tiny new plant plus a food store, waiting to grow', pic: 'a lunchbox with a baby plant inside' },
    { key: 'fruit', name: 'fruit', job: 'wraps round the seeds so an animal eats it and carries them away', pic: 'a parcel with the seeds inside' },
  ];
  const FLOWERPARTS = [
    { key: 'petal', name: 'petal', job: 'is brightly coloured to attract insects and birds', at: [86, 120] },
    { key: 'anther', name: 'anther', job: 'makes the pollen', at: [102, 80] },
    { key: 'stigma', name: 'stigma', job: 'is sticky on top so it catches pollen', at: [150, 78] },
    { key: 'ovary', name: 'ovary', job: 'holds the ovules that turn into seeds', at: [150, 146] },
  ];
  const LEAFDESIGN = [
    { feature: 'flat and wide', why: 'to catch as much sunlight as possible' },
    { feature: 'very thin', why: 'so gases can get in and out quickly' },
    { feature: 'green', why: 'because it is packed with chlorophyll, which traps light' },
    { feature: 'full of veins', why: 'to bring water in and take the food away' },
    { feature: 'covered in tiny holes underneath', why: 'to let carbon dioxide in and oxygen out' },
    { feature: 'coated in a waxy top layer', why: 'to stop the leaf drying out' },
  ];
  const TUBES = [
    { name: 'xylem', carries: 'water and minerals', dir: 'up from the roots to the leaves', pic: 'a bundle of drinking straws going one way, upwards' },
    { name: 'phloem', carries: 'the sugary food made in the leaves', dir: 'to every other part of the plant', pic: 'a delivery van that can go anywhere' },
  ];
  const DISPERSAL = [
    { how: 'wind', clue: 'tiny and light, with a parachute or a wing', ex: 'a dandelion seed' },
    { how: 'animals', clue: 'inside a sweet juicy fruit that gets eaten', ex: 'a berry on a coprosma' },
    { how: 'animals', clue: 'covered in tiny hooks that catch on fur', ex: 'a piripiri (biddy-bid) burr' },
    { how: 'water', clue: 'able to float for a long way', ex: 'a coconut' },
    { how: 'exploding', clue: 'in a pod that dries out and flicks the seeds away', ex: 'a gorse pod popping on a hot day' },
  ];
  const NEEDS = [
    { need: 'light', why: 'without light the leaves cannot photosynthesise at all' },
    { need: 'water', why: 'water is one of the two ingredients of photosynthesis' },
    { need: 'carbon dioxide', why: 'it is the other ingredient, and it comes in through the leaves' },
    { need: 'warmth', why: 'the reactions inside the plant are far too slow when it is cold' },
    { need: 'minerals from the soil', why: 'the plant needs them to build things like proteins and chlorophyll' },
  ];

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ch = (correct, wrongs, n) => { const c = choice(correct, wrongs, n); return { type: 'choice', value: c.value, choices: c.choices }; };
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /** typed synonyms accepted when naming a plant part by itself. */
  const PART_ACCEPT = {
    roots: ['root', 'the roots'], stem: ['the stem', 'stalk'], leaves: ['leaf', 'a leaf', 'the leaves'],
    flower: ['the flower', 'flowers'], seed: ['a seed', 'the seed', 'seeds'], fruit: ['a fruit', 'the fruit'],
  };
  const FLOWERPART_ACCEPT = { petal: ['petals', 'a petal'], anther: ['anthers', 'an anther'], stigma: ['a stigma'], ovary: ['an ovary'] };

  /* ---------- diagrams ---------- */
  /** the whole plant. highlight = part key (drawn pink); labelled = draw all four labels */
  function plantSvg(highlight, labelled) {
    const c = (k, def) => (highlight === k ? '#E0568C' : def);
    const lab = (x1, y1, x2, y2, tx, ty, t) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1.5"/><text x="${tx}" y="${ty}" fill="${INK}" font-size="11.5">${t}</text>`;
    const petals = [0, 60, 120, 180, 240, 300].map((a) =>
      `<ellipse cx="160" cy="58" rx="16" ry="8" transform="rotate(${a} 160 58)" fill="${c('flower', '#F6C9DC')}" stroke="${c('flower', '#E0568C')}" stroke-width="2"/>`).join('');
    const leaf = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="34" ry="15" fill="${c('leaf', '#8FC96E')}" stroke="${c('leaf', '#5C8C3C')}" stroke-width="2.5"/><line x1="${cx - 30}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="${c('leaf', '#5C8C3C')}" stroke-width="1.5"/></g>`;
    return `<svg viewBox="0 0 320 220" width="320" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="0" y="172" width="320" height="48" fill="#D8BC94"/>
      <path d="M160 172 V198 M160 180 L134 204 M160 180 L186 204 M160 190 L142 214 M160 190 L178 214" fill="none" stroke="${c('roots', '#B08850')}" stroke-width="5" stroke-linecap="round"/>
      <path d="M160 174 V70" stroke="${c('stem', '#5C8C3C')}" stroke-width="9" stroke-linecap="round"/>
      <line x1="160" y1="126" x2="130" y2="120" stroke="${c('leaf', '#5C8C3C')}" stroke-width="4"/>
      <line x1="160" y1="146" x2="190" y2="142" stroke="${c('leaf', '#5C8C3C')}" stroke-width="4"/>
      ${leaf(102, 116, -18)}${leaf(218, 138, 18)}
      ${petals}
      <circle cx="160" cy="58" r="11" fill="${c('flower', '#E8C24A')}" stroke="${INK}" stroke-width="2"/>
      ${labelled ? [
        lab(184, 46, 244, 34, 248, 38, 'flower'),
        lab(240, 128, 268, 112, 272, 116, 'leaf'),
        lab(165, 158, 236, 168, 240, 172, 'stem'),
        lab(178, 200, 232, 204, 236, 208, 'roots'),
        lab(68, 116, 40, 96, 6, 92, 'leaf'),
      ].join('') : `<text x="24" y="30" fill="#E0568C" font-size="13">the pink part</text>`}
    </svg>`;
  }

  /** photosynthesis: what goes in, what comes out */
  function photoSvg() {
    const arrow = (x1, y1, x2, y2, colour) => {
      const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
      const head = dx ? `${x2},${y2} ${x2 - dx * 9},${y2 - 5} ${x2 - dx * 9},${y2 + 5}` : `${x2},${y2} ${x2 - 5},${y2 - dy * 9} ${x2 + 5},${y2 - dy * 9}`;
      return `<line x1="${x1}" y1="${y1}" x2="${x2 - dx * 7}" y2="${y2 - dy * 7}" stroke="${colour}" stroke-width="4" stroke-linecap="round"/><polygon points="${head}" fill="${colour}"/>`;
    };
    return `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="160" cy="24" r="14" fill="#E8C24A"/>
      ${[0, 45, 90, 135].map((a) => `<line x1="${160 - 20 * Math.cos(a * Math.PI / 180)}" y1="${24 - 20 * Math.sin(a * Math.PI / 180)}" x2="${160 + 20 * Math.cos(a * Math.PI / 180)}" y2="${24 + 20 * Math.sin(a * Math.PI / 180)}" stroke="#E8C24A" stroke-width="3"/>`).join('')}
      <text x="188" y="28" fill="#C08A10" font-size="11">light</text>
      ${arrow(160, 46, 160, 58, '#E8C24A')}
      <ellipse cx="160" cy="100" rx="64" ry="40" fill="#8FC96E" stroke="#5C8C3C" stroke-width="3"/>
      <text x="160" y="96" text-anchor="middle" fill="${INK}" font-size="12">LEAF</text>
      <text x="160" y="112" text-anchor="middle" fill="#3F6B22" font-size="10">needs chlorophyll</text>
      <text x="4" y="66" fill="#5F98C4" font-size="10">carbon dioxide</text>
      ${arrow(10, 76, 92, 76, '#5F98C4')}
      <text x="4" y="110" fill="#5F98C4" font-size="10.5">water</text>
      ${arrow(10, 120, 92, 120, '#5F98C4')}
      <text x="234" y="66" fill="#6FA04C" font-size="10.5">oxygen</text>
      ${arrow(228, 76, 310, 76, '#6FA04C')}
      <text x="234" y="110" fill="#6FA04C" font-size="10.5">glucose (food)</text>
      ${arrow(228, 120, 310, 120, '#6FA04C')}
      <text x="160" y="176" text-anchor="middle" fill="${INK}" font-size="11.5">carbon dioxide + water → glucose + oxygen</text>
      <text x="160" y="192" text-anchor="middle" fill="#7A7065" font-size="10.5">and it only works with light + chlorophyll</text>
    </svg>`;
  }

  /** flower cut in half. mark = part key → a pink ring is drawn round it */
  function flowerSvg(mark, labelled) {
    const p = FLOWERPARTS.find((x) => x.key === mark);
    const lab = (x1, y1, x2, y2, tx, ty, t, anchor) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="1.5"/><text x="${tx}" y="${ty}" text-anchor="${anchor}" fill="${INK}" font-size="11.5">${t}</text>`;
    return `<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <path d="M140 150 C100 148 66 116 62 78 C104 88 132 114 140 150 Z" fill="#F6C9DC" stroke="#E0568C" stroke-width="2.5"/>
      <path d="M160 150 C200 148 234 116 238 78 C196 88 168 114 160 150 Z" fill="#F6C9DC" stroke="#E0568C" stroke-width="2.5"/>
      <rect x="145" y="150" width="10" height="44" rx="4" fill="#5C8C3C"/>
      <path d="M136 142 Q108 118 104 88" fill="none" stroke="#C09A50" stroke-width="3.5"/>
      <path d="M164 142 Q192 118 196 88" fill="none" stroke="#C09A50" stroke-width="3.5"/>
      <ellipse cx="102" cy="80" rx="11" ry="7" fill="#E9A07A" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="198" cy="80" rx="11" ry="7" fill="#E9A07A" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="150" cy="146" rx="22" ry="17" fill="#E8C24A" stroke="${INK}" stroke-width="2"/>
      <line x1="150" y1="130" x2="150" y2="86" stroke="#C9A02A" stroke-width="5"/>
      <ellipse cx="150" cy="78" rx="14" ry="7" fill="#E0568C" stroke="${INK}" stroke-width="2"/>
      ${p ? `<circle cx="${p.at[0]}" cy="${p.at[1]}" r="18" fill="none" stroke="#E0568C" stroke-width="3.5"/>
      <circle cx="${p.at[0] + 17}" cy="${p.at[1] - 17}" r="10" fill="#FFFFFF" stroke="#E0568C" stroke-width="2.5"/>
      <text x="${p.at[0] + 17}" y="${p.at[1] - 12}" text-anchor="middle" fill="#9E2B57" font-size="13">?</text>` : ''}
      ${labelled ? [
        lab(74, 100, 46, 104, 42, 108, 'petal', 'end'),
        lab(96, 74, 70, 50, 66, 46, 'anther', 'end'),
        lab(163, 74, 196, 50, 200, 46, 'stigma', 'start'),
        lab(172, 150, 206, 160, 210, 164, 'ovary', 'start'),
      ].join('') : ''}
    </svg>`;
  }

  const growTable = (a, b, c) => `<table class="data"><tr><th>Pot</th><th>Light</th><th>Water</th><th>Height</th></tr>
    <tr><td>A</td><td>windowsill</td><td>50 mL/day</td><td>${a} cm</td></tr>
    <tr><td>B</td><td>dark cupboard</td><td>50 mL/day</td><td>${b} cm</td></tr>
    <tr><td>C</td><td>windowsill</td><td>none</td><td>${c} cm</td></tr></table>`;

  /* ---------- question makers ---------- */
  function partJob() {
    const p = R.pick(PARTS);
    if (R.chance(0.5)) {
      return {
        prompt: `What is the job of the <b>${p.name}</b>?`,
        answer: ch(p.job, PARTS.map((x) => x.job)),
        hint: `Think of it as ${p.pic}.`,
        working: [`<b>Picture:</b> the ${p.name} are like ${p.pic}.`, `So they <b>${p.job}</b>.`],
        finalAnswer: p.job, skill: 'parts',
      };
    }
    return {
      prompt: `Which part of a plant is like <b>${p.pic}</b>?`,
      answer: textAns(p.name, PART_ACCEPT[p.name], 'one word'),
      hint: p.job,
      working: [`That part ${p.job}.`, `So it is the <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'parts',
    };
  }
  function partOnPlant(level) {
    const p = R.pick(PARTS.filter((x) => ['roots', 'stem', 'leaf', 'flower'].includes(x.key)));
    const askJob = level >= 2 && R.chance(0.5);
    return {
      visual: plantSvg(p.key, false),
      prompt: askJob ? 'Look at the plant. What is the job of the <b>pink</b> part?' : 'Look at the plant. What is the <b>pink</b> part called?',
      answer: askJob ? ch(p.job, PARTS.map((x) => x.job)) : textAns(p.name, PART_ACCEPT[p.name], 'one word'),
      hint: askJob ? 'Name the part first, then say its job.' : 'Work up the plant: roots, stem, leaves, flower.',
      working: ['<b>Picture:</b> read the plant from the ground up — roots, stem, leaves, flower.', `The pink part is the <b>${p.name}</b>.`, askJob ? `It ${p.job}.` : `That is the answer.`],
      finalAnswer: askJob ? p.job : p.name, skill: 'parts',
    };
  }
  function photoQ(level) {
    const forms = [
      { p: 'Which two things does a plant take <b>IN</b> for photosynthesis?', a: 'carbon dioxide and water', w: ['glucose and oxygen', 'oxygen and water', 'glucose and carbon dioxide'] },
      { p: 'Which two things does photosynthesis <b>MAKE</b>?', a: 'glucose and oxygen', w: ['carbon dioxide and water', 'water and oxygen', 'carbon dioxide and glucose'] },
      { p: 'Photosynthesis needs two other things that are <b>not</b> ingredients. What are they?', a: 'light and chlorophyll', w: ['soil and warmth', 'oxygen and minerals', 'water and soil'] },
      { p: 'Where in the plant does most photosynthesis happen?', a: 'in the chloroplasts inside the leaves', w: ['in the roots', 'in the flower', 'in the stem'], short: 'chloroplasts', shortAccept: ['in the chloroplasts', 'the chloroplasts', 'chloroplast'] },
      { p: 'Which gas do plants give out while they are photosynthesising?', a: 'oxygen', w: ['carbon dioxide', 'nitrogen', 'hydrogen'], short: 'oxygen', shortAccept: [] },
      { p: 'Where does the plant get the <b>water</b> for photosynthesis?', a: 'the roots take it up from the soil', w: ['it makes water in the leaves', 'it takes it out of the air through the flower', 'it gets it from the sunlight'], short: 'roots', shortAccept: ['the roots', 'from the roots'] },
      { p: 'Where does the plant get the <b>carbon dioxide</b>?', a: 'from the air, through tiny holes in the leaves', w: ['from the soil, through the roots', 'from the water it drinks', 'from the sunlight'] },
      { p: 'What does the plant do with the <b>glucose</b> it makes?', a: 'uses it for energy and to build new parts, and stores the rest as starch', w: ['breathes it out again', 'sends it back into the soil', 'turns it into sunlight'] },
    ];
    const f = R.pick(forms);
    return {
      visual: level === 1 ? photoSvg() : undefined,
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'one word') : ch(f.a, f.w, 4),
      hint: 'Say the equation: carbon dioxide + water → glucose + oxygen (with light and chlorophyll).',
      working: ['<b>Picture:</b> the leaf is a tiny food factory running on sunlight.', '<b>carbon dioxide + water → glucose + oxygen</b>', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'photosynthesis',
    };
  }
  function photoDiagram(level) {
    const items = [
      { q: 'Which arrow shows something going <b>IN</b> to the leaf?', a: 'carbon dioxide', w: ['oxygen', 'glucose', 'starch'], short: 'carbon dioxide', shortAccept: ['co2'] },
      { q: 'Which of these comes <b>OUT</b> of the leaf?', a: 'oxygen', w: ['carbon dioxide', 'water', 'minerals'], short: 'oxygen', shortAccept: [] },
      { q: 'The diagram shows light going into the leaf. Is light an <b>ingredient</b> that gets used up?', a: 'No — light is the energy that makes the reaction happen', w: ['Yes, light is one of the two ingredients', 'Yes, light turns into glucose', 'No, light does nothing at all'] },
      { q: 'What is the green chemical in the leaf that traps the light called?', a: 'chlorophyll', w: ['glucose', 'chloroplast juice', 'carbon dioxide'], short: 'chlorophyll', shortAccept: [] },
    ];
    const f = R.pick(items);
    return {
      visual: photoSvg(),
      prompt: f.q,
      answer: f.short ? textAns(f.short, f.shortAccept, 'one word') : ch(f.a, f.w, 4),
      hint: 'Blue arrows go in, green arrows come out.',
      working: ['<b>Picture:</b> a factory — raw materials in on the left, products out on the right.', 'IN: carbon dioxide and water. OUT: glucose and oxygen. Light and chlorophyll make it happen.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'photosynthesis',
    };
  }
  function leafQ() {
    const l = R.pick(LEAFDESIGN);
    if (R.chance(0.5)) {
      return {
        prompt: `A leaf is <b>${l.feature}</b>. Why?`,
        answer: ch(l.why, LEAFDESIGN.map((x) => x.why)),
        hint: 'A leaf has one job: make food from light, water and carbon dioxide.',
        working: ['<b>Picture:</b> a leaf is a solar panel with a plumbing system.', `Being ${l.feature} is <b>${l.why}</b>.`],
        finalAnswer: l.why, skill: 'leaves',
      };
    }
    return {
      prompt: `Which feature of a leaf is <b>${l.why}</b>?`,
      answer: ch(l.feature, LEAFDESIGN.map((x) => x.feature)),
      hint: 'Picture a real leaf and what it looks and feels like.',
      working: ['<b>Picture:</b> hold a leaf up to the light.', `That job is done by the leaf being <b>${l.feature}</b>.`],
      finalAnswer: l.feature, skill: 'leaves',
    };
  }
  function tubeQ() {
    const t = R.pick(TUBES);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What does the <b>${t.name}</b> carry?`,
        answer: ch(t.carries, TUBES.map((x) => x.carries).concat(['oxygen from the air'])),
        hint: 'Xylem = water going up. Phloem = food going everywhere.',
        working: [`<b>Picture:</b> ${t.pic}.`, `The ${t.name} carries <b>${t.carries}</b>.`],
        finalAnswer: t.carries, skill: 'transport',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which tubes carry <b>${t.carries}</b>?`,
        answer: textAns(t.name, t.name === 'xylem' ? ['the xylem'] : ['the phloem'], 'one word'),
        hint: '"Xylem" and "water" both have an x-ish, up-the-tree feel — water goes UP in the xylem.',
        working: [`<b>Picture:</b> ${t.pic}.`, `Those are the <b>${t.name}</b>.`],
        finalAnswer: t.name, skill: 'transport',
      };
    }
    return {
      prompt: `Which way does the <b>${t.name}</b> move things?`,
      answer: ch(t.dir, TUBES.map((x) => x.dir)),
      hint: `Think of ${t.pic}.`,
      working: [`<b>Picture:</b> ${t.pic}.`, `The ${t.name} moves things <b>${t.dir}</b>.`],
      finalAnswer: t.dir, skill: 'transport',
    };
  }
  function flowerPartQ(level) {
    const f = R.pick(FLOWERPARTS);
    const askJob = level >= 2 && R.chance(0.45);
    return {
      visual: flowerSvg(f.key, false),
      prompt: askJob ? 'Look at the flower. What does the <b>ringed</b> part do?' : 'Look at the flower. What is the <b>ringed</b> part called?',
      answer: askJob ? ch(f.job, FLOWERPARTS.map((x) => x.job)) : textAns(f.name, FLOWERPART_ACCEPT[f.name], 'one word'),
      hint: askJob ? 'Name the part first, then say its job.' : 'Petals on the outside, anthers on the stalks that make pollen, stigma on top of the middle, ovary at the bottom.',
      working: ['<b>Picture:</b> the flower is a landing pad (petals), a pollen factory (anthers), a sticky catcher (stigma) and a seed nursery (ovary).', `The ringed part is the <b>${f.name}</b>, and it ${f.job}.`],
      finalAnswer: askJob ? f.job : f.name, skill: 'flower',
    };
  }
  function pollinationQ() {
    const forms = [
      { p: 'What is <b>pollination</b>?', a: 'moving pollen from an anther to a stigma', w: ['a seed growing into a new plant', 'a seed being carried away from the parent plant', 'a leaf making food from sunlight'] },
      { p: 'Why do many flowers have big bright petals and sweet nectar?', a: 'To attract insects and birds, which then carry the pollen away on their bodies', w: ['To catch more sunlight for photosynthesis', 'To scare off animals that would eat them', 'To collect rainwater'] },
      { p: 'Grass flowers are small, dull and have no scent, but they make masses of light pollen. How are they pollinated?', a: 'by the wind', w: ['by insects', 'by birds', 'by water'], short: 'wind', shortAccept: ['by the wind', 'the wind'] },
      { p: 'In Aotearoa, tūī and bellbirds visit kōwhai and flax flowers for nectar. What job are they doing for the plant?', a: 'pollinating it — pollen sticks to their heads and is carried to the next flower', w: ['eating the seeds so new plants grow', 'protecting it from insects', 'watering it'], short: 'pollinating it', shortAccept: ['pollination', 'pollinating', 'they pollinate it'] },
      { p: 'What is the difference between <b>pollination</b> and <b>seed dispersal</b>?', a: 'Pollination moves pollen between flowers; dispersal moves the finished seeds away from the parent', w: ['They are two words for the same thing', 'Pollination happens in the roots and dispersal in the leaves', 'Dispersal happens first, then pollination'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a few words') : ch(f.a, f.w, 4),
      hint: 'Pollination = pollen moves. Dispersal = seeds move.',
      working: ['<b>Picture:</b> pollen is the post; the insect or the wind is the postie.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'pollination',
    };
  }
  function dispersalQ() {
    const d = R.pick(DISPERSAL);
    if (R.chance(0.55)) {
      return {
        prompt: `A seed is <b>${d.clue}</b>. How is it spread?`,
        answer: textAns(d.how, d.how === 'exploding' ? ['pods exploding', 'the pod explodes'] : [`by ${d.how}`], 'one word'),
        hint: 'Match the shape of the seed to the thing that could move it.',
        working: [`<b>Picture:</b> ${d.ex}.`, `Being ${d.clue} only makes sense if it travels by <b>${d.how}</b>.`],
        finalAnswer: d.how, skill: 'dispersal',
      };
    }
    return {
      prompt: 'Why does a plant need its seeds carried away, instead of just dropping them underneath?',
      answer: ch('So the new plants do not have to fight the parent for light, water and space', ['So the seeds do not get eaten', 'So the parent plant can grow taller', 'So the seeds stay warm'], 4),
      hint: 'Imagine fifty seedlings all in the shade of the parent tree.',
      working: ['<b>Picture:</b> fifty seedlings crammed in the shade of one big tree.', '1. What do they all need? Light, water and space.', '2. Who is already taking it? The parent plant.', 'So spreading out means <b>less competition</b> — and new ground to grow on.'],
      finalAnswer: 'So the new plants do not have to fight the parent for light, water and space', skill: 'dispersal',
    };
  }
  function needsQ() {
    const n = R.pick(NEEDS);
    if (R.chance(0.5)) {
      return {
        prompt: `Why does a plant need <b>${n.need}</b>?`,
        answer: ch(n.why, NEEDS.map((x) => x.why)),
        hint: 'Go back to the photosynthesis equation and ask where this fits.',
        working: ['<b>Picture:</b> carbon dioxide + water → glucose + oxygen, powered by light.', `${cap(n.need)} matters because <b>${n.why}</b>.`],
        finalAnswer: n.why, skill: 'needs',
      };
    }
    return {
      prompt: 'A friend says "plants eat soil — that is their food". What is wrong with that?',
      answer: ch('Plants MAKE their own food in the leaves; from the soil they only take water and minerals', ['Nothing, that is right', 'Plants actually eat insects', 'Plants get their food from the air only'], 4),
      hint: 'A plant grown in water with minerals added still grows fine.',
      working: ['<b>Picture:</b> a leaf is a food factory, not a mouth.', '1. Where is the food made? <b>In the leaves</b>, by photosynthesis.', '2. What comes from the soil? Only <b>water and minerals</b>.', '3. Proof: hydroponic plants grow with no soil at all.'],
      finalAnswer: 'Plants MAKE their own food in the leaves; from the soil they only take water and minerals', skill: 'needs',
    };
  }
  function fairTestQ(level) {
    const a = R.int(14, 22), b = R.int(3, 7), c = R.int(1, 4);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        visual: growTable(a, b, c),
        prompt: 'Look at the results. Which pot grew tallest?',
        answer: ch('A', ['A', 'B', 'C'], 3),
        hint: 'Compare the last column.',
        working: [`<b>Picture:</b> three identical pots, one thing changed in each.`, `A = ${a} cm, B = ${b} cm, C = ${c} cm.`, 'Pot <b>A</b> had both light and water — so it grew tallest.'],
        finalAnswer: 'A', skill: 'fair-test',
      };
    }
    if (form === 2) {
      return {
        visual: growTable(a, b, c),
        prompt: 'Which two pots should Harper compare to test whether <b>light</b> matters?',
        answer: ch('A and B, because they only differ in light', ['A and C, because they only differ in water', 'B and C, because both grew badly', 'All three at once'], 4),
        hint: 'A fair test compares two pots that differ in ONE thing only.',
        working: ['<b>Picture:</b> two runners on the same track — only one thing may be different.', '1. A and B both get 50 mL of water. Only the light is different.', '2. A and C both sit on the windowsill. Only the water is different — that tests water, not light.', 'So use <b>A and B</b>.'],
        finalAnswer: 'A and B, because they only differ in light', skill: 'fair-test',
      };
    }
    return {
      visual: growTable(a, b, c),
      prompt: 'Pot B was in the dark and hardly grew. Explain why, using photosynthesis.',
      answer: ch('With no light the leaves cannot photosynthesise, so the plant makes no food', ['With no light the roots cannot take up water', 'The dark made the plant too cold to breathe', 'Plants need darkness to make glucose'], 4),
      hint: 'Which part of the equation is missing in the dark?',
      working: ['<b>Picture:</b> a solar panel in a cupboard.', '1. Photosynthesis needs <b>light</b> as its energy source.', '2. No light → no glucose made.', '3. No glucose → no new cells → almost no growth.'],
      finalAnswer: 'With no light the leaves cannot photosynthesise, so the plant makes no food', skill: 'fair-test',
    };
  }
  function plantCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 4);
    if (form === 1) {
      const start = R.int(3, 9), end = start + R.int(6, 20);
      return {
        prompt: `A bean seedling was <b>${start} cm</b> tall on Monday and <b>${end} cm</b> tall two weeks later. How much did it grow?`,
        answer: { type: 'number', value: end - start, unit: 'cm' },
        hint: 'Take the first height away from the second.',
        working: [`${end} − ${start} = <b>${end - start}</b> cm.`],
        finalAnswer: `${end - start} cm`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const perDay = R.pick([2, 3, 4, 5]), days = R.int(4, 12);
      return {
        prompt: `A sunflower grows about <b>${perDay} cm</b> a day. How tall will it grow in <b>${days} days</b>?`,
        answer: { type: 'number', value: perDay * days, unit: 'cm' },
        hint: 'Growth per day × number of days.',
        working: [`${perDay} × ${days} = <b>${perDay * days}</b> cm.`],
        finalAnswer: `${perDay * days} cm`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const seeds = R.pick([20, 40, 50, 200]), pct = R.pick([10, 25, 50, 80]);
      return {
        prompt: `Harper plants <b>${seeds}</b> seeds and <b>${pct}%</b> of them sprout. How many seedlings does she get?`,
        answer: { type: 'number', value: (seeds * pct) / 100, unit: 'seedlings' },
        hint: `Find 1% (divide by 100), then multiply by ${pct}.`,
        working: [`1% of ${seeds} = ${seeds / 100}.`, `${pct}% = ${seeds / 100} × ${pct} = <b>${(seeds * pct) / 100}</b> seedlings.`],
        finalAnswer: `${(seeds * pct) / 100} seedlings`, skill: 'numbers',
      };
    }
    const mlDay = R.pick([50, 60, 80, 100]), d = R.pick([7, 14]);
    return {
      prompt: `A pot plant is given <b>${mlDay} mL</b> of water a day. How much water is that in <b>${d} days</b>?`,
      answer: { type: 'number', value: mlDay * d, unit: 'mL' },
      hint: 'Water per day × number of days.',
      working: [`${mlDay} × ${d} = <b>${mlDay * d}</b> mL.`],
      finalAnswer: `${mlDay * d} mL`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const a = R.int(15, 22), b = R.int(3, 6), c = R.int(1, 4);
      return {
        visual: growTable(a, b, c),
        prompt: 'Harper set up three pots with the same soil and the same seed. Which conclusion do her results support?',
        answer: ch('A plant needs both light and water — take away either one and it barely grows', ['Plants need only water, not light', 'Plants need only light, not water', 'Soil is what makes plants grow'], 4),
        hint: 'Compare A with B, then A with C.',
        working: ['<b>Picture:</b> three identical pots, one thing changed in each.', `1. A (light + water) grew <b>${a} cm</b>.`, `2. B (no light) grew only ${b} cm → so <b>light matters</b>.`, `3. C (no water) grew only ${c} cm → so <b>water matters</b>.`, 'So it needs both.'],
        finalAnswer: 'A plant needs both light and water — take away either one and it barely grows',
      };
    },
    () => ({
      visual: photoSvg(),
      prompt: 'A friend says "plants breathe in oxygen like we do, so they cannot make it". What would you tell him?',
      answer: ch('Plants do respire, but in the light they make far more oxygen than they use, so oxygen comes out', ['He is right — plants never make oxygen', 'Plants do not respire at all', 'Plants only make oxygen at night'], 4),
      hint: 'Two things happen at once: photosynthesis makes oxygen, respiration uses some of it.',
      working: ['<b>Picture:</b> a shop that makes 100 pies and eats 10 of them — plenty still go out the door.', '1. Photosynthesis: carbon dioxide + water → glucose + <b>oxygen</b>.', '2. Respiration also happens, using a little of it back up.', '3. In daylight the factory makes far more than it uses.', 'So oxygen comes <b>out</b> of the plant.'],
      finalAnswer: 'Plants do respire, but in the light they make far more oxygen than they use, so oxygen comes out',
    }),
    (level) => {
      const p = R.pick(PARTS.filter((x) => ['roots', 'stem', 'leaf'].includes(x.key)));
      const damage = { roots: 'Harper accidentally cuts most of the roots off a seedling when she repots it', stem: 'a possum snaps the stem of a young rātā near the ground', leaf: 'a caterpillar eats every leaf off a young tree' };
      const result = {
        roots: 'It cannot take up water or minerals, so it wilts and stops growing',
        stem: 'Water and food can no longer travel between the roots and the leaves',
        leaf: 'It can no longer photosynthesise, so it makes no food',
      };
      return {
        visual: plantSvg(p.key, false),
        prompt: `${damage[p.key]}. What happens to the plant, and why?`,
        answer: ch(result[p.key], Object.keys(result).map((k) => result[k]).concat(['Nothing — plants can regrow any part instantly']), 4),
        hint: `Start with the job of the ${p.name}: they ${p.job}.`,
        working: [`<b>Picture:</b> the ${p.name} are ${p.pic}.`, `1. What is their job? They <b>${p.job}</b>.`, '2. Take that away and that job simply stops.', `So: <b>${result[p.key]}</b>.`],
        finalAnswer: result[p.key],
      };
    },
    () => ({
      prompt: 'A pot plant on a windowsill leans over towards the window. What is going on?',
      answer: ch('It grows towards the light so its leaves can catch more of it — that is sensitivity', ['The window is pulling it with static', 'It is falling over because the soil is dry', 'Plants always lean to the left'], 4),
      hint: 'Which sign of life is this, and why is light worth growing towards?',
      working: ['<b>Picture:</b> a solar panel being tilted to face the sun.', '1. What do leaves need? <b>Light</b>, for photosynthesis.', '2. So growing towards the window means more light and more food.', '3. Reacting to something around it is the <b>S</b> in MRS GREN — sensitivity.'],
      finalAnswer: 'It grows towards the light so its leaves can catch more of it — that is sensitivity',
    }),
    (level) => {
      const f = R.pick(FLOWERPARTS);
      return {
        visual: flowerSvg(f.key, false),
        prompt: `A bee lands on this flower. Explain what the <b>ringed</b> part does in making a seed.`,
        answer: ch(f.job, FLOWERPARTS.map((x) => x.job)),
        hint: 'Follow the pollen: made in the anther, carried by the bee, caught by the stigma, joins an ovule in the ovary.',
        working: ['<b>Picture:</b> pollen is the post. Anther = the postbox, bee = the postie, stigma = the letterbox, ovary = the house.', `The ringed part is the <b>${f.name}</b>.`, `It <b>${f.job}</b>.`],
        finalAnswer: f.job,
      };
    },
    () => ({
      prompt: 'A dandelion seed has a fluffy white parachute. A coprosma seed sits inside a bright juicy berry. Why are they so different?',
      answer: ch('They use different ways of being carried away — one by the wind, one inside an animal', ['One is a plant and one is a fungus', 'The dandelion seed is not really a seed', 'Berries are heavier so they grow faster'], 4),
      hint: 'Match the shape of the seed to whatever moves it.',
      working: ['<b>Picture:</b> a parachute versus a lunchbox.', '1. Fluffy and light → caught by the <b>wind</b>.', '2. Sweet and bright → eaten by a <b>bird</b>, and the seed comes out somewhere else.', 'Both do the same job — getting the seed away from the parent — in two different ways.'],
      finalAnswer: 'They use different ways of being carried away — one by the wind, one inside an animal',
    }),
    () => ({
      visual: photoSvg(),
      prompt: 'Harper puts a plant in a sealed glass jar with a lamp on it. It survives for weeks. Explain how.',
      answer: ch('It recycles its own gases: photosynthesis makes oxygen, respiration makes carbon dioxide again', ['The jar lets air in through the glass', 'The plant stops needing gases in a jar', 'The lamp makes oxygen for the plant'], 4),
      hint: 'What does photosynthesis give out, and what does respiration give out?',
      working: ['<b>Picture:</b> a loop — the two reactions feed each other.', '1. Photosynthesis: carbon dioxide + water → glucose + <b>oxygen</b>.', '2. Respiration: glucose + oxygen → energy + <b>carbon dioxide</b> + water.', '3. Each one makes what the other needs.', 'So with light, the jar can keep going for a long time.'],
      finalAnswer: 'It recycles its own gases: photosynthesis makes oxygen, respiration makes carbon dioxide again',
    }),
    () => ({
      prompt: 'Harper wants to test whether plants grow better with more water. She gives one plant 20 mL a day and another 200 mL, but puts the 200 mL one on the sunny windowsill and the other in a corner. Why are her results useless?',
      answer: ch('She changed two things at once, so she cannot tell whether it was the water or the light', ['She should have used more plants', 'She should have measured in litres', '200 mL is too much water for any plant'], 4),
      hint: 'A fair test changes ONE thing.',
      working: ['<b>Picture:</b> a race where one runner has a shorter track AND better shoes — you learn nothing.', '1. What did she change? <b>Water AND light.</b>', '2. If one plant does better, which change caused it? <b>No way to tell.</b>', 'She must put both plants in the same light and only change the water.'],
      finalAnswer: 'She changed two things at once, so she cannot tell whether it was the water or the light',
    }),
    (level) => {
      const t = R.pick(TUBES);
      return {
        prompt: `A ring of bark is stripped right round a tree trunk, cutting the <b>${t.name}</b>. What stops working?`,
        answer: ch(`The tree can no longer move ${t.carries} ${t.dir}`, TUBES.map((x) => `The tree can no longer move ${x.carries} ${x.dir}`).concat(['The tree can no longer photosynthesise at all']), 3),
        hint: `Xylem carries water up; phloem carries food everywhere.`,
        working: [`<b>Picture:</b> ${t.pic}.`, `1. What does the ${t.name} carry? <b>${cap(t.carries)}</b>.`, `2. Cut it and that delivery stops.`, `So the tree cannot move ${t.carries} ${t.dir}.`],
        finalAnswer: `The tree can no longer move ${t.carries} ${t.dir}`,
      };
    },
    () => ({
      prompt: 'Why does a rātā tree in the deep shade of the forest floor grow much more slowly than one at the top of the canopy?',
      answer: ch('There is far less light, so it can photosynthesise much less and makes less food', ['The soil is worse on the forest floor', 'It is too cold at the bottom to have leaves', 'It gets too much water down there'], 4),
      hint: 'What is the limiting ingredient down there?',
      working: ['<b>Picture:</b> a solar panel in the shade.', '1. What does it need for food? Light, carbon dioxide and water.', '2. Which of those is short on the forest floor? <b>Light.</b>', '3. Less light → less glucose → slower growth.'],
      finalAnswer: 'There is far less light, so it can photosynthesise much less and makes less food',
    }),
  ];

  HL.registerTopic({
    id: 'plants', subject: 'science', strand: 'living', order: 7,
    name: 'Plants & photosynthesis', short: 'Plants', animal: 'gecko',
    blurb: 'How plants make their own food, and what every part is for.',
    example: 'carbon dioxide + water → glucose + oxygen',
    learn: {
      what: '<p>Plants are the only living things that can <b>make their own food</b>. In the leaves, sunlight and a green chemical called <b>chlorophyll</b> turn carbon dioxide and water into <b>glucose</b> (food) and <b>oxygen</b>. That is <b>photosynthesis</b>, and every food chain on Earth starts with it.</p><p><b>Picture for this topic:</b> a leaf is a tiny <b>food factory running on sunlight</b>. Raw materials come in (carbon dioxide from the air, water up from the roots), the finished goods go out (glucose to the plant, oxygen into the air).</p>',
      visual: `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <circle cx="160" cy="24" r="14" fill="#E8C24A"/>
        <line x1="140" y1="24" x2="180" y2="24" stroke="#E8C24A" stroke-width="3"/><line x1="160" y1="4" x2="160" y2="44" stroke="#E8C24A" stroke-width="3"/>
        <line x1="146" y1="10" x2="174" y2="38" stroke="#E8C24A" stroke-width="3"/><line x1="174" y1="10" x2="146" y2="38" stroke="#E8C24A" stroke-width="3"/>
        <text x="188" y="28" fill="#C08A10" font-size="11">light</text>
        <line x1="160" y1="46" x2="160" y2="51" stroke="#E8C24A" stroke-width="4"/><polygon points="160,58 155,49 165,49" fill="#E8C24A"/>
        <ellipse cx="160" cy="100" rx="64" ry="40" fill="#8FC96E" stroke="#5C8C3C" stroke-width="3"/>
        <text x="160" y="96" text-anchor="middle" fill="#4A4033" font-size="12">LEAF</text>
        <text x="160" y="112" text-anchor="middle" fill="#3F6B22" font-size="10">needs chlorophyll</text>
        <text x="4" y="66" fill="#5F98C4" font-size="10">carbon dioxide</text>
        <line x1="10" y1="76" x2="85" y2="76" stroke="#5F98C4" stroke-width="4" stroke-linecap="round"/><polygon points="92,76 83,71 83,81" fill="#5F98C4"/>
        <text x="4" y="110" fill="#5F98C4" font-size="10.5">water</text>
        <line x1="10" y1="120" x2="85" y2="120" stroke="#5F98C4" stroke-width="4" stroke-linecap="round"/><polygon points="92,120 83,115 83,125" fill="#5F98C4"/>
        <text x="234" y="66" fill="#6FA04C" font-size="10.5">oxygen</text>
        <line x1="228" y1="76" x2="303" y2="76" stroke="#6FA04C" stroke-width="4" stroke-linecap="round"/><polygon points="310,76 301,71 301,81" fill="#6FA04C"/>
        <text x="234" y="110" fill="#6FA04C" font-size="10.5">glucose (food)</text>
        <line x1="228" y1="120" x2="303" y2="120" stroke="#6FA04C" stroke-width="4" stroke-linecap="round"/><polygon points="310,120 301,115 301,125" fill="#6FA04C"/>
        <text x="160" y="176" text-anchor="middle" fill="#4A4033" font-size="11.5">carbon dioxide + water → glucose + oxygen</text>
        <text x="160" y="192" text-anchor="middle" fill="#7A7065" font-size="10.5">and it only works with light + chlorophyll</text>
      </svg>`,
      facts: [
        'Word equation: <b>carbon dioxide + water → glucose + oxygen</b>',
        'It also needs <b>light</b> and <b>chlorophyll</b> — but those are not used up, so they sit above the arrow',
        'Roots take in <b>water and minerals</b> · leaves make the <b>food</b> · the flower makes the <b>seeds</b>',
        '<b>Xylem</b> carries water <b>up</b> from the roots · <b>phloem</b> carries food <b>everywhere</b>',
        '<b>Pollination</b> = pollen moves from anther to stigma · <b>Dispersal</b> = the finished seed moves away',
        'A plant needs <b>light, water, carbon dioxide, warmth and minerals</b> — soil is not food',
      ],
      steps: [
        'Say the equation out loud every time: "<b>carbon dioxide plus water, goes to, glucose plus oxygen</b>". Ingredients on the left, products on the right.',
        'If the question is about a plant part, name the part first, then say its <b>one job</b>: roots = take in water, stem = hold up and carry, leaf = make food, flower = make seeds.',
        'For "why is a leaf like that?" always finish with "<b>so it can make more food</b>".',
        'Xylem or phloem? <b>Water goes up the xylem</b>. Everything else (the sugary food) goes in the phloem.',
        'For a fair test, change <b>one</b> thing and keep every other thing the same. If two things changed, the result proves nothing.',
      ],
      examples: [
        { q: 'Name the four main parts of a plant and give each one job.',
          visual: `<svg viewBox="0 0 320 220" width="320" height="220" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="0" y="172" width="320" height="48" fill="#D8BC94"/>
            <path d="M160 172 V198 M160 180 L134 204 M160 180 L186 204 M160 190 L142 214 M160 190 L178 214" fill="none" stroke="#B08850" stroke-width="5" stroke-linecap="round"/>
            <path d="M160 174 V70" stroke="#5C8C3C" stroke-width="9" stroke-linecap="round"/>
            <line x1="160" y1="126" x2="130" y2="120" stroke="#5C8C3C" stroke-width="4"/>
            <line x1="160" y1="146" x2="190" y2="142" stroke="#5C8C3C" stroke-width="4"/>
            <g transform="rotate(-18 102 116)"><ellipse cx="102" cy="116" rx="34" ry="15" fill="#8FC96E" stroke="#5C8C3C" stroke-width="2.5"/><line x1="72" y1="116" x2="132" y2="116" stroke="#5C8C3C" stroke-width="1.5"/></g>
            <g transform="rotate(18 218 138)"><ellipse cx="218" cy="138" rx="34" ry="15" fill="#8FC96E" stroke="#5C8C3C" stroke-width="2.5"/><line x1="188" y1="138" x2="248" y2="138" stroke="#5C8C3C" stroke-width="1.5"/></g>
            ${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="160" cy="58" rx="16" ry="8" transform="rotate(${a} 160 58)" fill="#F6C9DC" stroke="#E0568C" stroke-width="2"/>`).join('')}
            <circle cx="160" cy="58" r="11" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <line x1="184" y1="46" x2="244" y2="34" stroke="#4A4033" stroke-width="1.5"/><text x="248" y="38" fill="#4A4033" font-size="11.5">flower</text>
            <line x1="240" y1="128" x2="268" y2="112" stroke="#4A4033" stroke-width="1.5"/><text x="272" y="116" fill="#4A4033" font-size="11.5">leaf</text>
            <line x1="165" y1="158" x2="236" y2="168" stroke="#4A4033" stroke-width="1.5"/><text x="240" y="172" fill="#4A4033" font-size="11.5">stem</text>
            <line x1="178" y1="200" x2="232" y2="204" stroke="#4A4033" stroke-width="1.5"/><text x="236" y="208" fill="#4A4033" font-size="11.5">roots</text>
            <line x1="68" y1="116" x2="40" y2="96" stroke="#4A4033" stroke-width="1.5"/><text x="6" y="92" fill="#4A4033" font-size="11.5">leaf</text>
          </svg>`,
          working: ['<b>Picture:</b> read the plant from the ground up.', '1. <b>Roots</b> — straws in the soil: take in water and minerals, and anchor the plant.', '2. <b>Stem</b> — the lift shaft: holds it up and carries water and food.', '3. <b>Leaves</b> — solar panels: make the food by photosynthesis.', '4. <b>Flower</b> — the bright shop window: makes the seeds.'],
          a: 'Roots take in water · stem holds up and carries · leaves make food · flower makes seeds' },
        { q: 'Write the word equation for photosynthesis, and say what else is needed.',
          working: ['<b>Picture:</b> a factory — raw materials in, finished goods out.', '1. What goes IN? <b>carbon dioxide + water</b>.', '2. What comes OUT? <b>glucose + oxygen</b>.', '3. What makes it happen but is not used up? <b>Light</b> and <b>chlorophyll</b>.'],
          a: 'carbon dioxide + water → glucose + oxygen (needs light and chlorophyll)' },
        { q: 'Why is a leaf flat, wide and very thin?',
          working: ['<b>Picture:</b> a solar panel — big face to the sun, but no thicker than it has to be.', '1. Flat and wide → the biggest possible area to <b>catch light</b>.', '2. Very thin → carbon dioxide only has a short way to travel <b>in</b>, and oxygen a short way <b>out</b>.', 'Both features do the same thing: let the leaf make <b>more food</b>.'],
          a: 'Wide to catch light, thin so gases move in and out quickly' },
        { q: 'A bee lands on a flower. Name the part that makes the pollen and the part that catches it.',
          visual: `<svg viewBox="0 0 300 200" width="300" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <path d="M140 150 C100 148 66 116 62 78 C104 88 132 114 140 150 Z" fill="#F6C9DC" stroke="#E0568C" stroke-width="2.5"/>
            <path d="M160 150 C200 148 234 116 238 78 C196 88 168 114 160 150 Z" fill="#F6C9DC" stroke="#E0568C" stroke-width="2.5"/>
            <rect x="145" y="150" width="10" height="44" rx="4" fill="#5C8C3C"/>
            <path d="M136 142 Q108 118 104 88" fill="none" stroke="#C09A50" stroke-width="3.5"/>
            <path d="M164 142 Q192 118 196 88" fill="none" stroke="#C09A50" stroke-width="3.5"/>
            <ellipse cx="102" cy="80" rx="11" ry="7" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <ellipse cx="198" cy="80" rx="11" ry="7" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <ellipse cx="150" cy="146" rx="22" ry="17" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <line x1="150" y1="130" x2="150" y2="86" stroke="#C9A02A" stroke-width="5"/>
            <ellipse cx="150" cy="78" rx="14" ry="7" fill="#E0568C" stroke="#4A4033" stroke-width="2"/>
            <line x1="74" y1="100" x2="46" y2="104" stroke="#4A4033" stroke-width="1.5"/><text x="42" y="108" text-anchor="end" fill="#4A4033" font-size="11.5">petal</text>
            <line x1="96" y1="74" x2="70" y2="50" stroke="#4A4033" stroke-width="1.5"/><text x="66" y="46" text-anchor="end" fill="#4A4033" font-size="11.5">anther</text>
            <line x1="163" y1="74" x2="196" y2="50" stroke="#4A4033" stroke-width="1.5"/><text x="200" y="46" fill="#4A4033" font-size="11.5">stigma</text>
            <line x1="172" y1="150" x2="206" y2="160" stroke="#4A4033" stroke-width="1.5"/><text x="210" y="164" fill="#4A4033" font-size="11.5">ovary</text>
          </svg>`,
          working: ['<b>Picture:</b> pollen is the post. The <b>anther</b> is the postbox, the bee is the postie, the <b>stigma</b> is the letterbox, the <b>ovary</b> is the house where the seed grows.', '1. Which part makes pollen? The <b>anther</b>, on the end of a long stalk where a bee will brush it.', '2. Which part catches it? The <b>stigma</b>, sticky on top.', '3. Then the pollen joins an ovule in the <b>ovary</b> and a seed forms.'],
          a: 'The anther makes the pollen; the stigma catches it' },
        { q: 'Harper grows three identical pots. Which pot should she compare with A to test whether light matters, and what do the results show?',
          visual: `<table class="data"><tr><th>Pot</th><th>Light</th><th>Water</th><th>Height</th></tr>
            <tr><td>A</td><td>windowsill</td><td>50 mL/day</td><td>18 cm</td></tr>
            <tr><td>B</td><td>dark cupboard</td><td>50 mL/day</td><td>4 cm</td></tr>
            <tr><td>C</td><td>windowsill</td><td>none</td><td>2 cm</td></tr></table>`,
          working: ['<b>Picture:</b> two runners on the same track — only one thing may be different.', '1. A and B both get 50 mL. Only the <b>light</b> is different → compare <b>A with B</b>.', '2. A grew 18 cm, B only 4 cm → <b>light matters a lot</b>.', '3. (A and C differ only in water: 18 cm vs 2 cm → water matters too.)'],
          a: 'Compare A with B — light makes a big difference' },
        { q: 'A ring of bark is stripped right round a tree trunk, cutting the phloem. What happens?',
          working: ['<b>Picture:</b> phloem is the delivery van carrying the sugary food made in the leaves.', '1. What does phloem carry? <b>The food made in the leaves</b>, to every other part.', '2. Cut the ring and the food can no longer get down to the roots.', '3. The leaves are fine at first, but the roots slowly starve — and eventually the whole tree dies.'],
          a: 'The food made in the leaves can no longer reach the roots' },
        { q: 'Harper seals a plant in a glass jar with a lamp. Why does it survive for weeks?',
          working: ['<b>Picture:</b> a loop where each reaction feeds the other.', '1. Photosynthesis: carbon dioxide + water → glucose + <b>oxygen</b>.', '2. Respiration: glucose + oxygen → energy + <b>carbon dioxide</b> + water.', '3. Each one makes exactly what the other needs.', 'With light going in, the jar recycles its own gases.'],
          a: 'It recycles its gases — photosynthesis and respiration feed each other' },
      ],
      tips: [
        'Plants do <b>not</b> eat soil. They <b>make</b> their food in the leaves and only take <b>water and minerals</b> from the soil.',
        'Light and chlorophyll are <b>not</b> ingredients — they never appear on the left of the arrow. Only carbon dioxide and water do.',
        'Plants respire <b>all the time</b>, day and night. They only photosynthesise in the light — that is why they give out oxygen in the day.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [partJob, partOnPlant, photoQ, leafQ, flowerPartQ, dispersalQ, needsQ, plantCalc]
        : level === 2
          ? [partJob, partOnPlant, photoQ, photoDiagram, leafQ, tubeQ, flowerPartQ, pollinationQ, dispersalQ, needsQ, fairTestQ, plantCalc]
          : [partOnPlant, photoQ, photoDiagram, leafQ, tubeQ, flowerPartQ, pollinationQ, dispersalQ, needsQ, fairTestQ, plantCalc, partJob];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
