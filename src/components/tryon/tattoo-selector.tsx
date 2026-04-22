"use client";

import { useState } from "react";
import { ImageIcon, Upload, Sparkles, Grid3X3 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TattooSelectorProps {
  value?: string;
  onChange: (url: string, source: "GENERATED" | "UPLOADED" | "GALLERY") => void;
  onUpload?: (file: File) => Promise<string>;
  generatedTattoos?: { id: string; url: string; prompt: string }[];
}

type TabType = "generated" | "upload" | "gallery";

export function TattooSelector({
  value,
  onChange,
  onUpload,
  generatedTattoos = [],
}: TattooSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("generated");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url, "UPLOADED");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const tabs = [
    { id: "generated" as TabType, label: "My Designs", icon: Sparkles },
    { id: "upload" as TabType, label: "Upload", icon: Upload },
    { id: "gallery" as TabType, label: "Gallery", icon: Grid3X3 },
  ];

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-white">
        Select Tattoo Design
      </label>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
              activeTab === tab.id
                ? "bg-brand-600 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="p-4 border-white/10 bg-white/5">
        {activeTab === "generated" && (
          <div className="space-y-4">
            {generatedTattoos.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">No generated designs yet</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Generate a Tattoo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {generatedTattoos.map((tattoo) => (
                  <button
                    key={tattoo.id}
                    onClick={() => onChange(tattoo.url, "GENERATED")}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      value === tattoo.url
                        ? "border-brand-500 ring-2 ring-brand-500/20"
                        : "border-transparent hover:border-white/20"
                    )}
                  >
                    <img
                      src={tattoo.url}
                      alt={tattoo.prompt}
                      className="w-full h-full object-cover"
                    />
                    {value === tattoo.url && (
                      <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-brand-600 flex items-center justify-center">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="py-8">
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
                {isUploading ? (
                  <div className="h-8 w-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-white/60" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">
                  {isUploading ? "Uploading..." : "Upload Tattoo Image"}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  JPG, PNG, WebP up to 10MB
                </p>
              </div>
            </label>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="text-center py-8">
            <Grid3X3 className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">Community gallery coming soon</p>
          </div>
        )}
      </Card>

      {/* Selected Preview */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-500/10 border border-brand-500/30">
          <img
            src={value}
            alt="Selected tattoo"
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Tattoo selected
            </p>
            <p className="text-xs text-white/60">
              Ready to place on your photo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
