import React from "react";
import Link from "next/link";

// Helper to highlight words wrapped in *asterisks* using the accent color
function renderFormattedText(text: string | null | undefined, highlightColor: string): React.ReactNode[] {
  if (!text) return [];
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const clean = part.slice(1, -1);
      return React.createElement('span', { key: index, style: { color: highlightColor } }, clean);
    }
    return part;
  });
}

interface HeroSlideshowProps {
  config: any;
}

export default function HeroSlideshow({ config }: HeroSlideshowProps) {
  const accentColor = config?.home_accent_color?.color || "#d4af37";
  
  const rawTitle = config?.home_hero_title?.text || "Practical protocols for *neurodivergent* minds";
  const titleNodes = renderFormattedText(rawTitle, accentColor);

  const subtitle = config?.home_hero_subtitle?.text || 
    "Get step-by-step support for money, planning, burnout, relationships and daily life — delivered straight to your WhatsApp.";

  const heroImage = config?.home_hero?.image;
  const isImageActive = config?.home_hero?.active && heroImage && heroImage !== "/Images/home/hero_new.png";

  return (
    <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="page-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 reveal in">
          {/* Eyebrow and Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="t-label">For neurodivergent adults</span>
            <span className="t-mono bg-[var(--color-surface-2)] text-[10px] px-3 py-1 rounded-full border border-[var(--color-line)]">
              Skip the overwhelm
            </span>
          </div>

          {/* Headline */}
          <h1 className="t-display mt-2 text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight">
            {titleNodes.length > 0 ? titleNodes : "Practical protocols for neurodivergent minds"}
          </h1>

          {/* Subhead */}
          <p className="t-body max-w-xl text-[16px] md:text-[19px] font-sans leading-relaxed text-[var(--color-muted)] mt-2">
            {subtitle}
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

        {/* Right Column: Dynamic Notion Image OR Interactive CSS Mockup */}
        <div className="lg:col-span-5 flex justify-center w-full reveal in">
          {isImageActive ? (
            /* User uploaded custom image from Notion */
            <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border-2 border-[var(--color-line)] hover:border-[var(--color-accent)] transition-all duration-300 shadow-large">
              <img
                src={heroImage}
                alt="SOR7ED Dashboard"
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(to top, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.1) 60%)`
                }}
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="t-mono bg-black/80 backdrop-blur-md text-[var(--color-bone)] text-[9px] px-3 py-1.5 rounded-full border border-[var(--color-line)] font-medium tracking-[0.08em]">
                  Custom Protocol Dashboard
                </span>
              </div>
            </div>
          ) : (
            /* Premium CSS WhatsApp Simulator Mockup */
            <div className="w-full max-w-[400px] bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[24px] p-5 shadow-large relative overflow-hidden flex flex-col gap-4 font-sans text-xs">
              
              {/* Top border decoration */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warn)]" />
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 mt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-accent)] flex items-center justify-center font-display font-bold text-[var(--color-accent)] text-xs">
                    S7
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-bone)] text-xs tracking-tight">SOR7ED Bot</div>
                    <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      online
                    </div>
                  </div>
                </div>
                <span className="t-mono text-[9px] text-[var(--color-muted)]">SYSTEM v0.2.0</span>
              </div>

              {/* Chat Area */}
              <div className="flex flex-col gap-3 py-1">
                
                {/* Bubble 1: User request */}
                <div className="bg-[var(--color-surface-2)] text-[var(--color-bone)] rounded-[18px] rounded-tr-none px-3.5 py-2.5 max-w-[85%] self-end border border-[var(--color-line)] font-medium">
                  can't sleep
                </div>

                {/* Bubble 2: Bot reply */}
                <div className="bg-[var(--color-surface-2)]/40 text-[var(--color-muted)] rounded-[18px] rounded-tl-none px-3.5 py-2.5 max-w-[90%] self-start border border-[var(--color-line)] flex flex-col gap-1.5">
                  <div className="font-mono text-[9px] text-[var(--color-accent)] uppercase tracking-wider font-bold">
                    🌿 MELTDOWN FIRST AID
                  </div>
                  <div className="text-[var(--color-bone)] leading-relaxed">
                    Sensory overload protocol active. 
                  </div>
                  <div className="pl-2.5 border-l-2 border-[var(--color-accent)] text-[11px] leading-relaxed">
                    1. Reduce input (lights off + noise cancellation)<br />
                    2. Temperature drop (wash face with cold water)
                  </div>
                </div>

                {/* Bubble 3: User request */}
                <div className="bg-[var(--color-surface-2)] text-[var(--color-bone)] rounded-[18px] rounded-tr-none px-3.5 py-2.5 max-w-[85%] self-end border border-[var(--color-line)] font-medium">
                  money reset
                </div>

                {/* Bubble 4: Bot reply */}
                <div className="bg-[var(--color-surface-2)]/40 text-[var(--color-muted)] rounded-[18px] rounded-tl-none px-3.5 py-2.5 max-w-[90%] self-start border border-[var(--color-line)] flex flex-col gap-1.5">
                  <div className="font-mono text-[9px] text-[var(--color-accent)] uppercase tracking-wider font-bold">
                    💷 SPEND SMART PROTOCOL
                  </div>
                  <div className="text-[var(--color-bone)] leading-relaxed">
                    Auto-budgeting framework loaded.
                  </div>
                  <div className="pl-2.5 border-l-2 border-[var(--color-accent)] text-[11px] leading-relaxed">
                    1. Create your 4 structural bank accounts.<br />
                    2. Configure direct transfers to separate savings immediately.
                  </div>
                </div>

              </div>

              {/* Status bar / Input block */}
              <div className="mt-1 pt-3 border-t border-[var(--color-line)] flex items-center justify-between text-[10px] font-mono text-[var(--color-muted)]">
                <span>[ Send protocol to WhatsApp ]</span>
                <span className="text-[var(--color-accent)] font-bold">ACTIVE</span>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
