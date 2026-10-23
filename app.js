/**
 * Revathify — Portfolio Application Logic
 * Refractive Glass UI & Interactive Systems (RPI-Dashboard style)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndGlass();
  initSpaceFlight();
  initCityTraffic();
  initBackgroundMotion();
  initTelemetryClock();
  initTerminalTabs();
  initProjectFilters();
  initModal();
});

// Coordinates follow the diagonal highway in the source artwork. Keeping
// traffic in the image's coordinate system also keeps it on-road when cropped.
const CITY_ROAD = [
  [910, 443], [1030, 514], [1160, 589], [1290, 662],
  [1420, 747], [1550, 852], [1685, 975]
];

function cityRoadPoint(t) {
  const segment = Math.min(CITY_ROAD.length - 2, Math.floor(t * (CITY_ROAD.length - 1)));
  const u = t * (CITY_ROAD.length - 1) - segment;
  const p0 = CITY_ROAD[Math.max(0, segment - 1)];
  const p1 = CITY_ROAD[segment];
  const p2 = CITY_ROAD[segment + 1];
  const p3 = CITY_ROAD[Math.min(CITY_ROAD.length - 1, segment + 2)];
  return [0, 1].map(axis => 0.5 * ((2 * p1[axis]) + (-p0[axis] + p2[axis]) * u +
    (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * u * u +
    (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * u * u * u));
}

function initCityTraffic() {
  const scene = document.getElementById('sceneBackground');
  const image = scene?.querySelector('.scene-city');
  const layer = document.getElementById('sceneTraffic');
  if (!layer || !image || !Element.prototype.animate) return;
  const cars = [];
  for (let index = 0; index < 28; index++) {
    const car = document.createElement('img');
    car.className = 'scene-car';
    car.src = 'assets/orbital-traffic.webp';
    car.alt = '';
    car.decoding = 'async';
    layer.append(car);
    cars.push({ element: car, reverse: index % 2 === 1, duration: 52000 + (index % 5) * 2900, phase: index / 28 });
  }

  function buildTraffic() {
    if (!image.naturalWidth || !image.clientWidth || !image.clientHeight) return;
    const width = image.clientWidth;
    const height = image.clientHeight;
    const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const position = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100);
    const cropX = (width - image.naturalWidth * cover) * position[0];
    const cropY = (height - image.naturalHeight * cover) * position[1];
    for (const car of cars) {
      const time = car.animation?.currentTime ?? car.duration * car.phase;
      car.animation?.cancel();
      const size = 13 * cover;
      car.element.style.width = `${size}px`;
      const frames = Array.from({ length: 121 }, (_, index) => {
        const u = index / 120;
        const t = Math.pow(car.reverse ? 1 - u : u, 1.35);
        const point = cityRoadPoint(t);
        const before = cityRoadPoint(Math.max(0, t - 0.001));
        const after = cityRoadPoint(Math.min(1, t + 0.001));
        const heading = Math.atan2(after[1] - before[1], after[0] - before[0]) * 180 / Math.PI + (car.reverse ? 180 : 0);
        const x = point[0] * cover + cropX - size / 2;
        const y = (point[1] + (car.reverse ? -6 : 6)) * cover + cropY - size / 6;
        const scale = 0.35 + 0.8 * t;
        const opacity = 0.92 * Math.min(1, u / 0.05, (1 - u) / 0.05);
        return { offset: u, transform: `translate3d(${x}px, ${y}px, 0) rotate(${heading}deg) scale(${scale})`, opacity };
      });
      car.animation = car.element.animate(frames, { duration: car.duration, iterations: Infinity, easing: 'linear' });
      car.animation.currentTime = time;
      if (scene.dataset.motion === 'paused' || scene.dataset.scrolling === 'true' || document.hidden) car.animation.pause();
    }
  }

  buildTraffic();
  image.addEventListener('load', buildTraffic, { once: true });
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildTraffic, 150);
  });
}

function initSpaceFlight() {
  const scene = document.getElementById('sceneBackground');
  if (!scene || !Element.prototype.animate) return;
  const routes = [
    { selector: '.scene-flight--near', duration: 72000, phase: 28000, rise: -0.05 },
    { selector: '.scene-flight--far', duration: 106000, phase: 67000, rise: 0.03 },
    { selector: '.scene-flight--distant', duration: 142000, phase: 41000, rise: -0.02 }
  ];
  const flights = new Map();

  function buildRoutes() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (const route of routes) {
      const ship = scene.querySelector(route.selector);
      if (!ship) continue;
      const previous = flights.get(ship);
      const time = previous?.currentTime ?? route.phase;
      previous?.cancel();
      // Sample a smooth arc, deriving heading from its tangent. Native
      // animations handle playback without a continuous JavaScript loop.
      const frames = Array.from({ length: 121 }, (_, index) => {
        const t = index / 120;
        const dx = -(width + 900);
        const dy = height * (4 * (route.rise - 0.08) * (1 - 2 * t) + 0.03 * Math.PI * Math.cos(2 * Math.PI * t));
        const x = 80 + dx * t;
        const y = height * (0.08 + 4 * (route.rise - 0.08) * t * (1 - t) + 0.015 * Math.sin(2 * Math.PI * t));
        const heading = Math.atan2(-dy, -dx) * 180 / Math.PI;
        const scale = 0.62 + 0.5 * Math.sin(Math.PI * t);
        // Both ends are outside the viewport, including the exhaust.
        const opacity = 0.94 * Math.min(1, t / 0.1, (1 - t) / 0.12);
        return { offset: t, transform: `translate3d(${x}px, ${y}px, 0) rotate(${heading}deg) scale(${scale})`, opacity };
      });
      const flight = ship.animate(frames, { duration: route.duration, iterations: Infinity, easing: 'linear' });
      flight.currentTime = time;
      if (scene.dataset.motion === 'paused' || scene.dataset.scrolling === 'true' || document.hidden) flight.pause();
      flights.set(ship, flight);
    }
  }

  buildRoutes();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildRoutes, 150);
  });
}

function initBackgroundMotion() {
  const scene = document.getElementById('sceneBackground');
  const toggle = document.getElementById('sceneMotionToggle');
  if (!scene || !toggle) return;
  scene.dataset.scrolling = 'false';
  let scrollIdleTimer;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;
  try {
    savedMotion = localStorage.getItem('revath-background-motion');
  } catch { /* The background also works when storage is unavailable. */ }

  function syncAnimations() {
    const paused = scene.dataset.motion === 'paused' || scene.dataset.scrolling === 'true' || document.hidden;
    for (const animation of scene.getAnimations?.({ subtree: true }) || []) {
      if (paused) animation.pause();
      else animation.play();
    }
  }

  function setMotion(paused) {
    scene.dataset.motion = paused ? 'paused' : 'running';
    toggle.textContent = paused ? 'Play background' : 'Pause background';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play background animation' : 'Pause background animation');
    syncAnimations();
  }

  setMotion(reducedMotion.matches || savedMotion === 'paused');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const paused = scene.dataset.motion !== 'paused';
    setMotion(paused);
    try {
      localStorage.setItem('revath-background-motion', paused ? 'paused' : 'running');
    } catch { /* Keep the control usable without persistent storage. */ }
  });

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) setMotion(true);
  });

  // Hold the current frame while glass panels scroll over the scene. Only
  // state transitions touch animations; repeated inputs just extend the hold.
  function holdBackgroundForScroll() {
    if (document.hidden) return;
    if (scene.dataset.scrolling !== 'true') {
      scene.dataset.scrolling = 'true';
      syncAnimations();
    }
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
      scrollIdleTimer = undefined;
      scene.dataset.scrolling = 'false';
      syncAnimations();
    }, 180);
  }

  window.addEventListener('wheel', holdBackgroundForScroll, { passive: true });
  window.addEventListener('touchmove', holdBackgroundForScroll, { passive: true });
  window.addEventListener('scroll', holdBackgroundForScroll, { passive: true });

  function updateVisibility() {
    if (document.hidden) {
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = undefined;
      scene.dataset.scrolling = 'false';
    }
    scene.dataset.idle = String(document.hidden);
    syncAnimations();
  }
  document.addEventListener('visibilitychange', updateVisibility);
  updateVisibility();
}

