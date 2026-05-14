"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { branches } from "@/lib/constants";

type Post = {
  id: string;
  slug: string;
  title: string;
  branch: string;
  keyword: string;
  tldr: string;
  excerpt: string;
  summary: string;
  description: string;
  read_time: string;
  level: string;
};

export default function IntelligenceGrid({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const presentBranches = [...new Set(posts.map(p => p.branch).filter(Boolean))];

  const filtered = posts.filter(post => {
    const matchesBranch = !activeBranch || post.branch === activeBranch;
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.branch?.toLowerCase().includes(search.toLowerCase()) ||
      post.keyword?.toLowerCase().includes(search.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-5">

      {/* FILTERS */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search briefings..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Branch pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveBranch(null)}
            className={`shrink-0 text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-widest border transition-all ${
              !activeBranch
                ? 'bg-white text-black border-white'
                : 'text-white/30 border-white/10 hover:border-white/30 hover:text-white/60'
            }`}
          >
            All
          </button>
          {presentBranches.map(branch => {
            const b = branches.find(x => x.name === branch);
            const isActive = activeBranch === branch;
            return (
              <button
                key={branch}
                onClick={() => setActiveBranch(isActive ? null : branch)}
                className="shrink-0 text-[9px] px-4 py-2 rounded-full font-black uppercase tracking-widest border transition-all"
                style={{
                  backgroundColor: isActive ? `${b?.color ?? '#fff'}22` : 'transparent',
                  color: isActive ? (b?.color ?? '#fff') : 'rgba(255,255,255,0.3)',
                  borderColor: isActive ? `${b?.color ?? '#fff'}60` : 'rgba(255,255,255,0.1)',
                }}
              >
                {branch}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID — 1 col mobile, 2 col md+ */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">No briefings match.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((post, i) => {
            const b = branches.find(x => x.name === post.branch);
            const color = b?.color ?? '#3B82F6';
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="h-full"
              >
                <Link
                  href={`/intelligence/${post.slug}`}
                  className="group flex flex-col h-full bg-[#0f0f0f] border border-white/5 rounded-[1.5rem] p-6 hover:border-transparent transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      border: `1.5px solid ${color}45`,
                      boxShadow: `0 0 30px ${color}12`,
                      background: `radial-gradient(ellipse at 80% 20%, ${color}08, transparent 65%)`,
                    }}
                  />

                  {/* Branch + read time */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span
                      className="text-[9px] px-3 py-1.5 rounded-full tracking-[0.2em] uppercase font-black border"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                        borderColor: `${color}35`,
                      }}
                    >
                      {post.branch}
                    </span>
                    {post.read_time && (
                      <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        {post.read_time}
                      </span>
                    )}
                  </div>

                  {/* Title + excerpt */}
                  <div className="flex-1 relative z-10">
                    <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug mb-2 group-hover:text-white/80 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/30 text-sm leading-relaxed line-clamp-2">
                      {post.summary || post.tldr || post.excerpt || post.description}
                    </p>
                  </div>

                  {/* Keyword + arrow */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06] relative z-10">
                    <div className="bg-black/50 border border-white/10 rounded-lg px-3.5 py-2 font-mono flex items-center gap-1.5">
                      <span className="text-sm">⚡</span>
                      <span className="font-black tracking-widest text-[11px] uppercase" style={{ color }}>
                        {post.keyword}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/15 group-hover:text-white/40 transition-colors">
                      Read →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
