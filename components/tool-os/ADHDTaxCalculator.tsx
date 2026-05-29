"use client";
import { useState } from "react";
import ToolResults, { type ToolResultsProps } from "@/components/tool-os/ToolResults";

const ACCENT = "#00C4C4";

function formatGBP(n: number) {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function calcResults(inputs: {
  lateFees: number;
  impulseBuys: number;
  forgottenSubs: number;
  lostItems: number;
  productivityLoss: number;
  income: number;
  missedOpportunities: number;
  mode: "conservative" | "realistic" | "aggressive";
}): ToolResultsProps {
  const multiplier = inputs.mode === "conservative" ? 0.7 : inputs.mode === "aggressive" ? 1.3 : 1;

  const lateFeesAnnual      = inputs.lateFees * 12 * multiplier;
  const impulseAnnual       = inputs.impulseBuys * 52 * multiplier;
  const subsAnnual          = inputs.forgottenSubs * 12 * multiplier;
  const lostAnnual          = inputs.lostItems * 12 * multiplier;
  const productivityAnnual  = (inputs.productivityLoss / 100) * inputs.income * 12 * multiplier;
  const missedAnnual        = inputs.missedOpportunities * 12 * multiplier;
  const total               = lateFeesAnnual + impulseAnnual + subsAnnual + lostAnnual + productivityAnnual + missedAnnual;

  const breakdown = [
    { label: "Late fees & missed payments", value: formatGBP(lateFeesAnnual), amount: lateFeesAnnual },
    { label: "Impulse purchases",           value: formatGBP(impulseAnnual),  amount: impulseAnnual },
    { label: "Forgotten subscriptions",     value: formatGBP(subsAnnual),     amount: subsAnnual },
    { label: "Lost item replacements",      value: formatGBP(lostAnnual),     amount: lostAnnual },
    { label: "Productivity loss",           value: formatGBP(productivityAnnual), amount: productivityAnnual },
    { label: "Missed opportunities",        value: formatGBP(missedAnnual),   amount: missedAnnual },
  ].sort((a, b) => b.amount - a.amount)
   .map((item, i) => ({ ...item, highlight: i === 0 }));

  const top2 = breakdown.slice(0, 2).map(b => b.label.toLowerCase());

  return {
    hero: {
      label: "Your estimated ADHD Tax",
      value: formatGBP(total) + " / year",
      sublabel: `${inputs.mode.charAt(0).toUpperCase() + inputs.mode.slice(1)} estimate · ${formatGBP(total / 12)}/month`,
      color: ACCENT,
    },
    breakdown,
    actionPlan: [
      {
        week: "Week 1 — Stop the bleeding",
        title: "Plug the two biggest leaks",
        steps: [
          `Set up autopay for all recurring bills — eliminates late fees immediately`,
          `Do a subscription audit: open your bank app, search "subscription" and cancel anything unused`,
          `Put your card in a drawer — use phone contactless only this week to add friction to impulse buys`,
        ],
      },
      {
        week: "Week 2 — Build the system",
        title: "Automate what your brain forgets",
        steps: [
          `Set a monthly "money reset" alarm — 20 mins on the 1st to review spending`,
          `Create a "24-hour rule" note on your phone — any purchase over £30 waits 24h`,
          `Install a budget tracker app and connect your main account`,
        ],
      },
      {
        week: "Week 3 — Reduce friction costs",
        title: "Fix the environment, not yourself",
        steps: [
          `Designate one spot for keys, wallet, and headphones — no exceptions`,
          `Enable low-balance alerts on your bank at £100`,
          `Write your top 3 money rules on a sticky note on your laptop`,
        ],
      },
      {
        week: "Week 4 — Lock it in",
        title: "Review and reinforce",
        steps: [
          `Compare this month vs last — which leaks shrank?`,
          `Rerun this calculator with updated numbers`,
          `Pick one habit to keep for next month`,
        ],
      },
    ],
    checklist: [
      { text: "Autopay set up for all bills and subscriptions" },
      { text: "Subscription audit done — unused ones cancelled" },
      { text: "24-hour rule note written and visible" },
      { text: "One physical home for keys/wallet/phone" },
      { text: "Low balance alert set on bank app" },
      { text: "Monthly money reset alarm set" },
      { text: "Budget tracker installed and connected" },
    ],
    toolSlug: "adhd-tax-calculator",
  };
}

export default function ADHDTaxCalculator({ isPaid = false }: { isPaid?: boolean }) {
  const [inputs, setInputs] = useState({
    lateFees: 0,
    impulseBuys: 30,
    forgottenSubs: 20,
    lostItems: 0,
    productivityLoss: 20,
    income: 3000,
    missedOpportunities: 0,
    mode: "realistic" as "conservative" | "realistic" | "aggressive",
  });
  const [results, setResults] = useState<ToolResultsProps | null>(null);

  function calculate() {
    setResults(calcResults(inputs));
  }

  function n(id: keyof typeof inputs) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputs(prev => ({ ...prev, [id]: parseFloat(e.target.value) || 0 }));
  }

  if (results) {
    return (
      <div>
        <ToolResults {...results} isPaid={isPaid} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mode selector */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">Estimate mode</p>
        <div className="flex gap-2">
          {(["conservative", "realistic", "aggressive"] as const).map(m => (
            <button
              key={m}
              onClick={() => setInputs(prev => ({ ...prev, mode: m }))}
              className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 border transition-colors flex-1"
              style={{
                borderColor: inputs.mode === m ? ACCENT : "rgba(255,255,255,0.1)",
                color: inputs.mode === m ? ACCENT : "rgba(255,255,255,0.4)",
                background: inputs.mode === m ? ACCENT + "11" : "transparent",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {[
          { id: "lateFees",           label: "Monthly late fees (credit cards, bills)", prefix: "£" },
          { id: "impulseBuys",        label: "Weekly impulse purchases",               prefix: "£" },
          { id: "forgottenSubs",      label: "Monthly unused subscriptions",            prefix: "£" },
          { id: "lostItems",          label: "Monthly lost item replacements",          prefix: "£" },
          { id: "missedOpportunities",label: "Monthly missed income opportunities",     prefix: "£" },
          { id: "income",             label: "Monthly income (after tax)",              prefix: "£" },
        ].map(({ id, label, prefix }) => (
          <div key={id}>
            <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">
              {label}
            </label>
            <div className="flex items-center border border-white/10 bg-[#0d1619] focus-within:border-white/30 transition-colors">
              <span className="px-3 text-sm text-white/30 font-mono">{prefix}</span>
              <input
                type="number"
                min="0"
                value={(inputs as any)[id] || ""}
                onChange={n(id as keyof typeof inputs)}
                className="flex-1 bg-transparent px-2 py-3 text-white text-sm outline-none font-mono"
                placeholder="0"
              />
            </div>
          </div>
        ))}

        {/* Productivity slider */}
        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">
            Estimated productivity loss due to ADHD
            <span className="ml-2 text-white">{inputs.productivityLoss}%</span>
          </label>
          <input
            type="range" min="0" max="100" step="5"
            value={inputs.productivityLoss}
            onChange={n("productivityLoss")}
            className="w-full accent-[#00C4C4]"
          />
          <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-4 font-display font-black uppercase text-black text-sm tracking-wide transition-opacity hover:opacity-90"
        style={{ background: ACCENT }}
      >
        Calculate my ADHD Tax →
      </button>
    </div>
  );
}
