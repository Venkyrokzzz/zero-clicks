// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import { ThemeProvider } from "../components/ThemeProvider";
import JsonLd from "../components/JsonLd";

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

const BASE = "https://www.0-clicks.uk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Zero Clicks — AI Automation for UK Pubs & Restaurants",
    template: "%s | Zero Clicks",
  },
  description:
    "Zero Clicks automates the daily grind for UK pubs, restaurants and hotels — reviews replied to in under 4 minutes, inbox handled, nothing dropped. Live in 48 hours.",
  keywords: [
    "AI automation UK hospitality",
    "pub review automation",
    "restaurant email automation",
    "Google review replies UK",
    "n8n automation agency UK",
    "hospitality AI tools",
    "pub management software",
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: "Zero Clicks — AI Automation for UK Pubs & Restaurants",
    description: "Reviews replied to in under 4 minutes. Inbox handled. Google presence kept fresh — all automated. UK hospitality only. Live in 48 hrs.",
    url: BASE,
    siteName: "Zero Clicks",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Zero Clicks — AI Automation for UK Hospitality" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero Clicks — AI Automation for UK Pubs & Restaurants",
    description: "Reviews replied to in under 4 minutes. Inbox handled. Nothing dropped. UK hospitality only.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning className={`${interBody.variable} ${interDisplay.variable}`}>
      <head>
        {/* Anti-flash: always dark unless user explicitly chose light */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=localStorage.getItem('zc-theme');document.documentElement.setAttribute('data-theme',s==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();` }} />
        <JsonLd />
      </head>
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          <NavbarWrapper />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
