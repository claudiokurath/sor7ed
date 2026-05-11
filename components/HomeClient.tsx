"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const taglines = [
  { word: 'Overwhelmed', color: '#6366F1' },
  { word: 'Scattered', color: '#A855F7' },
  { word: 'Exhausted', color: '#FB7185' },
  { word: 'Wired differently', color: '#06B6D4' },
];

const branches = [
  { num: "01", color: "#3B82F6", name: "Keep Going", slug: "keep-going", description: "Career momentum, learning, skill-building, progress" },
  { num: "02", color: "#A855F7", name: "Feel Good", slug: "feel-good", description: "Health, nervous system, energy, meds, food, sleep, sensory" },
  { num: "03", color: "#10B981", name: "Spend Smart", slug: "spend-smart", description: "Money admin, bills, budgeting, impulse spending" },
  { num: "04", color: "#F59E0B", name: "Be Connected", slug: "be-connected", description: "Relationships, communication, boundaries, social scripts" },
  { num: "05", color: "#06B6D4", name: "Plan Ahead", slug: "plan-ahead", description: "Planning, executive function, and the systems that support it" },
  { num: "06", color: "#FB7185", name: "Be Yourself", slug: "be-yourself", description: "Unmasking, identity, shame, self-concept, emotional regulation" },
  { num: "07", color: "#6366F1", name: "Level Up", slug: "level-up", description: "Digital systems, automation, apps, setups" },
];

export default function HomeClient({ tools }: { tools: any[] }) {
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
          <Link href="/signup" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
            Sign Up →
          </Link>
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

        <div className="relative">
          <div 
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-12 w-full"
            style={{ 
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {branches.map((branch, i) => (
              <motion.div
                key={branch.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ scrollSnapAlign: 'start' }}
                className="shrink-0"
              >
                <Link 
                  href={`/${branch.slug}`}
                  className="relative flex flex-col justify-between h-[400px] w-[320px] p-8 rounded-[2rem] border border-white/5 bg-[#111111] hover:bg-[#161616] transition-all duration-300 overflow-hidden group hover:animate-pulse"
                  style={{ 
                    boxShadow: `0 0 40px ${branch.color}15`,
                    transition: 'box-shadow 2s ease-in-out, all 0.3s ease'
                  }}
                >
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20" 
                    style={{ backgroundColor: branch.color, transform: 'translate(25%, -25%)' }}
                  />
                  
                  <div 
                    className="text-8xl font-black opacity-20 transition-opacity duration-300 group-hover:opacity-40 leading-none" 
                    style={{ color: branch.color }}
                  >
                    {branch.num}
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h3 
                      className="text-2xl font-bold mb-3 tracking-tight transition-colors"
                      style={{ color: branch.color }}
                    >
                      {branch.name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">{branch.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
          {tools.slice(0, 3).map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <div className="group relative bg-[#111111] border border-white/5 rounded-3xl p-8 hover:bg-[#161616] transition-all duration-500 h-full flex flex-col overflow-hidden">
                 {/* Structured Thinking Decoration */}
                 <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                    <div 
                        className="w-full h-full rounded-2xl backdrop-blur-sm border border-white/10"
                        style={{ 
                            background: `linear-gradient(135deg, white, transparent)`,
                            transform: 'rotate(12deg) translate(20px, -20px)'
                        }}
                    />
                 </div>

                 <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/40 uppercase tracking-widest">
                      {tool.branch}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/80 transition-colors">{tool.name}</h3>
                 <p className="text-white/30 text-sm leading-relaxed mb-8">{tool.tldr || tool.description?.substring(0, 100) + '...'}</p>
                 
                 <div className="mt-auto">
                    <div className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 font-mono">
                        <span className="text-xs text-white/40 uppercase tracking-widest">Text this →</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⚡</span>
                            <span className="font-bold tracking-widest uppercase">{tool.keyword}</span>
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
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
