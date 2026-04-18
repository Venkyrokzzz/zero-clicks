// app/products/reputation-manager/page.tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProductPageShell from "@/components/ProductPageShell";
import ReputationShowcase from "@/components/ReputationShowcase";

export const metadata: Metadata = {
  title: "Reputation Manager — Zero Clicks",
  description:
    "Every Google review replied to, automatically. AI watches your listing 24/7 and drafts personalised responses in your own voice. You approve in one tap.",
};

export default function ReputationManagerPage() {
  return (
    <>
      <ProductPageShell
        eyebrow="Product · Reputation Manager"
        headline={
          <>
            Every Google review replied to.<br />
            <span style={{ opacity: 0.5 }}>Before you finish your shift.</span>
          </>
        }
        subtext="AI watches your Google listing 24/7 and writes personalised replies in your pub's own voice. 1-2★ complaints ping you instantly. Everything else runs on autopilot."
        status="live"
        accentColor="#60a5fa"
      >
        <ReputationShowcase />

        {/* Feature grid */}
        <section style={{ marginTop: "80px" }}>
          <h2 style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "40px",
            color: "var(--text-primary)",
          }}>
            Built for hospitality, not helpdesks.
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {[
              { title: "Replies in your voice", desc: "We learn your tone from past replies, menu, website and style. Not a template." },
              { title: "1-2★ reviews escalate", desc: "Instant Telegram ping to you. Nothing auto-sent on bad reviews without your eyes on it." },
              { title: "24/7 monitoring", desc: "New review lands on Google — draft is ready within 4 minutes. Even at 11pm Saturday." },
              { title: "Works with your PMS", desc: "Connects to Google Business Profile directly. No scraping, no fragile hacks." },
              { title: "Multi-location ready", desc: "One owner, five pubs? Each has its own voice, its own promo library, its own digest." },
              { title: "Weekly Telegram digest", desc: "Monday 9am: how many reviews this week, avg rating, what got attention." },
            ].map((f) => (
              <div key={f.title} style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <h3 style={{
                  fontSize: "15px", fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "var(--font-body)",
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ProductPageShell>
      <Footer />
    </>
  );
}
