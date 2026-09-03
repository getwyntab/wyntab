---
version: "alpha"
name: WYNTab
description: "Design system for WYNTab browser extension across popup, sidebar, and desktop viewports"
colors:
  primary: "#111827"
  primary-hover: "#1F2937"
  on-primary: "#FFFFFF"
  secondary: "#4B5563"
  on-secondary: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#111827"
  surface-muted: "#F3F4F6"
  border: "#E5E7EB"
  error: "#DC2626"
  on-error: "#FFFFFF"
typography:
  headline-lg:
    fontFamily: system-ui, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  headline-md:
    fontFamily: system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  label-md:
    fontFamily: system-ui, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 10px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 10px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  badge-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.full}"
  button-secondary-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.on-surface}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.full}"
---

## Overview

WYNTab is a distraction-free, functional utility extension for replacing the browser New Tab page with custom HTML.
The UI adheres to utilitarian minimalism: crisp contrast, intuitive controls, and responsive density.
It avoids decorative noise, faux-cyberpunk glowing outlines, or bloated animations.

## Colors

The palette emphasizes clean monochrome fundamentals with high contrast to ensure readability across light and dark modes:

- **Primary (#111827)**: Deep slate for prominent CTAs, active badges, and core headings.
- **Secondary (#4B5563)**: Medium slate for secondary labels, borders, and subtle badges.
- **Surface (#FFFFFF)**: Pure white canvas for cards and elevated panels in light theme.
- **Surface Muted (#F3F4F6)**: Soft neutral background for secondary actions, chip states, and nested wells.
- **Border (#E5E7EB)**: Crisp 1px outline for structural hierarchy and separation.
- **Error (#DC2626)**: Reserved strictly for destructive actions (e.g. deleting templates) and error states.

## Typography

Typography uses the native system font stack (`system-ui, sans-serif`) for instant rendering with zero network latency.

- **Headlines (`headline-lg`, `headline-md`)**: 18px-24px bold/semibold for view titles and dialog headers.
- **Body (`body-lg`, `body-md`, `body-sm`)**: 12px-15px readable weights. Minimum body font size is strictly 12px (never 8px or 9px micro-text).
- **Labels (`label-md`)**: 12px semibold for tab navigation and action triggers. Tracking is kept standard (no tracking-[0.2em] artificial letter-spacing).

## Layout

The UI operates across three responsive form factors:

1. **Extension Popup (360px - 420px)**: Compact vertical column. Navigation renders as a clean top tab strip. Template cards stack in a single column.
2. **Side Panel (320px - 450px)**: Vertical flow optimized for narrow sidebars. Controls and headers shrink padding (`spacing.sm` to `spacing.md`).
3. **Full Tab / Desktop (>= 768px)**: Left-side navigation bar with responsive multi-column template grid (`spacing.lg` gutters).

## Elevation & Depth

Visual hierarchy is communicated via clean 1px structural borders and subtle tonal contrast rather than exaggerated blur halos or glowing rings:
- Inactive cards use a subtle `border` on `surface`.
- Active template cards use a clear `primary` border highlight.
- Modals use a clean translucent backdrop with solid surface containment.

## Shapes

Shapes follow restrained geometric radii:
- Buttons and form inputs use `rounded.md` (8px).
- Cards and panels use `rounded.lg` (12px).
- Status pills and avatar chips use `rounded.full` (9999px).
- Sharp, jarring corner accents or glowing brackets are strictly prohibited.

## Components

- **Buttons**:
  - `button-primary`: Dark solid fill with light text for primary activation and save actions.
  - `button-secondary`: Muted neutral fill with dark text for previews, duplications, and secondary actions.
  - Sizing ensures minimum 36px-40px click/touch target.
- **Cards (`card`)**:
  - Contains preview thumbnail, title, template badge, and accessible action buttons.
  - Actions must remain visible and accessible without requiring mouse hover.
- **Tabs**:
  - Clean pill or border indicator for active section (Built-in, Custom, Settings).

## Do's and Don'ts

- **Do** support narrow 360px viewports without horizontal scrolling.
- **Do** keep actions visible or accessible via keyboard/touch, not hover-only overlays.
- **Do** maintain WCAG AA contrast (minimum 4.5:1) for all text and interactive elements.
- **Don't** add decorative glowing corner brackets, blur pseudo-elements, or cybernetic borders.
- **Don't** use micro-typography below 12px or extreme letter spacing (`tracking-[0.2em]`).
- **Don't** use slow, gratuitous UI animations (keep transitions under 200ms).
