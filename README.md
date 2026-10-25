<p align="center">
  <img src="public/icon/128.png" alt="WYNTab" width="96" height="96">
</p>

<h1 align="center">WYNTab</h1>

<p align="center">
  <strong>Write Your NewTab</strong> — An open-source browser extension to build, edit, and run custom HTML, CSS, and React templates as your new tab page.
</p>

<p align="center">
  <a href="https://github.com/getwyntab/wyntab/releases/latest"><img src="https://img.shields.io/github/v/release/getwyntab/wyntab?style=flat-square&color=10B981&label=Release" alt="Latest Release"></a>
  <a href="https://chromewebstore.google.com/detail/wyntab/hbfabaimiglbfjhcppfedgjkpfgabiff"><img src="https://img.shields.io/chrome-web-store/users/hbfabaimiglbfjhcppfedgjkpfgabiff.svg?style=flat-square&label=Users&logo=googlechrome&logoColor=white&color=10B981" alt="Chrome Web Store Users"></a>
  <a href="https://chromewebstore.google.com/detail/wyntab/hbfabaimiglbfjhcppfedgjkpfgabiff"><img src="https://img.shields.io/chrome-web-store/rating/hbfabaimiglbfjhcppfedgjkpfgabiff.svg?style=flat-square&label=Rating&color=10B981" alt="Chrome Web Store Rating"></a>
  <a href="https://github.com/getwyntab/wyntab/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/getwyntab/wyntab/ci.yml?branch=main&style=flat-square&label=Build" alt="Build Status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#built-in-templates">Built-in Templates</a> •
  <a href="#creating-custom-templates">Create with AI</a> •
  <a href="#template-api">Template API</a> •
  <a href="#development">Development</a> •
  <a href="#architecture--security">Architecture</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

Default browser new tab pages are often cluttered with sponsored tiles, algorithmic feeds, and trackers.

WYNTab replaces default new tab clutter with an isolated sandbox environment where your own code runs instantly. Build dashboards, clocks, note-taking pads, or full web apps directly in the browser with an integrated CodeMirror editor, or upload static HTML bundles with zero external build configuration.

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

## Built-in Templates

WYNTab includes five production-ready presets ready to activate, customize, or fork:

| Preview | Preset | Description | Stack |
| :---: | :--- | :--- | :--- |
| <img src=".github/assets/template-atmosphere.png" width="220" alt="Atmosphere"> | **Atmosphere** | Ambient gradient with smooth dynamic clock and greeting. | HTML5, Canvas, CSS |
| <img src=".github/assets/template-terminal.png" width="220" alt="Terminal"> | **Terminal** | Retro hacker CRT shell with live system stats and monospace prompt. | Vanilla JS, Monospace |
| <img src=".github/assets/template-links.png" width="220" alt="Links"> | **Links** | Productivity speed dial with custom bookmarks and search bar. | React 19, Lucide Icons |
| <img src=".github/assets/template-minimal.png" width="220" alt="Minimal"> | **Minimal** | Distraction-free, typography-focused layout for deep work. | Semantic HTML, CSS Grid |
| <img src=".github/assets/template-time.png" width="220" alt="Time"> | **Time** | Oversized minimalist typography clock with high-contrast numerals. | SVG, Pure CSS |

## Creating Custom Templates

You can build templates manually in the WYNTab editor, upload single `.html` files, or generate complete custom new tab pages using AI models (ChatGPT, Claude, Gemini).

### Generating Templates with AI

Copy and paste the following prompt into your preferred AI model along with your desired features:

```text
Create a single-file HTML new tab page for the WYNTab browser extension.

Technical Specifications:
1. Deliver a single, complete, self-contained HTML file (all CSS in <style> and all JS in <script> or <script type="module">).
2. Layout must fill the full viewport (100vw by 100vh) with zero margin and zero scrollbar overflow:
   html, body { width: 100vw; height: 100vh; margin: 0; padding: 0; overflow: hidden; }
3. Theme: Utilitarian dark-mode first (#121212 / #1E1E1E surfaces with high-contrast readable typography).
4. Styling: You may include Tailwind CSS directly via:
   <script src="https://cdn.tailwindcss.com"></script>
5. Libraries: You may import external ES modules directly from https://esm.sh/ (e.g. canvas-confetti, lucide, chart.js).
6. Data Persistence: For any user data (notes, bookmarks, settings, todos), use WYNTab's asynchronous storage bridge instead of localStorage:
   - Save: await window.wyntab.set('key', value)
   - Read: const val = await window.wyntab.get('key')
   - Delete: await window.wyntab.remove('key')

Feature Requirements:
[Describe your desired new tab experience here — e.g., "A minimalist Pomodoro timer with daily top-3 task checklist and keyboard shortcuts."]
```

Once generated, click **New Template** (`+`) in the WYNTab Dashboard, paste the code, and click **Save Changes**.

## Template API

Templates running in WYNTab communicate with extension storage through a scoped bridge on `window.wyntab`:

```javascript
// Store a value scoped to the current template
await window.wyntab.set('notes', 'Review pull requests before release');

// Retrieve a stored value
const notes = await window.wyntab.get('notes');

// Delete a stored key
await window.wyntab.remove('notes');
```

### Loading External Modules

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

* **No Remote Execution in Extension Context:** The extension's extension pages (`dashboard.html`, `newtab.html`, `background.js`) contain only local, statically packaged code.
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

```text
Copyright (c) 2026 WYNTab Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
