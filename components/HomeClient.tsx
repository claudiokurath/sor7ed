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
    <main className="min-h-screen bg-[#0a0a0a] overflow-y-scroll overflow-x-hidden scroll-smooth sm:snap-y sm:snap-mandatory">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] sm:h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-16 sm:snap-start">
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
          />
        </div>

        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Logo in the middle of hero content */}
          <div className="mb-16">
            <Link href="/">
              <Image 
                src="/Images/Logo2026.png" 
                alt="SOR7ED" 
                width={280} 
                height={108} 
                className="h-32 w-auto opacity-100" 
              />
            </Link>
          </div>

          <motion.p
            className="text-sm md:text-xs tracking-[0.35em] uppercase text-white/30 mb-8 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practical protocols via WhatsApp
          </motion.p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-anton tracking-wider leading-[1.1] mb-8 uppercase">
            <span className="text-white block mb-2">The world wasn&apos;t built for your brain.</span>
            <span className="text-[#ffd107] block">We build systems that are.</span>
          </h1>

          <motion.p
            className="text-white/40 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mx-auto mb-10 font-roboto font-thin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software.
          </motion.p>

          {/* Full-width buttons on mobile */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center"
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

      {/* BRANCHES SECTION */}
      <section id="branches" className="relative py-16 border-t border-white/5 overflow-hidden">
        <div className="px-4 sm:px-6 md:px-16 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl md:text-5xl font-anton tracking-wider leading-[1.1] mb-4 uppercase">
                <span className="text-white block">Every part of your life.</span>
                <span className="text-[#ffd107] block mt-1">Simplified into 7 branches.</span>
              </h2>
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
          className="flex gap-4 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 w-full no-scrollbar scroll-smooth"
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
                className="relative flex flex-col justify-between h-[460px] w-[75vw] sm:w-[260px] p-8 rounded-xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
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
      <IntelligenceStrip articles={articles} />

      {/* TOOLS GALLERY SECTION */}
      <ToolStrip 
        tools={tools} 
        title="Take the 2-minute triage — we'll find your highest-friction branch."
        subtitle="Answer a few questions to get the exact assessments and protocols for your situation. No account needed."
      />

      <div id="about" className="border-t border-white/5">
        <FounderHero />
      </div>
    </main>
  );
}
