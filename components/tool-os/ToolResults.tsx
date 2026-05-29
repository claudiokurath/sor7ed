"use client";
import { useState } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────
export type HeroResult = {
  label: string;        // e.g. "Your ADHD Tax"
  value: string;        // e.g. "£4,320 / year"
  sublabel?: string;    // e.g. "Realistic estimate"
  color?: string;       // hex accent colour
};

export type BreakdownItem = {
  label: string;
  value: string;
  amount?: number;      // for sorting/charting
  highlight?: boolean;  // top leak
};

export type ActionItem = {
  week?: string;        // e.g. "Week 1"
  title: string;
  steps: string[];
};

export type ChecklistItem = {
  text: string;
  done?: boolean;
};

export type Script = {
  tone: "neutral" | "warm" | "firm";
  label: string;
  text: string;
};

export type ToolResultsProps = {
  hero: HeroResult;
  breakdown?: BreakdownItem[];
  actionPlan?: ActionItem[];
  checklist?: ChecklistItem[];
  scripts?: Script[];
  isPaid?: boolean;
  toolSlug?: string;
};

// ── Main component ───────────────────────────────────────────────
export default function ToolResults({
  hero,
  breakdown,
  actionPlan,
  checklist,
  scripts,
  isPaid = false,
  toolSlug,
}: ToolResultsProps) {
  const [activeScript, setActiveScript] = useState<"neutral" | "warm" | "firm">("neutral");
  const [copied, setCopied] = useState(false);

  function copyScript(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const accentColor = hero.color || "#00C4C4";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Hero Result ─────────────────────────────────────────── */}
      <div className="border border-white/10 p-8" style={{ background: "#0d1619" }}>
        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
          {hero.label}
        </p>
        <p
          className="font-display font-black uppercase leading-none mb-2"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: accentColor, letterSpacing: "-0.02em" }}
        >
          {hero.value}
        </p>
        {hero.sublabel && (
          <p className="text-sm text-white/50 font-mono">{hero.sublabel}</p>
        )}
      </div>

      {/* ── Breakdown Chart ─────────────────────────────────────── */}
      {breakdown && breakdown.length > 0 && (
        <div className="border border-white/10 p-6" style={{ background: "#0d1619" }}>
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
            Where it comes from
          </p>
          <div className="space-y-3">
            {breakdown.map((item, i) => {
              const max = Math.max(...breakdown.map(b => b.amount || 0));
              const pct = max > 0 && item.amount ? (item.amount / max) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/80 flex items-center gap-2">
                      {item.highlight && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 uppercase tracking-widest"
                          style={{ background: accentColor + "22", color: accentColor }}>
                          Top leak
                        </span>
                      )}
                      {item.label}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">{item.value}</span>
                  </div>
                  {pct > 0 && (
                    <div className="h-1 bg-white/5 w-full">
                      <div
                        className="h-1 transition-all duration-500"
                        style={{ width: `${pct}%`, background: item.highlight ? accentColor : "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action Plan ─────────────────────────────────────────── */}
      {actionPlan && actionPlan.length > 0 && (
        isPaid ? (
          <div className="border border-white/10 p-6" style={{ background: "#0d1619" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
              Your plan
            </p>
            <div className="space-y-6">
              {actionPlan.map((phase, i) => (
                <div key={i}>
                  {phase.week && (
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-2"
                      style={{ color: accentColor }}>
                      {phase.week}
                    </p>
                  )}
                  <p className="text-sm font-bold text-white mb-2">{phase.title}</p>
                  <ul className="space-y-1.5">
                    {phase.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/60">
                        <span style={{ color: accentColor }} className="mt-0.5 flex-none">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <UpgradeGate label="30-day action plan" toolSlug={toolSlug} accentColor={accentColor} />
        )
      )}

      {/* ── Checklist ───────────────────────────────────────────── */}
      {checklist && checklist.length > 0 && (
        isPaid ? (
          <div className="border border-white/10 p-6" style={{ background: "#0d1619" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
              Setup checklist
            </p>
            <ul className="space-y-2">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 flex-none w-4 h-4 border border-white/20 flex items-center justify-center text-[10px]"
                    style={{ color: accentColor }}>
                    {item.done ? "✓" : ""}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <UpgradeGate label="Setup checklist" toolSlug={toolSlug} accentColor={accentColor} />
        )
      )}

      {/* ── Scripts ─────────────────────────────────────────────── */}
      {scripts && scripts.length > 0 && (
        isPaid ? (
          <div className="border border-white/10 p-6" style={{ background: "#0d1619" }}>
            <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
              Script pack
            </p>
            <div className="flex gap-2 mb-4">
              {scripts.map((s) => (
                <button
                  key={s.tone}
                  onClick={() => setActiveScript(s.tone)}
                  className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border transition-colors"
                  style={{
                    borderColor: activeScript === s.tone ? accentColor : "rgba(255,255,255,0.1)",
                    color: activeScript === s.tone ? accentColor : "rgba(255,255,255,0.4)",
                    background: activeScript === s.tone ? accentColor + "11" : "transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {scripts.filter(s => s.tone === activeScript).map((s, i) => (
              <div key={i}>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap border border-white/5 p-4 font-mono text-xs">
                  {s.text}
                </p>
                <button
                  onClick={() => copyScript(s.text)}
                  className="mt-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-white/10 hover:border-white/40 transition-colors text-white/40 hover:text-white/80"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <UpgradeGate label="Script pack (3 tone variants)" toolSlug={toolSlug} accentColor={accentColor} />
        )
      )}

      {/* ── Rerun ───────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[10px] font-mono uppercase tracking-widest px-4 py-2.5 border border-white/10 hover:border-white/40 text-white/40 hover:text-white transition-colors"
        >
          ↑ Rerun with new inputs
        </button>
        {!isPaid && (
          <Link
            href="/signup"
            className="text-[10px] font-mono uppercase tracking-widest px-4 py-2.5 border transition-colors"
            style={{ borderColor: accentColor, color: accentColor, background: accentColor + "11" }}
          >
            Unlock full results →
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Upgrade gate ─────────────────────────────────────────────────
function UpgradeGate({ label, toolSlug, accentColor }: { label: string; toolSlug?: string; accentColor: string }) {
  return (
    <div className="border border-white/10 p-6 relative overflow-hidden" style={{ background: "#0d1619" }}>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex flex-col items-center justify-center z-10 gap-3">
        <p className="text-xs font-mono uppercase tracking-widest text-white/50">{label}</p>
        <Link
          href="/signup"
          className="text-xs font-mono uppercase tracking-widest px-5 py-2.5 border transition-colors"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          Unlock — Sign up free →
        </Link>
      </div>
      <div className="opacity-20 space-y-2 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-white/10 rounded" style={{ width: `${70 + i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}
