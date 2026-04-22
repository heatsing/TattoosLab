import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Settings | Tattoos Lab",
  description:
    "Manage your subscription, billing, and account settings. Upgrade your plan, view usage stats, and download invoices.",
  openGraph: {
    title: "Settings | Tattoos Lab",
    description:
      "Manage your subscription, billing, and account settings.",
    images: [
      {
        url: "/api/og?title=Account+Settings&subtitle=Manage+your+plan+%26+billing&icon=%E2%9A%99%EF%B8%8F&accent=orange",
        width: 1200,
        height: 630,
        alt: "Account Settings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings | Tattoos Lab",
    description: "Manage your subscription, billing, and account settings.",
    images: [
      "/api/og?title=Account+Settings&subtitle=Manage+your+plan+%26+billing&icon=%E2%9A%99%EF%B8%8F&accent=orange",
    ],
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
