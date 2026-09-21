/* Builds a single self-contained HTML file (dist/harper-maths.html) — CSS + JS inlined — for sharing / Artifact publishing.
 * Usage: node scripts/build-single.js [--fragment]   (--fragment omits doctype/html/head/body wrappers) */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const SUBJECT = process.argv.includes('science') ? 'science' : 'maths';
const ENTRY = SUBJECT === 'science' ? 'science.html' : 'index.html';
const OUT = SUBJECT === 'science' ? 'dist/harper-science' : 'dist/harper-maths';
const html = fs.readFileSync(path.join(root, ENTRY), 'utf8');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
let out = html
  .replace(/<link rel="stylesheet" href="css\/app.css">/, () => `<style>\n${read('css/app.css')}\n</style>`)
  .replace(/<script src="([^"]+)"><\/script>/g, (m, src) => `<script>\n${read(src)}\n</script>`)
  .replace(/<link rel="manifest"[^>]*>\n?/, '')
  .replace(/<link rel="apple-touch-icon"[^>]*>\n?/, '')
  .replace(/<link rel="icon" href="([^"]+)"[^>]*>\n?/, (m, href) => `<link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(read(href)).toString('base64')}">\n`);
// no service worker in the single-file build
out = out.replace(/navigator\.serviceWorker\.register\('sw\.js'\)\.catch\(\(\) => \{\}\);/, '');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, OUT + '.html'), out);
if (process.argv.includes('--fragment')) {
  const frag = out.replace(/^[\s\S]*?<head>\s*/, '').replace(/<\/head>\s*<body>\s*/, '').replace(/\s*<\/body>\s*<\/html>\s*$/, '')
    .replace(/<meta charset="utf-8">\n?/, '').replace(/<meta name="viewport"[^>]*>\n?/, '');
  fs.writeFileSync(path.join(root, OUT + '.fragment.html'), frag);
}
console.log('built ' + OUT + '.html', (out.length / 1024).toFixed(0) + ' KB');
