"use client";

import { Camera, RefreshCw, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Camera,
    title: "Upload Your Photo",
    description: "Take a photo of the area where you want your tattoo",
  },
  {
    icon: RefreshCw,
    title: "AI Processing",
    description: "Our AI analyzes your body contours and skin tone",
  },
  {
    icon: Check,
    title: "See The Result",
    description: "View realistic preview of how the tattoo will look",
  },
];

export function TryOnSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Try Before You
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Ink
              </span>
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Our advanced AR technology lets you preview tattoos on your actual
              body. See size, placement, and how it flows with your anatomy before
              making a lifelong commitment.
            </p>

            <div className="mt-8 space-y-6">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-400 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <step.icon className="h-4 w-4" />
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/dashboard/try-on">
                <Button size="lg">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-pink-600/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-pink-600">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-white font-medium">AR Preview Demo</p>
                  <p className="text-sm text-white/60">See tattoos on your body</p>
                </div>
              </div>
              {/* Mock UI Elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="rounded-full bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  Live Preview
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm" />
                  <div className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm" />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 rounded-xl border border-white/10 bg-black/90 p-4 backdrop-blur-sm">
              <p className="text-xs text-white/60">Realistic Rendering</p>
              <p className="text-lg font-bold text-white">98% Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
