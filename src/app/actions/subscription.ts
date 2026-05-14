"use server";

import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";
import {
  BillingAccessError,
  getFeatureRequiredTier,
  getUserBillingState,
  hasFeatureAccess,
} from "@/lib/credits/usage";
import {
  AuthSessionError,
  ensureDatabaseUser,
  requireAuthenticatedUserId,
} from "@/lib/auth/ensure-user";
import { db as prisma } from "@/lib/db";

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  credits: number;
  provider: "STRIPE" | "PAYPAL" | null;
  generationMode: "CREDITS" | "UNLIMITED";
  fairUsageLimit: number | null;
  fairUsageUsed: number;
  fairUsageRemaining: number | null;
}

export async function getCurrentSubscription(): Promise<{
  success: boolean;
  data?: SubscriptionData;
  error?: { code: string; message: string };
}> {
  try {
    const user = await ensureDatabaseUser();
    const billingState = await getUserBillingState(user.id);
    const subscription = user.subscription;

    return {
      success: true,
      data: {
        tier: billingState.tier,
        status: subscription?.status || "ACTIVE",
        currentPeriodEnd: subscription?.currentPeriodEnd || new Date(),
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
        credits: billingState.creditBalance,
        provider: subscription?.paymentProvider ?? null,
        generationMode: billingState.generationMode,
        fairUsageLimit: billingState.plan.limits.fairUsageMonthly,
        fairUsageUsed: billingState.usageConsumed,
        fairUsageRemaining: billingState.usageRemaining,
      },
    };
  } catch (error) {
    console.error("Get subscription error:", error);
    if (error instanceof AuthSessionError || error instanceof BillingAccessError) {
      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch subscription" },
    };
  }
}

export async function checkFeatureAccess(feature: string): Promise<{
  success: boolean;
  allowed: boolean;
  currentTier: SubscriptionTier;
  requiredTier?: SubscriptionTier;
  error?: { code: string; message: string };
}> {
  try {
    const userId = await requireAuthenticatedUserId();
    const state = await getUserBillingState(userId);
    const normalizedFeature = feature as Parameters<typeof hasFeatureAccess>[1];
    const requiredTier = getFeatureRequiredTier(normalizedFeature);

    return {
      success: true,
      allowed: requiredTier ? hasFeatureAccess(state, normalizedFeature) : true,
      currentTier: state.tier,
      requiredTier,
    };
  } catch (error) {
    console.error("Check feature access error:", error);
    if (error instanceof AuthSessionError || error instanceof BillingAccessError) {
      return {
        success: false,
        allowed: false,
        currentTier: "FREE",
        error: { code: error.code, message: error.message },
      };
    }

    return {
      success: false,
      allowed: false,
      currentTier: "FREE",
      error: { code: "INTERNAL_ERROR", message: "Failed to check access" },
    };
  }
}

export async function getUsageStats(): Promise<{
  success: boolean;
  data?: {
    creditsUsed: number;
    creditsTotal: number;
    generationsThisMonth: number;
    tryOnProjects: number;
    generationMode: "CREDITS" | "UNLIMITED";
    remainingCredits: number;
  };
  error?: { code: string; message: string };
}> {
  try {
    const user = await ensureDatabaseUser();
    const billingState = await getUserBillingState(user.id);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [generationsThisMonth, tryOnProjects] = await Promise.all([
      prisma.tattooGeneration.count({
        where: {
          userId: user.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.tryOnProject.count({
        where: { userId: user.id },
      }),
    ]);

    return {
      success: true,
      data: {
        creditsUsed: billingState.usageConsumed,
        creditsTotal: billingState.usageCap,
        generationsThisMonth,
        tryOnProjects,
        generationMode: billingState.generationMode,
        remainingCredits: billingState.creditBalance,
      },
    };
  } catch (error) {
    console.error("Get usage stats error:", error);
    if (error instanceof AuthSessionError || error instanceof BillingAccessError) {
      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch usage stats" },
    };
  }
}