import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Sparkles, Target, Users, Zap, Heart, Globe, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us - Tattoos Lab",
  description: "Learn about Tattoos Lab's mission to revolutionize tattoo design with AI technology.",
};

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Pushing the boundaries of AI to create tools that were previously impossible.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We are tattoo enthusiasts building for tattoo enthusiasts. Every feature is crafted with care.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Our users are our greatest asset. We listen, learn, and build together with our community.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Great tattoo design should be accessible to everyone, regardless of artistic background.",
  },
];

const milestones = [
  { year: "2023", title: "The Beginning", description: "Tattoos Lab founded with a vision to democratize tattoo design." },
  { year: "2024", title: "AI Launch", description: "Released our first AI tattoo generator with 20+ art styles." },
  { year: "2024", title: "Try-On Feature", description: "Introduced AR body preview technology for realistic tattoo visualization." },
  { year: "2025", title: "Global Community", description: "Reached 10,000+ active users and 50,000+ designs created." },
];

const team = [
  { name: "Alex Rivera", role: "Founder & CEO", initials: "AR" },
  { name: "Mia Chen", role: "Head of Design", initials: "MC" },
  { name: "James Okafor", role: "Lead Engineer", initials: "JO" },
  { name: "Sofia Lindberg", role: "Community Manager", initials: "SL" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Our Story
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              Designing the Future of
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Tattoo Art
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Tattoos Lab was born from a simple belief: everyone deserves to wear
              art that tells their unique story. We combine cutting-edge AI with
              deep respect for tattoo culture to make that possible.
            </p>
          </div>

          {/* Mission */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-white/60 mb-4">
                We exist to bridge the gap between imagination and ink. For too long,
                getting the perfect tattoo design required either exceptional artistic
                talent or expensive consultations. We are changing that.
              </p>
              <p className="text-white/60 mb-6">
                By harnessing the power of artificial intelligence, we empower anyone
                to visualize, design, and perfect their tattoo before committing to
                the needle. Our tools respect the artistry of tattoo culture while
                making it accessible to all.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-400">10K+</p>
                  <p className="text-sm text-white/50">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-400">50K+</p>
                  <p className="text-sm text-white/50">Designs Created</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-400">50+</p>
                  <p className="text-sm text-white/50">Art Styles</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-pink-600/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="h-24 w-24 text-brand-400/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                      <value.icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-white/60">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Journey</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                      {m.year.slice(-2)}
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs text-brand-400 font-medium">{m.year}</span>
                    <h3 className="text-lg font-semibold text-white mt-1">{m.title}</h3>
                    <p className="text-white/60 mt-1">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="border-white/10 bg-white/5 text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-brand-600 to-pink-600 flex items-center justify-center text-xl font-bold text-white">
                      {member.initials}
                    </div>
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-white/60">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5">
            <Award className="h-10 w-10 text-brand-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Recognized Excellence</h3>
            <p className="text-white/60 max-w-lg mx-auto">
              Winner of the 2024 AI Innovation Award for Creative Technology. Featured in
              Wired, TechCrunch, and Tattoo Life Magazine.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
