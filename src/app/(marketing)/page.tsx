import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustIndicators } from "@/components/landing/trust-indicators";
import { Features } from "@/components/landing/features";
import { TryOnSection } from "@/components/landing/try-on-section";
import { StylesGrid } from "@/components/landing/styles-grid";
import { Gallery } from "@/components/landing/gallery";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Tattoos Lab - AI Tattoo Generator",
  description:
    "Create stunning AI-generated tattoo designs in seconds. Preview tattoos on your body with our AR try-on feature. 50+ art styles, high-res downloads.",
  openGraph: {
    title: "Tattoos Lab - AI Tattoo Generator",
    description:
      "Create stunning AI-generated tattoo designs in seconds. Preview tattoos on your body with our AR try-on feature.",
    images: [
      {
        url: "/api/og?title=AI+Tattoo+Generator&subtitle=Design+your+perfect+tattoo+in+seconds&icon=%E2%9C%A8&accent=orange",
        width: 1200,
        height: 630,
        alt: "Tattoos Lab - AI Tattoo Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tattoos Lab - AI Tattoo Generator",
    description:
      "Create stunning AI-generated tattoo designs in seconds.",
    images: [
      "/api/og?title=AI+Tattoo+Generator&subtitle=Design+your+perfect+tattoo+in+seconds&icon=%E2%9C%A8&accent=orange",
    ],
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <TrustIndicators />
      <Features />
      <TryOnSection />
      <StylesGrid />
      <Gallery />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
