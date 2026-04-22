import { Metadata } from "next";
import { PricingCards } from "@/components/subscription/pricing-cards";
import { getCurrentSubscription } from "@/app/actions/subscription";

export const metadata: Metadata = {
  title: "Pricing | AI Tattoo Generator",
  description: "Choose the perfect plan for your tattoo journey. From free generations to unlimited studio access.",
  openGraph: {
    title: "Pricing | AI Tattoo Generator",
    description: "Choose the perfect plan for your tattoo journey. Free, Pro, and Studio plans available.",
    images: [
      {
        url: "/api/og?title=Simple+Pricing&subtitle=Free+%C2%B7+Pro+%C2%B7+Studio+%E2%80%94+Pick+your+plan&icon=%F0%9F%92%8E&accent=green",
        width: 1200,
        height: 630,
        alt: "Tattoos Lab Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | AI Tattoo Generator",
    description: "Choose the perfect plan for your tattoo journey.",
    images: [
      "/api/og?title=Simple+Pricing&subtitle=Free+%C2%B7+Pro+%C2%B7+Studio+%E2%80%94+Pick+your+plan&icon=%F0%9F%92%8E&accent=green",
    ],
  },
};

export default async function PricingPage() {
  const subscription = await getCurrentSubscription();
  const currentTier = subscription.success ? subscription.data?.tier : "FREE";

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/20 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white/60">
              Choose the plan that fits your creative journey. 
              Upgrade or downgrade anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingCards currentTier={currentTier} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQItem
              question="Can I switch plans at any time?"
              answer="Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new plan will take effect at the end of your current billing period."
            />
            <FAQItem
              question="What happens when I run out of credits?"
              answer="When you run out of credits, you can either wait for your monthly renewal or upgrade to a higher plan for more generations. Your existing designs and projects will always remain accessible."
            />
            <FAQItem
              question="Do unused credits roll over?"
              answer="Credits reset at the start of each billing cycle and do not roll over. This encourages regular use and ensures fair resource distribution across all users."
            />
            <FAQItem
              question="Can I use the designs commercially?"
              answer="Commercial use is available with the Studio plan. Pro and Free plans are for personal use only. Studio plan users receive a commercial license for all generated designs."
            />
            <FAQItem
              question="How do I cancel my subscription?"
              answer="You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/60 mb-8">
            Our team is here to help you find the perfect plan.
          </p>
          <a
            href="mailto:support@aitattoo.app"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-white/10 pb-6">
      <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
      <p className="text-white/60">{answer}</p>
    </div>
  );
}
