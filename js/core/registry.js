/* Harper Learning — topic registry + question schema.
 *
 * A TOPIC is registered with HL.registerTopic({...}):
 * {
 *   id: 'fractions-add-sub',            // kebab-case, unique
 *   subject: 'maths',                    // 'maths' | 'science'
 *   strand: 'number',                    // maths: number | algebra | measurement | geometry | statistics | probability
 *   order: 6,                            // sort order inside the strand
 *   name: 'Adding & subtracting fractions',
 *   short: 'Fractions + −',              // ≤ 18 chars, used on small chips
 *   blurb: 'Make the bottoms the same, then add the tops.',   // one friendly sentence — what is this topic about?
 *   example: '2/3 + 1/4 = 11/12',        // a one-line example so Harper recognises the topic at a glance (plain text or html)
 *   animal: 'bunny',                     // key of HL.animals (see js/art/animals.js)
 *   learn: {
 *     what: '<p>html</p>',               // 2–4 sentences: what it is and why it matters
 *     visual: '<svg…>',                  // REQUIRED concept diagram (SVG, viewBox ≤ 360×220): the picture that explains the idea
 *     facts?: ['html', 'html'],          // 2–6 key facts / formulas / rules shown as cards (e.g. 'Area of triangle = <b>½ × base × height</b>')
 *     steps: ['html', 'html'],           // the technique, as numbered steps
 *     examples: [{ q: 'html', working: ['html', 'html'], a: 'html', visual?: '<svg…>' }],   // 5–6 fully worked examples, easy → hard, at least one word problem; add a small diagram where it helps
 *     tips: ['html'],                    // common mistakes / memory hooks
 *   },
 *   generate(level, kind) => Question    // level 1 (easy) | 2 (typical Year 8) | 3 (hard); kind 'calc' | 'word'
 * }
 *
 * A QUESTION returned by generate():
 * {
 *   prompt: 'html',                      // the question. Use HL.num.fracHtml for stacked fractions, <sup> for powers.
 *   visual?: 'html',                     // optional SVG/HTML diagram shown above the prompt (angles, grids, shapes, charts)
 *   answer: {
 *     type: 'number' | 'fraction' | 'text' | 'choice',
 *     value: 12 | {n:3,d:4} | 'isosceles' | 2,        // number; fraction {n,d} (simplest form); text string; choice = index into choices
 *     tolerance?: 0.01,                  // number: |input − value| ≤ tolerance counts (default 1e-6). Use when rounding is expected.
 *     accept?: ['iso', 'isosceles triangle'],   // text: extra accepted spellings (case-insensitive)
 *     choices?: ['html', 'html', 'html', 'html'],   // choice: 3–4 options (shown as big buttons)
 *     allowUnsimplified?: true,          // fraction: accept equivalent fractions (default: must be simplest form, mixed or improper both OK)
 *     unit?: 'cm²',                      // shown next to the input box so the student does not type units
 *     placeholder?: 'e.g. 3/4'
 *   },
 *   hint: 'html',                        // shown after the FIRST wrong attempt — a nudge, not the answer
 *   working: ['html', 'html', 'html'],   // shown after the SECOND wrong attempt — the full method, one step per item
 *   finalAnswer: 'html',                 // pretty version of the answer, shown with the working
 *   skill?: 'add-unlike'                 // optional sub-skill tag for progress
 * }
 *
 * Rules for generators (important for Harper):
 *  - Numbers must be randomised EVERY call so answers cannot be memorised, but stay "nice" (integers / terminating decimals unless the topic is about rounding).
 *  - 'calc' = pure computation, 'word' = a short real-life word problem (NZ context: $, km, netball, kiwi, school, GST 15%).
 *  - Keep prompts short. One instruction. No trick questions. Say what form the answer should be in ("Give your answer as a fraction in simplest form").
 *  - Level 1 should be genuinely easy (confidence), level 3 genuinely Year 8-hard.
 */
