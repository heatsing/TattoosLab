import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Cookie, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy - Tattoos Lab",
  description: "How Tattoos Lab uses cookies and similar technologies.",
};

const sections = [
  {
    title: "What Are Cookies",
    content: [
      "Cookies are small text files stored on your device when you visit websites.",
      "They help websites remember your preferences, understand how you use the site, and improve your experience.",
      "We also use similar technologies like local storage and pixel tags.",
    ],
  },
  {
    title: "How We Use Cookies",
    content: [
      "Essential Cookies: Required for the platform to function (authentication, security, preferences).",
      "Analytics Cookies: Help us understand how users interact with our platform so we can improve it.",
      "Functionality Cookies: Remember your settings and preferences (theme, language, default styles).",
      "Marketing Cookies: Used to deliver relevant advertisements and measure their effectiveness (only with consent).",
    ],
  },
  {
    title: "Third-Party Cookies",
    content: [
      "We use Google Analytics to understand platform usage patterns.",
      "Our payment processor (Stripe) may set cookies required for secure transactions.",
      "Social media integrations may set cookies if you use sharing features.",
      "We do not allow third parties to use cookies for tracking across unrelated sites.",
    ],
  },
  {
    title: "Managing Cookies",
    content: [
      "You can manage cookies through your browser settings.",
      "Most browsers allow you to block or delete cookies.",
      "Note that disabling essential cookies may prevent certain features from working.",
      "You can update your cookie preferences at any time through our cookie banner.",
    ],
  },
  {
    title: "Cookie Duration",
    content: [
      "Session Cookies: Deleted when you close your browser.",
      "Persistent Cookies: Remain on your device for a set period (up to 12 months) or until you delete them.",
      "Authentication cookies last for the duration of your session or up to 30 days if you select 'Remember me'.",
    ],
  },
  {
    title: "Updates to This Policy",
    content: [
      "We may update this cookie policy as our use of cookies evolves.",
      "Significant changes will be communicated through platform notifications.",
      "Last updated: January 2025.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Cookie className="h-4 w-4" />
              Legal
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Cookie{" "}
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
              This policy explains how Tattoos Lab uses cookies and similar technologies
              to provide, protect, and improve our services.
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
              Questions about cookies?{" "}
              <span className="text-brand-400">privacy@tattooslab.com</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
