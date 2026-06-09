"use client";
import Link from "next/link";

export default function HeroSlideshow() {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden" style={{ paddingTop: 96 }}>
      {/* Background image */}
      <img
        src="/Images/home/hero.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "64% 30%", opacity: 0.82, transform: "scale(1.04)", filter: "contrast(1.16) saturate(1.12) brightness(1.04)" }}
      />
      {/* Scrim — matches Statement exactly */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, #09090b 4%, color-mix(in srgb, #09090b 62%, transparent) 42%, color-mix(in srgb, #09090b 14%, transparent) 72%, transparent),
            linear-gradient(0deg, #09090b, color-mix(in srgb, #09090b 24%, transparent) 44%, transparent 72%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10 page-container py-16 md:py-24 w-full">
        {/* Kicker label */}
        <div className="flex items-center gap-4 mb-8 md:mb-12 flex-wrap">
          <span className="t-label">SOR7ED</span>
          <span className="font-mono text-[11.5px] tracking-[0.16em] uppercase border border-[#2e2a22] px-3 py-[7px]" style={{ color: "#8c8473", fontFamily: "var(--font-mono)" }}>
            WhatsApp-First · UK
          </span>
        </div>

        {/* Hero headline */}
        <h1
          className="font-display font-extrabold leading-[0.9] max-w-4xl"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(46px, 10.4vw, 178px)",
            letterSpacing: "-0.035em",
            color: "#f1ece1",
          }}
        >
          Skip the<br />
          <span style={{ color: "#8c8473" }}>non<span style={{ color: "#d4af37" }}>sense</span></span>
        </h1>

        {/* Scroll cue */}
        <div className="mt-16 md:mt-24 flex items-center gap-4" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8c8473" }}>
          <div className="w-[60px] h-px bg-[#8c8473] relative overflow-hidden">
            <span className="absolute inset-0 w-[40%] bg-[#d4af37] animate-[slide_1.8s_cubic-bezier(0.5,0,0.5,1)_infinite]" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </section>
  );
}
