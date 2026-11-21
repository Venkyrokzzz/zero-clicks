"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import s from "./ReputationLaunch.module.css";

type Plan = "founding" | "standard";
type CheckoutMessage = {
  text: string;
  action?: "signin" | "onboarding" | "first-reply" | "trial";
};

export default function PricingCheckout({ foundingOpen }: { foundingOpen: boolean }) {
  const [pending, setPending] = useState<Plan>();
  const [message, setMessage] = useState<CheckoutMessage>();
  const busy = useRef(false);

  async function start(plan: Plan) {
    if (busy.current) return;
    busy.current = true;
    setPending(plan);
    setMessage(undefined);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 401) {
        setMessage({ text: "Sign in to continue with your venue’s billing.", action: "signin" });
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        const action = result.code === "ONBOARDING_REQUIRED"
          ? "onboarding"
          : result.code === "FIRST_REPLY_REQUIRED" ? "first-reply" : undefined;
        setMessage({ text: result.error || "Could not open checkout. Please try again.", action });
        return;
      }
      if (result.kind === "trial_active") {
        setMessage({ text: "Your trial is still active. You can keep using Zero Clicks and return to billing when it ends.", action: "trial" });
        return;
      }

      const target = new URL(result.url);
      const expectedHost = result.kind === "checkout" ? "checkout.stripe.com"
        : result.kind === "portal" ? "billing.stripe.com" : null;
      if (!expectedHost || target.protocol !== "https:" || target.hostname !== expectedHost) {
        throw new Error("Could not verify the Stripe link.");
      }
      window.location.assign(target.href);
    } catch {
      setMessage({ text: "Could not open Stripe. Please try again in a moment." });
    } finally {
      busy.current = false;
      setPending(undefined);
    }
  }

  return (
    <div className={s.checkout}>
      <div className={s.checkoutButtons}>
        {foundingOpen && (
          <button type="button" className={s.primary} disabled={!!pending} onClick={() => void start("founding")}>
            {pending === "founding" ? "Opening Stripe…" : "Founding plan checkout"}
          </button>
        )}
        <button type="button" className={foundingOpen ? s.checkoutSecondary : s.primary} disabled={!!pending} onClick={() => void start("standard")}>
          {pending === "standard" ? "Opening Stripe…" : "Standard plan checkout"}
        </button>
      </div>
      <div role="status" className={s.checkoutStatus}>
        {message && <p>{message.text}</p>}
        {message?.action === "signin" && (
          <div className={s.checkoutLinks}>
            <Link href={"/sign-in?redirect_url=" + encodeURIComponent("/pricing#pricing")}>Sign in</Link>
            <Link href="/sign-up">Create an account</Link>
          </div>
        )}
        {message?.action === "onboarding" && <Link href="/onboarding">Set up your venue</Link>}
        {message?.action === "first-reply" && <Link href="/contact?service=Reputation%20Manager">Arrange guided setup</Link>}
        {message?.action === "trial" && <Link href="/dashboard/billing">Open billing</Link>}
      </div>
    </div>
  );
}
