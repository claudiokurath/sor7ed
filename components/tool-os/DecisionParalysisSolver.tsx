"use client";
import { useState } from "react";
import ToolResults, { type ToolResultsProps } from "@/components/tool-os/ToolResults";

const ACCENT = "#E8453C";

function calcDecision(i: {
  riskTolerance: number; impact: number; information: number;
  urgency: number; reversible: boolean; alternatives: number;
}): ToolResultsProps {
  const raw = ((i.riskTolerance * i.impact * i.information) / Math.max(1, i.alternatives))
    + (i.reversible ? 5 : 0)
    - (10 - i.urgency);
  const score = Math.min(100, Math.max(0, Math.round((raw / 105) * 100)));
  const label = score >= 70 ? "Ready to decide" : score >= 45 ? "Almost ready" : "Not ready yet";

  const blockers = [
    { name: "Information", score: i.information, threshold: 6 },
    { name: "Risk comfort", score: i.riskTolerance, threshold: 5 },
    { name: "Urgency",      score: i.urgency,      threshold: 5 },
  ].filter(b => b.score < b.threshold)
   .map(b => b.name);

  const recommendation =
    i.information < 4 ? "gather_info" :
    i.alternatives > 4 ? "reduce_options" :
    !i.reversible && i.impact > 7 ? "convert_reversible" :
    i.urgency < 3 ? "set_deadline" : "decide_now";

  const recText: Record<string, { title: string; steps: string[] }> = {
    decide_now: {
      title: "You're ready — decide now",
      steps: [
        "Pick the option that passes your 'good enough' test",
        "Write the decision down in one sentence",
        "Set a review date 2 weeks out — not a reversal, just a check-in",
      ],
    },
    gather_info: {
      title: "Get one missing piece of information first",
      steps: [
        "Define exactly what you need to know (write it down)",
        "Set a deadline to get that info — max 48 hours",
        "If you can't get it in 48h, decide with what you have",
      ],
    },
    reduce_options: {
      title: "Too many alternatives — cut to two",
      steps: [
        "Eliminate any option you wouldn't be excited about in 6 months",
        "Keep only the top 2",
        "Decide between those two only",
      ],
    },
    convert_reversible: {
      title: "Convert this to a reversible test",
      steps: [
        "Find the smallest version of this decision you can try first",
        "Run it for 2 weeks and review",
        "Full commitment only after the test",
      ],
    },
    set_deadline: {
      title: "Set a decision deadline",
      steps: [
        "Pick a specific date and time to decide — write it now",
        "Tell one person your deadline (accountability)",
        "On that date, decide with what you have",
      ],
    },
  };

  const rec = recText[recommendation];

  return {
    hero: {
      label: "Your decision readiness score",
      value: `${score}/100 — ${label}`,
      sublabel: blockers.length > 0 ? `Blockers: ${blockers.join(", ")}` : "No major blockers identified",
      color: ACCENT,
    },
    breakdown: [
      { label: "Information sufficiency", value: `${i.information}/10`, amount: i.information * 10 },
      { label: "Risk tolerance",          value: `${i.riskTolerance}/10`, amount: i.riskTolerance * 10 },
      { label: "Urgency",                 value: `${i.urgency}/10`,  amount: i.urgency * 10 },
      { label: "Impact magnitude",        value: `${i.impact}/10`,   amount: i.impact * 10 },
      { label: "Reversibility",           value: i.reversible ? "Yes — easier to decide" : "No — higher stakes", amount: i.reversible ? 70 : 30, highlight: !i.reversible && i.impact > 7 },
      { label: "Alternatives",            value: `${i.alternatives} options`, amount: 100 - i.alternatives * 10 },
    ],
    actionPlan: [
      rec,
      {
        title: "Your decision brief",
        steps: [
          "Decision: [write your decision statement in one sentence]",
          "Options considered: [list your top 2–3]",
          "Good enough if: [what would make this decision acceptable]",
          "Reversibility plan: [how you'd undo it if needed]",
          "Next action: [literal first step after deciding]",
        ],
      },
    ],
    scripts: [
      {
        tone: "neutral",
        label: "Neutral",
        text: "I'm making a decision on [topic] by [date]. If you have relevant information, please share it before [date minus 1 day]. After that I'll proceed with what I have.",
      },
      {
        tone: "warm",
        label: "Warm",
        text: "Hey — I've been sitting on [topic] for a while and I'm going to make a call by [date]. Would love your input if you have any before then. Either way, I'll let you know what I decide.",
      },
      {
        tone: "firm",
        label: "Firm",
        text: "Decision on [topic]: I'm moving forward with [option] on [date]. Review in 2 weeks. Objections welcome before [date minus 1 day] — after that we proceed.",
      },
    ],
    toolSlug: "decision-paralysis-solver",
  };
}

export default function DecisionParalysisSolver({ isPaid = false }: { isPaid?: boolean }) {
  const [inputs, setInputs] = useState({
    riskTolerance: 5, impact: 5, information: 5,
    urgency: 5, reversible: true, alternatives: 2,
  });
  const [results, setResults] = useState<ToolResultsProps | null>(null);

  const slider = (id: keyof typeof inputs, label: string, sublabel: string) => (
    <div>
      <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">
        {label} <span className="text-white">{(inputs as any)[id]}/10</span>
        <span className="ml-2 text-white/30">({sublabel})</span>
      </label>
      <input type="range" min="1" max="10" step="1"
        value={(inputs as any)[id] as number}
        onChange={e => setInputs(prev => ({ ...prev, [id]: parseInt(e.target.value) }))}
        className="w-full accent-[#E8453C]" />
    </div>
  );

  if (results) return <ToolResults {...results} isPaid={isPaid} />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {slider("riskTolerance", "Risk tolerance",      "1=avoid all risk, 10=risk-friendly")}
      {slider("impact",        "Potential impact",    "1=minor, 10=life-changing")}
      {slider("information",   "Information you have","1=guessing, 10=fully informed")}
      {slider("urgency",       "Urgency",             "1=no rush, 10=decide today")}

      <div>
        <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">Number of alternatives</label>
        <div className="flex items-center border border-white/10 bg-[#0d1619] focus-within:border-white/30">
          <input type="number" min="1" max="10" value={inputs.alternatives}
            onChange={e => setInputs(prev => ({ ...prev, alternatives: parseInt(e.target.value) || 1 }))}
            className="flex-1 bg-transparent px-4 py-3 text-white text-sm outline-none font-mono" />
        </div>
      </div>

      <div className="flex items-center justify-between border border-white/10 bg-[#0d1619] px-4 py-3">
        <label className="text-xs font-mono uppercase tracking-widest text-white/40">Decision is reversible?</label>
        <button
          onClick={() => setInputs(prev => ({ ...prev, reversible: !prev.reversible }))}
          className="text-xs font-mono uppercase tracking-widest px-4 py-1.5 border transition-colors"
          style={{
            borderColor: inputs.reversible ? ACCENT : "rgba(255,255,255,0.1)",
            color: inputs.reversible ? ACCENT : "rgba(255,255,255,0.4)",
          }}>
          {inputs.reversible ? "Yes" : "No"}
        </button>
      </div>

      <button onClick={() => setResults(calcDecision(inputs))}
        className="w-full py-4 font-display font-black uppercase text-white text-sm tracking-wide hover:opacity-90 transition-opacity"
        style={{ background: ACCENT }}>
        Solve my paralysis →
      </button>
    </div>
  );
}
