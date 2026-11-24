import Link from "next/link";
import Image from "next/image";
import { FOUNDING_OPEN, FOUNDING_TOTAL } from "@/lib/foundingConfig";
import ReviewDesk from "./ReviewDesk";
import PricingCheckout from "./PricingCheckout";
import OwnerWalkthrough from "./OwnerWalkthrough";
import VenueEnquiry from "./VenueEnquiry";
import s from "./ReputationLaunch.module.css";
import e from "./Editorial.module.css";
import paper from "./PaperDesk.module.css";

type Page = "home" | "product" | "demo" | "pricing" | "process" | "contact";
const enquiry = "/contact?service=Reputation%20Manager";

const mainLinks = [
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
    <header className={`${s.header} ${e.header}`}>
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
      <div className={e.headerActions}>
        <Link href="/sign-in" className={s.login}>Log in</Link>
        <Link href="/start" className={e.connect}>Connect Google</Link>
      </div>
      <details className={s.mobileNav}>
        <summary>
          Menu
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </summary>
        <nav aria-label="Mobile navigation">
          {links}
          <Link href="/start">Connect Google</Link>
          <Link href={enquiry} aria-current={page === "contact" ? "page" : undefined}>Contact</Link>
        </nav>
      </details>
    </header>
  );
}
function Footer() {
  return (
    <footer className={`${s.footer} ${e.footer}`}>
      <Link href="/" className={`${s.wordmark} ${paper.deskBrand}`}>
        <img src="/zero-clicks-mark.svg" alt="" width={48} height={48} />
        zero clicks
      </Link>
      <nav aria-label="Footer navigation">
        <Link href={enquiry}>Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <p>Google review replies for UK pubs and restaurants.</p>
    </footer>
  );
}
const steps = [
  ["Connect your venue", "Link the Google Business Profile you manage."],
  ["Check your drafts", "Read the guest’s review, then edit the draft to sound like your team."],
  ["Keep the final word", "Edit or copy your draft in the owner inbox. The pilot saves replies privately."],
] as const;

function StepIcon({ index }: { index: number }) {
  const paths = [
    "M9 15l6-6M7.2 16.8l-1.1 1.1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M17 7l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0",
    "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h6m-6 4h6m-6 4h4",
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM7.5 12l3 3 6-6",
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[index]} />
    </svg>
  );
}

export function Process({ showWalkthroughLink = false }: { showWalkthroughLink?: boolean }) {
  return (
    <section id="how-it-works" className={e.process}>
      <h2>From review to draft</h2>
      {showWalkthroughLink && <Link className={e.underlined} href="/how-it-works#owner-walkthrough">Watch how drafts work</Link>}
      <ol>
        {steps.map(([title, body], index) => (
          <li key={title}>
            <StepIcon index={index} />
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProductHero() {
  return (
    <section className={e.hero} aria-labelledby="product-heading">
      <div className={e.heroCopy}>
        <h1 id="product-heading">Good service deserves a good reply.</h1>
        <p>Get private drafts for Google reviews at your pub or restaurant.</p>
        <div className={e.heroActions}>
          <a className={s.primary} href="#walkthrough">Try a review <span aria-hidden="true">→</span></a>
          <Link className={e.underlined} href="/start">Connect Google</Link>
        </div>
      </div>
      <figure className={e.heroPhoto}>
        <Image
          src="/hospitality-review-hero.jpg"
          alt="A pub manager checking her phone at the bar after service"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 55vw"
        />
        <figcaption className={e.reviewSlip}>
          <span>Sample review</span>
          <q>Lovely Sunday roast. We’ll be back.</q>
        </figcaption>
      </figure>
    </section>
  );
}

function DemoSection({ standalone }: { standalone: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section className={e.demoBand} aria-labelledby="demo-heading">
      <div className={e.demoInner}>
        <div className={e.demoIntro}>
          <Heading id="demo-heading">Try it with a review</Heading>
          <p>Choose a sample or paste a public review. Try editing and copying a private draft.</p>
        </div>
        <ReviewDesk />
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className={`${s.pricing} ${e.pricing}`}>
      <div>
        <h2>A clear plan for your venue</h2>
        <p className={s.pricingDescription}>
          Google review drafts, an owner inbox, and guided onboarding.
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
    <section className={`${s.faq} ${e.faq}`}>
      <h2>FAQs</h2>
      <div>
        {[
          [
            "Will replies go out without me?",
            "The pilot saves drafts in your owner inbox. You can edit or copy them, and anything that needs a closer look is flagged.",
          ],
          [
            "Does this demo connect to Google?",
            "No. Try a sample or paste public review text to generate an editable draft. The demo never connects an account or publishes a reply.",
          ],
          [
            "What do I need to get started?",
            "A Google Business Profile you own or manage. Connect it from Zero Clicks using the Google account that has access to the venue.",
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
    <div className={`${s.site} ${e.site}`}>
      <a href="#main-content" className={s.skip}>
        Skip to content
      </a>
      <Header key={page} page={page} />
      <main key={page} id="main-content" className={page === "process" || page === "demo" ? undefined : s.pageMotion}>
        {full && <ProductHero />}
        {full && <Process showWalkthroughLink />}
        {(full || page === "demo") && <DemoSection standalone={page === "demo"} />}
        {page === "demo" && <OwnerWalkthrough />}
        {page === "process" && <OwnerWalkthrough standalone />}
        {page === "process" && <Process />}
        {page === "pricing" && (
          <section className={s.pageIntro}>
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
