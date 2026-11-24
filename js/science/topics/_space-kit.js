/* Shared question engine for the Year 8 Cosmology topics (space-*.js).
 * Not a topic itself. The file name starts with "_" so it loads before the topics that use it
 * (the page lists it first, and the node checker loads files in name order).
 *
 * A space topic is mostly a fact bank:
 *   mcq    [{ p, a, w: [wrong answers], why, short?, accept?, vis? }]   pick-the-answer, or typed when `short` is given
 *   tf     [{ s, t: true|false, why }]                                    true / false statements (the classic misconceptions)
 *   groups [{ label, items: [], distractorOnly? }]                        "Which of these is <label>?" and "...is NOT <label>?"
 *          (a distractorOnly group, e.g. "NOT evidence…", only supplies wrong answers)
 *   calc   [(level) => question]                                          number work (light years, light time, scale)
 *   word   [(level) => question]                                          everyday situations, applied
 */
window.HL = window.HL || {};
(function (HL) {
  const R = HL.rng;
  const K = {};
  K.INK = '#4A4033';

  K.choice = function (correct, wrongs, n) {
    const pool = wrongs.filter((w) => w !== correct);
    const opts = [correct].concat(R.sample(pool, Math.min((n || 4) - 1, pool.length)));
    const shuffled = R.shuffle(opts);
    return { type: 'choice', value: shuffled.indexOf(correct), choices: shuffled };
  };
  /** choices kept in the order given (True/False, smallest→largest lists) */
  K.fixed = (choices, correct) => ({ type: 'choice', value: choices.indexOf(correct), choices: choices.slice() });
  K.text = (value, accept, placeholder) => ({ type: 'text', value, accept: accept || [], placeholder: placeholder || 'type your answer' });
  K.num = (value, placeholder, tolerance) => {
    const a = { type: 'number', value, placeholder: placeholder || 'type a number' };
    if (tolerance != null) a.tolerance = tolerance;
    return a;
  };
  K.table = (head, rows) => `<table class="data"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
    rows.map((r) => `<tr>${r.map((c) => (c === null ? '<td style="background:#FFE7A8;font-weight:800">?</td>' : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;
  /** 9500000 -> "9 500 000" (NZ school style, a space every three digits) */
  K.big = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function mcqQ(t, it, level) {
    return {
      prompt: it.p, visual: it.vis,
      answer: K.choice(it.a, it.w, level === 1 ? 3 : 4),
      hint: it.hint || t.hint,
      working: [].concat(it.why || ('The answer is: ' + it.a)),
      finalAnswer: it.a, skill: t.id + '-facts',
    };
  }
  function typedQ(t, it) {
    return {
      prompt: it.p + ' <span class="muted">(type a word or two)</span>', visual: it.vis,
      answer: K.text(it.short, it.accept),
      hint: it.hint || t.hint,
      working: [].concat(it.why || ('The answer is: ' + it.a)),
      finalAnswer: it.short, skill: t.id + '-recall',
    };
  }
  function tfQ(t, it) {
    return {
      prompt: '<b>True or false?</b> ' + it.s,
      answer: K.fixed(['True', 'False'], it.t ? 'True' : 'False'),
      hint: 'Check every word. One wrong word makes the whole sentence false.',
      working: [(it.t ? '<b>True.</b> ' : '<b>False.</b> ') + it.why],
      finalAnswer: it.t ? 'True' : 'False', skill: t.id + '-misconceptions',
    };
  }
  function groupQ(t, level) {
    const gs = t.groups;
    const g = R.pick(gs.filter((x) => !x.distractorOnly));
    const others = gs.filter((x) => x !== g).flatMap((x) => x.items).filter((x) => !g.items.includes(x));
    if (level >= 2 && g.items.length >= 3 && R.chance(0.5)) {
      const odd = R.pick(others);
      const ins = R.sample(g.items, 3);
      const owner = gs.find((x) => x.items.includes(odd));
      return {
        prompt: `Which of these is <b>NOT</b> ${g.label}?`,
        answer: K.choice(odd, ins, 4),
        hint: 'Three of them belong together. Find the one that does not fit — and be ready to say why.',
        working: [`${ins.map((x) => '"' + x + '"').join(', ')} are all ${g.label}.`, `"${odd}" is ${owner ? owner.label : 'something else'}.`],
        finalAnswer: odd, skill: t.id + '-sort',
      };
    }
    const right = R.pick(g.items);
    return {
      prompt: `Which of these is ${g.label}?`,
      answer: K.choice(right, others, level === 1 ? 3 : 4),
      hint: t.hint,
      working: [`"${right}" is ${g.label}.`, ...(g.why ? [g.why] : [])],
      finalAnswer: right, skill: t.id + '-sort',
    };
  }

  /** registers a topic from a fact bank. cfg = everything registerTopic needs + mcq/tf/groups/calc/word */
  K.topic = function (cfg) {
    const t = cfg;
    const mcq = cfg.mcq || [], tf = cfg.tf || [], calc = cfg.calc || [], word = cfg.word || [];
    const typed = mcq.filter((x) => x.short);
    const wMcq = cfg.weights && cfg.weights.mcq != null ? cfg.weights.mcq : 5;
    const wTyped = cfg.weights && cfg.weights.typed != null ? cfg.weights.typed : 2;
    const wTf = cfg.weights && cfg.weights.tf != null ? cfg.weights.tf : 2;
    const wGroup = cfg.weights && cfg.weights.group != null ? cfg.weights.group : 2;
    const wCalc = cfg.weights && cfg.weights.calc != null ? cfg.weights.calc : 3;
    HL.registerTopic(Object.assign({}, cfg, {
      subject: 'science',
      generate(level, kind) {
        if (kind === 'word' && word.length) return R.pick(word)(level);
        const bag = [];
        const add = (w, f) => { for (let i = 0; i < w; i++) bag.push(f); };
        if (mcq.length) add(wMcq, () => mcqQ(t, R.pick(mcq), level));
        if (typed.length && level >= 2) add(wTyped, () => typedQ(t, R.pick(typed)));
        if (tf.length) add(wTf, () => tfQ(t, R.pick(tf)));
        if (cfg.groups && cfg.groups.length > 1) add(wGroup, () => groupQ(t, level));
        if (calc.length) add(wCalc, () => R.pick(calc)(level));
        if (kind === 'word' && !word.length) return R.pick(bag)();
        return R.pick(bag)();
      },
    }));
  };
  HL.spaceKit = K;
})(window.HL);
