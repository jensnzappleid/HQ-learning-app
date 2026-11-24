/* Topic: Matariki — the star cluster, Māori New Year, the Maramataka, the story of its name,
 * navigation, how it is celebrated, the nine stars and what each one means, and its names in other cultures.
 * Year 8 Cosmology LO10 (explain what Matariki is and why it is important).
 * Star meanings follow the widely taught nine-star version (Dr Rangi Matamua). The workbook notes
 * that narratives differ between iwi; the topic says so too. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const STARS = [
    { n: 'Matariki', m: 'health and wellbeing of people; the mother of the other stars', short: 'health' },
    { n: 'Pōhutukawa', m: 'remembering those who have died since the last Matariki', short: 'the dead' },
    { n: 'Tupuānuku', m: 'food that grows in the ground (like kūmara)', short: 'food from the ground' },
    { n: 'Tupuārangi', m: 'food from the sky and trees (birds and fruit)', short: 'food from the trees' },
    { n: 'Waitī', m: 'fresh water and the food in it (rivers, lakes)', short: 'fresh water' },
    { n: 'Waitā', m: 'the ocean and food from the sea', short: 'the ocean' },
    { n: 'Waipuna-ā-rangi', m: 'rain', short: 'rain' },
    { n: 'Ururangi', m: 'the winds', short: 'wind' },
    { n: 'Hiwa-i-te-rangi', m: 'wishes, hopes and dreams for the year ahead', short: 'wishes' },
  ];
  const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visual = `<svg viewBox="0 0 340 160" width="340" height="160" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="9" font-weight="700">
    <rect x="2" y="2" width="336" height="156" rx="12" fill="#14213D"/>
    <text x="170" y="18" text-anchor="middle" fill="#FFF1C9" font-size="11">The nine stars of Matariki</text>
    ${STARS.map((s, i) => {
      const pos = [[170, 70], [110, 52], [220, 48], [80, 96], [140, 108], [205, 102], [260, 82], [120, 136], [235, 134]][i];
      return `<circle cx="${pos[0]}" cy="${pos[1]}" r="${i === 0 ? 6 : 4}" fill="${i === 0 ? '#FFF1C9' : '#A9D8F5'}"/><text x="${pos[0]}" y="${pos[1] - 8}" text-anchor="middle" fill="#FFFFFF">${s.n}</text>`;
    }).join('')}
  </svg>`;

  const mcq = [
    { p: 'What is <b>Matariki</b>?', a: 'A cluster (group) of stars that marks the Māori New Year', w: ['A single bright planet', 'A comet that comes every 76 years', 'The Māori name for the Moon'], short: 'a star cluster', accept: ['star cluster', 'cluster of stars', 'a cluster of stars', 'a group of stars', 'group of stars', 'maori new year', 'māori new year'], why: 'Matariki is a star cluster; its rising marks the Māori New Year.' },
    { p: 'What does Matariki mark in the Māori calendar?', a: 'The Māori New Year', w: ['Christmas', 'The start of summer', 'The end of the school year'], short: 'new year', accept: ['māori new year', 'maori new year', 'the new year', 'the māori new year', 'the maori new year'], why: 'The Māori New Year, under the Maramataka.' },
    { p: 'What is the <b>Maramataka</b>?', a: 'The Māori lunar calendar, which follows the cycles of the Moon', w: ['A Māori canoe', 'A type of star', 'The European calendar'], short: 'lunar calendar', accept: ['māori lunar calendar', 'maori lunar calendar', 'the māori lunar calendar', 'the maori lunar calendar', 'moon calendar', 'a lunar calendar', 'the lunar calendar'], why: 'It follows the Moon, unlike the European (Gregorian) calendar, which follows the Sun.' },
    { p: 'How is the Maramataka different from the Gregorian calendar we use for school?', a: 'The Maramataka follows the Moon; the Gregorian calendar follows the Sun', w: ['The Maramataka follows the Sun; the Gregorian follows the Moon', 'They are exactly the same', 'The Maramataka has no months'], why: 'Lunar (Moon) vs solar (Sun).' },
    { p: 'The name Matariki comes from "Ngā Mata o te Ariki Tāwhirimātea". What does that mean?', a: 'The eyes of the god (chief) Tāwhirimātea', w: ['The little eyes of the sea', 'The children of the Sun', 'The stars of the canoe'], why: 'Ngā mata = the eyes; te ariki = the chief/god; Tāwhirimātea = the atua of the wind.' },
    { p: 'In the story, why did Tāwhirimātea tear out his eyes and throw them into the sky?', a: 'He was so upset that Tāne Mahuta separated his parents, Ranginui and Papatūānuku', w: ['He wanted more light at night', 'He lost a battle with the Moon', 'He wanted to help navigators'], why: 'Tāwhirimātea (atua of the wind) was furious that Tāne Mahuta (atua of the forest) pushed his parents apart.' },
    { p: 'Who is Tāwhirimātea?', a: 'The atua (god) of the wind and weather', w: ['The atua of the forest', 'The Sky Father', 'The Earth Mother'], short: 'god of the wind', accept: ['atua of the wind', 'the god of the wind', 'the atua of the wind', 'god of wind', 'wind god', 'god of weather', 'god of the weather'], why: 'Tāne Mahuta = forest; Ranginui = sky father; Papatūānuku = earth mother.' },
    { p: 'How did early Polynesian navigators use Matariki?', a: 'To find their way across the Pacific Ocean (Moana-nui-a-Kiwa)', w: ['To light their canoes', 'To catch fish', 'To tell the time of day'], why: 'Stars rising and setting at known points let navigators steer across the ocean.' },
    { p: 'When is the best time to see Matariki?', a: 'Very early in the morning, just before sunrise, in mid-winter (June–July)', w: ['At midnight in summer', 'At midday', 'Only during an eclipse'], why: 'It appears low in the north-east sky before dawn in mid-winter.' },
    { p: 'Which of these is a way people celebrate Matariki in New Zealand?', a: 'Gathering with whānau, sharing kai, remembering those who died, and planning for the year ahead', w: ['Giving chocolate eggs', 'Setting off fireworks at midnight on 31 December', 'Carving pumpkins'], why: 'Remember the past, celebrate the present, plan for the future.' },
    { p: 'What is the Matariki cluster called in Greek tradition?', a: 'The Pleiades (the Seven Sisters)', w: ['The Big Dipper', 'Orion\'s Belt', 'The Southern Cross'], short: 'pleiades', accept: ['the pleiades', 'seven sisters', 'the seven sisters'], why: 'In Japan it is called Subaru (like the car logo!).' },
    { p: 'In Japan the Matariki cluster is called…', a: 'Subaru', w: ['Pleiades', 'Orion', 'Crux'], short: 'subaru', why: 'The Subaru car logo shows the cluster\'s stars.' },
    { p: 'How many stars of Matariki are commonly named in Aotearoa today?', a: 'Nine', w: ['Three', 'Seven', 'Twelve'], short: '9', accept: ['nine'], why: 'Matariki and eight others — each looks after part of the environment or people\'s lives.' },
    { p: 'Why is Matariki important?', a: 'It is a time to remember those who have passed, celebrate together and prepare for the new year — and it links people to the stars, the seasons and the land', w: ['It is only a fun festival with no meaning', 'It tells farmers to harvest in summer', 'It celebrates the European New Year'], why: 'Since 2022 it has also been a public holiday in New Zealand.' },
  ];
  STARS.forEach((s) => {
    mcq.push({ p: `Which part of life does the star <b>${s.n}</b> look after?`, a: s.m.charAt(0).toUpperCase() + s.m.slice(1), w: STARS.map((x) => x.m.charAt(0).toUpperCase() + x.m.slice(1)), why: `${s.n}: ${s.m}.` });
  });
  const tf = [
    { s: 'Matariki is a single star.', t: false, why: 'It is a star <b>cluster</b> — Matariki is also the name of one star in it.' },
    { s: 'The Maramataka follows the Moon.', t: true, why: 'It is a lunar calendar.' },
    { s: 'Matariki is best seen in mid-winter just before sunrise.', t: true, why: 'Head out early in June/July.' },
    { s: 'The Pleiades, Seven Sisters and Subaru are names other cultures use for the same cluster.', t: true, why: 'Many cultures used this cluster to mark special times.' },
    { s: 'Pōhutukawa is the star connected with those who have died.', t: true, why: 'People remember loved ones who passed in the last year.' },
    { s: 'Matariki stories are exactly the same for every iwi.', t: false, why: 'The workbook notes narratives and traditions differ between areas and tribes.' },
    { s: 'Hiwa-i-te-rangi is the star you make wishes to for the year ahead.', t: true, why: 'It is the wishing star.' },
    { s: 'Waitā is connected with fresh water and Waitī with the ocean.', t: false, why: 'The other way round: <b>Waitī = fresh water</b>, <b>Waitā = the ocean (salt water)</b>.' },
  ];
  const groups = [
    { label: 'a star of Matariki', items: STARS.map((s) => s.n) },
    { label: 'an atua or figure from the Matariki story', items: ['Tāwhirimātea', 'Tāne Mahuta', 'Ranginui', 'Papatūānuku'] },
    { label: 'another culture\'s name for the cluster', items: ['the Pleiades', 'the Seven Sisters', 'Subaru'] },
  ];
  function nameStarQ(level) {
    const s = R.pick(STARS);
    if (level >= 2 && R.chance(0.5)) {
      return {
        prompt: `Name the Matariki star connected with <b>${s.m}</b>. <span class="muted">(macrons optional)</span>`,
        answer: K.text(s.n, [plain(s.n), plain(s.n).replace(/-/g, ' '), plain(s.n).replace(/-/g, '')]),
        hint: 'Food: Tupuānuku (ground), Tupuārangi (sky). Water: Waitī (fresh), Waitā (sea). Weather: Waipuna-ā-rangi (rain), Ururangi (wind).',
        working: [`${s.n}: ${s.m}.`], finalAnswer: s.n, skill: 'space-matariki-stars',
      };
    }
    return {
      prompt: `Which Matariki star is connected with <b>${s.m}</b>?`,
      answer: K.choice(s.n, STARS.map((x) => x.n), level === 1 ? 3 : 4),
      hint: 'Food: Tupuānuku (ground), Tupuārangi (sky). Water: Waitī (fresh), Waitā (sea). Weather: Waipuna-ā-rangi (rain), Ururangi (wind).',
      working: [`${s.n}: ${s.m}.`], finalAnswer: s.n, skill: 'space-matariki-stars',
    };
  }
  function pairQ(level) {
    const pairs = [['Tupuānuku', 'Tupuārangi', 'food from the ground', 'food from the sky and trees'], ['Waitī', 'Waitā', 'fresh water', 'the ocean']];
    const p = R.pick(pairs);
    const first = R.chance(0.5);
    const star = first ? p[0] : p[1];
    return {
      prompt: `<b>${p[0]}</b> and <b>${p[1]}</b> are easy to mix up. Which one is about <b>${first ? p[2] : p[3]}</b>?`,
      answer: K.fixed([p[0], p[1]], star),
      hint: p[0] === 'Tupuānuku' ? 'Nuku = earth/ground (Papatūānuku). Rangi = sky (Ranginui).' : 'Waitī → "tī" = fresh/sweet. Waitā → "tā" = salty sea.',
      working: [`${p[0]}: ${p[2]}.`, `${p[1]}: ${p[3]}.`], finalAnswer: star, skill: 'space-matariki-stars',
    };
  }
  const word = [
    (level) => ({
      prompt: 'Your whānau wants to see Matariki this year. When and where should you look?',
      answer: K.choice('Get up before dawn in late June or July and look low in the north-east sky', ['Look straight up at midnight on New Year\'s Eve', 'Look west at sunset in summer', 'Look at the Moon during a full moon'], level === 1 ? 3 : 4),
      hint: 'It rises just before the Sun in mid-winter.', working: ['Matariki reappears in mid-winter.', 'It is low in the north-east just before sunrise.'],
      finalAnswer: 'Before dawn in late June/July, north-east', skill: 'space-matariki-apply',
    }),
    (level) => ({
      prompt: 'At a Matariki dinner, your aunty lights a candle for your koro who died this year. Which star is she honouring?',
      answer: K.choice('Pōhutukawa', STARS.map((s) => s.n).filter((n) => n !== 'Pōhutukawa'), level === 1 ? 3 : 4),
      hint: 'Which star is for remembering those who have passed?', working: ['Pōhutukawa is connected with those who have died since the last Matariki.'],
      finalAnswer: 'Pōhutukawa', skill: 'space-matariki-apply',
    }),
    (level) => ({
      prompt: 'Why would a star cluster be useful to people who did not have printed calendars?',
      answer: K.choice('When it rises before dawn each year, it signals the time to prepare for the new season — planting, harvesting, fishing', ['It shows the exact date and time', 'It makes the nights warmer', 'It points to the South Pole'], level === 1 ? 3 : 4),
      hint: 'Stars rise at the same time each year.', working: ['Stars return to the same place at the same time each year.', 'So their rising works like a calendar marker for the seasons.'],
      finalAnswer: 'It marks the time of year', skill: 'space-matariki-apply',
    }),
  ];

  K.topic({
    id: 'space-matariki', strand: 'earth', order: 0.19,
    name: 'Matariki', short: 'Matariki', animal: 'kiwi',
    blurb: 'The star cluster that marks Māori New Year — its story, its nine stars and why it matters.',
    example: 'Pōhutukawa: remembering those who have died',
    hint: 'Star cluster · Māori New Year · Maramataka (Moon calendar) · eyes of Tāwhirimātea.',
    learn: {
      what: '<p><b>Matariki</b> is a cluster of stars that many cultures have used to mark special times. In Aotearoa it marks the <b>Māori New Year</b> under the <b>Maramataka</b>, a lunar calendar that follows the Moon (the European Gregorian calendar follows the Sun). It is a time to remember, celebrate and plan — and since 2022 it is a public holiday. <i>Stories and traditions differ slightly between iwi.</i></p>',
      visual,
      facts: [
        'Name: <b>Ngā Mata o te Ariki Tāwhirimātea</b> — the eyes of the god Tāwhirimātea.',
        'Story: Tāwhirimātea (atua of the wind) was so upset that <b>Tāne Mahuta</b> (atua of the forest) separated his parents <b>Ranginui</b> and <b>Papatūānuku</b> that he tore out his eyes and threw them into the sky.',
        'Used by early <b>Polynesian navigators</b> to cross Moana-nui-a-Kiwa (the Pacific).',
        '<b>Celebrate:</b> gather whānau and friends, share kai, remember those who died in the past year, talk about hopes for the future, prepare the land. Go out early in the morning to see it rise before sunrise (mid-winter).',
        'Other names: the <b>Pleiades / Seven Sisters</b> (Greek), <b>Subaru</b> (Japan).',
      ].concat(STARS.map((s) => `<b>${s.n}</b> — ${s.m}.`)),
      steps: [
        'Say what it is: a star cluster marking the Māori New Year.',
        'Say why it is important: remembering, celebrating, planning; the calendar; navigation.',
        'For the star table, link each star to its part of life.',
      ],
      examples: [
        { q: 'What is Matariki and why is it important?', working: ['A star cluster whose rising marks the Māori New Year.', 'A time to remember those who passed, celebrate with whānau and plan for the year; used for the calendar and navigation.'], a: 'Star cluster → Māori New Year; remember, celebrate, plan' },
        { q: 'Where does the name come from?', working: ['Ngā Mata o te Ariki Tāwhirimātea = the eyes of the god Tāwhirimātea.', 'He threw his eyes into the sky in anger when his parents were separated.'], a: 'The eyes of Tāwhirimātea' },
        { q: 'Fill in the star table.', visual: K.table(['Star (whetū)', 'Meaning / significance'], STARS.map((s) => [s.n, s.m])), working: ['Learn them in pairs: two food stars, two water stars, two weather stars.', 'Plus Matariki (health), Pōhutukawa (the dead), Hiwa-i-te-rangi (wishes).'], a: 'See the table' },
        { q: 'What is the cluster called in other cultures?', working: ['Greek: the Pleiades or Seven Sisters.', 'Japan: Subaru.'], a: 'Pleiades / Seven Sisters / Subaru' },
        { q: 'How is the Maramataka different from our school calendar?', working: ['Maramataka: follows the Moon (lunar).', 'Gregorian: follows the Sun.'], a: 'Moon-based vs Sun-based' },
        { q: 'How did navigators use Matariki?', working: ['Stars rise and set at known points on the horizon.', 'Navigators used them to steer across the Pacific.'], a: 'To find direction across the ocean' },
      ],
      tips: [
        '<b>Tupuānuku</b> (nuku = earth) = food from the ground; <b>Tupuārangi</b> (rangi = sky) = food from the sky.',
        '<b>Waitī</b> = fresh water; <b>Waitā</b> = salt water (the sea).',
        'Pōhutukawa → those who have died. Hiwa-i-te-rangi → wishes.',
      ],
    },
    mcq, tf, groups, calc: [nameStarQ, nameStarQ, pairQ], word,
  });
})(window.HL);
