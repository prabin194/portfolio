---
title: "Building a reusable Nepali (BS) date picker for React: what I shipped and why it matters"
date: "2026-02-06"
description: "How I shipped bos-nepali-date: a fully localized, accessible Bikram Sambat date picker with plug-in data, masking, and built-in styling."
readTime: "3 min"
---

**Author:** Prabin  
**Published:** Feb 6, 2026  
**Read time:** 3 min

---

When teams needed Bikram Sambat support, they were re-implementing incomplete pickers with brittle inputs and missing accessibility. I wanted a drop-in React component that just works—no Tailwind setup or custom conversion wiring required.

## The problem I set out to solve
- Repeated, inconsistent BS pickers with partial datasets and styling gaps.
- Consumers shouldn’t configure Tailwind or write conversion logic just to pick a date.
- Accessibility, localization, and real-world constraints (disabled dates, masking) were missing.

## Key improvements I delivered
- **Full BS dataset (2000–2099) + pluggable adapter**  
  Ships with a complete table and a clean adapter interface so teams can swap their own data.
- **Localized UI (English + Nepali)**  
  Month/weekday labels and digits render in Nepali when `lang="ne"`, while emitted values stay ASCII `YYYY-MM-DD`.
- **Robust input mask**  
  Normalizes Nepali/Arabic digits to ASCII, enforces `YYYY-MM-DD`, blocks non-digits, and keeps the view in sync.
- **Disable & range constraints**  
  `disableToday`, specific dates, lists, before/after bounds, plus `minDate`/`maxDate` all feed one guard function.
- **Picker controls you can hide or style**  
  `showMonth` / `showYear` toggles, optional label, and `inputClassName` to restyle without fighting defaults.
- **Polished UX & accessibility**  
  Calendar icon trigger, ESC and click-away to close, focus trapping, aria-expanded/haspopup, disabled day states, footer “Clear/Today”.
- **CSS that “just works”**  
  Styles auto-inject from the bundle; explicit imports (`bos-nepali-date/style`) are available for strict bundlers.
- **Tested surface**  
  Vitest + Testing Library cover locale rendering, input masking, disable logic, and selector visibility.

## How I built it (high level)
1) **Data correctness first:** authoritative BS 2000–2099 dataset and anchored conversion math.  
2) **API design:** small, predictable prop surface (`value/onChange/adapter`) with opt-in features.  
3) **Styling pipeline:** tsup injects CSS, marked as side effects, export style subpaths for bundlers.  
4) **DX & docs:** aligned `exports` with build outputs, documented props and changelog.  
5) **Polish loop:** iterated on UI, localization, accessibility with tests and demo feedback.

## What this solves for consumers
- **Drop-in experience:** Install, import, and styles load automatically—no Tailwind required.
- **Correct dates:** Valid BS coverage across 2000–2099—no “year not supported” surprises.
- **Global-ready:** Nepali and English UI; values stay DB-friendly (`YYYY-MM-DD`).
- **Product-grade UX:** Masking, disabled states, and accessible interactions reduce form bugs.
- **Themable:** Add your own classes or CSS variables without forking the component.

## Quick usage
```tsx
import { useState } from "react";
import { NepaliDatePicker, defaultAdapter } from "bos-nepali-date";
// Optional if your bundler drops side effects:
// import "bos-nepali-date/style";

function Demo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <NepaliDatePicker
      value={value}
      onChange={setValue}
      adapter={defaultAdapter}
      lang="ne"
      disableToday
      inputClassName="my-input"
    />
  );
}
```

## Release notes (latest)
- **0.1.7:** `inputClassName`, calendar icon trigger, version bump.  
- **0.1.6:** Auto-injected CSS, tsup config to emit styles.

## What’s next
- Publish Storybook examples.  
- Expand dataset maintenance tooling and add range picker mode.  
- CI smoke tests for lang/disable props across adapters.

If you’re ready, install `bos-nepali-date@0.1.7` and ship it.
