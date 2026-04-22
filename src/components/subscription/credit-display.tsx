"use client";

import { Zap, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface CreditDisplayProps {
  credits: number;
  maxCredits: number;
  className?: string;
}

export function CreditDisplay({ credits, maxCredits, className }: CreditDisplayProps) {
  const percentage = (credits / maxCredits) * 100;
  const isLow = percentage < 20;

  return (
    <Link href="/pricing">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors",
          isLow
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10",
          className
        )}
      >
        {isLow ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Zap className="h-4 w-4 text-yellow-400" />
        )}
        <span className="text-sm font-medium">
          {credits} / {maxCredits} credits
        </span>
        {isLow && <span className="text-xs hidden sm:inline">Low</span>}
      </div>
    </Link>
  );
}

// Usage bar component
interface UsageBarProps {
  used: number;
  total: number;
  label?: string;
  className?: string;
}

export function UsageBar({ used, total, label, className }: UsageBarProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const isHigh = percentage > 80;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-white/60">{label}</span>
          <span className={cn("font-medium", isHigh ? "text-red-400" : "text-white")}>
            {used} / {total}
          </span>
        </div>
      )}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isHigh ? "bg-red-500" : "bg-gradient-to-r from-brand-500 to-pink-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
