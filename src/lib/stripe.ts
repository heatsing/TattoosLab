import { getStripe } from "@/lib/stripe/config";
import { getPriceId, plans } from "@/lib/stripe/plans";

export const PLANS = plans;

export async function getOrCreateCustomer({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
  const stripe = getStripe();
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return stripe.customers.create({
    email,
    metadata: { userId },
  });
}

export async function createCheckoutSession({
  customerId,
  userId,
  tier,
  billingCycle = "monthly",
}: {
  customerId: string;
  userId: string;
  tier: "PRO" | "STUDIO";
  billingCycle?: "monthly" | "yearly";
}) {
  const stripe = getStripe();
  const priceId = getPriceId(tier, billingCycle);

  if (!priceId) {
    throw new Error(`Missing Stripe price ID for ${tier} ${billingCycle}`);
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    subscription_data: {
      metadata: { userId, tier },
    },
  });
}

export async function createPortalSession({
  customerId,
}: {
  customerId: string;
}) {
  const stripe = getStripe();

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });
}
