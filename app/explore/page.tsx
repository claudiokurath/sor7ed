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
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore SOR7ED — 7 Branches of Life",
        description: "Protocols for neurodivergent adults across 7 areas of life.",
    },
};

export default function ExplorePage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20">
            <div className="max-w-2xl mx-auto">

                <div className="mb-12 pt-8">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-4">
                        Your dashboard
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">7 branches of life.</h1>
                    <p className="text-white/40 text-lg leading-relaxed">
                        Tap a branch to explore its protocols. When you find one that fits,
                        text the keyword to get it delivered to your WhatsApp.
                    </p>
                </div>

                <div className="space-y-3">
                    {branches.map((branch, i) => (
                        <Link
                            key={branch.slug}
                            href={`/${branch.slug}`}
                            className="flex items-center gap-5 p-5 rounded-2xl border border-white/8 hover:border-white/20 hover:bg-white/[0.02] transition-all group"
                        >
                            <span className="text-3xl">{branch.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-white/20 font-mono">0{i + 1}</span>
                                    <h2 className="font-semibold text-lg group-hover:text-white transition-colors"
                                        style={{ color: branch.color }}>
                                        {branch.name}
                                    </h2>
                                </div>
                                <p className="text-white/40 text-sm mt-0.5 truncate">{branch.description}</p>
                            </div>
                            <span className="text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/20 text-xs">
                        Text <span className="text-white/40 font-mono">MENU</span> any time to come back here.
                    </p>
                </div>

            </div>
        </main>
    );
}
