"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Branch } from '@/lib/getBranches';
import type { User } from '@supabase/supabase-js';
import IntelligenceStrip from '@/components/IntelligenceStrip';

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

export default function HomeClient({ tools, user, articles, branches }: { tools: Tool[], user: User | null, articles: IntelligenceBriefing[], branches: Branch[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -360 : 360,
        behavior: 'smooth'
      });
    }
  };

  const scrollTools = (direction: 'left' | 'right') => {
    if (toolsRef.current) {
      toolsRef.current.scrollBy({
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

        <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16">
          <Link href="/"><Image src="/Images/Logo2026.png" alt="SOR7ED" width={216} height={84} className="h-20 w-auto opacity-25 hover:opacity-50 transition-opacity" /></Link>
          <div className="flex gap-4 sm:gap-8 items-center">
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
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.0] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Practical protocols<br />
            <span className="text-white/40">for neurodivergent minds.</span>
          </motion.h1>

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
      <section id="branches" className="relative min-h-[90vh] sm:h-screen w-full flex flex-col justify-center sm:snap-start px-4 sm:px-6 md:px-16 pt-10 pb-6">
          <div className="mb-10">
            <motion.div
                className="flex items-center gap-4 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium">
                7 Branches of Life
                </span>
                <div className="h-px flex-1 bg-white/5" />
            </motion.div>

            <motion.h2
                className="text-3xl md:text-5xl font-bold text-white mt-6 mb-2 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Every part of your life,<br />simplified.
            </motion.h2>

            <motion.p
                className="text-white/30 text-base max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                Each branch contains practical protocols — 2-minute micro-actions designed for busy, distracted, and neurodivergent minds.
            </motion.p>
          </div>

        {/* Enhanced carousel with navigation for PC */}
        <div className="relative group">
          <div 
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 w-full no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            
            {branches.map((branch, i) => (
              <motion.div
                key={branch.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ scrollSnapAlign: 'start' }}
                className="shrink-0"
              >
                <Link 
                  href={`/${branch.slug}`}
                  className="relative flex flex-col justify-between h-[50vh] min-h-[360px] max-h-[420px] w-[85vw] sm:w-[320px] p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
                >
                  {/* Card glow effect */}
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" 
                    style={{ backgroundColor: branch.color, transform: 'translate(25%, -25%)' }}
                  />
                  
                  {/* Large number in top-left */}
                  <div 
                    className="text-6xl sm:text-7xl md:text-8xl font-black opacity-30 group-hover:opacity-50 transition-opacity duration-300 leading-none" 
                    style={{ color: branch.color }}
                  >
                    {branch.num}
                  </div>

                  {/* Bottom content */}
                  <div className="relative z-10 mt-auto">
                    <h3 
                      className="text-xl sm:text-2xl font-bold mb-3 tracking-tight transition-colors group-hover:brightness-110"
                      style={{ color: branch.color }}
                    >
                      {branch.name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                      {branch.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows for Desktop */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100"
            aria-label="Previous branch"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <button 
            onClick={() => scrollCarousel('right')}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-20 backdrop-blur-md opacity-0 group-hover:opacity-100"
            aria-label="Next branch"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </section>

      {/* START HERE — triage, shown after branches so users know what they are */}
      <section className="px-4 sm:px-6 md:px-16 py-12 sm:py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 font-medium">
                Not sure where to start?
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Take the 2-minute triage — we&apos;ll find your highest-friction branch.
              </h2>
              <p className="text-white/50 leading-relaxed">
                Answer a few questions and we&apos;ll point you to the exact assessment and protocol for your situation. No account needed.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm bg-white text-black hover:scale-105 transition-all duration-300 whitespace-nowrap"
              style={{ boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}
            >
              Start Triage →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* INTELLIGENCE STRIP */}
      <IntelligenceStrip articles={articles} />

      {/* TOOLS GALLERY SECTION */}
      <section className="relative min-h-[90vh] sm:h-screen w-full flex flex-col justify-center sm:snap-start border-t border-white/5 overflow-hidden">
        <div className="flex justify-between items-end mb-10 px-4 sm:px-6 md:px-16">
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-white/20 mb-3 font-medium block">The Toolbox</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Featured Tools</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scrollTools('left')} className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="Previous tool">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollTools('right')} className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="Next tool">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <Link href="/tools" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold border-b border-white/10 hover:border-white pb-0.5">
              View all →
            </Link>
          </div>
        </div>

        <div
          ref={toolsRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-8 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tools.length === 0 ? (
            <div className="shrink-0 w-full py-20 text-center border border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 italic text-sm">No tools synced yet. Check back soon.</p>
            </div>
          ) : tools.map((tool, i) => {
            const color = tool.color || '#3B82F6';
            return (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group flex flex-col w-[80vw] sm:w-[340px] bg-[#0f0f0f] border border-white/5 rounded-3xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                      border: `1.5px solid ${color}45`,
                      boxShadow: `0 0 40px ${color}20`,
                      background: `radial-gradient(circle at 60% 0%, ${color}08, transparent 70%)`
                    }}
                  />

                  {/* Cover image */}
                  <div className="w-full h-52 shrink-0 overflow-hidden rounded-t-3xl">
                    {tool.cover_image ? (
                      <img
                        src={tool.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${color}28 0%, #0a0a0a 100%)` }}
                      >
                        <span className="text-7xl font-black opacity-10 tracking-tight" style={{ color }}>
                          {tool.branch?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 sm:p-7 relative z-10">
                    <span
                      className="text-xs px-3 py-1.5 rounded-full tracking-widest uppercase font-bold border mb-4 self-start"
                      style={{
                        backgroundColor: `${color}20`,
                        color,
                        borderColor: `${color}40`
                      }}
                    >
                      {tool.branch}
                    </span>
                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-white/80 transition-colors tracking-tight leading-tight">
                      {tool.name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2 flex-1">
                      {tool.short_description || tool.tldr || tool.description}
                    </p>
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-end">
                      <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
                        Start Assessment →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="relative min-h-[90vh] sm:h-screen w-full flex flex-col justify-center px-4 sm:px-6 md:px-16 sm:snap-start border-t border-white/5">
        <div className="max-w-4xl">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase text-white/20 mb-6 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The world wasn&apos;t built for your brain. We build systems that are.
          </motion.h2>
          <motion.p
            className="text-white/40 text-lg max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software. SOR7ED is that software, delivered one protocol at a time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-300 hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Start your journey →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
