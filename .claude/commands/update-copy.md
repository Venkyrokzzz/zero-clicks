---
name: update-copy
argument-hint: [what to update]
description: Update website copy - always edits lib/content.ts only
---

Update the copy for "$ARGUMENTS" on the Zero Clicks website:

1. Read lib/content.ts in full
2. Identify the relevant section for "$ARGUMENTS"
3. Rewrite following Zero Clicks tone:
   - Direct and specific — no buzzwords
   - Problem-first — lead with client pain
   - UK English
   - Short sentences (max 20 words)
   - Specific numbers over vague claims
4. Edit ONLY lib/content.ts — never hardcode text in components
5. Show the before and after copy for review
6. Run `npm run build` to confirm no build errors
