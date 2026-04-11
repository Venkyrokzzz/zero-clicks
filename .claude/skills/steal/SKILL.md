# /steal — Design Pattern Research & Implementation

## What it does
Takes a competitor or inspiration site URL (or name), reverse-engineers what makes it work, maps it to Zero Clicks, and builds it.

## Usage
```
/steal [site name or URL] [what to improve]
```

Examples:
- `/steal linear homepage layout`
- `/steal vercel hero section`
- `/steal outpero section order`
- `/steal stripe testimonials`

---

## The Process

### 1. Fetch & Analyse
- Visit the target site
- Extract: headline formula, section order, key patterns, visual tricks, copy style

### 2. Compare
Side-by-side table: them vs Zero Clicks — what they do better, what we do better

### 3. Identify the steal
One specific pattern worth taking. Name it clearly:
- "Their problem stats block"
- "Their headline formula: problem → fix"
- "Their section order: proof early, detail late"

### 4. Map to Zero Clicks
Translate the pattern into our stack (Next.js, Framer Motion, dark theme, hospitality context). Never copy verbatim — adapt.

### 5. Build it
Write the component or edit the layout. Verify in preview.

---

## The Rule
**Steal the pattern, not the pixels.**

- Pattern = structure, order, formula, rhythm ✓
- Pixels = colours, copy, exact layout ✗

Good steal: "Loom shows brutal stats before their product demo → we show 2,000 / 90min / £0 before WhatWeDo"
Bad steal: copying their card design exactly

---

## Proven steals so far

| Source | What we took | Where it lives |
|---|---|---|
| Loom | Brutal 3-stat problem row | `ProblemStats.tsx` |
| Linear | Bento grid asymmetric layout | `WhatWeDo.tsx` |
| Vercel | Subtext = one sentence company intro | `page.tsx` hero |
| Stripe | Social proof (testimonials) high up, before pricing | `page.tsx` order |
| Outpero | Compared positioning — confirmed we're more specific | — |

---

## Sites to steal from next
- Framer — animated section transitions
- Raycast — feature detail cards
- Superhuman — email product storytelling
- Resend — developer-trust copy style
- Cal.com — transparent pricing layout
