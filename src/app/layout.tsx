import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tattoos Lab - AI Tattoo Generator",
  description:
    "Create stunning AI-generated tattoo designs. Preview tattoos on your body with our AR try-on feature.",
  keywords: [
    "AI tattoo generator",
    "tattoo design",
    "tattoo preview",
    "AI art",
    "tattoo ideas",
  ],
  openGraph: {
    title: "Tattoos Lab - AI Tattoo Generator",
    description: "Create stunning AI-generated tattoo designs",
    type: "website",
  },
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  clerkKey && !clerkKey.includes("...") && clerkKey.length > 20;

function AppProviders({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );

  if (!hasValidClerkKey) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
