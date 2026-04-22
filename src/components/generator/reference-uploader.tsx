"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

interface ReferenceUploaderProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  onUpload?: (file: File) => Promise<string>;
}

export function ReferenceUploader({
  value,
  onChange,
  onUpload,
}: ReferenceUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!onUpload) {
      // Fallback: create object URL
      const url = URL.createObjectURL(file);
      onChange(url);
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <img
          src={value}
          alt="Reference"
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-xs text-white/80">Reference Image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">
        Reference Image <span className="text-white/40">(Optional)</span>
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all duration-200",
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

        <div className="flex flex-col items-center gap-3 text-center">
          {isUploading ? (
            <div className="h-12 w-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Upload className="h-6 w-6 text-white/60" />
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-white">
              {isUploading ? "Uploading..." : "Drop an image or click to upload"}
            </p>
            <p className="text-xs text-white/40 mt-1">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
