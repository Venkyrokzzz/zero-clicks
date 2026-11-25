import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { createCustomerPortal } from "@/lib/stripe-portal";
import { FOUNDING_OPEN } from "@/lib/foundingConfig";

const PRICE_IDS = {
  standard: "price_1TdrHfFkh5HZgB7WbtJAkjKC",
  pro: "price_1TdrJeFkh5HZgB7Wj7EvOt8R",
  founding: "price_1TdrIeFkh5HZgB7Wnk8RozCn",
  setup_fee: "price_1TdrRSFkh5HZgB7WDd9Dr30i",
};

const PLANS_WITH_SETUP = ["standard", "pro"];

async function getOrCreateStripeCustomer(stripe: Stripe, userId: string, email: string, name: string) {
  // Check if we already have a Stripe customer ID for this user
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  if (profileError) throw new Error('Profile lookup failed');
  if (data?.stripe_customer_id) return data.stripe_customer_id;

  // Create new Stripe customer
  const customer = await stripe.customers.create({ email, name, metadata: { clerk_user_id: userId } }, { idempotencyKey: `customer-${userId}` });

  // Store it
  const { error: saveError } = await supabase
    .from("profiles")
    .upsert({ clerk_user_id: userId, stripe_customer_id: customer.id }, { onConflict: "clerk_user_id" });

  if (saveError) throw new Error('Customer persistence failed');
  return customer.id;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const plan = typeof body?.plan === "string" ? body.plan : "";

  if (!plan || !Object.prototype.hasOwnProperty.call(PRICE_IDS, plan) || plan === "setup_fee") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (plan === "founding" && !FOUNDING_OPEN) {
    return NextResponse.json({ error: "Founding Member plan is now closed. All 10 spots have been taken." }, { status: 410 });
  }

  try {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('business_name,trial_ends_at,plan').eq('clerk_user_id', userId).maybeSingle();
    if (profileError) return NextResponse.json({ error: 'Could not load venue details. Try again.' }, { status: 503 });
    if (!profile?.business_name?.trim()) return NextResponse.json({ error: 'Finish setting up your venue before starting checkout.', code: 'ONBOARDING_REQUIRED' }, { status: 409 });
    const trialActive = profile.plan === 'trial' && profile.trial_ends_at
      && new Date(profile.trial_ends_at).getTime() > Date.now();
    if (trialActive && !(plan === 'standard' && body?.startPaidPlanNow === true)) {
      return NextResponse.json({ kind: 'trial_active' });
    }
    if (plan === 'founding') {
      const { count, error } = await supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('clerk_user_id', userId).not('posted_to_google_at', 'is', null);
      if (error) return NextResponse.json({ error: 'Could not check founding plan eligibility. Please try again.' }, { status: 503 });
      if (!count) return NextResponse.json({ error: 'Founding members pay after their first successful Google reply. Finish guided setup to continue.', code: 'FIRST_REPLY_REQUIRED' }, { status: 409 });
    }
    const key = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!key || !baseUrl) {
      console.error("[checkout] Missing Stripe or return URL configuration");
      return NextResponse.json({ error: "Stripe checkout is temporarily unavailable. Contact support." }, { status: 503 });
    }
    const stripe = new Stripe(key);
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const customerId = await getOrCreateStripeCustomer(stripe, userId, email, name);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 },
    ];

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    if (subscriptions.data.some(s => !['canceled', 'incomplete_expired'].includes(s.status))) {
      const portal = await createCustomerPortal(stripe, customerId);
      return NextResponse.json({ kind: 'portal', url: portal.url });
    }
    const openSessions = await stripe.checkout.sessions.list({ customer: customerId, status: 'open', limit: 100 });
    const existing = openSessions.data.find(s => s.mode === 'subscription');
    if (existing?.url) {
      if (existing.metadata?.plan !== plan) {
        return NextResponse.json({ error: 'A checkout is already open for a different plan. Return to that checkout or contact us to change plans.', code: 'OTHER_CHECKOUT_OPEN' }, { status: 409 });
      }
      return NextResponse.json({ kind: 'checkout', url: existing.url });
    }
    if (PLANS_WITH_SETUP.includes(plan)) {
      lineItems.push({ price: PRICE_IDS.setup_fee, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      integration_identifier: "zero-clicks-pricing-nqlaxtpk",
      customer: customerId,
      line_items: lineItems,
      subscription_data: { metadata: { clerk_user_id: userId, plan } },
      success_url: `${baseUrl}/dashboard/billing?checkout=returned`,
      cancel_url: `${baseUrl}/pricing#pricing`,
      metadata: { clerk_user_id: userId, plan },
    }, { idempotencyKey: `checkout-${userId}-${plan}-${Math.floor(Date.now() / 1800000)}` });

    if (!session.url) throw new Error('Checkout session missing a hosted URL');
    return NextResponse.json({ kind: 'checkout', url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout] Error:", message);
    return NextResponse.json({ error: "Unable to start checkout. Please contact support." }, { status: 500 });
  }
}
