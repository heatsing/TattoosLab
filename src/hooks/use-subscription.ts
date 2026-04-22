"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCurrentSubscription,
  checkFeatureAccess,
  getUsageStats,
  SubscriptionData,
} from "@/app/actions/subscription";
import { SubscriptionTier } from "@prisma/client";

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  checkAccess: (feature: string) => Promise<{
    allowed: boolean;
    currentTier: SubscriptionTier;
    requiredTier?: SubscriptionTier;
  }>;
  usage: {
    creditsUsed: number;
    creditsTotal: number;
    generationsThisMonth: number;
    tryOnProjects: number;
  } | null;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UseSubscriptionReturn["usage"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subResult, usageResult] = await Promise.all([
        getCurrentSubscription(),
        getUsageStats(),
      ]);

      if (subResult.success && subResult.data) {
        setSubscription(subResult.data);
      } else {
        setError(subResult.error?.message || "Failed to fetch subscription");
      }

      if (usageResult.success && usageResult.data) {
        setUsage(usageResult.data);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const checkAccess = useCallback(
    async (feature: string) => {
      const result = await checkFeatureAccess(feature);
      return {
        allowed: result.allowed,
        currentTier: result.currentTier,
        requiredTier: result.requiredTier,
      };
    },
    []
  );

  return {
    subscription,
    isLoading,
    error,
    refresh: fetchSubscription,
    checkAccess,
    usage,
  };
}

// Hook for checking a specific feature
export function useFeatureAccess(feature: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requiredTier, setRequiredTier] = useState<SubscriptionTier | undefined>();

  useEffect(() => {
    async function check() {
      const result = await checkFeatureAccess(feature);
      setHasAccess(result.allowed);
      setRequiredTier(result.requiredTier);
      setIsLoading(false);
    }
    check();
  }, [feature]);

  return { hasAccess, isLoading, requiredTier };
}
