/* Harper Learning — screens and interaction */
window.HL = window.HL || {};
(function (HL) {
  const S = HL.store, N = HL.num;
  const $ = (sel, el = document) => el.querySelector(sel);
  const app = () => document.getElementById('app');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const strandOf = (t) => HL.strands[t.strand] || HL.strands.number;
  /** how well a topic is known — deliberately not candies, so the two are never confused */
  const masteryHtml = (n) => `<span class="mastery" title="${['Not started', 'Getting there', 'Solid', 'Mastered'][n] || ''}">${[0, 1, 2].map((i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}${n >= 3 ? '<b>🏅</b>' : ''}</span>`;
  const candies = (n) => Array.from({ length: n }, (_, i) => HL.candy(i, 26)).join('');
  const goal = () => S.settings().candyGoal || 9;
  const prize = () => S.settings().prize || '$5';
  const name = () => S.settings().name || 'Harper';
  const isSci = () => HL.subject === 'science';
  /** the working pad (and its guided hint) is a maths thing — showing your algebra/arithmetic
   *  steps. A science "word problem" is a scenario question, not a calculation, so it gets none
   *  of this: no pad, no hint, no Check gate. */
  const needsWorking = (q) => q.kind === 'word' && !isSci();
  const subjectWord = (n) => (n === 'science' ? 'Science' : 'Maths');
  const jarTitle = () => subjectWord(HL.subject) + ' candy jar';
  const SUBJ = () => (isSci()
    ? { crumb: 'Science · Year 8', hero: 'Ready for {m} minutes of science?', mixedBlurb: 'A little bit of everything. The app picks topics you need most.',
        calcChip: '🔍 quick check', wordChip: '🧪 in the lab', foot: 'Harper Learning · NZ Curriculum Year 8 Science · a little every day 🌿', mascot: 'kiwi' }
    : { crumb: 'Maths · Year 8', hero: 'Ready for {m} minutes of maths?', mixedBlurb: 'A little bit of everything. The app picks topics you need most.',
        calcChip: '🔢 calculate', wordChip: '📝 word problem', foot: 'Harper Learning · NZ Curriculum Year 8 · practise a little every day 🌸', mascot: 'bunny' });
  /* Built-in mixes for a unit Harper is being examined on. These live in the code, not in storage,
   * so clearing the browser or moving device can never lose them. */
  const PRESETS = {
    science: [{
      id: 'food-microbes',
      name: 'Exam revision',
      sub: 'Food, disease & microbes',
      topicIds: ['nutrition', 'microbes-health', 'immunity'],
    }],
    maths: [],
  };
  const presets = () => (PRESETS[HL.subject] || []).filter((p) => p.topicIds.every((id) => HL.topics[id]));
  const presetCardHtml = (p) => `<button class="card mix-card" data-act="preset" data-preset="${p.id}">
    <div><h2>${esc(p.name)} 📚</h2><p>${esc(p.sub)} — ${p.topicIds.map((id) => esc(HL.topics[id].short || HL.topics[id].name)).join(' · ')}</p></div>
    <span class="btn btn-soft">Practise</span></button>`;

  let session = null, timer = null, lastSummary = null, lastAward = null;
  let room = null;   // the shared working-pad room for the current practice session, if any
  function leaveRoom() { if (room) { room.leave(); room = null; } }
  const praise = ['Ka pai!', 'Yes! Nailed it.', 'Brilliant!', 'That is right!', 'Super!', 'Tumeke!', 'You got it!', 'Lovely work!'];

  /* ---------- router ---------- */
  function go(hash) { location.hash = hash; }
  function route() {
    const h = (location.hash || '#home').slice(1);
    const [page, arg] = h.split('/');
    if (page !== 'practice' && timer) { clearInterval(timer); timer = null; }
    if (page !== 'practice' && page !== 'summary' && session && !session.isFinished()) { /* leaving a live session */ leaveRoom(); session = null; }
    if (page !== 'practice' && page !== 'join' && !session && room) { /* leaving the join screen's shared pad */ leaveRoom(); }
    if (page === 'start') return startFromHash(arg, h.split('/')[2]);
    const map = { home, topics, learn, practice, summary, progress, settings, candy, money, rescue, review, join: joinScreen, break: () => wiggleBreak(true) };
    (map[page] || home)(arg);
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', route);

  function render(html) { app().innerHTML = html; }
  function topbar(back, crumb, extra = '') {
    return `<div class="topbar">${back ? `<button class="iconbtn" data-go="${back}" aria-label="Back">←</button>` : ''}<span class="crumb">${crumb || ''}</span><span class="spacer"></span>${extra}</div>`;
  }

  /* ---------- home ---------- */
  function home() {
    const streak = S.streak(), done = S.practisedToday();
    const sessions = S.get().sessions;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const totalQ = Object.values(S.get().topics).reduce((a, t) => a + t.attempts, 0);
    const minutes = S.settings().minutes;
    render(`<div class="screen">
      ${topbar(null, SUBJ().crumb, `<button class="iconbtn" data-go="settings" aria-label="Settings">⚙︎</button>`)}
      <div class="hero">${HL.animal(SUBJ().mascot, { size: 96, mood: done ? 'cheer' : 'happy' })}
        <div><h1>${greet}, ${esc(name())}!</h1><p class="sub">${done ? 'You have already practised today. Extra practice is a bonus!' : SUBJ().hero.replace('{m}', minutes)}</p></div></div>
      <div class="stat-row">
        <div class="stat"><b>${streak} 🔥</b><span>day streak</span></div>
        <div class="stat"><b>${totalQ}</b><span>questions done</span></div>
        <div class="stat"><b>${sessions.length}</b><span>sessions</span></div>
      </div>
      ${flagBannerHtml()}
      ${jarCardHtml()}
      ${moneyCardHtml()}
      ${presets().map(presetCardHtml).join('')}
      ${S.lastMix().filter((id) => HL.topics[id]).length ? `<button class="card mix-card" data-act="run-last-mix">
        <div><h2>My mix</h2><p>${S.lastMix().filter((id) => HL.topics[id]).map((id) => esc(HL.topics[id].short || HL.topics[id].name)).join(' · ')}</p></div>
        <span class="btn btn-soft">Practise</span></button>` : ''}
      <div class="menu">
        <button class="menu-btn big" data-act="mixed"><span class="tag chip chip-pink">${minutes} min</span><h2>Mixed practice</h2><p>A little bit of everything. The app picks topics you need most.</p>${HL.animal(isSci() ? 'bee' : 'cat', { size: 90 })}</button>
        <button class="menu-btn" data-go="topics"><h2>Pick a topic</h2><p>${isSci() ? 'Learn one thing at a time.' : 'Practise one thing at a time.'}</p>${HL.animal(isSci() ? 'gecko' : 'dog', { size: 76 })}</button>
        <button class="menu-btn" data-go="topics/learn"><h2>Revision notes</h2><p>Read how each topic works, with examples.</p>${HL.animal(isSci() ? 'owl' : 'koala', { size: 76 })}</button>
        <button class="menu-btn" data-go="progress"><h2>My progress</h2><p>Streaks, topics and what to revise.</p>${HL.animal(isSci() ? 'whale' : 'giraffe', { size: 76 })}</button>
      </div>
      <p class="footer-note">${SUBJ().foot}</p>
    </div>`);
  }

  /* ---------- money box ----------
   * Adds up the prizes she has actually won. Each subject has its own, and the box on the home
   * screen shows both plus the combined total. If the parent's prize has no number in it
   * ("an ice cream"), there is no money to add up, so we count prizes instead. */
  const priced = () => !!S.parsePrize(prize());
  function moneyRows() {
    const mine = Object.assign({ subject: HL.subject }, S.moneyState());
    const rows = [mine].concat(S.otherJars().map((o) => Object.assign({ subject: o.subject }, o.money)));
    rows.sort((a, b) => (a.subject === 'maths' ? -1 : 1) - (b.subject === 'maths' ? -1 : 1));
    const total = rows.reduce((a, r) => ({
      paid: a.paid + r.paid, waiting: a.waiting + r.waiting, total: a.total + r.total,
      prizes: a.prizes + r.prizes, waitingPrizes: a.waitingPrizes + r.waitingPrizes, unpriced: a.unpriced + r.unpriced,
    }), { paid: 0, waiting: 0, total: 0, prizes: 0, waitingPrizes: 0, unpriced: 0 });
    return { rows, total, mine };
  }
  /** "$15", or "3 prizes" when the prize is not an amount */
  const amount = (m) => (priced() ? S.formatMoney(m.total) : `${m.prizes} prize${m.prizes === 1 ? '' : 's'}`);
  const waitingAmount = (m) => (priced() ? S.formatMoney(m.waiting) : `${m.waitingPrizes} prize${m.waitingPrizes === 1 ? '' : 's'}`);

  function moneyCardHtml() {
    const { rows, total } = moneyRows();
    if (!total.prizes) {
      return `<button class="card money-card" data-go="money">
        ${HL.piggyBank({ size: 92 })}
        <div class="jar-text"><h2>Money box</h2>
          <p>Nothing in here yet. Fill a candy jar and ${esc(prize())} drops in!</p></div></button>`;
    }
    return `<button class="card money-card${total.waitingPrizes ? ' won' : ''}" data-go="money">
      ${HL.piggyBank({ size: 92 })}
      <div class="jar-text">
        <h2>Money box</h2>
        <p class="money-big">${esc(amount(total))}</p>
        <span class="jar-how">${rows.map((r) => `${subjectWord(r.subject)} ${esc(amount(r))}`).join(' \u00b7 ')}</span>
        ${total.waitingPrizes ? `<span class="jar-how money-waiting">${esc(waitingAmount(total))} ready to collect \ud83c\udf89</span>` : '<span class="jar-how">all collected \u2713</span>'}
      </div></button>`;
  }

  /* ---------- money box screen ---------- */
  function money() {
    const { rows, total, mine } = moneyRows();
    const earned = S.candyState().earned || [];
    const tile = (r) => `<div class="piggy-tile">
      ${HL.piggyBank({ size: 78 })}
      <b>${esc(amount(r))}</b><span>${subjectWord(r.subject)}</span>
      <small>${r.prizes} prize${r.prizes === 1 ? '' : 's'}${r.waitingPrizes ? ` \u00b7 ${r.waitingPrizes} waiting` : ''}</small></div>`;
    render(`<div class="screen">
      ${topbar('home', 'Money box')}
      <div class="summary-hero">
        ${HL.piggyBank({ size: 168 })}
        <h1>${esc(amount(total))}</h1>
        <p class="sub">${total.prizes
          ? `won altogether from ${total.prizes} full jar${total.prizes === 1 ? '' : 's'}`
          : `Fill a candy jar and ${esc(prize())} drops in here.`}</p>
      </div>
      ${total.waitingPrizes ? `<div class="card tint-butter"><h2>Ready to collect \ud83c\udf89</h2>
        <p style="margin-top:6px"><b>${esc(waitingAmount(total))}</b> is waiting. Show this screen to Mum or Dad.</p></div>` : ''}
      <div class="card"><h2>Each subject</h2>
        <div class="piggy-row">${rows.map(tile).join('')}</div>
        <p style="color:var(--muted);margin-top:10px">Maths and Science fill up separately, so a prize can be won in each. The big number at the top is both added together.</p>
        ${priced() ? `<div class="money-split">
          <div><b>${esc(S.formatMoney(total.paid))}</b><span>already collected</span></div>
          <div><b>${esc(S.formatMoney(total.waiting))}</b><span>still to collect</span></div>
        </div>` : ''}
      </div>
      <div class="card"><h2>${jarTitle().replace(' candy jar', '')} prizes</h2>
        ${earned.length ? `<div class="result-list" style="margin-top:8px">${earned.map((r, i) => `<div class="result-item">${HL.coin(i, 26)}<span class="name">${esc(r.prize)}<br><small style="color:var(--muted)">${new Date(r.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}</small></span><span class="chip ${r.paid ? 'chip-mint' : 'chip-butter'}">${r.paid ? 'collected \u2713' : 'waiting'}</span><button class="btn" style="min-height:38px;padding:6px 12px" data-act="paid" data-i="${i}">${r.paid ? 'Undo' : 'Mark collected'}</button></div>`).join('')}</div>`
          : `<p style="margin-top:6px;color:var(--muted)">No ${subjectWord(HL.subject).toLowerCase()} prizes yet.</p>`}
        ${S.otherJars().filter((o) => o.money.prizes).map((o) => `<p style="margin-top:10px;color:var(--muted)">${subjectWord(o.subject)} has <b>${esc(amount(o.money))}</b> from ${o.money.prizes} prize${o.money.prizes === 1 ? '' : 's'}${o.money.waitingPrizes ? ` (${o.money.waitingPrizes} still waiting)` : ''}. Open the ${subjectWord(o.subject)} app to mark those collected.</p>`).join('')}
      </div>
      <div class="btn-row"><button class="btn btn-primary btn-lg" data-go="candy">See the candy jar</button><button class="btn" data-go="home">Home</button></div>
    </div>`);
  }

  /* What Harper had before her candies went missing, confirmed by her parent: maths one $5 prize
   * plus six candies, science four candies. Offered as a one-tap restore, and only for a subject
   * whose jar is currently empty, so it can never overwrite progress she has made since. */
  const RESTORE_POINT = {
    maths: { candies: 6, prizes: 1, paidPrizes: 0 },
    science: { candies: 4, prizes: 0, paidPrizes: 0 },
  };
  const restorePointNeeded = () => {
    if (S.profile() !== 'default') return [];   // this was Harper's jar, nobody else's
    const info = S.rescueInfo();
    return info.subjects.filter((r) => RESTORE_POINT[r.subject] && r.lifetime === 0
      && (RESTORE_POINT[r.subject].candies || RESTORE_POINT[r.subject].prizes));
  };
  const describeRestorePoint = (sub) => {
    const r = RESTORE_POINT[sub];
    const bits = [];
    if (r.candies) bits.push(`${r.candies} cand${r.candies === 1 ? 'y' : 'ies'}`);
    if (r.prizes) bits.push(`${r.prizes} \u00d7 ${esc(prize())} prize`);
    return bits.join(' and ');
  };

  /* ---------- rescue: candies that have gone missing ---------- */
  function rescue() {
    const info = S.rescueInfo();
    const row = (label, r) => `<div class="result-item"><span class="name">${esc(label)}<br>
      <small style="color:var(--muted)">${r.found === false ? 'nothing saved here' : `${r.jar} in the jar \u00b7 ${r.lifetime} collected \u00b7 ${r.prizes} prize${r.prizes === 1 ? '' : 's'}`}</small></span></div>`;
    const canRestore = info.bestTotal > info.liveTotal;
    render(`<div class="screen">
      ${topbar('settings', 'Missing candies')}
      <h1>Where did the candies go?</h1>
      <p class="sub">Candies are saved by this browser, for this exact address. This page shows everything it can still find here.</p>
      <div class="card"><h2>What this browser is holding</h2>
        <div class="result-list" style="margin-top:8px">
          ${info.subjects.map((r) => row(subjectWord(r.subject) + ' jar', r)).join('')}
          ${info.mirrors.map((r) => row(subjectWord(r.subject) + ' backup copy', r)).join('')}
          ${info.archive ? row('Before the two jars were separated', Object.assign({ found: true }, info.archive)) : ''}
        </div>
        <p style="margin-top:10px;color:var(--muted)">Total found: <b>${info.bestTotal}</b> candies collected.</p>
      </div>
      ${restorePointNeeded().length ? `<div class="card tint-butter"><h2>Put Harper's candies back \ud83c\udf6c</h2>
        <p style="margin-top:6px">The ones she had before: ${restorePointNeeded().map((r) => `<b>${subjectWord(r.subject)}</b> ${describeRestorePoint(r.subject)}`).join(', and ')}.</p>
        <div class="btn-row" style="margin-top:10px"><button class="btn btn-primary" data-act="rescue-known">Put them back</button></div>
        <p style="margin-top:8px;color:var(--muted);font-size:.9rem">The prize comes back as <b>waiting</b>. If you already gave it to her, open the money box and tap <b>Mark collected</b>.</p></div>` : ''}
      ${canRestore ? `<div class="card tint-butter"><h2>There is more saved than is showing</h2>
        <p style="margin-top:6px">This browser is holding <b>${info.bestTotal}</b> candies but only <b>${info.liveTotal}</b> are showing. Put them back:</p>
        <div class="btn-row" style="margin-top:10px"><button class="btn btn-primary" data-act="rescue-restore">Put the candies back</button></div></div>`
        : `<div class="card card-soft"><h2>Nothing else is saved here</h2>
        <p style="margin-top:6px">Everything this browser holds is already showing. That means the candies were saved somewhere else \u2014 most often a <b>different link</b>, a <b>downloaded copy of the file</b>, a different browser or device, or browsing data that has been cleared.</p>
        <p style="margin-top:8px">Two things to try first: open the app from the <b>same link Harper always uses</b>, and if you saved a backup file, use <b>Restore from a file</b> in Settings. If neither works, just type the numbers back in below.</p></div>`}
      <div class="card"><h2>Type the numbers back in</h2>
        <p style="color:var(--muted);margin-top:4px">A prize is ${goal()} candies. Put in what Harper actually had and it will be exactly as it was.</p>
        ${Object.keys({ maths: 1, science: 1 }).map((sub) => {
          const cur = info.subjects.find((x) => x.subject === sub) || { jar: 0, prizes: 0 };
          return `<div class="rescue-set"><h3>${subjectWord(sub)}</h3>
            <label>Candies in the jar<input class="text" type="number" min="0" max="999" id="fix-${sub}-jar" value="${cur.jar}"></label>
            <label>Prizes won altogether<input class="text" type="number" min="0" max="99" id="fix-${sub}-won" value="${cur.prizes}"></label>
            <label>of those, already collected<input class="text" type="number" min="0" max="99" id="fix-${sub}-paid" value="0"></label>
            <button class="btn" data-act="rescue-set" data-sub="${sub}">Save ${subjectWord(sub)}</button></div>`;
        }).join('')}
      </div>
      <div class="btn-row"><button class="btn" data-go="money">Money box</button><button class="btn" data-go="settings">Settings</button></div>
    </div>`);
  }

  /** candy jar card for the home screen */
  /** topics ticked for a custom mix (kept for this session; the last mix is remembered in settings) */
  let mix = [];
  const mixToggle = (id) => { const i = mix.indexOf(id); if (i < 0) mix.push(id); else mix.splice(i, 1); };
  function startMix(ids, label) {
    if (!ids || ids.length === 0) return toast('Tick a few topics first.');
    S.setLastMix(ids);
    startSession({ mode: 'custom', topicIds: ids.slice(), label: label || (ids.length === 1 ? HL.topics[ids[0]].name : `My mix (${ids.length} topics)`) });
  }

  /** a hard-to-miss banner when something needed three tries and still was not right */
  function flagBannerHtml() {
    const items = S.flaggedMistakes();
    if (!items.length) return '';
    return `<button class="card flag-banner" data-go="review">
      <div class="flag-top"><span class="flag-icon">🚩</span><h2>${items.length} thing${items.length === 1 ? '' : 's'} to check with a grown-up</h2></div>
      <p>${esc(name())} needed three tries on ${items.length === 1 ? 'a question' : 'some questions'} and still did not get ${items.length === 1 ? 'it' : 'them'} — worth sitting down together.</p>
      <span class="btn btn-soft">Look now</span></button>`;
  }

  function jarCardHtml() {
    const c = S.candyState(), left = Math.max(0, goal() - c.jar), unpaid = S.unpaidRewards();
    return `<button class="card jar-card${unpaid ? ' won' : ''}" data-go="candy">
      ${HL.candyJar(c.jar, goal(), { size: 104, label: false })}
      <div class="jar-text">
        <h2>${unpaid ? `You earned ${esc(prize())}! 🎉` : jarTitle()}</h2>
        <p>${unpaid ? `Show this to Mum or Dad${unpaid > 1 ? ` — ${unpaid} prizes are waiting` : ''}.`
          : c.jar === 0 ? `Fill the jar with ${goal()} candies and you get ${esc(prize())}.`
          : `${left} more cand${left === 1 ? 'y' : 'ies'} and you get ${esc(prize())}!`}</p>
        <span class="jar-how">${c.jar} of ${goal()} · how do I get candies?</span>
        ${S.otherJars().map((o) => `<span class="jar-how">${subjectWord(o.subject)} jar: ${o.jar} of ${o.goal}${o.unpaid ? ' · prize waiting!' : ''}</span>`).join('')}
      </div></button>`;
  }

  /* ---------- candy jar screen ---------- */
  function candy() {
    const st = S.settings(), c = S.candyState();
    const left = Math.max(0, goal() - c.jar), size = st.minQuestions || 8;
    render(`<div class="screen">
      ${topbar('home', jarTitle())}
      <div class="summary-hero">
        ${HL.candyJar(c.jar, goal(), { size: 190, label: false })}
        <h1>${c.jar} of ${goal()} candies</h1>
        <p class="sub" style="margin-bottom:2px">${jarTitle()}</p>
        <p class="sub">${left === 0 ? `The jar is full — you earned ${esc(prize())}!` : `${left} more cand${left === 1 ? 'y' : 'ies'} and you get ${esc(prize())}.`}</p>
      </div>
      ${S.otherJars().map((o) => `<div class="card"><h2>Your other jar</h2>
        <p style="margin-top:6px">${subjectWord(o.subject)} has its own jar: <b>${o.jar} of ${o.goal}</b> candies${o.unpaid ? ` — and a prize is waiting there!` : '.'} Each subject fills up on its own, so you can win a prize in both.</p></div>`).join('')}
      ${S.unpaidRewards() ? `<div class="card tint-butter"><h2>Prize waiting 🎉</h2><p style="margin-top:6px">You filled the jar and earned <b>${esc(prize())}</b>. Show this screen to Mum or Dad.</p></div>` : ''}
      <div class="card"><h2>How do I get candies?</h2>
        <p style="margin-top:4px">Finish a practice and the jar checks how you did, then drops candies in.</p>
        <div class="rule-list">
          <div class="rule"><span class="rs">${candies(3)}</span><div>Nearly all right — <b>85 out of 100</b> or better</div></div>
          <div class="rule"><span class="rs">${candies(2)}</span><div>Most of them right — <b>65</b> or better</div></div>
          <div class="rule"><span class="rs">${candies(1)}</span><div>Getting there — <b>45</b> or better</div></div>
        </div>
        <ul class="tips" style="margin-top:12px">
          <li><b>Your first answer is the one that counts.</b> After a mistake you get another one like it to practise on — that one is not marked, it is just so you know how next time.</li>
          <li><b>Each topic gives candies once a day.</b> Doing the same topic again later that day will not add more — pick a different one, or mixed practice.</li>
          <li>A practice has to be at least <b>${size} questions</b> to earn candies, so finish the whole thing.</li>
          <li>If the timer runs out early, the app still lets you finish ${size} questions so your practice counts.</li>
        </ul>
      </div>
      <div class="card"><h2>Prizes</h2>
        <p style="color:var(--muted);margin-top:4px">${S.candyState().lifetime} candies collected in ${subjectWord(HL.subject).toLowerCase()} altogether.</p>
        <div class="money-peek">${HL.piggyBank({ size: 72 })}
          <div><b>${esc(amount(moneyRows().total))}</b><span>in the money box${moneyRows().total.waitingPrizes ? ` \u00b7 ${esc(waitingAmount(moneyRows().total))} waiting` : ''}</span></div></div>
        <div class="btn-row" style="margin-top:10px"><button class="btn" data-go="money">Open the money box</button></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary btn-lg" data-act="mixed">Practise and fill the jar</button><button class="btn" data-go="home">Home</button></div>
    </div>`);
  }

  /* ---------- topics ---------- */
  function topics(arg) {
    const learnMode = arg === 'learn';
    if (!learnMode && arg !== 'mix') mix = [];
    const mixMode = arg === 'mix';
    const list = HL.topicList();
    const groups = {};
    list.forEach((t) => (groups[t.strand] = groups[t.strand] || []).push(t));
    // a topic she has already proven she knows sinks to the end of its strand, so the picker's
    // top choices are the ones still worth her time — she can still reach a resting one, it is
    // just no longer the obvious first tap
    if (!mixMode && !learnMode) {
      Object.keys(groups).forEach((sid) => groups[sid].sort((a, b) => (S.isResting(a.id) ? 1 : 0) - (S.isResting(b.id) ? 1 : 0)));
    }
    render(`<div class="screen">
      ${topbar('home', learnMode ? 'Revision notes' : mixMode ? 'Build a mix' : 'Pick a topic')}
      <h1>${learnMode ? 'What would you like to revise?' : mixMode ? 'Tick the topics for your mix' : 'What would you like to practise?'}</h1>
      ${learnMode ? '' : mixMode
        ? '<p class="sub">Pick as many as you like — the practice will mix questions from all of them.</p>'
        : '<button class="btn btn-soft" data-go="topics/mix" style="align-self:flex-start">🎯 Build a mix of several topics</button>'}
      ${Object.keys(groups).map((sid) => {
        const s = HL.strands[sid];
        return `<section class="strand">
          <div class="strand-head">${HL.animal(s.animal, { size: 40 })}<h2>${s.name}</h2>${learnMode || mixMode ? '' : `<button class="btn btn-soft strand-practise" data-act="strand" data-strand="${sid}">Practise all ${s.name}</button>`}</div>
          <div class="topic-grid">${groups[sid].map((t) => {
            const p = S.topic(t.id);
            const resting = !mixMode && !learnMode && S.isResting(t.id);
            return `<div class="topic-card ${t.strand}${mixMode && mix.includes(t.id) ? ' picked' : ''}${resting ? ' resting' : ''}"${mixMode ? ` data-mix="${t.id}" role="button" tabindex="0"` : ''}>
              <div class="t-head">${mixMode ? `<span class="tick">${mix.includes(t.id) ? '✓' : ''}</span>` : HL.animal(t.animal || s.animal, { size: 34 })}<h3>${t.name}</h3></div>
              <div class="example">${t.example}</div>
              <div class="stars" title="${p.attempts} questions done">${masteryHtml(p.mastery || 0)}${p.attempts ? ` <span style="color:var(--faint)">· ${p.attempts} done</span>` : ''}</div>
              ${resting ? `<span class="chip chip-rest">😴 resting ${S.restDaysLeft(t.id)}d</span>`
                : !mixMode && !learnMode && S.toppedUpToday(t.id) ? `<span class="chip chip-butter today-chip">🍬 today's candy done</span>` : ''}
              ${mixMode ? '' : `<div class="t-actions"><button class="btn" data-go="learn/${t.id}">📖 Learn</button>${learnMode ? '' : resting
                ? `<button class="btn btn-ghost" data-act="topic-rest" data-topic="${t.id}">Practise anyway</button>`
                : `<button class="btn btn-primary" data-act="topic" data-topic="${t.id}">Practise</button>`}</div>`}
            </div>`;
          }).join('')}</div>
        </section>`;
      }).join('')}
      ${mixMode ? `<div class="mixbar"><span>${mix.length} topic${mix.length === 1 ? '' : 's'} picked</span><button class="btn" data-act="mix-clear">Clear</button><button class="btn btn-primary" data-act="mix-go">Practise these →</button></div>` : ''}
    </div>`);
  }

  /* ---------- learn ---------- */
  function learn(id) {
    const t = HL.topics[id]; if (!t) return go('topics');
    const L = t.learn, s = strandOf(t);
    render(`<div class="screen learn">
      ${topbar('topics/learn', s.name)}
      <div class="hero">${HL.animal(t.animal || s.animal, { size: 72, mood: 'think' })}<div><h1>${t.name}</h1><p class="sub">${t.blurb}</p></div></div>
      <div class="card tint-${s.colour}"><div class="what">${L.what}</div>${L.visual ? `<div class="q-visual learn-visual">${L.visual}</div>` : ''}</div>
      ${L.facts && L.facts.length ? `<div class="section-title"><h2>Key facts</h2></div><div class="facts">${L.facts.map((f) => `<div class="fact">${f}</div>`).join('')}</div>` : ''}
      <div class="section-title"><h2>How to do it</h2></div>
      <ol class="steps">${L.steps.map((x) => `<li>${x}</li>`).join('')}</ol>
      <div class="section-title"><h2>Worked examples</h2></div>
      ${L.examples.map((e, i) => exampleHtml(e, i + 1)).join('')}
      <div class="section-title"><h2>See another example</h2></div>
      <div class="card card-soft"><p style="color:var(--muted)">A brand-new example with every step, made just now. Pick how hard.</p>
        <div class="btn-row"><button class="btn" data-eg="1">Easy</button><button class="btn" data-eg="2">Medium</button><button class="btn" data-eg="3">Hard</button><button class="btn btn-soft" data-eg="word">Word problem</button></div>
        <div id="live-example"></div></div>
      <div class="section-title"><h2>Watch out for</h2></div>
      <ul class="tips">${L.tips.map((x) => `<li>${x}</li>`).join('')}</ul>
      <div class="btn-row"><button class="btn btn-primary btn-lg" data-act="topic" data-topic="${t.id}">Practise this topic</button><button class="btn" data-go="topics/learn">Back to notes</button></div>
    </div>`);
  }
  function exampleHtml(e, n) {
    return `<div class="example-box">${n ? `<span class="eg-num">Example ${n}</span>` : ''}${e.visual ? `<div class="q-visual">${e.visual}</div>` : ''}<div class="q">${e.q}</div>${(e.working || []).map((w) => `<div class="w">${w}</div>`).join('')}<div class="a">Answer: ${e.a}</div></div>`;
  }
  /** generate a fresh worked example from the topic's own generator */
  function liveExample(topicId, which) {
    const level = which === 'word' ? 2 : Number(which);
    const q = HL.makeQuestion(topicId, level, which === 'word' ? 'word' : 'calc');
    const box = $('#live-example'); if (!box) return;
    box.innerHTML = exampleHtml({ visual: q.visual, q: q.prompt, working: q.working, a: q.finalAnswer }, 0) + `<div class="btn-row" style="margin-top:10px"><button class="btn" data-eg="${which}">Another one like this</button></div>`;
    box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- practice ---------- */
  function startSession(cfg) {
    const st = S.settings();
    session = new HL.Session(Object.assign({ minutes: st.minutes, target: st.questions }, cfg));
    // a friendly heads-up, not a blocking dialog: every topic in THIS practice already earned its
    // once-a-day candy, so she knows before she starts that this round is just for extra practice
    if (cfg.mode !== 'mixed' && cfg.topicIds && cfg.topicIds.length && cfg.topicIds.every((id) => S.toppedUpToday(id))) {
      toast('🍬 Already got today\'s candy here — fun to keep practising though!', 3200);
    }
    go('practice');
  }
  /** deep links: #start/mixed · #start/strand/number · #start/topic/integers */
  function startFromHash(kind, id) {
    const all = HL.topicList();
    if (kind === 'topic' && HL.topics[id]) return startSession({ mode: 'topic', topicIds: [id], label: HL.topics[id].name });
    if (kind === 'strand' && HL.strands[id]) return startSession({ mode: 'strand', topicIds: all.filter((t) => t.strand === id).map((t) => t.id), label: HL.strands[id].name });
    return startSession({ mode: 'mixed', topicIds: all.map((t) => t.id), label: 'Mixed practice' });
  }
  function practice() {
    if (!session) return go('home');
    if (session.isFinished()) return endSession();
    lastStepResults = [];
    const q = session.current || session.next();
    const t = HL.topics[q.topicId], s = strandOf(t);
    const st = S.settings();
    const scored = session.history.filter((h) => !h.isRedo);
    const dots = Array.from({ length: session.target }, (_, i) => {
      const h = scored[i];
      const cls = h ? (h.firstTry ? 'ok' : 'miss') : i === scored.length && !q.isRedo ? 'now' : '';
      return `<span class="dot ${cls}"></span>`;
    }).join('');
    const a = q.answer;
    let inputHtml;
    if (a.type === 'choice') {
      inputHtml = `<div class="choices" id="choices">${a.choices.map((c, i) => `<button class="choice" data-choice="${i}">${c}</button>`).join('')}</div>`;
    } else {
      const ph = a.placeholder || (a.type === 'fraction' ? 'e.g. 3/4' : 'your answer');
      inputHtml = `<div class="answer-row"><label for="ans">Answer</label><input id="ans" class="answer-input" inputmode="${a.type === 'text' ? 'text' : 'decimal'}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${esc(ph)}" ${st.keypad && a.type !== 'text' ? 'readonly' : ''}>${a.unit ? `<span class="unit">${a.unit}</span>` : ''}</div>
      ${st.keypad && a.type !== 'text' ? keypadHtml(a.type) : ''}`;
    }
    let workingHtml = '';
    if (needsWorking(q)) {
      const hasSteps = q.steps && q.steps.length > 0;
      // guided the first time she ever meets this idea (the hint, not the answer); every time
      // after that she gets no content, just a nudge for how many steps a full solution takes.
      // Skipped entirely when the question has real step boxes — those already show what to do.
      const hintKey = q.skill || (q.topicId + ':word');
      const guided = !hasSteps && !S.hintSeen(hintKey);
      const syncOn = HL.sync && HL.sync.available();
      const stepsHtml = hasSteps ? `<div class="steps-box" id="stepsBox">${q.steps.map((s, i) => `
        <div class="step-item">
          <label for="step${i}">Step ${i + 1} — ${esc(s.label)}</label>
          <div class="step-input-row">
            <input id="step${i}" class="answer-input step-input" inputmode="decimal" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="?">
            ${s.unit ? `<span class="unit">${esc(s.unit)}</span>` : ''}
            <span class="step-mark" id="stepMark${i}"></span>
          </div>
          ${s.hint ? `<div class="step-hint">💡 ${esc(s.hint)}</div>` : ''}
        </div>`).join('')}</div>` : '';
      workingHtml = `<div class="working-row">
        ${stepsHtml}
        <div class="working-head"><label for="workpad">${hasSteps ? 'Extra working (optional)' : 'Show your working'}${!hasSteps && !guided ? `<span class="hint-note">(aim for about ${Math.max(1, (q.working || []).length)} steps)</span>` : ''}</label>
          <div class="pad-tools">
            <button type="button" class="padtool on" data-pad="pen">✏️ Pen</button>
            <button type="button" class="padtool" data-pad="fix">🟢 Correct it</button>
            <button type="button" class="padtool" data-pad="eraser">🧽 Eraser</button>
            <button type="button" class="padtool" data-pad="clear">Clear</button>
          </div>
        </div>
        ${guided ? `<div class="hint-guide">💡 <b>First step:</b> ${q.hint || 'Read the question carefully and plan your steps before you start.'}</div>` : ''}
        ${syncOn ? `<div class="sync-chip" id="syncChip">🔗 Share code <b>${esc(S.syncCode())}</b> · <span id="syncStatus">⚪ waiting for someone to join</span></div>` : ''}
        <canvas id="workpad" class="workpad" aria-label="Working-out pad — draw your steps here"></canvas>
      </div>`;
      if (guided) S.markHintSeen(hintKey);
    }
    render(`<div class="screen practice">
      ${topbar(null, `${session.cfg.label}`, `<button class="iconbtn" data-act="keypad" title="Toggle keypad" aria-label="Toggle keypad">⌨</button><button class="iconbtn" data-act="quit" aria-label="Finish early">✕</button>`)}
      <div class="progress-dots">${dots}</div>
      <div class="timebar" aria-hidden="true"><i id="timefill" style="width:${100 - session.remainingMs / (session.minutes * 600)}%"></i></div>
      <div class="card qcard">
        <div class="q-meta"><span class="chip chip-${s.colour}">${HL.animal(t.animal || s.animal, { size: 22 })} ${t.name}</span><span class="chip">${q.kind === 'word' ? SUBJ().wordChip : SUBJ().calcChip}</span><span class="lvl">Level ${q.level}</span></div>
        ${q.isRedo ? `<div class="redo-banner">🔁 <b>Same idea, new numbers.</b> This one is not marked — it is so you have the method. ${q.redoRound > 1 ? `(go ${q.redoRound} of 3)` : ''}</div>` : ''}
        ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ''}
        <div class="prompt" id="prompt">${q.prompt}</div>
        ${workingHtml}
        ${inputHtml}
        <div id="feedback"></div>
        <div class="actions" id="actions"><button class="btn btn-primary btn-lg" data-act="check">Check ✓</button><button class="btn btn-ghost stuck" data-act="stuck">Show me how</button></div>
      </div>
      <p class="footer-note">${q.isRedo ? 'Practice question' : `Question ${session.scoredCount + 1} of ${session.target}`} · ${session.timeUp ? (session.shortBy() ? `${session.shortBy()} more to earn candies` : 'last one') : Math.ceil(session.remainingMs / 60000) + ' min left'}</p>
    </div>`);
    if (needsWorking(q)) bindWorkpad();
    const inp = $('#ans'); if (inp && !st.keypad) setTimeout(() => inp.focus(), 50);
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (!session) return clearInterval(timer);
      const fill = $('#timefill'); if (fill) fill.style.width = `${100 - session.remainingMs / (session.minutes * 600)}%`;
      const note = $('.practice .footer-note');
      if (note) note.textContent = `${session.current && session.current.isRedo ? 'Practice question' : `Question ${session.scoredCount + 1} of ${session.target}`} · ${session.timeUp ? (session.shortBy() ? session.shortBy() + ' more to earn candies' : 'last one') : Math.ceil(session.remainingMs / 60000) + ' min left'}`;
      if (session.remainingMs <= 0 && !session.timeUp) {
        session.timeUp = true;
        const short = session.shortBy();
        toast(short > 1 ? `Time is up — ${short} more questions so this practice counts.` : 'Time is up — finish this one and we will stop.');
      }
    }, 1000);
  }
  function keypadHtml(type) {
    const keys = ['7', '8', '9', '⌫', '4', '5', '6', '−', '1', '2', '3', '/', '.', '0', '␣', 'C'];
    return `<div class="keypad" id="keypad">${keys.map((k) => `<button class="key ${['⌫', 'C'].includes(k) ? 'del' : ['−', '/', '␣', '.'].includes(k) ? 'sym' : ''}" data-key="${k}" aria-label="${k === '⌫' ? 'delete' : k === '␣' ? 'space' : k === 'C' ? 'clear' : k}">${k}</button>`).join('')}</div>`;
  }
  let selectedChoice = null;
  function currentInput() {
    if (session.current.answer.type === 'choice') return selectedChoice;
    return $('#ans') ? $('#ans').value : '';
  }
  /* ---------- word-problem working pad: a small shared whiteboard, not just a text box, so a
   * grown-up sitting alongside her can rub out a wrong step and draw the right one on the spot.
   * When a Firebase project is configured (HL.syncConfig), the SAME pad also mirrors live to
   * anyone who joins with this device's share code (see joinScreen()) — same drawing code either
   * way, the room is just an optional relay for the strokes. */
  let padMode = 'pen', padHasInk = false;
  function strokeStyleFor(mode) {
    const style = getComputedStyle(document.documentElement);
    const inkColor = (style.getPropertyValue('--ink') || '#333').trim() || '#333';
    const fixColor = (style.getPropertyValue('--good') || '#2FA97A').trim() || '#2FA97A';
    return { color: mode === 'fix' ? fixColor : inkColor, width: mode === 'eraser' ? 18 : 3, erase: mode === 'eraser' };
  }
  function drawSeg(ctx, seg) {
    const st = strokeStyleFor(seg.mode);
    ctx.globalCompositeOperation = st.erase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = st.color; ctx.lineWidth = st.width;
    ctx.beginPath(); ctx.moveTo(seg.x1, seg.y1); ctx.lineTo(seg.x2, seg.y2); ctx.stroke();
  }
  function updateSyncStatus(present) {
    const el = $('#syncStatus'); if (!el) return;
    el.textContent = present ? '🟢 connected' : '⚪ waiting for someone to join';
  }
  function sizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round((rect.height || 170) * dpr));
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    return ctx;
  }
  /** pointer drawing + tool switching, shared by Harper's practice pad and the joiner's mirror pad */
  function bindPadPointers(canvas, ctx) {
    let drawing = false, lastX = 0, lastY = 0;
    const posFromEvent = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener('pointerdown', (e) => {
      drawing = true; if (padMode !== 'eraser') padHasInk = true;
      [lastX, lastY] = posFromEvent(e);
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const [x, y] = posFromEvent(e);
      const seg = { x1: lastX, y1: lastY, x2: x, y2: y, mode: padMode };
      drawSeg(ctx, seg);
      if (room) room.sendStroke(seg);
      lastX = x; lastY = y;
      e.preventDefault();
    });
    const stop = () => { drawing = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointerleave', stop);
    canvas.addEventListener('pointercancel', stop);
    document.querySelectorAll('.padtool').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.pad === 'clear') {
          if (room) room.sendClear(); else ctx.clearRect(0, 0, canvas.width, canvas.height);
          padHasInk = false; return;
        }
        padMode = btn.dataset.pad;
        document.querySelectorAll('.padtool').forEach((x) => x.classList.toggle('on', x.dataset.pad === padMode));
      });
    });
  }
  function bindWorkpad() {
    const canvas = $('#workpad'); if (!canvas) return;
    const ctx = sizeCanvas(canvas);
    padMode = 'pen'; padHasInk = false;
    if (HL.sync && HL.sync.available()) {
      if (!room) room = HL.sync.connect(S.syncCode());
      if (room) {
        room.onPeer = updateSyncStatus;
        room.onClearLocal = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
        room.onStroke = (seg) => drawSeg(ctx, seg);
        room.startQuestion();
        updateSyncStatus(room.peerSeen);
      }
    }
    bindPadPointers(canvas, ctx);
  }

  /* ---------- join a shared pad: a parent's own device, no quiz around it, just the pad ---------- */
  function joinScreen() {
    if (!(HL.sync && HL.sync.available())) {
      render(`<div class="screen">
        ${topbar('home', 'Join a shared pad')}
        <div class="card"><h2>Not available right now</h2><p style="margin-top:6px">This needs an internet connection to reach the other device. Try again when you are back online.</p></div>
      </div>`);
      return;
    }
    let saved = ''; try { saved = localStorage.getItem('hl-join-code') || ''; } catch (e) {}
    render(`<div class="screen">
      ${topbar('home', 'Join a shared pad')}
      <h1>Join a shared pad</h1>
      <p class="sub">Ask them to open a word problem — the code shows above the working pad. Type it in below to see the same pad live, and draw on it together.</p>
      <div class="card">
        <div class="answer-row"><label for="joincode">Code</label><input id="joincode" class="answer-input" style="text-transform:uppercase;letter-spacing:.15em" maxlength="4" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" placeholder="A3F9" value="${esc(saved)}"></div>
        <div class="btn-row" style="margin-top:10px"><button class="btn btn-primary btn-lg" data-act="join-go">Connect</button></div>
      </div>
    </div>`);
    const inp = $('#joincode'); if (inp) setTimeout(() => inp.focus(), 50);
  }
  function joinGo() {
    const inp = $('#joincode'); const code = ((inp && inp.value) || '').trim().toUpperCase();
    if (code.length !== 4) { toast('That code should be 4 letters/numbers.'); return; }
    try { localStorage.setItem('hl-join-code', code); } catch (e) {}
    render(`<div class="screen">
      ${topbar('join', 'Shared pad')}
      <h1>Shared pad</h1>
      <div class="working-row">
        <div class="working-head"><label>Draw together</label>
          <div class="pad-tools">
            <button type="button" class="padtool on" data-pad="pen">✏️ Pen</button>
            <button type="button" class="padtool" data-pad="fix">🟢 Correct it</button>
            <button type="button" class="padtool" data-pad="eraser">🧽 Eraser</button>
            <button type="button" class="padtool" data-pad="clear">Clear</button>
          </div>
        </div>
        <div class="sync-chip" id="syncChip">🔗 Code <b>${esc(code)}</b> · <span id="syncStatus">⚪ connecting…</span></div>
        <canvas id="workpad" class="workpad joinpad" aria-label="Shared working-out pad"></canvas>
      </div>
      <p class="sub" id="joinHint">Waiting for a word question to start on the other device…</p>
      <div class="btn-row"><button class="btn" data-go="join">Use a different code</button></div>
    </div>`);
    bindJoinPad(code);
  }
  function bindJoinPad(code) {
    leaveRoom();
    room = HL.sync.connect(code);
    if (!room) { toast('That did not work — check the code and try again.'); return go('join'); }
    const canvas = $('#workpad'); if (!canvas) return;
    const ctx = sizeCanvas(canvas);
    padMode = 'pen';
    room.onPeer = updateSyncStatus;
    room.onClearLocal = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); const h = $('#joinHint'); if (h) h.hidden = false; };
    room.onStroke = (seg) => { drawSeg(ctx, seg); const h = $('#joinHint'); if (h) h.hidden = true; };
    updateSyncStatus(room.peerSeen);
    bindPadPointers(canvas, ctx);
  }
  function check() {
    const q = session.current; if (!q) return;
    if (needsWorking(q)) {
      const hasSteps = q.steps && q.steps.length > 0;
      if (hasSteps) {
        const empty = q.steps.some((s, i) => !(($(`#step${i}`) || {}).value || '').trim());
        if (empty) { toast('Fill in every step first, then check.'); return; }
      } else if (!padHasInk) {
        toast('Show your working on the pad first, then check.'); return;
      }
      const canvas = $('#workpad');
      session.pendingWorking = canvas ? canvas.toDataURL('image/png') : '';
      session.pendingSteps = hasSteps ? q.steps.map((s, i) => {
        const given = (($(`#step${i}`) || {}).value || '').trim();
        return { label: s.label, unit: s.unit || '', given, expected: s.value, ok: HL.mark.checkStep(given, s.value, s.tolerance).ok };
      }) : [];
      lastStepResults = session.pendingSteps;
    }
    const res = session.answer(currentInput());
    const fb = $('#feedback'), inp = $('#ans');
    if (res.status === 'empty') { toast(q.answer.type === 'choice' ? 'Tap one of the answers first.' : 'Type your answer first.'); return; }
    if (res.status === 'invalid') { toast(res.note); return; }
    showFeedback(res);
  }
  /** shows a ✓ or a ✗ (with the right value) next to each step box, so she can see exactly
   *  which step went wrong instead of just "the answer was wrong" */
  function markSteps() {
    lastStepResults.forEach((r, i) => {
      const mark = $(`#stepMark${i}`), inp = $(`#step${i}`);
      if (!mark) return;
      if (r.ok) { mark.textContent = '✓'; mark.className = 'step-mark ok'; }
      else { mark.textContent = `✗ → ${N.fmt(r.expected)}${r.unit ? ' ' + r.unit : ''}`; mark.className = 'step-mark bad'; }
      if (inp) inp.classList.add(r.ok ? 'ok' : 'bad');
    });
  }
  function showFeedback(res) {
    const cur = session.current; // null once the question is finished (correct / reveal)
    const fb = $('#feedback'), inp = $('#ans'), actions = $('#actions');
    const t = HL.topics[lastQuestion.topicId];
    markSteps();
    if (res.status === 'correct') {
      if (inp) inp.classList.add('ok');
      document.querySelectorAll('.choice.selected').forEach((c) => c.classList.add('ok'));
      document.querySelectorAll('.choice').forEach((c) => (c.disabled = true));
      const line = res.wasRedo ? 'You fixed it. That is the one that counts. 💪' : 'First try!';
      fb.innerHTML = `<div class="feedback correct">${HL.animal(t.animal, { size: 56, mood: 'cheer' })}<div><h3>${HL.rng.pick(praise)}</h3><p>${line}</p></div></div>`;
      actions.innerHTML = `<button class="btn btn-good btn-lg" data-act="next">Next question →</button>`;
      sparkle();
      HL.sound.correct();
      $('[data-act="next"]').focus();
      return;
    }
    // wrong: marked now, working shown, then the same kind of question with new numbers
    if (inp) inp.classList.add('bad');
    document.querySelectorAll('.choice').forEach((c) => { c.disabled = true; if (Number(c.dataset.choice) === Number(lastQuestion.answer.value)) c.classList.add('ok'); });
    HL.sound.wrong();
    const nextLine = res.easedOff
      ? 'We will leave this one for today and come back to it another time. 🌱'
      : 'Now have a go at one just like it, with different numbers.';
    const btn = res.easedOff ? 'Move on →' : 'Ready → try one like it';
    fb.innerHTML = `<div class="feedback reveal">${HL.animal(t.animal, { size: 56, mood: 'think' })}<div><h3>Let's work it out together</h3>${res.note ? `<p>${res.note}</p>` : ''}<div class="working">${lastQuestion.working.map((w) => `<div>${w}</div>`).join('')}</div><p class="final">Answer: <b>${lastQuestion.finalAnswer}</b></p><p class="stuck">${nextLine}</p></div></div>`;
    actions.innerHTML = `<button class="btn btn-primary btn-lg" data-act="next">${btn}</button><button class="btn" data-go-learn="${t.id}">📖 Read the notes</button>`;
    $('[data-act="next"]').focus();
  }
  let lastQuestion = null, lastStepResults = [];
  function next() {
    selectedChoice = null;
    if (session.isFinished()) return endSession();
    if (S.settings().breaks && session.breakDue()) return wiggleBreak();
    session.next(); practice();
  }

  /* ---------- halfway wiggle break ---------- */
  const STRETCHES = [
    'Show us your best dance move! 💃',
    'Do the chorus move from your favourite song 🎤',
    'Dance like nobody is watching 🕺',
    'Stand up and stretch as tall as you can 🌱',
    'Roll your shoulders back five times',
    'Shake out your hands like they are wet 💦',
    'Look out the window at something far away 👀',
    'Take three big slow breaths',
    'Have a sip of water 💧',
    'Spin around once, then strike a pose ✨',
  ];
  function wiggleBreak(preview) {
    if (timer) { clearInterval(timer); timer = null; }
    if (!preview) { session.breakTaken = true; session.pause(); }
    const secs = 30;
    const pair = HL.rng.sample(isSci() ? ['kiwi', 'owl', 'gecko', 'whale', 'turtle', 'bee', 'seal', 'crab'] : ['bunny', 'cat', 'fox', 'penguin', 'frog', 'chick', 'panda', 'bear', 'koala', 'hedgehog'], 2);
    render(`<div class="screen breakscreen">
      ${topbar(null, 'Wiggle break')}
      <div class="card break-card">
        <div class="stage">
          <span class="beam b1"></span><span class="beam b2"></span><span class="beam b3"></span>
          <span class="sparkle s1">✨</span><span class="sparkle s2">✨</span><span class="sparkle s3">✨</span>
          <span class="note n1">♪</span><span class="note n2">♫</span><span class="note n3">♪</span>
          <span class="dancer a">${HL.animal(pair[0], { size: 112, mood: 'cheer' })}</span>
          <span class="mic">🎤</span>
          <span class="dancer b">${HL.animal(pair[1], { size: 112, mood: 'cheer' })}</span>
          <span class="stage-floor"></span>
        </div>
        <h1>Halfway! Time for a wiggle 🎉</h1>
        <p class="sub">${preview ? 'This is the break Harper gets halfway through a practice.' : `You have done ${session.count} questions. Have a dance, then finish the rest.`}</p>
        <div class="stretch">${HL.rng.pick(STRETCHES)}</div>
        <button class="btn btn-soft music-btn" data-act="music">🔈 Music</button>
        <div class="timebar break-bar"><i id="breakfill" style="width:0%"></i></div>
        <p class="break-count"><span id="breakleft">${secs}</span> seconds — ${preview ? 'the music is playing' : 'your practice timer is paused'}</p>
        <button class="btn btn-primary btn-lg btn-block" data-act="${preview ? 'break-done' : 'resume'}">${preview ? 'Done — back to the app' : "I'm ready — keep going →"}</button>
      </div>
    </div>`);
    HL.sound.unlock(); HL.sound.music.start();
    const label = () => { const b = $('.music-btn'); if (!b) return; const st = HL.sound.state();
      b.textContent = st === 'on' ? '🔊 Music on — tap to restart' : st === 'off' ? '🔇 Sound is off in settings' : '🔈 Tap for music';
      b.classList.toggle('needs-tap', st === 'blocked'); };
    [300, 1200, 2500].forEach((ms) => setTimeout(() => { if (HL.sound.state() === 'blocked') { HL.sound.unlock(); HL.sound.music.start(); } label(); }, ms));
    const started = Date.now();
    timer = setInterval(() => {
      const left = Math.max(0, secs - Math.round((Date.now() - started) / 1000));
      const fill = $('#breakfill'), lbl = $('#breakleft');
      if (fill) fill.style.width = `${Math.min(100, (secs - left) / secs * 100)}%`;
      if (lbl) lbl.textContent = left;
      if (left <= 0) { clearInterval(timer); timer = null; if (preview) { HL.sound.music.stop(); go('home'); } else resumeFromBreak(); }
    }, 250);
  }
  function resumeFromBreak() {
    HL.sound.music.stop();
    if (timer) { clearInterval(timer); timer = null; }
    if (!session) return go('home');
    session.resume(); session.next(); practice();
  }
  function endSession() {
    if (timer) { clearInterval(timer); timer = null; }
    leaveRoom();
    if (!session) return go('home');
    const noReward = !!session.noReward;
    lastSummary = session.summary();
    lastAward = (lastSummary.total > 0 && !noReward) ? S.awardForSession(lastSummary)
      : { candies: 0, counted: lastSummary.total > 0, short: S.settings().minQuestions || 8, jar: S.candyState().jar, reward: null, noReward };
    lastSummary.candies = lastAward.candies; lastSummary.reward = lastAward.reward;
    if (lastSummary.total > 0) S.saveSession(lastSummary);
    session = null;
    go('summary');
  }
  function summary() {
    const s = lastSummary; if (!s) return go('home');
    const acc = s.total ? Math.round(s.firstTry / s.total * 100) : 0;
    const weak = Object.entries(s.byTopic).filter(([, b]) => b.firstTry / b.total < 0.6).map(([id]) => id);
    const grade = s.percent >= 90 ? 'Outstanding' : s.percent >= 75 ? 'Really good' : s.percent >= 60 ? 'Good work' : s.percent >= 40 ? 'Getting there' : 'Tricky one — keep going';
    render(`<div class="screen">
      ${topbar('home', 'Practice finished', `<button class="iconbtn" data-act="print" title="Print" aria-label="Print this page">🖨</button>`)}
      <div class="card scorecard">
        <div class="score-main">
          <span class="score-mark">${fmtMark(s.marks)}<i>/ ${s.total}</i></span>
          <span class="score-pct">${s.percent}%</span>
        </div>
        <div class="score-side">
          <h1>${grade}${s.percent >= 60 ? ', ' + esc(name()) + '!' : ''}</h1>
          <p class="sub">${esc(s.label || 'Practice')} · ${s.minutes} min</p>
          <div class="score-chips">
            <span class="chip chip-mint">✓ ${s.firstTry} right</span>
            <span class="chip ${s.missed ? 'chip-pink' : ''}">✗ ${s.missed} not right</span>
            ${s.redos ? `<span class="chip chip-butter">🔁 ${s.fixed} of ${s.redos} fixed after</span>` : ''}
          </div>
          <p class="score-note">Marked like a test: your first answer is the one that counts. The practice questions after a mistake are not marked${s.redos ? ` — you did ${s.redos} of those` : ''}.</p>
        </div>
      </div>
      ${lastAward ? `<div class="card jar-summary"><div>${HL.candyJar(S.candyState().jar, goal(), { size: 96, label: false })}</div>
        <div><h2>${lastAward.candies ? `+${lastAward.candies} cand${lastAward.candies === 1 ? 'y' : 'ies'} for the jar` : 'No candies this time'}</h2>
        <p style="color:var(--muted)">${lastAward.noReward ? 'You already know this topic well, so this round was just for fun — no candy this time. A different topic will pay.'
          : lastAward.reward ? `The jar is full — you earned <b>${esc(prize())}</b>! 🎉`
          : !lastAward.counted ? `A practice needs at least <b>${S.settings().minQuestions || 8} questions</b> to earn candies. You did ${s.total}.`
          : lastAward.repeated && !lastAward.candies ? 'These topics already earned candies today. Try a different topic, or mixed practice, for more.'
          : lastAward.repeated ? 'Mostly topics that already earned candies today — a new topic pays more.'
          : `${Math.max(0, goal() - S.candyState().jar)} more until ${esc(prize())}.`}</p>
        <button class="btn btn-soft" data-go="candy" style="margin-top:6px">Open the jar</button></div></div>` : ''}
      <div class="card"><h2>By topic</h2><div class="result-list" style="margin-top:10px">${Object.entries(s.byTopic).map(([id, b]) => {
        const t = HL.topics[id]; const pct = Math.round(b.firstTry / b.total * 100);
        return `<div class="result-item">${HL.animal(t.animal, { size: 30 })}<span class="name">${t.name}</span><span class="bar ${pct >= 70 ? '' : pct >= 40 ? 'mid' : 'low'}"><i style="width:${pct}%"></i></span><span class="score">${b.firstTry}/${b.total}</span></div>`;
      }).join('')}</div></div>
      ${flagCardHtml(s.flagged || [])}
      ${mistakeSheetHtml(s.mistakes || [], 'What to go over together')}
      ${weak.length ? `<div class="card tint-butter"><h2>Worth a quick revision</h2><p style="margin-top:6px">${weak.map((id) => `<button class="btn" style="margin:4px 6px 4px 0" data-go="learn/${id}">📖 ${HL.topics[id].name}</button>`).join('')}</p></div>` : ''}
      <div class="btn-row"><button class="btn btn-primary btn-lg" data-act="again">Practise again</button><button class="btn btn-lg" data-go="home">Home</button></div>
    </div>`);
    if (lastAward && lastAward.reward) HL.sound.prize();
    else if (lastAward && lastAward.candies) HL.sound.candy();
    if (s.stars >= 2) sparkle(40);
  }
  const fmtMark = (m) => String(Math.round(m));

  /** the sheet a parent goes over with her: every question she did not get right first time */
  /** one mistake, as a row shared by the mistake sheet and the flagged card */
  function mistakeRowHtml(m, i, opts = {}) {
    return `<div class="mistake">
      <div class="m-head"><span class="m-num">${i + 1}</span><span class="chip">${esc(m.topicName)}</span><span class="chip">${m.kind === 'word' ? 'word problem' : 'calculation'} · level ${m.level}</span><span class="chip chip-pink">${m.flagged ? `🚩 tried ${m.redoAttempts || 3}×` : 'not right'}</span></div>
      ${m.visual ? `<div class="q-visual">${m.visual}</div>` : ''}
      <div class="m-q">${m.prompt}</div>
      <div class="m-row"><span class="m-label">She put</span><span class="m-given">${(m.given || []).map((g) => `<b>${esc(g)}</b>`).join(' then ') || '—'}</span></div>
      <div class="m-row"><span class="m-label">Answer</span><span class="m-answer">${m.answer}</span></div>
      ${(m.shownSteps || []).length ? `<div class="steps-box" style="margin:10px 0 0">${m.shownSteps.map((r) => `
        <div class="step-item"><label>${esc(r.label)}</label><div class="step-input-row">
          <span>${esc(r.given) || '—'}${r.unit ? ' ' + esc(r.unit) : ''}</span>
          <span class="step-mark ${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓' : `✗ → ${N.fmt(r.expected)}${r.unit ? ' ' + esc(r.unit) : ''}`}</span>
        </div></div>`).join('')}</div>` : ''}
      ${m.shownWorking ? `<div class="her-working"><span class="m-label">Her working</span><img src="${m.shownWorking}" alt="Her working, drawn on the pad"></div>` : ''}
      <details class="m-working"${opts.open ? ' open' : ''}><summary>How to work it out</summary><div class="working">${(m.working || []).map((w) => `<div>${w}</div>`).join('')}</div></details>
    </div>`;
  }
  function mistakeSheetHtml(mistakes, heading) {
    if (!mistakes.length) return `<div class="card tint-mint"><h2>Nothing to go over 🌟</h2><p style="margin-top:6px">Every question was right first time.</p></div>`;
    return `<div class="card sheet">
      <div class="sheet-head"><h2>${heading}</h2><span class="chip">${mistakes.length} question${mistakes.length === 1 ? '' : 's'}</span></div>
      <p class="sub" style="margin-top:2px">For a grown-up: each one shows what ${esc(name())} put, the right answer, and how to work it out.</p>
      ${mistakes.map((m, i) => mistakeRowHtml(m, i)).join('')}
      <div class="btn-row" style="margin-top:12px"><button class="btn" data-act="print">🖨 Print this list</button></div>
    </div>`;
  }
  /** three tries and still wrong: pulled out on its own, expanded by default, so it cannot be missed */
  function flagCardHtml(items) {
    if (!items.length) return '';
    return `<div class="card tint-oops">
      <div class="sheet-head"><h2>🚩 Flag for a grown-up</h2><span class="chip chip-pink">${items.length} question${items.length === 1 ? '' : 's'}</span></div>
      <p class="sub" style="margin-top:2px">${esc(name())} got ${items.length === 1 ? 'this one' : 'these'} wrong three times running, even after seeing the working each time. ${items.length === 1 ? 'It' : 'They'} might need you to sit down together, not just a quick look.</p>
      ${items.map((m, i) => mistakeRowHtml(m, i, { open: true })).join('')}
    </div>`;
  }

  /* ---------- past mistake sheets, for a parent ---------- */
  function review(arg) {
    const list = S.sessionsWithMistakes();
    if (arg != null && list[Number(arg)]) {
      const r = list[Number(arg)];
      const when = new Date(r.date).toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + new Date(r.date).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' });
      render(`<div class="screen">
        ${topbar('review', 'Review sheet', `<button class="iconbtn" data-act="print" aria-label="Print">🖨</button>`)}
        <div class="hero"><div><h1>${esc(r.label || 'Practice')}</h1><p class="sub">${when} · scored ${fmtMark(r.marks != null ? r.marks : r.correct)} / ${r.total}${r.percent != null ? ` (${r.percent}%)` : ''}</p></div></div>
        ${flagCardHtml((r.mistakes || []).filter((m) => m.flagged))}
        ${mistakeSheetHtml(r.mistakes || [], 'Questions to go over')}
        <div class="btn-row"><button class="btn" data-go="review">All review sheets</button><button class="btn" data-go="home">Home</button></div>
      </div>`);
      return;
    }
    // opening the list is "a grown-up came to look" — whatever was flagged stops being new
    if (S.flaggedMistakes().length) S.acknowledgeFlags();
    render(`<div class="screen">
      ${topbar('progress', 'Review sheets')}
      <div class="hero">${HL.animal(isSci() ? 'owl' : 'koala', { size: 72, mood: 'think' })}<div><h1>Review sheets</h1><p class="sub">Every practice keeps the questions ${esc(name())} did not get right first time, so you can go over them together.</p></div></div>
      ${list.length ? `<div class="result-list">${list.map((r, i) => {
        const flaggedN = (r.mistakes || []).filter((m) => m.flagged).length;
        return `<div class="result-item"><span class="name">${esc(r.label || 'Practice')}<br><small style="color:var(--muted)">${new Date(r.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} · ${r.mistakes.length} to go over${flaggedN ? ` · 🚩 ${flaggedN} flagged` : ''}</small></span><span class="score tnum">${r.percent != null ? r.percent + '%' : ''}</span><button class="btn" style="min-height:38px;padding:6px 12px" data-go="review/${i}">Open</button></div>`;
      }).join('')}</div>`
        : '<div class="card"><p>No review sheets yet. After a practice, anything she did not get right first time is collected here.</p></div>'}
      <div class="btn-row"><button class="btn" data-go="progress">Progress</button><button class="btn" data-go="home">Home</button></div>
    </div>`);
  }

  /* ---------- progress ---------- */
  function progress() {
    const d = S.get(); const list = HL.topicList();
    const byStrand = {};
    list.forEach((t) => { const p = d.topics[t.id]; const b = byStrand[t.strand] || (byStrand[t.strand] = { a: 0, f: 0 }); if (p) { b.a += p.attempts; b.f += p.firstTry; } });
    const days = []; const today = new Date();
    for (let i = 27; i >= 0; i--) { const x = new Date(today); x.setDate(today.getDate() - i); days.push(x); }
    const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    render(`<div class="screen">
      ${topbar('home', 'My progress')}
      <div class="hero">${HL.animal(isSci() ? 'whale' : 'frog', { size: 72 })}<div><h1>${esc(name())}'s progress</h1><p class="sub">${S.streak()} day streak · ${d.sessions.length} sessions · ${Object.values(d.topics).reduce((a, t) => a + t.attempts, 0)} questions</p></div></div>
      <div class="card"><h2>Last 4 weeks</h2><div class="calendar" style="margin-top:10px">${days.map((x) => `<span class="day ${d.days.includes(iso(x)) ? 'done' : ''} ${iso(x) === iso(today) ? 'today' : ''}" title="${iso(x)}">${x.getDate()}</span>`).join('')}</div></div>
      <div class="card"><h2>First-try accuracy by strand</h2><div class="strand-bars" style="margin-top:10px">${Object.keys(HL.strands).map((sid) => { const b = byStrand[sid] || { a: 0, f: 0 }; const pct = b.a ? Math.round(b.f / b.a * 100) : 0; return `<div class="strand-bar"><span>${HL.strands[sid].name}</span><span class="bar ${pct >= 70 ? '' : pct >= 40 ? 'mid' : 'low'}"><i style="width:${pct}%"></i></span><span class="tnum">${b.a ? pct + '%' : '—'}</span></div>`; }).join('')}</div></div>
      <div class="card"><h2>Topics</h2><div class="result-list" style="margin-top:10px">${list.map((t) => { const p = d.topics[t.id]; const pct = p && p.attempts ? Math.round(p.firstTry / p.attempts * 100) : null; return `<div class="result-item">${HL.animal(t.animal, { size: 28 })}<span class="name">${t.name}<br><small style="color:var(--muted)">${p && p.attempts ? `${p.attempts} done · level ${p.level} · ${S.daysSince(t.id) === 0 ? 'today' : S.daysSince(t.id) > 60 ? 'not yet' : S.daysSince(t.id) + ' days ago'}` : 'not practised yet'}</small></span><span>${masteryHtml(p ? p.mastery || 0 : 0)}</span><span class="score tnum">${pct == null ? '' : pct + '%'}</span><button class="btn" style="min-height:38px;padding:6px 12px" data-act="topic" data-topic="${t.id}">Go</button></div>`; }).join('')}</div></div>
      <div class="card tint-sky"><h2>For a grown-up</h2><p style="margin-top:6px">Every practice keeps the questions she did not get right first time, with her answer and the working.</p><button class="btn" style="margin-top:8px" data-go="review">Open review sheets</button></div>
      <div class="card"><h2>Recent sessions</h2>${d.sessions.slice(0, 10).map((s) => `<div class="session-row"><span class="when">${new Date(s.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })} ${new Date(s.date).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}</span><span class="what">${esc(s.label || s.mode)}</span><span class="tnum">${s.firstTry}/${s.total}</span><span class="tnum">${candies(s.candies == null ? s.stars : s.candies)}</span></div>`).join('') || '<p style="color:var(--muted)">No sessions yet.</p>'}</div>
    </div>`);
  }

  /* ---------- settings ---------- */
  function settings() {
    const st = S.settings();
    const seg = (key, opts) => `<span class="seg" data-setting="${key}">${opts.map((o) => `<button class="${String(st[key]) === String(o.v) ? 'on' : ''}" data-v="${o.v}">${o.l}</button>`).join('')}</span>`;
    render(`<div class="screen">
      ${topbar('home', 'Settings')}
      <h1>Settings</h1>
      ${S.profiles().length > 1 ? `<div class="card"><h2>Who is practising?</h2>
        <p style="color:var(--muted);margin-top:4px">Everyone has her own progress, her own candy jars and her own money box. Nothing is shared.</p>
        <div class="who-row">${S.profiles().map((x) => `<button class="who${x.id === S.profile() ? ' on' : ''}" data-act="who" data-who="${esc(x.id)}">
          ${HL.animal(x.id === S.profile() ? SUBJ().mascot : 'cat', { size: 44 })}<b>${esc(x.name)}</b>${x.id === S.profile() ? '<span>practising now</span>' : '<span>tap to swap</span>'}</button>`).join('')}</div>
        <div class="btn-row" style="margin-top:12px"><button class="btn btn-soft" data-act="add-who">Add someone else</button></div>
      </div>` : ''}
      <div class="card">
        <div class="setting"><div class="lbl">Name<small>Used in greetings</small></div><input class="text" id="nameInput" value="${esc(st.name)}" maxlength="20"></div>
        <div class="setting"><div class="lbl">Session length<small>The session ends after this many minutes</small></div>${seg('minutes', [{ v: 15, l: '15' }, { v: 20, l: '20' }, { v: 25, l: '25' }, { v: 30, l: '30' }])}</div>
        <div class="setting"><div class="lbl">Questions per session<small>Whichever comes first: time or questions</small></div>${seg('questions', [{ v: 14, l: '14' }, { v: 20, l: '20' }, { v: 25, l: '25' }, { v: 30, l: '30' }])}</div>
        <div class="setting"><div class="lbl">Word problems<small>How much of a practice is worded questions rather than straight calculations</small></div>${seg('wordRatio', [{ v: 0.2, l: '1 in 5' }, { v: 0.35, l: '1 in 3' }, { v: 0.5, l: 'half' }])}</div>
        <div class="setting"><div class="lbl">Where to start<small>How hard a topic begins before ${esc(name())} has practised it. Once she has, it follows her own level either way</small></div>${seg('startLevel', [{ v: 1, l: 'Easy' }, { v: 2, l: 'Middle' }, { v: 3, l: 'Stretch' }])}</div>
        <div class="setting"><div class="lbl">On-screen keypad<small>Big number keys instead of the iPad keyboard</small></div>${seg('keypad', [{ v: true, l: 'On' }, { v: false, l: 'Off' }])}</div>
        <div class="setting"><div class="lbl">Bigger text</div>${seg('bigText', [{ v: false, l: 'Normal' }, { v: true, l: 'Big' }])}</div>
        <div class="setting"><div class="lbl">Sounds &amp; music<small>Little sounds when you answer, and music in the wiggle break</small></div>${seg('sounds', [{ v: true, l: 'On' }, { v: false, l: 'Off' }])}</div>
        <div class="setting"><div class="lbl">Test the sound<small id="soundstate">${soundStateText()}</small></div><button class="btn" data-act="testsound">Play a test sound</button></div>
        <div class="setting"><div class="lbl">Halfway wiggle break<small>A 30 second dancing break in the middle of a practice; the timer pauses</small></div>${seg('breaks', [{ v: true, l: 'On' }, { v: false, l: 'Off' }])}</div>
        <div class="setting"><div class="lbl">See what the break looks like<small>Plays the music too</small></div><button class="btn" data-go="break">Preview</button></div>
        <div class="setting"><div class="lbl">Colours</div>${seg('theme', [{ v: 'system', l: 'Auto' }, { v: 'light', l: 'Light' }, { v: 'dark', l: 'Night' }])}</div>
      </div>
      <div class="card"><h2>Candy jars &amp; reward</h2>
        <p style="margin-top:6px;color:var(--muted)">Maths and Science each have their <b>own</b> jar, so Harper can win a prize in both. The goal and the prize below apply to both jars.</p>
        <div class="setting"><div class="lbl">Candies needed for a prize<small>Each finished practice pays 0 to 3 candies</small></div>${seg('candyGoal', [{ v: 6, l: '6' }, { v: 9, l: '9' }, { v: 12, l: '12' }, { v: 15, l: '15' }])}</div>
        <div class="setting"><div class="lbl">Prize<small>Shown to ${esc(st.name)} when the jar is full</small></div><input class="text" id="prizeInput" value="${esc(st.prize)}" maxlength="24"></div>
        <div class="setting"><div class="lbl">Shortest practice that earns candies<small>The timer will not end a practice below this</small></div>${seg('minQuestions', [{ v: 6, l: '6' }, { v: 8, l: '8' }, { v: 10, l: '10' }])}</div>
        <div class="setting"><div class="lbl">${jarTitle()} right now<small>${S.candyState().jar} of ${goal()} · ${S.candyState().lifetime} collected altogether · ${S.unpaidRewards()} prize(s) waiting</small></div><button class="btn" data-go="candy">Open</button></div>
        ${S.otherJars().map((o) => `<div class="setting"><div class="lbl">${subjectWord(o.subject)} candy jar<small>${o.jar} of ${o.goal} · ${o.lifetime} collected altogether · ${o.unpaid} prize(s) waiting — open the ${subjectWord(o.subject)} app to manage it</small></div></div>`).join('')}
      </div>
      <div class="card"><h2>Shared working pad</h2>
        ${HL.sync && HL.sync.available()
          ? `<p style="margin-top:6px;color:var(--muted)">When ${esc(name())} opens a word problem, this code appears above her working pad. Type it into another device to see the same pad live and draw on it together.</p>
             <div class="setting"><div class="lbl">This device's code</div><b style="font-size:1.3rem;letter-spacing:.1em">${esc(S.syncCode())}</b></div>
             <div class="btn-row"><button class="btn" data-go="join">Join a shared pad</button></div>`
          : `<p style="margin-top:6px;color:var(--muted)">Not available right now — this needs an internet connection.</p>`}
      </div>
      <div class="card card-soft"><h2>For parents</h2>
        <p style="margin-top:6px;color:var(--muted)">Progress and the candy jar are saved <b>in this browser, for this address</b>. Keep opening the app from the <b>same link</b> and nothing is ever lost — updates to the app do not touch the jar. What does clear it: opening a different link or a downloaded copy of the file, clearing browsing data, or using a private window.</p>
        <p style="margin-top:8px;color:var(--muted)">Right now: <b>${S.candyState().jar} of ${goal()}</b> in the ${subjectWord(HL.subject).toLowerCase()} jar${S.otherJars().map((o) => ` and <b>${o.jar} of ${o.goal}</b> in the ${subjectWord(o.subject).toLowerCase()} one`).join('')}, ${S.candyState().lifetime} collected in ${subjectWord(HL.subject).toLowerCase()} altogether, ${S.get().sessions.length} practice${S.get().sessions.length === 1 ? '' : 's'} recorded.</p>
        <p style="margin-top:8px;color:var(--muted)">A backup covers <b>both maths and science</b> plus the jar. Save one before changing device.</p>
        <div class="btn-row"><button class="btn btn-primary" data-act="export">Save a backup file</button><button class="btn" data-act="import">Restore from a file</button></div>
        <div class="btn-row" style="margin-top:8px"><button class="btn" data-go="rescue" style="font-weight:800">Candies missing? Restore them</button>${S.profiles().length > 1 ? '' : '<button class="btn" data-act="add-who">Add another child</button>'}</div>
        <div class="btn-row" style="margin-top:8px"><button class="btn btn-soft" data-act="export-copy">Copy as text instead</button><button class="btn btn-soft" data-act="import-paste">Paste text to restore</button><button class="btn" data-act="reset" style="color:var(--oops)">Reset all progress</button></div></div>
    </div>`);
  }
  /* Handing the viewer a file works differently in the two places this app runs.
   * As an ordinary web page (or the standalone file) a blob link downloads it; inside the
   * claude.ai artifact viewer a link does nothing and the host has to be asked instead.
   * Resolve which one we have once, in the background, and use whichever turned up. */
  let downloads = null, downloadsAsked = false;
  function getDownloads() {
    if (downloadsAsked) return Promise.resolve(downloads);
    downloadsAsked = true;
    try {
      if (window.claude && typeof window.claude.use === 'function') {
        return Promise.resolve(window.claude.use('downloads'))
          .then((d) => (downloads = d || null), () => (downloads = null));
      }
    } catch (e) { /* not in the artifact viewer */ }
    return Promise.resolve(null);
  }
  const copyBackup = (txt) => (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
    .then(() => toast('Backup copied. Paste it somewhere safe.'), () => prompt('Copy this backup text:', txt));
  /** Save a backup of everything: both subjects and the shared candy jar. */
  function saveBackupFile() {
    const txt = S.exportAll();
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const filename = `harper-backup-${stamp}.json`;
    const viaLink = () => {
      try {
        const url = URL.createObjectURL(new Blob([txt], { type: 'application/json' }));
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        toast('Backup saved to your downloads.');
      } catch (e) { copyBackup(txt); }   // older iPad browsers block the download trick
    };
    return getDownloads().then((dl) => {
      if (!dl) return viaLink();
      return dl.save({ filename, data: txt })
        .then(() => toast('Backup saved.'))
        .catch((err) => { if (!err || err.code !== 'declined') viaLink(); });
    });
  }
  /** Restore from a backup file the parent picks. */
  function pickBackupFile() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.style.display = 'none';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      inp.remove();
      if (!f) return;
      const r = new FileReader();
      r.onload = () => restoreBackup(String(r.result));
      r.onerror = () => toast('That file could not be read.');
      r.readAsText(f);
    };
    document.body.appendChild(inp); inp.click();
  }
  function restoreBackup(txt) {
    let info;
    try { info = S.importAll(txt); } catch (err) { return toast('That did not look like a backup.'); }
    applyTheme();
    toast(`Restored — ${info.candies} cand${info.candies === 1 ? 'y' : 'ies'} in the jar.`);
    settings();
  }

  /** plain-English audio status, so a parent can see which step is blocking the sound */
  function soundStateText() {
    if (S.settings().sounds === false) return 'Sound is switched off just above — turn it On.';
    const st = HL.sound.state();
    if (st === 'off') return 'Sound is switched off just above — turn it On.';
    if (st === 'blocked') return 'The browser has not allowed sound yet. Press the button — that counts as permission.';
    return 'Sound is on and the browser is allowing it. If you still hear nothing, check the device volume and that this browser tab is not muted.';
  }
  function applyTheme() {
    const st = S.settings();
    // set here, not on the <html> tag: the single-file/artifact build strips the outer tags
    document.documentElement.setAttribute('data-subject', HL.subject || 'maths');
    HL.sound.setEnabled(st.sounds !== false);
    document.documentElement.setAttribute('data-theme', st.theme === 'system' ? '' : st.theme);
    if (st.theme === 'system') document.documentElement.removeAttribute('data-theme');
    document.documentElement.setAttribute('data-bigtext', st.bigText ? '1' : '0');
  }

  /* ---------- effects ---------- */
  let toastT;
  function toast(msg, ms) { let el = $('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); } el.textContent = msg; clearTimeout(toastT); toastT = setTimeout(() => el.remove(), ms || 2200); }
  function sparkle(n = 14) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas'); c.className = 'confetti'; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const ctx = c.getContext('2d'); const cols = ['#F9A8C9', '#E0568C', '#FFC79A', '#A6E3B8', '#C9B8F2', '#A9D8F5', '#FFE98A'];
    const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * 0.45, vx: (Math.random() - .5) * 8, vy: -Math.random() * 9 - 3, r: 4 + Math.random() * 5, col: cols[Math.floor(Math.random() * cols.length)], rot: Math.random() * 6 }));
    let f = 0; const step = () => { ctx.clearRect(0, 0, c.width, c.height); ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rot += 0.1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.4); ctx.restore(); }); if (++f < 60) requestAnimationFrame(step); else c.remove(); };
    requestAnimationFrame(step);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const mixCard = e.target.closest('[data-mix]');
    if (mixCard) { HL.sound.unlock(); mixToggle(mixCard.dataset.mix); return topics('mix'); }
    const b = e.target.closest('[data-go],[data-act],[data-key],[data-choice],[data-go-learn],[data-eg],[data-setting] button');
    if (!b) return;
    if (b.dataset.eg) { const id = (location.hash.split('/')[1] || ''); return liveExample(id, b.dataset.eg); }
    HL.sound.unlock();
    if (b.dataset.go) return go(b.dataset.go);
    if (b.dataset.goLearn) { session = null; return go('learn/' + b.dataset.goLearn); }
    if (b.dataset.key != null) return keyPress(b.dataset.key);
    if (b.dataset.choice != null) { if (b.disabled) return; document.querySelectorAll('.choice').forEach((c) => c.classList.remove('selected')); b.classList.add('selected'); selectedChoice = Number(b.dataset.choice); return; }
    const segEl = b.closest('[data-setting]');
    if (segEl) { let v = b.dataset.v; if (v === 'true') v = true; else if (v === 'false') v = false; else if (!isNaN(v)) v = Number(v); S.setSetting(segEl.dataset.setting, v); applyTheme(); return settings(); }
    const act = b.dataset.act;
    if (act === 'mix-clear') { mix = []; return topics('mix'); }
    if (act === 'mix-go') return startMix(mix);
    if (act === 'run-last-mix') return startMix(S.lastMix().filter((id) => HL.topics[id]));
    if (act === 'preset') {
      const p = presets().find((x) => x.id === b.dataset.preset);
      return p ? startMix(p.topicIds, p.name + ' — ' + p.sub) : toast('That mix is not available.');
    }
    if (act === 'join-go') return joinGo();
    if (act === 'mixed') return startSession({ mode: 'mixed', topicIds: HL.topicList().map((t) => t.id), label: 'Mixed practice' });
    if (act === 'strand') return startSession({ mode: 'strand', topicIds: HL.topicList().filter((t) => t.strand === b.dataset.strand).map((t) => t.id), label: HL.strands[b.dataset.strand].name });
    if (act === 'topic') return startSession({ mode: 'topic', topicIds: [b.dataset.topic], label: HL.topics[b.dataset.topic].name });
    if (act === 'topic-rest') {
      const id = b.dataset.topic;
      toast(`😴 You already know ${HL.topics[id].name} well — this one is resting. This round is just for fun, no candy. Back to normal in ${S.restDaysLeft(id)}d.`, 3600);
      return startSession({ mode: 'topic', topicIds: [id], label: HL.topics[id].name, noReward: true });
    }
    if (act === 'again') {
      const s = lastSummary;
      const ids = s.mode === 'mixed' ? HL.topicList().map((t) => t.id)
        : s.mode === 'custom' ? S.lastMix().filter((id) => HL.topics[id])
        : s.topics.length ? (s.mode === 'topic' ? s.topics : HL.topicList().filter((t) => t.strand === HL.topics[s.topics[0]].strand).map((t) => t.id))
        : HL.topicList().map((t) => t.id);
      return startSession({ mode: s.mode, topicIds: ids.length ? ids : HL.topicList().map((t) => t.id), label: s.label });
    }
    if (act === 'check') { lastQuestion = session.current; return check(); }
    if (act === 'stuck') { lastQuestion = session.current; return showFeedback(session.pass()); }
    if (act === 'next') return next();
    if (act === 'resume') return resumeFromBreak();
    if (act === 'music') { HL.sound.unlock(); HL.sound.music.stop(); setTimeout(() => { HL.sound.music.start(); const btn = $('.music-btn'); if (btn) btn.textContent = HL.sound.state() === 'on' ? '🔊 Music on — tap to restart' : '🔈 Tap for music'; }, 260); return; }
    if (act === 'testsound') {
      HL.sound.unlock(); HL.sound.correct(); setTimeout(() => HL.sound.candy(), 400);
      setTimeout(() => { const el = $('#soundstate'); if (el) el.textContent = soundStateText(); }, 500);
      toast(HL.sound.state() === 'off' ? 'Sound is switched off above.' : 'Playing a test sound…');
      return;
    }
    if (act === 'print') { document.querySelectorAll('.m-working').forEach((d) => (d.open = true)); return setTimeout(() => window.print(), 60); }
    if (act === 'break-done') { HL.sound.music.stop(); if (timer) { clearInterval(timer); timer = null; } return go('home'); }
    if (act === 'quit') { const short = session ? session.shortBy() : 0; if (!session || session.count === 0 || confirm(short ? `You need ${short} more question${short === 1 ? '' : 's'} for this practice to earn candies. Stop anyway?` : 'Finish this practice now?')) { if (session && session.count) endSession(); else { leaveRoom(); session = null; go('home'); } } return; }
    if (act === 'keypad') { S.setSetting('keypad', !S.settings().keypad); return practice(); }
    if (act === 'paid') { const i = Number(b.dataset.i); const r = S.candyState().earned[i]; S.markRewardPaid(i, !(r && r.paid)); return (location.hash || '').indexOf('money') > 0 ? money() : candy(); }
    if (act === 'who') {
      const id = b.dataset.who;
      if (id === S.profile()) return;
      try { S.useProfile(id); } catch (e) { return toast('Could not swap over.'); }
      return location.reload();
    }
    if (act === 'add-who') {
      const name = prompt('What is her name?');
      if (!name || !name.trim()) return;
      let id;
      try { id = S.addProfile(name); } catch (e) { return toast('Please use a name with letters in it.'); }
      if (id === S.profile()) { settings(); return toast('That is who is practising already.'); }
      S.useProfile(id);
      return location.reload();
    }
    if (act === 'rescue-restore') {
      const r = S.rescueRestore();
      toast(r.restored > 0 ? `Put back ${r.restored} cand${r.restored === 1 ? 'y' : 'ies'}.` : 'Nothing more could be found here.');
      return rescue();
    }
    if (act === 'rescue-known') {
      const todo = restorePointNeeded();
      if (!todo.length) return toast('Her candies are already there.');
      todo.forEach((r) => S.setJarByHand(r.subject, RESTORE_POINT[r.subject]));
      sparkle(18); HL.sound.candy();
      toast('Harper\'s candies are back.');
      return rescue();
    }
    if (act === 'rescue-set') {
      const sub = b.dataset.sub;
      const num = (id) => Number((document.getElementById(id) || {}).value || 0);
      S.setJarByHand(sub, { candies: num(`fix-${sub}-jar`), prizes: num(`fix-${sub}-won`), paidPrizes: num(`fix-${sub}-paid`) });
      toast(`${subjectWord(sub)} jar saved.`);
      return rescue();
    }
    if (act === 'export') return saveBackupFile();
    if (act === 'export-copy') { copyBackup(S.exportAll()); return; }
    if (act === 'import') return pickBackupFile();
    if (act === 'import-paste') { const txt = prompt('Paste the backup text here:'); if (txt) restoreBackup(txt); return; }
    if (act === 'reset') { if (confirm('Delete all progress on this device? This cannot be undone.')) { S.reset(); toast('Progress reset.'); settings(); } return; }
  });
  document.addEventListener('keydown', (e) => {
    const card = e.target.closest && e.target.closest('[data-mix]');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); mixToggle(card.dataset.mix); return topics('mix'); }
    if (e.key === 'Enter' && session && $('#ans') && document.activeElement === $('#ans')) { e.preventDefault(); const nb = $('[data-act="next"]'); if (nb) nb.click(); else { lastQuestion = session.current; check(); } }
    else if (e.key === 'Enter' && session && $('[data-act="next"]') && !e.target.closest('input')) { e.preventDefault(); $('[data-act="next"]').click(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'nameInput') S.setSetting('name', e.target.value.trim() || 'Harper');
    if (e.target.id === 'prizeInput') S.setSetting('prize', e.target.value.trim() || '$5');
  });
  function keyPress(k) {
    const inp = $('#ans'); if (!inp) return;
    if (k === '⌫') inp.value = inp.value.slice(0, -1);
    else if (k === 'C') inp.value = '';
    else if (k === '␣') inp.value += ' ';
    else if (k === '−') inp.value += '-';
    else inp.value += k;
    inp.classList.remove('bad');
  }

  /* ---------- boot ---------- */
  /** test hook: the live question (used by scripts/browser-test.js) */
  HL.__current = () => (session ? session.current : null);
  HL.__session = () => session;   // test hook: lets the checks read the live session's levels
  // iPadOS wants the audio context resumed inside a real gesture; touch comes before click
  ['pointerdown', 'touchstart'].forEach((ev) => document.addEventListener(ev, () => HL.sound.unlock(), { passive: true }));

  HL.boot = function () {
    // deep link: ?theme=dark|light|system and ?big=1 set the display options (handy for a bookmark)
    const params = new URLSearchParams(location.search);
    if (['dark', 'light', 'system'].includes(params.get('theme'))) S.setSetting('theme', params.get('theme'));
    if (params.get('big') != null) S.setSetting('bigText', params.get('big') !== '0');
    applyTheme();
    route();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) { navigator.serviceWorker.register('sw.js').catch(() => {}); }
    // start resolving the host's file-save ability now, so the backup button does not wait on it
    getDownloads();
  };
})(window.HL);
