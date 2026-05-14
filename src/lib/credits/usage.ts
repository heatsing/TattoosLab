import {
  CreditTransactionType,
  Prisma,
  SubscriptionStatus,
  SubscriptionTier,
  UsageAction,
} from "@prisma/client";
import { db as prisma } from "@/lib/db";
import {
  compareTiers,
  getEffectiveTier,
  getPlanById,
  type GenerationMode,
  type Plan,
} from "@/lib/stripe/plans";

type PrismaLike = Prisma.TransactionClient | typeof prisma;

const BURST_WINDOW_MS = 10 * 60 * 1000;

export type FeatureKey =
  | "tryOn"
  | "hdDownload"
  | "noWatermark"
  | "priorityGeneration"
  | "commercialUse"
  | "bulkGeneration"
  | "saveHistory";

export interface UserBillingState {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  plan: Plan;
  generationMode: GenerationMode;
  billingPeriodStart: Date;
  billingPeriodEnd: Date | null;
  creditBalance: number;
  usageCap: number;
  usageConsumed: number;
  usageRemaining: number | null;
  burstUsageConsumed: number;
}

export interface GenerationAllowance {
  mode: "CREDITS" | "UNLIMITED";
  creditsToDeduct: number;
  usageUnits: number;
  remainingCreditsAfter: number;
  remainingUsageAfter: number | null;
}

export interface CreditLedgerInput {
  userId: string;
  amount: number;
  balance?: number;
  type: CreditTransactionType;
  description?: string;
  generationId?: string;
  paymentId?: string;
}

export interface UsageLogInput {
  userId: string;
  action: UsageAction;
  units?: number;
  success?: boolean;
  generationId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
}

const FEATURE_REQUIREMENTS: Record<FeatureKey, SubscriptionTier> = {
  tryOn: "PRO",
  hdDownload: "PRO",
  noWatermark: "PRO",
  priorityGeneration: "STUDIO",
  commercialUse: "STUDIO",
  bulkGeneration: "STUDIO",
  saveHistory: "PRO",
};

export class BillingAccessError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function getCreditBalance(
  userId: string,
  client: PrismaLike = prisma
): Promise<number> {
  const latestEntry = await client.creditLedger.findFirst({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { balance: true },
  });

  return latestEntry?.balance ?? 0;
}

export function getTierCreditAllowance(tier: SubscriptionTier): number {
  const plan = getPlanById(tier);
  if (!plan) {
    return 0;
  }

  return plan.limits.fairUsageMonthly ?? plan.limits.starterCredits;
}

export async function createCreditLedgerEntry(
  client: PrismaLike,
  input: CreditLedgerInput
) {
  const currentBalance = await getCreditBalance(input.userId, client);
  const nextBalance = input.balance ?? currentBalance + input.amount;

  return client.creditLedger.create({
    data: {
      userId: input.userId,
      paymentId: input.paymentId,
      amount: input.amount,
      balance: nextBalance,
      type: input.type,
      description: input.description,
      generationId: input.generationId,
    },
  });
}

export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  description: string,
  options: { client?: PrismaLike; paymentId?: string } = {}
): Promise<number> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  const client = options.client ?? prisma;
  const currentBalance = await getCreditBalance(userId, client);
  const nextBalance = currentBalance + amount;

  await createCreditLedgerEntry(client, {
    userId,
    paymentId: options.paymentId,
    amount,
    balance: nextBalance,
    type,
    description,
  });

  return nextBalance;
}

export async function setCreditBalance(
  userId: string,
  targetBalance: number,
  type: CreditTransactionType,
  description: string,
  options: { client?: PrismaLike; paymentId?: string } = {}
): Promise<number> {
  const client = options.client ?? prisma;
  const currentBalance = await getCreditBalance(userId, client);
  const delta = targetBalance - currentBalance;

  if (delta === 0) {
    return targetBalance;
  }

  await createCreditLedgerEntry(client, {
    userId,
    paymentId: options.paymentId,
    amount: delta,
    balance: targetBalance,
    type,
    description,
  });

  return targetBalance;
}

