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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map((branch, i) => (
                        <Link
                            key={branch.slug}
                            href={`/${branch.slug}`}
                            className="group relative rounded-3xl border border-white/5 hover:border-white/15 bg-[#0f0f0f] p-8 transition-all duration-300 overflow-hidden"
                        >
                            {/* Glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                                style={{ background: `radial-gradient(ellipse at 0% 0%, ${branch.color}12, transparent 70%)` }}
                            />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <span className="text-4xl">{branch.icon}</span>
                                    <span className="text-white/15 font-mono text-sm">0{i + 1}</span>
                                </div>
                                <h2
                                    className="text-xl font-black mb-2 tracking-tight"
                                    style={{ color: branch.color }}
                                >
                                    {branch.name}
                                </h2>
                                <p className="text-white/35 text-sm leading-relaxed">{branch.description}</p>

                                <div className="mt-6 flex items-center gap-2">
                                    <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors font-bold uppercase tracking-widest">
                                        Explore →
                                    </span>
                                </div>
                            </div>
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
