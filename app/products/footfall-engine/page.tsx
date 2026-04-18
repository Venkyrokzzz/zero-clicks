// app/products/footfall-engine/page.tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProductPageShell from "@/components/ProductPageShell";

export const metadata: Metadata = {
  title: "Footfall Engine — Zero Clicks",
  description:
    "Automated Google Business Profile posting that brings local searchers through your door.",
};

export default function FootfallEnginePage() {
  return (
    <>
      <ProductPageShell
        eyebrow="Product · Footfall Engine"
        headline={
          <>
            Show up on Google.<br />
            <span style={{ opacity: 0.5 }}>Every time someone searches near you.</span>
          </>
        }
        subtext="Automated Google Business Profile posting. Offers, events, freshness updates — all policy-safe, all published from a library you pre-approved. 76% of local searchers visit a business within 24 hours."
        status="soon"
        accentColor="#a78bfa"
      >
        <div style={{
          padding: "48px 32px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(167,139,250,0.02))",
          border: "1px solid rgba(167,139,250,0.18)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", marginBottom: "16px" }}>
            LAUNCHING Q3 2026
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 12px" }}>
            Join the waitlist
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 24px", fontFamily: "var(--font-body)" }}>
            Footfall Engine is currently in foundation build. Waitlist pubs get 3 months free when we launch. Reputation Manager clients skip the queue automatically.
          </p>
        </div>

        {/* What it does */}
        <section style={{ marginTop: "60px" }}>
          <h2 style={{
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "32px",
            color: "var(--text-primary)",
          }}>
            What it does.
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {[
              { title: "4 posts a month, automatic", desc: "Offer, event, freshness, update. Rotated across lanes so you never look repetitive." },
              { title: "Pre-approved promo library", desc: "You tell us your offers and events once. We publish them on schedule, policy-safe." },
              { title: "Alcohol-safe compliance", desc: "GBP bans promoting alcohol directly. Our filter rewrites around it without losing the hook." },
              { title: "CTR tracked per post", desc: "Every post gets a CTA button. We track how many tapped 'get directions' or 'call'." },
              { title: "Weekly performance digest", desc: "Monday Telegram: which posts landed, which didn't, what to try next." },
              { title: "Multi-location scheduling", desc: "Each pub posts in its own timezone, on its own rhythm. One owner, zero admin." },
            ].map((f) => (
              <div key={f.title} style={{
                padding: "22px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, fontFamily: "var(--font-body)" }}>
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
