"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/use-subscription";
import { UsageBar } from "@/components/subscription/credit-display";
import { plans, formatPrice } from "@/lib/stripe/plans";

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageFallback />}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const { subscription, usage, isLoading, refresh } = useSubscription();

  // Handle success/canceled messages
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast.success("Subscription updated successfully!");
      refresh();
    }
    if (canceled) {
      toast.info("Subscription update canceled.");
    }
  }, [searchParams, refresh]);

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === subscription?.tier) || plans[0];
  const isPaidPlan = subscription?.tier !== "FREE";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/60 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-white/60">
                Your subscription details
              </CardDescription>
            </div>
            <Badge
              variant={subscription?.tier === "STUDIO" ? "default" : "outline"}
              className="text-sm"
            >
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Monthly Generations</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentPlan.limits.generationsPerMonth}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Try-On Projects</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentPlan.limits.tryOnProjects === -1
                  ? "Unlimited"
                  : currentPlan.limits.tryOnProjects}
              </p>
            </div>
          </div>

          {/* Credits Usage */}
          {usage && (
            <div className="p-4 rounded-lg bg-white/5">
              <UsageBar
                label="Credits Used This Month"
                used={usage.creditsUsed}
                total={usage.creditsTotal}
              />
            </div>
          )}

          {/* Billing Actions */}
          {isPaidPlan ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleManageBilling} className="gap-2">
                <CreditCard className="h-4 w-4" />
                Manage Billing
              </Button>
              <Button variant="outline" asChild>
                <a href="/pricing">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Change Plan
                </a>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <a href="/pricing">Upgrade Plan</a>
            </Button>
          )}

          {/* Subscription Status */}
          {subscription?.cancelAtPeriodEnd && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400">
                Your subscription will end on{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureItem
              label="HD Downloads"
              enabled={!currentPlan.limits.watermark}
            />
            <FeatureItem
              label="Try-On Feature"
              enabled={currentPlan.limits.tryOnProjects > 0}
            />
            <FeatureItem
              label="Priority Generation"
              enabled={currentPlan.limits.priorityGeneration}
            />
            <FeatureItem
              label="Commercial Use"
              enabled={currentPlan.limits.commercialUse}
            />
            <FeatureItem
              label="API Access"
              enabled={currentPlan.limits.apiAccess}
            />
            <FeatureItem
              label="Max Resolution"
              value={currentPlan.limits.maxResolution}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPageFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    </div>
  );
}

function FeatureItem({
  label,
  enabled,
  value,
}: {
  label: string;
  enabled?: boolean;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-white/80">{label}</span>
      {value ? (
        <span className="text-white font-medium">{value}</span>
      ) : enabled ? (
        <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
      ) : (
        <Badge variant="outline" className="text-white/40">Disabled</Badge>
      )}
    </div>
  );
}
