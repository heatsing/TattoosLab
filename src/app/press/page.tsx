import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Newspaper, Download, ExternalLink, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Press - Tattoos Lab",
  description: "Media resources, press coverage, and company news.",
};

const pressReleases = [
  {
    title: "Tattoos Lab Raises $2.5M Seed Round to Expand AI Tattoo Platform",
    date: "December 10, 2024",
    source: "Company News",
  },
  {
    title: "Tattoos Lab Launches AR Try-On Feature for Realistic Tattoo Preview",
    date: "November 5, 2024",
    source: "Product Update",
  },
  {
    title: "Tattoos Lab Surpasses 50,000 AI-Generated Designs",
    date: "October 20, 2024",
    source: "Milestone",
  },
];

const coverage = [
  {
    publication: "Wired",
    title: "How AI is Revolutionizing the Ancient Art of Tattooing",
    date: "January 2025",
  },
  {
    publication: "TechCrunch",
    title: "Tattoos Lab Wants to Be the Canva of Tattoo Design",
    date: "December 2024",
  },
  {
    publication: "Tattoo Life Magazine",
    title: "Digital to Skin: The New Workflow for Modern Tattoo Artists",
    date: "November 2024",
  },
  {
    publication: "The Verge",
    title: "This AI Tool Lets You Try Before You Ink",
    date: "October 2024",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Newspaper className="h-4 w-4" />
              Press Room
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              In the{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                News
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Media resources, press coverage, and the latest company announcements.
            </p>
          </div>

          {/* Brand Kit */}
          <Card className="border-white/10 bg-white/5 mb-12 overflow-hidden">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Download Brand Kit</h2>
                <p className="text-white/60">
                  Logos, brand guidelines, product screenshots, and executive bios.
                </p>
              </div>
              <Button className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                Download Assets
              </Button>
            </CardContent>
          </Card>

          {/* Press Releases */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((item, i) => (
                <Card key={i} className="border-white/10 bg-white/5 hover:border-brand-500/30 transition-all cursor-pointer">
                  <CardContent className="p-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-brand-400 font-medium">{item.source}</span>
                      <h3 className="font-semibold text-white mt-1">{item.title}</h3>
                      <p className="text-sm text-white/50 mt-1">{item.date}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-white/30 shrink-0 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Media Coverage */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Media Coverage</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {coverage.map((item, i) => (
                <Card key={i} className="border-white/10 bg-white/5 hover:border-brand-500/30 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <span className="text-sm font-semibold text-brand-400">{item.publication}</span>
                    <h3 className="font-semibold text-white mt-2 mb-3">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5">
            <Quote className="h-10 w-10 text-brand-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Press Inquiries</h3>
            <p className="text-white/60 max-w-lg mx-auto mb-4">
              For interview requests, media kits, or partnership opportunities,
              reach out to our communications team.
            </p>
            <p className="text-brand-400 font-medium">press@tattooslab.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
