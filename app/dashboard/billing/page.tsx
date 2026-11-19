import BillingPanel from "@/components/workspace/BillingPanel";
import s from "@/components/workspace/Workspace.module.css";

export default function BillingPage() {
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
        <BillingPanel />
        <p className={s.muted}>
          Questions about billing?{" "}
          <a href="mailto:zeroclicks.hq@gmail.com">Contact Zero Clicks</a>.
        </p>
      </div>
    </main>
  );
}
