# Liquid Glass UI Design System (`glassystyle`)

> Comprehensive reference guide for reproducing the authentic **Liquid Glass / Glassmorphic UI** aesthetic used across **portfolio.revathify.org** and **rpi-dashboard.revathify.org** ([Revathify/RPI-Dashboard](https://github.com/Revathify/RPI-Dashboard)).

---

## 1. Design Philosophy

The **Liquid Glass** aesthetic is a dark-mode-first, high-density telemetry interface inspired by modern cyber-physical consoles and macOS/iOS frosted translucency, elevated with chromatic saturation and multi-light ambient reflections.

### Key Visual Pillars
1. **Multi-Stop Ambient Glow**: Deep charcoal base (`#14171c`) backlit by fixed radial gradient light pools (electric blue, violet, emerald mint, warm amber).
2. **Dynamic 5-Level Translucency**: Selectable glass blur and saturation levels (`L1` to `L5`), allowing the user to tune from subtle frosted matte to hyper-glass liquid transparency.
3. **Specular Rim Lighting**: Every panel features a physical 1px border highlight plus an internal top-edge highlight (`inset 0 1px 0`) and an angled sheen gradient overlay.
4. **Micro-Telemetry Rhythm**: Monospace counters (`JetBrains Mono`), live pulsing status dots, pill badges, and low-latency interaction.

---

## 2. Core Tokens & CSS Variables

```css
:root {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color-scheme: dark;

  /* Base canvas */
  --bg: #14171c;
  --fg: #eef0f5;
  --fg-strong: #ffffff;
  --muted: #a5a9b5;
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.14);
  --surface: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.08);

  /* Accents */
  --accent: #82b1ff;                 /* Electric Blue */
  --accent-strong: #477eda;
  --accent-wash: rgba(130, 177, 255, 0.14);
  --accent-glow: rgba(130, 177, 255, 0.35);

  --accent-purple: #b495ff;          /* Soft Violet */
  --accent-purple-wash: rgba(180, 149, 255, 0.14);

  --accent-green: #5ed3a0;           /* Emerald Mint */
  --accent-green-wash: rgba(94, 211, 160, 0.14);

  --accent-amber: #f59e0b;           /* Warm Amber */
  --accent-amber-wash: rgba(245, 158, 11, 0.14);

  --accent-pink: #ef91b3;            /* Neon Rose */
  --accent-pink-wash: rgba(239, 145, 179, 0.14);

  /* Glass Level 3 Default (Szklisty) */
  --panel: rgba(22, 26, 36, 0.58);
  --panel-top: rgba(255, 255, 255, 0.12);
  --panel-border: rgba(255, 255, 255, 0.16);
  --panel-highlight: rgba(255, 255, 255, 0.20);
  --panel-sheen: rgba(255, 255, 255, 0.08);
  --glass-blur: 20px;
  --glass-saturate: 150%;
  --shadow: 0 18px 40px -6px rgba(0, 0, 0, 0.38), 0 0 1px 1px rgba(255, 255, 255, 0.06);

  /* Geometry & Rhythm */
  --font-mono: 'JetBrains Mono', monospace;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 9999px;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. The 5-Level Glassmorphism Matrix

By toggling the `data-glass-level="1..5"` attribute on `<html>`, all panels immediately scale their blur, saturation, border brightness, and opacity:

| Level | Polish Name | English Name | Blur | Saturate | Panel Opacity | Primary Character |
|:---:|:---|:---|:---:|:---:|:---:|:---|
| **L1** | *Subtelny* | Subtle | `8px` | `110%` | `rgba(26, 30, 40, 0.84)` | Matte, high readability, low GPU cost |
| **L2** | *Klasyczny* | Classic | `14px` | `130%` | `rgba(24, 28, 38, 0.72)` | Balanced frosted panel |
| **L3** | *Szklisty* | Glassy *(Default)* | `20px` | `150%` | `rgba(22, 26, 36, 0.58)` | Distinct glass refraction & specular glow |
| **L4** | *Kryształ* | Crystal | `28px` | `180%` | `rgba(18, 22, 34, 0.40)` | High translucency, crisp bright borders |
| **L5** | *Płynne szkło* | Liquid Glass | `38px` | `210%` | `rgba(14, 18, 30, 0.26)` | Maximum liquid refraction & chromatic depth |

### Level Overrides CSS

```css
/* Level 1: Subtelny */
:root[data-glass-level="1"] {
  --glass-blur: 8px;
  --glass-saturate: 110%;
  --panel: rgba(26, 30, 40, 0.84);
  --panel-top: rgba(255, 255, 255, 0.05);
  --panel-border: rgba(255, 255, 255, 0.08);
  --panel-highlight: rgba(255, 255, 255, 0.08);
  --panel-sheen: rgba(255, 255, 255, 0.03);
  --shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.28);
}

/* Level 2: Klasyczny */
:root[data-glass-level="2"] {
  --glass-blur: 14px;
  --glass-saturate: 130%;
  --panel: rgba(24, 28, 38, 0.72);
  --panel-top: rgba(255, 255, 255, 0.08);
  --panel-border: rgba(255, 255, 255, 0.12);
  --panel-highlight: rgba(255, 255, 255, 0.14);
  --panel-sheen: rgba(255, 255, 255, 0.05);
  --shadow: 0 14px 32px -5px rgba(0, 0, 0, 0.32);
}

/* Level 3: Szklisty (Default) */
:root[data-glass-level="3"] {
  --glass-blur: 20px;
  --glass-saturate: 150%;
  --panel: rgba(22, 26, 36, 0.58);
  --panel-top: rgba(255, 255, 255, 0.12);
  --panel-border: rgba(255, 255, 255, 0.16);
  --panel-highlight: rgba(255, 255, 255, 0.20);
  --panel-sheen: rgba(255, 255, 255, 0.08);
  --shadow: 0 18px 40px -6px rgba(0, 0, 0, 0.38), 0 0 1px 1px rgba(255, 255, 255, 0.06);
}

/* Level 4: Kryształ */
:root[data-glass-level="4"] {
  --glass-blur: 28px;
  --glass-saturate: 180%;
  --panel: rgba(18, 22, 34, 0.40);
  --panel-top: rgba(255, 255, 255, 0.18);
  --panel-border: rgba(255, 255, 255, 0.25);
  --panel-highlight: rgba(255, 255, 255, 0.32);
  --panel-sheen: rgba(255, 255, 255, 0.14);
  --shadow: 0 24px 50px -8px rgba(0, 0, 0, 0.46), 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.03);
}

