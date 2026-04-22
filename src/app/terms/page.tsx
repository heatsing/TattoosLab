import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FileText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Tattoos Lab",
  description: "The terms and conditions governing your use of Tattoos Lab.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Tattoos Lab, you agree to be bound by these Terms of Service.",
      "If you do not agree to these terms, you may not use our services.",
      "We reserve the right to modify these terms at any time. Continued use constitutes acceptance.",
    ],
  },
  {
    title: "Account Registration",
    content: [
      "You must provide accurate and complete information when creating an account.",
      "You are responsible for maintaining the security of your account credentials.",
      "You must be at least 18 years old to use our services.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "Use of Services",
    content: [
      "Our AI-generated designs are provided for personal and commercial use.",
      "You may not use our services to generate content that is illegal, harmful, or infringes on others' rights.",
      "You may not attempt to reverse engineer, scrape, or abuse our API or systems.",
      "We reserve the right to limit usage to prevent abuse and ensure quality of service.",
    ],
  },
  {
    title: "Subscriptions & Payments",
    content: [
      "Subscription fees are billed in advance on a monthly or annual basis.",
      "You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.",
      "Refunds are provided at our discretion and in accordance with applicable consumer protection laws.",
      "We reserve the right to change pricing with 30 days notice.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "You retain ownership of designs you create using our platform.",
      "We grant you a license to use our platform and generated designs subject to these terms.",
      "Tattoos Lab retains ownership of our platform, technology, and brand assets.",
      "You may not resell or redistribute our platform or AI models.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Tattoos Lab is provided 'as is' without warranties of any kind.",
      "We are not liable for any decisions you make based on AI-generated designs, including tattoo choices.",
      "Our liability is limited to the amount you paid for our services in the preceding 12 months.",
      "We are not responsible for third-party services integrated with our platform.",
    ],
  },
  {
    title: "Termination",
    content: [
      "You may terminate your account at any time through your settings.",
      "We may suspend or terminate your account for violations of these terms.",
      "Upon termination, your right to use the service ceases immediately.",
      "Certain provisions (including intellectual property and liability) survive termination.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of the State of California, United States.",
      "Any disputes will be resolved through binding arbitration in San Francisco, CA.",
      "If any provision is found unenforceable, the remaining provisions remain in effect.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <FileText className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Terms of{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-white/60">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60 mb-8">
              Welcome to Tattoos Lab. Please read these terms carefully before using our services.
              By using Tattoos Lab, you agree to comply with and be bound by the following terms.
            </p>

            {sections.map((section) => (
              <div key={section.title} className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-white/60 flex items-start gap-3">
                      <Sparkles className="h-4 w-4 text-brand-400 shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5 text-center">
            <p className="text-white/60 text-sm">
              Questions about our terms?{" "}
              <span className="text-brand-400">legal@tattooslab.com</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
