/* Topic: Simple machines & pressure — levers, pulleys, ramps, gears,
 * the force-for-distance trade, then pressure = force ÷ area. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const MACHINES = [
    { name: 'lever', job: 'a stiff bar that turns on a pivot, so a small effort can move a big load', ex: 'a seesaw, a crowbar, a pair of scissors', pic: 'a crowbar levering the lid off a paint tin' },
    { name: 'pulley', job: 'a wheel with a rope over it that changes the direction you pull in', ex: 'a flagpole, a crane, a clothesline', pic: 'pulling a rope down to send a flag up' },
    { name: 'ramp (inclined plane)', job: 'a slope, so you push with less force but over a longer distance', ex: 'a wheelchair ramp, a loading ramp, a zig-zag path up a hill', pic: 'pushing a heavy bin up a slope instead of lifting it' },
    { name: 'wheel and axle', job: 'a big wheel turning a thin axle, so a small turn on the outside gives a strong twist in the middle', ex: 'a door handle, a steering wheel, a tap', pic: 'turning a big door handle to move a stiff little latch' },
    { name: 'gear', job: 'toothed wheels that lock together to change the speed, the turning force and the direction', ex: 'bike gears, a clock, an egg beater', pic: 'the cogs on a bike changing gear up a hill' },
    { name: 'wedge', job: 'two slopes back to back that push things apart when you drive it in', ex: 'an axe, a knife, a doorstop, a chisel', pic: 'an axe splitting firewood' },
    { name: 'screw', job: 'a ramp wrapped round a rod, so turning it pulls things tightly together', ex: 'a screw, a bottle top, a corkscrew, a vice', pic: 'a screw winding itself into wood' },
  ];

  const LEVER_CLASSES = [
    { cls: 1, middle: 'pivot', say: 'the PIVOT is in the middle', order: 'effort — pivot — load' },
    { cls: 2, middle: 'load', say: 'the LOAD is in the middle', order: 'pivot — load — effort' },
    { cls: 3, middle: 'effort', say: 'the EFFORT is in the middle', order: 'pivot — effort — load' },
  ];
  const LEVER_ITEMS = [
    { item: 'a seesaw', cls: 1 }, { item: 'a pair of scissors', cls: 1 }, { item: 'a crowbar', cls: 1 },
    { item: 'a pair of pliers', cls: 1 }, { item: 'a claw hammer pulling out a nail', cls: 1 }, { item: 'a two-pan balance scale', cls: 1 },
    { item: 'a wheelbarrow', cls: 2 }, { item: 'a nutcracker', cls: 2 }, { item: 'a bottle opener', cls: 2 }, { item: 'a stapler', cls: 2 }, { item: 'a wheeled bin tipped back', cls: 2 },
    { item: 'a pair of tweezers', cls: 3 }, { item: 'a pair of BBQ tongs', cls: 3 }, { item: 'your forearm lifting a drink', cls: 3 }, { item: 'a fishing rod', cls: 3 }, { item: 'a broom being swept', cls: 3 },
  ];
  const LEVER_PARTS = [
    { part: 'load', meaning: 'the heavy thing you are trying to move', colour: '#5F98C4' },
    { part: 'effort', meaning: 'the push or pull you provide', colour: '#E0568C' },
    { part: 'pivot', meaning: 'the point the bar turns around', colour: '#C77D55' },
  ];

  const PRESSURE_THINGS = [
    { thing: 'a sharp knife', small: true, why: 'the whole force is squeezed onto a very thin edge, so the pressure is huge and it cuts' },
    { thing: 'a drawing pin', small: true, why: 'the tip has a tiny area, so a small push makes a huge pressure and it goes in' },
    { thing: 'an axe blade', small: true, why: 'the thin edge gives a big pressure, so the wood splits' },
    { thing: 'a stiletto heel', small: true, why: 'all of the person’s weight is on a tiny area, so it can dent a wooden floor' },
    { thing: 'a sharpened pencil', small: true, why: 'a small point means a big pressure, so it marks the paper easily' },
    { thing: 'a bird’s beak', small: true, why: 'the narrow tip concentrates the force so it can break a seed open' },
    { thing: 'snowshoes', small: false, why: 'they spread the weight over a big area, so the pressure is low and you do not sink' },
    { thing: 'the wide tyres on a tractor', small: false, why: 'a big area of tyre touches the mud, so the pressure is low and it does not sink in' },
    { thing: 'a camel’s wide foot', small: false, why: 'the wide foot spreads its weight so it does not sink into the sand' },
    { thing: 'wide straps on a school bag', small: false, why: 'the force is spread over more of your shoulder, so the pressure is lower and it hurts less' },
    { thing: 'skis', small: false, why: 'the long flat area spreads your weight, so the pressure on the snow is small' },
    { thing: 'the caterpillar tracks on a digger', small: false, why: 'a huge area touches the ground, so the pressure is low enough not to sink' },
  ];

  const AREAS = [
    { l: '0.001', m: 1 }, { l: '0.002', m: 2 }, { l: '0.005', m: 5 }, { l: '0.01', m: 10 },
    { l: '0.02', m: 20 }, { l: '0.05', m: 50 }, { l: '0.1', m: 100 }, { l: '0.2', m: 200 },
    { l: '0.5', m: 500 }, { l: '1', m: 1000 }, { l: '2', m: 2000 }, { l: '4', m: 4000 }, { l: '5', m: 5000 },
  ];
  const FORCES = [10, 20, 40, 50, 100, 200, 300, 400, 500, 600, 800, 1000];
  const GEAR_PAIRS = [[10, 20], [10, 30], [10, 40], [12, 24], [12, 36], [15, 30], [20, 40], [8, 24], [15, 45]];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const artN = (n) => (n === 8 || n === 18 ? 'an' : 'a');
  function pickPressure() {
    let a, F, p;
    do { a = R.pick(AREAS); F = R.pick(FORCES); p = (F * 1000) / a.m; }
    while (!Number.isInteger(p) || p < 10 || p > 200000);
    return { a, F, p };
  }

  /* ---------- diagrams ---------- */
  function leverSvg(cls, opts) {
    opts = opts || {};
    const blank = opts.blank || null;
    const spots = cls === 1
      ? { effort: { x: 58, dir: 'down' }, pivot: { x: 170 }, load: { x: 290, dir: 'down' } }
      : cls === 2
        ? { pivot: { x: 50 }, load: { x: 170, dir: 'down' }, effort: { x: 290, dir: 'up' } }
        : { pivot: { x: 50 }, effort: { x: 170, dir: 'up' }, load: { x: 290, dir: 'down' } };
    const colour = { load: '#5F98C4', effort: '#E0568C', pivot: '#C77D55' };
    let s = '';
    Object.keys(spots).forEach((k) => {
      const sp = spots[k], isBlank = blank === k, col = isBlank ? '#E0568C' : colour[k];
      const label = isBlank ? '?' : k.toUpperCase();
      if (k === 'pivot') {
        s += `<polygon points="${sp.x - 17},118 ${sp.x + 17},118 ${sp.x},89" fill="${isBlank ? '#FFFFFF' : '#E9A07A'}" stroke="${col}" stroke-width="3"/>`;
        s += `<text x="${sp.x}" y="${136}" text-anchor="middle" fill="${col}" font-size="${isBlank ? 15 : 12}">${label}</text>`;
      } else if (sp.dir === 'down') {
        s += `<line x1="${sp.x}" y1="40" x2="${sp.x}" y2="66" stroke="${col}" stroke-width="4"/><polygon points="${sp.x},76 ${sp.x - 7},64 ${sp.x + 7},64" fill="${col}"/>`;
        s += `<text x="${sp.x}" y="32" text-anchor="middle" fill="${col}" font-size="${isBlank ? 15 : 12}">${label}</text>`;
      } else {
        s += `<line x1="${sp.x}" y1="142" x2="${sp.x}" y2="112" stroke="${col}" stroke-width="4"/><polygon points="${sp.x},100 ${sp.x - 7},112 ${sp.x + 7},112" fill="${col}"/>`;
        s += `<text x="${sp.x}" y="160" text-anchor="middle" fill="${col}" font-size="${isBlank ? 15 : 12}">${label}</text>`;
      }
    });
    return `<svg viewBox="0 0 340 184" width="340" height="184" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">${opts.title || 'a lever'}</text>
      <rect x="26" y="78" width="288" height="12" rx="4" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      ${s}
      ${opts.caption ? `<text x="170" y="178" text-anchor="middle" fill="${INK}" font-size="12">${opts.caption}</text>` : ''}
    </svg>`;
  }

  function pulleySvg() {
    return `<svg viewBox="0 0 340 196" width="340" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="170" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">a fixed pulley changes the way you pull</text>
      <rect x="140" y="26" width="60" height="9" rx="3" fill="#9A8F80"/>
      <line x1="170" y1="35" x2="170" y2="44" stroke="#9A8F80" stroke-width="4"/>
      <circle cx="170" cy="66" r="23" fill="#E8C24A" stroke="#C98A1C" stroke-width="3"/>
      <circle cx="170" cy="66" r="5" fill="#C98A1C"/>
      <path d="M 147 66 A 23 23 0 0 1 193 66" fill="none" stroke="#8E79C6" stroke-width="4"/>
      <line x1="147" y1="66" x2="147" y2="140" stroke="#8E79C6" stroke-width="4"/>
      <line x1="193" y1="66" x2="193" y2="150" stroke="#8E79C6" stroke-width="4"/>
      <rect x="123" y="140" width="48" height="30" rx="5" fill="#A9D8F5" stroke="#5F98C4" stroke-width="3"/>
      <text x="147" y="160" text-anchor="middle" fill="#3C6E96" font-size="12">LOAD</text>
      <line x1="92" y1="150" x2="92" y2="112" stroke="#5F98C4" stroke-width="4"/><polygon points="92,100 85,112 99,112" fill="#5F98C4"/>
      <text x="92" y="170" text-anchor="middle" fill="#3C6E96" font-size="12">goes UP</text>
      <line x1="246" y1="104" x2="246" y2="142" stroke="#E0568C" stroke-width="4"/><polygon points="246,154 239,142 253,142" fill="#E0568C"/>
      <text x="246" y="96" text-anchor="middle" fill="#C33C72" font-size="12">you pull</text>
      <text x="246" y="172" text-anchor="middle" fill="#C33C72" font-size="12">DOWN</text>
      <text x="170" y="190" text-anchor="middle" fill="${INK}" font-size="12">same size force — but a much easier direction</text>
    </svg>`;
  }

  function gearSvg(t1, t2, showSecond) {
    const rad = (t) => Math.min(54, 14 + t * 1.15);
    const r1 = rad(t1), r2 = rad(t2);
    const cy = 96, cx1 = 14 + r1, cx2 = cx1 + r1 + r2 + 7;
    const teeth = (cx, r, n, col) => {
      let s = '';
      for (let i = 0; i < n; i++) {
        const a = (i * 2 * Math.PI) / n;
        s += `<line x1="${(cx + r * Math.cos(a)).toFixed(1)}" y1="${(cy + r * Math.sin(a)).toFixed(1)}" x2="${(cx + (r + 7) * Math.cos(a)).toFixed(1)}" y2="${(cy + (r + 7) * Math.sin(a)).toFixed(1)}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
      }
      return s;
    };
    const arrow = (cx, r, clockwise, col) => {
      const y = cy - r - 15;
      return `<path d="M ${cx - 20} ${y} A 22 22 0 0 1 ${cx + 20} ${y}" fill="none" stroke="${col}" stroke-width="3"/>
        <polygon points="${clockwise ? `${cx + 20},${y} ${cx + 10},${y - 6} ${cx + 12},${y + 6}` : `${cx - 20},${y} ${cx - 10},${y - 6} ${cx - 12},${y + 6}`}" fill="${col}"/>`;
    };
    return `<svg viewBox="0 0 340 204" width="340" height="204" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${teeth(cx1, r1, t1, '#C98A1C')}<circle cx="${cx1}" cy="${cy}" r="${r1}" fill="#E8C24A" stroke="#C98A1C" stroke-width="3"/><circle cx="${cx1}" cy="${cy}" r="7" fill="#FFFFFF" stroke="#C98A1C" stroke-width="2"/>
      ${teeth(cx2, r2, t2, '#6FA04C')}<circle cx="${cx2}" cy="${cy}" r="${r2}" fill="#8FC96E" stroke="#6FA04C" stroke-width="3"/><circle cx="${cx2}" cy="${cy}" r="7" fill="#FFFFFF" stroke="#6FA04C" stroke-width="2"/>
      ${arrow(cx1, r1, true, '#C33C72')}
      ${showSecond ? arrow(cx2, r2, false, '#3F6A26') : `<text x="${cx2}" y="${cy - r2 - 10}" text-anchor="middle" fill="#C33C72" font-size="17">&#63;</text>`}
      <rect x="202" y="46" width="13" height="13" rx="3" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="221" y="57" fill="${INK}" font-size="11.5">driver: ${t1} teeth</text>
      <rect x="202" y="76" width="13" height="13" rx="3" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
      <text x="221" y="87" fill="${INK}" font-size="11.5">driven: ${t2} teeth</text>
      <text x="202" y="118" fill="#C33C72" font-size="11.5">driver &#8594; this way</text>
      <text x="202" y="140" fill="${showSecond ? '#3F6A26' : '#C33C72'}" font-size="11.5">${showSecond ? 'driven &#8594; other way' : 'driven &#8594; which way &#63;'}</text>
      <text x="170" y="192" text-anchor="middle" fill="${INK}" font-size="12">gears that touch turn opposite ways</text>
    </svg>`;
  }

  const spaced = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  function pressureSvg(F, aSmall, pSmall, aBig, pBig) {
    const panel = (cx, head, w, area, p, col) => `
      <text x="${cx}" y="40" text-anchor="middle" fill="${INK}" font-size="12">${head}</text>
      <line x1="${cx}" y1="52" x2="${cx}" y2="88" stroke="#8E79C6" stroke-width="4"/><polygon points="${cx},99 ${cx - 7},87 ${cx + 7},87" fill="#8E79C6"/>
      <text x="${cx + 12}" y="74" fill="#6B57A3" font-size="12">${F} N</text>
      <rect x="${cx - w / 2}" y="102" width="${w}" height="13" rx="3" fill="${col}" stroke="${INK}" stroke-width="2"/>
      <text x="${cx}" y="140" text-anchor="middle" fill="${INK}" font-size="12">area ${area} m&#178;</text>
      <text x="${cx}" y="164" text-anchor="middle" fill="${col === '#E0568C' ? '#C33C72' : '#3F6A26'}" font-size="12.5">${spaced(p)} Pa</text>`;
    return `<svg viewBox="0 0 350 200" width="350" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="17" text-anchor="middle" fill="${INK}" font-size="12.5">same weight, different area</text>
      <line x1="16" y1="121" x2="160" y2="121" stroke="#9A8F80" stroke-width="3"/>
      <line x1="190" y1="121" x2="334" y2="121" stroke="#9A8F80" stroke-width="3"/>
      <line x1="175" y1="26" x2="175" y2="174" stroke="#E7DCC6" stroke-width="2"/>
      ${panel(88, 'sharp heel', 16, aSmall, pSmall, '#E0568C')}
      ${panel(262, 'flat shoe', 108, aBig, pBig, '#8FC96E')}
      <text x="175" y="192" text-anchor="middle" fill="${INK}" font-size="12">smaller area &#8594; bigger pressure</text>
    </svg>`;
  }

  function conceptSvg() {
    return `<svg viewBox="0 0 350 208" width="350" height="208" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">a machine: a small effort moves a big load</text>
      <rect x="24" y="80" width="290" height="12" rx="4" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <polygon points="215,120 249,120 232,93" fill="#E9A07A" stroke="#C77D55" stroke-width="3"/>
      <text x="232" y="136" text-anchor="middle" fill="#C77D55" font-size="12">PIVOT</text>
      <line x1="56" y1="46" x2="56" y2="68" stroke="#E0568C" stroke-width="4"/><polygon points="56,78 49,66 63,66" fill="#E0568C"/>
      <text x="56" y="40" text-anchor="middle" fill="#C33C72" font-size="12">EFFORT</text>
      <rect x="278" y="54" width="34" height="26" rx="4" fill="#A9D8F5" stroke="#5F98C4" stroke-width="3"/>
      <text x="295" y="46" text-anchor="middle" fill="#3C6E96" font-size="12">LOAD</text>
      <text x="122" y="118" text-anchor="middle" fill="${INK}" font-size="12">a long way this side</text>
      <text x="120" y="136" text-anchor="middle" fill="#C33C72" font-size="12">= less force needed</text>
      <line x1="14" y1="150" x2="336" y2="150" stroke="#E7DCC6" stroke-width="2"/>
      <text x="175" y="174" text-anchor="middle" fill="#C33C72" font-size="15">pressure = force &#247; area</text>
      <text x="90" y="196" text-anchor="middle" fill="${INK}" font-size="12">small area = BIG push</text>
      <text x="262" y="196" text-anchor="middle" fill="${INK}" font-size="12">big area = gentle push</text>
    </svg>`;
  }

  /* ---------- question makers: machines ---------- */
  function machineJob() {
    const m = R.pick(MACHINES);
    const c = choice(m.job, MACHINES.filter((x) => x.name !== m.name).map((x) => x.job));
    return {
      prompt: `What does a <b>${m.name}</b> do?`,
      answer: ans(c),
      hint: `Think of ${m.pic}.`,
      working: [`<b>Picture:</b> ${m.pic}.`, `A ${m.name} is <b>${m.job}</b>.`],
      finalAnswer: m.job, skill: 'machines',
    };
  }
  function machineFromExample() {
    const m = R.pick(MACHINES);
    const ex = R.pick(m.ex.split(', '));
    const c = choice(m.name, MACHINES.filter((x) => x.name !== m.name).map((x) => x.name));
    return {
      prompt: `Which simple machine is this: <b>${ex}</b>?`,
      answer: ans(c),
      hint: 'Does it turn on a pivot, roll on a wheel, slope, have teeth, or split things apart?',
      working: [`<b>Picture:</b> ${ex}.`, `It works by being ${m.job}.`, `So it is a <b>${m.name}</b>.`],
      finalAnswer: m.name, skill: 'machines',
    };
  }
  function machineFromJob() {
    const m = R.pick(MACHINES);
    const c = choice(m.name, MACHINES.filter((x) => x.name !== m.name).map((x) => x.name));
    return {
      prompt: `Which simple machine is described here: <b>${m.job}</b>?`,
      answer: ans(c),
      hint: `Examples of it: ${m.ex}.`,
      working: [`<b>Picture:</b> ${m.pic}.`, `That is a <b>${m.name}</b> — for example ${m.ex}.`],
      finalAnswer: m.name, skill: 'machines',
    };
  }
  function leverPart() {
    const p = R.pick(LEVER_PARTS);
    const cls = R.pick([1, 2, 3]);
    const c = choice(p.part, LEVER_PARTS.map((x) => x.part), 3);
    return {
      visual: leverSvg(cls, { blank: p.part, title: 'name the missing label' }),
      prompt: `On this lever, which part is marked <b>?</b>&nbsp;— it is ${p.meaning}.`,
      answer: ans(c),
      hint: 'Load = the heavy thing. Effort = your push. Pivot = the point it turns on.',
      working: ['<b>Picture:</b> a seesaw — you push one end (effort), your friend sits on the other (load), and the bar rocks on the middle (pivot).', `${cap(p.meaning)} is the <b>${p.part}</b>.`],
      finalAnswer: p.part, skill: 'levers',
    };
  }
  function leverPartMeaning() {
    const p = R.pick(LEVER_PARTS);
    const c = choice(p.meaning, LEVER_PARTS.filter((x) => x.part !== p.part).map((x) => x.meaning), 3);
    return {
      prompt: `On a lever, what is the <b>${p.part}</b>?`,
      answer: ans(c),
      hint: 'Say the seesaw picture in your head.',
      working: ['<b>Picture:</b> a seesaw in the playground.', `The ${p.part} is <b>${p.meaning}</b>.`],
      finalAnswer: p.meaning, skill: 'levers',
    };
  }
  function leverClassQ() {
    const it = R.pick(LEVER_ITEMS);
    const lc = LEVER_CLASSES.find((x) => x.cls === it.cls);
    const askWhich = R.chance(0.5);
    if (askWhich) {
      const c = choice(`class ${it.cls}`, LEVER_CLASSES.map((x) => `class ${x.cls}`), 3);
      return {
        visual: leverSvg(it.cls, { title: it.item }),
        prompt: `Which class of lever is <b>${it.item}</b>?`,
        answer: ans(c),
        hint: 'Look at what sits in the MIDDLE: pivot = class 1, load = class 2, effort = class 3.',
        working: [
          '<b>Picture:</b> line up the three parts and see which one is piggy in the middle.',
          `In ${it.item}, ${lc.say}.`,
          `Middle = ${lc.middle} → <b>class ${it.cls}</b> (${lc.order}).`,
        ],
        finalAnswer: `class ${it.cls}`, skill: 'levers',
      };
    }
    const c = choice(lc.middle, LEVER_PARTS.map((x) => x.part), 3);
    return {
      visual: leverSvg(it.cls, { title: it.item }),
      prompt: `In <b>${it.item}</b>, which part is in the <b>middle</b>?`,
      answer: ans(c),
      hint: 'Look at the picture: which label sits between the other two?',
      working: [`<b>Picture:</b> ${it.item}.`, `${cap(lc.say)}.`, `So it is a <b>class ${it.cls}</b> lever.`],
      finalAnswer: lc.middle, skill: 'levers',
    };
  }
  function leverExampleQ() {
    const lc = R.pick(LEVER_CLASSES);
    const right = R.pick(LEVER_ITEMS.filter((x) => x.cls === lc.cls)).item;
    const wrongs = LEVER_ITEMS.filter((x) => x.cls !== lc.cls).map((x) => x.item);
    const c = choice(right, wrongs);
    return {
      visual: leverSvg(lc.cls, { title: `class ${lc.cls}: ${lc.say}` }),
      prompt: `Which of these is a <b>class ${lc.cls}</b> lever?`,
      answer: ans(c),
      hint: `In a class ${lc.cls} lever, ${lc.say}.`,
      working: [`<b>Rule:</b> class 1 = pivot in the middle, class 2 = load in the middle, class 3 = effort in the middle.`, `Class ${lc.cls}: ${lc.say}.`, `<b>${cap(right)}</b> is built that way.`],
      finalAnswer: right, skill: 'levers',
    };
  }
  function tradeOffQ() {
    const q = R.pick([
      { p: 'A ramp lets Harper push a heavy box up with <b>half</b> the force. What is the catch?', a: 'She has to push it twice as far', w: ['She gets twice as much energy', 'The box gets lighter', 'There is no catch at all'] },
      { p: 'Does a machine <b>create</b> energy for you?', a: 'No — it only changes how the force is applied', w: ['Yes, that is how it helps', 'Yes, levers make extra energy', 'Only pulleys do'] },
      { p: 'A pulley system lets you lift a load with a quarter of the force. What must you do with the rope?', a: 'Pull four times as much rope through', w: ['Pull a quarter as much rope', 'Pull the same amount of rope', 'Cut the rope shorter'] },
      { p: 'What is the big rule for every simple machine?', a: 'You trade distance for force — less force always means moving further', w: ['You get energy for free', 'The load gets lighter', 'Force and distance both get smaller'] },
      { p: 'Why is a long crowbar better than a short one for levering up a rock?', a: 'The longer the effort side, the less force you need', w: ['A long bar is heavier so it pushes harder', 'A long bar makes extra energy', 'The rock becomes lighter'] },
      { p: 'A zig-zag path up a steep hill is longer than going straight up. Why build it that way?', a: 'A gentler slope needs less force at each step, even though you walk further', w: ['It is shorter than the straight path', 'It makes you weigh less', 'Walking further uses less energy overall'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'A machine is a swap shop: force for distance. It never gives you something for nothing.',
      working: ['<b>Picture:</b> pushing a bin up a ramp instead of lifting it — easier, but a much longer trip.', '<b>Rule:</b> less force = more distance. Energy in is still energy out.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'trade-off',
    };
  }
  function gearDirection() {
    const [t1, t2] = R.pick(GEAR_PAIRS);
    const c = choice('The other way (anticlockwise)', ['The same way (clockwise)', 'It does not turn at all', 'It wobbles back and forth'], 4);
    return {
      visual: gearSvg(t1, t2, false),
      prompt: 'The yellow gear is turned <b>clockwise</b>. Which way does the green gear turn?',
      answer: ans(c),
      hint: 'Watch the teeth where they meet — one pushes the other the opposite way.',
      working: ['<b>Picture:</b> where the teeth meet, one gear pushes the other backwards.', 'Gears that touch always turn <b>opposite ways</b>.', 'So the green gear turns <b>anticlockwise</b>.'],
      finalAnswer: 'The other way — anticlockwise', skill: 'gears',
    };
  }
  function gearSpeed() {
    const [t1, t2] = R.pick(GEAR_PAIRS);
    const bigDriven = R.chance(0.5);
    const driver = bigDriven ? t1 : t2, driven = bigDriven ? t2 : t1;
    const slower = driven > driver;
    const c = choice(slower ? 'Slower, but with more turning force' : 'Faster, but with less turning force',
      ['Exactly the same speed', slower ? 'Faster, but with less turning force' : 'Slower, but with more turning force', 'It stops the gear'], 3);
    return {
      visual: gearSvg(driver, driven, true),
      prompt: `${cap(artN(driver))} <b>${driver}-tooth</b> gear drives ${artN(driven)} <b>${driven}-tooth</b> gear. How does the second gear turn?`,
      answer: ans(c),
      hint: 'A bigger gear has further to go for one turn, so it turns more slowly — but it pushes harder.',
      working: [
        '<b>Picture:</b> low gear on a bike — the pedals spin easily but the bike goes slowly up the hill.',
        `1. Driver has ${driver} teeth, driven has ${driven} teeth.`,
        `2. The driven gear is ${slower ? 'bigger' : 'smaller'}, so it turns <b>${slower ? 'slower with more force' : 'faster with less force'}</b>.`,
      ],
      finalAnswer: slower ? 'Slower, with more turning force' : 'Faster, with less turning force', skill: 'gears',
    };
  }
  function gearCalc() {
    const [t1, t2] = R.pick(GEAR_PAIRS);
    const k = R.int(1, 4);
    const turns = (t2 / t1) * k;
    return {
      visual: gearSvg(t1, t2, true),
      prompt: `${cap(artN(t1))} <b>${t1}-tooth</b> gear turns <b>${turns} times</b>. How many times does the <b>${t2}-tooth</b> gear it drives go round?`,
      answer: { type: 'number', value: k, unit: 'turns', placeholder: 'e.g. 2' },
      hint: 'Count teeth, not turns: the same number of teeth must go past the meeting point.',
      working: [
        '<b>Rule:</b> teeth moved by gear 1 = teeth moved by gear 2.',
        `1. Teeth moved = ${t1} × ${turns} = ${t1 * turns}.`,
        `2. Turns of the big gear = ${t1 * turns} ÷ ${t2} = <b>${k}</b>.`,
        'The bigger gear turns fewer times — slower, but stronger.',
      ],
      finalAnswer: `${k} turns`, skill: 'gears',
    };
  }
  function leverBalance() {
    const load = R.pick([100, 200, 300, 400, 600]);
    const dLoad = R.pick([1, 2]);
    const dEffort = R.pick([2, 4, 5, 6]);
    const effort = (load * dLoad) / dEffort;
    if (!Number.isInteger(effort)) return leverBalance();
    return {
      visual: leverSvg(1, { title: 'a balanced lever', caption: 'load × its distance = effort × its distance' }),
      prompt: `A load of <b>${load} N</b> sits <b>${dLoad} m</b> from the pivot. Harper pushes down <b>${dEffort} m</b> from the pivot on the other side. What force does she need?`,
      answer: { type: 'number', value: effort, unit: 'N', placeholder: 'e.g. 50' },
      hint: 'load × its distance = effort × its distance.',
      working: [
        '<b>Rule:</b> load × distance = effort × distance.',
        `1. Load side: ${load} × ${dLoad} = ${load * dLoad}.`,
        `2. Effort side: ? × ${dEffort} = ${load * dLoad}.`,
        `3. ${load * dLoad} ÷ ${dEffort} = <b>${effort} N</b>.`,
        'Further from the pivot = less force needed.',
      ],
      finalAnswer: `${effort} N`, skill: 'levers',
    };
  }

  /* ---------- question makers: pressure ---------- */
  function pressureFormulaQ() {
    const q = R.pick([
      { p: 'What is the formula for <b>pressure</b>?', a: 'pressure = force ÷ area', w: ['pressure = force × area', 'pressure = area ÷ force', 'pressure = force + area'] },
      { p: 'What unit is pressure measured in?', a: 'N/m² (also called pascals, Pa)', w: ['newtons (N)', 'joules (J)', 'metres (m)'] },
      { p: 'If the force stays the same and the area gets <b>smaller</b>, what happens to the pressure?', a: 'It gets bigger', w: ['It gets smaller', 'It stays the same', 'It becomes zero'] },
      { p: 'If the force stays the same and the area gets <b>bigger</b>, what happens to the pressure?', a: 'It gets smaller', w: ['It gets bigger', 'It stays the same', 'It doubles'] },
      { p: 'What does pressure actually mean?', a: 'How much force is pressing on each bit of area', w: ['How heavy something is', 'How fast something moves', 'How much energy something has'] },
      { p: 'Two boxes weigh the same. One has a much wider base. Which pushes harder on each bit of floor?', a: 'The narrow one — its force is on a smaller area', w: ['The wide one, because it looks bigger', 'They press the same on each bit', 'Neither presses on the floor'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Pressure = force ÷ area. Squeeze the same force onto less area and the pressure shoots up.',
      working: ['<b>Picture:</b> your weight on a flat shoe vs the same weight on one sharp heel.', '<b>pressure = force ÷ area</b>, measured in N/m².', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'pressure',
    };
  }
  function pressureCalc() {
    const { a, F, p } = pickPressure();
    return {
      prompt: `A force of <b>${F} N</b> presses on an area of <b>${a.l} m²</b>. What is the pressure?`,
      answer: { type: 'number', value: p, unit: 'N/m²', placeholder: 'e.g. 200' },
      hint: 'pressure = force ÷ area. Divide the newtons by the square metres.',
      working: ['<b>Rule:</b> pressure = force ÷ area.', `${F} ÷ ${a.l} = <b>${p} N/m²</b>.`, 'N/m² is the same as pascals (Pa).'],
      finalAnswer: `${p} N/m²`, skill: 'pressure-calc',
    };
  }
  function forceFromPressure() {
    const { a, F, p } = pickPressure();
    return {
      prompt: `The pressure under a block is <b>${p} N/m²</b> and it touches an area of <b>${a.l} m²</b>. What is the force pressing down?`,
      answer: { type: 'number', value: F, unit: 'N', placeholder: 'e.g. 400' },
      hint: 'Rearrange: force = pressure × area.',
      working: ['<b>Rule:</b> pressure = force ÷ area, so force = pressure × area.', `${p} × ${a.l} = <b>${F} N</b>.`],
      finalAnswer: `${F} N`, skill: 'pressure-calc',
    };
  }
  function areaFromPressure() {
    const { a, F, p } = pickPressure();
    return {
      prompt: `A force of <b>${F} N</b> makes a pressure of <b>${p} N/m²</b>. What area is it pressing on?`,
      answer: { type: 'number', value: a.m / 1000, unit: 'm²', tolerance: 0.0005, placeholder: 'e.g. 0.02' },
      hint: 'Rearrange: area = force ÷ pressure.',
      working: ['<b>Rule:</b> pressure = force ÷ area, so area = force ÷ pressure.', `${F} ÷ ${p} = <b>${a.l} m²</b>.`],
      finalAnswer: `${a.l} m²`, skill: 'pressure-calc',
    };
  }
  function pressureCompare() {
    const F = R.pick([400, 500, 600, 800]);
    const pairs = [[{ l: '0.001', m: 1 }, { l: '0.01', m: 10 }], [{ l: '0.002', m: 2 }, { l: '0.02', m: 20 }], [{ l: '0.005', m: 5 }, { l: '0.05', m: 50 }], [{ l: '0.01', m: 10 }, { l: '0.05', m: 50 }], [{ l: '0.02', m: 20 }, { l: '0.1', m: 100 }]];
    const [sm, bg] = R.pick(pairs);
    const ps = (F * 1000) / sm.m, pb = (F * 1000) / bg.m, times = bg.m / sm.m;
    if (R.chance(0.5)) {
      return {
        visual: pressureSvg(F, sm.l, ps, bg.l, pb),
        prompt: `The same person (<b>${F} N</b>) stands on a heel of area <b>${sm.l} m²</b>, then on a flat shoe of area <b>${bg.l} m²</b>. How many times bigger is the pressure under the heel?`,
        answer: { type: 'number', value: times, unit: 'times', placeholder: 'e.g. 10' },
        hint: 'Work out both pressures, then divide the big one by the small one.',
        working: [
          '<b>Rule:</b> pressure = force ÷ area.',
          `1. Heel: ${F} ÷ ${sm.l} = ${ps} N/m².`,
          `2. Flat shoe: ${F} ÷ ${bg.l} = ${pb} N/m².`,
          `3. ${ps} ÷ ${pb} = <b>${times} times</b> bigger.`,
          'Same weight — the heel just squeezes it onto far less floor.',
        ],
        finalAnswer: `${times} times bigger`, skill: 'pressure-calc',
      };
    }
    return {
      visual: pressureSvg(F, sm.l, ps, bg.l, pb),
      prompt: `A person weighing <b>${F} N</b> stands on a sharp heel of area <b>${sm.l} m²</b>. What pressure does the heel put on the floor?`,
      answer: { type: 'number', value: ps, unit: 'N/m²', placeholder: 'e.g. 60000' },
      hint: 'pressure = force ÷ area — use the small area.',
      working: ['<b>Rule:</b> pressure = force ÷ area.', `${F} ÷ ${sm.l} = <b>${ps} N/m²</b>.`, `On the flat shoe it would only be ${pb} N/m² — that is why heels dent floors.`],
      finalAnswer: `${ps} N/m²`, skill: 'pressure-calc',
    };
  }
  function whyPressureQ() {
    const t = R.pick(PRESSURE_THINGS);
    const c = choice(t.why, PRESSURE_THINGS.filter((x) => x.thing !== t.thing).map((x) => x.why));
    return {
      prompt: `Explain why <b>${t.thing}</b> works, using pressure.`,
      answer: ans(c),
      hint: t.small ? 'A small area means a big pressure.' : 'A big area means a small pressure.',
      working: [
        '<b>Rule:</b> pressure = force ÷ area.',
        `1. Is the area big or small? <b>${t.small ? 'Small' : 'Big'}</b>.`,
        `2. So the pressure is <b>${t.small ? 'big' : 'small'}</b>.`,
        `Answer: ${t.why}.`,
      ],
      finalAnswer: t.why, skill: 'pressure',
    };
  }
  function bigOrSmallArea() {
    const t = R.pick(PRESSURE_THINGS);
    const c = choice(t.small ? 'A big pressure, because the area is small' : 'A small pressure, because the area is big',
      ['A big pressure, because the area is small', 'A small pressure, because the area is big', 'No pressure at all'], 3);
    return {
      prompt: `Does <b>${t.thing}</b> make a big pressure or a small one?`,
      answer: ans(c),
      hint: 'Look at the area that actually touches: thin edge or wide surface?',
      working: [`<b>Picture:</b> ${t.thing}.`, `1. The touching area is <b>${t.small ? 'tiny' : 'wide'}</b>.`, `2. pressure = force ÷ area, so the pressure is <b>${t.small ? 'big' : 'small'}</b>.`],
      finalAnswer: t.small ? 'A big pressure — small area' : 'A small pressure — big area', skill: 'pressure',
    };
  }
  function fluidPressureQ() {
    const q = R.pick([
      { p: 'Why does the water press harder on you the deeper you dive?', a: 'There is more water above you pressing down', w: ['The water gets heavier at the bottom', 'The water is colder down there', 'You get heavier as you sink'] },
      { p: 'What causes <b>air pressure</b>?', a: 'The weight of all the air above you pressing down', w: ['The wind blowing sideways', 'The Sun heating the ground', 'The spin of the Earth'] },
      { p: 'Where is air pressure lower: at the beach, or on top of Aoraki/Mount Cook?', a: 'On the mountain — there is less air above you', w: ['At the beach — the sea pushes the air away', 'They are exactly the same', 'On the mountain — the air is heavier there'] },
      { p: 'A dam wall is much thicker at the bottom than the top. Why?', a: 'Water pressure is greatest at the bottom', w: ['So it looks stronger', 'Water pressure is greatest at the top', 'To stop the water freezing'] },
      { p: 'Which way does water push on a diver?', a: 'From every direction at once', w: ['Only downwards', 'Only upwards', 'Only sideways'] },
      { p: 'Your ears hurt at the deep end of the pool. Why?', a: 'The water pressure is greater the deeper you go', w: ['The water is colder there', 'There is less oxygen down there', 'Sound travels faster in water'] },
      { p: 'A sealed empty bottle is carried down from a mountain to the beach and gets crushed. Why?', a: 'The air pressure outside is greater lower down', w: ['The bottle shrinks in the warm air', 'The air inside disappears', 'Gravity is stronger at the beach'] },
      { p: 'A submarine needs a very thick, strong hull. Why?', a: 'Deep water presses hard on it from all sides', w: ['To stop it floating away', 'To make it heavy enough to sink', 'To keep the crew warm'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Both air and water press because of the weight of the stuff above you — so deeper (or lower) means more pressure.',
      working: ['<b>Picture:</b> a stack of blankets — the bottom one feels all the ones above it.', 'Air and water pressure both come from the <b>weight of everything above</b>, and they push in <b>every direction</b>.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'fluids',
    };
  }
  function pulleyQ() {
    const q = R.pick([
      { p: 'What does a single <b>fixed pulley</b> do for you?', a: 'It changes the direction of your pull', w: ['It halves the weight of the load', 'It makes new energy', 'It makes the rope shorter'] },
      { p: 'You pull a rope DOWN over a fixed pulley. Which way does the load move?', a: 'Up', w: ['Down as well', 'Sideways', 'It does not move'] },
      { p: 'Why is pulling down easier than lifting up, even with the same force?', a: 'You can use your own weight to help pull down', w: ['Gravity works sideways on ropes', 'The force is smaller going down', 'Ropes only work downwards'] },
      { p: 'A crane uses several pulleys together. What does that do?', a: 'It cuts the force needed, but you must pull much more rope', w: ['It makes the load lighter', 'It creates extra energy', 'It makes the rope stronger'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: pulleySvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Follow the rope with your finger: down one side, over the wheel, up the other side.',
      working: ['<b>Picture:</b> hoisting a flag — you pull down, the flag goes up.', 'A single fixed pulley <b>changes the direction</b> of the force, not its size.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'machines',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Spread the load over a bigger area, so the pressure is lower', ['Make the tyres narrower to cut through', 'Make the tractor heavier', 'Make the tyres out of metal'], 4);
      return {
        prompt: 'A tractor on a soft muddy paddock has huge wide tyres. What is the point of that?',
        answer: ans(c),
        hint: 'pressure = force ÷ area. What has been made bigger?',
        working: [
          '<b>Picture:</b> snowshoes — the same person, spread out, does not sink.',
          '1. The tractor’s weight (force) does not change.',
          '2. The wide tyres give a much bigger <b>area</b>.',
          '3. pressure = force ÷ area, so the pressure goes <b>down</b> and it stays on top of the mud.',
        ],
        finalAnswer: 'The big area lowers the pressure, so it does not sink',
      };
    },
    () => {
      const { a, F, p } = pickPressure();
      return {
        prompt: `A crate pushes down with <b>${F} N</b> and its base covers <b>${a.l} m²</b> of the floor. What pressure does it put on the floor?`,
        answer: { type: 'number', value: p, unit: 'N/m²', placeholder: 'e.g. 500' },
        hint: 'Write the formula first: pressure = force ÷ area.',
        working: ['<b>Rule:</b> pressure = force ÷ area.', `Force = ${F} N, area = ${a.l} m².`, `${F} ÷ ${a.l} = <b>${p} N/m²</b>.`],
        finalAnswer: `${p} N/m²`,
      };
    },
    () => {
      const c = choice('Sharpening makes the edge area tiny, so the same push makes a much bigger pressure', ['Sharpening adds extra force to the knife', 'A sharp knife is heavier', 'Sharpening makes the food softer'], 4);
      return {
        prompt: 'Harper pushes just as hard with a blunt knife as a sharp one, but only the sharp one cuts the tomato. Why?',
        answer: ans(c),
        hint: 'The force is the same in both cases. What is different?',
        working: [
          '<b>Rule:</b> pressure = force ÷ area.',
          '1. Same push → the <b>force is the same</b>.',
          '2. The sharp blade touches a much <b>smaller area</b>.',
          '3. Smaller area with the same force = <b>much bigger pressure</b>, so it cuts.',
          'Sharpening does not add force — it concentrates it.',
        ],
        finalAnswer: 'Same force on a tiny area = much bigger pressure',
      };
    },
    () => {
      const it = R.pick(LEVER_ITEMS);
      const lc = LEVER_CLASSES.find((x) => x.cls === it.cls);
      const c = choice(`class ${it.cls}`, LEVER_CLASSES.map((x) => `class ${x.cls}`), 3);
      return {
        visual: leverSvg(it.cls, { title: it.item }),
        prompt: `Harper has to label <b>${it.item}</b> in her book as a class 1, 2 or 3 lever. Which is it?`,
        answer: ans(c),
        hint: 'Find the pivot first, then the load, then the effort. Which one is in the middle?',
        working: ['<b>Picture:</b> line the three parts up in order and look at the middle one.', `In ${it.item}, ${lc.say}.`, `Middle = ${lc.middle}, so it is <b>class ${it.cls}</b>.`],
        finalAnswer: `class ${it.cls}`,
      };
    },
    () => {
      const c = choice('Put the load close to the wheel and hold the handles far from it', ['Put the load right at the handles', 'Lift with the wheel off the ground', 'Make the handles shorter'], 4);
      return {
        visual: leverSvg(2, { title: 'a wheelbarrow (class 2)', caption: 'load in the middle: pivot — load — effort' }),
        prompt: 'A wheelbarrow is a class 2 lever. How should Harper load it so it is easiest to lift?',
        answer: ans(c),
        hint: 'The pivot is the wheel. Where should the load sit to need the least effort?',
        working: [
          '<b>Picture:</b> the wheel is the pivot, the soil is the load, your arms are the effort.',
          '1. Load close to the pivot = a short load arm.',
          '2. Effort far from the pivot = a long effort arm.',
          '3. Long effort arm + short load arm = <b>less force needed</b>.',
        ],
        finalAnswer: 'Load near the wheel, hands far from it',
      };
    },
    () => {
      const [t1, t2] = R.pick(GEAR_PAIRS);
      const k = R.int(1, 3);
      const turns = (t2 / t1) * k;
      return {
        visual: gearSvg(t1, t2, true),
        prompt: `On a machine, ${artN(t1)} ${t1}-tooth gear turns ${turns} times. Harper needs to know how many turns the ${t2}-tooth gear makes.`,
        answer: { type: 'number', value: k, unit: 'turns', placeholder: 'e.g. 2' },
        hint: 'The same number of teeth must pass the meeting point on both gears.',
        working: ['<b>Rule:</b> teeth × turns is the same for both gears.', `1. ${t1} × ${turns} = ${t1 * turns} teeth.`, `2. ${t1 * turns} ÷ ${t2} = <b>${k} turns</b>.`, 'The bigger gear goes round fewer times — slower, but stronger.'],
        finalAnswer: `${k} turns`,
      };
    },
    () => {
      const c = choice('No — the energy she puts in is the same, it is just spread over a longer push', ['Yes, the ramp creates extra energy', 'Yes, the box gets lighter on a ramp', 'No, because ramps do not help at all'], 4);
      return {
        prompt: 'Harper says: "The ramp gives me free energy because the box feels lighter." Is she right?',
        answer: ans(c),
        hint: 'Force × distance. If the force halves, what has to happen to the distance?',
        working: [
          '<b>Picture:</b> a machine is a swap shop, not a gift shop.',
          '1. Does the box weigh less on the ramp? No.',
          '2. Is the push smaller? Yes — but the trip is longer.',
          '3. Less force × more distance = <b>the same energy</b>.',
          'Machines make jobs easier, never free.',
        ],
        finalAnswer: 'No — less force, but a longer distance, so the same energy',
      };
    },
    () => {
      const c = choice('The pressure from the water is much greater at the bottom', ['The water is colder at the bottom', 'The dam looks better that way', 'The water pushes upwards at the top'], 4);
      return {
        prompt: 'The Benmore dam wall is thin at the top and very thick at the bottom. Explain why.',
        answer: ans(c),
        hint: 'Where is there most water sitting above?',
        working: [
          '<b>Picture:</b> a stack of blankets — the bottom one feels the weight of every blanket above.',
          '1. At the bottom of the lake there is much more water above.',
          '2. More weight above = more <b>pressure</b>.',
          '3. So the wall must be thickest where the pressure is greatest.',
        ],
        finalAnswer: 'Water pressure is greatest at the bottom, so the wall is thickest there',
      };
    },
    () => {
      const t = R.pick(PRESSURE_THINGS.filter((x) => !x.small));
      const c = choice(t.why, PRESSURE_THINGS.filter((x) => x.thing !== t.thing).map((x) => x.why));
      return {
        prompt: `In a science test Harper is asked: why do <b>${t.thing}</b> work? What should she write?`,
        answer: ans(c),
        hint: 'Say what happens to the AREA first, then what that does to the pressure.',
        working: ['<b>Rule:</b> pressure = force ÷ area.', '1. The area touching is <b>big</b>.', '2. Same force ÷ bigger area = <b>less pressure</b>.', `Answer: ${t.why}.`],
        finalAnswer: t.why,
      };
    },
    () => {
      const m = R.pick(MACHINES);
      const ex = R.pick(m.ex.split(', '));
      const c = choice(m.name, MACHINES.filter((x) => x.name !== m.name).map((x) => x.name));
      return {
        prompt: `Harper is making a poster of simple machines found in her kitchen and garage. Which machine should she label <b>${ex}</b> as?`,
        answer: ans(c),
        hint: `It works by being ${m.job}.`,
        working: [`<b>Picture:</b> ${m.pic}.`, `${cap(ex)} is ${m.job}.`, `So it is a <b>${m.name}</b>.`],
        finalAnswer: m.name,
      };
    },
    () => {
      const c = choice('The drawing pin — its tip has a far smaller area', ['Her thumb — it is bigger', 'They are exactly the same', 'Neither presses on anything'], 4);
      return {
        prompt: 'Harper pushes a drawing pin into a corkboard. Her thumb does not hurt but the pin goes straight in. Where is the pressure bigger — under her thumb, or under the pin point?',
        answer: ans(c),
        hint: 'The force through the thumb and through the point is the same. Compare the areas.',
        working: [
          '<b>Rule:</b> pressure = force ÷ area.',
          '1. Same force goes through both.',
          '2. Thumb: wide, flat area → small pressure → does not hurt.',
          '3. Pin tip: tiny area → <b>huge pressure</b> → it pierces the board.',
          'That is exactly why pins have a flat top and a sharp point.',
        ],
        finalAnswer: 'Under the pin point — a tiny area makes a huge pressure',
      };
    },
    () => {
      const c = choice('Anticlockwise — gears that touch turn opposite ways', ['Clockwise — they always match', 'It stays still', 'It turns both ways at once'], 4);
      const [t1, t2] = R.pick(GEAR_PAIRS);
      return {
        visual: gearSvg(t1, t2, false),
        prompt: 'Harper turns the pedal gear on a model clockwise. Which way does the gear it touches turn?',
        answer: ans(c),
        hint: 'Trace one tooth pushing the next: it shoves it the other way.',
        working: ['<b>Picture:</b> two hands pushing against each other — one goes forward, the other goes back.', 'Gears that mesh turn in <b>opposite</b> directions.', 'So the second gear goes <b>anticlockwise</b>.'],
        finalAnswer: 'Anticlockwise — the opposite way',
      };
    },
  ];

  HL.registerTopic({
    id: 'machines-pressure', subject: 'science', strand: 'physical', order: 9,
    name: 'Simple machines & pressure', short: 'Machines',  animal: 'crab',
    blurb: 'Levers, pulleys, ramps and gears — and why a sharp knife cuts but a snowshoe does not sink.',
    example: 'pressure = force ÷ area · 600 N ÷ 0.02 m² = 30 000 N/m²',
    learn: {
      what: '<p>A <b>simple machine</b> makes a job easier. It never makes energy — it just lets you use a <b>smaller force over a longer distance</b>. The six to know are the <b>lever</b>, <b>pulley</b>, <b>ramp</b>, <b>wheel and axle</b>, <b>gear</b>, <b>wedge</b> and <b>screw</b>.</p><p>A <b>lever</b> is a bar that turns on a <b>pivot</b>, with the <b>load</b> you want to move and the <b>effort</b> you put in. <b>Pressure</b> is a different idea: it is how hard a force presses on each bit of area — <b>pressure = force ÷ area</b>, measured in <b>N/m²</b> (pascals).</p><p><b>Picture for this topic:</b> a machine is a <b>swap shop</b> — you swap force for distance. And pressure is your weight standing on <b>one sharp heel</b> instead of a whole flat shoe.</p>',
      visual: conceptSvg(),
      facts: [
        'A machine <b>trades distance for force</b> — less force always means moving further. It never creates energy.',
        'Lever parts: <b>load</b> (the heavy thing), <b>effort</b> (your push), <b>pivot</b> (what it turns on).',
        'Lever classes by what is in the <b>middle</b>: <b>1 = pivot</b> (seesaw), <b>2 = load</b> (wheelbarrow), <b>3 = effort</b> (tweezers, your arm).',
        'A single fixed <b>pulley</b> changes the <b>direction</b> of your pull. Gears that touch turn <b>opposite ways</b>; small driving big = <b>slower but stronger</b>.',
        '<b>pressure = force ÷ area</b>, in <b>N/m²</b> (pascals, Pa).',
        '<b>Small area → big pressure</b> (knife, drawing pin). <b>Big area → small pressure</b> (snowshoes, tractor tyres).',
        'Air and water pressure come from the <b>weight of everything above</b>, and push in <b>every direction</b> — deeper water means more pressure.',
      ],
      steps: [
        'For a lever, find the <b>pivot</b> first (what does it turn on?), then the <b>load</b>, then the <b>effort</b>. Whichever is <b>in the middle</b> gives you the class: pivot = 1, load = 2, effort = 3.',
        'If a machine made the force smaller, immediately ask "<b>so what got bigger?</b>" — the answer is always the distance you move.',
        'For gears: touching gears go <b>opposite ways</b>. Count teeth to compare — the gear with more teeth turns more slowly and pushes harder.',
        'For pressure, write the formula first: <b>P = F ÷ A</b>. Put the force in newtons and the area in m², then divide.',
        'To change a pressure, change the <b>area</b>: make it sharp and thin to push in, make it wide and flat to stay on top.',
      ],
      examples: [
        {
          q: 'Name the three parts of this lever.',
          visual: leverSvg(1, { title: 'a seesaw (class 1)', caption: 'pivot in the middle: effort — pivot — load' }),
          working: [
            '<b>Picture:</b> a seesaw in the playground.',
            '1. What does it rock on? The <b>pivot</b> in the middle.',
            '2. What are you trying to move? The <b>load</b> on the far end.',
            '3. What do you push with? The <b>effort</b>.',
          ],
          a: 'Effort, pivot and load — with the pivot in the middle, so it is class 1',
        },
        {
          q: 'What class of lever is a wheelbarrow, and how do you know?',
          visual: leverSvg(2, { title: 'a wheelbarrow', caption: 'pivot (wheel) — load (soil) — effort (handles)' }),
          working: [
            '<b>Picture:</b> the wheel at the front, the soil in the tray, your hands at the back.',
            '1. Pivot = the wheel (at one end).',
            '2. Load = the soil (in the middle).',
            '3. Effort = your hands (at the other end).',
            'The <b>load is in the middle</b> → <b>class 2</b>.',
          ],
          a: 'Class 2 — the load is in the middle',
        },
        {
          q: 'Harper pulls the rope of a flagpole downwards. Which way does the flag go, and what has the pulley done?',
          visual: pulleySvg(),
          working: [
            '<b>Picture:</b> follow the rope with your finger — down one side, over the wheel, up the other.',
            '1. Pull down on the right side.',
            '2. The rope on the left side goes up.',
            'A single fixed pulley <b>changes the direction</b> of your force — it does not make it smaller.',
          ],
          a: 'The flag goes up; the pulley changed the direction of the pull',
        },
        {
          q: 'A 10-tooth gear turns clockwise 3 times. Which way does the 30-tooth gear turn, and how many times?',
          visual: gearSvg(10, 30, true),
          working: [
            '<b>Picture:</b> the small gear is the pedal, the big gear is the back wheel on a hill.',
            '1. Gears that touch turn <b>opposite ways</b> → anticlockwise.',
            '2. Teeth moved = 10 × 3 = 30 teeth.',
            '3. Turns of the big gear = 30 ÷ 30 = <b>1 turn</b>.',
            'Slower, but with more turning force.',
          ],
          a: 'Anticlockwise, 1 turn',
        },
        {
          q: 'A box pushes down with 600 N on an area of 2 m². What is the pressure?',
          working: ['<b>Rule:</b> pressure = force ÷ area.', '1. Force = 600 N, area = 2 m².', '2. 600 ÷ 2 = <b>300</b>.', 'Units: N/m² (also called pascals).'],
          a: '300 N/m²',
        },
        {
          q: 'The same person (600 N) stands first on a sharp heel of 0.001 m², then on a flat shoe of 0.01 m². Compare the pressures.',
          visual: pressureSvg(600, '0.001', 600000, '0.01', 60000),
          working: [
            '<b>Rule:</b> pressure = force ÷ area. The force is the same both times.',
            '1. Heel: 600 ÷ 0.001 = <b>600 000 N/m²</b>.',
            '2. Flat shoe: 600 ÷ 0.01 = <b>60 000 N/m²</b>.',
            '3. 600 000 ÷ 60 000 = <b>10 times</b> more pressure under the heel.',
            'Same person, same weight — just squeezed onto a tenth of the area.',
          ],
          a: 'The heel gives 10 times the pressure — 600 000 N/m² against 60 000 N/m²',
        },
        {
          q: 'Harper cannot lift a heavy box into the ute, but she can push it up a ramp. Explain what the ramp does — and what it does not do.',
          working: [
            '<b>Picture:</b> a machine is a swap shop, not a gift shop.',
            '1. Does the ramp make the box lighter? <b>No</b> — its weight is the same.',
            '2. Does she push with less force? <b>Yes</b>, because the slope is gentle.',
            '3. What is the trade? She has to push it a <b>longer distance</b>.',
            'Force × distance stays about the same, so the ramp gives no free energy.',
          ],
          a: 'It lets her use a smaller force over a longer distance — it does not create energy',
        },
      ],
      tips: [
        'Pressure is force <b>÷</b> area, never force × area. Check your answer: a smaller area should give a <b>bigger</b> number.',
        'Sharpening a knife adds no force at all. It shrinks the <b>area</b>, and that is what raises the pressure.',
        'The pivot is not always in the middle — in a wheelbarrow and in tweezers it is right at one end.',
        'Never say a machine "makes energy". It only changes how a force is applied.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [machineJob, machineFromExample, machineFromJob, leverPartMeaning, leverPart, bigOrSmallArea, pressureFormulaQ, gearDirection]
        : level === 2
          ? [machineFromExample, machineFromJob, leverPart, leverClassQ, leverExampleQ, pressureFormulaQ, pressureCalc, whyPressureQ, bigOrSmallArea, gearDirection, gearSpeed, pulleyQ, fluidPressureQ]
          : [leverClassQ, leverExampleQ, leverBalance, tradeOffQ, gearSpeed, gearCalc, pressureCalc, forceFromPressure, areaFromPressure, pressureCompare, whyPressureQ, fluidPressureQ, pulleyQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
