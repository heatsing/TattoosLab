"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, file?: File) => void;
  onUpload?: (file: File) => Promise<string>;
  label: string;
  description?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export function ImageUploader({
  value,
  onChange,
  onUpload,
  label,
  description = "Drop an image or click to upload",
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        await processFile(file);
      }
    },
    [onChange, onUpload]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await processFile(file);
      }
    },
    [onChange, onUpload]
  );

  const processFile = async (file: File) => {
    // Create local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    if (!onUpload) {
      onChange(localUrl, file);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      onChange(uploadedUrl, file);
      setPreviewUrl(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      // Keep local preview on error
      onChange(localUrl, file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (previewUrl) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden border border-white/10 bg-white/5", aspectRatioClasses[aspectRatio])}>
        <img
          src={previewUrl}
          alt={label}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-sm font-medium text-white">{label}</p>
          {isUploading && (
            <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Uploading...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-8",
        aspectRatioClasses[aspectRatio],
        isDragging
          ? "border-brand-500 bg-brand-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Camera className="h-8 w-8 text-white/60" />
        </div>

        <div>
          <p className="text-sm font-medium text-white">{description}</p>
          <p className="text-xs text-white/40 mt-1">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Select Image
        </Button>
      </div>
    </div>
  );
}
