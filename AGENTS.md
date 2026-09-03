# AGENTS.md - Antigravity Guidelines & Engineering Standards

This file sets non-negotiable instructions and project context for any AI agent working on WYNTab.

---

## 1. Project Overview
**WYNTab** is a browser extension that allows users to fully customize their New Tab page by uploading and activating their own HTML templates. It is built using the [WXT (Web Extension Toolbox)](https://wxt.dev/) framework with **React 19**, **TypeScript**, and **Tailwind CSS 4**.

### Core Architecture & Entrypoints
- **New Tab (`src/entrypoints/newtab/`)**: Custom new tab page. Retrieves active template HTML from `browser.storage.local` and renders inside an `iframe` via `srcdoc` with sandbox (`allow-scripts allow-same-origin allow-forms`). Avoids `blob:` URL CSP blocks.
- **Dashboard (`src/entrypoints/dashboard/`)**: Management interface. Supports template activation, preview, upload, duplicate, rename, JSON backup export/import, and integrated code editing. Responsive across popup, side panel, and desktop.
- **Editor (`src/components/Editor.tsx`)**: CodeMirror 6 based component for direct HTML/CSS editing.
- **Onboarding (`src/entrypoints/onboarding/`)**: Welcome page shown on installation.
- **Background (`src/entrypoints/background.ts`)**: Handles extension action click and `onInstalled` lifecycle events.
- **Lib (`src/lib/`)**:
  - `storage.ts`: Strongly-typed storage definitions via `@wxt-dev/storage` using `unlimitedStorage` permission.
  - `templates.ts`: Discovers built-in templates via Vite's `import.meta.glob`.
  - `sanitize.ts`: DOMParser-based sanitization for user-uploaded HTML, stripping dangerous tags (`<script>`, `<iframe>`, `<object>`) and `on*` inline handlers.
- **Theme Management**: `public/theme-init.js` prevents flash of unstyled theme on load.

### Key Technologies
- **Framework**: [WXT](https://wxt.dev/) (v0.21)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with **lucide-react** icons.
- **Design System**: [DESIGN.md](file:///e:/lazyman/rockyxwall/02_Codeing/01_Github/wyntab/DESIGN.md) (Google `@google/design.md` token specification).
- **Storage**: `@wxt-dev/storage` wrapping `browser.storage.local`.

---

## 2. Building, Running & Testing

### Development
```bash
npm run dev          # Chrome MV3
npm run dev:firefox  # Firefox MV2
```

### Production Build & Packaging
```bash
npm run build        # Build Chrome MV3
npm run build:firefox # Build Firefox MV2
npm run zip          # Package Chrome zip
npm run zip:firefox  # Package Firefox zip
```

### Testing & Validation
```bash
# Run all unit and UI component tests
npm test

# Lint DESIGN.md spec tokens and contrast
npm run design:lint

# Strict TypeScript type checking
npm run compile
```

---

## 3. UI Guardrails & Anti-AI-Slop Rules

### UI Golden Rule: Strictly Follow DESIGN.md
All UI components, typography, colors, radii, and layouts must conform to [DESIGN.md](file:///e:/lazyman/rockyxwall/02_Codeing/01_Github/wyntab/DESIGN.md).
- Validate with `npm run design:lint` before and after UI changes.
- Zero errors and zero warnings are permitted.

### Anti-AI-Slop Guardrails
Never produce AI design slop:
- **No Decorative Pseudo-Cyber Accents**: No glowing corners, blur overlays (`blur-[1px]`), neon ring glows (`ring-primary/20`), or nested visual frames.
- **No Illegible Micro-Typography**: Never use font sizes below 12px (`text-[8px]`, `text-[9px]`, `text-[10px]` are prohibited). Never use exaggerated letter spacing (`tracking-[0.2em]`).
- **No Gratuitous Animations**: Never add multi-second animations, zoom-ins, or bouncing delays (`duration-1000 zoom-in-95`). Use fast, subtle transitions (<= 150ms `transition-colors`, `transition-opacity`).
- **No Hover-Only Controls**: Primary actions (Activate, Edit, Preview, Delete) must remain directly accessible via touch and keyboard navigation, not locked behind mouse hover states.

### Viewport Responsiveness Contract
WYNTab operates across three distinct browser extension environments:
1. **Extension Popup**: Width 360px - 420px, max height 600px.
   - Navigation: Top compact tab strip (no fixed 256px sidebar).
   - Card lists: Single column stack (`grid-cols-1`).
   - Zero horizontal scrollbars.
2. **Extension Side Panel**: Width 320px - 450px, full window height.
   - Vertical density: Compact paddings (`p-3` to `p-4`), concise button labels.
3. **Full Tab / Desktop**: Width >= 768px.
   - Left-hand navigation sidebar, multi-column card grid (`sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).

---

## 4. Development Conventions & Safety

### Coding Standards
- **TypeScript**: Strict typing for all interfaces; zero `any` in application code.
- **React**: Functional components and hooks only.
- **Safety**: All user-uploaded HTML **must** pass through `sanitizeHtml` in `src/lib/sanitize.ts` before storage.
- **Lockfile Integrity**: Use `npm install` / `npm uninstall` when updating dependencies so `package-lock.json` stays synchronized with GitHub Actions CI.
- **Storage**: Use `activeTemplateId` for selected template ID and `activeTemplateHtml` for instant tab rendering.
