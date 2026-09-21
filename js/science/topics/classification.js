/* Topic: Classification — living vs non-living (MRS GREN), the five kingdoms,
 * vertebrates and invertebrates, the five vertebrate groups, and dichotomous keys.
 * Living World, order 4. Structure copied from cells.js (the exemplar). */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const MRSGREN = [
    { label: 'M', word: 'Movement', short: 'moves part of itself', mean: 'it can move some part of itself', ex: ['a sunflower slowly turning to face the sun', 'a kiwi running through the bush at night'] },
    { label: 'the first R', word: 'Respiration', short: 'gets energy from food', mean: 'it releases energy from food inside its cells', ex: ['your cells using glucose and oxygen to get energy'] },
    { label: 'S', word: 'Sensitivity', short: 'reacts to what is around it', mean: 'it notices what is around it and reacts', ex: ['a gecko darting away when a shadow passes', 'roots growing down towards water'] },
    { label: 'G', word: 'Growth', short: 'gets bigger from the inside', mean: 'it gets bigger by building new cells inside itself', ex: ['a kauri seedling turning into a huge tree'] },
    { label: 'the second R', word: 'Reproduction', short: 'makes new ones of itself', mean: 'it makes new living things like itself', ex: ['a tūī laying eggs in a nest'] },
    { label: 'E', word: 'Excretion', short: 'gets rid of its own waste', mean: 'it gets rid of the waste its own body has made', ex: ['breathing out carbon dioxide', 'sweating on a hot day'] },
    { label: 'N', word: 'Nutrition', short: 'takes in or makes food', mean: 'it takes in food, or makes its own food', ex: ['a rātā tree making sugar in its leaves'] },
  ];
  const THINGS = [
    { thing: 'a car', alive: false, trap: 'it moves and it burns fuel', why: 'it cannot grow, reproduce or sense things for itself' },
    { thing: 'a river', alive: false, trap: 'it moves, and it gets bigger after rain', why: 'it does not feed itself, respire or reproduce' },
    { thing: 'a fire', alive: false, trap: 'it grows, it moves, and it even uses oxygen', why: 'it cannot reproduce, sense things or excrete — it fails most of MRS GREN' },
    { thing: 'a cloud', alive: false, trap: 'it moves and changes shape', why: 'it has no cells, and it does not feed, grow from the inside or reproduce' },
    { thing: 'a crystal growing in a jar', alive: false, trap: 'it really does get bigger', why: 'it only adds layers on the outside — living things grow from the inside, and it cannot reproduce' },
    { thing: 'a robot vacuum cleaner', alive: false, trap: 'it moves on its own and senses the walls', why: 'it cannot grow, reproduce or feed itself' },
    { thing: 'moss growing on a rock', alive: true, trap: 'it never moves from the spot', why: 'it still grows, feeds itself, respires, reproduces with spores and reacts to light' },
    { thing: 'yeast in bread dough', alive: true, trap: 'it looks like a grey powder', why: 'it feeds on sugar, respires (that is the bubbles), grows and reproduces' },
    { thing: 'a kauri seedling', alive: true, trap: 'it does not run about', why: 'it grows, feeds itself using sunlight, respires and will reproduce one day' },
    { thing: 'a mushroom on a log', alive: true, trap: 'it has no legs, eyes or blood', why: 'it feeds on the dead log, grows, respires and reproduces with spores' },
  ];
  const KINGDOMS = [
    { name: 'animals', feature: 'made of many cells, eats other living things, and usually moves about', ex: ['a kiwi', 'a weta', 'a pāua', 'a person'] },
    { name: 'plants', feature: 'made of many cells and makes its own food using sunlight and chlorophyll', ex: ['harakeke (flax)', 'a rātā tree', 'grass', 'a fern'] },
    { name: 'fungi', feature: 'never moves and soaks up food from dead or living things around it', ex: ['a mushroom', 'mould on bread', 'yeast'] },
    { name: 'protists', feature: 'mostly single cells that do have a nucleus, usually living in water', ex: ['an amoeba', 'the green algae in a pond'] },
    { name: 'bacteria', feature: 'single cells with no nucleus at all, far too small to see', ex: ['the germs that turn milk sour', 'the bacteria in yoghurt'] },
  ];
  const GROUPS = [
    { name: 'fish', skin: 'wet scales', breathe: 'gills', young: 'lays soft jelly eggs in water', temp: 'cold-blooded', extra: 'has fins and lives in water all its life' },
    { name: 'amphibian', skin: 'moist smooth skin', breathe: 'gills when young, then lungs and skin', young: 'lays jelly eggs in water', temp: 'cold-blooded', extra: 'starts life in water as a tadpole, then moves onto land' },
    { name: 'reptile', skin: 'dry scales', breathe: 'lungs', young: 'lays leathery eggs on land', temp: 'cold-blooded', extra: 'basks in the sun to warm itself up' },
    { name: 'bird', skin: 'feathers', breathe: 'lungs', young: 'lays hard-shelled eggs', temp: 'warm-blooded', extra: 'has a beak and two wings' },
    { name: 'mammal', skin: 'fur or hair', breathe: 'lungs', young: 'gives birth to live babies', temp: 'warm-blooded', extra: 'feeds its babies on milk' },
  ];
  const VERTS = [
    { animal: 'kiwi', group: 'bird' }, { animal: 'kākāpō', group: 'bird' }, { animal: 'tūī', group: 'bird' },
    { animal: 'little blue penguin', group: 'bird' }, { animal: 'pūkeko', group: 'bird' },
    { animal: 'tuatara', group: 'reptile' }, { animal: 'green gecko', group: 'reptile' }, { animal: 'skink', group: 'reptile' },
    { animal: 'sea turtle', group: 'reptile' },
    { animal: "Hochstetter's frog", group: 'amphibian' }, { animal: 'a tadpole', group: 'amphibian' }, { animal: 'a toad', group: 'amphibian' },
    { animal: 'longfin eel (tuna)', group: 'fish' }, { animal: 'snapper', group: 'fish' }, { animal: 'a shark', group: 'fish' },
    { animal: 'New Zealand fur seal (kekeno)', group: 'mammal' }, { animal: "Hector's dolphin", group: 'mammal' },
    { animal: 'long-tailed bat (pekapeka)', group: 'mammal' }, { animal: 'a hedgehog', group: 'mammal' }, { animal: 'a stoat', group: 'mammal' },
  ];
  const INVERTS = ['a weta', 'a kina (sea urchin)', 'a pāua', 'an earthworm', 'a giant kauri snail', 'a monarch butterfly', 'a spider', 'a jellyfish', 'a crab', 'a bumblebee'];
  const INK = '#4A4033';

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
  const KEY_STEPS = [
    { q: '1  Feathers?', yes: 'BIRD' },
    { q: '2  Fur or hair?', yes: 'MAMMAL' },
    { q: '3  Fins and wet scales?', yes: 'FISH' },
    { q: '4  Dry scales?', yes: 'REPTILE' },
  ];
  const KEY_PATH = { bird: 0, mammal: 1, fish: 2, reptile: 3, amphibian: 4 };
  /** the vertebrate key as a yes/no ladder. highlight = group name → the route is drawn in pink */
  function keySvg(highlight) {
    const stop = highlight ? KEY_PATH[highlight] : -1;
    const on = (i) => (stop >= 0 && i <= stop);
    const rows = KEY_STEPS.map((s, i) => {
      const y = 26 + i * 36;
      const live = on(i);
      const hitYes = stop === i;
      const col = live ? '#E0568C' : '#C9C1B4';
      return `<rect x="8" y="${y}" width="176" height="26" rx="7" fill="${live ? '#FBE3EC' : '#FFFFFF'}" stroke="${live ? '#E0568C' : INK}" stroke-width="${live ? 3 : 2}"/>
        <text x="16" y="${y + 18}" fill="${INK}" font-size="11.5">${s.q}</text>
        <line x1="184" y1="${y + 13}" x2="212" y2="${y + 13}" stroke="${hitYes ? '#E0568C' : '#C9C1B4'}" stroke-width="${hitYes ? 4 : 2.5}"/>
        <polygon points="220,${y + 13} 210,${y + 8} 210,${y + 18}" fill="${hitYes ? '#E0568C' : '#C9C1B4'}"/>
        <text x="188" y="${y + 9}" fill="${hitYes ? '#E0568C' : '#9A9186'}" font-size="10">yes</text>
        <rect x="224" y="${y + 1}" width="104" height="24" rx="7" fill="${hitYes ? '#E0568C' : '#F3EFE7'}" stroke="${INK}" stroke-width="2"/>
        <text x="276" y="${y + 18}" text-anchor="middle" fill="${hitYes ? '#FFFFFF' : INK}" font-size="12">${s.yes}</text>
        ${i < 3 ? `<line x1="30" y1="${y + 26}" x2="30" y2="${y + 36}" stroke="${on(i + 1) ? '#E0568C' : '#C9C1B4'}" stroke-width="${on(i + 1) ? 4 : 2.5}"/><text x="36" y="${y + 35}" fill="${on(i + 1) ? '#E0568C' : '#9A9186'}" font-size="10">no</text>` : ''}`;
    }).join('');
    const lastLive = stop === 4;
    return `<svg viewBox="0 0 340 218" width="340" height="218" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="8" y="16" fill="${INK}" font-size="12">START: it has a backbone. Has it got…</text>
      ${rows}
      <line x1="30" y1="${26 + 3 * 36 + 26}" x2="30" y2="${26 + 3 * 36 + 38}" stroke="${lastLive ? '#E0568C' : '#C9C1B4'}" stroke-width="${lastLive ? 4 : 2.5}"/>
      <text x="36" y="${26 + 3 * 36 + 37}" fill="${lastLive ? '#E0568C' : '#9A9186'}" font-size="10">no</text>
      <rect x="44" y="${26 + 3 * 36 + 28}" width="120" height="24" rx="7" fill="${lastLive ? '#E0568C' : '#F3EFE7'}" stroke="${INK}" stroke-width="2"/>
      <text x="104" y="${26 + 3 * 36 + 45}" text-anchor="middle" fill="${lastLive ? '#FFFFFF' : INK}" font-size="12">AMPHIBIAN</text>
    </svg>`;
  }

  /** MRS GREN as seven labelled bars; hide = index shown as "?" */
  function mrsGrenSvg(hide) {
    const rows = MRSGREN.map((m, i) => {
      const y = 24 + i * 25, off = hide === i;
      const letter = m.word.charAt(0);
      return `<rect x="10" y="${y}" width="320" height="22" rx="7" fill="${off ? '#FFFFFF' : '#F6F0E4'}" stroke="${off ? '#E0568C' : INK}" stroke-width="${off ? 3 : 1.8}" ${off ? 'stroke-dasharray="6 4"' : ''}/>
        <circle cx="26" cy="${y + 11}" r="9" fill="${off ? '#E0568C' : '#E8C24A'}"/>
        <text x="26" y="${y + 15}" text-anchor="middle" fill="${off ? '#FFFFFF' : INK}" font-size="11">${off ? '?' : letter}</text>
        <text x="44" y="${y + 15}" fill="${off ? '#E0568C' : INK}" font-size="11.5">${off ? '? ? ?' : m.word}</text>
        <text x="150" y="${y + 15}" fill="#7A7065" font-size="10.5">${off ? '' : m.short}</text>`;
    }).join('');
    return `<svg viewBox="0 0 340 210" width="340" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="10" y="16" fill="${INK}" font-size="12">MRS GREN — the 7 signs of life</text>
      ${rows}
    </svg>`;
  }

  /** backbone or not: a fish skeleton beside a worm */
  function backboneSvg() {
    return `<svg viewBox="0 0 320 170" width="320" height="170" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <ellipse cx="88" cy="60" rx="72" ry="34" fill="#A9D8F5" stroke="#5F98C4" stroke-width="3"/>
      <polygon points="160,60 190,40 190,80" fill="#A9D8F5" stroke="#5F98C4" stroke-width="3"/>
      <line x1="28" y1="60" x2="152" y2="60" stroke="#E0568C" stroke-width="6" stroke-linecap="round"/>
      ${[44, 62, 80, 98, 116, 134].map((x) => `<line x1="${x}" y1="46" x2="${x}" y2="74" stroke="#E0568C" stroke-width="4" stroke-linecap="round"/>`).join('')}
      <circle cx="42" cy="48" r="4" fill="${INK}"/>
      <text x="96" y="116" text-anchor="middle" fill="#E0568C" font-size="12">has a backbone</text>
      <text x="96" y="134" text-anchor="middle" fill="${INK}" font-size="12">= VERTEBRATE</text>
      <path d="M212 46 q22 -14 40 0 q18 14 40 0 q16 -12 20 6 q-4 22 -22 14 q-20 -10 -38 4 q-20 14 -40 0 q-16 -12 0 -24 Z" fill="#8FC96E" stroke="#6FA04C" stroke-width="3"/>
      <circle cx="308" cy="52" r="3" fill="${INK}"/>
      <text x="256" y="116" text-anchor="middle" fill="#6FA04C" font-size="12">no backbone</text>
      <text x="256" y="134" text-anchor="middle" fill="${INK}" font-size="12">= INVERTEBRATE</text>
      <text x="160" y="158" text-anchor="middle" fill="#7A7065" font-size="11">97 out of 100 animals are invertebrates</text>
    </svg>`;
  }

  const groupTable = () => `<table class="data"><tr><th>Group</th><th>Skin</th><th>Young</th></tr>` +
    GROUPS.map((g) => `<tr><td>${g.name}</td><td>${g.skin}</td><td>${g.young}</td></tr>`).join('') + '</table>';

  /* ---------- question makers ---------- */
  function grenLetter() {
    const m = R.pick(MRSGREN);
    if (R.chance(0.5)) {
      return {
        prompt: `In <b>MRS GREN</b>, what does <b>${m.label}</b> stand for?`,
        answer: ch(m.word, MRSGREN.map((x) => x.word)),
        hint: 'Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.',
        working: ['<b>Picture:</b> a checklist of 7 boxes. Something is alive only if it ticks every box.', `In MRS GREN, ${m.label} is <b>${m.word}</b>.`],
        finalAnswer: m.word, skill: 'mrs-gren',
      };
    }
    return {
      prompt: `In MRS GREN, what does <b>${m.word}</b> mean?`,
      answer: ch(m.mean, MRSGREN.map((x) => x.mean)),
      hint: 'Say it in your own words first, then look for the option that matches.',
      working: ['<b>Picture:</b> a checklist of 7 signs of life.', `${m.word} means <b>${m.mean}</b>.`, `For example: ${m.ex[0]}.`],
      finalAnswer: m.mean, skill: 'mrs-gren',
    };
  }
  function grenScenario(level) {
    const m = R.pick(MRSGREN);
    const e = R.pick(m.ex);
    return {
      visual: level >= 2 ? undefined : mrsGrenSvg(-1),
      prompt: `Which sign of life is this: <b>${e}</b>?`,
      answer: ch(m.word, MRSGREN.map((x) => x.word)),
      hint: 'Run through MRS GREN and stop at the one that fits.',
      working: ['<b>Picture:</b> tick down the MRS GREN checklist until one fits.', `${cap(e)} is an example of <b>${m.word}</b> — ${m.mean}.`],
      finalAnswer: m.word, skill: 'mrs-gren',
    };
  }
  function grenMissing() {
    const i = R.int(0, MRSGREN.length - 1);
    const m = MRSGREN[i];
    return {
      visual: mrsGrenSvg(i),
      prompt: 'One sign of life has been rubbed off the list. Which one is missing?',
      answer: ch(m.word, MRSGREN.map((x) => x.word)),
      hint: 'Say the whole list out loud: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.',
      working: ['<b>Picture:</b> MRS GREN is a name you can remember — each letter is one sign.', `The gap is in the row for <b>${m.word}</b>.`, `It means: ${m.mean}.`],
      finalAnswer: m.word, skill: 'mrs-gren',
    };
  }
  function livingOrNot(level) {
    const t = R.pick(THINGS);
    if (level >= 2 && R.chance(0.5)) {
      return {
        prompt: `Is <b>${t.thing}</b> living or non-living, and why?`,
        answer: ch(`${t.alive ? 'Living' : 'Non-living'} — ${t.why}`, THINGS.map((x) => `${x.alive ? 'Living' : 'Non-living'} — ${x.why}`)),
        hint: `Careful: ${t.trap}. Check the whole MRS GREN list, not just one letter.`,
        working: ['<b>Picture:</b> a checklist of 7 boxes — MRS GREN. Everything alive ticks <b>all seven</b>.', `1. The tricky bit: ${t.trap}.`, `2. But ${t.why}.`, `So it is <b>${t.alive ? 'living' : 'non-living'}</b>.`],
        finalAnswer: `${t.alive ? 'Living' : 'Non-living'} — ${t.why}`, skill: 'living',
      };
    }
    return {
      prompt: `Is <b>${t.thing}</b> living or non-living?`,
      answer: ch(t.alive ? 'Living' : 'Non-living', ['Living', 'Non-living'], 2),
      hint: `It is tempting to say the other one, because ${t.trap}.`,
      working: ['<b>Picture:</b> the MRS GREN checklist — all seven boxes must tick.', `1. Tempting, because ${t.trap}.`, `2. But ${t.why}.`, `So it is <b>${t.alive ? 'living' : 'non-living'}</b>.`],
      finalAnswer: t.alive ? 'Living' : 'Non-living', skill: 'living',
    };
  }
  function kingdomOf() {
    const k = R.pick(KINGDOMS);
    const e = R.pick(k.ex);
    return {
      prompt: `Which kingdom does <b>${e}</b> belong to?`,
      answer: ch(k.name, KINGDOMS.map((x) => x.name)),
      hint: 'Ask: does it make its own food (plants), eat other things and move (animals), soak food up without moving (fungi), or is it a single tiny cell (protists / bacteria)?',
      working: ['<b>Picture:</b> five big sorting boxes on the floor.', `${cap(e)} is ${k.feature}.`, `So it goes in the <b>${k.name}</b> box.`],
      finalAnswer: k.name, skill: 'kingdoms',
    };
  }
  function kingdomFeature() {
    const k = R.pick(KINGDOMS);
    if (R.chance(0.5)) {
      return {
        prompt: `Which kingdom is described: <b>${k.feature}</b>?`,
        answer: ch(k.name, KINGDOMS.map((x) => x.name)),
        hint: 'Five kingdoms: animals, plants, fungi, protists, bacteria.',
        working: ['<b>Picture:</b> five sorting boxes.', `That description matches the <b>${k.name}</b>.`, `Example: ${k.ex[0]}.`],
        finalAnswer: k.name, skill: 'kingdoms',
      };
    }
    return {
      prompt: `What makes the <b>${k.name}</b> kingdom different from the others?`,
      answer: ch(k.feature, KINGDOMS.map((x) => x.feature)),
      hint: `Think of ${k.ex[0]}, and ask what it can and cannot do.`,
      working: [`<b>Picture:</b> ${k.ex[0]}.`, `The ${k.name} kingdom is <b>${k.feature}</b>.`],
      finalAnswer: k.feature, skill: 'kingdoms',
    };
  }
  function vertOrInvert(level) {
    const isVert = R.chance(0.5);
    const a = isVert ? R.pick(VERTS).animal : R.pick(INVERTS);
    return {
      visual: level === 1 ? backboneSvg() : undefined,
      prompt: `Is <b>${a}</b> a vertebrate or an invertebrate?`,
      answer: ch(isVert ? 'vertebrate' : 'invertebrate', ['vertebrate', 'invertebrate'], 2),
      hint: 'Vertebrate = has a backbone (a spine inside). Invertebrate = no backbone.',
      working: ['<b>Picture:</b> run your finger down your own spine — that is a backbone.', `1. Does ${a} have a backbone inside? <b>${isVert ? 'Yes' : 'No'}</b>.`, `So it is an <b>${isVert ? 'vertebrate' : 'invertebrate'}</b>.`],
      finalAnswer: isVert ? 'vertebrate' : 'invertebrate', skill: 'vert-invert',
    };
  }
  function vertGroupOf() {
    const v = R.pick(VERTS);
    const g = GROUPS.find((x) => x.name === v.group);
    return {
      prompt: `Which vertebrate group does <b>${v.animal}</b> belong to?`,
      answer: ch(v.group, GROUPS.map((x) => x.name)),
      hint: 'Look at the outside first: feathers → bird, fur → mammal, dry scales → reptile, wet scales and fins → fish, moist skin → amphibian.',
      working: ['<b>Picture:</b> what is it wearing? Feathers, fur, dry scales, wet scales or bare damp skin?', `${cap(v.animal)} has <b>${g.skin}</b>.`, `So it is a <b>${v.group}</b>.`],
      finalAnswer: v.group, skill: 'groups',
    };
  }
  function groupFeature(level) {
    const g = R.pick(GROUPS);
    const which = R.pick(level === 1 ? ['skin', 'young'] : ['skin', 'young', 'breathe', 'temp', 'extra']);
    const asks = { skin: 'What covers the outside of', young: 'How do the young of', breathe: 'How does', temp: 'Is', extra: 'Which of these is true of' };
    const prompts = {
      skin: `What is the outside of a <b>${g.name}</b> covered in?`,
      young: `How does a <b>${g.name}</b> have its young?`,
      breathe: `How does a <b>${g.name}</b> take in oxygen?`,
      temp: `Is a <b>${g.name}</b> warm-blooded or cold-blooded?`,
      extra: `Which of these is true of a <b>${g.name}</b>?`,
    };
    const right = g[which];
    const wrongs = which === 'temp' ? ['warm-blooded', 'cold-blooded'] : GROUPS.map((x) => x[which]);
    return {
      prompt: prompts[which],
      answer: ch(right, wrongs, which === 'temp' ? 2 : 4),
      hint: `Picture a real ${g.name} — for instance ${VERTS.filter((v) => v.group === g.name)[0].animal}.`,
      working: [`<b>Picture:</b> ${VERTS.filter((v) => v.group === g.name)[0].animal}.`, `A ${g.name}: skin = ${g.skin}, young = ${g.young}, ${g.temp}.`, `So the answer is <b>${right}</b>.`],
      finalAnswer: right, skill: 'groups',
    };
  }
  function groupFromFeature() {
    const g = R.pick(GROUPS);
    const which = R.pick(['skin', 'young', 'extra']);
    return {
      prompt: `Which vertebrate group <b>${which === 'skin' ? 'is covered in ' + g.skin : which === 'young' ? g.young : g.extra}</b>?`,
      answer: ch(g.name, GROUPS.map((x) => x.name)),
      hint: 'Go through the five: fish, amphibian, reptile, bird, mammal.',
      working: ['<b>Picture:</b> five animal boxes — fish, amphibian, reptile, bird, mammal.', `That belongs to the <b>${g.name}</b> group.`],
      finalAnswer: g.name, skill: 'groups',
    };
  }
  function keyFollow(level) {
    const v = R.pick(VERTS);
    const g = GROUPS.find((x) => x.name === v.group);
    const form = level === 1 ? 1 : R.int(1, 3);
    if (form === 1) {
      return {
        visual: keySvg(null),
        prompt: `Follow the key for <b>${v.animal}</b>. Which group do you end up at?`,
        answer: ch(v.group.toUpperCase(), GROUPS.map((x) => x.name.toUpperCase())),
        hint: `Start at question 1 and answer honestly. ${cap(v.animal)} has ${g.skin}.`,
        working: ['<b>Picture:</b> a staircase of yes/no questions — you can only go down or out.', `1. Feathers? <b>${v.group === 'bird' ? 'Yes → BIRD.' : 'No → go to 2.'}</b>`, ...(v.group === 'bird' ? [] : [`2. Fur or hair? <b>${v.group === 'mammal' ? 'Yes → MAMMAL.' : 'No → go to 3.'}</b>`]), ...(['bird', 'mammal'].includes(v.group) ? [] : [`3. Fins and wet scales? <b>${v.group === 'fish' ? 'Yes → FISH.' : 'No → go to 4.'}</b>`]), ...(['bird', 'mammal', 'fish'].includes(v.group) ? [] : [`4. Dry scales? <b>${v.group === 'reptile' ? 'Yes → REPTILE.' : 'No → AMPHIBIAN.'}</b>`])],
        finalAnswer: v.group.toUpperCase(), skill: 'keys',
      };
    }
    if (form === 2) {
      const step = R.int(1, 4);
      const next = step < 4 ? `question ${step + 1}` : 'AMPHIBIAN';
      return {
        visual: keySvg(null),
        prompt: `You are at <b>question ${step}</b> of the key and the answer is <b>no</b>. Where do you go next?`,
        answer: ch(next, ['question 2', 'question 3', 'question 4', 'AMPHIBIAN', KEY_STEPS[step - 1].yes], 4),
        hint: '"Yes" takes you out to the right and you have finished. "No" takes you down one step.',
        working: ['<b>Picture:</b> a staircase — "yes" is the door out, "no" is the next step down.', `From question ${step}, "no" goes to <b>${next}</b>.`],
        finalAnswer: next, skill: 'keys',
      };
    }
    return {
      visual: keySvg(v.group),
      prompt: `The pink route has been followed through the key. Which animal could it be?`,
      answer: ch(v.animal, VERTS.filter((x) => x.group !== v.group).map((x) => x.animal)),
      hint: 'Read where the pink route stops, then pick an animal from that group.',
      working: ['<b>Picture:</b> the pink line is the path you took.', `The route ends at <b>${v.group.toUpperCase()}</b>.`, `${cap(v.animal)} is a ${v.group}.`],
      finalAnswer: v.animal, skill: 'keys',
    };
  }
  function keyDesign(level) {
    const pairs = [
      { a: 'a kiwi', b: 'a tuatara', q: 'Has it got feathers?', bad: 'Is it interesting?' },
      { a: 'a tūī', b: 'a long-tailed bat', q: 'Has it got feathers?', bad: 'Can it fly?' },
      { a: 'a longfin eel', b: "a Hochstetter's frog", q: 'Does it live in water all its life?', bad: 'Is it slippery?' },
      { a: 'a weta', b: 'a gecko', q: 'Has it got a backbone?', bad: 'Is it scary?' },
      { a: 'a fur seal', b: 'a little blue penguin', q: 'Has it got fur?', bad: 'Is it a good swimmer?' },
    ];
    const p = R.pick(pairs);
    return {
      visual: keySvg(null),
      prompt: `Harper is writing her own key. Which question would separate <b>${p.a}</b> from <b>${p.b}</b> in one step?`,
      answer: ch(p.q, pairs.map((x) => x.q).concat([p.bad])),
      hint: 'A good key question has a clear yes/no answer that anybody would agree on.',
      working: ['<b>Picture:</b> a question is only useful if it splits the pile into two.', `1. Is the answer a definite yes for one and a definite no for the other? It must be.`, `2. "${p.bad}" is an opinion, not a fact — so it is no good.`, `<b>${p.q}</b> splits them cleanly.`],
      finalAnswer: p.q, skill: 'keys',
    };
  }
  function classCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 3);
    if (form === 1) {
      const inv = R.pick([95, 96, 97]);
      return {
        prompt: `About <b>${inv}%</b> of all animal species are invertebrates. What percentage are vertebrates?`,
        answer: { type: 'number', value: 100 - inv, unit: '%' },
        hint: 'The two groups have to add up to 100%.',
        working: ['<b>Picture:</b> a pie cut into two slices — one huge, one tiny.', `100 − ${inv} = <b>${100 - inv}</b>%.`],
        finalAnswer: `${100 - inv}%`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const total = R.pick([40, 60, 80, 100]), birds = R.pick([5, 10, 20]);
      return {
        prompt: `A class surveys <b>${total}</b> animals in a bush reserve. <b>${birds}</b> of them are birds. How many are <b>not</b> birds?`,
        answer: { type: 'number', value: total - birds, unit: 'animals' },
        hint: 'Take the birds away from the total.',
        working: [`${total} − ${birds} = <b>${total - birds}</b> animals.`],
        finalAnswer: `${total - birds}`, skill: 'numbers',
      };
    }
    const groups = 5, each = R.int(3, 9);
    return {
      prompt: `Harper collects <b>${each}</b> different animals for each of the <b>5</b> vertebrate groups. How many animals is that altogether?`,
      answer: { type: 'number', value: each * groups, unit: 'animals' },
      hint: 'Five groups, the same number in each.',
      working: [`${each} × 5 = <b>${each * groups}</b> animals.`],
      finalAnswer: `${each * groups}`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const v = R.pick(VERTS);
      const g = GROUPS.find((x) => x.name === v.group);
      return {
        visual: keySvg(null),
        prompt: `Harper finds <b>${v.animal}</b> on a school trip and runs it through her key. Which group does she write down?`,
        answer: ch(v.group.toUpperCase(), GROUPS.map((x) => x.name.toUpperCase())),
        hint: `Look at the outside of the animal: ${g.skin}.`,
        working: ['<b>Picture:</b> a staircase of yes/no questions.', `1. What is it covered in? <b>${g.skin}</b>.`, `2. Follow the key down until that fits.`, `She writes <b>${v.group.toUpperCase()}</b>.`],
        finalAnswer: v.group.toUpperCase(),
      };
    },
    () => ({
      prompt: 'A friend says "the tuatara is a dinosaur, so it must be its own special group". Which group is a tuatara really in?',
      answer: ch('reptile — it has dry scales, lays leathery eggs and basks in the sun', ['amphibian, because it lives in damp places', 'mammal, because it is warm to touch', 'bird, because it lays eggs'], 4),
      hint: 'Look at the skin and the eggs, not how old the animal group is.',
      working: ['<b>Picture:</b> feel the skin — dry and scaly, like a lizard.', '1. Dry scales? <b>Yes.</b>', '2. Leathery eggs laid on land? <b>Yes.</b>', '3. Cold-blooded, basks in the sun? <b>Yes.</b>', 'A tuatara is a <b>reptile</b> — a very old and special one, but still a reptile.'],
      finalAnswer: 'reptile — it has dry scales, lays leathery eggs and basks in the sun',
    }),
    () => ({
      prompt: 'A kiwi cannot fly, so a friend says it cannot be a bird. Is the friend right?',
      answer: ch('No — birds are grouped by having feathers, a beak and hard-shelled eggs, not by flying', ['Yes, all birds must be able to fly', 'No, because a kiwi is really a mammal', 'Yes, a kiwi is in its own kingdom'], 4),
      hint: 'What is the actual rule for the bird group?',
      working: ['<b>Picture:</b> a penguin, an ostrich and a kiwi — none of them fly, all of them are birds.', '1. Does a kiwi have feathers? <b>Yes.</b>', '2. A beak and hard-shelled eggs? <b>Yes.</b>', '3. Is "can fly" one of the rules? <b>No.</b>', 'So a kiwi <b>is</b> a bird.'],
      finalAnswer: 'No — birds are grouped by having feathers, a beak and hard-shelled eggs, not by flying',
    }),
    () => ({
      visual: backboneSvg(),
      prompt: 'A weta has a hard shell and jointed legs. Is it a vertebrate or an invertebrate, and how can you tell?',
      answer: ch('Invertebrate — its hard part is on the outside, and it has no backbone inside', ['Vertebrate, because its shell is like a skeleton', 'Vertebrate, because it has legs', 'Invertebrate, because it is small'], 4),
      hint: 'The question is always about a backbone INSIDE, not about being hard.',
      working: ['<b>Picture:</b> a suit of armour on the outside, versus a spine on the inside.', '1. Is there a backbone inside? <b>No.</b>', '2. Is being small or hard part of the rule? <b>No.</b>', 'So a weta is an <b>invertebrate</b>.'],
      finalAnswer: 'Invertebrate — its hard part is on the outside, and it has no backbone inside',
    }),
    (level) => {
      const t = R.pick(THINGS.filter((x) => !x.alive));
      return {
        visual: mrsGrenSvg(-1),
        prompt: `Harper argues that <b>${t.thing}</b> is alive because ${t.trap}. Use MRS GREN to say whether she is right.`,
        answer: ch(`She is wrong — ${t.why}`, THINGS.filter((x) => !x.alive).map((x) => `She is wrong — ${x.why}`).concat(['She is right — ticking one box is enough'])),
        hint: 'To be alive, something has to tick ALL SEVEN boxes, not just one or two.',
        working: ['<b>Picture:</b> a checklist of seven boxes. All seven must tick.', `1. Which boxes does it seem to tick? ${cap(t.trap)}.`, `2. Which boxes does it fail? ${cap(t.why)}.`, 'So it is <b>non-living</b>.'],
        finalAnswer: `She is wrong — ${t.why}`,
      };
    },
    () => ({
      visual: groupTable(),
      prompt: 'Harper finds an animal with moist smooth skin near a stream. It started life as a tadpole. Use the table. Which group is it in?',
      answer: ch('amphibian', GROUPS.map((g) => g.name)),
      hint: 'Look up "moist smooth skin" in the Skin column.',
      working: ['<b>Picture:</b> read down the Skin column until you find "moist smooth skin".', '1. Moist smooth skin → <b>amphibian</b>.', '2. Check it: started as a tadpole in water? Yes, that fits too.', "In Aotearoa that could be a <b>Hochstetter's frog</b>."],
      finalAnswer: 'amphibian',
    }),
    () => ({
      prompt: 'A mushroom does not move and cannot make its own food from sunlight. Why is it not put in the plant kingdom?',
      answer: ch('Plants make their own food with chlorophyll — fungi soak up food from dead or living things instead', ['Because mushrooms are not alive', 'Because mushrooms have no cells', 'Because mushrooms can move about'], 4),
      hint: 'The plant rule is about making food, not about staying still.',
      working: ['<b>Picture:</b> a plant is a solar panel; a mushroom is a sponge soaking up a rotting log.', '1. Does a mushroom have chlorophyll? <b>No.</b>', '2. Does it make its own food from sunlight? <b>No.</b>', 'So it goes in the <b>fungi</b> kingdom, not plants.'],
      finalAnswer: 'Plants make their own food with chlorophyll — fungi soak up food from dead or living things instead',
    }),
    () => {
      const pair = R.pick([
        { a: 'a stoat', b: 'a kiwi', q: 'Has it got fur?', why: 'a stoat is a mammal and a kiwi is a bird' },
        { a: 'a gecko', b: 'a frog', q: 'Has it got dry scales?', why: 'a gecko is a reptile and a frog is an amphibian' },
        { a: 'a snapper', b: 'a dolphin', q: 'Does it breathe with gills?', why: 'a snapper is a fish and a dolphin is a mammal' },
      ]);
      return {
        visual: keySvg(null),
        prompt: `Harper needs one question that puts <b>${pair.a}</b> and <b>${pair.b}</b> into different groups. Which question works?`,
        answer: ch(pair.q, ['Has it got fur?', 'Has it got dry scales?', 'Does it breathe with gills?', 'Is it cute?'], 4),
        hint: 'The answer must be a clear YES for one and a clear NO for the other.',
        working: ['<b>Picture:</b> one question, two piles.', `1. Try it: ${pair.a} → one answer, ${pair.b} → the opposite.`, `2. That works because ${pair.why}.`, `So use "<b>${pair.q}</b>".`],
        finalAnswer: pair.q,
      };
    },
    () => ({
      prompt: 'A dolphin lives in the sea and swims like a fish. Why is it a mammal and not a fish?',
      answer: ch('It breathes air with lungs, is warm-blooded and feeds its babies milk', ['It has wet scales like a fish', 'It lays soft eggs in the water', 'It is bigger than a fish'], 4),
      hint: 'Where it lives does not decide the group. Look at skin, breathing and young.',
      working: ['<b>Picture:</b> a dolphin coming up to the surface to blow air out of its blowhole.', '1. Gills or lungs? <b>Lungs</b> — it must surface.', '2. Eggs or live babies fed on milk? <b>Live babies, fed milk.</b>', '3. Cold-blooded or warm-blooded? <b>Warm-blooded.</b>', 'All three say <b>mammal</b>.'],
      finalAnswer: 'It breathes air with lungs, is warm-blooded and feeds its babies milk',
    }),
    () => ({
      prompt: 'Why do scientists all over the world use the same system for naming and grouping living things?',
      answer: ch('So everyone knows exactly which species is being talked about, whatever language they speak', ['Because it makes the animals easier to catch', 'Because every country has different animals', 'So that new species do not have to be named'], 4),
      hint: 'Think about common names: a "robin" in New Zealand is a different bird from a "robin" in England.',
      working: ['<b>Picture:</b> two scientists on a video call, each talking about "a robin" — and meaning different birds.', '1. Do common names work everywhere? <b>No</b> — they change from place to place.', '2. A shared system fixes that.', 'So classification lets everyone <b>mean the same thing</b>.'],
      finalAnswer: 'So everyone knows exactly which species is being talked about, whatever language they speak',
    }),
    () => ({
      visual: mrsGrenSvg(-1),
      prompt: 'Harper puts a seed in a dark cupboard. It does not move, grow or change for months. Is the seed living?',
      answer: ch('Yes — it is alive but resting, and it will do all seven when it gets water and warmth', ['No, because it is not doing any of the seven right now', 'No, seeds are made by the plant so they are not alive', 'Yes, because it is hard and dry'], 4),
      hint: 'A dormant seed is like a battery that has not been switched on yet.',
      working: ['<b>Picture:</b> a phone on standby — it is still working, just not doing anything visible.', '1. Does it have cells? <b>Yes.</b>', '2. Give it water, warmth and air — what happens? It grows into a plant.', 'So the seed is <b>living, but dormant</b>.'],
      finalAnswer: 'Yes — it is alive but resting, and it will do all seven when it gets water and warmth',
    }),
  ];

  HL.registerTopic({
    id: 'classification', subject: 'science', strand: 'living', order: 4,
    name: 'Classification', short: 'Classification', animal: 'gecko',
    blurb: 'Sorting living things into groups by asking yes-or-no questions.',
    example: 'tuatara = reptile · kiwi = bird · weta = invertebrate',
    learn: {
      what: '<p>Scientists sort every living thing into groups so that everyone in the world means the same thing. First: is it even alive? Use <b>MRS GREN</b>. Then it goes into one of five <b>kingdoms</b>. Animals split into those with a backbone (<b>vertebrates</b>) and those without (<b>invertebrates</b>), and vertebrates split again into <b>fish, amphibians, reptiles, birds and mammals</b>.</p><p><b>Picture for this topic:</b> a big box of mixed Lego and a set of <b>sorting trays</b>. A <b>key</b> is the list of yes/no questions you ask about each brick to decide which tray it goes in.</p>',
      visual: `<svg viewBox="0 0 340 218" width="340" height="218" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="8" y="16" fill="#4A4033" font-size="12">START: it has a backbone. Has it got…</text>
        ${[['1  Feathers?', 'BIRD'], ['2  Fur or hair?', 'MAMMAL'], ['3  Fins and wet scales?', 'FISH'], ['4  Dry scales?', 'REPTILE']].map(([q, a], i) => {
          const y = 26 + i * 36;
          return `<rect x="8" y="${y}" width="176" height="26" rx="7" fill="#FFFFFF" stroke="#4A4033" stroke-width="2"/>
            <text x="16" y="${y + 18}" fill="#4A4033" font-size="11.5">${q}</text>
            <line x1="184" y1="${y + 13}" x2="212" y2="${y + 13}" stroke="#E0568C" stroke-width="3"/>
            <polygon points="220,${y + 13} 210,${y + 8} 210,${y + 18}" fill="#E0568C"/>
            <text x="188" y="${y + 9}" fill="#E0568C" font-size="10">yes</text>
            <rect x="224" y="${y + 1}" width="104" height="24" rx="7" fill="#F6D9E4" stroke="#4A4033" stroke-width="2"/>
            <text x="276" y="${y + 18}" text-anchor="middle" fill="#4A4033" font-size="12">${a}</text>
            ${i < 3 ? `<line x1="30" y1="${y + 26}" x2="30" y2="${y + 36}" stroke="#5F98C4" stroke-width="3"/><text x="36" y="${y + 35}" fill="#5F98C4" font-size="10">no</text>` : ''}`;
        }).join('')}
        <line x1="30" y1="160" x2="30" y2="172" stroke="#5F98C4" stroke-width="3"/><text x="36" y="171" fill="#5F98C4" font-size="10">no</text>
        <rect x="44" y="162" width="120" height="24" rx="7" fill="#DFF0D0" stroke="#4A4033" stroke-width="2"/>
        <text x="104" y="179" text-anchor="middle" fill="#4A4033" font-size="12">AMPHIBIAN</text>
        <text x="176" y="180" fill="#7A7065" font-size="11">"yes" = out the side,</text>
        <text x="176" y="194" fill="#7A7065" font-size="11">"no" = down one step</text>
        <text x="8" y="212" fill="#4A4033" font-size="11">no backbone → INVERTEBRATE (e.g. a weta)</text>
      </svg>`,
      facts: [
        '<b>MRS GREN</b>: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition — all seven, or it is not alive',
        'Five kingdoms: <b>animals, plants, fungi, protists, bacteria</b>',
        '<b>Vertebrate</b> = backbone inside · <b>Invertebrate</b> = no backbone (about 97% of all animals)',
        'Five vertebrate groups: <b>fish, amphibian, reptile, bird, mammal</b>',
        'Skin tells you the group: <b>wet scales</b> fish · <b>moist skin</b> amphibian · <b>dry scales</b> reptile · <b>feathers</b> bird · <b>fur</b> mammal',
        'A <b>dichotomous key</b> asks yes/no questions, splitting the pile in two each time',
      ],
      steps: [
        'Alive or not? Run the whole list: <b>MRS GREN</b>. It has to tick <b>all seven</b> — one or two is not enough.',
        'Which kingdom? Ask "<b>does it make its own food?</b>" (plants) "<b>does it eat and move?</b>" (animals) "<b>does it soak food up and stay still?</b>" (fungi).',
        'Backbone inside? Yes = <b>vertebrate</b>. No = <b>invertebrate</b>. A hard shell on the outside does not count.',
        'For a vertebrate, look at the <b>outside</b> first: feathers → bird, fur → mammal, dry scales → reptile, wet scales and fins → fish, moist bare skin → amphibian.',
        'To follow a key: start at question 1, answer yes or no honestly, and <b>only ever move one step</b>. Never skip ahead.',
      ],
      examples: [
        { q: 'Is a fire living or non-living?',
          visual: `<svg viewBox="0 0 340 210" width="340" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="10" y="16" fill="#4A4033" font-size="12">Does a FIRE tick all seven?</text>
            ${[['M', 'Movement', 1], ['R', 'Respiration', 1], ['S', 'Sensitivity', 0], ['G', 'Growth', 1], ['R', 'Reproduction', 0], ['E', 'Excretion', 0], ['N', 'Nutrition', 0]].map(([l, w, ok], i) => {
              const y = 24 + i * 25;
              return `<rect x="10" y="${y}" width="320" height="22" rx="7" fill="${ok ? '#EDF7E3' : '#FDE7EF'}" stroke="#4A4033" stroke-width="1.8"/>
                <circle cx="26" cy="${y + 11}" r="9" fill="#E8C24A"/><text x="26" y="${y + 15}" text-anchor="middle" fill="#4A4033" font-size="11">${l}</text>
                <text x="44" y="${y + 15}" fill="#4A4033" font-size="11.5">${w}</text>
                <text x="160" y="${y + 15}" fill="${ok ? '#4C8A33' : '#C43A6E'}" font-size="11">${ok ? 'seems to tick ✓' : 'FAILS ✗'}</text>`;
            }).join('')}
          </svg>`,
          working: ['<b>Picture:</b> a checklist of seven boxes. All seven must tick.', '1. Does it move and grow? It looks like it. Does it use oxygen? Yes.', '2. Does it sense things, reproduce, excrete waste it made, or feed itself? <b>No.</b>', '3. Four boxes fail.', 'So a fire is <b>non-living</b> — this is the classic trap question.'],
          a: 'Non-living — it fails four of the seven signs' },
        { q: 'Which kingdom does a mushroom belong to?',
          working: ['<b>Picture:</b> five sorting trays: animals, plants, fungi, protists, bacteria.', '1. Does it move about and eat things? No → not animals.', '2. Does it make its own food with chlorophyll? No, it has no green in it → not plants.', '3. Does it sit still and soak food up from a rotting log? <b>Yes</b>.', 'So it goes in the <b>fungi</b> tray.'],
          a: 'Fungi' },
        { q: 'Is a weta a vertebrate or an invertebrate?',
          working: ['<b>Picture:</b> run your finger down your own spine. That is a backbone.', '1. Does a weta have a backbone inside? <b>No</b> — its hard part is on the outside.', '2. Does being hard count? No — the rule is only about a backbone inside.', 'So a weta is an <b>invertebrate</b>, like about 97% of all animals.'],
          a: 'Invertebrate' },
        { q: 'A tuatara has dry scales, lays leathery eggs on land and lies in the sun to warm up. Which group is it in?',
          visual: `<table class="data"><tr><th>Group</th><th>Skin</th><th>Young</th></tr>
            <tr><td>fish</td><td>wet scales</td><td>soft jelly eggs in water</td></tr>
            <tr><td>amphibian</td><td>moist smooth skin</td><td>jelly eggs in water</td></tr>
            <tr><td>reptile</td><td>dry scales</td><td>leathery eggs on land</td></tr>
            <tr><td>bird</td><td>feathers</td><td>hard-shelled eggs</td></tr>
            <tr><td>mammal</td><td>fur or hair</td><td>live babies, fed on milk</td></tr></table>`,
          working: ['<b>Picture:</b> read down the Skin column until you find a match.', '1. Dry scales → the <b>reptile</b> row.', '2. Check the next column: leathery eggs on land? <b>Yes</b> — it fits.', '3. Cold-blooded, basking in the sun? Reptiles do that too.', 'So a tuatara is a <b>reptile</b> — Aotearoa\'s very own ancient one.'],
          a: 'Reptile' },
        { q: 'A kiwi cannot fly. Does that stop it being a bird?',
          working: ['<b>Picture:</b> a penguin, an ostrich and a kiwi — three birds, none of which fly.', '1. What are the real bird rules? <b>Feathers, a beak, hard-shelled eggs, warm-blooded.</b>', '2. Does a kiwi tick all of those? <b>Yes.</b>', '3. Is "can fly" on the list? <b>No.</b>', 'So a kiwi <b>is</b> a bird.'],
          a: 'No — a kiwi is definitely a bird' },
        { q: 'Follow the key for a New Zealand fur seal (kekeno).',
          visual: `<svg viewBox="0 0 340 218" width="340" height="218" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="8" y="16" fill="#4A4033" font-size="12">START: it has a backbone. Has it got…</text>
            <rect x="8" y="26" width="176" height="26" rx="7" fill="#FBE3EC" stroke="#E0568C" stroke-width="3"/><text x="16" y="44" fill="#4A4033" font-size="11.5">1  Feathers?</text>
            <line x1="184" y1="39" x2="212" y2="39" stroke="#C9C1B4" stroke-width="2.5"/><polygon points="220,39 210,34 210,44" fill="#C9C1B4"/><text x="188" y="35" fill="#9A9186" font-size="10">yes</text>
            <rect x="224" y="27" width="104" height="24" rx="7" fill="#F3EFE7" stroke="#4A4033" stroke-width="2"/><text x="276" y="44" text-anchor="middle" fill="#4A4033" font-size="12">BIRD</text>
            <line x1="30" y1="52" x2="30" y2="62" stroke="#E0568C" stroke-width="4"/><text x="36" y="61" fill="#E0568C" font-size="10">no</text>
            <rect x="8" y="62" width="176" height="26" rx="7" fill="#FBE3EC" stroke="#E0568C" stroke-width="3"/><text x="16" y="80" fill="#4A4033" font-size="11.5">2  Fur or hair?</text>
            <line x1="184" y1="75" x2="212" y2="75" stroke="#E0568C" stroke-width="4"/><polygon points="220,75 210,70 210,80" fill="#E0568C"/><text x="188" y="71" fill="#E0568C" font-size="10">yes</text>
            <rect x="224" y="63" width="104" height="24" rx="7" fill="#E0568C" stroke="#4A4033" stroke-width="2"/><text x="276" y="80" text-anchor="middle" fill="#FFFFFF" font-size="12">MAMMAL</text>
            <rect x="8" y="98" width="176" height="26" rx="7" fill="#FFFFFF" stroke="#4A4033" stroke-width="2"/><text x="16" y="116" fill="#4A4033" font-size="11.5">3  Fins and wet scales?</text>
            <rect x="224" y="99" width="104" height="24" rx="7" fill="#F3EFE7" stroke="#4A4033" stroke-width="2"/><text x="276" y="116" text-anchor="middle" fill="#4A4033" font-size="12">FISH</text>
            <rect x="8" y="134" width="176" height="26" rx="7" fill="#FFFFFF" stroke="#4A4033" stroke-width="2"/><text x="16" y="152" fill="#4A4033" font-size="11.5">4  Dry scales?</text>
            <rect x="224" y="135" width="104" height="24" rx="7" fill="#F3EFE7" stroke="#4A4033" stroke-width="2"/><text x="276" y="152" text-anchor="middle" fill="#4A4033" font-size="12">REPTILE</text>
            <rect x="44" y="170" width="120" height="24" rx="7" fill="#F3EFE7" stroke="#4A4033" stroke-width="2"/><text x="104" y="187" text-anchor="middle" fill="#4A4033" font-size="12">AMPHIBIAN</text>
            <text x="176" y="188" fill="#E0568C" font-size="11">the pink route is</text><text x="176" y="202" fill="#E0568C" font-size="11">the one you take</text>
          </svg>`,
          working: ['<b>Picture:</b> a staircase — "yes" is the door out, "no" is the next step down.', '1. Feathers? <b>No</b> → go down to question 2.', '2. Fur or hair? <b>Yes</b> → out the side.', 'You land on <b>MAMMAL</b>. Check it: it breathes air, is warm-blooded, and feeds its pup milk. It fits.'],
          a: 'MAMMAL' },
        { q: 'Harper wants one key question that separates a tūī from a long-tailed bat. Both fly. What should she ask?',
          working: ['<b>Picture:</b> one question, two piles. It must be a definite yes for one and a definite no for the other.', '1. "Can it fly?" — both say yes. Useless.', '2. "Is it pretty?" — that is an opinion, not a fact. Useless.', '3. "Has it got feathers?" — tūī <b>yes</b>, bat <b>no</b>.', 'So she should ask <b>"Has it got feathers?"</b>'],
          a: '"Has it got feathers?" — the tūī does, the bat has fur' },
      ],
      tips: [
        'A fire, a river and a car all move — but moving on its own does <b>not</b> make something alive. It has to tick <b>all seven</b> of MRS GREN.',
        'Where an animal lives never decides its group. A <b>dolphin</b> lives in the sea but is a <b>mammal</b>; a <b>penguin</b> swims but is a <b>bird</b>.',
        'A hard shell on the <b>outside</b> (weta, crab, snail) is not a backbone. Those are all <b>invertebrates</b>.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [grenLetter, grenScenario, livingOrNot, kingdomOf, vertOrInvert, vertGroupOf, groupFeature, keyFollow, classCalc]
        : level === 2
          ? [grenLetter, grenScenario, grenMissing, livingOrNot, kingdomOf, kingdomFeature, vertOrInvert, vertGroupOf, groupFeature, groupFromFeature, keyFollow, keyDesign, classCalc]
          : [grenMissing, livingOrNot, kingdomFeature, vertGroupOf, groupFeature, groupFromFeature, keyFollow, keyDesign, classCalc, kingdomOf, grenScenario];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
