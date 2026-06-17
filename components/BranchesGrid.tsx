"use client";
import Link from "next/link";

type Branch = {
  slug: string;
  name: string;
  cover_image: string;
  description: string;
  icon?: string;
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
        const img = b.cover_image;
        const icon = b.icon || "⚡";

        return (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="tile group aspect-square flex flex-col justify-end p-6 relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-accent)] transition-all duration-300"
            title={b.name}
          >
            {/* 1. Behind the image: Typographic & Large Emoji Fallback */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-b from-[var(--color-surface)] to-black/60">
              <span className="text-6xl opacity-[0.08] filter transition-all duration-500 group-hover:opacity-[0.16] group-hover:scale-110">
                {icon}
              </span>
            </div>

            {/* 2. Dynamic cover image (if present) */}
            {img && !img.includes("v2_img_") && (
              <img
                src={img}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}

            {/* 3. Scrim overlay for dynamic image readability */}
            {img && !img.includes("v2_img_") && (
              <div
                className="absolute inset-0 z-20 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  background: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.1) 100%)`
                }}
              />
            )}

            {/* 4. Number badge top-right */}
            <div className="absolute top-4 right-4 z-30">
              <span className="t-mono bg-black/80 backdrop-blur-sm text-[var(--color-bone)] text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-line)] font-bold">
                {num}
              </span>
            </div>

            {/* 5. Icon/Emoji top-left for typographic layout */}
            <div className="absolute top-4 left-4 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-surface-2)]/80 border border-[var(--color-line)] font-sans text-base">
              {icon}
            </div>

            {/* 6. Caption bottom */}
            <div className="relative z-30 flex flex-col gap-1.5 mt-auto">
              <h4 className="font-sans font-extrabold text-lg text-[var(--color-bone)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                {b.name}
              </h4>
              <p className="text-[12px] leading-relaxed text-[var(--color-muted)] font-sans line-clamp-2">
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
        <div className="t-mono text-[var(--color-accent-ink)]/75 text-[10px] tracking-[0.14em] uppercase font-bold">
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
