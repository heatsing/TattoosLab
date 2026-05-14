import { NextRequest, NextResponse } from "next/server";
import { captureApprovedPayPalOrder } from "@/lib/paypal/billing";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?paypal=missing-order", req.url)
    );
  }

  try {
    await captureApprovedPayPalOrder(orderId);
    return NextResponse.redirect(
      new URL("/dashboard/settings?success=true&provider=paypal&credits=true", req.url)
    );
  } catch (error) {
    console.error("PayPal order return error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?paypal=order-failed", req.url)
    );
  }
}