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
import { creditPacks, formatPrice, plans } from "@/lib/stripe/plans";

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
    const provider = searchParams.get("provider");
    const paypalState = searchParams.get("paypal");

    if (success) {
      toast.success(
        provider === "paypal"
          ? "PayPal checkout completed successfully!"
          : "Subscription updated successfully!"
      );
      refresh();
    }
    if (canceled) {
      toast.info("Subscription update canceled.");
    }
    if (paypalState === "order-failed" || paypalState === "subscription-failed") {
      toast.error("PayPal approval completed, but we could not finish syncing the purchase.");
    }
  }, [searchParams, refresh]);

  const handleManageBilling = async () => {
    try {
      if (subscription?.provider === "PAYPAL") {
        const response = await fetch("/api/paypal/subscription/cancel", {
          method: "POST",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to cancel PayPal subscription");
        }

        toast.success("Your PayPal subscription has been canceled.");
        await refresh();
        return;
      }

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

  const handleCreditPackCheckout = async (
    provider: "stripe" | "paypal",
    creditPackId: "CREDIT_PACK_50" | "CREDIT_PACK_120"
  ) => {
    try {
      const response = await fetch(
        provider === "paypal" ? "/api/paypal/checkout" : "/api/stripe/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creditPackId }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
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
  const usageLabel =
    usage?.generationMode === "UNLIMITED"
      ? "Fair-Use Generations This Cycle"
      : "Credits Used";
  const billingButtonLabel =
    subscription?.provider === "PAYPAL" ? "Cancel PayPal Subscription" : "Manage Billing";

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
              {subscription?.provider ? ` · ${subscription.provider}` : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Generation Access</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentPlan.limits.generationMode === "UNLIMITED"
                  ? "Unlimited"
                  : `${currentPlan.limits.starterCredits} total`}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-sm text-white/60">Credit Wallet</p>
              <p className="text-2xl font-bold text-white mt-1">
                {subscription?.credits ?? 0}
              </p>
            </div>
          </div>

          {/* Credits Usage */}
          {usage && (
            <div className="p-4 rounded-lg bg-white/5">
              <UsageBar
                label={usageLabel}
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
                {billingButtonLabel}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Buy Extra Credits</CardTitle>
          <CardDescription className="text-white/60">
            Credit packs work as overflow on top of your plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {creditPacks.map((pack) => (
            <div key={pack.id} className="rounded-xl bg-white/5 p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{pack.name}</p>
                  <p className="text-sm text-white/60">{pack.description}</p>
                </div>
                <Badge variant="outline" className="text-white/80 border-white/10">
                  {formatPrice(pack.price)}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => handleCreditPackCheckout("stripe", pack.id)}
                >
                  Stripe
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleCreditPackCheckout("paypal", pack.id)}
                >
                  PayPal
                </Button>
              </div>
            </div>
          ))}
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
              enabled={currentPlan.limits.hdDownload}
            />
            <FeatureItem
              label="Try-On Feature"
              enabled={currentPlan.limits.tryOnUnlocked}
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
              label="Saved History"
              enabled={currentPlan.limits.saveHistory}
            />
            <FeatureItem
              label="Bulk Tools"
              enabled={currentPlan.limits.bulkGeneration}
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