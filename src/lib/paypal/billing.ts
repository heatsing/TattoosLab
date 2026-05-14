import {
  Payment,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";
import { db as prisma } from "@/lib/db";
import { addCredits, recordUsageLog } from "@/lib/credits/usage";
import { getPlanByPayPalPlanId } from "@/lib/stripe/plans";
import { paypalRequest, type PayPalLink } from "./client";

export interface PayPalName {
  given_name?: string;
  surname?: string;
}

export interface PayPalSubscriber {
  payer_id?: string;
  email_address?: string;
  name?: PayPalName;
}

export interface PayPalSubscriptionResponse {
  id: string;
  status: string;
  plan_id?: string;
  custom_id?: string;
  start_time?: string;
  create_time?: string;
  subscriber?: PayPalSubscriber;
  billing_info?: {
    next_billing_time?: string;
    last_payment?: {
      time?: string;
    };
  };
  links?: PayPalLink[];
}

export interface PayPalCapture {
  id: string;
  status?: string;
  amount?: {
    value?: string;
    currency_code?: string;
  };
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  payer?: {
    payer_id?: string;
    email_address?: string;
  };
  purchase_units?: Array<{
    custom_id?: string;
    reference_id?: string;
    amount?: {
      currency_code?: string;
      value?: string;
    };
    payments?: {
      captures?: PayPalCapture[];
    };
  }>;
  links?: PayPalLink[];
}

export interface PayPalSaleResource {
  id: string;
  state?: string;
  billing_agreement_id?: string;
  amount?: {
    total?: string;
    currency?: string;
  };
}

function mapPayPalSubscriptionStatus(status?: string | null): SubscriptionStatus {
  const normalized = status?.toUpperCase() ?? "";
  const statusMap: Record<string, SubscriptionStatus> = {
    APPROVAL_PENDING: "INCOMPLETE",
    APPROVED: "TRIALING",
    ACTIVE: "ACTIVE",
    SUSPENDED: "PAUSED",
    CANCELLED: "CANCELED",
    EXPIRED: "CANCELED",
  };

  return statusMap[normalized] ?? "INCOMPLETE";
}

function parseDate(value?: string | null, fallback?: Date): Date {
  if (!value) {
    return fallback ?? new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? fallback ?? new Date() : parsed;
}

function amountToCents(value?: string | null): number {
  if (!value) {
    return 0;
  }

  return Math.round(Number(value) * 100);
}

export async function syncUserPayPalPayerId(
  userId: string,
  payerId?: string | null
) {
  if (!payerId) {
    return;
  }

  await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [{ paypalPayerId: null }, { paypalPayerId: payerId }],
    },
    data: {
      paypalPayerId: payerId,
    },
  });
}

export async function resolveUserIdFromPayPalPayerId(
  payerId?: string | null
): Promise<string | null> {
  if (!payerId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { paypalPayerId: payerId },
        { subscription: { paypalPayerId: payerId } },
      ],
    },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function fetchPayPalSubscription(
  subscriptionId: string
): Promise<PayPalSubscriptionResponse> {
  return paypalRequest<PayPalSubscriptionResponse>(
    `/v1/billing/subscriptions/${subscriptionId}`
  );
}

export async function syncSubscriptionFromPayPal(
  subscription: PayPalSubscriptionResponse,
  explicitUserId?: string
) {
  const planMapping = getPlanByPayPalPlanId(subscription.plan_id);
  if (!planMapping) {
    throw new Error(
      `Unable to map PayPal plan ${subscription.plan_id ?? "unknown"} to a local plan.`
    );
  }

  const payment = subscription.custom_id
    ? await prisma.payment.findUnique({
        where: { id: subscription.custom_id },
      })
    : null;

  const userId =
    explicitUserId ||
    payment?.userId ||
    (await resolveUserIdFromPayPalPayerId(subscription.subscriber?.payer_id));

  if (!userId) {
    throw new Error("Unable to resolve user for PayPal subscription.");
  }

  await syncUserPayPalPayerId(userId, subscription.subscriber?.payer_id);

  const currentPeriodStart = parseDate(
    subscription.billing_info?.last_payment?.time ||
      subscription.start_time ||
      subscription.create_time,
    new Date()
  );
  const currentPeriodEnd = parseDate(
    subscription.billing_info?.next_billing_time,
    currentPeriodStart
  );

  const dbSubscription = await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      paymentProvider: "PAYPAL",
      paypalSubscriptionId: subscription.id,
      paypalPlanId: subscription.plan_id,
      paypalPayerId: subscription.subscriber?.payer_id,
      billingCycle:
        planMapping.billingCycle === "yearly" ? "YEARLY" : "MONTHLY",
      status: mapPayPalSubscriptionStatus(subscription.status),
      tier: planMapping.plan.id,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
    update: {
      paymentProvider: "PAYPAL",
      paypalSubscriptionId: subscription.id,
      paypalPlanId: subscription.plan_id,
      paypalPayerId: subscription.subscriber?.payer_id,
      billingCycle:
        planMapping.billingCycle === "yearly" ? "YEARLY" : "MONTHLY",
      status: mapPayPalSubscriptionStatus(subscription.status),
      tier: planMapping.plan.id,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
  });

  if (payment && payment.status === "PENDING") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        provider: "PAYPAL",
        subscriptionId: dbSubscription.id,
        paypalSubscriptionId: subscription.id,
        paypalPayerId: subscription.subscriber?.payer_id,
      },
    });

    await recordUsageLog(prisma, {
      userId,
      action: "SUBSCRIPTION_CHECKOUT",
      units: 1,
      metadata: {
        provider: "PAYPAL",
        subscriptionId: subscription.id,
        tier: planMapping.plan.id,
      },
    });
  }

  return dbSubscription;
}

