import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, getWebhookSecret } from "@/lib/stripe/config";
import { db as prisma } from "@/lib/db";
import {
  handleCheckoutCompleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/stripe/webhook-utils";

async function beginWebhookProcessing(event: Stripe.Event) {
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { id: event.id },
  });

  if (existing?.status === "PROCESSED") {
    return { alreadyProcessed: true };
  }

  if (existing) {
    await prisma.stripeWebhookEvent.update({
      where: { id: event.id },
      data: {
        type: event.type,
        status: "PROCESSING",
        error: null,
        attempts: {
          increment: 1,
        },
        processedAt: new Date(),
      },
    });
  } else {
    await prisma.stripeWebhookEvent.create({
      data: {
        id: event.id,
        type: event.type,
        status: "PROCESSING",
        processedAt: new Date(),
      },
    });
  }

  return { alreadyProcessed: false };
}

async function markWebhookProcessed(event: Stripe.Event) {
  await prisma.stripeWebhookEvent.update({
    where: { id: event.id },
    data: {
      status: "PROCESSED",
      error: null,
      processedAt: new Date(),
    },
  });
}

async function markWebhookFailed(event: Stripe.Event, error: unknown) {
  await prisma.stripeWebhookEvent.update({
    where: { id: event.id },
    data: {
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown webhook error",
      processedAt: new Date(),
    },
  });
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getWebhookSecret()
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature", code: "INVALID_SIGNATURE" },
      { status: 400 }
    );
  }

  const processingState = await beginWebhookProcessing(event);
  if (processingState.alreadyProcessed) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    await markWebhookProcessed(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook handler error for ${event.type}:`, error);
    await markWebhookFailed(event, error);
    return NextResponse.json(
      { error: "Webhook handler failed", code: "HANDLER_ERROR" },
      { status: 500 }
    );
  }
}