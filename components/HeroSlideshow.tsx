"use client";

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

interface Props {
  title?: string;
}

export default function HeroSlideshow({ title = "SKIP THE NONSENSE" }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full aspect-video min-h-[50vh] overflow-hidden">
      {/* Slideshow images — crossfade via opacity transition */}
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={[
            "absolute inset-0 w-full h-full object-cover",
            "transition-opacity duration-1000 ease-in-out",
            i === current ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

      {/* Title */}
      <div className="absolute inset-0 flex items-end pointer-events-none">
        <div className="page-container pb-8 sm:pb-14 w-full">
          <h1
            className="font-display font-black uppercase text-white leading-none text-balance"
            style={{ fontSize: "clamp(2rem, 8vw, 6rem)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 pointer-events-none">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={[
              "block w-1.5 h-1.5 rounded-full transition-all duration-500",
              i === current ? "bg-white w-4" : "bg-white/30",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
