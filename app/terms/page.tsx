import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service — Zero Clicks",
  description: "Terms and conditions for using Zero Clicks services.",
  alternates: { canonical: "https://www.0-clicks.uk/terms" },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = "15 May 2026";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ ...pStyle, color: "var(--text-muted)", marginTop: 0 }}>
            Last updated: {LAST_UPDATED}
          </p>

          <p style={pStyle}>
            These Terms of Service govern your use of the Zero Clicks service operated by Venkatesh Surampudi
            trading as Zero Clicks (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), United Kingdom.
            By signing up or using our service, you agree to these terms.
          </p>

          <h2 style={h2Style}>1. The Service</h2>
          <p style={pStyle}>
            Zero Clicks provides automated Google review reply drafting and management for UK hospitality
            businesses. The service connects to your Google Business Profile via OAuth, detects new reviews,
            and generates draft replies using AI. You review and approve replies via your Zero Clicks dashboard
            before they are posted, unless you have enabled the auto-send feature for positive reviews.
          </p>

          <h2 style={h2Style}>2. Trial Period</h2>
          <p style={pStyle}>
            New clients receive a 60-day free trial. No payment is required during the trial. At the end of
            the trial period, continued use of the service requires a paid subscription. We will notify you
            by email at least 7 days before your trial expires. You may cancel at any time during the trial
            at no cost.
          </p>

          <h2 style={h2Style}>3. Fees and Payment</h2>
          <p style={pStyle}>
            Our standard pricing is a one-off setup fee of £499 plus a monthly subscription of £49 per month,
            per venue. Prices are exclusive of VAT (we are not currently VAT registered). Monthly subscriptions
            are billed in advance. Invoices are issued on the first of each month. Payment is due within 14 days
            of the invoice date. We reserve the right to suspend the service for accounts overdue by more than
            30 days.
          </p>

          <h2 style={h2Style}>4. Your Responsibilities</h2>
          <p style={pStyle}>
            You are responsible for: (a) ensuring you have the right to connect your Google Business Profile
            to our service; (b) reviewing AI-generated draft replies before approving them for posting;
            (c) ensuring any replies posted comply with Google&apos;s review policies and applicable UK law;
            (d) keeping your account credentials secure.
          </p>
          <p style={pStyle}>
            You must not use Zero Clicks to post false, misleading, or defamatory content in response to
            reviews. You remain solely responsible for the content of any reply posted to your Google
            Business Profile through our service.
          </p>

          <h2 style={h2Style}>5. AI-Generated Content</h2>
          <p style={pStyle}>
            Zero Clicks uses large language model AI (Anthropic Claude) to draft review replies. AI-generated
            content is a starting point, not a finished product. We do not guarantee that drafts will be
            factually accurate, tonally appropriate for every situation, or free from errors. You are
            responsible for reviewing all drafts before approval. We accept no liability for replies
            posted without human review.
          </p>

          <h2 style={h2Style}>6. Google Business Profile Access</h2>
          <p style={pStyle}>
            To use the service, you grant Zero Clicks limited OAuth access to your Google Business Profile
            for the sole purpose of reading reviews and posting replies. We do not access, modify, or store
            any other data from your Google account. You may revoke this access at any time via your
            Zero Clicks dashboard or directly via your Google account settings at
            myaccount.google.com/permissions.
          </p>

          <h2 style={h2Style}>7. Data and Confidentiality</h2>
          <p style={pStyle}>
            We process review text, reviewer names, and your business details to provide the service.
            This data is stored securely on UK/EU infrastructure (Supabase, Vercel). We do not sell,
            share, or disclose your data to third parties except as required to operate the service
            (Anthropic Claude API for reply generation — no data is retained by Anthropic after processing).
            Full details are in our <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
          </p>

          <h2 style={h2Style}>8. Cancellation</h2>
          <p style={pStyle}>
            You may cancel your subscription at any time by emailing
            {" "}<a href="mailto:zeroclicks.hq@gmail.com" style={{ color: "var(--accent)" }}>zeroclicks.hq@gmail.com</a>.
            Cancellations take effect at the end of the current billing month. We do not offer refunds
            for partial months. On cancellation, your data is retained for 30 days then permanently deleted.
            You may request immediate deletion at any time.
          </p>

          <h2 style={h2Style}>9. Limitation of Liability</h2>
          <p style={pStyle}>
            Zero Clicks is a sole trader operation. Our total liability to you for any claim arising from
            use of the service is limited to the fees you paid in the 3 months preceding the claim.
            We are not liable for: loss of revenue or profits; reputational damage arising from approved
            replies; service interruptions beyond our reasonable control (including Google API outages);
            or indirect or consequential losses.
          </p>

          <h2 style={h2Style}>10. Changes to the Service</h2>
          <p style={pStyle}>
            We may update these Terms at any time. Material changes will be communicated by email at
            least 14 days before they take effect. Continued use of the service after that date constitutes
            acceptance of the updated Terms. If you do not accept the changes, you may cancel without penalty
            during the notice period.
          </p>

          <h2 style={h2Style}>11. Governing Law</h2>
          <p style={pStyle}>
            These Terms are governed by the laws of England and Wales. Any disputes will be subject to
            the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 style={h2Style}>12. Contact</h2>
          <p style={pStyle}>
            Zero Clicks is operated by Venkatesh Surampudi, United Kingdom.
            For any questions about these Terms:{" "}
            <a href="mailto:zeroclicks.hq@gmail.com" style={{ color: "var(--accent)" }}>zeroclicks.hq@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
