import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";
import {
  getCreditPackById,
  getPayPalPlanId,
  getPlanPrice,
} from "@/lib/stripe/plans";
import { getPayPalApprovalUrl, paypalRequest } from "@/lib/paypal/client";

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

interface PayPalCreateSubscriptionResponse {
  id: string;
  links?: Array<{ rel: string; href: string }>;
}

interface PayPalCreateOrderResponse {
  id: string;
  links?: Array<{ rel: string; href: string }>;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireDatabaseUser();
    const body = await req.json();
    const payload = checkoutSchema.parse(body);

    if (payload.planId) {
      const paypalPlanId = getPayPalPlanId(payload.planId, payload.billingCycle);
      if (!paypalPlanId) {
        return NextResponse.json(
          { error: "PayPal plan is not configured", code: "PAYPAL_PLAN_NOT_FOUND" },
          { status: 500 }
        );
      }

      if (
        user.subscription &&
        ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscription.status)
      ) {
        return NextResponse.json(
          {
            error:
              user.subscription.paymentProvider === "PAYPAL"
                ? "Changing an active PayPal subscription in place is not enabled yet. Cancel the current PayPal subscription first."
                : "You already have an active Stripe subscription. Use Manage Billing there before starting a PayPal subscription.",
            code: "ACTIVE_SUBSCRIPTION_EXISTS",
          },
          { status: 409 }
        );
      }

      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          provider: "PAYPAL",
          subscriptionId: user.subscription?.id,
          amount: getPlanPrice(
            payload.planId as SubscriptionTier,
            payload.billingCycle
          ),
          currency: "usd",
          status: "PENDING",
          kind: "SUBSCRIPTION",
          description: `${payload.planId} subscription (${payload.billingCycle}) via PayPal`,
        },
      });

      const subscription = await paypalRequest<PayPalCreateSubscriptionResponse>(
        "/v1/billing/subscriptions",
        {
          method: "POST",
          requestId: payment.id,
          body: {
            plan_id: paypalPlanId,
            custom_id: payment.id,
            subscriber: {
              email_address: user.email,
            },
            application_context: {
              brand_name: "Tattoos Lab",
              locale: "en-US",
              shipping_preference: "NO_SHIPPING",
              user_action: "SUBSCRIBE_NOW",
              return_url: `${getAppUrl()}/api/paypal/return/subscription`,
              cancel_url: `${getAppUrl()}/pricing?canceled=true&provider=paypal`,
            },
          },
        }
      );

      const approvalUrl = getPayPalApprovalUrl(subscription.links);
      if (!approvalUrl) {
        throw new Error("PayPal did not return an approval URL for the subscription.");
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paypalSubscriptionId: subscription.id,
        },
      });

      return NextResponse.json({ url: approvalUrl });
    }

    const creditPack = getCreditPackById(payload.creditPackId!);
    if (!creditPack) {
      return NextResponse.json(
        { error: "Credit pack not found", code: "CREDIT_PACK_NOT_FOUND" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        provider: "PAYPAL",
        amount: creditPack.price,
        currency: "usd",
        status: "PENDING",
        kind: "CREDIT_PACK",
        creditsAmount: creditPack.credits,
        description: `${creditPack.name} credit pack via PayPal`,
      },
    });

    const order = await paypalRequest<PayPalCreateOrderResponse>(
      "/v2/checkout/orders",
      {
        method: "POST",
        requestId: payment.id,
        body: {
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: creditPack.id,
              custom_id: payment.id,
              description: `${creditPack.name} for Tattoos Lab`,
              amount: {
                currency_code: "USD",
                value: (creditPack.price / 100).toFixed(2),
              },
            },
          ],
          payment_source: {
            paypal: {
              email_address: user.email,
              experience_context: {
                brand_name: "Tattoos Lab",
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: `${getAppUrl()}/api/paypal/return/order`,
                cancel_url: `${getAppUrl()}/pricing?canceled=true&provider=paypal`,
              },
            },
          },
        },
      }
    );

    const approvalUrl = getPayPalApprovalUrl(order.links);
    if (!approvalUrl) {
      throw new Error("PayPal did not return an approval URL for the order.");
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paypalOrderId: order.id,
      },
    });

    return NextResponse.json({ url: approvalUrl });
  } catch (error) {
    console.error("PayPal checkout error:", error);

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
        error: error instanceof Error ? error.message : "PayPal checkout failed",
        code: "PAYPAL_CHECKOUT_ERROR",
      },
      { status: 500 }
    );
  }
}