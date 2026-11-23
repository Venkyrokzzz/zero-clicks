import Link from "next/link";
import { FOUNDING_OPEN, FOUNDING_TOTAL } from "@/lib/foundingConfig";
import ReviewDesk from "./ReviewDesk";
import PricingCheckout from "./PricingCheckout";
import OwnerWalkthrough from "./OwnerWalkthrough";
import VenueEnquiry from "./VenueEnquiry";
import s from "./ReputationLaunch.module.css";
import paper from "./PaperDesk.module.css";

type Page = "home" | "product" | "demo" | "pricing" | "process" | "contact";
const enquiry = "/contact?service=Reputation%20Manager";

const mainLinks = [
  { page: "product", href: "/products/reputation-manager", label: "Reputation Manager" },
  { page: "process", href: "/how-it-works", label: "How it works" },
  { page: "demo", href: "/demo", label: "Try the demo" },
  { page: "pricing", href: "/pricing", label: "Pricing" },
] as const;

function Header({ page }: { page: Page }) {
  const links = mainLinks.map((link) => (
    <Link
      key={link.page}
      href={link.href}
      aria-current={page === link.page ? "page" : undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={s.header}>
      <Link
        href="/"
        className={s.wordmark + " " + paper.deskBrand}
        aria-label="Zero Clicks home"
        aria-current={page === "home" ? "page" : undefined}
      >
        <img src="/zero-clicks-mark.svg" alt="" width={48} height={48} />
        zero clicks
      </Link>
      <nav className={s.navigation} aria-label="Main navigation">{links}</nav>
      <Link href="/sign-in" className={s.login}>Log in</Link>
      <details className={s.mobileNav}>
        <summary>
          Menu
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </summary>
        <nav aria-label="Mobile navigation">
          {links}
          <Link href={enquiry} aria-current={page === "contact" ? "page" : undefined}>Contact</Link>
        </nav>
      </details>
    </header>
  );
}
function Footer() {
  return (
    <footer className={s.footer}>
      <Link href="/" className={`${s.wordmark} ${paper.deskBrand}`}>
        <img src="/zero-clicks-mark.svg" alt="" width={48} height={48} />
        zero clicks
      </Link>
      <nav aria-label="Footer navigation">
        <Link href={enquiry}>Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <p>Less screen. More floor.</p>
    </footer>
  );
}
export function Process({ animate = false }: { animate?: boolean }) {
  return (
    <section id="how-it-works" className={animate ? s.process + " " + s.processMotion : s.process}>
      <h2>From a guest’s words to your next reply.</h2>
      <ol>
        {[
          [
            "Connect your venue",
            "Link the Google Business Profile you manage.",
          ],
          [
            "Get a draft for every rating",
            "Five stars get a default thank-you. One to four stars get a reply based on the guest’s comments when available.",
          ],
          [
            "Handle the exceptions",
            "The duty manager sees sensitive reviews with a reason and an editable draft.",
          ],
          [
            "Review and copy",
            "Edit and copy a draft from your inbox. The pilot keeps replies private.",
          ],
        ].map(([title, body], i) => (
          <li key={title}>
            <span className={s.stepNumber}>0{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function Pricing() {
  return (
    <section id="pricing" className={s.pricing}>
      <div>
        <p className={s.productLabel}>Reputation Manager</p>
        <h2>One venue. A little less on your plate.</h2>
        <p className={s.pricingDescription}>
          Google review drafts, editing and copying, and guided onboarding.
        </p>
        <PricingCheckout foundingOpen={FOUNDING_OPEN} />
        <Link className={s.pricingContact} href={enquiry}>Discuss your venue</Link>
      </div>
      <div className={s.priceDetails}>
        <p className={s.price}>
          {FOUNDING_OPEN ? "£35" : "£55"} <span>/ month</span>
        </p>
        <p>
          {FOUNDING_OPEN
            ? `Founding plan · first ${FOUNDING_TOTAL} customers`
            : "Standard plan · £499 one-time setup"}
        </p>
        {FOUNDING_OPEN && (
          <>
            <p className={s.foundingTerms}>No setup fee. Pay after the first successful Google reply and guided setup.</p>
            <div className={s.standardPrice}>
              Standard plan £55 / month
              <br />
              £499 one-time setup
            </div>
          </>
        )}
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section className={s.faq}>
      <h2>A few good questions.</h2>
      <div>
        {[
          [
            "Where do the replies go?",
            "Drafts are saved in your private inbox. You can edit and copy them. Google publishing is off during the pilot.",
          ],
          [
            "Does this demo connect to Google?",
            "No. Try a sample or paste public review text to generate an editable draft. The demo never connects an account or publishes a reply.",
          ],
          [
            "What do I need to get started?",
            "A Google Business Profile you are authorised to manage. We’ll discuss your venue, confirm the connection and walk through the first reply together.",
          ],
        ].map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>
              {q}
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export default function ReputationLaunch({ page = "home" }: { page?: Page }) {
  const full = page === "home" || page === "product";
  return (
    <div className={s.site}>
      <a href="#main-content" className={s.skip}>
        Skip to content
      </a>
      <Header key={page} page={page} />
      <main key={page} id="main-content" className={s.pageMotion}>
        {(full || page === "demo") && (
          <>
            <section className={s.hero}>
              <div className={s.heroCopy}>
                <h1>
                  {page === "demo"
                    ? "A thoughtful reply starts here."
                    : "Good hospitality deserves a thoughtful reply."}
                </h1>
                <p className={s.descriptor}>
                  Reputation Manager by <span>Zero Clicks</span>
                </p>
                <p className={s.intro}>
                  {page === "demo"
                    ? "Choose a sample or paste a review. Draft a reply, edit it and try approving it."
                    : "Google review replies, drafted for UK pubs and restaurants. Five stars get a default thank-you. One to four stars get a draft based on the guest’s feedback."}
                </p>
                <div className={s.heroActions}>
                  <a className={s.primary} href="#walkthrough">
                    Try the walkthrough
                  </a>
                  <Link className={s.textLink} href={enquiry}>
                    Discuss your venue
                  </Link>
                </div>
              </div>
              <ReviewDesk />
            </section>
            {page === "demo" && <OwnerWalkthrough />}
            {full && (
              <div className={s.principles}>
                <p>Your voice.</p>
                <p>Your final edit.</p>
                <p>Your reputation.</p>
              </div>
            )}
          </>
        )}
        {page === "process" && (
          <section className={s.pageIntro}>
            <p className={s.productLabel}>Reputation Manager</p>
            <h1>You keep the final word.</h1>
            <p>
              From connecting your venue to editing a draft, here’s how the
              workflow fits around your day.
            </p>
            <Link href="/demo" className={s.primary}>
              Try the walkthrough
            </Link>
          </section>
        )}
        {(full || page === "process") && <Process animate={page === "process"} />}
        {page === "pricing" && (
          <section className={s.pageIntro}>
            <p className={s.productLabel}>Reputation Manager</p>
            <h1>A clear plan for your venue.</h1>
            <p>
              Choose your plan and continue to Stripe. We can also walk you through the first reply.
            </p>
          </section>
        )}
        {(full || page === "pricing" || page === "process") && <Pricing />}
        {page === "contact" && (
          <section className={s.contact}>
            <div>
              <p className={s.productLabel}>Reputation Manager</p>
              <h1>Let’s talk about your venue.</h1>
              <p>
                Tell us how you handle Google reviews today. We’ll help you see
                where Reputation Manager can fit.
              </p>
              <div className={s.callOption}>
                <h2>Prefer a conversation?</h2>
                <p>
                  Bring a review you’ve been putting off. We’ll work through it
                  together.
                </p>
                <a
                  className={s.textLink}
                  href="https://calendly.com/zeroclicks-hq/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Choose a time to talk
                </a>
              </div>
            </div>
            <VenueEnquiry />
          </section>
        )}
        {page !== "contact" && <FAQ />}
      </main>
      <Footer />
    </div>
  );
}