export async function ensureStarterCredits(
  userId: string,
  client: PrismaLike = prisma
): Promise<number> {
  const existingEntries = await client.creditLedger.count({
    where: { userId },
  });

  if (existingEntries > 0) {
    return getCreditBalance(userId, client);
  }

  const starterCredits = getPlanById("FREE")?.limits.starterCredits ?? 0;
  if (starterCredits <= 0) {
    return 0;
  }

  await client.creditLedger.create({
    data: {
      userId,
      amount: starterCredits,
      balance: starterCredits,
      type: "BONUS",
      description: "Starter credits for the free plan",
    },
  });

  return starterCredits;
}

export async function recordUsageLog(
  client: PrismaLike,
  input: UsageLogInput
) {
  return client.usageLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      units: input.units ?? 1,
      success: input.success ?? true,
      generationId: input.generationId,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
      metadata: input.metadata,
    },
  });
}

export async function getUserBillingState(
  userId: string,
  client: PrismaLike = prisma
): Promise<UserBillingState> {
  await ensureStarterCredits(userId, client);

  const user = await client.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new BillingAccessError(
      "USER_NOT_FOUND",
      "User record was not found in the billing database.",
      404
    );
  }

  const effectiveTier = getEffectiveTier(
    user.subscription?.tier,
    user.subscription?.status
  );
  const plan = getPlanById(effectiveTier);

  if (!plan) {
    throw new BillingAccessError(
      "PLAN_NOT_FOUND",
      `No plan configuration exists for tier ${effectiveTier}.`,
      500
    );
  }

  const now = new Date();
  const billingPeriodStart =
    effectiveTier !== "FREE" && user.subscription?.currentPeriodStart
      ? user.subscription.currentPeriodStart
      : new Date(now.getFullYear(), now.getMonth(), 1);

  const [creditBalance, usageAggregate, burstAggregate] = await Promise.all([
    getCreditBalance(userId, client),
    client.usageLog.aggregate({
      where: {
        userId,
        action: "GENERATION",
        success: true,
        createdAt: { gte: billingPeriodStart },
      },
      _sum: { units: true },
    }),
    client.usageLog.aggregate({
      where: {
        userId,
        action: "GENERATION",
        success: true,
        createdAt: { gte: new Date(Date.now() - BURST_WINDOW_MS) },
      },
      _sum: { units: true },
    }),
  ]);

  const usageConsumed = usageAggregate._sum.units ?? 0;
  const usageCap = plan.limits.fairUsageMonthly ?? plan.limits.starterCredits;
  const usageRemaining =
    plan.limits.fairUsageMonthly === null
      ? null
      : Math.max(plan.limits.fairUsageMonthly - usageConsumed, 0);

  return {
    userId,
    tier: effectiveTier,
    status: user.subscription?.status ?? "ACTIVE",
    plan,
    generationMode: plan.limits.generationMode,
    billingPeriodStart,
    billingPeriodEnd:
      effectiveTier !== "FREE" ? user.subscription?.currentPeriodEnd ?? null : null,
    creditBalance,
    usageCap,
    usageConsumed,
    usageRemaining,
    burstUsageConsumed: burstAggregate._sum.units ?? 0,
  };
}

