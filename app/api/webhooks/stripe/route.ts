import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supported = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.paid', 'invoice.payment_failed']);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), signature, secret); }
  catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }); }
  if (!supported.has(event.type)) return NextResponse.json({ received: true });
  try {
    const object = event.data.object as unknown as { customer?: string | { id: string } | null };
    const customerId = typeof object.customer === 'string' ? object.customer : object.customer?.id;
    if (!customerId) throw new Error('Missing customer');
    // Reconcile current Stripe state rather than applying an old event's status.
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    const sub = subscriptions.data.find(s => ['active', 'trialing'].includes(s.status))
      ?? subscriptions.data.find(s => ['past_due', 'unpaid', 'paused'].includes(s.status))
      ?? subscriptions.data[0];
    if (!sub) throw new Error('Subscription not yet available');
    const userId = sub.metadata.clerk_user_id;
    const plan = sub.metadata.plan;
    if (!userId || !['founding', 'standard', 'pro', 'starter'].includes(plan)) throw new Error('Unknown subscription owner or plan');
    const { data, error } = await supabase.from('profiles').update({
      plan: sub.status === 'canceled' ? 'cancelled' : plan,
      stripe_customer_id: customerId,
      subscription_status: sub.status,
      updated_at: new Date().toISOString(),
    }).eq('clerk_user_id', userId).select('clerk_user_id');
    if (error || data?.length !== 1) throw new Error('Subscription persistence failed');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[stripe-webhook] Reconciliation failed', error);
    return NextResponse.json({ error: 'Unable to synchronise subscription' }, { status: 503 });
  }
}
