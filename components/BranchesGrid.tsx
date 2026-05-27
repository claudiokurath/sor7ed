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

  function handleSmallClick(idx: number, e: React.MouseEvent) {
    if (idx === featuredIdx) return;
    e.preventDefault();
    setFading(true);
    setTimeout(() => {
      setFeaturedIdx(idx);
      setFading(false);
    }, 300);
  }

  const featured = branches[featuredIdx];
  if (!featured) return null;

  return (
    /* Everything in one vh-bounded column — no overflow */
    <div
      className="flex flex-col gap-1.5 md:gap-2 w-full"
      style={{ height: "clamp(420px, 70vh, 680px)" }}
    >
      {/* Featured card — takes ~45% of height */}
      <Link
        href={`/${featured.slug}`}
        className="relative w-full overflow-hidden flex-none"
        style={{ height: "42%" }}
      >
        <img
          src={featured.cover_image}
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: "opacity 0.4s ease", opacity: fading ? 0 : 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Dot indicators */}
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5">
          {branches.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); handleSmallClick(i, e); }}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i === featuredIdx ? "#fff" : "rgba(255,255,255,0.3)" }}
            />
          ))}
        </div>
        <div
          className="absolute bottom-0 left-0 p-4 md:p-7"
          style={{ transition: "opacity 0.4s ease", opacity: fading ? 0 : 1 }}
        >
          <p
            className="font-display font-black uppercase text-white leading-none"
            style={{ fontSize: "clamp(1.6rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
          >
            {featured.name}
          </p>
        </div>
      </Link>

      {/* 6 small cards — take remaining ~58%, 3 cols × 2 rows */}
      <div
        className="grid grid-cols-3 gap-1.5 md:gap-2 flex-1 min-h-0"
      >
        {branches.map((b, i) => (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            onClick={(e) => i !== featuredIdx && handleSmallClick(i, e)}
            className="group relative overflow-hidden"
          >
            <img
              src={b.cover_image}
              alt={b.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {i === featuredIdx && (
              <div className="absolute inset-0 border-2 border-white/60 pointer-events-none" />
            )}
            <div className="absolute bottom-0 left-0 p-2 md:p-3">
              <p
                className="font-display font-black uppercase text-white leading-none"
                style={{ fontSize: "clamp(0.6rem, 1.8vw, 1.2rem)", letterSpacing: "-0.02em" }}
              >
                {b.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
