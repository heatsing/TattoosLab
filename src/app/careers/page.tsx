import type { Metadata } from "next";
import {
  Sparkles,
  Heart,
  Laptop,
  Users,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers - Tattoos Lab",
  description: "Hiring status and team principles for Tattoos Lab.",
};

const principles = [
  {
    icon: Heart,
    title: "Care about the outcome",
    description:
      "We care less about titles and more about whether the product becomes genuinely useful.",
  },
  {
    icon: Laptop,
    title: "Build with constraints",
    description:
      "Early-stage software needs people who can simplify systems, not just add more layers.",
  },
  {
    icon: Users,
    title: "Respect creators",
    description:
      "The product serves people making permanent decisions about their bodies and their craft.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm text-brand-400">
              <Sparkles className="h-4 w-4" />
              Careers
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Small team,
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}high ownership
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Tattoos Lab is still early. We are not publicly listing multiple open
              roles right now, but we are open to hearing from exceptional builders
              who care about AI product quality and creator workflows.
            </p>
          </div>

          <div className="mb-20 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                How we work
              </h2>
              <p className="mb-4 text-white/60">
                This is an early-stage product environment. That means product,
                design, engineering, and growth questions often overlap, and shipping
                well matters more than shipping loudly.
              </p>
              <p className="text-white/60">
                If you like ambiguous problems, tight feedback loops, and product
                work where billing, trust, and UX all matter at once, that is the
                kind of work here.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="mb-4 text-lg font-semibold text-white">
                What we value in collaborators
              </h3>
              <div className="space-y-4">
                {principles.map((principle) => (
                  <div key={principle.title} className="rounded-xl bg-white/5 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20">
                        <principle.icon className="h-5 w-5 text-brand-400" />
                      </div>
                      <h4 className="font-semibold text-white">{principle.title}</h4>
                    </div>
                    <p className="text-sm text-white/60">{principle.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  No public openings right now
                </h2>
                <p className="max-w-2xl text-white/60">
                  If you think you are unusually well-matched for this product,
                  send a concise note with your background, the role you would play,
                  and links to real work.
                </p>
              </div>
              <Button className="shrink-0 gap-2" asChild>
                <a href="mailto:careers@tattooslab.com">
                  Reach Out
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}