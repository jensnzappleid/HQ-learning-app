/* Topic: Conservation & biodiversity — why Aotearoa's wildlife is unusual, what threatens it,
 * extinct and endangered species, what conservation looks like in practice, kaitiakitanga and
 * mātauranga Māori alongside western science, and reading conservation data. Living World, order 12. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const SPECIES = [
    { name: 'moa', status: 'extinct', note: 'a huge flightless bird, hunted out about 600 years ago while its forest was burned too' },
    { name: 'huia', status: 'extinct', note: 'last seen for certain in 1907, after forest clearing and collecting for its tail feathers' },
    { name: 'laughing owl (whēkau)', status: 'extinct', note: 'an owl that hunted on the ground; the last one was found in 1914' },
    { name: 'Haast’s eagle', status: 'extinct', note: 'the giant eagle that hunted moa — it died out when the moa did' },
    { name: 'piopio', status: 'extinct', note: 'a forest songbird that disappeared as rats and cats spread' },
    { name: 'kākāpō', status: 'endangered', note: 'the world’s heaviest parrot — around 250 are left and every one is named and tracked' },
    { name: 'takahē', status: 'endangered', note: 'thought extinct for 50 years, then found again in the Murchison Mountains in 1948' },
    { name: 'Māui dolphin', status: 'endangered', note: 'the world’s rarest dolphin, with only about 50 adults, off the west coast of the North Island' },
    { name: 'kiwi', status: 'endangered', note: 'without trapping only about 1 chick in 20 lives long enough to breed' },
    { name: 'black robin', status: 'endangered', note: 'came back from just five birds in 1980 — every one alive today is related to one female' },
    { name: 'tara iti (fairy tern)', status: 'endangered', note: 'New Zealand’s rarest breeding bird, nesting out in the open on sand' },
    { name: 'hoiho (yellow-eyed penguin)', status: 'endangered', note: 'losing its nesting forest, and its food as the sea warms' },
    { name: 'kōkako', status: 'endangered', note: 'a blue-wattled forest singer that recovers well where rats and possums are trapped' },
  ];

  const THREATS = [
    { name: 'introduced predators', harm: 'stoats, rats, possums and cats eat the eggs, chicks and adults of birds that cannot escape them', fix: 'trapping, and the Predator Free 2050 goal' },
    { name: 'habitat loss', harm: 'forest and wetland is cleared for farms and towns, so there is nowhere left to live or feed', fix: 'replanting native forest and fencing off wetlands' },
    { name: 'pollution', harm: 'farm runoff, sediment and plastic waste poison rivers, harbours and the sea', fix: 'planting along stream banks and keeping waste out of waterways' },
    { name: 'climate change', harm: 'warming seas move the fish away, and warmer seasons cause more rat and stoat plagues', fix: 'cutting greenhouse gases and protecting large healthy habitats' },
    { name: 'fishing nets', harm: 'dolphins and seabirds drown when they are caught in nets by accident', fix: 'banning set nets in the water where Māui dolphins live' },
    { name: 'introduced browsers', harm: 'deer, goats and possums eat the young trees, so the forest cannot grow back', fix: 'culling and fencing so seedlings get a chance' },
  ];

  const PREDATORS = [
    { name: 'stoat', harm: 'kills kiwi chicks and can climb to any nest' },
    { name: 'ship rat', harm: 'eats eggs, chicks, seeds and insects like wētā' },
    { name: 'possum', harm: 'strips the leaves off rātā trees and also eats eggs and chicks' },
    { name: 'feral cat', harm: 'hunts birds, lizards and even young kākāpō' },
    { name: 'hedgehog', harm: 'eats wētā, lizards and the eggs of birds that nest on the ground' },
    { name: 'mouse', harm: 'eats insects and seeds, and feeds the stoats so their numbers explode' },
  ];

  const ACTIONS = [
    { name: 'trapping', what: 'setting lines of traps through the bush for stoats, rats and possums', why: 'fewer predators means far more chicks survive to grow up' },
    { name: 'Predator Free 2050', what: 'a national goal to clear rats, stoats and possums out of the whole country by 2050', why: 'it would give every native species the country back as safe habitat' },
    { name: 'an offshore island sanctuary', what: 'clearing every predator off an island and moving rare species onto it', why: 'the sea is a barrier, so the predators cannot walk back in' },
    { name: 'a fenced sanctuary', what: 'a predator-proof fence right around a patch of bush, like Zealandia in Wellington', why: 'it makes a safe place on the mainland where birds can nest and breed' },
    { name: 'captive breeding', what: 'raising eggs and chicks somewhere safe, then releasing the young birds', why: 'it carries a tiny population past the stage where most chicks would be killed' },
    { name: 'replanting', what: 'planting native trees and fencing stock out of wetlands and stream banks', why: 'it rebuilds the habitat that was cleared away' },
    { name: 'a marine reserve', what: 'an area of sea where no fishing at all is allowed', why: 'fish live long enough to grow big and breed, and their young spill out around it' },
    { name: 'monitoring', what: 'counting birds, checking tracking tunnels and recording every trap catch', why: 'it shows whether the work is actually making the numbers go up' },
  ];

  const WORDS = [
    { word: 'biodiversity', mean: 'the whole variety of living things in a place', ex: 'a patch of bush with many kinds of tree, bird and insect' },
    { word: 'endemic', mean: 'found naturally in one country and nowhere else on Earth', ex: 'the kiwi is endemic to Aotearoa' },
    { word: 'native', mean: 'living here naturally, without being brought by people', ex: 'the tūī is native' },
    { word: 'introduced', mean: 'brought here by people from somewhere else', ex: 'stoats were introduced in the 1880s' },
    { word: 'extinct', mean: 'gone forever — not one is left alive anywhere', ex: 'the huia' },
    { word: 'endangered', mean: 'so few are left that the species could die out', ex: 'the kākāpō' },
    { word: 'conservation', mean: 'looking after living things and their habitats so they survive', ex: 'trapping stoats in a kiwi reserve' },
    { word: 'sanctuary', mean: 'a protected place where predators are kept out', ex: 'Zealandia in Wellington' },
    { word: 'marine reserve', mean: 'an area of sea where no fishing is allowed at all', ex: 'the reserve at Goat Island' },
    { word: 'translocation', mean: 'moving animals to a safer place to start a new population', ex: 'flying takahē to a predator-free island' },
    { word: 'habitat', mean: 'the place where a plant or animal naturally lives', ex: 'damp bush floor for a kiwi' },
  ];

  const MATAURANGA = [
    { word: 'kaitiakitanga', mean: 'guardianship — the duty to look after the land, water and living things for those who come after', ex: 'an iwi acting as kaitiaki of a river and everything living in it' },
    { word: 'rāhui', mean: 'a temporary ban on taking from an area so it can recover', ex: 'a rāhui over a shellfish bed after too many were taken' },
    { word: 'maramataka', mean: 'the Māori lunar calendar, built from generations of careful observation of the moon, tides, plants and animals', ex: 'choosing the best nights to fish or to plant' },
    { word: 'mātauranga Māori', mean: 'Māori knowledge, built up and tested over many generations of careful observation', ex: 'knowing the season a bird nests, and leaving it alone then' },
    { word: 'mahinga kai', mean: 'the places where food is traditionally gathered, and the practice of gathering it', ex: 'an eel fishery cared for by the local hapū' },
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
  /** typed synonyms for the threat / predator / conservation-method names, used wherever she has
   *  to type the term herself instead of picking it from a list. */
  const THREAT_ACCEPT = {
    'introduced predators': ['predators', 'introduced predator', 'predator'],
    'habitat loss': ['loss of habitat', 'destruction of habitat'],
    pollution: [],
    'climate change': ['global warming'],
    'fishing nets': ['nets', 'set nets', 'fishing net'],
    'introduced browsers': ['browsers', 'introduced browser'],
  };
  const PREDATOR_ACCEPT = {
    stoat: ['stoats', 'a stoat'],
    'ship rat': ['rat', 'rats', 'a rat', 'black rat', 'a ship rat'],
    possum: ['possums', 'a possum', 'brushtail possum'],
    'feral cat': ['cat', 'cats', 'a cat', 'a feral cat'],
    hedgehog: ['hedgehogs', 'a hedgehog'],
    mouse: ['mice', 'a mouse'],
  };
  const ACTION_ACCEPT = {
    trapping: ['traps', 'trap lines'],
    'Predator Free 2050': ['predator free 2050', 'pf2050', 'predator free'],
    'an offshore island sanctuary': ['offshore island sanctuary', 'island sanctuary', 'an island sanctuary', 'a predator-free island', 'predator-free island'],
    'a fenced sanctuary': ['fenced sanctuary', 'a fenced mainland sanctuary', 'fenced mainland sanctuary', 'a predator-proof fence', 'mainland sanctuary'],
    'captive breeding': ['breeding in captivity'],
    replanting: ['planting trees', 'planting', 'replanting trees'],
    'a marine reserve': ['marine reserve'],
    monitoring: ['keeping records', 'record keeping'],
  };
  const WORD_ACCEPT = {
    biodiversity: [],
    endemic: ['found only here', 'unique to new zealand'],
    native: [],
    introduced: ['brought in', 'brought here by people', 'non-native'],
    extinct: ['gone forever', 'died out'],
    endangered: ['at risk', 'nearly extinct'],
    conservation: ['looking after nature', 'protecting wildlife'],
    sanctuary: ['a reserve', 'a protected area', 'reserve'],
    'marine reserve': ['a marine protected area', 'no-take zone'],
    translocation: ['moving animals', 'relocation', 'moving a species'],
    habitat: ['home', 'natural home'],
  };
  const MAORI_WORD_ACCEPT = {
    kaitiakitanga: ['guardianship'],
    'rāhui': ['rahui'],
    maramataka: [],
    'mātauranga Māori': ['matauranga maori', 'matauranga', 'mātauranga'],
    'mahinga kai': [],
  };

  /* ---------- diagrams ---------- */
  function conceptSvg() {
    const row = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" fill="${INK}" font-size="10.5">${t}</text>`;
    return `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="13" text-anchor="middle" fill="${INK}" font-size="10.5">what takes biodiversity away, and what brings it back</text>
      <rect x="6" y="20" width="104" height="126" rx="10" fill="#F6DCCF" stroke="#E9A07A" stroke-width="3"/>
      <text x="58" y="40" text-anchor="middle" fill="#B0562A" font-size="12">THREATS</text>
      ${row(58, 62, 'predators')}${row(58, 82, 'habitat loss')}${row(58, 102, 'pollution')}${row(58, 122, 'climate change')}${row(58, 140, 'fishing nets')}
      <rect x="230" y="20" width="104" height="126" rx="10" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
      <text x="282" y="40" text-anchor="middle" fill="#41702A" font-size="12">PROTECTION</text>
      ${row(282, 62, 'trapping')}${row(282, 82, 'sanctuaries')}${row(282, 102, 'replanting')}${row(282, 122, 'marine reserves')}${row(282, 140, 'monitoring')}
      <circle cx="170" cy="80" r="30" fill="#E8C24A" stroke="${INK}" stroke-width="3"/>
      <text x="170" y="76" text-anchor="middle" fill="${INK}" font-size="11.5">native</text>
      <text x="170" y="92" text-anchor="middle" fill="${INK}" font-size="11.5">species</text>
      <line x1="114" y1="80" x2="132" y2="80" stroke="#E9A07A" stroke-width="4"/><polygon points="140,80 130,74 130,86" fill="#E9A07A"/>
      <line x1="226" y1="80" x2="208" y2="80" stroke="#6FA04C" stroke-width="4"/><polygon points="200,80 210,74 210,86" fill="#6FA04C"/>
      <text x="127" y="104" text-anchor="middle" fill="#B0562A" font-size="10.5">fall</text>
      <text x="213" y="104" text-anchor="middle" fill="#41702A" font-size="10.5">rise</text>
      <rect x="6" y="154" width="328" height="52" rx="10" fill="#FFF4D6" stroke="#E8C24A" stroke-width="3"/>
      <text x="170" y="174" text-anchor="middle" fill="${INK}" font-size="11">kaitiakitanga = guardianship of the natural world</text>
      <text x="170" y="194" text-anchor="middle" fill="#7A7065" font-size="10">mātauranga Māori and western science, used together</text>
    </svg>`;
  }

  /** population recovery line graph. vals = 5 counts at 2000…2020 */
  function recoverySvg(vals, species) {
    const max = Math.max.apply(null, vals);
    const years = ['2000', '2005', '2010', '2015', '2020'];
    const px = (i) => 56 + i * 54;
    const py = (v) => 150 - (v / max) * 116;
    return `<svg viewBox="0 0 320 196" width="320" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="160" y="14" text-anchor="middle" fill="${INK}" font-size="11.5">${species} counted in one reserve</text>
      <line x1="52" y1="22" x2="52" y2="150" stroke="${INK}" stroke-width="2"/>
      <line x1="52" y1="150" x2="300" y2="150" stroke="${INK}" stroke-width="2"/>
      ${[0, 0.5, 1].map((f) => `<text x="46" y="${154 - f * 116}" text-anchor="end" fill="#7A7065" font-size="10.5">${Math.round(f * max)}</text><line x1="49" y1="${150 - f * 116}" x2="52" y2="${150 - f * 116}" stroke="${INK}" stroke-width="2"/>`).join('')}
      <line x1="${px(2)}" y1="24" x2="${px(2)}" y2="150" stroke="#E0568C" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="${px(2) + 5}" y="36" fill="#E0568C" font-size="10.5">trapping starts</text>
      <polyline points="${vals.map((v, i) => `${px(i)},${py(v)}`).join(' ')}" fill="none" stroke="#6FA04C" stroke-width="3.5" stroke-linejoin="round"/>
      ${vals.map((v, i) => `<circle cx="${px(i)}" cy="${py(v)}" r="5" fill="#6FA04C" stroke="#FFFFFF" stroke-width="2"/>`).join('')}
      ${years.map((y, i) => `<text x="${px(i)}" y="166" text-anchor="middle" fill="${INK}" font-size="10.5">${y}</text>`).join('')}
      <text x="160" y="188" text-anchor="middle" fill="#7A7065" font-size="10.5">number of adult birds counted each survey</text>
    </svg>`;
  }

  /** a safe place for wildlife: an offshore island, or a fenced mainland sanctuary */
  function safeSvg(island) {
    const tree = (x, base, s) => `<rect x="${x - 3 * s}" y="${base - 22 * s}" width="${6 * s}" height="${22 * s}" fill="#8A6B4A"/><ellipse cx="${x}" cy="${base - 28 * s}" rx="${14 * s}" ry="${11 * s}" fill="#6FA04C" stroke="#41702A" stroke-width="2"/>`;
    const bird = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#4A4033"/><circle cx="${x + 9}" cy="${y - 6}" r="5" fill="#4A4033"/><polygon points="${x + 13},${y - 7} ${x + 25},${y - 3} ${x + 13},${y - 3}" fill="#E8C24A"/>`;
    const pest = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" fill="#8A7F66"/><circle cx="${x - 12}" cy="${y - 3}" r="5" fill="#8A7F66"/><path d="M${x + 13} ${y} q12 2 14 -8" fill="none" stroke="#8A7F66" stroke-width="3"/>`;
    const noEntry = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="none" stroke="#E0568C" stroke-width="4"/><line x1="${x - 12}" y1="${y + 12}" x2="${x + 12}" y2="${y - 12}" stroke="#E0568C" stroke-width="4"/>`;
    if (island) {
      return `<svg viewBox="0 0 300 180" width="300" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <rect x="6" y="20" width="288" height="112" rx="10" fill="#DCEEF9" stroke="#5F98C4" stroke-width="2"/>
        <path d="M6 20 h74 v112 h-74 z" fill="#E0C48A"/>
        ${pest(42, 96)}${noEntry(42, 92)}
        <text x="42" y="126" text-anchor="middle" fill="${INK}" font-size="10.5">mainland</text>
        <ellipse cx="210" cy="82" rx="76" ry="42" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
        ${tree(178, 104, 0.85)}${tree(250, 106, 0.8)}${bird(210, 112)}
        <text x="150" y="150" text-anchor="middle" fill="#5F98C4" font-size="12">the sea is the barrier</text>
        <text x="150" y="170" text-anchor="middle" fill="${INK}" font-size="11.5">offshore island sanctuary</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 300 180" width="300" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="6" y="20" width="288" height="112" rx="10" fill="#F4EFE4" stroke="#C9BFA8" stroke-width="2"/>
      <rect x="86" y="26" width="202" height="100" rx="8" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
      <line x1="86" y1="20" x2="86" y2="132" stroke="${INK}" stroke-width="6"/>
      ${[30, 46, 62, 78, 94, 110, 126].map((y) => `<line x1="80" y1="${y}" x2="92" y2="${y}" stroke="${INK}" stroke-width="2"/>`).join('')}
      <path d="M86 26 q-14 -2 -16 10" fill="none" stroke="${INK}" stroke-width="5"/>
      ${pest(40, 92)}${noEntry(40, 88)}
      <line x1="92" y1="120" x2="284" y2="120" stroke="#B99A6A" stroke-width="3"/>${tree(136, 120, 1)}${tree(244, 120, 0.85)}${bird(190, 108)}
      <text x="190" y="150" text-anchor="middle" fill="#41702A" font-size="12">safe inside the fence</text>
      <text x="150" y="170" text-anchor="middle" fill="${INK}" font-size="11.5">predator-proof fenced sanctuary</text>
    </svg>`;
  }

  const trapTable = (a, b, c) => `<table class="data"><tr><th>Month</th><th>Rats caught</th><th>Stoats caught</th></tr>
    <tr><td>March</td><td>${a[0]}</td><td>${a[1]}</td></tr>
    <tr><td>April</td><td>${b[0]}</td><td>${b[1]}</td></tr>
    <tr><td>May</td><td>${c[0]}</td><td>${c[1]}</td></tr></table>`;

  /* ---------- question makers ---------- */
  function nzUniqueQ() {
    const forms = [
      { p: 'Before people arrived, which land mammals lived in Aotearoa?', a: 'Only bats (pekapeka)', w: ['No mammals at all, not even bats', 'Rats and mice only', 'Possums and deer'] },
      { p: 'With almost no land mammals here, what filled the jobs mammals do in other countries?', a: 'Birds and insects — they became the grazers, the ground feeders and the night hunters', w: ['Fish moved onto the land', 'Nothing filled them, so the forest stayed empty', 'Reptiles took over every job'] },
      { p: 'Why did so many New Zealand birds stop flying?', a: 'With no ground predators, flying cost energy for no gain', w: ['The bush was too thick to fly through', 'They lost their feathers over time', 'They chose to walk instead'] },
      { p: 'What does it mean that most New Zealand species are <b>endemic</b>?', a: 'They are found here naturally and nowhere else on Earth', w: ['They were brought here by people', 'They live here only in winter', 'They are all endangered'] },
      { p: 'Why is New Zealand wildlife hit so much harder by introduced mammals than wildlife overseas?', a: 'Our species evolved with no ground predators, so they have no defences against them', w: ['Our animals are smaller than animals overseas', 'Our predators are bigger than overseas ones', 'Our animals do not breed at all'] },
      { p: 'Many NZ birds nest on the ground or in a hole in a log. Why was that once safe?', a: 'The only hunters were birds of prey hunting from the air, so a hidden nest on the ground worked', w: ['Nests were guarded by the whole flock', 'Ground nests are warmer', 'There was nothing to eat the eggs because eggs were poisonous'] },
      { p: 'What does <b>biodiversity</b> mean?', a: 'The whole variety of living things in a place', w: ['The number of animals in one species', 'How big a forest is', 'How many people live nearby'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Aotearoa sat alone in the ocean for millions of years, with no land mammals except bats.',
      working: ['<b>Picture:</b> a village with no burglars — nobody bothers locking the doors. Then burglars arrive.', 'With no ground predators, birds nested on the ground, grew heavy and many stopped flying.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'nz-biodiversity',
    };
  }
  function statusQ(level) {
    const s = R.pick(SPECIES);
    if (R.chance(0.55)) {
      return {
        prompt: `Is the <b>${s.name}</b> extinct, or endangered but still alive?`,
        answer: textAns(s.status, s.status === 'extinct' ? ['none are left anywhere', 'gone forever'] : ['some are still alive', 'still alive', 'a few are left'], 'one word'),
        hint: 'Extinct means gone forever. Endangered means a few are hanging on.',
        working: [`<b>Fact:</b> the ${s.name} is ${s.note}.`, `So it is <b>${s.status}</b>.`],
        finalAnswer: s.status, skill: 'status',
      };
    }
    const want = R.chance(0.5) ? 'extinct' : 'endangered';
    const good = R.pick(SPECIES.filter((x) => x.status === want));
    return {
      prompt: `Which of these New Zealand species is <b>${want}</b>?`,
      answer: ch(good.name, SPECIES.filter((x) => x.status !== want).map((x) => x.name)),
      hint: want === 'extinct' ? 'Extinct means not one is left alive anywhere.' : 'Endangered means very few are left, but some are still alive.',
      working: [`<b>Fact:</b> the ${good.name} is ${good.note}.`, `So the ${want} one is the <b>${good.name}</b>.`],
      finalAnswer: good.name, skill: 'status',
    };
  }
  function speciesFactQ() {
    const s = R.pick(SPECIES);
    return {
      prompt: `Which of these is true about the <b>${s.name}</b>?`,
      answer: ch(cap(s.note), SPECIES.filter((x) => x.name !== s.name).map((x) => cap(x.note))),
      hint: s.status === 'extinct' ? 'This one is gone forever.' : 'This one is still alive, but only just.',
      working: [`The ${s.name} is <b>${s.status}</b>.`, `${cap(s.note)}.`],
      finalAnswer: cap(s.note), skill: 'status',
    };
  }
  function threatQ(level) {
    const t = R.pick(THREATS);
    const form = level === 1 ? 1 : R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `<b>${cap(t.name)}</b> is a threat to native wildlife. What harm does it do?`,
        answer: ch(t.harm, THREATS.map((x) => x.harm)),
        hint: 'Think about what the species loses: its life, its home, its food or its clean water.',
        working: [`<b>Picture:</b> five separate pressures all pushing the same population down.`, `${cap(t.name)}: <b>${t.harm}</b>.`],
        finalAnswer: t.harm, skill: 'threats',
      };
    }
    if (form === 2) {
      return {
        prompt: `Which threat is this? "<b>${cap(t.harm)}</b>"`,
        answer: textAns(t.name, THREAT_ACCEPT[t.name], 'a few words'),
        hint: 'Name the pressure being described.',
        working: [`That describes <b>${t.name}</b>.`, `The usual answer to it is ${t.fix}.`],
        finalAnswer: t.name, skill: 'threats',
      };
    }
    return {
      prompt: `What do conservationists do about <b>${t.name}</b>?`,
      answer: ch(t.fix, THREATS.map((x) => x.fix)),
      hint: 'Match the problem to the tool that removes it.',
      working: [`<b>Problem:</b> ${t.harm}.`, `<b>Answer:</b> ${t.fix}.`],
      finalAnswer: t.fix, skill: 'threats',
    };
  }
  function predatorQ() {
    const p = R.pick(PREDATORS);
    if (R.chance(0.5)) {
      return {
        prompt: `The <b>${p.name}</b> was brought to New Zealand by people. What harm does it do?`,
        answer: ch(p.harm, PREDATORS.map((x) => x.harm)),
        hint: 'Think about what it eats, and which natives cannot get away from it.',
        working: ['<b>Picture:</b> a burglar arriving in a village with no locks on the doors.', `The ${p.name} <b>${p.harm}</b>.`],
        finalAnswer: p.harm, skill: 'predators',
      };
    }
    return {
      prompt: `Which introduced pest <b>${p.harm}</b>?`,
      answer: textAns(p.name, PREDATOR_ACCEPT[p.name], 'one word'),
      hint: 'Match the damage to the animal that does it.',
      working: [`That damage is done by the <b>${p.name}</b>.`, 'Traps in the bush target rats, stoats and possums together.'],
      finalAnswer: p.name, skill: 'predators',
    };
  }
  function actionQ(level) {
    const a = R.pick(ACTIONS);
    const form = level === 1 ? R.int(1, 2) : R.int(1, 3);
    if (form === 1) {
      return {
        prompt: `What is <b>${a.name}</b>?`,
        answer: ch(a.what, ACTIONS.map((x) => x.what)),
        hint: 'Match the name of the tool to what people actually do.',
        working: [`<b>${cap(a.name)}</b> means ${a.what}.`, `It works because ${a.why}.`],
        finalAnswer: a.what, skill: 'actions',
      };
    }
    if (form === 2) {
      return {
        prompt: `Why does <b>${a.name}</b> help native species?`,
        answer: ch(a.why, ACTIONS.map((x) => x.why)),
        hint: 'Ask which pressure it takes off the population.',
        working: [`<b>What it is:</b> ${a.what}.`, `<b>Why it works:</b> ${a.why}.`],
        finalAnswer: a.why, skill: 'actions',
      };
    }
    return {
      prompt: `Which conservation method is this? "<b>${cap(a.what)}</b>"`,
      answer: textAns(a.name, ACTION_ACCEPT[a.name], 'a few words'),
      hint: 'Name the method being described.',
      working: [`That is <b>${a.name}</b>.`, `It works because ${a.why}.`],
      finalAnswer: a.name, skill: 'actions',
    };
  }
  function safeQ(level) {
    const island = R.chance(0.5);
    const forms = island
      ? [
        { p: 'Why is an offshore island such a good place to protect a rare bird?', a: 'Once every predator is removed, the sea stops them walking back in', w: ['Islands have more food than the mainland', 'Birds fly better over the sea', 'Predators cannot live in salty air'] },
        { p: 'What has to be done to an island <b>before</b> rare birds are moved there?', a: 'Every last rat, stoat and cat has to be removed', w: ['All the trees have to be cut down', 'A fence has to be built round the whole island', 'The island has to be joined to the mainland'] },
        { p: 'Moving takahē to a predator-free island is an example of what?', a: 'translocation', w: ['migration', 'hibernation', 'selective breeding'], short: 'translocation', shortAccept: ['a translocation', 'moving animals', 'relocation'] },
      ]
      : [
        { p: 'Why does a predator-proof fence work on the mainland?', a: 'It keeps rats, stoats, possums and cats out, so the bush inside is safe to nest in', w: ['It keeps the native birds from flying away', 'It stops the wind damaging the trees', 'It warms the bush up inside'] },
        { p: 'What has to happen inside a new fenced sanctuary before the birds are safe?', a: 'Every predator already inside has to be trapped out', w: ['Every tree has to be replanted', 'The fence has to be painted', 'The soil has to be replaced'] },
        { p: 'Zealandia in Wellington is ringed by a special fence. What is that an example of?', a: 'a fenced mainland sanctuary', w: ['a marine reserve', 'a national park with no protection', 'a zoo'], short: 'a fenced sanctuary', shortAccept: ['fenced sanctuary', 'fenced mainland sanctuary', 'a fenced mainland sanctuary', 'mainland sanctuary', 'a predator-proof fence'] },
      ];
    const f = R.pick(forms);
    return {
      visual: safeSvg(island),
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a few words') : ch(f.a, f.w, 4),
      hint: island ? 'The sea is doing the same job a fence does.' : 'The fence is doing the same job the sea does around an island.',
      working: [
        `<b>Picture:</b> ${island ? 'an island with water all round it' : 'a fence with a curved hood so nothing can climb over'} — a wall the predators cannot get past.`,
        '1. What is being kept out? Rats, stoats, possums and cats.',
        `2. ${f.a}`,
      ],
      finalAnswer: f.a, skill: 'sanctuaries',
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
      answer: textAns(w.word, WORD_ACCEPT[w.word], 'one word'),
      hint: `Think of ${w.ex}.`,
      working: [`<b>Example:</b> ${w.ex}.`, `That word is <b>${w.word}</b>.`],
      finalAnswer: w.word, skill: 'words',
    };
  }
  function maoriWordQ() {
    const m = R.pick(MATAURANGA);
    if (R.chance(0.5)) {
      return {
        prompt: `What does <b>${m.word}</b> mean?`,
        answer: ch(m.mean, MATAURANGA.map((x) => x.mean)),
        hint: `An example is ${m.ex}.`,
        working: [`<b>Example:</b> ${m.ex}.`, `${cap(m.word)} means <b>${m.mean}</b>.`],
        finalAnswer: m.mean, skill: 'matauranga',
      };
    }
    return {
      prompt: `Which word means "<b>${m.mean}</b>"?`,
      answer: textAns(m.word, MAORI_WORD_ACCEPT[m.word], m.word.indexOf(' ') > -1 ? 'two words' : 'one word'),
      hint: `Think of ${m.ex}.`,
      working: [`<b>Example:</b> ${m.ex}.`, `That word is <b>${m.word}</b>.`],
      finalAnswer: m.word, skill: 'matauranga',
    };
  }
  function maoriUseQ(level) {
    const forms = [
      { p: 'How is <b>mātauranga Māori</b> used in conservation in New Zealand today?', a: 'Alongside western science — iwi and scientists share what each knows and plan together', w: ['It is only written about in history books', 'It replaces every other kind of science', 'It is used only overseas'] },
      { p: 'What is <b>mātauranga Māori</b> built on?', a: 'Many generations of careful observation of the natural world, tested and passed on', w: ['A single set of rules written down in one year', 'Guesswork with no observation', 'Measurements taken only in the last ten years'] },
      { p: 'A <b>rāhui</b> is placed over a bay after too much shellfish is taken. What does that do?', a: 'Nothing is taken from that place for a while, so the shellfish can grow and breed again', w: ['It makes the shellfish grow faster than normal', 'It moves the shellfish somewhere else', 'It kills the animals that eat shellfish'] },
      { p: 'A rāhui and a marine reserve both protect a piece of sea. What is the main difference?', a: 'A rāhui is usually temporary, lifted once the place has recovered; a marine reserve is permanent', w: ['A rāhui protects only fish, never shellfish', 'A marine reserve lasts one season', 'There is no difference at all'] },
      { p: 'The <b>maramataka</b> tells you the best nights to fish or plant. What is it based on?', a: 'Generations of careful observation of the moon, tides, weather, plants and animals', w: ['A guess made once, long ago', 'The dates of public holidays', 'The temperature of the water only'] },
      { p: 'What does being a <b>kaitiaki</b> of a river involve?', a: 'Looking after it and everything living in it, for the people who come after you', w: ['Owning the fish in it', 'Keeping everybody away from it forever', 'Using as much of it as you like now'] },
      { p: 'Why is it useful to have both mātauranga Māori and western science working on the same problem?', a: 'Each brings different long-term knowledge and evidence, so the plan is better than either alone', w: ['Because scientists need more people to carry equipment', 'Because two names sound better in a report', 'Because one of them is always wrong'] },
      { p: 'A hapū has watched one estuary closely for many generations. Why is that record valuable to scientists?', a: 'It is careful observation going back far further than any modern survey', w: ['It saves the scientists having to visit', 'It means no measurements are needed', 'It is interesting but cannot be used'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: ch(f.a, f.w, 4),
      hint: 'Mātauranga Māori is knowledge built up and tested over many generations, and it is used today together with other science.',
      working: [
        '<b>Picture:</b> two people who have both watched the same river — one for four generations, one with ten years of measurements. Together they see far more than either alone.',
        `Answer: <b>${f.a}</b>.`,
      ],
      finalAnswer: f.a, skill: 'matauranga',
    };
  }
  function graphQ(level) {
    const species = R.pick(['kiwi', 'kōkako', 'takahē', 'tīeke (saddleback)']);
    const vals = [R.pick([40, 50, 60]), R.pick([25, 30, 35]), R.pick([20, 25]), R.pick([60, 70, 80]), R.pick([100, 110, 120])];
    const years = ['2000', '2005', '2010', '2015', '2020'];
    const form = level === 1 ? R.int(1, 2) : R.int(1, 4);
    if (form === 1) {
      const i = R.int(0, 4);
      return {
        visual: recoverySvg(vals, species),
        prompt: `Read the graph. How many ${species} were counted in <b>${years[i]}</b>?`,
        answer: { type: 'number', value: vals[i], unit: 'birds' },
        hint: 'Find the year along the bottom, go straight up to the dot, then across to the scale.',
        working: [`Find ${years[i]} along the bottom.`, `Go up to the dot and across: <b>${vals[i]}</b> birds.`],
        finalAnswer: `${vals[i]} birds`, skill: 'data',
      };
    }
    if (form === 2) {
      return {
        visual: recoverySvg(vals, species),
        prompt: 'Read the graph. How many <b>more</b> birds were counted in 2020 than in 2010?',
        answer: { type: 'number', value: vals[4] - vals[2], unit: 'birds' },
        hint: 'Read both dots, then subtract.',
        working: [`2020: ${vals[4]}. 2010: ${vals[2]}.`, `${vals[4]} − ${vals[2]} = <b>${vals[4] - vals[2]}</b> more birds.`],
        finalAnswer: `${vals[4] - vals[2]} birds`, skill: 'data',
      };
    }
    if (form === 3) {
      return {
        visual: recoverySvg(vals, species),
        prompt: 'Describe the shape of this graph.',
        answer: ch('The numbers fell until 2010, then climbed steadily', ['The numbers rose the whole time', 'The numbers fell the whole time', 'The numbers stayed exactly the same'], 4),
        hint: 'Follow the line with your finger from left to right and say what it does.',
        working: ['<b>Picture:</b> a valley — down, then up.', `1. From 2000 to 2010 the line goes <b>down</b> (${vals[0]} → ${vals[2]}).`, `2. From 2010 to 2020 it goes <b>up</b> (${vals[2]} → ${vals[4]}).`],
        finalAnswer: 'The numbers fell until 2010, then climbed steadily', skill: 'data',
      };
    }
    return {
      visual: recoverySvg(vals, species),
      prompt: 'The numbers turn round in 2010. What is the best explanation?',
      answer: ch('Predator trapping started in 2010, so far more chicks survived', ['The birds decided to lay more eggs', 'The survey team started counting more carefully', 'The forest grew back on its own that year'], 4),
      hint: 'Look at the pink dashed line and read its label.',
      working: [
        '<b>Picture:</b> take the hunters away and more chicks live.',
        '1. What happened in 2010? <b>Trapping started</b> — the dashed line says so.',
        '2. Fewer stoats and rats = more chicks survive to become adults.',
        '3. The line turns upward right at that point. The two things match.',
      ],
      finalAnswer: 'Predator trapping started in 2010, so far more chicks survived', skill: 'data',
    };
  }
  function trapQ(level) {
    const a = [R.int(20, 40), R.int(4, 9)];
    const b = [R.int(10, 19), R.int(2, 5)];
    const c = [R.int(3, 9), R.int(0, 2)];
    const form = level === 1 ? R.int(1, 2) : R.int(1, 4);
    if (form === 1) {
      const m = R.pick([['March', a], ['April', b], ['May', c]]);
      const which = R.chance(0.5) ? 0 : 1;
      return {
        visual: trapTable(a, b, c),
        prompt: `Read the table. How many <b>${which ? 'stoats' : 'rats'}</b> were caught in <b>${m[0]}</b>?`,
        answer: { type: 'number', value: m[1][which], unit: which ? 'stoats' : 'rats' },
        hint: 'Find the month down the left, then read across to the right column.',
        working: [`Go along the <b>${m[0]}</b> row to the ${which ? 'stoats' : 'rats'} column.`, `That says <b>${m[1][which]}</b>.`],
        finalAnswer: `${m[1][which]}`, skill: 'data',
      };
    }
    if (form === 2) {
      const total = a[0] + b[0] + c[0];
      return {
        visual: trapTable(a, b, c),
        prompt: 'Read the table. How many <b>rats</b> were caught altogether over the three months?',
        answer: { type: 'number', value: total, unit: 'rats' },
        hint: 'Add the three numbers in the rats column.',
        working: [`${a[0]} + ${b[0]} + ${c[0]} = <b>${total}</b> rats.`],
        finalAnswer: `${total} rats`, skill: 'data',
      };
    }
    if (form === 3) {
      return {
        visual: trapTable(a, b, c),
        prompt: 'The rat catch drops every month. What does that most likely mean?',
        answer: ch('There are fewer rats left in the area, because the trapping is working', ['The traps have stopped working', 'The rats have learned to fly', 'More rats are arriving each month'], 4),
        hint: 'Fewer animals caught, with the same traps set the same way.',
        working: [
          '<b>Picture:</b> scooping fish out of a bucket — the fuller it is, the more you catch each scoop.',
          `1. Rats caught: ${a[0]} → ${b[0]} → ${c[0]}. Going <b>down</b>.`,
          '2. Same traps, same bait, same checking — so the change is in the rats, not the method.',
          'So there are <b>fewer rats left</b>.',
        ],
        finalAnswer: 'There are fewer rats left in the area, because the trapping is working', skill: 'data',
      };
    }
    return {
      visual: trapTable(a, b, c),
      prompt: 'Why do trappers write down every catch instead of just emptying the traps?',
      answer: ch('The record shows whether predator numbers are actually going down', ['It is a rule about being tidy', 'It tells them which bait tastes best to birds', 'It makes the traps work better'], 4),
      hint: 'Monitoring is how you know whether the work is doing anything.',
      working: ['<b>Picture:</b> weighing yourself is how you know a plan is working.', '1. Without a record you only have a feeling.', '2. With a record you can see the catch dropping month by month.', 'That is <b>monitoring</b>, and it is part of every conservation project.'],
      finalAnswer: 'The record shows whether predator numbers are actually going down', skill: 'data',
    };
  }
  function consCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const chicks = R.pick([100, 200, 300, 400]), pct = R.pick([5, 10, 20, 50]);
      return {
        prompt: `Without trapping, only <b>${pct}%</b> of kiwi chicks live long enough to breed. Out of <b>${chicks}</b> chicks, how many is that?`,
        answer: { type: 'number', value: (chicks * pct) / 100, unit: 'chicks' },
        hint: `Find 1% (divide by 100), then multiply by ${pct}.`,
        working: [`1% of ${chicks} = ${chicks / 100}.`, `${pct}% = ${chicks / 100} × ${pct} = <b>${(chicks * pct) / 100}</b> chicks.`],
        finalAnswer: `${(chicks * pct) / 100} chicks`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const lines = R.pick([6, 8, 12]), per = R.pick([15, 20, 25]);
      return {
        prompt: `A reserve has <b>${lines}</b> trap lines with <b>${per}</b> traps on each. How many traps is that altogether?`,
        answer: { type: 'number', value: lines * per, unit: 'traps' },
        hint: 'Number of lines × traps per line.',
        working: [`${lines} × ${per} = <b>${lines * per}</b> traps.`, 'Every one has to be checked and rebaited by a volunteer.'],
        finalAnswer: `${lines * per} traps`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const before = R.pick([20, 25, 40]), after = before * R.pick([2, 3, 4]);
      return {
        prompt: `A kōkako population was <b>${before}</b> birds before trapping and <b>${after}</b> ten years later. How many <b>times bigger</b> is it now?`,
        answer: { type: 'number', value: after / before, unit: '× bigger' },
        hint: 'Divide the new number by the old one.',
        working: [`${after} ÷ ${before} = <b>${after / before}</b>.`, `So the population is ${after / before} times bigger than it was.`],
        finalAnswer: `${after / before} times bigger`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const wasPct = 80, nowPct = R.pick([24, 25, 26]);
      return {
        prompt: `About <b>${wasPct}%</b> of Aotearoa was once covered in forest. Today it is about <b>${nowPct}%</b>. How many percentage points of forest cover have been lost?`,
        answer: { type: 'number', value: wasPct - nowPct, unit: '%' },
        hint: 'Take the amount left away from the amount there used to be.',
        working: [`${wasPct} − ${nowPct} = <b>${wasPct - nowPct}</b> percentage points.`, 'That lost forest is habitat that native species no longer have.'],
        finalAnswer: `${wasPct - nowPct}%`, skill: 'numbers',
      };
    }
    const start = R.pick([5, 6, 8]), now = R.pick([200, 250, 300]);
    return {
      prompt: `A rescued bird population grew from <b>${start}</b> birds to <b>${now}</b> birds. How many more birds is that?`,
      answer: { type: 'number', value: now - start, unit: 'birds' },
      hint: 'Take the starting number away from the number today.',
      working: [`${now} − ${start} = <b>${now - start}</b> more birds.`, 'The black robin really did come back from just five birds.'],
      finalAnswer: `${now - start} birds`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const species = R.pick(['kiwi', 'kōkako', 'takahē']);
      const vals = [50, 34, 22, 62, 104];
      return {
        visual: recoverySvg(vals, species),
        prompt: `A reserve started trapping stoats and rats in 2010. Explain what the graph shows and why.`,
        answer: ch('Numbers fell until trapping started, then climbed, because far more chicks survived', ['Numbers rose the whole time, because the birds bred faster', 'Numbers fell the whole time, because the bush was cut down', 'The numbers changed at random with no reason'], 4),
        hint: 'Say what the line does, then link it to the pink dashed line.',
        working: [
          '<b>Picture:</b> take the hunters away and more chicks live.',
          '1. Before 2010 the line falls: predators are eating eggs and chicks.',
          '2. Trapping starts in 2010 (the dashed line).',
          '3. After that the line climbs, because chicks now live to become adults.',
        ],
        finalAnswer: 'Numbers fell until trapping started, then climbed, because far more chicks survived',
      };
    },
    (level) => {
      const island = R.chance(0.5);
      return {
        visual: safeSvg(island),
        prompt: `A rare bird is moved to ${island ? 'a predator-free island' : 'a fenced sanctuary'}. Why does it do so much better there?`,
        answer: ch('Predators are kept out, so eggs and chicks survive instead of being eaten', ['The weather is better there', 'The birds get fed by people every day', 'There is more sunlight for them'], 4),
        hint: island ? 'The sea is the barrier.' : 'The fence is the barrier.',
        working: [
          `<b>Picture:</b> ${island ? 'water all the way round' : 'a fence with a hood so nothing can climb over'} — a wall predators cannot get past.`,
          '1. What killed the chicks before? Stoats, rats and cats.',
          '2. What is different here? Those predators have been removed and cannot get back in.',
          'So <b>more eggs and chicks survive</b>, and the population grows.',
        ],
        finalAnswer: 'Predators are kept out, so eggs and chicks survive instead of being eaten',
      };
    },
    () => ({
      prompt: 'A local hapū places a <b>rāhui</b> over a bay after a lot of shellfish is taken. A visitor asks what it is for. What would you tell them?',
      answer: ch('It is a temporary ban on taking from that place, so the shellfish can recover', ['It is a warning that the water is dirty', 'It means only tourists may gather there', 'It is a permanent ban on ever going near the bay'], 4),
      hint: 'It is about letting a place rest and rebuild.',
      working: [
        '<b>Picture:</b> a paddock left to rest so the grass can grow back.',
        '1. What has happened? Too much has been taken.',
        '2. What does a rāhui do? Stops the taking for a while.',
        '3. Left alone, the shellfish grow and breed, and the bed rebuilds.',
        'It is <b>kaitiakitanga</b> in practice — looking after the place for those who come after.',
      ],
      finalAnswer: 'It is a temporary ban on taking from that place, so the shellfish can recover',
    }),
    () => ({
      prompt: 'A conservation team works with the local iwi, who have watched the estuary for many generations. A classmate says "that is just stories, not science". What is wrong with that?',
      answer: ch('Mātauranga Māori is knowledge built and tested over generations of careful observation, and it is used with other science', ['Nothing — only measurements count as evidence', 'It is right, because observation is not evidence', 'It is right, because the records are not written down'], 4),
      hint: 'Ask what science actually is: careful observation, tested over time.',
      working: [
        '<b>Picture:</b> two people who have watched the same estuary — one for many generations, one with ten years of measurements.',
        '1. Is careful observation over a long time good evidence? <b>Yes</b> — that is what long-term data is.',
        '2. Does it replace other science? <b>No</b> — the two are used <b>together</b>.',
        'Both know things the other does not, so decisions made together are better.',
      ],
      finalAnswer: 'Mātauranga Māori is knowledge built and tested over generations of careful observation, and it is used with other science',
    }),
    () => ({
      prompt: 'Why is it so much harder to protect the Māui dolphin than a bird in a fenced sanctuary?',
      answer: ch('You cannot fence the sea — the dolphins move freely, so the fishing rules have to change instead', ['Dolphins do not have any predators', 'Dolphins can be moved to an island easily', 'Sea animals never become endangered'], 4),
      hint: 'What tool works on land but not in the open ocean?',
      working: [
        '<b>Picture:</b> a fence around a paddock works. A fence in open water does not.',
        '1. What protects a land bird? A fence or an island, keeping predators out.',
        '2. What threatens a Māui dolphin? Being caught in nets, plus disease and boat strike.',
        '3. You cannot fence the ocean, so the protection is <b>rules about where nets may be used</b>, plus marine reserves.',
      ],
      finalAnswer: 'You cannot fence the sea — the dolphins move freely, so the fishing rules have to change instead',
    }),
    (level) => {
      const a = [R.int(28, 40), R.int(5, 9)], b = [R.int(12, 20), R.int(2, 4)], c = [R.int(3, 8), R.int(0, 1)];
      return {
        visual: trapTable(a, b, c),
        prompt: 'A trapping group keeps this record. What does the trend tell them, and why is keeping the record worth the effort?',
        answer: ch('Catches are falling, so predator numbers are dropping — and only the record proves it', ['Catches are falling because the traps are broken', 'The record proves nothing, because animals move around', 'Catches are rising, so they need more traps'], 4),
        hint: 'Same traps, same bait, fewer animals caught. What changed?',
        working: [
          '<b>Picture:</b> scooping fish from a bucket — the emptier it gets, the less you catch each time.',
          `1. Rats caught: ${a[0]} → ${b[0]} → ${c[0]}. <b>Falling.</b>`,
          '2. Nothing about the method changed, so the change is in the predators.',
          '3. Without the written record they would only have a feeling. <b>Monitoring turns a feeling into evidence.</b>',
        ],
        finalAnswer: 'Catches are falling, so predator numbers are dropping — and only the record proves it',
      };
    },
    () => ({
      prompt: 'A new marine reserve is set up and all fishing inside it stops. Five years later, fishers just outside are catching more than before. Explain that.',
      answer: ch('Fish inside grow big and breed, and their young spread out into the water around the reserve', ['The fish inside got bored and left', 'Fishing outside became easier because the sea is calmer', 'The reserve made the fish grow faster than normal'], 4),
      hint: 'What happens to a fish that is never caught?',
      working: [
        '<b>Picture:</b> a savings account you never take money out of — it grows, and the interest spills over.',
        '1. Inside the reserve, fish are not caught, so they live longer and get <b>bigger</b>.',
        '2. A big fish lays far more eggs than a small one.',
        '3. Those eggs and young drift out beyond the boundary.',
        'That is called <b>spillover</b>, and it is one reason marine reserves are worth having.',
      ],
      finalAnswer: 'Fish inside grow big and breed, and their young spread out into the water around the reserve',
    }),
    () => ({
      prompt: 'A community plants thousands of native trees along a stream and fences the cows out. Which conservation problems does that help with?',
      answer: ch('Habitat loss and pollution — it rebuilds habitat and keeps runoff out of the water', ['Introduced predators only', 'Climate change only, and nothing else', 'None — planting trees does not help wildlife'], 4),
      hint: 'Think about the two things a fenced, planted stream bank fixes at once.',
      working: [
        '<b>Picture:</b> a green strip along the water acting as a filter and a home.',
        '1. Trees give birds and insects somewhere to live → helps <b>habitat loss</b>.',
        '2. Roots hold the soil and soak up runoff before it reaches the water → helps <b>pollution</b>.',
        '3. Shade keeps the stream cool, which the fish and kōura need too.',
      ],
      finalAnswer: 'Habitat loss and pollution — it rebuilds habitat and keeps runoff out of the water',
    }),
    () => ({
      prompt: 'A friend says "the moa is endangered — we should protect it". What is wrong with that sentence?',
      answer: ch('The moa is extinct, not endangered — none are left anywhere, and that cannot be undone', ['Nothing, that is right', 'The moa is not a New Zealand bird', 'The moa was never hunted'], 4),
      hint: 'Extinct and endangered are not the same word.',
      working: [
        '<b>Picture:</b> endangered is a candle nearly out; extinct is a candle already out.',
        '1. Endangered = very few left, but still alive. The kākāpō is endangered.',
        '2. Extinct = none left anywhere, forever. The moa and the huia are extinct.',
        'That is exactly why the endangered ones matter so much — the door is still open.',
      ],
      finalAnswer: 'The moa is extinct, not endangered — none are left anywhere, and that cannot be undone',
    }),
    () => ({
      prompt: 'A warm summer causes a huge beech seed crop, and rat numbers explode. Stoat numbers rise a few months later. Predict what happens to the birds, and what conservation workers do.',
      answer: ch('Bird numbers crash as rats and stoats eat eggs and chicks, so trapping and bait work is stepped up that season', ['Nothing happens — rats and stoats do not eat birds', 'The birds eat the extra seed and do better', 'The stoats eat the rats, so the birds are safer'], 4),
      hint: 'Follow the chain: seed → rats → stoats → birds.',
      working: [
        '<b>Picture:</b> a chain of dominoes, all set off by one warm summer.',
        '1. Lots of beech seed = lots of food = <b>rat numbers explode</b>.',
        '2. Lots of rats = lots of food for stoats = <b>stoat numbers rise</b>.',
        '3. When the seed runs out, the rats and stoats turn to <b>eggs and chicks</b>.',
        'So teams predict these "mast" years and put in extra trapping and bait before the crash.',
      ],
      finalAnswer: 'Bird numbers crash as rats and stoats eat eggs and chicks, so trapping and bait work is stepped up that season',
    }),
    (level) => {
      const a = R.pick(ACTIONS);
      return {
        prompt: `A school is asked to help with <b>${a.name}</b>. Which sentence best explains what it achieves?`,
        answer: ch(a.why, ACTIONS.map((x) => x.why)),
        hint: `It means ${a.what}.`,
        working: [`<b>What it is:</b> ${a.what}.`, '1. Which pressure does that take off the species?', `<b>${cap(a.why)}.</b>`],
        finalAnswer: a.why,
      };
    },
  ];

  HL.registerTopic({
    id: 'conservation', subject: 'science', strand: 'living', order: 13,
    name: 'Conservation & biodiversity', short: 'Conservation', animal: 'kiwi',
    blurb: 'Why Aotearoa’s wildlife is so unusual, what is hurting it, and how people protect it.',
    example: 'no land mammals → flightless birds → stoats arrive',
    learn: {
      what: '<p><b>Biodiversity</b> is the whole variety of living things in a place. Aotearoa’s is unusual: for millions of years the only land mammals here were <b>bats</b>, so <b>birds</b> filled the jobs mammals do elsewhere — grazing, feeding on the ground, hunting insects at night — and many stopped flying. That worked until people brought <b>stoats, rats, possums and cats</b>. Add <b>habitat loss</b>, <b>pollution</b> and <b>climate change</b>, and species are lost.</p><p><b>Picture for this topic:</b> a <b>village with no locks on the doors</b>. Nobody needed them — until burglars arrived. Conservation is putting the locks on: traps, fences, islands and marine reserves. And <b>kaitiakitanga</b> is the idea that we are the <b>guardians</b> of that village, looking after it for the people who come after us.</p>',
      visual: conceptSvg(),
      facts: [
        'Aotearoa had <b>no land mammals except bats</b>, so birds took their roles and many became <b>flightless</b> or ground-nesting',
        '<b>Endemic</b> = found here and nowhere else. Most of our native species are',
        '<b>Extinct</b> = gone forever (moa, huia, laughing owl). <b>Endangered</b> = very few left (kākāpō, takahē, Māui dolphin, kiwi)',
        'Four big threats: <b>introduced predators</b>, <b>habitat loss</b>, <b>pollution</b>, <b>climate change</b>',
        'Conservation tools: <b>trapping</b> (Predator Free 2050), <b>island</b> and <b>fenced sanctuaries</b>, <b>captive breeding</b>, <b>replanting</b>, <b>marine reserves</b>, and <b>monitoring</b>',
        '<b>Kaitiakitanga</b> = guardianship. <b>Mātauranga Māori</b> — knowledge from generations of careful observation, including <b>rāhui</b> and the <b>maramataka</b> — is used <b>alongside</b> other science today',
      ],
      steps: [
        'For "why is NZ different?", start from the same sentence every time: "<b>no land mammals except bats, so birds took their jobs and many stopped flying</b>."',
        'For a threat question, name which of the four is doing the harm: <b>predators, habitat loss, pollution, climate change</b> — then say what the species actually loses (its life, its home, its food, its clean water).',
        'For a protection question, ask "<b>what is this keeping out, or putting back?</b>" A fence and an island keep predators out. Replanting puts habitat back. A marine reserve puts fish back.',
        'For extinct vs endangered: <b>extinct = the candle is out</b> (moa, huia). <b>Endangered = the candle is nearly out</b> (kākāpō, takahē). Only the second one can still be saved.',
        'For a graph or a trap table, do it in two steps: first say <b>what the numbers do</b> (up, down, flat), then say <b>what changed at that moment</b> to explain it.',
      ],
      examples: [
        { q: 'Why did so many New Zealand birds end up flightless?',
          working: ['<b>Picture:</b> a village with no burglars — nobody bothers locking the doors.', '1. What land mammals were here before people? <b>Only bats.</b>', '2. So what hunted the birds? Only birds of prey, from the air, by sight.', '3. Flying costs a huge amount of energy. With nothing on the ground to escape from, that energy was better spent elsewhere.', 'So kiwi, kākāpō and takahē became ground birds — which was perfect, until mammals arrived.'],
          a: 'There were no ground predators, so flying stopped being worth the energy' },
        { q: 'Sort these: moa, kākāpō, huia, takahē. Which are extinct and which are endangered?',
          working: ['<b>Picture:</b> extinct = the candle is out. Endangered = the candle is nearly out.', '1. <b>Moa</b> — hunted out about 600 years ago. Extinct.', '2. <b>Huia</b> — last seen for certain in 1907. Extinct.', '3. <b>Kākāpō</b> — around 250 left, every one named and tracked. Endangered.', '4. <b>Takahē</b> — thought extinct for 50 years, then found again in 1948. Endangered.'],
          a: 'Extinct: moa, huia. Endangered: kākāpō, takahē' },
        { q: 'A reserve started trapping stoats and rats in 2010. Read the graph and explain it.',
          visual: `<svg viewBox="0 0 320 196" width="320" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="160" y="14" text-anchor="middle" fill="#4A4033" font-size="11.5">kōkako counted in one reserve</text>
            <line x1="52" y1="22" x2="52" y2="150" stroke="#4A4033" stroke-width="2"/>
            <line x1="52" y1="150" x2="300" y2="150" stroke="#4A4033" stroke-width="2"/>
            <text x="46" y="154" text-anchor="end" fill="#7A7065" font-size="10.5">0</text>
            <text x="46" y="96" text-anchor="end" fill="#7A7065" font-size="10.5">50</text>
            <text x="46" y="38" text-anchor="end" fill="#7A7065" font-size="10.5">100</text>
            <line x1="164" y1="24" x2="164" y2="150" stroke="#E0568C" stroke-width="2" stroke-dasharray="5 4"/>
            <text x="169" y="36" fill="#E0568C" font-size="10.5">trapping starts</text>
            <polyline points="56,92 110,111 164,125 218,78 272,29" fill="none" stroke="#6FA04C" stroke-width="3.5" stroke-linejoin="round"/>
            ${[[56, 92], [110, 111], [164, 125], [218, 78], [272, 29]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#6FA04C" stroke="#FFFFFF" stroke-width="2"/>`).join('')}
            ${['2000', '2005', '2010', '2015', '2020'].map((t, i) => `<text x="${56 + i * 54}" y="166" text-anchor="middle" fill="#4A4033" font-size="10.5">${t}</text>`).join('')}
            <text x="160" y="188" text-anchor="middle" fill="#7A7065" font-size="10.5">number of adult birds counted each survey</text>
          </svg>`,
          working: ['<b>Step 1 — what do the numbers do?</b> They fall from 50 to about 22, then climb to about 104.', '<b>Step 2 — what changed at that moment?</b> The dashed line says trapping started in 2010.', '1. Before: stoats and rats ate the eggs and chicks, so few survived.', '2. After: with the predators trapped, chicks lived to become adults.', 'The turn in the line lines up exactly with the trapping, so that is the best explanation.'],
          a: 'Numbers fell until 2010, then rose because trapping let far more chicks survive' },
        { q: 'Why does a predator-proof fence work, and what has to be done inside it first?',
          visual: `<svg viewBox="0 0 300 180" width="300" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <rect x="6" y="20" width="288" height="112" rx="10" fill="#F4EFE4" stroke="#C9BFA8" stroke-width="2"/>
            <rect x="86" y="26" width="202" height="100" rx="8" fill="#DFF0D0" stroke="#6FA04C" stroke-width="3"/>
            <line x1="86" y1="20" x2="86" y2="132" stroke="#4A4033" stroke-width="6"/>
            ${[30, 46, 62, 78, 94, 110, 126].map((y) => `<line x1="80" y1="${y}" x2="92" y2="${y}" stroke="#4A4033" stroke-width="2"/>`).join('')}
            <path d="M86 26 q-14 -2 -16 10" fill="none" stroke="#4A4033" stroke-width="5"/>
            <ellipse cx="40" cy="92" rx="14" ry="7" fill="#8A7F66"/><circle cx="28" cy="89" r="5" fill="#8A7F66"/><path d="M53 92 q12 2 14 -8" fill="none" stroke="#8A7F66" stroke-width="3"/>
            <circle cx="40" cy="88" r="17" fill="none" stroke="#E0568C" stroke-width="4"/><line x1="28" y1="100" x2="52" y2="76" stroke="#E0568C" stroke-width="4"/>
            <line x1="92" y1="120" x2="284" y2="120" stroke="#B99A6A" stroke-width="3"/>
            <rect x="133" y="98" width="6" height="22" fill="#8A6B4A"/><ellipse cx="136" cy="92" rx="14" ry="11" fill="#6FA04C" stroke="#41702A" stroke-width="2"/>
            <rect x="241.5" y="101.3" width="5.1" height="18.7" fill="#8A6B4A"/><ellipse cx="244" cy="96.2" rx="11.9" ry="9.35" fill="#6FA04C" stroke="#41702A" stroke-width="2"/>
            <ellipse cx="190" cy="108" rx="11" ry="8" fill="#4A4033"/><circle cx="199" cy="102" r="5" fill="#4A4033"/><polygon points="203,101 215,105 203,105" fill="#E8C24A"/>
            <text x="190" y="150" text-anchor="middle" fill="#41702A" font-size="12">safe inside the fence</text>
            <text x="150" y="170" text-anchor="middle" fill="#4A4033" font-size="11.5">predator-proof fenced sanctuary</text>
          </svg>`,
          working: ['<b>Picture:</b> the fence is doing the job the sea does around an island — a wall predators cannot get past.', '1. The mesh is too fine for a mouse, and the curved hood stops anything climbing over.', '2. But a fence only keeps <b>new</b> predators out.', '3. So every rat, stoat, possum and cat already inside has to be <b>trapped out first</b>.', 'Then the bush inside is genuinely safe to nest in — that is how Zealandia in Wellington works.'],
          a: 'It keeps predators out — but every predator already inside must be removed first' },
        { q: 'A local hapū places a rāhui over a bay after too much shellfish is taken. What is a rāhui, and how does it help?',
          working: ['<b>Picture:</b> a paddock left to rest so the grass can grow back.', '1. A <b>rāhui</b> is a temporary ban on taking from a place.', '2. Nothing is gathered there for a while.', '3. Left alone, the shellfish grow bigger and breed, and the bed rebuilds.', 'This is <b>kaitiakitanga</b> — guardianship — in practice: looking after the place for those who come after. It works the same way a marine reserve does, but a rāhui is usually lifted once the place has recovered.'],
          a: 'A temporary ban on taking from a place, so it can recover' },
        { q: 'Explain how mātauranga Māori and western science are used together in conservation.',
          working: ['<b>Picture:</b> two people who have both watched the same estuary — one for many generations, one with ten years of measurements.', '1. <b>Mātauranga Māori</b> is knowledge built up and tested over many generations of careful observation — when a bird nests, when a fish runs, how a place behaves in a hard season.', '2. Western science brings its own tools: surveys, tracking tunnels, tagging, DNA testing.', '3. Neither replaces the other. Iwi and scientists share what each knows and plan together.', 'Real examples: a rāhui used with a monitoring programme, and the <b>maramataka</b> used alongside modern records to choose when to gather.'],
          a: 'They are used side by side — long-term observation plus modern measurement, with decisions made together' },
        { q: 'A warm summer makes a huge beech seed crop. Predict what happens to rats, stoats and native birds — and what conservation teams do about it.',
          working: ['<b>Picture:</b> a row of dominoes, all set off by one warm summer.', '1. Lots of seed = lots of food → <b>rat numbers explode</b>.', '2. Lots of rats = lots of food for stoats → a few months later <b>stoat numbers rise</b>.', '3. Then the seed runs out. The rats and stoats turn to <b>eggs, chicks and adult birds</b>.', '4. So bird numbers crash in the season after a big seed year.', 'Teams predict these "mast" years and put in <b>extra trapping and bait before the crash</b>, instead of waiting for it.'],
          a: 'Rats boom, then stoats boom, then birds crash — so extra predator control is done before it happens' },
      ],
      tips: [
        '<b>Extinct</b> and <b>endangered</b> are not the same word. Extinct = gone forever (moa, huia). Endangered = a few left, and still saveable (kākāpō, takahē).',
        'Never say a species "chose" to become flightless or "wanted" to change. Say the ones that <b>happened</b> to suit the conditions survived and had more young.',
        'Describe <b>mātauranga Māori</b> as knowledge built up over generations of careful observation, used today <b>together with</b> other science — not as old stories and not as a replacement for measurement.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [nzUniqueQ, statusQ, threatQ, predatorQ, actionQ, wordQ, maoriWordQ, graphQ, trapQ, consCalc]
        : level === 2
          ? [nzUniqueQ, statusQ, speciesFactQ, threatQ, predatorQ, actionQ, safeQ, wordQ, maoriWordQ, maoriUseQ, graphQ, trapQ, consCalc]
          : [nzUniqueQ, statusQ, speciesFactQ, threatQ, actionQ, safeQ, maoriUseQ, graphQ, trapQ, consCalc, wordQ, predatorQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
