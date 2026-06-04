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
    height: 2px;
    background: var(--color-border-strong);
    outline: none;
  }
  .sor7ed-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-accent);
    border: 3px solid var(--color-surface);
    box-shadow: 0 0 0 1px var(--color-accent);
    cursor: pointer;
    border-radius: 0;
  }
  .sor7ed-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-accent);
    border: 3px solid var(--color-surface);
    cursor: pointer;
    border-radius: 0;
  }
`;

export default function AdhDTaxCalculator() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(LEAKS.map((l) => [l.id, l.initial]))
  );

  const { yearly, biggest } = useMemo(() => {
    let monthly = 0;
    let biggest = { label: "", val: -1 };
    for (const l of LEAKS) {
      const v = values[l.id] ?? 0;
      monthly += v;
      if (v > biggest.val) biggest = { label: l.label, val: v };
    }
    return { yearly: monthly * 12, biggest };
  }, [values]);

  return (
    <section className="section border-t border-border-subtle">
      <style dangerouslySetInnerHTML={{ __html: RANGE_STYLES }} />
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Intro */}
          <div>
            <span className="tag tag-accent mb-6">★ Flagship tool · Spend Smart</span>
            <h2 className="t-display mb-5">The ADHD Tax Calculator</h2>
            <p className="t-body max-w-md mb-4">
              See how much ADHD-related habits may be costing you each year — from
              late fees and impulse spending to lost items and forgotten subscriptions.
            </p>
            <p
              className="t-body max-w-md"
              style={{ borderLeft: "2px solid var(--color-accent)", paddingLeft: "1rem", color: "var(--color-ink)" }}
            >
              This isn&apos;t a willpower problem. It&apos;s the ADHD tax — and once you
              can see it, you can start clawing it back.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/auth/login" className="btn btn-accent">Get the full breakdown →</Link>
              <Link href="/tools" className="btn btn-ghost">Browse all tools →</Link>
            </div>
          </div>

          {/* Calculator card */}
          <div className="card" style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
            {LEAKS.map((l) => {
              const v = values[l.id] ?? 0;
              return (
                <div key={l.id} className="mb-6">
                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <span className="t-body" style={{ color: "var(--color-ink)" }}>{l.label}</span>
                    <span className="t-mono text-accent" style={{ fontWeight: 500 }}>{gbp(v)}</span>
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

            <div className="rule-accent" style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTopStyle: "dashed" }}>
              <div className="t-label mb-1">Your estimated ADHD tax / year</div>
              <div
                className="font-display text-accent"
                style={{ fontSize: "clamp(2.75rem, 7vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.01em" }}
              >
                {gbp(yearly)}
              </div>
              <p className="t-small mt-3" style={{ color: "var(--color-ink)" }}>
                {yearly === 0 ? (
                  "Drag the sliders to estimate your yearly ADHD tax."
                ) : (
                  <>
                    Biggest leak: <span className="text-coral" style={{ fontWeight: 700 }}>{biggest.label}</span>{" "}
                    — about {gbp(biggest.val * 12)} a year.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
