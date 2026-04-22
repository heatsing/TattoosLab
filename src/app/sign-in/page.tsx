"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkKey && !clerkKey.includes("...") && clerkKey.length > 20;

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-pink-600">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">Tattoos Lab</span>
      </Link>

      {hasValidClerkKey ? (
        <SignIn
          appearance={{
            elements: {
              card: "bg-white/5 border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton:
                "bg-white/5 border-white/10 text-white hover:bg-white/10",
              socialButtonsBlockButtonText: "text-white",
              formFieldLabel: "text-white/80",
              formFieldInput:
                "bg-white/5 border-white/10 text-white placeholder:text-white/40",
              footerActionText: "text-white/60",
              footerActionLink: "text-brand-400 hover:text-brand-300",
              formButtonPrimary:
                "bg-brand-600 hover:bg-brand-700 text-white",
              alternativeMethodsBlockButton:
                "bg-white/5 border-white/10 text-white hover:bg-white/10",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-brand-400",
              formFieldInputShowPasswordButton: "text-white/40",
            },
          }}
        />
      ) : (
        <div className="max-w-sm w-full rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/20">
            <AlertCircle className="h-6 w-6 text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Sign In</h2>
          <p className="text-sm text-white/60 mb-6">
            Authentication is not configured. Add your Clerk keys to enable sign in.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">Continue to Dashboard</Button>
          </Link>
          <p className="mt-4 text-xs text-white/40">
            You can still browse the app without signing in.
          </p>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
}
