/* Topic: Energy resources — renewable vs non-renewable, how each one works,
 * Aotearoa's electricity mix, the good and bad points of each, and saving energy at home. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const RESOURCES = [
    {
      name: 'hydro', type: 'renewable', fossil: false, colour: '#5F98C4',
      how: 'water held high in a lake rushes down a pipe and spins a turbine',
      adv: 'no carbon dioxide, cheap to run, and it can be turned up the moment everyone switches the kettle on',
      dis: 'the dam floods a whole valley and stops fish swimming up the river',
      pic: 'a full lake sitting high above the power station',
    },
    {
      name: 'wind', type: 'renewable', fossil: false, colour: '#8FC96E',
      how: 'moving air pushes huge blades round, and the blades turn a generator',
      adv: 'no fuel to buy and no carbon dioxide, and a wind farm is quick to build',
      dis: 'it only makes power when the wind is blowing, so it cannot be relied on alone',
      pic: 'the blades on the Manawatū hills turning in a gale',
    },
    {
      name: 'solar', type: 'renewable', fossil: false, colour: '#E8C24A',
      how: 'sunlight landing on a panel is turned straight into electricity',
      adv: 'panels sit on a roof you already have, and make power right where it is used',
      dis: 'it makes nothing at night and much less on a cloudy winter day',
      pic: 'panels on a house roof in the sun',
    },
    {
      name: 'geothermal', type: 'renewable', fossil: false, colour: '#E9A07A',
      how: 'hot rock underground boils water into steam, and the steam spins a turbine',
      adv: 'it runs day and night whatever the weather, which is why Taupō and Rotorua stations never stop',
      dis: 'it only works where hot rock sits near the surface, and the steam smells of sulfur',
      pic: 'steam pouring out of the ground at Wairākei',
    },
    {
      name: 'tidal', type: 'renewable', fossil: false, colour: '#A9D8F5',
      how: 'the sea rising and falling pushes water past an underwater turbine twice a day',
      adv: 'the tides are completely predictable — you know years ahead when the power will come',
      dis: 'very few places have a big enough tide, and the machinery can harm sea life',
      pic: 'the tide racing through a narrow channel',
    },
    {
      name: 'biomass', type: 'renewable', fossil: false, colour: '#6FA04C',
      how: 'wood chips, sawdust or crop waste are burnt to boil water into steam',
      adv: 'the trees can be grown again, and it uses waste wood that would be thrown out',
      dis: 'burning it still makes smoke and carbon dioxide, and it needs a lot of land',
      pic: 'a boiler at a sawmill burning its own wood scraps',
    },
    {
      name: 'coal', type: 'non-renewable', fossil: true, colour: '#7C7266',
      how: 'coal is burnt to boil water into steam, and the steam spins a turbine',
      adv: 'it is easy to store in a pile and can be burnt any time, day or night',
      dis: 'it gives off the most carbon dioxide of any fuel, and it will run out',
      pic: 'a black pile of coal at Huntly power station',
    },
    {
      name: 'oil', type: 'non-renewable', fossil: true, colour: '#4A4033',
      how: 'oil is refined into petrol or diesel and burnt in an engine or a boiler',
      adv: 'it packs a lot of energy into a small tank, which is why cars still use it',
      dis: 'burning it releases carbon dioxide, spills damage the sea, and it will run out',
      pic: 'the petrol going into a car at the service station',
    },
    {
      name: 'natural gas', type: 'non-renewable', fossil: true, colour: '#B9A5E6',
      how: 'gas is burnt to boil water, or burnt to drive a turbine directly',
      adv: 'it burns cleaner than coal and a gas station can be switched on in minutes when the lakes are low',
      dis: 'it still releases carbon dioxide, and the Taranaki fields will run out',
      pic: 'a blue gas flame under a hob',
    },
    {
      name: 'nuclear', type: 'non-renewable', fossil: false, colour: '#8E79C6',
      how: 'uranium atoms are split to make heat, and the heat boils water into steam',
      adv: 'it makes no carbon dioxide while it runs, and one small fuel rod lasts a long time',
      dis: 'the waste stays dangerous for thousands of years, and New Zealand has chosen not to use it',
      pic: 'fuel rods in a reactor — not used in Aotearoa',
    },
  ];
  const RENEW = RESOURCES.filter((r) => r.type === 'renewable');
  const NONREN = RESOURCES.filter((r) => r.type === 'non-renewable');
  const FOSSIL = RESOURCES.filter((r) => r.fossil);

  /* Aotearoa's electricity mix — rounded, and always described as "about" */
  const MIX = [
    { name: 'hydro', pct: 57, colour: '#5F98C4', type: 'renewable' },
    { name: 'geothermal', pct: 18, colour: '#E9A07A', type: 'renewable' },
    { name: 'natural gas', short: 'gas', pct: 11, colour: '#B9A5E6', type: 'non-renewable' },
    { name: 'wind', pct: 7, colour: '#8FC96E', type: 'renewable' },
    { name: 'coal', pct: 5, colour: '#7C7266', type: 'non-renewable' },
    { name: 'solar', pct: 2, colour: '#E8C24A', type: 'renewable' },
  ];
  const RENEW_PCT = MIX.filter((m) => m.type === 'renewable').reduce((s, m) => s + m.pct, 0); // 84

  const SAVERS = [
    { do: 'swap the old bulbs for LED bulbs', why: 'an LED gives the same light for about a fifth of the electricity' },
    { do: 'switch the heater off at the wall instead of leaving it on standby', why: 'standby lights and chargers keep sipping power all night' },
    { do: 'have a shorter shower', why: 'most of the power in a shower goes on heating the water' },
    { do: 'wash the clothes in cold water', why: 'heating the water is nearly all of a washing machine’s energy' },
    { do: 'close the curtains as soon as it gets dark', why: 'most of a room’s heat escapes through the windows' },
    { do: 'put insulation in the ceiling', why: 'warm air rises, so an uninsulated ceiling loses heat fastest' },
    { do: 'set the heat pump to 20 °C instead of 25 °C', why: 'every extra degree costs more power for heat that leaks straight out' },
    { do: 'only fill the jug with the water you need', why: 'you are paying to heat every drop, even the ones you tip away' },
    { do: 'put a lid on the pot', why: 'without a lid the heat you paid for leaves with the steam' },
    { do: 'walk, bike or bus to school instead of being driven', why: 'a car burns petrol, which is a fossil fuel' },
    { do: 'run the dishwasher only when it is full', why: 'a half-full load uses almost the same power as a full one' },
  ];

  const WHY_SAVE = [
    'less fuel has to be burnt, so less carbon dioxide goes into the air',
    'the power bill goes down',
    'water can be kept in the hydro lakes for a dry year instead of burning coal',
    'we do not have to build as many new power stations',
  ];

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
  function pieSlices(slices, cx, cy, r) {
    let a = -Math.PI / 2, out = '';
    slices.forEach((s) => {
      const a2 = a + (s.pct / 100) * Math.PI * 2;
      const x1 = (cx + r * Math.cos(a)).toFixed(1), y1 = (cy + r * Math.sin(a)).toFixed(1);
      const x2 = (cx + r * Math.cos(a2)).toFixed(1), y2 = (cy + r * Math.sin(a2)).toFixed(1);
      out += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${s.pct > 50 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${s.colour}" stroke="#FFFFFF" stroke-width="2"/>`;
      a = a2;
    });
    return out;
  }
  function mixPieSvg() {
    const rows = [];
    rows.push({ head: 'renewable', fill: '#4E7A34' });
    MIX.filter((m) => m.type === 'renewable').forEach((m) => rows.push(m));
    rows.push({ head: 'fossil fuel', fill: '#A5603A' });
    MIX.filter((m) => m.type !== 'renewable').forEach((m) => rows.push(m));
    const legend = rows.map((r, i) => {
      const y = 30 + i * 21;
      if (r.head) return `<text x="176" y="${y}" fill="${r.fill}" font-size="12.5">${r.head}</text>`;
      return `<rect x="180" y="${y - 11}" width="13" height="13" rx="3" fill="${r.colour}" stroke="#FFFFFF" stroke-width="1"/>
        <text x="200" y="${y}" fill="${INK}" font-size="12">${r.short || r.name} ${r.pct}%</text>`;
    }).join('');
    return `<svg viewBox="0 0 350 214" width="350" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">NZ electricity: roughly where it comes from</text>
      ${pieSlices(MIX, 86, 110, 60)}
      ${legend}
      <text x="175" y="204" text-anchor="middle" fill="${INK}" font-size="12.5"><tspan fill="#4E7A34">about 84% renewable</tspan> &#183; <tspan fill="#A5603A">about 16% fossil fuel</tspan></text>
    </svg>`;
  }
  function mixBarSvg(highlight) {
    const rows = MIX.map((m, i) => {
      const y = 32 + i * 25, w = Math.round(m.pct * 2.2), hi = highlight === m.name;
      return `<text x="8" y="${y + 14}" fill="${INK}" font-size="12">${m.name}</text>
        <rect x="96" y="${y}" width="${w}" height="19" rx="3" fill="${m.colour}" stroke="${hi ? '#E0568C' : '#FFFFFF'}" stroke-width="${hi ? 3 : 1}"/>
        <text x="${96 + w + 6}" y="${y + 14}" fill="${hi ? '#C33C72' : INK}" font-size="12">${m.pct}%</text>`;
    }).join('');
    return `<svg viewBox="0 0 350 200" width="350" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="17" text-anchor="middle" fill="${INK}" font-size="12.5">NZ electricity mix (about)</text>
      ${rows}
      <line x1="96" y1="26" x2="96" y2="182" stroke="#D9CFBE" stroke-width="2"/>
      <text x="175" y="196" text-anchor="middle" fill="#8A7B63" font-size="11.5">every slice adds up to 100%</text>
    </svg>`;
  }
  function damSvg() {
    return `<svg viewBox="0 0 350 206" width="350" height="206" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="16" text-anchor="middle" fill="${INK}" font-size="12.5">a hydro dam, from lake to wires</text>
      <rect x="8" y="46" width="110" height="66" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
      <rect x="8" y="112" width="110" height="44" fill="#E7DCC6" stroke="#C9BCA0" stroke-width="2"/>
      <rect x="118" y="40" width="18" height="116" fill="#E9A07A" stroke="#C77D55" stroke-width="2"/>
      <rect x="136" y="140" width="206" height="16" fill="#E7DCC6" stroke="#C9BCA0" stroke-width="2"/>
      <line x1="136" y1="104" x2="238" y2="140" stroke="#9A8F80" stroke-width="11" stroke-linecap="round"/>
      <circle cx="252" cy="132" r="15" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      ${[0, 60, 120].map((d) => `<line x1="252" y1="132" x2="${(252 + 15 * Math.cos(d * Math.PI / 180)).toFixed(1)}" y2="${(132 + 15 * Math.sin(d * Math.PI / 180)).toFixed(1)}" stroke="#C98A1C" stroke-width="3"/>`).join('')}
      <rect x="276" y="112" width="56" height="30" rx="5" fill="#B9A5E6" stroke="#8E79C6" stroke-width="2"/>
      <line x1="304" y1="112" x2="304" y2="70" stroke="#8E79C6" stroke-width="3"/>
      ${[0, 1, 2].map((i) => `<line x1="${296 + i * 8}" y1="70" x2="${296 + i * 8}" y2="62" stroke="#8E79C6" stroke-width="3"/>`).join('')}
      ${[[62, 78, '1'], [190, 116, '2'], [304, 128, '3']].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="11" fill="#FFFFFF" stroke="#E0568C" stroke-width="3"/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="#C33C72" font-size="13">${n}</text>`).join('')}
      <text x="175" y="180" text-anchor="middle" fill="${INK}" font-size="12">1 lake &#8594; 2 pipe &#8594; 3 turbine + generator</text>
      <text x="175" y="198" text-anchor="middle" fill="#C33C72" font-size="12">gravitational potential &#8594; kinetic &#8594; electrical</text>
    </svg>`;
  }
  function sortSvg(item) {
    const shownR = ['hydro', 'wind', 'solar'], shownN = ['coal', 'oil', 'natural gas'];
    const col = (x, fill, stroke, head, items, headFill) =>
      `<rect x="${x}" y="30" width="160" height="122" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
       <text x="${x + 80}" y="50" text-anchor="middle" fill="${headFill}" font-size="12.5">${head}</text>
       ${items.map((t, i) => `<text x="${x + 80}" y="${74 + i * 21}" text-anchor="middle" fill="${INK}" font-size="12">${t}</text>`).join('')}`;
    return `<svg viewBox="0 0 350 216" width="350" height="216" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <text x="175" y="17" text-anchor="middle" fill="${INK}" font-size="12.5">which side does this card go on?</text>
      ${col(8, '#EEF7E4', '#6FA04C', 'RENEWABLE', shownR, '#3F6A26')}
      ${col(182, '#FBEDE4', '#C77D55', 'NON-RENEWABLE', shownN, '#A5603A')}
      <text x="88" y="142" text-anchor="middle" fill="#3F6A26" font-size="11.5">will not run out</text>
      <text x="262" y="142" text-anchor="middle" fill="#A5603A" font-size="11.5">will run out one day</text>
      <rect x="92" y="162" width="166" height="42" rx="10" fill="#FFFFFF" stroke="#E0568C" stroke-width="3"/>
      <text x="175" y="189" text-anchor="middle" fill="#C33C72" font-size="14">${item} &#63;</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function typeQ() {
    const r = R.pick(RESOURCES);
    const c = choice(r.type === 'renewable' ? 'Renewable' : 'Non-renewable', ['Renewable', 'Non-renewable'], 2);
    return {
      visual: sortSvg(r.name),
      prompt: `Is <b>${r.name}</b> a renewable or a non-renewable energy resource?`,
      answer: ans(c),
      hint: 'Renewable = it keeps coming back on its own. Non-renewable = there is a fixed amount and it will run out.',
      working: [
        '<b>Picture:</b> renewable is a tap you cannot turn off; non-renewable is a bucket that empties.',
        `1. Will ${r.name} keep coming back on its own? ${r.type === 'renewable' ? 'Yes.' : 'No — there is only a fixed amount under the ground.'}`,
        `So ${r.name} is <b>${r.type}</b>.`,
      ],
      finalAnswer: cap(r.type), skill: 'sorting',
    };
  }
  function howQ() {
    const r = R.pick(RESOURCES);
    const c = choice(r.how, RESOURCES.filter((x) => x.name !== r.name).map((x) => x.how));
    return {
      prompt: `How does a <b>${r.name}</b> power station make electricity?`,
      answer: ans(c),
      hint: `Think of ${r.pic}.`,
      working: [`<b>Picture:</b> ${r.pic}.`, `In a ${r.name} station, <b>${r.how}</b>.`, 'Almost every station ends the same way: something spins a generator.'],
      finalAnswer: r.how, skill: 'how',
    };
  }
  function nameFromHow() {
    const r = R.pick(RESOURCES);
    const c = choice(r.name, RESOURCES.filter((x) => x.name !== r.name).map((x) => x.name));
    return {
      prompt: `Which energy resource is this? <i>${cap(r.how)}.</i>`,
      answer: ans(c),
      hint: 'What is the thing that does the pushing or the burning?',
      working: [`<b>Picture:</b> ${r.pic}.`, `That description matches <b>${r.name}</b>.`],
      finalAnswer: r.name, skill: 'how',
    };
  }
  function advDisQ() {
    const r = R.pick(RESOURCES);
    const wantAdv = R.chance(0.5);
    const want = wantAdv ? r.adv : r.dis;
    const wrongs = RESOURCES.filter((x) => x.name !== r.name).map((x) => (wantAdv ? x.adv : x.dis));
    const c = choice(want, wrongs);
    return {
      prompt: `What is one <b>${wantAdv ? 'advantage' : 'disadvantage'}</b> of ${r.name}?`,
      answer: ans(c),
      hint: wantAdv ? 'What is good about it — cost, carbon dioxide, or being able to rely on it?' : 'No resource is perfect. What is the catch with this one?',
      working: [
        `<b>Picture:</b> ${r.pic}.`,
        `${wantAdv ? 'Good point' : 'Catch'}: <b>${want}</b>.`,
        r.type === 'renewable' ? 'Renewable does not mean perfect — every one has a downside too.' : 'Every fossil fuel has the same two problems: carbon dioxide, and running out.',
      ],
      finalAnswer: want, skill: 'pros-cons',
    };
  }
  function fossilQ() {
    const q = R.pick([
      { p: 'How were coal, oil and natural gas made?', a: 'From living things buried and squashed for millions of years', w: ['They were made in a factory', 'They formed in the last hundred years', 'They come from melted rock in volcanoes'] },
      { p: 'What gas is given off when a fossil fuel is burnt?', a: 'carbon dioxide', w: ['oxygen', 'nitrogen', 'helium'] },
      { p: 'Why are coal, oil and gas called <b>non-renewable</b>?', a: 'They take millions of years to form, so we are using them far faster than they are made', w: ['They are expensive', 'They are dirty to dig up', 'They are only found in one country'] },
      { p: 'Which of these is <b>not</b> a fossil fuel?', a: 'geothermal steam', w: ['coal', 'oil', 'natural gas'] },
      { p: 'Why does burning fossil fuels matter for the climate?', a: 'The carbon dioxide it releases traps extra heat in the atmosphere', w: ['It uses up all the oxygen', 'It makes the Sun hotter', 'It blocks sunlight from reaching us'] },
      { p: 'Where was the carbon in a lump of coal before it was coal?', a: 'In plants that grew millions of years ago', w: ['In the sea water', 'In the rocks of the mantle', 'In the air last century'] },
      { p: 'Which fossil fuel gives off the most carbon dioxide for the energy you get?', a: 'coal', w: ['natural gas', 'wood chips', 'petrol'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Fossil = ancient. Buried plants and sea creatures, squashed for millions of years.',
      working: [
        '<b>Picture:</b> a lump of coal is a squashed ancient forest, and petrol is squashed sea life.',
        'They took <b>millions of years</b> to make, and burning them releases <b>carbon dioxide</b>.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'fossil',
    };
  }
  function mixReadChoice() {
    const m = R.pick(MIX);
    const c = choice(`${m.pct}%`, MIX.filter((x) => x.name !== m.name).map((x) => `${x.pct}%`));
    return {
      visual: mixBarSvg(m.name),
      prompt: `Look at the chart. About what percentage of New Zealand's electricity comes from <b>${m.name}</b>?`,
      answer: ans(c),
      hint: 'Find that bar and read the number at the end of it.',
      working: [`<b>Picture:</b> the longer the bar, the bigger the slice of our power.`, `The ${m.name} bar reads <b>${m.pct}%</b>.`],
      finalAnswer: `about ${m.pct}%`, skill: 'chart',
    };
  }
  function mixReadNumber() {
    const m = R.pick(MIX);
    return {
      visual: mixBarSvg(m.name),
      prompt: `Read the chart: about what percentage of our electricity comes from <b>${m.name}</b>?`,
      answer: { type: 'number', value: m.pct, unit: '%', placeholder: 'e.g. 18' },
      hint: 'Follow the highlighted bar across to the number at the end.',
      working: [`Find the ${m.name} bar.`, `Read the number written at the end: <b>${m.pct}%</b>.`],
      finalAnswer: `${m.pct}%`, skill: 'chart',
    };
  }
  function mixCompare() {
    const [a, b] = R.sample(MIX, 2);
    const big = a.pct > b.pct ? a : b, small = a.pct > b.pct ? b : a;
    if (R.chance(0.5)) {
      const c = choice(big.name, [small.name], 2);
      return {
        visual: mixBarSvg(),
        prompt: `Which gives New Zealand more electricity: <b>${a.name}</b> or <b>${b.name}</b>?`,
        answer: ans(c),
        hint: 'The longer bar is the bigger share.',
        working: [`${cap(a.name)} = ${a.pct}%, ${b.name} = ${b.pct}%.`, `${big.pct} is bigger than ${small.pct}, so <b>${big.name}</b> gives more.`],
        finalAnswer: big.name, skill: 'chart',
      };
    }
    return {
      visual: mixBarSvg(),
      prompt: `How many percentage points more of our electricity comes from <b>${big.name}</b> than from <b>${small.name}</b>?`,
      answer: { type: 'number', value: big.pct - small.pct, unit: '%', placeholder: 'e.g. 12' },
      hint: 'Read both bars, then subtract the smaller from the bigger.',
      working: [`${cap(big.name)} = ${big.pct}%.`, `${cap(small.name)} = ${small.pct}%.`, `${big.pct} − ${small.pct} = <b>${big.pct - small.pct}%</b>.`],
      finalAnswer: `${big.pct - small.pct}%`, skill: 'chart',
    };
  }
  function mixSum() {
    const [a, b] = R.sample(MIX, 2);
    return {
      visual: mixBarSvg(),
      prompt: `Add the two bars: about what percentage of our electricity comes from <b>${a.name}</b> and <b>${b.name}</b> together?`,
      answer: { type: 'number', value: a.pct + b.pct, unit: '%', placeholder: 'e.g. 64' },
      hint: 'Read both numbers off the chart and add them.',
      working: [`${cap(a.name)} = ${a.pct}%, ${b.name} = ${b.pct}%.`, `${a.pct} + ${b.pct} = <b>${a.pct + b.pct}%</b>.`],
      finalAnswer: `${a.pct + b.pct}%`, skill: 'chart',
    };
  }
  function renewableTotal() {
    const askNon = R.chance(0.4);
    return {
      visual: mixBarSvg(),
      prompt: askNon
        ? `About ${RENEW_PCT}% of New Zealand's electricity is renewable. What percentage is <b>not</b> renewable?`
        : 'Add up the renewable bars (hydro, geothermal, wind and solar). About what percentage of our electricity is <b>renewable</b>?',
      answer: { type: 'number', value: askNon ? 100 - RENEW_PCT : RENEW_PCT, unit: '%', placeholder: 'e.g. 80' },
      hint: askNon ? 'The whole chart is 100%. Take the renewable part off.' : 'Hydro 57 + geothermal 18 + wind 7 + solar 2.',
      working: askNon
        ? ['<b>Rule:</b> the whole pie is 100%.', `100 − ${RENEW_PCT} = <b>${100 - RENEW_PCT}%</b>.`, 'That leftover bit is the gas and coal we burn, mostly when the lakes are low.']
        : ['Hydro 57 + geothermal 18 = 75.', '75 + wind 7 = 82.', `82 + solar 2 = <b>${RENEW_PCT}%</b> renewable.`],
      finalAnswer: `about ${askNon ? 100 - RENEW_PCT : RENEW_PCT}%`, skill: 'chart',
    };
  }
  function missingSlice() {
    const hidden = R.pick(MIX);
    const rest = MIX.filter((m) => m !== hidden);
    const shown = rest.map((m) => `${m.name} ${m.pct}%`).join(', ');
    return {
      prompt: `A pie chart of our electricity shows ${shown}. The last slice is <b>${hidden.name}</b>. What percentage is it?`,
      answer: { type: 'number', value: hidden.pct, unit: '%', placeholder: 'e.g. 11' },
      hint: 'Every slice of a pie chart adds up to 100%.',
      working: [
        '<b>Rule:</b> a whole pie chart = 100%.',
        `Add the slices you can see: ${rest.map((m) => m.pct).join(' + ')} = ${100 - hidden.pct}.`,
        `100 − ${100 - hidden.pct} = <b>${hidden.pct}%</b> for ${hidden.name}.`,
      ],
      finalAnswer: `${hidden.pct}%`, skill: 'chart',
    };
  }
  function unitsFromPct() {
    const units = R.pick([25, 50, 100, 200, 400]);
    const pct = R.pick([RENEW_PCT, 100 - RENEW_PCT, 60, 20, 40]);
    const val = units * pct / 100;
    return {
      prompt: `A house uses <b>${units} units</b> of electricity in a month. If <b>${pct}%</b> of the country's power is ${pct >= 50 ? 'renewable' : 'made by burning fuel'}, how many of those units are ${pct >= 50 ? 'renewable' : 'from burnt fuel'}?`,
      answer: { type: 'number', value: val, unit: 'units', placeholder: 'e.g. 84' },
      hint: 'Divide by 100 to find 1%, then multiply by the percentage.',
      working: [`<b>Rule:</b> ${pct}% of ${units} = ${units} ÷ 100 × ${pct}.`, `${units} ÷ 100 = ${units / 100}.`, `${units / 100} × ${pct} = <b>${val} units</b>.`],
      finalAnswer: `${val} units`, skill: 'calc',
    };
  }
  function bulbSaving() {
    const old = R.pick([40, 60, 80, 100]);
    const led = R.pick([5, 8, 10]);
    const hours = R.pick([2, 3, 4, 5]);
    if (R.chance(0.5)) {
      return {
        prompt: `An old bulb uses <b>${old} W</b>. An LED that gives the same light uses <b>${led} W</b>. How many watts are saved by swapping it?`,
        answer: { type: 'number', value: old - led, unit: 'W', placeholder: 'e.g. 52' },
        hint: 'Saving = the old power minus the new power.',
        working: ['<b>Rule:</b> saving = old − new.', `${old} − ${led} = <b>${old - led} W</b> saved, every hour it is on.`],
        finalAnswer: `${old - led} W`, skill: 'saving',
      };
    }
    return {
      prompt: `Swapping a bulb saves <b>${old - led} W</b>. If the light is on for <b>${hours} hours</b>, how many watt-hours of energy are saved?`,
      answer: { type: 'number', value: (old - led) * hours, unit: 'Wh', placeholder: 'e.g. 156' },
      hint: 'Energy saved = watts saved × hours.',
      working: ['<b>Rule:</b> energy = power × time.', `${old - led} × ${hours} = <b>${(old - led) * hours} Wh</b>.`, 'Do that every night and it really adds up.'],
      finalAnswer: `${(old - led) * hours} Wh`, skill: 'saving',
    };
  }
  function savingQ() {
    const s = R.pick(SAVERS);
    const c = choice(s.why, SAVERS.filter((x) => x.do !== s.do).map((x) => x.why));
    return {
      prompt: `Why does it save energy to <b>${s.do}</b>?`,
      answer: ans(c),
      hint: 'Ask: where was the energy going before, and does this stop it?',
      working: [`<b>Picture:</b> energy leaking out of the house like water out of a bucket with holes.`, `Reason: <b>${s.why}</b>.`, `And ${R.pick(WHY_SAVE)}.`],
      finalAnswer: s.why, skill: 'saving',
    };
  }
  function hydroChain() {
    const q = R.pick([
      { p: 'In a hydro dam, what energy does the water have while it is still sitting up in the lake?', a: 'gravitational potential', w: ['kinetic', 'electrical', 'chemical'] },
      { p: 'In a hydro dam, what energy does the water have as it rushes down the pipe?', a: 'kinetic', w: ['gravitational potential', 'chemical', 'light'] },
      { p: 'What comes out of the generator at a hydro station?', a: 'electrical energy', w: ['chemical energy', 'nuclear energy', 'elastic energy'] },
      { p: 'What is the full energy chain of a hydro dam?', a: 'gravitational potential → kinetic → electrical', w: ['chemical → thermal → electrical', 'kinetic → gravitational potential → light', 'light → electrical → chemical'] },
      { p: 'What actually spins inside a hydro station to make the electricity?', a: 'a turbine joined to a generator', w: ['a magnet floating in the lake', 'the dam wall', 'a solar panel'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: damSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Follow the numbers on the picture: 1 held high, 2 rushing down, 3 spinning the generator.',
      working: ['<b>Picture:</b> a full lake sitting high above the power station.', '1 held high = <b>gravitational potential</b> → 2 rushing down = <b>kinetic</b> → 3 generator = <b>electrical</b>.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'hydro',
    };
  }
  function nzFactQ() {
    const q = R.pick([
      { p: 'Which resource gives New Zealand the most electricity?', a: 'hydro', w: ['coal', 'wind', 'solar'] },
      { p: 'Where is most of New Zealand’s hydro power made?', a: 'The big South Island lakes and the Waikato River', w: ['Off the coast of Wellington', 'Under Auckland city', 'On Mount Ruapehu'] },
      { p: 'Which part of New Zealand has the geothermal power stations?', a: 'Around Taupō and Rotorua', w: ['Around Dunedin', 'The West Coast glaciers', 'Stewart Island'] },
      { p: 'Why can geothermal power run all night, when solar cannot?', a: 'The hot rock underground stays hot whatever the weather', w: ['The Moon heats it instead', 'Geothermal stations store sunlight', 'It uses batteries'] },
      { p: 'Roughly what share of our electricity is renewable?', a: 'about 80–85%', w: ['about 20%', 'about 50%', '100%'] },
      { p: 'In a dry year the hydro lakes get low. What does New Zealand usually do?', a: 'Burn more coal and gas for a while', w: ['Turn the power off completely', 'Import water', 'Build a nuclear station'] },
      { p: 'Why does New Zealand have so much hydro power?', a: 'We have high mountains and a lot of rain, so rivers run fast downhill', w: ['We have very flat land', 'We have very little rain', 'Water is heavier here'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Aotearoa runs mostly on falling water, underground steam and wind.',
      working: ['<b>Picture:</b> the pie chart — hydro is more than half of it.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'nz',
    };
  }
  function notPerfectQ() {
    const q = R.pick([
      { p: 'A wind farm makes no carbon dioxide. Why can wind still not run the whole country on its own?', a: 'On a still day the turbines make almost nothing', w: ['Wind turbines make carbon dioxide too', 'Wind will run out one day', 'The blades cannot turn a generator'] },
      { p: 'What is the main problem with building a big new hydro dam?', a: 'The lake behind it floods a valley and blocks fish moving up the river', w: ['It gives off a lot of carbon dioxide', 'The water runs out after a few years', 'It only works at night'] },
      { p: 'Solar panels are renewable, so why do we still need other power stations?', a: 'They make nothing at night and much less in winter', w: ['They wear out in a month', 'They release carbon dioxide', 'They only work in the dark'] },
      { p: 'Burning wood chips (biomass) is called renewable. What is the catch?', a: 'Burning it still makes smoke and carbon dioxide', w: ['Trees cannot be regrown', 'It uses no land at all', 'It cannot make steam'] },
      { p: 'Tidal power is completely predictable. Why is there so little of it?', a: 'Only a few places have a big enough tide, and the machinery is hard to build in the sea', w: ['Tides stop in winter', 'Tides are not predictable', 'Sea water has no energy'] },
      { p: 'Which statement is true about renewable energy?', a: 'It will not run out, but every kind still has some downside', w: ['It is perfect with no downsides at all', 'It always costs nothing', 'It gives off more carbon dioxide than coal'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Renewable means "will not run out" — it does not mean "no problems at all".',
      working: ['<b>Picture:</b> every resource has a good side and a catch. Write both.', `Answer: <b>${q.a}</b>.`, 'That is why the country uses a <b>mix</b> instead of just one.'],
      finalAnswer: q.a, skill: 'pros-cons',
    };
  }
  function sortCard() {
    const r = R.pick(RESOURCES);
    const c = choice(r.type === 'renewable' ? 'the RENEWABLE side' : 'the NON-RENEWABLE side', ['the RENEWABLE side', 'the NON-RENEWABLE side'], 2);
    return {
      visual: sortSvg(r.name),
      prompt: `Harper is sorting resource cards. Which side does the <b>${r.name}</b> card belong on?`,
      answer: ans(c),
      hint: 'Ask: is there a fixed amount buried in the ground, or does nature keep making more?',
      working: [
        `1. Does ${r.name} keep being made? ${r.type === 'renewable' ? 'Yes — the Sun, the wind, the rain and the hot rocks keep going.' : 'No — there is only a fixed amount left.'}`,
        `So it goes on <b>the ${r.type === 'renewable' ? 'RENEWABLE' : 'NON-RENEWABLE'} side</b>.`,
      ],
      finalAnswer: r.type === 'renewable' ? 'the RENEWABLE side' : 'the NON-RENEWABLE side', skill: 'sorting',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Hydro — it is more than half of the whole pie', ['Coal — it is the biggest slice', 'Solar — every house has panels', 'Natural gas — it is over half'], 4);
      return {
        visual: mixPieSvg(),
        prompt: 'Harper has to describe this pie chart of New Zealand’s electricity in one sentence. Which sentence is right?',
        answer: ans(c),
        hint: 'Look for the biggest slice first, then check it against the numbers in the key.',
        working: ['<b>Picture:</b> the pie is one whole country’s power cut into slices.', '1. Which slice is biggest? Hydro, at 57%.', '2. Is 57 more than half of 100? Yes.', 'So: <b>hydro is more than half of the whole pie</b>.'],
        finalAnswer: 'Hydro — more than half our electricity',
      };
    },
    () => {
      const c = choice('Gas and coal are burnt to fill the gap', ['The country goes without power', 'More rain is made', 'Solar panels work at night instead'], 4);
      return {
        visual: mixPieSvg(),
        prompt: 'It has been a dry winter and the South Island hydro lakes are low. What usually happens to our electricity mix?',
        answer: ans(c),
        hint: 'Which stations can be switched on quickly whatever the weather?',
        working: [
          '<b>Picture:</b> the hydro slice of the pie shrinks, so another slice has to grow.',
          '1. Hydro needs rain in the lakes. Less rain = less hydro.',
          '2. Gas and coal stations can be fired up any time.',
          'So the fossil-fuel slice grows and our renewable percentage drops for a while.',
        ],
        finalAnswer: 'More gas and coal are burnt until the lakes refill',
      };
    },
    () => {
      const r = R.pick(RENEW);
      const c = choice(r.dis, NONREN.map((x) => x.dis).concat(RENEW.filter((x) => x.name !== r.name).map((x) => x.dis)));
      return {
        prompt: `A town wants to build a <b>${r.name}</b> station. A neighbour asks what the downside is. What should Harper tell them?`,
        answer: ans(c),
        hint: 'Renewable does not mean perfect. What is the catch with this one?',
        working: [`<b>Picture:</b> ${r.pic}.`, `Good point: ${r.adv}.`, `Catch: <b>${r.dis}</b>.`],
        finalAnswer: r.dis,
      };
    },
    () => {
      const c = choice('Wind, because it makes nothing on a still day', ['Geothermal, because the rocks cool at night', 'Hydro, because rivers stop at night', 'Coal, because coal runs out overnight'], 4);
      return {
        prompt: 'A power company needs electricity it can count on at 6 p.m. every single day. Which of these resources is the LEAST reliable on its own?',
        answer: ans(c),
        hint: 'Which one depends on the weather at that exact moment?',
        working: [
          '<b>Picture:</b> a still, calm evening — the turbines are not turning.',
          '1. Geothermal: hot rock, always there.',
          '2. Hydro: water stored behind the dam, ready when needed.',
          '3. Wind: only works if the wind blows right then.',
          'So <b>wind</b> is the least reliable on its own — which is why it is used as part of a mix.',
        ],
        finalAnswer: 'Wind — it depends on the weather at that moment',
      };
    },
    () => {
      const units = R.pick([100, 200, 400]);
      const pct = RENEW_PCT;
      return {
        prompt: `Harper’s family used <b>${units} units</b> of electricity last month. About ${pct}% of New Zealand’s power is renewable. Roughly how many of their units came from renewable resources?`,
        answer: { type: 'number', value: units * pct / 100, unit: 'units', placeholder: 'e.g. 168' },
        hint: 'Find 1% first (divide by 100), then multiply by 84.',
        working: [`<b>Rule:</b> ${pct}% of ${units} = ${units} ÷ 100 × ${pct}.`, `${units} ÷ 100 = ${units / 100}.`, `${units / 100} × ${pct} = <b>${units * pct / 100} units</b>.`, `The other ${units - units * pct / 100} units came from burning gas and coal.`],
        finalAnswer: `${units * pct / 100} units`,
      };
    },
    () => {
      const s = R.pick(SAVERS);
      const c = choice(s.do, SAVERS.filter((x) => x.do !== s.do).map((x) => x.do));
      return {
        prompt: `Harper’s class is writing an energy-saving poster. Which action goes with this reason: <i>${s.why}</i>?`,
        answer: ans(c),
        hint: 'Match the action to what it stops leaking.',
        working: ['<b>Picture:</b> the house is a bucket and the energy is leaking out of holes.', `Reason: ${s.why}.`, `Action: <b>${cap(s.do)}</b>.`],
        finalAnswer: cap(s.do),
      };
    },
    () => {
      const c = choice('Less fuel has to be burnt, so less carbon dioxide is put into the air', ['It makes the Sun shine more', 'It makes the wind blow harder', 'It creates brand new energy'], 4);
      return {
        prompt: 'Harper turns off the lights she is not using. Apart from a smaller power bill, why does that help?',
        answer: ans(c),
        hint: 'Where does the last bit of our electricity come from, on a dry or still day?',
        working: [
          '<b>Picture:</b> the last slice of the pie is gas and coal.',
          '1. The power we save comes off the top of the mix — the fuel-burning part.',
          '2. Burning less fuel = less <b>carbon dioxide</b> in the air.',
          'It also leaves more water in the hydro lakes for a dry month.',
        ],
        finalAnswer: 'Less fuel is burnt, so less carbon dioxide is released',
      };
    },
    () => {
      const c = choice('Geothermal — there is hot rock close to the surface there', ['Tidal — it is beside the sea', 'Hydro — the ground is flat', 'Coal — the ground is warm'], 4);
      return {
        prompt: 'Steam rises out of the ground all around Rotorua and Taupō. Which power station suits that area, and why?',
        answer: ans(c),
        hint: 'Why is the ground hot there? Think about what is under the central North Island.',
        working: [
          '<b>Picture:</b> steam pouring out of the ground at Wairākei.',
          '1. Hot rock sits close to the surface in the volcanic zone.',
          '2. Water pumped down comes back as steam.',
          '3. The steam spins a turbine.',
          'So <b>geothermal</b> is the right choice there — and it runs day and night.',
        ],
        finalAnswer: 'Geothermal — hot rock sits near the surface',
      };
    },
    () => {
      const f = R.pick(FOSSIL);
      const c = choice('Carbon dioxide, which traps extra heat in the atmosphere', ['Pure oxygen, which is harmless', 'Nitrogen, which is 78% of the air anyway', 'Nothing at all comes out'], 4);
      return {
        prompt: `A power station burns <b>${f.name}</b> to boil water. What comes out of the chimney, and why does it matter?`,
        answer: ans(c),
        hint: 'All fossil fuels are made of carbon. What does carbon plus oxygen make?',
        working: [
          `<b>Picture:</b> ${f.pic}.`,
          '1. Fossil fuels are made of <b>carbon</b> from ancient living things.',
          '2. Burning joins that carbon with oxygen → <b>carbon dioxide</b>.',
          '3. Carbon dioxide traps extra heat, which warms the climate.',
        ],
        finalAnswer: 'Carbon dioxide — it traps extra heat',
      };
    },
    () => {
      const c = choice('It is renewable, but its fuel arrives only when the Sun shines', ['It is non-renewable, because panels wear out', 'It is renewable, so it has no downsides at all', 'It is non-renewable, because sunlight runs out'], 4);
      return {
        prompt: 'Harper writes: "Solar power is renewable so it is perfect." Her teacher says that is only half right. Why?',
        answer: ans(c),
        hint: 'Renewable answers "will it run out?" It does not answer "can I rely on it?"',
        working: [
          '<b>Picture:</b> the panels on a roof at 9 p.m. in July — doing nothing.',
          '1. Will sunlight run out? No, so it is <b>renewable</b>.',
          '2. Is it there whenever we want it? No — not at night, and less in winter.',
          'So: renewable, but not always available. Every resource has a catch.',
        ],
        finalAnswer: 'Renewable, but only available when the Sun shines',
      };
    },
    () => {
      const a = R.pick(MIX), b = R.pick(MIX.filter((m) => m !== a));
      const big = a.pct > b.pct ? a : b;
      const c = choice(big.name, [a === big ? b.name : a.name], 2);
      return {
        visual: mixBarSvg(),
        prompt: `Harper is checking her homework against this chart. Which gives us more power, <b>${a.name}</b> or <b>${b.name}</b>?`,
        answer: ans(c),
        hint: 'Read both bars and compare the numbers, not just the colours.',
        working: [`${cap(a.name)} = ${a.pct}%.`, `${cap(b.name)} = ${b.pct}%.`, `<b>${cap(big.name)}</b> is bigger.`],
        finalAnswer: big.name,
      };
    },
    () => {
      const c = choice('So there is always something to fall back on when one resource is short', ['Because one resource is illegal', 'To make the electricity travel faster', 'Because each city needs a different kind'], 4);
      return {
        visual: mixPieSvg(),
        prompt: 'Why does New Zealand use a MIX of resources instead of just the cheapest one?',
        answer: ans(c),
        hint: 'What happens if the lakes are low, or the wind stops, or it is night?',
        working: [
          '<b>Picture:</b> the pie chart has six slices, not one.',
          '1. Hydro needs rain. Wind needs wind. Solar needs daylight.',
          '2. If one runs short, another can cover it.',
          'So a mix keeps the lights on — that is why the pie has many slices.',
        ],
        finalAnswer: 'So one resource being short does not black out the country',
      };
    },
  ];

  HL.registerTopic({
    id: 'energy-resources', subject: 'science', strand: 'physical', order: 8,
    name: 'Energy resources', short: 'Energy resources', animal: 'bee',
    blurb: 'Where our electricity actually comes from — and which resources run out.',
    example: 'hydro, wind, sun = renewable · coal, oil, gas = run out',
    learn: {
      what: '<p>An <b>energy resource</b> is something we take energy from to make electricity. <b>Renewable</b> ones keep being topped up by nature — sun, wind, rain, tides and hot rock. <b>Non-renewable</b> ones are the <b>fossil fuels</b> (coal, oil and natural gas): buried living things squashed for millions of years, so once we burn them they are gone, and burning them releases <b>carbon dioxide</b>.</p><p>Aotearoa is unusual: about <b>80–85%</b> of our electricity is already renewable, mostly <b>hydro</b> from the South Island lakes and the Waikato River, plus <b>geothermal</b> steam around Taupō and Rotorua and a lot of <b>wind</b>.</p><p><b>Picture for this topic:</b> renewable is a <b>tap you cannot turn off</b>; non-renewable is a <b>bucket that empties</b>.</p>',
      visual: mixPieSvg(),
      facts: [
        '<b>Renewable</b> = keeps being made: hydro, wind, solar, geothermal, tidal, biomass.',
        '<b>Non-renewable</b> = a fixed amount that runs out: coal, oil, natural gas (and nuclear fuel).',
        '<b>Fossil fuels</b> formed from living things buried for <b>millions of years</b>; burning them gives off <b>carbon dioxide</b>.',
        'NZ electricity is roughly <b>hydro 57% · geothermal 18% · gas 11% · wind 7% · coal 5% · solar 2%</b> — about <b>84% renewable</b>.',
        'A hydro dam’s energy chain: <b>gravitational potential → kinetic → electrical</b>.',
        'Renewable does <b>not</b> mean perfect: dams flood valleys, wind needs wind, solar stops at night.',
      ],
      steps: [
        'Ask "<b>will nature make more of this?</b>" Sun, wind, rain, tides, hot rock and trees → <b>renewable</b>. Dug out of the ground as coal, oil or gas → <b>non-renewable</b>.',
        'To explain how a station works, say the same story every time: <b>something spins a turbine, and the turbine spins a generator</b>. Only the "something" changes — falling water, wind, steam, or steam from burning fuel.',
        'For advantages and disadvantages, always give <b>one of each</b>. Good: no carbon dioxide, cheap to run, reliable. Bad: floods a valley, only works in the wind, still makes carbon dioxide, will run out.',
        'To read an energy chart: find the <b>biggest bar or slice</b> first, check the <b>numbers add to 100%</b>, then answer.',
        'Saving energy at home is worth it because the last bit of our power comes from <b>burning gas and coal</b> — using less means burning less.',
      ],
      examples: [
        {
          q: 'Is geothermal renewable or non-renewable?',
          working: ['<b>Picture:</b> a tap you cannot turn off vs a bucket that empties.', '1. Where does the energy come from? Hot rock deep underground.', '2. Will the rock go cold if we use it? No — the Earth keeps making that heat.', 'So geothermal is <b>renewable</b>.'],
          a: 'Renewable',
        },
        {
          q: 'Sort these onto the right side: wind, coal, tidal, natural gas.',
          visual: sortSvg('tidal'),
          working: [
            '<b>Picture:</b> tap that never stops vs bucket that empties.',
            '1. Wind — nature keeps making it → <b>renewable</b>.',
            '2. Coal — a fixed amount buried underground → <b>non-renewable</b>.',
            '3. Tidal — the Moon keeps pulling the sea → <b>renewable</b>.',
            '4. Natural gas — dug out of Taranaki, will run out → <b>non-renewable</b>.',
          ],
          a: 'Renewable: wind, tidal. Non-renewable: coal, natural gas',
        },
        {
          q: 'Explain how a hydro station makes electricity, using energy words.',
          visual: damSvg(),
          working: [
            '<b>Picture:</b> a full lake sitting high above the power station.',
            '1. Water held high in the lake = <b>gravitational potential</b> energy.',
            '2. It rushes down the pipe = <b>kinetic</b> energy.',
            '3. It spins the turbine, which spins the generator = <b>electrical</b> energy.',
          ],
          a: 'gravitational potential → kinetic → electrical',
        },
        {
          q: 'Give one advantage and one disadvantage of wind power.',
          working: [
            '<b>Picture:</b> the blades on the Manawatū hills turning in a gale.',
            '1. Advantage: no fuel to buy and <b>no carbon dioxide</b>.',
            '2. Disadvantage: on a still day it makes <b>almost nothing</b>.',
            'Renewable does not mean perfect — always write both sides.',
          ],
          a: 'Advantage: no carbon dioxide. Disadvantage: it needs wind to blow',
        },
        {
          q: 'Read the chart: how much more of our electricity comes from hydro than from wind?',
          visual: mixBarSvg('hydro'),
          working: ['1. Find the hydro bar: <b>57%</b>.', '2. Find the wind bar: <b>7%</b>.', '3. Subtract: 57 − 7 = <b>50</b>.', 'So hydro gives 50 percentage points more.'],
          a: '50% more',
        },
        {
          q: 'A pie chart shows hydro 57%, geothermal 18%, gas 11%, wind 7%, coal 5%. What percentage is left for solar?',
          working: [
            '<b>Rule:</b> the whole pie is always 100%.',
            '1. Add the slices shown: 57 + 18 + 11 + 7 + 5 = 98.',
            '2. 100 − 98 = <b>2%</b>.',
            'Solar is small in the national mix — but growing fast on house roofs.',
          ],
          a: '2%',
        },
        {
          q: 'Harper’s family swaps ten 60 W bulbs for 8 W LEDs, and the lights are on 4 hours a night. How much power do they save, and why does it matter?',
          working: [
            '<b>Picture:</b> energy leaking out of the house like water out of a holey bucket.',
            '1. Saving per bulb = 60 − 8 = <b>52 W</b>.',
            '2. Ten bulbs = 52 × 10 = <b>520 W</b>.',
            '3. In 4 hours = 520 × 4 = <b>2080 Wh</b> a night.',
            '4. Why it matters: the last slice of our power comes from burning gas and coal, so using less means <b>less carbon dioxide</b> (and a smaller bill).',
          ],
          a: '520 W saved while they are on — about 2080 Wh a night',
        },
      ],
      tips: [
        'Renewable means "<b>will not run out</b>", not "no problems". Dams flood valleys and wind farms need wind.',
        'Coal, oil and gas are the <b>fossil</b> fuels — millions of years old. Wood chips burn too, but the trees can be regrown, so biomass counts as renewable.',
        'Do not say a power station "makes energy". It <b>transfers</b> energy from a resource into electricity.',
        'On a chart, always check the slices add up to <b>100%</b> before you answer.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [typeQ, sortCard, howQ, nameFromHow, nzFactQ, mixReadChoice, fossilQ]
        : level === 2
          ? [typeQ, sortCard, howQ, nameFromHow, advDisQ, fossilQ, nzFactQ, mixReadNumber, mixCompare, savingQ, hydroChain, bulbSaving]
          : [advDisQ, notPerfectQ, mixCompare, mixSum, renewableTotal, missingSlice, unitsFromPct, bulbSaving, hydroChain, fossilQ, savingQ, howQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
