"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";
import {
  getCreditBalance,
  getTierCreditAllowance,
} from "@/lib/credits/usage";

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  credits: number;
}

export async function getCurrentSubscription(): Promise<{
  success: boolean;
  data?: SubscriptionData;
  error?: { code: string; message: string };
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      };
    }

    const subscription = user.subscription;
    const credits = await getCreditBalance(userId);

    return {
      success: true,
      data: {
        tier: subscription?.tier || "FREE",
        status: subscription?.status || "ACTIVE",
        currentPeriodEnd: subscription?.currentPeriodEnd || new Date(),
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
        credits,
      },
    };
  } catch (error) {
    console.error("Get subscription error:", error);
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
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        allowed: false,
        currentTier: "FREE",
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return {
        success: false,
        allowed: false,
        currentTier: "FREE",
        error: { code: "NOT_FOUND", message: "User not found" },
      };
    }

    const currentTier = user.subscription?.tier || "FREE";

    const featureRequirements: Record<string, SubscriptionTier> = {
      tryOn: "PRO",
      hdDownload: "PRO",
      noWatermark: "PRO",
      priorityGeneration: "STUDIO",
      commercialUse: "STUDIO",
      apiAccess: "STUDIO",
      unlimitedTryOn: "STUDIO",
    };

    const requiredTier = featureRequirements[feature];

    if (!requiredTier) {
      return { success: true, allowed: true, currentTier };
    }

    const tierLevels: Record<SubscriptionTier, number> = {
      FREE: 0,
      PRO: 1,
      STUDIO: 2,
    };

    return {
      success: true,
      allowed: tierLevels[currentTier] >= tierLevels[requiredTier],
      currentTier,
      requiredTier,
    };
  } catch (error) {
    console.error("Check feature access error:", error);
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
  };
  error?: { code: string; message: string };
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        _count: {
          select: {
            tryOnProjects: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      };
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const generationsThisMonth = await prisma.tattooGeneration.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    const tier = user.subscription?.tier || "FREE";
    const creditsTotal = getTierCreditAllowance(tier);
    const creditsRemaining = await getCreditBalance(userId);
    const creditsUsed = Math.max(0, creditsTotal - creditsRemaining);

    return {
      success: true,
      data: {
        creditsUsed,
        creditsTotal,
        generationsThisMonth,
        tryOnProjects: user._count.tryOnProjects,
      },
    };
  } catch (error) {
    console.error("Get usage stats error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch usage stats" },
    };
  }
}
