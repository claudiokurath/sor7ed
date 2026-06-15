'use client';

import { useState } from 'react';

const branches = [
  {
    id: 1,
    title: "Keep Going",
    subtitle: "Mental Resilience",
    description: "When the wall hits and momentum dies, these protocols rebuild your forward motion. Rejection sensitivity, burnout recovery, and the art of starting again.",
    keyword: "KEEPGOING"
  },
  {
    id: 2,
    title: "Feel Good",
    subtitle: "Body & Wellbeing",
    description: "Your body is the hardware your brain runs on. Protocols for sleep, movement, sensory regulation, and the physical systems that neurodivergent brains often neglect.",
    keyword: "FEELGOOD"
  },
  {
    id: 3,
    title: "Spend Smart",
    subtitle: "Money & Executive Function",
    description: "Impulsivity and money are a dangerous combination. These protocols bring structure to spending, saving, and the executive function gaps that derail financial stability.",
    keyword: "SPENDSMART"
  },
  {
    id: 4,
    title: "Be Connected",
    subtitle: "Relationships",
    description: "Masking is exhausting. Communication can feel impossible. These protocols help you build and maintain real connections on your own terms.",
    keyword: "CONNECTED"
  },
  {
    id: 5,
    title: "Plan Ahead",
    subtitle: "Organisation & Time",
    description: "Time blindness, task paralysis, and the blank-page problem. Protocols that replace overwhelm with a clear, repeatable system for getting things done.",
    keyword: "PLANAHEAD"
  },
  {
    id: 6,
    title: "Be Yourself",
    subtitle: "Identity & Confidence",
    description: "Decades of masking leaves a gap where your identity should be. These protocols help you find, own, and express who you actually are.",
    keyword: "BEYOURSELF"
  },
  {
    id: 7,
    title: "Level Up",
    subtitle: "Skills & Growth",
    description: "Hyperfocus is a superpower when it's directed. These protocols help you channel your neurodivergent strengths into deliberate, sustainable growth.",
    keyword: "LEVELUP"
  }
];

export default function BranchesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="branches" className="py-24 bg-black-soft">
      <div className="container-padding">
        <div className="text-center mb-16">
          <div className="font-display text-sm font-semibold text-gold tracking-[0.35em] uppercase mb-4">
            The Framework
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            The 7 Branches of <span className="text-gradient-gold">SOR7ED</span>
          </h2>
          <p className="text-lg text-gray-body max-w-3xl mx-auto leading-relaxed">
            Seven areas of life where neurodivergent adults face the most friction. 
            One protocol system designed to reduce that friction — immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-black-card border border-black-border p-8 relative overflow-hidden transition-all duration-300 hover:border-gold/20 hover:bg-black-border/50 hover:-translate-y-1 cursor-default group"
              onMouseEnter={() => setHoveredCard(branch.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Top border animation */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transform transition-transform duration-400 ${
                hoveredCard === branch.id ? 'scale-x-100' : 'scale-x-0'
              }`} />

              <div className="font-display text-xs font-semibold text-gold tracking-[0.25em] uppercase mb-3">
                Branch {branch.id.toString().padStart(2, '0')}
              </div>
              
              <h3 className="font-display text-2xl font-bold text-white tracking-tight uppercase mb-2">
                {branch.title}
              </h3>
              
              <div className="font-display text-sm font-medium text-gold/70 tracking-[0.15em] uppercase mb-4">
                {branch.subtitle}
              </div>
              
              <p className="text-gray-muted leading-relaxed mb-6 text-sm">
                {branch.description}
              </p>
              
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-gold/10 border border-gold/20 text-gold font-display text-xs font-semibold tracking-[0.15em] uppercase">
                <span>◆</span>
                <span>Text: {branch.keyword}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
