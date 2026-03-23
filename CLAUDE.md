# Zero Clicks — Project Brain

## What This Project Is
Zero Clicks is an AI automation agency website for UK hospitality/SME market.
Built by Venky. Sells n8n + Claude AI automation workflows to pub/restaurant owners.

## Stack
- Next.js 14 App Router (TypeScript strict)
- Tailwind CSS + custom CSS variables (no shadcn)
- Framer Motion for animations
- Deployed on Vercel (free Hobby tier)
- Live at: https://zeroclicks.vercel.app

## Commands
```
npm run dev      # start dev server (port 3000)
npm run build    # production build
npm run lint     # eslint check
git push origin main  # auto-deploys to Vercel
```

## File Structure
```
app/             → Next.js pages (page.tsx, layout.tsx, contact/)
components/      → All UI components
lib/content.ts   → ALL copy/text lives here — edit here first
styles/globals.css → CSS variables and keyframes
public/          → Static assets (logo.png, etc.)
```

## Design System (ALWAYS follow this)
- Background: #020817 (near-black)
- Accent: #3b82f6 (blue)
- Text primary: rgba(255,255,255,0.92)
- Text muted: rgba(255,255,255,0.45)
- Glass effect: backdropFilter blur(20px) saturate(160%)
- Border: rgba(255,255,255,0.06)
- Dark mode ONLY — never light mode
- Animations via Framer Motion useInView with once:true

## Conventions
- TypeScript strict — NO `any` types
- All content/copy goes in lib/content.ts first
- Framer Motion for all scroll animations
- CSS variables via var(--token) not hardcoded colours
- next/image for ALL images (use unoptimized for static files)
- No shadcn — custom components only

## Business Context
- Target client: UK pub/restaurant/hospitality owner
- Main product: Inbox Autopilot (email automation, £499 + £49/mo)
- Lead gen: LinkedIn content → free 30-min call → paid project
- Calendly: https://calendly.com/zeroclicks (replace with real link)
- Contact form uses Web3Forms (free, 250/mo)

## Pending
- [ ] Replace placeholder testimonials with real client quotes
- [ ] Set up real Calendly link
- [ ] Wire Web3Forms access key into contact form
- [ ] Build demo environment ("The Red Lion" fake pub)
- [ ] Record 3-min demo video
- [ ] Add second case study
