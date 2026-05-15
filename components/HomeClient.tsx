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
    <main className="min-h-screen bg-[#0a0a0a] overflow-y-scroll overflow-x-hidden scroll-smooth sm:snap-y sm:snap-mandatory">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] sm:h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-16 sm:snap-start">
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
                className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity" 
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

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-sm md:text-xs tracking-[0.35em] uppercase text-white/30 mb-6 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practical protocols via WhatsApp
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[1.0] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            If you&apos;re feeling
          </motion.h1>

          {/* Rotating words */}
          <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.0] h-[1.2em] overflow-hidden tracking-tight">
            <AnimatePresence mode="wait">
              <motion.span
                key={taglineIndex}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ color: taglines[taglineIndex].color, display: 'block' }}
              >
                {taglines[taglineIndex].word}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-white/40 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
          </motion.p>

          {/* Full-width buttons on mobile */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href="#branches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full font-semibold text-white text-base transition-all duration-300 hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Explore Your Branches
            </a>
            {user ? (
              <Link
                href="/intelligence"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full font-semibold text-white/60 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Browse Intelligence →
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full font-semibold text-white/60 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Sign up for free protocols
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        </motion.div>
      </section>

      {/* BRANCHES SECTION */}
      <section id="branches" className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="px-4 sm:px-6 md:px-16 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end max-w-7xl mx-auto gap-8">
            <div className="max-w-4xl">
              <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.0] mb-6">
                <span className="text-white block">Every part of your life.</span>
                <span className="text-[#ffd107] block mt-2">Simplified into 7 branches.</span>
              </h2>
              <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                Practical protocols and tactical tools designed for busy, distracted, and neurodivergent minds. Delivered one micro-action at a time.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => scrollCarousel('left')} className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="Previous branch">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scrollCarousel('right')} className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="Next branch">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 w-full no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ scrollSnapAlign: 'start' }}
              className="shrink-0"
            >
              <Link 
                href={`/${branch.slug}`}
                className="relative flex flex-col justify-between h-[480px] w-[75vw] sm:w-[280px] p-8 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
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
                    className="text-2xl font-black mb-3 tracking-tight transition-colors group-hover:brightness-110"
                    style={{ color: branch.color }}
                  >
                    {branch.name}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors line-clamp-4">
                    {branch.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTELLIGENCE STRIP */}
      <IntelligenceStrip articles={articles} />

      {/* TOOLS GALLERY SECTION */}
      <ToolStrip 
        tools={tools} 
        title="Take the 2-minute triage — we'll find your highest-friction branch."
        subtitle="Answer a few questions to get the exact assessments and protocols for your situation. No account needed."
      />

      {/* MISSION SECTION */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="px-4 sm:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="max-w-4xl mb-20">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.0] mb-6">
              <span className="text-white block">SOR7ED is software for the brain.</span>
              <span className="text-[#ffd107] block mt-2">Delivered one protocol at a time.</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              We built this for the late-diagnosed, the hyper-focused, and the chronically overwhelmed. No apps, no logins, no friction. Just what works.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 hover:bg-white/[0.04] transition-all group">
              <span className="text-4xl mb-6 block">⚡</span>
              <h3 className="text-2xl font-black text-white mb-4">Tactical Speed</h3>
              <p className="text-white/40 text-sm leading-relaxed">No fluff. Protocols are designed to be read in 2 minutes and executed in 5. Speed is our priority.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 hover:bg-white/[0.04] transition-all group">
              <span className="text-4xl mb-6 block">📱</span>
              <h3 className="text-2xl font-black text-white mb-4">Zero Friction</h3>
              <p className="text-white/40 text-sm leading-relaxed">No new apps to manage. Everything lives in WhatsApp, where your life already happens.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 sm:p-10 hover:bg-white/[0.04] transition-all group">
              <span className="text-4xl mb-6 block">🛠️</span>
              <h3 className="text-2xl font-black text-white mb-4">Evidence Based</h3>
              <p className="text-white/40 text-sm leading-relaxed">Built on neuro-science and behavioral frameworks that actually work for ADHD brains.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
