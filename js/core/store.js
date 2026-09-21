/* Harper Learning — progress + settings in localStorage */
window.HL = window.HL || {};
(function (HL) {
  const SUBJECT = (window.HL && window.HL.subject) || 'maths';

  /* ---------- who is practising ----------
   * More than one child can use the same app. Each one gets her own copy of everything —
   * progress, streak, candy jars, money box, settings — by putting her id on the end of every
   * storage key. The first child keeps the plain keys, so nothing of hers ever has to move. */
  const PROFILE_KEY = 'harper-learning-profile';      // who is practising right now
  const PROFILES_KEY = 'harper-learning-profiles';    // the list of children
  const DEFAULT_PROFILE = 'default';
  const cleanId = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
  const readRaw = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  function profileList() {
    try {
      const l = JSON.parse(readRaw(PROFILES_KEY) || 'null');
      if (Array.isArray(l) && l.length) return l.filter((x) => x && x.id);
    } catch (e) {}
    return [{ id: DEFAULT_PROFILE, name: 'Harper' }];
  }
  /** ?who=heidi in the address wins, so each child can have her own bookmark */
  function startingProfile() {
    let want = '';
    try { want = cleanId(new URLSearchParams(window.location.search).get('who')); } catch (e) {}
    const known = profileList().map((x) => x.id);
    if (want && known.indexOf(want) >= 0) return want;
    const saved = cleanId(readRaw(PROFILE_KEY));
    return saved && known.indexOf(saved) >= 0 ? saved : DEFAULT_PROFILE;
  }
  const PROFILE = startingProfile();
  const suffix = PROFILE === DEFAULT_PROFILE ? '' : '@' + PROFILE;
  const KEY = 'harper-learning-v1' + (SUBJECT !== 'maths' ? '-' + SUBJECT : '') + suffix;   // per subject, per child
  const SHARED_KEY = 'harper-learning-shared-v1' + suffix;                                  // this child's settings and jars
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const REST_DAYS = 3;   // a topic she has mastered stays out of the picker's main list for this long
  const blank = () => ({
    topics: {},        // id -> { attempts, correct, firstTry, level, lastPractised, stars }
    sessions: [],      // { date, mode, label, total, correct, firstTry, minutes, topics: [ids] }
    days: [],          // iso dates practised
    flagsSeenAt: '',    // ISO date; flagged mistakes from sessions after this are still "new" for a parent
    hints: [],          // skill (or topic) ids that have already shown their guided first-step hint
    mix: [],           // the last custom mix, per subject (a maths mix must not replace a science one)
    // the candy jar: each finished practice pays 0-3 candies; `candyGoal` candies win the prize
    candy: { jar: 0, lifetime: 0, earned: [], paidDay: '', paidTopics: [] },   // earned: [{date, prize, paid}]
    settings: { minutes: 25, questions: 20, keypad: true, sounds: true, theme: 'system', name: 'Harper', bigText: false,
                candyGoal: 9, prize: '$5', minQuestions: 8, breaks: true, wordRatio: 0.35, startLevel: 1, candySplit: true, settingsVersion: 5 },
  });
  let data = blank();
  const readJson = (key) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } };

  /* ---------- splitting the candy jar into one per subject ----------
   * The jar used to be shared. Harper has already earned candies in both subjects, so the split
   * must not invent a number: each subject's jar is rebuilt by replaying that subject's own saved
   * practices under the same award rule that paid them out in the first place. Two guarantees:
   * the candies collected altogether never go down, and no prize she has already won disappears. */
  const SUBJECT_KEYS = { maths: 'harper-learning-v1' + suffix, science: 'harper-learning-v1-science' + suffix };
  const dayOf = (iso) => String(iso || '').slice(0, 10);
  const candiesFor = (total, correct, firstTry) => {
    if (!total) return 0;
    const ft = firstTry / total, acc = correct / total;
    return ft >= 0.85 ? 3 : ft >= 0.65 ? 2 : acc >= 0.5 ? 1 : 0;
  };
  /** Replay one subject's practices oldest-first, exactly as the jar would have paid them. */
  function replayJar(sessions, goal, minQ, prizeName) {
    const out = { jar: 0, lifetime: 0, earned: [] };
    (sessions || []).slice()
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
      .forEach((s) => {
        const total = Number(s.total) || 0;
        if (total < minQ) return;                       // too short to have earned anything
        const n = candiesFor(total, Number(s.correct) || 0, Number(s.firstTry) || 0);
        out.jar += n; out.lifetime += n;
        while (out.jar >= goal) { out.jar -= goal; out.earned.unshift({ date: s.date, prize: prizeName, paid: false }); }
      });
    return out;
  }
  /** Runs once. Writes a jar into every subject's own record and archives the shared one. */
  function splitCandyJars(settings, sharedCandy) {
    const goal = settings.candyGoal || 9, minQ = settings.minQuestions || 8;
    const names = Object.keys(SUBJECT_KEYS);
    const recs = {}, jars = {};
    names.forEach((n) => {
      recs[n] = readJson(SUBJECT_KEYS[n]) || null;
      jars[n] = replayJar(recs[n] && recs[n].sessions, goal, minQ, settings.prize || '$5');
    });
    // If the history has been trimmed, the replay can come to less than she actually collected.
    // Never let the total drop: hand the difference back, split by how much each subject earned.
    const replayed = names.reduce((a, n) => a + jars[n].lifetime, 0);
    const short = Math.max(0, (Number(sharedCandy && sharedCandy.lifetime) || 0) - replayed);
    if (short > 0) {
      const weights = names.map((n) => (replayed ? jars[n].lifetime / replayed : 1 / names.length));
      let given = 0;
      names.forEach((n, i) => {
        const add = i === names.length - 1 ? short - given : Math.round(short * weights[i]);
        given += add; jars[n].lifetime += add; jars[n].jar += add;
        while (jars[n].jar >= goal) { jars[n].jar -= goal; jars[n].earned.unshift({ date: new Date().toISOString(), prize: settings.prize || '$5', paid: false }); }
      });
    }
    // Carry the old prizes across: match each rebuilt prize to the one she was actually given on
    // that day so a prize already handed over stays marked paid, and keep any that did not match
    // so the number of prizes she has won can only go up.
    const old = ((sharedCandy && sharedCandy.earned) || []).slice();
    const used = old.map(() => false);
    names.forEach((n) => jars[n].earned.forEach((p) => {
      const i = old.findIndex((o, k) => !used[k] && dayOf(o.date) === dayOf(p.date));
      if (i >= 0) { used[i] = true; p.paid = !!old[i].paid; p.prize = old[i].prize || p.prize; }
    }));
    // Keep her prize count where it was: the rebuilt prizes and the old list describe the same
    // wins counted two ways, so the answer is the larger of the two, never the sum.
    const rebuilt = names.reduce((a, n) => a + jars[n].earned.length, 0);
    const want = Math.max(rebuilt, old.length);
    const spare = old.filter((o, k) => !used[k])
      .sort((a, b) => (b.paid ? 1 : 0) - (a.paid ? 1 : 0) || new Date(b.date || 0) - new Date(a.date || 0));
    const leftovers = spare.slice(0, Math.max(0, want - rebuilt));   // prizes already handed over come first
    // Any old prize we are NOT carrying over describes a win the rebuilt list already covers. If it
    // had been paid, move that paid mark onto a rebuilt prize, so a prize she was actually given
    // never comes back saying it is still waiting.
    let paidCarry = spare.slice(leftovers.length).filter((o) => o.paid).length;
    if (paidCarry) {
      names.forEach((n) => jars[n].earned.slice().reverse().forEach((prz) => {   // oldest first
        if (paidCarry > 0 && !prz.paid) { prz.paid = true; paidCarry--; }
      }));
    }
    if (leftovers.length) {
      // give each unmatched prize to the subject that was being practised around that date
      leftovers.forEach((o) => {
        let best = names[0], bestGap = Infinity;
        names.forEach((n) => {
          (recs[n] && recs[n].sessions || []).forEach((s) => {
            const gap = Math.abs(new Date(s.date || 0) - new Date(o.date || 0));
            if (gap < bestGap) { bestGap = gap; best = n; }
          });
        });
        jars[best].earned.push(Object.assign({}, o));
      });
      names.forEach((n) => jars[n].earned.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)));
    }
    names.forEach((n) => {
      const rec = recs[n] || blank();
      rec.candy = jars[n];
      try { localStorage.setItem(SUBJECT_KEYS[n], JSON.stringify(rec)); } catch (e) {}
    });
    return jars;
  }

  const load = () => {
    data = blank();
    let storedVersion = 5;   // a fresh install starts at the current version
    // the per-subject record. Read on its own: if it is ever corrupt we lose topic history,
    // but the candy jar lives in the shared record and must survive that.
    const parsed = readJson(KEY);
    if (parsed) {
      storedVersion = (parsed.settings && parsed.settings.settingsVersion) || 1;
      data = Object.assign(blank(), parsed);
    }
    // settings are shared across subjects; the candy jar is NOT — each subject fills its own
    const sh = readJson(SHARED_KEY);
    let sharedCandy = null;
    if (sh) {
      storedVersion = (sh.settings && sh.settings.settingsVersion) || storedVersion;
      if (sh.settings) data.settings = sh.settings;
      if (sh.candy) sharedCandy = sh.candy;            // pre-v5: one jar for both subjects
    } else if (parsed) {
      try { localStorage.setItem(SHARED_KEY, JSON.stringify({ settings: data.settings })); } catch (e) {}
    }
    data.settings = Object.assign(blank().settings, data.settings || {});
    data.candy = Object.assign(blank().candy, data.candy || {});
    // the mirrored jar. `lifetime` only ever goes up, so the bigger of the two is the newer one.
    const mirror = sh && sh.jars && sh.jars[SUBJECT];
    if (mirror && (Number(mirror.lifetime) || 0) > (Number(data.candy.lifetime) || 0)) {
      data.candy = Object.assign(blank().candy, mirror);
    }
    if (!Array.isArray(data.mix)) data.mix = [];
    // v2: practices used to be 15 minutes / 14 questions, which turned out to be too short
    if (storedVersion < 2) { data.settings.minutes = 25; data.settings.questions = 20; }
    // v3: sound used to default to off, so devices that opened an earlier build had it stored as off
    if (storedVersion < 3) data.settings.sounds = true;
    // v4: the last custom mix used to sit in the shared settings, so a maths mix replaced the science
    // one. It is per subject now — keep the old value only if every topic in it belongs to this subject.
    if (storedVersion < 4) {
      const old = (data.settings || {}).lastMix;
      if (!data.mix.length && Array.isArray(old) && old.length && old.every((id) => HL.topics && HL.topics[id])) data.mix = old.slice();
    }
    if (data.settings.lastMix) delete data.settings.lastMix;
    // v5: the jar used to be shared. Give each subject its own, rebuilt from its own practices.
    if (storedVersion < 5 || (sharedCandy && !data.settings.candySplit)) {
      const jars = splitCandyJars(data.settings, sharedCandy);
      data.candy = Object.assign(blank().candy, jars[SUBJECT] || {});
      data.settings.candySplit = true;
      // keep the old shared jar as a record, so the split can always be checked or undone
      try {
        localStorage.setItem(SHARED_KEY, JSON.stringify({
          settings: Object.assign({}, data.settings, { settingsVersion: 5 }),
          jars: jars,
          candyBeforeSplit: sharedCandy || null,
        }));
      } catch (e) {}
    }
    if (storedVersion < 5) { data.settings.settingsVersion = 5; save(); }
  };
  const save = () => {
    // Settings are shared between subjects; the jar belongs to this subject and rides in its record.
    // The jar is also mirrored into the shared record, which is small and so almost never fails to
    // write: two copies in two keys, so one unreadable record cannot cost Harper her candies.
    const prev = readJson(SHARED_KEY) || {};
    const jars = Object.assign({}, prev.jars || {});
    jars[SUBJECT] = data.candy;
    try { localStorage.setItem(SHARED_KEY, JSON.stringify(Object.assign({}, prev, { settings: data.settings, jars }))); } catch (e) { /* private mode */ }
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode, or quota */ }
  };
  load();
  const S = {
    get: () => data,
    settings: () => data.settings,
    setSetting(k, v) { data.settings[k] = v; save(); },
    topic(id) { return data.topics[id] || (data.topics[id] = { attempts: 0, correct: 0, firstTry: 0, level: 1, lastPractised: null, mastery: 0 }); },
    /** record one question result */
    record(id, { correct, firstTry, level }) {
      const t = S.topic(id);
      t.attempts += 1; if (correct) t.correct += 1; if (firstTry) t.firstTry += 1;
      t.level = level; t.lastPractised = todayIso();
      t.mastery = S.masteryFor(t);
      save();
    },
    /** One finished practice pays candies: 3 = 85%+ right first try, 2 = 65%+, 1 = at least half right.
     *  A practice shorter than settings.minQuestions pays nothing (it still counts for progress). */
    /**
     * Candies for a finished practice.
     *
     * Two things this deliberately does NOT reward. Guessing: the mark is the first answer, so a
     * one-in-four guess at a multiple choice earns nothing over a whole practice. And drilling the
     * same easy topic over and over for candies: a topic pays out once a day, so a practice made
     * only of topics already done today pays nothing, and one that is mostly repeats is capped.
     */
    awardForSession({ total, correct, firstTry, topics }) {
      const st = data.settings, c = data.candy, min = st.minQuestions || 8;
      if (!total || total < min) return { candies: 0, counted: false, short: min - (total || 0), jar: c.jar, reward: null };
      const ft = firstTry / total;
      let candies = ft >= 0.85 ? 3 : ft >= 0.65 ? 2 : ft >= 0.45 ? 1 : 0;

      // how much of this practice was ground she has not already been paid for today
      const today = todayIso();
      if (!c.paidDay || c.paidDay !== today) { c.paidDay = today; c.paidTopics = []; }
      const used = Array.isArray(topics) ? topics.filter((id) => id) : [];
      const fresh = used.filter((id) => c.paidTopics.indexOf(id) < 0);
      const freshShare = used.length ? fresh.length / used.length : 1;
      let repeated = false;
      if (candies > 0 && used.length) {
        if (freshShare === 0) { candies = 0; repeated = true; }
        else if (freshShare < 0.5) { candies = Math.min(candies, 1); repeated = true; }
      }
      if (candies > 0) used.forEach((id) => { if (c.paidTopics.indexOf(id) < 0) c.paidTopics.push(id); });

      c.jar += candies; c.lifetime += candies;
      let reward = null;
      while (c.jar >= (st.candyGoal || 9)) {
        c.jar -= st.candyGoal || 9;
        reward = { date: new Date().toISOString(), prize: st.prize, paid: false };
        c.earned.unshift(reward);
      }
      save();
      return { candies, counted: true, jar: c.jar, reward, repeated, freshTopics: fresh.length, usedTopics: used.length };
    },
    candyState() { return data.candy; },
    /* ---------- prize money ----------
     * The prize is whatever the parent typed ("$5", "5 dollars", "50 元", "an ice cream"), so read
     * a number out of it if there is one and keep the wording around it for display. A prize with
     * no number in it is still counted, just as a thing rather than an amount. */
    parsePrize(text) {
      const t = String(text == null ? '' : text);
      const m = t.match(/(\d+(?:[.,]\d+)?)/);
      if (!m) return null;
      const value = parseFloat(m[1].replace(',', '.'));
      if (!isFinite(value)) return null;
      return { value, prefix: t.slice(0, m.index).trim(), suffix: t.slice(m.index + m[1].length).trim() };
    },
    /** format an amount the same way the current prize is written, e.g. 15 -> "$15" */
    formatMoney(value) {
      const p = S.parsePrize(data.settings.prize || '$5') || { prefix: '$', suffix: '' };
      const n = Math.round(value * 100) / 100;
      const txt = Number.isInteger(n) ? String(n) : n.toFixed(2);
      return (p.prefix || '') + txt + (p.suffix ? (p.suffix.length > 2 ? ' ' : '') + p.suffix : '');
    },
    /** add up a list of won prizes into money collected, money waiting, and prize counts */
    tallyPrizes(earned) {
      const out = { paid: 0, waiting: 0, total: 0, prizes: 0, waitingPrizes: 0, unpriced: 0 };
      (earned || []).forEach((r) => {
        out.prizes++;
        if (!r.paid) out.waitingPrizes++;
        const p = S.parsePrize(r.prize);
        if (!p) { out.unpriced++; return; }
        if (r.paid) out.paid += p.value; else out.waiting += p.value;
      });
      out.total = out.paid + out.waiting;
      return out;
    },
    /* ---------- rescue ----------
     * If candies go missing, this reports everything the app can still find in this browser so a
     * parent can see whether the data is here (and can be put back) or whether this is simply a
     * different place from the one it was saved in. */
    rescueInfo() {
      const goal = data.settings.candyGoal || 9;
      const sh = readJson(SHARED_KEY) || {};
      const read = (n) => {
        const rec = readJson(SUBJECT_KEYS[n]);
        const c = (rec && rec.candy) || null;
        return { subject: n, found: !!rec, jar: c ? c.jar || 0 : 0, lifetime: c ? c.lifetime || 0 : 0,
                 prizes: c ? (c.earned || []).length : 0, sessions: rec ? (rec.sessions || []).length : 0 };
      };
      const subjects = Object.keys(SUBJECT_KEYS).map(read);
      const mirrors = Object.keys(SUBJECT_KEYS).map((n) => {
        const m = sh.jars && sh.jars[n];
        return { subject: n, found: !!m, jar: m ? m.jar || 0 : 0, lifetime: m ? m.lifetime || 0 : 0,
                 prizes: m ? (m.earned || []).length : 0 };
      });
      const a = sh.candyBeforeSplit || null;
      let keys = [];
      try { keys = Object.keys(localStorage).filter((k) => k.indexOf('harper-learning') === 0); } catch (e) {}
      return {
        goal, subjects, mirrors, keys,
        archive: a ? { jar: a.jar || 0, lifetime: a.lifetime || 0, prizes: (a.earned || []).length } : null,
        liveTotal: subjects.reduce((x, r) => x + r.lifetime, 0),
        bestTotal: Math.max(
          subjects.reduce((x, r) => x + r.lifetime, 0),
          mirrors.reduce((x, r) => x + r.lifetime, 0),
          a ? a.lifetime || 0 : 0),
      };
    },
    /** Put back the best copy this browser still holds. Returns what changed. */
    rescueRestore() {
      const info = S.rescueInfo();
      const sh = readJson(SHARED_KEY) || {};
      const before = info.liveTotal;
      // 1. a mirrored jar that is ahead of the subject's own record
      Object.keys(SUBJECT_KEYS).forEach((n) => {
        const m = sh.jars && sh.jars[n];
        if (!m) return;
        const rec = readJson(SUBJECT_KEYS[n]) || blank();
        const cur = (rec.candy && rec.candy.lifetime) || 0;
        if ((m.lifetime || 0) > cur) { rec.candy = m; try { localStorage.setItem(SUBJECT_KEYS[n], JSON.stringify(rec)); } catch (e) {} }
      });
      // 2. the pre-split jar, if it still holds more than both subjects together
      const after1 = S.rescueInfo();
      if (sh.candyBeforeSplit && (sh.candyBeforeSplit.lifetime || 0) > after1.liveTotal) {
        splitCandyJars(data.settings, sh.candyBeforeSplit);
      }
      load();
      const info2 = S.rescueInfo();
      return { before, after: info2.liveTotal, restored: info2.liveTotal - before };
    },
    /** Set a subject's jar by hand — the last resort when the saved data is somewhere else. */
    setJarByHand(subject, { candies, prizes, paidPrizes }) {
      if (!SUBJECT_KEYS[subject]) throw new Error('unknown subject');
      const goal = data.settings.candyGoal || 9;
      const jar = Math.max(0, Math.round(Number(candies) || 0));
      const won = Math.max(0, Math.round(Number(prizes) || 0));
      const paid = Math.min(won, Math.max(0, Math.round(Number(paidPrizes) || 0)));
      const earned = Array.from({ length: won }, (_, i) => ({
        date: new Date().toISOString(), prize: data.settings.prize || '$5', paid: i >= won - paid,
      }));
      const candy = { jar, lifetime: jar + won * goal, earned };
      const rec = readJson(SUBJECT_KEYS[subject]) || blank();
      rec.candy = candy;
      try { localStorage.setItem(SUBJECT_KEYS[subject], JSON.stringify(rec)); } catch (e) {}
      const sh = readJson(SHARED_KEY) || {};
      sh.jars = Object.assign({}, sh.jars || {}); sh.jars[subject] = candy;
      try { localStorage.setItem(SHARED_KEY, JSON.stringify(sh)); } catch (e) {}
      load();
      return candy;
    },
    /** this subject's money box */
    moneyState() { return S.tallyPrizes(data.candy.earned); },
    /** the other subject's jar, read-only, so each app can show both without mixing them up */
    otherJars() {
      const goal = data.settings.candyGoal || 9;
      return Object.keys(SUBJECT_KEYS).filter((n) => n !== SUBJECT).map((n) => {
        const rec = readJson(SUBJECT_KEYS[n]);
        const c = (rec && rec.candy) || { jar: 0, lifetime: 0, earned: [] };
        return { subject: n, jar: c.jar || 0, goal, lifetime: c.lifetime || 0,
                 unpaid: ((c.earned || []).filter((r) => !r.paid)).length,
                 earned: (c.earned || []).slice(), money: S.tallyPrizes(c.earned) };
      });
    },
    unpaidRewards() { return data.candy.earned.filter((r) => !r.paid).length; },
    markRewardPaid(i, paid = true) { const r = data.candy.earned[i]; if (r) { r.paid = paid; save(); } },
    /** how well a topic is known: 0 not started, 1 getting there, 2 solid, 3 mastered */
    masteryFor(t) {
      if (!t || t.attempts < 6) return t && t.attempts >= 3 && t.firstTry / t.attempts >= 0.6 ? 1 : 0;
      const acc = t.firstTry / t.attempts;
      if (acc >= 0.85 && t.level >= 3) return 3;
      if (acc >= 0.7 && t.level >= 2) return 2;
      return 1;
    },
    /** Sessions keep their mistake sheet so a parent can go over it later. Sheets are capped
     *  (15 questions each, diagrams over 12 KB and drawn working over 40 KB dropped) and only the
     *  last 20 are kept, so the saved record cannot grow without limit. */
    saveSession(s) {
      const rec = Object.assign({ date: new Date().toISOString() }, s);
      rec.mistakes = (s.mistakes || []).slice(0, 15).map((m) => Object.assign({}, m, {
        visual: m.visual && m.visual.length > 12000 ? '' : m.visual,
        shownWorking: m.shownWorking && m.shownWorking.length > 40000 ? '' : m.shownWorking,
      }));
      data.sessions.unshift(rec);
      data.sessions = data.sessions.slice(0, 200);
      let sheets = 0;
      data.sessions.forEach((x) => { if (x.mistakes && x.mistakes.length) { sheets++; if (sheets > 20) delete x.mistakes; } });
      const d = todayIso(); if (!data.days.includes(d)) data.days.push(d);
      try { save(); } catch (e) { data.sessions.forEach((x, i) => { if (i > 4) delete x.mistakes; }); save(); }
    },
    sessionsWithMistakes() { return data.sessions.filter((x) => x.mistakes && x.mistakes.length); },
    /**
     * Questions she got wrong three times running on the same idea, most recent first. These are
     * not just "not right" — they are the ones worth sitting down over. `onlyNew` (default) skips
     * ones a parent has already opened the review sheets to see; acknowledgeFlags() clears that.
     */
    flaggedMistakes(opts = {}) {
      const onlyNew = opts.onlyNew !== false;
      const seen = data.flagsSeenAt || '';
      const out = [];
      for (const s of data.sessions) {
        if (onlyNew && s.date <= seen) continue;
        for (const m of (s.mistakes || [])) {
          if (m.flagged) out.push(Object.assign({ sessionDate: s.date, sessionLabel: s.label }, m));
        }
      }
      return out;
    },
    acknowledgeFlags() { data.flagsSeenAt = new Date().toISOString(); save(); },
    /** has she ever seen the guided first-step hint for this skill (or topic, if the question has
     *  no skill tag)? Shown once so it teaches the approach without becoming background noise. */
    hintSeen(key) { return data.hints.indexOf(key) >= 0; },
    markHintSeen(key) { if (data.hints.indexOf(key) < 0) { data.hints.push(key); save(); } },
    /** topic ids that have already earned their once-a-day candy today (never mutates on read) */
    toppedUpTopics() { return data.candy.paidDay === todayIso() ? (data.candy.paidTopics || []).slice() : []; },
    toppedUpToday(id) { return S.toppedUpTopics().indexOf(id) >= 0; },
    streak() {
      const set = new Set(data.days); let n = 0; const d = new Date();
      if (!set.has(todayIso())) d.setDate(d.getDate() - 1);
      for (;;) { const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; if (!set.has(iso)) break; n++; d.setDate(d.getDate() - 1); }
      return n;
    },
    practisedToday: () => data.days.includes(todayIso()),
    todayIso,
    /** topics ordered weakest first, for mixed practice weighting */
    weakness(id) { const t = data.topics[id]; if (!t || t.attempts === 0) return 1.0; return 1 - (t.firstTry / t.attempts) * 0.7; },
    daysSince(id) { const t = data.topics[id]; if (!t || !t.lastPractised) return 99; return Math.round((new Date(todayIso()) - new Date(t.lastPractised)) / 864e5); },
    /** a topic she has proven ("solid" or better, over enough attempts to not be a lucky run) rests
     *  for a few days after that, so the topic picker nudges her toward the ones that still need
     *  work instead of the one she already knows she is good at. */
    isResting(id) { const t = data.topics[id]; return !!t && (t.mastery || 0) >= 2 && S.daysSince(id) < REST_DAYS; },
    restDaysLeft(id) { return Math.max(1, REST_DAYS - S.daysSince(id)); },
    subject: SUBJECT,
    /* ---------- profiles ---------- */
    profile: () => PROFILE,
    profiles: profileList,
    profileName(id) {
      const p = profileList().find((x) => x.id === (id || PROFILE));
      if (p && p.name) return p.name;
      return id === DEFAULT_PROFILE || !id ? 'Harper' : id.charAt(0).toUpperCase() + id.slice(1);
    },
    /** add a child. Returns her id; an existing name just returns the one already there. */
    addProfile(name) {
      const id = cleanId(name);
      if (!id) throw new Error('that name has no letters or numbers in it');
      const list = profileList();
      const found = list.find((x) => x.id === id);
      if (found) return found.id;
      list.push({ id, name: String(name).trim().slice(0, 20) });
      try { localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); } catch (e) {}
      // give her her own name in her own settings, so the app greets her properly
      try {
        const k = 'harper-learning-shared-v1@' + id;
        if (!readRaw(k)) localStorage.setItem(k, JSON.stringify({ settings: Object.assign({}, blank().settings, { name: String(name).trim().slice(0, 20) }) }));
      } catch (e) {}
      return id;
    },
    renameProfile(id, name) {
      const list = profileList().map((x) => (x.id === id ? { id: x.id, name: String(name).trim().slice(0, 20) || x.name } : x));
      try { localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); } catch (e) {}
      if (id === PROFILE) S.setSetting('name', String(name).trim().slice(0, 20));
    },
    /** remember who is practising. The caller reloads, which re-reads every key. */
    useProfile(id) {
      const known = profileList().map((x) => x.id);
      if (known.indexOf(id) < 0) throw new Error('no such child');
      try { localStorage.setItem(PROFILE_KEY, id); } catch (e) {}
      return id;
    },
    /** remove a child and everything of hers. The first child cannot be removed. */
    removeProfile(id) {
      if (!id || id === DEFAULT_PROFILE) throw new Error('the first child cannot be removed');
      const sfx = '@' + id;
      try {
        Object.keys(localStorage).filter((k) => k.indexOf('harper-learning') === 0 && k.slice(-sfx.length) === sfx)
          .forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profileList().filter((x) => x.id !== id)));
        if (cleanId(readRaw(PROFILE_KEY)) === id) localStorage.setItem(PROFILE_KEY, DEFAULT_PROFILE);
      } catch (e) {}
    },
    reset() { data = blank(); save(); },
    /** wipe every subject for THIS child only — her sister's work is never touched */
    resetAll() {
      try {
        Object.keys(localStorage)
          .filter((k) => k.indexOf('harper-learning') === 0 && k !== PROFILE_KEY && k !== PROFILES_KEY)
          .filter((k) => (suffix ? k.slice(-suffix.length) === suffix : k.indexOf('@') < 0))
          .forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
      data = blank(); save();
    },
    /** the last custom mix, kept per subject */
    lastMix: () => (data.mix || []).slice(),
    setLastMix(ids) { data.mix = (ids || []).slice(); save(); },
    /** every subject's record plus the shared jar, so a backup restores the whole app */
    exportAll() {
      const out = { format: 'harper-learning-backup', version: 1, savedAt: new Date().toISOString(), keys: {} };
      try {
        Object.keys(localStorage).filter((k) => k.indexOf('harper-learning') === 0)
          .forEach((k) => { out.keys[k] = localStorage.getItem(k); });
      } catch (e) {}
      // make sure what is in memory right now is in the backup, even if a write failed
      out.keys[SHARED_KEY] = JSON.stringify({ settings: data.settings, candy: data.candy });
      return JSON.stringify(out);
    },
    /** restore a backup. Returns a short summary so the caller can show what came back. */
    importAll(text) {
      const parsed = JSON.parse(text);
      if (parsed && parsed.format === 'harper-learning-backup' && parsed.keys) {
        Object.keys(parsed.keys).forEach((k) => {
          if (k.indexOf('harper-learning') !== 0) return;                 // never write a foreign key
          try { JSON.parse(parsed.keys[k]); } catch (e) { return; }       // never write unreadable data
          try { localStorage.setItem(k, parsed.keys[k]); } catch (e) {}
        });
      } else {
        // an old single-subject backup: it is this subject's record
        const d = Object.assign(blank(), parsed);
        data = d; save();
      }
      load();
      return { candies: data.candy.jar, lifetime: data.candy.lifetime, sessions: data.sessions.length };
    },
    export() { return this.exportAll(); },
    import(json) { return this.importAll(json); },
  };
  HL.store = S;
})(window.HL);
