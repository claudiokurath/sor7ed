"use client";

import { ShieldCheck, MessageCircle, ListChecks, Compass } from "lucide-react";

type Item = { icon: "shield" | "whatsapp" | "checks" | "compass"; title: string; desc: string };

const ICONS = {
  shield: ShieldCheck,
  whatsapp: MessageCircle,
  checks: ListChecks,
  compass: Compass,
};

const FALLBACK_ITEMS: Item[] = [
  { icon: "shield",   title: "Neurodivergent-first", desc: "Built for ADHD, autism, executive dysfunction & burnout" },
  { icon: "whatsapp", title: "Delivered on WhatsApp", desc: "Support where you already are — no new app to learn" },
  { icon: "checks",   title: "Practical, step-by-step", desc: "Tools, articles & protocols that reduce overwhelm" },
  { icon: "compass",  title: "Across 7 areas of life", desc: "Start anywhere with the area that matters most right now" },
];

export default function HomeTrustStrip({ items = FALLBACK_ITEMS }: { items?: Item[] }) {
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)]/40 relative z-10">
      <div className="page-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 py-10 md:py-12">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] ?? ShieldCheck;
          return (
            <div key={i} className="flex flex-col gap-2.5 reveal in">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-soft)] flex items-center justify-center">
                <Icon className="text-[var(--color-accent)]" size={18} strokeWidth={2} aria-hidden />
              </div>
              <h3 className="font-sans font-bold text-sm tracking-tight text-[var(--color-bone)]">
                {it.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-muted)]">
                {it.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
