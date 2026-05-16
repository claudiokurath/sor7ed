"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { branches } from '@/lib/constants';

const taglines = [
  { word: 'Overwhelmed',     color: '#6366F1' },
  { word: 'Scattered',       color: '#A855F7' },
  { word: 'Exhausted',       color: '#FB7185' },
  { word: 'Wired differently', color: '#06B6D4' },
];

export default function HomeClient() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(i => (i + 1) % taglines.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-y-scroll overflow-x-hidden scroll-smooth">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-16 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: 'radial-gradient(circle, #2E5BFF 0%, transparent 70%)' }}
          />
        </div>

        <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4 sm:px-6 md:px-16">
          <span className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium">SOR7ED</span>
          <Link href="/signin" className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors font-medium">
            Sign In →
          </Link>
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.p
            className="text-sm sm:text-xs tracking-[0.35em] uppercase text-white/30 mb-6 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Diagnose here. Solutions on WhatsApp.
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[1.0] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            If you&apos;re feeling
          </motion.h1>

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
            SOR7ED helps neurodivergent adults identify their exact friction points through interactive assessments, then delivers step-by-step protocols to fix them via WhatsApp.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              href="/tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full font-semibold text-white text-base transition-all duration-300 hover:scale-105"
              style={{ background: '#2E5BFF' }}
            >
              Take an Assessment
            </Link>
            <a
              href="#branches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full font-semibold text-white/60 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
            >
              Explore the 7 Branches
            </a>
          </motion.div>
        </div>
      </section>

      {/* BRANCHES SECTION */}
      <section id="branches" className="px-4 sm:px-6 md:px-16 py-16">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px flex-1 bg-white/5 max-w-[100px]" />
          <span className="text-white/20 text-xs tracking-[0.3em] uppercase font-medium">
            7 Branches of Life
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Every part of your life,<br />simplified.
        </motion.h2>

        <motion.p
          className="text-white/30 text-base max-w-lg leading-relaxed mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Complete a quick assessment to diagnose your specific blocks. Get personalized analysis instantly, then receive the unblocking protocol on WhatsApp.
        </motion.p>

        <div
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 w-full [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {branches.map((branch, i) => (
            <motion.div
              key={branch.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="shrink-0"
            >
              <Link
                href="/tools"
                className="relative flex flex-col justify-between h-[50vh] min-h-[360px] max-h-[420px] w-[85vw] sm:w-[320px] p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 overflow-hidden group"
              >
                {/* Glow border + inner glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `1.5px solid ${branch.color}`,
                    boxShadow: `0 0 20px ${branch.color}40, inset 0 0 20px ${branch.color}10`,
                    background: `radial-gradient(circle at 70% 30%, ${branch.color}08, transparent 70%)`,
                  }}
                />

                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                  style={{ backgroundColor: branch.color, transform: 'translate(25%, -25%)' }}
                />

                <div
                  className="text-6xl sm:text-7xl md:text-8xl font-black opacity-30 group-hover:opacity-50 transition-opacity duration-300 leading-none"
                  style={{ color: branch.color }}
                >
                  {branch.num}
                </div>

                <div className="relative z-10 mt-auto">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-3 tracking-tight group-hover:brightness-110 transition-all"
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

      {/* MISSION SECTION */}
      <section className="px-4 sm:px-6 md:px-16 py-24 border-t border-white/5">
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
            ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software. SOR7ED diagnoses your blocks on the web and delivers the solutions to your phone.
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
              Create your free account →
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
