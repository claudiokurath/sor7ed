"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type IntelligenceBriefing = {
  slug: string;
  title: string;
  branch: string;
  color?: string;
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
    <section className="relative py-20 border-t border-white/5 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-16 mb-10">
        <div className="flex justify-between items-end max-w-7xl mx-auto">
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-white/20 mb-3 font-black block">Field Intelligence</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter">Intelligence Briefings</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex w-11 h-11 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <Link href="/intelligence" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-black border-b border-white/10 hover:border-white pb-0.5">
              View all →
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article, i) => {
          const color = article.color || '#3B82F6';
          return (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                href={`/intelligence/${article.slug}`}
                className="group flex flex-col w-[80vw] sm:w-[340px] bg-[#0f0f0f] border border-white/5 rounded-3xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    border: `1.5px solid ${color}40`,
                    boxShadow: `0 0 40px ${color}18`,
                    background: `radial-gradient(ellipse at 60% 0%, ${color}08, transparent 70%)`,
                  }}
                />

                {/* Cover image */}
                <div className="w-full h-52 shrink-0 overflow-hidden rounded-t-3xl">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${color}28 0%, #0a0a0a 100%)` }}
                    >
                      <span className="text-7xl font-black opacity-10 tracking-tight" style={{ color }}>
                        {article.branch?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 sm:p-7 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className="text-xs px-3 py-1.5 rounded-full tracking-widest uppercase font-bold border"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                        borderColor: `${color}30`,
                      }}
                    >
                      {article.branch}
                    </span>
                    <span className="text-xs text-white/25 font-bold uppercase tracking-widest shrink-0 ml-3">
                      {article.read_time || '5 min'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-white/80 transition-colors tracking-tight leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-3 flex-1">
                    {article.summary || article.tldr || article.excerpt}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-end">
                    <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
                      Read →
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
