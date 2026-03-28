# Hospitality AI Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/demo` page on the Zero Clicks site showing a fictional UK pub's AI agent handling real complaints, bad reviews, and booking enquiries using live Claude AI responses.

**Architecture:** A Next.js page at `/demo` with a split-panel Command Centre — left panel shows 6 scenario cards (Email/Google/TripAdvisor), right panel animates the AI processing steps and streams a real Claude API response. The Navbar gets a Products dropdown. All copy lives in `lib/content.ts`.

**Tech Stack:** Next.js 14, TypeScript, Framer Motion, Anthropic SDK (`@anthropic-ai/sdk`), existing CSS variables design system.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/content.ts` | Modify | Add DEMO_PAGE, DEMO_SCENARIOS exports |
| `app/api/demo/route.ts` | Create | Claude API endpoint — generates pub response |
| `components/Navbar.tsx` | Modify | Add Products dropdown |
| `app/demo/page.tsx` | Create | Page layout — assembles all demo sections |
| `components/DemoHero.tsx` | Create | Hero section with pub context bar |
| `components/DemoCommandCentre.tsx` | Create | Split-panel — holds scenario list + processing panel |
| `components/DemoScenarioCard.tsx` | Create | Individual scenario card (left panel) |
| `components/DemoProcessingPanel.tsx` | Create | AI thinking steps + typewriter response (right panel) |
| `components/DemoCTA.tsx` | Create | Bottom CTA with Calendly link |

---

## Task 1: Install Anthropic SDK

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the SDK**

```bash
cd /Users/venky/zero-clicks && npm install @anthropic-ai/sdk
```

Expected output: `added X packages`

- [ ] **Step 2: Verify installed**

```bash
cat package.json | grep anthropic
```

Expected: `"@anthropic-ai/sdk": "^X.X.X"`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add anthropic sdk"
```

---

## Task 2: Add Demo Content to lib/content.ts

**Files:**
- Modify: `lib/content.ts`

- [ ] **Step 1: Add demo content at the bottom of `lib/content.ts`, before the Footer export**

