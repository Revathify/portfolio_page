/**
 * Revathify — Portfolio Application Logic
 * Refractive Glass UI & Interactive Systems (RPI-Dashboard style)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndGlass();
  initTelemetryClock();
  initTerminalTabs();
  initProjectFilters();
  initModal();
});

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
