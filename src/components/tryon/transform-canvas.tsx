"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { TransformState, BlendMode } from "@/lib/validations/tryon";

interface TransformCanvasProps {
  bodyImageUrl: string;
  tattooImageUrl: string;
  transform: TransformState;
  onTransformChange: (transform: TransformState) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

export function TransformCanvas({
  bodyImageUrl,
  tattooImageUrl,
  transform,
  onTransformChange,
  className,
}: TransformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState({ body: false, tattoo: false });

  // Load and draw images
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bodyImg = new Image();
    const tattooImg = new Image();

    bodyImg.crossOrigin = "anonymous";
    tattooImg.crossOrigin = "anonymous";

    bodyImg.onload = () => {
      setImagesLoaded((prev) => ({ ...prev, body: true }));
      // Set canvas size to match body image
      canvas.width = bodyImg.naturalWidth;
      canvas.height = bodyImg.naturalHeight;
      draw();
    };

    tattooImg.onload = () => {
      setImagesLoaded((prev) => ({ ...prev, tattoo: true }));
      draw();
    };

    bodyImg.src = bodyImageUrl;
    tattooImg.src = tattooImageUrl;

    function draw() {
      if (!ctx || !bodyImg.complete || !tattooImg.complete) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw body image
      ctx.drawImage(bodyImg, 0, 0);

      // Calculate tattoo position and size
      const centerX = transform.positionX * canvas.width;
      const centerY = transform.positionY * canvas.height;
      
      // Base size relative to canvas
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3;
      const scaledSize = baseSize * transform.scale;
      
      const tattooWidth = scaledSize;
      const tattooHeight = (tattooImg.naturalHeight / tattooImg.naturalWidth) * tattooWidth;

      // Save context for transformations
      ctx.save();

      // Move to position
      ctx.translate(centerX, centerY);
      
      // Rotate
      ctx.rotate((transform.rotation * Math.PI) / 180);
      
      // Flip
      ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);

      // Apply blend mode
      ctx.globalCompositeOperation = getCompositeOperation(transform.blendMode);
      ctx.globalAlpha = transform.opacity;

      // Draw tattoo centered
      ctx.drawImage(
        tattooImg,
        -tattooWidth / 2,
        -tattooHeight / 2,
        tattooWidth,
        tattooHeight
      );

      ctx.restore();
    }

    function getCompositeOperation(mode: BlendMode): GlobalCompositeOperation {
      const operations: Record<BlendMode, GlobalCompositeOperation> = {
        NORMAL: "source-over",
        MULTIPLY: "multiply",
        SCREEN: "screen",
        OVERLAY: "overlay",
        SOFT_LIGHT: "soft-light",
        HARD_LIGHT: "hard-light",
        DARKEN: "darken",
        LIGHTEN: "lighten",
      };
      return operations[mode] || "multiply";
    }

    return () => {
      bodyImg.onload = null;
      tattooImg.onload = null;
    };
  }, [bodyImageUrl, tattooImageUrl, transform]);

  // Handle mouse/touch events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const point = getEventPoint(e);
    setDragStart(point);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getEventPoint(e);
    const rect = canvas.getBoundingClientRect();
    
    // Calculate delta in normalized coordinates
    const deltaX = (point.x - dragStart.x) / rect.width;
    const deltaY = (point.y - dragStart.y) / rect.height;

    onTransformChange({
      ...transform,
      positionX: Math.max(0, Math.min(1, transform.positionX + deltaX)),
      positionY: Math.max(0, Math.min(1, transform.positionY + deltaY)),
    });

    setDragStart(point);
  }, [isDragging, dragStart, transform, onTransformChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getEventPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
  };

  // Export canvas as data URL
  const exportImage = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png", 1.0);
  }, []);

  const isReady = imagesLoaded.body && imagesLoaded.tattoo;

  return (
    <div
      ref={containerRef}
      className={cn("relative rounded-xl overflow-hidden bg-black", className)}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={cn(
          "w-full h-full object-contain cursor-move transition-opacity",
          isReady ? "opacity-100" : "opacity-0",
          isDragging && "cursor-grabbing"
        )}
      />

      {/* Drag hint */}
      {isReady && !isDragging && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-sm pointer-events-none">
          Drag to move - Use controls to adjust
        </div>
      )}
    </div>
  );
}