```typescript
// ── Demo Page ─────────────────────────────────────────────────────────────────
export const DEMO_PAGE = {
  hero: {
    eyebrow: "Live Demo",
    headline: "Your pub. Your voice. Zero admin.",
    subtext:
      "Watch the AI handle your toughest moments — complaints, bad reviews, missed bookings — exactly like you would.",
    pubName: "The Red Lion, Shoreditch",
    pubStatus: "AI Agent: Active",
  },
  cta: {
    headline: "Want this running in your pub by next week?",
    subtext: "Setup in 48 hours. No tech knowledge needed. Cancel any time.",
    buttonLabel: "Book a Free Call →",
    buttonHref: "/contact",
    proof: "Join pub owners across the UK who've taken back their evenings.",
  },
  valueProposition: "Only hear from us when it matters. Everything else is handled.",
} as const;

export type ScenarioSource = "EMAIL" | "GOOGLE" | "TRIPADVISOR";
export type ScenarioPriority = "HIGH" | "LOW";

export interface DemoScenario {
  id: string;
  source: ScenarioSource;
  priority: ScenarioPriority;
  sender: string;
  preview: string;
  fullText: string;
  timestamp: string;
  systemPrompt: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "slow-service",
    source: "TRIPADVISOR",
    priority: "HIGH",
    sender: "JamieL_London",
    preview: "Waited over an hour for food, no one apologised...",
    fullText:
      "Waited over an hour for food, no one came to apologise or explain what was happening. When it finally arrived it was lukewarm. Really disappointed as we'd heard good things. Won't be returning.",
    timestamp: "2 mins ago",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this TripAdvisor review on behalf of the pub manager. Be warm, genuinely apologetic, and invite them back. Acknowledge the specific wait time issue. Keep it to 3-4 sentences. Sound human, not corporate. Sign off as 'Sarah, The Red Lion'.",
  },
  {
    id: "lost-booking",
    source: "EMAIL",
    priority: "HIGH",
    sender: "margaret.davies@gmail.com",
    preview: "Booked a table for my mum's birthday, no record of it...",
    fullText:
      "Hi, I'm extremely upset. I booked a table for 6 for my mum's 70th birthday dinner last Saturday and when we arrived your staff had no record of it whatsoever. We stood at the door for 20 minutes before being turned away. Completely ruined the evening. I need an explanation and a resolution.",
    timestamp: "14 mins ago",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this angry customer email on behalf of the pub manager. Be sincerely apologetic for the booking mix-up — this ruined a special occasion. Offer to make it right (complimentary meal for the group). Keep it warm and personal, 4-5 sentences. Sign off as 'Sarah, The Red Lion'.",
  },
  {
    id: "allergen-complaint",
    source: "GOOGLE",
    priority: "HIGH",
    sender: "Priya S.",
    preview: "Staff were rude when we asked about allergens...",
    fullText:
      "Staff were rude and dismissive when we asked about allergens for my daughter who has a nut allergy. Felt like an inconvenience. We left without eating. This is a serious safety issue not just bad service.",
    timestamp: "1 hr ago",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this Google review about an allergen concern on behalf of the pub manager. This is serious — acknowledge it gravely, apologise unreservedly, explain that staff training will be reviewed immediately, and invite them to call directly before their next visit so allergen needs can be prepared in advance. 4-5 sentences. Sign off as 'Sarah, The Red Lion'.",
  },
  {
    id: "cold-food",
    source: "GOOGLE",
    priority: "HIGH",
    sender: "DaveT_Shoreditch",
    preview: "Cold food, Sunday roast was inedible...",
    fullText:
      "Cold food, clearly been sitting under a lamp. The Sunday roast was absolutely inedible — soggy Yorkshire pudding, lukewarm gravy, and the beef was tough as leather. £18 for that is frankly insulting. Our Sunday roast tradition is now ruined.",
    timestamp: "3 hrs ago",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this Google review about cold food on behalf of the pub manager. Apologise sincerely, acknowledge the specific issues mentioned (Yorkshire pudding, gravy, beef). Our Sunday roast is something we take real pride in and this clearly fell short. Offer a complimentary Sunday roast on their next visit. 3-4 sentences. Sign off as 'Sarah, The Red Lion'.",
  },
  {
    id: "no-reply",
    source: "EMAIL",
    priority: "HIGH",
    sender: "events@corpco.com",
    preview: "Left a voicemail 3 days ago about a function booking...",
    fullText:
      "Hi, I left a voicemail 3 days ago enquiring about booking your private dining room for our company Christmas party (approx 40 people, mid-December). I haven't heard back. Could someone please get in touch? We're happy to discuss catering options and a deposit. Starting to look at other venues.",
    timestamp: "Yesterday",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this email about a missed function enquiry on behalf of the pub manager. Apologise for the delayed response, confirm the private dining room is available for mid-December events for up to 45 guests, express genuine enthusiasm about hosting their Christmas party, and ask for their preferred date and a contact number to call within the hour. Keep it warm and urgent — they're about to go elsewhere. 4-5 sentences. Sign off as 'Sarah, The Red Lion'.",
  },
  {
    id: "positive-review",
    source: "TRIPADVISOR",
    priority: "LOW",
    sender: "FamilyDaysOut_UK",
    preview: "Best Sunday roast in the area, staff were brilliant...",
    fullText:
      "Best Sunday roast in the area, full stop. Staff were absolutely brilliant with our kids — gave them colouring sheets without even being asked. The beef was perfectly cooked and the portions were massive. We'll definitely be back next weekend. Hidden gem!",
    timestamp: "5 hrs ago",
    systemPrompt:
      "You are the AI agent for The Red Lion pub in Shoreditch, London. Respond to this lovely TripAdvisor review on behalf of the pub manager. Be warm and genuinely delighted. Mention the kids specifically — it means a lot that they had a great time too. We look forward to seeing them next Sunday. 3 sentences max. Sign off as 'Sarah, The Red Lion'.",
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add demo page content and scenarios to lib/content"
```

---

## Task 3: Create Claude API Route

