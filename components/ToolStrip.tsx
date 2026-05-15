"use client";

import { useRef, useState } from 'react';
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

function ToolImage({ src, color, branch }: { src: string, color: string, branch: string }) {
  const [error, setError] = useState(false);
  
  if (src && !error) {
    return (
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}20 0%, #0a0a0a 100%)` }}
    >
      <span className="text-5xl font-black opacity-10 tracking-tight" style={{ color }}>
        {branch?.charAt(0)}
      </span>
    </div>
  );
}

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
    <section className="relative py-16 border-t border-white/5 overflow-hidden">
      <div className="px-4 sm:px-6 md:px-16 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-xl text-left">
            <h2 className="text-2xl md:text-4xl font-anton tracking-wider leading-[1.1] mb-4 uppercase">
              <span className="text-white block">{title}</span>
              {subtitle && (
                <span className="text-[#ffd107] block mt-1">
                  {subtitle}
                </span>
              )}
            </h2>
            <p className="text-white/40 text-sm md:text-base font-roboto font-thin max-w-md leading-relaxed">
              Answer a few questions. Get your exact situation mapped. No account needed.
            </p>
          </div>
          
          <div className="flex items-center gap-6 shrink-0 mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTools('left')}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                onClick={() => scrollTools('right')}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
            <Link
              href="/tools"
              className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-black border-b border-white/10 hover:border-white pb-0.5"
            >
              View all →
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={toolsRef}
        className="flex gap-4 sm:gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 md:px-16 pb-12 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tools.map((tool, i) => {
          const color = tool.color && tool.color !== '#ffffff' ? tool.color : getBranchColor(tool.branch);
          return (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex flex-col w-[75vw] sm:w-[260px] h-[460px] bg-[#0f0f0f] border border-white/5 rounded-xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
              >
                {/* Cover image */}
                <div className="w-full h-40 shrink-0 overflow-hidden bg-[#0a0a0a]">
                  <ToolImage src={tool.cover_image} color={color} branch={tool.branch} />
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
                      {tool.branch}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">
                      TACTICAL TOOL
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-white/80 transition-colors tracking-tight leading-tight uppercase line-clamp-3">
                    {tool.name}
                  </h3>
                  <p className="text-white/30 text-[11px] font-roboto font-thin leading-relaxed line-clamp-4 flex-1">
                    {tool.short_description || tool.tldr || tool.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
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
