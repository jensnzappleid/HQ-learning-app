/* Harper Learning — sound. Everything is synthesised with the Web Audio API:
 * no audio files, no copyright, works offline. HL.sound.correct() / .wrong() / .candy() / .prize()
 * and HL.sound.music.start() / .stop() for the wiggle-break loop. */
window.HL = window.HL || {};
(function (HL) {
  let ctx = null, master = null, muted = false;
  const ready = () => {
    if (muted) return null;
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  };
  /** Run fn once the context is really running.
   *  resume() is asynchronous, and a suspended context's currentTime does not advance — so anything
   *  scheduled before it resumes lands in the past and is silently dropped. That is why the break
   *  music played on a laptop but not on the iPad, where the context starts suspended. */
  const whenRunning = (fn) => {
    const c = ready(); if (!c) return;
    if (c.state === 'running') return fn(c);
    let done = false;
    const go = () => { if (done || !ctx || ctx.state !== 'running') return; done = true; fn(ctx); };
    try { const p = c.resume(); if (p && p.then) p.then(go, () => {}); } catch (e) { /* older webkit */ }
    // webkit sometimes resumes without settling the promise, so poll briefly as well
    let tries = 0;
    const iv = setInterval(() => { if (done || ++tries > 20) return clearInterval(iv); if (ctx && ctx.state === 'running') { clearInterval(iv); go(); } }, 100);
  };
  /** one note. type: 'sine' | 'triangle' | 'square' | 'sawtooth' */
  function note(freq, at, dur, { type = 'triangle', gain = 0.18, bus = null } = {}) {
    const c = ready(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
    o.connect(g); g.connect(bus || master);
    o.start(at); o.stop(at + dur + 0.02); S._debug.scheduled++;
  }
  /** short noise burst, used for the hi-hat */
  function hat(at, dur = 0.045, gain = 0.055) {
    const c = ready(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500;
    const g = c.createGain(); g.gain.value = gain;
    src.connect(hp); hp.connect(g); g.connect(master);
    src.start(at);
  }
  /** four-on-the-floor kick: a fast pitch drop */
  function kick(at, gain = 0.5) {
    const c = ready(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(160, at); o.frequency.exponentialRampToValueAtTime(46, at + 0.12);
    g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.24);
    o.connect(g); g.connect(master); o.start(at); o.stop(at + 0.26); S._debug.scheduled++;
  }
  /** hand clap on beats 2 and 4: three quick filtered noise taps */
  function clap(at, gain = 0.22) {
    const c = ready(); if (!c) return;
    [0, 0.012, 0.026].forEach((off, i) => {
      const n = Math.floor(c.sampleRate * 0.12);
      const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let k = 0; k < n; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / n, 3);
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 1.2;
      const g = c.createGain(); g.gain.value = gain * (i === 2 ? 1 : 0.6);
      src.connect(bp); bp.connect(g); g.connect(master); src.start(at + off);
    });
    S._debug.scheduled++;
  }
  /** short plucky synth note (saw through a falling low-pass), the K-pop pluck sound */
  function pluck(freq, at, dur, gain = 0.09) {
    const c = ready(); if (!c) return;
    const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(freq, at);
    f.type = 'lowpass'; f.frequency.setValueAtTime(Math.min(7000, freq * 7), at);
    f.frequency.exponentialRampToValueAtTime(Math.max(500, freq * 1.6), at + dur);
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
    o.connect(f); f.connect(g); g.connect(master); o.start(at); o.stop(at + dur + 0.02); S._debug.scheduled++;
  }
  const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
              C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77, C6: 1046.5,
              C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
              A2: 110.00, C2: 65.41, F2: 87.31, G2: 98.00, E2: 82.41, D2: 73.42,
              Fs4: 369.99, Fs5: 739.99, B2: 123.47 };

  const S = {
    get enabled() { return !muted; },
    /** 'off' when muted, 'blocked' when the browser has not allowed audio yet, else 'on' */
    state() { if (muted) return 'off'; if (!ctx) return 'blocked'; return ctx.state === 'running' ? 'on' : 'blocked'; },
    setEnabled(on) { muted = !on; if (!on) S.music.stop(); },
    /** a click somewhere in the page: browsers only allow audio to start from a gesture */
    unlock() { ready(); },
    correct() { whenRunning((c) => { const t = c.currentTime; note(N.E5, t, 0.12, { gain: 0.16 }); note(N.G5, t + 0.09, 0.16, { gain: 0.16 }); }); },
    /** "have another go" — deliberately soft, warm and neutral. Never a falling or buzzy sound:
     *  a discouraging noise after a wrong answer is the fastest way to make her stop trying. */
    wrong() { whenRunning((c) => { const t = c.currentTime; note(N.A4, t, 0.22, { type: 'sine', gain: 0.07 }); }); },
    candy() { whenRunning((c) => { const t = c.currentTime; [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => note(f, t + i * 0.07, 0.22, { gain: 0.15 })); }); },
    prize() {
      whenRunning((c) => { const t = c.currentTime;
      [[N.C5, 0], [N.E5, 0.12], [N.G5, 0.24], [N.C6, 0.36], [N.G5, 0.52], [N.C6, 0.62]].forEach(([f, d]) => note(f, t + d, 0.3, { gain: 0.17 }));
      [[N.C3, 0], [N.G3, 0.24], [N.C3, 0.5]].forEach(([f, d]) => note(f, t + d, 0.3, { type: 'sine', gain: 0.12 }));
      });
    },
    /** K-pop style loop for the wiggle break: four-on-the-floor kick, claps on 2 and 4,
     *  offbeat hats, a syncopated bass and a bright pluck hook over Am - F - C - G. */
    music: (function () {
      const BPM = 124, beat = 60 / BPM, bar = beat * 4;
      // hook melody per bar: [frequency, offset in beats, length in beats]
      const HOOK = [
        [[N.A4, 0, .5], [N.C5, .5, .5], [N.E5, 1, .75], [N.D5, 1.75, .25], [N.C5, 2, .5], [N.A4, 2.5, .5], [N.E5, 3, .75]],
        [[N.F4, 0, .5], [N.A4, .5, .5], [N.C5, 1, .75], [N.A4, 1.75, .25], [N.G4, 2, .5], [N.F5, 2.5, .5], [N.C5, 3, .75]],
        [[N.G4, 0, .5], [N.C5, .5, .5], [N.E5, 1, .5], [N.G5, 1.5, .5], [N.E5, 2, .5], [N.C5, 2.5, .5], [N.D5, 3, .75]],
        [[N.D5, 0, .5], [N.G5, .5, .5], [N.Fs5, 1, .5], [N.D5, 1.5, .5], [N.B4, 2, .5], [N.G4, 2.5, .5], [N.D5, 3, .75]],
      ];
      // chord tones for the pluck arpeggio, and the bass root for each bar
      const CHORDS = [[N.A4, N.C5, N.E5], [N.F4, N.A4, N.C5], [N.C5, N.E5, N.G5], [N.B4, N.D5, N.G5]];
      const ROOTS = [N.A2, N.F2, N.C2, N.G2];
      // syncopated bass pattern (offsets in beats)
      const BASS_HITS = [0, 0.75, 1.5, 2, 3, 3.5];
      let timer = null, barIndex = 0, nextTime = 0;
      function scheduleBar(i, at) {
        const c = i % 4;
        for (let b = 0; b < 4; b++) kick(at + b * beat, b === 0 ? 0.55 : 0.45);          // four on the floor
        clap(at + beat); clap(at + 3 * beat);                                            // 2 and 4
        for (let e = 0; e < 8; e++) hat(at + e * beat / 2, 0.035, e % 2 ? 0.06 : 0.025);  // offbeat accent
        BASS_HITS.forEach((off) => note(ROOTS[c], at + off * beat, beat * 0.42, { type: 'sawtooth', gain: 0.13 }));
        for (let e = 0; e < 8; e++) pluck(CHORDS[c][e % 3], at + e * beat / 2, beat * 0.35, 0.07);
        HOOK[c].forEach(([f, off, len]) => note(f, at + off * beat, len * beat * 0.92, { type: 'square', gain: 0.11 }));
        if (c === 3) { [N.A5, N.C6, N.E5].forEach((f, k) => pluck(f, at + 3.5 * beat + k * beat / 8, beat * 0.3, 0.05)); }
      }
      return {
        _scheduleBarAt: scheduleBar,
        start() {
          if (timer) return;
          whenRunning((c) => {
            if (timer) return;
            barIndex = 0; nextTime = c.currentTime + 0.12;   // anchored to the running clock, never to 0
            const pump = () => {
              if (!ctx || ctx.state !== 'running') return;
              const now = ctx.currentTime;
              if (nextTime < now) nextTime = now + 0.05;      // never schedule into the past
              while (nextTime < now + 1.2) { scheduleBar(barIndex++, nextTime); nextTime += bar; }
            };
            pump(); timer = setInterval(pump, 400);
          });
        },
        stop() {
          if (timer) { clearInterval(timer); timer = null; }
          if (master && ctx) {
            const t = ctx.currentTime;
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(master.gain.value, t);
            master.gain.linearRampToValueAtTime(0.0001, t + 0.25);
            setTimeout(() => { if (master && ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0.8, ctx.currentTime); } }, 320);
          }
        },
      };
    })(),
    _debug: { scheduled: 0 },
    /** test hook: puts the context back into the state an iPad starts in */
    _suspendForTest() { try { if (ctx) ctx.suspend(); } catch (e) {} },
    /** Renders `seconds` of the break loop into an offline context and returns its peak and RMS
     *  amplitude, so a test can prove the music is audible rather than silent. */
    async _renderTest(seconds = 4) {
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OAC) return { error: 'no OfflineAudioContext' };
      const keepCtx = ctx, keepMaster = master, keepMuted = muted;
      muted = false;
      ctx = new OAC(1, 44100 * seconds, 44100);
      master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
      const bpm = 124, bar = (60 / bpm) * 4;
      let t = 0.05, i = 0;
      while (t < seconds - bar) { S.music._scheduleBarAt(i++, t); t += bar; }
      const buf = await ctx.startRendering();
      const d = buf.getChannelData(0);
      let peak = 0, sum = 0;
      for (let k = 0; k < d.length; k++) { const v = Math.abs(d[k]); if (v > peak) peak = v; sum += v * v; }
      ctx = keepCtx; master = keepMaster; muted = keepMuted;
      return { peak: Math.round(peak * 1000) / 1000, rms: Math.round(Math.sqrt(sum / d.length) * 1000) / 1000, seconds };
    },
  };
  HL.sound = S;
})(window.HL);
