import type { Metadata } from "next";
import {
  Sparkles,
  Target,
  Users,
  Zap,
  Heart,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About - Tattoos Lab",
  description:
    "Why Tattoos Lab exists and how we are building an AI tattoo design workflow.",
};

const values = [
  {
    icon: Zap,
    title: "Useful AI",
    description:
      "We focus on AI outputs that help people make better tattoo decisions, not novelty for its own sake.",
  },
  {
    icon: Heart,
    title: "Respect for Tattoo Culture",
    description:
      "This product is designed to support tattoo clients and artists, not flatten the craft into generic automation.",
  },
  {
    icon: Users,
    title: "Practical Workflow",
    description:
      "Prompting, try-on, downloads, and history should work together like one tool instead of separate demos.",
  },
  {
    icon: Globe,
    title: "Accessible Exploration",
    description:
      "People should be able to explore ideas before booking studio time or committing to permanent ink.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Concept",
    description:
      "Started from a simple question: what if tattoo inspiration, iteration, and preview lived in one product?",
  },
  {
    year: "2025",
    title: "Workflow Build-Out",
    description:
      "Added generation, saved history, and try-on tools to turn the idea into a usable product flow.",
  },
  {
    year: "Now",
    title: "Early Launch",
    description:
      "Tattoos Lab is being refined into a production SaaS with billing, permissions, and creator-ready delivery.",
  },
];

const workingStyle = [
  "Small product team shipping in public.",
  "Early-stage software that is still improving week by week.",
  "Focused on reliability, billing clarity, and artist-friendly output quality before broad promotion.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm text-brand-400">
              <Sparkles className="h-4 w-4" />
              About Tattoos Lab
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Building a better way to
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}design tattoos with AI
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Tattoos Lab is an early-stage AI tattoo platform focused on idea
              generation, visual preview, and practical decision-making before
              someone commits to real ink.
            </p>
          </div>

          <div className="mb-24 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">Our Mission</h2>
              <p className="mb-4 text-white/60">
                Tattoo decisions are high-stakes. People want to explore style,
                placement, symbolism, and composition before they sit in a chair.
                Most tools today cover one part of that journey but not the full workflow.
              </p>
              <p className="mb-6 text-white/60">
                Tattoos Lab is being built to close that gap. The goal is to help
                users move from rough idea to visual direction with less friction,
                while giving artists and studios a faster starting point for collaboration.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="mb-3 text-sm font-medium text-brand-400">Current focus</p>
                <ul className="space-y-2 text-sm text-white/70">
                  {workingStyle.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-pink-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="h-24 w-24 text-brand-400/30" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">
              Product Values
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                      <value.icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-white">{value.title}</h3>
                    <p className="text-sm text-white/60">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">
              Journey
            </h2>
            <div className="mx-auto max-w-3xl space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.title} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-white/10" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs font-medium text-brand-400">
                      {milestone.year}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {milestone.title}
                    </h3>
                    <p className="mt-1 text-white/60">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}