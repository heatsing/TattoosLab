"use client";

import { useState } from "react";
import { Lock, Sparkles, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  requiredTier: string;
  description?: string;
  className?: string;
  onDismiss?: () => void;
}

export function UpgradePrompt({
  feature,
  requiredTier,
  description,
  className,
  onDismiss,
}: UpgradePromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-brand-500/30 bg-gradient-to-r from-brand-600/10 to-pink-600/10 p-6",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-brand-500/20 blur-2xl" />
      
      {onDismiss && (
        <button
          onClick={() => {
            setIsDismissed(true);
            onDismiss();
          }}
          className="absolute top-3 right-3 p-1 rounded-full text-white/40 hover:text-white/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/20">
          <Lock className="h-6 w-6 text-brand-400" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white">
            Upgrade to {requiredTier}
          </h4>
          <p className="text-sm text-white/60 mt-1">
            {description || `Unlock ${feature} with the ${requiredTier} plan.`}
          </p>
          
          <div className="flex gap-3 mt-4">
            <Link href="/pricing">
              <Button size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-white/60">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Inline upgrade button for feature gates
interface UpgradeButtonProps {
  requiredTier: string;
  className?: string;
}

export function UpgradeButton({ requiredTier, className }: UpgradeButtonProps) {
  return (
    <Link href="/pricing" className={className}>
      <Button variant="outline" size="sm" className="gap-2">
        <Lock className="h-3.5 w-3.5" />
        Upgrade to {requiredTier}
      </Button>
    </Link>
  );
}

// Feature gate wrapper
interface FeatureGateProps {
  children: React.ReactNode;
  feature: string;
  requiredTier: string;
  hasAccess: boolean;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  children,
  feature,
  requiredTier,
  hasAccess,
  fallback,
}: FeatureGateProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt
      feature={feature}
      requiredTier={requiredTier}
      className="my-4"
    />
  );
}
