import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/app/providers";
import Navbar from "@/components/app/navbar";
import { ThemeProvider } from "next-themes";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "cowork — work nearby, together",
    template: "%s · cowork",
  },
  description:
    "Find builders, designers and founders working near you. Check in at your favorite cafe, coworking space or library and connect IRL.",
  metadataBase: new URL("https://cowork.vercel.app"),
  openGraph: {
    title: "cowork — work nearby, together",
    description:
      "See where other builders are working right now. Join them, say hi, and get to work.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cowork — work nearby, together",
    description:
      "See where other builders are working right now. Join them, say hi, and get to work.",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen w-full flex flex-col bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>
              <Navbar />
              <main className="flex-1 flex flex-col min-h-0">
                {children}
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
