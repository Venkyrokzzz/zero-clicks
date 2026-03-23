---
paths:
  - "lib/**/*.ts"
  - "lib/**/*.tsx"
---

# Zero Clicks Content Rules

## The Golden Rule
ALL website copy lives in lib/content.ts. Components read from it. Never the other way around.

## Content Structure
- SITE: name, tagline, description, url
- SERVICES: array of service objects
- PACKAGES: pricing tiers (Starter, Pro, Monthly)
- FEATURED_PROJECT: the pub Gmail case study
- TESTIMONIALS: client quotes (mark as placeholder until real)
- ABOUT: Venky's bio — nearly 2 years at Greene King, not "years of experience"
- HOW_IT_WORKS: 4-step process

## Tone Rules
- UK English: organise, colour, behaviour, centre
- Direct: "We fix your inbox" not "We leverage AI to optimise your inbox management"
- Specific: "90 minutes a day" not "significant time savings"
- No buzzwords: seamless, cutting-edge, revolutionary, leverage, synergy
- Problem-first: always start with their pain, then the solution

## Numbers
- Always back claims with specifics: time saved, cost, percentage
- Don't invent metrics — use real ones from actual projects
- If placeholder, mark clearly: // TODO: replace with real metric
