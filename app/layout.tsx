import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-serif',
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
  title: "SOR7ED — Practical protocols for neurodivergent minds",
  description: "Step-by-step support for money, planning, burnout, relationships and daily life — delivered straight to your WhatsApp. Built for neurodivergent adults. No app, no subscription.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'SOR7ED',
    locale: 'en_GB',
    images: [
      {
        url: '/Images/home/hero.png',
        width: 1200,
        height: 630,
        alt: 'SOR7ED — Practical protocols for neurodivergent minds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/Images/home/hero.png'],
  },
};

import { getSiteConfig } from "@/lib/getSiteConfig";
import BottomNav from "@/components/BottomNav";
import AccessibilityMenu from "@/components/AccessibilityMenu";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = await getSiteConfig();

  const accent = config.home_accent_color?.color || '#2f6b50';
  const coral   = config.home_accent_sec_color?.color || '#b9601c';
  const bg      = config.home_bg_color?.color || '#f4efe5';

  const styleOverride = {
    backgroundColor: bg,
    '--color-accent': accent,
    '--color-accent-dim': accent + '1a',
    '--color-accent-border': accent + '40',
    '--color-coral': coral,
    '--color-coral-dim': coral + '1a',
    '--color-coral-border': coral + '40',
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${oswald.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col" style={styleOverride}>
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <AccessibilityMenu />
        <SiteFooter />
      </body>
    </html>
  );
}
