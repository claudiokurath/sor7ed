"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

type IntelligenceBriefing = {
  slug: string;
  title: string;
  branch: string;
  color: string;
  summary: string;
  tldr?: string;
  excerpt?: string;
  read_time: string;
  level: string;
};

export default function IntelligenceStrip({ articles }: { articles: IntelligenceBriefing[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-white/20 mb-4 font-black block">Field Intelligence</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Intelligence Briefings</h2>
          </div>
          <Link href="/intelligence" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-black pb-1 border-b border-white/10 hover:border-white">
            Access Full Archive →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/intelligence/${article.slug}`}
                className="group block p-8 rounded-[2.5rem] bg-[#0f0f0f] border border-white/5 hover:border-transparent transition-all duration-500 relative overflow-hidden h-full flex flex-col"
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ 
                    border: `1.5px solid ${article.color || '#3B82F6'}`,
                    boxShadow: `0 0 40px ${article.color || '#3B82F6'}20`,
                    background: `radial-gradient(circle at 70% 30%, ${article.color || '#3B82F6'}08, transparent 70%)`
                  }}
                />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span 
                    className="text-[10px] px-3 py-1 rounded-full tracking-[0.2em] uppercase font-black border"
                    style={{ 
                      backgroundColor: `${article.color || '#3B82F6'}15`, 
                      color: article.color || '#3B82F6',
                      borderColor: `${article.color || '#3B82F6'}30`
                    }}
                  >
                    {article.branch}
                  </span>
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                    {article.read_time || '5 min'} read
                  </span>
                </div>

                <div className="relative z-10 mb-6">
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-white transition-colors tracking-tight leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-3 font-medium">
                    {article.summary || article.tldr || article.excerpt}
                  </p>
                </div>

                <div className="mt-auto relative z-10 flex items-center justify-between">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">
                     Read Briefing →
                   </div>
                   {article.level && (
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/10">
                       {article.level}
                     </span>
                   )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
