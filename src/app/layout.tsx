import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const metadataBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
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

const isAuth0Enabled = process.env.NEXT_PUBLIC_AUTH0_ENABLED === "true";

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

  if (!isAuth0Enabled) {
    return content;
  }

  return <Auth0Provider>{content}</Auth0Provider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
