"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Branch } from '@/lib/getBranches';
import type { User } from '@supabase/supabase-js';
import IntelligenceStrip from '@/components/IntelligenceStrip';
import ToolStrip from '@/components/ToolStrip';
import { getBranchColor } from '@/lib/branch-config';
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
  { word: 'Scattered', color: '#A855F7' },
  { word: 'Exhausted', color: '#FB7185' },
  { word: 'Wired differently', color: '#06B6D4' },
];

export default function HomeClient({ tools, user, articles, branches }: { tools: Tool[], user: User | null, articles: IntelligenceBriefing[], branches: Branch[] }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -360 : 360,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="h-screen bg-black overflow-y-scroll overflow-x-hidden snap-y snap-mandatory">

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-16 snap-center">
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
          />
        </div>

        <div className="absolute top-8 left-0 right-0 flex items-center px-4 sm:px-6 md:px-16 z-50">
          {/* Logo Centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image 
                src="/Images/Logo2026.png" 
                alt="SOR7ED" 
                width={216} 
                height={84} 
                className="h-20 w-auto opacity-100" 
              />
            </Link>
          </div>

          <div className="flex-1" />

          <div className="flex gap-4 sm:gap-8 items-center relative z-10">
            {user ? (
              <Link href="/dashboard" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup?mode=login" className="hidden sm:block text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="px-5 py-2.5 bg-white text-black text-xs tracking-widest uppercase font-black rounded-full hover:scale-105 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl flex flex-col items-start text-left">
          <motion.p
            className="text-sm md:text-xs tracking-[0.35em] uppercase text-white/30 mb-8 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practical protocols via WhatsApp
          </motion.p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-anton tracking-wider leading-[1.1] mb-8 uppercase">
            <span className="text-white block mb-2">If you&apos;re feeling</span>
            <div className="h-[1.1em] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={taglineIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="block"
                  style={{ color: taglines[taglineIndex].color }}
                >
                  {taglines[taglineIndex].word}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-white block mt-4 text-xl sm:text-2xl md:text-3xl opacity-60">We build systems that work.</span>
          </h1>

          <motion.p
            className="text-white/40 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-10 font-roboto font-thin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software.
          </motion.p>

          {/* Buttons aligned left */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href="#branches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Explore Your Branches
            </a>
            {user ? (
              <Link
                href="/intelligence"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-bold text-white/60 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Browse Intelligence →
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-bold text-white/60 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Sign up for free protocols
              </Link>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        </motion.div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className="h-screen flex flex-col items-center justify-center px-6 bg-black border-t border-white/5 snap-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-1 w-16 bg-[#ffd107] mx-auto mb-12 opacity-50" />
          <blockquote className="text-2xl md:text-4xl font-anton tracking-wider leading-tight text-white mb-10 uppercase">
            "I didn&apos;t build SOR7ED because I love productivity. I built it because I got tired of paying the ADHD tax."
          </blockquote>
          <cite className="text-white/40 not-italic uppercase tracking-[0.2em] text-xs font-anton tracking-wider block">
            Founder, SOR7ED
          </cite>
          <p className="text-white/30 text-sm font-roboto font-thin mt-4 max-w-lg mx-auto leading-relaxed">
            Forgot subscriptions. Ghosted people I love. Let &apos;future me&apos; drown in decisions made at 2am.
            Turns out a lot of us have the same chaos. So I sorted it into 7 categories and built tools for all of them.
          </p>
          <div className="mt-10">
            <a href="#branches" className="text-[#ffd107] text-xs font-anton tracking-wider uppercase hover:opacity-70 transition-opacity">
              See the 7 branches ↓
            </a>
          </div>
        </div>
      </section>

      {/* BRANCHES SECTION */}
      <section id="branches" className="relative h-screen flex flex-col border-t border-white/5 overflow-hidden snap-center">
        <div className="px-4 sm:px-6 md:px-16 pt-24 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="max-w-xl text-left">
              <h2 className="text-2xl md:text-4xl font-anton tracking-wider leading-[1.1] mb-4 uppercase">
                <span className="text-white block">Every part of your life.</span>
                <span className="text-[#ffd107] block mt-1">Simplified into 7 branches.</span>
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {branches.map(branch => (
                  <span 
                    key={branch.slug} 
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/60 font-anton tracking-wider"
                  >
                    {branch.name}
                  </span>
                ))}
              </div>
              <p className="text-white/40 text-sm md:text-base font-roboto font-thin max-w-md leading-relaxed">
                Practical protocols and tactical tools designed for busy, distracted, and neurodivergent minds. Delivered one micro-action at a time.
              </p>
            </div>
            
            <div className="flex items-center gap-6 shrink-0 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-4 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-4 w-full no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ scrollSnapAlign: 'start' }}
              className="shrink-0"
            >
              <Link 
                href={`/${branch.slug}`}
                className="relative flex flex-col justify-between h-[380px] w-[75vw] sm:w-[240px] p-8 rounded-xl bg-black border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
              >
                <div 
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" 
                  style={{ backgroundColor: branch.color, transform: 'translate(25%, -25%)' }}
                />
                <div 
                  className="text-7xl md:text-9xl font-black opacity-20 group-hover:opacity-40 transition-opacity duration-300 leading-none" 
                  style={{ color: branch.color }}
                >
                  {branch.num}
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 
                    className="text-xl font-anton tracking-wider mb-3 transition-colors group-hover:brightness-110 uppercase"
                    style={{ color: branch.color }}
                  >
                    {branch.name}
                  </h3>
                  <p className="text-white/40 text-[11px] font-roboto font-thin leading-relaxed group-hover:text-white/60 transition-colors line-clamp-4">
                    {branch.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTELLIGENCE STRIP */}
      <div className="h-screen flex flex-col justify-center overflow-hidden snap-center border-t border-white/5">
        <IntelligenceStrip articles={articles} />
      </div>

      {/* TOOLS GALLERY SECTION */}
      <div className="h-screen flex flex-col justify-center overflow-hidden snap-center bg-black border-t border-white/5">
        <ToolStrip
          tools={tools}
          title="The Lab"
          subtitle="Featured diagnostics this week"
        />
        <div className="text-center py-8 px-6">
          <Link
            href="/tools"
            className="inline-block bg-[#ffd107] text-black text-lg font-anton tracking-wider px-10 py-5 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,209,7,0.15)] uppercase"
          >
            Start 2-Minute Triage →
          </Link>
          <p className="text-white/30 mt-4 text-sm font-roboto font-thin">
            No account needed. 7 questions. 2 minutes.
          </p>
        </div>
      </div>

      <div id="about" className="h-screen flex flex-col justify-center overflow-hidden snap-center border-t border-white/5">
        <FounderHero />
      </div>
    </main>
  );
}
