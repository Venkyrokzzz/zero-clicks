import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zero Clicks collects, uses and protects your data.",
  alternates: { canonical: "https://www.0-clicks.uk/privacy" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "18 April 2026";

export default function PrivacyPage() {
  const h2Style: React.CSSProperties = {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "40px",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  };
  const pStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    lineHeight: 1.75,
    marginBottom: "16px",
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "120px", paddingBottom: "100px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "16px" }}>
            Legal
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "8px" }}>
            Privacy Policy
          </h1>
          <p style={{ ...pStyle, color: "var(--text-muted)", marginTop: 0 }}>
            Last updated: {LAST_UPDATED}
          </p>

          <p style={pStyle}>
            Zero Clicks (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at{" "}
            <a href="https://www.0-clicks.uk" style={{ color: "var(--accent)" }}>www.0-clicks.uk</a>.
            This page explains what personal data we collect, why we collect it, and your rights under the UK GDPR.
          </p>

          <h2 style={h2Style}>1. What we collect</h2>
          <p style={pStyle}>
            <strong>Contact form &amp; chat widget:</strong> Your name, email address, and the message you send us.
            This is used solely to respond to your enquiry.
          </p>
          <p style={pStyle}>
            <strong>Calendly:</strong> When you book a call, Calendly collects your name, email, and calendar data.
            Their privacy policy applies — see <a href="https://calendly.com/privacy" style={{ color: "var(--accent)" }} target="_blank" rel="noopener noreferrer">calendly.com/privacy</a>.
          </p>
          <p style={pStyle}>
            <strong>Analytics:</strong> We use Vercel Analytics to collect anonymous, aggregated pageview data
            (page URL, referrer, country, device type). No cookies are set. No personal data is stored.
            UTM parameters you include in URLs may be recorded as part of the session source.
          </p>
          <p style={pStyle}>
            <strong>Google OAuth (clients only):</strong> If you connect your Google Business Profile as a client,
            we store an OAuth access token to post review replies on your behalf. This token is encrypted
            at rest and never shared with third parties.
          </p>

          <h2 style={h2Style}>2. How we use your data</h2>
          <p style={pStyle}>
            We use your contact details to reply to enquiries and, with your agreement, to onboard you
            as a client. We do not send marketing emails without your explicit consent. We do not sell
            your data to anyone.
          </p>

          <h2 style={h2Style}>3. Data storage &amp; retention</h2>
          <p style={pStyle}>
            Enquiry data (name, email, message) is retained for up to 12 months, then deleted.
            Client OAuth tokens are deleted immediately upon offboarding. Analytics data is aggregate
            and non-personal — it is retained indefinitely.
          </p>

          <h2 style={h2Style}>4. Third-party services</h2>
          <p style={pStyle}>
            We use the following third-party services to operate the site:
          </p>
          <ul style={{ ...pStyle, paddingLeft: "20px" }}>
            <li>Web3Forms — processes contact form submissions (no data retained after forwarding)</li>
            <li>Calendly — booking system for discovery calls</li>
            <li>Vercel — hosting and anonymous analytics</li>
            <li>n8n (self-hosted) — automation workflows for client review replies</li>
            <li>Anthropic Claude API — AI-generated reply drafts (no personal data stored by Anthropic)</li>
          </ul>

          <h2 style={h2Style}>5. Your rights</h2>
          <p style={pStyle}>
            Under the UK GDPR, you have the right to access, correct, or delete any personal data we
            hold about you. You can also object to processing or request a data export. To exercise
            any of these rights, email us at{" "}
            <a href="mailto:zeroclicks.hq@gmail.com" style={{ color: "var(--accent)" }}>zeroclicks.hq@gmail.com</a>.
            We will respond within 30 days.
          </p>

          <h2 style={h2Style}>6. Cookies</h2>
          <p style={pStyle}>
            The Zero Clicks website does not use tracking or advertising cookies. We store a single
            key in <code>localStorage</code> to remember your dark/light theme preference. This is
            not transmitted to any server.
          </p>

          <h2 style={h2Style}>7. Contact</h2>
          <p style={pStyle}>
            Zero Clicks is operated by Venkatesh Surampudi, United Kingdom.
            For privacy enquiries:{" "}
            <a href="mailto:zeroclicks.hq@gmail.com" style={{ color: "var(--accent)" }}>zeroclicks.hq@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
