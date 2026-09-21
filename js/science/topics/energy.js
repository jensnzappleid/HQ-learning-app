/* Topic: Energy — the forms, transfer chains, conservation, useful vs wasted, efficiency. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const FORMS = [
    { name: 'kinetic', desc: 'the energy of anything that is moving', pic: 'a netball flying through the air' },
    { name: 'gravitational potential', desc: 'the energy something has because it is high up', pic: 'a book on the top shelf' },
    { name: 'elastic', desc: 'the energy stored in something stretched or squashed', pic: 'a stretched rubber band' },
    { name: 'chemical', desc: 'the energy stored in food, fuel and batteries', pic: 'a muesli bar' },
    { name: 'thermal', desc: 'the energy in something hot', pic: 'a cup of hot Milo' },
    { name: 'light', desc: 'the energy that comes out of the sun, a lamp or a screen', pic: 'a torch beam' },
    { name: 'sound', desc: 'the energy carried by vibrations you can hear', pic: 'a speaker thumping' },
    { name: 'electrical', desc: 'the energy carried along wires by a current', pic: 'the wire to the kettle' },
    { name: 'nuclear', desc: 'the energy locked inside the nucleus of atoms', pic: 'uranium fuel rods' },
  ];
  const NAMES = FORMS.map((f) => f.name);

  const STORES = [
    { item: 'a netball flying towards the goal', form: 'kinetic' },
    { item: 'the wind blowing across Cook Strait', form: 'kinetic' },
    { item: 'a kererū flying past', form: 'kinetic' },
    { item: 'a book on the top shelf', form: 'gravitational potential' },
    { item: 'a skier waiting at the top of the run', form: 'gravitational potential' },
    { item: 'the water held back behind a dam wall', form: 'gravitational potential' },
    { item: 'a stretched rubber band', form: 'elastic' },
    { item: 'a squashed spring', form: 'elastic' },
    { item: 'a bow pulled right back', form: 'elastic' },
    { item: 'a chocolate bar', form: 'chemical' },
    { item: 'petrol in the tank of a car', form: 'chemical' },
    { item: 'a fresh AA battery', form: 'chemical' },
    { item: 'a bowl of porridge', form: 'chemical' },
    { item: 'a cup of hot tea', form: 'thermal' },
    { item: 'a bubbling mud pool at Rotorua', form: 'thermal' },
    { item: 'uranium fuel rods in a reactor', form: 'nuclear' },
  ];

  const CHAINS = [
    { thing: 'a torch that is switched on', chain: ['chemical', 'electrical', 'light'] },
    { thing: 'a hydro power station at Lake Taupō', chain: ['gravitational potential', 'kinetic', 'electrical'] },
    { thing: 'a petrol car engine', chain: ['chemical', 'thermal', 'kinetic'] },
    { thing: 'a phone playing a song', chain: ['chemical', 'electrical', 'sound'] },
    { thing: 'a solar panel charging a battery', chain: ['light', 'electrical', 'chemical'] },
    { thing: 'a bungy cord flinging a jumper back up', chain: ['elastic', 'kinetic', 'gravitational potential'] },
    { thing: 'a nuclear power station', chain: ['nuclear', 'thermal', 'electrical'] },
    { thing: 'the Wairākei geothermal station', chain: ['thermal', 'kinetic', 'electrical'] },
    { thing: 'an electric kettle boiling water', chain: ['electrical', 'thermal'] },
    { thing: 'a wind turbine', chain: ['kinetic', 'electrical'] },
    { thing: 'Harper pedalling her bike', chain: ['chemical', 'kinetic'] },
    { thing: 'a catapult firing a marble', chain: ['elastic', 'kinetic'] },
    { thing: 'a ball falling off a wall', chain: ['gravitational potential', 'kinetic'] },
    { thing: 'a speaker playing music', chain: ['electrical', 'sound'] },
    { thing: 'a candle burning', chain: ['chemical', 'thermal'] },
    { thing: 'a gas burner under a hot air balloon', chain: ['chemical', 'thermal'] },
  ];

  const DEVICES = [
    { name: 'a light bulb', useful: 'light', wasted: 'thermal' },
    { name: 'a torch', useful: 'light', wasted: 'thermal' },
    { name: 'a television', useful: 'light', wasted: 'thermal' },
    { name: 'a car engine', useful: 'kinetic', wasted: 'thermal' },
    { name: 'an electric drill', useful: 'kinetic', wasted: 'sound' },
    { name: 'a food mixer', useful: 'kinetic', wasted: 'sound' },
    { name: 'a phone speaker', useful: 'sound', wasted: 'thermal' },
    { name: 'an electric heater', useful: 'thermal', wasted: 'light' },
    { name: 'a laptop', useful: 'light', wasted: 'thermal' },
    { name: 'a washing machine', useful: 'kinetic', wasted: 'sound' },
  ];

  const TOTALS = [100, 200, 400, 500, 1000, 2000];
  const PCTS = [10, 20, 25, 40, 50, 60, 75, 80, 90];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- diagrams ---------- */
  function chainSvg(chain, blankIndex, title) {
    const n = chain.length;
    const W = 336, boxW = n === 2 ? 116 : 96, gap = n === 2 ? 44 : 22;
    const total = n * boxW + (n - 1) * gap;
    const x0 = (W - total) / 2;
    let s = '';
    chain.forEach((c, i) => {
      const x = x0 + i * (boxW + gap);
      const blank = i === blankIndex;
      s += `<rect x="${x}" y="46" width="${boxW}" height="56" rx="10" fill="${blank ? '#FFFFFF' : '#FBF1D3'}" stroke="${blank ? '#E0568C' : '#E8C24A'}" stroke-width="3" ${blank ? 'stroke-dasharray="6 4"' : ''}/>`;
      const words = blank ? ['?'] : c.split(' ');
      const fs = blank ? 22 : (words.length > 1 ? 11 : 12);
      words.forEach((w, k) => {
        s += `<text x="${x + boxW / 2}" y="${74 + (k - (words.length - 1) / 2) * 14 + (blank ? 6 : 0)}" text-anchor="middle" fill="${blank ? '#E0568C' : INK}" font-size="${fs}">${w}</text>`;
      });
      if (!blank) s += `<text x="${x + boxW / 2}" y="${116}" text-anchor="middle" fill="#9A6A0F" font-size="10">energy</text>`;
      if (i < n - 1) {
        const ax = x + boxW + 3, bx = x + boxW + gap - 3;
        s += `<line x1="${ax}" y1="74" x2="${bx - 8}" y2="74" stroke="#5F98C4" stroke-width="4" stroke-linecap="round"/><polygon points="${bx},74 ${bx - 10},69 ${bx - 10},79" fill="#5F98C4"/>`;
      }
    });
    return `<svg viewBox="0 0 336 148" width="336" height="148" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="168" y="24" text-anchor="middle" fill="${INK}" font-size="12.5">${title || ''}</text>${s}</svg>`;
  }

  function sankeySvg(total, useful, usefulName, wastedName) {
    const H = 66, hu = Math.max(8, Math.round(H * useful / total)), hw = H - hu;
    const yTop = 34, yUse = yTop + hu, yBot = yTop + H;
    return `<svg viewBox="0 0 350 180" width="350" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
      <rect x="12" y="${yTop}" width="96" height="${H}" rx="3" fill="#B9A5E6" stroke="#8E79C6" stroke-width="2"/>
      <text x="60" y="24" text-anchor="middle" fill="#6B57A3" font-size="11.5">energy in ${total} J</text>
      <polygon points="108,${yTop} 232,${yTop} 232,${yUse} 108,${yUse}" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
      <polygon points="108,${yUse} 232,${yUse + 46} 232,${yBot + 46} 108,${yBot}" fill="#E9A07A" stroke="#D07C50" stroke-width="2"/>
      <text x="238" y="${yTop + hu / 2 + 2}" fill="#4E7A34" font-size="11">useful ${useful} J</text>
      <text x="346" y="${yTop + hu / 2 + 16}" text-anchor="end" fill="#4E7A34" font-size="9.5">(${usefulName})</text>
      <text x="238" y="${yUse + 46 + hw / 2}" fill="#B0653A" font-size="11">wasted ${total - useful} J</text>
      <text x="346" y="${yUse + 46 + hw / 2 + 14}" text-anchor="end" fill="#B0653A" font-size="9.5">(${wastedName})</text>
      <text x="175" y="172" text-anchor="middle" fill="${INK}" font-size="11">energy in = useful out + wasted out</text>
    </svg>`;
  }

  const dataTable = (rows) => `<table class="data"><tr><th>device</th><th>energy in</th><th>useful out</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]} J</td><td>${r[2]} J</td></tr>`).join('')}</table>`;

  /* ---------- question makers ---------- */
  function formFromDesc() {
    const f = R.pick(FORMS);
    const c = choice(f.name, NAMES);
    return {
      prompt: `Which form of energy is <b>${f.desc}</b>?`,
      answer: ans(c),
      hint: `Think of ${f.pic}.`,
      working: [`<b>Picture:</b> ${f.pic}.`, `That is <b>${f.name} energy</b>: ${f.desc}.`],
      finalAnswer: `${f.name} energy`, skill: 'forms',
    };
  }
  function storeQ() {
    const s = R.pick(STORES);
    const c = choice(s.form, NAMES);
    return {
      prompt: `What energy is stored in <b>${s.item}</b>?`,
      answer: ans(c),
      hint: 'Is it moving, is it high up, is it stretched, is it food/fuel, or is it hot?',
      working: [
        '<b>Picture:</b> ask the four questions — moving? high up? stretched? fuel or food?',
        `1. ${cap(s.item)} → ${s.form === 'kinetic' ? 'it is moving' : s.form === 'gravitational potential' ? 'it is high up' : s.form === 'elastic' ? 'it is stretched or squashed' : s.form === 'chemical' ? 'it is food, fuel or a battery' : s.form === 'thermal' ? 'it is hot' : 'it is nuclear fuel'}.`,
        `So it stores <b>${s.form} energy</b>.`,
      ],
      finalAnswer: `${s.form} energy`, skill: 'forms',
    };
  }
  function chainBlank(level) {
    const ch = R.pick(level === 1 ? CHAINS.filter((c) => c.chain.length === 2) : CHAINS);
    const i = ch.chain.length === 2 ? R.int(0, 1) : R.int(0, 2);
    const shown = ch.chain.map((c, k) => (k === i ? '<b>?</b>' : c)).join(' → ');
    const c = choice(ch.chain[i], NAMES);
    return {
      visual: chainSvg(ch.chain, i, ch.thing),
      prompt: `Fill the gap in the energy chain for <b>${ch.thing}</b>:<br>${shown}`,
      answer: ans(c),
      hint: 'Follow the story: where does the energy start, and what does it end up as?',
      working: [
        `<b>Picture:</b> ${ch.thing}.`,
        `The full chain is: <b>${ch.chain.join(' → ')}</b>.`,
        `So the gap is <b>${ch.chain[i]} energy</b>.`,
      ],
      finalAnswer: `${ch.chain[i]} energy`, skill: 'chains',
    };
  }
  function chainStart() {
    const ch = R.pick(CHAINS);
    const wantEnd = R.chance(0.5);
    const want = wantEnd ? ch.chain[ch.chain.length - 1] : ch.chain[0];
    const c = choice(want, NAMES);
    return {
      visual: chainSvg(ch.chain, -1, ch.thing),
      prompt: `In ${ch.thing}, which form of energy does the chain <b>${wantEnd ? 'end' : 'start'}</b> with?`,
      answer: ans(c),
      hint: wantEnd ? 'Look at the last box in the chain — what do you actually get out?' : 'Look at the first box — where was the energy stored before anything happened?',
      working: [`<b>Chain:</b> ${ch.chain.join(' → ')}.`, `The ${wantEnd ? 'last' : 'first'} one is <b>${want} energy</b>.`],
      finalAnswer: `${want} energy`, skill: 'chains',
    };
  }
  function usefulWasted() {
    const d = R.pick(DEVICES);
    const askUseful = R.chance(0.5);
    const want = askUseful ? d.useful : d.wasted;
    const c = choice(want, NAMES);
    return {
      prompt: `In <b>${d.name}</b>, which energy is the <b>${askUseful ? 'useful' : 'wasted'}</b> one?`,
      answer: ans(c),
      hint: askUseful ? 'Useful = the reason you switched it on.' : 'Wasted = the energy you did not want. It is nearly always heat or sound.',
      working: [
        `<b>Picture:</b> why do you switch ${d.name} on? For the <b>${d.useful}</b>.`,
        `Everything else escapes — here that is <b>${d.wasted}</b> energy.`,
        `So the ${askUseful ? 'useful' : 'wasted'} energy is <b>${want}</b>.`,
      ],
      finalAnswer: `${want} energy`, skill: 'useful',
    };
  }
  function conservationQ() {
    const q = R.pick([
      { p: 'What does the <b>law of conservation of energy</b> say?', a: 'Energy is never made or destroyed — it is only transferred', w: ['Energy is used up and disappears', 'Energy can be made from nothing', 'Energy always turns into light'] },
      { p: 'A light bulb "loses" energy as heat. Where has that energy really gone?', a: 'Into the air around it as thermal energy', w: ['It has been destroyed', 'It has disappeared into the wire', 'It has turned back into electricity'] },
      { p: 'What is energy measured in?', a: 'joules (J)', w: ['newtons (N)', 'watts per second', 'kilograms (kg)'] },
      { p: 'Can you create brand new energy?', a: 'No — you can only transfer energy that is already there', w: ['Yes, a battery makes new energy', 'Yes, the sun makes new energy', 'Yes, if you use a generator'] },
      { p: 'A phone battery goes flat. What has happened to the energy?', a: 'It has been transferred to light, sound and heat', w: ['It has been destroyed', 'It leaked out of the case', 'It turned into mass'] },
      { p: 'In every energy transfer, some energy is wasted. What is it usually wasted as?', a: 'heat (and sometimes sound)', w: ['light', 'chemical energy', 'nuclear energy'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Energy never vanishes. It just spreads out, usually as heat.',
      working: ['<b>Picture:</b> energy is like pocket money — you can spend it or move it, but you cannot make it appear from nothing.', '<b>Energy is never made or destroyed, only transferred.</b>', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'conservation',
    };
  }
  function wastedCalc() {
    const total = R.pick(TOTALS), pct = R.pick(PCTS);
    const useful = total * pct / 100;
    const d = R.pick(DEVICES);
    return {
      visual: sankeySvg(total, useful, d.useful, d.wasted),
      prompt: `${cap(d.name)} takes in <b>${total} J</b> of energy and gives out <b>${useful} J</b> of useful ${d.useful} energy. How much energy is <b>wasted</b>?`,
      answer: { type: 'number', value: total - useful, unit: 'J', placeholder: 'e.g. 400' },
      hint: 'Energy in = useful out + wasted out. Nothing disappears.',
      working: ['<b>Rule:</b> energy in = useful out + wasted out.', `${total} − ${useful} = <b>${total - useful} J</b>.`, `That ${total - useful} J escapes as ${d.wasted} energy — it is not destroyed.`],
      finalAnswer: `${total - useful} J`, skill: 'efficiency',
    };
  }
  function efficiencyCalc() {
    const total = R.pick(TOTALS), pct = R.pick(PCTS);
    const useful = total * pct / 100;
    const d = R.pick(DEVICES);
    return {
      visual: sankeySvg(total, useful, d.useful, d.wasted),
      prompt: `${cap(d.name)} is given <b>${total} J</b> and turns <b>${useful} J</b> of it into useful ${d.useful} energy. What percentage of the energy is useful?`,
      answer: { type: 'number', value: pct, unit: '%', placeholder: 'e.g. 25' },
      hint: 'Useful ÷ total, then × 100 to make it a percentage.',
      working: ['<b>Rule:</b> percentage useful = useful ÷ total × 100.', `${useful} ÷ ${total} = ${useful / total}.`, `${useful / total} × 100 = <b>${pct}%</b>.`, `The other ${100 - pct}% is wasted as ${d.wasted} energy.`],
      finalAnswer: `${pct}%`, skill: 'efficiency',
    };
  }
  function usefulFromPct() {
    const total = R.pick(TOTALS), pct = R.pick(PCTS);
    const d = R.pick(DEVICES);
    return {
      prompt: `${cap(d.name)} takes in <b>${total} J</b> and <b>${pct}%</b> of that becomes useful ${d.useful} energy. How many joules are useful?`,
      answer: { type: 'number', value: total * pct / 100, unit: 'J', placeholder: 'e.g. 250' },
      hint: 'Find the percentage of the total: divide by 100, then multiply by the percentage.',
      working: [`<b>Rule:</b> ${pct}% of ${total} = ${total} ÷ 100 × ${pct}.`, `${total} ÷ 100 = ${total / 100}.`, `${total / 100} × ${pct} = <b>${total * pct / 100} J</b>.`],
      finalAnswer: `${total * pct / 100} J`, skill: 'efficiency',
    };
  }
  function sankeyRead() {
    const total = R.pick(TOTALS), pct = R.pick([20, 25, 40, 50, 60, 75, 80]);
    const useful = total * pct / 100;
    const d = R.pick(DEVICES);
    const c = choice(`${total - useful} J is wasted as ${d.wasted} energy`, [`${useful} J is wasted as ${d.wasted} energy`, `${total} J is wasted`, 'No energy is wasted'], 4);
    return {
      visual: sankeySvg(total, useful, d.useful, d.wasted),
      prompt: `This energy diagram is for ${d.name}. What does the lower (orange) arrow tell you?`,
      answer: ans(c),
      hint: 'The thick arrow going in splits into the useful part and the wasted part.',
      working: [
        '<b>Picture:</b> the energy in splits like a river — one branch is useful, one is wasted.',
        `Energy in = ${total} J, useful = ${useful} J.`,
        `${total} − ${useful} = <b>${total - useful} J wasted as ${d.wasted} energy</b>.`,
      ],
      finalAnswer: `${total - useful} J wasted as ${d.wasted} energy`, skill: 'efficiency',
    };
  }
  function nzEnergy() {
    const q = R.pick([
      { p: 'Where does most of New Zealand\'s electricity come from?', a: 'Hydro (falling water)', w: ['Coal', 'Nuclear power', 'Petrol'] },
      { p: 'In a hydro dam, what energy does the water have while it is still held up behind the wall?', a: 'gravitational potential', w: ['kinetic', 'electrical', 'chemical'] },
      { p: 'What kind of energy does the steam at Wairākei geothermal station start as?', a: 'thermal', w: ['chemical', 'nuclear', 'elastic'] },
      { p: 'A wind turbine transfers the energy of moving air into electricity. What is the energy of moving air called?', a: 'kinetic', w: ['thermal', 'elastic', 'chemical'] },
      { p: 'Solar panels on a roof transfer which energy into electrical energy?', a: 'light', w: ['sound', 'chemical', 'nuclear'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Aotearoa uses a lot of falling water, steam from underground, and wind.',
      working: ['<b>Picture:</b> water high in the lake → rushing down the pipe → spinning the turbine → electricity.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'nz',
    };
  }
  function transferMoment() {
    const q = R.pick([
      { p: 'A ball is at the <b>top</b> of its throw. Which store is at its biggest?', a: 'gravitational potential', w: ['kinetic', 'elastic', 'chemical'] },
      { p: 'A ball is falling fast, just before it hits the ground. Which store is at its biggest?', a: 'kinetic', w: ['gravitational potential', 'elastic', 'nuclear'] },
      { p: 'A swing is at the very bottom of its swing. Which store is at its biggest?', a: 'kinetic', w: ['gravitational potential', 'elastic', 'chemical'] },
      { p: 'A bungy cord is stretched as far as it will go. Which store is at its biggest?', a: 'elastic', w: ['kinetic', 'chemical', 'thermal'] },
      { p: 'A skateboarder is stopped at the very top of the ramp. Which store is at its biggest?', a: 'gravitational potential', w: ['kinetic', 'sound', 'elastic'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'High up → gravitational potential. Moving fast → kinetic. Stretched → elastic.',
      working: ['<b>Picture:</b> height turns into speed on the way down, and speed turns back into height on the way up.', `At that moment the biggest store is <b>${q.a} energy</b>.`],
      finalAnswer: `${q.a} energy`, skill: 'forms',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const ch = CHAINS[1];
      const c = choice('gravitational potential → kinetic → electrical', ['kinetic → gravitational potential → electrical', 'chemical → kinetic → electrical', 'electrical → kinetic → light'], 4);
      return {
        visual: chainSvg(ch.chain, -1, 'a hydro station on the Waikato River'),
        prompt: 'Most of New Zealand\'s electricity is made by hydro dams. What is the energy chain, from the lake at the top to the wires?',
        answer: ans(c),
        hint: 'Start with the water sitting high up behind the dam.',
        working: [
          '<b>Picture:</b> the lake is high up → the water rushes down the pipe → it spins a turbine → the generator makes electricity.',
          '1. Held up high = <b>gravitational potential</b>.',
          '2. Rushing down = <b>kinetic</b>.',
          '3. Out of the generator = <b>electrical</b>.',
        ],
        finalAnswer: 'gravitational potential → kinetic → electrical',
      };
    },
    () => {
      const c = choice('The kinetic energy is transferred to heat in the brakes', ['The kinetic energy is destroyed', 'The bike gains chemical energy', 'The energy turns into extra mass'], 4);
      return {
        prompt: 'Harper brakes hard on her bike and the brake blocks feel hot afterwards. What has happened to the energy?',
        answer: ans(c),
        hint: 'Energy is never destroyed. Where did the movement energy end up?',
        working: [
          '<b>Picture:</b> rubbing your hands together to warm them — movement becomes heat.',
          '1. Before: the bike has <b>kinetic</b> energy.',
          '2. Friction in the brakes turns it into <b>thermal</b> energy.',
          'Nothing was destroyed — it moved into the brakes and the air.',
        ],
        finalAnswer: 'It was transferred to thermal (heat) energy in the brakes',
      };
    },
    () => {
      const total = R.pick([100, 200, 500, 1000]), pct = R.pick([20, 25, 40, 60]);
      const useful = total * pct / 100;
      return {
        visual: sankeySvg(total, useful, 'light', 'thermal'),
        prompt: `An old light bulb takes in ${total} J of electrical energy each second and gives out ${useful} J of light. How much is wasted as heat, and what percentage is useful?`,
        answer: { type: 'number', value: total - useful, unit: 'J wasted', placeholder: 'e.g. 800' },
        hint: 'Wasted = total − useful. (Then useful ÷ total × 100 gives the percentage.)',
        working: [
          '<b>Rule:</b> energy in = useful out + wasted out.',
          `Wasted = ${total} − ${useful} = <b>${total - useful} J</b>.`,
          `Useful = ${useful} ÷ ${total} × 100 = ${pct}%.`,
          'That is why old bulbs get so hot — most of the energy never becomes light.',
        ],
        finalAnswer: `${total - useful} J wasted (${pct}% useful)`,
      };
    },
    () => {
      const rows = [['bulb A', 100, R.pick([10, 15, 20])], ['bulb B', 100, R.pick([60, 70, 80])]];
      const best = rows[1][2] > rows[0][2] ? 'bulb B' : 'bulb A';
      const c = choice(`${best}, because more of its energy comes out as light`, ['Bulb A, because it uses less energy', 'They are the same', 'Bulb A, because it gets hotter'], 4);
      return {
        visual: dataTable(rows),
        prompt: 'Two bulbs are tested with the same energy in. Which one is more efficient, and why?',
        answer: ans(c),
        hint: 'Compare how much of the same 100 J actually turns into light.',
        working: [
          '<b>Picture:</b> both bulbs are given the same pocket money — which one spends more of it on the thing you wanted?',
          `1. Bulb A: ${rows[0][2]} J of light out of 100 J → ${rows[0][2]}% useful.`,
          `2. Bulb B: ${rows[1][2]} J of light out of 100 J → ${rows[1][2]}% useful.`,
          `So <b>${best}</b> is more efficient; the rest is wasted as heat.`,
        ],
        finalAnswer: `${best} — more of its energy becomes light`,
      };
    },
    () => {
      const c = choice('Energy is being wasted as heat', ['The phone is making new energy', 'The battery is leaking', 'Heat is the useful energy'], 4);
      return {
        prompt: 'Harper\'s phone gets warm while she watches a video. Why?',
        answer: ans(c),
        hint: 'Was heat the reason she picked up the phone?',
        working: ['<b>Picture:</b> you wanted light and sound, but heat came out too.', '1. Useful energy: light (screen) and sound (speaker).', '2. Heat was not wanted → it is <b>wasted energy</b>.', 'No device transfers 100% of its energy usefully.'],
        finalAnswer: 'Some energy is wasted as heat',
      };
    },
    () => {
      const c = choice('gravitational potential → kinetic → sound and thermal', ['kinetic → gravitational potential → light', 'chemical → elastic → kinetic', 'electrical → kinetic → sound'], 4);
      return {
        prompt: 'A ball is dropped and bounces, but each bounce is lower than the last. What is the energy chain, and why does it get lower?',
        answer: ans(c),
        hint: 'Listen to the bounce — what escapes each time?',
        working: [
          '<b>Picture:</b> some energy leaks away on every bounce.',
          '1. Held up: <b>gravitational potential</b>.',
          '2. Falling: <b>kinetic</b>.',
          '3. At each bounce a bit becomes <b>sound</b> and <b>heat</b>, so less is left to go back up.',
          'Nothing is destroyed — it has just spread out.',
        ],
        finalAnswer: 'gravitational potential → kinetic → sound and thermal',
      };
    },
    () => {
      const ch = R.pick(CHAINS);
      const c = choice(ch.chain.join(' → '), R.sample(CHAINS.filter((x) => x.thing !== ch.thing), 3).map((x) => x.chain.join(' → ')), 4);
      return {
        prompt: `Harper has to write the energy chain for <b>${ch.thing}</b> in her book. Which one is right?`,
        answer: ans(c),
        hint: 'Say the story out loud: where the energy is stored first, then what it becomes.',
        working: [`<b>Picture:</b> ${ch.thing}.`, `The energy starts as <b>${ch.chain[0]}</b> and finishes as <b>${ch.chain[ch.chain.length - 1]}</b>.`, `Full chain: <b>${ch.chain.join(' → ')}</b>.`],
        finalAnswer: ch.chain.join(' → '),
      };
    },
    () => {
      const c = choice('Put a lid on the pot', ['Use a bigger element', 'Fill the pot right up', 'Take the lid off so steam escapes'], 4);
      return {
        prompt: 'Harper boils water for pasta. Which change would waste the LEAST energy?',
        answer: ans(c),
        hint: 'Where does the heat escape to?',
        working: ['<b>Picture:</b> heat escaping with the steam is energy you paid for and did not use.', '1. A lid keeps the hot steam in the pot.', '2. Less heat escapes, so more of the energy heats the water.', 'Answer: <b>put a lid on the pot</b>.'],
        finalAnswer: 'Put a lid on the pot',
      };
    },
    () => {
      const s = R.pick(STORES);
      const c = choice(s.form, NAMES, 4);
      return {
        prompt: `Harper is making an energy poster. She draws <b>${s.item}</b>. Which store should she label it with?`,
        answer: ans(c),
        hint: 'Moving? High up? Stretched? Food, fuel or battery? Hot?',
        working: [`<b>Picture:</b> ${s.item}.`, `That is a store of <b>${s.form} energy</b>.`],
        finalAnswer: `${s.form} energy`,
      };
    },
    () => {
      const c = choice('Every transfer wastes some energy as heat', ['Energy is destroyed each time', 'Machines are badly made', 'Energy is created in the wires'], 4);
      return {
        prompt: 'No machine ever gives out as much useful energy as it takes in. Why not?',
        answer: ans(c),
        hint: 'Think about friction, warm wires and noise.',
        working: ['<b>Picture:</b> every time energy moves house, a bit escapes as heat.', '1. Moving parts rub → heat. Wires carry current → heat. Parts vibrate → sound.', '2. That energy still exists, but it has spread into the surroundings.', 'So <b>every transfer wastes some energy as heat</b>.'],
        finalAnswer: 'Every transfer wastes some energy, usually as heat',
      };
    },
    () => {
      const total = R.pick([200, 400, 500, 1000]);
      const pct = R.pick([25, 40, 50, 75]);
      return {
        prompt: `A food mixer is given ${total} J of electrical energy and ${pct}% of it becomes useful movement. How many joules are wasted as heat and sound?`,
        answer: { type: 'number', value: total - total * pct / 100, unit: 'J', placeholder: 'e.g. 300' },
        hint: 'Find the useful joules first, then take them off the total.',
        working: [
          `<b>Step 1:</b> useful = ${pct}% of ${total} = ${total} ÷ 100 × ${pct} = ${total * pct / 100} J.`,
          `<b>Step 2:</b> wasted = ${total} − ${total * pct / 100} = <b>${total - total * pct / 100} J</b>.`,
          'Energy in = useful + wasted, always.',
        ],
        finalAnswer: `${total - total * pct / 100} J`,
      };
    },
  ];

  HL.registerTopic({
    id: 'energy', subject: 'science', strand: 'physical', order: 3,
    name: 'Energy', short: 'Energy', animal: 'bee',
    blurb: 'The nine forms of energy, how it moves from one to the next, and why some always gets wasted.',
    example: 'torch: chemical → electrical → light',
    learn: {
      what: '<p><b>Energy</b> is what makes things happen — it is measured in <b>joules (J)</b>. It comes in different forms, and it is always being <b>transferred</b> from one form to another. Writing that out with arrows gives you an <b>energy chain</b>, like <i>chemical → electrical → light</i> for a torch.</p><p>The big rule is that energy is <b>never made and never destroyed</b>: it only moves. Some of it always ends up somewhere you did not want it (usually as <b>heat</b>) — that is the <b>wasted</b> energy.</p><p><b>Picture for this topic:</b> energy is <b>pocket money</b>. You cannot magic up more of it; you can only move it from one pocket to another, and a few coins always roll away as heat.</p>',
      visual: `<svg viewBox="0 0 350 210" width="350" height="210" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
        <text x="175" y="18" text-anchor="middle" fill="#4A4033" font-size="12.5">a torch: the energy chain</text>
        ${[['chemical', '#B9A5E6', '#8E79C6'], ['electrical', '#A9D8F5', '#5F98C4'], ['light', '#E8C24A', '#C98A1C']].map((f, i) => {
          const x = 16 + i * 116;
          return `<rect x="${x}" y="30" width="98" height="52" rx="10" fill="${f[1]}" stroke="${f[2]}" stroke-width="2.5"/>
            <text x="${x + 49}" y="54" text-anchor="middle" fill="#4A4033" font-size="12">${f[0]}</text>
            <text x="${x + 49}" y="70" text-anchor="middle" fill="#4A4033" font-size="10">energy</text>
            ${i < 2 ? `<line x1="${x + 100}" y1="56" x2="${x + 108}" y2="56" stroke="#4A4033" stroke-width="4"/><polygon points="${x + 116},56 ${x + 106},51 ${x + 106},61" fill="#4A4033"/>` : ''}`;
        }).join('')}
        <text x="65" y="98" text-anchor="middle" fill="#6B57A3" font-size="10">battery</text>
        <text x="181" y="98" text-anchor="middle" fill="#3C6E96" font-size="10">wire</text>
        <text x="297" y="98" text-anchor="middle" fill="#9A6A0F" font-size="10">bulb (useful!)</text>
        <rect x="14" y="112" width="322" height="44" rx="10" fill="#F3EFE6" stroke="#D9CFBE" stroke-width="2"/>
        <rect x="20" y="120" width="200" height="28" rx="6" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
        <rect x="220" y="120" width="110" height="28" rx="6" fill="#E9A07A" stroke="#D07C50" stroke-width="2"/>
        <text x="120" y="138" text-anchor="middle" fill="#3F6A26" font-size="11">useful energy (light)</text>
        <text x="275" y="138" text-anchor="middle" fill="#8C4E24" font-size="11">wasted (heat)</text>
        <text x="175" y="176" text-anchor="middle" fill="#4A4033" font-size="12.5">energy in = useful out + wasted out</text>
        <text x="175" y="196" text-anchor="middle" fill="#C33C72" font-size="11.5">energy is never made or destroyed, only transferred</text>
      </svg>`,
      facts: [
        'Energy is measured in <b>joules (J)</b>.',
        'The stores: <b>kinetic</b> (moving), <b>gravitational potential</b> (high up), <b>elastic</b> (stretched), <b>chemical</b> (food, fuel, batteries), <b>thermal</b> (hot), <b>light</b>, <b>sound</b>, <b>electrical</b>, <b>nuclear</b>.',
        'An <b>energy chain</b> is written with arrows: chemical → electrical → light.',
        '<b>Energy is never made or destroyed — only transferred.</b>',
        '<b>Energy in = useful energy out + wasted energy out.</b> Wasted energy is nearly always <b>heat</b>.',
        'Most of Aotearoa\'s electricity is <b>hydro</b>: gravitational potential → kinetic → electrical.',
      ],
      steps: [
        'Name the store you start with. Ask: is it <b>moving</b> (kinetic), <b>high up</b> (gravitational potential), <b>stretched</b> (elastic), or is it <b>food, fuel or a battery</b> (chemical)?',
        'Follow the story step by step and write each form with an arrow between: <b>start → middle → end</b>.',
        'Ask "<b>why did I switch it on?</b>" — that answer is the <b>useful</b> energy. Everything else is <b>wasted</b>, usually heat and sound.',
        'For numbers: <b>wasted = energy in − useful out</b>, and <b>percentage useful = useful ÷ total × 100</b>.',
        'Never say energy is "used up" or "lost". Say where it <b>went</b>.',
      ],
      examples: [
        {
          q: 'What energy is stored in a stretched rubber band?',
          working: ['<b>Picture:</b> pull it back and it is straining to snap forward.', '1. Is it moving? No. High up? No. Stretched? Yes!', 'Stretched or squashed = <b>elastic</b> energy.'],
          a: 'Elastic energy',
        },
        {
          q: 'Write the energy chain for a torch being switched on.',
          visual: chainSvg(['chemical', 'electrical', 'light'], -1, 'a torch'),
          working: ['<b>Picture:</b> battery → wire → bulb.', '1. Where does the energy sit before you press the switch? In the battery = <b>chemical</b>.', '2. What travels down the wire? <b>Electrical</b>.', '3. What comes out of the bulb? <b>Light</b>.'],
          a: 'chemical → electrical → light',
        },
        {
          q: 'Write the energy chain for a hydro dam on the Waikato River.',
          visual: chainSvg(['gravitational potential', 'kinetic', 'electrical'], -1, 'a hydro power station'),
          working: ['<b>Picture:</b> a full lake sitting high up behind the dam wall.', '1. Water held high = <b>gravitational potential</b>.', '2. Water rushing down the pipe = <b>kinetic</b>.', '3. The turbine spins the generator = <b>electrical</b>.', 'Most of New Zealand\'s power is made this way.'],
          a: 'gravitational potential → kinetic → electrical',
        },
        {
          q: 'In an old light bulb, which energy is useful and which is wasted?',
          working: ['<b>Picture:</b> why did you turn the light on? For light.', '1. Useful = <b>light</b>.', '2. The bulb also gets hot — you did not want that.', 'Wasted = <b>thermal (heat)</b> energy. It is not destroyed, it spreads into the room.'],
          a: 'Light is useful; heat is wasted',
        },
        {
          q: 'A kettle takes in 2000 J and 1600 J of it heats the water. How much is wasted, and what percentage is useful?',
          visual: sankeySvg(2000, 1600, 'heating the water', 'heat lost + sound'),
          working: [
            '<b>Rule:</b> energy in = useful out + wasted out.',
            '1. Wasted = 2000 − 1600 = <b>400 J</b>.',
            '2. Percentage useful = 1600 ÷ 2000 = 0.8.',
            '3. 0.8 × 100 = <b>80%</b> useful.',
          ],
          a: '400 J wasted, 80% useful',
        },
        {
          q: 'Two bulbs are given 100 J each. Bulb A gives 10 J of light, bulb B gives 75 J. Which should Harper buy?',
          visual: `<table class="data"><tr><th>bulb</th><th>energy in</th><th>light out</th><th>% useful</th></tr><tr><td>A</td><td>100 J</td><td>10 J</td><td>10%</td></tr><tr><td>B</td><td>100 J</td><td>75 J</td><td>75%</td></tr></table>`,
          working: ['<b>Picture:</b> both get the same pocket money — which spends more of it on light?', '1. Bulb A: 10 ÷ 100 × 100 = 10% useful.', '2. Bulb B: 75 ÷ 100 × 100 = 75% useful.', '3. Bulb A wastes 90 J as heat; bulb B wastes only 25 J.'],
          a: 'Bulb B — it is far more efficient',
        },
        {
          q: 'A ball is dropped, bounces, and each bounce is lower. Explain using energy.',
          working: [
            '<b>Picture:</b> a few coins roll away every time the energy changes pocket.',
            '1. Held up: <b>gravitational potential</b>.',
            '2. Falling: it becomes <b>kinetic</b>.',
            '3. At the bounce, some becomes <b>sound</b> (you hear it) and some becomes <b>heat</b>.',
            '4. Less energy is left, so it cannot climb as high.',
            'No energy was destroyed — it just spread out into the floor and the air.',
          ],
          a: 'Some energy is transferred to sound and heat at each bounce, so less is left to lift the ball',
        },
      ],
      tips: [
        'Never write that energy is "lost" or "used up". Say where it <b>went</b> — usually heat into the surroundings.',
        'Careful: <b>chemical</b> energy is stored in food, fuel and batteries — not "food energy" or "battery energy".',
        'Wasted does not mean destroyed. Energy in always equals useful out plus wasted out.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [formFromDesc, storeQ, chainBlank, chainStart, usefulWasted, conservationQ, nzEnergy]
        : level === 2
          ? [formFromDesc, storeQ, chainBlank, chainStart, usefulWasted, conservationQ, nzEnergy, transferMoment, wastedCalc, usefulFromPct]
          : [chainBlank, chainStart, usefulWasted, transferMoment, wastedCalc, efficiencyCalc, usefulFromPct, sankeyRead, conservationQ, nzEnergy, storeQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
