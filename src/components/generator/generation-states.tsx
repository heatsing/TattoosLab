"use client";

import { Sparkles, Loader2, AlertCircle, Wand2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  onExampleClick?: (prompt: string) => void;
}

const examples = [
  "A geometric wolf howling at the moon",
  "Watercolor cherry blossoms with birds",
  "Minimalist mountain range with sun",
  "Traditional anchor with roses",
];

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 border-white/10 bg-white/5 border-dashed">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/10 mb-6">
        <Wand2 className="h-10 w-10 text-brand-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Ready to Create Your Tattoo
      </h3>
      <p className="text-white/60 text-center max-w-md mb-8">
        Fill in the form on the left and click generate to see AI-powered tattoo
        designs based on your description.
      </p>

      <div className="w-full max-w-md">
        <p className="text-sm text-white/40 mb-3 text-center">Try an example:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => onExampleClick?.(example)}
              className="px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface LoadingStateProps {
  progress?: number;
  message?: string;
}

export function LoadingState({
  progress = 0,
  message = "Creating your tattoo design...",
}: LoadingStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 border-white/10 bg-white/5">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-brand-500/10 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-brand-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center">
          <Loader2 className="h-4 w-4 text-white animate-spin" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
      <p className="text-white/60 text-center max-w-md mb-6">
        Our AI is crafting unique tattoo designs based on your description. This
        usually takes 10-20 seconds.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-pink-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-white/40 mt-2">{progress}% complete</p>
    </Card>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onClear?: () => void;
}

export function ErrorState({ error, onRetry, onClear }: ErrorStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 border-red-500/30 bg-red-500/5">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 mb-6">
        <AlertCircle className="h-10 w-10 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Generation Failed
      </h3>
      <p className="text-white/60 text-center max-w-md mb-2">{error}</p>
      <p className="text-sm text-white/40 text-center max-w-md mb-6">
        This might be due to high demand or an issue with your prompt. Please
        try again.
      </p>

      <div className="flex gap-3">
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button onClick={onClear} variant="outline">
          Clear & Start Over
        </Button>
      </div>
    </Card>
  );
}

interface SuccessStateProps {
  count: number;
  creditsUsed: number;
  remainingCredits?: number;
}

export function SuccessState({
  count,
  creditsUsed,
  remainingCredits,
}: SuccessStateProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
        <Check className="h-5 w-5 text-green-400" />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">
          Generated {count} design{count > 1 ? "s" : ""}
        </p>
        <p className="text-sm text-white/60">
          Used {creditsUsed} credit{creditsUsed > 1 ? "s" : ""}
          {remainingCredits !== undefined && ` - ${remainingCredits} remaining`}
        </p>
      </div>
    </div>
  );
}
