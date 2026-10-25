<p align="center">
  <img src="public/icon/128.png" alt="WYNTab" width="96" height="96">
</p>

<h1 align="center">WYNTab</h1>

<p align="center">
  <strong>Write Your NewTab</strong> — An open-source browser extension to build, edit, and run custom HTML, CSS, and React templates as your new tab page.
</p>

<p align="center">
  <a href="https://github.com/getwyntab/wyntab/releases/latest"><img src="https://img.shields.io/github/v/release/getwyntab/wyntab?style=flat-square&color=10B981" alt="Latest Release"></a>
  <a href="https://chromewebstore.google.com/detail/wyntab/hbfabaimiglbfjhcppfedgjkpfgabiff"><img src="https://img.shields.io/chrome-web-store/users/hbfabaimiglbfjhcppfedgjkpfgabiff.svg?style=flat-square&color=10B981&logo=googlechrome&logoColor=white" alt="Chrome Web Store Users"></a>
  <a href="https://github.com/getwyntab/wyntab/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/getwyntab/wyntab/ci.yml?style=flat-square&label=tests&logo=githubactions&logoColor=white" alt="Test Status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#built-in-templates">Built-in Templates</a> •
  <a href="#creating-custom-templates-with-ai">Create with AI</a> •
  <a href="#template-api">Template API</a> •
  <a href="#development">Development</a> •
  <a href="#architecture--security">Architecture</a>
</p>

---

<p align="center">
  <img src="docs/assets/dashboard.png" alt="WYNTab Workstation Dashboard" width="100%">
</p>

---

## Overview

Default browser new tab pages are often cluttered with sponsored tiles, algorithmic clickbait feeds, and trackers.

WYNTab replaces default new tabs with an isolated sandbox environment where your own code runs instantly. Build dashboards, minimal clocks, note-taking pads, or full interactive web applications directly in the browser with an integrated CodeMirror 6 editor, or upload static HTML bundles with zero external build tooling.

## Installation

### Web Stores

