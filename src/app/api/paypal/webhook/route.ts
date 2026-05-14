import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { verifyPayPalWebhookSignature } from "@/lib/paypal/client";
import {
  captureApprovedPayPalOrder,
  fetchPayPalSubscription,
  handlePayPalSaleCompleted,
  handlePayPalSaleDenied,
  syncSubscriptionFromPayPal,
  type PayPalSaleResource,
} from "@/lib/paypal/billing";

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource?: Record<string, unknown>;
}

async function beginWebhookProcessing(event: PayPalWebhookEvent) {
  const existing = await prisma.payPalWebhookEvent.findUnique({
    where: { id: event.id },
  });

  if (existing?.status === "PROCESSED") {
    return { alreadyProcessed: true };
  }

  if (existing) {
    await prisma.payPalWebhookEvent.update({
      where: { id: event.id },
      data: {
        type: event.event_type,
        status: "PROCESSING",
        error: null,
        attempts: { increment: 1 },
        processedAt: new Date(),
      },
    });
  } else {
    await prisma.payPalWebhookEvent.create({
      data: {
        id: event.id,
        type: event.event_type,
        status: "PROCESSING",
        processedAt: new Date(),
      },
    });
  }

  return { alreadyProcessed: false };
}

async function markProcessed(eventId: string) {
  await prisma.payPalWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: "PROCESSED",
      error: null,
      processedAt: new Date(),
    },
  });
}

async function markFailed(eventId: string, error: unknown) {
  await prisma.payPalWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown PayPal webhook error",
      processedAt: new Date(),
    },
  });
}

export async function POST(req: NextRequest) {
  const event = (await req.json()) as PayPalWebhookEvent;

  try {
    const isValid = await verifyPayPalWebhookSignature(req.headers, event);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature", code: "INVALID_SIGNATURE" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PayPal webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Signature verification failed", code: "INVALID_SIGNATURE" },
      { status: 400 }
    );
  }

  const processingState = await beginWebhookProcessing(event);
  if (processingState.alreadyProcessed) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  try {
    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED": {
        const orderId = String(event.resource?.id || "");
        if (orderId) {
          await captureApprovedPayPalOrder(orderId);
        }
        break;
      }
      case "BILLING.SUBSCRIPTION.CREATED":
      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.UPDATED":
      case "BILLING.SUBSCRIPTION.RE-ACTIVATED":
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscriptionId = String(event.resource?.id || "");
        if (subscriptionId) {
          const subscription = await fetchPayPalSubscription(subscriptionId);
          await syncSubscriptionFromPayPal(subscription);
        }
        break;
      }
      case "PAYMENT.SALE.COMPLETED":
        if (event.resource) {
          await handlePayPalSaleCompleted(event.resource as unknown as PayPalSaleResource);
        }
        break;
      case "PAYMENT.SALE.DENIED":
      case "PAYMENT.SALE.REFUNDED":
      case "PAYMENT.SALE.REVERSED":
        if (event.resource) {
          await handlePayPalSaleDenied(event.resource as unknown as PayPalSaleResource);
        }
        break;
      default:
        break;
    }

    await markProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`PayPal webhook handler error for ${event.event_type}:`, error);
    await markFailed(event.id, error);
    return NextResponse.json(
      { error: "Webhook handler failed", code: "HANDLER_ERROR" },
      { status: 500 }
    );
  }
}