/* Topic: Adaptations — structural and behavioural, habitats, camouflage, migration,
 * hibernation, why NZ birds lost flight, and introduced pests. Living World, order 6. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const ADAPT = [
    { animal: 'kiwi', feature: 'nostrils at the very tip of its long beak', type: 'structural', why: 'so it can smell worms and grubs under the leaf litter' },
    { animal: 'kiwi', feature: 'only coming out at night', type: 'behavioural', why: 'so it can feed without being seen by daytime hunters' },
    { animal: 'NZ fur seal', feature: 'a thick layer of blubber under the skin', type: 'structural', why: 'to hold the heat in while it swims in cold southern water' },
    { animal: 'NZ fur seal', feature: 'hauling out onto sun-warmed rocks', type: 'behavioural', why: 'to warm back up and rest after diving in cold water' },
    { animal: 'green gecko', feature: 'sticky pads under its toes', type: 'structural', why: 'so it can grip smooth bark and leaves without falling' },
    { animal: 'green gecko', feature: 'lying on a warm rock in the morning sun', type: 'behavioural', why: 'to warm its body up, because it cannot make its own heat' },
    { animal: 'weta', feature: 'a hard shell and strong spiny back legs', type: 'structural', why: 'to protect itself and kick out at anything that grabs it' },
    { animal: 'weta', feature: 'hiding inside a hole in a log all day', type: 'behavioural', why: 'to stay damp and out of sight of hungry birds' },
    { animal: 'godwit (kuaka)', feature: 'flying all the way to Alaska and back each year', type: 'behavioural', why: 'to follow the food and stay in the warm season' },
    { animal: 'hedgehog', feature: 'sleeping right through the coldest months', type: 'behavioural', why: 'to survive the time of year when there is almost no food' },
    { animal: 'little blue penguin', feature: 'tightly packed waterproof feathers', type: 'structural', why: 'to keep the cold water off its skin so it stays warm' },
    { animal: 'emperor penguin', feature: 'huddling together in a huge crowd', type: 'behavioural', why: 'so they share body heat and lose less to the wind' },
    { animal: 'ruru (morepork)', feature: 'huge eyes and soft-edged wing feathers', type: 'structural', why: 'to see in the dark and fly silently up to its prey' },
    { animal: 'camel', feature: 'a hump that stores fat', type: 'structural', why: 'so it can go for a long time with no food or water' },
    { animal: 'cactus', feature: 'leaves shrunk down into spines', type: 'structural', why: 'so it loses hardly any water and animals cannot eat it' },
    { animal: 'polar bear', feature: 'thick white fur over a layer of blubber', type: 'structural', why: 'to keep warm and stay hidden against the snow' },
    { animal: 'harakeke (flax)', feature: 'long tough waxy leaves', type: 'structural', why: 'so the wind cannot tear them and water is not lost' },
    { animal: 'tuatara', feature: 'basking on a warm rock before hunting', type: 'behavioural', why: 'to get its cold body working, because it cannot warm itself from inside' },
  ];
  const HABITATS = [
    { name: 'the icy Antarctic', key: 'icy', need: 'thick blubber and dense waterproof feathers', wrong: 'a hump for storing fat' },
    { name: 'a hot dry desert', key: 'desert', need: 'storing water and coming out only at night', wrong: 'thick white fur and blubber' },
    { name: 'the damp NZ bush floor', key: 'bush', need: 'a long beak for probing wet leaf litter', wrong: 'wide flat feet for walking on snow' },
  ];
  const TERMS = [
    { word: 'structural adaptation', mean: 'a body part that is built to suit where the animal lives', ex: 'a seal\'s blubber' },
    { word: 'behavioural adaptation', mean: 'something the animal DOES that helps it survive', ex: 'a kiwi feeding only at night' },
    { word: 'camouflage', mean: 'colours and patterns that make an animal blend into the background', ex: 'a green gecko on a green leaf' },
    { word: 'migration', mean: 'travelling a long way each year to follow food or warmth', ex: 'a godwit flying to Alaska' },
    { word: 'hibernation', mean: 'a deep winter sleep that saves energy when food is scarce', ex: 'a hedgehog sleeping through winter' },
    { word: 'habitat', mean: 'the place where an animal or plant naturally lives', ex: 'the damp bush floor for a weta' },
  ];
  const PESTS = [
    { pest: 'stoat', harm: 'hunts kiwi chicks and eggs, and can climb to any nest' },
    { pest: 'possum', harm: 'strips leaves off rātā and also eats birds\' eggs and chicks' },
    { pest: 'ship rat', harm: 'eats eggs, chicks, seeds and insects like weta' },
    { pest: 'feral cat', harm: 'hunts birds, lizards and even young kākāpō' },
    { pest: 'hedgehog', harm: 'eats weta, lizards and the eggs of ground-nesting birds' },
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
  /** a moth shape */
  function moth(cx, cy, fill, edge) {
    return `<path d="M${cx} ${cy - 12} L${cx - 30} ${cy - 4} L${cx - 26} ${cy + 14} L${cx} ${cy + 6} L${cx + 26} ${cy + 14} L${cx + 30} ${cy - 4} Z" fill="${fill}" stroke="${edge}" stroke-width="2" stroke-linejoin="round"/>` +
      `<rect x="${cx - 3}" y="${cy - 13}" width="6" height="22" rx="3" fill="${edge}"/>` +
      `<path d="M${cx - 2} ${cy - 13} q-7 -7 -12 -8 M${cx + 2} ${cy - 13} q7 -7 12 -8" fill="none" stroke="${edge}" stroke-width="2" stroke-linecap="round"/>`;
  }
  /** two moths on a trunk. dark = the trunk is dark bark; the matching moth is hidden */
  function camoSvg(dark) {
    const bg = dark ? '#6B5B45' : '#EDE6D2';
    const speck = dark ? '#5A4B38' : '#DBD2BA';
    const spots = [];
    for (let i = 0; i < 22; i++) spots.push(`<ellipse cx="${24 + ((i * 53) % 250)}" cy="${30 + ((i * 37) % 92)}" rx="${5 + (i % 4)}" ry="3" fill="${speck}"/>`);
    return `<svg viewBox="0 0 300 176" width="300" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="14" y="18" width="272" height="112" rx="10" fill="${bg}" stroke="${INK}" stroke-width="2"/>
      ${spots.join('')}
      ${moth(90, 74, '#EDE6D2', '#8A7F66')}
      ${moth(212, 74, '#6B5B45', '#3A3025')}
      <text x="90" y="122" text-anchor="middle" fill="${dark ? '#F2ECDD' : INK}" font-size="13">A</text>
      <text x="212" y="122" text-anchor="middle" fill="${dark ? '#F2ECDD' : INK}" font-size="13">B</text>
      <text x="150" y="150" text-anchor="middle" fill="${INK}" font-size="12">the tree trunk here is <tspan fill="#E0568C">${dark ? 'DARK' : 'PALE'}</tspan></text>
      <text x="150" y="168" text-anchor="middle" fill="#7A7065" font-size="11">A = pale moth · B = dark moth</text>
    </svg>`;
  }

  /** three habitat cards; highlight = key of the one being asked about */
  function habitatSvg(highlight) {
    const card = (x, key, title, body) => {
      const on = highlight === key;
      return `<rect x="${x}" y="18" width="100" height="98" rx="10" fill="${key === 'icy' ? '#DCEEF9' : key === 'desert' ? '#F7E4C0' : '#DFF0D0'}" stroke="${on ? '#E0568C' : INK}" stroke-width="${on ? 4 : 2}"/>
        ${body}
        <text x="${x + 50}" y="134" text-anchor="middle" fill="${on ? '#E0568C' : INK}" font-size="11">${title}</text>`;
    };
    const ice = `<path d="M18 104 L46 56 L74 104 Z" fill="#FFFFFF" stroke="#5F98C4" stroke-width="2"/><rect x="16" y="100" width="96" height="14" fill="#FFFFFF"/><circle cx="92" cy="42" r="10" fill="#A9D8F5"/>`;
    const des = `<circle cx="178" cy="40" r="13" fill="#E8C24A"/><path d="M158 106 V70 q0 -10 9 -10 t9 10 v36" fill="none" stroke="#6FA04C" stroke-width="9" stroke-linecap="round"/><path d="M176 84 h14 q7 0 7 -9" fill="none" stroke="#6FA04C" stroke-width="8" stroke-linecap="round"/><rect x="126" y="102" width="96" height="12" fill="#E0C48A"/>`;
    const bush = `${[0, 1, 2].map((i) => `<path d="M${262 + i * 14} 106 q-12 -26 2 -46" fill="none" stroke="#6FA04C" stroke-width="4" stroke-linecap="round"/>`).join('')}<rect x="236" y="102" width="96" height="12" fill="#8A6B4A"/><ellipse cx="270" cy="96" rx="9" ry="5" fill="#4A4033"/>`;
    return `<svg viewBox="0 0 340 148" width="340" height="148" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="13" text-anchor="middle" fill="${INK}" font-size="11.5">three habitats — which one is ringed in pink?</text>
      ${card(14, 'icy', 'icy Antarctic', ice)}
      ${card(124, 'desert', 'hot dry desert', des)}
      ${card(234, 'bush', 'damp NZ bush', bush)}
    </svg>`;
  }

  /** kiwi numbers over the years — a bar chart to read off */
  function barSvg(vals) {
    const years = ['1990', '2000', '2010', '2020'];
    const max = Math.max.apply(null, vals);
    return `<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="150" y="15" text-anchor="middle" fill="${INK}" font-size="12">kiwi counted in one bush reserve</text>
      <line x1="52" y1="24" x2="52" y2="150" stroke="${INK}" stroke-width="2"/>
      <line x1="52" y1="150" x2="288" y2="150" stroke="${INK}" stroke-width="2"/>
      ${[0, 0.5, 1].map((f) => `<text x="46" y="${154 - f * 120}" text-anchor="end" fill="#7A7065" font-size="10.5">${Math.round(f * max)}</text><line x1="49" y1="${150 - f * 120}" x2="52" y2="${150 - f * 120}" stroke="${INK}" stroke-width="2"/>`).join('')}
      ${vals.map((v, i) => {
        const h = (v / max) * 120, x = 66 + i * 56;
        return `<rect x="${x}" y="${150 - h}" width="40" height="${h}" rx="4" fill="#8FC96E" stroke="${INK}" stroke-width="2"/>
          <text x="${x + 20}" y="166" text-anchor="middle" fill="${INK}" font-size="11">${years[i]}</text>`;
      }).join('')}
      <text x="150" y="184" text-anchor="middle" fill="#7A7065" font-size="10.5">stoat trapping started in 2010</text>
    </svg>`;
  }

  const compareTable = (a, b, change) => `<table class="data"><tr><th></th><th>Animal A</th><th>Animal B</th></tr>
    <tr><td>fur</td><td>${a.fur}</td><td>${b.fur}</td></tr>
    <tr><td>food</td><td>${a.food}</td><td>${b.food}</td></tr>
    <tr><td colspan="3">change: ${change}</td></tr></table>`;

  /* ---------- question makers ---------- */
  function adaptTypeQ() {
    const a = R.pick(ADAPT);
    return {
      prompt: `<b>${cap(a.animal)}</b>: ${a.feature}. Is that a <b>structural</b> or a <b>behavioural</b> adaptation?`,
      answer: ch(a.type, ['structural', 'behavioural'], 2),
      hint: 'Structural = a body part it is BUILT with. Behavioural = something it DOES.',
      working: ['<b>Picture:</b> structural is the tool in your hand; behavioural is the way you use it.', `1. Is "${a.feature}" a body part, or an action? <b>${a.type === 'structural' ? 'A body part.' : 'An action.'}</b>`, `So it is a <b>${a.type}</b> adaptation.`],
      finalAnswer: a.type, skill: 'type',
    };
  }
  function adaptWhyQ() {
    const a = R.pick(ADAPT);
    return {
      prompt: `Why does the <b>${a.animal}</b> have ${a.feature}?`,
      answer: ch(a.why, ADAPT.map((x) => x.why)),
      hint: 'Think about where it lives and what it has to survive.',
      working: [`<b>Picture:</b> every adaptation is a tool for one job.`, `The ${a.animal} lives somewhere that makes that feature useful.`, `It is <b>${a.why}</b>.`],
      finalAnswer: a.why, skill: 'why',
    };
  }
  function adaptWhoQ() {
    const a = R.pick(ADAPT);
    return {
      prompt: `Which of these has <b>${a.feature}</b>?`,
      answer: ch(a.animal, ADAPT.map((x) => x.animal)),
      hint: a.why,
      working: [`That feature is ${a.why}.`, `That is the <b>${a.animal}</b>.`],
      finalAnswer: a.animal, skill: 'why',
    };
  }
  function termQ() {
    const t = R.pick(TERMS);
    if (R.chance(0.5)) {
      return {
        prompt: `What does <b>${t.word}</b> mean?`,
        answer: ch(t.mean, TERMS.map((x) => x.mean)),
        hint: `An example is ${t.ex}.`,
        working: [`<b>Example:</b> ${t.ex}.`, `${cap(t.word)} means <b>${t.mean}</b>.`],
        finalAnswer: t.mean, skill: 'words',
      };
    }
    return {
      prompt: `Which word means "<b>${t.mean}</b>"?`,
      answer: ch(t.word, TERMS.map((x) => x.word)),
      hint: `Think of ${t.ex}.`,
      working: [`<b>Example:</b> ${t.ex}.`, `That word is <b>${t.word}</b>.`],
      finalAnswer: t.word, skill: 'words',
    };
  }
  function habitatQ(level) {
    const h = R.pick(HABITATS);
    const form = level === 1 ? 1 : R.int(1, 2);
    if (form === 1) {
      return {
        visual: habitatSvg(h.key),
        prompt: 'Which adaptation would help an animal survive in the <b>ringed</b> habitat?',
        answer: ch(h.need, HABITATS.map((x) => x.need)),
        hint: 'Ask what is hardest about living there: the cold, the lack of water, or finding food in the dark.',
        working: [`<b>Picture:</b> ${h.name}.`, `1. What is the biggest problem there? ${h.key === 'icy' ? 'Losing heat.' : h.key === 'desert' ? 'Losing water.' : 'Finding food hidden in the leaf litter.'}`, `So the animal needs <b>${h.need}</b>.`],
        finalAnswer: h.need, skill: 'habitat',
      };
    }
    return {
      visual: habitatSvg(h.key),
      prompt: `Which adaptation would be <b>no use at all</b> in the ringed habitat?`,
      answer: ch(h.wrong, HABITATS.map((x) => x.need)),
      hint: 'One of these belongs to a completely different habitat.',
      working: [`<b>Picture:</b> ${h.name}.`, `1. What does an animal actually need there? ${h.need}.`, `2. Which option belongs somewhere else? <b>${h.wrong}</b>.`],
      finalAnswer: h.wrong, skill: 'habitat',
    };
  }
  function camoQ(level) {
    const dark = R.chance(0.5);
    const form = R.int(1, 3);
    const hidden = dark ? 'B (the dark moth)' : 'A (the pale moth)';
    const seen = dark ? 'A (the pale moth)' : 'B (the dark moth)';
    if (form === 1) {
      return {
        visual: camoSvg(dark),
        prompt: 'Which moth is better <b>camouflaged</b> on this trunk?',
        answer: ch(hidden, ['A (the pale moth)', 'B (the dark moth)', 'both are equally hidden'], 3),
        hint: 'Camouflage means matching the background you are sitting on.',
        working: [`<b>Picture:</b> hiding in a crowd — you blend in if you are dressed like everyone else.`, `1. The trunk is <b>${dark ? 'dark' : 'pale'}</b>.`, `2. Which moth matches it? <b>${hidden}</b>.`],
        finalAnswer: hidden, skill: 'camouflage',
      };
    }
    if (form === 2) {
      return {
        visual: camoSvg(dark),
        prompt: 'A bird hunts these moths by sight. Which moth is most likely to be <b>eaten</b>?',
        answer: ch(seen, ['A (the pale moth)', 'B (the dark moth)', 'neither — birds cannot see moths'], 3),
        hint: 'The one that stands out gets spotted first.',
        working: ['<b>Picture:</b> a bright yellow jumper in a room where everyone else wears black.', `1. The trunk is <b>${dark ? 'dark' : 'pale'}</b>.`, `2. The one that does NOT match is <b>${seen}</b>.`, 'So that one gets eaten first.'],
        finalAnswer: seen, skill: 'camouflage',
      };
    }
    return {
      visual: camoSvg(dark),
      prompt: `If birds keep eating the moths that stand out, what will the moth population look like in fifty years?`,
      answer: ch(`Nearly all of them will be ${dark ? 'dark' : 'pale'}, because those survive to have young`, [`Nearly all of them will be ${dark ? 'pale' : 'dark'}, because those survive to have young`, 'The moths will change colour whenever they want to', 'There will be exactly the same mix as today'], 4),
      hint: 'The survivors are the ones that get to have babies — and their babies look like them.',
      working: ['<b>Picture:</b> only the hidden ones live long enough to lay eggs.', `1. On a ${dark ? 'dark' : 'pale'} trunk, which survives? The <b>${dark ? 'dark' : 'pale'}</b> moth.`, '2. Its young are the same colour.', `3. Repeat for many generations → nearly all <b>${dark ? 'dark' : 'pale'}</b>.`],
      finalAnswer: `Nearly all of them will be ${dark ? 'dark' : 'pale'}, because those survive to have young`, skill: 'camouflage',
    };
  }
  function flightlessQ() {
    const forms = [
      { p: 'Before people arrived, New Zealand had no land mammals at all. How did that change our birds?', a: 'Many stopped needing to fly, so they became ground birds like the kiwi and kākāpō', w: ['They all grew much bigger wings', 'They learned to swim instead', 'They started hunting mammals'] },
      { p: 'Why is flying "expensive" for a bird?', a: 'Wings and flight muscles take a huge amount of energy to build and to use', w: ['Feathers wear out too fast', 'Flying makes birds cold', 'Flying stops birds laying eggs'] },
      { p: 'Why is being flightless such a problem for a kiwi <b>now</b>?', a: 'Introduced mammals like stoats hunt on the ground, and the kiwi cannot fly away', w: ['The kiwi cannot find its food any more', 'Flightless birds cannot lay eggs', 'The bush has become too cold'] },
      { p: 'A kākāpō freezes and stands very still when it is frightened. Why did that behaviour once work, but not now?', a: 'It hid the bird from hawks that hunt by sight, but stoats and cats hunt by smell', w: ['It used to make the bird invisible', 'Standing still used to scare predators away', 'Kākāpō used to be much faster'] },
      { p: 'Which NZ bird is the world\'s heaviest parrot, and cannot fly?', a: 'the kākāpō', w: ['the kea', 'the tūī', 'the kererū'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'For millions of years, the only predators here hunted from the air, by sight.',
      working: ['<b>Picture:</b> a village with no burglars — nobody bothers locking the doors. Then burglars arrive.', 'NZ birds evolved with <b>no ground predators</b>, so flying and hiding stopped being worth the energy.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'flightless',
    };
  }
  function migrateHibernateQ() {
    const forms = [
      { p: 'What is <b>migration</b>?', a: 'travelling a long way each year to follow food or warmth', w: ['a deep winter sleep to save energy', 'changing colour to match the background', 'growing a thicker coat for winter'] },
      { p: 'What is <b>hibernation</b>?', a: 'a deep winter sleep that saves energy when food is scarce', w: ['travelling a long way each year to follow food', 'coming out only at night', 'storing fat in a hump'] },
      { p: 'A godwit (kuaka) flies from New Zealand to Alaska and back every year. What is that called?', a: 'migration', w: ['hibernation', 'camouflage', 'photosynthesis'] },
      { p: 'A hedgehog sleeps through the coldest part of winter. What is that called?', a: 'hibernation', w: ['migration', 'camouflage', 'adaptation to light'] },
      { p: 'Migration and hibernation are both solutions to the same problem. What is it?', a: 'surviving a time of year when food runs short', w: ['avoiding being seen by predators', 'keeping the skin damp', 'finding a mate'] },
      { p: 'Are migration and hibernation structural or behavioural adaptations?', a: 'behavioural — they are things the animal does', w: ['structural — they are body parts', 'neither, they are habitats', 'both at the same time'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Migration = a long trip. Hibernation = a long sleep. Both dodge the hungry season.',
      working: ['<b>Picture:</b> when winter comes you can either go on holiday somewhere warm (migrate) or stay in bed (hibernate).', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'migration',
    };
  }
  function pestQ(level) {
    const p = R.pick(PESTS);
    if (R.chance(0.5)) {
      return {
        prompt: `The <b>${p.pest}</b> was brought to New Zealand by people. What harm does it do?`,
        answer: ch(p.harm, PESTS.map((x) => x.harm)),
        hint: 'Think about what it eats, and which native species cannot escape it.',
        working: ['<b>Picture:</b> a burglar arriving in a village with no locks on the doors.', `The ${p.pest} <b>${p.harm}</b>.`],
        finalAnswer: p.harm, skill: 'pests',
      };
    }
    return {
      prompt: 'Why are introduced mammals so much worse for NZ wildlife than for wildlife in other countries?',
      answer: ch('Our animals evolved with no ground predators, so they have no defences against them', ['Our animals are smaller than animals overseas', 'Our animals do not eat enough', 'Our predators are much bigger than overseas ones'], 4),
      hint: 'What predators did NZ birds and reptiles face before people arrived?',
      working: ['<b>Picture:</b> a village that never needed locks, and then burglars move in.', '1. Before people, the only NZ predators hunted from the <b>air, by sight</b>.', '2. So birds nested on the ground, froze when scared, and many stopped flying.', '3. Stoats and rats hunt on the ground, <b>by smell</b> — none of those defences work.'],
      finalAnswer: 'Our animals evolved with no ground predators, so they have no defences against them', skill: 'pests',
    };
  }
  function predictQ(level) {
    const cases = [
      { change: 'the winters get much colder', a: { fur: 'thin', food: 'grass' }, b: { fur: 'thick', food: 'grass' }, win: 'Animal B', why: 'thick fur holds the heat in when it is cold' },
      { change: 'the summers get much hotter and drier', a: { fur: 'very thick', food: 'grass' }, b: { fur: 'thin', food: 'grass' }, win: 'Animal B', why: 'thin fur lets heat escape when it is hot' },
      { change: 'a disease kills every insect in the area', a: { fur: 'thin', food: 'only insects' }, b: { fur: 'thin', food: 'insects, seeds and fruit' }, win: 'Animal B', why: 'it can switch to seeds and fruit when the insects go' },
      { change: 'a new predator arrives that hunts in daylight', a: { fur: 'brown, feeds at night', food: 'worms' }, b: { fur: 'brown, feeds at midday', food: 'worms' }, win: 'Animal A', why: 'feeding at night keeps it out of the new predator\'s way' },
      { change: 'the ground is covered in snow all year', a: { fur: 'white', food: 'small animals' }, b: { fur: 'dark brown', food: 'small animals' }, win: 'Animal A', why: 'white fur is camouflage against snow, so it is neither seen nor spotted by its own prey' },
    ];
    const c = R.pick(cases);
    return {
      visual: compareTable(c.a, c.b, c.change),
      prompt: `Look at the table. Which animal is more likely to <b>survive</b> the change?`,
      answer: ch(c.win, ['Animal A', 'Animal B', 'both exactly the same', 'neither will survive'], 4),
      hint: 'Compare the two rows and ask which difference actually matters for this change.',
      working: ['<b>Picture:</b> two people going outside — which one is dressed for the weather?', `1. What is changing? <b>${cap(c.change)}</b>.`, '2. Which row in the table matters for that? Look only at that row.', `So <b>${c.win}</b> survives, because ${c.why}.`],
      finalAnswer: c.win, skill: 'predict',
    };
  }
  function chartQ(level) {
    const vals = [R.pick([80, 100, 120]), R.pick([50, 60, 70]), R.pick([30, 40]), R.pick([90, 110, 130])];
    const form = R.int(1, level === 1 ? 2 : 3);
    if (form === 1) {
      const i = R.int(0, 3);
      return {
        visual: barSvg(vals),
        prompt: `Read the chart. How many kiwi were counted in <b>${['1990', '2000', '2010', '2020'][i]}</b>?`,
        answer: { type: 'number', value: vals[i], unit: 'kiwi' },
        hint: 'Find that year along the bottom, then run your finger up the bar to the scale on the left.',
        working: ['<b>Picture:</b> the taller the bar, the more kiwi.', `The ${['1990', '2000', '2010', '2020'][i]} bar reaches <b>${vals[i]}</b>.`],
        finalAnswer: `${vals[i]} kiwi`, skill: 'data',
      };
    }
    if (form === 2) {
      return {
        visual: barSvg(vals),
        prompt: 'Read the chart. How many <b>more</b> kiwi were counted in 2020 than in 2010?',
        answer: { type: 'number', value: vals[3] - vals[2], unit: 'kiwi' },
        hint: 'Read both bars, then subtract.',
        working: [`2020: ${vals[3]}. 2010: ${vals[2]}.`, `${vals[3]} − ${vals[2]} = <b>${vals[3] - vals[2]}</b> more kiwi.`],
        finalAnswer: `${vals[3] - vals[2]} kiwi`, skill: 'data',
      };
    }
    return {
      visual: barSvg(vals),
      prompt: 'The kiwi numbers fell and then rose again after 2010. What is the best explanation?',
      answer: ch('Stoat trapping started in 2010, so more chicks survived to grow up', ['The kiwi learned to fly away from stoats', 'Kiwi started laying more eggs on purpose', 'The bush grew back on its own'], 4),
      hint: 'Look at the note underneath the chart.',
      working: ['<b>Picture:</b> take the hunters away and more chicks live.', '1. What happened in 2010? <b>Stoat trapping started.</b>', '2. Fewer predators = more chicks survive.', '3. The bars go up after that. The two things match.'],
      finalAnswer: 'Stoat trapping started in 2010, so more chicks survived to grow up', skill: 'data',
    };
  }
  function adaptCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 3);
    if (form === 1) {
      const start = R.pick([200, 400, 500]), pct = R.pick([10, 20, 25, 50]);
      return {
        prompt: `A reserve has <b>${start}</b> kākāpō-sized birds. Only <b>${pct}%</b> of the chicks survive their first year. How many of ${start} chicks survive?`,
        answer: { type: 'number', value: (start * pct) / 100, unit: 'chicks' },
        hint: `Find 1% (divide by 100), then multiply by ${pct}.`,
        working: [`1% of ${start} = ${start / 100}.`, `${pct}% = ${start / 100} × ${pct} = <b>${(start * pct) / 100}</b> chicks.`],
        finalAnswer: `${(start * pct) / 100} chicks`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const dark = R.pick([10, 20, 30]), pale = R.pick([70, 80, 90]);
      const total = dark + pale;
      return {
        prompt: `On a pale trunk a scientist finds <b>${pale}</b> pale moths and <b>${dark}</b> dark moths. How many moths did she find altogether?`,
        answer: { type: 'number', value: total, unit: 'moths' },
        hint: 'Add the two counts together.',
        working: [`${pale} + ${dark} = <b>${total}</b> moths.`, 'Notice there are far more of the well-camouflaged colour.'],
        finalAnswer: `${total} moths`, skill: 'numbers',
      };
    }
    const km = R.pick([11000, 12000]), trips = R.pick([2, 3, 4]);
    return {
      prompt: `A godwit flies <b>${km} km</b> non-stop from Alaska to New Zealand. How far is that over <b>${trips}</b> of those flights?`,
      answer: { type: 'number', value: km * trips, unit: 'km' },
      hint: 'Multiply the distance of one flight by the number of flights.',
      working: [`${km} × ${trips} = <b>${km * trips}</b> km.`, 'That is one of the longest non-stop flights of any bird on Earth.'],
      finalAnswer: `${km * trips} km`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const dark = R.chance(0.5);
      return {
        visual: camoSvg(dark),
        prompt: `Harper puts 50 pale moths and 50 dark moths on this ${dark ? 'dark' : 'pale'} trunk and lets the birds hunt for an hour. Predict what she will find left.',`.replace(".',", '.'),
        answer: ch(`Mostly ${dark ? 'dark' : 'pale'} moths, because those blend in and were not spotted`, [`Mostly ${dark ? 'pale' : 'dark'} moths, because those blend in`, 'Exactly 25 of each, because birds choose at random', 'None at all, because birds eat every moth they find'], 4),
        hint: 'Which colour matches the trunk? That one is hardest to see.',
        working: ['<b>Picture:</b> a bright jumper in a room where everyone wears black.', `1. The trunk is <b>${dark ? 'dark' : 'pale'}</b>.`, `2. The ${dark ? 'pale' : 'dark'} moths stand out, so they are eaten first.`, `So mostly <b>${dark ? 'dark' : 'pale'}</b> moths are left.`],
        finalAnswer: `Mostly ${dark ? 'dark' : 'pale'} moths, because those blend in and were not spotted`,
      };
    },
    () => ({
      prompt: 'A kiwi has nostrils at the tip of its beak and can smell a worm under the soil. A tūī has no such thing. Why has only the kiwi got it?',
      answer: ch('The kiwi feeds at night in the leaf litter, where smell works better than sight', ['The tūī has a shorter beak so it does not need one', 'The kiwi cannot see at all', 'All ground birds have the same beak'], 4),
      hint: 'An adaptation always matches where and how the animal feeds.',
      working: ['<b>Picture:</b> feeling for your slippers in a dark room — you use touch and smell, not sight.', '1. Where does a kiwi feed? On the dark forest floor, at night.', '2. Can it see its food? No — the worms are underground.', 'So smelling at the tip of the beak is exactly the right tool for <b>its</b> habitat.'],
      finalAnswer: 'The kiwi feeds at night in the leaf litter, where smell works better than sight',
    }),
    (level) => {
      const h = R.pick(HABITATS);
      return {
        visual: habitatSvg(h.key),
        prompt: `A new animal is released into the <b>ringed</b> habitat. Which feature gives it the best chance?`,
        answer: ch(h.need, HABITATS.map((x) => x.need)),
        hint: `Ask what is hardest about living in ${h.name}.`,
        working: [`<b>Picture:</b> ${h.name}.`, `1. Biggest problem there: ${h.key === 'icy' ? 'staying warm' : h.key === 'desert' ? 'not drying out' : 'finding hidden food'}.`, `2. The feature that solves it is <b>${h.need}</b>.`],
        finalAnswer: h.need,
      };
    },
    () => ({
      prompt: 'A friend says "the arctic fox grew white fur because it wanted to hide in the snow". What is wrong with that sentence?',
      answer: ch('Animals cannot choose to change — the ones that happened to be whiter survived better and had more young', ['Nothing, that is exactly right', 'Arctic foxes are actually brown', 'Fur colour has nothing to do with survival'], 4),
      hint: 'Adaptations are not a choice. They build up over many generations.',
      working: ['<b>Picture:</b> nobody chooses their own hair colour.', '1. Can an animal decide to change its body? <b>No.</b>', '2. In a snowy place, the whiter ones are harder to see, so more of them survive to have young.', '3. Their young are whiter too. Repeat for thousands of years.', 'So the population <b>became</b> white — it did not choose to.'],
      finalAnswer: 'Animals cannot choose to change — the ones that happened to be whiter survived better and had more young',
    }),
    () => ({
      prompt: 'Kākāpō freeze and stand very still when they are frightened. Explain why that behaviour used to save them but now gets them killed.',
      answer: ch('It hid them from hawks hunting by sight, but stoats and cats hunt by smell, so standing still just makes them easy', ['They used to be able to fly away instead', 'Freezing used to frighten the hawk off', 'Kākāpō used to be much better camouflaged'], 4),
      hint: 'The old predators hunted with their eyes. The new ones hunt with their noses.',
      working: ['<b>Picture:</b> hiding under a blanket works against someone looking for you — not against a dog sniffing you out.', '1. Old predator: the giant eagle, hunting from the air by <b>sight</b>. Freezing worked.', '2. New predator: stoats and cats, hunting on the ground by <b>smell</b>.', '3. A frozen kākāpō is a sitting target.', 'The adaptation did not change; the <b>environment</b> did.'],
      finalAnswer: 'It hid them from hawks hunting by sight, but stoats and cats hunt by smell, so standing still just makes them easy',
    }),
    (level) => {
      const vals = [R.pick([90, 110]), R.pick([50, 60]), R.pick([30, 40]), R.pick([100, 120])];
      return {
        visual: barSvg(vals),
        prompt: 'Describe the pattern in this chart, and give the most likely reason for it.',
        answer: ch('Numbers fell until 2010 and then rose, because stoat trapping started that year', ['Numbers rose the whole time, because kiwi bred faster', 'Numbers fell the whole time, because the bush was cut down', 'The numbers changed at random with no reason'], 4),
        hint: 'Compare the shape of the bars with the note under the chart.',
        working: ['<b>Picture:</b> the bars are a story read left to right.', `1. ${vals[0]} → ${vals[1]} → ${vals[2]}: going <b>down</b>.`, `2. Then ${vals[2]} → ${vals[3]}: going <b>up</b> again.`, '3. What changed in 2010? Stoat trapping started.', 'Fewer predators → more chicks survive → the numbers climb.'],
        finalAnswer: 'Numbers fell until 2010 and then rose, because stoat trapping started that year',
      };
    },
    (level) => {
      const c = R.pick([
        { change: 'a long drought dries up the streams', a: { fur: 'thin', food: 'only water plants' }, b: { fur: 'thin', food: 'dry seeds and grass' }, win: 'Animal B', why: 'its food does not depend on water being there' },
        { change: 'the bush is cut down and replaced with open farmland', a: { fur: 'brown, hides in thick bush', food: 'insects' }, b: { fur: 'brown, feeds in open grass', food: 'insects' }, win: 'Animal B', why: 'it is already suited to open ground' },
      ]);
      return {
        visual: compareTable(c.a, c.b, c.change),
        prompt: 'Look at the table and predict which animal survives, giving your reason.',
        answer: ch(`${c.win} — ${c.why}`, ['Animal A — thick fur is always better', `${c.win} — ${c.why}`, 'Both equally, because they are the same size', 'Neither, because all change kills animals'], 4),
        hint: 'Only one row of the table matters for this particular change. Find it.',
        working: ['<b>Picture:</b> two people going outside — who is dressed for this weather?', `1. The change: <b>${c.change}</b>.`, '2. Which row matters? The one that the change affects.', `So <b>${c.win}</b> survives, because ${c.why}.`],
        finalAnswer: `${c.win} — ${c.why}`,
      };
    },
    () => ({
      prompt: 'Why does a fenced predator-free sanctuary work so well for kiwi, when planting more trees on its own does not?',
      answer: ch('Kiwi are not short of habitat — they are being eaten, so the fence removes the actual problem', ['Trees make it harder for kiwi to walk', 'Kiwi prefer living behind fences', 'More trees would attract more stoats'], 4),
      hint: 'Work out what is actually limiting the kiwi before you choose the fix.',
      working: ['<b>Picture:</b> if the bucket has a hole in it, adding more water does not help.', '1. What is killing kiwi chicks? <b>Stoats, rats and cats.</b>', '2. Does adding trees stop that? No.', '3. Does a predator-proof fence stop that? <b>Yes.</b>', 'Always fix the thing that is actually limiting the population.'],
      finalAnswer: 'Kiwi are not short of habitat — they are being eaten, so the fence removes the actual problem',
    }),
    (level) => {
      const a = R.pick(ADAPT);
      return {
        prompt: `Harper writes in her book: "the ${a.animal} has ${a.feature}". Is that a structural or a behavioural adaptation, and what is it for?`,
        answer: ch(`${cap(a.type)} — ${a.why}`, ADAPT.map((x) => `${cap(x.type)} — ${x.why}`)),
        hint: 'First decide body part or action, then say the job it does.',
        working: ['<b>Picture:</b> structural is the tool; behavioural is how you use it.', `1. Body part or action? <b>${a.type === 'structural' ? 'Body part → structural' : 'Action → behavioural'}</b>.`, `2. What is it for? <b>${a.why}</b>.`],
        finalAnswer: `${cap(a.type)} — ${a.why}`,
      };
    },
    () => ({
      prompt: 'Harper wants to test whether weta prefer damp hiding places or dry ones. How should she set it up?',
      answer: ch('Offer each weta a damp shelter and a dry one side by side, keep everything else the same, and count where they go', ['Put one weta in a damp box and see if it likes it', 'Ask which one looks more comfortable', 'Put all the weta in the damp box and count them'], 4),
      hint: 'A fair test gives a real choice and changes only one thing.',
      working: ['<b>Picture:</b> two identical boxes, one damp, one dry, nothing else different.', '1. What is she changing? <b>Damp or dry.</b>', '2. What must stay the same? Size, darkness, temperature, food.', '3. Test lots of weta, not one, so a single fussy weta does not decide it.', 'Then count where they settle.'],
      finalAnswer: 'Offer each weta a damp shelter and a dry one side by side, keep everything else the same, and count where they go',
    }),
  ];

  HL.registerTopic({
    id: 'adaptations', subject: 'science', strand: 'living', order: 6,
    name: 'Adaptations', short: 'Adaptations', animal: 'dolphin',
    blurb: 'The body parts and habits that let an animal survive where it lives.',
    example: 'seal = blubber (structural) · kiwi feeds at night (behavioural)',
    learn: {
      what: '<p>An <b>adaptation</b> is anything about a living thing that helps it survive where it lives. A <b>structural</b> adaptation is a body part it is built with, like a seal\'s blubber. A <b>behavioural</b> adaptation is something it <b>does</b>, like a kiwi feeding at night. Adaptations are never chosen — the individuals that happen to suit their habitat survive and have more young.</p><p><b>Picture for this topic:</b> getting dressed for the weather. <b>Structural</b> = the clothes you are wearing. <b>Behavioural</b> = what you decide to do (stay inside, go out at a cooler time, travel somewhere warmer).</p>',
      visual: `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="16" text-anchor="middle" fill="#4A4033" font-size="12.5">two kinds of adaptation</text>
        <rect x="8" y="26" width="158" height="100" rx="12" fill="#DCEEF9" stroke="#5F98C4" stroke-width="3"/>
        <text x="87" y="45" text-anchor="middle" fill="#2F6C97" font-size="12">STRUCTURAL</text>
        <text x="87" y="61" text-anchor="middle" fill="#4A4033" font-size="11">a body part</text>
        <text x="87" y="75" text-anchor="middle" fill="#4A4033" font-size="11">it is built with</text>
        <ellipse cx="60" cy="98" rx="28" ry="15" fill="#8FA8BC" stroke="#4A4033" stroke-width="2"/>
        <circle cx="36" cy="92" r="9" fill="#8FA8BC" stroke="#4A4033" stroke-width="2"/><circle cx="33" cy="90" r="2" fill="#4A4033"/>
        <path d="M86 98 l14 -8 v16 z" fill="#8FA8BC" stroke="#4A4033" stroke-width="2" stroke-linejoin="round"/>
        <text x="87" y="120" text-anchor="middle" fill="#2F6C97" font-size="10.5">seal: blubber</text>
        <rect x="174" y="26" width="158" height="100" rx="12" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
        <text x="253" y="45" text-anchor="middle" fill="#4C7C2E" font-size="12">BEHAVIOURAL</text>
        <text x="253" y="61" text-anchor="middle" fill="#4A4033" font-size="11">something</text>
        <text x="253" y="75" text-anchor="middle" fill="#4A4033" font-size="11">it DOES</text>
        <circle cx="222" cy="98" r="15" fill="#4A4033"/><circle cx="217" cy="94" r="3" fill="#FFFFFF"/>
        <path d="M236 98 q14 -3 24 2" fill="none" stroke="#A8865C" stroke-width="6" stroke-linecap="round"/>
        <circle cx="284" cy="82" r="9" fill="#E8C24A"/>
        ${[0, 1, 2].map((i) => `<circle cx="${298 + i * 10}" cy="${72 + i * 8}" r="2.5" fill="#E8C24A"/>`).join('')}
        <text x="253" y="120" text-anchor="middle" fill="#4C7C2E" font-size="10.5">kiwi: feeds at night</text>
        <text x="170" y="144" text-anchor="middle" fill="#4A4033" font-size="11.5">always ask: <tspan fill="#E0568C">how does it help it survive HERE?</tspan></text>
        <rect x="8" y="152" width="324" height="56" rx="10" fill="#FDF6E4" stroke="#E8C24A" stroke-width="2.5"/>
        <text x="20" y="171" fill="#4A4033" font-size="11">cold → blubber, thick fur, huddling</text>
        <text x="20" y="186" fill="#4A4033" font-size="11">hot + dry → store water, feed at night</text>
        <text x="20" y="201" fill="#4A4033" font-size="11">no winter food → migrate away, or hibernate</text>
      </svg>`,
      facts: [
        '<b>Structural</b> adaptation = a body part (blubber, spines, a long beak, sticky toe pads)',
        '<b>Behavioural</b> adaptation = something it does (hunting at night, huddling, migrating, hibernating)',
        '<b>Camouflage</b> = colours that match the background, so predators do not spot you',
        '<b>Migration</b> = a long yearly journey to follow food · <b>Hibernation</b> = a long winter sleep',
        'NZ had <b>no land mammals</b>, so birds nested on the ground and many stopped flying',
        'Introduced <b>stoats, rats, possums and cats</b> hunt by smell on the ground — our birds have no defence',
      ],
      steps: [
        'Ask "<b>is it a body part, or a thing it does?</b>" Body part → <b>structural</b>. Action → <b>behavioural</b>.',
        'For "why has it got that?", first name the <b>habitat</b>, then name the <b>problem</b> there (too cold, too dry, food hidden, predators about). The adaptation solves that problem.',
        'For camouflage, ask "<b>what colour is the background?</b>" The animal that matches it survives.',
        'Never say the animal "wanted" or "decided" to change. Say: the ones that happened to suit it <b>survived and had more young</b>.',
        'To predict who survives a change, find the <b>one row</b> that the change affects and ignore the rest.',
      ],
      examples: [
        { q: 'A seal has thick blubber. Is that structural or behavioural, and what is it for?',
          working: ['<b>Picture:</b> structural = the clothes you are wearing.', '1. Body part or action? Blubber is a <b>body part</b> → structural.', '2. Where does a NZ fur seal live? In cold southern water.', '3. What is the problem there? Losing body heat.', 'So blubber is a <b>structural</b> adaptation that <b>keeps the heat in</b>.'],
          a: 'Structural — it keeps the heat in while swimming in cold water' },
        { q: 'A kiwi only comes out at night. Is that structural or behavioural?',
          working: ['<b>Picture:</b> behavioural = what you decide to do.', '1. Is "coming out at night" a body part? <b>No</b> — it is something it does.', 'So it is <b>behavioural</b>. It keeps the kiwi out of the way of daytime hunters and lets it use its sense of smell.'],
          a: 'Behavioural' },
        { q: 'The trunk is dark bark. Which moth survives, and what will the population look like in fifty years?',
          visual: `<svg viewBox="0 0 300 176" width="300" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="14" y="18" width="272" height="112" rx="10" fill="#6B5B45" stroke="#4A4033" stroke-width="2"/>
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<ellipse cx="${24 + ((i * 53) % 250)}" cy="${30 + ((i * 37) % 92)}" rx="${5 + (i % 4)}" ry="3" fill="#5A4B38"/>`).join('')}
            <path d="M90 62 L60 70 L64 88 L90 80 L116 88 L120 70 Z" fill="#EDE6D2" stroke="#8A7F66" stroke-width="2" stroke-linejoin="round"/><rect x="87" y="61" width="6" height="22" rx="3" fill="#8A7F66"/>
            <path d="M212 62 L182 70 L186 88 L212 80 L238 88 L242 70 Z" fill="#6B5B45" stroke="#3A3025" stroke-width="2" stroke-linejoin="round"/><rect x="209" y="61" width="6" height="22" rx="3" fill="#3A3025"/>
            <text x="90" y="122" text-anchor="middle" fill="#F2ECDD" font-size="13">A</text>
            <text x="212" y="122" text-anchor="middle" fill="#F2ECDD" font-size="13">B</text>
            <text x="150" y="150" text-anchor="middle" fill="#4A4033" font-size="12">the tree trunk here is <tspan fill="#E0568C">DARK</tspan></text>
            <text x="150" y="168" text-anchor="middle" fill="#7A7065" font-size="11">A = pale moth · B = dark moth</text>
          </svg>`,
          working: ['<b>Picture:</b> a bright yellow jumper in a room where everyone wears black.', '1. Which moth matches a dark trunk? <b>B, the dark one.</b>', '2. So birds spot and eat moth A far more often.', '3. The survivors (dark moths) lay eggs, and their young are dark too.', 'After many generations, <b>nearly all the moths are dark</b>. Nobody chose it — the survivors just had more young.'],
          a: 'B survives, and in fifty years nearly all the moths will be dark' },
        { q: 'Why did so many New Zealand birds stop flying?',
          working: ['<b>Picture:</b> a village with no burglars — nobody bothers locking the doors.', '1. What predators were here before people? Only birds of prey, hunting from the <b>air, by sight</b>.', '2. Flying is very expensive — big wings and huge muscles cost a lot of energy.', '3. If there is nothing on the ground to escape from, that energy is better spent on eggs and body size.', 'So kiwi, kākāpō and takahē became ground birds. It worked perfectly — <b>until mammals arrived</b>.'],
          a: 'There were no ground predators, so flying stopped being worth the energy' },
        { q: 'Which animal is more likely to survive a much colder winter?',
          visual: `<table class="data"><tr><th></th><th>Animal A</th><th>Animal B</th></tr>
            <tr><td>fur</td><td>thin</td><td>thick</td></tr>
            <tr><td>food</td><td>grass</td><td>grass</td></tr>
            <tr><td colspan="3">change: the winters get much colder</td></tr></table>`,
          working: ['<b>Picture:</b> two people going outside in the snow — who is dressed for it?', '1. What is changing? The <b>cold</b>.', '2. Which row matters? Only the <b>fur</b> row — the food is the same for both.', '3. Thick fur traps a layer of warm air next to the skin.', 'So <b>Animal B</b> survives.'],
          a: 'Animal B, because thick fur holds the heat in' },
        { q: 'A godwit flies 11 000 km from Alaska to New Zealand every year. What is that called, and why does it do it?',
          working: ['<b>Picture:</b> going on holiday somewhere warm every winter.', '1. A long yearly journey → <b>migration</b>.', '2. Why bother? Because the food and the warmth are in different places at different times of year.', '3. Is it structural or behavioural? It is something the bird <b>does</b> → <b>behavioural</b>.'],
          a: 'Migration — a behavioural adaptation to follow the food and the warm season' },
        { q: 'Kākāpō freeze when they are frightened. Why did that once save them, and why does it now get them killed?',
          working: ['<b>Picture:</b> hiding under a blanket works against someone looking for you — not against a dog sniffing you out.', '1. Old predator: the giant Haast\'s eagle, hunting by <b>sight</b> from the air. Freezing made the bird invisible.', '2. New predator: stoats and cats, hunting on the ground by <b>smell</b>.', '3. A frozen kākāpō is simply an easy target.', 'The adaptation has not changed — the <b>environment</b> changed under it.'],
          a: 'It hid them from hawks hunting by sight, but stoats hunt by smell' },
      ],
      tips: [
        'Never write "the animal wanted to change" or "it grew fur because it needed to". Say the ones that <b>happened</b> to suit the place <b>survived and had more young</b>.',
        'Structural = a <b>thing</b> (you could point at it). Behavioural = a <b>doing word</b> (hunting, sleeping, flying, huddling).',
        'An adaptation is only good <b>for one habitat</b>. Blubber is brilliant in Antarctica and terrible in a desert.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [adaptTypeQ, adaptWhyQ, adaptWhoQ, termQ, habitatQ, camoQ, migrateHibernateQ, chartQ, adaptCalc]
        : level === 2
          ? [adaptTypeQ, adaptWhyQ, adaptWhoQ, termQ, habitatQ, camoQ, flightlessQ, migrateHibernateQ, pestQ, predictQ, chartQ, adaptCalc]
          : [adaptTypeQ, adaptWhyQ, habitatQ, camoQ, flightlessQ, pestQ, predictQ, chartQ, adaptCalc, termQ, migrateHibernateQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
