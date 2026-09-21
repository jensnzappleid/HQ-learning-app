/* Node harness: loads core + topic files and stress-tests every generator.
 * Usage: node scripts/check-topics.js [topicId ...]   (no args = all topics) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {}, console, Math, Number, String, Object, Array, JSON, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['js/core/rng.js', 'js/core/num.js', 'js/core/registry.js', 'js/core/mark.js', 'js/core/store.js'].forEach(load);
for (const dir of ['js/maths/topics', 'js/science/topics']) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  fs.readdirSync(abs).filter((f) => f.endsWith('.js')).sort().forEach((f) => load(dir + '/' + f));
}
const HL = ctx.HL;
const only = process.argv.slice(2);
let bad = 0;
const ids = Object.keys(HL.topics).filter((id) => !only.length || only.includes(id));
for (const id of ids) {
  const t = HL.topics[id];
  const problems = [];
  const req = ['strand', 'name', 'short', 'blurb', 'example', 'animal', 'learn', 'generate', 'subject'];
  req.forEach((k) => { if (!t[k]) problems.push('missing ' + k); });
  if (t.learn) ['what', 'steps', 'examples', 'tips', 'visual'].forEach((k) => { if (!t.learn[k]) problems.push('learn missing ' + k); });
  if (t.learn && Array.isArray(t.learn.examples) && t.learn.examples.length < 5) problems.push(`only ${t.learn.examples.length} worked examples (need ≥ 5)`);
  if (t.learn && t.learn.visual && !/^<svg[\s\S]*<\/svg>$/.test(t.learn.visual.trim())) problems.push('learn.visual must be a single <svg> element');
  const seen = new Set();
  for (const level of [1, 2, 3]) for (const kind of ['calc', 'word']) {
    for (let i = 0; i < 150; i++) {
      let q;
      try { q = t.generate(level, kind); } catch (e) { problems.push(`L${level} ${kind}: throws ${e.message}`); break; }
      if (!q || !q.prompt) { problems.push(`L${level} ${kind}: no prompt`); break; }
      if (!q.answer || !['number', 'fraction', 'text', 'choice'].includes(q.answer.type)) { problems.push(`L${level} ${kind}: bad answer type`); break; }
      if (!Array.isArray(q.working) || !q.working.length) { problems.push(`L${level} ${kind}: no working`); break; }
      if (!q.hint) { problems.push(`L${level} ${kind}: no hint`); break; }
      if (q.finalAnswer == null) { problems.push(`L${level} ${kind}: no finalAnswer`); break; }
      const a = q.answer;
      if (a.type === 'number' && (typeof a.value !== 'number' || !isFinite(a.value))) { problems.push(`L${level} ${kind}: number value not finite: ${a.value}`); break; }
      if (a.type === 'number' && Math.abs(a.value * 1e6 - Math.round(a.value * 1e6)) > 1e-6 && a.tolerance == null) { problems.push(`L${level} ${kind}: messy decimal answer ${a.value} without tolerance (prompt: ${q.prompt.slice(0, 80)})`); break; }
      if (a.type === 'fraction' && (!a.value || !Number.isInteger(a.value.n) || !Number.isInteger(a.value.d) || a.value.d <= 0)) { problems.push(`L${level} ${kind}: bad fraction value`); break; }
      if (a.type === 'choice' && (!Array.isArray(a.choices) || a.choices.length < 2 || a.value < 0 || a.value >= a.choices.length)) { problems.push(`L${level} ${kind}: bad choice`); break; }
      if (a.type === 'text' && typeof a.value !== 'string') { problems.push(`L${level} ${kind}: text value not string`); break; }
      // the correct answer, typed plainly, must mark as correct
      const typed = a.type === 'number' ? String(a.value) : a.type === 'fraction' ? `${HL.num.simplify(a.value.n, a.value.d).n}/${HL.num.simplify(a.value.n, a.value.d).d}` : a.value;
      const m = HL.mark(q, typed);
      if (!m.ok) { problems.push(`L${level} ${kind}: own answer does not mark correct (${typed}) prompt: ${q.prompt.slice(0, 80)}`); break; }
      if (/undefined|NaN|\[object/.test(q.prompt + q.working.join('') + q.hint + q.finalAnswer)) { problems.push(`L${level} ${kind}: undefined/NaN in text: ${q.prompt.slice(0, 100)}`); break; }
      seen.add(q.prompt);
    }
  }
  if (seen.size < 40) problems.push(`low variety: only ${seen.size} distinct prompts over 900 generations`);
  if (problems.length) { bad++; console.log(`✗ ${id}\n   ` + problems.join('\n   ')); } else console.log(`✓ ${id} (${seen.size} distinct prompts)`);
}
console.log(`\n${ids.length - bad}/${ids.length} topics OK`);
process.exit(bad ? 1 : 0);
