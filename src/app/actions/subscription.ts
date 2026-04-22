"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";

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

    // Get user with subscription
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

    // Return subscription data or default to free
    const subscription = user.subscription;

    return {
      success: true,
      data: {
        tier: subscription?.tier || "FREE",
        status: subscription?.status || "ACTIVE",
        currentPeriodEnd: subscription?.currentPeriodEnd || new Date(),
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
        credits: user.credits,
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

    // Feature requirements
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

    // Check if user has required tier
    const tierLevels: Record<SubscriptionTier, number> = {
      FREE: 0,
      PRO: 1,
      STUDIO: 2,
    };

    const allowed = tierLevels[currentTier] >= tierLevels[requiredTier];

    return {
      success: true,
      allowed,
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
            generations: true,
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

    // Get current month's generations
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const generationsThisMonth = await prisma.tattooGeneration.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
    });

    // Calculate credits used (total - current)
    const tierLimits: Record<SubscriptionTier, number> = {
      FREE: 5,
      PRO: 50,
      STUDIO: 200,
    };

    const tier = user.subscription?.tier || "FREE";
    const creditsTotal = tierLimits[tier];
    const creditsUsed = creditsTotal - user.credits;

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
