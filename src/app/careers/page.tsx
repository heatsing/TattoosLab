import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  MapPin,
  Briefcase,
  Heart,
  Coffee,
  Laptop,
  Plane,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - Tattoos Lab",
  description: "Join the team building the future of AI-powered tattoo design.",
};

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage for you and your family." },
  { icon: Coffee, title: "Flexible Schedule", description: "Work when you are most productive. We care about results, not hours." },
  { icon: Laptop, title: "Remote First", description: "Work from anywhere in the world. Optional co-working stipend." },
  { icon: Plane, title: "Annual Retreat", description: "Team gatherings in inspiring locations to connect and create." },
  { icon: Users, title: "Learning Budget", description: "$2,000/year for courses, conferences, and books." },
  { icon: Briefcase, title: "Equity", description: "Meaningful stock options so you share in our success." },
];

const openings = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Content Strategist",
    department: "Marketing",
    location: "Remote",
    type: "Contract",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Join Us
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Build the Future of{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Body Art
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              We are a small but mighty team passionate about AI, design, and tattoo
              culture. Come create something extraordinary with us.
            </p>
          </div>

          {/* Culture */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Why Tattoos Lab?</h2>
              <p className="text-white/60 mb-4">
                We are not just another tech startup. We are building tools that
                genuinely impact people's lives - helping them express themselves
                through permanent art. Every line of code, every pixel, every word
                matters.
              </p>
              <p className="text-white/60 mb-6">
                Our team brings together experts in machine learning, design,
                tattoo artistry, and community building. We move fast, experiment
                boldly, and always put our users first.
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-3xl font-bold text-brand-400">12</p>
                  <p className="text-sm text-white/50">Team Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-400">8</p>
                  <p className="text-sm text-white/50">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-400">100%</p>
                  <p className="text-sm text-white/50">Remote</p>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-pink-600/20" />
              <div className="h-full flex items-center justify-center">
                <Users className="h-24 w-24 text-white/10" />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Benefits & Perks</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                      <benefit.icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-white/60">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-white text-center mb-12">Open Positions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {openings.map((job, i) => (
                <Card key={i} className="border-white/10 bg-white/5 group cursor-pointer hover:border-brand-500/30 transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-white/50">
                        <Badge variant="outline" className="border-white/10 text-white/50">
                          {job.department}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-brand-400 transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-white/40 mt-8">
              Don't see your role?{" "}
              <span className="text-brand-400 cursor-pointer">Send us your resume anyway.</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
