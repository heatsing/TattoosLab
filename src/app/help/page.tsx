import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Search,
  Wand2,
  Camera,
  CreditCard,
  User,
  Download,
  MessageCircle,
  Mail,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center - Tattoos Lab",
  description: "Find answers, guides, and support for Tattoos Lab.",
};

const categories = [
  {
    icon: Wand2,
    title: "Getting Started",
    description: "Learn the basics of generating your first tattoo design.",
    articles: ["How to write a good prompt", "Choosing the right style", "Understanding credits"],
  },
  {
    icon: Camera,
    title: "Try-On Feature",
    description: "Everything about previewing tattoos on your body.",
    articles: ["Uploading photos", "Adjusting placement", "Realistic preview tips"],
  },
  {
    icon: CreditCard,
    title: "Billing & Plans",
    description: "Manage subscriptions, payments, and credits.",
    articles: ["Upgrading your plan", "Credit system explained", "Canceling subscription"],
  },
  {
    icon: User,
    title: "Account",
    description: "Profile settings, security, and preferences.",
    articles: ["Changing your password", "Updating profile", "Two-factor authentication"],
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Saving and exporting your designs.",
    articles: ["Download formats", "Print resolution", "Sharing designs"],
  },
  {
    icon: BookOpen,
    title: "Tattoo Styles",
    description: "Deep dives into each supported tattoo style.",
    articles: ["Geometric tattoos", "Watercolor techniques", "Traditional vs Neo-Traditional"],
  },
];

const faqs = [
  { q: "How do credits work?", a: "Each AI generation costs 1 credit. Free users get 3 credits. Pro users get 50 per month. Studio users get 200 per month." },
  { q: "Can I download my designs?", a: "Yes! All users can download their generated designs. Pro and Studio users get higher resolution exports (up to 4K)." },
  { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and never share your photos or designs with third parties." },
  { q: "What styles are supported?", a: "We support 50+ styles including Geometric, Watercolor, Traditional, Japanese, Minimalist, Blackwork, and more." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Help Center
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              How Can We{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Help?
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Search our knowledge base or browse categories to find answers.
            </p>
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search for answers..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((cat) => (
              <Card key={cat.title} className="border-white/10 bg-white/5 hover:border-brand-500/30 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                    <cat.icon className="h-6 w-6 text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{cat.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{cat.description}</p>
                  <div className="space-y-2">
                    {cat.articles.map((article) => (
                      <p key={article} className="text-sm text-brand-400 hover:text-brand-300 cursor-pointer">
                        {article}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick FAQs */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Popular Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-white/60">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5">
            <MessageCircle className="h-10 w-10 text-brand-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Still Need Help?</h3>
            <p className="text-white/60 max-w-lg mx-auto mb-4">
              Our support team is available Monday-Friday, 9am-6pm EST.
              We typically respond within 24 hours.
            </p>
            <div className="flex items-center justify-center gap-2 text-brand-400">
              <Mail className="h-4 w-4" />
              <span>support@tattooslab.com</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
