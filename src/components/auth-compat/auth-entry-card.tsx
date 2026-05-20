import Link from "next/link";
import { AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthEntryCardProps = {
  mode: "sign-in" | "sign-up";
  authHref: string;
  isConfigured: boolean;
};

const content = {
  "sign-in": {
    title: "Sign in to Tattoos Lab",
    description: "Access your dashboard, billing, and saved tattoo designs.",
    action: "Continue with Auth0",
    alternatePrompt: "New to Tattoos Lab?",
    alternateLabel: "Create an account",
    alternateHref: "/sign-up",
    disabledDescription:
      "Authentication is not configured. Add your Auth0 web application variables to enable sign in.",
  },
  "sign-up": {
    title: "Create your account",
    description: "Start generating tattoo concepts and saving your design history.",
    action: "Create account",
    alternatePrompt: "Already have an account?",
    alternateLabel: "Sign in",
    alternateHref: "/sign-in",
    disabledDescription:
      "Authentication is not configured. Add your Auth0 web application variables to enable sign up.",
  },
} satisfies Record<
  AuthEntryCardProps["mode"],
  {
    title: string;
    description: string;
    action: string;
    alternatePrompt: string;
    alternateLabel: string;
    alternateHref: string;
    disabledDescription: string;
  }
>;

export function AuthEntryCard({
  mode,
  authHref,
  isConfigured,
}: AuthEntryCardProps) {
  const page = content[mode];
  const Icon = isConfigured ? ShieldCheck : AlertCircle;

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <div className="flex h-16 items-center px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold">Tattoos Lab</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-8">
        <section className="w-full max-w-[400px]">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
              <Icon className="h-5 w-5 text-white/80" />
            </div>

            <h1 className="text-2xl font-semibold tracking-normal text-white">
              {page.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {isConfigured ? page.description : page.disabledDescription}
            </p>

            <div className="mt-7">
              {isConfigured ? (
                <Button asChild className="h-11 w-full justify-between">
                  <a href={authHref}>
                    <span>{page.action}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button disabled className="h-11 w-full justify-between">
                  <span>{page.action}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/55">
              {page.alternatePrompt}{" "}
              <Link
                href={page.alternateHref}
                className="font-medium text-white transition-colors hover:text-white/80"
              >
                {page.alternateLabel}
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/35">
            <Link href="/privacy" className="transition-colors hover:text-white/60">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/60">
              Terms
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