**Files:**
- Create: `app/api/demo/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simple in-memory rate limit: 20 demo requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API not configured." },
      { status: 500 }
    );
  }

  let body: { systemPrompt: string; fullText: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { systemPrompt, fullText } = body;

  if (!systemPrompt || !fullText) {
    return NextResponse.json(
      { error: "systemPrompt and fullText are required." },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: "user", content: fullText }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "Failed to generate response." },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 2: Add ANTHROPIC_API_KEY to .env.local (if not already present)**

Check if it exists:
```bash
grep -l "ANTHROPIC_API_KEY" /Users/venky/zero-clicks/.env.local 2>/dev/null || echo "NOT FOUND"
```

If NOT FOUND, add it:
```bash
echo "ANTHROPIC_API_KEY=your_key_here" >> /Users/venky/zero-clicks/.env.local
```

Then replace `your_key_here` with the actual key from https://console.anthropic.com

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/demo/route.ts
git commit -m "feat: add claude api route for demo responses"
```

---

## Task 4: Update Navbar with Products Dropdown

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Replace the nav links array and add dropdown state in `components/Navbar.tsx`**

Replace the entire file content:

```typescript
// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCTS = [
  { label: "Inbox Autopilot", href: "/#services", description: "Email handled 24/7" },
  { label: "Reputation Manager", href: "/#services", description: "Reviews + complaints" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backgroundColor: scrolled ? "rgba(10,10,16,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "border-color 250ms ease, background-color 250ms ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          onClick={(e) => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <Image
            src="/logo.png"
            alt="Zero Clicks"
            width={36}
            height={36}
            unoptimized
            style={{ borderRadius: "8px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            {SITE.name}
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { label: "Services", href: "/#services" },
            { label: "How it works", href: "/#how-it-works" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </Link>
          ))}

          {/* Products dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setProductsOpen((o) => !o)}
              style={{
                fontSize: "13px",
                color: productsOpen ? "var(--text-primary)" : "var(--text-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: 0,
                transition: "color 200ms ease",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) => {
                if (!productsOpen)
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              Products
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{
                  transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                }}
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-mid)",
                    borderRadius: "10px",
                    padding: "8px",
                    minWidth: "200px",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                    zIndex: 100,
                  }}
                >
                  {PRODUCTS.map((product) => (
                    <Link
                      key={product.href + product.label}
                      href={product.href}
                      onClick={() => setProductsOpen(false)}
                      style={{
                        display: "block",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        transition: "background 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "var(--bg-hover)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "transparent")
                      }
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          margin: 0,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {product.label}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          margin: "2px 0 0",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {product.description}
                      </p>
                    </Link>
                  ))}

                  {/* Divider */}
                  <div
                    style={{
                      height: "1px",
                      background: "var(--border)",
                      margin: "6px 8px",
                    }}
                  />

                  {/* Live Demo featured item */}
                  <Link
                    href="/demo"
                    onClick={() => setProductsOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      background: "var(--accent-dim)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      transition: "background 150ms ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "rgba(59,130,246,0.12)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--accent-dim)")
                    }
                  >
                    <span style={{ fontSize: "14px" }}>🎬</span>
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--accent)",
                          margin: 0,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Live Demo
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          margin: "2px 0 0",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        See it working right now
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact"
            style={{
              fontSize: "13px",
              color: "var(--text-primary)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              padding: "7px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              transition: "border-color 200ms ease, background 200ms ease",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--accent)";
              el.style.background = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-mid)";
              el.style.background = "var(--bg-card)";
            }}
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add products dropdown to navbar with demo link"
```

---

## Task 5: Create DemoHero Component

**Files:**
- Create: `components/DemoHero.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/DemoHero.tsx
"use client";

import { motion } from "framer-motion";
import { DEMO_PAGE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoHero() {
  return (
    <section
      style={{
        padding: "140px 48px 80px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        style={{ maxWidth: "640px" }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "12px",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
          }}
        >
          {DEMO_PAGE.hero.eyebrow}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--text-primary)",
            margin: "0 0 16px",
            lineHeight: 1.1,
          }}
        >
          {DEMO_PAGE.hero.headline}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            margin: "0 0 32px",
          }}
        >
          {DEMO_PAGE.hero.subtext}
        </p>

        {/* Pub context bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-mid)",
            borderRadius: "8px",
            padding: "10px 16px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🍺</span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            {DEMO_PAGE.hero.pubName}
          </span>
          <span
            style={{
              width: "1px",
              height: "14px",
              background: "var(--border-mid)",
            }}
          />
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "#10b981",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {DEMO_PAGE.hero.pubStatus}
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/DemoHero.tsx
git commit -m "feat: add DemoHero component"
```

