---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
  - "app/**/*.ts"
---

# Zero Clicks Frontend Rules

## Components
- Functional components + hooks only — no class components
- All copy/text comes from lib/content.ts — never hardcode strings in components
- next/image for ALL images — add `unoptimized` prop for static files in /public

## Styling
- CSS variables via var(--token) — never hardcode hex colours
- Tailwind for layout only — component styles use inline style objects
- Dark mode only — background always var(--bg) or rgba(2,8,23,x)
- Glass effect: backdropFilter:"blur(20px) saturate(160%)", WebkitBackdropFilter same
- Borders: rgba(255,255,255,0.06) default, rgba(255,255,255,0.12) hover

## Animations
- Framer Motion for ALL scroll animations
- useInView with { once: true, margin: "-40px" }
- Stagger: 0.1s delay between list items, 0s for first item
- Never animate SVG stroke-dashoffset with willChange
- transform:translateZ(0) on animated SVG elements for GPU compositing

## TypeScript
- Strict mode — no `any` types
- Explicit return types on all functions
- Props interfaces defined above component

## Performance
- No unnecessary re-renders — check useCallback/useMemo usage
- Images: always specify width and height
- Framer Motion: use once:true to avoid re-animating on scroll back
