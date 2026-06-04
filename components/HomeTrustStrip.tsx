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
  { icon: "compass",  title: "Across 7 areas of life", desc: "Start anywhere with the area that matters most" },
];

export default function HomeTrustStrip({ items = FALLBACK_ITEMS }: { items?: Item[] }) {
  return (
    <section className="border-y border-border-subtle bg-surface-subtle/30">
      <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-px">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] ?? ShieldCheck;
          return (
            <div key={i} className="py-7 md:py-9 md:px-6 flex flex-col gap-2">
              <Icon className="text-accent" size={22} strokeWidth={1.75} aria-hidden />
              <span className="t-heading">{it.title}</span>
              <span className="t-small">{it.desc}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
