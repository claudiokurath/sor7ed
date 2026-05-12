"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const taglines = [
  { word: 'Overwhelmed', color: '#6366F1' },
  { word: 'Scattered', color: '#A855F7' },
  { word: 'Exhausted', color: '#FB7185' },
  { word: 'Wired differently', color: '#06B6D4' },
];


export default function HomeClient({ tools, user }: { tools: any[], user: any }) {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen bg-[#0a0a0a] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-16 snap-start">
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
          />
        </div>

        <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-6 md:px-16">
          <span className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium">SOR7ED</span>
          <div className="flex gap-8">
            {user ? (
              <Link href="/dashboard" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
                  Sign Up →
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-xs tracking-[0.35em] uppercase text-white/30 mb-6 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practical protocols via WhatsApp
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[1.0] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            If you're feeling
          </motion.h1>

          <div className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.0] h-[1.2em] overflow-hidden tracking-tight">
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
            className="text-white/40 text-lg md:text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            SOR7ED delivers practical protocols and tools for neurodivergent adults via WhatsApp — organised into 7 branches of life.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href="#branches"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-300 hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Explore Your Branches
            </a>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white/60 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
            >
              Sign up for free protocols
            </Link>
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

      {/* START HERE ONBOARDING - Add after hero, before branches */}
      <section className="px-6 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 font-medium">
                Feeling overwhelmed? Start here
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Not sure which branch you need? Take the 2-minute triage.
              </h2>
              <p className="text-white/50 leading-relaxed">
                Answer a few questions and we'll point you to the exact assessment and protocol for your situation. No account needed to try.
              </p>
            </div>
            <Link
              href="/tools/friction-finder"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm bg-white text-black hover:scale-105 transition-all duration-300 whitespace-nowrap"
              style={{ boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}
            >
              Start Triage Assessment →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BRANCHES SECTION */}
      <section id="branches" className="h-screen w-full flex flex-col justify-center snap-start">
        <div className="px-6 md:px-16 mb-10">
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

        {/* Enhanced Carousel with Perfect Glowing Borders */}
        <div 
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-12 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
          
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ scrollSnapAlign: 'start' }}
              className="shrink-0 p-1" // Padding for glow effect
            >
              <Link 
                href={`/${branch.slug}`}
                className="relative flex flex-col justify-between h-[380px] w-[300px] p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
                style={{
                  // Glowing border on hover
                  '--glow-color': branch.color
                } as any}
              >
                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    border: `1.5px solid ${branch.color}`,
                    boxShadow: `
                      0 0 20px ${branch.color}40,
                      inset 0 0 20px ${branch.color}10,
                      0 0 40px ${branch.color}20
                    `,
                    background: `radial-gradient(circle at 70% 30%, ${branch.color}08, transparent 70%)`
                  }}
                />
                
                {/* Large number in top-left */}
                <div 
                  className="text-7xl font-black opacity-30 group-hover:opacity-50 transition-opacity duration-300 leading-none" 
                  style={{ color: branch.color }}
                >
                  {branch.num}
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto">
                  <h3 
                    className="text-2xl font-bold mb-3 tracking-tight transition-colors group-hover:brightness-110"
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
      </section>

      {/* TOOLS GALLERY SECTION */}
      <section className="h-screen w-full flex flex-col justify-center px-6 md:px-16 snap-start border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-white/20 mb-4 font-medium block">The Toolbox</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Featured Tools</h2>
          </div>
          <Link href="/tools" className="text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
            View all tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.slice(0, 3).map((tool, i) => {
            const color = tool.color || '#3B82F6';
            return (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group relative bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 hover:border-transparent transition-all duration-500 h-full flex flex-col overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ 
                      border: `1.5px solid ${color}`,
                      boxShadow: `
                        0 0 20px ${color}40,
                        inset 0 0 20px ${color}10,
                        0 0 40px ${color}20
                      `,
                      background: `radial-gradient(circle at 70% 30%, ${color}08, transparent 70%)`
                    }}
                  />

                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <span 
                        className="text-[10px] px-3 py-1 rounded-full tracking-[0.2em] uppercase font-bold border"
                        style={{ 
                            backgroundColor: `${color}20`, 
                            color: color,
                            borderColor: `${color}40`
                        }}
                      >
                        {tool.branch}
                      </span>
                   </div>
                   <h3 className="text-xl font-black text-white mb-3 group-hover:text-white/80 transition-colors relative z-10 tracking-tight">{tool.name}</h3>
                   <p className="text-white/40 text-sm leading-relaxed mb-8 relative z-10 line-clamp-2">{tool.short_description || tool.tldr || tool.description}</p>
                   
                   <div className="mt-auto relative z-10">
                      <div className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 font-mono">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Text this →</span>
                          <div className="flex items-center gap-2">
                              <span className="text-sm">⚡</span>
                              <span className="font-bold tracking-widest text-sm" style={{ color: tool.color || '#ffffff' }}>
                                {tool.keyword}
                              </span>
                          </div>
                      </div>
                   </div>
                </Link>
              </motion.div>
            );
          })}
          {tools.length === 0 && (
            <div className="col-span-3 py-20 text-center border border-dashed border-white/5 rounded-3xl">
                <p className="text-white/20 italic">No tools synced yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="h-screen w-full flex flex-col justify-center px-6 md:px-16 snap-start border-t border-white/5">
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
            The world wasn't built for your brain. We build systems that are.
          </motion.h2>
          <motion.p
            className="text-white/40 text-lg max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            ADHD, neurodivergence, and a busy mind aren't flaws to be fixed. They're operating systems that need the right software. SOR7ED is that software, delivered one protocol at a time.
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
