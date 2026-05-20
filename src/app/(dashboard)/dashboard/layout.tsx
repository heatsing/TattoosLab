import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ensureDatabaseUser } from "@/lib/auth/ensure-user";
import { isAuth0Configured } from "@/lib/auth0";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuth0Configured) {
    await ensureDatabaseUser();
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