---

## Task 6: Create DemoScenarioCard Component

**Files:**
- Create: `components/DemoScenarioCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/DemoScenarioCard.tsx
"use client";

import { motion } from "framer-motion";
import { DemoScenario } from "@/lib/content";

const SOURCE_COLOURS: Record<string, string> = {
  EMAIL: "rgba(139,92,246,0.15)",
  GOOGLE: "rgba(234,179,8,0.12)",
  TRIPADVISOR: "rgba(16,185,129,0.12)",
};

const SOURCE_TEXT_COLOURS: Record<string, string> = {
  EMAIL: "#a78bfa",
  GOOGLE: "#fbbf24",
  TRIPADVISOR: "#34d399",
};

interface Props {
  scenario: DemoScenario;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export default function DemoScenarioCard({ scenario, isActive, onClick, index }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onClick={onClick}
      style={{
        width: "100%",
        background: isActive ? "var(--bg-hover)" : "var(--bg-card)",
        border: isActive
          ? "1px solid rgba(59,130,246,0.3)"
          : "1px solid var(--border)",
        borderRadius: "10px",
        padding: "16px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 200ms ease",
        outline: "none",
        borderLeft: isActive
          ? "3px solid var(--accent)"
          : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        {/* Source badge */}
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "3px 7px",
            borderRadius: "4px",
            background: SOURCE_COLOURS[scenario.source],
            color: SOURCE_TEXT_COLOURS[scenario.source],
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.source}
        </span>

        {/* Priority badge */}
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "3px 7px",
            borderRadius: "4px",
            background:
              scenario.priority === "HIGH"
                ? "rgba(239,68,68,0.1)"
                : "rgba(16,185,129,0.1)",
            color: scenario.priority === "HIGH" ? "#f87171" : "#34d399",
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.priority}
        </span>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          {scenario.timestamp}
        </span>
      </div>

      {/* Sender */}
      <p
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 4px",
          fontFamily: "var(--font-body)",
        }}
      >
        {scenario.sender}
      </p>

      {/* Preview */}
      <p
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          margin: 0,
          fontFamily: "var(--font-body)",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {scenario.preview}
      </p>
    </motion.button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/DemoScenarioCard.tsx
git commit -m "feat: add DemoScenarioCard component"
```

---

## Task 7: Create DemoProcessingPanel Component

