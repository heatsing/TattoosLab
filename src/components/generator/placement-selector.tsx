"use client";

import { cn } from "@/utils/cn";
import {
  BodyPlacement,
  bodyPlacementLabels,
} from "@/lib/validations/generation";

const placements: BodyPlacement[] = [
  "arm",
  "forearm",
  "wrist",
  "shoulder",
  "chest",
  "back",
  "leg",
  "thigh",
  "calf",
  "ankle",
  "neck",
  "ribcage",
  "hand",
  "foot",
];

interface PlacementSelectorProps {
  value?: BodyPlacement;
  onChange: (placement: BodyPlacement | undefined) => void;
}

export function PlacementSelector({ value, onChange }: PlacementSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">
        Body Placement <span className="text-white/40">(Optional)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm border transition-all duration-200",
            value === undefined
              ? "border-brand-500 bg-brand-500/20 text-white"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10"
          )}
        >
          Any
        </button>
        {placements.map((placement) => (
          <button
            key={placement}
            type="button"
            onClick={() => onChange(placement)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm border transition-all duration-200",
              value === placement
                ? "border-brand-500 bg-brand-500/20 text-white"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10"
            )}
          >
            {bodyPlacementLabels[placement]}
          </button>
        ))}
      </div>
    </div>
  );
}