* **Chrome Web Store:** [Install WYNTab](https://chromewebstore.google.com/detail/wyntab/hbfabaimiglbfjhcppfedgjkpfgabiff) *(Compatible with Chrome, Brave, Edge, Opera, and Vivaldi)*
* **Firefox Add-ons:** Coming soon

### Manual Install (Development Builds)

1. Download `wyntab-*-chrome.zip` from the [Latest Release](https://github.com/getwyntab/wyntab/releases/latest).
2. Unzip the downloaded file.
3. Open `chrome://extensions` in your Chromium browser and enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the unzipped directory.

## Features

* **In-Browser Code Editor:** Full-canvas CodeMirror 6 editor with syntax highlighting, line numbers, and live split-screen preview.
* **On-the-Fly React & JSX:** Transpiles JSX in the browser via Sucrase without needing Node.js or bundlers.
* **Isolated Sandbox Execution:** Templates run inside a dedicated `sandbox.html` runtime via `postMessage`, complying with strict Manifest V3 Content Security Policies.
* **External Module Imports:** Load modern ES modules directly from `https://esm.sh` or style with Tailwind CSS within your templates.
* **Scoped Storage Bridge:** Access asynchronous persistent storage with `window.wyntab` (`get`, `set`, `remove`) scoped per template.
* **Data Portability:** Export and import your custom templates and configurations via JSON backups.
* **Local & Private:** No analytics, external tracking, or account requirements. All data stays in your browser's local storage.
* **Zero-Latency Startup:** Background pre-render pipeline prevents blank or white flashes on new tab initialization.

---

<p align="center">
  <img src="docs/assets/editor.png" alt="In-Dashboard CodeMirror Editor" width="100%">
</p>

---

## Built-in Templates

WYNTab includes five production-ready presets ready to activate or fork:

| Template | Description | Stack |
| :--- | :--- | :--- |
| **Atmosphere** | Ambient gradient background with dynamic clock and greeting. | HTML5, Canvas, CSS |
| **Terminal** | Retro hacker CRT shell with live system stats, uptime, and monospace prompt. | Vanilla JS, Monospace |
| **Links** | Productivity speed dial with customizable bookmarks and search bar. | React 19, Lucide Icons |
| **Minimal** | Distraction-free, typography-focused layout designed for deep work. | Semantic HTML, CSS Grid |
| **Time** | Oversized minimalist typography clock with high-contrast numerals. | SVG, Pure CSS |

<p align="center">
  <img src="docs/assets/atmosphere.png" width="49%" alt="Atmosphere Preset">
  <img src="docs/assets/terminal.png" width="49%" alt="Terminal Preset">
</p>

## Creating Custom Templates with AI

You can generate complete, functional new tab dashboards in seconds using any LLM (ChatGPT, Claude, Gemini, DeepSeek).

### Prompt Template

Copy and paste this prompt into your AI assistant:

```text
Write a complete, single-file HTML new tab page for the WYNTab browser extension.

Requirements:
1. Load Tailwind CSS via: <script src="https://cdn.tailwindcss.com"></script>
2. Layout: Fullscreen (100vw x 100vh), overflow hidden, dark utilitarian theme (bg-[#121316]).
3. Features:
   - Live real-time clock and current date.
   - Quick search input bar that forwards queries to Google or DuckDuckGo.
   - Clean speed-dial grid of bookmarks with icons.
   - Scoped notepad / todo list that persists across browser restarts.
4. Persistent Storage:
   - Use `await window.wyntab.set(key, value)` to save data.
   - Use `await window.wyntab.get(key)` on page load to restore saved state.
5. Return ONLY the raw HTML code inside a single <!DOCTYPE html> block. Do not use external Node/npm dependencies.
```

### How to Install Your New Template

1. Open WYNTab Dashboard (`chrome-extension://...` or click the extension toolbar icon).
2. Click **+** (*Create blank template*) on the top toolbar.
3. Paste the generated HTML into the CodeMirror editor. Inspect the live preview in the right pane.
4. Click **Save Changes**, then toggle **Activate**.

---

## Template API

Templates running in WYNTab have access to a scoped storage bridge exposed on `window.wyntab`:

```javascript
// Store a value scoped to the active template
await window.wyntab.set('todos', ['Ship v0.6.0', 'Review PRs']);

// Retrieve a stored value
const todos = await window.wyntab.get('todos');

// Delete a stored key
await window.wyntab.remove('todos');
```

### External Libraries

Templates can import ES modules from trusted CDNs directly:

```html
<script type="module">
  import confetti from 'https://esm.sh/canvas-confetti';
  confetti();
</script>
```

## Development

### Prerequisites

* Node.js 20 or 22 LTS
* npm

### Setup

```bash
# Clone the repository
git clone https://github.com/getwyntab/wyntab.git
cd wyntab

# Install dependencies
npm install

# Start development runner (Chrome MV3)
npm run dev

# Start development runner (Firefox MV2)
npm run dev:firefox
```

### Testing and Validation

```bash
# Run unit and component test suite
npm test

# Strict TypeScript type check
npm run compile

# Design token audit against DESIGN.md
npm run design:lint
```

### Building Packages

```bash
# Build production zip packages
npm run zip          # Output: .output/wyntab-*-chrome.zip
npm run zip:firefox  # Output: .output/wyntab-*-firefox.zip

# Build store and social assets
npm run assets:cws   # Output: .output/cws-assets/
npm run assets:yt    # Output: .output/yt-assets/
```

## Architecture & Security

WYNTab is architected to ensure user-generated templates cannot access privileged browser APIs:

* **No Remote Execution in Extension Context:** The extension pages (`dashboard.html`, `newtab.html`, `background.js`) contain only local, statically packaged code.
* **Sandboxed Iframe Runtime:** User templates run exclusively within an unprivileged `sandbox.html` iframe with `sandbox="allow-scripts allow-forms allow-popups allow-modals"`.
* **CSP Isolation:** The sandbox iframe has no access to privileged `chrome.*` extension APIs (such as `chrome.cookies`, `chrome.tabs`, or `chrome.webRequest`).
* **Input Sanitization:** Uploaded HTML files and imported JSON backups are processed through a DOMParser-based sanitization pipeline before storage.

## Contributing

Contributions, bug reports, and feature requests are welcome.

1. Check the [Issues](https://github.com/getwyntab/wyntab/issues) tab to see if your proposal is already being discussed.
2. For major changes, please open an issue first to outline what you would like to change.
3. Ensure all tests and lint checks pass before submitting a pull request (`npm test && npm run compile`).

Technical architecture guidelines are documented in [.agents/AGENTS.md](.agents/AGENTS.md).

## License

Copyright (c) 2026 WYNTab Authors.

Licensed under the [Apache License, Version 2.0](LICENSE).
