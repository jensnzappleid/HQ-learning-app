/* Topic: Light & sound — rays, reflection, refraction, shadows, colour; vibrations, pitch, loudness, echoes. */
(function (HL) {
  const R = HL.rng;
  const INK = '#4A4033';
  const RAD = Math.PI / 180;

  /* ---------- item pools ---------- */
  const OPACITY = [
    { m: 'clear window glass', t: 'transparent' }, { m: 'clean water', t: 'transparent' }, { m: 'cling film', t: 'transparent' },
    { m: 'a clear plastic ruler', t: 'transparent' }, { m: 'frosted bathroom glass', t: 'translucent' }, { m: 'greaseproof paper', t: 'translucent' },
    { m: 'thin net curtains', t: 'translucent' }, { m: 'tissue paper', t: 'translucent' }, { m: 'a brick wall', t: 'opaque' },
    { m: 'a wooden door', t: 'opaque' }, { m: 'a metal sheet', t: 'opaque' }, { m: 'a school book', t: 'opaque' }, { m: 'your hand', t: 'opaque' },
  ];
  const OBJ_COLOURS = ['red', 'green', 'blue', 'white'];
  const FILTERS = ['red', 'green', 'blue'];
  const SOUND_SOURCES = [
    { s: 'a guitar string', v: 'the string vibrating' }, { s: 'a drum', v: 'the skin vibrating' },
    { s: 'a speaker', v: 'the cone vibrating in and out' }, { s: 'your voice', v: 'your vocal cords vibrating' },
    { s: 'a tuning fork', v: 'the prongs vibrating' }, { s: 'a ruler twanged off the desk', v: 'the ruler vibrating' },
  ];
  const MEDIA = [
    { m: 'steel', speed: 5000, kind: 'solid' }, { m: 'water', speed: 1500, kind: 'liquid' },
    { m: 'air', speed: 340, kind: 'gas' }, { m: 'empty space (a vacuum)', speed: 0, kind: 'nothing' },
  ];

  /* ---------- helpers ---------- */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }
  const ans = (c) => ({ type: 'choice', value: c.value, choices: c.choices });
  const r1 = (v) => Math.round(v * 10) / 10;
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const arrow = (x1, y1, x2, y2, col, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / L, uy = dy / L, hx = r1(x2 - ux * 11), hy = r1(y2 - uy * 11), px = r1(-uy * 6), py = r1(ux * 6);
    return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="${w || 3.5}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${r1(hx + px)},${r1(hy + py)} ${r1(hx - px)},${r1(hy - py)}" fill="${col}"/>`;
  };

  /* ---------- diagrams ---------- */
  function mirrorSvg(i, opts) {
    const o = opts || {};
    const px = 165, py = 152, L = 112;
    const ix = r1(px - L * Math.sin(i * RAD)), iy = r1(py - L * Math.cos(i * RAD));
    const rx = r1(px + L * Math.sin(i * RAD)), ry = iy;
    const a1x = r1(px - 42 * Math.sin(i * RAD)), a1y = r1(py - 42 * Math.cos(i * RAD));
    const a2x = r1(px + 42 * Math.sin(i * RAD)), a2y = a1y;
    return `<svg viewBox="0 0 330 200" width="330" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <line x1="30" y1="152" x2="300" y2="152" stroke="#5F98C4" stroke-width="5"/>
      ${[40, 62, 84, 106, 128, 150, 172, 194, 216, 238, 260, 282].map((x) => `<line x1="${x}" y1="155" x2="${x - 10}" y2="167" stroke="#9BB8CE" stroke-width="2"/>`).join('')}
      <line x1="${px}" y1="152" x2="${px}" y2="26" stroke="#8E79C6" stroke-width="2.5" stroke-dasharray="7 5"/>
      <text x="${px + 6}" y="34" fill="#6B57A3" font-size="11">normal</text>
      ${arrow(ix, iy, r1(px - 8 * Math.sin(i * RAD)), r1(py - 8 * Math.cos(i * RAD)), '#E8C24A', 4)}
      ${arrow(r1(px + 8 * Math.sin(i * RAD)), r1(py - 8 * Math.cos(i * RAD)), rx, ry, '#E0568C', 4)}
      <path d="M ${a1x} ${a1y} A 42 42 0 0 1 ${px} ${py - 42}" fill="none" stroke="#9A6A0F" stroke-width="1.5"/>
      <path d="M ${px} ${py - 42} A 42 42 0 0 1 ${a2x} ${a2y}" fill="none" stroke="#C33C72" stroke-width="1.5"/>
      ${(() => {
        const li = o.iLabel || 'i', lr = o.rLabel || 'r';
        const lx1 = r1(px - 64 * Math.sin(i * RAD / 2)), ly = r1(py - 64 * Math.cos(i * RAD / 2));
        const lx2 = r1(px + 64 * Math.sin(i * RAD / 2));
        const pill = (x, w) => `<rect x="${r1(x - w / 2)}" y="${ly - 11}" width="${w}" height="19" rx="6" fill="#FFFDFE" opacity="0.92"/>`;
        return pill(lx1, li.length * 7.5 + 8) + `<text x="${lx1}" y="${ly + 4}" text-anchor="middle" fill="#9A6A0F" font-size="12">${li}</text>` +
               pill(lx2, lr.length * 7.5 + 8) + `<text x="${lx2}" y="${ly + 4}" text-anchor="middle" fill="#C33C72" font-size="12">${lr}</text>`;
      })()}
      <text x="${ix < 40 ? 40 : ix}" y="${iy - 8}" text-anchor="middle" fill="#9A6A0F" font-size="11">ray in</text>
      <text x="${rx > 290 ? 290 : rx}" y="${ry - 8}" text-anchor="middle" fill="#C33C72" font-size="11">ray out</text>
      <text x="165" y="190" text-anchor="middle" fill="${INK}" font-size="11">${o.caption || 'a ray of light hitting a mirror'}</text>
    </svg>`;
  }

  function refractionSvg() {
    return `<svg viewBox="0 0 330 200" width="330" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect x="90" y="62" width="150" height="76" fill="#DCEEF9" stroke="#5F98C4" stroke-width="2.5"/>
      <text x="165" y="106" text-anchor="middle" fill="#3C6E96" font-size="12">glass block</text>
      <line x1="90" y1="26" x2="90" y2="174" stroke="#8E79C6" stroke-width="2" stroke-dasharray="7 5"/>
      <text x="66" y="34" text-anchor="end" fill="#6B57A3" font-size="10">normal</text>
      ${arrow(20, 34, 88, 61, '#E8C24A', 4)}
      <line x1="90" y1="62" x2="240" y2="106" stroke="#E0568C" stroke-width="4" stroke-linecap="round"/>
      ${arrow(240, 106, 306, 132, '#E0568C', 4)}
      <line x1="90" y1="62" x2="216" y2="112" stroke="#B9A5E6" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="228" y="132" fill="#8E79C6" font-size="10">where it would</text>
      <text x="228" y="146" fill="#8E79C6" font-size="10">have gone</text>
      <text x="30" y="60" fill="#9A6A0F" font-size="11">ray in</text>
      <text x="165" y="190" text-anchor="middle" fill="${INK}" font-size="11">light bends when it enters glass — refraction</text>
    </svg>`;
  }

  function shadowSvg(objX) {
    const lampX = 34, lampY = 100, screenX = 292;
    const top = r1(lampY + (72 - lampY) * (screenX - lampX) / (objX - lampX));
    const bot = r1(lampY + (128 - lampY) * (screenX - lampX) / (objX - lampX));
    return `<svg viewBox="0 0 330 200" width="330" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <circle cx="${lampX}" cy="${lampY}" r="13" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="${lampX}" y="${lampY + 34}" text-anchor="middle" fill="#9A6A0F" font-size="11">lamp</text>
      <line x1="${lampX}" y1="${lampY}" x2="${screenX}" y2="${top}" stroke="#E8C24A" stroke-width="1.8" stroke-dasharray="5 4"/>
      <line x1="${lampX}" y1="${lampY}" x2="${screenX}" y2="${bot}" stroke="#E8C24A" stroke-width="1.8" stroke-dasharray="5 4"/>
      <rect x="${objX - 9}" y="72" width="18" height="56" rx="3" fill="#4A4033"/>
      <text x="${objX}" y="64" text-anchor="middle" fill="${INK}" font-size="11">object</text>
      <line x1="${screenX}" y1="16" x2="${screenX}" y2="184" stroke="#9BB8CE" stroke-width="4"/>
      <line x1="${screenX}" y1="${Math.max(16, top)}" x2="${screenX}" y2="${Math.min(184, bot)}" stroke="#4A4033" stroke-width="9"/>
      <text x="${screenX + 8}" y="${r1((Math.max(16, top) + Math.min(184, bot)) / 2)}" fill="${INK}" font-size="11" transform="rotate(90 ${screenX + 8} ${r1((Math.max(16, top) + Math.min(184, bot)) / 2)})" text-anchor="middle">shadow</text>
      <text x="165" y="196" text-anchor="middle" fill="${INK}" font-size="11">light travels in straight lines</text>
    </svg>`;
  }

  function wavesSvg(a, b) {
    const pts = (amp, freq, midY) => {
      let p = [];
      for (let x = 0; x <= 260; x += 4) p.push(`${r1(34 + x)},${r1(midY - amp * Math.sin(2 * Math.PI * freq * x / 260))}`);
      return p.join(' ');
    };
    const panel = (w, midY, letter) => `
      <line x1="30" y1="${midY}" x2="304" y2="${midY}" stroke="#D9CFBE" stroke-width="1.5"/>
      <polyline points="${pts(w.amp, w.freq, midY)}" fill="none" stroke="${letter === 'A' ? '#E0568C' : '#5F98C4'}" stroke-width="3"/>
      <circle cx="16" cy="${midY}" r="12" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>
      <text x="16" y="${midY + 4}" text-anchor="middle" fill="${INK}" font-size="12">${letter}</text>`;
    return `<svg viewBox="0 0 330 190" width="330" height="190" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      ${panel(a, 54, 'A')}${panel(b, 134, 'B')}
      <text x="165" y="182" text-anchor="middle" fill="${INK}" font-size="11">two sound waves drawn the same size across</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function lightFact() {
    const q = R.pick([
      { p: 'How does light travel?', a: 'In straight lines', w: ['In curves', 'In circles', 'It bends round corners'] },
      { p: 'Why do we get a shadow behind an object?', a: 'Light travels in straight lines and cannot get through the object', w: ['The object makes darkness', 'Light bends round the object', 'The object pushes the light away'] },
      { p: 'What do we call an object that lets NO light through?', a: 'opaque', w: ['transparent', 'translucent', 'luminous'] },
      { p: 'What do we call an object you can see clearly through?', a: 'transparent', w: ['opaque', 'translucent', 'reflective'] },
      { p: 'What do we call an object that lets some light through, but you cannot see clearly through it?', a: 'translucent', w: ['transparent', 'opaque', 'luminous'] },
      { p: 'Which of these is a light source (it makes its own light)?', a: 'The Sun', w: ['The Moon', 'A mirror', 'A white wall'] },
      { p: 'How do we see a non-luminous object like a chair?', a: 'Light bounces off it into our eyes', w: ['The chair makes its own light', 'Our eyes send light out to it', 'We see it because it is dark'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Light goes in straight lines, and we see things when light bounces off them into our eyes.',
      working: ['<b>Picture:</b> a torch beam in a dusty room — dead straight, never curved.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'light',
    };
  }
  function opacityQ() {
    const o = R.pick(OPACITY);
    const c = choice(o.t, ['transparent', 'translucent', 'opaque'], 3);
    return {
      prompt: `Is <b>${o.m}</b> transparent, translucent or opaque?`,
      answer: ans(c),
      hint: 'See through clearly = transparent. Blurry light gets through = translucent. No light at all = opaque.',
      working: [
        '<b>Picture:</b> a window (transparent) · frosted bathroom glass (translucent) · a door (opaque).',
        `1. Can you see clearly through ${o.m}? ${o.t === 'transparent' ? 'Yes.' : 'No.'}`,
        `2. Does any light get through? ${o.t === 'opaque' ? 'No.' : 'Yes.'}`,
        `So it is <b>${o.t}</b>.`,
      ],
      finalAnswer: o.t, skill: 'light',
    };
  }
  function reflectAngle(level) {
    const i = R.step(20, 70, 5);
    if (level === 3 && R.chance(0.5)) {
      return {
        visual: mirrorSvg(i, { caption: 'the ray makes ' + (90 - i) + '° with the mirror surface' }),
        prompt: `A ray hits a mirror at <b>${90 - i}° to the mirror surface</b>. What is the angle of reflection (measured from the <b>normal</b>)?`,
        answer: { type: 'number', value: i, unit: '°', placeholder: 'e.g. 40' },
        hint: 'Angles are always measured from the normal, not from the mirror. The normal is 90° to the mirror.',
        working: [
          '<b>Rule:</b> angles in reflection are measured from the <b>normal</b> (the dashed line at 90° to the mirror).',
          `1. Angle to the mirror = ${90 - i}°, so angle to the normal = 90 − ${90 - i} = ${i}°.`,
          '2. Law of reflection: angle of incidence = angle of reflection.',
          `So the angle of reflection = <b>${i}°</b>.`,
        ],
        finalAnswer: `${i}°`, skill: 'reflection',
      };
    }
    return {
      visual: mirrorSvg(i, { iLabel: i + '°', rLabel: 'r = ?' }),
      prompt: `A ray of light hits a mirror with an angle of incidence of <b>${i}°</b>. What is the angle of reflection?`,
      answer: { type: 'number', value: i, unit: '°', placeholder: 'e.g. 40' },
      hint: 'The law of reflection: the angle of incidence equals the angle of reflection.',
      working: ['<b>Rule:</b> angle of incidence = angle of reflection.', `The ray comes in at ${i}° from the normal, so it leaves at <b>${i}°</b> from the normal.`, 'It is like a ball bouncing off a wall at the same angle.'],
      finalAnswer: `${i}°`, skill: 'reflection',
    };
  }
  function reflectionFact() {
    const i = R.step(25, 65, 5);
    const q = R.pick([
      { p: 'On a ray diagram, what is the dashed line at 90° to the mirror called?', a: 'the normal', w: ['the incident ray', 'the reflected ray', 'the angle of reflection'] },
      { p: 'Where do we measure the angle of incidence from?', a: 'From the normal', w: ['From the mirror surface', 'From the floor', 'From the reflected ray'] },
      { p: 'What does the law of reflection say?', a: 'The angle of incidence equals the angle of reflection', w: ['The angle of incidence is double the angle of reflection', 'Light always reflects straight back', 'The angle depends on the colour'] },
      { p: 'Why can you see your face in a mirror but not in a brick wall?', a: 'The mirror is smooth, so it reflects the rays in a neat pattern', w: ['A brick wall absorbs all the light', 'A mirror makes its own light', 'Brick is transparent'] },
      { p: 'What is the ray that hits the mirror called?', a: 'the incident ray', w: ['the reflected ray', 'the normal', 'the refracted ray'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: mirrorSvg(i),
      prompt: q.p, answer: ans(c),
      hint: 'Ray in = incident ray. Ray out = reflected ray. Dashed line at 90° = the normal.',
      working: ['<b>Picture:</b> a ball bouncing off a wall — it leaves at the same angle it arrived.', 'All angles are measured from the <b>normal</b>, the dashed line at 90° to the mirror.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'reflection',
    };
  }
  function refractionQ() {
    const q = R.pick([
      { p: 'Why does a straw in a glass of water look bent?', a: 'Light bends (refracts) as it leaves the water', w: ['The straw really does bend in water', 'Water absorbs some of the light', 'The glass is a mirror'] },
      { p: 'What is it called when light bends as it goes from air into glass?', a: 'refraction', w: ['reflection', 'absorption', 'dispersion'] },
      { p: 'Why does light bend when it goes from air into water?', a: 'It slows down in the water', w: ['It speeds up in the water', 'It gets heavier', 'The water pushes it sideways'] },
      { p: 'A swimming pool always looks shallower than it really is. Why?', a: 'Light from the bottom refracts as it leaves the water', w: ['Water shrinks things', 'The pool really is shallow', 'Light is absorbed by water'] },
      { p: 'What happens to the speed of light when it enters a glass block?', a: 'It slows down', w: ['It speeds up', 'It stays exactly the same', 'It stops'] },
      { p: 'White light is split into a rainbow by a prism. What is that called?', a: 'dispersion', w: ['reflection', 'conduction', 'absorption'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      visual: refractionSvg(),
      prompt: q.p, answer: ans(c),
      hint: 'Light changes speed when it changes material, and that makes the ray change direction.',
      working: [
        '<b>Picture:</b> a trolley wheel hitting sand at an angle — one side slows first, so the whole thing swings round.',
        '1. Light travels slower in glass and water than in air.',
        '2. Hitting the surface at an angle makes it change direction — that is <b>refraction</b>.',
        `Answer: <b>${q.a}</b>.`,
      ],
      finalAnswer: q.a, skill: 'refraction',
    };
  }
  function shadowQ() {
    const near = R.chance(0.5);
    const objX = near ? 130 : 196;
    const q = near
      ? { p: 'The object has been moved <b>closer to the lamp</b>. What happens to the shadow on the screen?', a: 'It gets bigger', w: ['It gets smaller', 'It stays the same size', 'It disappears'] }
      : { p: 'The object has been moved <b>further from the lamp</b> (closer to the screen). What happens to the shadow?', a: 'It gets smaller', w: ['It gets bigger', 'It stays the same size', 'It disappears'] };
    const c = choice(q.a, q.w, 4);
    return {
      visual: shadowSvg(objX),
      prompt: q.p, answer: ans(c),
      hint: 'Follow the straight rays from the lamp past the edges of the object. Closer to the lamp means the rays spread out more before they land.',
      working: [
        '<b>Picture:</b> hold your hand near a torch and the hand-shadow fills the wall.',
        '1. Light goes in straight lines from the lamp.',
        `2. ${near ? 'Closer to the lamp, the two edge rays spread further apart by the time they reach the screen.' : 'Further from the lamp, the edge rays have less room left to spread.'}`,
        `So the shadow <b>${q.a.toLowerCase()}</b>.`,
      ],
      finalAnswer: q.a, skill: 'shadows',
    };
  }
  function colourQ() {
    const obj = R.pick(OBJ_COLOURS.filter((c) => c !== 'white'));
    const c = choice(`It reflects ${obj} light and absorbs all the other colours`, OBJ_COLOURS.filter((x) => x !== obj && x !== 'white').map((x) => `It reflects ${x} light and absorbs all the other colours`).concat(['It makes its own ' + obj + ' light', 'It absorbs ' + obj + ' light and reflects the rest']), 4);
    return {
      prompt: `In white light, why does a <b>${obj}</b> jumper look ${obj}?`,
      answer: ans(c),
      hint: 'White light is all the colours mixed. An object only sends back the colour you see.',
      working: [
        '<b>Picture:</b> white light is all the colours arriving together; the jumper is fussy and only bounces one back.',
        `1. All the colours land on the jumper.`,
        `2. It <b>absorbs</b> the others and <b>reflects ${obj}</b>.`,
        `3. Only ${obj} light reaches your eyes, so it looks ${obj}.`,
      ],
      finalAnswer: `It reflects ${obj} and absorbs the rest`, skill: 'colour',
    };
  }
  function filterQ() {
    const obj = R.pick(OBJ_COLOURS), f = R.pick(FILTERS);
    const looks = obj === 'white' ? f : (obj === f ? obj : 'black');
    const c = choice(looks, ['red', 'green', 'blue', 'black', 'white'], 4);
    return {
      prompt: `A <b>${obj}</b> object is looked at through a <b>${f} filter</b>. What colour does it look?`,
      answer: ans(c),
      hint: 'A filter only lets its OWN colour through. If that colour is not coming off the object, you see black.',
      working: [
        '<b>Picture:</b> the filter is a gate that only opens for its own colour.',
        `1. What does a ${obj} object send back? ${obj === 'white' ? 'All the colours.' : `Only ${obj} light.`}`,
        `2. What does a ${f} filter let through? Only ${f} light.`,
        `3. ${obj === 'white' ? `So only ${f} gets through → it looks <b>${f}</b>.` : obj === f ? `The ${obj} light passes straight through → it looks <b>${obj}</b>.` : `There is no ${f} light coming off it, so nothing gets through → it looks <b>black</b>.`}`,
      ],
      finalAnswer: looks, skill: 'colour',
    };
  }
  function soundFact() {
    const q = R.pick([
      { p: 'What makes a sound?', a: 'Something vibrating', w: ['Something getting hot', 'Something glowing', 'Something falling'] },
      { p: 'What does sound need in order to travel?', a: 'A medium — a solid, liquid or gas', w: ['A vacuum', 'Light', 'Electricity'] },
      { p: 'Why is there no sound in space?', a: 'Space is a vacuum, so there are no particles to vibrate', w: ['Space is too cold', 'Sound is too slow', 'Space is too big'] },
      { p: 'What is the unit of frequency?', a: 'hertz (Hz)', w: ['decibels (dB)', 'joules (J)', 'newtons (N)'] },
      { p: 'What does the <b>frequency</b> of a sound wave control?', a: 'The pitch — how high or low it sounds', w: ['The loudness', 'The speed of the sound', 'The colour'] },
      { p: 'What does the <b>amplitude</b> of a sound wave control?', a: 'The loudness', w: ['The pitch', 'The speed', 'The direction'] },
      { p: 'What is an <b>echo</b>?', a: 'Sound reflected back off a hard surface', w: ['Sound bending round a corner', 'Sound being absorbed', 'Two sounds made at once'] },
      { p: 'Which travels faster?', a: 'Light — about a million times faster than sound', w: ['Sound — it reaches you first', 'They travel at the same speed', 'It depends on the weather'] },
      { p: 'Which part of your body turns vibrations into signals for your brain?', a: 'The ear drum and the inner ear', w: ['The eye', 'The nose', 'The skin'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Sound is a vibration passed on by particles. No particles = no sound.',
      working: ['<b>Picture:</b> a drum skin shaking, knocking the air particles into their neighbours all the way to your ear.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'sound',
    };
  }
  function vibrationQ() {
    const s = R.pick(SOUND_SOURCES);
    const c = choice(s.v, SOUND_SOURCES.filter((x) => x.v !== s.v).map((x) => x.v), 4);
    return {
      prompt: `What is actually vibrating to make the sound of <b>${s.s}</b>?`,
      answer: ans(c),
      hint: 'Every sound starts with something vibrating.',
      working: ['<b>Picture:</b> touch a speaker while music plays — you can feel it shaking.', `For ${s.s}, the sound comes from <b>${s.v}</b>.`, 'Those vibrations pass into the air and travel to your ear.'],
      finalAnswer: s.v, skill: 'sound',
    };
  }
  function mediumQ() {
    const m = R.pick(MEDIA);
    if (m.speed === 0) {
      const c = choice('No sound travels at all', ['340 m/s, the same as air', 'Faster than in any material', 'Only very quiet sounds travel'], 4);
      return {
        prompt: 'How fast does sound travel through <b>empty space (a vacuum)</b>?',
        answer: ans(c),
        hint: 'Sound is particles passing a vibration on. What if there are no particles?',
        working: ['<b>Picture:</b> a line of dominoes with no dominoes — nothing can be passed on.', '1. A vacuum has no particles.', '2. With nothing to vibrate, sound cannot travel.', 'So in space, <b>no sound travels at all</b>.'],
        finalAnswer: 'No sound travels at all', skill: 'sound',
      };
    }
    const c = choice(m.kind, ['solid', 'liquid', 'gas'], 3);
    return {
      prompt: `Sound travels through <b>${m.m}</b> at about ${m.speed} m/s. What state of matter is ${m.m}?`,
      answer: ans(c),
      hint: 'Sound goes fastest in solids (particles packed tight) and slowest in gases.',
      working: [
        '<b>Picture:</b> particles packed close together pass the vibration on faster.',
        `${cap(m.m)} is a <b>${m.kind}</b>.`,
        'Speed order: solids (fastest) → liquids → gases (slowest) → vacuum (no sound at all).',
      ],
      finalAnswer: m.kind, skill: 'sound',
    };
  }
  function waveCompare() {
    const loudA = R.chance(0.5), highA = R.chance(0.5);
    const a = { amp: loudA ? 30 : 13, freq: highA ? 4 : 2 };
    const b = { amp: loudA ? 13 : 30, freq: highA ? 2 : 4 };
    const askLoud = R.chance(0.5);
    const correct = askLoud ? (loudA ? 'A' : 'B') : (highA ? 'A' : 'B');
    const c = choice(correct, ['A', 'B'], 2);
    return {
      visual: wavesSvg(a, b),
      prompt: `Look at the two sound waves. Which one is <b>${askLoud ? 'louder' : 'higher in pitch'}</b>?`,
      answer: ans(c),
      hint: askLoud ? 'Louder = a TALLER wave (bigger amplitude).' : 'Higher pitch = MORE waves squeezed into the same space (higher frequency).',
      working: [
        '<b>Picture:</b> height of the wave = how loud; number of waves = how high the note.',
        askLoud ? `1. Amplitude (height) is bigger on <b>${loudA ? 'A' : 'B'}</b>.` : `1. There are more waves squeezed in on <b>${highA ? 'A' : 'B'}</b>.`,
        `So <b>${correct}</b> is ${askLoud ? 'louder' : 'higher in pitch'}.`,
      ],
      finalAnswer: correct, skill: 'waves',
    };
  }
  function waveChange() {
    const q = R.pick([
      { p: 'A singer sings the same note but much <b>louder</b>. What happens to the wave?', a: 'The amplitude gets bigger', w: ['The frequency gets bigger', 'The frequency gets smaller', 'Nothing changes'] },
      { p: 'A guitar string is tightened so it plays a <b>higher</b> note. What happens to the wave?', a: 'The frequency gets bigger', w: ['The amplitude gets bigger', 'The amplitude gets smaller', 'The wave stops'] },
      { p: 'You turn the volume <b>down</b> on a speaker. What happens to the wave?', a: 'The amplitude gets smaller', w: ['The frequency gets smaller', 'The frequency gets bigger', 'The wave gets faster'] },
      { p: 'A big drum makes a <b>low</b> note and a small drum a <b>high</b> note. What is different?', a: 'The frequency — the small drum vibrates faster', w: ['The amplitude — the small drum is louder', 'The speed of the sound', 'The colour of the sound'] },
      { p: 'A tall wave with only a few waves across the screen sounds how?', a: 'Loud and low', w: ['Loud and high', 'Quiet and low', 'Quiet and high'] },
      { p: 'A short wave with lots of waves across the screen sounds how?', a: 'Quiet and high', w: ['Loud and high', 'Quiet and low', 'Loud and low'] },
    ]);
    const c = choice(q.a, q.w, 4);
    return {
      prompt: q.p, answer: ans(c),
      hint: 'Amplitude (height) = loudness. Frequency (how many waves) = pitch.',
      working: ['<b>Picture:</b> taller wave = louder shout; squashed-up waves = squeaky high voice.', `Answer: <b>${q.a}</b>.`],
      finalAnswer: q.a, skill: 'waves',
    };
  }
  function echoCalc() {
    const t = R.pick([2, 4, 6]);
    const d = 340 * t / 2;
    return {
      prompt: `Harper shouts at a cliff and hears the echo <b>${t} seconds</b> later. Sound travels at <b>340 m/s</b>. How far away is the cliff?`,
      answer: { type: 'number', value: d, unit: 'm', placeholder: 'e.g. 340' },
      hint: 'The sound goes there AND back in that time, so the one-way distance is half of it.',
      working: [
        '<b>Rule:</b> distance = speed × time.',
        `Total there-and-back distance = 340 × ${t} = ${340 * t} m.`,
        `That is twice the distance to the cliff: ${340 * t} ÷ 2 = <b>${d} m</b>.`,
      ],
      finalAnswer: `${d} m`, skill: 'echo',
    };
  }
  function thunderCalc() {
    const t = R.int(2, 9);
    return {
      prompt: `Harper sees lightning and hears the thunder <b>${t} seconds</b> later. Sound travels at <b>340 m/s</b>. How far away was the strike?`,
      answer: { type: 'number', value: 340 * t, unit: 'm', placeholder: 'e.g. 1020' },
      hint: 'Light arrives almost instantly, so the whole delay is the sound travelling to you.',
      working: [
        '<b>Picture:</b> the flash arrives straight away; the bang is still on its way.',
        '<b>Rule:</b> distance = speed × time.',
        `340 × ${t} = <b>${340 * t} m</b> (about ${r1(340 * t / 1000)} km).`,
      ],
      finalAnswer: `${340 * t} m`, skill: 'echo',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const i = R.step(20, 70, 5);
      return {
        visual: mirrorSvg(i, { iLabel: i + '°', rLabel: '?' }),
        prompt: `In the lab Harper shines a ray box at a mirror. Her protractor says the angle of incidence is ${i}°. What will she measure for the angle of reflection?`,
        answer: { type: 'number', value: i, unit: '°', placeholder: 'e.g. 40' },
        hint: 'Law of reflection: angle in = angle out, both measured from the normal.',
        working: ['<b>Rule:</b> angle of incidence = angle of reflection.', `Angle in = ${i}°, so angle out = <b>${i}°</b>.`, 'If she gets a couple of degrees out, that is measuring error — repeat and check.'],
        finalAnswer: `${i}°`,
      };
    },
    () => {
      const c = choice('Light from the bottom bends as it leaves the water', ['The water pushes the straw sideways', 'The straw softens in water', 'The glass magnifies the straw'], 4);
      return {
        visual: refractionSvg(),
        prompt: 'Harper puts a straw in a glass of water and it looks broken at the surface. Is the straw really bent?',
        answer: ans(c),
        hint: 'The straw is fine — it is the light that changes direction.',
        working: [
          '<b>Picture:</b> the light from the bottom of the straw takes a bent path to your eye.',
          '1. Light slows down in water, so it changes direction as it leaves — <b>refraction</b>.',
          '2. Your brain assumes light travelled straight, so it draws the straw in the wrong place.',
          'The straw is perfectly straight; the light bent.',
        ],
        finalAnswer: 'No — the light bends (refracts) as it leaves the water',
      };
    },
    () => {
      const c = choice('The shadow gets bigger', ['The shadow gets smaller', 'The shadow stays the same', 'The shadow disappears'], 4);
      return {
        visual: shadowSvg(130),
        prompt: 'Harper makes a hand shadow on the wall, then moves her hand towards the torch. What happens to the shadow?',
        answer: ans(c),
        hint: 'The rays leaving the torch keep spreading out. The earlier they are blocked, the wider the gap they leave.',
        working: [
          '<b>Picture:</b> light spreads out from the torch like a fan.',
          '1. Light travels in straight lines.',
          '2. Blocking the fan closer to the torch blocks a wider part of the wall.',
          'So the shadow <b>gets bigger</b>.',
        ],
        finalAnswer: 'It gets bigger',
      };
    },
    () => {
      const obj = R.pick(['red', 'green', 'blue']), f = R.pick(FILTERS.filter((x) => x !== obj));
      return {
        prompt: `In the dark room Harper looks at a ${obj} book through a ${f} filter. What colour does the book look, and why?`,
        answer: (() => { const c = choice('Black — no light gets through to her eye', [`${cap(obj)} — the colour never changes`, `${cap(f)} — the filter colours it in`, 'White — all colours get through'], 4); return { type: 'choice', value: c.value, choices: c.choices }; })(),
        hint: 'What colour is coming off the book, and what colour does the filter let through?',
        working: [
          '<b>Picture:</b> the filter is a gate that only opens for its own colour.',
          `1. The ${obj} book reflects only <b>${obj}</b> light.`,
          `2. The ${f} filter only lets <b>${f}</b> light through.`,
          `3. There is no ${f} light arriving, so nothing gets through → it looks <b>black</b>.`,
        ],
        finalAnswer: 'Black',
      };
    },
    () => {
      const c = choice('The bell keeps ringing but you hear nothing', ['It gets louder', 'It stays exactly the same', 'The bell stops moving'], 4);
      return {
        prompt: 'A ringing bell is put inside a glass jar and all the air is pumped out. What happens?',
        answer: ans(c),
        hint: 'Sound needs particles to pass the vibration along.',
        working: [
          '<b>Picture:</b> a line of dominoes — take the dominoes away and nothing gets passed on.',
          '1. The bell is still vibrating (you can see it).',
          '2. With no air, there are no particles to carry the vibration to the jar.',
          'So you <b>see</b> it ringing but hear nothing. That is why space is silent.',
        ],
        finalAnswer: 'You see it ringing but hear nothing',
      };
    },
    () => {
      const t = R.int(2, 9);
      return {
        prompt: `During a storm over Lake Taupō, Harper counts ${t} seconds between the lightning and the thunder. Sound travels 340 m/s. How far away is the storm?`,
        answer: { type: 'number', value: 340 * t, unit: 'm', placeholder: 'e.g. 1020' },
        hint: 'Light gets to you almost instantly, so the whole gap is the sound travelling.',
        working: [
          '<b>Picture:</b> the flash is instant; the bang is still crossing the lake.',
          '<b>Rule:</b> distance = speed × time.',
          `340 × ${t} = <b>${340 * t} m</b>, about ${r1(340 * t / 1000)} km away.`,
          'Light is about a million times faster than sound, so we ignore its travel time.',
        ],
        finalAnswer: `${340 * t} m`,
      };
    },
    () => {
      const t = R.pick([2, 4, 6]);
      return {
        prompt: `Standing in Milford Sound, Harper shouts and hears the echo after ${t} s. Sound travels 340 m/s. How far away is the rock wall?`,
        answer: { type: 'number', value: 340 * t / 2, unit: 'm', placeholder: 'e.g. 340' },
        hint: 'The sound has to go there and come back in that time.',
        working: [
          '<b>Picture:</b> the shout is a runner doing a there-and-back leg.',
          `Total distance = 340 × ${t} = ${340 * t} m.`,
          `Half of that is the one-way distance: ${340 * t} ÷ 2 = <b>${340 * t / 2} m</b>.`,
        ],
        finalAnswer: `${340 * t / 2} m`,
      };
    },
    () => {
      const loudA = R.chance(0.5);
      const a = { amp: loudA ? 30 : 13, freq: 3 }, b = { amp: loudA ? 13 : 30, freq: 3 };
      const c = choice(loudA ? 'A' : 'B', ['A', 'B'], 2);
      return {
        visual: wavesSvg(a, b),
        prompt: 'Harper records the same note played twice on the oscilloscope. Which trace was the louder one?',
        answer: ans(c),
        hint: 'Same note = same number of waves. Louder = taller wave.',
        working: [
          '<b>Picture:</b> shouting the same word makes a taller wave, not more waves.',
          '1. Both traces have the same number of waves → same pitch.',
          `2. The taller one (bigger amplitude) is <b>${loudA ? 'A' : 'B'}</b>.`,
        ],
        finalAnswer: loudA ? 'A' : 'B',
      };
    },
    () => {
      const c = choice('Sound travels much faster in the steel rail than in the air', ['Sound only travels in metal', 'The rail makes the sound louder', 'Air stops sound completely'], 4);
      return {
        prompt: 'If you put your ear to a steel railway line you hear the train before you hear it through the air. Why?',
        answer: ans(c),
        hint: 'Which has its particles packed closest together — steel or air?',
        working: [
          '<b>Picture:</b> dominoes standing close together fall faster than ones spread far apart.',
          '1. In steel the particles are packed tight, so the vibration is passed on quickly (about 5000 m/s).',
          '2. In air the particles are far apart (about 340 m/s).',
          'So the sound through the rail arrives first.',
        ],
        finalAnswer: 'Sound travels faster through solids than through air',
      };
    },
    () => {
      const c = choice('Because the soft, uneven surfaces absorb the sound instead of reflecting it', ['Because carpet makes sound faster', 'Because sound cannot travel in a small room', 'Because curtains are transparent'], 4);
      return {
        prompt: 'A school hall echoes badly, but a carpeted classroom with curtains does not. Why?',
        answer: ans(c),
        hint: 'An echo is sound bouncing back off a hard surface.',
        working: [
          '<b>Picture:</b> a ball bounces off concrete but dies on a cushion.',
          '1. An echo is <b>reflected</b> sound — hard, flat walls reflect it well.',
          '2. Carpet and curtains are soft and uneven, so they <b>absorb</b> the sound.',
          'Less reflection means less echo.',
        ],
        finalAnswer: 'Soft surfaces absorb sound instead of reflecting it',
      };
    },
    () => {
      const c = choice('Light travels far faster than sound', ['Sound starts later than the flash', 'The starter is slow', 'Sound bends round the track'], 4);
      return {
        prompt: 'At athletics day, timekeepers at the far end see the starting gun\'s smoke before they hear the bang. Why?',
        answer: ans(c),
        hint: 'Compare 300 million m/s with 340 m/s.',
        working: [
          '<b>Picture:</b> lightning first, thunder after.',
          '1. Light travels about 300 000 000 m/s.',
          '2. Sound travels about 340 m/s in air.',
          'Light wins easily, so timekeepers start on the smoke, not the bang.',
        ],
        finalAnswer: 'Light travels far faster than sound',
      };
    },
  ];

  HL.registerTopic({
    id: 'light-sound', subject: 'science', strand: 'physical', order: 5,
    name: 'Light & sound', short: 'Light & sound', animal: 'owl',
    blurb: 'Rays, mirrors, shadows and colour — then vibrations, pitch, loudness and echoes.',
    example: 'angle in = angle out · thunder 3 s later ≈ 1 km away',
    learn: {
      what: '<p><b>Light</b> travels in perfectly <b>straight lines</b>, very fast (about 300 000 000 m/s). When it hits a mirror it <b>reflects</b>, and the <b>angle of incidence equals the angle of reflection</b> — both measured from the <b>normal</b>, the dashed line at 90° to the mirror. When light passes into water or glass it slows down and <b>refracts</b> (bends), which is why a straw looks broken. Shadows happen because light cannot bend round an opaque object.</p><p><b>Sound</b> is made by something <b>vibrating</b>, and it needs a <b>medium</b> (solid, liquid or gas) to travel through — so there is no sound in space. A <b>taller</b> wave is louder (amplitude); waves <b>squeezed closer together</b> are higher in pitch (frequency, in hertz).</p><p><b>Picture for this topic:</b> a <b>thunderstorm over Lake Taupō</b>. The flash arrives instantly, the bang takes about 3 seconds per kilometre — light is roughly a million times faster than sound.</p>',
      visual: `<svg viewBox="0 0 350 214" width="350" height="214" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="11" font-weight="700">
        <text x="88" y="16" text-anchor="middle" fill="#4A4033" font-size="11.5">LIGHT — reflection</text>
        <line x1="14" y1="110" x2="162" y2="110" stroke="#5F98C4" stroke-width="4"/>
        ${[22, 40, 58, 76, 94, 112, 130, 148].map((x) => `<line x1="${x}" y1="113" x2="${x - 8}" y2="122" stroke="#9BB8CE" stroke-width="2"/>`).join('')}
        <line x1="88" y1="110" x2="88" y2="30" stroke="#8E79C6" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="92" y="38" fill="#6B57A3" font-size="10">normal</text>
        ${arrow(28, 46, 84, 106, '#E8C24A', 3.5)}${arrow(92, 106, 148, 46, '#E0568C', 3.5)}
        <text x="44" y="76" fill="#9A6A0F" font-size="11">40°</text>
        <text x="118" y="76" fill="#C33C72" font-size="11">40°</text>
        <text x="88" y="140" text-anchor="middle" fill="#4A4033" font-size="10">measured from the normal</text>
        <line x1="174" y1="8" x2="174" y2="150" stroke="#D9CFBE" stroke-width="2"/>
        <text x="262" y="16" text-anchor="middle" fill="#4A4033" font-size="11.5">SOUND — pitch &amp; loudness</text>
        <line x1="190" y1="50" x2="336" y2="50" stroke="#D9CFBE" stroke-width="1.5"/>
        <polyline points="${(() => { let p = []; for (let x = 0; x <= 140; x += 4) p.push(`${190 + x},${r1(50 - 20 * Math.sin(2 * Math.PI * 2 * x / 140))}`); return p.join(' '); })()}" fill="none" stroke="#E0568C" stroke-width="2.5"/>
        <text x="262" y="86" text-anchor="middle" fill="#C33C72" font-size="10">tall wave = LOUD</text>
        <line x1="190" y1="120" x2="336" y2="120" stroke="#D9CFBE" stroke-width="1.5"/>
        <polyline points="${(() => { let p = []; for (let x = 0; x <= 140; x += 3) p.push(`${190 + x},${r1(120 - 10 * Math.sin(2 * Math.PI * 5 * x / 140))}`); return p.join(' '); })()}" fill="none" stroke="#5F98C4" stroke-width="2.5"/>
        <text x="262" y="146" text-anchor="middle" fill="#3C6E96" font-size="10">more waves = HIGH pitch</text>
        <rect x="8" y="158" width="334" height="48" rx="10" fill="#F3EFE6" stroke="#D9CFBE" stroke-width="2"/>
        <text x="175" y="178" text-anchor="middle" fill="#4A4033" font-size="11.5">light ≈ 300 000 000 m/s &#183; sound ≈ 340 m/s in air</text>
        <text x="175" y="196" text-anchor="middle" fill="#C33C72" font-size="11">that is why you SEE lightning before you HEAR thunder</text>
      </svg>`,
      facts: [
        'Light travels in <b>straight lines</b> — that is why we get sharp <b>shadows</b>.',
        '<b>Law of reflection: angle of incidence = angle of reflection</b>, both measured from the <b>normal</b> (90° to the mirror).',
        '<b>Refraction</b>: light slows down entering water or glass, so the ray bends. That is the "bent straw".',
        'Colour: an object <b>reflects</b> its own colour and <b>absorbs</b> the rest. A filter only lets <b>its own colour</b> through.',
        'Sound is made by <b>vibrations</b> and needs a <b>medium</b> — no particles, no sound (space is silent).',
        '<b>Amplitude</b> (wave height) = loudness. <b>Frequency</b> (waves per second, in <b>Hz</b>) = pitch.',
        'Sound in air ≈ <b>340 m/s</b>; light ≈ <b>300 000 000 m/s</b>. An <b>echo</b> is reflected sound.',
      ],
      steps: [
        'Draw rays as <b>straight lines with an arrow</b> on them. Never curve them.',
        'For a mirror, draw the <b>normal</b> first (dashed, 90° to the mirror), then measure both angles <b>from the normal</b>. Angle in = angle out.',
        'For colour, ask two questions: "<b>what colour does the object send back?</b>" and "<b>what colour does the filter let through?</b>" If they do not match, it looks <b>black</b>.',
        'For sound, ask "<b>what is vibrating?</b>" and "<b>what is it travelling through?</b>". No medium → no sound.',
        'For a wave picture: <b>taller = louder</b>, <b>more waves squeezed in = higher pitch</b>.',
        'For thunder and echoes use <b>distance = speed × time</b> with 340 m/s — and halve it for an echo, because the sound goes there and back.',
      ],
      examples: [
        {
          q: 'A ray hits a mirror at an angle of incidence of 35°. What is the angle of reflection?',
          visual: mirrorSvg(35, { iLabel: '35°', rLabel: 'r = ?' }),
          working: ['<b>Picture:</b> a ball bouncing off a wall — it leaves at the same angle it arrived.', '1. Where do I measure from? The <b>normal</b> (the dashed line).', '2. Law of reflection: angle in = angle out.', '3. In was 35°, so out is 35°.'],
          a: '35°',
        },
        {
          q: 'Why does a straw in a glass of water look broken?',
          visual: refractionSvg(),
          working: [
            '<b>Picture:</b> the light from the straw takes a bent path to your eye.',
            '1. Light slows down when it goes from water into air.',
            '2. Hitting the surface at an angle makes the ray change direction — <b>refraction</b>.',
            '3. Your brain assumes light came in a straight line, so it puts the bottom of the straw in the wrong place.',
          ],
          a: 'The light refracts leaving the water — the straw is really straight',
        },
        {
          q: 'Harper moves her hand closer to the torch. What happens to the shadow on the wall?',
          visual: shadowSvg(130),
          working: ['<b>Picture:</b> light spreads out from the torch like a fan.', '1. Light goes in straight lines.', '2. Closer to the torch, her hand blocks a wider part of the fan.', '3. So more of the wall is left dark.'],
          a: 'The shadow gets bigger',
        },
        {
          q: 'A red tomato is looked at through a blue filter. What colour does it look?',
          working: [
            '<b>Picture:</b> the filter is a gate that only opens for its own colour.',
            '1. What does the tomato send back? Only <b>red</b> light.',
            '2. What does a blue filter let through? Only <b>blue</b> light.',
            '3. No blue light is arriving, so nothing gets through.',
          ],
          a: 'It looks black',
        },
        {
          q: 'Which of these two waves is louder, and which is higher in pitch?',
          visual: wavesSvg({ amp: 30, freq: 2 }, { amp: 13, freq: 5 }),
          working: [
            '<b>Picture:</b> wave height = shouting; number of waves = squeaky voice.',
            '1. Amplitude: A is much taller → <b>A is louder</b>.',
            '2. Frequency: B has more waves squeezed into the same space → <b>B is higher in pitch</b>.',
          ],
          a: 'A is louder; B is higher in pitch',
        },
        {
          q: 'A ringing bell is put in a jar and the air is pumped out. What do you see and hear?',
          working: [
            '<b>Picture:</b> a line of dominoes with the dominoes removed.',
            '1. Is the bell still vibrating? Yes — you can see the hammer moving.',
            '2. Is there anything to carry the vibration? No, a vacuum has no particles.',
            '3. Light does not need a medium, so you still see it.',
          ],
          a: 'You see it ringing but hear nothing — sound needs a medium',
        },
        {
          q: 'Harper shouts across a valley and hears the echo 4 seconds later. Sound travels at 340 m/s. How far away is the cliff?',
          working: [
            '<b>Picture:</b> the shout is a runner doing a there-and-back leg.',
            '<b>Rule:</b> distance = speed × time.',
            '1. Total distance = 340 × 4 = 1360 m.',
            '2. That is there AND back, so halve it: 1360 ÷ 2 = 680 m.',
          ],
          a: '680 m away',
        },
      ],
      tips: [
        'Always measure reflection angles from the <b>normal</b>, never from the mirror surface. That is the most common mistake.',
        'A filter does not <b>paint</b> things its colour — it only lets its own colour through. No matching light = black.',
        'Sound needs particles; light does not. That is why space is silent but not dark.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [lightFact, opacityQ, reflectAngle, reflectionFact, soundFact, vibrationQ, waveCompare]
        : level === 2
          ? [lightFact, opacityQ, reflectAngle, reflectionFact, refractionQ, shadowQ, colourQ, soundFact, vibrationQ, mediumQ, waveCompare, waveChange]
          : [reflectAngle, reflectionFact, refractionQ, shadowQ, colourQ, filterQ, mediumQ, waveCompare, waveChange, echoCalc, thunderCalc, soundFact];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
