"use client";

import Link from "next/link";

type Step = { n: string; title: string; body: string };

const FALLBACK_STEPS: Step[] = [
  { n: "01", title: "Pick your branch", body: "Choose the part of life you want to improve first — money, planning, energy, identity, or relationships." },
  { n: "02", title: "Use a tool or protocol", body: "Start with a calculator, article, or structured protocol that helps you understand the problem and take the next step." },
  { n: "03", title: "Get support on WhatsApp", body: "Receive step-by-step guidance without downloading another app or holding everything in your head." },
];

export default function HomeHowItWorks({
  title = "How SOR7ED works",
  kicker = "How it works",
  intro,
  bannerSrc = "/Images/banners/dash%20banner.png",
  steps = FALLBACK_STEPS,
  ctaHref = "/explore",
  ctaLabel = "See where to start →",
}: {
  title?: string;
  kicker?: string;
  intro?: string;
  bannerSrc?: string;
  steps?: Step[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="section border-t border-border-subtle">
      {/* Banner header — matches /tools & /articles hero pattern */}
      <div className="relative w-full min-h-[34vh] flex items-end overflow-hidden mb-10">
        <img src={bannerSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <div className="relative z-10 page-container py-10 md:py-14 w-full">
          <p className="t-label mb-3">{kicker}</p>
          <h2 className="t-display max-w-2xl">{title}</h2>
        </div>
      </div>

      <div className="page-container">
        {intro ? <p className="t-body max-w-xl mb-10">{intro}</p> : null}

        <div className="grid gap-2 md:grid-cols-3 stagger">
          {steps.map((s) => (
            <div key={s.n} className="card" style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
              <div className="t-mono text-accent mb-8 flex items-center gap-3">
                <span>STEP {s.n}</span>
                <span className="flex-1 h-px bg-border" />
              </div>
              <h3 className="t-title mb-3">{s.title}</h3>
              <p className="t-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href={ctaHref} className="btn btn-ghost">{ctaLabel}</Link>
        </div>
      </div>
    </section>
  );
}
