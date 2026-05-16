import Link from "next/link";
import { Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { isAuth0Configured } from "@/lib/auth0";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-pink-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Tattoos Lab</span>
        </Link>

        {isAuth0Configured ? (
          <div className="max-w-sm w-full rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/20">
              <ShieldCheck className="h-6 w-6 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Sign In</h2>
            <p className="text-sm text-white/60 mb-6">
              Continue with Auth0 to access your dashboard, billing, and saved tattoo history.
            </p>
            <Button asChild className="w-full">
              <a href="/auth/login?returnTo=/dashboard">Continue with Auth0</a>
            </Button>
            <p className="mt-4 text-xs text-white/40">
              Social login and passwordless options can be configured in your Auth0 tenant.
            </p>
          </div>
        ) : (
          <div className="max-w-sm w-full rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/20">
              <AlertCircle className="h-6 w-6 text-brand-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Sign In</h2>
            <p className="text-sm text-white/60 mb-6">
              Authentication is not configured. Add your Auth0 environment variables to enable sign in.
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
