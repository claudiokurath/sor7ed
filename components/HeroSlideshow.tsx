"use client";
import Link from "next/link";

import { useState, useEffect } from "react";

const IMAGES = [
  "/Images/home/hero.jpg",
  "/Images/home/system_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss._4341b027-7b6d-4047-8a50-cece4d794b4d_0.png",
  "/Images/home/system_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss._4341b027-7b6d-4047-8a50-cece4d794b4d_1.png",
  "/Images/home/system_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss._4341b027-7b6d-4047-8a50-cece4d794b4d_2.png",
  "/Images/home/system_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss._4341b027-7b6d-4047-8a50-cece4d794b4d_3.png",
  "/Images/home/tech_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss.mj_2c051d5b-5945-462a-8488-5c41b9f08b19_0.png",
  "/Images/home/tech_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss.mj_2c051d5b-5945-462a-8488-5c41b9f08b19_1.png",
  "/Images/home/tech_--ar_169_--raw_--sref_httpss.mj.runJzhghK91FMQ_httpss.mj_2c051d5b-5945-462a-8488-5c41b9f08b19_2.png",
];

const INTERVAL_MS = 5000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      // 100svh = stable viewport height (excludes mobile browser chrome)
      // fallback to 100vh for older browsers
      style={{ height: "100svh", minHeight: "100vh" } as React.CSSProperties}
    >
      {/* Slideshow images */}
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={[
            "absolute inset-0 w-full h-full object-cover object-center",
            "transition-opacity duration-1000 ease-in-out",
            i === current ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}

      {/* Gradient: bottom-up (strong) for text legibility on mobile + left-to-right on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none hidden sm:block" />

      {/* Text — centred */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-20 w-full">
        <h1
          className="font-display font-black uppercase text-white leading-[0.9]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}
        >
          SKIP THE NONSENSE
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-lg mb-6">
          Built for the moments when reading isn't enough and action feels impossible.
        </p>
        <div className="flex gap-3">
          <Link href="/tools" className="bg-[#00C4C4] text-black font-bold text-sm px-6 py-3 uppercase tracking-wide hover:opacity-90 transition-opacity">Browse Tools</Link>
          <Link href="/intelligence" className="border border-white text-white font-bold text-sm px-6 py-3 uppercase tracking-wide hover:bg-white hover:text-black transition-colors">Read Articles</Link>
        </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-5 flex gap-2 pointer-events-none z-10">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={[
              "block h-1 rounded-full transition-all duration-500",
              i === current ? "bg-white w-5" : "bg-white/30 w-1",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
