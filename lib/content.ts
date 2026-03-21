// lib/content.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all site copy.
// Edit text here only — components pull from these exports.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Zero Clicks",
  tagline: "We automate the boring stuff so you can focus on what matters.",
  email: "zeroclicks.hq@gmail.com",
  instagram: "https://instagram.com/zeroclicks",
  linkedin: "https://linkedin.com/in/venkatesh-surampudi-b51323379",
  founder: {
    name: "Venky",
    fullName: "Venkatesh Surampudi",
  },
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────────
export const HERO = {
  headlineTop: "Stop doing it manually.",
  headlineBottom: "Let the machines handle it.",
  subtext:
    "Zero Clicks builds custom AI automation workflows for UK businesses — saving hours every week and removing the admin that slows you down.",
  ctaPrimary: {
    label: "See how it works",
    href: "#services",
  },
  ctaSecondary: {
    label: "Talk to Venky",
    href: "mailto:zeroclicks.hq@gmail.com",
  },
} as const;

// ── Proof bar ─────────────────────────────────────────────────────────────────
// Items repeat automatically in the marquee — no need to duplicate.
export const PROOF_BAR_ITEMS: string[] = [
  "Used by operations teams in London",
  "Built on n8n",
  "Deployed in days, not months",
  "Saves 10+ hours per week",
  "Custom-built for your stack",
  "UK-based, always available",
];

// ── Services ──────────────────────────────────────────────────────────────────
// Add / remove objects here to change service cards. Icon is an SVG path string.
export interface Service {
  icon: string; // SVG viewBox="0 0 24 24" path data
  title: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Email Automation",
    description:
      "Auto-route, reply, and categorise inbound emails. Never miss a lead or a deadline again.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Lead & CRM Workflows",
    description:
      "Capture leads from any source, enrich them, and push them straight into your CRM — zero manual entry.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Custom AI Pipelines",
    description:
      "End-to-end intelligent workflows — document processing, AI classification, Slack alerts, and more.",
  },
];

// ── How it works ──────────────────────────────────────────────────────────────
export interface Step {
  number: string;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Audit",
    description:
      "We map your current manual processes in a 30-minute call. No slides, no fluff — just clarity on where your time is going.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We design and build the automation in n8n, connected to your existing tools. You see progress daily.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Go live, usually within a week. We hand over full documentation and stay on for 30 days of support.",
  },
];

// ── About ─────────────────────────────────────────────────────────────────────
export const ABOUT = {
  heading: "Built by someone who's worked in operations, not just consulted on it.",
  body: "Venky spent years running back-of-house at Greene King Mayfair — kitchens don't run on spreadsheets and good intentions. Now he builds the automations he wishes existed then: fast, practical, and built for businesses that are too busy to be slow.",
  label: "Founder, Zero Clicks",
} as const;

// ── CTA section ───────────────────────────────────────────────────────────────
export const CTA_SECTION = {
  heading: "Ready to cut the admin?",
  subtext: "Most workflows are live within a week.",
  buttonLabel: "Get in touch",
  buttonHref: "mailto:zeroclicks.hq@gmail.com",
} as const;

// ── Contact page ──────────────────────────────────────────────────────────────
export const CONTACT_PAGE = {
  heading: "Let's talk.",
  subtext:
    "Tell us what's slowing you down. We'll come back within one business day with a clear plan.",
  successHeading: "Message received.",
  successBody:
    "We'll be in touch within one business day. In the meantime, feel free to connect on LinkedIn.",
} as const;

// ── Footer ────────────────────────────────────────────────────────────────────
export const FOOTER = {
  copyright: `© ${new Date().getFullYear()} Zero Clicks. All rights reserved.`,
} as const;
