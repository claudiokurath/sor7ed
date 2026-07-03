import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
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
        url: '/Images/banners/landing%20banner.png',
        width: 1200,
        height: 630,
        alt: 'SOR7ED — Practical protocols for neurodivergent minds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/Images/banners/landing%20banner.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
