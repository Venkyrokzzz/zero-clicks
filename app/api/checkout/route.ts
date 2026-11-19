import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { createCustomerPortal } from "@/lib/stripe-portal";
import { FOUNDING_OPEN } from "@/lib/foundingConfig";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  standard: "price_1TdrHfFkh5HZgB7WbtJAkjKC",
  pro: "price_1TdrJeFkh5HZgB7Wj7EvOt8R",
  founding: "price_1TdrIeFkh5HZgB7Wnk8RozCn",
  setup_fee: "price_1TdrRSFkh5HZgB7WDd9Dr30i",
};

const PLANS_WITH_SETUP = ["standard", "pro"];

async function getOrCreateStripeCustomer(userId: string, email: string, name: string) {
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
  const plan = body?.plan;

  if (!plan || !Object.prototype.hasOwnProperty.call(PRICE_IDS, plan) || plan === "setup_fee") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (plan === "founding" && !FOUNDING_OPEN) {
    return NextResponse.json({ error: "Founding Member plan is now closed. All 10 spots have been taken." }, { status: 410 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  try {
    const { data: profile, error: profileError } = await supabase.from('profiles').select('trial_ends_at,plan').eq('clerk_user_id', userId).single();
    if (profileError || !profile) return NextResponse.json({ error: 'Complete onboarding first' }, { status: 409 });
    if (profile.plan === 'trial' && profile.trial_ends_at && new Date(profile.trial_ends_at).getTime() > Date.now()) {
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` });
    }
    if (plan === 'founding') {
      const { count, error } = await supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('clerk_user_id', userId).not('posted_to_google_at', 'is', null);
      if (error || !count) return NextResponse.json({ error: 'Contact us to finish your founding-member setup before payment' }, { status: 409 });
    }
    const customerId = await getOrCreateStripeCustomer(userId, email, name);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 },
    ];

    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    if (subscriptions.data.some(s => !['canceled', 'incomplete_expired'].includes(s.status))) {
      const portal = await createCustomerPortal(stripe, customerId);
      return NextResponse.json({ url: portal.url });
    }
    const openSessions = await stripe.checkout.sessions.list({ customer: customerId, status: 'open', limit: 100 });
    const existing = openSessions.data.find(s => s.mode === 'subscription');
    if (existing?.url) return NextResponse.json({ url: existing.url });
    if (PLANS_WITH_SETUP.includes(plan)) {
      lineItems.push({ price: PRICE_IDS.setup_fee, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: lineItems,
      subscription_data: { metadata: { clerk_user_id: userId, plan } },
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/#pricing`,
      metadata: { clerk_user_id: userId, plan },
    }, { idempotencyKey: `checkout-${userId}-${plan}-${Math.floor(Date.now() / 1800000)}` });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout] Error:", message);
    return NextResponse.json({ error: "Unable to start checkout. Please contact support." }, { status: 500 });
  }
}
