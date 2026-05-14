import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import {
  AuthSessionError,
  requireDatabaseUser,
} from "@/lib/auth/ensure-user";
import { paypalRequest } from "@/lib/paypal/client";

export async function POST(_req: NextRequest) {
  try {
    const user = await requireDatabaseUser();

    if (
      user.subscription?.paymentProvider !== "PAYPAL" ||
      !user.subscription.paypalSubscriptionId
    ) {
      return NextResponse.json(
        { error: "No active PayPal subscription found", code: "NO_PAYPAL_SUBSCRIPTION" },
        { status: 404 }
      );
    }

    await paypalRequest(
      `/v1/billing/subscriptions/${user.subscription.paypalSubscriptionId}/cancel`,
      {
        method: "POST",
        body: {
          reason: "Canceled by customer from Tattoos Lab settings.",
        },
      }
    );

    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel PayPal subscription error:", error);

    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to cancel PayPal subscription",
        code: "PAYPAL_CANCEL_ERROR",
      },
      { status: 500 }
    );
  }
}