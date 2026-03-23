// app/contact/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_PAGE } from "@/lib/content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zero Clicks. We'll respond within one business day.",
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />

      <section
        style={{
          minHeight: "100vh",
          paddingTop: "140px",
          paddingBottom: "100px",
          paddingLeft: "48px",
          paddingRight: "48px",
        }}
      >
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Contact
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginBottom: "18px",
              letterSpacing: "-0.02em",
            }}
          >
            {CONTACT_PAGE.heading}
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              marginBottom: "52px",
              fontFamily: "var(--font-body)",
              maxWidth: "560px",
            }}
          >
            {CONTACT_PAGE.subtext}
          </p>

          {/* Two-column: Calendly block + Contact form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Left: Book a call */}
            <div>
              <p style={{
                fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600,
                marginBottom: "12px",
              }}>
                Option 1 — Book a call
              </p>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 400,
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text-primary)",
                margin: "0 0 12px", lineHeight: 1.2,
              }}>
                30 minutes. No slides. Just clarity.
              </h2>
              <p style={{
                fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75,
                fontFamily: "var(--font-body)", marginBottom: "28px",
              }}>
                Pick a time that suits you. We'll map your biggest manual bottleneck and tell you exactly what we'd automate and what it'd cost — on the call, not in a follow-up email.
              </p>

              {/* Calendly CTA block */}
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-mid)",
                borderRadius: "12px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}>
                {[
                  { icon: "⚡", text: "Response within 24h" },
                  { icon: "✓", text: "No hard sell, ever" },
                  { icon: "☎", text: "Free — no credit card needed" },
                  { icon: "◎", text: "Walk away with a clear action plan" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "6px",
                      background: "var(--accent-dim)", border: "1px solid var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", color: "var(--accent)", flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {item.text}
                    </span>
                  </div>
                ))}

                <a
                  href="https://calendly.com/zeroclicks"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "8px",
                    display: "block",
                    width: "100%",
                    padding: "14px",
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "14px",
                    textAlign: "center",
                    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.88";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  Book a free 30-min call →
                </a>
                <p style={{
                  fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-body)",
                  textAlign: "center", margin: 0,
                }}>
                  Add your Calendly link above — replace the href
                </p>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              <p style={{
                fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600,
                marginBottom: "12px",
              }}>
                Option 2 — Send a message
              </p>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 400,
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: "var(--text-primary)",
                margin: "0 0 12px", lineHeight: 1.2,
              }}>
                Prefer to write? That works too.
              </h2>
              <p style={{
                fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75,
                fontFamily: "var(--font-body)", marginBottom: "28px",
              }}>
                Tell us what's slowing you down. We'll reply within one business day with a clear plan.
              </p>
              <div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "32px",
                }}
              >
                <Suspense fallback={<div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "14px" }}>Loading form...</div>}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
