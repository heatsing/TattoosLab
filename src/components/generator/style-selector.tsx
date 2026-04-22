"use client";

import { cn } from "@/utils/cn";
import {
  TattooStyle,
  styleLabels,
} from "@/lib/validations/generation";
import {
  Hexagon,
  Droplets,
  Anchor,
  Sparkles,
  Minimize2,
  Waves,
  CircleDot,
  Eye,
  Mountain,
  Palmtree,
  Paintbrush,
  Pencil,
  Brush,
} from "lucide-react";

const styles: { value: TattooStyle; icon: React.ElementType }[] = [
  { value: "geometric", icon: Hexagon },
  { value: "watercolor", icon: Droplets },
  { value: "traditional", icon: Anchor },
  { value: "neo_traditional", icon: Sparkles },
  { value: "minimalist", icon: Minimize2 },
  { value: "japanese", icon: Waves },
  { value: "blackwork", icon: CircleDot },
  { value: "dotwork", icon: Eye },
  { value: "realistic", icon: Eye },
  { value: "tribal", icon: Mountain },
  { value: "new_school", icon: Palmtree },
  { value: "line_art", icon: Pencil },
  { value: "illustrative", icon: Brush },
];

interface StyleSelectorProps {
  value: TattooStyle;
  onChange: (style: TattooStyle) => void;
  error?: string;
}

export function StyleSelector({ value, onChange, error }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">
        Tattoo Style <span className="text-red-400">*</span>
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = value === style.value;
          return (
            <button
              key={style.value}
              type="button"
              onClick={() => onChange(style.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs text-center leading-tight">
                {styleLabels[style.value]}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
