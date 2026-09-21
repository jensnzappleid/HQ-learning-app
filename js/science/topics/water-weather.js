/* Topic: Water & Weather — the water cycle, clouds, weather vs climate, and measuring the weather. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const STAGES = [
    { n: 'evaporation', what: 'liquid water is heated by the Sun and turns into invisible water vapour', where: 'from the sea, lakes and puddles', pic: 'a puddle disappearing on a hot day' },
    { n: 'transpiration', what: 'plants give off water vapour through tiny holes in their leaves', where: 'from trees and grass', pic: 'a forest quietly breathing out water' },
    { n: 'condensation', what: 'water vapour cools high up and turns back into tiny water droplets', where: 'up in the sky, making clouds', pic: 'mist on a cold window' },
    { n: 'precipitation', what: 'the droplets join up until they are heavy enough to fall as rain, hail or snow', where: 'out of the clouds', pic: 'a sponge that can hold no more water' },
    { n: 'collection', what: 'the water gathers in rivers, lakes, the sea and underground', where: 'back on the ground', pic: 'everything running downhill to the sea' },
  ];
  const CYCLE = ['evaporation', 'condensation', 'precipitation', 'collection'];

  const INSTRUMENTS = [
    { n: 'thermometer', m: 'temperature', unit: '°C (degrees Celsius)', pic: 'a thin tube with coloured liquid that climbs when it warms up' },
    { n: 'rain gauge', m: 'rainfall', unit: 'mm (millimetres)', pic: 'an open jar with a scale up the side' },
    { n: 'anemometer', m: 'wind speed', unit: 'km/h (kilometres per hour)', pic: 'little cups that spin round faster in strong wind' },
    { n: 'wind vane', m: 'wind direction', unit: 'a compass direction, like NW', pic: 'an arrow on a pole that points into the wind' },
    { n: 'barometer', m: 'air pressure', unit: 'hPa (hectopascals)', pic: 'a dial that shows whether the air is pressing harder or softer' },
  ];

  const CLOUDS = [
    { n: 'cumulus', what: 'puffy cotton-wool clouds — usually fair weather', hi: 'low and lumpy' },
    { n: 'stratus', what: 'a flat grey sheet covering the whole sky — drizzle', hi: 'low and flat' },
    { n: 'cirrus', what: 'thin wispy streaks made of ice crystals, very high up', hi: 'very high and feathery' },
    { n: 'cumulonimbus', what: 'a towering dark cloud — thunderstorms, hail and heavy rain', hi: 'huge and tall' },
  ];

  const WEATHER_OR_CLIMATE = [
    { s: 'It is 24 °C and sunny in Nelson today', a: 'weather' },
    { s: 'Rain is forecast for Wellington tomorrow', a: 'weather' },
    { s: 'A southerly is blowing right now', a: 'weather' },
    { s: 'It hailed during lunchtime', a: 'weather' },
    { s: 'Fiordland gets more than 6 metres of rain in an average year', a: 'climate' },
    { s: 'Central Otago has hot dry summers and cold winters, year after year', a: 'climate' },
    { s: 'Auckland is warmer than Invercargill on average', a: 'climate' },
    { s: 'New Zealand summers are in December, January and February', a: 'climate' },
    { s: 'There is a frost on the ground this morning', a: 'weather' },
    { s: 'The average July temperature in Christchurch is about 7 °C', a: 'climate' },
  ];

  const WIND_DIRS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- diagrams ---------- */
  function waterCycleSvg(hi) {
    const lab = (x, y, t, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" fill="${hi === t ? '#E0568C' : '#4A4033'}" font-size="11.5">${hi === t ? '? ? ?' : t}</text>`;
    return `<svg viewBox="0 0 350 212" width="350" height="212" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="350" height="212" fill="#EAF6FD"/>
      <circle cx="26" cy="26" r="18" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <path d="M 106 158 L 190 128 L 260 148 L 350 148 L 350 204 L 106 204 Z" fill="#8FC96E" stroke="#6FA04C" stroke-width="1.5"/>
      <rect x="0" y="158" width="107" height="46" fill="#A9D8F5" stroke="#5F98C4" stroke-width="1.5"/>
      <text x="52" y="196" text-anchor="middle" fill="#4A4033" font-size="11.5">the sea</text>
      <ellipse cx="150" cy="54" rx="48" ry="22" fill="#FFFFFF" stroke="#8A7B63" stroke-width="1.5"/>
      <ellipse cx="120" cy="60" rx="28" ry="17" fill="#FFFFFF" stroke="#8A7B63" stroke-width="1.5"/>
      <ellipse cx="180" cy="60" rx="28" ry="17" fill="#FFFFFF" stroke="#8A7B63" stroke-width="1.5"/>
      <path d="M 58 150 C 54 118 66 96 92 82" fill="none" stroke="#5F98C4" stroke-width="3"/>
      <polygon points="100,78 88,80 94,90" fill="#5F98C4"/>
      ${lab(46, 120, 'evaporation')}
      <line x1="238" y1="42" x2="200" y2="50" stroke="#8A7B63" stroke-width="1.5"/>
      ${lab(288, 38, 'condensation')}
      ${[140, 158, 176].map((x) => `<line x1="${x}" y1="80" x2="${x - 6}" y2="110" stroke="#5F98C4" stroke-width="3"/>`).join('')}
      ${lab(228, 106, 'precipitation')}
      <path d="M 250 152 L 190 140 L 118 166" fill="none" stroke="#5F98C4" stroke-width="4"/>
      <polygon points="110,170 124,166 122,176" fill="#5F98C4"/>
      ${lab(206, 190, 'collection')}
      <path d="M 300 130 L 300 148" stroke="#6FA04C" stroke-width="5"/>
      <circle cx="300" cy="122" r="13" fill="#6FA04C"/>
      <line x1="300" y1="106" x2="300" y2="90" stroke="#6FA04C" stroke-width="2.5"/>
      <polygon points="300,84 295,96 305,96" fill="#6FA04C"/>
      <text x="300" y="78" text-anchor="middle" fill="#6FA04C" font-size="11">transpiration</text>
    </svg>`;
  }

  function thermometerSvg(v) {
    const top = 26, bottom = 158, max = 40, min = -10;
    const y = (t) => bottom - ((t - min) / (max - min)) * (bottom - top);
    let ticks = '';
    for (let t = min; t <= max; t += 2) {
      const big = t % 10 === 0;
      ticks += `<line x1="${big ? 44 : 50}" y1="${y(t)}" x2="60" y2="${y(t)}" stroke="#4A4033" stroke-width="${big ? 2 : 1}"/>`;
      if (big) ticks += `<text x="40" y="${y(t) + 4}" text-anchor="end" fill="#4A4033" font-size="12">${t}</text>`;
    }
    return `<svg viewBox="0 0 210 190" width="210" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="210" height="190" fill="#FFFFFF"/>
      <rect x="62" y="20" width="20" height="146" rx="10" fill="#F2ECE0" stroke="#4A4033" stroke-width="2"/>
      <rect x="66" y="${y(v)}" width="12" height="${166 - y(v)}" fill="#E0568C"/>
      <circle cx="72" cy="168" r="14" fill="#E0568C" stroke="#4A4033" stroke-width="2"/>
      ${ticks}
      <text x="104" y="40" fill="#4A4033" font-size="12">read the</text>
      <text x="104" y="56" fill="#4A4033" font-size="12">temperature</text>
      <text x="104" y="72" fill="#8A7B63" font-size="12">in °C</text>
    </svg>`;
  }

  function rainGaugeSvg(v) {
    const top = 30, bottom = 158, max = 50;
    const y = (mm) => bottom - (mm / max) * (bottom - top);
    let ticks = '';
    for (let mm = 0; mm <= max; mm += 5) {
      const big = mm % 10 === 0;
      ticks += `<line x1="${big ? 92 : 98}" y1="${y(mm)}" x2="106" y2="${y(mm)}" stroke="#4A4033" stroke-width="${big ? 2 : 1}"/>`;
      if (big) ticks += `<text x="88" y="${y(mm) + 4}" text-anchor="end" fill="#4A4033" font-size="12">${mm}</text>`;
    }
    return `<svg viewBox="0 0 230 190" width="230" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="230" height="190" fill="#FFFFFF"/>
      <polygon points="96,16 152,16 144,30 104,30" fill="#DCEEF9" stroke="#5F98C4" stroke-width="1.5"/>
      <rect x="106" y="30" width="38" height="130" fill="#F4FBFF" stroke="#4A4033" stroke-width="2"/>
      <rect x="108" y="${y(v)}" width="34" height="${158 - y(v)}" fill="#A9D8F5"/>
      ${ticks}
      <text x="156" y="46" fill="#4A4033" font-size="12">rain gauge</text>
      <text x="156" y="62" fill="#8A7B63" font-size="12">scale in mm</text>
      <text x="115" y="180" fill="#8A7B63" font-size="11.5">how much rain fell?</text>
    </svg>`;
  }

  function instrumentPicSvg(kind) {
    const frame = (inner, cap) => `<svg viewBox="0 0 240 176" width="240" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="240" height="176" fill="#FFFFFF"/>${inner}
      <text x="120" y="166" text-anchor="middle" fill="#8A7B63" font-size="12">${cap}</text></svg>`;
    if (kind === 'anemometer') {
      return frame(`<line x1="120" y1="60" x2="120" y2="140" stroke="#4A4033" stroke-width="4"/>
        ${[0, 120, 240].map((a) => { const r = (a * Math.PI) / 180; const x = 120 + 46 * Math.cos(r), y = 60 + 26 * Math.sin(r); return `<line x1="120" y1="60" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#4A4033" stroke-width="3"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="12" ry="9" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>`; }).join('')}
        <path d="M 156 34 a 22 22 0 0 1 16 16" fill="none" stroke="#E0568C" stroke-width="2.5"/>
        <polygon points="176,54 166,48 174,42" fill="#E0568C"/>`, 'what does this measure?');
    }
    if (kind === 'wind vane') {
      return frame(`<line x1="120" y1="46" x2="120" y2="146" stroke="#4A4033" stroke-width="4"/>
        <polygon points="66,60 168,60 168,50 194,66 168,82 168,72 66,72" fill="#E9A07A" stroke="#4A4033" stroke-width="2"/>
        <text x="34" y="70" fill="#4A4033" font-size="12">W</text>
        <text x="208" y="70" fill="#4A4033" font-size="12">E</text>
        <text x="120" y="34" text-anchor="middle" fill="#4A4033" font-size="12">N</text>`, 'what does this measure?');
    }
    if (kind === 'barometer') {
      return frame(`<circle cx="120" cy="82" r="52" fill="#F6EEDC" stroke="#4A4033" stroke-width="3"/>
        <line x1="120" y1="82" x2="152" y2="52" stroke="#E0568C" stroke-width="4"/>
        <text x="76" y="118" fill="#4A4033" font-size="11">low</text>
        <text x="152" y="118" fill="#4A4033" font-size="11">high</text>
        <text x="120" y="146" text-anchor="middle" fill="#4A4033" font-size="11.5">hPa</text>`, 'what does this measure?');
    }
    if (kind === 'rain gauge') {
      return frame(`<polygon points="92,30 148,30 140,44 100,44" fill="#DCEEF9" stroke="#5F98C4" stroke-width="1.5"/>
        <rect x="102" y="44" width="36" height="96" fill="#F4FBFF" stroke="#4A4033" stroke-width="2"/>
        <rect x="104" y="104" width="32" height="34" fill="#A9D8F5"/>
        ${[0, 1, 2, 3, 4].map((i) => `<line x1="130" y1="${52 + i * 20}" x2="138" y2="${52 + i * 20}" stroke="#4A4033" stroke-width="1.5"/>`).join('')}`, 'what does this measure?');
    }
    return frame(`<rect x="108" y="24" width="20" height="112" rx="10" fill="#F2ECE0" stroke="#4A4033" stroke-width="2"/>
      <rect x="112" y="84" width="12" height="52" fill="#E0568C"/>
      <circle cx="118" cy="138" r="13" fill="#E0568C" stroke="#4A4033" stroke-width="2"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="96" y1="${34 + i * 18}" x2="108" y2="${34 + i * 18}" stroke="#4A4033" stroke-width="1.5"/>`).join('')}`, 'what does this measure?');
  }

  function tempGraphSvg(vals, days) {
    const x0 = 40, y0 = 156, w = 280, h = 118;
    const max = 30;
    const px = (i) => x0 + (i + 0.5) * (w / vals.length);
    const py = (v) => y0 - (v / max) * h;
    let s = `<svg viewBox="0 0 340 190" width="340" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="190" fill="#FFFFFF"/>
      <line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="#4A4033" stroke-width="2"/>
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="26" stroke="#4A4033" stroke-width="2"/>`;
    for (let v = 0; v <= max; v += 10) {
      s += `<line x1="${x0 - 5}" y1="${py(v)}" x2="${x0 + w}" y2="${py(v)}" stroke="#E7DCC8" stroke-width="1"/>`;
      s += `<text x="${x0 - 9}" y="${py(v) + 4}" text-anchor="end" fill="#4A4033" font-size="12">${v}</text>`;
    }
    s += `<polyline points="${vals.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#E0568C" stroke-width="3"/>`;
    vals.forEach((v, i) => { s += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4" fill="#E0568C"/>`; });
    days.forEach((d, i) => { s += `<text x="${px(i).toFixed(1)}" y="${y0 + 17}" text-anchor="middle" fill="#4A4033" font-size="12">${d}</text>`; });
    s += `<text x="14" y="20" fill="#8A7B63" font-size="12">°C</text>`;
    return s + '</svg>';
  }

  function weatherTable(rows) {
    return `<table class="data"><tr><th>day</th><th>max temp</th><th>rain</th><th>wind</th></tr>${
      rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]} °C</td><td>${r[2]} mm</td><td>${r[3]}</td></tr>`).join('')}</table>`;
  }

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  function makeRows() {
    return DAYS.map((d) => [d, R.int(9, 26), R.pick([0, 0, 1, 2, 4, 6, 9, 12, 15, 20]), R.pick(['light NW', 'strong SW', 'calm', 'gusty S', 'light NE'])]);
  }

  /* ---------- question makers ---------- */
  function stageNameQ(level) {
    const st = R.pick(STAGES);
    if (R.chance(0.5)) {
      const c = choice(st.n, STAGES.map((x) => x.n), 4);
      return {
        visual: R.chance(0.4) ? waterCycleSvg() : undefined,
        prompt: `In the water cycle, what is it called when <b>${st.what}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `It happens ${st.where}.`,
        working: [`<b>Picture:</b> ${st.pic}.`, `That stage is <b>${st.n}</b>.`],
        finalAnswer: st.n, skill: 'water-cycle',
      };
    }
    const c = choice(st.what, STAGES.map((x) => x.what), 4);
    return {
      prompt: `What happens during <b>${st.n}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `Picture ${st.pic}.`,
      working: [`<b>Picture:</b> ${st.pic}.`, `In ${st.n}, <b>${st.what}</b>.`],
      finalAnswer: st.what, skill: 'water-cycle',
    };
  }

  function cycleOrderQ(level) {
    const i = R.int(0, CYCLE.length - 1);
    const next = CYCLE[(i + 1) % CYCLE.length];
    const c = choice(next, STAGES.map((x) => x.n), 4);
    return {
      visual: waterCycleSvg(next),
      prompt: `The water cycle goes round and round. What comes straight <b>after ${CYCLE[i]}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'evaporation → condensation → precipitation → collection → and round again.',
      working: ['<b>Picture:</b> water going up as invisible vapour, cooling into clouds, falling as rain, running back to the sea.', `Order: ${CYCLE.join(' → ')} → (back to the start).`, `After ${CYCLE[i]} comes <b>${next}</b>.`],
      finalAnswer: next, skill: 'water-cycle',
    };
  }

  function instrumentQ(level) {
    const it = R.pick(INSTRUMENTS);
    const style = R.pick(['measures', 'which', 'unit', 'pic']);
    if (style === 'measures') {
      const c = choice(it.m, INSTRUMENTS.map((x) => x.m), 4);
      return {
        prompt: `What does a <b>${it.n}</b> measure?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `It looks like ${it.pic}.`,
        working: [`<b>Picture:</b> ${it.pic}.`, `A ${it.n} measures <b>${it.m}</b>, in ${it.unit}.`],
        finalAnswer: it.m, skill: 'instruments',
      };
    }
    if (style === 'which') {
      const c = choice(it.n, INSTRUMENTS.map((x) => x.n), 4);
      return {
        prompt: `Which instrument would you use to measure <b>${it.m}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `You are looking for ${it.pic}.`,
        working: [`<b>Picture:</b> ${it.pic}.`, `That is a <b>${it.n}</b>.`],
        finalAnswer: it.n, skill: 'instruments',
      };
    }
    if (style === 'unit') {
      const c = choice(it.unit, INSTRUMENTS.map((x) => x.unit), 4);
      return {
        prompt: `What units is <b>${it.m}</b> measured in?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `You would read it off a ${it.n}.`,
        working: [`A ${it.n} measures ${it.m}.`, `The units are <b>${it.unit}</b>.`],
        finalAnswer: it.unit, skill: 'instruments',
      };
    }
    const c = choice(it.m, INSTRUMENTS.map((x) => x.m), 4);
    return {
      visual: instrumentPicSvg(it.n),
      prompt: 'Look at the weather instrument. What does it measure?',
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `It is ${it.pic}.`,
      working: [`<b>Picture:</b> ${it.pic}.`, `That is a <b>${it.n}</b>, so it measures <b>${it.m}</b>.`],
      finalAnswer: it.m, skill: 'instruments',
    };
  }

  function readThermometerQ(level) {
    const v = level === 1 ? R.int(-1, 8) * 5 : R.step(-8, 38, 2);
    return {
      visual: thermometerSvg(v),
      prompt: 'What temperature does this thermometer show?',
      answer: { type: 'number', value: v, unit: '°C', placeholder: 'e.g. 18' },
      hint: 'Find the nearest labelled line, then count the small marks. Each small mark is 2 °C.',
      working: ['<b>Picture:</b> a ladder — the big labelled rungs are 10 apart, the small ones are 2 apart.', '1. Find the labelled line just below the top of the red.', '2. Count small marks up from it, 2 each.', `The reading is <b>${v} °C</b>.`],
      finalAnswer: `${v} °C`, skill: 'reading',
    };
  }

  function readRainGaugeQ(level) {
    const v = level === 1 ? R.int(1, 10) * 5 : R.int(1, 19) * 2.5;
    const val = Math.round(v * 10) / 10;
    return {
      visual: rainGaugeSvg(val),
      prompt: 'How much rain has fallen into this rain gauge?',
      answer: { type: 'number', value: val, unit: 'mm', tolerance: 0.01, placeholder: 'e.g. 25' },
      hint: 'Read at the top of the water. Labelled lines are 10 mm apart, small ones 5 mm.',
      working: ['<b>Picture:</b> a measuring jug — read the number where the water stops.', '1. Find the labelled line just below the water level.', '2. Add on the small marks (5 mm each).', `The reading is <b>${val} mm</b>.`],
      finalAnswer: `${val} mm`, skill: 'reading',
    };
  }

  function weatherClimateQ(level) {
    const it = R.pick(WEATHER_OR_CLIMATE);
    const c = choice(it.a, ['weather', 'climate'], 2);
    return {
      prompt: `Is this <b>weather</b> or <b>climate</b>?<br>"${it.s}"`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Weather = what it is doing right now or this week. Climate = the usual pattern over many years.',
      working: ['<b>Picture:</b> weather is what you wear today; climate is what is in your wardrobe.', `1. Is this about right now, or about the usual pattern over years? ${it.a === 'weather' ? 'Right now.' : 'The usual pattern.'}`, `So it is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'weather-climate',
    };
  }

  function cloudQ(level) {
    const cl = R.pick(CLOUDS);
    if (R.chance(0.5)) {
      const c = choice(cl.what, CLOUDS.map((x) => x.what), 4);
      return {
        prompt: `What are <b>${cl.n}</b> clouds like?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `They are ${cl.hi}.`,
        working: ['<b>Picture:</b> looking up and describing the shape.', `${cl.n.charAt(0).toUpperCase() + cl.n.slice(1)}: <b>${cl.what}</b>.`],
        finalAnswer: cl.what, skill: 'clouds',
      };
    }
    const c = choice(cl.n, CLOUDS.map((x) => x.n), 4);
    return {
      prompt: `Which cloud is described here: <b>${cl.what}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `It is ${cl.hi}.`,
      working: ['<b>Picture:</b> looking up at the sky and naming the shape.', `That is <b>${cl.n}</b>.`],
      finalAnswer: cl.n, skill: 'clouds',
    };
  }

  function pressureQ(level) {
    const items = [
      { q: 'What does <b>high air pressure</b> usually bring?', a: 'Settled, clear, calm weather', wrongs: ['Rain and storms', 'Snow', 'Strong winds and cloud'],
        w: ['<b>Picture:</b> air gently sinking, pressing down and squashing clouds away.', 'High pressure (an <b>anticyclone</b>) → <b>settled, clear</b> weather.'] },
      { q: 'What does <b>low air pressure</b> usually bring?', a: 'Cloud, rain and wind', wrongs: ['Clear blue skies', 'Frost and calm', 'Very hot dry days'],
        w: ['<b>Picture:</b> air rising, cooling as it goes, and making clouds.', 'Low pressure (a <b>depression</b>) → <b>cloud, rain and wind</b>.'] },
      { q: 'What is a <b>cold front</b>?', a: 'The edge where a colder air mass pushes in under warmer air', wrongs: ['A wall of cloud that never moves', 'The coldest hour of the day', 'The edge of a high pressure zone'],
        w: ['<b>Picture:</b> cold air is heavier, so it shoves in underneath and lifts the warm air up.', 'The warm air rises quickly → tall clouds, a burst of rain, then it turns colder.'] },
      { q: 'The barometer needle drops quickly. What is most likely coming?', a: 'A storm — falling pressure means bad weather is on the way', wrongs: ['A hot sunny day', 'A calm clear night', 'Nothing changes'],
        w: ['<b>Picture:</b> the needle sliding down towards "low".', '1. Falling pressure = air rising = clouds forming.', 'So expect <b>wind and rain</b>.'] },
      { q: 'Why does most of New Zealand&rsquo;s rain fall on the west of the South Island?', a: 'Wet westerly wind is forced up over the Alps and drops its rain', wrongs: ['The sea is warmer on the west', 'The Alps make their own clouds', 'The east coast is closer to Australia'],
        w: ['<b>Picture:</b> squeezing a wet sponge as it is pushed up a hill.', '1. Westerly winds come off the Tasman Sea, full of water.', '2. The Southern Alps force the air up; it cools and the water condenses.', 'The west gets drenched (Fiordland: 6+ m a year) and the east stays dry.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'High pressure = sinking air = fine. Low pressure = rising air = clouds and rain.',
      working: it.w, finalAnswer: it.a, skill: 'pressure',
    };
  }

  function windQ(level) {
    const d = R.pick(WIND_DIRS);
    const c = choice(`It is blowing from the ${d}`, [`It is blowing towards the ${d}`, 'It is blowing straight up', 'It tells you the wind speed'], 4);
    return {
      visual: R.chance(0.5) ? instrumentPicSvg('wind vane') : undefined,
      prompt: `A wind vane's arrow points to the <b>${d}</b>. What does that tell you?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Winds are always named after where they come FROM. A southerly comes from the south.',
      working: ['<b>Picture:</b> the arrow swings round and points into the wind, like a weathercock.', `1. The arrow points where the wind is <b>coming from</b>.`, `So it is blowing <b>from the ${d}</b> — a ${d}erly.`],
      finalAnswer: `From the ${d}`, skill: 'instruments',
    };
  }

  function tableQ(level) {
    const rows = makeRows();
    const style = R.pick(['warmest', 'wettest', 'total', 'coolest']);
    if (style === 'warmest' || style === 'coolest') {
      const want = style === 'warmest' ? Math.max(...rows.map((r) => r[1])) : Math.min(...rows.map((r) => r[1]));
      const day = rows.find((r) => r[1] === want)[0];
      const c = choice(day, DAYS, 4);
      return {
        visual: weatherTable(rows),
        prompt: `Look at the weather table. Which day was the <b>${style === 'warmest' ? 'warmest' : 'coolest'}</b>?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `Run your finger down the temperature column and find the ${style === 'warmest' ? 'biggest' : 'smallest'} number.`,
        working: ['<b>Picture:</b> a finger sliding down one column only.', `1. Temperatures: ${rows.map((r) => r[1]).join(', ')}.`, `2. The ${style} is ${want} °C.`, `That was <b>${day}</b>.`],
        finalAnswer: day, skill: 'data',
      };
    }
    if (style === 'wettest') {
      const want = Math.max(...rows.map((r) => r[2]));
      const day = rows.find((r) => r[2] === want)[0];
      const c = choice(day, DAYS, 4);
      return {
        visual: weatherTable(rows),
        prompt: 'Look at the weather table. Which day had the <b>most rain</b>?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Use the rain column only.',
        working: ['<b>Picture:</b> a finger sliding down the rain column.', `1. Rainfall: ${rows.map((r) => r[2]).join(', ')} mm.`, `2. The biggest is ${want} mm — that is <b>${day}</b>.`],
        finalAnswer: day, skill: 'data',
      };
    }
    const total = rows.reduce((a, r) => a + r[2], 0);
    return {
      visual: weatherTable(rows),
      prompt: 'What was the <b>total rainfall</b> for the whole week shown in the table?',
      answer: { type: 'number', value: total, unit: 'mm', placeholder: 'e.g. 24' },
      hint: 'Add up every number in the rain column.',
      working: ['<b>Picture:</b> tipping all five rain gauges into one jug.', `${rows.map((r) => r[2]).join(' + ')} = <b>${total}</b> mm.`],
      finalAnswer: `${total} mm`, skill: 'data',
    };
  }

  function graphQ(level) {
    const vals = DAYS.map(() => R.int(6, 28));
    const style = R.pick(['read', 'highest', 'range', 'mean']);
    if (style === 'read') {
      const i = R.int(0, DAYS.length - 1);
      return {
        visual: tempGraphSvg(vals, DAYS),
        prompt: `Read the graph. What was the temperature on <b>${DAYS[i]}</b>?`,
        answer: { type: 'number', value: vals[i], unit: '°C', placeholder: 'e.g. 18' },
        hint: `Go up from ${DAYS[i]} until you reach the dot, then straight across to the °C scale.`,
        working: ['<b>Picture:</b> going up from the day, then straight across to the number.', `1. Find ${DAYS[i]} on the bottom.`, '2. Go up to the dot, then left to the scale.', `It reads <b>${vals[i]} °C</b>.`],
        finalAnswer: `${vals[i]} °C`, skill: 'data',
      };
    }
    if (style === 'highest') {
      const max = Math.max(...vals);
      const day = DAYS[vals.indexOf(max)];
      const c = choice(day, DAYS, 4);
      return {
        visual: tempGraphSvg(vals, DAYS),
        prompt: 'On which day was the temperature <b>highest</b>?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Look for the highest dot on the line.',
        working: ['<b>Picture:</b> the highest point on the hill.', `Readings: ${vals.join(', ')} °C.`, `The highest is ${max} °C, on <b>${day}</b>.`],
        finalAnswer: day, skill: 'data',
      };
    }
    if (style === 'range') {
      const max = Math.max(...vals), min = Math.min(...vals);
      return {
        visual: tempGraphSvg(vals, DAYS),
        prompt: 'What is the <b>range</b> of the temperatures on this graph? <span class="muted">(highest − lowest)</span>',
        answer: { type: 'number', value: max - min, unit: '°C', placeholder: 'e.g. 9' },
        hint: 'Find the highest dot and the lowest dot, then subtract.',
        working: ['<b>Picture:</b> the gap between the top dot and the bottom dot.', `Highest = ${max} °C, lowest = ${min} °C.`, `${max} − ${min} = <b>${max - min}</b> °C.`],
        finalAnswer: `${max - min} °C`, skill: 'data',
      };
    }
    const fixed = DAYS.map(() => R.int(2, 6) * 5);
    const total = fixed.reduce((a, b) => a + b, 0);
    return {
      visual: tempGraphSvg(fixed, DAYS),
      prompt: 'What is the <b>average (mean)</b> temperature for the five days on the graph?',
      answer: { type: 'number', value: total / 5, unit: '°C', tolerance: 0.01, placeholder: 'e.g. 15' },
      hint: 'Add all five readings, then divide by 5.',
      working: ['<b>Picture:</b> pouring all five days into one jug and sharing it out evenly.', `${fixed.join(' + ')} = ${total}.`, `${total} ÷ 5 = <b>${total / 5}</b> °C.`],
      finalAnswer: `${total / 5} °C`, skill: 'data',
    };
  }

  function vocabQ(level) {
    const items = [
      { q: 'What is it called when liquid water turns into invisible water vapour?', a: 'evaporation', accept: ['evaporate', 'evaporating'] },
      { q: 'What is it called when water vapour cools and turns back into droplets?', a: 'condensation', accept: ['condensing', 'condense'] },
      { q: 'What is the general word for rain, hail, sleet and snow falling from clouds?', a: 'precipitation', accept: ['rain'] },
      { q: 'What is it called when plants release water vapour from their leaves?', a: 'transpiration', accept: ['transpire', 'transpiring'] },
      { q: 'What instrument measures air pressure?', a: 'barometer', accept: ['a barometer'] },
      { q: 'What instrument measures wind speed?', a: 'anemometer', accept: ['an anemometer'] },
      { q: 'What word means the usual weather pattern of a place over many years?', a: 'climate', accept: ['the climate'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one word)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Up = evaporation, cool = condensation, down = precipitation.',
      working: ['Match the word to the stage of the cycle.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Condensation — warm damp air touched the cold glass and the vapour turned back to water', ['Water leaked through the glass', 'Evaporation', 'The glass melted a little'], 4);
      return {
        prompt: 'On a cold morning the inside of the classroom window is covered in droplets. What has happened?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which way does water change when it gets colder?',
        working: ['<b>Picture:</b> a cold can of drink going wet on the outside.', '1. There is always invisible water vapour in the air.', '2. The cold glass cools it down.', 'Cooling vapour turns back to liquid: <b>condensation</b> — the same thing that makes clouds.'],
        finalAnswer: 'Condensation',
      };
    },
    () => {
      const c = choice('Evaporation — the Sun turned the water into invisible vapour', ['The water soaked through the concrete', 'The water condensed', 'The water froze'], 4);
      return {
        visual: waterCycleSvg('evaporation'),
        prompt: 'A puddle on the concrete netball court is gone by the afternoon, even though nobody touched it. Where did the water go?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Water does not disappear — it changes state.',
        working: ['<b>Picture:</b> washing drying on the line — the water leaves as an invisible gas.', '1. Did the Sun warm the puddle? Yes.', '2. Warming liquid water turns it into <b>water vapour</b>.', 'That is <b>evaporation</b>. The water is still in the air, just invisible.'],
        finalAnswer: 'Evaporation',
      };
    },
    () => {
      const c = choice('Climate — it describes the usual pattern over many years', ['Weather — it is about rain', 'Neither', 'Both mean the same thing'], 4);
      return {
        prompt: 'Harper reads: "Fiordland gets more than 6 metres of rain in an average year." Is that describing weather or climate?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Does it tell you about today, or about how it usually is?',
        working: ['<b>Picture:</b> weather is what you wear today; climate is what is in your wardrobe.', '1. Does it say what happened today? No.', '2. It says "in an average year" — a long-term pattern.', 'So it is <b>climate</b>.'],
        finalAnswer: 'Climate',
      };
    },
    () => {
      const v = R.step(4, 34, 2);
      return {
        visual: thermometerSvg(v),
        prompt: 'Harper checks the school weather station at 9 am. What temperature should she write in her table?',
        answer: { type: 'number', value: v, unit: '°C', placeholder: 'e.g. 16' },
        hint: 'Find the labelled line below the top of the liquid, then count the small marks — each is 2 °C.',
        working: ['<b>Picture:</b> a ladder with big rungs every 10 and small rungs every 2.', '1. Read at the <b>top of the coloured liquid</b>.', '2. Find the labelled line below it, then count up in 2s.', `The reading is <b>${v} °C</b>.`],
        finalAnswer: `${v} °C`,
      };
    },
    () => {
      const v = R.int(1, 19) * 2.5;
      const val = Math.round(v * 10) / 10;
      return {
        visual: rainGaugeSvg(val),
        prompt: 'Harper empties the rain gauge every morning. How much rain does she record today?',
        answer: { type: 'number', value: val, unit: 'mm', tolerance: 0.01, placeholder: 'e.g. 12.5' },
        hint: 'Read the scale at the top of the water. Big lines are 10 mm, small ones 5 mm.',
        working: ['<b>Picture:</b> reading a measuring jug at the water line.', '1. Find the labelled line just below the water.', '2. Add on any small marks (5 mm each).', `She records <b>${val} mm</b>.`],
        finalAnswer: `${val} mm`,
      };
    },
    () => {
      const c = choice('A cumulonimbus — tall, dark and full of energy', ['Cirrus', 'Stratus', 'Cumulus'], 4);
      return {
        prompt: 'A huge dark cloud towers up over Rotorua like an anvil. Thunder follows. Which cloud is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which cloud is the tall, towering one?',
        working: ['<b>Picture:</b> a cloud built like a skyscraper with a flat top.', '1. Thin wispy streaks? No, that is cirrus.', '2. A flat grey sheet? No, that is stratus.', 'Tall, dark and thundery = <b>cumulonimbus</b>.'],
        finalAnswer: 'A cumulonimbus',
      };
    },
    () => {
      const c = choice('A change to wetter, windier weather', ['A hot sunny spell', 'A cold clear night', 'No change at all'], 4);
      return {
        visual: instrumentPicSvg('barometer'),
        prompt: 'Over two days the barometer reading falls from 1020 hPa to 995 hPa. What should Harper predict?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Falling pressure means rising air. What does rising air make?',
        working: ['<b>Picture:</b> the needle sliding down towards "low".', '1. Pressure falling → air is <b>rising</b>.', '2. Rising air cools, so its vapour condenses into cloud.', 'Predict <b>cloud, rain and wind</b>.'],
        finalAnswer: 'A change to wetter, windier weather',
      };
    },
    () => {
      const c = choice('Wet westerly air is forced up over the Alps and drops its rain on the way', ['The east coast is further from the sea', 'The Alps block the sunshine', 'Rivers carry the rain to the west'], 4);
      return {
        prompt: 'Hokitika gets about 2900 mm of rain a year. Christchurch, on the other side of the Alps, gets about 600 mm. Why the huge difference?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which way does the wind mostly blow, and what is in its way?',
        working: ['<b>Picture:</b> a wet sponge being squeezed as it is pushed up a hill.', '1. The wind mostly comes from the <b>west</b>, off the Tasman Sea, full of water vapour.', '2. The Southern Alps force it upwards; it cools, condenses and rains.', '3. By the time the air reaches Canterbury it is dry.'],
        finalAnswer: 'Wet westerly air is forced up over the Alps and drops its rain on the way',
      };
    },
    () => {
      const rows = makeRows();
      const total = rows.reduce((a, r) => a + r[2], 0);
      return {
        visual: weatherTable(rows),
        prompt: 'Harper keeps a weather diary for a week. What was the total rainfall over the five days?',
        answer: { type: 'number', value: total, unit: 'mm', placeholder: 'e.g. 24' },
        hint: 'Use the rain column only, and add every row.',
        working: ['<b>Picture:</b> tipping five days of rain into one jug.', `${rows.map((r) => r[2]).join(' + ')} = <b>${total}</b> mm.`],
        finalAnswer: `${total} mm`,
      };
    },
    () => {
      const c = choice('It comes from the south — that is why a southerly feels cold in NZ', ['It is heading towards the south', 'It is a warm wind', 'It only blows in winter'], 4);
      return {
        visual: instrumentPicSvg('wind vane'),
        prompt: 'The forecast says "a strong southerly". Which way is the wind coming from, and why does that matter here?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Winds are named after where they come FROM. What is south of New Zealand?',
        working: ['<b>Picture:</b> the weathercock arrow swinging round to point INTO the wind.', '1. A southerly blows <b>from the south</b>.', '2. South of Aotearoa is the Southern Ocean and Antarctica.', 'So a southerly brings <b>cold</b> air — the opposite of the northern hemisphere.'],
        finalAnswer: 'It comes from the south',
      };
    },
    () => {
      const c = choice('No — the water is still there as invisible water vapour in the air', ['Yes, water is destroyed by heat', 'Yes, the Sun burns it up', 'No, it soaked into the air as tiny liquid drops'], 4);
      return {
        visual: waterCycleSvg(),
        prompt: 'Harper&rsquo;s friend says "when a puddle dries up, the water is gone for good". Is that right?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The water cycle is a circle — nothing leaves it.',
        working: ['<b>Picture:</b> a circle with no ends — the same water going round and round.', '1. Evaporation turns the puddle into <b>invisible water vapour</b>.', '2. Up high it condenses into cloud, then falls again as rain.', 'The same water has been going round for billions of years.'],
        finalAnswer: 'No — the water is still there as invisible water vapour',
      };
    },
  ];

  const LEARN = {
    what: '<p>All the water on Earth keeps going round and round in the <b>water cycle</b>. The Sun warms the sea, water rises as invisible <b>vapour</b>, cools into clouds, falls as rain and runs back to the sea. That cycle is what makes our <b>weather</b>. Weather is what the sky is doing today; <b>climate</b> is the usual pattern over many years.</p><p><b>Picture for this topic:</b> a <b>kettle with a cold lid</b>. Steam rises (evaporation), hits the cold lid and turns back to drops (condensation), and the drops fall back down (precipitation). The sky does exactly that, just much bigger.</p>',
    visual: waterCycleSvg(),
    facts: [
      'Water cycle: <b>evaporation</b> → <b>condensation</b> → <b>precipitation</b> → <b>collection</b> → round again. Plants add <b>transpiration</b>',
      '<b>Weather</b> = what it is doing now or this week · <b>Climate</b> = the usual pattern over many years',
      'Instruments: <b>thermometer</b> (°C) · <b>rain gauge</b> (mm) · <b>anemometer</b> (km/h) · <b>wind vane</b> (direction) · <b>barometer</b> (hPa)',
      '<b>High pressure</b> = sinking air = clear settled weather · <b>Low pressure</b> = rising air = cloud, rain and wind',
      'Winds are named after where they come <b>from</b> — a southerly in NZ blows from the Southern Ocean, so it is cold',
      'Clouds: <b>cumulus</b> (puffy, fair) · <b>stratus</b> (grey sheet, drizzle) · <b>cirrus</b> (high wisps of ice) · <b>cumulonimbus</b> (towering, thunder)',
    ],
    steps: [
      'For any water-cycle question, ask "<b>is the water going up, cooling, or coming down?</b>" Up = evaporation (or transpiration from plants). Cooling into droplets = condensation. Coming down = precipitation. Gathering below = collection.',
      'Weather or climate? Ask "<b>is this about today, or about the usual pattern?</b>" Today = weather. Usual = climate.',
      'To read any scale, do it in two steps: find the <b>labelled line just below</b> the level, then <b>count the small marks</b> — work out what one small mark is worth first.',
      'For pressure: <b>high = happy skies</b> (sinking air squashes clouds away); <b>low = lousy weather</b> (rising air makes cloud and rain).',
      'For a table or graph, cover everything except the <b>one column or line</b> you need, then read across or up. Say what the question is asking before you look.',
    ],
    examples: [
      { q: 'Name the four main stages of the water cycle, in order.',
        visual: waterCycleSvg(),
        working: ['<b>Picture:</b> a kettle with a cold lid — steam up, drops on the lid, drips down.', '1. Sun warms the sea → water rises as vapour → <b>evaporation</b>.', '2. High up it cools into tiny droplets → <b>condensation</b> (that is a cloud).', '3. Droplets join until they are heavy → <b>precipitation</b> (rain, hail, snow).', '4. It gathers in rivers, lakes and the sea → <b>collection</b>, and off it goes again.'],
        a: 'Evaporation → condensation → precipitation → collection' },
      { q: 'On a cold morning the inside of the window is covered in droplets. Which stage of the cycle is that?',
        working: ['<b>Picture:</b> a cold can of drink going wet on the outside.', '1. Is the water going up or turning back into liquid? Turning back to liquid.', '2. What made it do that? The cold glass cooled the vapour.', 'Cooling vapour → droplets = <b>condensation</b>. Clouds form the very same way.'],
        a: 'Condensation' },
      { q: 'What temperature does this thermometer show?',
        visual: thermometerSvg(18),
        working: ['<b>Picture:</b> a ladder — big rungs every 10, small rungs every 2.', '1. Read at the <b>top of the coloured liquid</b>.', '2. The labelled line below it is 10.', '3. Count small marks up: 12, 14, 16, 18.'],
        a: '18 °C' },
      { q: 'Is "Central Otago has hot dry summers and cold winters, year after year" weather or climate?',
        working: ['<b>Picture:</b> weather is what you wear today; climate is what is in your wardrobe.', '1. Does it describe today? No.', '2. Does it say "year after year"? Yes — that is the long-term pattern.'],
        a: 'Climate' },
      { q: 'Read the table: which day was warmest, and how much rain fell all week?',
        visual: `<table class="data"><tr><th>day</th><th>max temp</th><th>rain</th><th>wind</th></tr><tr><td>Mon</td><td>14 °C</td><td>6 mm</td><td>light NW</td></tr><tr><td>Tue</td><td>19 °C</td><td>0 mm</td><td>calm</td></tr><tr><td>Wed</td><td>21 °C</td><td>2 mm</td><td>light NE</td></tr><tr><td>Thu</td><td>16 °C</td><td>12 mm</td><td>gusty S</td></tr><tr><td>Fri</td><td>13 °C</td><td>4 mm</td><td>strong SW</td></tr></table>`,
        working: ['<b>Picture:</b> a finger sliding down <b>one column at a time</b>.', '1. Temperature column: 14, 19, 21, 16, 13 → the biggest is 21 °C on <b>Wednesday</b>.', '2. Rain column: 6 + 0 + 2 + 12 + 4.', '3. That adds to <b>24 mm</b>.'],
        a: 'Wednesday was warmest; 24 mm of rain fell in total' },
      { q: 'The barometer falls from 1020 hPa to 995 hPa in two days. What weather should you expect?',
        visual: instrumentPicSvg('barometer'),
        working: ['<b>Picture:</b> the needle sliding down towards "low".', '1. Pressure falling means the air is <b>rising</b>.', '2. Rising air cools, so its water vapour condenses.', '3. Condensing vapour = cloud, and then rain.', 'So expect wind and rain — <b>low = lousy</b>.'],
        a: 'Cloudy, wet and windy weather' },
      { q: 'Read the graph: what was the highest temperature that week, and what is the range?',
        visual: tempGraphSvg([12, 18, 24, 15, 9], DAYS),
        working: ['<b>Picture:</b> the line as a set of hills — find the top and the bottom.', '1. Highest dot: Wednesday, <b>24 °C</b>.', '2. Lowest dot: Friday, <b>9 °C</b>.', '3. Range = highest − lowest = 24 − 9.'],
        a: 'Highest 24 °C; range 15 °C' },
    ],
    tips: [
      'When a puddle dries up, the water is <b>not gone</b> — it is invisible water vapour in the air. The cycle never loses any.',
      'A <b>southerly</b> comes FROM the south. Winds are always named after where they start.',
      'Clouds are not made of vapour — vapour is invisible. A cloud is <b>tiny liquid droplets</b> that have already condensed.',
    ],
  };
  HL.registerTopic({
    id: 'water-weather', subject: 'science', strand: 'earth', order: 5,
    name: 'Water & Weather', short: 'Water & weather', animal: 'whale',
    blurb: 'The water cycle, clouds, and how we measure and predict the weather.',
    example: 'evaporation → condensation → precipitation → collection',
    learn: LEARN,
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [stageNameQ, cycleOrderQ, instrumentQ, weatherClimateQ, vocabQ, cloudQ, readThermometerQ]
        : level === 2
          ? [stageNameQ, cycleOrderQ, instrumentQ, readThermometerQ, readRainGaugeQ, weatherClimateQ, cloudQ, pressureQ, windQ, tableQ, vocabQ]
          : [cycleOrderQ, instrumentQ, readThermometerQ, readRainGaugeQ, pressureQ, windQ, tableQ, graphQ, weatherClimateQ, stageNameQ];
      return R.pick(pool)(level);
    },
  });


})(window.HL);
