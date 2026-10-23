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
  let timerSchedules = 0;
  let animationListReads = 0;

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
  const scene = { dataset: {}, getAnimations: () => { animationListReads++; return [animation]; } };
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
      timerSchedules++;
      timers.set(id, { callback, due: now + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  };

  runInNewContext(source, context);
  runInNewContext('initBackgroundMotion()', context);

  function fireWindow(name) {
    const listener = windowListeners.get(name);
    listener?.callback();
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
    fireWindow, advance, changeReduced,
    timerCount: () => timers.size,
    timerSchedules: () => timerSchedules,
    animationListReads: () => animationListReads
  };
}

test('scroll, wheel, and touch movement do not affect animation or motion controls', () => {
  for (const initial of [{}, { saved: 'paused' }]) {
    const app = createHarness(initial);
    const before = {
      animationState: app.animation.state,
      currentTime: app.animation.currentTime,
      pauseCalls: app.animation.pauseCalls,
      playCalls: app.animation.playCalls,
      cancelCalls: app.animation.cancelCalls,
      motion: app.scene.dataset.motion,
      scrolling: app.scene.dataset.scrolling,
      saved: app.storage.value,
      text: app.toggle.textContent,
      pressed: app.attributes['aria-pressed'],
      label: app.attributes['aria-label'],
      animationListReads: app.animationListReads(),
      timerSchedules: app.timerSchedules(),
      timerCount: app.timerCount()
    };

    for (const name of ['scroll', 'wheel', 'touchmove']) {
      app.fireWindow(name);
      app.advance(500);
    }

    assert.equal(app.animation.state, before.animationState);
    assert.equal(app.animation.currentTime, before.currentTime);
    assert.equal(app.animation.pauseCalls, before.pauseCalls);
    assert.equal(app.animation.playCalls, before.playCalls);
    assert.equal(app.animation.cancelCalls, before.cancelCalls, 'scroll inputs do not rebuild animations');
    assert.equal(app.scene.dataset.motion, before.motion);
    assert.equal(app.scene.dataset.scrolling, before.scrolling, 'scroll inputs do not add temporary state');
    assert.equal(app.storage.value, before.saved);
    assert.equal(app.toggle.textContent, before.text);
    assert.equal(app.attributes['aria-pressed'], before.pressed);
    assert.equal(app.attributes['aria-label'], before.label);
    assert.equal(app.animationListReads(), before.animationListReads, 'scroll inputs do not resynchronize animation playback');
    assert.equal(app.timerSchedules(), before.timerSchedules, 'scroll inputs create no idle timer');
    assert.equal(app.timerCount(), before.timerCount);
  }
});

test('startup honors reduced motion and saved pause, and explicit play remains available', () => {
  let app = createHarness({ reduced: true, saved: 'running' });
  assert.equal(app.scene.dataset.motion, 'paused', 'reduced motion overrides saved running on startup');
  assert.equal(app.animation.state, 'paused');
  assert.equal(app.toggle.textContent, 'Play background');
  assert.equal(app.attributes['aria-pressed'], 'true');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'running', 'explicit Play can opt in');
  assert.equal(app.animation.state, 'running');
  assert.equal(app.storage.value, 'running');
  app.changeReduced(true);
  assert.equal(app.scene.dataset.motion, 'paused', 'a new reduce request pauses playback');
  assert.equal(app.animation.state, 'paused');

  app = createHarness({ saved: 'paused' });
  assert.equal(app.scene.dataset.motion, 'paused', 'a saved pause is preserved');
  assert.equal(app.animation.state, 'paused');
});

test('visibility pauses and resumes running animation while preserving a saved user pause', () => {
  let app = createHarness();
  const startingTime = app.animation.currentTime;
  app.document.hidden = true;
  app.documentListeners.get('visibilitychange')();
  assert.equal(app.scene.dataset.idle, 'true');
  assert.equal(app.animation.state, 'paused');
  app.document.hidden = false;
  app.documentListeners.get('visibilitychange')();
  assert.equal(app.scene.dataset.idle, 'false');
  assert.equal(app.animation.state, 'running');
  assert.equal(app.animation.currentTime, startingTime);

  app = createHarness({ saved: 'paused' });
  app.document.hidden = true;
  app.documentListeners.get('visibilitychange')();
  app.document.hidden = false;
  app.documentListeners.get('visibilitychange')();
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.storage.value, 'paused');
  assert.equal(app.animation.state, 'paused');
});

test('the motion control remains usable when local storage is blocked', () => {
  const app = createHarness({ blockedStorage: true });
  assert.equal(app.toggle.hidden, false);
  assert.equal(app.scene.dataset.motion, 'running', 'unreadable storage falls back to normal motion');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'paused');
  assert.equal(app.animation.state, 'paused');
  app.toggleListeners.get('click')();
  assert.equal(app.scene.dataset.motion, 'running');
  assert.equal(app.animation.state, 'running');
});
