/* Renders a topic's learn-block SVGs to PNG for eyeballing. Usage: node scripts/render-learn.js <topicId> [outDir] */
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const id = process.argv[2]; if (!id) { console.error('topic id required'); process.exit(1); }
const out = process.argv[3] || process.env.LEARN_OUT || '/tmp/claude-0/-home-user-ptc-workspace/d5e2b634-2e1d-57bf-8742-4291bc32ca70/scratchpad';
const ctx = { window: {}, console, Math, Number, String, Object, Array, JSON, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['js/core/rng.js', 'js/core/num.js', 'js/core/registry.js', 'js/core/mark.js', 'js/core/store.js'].forEach(load);
const candidates = ['js/maths/topics/' + id + '.js', 'js/science/topics/' + id + '.js'];
const file = candidates.find((f) => fs.existsSync(path.join(root, f)));
if (!file) { console.error('no topic file for ' + id); process.exit(1); }
load(file);
const t = ctx.HL.topics[id]; if (!t) { console.error('no topic ' + id); process.exit(1); }
const CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const css = fs.readFileSync(path.join(root, 'css/app.css'), 'utf8');
const items = [['concept', t.learn.visual]].concat((t.learn.examples || []).map((e, i) => ['example' + (i + 1), e.visual]).filter((x) => x[1]));
for (const [name, svg] of items) {
  const html = `<!doctype html><html><head><style>${css}</style></head><body style="padding:12px;background:#fff"><div class="q-visual" style="display:inline-block">${svg}</div></body></html>`;
  const f = path.join(out, `learn-${id}-${name}.html`); fs.writeFileSync(f, html);
  const png = path.join(out, `learn-${id}-${name}.png`);
  try { execFileSync(CH, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=420,420', `--screenshot=${png}`, 'file://' + f], { stdio: 'ignore' }); console.log('wrote', png); } catch (e) { console.error('render failed', name, e.message); }
}
