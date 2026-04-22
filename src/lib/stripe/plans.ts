import { SubscriptionTier } from "@prisma/client";

export interface PlanFeature {
  name: string;
  value: string | boolean | number;
  included: boolean;
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
  limits: {
    generationsPerMonth: number;
    tryOnProjects: number;
    maxResolution: string;
    watermark: boolean;
    priorityGeneration: boolean;
    commercialUse: boolean;
    apiAccess: boolean;
  };
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Get started with AI tattoo generation",
    priceMonthly: 0,
    priceYearly: 0,
    priceMonthlyDisplay: "$0",
    priceYearlyDisplay: "$0",
    savings: "",
    features: [
      { name: "AI Generations", value: 5, included: true },
      { name: "Resolution", value: "512x512", included: true },
      { name: "Watermarked downloads", value: true, included: true },
      { name: "Basic styles", value: true, included: true },
      { name: "Community gallery", value: true, included: true },
      { name: "Try-on feature", value: false, included: false },
      { name: "HD downloads", value: false, included: false },
      { name: "Priority generation", value: false, included: false },
      { name: "Commercial use", value: false, included: false },
      { name: "API access", value: false, included: false },
    ],
    limits: {
      generationsPerMonth: 5,
      tryOnProjects: 0,
      maxResolution: "512x512",
      watermark: true,
      priorityGeneration: false,
      commercialUse: false,
      apiAccess: false,
    },
  },
  {
    id: "PRO",
    name: "Pro",
    description: "For tattoo enthusiasts",
    priceMonthly: 999, // $9.99 in cents
    priceYearly: 9590, // $95.90 in cents (20% off)
    priceMonthlyDisplay: "$9.99",
    priceYearlyDisplay: "$7.99",
    savings: "Save 20%",
    popular: true,
    features: [
      { name: "AI Generations", value: 50, included: true },
      { name: "Resolution", value: "1024x1024", included: true },
      { name: "No watermark", value: true, included: true },
      { name: "All styles", value: true, included: true },
      { name: "Try-on feature", value: "10 projects", included: true },
      { name: "HD downloads", value: true, included: true },
      { name: "Priority generation", value: false, included: false },
      { name: "Commercial use", value: false, included: false },
      { name: "API access", value: false, included: false },
    ],
    limits: {
      generationsPerMonth: 50,
      tryOnProjects: 10,
      maxResolution: "1024x1024",
      watermark: false,
      priorityGeneration: false,
      commercialUse: false,
      apiAccess: false,
    },
  },
  {
    id: "STUDIO",
    name: "Studio",
    description: "For professional tattoo artists",
    priceMonthly: 2999, // $29.99 in cents
    priceYearly: 28790, // $287.90 in cents (20% off)
    priceMonthlyDisplay: "$29.99",
    priceYearlyDisplay: "$23.99",
    savings: "Save 20%",
    features: [
      { name: "AI Generations", value: 200, included: true },
      { name: "Resolution", value: "2048x2048", included: true },
      { name: "No watermark", value: true, included: true },
      { name: "All styles + custom", value: true, included: true },
      { name: "Try-on feature", value: "Unlimited", included: true },
      { name: "HD downloads", value: true, included: true },
      { name: "Priority generation", value: true, included: true },
      { name: "Commercial use", value: true, included: true },
      { name: "API access", value: true, included: true },
    ],
    limits: {
      generationsPerMonth: 200,
      tryOnProjects: -1, // Unlimited
      maxResolution: "2048x2048",
      watermark: false,
      priorityGeneration: true,
      commercialUse: true,
      apiAccess: true,
    },
  },
];

export function getPlanById(id: SubscriptionTier): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getPlanPrice(
  planId: SubscriptionTier,
  billingCycle: "monthly" | "yearly"
): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  return billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getPriceId(
  planId: SubscriptionTier,
  billingCycle: "monthly" | "yearly"
): string | null {
  const priceMap: Record<string, Record<string, string | undefined>> = {
    PRO: {
      monthly: process.env.STRIPE_PRO_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRO_PRICE_YEARLY,
    },
    STUDIO: {
      monthly: process.env.STRIPE_STUDIO_PRICE_MONTHLY,
      yearly: process.env.STRIPE_STUDIO_PRICE_YEARLY,
    },
  };

  return priceMap[planId]?.[billingCycle] || null;
}
