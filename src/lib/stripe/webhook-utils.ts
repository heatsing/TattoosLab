import { getStripe } from "./config";
import { db as prisma } from "@/lib/db";
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

// Map Stripe subscription status to our enum
function mapSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    past_due: "PAST_DUE",
    paused: "PAUSED",
    trialing: "TRIALING",
    unpaid: "UNPAID",
  };
  return statusMap[status] || "INCOMPLETE";
}

// Map Stripe price to subscription tier
function mapPriceToTier(priceId: string): SubscriptionTier {
  const proPrices = [
    process.env.STRIPE_PRO_PRICE_MONTHLY,
    process.env.STRIPE_PRO_PRICE_YEARLY,
  ];
  const studioPrices = [
    process.env.STRIPE_STUDIO_PRICE_MONTHLY,
    process.env.STRIPE_STUDIO_PRICE_YEARLY,
  ];

  if (proPrices.includes(priceId)) return "PRO";
  if (studioPrices.includes(priceId)) return "STUDIO";
  return "FREE";
}

// Handle checkout.session.completed
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const stripe = getStripe();
  const customerId = session.customer as string;
  const userId = session.client_reference_id;

  if (!userId) {
    console.error("No userId in session client_reference_id");
    return;
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const priceId = subscription.items.data[0]?.price.id;
  const tier = mapPriceToTier(priceId);

  // Calculate credits based on tier
  const creditsMap: Record<SubscriptionTier, number> = {
    FREE: 5,
    PRO: 50,
    STUDIO: 200,
  };

  // Upsert subscription
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: subscription.items.data[0]?.price.product as string,
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: subscription.items.data[0]?.price.product as string,
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  // Update user credits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { set: creditsMap[tier] } },
  });

  // Create credit ledger entry
  await prisma.creditLedger.create({
    data: {
      userId,
      amount: creditsMap[tier],
      balance: creditsMap[tier],
      type: "SUBSCRIPTION_GRANT",
      description: `Monthly credits for ${tier} plan`,
    },
  });

  console.log(`Subscription created/updated for user ${userId}, tier: ${tier}`);
}

// Handle invoice.payment_succeeded (recurring payments)
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const stripe = getStripe();
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) return;

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  // Only process recurring payments (not initial)
  if (invoice.billing_reason === "subscription_create") {
    return;
  }

  const creditsMap: Record<SubscriptionTier, number> = {
    FREE: 5,
    PRO: 50,
    STUDIO: 200,
  };

  const credits = creditsMap[subscription.tier];

  // Update user credits
  await prisma.user.update({
    where: { id: subscription.userId },
    data: { credits: { set: credits } },
  });

  // Create credit ledger entry
  await prisma.creditLedger.create({
    data: {
      userId: subscription.userId,
      amount: credits,
      balance: credits,
      type: "SUBSCRIPTION_GRANT",
      description: `Monthly credits renewal for ${subscription.tier} plan`,
    },
  });

  // Update subscription period
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      status: mapSubscriptionStatus(stripeSubscription.status),
    },
  });

  console.log(`Credits renewed for user ${subscription.userId}`);
}

// Handle customer.subscription.updated
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const tier = mapPriceToTier(priceId);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: mapSubscriptionStatus(subscription.status),
      tier,
      stripePriceId: priceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription updated: ${subscription.id}`);
}

// Handle customer.subscription.deleted
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    console.error(`Subscription not found: ${subscription.id}`);
    return;
  }

  // Downgrade to free
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      tier: "FREE",
      stripeSubscriptionId: null,
    },
  });

  // Reset credits to free tier
  await prisma.user.update({
    where: { id: dbSubscription.userId },
    data: { credits: 5 },
  });

  console.log(`Subscription canceled for user ${dbSubscription.userId}`);
}

// Idempotency check - prevent duplicate processing
const processedEvents = new Set<string>();

export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);
  // Clean up old events (keep last 1000)
  if (processedEvents.size > 1000) {
    const iterator = processedEvents.values();
    for (let i = 0; i < processedEvents.size - 1000; i++) {
      processedEvents.delete(iterator.next().value);
    }
  }
}
