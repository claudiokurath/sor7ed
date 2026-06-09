"use client";
import Link from "next/link";

type Branch = {
  slug: string;
  name: string;
  cover_image: string;
  description: string;
};

const BRANCH_IMAGES: Record<string, string> = {
  "keep-going": "/Images/branches/v2_img_2.jpg",
  "feel-good": "/Images/branches/v2_img_3.jpg",
  "spend-smart": "/Images/branches/v2_img_4.jpg",
  "be-connected": "/Images/branches/v2_img_5.jpg",
  "plan-ahead": "/Images/branches/v2_img_6.jpg",
  "be-yourself": "/Images/branches/v2_img_7.jpg",
  "level-up": "/Images/branches/v2_img_8.jpg",
};

const BRANCH_NUMBERS: Record<string, string> = {
  "keep-going": "01",
  "feel-good": "02",
  "spend-smart": "03",
  "be-connected": "04",
  "plan-ahead": "05",
  "be-yourself": "06",
  "level-up": "07",
};

export default function BranchesGrid({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal in">
      {branches.map((b) => {
        const num = BRANCH_NUMBERS[b.slug] || "01";
        const img = BRANCH_IMAGES[b.slug] || b.cover_image;
        return (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="tile group aspect-square flex flex-col justify-end p-6"
            title={b.name}
          >
            {/* Background image */}
            <img
              src={img}
              alt={b.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            />
            {/* Scrim: left-to-bottom dark/warm overlay */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `linear-gradient(to top, rgba(34,30,24,0.85) 0%, rgba(34,30,24,0.3) 60%, rgba(34,30,24,0.05) 100%)`
              }}
            />
            {/* Number badge top-right */}
            <div className="absolute top-4 right-4 z-20">
              <span className="t-mono bg-[var(--color-ink)]/90 backdrop-blur-sm text-[var(--color-bone)] text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-line)] font-bold">
                {num}
              </span>
            </div>
            {/* Caption bottom */}
            <div className="relative z-20 flex flex-col gap-1.5">
              <h4 className="font-sans font-extrabold text-lg text-[var(--color-accent-ink)] group-hover:text-[var(--color-ink)] transition-colors leading-tight">
                {b.name}
              </h4>
              <p className="text-[12px] leading-relaxed text-white/70 font-sans">
                {b.description}
              </p>
            </div>
          </Link>
        );
      })}

      {/* Solid Accent CTA Tile */}
      <Link
        href="/explore"
        className="tile aspect-square bg-[var(--color-accent)] border border-[var(--color-accent)] flex flex-col justify-between p-7 hover:bg-[var(--color-accent)]/90 group"
      >
        <div className="t-mono text-[var(--color-accent-ink)]/70 text-[10px] tracking-[0.14em] uppercase font-bold">
          Start anywhere
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <h4 className="font-sans font-black text-2xl text-[var(--color-accent-ink)] group-hover:translate-x-1 transition-transform duration-300 leading-tight">
            Explore all 7 branches <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </h4>
          <p className="text-[13px] text-[var(--color-accent-ink)]/80 font-medium font-sans">
            Find your starting point →
          </p>
        </div>
      </Link>
    </div>
  );
}
