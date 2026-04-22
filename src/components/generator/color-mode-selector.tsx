"use client";

import { cn } from "@/utils/cn";
import {
  ColorMode,
  colorModeLabels,
} from "@/lib/validations/generation";
import { Circle, Palette, Droplet } from "lucide-react";

const colorModes: { value: ColorMode; icon: React.ElementType }[] = [
  { value: "black_and_grey", icon: Circle },
  { value: "full_color", icon: Palette },
  { value: "single_color", icon: Droplet },
];

interface ColorModeSelectorProps {
  value: ColorMode;
  onChange: (mode: ColorMode) => void;
}

export function ColorModeSelector({ value, onChange }: ColorModeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">Color Mode</label>
      <div className="grid grid-cols-3 gap-3">
        {colorModes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = value === mode.value;
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  mode.value === "black_and_grey" && "text-gray-400",
                  mode.value === "full_color" && "text-pink-400",
                  mode.value === "single_color" && "text-brand-400"
                )}
              />
              <span className="text-sm">{colorModeLabels[mode.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
