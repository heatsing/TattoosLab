import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthSessionError, ensureDatabaseUser } from "@/lib/auth/ensure-user";
import { isAuth0Configured } from "@/lib/auth0";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuth0Configured) {
    return (
      <DashboardShell>
        <AuthUnavailableState />
      </DashboardShell>
    );
  }

  try {
    await ensureDatabaseUser();
  } catch (error) {
    if (error instanceof AuthSessionError && error.code === "UNAUTHORIZED") {
      redirect("/sign-in?returnTo=/dashboard");
    }

    throw error;
  }

  return <DashboardShell>{children}</DashboardShell>;
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AuthUnavailableState() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-24 text-white">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <ShieldAlert className="h-6 w-6 text-white/75" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Account access is temporarily unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          The design dashboard needs sign-in before generations, try-on, saved
          history, and billing can run. Please come back once account access is
          enabled.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Back to homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">View plans</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
