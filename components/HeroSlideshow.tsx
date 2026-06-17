"use client";
import Link from "next/link";

export default function HeroSlideshow() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="page-container flex flex-col gap-12 md:gap-16">
        {/* Text Area */}
        <div className="max-w-4xl flex flex-col gap-6 reveal in">
          {/* Eyebrow and Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="t-label">For neurodivergent adults</span>
            <span className="t-mono bg-[var(--color-surface-2)] text-[10px] px-3 py-1 rounded-full border border-[var(--color-line)]">
              Skip the nonsense
            </span>
          </div>

          {/* Headline */}
          <h1 className="t-display mt-2">
            Practical protocols for <em>neurodivergent</em> minds
          </h1>

          {/* Subhead */}
          <p className="t-body max-w-2xl text-[18px] md:text-[21px] font-sans leading-relaxed text-[var(--color-muted)] mt-2">
            Get step-by-step support for <strong className="font-semibold text-[var(--color-bone)]">money, planning, burnout, relationships</strong> and daily life — delivered straight to your WhatsApp.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 items-center flex-wrap mt-4">
            <Link href="#tools" className="btn btn-primary btn-lg">
              Browse tools <span className="arrow">→</span>
            </Link>
            <Link href="#branches" className="btn btn-ghost btn-lg">
              Explore the 7 Branches <span className="arrow">→</span>
            </Link>
          </div>

          {/* Microcopy */}
          <p className="t-mono text-[11px] text-[var(--color-muted)] max-w-xl leading-relaxed mt-2">
            No app. No subscription required. Start with one area and get practical support that actually fits how your brain works.
          </p>
        </div>

        {/* Large Rounded Band Image Header */}
        <div className="relative w-full aspect-[21/9] min-h-[300px] rounded-[24px] overflow-hidden border border-[var(--color-line)] shadow-medium reveal in">
          <img
            src="/Images/home/hero.png"
            alt="SOR7ED Dashboard on WhatsApp"
            className="w-full h-full object-cover object-[center_35%]"
          />
          {/* Scrim: left-to-bottom dark/warm scrim */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(to top, rgba(34,30,24,0.7) 0%, rgba(34,30,24,0.2) 50%, rgba(34,30,24,0) 100%),
                           linear-gradient(to right, rgba(34,30,24,0.4) 0%, rgba(34,30,24,0) 50%)`
            }}
          />
          {/* Image caption tag */}
          <div className="absolute bottom-6 left-6 z-20">
            <span className="t-mono bg-[var(--color-ink)] text-[var(--color-bone)] text-[10px] px-3.5 py-1.5 rounded-full border border-[var(--color-line)] font-medium tracking-[0.1em]">
              Support, straight to your WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