export async function assertGenerationAllowed(
  userId: string,
  count: number,
  client: PrismaLike = prisma
): Promise<{ state: UserBillingState; allowance: GenerationAllowance }> {
  const state = await getUserBillingState(userId, client);
  const burstLimit = state.plan.limits.burstLimitPer10Minutes;

  if (state.burstUsageConsumed + count > burstLimit) {
    throw new BillingAccessError(
      "RATE_LIMITED",
      "You have hit the generation rate limit for this window. Please wait a few minutes and try again.",
      429,
      {
        burstLimit,
        burstUsed: state.burstUsageConsumed,
        requested: count,
      }
    );
  }

  if (state.generationMode === "CREDITS") {
    if (state.creditBalance < count) {
      throw new BillingAccessError(
        "INSUFFICIENT_CREDITS",
        `You need ${count} credit${count > 1 ? "s" : ""} but only have ${state.creditBalance}.`,
        403,
        {
          required: count,
          available: state.creditBalance,
        }
      );
    }

    return {
      state,
      allowance: {
        mode: "CREDITS",
        creditsToDeduct: count,
        usageUnits: count,
        remainingCreditsAfter: state.creditBalance - count,
        remainingUsageAfter: state.usageRemaining,
      },
    };
  }

  if (state.usageRemaining !== null && state.usageRemaining >= count) {
    return {
      state,
      allowance: {
        mode: "UNLIMITED",
        creditsToDeduct: 0,
        usageUnits: count,
        remainingCreditsAfter: state.creditBalance,
        remainingUsageAfter: state.usageRemaining - count,
      },
    };
  }

  if (state.creditBalance >= count) {
    return {
      state,
      allowance: {
        mode: "CREDITS",
        creditsToDeduct: count,
        usageUnits: count,
        remainingCreditsAfter: state.creditBalance - count,
        remainingUsageAfter: state.usageRemaining,
      },
    };
  }

  throw new BillingAccessError(
    "FAIR_USAGE_LIMIT_REACHED",
    "Your fair-use generation limit has been reached for this billing period. Buy credits or wait for the next cycle.",
    403,
    {
      usageCap: state.usageCap,
      usageConsumed: state.usageConsumed,
      requested: count,
      creditBalance: state.creditBalance,
    }
  );
}

export async function finalizeGenerationUsage(
  client: PrismaLike,
  state: UserBillingState,
  allowance: GenerationAllowance,
  options: {
    count: number;
    description: string;
    generationId?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<number> {
  if (allowance.creditsToDeduct > 0) {
    await createCreditLedgerEntry(client, {
      userId: state.userId,
      amount: -allowance.creditsToDeduct,
      balance: allowance.remainingCreditsAfter,
      type: "GENERATION_USE",
      description: options.description,
      generationId: options.generationId,
    });
  }

  await recordUsageLog(client, {
    userId: state.userId,
    action: "GENERATION",
    units: allowance.usageUnits,
    generationId: options.generationId,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    metadata: {
      tier: state.tier,
      mode: allowance.mode,
      count: options.count,
    },
  });

  return allowance.remainingCreditsAfter;
}

export function getFeatureRequiredTier(
  feature: FeatureKey
): SubscriptionTier | undefined {
  return FEATURE_REQUIREMENTS[feature];
}

export function hasFeatureAccess(
  state: Pick<UserBillingState, "tier" | "plan">,
  feature: FeatureKey
): boolean {
  switch (feature) {
    case "tryOn":
      return state.plan.limits.tryOnUnlocked;
    case "hdDownload":
      return state.plan.limits.hdDownload;
    case "noWatermark":
      return !state.plan.limits.watermark;
    case "priorityGeneration":
      return state.plan.limits.priorityGeneration;
    case "commercialUse":
      return state.plan.limits.commercialUse;
    case "bulkGeneration":
      return state.plan.limits.bulkGeneration;
    case "saveHistory":
      return state.plan.limits.saveHistory;
    default:
      return compareTiers(state.tier, FEATURE_REQUIREMENTS[feature]);
  }
}

export async function assertFeatureAccess(
  userId: string,
  feature: FeatureKey,
  client: PrismaLike = prisma
): Promise<UserBillingState> {
  const state = await getUserBillingState(userId, client);
  if (hasFeatureAccess(state, feature)) {
    return state;
  }

  const requiredTier = getFeatureRequiredTier(feature) ?? "PRO";
  throw new BillingAccessError(
    "FEATURE_LOCKED",
    `This feature requires the ${requiredTier} plan.`,
    403,
    {
      feature,
      currentTier: state.tier,
      requiredTier,
    }
  );
}

export async function canUseTryOn(userId: string): Promise<boolean> {
  const state = await getUserBillingState(userId);
  return hasFeatureAccess(state, "tryOn");
}

export async function canUseHdDownload(userId: string): Promise<boolean> {
  const state = await getUserBillingState(userId);
  return hasFeatureAccess(state, "hdDownload");
}