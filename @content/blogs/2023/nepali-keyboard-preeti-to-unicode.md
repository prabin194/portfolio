---
title: "Shipping nepali-keyboard: Preeti → Unicode made easy for the web"
date: "2023-07-16"
description: "Why I built a lightweight JS/TS package to convert Preeti text to Nepali Unicode across frameworks."
readTime: "3 min"
---

**Author:** Prabin  
**Published:** Jul 16, 2023  
**Read time:** 3 min

---

Preeti is still everywhere in legacy docs, but modern apps need Unicode. I built **nepali-keyboard** so teams can drop in a tiny converter and ship Nepali text without wrestling with fonts or copy/paste errors.

## What the library does
- Converts Preeti-encoded strings to Nepali Unicode.
- Works in any JS/TS stack (React, Vue, Svelte, vanilla).
- Keeps the API small: pass text in, get Unicode out.
- Tree-shakeable, zero runtime deps.

## Install
```bash
npm install nepali-keyboard
# or
yarn add nepali-keyboard
```

## Quick usage
```ts
import { preetiToUnicode } from "nepali-keyboard";

const preeti = "cf}+;";
const unicode = preetiToUnicode(preeti);
console.log(unicode); // परिणाम: सफलता (example)
```

### With React input
```tsx
import { useState } from "react";
import { preetiToUnicode } from "nepali-keyboard";

export default function Converter() {
  const [preeti, setPreeti] = useState("");
  const unicode = preetiToUnicode(preeti);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Preeti text</label>
      <textarea
        value={preeti}
        onChange={(e) => setPreeti(e.target.value)}
        className="w-full rounded border p-2"
        rows={4}
      />
      <div className="text-sm text-muted-foreground">Unicode output</div>
      <div className="rounded border bg-muted p-3 whitespace-pre-wrap">
        {unicode}
      </div>
    </div>
  );
}
```

## Why build it?
- Teams were copy/pasting ad-hoc maps of Preeti glyphs, missing edge cases.
- Designers wanted Nepali content to render correctly across browsers without bundling fonts.
- A framework-agnostic helper beats duplicating logic in every project.

## What’s inside
- Mapped glyph table for Preeti → Unicode.
- Typed API (TS definitions ship with the package).
- ESM + CJS builds; side-effect free for tree shaking.

## Roadmap
- CLI helper for batch converting text files.
- Vite/webpack plugin to preprocess Preeti assets at build time.
- More tests around mixed-script inputs and cursor-safe transformations.

Grab the repo: https://github.com/prabin194/nepali-keyboard — I’m open to issues and PRs. Ship Unicode without the headaches.
