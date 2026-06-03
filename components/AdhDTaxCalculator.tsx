"use client";
import { useState } from "react";
import Link from "next/link";

const ROWS = [
  { id: "r1", label: "Late fees & missed payments",       min: 0, max: 300, step: 5,  init: 35 },
  { id: "r2", label: "Impulse buys you regret",           min: 0, max: 500, step: 5,  init: 80 },
  { id: "r3", label: "Replacing lost or duplicate items", min: 0, max: 300, step: 5,  init: 25 },
  { id: "r4", label: "Forgotten subscriptions",           min: 0, max: 200, step: 2,  init: 22 },
];

const gbp = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

export default function AdhDTaxCalculator() {
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries(ROWS.map((r) => [r.id, r.init]))
  );

  const monthly = Object.values(vals).reduce((a, b) => a + b, 0);
  const biggest = ROWS.reduce((a, b) => (vals[a.id] >= vals[b.id] ? a : b));

  return (
    <div className="hp-calc-grid">
      <div data-reveal>
        <span className="hp-badge">★ Flagship tool · Spend Smart</span>
        <h2 style={{
          fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 800,
          fontSize: "clamp(28px,3.8vw,48px)", lineHeight: 1, letterSpacing: "-0.02em",
          margin: "22px 0 18px", color: "#eaf1ee",
        }}>
          The ADHD Tax Calculator
        </h2>
        <p style={{ color: "var(--hp-muted)", fontSize: "16.5px", maxWidth: "46ch", marginBottom: "16px" }}>
          See how much ADHD-related habits may be costing you each year — from late fees and
          impulse spending to lost items and forgotten subscriptions.
        </p>
        <p style={{ color: "#eaf1ee", fontSize: "15px", borderLeft: "2px solid var(--hp-accent)", paddingLeft: "16px" }}>
          This isn&apos;t a willpower problem. It&apos;s the ADHD tax — and once you can see it, you can
          start clawing it back.
        </p>
        <div style={{ marginTop: "26px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/signup" className="hp-btn hp-btn-primary">Get the full breakdown →</Link>
          <Link href="/tools"  className="hp-btn hp-btn-ghost">Browse all tools →</Link>
        </div>
      </div>

      <div className="hp-calc-card" data-reveal>
        {ROWS.map((row) => (
          <div key={row.id} style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <span style={{ fontSize: "14.5px", color: "#eaf1ee" }}>{row.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", color: "var(--hp-accent)", fontWeight: 700 }}>
                {gbp(vals[row.id])}
              </span>
            </div>
            <input
              type="range"
              className="hp-range"
              min={row.min} max={row.max} step={row.step}
              value={vals[row.id]}
              onChange={(e) => setVals((v) => ({ ...v, [row.id]: +e.target.value }))}
            />
          </div>
        ))}
        <div style={{ marginTop: "28px", paddingTop: "26px", borderTop: "1px dashed var(--hp-line)" }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: "12px",
            textTransform: "uppercase", letterSpacing: ".1em", color: "var(--hp-muted)", marginBottom: "6px",
          }}>
            Your estimated ADHD tax / year
          </div>
          <div style={{
            fontFamily: "'Archivo Expanded','Archivo',sans-serif", fontWeight: 900,
            fontSize: "clamp(44px,7vw,78px)", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--hp-accent)",
          }}>
            {gbp(monthly * 12)}
          </div>
          <div style={{ marginTop: "14px", fontSize: "14px", color: "#eaf1ee" }}>
            {monthly === 0 ? (
              "Drag the sliders to estimate your yearly ADHD tax."
            ) : (
              <>Biggest leak: <b style={{ color: "var(--hp-warn)" }}>{biggest.label}</b> — about {gbp(vals[biggest.id] * 12)} a year.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
