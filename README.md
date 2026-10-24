# Revathify — Portfolio Webpage

> Interactive portfolio webpage designed in the authentic **RPI-Dashboard Refractive Glass** visual style, hosted at [portfolio.revathify.org](https://portfolio.revathify.org).

---

## ✨ Features & Architecture

- **Orbital City Background**:
  - Original sci-fi city artwork inspired by the atmosphere of the supplied [Instagram reference](https://www.instagram.com/p/DcYZC3dzFwN/), with blue arcologies, a coral planet, and independently drifting spacecraft.
  - Seamless 96-second camera drift, curved ship routes with changing depth and heading, gentle banking, and animated ion exhaust. Native browser animations use locally hosted WebP artwork, with no video player or animation library needed.
  - Three independently drifting cloud banks and 28 small vehicles following both directions of the painted highway. Traffic uses the artwork's coordinates so it remains aligned through camera movement and responsive image cropping.
  - Pause/play control with a saved preference, automatic pause in hidden tabs, and a still background by default for reduced-motion preferences.
  - Background animation continues during scrolling. Scene paint is isolated, glass blur is capped at 6px, and vehicle sprites have no extra drop-shadow filter to reduce scrolling cost.
  - The five glass levels still vary fill, saturation, borders, and related styling while retaining translucent dark and light surfaces.
  - Works behind the existing glass panels in dark and light themes, with a separate mobile crop. All five light glass levels, including nested terminal/stat surfaces, remain translucent.
- **RPI-Dashboard Refractive Glass Style**:
  - 5 configurable glass levels (L1: Subtelny, L2: Klasyczny, L3: Szklisty, L4: Kryształ, L5: Refrakcyjne szkło) with custom CSS `backdrop-filter`, `saturate`, specular sheen, and inset border highlights.
  - Crisp, high-contrast Dark & Light theme modes with saved preferences in `localStorage`.
  - Real-time status indicator, telemetry pill, and interactive console with macOS/Linux terminal chrome.
- **Privacy & Security**:
  - Zero personal sensitive data (no phone numbers, no physical addresses, no internal corporate documents).
  - High-level, professional role overview without confidential employer operational details.
- **Projects Showcase**:
  - **Revath's Enchanted Frames** (Public WoW Addon Suite: Macro Workshop, Mailbox, Tooltips, Planner & Whispers) — [GitHub Repo](https://github.com/Revathify/Revaths-Enchanted-Frames)
  - **RPI-Dashboard** (Raspberry Pi Local Refractive Glass Workspace) — [GitHub Repo](https://github.com/Revathify/RPI-Dashboard)
  - **Revath's Log Analyzer Tool / WCFLA** (Warcraft Logs V2 Desktop Analytics) — [GitHub Repo](https://github.com/Revathify/WCFLA)
  - **fxplorer** (Windows file explorer and storage visualization, in development) — [GitHub Repo](https://github.com/Revathify/fxplorer)
  - **BBinder** (Private Prototype) — Brief architecture details for the motorcycle community and privacy-focused trip planner.
- **Workspaces & Experience**:
  - Infrastructure, WoW Addons, and Dev Projects share the tallest terminal pane's natural height, keeping both hero cards and the projects section steady when switching tabs. The layout adapts to screen width without fixed heights or clipped output.
  - Dev Projects includes RPI-Dashboard, WCFLA, BBinder, and fxplorer (in development).
  - Experience groups Intel/Nokia roles under Professional Experience and places Personal Projects & Open Source in a separate section outside the employment timeline. Skills include web/mobile, desktop, data/API integration, and game addons alongside infrastructure and GPU validation, grounded in the canonical project vault.
- **Contact & Community**:
  - GitHub: [@Revathify](https://github.com/Revathify)
  - Discord: `revath`

---

## 🌐 Custom Domain Setup

This repository includes a `CNAME` file pointing to:
```
portfolio.revathify.org
```

### GitHub Pages Configuration:
1. In this repository's **Settings > Pages**:
   - Source: Deploy from branch `main` / root (`/`).
   - Custom domain: `portfolio.revathify.org`.
   - Enable **Enforce HTTPS**.
2. In your DNS provider (e.g. Cloudflare, Namecheap, Route 53):
   - Add a `CNAME` record:
     - Name / Host: `portfolio`
     - Target / Value: `Revathify.github.io`

---

## 🚀 Local Development

No build step or dependencies required. Open `index.html` directly in any modern browser, or run a local static server:

```powershell
# Using Python
python -m http.server 8000

# Using Node (npx)
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.
