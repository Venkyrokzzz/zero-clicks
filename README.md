# Zero Clicks — Marketing Website

> AI Automation Consultancy | Built with Next.js 14, Tailwind CSS, TypeScript, Framer Motion

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your Formspree ID
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Set the following environment variable in Vercel dashboard:
   - `FORMSPREE_ID` → your Formspree form ID (get one free at formspree.io)
4. Deploy — done.

---

## How to Edit Copy

All text on the site lives in **one file only**:

```
lib/content.ts
```

Change any headline, subtext, CTA label, or description there — the site picks it up automatically. You never need to touch individual component files for copy changes.

### Adding a new service card

In `lib/content.ts`, add an object to the `SERVICES` array:

```ts
{
  icon: "your SVG path data here (viewBox 0 0 24 24)",
  title: "Service Name",
  description: "Two-line description of what this does.",
},
```

That's it. The grid updates automatically.

---

## How to Change Colours

All colour tokens are in `styles/globals.css` under `:root`:

```css
--color-bg:      #0a0a0a;   /* page background */
--color-surface: #111111;   /* card backgrounds */
--color-border:  #1e1e1e;   /* dividers */
--color-text:    #f0efe9;   /* body text */
--color-muted:   #888880;   /* secondary text */
--color-accent:  #e8b84b;   /* amber accent — change this to retheme */
```

Update these variables and the whole site recolours instantly.

---

## Project Structure

```
zero-clicks/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Homepage
│   ├── contact/page.tsx    # Contact page
│   └── api/contact/route.ts # Server-side Formspree proxy
├── components/             # One file per component
├── lib/
│   ├── content.ts          # ALL site copy — edit here only
│   └── rateLimit.ts        # In-memory rate limiter (5/IP/hour)
├── styles/globals.css      # CSS tokens + base styles
├── .env.example            # Env var template
└── vercel.json             # Vercel security headers
```

---

## Formspree Setup

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — copy the form ID (looks like `xyzabcde`)
3. Add `FORMSPREE_ID=xyzabcde` to your `.env.local`
4. On Vercel, add `FORMSPREE_ID` as an environment variable

The contact form routes through `/api/contact` server-side — your Formspree ID is never in the browser bundle.
