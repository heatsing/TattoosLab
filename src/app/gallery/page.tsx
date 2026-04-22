import type { Metadata } from "next";
import { GalleryContent } from "./gallery-content";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Community Gallery - Tattoos Lab",
  description:
    "Browse thousands of AI-generated tattoo designs from our community. Get inspired for your next ink.",
  openGraph: {
    title: "Community Gallery - Tattoos Lab",
    description: "Browse thousands of AI-generated tattoo designs from our community.",
    images: [
      {
        url: "/api/og?title=Community+Gallery&subtitle=Get+inspired+by+thousands+of+designs&icon=%F0%9F%96%BC%EF%B8%8F&accent=orange",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <GalleryContent />
      <Footer />
    </div>
  );
}
