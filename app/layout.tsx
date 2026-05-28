import type { Metadata, Viewport } from "next";
import { League_Gothic, DM_Mono, Roboto } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import Navbar from "@/components/layout/Navbar";

const leagueGothic = League_Gothic({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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
    images: [
      {
        url: '/Images/home/hero_new.png',
        width: 1200,
        height: 630,
        alt: 'SOR7ED — Practical protocols for neurodivergent minds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/Images/home/hero_new.png'],
  },
};

import { getSiteConfig } from "@/lib/getSiteConfig";
import BottomNav from "@/components/BottomNav";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = await getSiteConfig();

  const accent = config.home_accent_color?.color || '#00C4C4';
  const coral = config.home_accent_sec_color?.color || '#E8453C';
  const bg = config.home_bg_color?.color || '#080f11';

  const styleOverride = {
    backgroundColor: bg,
    '--color-surface': bg,
    '--color-accent': accent,
    '--color-accent-dim': accent + '1a', // 10% opacity
    '--color-accent-border': accent + '40', // 25% opacity
    '--color-coral': coral,
    '--color-coral-dim': coral + '1a', // 10% opacity
    '--color-coral-border': coral + '40', // 25% opacity
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${leagueGothic.variable} ${dmMono.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={styleOverride}>
        <Navbar />
        {/* pt-16 accounts for Navbar height, pb-20 on mobile avoids overlap with BottomNav */}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <SiteFooter />
      </body>
    </html>
  );
}

// v2