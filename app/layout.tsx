import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-var',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-var',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sor7ed.com';

export const metadata: Metadata = {
  title: "SOR7ED | Practical Protocols for Neurodivergent Minds",
  description: "SOR7ED (pronounced 'sorted') — practical protocols for neurodivergent adults across 7 branches of life, delivered to your WhatsApp.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'SOR7ED',
    locale: 'en_GB',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {/* pt-16 accounts for Navbar height */}
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
