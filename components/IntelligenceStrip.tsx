"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBranchColor } from '@/lib/branch-config';

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

export default function IntelligenceStrip({ articles }: { articles: IntelligenceBriefing[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  if (articles.length === 0) return null;

  return (
    <section className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-16 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-xl text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0] mb-6">
              <span className="text-white block">The world wasn&apos;t built for your brain.</span>
              <span className="text-[#ffd107] block mt-1">We build systems that are.</span>
            </h2>
            <p className="text-white/40 text-sm md:text-base font-medium max-w-md leading-relaxed">
              ADHD, neurodivergence, and a busy mind aren&apos;t flaws to be fixed. They&apos;re operating systems that need the right software.
            </p>
          </div>
          
          <div className="flex items-center gap-6 shrink-0 mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
            <Link
              href="/intelligence"
              className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/10 hover:border-white pb-0.5"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-4 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article, i) => {
          const color = article.color && article.color !== '#ffffff' ? article.color : getBranchColor(article.branch);
          return (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                href={`/intelligence/${article.slug}`}
                className="group flex flex-col w-[75vw] sm:w-[260px] h-[460px] bg-[#0f0f0f] border border-white/5 rounded-xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
              >
                {/* Cover image */}
                <div className="w-full h-40 shrink-0 overflow-hidden">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${color}20 0%, #0a0a0a 100%)` }}
                    >
                      <span className="text-5xl font-black opacity-10 tracking-tight" style={{ color }}>
                        {article.branch?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="text-[8px] px-2 py-0.5 rounded-full tracking-widest uppercase font-black border"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                        borderColor: `${color}30`,
                      }}
                    >
                      {article.branch}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">
                      {article.read_time || '5 MIN'} READ
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-white/80 transition-colors tracking-tight leading-tight uppercase line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="text-white/30 text-[11px] leading-relaxed line-clamp-4 flex-1">
                    {article.summary || article.tldr || article.excerpt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
                      Read Protocol →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
