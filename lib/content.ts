// lib/content.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all site copy.
// Edit text here only — components pull from these exports.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Zero Clicks",
  tagline: "Less screen. More floor.",
  email: "zeroclicks.hq@gmail.com",
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
  headlineTop: "Front of house,",
  headlineBottom: "not behind a screen.",
  subtext:
    "One less thing to open your laptop for — every single day. Zero Clicks handles your Google reviews and inbox so UK pub owners stay on the floor, not on the computer.",
  ctaPrimary: {
    label: "Book a free 15-min call",
    href: "/contact",
  },
  ctaSecondary: {
    label: "See it in action",
    href: "/demo",
  },
} as const;

// ── Proof bar ─────────────────────────────────────────────────────────────────
// Items repeat automatically in the marquee — no need to duplicate.
export const PROOF_BAR_ITEMS: string[] = [
  "26 of 30 London pubs have unanswered reviews",
  "1-star improvement = up to 9% more revenue",
  "Average reply time: under 30 seconds",
  "Works for pubs, restaurants and hotels",
  "Replies in your voice — not a template",
  "1-2 star reviews flagged to you instantly",
  "Live in 48 hours",
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
    title: "Inbox Autopilot",
    description:
      "AI reads every email, classifies it, and drafts a reply in your voice. You get pinged only for the urgent ones — check twice a day instead of all day.",
  },
  {
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    title: "Reputation Manager",
    description:
      "Monitors Google, TripAdvisor, and email for reviews and complaints. Drafts a response instantly in your tone. You approve in one tap — or let it run fully automated.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Lead Capture & Routing",
    description:
      "Enquiry comes in from any source — website, email, form. AI enriches it, scores it, and pushes it into your CRM with a follow-up drafted. Zero leads dropped.",
  },
];

export const SERVICES_ALSO: string[] = [
  "Ops Alerts",
  "Document Processing",
  "Scheduled Reporting",
  "Booking Confirmations",
  "Supplier Chase Automation",
  "Staff Onboarding Flows",
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
    description: "We map your current manual processes in a 15-minute call. No slides, no fluff — just clarity on where your time is going.",
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
export interface ValueStackItem {
  item: string;
  value: string;
}

export interface Package {
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string; // crossed-out value stack total
  timeline: string;
  description: string;
  features: string[];
  valueStack?: ValueStackItem[]; // Hormozi value stacking
  guarantee?: string;
  scarcity?: string;
  badge?: string;
  highlight: boolean;
  cta: string;
  ctaHref: string;
}

export const PACKAGES: Package[] = [
  {
    name: "Founding Member",
    tagline: "Lock in this price forever. First 10 clients only.",
    price: "£35",
    originalPrice: "£55",
    timeline: "per month · no setup fee · price locked for life",
    description: "Everything in Standard at a permanently reduced rate — your reward for being an early client.",
    features: [
      "Everything in Standard — nothing removed",
      "£499 setup fee waived completely",
      "£35/mo locked in — never increases",
      "30-day free trial included",
      "Direct access to Venky for onboarding",
    ],
    scarcity: "7 of 10 spots remaining",
    badge: "EARLY BIRD",
    highlight: false,
    cta: "Claim your spot →",
    ctaHref: "/contact",
  },
  {
    name: "Standard",
    tagline: "30-day free trial. No card needed.",
    price: "£55",
    timeline: "per month · £499 one-time setup",
    description: "AI-powered review replies in your pub's voice. Perfect for independent owners who want their time back.",
    features: [
      "AI trained in your voice — not a template",
      "All Google reviews covered, unlimited",
      "Dashboard — approve replies in one tap",
      "Negative review alerts",
      "30-day free trial included",
    ],
    highlight: false,
    cta: "Start free trial",
    ctaHref: "/sign-up",
  },
  {
    name: "Pro",
    tagline: "Everything in Standard, done for you.",
    price: "£75",
    timeline: "per month · £499 one-time setup",
    description: "A fully managed service — your voice, your rules, replies go live automatically. Zero manual work from you.",
    features: [
      "Everything in Standard",
      "Auto-send positive replies (4-5 stars)",
      "Priority flagging for 1-2 star reviews",
      "Onboarding call + voice setup included",
      "Monthly review insights report",
      "Priority support",
    ],
    scarcity: "5 onboarding spots left this month",
    badge: "MOST POPULAR",
    highlight: true,
    cta: "Get started — £499 + £75/mo",
    ctaHref: "/contact",
  },
];

export const PRICING_ADDONS = [
  { name: "WhatsApp Alerts", price: "+£99", desc: "Instant WhatsApp notifications for urgent items" },
  { name: "Sheets Dashboard", price: "+£99", desc: "Auto-logging to a live Google Sheets ops dashboard" },
  { name: "Multi-Venue", price: "+£199/venue", desc: "Same workflows replicated across additional sites" },
];

// ── CTA section ───────────────────────────────────────────────────────────────
export const CTA_SECTION = {
  heading: "Ready to cut the admin?",
  subtext: "Book a free 15-minute discovery call. No hard sell — just a clear plan for what we'd automate first and what it'd cost.",
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

const FEW_SHOT_DATASET = `
You NEVER use corporate PR language (like 'top priority' or 'unacceptable'). You NEVER ask customers to call the phone number. 
Here is a dataset of exactly how you speak. Mimic this style perfectly:

[Example 1 - Slow Service / Food Quality]
Customer: 'Waited 45 mins for a pint, staff ignored us.'
Sarah: 'Hi John. Sorry about the wait, that's not how we run things here. I'm having a word with the bar staff today to figure out what went wrong. I hope you'll give us another chance to show you our normal standard of service. – Sarah'

[Example 2 - Serious Complaint / Allergen Safety]
Customer: 'Staff were rude when I mentioned my nut allergy. Felt very unsafe.'
Sarah: 'Hi Priya. This is completely unacceptable. We take allergies very seriously and you should never have been treated like an inconvenience. I am pulling the staff in for strict retraining on allergen protocols today to ensure this never happens again. We hope you visit us again so we can ensure you receive the proper experience. – Sarah'

[Example 3 - Positive Review]
Customer: 'Best pints in Shoreditch!'
Sarah: 'Hi Mark. Thanks for the review! See you for the next one. – Sarah'

Now, write a response to the following review in that exact same style. Keep it to a maximum of 3 sentences. Do not deviate.
`;

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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this TripAdvisor review. " + FEW_SHOT_DATASET,
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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this angry email about a ruined 70th birthday. " + FEW_SHOT_DATASET,
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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this Google review about allergen safety. " + FEW_SHOT_DATASET,
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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this Google review about a cold Sunday roast. " + FEW_SHOT_DATASET,
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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this email about a missed function enquiry voicemail. " + FEW_SHOT_DATASET,
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
      "You are Sarah, the owner of The Red Lion pub in Shoreditch. Respond to this positive review about a great family Sunday roast. " + FEW_SHOT_DATASET,
  },
];

// ── Footer ────────────────────────────────────────────────────────────────────
export const FOOTER = {
  copyright: `© 2026 Zero Clicks.`,
} as const;
