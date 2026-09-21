/* Topic: Earth, Sun & Moon — day and night, seasons, Moon phases, eclipses, tides. */
(function (HL) {
  const R = HL.rng;

  /* ---------- item pools ---------- */
  const PHASES = [
    { k: 0, name: 'new moon', short: 'new moon', desc: 'we cannot see it at all — the lit side faces away from us' },
    { k: 1, name: 'waxing crescent', short: 'waxing crescent', desc: 'a thin sliver, growing' },
    { k: 2, name: 'first quarter', short: 'first quarter', desc: 'exactly half lit, growing' },
    { k: 3, name: 'waxing gibbous', short: 'waxing gibbous', desc: 'more than half, growing' },
    { k: 4, name: 'full moon', short: 'full moon', desc: 'the whole face is lit' },
    { k: 5, name: 'waning gibbous', short: 'waning gibbous', desc: 'more than half, shrinking' },
    { k: 6, name: 'last quarter', short: 'last quarter', desc: 'exactly half lit, shrinking' },
    { k: 7, name: 'waning crescent', short: 'waning crescent', desc: 'a thin sliver, shrinking' },
  ];

  const NZ_SEASON = [
    { month: 'December', nz: 'summer', north: 'winter' },
    { month: 'January', nz: 'summer', north: 'winter' },
    { month: 'February', nz: 'summer', north: 'winter' },
    { month: 'March', nz: 'autumn', north: 'spring' },
    { month: 'April', nz: 'autumn', north: 'spring' },
    { month: 'May', nz: 'autumn', north: 'spring' },
    { month: 'June', nz: 'winter', north: 'summer' },
    { month: 'July', nz: 'winter', north: 'summer' },
    { month: 'August', nz: 'winter', north: 'summer' },
    { month: 'September', nz: 'spring', north: 'autumn' },
    { month: 'October', nz: 'spring', north: 'autumn' },
    { month: 'November', nz: 'spring', north: 'autumn' },
  ];

  const VOCAB = [
    { q: 'What do we call one full spin of the Earth on its axis?', a: 'a day', accept: ['day', 'one day', '24 hours'] },
    { q: 'What do we call one full orbit of the Earth around the Sun?', a: 'a year', accept: ['year', 'one year', 'a year'] },
    { q: 'What is the imaginary line the Earth spins around called?', a: 'axis', accept: ['the axis', 'its axis', 'earths axis'] },
    { q: 'What do we call the shape of the lit part of the Moon that we can see?', a: 'phase', accept: ['a phase', 'phases', 'the phase', 'moon phase'] },
    { q: 'What word means the Moon is getting bigger each night?', a: 'waxing', accept: ['waxing moon', 'it is waxing'] },
    { q: 'What word means the Moon is getting smaller each night?', a: 'waning', accept: ['waning moon', 'it is waning'] },
    { q: 'What pulls the oceans and causes the tides?', a: 'the moon', accept: ['moon', 'the moons gravity', 'moons gravity', 'gravity of the moon', 'the moon&rsquo;s gravity'] },
  ];

  /** shuffled multi-choice, value = index of the correct option */
  function choice(correct, wrongs, n = 4) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min(n - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { choices: shuffled, value: shuffled.indexOf(correct) };
  }

  /* ---------- diagrams ---------- */
  /* Moon drawn as seen from Aotearoa: a WAXING moon is lit on the LEFT.
   * Built as a union of a half-circle and an ellipse inside a clip, so the shape is always right. */
  let moonUid = 0;
  function moonShape(cx, cy, r, k) {
    const LIT = '#F7E9B0', DARK = '#3E3A33';
    const ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#4A4033" stroke-width="1.5"/>`;
    if (k === 0) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${DARK}"/>` + ring;
    if (k === 4) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${LIT}"/>` + ring;
    const rx = Math.round(Math.abs(Math.cos((k * Math.PI) / 4)) * r * 10) / 10;
    const litLeft = k < 4;                       // waxing = lit on the left (NZ view)
    const gibbous = k === 3 || k === 5;
    // gibbous: start dark, paint the lit half + the ellipse. crescent: start lit, paint the dark half + the ellipse.
    const base = gibbous ? DARK : LIT;
    const over = gibbous ? LIT : DARK;
    const overOnLeft = gibbous ? litLeft : !litLeft;
    const id = 'mn' + (++moonUid);
    return `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`
      + `<g clip-path="url(#${id})">`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${base}"/>`
      + `<rect x="${overOnLeft ? cx - r - 1 : cx}" y="${cy - r - 1}" width="${r + 1}" height="${2 * r + 2}" fill="${over}"/>`
      + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${r}" fill="${over}"/>`
      + `</g>` + ring;
  }

  function phasesGridSvg(opts) {
    opts = opts || {};
    const hide = opts.hide;      // index to replace with "?"
    const xs = [46, 130, 214, 298];
    const two = (name) => { const w = name.split(' '); return [w[0], w.slice(1).join(' ')]; };
    let s = `<svg viewBox="0 0 344 204" width="344" height="204" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700"><rect width="344" height="204" fill="#FFFFFF"/>`;
    PHASES.forEach((p, i) => {
      const cx = xs[i % 4], cy = i < 4 ? 38 : 122;
      const [l1, l2] = two(p.short);
      if (hide === i) {
        s += `<circle cx="${cx}" cy="${cy}" r="20" fill="#FFFFFF" stroke="#E0568C" stroke-width="3" stroke-dasharray="5 4"/>`;
        s += `<text x="${cx}" y="${cy + 7}" text-anchor="middle" fill="#E0568C" font-size="20">?</text>`;
        s += `<text x="${cx}" y="${cy + 36}" text-anchor="middle" fill="#E0568C" font-size="12">${i + 1}. ?</text>`;
      } else {
        s += moonShape(cx, cy, 20, p.k);
        s += `<text x="${cx}" y="${cy + 36}" text-anchor="middle" fill="#4A4033" font-size="12">${i + 1}. ${l1}</text>`;
        s += `<text x="${cx}" y="${cy + 50}" text-anchor="middle" fill="#4A4033" font-size="12">${l2}</text>`;
      }
    });
    s += `<text x="172" y="196" text-anchor="middle" fill="#8A7B63" font-size="11.5">&#8776; 29&#189; days, then it starts again</text>`;
    return s + '</svg>';
  }

  function bigPhaseSvg(k) {
    return `<svg viewBox="0 0 260 176" width="260" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="260" height="176" fill="#2B3A4A"/>
      ${moonShape(130, 78, 56, k)}
      <text x="130" y="160" text-anchor="middle" fill="#FFFFFF" font-size="12">what phase is this? (from Aotearoa)</text>
    </svg>`;
  }

  function tiltSvg() {
    const earth = (cx, label, sub, warm) => `
      <circle cx="${cx}" cy="94" r="24" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
      <line x1="${cx - 10}" y1="118" x2="${cx + 10}" y2="70" stroke="#4A4033" stroke-width="2.5"/>
      <text x="${cx + 13}" y="68" fill="#4A4033" font-size="11">N</text>
      <text x="${cx - 22}" y="128" fill="#4A4033" font-size="11">S</text>
      <text x="${cx}" y="150" text-anchor="middle" fill="#4A4033" font-size="12">${label}</text>
      <text x="${cx}" y="166" text-anchor="middle" fill="${warm ? '#E0568C' : '#5F98C4'}" font-size="12">${sub}</text>`;
    return `<svg viewBox="0 0 356 194" width="356" height="194" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="356" height="194" fill="#FFFFFF"/>
      <ellipse cx="178" cy="94" rx="136" ry="52" fill="none" stroke="#E7DCC8" stroke-width="2" stroke-dasharray="6 5"/>
      <circle cx="178" cy="94" r="26" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="178" y="98" text-anchor="middle" fill="#4A4033" font-size="12">Sun</text>
      ${earth(52, 'June', 'NZ winter', false)}
      ${earth(304, 'December', 'NZ summer', true)}
      <text x="178" y="26" text-anchor="middle" fill="#8A7B63" font-size="11.5">the axis always leans the same way (23.5°)</text>
      <text x="178" y="188" text-anchor="middle" fill="#8A7B63" font-size="11.5">the half leaning towards the Sun gets summer</text>
    </svg>`;
  }

  function dayNightSvg() {
    return `<svg viewBox="0 0 320 180" width="320" height="180" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="320" height="180" fill="#FFFFFF"/>
      <circle cx="34" cy="82" r="26" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="34" y="126" text-anchor="middle" fill="#4A4033" font-size="12">Sun</text>
      ${[0, 1, 2].map((i) => `<line x1="62" y1="${58 + i * 24}" x2="152" y2="${58 + i * 24}" stroke="#E8C24A" stroke-width="3"/>`).join('')}
      <path d="M 214 22 A 60 60 0 0 0 214 142 Z" fill="#F7E9B0" stroke="#4A4033" stroke-width="2"/>
      <path d="M 214 22 A 60 60 0 0 1 214 142 Z" fill="#3E3A33" stroke="#4A4033" stroke-width="2"/>
      <text x="186" y="86" text-anchor="middle" fill="#4A4033" font-size="12">day</text>
      <text x="244" y="86" text-anchor="middle" fill="#FFFFFF" font-size="12">night</text>
      <path d="M 246 20 A 44 20 0 0 1 288 42" fill="none" stroke="#E0568C" stroke-width="2.5"/>
      <polygon points="290,46 280,38 288,34" fill="#E0568C"/>
      <text x="240" y="164" text-anchor="middle" fill="#E0568C" font-size="12">one full spin = 24 hours</text>
    </svg>`;
  }

  function eclipseSvg(kind) {
    const solar = kind === 'solar';
    return `<svg viewBox="0 0 344 168" width="344" height="168" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="344" height="168" fill="#FFFFFF"/>
      <circle cx="34" cy="74" r="26" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="34" y="122" text-anchor="middle" fill="#4A4033">Sun</text>
      ${solar
        ? `<circle cx="176" cy="74" r="11" fill="#B7B0A4" stroke="#4A4033" stroke-width="1.5"/>
           <text x="176" y="112" text-anchor="middle" fill="#4A4033">Moon</text>
           <circle cx="292" cy="74" r="30" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
           <text x="292" y="128" text-anchor="middle" fill="#4A4033">Earth</text>
           <polygon points="187,64 187,84 264,80 264,68" fill="#4A4033" opacity=".35"/>`
        : `<circle cx="176" cy="74" r="30" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
           <text x="176" y="122" text-anchor="middle" fill="#4A4033">Earth</text>
           <circle cx="300" cy="74" r="11" fill="#3E3A33" stroke="#4A4033" stroke-width="1.5"/>
           <text x="300" y="112" text-anchor="middle" fill="#4A4033">Moon</text>
           <polygon points="206,50 206,98 290,86 290,62" fill="#4A4033" opacity=".35"/>`}
      <text x="180" y="156" text-anchor="middle" fill="#E0568C" font-size="12">${solar ? 'Moon blocks the Sun → solar eclipse' : 'Earth&rsquo;s shadow falls on the Moon → lunar eclipse'}</text>
    </svg>`;
  }

  function tidesSvg() {
    return `<svg viewBox="0 0 330 176" width="330" height="176" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="330" height="176" fill="#FFFFFF"/>
      <ellipse cx="128" cy="80" rx="76" ry="50" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
      <circle cx="128" cy="80" r="44" fill="#8FC96E" stroke="#6FA04C" stroke-width="2"/>
      <text x="128" y="84" text-anchor="middle" fill="#4A4033">Earth</text>
      <circle cx="292" cy="80" r="16" fill="#B7B0A4" stroke="#4A4033" stroke-width="1.5"/>
      <text x="292" y="118" text-anchor="middle" fill="#4A4033">Moon</text>
      <line x1="210" y1="80" x2="268" y2="80" stroke="#E0568C" stroke-width="2.5"/>
      <polygon points="204,80 214,75 214,85" fill="#E0568C"/>
      <text x="238" y="68" text-anchor="middle" fill="#E0568C" font-size="11">pull</text>
      <text x="54" y="38" text-anchor="middle" fill="#5F98C4" font-size="11.5">high tide</text>
      <text x="200" y="38" text-anchor="middle" fill="#5F98C4" font-size="11.5">high tide</text>
      <text x="165" y="152" text-anchor="middle" fill="#4A4033" font-size="11.5">water bulges on BOTH sides → 2 high tides a day</text>
    </svg>`;
  }

  function conceptSvg() {
    return `<svg viewBox="0 0 350 200" width="350" height="200" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="12" font-weight="700">
      <rect width="350" height="200" fill="#FFFFFF"/>
      <ellipse cx="120" cy="100" rx="104" ry="66" fill="none" stroke="#E7DCC8" stroke-width="2" stroke-dasharray="6 5"/>
      <circle cx="120" cy="100" r="30" fill="#E8C24A" stroke="#C98A1C" stroke-width="2"/>
      <text x="120" y="104" text-anchor="middle" fill="#4A4033">Sun</text>
      <circle cx="224" cy="100" r="22" fill="#A9D8F5" stroke="#5F98C4" stroke-width="2"/>
      <text x="224" y="104" text-anchor="middle" fill="#4A4033" font-size="11">Earth</text>
      <path d="M 236 78 A 30 26 0 0 1 250 92" fill="none" stroke="#E0568C" stroke-width="2.5"/>
      <polygon points="252,96 242,90 250,86" fill="#E0568C"/>
      <text x="286" y="42" text-anchor="middle" fill="#E0568C" font-size="11.5">spin = 1 day</text>
      <ellipse cx="224" cy="100" rx="52" ry="40" fill="none" stroke="#B9A5E6" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="276" cy="100" r="9" fill="#B7B0A4" stroke="#4A4033" stroke-width="1.5"/>
      <text x="300" y="122" text-anchor="middle" fill="#8A6FD0" font-size="11.5">Moon</text>
      <text x="300" y="138" text-anchor="middle" fill="#8A6FD0" font-size="11">≈ 1 month</text>
      <text x="175" y="188" text-anchor="middle" fill="#6FA04C" font-size="12">Earth&rsquo;s orbit round the Sun = 1 year</text>
    </svg>`;
  }

  /* ---------- question makers ---------- */
  function dayNightQ(level) {
    const items = [
      { q: 'What causes day and night?', a: 'The Earth spins on its axis', wrongs: ['The Sun goes round the Earth', 'The Earth orbits the Sun', 'Clouds cover the Sun at night'],
        w: ['<b>Picture:</b> standing on a spinning roundabout with one torch beside it.', '1. Does the torch move? No.', '2. You spin, so you face it, then away from it.', 'The <b>Earth spins</b> — the half facing the Sun has day, the other half has night.'] },
      { q: 'How long does one full spin of the Earth take?', a: '24 hours', wrongs: ['12 hours', '365 days', '29½ days'], w: ['One spin = one day = <b>24 hours</b>.'] },
      { q: 'The Sun appears to move across the sky during the day. What is really moving?', a: 'The Earth, spinning', wrongs: ['The Sun, orbiting Earth', 'The Moon, pushing the Sun', 'Nothing — it is an optical illusion in the clouds'],
        w: ['<b>Picture:</b> spinning on a chair — the room seems to slide past you.', '1. Is the Sun moving round us? No.', 'It is <b>Earth spinning</b> that makes the Sun seem to travel across the sky.'] },
      { q: 'Which way does the Sun appear to rise?', a: 'In the east', wrongs: ['In the west', 'In the north', 'It rises in a different place every day'],
        w: ['Earth spins from west to east.', 'So the Sun seems to come up in the <b>east</b> and set in the west.'] },
      { q: 'It is the middle of the night in Auckland. What is happening on the opposite side of the Earth?', a: 'It is the middle of the day', wrongs: ['It is also night', 'It is sunrise', 'It is winter there'],
        w: ['<b>Picture:</b> half of a ball lit by a torch, half in shadow.', '1. Auckland is on the dark half.', 'The opposite side is on the lit half, so it is <b>the middle of the day</b>.'] },
      { q: 'Which causes DAY AND NIGHT — the spin or the orbit?', a: 'The spin (once every 24 hours)', wrongs: ['The orbit (once every year)', 'The Moon&rsquo;s orbit', 'The tilt of the axis'],
        w: ['<b>Spin</b> = day and night. <b>Orbit</b> = the year. <b>Tilt</b> = the seasons.', 'Day and night come from the <b>spin</b>.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: R.chance(0.5) ? dayNightSvg() : undefined,
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Spin = day. Orbit = year. Tilt = seasons.',
      working: it.w, finalAnswer: it.a, skill: 'day-night',
    };
  }

  function yearTiltQ(level) {
    const items = [
      { q: 'What causes the seasons?', a: 'The Earth&rsquo;s axis is tilted, so each half leans towards the Sun for part of the year', wrongs: ['The Earth gets closer to the Sun in summer', 'The Sun gets hotter in summer', 'Clouds block the Sun in winter'],
        w: ['<b>Picture:</b> a torch shining on a tilted ball.', '1. Does Earth&rsquo;s distance change much? Barely — the orbit is almost a circle.', '2. What does change? Which half <b>leans towards</b> the Sun.', 'The half leaning towards the Sun gets more direct light → <b>summer</b>.'] },
      { q: 'How long does the Earth take to orbit the Sun once?', a: 'About 365¼ days (1 year)', wrongs: ['24 hours', '29½ days', '12 hours'], w: ['One orbit = one <b>year</b> ≈ 365¼ days.', 'The spare ¼ day is why we add 29 February every 4 years.'] },
      { q: 'By how much is the Earth&rsquo;s axis tilted?', a: 'About 23.5°', wrongs: ['0° — it is straight up', 'About 45°', 'About 90° — it lies on its side'], w: ['The axis leans about <b>23.5°</b> and always points the same way in space.'] },
      { q: 'Why is it summer in Aotearoa in December but winter in Britain?', a: 'The southern half of Earth leans towards the Sun in December', wrongs: ['New Zealand is closer to the Sun than Britain', 'Britain is on the dark side of the Earth', 'The Sun shines only on the south in December'],
        w: ['<b>Picture:</b> a tilted ball going round a torch.', '1. In December, which half leans towards the Sun? The <b>southern</b> half.', '2. NZ is in the southern half → summer. Britain is in the north → winter.'] },
      { q: 'If the Earth had NO tilt at all, what would happen?', a: 'There would be almost no seasons', wrongs: ['There would be no day or night', 'It would always be winter', 'The year would get longer'],
        w: ['<b>Picture:</b> a ball standing straight up going round a torch.', '1. Would either half ever lean towards the Sun? No.', 'So every place would get roughly the same light all year — <b>no real seasons</b>.'] },
      { q: 'Which is longer — a day or a year?', a: 'A year (one orbit ≈ 365 spins)', wrongs: ['A day', 'They are the same', 'It depends on the season'], w: ['One spin = a day. One orbit = a year.', 'Earth spins about <b>365 times</b> during one orbit.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: /seasons|December|tilt/.test(it.q) ? tiltSvg() : undefined,
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'The tilt is what makes seasons — not how close we are to the Sun.',
      working: it.w, finalAnswer: it.a, skill: 'seasons',
    };
  }

  function seasonMonthQ(level) {
    const m = R.pick(NZ_SEASON);
    const here = level === 1 ? true : R.chance(0.5);
    const ans = here ? m.nz : m.north;
    const c = choice(ans, ['summer', 'autumn', 'winter', 'spring'], 4);
    return {
      visual: R.chance(0.4) ? tiltSvg() : undefined,
      prompt: `It is <b>${m.month}</b>. What season is it ${here ? 'in Aotearoa New Zealand' : 'in Britain (northern hemisphere)'}?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'NZ seasons are the opposite of the northern hemisphere ones. December–February = NZ summer.',
      working: ['<b>Picture:</b> a tilted ball going round a torch — one half leans in, the other leans away.', `1. In ${m.month} it is <b>${m.nz}</b> in New Zealand.`, here ? `So the answer is <b>${m.nz}</b>.` : `The northern hemisphere gets the opposite season, so it is <b>${m.north}</b> there.`],
      finalAnswer: ans, skill: 'seasons',
    };
  }

  function phaseOrderQ(level) {
    const i = R.int(0, 7);
    const after = R.chance(0.6);
    const ansIdx = after ? (i + 1) % 8 : (i + 7) % 8;
    const ans = PHASES[ansIdx].name;
    const c = choice(ans, PHASES.map((p) => p.name));
    return {
      visual: phasesGridSvg({ hide: ansIdx }),
      prompt: `Moon phases go round in the same order every month. Which phase comes straight <b>${after ? 'after' : 'before'}</b> a <b>${PHASES[i].name}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'new → waxing crescent → first quarter → waxing gibbous → full → waning gibbous → last quarter → waning crescent → new…',
      working: ['<b>Picture:</b> the Moon slowly filling up like a glass of milk, then emptying again.', `1. ${PHASES[i].name} is number ${i + 1} in the cycle.`, `2. The one ${after ? 'after' : 'before'} it is number ${ansIdx + 1}.`, `That is the <b>${ans}</b>.`],
      finalAnswer: ans, skill: 'phases',
    };
  }

  function phaseNameQ(level) {
    const p = R.pick(level === 1 ? [PHASES[0], PHASES[4], PHASES[2], PHASES[6]] : PHASES);
    const c = choice(p.name, PHASES.map((q) => q.name));
    return {
      visual: bigPhaseSvg(p.k),
      prompt: 'What is this phase of the Moon called?',
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'From Aotearoa the Moon fills up from the LEFT: waxing = lit on the left, waning = lit on the right.',
      working: ['<b>Picture:</b> the Moon filling up like a glass of milk, from the left (as seen from NZ).', `1. How much is lit? ${p.desc}.`, `So it is a <b>${p.name}</b>.`],
      finalAnswer: p.name, skill: 'phases',
    };
  }

  function moonNumberQ(level) {
    const style = R.pick(['half', 'quarter', 'weeks', 'days-to-full']);
    if (style === 'half') {
      const d = R.pick([28, 30]);
      return {
        prompt: `The Moon takes about <b>${d} days</b> to go through all its phases. About how many days after a new moon is the <b>full moon</b>?`,
        answer: { type: 'number', value: d / 2, unit: 'days', placeholder: 'e.g. 14' },
        hint: 'Full moon is exactly halfway through the cycle.',
        working: ['<b>Picture:</b> the glass of milk filling up, then emptying — full moon is at the top.', `Half of ${d} = <b>${d / 2}</b>.`],
        finalAnswer: `${d / 2} days`, skill: 'phases',
      };
    }
    if (style === 'quarter') {
      const d = R.pick([28, 32]);
      return {
        prompt: `A Moon cycle takes about <b>${d} days</b>. About how many days after a new moon is the <b>first quarter</b>?`,
        answer: { type: 'number', value: d / 4, unit: 'days', placeholder: 'e.g. 7' },
        hint: 'First quarter is a quarter of the way through the cycle — that is where the name comes from.',
        working: ['<b>Picture:</b> the cycle split into four equal chunks: new → first quarter → full → last quarter.', `${d} ÷ 4 = <b>${d / 4}</b>.`],
        finalAnswer: `${d / 4} days`, skill: 'phases',
      };
    }
    if (style === 'weeks') {
      const n = R.int(2, 6);
      return {
        prompt: `The Moon takes about <b>28 days</b> for a full cycle. How many days is <b>${n} cycles</b>?`,
        answer: { type: 'number', value: 28 * n, unit: 'days', placeholder: 'e.g. 56' },
        hint: `Multiply 28 by ${n}.`,
        working: ['One cycle ≈ 28 days.', `28 × ${n} = <b>${28 * n}</b> days.`],
        finalAnswer: `${28 * n} days`, skill: 'phases',
      };
    }
    const day = R.int(1, 14);
    return {
      prompt: `There was a new moon on the 1st of the month. Using a <b>28 day</b> cycle, on which day of the month is the <b>full moon</b>? <span class="muted">(Give the date number.)</span>`,
      answer: { type: 'number', value: 15, placeholder: 'e.g. 15' },
      hint: 'Full moon is 14 days after new moon. Day 1 + 14 days = day 15.',
      working: ['<b>Picture:</b> the milk glass fills for 14 nights.', 'New moon on day 1, so full moon is 14 days later.', '1 + 14 = <b>15</b>.'],
      finalAnswer: 'the 15th', skill: 'phases',
    };
  }

  function tidesNumberQ(level) {
    const n = R.int(1, 4);
    return {
      prompt: `There are <b>2 high tides</b> at a beach every day. How many high tides are there in <b>${n} day${n > 1 ? 's' : ''}</b>?`,
      answer: { type: 'number', value: 2 * n, placeholder: 'e.g. 4' },
      hint: 'The water bulges on BOTH sides of Earth, so you pass through two bulges each spin.',
      working: ['<b>Picture:</b> Earth spinning through two water bulges each day.', `2 × ${n} = <b>${2 * n}</b> high tides.`],
      finalAnswer: String(2 * n), skill: 'tides',
    };
  }

  function eclipseQ(level) {
    const solar = R.chance(0.5);
    const style = R.pick(['name', 'middle', 'when']);
    if (style === 'name') {
      const c = choice(solar ? 'A solar eclipse' : 'A lunar eclipse', ['A solar eclipse', 'A lunar eclipse', 'A full moon', 'A new moon'], 4);
      return {
        visual: eclipseSvg(solar ? 'solar' : 'lunar'),
        prompt: solar ? 'The Moon moves exactly between the Sun and the Earth, blocking the Sun. What is this called?' : 'The Earth moves exactly between the Sun and the Moon, so its shadow falls on the Moon. What is this called?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Name it after the thing that gets hidden: the Sun (solar) or the Moon (lunar).',
        working: ['<b>Picture:</b> three balls lined up in a row.', solar ? '1. What gets hidden? The <b>Sun</b>.' : '1. What gets hidden? The <b>Moon</b>.', `So it is a <b>${solar ? 'solar' : 'lunar'} eclipse</b>.`],
        finalAnswer: solar ? 'A solar eclipse' : 'A lunar eclipse', skill: 'eclipses',
      };
    }
    if (style === 'middle') {
      const c = choice(solar ? 'The Moon' : 'The Earth', ['The Sun', 'The Moon', 'The Earth'], 3);
      return {
        visual: eclipseSvg(solar ? 'solar' : 'lunar'),
        prompt: `In a <b>${solar ? 'solar' : 'lunar'} eclipse</b>, which object is in the middle?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Whatever is in the middle casts the shadow.',
        working: [`<b>Solar:</b> Sun – <b>Moon</b> – Earth. <b>Lunar:</b> Sun – <b>Earth</b> – Moon.`, `So in a ${solar ? 'solar' : 'lunar'} eclipse the <b>${solar ? 'Moon' : 'Earth'}</b> is in the middle.`],
        finalAnswer: solar ? 'The Moon' : 'The Earth', skill: 'eclipses',
      };
    }
    const c = choice(solar ? 'During the day' : 'At night, when there is a full moon', ['During the day', 'At night, when there is a full moon', 'Only in winter', 'Only at sunrise'], 4);
    return {
      prompt: `When can you see a <b>${solar ? 'solar' : 'lunar'} eclipse</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: solar ? 'You have to be able to see the Sun for it to be blocked.' : 'The Moon must be on the far side of Earth from the Sun — that is a full moon.',
      working: solar
        ? ['<b>Picture:</b> the Moon slides in front of the Sun.', 'You can only see the Sun in the <b>daytime</b>.', 'Never look straight at it — use a special filter.']
        : ['<b>Picture:</b> Earth&rsquo;s shadow sliding across the Moon.', 'The Moon has to be opposite the Sun — that is a <b>full moon</b>, at night.'],
      finalAnswer: solar ? 'During the day' : 'At night, when there is a full moon', skill: 'eclipses',
    };
  }

  function tidesQ(level) {
    const items = [
      { q: 'What causes the tides?', a: 'The Moon&rsquo;s gravity pulling the ocean', wrongs: ['The wind blowing the sea', 'The Earth&rsquo;s tilt', 'The Sun heating the water'],
        w: ['<b>Picture:</b> the Moon tugging the water towards it like a magnet on a puddle.', 'The <b>Moon&rsquo;s gravity</b> pulls the ocean into a bulge.'] },
      { q: 'How many high tides does a beach usually get in one day?', a: '2', wrongs: ['1', '4', '12'],
        w: ['The water bulges on <b>both</b> sides of the Earth.', 'Earth spins once a day, so a beach passes through <b>2</b> bulges.'] },
      { q: 'About how long is it from one high tide to the next?', a: 'About 12 hours', wrongs: ['About 1 hour', 'About 24 hours', 'About a week'],
        w: ['Two high tides fit into about 24 hours.', '24 ÷ 2 = <b>about 12 hours</b> apart.'] },
      { q: 'The tides are biggest at full moon and new moon. Why?', a: 'The Sun and Moon pull in a line together', wrongs: ['The Moon is closest then', 'The Earth spins faster then', 'There is more wind then'],
        w: ['<b>Picture:</b> two people pulling a rope in the same direction.', 'At full and new moon the Sun and Moon line up with Earth.', 'Their pulls <b>add together</b> → extra big (spring) tides.'] },
    ];
    const it = R.pick(items);
    const c = choice(it.a, it.wrongs, 4);
    return {
      visual: R.chance(0.5) ? tidesSvg() : undefined,
      prompt: it.q,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Tides = the Moon pulling the water.',
      working: it.w, finalAnswer: it.a, skill: 'tides',
    };
  }

  function vocabQ(level) {
    const it = R.pick(VOCAB);
    return {
      prompt: it.q + ' <span class="muted">(one or two words)</span>',
      answer: { type: 'text', value: it.a, accept: it.accept, placeholder: 'type a word' },
      hint: 'Say the picture in your head first: spin, orbit, tilt, phase.',
      working: ['Match the movement to its name.', `The answer is <b>${it.a}</b>.`],
      finalAnswer: it.a, skill: 'words',
    };
  }

  function spinOrbitTiltQ(level) {
    const items = [
      { effect: 'day and night', cause: 'the Earth spinning on its axis' },
      { effect: 'the year', cause: 'the Earth orbiting the Sun' },
      { effect: 'the seasons', cause: 'the tilt of the Earth&rsquo;s axis' },
      { effect: 'the phases of the Moon', cause: 'the Moon orbiting the Earth' },
      { effect: 'the tides', cause: 'the Moon&rsquo;s gravity pulling the ocean' },
      { effect: 'a solar eclipse', cause: 'the Moon passing between the Sun and the Earth' },
      { effect: 'a lunar eclipse', cause: 'the Earth&rsquo;s shadow falling on the Moon' },
    ];
    const it = R.pick(items);
    const c = choice(it.cause, items.map((x) => x.cause));
    return {
      prompt: `What causes <b>${it.effect}</b>?`,
      answer: { type: 'choice', value: c.value, choices: c.choices },
      hint: 'Spin → day. Orbit → year. Tilt → seasons. Moon&rsquo;s orbit → phases. Moon&rsquo;s gravity → tides.',
      working: ['<b>Picture:</b> the five movements, each with one job.', `${it.effect.charAt(0).toUpperCase() + it.effect.slice(1)} is caused by <b>${it.cause}</b>.`],
      finalAnswer: it.cause, skill: 'causes',
    };
  }

  /* ---------- word / scenario questions ---------- */
  const WORD = [
    () => {
      const c = choice('No — the tilt is what matters, not the distance', ['Yes — Earth is much closer in summer', 'Yes — the Sun moves closer to us', 'No — the Sun gets hotter in summer'], 4);
      return {
        prompt: 'Harper&rsquo;s friend says "it is hot in summer because Earth is closer to the Sun then". Is that right?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'If distance caused summer, the whole planet would have summer at the same time.',
        working: ['<b>Picture:</b> a torch shining on a tilted ball.', '1. Do NZ and Britain have summer at the same time? No — opposite.', '2. So it cannot be distance, or both would be hot together.', 'It is the <b>tilt</b>: whichever half leans towards the Sun gets summer.'],
        finalAnswer: 'No — the tilt is what matters, not the distance',
      };
    },
    () => {
      const m = R.pick(['December', 'January', 'June', 'July']);
      const nz = NZ_SEASON.find((x) => x.month === m);
      const c = choice(`${nz.nz} in NZ and ${nz.north} in Canada`, ['summer in both places', 'winter in both places', `${nz.north} in NZ and ${nz.nz} in Canada`], 4);
      return {
        visual: tiltSvg(),
        prompt: `Harper writes to a pen pal in Canada in <b>${m}</b>. What season is it in each place?`,
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The two hemispheres always have opposite seasons.',
        working: ['<b>Picture:</b> a tilted ball — one half leans in, the other leans away, at the same moment.', `1. In ${m} the southern half of Earth is in <b>${nz.nz}</b>.`, `2. The north gets the opposite: <b>${nz.north}</b>.`],
        finalAnswer: `${nz.nz} in NZ and ${nz.north} in Canada`,
      };
    },
    () => {
      const c = choice('The Moon was waxing (getting bigger)', ['The Moon was waning', 'The Moon was full both nights', 'Clouds made it look bigger'], 4);
      return {
        prompt: 'Harper draws the Moon on Monday and again on Friday. On Friday the lit part is bigger. What was the Moon doing?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Waxing = growing. Waning = shrinking.',
        working: ['<b>Picture:</b> the glass of milk filling up.', '1. Is the lit part bigger or smaller? Bigger.', 'Growing = <b>waxing</b>.'],
        finalAnswer: 'The Moon was waxing (getting bigger)',
      };
    },
    () => {
      const c = choice('A lunar eclipse — Earth&rsquo;s shadow is falling on the Moon', ['A solar eclipse', 'A new moon', 'The Moon is behind a cloud'], 4);
      return {
        visual: eclipseSvg('lunar'),
        prompt: 'One night the full moon slowly turns dark red for an hour, then goes bright again. What did Harper see?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'What can block sunlight from reaching the Moon?',
        working: ['<b>Picture:</b> Earth&rsquo;s shadow sliding across the Moon like a hand over a torch beam.', '1. Was it night, with a full moon? Yes — that is when this can happen.', '2. So Earth is between the Sun and the Moon.', 'That is a <b>lunar eclipse</b>. The red colour is sunlight bent through our atmosphere.'],
        finalAnswer: 'A lunar eclipse',
      };
    },
    () => {
      const c = choice('The Moon passed in front of the Sun — a solar eclipse', ['A lunar eclipse', 'The Earth stopped spinning', 'A very thick cloud'], 4);
      return {
        visual: eclipseSvg('solar'),
        prompt: 'At 11 am the sky goes dark for two minutes, the birds go quiet, then it is bright again. What happened?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'It happened in the daytime, so the Sun must have been covered.',
        working: ['<b>Picture:</b> holding a coin in front of a torch — it blocks the light.', '1. Was it day? Yes, so the Sun was up.', '2. What can slide in front of the Sun? The Moon.', 'That is a <b>solar eclipse</b>. Never look straight at it.'],
        finalAnswer: 'The Moon passed in front of the Sun — a solar eclipse',
      };
    },
    () => {
      const c = choice('About 12 hours later', ['About 2 hours later', 'About 24 hours later', 'The next week'], 4);
      return {
        visual: tidesSvg(),
        prompt: 'Harper visits the beach at 7 am and it is high tide. About when is the next high tide?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Two high tides fit into one day.',
        working: ['<b>Picture:</b> Earth spinning through two water bulges every 24 hours.', '1. How many high tides in a day? 2.', '2. 24 ÷ 2 = 12.', 'So the next one is <b>about 12 hours later</b>, around 7 pm.'],
        finalAnswer: 'About 12 hours later',
      };
    },
    () => {
      const c = choice('The Earth spins — Australia has not turned into the sunlight yet', ['Australia is further from the Sun', 'Australia is in a different season', 'The Sun rises later in bigger countries'], 4);
      return {
        visual: dayNightSvg(),
        prompt: 'When the sun rises in Gisborne it is still dark in Perth, Australia. Why?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which way does the Earth spin, and who meets the sunlight first?',
        working: ['<b>Picture:</b> a spinning ball with a torch on one side.', '1. Earth spins west to east, so eastern places meet the light first.', '2. Gisborne is far to the east of Perth.', 'So Perth is <b>still on the dark half</b> — it has not spun into the light yet.'],
        finalAnswer: 'The Earth spins — Australia has not turned into the sunlight yet',
      };
    },
    () => {
      const idx = R.int(0, 7);
      const p = PHASES[idx];
      const c = choice(p.name, PHASES.map((x) => x.name));
      return {
        visual: bigPhaseSvg(p.k),
        prompt: 'Harper is keeping a Moon diary. She draws this shape tonight. What should she write beside it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'From New Zealand the Moon fills up from the LEFT. Lit on the left = waxing, lit on the right = waning.',
        working: ['<b>Picture:</b> a glass of milk filling from the left, then emptying from the left.', `1. How much is lit? ${p.desc}.`, `So she writes <b>${p.name}</b>.`],
        finalAnswer: p.name,
      };
    },
    () => {
      const c = choice('The Moon does not make its own light — we only see the half the Sun lights up', ['The Moon changes shape each month', 'Earth&rsquo;s shadow covers the Moon each night', 'Clouds cover part of the Moon'], 4);
      return {
        visual: phasesGridSvg({}),
        prompt: 'Why does the Moon seem to change shape during the month?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'The Moon is always a full ball. What changes is how much of the lit half we can see.',
        working: ['<b>Picture:</b> a ball with a torch on one side — half of it is always lit.', '1. Does the Moon really change shape? No, it stays a ball.', '2. As it orbits us we see a different amount of the lit half.', 'That is what a <b>phase</b> is.'],
        finalAnswer: 'The Moon does not make its own light — we only see the half the Sun lights up',
      };
    },
    () => {
      const c = choice('The days are longer AND the sunlight hits more directly', ['The Earth is closer to the Sun', 'The Sun is bigger in summer', 'There is less air in summer'], 4);
      return {
        visual: tiltSvg(),
        prompt: 'Harper notices that in January it is still light at 8:30 pm and it is much hotter. Why does the leaning-towards-the-Sun half get so warm?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Two things change at once when your half leans in.',
        working: ['<b>Picture:</b> a torch shining straight down on a table vs shining at a slant.', '1. Straight down = the light is concentrated → hotter.', '2. Leaning in also means you spend longer in the light each spin → longer days.', 'Both together make it <b>much warmer</b>.'],
        finalAnswer: 'The days are longer AND the sunlight hits more directly',
      };
    },
    () => {
      const c = choice('New moon — the lit side is facing away from us', ['Full moon', 'First quarter', 'A lunar eclipse'], 4);
      return {
        prompt: 'For two nights running Harper cannot find the Moon at all, even though the sky is clear. What phase is it?',
        answer: { type: 'choice', value: c.value, choices: c.choices },
        hint: 'Which phase shows us none of the lit half?',
        working: ['<b>Picture:</b> the Moon sitting between us and the Sun, with its lit face pointing at the Sun.', '1. Is any of the lit half turned our way? No.', 'So it is a <b>new moon</b>.'],
        finalAnswer: 'New moon — the lit side is facing away from us',
      };
    },
  ];

  HL.registerTopic({
    id: 'earth-sun-moon', subject: 'science', strand: 'earth', order: 2,
    name: 'Earth, Sun & Moon', short: 'Earth Sun Moon', animal: 'owl',
    blurb: 'Spin makes day, orbit makes the year, tilt makes the seasons and the Moon makes the tides.',
    example: 'NZ summer is in December because our half leans towards the Sun',
    learn: {
      what: '<p>Three movements explain almost everything you see in the sky. The Earth <b>spins</b> once every 24 hours — that gives us <b>day and night</b>. The Earth <b>orbits</b> the Sun once every 365¼ days — that is a <b>year</b>. The Earth&rsquo;s axis is <b>tilted 23.5°</b>, so each half leans towards the Sun for part of the year — that gives us the <b>seasons</b>. The Moon orbits us about once a month, which gives us the <b>phases</b>, <b>eclipses</b> and the <b>tides</b>.</p><p><b>Picture for this topic:</b> a <b>torch and a tilted ball</b>. The torch (the Sun) never moves. The ball spins, and carries a smaller ball (the Moon) around with it.</p>',
      visual: conceptSvg(),
      facts: [
        '<b>Spin</b> (24 hours) → day and night · <b>Orbit</b> (365¼ days) → the year · <b>Tilt</b> (23.5°) → the seasons',
        'NZ has summer in <b>December</b> because the southern half leans <b>towards</b> the Sun then',
        'Phase order: <b>new → waxing crescent → first quarter → waxing gibbous → full → waning gibbous → last quarter → waning crescent</b> (≈ 29½ days)',
        '<b>Waxing</b> = growing · <b>waning</b> = shrinking. From NZ the Moon fills up from the <b>left</b>',
        '<b>Solar</b> eclipse: Sun – Moon – Earth (the Moon hides the Sun, in the daytime). <b>Lunar</b> eclipse: Sun – Earth – Moon (our shadow darkens a full moon, at night)',
        'The <b>Moon&rsquo;s gravity</b> pulls the ocean into two bulges → <b>2 high tides</b> and 2 low tides a day, about 12 hours apart',
      ],
      steps: [
        'When a question asks "what causes…?", run through the list: <b>spin → day</b>, <b>orbit → year</b>, <b>tilt → seasons</b>, <b>Moon&rsquo;s orbit → phases</b>, <b>Moon&rsquo;s gravity → tides</b>.',
        'For seasons, ask "<b>which half is leaning towards the Sun?</b>" That half is having summer; the other half is having winter at the very same moment.',
        'For a phase, ask two questions: "<b>how much is lit?</b>" (sliver / half / most / all) and "<b>is it growing or shrinking?</b>" (waxing / waning). Put the two answers together.',
        'For an eclipse, ask "<b>what is hidden?</b>" The Sun hidden = <b>solar</b>. The Moon hidden = <b>lunar</b>. Whatever is in the middle is what casts the shadow.',
        'Never say the Moon "makes light" or "changes shape" — it is always a full ball, half lit by the Sun. We just see it from a different angle each night.',
      ],
      examples: [
        { q: 'What causes day and night?',
          visual: dayNightSvg(),
          working: ['<b>Picture:</b> you stand on a spinning roundabout with one torch beside it.', '1. Does the torch move? No.', '2. Do you face it all the time? No — you spin away from it.', 'So <b>Earth spinning</b> gives day (facing the Sun) and night (facing away). One spin = 24 hours.'],
          a: 'The Earth spinning on its axis, once every 24 hours' },
        { q: 'It is 25 December. What season is it in Aotearoa, and why?',
          visual: tiltSvg(),
          working: ['<b>Picture:</b> a tilted ball going round a torch. The tilt always points the same way.', '1. In December, which half of Earth leans towards the Sun? The <b>southern</b> half.', '2. Is NZ in the southern half? Yes.', '3. Leaning in = more direct sunlight + longer days.', 'So it is <b>summer</b> in NZ — and winter in Britain at the same moment.'],
          a: 'Summer, because the southern hemisphere is leaning towards the Sun' },
        { q: 'Which phase comes straight after a full moon?',
          visual: phasesGridSvg({}),
          working: ['<b>Picture:</b> a glass of milk that fills up, then empties again.', '1. Where is full moon in the cycle? Right in the middle (number 5).', '2. After the top, does it grow or shrink? It <b>shrinks</b> — waning.', '3. Straight after full, most of it is still lit.', 'So it is the <b>waning gibbous</b>.'],
          a: 'Waning gibbous' },
        { q: 'The Moon takes about 28 days for one cycle. How many days after a new moon is the full moon?',
          working: ['<b>Picture:</b> the milk glass filling for half the month, emptying for the other half.', '1. Full moon is <b>halfway</b> through the cycle.', '2. 28 ÷ 2 = 14.'],
          a: 'About 14 days' },
        { q: 'At 11 am the sky suddenly goes dark for two minutes. What is happening, and what must NOT you do?',
          visual: eclipseSvg('solar'),
          working: ['<b>Picture:</b> a coin held up in front of a torch.', '1. Is it day or night? Day — so the Sun is up.', '2. What can slide in front of the Sun? The Moon.', '3. Order: Sun – Moon – Earth. What is hidden? The <b>Sun</b>.', 'That is a <b>solar eclipse</b>. Never look straight at the Sun, even during one.'],
          a: 'A solar eclipse — and do not look straight at the Sun' },
        { q: 'It is high tide at Piha at 6 am. Roughly when is the next high tide, and what causes tides at all?',
          visual: tidesSvg(),
          working: ['<b>Picture:</b> the Moon tugging the ocean towards itself, making a bulge on the near side — and one on the far side too.', '1. What causes tides? The <b>Moon&rsquo;s gravity</b>.', '2. How many bulges does Earth spin through each day? Two.', '3. 24 ÷ 2 = 12 hours between high tides.'],
          a: 'About 6 pm — the Moon&rsquo;s gravity makes two bulges, so tides repeat about every 12 hours' },
        { q: 'Harper&rsquo;s friend says "the Moon changes shape every month". What is really going on?',
          visual: phasesGridSvg({}),
          working: ['<b>Picture:</b> a ball with a torch shining on one side — exactly half is always lit.', '1. Does the ball change shape? No.', '2. As the Moon orbits us, how much of the lit half faces us changes.', '3. That is what a <b>phase</b> is — an angle, not a shape change.'],
          a: 'The Moon stays a ball; we just see different amounts of its lit half' },
      ],
      tips: [
        'Seasons are about the <b>tilt</b>, never about being closer to the Sun. If distance did it, the whole planet would be hot at once.',
        'Solar eclipse = the <b>Sun</b> disappears (daytime). Lunar eclipse = the <b>Moon</b> darkens (night, full moon). Name it after what goes missing.',
        'From Aotearoa the Moon fills up from the <b>left</b> — pictures in books from the northern hemisphere are the other way round.',
      ],
    },
    generate(level, kind) {
      if (kind === 'word') return R.pick(WORD)();
      const pool = level === 1
        ? [dayNightQ, seasonMonthQ, phaseNameQ, phaseOrderQ, vocabQ, spinOrbitTiltQ, tidesQ]
        : level === 2
          ? [dayNightQ, yearTiltQ, seasonMonthQ, phaseOrderQ, phaseNameQ, eclipseQ, tidesQ, vocabQ, spinOrbitTiltQ, moonNumberQ]
          : [yearTiltQ, seasonMonthQ, phaseOrderQ, phaseNameQ, eclipseQ, tidesQ, moonNumberQ, tidesNumberQ, spinOrbitTiltQ, dayNightQ];
      return R.pick(pool)(level);
    },
  });
})(window.HL);
