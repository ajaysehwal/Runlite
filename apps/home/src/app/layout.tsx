import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Runlite | Fast & Reliable Code Compilation API",
  description: "Runlite provides a powerful code compilation API for developers. Execute code in 40+ programming languages.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourwebsite.com/',
    title: 'Runlite | Fast & Reliable Code Compilation API',
    description: 'Execify provides a powerful code compilation API for developers. Execute code in 40+ programming languages.',
    images: [
      {
        url: 'https://yourwebsite.com/image.jpg',
        width: 800,
        height: 600,
        alt: 'An image representing Runlite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle',
    title: 'Runlite | Fast & Reliable Code Compilation API',
    description: 'Execify provides a powerful code compilation API for developers. Execute code in 40+ programming languages.',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
