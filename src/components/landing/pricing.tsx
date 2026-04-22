"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    credits: 3,
    features: [
      "3 AI generations",
      "Standard resolution",
      "Basic styles",
      "Community gallery access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For serious tattoo seekers",
    credits: 50,
    features: [
      "50 AI generations/month",
      "4K resolution downloads",
      "All 50+ styles",
      "Body preview feature",
      "Priority generation",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Studio",
    price: "$29.99",
    period: "/month",
    description: "For tattoo artists & studios",
    credits: 200,
    features: [
      "200 AI generations/month",
      "4K + vector exports",
      "All styles + custom training",
      "Client management",
      "White-label options",
      "API access",
    ],
    cta: "Get Studio",
    popular: false,
    href: "/dashboard/settings",
  },
];

const planLinks: Record<string, string> = {
  Free: "/sign-up",
  Pro: "/dashboard/settings",
  Studio: "/dashboard/settings",
};

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, Transparent
            <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Start free, upgrade when you are ready. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-white/10 backdrop-blur-sm ${
                plan.popular
                  ? "bg-gradient-to-b from-brand-600/20 to-pink-600/20 border-brand-500/50"
                  : "bg-white/5"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <p className="text-sm text-white/60">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-white/60">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-brand-400">
                  {plan.credits} credits/month
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={planLinks[plan.name] || "/sign-up"}>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
