import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Plan configurations
export const PLANS = {
  FREE: {
    name: "Free",
    description: "Get started with AI tattoo generation",
    price: 0,
    credits: 3,
    features: [
      "3 free generations",
      "Basic tattoo styles",
      "Standard resolution",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Perfect for tattoo enthusiasts",
    price: 9.99,
    credits: 50,
    features: [
      "50 generations per month",
      "All tattoo styles",
      "High resolution downloads",
      "Try-on feature",
      "Priority generation",
      "Email support",
    ],
  },
  STUDIO: {
    name: "Studio",
    description: "For professional tattoo artists",
    price: 29.99,
    credits: 200,
    features: [
      "200 generations per month",
      "All tattoo styles",
      "4K resolution downloads",
      "Try-on feature",
      "Fastest generation",
      "Commercial license",
      "Priority support",
      "API access",
    ],
  },
} as const;

// Get or create Stripe customer
export async function getOrCreateCustomer({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
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

// Create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  tier,
}: {
  customerId: string;
  priceId: string;
  userId: string;
  tier: string;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    subscription_data: {
      metadata: { userId, tier },
    },
  });
}

// Create customer portal session
export async function createPortalSession({
  customerId,
}: {
  customerId: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });
}
