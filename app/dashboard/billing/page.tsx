import BillingPanel from "@/components/workspace/BillingPanel";
import s from "@/components/workspace/Workspace.module.css";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  return (
    <main className={s.workspace}>
      <div className={`${s.compact} ${s.stack}`}>
        <header className={s.header}>
          <div>
            <h1>Billing</h1>
            <p className={s.muted}>Your subscription, payments and invoices.</p>
          </div>
          <a className={s.button} href="/dashboard">
            Review inbox
          </a>
        </header>
        {checkout === "returned" && (
          <p role="status" className={s.notice}>
            You returned from Stripe. Your plan updates after Stripe confirms payment.
          </p>
        )}
        <BillingPanel />
        <p className={s.muted}>
          Questions about billing?{" "}
          <a href="mailto:zeroclicks.hq@gmail.com">Contact Zero Clicks</a>.
        </p>
      </div>
    </main>
  );
}
