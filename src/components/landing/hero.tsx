"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
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
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-pink-600/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-pink-600">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-white/60">AI Tattoo Preview</p>
                </div>
              </div>
              {/* Floating Cards */}
              <div className="absolute top-4 right-4 rounded-lg border border-white/10 bg-black/80 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/60">Style</p>
                <p className="text-sm font-medium text-white">Geometric</p>
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/80 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/60">Generated in</p>
                <p className="text-sm font-medium text-white">2.4 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
