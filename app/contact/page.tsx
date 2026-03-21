// app/contact/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_PAGE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zero Clicks. We'll respond within one business day.",
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            top: "-100px",
            right: "-100px",
            filter: "blur(80px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 70%)",
            bottom: "10%",
            left: "-80px",
            filter: "blur(80px)",
            borderRadius: "50%",
          }}
        />
      </div>

      <Navbar />

      <section
        style={{
          minHeight: "100vh",
          paddingTop: "140px",
          paddingBottom: "100px",
          paddingLeft: "48px",
          paddingRight: "48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              marginBottom: "20px",
            }}
          >
            Contact
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginBottom: "20px",
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
              marginBottom: "56px",
              fontFamily: "var(--font-body)",
            }}
          >
            {CONTACT_PAGE.subtext}
          </p>

          {/* Glass form card */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "16px",
              padding: "48px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Prismatic top border */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "48px",
                right: "48px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(168,216,255,0.5), rgba(196,181,253,0.7), rgba(249,168,212,0.5), transparent)",
              }}
            />
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
