import type { Metadata } from "next";
import {
  Download,
  ExternalLink,
  Newspaper,
  Quote,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Press - Tattoos Lab",
  description: "Press information and contact details for Tattoos Lab.",
};

const updates = [
  {
    title: "Billing and subscriptions are being finalized for public launch",
    date: "Current",
    source: "Product update",
  },
  {
    title: "AI tattoo generation, saved history, and try-on workflows are live in the product",
    date: "Current",
    source: "Feature status",
  },
  {
    title: "Press assets and partnership materials are available by request",
    date: "Current",
    source: "Media resources",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm text-brand-400">
              <Newspaper className="h-4 w-4" />
              Press Room
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Press and
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}media information
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Tattoos Lab is an early-stage product. We are not publishing a long
              coverage list or a brand-asset download bundle yet, but we are happy
              to share accurate product context with media and partners.
            </p>
          </div>

          <Card className="mb-12 overflow-hidden border-white/10 bg-white/5">
            <CardContent className="flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
              <div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  Press kit on request
                </h2>
                <p className="text-white/60">
                  Product screenshots, logo files, and a short company summary are
                  available by email for legitimate press and partnership requests.
                </p>
              </div>
              <Button className="shrink-0 gap-2" asChild>
                <a href="mailto:press@tattooslab.com">
                  <Download className="h-4 w-4" />
                  Request Assets
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-white">Current Updates</h2>
            <div className="space-y-4">
              {updates.map((item) => (
                <Card
                  key={item.title}
                  className="cursor-default border-white/10 bg-white/5 transition-all"
                >
                  <CardContent className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <span className="text-xs font-medium text-brand-400">
                        {item.source}
                      </span>
                      <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{item.date}</p>
                    </div>
                    <ExternalLink className="mt-1 h-5 w-5 shrink-0 text-white/20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Quote className="mx-auto mb-4 h-10 w-10 text-brand-400" />
            <h3 className="mb-2 text-xl font-bold text-white">Press inquiries</h3>
            <p className="mx-auto mb-4 max-w-lg text-white/60">
              If you are writing about AI creative tools, tattoo workflow software,
              or visual preview products, reach out and we will provide current,
              accurate product information.
            </p>
            <p className="font-medium text-brand-400">press@tattooslab.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}