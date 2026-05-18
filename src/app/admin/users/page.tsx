import { AuthSessionError } from "@/lib/auth/ensure-user";
import { requireAdminUser } from "@/lib/auth/admin";
import { UsersAdminPanel } from "@/components/admin/users-admin-panel";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  try {
    const admin = await requireAdminUser();

    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Navbar />
        <main className="flex-1 px-6 pb-16 pt-24 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-brand-400">
                Operations
              </p>
              <h1 className="text-4xl font-semibold text-white">Admin Users</h1>
              <p className="max-w-3xl text-white/60">
                Review live account state from Prisma, sync the current Auth0 page into
                the application database, and spot billing or identity mismatches before
                they become support issues.
              </p>
            </div>

            <UsersAdminPanel adminEmail={admin.email} />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    if (error instanceof AuthSessionError && error.code === "FORBIDDEN") {
      return (
        <div className="flex min-h-screen flex-col bg-black">
          <Navbar />
          <main className="flex flex-1 items-center justify-center px-6 py-24">
            <Card className="max-w-xl border-red-500/20 bg-red-500/10">
              <CardHeader>
                <CardTitle className="text-white">Admin access required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <p>
                  Your current account is signed in, but it does not have the `ADMIN`
                  role in the application database.
                </p>
                <p>
                  Promote the user in Supabase first, then reload this page:
                </p>
                <pre className="overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-white/80">
                  <code>
                    {"update users set role = 'ADMIN' where email = 'your-email@example.com';"}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      );
    }

    throw error;
  }
}