export async function captureApprovedPayPalOrder(orderId: string) {
  const existingOrder = await paypalRequest<PayPalOrderResponse>(
    `/v2/checkout/orders/${orderId}`
  );

  const order =
    existingOrder.status === "COMPLETED"
      ? existingOrder
      : await paypalRequest<PayPalOrderResponse>(
          `/v2/checkout/orders/${orderId}/capture`,
          {
            method: "POST",
            requestId: orderId,
          }
        );

  const purchaseUnit = order.purchase_units?.[0];
  const paymentId = purchaseUnit?.custom_id;
  const capture = purchaseUnit?.payments?.captures?.[0];

  if (!paymentId) {
    throw new Error("PayPal order is missing the local payment id.");
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Unable to find local payment for PayPal order.");
  }

  if (payment.status === "SUCCEEDED") {
    return payment;
  }

  await syncUserPayPalPayerId(payment.userId, order.payer?.payer_id);

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      provider: "PAYPAL",
      status: "SUCCEEDED",
      paypalOrderId: order.id,
      paypalCaptureId: capture?.id,
      paypalPayerId: order.payer?.payer_id,
      amount:
        payment.amount || amountToCents(purchaseUnit?.amount?.value) || payment.amount,
      currency:
        purchaseUnit?.amount?.currency_code?.toLowerCase() || payment.currency,
    },
  });

  if (updatedPayment.creditsAmount > 0) {
    await addCredits(
      updatedPayment.userId,
      updatedPayment.creditsAmount,
      "PURCHASE",
      `Purchased ${updatedPayment.creditsAmount} credits with PayPal`,
      { paymentId: updatedPayment.id }
    );
  }

  await recordUsageLog(prisma, {
    userId: updatedPayment.userId,
    action: "CREDIT_PURCHASE",
    units: updatedPayment.creditsAmount,
    metadata: {
      provider: "PAYPAL",
      paypalOrderId: order.id,
      paypalCaptureId: capture?.id,
    },
  });

  return updatedPayment;
}

export async function handlePayPalSaleCompleted(resource: PayPalSaleResource) {
  const subscriptionId = resource.billing_agreement_id;
  if (!subscriptionId) {
    return;
  }

  const subscription =
    (await prisma.subscription.findUnique({
      where: { paypalSubscriptionId: subscriptionId },
    })) ??
    (await syncSubscriptionFromPayPal(await fetchPayPalSubscription(subscriptionId)));

  const existingPendingPayment = await prisma.payment.findFirst({
    where: {
      provider: "PAYPAL",
      paypalSubscriptionId: subscriptionId,
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
  });

  const amount = amountToCents(resource.amount?.total);
  const currency = resource.amount?.currency?.toLowerCase() ?? "usd";

  if (existingPendingPayment) {
    await prisma.payment.update({
      where: { id: existingPendingPayment.id },
      data: {
        status: "SUCCEEDED",
        provider: "PAYPAL",
        subscriptionId: subscription.id,
        paypalSubscriptionId: subscriptionId,
        paypalCaptureId: resource.id,
        amount,
        currency,
      },
    });

    return;
  }

  await prisma.payment.upsert({
    where: { paypalCaptureId: resource.id },
    create: {
      userId: subscription.userId,
      provider: "PAYPAL",
      subscriptionId: subscription.id,
      amount,
      currency,
      status: "SUCCEEDED",
      kind: "SUBSCRIPTION",
      description: `PayPal subscription payment for ${subscription.tier}`,
      paypalSubscriptionId: subscriptionId,
      paypalCaptureId: resource.id,
    },
    update: {
      subscriptionId: subscription.id,
      amount,
      currency,
      status: "SUCCEEDED",
    },
  });
}

export async function handlePayPalSaleDenied(resource: PayPalSaleResource) {
  const subscriptionId = resource.billing_agreement_id;
  if (!subscriptionId) {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    return;
  }

  const pendingPayment = await prisma.payment.findFirst({
    where: {
      provider: "PAYPAL",
      paypalSubscriptionId: subscriptionId,
      status: "PENDING",
    },
    orderBy: { createdAt: "asc" },
  });

  if (pendingPayment) {
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        status: "FAILED",
        paypalCaptureId: resource.id,
      },
    });

    return;
  }

  await prisma.payment.upsert({
    where: { paypalCaptureId: resource.id },
    create: {
      userId: subscription.userId,
      provider: "PAYPAL",
      subscriptionId: subscription.id,
      amount: amountToCents(resource.amount?.total),
      currency: resource.amount?.currency?.toLowerCase() ?? "usd",
      status: "FAILED",
      kind: "SUBSCRIPTION",
      description: "Failed PayPal subscription payment",
      paypalSubscriptionId: subscriptionId,
      paypalCaptureId: resource.id,
    },
    update: {
      status: "FAILED",
    },
  });
}