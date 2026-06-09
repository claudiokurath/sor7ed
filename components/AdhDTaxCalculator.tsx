"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Leak = {
  id: string;
  label: string;
  max: number;
  step: number;
  initial: number;
};

const LEAKS: Leak[] = [
  { id: "late",    label: "Late fees & missed payments",        max: 300, step: 5, initial: 35 },
  { id: "impulse", label: "Impulse buys you regret",            max: 500, step: 5, initial: 80 },
  { id: "lost",    label: "Replacing lost or duplicate items",  max: 300, step: 5, initial: 25 },
  { id: "subs",    label: "Forgotten subscriptions",            max: 200, step: 2, initial: 22 },
];

const gbp = (n: number) =>
  "£" + Math.round(n).toLocaleString("en-GB");

const RANGE_STYLES = `
  .sor7ed-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: var(--color-line);
    border-radius: 2px;
    outline: none;
  }
  .sor7ed-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--color-accent);
    border: 3px solid var(--color-surface);
    box-shadow: 0 0 0 1px var(--color-accent);
    cursor: pointer;
    border-radius: 50%;
    transition: transform 0.1s;
  }
  .sor7ed-range::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  .sor7ed-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-accent);
    border: 3px solid var(--color-surface);
    cursor: pointer;
    border-radius: 50%;
  }
`;

export default function AdhDTaxCalculator() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(LEAKS.map((l) => [l.id, l.initial]))
  );

  const { yearly, biggest, allZero } = useMemo(() => {
    let monthly = 0;
    let biggest = { label: "", val: -1 };
    let allZero = true;
    for (const l of LEAKS) {
      const v = values[l.id] ?? 0;
      monthly += v;
      if (v > 0) allZero = false;
      if (v > biggest.val) biggest = { label: l.label, val: v };
    }
    return { yearly: monthly * 12, biggest, allZero };
  }, [values]);

  return (
    <section id="tools" className="section border-t border-[var(--color-line)] bg-transparent">
      <style dangerouslySetInnerHTML={{ __html: RANGE_STYLES }} />
      <div className="page-container">
        {/* Section Label row */}
        <div className="mb-10 reveal in">
          <span className="t-label">/ Tools</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column: Intro */}
          <div className="flex flex-col gap-6 reveal in">
            <div className="flex">
              <span className="text-[10px] tracking-[0.14em] uppercase font-mono font-bold px-3 py-1 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-full border border-[var(--color-line)]">
                ★ Flagship tool · Spend Smart
              </span>
            </div>
            <h2 className="t-heading text-3xl md:text-5xl font-medium">
              The ADHD Tax Calculator
            </h2>
            <p className="t-body max-w-md">
              See how much ADHD-related habits may be costing you each year — from
              late fees and impulse spending to lost items and forgotten subscriptions.
            </p>
            <blockquote
              className="font-serif italic text-[16px] md:text-[18px] max-w-md leading-relaxed text-[var(--color-bone)]/90"
              style={{ borderLeft: "3px solid var(--color-accent)", paddingLeft: "1.25rem" }}
            >
              "This isn't a willpower problem. It's the ADHD tax — and once you
              can see it, you can start clawing it back."
            </blockquote>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="https://wa.me/447591922247?text=ADHD%20TAX" className="btn btn-primary">
                Get the full breakdown <span className="arrow">→</span>
              </Link>
              <Link href="/tools" className="btn btn-ghost">
                Browse all tools <span className="arrow">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Calculator Card */}
          <div className="card p-8 md:p-10 reveal in shadow-medium">
            {LEAKS.map((l) => {
              const v = values[l.id] ?? 0;
              return (
                <div key={l.id} className="mb-6">
                  <div className="flex items-baseline justify-between gap-3 mb-2.5">
                    <span className="text-sm font-sans font-medium text-[var(--color-bone)]">{l.label}</span>
                    <span className="t-mono text-[var(--color-accent)] font-bold">{gbp(v)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={l.max}
                    step={l.step}
                    value={v}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [l.id]: Number(e.target.value) }))
                    }
                    aria-label={l.label}
                    className="sor7ed-range"
                  />
                </div>
              );
            })}

            {/* Results Display */}
            <div className="mt-8 pt-6 border-t border-dashed border-[var(--color-line)]">
              <div className="t-label mb-1.5">Your estimated ADHD tax / year</div>
              <div
                className="font-display font-black text-[var(--color-accent)]"
                style={{ fontSize: "clamp(3rem, 7vw, 4.25rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
              >
                {gbp(yearly)}
              </div>
              <div className="text-sm mt-4 text-[var(--color-muted)] leading-relaxed">
                {allZero ? (
                  <span className="italic">Drag the sliders to estimate your yearly ADHD tax.</span>
                ) : (
                  <>
                    Biggest leak: <span className="font-bold text-[var(--color-warn)]">{biggest.label}</span>{" "}
                    — about <span className="font-bold text-[var(--color-bone)]">{gbp(biggest.val * 12)}</span> a year.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