/* Level 5: Płynne szkło */
:root[data-glass-level="5"] {
  --glass-blur: 38px;
  --glass-saturate: 210%;
  --panel: rgba(14, 18, 30, 0.26);
  --panel-top: rgba(255, 255, 255, 0.24);
  --panel-border: rgba(255, 255, 255, 0.34);
  --panel-highlight: rgba(255, 255, 255, 0.44);
  --panel-sheen: rgba(255, 255, 255, 0.20);
  --shadow: 0 32px 64px -10px rgba(0, 0, 0, 0.58), 0 0 0 1.5px rgba(255, 255, 255, 0.18), inset 0 0 35px rgba(255, 255, 255, 0.06);
}
```

---

## 4. Canvas & Background Ambient Lighting

Glass cannot refract nothingness. It requires rich radial lighting behind it to produce glowing edges:

```css
body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(ellipse 65% 45% at 20% 10%, rgba(130, 177, 255, 0.12), transparent 60%),
    radial-gradient(ellipse 55% 40% at 85% 18%, rgba(179, 154, 250, 0.11), transparent 50%),
    radial-gradient(ellipse 70% 50% at 50% 90%, rgba(94, 211, 160, 0.08), transparent 60%),
    radial-gradient(ellipse 45% 35% at 80% 80%, rgba(245, 158, 11, 0.06), transparent 50%);
  background-attachment: fixed;
  color: var(--fg);
  min-height: 100vh;
}
```

---

## 5. The Glass Panel Recipe (`.glass-panel`)

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

/* Angled Specular Sheen Overlay */
.glass-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--panel-sheen) 0%, transparent 45%, var(--panel-top) 100%);
  opacity: 0.9;
  pointer-events: none;
  z-index: 1;
}

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

## 6. Signature Components

### 6.1 Sticky Telemetry Navbar Pill
```html
<nav class="navbar glass-panel">
  <div class="brand">
    <div class="brand-avatar">R</div>
    <span class="brand-name">Revath <span class="brand-handle">@Revathify</span></span>
  </div>

  <div class="telemetry-pill">
    <span class="status-dot"></span>
    <span>Systems Online</span>
    <span id="liveClock">22:00:00 UTC</span>
  </div>

  <div class="glass-level-control">
    <button class="glass-btn" data-level="1">L1</button>
    <button class="glass-btn" data-level="2">L2</button>
    <button class="glass-btn active" data-level="3">L3</button>
    <button class="glass-btn" data-level="4">L4</button>
    <button class="glass-btn" data-level="5">L5</button>
  </div>
</nav>
```

```css
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green);
  animation: pulse-dot 2.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
```

### 6.2 Dark Console / Terminal Window
```css
.terminal-window {
  background: rgba(10, 13, 18, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.55;
}
.cursor-blink {
  display: inline-block;
  width: 7px;
  height: 14px;
  background: var(--accent);
  animation: blink 1s step-start infinite;
}
```

### 6.3 Card Hover Lift
```css
.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(130, 177, 255, 0.35);
  box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

---

## 7. JavaScript Glass Controller

```javascript
function initGlassAndTheme() {
  const root = document.documentElement;
  const savedLevel = localStorage.getItem('glass-level') || '3';
  const savedTheme = localStorage.getItem('theme') || 'dark';

  root.setAttribute('data-glass-level', savedLevel);
  root.setAttribute('data-theme', savedTheme);

  document.querySelectorAll('.glass-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const level = e.currentTarget.getAttribute('data-level');
      root.setAttribute('data-glass-level', level);
      localStorage.setItem('glass-level', level);
      document.querySelectorAll('.glass-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
}
```

---

## 8. Best Practices Checklist

- [x] **Never use flat opacity without blur**: Always couple `rgba()` with `backdrop-filter: blur(...)`.
- [x] **Always saturate**: Translucent glass without saturation (`saturate(130%-180%)`) looks grey and lifeless.
- [x] **Always apply the top specular inset**: `box-shadow: inset 0 1px 0 var(--panel-highlight)` gives realistic edge reflection.
- [x] **Preserve text contrast**: Keep text on `var(--fg)` (`#eef0f5`) or `var(--fg-strong)` (`#ffffff`), never reduce opacity of text itself.
- [x] **Use `overflow: hidden`**: Needed on `.glass-panel` so the angled `::before` sheen does not spill over borders.
