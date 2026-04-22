import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/config";
import { getPriceId } from "@/lib/stripe/plans";
import { SubscriptionTier } from "@prisma/client";
import { db as prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId, billingCycle = "monthly" } = body;

    // Validate plan
    if (!planId || !["PRO", "STUDIO"].includes(planId)) {
      return NextResponse.json(
        { error: "Invalid plan", code: "INVALID_PLAN" },
        { status: 400 }
      );
    }

    // Get price ID
    const priceId = getPriceId(planId as SubscriptionTier, billingCycle);
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured", code: "PRICE_NOT_FOUND" },
        { status: 500 }
      );
    }

    // Get or create customer
    let customerId: string;
    
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription?.stripeCustomerId) {
      customerId = existingSubscription.stripeCustomerId;
    } else {
      // Get user details from Clerk
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found", code: "USER_NOT_FOUND" },
          { status: 404 }
        );
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      payment_method_collection: "always",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
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
