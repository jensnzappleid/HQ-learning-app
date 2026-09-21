/* Counts the distinct WORD-PROBLEM scenarios each topic can produce, per level.
 * A "scenario" is the prompt with numbers, names and units stripped out, so two questions
 * that differ only in their numbers count once. Usage: node scripts/audit-word-problems.js [subject] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const subject = process.argv[2] || 'maths';
const ctx = { window: {}, console: { log() {}, warn() {}, error() {} }, Math, Number, String, Object, Array, JSON, Date, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['js/core/rng.js', 'js/core/num.js', 'js/core/registry.js', 'js/core/mark.js', 'js/core/store.js'].forEach(load);
['js/maths/topics', 'js/science/topics'].forEach((d) => { const abs = path.join(root, d); if (fs.existsSync(abs)) fs.readdirSync(abs).filter((f) => f.endsWith('.js')).forEach((f) => load(d + '/' + f)); });
const HL = ctx.HL;
const NAMES = /\b(Harper|Mia|Tane|Aroha|Kiri|Ana|Ben|Ella|Sophie|Sophia|Nikau|Manu|Ruby|Leo|Zoe|Jack|Amaia|Hemi|Tama|Sam|Olivia|Liam|Maia|Kauri|Rangi|Ihaka|Aria|Noah|Ari|Eva|Rewa)\b/g;
const norm = (s) => s.replace(/<[^>]*>/g, ' ').replace(NAMES, 'X').replace(/[\d.,$%°]+/g, '#').replace(/\s+/g, ' ').trim().slice(0, 90);
const rows = [];
for (const t of HL.topicList(subject)) {
  const perLevel = { 1: new Set(), 2: new Set(), 3: new Set() };
  for (const level of [1, 2, 3]) for (let i = 0; i < 400; i++) {
    try { perLevel[level].add(norm(HL.makeQuestion(t.id, level, 'word').prompt)); } catch (e) { /* generator picked a bad roll */ }
  }
  const all = new Set([...perLevel[1], ...perLevel[2], ...perLevel[3]]);
  rows.push({ id: t.id, strand: t.strand, l1: perLevel[1].size, l2: perLevel[2].size, l3: perLevel[3].size, total: all.size });
}
rows.sort((a, b) => a.total - b.total);
const short = rows.filter((r) => r.total < 5 || Math.min(r.l1, r.l2, r.l3) === 0);
console.log(`${subject}: ${rows.length} topics · word-problem scenarios (distinct, numbers ignored)\n`);
console.log('topic'.padEnd(24) + 'L1   L2   L3   total');
rows.forEach((r) => console.log(r.id.padEnd(24) + String(r.l1).padEnd(5) + String(r.l2).padEnd(5) + String(r.l3).padEnd(5) + r.total + (r.total < 5 ? '   ← under 5' : (Math.min(r.l1, r.l2, r.l3) === 0 ? '   ← a level has none' : ''))));
console.log(`\n${short.length} topic(s) need more word problems: ${short.map((r) => r.id).join(', ') || 'none'}`);
process.exit(short.length ? 1 : 0);
