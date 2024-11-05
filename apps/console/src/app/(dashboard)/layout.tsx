import { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReduxProvider } from "@/providers/RxProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

// Font configurations
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Improve font loading performance
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const siteConfig = {
  name: "Runlite",
  description: "Execute code in 40+ programming languages with Runlite's powerful code compilation API",
  url: "http://localhost:3000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Console | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "code compilation",
    "API",
    "programming languages",
    "developer tools",
    "code execution",
    "cloud compilation",
  ],
  authors: [{ name: "Runlite Team" }],
  creator: "Ajay Sehwal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@runlite", 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: `${siteConfig.url}/manifest.json`,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ReduxProvider>
          <AuthProvider>
            <TooltipProvider>
              <div className="relative flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col pl-[56px]">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  {/* <footer className="py-6 md:px-8 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                          href={siteConfig.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-4"
                        >
                          Runlite
                        </a>
                        . The source code is available on{" "}
                        <a
                          href="https://github.com/runlite"
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-4"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </div>
                  </footer> */}
                </div>
                <Toaster />
              </div>
            </TooltipProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}