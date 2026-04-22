import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Tattoo Try-On | Tattoos Lab",
  description:
    "Preview tattoos on your body before you ink. Upload your photo, place tattoo designs, scale, rotate, and blend for a realistic preview.",
  openGraph: {
    title: "Tattoo Try-On | Tattoos Lab",
    description:
      "Preview tattoos on your body before you ink. Realistic AR preview with drag, scale, and blend.",
    images: [
      {
        url: "/api/og?title=Tattoo+Try-On&subtitle=See+it+on+your+skin+before+you+ink&icon=%F0%9F%93%B8&accent=pink",
        width: 1200,
        height: 630,
        alt: "Tattoo Try-On",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tattoo Try-On | Tattoos Lab",
    description: "Preview tattoos on your body before you ink.",
    images: [
      "/api/og?title=Tattoo+Try-On&subtitle=See+it+on+your+skin+before+you+ink&icon=%F0%9F%93%B8&accent=pink",
    ],
  },
};

export default function TryOnLayout({
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
