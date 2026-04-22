"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Heart,
  Share2,
  RefreshCw,
  Expand,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface ResultCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  onSave?: () => void;
  onDownload?: () => void;
  onRegenerate?: () => void;
  isSaved?: boolean;
}

export function ResultCard({
  imageUrl,
  prompt,
  style,
  onSave,
  onDownload,
  onRegenerate,
  isSaved = false,
}: ResultCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tattoo-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      onDownload?.();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden border-white/10 bg-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-black/50">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={prompt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={cn(
                  "bg-white/20 backdrop-blur-sm hover:bg-white/30",
                  isSaved && "bg-pink-500/50"
                )}
                onClick={onSave}
              >
                <Heart
                  className={cn("h-4 w-4", isSaved && "fill-current")}
                />
              </Button>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={() => setShowFullPrompt(true)}
            >
              <Expand className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={onRegenerate}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">
          {style}
        </p>
        <p className="text-sm text-white/80 line-clamp-2">{prompt}</p>
      </div>

      {/* Full Prompt Modal */}
      {showFullPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowFullPrompt(false)}
        >
          <div
            className="max-w-lg w-full rounded-xl bg-zinc-900 border border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full rounded-lg mb-4"
            />
            <p className="text-sm text-white/60 mb-2">Prompt:</p>
            <p className="text-white">{prompt}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => setShowFullPrompt(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
