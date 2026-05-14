import {
  BillingCycle,
  SubscriptionStatus,
  SubscriptionTier,
} from "@prisma/client";

export type PaidPlanId = Exclude<SubscriptionTier, "FREE">;
export type CreditPackId = "CREDIT_PACK_50" | "CREDIT_PACK_120";
export type GenerationMode = "CREDITS" | "UNLIMITED";

export interface PlanFeature {
  name: string;
  value: string | boolean | number;
  included: boolean;
}

export interface PlanLimits {
  generationMode: GenerationMode;
  starterCredits: number;
  fairUsageMonthly: number | null;
  burstLimitPer10Minutes: number;
  maxResolution: string;
  watermark: boolean;
  tryOnUnlocked: boolean;
  saveHistory: boolean;
  hdDownload: boolean;
  commercialUse: boolean;
  priorityGeneration: boolean;
  bulkGeneration: boolean;
}

export interface Plan {
  id: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  priceMonthlyDisplay: string;
  priceYearlyDisplay: string;
  savings: string;
  features: PlanFeature[];
  limits: PlanLimits;
  popular?: boolean;
}

export interface CreditPack {
  id: CreditPackId;
  name: string;
  credits: number;
  price: number;
  priceDisplay: string;
  description: string;
}

export const plans: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Try the generator before you commit",
    priceMonthly: 0,
    priceYearly: 0,
    priceMonthlyDisplay: "$0",
    priceYearlyDisplay: "$0",
    savings: "",
    features: [
      { name: "AI generations", value: 3, included: true },
      { name: "Watermarked images", value: true, included: true },
      { name: "HD downloads", value: false, included: false },
      { name: "Tattoo try-on", value: false, included: false },
      { name: "Saved history", value: false, included: false },
      { name: "Commercial license", value: false, included: false },
      { name: "Priority queue", value: false, included: false },
      { name: "Bulk generation", value: false, included: false },
    ],
    limits: {
      generationMode: "CREDITS",
      starterCredits: 3,
      fairUsageMonthly: null,
      burstLimitPer10Minutes: 4,
      maxResolution: "1024x1024",
      watermark: true,
      tryOnUnlocked: false,
      saveHistory: false,
      hdDownload: false,
      commercialUse: false,
      priorityGeneration: false,
      bulkGeneration: false,
    },
  },
  {
    id: "PRO",
    name: "Pro",
    description: "Unlimited tattoo ideation for individual creators",
    priceMonthly: 1500,
    priceYearly: 18000,
    priceMonthlyDisplay: "$15",
    priceYearlyDisplay: "$180",
    savings: "",
    popular: true,
    features: [
      { name: "AI generations", value: "Unlimited (fair use)", included: true },
      { name: "HD downloads", value: true, included: true },
      { name: "Tattoo try-on", value: true, included: true },
      { name: "No watermark", value: true, included: true },
      { name: "Saved history", value: true, included: true },
      { name: "Commercial license", value: false, included: false },
      { name: "Priority queue", value: false, included: false },
      { name: "Bulk generation", value: false, included: false },
    ],
    limits: {
      generationMode: "UNLIMITED",
      starterCredits: 0,
      fairUsageMonthly: 300,
      burstLimitPer10Minutes: 20,
      maxResolution: "2048x2048",
      watermark: false,
      tryOnUnlocked: true,
      saveHistory: true,
      hdDownload: true,
      commercialUse: false,
      priorityGeneration: false,
      bulkGeneration: false,
    },
  },
  {
    id: "STUDIO",
    name: "Studio",
    description: "Commercial workflow for tattoo artists and shops",
    priceMonthly: 3900,
    priceYearly: 46800,
    priceMonthlyDisplay: "$39",
    priceYearlyDisplay: "$468",
    savings: "",
    features: [
      { name: "AI generations", value: "Unlimited (fair use)", included: true },
      { name: "HD downloads", value: true, included: true },
      { name: "Tattoo try-on", value: true, included: true },
      { name: "No watermark", value: true, included: true },
      { name: "Saved history", value: true, included: true },
      { name: "Commercial license", value: true, included: true },
      { name: "Priority queue", value: true, included: true },
      { name: "Bulk generation tools", value: true, included: true },
    ],
    limits: {
      generationMode: "UNLIMITED",
      starterCredits: 0,
      fairUsageMonthly: 1200,
      burstLimitPer10Minutes: 60,
      maxResolution: "2048x2048",
      watermark: false,
      tryOnUnlocked: true,
      saveHistory: true,
      hdDownload: true,
      commercialUse: true,
      priorityGeneration: true,
      bulkGeneration: true,
    },
  },
];

