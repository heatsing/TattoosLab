"use client";

import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import { cn } from "@/utils/cn";
import { TransformState, BlendMode } from "@/lib/validations/tryon";

interface TransformCanvasProps {
  bodyImageUrl: string;
  tattooImageUrl: string;
  transform: TransformState;
  onTransformChange: (transform: TransformState) => void;
  className?: string;
}

export interface TransformCanvasHandle {
  exportImage: () => string;
}

interface Point {
  x: number;
  y: number;
}

export const TransformCanvas = forwardRef<
  TransformCanvasHandle,
  TransformCanvasProps
>(function TransformCanvas(
  { bodyImageUrl, tattooImageUrl, transform, onTransformChange, className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState({
    body: false,
    tattoo: false,
  });

  useImperativeHandle(
    ref,
    () => ({
      exportImage: () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.toDataURL("image/png", 1.0) : "";
      },
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setImagesLoaded({ body: false, tattoo: false });

    const bodyImg = new Image();
    const tattooImg = new Image();

    bodyImg.crossOrigin = "anonymous";
    tattooImg.crossOrigin = "anonymous";

    bodyImg.onload = () => {
      canvas.width = bodyImg.naturalWidth;
      canvas.height = bodyImg.naturalHeight;
      setImagesLoaded((prev) => ({ ...prev, body: true }));
      draw();
    };

    tattooImg.onload = () => {
      setImagesLoaded((prev) => ({ ...prev, tattoo: true }));
      draw();
    };

    bodyImg.src = bodyImageUrl;
    tattooImg.src = tattooImageUrl;

    function draw() {
      const activeCanvas = canvasRef.current;
      const activeCtx = activeCanvas?.getContext("2d");

      if (!activeCanvas || !activeCtx || !bodyImg.complete || !tattooImg.complete) {
        return;
      }

      activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      activeCtx.drawImage(bodyImg, 0, 0);

      const centerX = transform.positionX * activeCanvas.width;
      const centerY = transform.positionY * activeCanvas.height;
      const baseSize = Math.min(activeCanvas.width, activeCanvas.height) * 0.3;
      const scaledSize = baseSize * transform.scale;
      const tattooWidth = scaledSize;
      const tattooHeight =
        (tattooImg.naturalHeight / tattooImg.naturalWidth) * tattooWidth;

      activeCtx.save();
      activeCtx.translate(centerX, centerY);
      activeCtx.rotate((transform.rotation * Math.PI) / 180);
      activeCtx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
      activeCtx.globalCompositeOperation = getCompositeOperation(transform.blendMode);
      activeCtx.globalAlpha = transform.opacity;
      activeCtx.drawImage(
        tattooImg,
        -tattooWidth / 2,
        -tattooHeight / 2,
        tattooWidth,
        tattooHeight
      );
      activeCtx.restore();
    }

    return () => {
      bodyImg.onload = null;
      tattooImg.onload = null;
    };
  }, [bodyImageUrl, tattooImageUrl, transform]);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(getEventPoint(e));
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const point = getEventPoint(e);
      const rect = canvas.getBoundingClientRect();
      const deltaX = (point.x - dragStart.x) / rect.width;
      const deltaY = (point.y - dragStart.y) / rect.height;

      onTransformChange({
        ...transform,
        positionX: Math.max(0, Math.min(1, transform.positionX + deltaX)),
        positionY: Math.max(0, Math.min(1, transform.positionY + deltaY)),
      });

      setDragStart(point);
    },
    [dragStart, isDragging, onTransformChange, transform]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const isReady = imagesLoaded.body && imagesLoaded.tattoo;

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-black", className)}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
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
          "h-full w-full cursor-move object-contain transition-opacity",
          isReady ? "opacity-100" : "opacity-0",
          isDragging && "cursor-grabbing"
        )}
      />

      {isReady && !isDragging && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
          Drag to move - Use controls to adjust
        </div>
      )}
    </div>
  );
});

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

function getEventPoint(e: React.MouseEvent | React.TouchEvent): Point {
  if ("touches" in e) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  return {
    x: (e as React.MouseEvent).clientX,
    y: (e as React.MouseEvent).clientY,
  };
}
