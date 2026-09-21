/* Simulates practice sessions headlessly to catch engine/marking errors. Usage: node scripts/sim-session.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const mem = {};
const ctx = { console, Math, Number, String, Object, Array, JSON, Date, localStorage: { getItem: (k) => mem[k] || null, setItem: (k, v) => { mem[k] = v; } } };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['js/core/rng.js', 'js/core/num.js', 'js/core/registry.js', 'js/core/mark.js', 'js/core/store.js', 'js/core/engine.js'].forEach(load);
['js/maths/topics', 'js/science/topics'].forEach((d) => { const abs = path.join(root, d); if (fs.existsSync(abs)) fs.readdirSync(abs).filter((f) => f.endsWith('.js')).forEach((f) => load(d + '/' + f)); });
const HL = ctx.HL;
const all = HL.topicList('maths').map((t) => t.id);
let kinds = { calc: 0, word: 0 }, levels = { 1: 0, 2: 0, 3: 0 };
for (let s = 0; s < 40; s++) {
  const sess = new HL.Session({ mode: 'mixed', topicIds: all, label: 'sim', minutes: 15, target: 14 });
  while (!sess.isFinished()) {
    const q = sess.next(); kinds[q.kind]++; levels[q.level]++;
    const a = q.answer;
    const right = a.type === 'number' ? String(a.value) : a.type === 'fraction' ? `${a.value.n}/${a.value.d}` : a.type === 'choice' ? a.value : a.value;
    const roll = Math.random();
    if (roll < 0.6) { const r = sess.answer(right); if (r.status !== 'correct') throw new Error('right answer not accepted: ' + q.topicId + ' ' + q.prompt + ' -> ' + right + ' ' + JSON.stringify(r)); }
    else if (roll < 0.85) { const r1 = sess.answer(a.type === 'choice' ? (a.value + 1) % a.choices.length : '999999'); if (r1.status !== 'retry') throw new Error('expected retry ' + JSON.stringify(r1) + q.prompt); const r2 = sess.answer(right); if (r2.status !== 'correct') throw new Error('2nd try not accepted ' + q.prompt); }
    else { const r1 = sess.pass(); if (r1.status !== 'retry') throw new Error('pass1'); const r2 = sess.answer(a.type === 'choice' ? 0 : '-123456'); if (!['reveal', 'correct'].includes(r2.status)) throw new Error('expected reveal ' + JSON.stringify(r2)); }
  }
  const sum = sess.summary(); HL.store.saveSession(sum);
  if (sum.total !== 14) throw new Error('total ' + sum.total);
}
const d = HL.store.get();
console.log('sessions ok:', d.sessions.length, 'kinds', kinds, 'word share', (kinds.word / (kinds.calc + kinds.word)).toFixed(2), 'levels', levels);
const untouched = all.filter((id) => !d.topics[id]); console.log('topics never picked:', untouched.length ? untouched : 'none');
const lv = Object.entries(d.topics).map(([id, t]) => `${id}:L${t.level}`).join(' '); console.log(lv);