window.HL = window.HL || {};
(function (HL) {
  HL.topics = HL.topics || {};
  /** the app runs one subject at a time; the page sets HL.subject before HL.boot() */
  HL.subject = HL.subject || 'maths';
  HL.strandsBySubject = {
    maths: {
    number:      { name: 'Number',      colour: 'pink',     animal: 'bunny',    blurb: 'Whole numbers, fractions, decimals, percentages, ratios' },
    algebra:     { name: 'Algebra',     colour: 'lavender', animal: 'cat',      blurb: 'Patterns, expressions and equations' },
    measurement: { name: 'Measurement', colour: 'peach',    animal: 'fox',      blurb: 'Units, perimeter, area, volume, time' },
    geometry:    { name: 'Geometry',    colour: 'sky',      animal: 'penguin',  blurb: 'Angles, shapes, transformations' },
    statistics:  { name: 'Statistics',  colour: 'mint',     animal: 'frog',     blurb: 'Averages and data displays' },
      probability: { name: 'Probability', colour: 'butter',   animal: 'chick',    blurb: 'How likely is it?' },
    },
    science: {
      living:   { name: 'Living World',        colour: 'leaf',   animal: 'kiwi',    blurb: 'Cells, bodies, plants, animals and where they live' },
      material: { name: 'Material World',      colour: 'grape',  animal: 'gecko',   blurb: 'What stuff is made of, and how it changes' },
      physical: { name: 'Physical World',      colour: 'sky',    animal: 'owl',     blurb: 'Forces, energy, light, sound and electricity' },
      earth:    { name: 'Planet Earth & Space', colour: 'clay',  animal: 'whale',   blurb: 'Our planet, the weather, and what is out in space' },
      nature:   { name: 'Working like a Scientist', colour: 'butter', animal: 'bee', blurb: 'Fair tests, measuring and explaining what you found' },
    },
  };
  HL.strands = HL.strandsBySubject.maths;
  HL.useSubject = function (subject) {
    HL.subject = subject;
    HL.strands = HL.strandsBySubject[subject] || HL.strandsBySubject.maths;
  };
  HL.registerTopic = function (t) {
    if (!t || !t.id) throw new Error('topic needs an id');
    t.subject = t.subject || 'maths';
    const strands = HL.strandsBySubject[t.subject];
    if (!strands || !strands[t.strand]) console.warn('unknown strand', t.strand, t.id);
    HL.topics[t.id] = t;
  };
  HL.topicList = function (subject) {
    subject = subject || HL.subject;
    const strandOrder = Object.keys(HL.strandsBySubject[subject] || HL.strands);
    return Object.values(HL.topics)
      .filter((t) => t.subject === subject)
      .sort((a, b) => strandOrder.indexOf(a.strand) - strandOrder.indexOf(b.strand) || (a.order || 0) - (b.order || 0));
  };
  /** "a omnivore" -> "an omnivore". Skips u- words (a unit, a use), steps over html tags, and leaves
   *  labels alone ("shape A and B", "angle a is 40") by never touching these following words. */
  const NOT_A_NOUN = /^(and|or|is|are|was|were|at|in|it|its|of|as|on|off|above|below|after|before|each|every|all|any|equals?|also|answer)$/i;
  const AN = /\b([aA]) ((?:<[^>]*>)*)([A-Za-z']+)/g;
  const fixArticles = (t) => (typeof t !== 'string' ? t : t.replace(AN, (m, a, tags, word) =>
    (/^[aeio]/i.test(word) && !NOT_A_NOUN.test(word) ? (a === 'A' ? 'An ' : 'an ') + tags + word : m)));
  const tidy = (q) => {
    q.prompt = fixArticles(q.prompt);
    q.hint = fixArticles(q.hint);
    q.finalAnswer = fixArticles(q.finalAnswer);
    if (Array.isArray(q.working)) q.working = q.working.map(fixArticles);
    if (q.answer && Array.isArray(q.answer.choices)) q.answer.choices = q.answer.choices.map(fixArticles);
    return q;
  };

  /** Safely generate a question; retries a few times if a generator throws or returns junk. */
  HL.makeQuestion = function (topicId, level, kind) {
    const t = HL.topics[topicId];
    if (!t) throw new Error('no topic ' + topicId);
    let last;
    for (let i = 0; i < 5; i++) {
      try {
        const q = t.generate(level, kind);
        if (q && q.prompt && q.answer && q.answer.type) {
          q.topicId = topicId; q.level = level; q.kind = kind;
          q.working = q.working || [];
          return tidy(q);
        }
      } catch (e) { last = e; console.error('generator error', topicId, level, kind, e); }
    }
    throw last || new Error('bad generator ' + topicId);
  };
})(window.HL);
