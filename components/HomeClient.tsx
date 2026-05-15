"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Branch } from '@/lib/getBranches';
import type { User } from '@supabase/supabase-js';
import IntelligenceStrip from '@/components/IntelligenceStrip';
import ToolStrip from '@/components/ToolStrip';
import { FounderHero } from '@/components/FounderHero';

type Tool = {
  id: string;
  slug: string;
  name: string;
  branch: string;
  color: string;
  keyword: string;
  tldr: string;
  description: string;
  short_description: string;
  cover_image: string;
  featured: boolean;
};

type IntelligenceBriefing = {
  slug: string;
  title: string;
  branch: string;
  color: string;
  cover_image: string;
  summary: string;
  tldr?: string;
  excerpt?: string;
  read_time: string;
  level: string;
};

const taglines = [
  { word: 'Overwhelmed', color: '#6366F1' },
  { word: 'Scattered',   color: '#A855F7' },
  { word: 'Exhausted',   color: '#FB7185' },
  { word: 'Wired differently', color: '#06B6D4' },
];

export default function HomeClient({
  tools,
  user,
  articles,
  branches,
}: {
  tools: Tool[];
  user: User | null;
  articles: IntelligenceBriefing[];
  branches: Branch[];
}) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    carouselRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <main className="bg-black text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-32 pb-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase text-white/30 mb-8 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practical tools via WhatsApp
          </motion.p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-anton tracking-wider leading-[1.05] mb-8 uppercase">
            <span className="text-white block mb-2">If you&apos;re feeling</span>
            <div className="h-[1.05em] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={taglineIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="block"
                  style={{ color: taglines[taglineIndex].color }}
                >
                  {taglines[taglineIndex].word}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-white/50 block mt-4 text-2xl sm:text-3xl md:text-4xl font-roboto font-thin normal-case">
              we build systems that work.
            </span>
          </h1>

          <motion.p
            className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed mb-10 font-roboto font-thin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed.
            They&apos;re operating systems that need the right software.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#branches"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-sm transition-all hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Explore the 7 branches
            </a>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white/60 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all"
            >
              {user ? 'Go to dashboard →' : 'Sign up free →'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOUNDER QUOTE ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-px w-16 bg-[#ffd107] mx-auto mb-12 opacity-60" />
          <blockquote className="text-2xl md:text-4xl font-anton tracking-wider leading-tight text-white mb-8 uppercase">
            &ldquo;I didn&apos;t build SOR7ED because I love productivity.
            I built it because I got tired of paying the ADHD tax.&rdquo;
          </blockquote>
          <cite className="text-white/40 not-italic text-xs font-bold uppercase tracking-[0.3em] block mb-6">
            Founder, SOR7ED
          </cite>
          <p className="text-white/30 text-sm font-roboto font-thin leading-relaxed max-w-md mx-auto">
            Forgot subscriptions. Ghosted people I love. Let &lsquo;future me&rsquo; drown
            in decisions made at 2am. Turns out a lot of us have the same chaos.
            So I sorted it into 7 categories and built tools for all of them.
          </p>
        </div>
      </section>

      {/* ── 7 BRANCHES ── */}
      <section id="branches" className="py-20 border-t border-white/5">
        <div className="px-6 md:px-16 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-anton tracking-wider uppercase mb-3">
                <span className="text-white block">Every part of your life.</span>
                <span className="text-[#ffd107] block">Simplified into 7 branches.</span>
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {branches.map(branch => (
                  <span
                    key={branch.slug}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/50 font-bold"
                  >
                    {branch.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => scrollCarousel('left')} aria-label="Previous"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={() => scrollCarousel('right')} aria-label="Next"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto px-6 md:px-16 pb-6 no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0"
            >
              <Link
                href={`/${branch.slug}`}
                className="relative flex flex-col justify-between h-[340px] w-[72vw] sm:w-[240px] p-7 rounded-2xl bg-black border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: branch.color, transform: 'translate(25%,-25%)' }}
                />
                <div
                  className="text-6xl font-black opacity-15 leading-none"
                  style={{ color: branch.color }}
                >
                  {branch.num}
                </div>
                <div className="relative z-10">
                  <h3
                    className="text-lg font-anton tracking-wider mb-2 uppercase"
                    style={{ color: branch.color }}
                  >
                    {branch.name}
                  </h3>
                  <p className="text-white/40 text-xs font-roboto font-thin leading-relaxed line-clamp-3">
                    {branch.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE STRIP ── */}
      <div className="border-t border-white/5">
        <IntelligenceStrip articles={articles} />
      </div>

      {/* ── TOOLS ── */}
      <div className="border-t border-white/5">
        <ToolStrip tools={tools} title="The Lab" subtitle="Featured diagnostics this week" />
        <div className="text-center py-12 px-6">
          <Link
            href="/tools"
            className="inline-block bg-[#ffd107] text-black font-anton tracking-wider text-base px-10 py-4 rounded-full hover:scale-105 transition-all uppercase"
          >
            Start 2-Minute Triage →
          </Link>
          <p className="text-white/30 mt-4 text-sm font-roboto font-thin">
            No account needed. 7 questions. 2 minutes.
          </p>
        </div>
      </div>

      {/* ── ABOUT / FOUNDER ── */}
      <div id="about" className="border-t border-white/5">
        <FounderHero />
      </div>

    </main>
  );
}
