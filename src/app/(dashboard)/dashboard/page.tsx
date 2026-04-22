"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  Wand2,
  Camera,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Image,
  Heart,
  ArrowRight,
  CreditCard,
  Palette,
} from "lucide-react";

const quickActions = [
  {
    title: "Generate Tattoo",
    description: "Create a new AI tattoo design",
    icon: Wand2,
    href: "/dashboard/generate",
    color: "from-brand-600 to-brand-400",
  },
  {
    title: "Try On",
    description: "Preview tattoo on your body",
    icon: Camera,
    href: "/dashboard/try-on",
    color: "from-pink-600 to-pink-400",
  },
  {
    title: "Settings",
    description: "Manage subscription & account",
    icon: Settings,
    href: "/dashboard/settings",
    color: "from-blue-600 to-blue-400",
  },
];

const recentDesigns = [
  {
    prompt: "Sacred geometry mandala with golden ratios",
    style: "Geometric",
    createdAt: "2 hours ago",
    status: "completed",
  },
  {
    prompt: "Watercolor koi fish with cherry blossoms",
    style: "Japanese",
    createdAt: "Yesterday",
    status: "completed",
  },
  {
    prompt: "Minimalist single line portrait",
    style: "Minimalist",
    createdAt: "3 days ago",
    status: "completed",
  },
];

const usageStats = {
  creditsUsed: 23,
  creditsTotal: 50,
  generationsThisMonth: 23,
  designsSaved: 12,
  favoritesCount: 8,
};

export default function DashboardPage() {
  const creditPercent = (usageStats.creditsUsed / usageStats.creditsTotal) * 100;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-white/60">
            Welcome back! Here is what is happening with your account.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="group border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-500/30 transition-all cursor-pointer h-full">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {action.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Usage Stats */}
          <Card className="border-white/10 bg-white/5 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-brand-400" />
                  Credit Usage
                </CardTitle>
                <Badge variant="outline" className="border-white/10 text-white/60">
                  Pro Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">
                    {usageStats.creditsUsed} of {usageStats.creditsTotal} credits used
                  </span>
                  <span className="text-sm text-white/60">
                    {Math.round(creditPercent)}%
                  </span>
                </div>
                <Progress value={creditPercent} className="h-2 bg-white/10" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="h-5 w-5 text-brand-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {usageStats.generationsThisMonth}
                  </p>
                  <p className="text-xs text-white/50">Generations</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center mb-2">
                    <Image className="h-5 w-5 text-brand-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {usageStats.designsSaved}
                  </p>
                  <p className="text-xs text-white/50">Saved Designs</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-brand-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {usageStats.favoritesCount}
                  </p>
                  <p className="text-xs text-white/50">Favorites</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/dashboard/settings">
                  <Button variant="outline" size="sm" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Manage Subscription
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" size="sm">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Plan Info */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-400" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-600/20 to-pink-600/20 border border-brand-500/20">
                <p className="text-lg font-bold text-white">Pro</p>
                <p className="text-sm text-white/60">$9.99/month</p>
                <div className="mt-3 space-y-2">
                  {[
                    "50 generations/month",
                    "4K resolution",
                    "All 50+ styles",
                    "Body preview",
                    "Priority generation",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 text-center">
                Next billing date: February 15, 2025
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Designs */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-400" />
                Recent Designs
              </CardTitle>
              <Link href="/gallery">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDesigns.map((design, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-600/30 to-pink-600/30 flex items-center justify-center">
                      <Palette className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {design.prompt}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="border-white/10 text-white/50 text-xs"
                        >
                          {design.style}
                        </Badge>
                        <span className="text-xs text-white/40">
                          {design.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-0 capitalize">
                    {design.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
}
