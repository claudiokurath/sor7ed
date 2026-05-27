"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Branch = {
  slug: string;
  name: string;
  cover_image: string;
  description: string;
  color?: string;
};

export default function BranchesGrid({ branches }: { branches: Branch[] }) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-rotate every 3.5 seconds
  useEffect(() => {
    if (branches.length === 0) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setFeaturedIdx((prev) => (prev + 1) % branches.length);
        setFading(false);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, [branches.length]);

  // Clicking a small card makes it the featured one
  function handleSmallClick(idx: number, e: React.MouseEvent) {
    if (idx === featuredIdx) return; // let link navigate normally
    e.preventDefault();
    setFading(true);
    setTimeout(() => {
      setFeaturedIdx(idx);
      setFading(false);
    }, 300);
  }

  const featured = branches[featuredIdx];
  const others = branches.filter((_, i) => i !== featuredIdx);

  if (!featured) return null;

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {/* Featured card — full width, rotates */}
      <Link
        href={`/${featured.slug}`}
        className="relative w-full overflow-hidden block"
        style={{ aspectRatio: "16/7" }}
      >
        <img
          src={featured.cover_image}
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transition: "opacity 0.4s ease",
            opacity: fading ? 0 : 1,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Dot indicators */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
          {branches.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); handleSmallClick(i, e); }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === featuredIdx ? "#fff" : "rgba(255,255,255,0.35)" }}
              aria-label={`Show ${branches[i].name}`}
            />
          ))}
        </div>
        <div
          className="absolute bottom-0 left-0 p-6 md:p-10"
          style={{ transition: "opacity 0.4s ease", opacity: fading ? 0 : 1 }}
        >
          <p
            className="font-display font-black uppercase text-white leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
          >
            {featured.name}
          </p>
        </div>
      </Link>

      {/* Remaining 6 branches — 3 × 2 grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {branches.map((b, i) => {
          const isActive = i === featuredIdx;
          return (
            <Link
              key={b.slug}
              href={`/${b.slug}`}
              onClick={(e) => !isActive && handleSmallClick(i, e)}
              className="group relative overflow-hidden"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src={b.cover_image}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 border-2 border-white/60 pointer-events-none" />
              )}
              <div className="absolute bottom-0 left-0 p-3 md:p-4">
                <p
                  className="font-display font-black uppercase text-white leading-none"
                  style={{ fontSize: "clamp(0.75rem, 2vw, 1.4rem)", letterSpacing: "-0.02em" }}
                >
                  {b.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
