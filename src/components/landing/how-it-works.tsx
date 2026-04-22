"use client";

import { MessageSquare, Wand2, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Describe Your Idea",
    description:
      "Tell us what you want in plain English. Be as detailed or as vague as you like.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI Generates Options",
    description:
      "Our AI creates multiple unique designs based on your description in seconds.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Preview on Your Body",
    description:
      "Upload a photo to see exactly how the tattoo will look on your skin.",
  },
  {
    icon: Download,
    step: "04",
    title: "Download & Get Inked",
    description:
      "Save your design in high resolution and take it to your favorite tattoo artist.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Works
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            From idea to ink in four simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-brand-600/50 to-transparent" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600/20 to-pink-600/20 border border-white/10">
                    <item.icon className="h-10 w-10 text-brand-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
