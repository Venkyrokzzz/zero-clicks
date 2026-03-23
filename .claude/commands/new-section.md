---
name: new-section
argument-hint: [section-name]
description: Add a new section to the homepage following Zero Clicks design system
---

Add a new homepage section called "$ARGUMENTS":

1. Read lib/content.ts to understand the content structure
2. Add the new section's content/data to lib/content.ts
3. Create components/$ARGUMENTS.tsx following these rules:
   - Framer Motion useInView with once:true, margin:"-40px"
   - Stagger animations with 0.1s delays between items
   - Glass card style: backdropFilter blur(20px), rgba(255,255,255,0.04) background
   - CSS variables for all colours: var(--accent), var(--text-primary), etc.
   - Section padding: paddingTop/paddingBottom 96px
   - Max width container: maxWidth 1100px, margin auto, paddingInline 24px
4. Import and add to app/page.tsx in the correct position
5. Run `npm run build` to verify no errors
6. Take a screenshot to show the result
