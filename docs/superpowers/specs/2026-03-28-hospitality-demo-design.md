# Hospitality AI Demo — Design Spec
**Date:** 2026-03-28
**Project:** Zero Clicks — zeroclicks.vercel.app
**Status:** Approved for implementation

---

## Overview

A new `/demo` page on the Zero Clicks site that acts as a live, interactive product showroom. Visitors — primarily UK pub and restaurant owners — watch a fictional pub's AI agent handle real-world complaints, bad reviews, and booking enquiries in real time. The demo uses actual Claude AI responses via n8n, not scripted mockups. The response the visitor sees is the real product working.

**Core value proposition displayed on page:**
> *"Only hear from us when it matters. Everything else is handled."*

---

## Goals

- Give sales prospects a single link that sells the product without a call
- Show the AI handling scenarios every UK pub owner immediately recognises
- Demonstrate the full signal-to-response workflow (Email + Google Reviews + TripAdvisor)
- Future-proof the nav for additional products launching under Zero Clicks

---

## Navigation Change

Update the top navbar to include a `Products` dropdown (replacing or supplementing current nav links):

```
Home | Products ▾ | Pricing | About | Contact
                    └── Inbox Autopilot
                    └── Reputation Manager
                    └── ── ── ── ── ──
                    └── 🎬 Live Demo →
```

- Sets up Zero Clicks as a product platform, not a single-service agency
- Future products slot into the dropdown without nav restructure
- `Live Demo` is a featured item — visually distinct, always visible

---

## The Demo Page `/demo`

### Zone 1 — Hero

**Headline:**
> *"Your pub. Your voice. Zero admin."*

**Subtext:**
> *"Watch the AI handle your toughest moments — complaints, bad reviews, missed bookings — exactly like you would."*

**Context bar** (shown as if logged into a real dashboard):
> 🍺 The Red Lion, Shoreditch — AI Agent: Active

---

### Zone 2 — Command Centre (main interaction)

Split-panel layout:

**Left panel — Incoming Signals Feed**

6 scenario cards displayed as an inbox. Each card shows:
- Source badge: `EMAIL` / `GOOGLE` / `TRIPADVISOR`
- Priority badge: `HIGH` (red) / `LOW` (green)
- Sender/reviewer name (fictional)
- First line of the complaint/review
- Timestamp

**The 6 scenarios:**

| # | Source | Priority | Scenario |
|---|--------|----------|----------|
| 1 | TripAdvisor | HIGH | *"Waited over an hour for food, no one came to apologise or explain"* |
| 2 | Email | HIGH | *"Booked a table for my mum's birthday, arrived and they had no record of it"* |
| 3 | Google | HIGH | *"Staff were rude when we asked about allergens, felt like an inconvenience"* |
| 4 | Google | HIGH | *"Cold food, clearly been sitting under a lamp. Sunday roast was inedible"* |
| 5 | Email | HIGH | *"Left a voicemail 3 days ago about a function booking, still no reply"* |
| 6 | TripAdvisor | LOW | *"Best Sunday roast in the area, staff were brilliant with our kids"* |

**Right panel — AI Processing View**

When a card is clicked, this panel animates through:

**Step 1 — Reading** (0.5s)
> `📥 Reading incoming signal from [source]...`

**Step 2 — Classifying** (0.8s)
> `🔍 Identifying tone: [frustrated / positive]...`
> `⚡ Priority: HIGH — complaint detected`
> `📋 Checking pub context: The Red Lion policies, tone, kitchen hours...`

**Step 3 — Drafting** (1.5s — typewriter effect)
> `✍️ Crafting response in The Red Lion's voice...`
> *[response types out character by character]*

**Step 4 — Owner Notification**
For HIGH priority:
> `📱 WhatsApp alert sent to Sarah (owner)`
> `"Hi Sarah — urgent review just in. I've drafted a response. Tap to review."`

For LOW priority:
> `✅ Handled automatically. Logged to dashboard.`

**Step 5 — Action Bar**
```
[ ✉️ Send Response ]   [ ✏️ Edit First ]
```

---

### Zone 3 — CTA

After demo interaction:

**Headline:**
> *"Want this running in your pub by next week?"*

**Subtext:**
> *"Setup in 48 hours. No tech knowledge needed. Cancel any time."*

**Button:** `Book a Free Call →` (Calendly link)

**Social proof line:**
> *"Join pub owners across the UK who've taken back their evenings."*

---

## The n8n Workflow (real, running behind the demo)

```
[Trigger: webhook from demo UI]
→ [Claude AI: classify intent + priority]
→ [Fetch pub context: name, tone, policies, owner name]
→ [Claude AI: generate response in pub's voice]
→ [IF priority = HIGH → WhatsApp node → notify owner]
→ [IF priority = LOW → log to dashboard, auto-handle]
→ [Return response to frontend]
```

- The demo calls a real n8n webhook
- Claude generates a fresh response every time
- High priority scenarios always fire the WhatsApp notification step (demo shows this visually)
- The workflow IS the product — demo doubles as a live proof of concept

---

## Priority Classification Rules

| Signal | Priority |
|--------|----------|
| Complaint (food, service, wait time) | HIGH |
| Allergen concern | HIGH |
| No booking record / no reply | HIGH |
| Bad review (1-3 stars) | HIGH |
| Positive review (4-5 stars) | LOW |
| General booking enquiry | LOW |
| Supplier communication | LOW |

---

## Design System

Follows existing Zero Clicks design system:
- Dark theme, glass morphism cards
- CSS variables: `var(--bg-card)`, `var(--accent)`, `var(--border-mid)`
- Fonts: `var(--font-display)` headlines, `var(--font-body)` body
- Framer Motion animations (consistent with existing components)
- HIGH priority badges: red (`#ef4444`)
- LOW priority badges: green (`#10b981`)
- AI processing steps: blue accent (`var(--accent)`)

---

## Out of Scope (this phase)

- Real pub onboarding / personalised demo with visitor's own pub name
- TripAdvisor / Google API live data (uses fictional scenarios)
- Dashboard for logged-in pub owners
- Mobile app for WhatsApp notifications (shown visually only in demo)

---

## Success Criteria

- Visitor can click any of the 6 scenarios and see a real AI response within 3 seconds
- HIGH priority scenarios visually show the WhatsApp notification step
- Products dropdown live in nav
- Page works on mobile
- CTA books a Calendly call
