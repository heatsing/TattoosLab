import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "AI Tattoo Generator | Tattoos Lab",
  description:
    "Generate unique tattoo designs with AI. Choose from 50+ styles, body placements, and color modes. Create your perfect tattoo in seconds.",
  openGraph: {
    title: "AI Tattoo Generator | Tattoos Lab",
    description:
      "Generate unique tattoo designs with AI. 50+ styles, body placements, and color modes.",
    images: [
      {
        url: "/api/og?title=AI+Tattoo+Generator&subtitle=50%2B+styles+%C2%B7+Unlimited+creativity&icon=%F0%9F%8E%A8&accent=blue",
        width: 1200,
        height: 630,
        alt: "AI Tattoo Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tattoo Generator | Tattoos Lab",
    description: "Generate unique tattoo designs with AI.",
    images: [
      "/api/og?title=AI+Tattoo+Generator&subtitle=50%2B+styles+%C2%B7+Unlimited+creativity&icon=%F0%9F%8E%A8&accent=blue",
    ],
  },
};

export default function GenerateLayout({
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
