'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const GOLD = '#C9A84C';

const ROTATING_WORDS = [
  'Overwhelmed',
  'Exhausted',
  'Wired differently',
  'Scattered',
  'Behind',
  'Stuck',
];

const STATS = [
  { value: '12,847', label: 'Templates sent' },
  { value: '7', label: 'Life branches' },
  { value: '4.8', label: 'Average rating' },
  { value: '3,892', label: 'Tools completed' },
];

const TOOLS = [
  {
    id: "adhd-tax-calculator",
    name: "ADHD Tax Calculator",
    time: "3 min",
    desc: "Find out what ADHD costs you per year in late fees, forgotten subscriptions, and impulse purchases.",
    completions: 1247,
    price: "£7"
  },
  {
    id: "time-blindness-check",
    name: "Time Blindness Check",
    time: "2 min",
    desc: "Discover your Time Distortion Factor and get calendar protocols that actually work.",
    completions: 3892,
    price: "£7"
  },
  {
    id: "executive-function-audit",
    name: "Executive Function Audit",
    time: "5 min",
    desc: "Full cognitive profile. Identifies your specific EF gaps and generates targeted interventions.",
    completions: 876,
    price: "£12"
  }
];

const TEMPLATES = [
  {
    id: "adhd-tax-tracker",
    name: "ADHD Tax Tracker",
    desc: "Spreadsheet template to track what ADHD costs you monthly.",
    format: "WhatsApp + Sheets"
  },
  {
    id: "time-blindness-log",
    name: "Time Blindness Log",
    desc: "Simple log to spot your personal time distortion patterns.",
    format: "WhatsApp + PDF"
  },
  {
    id: "dopamine-menu",
    name: "Dopamine Menu",
    desc: "Pre-built menu of quick wins for low-energy days.",
    format: "WhatsApp + Notion"
  }
];

const FAQS = [
  {
    q: "What's the difference between templates and tools?",
    a: "Templates are static files (spreadsheets, PDFs, checklists) sent to your WhatsApp — free forever, no account needed. Tools are interactive assessments that diagnose your specific situation and generate personalized protocols — these require an account and payment."
  },
  {
    q: "Do I need an account for templates?",
    a: "No. Text SOR7ED to +44 7591 922247 and templates arrive instantly. No signup, no password, no friction."
  },
  {
    q: "Why do tools cost money?",
    a: "Tools use custom algorithms to analyze your inputs and build personalized protocols. They require ongoing development, hosting, and support. Templates are simpler to maintain, so we keep them free."
  },
  {
    q: "Can I try a tool before buying?",
    a: "Yes. Every tool has a free preview showing exactly what you'll get. You see the full report structure before you pay."
  },
  {
    q: "Is this a substitute for therapy?",
    a: "Absolutely not. We provide organizational tools and frameworks. For medical or psychological advice, always consult a professional."
  }
];

