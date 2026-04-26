import { getStripe } from "./config";
import { db as prisma } from "@/lib/db";
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";
import { getTierCreditAllowance, setCreditBalance } from "@/lib/credits/usage";
import Stripe from "stripe";

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

function mapPriceToTier(priceId?: string | null): SubscriptionTier {
  const proPrices = [
    process.env.STRIPE_PRO_PRICE_MONTHLY,
    process.env.STRIPE_PRO_PRICE_YEARLY,
  ].filter(Boolean);
  const studioPrices = [
    process.env.STRIPE_STUDIO_PRICE_MONTHLY,
    process.env.STRIPE_STUDIO_PRICE_YEARLY,
  ].filter(Boolean);

  if (priceId && proPrices.includes(priceId)) return "PRO";
  if (priceId && studioPrices.includes(priceId)) return "STUDIO";
  return "FREE";
}

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

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const priceId = subscription.items.data[0]?.price.id;
  const tier = mapPriceToTier(priceId);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId || "",
      stripeProductId: String(subscription.items.data[0]?.price.product || ""),
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId || "",
      stripeProductId: String(subscription.items.data[0]?.price.product || ""),
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  const credits = getTierCreditAllowance(tier);
  await setCreditBalance(
    userId,
    credits,
    "SUBSCRIPTION_GRANT",
    `Credits reset for ${tier} plan`
  );

  console.log(`Subscription created/updated for user ${userId}, tier: ${tier}`);
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const stripe = getStripe();
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.error(`Subscription not found: ${subscriptionId}`);
    return;
  }

  if (invoice.billing_reason === "subscription_create") {
    return;
  }

  const credits = getTierCreditAllowance(subscription.tier);
  await setCreditBalance(
    subscription.userId,
    credits,
    "SUBSCRIPTION_GRANT",
    `Credits renewed for ${subscription.tier} plan`
  );

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
      stripePriceId: priceId || "",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription updated: ${subscription.id}`);
}

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

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      tier: "FREE",
      stripeSubscriptionId: null,
    },
  });

  await setCreditBalance(
    dbSubscription.userId,
    getTierCreditAllowance("FREE"),
    "ADMIN_ADJUSTMENT",
    "Downgraded to free plan"
  );

  console.log(`Subscription canceled for user ${dbSubscription.userId}`);
}

const processedEvents = new Set<string>();

export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);

  if (processedEvents.size > 1000) {
    const iterator = processedEvents.values();
    const itemsToDelete = processedEvents.size - 1000;

    for (let i = 0; i < itemsToDelete; i += 1) {
      const next = iterator.next();
      if (next.done) {
        break;
      }
      processedEvents.delete(next.value);
    }
  }
}
