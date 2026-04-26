"use client";

import { useState } from "react";
import { Check, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plans, formatPrice, Plan } from "@/lib/stripe/plans";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";

interface PricingCardsProps {
  currentTier?: string;
}

export function PricingCards({ currentTier = "FREE" }: PricingCardsProps) {
  const { subscription } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const activeTier = subscription?.tier ?? currentTier;

  const handleSubscribe = async (planId: string) => {
    if (planId === "FREE") return;

    setIsLoading(planId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-brand-600 text-white"
                : "text-white/60 hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              billingCycle === "yearly"
                ? "bg-brand-600 text-white"
                : "text-white/60 hover:text-white"
            )}
          >
            Yearly
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            isCurrentPlan={activeTier === plan.id}
            isLoading={isLoading === plan.id}
            onSubscribe={() => handleSubscribe(plan.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: Plan;
  billingCycle: "monthly" | "yearly";
  isCurrentPlan: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
}

function PricingCard({
  plan,
  billingCycle,
  isCurrentPlan,
  isLoading,
  onSubscribe,
}: PricingCardProps) {
  const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  const displayPrice = billingCycle === "monthly" 
    ? plan.priceMonthlyDisplay 
    : plan.priceYearlyDisplay;

  return (
    <Card
      className={cn(
        "relative flex flex-col border-white/10",
        plan.popular && "bg-gradient-to-b from-brand-600/20 to-pink-600/20 border-brand-500/50"
      )}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center pb-4">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-sm text-white/60">{plan.description}</p>
        
        <div className="mt-4">
          <span className="text-4xl font-bold text-white">{displayPrice}</span>
          <span className="text-white/60">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
        </div>
        
        {billingCycle === "yearly" && plan.savings && (
          <p className="text-sm text-green-400 mt-1">{plan.savings}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1">
          {plan.features.map((feature) => (
            <li key={feature.name} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-white/20 shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-sm",
                feature.included ? "text-white/80" : "text-white/40"
              )}>
                {feature.name}
                {typeof feature.value === "number" && feature.value > 0 && (
                  <span className="text-white"> ({feature.value})</span>
                )}
                {typeof feature.value === "string" && feature.value !== "true" && (
                  <span className="text-white"> ({feature.value})</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onSubscribe}
          disabled={isCurrentPlan || isLoading || plan.id === "FREE"}
          variant={plan.popular ? "default" : "outline"}
          className="w-full mt-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : plan.id === "FREE" ? (
            "Get Started"
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Subscribe
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
