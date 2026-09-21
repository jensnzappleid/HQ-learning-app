/* Topic: Science Skills — measuring, reading scales, tables, graphs, averages, conclusions and lab safety. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const TOOLS = [
    { n: 'a ruler', m: 'length', unit: 'cm or mm', how: 'line the object up with the ZERO mark, not the end of the ruler' },
    { n: 'a measuring cylinder', m: 'the volume of a liquid', unit: 'mL', how: 'stand it flat, get your eye level with the liquid and read the bottom of the meniscus' },
    { n: 'a balance (scales)', m: 'mass', unit: 'g or kg', how: 'zero it first, then put the object on gently' },
    { n: 'a stopwatch', m: 'time', unit: 'seconds', how: 'start and stop it at exactly the same points every go' },
    { n: 'a thermometer', m: 'temperature', unit: '°C', how: 'leave the bulb in the liquid and read it without lifting it out' },
    { n: 'a light meter', m: 'brightness', unit: 'lux', how: 'hold it the same distance away every time' },
  ];

  const MEASURE_JOBS = [
    { job: 'how tall a bean plant has grown', tool: 'a ruler', unit: 'cm' },
    { job: 'how much water is in a beaker', tool: 'a measuring cylinder', unit: 'mL' },
    { job: 'how heavy a rock sample is', tool: 'a balance (scales)', unit: 'g' },
    { job: 'how long a trolley takes to roll down a ramp', tool: 'a stopwatch', unit: 'seconds' },
    { job: 'how hot the water in a beaker is', tool: 'a thermometer', unit: '°C' },
    { job: 'the width of a leaf', tool: 'a ruler', unit: 'mm' },
    { job: 'the volume of juice a bottle holds', tool: 'a measuring cylinder', unit: 'mL' },
    { job: 'the mass of salt needed for an experiment', tool: 'a balance (scales)', unit: 'g' },
    { job: 'how many seconds 10 pendulum swings take', tool: 'a stopwatch', unit: 'seconds' },
    { job: 'the temperature of the classroom', tool: 'a thermometer', unit: '°C' },
  ];

  const GRAPH_CHOICE = [
    { d: 'the temperature of a cooling cup of tea, measured every minute', a: 'line graph', why: 'time and temperature are both numbers that change smoothly, so the points join up' },
    { d: 'the height of a bean plant measured every day for two weeks', a: 'line graph', why: 'days and height are both numbers, so the points join up' },
    { d: 'how far a toy car rolls from five different ramp heights', a: 'line graph', why: 'ramp height is a number, so the points join up' },
    { d: 'how much sugar dissolves at five different water temperatures', a: 'line graph', why: 'temperature is a number, so the points join up' },
    { d: 'the speed of a trolley every 2 seconds', a: 'line graph', why: 'both time and speed are numbers that change smoothly' },
    { d: 'the favourite sport of everyone in the class', a: 'bar chart', why: 'the sports are separate categories, not numbers' },
    { d: 'the number of people in the class with each eye colour', a: 'bar chart', why: 'eye colours are separate categories' },
    { d: 'which of four insulating materials kept water hottest', a: 'bar chart', why: 'the materials are separate categories with nothing in between' },
    { d: 'how tall each of five different tree species grows', a: 'bar chart', why: 'the species are separate categories' },
    { d: 'the number of birds counted in five different habitats', a: 'bar chart', why: 'the habitats are separate categories' },
  ];

  const SAFETY = [
    { q: 'Why do you wear safety goggles in the lab?', a: 'To stop chemicals or hot liquid splashing into your eyes', wrongs: ['To see the experiment more clearly', 'So the teacher can tell who is working', 'To keep your hair out of your face'] },
    { q: 'Why must you tie long hair back?', a: 'So it cannot fall into a flame or into a chemical', wrongs: ['So you can see the board', 'It is just a school uniform rule', 'So it does not get dusty'] },
    { q: 'Why must you never taste anything in the lab, even if it looks like sugar?', a: 'Chemicals can be poisonous even when they look harmless', wrongs: ['It is bad manners', 'It would use up the supplies', 'It might be cold'] },
    { q: 'How should you smell a chemical if you are asked to?', a: 'Waft the smell towards your nose with your hand', wrongs: ['Put your nose right over the top and sniff hard', 'Pour some out and smell that', 'Never smell anything, ever'] },
    { q: 'You spill a chemical on your hand. What do you do first?', a: 'Wash it off with plenty of cold water, then tell the teacher', wrongs: ['Wipe it on your jumper', 'Wait and see if it stings', 'Put a plaster on it'] },
    { q: 'Why must you never point the open end of a heating test tube at anyone?', a: 'The hot liquid can spit out suddenly', wrongs: ['It blocks their view', 'The glass might fog up', 'It cools down faster'] },
    { q: 'Why do bags and stools have to be pushed under the benches?', a: 'So nobody trips while carrying something hot or breakable', wrongs: ['To keep the room tidy for the caretaker', 'So there is room for more chairs', 'So bags do not get dusty'] },
    { q: 'You break a test tube. What should you do?', a: 'Tell the teacher straight away and do not touch the glass', wrongs: ['Hide the pieces in the bin', 'Pick the pieces up with your fingers', 'Carry on and mention it later'] },
    { q: 'Why do you wash your hands at the end of a practical?', a: 'To remove any chemicals before you eat or touch your face', wrongs: ['To warm your hands up', 'Because the sink needs using', 'To dry the equipment'] },
    { q: 'Why should you walk, never run, in a science lab?', a: 'Because you could knock into hot or breakable equipment', wrongs: ['To save energy', 'So the floor stays clean', 'It is quieter'] },
  ];

  const HAZARDS = [
    { n: 'flammable', m: 'it catches fire easily — keep it away from flames', pic: 'a flame' },
    { n: 'corrosive', m: 'it burns your skin and eyes and eats into materials', pic: 'liquid dripping onto a hand and a surface' },
    { n: 'toxic', m: 'it is poisonous — it can make you very ill', pic: 'a skull and crossbones' },
    { n: 'harmful or irritant', m: 'it can make your skin, eyes or throat sore', pic: 'an exclamation mark' },
  ];

  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const fmt = (x) => (Math.round(x * 100) / 100).toString();

  /* ---------- diagrams ---------- */
  function conceptSvg() {
    const step = (x, y, colour, n, t1, t2) => `
      <rect x="${x}" y="${y}" width="160" height="52" rx="9" fill="${colour}" stroke="#4A4033" stroke-width="1.5"/>
      <text x="${x + 12}" y="${y + 22}" fill="#4A4033" font-size="12.5">${n}</text>
      <text x="${x + 12}" y="${y + 40}" fill="#8A7B63" font-size="11.5">${t1}</text>
      ${t2 ? `<text x="${x + 12}" y="${y + 40}" fill="#8A7B63" font-size="11.5">${t2}</text>` : ''}`;
    return `<svg viewBox="0 0 348 196" width="348" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="348" height="196" fill="#FFFFFF"/>
      ${step(8, 10, '#FBD9E6', '1. MEASURE', 'right tool, right unit')}
      ${step(180, 10, '#F6EEDC', '2. RECORD', 'a table with headings')}
      ${step(8, 76, '#DFF0D0', '3. GRAPH', 'bar or line?')}
      ${step(180, 76, '#DCEEF9', '4. CONCLUDE', 'answer the question')}
      <line x1="168" y1="36" x2="176" y2="36" stroke="#4A4033" stroke-width="2"/>
      <line x1="88" y1="62" x2="88" y2="72" stroke="#4A4033" stroke-width="2"/>
      <line x1="168" y1="102" x2="176" y2="102" stroke="#4A4033" stroke-width="2"/>
      <rect x="8" y="140" width="332" height="48" rx="9" fill="#F6EEDC" stroke="#4A4033" stroke-width="1.5"/>
      <text x="20" y="160" fill="#E0568C" font-size="12.5">SAFETY FIRST</text>
      <text x="20" y="178" fill="#4A4033" font-size="11">goggles on · hair tied back · never taste anything</text>
    </svg>`;
  }

  function rulerSvg(cm) {
    const x0 = 24, px = 36;                      // 36 px per cm, 0–8 cm
    let ticks = '';
    for (let mm = 0; mm <= 80; mm++) {
      const x = x0 + (mm / 10) * px;
      const big = mm % 10 === 0, mid = mm % 5 === 0;
      ticks += `<line x1="${x.toFixed(1)}" y1="74" x2="${x.toFixed(1)}" y2="${big ? 96 : mid ? 88 : 82}" stroke="#4A4033" stroke-width="${big ? 1.8 : 1}"/>`;
      if (big) ticks += `<text x="${x.toFixed(1)}" y="116" text-anchor="middle" fill="#4A4033" font-size="12">${mm / 10}</text>`;
    }
    return `<svg viewBox="0 0 340 146" width="340" height="146" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="340" height="146" fill="#FFFFFF"/>
      <text x="${(x0 + 8 * px) / 2}" y="30" text-anchor="middle" fill="#8A7B63" font-size="11.5">how long is the pink strip?</text>
      <rect x="${x0}" y="48" width="${(cm * px).toFixed(1)}" height="20" rx="4" fill="#E0568C"/>
      <rect x="${x0}" y="74" width="${8 * px}" height="56" fill="#F6EEDC" stroke="#4A4033" stroke-width="1.5"/>
      ${ticks}
      <text x="${x0 + 8 * px}" y="142" text-anchor="end" fill="#8A7B63" font-size="11.5">centimetres</text>
    </svg>`;
  }

  function cylinderSvg(ml) {
    const top = 26, bottom = 158, max = 100;
    const y = (v) => bottom - (v / max) * (bottom - top);
    let ticks = '';
    for (let v = 0; v <= max; v += 10) {
      const big = v % 20 === 0;
      ticks += `<line x1="${big ? 96 : 104}" y1="${y(v)}" x2="114" y2="${y(v)}" stroke="#4A4033" stroke-width="${big ? 2 : 1}"/>`;
      if (big) ticks += `<text x="92" y="${y(v) + 4}" text-anchor="end" fill="#4A4033" font-size="12">${v}</text>`;
    }
    return `<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="300" height="190" fill="#FFFFFF"/>
      <rect x="114" y="20" width="46" height="142" fill="#F4FBFF" stroke="#4A4033" stroke-width="2"/>
      <rect x="116" y="${y(ml)}" width="42" height="${160 - y(ml)}" fill="#A9D8F5"/>
      <path d="M 116 ${y(ml)} q 21 9 42 0" fill="none" stroke="#5F98C4" stroke-width="2.5"/>
      <rect x="108" y="162" width="58" height="8" rx="3" fill="#C9BCA6" stroke="#4A4033" stroke-width="1.5"/>
      ${ticks}
      <text x="168" y="44" fill="#4A4033" font-size="12">measuring</text>
      <text x="168" y="60" fill="#4A4033" font-size="12">cylinder (mL)</text>
      <text x="168" y="84" fill="#E0568C" font-size="11.5">read the BOTTOM</text>
      <text x="168" y="99" fill="#E0568C" font-size="11.5">of the curve</text>
      <text x="125" y="184" fill="#8A7B63" font-size="11.5">how many mL?</text>
    </svg>`;
  }

  function dialScaleSvg(g) {
    const cx = 92, cy = 96, r = 62, max = 1000;
    const ang = (v) => (-120 + (v / max) * 240) * Math.PI / 180;
    let ticks = '';
    for (let v = 0; v <= max; v += 50) {
      const big = v % 200 === 0;
      const a = ang(v);
      const x1 = cx + (r - (big ? 14 : 7)) * Math.sin(a), y1 = cy - (r - (big ? 14 : 7)) * Math.cos(a);
      const x2 = cx + r * Math.sin(a), y2 = cy - r * Math.cos(a);
      ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#4A4033" stroke-width="${big ? 2 : 1}"/>`;
      if (big) {
        const tx = cx + (r - 26) * Math.sin(a), ty = cy - (r - 26) * Math.cos(a);
        ticks += `<text x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}" text-anchor="middle" fill="#4A4033" font-size="11.5">${v}</text>`;
      }
    }
    const a = ang(g);
    return `<svg viewBox="0 0 300 190" width="300" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="300" height="190" fill="#FFFFFF"/>
      <circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="#F6EEDC" stroke="#4A4033" stroke-width="2"/>
      ${ticks}
      <line x1="${cx}" y1="${cy}" x2="${(cx + (r - 16) * Math.sin(a)).toFixed(1)}" y2="${(cy - (r - 16) * Math.cos(a)).toFixed(1)}" stroke="#E0568C" stroke-width="3.5"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="#4A4033"/>
      <text x="182" y="70" fill="#4A4033" font-size="12">kitchen scales</text>
      <text x="182" y="88" fill="#8A7B63" font-size="12">the dial reads</text>
      <text x="182" y="104" fill="#8A7B63" font-size="12">in grams (g)</text>
      <text x="182" y="128" fill="#E0568C" font-size="11.5">small marks = 50 g</text>
    </svg>`;
  }

  function stopwatchSvg(sec) {
    const mm = Math.floor(sec / 60), ss = sec - mm * 60;
    const txt = `${mm}:${ss < 10 ? '0' : ''}${ss.toFixed(1)}`;
    return `<svg viewBox="0 0 260 150" width="260" height="150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="260" height="150" fill="#FFFFFF"/>
      <rect x="46" y="30" width="170" height="76" rx="14" fill="#4A4033"/>
      <rect x="60" y="44" width="142" height="48" rx="6" fill="#DFF0D0"/>
      <text x="131" y="80" text-anchor="middle" fill="#4A4033" font-size="30">${txt}</text>
      <rect x="118" y="16" width="26" height="14" rx="4" fill="#8A7B63"/>
      <text x="131" y="126" text-anchor="middle" fill="#8A7B63" font-size="11.5">minutes : seconds</text>
    </svg>`;
  }

  function thermoSvg(t) {
    const top = 26, bottom = 150, max = 100, min = 0;
    const y = (v) => bottom - ((v - min) / (max - min)) * (bottom - top);
    let ticks = '';
    for (let v = min; v <= max; v += 5) {
      const big = v % 20 === 0;
      ticks += `<line x1="${big ? 46 : 52}" y1="${y(v)}" x2="62" y2="${y(v)}" stroke="#4A4033" stroke-width="${big ? 2 : 1}"/>`;
      if (big) ticks += `<text x="42" y="${y(v) + 4}" text-anchor="end" fill="#4A4033" font-size="12">${v}</text>`;
    }
    return `<svg viewBox="0 0 280 180" width="280" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="280" height="180" fill="#FFFFFF"/>
      <rect x="64" y="20" width="18" height="138" rx="9" fill="#F2ECE0" stroke="#4A4033" stroke-width="2"/>
      <rect x="68" y="${y(t)}" width="10" height="${158 - y(t)}" fill="#E0568C"/>
      <circle cx="73" cy="160" r="12" fill="#E0568C" stroke="#4A4033" stroke-width="2"/>
      ${ticks}
      <text x="98" y="44" fill="#4A4033" font-size="12">thermometer</text>
      <text x="98" y="62" fill="#8A7B63" font-size="12">small marks = 5 °C</text>
      <text x="98" y="86" fill="#E0568C" font-size="11.5">what is the reading?</text>
    </svg>`;
  }

  function barChartSvg(vals, labels, unit) {
    const x0 = 44, y0 = 152, w = 280, h = 116;
    const max = Math.max(...vals);
    const top = Math.ceil(max / 10) * 10 || 10;
    const bw = (w / vals.length) * 0.6;
    let s = `<svg viewBox="0 0 344 188" width="344" height="188" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="344" height="188" fill="#FFFFFF"/>
      <line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" stroke="#4A4033" stroke-width="2"/>
      <line x1="${x0}" y1="${y0}" x2="${x0}" y2="26" stroke="#4A4033" stroke-width="2"/>`;
    const step = top <= 50 ? 10 : top / 5;
    for (let v = 0; v <= top; v += step) {
      const y = y0 - (v / top) * h;
      s += `<line x1="${x0 - 5}" y1="${y.toFixed(1)}" x2="${x0 + w}" y2="${y.toFixed(1)}" stroke="#E7DCC8" stroke-width="1"/>`;
      s += `<text x="${x0 - 9}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#4A4033" font-size="12">${v}</text>`;
    }
    vals.forEach((v, i) => {
      const cx = x0 + (i + 0.5) * (w / vals.length);
      const bh = (v / top) * h;
      s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${(y0 - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="#B9A5E6" stroke="#4A4033" stroke-width="1.2"/>`;
      s += `<text x="${cx.toFixed(1)}" y="${y0 + 17}" text-anchor="middle" fill="#4A4033" font-size="12">${labels[i]}</text>`;
    });
    s += `<text x="10" y="20" fill="#8A7B63" font-size="12">${unit}</text>`;
    return s + '</svg>';
  }

  function hazardSvg(kind) {
    const inner = kind === 'flammable'
      ? `<path d="M 120 66 c 16 14 6 24 0 30 c -12 -4 -6 -16 0 -30 Z M 120 66 c 2 22 22 22 14 44 c 16 -12 12 -36 -14 -44 Z" fill="#4A4033"/>
         <path d="M 108 118 c -6 -16 8 -22 12 -36 c 6 18 20 20 12 36 Z" fill="#4A4033"/>`
      : kind === 'corrosive'
        ? `<rect x="96" y="106" width="48" height="8" fill="#4A4033"/>
           <path d="M 104 66 l 14 0 l 0 22 l -14 6 Z" fill="#4A4033"/>
           ${[104, 112, 120].map((x, i) => `<circle cx="${x + 8}" cy="${96 + i * 3}" r="2.5" fill="#4A4033"/>`).join('')}
           <path d="M 128 96 l 6 10 l -12 0 Z" fill="#4A4033"/>`
        : kind === 'toxic'
          ? `<circle cx="120" cy="86" r="18" fill="#4A4033"/>
             <circle cx="113" cy="83" r="4" fill="#FFFFFF"/><circle cx="127" cy="83" r="4" fill="#FFFFFF"/>
             <rect x="115" y="94" width="10" height="7" fill="#FFFFFF"/>
             <line x1="102" y1="112" x2="138" y2="126" stroke="#4A4033" stroke-width="5"/>
             <line x1="138" y1="112" x2="102" y2="126" stroke="#4A4033" stroke-width="5"/>`
          : `<rect x="113" y="64" width="14" height="40" rx="4" fill="#4A4033"/>
             <circle cx="120" cy="116" r="8" fill="#4A4033"/>`;
    return `<svg viewBox="0 0 240 190" width="240" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="240" height="190" fill="#FFFFFF"/>
      <polygon points="120,20 200,96 120,172 40,96" fill="#FFFFFF" stroke="#E0568C" stroke-width="9"/>
      ${inner}
      <text x="120" y="186" text-anchor="middle" fill="#8A7B63" font-size="11.5">a hazard symbol on a bottle</text>
    </svg>`;
  }

  const resultTable = (head, rows) => `<table class="data"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${
    rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;

  /* ---------- question makers ---------- */
  function toolJobQ(level) {
    const j = R.pick(MEASURE_JOBS);
    if (R.chance(0.5)) {
      const c = choice(j.tool, TOOLS.map((t) => t.n), 4);
      return {
        prompt: `Harper needs to measure <b>${j.job}</b>. Which instrument should she use?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: `The answer will be written in ${j.unit}.`,
        working: ['<b>Picture:</b> the right tool for the job, like picking a spanner not a hammer.', `1. What kind of measurement is it? It ends up in ${j.unit}.`, `So she needs <b>${j.tool}</b>.`],
        finalAnswer: j.tool, skill: 'tools',
      };
    }
    const c = choice(j.unit, ['cm', 'mm', 'mL', 'g', 'seconds', '°C'], 4);
    return {
      prompt: `Harper measures <b>${j.job}</b> with ${j.tool}. What unit should she write in her table?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The unit goes in the column heading, once — not next to every number.',
      working: ['<b>Picture:</b> the heading row of a results table.', `${j.tool.charAt(0).toUpperCase() + j.tool.slice(1)} measures in <b>${j.unit}</b>.`],
      finalAnswer: j.unit, skill: 'units',
    };
  }

  function toolUseQ(level) {
    const t = R.pick(TOOLS.slice(0, 5));
    const c = choice(t.how, TOOLS.map((x) => x.how), 4);
    return {
      prompt: `What is the right way to use <b>${t.n}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: `It measures ${t.m}.`,
      working: [`<b>Picture:</b> using ${t.n} carefully so the reading is true.`, `The rule is: <b>${t.how}</b>.`],
      finalAnswer: t.how, skill: 'tools',
    };
  }

  function readRulerQ(level) {
    const cm = level === 1 ? R.int(1, 8) : R.int(2, 16) / 2;
    const inMm = level === 3 && R.chance(0.5);
    return {
      visual: rulerSvg(cm),
      prompt: `How long is the pink strip? <span class="muted">(answer in ${inMm ? 'mm' : 'cm'})</span>`,
      answer: { type: 'number', value: inMm ? cm * 10 : cm, unit: inMm ? 'mm' : 'cm', tolerance: 0.01, placeholder: inMm ? 'e.g. 45' : 'e.g. 4.5' },
      hint: inMm ? 'Read it in cm first, then remember 1 cm = 10 mm.' : 'Start at the ZERO mark, not at the very end of the ruler. Small marks are 1 mm.',
      working: ['<b>Picture:</b> lining the strip up with the 0 mark, not the edge of the ruler.', `1. The strip ends at <b>${cm} cm</b>.`, inMm ? `2. 1 cm = 10 mm, so ${cm} × 10 = <b>${cm * 10} mm</b>.` : '2. Half-way marks are 5 mm; the tiny marks are 1 mm each.'],
      finalAnswer: inMm ? `${cm * 10} mm` : `${cm} cm`, skill: 'reading',
    };
  }

  function readCylinderQ(level) {
    const ml = level === 1 ? R.int(1, 9) * 10 : R.int(1, 19) * 5;
    return {
      visual: cylinderSvg(ml),
      prompt: 'What volume of liquid is in the measuring cylinder?',
      answer: { type: 'number', value: ml, unit: 'mL', placeholder: 'e.g. 45' },
      hint: 'Get your eye level with the liquid and read the BOTTOM of the curved surface (the meniscus). Small marks are 10 mL.',
      working: ['<b>Picture:</b> crouching down so your eye is level with the water.', '1. Find the labelled line below the surface.', '2. Count on in 10s to the <b>bottom of the curve</b>.', `The reading is <b>${ml} mL</b>.`],
      finalAnswer: `${ml} mL`, skill: 'reading',
    };
  }

  function meniscusQ(level) {
    const c = choice('At the bottom of the curve, with your eye level with the liquid', ['At the top of the curve', 'Wherever the liquid touches the glass', 'From above, looking down into it'], 4);
    return {
      visual: cylinderSvg(R.int(3, 17) * 5),
      prompt: 'Where exactly should you read a measuring cylinder?',
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The curved surface is called the meniscus.',
      working: ['<b>Picture:</b> crouching down so your eye is level with the water, not looking down from above.', '1. The surface curves up at the edges — that curve is the <b>meniscus</b>.', '2. Read the <b>bottom</b> of the curve.', 'Looking from above makes the reading too big (that is called parallax error).'],
      finalAnswer: 'At the bottom of the curve, eye level with the liquid', skill: 'reading',
    };
  }

  function readScalesQ(level) {
    const g = level === 1 ? R.int(1, 10) * 100 : R.int(1, 19) * 50;
    const inKg = level === 3 && R.chance(0.4);
    return {
      visual: dialScaleSvg(g),
      prompt: `What mass do the scales show? <span class="muted">(answer in ${inKg ? 'kg' : 'g'})</span>`,
      answer: { type: 'number', value: inKg ? g / 1000 : g, unit: inKg ? 'kg' : 'g', tolerance: 0.001, placeholder: inKg ? 'e.g. 0.45' : 'e.g. 450' },
      hint: inKg ? 'Read it in grams first, then remember 1000 g = 1 kg.' : 'Labelled marks are 200 g apart; small marks are 50 g.',
      working: ['<b>Picture:</b> a clock face — find the labelled number before the needle, then count on.', `1. The needle points to <b>${g} g</b>.`, inKg ? `2. 1000 g = 1 kg, so ${g} ÷ 1000 = <b>${g / 1000} kg</b>.` : '2. Each small mark is 50 g.'],
      finalAnswer: inKg ? `${g / 1000} kg` : `${g} g`, skill: 'reading',
    };
  }

  function readStopwatchQ(level) {
    const mins = level === 1 ? 0 : R.int(0, 2);
    const secs = R.int(0, 59) + R.int(0, 9) / 10;
    const total = Math.round((mins * 60 + secs) * 10) / 10;
    return {
      visual: stopwatchSvg(mins * 60 + secs),
      prompt: 'What time does the stopwatch show, <b>in seconds</b>?',
      answer: { type: 'number', value: total, unit: 's', tolerance: 0.01, placeholder: 'e.g. 85.4' },
      hint: '1 minute = 60 seconds. Multiply the minutes by 60, then add the seconds.',
      working: ['<b>Picture:</b> the display reads minutes : seconds.', `1. Minutes: ${mins} × 60 = ${mins * 60} s.`, `2. Add the seconds: ${mins * 60} + ${Math.round(secs * 10) / 10} = <b>${total} s</b>.`],
      finalAnswer: `${total} s`, skill: 'reading',
    };
  }

  function readThermoQ(level) {
    const t = level === 1 ? R.int(1, 10) * 10 : R.int(1, 19) * 5;
    return {
      visual: thermoSvg(t),
      prompt: 'What temperature does the thermometer show?',
      answer: { type: 'number', value: t, unit: '°C', placeholder: 'e.g. 45' },
      hint: 'Big labelled marks are 20 °C apart; each small mark is 5 °C.',
      working: ['<b>Picture:</b> a ladder — find the labelled rung below the top of the liquid, then count the small rungs.', '1. Read at the <b>top of the coloured liquid</b>.', '2. Each small mark is 5 °C.', `The reading is <b>${t} °C</b>.`],
      finalAnswer: `${t} °C`, skill: 'reading',
    };
  }

  function tableSkillQ(level) {
    const items = [
      { q: 'Where should the units go in a results table?', a: 'In the column heading, written once', wrongs: ['Next to every single number', 'At the bottom of the table', 'Nowhere — units are not needed'],
        w: ['<b>Picture:</b> a tidy table where each column heading says "height (cm)".', 'Units go in the <b>heading</b>, so the numbers stay easy to read and compare.'] },
      { q: 'Which column goes on the LEFT of a results table?', a: 'The thing you changed (the independent variable)', wrongs: ['The thing you measured', 'The average', 'Whichever you like'],
        w: ['<b>Picture:</b> reading left to right: "I changed this… and this is what happened."', 'Left = what you <b>changed</b>. Right = what you <b>measured</b>, then the average.'] },
      { q: 'Harper writes "12cm, 14cm, 13cm" in one box of her table. What should she do instead?', a: 'Give each repeat its own column, and put "cm" in the headings', wrongs: ['Add the three numbers together', 'Only write the biggest one', 'Write them in a sentence underneath'],
        w: ['<b>Picture:</b> a table with columns: try 1 | try 2 | try 3 | average.', '1. One number per box.', '2. The unit goes once, in the heading.'] },
      { q: 'What should the last column of a repeats table usually be?', a: 'The average (mean) of the repeats', wrongs: ['The biggest reading', 'The date', 'The prediction'],
        w: ['<b>Picture:</b> try 1 | try 2 | try 3 | <b>average</b>.', 'The average is what you plot on the graph.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: R.chance(0.5) ? resultTable(['ramp (cm)', 'try 1 (cm)', 'try 2 (cm)', 'mean (cm)'], [['10', '42', '45', '?'], ['20', '78', '80', '?']]) : undefined,
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Headings carry the units. Left column = what you changed.',
      working: it.w, finalAnswer: it.a, skill: 'tables',
    };
  }

  function graphChoiceQ(level) {
    const g = R.pick(GRAPH_CHOICE);
    const c = choice(g.a, ['bar chart', 'line graph', 'pie chart'], 3);
    return {
      prompt: `Harper has recorded <b>${g.d}</b>. Should she draw a bar chart or a line graph?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Numbers on the bottom axis → line graph. Separate categories on the bottom → bar chart.',
      working: ['<b>Picture:</b> ask "is the thing along the bottom a NUMBER or a NAME?"', `1. ${g.why.charAt(0).toUpperCase() + g.why.slice(1)}.`, `So she should draw a <b>${g.a}</b>.`],
      finalAnswer: g.a, skill: 'graphs',
    };
  }

  function readGraphQ(level) {
    const labels = R.pick([['wool', 'foil', 'paper', 'none'], ['A', 'B', 'C', 'D'], ['bark', 'straw', 'foam', 'cloth']]);
    const vals = labels.map(() => R.int(1, 9) * 5);
    const style = R.pick(['read', 'biggest', 'diff']);
    if (style === 'read') {
      const i = R.int(0, labels.length - 1);
      return {
        visual: barChartSvg(vals, labels, '°C'),
        prompt: `Read the bar chart. What was the result for <b>${labels[i]}</b>?`,
        answer: { type: 'number', value: vals[i], unit: '°C', placeholder: 'e.g. 25' },
        hint: `Put your finger on the top of the ${labels[i]} bar and slide left to the scale.`,
        working: ['<b>Picture:</b> sliding your finger from the top of the bar across to the numbers.', `1. Find the ${labels[i]} bar.`, `2. Slide across to the scale: <b>${vals[i]} °C</b>.`],
        finalAnswer: `${vals[i]} °C`, skill: 'graphs',
      };
    }
    if (style === 'biggest') {
      const max = Math.max(...vals);
      const lab = labels[vals.indexOf(max)];
      const c = choice(lab, labels, 4);
      return {
        visual: barChartSvg(vals, labels, '°C'),
        prompt: 'Which one gave the <b>highest</b> result?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Look for the tallest bar.',
        working: ['<b>Picture:</b> the tallest bar wins.', `Readings: ${labels.map((l, i) => `${l} ${vals[i]}`).join(', ')}.`, `The tallest is <b>${lab}</b> at ${max} °C.`],
        finalAnswer: lab, skill: 'graphs',
      };
    }
    const max = Math.max(...vals), min = Math.min(...vals);
    return {
      visual: barChartSvg(vals, labels, '°C'),
      prompt: 'What is the <b>difference</b> between the highest bar and the lowest bar?',
      answer: { type: 'number', value: max - min, unit: '°C', placeholder: 'e.g. 20' },
      hint: 'Read the tallest and the shortest, then subtract.',
      working: ['<b>Picture:</b> the gap between the tallest and shortest bar.', `Tallest = ${max} °C, shortest = ${min} °C.`, `${max} − ${min} = <b>${max - min}</b> °C.`],
      finalAnswer: `${max - min} °C`, skill: 'graphs',
    };
  }

  function meanQ(level) {
    const n = level === 3 ? R.pick([3, 4]) : 3;
    const target = R.int(6, 30);
    const vals = [];
    for (let i = 0; i < n - 1; i++) vals.push(target + R.pick([-2, -1, 1, 2]));
    vals.push(target * n - vals.reduce((a, b) => a + b, 0));
    const shown = R.shuffle(vals);
    const unit = R.pick(['cm', 's', '°C', 'mL', 'g']);
    return {
      visual: resultTable(shown.map((_, i) => `try ${i + 1} (${unit})`).concat([`mean (${unit})`]), [shown.concat(['?'])]),
      prompt: `Harper repeated her measurement ${n} times: <b>${shown.join(', ')}</b> ${unit}. What is the <b>average</b>?`,
      answer: { type: 'number', value: target, unit, placeholder: 'e.g. 14' },
      hint: `Add all ${n} readings, then divide by ${n}.`,
      working: ['<b>Picture:</b> pouring all the readings into one jug and sharing it out evenly.', `${shown.join(' + ')} = ${target * n}.`, `${target * n} ÷ ${n} = <b>${target}</b> ${unit}.`],
      finalAnswer: `${target} ${unit}`, skill: 'averages',
    };
  }

  function conclusionQ(level) {
    const items = [
      { q: 'Harper found that the higher the ramp, the further the car rolled. Which is the best conclusion?', a: 'The higher the ramp, the further the car rolled', wrongs: ['The experiment worked well', 'Ramps are fun to test', 'The car was a good car'] },
      { q: 'Harper found wool kept water hottest and foil kept it coolest. Which is the best conclusion?', a: 'Wool was the best insulator of the materials tested', wrongs: ['Foil is a bad material', 'Wool is warm to wear', 'The water was too hot'] },
      { q: 'What must a conclusion always do?', a: 'Answer the original question, using the results as evidence', wrongs: ['Say whether you enjoyed the experiment', 'Repeat the method step by step', 'List the equipment used'] },
      { q: 'Harper&rsquo;s results do not match her prediction. What should she write?', a: 'What the results actually showed, and say the prediction was not supported', wrongs: ['Change the results so they match', 'Leave the conclusion out', 'Write that the prediction was right anyway'] },
      { q: 'Which sentence is NOT a conclusion?', a: 'I enjoyed doing this experiment with my friend', wrongs: ['Sugar dissolved faster in hotter water', 'The longer the string, the slower the pendulum swung', 'Plants given fertiliser grew taller than the control'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'A conclusion answers the question you started with, in one sentence, using your results.',
      working: ['<b>Picture:</b> going back to the question at the top of the page and answering it.', `Best conclusion: <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'conclusion',
    };
  }

  function safetyQ(level) {
    const it = R.pick(SAFETY);
    const c = choice(it.a, it.wrongs, 4);
    return {
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Lab rules exist to protect your eyes, your skin and everyone around you.',
      working: ['<b>Picture:</b> a busy lab with hot glass, flames and chemicals.', `<b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'safety',
    };
  }

  function hazardQ(level) {
    const h = R.pick(HAZARDS);
    if (R.chance(0.5)) {
      const c = choice(h.m, HAZARDS.map((x) => x.m), 4);
      return {
        visual: hazardSvg(h.n.split(' ')[0]),
        prompt: `This hazard symbol is <b>${h.pic}</b>. What does it warn you about?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The picture inside the diamond is a clue to the danger.',
        working: [`<b>Picture:</b> ${h.pic} inside a red-edged diamond.`, `That is the <b>${h.n}</b> symbol: ${h.m}.`],
        finalAnswer: h.m, skill: 'hazards',
      };
    }
    const c = choice(h.n, HAZARDS.map((x) => x.n), 4);
    return {
      visual: hazardSvg(h.n.split(' ')[0]),
      prompt: `A bottle carries this hazard symbol (${h.pic}). What is it called?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: h.m,
      working: [`<b>Picture:</b> ${h.pic} in a red-edged diamond.`, `That symbol means <b>${h.n}</b> — ${h.m}.`],
      finalAnswer: h.n, skill: 'hazards',
    };
  }

  function vocabQ(level) {
    const items = [
      { q: 'What is the curved surface of a liquid in a measuring cylinder called?', a: 'meniscus', accept: ['the meniscus'] },
      { q: 'What do you call the number you get by adding your repeats and dividing by how many there were?', a: 'average', accept: ['mean', 'the mean', 'the average'] },
      { q: 'What instrument measures the volume of a liquid?', a: 'measuring cylinder', accept: ['a measuring cylinder', 'measuring jug', 'cylinder'] },
      { q: 'What unit is volume measured in in the lab?', a: 'ml', accept: ['millilitres', 'milliliters', 'millilitre', 'mls'] },
      { q: 'What unit is mass measured in for small objects?', a: 'g', accept: ['grams', 'gram', 'gs'] },
      { q: 'What kind of graph do you draw when the bottom axis is a set of separate categories?', a: 'bar chart', accept: ['bar graph', 'a bar chart', 'bar'] },
      { q: 'What kind of graph do you draw when both axes are numbers that change smoothly?', a: 'line graph', accept: ['a line graph', 'line'] },
    ];
    const it = R.pick(items);
    return {
      prompt: it.q + ' <span class="muted">(one or two words)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Say the picture in your head first: the cylinder, the table, the graph.',
      working: ['Match the word to the picture in your head.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const ml = R.int(3, 17) * 5;
      return {
        visual: cylinderSvg(ml),
        prompt: 'Harper needs to record how much water she poured out. What should she write in her table?',
        answer: { type: 'number', value: ml, unit: 'mL', placeholder: 'e.g. 45' },
        hint: 'Eye level with the liquid, read the bottom of the curve. Small marks are 10 mL.',
        working: ['<b>Picture:</b> crouching down so your eye is level with the water.', '1. Find the labelled line below the surface.', '2. Count on in 10s to the <b>bottom of the meniscus</b>.', `She records <b>${ml} mL</b>.`],
        finalAnswer: `${ml} mL`,
      };
    },
    () => {
      const c = choice('She read it from above instead of at eye level', ['She used the wrong cylinder', 'She poured too slowly', 'She should have used a ruler'], 4);
      return {
        visual: cylinderSvg(60),
        prompt: 'Harper reads 65 mL while her partner, crouching down, reads 60 mL for the same cylinder. What did Harper do wrong?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Looking down at a liquid makes the reading look bigger than it is.',
        working: ['<b>Picture:</b> looking down into a glass — the water line looks higher than it really is.', '1. The correct method is <b>eye level</b> with the liquid.', '2. Reading from above gives a reading that is too big — that is <b>parallax error</b>.', 'Always read the <b>bottom of the meniscus</b> at eye level.'],
        finalAnswer: 'She read it from above instead of at eye level',
      };
    },
    () => {
      const cm = R.int(2, 16) / 2;
      return {
        visual: rulerSvg(cm),
        prompt: 'Harper is measuring a leaf for her results table. What length should she write down?',
        answer: { type: 'number', value: cm, unit: 'cm', tolerance: 0.01, placeholder: 'e.g. 4.5' },
        hint: 'Line the object up with the ZERO mark, not the end of the ruler. Small marks are 1 mm.',
        working: ['<b>Picture:</b> sliding the leaf along until its end sits on the 0 mark.', '1. Read where the far end lands.', `2. The reading is <b>${cm} cm</b> (that is ${cm * 10} mm).`],
        finalAnswer: `${cm} cm`,
      };
    },
    () => {
      const g = R.pick(GRAPH_CHOICE);
      const c = choice(g.a, ['bar chart', 'line graph', 'pie chart'], 3);
      return {
        prompt: `Harper has finished recording <b>${g.d}</b> and now has to draw a graph. Which kind should she choose?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Ask: is the thing on the bottom axis a NUMBER or a NAME?',
        working: ['<b>Picture:</b> numbers along the bottom → the points join up. Names along the bottom → separate bars.', `1. ${g.why.charAt(0).toUpperCase() + g.why.slice(1)}.`, `So: a <b>${g.a}</b>.`],
        finalAnswer: g.a,
      };
    },
    () => {
      const target = R.int(8, 26);
      const vals = R.shuffle([target - 1, target + 2, target - 1]);
      return {
        visual: resultTable(['try 1 (s)', 'try 2 (s)', 'try 3 (s)', 'mean (s)'], [vals.concat(['?'])]),
        prompt: 'Harper has timed her pendulum three times. What number should go in the "average" box?',
        answer: { type: 'number', value: target, unit: 's', placeholder: 'e.g. 15' },
        hint: 'Add the three readings, then divide by 3.',
        working: ['<b>Picture:</b> three goes shared out evenly.', `${vals.join(' + ')} = ${vals.reduce((a, b) => a + b, 0)}.`, `${vals.reduce((a, b) => a + b, 0)} ÷ 3 = <b>${target}</b> s.`],
        finalAnswer: `${target} s`,
      };
    },
    () => {
      const c = choice('Put the units once in each column heading', ['Write "cm" after every number', 'Leave the units out', 'Write the units in a sentence at the end'], 4);
      return {
        visual: resultTable(['ramp height', 'try 1', 'try 2', 'try 3'], [['10cm', '42cm', '45cm', '43cm'], ['20cm', '78cm', '80cm', '79cm']]),
        prompt: 'Harper&rsquo;s teacher says her table is untidy and hard to read. Look at it — what should she change?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'How many times does "cm" appear in that table?',
        working: ['<b>Picture:</b> a heading that reads "try 1 (cm)" — then the boxes just hold numbers.', '1. Units belong in the <b>heading</b>, written once.', '2. That leaves clean numbers you can compare and add up.'],
        finalAnswer: 'Put the units once in each column heading',
      };
    },
    () => {
      const it = R.pick(SAFETY);
      const c = choice(it.a, it.wrongs, 4);
      return {
        prompt: `In the lab: ${it.q}`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Think about what could go wrong, and who could get hurt.',
        working: ['<b>Picture:</b> a lab with flames, hot glass and chemicals on the bench.', `<b>${it.a}</b>.`],
        finalAnswer: it.a,
      };
    },
    () => {
      const h = R.pick(HAZARDS);
      const c = choice(h.m, HAZARDS.map((x) => x.m), 4);
      return {
        visual: hazardSvg(h.n.split(' ')[0]),
        prompt: 'Harper picks up a bottle with this symbol on the label. What is it telling her?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The drawing inside the diamond shows you the danger.',
        working: [`<b>Picture:</b> ${h.pic} inside a red-edged diamond.`, `1. That is the <b>${h.n}</b> symbol.`, `2. It means: ${h.m}.`],
        finalAnswer: h.m,
      };
    },
    () => {
      const labels = ['wool', 'foil', 'paper', 'none'];
      const vals = labels.map(() => R.int(2, 9) * 5);
      const max = Math.max(...vals);
      const best = labels[vals.indexOf(max)];
      const c = choice(`${best} kept the water hottest`, ['All the materials were the same', 'The experiment did not work', 'Wool is always the best material for everything'], 4);
      return {
        visual: barChartSvg(vals, labels, '°C'),
        prompt: 'Harper tested four coverings on hot water. Look at her graph — what is the best conclusion?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'A conclusion answers the question using what the graph actually shows.',
        working: ['<b>Picture:</b> the tallest bar means the hottest water at the end.', `1. Readings: ${labels.map((l, i) => `${l} ${vals[i]}`).join(', ')} °C.`, `2. The tallest bar is <b>${best}</b> at ${max} °C.`, `Conclusion: <b>${best} kept the water hottest</b> of the materials tested.`],
        finalAnswer: `${best} kept the water hottest`,
      };
    },
    () => {
      const c = choice('Start and stop the stopwatch at exactly the same points every time', ['Use a different person to time each go', 'Round every time to the nearest minute', 'Guess the time if you miss the start'], 4);
      return {
        visual: stopwatchSvg(R.int(5, 40) + R.int(0, 9) / 10),
        prompt: 'Harper times how long a trolley takes to roll down a ramp. Her three times are very different. How can she make her timing more reliable?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Reaction time is the problem — what makes it consistent?',
        working: ['<b>Picture:</b> your thumb on the button, watching for exactly the same moment each go.', '1. The biggest error in timing is your <b>reaction time</b>.', '2. Same person, same start point, same stop point → the errors stay the same size.', '3. Then repeat and take the <b>average</b>.'],
        finalAnswer: 'Start and stop the stopwatch at exactly the same points every time',
      };
    },
    () => {
      const c = choice('Write down what actually happened and say the prediction was not supported', ['Change the numbers so they match', 'Say the prediction was right anyway', 'Leave the conclusion blank'], 4);
      return {
        prompt: 'Harper predicted the bigger parachute would fall more slowly, but her results show the opposite. What should she write in her conclusion?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Scientists report what they found, not what they hoped for.',
        working: ['<b>Picture:</b> a scientist writing down a surprising result rather than hiding it.', '1. Report the result honestly: what the numbers showed.', '2. Say the prediction was <b>not supported</b>.', '3. Then suggest why — maybe a variable was not controlled, or the test needs repeating.'],
        finalAnswer: 'Write down what actually happened and say the prediction was not supported',
      };
    },
    () => {
      const g = R.int(1, 19) * 50;
      return {
        visual: dialScaleSvg(g),
        prompt: 'Harper weighs a rock sample for her table. What mass should she record, in grams?',
        answer: { type: 'number', value: g, unit: 'g', placeholder: 'e.g. 450' },
        hint: 'Labelled marks are 200 g apart; the small marks are 50 g each.',
        working: ['<b>Picture:</b> a clock face — find the labelled number before the needle, then count on in 50s.', `1. The needle points to <b>${g} g</b>.`, `2. In kilograms that would be ${g / 1000} kg.`],
        finalAnswer: `${g} g`,
      };
    },
  ];

  HL.registerTopic({
    id: 'science-skills', subject: 'science', strand: 'nature', order: 2,
    name: 'Science Skills', short: 'Science skills', animal: 'owl',
    blurb: 'Measuring, recording, graphing, concluding — and staying safe while you do it.',
    example: 'measure → record → graph → conclude',
    learn: {
      what: '<p>Doing science is a set of habits: pick the <b>right instrument</b> and <b>unit</b>, read the scale properly, write the numbers in a neat <b>table</b>, draw the right kind of <b>graph</b>, work out the <b>average</b> of your repeats, and finish with a <b>conclusion</b> that answers your question. All of it happens under lab <b>safety rules</b>.</p><p><b>Picture for this topic:</b> a <b>recipe</b>. Measure carefully, write everything down as you go, then look back at what you made and say how it turned out.</p>',
      visual: conceptSvg(),
      facts: [
        'Right tool, right unit: <b>ruler</b> (cm/mm) · <b>measuring cylinder</b> (mL) · <b>balance</b> (g/kg) · <b>stopwatch</b> (s) · <b>thermometer</b> (°C)',
        'Read a measuring cylinder at <b>eye level</b>, at the <b>bottom of the meniscus</b> (the curve)',
        'Measure from the <b>ZERO mark</b> on a ruler, not the end of the ruler',
        'In a table: units go in the <b>column heading</b>, once. Left column = what you changed; then the repeats; then the average',
        'Bottom axis is a <b>number</b> → <b>line graph</b>. Bottom axis is a set of <b>names/categories</b> → <b>bar chart</b>',
        'Average = <b>add the repeats ÷ how many there were</b>. A <b>conclusion</b> answers the original question using the results',
      ],
      steps: [
        'Before measuring, ask "<b>what am I measuring, and what unit will that be in?</b>" Then pick the tool that gives you that unit.',
        'To read any scale: find the <b>labelled line below</b> the level, work out <b>what one small mark is worth</b>, then count on.',
        'Build the table before you start: left column = the thing you changed, then <b>try 1, try 2, try 3</b>, then <b>average</b>. Units in the headings only.',
        'Choosing a graph: look at the bottom axis. <b>Numbers → line graph</b> (the points join up). <b>Names → bar chart</b> (separate bars with gaps).',
        'Write the conclusion as one sentence starting from your question: "<b>The [thing I changed] … so the [thing I measured] …</b>" — and say honestly if the prediction was not supported.',
      ],
      examples: [
        { q: 'Harper needs to measure how much water is in a beaker. What tool and unit?',
          visual: cylinderSvg(45),
          working: ['<b>Picture:</b> pouring the water into a tall thin cylinder so the scale is easy to read.', '1. Volume of a liquid → a <b>measuring cylinder</b>.', '2. Unit → <b>mL</b>.', '3. Read at eye level, at the <b>bottom of the meniscus</b> — here that is 45 mL.'],
          a: 'A measuring cylinder, in mL — this one reads 45 mL' },
        { q: 'How long is the pink strip?',
          visual: rulerSvg(5.5),
          working: ['<b>Picture:</b> lining the strip up with the <b>0 mark</b>, not the metal end of the ruler.', '1. The strip reaches past 5, half way to 6.', '2. Small marks are 1 mm, so half a centimetre is 5 mm.', '3. So it is 5 cm and 5 mm.'],
          a: '5.5 cm (or 55 mm)' },
        { q: 'What temperature is this, and what is each small mark worth?',
          visual: thermoSvg(65),
          working: ['<b>Picture:</b> a ladder — the labelled rungs are 20 apart.', '1. Between 60 and 80 there are 4 small marks, so each is <b>5 °C</b>.', '2. The liquid stops one small mark above 60.', '3. 60 + 5 = 65.'],
          a: '65 °C, and each small mark is 5 °C' },
        { q: 'Harper timed a pendulum three times: 14 s, 15 s, 16 s. What is the average, and where does it go in her table?',
          visual: resultTable(['string (cm)', 'try 1 (s)', 'try 2 (s)', 'try 3 (s)', 'mean (s)'], [['50', '14', '15', '16', '?']]),
          working: ['<b>Picture:</b> three goes shared out evenly.', '1. Add: 14 + 15 + 16 = 45.', '2. Divide by 3: 45 ÷ 3 = 15.', '3. It goes in the last column, and the unit is already in the heading.'],
          a: '15 s, in the "average (s)" column' },
        { q: 'She measured the temperature of a cooling cup of tea every minute. Bar chart or line graph?',
          working: ['<b>Picture:</b> look at what goes along the bottom axis.', '1. Bottom axis = <b>time in minutes</b> — that is a number.', '2. Numbers on the bottom, numbers up the side → the points join up.', 'So: a <b>line graph</b>. (If the bottom had been "wool, foil, paper" she would draw a bar chart.)'],
          a: 'A line graph' },
        { q: 'Read this bar chart: which covering kept the water hottest, and by how much did it beat the worst one?',
          visual: barChartSvg([45, 30, 35, 20], ['wool', 'foil', 'paper', 'none'], '°C'),
          working: ['<b>Picture:</b> the tallest bar means the hottest water at the end.', '1. Tallest bar: <b>wool</b>, 45 °C.', '2. Shortest bar: <b>none</b>, 20 °C.', '3. Difference: 45 − 20 = 25 °C.'],
          a: 'Wool was best; it beat "none" by 25 °C' },
        { q: 'A bottle in the lab has this symbol. What does it mean, and what should Harper do?',
          visual: hazardSvg('corrosive'),
          working: ['<b>Picture:</b> liquid dripping onto a hand and eating into a surface.', '1. That is the <b>corrosive</b> symbol.', '2. It burns skin and eyes and eats into materials.', '3. So: goggles on, do not touch it, and if any lands on you, wash it off with plenty of cold water and tell the teacher.'],
          a: 'Corrosive — goggles on, handle carefully, wash off spills at once' },
      ],
      tips: [
        'Measure from the <b>0 mark</b> on a ruler. The little bit before the zero is why so many measurements come out too short.',
        'Read a cylinder at <b>eye level</b>. Looking down from above always makes it read too high.',
        'Units go in the <b>heading</b> of the table, not after every number — and the graph axes need units too.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [toolJobQ, readRulerQ, readThermoQ, safetyQ, vocabQ, graphChoiceQ, hazardQ]
        : level === 2
          ? [toolJobQ, toolUseQ, readRulerQ, readCylinderQ, readScalesQ, readThermoQ, meniscusQ, tableSkillQ, graphChoiceQ, readGraphQ, meanQ, safetyQ, hazardQ, vocabQ]
          : [readRulerQ, readCylinderQ, readScalesQ, readStopwatchQ, readThermoQ, meniscusQ, tableSkillQ, graphChoiceQ, readGraphQ, meanQ, conclusionQ, hazardQ, safetyQ, toolUseQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