/* ==========================================================================
   THEME & GLASS LEVEL SYSTEM
   ========================================================================== */

function initThemeAndGlass() {
  const root = document.documentElement;
  
  const savedGlass = localStorage.getItem('revath-glass-level') || '3';
  const savedTheme = localStorage.getItem('revath-theme') || 'dark';

  root.setAttribute('data-glass-level', savedGlass);
  root.setAttribute('data-theme', savedTheme);

  updateGlassButtons(savedGlass);
  updateThemeIcon(savedTheme);

  document.querySelectorAll('.glass-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const level = e.currentTarget.getAttribute('data-level');
      root.setAttribute('data-glass-level', level);
      localStorage.setItem('revath-glass-level', level);
      updateGlassButtons(level);
    });
  });

  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('revath-theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateGlassButtons(activeLevel) {
  document.querySelectorAll('.glass-btn').forEach(btn => {
    if (btn.getAttribute('data-level') === activeLevel) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  if (theme === 'light') {
    btn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute('title', 'Switch to Dark Mode');
  } else {
    btn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    btn.setAttribute('title', 'Switch to Light Mode');
  }
}

/* ==========================================================================
   TELEMETRY CLOCK
   ========================================================================== */

function initTelemetryClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.textContent = `${timeStr} UTC`;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   INTERACTIVE TERMINAL CONSOLE TABS
   ========================================================================== */

const TERMINAL_DATA = {
  infra: `
<div class="term-line"><span class="term-cyan">[INFRASTRUCTURE]</span> Orchestrating automated multi-OS provisioning pipelines...</div>
<div class="term-line"><span class="term-green">✔ OS PLATFORMS:</span> Automated golden-image builds across Linux & Windows families</div>
<div class="term-line"><span class="term-cyan">✔ GATING SUITES:</span> Validation assertions running unattended in fast-feedback loops</div>
<div class="term-line"><span class="term-purple">✔ BARE-METAL:</span> GPU acceleration stack validation and driver packaging</div>
<div class="term-line"><span class="term-dim">-- Status: Infrastructure pipelines healthy & automated</span></div>
`,
  addons: `
<div class="term-line"><span class="term-purple">[WOW-ADDON-SUITE]</span> Synchronizing World of Warcraft Retail modules...</div>
<div class="term-line"><span class="term-green">✔ ENCHANTED FRAMES:</span> Core Suite combining Macro Workshop, Mailbox, Tooltips, Weekly Planner & Whispers</div>
<div class="term-line"><span class="term-cyan">✔ MACRO ENGINE:</span> Standalone-grade macro editor with account & character separation</div>
<div class="term-line"><span class="term-amber">✔ AUTOMATION:</span> Jenkins CI packaging and release generation on Git push</div>
<div class="term-line"><span class="term-dim">-- Public repositories live on GitHub @Revathify</span></div>
`,
  tools: `
<div class="term-line"><span class="term-amber">[DEV-PROJECTS]</span> System telemetry and desktop log analytics...</div>
<div class="term-line"><span class="term-cyan">✔ RPI-DASHBOARD:</span> 24/7 ARM64 Raspberry Pi refractive glass developer workstation</div>
<div class="term-line"><span class="term-green">✔ WCFLA:</span> Warcraft Logs V2 encounter analysis with OAuth 2.0 PKCE security</div>
<div class="term-line"><span class="term-purple">✔ BBINDER:</span> Motorcycle community and privacy-focused trip planning engine</div>
<div class="term-line"><span class="term-dim">-- Cross-platform: Web, Electron desktop & React Native</span></div>
`
};

function initTerminalTabs() {
  const tabs = document.querySelectorAll('.tel-tab');
  const termContent = document.getElementById('terminalOutput');
  if (!termContent) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const target = e.currentTarget.getAttribute('data-tab');
      if (TERMINAL_DATA[target]) {
        termContent.innerHTML = TERMINAL_DATA[target];
      }
    });
  });
}

