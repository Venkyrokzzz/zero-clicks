// app/layout.tsx
// Root layout — fonts loaded via next/font (never via CDN link).
// Analytics: drop scripts in the commented block below.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import TechnicalBackground from "../components/TechnicalBackground";
import SciFiNav from "../components/SciFiNav";

const interBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zero Clicks — AI Automation for UK Businesses",
    template: "%s | Zero Clicks",
  },
  description:
    "Zero Clicks builds custom n8n + Claude AI automation workflows for UK hospitality businesses and SMEs. Automate your inbox, bookings, and ops in days.",
  keywords: ["AI automation", "n8n", "workflow automation", "UK hospitality", "pub automation", "email automation", "Claude AI", "business automation"],
  openGraph: {
    title: "Zero Clicks — AI Automation for UK Businesses",
    description: "Custom n8n + Claude AI workflows for UK hospitality and SMEs. Inbox automated, ops running 24/7.",
    url: "https://zeroclicks.dev",
    siteName: "Zero Clicks",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero Clicks",
    description: "We automate the boring stuff so you can focus on what matters.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interBody.variable} ${interDisplay.variable}`}>
      <head>
        {/* Critical inline CSS — guarantees dark theme before any stylesheet loads */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #000000;
            --bg-surface: #0A0A0A;
            --bg-card: #121212;
            --bg-hover: #1E1E1E;
            --text-primary: #FFFFFF;
            --text-secondary: #A1A1AA;
            --text-muted: #71717A;
            --accent: #FF6363;
            --accent-dim: rgba(255,99,99,0.1);
            --accent-glow: rgba(255,99,99,0.25);
            --border: rgba(255,255,255,0.08);
            --border-mid: rgba(255,255,255,0.12);
            --border-strong: rgba(255,255,255,0.2);
            --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
          }
          html, body {
            background-color: #09090b !important;
            color: #FFFFFF !important;
            margin: 0;
            -webkit-font-smoothing: antialiased;
          }
        `}} />
        {/*
         * ── Analytics placeholder ─────────────────────────────────────
         * Uncomment to enable:
         *
         * Google Analytics (GA4):
         * <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
         *
         * Plausible:
         * <script defer data-domain="zeroclicks.co.uk" src="https://plausible.io/js/script.js" />
         * ──────────────────────────────────────────────────────────────
         */}
      </head>
      <body style={{ backgroundColor: '#09090b', color: '#FFFFFF', margin: 0 }}>
        <TechnicalBackground />
        <SciFiNav />
        {children}
      </body>
    </html>
  );
}
