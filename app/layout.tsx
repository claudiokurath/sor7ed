import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Anton, Roboto } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SmartNav from "@/components/SmartNav";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["100", "300"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true, // Important for accessibility
}

export const metadata: Metadata = {
  title: "SOR7ED | Practical Protocols for Neurodivergent Minds",
  description: "Organize your life across 7 branches with practical protocols delivered via WhatsApp.",
  icons: {
    icon: '/Images/Favicon.jpg',
    apple: '/Images/Favicon.jpg',
  },
};

export function TextureOverlay() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.015] mix-blend-mode-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <TextureOverlay />
        <SmartNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
