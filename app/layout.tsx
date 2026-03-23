// app/layout.tsx
// Root layout — fonts loaded via next/font (never via CDN link).
// Analytics: drop scripts in the commented block below.

import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "../styles/globals.css";
import CursorGlow from "../components/CursorGlow";
import ScrollProgress from "../components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
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
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
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
      <body>
        <ScrollProgress />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
