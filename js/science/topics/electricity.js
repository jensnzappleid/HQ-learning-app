/* Topic: Electricity — circuit symbols, series and parallel, conductors, current and voltage, static. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';

  /* ---------- item pools ---------- */
  const PARTS = [
    { name: 'cell', job: 'pushes the current round the circuit (it gives the energy)' },
    { name: 'battery', job: 'two or more cells joined up, giving a bigger push' },
    { name: 'lamp', job: 'turns electrical energy into light' },
    { name: 'switch', job: 'opens and closes the circuit to turn it on and off' },
    { name: 'motor', job: 'turns electrical energy into movement' },
    { name: 'buzzer', job: 'turns electrical energy into sound' },
    { name: 'resistor', job: 'makes it harder for the current to flow, so the current is smaller' },
    { name: 'ammeter', job: 'measures the current, in amps' },
    { name: 'voltmeter', job: 'measures the voltage, in volts' },
  ];
  const PART_NAMES = PARTS.map((p) => p.name);

  const MATERIALS = [
    { m: 'copper wire', c: true }, { m: 'aluminium foil', c: true }, { m: 'a steel nail', c: true },
    { m: 'a gold ring', c: true }, { m: 'the graphite in a pencil', c: true }, { m: 'salty water', c: true },
    { m: 'plastic', c: false }, { m: 'rubber', c: false }, { m: 'dry wood', c: false }, { m: 'glass', c: false },
    { m: 'paper', c: false }, { m: 'a cotton sock', c: false }, { m: 'air', c: false }, { m: 'the plastic coating on a wire', c: false },
  ];

  const STATIC = [
    { p: 'Harper rubs a balloon on her jumper. What moves from the jumper to the balloon?', a: 'Electrons (tiny negative charges)', w: ['Protons', 'Whole atoms', 'Nothing moves'] },
    { p: 'What happens when two <b>negatively</b> charged balloons are brought together?', a: 'They push each other apart (repel)', w: ['They pull together (attract)', 'Nothing happens', 'They swap charges'], short: 'repel', shortAccept: ['push apart', 'they repel', 'repel each other', 'push each other away'] },
    { p: 'What happens when a <b>positive</b> and a <b>negative</b> charge are brought together?', a: 'They pull together (attract)', w: ['They push apart (repel)', 'Nothing happens', 'They both become neutral'], short: 'attract', shortAccept: ['pull together', 'they attract', 'attract each other'] },
    { p: 'Why does a charged balloon stick to the wall?', a: 'It attracts the opposite charges in the wall', w: ['It is sticky from rubbing', 'The wall is magnetic', 'Air pressure holds it'] },
    { p: 'Why does Harper\'s hair stand on end after the balloon is rubbed on it?', a: 'Every hair gets the same charge, and like charges repel', w: ['The hairs get heavier', 'The balloon is magnetic', 'The hairs are attracted to each other'] },
    { p: 'What is lightning?', a: 'A huge spark of static electricity', w: ['A magnetic force', 'Light from the sun reflecting', 'Sound turning into light'] },
    { p: 'What is <b>static</b> electricity?', a: 'Charge that has built up and is not flowing', w: ['Charge flowing round a circuit', 'The same thing as a current', 'A kind of magnetism'] },
    { p: 'A rubbed plastic comb picks up tiny bits of paper. Why?', a: 'The charged comb attracts the opposite charges in the paper', w: ['The comb is magnetic', 'The paper is sticky', 'The comb is a conductor'] },
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
  const textAns = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  /** typed synonyms accepted for each component name, used wherever she has to type the name
   *  herself instead of picking it from a list. */
  const PART_ACCEPT = {
    cell: ['a cell'], battery: ['batteries', 'a battery'], lamp: ['light bulb', 'bulb', 'a lamp', 'the lamp', 'light'],
    switch: ['a switch'], motor: ['a motor'], buzzer: ['a buzzer'], resistor: ['a resistor'],
    ammeter: ['amp meter', 'an ammeter'], voltmeter: ['volt meter', 'a voltmeter'],
  };

  /* ---------- circuit symbols (all drawn horizontally, 40 px wide) ---------- */
  function sym(type, x, y, withGap) {
    const gap = withGap === false ? '' : `<rect x="${x - 21}" y="${y - 17}" width="42" height="34" fill="#FFFDFE"/>`;
    const st = `stroke="${INK}" stroke-width="2.5" fill="none"`;
    const stub = `<line x1="${x - 21}" y1="${y}" x2="${x - 14}" y2="${y}" ${st}/><line x1="${x + 14}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>`;
    switch (type) {
      case 'cell':
        return gap + `<line x1="${x - 21}" y1="${y}" x2="${x - 5}" y2="${y}" ${st}/><line x1="${x + 5}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>` +
          `<line x1="${x - 5}" y1="${y - 13}" x2="${x - 5}" y2="${y + 13}" stroke="${INK}" stroke-width="2.5"/>` +
          `<line x1="${x + 5}" y1="${y - 7}" x2="${x + 5}" y2="${y + 7}" stroke="${INK}" stroke-width="6"/>`;
      case 'battery':
        return gap + `<line x1="${x - 21}" y1="${y}" x2="${x - 15}" y2="${y}" ${st}/><line x1="${x + 15}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>` +
          `<line x1="${x - 15}" y1="${y - 13}" x2="${x - 15}" y2="${y + 13}" stroke="${INK}" stroke-width="2.5"/>` +
          `<line x1="${x - 6}" y1="${y - 7}" x2="${x - 6}" y2="${y + 7}" stroke="${INK}" stroke-width="6"/>` +
          `<line x1="${x - 6}" y1="${y}" x2="${x + 5}" y2="${y}" ${st}/>` +
          `<line x1="${x + 5}" y1="${y - 13}" x2="${x + 5}" y2="${y + 13}" stroke="${INK}" stroke-width="2.5"/>` +
          `<line x1="${x + 15}" y1="${y - 7}" x2="${x + 15}" y2="${y + 7}" stroke="${INK}" stroke-width="6"/>`;
      case 'lamp':
        return gap + stub + `<circle cx="${x}" cy="${y}" r="14" ${st}/>` +
          `<line x1="${x - 10}" y1="${y - 10}" x2="${x + 10}" y2="${y + 10}" stroke="${INK}" stroke-width="2.5"/>` +
          `<line x1="${x + 10}" y1="${y - 10}" x2="${x - 10}" y2="${y + 10}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'switch-open':
        return gap + `<line x1="${x - 21}" y1="${y}" x2="${x - 12}" y2="${y}" ${st}/><line x1="${x + 12}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>` +
          `<circle cx="${x - 12}" cy="${y}" r="3" fill="${INK}"/><circle cx="${x + 12}" cy="${y}" r="3" fill="${INK}"/>` +
          `<line x1="${x - 12}" y1="${y}" x2="${x + 9}" y2="${y - 14}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'switch-closed':
        return gap + `<line x1="${x - 21}" y1="${y}" x2="${x - 12}" y2="${y}" ${st}/><line x1="${x + 12}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>` +
          `<circle cx="${x - 12}" cy="${y}" r="3" fill="${INK}"/><circle cx="${x + 12}" cy="${y}" r="3" fill="${INK}"/>` +
          `<line x1="${x - 12}" y1="${y}" x2="${x + 12}" y2="${y}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'motor':
        return gap + stub + `<circle cx="${x}" cy="${y}" r="14" ${st}/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="${INK}" font-size="13" font-weight="700">M</text>`;
      case 'ammeter':
        return gap + stub + `<circle cx="${x}" cy="${y}" r="14" ${st}/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="${INK}" font-size="13" font-weight="700">A</text>`;
      case 'voltmeter':
        return gap + stub + `<circle cx="${x}" cy="${y}" r="14" ${st}/><text x="${x}" y="${y + 5}" text-anchor="middle" fill="${INK}" font-size="13" font-weight="700">V</text>`;
      case 'buzzer':
        return gap + stub + `<path d="M ${x - 14} ${y + 10} L ${x - 14} ${y} A 14 14 0 0 1 ${x + 14} ${y} L ${x + 14} ${y + 10} Z" ${st}/>`;
      case 'resistor':
        return gap + stub + `<rect x="${x - 14}" y="${y - 8}" width="28" height="16" ${st}/>`;
      default:
        return gap + `<line x1="${x - 21}" y1="${y}" x2="${x + 21}" y2="${y}" ${st}/>`;
    }
  }
  const SYMBOL_TYPES = ['cell', 'battery', 'lamp', 'switch-open', 'motor', 'buzzer', 'resistor', 'ammeter', 'voltmeter'];
  const SYMBOL_NAME = { cell: 'cell', battery: 'battery', lamp: 'lamp', 'switch-open': 'switch', 'switch-closed': 'switch', motor: 'motor', buzzer: 'buzzer', resistor: 'resistor', ammeter: 'ammeter', voltmeter: 'voltmeter' };

  function symbolRow(types, letters) {
    const W = 336, cellW = W / types.length;
    return `<svg viewBox="0 0 ${W} 116" width="${W}" height="116" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${types.map((t, i) => {
        const cx = Math.round(cellW * (i + 0.5));
        return `<rect x="${cx - 36}" y="14" width="72" height="62" rx="8" fill="#FFFDFE" stroke="#D9CFBE" stroke-width="2"/>` +
          sym(t, cx, 45, false) +
          (letters ? `<text x="${cx}" y="98" text-anchor="middle" fill="#3C6E96" font-size="14">${letters[i]}</text>` : '');
      }).join('')}
    </svg>`;
  }

  function seriesSvg(top, o) {
    const opt = o || {};
    const x1 = 30, x2 = 300, yt = 50, yb = 156;
    const slots = top.length === 1 ? [165] : top.length === 2 ? [110, 220] : [80, 165, 250];
    const wire = `stroke="${INK}" stroke-width="2.5" fill="none"`;
    let s = `<line x1="${x1}" y1="${yt}" x2="${x2}" y2="${yt}" ${wire}/>` +
      `<line x1="${x1}" y1="${yb}" x2="${x2}" y2="${yb}" ${wire}/>` +
      `<line x1="${x1}" y1="${yt}" x2="${x1}" y2="${yb}" ${wire}/>`;
    if (opt.broken) {
      s += `<line x1="${x2}" y1="${yt}" x2="${x2}" y2="90" ${wire}/><line x1="${x2}" y1="120" x2="${x2}" y2="${yb}" ${wire}/>` +
        `<circle cx="${x2}" cy="90" r="3" fill="${INK}"/><circle cx="${x2}" cy="120" r="3" fill="${INK}"/>` +
        `<text x="${x2 - 8}" y="109" text-anchor="end" fill="#C33C72" font-size="11">break</text>`;
    } else {
      s += `<line x1="${x2}" y1="${yt}" x2="${x2}" y2="${yb}" ${wire}/>`;
    }
    s += top.map((t, i) => sym(t, slots[i], yt)).join('');
    if (opt.labels) s += top.map((t, i) => (t === 'lamp' ? `<text x="${slots[i]}" y="30" text-anchor="middle" fill="#C33C72" font-size="12">lamp ${i + 1}</text>` : '')).join('');
    s += sym(opt.cell || 'cell', 165, yb);
    return `<svg viewBox="0 0 330 196" width="330" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${s}<text x="165" y="188" text-anchor="middle" fill="${INK}" font-size="11">${opt.caption || 'a series circuit'}</text>
    </svg>`;
  }

  function parallelSvg(o) {
    const opt = o || {};
    const x1 = 30, x2 = 300, yTop = 44, yMid = 104, yBot = 164;
    const wire = `stroke="${INK}" stroke-width="2.5" fill="none"`;
    let s = `<line x1="${x1}" y1="${yTop}" x2="${x2}" y2="${yTop}" ${wire}/>` +
      `<line x1="${x1}" y1="${yMid}" x2="${x2}" y2="${yMid}" ${wire}/>` +
      `<line x1="${x1}" y1="${yBot}" x2="${x2}" y2="${yBot}" ${wire}/>` +
      `<line x1="${x1}" y1="${yTop}" x2="${x1}" y2="${yBot}" ${wire}/>` +
      `<line x1="${x2}" y1="${yTop}" x2="${x2}" y2="${yBot}" ${wire}/>` +
      `<circle cx="${x1}" cy="${yMid}" r="3.5" fill="${INK}"/><circle cx="${x2}" cy="${yMid}" r="3.5" fill="${INK}"/>`;
    s += sym(opt.a || 'lamp', 165, yTop) + sym(opt.b || 'lamp', 165, yMid) + sym('cell', 165, yBot);
    if (opt.labels) {
      s += `<text x="196" y="${yTop - 6}" fill="#C33C72" font-size="12">lamp 1</text><text x="196" y="${yMid - 6}" fill="#C33C72" font-size="12">lamp 2</text>`;
    }
    return `<svg viewBox="0 0 330 196" width="330" height="196" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${s}<text x="165" y="188" text-anchor="middle" fill="${INK}" font-size="11">${opt.caption || 'a parallel circuit'}</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function nameSymbol() {
    const t = R.pick(SYMBOL_TYPES);
    const name = SYMBOL_NAME[t];
    return {
      visual: symbolRow([t]),
      prompt: 'What component does this circuit symbol show?',
      answer: textAns(name, PART_ACCEPT[name], 'one word'),
      hint: 'A circle with a cross is a lamp; a circle with M is a motor; long line + short fat line is a cell.',
      working: ['<b>Picture:</b> every component has one agreed symbol so anyone can read the diagram.', `This one is the symbol for a <b>${name}</b>.`],
      finalAnswer: name, skill: 'symbols',
    };
  }
  function whichSymbol() {
    const types = R.sample(SYMBOL_TYPES, 4);
    const t = R.pick(types);
    const letters = ['A', 'B', 'C', 'D'];
    const c = choice(letters[types.indexOf(t)], letters, 4);
    return {
      visual: symbolRow(types, letters),
      prompt: `Which of these symbols is the <b>${SYMBOL_NAME[t]}</b>?`,
      answer: ans(c),
      hint: 'Lamp = circle with a cross. Motor = circle with M. Buzzer = a dome. Resistor = a plain rectangle.',
      working: ['<b>Picture:</b> read the symbol like a road sign — each one means exactly one thing.', `The <b>${SYMBOL_NAME[t]}</b> is symbol <b>${letters[types.indexOf(t)]}</b>.`],
      finalAnswer: letters[types.indexOf(t)], skill: 'symbols',
    };
  }
  function partJob() {
    const p = R.pick(PARTS);
    const c = choice(p.job, PARTS.map((x) => x.job), 4);
    return {
      prompt: `What is the job of the <b>${p.name}</b> in a circuit?`,
      answer: ans(c),
      hint: 'Ask what energy goes in and what comes out.',
      working: ['<b>Picture:</b> the cell is the pump, the wires are the pipes, and the lamp/motor/buzzer is what you get out.', `The ${p.name} <b>${p.job}</b>.`],
      finalAnswer: p.job, skill: 'parts',
    };
  }
  function seriesOrParallel() {
    const isParallel = R.chance(0.5);
    return {
      visual: isParallel ? parallelSvg({ caption: 'read the circuit' }) : seriesSvg(['lamp', 'lamp'], { caption: 'read the circuit' }),
      prompt: 'Is this circuit in <b>series</b> or in <b>parallel</b>?',
      answer: textAns(isParallel ? 'parallel' : 'series', [], 'one word'),
      hint: 'Series = one single loop, everything in a line. Parallel = the current has more than one path to choose.',
      working: [
        '<b>Picture:</b> series is a single-lane road; parallel is a road that splits into two lanes and joins up again.',
        isParallel ? '1. The wire splits so each lamp is on its own branch → <b>parallel</b>.' : '1. There is only one loop, so the same current goes through everything → <b>series</b>.',
      ],
      finalAnswer: isParallel ? 'Parallel' : 'Series', skill: 'circuits',
    };
  }
  function removeLamp() {
    const isParallel = R.chance(0.5);
    const correct = isParallel ? 'It stays on, just the same' : 'It goes out too';
    return {
      visual: isParallel ? parallelSvg({ labels: true, caption: 'two lamps in parallel' }) : seriesSvg(['lamp', 'lamp'], { labels: true, caption: 'two lamps in series' }),
      prompt: `In this circuit, <b>lamp 1 is taken out</b>. What happens to lamp 2? (stays on / goes out)`,
      answer: isParallel
        ? textAns('stays on', ['stays the same', 'same', 'on', 'still on', 'stays lit'], 'stays on / goes out')
        : textAns('goes out', ['turns off', 'off', 'goes off', 'goes out too', 'stops'], 'stays on / goes out'),
      hint: isParallel ? 'In parallel, each lamp has its own complete loop back to the cell.' : 'In series there is only one loop — break it anywhere and the whole thing stops.',
      working: [
        '<b>Picture:</b> series = one single-lane road; parallel = two separate lanes.',
        isParallel ? '1. Each lamp has its own path back to the cell.' : '1. There is only one loop for the current.',
        isParallel ? '2. Removing one leaves the other loop complete.' : '2. Taking a lamp out makes a gap, so the whole circuit is broken.',
        `So lamp 2 <b>${correct.toLowerCase()}</b>.`,
      ],
      finalAnswer: correct, skill: 'circuits',
    };
  }
  function willItLight() {
    const kind = R.pick(['open', 'closed', 'broken', 'ok']);
    const willLight = kind === 'closed' || kind === 'ok';
    const top = kind === 'open' ? ['lamp', 'switch-open'] : kind === 'closed' ? ['lamp', 'switch-closed'] : ['lamp'];
    const vis = seriesSvg(top, { broken: kind === 'broken', caption: 'will the lamp light?' });
    return {
      visual: vis,
      prompt: 'Look at the circuit. Will the lamp light up? (yes / no)',
      answer: textAns(willLight ? 'yes' : 'no'),
      hint: 'Trace your finger all the way round from one end of the cell back to the other. Any gap at all and nothing flows.',
      working: [
        '<b>Picture:</b> the current is like water in a loop of pipe — one gap and the whole flow stops.',
        kind === 'open' ? '1. The switch is <b>open</b>, so there is a gap.' : kind === 'broken' ? '1. There is a <b>break</b> in the wire.' : '1. Trace the loop: no gaps anywhere.',
        `So the lamp <b>${willLight ? 'lights up' : 'stays off'}</b>.`,
      ],
      finalAnswer: willLight ? 'Yes' : 'No', skill: 'circuits',
    };
  }
  function conductorQ() {
    const m = R.pick(MATERIALS);
    const correct = m.c ? 'A conductor' : 'An insulator';
    return {
      prompt: `Is <b>${m.m}</b> a conductor or an insulator of electricity?`,
      answer: textAns(m.c ? 'conductor' : 'insulator', m.c ? ['a conductor'] : ['an insulator'], 'one word'),
      hint: 'Metals conduct (and so does the graphite in a pencil). Plastic, rubber, wood, glass and air do not.',
      working: [
        '<b>Picture:</b> the copper inside a cable carries the current; the plastic round the outside keeps you safe.',
        `1. Is ${m.m} a metal (or graphite, or salty water)? ${m.c ? 'Yes.' : 'No.'}`,
        `So it is <b>${correct.toLowerCase()}</b>.`,
      ],
      finalAnswer: correct, skill: 'conductors',
    };
  }
  const CV_TEXT = [
    { p: 'What unit is <b>current</b> measured in?', a: 'amps', accept: ['amp', 'a', 'ampere', 'amperes'], full: 'amps (A)' },
    { p: 'What unit is <b>voltage</b> measured in?', a: 'volts', accept: ['volt', 'v'], full: 'volts (V)' },
    { p: 'Which instrument measures current?', a: 'ammeter', accept: ['an ammeter', 'amp meter'], full: 'an ammeter' },
    { p: 'Which instrument measures voltage?', a: 'voltmeter', accept: ['a voltmeter', 'volt meter'], full: 'a voltmeter' },
    { p: 'What does a <b>resistor</b> do to the current?', a: 'smaller', accept: ['makes it smaller', 'decreases it', 'reduces it', 'less'], full: 'Makes it smaller' },
  ];
  const CV_CHOICE = [
    { p: 'What is an electric <b>current</b>?', a: 'A flow of charge (electrons) round the circuit', w: ['The push that makes charge flow', 'The energy stored in the cell', 'The heat made by the wires'] },
    { p: 'What is <b>voltage</b>?', a: 'The push the cell gives to the current', w: ['The flow of charge itself', 'The number of lamps', 'The resistance of the wire'] },
    { p: 'You add a second cell to a circuit with one lamp. What happens?', a: 'A bigger push, so more current and a brighter lamp', w: ['A smaller current and a dimmer lamp', 'Nothing changes', 'The lamp goes out'] },
    { p: 'You add a second lamp <b>in series</b> with the first. What happens?', a: 'Both lamps are dimmer — the current is shared round one loop', w: ['Both lamps get brighter', 'Nothing changes', 'Only the first lamp lights'] },
    { p: 'Which way does a circuit have to be for a current to flow?', a: 'A complete loop with no gaps', w: ['Any shape, gaps are fine', 'A straight line', 'It must have two cells'] },
  ];
  function currentVoltage() {
    if (R.chance(0.5)) {
      const q = R.pick(CV_TEXT);
      return {
        prompt: q.p, answer: textAns(q.a, q.accept, 'one word'),
        hint: 'Current = the flow (amps). Voltage = the push (volts). A cell gives the push.',
        working: ['<b>Picture:</b> water in a pipe — voltage is the pump\'s push, current is how much water flows past each second.', `Answer: <b>${q.full}</b>.`],
        finalAnswer: q.full, skill: 'current',
      };
    }
    const q = R.pick(CV_CHOICE);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Current = the flow (amps). Voltage = the push (volts). A cell gives the push.',
      working: ['<b>Picture:</b> water in a pipe — voltage is the pump\'s push, current is how much water flows past each second.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'current',
    };
  }
  function staticQ() {
    const q = R.pick(STATIC);
    return {
      prompt: q.p,
      answer: q.short ? textAns(q.short, q.shortAccept, 'one word') : ans(choice(q.a, q.w, 4)),
      hint: 'Rubbing moves tiny negative electrons from one thing to the other. Like charges repel, opposites attract.',
      working: [
        '<b>Picture:</b> a balloon rubbed on a jumper steals electrons and becomes negative; the jumper is left positive.',
        'Like charges <b>repel</b>; opposite charges <b>attract</b>.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'static',
    };
  }
  function brightnessQ() {
    const cells = R.int(1, 3), lamps = R.int(1, 3);
    const other = { cells: R.int(1, 3), lamps: R.int(1, 3) };
    while (other.cells === cells && other.lamps === lamps) other.lamps = R.int(1, 3);
    const brighter = (cells / lamps) > (other.cells / other.lamps) ? 'A' : (cells / lamps) < (other.cells / other.lamps) ? 'B' : 'Same';
    return {
      prompt: `Circuit A: <b>${cells} cell${cells > 1 ? 's' : ''}</b> and <b>${lamps} lamp${lamps > 1 ? 's' : ''}</b> in series. Circuit B: <b>${other.cells} cell${other.cells > 1 ? 's' : ''}</b> and <b>${other.lamps} lamp${other.lamps > 1 ? 's' : ''}</b> in series. Which lamps are brighter? (A / B / same)`,
      answer: brighter === 'Same'
        ? textAns('same', ['the same', 'equal', 'same brightness', 'neither'])
        : textAns(brighter.toLowerCase(), [`circuit ${brighter.toLowerCase()}`]),
      hint: 'More cells = a bigger push = brighter. More lamps in series = the push is shared out = dimmer.',
      working: [
        '<b>Picture:</b> the cells are the pump; every extra lamp in the loop is another squeeze on the pipe.',
        `A: ${cells} cell${cells > 1 ? 's' : ''} shared between ${lamps} lamp${lamps > 1 ? 's' : ''}.`,
        `B: ${other.cells} cell${other.cells > 1 ? 's' : ''} shared between ${other.lamps} lamp${other.lamps > 1 ? 's' : ''}.`,
        `So <b>${brighter === 'Same' ? 'they are the same brightness' : 'circuit ' + brighter + ' is brighter'}</b>.`,
      ],
      finalAnswer: brighter === 'Same' ? 'The same' : `Circuit ${brighter}`, skill: 'circuits',
    };
  }
  function circuitCount() {
    const n = R.int(2, 3);
    const comps = R.sample(['lamp', 'motor', 'buzzer', 'resistor', 'switch-closed'], n);
    const t = R.pick(comps);
    return {
      visual: seriesSvg(comps, { caption: 'read the circuit diagram' }),
      prompt: `Look at this circuit diagram. Apart from the cell, name one component in it that ${PARTS.find((p) => p.name === SYMBOL_NAME[t]).job.replace(/^([a-z])/, '$1')}.`,
      answer: textAns(SYMBOL_NAME[t], PART_ACCEPT[SYMBOL_NAME[t]], 'one word'),
      hint: 'Match the job to the symbol: circle + cross = lamp, circle + M = motor, dome = buzzer, rectangle = resistor.',
      working: ['<b>Picture:</b> read each symbol along the top wire.', `The component that ${PARTS.find((p) => p.name === SYMBOL_NAME[t]).job} is the <b>${SYMBOL_NAME[t]}</b>.`],
      finalAnswer: SYMBOL_NAME[t], skill: 'symbols',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('Series — if one bulb blows, the whole string goes out', ['Parallel — the others stay on', 'It cannot be worked out', 'Series — the others stay on'], 4);
      return {
        visual: seriesSvg(['lamp', 'lamp', 'lamp'], { caption: 'old Christmas lights' }),
        prompt: 'On an old string of Christmas lights, one bulb blows and every single light goes out. How were they wired?',
        answer: ans(c),
        hint: 'One gap stopped everything — so how many paths were there?',
        working: [
          '<b>Picture:</b> a single-lane road with a crash on it — nothing gets through.',
          '1. All the lights went out, so there was only one loop.',
          '2. One loop = <b>series</b>. A gap anywhere stops the current everywhere.',
          'Modern lights are wired in parallel so one failure does not matter.',
        ],
        finalAnswer: 'In series',
      };
    },
    () => {
      const c = choice('In parallel, so each one works on its own', ['In series, so they all switch together', 'In series, so they are dimmer', 'It makes no difference'], 4);
      return {
        visual: parallelSvg({ labels: true, caption: 'lights in a house' }),
        prompt: 'The lights in Harper\'s house can be switched on one at a time, and they are all equally bright. How are they wired?',
        answer: ans(c),
        hint: 'Each light works whether the others are on or not.',
        working: [
          '<b>Picture:</b> a road that splits into separate lanes — closing one lane does not close the others.',
          '1. Each light has its own complete path back to the supply.',
          '2. That means <b>parallel</b>.',
          '3. Each one also gets the full voltage, so none of them is dimmer.',
        ],
        finalAnswer: 'In parallel',
      };
    },
    () => {
      const kind = R.pick(['open', 'broken']);
      const c = choice('No — there is a gap, so no current can flow', ['Yes — the cell always makes it light', 'Yes, but only dimly', 'No — the cell is flat'], 4);
      return {
        visual: seriesSvg(kind === 'open' ? ['lamp', 'switch-open'] : ['lamp'], { broken: kind === 'broken', caption: 'Harper\'s circuit' }),
        prompt: 'Harper builds this circuit and the lamp will not light. Will it work as it is?',
        answer: ans(c),
        hint: 'Trace all the way round the loop with your finger.',
        working: [
          '<b>Picture:</b> water can only flow round a loop of pipe if there are no gaps.',
          kind === 'open' ? '1. The switch is open — that is a gap.' : '1. There is a break in the wire — that is a gap.',
          '2. Current needs a <b>complete circuit</b>.',
          `So no current flows and the lamp stays off. ${kind === 'open' ? 'Close the switch to fix it.' : 'Join the wire to fix it.'}`,
        ],
        finalAnswer: 'No — the circuit is not complete',
      };
    },
    () => {
      const m = R.pick(MATERIALS);
      const c = choice(m.c ? 'The lamp lights — it is a conductor' : 'The lamp stays off — it is an insulator', ['The lamp lights — it is a conductor', 'The lamp stays off — it is an insulator'], 2);
      return {
        visual: seriesSvg(['lamp', 'switch-open'], { caption: 'the gap is where the object goes' }),
        prompt: `Harper tests materials by putting them in the gap in this circuit. She puts in <b>${m.m}</b>. What happens?`,
        answer: ans(c),
        hint: 'Only conductors will complete the circuit. Metals and graphite conduct; plastic, wood, glass and rubber do not.',
        working: [
          '<b>Picture:</b> the object has to become part of the pipe for the water to keep flowing.',
          `1. Is ${m.m} a conductor? ${m.c ? 'Yes — it is a metal or graphite.' : 'No — it is an insulator.'}`,
          `2. ${m.c ? 'The circuit is complete, so current flows.' : 'The circuit stays broken, so no current flows.'}`,
          `So <b>the lamp ${m.c ? 'lights' : 'stays off'}</b>.`,
        ],
        finalAnswer: m.c ? 'The lamp lights' : 'The lamp stays off',
      };
    },
    () => {
      const c = choice('Copper conducts the current; the plastic keeps it in and keeps you safe', ['Plastic conducts better than copper', 'The plastic makes the current stronger', 'Copper is an insulator'], 4);
      return {
        prompt: 'A power lead is copper wire wrapped in plastic. Why those two materials?',
        answer: ans(c),
        hint: 'One material has to carry the current; the other has to stop it escaping.',
        working: [
          '<b>Picture:</b> water in a hose — the water goes in the middle, the hose keeps it in.',
          '1. Copper is a <b>conductor</b>, so the current flows along it easily.',
          '2. Plastic is an <b>insulator</b>, so the current cannot reach your hand.',
        ],
        finalAnswer: 'Copper conducts, plastic insulates',
      };
    },
    () => {
      const c = choice('The balloon picked up extra electrons and became negatively charged', ['The balloon became magnetic', 'The balloon got hot and sticky', 'The wall became a conductor'], 4);
      return {
        prompt: 'Harper rubs a balloon on her jumper and it sticks to the wall. What happened?',
        answer: ans(c),
        hint: 'Rubbing moves tiny negative charges from one thing to the other.',
        working: [
          '<b>Picture:</b> rubbing scrapes electrons off the jumper onto the balloon.',
          '1. The balloon gains electrons → it becomes <b>negative</b>.',
          '2. It attracts the opposite (positive) charges in the wall.',
          '3. The attraction holds it up. That is <b>static</b> electricity — charge that is not flowing.',
        ],
        finalAnswer: 'It became negatively charged and attracted the wall',
      };
    },
    () => {
      const c = choice('Each hair has the same charge, and like charges repel', ['The hairs became magnetic', 'The hairs got lighter', 'Static makes hair heavier'], 4);
      return {
        prompt: 'Harper takes off a woolly hat and her hair stands straight up. Why?',
        answer: ans(c),
        hint: 'What happens when two charges are the same?',
        working: [
          '<b>Picture:</b> two north poles of a magnet pushing apart.',
          '1. Rubbing gives every hair the <b>same</b> charge.',
          '2. Like charges <b>repel</b>.',
          '3. Each hair pushes away from all the others, so they spread out.',
        ],
        finalAnswer: 'Like charges repel, so the hairs push apart',
      };
    },
    () => {
      const c = choice('Add another cell', ['Add another lamp in series', 'Make the wires longer', 'Add a resistor'], 4);
      return {
        visual: seriesSvg(['lamp'], { caption: 'how do we make it brighter?' }),
        prompt: 'Harper wants this lamp to be brighter. What should she change?',
        answer: ans(c),
        hint: 'More push means more current.',
        working: [
          '<b>Picture:</b> the cell is a pump; a second pump pushes harder.',
          '1. More cells = more voltage = a bigger push.',
          '2. More current flows, so the lamp is brighter.',
          '3. Adding a lamp or a resistor would do the opposite.',
        ],
        finalAnswer: 'Add another cell',
      };
    },
    () => {
      const c = choice('Both go dimmer, because they share the push from one cell', ['Both get brighter', 'Only the first one lights', 'Nothing changes'], 4);
      return {
        visual: seriesSvg(['lamp', 'lamp'], { caption: 'a second lamp added in series' }),
        prompt: 'Harper adds a second lamp in series to a circuit with one cell. What happens to the brightness?',
        answer: ans(c),
        hint: 'The same one cell now has to push through two lamps.',
        working: [
          '<b>Picture:</b> one pump pushing water through two narrow squeezes instead of one.',
          '1. Two lamps in series make it harder for the current to flow.',
          '2. Less current flows, and the push is shared between them.',
          'So <b>both lamps are dimmer</b>.',
        ],
        finalAnswer: 'Both go dimmer',
      };
    },
    () => {
      const c = choice('Test each material in the same gap, with the same cell and lamp', ['Use a different cell for each material', 'Change the number of lamps each time', 'Only test the metals'], 4);
      return {
        prompt: 'Harper is testing which materials conduct electricity. How should she set up a fair test?',
        answer: ans(c),
        hint: 'Only one thing may change: the material.',
        working: [
          '<b>Picture:</b> same race, same track, only the runner changes.',
          '1. What is she changing? The material in the gap.',
          '2. So keep the cell, the lamp, the wires and the size of the gap the same.',
          '3. Watch the same thing each time: does the lamp light?',
        ],
        finalAnswer: 'Change only the material being tested',
      };
    },
    () => {
      const c = choice('So one appliance can be switched off without turning the others off', ['So they are all dimmer', 'So they all switch on together', 'So less current is used'], 4);
      return {
        visual: parallelSvg({ labels: true, caption: 'plugs in a house' }),
        prompt: 'Every plug and light in a house is wired in parallel, not series. Why is that a good idea?',
        answer: ans(c),
        hint: 'What would happen in series if you unplugged the toaster?',
        working: [
          '<b>Picture:</b> separate lanes, each with its own way back.',
          '1. In parallel, each appliance has its own complete path.',
          '2. Switching one off leaves the others working.',
          '3. Each one also gets the full voltage, so nothing is dimmer.',
        ],
        finalAnswer: 'Each one works independently',
      };
    },
  ];

  HL.registerTopic({
    id: 'electricity', subject: 'science', strand: 'physical', order: 6,
    name: 'Electricity', short: 'Electricity', animal: 'crab',
    blurb: 'Circuits, symbols, series and parallel — and why the lamp sometimes will not light.',
    example: 'series = one loop · parallel = each lamp on its own branch',
    learn: {
      what: '<p>An electric <b>current</b> is a flow of charge, and it can only flow round a <b>complete circuit</b> with no gaps. The <b>cell</b> gives the push (the <b>voltage</b>, in volts); the current is how much flows (in <b>amps</b>). Every component has an agreed <b>symbol</b>, so a circuit diagram can be read by anyone.</p><p>In a <b>series</b> circuit everything is in one loop — take one lamp out and they all go off. In a <b>parallel</b> circuit the current splits between branches, so each lamp has its own path and keeps working on its own.</p><p><b>Picture for this topic:</b> <b>water in a loop of pipe</b>. The cell is the pump (the push), the current is the water flowing, and a switch is a tap. One gap anywhere and everything stops.</p>',
      visual: `<svg viewBox="0 0 350 214" width="350" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
        <text x="88" y="16" text-anchor="middle" fill="#4A4033" font-size="12">SERIES — one loop</text>
        <line x1="20" y1="34" x2="158" y2="34" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="20" y1="104" x2="158" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="20" y1="34" x2="20" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="158" y1="34" x2="158" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        ${sym('lamp', 60, 34)}${sym('lamp', 118, 34)}${sym('cell', 89, 104)}
        <text x="88" y="126" text-anchor="middle" fill="#C33C72" font-size="10">one out → both go off</text>
        <text x="88" y="142" text-anchor="middle" fill="#4A4033" font-size="10">share the push → dimmer</text>
        <line x1="176" y1="6" x2="176" y2="150" stroke="#D9CFBE" stroke-width="2"/>
        <text x="264" y="16" text-anchor="middle" fill="#4A4033" font-size="11.5">PARALLEL — two paths</text>
        <line x1="196" y1="34" x2="332" y2="34" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="196" y1="70" x2="332" y2="70" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="196" y1="104" x2="332" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="196" y1="34" x2="196" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        <line x1="332" y1="34" x2="332" y2="104" stroke="#4A4033" stroke-width="2.5"/>
        <circle cx="196" cy="70" r="3.5" fill="#4A4033"/><circle cx="332" cy="70" r="3.5" fill="#4A4033"/>
        ${sym('lamp', 264, 34)}${sym('lamp', 264, 70)}${sym('cell', 264, 104)}
        <text x="264" y="126" text-anchor="middle" fill="#4E7A34" font-size="10">one out → the other stays on</text>
        <text x="264" y="142" text-anchor="middle" fill="#4A4033" font-size="10">each lamp gets the full push</text>
        <rect x="8" y="156" width="334" height="50" rx="10" fill="#F3EFE6" stroke="#D9CFBE" stroke-width="2"/>
        <text x="175" y="176" text-anchor="middle" fill="#4A4033" font-size="11">voltage = the push (V) &#183; current = the flow (A)</text>
        <text x="175" y="196" text-anchor="middle" fill="#C33C72" font-size="11">no complete loop = no current at all</text>
      </svg>`,
      facts: [
        'A current only flows round a <b>complete circuit</b> — one gap and everything stops.',
        '<b>Voltage</b> (volts, V) = the push from the cell. <b>Current</b> (amps, A) = how much charge flows.',
        '<b>Series</b>: one loop. Remove one lamp → they all go out. More lamps → all dimmer.',
        '<b>Parallel</b>: separate branches. Remove one lamp → the others stay on, just as bright.',
        'Symbols: <b>cell</b> = long line + short fat line · <b>lamp</b> = circle with a cross · <b>motor</b> = circle with M · <b>buzzer</b> = a dome · <b>resistor</b> = a rectangle.',
        '<b>Conductors</b>: metals and graphite. <b>Insulators</b>: plastic, rubber, wood, glass, air.',
        '<b>Static</b> electricity is charge that has built up and is not flowing. Like charges <b>repel</b>, opposites <b>attract</b>.',
      ],
      steps: [
        'Read the diagram symbol by symbol, then <b>trace the loop with your finger</b> from one end of the cell all the way back to the other.',
        'Ask "<b>are there any gaps?</b>" — an open switch or a break means no current anywhere.',
        'Ask "<b>how many paths are there?</b>" — one path = <b>series</b>; a split that joins up again = <b>parallel</b>.',
        'For "what happens if one lamp is removed": series → <b>all off</b>; parallel → <b>the others stay on</b>.',
        'For brightness: more <b>cells</b> = brighter; more <b>lamps in series</b> = dimmer.',
      ],
      examples: [
        {
          q: 'What component does this symbol show?',
          visual: symbolRow(['lamp']),
          working: ['<b>Picture:</b> a circle with a cross drawn through it.', '1. Circle with a cross = <b>lamp</b>.', '2. Circle with an M inside would be a motor; a dome would be a buzzer.'],
          a: 'A lamp',
        },
        {
          q: 'Name each symbol along the top of this circuit.',
          visual: symbolRow(['cell', 'lamp', 'switch-open', 'motor'], ['A', 'B', 'C', 'D']),
          working: ['<b>Picture:</b> read them like road signs — one meaning each.', 'A = <b>cell</b> (long line + short fat line).', 'B = <b>lamp</b> (circle with a cross).', 'C = <b>switch</b>, drawn open (there is a gap).', 'D = <b>motor</b> (circle with M).'],
          a: 'cell, lamp, open switch, motor',
        },
        {
          q: 'Will this lamp light?',
          visual: seriesSvg(['lamp', 'switch-open'], { caption: 'will the lamp light?' }),
          working: ['<b>Picture:</b> water in a loop of pipe — a gap stops everything.', '1. Trace the loop from the cell.', '2. The switch is drawn <b>open</b>, so there is a gap.', '3. No complete circuit → no current.'],
          a: 'No — the switch is open',
        },
        {
          q: 'Two lamps are in series. Lamp 1 is unscrewed. What happens to lamp 2?',
          visual: seriesSvg(['lamp', 'lamp'], { labels: true, caption: 'two lamps in series' }),
          working: ['<b>Picture:</b> a single-lane road with a crash on it.', '1. How many paths are there? Only one.', '2. Unscrewing lamp 1 makes a gap in that one path.', '3. No current flows anywhere.'],
          a: 'Lamp 2 goes out as well',
        },
        {
          q: 'The same two lamps are wired in parallel instead. Lamp 1 is unscrewed. What happens now?',
          visual: parallelSvg({ labels: true, caption: 'two lamps in parallel' }),
          working: ['<b>Picture:</b> a road that splits into two lanes and joins up again.', '1. Each lamp has its <b>own</b> complete path back to the cell.', '2. Removing lamp 1 only breaks that branch.', '3. Lamp 2\'s loop is still complete, and it still gets the full voltage.'],
          a: 'Lamp 2 stays on, just as bright',
        },
        {
          q: 'Harper puts different objects in a gap in a circuit and watches the lamp. What is she testing, and what will happen with a plastic ruler and with a steel nail?',
          visual: `<table class="data"><tr><th>object</th><th>lamp</th><th>so it is…</th></tr><tr><td>steel nail</td><td>lights</td><td>a conductor</td></tr><tr><td>copper wire</td><td>lights</td><td>a conductor</td></tr><tr><td>plastic ruler</td><td>stays off</td><td>an insulator</td></tr><tr><td>wooden peg</td><td>stays off</td><td>an insulator</td></tr></table>`,
          working: ['<b>Picture:</b> the object has to become part of the pipe for the water to keep flowing.', '1. She is testing whether each material is a <b>conductor</b>.', '2. Steel is a metal → conductor → the lamp <b>lights</b>.', '3. Plastic is an <b>insulator</b> → the circuit stays broken → the lamp <b>stays off</b>.', '4. Fair test: same cell, same lamp, same gap every time.'],
          a: 'Conductors (metals) light the lamp; insulators do not',
        },
        {
          q: 'Harper rubs a balloon on her jumper and it sticks to the wall. Explain it.',
          working: [
            '<b>Picture:</b> rubbing scrapes tiny electrons from the jumper onto the balloon.',
            '1. The balloon gains electrons → it becomes <b>negatively</b> charged.',
            '2. The jumper is left <b>positively</b> charged.',
            '3. The negative balloon attracts the positive charges in the wall.',
            '4. That is <b>static</b> electricity — charge that has built up and is not flowing.',
          ],
          a: 'The balloon became negatively charged and is attracted to the wall',
        },
      ],
      tips: [
        'Before answering anything, <b>trace the loop with your finger</b>. Most circuit questions are just "is there a gap?".',
        'Do not mix them up: <b>voltage is the push</b>, <b>current is the flow</b>. The cell supplies the push.',
        'Parallel lamps stay the <b>same brightness</b> when another one is added; series lamps get dimmer.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [nameSymbol, whichSymbol, partJob, conductorQ, seriesOrParallel, willItLight, currentVoltage]
        : level === 2
          ? [nameSymbol, whichSymbol, partJob, conductorQ, seriesOrParallel, willItLight, removeLamp, currentVoltage, staticQ, circuitCount]
          : [whichSymbol, partJob, conductorQ, seriesOrParallel, removeLamp, willItLight, currentVoltage, staticQ, brightnessQ, circuitCount, nameSymbol];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
