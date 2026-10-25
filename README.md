<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/icon/128.png">
    <img src="public/icon/128.png" alt="WYNTab Logo" width="80" height="80">
  </picture>
</p>

<h1 align="center">WYNTab</h1>

<p align="center">
  <strong>Write Your NewTab</strong> — Replace default browser new tab clutter with custom HTML, CSS & React templates.
</p>

<p align="center">
  <a href="https://github.com/getwyntab/wyntab/releases/tag/v0.6.0"><img src="https://img.shields.io/badge/version-v0.6.0-10B981?style=flat-square" alt="Version"></a>
  <a href="https://chromewebstore.google.com/detail/wyntab/hbfabaimiglbfjhcppfedgjkpfgabiff"><img src="https://img.shields.io/badge/Chrome%20Web%20Store-WYNTab-10B981?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Web Store"></a>
  <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Manifest-V3-1F1F1F?style=flat-square&logo=googlechrome&logoColor=10B981" alt="Manifest V3"></a>
  <a href="https://wxt.dev/"><img src="https://img.shields.io/badge/Framework-WXT%200.21-1F1F1F?style=flat-square" alt="WXT"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-1F1F1F?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-1F1F1F?style=flat-square" alt="License"></a>
</p>

---

## ⚡ Overview

Default browser new tab pages are crammed with sponsored ad tiles, noisy clickbait feeds, and sluggish widgets. 

**WYNTab** restores total agency over your browser's front door. Write, edit, fork, or upload any HTML, CSS, or React template directly inside your browser. With an integrated CodeMirror 6 editor, live split-view preview, and an isolated sandbox runner, your homepage stays fast, private, and 100% yours.

---

## ✨ Features

- 💻 **In-Browser Code Editor**: Full-canvas [CodeMirror 6](https://codemirror.net/) editor with syntax highlighting, line numbers gutter, and instant split-view live preview.
- ⚛️ **Native React & JSX Support**: Embedded [Sucrase](https://github.com/alangpierce/sucrase) compiler transpiles JSX and React on the fly — zero Node setup or build step required.
- 🛡️ **Isolated MV3 Sandbox**: Templates execute inside a strict `sandbox.html` runtime via `postMessage`. Safely import remote ESM modules from `https://esm.sh` and utilities like Tailwind CSS.
- 💾 **Scoped `wyntab` Storage API**: Templates can persist dynamic state (notes, bookmarks, settings) using `wyntab.get()`, `wyntab.set()`, and `wyntab.remove()`.
- 🎨 **5 Handcrafted Presets**: Ready-to-use aesthetic presets built for productivity, minimalism, and focus.
- 📦 **Data Portability**: One-click JSON backup export and import with robust DOMParser-based sanitization.
- 🔒 **100% Offline & Private**: Zero external analytics, tracking, or network telemetry. Your templates and data stay exclusively on your machine.
- ⚡ **Zero-Latency Startup**: Sandboxed pre-rendering and ambient loading orbs eliminate white canvas flashes when opening tabs.

---

## 🎨 Built-in Presets

WYNTab ships with 5 handcrafted presets ready to activate or fork:

| Template | Description | Tech |
|---|---|---|
| **Atmosphere** | Ambient gradient background with smooth dynamic clock and greeting. | HTML5, Canvas, CSS |
| **Terminal** | Retro hacker CRT shell with live system stats, uptime, and monospace prompt. | Vanilla JS, Monospace |
| **Links** | High-efficiency productivity speed dial with quick bookmarks and search bar. | React 19, Lucide Icons |
| **Minimal** | Distraction-free, typography-focused layout designed for deep work. | Semantic HTML, CSS Grid |
| **Time** | Oversized minimalist typography clock with high-contrast numerals. | SVG, Pure CSS |

---

## 💻 Template Developer API

Every sandboxed template has access to the asynchronous `window.wyntab` storage bridge to save and retrieve state across browser restarts:

```javascript
// Save data scoped to the active template
await window.wyntab.set('todos', ['Ship v0.6.0', 'Review PRs']);

// Retrieve saved data
const todos = await window.wyntab.get('todos');

// Remove an item
await window.wyntab.remove('todos');
```

### Loading External Libraries

Thanks to WYNTab's Manifest V3 sandbox policy, you can import external ESM modules directly in your template:

```html
<script type="module">
  import confetti from 'https://esm.sh/canvas-confetti';
  confetti();
</script>
```

---

## 🛠️ Tech Stack

- **Extension Framework**: [WXT](https://wxt.dev/) (v0.21)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Code Editor**: [CodeMirror 6](https://codemirror.net/)
- **Compiler**: [Sucrase](https://github.com/alangpierce/sucrase) (in-browser JSX transpilation)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) with Happy-DOM
- **Design Specification**: [Google DesignMD](.agents/DESIGN.md)

---

## 🚀 Development & Contributing

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or v22 LTS recommended)
- `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/getwyntab/wyntab.git
cd wyntab

# Install dependencies
npm install
```

### Development Server

```bash
# Start Chrome MV3 live development runner
npm run dev

# Start Firefox MV2 development runner
npm run dev:firefox
```

### Testing & Validation

```bash
# Run unit & component tests
npm test

# Strict TypeScript type check
npm run compile

# Lint design tokens against DESIGN.md
npm run design:lint
```

### Packaging & Store Asset Generation

```bash
# Build production extension zip files
npm run zip          # Generates .output/wyntab-*-chrome.zip
npm run zip:firefox  # Generates .output/wyntab-*-firefox.zip

# Generate Chrome Web Store screenshots, promo banners, and store icon
npm run assets:cws

# Generate YouTube channel avatar and banner
npm run assets:yt
```

---

## 🛡️ Security & Privacy Policy

WYNTab is committed to user safety and adheres strictly to Google Chrome Web Store policies:
- **No Remote Code in Extension Core**: All extension source code is packaged locally.
- **Isolated Sandbox Execution**: User-provided HTML and scripts run exclusively inside an unprivileged sandbox iframe with no direct access to privileged browser extension APIs (`chrome.cookies`, `chrome.tabs`, `chrome.webRequest`).
- **Sanitized Uploads**: All imported templates pass through a strict DOMParser sanitization engine to remove malicious payload structures.

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
