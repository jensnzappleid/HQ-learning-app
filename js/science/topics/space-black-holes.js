/* Topic: Black holes — what they are, how they form, why they are black, how dense they are,
 * how we know they exist, and (extension) gravitational waves.
 * Year 8 Cosmology LO9 (workbook) / notes LO8 + LO9 extension. */
(function (HL) {
  const K = HL.spaceKit, R = HL.rng, INK = K.INK;

  const visual = `<svg viewBox="0 0 340 140" width="340" height="140" xmlns="http://www.w3.org/2000/svg" font-family="inherit" font-size="10" font-weight="700">
    <rect x="2" y="2" width="336" height="136" rx="12" fill="#14213D"/>
    <circle cx="50" cy="60" r="34" fill="#E0568C" opacity=".85"/><text x="50" y="112" text-anchor="middle" fill="#FFFFFF">huge old star</text>
    <path d="M92 60 H118" stroke="#FFFFFF" stroke-width="2"/><text x="105" y="50" text-anchor="middle" fill="#F6C343">fuel</text><text x="105" y="76" text-anchor="middle" fill="#F6C343">runs out</text>
    <circle cx="150" cy="60" r="18" fill="#C9B8F0"/><text x="150" y="112" text-anchor="middle" fill="#FFFFFF">collapses</text>
    <path d="M150 34 v8 M150 86 v-8 M124 60 h8 M176 60 h-8" stroke="#FFFFFF" stroke-width="2"/>
    <text x="210" y="56" text-anchor="middle" fill="#A9D8F5">denser → stronger</text><text x="210" y="70" text-anchor="middle" fill="#A9D8F5">gravity → collapses more</text>
    <ellipse cx="290" cy="60" rx="34" ry="9" fill="#F6C343" opacity=".5"/><circle cx="290" cy="60" r="10" fill="#000000" stroke="#F6C343"/>
    <text x="290" y="112" text-anchor="middle" fill="#FFFFFF">black hole</text><text x="290" y="126" text-anchor="middle" fill="#A9D8F5">not even light escapes</text>
  </svg>`;

  const mcq = [
    { p: 'What is a <b>black hole</b>?', a: 'A super-squashed dead star whose gravity is so strong that not even light can escape', w: ['A hole in space with nothing in it', 'A dark planet', 'A cloud of black dust'], short: 'a collapsed star', accept: ['collapsed star', 'a super-squashed star', 'super squashed star', 'a dead star', 'dead star', 'a squashed star', 'squashed star', 'super-squashed star'], why: 'It is not actually a hole — it is a star squashed into a tiny space.' },
    { p: 'What kind of star can become a black hole?', a: 'A star much bigger than the Sun, when it runs out of fuel', w: ['Any star, including the Sun', 'Only small red stars', 'A planet that gets too hot'], why: 'Only very massive stars. The Sun is too small — it will become a white dwarf.' },
    { p: 'Why does a dying giant star keep collapsing?', a: 'As it collapses it gets denser, so its gravity gets stronger, which squashes it even more', w: ['Its magnetism pulls it apart', 'It cools and expands', 'Wind blows it in'], why: 'A runaway loop: collapse → denser → stronger gravity → more collapse.' },
    { p: 'Why are black holes <b>black</b>?', a: 'Their gravity is so strong that light cannot escape', w: ['They are painted black', 'They are very cold', 'They are covered in soot'], short: 'light cannot escape', accept: ['light can\'t escape', 'light cant escape', 'not even light can escape', 'gravity traps light', 'light can not escape', 'no light escapes'], why: 'If no light comes out, we see black.' },
    { p: 'In the notes, a star 10 times the size of the Sun collapses to about what size?', a: 'About 10 km across', w: ['About the size of Earth', 'About the size of the Sun', 'About 10 metres across'], why: 'Squashed down to roughly 10 km — the size of a city.' },
    { p: 'How heavy would a teaspoon of black hole material be (from your notes)?', a: 'About 100 000 tonnes — about the mass of everyone in NZ', w: ['About 1 kg', 'About as heavy as a car', 'Nothing — it is empty'], why: 'Unimaginably dense!' },
    { p: 'If the Earth were squashed as dense as a black hole, how big would it be?', a: 'About the size of a plum', w: ['About the size of the Moon', 'About the size of a house', 'The same size'], why: 'All of Earth\'s mass in something you could hold — that is how dense black holes are.' },
    { p: 'If we cannot see black holes, how do we know they are there?', a: 'We see stars orbiting something invisible, and gas glowing as it swirls in', w: ['We hear them buzzing', 'They show up as holes in photos of the Moon', 'Astronauts have visited one'], why: 'A single star orbiting "nothing" is probably orbiting a black hole. (Binary stars orbit each other like ice skaters.)' },
    { p: 'What are <b>binary stars</b>?', a: 'A pair of stars orbiting each other', w: ['Stars made of computer code', 'Two black holes', 'A star with two planets'], short: 'two stars orbiting each other', accept: ['pair of stars', 'a pair of stars', 'two stars', 'a pair of stars orbiting each other', 'pair of stars orbiting each other'], why: 'Like two ice skaters spinning holding hands.' },
    { p: 'Is a black hole really a hole?', a: 'No — it is matter squashed into a tiny space', w: ['Yes — it is empty space', 'Yes — a tunnel to another universe', 'Yes — a hole in a planet'], why: 'It is a super-squashed star, full of mass.' },
    { p: 'What would happen to a person who got too close to a black hole?', a: 'The huge gravity would stretch and squash them — notes say you\'d be about 0.001 mm tall', w: ['They would float away', 'Nothing at all', 'They would get bigger'], why: 'Extreme gravity squashes everything.' },
    { p: '<b>Extension:</b> what are gravitational waves?', a: 'Ripples in space itself, made when huge objects like black holes crash together', w: ['Waves in the ocean caused by the Moon', 'Sound waves in space', 'Radio signals from aliens'], short: 'ripples in space', accept: ['ripples in space-time', 'ripples in spacetime', 'ripples in space time', 'ripples', 'ripples in space itself'], why: 'First detected in 2015, from two black holes merging over a billion light years away.' },
    { p: 'What kind of star is NOT big enough to become a black hole?', a: 'A star like our Sun', w: ['A star 20 times bigger than the Sun', 'A red supergiant', 'A massive blue star'], why: 'The Sun will end as a white dwarf.' },
    { p: 'What is at the centre of the Milky Way?', a: 'A supermassive black hole', w: ['The Sun', 'The Earth', 'A giant planet'], why: 'Called Sagittarius A* — about 4 million times the mass of the Sun.' },
  ];
  const tf = [
    { s: 'A black hole is an empty hole in space.', t: false, why: 'It is a super-squashed star — packed with mass.' },
    { s: 'The Sun will become a black hole.', t: false, why: 'It is not massive enough; it will become a white dwarf.' },
    { s: 'Light cannot escape from a black hole.', t: true, why: 'That is why it is black.' },
    { s: 'Black holes are extremely dense.', t: true, why: 'A teaspoonful would weigh about 100 000 tonnes (notes).' },
    { s: 'We can see black holes directly with an ordinary telescope.', t: false, why: 'We find them by their effects: stars orbiting nothing visible, glowing gas swirling in.' },
    { s: 'A black hole\'s gravity gets weaker as it collapses.', t: false, why: 'Denser → <b>stronger</b> gravity.' },
    { s: 'Gravitational waves are ripples in space made by colliding black holes.', t: true, why: 'Detected for the first time in 2015.' },
  ];
  const groups = [
    { label: 'true about black holes', items: ['light cannot escape', 'they are extremely dense', 'they form from huge collapsing stars', 'their gravity is enormous'] },
    { label: 'a misconception about black holes', items: ['they are empty holes', 'the Sun will become one', 'we can see them easily', 'their gravity is weak'] },
  ];
  function loopQ(level) {
    const S = ['The star runs out of fuel', 'It starts to collapse', 'It gets denser and more squashed', 'Its gravity gets stronger', 'It collapses even more', 'A black hole forms'];
    const k = R.int(0, S.length - 2);
    return {
      prompt: `How a black hole forms: what comes straight after "<b>${S[k]}</b>"?`,
      answer: K.choice(S[k + 1], S.filter((x) => x !== S[k]), level === 1 ? 3 : 4),
      hint: 'Fuel out → collapse → denser → stronger gravity → collapse more → black hole.',
      working: S.map((x, i) => `${i + 1}. ${x}`),
      finalAnswer: S[k + 1], skill: 'space-black-holes-forming',
    };
  }
  function densityQ(level) {
    const spoons = R.pick([2, 3, 5, 10]);
    if (R.chance(0.5)) {
      return {
        prompt: `One teaspoon of black hole material weighs about <b>100 000 tonnes</b> (your notes). How many tonnes would <b>${spoons} teaspoons</b> weigh?`,
        answer: K.num(100000 * spoons, 'tonnes'), hint: 'Multiply.', working: [`100 000 × ${spoons} = <b>${K.big(100000 * spoons)}</b> tonnes.`],
        finalAnswer: `${K.big(100000 * spoons)} tonnes`, skill: 'space-black-holes-density',
      };
    }
    const km = R.pick([10, 20, 40]);
    return {
      prompt: `A collapsed star is <b>${km} km</b> across. The Sun is about 1 400 000 km across. How many times wider is the Sun?`,
      answer: K.num(1400000 / km, 'times'), hint: 'Divide the Sun\'s width by the collapsed star\'s width.',
      working: [`1 400 000 ÷ ${km} = <b>${K.big(1400000 / km)}</b> times wider.`], finalAnswer: K.big(1400000 / km), skill: 'space-black-holes-density',
    };
  }
  const word = [
    (level) => ({
      prompt: 'Astronomers see a star moving round and round in a circle, but there is nothing visible in the middle. What is the best explanation?',
      answer: K.choice('It is probably orbiting a black hole', ['It is orbiting the Earth', 'The telescope is broken', 'It is orbiting a planet that is too dark'], level === 1 ? 3 : 4),
      hint: 'Something with huge gravity that gives out no light.', working: ['Something must be pulling it round.', 'Huge gravity + no light = a black hole.'],
      finalAnswer: 'A black hole', skill: 'space-black-holes-apply',
    }),
    (level) => ({
      prompt: 'A movie shows a black hole "sucking in" everything in the whole galaxy. What is wrong with that?',
      answer: K.choice('A black hole only has extreme pull very close to it; far away its gravity is like any object with the same mass', ['Nothing — black holes suck in everything everywhere', 'Black holes push things away', 'Black holes have no gravity'], level === 1 ? 3 : 4),
      hint: 'If the Sun became a black hole of the same mass, would Earth fall in?', working: ['Gravity depends on mass and distance.', 'Far away, a black hole pulls like any star of the same mass. Only very close is it deadly.'],
      finalAnswer: 'Its pull is only extreme up close', skill: 'space-black-holes-apply',
    }),
    (level) => ({
      prompt: 'Harper asks: "Will the Sun become a black hole one day?" What should you tell her?',
      answer: K.choice('No — only stars much bigger than the Sun do. The Sun will become a red giant, then a white dwarf', ['Yes, in 10 years', 'Yes, all stars do', 'It already is one'], level === 1 ? 3 : 4),
      hint: 'Which stars collapse into black holes?', working: ['Black holes come from stars much more massive than the Sun.', 'The Sun → red giant → white dwarf.'],
      finalAnswer: 'No — too small', skill: 'space-black-holes-apply',
    }),
  ];

  K.topic({
    id: 'space-black-holes', strand: 'earth', order: 0.18,
    name: 'Black holes', short: 'Black holes', animal: 'owl',
    blurb: 'Super-squashed stars so dense that not even light escapes — and how we find them.',
    example: 'Black = gravity so strong light cannot escape',
    hint: 'Huge star, fuel out → collapses → denser → stronger gravity → black hole. Not a hole!',
    learn: {
      what: '<p>A <b>black hole</b> forms when a star <b>much bigger than the Sun</b> runs out of fuel and collapses. The more it collapses, the denser it gets and the stronger its gravity, so it collapses even more. In the end its gravity is so strong that <b>not even light can escape</b> — so it is black. It is not a hole: it is a super-squashed star.</p>',
      visual,
      facts: [
        'Formation: old massive star → fuel runs out → collapses → denser → <b>stronger gravity</b> → collapses more (a runaway loop).',
        'A star 10 times the size of the Sun can collapse to about <b>10 km</b> across.',
        '<b>Black</b> because light cannot escape its gravity.',
        '<b>Density:</b> a teaspoon ≈ 100 000 tonnes (as heavy as everyone in NZ); Earth squashed that much would be the size of a <b>plum</b>.',
        '<b>Evidence:</b> stars orbiting something invisible (binary stars normally orbit each other in pairs), and gas glowing hot as it swirls in.',
        'There is a <b>supermassive black hole</b> at the centre of the Milky Way.',
        '<b>Extension — gravitational waves:</b> ripples in space itself, made when black holes collide. First detected in 2015.',
      ],
      steps: [
        'Explain what: a super-squashed dead star with huge gravity.',
        'Explain how it forms: the collapse loop.',
        'Explain why it is black: light cannot escape.',
        'Explain how we know: effects on things around it.',
      ],
      examples: [
        { q: 'Explain how a black hole forms.', working: ['A star much bigger than the Sun gets old and runs out of fuel.', 'It collapses; it gets denser so its gravity increases, squashing it more.', 'It ends up tiny and incredibly dense — a black hole.'], a: 'A massive star collapses under its own gravity' },
        { q: 'Why are they called black holes?', working: ['Their gravity is so strong that light cannot escape.', 'No light comes out, so they look black.'], a: 'Light cannot escape' },
        { q: 'How dense is a black hole?', working: ['A teaspoon would weigh about 100 000 tonnes.', 'Earth squashed that much would be the size of a plum.'], a: 'Unimaginably dense' },
        { q: 'How do we know black holes exist if we can\'t see them?', working: ['Sometimes a single star seems to orbit nothing.', 'It is probably orbiting a black hole.'], a: 'Stars orbiting something invisible' },
        { q: 'Is a black hole really a hole?', working: ['No. It is all the matter of a star squashed into a tiny space.'], a: 'No — a super-squashed star' },
        { q: 'What are gravitational waves? (extension)', working: ['Ripples in space itself.', 'Made when huge objects like black holes crash together; first detected in 2015.'], a: 'Ripples in space from colliding black holes' },
      ],
      tips: [
        'Say "super-squashed star", never "a hole with nothing in it".',
        'Only <b>massive</b> stars make black holes — not the Sun.',
        'The key word in every answer: <b>gravity</b>.',
      ],
    },
    mcq, tf, groups, calc: [loopQ, loopQ, densityQ], word,
  });
})(window.HL);
