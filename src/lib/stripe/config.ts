import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Initialize Stripe lazily so route modules can be imported during build.
export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }

  return stripeClient;
}

export function getWebhookSecret(): string {
  return getRequiredEnv("STRIPE_WEBHOOK_SECRET");
}

// Price IDs from environment variables
export const priceIds = {
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRO_PRICE_YEARLY!,
  },
  studio: {
    monthly: process.env.STRIPE_STUDIO_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_STUDIO_PRICE_YEARLY!,
  },
};

// Product IDs
export const productIds = {
  pro: process.env.STRIPE_PRO_PRODUCT_ID!,
  studio: process.env.STRIPE_STUDIO_PRODUCT_ID!,
};

// Validate configuration on startup
export function validateStripeConfig() {
  const required = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRO_PRICE_MONTHLY",
    "STRIPE_STUDIO_PRICE_MONTHLY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing Stripe environment variables: ${missing.join(", ")}`);
    return false;
  }

  return true;
}
