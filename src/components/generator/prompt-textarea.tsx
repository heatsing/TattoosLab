"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const promptSuggestions = [
  "A majestic lion with geometric patterns",
  "Delicate cherry blossoms on a branch",
  "Abstract waves with Japanese influence",
  "Minimalist mountain range silhouette",
  "Sacred geometry mandala design",
  "Watercolor phoenix rising from flames",
];

export function PromptTextarea({
  value,
  onChange,
  error,
  placeholder = "Describe your tattoo idea in detail...",
}: PromptTextareaProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const charCount = value.length;
  const maxChars = 500;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
              <Wand2 className="h-4 w-4" />
            </div>
            <label className="text-base font-semibold tracking-tight text-white">
              Describe your tattoo <span className="text-red-400">*</span>
            </label>
          </div>
          <p className="text-sm leading-6 text-white/50">
            Include subject, mood, style, symbols, and any placement cues you
            want the model to follow.
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
            charCount > maxChars
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-white/10 bg-white/5 text-white/45"
          )}
        >
          {charCount}/{maxChars}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className={cn(
            "w-full min-h-[172px] rounded-2xl border bg-black/30 px-4 py-4 pr-12 text-[15px] leading-7 text-white placeholder:text-white/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] resize-none transition-all duration-200 focus:outline-none focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-white/10 focus:border-brand-500/80 focus:ring-brand-500/20"
          )}
        />
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-brand-400/70 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Prompt Suggestions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 text-sm text-brand-400 transition-colors hover:text-brand-300"
        >
          <Wand2 className="h-4 w-4" />
          {showSuggestions ? "Hide suggestions" : "Need inspiration?"}
        </button>

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-3">
            {promptSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
