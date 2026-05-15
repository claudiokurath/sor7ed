'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ROTATING_WORDS = [
  { text: 'Overwhelmed', color: '#E94560' },
  { text: 'Exhausted', color: '#FF6B6B' },
  { text: 'Wired differently', color: '#4ECDC4' },
  { text: 'Scattered', color: '#A855F7' },
  { text: 'Behind', color: '#F4A261' },
  { text: 'Stuck', color: '#E9C46A' },
];

const STATS = {
  templateDownloads: 12847,
  toolCompletions: 3892,
  averageRating: 4.8,
  branches: 7
};

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

const BRANCHES = ['Cognitive', 'Temporal', 'Emotional', 'Financial', 'Social', 'Physical', 'Environmental'];

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

function RotatingHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_WORDS[currentIndex];

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: current.color }}
      />

      <div className="max-w-6xl mx-auto px-4 w-full relative z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40 mb-8 block">
          Practical protocols via WhatsApp
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
          <span className="block">If you&apos;re feeling</span>
          <span
            className="block transition-all duration-500 ease-out"
            style={{
              color: current.color,
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
              filter: isAnimating ? 'blur(4px)' : 'blur(0)',
            }}
          >
            {current.text}
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-md mb-10 leading-relaxed">
          SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href="/branches"
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full font-semibold transition inline-flex items-center gap-2"
          >
            Explore Your Branches
          </Link>
          <Link
            href="/signup"
            className="border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-full font-semibold transition"
          >
            Sign up for free protocols
          </Link>
        </div>

        <p className="text-sm text-white/30">
          Text <span className="text-white/50 font-mono">SOR7ED</span> to{' '}
          <a href={WHATSAPP_LINK} className="text-white/50 hover:text-white underline">
            {WHATSAPP_NUMBER}
          </a>
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <RotatingHero />

      {/* STATS BAR */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-20 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: ROTATING_WORDS[0].color }}>
              {STATS.templateDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-white/40 mt-1">Templates sent</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: ROTATING_WORDS[2].color }}>
              {STATS.branches}
            </div>
            <div className="text-sm text-white/40 mt-1">Life branches</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: ROTATING_WORDS[3].color }}>
              {STATS.averageRating}/5
            </div>
            <div className="text-sm text-white/40 mt-1">Average rating</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold" style={{ color: ROTATING_WORDS[1].color }}>
              {STATS.toolCompletions.toLocaleString()}
            </div>
            <div className="text-sm text-white/40 mt-1">Tools completed</div>
          </div>
        </div>
      </section>

      {/* 7 BRANCHES */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every part of your life, simplified
          </h2>
          <p className="text-white/40 mb-16">7 branches. 50+ protocols. One WhatsApp.</p>

          <div className="flex flex-wrap justify-center gap-3">
            {BRANCHES.map((branch) => (
              <span
                key={branch}
                className="border border-white/10 rounded-full px-6 py-3 text-sm text-white/70 hover:border-white/30 hover:text-white transition cursor-default"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FREE TEMPLATES */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/5 text-white/50 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Free Forever
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Templates</h2>
            <p className="text-white/40">Instant. No account. Straight to your WhatsApp.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <a
                key={template.id}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-white/[0.02] transition"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs uppercase tracking-wider text-white/30">Template</span>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">Free</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition">{template.name}</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">{template.desc}</p>
                <span className="text-xs text-white/20">{template.format}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM TOOLS */}
      <section id="tools" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/5 text-white/50 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Premium
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Tools</h2>
            <p className="text-white/40">Interactive assessments. Personalized protocols. Account required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.id}
                className="border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-white/[0.02] transition relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 text-lg font-bold text-white/80">
                  {tool.price}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs uppercase tracking-wider text-white/30">Tool</span>
                  <span className="text-xs text-white/30">⏱ {tool.time}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{tool.name}</h3>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">{tool.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/20">{tool.completions.toLocaleString()} completed</span>
                  <Link
                    href="/signup?redirect=/tools"
                    className="text-sm font-medium hover:text-white transition"
                    style={{ color: ROTATING_WORDS[i % ROTATING_WORDS.length].color }}
                  >
                    Create account →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Want all tools?</h3>
                <p className="text-white/40 text-sm">Monthly subscription coming soon. Get early access.</p>
              </div>
              <Link
                href="/waitlist"
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition whitespace-nowrap"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Get free templates",
                desc: `Text SOR7ED to ${WHATSAPP_NUMBER}. Instant templates, no account, no catch.`
              },
              {
                step: "02",
                title: "Hit a wall?",
                desc: "When templates aren't enough, our interactive tools diagnose your specific friction points."
              },
              {
                step: "03",
                title: "Create account",
                desc: "One account unlocks all tools, saves your results, and builds your personal protocol library."
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-white/10 mb-6">{item.step}</div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-white/90 mb-8 leading-relaxed">
            &ldquo;I started with the free templates. Two weeks later I bought the Tax Calculator and finally understood where my money was going.&rdquo;
          </blockquote>
          <footer className="text-white/40">
            <span className="text-white font-medium">James R.</span>
            <span className="mx-2">·</span>
            <span>ADHD, software developer</span>
          </footer>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Simple pricing</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-emerald-500/30 rounded-2xl p-8 bg-emerald-500/5">
              <div className="text-sm text-emerald-400 uppercase tracking-wider mb-3">Free Forever</div>
              <h3 className="text-2xl font-bold mb-6">Templates</h3>
              <ul className="text-left text-white/60 text-sm space-y-4 mb-8">
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Instant WhatsApp delivery</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> No account required</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> New templates weekly</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Community access</li>
              </ul>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-emerald-500 text-black py-4 rounded-full font-semibold hover:bg-emerald-400 transition text-center"
              >
                Get Templates
              </a>
            </div>

            <div className="border border-white/10 rounded-2xl p-8">
              <div className="text-sm text-white/50 uppercase tracking-wider mb-3">Premium</div>
              <h3 className="text-2xl font-bold mb-6">Tools</h3>
              <ul className="text-left text-white/60 text-sm space-y-4 mb-8">
                <li className="flex items-center gap-3"><span className="text-white/30">✓</span> Interactive assessments</li>
                <li className="flex items-center gap-3"><span className="text-white/30">✓</span> Personalized protocols</li>
                <li className="flex items-center gap-3"><span className="text-white/30">✓</span> Save results & track progress</li>
                <li className="flex items-center gap-3"><span className="text-white/30">✓</span> Priority WhatsApp support</li>
              </ul>
              <div className="text-center text-white/40 text-sm mb-4">From £7 per tool</div>
              <Link
                href="/signup"
                className="block w-full border border-white/20 text-white py-4 rounded-full font-semibold hover:bg-white/5 transition text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Frequent questions</h2>

          <div className="space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-white/10 pb-8">
                <h3 className="font-semibold mb-3 text-lg">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get sorted today</h2>
          <p className="text-white/40 mb-10">
            Free templates on WhatsApp. No credit card. No waiting.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#128C7E] transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message {WHATSAPP_NUMBER}
          </a>

          <p className="text-xs text-white/20 mt-6">
            Or text <span className="text-white/40 font-mono">SOR7ED</span> to the number above
          </p>
        </div>
      </section>

    </div>
  );
}
