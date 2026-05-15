// components/FounderHero.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SITE_COPY } from '@/lib/copy-matrix';

export function FounderHero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden bg-black">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-gradient-to-br from-white/10 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Founder badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-white/60 font-medium">
              Built by someone in the mess, not above it
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            {SITE_COPY.hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl leading-relaxed">
            {SITE_COPY.hero.tagline}
          </p>

          <p className="text-base text-white/50 mb-10 max-w-2xl leading-relaxed">
            {SITE_COPY.hero.subtext}
          </p>

          {/* Founder story callout */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-10 max-w-3xl">
            <p className="text-sm md:text-base text-white/60 leading-relaxed italic">
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
