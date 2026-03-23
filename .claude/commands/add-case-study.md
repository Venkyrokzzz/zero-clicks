---
name: add-case-study
argument-hint: [client/project name]
description: Add a new case study / portfolio project to the website
---

Add a new case study for "$ARGUMENTS":

1. Read lib/content.ts — find the FEATURED_PROJECT or projects section
2. Ask me for: client type, problem they had, solution built, results/metrics
3. Add the case study to lib/content.ts with:
   - title, subtitle, description
   - story: { problem, solution, result }
   - stats: 3 key metrics with numbers
   - tags: tools used (n8n, Claude AI, etc.)
4. Update components/FeaturedProject.tsx if a new layout is needed
5. Run `npm run build` to verify
6. Suggest a LinkedIn post based on this case study
