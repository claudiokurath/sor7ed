"use client";
import { useRef } from "react";
import Link from "next/link";

type Branch = {
  slug: string;
  name: string;
  cover_image: string;
  description: string;
};

export default function BranchesGrid({ branches }: { branches: Branch[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Prev arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 flex items-center justify-center bg-black border border-white/20 hover:border-white transition-colors"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Carousel track */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {branches.map((b) => (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="group relative flex-none snap-start overflow-hidden"
            style={{ width: "260px", height: "260px", background: "#000" }}
          >
            <img
              src={b.cover_image}
              alt={b.name}
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />

          </Link>
        ))}
      </div>

      {/* Next arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 flex items-center justify-center bg-black border border-white/20 hover:border-white transition-colors"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
