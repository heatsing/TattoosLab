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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          Describe Your Tattoo <span className="text-red-400">*</span>
        </label>
        <span
          className={cn(
            "text-xs",
            charCount > maxChars ? "text-red-400" : "text-white/40"
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
          rows={4}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/30 resize-none transition-all duration-200 focus:outline-none focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500/20"
              : "border-white/10 focus:border-brand-500 focus:ring-brand-500/20"
          )}
        />
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-brand-400/50" />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Prompt Suggestions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          <Wand2 className="h-4 w-4" />
          {showSuggestions ? "Hide suggestions" : "Need inspiration?"}
        </button>

        {showSuggestions && (
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
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
