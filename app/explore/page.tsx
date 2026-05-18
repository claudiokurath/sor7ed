import Link from "next/link";
import { Metadata } from "next";
import { branches } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sor7ed.com";

export const metadata: Metadata = {
  title: "Explore — 7 Branches of Life | SOR7ED",
  description: "Protocols for neurodivergent adults across 7 areas of life. Pick a branch, find what fits, get it delivered to WhatsApp.",
  openGraph: {
    title: "Explore SOR7ED — 7 Branches of Life",
    description: "Protocols for neurodivergent adults across 7 areas of life.",
    url: `${siteUrl}/explore`,
    siteName: "SOR7ED",
    images: [{ url: `${siteUrl}/Images/og-explore.png`, width: 1187, height: 631, alt: "SOR7ED — 7 Branches of Life" }],
    type: "website",
  },
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header — black */}
      <section className="bg-black border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10">
          <p className="label-yellow mb-4">All Areas</p>
          <h1
            className="font-display uppercase text-white leading-none mb-4"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)", letterSpacing: "-0.01em" }}
          >
            7 BRANCHES
          </h1>
          <p className="text-white/50 text-base max-w-lg leading-relaxed">
            Pick a branch. Find what fits. Get the protocol delivered straight to your WhatsApp.
          </p>
        </div>
      </section>

      {/* Branch list — white */}
      <section className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto">
          {branches.map((branch, i) => (
            <Link
              key={branch.slug}
              href={`/${branch.slug}`}
              className={`group flex items-center gap-5 px-5 sm:px-8 md:px-12 py-7 hover:bg-black transition-colors ${i < branches.length - 1 ? "border-b-2 border-black/10" : ""}`}
            >
              {/* Number */}
              <span className="font-display text-black/20 group-hover:text-white/20 text-sm tracking-widest transition-colors shrink-0 w-8">
                {branch.num}
              </span>

              {/* Colour dot */}
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: branch.color }}
              />

              {/* Name + description */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display uppercase text-lg tracking-wide text-black group-hover:text-white transition-colors leading-tight">
                  {branch.name}
                </h2>
                <p className="text-black/40 group-hover:text-white/40 text-xs mt-0.5 leading-relaxed transition-colors">
                  {branch.description}
                </p>
              </div>

              {/* Arrow */}
              <span className="text-black/20 group-hover:text-ps-yellow text-xl transition-colors shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
