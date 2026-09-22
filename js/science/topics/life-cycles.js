/* Topic: Life cycles — plants, insects (complete and incomplete metamorphosis), frogs,
 * birds and mammals; sexual vs asexual reproduction; pollination and fertilisation;
 * and the stages of human growth. Living World, order 10. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  /* s = short label that fits in a wheel box · f = the full name used in questions */
  const CYCLES = [
    { key: 'plant', name: 'a flowering plant', kind: 'plant', group: 'plant',
      stages: [
        { s: 'seed', f: 'seed', short: 'seed', shortAccept: ['a seed'] },
        { s: 'seedling', f: 'seedling', short: 'seedling', shortAccept: ['a seedling'] },
        { s: 'adult plant', f: 'adult plant', short: 'adult plant', shortAccept: ['an adult plant', 'the adult plant'] },
        { s: 'flower', f: 'flower, which makes new seeds', short: 'flower', shortAccept: ['a flower', 'the flower'] },
      ],
      note: 'the flower makes the seeds, so the wheel starts all over again' },
    { key: 'butterfly', name: 'a monarch butterfly', kind: 'complete', group: 'insect',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'caterpillar', f: 'larva (caterpillar)', short: 'caterpillar', shortAccept: ['a caterpillar', 'larva', 'a larva'] },
        { s: 'chrysalis', f: 'pupa (chrysalis)', short: 'chrysalis', shortAccept: ['a chrysalis', 'pupa', 'a pupa'] },
        { s: 'butterfly', f: 'adult butterfly', short: 'butterfly', shortAccept: ['a butterfly', 'an adult butterfly', 'adult butterfly'] },
      ],
      note: 'monarch caterpillars eat swan plants in New Zealand gardens' },
    { key: 'huhu', name: 'a huhu beetle', kind: 'complete', group: 'insect',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'huhu grub', f: 'larva (huhu grub)', short: 'huhu grub', shortAccept: ['a huhu grub', 'larva', 'a larva', 'grub'] },
        { s: 'pupa', f: 'pupa', short: 'pupa', shortAccept: ['a pupa'] },
        { s: 'beetle', f: 'adult huhu beetle', short: 'beetle', shortAccept: ['a beetle', 'adult beetle', 'huhu beetle', 'adult huhu beetle'] },
      ],
      note: 'the grub spends years eating rotting logs before it changes' },
    { key: 'weta', name: 'a weta', kind: 'incomplete', group: 'insect',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'nymph', f: 'nymph', short: 'nymph', shortAccept: ['a nymph'] },
        { s: 'adult weta', f: 'adult weta', short: 'adult weta', shortAccept: ['an adult weta', 'weta', 'adult'] },
      ],
      note: 'a weta nymph already looks like a small adult — it just gets bigger' },
    { key: 'cicada', name: 'a cicada', kind: 'incomplete', group: 'insect',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'nymph', f: 'nymph', short: 'nymph', shortAccept: ['a nymph'] },
        { s: 'cicada', f: 'adult cicada', short: 'cicada', shortAccept: ['a cicada', 'adult cicada', 'an adult cicada'] },
      ],
      note: 'the nymph lives underground for years, then climbs a tree and sheds its skin' },
    { key: 'dragonfly', name: 'a dragonfly', kind: 'incomplete', group: 'insect',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'nymph', f: 'nymph', short: 'nymph', shortAccept: ['a nymph'] },
        { s: 'dragonfly', f: 'adult dragonfly', short: 'dragonfly', shortAccept: ['a dragonfly', 'adult dragonfly', 'an adult dragonfly'] },
      ],
      note: 'the nymph hunts underwater before it climbs out and flies' },
    { key: 'frog', name: 'a frog', kind: 'frog', group: 'amphibian',
      stages: [
        { s: 'frogspawn', f: 'egg (frogspawn)', short: 'frogspawn', shortAccept: ['frog spawn', 'eggs', 'frog eggs', 'egg'] },
        { s: 'tadpole', f: 'tadpole', short: 'tadpole', shortAccept: ['a tadpole'] },
        { s: 'froglet', f: 'froglet', short: 'froglet', shortAccept: ['a froglet'] },
        { s: 'adult frog', f: 'adult frog', short: 'adult frog', shortAccept: ['an adult frog', 'frog', 'adult'] },
      ],
      note: 'the tadpole grows legs, loses its tail and swaps gills for lungs' },
    { key: 'kiwi', name: 'a kiwi', kind: 'bird', group: 'bird',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'chick', f: 'chick', short: 'chick', shortAccept: ['a chick'] },
        { s: 'juvenile', f: 'juvenile', short: 'juvenile', shortAccept: ['a juvenile'] },
        { s: 'adult kiwi', f: 'adult kiwi', short: 'adult kiwi', shortAccept: ['an adult kiwi', 'kiwi', 'adult'] },
      ],
      note: 'the male kiwi sits on the huge egg for about 80 days' },
    { key: 'tuatara', name: 'a tuatara', kind: 'reptile', group: 'reptile',
      stages: [
        { s: 'egg', f: 'egg', short: 'egg', shortAccept: ['an egg'] },
        { s: 'hatchling', f: 'hatchling', short: 'hatchling', shortAccept: ['a hatchling'] },
        { s: 'juvenile', f: 'juvenile', short: 'juvenile', shortAccept: ['a juvenile'] },
        { s: 'adult tuatara', f: 'adult tuatara', short: 'adult tuatara', shortAccept: ['an adult tuatara', 'tuatara', 'adult'] },
      ],
      note: 'a tuatara egg takes about a whole year to hatch' },
    { key: 'mammal', name: 'a mammal, like a dog', kind: 'mammal', group: 'mammal',
      stages: [{ s: 'born alive', f: 'born alive' }, { s: 'fed on milk', f: 'fed on milk' }, { s: 'young', f: 'young' }, { s: 'adult', f: 'adult' }],
      note: 'mammals are born alive and fed on their mother\'s milk — no egg is laid' },
  ];

  const KINDS = {
    complete: { name: 'complete metamorphosis', order: 'egg → larva → pupa → adult', why: 'the young looks nothing like the adult, and it rebuilds completely inside the pupa' },
    incomplete: { name: 'incomplete metamorphosis', order: 'egg → nymph → adult', why: 'the young already looks like a small adult, and just gets bigger and grows wings' },
  };

  const ASEXUAL = [
    { how: 'a cutting', ex: 'a piece snapped off a geranium and put in water grows its own roots' },
    { how: 'runners', ex: 'a strawberry plant sends a stem sideways and it roots in a new spot' },
    { how: 'bulbs', ex: 'a daffodil bulb splits into more bulbs under the ground' },
    { how: 'tubers', ex: 'a potato sprouts new plants from its eyes' },
    { how: 'plantlets', ex: 'a spider plant grows little baby plants on a dangling stalk' },
  ];

  const HUMAN = [
    { stage: 'baby', when: 'from birth to about 2', what: 'cannot walk or talk at first, and grows faster than at any other time of life' },
    { stage: 'child', when: 'about 2 to 12', what: 'grows steadily, learns fast, and gets much better at moving and talking' },
    { stage: 'adolescent', when: 'about 12 to 18', what: 'has a growth spurt and the body gradually changes into an adult body' },
    { stage: 'adult', when: 'about 18 to 65', what: 'is fully grown — no longer getting taller, and can have children of their own' },
    { stage: 'older adult', when: 'about 65 onwards', what: 'slows down: bones and muscles get weaker and senses are not as sharp' },
  ];

  const NZFACTS = [
    { q: 'How long does a tuatara egg take to hatch?', a: 'about a whole year', w: ['about 3 days', 'about 3 weeks', 'about 10 years'], short: 'a year', shortAccept: ['about a year', 'a whole year', 'about a whole year', '12 months'] },
    { q: 'What do monarch caterpillars eat in a New Zealand garden?', a: 'swan plants', w: ['harakeke (flax) leaves', 'rotting logs', 'grass seed'], short: 'swan plants', shortAccept: ['swan plant', 'a swan plant'] },
    { q: 'A cicada nymph spends years underground. What does it do when it finally comes up?', a: 'It climbs a tree, splits its old skin and comes out as a winged adult', w: ['It builds a chrysalis on a branch', 'It lays its eggs and dies straight away', 'It turns into a grub'] },
    { q: 'Which parent kiwi usually sits on the egg?', a: 'the male, for about 80 days', w: ['the female, for about 3 days', 'both take a week each', 'neither — the egg is buried and left'], short: 'the male', shortAccept: ['male', 'dad', 'the father', 'the dad'] },
    { q: 'A huhu grub lives in a rotting log. What will it turn into?', a: 'a huhu beetle, after a pupa stage', w: ['a cicada, after a nymph stage', 'a weta, without changing shape', 'a moth, straight away'], short: 'a huhu beetle', shortAccept: ['huhu beetle', 'a beetle', 'beetle'] },
    { q: 'Why does a newly hatched weta look like a tiny adult weta?', a: 'Weta have incomplete metamorphosis — the nymph is just a small version that grows bigger', w: ['Because weta hatch fully grown', 'Because weta have a pupa stage first', 'Because weta are not insects'] },
    { q: 'A kiwi egg is enormous compared with the bird. What does that mean for the chick?', a: 'It hatches well developed, with a big yolk store, and can feed itself within a week', w: ['It hatches earlier than other birds', 'It has to be fed by both parents for a year', 'It hatches blind and helpless'] },
    { q: 'Monarch butterflies in Aotearoa can go through several life cycles in one summer. Why not in winter?', a: 'It is too cold — the caterpillars grow very slowly and swan plants stop growing', w: ['The butterflies fly to the North Island instead', 'Eggs cannot be laid in the dark', 'The chrysalis stage does not happen in winter'] },
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
  const allStages = () => { const out = []; CYCLES.forEach((c) => c.stages.forEach((s) => { if (!out.includes(s.f)) out.push(s.f); })); return out; };

  /* ---------- diagrams ---------- */
  /** a cycle wheel. blank = index of the stage to hide behind a "?" */
  function wheelSvg(cycle, blank, title) {
    const n = cycle.stages.length;
    const cx = 170, cy = 108, rad = n >= 5 ? 78 : 68, bw = n >= 5 ? 84 : 98, bh = 30;
    const cols = ['#8FC96E', '#E8C24A', '#A9D8F5', '#E9A07A', '#B9A5E6'];
    const pt = (a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    const boxes = cycle.stages.map((st, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const [x, y] = pt(a);
      const on = blank === i;
      return `<rect x="${(x - bw / 2).toFixed(1)}" y="${(y - bh / 2).toFixed(1)}" width="${bw}" height="${bh}" rx="10" fill="${on ? '#FFFFFF' : cols[i % cols.length]}" stroke="${on ? '#E0568C' : INK}" stroke-width="${on ? 3 : 2}" ${on ? 'stroke-dasharray="6 4"' : ''}/>
        <text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" fill="${on ? '#B03068' : INK}" font-size="${on ? 15 : 11.5}">${on ? '?' : st.s}</text>`;
    }).join('');
    const arrows = cycle.stages.map((st, i) => {
      const a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / n;
      const [x, y] = pt(a);
      const tx = -Math.sin(a), ty = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
      const p = (dx, dy) => `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`;
      return `<polygon points="${p(tx * 9, ty * 9)} ${p(-tx * 4 + nx * 5, -ty * 4 + ny * 5)} ${p(-tx * 4 - nx * 5, -ty * 4 - ny * 5)}" fill="#B08850"/>`;
    }).join('');
    return `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="15" text-anchor="middle" fill="${INK}" font-size="12">${title || 'the life cycle of ' + cycle.name}</text>
      <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="#D9BE8A" stroke-width="2" stroke-dasharray="5 5"/>
      ${arrows}${boxes}
      <text x="170" y="208" text-anchor="middle" fill="#7A7065" font-size="10.5">it goes round and round — the adult starts it again</text>
    </svg>`;
  }

  /** complete vs incomplete metamorphosis, side by side */
  function metaSvg(highlight) {
    const row = (y, label, stages, cols, on) => {
      const bw = 74, gap = 8;
      const x0 = Math.round((340 - (stages.length * bw + (stages.length - 1) * gap)) / 2);
      const boxes = stages.map((s, i) => {
        const x = x0 + i * (bw + gap);
        return `<rect x="${x}" y="${y}" width="${bw}" height="26" rx="9" fill="${cols[i]}" stroke="${INK}" stroke-width="2"/>
          <text x="${x + bw / 2}" y="${y + 17}" text-anchor="middle" fill="${INK}" font-size="11">${s}</text>
          ${i < stages.length - 1 ? `<polygon points="${x + bw + gap},${y + 13} ${x + bw + 1},${y + 8} ${x + bw + 1},${y + 18}" fill="#B08850"/>` : ''}`;
      }).join('');
      return `<rect x="6" y="${y - 16}" width="328" height="58" rx="10" fill="${on ? '#FBEAF1' : '#FFFDF6'}" stroke="${on ? '#E0568C' : '#E4D7BE'}" stroke-width="${on ? 2.5 : 1.5}"/>
        <text x="14" y="${y - 3}" fill="${on ? '#B03068' : INK}" font-size="11.5">${label}</text>${boxes}`;
    };
    return `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="14" text-anchor="middle" fill="${INK}" font-size="12">two ways an insect grows up</text>
      ${row(48, 'complete: butterfly, beetle', ['egg', 'larva', 'pupa', 'adult'], ['#8FC96E', '#E8C24A', '#A9D8F5', '#E9A07A'], highlight === 'complete')}
      ${row(126, 'incomplete: weta, cicada', ['egg', 'nymph', 'adult'], ['#8FC96E', '#B9A5E6', '#E9A07A'], highlight === 'incomplete')}
      <text x="170" y="192" text-anchor="middle" fill="#7A7065" font-size="10.5">no pupa? then the young already looks like the adult</text>
    </svg>`;
  }

  /** the five stages of human growth */
  function growthSvg(highlight) {
    const people = [
      { h: 22, label: 'baby' }, { h: 40, label: 'child' }, { h: 58, label: 'adolescent' },
      { h: 68, label: 'adult' }, { h: 62, label: 'older adult' },
    ];
    const base = 150;
    const figs = people.map((p, i) => {
      const x = 40 + i * 66;
      const on = highlight === p.label;
      const col = on ? '#E0568C' : INK;
      const head = 7 + p.h / 12;
      const top = base - p.h;
      return `<circle cx="${x}" cy="${top - head}" r="${head.toFixed(1)}" fill="${on ? '#F7D3E2' : '#F6DFC8'}" stroke="${col}" stroke-width="2"/>
        <line x1="${x}" y1="${(top - head + head).toFixed(1)}" x2="${x}" y2="${base - p.h * 0.42}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>
        <line x1="${x - p.h * 0.2}" y1="${base - p.h * 0.72}" x2="${x + p.h * 0.2}" y2="${base - p.h * 0.72}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>
        <line x1="${x}" y1="${base - p.h * 0.42}" x2="${x - p.h * 0.17}" y2="${base}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="${x}" y1="${base - p.h * 0.42}" x2="${x + p.h * 0.17}" y2="${base}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>
        <text x="${x}" y="${base + 18}" text-anchor="middle" fill="${col}" font-size="${p.label.length > 8 ? 10 : 11}">${p.label}</text>`;
    }).join('');
    return `<svg viewBox="0 0 340 198" width="340" height="198" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12">the stages of human growth</text>
      <line x1="10" y1="${base}" x2="330" y2="${base}" stroke="${INK}" stroke-width="2"/>
      ${figs}
      <text x="170" y="190" text-anchor="middle" fill="#7A7065" font-size="10.5">baby → child → adolescent → adult → older adult</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function nextStage(level) {
    const c = R.pick(CYCLES);
    const i = R.int(0, c.stages.length - 1);
    const j = (i + 1) % c.stages.length;
    const target = c.stages[j];
    return {
      prompt: `In the life cycle of <b>${c.name}</b>, what comes straight after the <b>${c.stages[i].f}</b>?`,
      answer: target.short ? textAns(target.short, target.shortAccept, 'one or two words') : ch(target.f, allStages(), 4),
      hint: c.stages.map((s) => s.f).join(' → ') + ' → back to the start',
      working: [`<b>Picture:</b> a wheel that never stops — ${c.note}.`, `${c.stages.map((s) => s.f).join(' → ')} → and round again.`, `After the ${c.stages[i].f} comes the <b>${c.stages[j].f}</b>.`],
      finalAnswer: c.stages[j].f, skill: 'order',
    };
  }
  function wheelBlank(level) {
    const c = R.pick(CYCLES);
    const i = R.int(0, c.stages.length - 1);
    const target = c.stages[i];
    return {
      visual: wheelSvg(c, i),
      prompt: `Look at the life cycle of <b>${c.name}</b>. What goes in the space marked <b>?</b>`,
      answer: target.short ? textAns(target.short, target.shortAccept, 'one or two words') : ch(target.f, allStages(), 4),
      hint: `The stage before it is the ${c.stages[(i + c.stages.length - 1) % c.stages.length].s}.`,
      working: [`<b>Picture:</b> read the wheel clockwise, starting at the top.`, `${c.stages.map((s, k) => (k === i ? '<b>?</b>' : s.s)).join(' → ')}`, `The missing stage is the <b>${c.stages[i].f}</b>.`],
      finalAnswer: c.stages[i].f, skill: 'order',
    };
  }
  function firstStage(level) {
    const c = R.pick(CYCLES);
    const form = R.pick(['count', 'start', 'adult']);
    if (form === 'count') {
      return {
        prompt: `How many stages are there in the life cycle of <b>${c.name}</b>?`,
        answer: { type: 'number', value: c.stages.length, unit: 'stages' },
        hint: 'Count the boxes round the wheel.',
        working: [`${c.stages.map((s) => s.s).join(' → ')}`, `That is <b>${c.stages.length}</b> stages.`],
        finalAnswer: `${c.stages.length} stages`, skill: 'order',
      };
    }
    const target = form === 'start' ? c.stages[0] : c.stages[c.stages.length - 1];
    const p = form === 'start' ? `Which stage does the life cycle of <b>${c.name}</b> start with?` : `Which is the <b>adult</b> stage in the life cycle of <b>${c.name}</b>?`;
    return {
      prompt: p,
      answer: target.short ? textAns(target.short, target.shortAccept, 'one or two words') : ch(target.f, allStages(), 4),
      hint: c.stages.map((s) => s.f).join(' → '),
      working: [`<b>Picture:</b> the wheel for ${c.name}.`, `${c.stages.map((s) => s.f).join(' → ')}`, `Answer: <b>${target.f}</b>.`],
      finalAnswer: target.f, skill: 'order',
    };
  }
  function metaQ(level) {
    const insects = CYCLES.filter((c) => c.group === 'insect');
    const c = R.pick(insects);
    const k = KINDS[c.kind];
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        visual: level <= 2 ? metaSvg(c.kind) : undefined,
        prompt: `Does <b>${c.name}</b> go through complete or incomplete metamorphosis?`,
        answer: textAns(c.kind, [k.name, c.kind + ' metamorphosis'], 'one word'),
        hint: 'Is there a pupa stage? If yes it is complete. If the young already looks like a small adult, it is incomplete.',
        working: ['<b>Picture:</b> a pupa is a rebuild; a nymph is just a smaller version.', `${cap(c.name)} goes ${c.stages.map((s) => s.s).join(' → ')}.`, `That is <b>${k.name}</b>.`],
        finalAnswer: k.name, skill: 'metamorphosis',
      };
    }
    if (form === 2) {
      const which = R.chance(0.5) ? 'complete' : 'incomplete';
      return {
        prompt: `What is the order of stages in <b>${KINDS[which].name}</b>?`,
        answer: ch(KINDS[which].order, [KINDS.complete.order, KINDS.incomplete.order, 'egg → pupa → nymph → adult', 'larva → egg → adult'], 4),
        hint: 'Complete has four stages and a pupa. Incomplete has three and no pupa.',
        working: ['<b>Picture:</b> complete = a full rebuild inside a pupa. Incomplete = just growing bigger.', `<b>${KINDS[which].order}</b>`],
        finalAnswer: KINDS[which].order, skill: 'metamorphosis',
      };
    }
    const which = R.chance(0.5) ? 'complete' : 'incomplete';
    return {
      visual: metaSvg(which),
      prompt: `What is the big difference in <b>${KINDS[which].name}</b>?`,
      answer: ch(KINDS[which].why, [KINDS.complete.why, KINDS.incomplete.why, 'The young hatches out fully grown and never changes', 'The adult turns back into an egg'], 4),
      hint: 'Look at whether the young looks like the adult.',
      working: ['<b>Picture:</b> a caterpillar and a butterfly look nothing alike; a weta nymph and an adult weta look the same.', `In ${KINDS[which].name}: <b>${KINDS[which].why}</b>.`],
      finalAnswer: KINDS[which].why, skill: 'metamorphosis',
    };
  }
  function groupQ(level) {
    const c = R.pick(CYCLES.filter((x) => x.group !== 'plant'));
    const forms = [
      { p: 'Which animal group has a life cycle like <b>' + c.name + '</b>: egg first, or born alive?', a: c.group === 'mammal' ? 'born alive, then fed on milk' : 'an egg is laid first', short: c.group === 'mammal' ? 'born alive' : 'egg', shortAccept: c.group === 'mammal' ? ['born alive, then fed on milk', 'born alive and fed on milk'] : ['an egg is laid first', 'egg first', 'lays an egg', 'an egg'] },
      { p: `Which of these does <b>${c.name}</b> belong to?`, a: c.group, short: c.group, shortAccept: [`an ${c.group}`, `a ${c.group}`] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: textAns(f.short, f.shortAccept, 'one word'),
      hint: 'Only mammals are born alive and fed on milk. Insects, amphibians, birds and reptiles all lay eggs.',
      working: [`<b>Picture:</b> ${c.note}.`, `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'groups',
    };
  }
  function frogBirdQ(level) {
    const forms = [
      { p: 'A tadpole has gills and a tail. What changes as it turns into a frog?', a: 'It grows legs, loses its tail and swaps gills for lungs', w: ['It grows a shell and stays in the water', 'It grows wings and leaves the pond', 'Nothing changes — it just gets bigger'] },
      { p: 'Why do frogs lay their eggs in water?', a: 'The eggs have no shell and would dry out on land, and the tadpoles breathe with gills', w: ['So the eggs float away from the parents', 'Because water makes the eggs hatch faster than air ever could', 'So fish will look after them'] },
      { p: 'A bird\'s egg has a hard shell. Why?', a: 'It protects the growing chick and stops it drying out on land', w: ['It makes the egg heavier so it does not roll away', 'It keeps the chick cold', 'It lets the chick breathe under water'] },
      { p: 'Why does a parent bird sit on its eggs?', a: 'To keep them warm enough for the chick inside to develop', w: ['To stop them hatching too soon', 'To flatten them into the right shape', 'To feed the chick through the shell'] },
      { p: 'How is a mammal\'s life cycle different from a bird\'s?', a: 'A mammal is born alive and fed on milk; a bird hatches from an egg', w: ['A mammal hatches from an egg and a bird is born alive', 'Mammals have a pupa stage', 'There is no difference at all'] },
      { p: 'A frog and a butterfly both change shape completely as they grow up. What is that called?', a: 'metamorphosis', w: ['pollination', 'germination', 'fertilisation'], short: 'metamorphosis', shortAccept: [] },
      { p: 'What is <b>germination</b>?', a: 'when a seed starts to grow into a seedling', w: ['when a flower makes pollen', 'when a seed is carried away from the parent', 'when a caterpillar becomes a pupa'] },
      { p: 'What does a seed need before it will germinate?', a: 'water, warmth and air', w: ['light and soil only', 'a flower nearby', 'an insect to open it'] },
    ];
    const f = R.pick(forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'one word') : ch(f.a, f.w, 4),
      hint: 'Go back to the wheel and ask what has to happen at that step.',
      working: ['<b>Picture:</b> every life cycle is a wheel — each stage has to get the next one started.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'cycles',
    };
  }
  function reproQ(level) {
    const forms = [
      { p: 'What is <b>sexual reproduction</b>?', a: 'Two parents — a male sex cell joins a female one, so the offspring is not identical to either parent', w: ['One parent makes an identical copy of itself', 'A plant grows a new stem sideways', 'A seed being carried away by the wind'] },
      { p: 'What is <b>asexual reproduction</b>?', a: 'One parent only — the offspring is an identical copy of it', w: ['Two parents, so the offspring is a mix of both', 'A seed germinating in the soil', 'An egg hatching into a chick'] },
      { p: 'Seeds and eggs are made by which kind of reproduction?', a: 'sexual — two parents, so the offspring is a mix', w: ['asexual — one parent, an identical copy', 'neither, they are made by the roots', 'both at the same time'], short: 'sexual', shortAccept: ['sexual reproduction'] },
      { p: 'Cuttings, runners and bulbs are which kind of reproduction?', a: 'asexual — one parent, and the new plant is an identical copy', w: ['sexual — two parents, so the plants are all different', 'neither, they are just growth', 'sexual, because a flower is involved'], short: 'asexual', shortAccept: ['asexual reproduction'] },
      { p: 'Why are seedlings grown from seed all slightly different from each other?', a: 'Sexual reproduction mixes the features of two parents, so each seed gets a different mix', w: ['Because seeds are planted at different times', 'Because seedlings are identical copies', 'Because soil changes their DNA'] },
      { p: 'Why is every plant grown from a cutting identical to the parent?', a: 'It is asexual — the new plant is a copy of one parent, with no mixing', w: ['Because cuttings are taken from the flower', 'Because cuttings need two parents', 'They are not identical, they are all different'] },
      { p: 'A gardener wants ten plants exactly like her best strawberry plant. What should she use?', a: 'runners or cuttings, because they give identical copies', w: ['seeds, because they give identical copies', 'seeds, because they grow faster', 'pollen from another plant'], short: 'cuttings', shortAccept: ['runners', 'runners or cuttings', 'cuttings or runners'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 4) : forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a few words') : ch(f.a, f.w, 4),
      hint: 'Two parents and a mix = sexual. One parent and a copy = asexual.',
      working: ['<b>Picture:</b> sexual is shuffling two packs of cards together. Asexual is a photocopy.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'reproduction',
    };
  }
  function asexualQ() {
    const a = R.pick(ASEXUAL);
    if (R.chance(0.5)) {
      return {
        prompt: `Which way of growing new plants is this: <b>${a.ex}</b>?`,
        answer: textAns(a.how, a.how === 'a cutting' ? ['cutting', 'cuttings'] : [], 'one word'),
        hint: 'All of these are asexual — one parent, an identical copy. Name the method.',
        working: ['<b>Picture:</b> a photocopy of one plant.', `${cap(a.ex)}.`, `That is <b>${a.how}</b>.`],
        finalAnswer: a.how, skill: 'reproduction',
      };
    }
    return {
      prompt: `Give an example of a plant reproducing by <b>${a.how}</b>.`,
      answer: ch(a.ex, ASEXUAL.map((x) => x.ex), 4),
      hint: 'One parent, no seeds, no pollen — the new plant is a copy.',
      working: ['<b>Picture:</b> a photocopy of one plant.', `${cap(a.how)}: <b>${a.ex}</b>.`],
      finalAnswer: a.ex, skill: 'reproduction',
    };
  }
  function pollenQ(level) {
    const forms = [
      { p: 'What is <b>pollination</b>?', a: 'pollen moving from an anther to a stigma', w: ['the pollen nucleus joining the ovule', 'a seed growing into a seedling', 'a seed being carried away from the parent'] },
      { p: 'What is <b>fertilisation</b> in a plant?', a: 'the pollen nucleus joining an ovule inside the ovary', w: ['pollen moving from an anther to a stigma', 'a seed germinating', 'a flower opening in the sun'] },
      { p: 'Which happens <b>first</b>: pollination or fertilisation?', a: 'pollination — the pollen has to arrive before anything can join', w: ['fertilisation — the ovule is ready first', 'they happen at exactly the same moment', 'it depends on the plant'], short: 'pollination', shortAccept: ['pollination first'] },
      { p: 'After fertilisation, what does the <b>ovule</b> turn into?', a: 'a seed', w: ['a fruit', 'a petal', 'a new flower'], short: 'seed', shortAccept: ['a seed', 'the seed'] },
      { p: 'After fertilisation, what does the <b>ovary</b> turn into?', a: 'the fruit around the seeds', w: ['the seed itself', 'the stigma', 'the roots'], short: 'fruit', shortAccept: ['the fruit', 'a fruit', 'fruit around the seeds'] },
      { p: 'Bees carry pollen from flower to flower. What are they doing for the plant?', a: 'pollinating it, so it can make seeds', w: ['fertilising the ovule directly', 'dispersing the seeds', 'germinating the seeds'], short: 'pollinating it', shortAccept: ['pollination', 'pollinating', 'they are pollinating it'] },
      { p: 'Why does a plant need pollen from ANOTHER plant of the same kind?', a: 'So the two parents mix, and the seeds are not all identical', w: ['Because its own pollen is poisonous', 'Because pollen only works once', 'It does not — plants never use another plant\'s pollen'] },
    ];
    const f = R.pick(level === 1 ? forms.slice(0, 3) : forms);
    return {
      prompt: f.p,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a few words') : ch(f.a, f.w, 4),
      hint: 'Pollination = pollen MOVES. Fertilisation = two cells JOIN. Then ovule → seed and ovary → fruit.',
      working: ['<b>Picture:</b> pollen is the post. Pollination is the delivery; fertilisation is opening the letter.', 'anther → (pollination) → stigma → (fertilisation) → ovule becomes a seed, ovary becomes the fruit.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'pollination',
    };
  }
  const HUMAN_ACCEPT = {
    baby: ['a baby'], child: ['a child'], adolescent: ['a teenager', 'a teen', 'an adolescent', 'teenager'],
    adult: ['an adult'], 'older adult': ['an older adult', 'elderly', 'an elderly person', 'old age'],
  };
  function humanQ(level) {
    const h = R.pick(HUMAN);
    const form = R.int(1, 3);
    if (form === 1) {
      return {
        visual: growthSvg(h.stage),
        prompt: `Which stage of human growth is <b>${h.when}</b>?`,
        answer: textAns(h.stage, HUMAN_ACCEPT[h.stage], 'one or two words'),
        hint: 'baby → child → adolescent → adult → older adult',
        working: ['<b>Picture:</b> five figures growing along a line.', `${HUMAN.map((x) => x.stage).join(' → ')}`, `${cap(h.when)} is the <b>${h.stage}</b> stage.`],
        finalAnswer: h.stage, skill: 'human',
      };
    }
    if (form === 2) {
      return {
        prompt: `What happens during the <b>${h.stage}</b> stage?`,
        answer: ch(h.what, HUMAN.map((x) => x.what), 4),
        hint: 'Think about how fast someone is growing and what they can do.',
        working: [`<b>Picture:</b> the growth line — the ${h.stage} stage is ${h.when}.`, `A ${h.stage} <b>${h.what}</b>.`],
        finalAnswer: h.what, skill: 'human',
      };
    }
    const i = HUMAN.indexOf(h);
    const j = Math.min(i + 1, HUMAN.length - 1);
    const target = i === HUMAN.length - 1 ? HUMAN[i - 1] : HUMAN[j];
    const ask = i === HUMAN.length - 1 ? 'comes just before' : 'comes straight after';
    return {
      visual: growthSvg(h.stage),
      prompt: `Which stage <b>${ask}</b> the <b>${h.stage}</b> stage?`,
      answer: textAns(target.stage, HUMAN_ACCEPT[target.stage], 'one or two words'),
      hint: 'baby → child → adolescent → adult → older adult',
      working: [`${HUMAN.map((x) => x.stage).join(' → ')}`, `So it is the <b>${target.stage}</b> stage.`],
      finalAnswer: target.stage, skill: 'human',
    };
  }
  function nzQ() {
    const f = R.pick(NZFACTS);
    return {
      prompt: f.q,
      answer: f.short ? textAns(f.short, f.shortAccept, 'a few words') : ch(f.a, f.w, 4),
      hint: 'Picture the animal in a New Zealand garden or bush and think about its wheel.',
      working: ['<b>Picture:</b> the life cycle wheel for that animal.', `Answer: <b>${f.a}</b>.`],
      finalAnswer: f.a, skill: 'nz',
    };
  }
  function cycleCalc(level) {
    const form = R.int(1, level === 1 ? 2 : 5);
    if (form === 1) {
      const egg = R.pick([3, 4, 5]), cat = R.pick([12, 14, 16]), chr = R.pick([9, 10, 12]);
      return {
        prompt: `A monarch spends <b>${egg} days</b> as an egg, <b>${cat} days</b> as a caterpillar and <b>${chr} days</b> as a chrysalis. How many days is that from egg to butterfly?`,
        answer: { type: 'number', value: egg + cat + chr, unit: 'days' },
        hint: 'Add the three stages together.',
        working: [`${egg} + ${cat} + ${chr} = <b>${egg + cat + chr}</b> days.`],
        finalAnswer: `${egg + cat + chr} days`, skill: 'numbers',
      };
    }
    if (form === 2) {
      const months = R.pick([11, 12, 13, 14, 15]);
      return {
        prompt: `A tuatara egg takes about <b>${months} months</b> to hatch. How many <b>weeks</b> is that, if a month is about 4 weeks?`,
        answer: { type: 'number', value: months * 4, unit: 'weeks' },
        hint: 'Months × 4.',
        working: [`${months} × 4 = <b>${months * 4}</b> weeks.`, 'That is why people say a tuatara egg takes about a whole year.'],
        finalAnswer: `${months * 4} weeks`, skill: 'numbers',
      };
    }
    if (form === 3) {
      const cycle = R.pick([28, 30, 35, 42]);
      const days = R.pick([120, 140, 210]);
      const gens = Math.floor(days / cycle);
      return {
        prompt: `One monarch life cycle takes <b>${cycle} days</b>. How many complete cycles fit into a <b>${days}-day</b> summer?`,
        answer: { type: 'number', value: gens, unit: 'cycles' },
        hint: 'Divide the summer by the length of one cycle, then round DOWN — a half cycle does not count.',
        working: [`${days} ÷ ${cycle} = ${(days / cycle).toFixed(2)}.`, `Round down: <b>${gens}</b> complete cycles.`],
        finalAnswer: `${gens} complete cycles`, skill: 'numbers',
      };
    }
    if (form === 4) {
      const eggs = R.pick([200, 500, 1000, 2000]);
      const pct = R.pick([1, 2, 5, 10]);
      const live = (eggs * pct) / 100;
      return {
        prompt: `A frog lays <b>${eggs}</b> eggs and only <b>${pct}%</b> reach adulthood. How many adult frogs is that?`,
        answer: { type: 'number', value: live, unit: 'frogs' },
        hint: 'Find 1% first (divide by 100), then multiply.',
        working: [`1% of ${eggs} = ${eggs / 100}.`, `${pct}% = ${eggs / 100} × ${pct} = <b>${live}</b> frogs.`, 'That is why frogs lay so many eggs.'],
        finalAnswer: `${live} frogs`, skill: 'numbers',
      };
    }
    const years = R.pick([3, 4, 5, 7]);
    const weeks = R.pick([2, 3, 4]);
    return {
      prompt: `A cicada spends <b>${years} years</b> underground as a nymph and only about <b>${weeks} weeks</b> as an adult. How many <b>months</b> is the nymph stage?`,
      answer: { type: 'number', value: years * 12, unit: 'months' },
      hint: 'Years × 12.',
      working: [`${years} × 12 = <b>${years * 12}</b> months underground.`, `Compared with only ${weeks} weeks in the sun.`],
      finalAnswer: `${years * 12} months`, skill: 'numbers',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    (level) => {
      const c = R.pick(CYCLES);
      const i = R.int(0, c.stages.length - 1);
      return {
        visual: wheelSvg(c, i),
        prompt: `Harper is labelling this life cycle for her book. What should she write in the gap?`,
        answer: ch(c.stages[i].f, allStages(), 4),
        hint: `Read round clockwise from the top: ${c.stages.map((s, k) => (k === i ? '?' : s.s)).join(' → ')}`,
        working: ['<b>Picture:</b> a wheel that never stops turning.', `${c.stages.map((s, k) => (k === i ? '<b>?</b>' : s.s)).join(' → ')}`, `The gap is the <b>${c.stages[i].f}</b>. ${cap(c.note)}.`],
        finalAnswer: c.stages[i].f,
      };
    },
    () => ({
      visual: metaSvg('complete'),
      prompt: 'Harper finds a fat striped caterpillar on a swan plant. Two weeks later there is a green case hanging there instead. What is happening, and what comes next?',
      answer: ch('Complete metamorphosis — the caterpillar has become a pupa (chrysalis), and a monarch butterfly will come out', ['Incomplete metamorphosis — a nymph is growing into an adult', 'The caterpillar has laid an egg', 'The caterpillar has died and the case is mould'], 4),
      hint: 'Which stage comes after larva in complete metamorphosis?',
      working: ['<b>Picture:</b> the pupa is a rebuild — the caterpillar is taken apart and put back together as a butterfly.', '1. Caterpillar = the <b>larva</b> stage.', '2. The green case = the <b>pupa (chrysalis)</b>.', '3. Next comes the <b>adult butterfly</b>, which lays eggs on the swan plant.', 'egg → larva → pupa → adult, round and round.'],
      finalAnswer: 'Complete metamorphosis — the caterpillar has become a pupa (chrysalis), and a monarch butterfly will come out',
    }),
    () => ({
      visual: metaSvg('incomplete'),
      prompt: 'Harper lifts a log and finds a weta that looks exactly like the big one, only much smaller. Is it a baby weta or a different insect?',
      answer: ch('A young weta — a nymph. Weta have incomplete metamorphosis, so the young already looks like a small adult', ['A different insect, because young weta look nothing like adults', 'A weta larva, which will make a pupa next', 'An adult weta that has shrunk'], 4),
      hint: 'No pupa stage means the young looks like the adult.',
      working: ['<b>Picture:</b> a nymph is a small copy that just gets bigger; a larva is something completely different.', '1. Does it look like the adult? <b>Yes.</b>', '2. So there is no pupa stage → <b>incomplete metamorphosis</b>.', '3. egg → <b>nymph</b> → adult. It sheds its skin each time it outgrows it.'],
      finalAnswer: 'A young weta — a nymph. Weta have incomplete metamorphosis, so the young already looks like a small adult',
    }),
    () => {
      const a = R.pick(ASEXUAL);
      return {
        prompt: `Harper's nana grows new plants by ${a.ex}. Is that sexual or asexual reproduction, and what will the new plants be like?`,
        answer: ch('Asexual — one parent only, so every new plant is an identical copy', ['Sexual — two parents, so the plants will all be different', 'Asexual, but the plants will all be different', 'Sexual, because the plant flowered first'], 4),
        hint: 'Count the parents. One parent means a copy.',
        working: ['<b>Picture:</b> a photocopy, not a card shuffle.', `1. How many parents? <b>One</b> — ${a.how}.`, '2. No pollen, no seeds, no mixing.', '3. So the new plants are <b>identical copies</b> of the parent.'],
        finalAnswer: 'Asexual — one parent only, so every new plant is an identical copy',
      };
    },
    () => ({
      prompt: 'A gardener grows tomatoes two ways: from seeds, and from cuttings off her best plant. Which method gives plants that are all the same, and why?',
      answer: ch('The cuttings — asexual reproduction copies one parent, while seeds mix two parents', ['The seeds, because seeds are always identical', 'Both give identical plants', 'Neither — plants are always identical'], 4),
      hint: 'Seeds need pollen from a flower. Cuttings need nobody.',
      working: ['<b>Picture:</b> photocopy versus card shuffle.', '1. Seeds: pollen from one plant joins an ovule from another → <b>sexual</b> → every seed is a new mix.', '2. Cuttings: one parent, no sex cells → <b>asexual</b> → identical copies.', 'So the cuttings are all the same as her best plant.'],
      finalAnswer: 'The cuttings — asexual reproduction copies one parent, while seeds mix two parents',
    }),
    () => ({
      prompt: 'A bee lands on an apple blossom, then flies to the next tree. Trace what happens from there to an apple with pips in it.',
      answer: ch('Pollination, then fertilisation, then the ovule becomes a seed and the ovary swells into the apple', ['Fertilisation first, then pollination, then the petals become the apple', 'The bee lays the seeds inside the flower', 'The flower turns straight into an apple with no pollen needed'], 4),
      hint: 'Pollen moves first, then two cells join, then the parts swell up.',
      working: ['<b>Picture:</b> pollen is the post. Delivering it is pollination; opening it is fertilisation.', '1. Pollen from the anther is carried to a <b>stigma</b> → <b>pollination</b>.', '2. The pollen nucleus joins an <b>ovule</b> in the ovary → <b>fertilisation</b>.', '3. Each fertilised ovule becomes a <b>pip (seed)</b>.', '4. The <b>ovary</b> swells into the <b>apple</b> around them.'],
      finalAnswer: 'Pollination, then fertilisation, then the ovule becomes a seed and the ovary swells into the apple',
    }),
    () => ({
      visual: growthSvg('adolescent'),
      prompt: 'Harper is 12. Which stage of human growth is she moving into, and what is the main thing that happens in it?',
      answer: ch('Adolescent — a big growth spurt, and the body gradually changes into an adult body', ['Adult — she is fully grown already', 'Child — she has not started growing yet', 'Older adult — her growth is slowing down'], 4),
      hint: 'baby → child → adolescent → adult → older adult.',
      working: ['<b>Picture:</b> five figures along a line, growing then levelling off.', '1. Baby (0–2), child (2–12), <b>adolescent (about 12–18)</b>, adult (18–65), older adult (65+).', '2. At 12 she is moving from <b>child</b> into <b>adolescent</b>.', '3. The main change is a <b>growth spurt</b> as the body becomes an adult body.'],
      finalAnswer: 'Adolescent — a big growth spurt, and the body gradually changes into an adult body',
    }),
    () => ({
      prompt: 'A frog lays 2000 eggs but a kiwi lays just one. Why the enormous difference?',
      answer: ch('Frog eggs are left alone and almost all get eaten, while a kiwi guards its one egg and the chick hatches well developed', ['Frogs are bigger than kiwi', 'Kiwi eggs hatch much faster so fewer are needed', 'Frogs cannot count their eggs'], 4),
      hint: 'Think about how much care each parent gives.',
      working: ['<b>Picture:</b> scattering a hundred seeds versus planting one carefully.', '1. The frog gives <b>no care</b> — the spawn is left in the pond and fish eat most of it.', '2. Only about 1–5% ever reach adulthood, so it must lay thousands.', '3. The kiwi <b>incubates one huge egg for about 80 days</b>, and the chick can feed itself within a week.', 'Lots of eggs and no care, or few eggs and lots of care — both work.'],
      finalAnswer: 'Frog eggs are left alone and almost all get eaten, while a kiwi guards its one egg and the chick hatches well developed',
    }),
    (level) => {
      const c = R.pick(CYCLES.filter((x) => x.group === 'insect'));
      return {
        visual: wheelSvg(c, undefined),
        prompt: `Harper wants to stop ${c.name} damaging her garden. Which stage of the wheel should she break, and why does breaking one stage stop the whole thing?`,
        answer: ch('Any one stage will do — if the wheel is broken anywhere, the adults cannot make the next generation', ['Only the adult stage matters, the rest can be ignored', 'Breaking a stage does nothing, because the cycle restarts by itself', 'Only the egg stage matters, because it is first'], 4),
        hint: 'A cycle is a circle, not a line. What happens if you cut a circle anywhere?',
        working: ['<b>Picture:</b> a bike chain — snap any link and the whole chain stops.', `1. The wheel is ${c.stages.map((s) => s.s).join(' → ')} → back to the start.`, '2. Every stage feeds the next one.', '3. Break it anywhere and no new adults get made.'],
        finalAnswer: 'Any one stage will do — if the wheel is broken anywhere, the adults cannot make the next generation',
      };
    },
    () => ({
      prompt: 'Harper plants a sunflower seed and it does nothing for a fortnight. Then she moves it somewhere warm and waters it. Two days later it sprouts. Explain.',
      answer: ch('It needed water, warmth and air to germinate — it was not dead, just waiting', ['The seed needed light, and the dark had killed it', 'Seeds always take exactly a fortnight', 'Moving it broke the seed coat open'], 4),
      hint: 'What does a seed need before it starts to grow?',
      working: ['<b>Picture:</b> a seed is a lunchbox with a tiny plant asleep inside.', '1. A seed germinates when it has <b>water, warmth and air</b>.', '2. In the cold it just waits — that is useful, so it does not sprout in winter.', '3. Warmth + water → the seed swells, the coat splits, the root goes down and the shoot goes up.', '4. Note it does <b>not</b> need light yet — it has its own food store.'],
      finalAnswer: 'It needed water, warmth and air to germinate — it was not dead, just waiting',
    }),
    () => ({
      visual: growthSvg('older adult'),
      prompt: 'Harper says "once you are an adult, nothing else happens". Is she right?',
      answer: ch('No — after adult comes older adult, when the body slows down and bones and muscles get weaker', ['Yes, adult is the last stage of all', 'No, adults keep growing taller forever', 'No, adults turn back into children'], 4),
      hint: 'Count the figures on the growth line.',
      working: ['<b>Picture:</b> the line of five figures — it goes up, levels off, then dips slightly.', '1. baby → child → adolescent → adult → <b>older adult</b>.', '2. Growing taller stops at the adult stage.', '3. But the cycle carries on: in the <b>older adult</b> stage the body gradually slows down.'],
      finalAnswer: 'No — after adult comes older adult, when the body slows down and bones and muscles get weaker',
    }),
    () => {
      const f = R.pick(NZFACTS);
      return {
        prompt: `In the bush at school camp, this comes up: ${f.q}`,
        answer: ch(f.a, f.w, 4),
        hint: 'Picture the animal and run its life cycle wheel in your head.',
        working: ['<b>Picture:</b> the wheel for that animal — each stage makes the next one.', `Answer: <b>${f.a}</b>.`],
        finalAnswer: f.a,
      };
    },
  ];

  HL.registerTopic({
    id: 'life-cycles', subject: 'science', strand: 'living', order: 11,
    name: 'Life cycles & growing up', short: 'Life cycles', animal: 'bee',
    blurb: 'How plants and animals are born, grow up and start the whole thing again.',
    example: 'egg → caterpillar → chrysalis → butterfly → egg…',
    learn: {
      what: '<p>Every living thing goes through a <b>life cycle</b>: it starts, grows up, reproduces, and the whole thing begins again with the next generation. Insects do it in two ways — <b>complete metamorphosis</b> (egg → larva → pupa → adult, like a monarch butterfly) and <b>incomplete metamorphosis</b> (egg → nymph → adult, like a weta or a cicada). Frogs, birds, reptiles and mammals each have their own version, and so do plants.</p><p><b>Picture for this topic:</b> a life cycle is a <b>wheel</b>, not a line. Start anywhere you like and you always come back to the same place — and if you break the wheel at any point, the whole thing stops.</p>',
      visual: `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
        <text x="170" y="15" text-anchor="middle" fill="#4A4033" font-size="12">the life cycle of a monarch butterfly</text>
        <circle cx="170" cy="108" r="68" fill="none" stroke="#D9BE8A" stroke-width="2" stroke-dasharray="5 5"/>
        <polygon points="224.4,66.3 218.8,53.6 211.7,60.6" fill="#B08850"/>
        <polygon points="211.7,162.4 224.4,156.8 217.4,149.7" fill="#B08850"/>
        <polygon points="115.6,149.7 121.2,162.4 128.3,155.4" fill="#B08850"/>
        <polygon points="128.3,53.6 115.6,59.2 122.6,66.3" fill="#B08850"/>
        <rect x="121.0" y="25.0" width="98" height="30" rx="10" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
        <text x="170.0" y="44.0" text-anchor="middle" fill="#4A4033" font-size="11.5">egg</text>
        <rect x="189.0" y="93.0" width="98" height="30" rx="10" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
        <text x="238.0" y="112.0" text-anchor="middle" fill="#4A4033" font-size="11.5">caterpillar</text>
        <rect x="121.0" y="161.0" width="98" height="30" rx="10" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
        <text x="170.0" y="180.0" text-anchor="middle" fill="#4A4033" font-size="11.5">chrysalis</text>
        <rect x="53.0" y="93.0" width="98" height="30" rx="10" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
        <text x="102.0" y="112.0" text-anchor="middle" fill="#4A4033" font-size="11.5">butterfly</text>
        <text x="170" y="208" text-anchor="middle" fill="#7A7065" font-size="10.5">it goes round and round — the adult starts it again</text>
      </svg>`,
      facts: [
        '<b>Complete metamorphosis:</b> egg → <b>larva</b> → <b>pupa</b> → adult (butterfly, beetle). The young looks nothing like the adult.',
        '<b>Incomplete metamorphosis:</b> egg → <b>nymph</b> → adult (weta, cicada, dragonfly). The nymph is a small version of the adult.',
        'Frog: egg (frogspawn) → <b>tadpole</b> → froglet → adult. Bird: egg → chick → juvenile → adult. Mammal: <b>born alive</b> → fed on milk → young → adult.',
        'Plant: seed → seedling → adult plant → flower → new seeds. <b>Germination</b> needs water, warmth and air.',
        '<b>Sexual</b> = two parents, sex cells join, offspring is a mix (seeds, eggs). <b>Asexual</b> = one parent, offspring is an identical copy (cuttings, runners, bulbs).',
        '<b>Pollination</b> = pollen moves anther → stigma. <b>Fertilisation</b> = the nuclei join. Then the ovule becomes the <b>seed</b> and the ovary becomes the <b>fruit</b>.',
        'Human growth: <b>baby → child → adolescent → adult → older adult</b>.',
      ],
      steps: [
        'Draw the <b>wheel</b> first. Put the egg (or the seed) at the top and work clockwise. Every stage has to make the next one, or the wheel stops.',
        'For an insect, ask "<b>is there a pupa?</b>" Yes → complete metamorphosis, and the young looks nothing like the adult. No → incomplete, and the nymph is just a small adult.',
        'For sexual or asexual, <b>count the parents</b>. Two parents and a mix → sexual (seeds, eggs). One parent and a copy → asexual (cuttings, runners, bulbs, tubers).',
        'Pollination and fertilisation are two different steps: pollen <b>moves</b> first, then the two nuclei <b>join</b>. Delivery, then opening the letter.',
        'For human growth, say the five stages in order: <b>baby, child, adolescent, adult, older adult</b>.',
      ],
      examples: [
        {
          q: 'Name the four stages a monarch butterfly goes through, in order.',
          visual: `<svg viewBox="0 0 340 214" width="340" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="170" y="15" text-anchor="middle" fill="#4A4033" font-size="12">complete metamorphosis</text>
            <circle cx="170" cy="108" r="68" fill="none" stroke="#D9BE8A" stroke-width="2" stroke-dasharray="5 5"/>
            <polygon points="224.4,66.3 218.8,53.6 211.7,60.6" fill="#B08850"/>
            <polygon points="211.7,162.4 224.4,156.8 217.4,149.7" fill="#B08850"/>
            <polygon points="115.6,149.7 121.2,162.4 128.3,155.4" fill="#B08850"/>
            <polygon points="128.3,53.6 115.6,59.2 122.6,66.3" fill="#B08850"/>
            <rect x="121.0" y="25.0" width="98" height="30" rx="10" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/>
            <text x="170.0" y="44.0" text-anchor="middle" fill="#4A4033" font-size="11.5">1. egg</text>
            <rect x="189.0" y="93.0" width="98" height="30" rx="10" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/>
            <text x="238.0" y="112.0" text-anchor="middle" fill="#4A4033" font-size="11.5">2. caterpillar</text>
            <rect x="121.0" y="161.0" width="98" height="30" rx="10" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/>
            <text x="170.0" y="180.0" text-anchor="middle" fill="#4A4033" font-size="11.5">3. chrysalis</text>
            <rect x="53.0" y="93.0" width="98" height="30" rx="10" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
            <text x="102.0" y="112.0" text-anchor="middle" fill="#4A4033" font-size="11.5">4. butterfly</text>
            <text x="170" y="208" text-anchor="middle" fill="#7A7065" font-size="10.5">larva and pupa are the proper science names</text>
          </svg>`,
          working: ['<b>Picture:</b> a wheel that turns all summer on a swan plant.', '1. The butterfly lays an <b>egg</b> on a swan plant leaf.', '2. It hatches into a <b>larva</b> — the striped caterpillar, which just eats.', '3. It hangs up and becomes a <b>pupa</b> — the green chrysalis, where it rebuilds completely.', '4. Out comes the <b>adult butterfly</b>, and it lays the next eggs.'],
          a: 'egg → larva (caterpillar) → pupa (chrysalis) → adult butterfly',
        },
        {
          q: 'A weta nymph looks like a small adult weta, but a caterpillar looks nothing like a butterfly. What are the two kinds of insect life cycle called?',
          visual: `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="170" y="14" text-anchor="middle" fill="#4A4033" font-size="12">two ways an insect grows up</text>
            <rect x="6" y="32" width="328" height="58" rx="10" fill="#FFFDF6" stroke="#E4D7BE" stroke-width="1.5"/>
            <text x="14" y="45" fill="#4A4033" font-size="11.5">complete: butterfly, beetle</text>
            <rect x="10" y="48" width="74" height="26" rx="9" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/><text x="47" y="65" text-anchor="middle" fill="#4A4033" font-size="11">egg</text>
            <polygon points="92,61 85,56 85,66" fill="#B08850"/>
            <rect x="92" y="48" width="74" height="26" rx="9" fill="#E8C24A" stroke="#4A4033" stroke-width="2"/><text x="129" y="65" text-anchor="middle" fill="#4A4033" font-size="11">larva</text>
            <polygon points="174,61 167,56 167,66" fill="#B08850"/>
            <rect x="174" y="48" width="74" height="26" rx="9" fill="#A9D8F5" stroke="#4A4033" stroke-width="2"/><text x="211" y="65" text-anchor="middle" fill="#4A4033" font-size="11">pupa</text>
            <polygon points="256,61 249,56 249,66" fill="#B08850"/>
            <rect x="256" y="48" width="74" height="26" rx="9" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/><text x="293" y="65" text-anchor="middle" fill="#4A4033" font-size="11">adult</text>
            <rect x="6" y="110" width="328" height="58" rx="10" fill="#FBEAF1" stroke="#E0568C" stroke-width="2.5"/>
            <text x="14" y="123" fill="#B03068" font-size="11.5">incomplete: weta, cicada</text>
            <rect x="51" y="126" width="74" height="26" rx="9" fill="#8FC96E" stroke="#4A4033" stroke-width="2"/><text x="88" y="143" text-anchor="middle" fill="#4A4033" font-size="11">egg</text>
            <polygon points="133,139 126,134 126,144" fill="#B08850"/>
            <rect x="133" y="126" width="74" height="26" rx="9" fill="#B9A5E6" stroke="#4A4033" stroke-width="2"/><text x="170" y="143" text-anchor="middle" fill="#4A4033" font-size="11">nymph</text>
            <polygon points="215,139 208,134 208,144" fill="#B08850"/>
            <rect x="215" y="126" width="74" height="26" rx="9" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/><text x="252" y="143" text-anchor="middle" fill="#4A4033" font-size="11">adult</text>
            <text x="170" y="188" text-anchor="middle" fill="#7A7065" font-size="10.5">no pupa? then the young already looks like the adult</text>
          </svg>`,
          working: ['<b>Picture:</b> a pupa is a full rebuild; a nymph is a photocopy that keeps being enlarged.', '1. Ask: <b>is there a pupa?</b>', '2. Butterfly: yes → egg → larva → pupa → adult = <b>complete metamorphosis</b>.', '3. Weta: no → egg → nymph → adult = <b>incomplete metamorphosis</b>.', '4. A weta nymph just sheds its skin each time it outgrows it.'],
          a: 'Butterfly = complete metamorphosis · weta = incomplete metamorphosis',
        },
        {
          q: 'Put the frog life cycle in order and say what changes at each step.',
          working: ['<b>Picture:</b> a wheel in a pond.', '1. <b>Egg (frogspawn)</b> — jelly-covered eggs laid in the water, no shell.', '2. <b>Tadpole</b> — a tail and gills, so it can only live in water.', '3. <b>Froglet</b> — back legs, then front legs; the tail shrinks and lungs replace the gills.', '4. <b>Adult frog</b> — lungs and legs, so it can live on land, and it lays the next eggs.'],
          a: 'egg (frogspawn) → tadpole → froglet → adult frog',
        },
        {
          q: 'Harper\'s nana takes a cutting from her best geranium. Her neighbour grows geraniums from seed. Whose plants will all look the same, and why?',
          working: ['<b>Picture:</b> a photocopy versus shuffling two packs of cards together.', '1. Cutting: how many parents? <b>One.</b> No pollen, no seeds → <b>asexual</b>.', '2. So every cutting is an <b>identical copy</b> of nana\'s plant.', '3. Seed: pollen from one flower joins an ovule in another → two parents → <b>sexual</b>.', '4. Each seed gets a different mix, so the neighbour\'s plants will all be slightly different.'],
          a: 'Nana\'s cuttings — asexual reproduction copies one parent exactly',
        },
        {
          q: 'A bee visits an apple blossom. Explain, step by step, how that ends up as an apple with pips.',
          working: ['<b>Picture:</b> pollen is the post. Pollination is delivering it; fertilisation is opening it.', '1. Pollen is made in the <b>anther</b> and sticks to the bee.', '2. The bee brushes it onto the sticky <b>stigma</b> of another flower → that is <b>pollination</b>.', '3. The pollen nucleus travels down and joins an <b>ovule</b> in the ovary → that is <b>fertilisation</b>.', '4. Each fertilised ovule becomes a <b>pip (seed)</b>, and the <b>ovary</b> swells into the <b>apple</b>.'],
          a: 'Pollination → fertilisation → ovule becomes the pip, ovary becomes the apple',
        },
        {
          q: 'Name the five stages of human growth, in order.',
          visual: `<svg viewBox="0 0 340 198" width="340" height="198" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
            <text x="170" y="16" text-anchor="middle" fill="#4A4033" font-size="12">the stages of human growth</text>
            <line x1="10" y1="150" x2="330" y2="150" stroke="#4A4033" stroke-width="2"/>
            <circle cx="40" cy="119" r="8.8" fill="#F6DFC8" stroke="#4A4033" stroke-width="2"/>
            <line x1="40" y1="128" x2="40" y2="141" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <line x1="36" y1="134" x2="44" y2="134" stroke="#4A4033" stroke-width="3" stroke-linecap="round"/>
            <line x1="40" y1="141" x2="36" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="40" y1="141" x2="44" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <text x="40" y="168" text-anchor="middle" fill="#4A4033" font-size="11">baby</text>
            <circle cx="106" cy="99" r="10.3" fill="#F6DFC8" stroke="#4A4033" stroke-width="2"/>
            <line x1="106" y1="110" x2="106" y2="133" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <line x1="98" y1="121" x2="114" y2="121" stroke="#4A4033" stroke-width="3" stroke-linecap="round"/>
            <line x1="106" y1="133" x2="99" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="106" y1="133" x2="113" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <text x="106" y="168" text-anchor="middle" fill="#4A4033" font-size="11">child</text>
            <circle cx="172" cy="80" r="11.8" fill="#F6DFC8" stroke="#4A4033" stroke-width="2"/>
            <line x1="172" y1="92" x2="172" y2="126" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <line x1="160" y1="108" x2="184" y2="108" stroke="#4A4033" stroke-width="3" stroke-linecap="round"/>
            <line x1="172" y1="126" x2="162" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="172" y1="126" x2="182" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <text x="172" y="168" text-anchor="middle" fill="#4A4033" font-size="10">adolescent</text>
            <circle cx="238" cy="69" r="12.7" fill="#F6DFC8" stroke="#4A4033" stroke-width="2"/>
            <line x1="238" y1="82" x2="238" y2="121" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <line x1="224" y1="103" x2="252" y2="103" stroke="#4A4033" stroke-width="3" stroke-linecap="round"/>
            <line x1="238" y1="121" x2="226" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="238" y1="121" x2="250" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <text x="238" y="168" text-anchor="middle" fill="#4A4033" font-size="11">adult</text>
            <circle cx="304" cy="76" r="12.2" fill="#F6DFC8" stroke="#4A4033" stroke-width="2"/>
            <line x1="304" y1="88" x2="304" y2="124" stroke="#4A4033" stroke-width="4" stroke-linecap="round"/>
            <line x1="292" y1="105" x2="316" y2="105" stroke="#4A4033" stroke-width="3" stroke-linecap="round"/>
            <line x1="304" y1="124" x2="293" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="304" y1="124" x2="315" y2="150" stroke="#4A4033" stroke-width="3.5" stroke-linecap="round"/>
            <text x="304" y="168" text-anchor="middle" fill="#4A4033" font-size="10">older adult</text>
            <text x="170" y="190" text-anchor="middle" fill="#7A7065" font-size="10.5">baby → child → adolescent → adult → older adult</text>
          </svg>`,
          working: ['<b>Picture:</b> five figures along a line — up, up, up, level, then a small dip.', '1. <b>Baby</b> (0–2): grows faster than at any other time; cannot walk or talk at first.', '2. <b>Child</b> (2–12): steady growth, learning fast.', '3. <b>Adolescent</b> (about 12–18): a growth spurt, and the body becomes an adult body.', '4. <b>Adult</b> (about 18–65): fully grown, and can have children.', '5. <b>Older adult</b> (65+): the body slows down; bones and muscles get weaker.'],
          a: 'baby → child → adolescent → adult → older adult',
        },
        {
          q: 'Why do frogs lay 2000 eggs while a kiwi lays just one, and why does a tuatara egg take a whole year?',
          working: ['<b>Picture:</b> scattering a hundred seeds versus planting one carefully.', '1. Frog: no parent care at all — most spawn gets eaten, so only about 1–5% survive. Lay thousands and a few get through.', '2. Kiwi: one enormous egg, and the male sits on it about <b>80 days</b>. The chick hatches well developed and can feed itself in a week.', '3. Tuatara: eggs are buried in cool NZ soil, and cool means slow — <b>about a year</b> before they hatch.', 'Two strategies, one goal: get some young to the adult stage so the wheel keeps turning.'],
          a: 'Lots of eggs with no care, or one egg with lots of care — both keep the wheel turning',
        },
      ],
      tips: [
        'A <b>larva</b> looks nothing like the adult and needs a <b>pupa</b> to change. A <b>nymph</b> already looks like a small adult and just gets bigger. Do not swap the words.',
        '<b>Pollination</b> and <b>fertilisation</b> are not the same thing. Pollen has to MOVE first (pollination), then the two nuclei JOIN (fertilisation).',
        'Asexual reproduction gives <b>identical copies</b>, which is great for a gardener but risky in the wild — one disease can wipe out the lot.',
        'A life cycle is a <b>circle</b>. There is no real "first" stage — you can start anywhere and end up back there.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)(level);
      const pool = level === 1
        ? [nextStage, wheelBlank, firstStage, metaQ, groupQ, humanQ, nzQ, cycleCalc, reproQ]
        : level === 2
          ? [nextStage, wheelBlank, firstStage, metaQ, groupQ, frogBirdQ, reproQ, asexualQ, pollenQ, humanQ, nzQ, cycleCalc]
          : [wheelBlank, nextStage, metaQ, frogBirdQ, reproQ, asexualQ, pollenQ, humanQ, nzQ, cycleCalc, groupQ, firstStage];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
