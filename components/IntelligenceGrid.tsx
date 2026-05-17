"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FilterPill from "@/components/ui/FilterPill";

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
  featured?: boolean;
};

function ArticleCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <Link
      href={`/intelligence/${post.slug}`}
      className="group flex flex-col sm:flex-row border-2 border-ps-white hover:border-ps-yellow hover:shadow-hard-yellow transition-all"
    >
      {/* Image */}
      <div className="relative w-full sm:w-56 md:w-72 aspect-[16/9] sm:aspect-auto sm:h-44 shrink-0 overflow-hidden bg-ps-black">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 300px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ps-yellow/10">
            <span className="font-display text-5xl text-ps-yellow/30 uppercase">{(post.branch || 'A')[0]}</span>
          </div>
        )}
      </div>

      {/* Text — outside/below image, no overlay */}
      <div className="flex flex-col justify-between p-4 flex-1 bg-ps-black">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="label-yellow">{post.branch || 'Article'}</span>
            {post.read_time && (
              <span className="text-ps-white/40 text-[10px] font-display uppercase tracking-wider">{post.read_time} min read</span>
            )}
          </div>
          <h3 className="font-display uppercase text-ps-white text-base leading-tight mb-2 group-hover:text-ps-yellow transition-colors">
            {post.title}
          </h3>
          <p className="text-ps-white/60 text-sm leading-relaxed line-clamp-3">
            {post.summary || post.tldr || post.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-ps-yellow text-[10px] font-display uppercase tracking-widest">
          Read article
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function IntelligenceGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const branchFilters = ['ALL', ...Array.from(new Set(posts.map(p => p.branch).filter(Boolean)))];

  const visible = activeFilter === 'ALL'
    ? posts
    : posts.filter(p => p.branch === activeFilter);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8 border-b-2 border-ps-white/20 pb-6">
        {branchFilters.map(b => (
          <FilterPill key={b} label={b} isActive={activeFilter === b} onClick={() => setActiveFilter(b)} />
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-16 border-2 border-ps-white">
          <p className="text-ps-white/40 font-display uppercase tracking-widest">No articles match</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 stagger">
          {visible.map((post, i) => (
            <ArticleCard key={post.slug} post={post} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
