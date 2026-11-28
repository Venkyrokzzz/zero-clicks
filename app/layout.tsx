// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
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
    default: "Zero Clicks — Reputation Manager",
    template: "%s | Zero Clicks",
  },
  description:
    "Automatically reply to routine Google reviews for UK pubs and restaurants. Flagged and sensitive reviews stay private for your approval.",
  keywords: [
    "AI automation UK hospitality",
    "pub review automation",
    "Reputation Manager",
    "Google review replies UK",
    "Google review management",
    "hospitality AI tools",
    "pub management software",
  ],
  alternates: { canonical: BASE },
  openGraph: {
    title: "Zero Clicks — Reputation Manager",
    description: "Google review replies, drafted for your venue. Read, refine and approve. Get back to your guests.",
    url: BASE,
    siteName: "Zero Clicks",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Zero Clicks — Reputation Manager" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero Clicks — Reputation Manager",
    description: "Google review replies for UK hospitality, with owner approval before publication.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: { icon: { url: "/zero-clicks-mark.svg", type: "image/svg+xml" }, apple: "/zero-clicks-apple.png" },
};

const ANTI_FLASH = `(function(){try{var s=localStorage.getItem('zc-theme');document.documentElement.setAttribute('data-theme',s==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en-GB" suppressHydrationWarning className={`${interBody.variable} ${interDisplay.variable}`}>
        <head>
          {/* Anti-flash: always dark unless user explicitly chose light */}
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH }} />
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
    </ClerkProvider>
  );
}
