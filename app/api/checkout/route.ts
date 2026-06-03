import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

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
  const { data } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  if (data?.stripe_customer_id) return data.stripe_customer_id;

  // Create new Stripe customer
  const customer = await stripe.customers.create({ email, name, metadata: { clerk_user_id: userId } });

  // Store it
  await supabase
    .from("profiles")
    .upsert({ clerk_user_id: userId, stripe_customer_id: customer.id }, { onConflict: "clerk_user_id" });

  return customer.id;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { plan } = await req.json();

  if (!plan || !(plan in PRICE_IDS) || plan === "setup_fee") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const customerId = await getOrCreateStripeCustomer(userId, email, name);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 },
  ];

  // For standard and pro — add setup fee as invoice item (charged once in first invoice)
  if (PLANS_WITH_SETUP.includes(plan)) {
    await stripe.invoiceItems.create({
      customer: customerId,
      price_data: {
        currency: "gbp",
        product: "prod_Ud7gA6YSXIN0Gv",
        unit_amount: 49900,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: lineItems,
    subscription_data: { metadata: { clerk_user_id: userId, plan } },
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/#pricing`,
    metadata: { clerk_user_id: userId, plan },
  });

  return NextResponse.json({ url: session.url });
}