**Files:**
- Create: `components/DemoProcessingPanel.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/DemoProcessingPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoScenario } from "@/lib/content";

type Stage =
  | "idle"
  | "reading"
  | "classifying"
  | "drafting"
  | "response"
  | "notifying";

interface Props {
  scenario: DemoScenario | null;
}

const STEPS = [
  { stage: "reading" as Stage, icon: "📥", label: (s: DemoScenario) => `Reading incoming signal from ${s.source}...` },
  { stage: "classifying" as Stage, icon: "🔍", label: (s: DemoScenario) => `Classifying: ${s.priority} priority — ${s.source.toLowerCase()} signal` },
  { stage: "drafting" as Stage, icon: "✍️", label: () => "Crafting response in The Red Lion's voice..." },
  { stage: "notifying" as Stage, icon: "📱", label: (s: DemoScenario) => s.priority === "HIGH" ? "WhatsApp alert sent to Sarah (owner)" : "Handled automatically. Logged to dashboard." },
];

export default function DemoProcessingPanel({ scenario }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Reset and re-run when scenario changes
  useEffect(() => {
    if (!scenario) return;

    setStage("reading");
    setAiResponse("");
    setDisplayedResponse("");
    setError("");
    setIsLoading(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStage("classifying"), 800));
    timers.push(
      setTimeout(() => {
        setStage("drafting");
        setIsLoading(true);

        fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemPrompt: scenario.systemPrompt,
            fullText: scenario.fullText,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            setIsLoading(false);
            if (data.error) {
              setError(data.error);
              return;
            }
            setAiResponse(data.response);
            setStage("response");
          })
          .catch(() => {
            setIsLoading(false);
            setError("Network error. Please try again.");
          });
      }, 1800)
    );

    return () => timers.forEach(clearTimeout);
  }, [scenario]);

  // Typewriter effect
  useEffect(() => {
    if (!aiResponse) return;
    setDisplayedResponse("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedResponse(aiResponse.slice(0, i));
      if (i >= aiResponse.length) {
        clearInterval(interval);
        setTimeout(() => setStage("notifying"), 400);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [aiResponse]);

  if (!scenario) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "440px",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "32px" }}>👈</div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Pick a scenario to watch the AI work
        </p>
      </div>
    );
  }

  const completedStages: Stage[] = ["reading", "classifying", "drafting", "response", "notifying"];
  const currentStageIndex = completedStages.indexOf(stage);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-mid)",
        borderRadius: "12px",
        padding: "32px",
        minHeight: "440px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(59,130,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          ⚡
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Claude AI — Red Lion Agent
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            {stage === "idle" ? "Ready" : "Processing..."}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
        {STEPS.map((step, i) => {
          const stageOrder: Stage[] = ["reading", "classifying", "drafting", "notifying"];
          const stepIndex = stageOrder.indexOf(step.stage);
          const isPast = currentStageIndex > stepIndex;
          const isActive =
            stage === step.stage ||
            (step.stage === "drafting" && stage === "response");

          if (!isPast && !isActive && currentStageIndex < stepIndex) return null;

          return (
            <motion.div
              key={step.stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                paddingLeft: isActive ? "4px" : "0",
                borderLeft: isActive
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                transition: "padding-left 300ms ease, border-color 300ms ease",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>
                {isPast ? "✅" : step.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: isActive
                    ? "var(--text-primary)"
                    : isPast
                    ? "var(--text-secondary)"
                    : "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {step.label(scenario)}
              </span>
            </motion.div>
          );
        })}

        {/* Loading spinner during API call */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "6px" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid var(--border-mid)",
                  borderTopColor: "var(--accent)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Generating response...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "#f87171",
                  margin: 0,
                }}
              >
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Response */}
        <AnimatePresence>
          {(stage === "response" || stage === "notifying") && displayedResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "20px",
                borderRadius: "8px",
                background: "var(--accent-dim)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    background: "rgba(59,130,246,0.12)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(59,130,246,0.2)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  AI Draft
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  margin: "0 0 16px",
                  fontStyle: "italic",
                }}
              >
                {displayedResponse}
                {displayedResponse.length < aiResponse.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 14,
                      background: "var(--accent)",
                      marginLeft: 2,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </p>

              {/* Action buttons */}
              <AnimatePresence>
                {stage === "notifying" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: "6px",
                        background: "var(--accent)",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "opacity 150ms ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "0.85")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "1")
                      }
                    >
                      ✉️ Send Response
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        borderRadius: "6px",
                        background: "transparent",
                        border: "1px solid var(--border-mid)",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "border-color 150ms ease, color 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--accent)";
                        el.style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--border-mid)";
                        el.style.color = "var(--text-secondary)";
                      }}
                    >
                      ✏️ Edit First
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp notification for HIGH priority */}
        <AnimatePresence>
          {stage === "notifying" && scenario.priority === "HIGH" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "rgba(37,211,102,0.06)",
                border: "1px solid rgba(37,211,102,0.2)",
              }}
            >
              <span style={{ fontSize: "16px" }}>📱</span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "#4ade80",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong>WhatsApp alert sent to Sarah</strong>
                <br />
                "Hi Sarah — urgent {scenario.source.toLowerCase()} just in. I've drafted a response. Tap to review."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/DemoProcessingPanel.tsx
git commit -m "feat: add DemoProcessingPanel with typewriter AI response"
```

---

## Task 8: Create DemoCommandCentre Component

