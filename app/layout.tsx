import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SmartNav from "@/components/SmartNav";
import BottomNav from "@/components/BottomNav";

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton-var',
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SOR7ED',
    alternateName: ['sorted', 'Sorted', 'sor7ed'],
    description: 'Practical protocols for neurodivergent adults across 7 branches of life, delivered via WhatsApp.',
    url: 'https://sor7ed.com',
    logo: 'https://sor7ed.com/Images/Logo2026.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@sor7ed.com',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SOR7ED',
    alternateName: 'sorted',
    url: 'https://sor7ed.com',
    description: 'Practical protocols for neurodivergent minds — get sorted with SOR7ED',
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-bg text-text-primary">
        <SmartNav />
        {/* pt-0 on mobile (no top nav), pt-16 on desktop (SmartNav height) */}
        <main className="flex-1 pt-0 md:pt-14 pb-20 md:pb-0">{children}</main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
