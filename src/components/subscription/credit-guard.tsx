"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CreditGuardProps {
  children: React.ReactNode;
  requiredCredits: number;
  userCredits: number;
  onProceed: () => void | Promise<void>;
  fallback?: React.ReactNode;
}

export function CreditGuard({
  children,
  requiredCredits,
  userCredits,
  onProceed,
  fallback,
}: CreditGuardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const hasEnough = userCredits >= requiredCredits;

  const handleClick = useCallback(async () => {
    if (!hasEnough) {
      toast.error(`You need ${requiredCredits} credits. Please upgrade your plan.`);
      return;
    }

    setIsProcessing(true);
    try {
      await onProceed();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [hasEnough, requiredCredits, onProceed]);

  if (!hasEnough) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
        <p className="text-sm text-red-400 mb-3">
          You need {requiredCredits} credits for this action.
          You have {userCredits} credits remaining.
        </p>
        <Link href="/pricing">
          <Button size="sm" variant="outline">
            Upgrade Plan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {isProcessing ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// Simple credit check hook
export function useCreditCheck() {
  const checkCredits = useCallback(
    async (requiredCredits: number, userCredits: number): Promise<boolean> => {
      if (userCredits < requiredCredits) {
        toast.error(
          `Insufficient credits. You need ${requiredCredits} credits for this action.`
        );
        return false;
      }
      return true;
    },
    []
  );

  return { checkCredits };
}
