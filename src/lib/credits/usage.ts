import { db as prisma } from "@/lib/db";
import { SubscriptionTier } from "@prisma/client";

// Credit costs for different operations
export const CREDIT_COSTS = {
  GENERATE_512: 1,
  GENERATE_1024: 2,
  GENERATE_2048: 4,
  TRY_ON_CREATE: 1,
  HD_DOWNLOAD: 1,
} as const;

// Get tier limits
export function getTierLimits(tier: SubscriptionTier) {
  const limits: Record<SubscriptionTier, { generations: number; tryOnProjects: number }> = {
    FREE: { generations: 5, tryOnProjects: 0 },
    PRO: { generations: 50, tryOnProjects: 10 },
    STUDIO: { generations: 200, tryOnProjects: -1 }, // -1 = unlimited
  };
  return limits[tier];
}

// Check if user has enough credits
export async function hasEnoughCredits(
  userId: string,
  cost: number
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user) return false;
  return user.credits >= cost;
}

// Deduct credits from user
export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  try {
    // Check current credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.credits < amount) {
      return { success: false, error: "Insufficient credits" };
    }

    // Deduct credits in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user credits
      const updated = await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } },
        select: { credits: true },
      });

      // Create ledger entry
      await tx.creditLedger.create({
        data: {
          userId,
          amount: -amount,
          balance: updated.credits,
          type: "USAGE",
          description,
        },
      });

      return updated.credits;
    });

    return { success: true, remainingCredits: result };
  } catch (error) {
    console.error("Deduct credits error:", error);
    return { success: false, error: "Failed to deduct credits" };
  }
}

// Get generation cost based on resolution
export function getGenerationCost(resolution: string): number {
  const costs: Record<string, number> = {
    "512x512": CREDIT_COSTS.GENERATE_512,
    "1024x1024": CREDIT_COSTS.GENERATE_1024,
    "2048x2048": CREDIT_COSTS.GENERATE_2048,
  };
  return costs[resolution] || CREDIT_COSTS.GENERATE_512;
}

// Check if user can use try-on feature
export async function canUseTryOn(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentProjects?: number;
  maxProjects?: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      _count: {
        select: { tryOnProjects: true },
      },
    },
  });

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const tier = user.subscription?.tier || "FREE";
  const limits = getTierLimits(tier);

  // Free users can't use try-on
  if (limits.tryOnProjects === 0) {
    return {
      allowed: false,
      reason: "Try-on requires Pro or Studio plan",
      currentProjects: user._count.tryOnProjects,
      maxProjects: 0,
    };
  }

  // Unlimited for Studio
  if (limits.tryOnProjects === -1) {
    return { allowed: true, currentProjects: user._count.tryOnProjects };
  }

  // Check project limit
  if (user._count.tryOnProjects >= limits.tryOnProjects) {
    return {
      allowed: false,
      reason: "Try-on project limit reached",
      currentProjects: user._count.tryOnProjects,
      maxProjects: limits.tryOnProjects,
    };
  }

  return {
    allowed: true,
    currentProjects: user._count.tryOnProjects,
    maxProjects: limits.tryOnProjects,
  };
}

// Check if HD download is allowed
export function canDownloadHD(tier: SubscriptionTier): boolean {
  return tier !== "FREE";
}

// Check if watermark should be applied
export function shouldApplyWatermark(tier: SubscriptionTier): boolean {
  return tier === "FREE";
}

// Get max resolution for tier
export function getMaxResolution(tier: SubscriptionTier): string {
  const resolutions: Record<SubscriptionTier, string> = {
    FREE: "512x512",
    PRO: "1024x1024",
    STUDIO: "2048x2048",
  };
  return resolutions[tier];
}

// Check if priority generation is enabled
export function hasPriorityGeneration(tier: SubscriptionTier): boolean {
  return tier === "STUDIO";
}

// Get credit balance
export async function getCreditBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits || 0;
}
