import Stripe from "stripe";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import { addCredits, recordUsageLog } from "@/lib/credits/usage";
import {
  getCreditPackById,
  getCreditPackByPriceId,
  getPlanByPriceId,
} from "@/lib/stripe/plans";
import { getStripe } from "./config";

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

function getTierFromPriceId(priceId?: string | null): SubscriptionTier {
  return getPlanByPriceId(priceId)?.id ?? "FREE";
}

async function syncUserStripeCustomerId(userId: string, customerId?: string | null) {
  if (!customerId) {
    return;
  }

  await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [
        { stripeCustomerId: null },
        { stripeCustomerId: customerId },
      ],
    },
    data: {
      stripeCustomerId: customerId,
    },
  });
}

async function resolveUserIdFromStripeCustomer(customerId?: string | null) {
  if (!customerId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { stripeCustomerId: customerId },
        { subscription: { stripeCustomerId: customerId } },
      ],
    },
    select: { id: true },
  });

  return user?.id ?? null;
}

async function upsertSubscriptionFromStripe(
  userId: string,
  customerId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const price = subscription.items.data[0]?.price;
  const tier = getTierFromPriceId(priceId);

  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      paymentProvider: "STRIPE",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: typeof price?.product === "string" ? price.product : null,
      billingCycle:
        price?.recurring?.interval === "year" ? "YEARLY" : "MONTHLY",
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      paymentProvider: "STRIPE",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeProductId: typeof price?.product === "string" ? price.product : null,
      billingCycle:
        price?.recurring?.interval === "year" ? "YEARLY" : "MONTHLY",
      status: mapSubscriptionStatus(subscription.status),
      tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const stripe = getStripe();
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const userId = session.client_reference_id || session.metadata?.userId;
  const paymentId = session.metadata?.paymentId;
  const checkoutType = session.metadata?.checkoutType;

  if (!userId || !customerId) {
    throw new Error("Checkout session is missing user or customer context.");
  }

  await syncUserStripeCustomerId(userId, customerId);

  if (checkoutType === "credit_pack" || session.mode === "payment") {
    const creditPack =
      getCreditPackById(
        session.metadata?.creditPackId as "CREDIT_PACK_50" | "CREDIT_PACK_120"
      ) ?? undefined;

    if (!creditPack) {
      throw new Error("Unable to resolve purchased credit pack.");
    }

    const payment = paymentId
      ? await prisma.payment.update({
          where: { id: paymentId },
          data: {
            provider: "STRIPE",
            status: "SUCCEEDED",
            amount: session.amount_total ?? creditPack.price,
            creditsAmount: creditPack.credits,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        })
      : await prisma.payment.create({
          data: {
            userId,
            provider: "STRIPE",
            amount: session.amount_total ?? creditPack.price,
            currency: session.currency ?? "usd",
            status: "SUCCEEDED",
            kind: "CREDIT_PACK",
            creditsAmount: creditPack.credits,
            description: `${creditPack.name} credit pack`,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        });

    await addCredits(
      userId,
      creditPack.credits,
      "PURCHASE",
      `Purchased ${creditPack.name}`,
      { paymentId: payment.id }
    );

    await recordUsageLog(prisma, {
      userId,
      action: "CREDIT_PURCHASE",
      units: creditPack.credits,
      metadata: {
        creditPackId: creditPack.id,
        paymentId: payment.id,
      },
    });

    return;
  }

  const subscriptionId = session.subscription;
  if (typeof subscriptionId !== "string") {
    throw new Error("Subscription checkout completed without a subscription id.");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const dbSubscription = await upsertSubscriptionFromStripe(
    userId,
    customerId,
    stripeSubscription
  );

  if (paymentId) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "SUCCEEDED",
        provider: "STRIPE",
        subscriptionId: dbSubscription.id,
        stripeCheckoutSessionId: session.id,
        stripeInvoiceId:
          typeof session.invoice === "string" ? session.invoice : null,
      },
    });
  }

  await recordUsageLog(prisma, {
    userId,
    action: "SUBSCRIPTION_CHECKOUT",
    units: 1,
    metadata: {
      subscriptionId: stripeSubscription.id,
      tier: dbSubscription.tier,
      priceId: dbSubscription.stripePriceId,
    },
  });
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const stripe = getStripe();
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  const subscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : null;

  if (!customerId || !subscriptionId) {
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId =
    stripeSubscription.metadata.userId ||
    (await resolveUserIdFromStripeCustomer(customerId));

  if (!userId) {
    throw new Error("Unable to resolve user for invoice payment.");
  }

  await syncUserStripeCustomerId(userId, customerId);
  const dbSubscription = await upsertSubscriptionFromStripe(
    userId,
    customerId,
    stripeSubscription
  );

  await prisma.payment.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      userId,
      provider: "STRIPE",
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_paid || invoice.amount_due || 0,
      currency: invoice.currency ?? "usd",
      status: "SUCCEEDED",
      kind: "SUBSCRIPTION",
      description: `Subscription invoice for ${dbSubscription.tier}`,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId:
        typeof invoice.payment_intent === "string" ? invoice.payment_intent : null,
    },
    update: {
      provider: "STRIPE",
      subscriptionId: dbSubscription.id,
      amount: invoice.amount_paid || invoice.amount_due || 0,
      currency: invoice.currency ?? "usd",
      status: "SUCCEEDED",
      stripePaymentIntentId:
        typeof invoice.payment_intent === "string" ? invoice.payment_intent : null,
    },
  });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  const subscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : null;

  const userId = await resolveUserIdFromStripeCustomer(customerId);
  if (!userId) {
    return;
  }

  let dbSubscriptionId: string | undefined;
  if (subscriptionId) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { id: true },
    });
    dbSubscriptionId = subscription?.id;
  }

  await prisma.payment.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      userId,
      provider: "STRIPE",
      subscriptionId: dbSubscriptionId,
      amount: invoice.amount_due || 0,
      currency: invoice.currency ?? "usd",
      status: "FAILED",
      kind: "SUBSCRIPTION",
      description: "Failed subscription invoice",
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId:
        typeof invoice.payment_intent === "string" ? invoice.payment_intent : null,
    },
    update: {
      provider: "STRIPE",
      subscriptionId: dbSubscriptionId,
      amount: invoice.amount_due || 0,
      currency: invoice.currency ?? "usd",
      status: "FAILED",
      stripePaymentIntentId:
        typeof invoice.payment_intent === "string" ? invoice.payment_intent : null,
    },
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    throw new Error("Subscription is missing a Stripe customer id.");
  }

  const userId =
    subscription.metadata.userId ||
    (await resolveUserIdFromStripeCustomer(customerId));

  if (!userId) {
    throw new Error("Unable to resolve user for subscription update.");
  }

  await syncUserStripeCustomerId(userId, customerId);
  await upsertSubscriptionFromStripe(userId, customerId, subscription);
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!existing) {
    return;
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      tier: "FREE",
      paymentProvider: "STRIPE",
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeProductId: null,
    },
  });
}