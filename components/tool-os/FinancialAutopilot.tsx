"use client";
import { useState } from "react";
import ToolResults, { type ToolResultsProps } from "@/components/tool-os/ToolResults";

const ACCENT = "#00C4C4";
const fmt = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");
const pct = (n: number) => (n * 100).toFixed(0) + "%";

function calcAutopilot(i: {
  income: number; expenses: number; savings: number;
  debt: number; yearsToRetirement: number; riskTolerance: number;
}): ToolResultsProps {
  const surplus       = Math.max(0, i.income - i.expenses);
  const savingsRate   = i.income > 0 ? surplus / i.income : 0;
  const debtPayoff    = i.debt > 0 ? Math.min(surplus * 0.5, i.debt / 24) : 0;
  const investAlloc   = i.riskTolerance < 3 ? 0.3 : i.riskTolerance > 3 ? 0.7 : 0.5;
  const retireContrib = i.yearsToRetirement < 10 ? i.income * 0.2 : i.income * 0.1;
  const toInvest      = Math.max(0, (surplus - debtPayoff) * investAlloc);
  const toSave        = Math.max(0, surplus - debtPayoff - toInvest);
  const proj12Savings = i.savings + toSave * 12;
  const proj12Debt    = Math.max(0, i.debt - debtPayoff * 12);

  const readiness = savingsRate > 0.2 ? "Strong" : savingsRate > 0.1 ? "Building" : "Starting";

  return {
    hero: {
      label: "Your Autopilot Snapshot",
      value: pct(savingsRate) + " savings rate",
      sublabel: `${fmt(surplus)}/month surplus · Readiness: ${readiness}`,
      color: ACCENT,
    },
    breakdown: [
      { label: "Monthly surplus",        value: fmt(surplus),       amount: surplus },
      { label: "To savings",             value: fmt(toSave),        amount: toSave },
      { label: "To debt payoff",         value: fmt(debtPayoff),    amount: debtPayoff, highlight: i.debt > 0 },
      { label: "To investing",           value: fmt(toInvest),      amount: toInvest },
      { label: "Retirement contribution",value: fmt(retireContrib), amount: retireContrib },
    ].filter(b => b.amount > 0),
    actionPlan: [
      {
        title: "Your transfer plan (set these up on payday)",
        steps: [
          `Payday → Bills account: ${fmt(i.expenses)} (cover all fixed costs)`,
          i.debt > 0 ? `Payday → Debt payoff: ${fmt(debtPayoff)}/month (clears in ~${Math.ceil(i.debt / debtPayoff)} months)` : "",
          `Payday → Savings: ${fmt(toSave)} (emergency fund first)`,
          toInvest > 0 ? `Payday → Investing: ${fmt(toInvest)} (${pct(investAlloc)} allocation, ${i.riskTolerance < 3 ? "low risk" : i.riskTolerance > 3 ? "growth" : "balanced"})` : "",
          `Retirement: ${fmt(retireContrib)}/month target`,
        ].filter(Boolean),
      },
      {
        title: "12-month projection",
        steps: [
          `Estimated savings: ${fmt(proj12Savings)}`,
          i.debt > 0 ? `Estimated debt remaining: ${fmt(proj12Debt)}` : "No debt — invest the difference",
          `Based on conservative assumptions — adjust monthly`,
        ],
      },
    ],
    checklist: [
      { text: "Standing order set up for savings on payday" },
      i.debt > 0 ? { text: `Direct debit for debt payoff: ${fmt(debtPayoff)}/month` } : null,
      { text: "Bills account set up and funded" },
      { text: "Low balance alert enabled on main account (at £200)" },
      { text: "Monthly money reset alarm — 1st of each month, 20 mins" },
      toInvest > 0 ? { text: `Investing account funded: ${fmt(toInvest)}/month` } : null,
      { text: "Pension/retirement contribution reviewed" },
    ].filter(Boolean) as { text: string }[],
    toolSlug: "financial-autopilot",
  };
}

export default function FinancialAutopilot({ isPaid = false }: { isPaid?: boolean }) {
  const [inputs, setInputs] = useState({
    income: 3000, expenses: 2000, savings: 0,
    debt: 0, yearsToRetirement: 30, riskTolerance: 3,
  });
  const [results, setResults] = useState<ToolResultsProps | null>(null);

  const n = (id: keyof typeof inputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputs(prev => ({ ...prev, [id]: parseFloat(e.target.value) || 0 }));

  if (results) return <ToolResults {...results} isPaid={isPaid} />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {[
        { id: "income",            label: "Monthly income (after tax)",   prefix: "£" },
        { id: "expenses",          label: "Monthly expenses (total)",      prefix: "£" },
        { id: "savings",           label: "Current savings",               prefix: "£" },
        { id: "debt",              label: "Total debt (0 if none)",        prefix: "£" },
        { id: "yearsToRetirement", label: "Years until retirement",        prefix: ""  },
      ].map(({ id, label, prefix }) => (
        <div key={id}>
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">{label}</label>
          <div className="flex items-center border border-white/10 bg-[#0d1619] focus-within:border-white/30">
            {prefix && <span className="px-3 text-sm text-white/30 font-mono">{prefix}</span>}
            <input type="number" min="0" value={(inputs as any)[id] || ""} onChange={n(id as keyof typeof inputs)}
              className="flex-1 bg-transparent px-3 py-3 text-white text-sm outline-none font-mono" placeholder="0" />
          </div>
        </div>
      ))}

      <div>
        <label className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-1.5">
          Risk tolerance
          <span className="ml-2 text-white">{["", "Very low", "Low", "Balanced", "Growth", "Aggressive"][inputs.riskTolerance]}</span>
        </label>
        <input type="range" min="1" max="5" step="1" value={inputs.riskTolerance}
          onChange={n("riskTolerance")} className="w-full accent-[#00C4C4]" />
        <div className="flex justify-between text-[10px] font-mono text-white/20 mt-1">
          <span>Very low</span><span>Aggressive</span>
        </div>
      </div>

      <button onClick={() => setResults(calcAutopilot(inputs))}
        className="w-full py-4 font-display font-black uppercase text-black text-sm tracking-wide hover:opacity-90 transition-opacity"
        style={{ background: ACCENT }}>
        Build my autopilot →
      </button>
    </div>
  );
}
