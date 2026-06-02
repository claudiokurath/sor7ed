"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const IMAGES = [
  "/Images/home/hero.png",
];

export default function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i + 1) % IMAGES.length); setFading(false); }, 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full min-h-[50vh] flex items-end overflow-hidden">
      {/* Background image */}
      <img
        key={idx}
        src={IMAGES[idx]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ transition: "opacity 0.6s ease", opacity: fading ? 0 : 1 }}
      />
      {/* Same gradient as all other page banners */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

      {/* Content — same container as all other pages */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-24 w-full">
        <p className="t-label text-white/50 mb-3 font-mono tracking-widest">PRACTICAL PROTOCOLS</p>
        <h1
          className="font-display font-black uppercase text-white leading-none mb-4 max-w-3xl"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", letterSpacing: "-0.02em" }}
        >
          SKIP THE NONSENSE
        </h1>
        <p className="text-white/70 text-base max-w-lg mb-8 font-mono leading-relaxed">
          Built for the moments when reading isn&apos;t enough and action feels impossible.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools" className="btn btn-lg" style={{ background: "#00C4C4", color: "#000", borderColor: "#00C4C4" }}>
            Browse Tools →
          </Link>
          <Link href="/articles" className="btn btn-lg btn-ghost">
            Read Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
