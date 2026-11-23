import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { createCustomerPortal } from "@/lib/stripe-portal";
import { hasServiceAccess } from "@/lib/entitlements";
import { checkRateLimit } from "@/lib/rateLimit";
import { isWorkspaceOwner } from "@/lib/workspaceAccess";

export const dynamic = "force-dynamic";

function reply(value: object, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

async function loadProfile(userId: string) {
  return supabase
    .from("profiles")
    .select(
      "business_name,plan,trial_ends_at,trial_paused,stripe_customer_id,subscription_status",
    )
    .eq("clerk_user_id", userId)
    .maybeSingle();
}

function stripeClient() {
  return process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        timeout: 6_000,
        maxNetworkRetries: 0,
      })
    : null;
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return reply({ error: "Sign in to view billing." }, 401);
  const client = request.nextUrl.searchParams.get("client");
  if (client !== null && !isWorkspaceOwner(userId))
    return reply({ error: "Admins only." }, 403);
  if (client !== null && (!client || client.length > 128))
    return reply({ error: "Invalid client." }, 400);
  if (!checkRateLimit(`billing:read:${userId}`, 60).allowed)
    return reply({ error: "Try again later." }, 429);

  const { data: profile, error } = await loadProfile(client ?? userId);
  if (error) return reply({ error: "Could not load billing." }, 503);
  if (!profile) return reply({ error: "Complete venue setup first." }, 404);
  const base = {
    businessName: profile.business_name,
    plan: profile.plan,
    trialEndsAt: profile.trial_ends_at,
    trialPaused: !!profile.trial_paused,
    hasAccess: hasServiceAccess(profile),
    syncedStatus: profile.subscription_status,
    hasCustomer: !!profile.stripe_customer_id,
  };
  if (!profile.stripe_customer_id)
    return reply({ ...base, source: "local", subscription: null });
  const stripe = stripeClient();
  if (!stripe)
    return reply({ ...base, source: "unavailable", subscription: null });

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "all",
      limit: 20,
    });
    const sub =
      subscriptions.data.find(
        (s) => s.status === "active" || s.status === "trialing",
      ) ??
      subscriptions.data.find(
        (s) => s.status !== "canceled" && s.status !== "incomplete_expired",
      ) ??
      subscriptions.data[0];
    const invoice = sub?.latest_invoice
      ? await stripe.invoices.retrieve(
          typeof sub.latest_invoice === "string"
            ? sub.latest_invoice
            : sub.latest_invoice.id,
        )
      : null;
    const periodEnds =
      sub?.items.data
        .map((item) => item.current_period_end)
        .filter(Number.isFinite) ?? [];
    return reply({
      ...base,
      source: "stripe",
      mode: process.env.STRIPE_SECRET_KEY?.includes("_live_") ? "live" : "test",
      dashboardUrl:
        client !== null && /^cus_[A-Za-z0-9]+$/.test(profile.stripe_customer_id)
          ? `https://dashboard.stripe.com/${process.env.STRIPE_SECRET_KEY?.includes("_test_") ? "test/" : ""}customers/${profile.stripe_customer_id}`
          : undefined,
      subscription: sub
        ? {
            status: sub.status,
            periodEnd: periodEnds.length ? Math.min(...periodEnds) : null,
            cancelAt:
              sub.cancel_at ??
              (sub.cancel_at_period_end && periodEnds.length
                ? Math.min(...periodEnds)
                : null),
            invoice: invoice
              ? {
                  number: invoice.number,
                  status: invoice.status,
                  created: invoice.created,
                }
              : null,
          }
        : null,
    });
  } catch {
    return reply({ ...base, source: "unavailable", subscription: null });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return reply({ error: "Sign in to manage billing." }, 401);
  if (request.nextUrl.searchParams.has("client"))
    return reply({ error: "You can only open your own billing portal." }, 403);
  if (!checkRateLimit(`billing:portal:${userId}`, 10).allowed)
    return reply({ error: "Try again later." }, 429);

  const { data: profile, error } = await loadProfile(userId);
  if (error) return reply({ error: "Could not load billing." }, 503);
  if (!profile?.stripe_customer_id)
    return reply(
      { error: "No Stripe customer is linked to this venue yet." },
      409,
    );
  const stripe = stripeClient();
  if (!stripe)
    return reply({ error: "Billing is temporarily unavailable." }, 503);

  try {
    const session = await createCustomerPortal(
      stripe,
      profile.stripe_customer_id,
    );
    return reply({ url: session.url });
  } catch {
    return reply(
      {
        error: "Stripe couldn’t open the portal. Try again or contact support.",
      },
      502,
    );
  }
}
