"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getBranchColor } from '@/lib/branch-config';

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

export default function ToolStrip({ tools, title = "Tactical Tools", subtitle }: { tools: Tool[], title?: string, subtitle?: string }) {
  const toolsRef = useRef<HTMLDivElement>(null);

  const scrollTools = (direction: 'left' | 'right') => {
    if (toolsRef.current) {
      toolsRef.current.scrollBy({
        left: direction === 'left' ? -360 : 360,
        behavior: 'smooth'
      });
    }
  };

  if (tools.length === 0) return null;

  return (
    <section className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-16 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end max-w-7xl mx-auto gap-8">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.0] mb-6">
              <span className="text-white block">{title}</span>
              {subtitle && (
                <span className="text-[#ffd107] block mt-2">
                  {subtitle}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
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
      </div>

      <div
        ref={toolsRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tools.map((tool, i) => {
          const color = tool.color && tool.color !== '#ffffff' ? tool.color : getBranchColor(tool.branch);
          return (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex flex-col w-[75vw] sm:w-[280px] h-[480px] bg-[#0f0f0f] border border-white/5 rounded-2xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    border: `1.5px solid ${color}40`,
                    boxShadow: `0 0 40px ${color}18`,
                    background: `radial-gradient(ellipse at 60% 0%, ${color}08, transparent 70%)`
                  }}
                />

                <div className="w-full h-44 shrink-0 overflow-hidden rounded-t-2xl">
                  {tool.cover_image ? (
                    <img
                      src={tool.cover_image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${color}20 0%, #0a0a0a 100%)` }}
                    >
                      <span className="text-6xl font-black opacity-10 tracking-tight" style={{ color }}>
                        {tool.branch?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full tracking-widest uppercase font-black border"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                        borderColor: `${color}30`
                      }}
                    >
                      {tool.branch}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">
                      Tactical Tool
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-white/80 transition-colors tracking-tight leading-tight line-clamp-2">
                    {tool.name}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-4 flex-1">
                    {tool.short_description || tool.tldr || tool.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
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
  );
}
