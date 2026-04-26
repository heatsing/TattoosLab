import {
  CreditTransactionType,
  Prisma,
  PrismaClient,
  SubscriptionTier,
} from "@prisma/client";
import { db as prisma } from "@/lib/db";

type DbClient = PrismaClient | Prisma.TransactionClient;

// Credit costs for different operations
export const CREDIT_COSTS = {
  GENERATE_512: 1,
  GENERATE_1024: 2,
  GENERATE_2048: 4,
  TRY_ON_CREATE: 1,
  HD_DOWNLOAD: 1,
} as const;

const TIER_CREDIT_ALLOWANCES: Record<SubscriptionTier, number> = {
  FREE: 5,
  PRO: 50,
  STUDIO: 200,
};

const TIER_LIMITS: Record<
  SubscriptionTier,
  { generations: number; tryOnProjects: number }
> = {
  FREE: { generations: 5, tryOnProjects: 0 },
  PRO: { generations: 50, tryOnProjects: 10 },
  STUDIO: { generations: 200, tryOnProjects: -1 },
};

export function getTierLimits(tier: SubscriptionTier) {
  return TIER_LIMITS[tier];
}

export function getTierCreditAllowance(tier: SubscriptionTier): number {
  return TIER_CREDIT_ALLOWANCES[tier];
}

async function getSubscriptionTier(
  userId: string,
  client: DbClient = prisma
): Promise<SubscriptionTier> {
  const subscription = await client.subscription.findUnique({
    where: { userId },
    select: { tier: true },
  });

  return subscription?.tier ?? "FREE";
}

export async function getCreditBalance(
  userId: string,
  client: DbClient = prisma
): Promise<number> {
  const latestEntry = await client.creditLedger.findFirst({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { balance: true },
  });

  if (latestEntry) {
    return latestEntry.balance;
  }

  const tier = await getSubscriptionTier(userId, client);
  return getTierCreditAllowance(tier);
}

export async function hasEnoughCredits(
  userId: string,
  cost: number
): Promise<boolean> {
  const balance = await getCreditBalance(userId);
  return balance >= cost;
}

export async function createCreditLedgerEntry(
  client: DbClient,
  params: {
    userId: string;
    amount: number;
    type: CreditTransactionType;
    description?: string;
    balance?: number;
    generationId?: string;
  }
) {
  const currentBalance = await getCreditBalance(params.userId, client);
  const nextBalance = params.balance ?? currentBalance + params.amount;

  if (nextBalance < 0) {
    throw new Error("Credit balance cannot be negative");
  }

  return client.creditLedger.create({
    data: {
      userId: params.userId,
      amount: params.amount,
      balance: nextBalance,
      type: params.type,
      description: params.description,
      generationId: params.generationId,
    },
  });
}

export async function setCreditBalance(
  userId: string,
  balance: number,
  type: CreditTransactionType,
  description: string
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    const currentBalance = await getCreditBalance(userId, tx);

    if (currentBalance === balance) {
      return balance;
    }

    await createCreditLedgerEntry(tx, {
      userId,
      amount: balance - currentBalance,
      balance,
      type,
      description,
    });

    return balance;
  });
}

export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  generationId?: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const currentBalance = await getCreditBalance(userId, tx);

      if (currentBalance < amount) {
        return { success: false, error: "Insufficient credits" };
      }

      const remainingCredits = currentBalance - amount;

      await createCreditLedgerEntry(tx, {
        userId,
        amount: -amount,
        balance: remainingCredits,
        type: "GENERATION_USE",
        description,
        generationId,
      });

      return { success: true, remainingCredits };
    });
  } catch (error) {
    console.error("Deduct credits error:", error);
    return { success: false, error: "Failed to deduct credits" };
  }
}

export function getGenerationCost(resolution: string): number {
  const costs: Record<string, number> = {
    "512x512": CREDIT_COSTS.GENERATE_512,
    "1024x1024": CREDIT_COSTS.GENERATE_1024,
    "2048x2048": CREDIT_COSTS.GENERATE_2048,
  };
  return costs[resolution] || CREDIT_COSTS.GENERATE_512;
}

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

  if (limits.tryOnProjects === 0) {
    return {
      allowed: false,
      reason: "Try-on requires Pro or Studio plan",
      currentProjects: user._count.tryOnProjects,
      maxProjects: 0,
    };
  }

  if (limits.tryOnProjects === -1) {
    return { allowed: true, currentProjects: user._count.tryOnProjects };
  }

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

export function canDownloadHD(tier: SubscriptionTier): boolean {
  return tier !== "FREE";
}

export function shouldApplyWatermark(tier: SubscriptionTier): boolean {
  return tier === "FREE";
}

export function getMaxResolution(tier: SubscriptionTier): string {
  const resolutions: Record<SubscriptionTier, string> = {
    FREE: "512x512",
    PRO: "1024x1024",
    STUDIO: "2048x2048",
  };
  return resolutions[tier];
}

export function hasPriorityGeneration(tier: SubscriptionTier): boolean {
  return tier === "STUDIO";
}