const WHATSAPP_NUMBER = "+44 7591 922247";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=SOR7ED`;

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function RotatingHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-end relative overflow-hidden pb-24 pt-36">
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-10"
        style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-20">
        <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-16">
          Practical protocols — WhatsApp delivery
        </p>

        <h1 className="font-black leading-[0.9] tracking-tight mb-12">
          <span className="block text-xl md:text-2xl font-light tracking-[0.2em] text-white/25 uppercase mb-6">
            If you&apos;re feeling
          </span>
          <span
            className="block text-7xl md:text-[11vw] transition-all duration-400 ease-out"
            style={{
              color: GOLD,
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
              filter: isAnimating ? 'blur(8px)' : 'blur(0)',
            }}
          >
            {ROTATING_WORDS[currentIndex]}
          </span>
          <span className="block text-7xl md:text-[11vw] text-white">
            we&apos;ve got you.
          </span>
        </h1>

        <div className="flex flex-wrap items-center gap-6 mt-20">
          <Link
            href="/explore"
            className="inline-flex items-center gap-3 border border-white/70 hover:bg-white hover:text-black text-white px-10 py-4 font-black text-xs tracking-widest uppercase transition-all duration-300"
          >
            Explore 7 Branches
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-white/35 hover:text-white text-xs tracking-widest uppercase font-bold transition-colors"
          >
            <span style={{ color: GOLD }}>↗</span>
            Text SOR7ED on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function BranchCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-3">Seven branches</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Every part of your life.</h2>
          </div>
          <Link
            href="/explore"
            className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-white/25 hover:text-white transition-colors border-b border-white/15 pb-1"
          >
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-px overflow-x-auto bg-white/[0.04]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {branches.map((branch, i) => (
          <Link
            key={branch.slug}
            href={`/${branch.slug}`}
            className="group flex-shrink-0 w-72 bg-black p-10 hover:bg-white/[0.02] transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <span className="text-3xl">{branch.icon}</span>
              <span className="font-mono text-[10px] tracking-widest text-white/15">0{i + 1}</span>
            </div>
            <h3 className="text-xl font-black tracking-tight mb-3 text-white group-hover:text-white/70 transition-colors">
              {branch.name}
            </h3>
            <p className="text-white/25 text-sm leading-relaxed">{branch.description}</p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-5 h-px transition-all duration-300 group-hover:w-8" style={{ backgroundColor: branch.color }} />
              <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase group-hover:text-white/40 transition-colors">
                Explore
              </span>
            </div>
          </Link>
        ))}
        <Link
          href="/explore"
          className="group flex-shrink-0 w-48 bg-black flex flex-col items-center justify-center p-10 hover:bg-white/[0.02] transition-colors"
        >
          <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase group-hover:text-white/50 transition-colors">See all →</span>
        </Link>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-black text-white">

      <RotatingHero />

      {/* STATS */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-8 first:pl-0 last:pr-0 py-10">
                <div className="text-4xl font-black tracking-tight" style={{ color: GOLD }}>
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-widest text-white/20 uppercase mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES CAROUSEL */}
      <BranchCarousel />

      {/* FREE TEMPLATES */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-3">Free forever</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Templates.</h2>
            <p className="text-white/30 mt-4 text-sm">Instant. No account. Straight to your WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {TEMPLATES.map((template) => (
              <a
                key={template.id}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-black p-10 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase">Template</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: GOLD }}>Free</span>
                </div>
                <h3 className="text-xl font-black mb-4 group-hover:text-white/70 transition-colors">{template.name}</h3>
                <p className="text-white/30 text-sm mb-10 leading-relaxed">{template.desc}</p>
                <span className="font-mono text-[10px] tracking-widest text-white/15 uppercase">{template.format}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM TOOLS */}
      <section id="tools" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: GOLD }}>Premium</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Tools.</h2>
            <p className="text-white/30 mt-4 text-sm">Interactive assessments. Personalized protocols. Account required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {TOOLS.map((tool) => (
              <div key={tool.id} className="bg-black p-10 hover:bg-white/[0.02] transition-colors group">
                <div className="flex justify-between items-start mb-10">
                  <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase">Tool · {tool.time}</span>
                  <span className="font-black text-xl" style={{ color: GOLD }}>{tool.price}</span>
                </div>
                <h3 className="text-xl font-black mb-4">{tool.name}</h3>
                <p className="text-white/30 text-sm mb-10 leading-relaxed">{tool.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] tracking-widest text-white/15 uppercase">{tool.completions.toLocaleString()} completed</span>
                  <Link
                    href="/signup?redirect=/tools"
                    className="font-mono text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition-colors border-b border-white/10 pb-0.5"
                  >
                    Get access →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-3">Process</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">How it works.</h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {[
              { step: "01", title: "Get free templates", desc: `Text SOR7ED to ${WHATSAPP_NUMBER}. Instant delivery, no account, no catch.` },
              { step: "02", title: "Hit a wall?", desc: "When templates aren't enough, our tools diagnose your specific friction points." },
              { step: "03", title: "Create account", desc: "One account unlocks all tools, saves your results, builds your protocol library." }
            ].map((item) => (
              <div key={item.step} className="bg-black p-10">
                <div className="font-black text-7xl tracking-tight mb-8 opacity-20" style={{ color: GOLD }}>{item.step}</div>
                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-32 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-8 h-px mb-12" style={{ backgroundColor: GOLD }} />
          <blockquote className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1] mb-12 text-white/85">
            &ldquo;I started with the free templates. Two weeks later I bought the Tax Calculator and finally understood where my money was going.&rdquo;
          </blockquote>
          <footer className="font-mono text-[11px] tracking-widest text-white/25 uppercase">
            James R. — ADHD, software developer
          </footer>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-3">Questions</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">FAQ.</h2>
          <div className="divide-y divide-white/[0.06]">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-8">
                <h3 className="font-black text-lg mb-4 tracking-tight">{faq.q}</h3>
                <p className="text-white/35 text-sm leading-relaxed max-w-2xl">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-[11px] tracking-[0.4em] text-white/20 uppercase mb-10">Get started now</p>
          <h2 className="text-7xl md:text-9xl font-black tracking-tight leading-[0.88] mb-16">
            Get<br /><span style={{ color: GOLD }}>sorted.</span>
          </h2>
          <div className="flex flex-wrap gap-5">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 font-black text-xs tracking-widest uppercase hover:bg-white/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Open WhatsApp
            </a>
            <Link
              href="/signup"
              className="inline-flex items-center gap-4 border border-white/20 text-white px-12 py-5 font-black text-xs tracking-widest uppercase hover:border-white/50 transition-colors"
            >
              Create account
            </Link>
          </div>
          <p className="font-mono text-[10px] tracking-widest text-white/15 uppercase mt-10">
            Free templates. No credit card. No waiting.
          </p>
        </div>
      </section>

    </div>
  );
}
