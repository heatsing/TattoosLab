"use client";

import { cn } from "@/utils/cn";
import {
  AspectRatio,
  aspectRatioLabels,
} from "@/lib/validations/generation";
import { Square, RectangleVertical, Smartphone, Monitor } from "lucide-react";

const aspectRatios: { value: AspectRatio; icon: React.ElementType }[] = [
  { value: "1:1", icon: Square },
  { value: "4:5", icon: RectangleVertical },
  { value: "9:16", icon: Smartphone },
  { value: "16:9", icon: Monitor },
];

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">Aspect Ratio</label>
      <div className="grid grid-cols-4 gap-2">
        {aspectRatios.map((ratio) => {
          const Icon = ratio.icon;
          const isSelected = value === ratio.value;
          return (
            <button
              key={ratio.value}
              type="button"
              onClick={() => onChange(ratio.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{aspectRatioLabels[ratio.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
