// lib/content.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all site copy.
// Edit text here only — components pull from these exports.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Zero Clicks",
  tagline: "We automate the boring stuff so you can focus on what matters.",
  email: "hello@zeroclicks.dev",
  github: "https://github.com/venkatesh-surampudi",
  linkedin: "https://linkedin.com/in/venkatesh-surampudi-b51323379",
  twitter: "https://x.com/venkatesh_n8n",
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
    "Zero Clicks builds custom AI automation workflows for UK hospitality and SMEs — your inbox answered, bookings handled, ops running 24/7. Set up in days, not months.",
  ctaPrimary: {
    label: "Book a free 30-min call",
    href: "/contact",
  },
  ctaSecondary: {
    label: "See how it works",
    href: "#services",
  },
} as const;

// ── Proof bar ─────────────────────────────────────────────────────────────────
// Items repeat automatically in the marquee — no need to duplicate.
export const PROOF_BAR_ITEMS: string[] = [
  "Built for UK hospitality businesses",
  "Built on n8n — open source, no lock-in",
  "Deployed in days, not months",
  "Automations run 24/7",
  "Custom-built for your stack",
  "UK-based, always available",
  "OAuth2 secured — no stored passwords",
  "Claude AI — Haiku for speed, Sonnet for quality",
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
  details: string[];
}

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Audit",
    description: "We map your current manual processes in a 30-minute call. No slides, no fluff — just clarity on where your time is going.",
    details: ["Map every repetitive task", "Identify integration points", "Estimate time saved per week", "Recommend tool stack"],
  },
  {
    number: "02",
    title: "Build",
    description: "We design and build the automation in n8n, connected to your existing tools. You see progress daily.",
    details: ["n8n workflow design", "Claude AI integration", "Security: OAuth2 + encrypted creds", "Testing on real data"],
  },
  {
    number: "03",
    title: "Deploy",
    description: "Go live, usually within a week. We hand over full documentation and stay on for 30 days of support.",
    details: ["Self-hosted or cloud", "Monitoring & error alerts", "Dead letter queue setup", "Handover + documentation"],
  },
];

// ── About ─────────────────────────────────────────────────────────────────────
export const ABOUT = {
  heading: "Built by someone who's worked inside the businesses he now automates.",
  body: "Venky spent nearly two years in hospitality operations at Greene King — close enough to the chaos to understand exactly where time gets lost. The inbox that never clears. The bookings logged by hand. The supplier chase that eats your morning. He saw the gaps that off-the-shelf software doesn't touch.\n\nWhen he left, he didn't go looking for a course. He picked up n8n and Claude AI, broke things, fixed them, and built workflows that actually hold up under real operating conditions. Zero Clicks is the result — practical automation from someone who knows what a busy shift actually looks like.",
  label: "Founder, Zero Clicks",
} as const;

// ── Featured project ──────────────────────────────────────────────────────────
export const FEATURED_PROJECT = {
  label: "CASE STUDY — HOSPITALITY",
  title: "Gmail AI Assistant for Pub Owners",
  description:
    "One workflow handles the entire inbox — classify, alert, draft, log. Built with n8n + Claude Haiku + Sonnet. Deployed in under 5 minutes.",
  story: {
    problem: "A pub owner was spending 90 minutes every morning manually reading, sorting, and replying to emails — supplier quotes, booking requests, complaints, and spam all mixed together. Evenings were the same. No system. No triage. Just an overflowing inbox.",
    solution: "We built a single n8n workflow triggered by every new Gmail. Claude Haiku classifies it in under a second. Priority emails ping Telegram instantly. Action items get an AI-drafted reply in their tone. Everything gets logged to Sheets.",
    result: "From day one: inbox time dropped from 90 minutes to under 15. Running cost is £8/month. Zero emails missed. The owner now checks Telegram for alerts instead of refreshing their inbox.",
  },
  stats: [
    { val: "45 min", label: "Time saved/day" },
    { val: "£8/mo", label: "Running cost" },
    { val: "100%", label: "Self-hosted" },
    { val: "OAuth2", label: "Secured" },
  ],
  tech: ["n8n", "Claude Haiku", "Claude Sonnet", "Gmail", "Telegram", "Google Sheets"],
  outcome: "From 90 minutes of daily inbox triage to under 15.",
} as const;

// ── Packages ──────────────────────────────────────────────────────────────────
export interface Package {
  name: string;
  price: string;
  timeline: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
}

export const PACKAGES: Package[] = [
  {
    name: "Starter",
    price: "£499",
    timeline: "Delivered in 3 days",
    description: "One focused automation to solve your biggest bottleneck.",
    features: [
      "Single workflow build",
      "Gmail, Slack, Sheets or CRM",
      "30-day support included",
      "Full documentation",
    ],
    highlight: false,
    cta: "Book a call",
  },
  {
    name: "Pro",
    price: "£1,200",
    timeline: "Delivered in 7 days",
    description: "Full operations workflow — email, leads, alerts, and logging.",
    features: [
      "Up to 3 connected workflows",
      "AI classification + drafting",
      "Telegram / Slack alerts",
      "Google Sheets logging",
      "60-day support included",
      "Video walkthrough",
    ],
    highlight: true,
    cta: "Book a call — most popular",
  },
  {
    name: "Monthly",
    price: "£350/mo",
    timeline: "Ongoing partnership",
    description: "Automation on retainer — build, maintain, and improve every month.",
    features: [
      "2 new or updated workflows/month",
      "Priority support",
      "Monthly performance review",
      "Unlimited small fixes",
    ],
    highlight: false,
    cta: "Let's talk",
  },
];

// ── CTA section ───────────────────────────────────────────────────────────────
export const CTA_SECTION = {
  heading: "Ready to cut the admin?",
  subtext: "Book a free 30-minute discovery call. No hard sell — just a clear plan for what we'd automate first and what it'd cost.",
  buttonLabel: "Book a free call",
  buttonHref: "/contact",
  secondaryLabel: "Or email us",
  secondaryHref: "mailto:zeroclicks.hq@gmail.com",
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

// ── ROI Calculator ────────────────────────────────────────────────────────────
export const ROI_CALCULATOR = {
  headline: "See the Savings:",
  accentHeadline: "Your Automation ROI",
  subtext: "Calculate how shifting from manual workflows to Zero Clicks' Inbox Autopilot transforms your bottom line. Automation isn't just about speed—it's about reclaiming your time.",
  cta: "Book Your 30-Min ROI Audit",
  hoursLabel: "Weekly Admin Hours",
  rateLabel: "Hourly Staff Rate",
  savingsLabel: "Annual Savings",
  reclaimedLabel: "Time Reclaimed",
} as const;

// ── Red Lion Demo ─────────────────────────────────────────────────────────────
export const RED_LION_DEMO = {
  title: "The Red Lion: Inbox Autopilot in Action",
  subtext: "See how custom AI handles a complex booking request for a typical UK pub. From initial enquiry to calendar confirmation in seconds.",
  steps: [
    { text: "Checking 'Sunday Service' availability...", status: "complete" },
    { text: "Analyzing guest history (Dave Smith is a regular)...", status: "complete" },
    { text: "Drafting personalized response in 'The Red Lion' tone...", status: "active" },
    { text: "Updating TableRes booking calendar...", status: "pending" },
  ],
} as const;

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

// ── Footer ────────────────────────────────────────────────────────────────────
export const FOOTER = {
  copyright: `© 2026 Zero Clicks.`,
} as const;
