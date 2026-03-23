---
name: frontend-design
description: Apply Zero Clicks exact design standards to any new UI component or section. Auto-applies when building new components.
user-invocable: true
---

# Zero Clicks Design System

## Colours (CSS variables — always use these)
- Background: var(--bg) = #020817
- Surface: var(--surface) = rgba(255,255,255,0.03)
- Accent: var(--accent) = #3b82f6
- Text primary: var(--text-primary) = rgba(255,255,255,0.92)
- Text muted: var(--text-muted) = rgba(255,255,255,0.45)
- Border: var(--border) = rgba(255,255,255,0.06)

## Typography
- Display font: var(--font-display) — used for headings
- Body font: var(--font-body) — used for paragraphs
- Hero heading: 3.2rem, fontWeight 700, letterSpacing -0.02em
- Section heading: 2rem, fontWeight 700
- Body text: 1rem, lineHeight 1.7, color var(--text-muted)

## Spacing
- Section padding: 96px top and bottom
- Container: maxWidth 1100px, margin auto, paddingInline 24px
- Card padding: 28px-32px
- Gap between cards: 20px-24px
- Border radius cards: 16px
- Border radius small elements: 8px-10px

## Glass Cards
```
background: rgba(255,255,255,0.03)
backdropFilter: "blur(20px) saturate(160%)"
WebkitBackdropFilter: "blur(20px) saturate(160%)"
border: "1px solid rgba(255,255,255,0.06)"
borderRadius: "16px"
```

## Hover States
- Cards: border brightens to rgba(255,255,255,0.12)
- Scale: transform scale(1.01) on hover
- Transition: all 0.2s ease

## Accent Glow (for highlighted elements)
```
boxShadow: "0 0 28px rgba(59,130,246,0.15), 0 8px 24px rgba(0,0,0,0.4)"
border: "1px solid rgba(59,130,246,0.3)"
```

## Animation Pattern
```typescript
const ref = useRef(null)
const inView = useInView(ref, { once: true, margin: "-40px" })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 24 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.5, delay: index * 0.1 }}
>
```
