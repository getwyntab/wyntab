---
version: "alpha"
name: WYNTab
description: "Utilitarian design system for WYNTab browser extension full-tab dashboard and newtab surfaces"
colors:
  primary: "#D37918"
  primary-hover: "#FC9729"
  on-primary: "#161616"
  secondary: "#969696"
  on-secondary: "#161616"
  surface: "#222222"
  on-surface: "#EAEAEA"
  surface-muted: "#1F1F1F"
  border: "#373737"
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
    rounded: "{rounded.md}"
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
The UI adheres to Linear/Raycast/Violentmonkey utilitarian minimalism: high-contrast dark-first design, amber accents (#D37918), 1px solid structural dividers, and zero AI visual slop.

## Colors

The palette emphasizes dark-first high-contrast fundamentals with an amber accent:
- **Primary (#D37918)**: Utilitarian amber accent for active badges, toggles, and primary CTAs. Text on primary is #161616 bold.
- **Secondary (#969696)**: Muted gray for auxiliary labels, status markers, and secondary borders.
- **Surface (#222222)**: Dark card surface and modal container backdrop in dark theme.
- **Surface Muted (#1F1F1F)**: Secondary action surface and recessed wells.
- **Border (#373737)**: Crisp 1px structural hairline dividing panes, headers, and cards.
- **Error (#DC2626)**: Reserved strictly for destructive actions (e.g. deleting templates).

## Typography

Typography uses the native system font stack (`system-ui, sans-serif`) for instant zero-latency rendering.
- **Headlines (`headline-lg`, `headline-md`)**: 18px-24px semibold/bold for view titles and dialog headers.
- **Body (`body-lg`, `body-md`, `body-sm`)**: 12px-15px readable weights. Minimum body font size is strictly 12px.
- **Labels (`label-md`)**: 12px semibold for tab navigation and action triggers.

## Layout

The UI operates as a dedicated full-page desktop application (>= 1024px) with a persistent 240px left sidebar and responsive 3-column template grid (max width 1440px). The Template Editor locks to a full-screen 100vw x 100vh canvas with a 50/50 draggable split view.
