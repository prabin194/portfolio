---
title: "Building nepali-number-words: a small TypeScript package for Nepali numbers, currency, and Devanagari digits"
date: "2026-04-21"
description: "Why I built nepali-number-words, what problems it solves, and the API surface that makes Nepali number handling usable across apps."
readTime: "4 min"
tags: ["TypeScript", "NPM", "Open Source", "Nepali", "Localization", "Currency"]
---

I built `nepali-number-words` because I kept seeing the same problem repeated across products: the app needed Nepali numbers or amount-in-words output, but the implementation lived as one-off helper functions buried inside a single codebase.

That works until you need the same logic in another app, another form, or another document flow. Then you end up copying half-tested snippets for rupees, paisa, Devanagari digits, or text conversion and fixing the same edge cases again.

`nepali-number-words` is my attempt to make that problem boring. It is a small framework-independent TypeScript package that handles the most common Nepali number transformation needs in one place.

## The problem I wanted to solve
- Convert numbers like `4750` into proper Nepali words.
- Convert monetary amounts into cheque-friendly Nepali currency text.
- Render Devanagari digits where the UI needs them.
- Reuse the same logic across React, Next.js, Node.js, or plain TypeScript projects.
- Avoid dragging app-specific formatting helpers from project to project.

## What the package ships
The package currently covers five practical use cases:

- **Number to Nepali words**  
  `toNepaliWords(4750)` returns `चार हजार सात सय पचास`.
- **Amount to Nepali currency words**  
  `toNepaliAmount(4750.5)` returns `चार हजार सात सय पचास रुपैयाँ पचास पैसा मात्र`.
- **Nepali words back to number**  
  `nepaliWordsToNumber("एक सय")` returns `100`. This is still experimental, but useful where reverse parsing is needed.
- **Arabic numerals to Devanagari digits**  
  `toNepaliDigits("Rs. 4750.00")` returns `Rs. ४७५०.००`.
- **Text transformation and currency formatting**  
  `toNepaliText("Pay 4750 now")` swaps standalone numbers into Nepali words, and `formatNepaliCurrency(4750)` outputs `रु. 4,750.00`.

## Why I kept it framework-independent
This package is not tied to React or any UI library. That was a deliberate choice.

Localization utilities like this should be usable in:
- backend document generation
- invoice and voucher flows
- cheque printing
- frontend forms
- CMS content pipelines
- CLI scripts and data migration tools

If the core logic is correct, it should not care where it runs. Shipping it as a dependency-free TypeScript library makes it easier to drop into any JavaScript runtime without extra baggage.

## A few API decisions that matter
I wanted the package to be easy to reach for, so the exported API stays short and explicit:

```ts
import {
  toNepaliWords,
  toNepaliAmount,
  toNepaliDigits,
  toNepaliText,
  formatNepaliCurrency,
  nepaliWordsToNumber,
} from "nepali-number-words";
```

Some details I cared about:

- `toNepaliAmount()` supports options like `appendOnly`, `showPaisa`, `paisaSeparator`, and `chequeStyle`, because financial documents usually need stricter wording rules than UI labels.
- `formatNepaliCurrency()` supports Nepali/Indian grouping and optional Devanagari digit output.
- `toNepaliText()` only replaces standalone numbers, which avoids damaging mixed strings unnecessarily.
- The package ships both ESM and CommonJS outputs so it fits into more environments cleanly.

## Example
```ts
import {
  toNepaliWords,
  toNepaliAmount,
  toNepaliDigits,
  formatNepaliCurrency,
} from "nepali-number-words";

toNepaliWords(100000); // "एक लाख"
toNepaliAmount(4750.5); // "चार हजार सात सय पचास रुपैयाँ पचास पैसा मात्र"
toNepaliDigits("Invoice #12345"); // "Invoice #१२३४५"
formatNepaliCurrency(4750, { devanagari: true }); // "रु. ४,७५०.००"
```

## What I think makes it useful
The value is not that converting `100` into `एक सय` is hard. The value is having one consistent implementation that can be installed, tested, versioned, and reused.

That matters when your application handles official documents, money, or Nepali-facing interfaces. Small formatting inconsistencies become product bugs quickly in those domains.

## Current state
The package is published as `nepali-number-words` on npm and is currently at `1.1.2`.

It ships with:
- zero runtime dependencies
- TypeScript definitions
- Node `>=16`
- ESM and CommonJS builds

## What’s next
- Improve the reverse parser so `nepaliWordsToNumber()` handles more real-world phrasing safely.
- Expand tests around tricky currency and text transformation cases.
- Keep the API small while making the conversion rules more robust.

If you work on products for Nepali users, this is exactly the kind of utility that should live in one maintained package instead of five copy-pasted helpers.