/* ==========================================================================
   PROJECT FILTERING SYSTEM
   ========================================================================== */

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filter = e.currentTarget.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   MODAL DEEP-DIVE SYSTEM
   ========================================================================== */

const PROJECT_MODAL_DATA = {
  bbinder: {
    badge: "Private Project / Prototype",
    title: "BBinder — Motorcycle Community & Trip Discovery",
    content: `
      <p>A full-stack motorcycle community, garage management, and route planning platform built with React Native and Fastify.</p>
      
      <h4>Key Architecture & Privacy Highlights:</h4>
      <ul>
        <li><strong>Privacy-First Proximity Discovery:</strong> Nearby rider exploration operates with user-selected radius bounds (1 to 300 km) from explicit updates. Background GPS tracking is disabled, and exact coordinates are never exposed on public profiles.</li>
        <li><strong>OpenStreetMap & OSRM Engine:</strong> Self-hosted road routing and driving time calculation with interactive map geometry, removing dependency on external paid map services.</li>
        <li><strong>Machine Attribute Filtering:</strong> Filters for motorcycle characteristics (ABS, tires, displacement, power) paired with rider pace and experience style.</li>
        <li><strong>Architecture:</strong> React Native, Fastify, PostgreSQL, MinIO storage, Docker Compose, and Jenkins CI.</li>
      </ul>
      <p><em>Status: Private candidate project.</em></p>
    `,
    isPrivate: true,
    repoUrl: null
  },
  rpi: {
    badge: "Open Source / Raspberry Pi",
    title: "RPI-Dashboard — Refractive Glass Developer Workspace",
    content: `
      <p>A high-fidelity, refractive glass local dashboard hosted 24/7 on an ARM64 Raspberry Pi. Combines real-time telemetry, project roadmaps, and local tools.</p>
      
      <h4>Key Features:</h4>
      <ul>
        <li><strong>5-Level Refractive Glass Design:</strong> Custom CSS backdrop filter and saturate engine with configurable translucency, specular highlights, and dark/light modes.</li>
        <li><strong>Hardware Telemetry:</strong> Live monitoring of CPU load, temperature, RAM consumption, and system health.</li>
        <li><strong>Developer Workspace:</strong> Multi-repository synchronization, task tracking, and local environment status.</li>
      </ul>

      <h4>Tech Stack:</h4>
      <p>React, Vite, Node.js, Raspberry Pi (Debian ARM64), Chart.js, CSS Refractive Glass.</p>
    `,
    isPrivate: false,
    repoUrl: "https://github.com/Revathify/RPI-Dashboard"
  },
  wcfla: {
    badge: "Open Source / Desktop & Web",
    title: "Revath's Log Analyzer Tool (WCFLA) — Warcraft Logs V2 Analytics",
    content: `
      <p>Specialized encounter analysis desktop and browser application providing tactical review of World of Warcraft combat logs via the Warcraft Logs V2 GraphQL API.</p>
      
      <h4>Key Features:</h4>
      <ul>
        <li><strong>OAuth 2.0 PKCE Security:</strong> Zero plain-text credentials stored. Loopback redirect server with Windows DPAPI-encrypted token storage.</li>
        <li><strong>Raid Encounter Breakdown:</strong> Combat tables with class-colored players, DPS/HPS/DTPS metrics, and timestamped interrupt/dispel evidence.</li>
        <li><strong>Death Review Timeline:</strong> Lookback inspection showing damage taken, mitigation, and aura states at the moment of death.</li>
      </ul>

      <h4>Tech Stack:</h4>
      <p>Electron, Node.js, Express, Warcraft Logs V2 GraphQL, Chart.js, Windows Setup & Portable.</p>
    `,
    isPrivate: false,
    repoUrl: "https://github.com/Revathify/WCFLA"
  },
  addons: {
    badge: "Open Source / WoW Addon Suite",
    title: "Revath's Enchanted Frames — Modular Retail Addon Suite",
    content: `      <p>A modular World of Warcraft Retail addon suite combining productivity tools, customizable skins, and account-wide tracking under a unified Blizzard Settings category.</p>
      
      <h4>Included Flagship Modules:</h4>
      <ul>
        <li><strong>Macro Workshop:</strong> Full-featured macro editor with separate account and character libraries, syntax suggestions, and curated community templates.</li>
        <li><strong>Enchanted Mailbox:</strong> Inbox management, contact quick-fill, and alt-character mail routing.</li>
        <li><strong>Enchanted Tooltips:</strong> Account-wide bag, bank, and Warband item count aggregation.</li>
        <li><strong>Enchanted Weekly Planner:</strong> Character-specific lockouts and weekly objective trackers.</li>
        <li><strong>Enchanted Whispers:</strong> Tabbed compact messenger for Battle.net and character whispers with draft preservation.</li>
        <li><strong>Automated Jenkins CI:</strong> Validates manifests, runs linter checks, and packages release zip archives automatically.</li>
      </ul>

      <h4>Tech Stack:</h4>
      <p>Lua, World of Warcraft FrameXML, LibSharedMedia, Jenkins CI.</p>`,
    isPrivate: false,
    repoUrl: "https://github.com/Revathify/Revaths-Enchanted-Frames"
  }};

function initModal() {
  const backdrop = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  if (!backdrop) return;

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openModal(id) {
    const data = PROJECT_MODAL_DATA[id];
    if (!data) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;

    if (data.repoUrl) {
      modalRepoBtn.style.display = 'inline-flex';
      modalRepoBtn.setAttribute('href', data.repoUrl);
    } else {
      modalRepoBtn.style.display = 'none';
    }

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  document.querySelectorAll('.open-project-modal').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-project-id');
      openModal(id);
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.proj-gh-link')) return;
      const id = card.getAttribute('data-project-id');
      if (id) openModal(id);
    });
  });
}
