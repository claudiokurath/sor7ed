import Link from "next/link";
import { branches } from "@/lib/constants";

const BRANCH_POSTER_TEXTS: Record<string, string> = {
  "keep-going": "EP GOING",
  "spend-smart": "PEND SMART",
  "feel-good": "EL GOOD",
  "plan-ahead": "LAN AHEAD",
  "be-connected": "CONNECTED",
  "be-yourself": "YOURSELF",
  "level-up": "VEL UP",
};

export default function ExplorePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="border-b border-white/10">
        <div className="page-container py-14 md:py-20">
          <p className="t-label text-accent mb-4">7 areas of life</p>
          <h1 className="t-display mb-5 text-balance max-w-2xl">
            Everything maps to one of seven areas
          </h1>
          <p className="t-body max-w-xl text-pretty">
            SOR7ED covers the seven areas most affected by executive dysfunction, 
            ADHD, autism, and burnout. Pick yours.
          </p>
        </div>
      </div>

      <div className="page-container mt-12">
        <div className="flex flex-col gap-6">
          {/* Top row (4 cards on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.slice(0, 4).map((branch) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className="group relative aspect-[3/4] border border-white/10 hover:border-[#00C4C4]/50 overflow-hidden transition-all duration-300"
              >
                <img
                  src={`/Images/branches/${branch.slug}.png`}
                  alt={branch.name}
                  className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
                
                <div className="absolute top-4 left-4 right-4">
                  <span className="font-display text-5xl sm:text-6xl text-white font-black leading-none block select-none uppercase">
                    {BRANCH_POSTER_TEXTS[branch.slug] || branch.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="t-heading text-xs text-white/90 mb-1">{branch.name}</p>
                    <p className="text-[10px] text-white/60 line-clamp-1 leading-none">{branch.description}</p>
                  </div>
                  <span className="text-[#00C4C4] font-bold text-sm shrink-0 ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row (3 cards centered on desktop) */}
          <div className="grid grid-cols-2 lg:flex lg:justify-center gap-6">
            {branches.slice(4, 7).map((branch) => (
              <Link
                key={branch.slug}
                href={`/${branch.slug}`}
                className="group relative aspect-[3/4] lg:w-[calc(25%-18px)] border border-white/10 hover:border-[#00C4C4]/50 overflow-hidden transition-all duration-300"
              >
                <img
                  src={`/Images/branches/${branch.slug}.png`}
                  alt={branch.name}
                  className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
                
                <div className="absolute top-4 left-4 right-4">
                  <span className="font-display text-5xl sm:text-6xl text-white font-black leading-none block select-none uppercase">
                    {BRANCH_POSTER_TEXTS[branch.slug] || branch.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="t-heading text-xs text-white/90 mb-1">{branch.name}</p>
                    <p className="text-[10px] text-white/60 line-clamp-1 leading-none">{branch.description}</p>
                  </div>
                  <span className="text-[#00C4C4] font-bold text-sm shrink-0 ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
