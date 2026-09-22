/* Harper Learning — practice session engine */
window.HL = window.HL || {};
(function (HL) {
  const R = HL.rng, S = HL.store;
  const DEFAULT_WORD_RATIO = 0.35;   // share of questions that are word problems; parents can change it

  class Session {
    /** cfg: { mode: 'topic'|'mixed'|'strand', topicIds: [], label, minutes, target } */
    constructor(cfg) {
      this.cfg = cfg;
      this.topicIds = cfg.topicIds.slice();
      this.target = cfg.target || 14;
      this.minutes = cfg.minutes || 15;
      this.startedAt = Date.now();
      // a resting (already-mastered) topic practised "anyway" is real practice, but it does not
      // pay candies — otherwise a fresh day would quietly undo the point of resting it at all
      this.noReward = !!cfg.noReward;
      this.pendingWorking = null;   // her drawn working for the CURRENT word question, set by the UI
      this.pendingSteps = null;     // her per-step checkpoint results for the CURRENT question, set by the UI
      this.history = [];          // { topicId, level, kind, firstTry, correct, attempts, prompt, isRedo }
      /* A wrong answer is marked wrong there and then — no second guess at the same numbers, which
       * is what let a lucky guess pay. Instead the working is shown and the SAME kind of question
       * comes straight back with different numbers, and she stays on it until she gets it right.
       * Those corrections are practice, not assessment: they never count towards the score. */
      this.redo = null;           // { topicId, skill, level, kind, lastPrompt, round }
      this.easedOff = false;      // set when a correction was let go, so the UI can say so kindly
      this.flaggedTopics = [];    // topic ids that needed three goes — surfaced to a grown-up
      this.levels = {};           // per-topic working level for this session
      this.streak = {};           // per-topic first-try streak (+) / fail streak (−)
      this.lastTopic = null;
      this.kindsSoFar = { calc: 0, word: 0 };
      this.current = null;
      this.attempt = 0;
      this.timeUp = false;
      this.minQuestions = S.settings().minQuestions || 8;   // a practice is not finished below this
      this.wordRatio = S.settings().wordRatio != null ? S.settings().wordRatio : DEFAULT_WORD_RATIO;
      this.pausedMs = 0; this.pauseStart = null;   // the clock stops during a break
      this.breakTaken = false;
      /* A child who is ahead of her year should not have to wade through the easy level of every
       * topic first. `startLevel` is where a topic she has never practised begins; once she has
       * history in it, her own working level takes over and adapts as usual. */
      const startLevel = Math.max(1, Math.min(3, S.settings().startLevel || 1));
      this.riseAfter = startLevel >= 2 ? 1 : 2;   // ahead: one right answer is enough to move up
      this.topicIds.forEach((id) => {
        const t = S.topic(id);
        const begin = t.attempts ? (t.level || 1) : startLevel;
        this.levels[id] = Math.max(1, Math.min(3, begin));
        this.streak[id] = 0;
      });
    }
    get count() { return this.history.length; }
    /* Corrections are extra practice on top of the practice, so they do not use up her questions:
     * a child who finds it hard would otherwise get a shorter, more harshly marked session than a
     * child who finds it easy. The clock still ends the session either way. */
    get scoredCount() { return this.history.filter((h) => !h.isRedo).length; }
    get elapsedMs() { return Date.now() - this.startedAt - this.pausedMs - (this.pauseStart ? Date.now() - this.pauseStart : 0); }
    pause() { if (!this.pauseStart) this.pauseStart = Date.now(); }
    resume() { if (this.pauseStart) { this.pausedMs += Date.now() - this.pauseStart; this.pauseStart = null; } }
    /** halfway through a practice long enough to be worth a breather */
    breakDue() { return !this.breakTaken && !this.redo && this.target >= 12 && this.scoredCount > 0 && this.scoredCount === Math.floor(this.target / 2); }
    get remainingMs() { return Math.max(0, this.minutes * 60000 - this.elapsedMs); }
    /** finished when the target is reached, or time is up AND the minimum number of questions is done */
    isFinished() { return (this.scoredCount >= this.target && !this.redo) || (this.timeUp && !this.redo && this.scoredCount >= this.minQuestions && !this.current); }
    /** how many more questions are needed before this practice counts for candies */
    shortBy() { return Math.max(0, this.minQuestions - this.scoredCount); }

    pickTopic() {
      if (this.topicIds.length === 1) return this.topicIds[0];
      const weights = this.topicIds.map((id) => {
        let w = 1 + S.weakness(id) * 2 + Math.min(S.daysSince(id), 14) / 7;
        if (id === this.lastTopic) w *= 0.15;
        const recent = this.history.slice(-4).filter((h) => h.topicId === id).length;
        w /= 1 + recent;
        return w;
      });
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return this.topicIds[i]; }
      return this.topicIds[this.topicIds.length - 1];
    }
    pickKind() {
      const n = this.count;
      const ratio = this.wordRatio;
      const wordShare = n ? this.kindsSoFar.word / n : 0;
      // hold the session near the chosen share, and never allow three word problems in a row
      const last = this.history[this.history.length - 1];
      const prev = this.history[this.history.length - 2];
      if (last && prev && last.kind === 'word' && prev.kind === 'word') return 'calc';
      if (last && last.kind === 'word' && ratio < 0.45) return 'calc';
      if (n >= 2 && wordShare < ratio - 0.05) return 'word';
      if (wordShare > ratio + 0.12) return 'calc';
      return R.chance(ratio) ? 'word' : 'calc';
    }
    next() {
      if (this.redo) {
        const q = this.sameSkillQuestion(this.redo);
        q.isRedo = true; q.redoRound = this.redo.round;
        this.current = q; this.attempt = 0; this.given = []; this.lastTopic = q.topicId;
        return q;
      }
      const topicId = this.pickTopic();
      const kind = this.pickKind();
      const level = this.levels[topicId] || 1;
      const q = HL.makeQuestion(topicId, level, kind);
      this.current = q; this.attempt = 0; this.given = []; this.lastTopic = topicId;
      return q;
    }
    /**
     * Another question of the same kind with different numbers. Most generators tag what they are
     * testing with `skill`; when one does not, any other question from the same topic and level is
     * near enough. Never hands back the identical question she just got wrong.
     */
    sameSkillQuestion(spec) {
      let fallback = null;
      for (let i = 0; i < 40; i++) {
        const q = HL.makeQuestion(spec.topicId, spec.level, spec.kind);
        if (q.prompt === spec.lastPrompt) continue;
        if (!fallback) fallback = q;
        if (!spec.skill || q.skill === spec.skill) return q;
      }
      return fallback || HL.makeQuestion(spec.topicId, spec.level, spec.kind);
    }
    /** returns { status: 'correct'|'reveal'|'empty'|'invalid', note, redo, easedOff } */
    answer(input) {
      const q = this.current; if (!q) throw new Error('no question');
      const m = HL.mark(q, input);
      if (m.empty) return { status: 'empty' };
      // a typo or the wrong shape of answer is not a wrong answer — ask again without marking it
      if (!m.ok && m.note && this.attempt === 0 && /Type a number|Write a fraction/.test(m.note)) return { status: 'invalid', note: m.note };
      this.attempt++;
      this.given.push(this.describeAnswer(input));
      if (m.ok) return this.markRight();
      return this.markWrong(m.note);
    }
    markRight() {
      const wasRedo = !!this.current.isRedo;
      this.finish(true);
      if (wasRedo) this.redo = null;          // the correction is done; back to new ground
      return { status: 'correct', firstTry: true, wasRedo };
    }
    /** Wrong is wrong: scored now, working shown, then the same kind of question with new numbers. */
    markWrong(note) {
      const q = this.current;
      const round = q.isRedo ? (this.redo ? this.redo.round : 1) + 1 : 1;
      // where the ORIGINAL scored attempt landed in history, so three misses in a row can flag
      // that first entry — captured before finish() pushes anything more onto the array
      const historyIndex = q.isRedo && this.redo ? this.redo.historyIndex : this.history.length;
      this.finish(false);
      // three goes at one idea is enough for one sitting — ease the level, flag it for a grown-up,
      // and move on kindly rather than trapping her on it
      if (round > 3) {
        this.redo = null;
        this.easedOff = true;
        const original = this.history[historyIndex];
        if (original) { original.flagged = true; original.redoAttempts = round - 1; }
        if (!this.flaggedTopics.includes(q.topicId)) this.flaggedTopics.push(q.topicId);
        return { status: 'reveal', note, redo: false, easedOff: true };
      }
      this.redo = { topicId: q.topicId, skill: q.skill || null, level: q.level, kind: q.kind, lastPrompt: q.prompt, round, historyIndex };
      return { status: 'reveal', note, redo: true, round };
    }
    /** what she typed or tapped, as readable text for the review sheet */
    describeAnswer(input) {
      const a = this.current.answer;
      if (a.type === 'choice') { const i = Number(input); return a.choices && a.choices[i] != null ? a.choices[i] : '(no answer)'; }
      const t = String(input == null ? '' : input).trim();
      return t === '' ? '(no answer)' : t;
    }
    /** "Show me how": the working now, and the same kind of question straight after */
    pass() { this.attempt++; this.given.push('(asked for help)'); return this.markWrong(null); }
    giveUp() { return this.pass(); }
    finish(correct) {
      const q = this.current; const id = q.topicId;
      const isRedo = !!q.isRedo;
      // A correction is practice at a question she has already been marked on. It goes in the
      // history so she can see it, but it is never scored — otherwise getting one wrong and the
      // next one right would quietly hand back the mark she just lost.
      const firstTry = correct && !isRedo;
      this.history.push({
        topicId: id, level: q.level, kind: q.kind, firstTry, correct, attempts: this.attempt,
        isRedo, redoRound: q.redoRound || 0,
        prompt: q.prompt, visual: q.visual || '', given: this.given.slice(),
        finalAnswer: q.finalAnswer, working: q.working || [],
        shownWorking: q.kind === 'word' ? (this.pendingWorking || '') : '',
        shownSteps: q.kind === 'word' ? (this.pendingSteps || []) : [],
      });
      this.pendingWorking = null;
      this.pendingSteps = null;
      this.kindsSoFar[q.kind]++;
      // adapt the level on what she does, corrections included — they are real evidence
      if (correct) {
        this.streak[id] = Math.max(0, this.streak[id]) + 1;
        if (!isRedo && this.streak[id] >= (this.riseAfter || 2) && this.levels[id] < 3) { this.levels[id]++; this.streak[id] = 0; }
      } else {
        this.streak[id] = Math.min(0, this.streak[id]) - 1;
        if (this.streak[id] <= -2 && this.levels[id] > 1) { this.levels[id]--; this.streak[id] = 0; }
      }
      if (!isRedo) S.record(id, { correct, firstTry, level: this.levels[id] });
      this.current = null;
    }
    summary() {
      // only the questions she was marked on count; the corrections after them are practice
      const scored = this.history.filter((h) => !h.isRedo);
      const redos = this.history.filter((h) => h.isRedo);
      const fixed = redos.filter((h) => h.correct).length;
      const total = scored.length, correct = scored.filter((h) => h.correct).length, firstTry = scored.filter((h) => h.firstTry).length;
      const byTopic = {};
      scored.forEach((h) => { const b = byTopic[h.topicId] || (byTopic[h.topicId] = { total: 0, correct: 0, firstTry: 0 }); b.total++; if (h.correct) b.correct++; if (h.firstTry) b.firstTry++; });
      const minutes = Math.round(this.elapsedMs / 60000 * 10) / 10;
      const stars = total === 0 ? 0 : firstTry / total >= 0.85 ? 3 : firstTry / total >= 0.65 ? 2 : firstTry / total >= 0.45 ? 1 : 0;
      // marked like a test: a question is right or it is not, so the mark is the first answer
      const secondTry = 0;
      const missed = total - correct;
      const marks = firstTry;
      const percent = total ? Math.round((marks / total) * 100) : 0;
      const mistakes = scored.filter((h) => !h.firstTry).map((h) => ({
        topicId: h.topicId, topicName: (HL.topics[h.topicId] || {}).name || h.topicId, level: h.level, kind: h.kind,
        prompt: h.prompt, visual: h.visual, given: h.given, answer: h.finalAnswer, working: h.working,
        gotThere: h.correct, flagged: !!h.flagged, redoAttempts: h.redoAttempts || 0, shownWorking: h.shownWorking || '',
        shownSteps: h.shownSteps || [],
      }));
      // three misses in a row on the same idea: worth a grown-up's attention, not just "she got it wrong"
      const flagged = mistakes.filter((m) => m.flagged);
      const flaggedTopics = this.flaggedTopics.map((id) => (HL.topics[id] || {}).name || id);
      return { total, correct, firstTry, secondTry, missed, marks, percent, mistakes, flagged, flaggedTopics, byTopic, minutes, stars,
               redos: redos.length, fixed, easedOff: this.easedOff,
               mode: this.cfg.mode, label: this.cfg.label, topics: Object.keys(byTopic) };
    }
  }
  HL.Session = Session;
})(window.HL);
