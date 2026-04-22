"use client";

import { Wand2, Upload, Palette, Download, Sparkles, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wand2,
    title: "AI Tattoo Generation",
    description:
      "Describe your dream tattoo and watch AI bring it to life in seconds. From minimalist to intricate designs.",
  },
  {
    icon: Upload,
    title: "Body Preview",
    description:
      "Upload a photo of your body and see exactly how the tattoo will look before making any commitments.",
  },
  {
    icon: Palette,
    title: "50+ Art Styles",
    description:
      "Explore geometric, watercolor, traditional, neo-traditional, Japanese, and many more artistic styles.",
  },
  {
    icon: Download,
    title: "High-Res Downloads",
    description:
      "Download your designs in stunning 4K resolution, perfect for showing to your tattoo artist.",
  },
  {
    icon: Sparkles,
    title: "Smart Refinement",
    description:
      "Iterate and refine your designs with natural language feedback until it's exactly what you envisioned.",
  },
  {
    icon: Layers,
    title: "Style Mixing",
    description:
      "Combine multiple tattoo styles to create something truly unique and personalized to your taste.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything You Need to
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Design Your Tattoo
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Professional-grade AI tools designed specifically for tattoo enthusiasts
            and artists alike.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-brand-500/50 hover:bg-white/10"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600/20 to-pink-600/20">
                  <feature.icon className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
