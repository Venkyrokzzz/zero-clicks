import Link from "next/link";
import s from "@/components/reputation/ReputationLaunch.module.css";
import e from "@/components/reputation/Editorial.module.css";
import paper from "@/components/reputation/PaperDesk.module.css";

export default function NotFound() {
  return (
    <div className={`${s.site} ${e.site}`}>
      <a href="#main-content" className={s.skip}>
        Skip to content
      </a>
      <header className={`${s.header} ${e.header}`}>
        <Link href="/" className={`${s.wordmark} ${paper.deskBrand}`} aria-label="Zero Clicks home">
          <img src="/zero-clicks-mark.svg" alt="" width={48} height={48} />
          zero clicks
        </Link>
        <nav className={s.navigation} aria-label="Main navigation">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/demo">Try the demo</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <div className={e.headerActions}>
          <a href="/workspace" className={s.login}>Workspace</a>
          <a href="/start" className={e.connect}>Connect Google</a>
        </div>
        <details className={s.mobileNav}>
          <summary>
            Menu
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </summary>
          <nav aria-label="Mobile navigation">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/demo">Try the demo</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="/start">Connect Google</a>
            <Link href="/contact?service=Reputation%20Manager">Contact</Link>
          </nav>
        </details>
      </header>
      <main id="main-content" className={s.pageIntro} style={{ paddingBlock: "clamp(48px, 8vw, 110px)" }}>
        <p className={s.productLabel}>404 · Page not found</p>
        <h1 style={{ maxWidth: "14ch", marginTop: "12px" }}>This page isn’t on the menu.</h1>
        <p style={{ maxWidth: "46ch", marginTop: "18px" }}>
          The link may have moved or been mistyped. You can head back to the homepage or try a sample Google review reply right away.
        </p>
        <div className={e.heroActions} style={{ marginTop: "28px" }}>
          <Link className={s.primary} href="/">Back to home</Link>
          <Link className={e.underlined} href="/demo">Try the demo</Link>
        </div>
      </main>
      <footer className={`${s.footer} ${e.footer}`}>
        <Link href="/" className={`${s.wordmark} ${paper.deskBrand}`}>
          <img src="/zero-clicks-mark.svg" alt="" width={48} height={48} />
          zero clicks
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/contact?service=Reputation%20Manager">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p>Google review replies for UK pubs and restaurants.</p>
      </footer>
    </div>
  );
}
