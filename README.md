# Revathify — Portfolio Webpage

> Interactive portfolio webpage designed in the authentic **RPI-Dashboard Liquid Glass** visual style, hosted at [portfolio.revathify.org](https://portfolio.revathify.org).

---

## ✨ Features & Architecture

- **RPI-Dashboard Liquid Glass Style**:
  - 5 configurable glass levels (L1: Subtelny, L2: Klasyczny, L3: Szklisty, L4: Kryształ, L5: Płynne szkło) with custom CSS `backdrop-filter`, `saturate`, specular sheen, and inset border highlights.
  - Smooth Dark & Light theme modes with saved preferences in `localStorage`.
  - Real-time status indicator and telemetry pill.
- **Privacy & Security**:
  - Zero personal sensitive data (no phone numbers, no physical addresses, no internal corporate documents).
  - High-level, professional role overview without confidential employer operational details.
- **Projects Showcase**:
  - **Revath's Enchanted Frames** (Public WoW Addon Suite) — [GitHub Repo](https://github.com/Revathify/Revaths-Enchanted-Frames)
  - **Revath's Macro Workshop** (Public WoW Addon) — [GitHub Repo](https://github.com/Revathify/revaths_macro_workshop)
  - **RPI-Dashboard** (Raspberry Pi Local Glassmorphism Workspace) — [GitHub Repo](https://github.com/Revathify/RPI-Dashboard)
  - **Revath's Log Analyzer Tool / WCFLA** (Warcraft Logs V2 Desktop Analytics) — [GitHub Repo](https://github.com/Revathify/WCFLA)
  - **BBinder** (Private Prototype) — Brief architecture details for the motorcycle community and privacy-focused trip planner.
  - **DevOps Workflow Automation** — Multi-agent LLM systems and CI/CD tools.

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
