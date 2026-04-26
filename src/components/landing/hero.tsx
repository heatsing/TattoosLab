"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Clock3,
  Play,
  ScanSearch,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const heroPreviewFrames = [
  {
    prompt: "Geometric phoenix with eclipse halo and razor-clean blackwork",
    style: "Blackwork",
    timing: "2.1s",
    stage: "Balancing wing symmetry",
    image:
      "https://images.unsplash.com/photo-1614179688766-3d197a6996c4?w=900&h=900&fit=crop&q=80",
    chips: ["Geometric", "Forearm", "High contrast"],
  },
  {
    prompt: "Watercolor koi with cherry blossoms flowing around the shoulder",
    style: "Watercolor",
    timing: "3.4s",
    stage: "Blending pigment edges",
    image:
      "https://images.unsplash.com/photo-1551913902-c92207136625?w=900&h=900&fit=crop&q=80",
    chips: ["Shoulder", "Painterly", "Soft color"],
  },
  {
    prompt: "Minimalist mountain line tattoo with a tiny rising sun accent",
    style: "Minimalist",
    timing: "1.8s",
    stage: "Refining line weight",
    image:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&h=900&fit=crop&q=80",
    chips: ["Minimal", "Wrist", "Fine line"],
  },
] as const;

export function Hero() {
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % heroPreviewFrames.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentFrame = heroPreviewFrames[activeFrame];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            <Badge className="mb-6">
              <Zap className="mr-1 h-3 w-3" />
              AI-Powered Tattoo Design
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Design Your Perfect
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Tattoo
              </span>
              {" "}in Seconds
            </h1>

            <p className="mt-6 text-lg text-white/70">
              Transform your ideas into stunning tattoo designs with AI. Preview
              how they look on your body before you commit. No artistic skills
              required.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/generate">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-black bg-gradient-to-br from-brand-500 to-pink-500"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/60">
                  Trusted by 10,000+ tattoo enthusiasts
                </p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),_transparent_38%)]" />

              <div className="absolute inset-x-5 top-5 rounded-[24px] border border-white/10 bg-black/70 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                        Prompt to Tattoo
                      </p>
                      <p className="text-sm font-medium text-white/75">
                        Dynamic AI generation preview
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.75)]" />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Describe your idea
                  </p>
                  <p className="mt-2 text-base font-medium leading-7 text-white">
                    {currentFrame.prompt}
                    <span className="ml-1 animate-pulse text-brand-300">|</span>
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {currentFrame.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-5 top-[12.5rem]">
                <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ScanSearch className="h-4 w-4 text-brand-300" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                          AI Processing
                        </p>
                        <p className="text-sm font-medium text-white">
                          {currentFrame.stage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                      <Clock3 className="h-3.5 w-3.5" />
                      {currentFrame.timing}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03]">
                    {heroPreviewFrames.map((frame, index) => (
                      <div
                        key={frame.prompt}
                        className={`absolute inset-0 transition-all duration-700 ${
                          index === activeFrame
                            ? "scale-100 opacity-100"
                            : "scale-105 opacity-0"
                        }`}
                      >
                        <Image
                          src={frame.image}
                          alt={frame.prompt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-black/10" />
                      </div>
                    ))}

                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                      <div className="rounded-full border border-white/10 bg-black/65 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                        AI Tattoo Preview
                      </div>
                      <div className="rounded-full border border-white/10 bg-black/65 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                        {currentFrame.style}
                      </div>
                    </div>

                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-60 animate-[pulse_1.8s_ease-in-out_infinite]" />

                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                            Result
                          </p>
                          <p className="mt-1 text-sm font-medium text-white">
                            Ready to refine or try on
                          </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {["Describe", "Generate", "Try on"].map((step, index) => (
                      <div
                        key={step}
                        className={`rounded-2xl border px-3 py-3 text-center transition-all ${
                          index < 2
                            ? "border-brand-500/30 bg-brand-500/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/55"
                        }`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                          0{index + 1}
                        </p>
                        <p className="mt-1 text-sm font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
