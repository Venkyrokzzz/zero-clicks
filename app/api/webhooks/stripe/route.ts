import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.clerk_user_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) break;

      await supabase
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);

      console.log(`[stripe-webhook] Activated plan '${plan}' for user ${userId}`);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.clerk_user_id;
      if (!userId) break;

      await supabase
        .from("profiles")
        .update({
          plan: "cancelled",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);

      console.log(`[stripe-webhook] Cancelled subscription for user ${userId}`);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      console.log(`[stripe-webhook] Payment failed for customer ${customerId}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
