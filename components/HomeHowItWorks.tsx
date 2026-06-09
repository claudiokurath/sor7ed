"use client";

import Link from "next/link";

type Step = { n: string; title: string; body: string };

const FALLBACK_STEPS: Step[] = [
  { n: "01", title: "Pick your branch", body: "Choose the part of life you want to improve first — from money and planning to energy, identity, and relationships." },
  { n: "02", title: "Use a tool or protocol", body: "Start with a calculator, article, or structured protocol that helps you understand the problem and take the next step." },
  { n: "03", title: "Get support on WhatsApp", body: "Receive step-by-step guidance without downloading another app or trying to hold everything in your head." },
];

export default function HomeHowItWorks({
  steps = FALLBACK_STEPS,
}: {
  steps?: Step[];
}) {
  return (
    <section id="how-it-works" className="section border-t border-[var(--color-line)] bg-transparent">
      <div className="page-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 flex flex-col gap-4 reveal in">
          <span className="t-label">/ How SOR7ED works</span>
          <h2 className="t-heading text-3xl md:text-5xl font-medium">
            Three steps. Built for how your brain <em>actually</em> works.
          </h2>
          <p className="t-body mt-2">
            Start with the area that feels hardest right now — then follow practical support designed for the way you think, not against it.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-3 reveal in">
          {steps.map((s) => (
            <div key={s.n} className="card p-8 md:p-10 flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="t-mono text-[var(--color-accent)] mb-8 flex items-center gap-3">
                  <span>STEP {s.n}</span>
                  <span className="flex-1 h-px bg-[var(--color-line)]" />
                </div>
                <h3 className="font-sans font-bold text-lg md:text-xl text-[var(--color-bone)] mb-3 leading-snug">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-10 reveal in">
          <Link href="/explore" className="btn btn-ghost">
            See where to start <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
