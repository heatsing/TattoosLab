import { NextRequest, NextResponse } from "next/server";
import {
  fetchPayPalSubscription,
  syncSubscriptionFromPayPal,
} from "@/lib/paypal/billing";

export async function GET(req: NextRequest) {
  const subscriptionId =
    req.nextUrl.searchParams.get("subscription_id") ||
    req.nextUrl.searchParams.get("token");

  if (!subscriptionId) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?paypal=missing-subscription", req.url)
    );
  }

  try {
    const subscription = await fetchPayPalSubscription(subscriptionId);
    await syncSubscriptionFromPayPal(subscription);

    return NextResponse.redirect(
      new URL("/dashboard/settings?success=true&provider=paypal", req.url)
    );
  } catch (error) {
    console.error("PayPal subscription return error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?paypal=subscription-failed", req.url)
    );
  }
}