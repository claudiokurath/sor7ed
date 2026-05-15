"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Branch } from "@/lib/getBranches";

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
  cover_image: string;
  read_time: string;
  level: string;
};

export default function IntelligenceGrid({ posts, branches }: { posts: Post[], branches: Branch[] }) {
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
    <div className="space-y-6">

      {/* FILTERS */}
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/50 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search briefings..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-base text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
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

        {/* Branch pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveBranch(null)}
            className={`shrink-0 text-xs px-4 py-2.5 rounded-full font-bold uppercase tracking-widest border transition-all ${
              !activeBranch
                ? 'bg-white text-black border-white'
                : 'text-white/40 border-white/10 hover:border-white/30 hover:text-white/60'
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
                className="shrink-0 text-xs px-4 py-2.5 rounded-full font-bold uppercase tracking-widest border transition-all"
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

      {/* GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/30 text-sm font-bold uppercase tracking-widest">No briefings match.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((post, i) => {
            const b = branches.find(x => x.name === post.branch);
            const color = b?.color ?? '#3B82F6';
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  href={`/intelligence/${post.slug}`}
                  className="group flex flex-col bg-black border border-white/5 rounded-[1.75rem] hover:border-transparent transition-all duration-500 relative overflow-hidden"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    style={{
                      border: `1.5px solid ${color}45`,
                      boxShadow: `0 0 40px ${color}15`,
                      background: `radial-gradient(ellipse at 60% 0%, ${color}08, transparent 65%)`,
                    }}
                  />

                  {/* Cover image */}
                  <div className="w-full h-48 sm:h-52 shrink-0 overflow-hidden rounded-t-[1.75rem]">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${color}28 0%, #000000 100%)` }}
                      >
                        <span className="text-6xl font-black opacity-10 tracking-tight" style={{ color }}>
                          {post.branch?.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay at bottom of image */}
                    <div className="absolute top-0 left-0 right-0 h-48 sm:h-52 bg-gradient-to-b from-transparent via-transparent to-[#000000]/70 pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 sm:p-7 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-xs px-3 py-1.5 rounded-full tracking-widest uppercase font-bold border"
                        style={{
                          backgroundColor: `${color}15`,
                          color,
                          borderColor: `${color}35`,
                        }}
                      >
                        {post.branch}
                      </span>
                      {post.read_time && (
                        <span className="text-xs text-white/25 font-bold uppercase tracking-widest">
                          {post.read_time}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-3 group-hover:text-white/80 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-sm sm:text-base leading-relaxed line-clamp-2 mb-5 flex-1">
                      {post.summary || post.tldr || post.excerpt || post.description}
                    </p>

                    <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
                      <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 transition-colors">
                        Read Briefing →
                      </span>
                    </div>
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
