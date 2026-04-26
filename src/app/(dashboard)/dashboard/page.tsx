"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getDashboardOverview, DashboardOverview } from "@/app/actions/dashboard";
import { getPlanById } from "@/lib/stripe/plans";
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
  Loader2,
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

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadOverview();
  }, []);

  const loadOverview = async () => {
    setIsLoading(true);
    const result = await getDashboardOverview();
    if (result.success && result.data) {
      setOverview(result.data);
    }
    setIsLoading(false);
  };

  const usageStats = overview?.usageStats ?? {
    creditsUsed: 0,
    creditsTotal: 5,
    generationsThisMonth: 0,
    designsSaved: 0,
    favoritesCount: 0,
  };
  const creditPercent = usageStats.creditsTotal
    ? (usageStats.creditsUsed / usageStats.creditsTotal) * 100
    : 0;
  const currentPlan = getPlanById(overview?.currentTier ?? "FREE");
  const highlightedFeatures =
    currentPlan?.features.filter((feature) => feature.included).slice(0, 5) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-white/60">
              Welcome back! Here is what is happening with your account.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="group h-full cursor-pointer border-white/10 bg-white/5 transition-all hover:border-brand-500/30 hover:bg-white/10">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand-400">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">
                      {action.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Open <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <Card className="border-white/10 bg-white/5 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5 text-brand-400" />
                    Credit Usage
                  </CardTitle>
                  <Badge variant="outline" className="border-white/10 text-white/60">
                    {currentPlan?.name ?? "Free"} Plan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="mb-2 flex justify-between">
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
                      <DashboardStat
                        icon={Sparkles}
                        value={usageStats.generationsThisMonth}
                        label="Generations"
                      />
                      <DashboardStat
                        icon={Image}
                        value={usageStats.designsSaved}
                        label="Saved Designs"
                      />
                      <DashboardStat
                        icon={Heart}
                        value={usageStats.favoritesCount}
                        label="Favorites"
                      />
                    </div>
                  </>
                )}

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

            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-brand-400" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-600/20 to-pink-600/20 p-4">
                  <p className="text-lg font-bold text-white">
                    {currentPlan?.name ?? "Free"}
                  </p>
                  <p className="text-sm text-white/60">
                    {currentPlan?.priceMonthlyDisplay ?? "$0"}/month
                  </p>
                  <div className="mt-3 space-y-2">
                    {highlightedFeatures.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center gap-2 text-sm text-white/70"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                        {feature.name}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-white/40">
                  {overview?.currentPeriodEnd
                    ? `Next billing date: ${new Date(
                        overview.currentPeriodEnd
                      ).toLocaleDateString()}`
                    : "Free plan active"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
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
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                </div>
              ) : overview?.recentDesigns.length ? (
                <div className="space-y-3">
                  {overview.recentDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600/30 to-pink-600/30">
                          <Palette className="h-5 w-5 text-brand-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {design.prompt}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-white/10 text-xs text-white/50"
                            >
                              {design.style}
                            </Badge>
                            <span className="text-xs text-white/40">
                              {formatDistanceToNow(new Date(design.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="border-0 bg-green-500/20 capitalize text-green-400">
                        {design.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
                  <Palette className="mx-auto mb-4 h-10 w-10 text-white/20" />
                  <h3 className="text-lg font-medium text-white">
                    No designs yet
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    Generate your first tattoo to see activity here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DashboardStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Sparkles;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-center">
      <div className="mb-2 flex items-center justify-center">
        <Icon className="h-5 w-5 text-brand-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
