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
  const carouselRef = useRef<HTMLDivElement>(null);

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
      
      <FounderHero />

      {/* BRANCHES SECTION */}
      <section id="branches" className="relative py-24 border-t border-white/5 overflow-hidden">
        <div className="px-4 sm:px-6 md:px-16 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-xl text-left">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0] mb-6">
                <span className="text-white block">Every part of your life.</span>
                <span className="text-[#ffd107] block mt-1">Simplified into 7 branches.</span>
              </h2>
              <p className="text-white/40 text-sm md:text-base font-medium max-w-md leading-relaxed" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}>
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
                    className="text-xl font-black mb-3 tracking-tight transition-colors group-hover:brightness-110 uppercase"
                    style={{ color: branch.color }}
                  >
                    {branch.name}
                  </h3>
                  <p className="text-white/40 text-[11px] leading-relaxed group-hover:text-white/60 transition-colors line-clamp-4">
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
    </main>
  );
}
