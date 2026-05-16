import Link from "next/link";
import { Metadata } from "next";
import { branches } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";

export const metadata: Metadata = {
    title: "Explore SOR7ED — 7 Branches of Life",
    description: "Protocols for neurodivergent adults across 7 areas of life. Pick a branch, find what fits, get it delivered to WhatsApp.",
    openGraph: {
        title: "Explore SOR7ED — 7 Branches of Life",
        description: "Protocols for neurodivergent adults across 7 areas of life. Pick a branch, find what fits, get it delivered to WhatsApp.",
        url: `${siteUrl}/explore`,
        siteName: "SOR7ED",
        images: [{ url: `${siteUrl}/Images/og-explore.png`, width: 1187, height: 631, alt: "SOR7ED — 7 Branches of Life" }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore SOR7ED — 7 Branches of Life",
        description: "Protocols for neurodivergent adults across 7 areas of life.",
        images: [`${siteUrl}/Images/og-explore.png`],
    },
};

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="border-b border-white/5 px-6 py-16 pt-28">
                <div className="max-w-5xl mx-auto">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/25 block mb-4">Your dashboard</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        7 branches<br />
                        <span className="text-white/30">of your life.</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-md mt-6">
                        Pick a branch. Find what fits. Text the keyword and get it on WhatsApp.
                    </p>
                </div>
            </div>

            {/* Branch Grid */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 gap-2.5">
                    {branches.map((branch) => (
                        <Link
                            key={branch.slug}
                            href={`/${branch.slug}`}
                            className="group flex items-center gap-4 px-5 py-4 rounded-2xl active:scale-[0.98] transition-all duration-150"
                            style={{ backgroundColor: `${branch.color}22`, border: `1.5px solid ${branch.color}50` }}
                        >
                            <span className="text-2xl shrink-0">{branch.icon}</span>

                            <div className="flex-1 min-w-0">
                                <p
                                    className="font-black text-base tracking-tight leading-tight"
                                    style={{ color: branch.color }}
                                >
                                    {branch.name}
                                </p>
                                <p className="text-white/35 text-xs mt-0.5 truncate">{branch.description}</p>
                            </div>

                            <span className="text-lg shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: branch.color }}>→</span>
                        </Link>
                    ))}
                </div>

                <p className="text-center text-white/15 text-xs mt-12">
                    Text <span className="text-white/30 font-mono">MENU</span> any time to come back here
                </p>
            </div>
        </div>
    );
}
