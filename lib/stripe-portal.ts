import "server-only";
import type Stripe from "stripe";

export const WORKSPACE_PORTAL_KEY = "zero_clicks_workspace";

export async function createCustomerPortal(stripe: Stripe, customer: string) {
  const configs = await stripe.billingPortal.configurations.list({
    active: true,
    limit: 100,
  });
  const config =
    configs.data.find(
      (entry) => entry.metadata?.workspace === WORKSPACE_PORTAL_KEY,
    ) ?? configs.data.find((entry) => entry.is_default);
  const returnUrl = new URL(
    "/dashboard/billing",
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.0-clicks.uk",
  );
  return stripe.billingPortal.sessions.create({
    customer,
    return_url: returnUrl.href,
    ...(config ? { configuration: config.id } : {}),
  });
}