**Files:**
- Create: `components/DemoCommandCentre.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/DemoCommandCentre.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEMO_SCENARIOS, DEMO_PAGE, DemoScenario } from "@/lib/content";
import DemoScenarioCard from "./DemoScenarioCard";
import DemoProcessingPanel from "./DemoProcessingPanel";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoCommandCentre() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  return (
    <section
      style={{
        padding: "0 48px 80px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Value prop banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          style={{
            textAlign: "center",
            padding: "40px 0 48px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              color: "var(--text-secondary)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            "{DEMO_PAGE.valueProposition}"
          </p>
        </motion.div>

        {/* Split panel */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12"
          style={{ gap: "24px", alignItems: "start" }}
        >
          {/* Left — Scenario cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="lg:col-span-5"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                margin: "0 0 8px",
              }}
            >
              Incoming Signals — 6 unread
            </p>
            {DEMO_SCENARIOS.map((scenario, i) => (
              <DemoScenarioCard
                key={scenario.id}
                scenario={scenario}
                isActive={activeScenario?.id === scenario.id}
                onClick={() => setActiveScenario(scenario)}
                index={i}
              />
            ))}
          </motion.div>

          {/* Right — Processing panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                margin: "0 0 8px",
              }}
            >
              AI Agent — Live Processing
            </p>
            <DemoProcessingPanel scenario={activeScenario} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/DemoCommandCentre.tsx
git commit -m "feat: add DemoCommandCentre split-panel component"
```

---

## Task 9: Create DemoCTA Component

**Files:**
- Create: `components/DemoCTA.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/DemoCTA.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DEMO_PAGE } from "@/lib/content";

const ease = [0.25, 0.1, 0.25, 1.0] as const;

export default function DemoCTA() {
  return (
    <section
      style={{
        padding: "80px 48px 120px",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "var(--text-primary)",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            {DEMO_PAGE.cta.headline}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: "0 0 32px",
            }}
          >
            {DEMO_PAGE.cta.subtext}
          </p>

          <Link
            href={DEMO_PAGE.cta.buttonHref}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: "8px",
              background: "var(--accent)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "0.88";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }}
          >
            {DEMO_PAGE.cta.buttonLabel}
          </Link>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: "20px 0 0",
            }}
          >
            {DEMO_PAGE.cta.proof}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/DemoCTA.tsx
git commit -m "feat: add DemoCTA component"
```

---

## Task 10: Create Demo Page

**Files:**
- Create: `app/demo/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// app/demo/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import DemoHero from "@/components/DemoHero";
import DemoCommandCentre from "@/components/DemoCommandCentre";
import DemoCTA from "@/components/DemoCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — Zero Clicks",
  description:
    "Watch the AI handle real pub complaints, bad reviews, and missed bookings — exactly like a human would. The Red Lion, Shoreditch.",
};

export default function DemoPage() {
  return (
    <main>
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <DemoHero />
      <DemoCommandCentre />
      <DemoCTA />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server and verify the page loads**

```bash
cd /Users/venky/zero-clicks && npm run dev
```

Open http://localhost:3000/demo — expect to see:
- Hero with "Your pub. Your voice. Zero admin."
- The Red Lion context bar with green pulsing dot
- 6 scenario cards on the left
- Empty processing panel on the right ("Pick a scenario")
- Products dropdown in navbar
- CTA at the bottom

- [ ] **Step 4: Click each scenario card and verify**

- Card highlights with blue left border
- Processing panel animates through steps
- AI response types out
- HIGH priority scenarios show WhatsApp notification block
- LOW priority scenario (positive review) does NOT show WhatsApp block

- [ ] **Step 5: Commit**

```bash
git add app/demo/page.tsx
git commit -m "feat: add /demo page — hospitality AI command centre"
```

---

## Task 11: Final Polish & Deploy

**Files:**
- Modify: `app/demo/page.tsx` (if any mobile fixes needed)

- [ ] **Step 1: Check mobile layout at 375px width**

In Chrome DevTools, set viewport to 375px.
Verify:
- Scenario cards stack vertically ✓ (grid-cols-1 handles this)
- Processing panel appears below cards ✓
- No horizontal overflow

- [ ] **Step 2: Verify navbar Products dropdown on mobile**

At 375px, the nav may overflow. Check and confirm the layout is usable.

- [ ] **Step 3: Final TypeScript check**

```bash
cd /Users/venky/zero-clicks && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Build check**

```bash
cd /Users/venky/zero-clicks && npm run build
```

Expected: successful build, no errors

- [ ] **Step 5: Deploy**

```bash
cd /Users/venky/zero-clicks && git add -A && git commit -m "feat: hospitality AI demo page complete" && git push origin main
```

Expected: Vercel deployment triggered automatically
