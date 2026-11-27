"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatDate,
  panelRequest,
  statusLabel,
  type BillingSnapshot,
} from "./panel-data";
import s from "./Workspace.module.css";
import PricingCheckout from "@/components/reputation/PricingCheckout";
import { FOUNDING_OPEN } from "@/lib/foundingConfig";

export default function BillingPanel({ clientId }: { clientId?: string }) {
  const [data, setData] = useState<BillingSnapshot>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const suffix = clientId ? `?client=${encodeURIComponent(clientId)}` : "";
      setData(await panelRequest<BillingSnapshot>(`/api/billing${suffix}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Billing is unavailable.");
    } finally {
      setLoading(false);
    }
  }, [clientId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function openBilling() {
    setAction("portal");
    setError("");
    try {
      const { url } = await panelRequest<{ url?: string }>("/api/billing", { method: "POST" });
      const target = url ? new URL(url) : null;
      if (target?.protocol !== "https:" || target.hostname !== "billing.stripe.com") {
        throw new Error("Stripe returned no secure billing portal link.");
      }
      window.location.assign(target.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open Stripe.");
      setAction("");
    }
  }

  const sub = data?.subscription;
  const status = data?.source === "stripe" ? sub?.status : data?.syncedStatus;
  return (
    <section
      className={`${s.box} ${s.stack} ${s.detail}`}
      aria-label="Stripe billing"
    >
      <div className={s.row}>
        <h2>{clientId ? "Stripe billing" : "Current plan"}</h2>
        {data && (
          <span className={s.status}>
            {data.hasAccess ? "Service access on" : "Service access off"}
          </span>
        )}
        <button
          className={s.button}
          onClick={refresh}
          disabled={loading || !!action}
        >
          Refresh billing
        </button>
      </div>
      {loading && (
        <p role="status" className={s.muted}>
          Checking billing…
        </p>
      )}
      {error && (
        <p role="alert" className={s.alert}>
          {error}{" "}
          {!clientId && error === "Complete venue setup first." && (
            <a href="/onboarding">Set up your venue</a>
          )}
        </p>
      )}
      {data && (
        <>
          {data.source === "unavailable" && (
            <p className={s.alert}>
              Stripe could not be reached. The status below is the last saved
              status.
            </p>
          )}
          {data.mode === "test" && <p className={s.notice}>Stripe test mode</p>}
          {data.source === "stripe" &&
            (sub?.status ?? null) !== data.syncedStatus && (
              <p className={s.alert}>
                Stripe and Zero Clicks differ. Zero Clicks has{" "}
                {statusLabel(data.syncedStatus).toLowerCase()} saved. Service
                access reflects the saved status.
              </p>
            )}
          <dl className={s.definition}>
            <div>
              <dt>Zero Clicks plan</dt>
              <dd>{statusLabel(data.plan)}</dd>
            </div>
            <div>
              <dt>
                {data.source === "stripe"
                  ? "Stripe subscription"
                  : "Last saved Stripe status"}
              </dt>
              <dd>
                {status
                  ? statusLabel(status)
                  : data.hasCustomer
                    ? "No subscription recorded"
                    : "Customer not linked"}
              </dd>
            </div>
            {data.plan === "trial" && (
              <div>
                <dt>Trial ends</dt>
                <dd>
                  {formatDate(data.trialEndsAt)}
                  {data.trialPaused ? " · Paused" : ""}
                </dd>
              </div>
            )}
            {sub?.periodEnd && (
              <div>
                <dt>Current period ends</dt>
                <dd>{formatDate(sub.periodEnd)}</dd>
              </div>
            )}
            {sub?.cancelAt && (
              <div>
                <dt>Scheduled cancellation</dt>
                <dd>{formatDate(sub.cancelAt)}</dd>
              </div>
            )}
            {sub?.invoice && (
              <div>
                <dt>Latest invoice</dt>
                <dd>
                  {statusLabel(sub.invoice.status)} ·{" "}
                  {formatDate(sub.invoice.created)}
                  {sub.invoice.number && ` · ${sub.invoice.number}`}
                </dd>
              </div>
            )}
          </dl>
          {clientId ? (
            data.dashboardUrl ? (
              <div>
                <a
                  className={s.button}
                  href={data.dashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View customer in Stripe
                </a>
              </div>
            ) : null
          ) : (
            <div className={s.stack}>
              {data.hasCustomer && (
                <div className={s.row}>
                  <button
                    className={s.primary}
                    disabled={!!action}
                    onClick={() => openBilling()}
                  >
                    {action === "portal" ? "Opening Stripe…" : "Manage billing"}
                  </button>
                  <p className={s.muted}>
                    Payment methods and invoices are hosted in Stripe.
                  </p>
                </div>
              )}
              {(!data.hasCustomer ||
                (data.source === "stripe" &&
                  (!sub ||
                    ["canceled", "incomplete_expired"].includes(
                      sub.status,
                    )))) && (
                <div className={s.stack}>
                  <h3>Choose a subscription</h3>
                  <p className={s.muted}>
                    {FOUNDING_OPEN && "Founding is £35/month after your first successful Google reply. "}
                    Standard is £55/month plus £499 one-time setup.
                  </p>
                  <PricingCheckout foundingOpen={FOUNDING_OPEN} workspace />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