export const creditPacks: CreditPack[] = [
  {
    id: "CREDIT_PACK_50",
    name: "50 Credits",
    credits: 50,
    price: 500,
    priceDisplay: "$5",
    description: "A quick refill for one-off tattoo design sessions.",
  },
  {
    id: "CREDIT_PACK_120",
    name: "120 Credits",
    credits: 120,
    price: 1000,
    priceDisplay: "$10",
    description: "Best value for heavier bursts of generation usage.",
  },
];

const PLAN_TIER_LEVELS: Record<SubscriptionTier, number> = {
  FREE: 0,
  PRO: 1,
  STUDIO: 2,
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<SubscriptionStatus>([
  "ACTIVE",
  "TRIALING",
]);

export function getPlanById(id: SubscriptionTier): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getCreditPackById(id: CreditPackId): CreditPack | undefined {
  return creditPacks.find((pack) => pack.id === id);
}

export function getPlanPrice(
  planId: SubscriptionTier,
  billingCycle: BillingCycle | "monthly" | "yearly"
): number {
  const plan = getPlanById(planId);
  if (!plan) {
    return 0;
  }

  return billingCycle === "monthly" || billingCycle === "MONTHLY"
    ? plan.priceMonthly
    : plan.priceYearly;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getPriceId(
  planId: SubscriptionTier,
  billingCycle: "monthly" | "yearly"
): string | null {
  const priceMap: Record<PaidPlanId, Record<"monthly" | "yearly", string | undefined>> = {
    PRO: {
      monthly: process.env.STRIPE_PRO_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRO_PRICE_YEARLY,
    },
    STUDIO: {
      monthly: process.env.STRIPE_STUDIO_PRICE_MONTHLY,
      yearly: process.env.STRIPE_STUDIO_PRICE_YEARLY,
    },
  };

  if (planId === "FREE") {
    return null;
  }

  return priceMap[planId]?.[billingCycle] ?? null;
}

export function getCreditPackPriceId(packId: CreditPackId): string | null {
  const priceMap: Record<CreditPackId, string | undefined> = {
    CREDIT_PACK_50: process.env.STRIPE_CREDIT_PACK_50_PRICE_ID,
    CREDIT_PACK_120: process.env.STRIPE_CREDIT_PACK_120_PRICE_ID,
  };

  return priceMap[packId] ?? null;
}

export function getPayPalPlanId(
  planId: SubscriptionTier,
  billingCycle: "monthly" | "yearly"
): string | null {
  const planMap: Record<PaidPlanId, Record<"monthly" | "yearly", string | undefined>> = {
    PRO: {
      monthly: process.env.PAYPAL_PRO_PLAN_MONTHLY_ID,
      yearly: process.env.PAYPAL_PRO_PLAN_YEARLY_ID,
    },
    STUDIO: {
      monthly: process.env.PAYPAL_STUDIO_PLAN_MONTHLY_ID,
      yearly: process.env.PAYPAL_STUDIO_PLAN_YEARLY_ID,
    },
  };

  if (planId === "FREE") {
    return null;
  }

  return planMap[planId]?.[billingCycle] ?? null;
}

export function getPlanByPriceId(priceId?: string | null): Plan | undefined {
  if (!priceId) {
    return undefined;
  }

  return plans.find((plan) => {
    if (plan.id === "FREE") {
      return false;
    }

    return (
      getPriceId(plan.id, "monthly") === priceId ||
      getPriceId(plan.id, "yearly") === priceId
    );
  });
}

export function getCreditPackByPriceId(
  priceId?: string | null
): CreditPack | undefined {
  if (!priceId) {
    return undefined;
  }

  return creditPacks.find((pack) => getCreditPackPriceId(pack.id) === priceId);
}

export function getPlanByPayPalPlanId(
  planId?: string | null
): { plan: Plan; billingCycle: "monthly" | "yearly" } | undefined {
  if (!planId) {
    return undefined;
  }

  for (const plan of plans) {
    if (plan.id === "FREE") {
      continue;
    }

    if (getPayPalPlanId(plan.id, "monthly") === planId) {
      return { plan, billingCycle: "monthly" };
    }

    if (getPayPalPlanId(plan.id, "yearly") === planId) {
      return { plan, billingCycle: "yearly" };
    }
  }

  return undefined;
}

export function isSubscriptionActiveStatus(
  status?: SubscriptionStatus | null
): boolean {
  return !!status && ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export function getEffectiveTier(
  tier?: SubscriptionTier | null,
  status?: SubscriptionStatus | null
): SubscriptionTier {
  if (!tier || !status || !isSubscriptionActiveStatus(status)) {
    return "FREE";
  }

  return tier;
}

export function compareTiers(
  currentTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return PLAN_TIER_LEVELS[currentTier] >= PLAN_TIER_LEVELS[requiredTier];
}

export function isPaidTier(tier: SubscriptionTier): tier is PaidPlanId {
  return tier !== "FREE";
}