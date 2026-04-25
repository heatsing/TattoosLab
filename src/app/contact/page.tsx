import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  Send,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Tattoos Lab",
  description: "Get in touch with the Tattoos Lab team.",
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@tattooslab.com",
    description: "For general inquiries",
  },
  {
    icon: MessageSquare,
    title: "Support",
    value: "support@tattooslab.com",
    description: "For technical help",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "San Francisco, CA",
    description: "Remote-first team",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Get in Touch
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
              Contact{" "}
              <span className="bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? We would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
              <div className="space-y-4 mb-8">
                {contactMethods.map((method) => (
                  <Card key={method.title} className="border-white/10 bg-white/5">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20 shrink-0">
                        <method.icon className="h-5 w-5 text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/50">{method.description}</p>
                        <p className="font-semibold text-white">{method.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-brand-400" />
                  <h3 className="font-semibold text-white">Response Time</h3>
                </div>
                <p className="text-white/60 text-sm">
                  We aim to respond to all inquiries within 24 hours during business days.
                  For urgent issues, please use our support email.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <a href="https://instagram.com" className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://youtube.com" className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/70 mb-1 block">Name</label>
                      <Input placeholder="Your name" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                    </div>
                    <div>
                      <label className="text-sm text-white/70 mb-1 block">Email</label>
                      <Input placeholder="you@example.com" type="email" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Subject</label>
                    <Input placeholder="What is this about?" className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
                  </div>
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us more..."
                      className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2"
                    />
                  </div>
                  <Button type="button" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
