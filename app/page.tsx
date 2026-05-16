import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";

export const metadata: Metadata = {
    title: "SOR7ED | Practical Protocols for Neurodivergent Minds",
    description: "Practical protocols for neurodivergent adults, organised into 7 branches of life and delivered via WhatsApp.",
    openGraph: {
        title: "SOR7ED | Practical Protocols for Neurodivergent Minds",
        description: "Practical protocols for neurodivergent adults, organised into 7 branches of life and delivered via WhatsApp.",
        url: siteUrl,
        siteName: "SOR7ED",
        images: [{ url: `${siteUrl}/Images/og-explore.png`, width: 1187, height: 631, alt: "SOR7ED" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SOR7ED | Practical Protocols for Neurodivergent Minds",
        description: "Practical protocols for neurodivergent adults, delivered via WhatsApp.",
        images: [`${siteUrl}/Images/og-explore.png`],
    },
};

export default function Home() {
    return <HomeClient />;
}
