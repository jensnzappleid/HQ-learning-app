/* Harper Learning — cross-device shared working pad.
 *
 * Two devices, same short room code, one Firebase Realtime Database: strokes
 * drawn on either side reach the other within about a second, whenever both
 * are online. There is no account system — a room is just a path in the
 * database, named by a 4-letter code either side can create or join.
 *
 * Entirely optional: if `HL.syncConfig` is missing, or the Firebase scripts
 * failed to load (offline, or the CDN is blocked), `available()` returns
 * false and every caller falls back to the single-device pad — nothing here
 * is required for the app to work.
 */
window.HL = window.HL || {};
(function (HL) {
  const deviceId = (() => {
    try {
      let id = localStorage.getItem('hl-device-id');
      if (!id) { id = Math.random().toString(36).slice(2, 10); localStorage.setItem('hl-device-id', id); }
      return id;
    } catch (e) { return 'dev-' + Math.random().toString(36).slice(2, 8); }
  })();

  let db = null, ready = false, initTried = false;
  function ensureInit() {
    if (initTried) return ready;
    initTried = true;
    try {
      if (!window.firebase || !HL.syncConfig || !HL.syncConfig.apiKey) return false;
      firebase.initializeApp(HL.syncConfig);
      db = firebase.database();
      ready = true;
    } catch (e) { ready = false; }
    return ready;
  }

  // no O/0/I/1 — nothing a child reads out loud gets confused
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function makeCode() {
    let s = '';
    for (let i = 0; i < 4; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    return s;
  }

  /**
   * One shared pad. Either side can draw; strokes carry `by` so a device never
   * re-draws its own ink from the echo. Each fresh question gets its own
   * `q/<key>/strokes` sub-path (set via startQuestion, called by whichever side
   * owns the quiz) so old ink never bleeds into a new question and old data
   * does not pile up — the previous question's node is deleted as soon as a
   * new one starts.
   */
  class Room {
    constructor(code) {
      this.code = code;
      this.ref = db.ref('rooms/' + code);
      this.onStroke = null;     // (seg) => void — a segment drawn by the other side
      this.onClearLocal = null; // () => void — blank the canvas (new question, or a Clear tap)
      this.onPeer = null;       // (present: bool) => void
      this.peerSeen = false;
      this._qKey = null;
      this._strokeHandler = null;

      this._presenceHandler = (snap) => {
        const v = snap.val() || {};
        const other = Object.keys(v).some((id) => id !== deviceId && Date.now() - (v[id] || 0) < 15000);
        if (other !== this.peerSeen) { this.peerSeen = other; if (this.onPeer) this.onPeer(other); }
      };
      this.ref.child('presence').on('value', this._presenceHandler);
      this._beat();
      this._beatTimer = setInterval(() => this._beat(), 6000);
      try { this.ref.child('presence/' + deviceId).onDisconnect().remove(); } catch (e) {}

      this._qHandler = (snap) => {
        const key = snap.val();
        if (!key || key === this._qKey) return;
        this._attachQuestion(key);
      };
      this.ref.child('currentQ').on('value', this._qHandler);
    }
    _beat() { try { this.ref.child('presence/' + deviceId).set(firebase.database.ServerValue.TIMESTAMP); } catch (e) {} }
    _attachQuestion(key) {
      const prev = this._qKey;
      if (prev && this._strokeHandler) {
        try { this.ref.child('q/' + prev + '/strokes').off('child_added', this._strokeHandler); } catch (e) {}
      }
      this._qKey = key;
      if (this.onClearLocal) this.onClearLocal();
      this._strokeHandler = (snap) => {
        const v = snap.val();
        if (!v || v.by === deviceId) return;
        if (v.type === 'clear') { if (this.onClearLocal) this.onClearLocal(); return; }
        if (this.onStroke) this.onStroke(v);
      };
      this.ref.child('q/' + key + '/strokes').on('child_added', this._strokeHandler);
      if (prev) { try { this.ref.child('q/' + prev).remove(); } catch (e) {} }
    }
    /** called by the quiz side only, once per fresh word question */
    startQuestion() {
      const key = Date.now() + '' + Math.random().toString(36).slice(2, 6);
      try { this.ref.child('currentQ').set(key); } catch (e) {}
      this._attachQuestion(key);
      return key;
    }
    sendStroke(seg) {
      if (!this._qKey) return;
      try { this.ref.child('q/' + this._qKey + '/strokes').push(Object.assign({ by: deviceId }, seg)); } catch (e) {}
    }
    sendClear() {
      if (!this._qKey) return;
      try { this.ref.child('q/' + this._qKey + '/strokes').push({ by: deviceId, type: 'clear' }); } catch (e) {}
      if (this.onClearLocal) this.onClearLocal();
    }
    leave() {
      clearInterval(this._beatTimer);
      try { this.ref.child('currentQ').off('value', this._qHandler); } catch (e) {}
      if (this._qKey && this._strokeHandler) { try { this.ref.child('q/' + this._qKey + '/strokes').off('child_added', this._strokeHandler); } catch (e) {} }
      try { this.ref.child('presence').off('value', this._presenceHandler); } catch (e) {}
      try { this.ref.child('presence/' + deviceId).remove(); } catch (e) {}
    }
  }

  HL.sync = {
    available: () => ensureInit(),
    deviceId,
    makeCode,
    /** connect to a room by code — create-if-absent and join are the same operation here */
    connect(code) {
      if (!ensureInit()) return null;
      const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
      if (c.length !== 4) return null;
      return new Room(c);
    },
  };
})(window.HL);
