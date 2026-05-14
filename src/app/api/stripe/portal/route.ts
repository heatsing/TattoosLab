import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/config";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";
import { db as prisma } from "@/lib/db";

async function getCustomerId(user: Awaited<ReturnType<typeof requireDatabaseUser>>) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
    select: {
      stripeCustomerId: true,
    },
  });

  if (subscription?.stripeCustomerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: subscription.stripeCustomerId,
      },
    });
  }

  return subscription?.stripeCustomerId ?? null;
}

export async function POST(_req: NextRequest) {
  try {
    const user = await requireDatabaseUser();
    if (user.subscription?.paymentProvider === "PAYPAL") {
      return NextResponse.json(
        {
          error: "PayPal subscriptions are managed directly inside Tattoos Lab settings.",
          code: "PAYPAL_PORTAL_UNAVAILABLE",
        },
        { status: 400 }
      );
    }

    const customerId = await getCustomerId(user);

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing profile found", code: "NO_CUSTOMER" },
        { status: 404 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing portal error:", error);

    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create portal session",
        code: "PORTAL_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}