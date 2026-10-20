# Liquid Glass UI Design System & Component Library (`glassystyle`)

> The complete, definitive design specification, CSS architecture, and component library for the **Liquid Glass / Glassmorphism** interface used across **portfolio.revathify.org** and **rpi-dashboard.revathify.org** ([Revathify/RPI-Dashboard](https://github.com/Revathify/RPI-Dashboard) / BBinder Project Workspace).

---

## 📑 Table of Contents
1. [Design Philosophy & Visual Language](#1-design-philosophy--visual-language)
2. [Master Design Tokens & CSS Variables](#2-master-design-tokens--css-variables)
3. [The 5-Level Glassmorphism Matrix (L1–L5)](#3-the-5-level-glassmorphism-matrix-l1l5)
4. [Ambient Lighting & Multi-Stop Backgrounds](#4-ambient-lighting--multi-stop-backgrounds)
5. [The Foundation: `.glass-panel` & Specular Sheen](#5-the-foundation-glass-panel--specular-sheen)
6. [Sidebar Architecture (BBinder / RPI-Dashboard)](#6-sidebar-architecture-bbinder--rpi-dashboard)
7. [Sticky Topbar & Telemetry Breadcrumbs](#7-sticky-topbar--telemetry-breadcrumbs)
8. [Task Board & Kanban Card Anatomy](#8-task-board--kanban-card-anatomy)
9. [Focus Timer Deep-Work Panel](#9-focus-timer-deep-work-panel)
10. [Triple Progress Rings (Multi-Doughnut Charts)](#10-triple-progress-rings-multi-doughnut-charts)
11. [Hardware Telemetry & Sensor Gauges](#11-hardware-telemetry--sensor-gauges)
12. [Forms, Segmented Controls & Buttons](#12-forms-segmented-controls--buttons)
13. [Modals & Refractive Drawers](#13-modals--refractive-drawers)
14. [Responsive Breakpoints & Mobile Icon Rail](#14-responsive-breakpoints--mobile-icon-rail)
15. [JavaScript State Engine](#15-javascript-state-engine)

---

## 1. Design Philosophy & Visual Language

The **Liquid Glass** aesthetic marries the frosted precision of macOS/iOS interfaces with the high-density information architecture of cyber-physical telemetry consoles.

### Core Visual Principles
- **No Flat Backgrounds**: Glass requires refraction. Translucency only comes to life when there are high-contrast ambient light pools beneath the surface.
- **Physical Specular Highlights**: Glass edges catch light. Every panel features a physical 1px border highlight plus an internal top-edge highlight (`inset 0 1px 0`) and an angled sheen gradient overlay.
- **Chromatic Saturation**: Standard opacity washing looks grey and lifeless. By coupling high `backdrop-filter: blur(...)` with `saturate(130%-210%)`, panels enhance and intensify the colors behind them.
- **Micro-Telemetry Feedback**: Monospace counters (`JetBrains Mono`), live pulsing status dots (`.live-dot`), pill badges, and low-latency interaction.

---

## 2. Master Design Tokens & CSS Variables

```css
:root {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color-scheme: dark;

  /* Base dark canvas */
  --bg: #14171c;
  --fg: #eef0f5;
  --fg-strong: #ffffff;
  --muted: #a5a9b5;
  --muted-dark: #8c969c;
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.14);
  --input: rgba(255, 255, 255, 0.04);
  --input-focus: rgba(255, 255, 255, 0.08);
  --surface: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.08);
  --surface-active: rgba(255, 255, 255, 0.12);

  /* Signature Accent Tokens */
  --accent: #82b1ff;                  /* Electric Sky Blue */
  --accent-strong: #477eda;
  --accent-wash: rgba(130, 177, 255, 0.14);
  --accent-glow: rgba(130, 177, 255, 0.35);

  --accent-purple: #b495ff;           /* Cyber Violet */
  --accent-purple-wash: rgba(180, 149, 255, 0.14);

  --accent-green: #5ed3a0;            /* Emerald Mint */
  --accent-green-wash: rgba(94, 211, 160, 0.14);

  --accent-amber: #f59e0b;            /* Warm Amber */
  --accent-amber-wash: rgba(245, 158, 11, 0.14);

  --accent-pink: #f57aa7;             /* Magenta Rose */
  --accent-pink-wash: rgba(245, 122, 167, 0.14);

  /* Sidebar & Topbar Specifics */
  --sidebar-w: 207px;
  --sidebar-collapsed-w: 72px;
  --sidebar-bg: rgba(18, 22, 28, 0.62);
  --topbar-h: 72px;
  --topbar-bg: rgba(19, 23, 29, 0.50);

  /* Glass Level 3 Default (Szklisty) */
  --panel: rgba(22, 26, 36, 0.58);
  --panel-top: rgba(255, 255, 255, 0.12);
  --panel-border: rgba(255, 255, 255, 0.16);
  --panel-highlight: rgba(255, 255, 255, 0.20);
  --panel-sheen: rgba(255, 255, 255, 0.08);
  --glass-blur: 20px;
  --glass-saturate: 150%;
  --shadow: 0 18px 40px -6px rgba(0, 0, 0, 0.38), 0 0 1px 1px rgba(255, 255, 255, 0.06);

  /* Typography & Layout */
  --font-mono: 'JetBrains Mono', monospace;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 9999px;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Light Theme Overrides */
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #eef2f7;
  --fg: #1c2534;
  --fg-strong: #0d1522;
  --muted: #5e6b7e;
  --muted-dark: #7a889b;
  --line: rgba(0, 0, 0, 0.08);
  --line-strong: rgba(0, 0, 0, 0.14);
  --input: rgba(0, 0, 0, 0.04);
  --input-focus: rgba(0, 0, 0, 0.07);
  --surface: rgba(0, 0, 0, 0.03);
  --surface-hover: rgba(0, 0, 0, 0.06);
  --panel: rgba(255, 255, 255, 0.72);
  --panel-top: rgba(255, 255, 255, 0.85);
  --panel-border: rgba(0, 0, 0, 0.08);
  --panel-highlight: rgba(255, 255, 255, 0.95);
  --panel-sheen: rgba(255, 255, 255, 0.35);
  --sidebar-bg: rgba(245, 247, 251, 0.75);
  --topbar-bg: rgba(245, 247, 251, 0.65);
  --shadow: 0 16px 36px -6px rgba(18, 30, 50, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.04);
}
```

---

## 3. The 5-Level Glassmorphism Matrix (L1–L5)

The interface allows user-selectable translucency via `data-glass-level="1..5"` on `<html>`:

```css
/* L1: Subtelny (Subtle) — Matte, battery-saving, high readability */
:root[data-glass-level="1"] {
  --glass-blur: 8px;
  --glass-saturate: 110%;
  --panel: rgba(26, 30, 40, 0.84);
  --panel-top: rgba(255, 255, 255, 0.05);
  --panel-border: rgba(255, 255, 255, 0.08);
  --panel-highlight: rgba(255, 255, 255, 0.08);
  --panel-sheen: rgba(255, 255, 255, 0.03);
  --sidebar-bg: rgba(20, 24, 30, 0.88);
  --topbar-bg: rgba(20, 24, 30, 0.85);
  --shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.28);
}

/* L2: Klasyczny (Classic) — Balanced frosted surface */
:root[data-glass-level="2"] {
  --glass-blur: 14px;
  --glass-saturate: 130%;
  --panel: rgba(24, 28, 38, 0.72);
  --panel-top: rgba(255, 255, 255, 0.08);
  --panel-border: rgba(255, 255, 255, 0.12);
  --panel-highlight: rgba(255, 255, 255, 0.14);
  --panel-sheen: rgba(255, 255, 255, 0.05);
  --sidebar-bg: rgba(18, 22, 28, 0.75);
  --topbar-bg: rgba(19, 23, 29, 0.68);
  --shadow: 0 14px 32px -5px rgba(0, 0, 0, 0.32);
}

/* L3: Szklisty (Glassy - Default) — Rich specular glow and refraction */
:root[data-glass-level="3"] {
  --glass-blur: 20px;
  --glass-saturate: 150%;
  --panel: rgba(22, 26, 36, 0.58);
  --panel-top: rgba(255, 255, 255, 0.12);
  --panel-border: rgba(255, 255, 255, 0.16);
  --panel-highlight: rgba(255, 255, 255, 0.20);
  --panel-sheen: rgba(255, 255, 255, 0.08);
  --sidebar-bg: rgba(18, 22, 28, 0.62);
  --topbar-bg: rgba(19, 23, 29, 0.50);
  --shadow: 0 18px 40px -6px rgba(0, 0, 0, 0.38), 0 0 1px 1px rgba(255, 255, 255, 0.06);
}

/* L4: Kryształ (Crystal) — High translucency, crisp bright borders */
:root[data-glass-level="4"] {
  --glass-blur: 28px;
  --glass-saturate: 180%;
  --panel: rgba(18, 22, 34, 0.40);
  --panel-top: rgba(255, 255, 255, 0.18);
  --panel-border: rgba(255, 255, 255, 0.25);
  --panel-highlight: rgba(255, 255, 255, 0.32);
  --panel-sheen: rgba(255, 255, 255, 0.14);
  --sidebar-bg: rgba(15, 19, 26, 0.48);
  --topbar-bg: rgba(16, 20, 28, 0.42);
  --shadow: 0 24px 50px -8px rgba(0, 0, 0, 0.46), 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.03);
}

/* L5: Płynne szkło (Liquid Glass) — Hyper-refractive, chromatic edge glow */
:root[data-glass-level="5"] {
  --glass-blur: 38px;
  --glass-saturate: 210%;
  --panel: rgba(14, 18, 30, 0.26);
  --panel-top: rgba(255, 255, 255, 0.24);
  --panel-border: rgba(255, 255, 255, 0.34);
  --panel-highlight: rgba(255, 255, 255, 0.44);
  --panel-sheen: rgba(255, 255, 255, 0.20);
  --sidebar-bg: rgba(12, 16, 24, 0.35);
  --topbar-bg: rgba(14, 18, 26, 0.30);
  --shadow: 0 32px 64px -10px rgba(0, 0, 0, 0.58), 0 0 0 1.5px rgba(255, 255, 255, 0.18), inset 0 0 35px rgba(255, 255, 255, 0.06);
}
```

---

## 4. Ambient Lighting & Multi-Stop Backgrounds

The canvas background combines 4 fixed radial glow coordinates to produce chromatic edge light beneath the translucent panels:

```css
body {
  background-color: var(--bg);
  background-image:
    /* Top-left electric blue wash */
    radial-gradient(ellipse 65% 45% at 20% 10%, rgba(130, 177, 255, 0.12), transparent 60%),
    /* Top-right soft purple wash */
    radial-gradient(ellipse 55% 40% at 85% 18%, rgba(179, 154, 250, 0.11), transparent 50%),
    /* Bottom-center emerald mint wash */
    radial-gradient(ellipse 70% 50% at 50% 90%, rgba(94, 211, 160, 0.08), transparent 60%),
    /* Bottom-right warm amber telemetry aura */
    radial-gradient(ellipse 45% 35% at 82% 82%, rgba(245, 158, 11, 0.06), transparent 50%);
  background-attachment: fixed;
  color: var(--fg);
  min-height: 100vh;
}
```

---

## 5. The Foundation: `.glass-panel` & Specular Sheen

The atomic building block of all cards, sidebars, and drawers.

```css
.glass-panel {
  background: var(--panel);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-lg);
  box-shadow: inset 0 1px 0 var(--panel-highlight), var(--shadow);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}

/* 135-degree diagonal light reflection */
.glass-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--panel-sheen) 0%, transparent 45%, var(--panel-top) 100%);
  opacity: 0.9;
  pointer-events: none;
  z-index: 1;
}

/* Ensure children sit above sheen */
.glass-panel > * {
  position: relative;
  z-index: 2;
}

.glass-panel:hover {
  border-color: rgba(255, 255, 255, 0.24);
  box-shadow: inset 0 1px 0 var(--panel-highlight), 0 24px 50px -8px rgba(0, 0, 0, 0.45);
}
```

---

## 6. Sidebar Architecture (BBinder / RPI-Dashboard)

The signature 207px fixed left navigation panel with section groupings, counters, and bottom hardware status.

```html
<aside class="sidebar">
  <!-- Pinned Brand Button -->
  <button class="brand" aria-label="Project Workspace">
    <svg class="brand-icon" viewBox="0 0 24 24"><!-- Phosphor Stack / Layer Icon --></svg>
  </button>

  <!-- Workspace Navigation Section -->
  <div class="nav-label">WORKSPACE</div>
  <nav aria-label="Workspace navigation">
    <button class="nav-item active" aria-current="page">
      <svg class="nav-icon" viewBox="0 0 24 24"><!-- Home Icon --></svg>
      <span>Overview</span>
    </button>

    <button class="nav-item">
      <svg class="nav-icon" viewBox="0 0 24 24"><!-- CheckSquare Icon --></svg>
      <span>Tasks</span>
      <small>14</small>
    </button>

    <button class="nav-item">
      <svg class="nav-icon" viewBox="0 0 24 24"><!-- Target Icon --></svg>
      <span>Goals</span>
      <small>5</small>
    </button>
  </nav>

  <!-- Categorized Sub-Section -->
  <div class="sidebar-section">
    <div class="nav-label">TELEMETRY &amp; INFO</div>
    <nav aria-label="Info navigation">
      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24"><!-- Cpu Icon --></svg>
        <span>System Telemetry</span>
      </button>

      <button class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24"><!-- Sparkle Icon --></svg>
        <span>Antigravity AI</span>
      </button>
    </nav>
  </div>

  <!-- Pinned Goals List with Dot Indicators -->
  <div class="sidebar-goals">
    <div class="nav-label">ACTIVE GOALS</div>
    <button class="goal-link">
      <span class="goal-dot" style="background: #83afff;"></span>
      <span>BBinder Release Scope</span>
    </button>
    <button class="goal-link">
      <span class="goal-dot" style="background: #55d396;"></span>
      <span>OSRM Route Engine</span>
    </button>
  </div>

  <!-- Sidebar Bottom Anchored Section -->
  <div class="sidebar-bottom">
    <div class="network-status">
      <svg width="17" height="17" viewBox="0 0 24 24"><!-- Wifi High Icon --></svg>
      <div class="network-meta">
        <span>Local workspace</span>
        <small>Saved on the host</small>
      </div>
    </div>

    <button class="nav-item">
      <svg class="nav-icon" viewBox="0 0 24 24"><!-- Gear Icon --></svg>
      <span>Settings</span>
    </button>

    <div class="workspace-owner">
      <div class="owner-avatar">R</div>
      <div class="owner-info">
        <span class="owner-name">Revath</span>
        <small>Project workspace</small>
      </div>
    </div>
  </div>
</aside>
```

```css
/* Sidebar Container */
.sidebar {
  width: var(--sidebar-w);
  position: fixed;
  inset: 0 auto 0 0;
  padding: 28px 16px 0;
  background: var(--sidebar-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border-right: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: var(--transition);
}

/* Brand Button */
.brand {
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0 0 34px 10px;
  background: rgba(137, 173, 242, 0.12);
  color: var(--accent);
  border: 1px solid rgba(136, 169, 231, 0.28);
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.brand:hover {
  background: rgba(137, 173, 242, 0.22);
  border-color: var(--accent);
  transform: translateY(-1px);
}

/* Section Header Labels */
.nav-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--muted-dark);
  margin: 0 12px 10px;
}

/* Nav Item Buttons */
.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid transparent;
  color: var(--muted);
  font-size: 11px;
  font-weight: 500;
  min-height: 40px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: var(--transition);
}

.nav-item:hover {
  background: var(--input);
  color: var(--fg);
}

.nav-item.active {
  background: var(--accent-wash);
  color: var(--accent);
  border-color: rgba(130, 177, 255, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  font-weight: 600;
}

.nav-item small {
  margin-left: auto;
  font-size: 9px;
  font-family: var(--font-mono);
  opacity: 0.75;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: var(--radius-pill);
}

/* Sidebar Goal Links */
.sidebar-goals {
  margin-top: 24px;
}

.goal-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 12px;
  border: 0;
  background: transparent;
  font-size: 10px;
  color: var(--muted);
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  border-radius: var(--radius-xs);
  transition: var(--transition);
}

.goal-link:hover {
  color: var(--fg);
  background: var(--input);
}

.goal-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Sidebar Bottom Area */
.sidebar-bottom {
  margin-top: auto;
  padding-top: 20px;
  padding-bottom: 20px;
}

.network-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px 18px;
  color: #8bb7a5;
  font-size: 10px;
}

.network-meta small {
  display: block;
  font-size: 8px;
  color: var(--muted-dark);
  margin-top: 2px;
}

.workspace-owner {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--line);
  margin-top: 10px;
  padding-top: 14px;
  font-size: 10px;
}

.owner-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(91, 101, 100, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #c8d4cb;
}

.owner-info small {
  display: block;
  font-size: 9px;
  color: var(--muted);
  margin-top: 2px;
}
```

---

## 7. Sticky Topbar & Telemetry Breadcrumbs

```html
<header class="topbar">
  <div class="breadcrumbs">
    <span class="crumb-root">Workspace</span>
    <span class="crumb-slash">/</span>
    <span class="crumb-active">Overview</span>
  </div>

  <div class="topbar-actions">
    <!-- Live sync state -->
    <span class="sync-state">
      <span class="live-dot on"></span>
      <span>Local &amp; in sync</span>
    </span>

    <!-- Theme toggle -->
    <button class="icon-button" aria-label="Toggle theme">
      <svg width="18" height="18" viewBox="0 0 24 24"><!-- Sun / Moon Icon --></svg>
    </button>

    <!-- Top profile avatar -->
    <div class="top-avatar">R</div>
  </div>
</header>
```

```css
.main-shell {
  margin-left: var(--sidebar-w);
  min-height: 100vh;
}

.topbar {
  height: var(--topbar-h);
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--panel-border);
  background: var(--topbar-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  position: sticky;
  top: 0;
  z-index: 10;
  transition: var(--transition);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 500;
}

.crumb-root { color: var(--muted); }
.crumb-slash { color: var(--line-strong); }
.crumb-active { color: var(--fg-strong); font-weight: 600; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sync-state {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--muted);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green);
  animation: pulse-dot 2.5s infinite;
}

.icon-button {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  color: var(--muted);
  cursor: pointer;
  transition: var(--transition);
}

.icon-button:hover {
  background: var(--surface-hover);
  color: var(--fg);
  border-color: var(--line-strong);
}
```

---

## 8. Task Board & Kanban Card Anatomy

```html
<article class="task-card glass-panel" draggable="true">
  <!-- Goal Tag & Priority Flag -->
  <div class="task-tags">
    <span class="goal-tag" style="--goal-color: #83afff;">
      <span class="tag-bullet"></span>
      BBinder / OSRM Engine
    </span>
    <span class="priority urgent">
      <svg width="10" height="10" viewBox="0 0 24 24"><!-- Flag --></svg>
      Urgent
    </span>
  </div>

  <!-- Task Title & Completed Checkbox -->
  <button class="task-title">
    Implement OpenStreetMap geometry parsing
  </button>

  <!-- Task Footer Metadata -->
  <div class="task-meta">
    <span class="due-badge late">
      <svg width="12" height="12" viewBox="0 0 24 24"><!-- Calendar --></svg>
      Oct 24
    </span>
    <button class="icon-button" aria-label="Edit task">
      <svg width="13" height="13" viewBox="0 0 24 24"><!-- ArrowUpRight --></svg>
    </button>
  </div>
</article>
```

```css
.task-card {
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  cursor: grab;
  display: flex;
  flex-direction: column;
}

.task-card:active {
  cursor: grabbing;
}

.task-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
}

.goal-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--fg);
  font-weight: 500;
}

.tag-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--goal-color, var(--accent));
}

.priority {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.priority.urgent {
  background: rgba(245, 122, 167, 0.18);
  color: var(--accent-pink);
  border: 1px solid rgba(245, 122, 167, 0.3);
}

.task-title {
  border: 0;
  background: transparent;
  color: var(--fg-strong);
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
  line-height: 1.45;
  margin-bottom: 14px;
  cursor: pointer;
  padding: 0;
}

.task-title:hover {
  color: var(--accent);
}

.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 11px;
  color: var(--muted);
}

.due-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
}

.due-badge.late {
  color: var(--accent-amber);
}
```

---

## 9. Focus Timer Deep-Work Panel

```html
<section class="panel focus-panel glass-panel">
  <div class="panel-head">
    <div>
      <h3>Focus</h3>
      <p>A little space for deep work.</p>
    </div>
  </div>

  <div class="focus-content">
    <div class="timer running">
      <strong class="timer-digits">24:45</strong>
      <span class="timer-state">Focusing</span>
    </div>

    <div class="focus-controls">
      <div class="segmented minutes">
        <button>15m</button>
        <button class="selected">25m</button>
        <button>50m</button>
      </div>

      <div class="button-row">
        <button class="primary btn-start">
          <svg width="13" height="13" viewBox="0 0 24 24"><!-- Play --></svg>
          Start focus
        </button>
      </div>
    </div>
  </div>
</section>
```

```css
.focus-panel {
  padding: 24px;
}

.focus-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 18px;
}

.timer {
  text-align: center;
  margin-bottom: 20px;
}

.timer-digits {
  display: block;
  font-size: 44px;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: -1px;
  color: var(--fg-strong);
  line-height: 1;
}

.timer.running .timer-digits {
  color: var(--accent);
  text-shadow: 0 0 24px var(--accent-glow);
}

.timer-state {
  display: block;
  font-size: 11px;
  color: var(--muted);
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* Segmented Minute Switcher */
.segmented {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 3px;
  border-radius: var(--radius-sm);
  margin-bottom: 14px;
}

.segmented button {
  padding: 5px 14px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--muted);
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
}

.segmented button.selected {
  background: var(--accent-wash);
  color: var(--accent);
  font-weight: 600;
}
```

---

## 10. Triple Progress Rings (Multi-Doughnut Charts)

The 3-layer concentric progress rings used to track Total Tasks, In-Progress Work, and Completed Goals.

```html
<div class="rings-container">
  <canvas id="ringsCanvas" width="160" height="160"></canvas>
  <div class="ring-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><!-- Target Icon --></svg>
  </div>
</div>
```

```css
.rings-container {
  width: 160px;
  height: 160px;
  position: relative;
  display: grid;
  place-items: center;
  margin: 0 auto;
}

.rings-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--accent);
  display: grid;
  place-items: center;
  pointer-events: none;
}
```

### Chart.js Configuration
```javascript
new Chart(canvasRef, {
  type: 'doughnut',
  data: {
    datasets: [
      // Outer Ring: Completed Tasks (Magenta)
      { data: [0.75, 0.25], backgroundColor: ['#f57aa7', 'rgba(255,255,255,0.04)'], borderWidth: 0, borderRadius: 12, spacing: 2 },
      // Middle Ring: Active Tasks (Emerald Mint)
      { data: [0.40, 0.60], backgroundColor: ['#55d396', 'rgba(255,255,255,0.04)'], borderWidth: 0, borderRadius: 12, spacing: 2 },
      // Inner Ring: Completed Goals (Electric Blue)
      { data: [0.60, 0.40], backgroundColor: ['#65b6ee', 'rgba(255,255,255,0.04)'], borderWidth: 0, borderRadius: 12, spacing: 2 }
    ]
  },
  options: {
    cutout: '42%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 400 }
  }
});
```

---

## 11. Hardware Telemetry & Sensor Gauges

```html
<div class="telemetry-gauge glass-panel">
  <div class="gauge-head">
    <span class="gauge-title">CPU Temperature</span>
    <span class="gauge-val">42.8°C</span>
  </div>
  <div class="gauge-track">
    <div class="gauge-fill" style="width: 42%; background: var(--accent-green);"></div>
  </div>
  <span class="gauge-caption">Thermal status optimal · ARM64 SoC</span>
</div>
```

```css
.telemetry-gauge {
  padding: 16px;
  border-radius: var(--radius-md);
}

.gauge-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.gauge-title {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gauge-val {
  font-size: 16px;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--fg-strong);
}

.gauge-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-pill);
  overflow: hidden;
  margin-bottom: 6px;
}

.gauge-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 0.5s ease;
}

.gauge-caption {
  font-size: 10px;
  color: var(--muted-dark);
}
```

---

## 12. Forms, Segmented Controls & Buttons

```css
/* Input fields */
input[type="text"], input[type="search"], textarea, select {
  width: 100%;
  background: var(--input);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--fg);
  font-family: inherit;
  font-size: 12px;
  padding: 10px 14px;
  outline: none;
  transition: var(--transition);
}

input:focus, textarea:focus, select:focus {
  background: var(--input-focus);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-wash);
}

/* Primary Action Button with Gradient Glow */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #fff;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: 0 4px 18px var(--accent-glow);
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-glow);
}
```

---

## 13. Modals & Refractive Drawers

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 20, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.modal-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.modal-window {
  width: 100%;
  max-width: 760px;
  max-height: 88vh;
  background: var(--panel);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-xl);
  box-shadow: 0 30px 70px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 var(--panel-highlight);
  overflow-y: auto;
  padding: 32px;
  transform: translateY(20px) scale(0.97);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-backdrop.open .modal-window {
  transform: translateY(0) scale(1);
}
```

---

## 14. Responsive Breakpoints & Mobile Icon Rail

When viewports narrow below `1080px` or `768px`, the sidebar transitions into an icon rail:

```css
@media (max-width: 1080px) {
  :root {
    --sidebar-w: 72px;
  }

  .sidebar {
    width: var(--sidebar-w);
    padding: 20px 10px 0;
  }

  .brand {
    margin: 0 auto 24px;
  }

  .nav-label,
  .sidebar-goals,
  .network-status,
  .workspace-owner,
  .nav-item span,
  .nav-item small {
    display: none;
  }

  .nav-item {
    justify-content: center;
    padding: 12px 0;
  }

  .main-shell {
    margin-left: var(--sidebar-w);
  }
}

@media (max-width: 640px) {
  .sidebar {
    display: none;
  }

  .main-shell {
    margin-left: 0;
  }
}
```

---

## 15. JavaScript State Engine

```javascript
// Complete controller for theme, glass level, and active navigation
(function() {
  const root = document.documentElement;

  // Initialize from localStorage
  const savedLevel = localStorage.getItem('revath-glass-level') || '3';
  const savedTheme = localStorage.getItem('revath-theme') || 'dark';
  root.setAttribute('data-glass-level', savedLevel);
  root.setAttribute('data-theme', savedTheme);

  // Glass Level Switcher
  document.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', e => {
      const level = e.currentTarget.getAttribute('data-level');
      root.setAttribute('data-glass-level', level);
      localStorage.setItem('revath-glass-level', level);
      document.querySelectorAll('[data-level]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('revath-theme', next);
    });
  }
})();
```
