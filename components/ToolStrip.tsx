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
    <section className="relative py-20 border-t border-white/5 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-16 mb-10">
        <div className="flex justify-between items-end max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
              <span className="text-white block mb-2">{title}</span>
              {subtitle && (
                <span className="text-[#ffd107] block text-2xl md:text-3xl font-bold opacity-90 leading-relaxed">
                  {subtitle}
                </span>
              )}
            </h2>
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
      </div>

      <div
        ref={toolsRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tools.map((tool, i) => {
          const color = tool.color && tool.color !== '#ffffff' ? tool.color : getBranchColor(tool.branch);
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
                className="group flex flex-col w-[80vw] sm:w-[340px] h-[520px] bg-[#0f0f0f] border border-white/5 rounded-3xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    border: `1.5px solid ${color}45`,
                    boxShadow: `0 0 40px ${color}20`,
                    background: `radial-gradient(circle at 60% 0%, ${color}08, transparent 70%)`
                  }}
                />

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
  );
}
