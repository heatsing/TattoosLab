"use client";

import { TransformState, BlendMode, blendModeLabels, blendModeDescriptions } from "@/lib/validations/tryon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Layers,
  RefreshCcw,
} from "lucide-react";

interface TransformControlsProps {
  transform: TransformState;
  onChange: (transform: TransformState) => void;
  onReset: () => void;
}

export function TransformControls({
  transform,
  onChange,
  onReset,
}: TransformControlsProps) {
  const updateTransform = (updates: Partial<TransformState>) => {
    onChange({ ...transform, ...updates });
  };

  return (
    <Card className="p-4 border-white/10 bg-white/5 space-y-6">
      {/* Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-brand-400" />
            Size
          </label>
          <span className="text-sm text-white/60">{Math.round(transform.scale * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.05"
          value={transform.scale}
          onChange={(e) => updateTransform({ scale: parseFloat(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ scale: Math.max(0.1, transform.scale - 0.1) })}
          >
            <ZoomOut className="h-4 w-4 mr-1" />
            Smaller
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ scale: Math.min(3, transform.scale + 0.1) })}
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            Larger
          </Button>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-brand-400" />
            Rotation
          </label>
          <span className="text-sm text-white/60">{Math.round(transform.rotation)}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          step="5"
          value={transform.rotation}
          onChange={(e) => updateTransform({ rotation: parseFloat(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ rotation: transform.rotation - 15 })}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            -15°
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ rotation: transform.rotation + 15 })}
          >
            <RotateCw className="h-4 w-4 mr-1" />
            +15°
          </Button>
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Sun className="h-4 w-4 text-brand-400" />
            Opacity
          </label>
          <span className="text-sm text-white/60">{Math.round(transform.opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={transform.opacity}
          onChange={(e) => updateTransform({ opacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />
      </div>

      {/* Blend Mode */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-400" />
          Blend Mode
        </label>
        <select
          value={transform.blendMode}
          onChange={(e) => updateTransform({ blendMode: e.target.value as BlendMode })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
        >
          {Object.entries(blendModeLabels).map(([value, label]) => (
            <option key={value} value={value} className="bg-zinc-900">
              {label}
            </option>
          ))}
        </select>
        <p className="text-xs text-white/40">
          {blendModeDescriptions[transform.blendMode]}
        </p>
      </div>

      {/* Flip */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Flip</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={transform.flipX ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ flipX: !transform.flipX })}
          >
            <FlipHorizontal className="h-4 w-4 mr-1" />
            Horizontal
          </Button>
          <Button
            type="button"
            variant={transform.flipY ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => updateTransform({ flipY: !transform.flipY })}
          >
            <FlipVertical className="h-4 w-4 mr-1" />
            Vertical
          </Button>
        </div>
      </div>

      {/* Reset */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-white/60 hover:text-white"
        onClick={onReset}
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Reset All
      </Button>
    </Card>
  );
}
