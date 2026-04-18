// app/products/inbox-autopilot/page.tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProductPageShell from "@/components/ProductPageShell";

export const metadata: Metadata = {
  title: "Inbox Autopilot — Zero Clicks",
  description:
    "AI reads, sorts and drafts every email so you check your inbox twice a day instead of all day.",
};

export default function InboxAutopilotPage() {
  return (
    <>
      <ProductPageShell
        eyebrow="Product · Inbox Autopilot"
        headline={
          <>
            Your inbox, sorted.<br />
            <span style={{ opacity: 0.5 }}>Before lunch.</span>
          </>
        }
        subtext="AI reads every email that hits your pub, classifies it — booking, supplier, complaint, noise — and drafts the reply in your voice. You check twice a day instead of all day."
        status="beta"
        accentColor="#f59e0b"
      >
        <div style={{
          padding: "48px 32px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))",
          border: "1px solid rgba(245,158,11,0.15)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", marginBottom: "16px" }}>
            EARLY ACCESS
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 12px" }}>
            Rolling out to first 10 pubs
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto", fontFamily: "var(--font-body)" }}>
            Inbox Autopilot is being deployed with selected early access clients. Book a call to get on the list — first 10 pubs get founder pricing locked in forever.
          </p>
        </div>

        {/* Feature grid */}
        <section style={{ marginTop: "60px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}>
            {[
              { title: "Classification first", desc: "Booking, complaint, supplier, spam — AI sorts before anything else happens. No noise in your reply queue." },
              { title: "Draft replies in your voice", desc: "We learn from 200+ of your past emails. Tone matches yours exactly — UK-friendly, to the point." },
              { title: "Calendar sync", desc: "Booking requests check your calendar, propose times, send a confirmation automatically once you approve." },
              { title: "One-tap approval", desc: "Mobile-first. Check the draft on your phone between services, tap send." },
              { title: "Urgent escalation", desc: "Real complaints, press, supplier emergencies — flagged to you instantly. Everything else waits." },
              { title: "Works with Gmail + Outlook", desc: "OAuth connect, no forwarding, no filters to maintain. Lives in your existing inbox." },
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
