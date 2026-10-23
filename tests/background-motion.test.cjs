const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = readFileSync('app.js', 'utf8');

function createHarness({ reduced = false, saved = null, blockedStorage = false } = {}) {
  const windowListeners = new Map();
  const documentListeners = new Map();
  const toggleListeners = new Map();
  const attributes = {};
  const timers = new Map();
  let nextTimerId = 1;
  let now = 0;

  const animation = {
    state: 'running',
    currentTime: 3210,
    pauseCalls: 0,
    playCalls: 0,
    cancelCalls: 0,
    pause() { this.pauseCalls++; this.state = 'paused'; },
    play() { this.playCalls++; this.state = 'running'; },
    cancel() { this.cancelCalls++; this.state = 'idle'; }
  };
  const scene = { dataset: {}, getAnimations: () => [animation] };
  const toggle = {
    hidden: true,
    textContent: '',
    setAttribute(name, value) { attributes[name] = value; },
    addEventListener(name, callback) { toggleListeners.set(name, callback); }
  };
  const mediaListeners = new Map();
  const media = {
    matches: reduced,
    addEventListener(name, callback) { mediaListeners.set(name, callback); }
  };
  const document = {
    hidden: false,
    getElementById(id) { return id === 'sceneBackground' ? scene : toggle; },
    addEventListener(name, callback) { documentListeners.set(name, callback); }
  };
  const storage = {
    value: saved,
    getItem() { if (blockedStorage) throw Error('Storage blocked'); return this.value; },
    setItem(_key, value) { if (blockedStorage) throw Error('Storage blocked'); this.value = value; }
  };
  const window = {
    matchMedia: () => media,
    addEventListener(name, callback, options) { windowListeners.set(name, { callback, options }); }
  };
  const context = {
    document, window, localStorage: storage,
    setTimeout(callback, delay) {
      const id = nextTimerId++;
      timers.set(id, { callback, due: now + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  };

  runInNewContext(source, context);
  runInNewContext('initBackgroundMotion()', context);

  function fireWindow(name) {
    const listener = windowListeners.get(name);
    assert.ok(listener, `expected a ${name} listener`);
    listener.callback();
  }
  function advance(ms) {
    const target = now + ms;
    while (true) {
      const due = [...timers.entries()].filter(([, timer]) => timer.due <= target)
        .sort((a, b) => a[1].due - b[1].due)[0];
      if (!due) break;
      const [id, timer] = due;
      timers.delete(id);
      now = timer.due;
      timer.callback();
    }
    now = target;
  }
  function changeReduced(matches) {
    media.matches = matches;
    mediaListeners.get('change')({ matches });
  }

  return {
    scene, toggle, attributes, animation, storage, document,
    windowListeners, documentListeners, toggleListeners,
    fireWindow, advance, changeReduced
  };
}

test('scroll, wheel, and touch movement passively hold the scene and restart the 180 ms idle window', () => {
  const app = createHarness();
  for (const name of ['scroll', 'wheel', 'touchmove']) {
    assert.equal(app.windowListeners.get(name)?.options?.passive, true, `${name} listener is passive`);
  }

  app.fireWindow('scroll');
  assert.equal(app.scene.dataset.scrolling, 'true');
  assert.equal(app.scene.dataset.motion, 'running');
  assert.equal(app.storage.value, null);
  assert.equal(app.attributes['aria-pressed'], 'false');
  assert.equal(app.animation.state, 'paused');
  assert.equal(app.animation.currentTime, 3210);

  app.advance(120);
  app.fireWindow('wheel');
  app.advance(179);
  assert.equal(app.scene.dataset.scrolling, 'true', 'a later input postpones resumption');
  app.advance(1);
  assert.equal(app.scene.dataset.scrolling, 'false');
  assert.equal(app.animation.state, 'running');
  assert.equal(app.animation.currentTime, 3210, 'resumption retains animation phase');
  assert.equal(app.animation.cancelCalls, 0, 'the hold never rebuilds or cancels animation');
  assert.equal(app.attributes['aria-pressed'], 'false');

  app.fireWindow('touchmove');
  app.advance(180);
  assert.equal(app.animation.state, 'running');
});

test('an explicit user pause during the scroll hold stays paused after idle', () => {
  const app = createHarness();
  app.fireWindow('scroll');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.storage.value, 'paused');
  assert.equal(app.attributes['aria-pressed'], 'true');
  app.advance(180);
  assert.equal(app.scene.dataset.scrolling, 'false');
  assert.equal(app.animation.state, 'paused');
  assert.equal(app.attributes['aria-pressed'], 'true');
});

test('explicit play during a hold records the choice but remains paused until idle', () => {
  const app = createHarness({ saved: 'paused' });
  app.fireWindow('wheel');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'running');
  assert.equal(app.storage.value, 'running');
  assert.equal(app.attributes['aria-pressed'], 'false');
  assert.equal(app.animation.state, 'paused', 'temporary hold still gates playback');
  app.advance(180);
  assert.equal(app.animation.state, 'running');
});

test('a reduced-motion change while held remains paused after the hold expires', () => {
  const app = createHarness();
  app.fireWindow('touchmove');
  app.changeReduced(true);
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.storage.value, null, 'OS preference does not overwrite the saved choice');
  assert.equal(app.attributes['aria-pressed'], 'true');
  app.advance(180);
  assert.equal(app.animation.state, 'paused');
});

test('hiding the page clears the temporary hold and timer without overriding a saved pause', () => {
  const app = createHarness({ saved: 'paused' });
  app.fireWindow('scroll');
  app.document.hidden = true;
  app.documentListeners.get('visibilitychange')();
  assert.equal(app.scene.dataset.scrolling, 'false');
  assert.equal(app.scene.dataset.idle, 'true');
  app.document.hidden = false;
  app.documentListeners.get('visibilitychange')();
  assert.equal(app.scene.dataset.idle, 'false');
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.storage.value, 'paused');
  assert.equal(app.animation.state, 'paused');
  app.advance(180);
  assert.equal(app.animation.state, 'paused', 'cleared timer cannot resume the scene later');
});

test('startup honors reduced motion and a saved pause, and the control works when storage is blocked', () => {
  let app = createHarness({ reduced: true, saved: 'running' });
  assert.equal(app.scene.dataset.motion, 'paused', 'reduced motion overrides saved running on startup');
  assert.equal(app.toggle.textContent, 'Play background');
  assert.equal(app.attributes['aria-pressed'], 'true');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'running', 'explicit Play can opt in');
  app.changeReduced(true);
  assert.equal(app.scene.dataset.motion, 'paused', 'a new reduce request pauses playback');

  app = createHarness({ saved: 'paused' });
  assert.equal(app.scene.dataset.motion, 'paused');
  app = createHarness({ blockedStorage: true });
  assert.equal(app.toggle.hidden, false, 'the control is exposed despite blocked storage');
  assert.equal(app.scene.dataset.motion, 'running', 'unreadable storage falls back to normal motion');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.animation.state, 'paused');
});
