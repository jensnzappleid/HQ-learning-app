/* Drives the real app (needs a static server on :8765 — e.g. python3 -m http.server 8765 — and Chromium at CH)  in headless Chromium over CDP: plays a full session, checks every UI path. */
const { spawn } = require('child_process');
const http = require('http');
const CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/* usage: node scripts/browser-test.js [science]  — defaults to the maths page */
const SUBJECT = process.argv[2] === 'science' ? 'science' : 'maths';
const PAGE = 'http://localhost:8765/' + (SUBJECT === 'science' ? 'science.html' : 'index.html');
// a per-process port so several runs (or several agents) never fight over one debugger
const port = Number(process.env.CDP_PORT) || (9300 + (process.pid % 600));
const chrome = spawn(CH, ['--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, '--window-size=820,1100', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (u) => new Promise((res, rej) => http.get(u, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
(async () => {
  let targets; for (let i = 0; i < 40; i++) { try { targets = await getJson(`http://localhost:${port}/json`); break; } catch (e) { await sleep(250); } }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = {}; const errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push('console.error: ' + d.params.args.map((a) => a.value || a.description).join(' ')); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text)); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate', { url: PAGE + '#home' });
  for (let i = 0; i < 80; i++) { await sleep(250); if (await ev("typeof HL !== 'undefined' && !!HL.__current && document.querySelector('#app .screen') !== null")) break; }
  const topics = await ev('Object.keys(HL.topics).length'); console.log('topics loaded:', topics);
  // mixed session of 30 questions: answer correctly, wrongly-then-right, or not-sure, exercising each feedback path
  await ev(`HL.store.setSetting('questions', 30); location.hash = '#start/mixed'`); await sleep(500);
  let n = 0;
  const click = (sel) => ev(`(function(){const b=document.querySelector('${sel}');if(!b)return false;b.click();return true})()`);
  // a word question's working pad must have real ink on it before Check will submit — a synthetic
  // pointer drag exercises the same listeners a real finger/mouse would, not a test-only bypass
  const drawPad = () => ev(`(function(){
    const c=document.getElementById('workpad'); if(!c) return false;
    const r=c.getBoundingClientRect(); const x=r.left+r.width/2, y=r.top+r.height/2;
    const o={pointerId:1,clientX:x,clientY:y,bubbles:true,cancelable:true};
    c.dispatchEvent(new PointerEvent('pointerdown',o));
    c.dispatchEvent(new PointerEvent('pointermove',Object.assign({},o,{clientX:x+15,clientY:y+8})));
    c.dispatchEvent(new PointerEvent('pointerup',o));
    return true;})()`);
  const drawPadIfWord = async () => { if ((await ev(`HL.__current() && HL.__current().kind`)) === 'word') await drawPad(); };
  while (n < 30) {
    let info = await ev(`(function(){const p=document.getElementById('prompt');if(!p)return null;return {choice:!!document.getElementById('choices'), prompt:p.textContent.slice(0,60)}})()`);
    if (!info && await ev(`!!document.querySelector('.breakscreen')`)) {   // halfway wiggle break
      console.log('wiggle break shown at question', n);
      await click('[data-act="resume"]'); await sleep(120);
      info = await ev(`(function(){const p=document.getElementById('prompt');if(!p)return null;return {choice:!!document.getElementById('choices'), prompt:p.textContent.slice(0,60)}})()`);
    }
    if (!info) { const h = await ev('location.hash'); if (h === '#summary') break; throw new Error('no prompt at ' + h); }
    const mode = n % 3;
    const right = await ev(`(function(){const s=window.__s||null;return null})()`);
    // reach the current question through the closure-free API: re-generate answer from DOM is impossible, so expose via HL for the test
    const ans = await ev(`(function(){const q=HL.__current();const a=q.answer;return a.type==='number'?String(a.value):a.type==='fraction'?a.value.n+'/'+a.value.d:a.type==='choice'?String(a.value):a.value})()`);
    const type = await ev(`HL.__current().answer.type`);
    const typeIn = async (v) => { if (type === 'choice') await ev(`document.querySelector('.choice[data-choice="${v}"]').click()`); else await ev(`document.getElementById('ans').value=${JSON.stringify(v)}`); };
    // a wrong answer that is a valid answer of the right shape, not a typo (which the app declines to mark)
    const wrongOf = async () => {
      if (type === 'choice') return String((Number(ans) + 1) % (await ev('HL.__current().answer.choices.length')));
      if (type === 'fraction') return '97/101';
      if (type === 'text') return 'definitely not the answer';
      return String(Number(await ev(`HL.__current().answer.value`)) + 37.5);
    };
    if (mode === 0) { await typeIn(ans); await drawPadIfWord(); await click('[data-act="check"]'); await sleep(50); const fb = await ev(`document.querySelector('.feedback')?.className`); if (!/correct/.test(fb)) throw new Error('expected correct feedback, got ' + fb + ' for ' + info.prompt + ' ans ' + ans); await click('[data-act="next"]'); await sleep(60); }
    else if (mode === 1) {
      // wrong is marked wrong immediately (reveal), then a same-skill correction with new numbers, answered right
      await typeIn(await wrongOf()); await drawPadIfWord(); await click('[data-act="check"]'); await sleep(50);
      let fb = await ev(`document.querySelector('.feedback')?.className`); if (!/reveal/.test(fb)) throw new Error('expected reveal on a wrong answer, got ' + fb + ' ' + info.prompt);
      await click('[data-act="next"]'); await sleep(60);
      const redoNow = await ev(`!!(HL.__current() && HL.__current().isRedo)`); if (!redoNow) throw new Error('expected a same-skill correction after a wrong answer, ' + info.prompt);
      const rtype = await ev(`HL.__current().answer.type`);
      const rans = await ev(`(function(){const a=HL.__current().answer;return a.type==='number'?String(a.value):a.type==='fraction'?a.value.n+'/'+a.value.d:a.type==='choice'?String(a.value):a.value})()`);
      if (rtype === 'choice') await ev(`document.querySelector('.choice[data-choice="${rans}"]').click()`); else await ev(`document.getElementById('ans').value=${JSON.stringify(rans)}`);
      await drawPadIfWord(); await click('[data-act="check"]'); await sleep(50);
      fb = await ev(`document.querySelector('.feedback')?.className`); if (!/correct/.test(fb)) throw new Error('expected correct on the correction, got ' + fb + ' ' + info.prompt);
      await click('[data-act="next"]'); await sleep(60);
    }
    else { await click('[data-act="stuck"]'); await sleep(50); const fb = await ev(`document.querySelector('.feedback')?.className`); if (!/reveal/.test(fb)) throw new Error('expected reveal, got ' + fb); const steps = await ev(`document.querySelectorAll('.working > div').length`); if (!steps) throw new Error('no working shown');
      await click('[data-act="next"]'); await sleep(60);
      // "Show me how" also owes a same-skill correction, answered right so the loop keeps moving
      const redoNow = await ev(`!!(HL.__current() && HL.__current().isRedo)`);
      if (redoNow) {
        const rtype = await ev(`HL.__current().answer.type`);
        const rans = await ev(`(function(){const a=HL.__current().answer;return a.type==='number'?String(a.value):a.type==='fraction'?a.value.n+'/'+a.value.d:a.type==='choice'?String(a.value):a.value})()`);
        if (rtype === 'choice') await ev(`document.querySelector('.choice[data-choice="${rans}"]').click()`); else await ev(`document.getElementById('ans').value=${JSON.stringify(rans)}`);
        await drawPadIfWord(); await click('[data-act="check"]'); await sleep(50);
        const fb2 = await ev(`document.querySelector('.feedback')?.className`); if (!/correct/.test(fb2)) throw new Error('expected correct on the correction after Show me how, got ' + fb2);
        await click('[data-act="next"]'); await sleep(60);
      }
    }
    n++;
  }
  await sleep(300);
  console.log('hash after session:', await ev('location.hash'), '| summary title:', await ev(`document.querySelector('h1')?.textContent`));
  for (const h of ['#progress', '#topics', '#topics/learn', '#learn/probability', '#settings', '#home']) { await ev(`location.hash='${h}'`); await sleep(250); const ok = await ev(`document.querySelector('#app .screen')?.children.length > 1`); console.log(h, ok ? 'renders' : 'EMPTY'); }
  // a topic session for every topic: 3 questions each, all paths
  for (const tid of await ev('Object.keys(HL.topics)')) {
    await ev(`HL.store.setSetting('questions', 3); location.hash='#start/topic/${tid}'`); await sleep(150);
    for (let i = 0; i < 3; i++) { const type = await ev(`HL.__current().answer.type`); const ans = await ev(`(function(){const a=HL.__current().answer;return a.type==='number'?String(a.value):a.type==='fraction'?a.value.n+'/'+a.value.d:a.type==='choice'?String(a.value):a.value})()`); if (type === 'choice') await ev(`document.querySelector('.choice[data-choice="${ans}"]').click()`); else await ev(`document.getElementById('ans').value=${JSON.stringify(ans)}`); await drawPadIfWord(); await click('[data-act="check"]'); await sleep(30); const fb = await ev(`document.querySelector('.feedback')?.className`); if (!/correct/.test(fb)) throw new Error(tid + ': expected correct, got ' + fb + ' ans=' + ans); await click('[data-act="next"]'); await sleep(30); }
    const h = await ev('location.hash'); if (h !== '#summary') throw new Error(tid + ': did not reach summary: ' + h);
  }
  console.log('all topic sessions OK');
  // revision notes: every topic renders, and the live-example buttons produce a worked example
  for (const tid of await ev('Object.keys(HL.topics)')) {
    await ev(`location.hash='#learn/${tid}'`); await sleep(120);
    const n = await ev(`document.querySelectorAll('.learn .example-box').length`); if (n < 5) throw new Error(tid + ': only ' + n + ' examples rendered');
    const svg = await ev(`!!document.querySelector('.learn-visual svg')`); if (!svg) throw new Error(tid + ': no concept diagram');
    for (const eg of ['1', '3', 'word']) { await click(`[data-eg="${eg}"]`); await sleep(40); const ok = await ev(`!!document.querySelector('#live-example .example-box .a')`); if (!ok) throw new Error(tid + ': live example ' + eg + ' failed'); }
  }
  console.log('all revision notes OK');
  console.log('JS errors:', errors.length ? errors : 'none');
  chrome.kill(); process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error('FAIL', e.message); chrome.kill(); process.exit(1); });
