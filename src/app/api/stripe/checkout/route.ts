import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { getStripe } from "@/lib/stripe/config";
import {
  getCreditPackById,
  getCreditPackPriceId,
  getPlanPrice,
  getPriceId,
} from "@/lib/stripe/plans";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";
import { db as prisma } from "@/lib/db";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<SubscriptionStatus>([
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
]);

const checkoutSchema = z
  .object({
    planId: z.enum(["PRO", "STUDIO"]).optional(),
    billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
    creditPackId: z.enum(["CREDIT_PACK_50", "CREDIT_PACK_120"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (!!value.planId === !!value.creditPackId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either a subscription plan or a credit pack.",
      });
    }
  });

async function getOrCreateStripeCustomer(user: Awaited<ReturnType<typeof requireDatabaseUser>>) {
  const stripe = getStripe();

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: {
      userId: user.id,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireDatabaseUser();
    const stripe = getStripe();
    const body = await req.json();
    const payload = checkoutSchema.parse(body);
    const customerId = await getOrCreateStripeCustomer(user);

    if (payload.planId) {
      if (
        user.subscription &&
        ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscription.status)
      ) {
        return NextResponse.json(
          {
            error:
              user.subscription.paymentProvider === "PAYPAL"
                ? "You already have an active PayPal subscription. Cancel it first before starting a Stripe subscription."
                : "You already have an active Stripe subscription. Use Manage Billing to change or cancel it.",
            code: "ACTIVE_SUBSCRIPTION_EXISTS",
          },
          { status: 409 }
        );
      }

      const priceId = getPriceId(payload.planId, payload.billingCycle);
      if (!priceId) {
        return NextResponse.json(
          { error: "Price not configured", code: "PRICE_NOT_FOUND" },
          { status: 500 }
        );
      }

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          provider: "STRIPE",
          subscriptionId: user.subscription?.id,
          amount: getPlanPrice(payload.planId as SubscriptionTier, payload.billingCycle),
          currency: "usd",
          status: "PENDING",
          kind: "SUBSCRIPTION",
          description: `${payload.planId} subscription (${payload.billingCycle})`,
        },
      });

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        payment_method_collection: "always",
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
          checkoutType: "subscription",
          planId: payload.planId,
          billingCycle: payload.billingCycle,
          paymentId: payment.id,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            checkoutType: "subscription",
            planId: payload.planId,
            billingCycle: payload.billingCycle,
            paymentId: payment.id,
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripeCheckoutSessionId: session.id,
        },
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    const creditPack = getCreditPackById(payload.creditPackId!);
    const priceId = getCreditPackPriceId(payload.creditPackId!);

    if (!creditPack || !priceId) {
      return NextResponse.json(
        { error: "Credit pack not configured", code: "PRICE_NOT_FOUND" },
        { status: 500 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        provider: "STRIPE",
        amount: creditPack.price,
        currency: "usd",
        status: "PENDING",
        kind: "CREDIT_PACK",
        creditsAmount: creditPack.credits,
        description: `${creditPack.name} credit pack`,
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      billing_address_collection: "auto",
      payment_intent_data: {
        metadata: {
          userId: user.id,
          checkoutType: "credit_pack",
          creditPackId: creditPack.id,
          paymentId: payment.id,
          credits: String(creditPack.credits),
        },
      },
      metadata: {
        userId: user.id,
        checkoutType: "credit_pack",
        creditPackId: creditPack.id,
        paymentId: payment.id,
        credits: String(creditPack.credits),
      },
      client_reference_id: user.id,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true&credits=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid checkout request",
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        code: "CHECKOUT_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}