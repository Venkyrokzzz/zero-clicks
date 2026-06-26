import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing — AI Automation for UK Pubs & Restaurants | Zero Clicks",
  description:
    "Founding offer for UK pubs & restaurants: we build your AI review system free and you pay nothing until it's live. From £35/mo. No contracts.",
  alternates: { canonical: "https://www.0-clicks.uk/pricing" },
  openGraph: {
    title: "Pricing — Zero Clicks",
    description: "AI inbox & review automation for UK hospitality. From £35/mo.",
    url: "https://www.0-clicks.uk/pricing",
  },
};

export default function PricingPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 0" }}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Simple pricing for UK hospitality
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginBottom: "0",
              lineHeight: 1.6,
            }}
          >
            For our first 10 pubs: we build your whole system free, and you pay nothing until it&apos;s live and replying to real reviews. No contracts — cancel the monthly any time.
          </p>
        </div>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
