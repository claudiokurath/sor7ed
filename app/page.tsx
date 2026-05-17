import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";

export const metadata: Metadata = {
    title: "SOR7ED | Practical Tools for Overwhelmed Minds",
    description: "Practical tools for when everything feels like too much. 7 branches of life, delivered to your WhatsApp. Built for ADHD brains, used by everyone.",
    openGraph: {
        title: "SOR7ED | Practical Tools for Overwhelmed Minds",
        description: "Practical tools for when everything feels like too much. 7 branches of life, delivered to your WhatsApp. Built for ADHD brains, used by everyone.",
        url: siteUrl,
        siteName: "SOR7ED",
        images: [{ url: `${siteUrl}/Images/chaos-og.jpg`, width: 1200, height: 630, alt: "The chaos before SOR7ED — practical protocols for neurodivergent minds" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SOR7ED | Practical Tools for Overwhelmed Minds",
        description: "Practical tools for overwhelmed minds. 7 branches, delivered to your WhatsApp.",
        images: [`${siteUrl}/Images/chaos-og.jpg`],
    },
};

export default function Home() {
    return <HomeClient />;
}
