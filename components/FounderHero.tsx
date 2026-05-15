// components/FounderHero.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SITE_COPY } from '@/lib/copy-matrix';

export function FounderHero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center px-6 py-16 overflow-hidden bg-black">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-gradient-to-br from-white/10 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Founder badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">
              Built by someone in the mess, not above it
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-[1.1] tracking-tight">
            <span className="text-white block">{SITE_COPY.hero.title}</span>
            <span className="text-[#ffd107] block mt-1">SOR7ED is software for the brain.</span>
          </h1>

          <p className="text-white/40 text-base md:text-lg mb-8 max-w-2xl leading-relaxed" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}>
            {SITE_COPY.hero.tagline}
          </p>

          {/* Founder story callout */}
          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 mb-8 max-w-3xl">
            <p className="text-white/60 text-sm md:text-base leading-relaxed italic" style={{ fontFamily: '"Arial Narrow", Arial, sans-serif' }}>
              "{SITE_COPY.hero.founderNote}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/tools"
              className="px-8 py-4 rounded-xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition-all active:scale-[0.98] text-center"
            >
              {SITE_COPY.hero.cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
