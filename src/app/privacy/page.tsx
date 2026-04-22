import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Tattoos Lab",
  description: "How Tattoos Lab collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account Information: When you create an account, we collect your name, email address, and profile information.",
      "Usage Data: We collect information about how you use our platform, including designs generated, features accessed, and interaction patterns.",
      "Payment Information: For paid subscriptions, we collect payment details through our secure payment processor (Stripe). We do not store full credit card numbers.",
      "Uploaded Content: Photos uploaded for the try-on feature are processed by our AI systems. We retain these only as long as necessary for the service.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and maintain our AI tattoo generation and preview services.",
      "To process payments and manage your subscription.",
      "To improve our AI models and user experience through aggregated, anonymized data analysis.",
      "To communicate with you about updates, security alerts, and support.",
      "To comply with legal obligations and enforce our terms of service.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard encryption (TLS 1.3) for all data in transit.",
      "Your data is stored on secure cloud infrastructure with regular security audits.",
      "We use multi-factor authentication for administrative access.",
      "Regular penetration testing and vulnerability assessments are conducted.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Access: You can request a copy of all personal data we hold about you.",
      "Correction: You can update or correct your personal information at any time.",
      "Deletion: You can request deletion of your account and associated data.",
      "Portability: You can export your designs and data in standard formats.",
      "To exercise these rights, contact us at privacy@tattooslab.com.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "We use Stripe for payment processing. Their privacy policy applies to payment data.",
      "We use Clerk for authentication services.",
      "We use cloud hosting providers (AWS/Vercel) for infrastructure.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. We will notify you of significant changes via email or platform notifications.",
      "Continued use of the platform after policy changes constitutes acceptance of the updated policy.",
      "Last updated: January 2025.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Shield className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Privacy{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-white/60">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60 mb-8">
              At Tattoos Lab, we take your privacy seriously. This policy explains how we collect,
              use, and protect your personal information when you use our platform.
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
              Questions about our privacy practices?{" "}
              <span className="text-brand-400">privacy@tattooslab.com</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
